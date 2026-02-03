const XLSX = require('xlsx');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function importJournalEntries() {
  const workbook = XLSX.readFile('attached_assets/JVEntry_1770113033731.xlsx');
  const sheet = workbook.Sheets['JVEntry'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Get all accounts from database for mapping
  const accountsResult = await pool.query('SELECT id, account_code, account_name FROM accounts');
  const accountsMap = new Map();
  accountsResult.rows.forEach(acc => {
    accountsMap.set(acc.account_code, acc.id);
  });

  console.log(`Loaded ${accountsMap.size} accounts from database`);

  // Parse the Excel data
  // Structure: rows starting from row 6 (index 5)
  // Each entry group starts with just a number, followed by detail lines, then "Total for X"
  
  const entries = [];
  let currentEntry = null;
  let skippedAccounts = new Set();
  let rowsProcessed = 0;

  for (let i = 5; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const firstCell = String(row[0] || '').trim();
    
    // Skip "Total for X" rows
    if (firstCell.startsWith('Total for')) {
      if (currentEntry && currentEntry.lines.length > 0) {
        entries.push(currentEntry);
      }
      currentEntry = null;
      continue;
    }

    // Skip header rows and empty rows
    if (firstCell === 'TOTAL' || firstCell === '' && !row[1]) continue;

    // Check if this is a new entry group (just a number in first column)
    if (/^\d+$/.test(firstCell) && !row[1]) {
      if (currentEntry && currentEntry.lines.length > 0) {
        entries.push(currentEntry);
      }
      currentEntry = {
        groupId: firstCell,
        lines: []
      };
      continue;
    }

    // This is a detail line
    if (currentEntry && row[1]) {
      const transactionDate = row[1]; // Excel date or string
      const transactionType = row[2];
      const jvNumber = row[3] || '';
      const description = row[4] || '';
      const accountCode = String(row[5] || '').trim();
      const accountFullName = row[6] || '';
      const debit = parseFloat(row[7]) || 0;
      const credit = parseFloat(row[8]) || 0;

      // Convert Excel date to JS date
      let entryDate;
      if (typeof transactionDate === 'number') {
        // Excel date serial number
        entryDate = new Date((transactionDate - 25569) * 86400 * 1000);
      } else if (typeof transactionDate === 'string') {
        entryDate = new Date(transactionDate);
      } else {
        entryDate = new Date();
      }

      // Find account ID
      const accountId = accountsMap.get(accountCode);
      if (!accountId) {
        skippedAccounts.add(accountCode);
        continue;
      }

      // Set entry header info from first line
      if (currentEntry.lines.length === 0) {
        currentEntry.entryDate = entryDate;
        currentEntry.transactionType = transactionType;
        currentEntry.jvNumber = jvNumber;
        currentEntry.description = description;
      } else if (description && !currentEntry.description) {
        currentEntry.description = description;
      }

      currentEntry.lines.push({
        accountId,
        accountCode,
        description: description || currentEntry.description,
        debitAmount: debit.toFixed(2),
        creditAmount: credit.toFixed(2)
      });

      rowsProcessed++;
    }
  }

  // Don't forget the last entry
  if (currentEntry && currentEntry.lines.length > 0) {
    entries.push(currentEntry);
  }

  console.log(`Parsed ${entries.length} journal entries from ${rowsProcessed} detail rows`);
  
  if (skippedAccounts.size > 0) {
    console.log(`\nWARNING: ${skippedAccounts.size} account codes not found in database:`);
    console.log([...skippedAccounts].slice(0, 20).join(', '));
    if (skippedAccounts.size > 20) {
      console.log(`... and ${skippedAccounts.size - 20} more`);
    }
  }

  // Insert entries into database
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let insertedCount = 0;
    let errorCount = 0;

    for (const entry of entries) {
      try {
        // Skip entries with no valid lines
        if (entry.lines.length < 2) {
          console.log(`Skipping entry ${entry.groupId}: less than 2 lines`);
          continue;
        }

        // Calculate totals
        const totalDebit = entry.lines.reduce((sum, l) => sum + parseFloat(l.debitAmount), 0);
        const totalCredit = entry.lines.reduce((sum, l) => sum + parseFloat(l.creditAmount), 0);

        // Check balance
        if (Math.abs(totalDebit - totalCredit) > 0.01) {
          console.log(`Skipping entry ${entry.groupId}: unbalanced (D:${totalDebit} C:${totalCredit})`);
          continue;
        }

        // Generate entry number
        const entryNumberResult = await client.query(
          "SELECT COALESCE(MAX(CAST(SUBSTRING(entry_number FROM 4) AS INTEGER)), 0) + 1 as next_num FROM journal_entries WHERE entry_number LIKE 'JE-%'"
        );
        const nextNum = entryNumberResult.rows[0].next_num;
        const entryNumber = `JE-${String(nextNum).padStart(6, '0')}`;

        // Format date
        const formattedDate = entry.entryDate.toISOString().split('T')[0];

        // Determine reference type
        let referenceType = 'general';
        if (entry.transactionType === 'Payment') {
          referenceType = 'payment';
        } else if (entry.jvNumber) {
          referenceType = 'manual';
        }

        // Insert journal entry
        const insertResult = await client.query(
          `INSERT INTO journal_entries 
           (entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8)
           RETURNING id`,
          [
            entryNumber,
            formattedDate,
            entry.description || 'Imported entry',
            entry.jvNumber || null,
            referenceType,
            totalDebit.toFixed(2),
            totalCredit.toFixed(2),
            'import-script'
          ]
        );

        const journalEntryId = insertResult.rows[0].id;

        // Insert lines
        for (const line of entry.lines) {
          await client.query(
            `INSERT INTO journal_lines 
             (journal_entry_id, account_id, description, debit_amount, credit_amount)
             VALUES ($1, $2, $3, $4, $5)`,
            [journalEntryId, line.accountId, line.description, line.debitAmount, line.creditAmount]
          );
        }

        insertedCount++;
        
        if (insertedCount % 100 === 0) {
          console.log(`Inserted ${insertedCount} entries...`);
        }
      } catch (err) {
        console.error(`Error inserting entry ${entry.groupId}:`, err.message);
        errorCount++;
      }
    }

    await client.query('COMMIT');
    console.log(`\nImport complete!`);
    console.log(`Inserted: ${insertedCount} entries`);
    console.log(`Errors: ${errorCount}`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Import failed:', err);
    throw err;
  } finally {
    client.release();
  }

  await pool.end();
}

importJournalEntries().catch(console.error);
