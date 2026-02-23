-- Loan 1: 1021100218 - Margin 108,000
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount)
SELECT gen_random_uuid(), je.id, (SELECT id FROM accounts WHERE account_code = '20900'), 'Loan margin - Ihsanullah Khan Safi (1021100218)', '0', '108000.00'
FROM journal_entries je WHERE je.reference = '1021100218' AND je.reference_type = 'disbursement'
AND NOT EXISTS (SELECT 1 FROM journal_lines jl WHERE jl.journal_entry_id = je.id AND jl.account_id = (SELECT id FROM accounts WHERE account_code = '20900'));

UPDATE journal_lines SET debit_amount = '558000.00' WHERE journal_entry_id = (SELECT id FROM journal_entries WHERE reference = '1021100218' AND reference_type = 'disbursement') AND account_id = (SELECT id FROM accounts WHERE account_code = '11000') AND debit_amount::numeric > 0;

UPDATE journal_entries SET total_debit = '558000.00', total_credit = '558000.00' WHERE reference = '1021100218' AND reference_type = 'disbursement';

-- Loan 2: 1021100219 - Margin 8,000
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount)
SELECT gen_random_uuid(), je.id, (SELECT id FROM accounts WHERE account_code = '20900'), 'Loan margin - (1021100219)', '0', '8000.00'
FROM journal_entries je WHERE je.reference = '1021100219' AND je.reference_type = 'disbursement'
AND NOT EXISTS (SELECT 1 FROM journal_lines jl WHERE jl.journal_entry_id = je.id AND jl.account_id = (SELECT id FROM accounts WHERE account_code = '20900'));

UPDATE journal_lines SET debit_amount = '58000.00' WHERE journal_entry_id = (SELECT id FROM journal_entries WHERE reference = '1021100219' AND reference_type = 'disbursement') AND account_id = (SELECT id FROM accounts WHERE account_code = '11000') AND debit_amount::numeric > 0;

UPDATE journal_entries SET total_debit = '58000.00', total_credit = '58000.00' WHERE reference = '1021100219' AND reference_type = 'disbursement';

-- Loan 3: 1021100220 - Margin 14,400
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount)
SELECT gen_random_uuid(), je.id, (SELECT id FROM accounts WHERE account_code = '20900'), 'Loan margin - Ebadullah Momand (1021100220)', '0', '14400.00'
FROM journal_entries je WHERE je.reference = '1021100220' AND je.reference_type = 'disbursement'
AND NOT EXISTS (SELECT 1 FROM journal_lines jl WHERE jl.journal_entry_id = je.id AND jl.account_id = (SELECT id FROM accounts WHERE account_code = '20900'));

UPDATE journal_lines SET debit_amount = '104400.00' WHERE journal_entry_id = (SELECT id FROM journal_entries WHERE reference = '1021100220' AND reference_type = 'disbursement') AND account_id = (SELECT id FROM accounts WHERE account_code = '11000') AND debit_amount::numeric > 0;

UPDATE journal_entries SET total_debit = '104400.00', total_credit = '104400.00' WHERE reference = '1021100220' AND reference_type = 'disbursement';

-- Verify results
SELECT je.entry_number, je.reference, a.account_code, a.account_name, jl.debit_amount, jl.credit_amount
FROM journal_entries je
JOIN journal_lines jl ON jl.journal_entry_id = je.id
JOIN accounts a ON a.id = jl.account_id
WHERE je.reference IN ('1021100218', '1021100219', '1021100220') AND je.reference_type = 'disbursement'
ORDER BY je.reference, jl.debit_amount DESC;
