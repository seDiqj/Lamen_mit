-- ============================================
-- Fix Disbursement Journal Entries
-- Add margin credit to account 20900 for 3 loans
-- Loans: 1021100218, 1021100219, 1021100220
-- Date: 2026-02-23
-- ============================================

BEGIN;

-- Loan 1: 1021100218 - Ihsanullah Khan Safi
-- Principal: 450,000 | Margin: 108,000 (450000 * 16% / 12 * 18) | Total Receivable: 558,000
-- Disbursed: 2026-02-22

-- Step 1a: Add margin credit line to account 20900
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount)
SELECT
  gen_random_uuid(),
  je.id,
  (SELECT id FROM accounts WHERE account_code = '20900'),
  'Loan margin - Ihsanullah Khan Safi (1021100218)',
  '0',
  '108000.00'
FROM journal_entries je
WHERE je.reference = '1021100218' AND je.reference_type = 'disbursement'
AND NOT EXISTS (
  SELECT 1 FROM journal_lines jl
  WHERE jl.journal_entry_id = je.id
  AND jl.account_id = (SELECT id FROM accounts WHERE account_code = '20900')
);

-- Step 1b: Update debit line (11000) to include margin
UPDATE journal_lines
SET debit_amount = '558000.00'
WHERE journal_entry_id = (
  SELECT id FROM journal_entries WHERE reference = '1021100218' AND reference_type = 'disbursement'
)
AND account_id = (SELECT id FROM accounts WHERE account_code = '11000')
AND debit_amount::numeric > 0;

-- Step 1c: Update journal entry totals
UPDATE journal_entries
SET total_debit = '558000.00', total_credit = '558000.00'
WHERE reference = '1021100218' AND reference_type = 'disbursement';


-- Loan 2: 1021100219 - Kunar Branch Customer
-- Principal: 50,000 | Margin: 8,000 (50000 * 16% / 12 * 12) | Total Receivable: 58,000
-- Disbursed: 2026-02-22

-- Step 2a: Add margin credit line to account 20900
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount)
SELECT
  gen_random_uuid(),
  je.id,
  (SELECT id FROM accounts WHERE account_code = '20900'),
  'Loan margin - (1021100219)',
  '0',
  '8000.00'
FROM journal_entries je
WHERE je.reference = '1021100219' AND je.reference_type = 'disbursement'
AND NOT EXISTS (
  SELECT 1 FROM journal_lines jl
  WHERE jl.journal_entry_id = je.id
  AND jl.account_id = (SELECT id FROM accounts WHERE account_code = '20900')
);

-- Step 2b: Update debit line (11000) to include margin
UPDATE journal_lines
SET debit_amount = '58000.00'
WHERE journal_entry_id = (
  SELECT id FROM journal_entries WHERE reference = '1021100219' AND reference_type = 'disbursement'
)
AND account_id = (SELECT id FROM accounts WHERE account_code = '11000')
AND debit_amount::numeric > 0;

-- Step 2c: Update journal entry totals
UPDATE journal_entries
SET total_debit = '58000.00', total_credit = '58000.00'
WHERE reference = '1021100219' AND reference_type = 'disbursement';


-- Loan 3: 1021100220 - Ebadullah Momand
-- Principal: 90,000 | Margin: 14,400 (90000 * 16% / 12 * 12) | Total Receivable: 104,400
-- Disbursed: 2026-02-22

-- Step 3a: Add margin credit line to account 20900
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount)
SELECT
  gen_random_uuid(),
  je.id,
  (SELECT id FROM accounts WHERE account_code = '20900'),
  'Loan margin - Ebadullah Momand (1021100220)',
  '0',
  '14400.00'
FROM journal_entries je
WHERE je.reference = '1021100220' AND je.reference_type = 'disbursement'
AND NOT EXISTS (
  SELECT 1 FROM journal_lines jl
  WHERE jl.journal_entry_id = je.id
  AND jl.account_id = (SELECT id FROM accounts WHERE account_code = '20900')
);

-- Step 3b: Update debit line (11000) to include margin
UPDATE journal_lines
SET debit_amount = '104400.00'
WHERE journal_entry_id = (
  SELECT id FROM journal_entries WHERE reference = '1021100220' AND reference_type = 'disbursement'
)
AND account_id = (SELECT id FROM accounts WHERE account_code = '11000')
AND debit_amount::numeric > 0;

-- Step 3c: Update journal entry totals
UPDATE journal_entries
SET total_debit = '104400.00', total_credit = '104400.00'
WHERE reference = '1021100220' AND reference_type = 'disbursement';


-- Verification: Check the updated journal entries
SELECT je.entry_number, je.reference, je.description, je.total_debit, je.total_credit,
       a.account_code, a.account_name, jl.debit_amount, jl.credit_amount, jl.description as line_desc
FROM journal_entries je
JOIN journal_lines jl ON jl.journal_entry_id = je.id
JOIN accounts a ON a.id = jl.account_id
WHERE je.reference IN ('1021100218', '1021100219', '1021100220')
AND je.reference_type = 'disbursement'
ORDER BY je.reference, jl.debit_amount DESC;

COMMIT;
