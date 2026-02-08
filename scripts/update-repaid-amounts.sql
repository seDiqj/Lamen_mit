-- ============================================================
-- UPDATE SCRIPT: Correct Total Repaid Amounts
-- ============================================================
-- APPROACH:
-- For each loan, 8 installments are marked as paid.
-- Installments 1-7 already have amounts set.
-- Installment #8 currently has 0 or NULL total_amount.
-- We update ONLY installment #8's total_amount so that:
--   SUM(installments 1-8) = Corrected Total Repaid
-- Formula: inst_8_amount = corrected_total - sum_of_inst_1_to_7
-- ============================================================

-- First, let's verify current state (READ-ONLY query):
-- Run this SELECT first to verify before applying updates:

SELECT 
  c.application_id,
  c.corrected_total,
  COALESCE(SUM(CASE WHEN i.is_paid = true AND i.installment_number < 8 
    THEN COALESCE(CAST(i.total_amount AS numeric), 0) ELSE 0 END), 0) as sum_inst_1_to_7,
  c.corrected_total - COALESCE(SUM(CASE WHEN i.is_paid = true AND i.installment_number < 8 
    THEN COALESCE(CAST(i.total_amount AS numeric), 0) ELSE 0 END), 0) as new_inst_8_amount,
  COALESCE(SUM(CASE WHEN i.is_paid = true 
    THEN COALESCE(CAST(i.total_amount AS numeric), 0) ELSE 0 END), 0) as current_db_total
FROM (VALUES
  ('1011100012', 2000),
  ('1011100013', 4720),
  ('1021100173', 5410),
  ('1021100178', 36250),
  ('1021100146', 4040),
  ('1021100139', 11539),
  ('1021100131', 4720),
  ('1021100136', 8070),
  ('1021100174', 32433),
  ('1021100176', 16590),
  ('1021100142', 3580),
  ('1021100160', 10400),
  ('1021100181', 9680),
  ('1021100177', 13540),
  ('1021100172', 4720),
  ('1021100175', 38680),
  ('1021100129', 7920),
  ('1021100188', 7733),
  ('1021100189', 10960),
  ('1021100163', 12380),
  ('1021100153', 9680),
  ('1021100102', 69600),
  ('1021100186', 9680),
  ('1021100190', 16110),
  ('1021100157', 7740),
  ('1021100120', 9920),
  ('1021100130', 6310),
  ('1021100170', 4470),
  ('1021100169', 16090),
  ('1021100127', 6420),
  ('1021100138', 11805),
  ('1021100179', 38666),
  ('1021100147', 3770),
  ('1021100145', 3590),
  ('1021100158', 4835),
  ('1021100135', 13285),
  ('1021100152', 9677),
  ('1021100151', 13920),
  ('1021100171', 38680),
  ('1021100187', 5420),
  ('1021100137', 23740),
  ('1021100144', 8850),
  ('1021100185', 19335),
  ('1021100161', 4360),
  ('1021100143', 9680),
  ('1031100023', 7733),
  ('1031100001', 6050),
  ('1031100022', 6765),
  ('1031100014', 11266),
  ('1031100009', 11600),
  ('1031100019', 7000),
  ('1031100012', 12000),
  ('1031100005', 6766),
  ('1031100015', 5800),
  ('1031100017', 6630)
) AS c(application_id, corrected_total)
LEFT JOIN loans l ON l.application_id = c.application_id
LEFT JOIN installments i ON i.loan_id = l.id
GROUP BY c.application_id, c.corrected_total
ORDER BY c.application_id;


-- ============================================================
-- ACTUAL UPDATE STATEMENTS
-- Only run these AFTER verifying the SELECT above is correct
-- ============================================================

BEGIN;

-- Update installment #8 for each loan to make total match corrected amount
-- Formula: new_inst_8_total = corrected_total - sum_of_installments_1_to_7

UPDATE installments SET total_amount = (2000 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1011100012') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1011100012') AND installment_number = 8;

UPDATE installments SET total_amount = (4720 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1011100013') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1011100013') AND installment_number = 8;

UPDATE installments SET total_amount = (5410 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100173') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100173') AND installment_number = 8;

UPDATE installments SET total_amount = (36250 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100178') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100178') AND installment_number = 8;

UPDATE installments SET total_amount = (4040 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100146') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100146') AND installment_number = 8;

UPDATE installments SET total_amount = (11539 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100139') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100139') AND installment_number = 8;

UPDATE installments SET total_amount = (4720 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100131') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100131') AND installment_number = 8;

UPDATE installments SET total_amount = (8070 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100136') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100136') AND installment_number = 8;

UPDATE installments SET total_amount = (32433 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100174') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100174') AND installment_number = 8;

