-- =====================================================================
-- Safely update an account's code
-- =====================================================================
-- Journal lines link to accounts by ID (UUID), so historical entries,
-- balances, and ledger reports are NOT affected by a code change.
--
-- This script also updates financing_products.receivable_account_code
-- (the only place an account code is stored as text instead of an ID).
--
-- WARNING: Some DAB / regulatory reports group accounts by code prefix
-- (e.g. "10" cash, "11" receivables, "5" income, "51" cost of sales,
-- "301" share capital, "30400" dividends). If you change the leading
-- digits of a code, those reports may misclassify the account.
--
-- USAGE (psql):
--   psql "$DATABASE_URL" \
--        -v old_code="'10101'" \
--        -v new_code="'10110'" \
--        -f update_account_code.sql
--
-- Or set them inline at the top of a psql session:
--   \set old_code '''10101'''
--   \set new_code '''10110'''
--   \i update_account_code.sql
-- =====================================================================

\echo 'Old code:' :old_code
\echo 'New code:' :new_code

BEGIN;

-- -------- Safety checks --------
-- Expect: old_code_found = 1, new_code_already_used = 0
SELECT
  (SELECT COUNT(*) FROM accounts WHERE account_code = :old_code) AS old_code_found,
  (SELECT COUNT(*) FROM accounts WHERE account_code = :new_code) AS new_code_already_used;

-- -------- Perform the update --------

-- 1) Update the account row itself
UPDATE accounts
SET account_code = :new_code,
    updated_at   = NOW()
WHERE account_code = :old_code;

-- 2) Update any financing product that referenced the old code as its
--    receivable account (so future disbursement journals stay correct)
UPDATE financing_products
SET receivable_account_code = :new_code
WHERE receivable_account_code = :old_code;

-- -------- Review --------
SELECT id, account_code, account_name, account_type, parent_id
FROM accounts
WHERE account_code = :new_code;

SELECT id, name, code, receivable_account_code
FROM financing_products
WHERE receivable_account_code = :new_code;

-- If everything looks correct:
COMMIT;

-- If something looks wrong, run this instead (in the same session):
-- ROLLBACK;
