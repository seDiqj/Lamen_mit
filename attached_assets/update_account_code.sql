-- =====================================================================
-- Safely update an account's code
-- =====================================================================
-- Journal lines link to accounts by ID (UUID), so historical entries,
-- balances, and ledger reports are NOT affected by a code change.
--
-- Things this script also handles:
--   * The unique constraint on accounts.account_code
--   * financing_products.receivable_account_code (stored as a code string,
--     not an ID — used when posting disbursement journals)
--
-- WARNING: Some DAB / regulatory reports group accounts by code prefix
-- (e.g. "10" cash, "11" receivables, "5" income, "51" cost of sales,
-- "301" share capital, "30400" dividends). If you change the leading
-- digits of a code, those reports may misclassify the account.
--
-- USAGE:
--   1. Edit the two values in the variables block below.
--   2. Run the whole script. It is wrapped in a transaction.
--   3. Review the SELECT output at the end; if it looks correct, commit.
--      If anything looks wrong, run ROLLBACK; instead of COMMIT;
-- =====================================================================

BEGIN;

-- -------- EDIT THESE TWO VALUES --------
-- old code (current value in the database)
-- new code (must not already exist on another account)
WITH params AS (
  SELECT
    '10101'::varchar AS old_code,
    '10110'::varchar AS new_code
)

-- Safety checks: verify old code exists and new code is free
SELECT
  (SELECT COUNT(*) FROM accounts, params WHERE account_code = params.old_code) AS old_code_found,
  (SELECT COUNT(*) FROM accounts, params WHERE account_code = params.new_code) AS new_code_already_used;
-- Expect: old_code_found = 1, new_code_already_used = 0
-- If new_code_already_used > 0, ROLLBACK and pick a different new code.

-- -------- Perform the update --------
-- 1) Update the account row itself
UPDATE accounts
SET account_code = '10110',          -- <-- new_code
    updated_at = NOW()
WHERE account_code = '10101';        -- <-- old_code

-- 2) Update any financing product that referenced the old code as its
--    receivable account (so future disbursement journals stay correct)
UPDATE financing_products
SET receivable_account_code = '10110'   -- <-- new_code
WHERE receivable_account_code = '10101'; -- <-- old_code

-- -------- Review --------
SELECT id, account_code, account_name, account_type, parent_id
FROM accounts
WHERE account_code IN ('10110');     -- <-- new_code

SELECT id, name, code, receivable_account_code
FROM financing_products
WHERE receivable_account_code = '10110'; -- <-- new_code

-- If everything looks correct:
COMMIT;

-- If something looks wrong, run this instead (in the same session):
-- ROLLBACK;