UPDATE installments SET total_amount = (16590 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100176') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100176') AND installment_number = 8;

UPDATE installments SET total_amount = (3580 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100142') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100142') AND installment_number = 8;

UPDATE installments SET total_amount = (10400 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100160') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100160') AND installment_number = 8;

UPDATE installments SET total_amount = (9680 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100181') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100181') AND installment_number = 8;

UPDATE installments SET total_amount = (13540 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100177') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100177') AND installment_number = 8;

UPDATE installments SET total_amount = (4720 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100172') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100172') AND installment_number = 8;

UPDATE installments SET total_amount = (38680 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100175') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100175') AND installment_number = 8;

UPDATE installments SET total_amount = (7920 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100129') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100129') AND installment_number = 8;

UPDATE installments SET total_amount = (7733 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100188') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100188') AND installment_number = 8;

UPDATE installments SET total_amount = (10960 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100189') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100189') AND installment_number = 8;

UPDATE installments SET total_amount = (12380 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100163') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100163') AND installment_number = 8;

UPDATE installments SET total_amount = (9680 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100153') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100153') AND installment_number = 8;

UPDATE installments SET total_amount = (9680 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100186') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100186') AND installment_number = 8;

UPDATE installments SET total_amount = (16110 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100190') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100190') AND installment_number = 8;

UPDATE installments SET total_amount = (7740 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100157') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100157') AND installment_number = 8;

UPDATE installments SET total_amount = (9920 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100120') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100120') AND installment_number = 8;

UPDATE installments SET total_amount = (6310 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100130') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100130') AND installment_number = 8;

UPDATE installments SET total_amount = (4470 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100170') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100170') AND installment_number = 8;

UPDATE installments SET total_amount = (16090 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100169') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100169') AND installment_number = 8;

UPDATE installments SET total_amount = (6420 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100127') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100127') AND installment_number = 8;

UPDATE installments SET total_amount = (11805 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100138') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100138') AND installment_number = 8;

UPDATE installments SET total_amount = (38666 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100179') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100179') AND installment_number = 8;

UPDATE installments SET total_amount = (3770 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100147') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100147') AND installment_number = 8;

UPDATE installments SET total_amount = (3590 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100145') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100145') AND installment_number = 8;

UPDATE installments SET total_amount = (4835 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100158') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100158') AND installment_number = 8;

UPDATE installments SET total_amount = (10830 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100135') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100135') AND installment_number = 8;

UPDATE installments SET total_amount = (13285 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100152') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100152') AND installment_number = 8;

UPDATE installments SET total_amount = (9677 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100151') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100151') AND installment_number = 8;

UPDATE installments SET total_amount = (13920 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100171') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100171') AND installment_number = 8;

UPDATE installments SET total_amount = (38680 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100187') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100187') AND installment_number = 8;

UPDATE installments SET total_amount = (5420 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100137') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100137') AND installment_number = 8;

UPDATE installments SET total_amount = (9680 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100144') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100144') AND installment_number = 8;

UPDATE installments SET total_amount = (23740 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100185') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100185') AND installment_number = 8;

UPDATE installments SET total_amount = (15480 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100161') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100161') AND installment_number = 8;

UPDATE installments SET total_amount = (8850 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100143') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1021100143') AND installment_number = 8;

UPDATE installments SET total_amount = (19335 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100023') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100023') AND installment_number = 8;

UPDATE installments SET total_amount = (4360 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100001') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100001') AND installment_number = 8;

UPDATE installments SET total_amount = (7733 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100022') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100022') AND installment_number = 8;

UPDATE installments SET total_amount = (6050 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100014') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100014') AND installment_number = 8;

UPDATE installments SET total_amount = (6765 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100009') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100009') AND installment_number = 8;

UPDATE installments SET total_amount = (11266 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100019') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100019') AND installment_number = 8;

UPDATE installments SET total_amount = (11600 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100012') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100012') AND installment_number = 8;

UPDATE installments SET total_amount = (7000 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100005') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100005') AND installment_number = 8;

UPDATE installments SET total_amount = (6766 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100015') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100015') AND installment_number = 8;

UPDATE installments SET total_amount = (5800 - (SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) FROM installments WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100017') AND installment_number < 8 AND is_paid = true))::text WHERE loan_id = (SELECT id FROM loans WHERE application_id = '1031100017') AND installment_number = 8;

-- Verify after update:
-- SELECT l.application_id, 
--   SUM(CASE WHEN i.is_paid = true THEN CAST(i.total_amount AS numeric) ELSE 0 END) as new_total
-- FROM loans l JOIN installments i ON i.loan_id = l.id
-- WHERE l.application_id IN ('1011100012','1011100013', ... )
-- GROUP BY l.application_id ORDER BY l.application_id;

COMMIT;
