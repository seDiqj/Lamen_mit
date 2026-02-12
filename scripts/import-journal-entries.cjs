const XLSX = require('xlsx');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function importJournalEntries() {
  const workbook = XLSX.readFile('attached_assets/LMIJournal_12-Feb-2026_Clean_1770873876294.xlsx');
  const sheet = workbook.Sheets['Clean'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  console.log(`Total rows in Excel: ${data.length}`);

  // Step 1: Clear existing journal data
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const deletedLines = await client.query('DELETE FROM journal_lines');
    console.log(`Deleted ${deletedLines.rowCount} journal lines`);
    const deletedEntries = await client.query('DELETE FROM journal_entries');
    console.log(`Deleted ${deletedEntries.rowCount} journal entries`);
    // Reset all account balances to 0
    await client.query('UPDATE accounts SET current_balance = 0');
    console.log('Reset all account balances to 0');
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to clear old data:', err);
    throw err;
  } finally {
    client.release();
  }

  // Get all accounts from database for mapping
  const accountsResult = await pool.query('SELECT id, account_code, account_name FROM accounts');
  const accountsMap = new Map();
  accountsResult.rows.forEach(acc => {
    accountsMap.set(acc.account_code, acc.id);
  });

  console.log(`Loaded ${accountsMap.size} accounts from database`);

  // Parse the Excel data - skip header row (index 0)
  // Group lines by JV Number
  const entriesMap = new Map();
  let skippedAccounts = new Set();
  let lastJvNumber = '';
  let lastTransactionDate = null;
  let lastTransactionType = '';

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const transactionDate = row[0];
    const transactionType = row[1];
    let jvNumber = String(row[2] || '').trim();
    const description = row[3] || '';
    const accountCode = String(row[4] || '').trim();
    const accountFullName = row[5] || '';
    const debit = parseFloat(row[6]) || 0;
    const credit = parseFloat(row[7]) || 0;

    // If JV number is empty, use the last non-empty JV number (continuation line)
    if (!jvNumber && lastJvNumber) {
      jvNumber = lastJvNumber;
    } else if (jvNumber) {
      lastJvNumber = jvNumber;
      lastTransactionDate = transactionDate;
      lastTransactionType = transactionType;
    }

    if (!jvNumber || !accountCode) continue;

    // Convert Excel date to JS date
    let entryDate;
    if (typeof transactionDate === 'number') {
      entryDate = new Date((transactionDate - 25569) * 86400 * 1000);
    } else if (typeof transactionDate === 'string') {
      // Handle MM/DD/YYYY format
      const parts = transactionDate.split('/');
      if (parts.length === 3) {
        entryDate = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
      } else {
        entryDate = new Date(transactionDate);
      }
    } else {
      entryDate = new Date();
    }

    // Use the date from the first line if this row's date is inherited
    if (!transactionDate && lastTransactionDate) {
      if (typeof lastTransactionDate === 'number') {
        entryDate = new Date((lastTransactionDate - 25569) * 86400 * 1000);
      } else if (typeof lastTransactionDate === 'string') {
        const parts = lastTransactionDate.split('/');
        if (parts.length === 3) {
          entryDate = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
        } else {
          entryDate = new Date(lastTransactionDate);
        }
      }
    }

    // Find account ID
    const accountId = accountsMap.get(accountCode);
    if (!accountId) {
      skippedAccounts.add(`${accountCode} - ${accountFullName}`);
      continue;
    }

    // Get or create entry group
    if (!entriesMap.has(jvNumber)) {
      entriesMap.set(jvNumber, {
        jvNumber,
        entryDate,
        transactionType: transactionType || lastTransactionType,
        description,
        lines: []
      });
    }

    const entry = entriesMap.get(jvNumber);
    entry.lines.push({
      accountId,
      accountCode,
      description: description || entry.description,
      debitAmount: debit.toFixed(2),
      creditAmount: credit.toFixed(2)
    });
  }

  console.log(`\nParsed ${entriesMap.size} journal entries`);
  
  if (skippedAccounts.size > 0) {
    console.log(`\nWARNING: ${skippedAccounts.size} account codes not found in database:`);
    [...skippedAccounts].slice(0, 30).forEach(acc => console.log(`  - ${acc}`));
    if (skippedAccounts.size > 30) {
      console.log(`  ... and ${skippedAccounts.size - 30} more`);
    }
  }

  // Insert entries into database
  const insertClient = await pool.connect();
  try {
    await insertClient.query('BEGIN');

    let insertedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    const entries = [...entriesMap.values()].sort((a, b) => parseInt(a.jvNumber) - parseInt(b.jvNumber));

    for (const entry of entries) {
      try {
        // Skip entries with less than 2 lines
        if (entry.lines.length < 2) {
          console.log(`Skipping JV ${entry.jvNumber}: less than 2 lines`);
          skippedCount++;
          continue;
        }

        // Calculate totals
        const totalDebit = entry.lines.reduce((sum, l) => sum + parseFloat(l.debitAmount), 0);
        const totalCredit = entry.lines.reduce((sum, l) => sum + parseFloat(l.creditAmount), 0);

        // Check balance
        if (Math.abs(totalDebit - totalCredit) > 0.01) {
          console.log(`Skipping JV ${entry.jvNumber}: unbalanced (D:${totalDebit.toFixed(2)} C:${totalCredit.toFixed(2)})`);
          skippedCount++;
          continue;
        }

        // Generate entry number
        const entryNumberResult = await insertClient.query(
          "SELECT COALESCE(MAX(CAST(SUBSTRING(entry_number FROM 4) AS INTEGER)), 0) + 1 as next_num FROM journal_entries WHERE entry_number LIKE 'JE-%'"
        );
        const nextNum = entryNumberResult.rows[0].next_num;
        const entryNumber = `JE-${String(nextNum).padStart(6, '0')}`;

        // Format date
        const formattedDate = entry.entryDate.toISOString().split('T')[0];

        // Map transaction type to reference type
        let referenceType = 'general';
        if (entry.transactionType === 'Invoice') {
          referenceType = 'financing_disbursement';
        } else if (entry.transactionType === 'Payment') {
          referenceType = 'financing_repayment';
        } else if (entry.transactionType === 'Journal Entry') {
          referenceType = 'journal_entry';
        }

        // Insert journal entry (as posted)
        const insertResult = await insertClient.query(
          `INSERT INTO journal_entries 
           (entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), $8)
           RETURNING id`,
          [
            entryNumber,
            formattedDate,
            entry.description || 'Imported entry',
            `JV-${entry.jvNumber}`,
            referenceType,
            totalDebit.toFixed(2),
            totalCredit.toFixed(2),
            'import-script'
          ]
        );

        const journalEntryId = insertResult.rows[0].id;

        // Insert lines
        for (const line of entry.lines) {
          await insertClient.query(
            `INSERT INTO journal_lines 
             (journal_entry_id, account_id, description, debit_amount, credit_amount)
             VALUES ($1, $2, $3, $4, $5)`,
            [journalEntryId, line.accountId, line.description, line.debitAmount, line.creditAmount]
          );
        }

        // Update account balances for posted entries
        for (const line of entry.lines) {
          const debit = parseFloat(line.debitAmount);
          const credit = parseFloat(line.creditAmount);
          
          // Get account type to determine balance direction
          const accResult = await insertClient.query('SELECT account_type FROM accounts WHERE id = $1', [line.accountId]);
          const accountType = accResult.rows[0]?.account_type;
          
          let balanceChange = 0;
          if (['asset', 'expense'].includes(accountType)) {
            balanceChange = debit - credit;
          } else {
            balanceChange = credit - debit;
          }
          
          await insertClient.query(
            'UPDATE accounts SET current_balance = COALESCE(current_balance, 0) + $1 WHERE id = $2',
            [balanceChange, line.accountId]
          );
        }

        insertedCount++;
        
        if (insertedCount % 100 === 0) {
          console.log(`Inserted ${insertedCount} entries...`);
        }
      } catch (err) {
        console.error(`Error inserting JV ${entry.jvNumber}:`, err.message);
        errorCount++;
      }
    }

    await insertClient.query('COMMIT');
    console.log(`\n=== Import Complete ===`);
    console.log(`Inserted: ${insertedCount} entries`);
    console.log(`Skipped: ${skippedCount} entries`);
    console.log(`Errors: ${errorCount}`);

  } catch (err) {
    await insertClient.query('ROLLBACK');
    console.error('Import failed:', err);
    throw err;
  } finally {
    insertClient.release();
  }

  await pool.end();
}

importJournalEntries().catch(console.error);
