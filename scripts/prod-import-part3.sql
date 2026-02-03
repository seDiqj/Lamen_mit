BEGIN;
-- Entry: JV-755
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('daf6fb4d-c040-49ce-b60a-20419a844aeb', 'JE-000801', '2025-11-03', 'Paid for the purchase of cartridge for the office', 'JV-JV-755', 'journal_entry', 900.00, 900.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '076eae31-d256-4d7d-be23-3ce4da97af32', 'daf6fb4d-c040-49ce-b60a-20419a844aeb', id, 'Paid for the purchase of cartridge for the office', 900.00, 0.00 FROM accounts WHERE account_code = '60502';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3492ad86-00d5-4381-b5d4-b2c064394b64', 'daf6fb4d-c040-49ce-b60a-20419a844aeb', id, 'Paid for the purchase of cartridge for the office', 0.00, 900.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-756
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('256a9db5-07cc-4926-ae0a-2aecc4442c44', 'JE-000802', '2025-11-03', 'Paid for the staff lunch expense', 'JV-JV-756', 'journal_entry', 700.00, 700.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bf10bcf2-4f49-42f1-be10-ad4d230e8d96', '256a9db5-07cc-4926-ae0a-2aecc4442c44', id, 'Paid for the staff lunch expense', 700.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e37dba85-5951-4bf3-b33c-3a059ab2bb01', '256a9db5-07cc-4926-ae0a-2aecc4442c44', id, 'Paid for the staff lunch expense', 0.00, 700.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-757
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('88bb8bff-8600-4907-8692-a45b8720ec5e', 'JE-000803', '2025-11-03', 'Paid for the purchase of lock the office basement door', 'JV-JV-757', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '670bfa92-f63c-4d07-9079-4f6cfe36401e', '88bb8bff-8600-4907-8692-a45b8720ec5e', id, 'Paid for the purchase of lock the office basement door', 300.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3a064090-dcde-488a-848c-9523cc5ade80', '88bb8bff-8600-4907-8692-a45b8720ec5e', id, 'Paid for the purchase of lock the office basement door', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-758
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('da6186cb-2f05-4106-9f9e-3b5a4730a747', 'JE-000804', '2025-11-04', 'Paid for the staff lunch expense', 'JV-JV-758', 'journal_entry', 350.00, 350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '002d5a48-accf-4d04-9c74-0f1047754330', 'da6186cb-2f05-4106-9f9e-3b5a4730a747', id, 'Paid for the staff lunch expense', 350.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e21a2dc2-a645-46f6-aa2b-cdb7124ff880', 'da6186cb-2f05-4106-9f9e-3b5a4730a747', id, 'Paid for the staff lunch expense', 0.00, 350.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-759
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7cc0da4a-be7c-4d50-b333-c5f8a2f227ce', 'JE-000805', '2025-11-04', 'Paid for the breads used during the month of Oct 2025', 'JV-JV-759', 'journal_entry', 3350.00, 3350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2eeeeea5-3245-4fa8-80be-f996f11146d8', '7cc0da4a-be7c-4d50-b333-c5f8a2f227ce', id, 'Paid for the breads used during the month of Oct 2025', 3350.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '959d3e1b-c2f8-4f32-bb86-18397de5d100', '7cc0da4a-be7c-4d50-b333-c5f8a2f227ce', id, 'Paid for the breads used during the month of Oct 2025', 0.00, 3350.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-760
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6a11dc08-9bde-467b-88e7-b0c3db6506a6', 'JE-000806', '2025-11-05', 'Paid for the staff lunch', 'JV-JV-760', 'journal_entry', 620.00, 620.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '06b06153-0a60-4715-a854-81a75ce13900', '6a11dc08-9bde-467b-88e7-b0c3db6506a6', id, 'Paid for the staff lunch', 450.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '447c2c6e-2dbe-4b0e-a972-a0160d47e8a0', '6a11dc08-9bde-467b-88e7-b0c3db6506a6', id, 'Paid for the staff tea', 170.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cd82cf7f-1927-4bfd-94eb-a67aaa16bbae', '6a11dc08-9bde-467b-88e7-b0c3db6506a6', id, 'Paid for the staff tea and lunch', 0.00, 620.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-761
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9f7d530e-9b3a-4916-a309-2c77840477ea', 'JE-000807', '2025-11-07', 'Paid for the staff lunch expense', 'JV-JV-761', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '66673bb4-ec7e-4059-a539-e13add84faf0', '9f7d530e-9b3a-4916-a309-2c77840477ea', id, 'Paid for the staff lunch expense', 300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '76102dc3-0320-41b9-b16d-a3710326e403', '9f7d530e-9b3a-4916-a309-2c77840477ea', id, 'Paid for the staff lunch expense', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-762
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('58b3c3ae-fb90-4fb9-b578-900fe9cb408c', 'JE-000808', '2025-11-08', 'Paid for the staff lunch expense', 'JV-JV-762', 'journal_entry', 2110.00, 2110.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2474cdd0-8f77-4794-9931-4d5e9f9a6831', '58b3c3ae-fb90-4fb9-b578-900fe9cb408c', id, 'Paid for the staff lunch expense', 900.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1589c56a-ae8b-4614-ae09-885a984e3f39', '58b3c3ae-fb90-4fb9-b578-900fe9cb408c', id, 'Paid for the staff lunch expense', 0.00, 900.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '418d857f-6530-4280-a631-301502fe53b2', '58b3c3ae-fb90-4fb9-b578-900fe9cb408c', id, 'Received the second installment', 1210.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8ec1c7b9-482e-421c-911e-c6afd49a103f', '58b3c3ae-fb90-4fb9-b578-900fe9cb408c', id, '', 0.00, 1210.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-764
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('32fd26ec-4e01-4248-8365-74e4f5022476', 'JE-000809', '2025-11-08', 'Received second installment from Abdul Ghafar Payenda khil', 'JV-JV-764', 'journal_entry', 218.00, 218.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4cb157e7-b9b7-40dc-b8a0-4a73e9699bb9', '32fd26ec-4e01-4248-8365-74e4f5022476', id, 'Received second installment from Abdul Ghafar Payenda khil', 218.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0fdb65e3-d933-4fdd-a744-cea8dcc10bf6', '32fd26ec-4e01-4248-8365-74e4f5022476', id, 'Received second installment from Abdul Ghafar Payenda khil', 0.00, 218.00 FROM accounts WHERE account_code = '50300';

-- Entry: JV-763
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('dc891682-4bda-42d2-9c39-adf25d909c75', 'JE-000810', '2025-11-09', 'Paid for the staff lunch expense', 'JV-JV-763', 'journal_entry', 730.00, 730.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '824382ef-e533-4fb7-b09f-b588106c3fd9', 'dc891682-4bda-42d2-9c39-adf25d909c75', id, 'Paid for the staff lunch expense', 730.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ca72eedb-c58c-4e4e-a4fc-4529b0cb0c00', 'dc891682-4bda-42d2-9c39-adf25d909c75', id, 'Paid for the staff lunch expense', 0.00, 730.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-765
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c1d0d796-9831-4a51-8445-dd8b564327c8', 'JE-000811', '2025-11-09', 'Cash Received CR# 92 for Oct 2025 staff salary', 'JV-JV-765', 'journal_entry', 122000.00, 122000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c58491d-7578-4bba-8fef-878a95a27e91', 'c1d0d796-9831-4a51-8445-dd8b564327c8', id, 'Cash Received CR# 92 for Oct 2025 staff salary', 122000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f0a96362-96cf-4d72-b3b8-f8125a09765e', 'c1d0d796-9831-4a51-8445-dd8b564327c8', id, 'Cash Received CR# 92 for Oct 2025 staff salary', 0.00, 122000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-766
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5461b87c-82ed-4c3a-bc86-383c5f32e659', 'JE-000812', '2025-11-09', 'Salary paid for the month of Oct 2025', 'JV-JV-766', 'journal_entry', 126080.00, 126080.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd7138648-173f-4eab-9e22-55d77622b972', '5461b87c-82ed-4c3a-bc86-383c5f32e659', id, 'Salary paid for the month of Oct 2025', 23600.00, 0.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '47f9f7e4-d80e-42af-86cd-e7847270533d', '5461b87c-82ed-4c3a-bc86-383c5f32e659', id, 'Salary paid for the month of Oct 2025', 23600.00, 0.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fc3b62a0-382d-456f-865e-8d84f779d68e', '5461b87c-82ed-4c3a-bc86-383c5f32e659', id, 'Salary paid for the month of Oct 2025', 30000.00, 0.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2ceea2d0-4b71-479f-91d6-876a22703fd7', '5461b87c-82ed-4c3a-bc86-383c5f32e659', id, 'Salary paid for the month of Oct 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0469aa7c-2d35-4d82-87a4-299b7ebc2c19', '5461b87c-82ed-4c3a-bc86-383c5f32e659', id, 'Salary paid for the month of Oct 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9a8ec152-d0cf-479f-a02f-15c288ed0051', '5461b87c-82ed-4c3a-bc86-383c5f32e659', id, 'Salary paid for the month of Oct 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7aa62515-7d20-453b-b4ca-bc5e615a3eb6', '5461b87c-82ed-4c3a-bc86-383c5f32e659', id, 'Salary paid for the month of Oct 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20171';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '50bff595-c2ee-4246-8b82-87030e20d947', '5461b87c-82ed-4c3a-bc86-383c5f32e659', id, 'Salary paid for the month of Oct 2025', 10000.00, 0.00 FROM accounts WHERE account_code = '20172';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '118f3da2-0c92-4e57-af3e-b42f352bc7ca', '5461b87c-82ed-4c3a-bc86-383c5f32e659', id, 'Salary paid for the month of Oct 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20170';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '477daec4-5aca-42c3-988b-86b033ab92c8', '5461b87c-82ed-4c3a-bc86-383c5f32e659', id, 'Salary paid for the month of Oct 2025', 0.00, 122000.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ed1fedc7-1d21-413a-a1fb-c4ef0edbe167', '5461b87c-82ed-4c3a-bc86-383c5f32e659', id, '', 1050.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aa4db936-7468-4e2a-8823-78ed9956994b', '5461b87c-82ed-4c3a-bc86-383c5f32e659', id, '', 0.00, 1050.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5a6e87f3-7955-4863-b0e9-3373e85704ff', '5461b87c-82ed-4c3a-bc86-383c5f32e659', id, '', 3030.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5776c914-b5a1-4dcf-80ed-4e2d4daec208', '5461b87c-82ed-4c3a-bc86-383c5f32e659', id, '', 0.00, 3030.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-767
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c27ace5d-92ce-49b8-9cee-e54b97dc13b8', 'JE-000813', '2025-11-09', 'Received third installment from Taiba', 'JV-JV-767', 'journal_entry', 743.00, 743.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e833a477-36b5-40b5-833a-c5df49380e25', 'c27ace5d-92ce-49b8-9cee-e54b97dc13b8', id, 'Received third installment from Taiba', 198.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '02cf8903-13eb-4aa5-8362-2bf6dd6bae35', 'c27ace5d-92ce-49b8-9cee-e54b97dc13b8', id, 'Received third installment from Taiba', 0.00, 198.00 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e65c9254-b756-4ee7-8a65-361d7f2c9f45', 'c27ace5d-92ce-49b8-9cee-e54b97dc13b8', id, 'Received first installment from Ansarullah', 545.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f973abf9-739c-427a-a43a-74fa2978a721', 'c27ace5d-92ce-49b8-9cee-e54b97dc13b8', id, 'Received first installment from Ansarullah', 0.00, 545.00 FROM accounts WHERE account_code = '50300';

-- Entry: JV-768
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0d95fec0-fee2-4fff-ba0a-6be82c1ea66c', 'JE-000814', '2025-11-10', 'Cash Received CR# 93 for Jalalabad Oct 2025 staff salary and food allowance', 'JV-JV-768', 'journal_entry', 21010.00, 21010.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '97870b1d-c8f1-4776-b2c7-f1b1d149d4ad', '0d95fec0-fee2-4fff-ba0a-6be82c1ea66c', id, 'Cash Received CR# 93 for Jalalabad Oct 2025 staff salary and food allowance', 21010.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '26657264-d09c-4789-9a62-3b855fc39b26', '0d95fec0-fee2-4fff-ba0a-6be82c1ea66c', id, 'Cash Received CR# 93 for Jalalabad Oct 2025 staff salary and food allowance', 0.00, 21010.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-769
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4e29cef2-29ea-4192-b469-94852d8c8c10', 'JE-000815', '2025-11-10', 'Salary paid for the month of Oct 2025', 'JV-JV-769', 'journal_entry', 21010.00, 21010.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd7ae2aef-4b7c-473e-9b42-5a7c69ba2b5e', '4e29cef2-29ea-4192-b469-94852d8c8c10', id, 'Salary paid for the month of Oct 2025', 11860.00, 0.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '435d2af7-f43a-4a9c-9408-059580766928', '4e29cef2-29ea-4192-b469-94852d8c8c10', id, 'Salary paid for the month of Oct 2025', 3000.00, 0.00 FROM accounts WHERE account_code = '20174';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4701f98c-ad5a-4a25-8c9b-2f7bdd536356', '4e29cef2-29ea-4192-b469-94852d8c8c10', id, 'Salary paid for the month of Oct 2025', 3000.00, 0.00 FROM accounts WHERE account_code = '20176';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c25dad24-5e6e-4b47-bbc9-141e27531d68', '4e29cef2-29ea-4192-b469-94852d8c8c10', id, 'Food expense paid for the month of Oct 2025', 3000.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '627c94b3-3ab3-4669-9cb9-60d31a3cc180', '4e29cef2-29ea-4192-b469-94852d8c8c10', id, 'Food expense paid for the month of Oct 2025', 150.00, 0.00 FROM accounts WHERE account_code = '61807';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cd571acc-aae3-4137-b639-bc027f2b0233', '4e29cef2-29ea-4192-b469-94852d8c8c10', id, 'Salary and Food expense paid for the month of Oct 2025', 0.00, 21010.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-770
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d9dcd3be-5f93-4105-815f-5ad39c5e1437', 'JE-000816', '2025-11-10', 'Cash Received CR# 94 for Kunar Oct 2025 staff salary and food allowance', 'JV-JV-770', 'journal_entry', 15110.00, 15110.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '72d6d77b-4956-44ef-a227-0c25efbb830f', 'd9dcd3be-5f93-4105-815f-5ad39c5e1437', id, 'Cash Received CR# 94 for Kunar Oct 2025 staff salary and food allowance', 15110.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7acab4f4-dcab-4a09-b156-4b2388c0756b', 'd9dcd3be-5f93-4105-815f-5ad39c5e1437', id, 'Cash Received CR# 94 for Kunar Oct 2025 staff salary and food allowance', 0.00, 15110.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-771
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('894e4214-6c76-427d-a459-042e96840733', 'JE-000817', '2025-11-10', 'Salary paid for the month of Oct 2025', 'JV-JV-771', 'journal_entry', 15110.00, 15110.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '58cdc368-75f8-4b2d-9f25-17a5b0b234c3', '894e4214-6c76-427d-a459-042e96840733', id, 'Salary paid for the month of Oct 2025', 5980.00, 0.00 FROM accounts WHERE account_code = '20173';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd1abf8b1-a7d0-4d94-ba37-e50bd29be5dd', '894e4214-6c76-427d-a459-042e96840733', id, 'Salary paid for the month of Oct 2025', 5980.00, 0.00 FROM accounts WHERE account_code = '20175';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '16e7b1f8-657c-4b70-a165-29e67f7f5149', '894e4214-6c76-427d-a459-042e96840733', id, 'Food expense paid for the month of Oct 2025', 3000.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f59d6a8a-695f-4279-ad0f-3e4e544ef440', '894e4214-6c76-427d-a459-042e96840733', id, 'Hawala cost', 150.00, 0.00 FROM accounts WHERE account_code = '61807';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0d514b2a-2336-47fe-9fad-d687a919cf21', '894e4214-6c76-427d-a459-042e96840733', id, 'Salary and Food expense paid for the month of Oct 2025', 0.00, 15110.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-772
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('757a66d7-bbf5-4ca6-bc8a-6e19cbe8d9b5', 'JE-000818', '2025-11-10', 'Purchased monthly food for staff lunch expenses', 'JV-JV-772', 'journal_entry', 9510.00, 9510.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '270f37fe-ec79-4cc8-b9a7-af74d12cda29', '757a66d7-bbf5-4ca6-bc8a-6e19cbe8d9b5', id, 'Purchased monthly food for staff lunch expenses', 9510.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c0f95c1b-c31f-4e52-a955-9f160532fec3', '757a66d7-bbf5-4ca6-bc8a-6e19cbe8d9b5', id, 'Purchased monthly food for staff lunch expenses', 0.00, 9510.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-773
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b5b2df5e-dc16-42cc-8284-ec79e90c3e0b', 'JE-000819', '2025-11-10', 'Paid for the staff lunch expense', 'JV-JV-773', 'journal_entry', 110.00, 110.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7c0fcc2a-b529-4ce1-816a-9f83376b3af8', 'b5b2df5e-dc16-42cc-8284-ec79e90c3e0b', id, 'Paid for the staff lunch expense', 110.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c8ea2397-c206-42a7-8993-8cd6cfc213b3', 'b5b2df5e-dc16-42cc-8284-ec79e90c3e0b', id, 'Paid for the staff lunch expense', 0.00, 110.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-774
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a860fd18-a8cf-4614-bc66-c77ae6fd5b4e', 'JE-000820', '2025-11-10', 'Paid for liquid gas for the office use', 'JV-JV-774', 'journal_entry', 1030.00, 1030.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f298ab79-6dfb-4511-a591-e2d8b8d56fdd', 'a860fd18-a8cf-4614-bc66-c77ae6fd5b4e', id, 'Paid for liquid gas for the office use', 1030.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0691249a-384f-4f93-90f1-5e114c6fc423', 'a860fd18-a8cf-4614-bc66-c77ae6fd5b4e', id, 'Paid for liquid gas for the office use', 0.00, 1030.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-775
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c41379b5-1d81-4217-9ed0-43ac3c952e52', 'JE-000821', '2025-11-11', 'Vegetable for staff lunch', 'JV-JV-775', 'journal_entry', 200.00, 200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e7bf7416-6f1d-438b-a666-7afe2dfaa80f', 'c41379b5-1d81-4217-9ed0-43ac3c952e52', id, 'Vegetable for staff lunch', 200.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '53df636a-aef2-457c-9894-4e87e6c06f1e', 'c41379b5-1d81-4217-9ed0-43ac3c952e52', id, 'Vegetable for staff lunch', 0.00, 200.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-776
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2f2c953a-38ae-4fd3-a274-0203ac0707d8', 'JE-000822', '2025-11-12', 'Paid for the repair of electric heater', 'JV-JV-776', 'journal_entry', 250.00, 250.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ed8b8e6a-9566-4947-a8db-718937b106c7', '2f2c953a-38ae-4fd3-a274-0203ac0707d8', id, 'Paid for the repair of electric heater', 250.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '580ad2c6-7d1a-4aba-b9ee-32250e8e769c', '2f2c953a-38ae-4fd3-a274-0203ac0707d8', id, 'Paid for the repair of electric heater', 0.00, 250.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-777
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9529189f-5041-4185-99b5-6be8828fe88b', 'JE-000823', '2025-11-12', 'Paid for the plumbing expenses', 'JV-JV-777', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '14927332-395a-4890-acb0-1dbd6ce1feb6', '9529189f-5041-4185-99b5-6be8828fe88b', id, 'Paid for the plumbing expenses', 500.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '584bf19d-e3cb-4124-9c9d-42919ca17add', '9529189f-5041-4185-99b5-6be8828fe88b', id, 'Paid for the plumbing expenses', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-778
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4c6af4c5-ed6b-48c0-aa5e-ac2748430def', 'JE-000824', '2025-11-12', 'Paid for the purchase of toner for HP printer', 'JV-JV-778', 'journal_entry', 900.00, 900.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ee1171cb-752c-4ea0-9094-86135e972b3c', '4c6af4c5-ed6b-48c0-aa5e-ac2748430def', id, 'Paid for the purchase of toner for HP printer', 900.00, 0.00 FROM accounts WHERE account_code = '60502';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6a80cef7-fc3e-401f-9b01-f77a342b814f', '4c6af4c5-ed6b-48c0-aa5e-ac2748430def', id, 'Paid for the purchase of toner for HP printer', 0.00, 900.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-779
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('67434f9e-b61c-4211-bd3e-81ad1e985ef8', 'JE-000825', '2025-11-12', 'Paid for taxi to purchase toner for HP printer', 'JV-JV-779', 'journal_entry', 40.00, 40.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '77ffebbc-5694-44c7-a1d3-abd10d113acd', '67434f9e-b61c-4211-bd3e-81ad1e985ef8', id, 'Paid for taxi to purchase toner for HP printer', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd35682a8-0686-4842-bce3-9c14a55c196f', '67434f9e-b61c-4211-bd3e-81ad1e985ef8', id, 'Paid for taxi to purchase toner for HP printer', 0.00, 40.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-780
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fa023ac5-0fbe-4368-87c3-017a587c8ee1', 'JE-000826', '2025-11-13', 'Cash sent to Jalalabad Branch office for loan disbursements', 'JV-JV-780', 'journal_entry', 2300000.00, 2300000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4735f01f-c41c-45d9-948f-a7f6e6cd3aa4', 'fa023ac5-0fbe-4368-87c3-017a587c8ee1', id, 'Cash sent to Jalalabad Branch office for loan disbursements', 1400000.00, 0.00 FROM accounts WHERE account_code = '10103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0dcc2218-733d-4c8f-a279-0f0a64a6256a', 'fa023ac5-0fbe-4368-87c3-017a587c8ee1', id, 'Cash sent to Jalalabad Branch office for loan disbursements', 900000.00, 0.00 FROM accounts WHERE account_code = '10104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd2d363d1-7464-402c-8a40-5ba94b78590b', 'fa023ac5-0fbe-4368-87c3-017a587c8ee1', id, 'Cash sent to Jalalabad Branch office for loan disbursements', 0.00, 2300000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-781
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d1c98753-4727-4a14-87f2-aa38bbd8e511', 'JE-000827', '2025-11-15', 'Cash sent to Jalalabad Branch office for loan disbursements', 'JV-JV-781', 'journal_entry', 400.00, 400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '720a1cdf-a8a2-4722-ba94-fb1290796254', 'd1c98753-4727-4a14-87f2-aa38bbd8e511', id, 'Cash sent to Jalalabad Branch office for loan disbursements', 400.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e5374649-560a-4690-938e-b74ca106e65a', 'd1c98753-4727-4a14-87f2-aa38bbd8e511', id, 'Cash sent to Jalalabad Branch office for loan disbursements', 0.00, 400.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-782
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1e492603-4078-4d41-81a7-0df84180d6ed', 'JE-000828', '2025-11-15', 'Purchased grocery and drinks items on Murabaha to Rahimullah Shinwari', 'JV-JV-782', 'journal_entry', 91500.00, 91500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1420a6ef-f8d8-4b35-b9a8-8c15674a106f', '1e492603-4078-4d41-81a7-0df84180d6ed', id, 'Purchased grocery and drinks items on Murabaha to Rahimullah Shinwari', 18500.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c5ff30e6-6269-48e4-af58-1d0aa737e076', '1e492603-4078-4d41-81a7-0df84180d6ed', id, 'Purchased medicine on Murabaha to Anwarul Haq Sana', 19000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6240e13d-e3a4-4835-a190-649359555d9f', '1e492603-4078-4d41-81a7-0df84180d6ed', id, 'Purchased grocery and drinks items on Murabaha to Rahimullah Mamoond', 19500.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5ea91aa5-7024-4520-a951-a24679a5475d', '1e492603-4078-4d41-81a7-0df84180d6ed', id, 'Purchased grocery and drinks items on Murabaha to Hafizullah Safi', 18500.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '782c5ff5-279e-4f47-9a16-1142208ac389', '1e492603-4078-4d41-81a7-0df84180d6ed', id, 'Purchased grocery and drinks items on Murabaha to Dawood Mamoond', 16000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '24d620f7-8610-40a8-bd15-f57af9ff111a', '1e492603-4078-4d41-81a7-0df84180d6ed', id, 'Purchased grocery and drinks items on Murabaha to 5 clients in Kunar', 0.00, 91500.00 FROM accounts WHERE account_code = '10104';

-- Entry: LCI039
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ee7a1725-0b78-4907-918c-88681595241f', 'JE-000829', '2025-11-15', 'Purchased Grocery and drinks items on Murabaha to Mr. Rahimullah Shinwari for 12 months, monthly installments, on 16% profit margin.', 'JV-LCI039', 'financing_disbursement', 21460.00, 21460.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b14a7e10-9331-4e60-baa6-8c85e3b81a3a', 'ee7a1725-0b78-4907-918c-88681595241f', id, 'Purchased Grocery and drinks items on Murabaha to Mr. Rahimullah Shinwari for 12 months, monthly installments, on 16% profit margin.', 21460.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'de6b5d7b-1f54-463f-a01f-b7226dc050e8', 'ee7a1725-0b78-4907-918c-88681595241f', id, 'Purchased Grocery and drinks items on Murabaha to Mr. Rahimullah Shinwari for 12 months, monthly installments, on 16% profit margin.', 0.00, 18500.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cb5583b4-642d-48cd-b778-2c20cb9506e4', 'ee7a1725-0b78-4907-918c-88681595241f', id, 'Purchased Grocery and drinks items on Murabaha to Mr. Rahimullah Shinwari for 12 months, monthly installments, on 16% profit margin.', 0.00, 2960.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI040
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('65dcc61d-ea8d-4eef-8163-430ad93634ec', 'JE-000830', '2025-11-15', 'Purchased Medicine on Murabaha to Mr. Anwarulhaq Sana for 12 months, monthly installments, on 16% profit margin.', 'JV-LCI040', 'financing_disbursement', 22040.00, 22040.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0dfd8acc-f92d-41e4-a7cf-79e21669fbce', '65dcc61d-ea8d-4eef-8163-430ad93634ec', id, 'Purchased Medicine on Murabaha to Mr. Anwarulhaq Sana for 12 months, monthly installments, on 16% profit margin.', 22040.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4f95a7cc-8789-4348-a6d2-c93f9feb2571', '65dcc61d-ea8d-4eef-8163-430ad93634ec', id, 'Purchased Medicine on Murabaha to Mr. Anwarulhaq Sana for 12 months, monthly installments, on 16% profit margin.', 0.00, 19000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd69bf84c-f768-4078-b1ab-7e8564f8cf97', '65dcc61d-ea8d-4eef-8163-430ad93634ec', id, 'Purchased Medicine on Murabaha to Mr. Anwarulhaq Sana for 12 months, monthly installments, on 16% profit margin.', 0.00, 3040.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI041
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8130df70-af9f-4157-b4a4-8d3d32060614', 'JE-000831', '2025-11-15', 'Purchased Grocery and drinks items on Murabaha to Mr. Rahimullah Mamoond for 12 months, monthly installments, on 16% profit margin.', 'JV-LCI041', 'financing_disbursement', 22620.00, 22620.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4c8813a8-297a-4f24-abef-1648b925673d', '8130df70-af9f-4157-b4a4-8d3d32060614', id, 'Purchased Grocery and drinks items on Murabaha to Mr. Rahimullah Mamoond for 12 months, monthly installments, on 16% profit margin.', 22620.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '24640dac-ebb1-4687-af48-214ab1bc0dcf', '8130df70-af9f-4157-b4a4-8d3d32060614', id, 'Purchased Grocery and drinks items on Murabaha to Mr. Rahimullah Mamoond for 12 months, monthly installments, on 16% profit margin.', 0.00, 19500.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '46197c41-6a5c-4554-bdcb-4dc31287d67f', '8130df70-af9f-4157-b4a4-8d3d32060614', id, 'Purchased Grocery and drinks items on Murabaha to Mr. Rahimullah Mamoond for 12 months, monthly installments, on 16% profit margin.', 0.00, 3120.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI042
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4eb6eb63-e981-4806-aa68-c580b7e84c9f', 'JE-000832', '2025-11-15', 'Purchased Grocery and drinks items on Murabaha to Mr. Hafizullah Safi for 12 months, monthly installments, on 16% profit margin.', 'JV-LCI042', 'financing_disbursement', 21460.00, 21460.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5c595900-d125-4624-8ff3-4bc1be161eb7', '4eb6eb63-e981-4806-aa68-c580b7e84c9f', id, 'Purchased Grocery and drinks items on Murabaha to Mr. Hafizullah Safi for 12 months, monthly installments, on 16% profit margin.', 21460.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2cd808ed-2aec-465a-8332-d8997b8de38a', '4eb6eb63-e981-4806-aa68-c580b7e84c9f', id, 'Purchased Grocery and drinks items on Murabaha to Mr. Hafizullah Safi for 12 months, monthly installments, on 16% profit margin.', 0.00, 18500.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '36cccc9a-ab09-407a-a5a2-10f34ada5424', '4eb6eb63-e981-4806-aa68-c580b7e84c9f', id, 'Purchased Grocery and drinks items on Murabaha to Mr. Hafizullah Safi for 12 months, monthly installments, on 16% profit margin.', 0.00, 2960.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI043
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('13250233-2544-40a7-9f44-9dbb65327d93', 'JE-000833', '2025-11-15', 'Purchased Grocery and drinks items on Murabaha to Mr. Dawood Mamoond for 12 months, monthly installments, on 16% profit margin.', 'JV-LCI043', 'financing_disbursement', 18560.00, 18560.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fb8247b1-7119-49f9-8bf0-731a82a829f3', '13250233-2544-40a7-9f44-9dbb65327d93', id, 'Purchased Grocery and drinks items on Murabaha to Mr. Dawood Mamoond for 12 months, monthly installments, on 16% profit margin.', 18560.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4a5cc4a8-a878-4d80-b94a-348cc0d7f43f', '13250233-2544-40a7-9f44-9dbb65327d93', id, 'Purchased Grocery and drinks items on Murabaha to Mr. Dawood Mamoond for 12 months, monthly installments, on 16% profit margin.', 0.00, 16000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3a2b01b0-6594-434c-a28c-fcc8704619c7', '13250233-2544-40a7-9f44-9dbb65327d93', id, 'Purchased Grocery and drinks items on Murabaha to Mr. Dawood Mamoond for 12 months, monthly installments, on 16% profit margin.', 0.00, 2560.00 FROM accounts WHERE account_code = '20900';

-- Entry: JV-783
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9b80fef2-f2f7-4125-bf88-bfcf89f0c9c5', 'JE-000834', '2025-11-16', 'Cash Received CR# 96 to Noor Muhammad for Jalalabad Branch Expenses', 'JV-JV-783', 'journal_entry', 10350.00, 10350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c8423339-892f-433f-8616-db1347a78686', '9b80fef2-f2f7-4125-bf88-bfcf89f0c9c5', id, 'Cash Received CR# 96 to Noor Muhammad for Jalalabad Branch Expenses', 10350.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '700971b8-ff6e-4f8d-b45e-3e9104977e6f', '9b80fef2-f2f7-4125-bf88-bfcf89f0c9c5', id, 'Cash Received CR# 96 to Noor Muhammad for Jalalabad Branch Expenses', 0.00, 10350.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-784
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('874dfe1e-23ff-41f9-b4f8-61c6920e942b', 'JE-000835', '2025-11-16', 'Advance Paid to Noor Muhammad for Jalalabad Branch Expenses', 'JV-JV-784', 'journal_entry', 10350.00, 10350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '18eec28c-2405-40ce-90ce-ee0012bd342e', '874dfe1e-23ff-41f9-b4f8-61c6920e942b', id, 'Advance Paid to Noor Muhammad for Jalalabad Branch Expenses', 10350.00, 0.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '547113f4-836b-4afe-aa6f-4a311feb3c11', '874dfe1e-23ff-41f9-b4f8-61c6920e942b', id, 'Advance Paid to Noor Muhammad for Jalalabad Branch Expenses', 0.00, 10350.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-785
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('952c06aa-b604-4076-a73d-5b4887fa1fe7', 'JE-000836', '2025-11-16', 'Cash Received CR# 97 to Hedayat for Kunar Branch Expenses', 'JV-JV-785', 'journal_entry', 8100.00, 8100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '30869f2c-66d2-4e00-8b36-f925936a8ca0', '952c06aa-b604-4076-a73d-5b4887fa1fe7', id, 'Cash Received CR# 97 to Hedayat for Kunar Branch Expenses', 4050.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '976b5eea-bbd3-4f5e-8357-6409ba400572', '952c06aa-b604-4076-a73d-5b4887fa1fe7', id, 'Cash Received CR# 97 to Hedayat for Kunar Branch Expenses', 0.00, 4050.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ef281deb-0471-4a27-a209-b5628cd809d2', '952c06aa-b604-4076-a73d-5b4887fa1fe7', id, 'Advance Paid to Hedayat for Kunar Branch Expenses', 4050.00, 0.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '02358a9a-e2d9-48c0-9320-5a9942ace96e', '952c06aa-b604-4076-a73d-5b4887fa1fe7', id, 'Advance Paid to Hedayat for Kunar Branch Expenses', 0.00, 4050.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-786
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('06999d91-7ddb-4bee-b83d-94aa3a3a6f68', 'JE-000837', '2025-11-16', 'Paid for lunch expense', 'JV-JV-786', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '507dcfa7-e5f0-4bc3-b7e8-5fd24489c0f9', '06999d91-7ddb-4bee-b83d-94aa3a3a6f68', id, 'Paid for lunch expense', 450.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bc6b0ec3-ac1d-4787-860c-4237b31e441d', '06999d91-7ddb-4bee-b83d-94aa3a3a6f68', id, 'Paid for lunch expense', 0.00, 450.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2b51434f-4f55-4fbd-a281-2868d2d16155', '06999d91-7ddb-4bee-b83d-94aa3a3a6f68', id, 'Taxi paid to CFO for taxi to DAB Meeting', 50.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'adad1d63-3dd2-4638-b702-276caeb2523c', '06999d91-7ddb-4bee-b83d-94aa3a3a6f68', id, 'Taxi paid to CFO for taxi to DAB Meeting', 0.00, 50.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-787
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('24226948-f856-4fb1-94a4-91f090e303cd', 'JE-000838', '2025-11-16', 'Paid for the purchase of liquid gas', 'JV-JV-787', 'journal_entry', 440.00, 440.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'abc4133c-f021-4f21-89ff-65edbac5fa0c', '24226948-f856-4fb1-94a4-91f090e303cd', id, 'Paid for the purchase of liquid gas', 440.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '733cad55-7d7c-424d-b2db-a7214938e61b', '24226948-f856-4fb1-94a4-91f090e303cd', id, 'Paid for the purchase of liquid gas', 0.00, 440.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-788
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7a2ea509-5776-48f5-81f1-6eb61e7da104', 'JE-000839', '2025-11-18', 'Cash deposited to AUB bank', 'JV-JV-788', 'journal_entry', 9000000.00, 9000000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ef845a5c-25e4-4d97-84b5-991605e5fb89', '7a2ea509-5776-48f5-81f1-6eb61e7da104', id, 'Cash deposited to AUB bank', 9000000.00, 0.00 FROM accounts WHERE account_code = '10202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f73540b5-ee94-4368-bee5-31f81c6ffd77', '7a2ea509-5776-48f5-81f1-6eb61e7da104', id, 'Cash deposited to AUB bank', 0.00, 9000000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-789
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d55364f3-6fd0-4a65-b830-c271218f9b2e', 'JE-000840', '2025-11-20', 'Cash Received CR# 99 for CEO Salary of the month of Oct 2025', 'JV-JV-789', 'journal_entry', 134000.00, 134000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '67d28e6e-57b5-4293-a222-6fbd2e6e796f', 'd55364f3-6fd0-4a65-b830-c271218f9b2e', id, 'Cash Received CR# 99 for CEO Salary of the month of Oct 2025', 134000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f6765708-95de-4799-b83d-1946de3814bb', 'd55364f3-6fd0-4a65-b830-c271218f9b2e', id, 'Cash Received CR# 99 for CEO Salary of the month of Oct 2025', 0.00, 134000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-790
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('88634096-70f3-4385-8f55-cd1129f86704', 'JE-000841', '2025-11-20', 'Paid CEO salary for the month of Oct 2025', 'JV-JV-790', 'journal_entry', 134000.00, 134000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6d29fd55-995a-41f5-8b8c-37d2583829cb', '88634096-70f3-4385-8f55-cd1129f86704', id, 'Paid CEO salary for the month of Oct 2025', 134000.00, 0.00 FROM accounts WHERE account_code = '20169';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cbb43618-f820-4386-878d-7efa234afba3', '88634096-70f3-4385-8f55-cd1129f86704', id, 'Paid CEO salary for the month of Oct 2025', 0.00, 134000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-791
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5ffbaa9c-436a-431a-975b-8ed1f9e5805b', 'JE-000842', '2025-11-20', 'Purchased materials for 14 Clients on Murabaha', 'JV-JV-791', 'journal_entry', 883800.00, 883800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '50269f26-7345-4453-8f66-25b931ef3e6e', '5ffbaa9c-436a-431a-975b-8ed1f9e5805b', id, 'Purchased materials for 14 Clients on Murabaha', 780000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2b294439-7cd3-4c82-8bdf-032972b5fb27', '5ffbaa9c-436a-431a-975b-8ed1f9e5805b', id, 'Hawala cost', 3600.00, 0.00 FROM accounts WHERE account_code = '51300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '70174481-b641-4153-a001-f1cafad4e023', '5ffbaa9c-436a-431a-975b-8ed1f9e5805b', id, 'Purchased materials for 14 Clients on Murabaha', 0.00, 783600.00 FROM accounts WHERE account_code = '10104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cb8aa5f0-499a-45e0-b0db-3853be074806', '5ffbaa9c-436a-431a-975b-8ed1f9e5805b', id, 'Cash Received CR# 100 for loan disbursement in Kunar for 1 client', 50100.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd36dfd5a-f6f1-4c45-9fd9-9bb8f99ab1ca', '5ffbaa9c-436a-431a-975b-8ed1f9e5805b', id, 'Cash Received CR# 100 for loan disbursement in Kunar for 1 client', 0.00, 50100.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '538aeb6a-73e0-453e-93c6-2634fa216928', '5ffbaa9c-436a-431a-975b-8ed1f9e5805b', id, 'Purchased materials for 1 Client on Murabaha', 50000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '550a7406-2233-44b2-bd9e-a6f248c9cce2', '5ffbaa9c-436a-431a-975b-8ed1f9e5805b', id, 'Purchased materials for 1 Client on Murabaha', 100.00, 0.00 FROM accounts WHERE account_code = '51300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '30e4edd8-6c3f-4bab-95c8-df517169f9a3', '5ffbaa9c-436a-431a-975b-8ed1f9e5805b', id, 'Purchased materials for 1 Client on Murabaha', 0.00, 50100.00 FROM accounts WHERE account_code = '10101';

-- Entry: LCI045
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('912eb4ef-c263-4a5b-be95-bc43cbfc933b', 'JE-000843', '2025-11-20', 'Imported entry', 'JV-LCI045', 'financing_disbursement', 58000.00, 58000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '70c18bc3-1fd1-4193-ae2f-95d95057ca02', '912eb4ef-c263-4a5b-be95-bc43cbfc933b', id, '', 58000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '36f29ef9-4549-404b-bb2b-755c0ad262be', '912eb4ef-c263-4a5b-be95-bc43cbfc933b', id, 'Purchased asset for customer on loan', 0.00, 50000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7033c01d-d6cf-4aa1-9095-b76d74037966', '912eb4ef-c263-4a5b-be95-bc43cbfc933b', id, 'Cost occurred on purchased product on loan for customers', 0.00, 8000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI046
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('aff43d6a-0582-452c-b690-8c977fb85b21', 'JE-000844', '2025-11-20', 'Imported entry', 'JV-LCI046', 'financing_disbursement', 58000.00, 58000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9ca6d1f9-a631-4ef4-865b-387f495f443f', 'aff43d6a-0582-452c-b690-8c977fb85b21', id, '', 58000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '73eb31f7-915d-4a06-8047-c365567e9556', 'aff43d6a-0582-452c-b690-8c977fb85b21', id, 'Purchased asset for customer on loan', 0.00, 50000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '42ba8459-3ef1-4c48-9b6e-b28bc01d89e6', 'aff43d6a-0582-452c-b690-8c977fb85b21', id, 'Cost occurred on purchased product on loan for customers', 0.00, 8000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI047
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('121b6f4d-96dd-447b-8585-c78bc40fc32d', 'JE-000845', '2025-11-20', 'Imported entry', 'JV-LCI047', 'financing_disbursement', 46400.00, 46400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fdbd2a5e-742d-4ebf-b68d-bd556e12435d', '121b6f4d-96dd-447b-8585-c78bc40fc32d', id, '', 46400.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6b7a9509-93ca-4ab2-8474-dfabfea2c1e9', '121b6f4d-96dd-447b-8585-c78bc40fc32d', id, 'Purchased asset for customer on loan', 0.00, 40000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '76693537-6dc2-478a-b4ee-16b6e3655bb7', '121b6f4d-96dd-447b-8585-c78bc40fc32d', id, 'Cost occurred on purchased product on loan for customers', 0.00, 6400.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI048
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e4fe3996-39bf-49f1-ba2f-1b7f3e257c04', 'JE-000846', '2025-11-20', 'Imported entry', 'JV-LCI048', 'financing_disbursement', 23200.00, 23200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c1e4ee17-f721-44fe-b987-f1d24b3a416c', 'e4fe3996-39bf-49f1-ba2f-1b7f3e257c04', id, '', 23200.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0d2d750e-7bb9-4e97-ba1b-0d1e94e02017', 'e4fe3996-39bf-49f1-ba2f-1b7f3e257c04', id, 'Purchased asset for customer on loan', 0.00, 20000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '01feb5d3-feb4-4779-bc5b-679752a45175', 'e4fe3996-39bf-49f1-ba2f-1b7f3e257c04', id, 'Cost occurred on purchased product on loan for customers', 0.00, 3200.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI049
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c6f3ca5d-fc69-48df-9b64-9128e2822d5c', 'JE-000847', '2025-11-20', 'Imported entry', 'JV-LCI049', 'financing_disbursement', 81200.00, 81200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '022fbcd7-8461-4221-a0c7-00fcd11514c6', 'c6f3ca5d-fc69-48df-9b64-9128e2822d5c', id, '', 81200.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fb1cfcb5-9d44-4ddc-ab13-d822dfe07a0e', 'c6f3ca5d-fc69-48df-9b64-9128e2822d5c', id, 'Purchased asset for customer on loan', 0.00, 70000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1003b7ab-28d9-4069-96c2-7e3450ea6a82', 'c6f3ca5d-fc69-48df-9b64-9128e2822d5c', id, 'Cost occurred on purchased product on loan for customers', 0.00, 11200.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI050
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5bd7e086-1c87-405b-a2ef-3f1ea168b985', 'JE-000848', '2025-11-20', 'Imported entry', 'JV-LCI050', 'financing_disbursement', 58000.00, 58000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8081080d-6f21-486b-89e8-03bb73b4c269', '5bd7e086-1c87-405b-a2ef-3f1ea168b985', id, '', 58000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '298dde7b-d5d1-41fc-8549-a4515861fa4b', '5bd7e086-1c87-405b-a2ef-3f1ea168b985', id, 'Purchased asset for customer on loan', 0.00, 50000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '717a5377-e4c8-49c8-8b18-f993061810cc', '5bd7e086-1c87-405b-a2ef-3f1ea168b985', id, 'Cost occurred on purchased product on loan for customers', 0.00, 8000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI051
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('133d2479-e3b4-4f38-ab16-386e08f57089', 'JE-000849', '2025-11-20', 'Imported entry', 'JV-LCI051', 'financing_disbursement', 58000.00, 58000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a84ed1b9-98ce-4cbe-8131-0d818feb53df', '133d2479-e3b4-4f38-ab16-386e08f57089', id, '', 58000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1df85d8b-a739-4306-ba4d-51acb5abb99c', '133d2479-e3b4-4f38-ab16-386e08f57089', id, 'Purchased asset for customer on loan', 0.00, 50000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3f8f2cc0-9599-4ba8-a4dc-d5912f26ab73', '133d2479-e3b4-4f38-ab16-386e08f57089', id, 'Cost occurred on purchased product on loan for customers', 0.00, 8000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI052
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e584c5c1-edaf-4bf7-9b94-01edf9924f33', 'JE-000850', '2025-11-20', 'Imported entry', 'JV-LCI052', 'financing_disbursement', 92800.00, 92800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '268abe44-ec94-4630-a559-45ec1ff3dd50', 'e584c5c1-edaf-4bf7-9b94-01edf9924f33', id, '', 92800.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '873798ec-e524-45ae-836a-24678d4d94b9', 'e584c5c1-edaf-4bf7-9b94-01edf9924f33', id, 'Purchased asset for customer on loan', 0.00, 80000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6b605e45-f893-4a0d-a0a7-53a5d945e558', 'e584c5c1-edaf-4bf7-9b94-01edf9924f33', id, 'Cost occurred on purchased product on loan for customers', 0.00, 12800.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI053
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('51c874b7-5598-4171-9b76-288e087c58db', 'JE-000851', '2025-11-20', 'Imported entry', 'JV-LCI053', 'financing_disbursement', 58000.00, 58000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fc8f9595-d637-488a-b684-3dc3e4e2d14f', '51c874b7-5598-4171-9b76-288e087c58db', id, '', 58000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9b46f3d8-0769-4b33-b2dc-5a8ea726f9f9', '51c874b7-5598-4171-9b76-288e087c58db', id, 'Purchased asset for customer on loan', 0.00, 50000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '71dfa30b-3552-4e32-93c7-30de3fbfd5d1', '51c874b7-5598-4171-9b76-288e087c58db', id, 'Cost occurred on purchased product on loan for customers', 0.00, 8000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI054
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('13049ff5-d87d-4075-b275-456bd61c1fcd', 'JE-000852', '2025-11-20', 'Imported entry', 'JV-LCI054', 'financing_disbursement', 34800.00, 34800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2da56980-4fe6-41d1-b16c-2b3f1a9f951c', '13049ff5-d87d-4075-b275-456bd61c1fcd', id, '', 34800.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9622c69b-f66c-4206-a3f0-dd7ace75124d', '13049ff5-d87d-4075-b275-456bd61c1fcd', id, 'Purchased asset for customer on loan', 0.00, 30000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '835a190c-647f-448f-a6cf-c1e49f644d41', '13049ff5-d87d-4075-b275-456bd61c1fcd', id, 'Cost occurred on purchased product on loan for customers', 0.00, 4800.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI055
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e903c37d-80b1-4efb-9d7b-6b33d0ac6963', 'JE-000853', '2025-11-20', 'Imported entry', 'JV-LCI055', 'financing_disbursement', 116000.00, 116000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd9c5bcff-55de-4b97-bc68-44603fed29a0', 'e903c37d-80b1-4efb-9d7b-6b33d0ac6963', id, '', 116000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '81485768-9870-4c3f-a930-1aea8014454b', 'e903c37d-80b1-4efb-9d7b-6b33d0ac6963', id, 'Purchased asset for customer on loan', 0.00, 100000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a221a051-1cde-453d-a6e2-23c17d53c349', 'e903c37d-80b1-4efb-9d7b-6b33d0ac6963', id, 'Cost occurred on purchased product on loan for customers', 0.00, 16000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI056
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('07d7d759-4715-48a9-a4f2-7e905a90f700', 'JE-000854', '2025-11-20', 'Imported entry', 'JV-LCI056', 'financing_disbursement', 58000.00, 58000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1be51986-449b-4e5c-8c0a-6c18536913ce', '07d7d759-4715-48a9-a4f2-7e905a90f700', id, '', 58000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e471d250-dd6b-42b6-8f32-bb61ff75a5ad', '07d7d759-4715-48a9-a4f2-7e905a90f700', id, 'Purchased asset for customer on loan', 0.00, 50000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '29ef0867-2b2a-4ad7-9c41-647932202235', '07d7d759-4715-48a9-a4f2-7e905a90f700', id, 'Cost occurred on purchased product on loan for customers', 0.00, 8000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI057
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d1766166-5cdb-40c8-9e60-6ceeedc456c0', 'JE-000855', '2025-11-20', 'Imported entry', 'JV-LCI057', 'financing_disbursement', 58000.00, 58000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7c6e5647-5b21-40b0-b911-fbb8cbc58f3f', 'd1766166-5cdb-40c8-9e60-6ceeedc456c0', id, '', 58000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5300ed5c-6b7c-451e-bca3-c1d6221b3bc3', 'd1766166-5cdb-40c8-9e60-6ceeedc456c0', id, 'Purchased asset for customer on loan', 0.00, 50000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9cc95f58-6569-4d04-b048-2b43be5e9ff1', 'd1766166-5cdb-40c8-9e60-6ceeedc456c0', id, 'Cost occurred on purchased product on loan for customers', 0.00, 8000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI058
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b5e80a3b-84b8-43fa-93fc-a4ae6d6d19fb', 'JE-000856', '2025-11-20', 'Imported entry', 'JV-LCI058', 'financing_disbursement', 104400.00, 104400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '445ae401-bbcc-4f3c-a785-aee8d5f8b025', 'b5e80a3b-84b8-43fa-93fc-a4ae6d6d19fb', id, '', 104400.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a9fad6cb-f617-4e3b-a432-7fcd4ca865a7', 'b5e80a3b-84b8-43fa-93fc-a4ae6d6d19fb', id, 'Purchased asset for customer on loan', 0.00, 90000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '639d4290-02f3-40d8-b0a4-9d9a57945997', 'b5e80a3b-84b8-43fa-93fc-a4ae6d6d19fb', id, 'Cost occurred on purchased product on loan for customers', 0.00, 14400.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI059
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f1b1aec7-717b-4f03-b70e-a65f30c02cae', 'JE-000857', '2025-11-20', 'Imported entry', 'JV-LCI059', 'financing_disbursement', 58000.00, 58000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a87c0a48-e2b5-4fc4-91d5-3192030a9c64', 'f1b1aec7-717b-4f03-b70e-a65f30c02cae', id, '', 58000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '344d638b-15d3-4595-a010-92c8a1cd8054', 'f1b1aec7-717b-4f03-b70e-a65f30c02cae', id, 'Purchased asset for customer on loan', 0.00, 50000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2a3e1e85-0645-4845-8de6-d2497f8519c3', 'f1b1aec7-717b-4f03-b70e-a65f30c02cae', id, 'Cost occurred on purchased product on loan for customers', 0.00, 8000.00 FROM accounts WHERE account_code = '20900';

-- Entry: JV-792
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d8283da6-bbd8-4a31-8ec0-810b166bba43', 'JE-000858', '2025-11-20', 'Cash Withdrawal from Azizi Bank by Latifullah Cheque # 02065401', 'JV-JV-792', 'journal_entry', 105940.00, 105940.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'df949953-f34a-4fd0-b5eb-8a2e82c10fa4', 'd8283da6-bbd8-4a31-8ec0-810b166bba43', id, 'Cash Withdrawal from Azizi Bank by Latifullah Cheque # 02065401', 100000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3952dc3e-194a-49f0-aead-340e43c949e3', 'd8283da6-bbd8-4a31-8ec0-810b166bba43', id, 'Cash Withdrawal from Azizi Bank by Latifullah Cheque # 02065401', 0.00, 100000.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e93eaac4-d996-438d-aa20-67844c1c7abf', 'd8283da6-bbd8-4a31-8ec0-810b166bba43', id, '', 2460.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '38ac82bf-5aa0-4c8b-83be-c987c7049ed7', 'd8283da6-bbd8-4a31-8ec0-810b166bba43', id, '', 0.00, 2460.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3e074894-3321-4476-a69b-6329f26721c2', 'd8283da6-bbd8-4a31-8ec0-810b166bba43', id, '', 1480.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '77fc7963-7f6f-4eec-8fc4-12e82c3aaaba', 'd8283da6-bbd8-4a31-8ec0-810b166bba43', id, '', 0.00, 1480.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0ec098d7-68aa-437b-b411-6584707eb434', 'd8283da6-bbd8-4a31-8ec0-810b166bba43', id, '', 2000.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd4e3f17c-71b7-4760-9f32-f635e176cb08', 'd8283da6-bbd8-4a31-8ec0-810b166bba43', id, '', 0.00, 2000.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-793
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('81a481be-79bd-4577-b660-ef297e9eb59e', 'JE-000859', '2025-11-20', 'Paid by Hameed ullah Alokozy', 'JV-JV-793', 'journal_entry', 1069.00, 1069.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e3ae3f0-bc56-4d8d-88d5-4576409f0153', '81a481be-79bd-4577-b660-ef297e9eb59e', id, 'Paid by Hameed ullah Alokozy', 443.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '16a20725-7c69-4729-9c04-668fe20d815c', '81a481be-79bd-4577-b660-ef297e9eb59e', id, 'Paid by Hameed ullah Alokozy', 0.00, 443.00 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '458bcc5f-48e8-4c48-9c6a-c474bc311080', '81a481be-79bd-4577-b660-ef297e9eb59e', id, 'Paid by Naqeebullah Hamdard', 266.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7a303a4a-4c34-491e-ac6c-a20f6d987f43', '81a481be-79bd-4577-b660-ef297e9eb59e', id, 'Paid by Naqeebullah Hamdard', 0.00, 266.00 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd6c5bf47-90ce-49e0-b493-acfae257eb8c', '81a481be-79bd-4577-b660-ef297e9eb59e', id, 'Paid by Waserullah', 360.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '04d655da-c6bd-4100-a91a-096ac6b7abaa', '81a481be-79bd-4577-b660-ef297e9eb59e', id, 'Paid by Waserullah', 0.00, 360.00 FROM accounts WHERE account_code = '50300';

-- Entry: JV-794
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1fb39b5f-a833-4217-8549-ba04e0060bec', 'JE-000860', '2025-11-20', 'Paid for last week vegetable expenses for lunch', 'JV-JV-794', 'journal_entry', 940.00, 940.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aa918e91-3c52-4cda-ac9e-c9abd149265e', '1fb39b5f-a833-4217-8549-ba04e0060bec', id, 'Paid for last week vegetable expenses for lunch', 920.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '95d03a62-06cc-48d2-9c09-d8a751c20cac', '1fb39b5f-a833-4217-8549-ba04e0060bec', id, 'Purchased battery', 20.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c7ee82f-b2fd-4c7a-818b-e74096fe5ea0', '1fb39b5f-a833-4217-8549-ba04e0060bec', id, 'Purchased battery', 0.00, 940.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-795
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e0e09530-a729-48d8-b46c-67181ae24c50', 'JE-000861', '2025-11-20', 'Paid taxi charges used by Liaqat to bring cash', 'JV-JV-795', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1dde0dc4-f4ed-401a-8342-87b2ba9d9397', 'e0e09530-a729-48d8-b46c-67181ae24c50', id, 'Paid taxi charges used by Liaqat to bring cash', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6c7bc322-3a27-4639-b3c6-e48bdc1c385d', 'e0e09530-a729-48d8-b46c-67181ae24c50', id, 'Paid taxi charges used by Liaqat to bring cash', 0.00, 150.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-796
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('583a1d9d-5f9d-4baa-92cc-a17ff574d676', 'JE-000862', '2025-11-20', 'Paid for taxi to Ahmad Shahir Mukhtar to collect quotations for a client from the Market', 'JV-JV-796', 'journal_entry', 11520.00, 11520.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '493a159e-052d-4be4-817a-c771f49b3663', '583a1d9d-5f9d-4baa-92cc-a17ff574d676', id, 'Paid for taxi to Ahmad Shahir Mukhtar to collect quotations for a client from the Market', 210.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'df9087e4-d011-4579-b225-2edf0dec1199', '583a1d9d-5f9d-4baa-92cc-a17ff574d676', id, 'Paid for taxi to Ahmad Shahir Mukhtar to collect quotations for a client from the Market', 0.00, 210.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8424657a-4e2f-429c-9ad4-cb985fa08153', '583a1d9d-5f9d-4baa-92cc-a17ff574d676', id, '', 2950.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f660104d-0d3c-4b01-819b-a4834adf30ad', '583a1d9d-5f9d-4baa-92cc-a17ff574d676', id, '', 0.00, 2950.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4a2e137c-9af7-487c-a97f-449c038266ff', '583a1d9d-5f9d-4baa-92cc-a17ff574d676', id, '', 4425.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '92304bc4-8fc1-4683-937d-74f93d9c40bb', '583a1d9d-5f9d-4baa-92cc-a17ff574d676', id, '', 0.00, 4425.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c754f99-97d7-4c62-97aa-e2b0e04f4e58', '583a1d9d-5f9d-4baa-92cc-a17ff574d676', id, '', 3935.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '77b49e03-f7dd-4ff6-acbb-2abbe8a0cef8', '583a1d9d-5f9d-4baa-92cc-a17ff574d676', id, '', 0.00, 3935.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-797
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('dcb18e9e-103f-43c5-ba3c-fe5855a3f0cd', 'JE-000863', '2025-11-22', 'Paid by Wasirullah', 'JV-JV-797', 'journal_entry', 2036.00, 2036.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4500e53b-ac4c-4adb-a153-fcd9b24ec18e', 'dcb18e9e-103f-43c5-ba3c-fe5855a3f0cd', id, 'Paid by Wasirullah', 531.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f54e864b-68fb-4ee9-a5ee-e282e83ece40', 'dcb18e9e-103f-43c5-ba3c-fe5855a3f0cd', id, 'Paid by Wasirullah', 0.00, 531.00 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7669610d-760e-4260-a1dc-9d08fecdf846', 'dcb18e9e-103f-43c5-ba3c-fe5855a3f0cd', id, 'Paid by Sayeedullah', 797.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fb6af3a4-90f8-4594-afab-e5a015f47e4a', 'dcb18e9e-103f-43c5-ba3c-fe5855a3f0cd', id, 'Paid by Sayeedullah', 0.00, 797.00 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0dc9e734-b7b6-46d6-aff7-21917230479d', 'dcb18e9e-103f-43c5-ba3c-fe5855a3f0cd', id, 'Paid by Abul Baqi', 708.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4e2076b6-32f5-4880-b57d-561da80af132', 'dcb18e9e-103f-43c5-ba3c-fe5855a3f0cd', id, 'Paid by Abul Baqi', 0.00, 708.00 FROM accounts WHERE account_code = '50300';

-- Entry: JV-798
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ed2ea014-23be-4b70-828e-2b55f571dab7', 'JE-000864', '2025-11-22', 'Paid for credit card for CCO', 'JV-JV-798', 'journal_entry', 200.00, 200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6c14f197-118d-46f7-b4a8-74e9e5a39fea', 'ed2ea014-23be-4b70-828e-2b55f571dab7', id, 'Paid for credit card for CCO', 200.00, 0.00 FROM accounts WHERE account_code = '60005';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2acf3ade-7ea7-4168-aff7-9d6b71b4fce3', 'ed2ea014-23be-4b70-828e-2b55f571dab7', id, 'Paid for credit card for CCO', 0.00, 200.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-799
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6028e382-efcb-4e66-a2e5-0e29ff12210c', 'JE-000865', '2025-11-22', 'Cash withdrawal from AUB for loan disbursements', 'JV-JV-799', 'journal_entry', 1018450.00, 1018450.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e22b443a-7140-4901-98be-3b0b9495ebf1', '6028e382-efcb-4e66-a2e5-0e29ff12210c', id, 'Cash withdrawal from AUB for loan disbursements', 1000000.00, 0.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd9b487c6-5b6a-4e7f-8f1c-51a2b01fd5b6', '6028e382-efcb-4e66-a2e5-0e29ff12210c', id, 'Cash withdrawal from AUB for loan disbursements', 0.00, 1000000.00 FROM accounts WHERE account_code = '10202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '22790108-c1db-4146-beaf-2d41f981a3a4', '6028e382-efcb-4e66-a2e5-0e29ff12210c', id, '', 7820.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '187f23fc-2401-416b-94c0-c4eb0d780e18', '6028e382-efcb-4e66-a2e5-0e29ff12210c', id, '', 0.00, 7820.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c65bafa5-6b6c-491f-ac2f-586c533931f1', '6028e382-efcb-4e66-a2e5-0e29ff12210c', id, '', 7870.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6715bf76-7c96-4bd1-a615-705a6b7ad99e', '6028e382-efcb-4e66-a2e5-0e29ff12210c', id, '', 0.00, 7870.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ac6e2772-3671-428d-bc68-9a54835dee47', '6028e382-efcb-4e66-a2e5-0e29ff12210c', id, '', 1580.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd11aab48-bb46-43c6-ab57-dc8289a2a790', '6028e382-efcb-4e66-a2e5-0e29ff12210c', id, '', 0.00, 1580.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '540d53e6-6884-43d8-bbcc-bcfa2e20fc2f', '6028e382-efcb-4e66-a2e5-0e29ff12210c', id, '', 1180.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '557c10de-c421-4df5-a7ee-262666357805', '6028e382-efcb-4e66-a2e5-0e29ff12210c', id, '', 0.00, 1180.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-800
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0aa08ff9-b544-40d0-bda4-2591988f266a', 'JE-000866', '2025-11-23', 'Paid by Noor zaman', 'JV-JV-800', 'journal_entry', 3321.00, 3321.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0fabf8a4-509c-4535-aae2-8416841e5048', '0aa08ff9-b544-40d0-bda4-2591988f266a', id, 'Paid by Noor zaman', 1408.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fbe16639-1cae-44c0-a8c2-2dc8b051f239', '0aa08ff9-b544-40d0-bda4-2591988f266a', id, 'Paid by Noor zaman', 0.00, 1408.00 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4c3d6f09-5d6f-40e7-88f9-891c7aa7c217', '0aa08ff9-b544-40d0-bda4-2591988f266a', id, 'Paid by Ataul rahman', 1417.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '88d1a3bd-9166-4397-81a0-4e3a55f0a89f', '0aa08ff9-b544-40d0-bda4-2591988f266a', id, 'Paid by Ataul rahman', 0.00, 1417.00 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fe85746e-a883-4c6f-9409-0dbd47b8a153', '0aa08ff9-b544-40d0-bda4-2591988f266a', id, 'Paid by Naseer', 284.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '65c89d0c-add2-42f7-946f-74c8aa4ff5d2', '0aa08ff9-b544-40d0-bda4-2591988f266a', id, 'Paid by Naseer', 0.00, 284.00 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '567fc8fd-76c1-4695-b6f7-5edb53a82a24', '0aa08ff9-b544-40d0-bda4-2591988f266a', id, 'Paid by Ayoub Khan', 212.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd4780e7b-8b9d-4507-a4e8-f58e929ababf', '0aa08ff9-b544-40d0-bda4-2591988f266a', id, 'Paid by Ayoub Khan', 0.00, 212.00 FROM accounts WHERE account_code = '50300';

-- Entry: JV-801
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c92e9a87-1833-407f-827b-935dcce16680', 'JE-000867', '2025-11-23', 'Cash Received CR# 101 for loan disbursement to Mr. Abdul Majid Nabizada', 'JV-JV-801', 'journal_entry', 400000.00, 400000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '276f35aa-79ee-40fb-bd01-8fdaf5f5bb81', 'c92e9a87-1833-407f-827b-935dcce16680', id, 'Cash Received CR# 101 for loan disbursement to Mr. Abdul Majid Nabizada', 400000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1b81ed26-5a8a-4e26-8c31-23998ce3f12b', 'c92e9a87-1833-407f-827b-935dcce16680', id, 'Cash Received CR# 101 for loan disbursement to Mr. Abdul Majid Nabizada', 0.00, 400000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-802
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5359409d-f391-46ef-8636-8309ede2d0fc', 'JE-000868', '2025-11-23', 'Purchased inventory on Murabaha for Mr. Abdul Majid Nabizada', 'JV-JV-802', 'journal_entry', 400000.00, 400000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c6964f7d-a7b3-4aef-9126-80faafd02f59', '5359409d-f391-46ef-8636-8309ede2d0fc', id, 'Purchased inventory on Murabaha for Mr. Abdul Majid Nabizada', 400000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8f8d852b-0337-4a9c-8763-4375d061dfb9', '5359409d-f391-46ef-8636-8309ede2d0fc', id, 'Purchased inventory on Murabaha for Mr. Abdul Majid Nabizada', 0.00, 400000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-803
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b0c40729-2e4c-429c-a084-8bfc0538038a', 'JE-000869', '2025-11-23', 'Cash withdrawal from AUB for loan disbursement in Jalalabad', 'JV-JV-803', 'journal_entry', 3400000.00, 3400000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '708b3de8-077d-4bb5-9e2e-e8c85c7f222e', 'b0c40729-2e4c-429c-a084-8bfc0538038a', id, 'Cash withdrawal from AUB for loan disbursement in Jalalabad', 2000000.00, 0.00 FROM accounts WHERE account_code = '10103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '70b8b5c1-8635-48f6-9af0-988548d328a8', 'b0c40729-2e4c-429c-a084-8bfc0538038a', id, 'Cash withdrawal from AUB for loan disbursement in Jalalabad', 0.00, 2000000.00 FROM accounts WHERE account_code = '10202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2288f2a0-ac5e-4f16-911f-b5c796ef05ae', 'b0c40729-2e4c-429c-a084-8bfc0538038a', id, 'Received cash back from Jalalabad Branch', 1400000.00, 0.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '78925763-421f-40d7-9655-8943d4660627', 'b0c40729-2e4c-429c-a084-8bfc0538038a', id, 'Received cash back from Jalalabad Branch', 0.00, 1400000.00 FROM accounts WHERE account_code = '10103';

-- Entry: JV-804
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('86605a00-ba35-4f4b-9429-3567df8adcb8', 'JE-000870', '2025-11-23', 'Paid for taxi by Hanifullah for Job announcements', 'JV-JV-804', 'journal_entry', 780.00, 780.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '36f4151c-8ad5-459e-9afb-38163e525853', '86605a00-ba35-4f4b-9429-3567df8adcb8', id, 'Paid for taxi by Hanifullah for Job announcements', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e6c2b0d7-c3e0-408f-9abf-427ed4c3a55e', '86605a00-ba35-4f4b-9429-3567df8adcb8', id, 'Paid for taxi by Hanifullah for Job announcements', 0.00, 40.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b0965b8f-a7d9-43fc-815a-0d05d2b60da8', '86605a00-ba35-4f4b-9429-3567df8adcb8', id, 'Paid for Liquid gas for the office heating', 740.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2df8e876-41cb-4a76-a9d0-7b391f2c4ba5', '86605a00-ba35-4f4b-9429-3567df8adcb8', id, 'Paid for Liquid gas for the office heating', 0.00, 740.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-805
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('02f610ae-0169-4b4e-b7b8-538eb09487ab', 'JE-000871', '2025-11-23', 'Salary Advance paid to Omid Ahmadzai', 'JV-JV-805', 'journal_entry', 20000.00, 20000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '108562ce-3238-4f61-9ab7-6630ec07a824', '02f610ae-0169-4b4e-b7b8-538eb09487ab', id, 'Salary Advance paid to Omid Ahmadzai', 20000.00, 0.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9c7731c3-b0b7-4629-8589-d9fc3fd0568d', '02f610ae-0169-4b4e-b7b8-538eb09487ab', id, 'Salary Advance paid to Omid Ahmadzai', 0.00, 20000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-806
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1f09694f-cb28-429b-a3aa-f23f557846b2', 'JE-000872', '2025-11-23', 'Paid for 5 Job announcements in Jobs.af', 'JV-JV-806', 'journal_entry', 5000.00, 5000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9a78d237-ea8e-4e14-ad33-6592314bec98', '1f09694f-cb28-429b-a3aa-f23f557846b2', id, 'Paid for 5 Job announcements in Jobs.af', 5000.00, 0.00 FROM accounts WHERE account_code = '61605';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '64532b8a-3cf3-4310-ab88-26b5fb827314', '1f09694f-cb28-429b-a3aa-f23f557846b2', id, 'Paid for 5 Job announcements in Jobs.af', 0.00, 5000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-807
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0eb16792-db8c-4c52-a313-24b2914518d0', 'JE-000873', '2025-11-23', 'Paid for the purchase of USB Extender 100, Wireless Mouse, Maintenance of Security Cameras', 'JV-JV-807', 'journal_entry', 3250.00, 3250.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e4d79b65-3441-4f41-a5a9-ea8e93b7d43f', '0eb16792-db8c-4c52-a313-24b2914518d0', id, 'Paid for the purchase of USB Extender 100, Wireless Mouse, Maintenance of Security Cameras', 3250.00, 0.00 FROM accounts WHERE account_code = '61203';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7b8fecf4-1e28-49c6-acb8-2083bf2cc260', '0eb16792-db8c-4c52-a313-24b2914518d0', id, 'Paid for the purchase of USB Extender 100, Wireless Mouse, Maintenance of Security Cameras', 0.00, 3250.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-808
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('857f9629-1584-416c-93e4-f90a017e3fcb', 'JE-000874', '2025-11-23', 'Paid for taxi use by Ahmad Shahir Mukhtar for late office working', 'JV-JV-808', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a009d1d6-bf3b-4dd1-b221-b3a53945ef6b', '857f9629-1584-416c-93e4-f90a017e3fcb', id, 'Paid for taxi use by Ahmad Shahir Mukhtar for late office working', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bdb5e62d-57c2-4b27-8022-e3403fb24d72', '857f9629-1584-416c-93e4-f90a017e3fcb', id, 'Paid for taxi use by Ahmad Shahir Mukhtar for late office working', 0.00, 100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-809
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('647827c7-bfac-4f72-a87b-a9a748f57d81', 'JE-000875', '2025-11-23', 'Paid by Ayoub Khan Shinwari', 'JV-JV-809', 'journal_entry', 568.00, 568.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4df9a11b-e295-46f2-b258-ea3ac6192e9b', '647827c7-bfac-4f72-a87b-a9a748f57d81', id, 'Paid by Ayoub Khan Shinwari', 212.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f59cec28-62c6-47bb-a677-705562ca221e', '647827c7-bfac-4f72-a87b-a9a748f57d81', id, 'Paid by Ayoub Khan Shinwari', 0.00, 212.00 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a1f7bd69-def4-4521-b779-44eb079d50c2', '647827c7-bfac-4f72-a87b-a9a748f57d81', id, 'Paid by Israr Ahmad', 356.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f0eb3c84-2a4d-4ce2-812f-ec2f78ff9a3f', '647827c7-bfac-4f72-a87b-a9a748f57d81', id, 'Paid by Israr Ahmad', 0.00, 356.00 FROM accounts WHERE account_code = '50300';

-- Entry: JV-810
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0e754115-16ca-4052-9cd8-53c722cbbdba', 'JE-000876', '2025-11-23', 'Paid for lunch of staff', 'JV-JV-810', 'journal_entry', 1550.00, 1550.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e9ff6785-4965-4355-9cd4-c1b143a74709', '0e754115-16ca-4052-9cd8-53c722cbbdba', id, 'Paid for lunch of staff', 360.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1435ce95-6d51-49ce-9ed4-f5f5eaf7cf6b', '0e754115-16ca-4052-9cd8-53c722cbbdba', id, 'Paid for lunch of staff', 0.00, 360.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0a73cc2a-3e37-49d7-a1d6-f8f40f5cff1b', '0e754115-16ca-4052-9cd8-53c722cbbdba', id, 'Paid for liquid gas', 740.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6de9e7e6-b11b-4be2-ac29-9a31e65fe5e7', '0e754115-16ca-4052-9cd8-53c722cbbdba', id, 'Paid for liquid gas', 0.00, 740.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '04d90696-4ba5-4a42-b2ab-984ee8931f08', '0e754115-16ca-4052-9cd8-53c722cbbdba', id, 'Paid for lunch of staff', 450.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '53ad8ca8-2215-4e53-bdbb-db8ba91e4f16', '0e754115-16ca-4052-9cd8-53c722cbbdba', id, 'Paid for lunch of staff', 0.00, 450.00 FROM accounts WHERE account_code = '10101';

-- Entry: LCI060
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('24140f06-f736-4df8-b3c2-abc775d36490', 'JE-000877', '2025-11-23', 'Imported entry', 'JV-LCI060', 'financing_disbursement', 465980.00, 465980.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1906ea4b-605c-44fb-8757-22e9bc92f921', '24140f06-f736-4df8-b3c2-abc775d36490', id, '', 464000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '801f8ad3-e169-4ceb-86d2-ec84d8abd1dd', '24140f06-f736-4df8-b3c2-abc775d36490', id, 'Purchased asset for customer on loan', 0.00, 400000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '64c8f843-a09f-48db-ad98-0ffd8bab8da0', '24140f06-f736-4df8-b3c2-abc775d36490', id, 'Cost occurred on purchased product on loan for customers', 0.00, 64000.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c74651d8-599a-4d5c-902d-49c9326cc667', '24140f06-f736-4df8-b3c2-abc775d36490', id, 'Paid second installment', 1980.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a28f3dae-d5a6-41f3-9e74-b934a7e329f9', '24140f06-f736-4df8-b3c2-abc775d36490', id, '', 0.00, 1980.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-811
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1099a6f0-9fe2-4d63-b838-79ae2157bfac', 'JE-000878', '2025-11-24', 'Paid for Mineral water', 'JV-JV-811', 'journal_entry', 1090.00, 1090.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a6d057db-939d-4663-976a-0c2bfbbdedb7', '1099a6f0-9fe2-4d63-b838-79ae2157bfac', id, 'Paid for Mineral water', 440.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4822d963-9709-427e-9410-5929c73ebf2f', '1099a6f0-9fe2-4d63-b838-79ae2157bfac', id, 'Paid for Mineral water', 0.00, 440.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '626c316a-553a-4190-a626-7bc50bebd787', '1099a6f0-9fe2-4d63-b838-79ae2157bfac', id, 'Paid for lunch expenses', 650.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '416e860e-c632-4419-9b2c-6258f1e3b1d8', '1099a6f0-9fe2-4d63-b838-79ae2157bfac', id, 'Paid for lunch expenses', 0.00, 650.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-812
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cde5fbaf-355b-4fdd-81ee-47d09eac79c7', 'JE-000879', '2025-11-24', 'Paid by Mujeeb ul Rahman Safi', 'JV-JV-812', 'journal_entry', 11033.00, 11033.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e7d0d890-e5fb-45a1-8c3e-ed9255faf346', 'cde5fbaf-355b-4fdd-81ee-47d09eac79c7', id, 'Paid by Mujeeb ul Rahman Safi', 266.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '29279d69-f61a-452f-8a42-3203b122e16c', 'cde5fbaf-355b-4fdd-81ee-47d09eac79c7', id, 'Paid by Mujeeb ul Rahman Safi', 0.00, 266.00 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '321a6b14-377b-4e83-8788-8189c8148634', 'cde5fbaf-355b-4fdd-81ee-47d09eac79c7', id, 'Paid by Walikhan Mamoond', 1417.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '56413e4a-a279-4537-a0a8-cc236241eb72', 'cde5fbaf-355b-4fdd-81ee-47d09eac79c7', id, 'Paid by Walikhan Mamoond', 0.00, 1417.00 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cd30a86e-7afe-46db-b4b4-1e414d460aa0', 'cde5fbaf-355b-4fdd-81ee-47d09eac79c7', id, 'Second installment paid', 1480.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e02e3109-3782-47fe-a45b-586538450f1d', 'cde5fbaf-355b-4fdd-81ee-47d09eac79c7', id, '', 0.00, 1480.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ec739fba-11b8-4960-81cd-4141d50b4d0c', 'cde5fbaf-355b-4fdd-81ee-47d09eac79c7', id, '', 7870.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9b95f2ee-6227-47c1-bba3-6acc04ea692f', 'cde5fbaf-355b-4fdd-81ee-47d09eac79c7', id, '', 0.00, 7870.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-813
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('aa6e6400-48de-4808-a73a-ec5491c6a7b9', 'JE-000880', '2025-11-25', 'Paid for lunch expenses', 'JV-JV-813', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5781c2a0-fb56-46c7-ad11-d49fb19af17c', 'aa6e6400-48de-4808-a73a-ec5491c6a7b9', id, 'Paid for lunch expenses', 150.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a03ef4d4-358a-413e-8ff5-5a127561e58a', 'aa6e6400-48de-4808-a73a-ec5491c6a7b9', id, 'Paid for lunch expenses', 0.00, 150.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-814
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('24b1d1f7-1df3-4e97-bf77-ddbdc97bc7f0', 'JE-000881', '2025-11-25', 'Paid for mobile card for Zuhra Nadeem', 'JV-JV-814', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4fb80f8a-911f-456b-a85d-8e1eac5a7712', '24b1d1f7-1df3-4e97-bf77-ddbdc97bc7f0', id, 'Paid for mobile card for Zuhra Nadeem', 100.00, 0.00 FROM accounts WHERE account_code = '60005';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7caf2c6b-e8dd-4595-b7c5-c84e3a3f53f9', '24b1d1f7-1df3-4e97-bf77-ddbdc97bc7f0', id, 'Paid for mobile card for Zuhra Nadeem', 0.00, 100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-815
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7d51b1e1-b01b-49a1-8ee5-74b736c8057c', 'JE-000882', '2025-11-25', 'Cash withdrawal from AUB for Loan disbursements', 'JV-JV-815', 'journal_entry', 500000.00, 500000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bed01476-7931-4ea3-8156-97a37ba1e45b', '7d51b1e1-b01b-49a1-8ee5-74b736c8057c', id, 'Cash withdrawal from AUB for Loan disbursements', 500000.00, 0.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7cfb9b80-9419-44c6-9635-55c688ce8e68', '7d51b1e1-b01b-49a1-8ee5-74b736c8057c', id, 'Cash withdrawal from AUB for Loan disbursements', 0.00, 500000.00 FROM accounts WHERE account_code = '10202';

-- Entry: JV-816
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('09b28e75-01c7-4c01-b73f-5dad4307de11', 'JE-000883', '2025-11-25', 'Cash withdrawal from AUB for loan disbursements', 'JV-JV-816', 'journal_entry', 57320.00, 57320.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c78888a4-0ca6-4f7e-b44f-95a81b731d08', '09b28e75-01c7-4c01-b73f-5dad4307de11', id, 'Cash withdrawal from AUB for loan disbursements', 57320.00, 0.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '72949758-a6dd-4168-af14-9dafe5a9cd5e', '09b28e75-01c7-4c01-b73f-5dad4307de11', id, 'Cash withdrawal from AUB for loan disbursements', 0.00, 57320.00 FROM accounts WHERE account_code = '10202';

-- Entry: JV-817
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('66fc443d-f130-4e82-af8e-51045037a2b8', 'JE-000884', '2025-11-25', 'Paid to taxi to Hanifullah Mommand to visit client business', 'JV-JV-817', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a11caeb4-e5e1-43f7-9657-d7f38da939c1', '66fc443d-f130-4e82-af8e-51045037a2b8', id, 'Paid to taxi to Hanifullah Mommand to visit client business', 500.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '03478ab3-b4d4-4517-8613-cd912a642f76', '66fc443d-f130-4e82-af8e-51045037a2b8', id, 'Paid to taxi to Hanifullah Mommand to visit client business', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-818
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b6afa462-eb2a-421d-9caa-32b0b748696e', 'JE-000885', '2025-11-25', 'Paid to CFO for taxi to DAB for meeting', 'JV-JV-818', 'journal_entry', 730.00, 730.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2a1cce79-3ba1-4abd-bc5b-c357c575ec4a', 'b6afa462-eb2a-421d-9caa-32b0b748696e', id, 'Paid to CFO for taxi to DAB for meeting', 50.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '91fae133-e4d4-4d51-bfc9-9c294aa9afd2', 'b6afa462-eb2a-421d-9caa-32b0b748696e', id, 'Paid to CFO for taxi to DAB for meeting', 0.00, 50.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '72d2f83d-ff7f-43ff-9474-d5360db0e973', 'b6afa462-eb2a-421d-9caa-32b0b748696e', id, 'Paid to liquid gas for the office use', 680.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '92df4295-4b0d-4d7a-bae7-05aaefd53610', 'b6afa462-eb2a-421d-9caa-32b0b748696e', id, 'Paid to liquid gas for the office use', 0.00, 680.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-819
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('eefe8341-b21d-473e-8f19-a94c9be8a550', 'JE-000886', '2025-11-26', 'Cash sent to Kunar for Loan disbursements', 'JV-JV-819', 'journal_entry', 5400000.00, 5400000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f4e443c3-bada-4bd2-b97a-4b10feef0ecb', 'eefe8341-b21d-473e-8f19-a94c9be8a550', id, 'Cash sent to Kunar for Loan disbursements', 4000000.00, 0.00 FROM accounts WHERE account_code = '10104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'de9d8137-0952-47ad-888a-9f0f9745264b', 'eefe8341-b21d-473e-8f19-a94c9be8a550', id, 'Cash sent to Kunar for Loan disbursements', 0.00, 4000000.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '11f9a1e3-8948-4eb5-9136-7b9083cee1f7', 'eefe8341-b21d-473e-8f19-a94c9be8a550', id, 'Cash withdrawal from AUB', 1400000.00, 0.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ae4fcfe1-9e87-4227-9592-d9dffcec679a', 'eefe8341-b21d-473e-8f19-a94c9be8a550', id, 'Cash withdrawal from AUB', 0.00, 1400000.00 FROM accounts WHERE account_code = '10202';

-- Entry: JV-820
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('68c6ea6a-b8b8-44d2-b926-cabde7676d7f', 'JE-000887', '2025-11-26', 'Paid by Hanifullah Tanweer', 'JV-JV-820', 'journal_entry', 2081.00, 2081.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4fe5f620-15d0-42e9-aad3-b81936235427', '68c6ea6a-b8b8-44d2-b926-cabde7676d7f', id, 'Paid by Hanifullah Tanweer', 621.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '047c69f5-018c-4580-9dec-9a23e4c35313', '68c6ea6a-b8b8-44d2-b926-cabde7676d7f', id, 'Paid by Hanifullah Tanweer', 0.00, 621.00 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '95911989-ceee-4207-9e55-b3f8bce0514e', '68c6ea6a-b8b8-44d2-b926-cabde7676d7f', id, 'Paid by Ihsanullah', 1460.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '266d0478-9dc6-403a-a5b1-796b9c71f6d1', '68c6ea6a-b8b8-44d2-b926-cabde7676d7f', id, 'Paid by Ihsanullah', 0.00, 1460.00 FROM accounts WHERE account_code = '50300';

-- Entry: JV-821
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c863426b-2e69-491e-8ccc-9e2f940dc03b', 'JE-000888', '2025-11-26', 'Purchased for inventory for Mr. Hayatullah on Murabaha', 'JV-JV-821', 'journal_entry', 2195000.00, 2195000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4c177e18-cb7b-46a2-a8ea-db458bce775e', 'c863426b-2e69-491e-8ccc-9e2f940dc03b', id, 'Purchased for inventory for Mr. Hayatullah on Murabaha', 175000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a60f5c53-560c-4b0d-8d38-d364a2da0ac7', 'c863426b-2e69-491e-8ccc-9e2f940dc03b', id, 'Purchased for inventory for Mr. Shafiqullah Hemmat on Murabaha', 300000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e223b74c-33b8-4d31-8256-c21d3219f0a2', 'c863426b-2e69-491e-8ccc-9e2f940dc03b', id, 'Purchased for inventory for Mr. Ikramullah on Murabaha', 300000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '44054736-b88d-4042-a38f-216159e55d45', 'c863426b-2e69-491e-8ccc-9e2f940dc03b', id, 'Purchased for inventory for Mr. Muhammad Naeem Khamoosh on Murabaha', 600000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '56f60a87-652e-4ed8-a6b0-b4e4685f7f87', 'c863426b-2e69-491e-8ccc-9e2f940dc03b', id, 'Purchased for inventory for Mr. Hameedullah Mamoond on Murabaha', 90000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e5007026-07a8-4f7c-b988-f01a03aa1f69', 'c863426b-2e69-491e-8ccc-9e2f940dc03b', id, 'Purchased for inventory for Mr. Sukurllah Muhammadi on Murabaha', 120000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ecb20135-ec0c-427f-9b5c-e7cf00e27754', 'c863426b-2e69-491e-8ccc-9e2f940dc03b', id, 'Purchased for inventory for Mr. Abdul Salaam Shinwari on Murabaha', 70000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '95007215-7200-461d-b700-3da1ca0c5ab2', 'c863426b-2e69-491e-8ccc-9e2f940dc03b', id, 'Purchased for inventory for Mr. Faridulah Qazikhil on Murabaha', 100000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8c04b709-25e6-459a-945a-8236b6e15c6c', 'c863426b-2e69-491e-8ccc-9e2f940dc03b', id, 'Purchased for inventory for Mr. Naseer Ahmad Akhundzada on Murabaha', 50000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd137fdb1-d511-41a2-9677-2ed164c48311', 'c863426b-2e69-491e-8ccc-9e2f940dc03b', id, 'Purchased for inventory for Mr. Nisar Qazikhil on Murabaha', 90000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd214ecdd-7ab7-4d23-b5c2-cae96e69f0a9', 'c863426b-2e69-491e-8ccc-9e2f940dc03b', id, 'Purchased for inventory for Mr. Mohammad Bilal Yousofzai on Murabaha', 300000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '944b328d-4c57-407e-8eb8-2a787f1902f1', 'c863426b-2e69-491e-8ccc-9e2f940dc03b', id, 'Purchased for inventory for 11 clients on Murabaha', 0.00, 2195000.00 FROM accounts WHERE account_code = '10104';

-- Entry: JV-822
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('db2743d1-77de-437b-a7fc-fa199cd712b8', 'JE-000889', '2025-11-26', 'Purchased inventory for Mr. Gulagha Shinwari on Murabaha', 'JV-JV-822', 'journal_entry', 560000.00, 560000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cc686bd4-75a7-4283-b558-dee9eed78e78', 'db2743d1-77de-437b-a7fc-fa199cd712b8', id, 'Purchased inventory for Mr. Gulagha Shinwari on Murabaha', 40000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '58cb9226-a45f-4909-a024-fb5a6af4cf63', 'db2743d1-77de-437b-a7fc-fa199cd712b8', id, 'Purchased inventory for Mr. Subhanullah Kohestani on Murabaha', 30000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9dad417c-143a-45e7-9a7d-1d81067e245e', 'db2743d1-77de-437b-a7fc-fa199cd712b8', id, 'Purchased inventory for Mr. Noor Agha on Murabaha', 120000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4e093d29-3244-42c8-ad50-5a37f45c58cd', 'db2743d1-77de-437b-a7fc-fa199cd712b8', id, 'Purchased inventory for Mr. Sobwoon Ashrafi on Murabaha', 70000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eb39edb6-7b63-4e6d-8375-44bec214045c', 'db2743d1-77de-437b-a7fc-fa199cd712b8', id, 'Purchased inventory for Mr. Ali Asghar on Murabaha', 100000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'be04f228-40fb-4b14-bd12-278d5c5488f3', 'db2743d1-77de-437b-a7fc-fa199cd712b8', id, 'Purchased inventory for Mr. Zeerak Safi on Murabaha', 80000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '188729f0-b1c6-413d-9d4d-9b7c1ab02692', 'db2743d1-77de-437b-a7fc-fa199cd712b8', id, 'Purchased inventory for Mr. Jamil Mamoond on Murabaha', 60000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c6c263c4-274c-48ee-9a5d-acefd861ed00', 'db2743d1-77de-437b-a7fc-fa199cd712b8', id, 'Purchased inventory for Mr. Tasal Safi on Murabaha', 60000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0cefac3f-f389-4302-aeda-5dcb5c36c593', 'db2743d1-77de-437b-a7fc-fa199cd712b8', id, 'Purchased inventory for eight Clients on Murabaha', 0.00, 560000.00 FROM accounts WHERE account_code = '10103';

-- Entry: JV-823
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('43033723-e631-4630-b005-e38db74cecf3', 'JE-000890', '2025-11-26', 'Purchased power stip for Omid', 'JV-JV-823', 'journal_entry', 220.00, 220.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '22f31271-b55e-4e61-9764-771dd61ed7c3', '43033723-e631-4630-b005-e38db74cecf3', id, 'Purchased power stip for Omid', 220.00, 0.00 FROM accounts WHERE account_code = '60505';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '00f109fd-9eb0-487c-be8a-09fc6cf9e501', '43033723-e631-4630-b005-e38db74cecf3', id, 'Purchased power stip for Omid', 0.00, 220.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-824
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('917be653-c787-4b9e-bfd2-ca60dc5d6c60', 'JE-000891', '2025-11-26', 'Purchased pressure cooker', 'JV-JV-824', 'journal_entry', 1650.00, 1650.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '40e137b6-8edb-4d60-8c88-2fdbf59372c0', '917be653-c787-4b9e-bfd2-ca60dc5d6c60', id, 'Purchased pressure cooker', 1650.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ed701f9b-1cbb-4e8f-b09e-1290c834908c', '917be653-c787-4b9e-bfd2-ca60dc5d6c60', id, 'Purchased pressure cooker', 0.00, 1650.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-825
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('82ee90af-de8b-43cb-afcb-7502ecc84fac', 'JE-000892', '2025-11-26', 'Paid for dinner for staff late working', 'JV-JV-825', 'journal_entry', 16190.00, 16190.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '524c5ea6-ec57-4b60-bbb1-9b559078f9ee', '82ee90af-de8b-43cb-afcb-7502ecc84fac', id, 'Paid for dinner for staff late working', 4630.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5751d5f4-0524-40d3-bb73-6cbc5e9fde15', '82ee90af-de8b-43cb-afcb-7502ecc84fac', id, 'Paid for dinner for staff late working', 0.00, 4630.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '56a48c73-2ddf-4a9e-b59d-91f27fd3e8a5', '82ee90af-de8b-43cb-afcb-7502ecc84fac', id, '', 3450.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2230a31d-313d-4925-a7a5-6f7218ed9a15', '82ee90af-de8b-43cb-afcb-7502ecc84fac', id, '', 0.00, 3450.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '241f5a56-04b6-4ead-871e-659645f6c9bb', '82ee90af-de8b-43cb-afcb-7502ecc84fac', id, '', 8110.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '79c71dd0-4bbb-41fb-af11-c2c9692a9315', '82ee90af-de8b-43cb-afcb-7502ecc84fac', id, '', 0.00, 8110.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-826
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('547bab9a-5885-4eda-93b0-a6c3f8b22f51', 'JE-000893', '2025-11-27', 'Paid to taxi to Hidayat from Kunar to HQ to Kunar', 'JV-JV-826', 'journal_entry', 1900.00, 1900.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1094c8f6-0f79-4c0b-b59e-714b5c24da22', '547bab9a-5885-4eda-93b0-a6c3f8b22f51', id, 'Paid to taxi to Hidayat from Kunar to HQ to Kunar', 1900.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4b52f1bb-0e1a-40b7-bb95-9fd078ae57a4', '547bab9a-5885-4eda-93b0-a6c3f8b22f51', id, 'Paid to taxi to Hidayat from Kunar to HQ to Kunar', 0.00, 1900.00 FROM accounts WHERE account_code = '10101';

-- Entry: LCI061
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8f52769d-5347-4615-bad4-4d3587caab12', 'JE-000894', '2025-11-27', 'Imported entry', 'JV-LCI061', 'financing_disbursement', 203000.00, 203000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aeb17067-c543-430f-a86f-e588e3cd40ff', '8f52769d-5347-4615-bad4-4d3587caab12', id, '', 203000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '41913dc8-1c22-4a56-b30f-c52f060f7519', '8f52769d-5347-4615-bad4-4d3587caab12', id, 'Purchased asset for customer on loan', 0.00, 175000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c060c55f-806f-43eb-b0ea-982434fe9557', '8f52769d-5347-4615-bad4-4d3587caab12', id, 'Cost occurred on purchased product on loan for customers', 0.00, 28000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI062
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('96487f43-50fe-4229-bbe0-e675bf7b99c3', 'JE-000895', '2025-11-27', 'Imported entry', 'JV-LCI062', 'financing_disbursement', 348000.00, 348000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0763f969-a3f7-49fa-b1b3-e8908b248f7e', '96487f43-50fe-4229-bbe0-e675bf7b99c3', id, '', 348000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '25f04e3b-3db1-44f3-a5d6-44e0b088e2c2', '96487f43-50fe-4229-bbe0-e675bf7b99c3', id, 'Purchased asset for customer on loan', 0.00, 300000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e157568d-cbc0-474e-92fd-6c393629bf0b', '96487f43-50fe-4229-bbe0-e675bf7b99c3', id, 'Cost occurred on purchased product on loan for customers', 0.00, 48000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI063
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c5472183-710f-4664-9775-4e2119b50e9c', 'JE-000896', '2025-11-27', 'Imported entry', 'JV-LCI063', 'financing_disbursement', 348000.00, 348000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '78eb2e65-081c-4928-b389-d399b9dff323', 'c5472183-710f-4664-9775-4e2119b50e9c', id, '', 348000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '32ffb4b5-6ff4-47ce-8c8c-530995dbef36', 'c5472183-710f-4664-9775-4e2119b50e9c', id, 'Purchased asset for customer on loan', 0.00, 300000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f42322bc-7c0d-4c90-810f-a913dd3cf5a9', 'c5472183-710f-4664-9775-4e2119b50e9c', id, 'Cost occurred on purchased product on loan for customers', 0.00, 48000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI064
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e35dad9a-5cd9-4636-8873-977e42576833', 'JE-000897', '2025-11-27', 'Imported entry', 'JV-LCI064', 'financing_disbursement', 696000.00, 696000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9fe4170c-73d7-4818-a3b1-07db7f04786c', 'e35dad9a-5cd9-4636-8873-977e42576833', id, '', 696000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '35afa686-43b0-485c-813a-807813f023bd', 'e35dad9a-5cd9-4636-8873-977e42576833', id, 'Purchased asset for customer on loan', 0.00, 600000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '50305e57-87f9-4537-840c-21d96d5aaabe', 'e35dad9a-5cd9-4636-8873-977e42576833', id, 'Cost occurred on purchased product on loan for customers', 0.00, 96000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI065
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e143edd2-f5c6-4b77-837e-1e0ed13acdf9', 'JE-000898', '2025-11-27', 'Imported entry', 'JV-LCI065', 'financing_disbursement', 104400.00, 104400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '325d2beb-8607-4275-9044-38bc9d6c9d69', 'e143edd2-f5c6-4b77-837e-1e0ed13acdf9', id, '', 104400.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f27d7b74-f4e4-4a34-880a-81698912ee5c', 'e143edd2-f5c6-4b77-837e-1e0ed13acdf9', id, 'Purchased asset for customer on loan', 0.00, 90000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7752c141-7848-4db6-83d6-da5ed54284a3', 'e143edd2-f5c6-4b77-837e-1e0ed13acdf9', id, 'Cost occurred on purchased product on loan for customers', 0.00, 14400.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI066
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1b4f7cd9-1cd2-456d-beea-7766c7e75fb4', 'JE-000899', '2025-11-27', 'Imported entry', 'JV-LCI066', 'financing_disbursement', 139200.00, 139200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e1dd10db-3384-4ed0-8ec6-d3d1c40e0bec', '1b4f7cd9-1cd2-456d-beea-7766c7e75fb4', id, '', 139200.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b74417c0-800f-4cfb-981c-35f273a79c42', '1b4f7cd9-1cd2-456d-beea-7766c7e75fb4', id, 'Purchased asset for customer on loan', 0.00, 120000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a43db438-9cdb-49fd-817a-61e266c4b8c9', '1b4f7cd9-1cd2-456d-beea-7766c7e75fb4', id, 'Cost occurred on purchased product on loan for customers', 0.00, 19200.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI067
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7205809b-b026-470c-89ca-7807f4344881', 'JE-000900', '2025-11-27', 'Imported entry', 'JV-LCI067', 'financing_disbursement', 81200.00, 81200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6f5ed2c1-1d82-49ce-8d1e-597e212e5f94', '7205809b-b026-470c-89ca-7807f4344881', id, '', 81200.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b3c996cc-59a5-4705-a008-1b1051602250', '7205809b-b026-470c-89ca-7807f4344881', id, 'Purchased asset for customer on loan', 0.00, 70000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9f82f6da-369d-4003-bf3e-7b53b858f104', '7205809b-b026-470c-89ca-7807f4344881', id, 'Cost occurred on purchased product on loan for customers', 0.00, 11200.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI068
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cc3161a1-7249-4f32-ae03-43428abffc33', 'JE-000901', '2025-11-27', 'Imported entry', 'JV-LCI068', 'financing_disbursement', 116000.00, 116000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '76d65f8d-f0dc-4336-848a-d0b99e2cd98c', 'cc3161a1-7249-4f32-ae03-43428abffc33', id, '', 116000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '35546267-16a7-426a-ad20-7ee4ce4bb0be', 'cc3161a1-7249-4f32-ae03-43428abffc33', id, 'Purchased asset for customer on loan', 0.00, 100000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ba1a14b2-9c13-4fd5-8732-5cd51ddef627', 'cc3161a1-7249-4f32-ae03-43428abffc33', id, 'Cost occurred on purchased product on loan for customers', 0.00, 16000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI069
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f30af5f4-daea-4d44-ab36-7a28f6ca323b', 'JE-000902', '2025-11-27', 'Imported entry', 'JV-LCI069', 'financing_disbursement', 58000.00, 58000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bd52b535-4ce9-4318-8034-425eb685c04c', 'f30af5f4-daea-4d44-ab36-7a28f6ca323b', id, '', 58000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4bc69553-37be-42af-b624-61dee3322209', 'f30af5f4-daea-4d44-ab36-7a28f6ca323b', id, 'Purchased asset for customer on loan', 0.00, 50000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b3917ccf-31ad-48fa-a01f-df57a1a5f50b', 'f30af5f4-daea-4d44-ab36-7a28f6ca323b', id, 'Cost occurred on purchased product on loan for customers', 0.00, 8000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI070
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a5167f89-7c0f-48d3-b01c-3d469f7422c2', 'JE-000903', '2025-11-27', 'Imported entry', 'JV-LCI070', 'financing_disbursement', 104400.00, 104400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3cd3cd51-1822-4d81-866b-945aaa2235f6', 'a5167f89-7c0f-48d3-b01c-3d469f7422c2', id, '', 104400.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2cc7b8d3-80be-4170-a80b-c5082f0aebdf', 'a5167f89-7c0f-48d3-b01c-3d469f7422c2', id, 'Purchased asset for customer on loan', 0.00, 90000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '69fc0bad-dc7d-4364-8d7a-64d859939fc6', 'a5167f89-7c0f-48d3-b01c-3d469f7422c2', id, 'Cost occurred on purchased product on loan for customers', 0.00, 14400.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI071
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7f4ee190-b95a-4bb3-a989-323b1683b734', 'JE-000904', '2025-11-27', 'Imported entry', 'JV-LCI071', 'financing_disbursement', 348000.00, 348000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a08c38f5-1ad0-4355-a7f4-c1dbe2bddac2', '7f4ee190-b95a-4bb3-a989-323b1683b734', id, '', 348000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1f0cb2ca-72bb-40fe-a6ee-b1bffe8cf050', '7f4ee190-b95a-4bb3-a989-323b1683b734', id, 'Purchased asset for customer on loan', 0.00, 300000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '092d8651-1422-481f-b2a0-96f522dfdb31', '7f4ee190-b95a-4bb3-a989-323b1683b734', id, 'Cost occurred on purchased product on loan for customers', 0.00, 48000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI072
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b3dc6eab-d2be-4acd-9043-e93fb4d9c5a1', 'JE-000905', '2025-11-27', 'Imported entry', 'JV-LCI072', 'financing_disbursement', 46400.00, 46400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '73a58af2-5489-4144-afa2-a4e864e81cbd', 'b3dc6eab-d2be-4acd-9043-e93fb4d9c5a1', id, '', 46400.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '23f056b7-a7c9-4cef-9098-7d47856e5d0d', 'b3dc6eab-d2be-4acd-9043-e93fb4d9c5a1', id, 'Purchased asset for customer on loan', 0.00, 40000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b5ab8908-cda3-4937-a2d9-155f0cb8def1', 'b3dc6eab-d2be-4acd-9043-e93fb4d9c5a1', id, 'Cost occurred on purchased product on loan for customers', 0.00, 6400.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI073
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3915d6ca-eeb1-42ab-b7b8-c31fc56114ed', 'JE-000906', '2025-11-27', 'Imported entry', 'JV-LCI073', 'financing_disbursement', 34800.00, 34800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5df31544-3517-411c-9edb-53c25c0a8631', '3915d6ca-eeb1-42ab-b7b8-c31fc56114ed', id, '', 34800.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bcd8d803-dfbe-4408-8de4-6aadc5672c87', '3915d6ca-eeb1-42ab-b7b8-c31fc56114ed', id, 'Purchased asset for customer on loan', 0.00, 30000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3436644a-5444-453c-ba46-2bfbadf2ae43', '3915d6ca-eeb1-42ab-b7b8-c31fc56114ed', id, 'Cost occurred on purchased product on loan for customers', 0.00, 4800.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI074
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fe0b29a1-700e-42e8-8008-63f348480446', 'JE-000907', '2025-11-27', 'Imported entry', 'JV-LCI074', 'financing_disbursement', 139200.00, 139200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f0818d58-7872-445f-8f4c-94edc5ff2f78', 'fe0b29a1-700e-42e8-8008-63f348480446', id, '', 139200.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '248f7024-18b3-4dd2-9b8c-ef865fa5b148', 'fe0b29a1-700e-42e8-8008-63f348480446', id, 'Purchased asset for customer on loan', 0.00, 120000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '30c0248e-f6a0-4a8a-853d-3bc108a7cc4d', 'fe0b29a1-700e-42e8-8008-63f348480446', id, 'Cost occurred on purchased product on loan for customers', 0.00, 19200.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI075
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bb782224-eaeb-4513-b124-5efe474dae02', 'JE-000908', '2025-11-27', 'Imported entry', 'JV-LCI075', 'financing_disbursement', 81200.00, 81200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ed7200c8-47a1-496f-90e4-4fbb0360eb27', 'bb782224-eaeb-4513-b124-5efe474dae02', id, '', 81200.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5ea5b2c1-0baf-46aa-a644-46354cbc5341', 'bb782224-eaeb-4513-b124-5efe474dae02', id, 'Purchased asset for customer on loan', 0.00, 70000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4bbff299-7154-415c-8a3c-395679b321c4', 'bb782224-eaeb-4513-b124-5efe474dae02', id, 'Cost occurred on purchased product on loan for customers', 0.00, 11200.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI076
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('61b247e5-7ef0-449d-a7e9-e996a73d6968', 'JE-000909', '2025-11-27', 'Imported entry', 'JV-LCI076', 'financing_disbursement', 116000.00, 116000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e4fdaba6-6e63-4346-83d2-23a30e94c936', '61b247e5-7ef0-449d-a7e9-e996a73d6968', id, '', 116000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8ed2f9b6-4d45-4a22-a96e-9629b8b3623d', '61b247e5-7ef0-449d-a7e9-e996a73d6968', id, 'Purchased asset for customer on loan', 0.00, 100000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b3460167-16c6-40e3-bde9-33122354c5c6', '61b247e5-7ef0-449d-a7e9-e996a73d6968', id, 'Cost occurred on purchased product on loan for customers', 0.00, 16000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI077
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('667f004d-5ad9-43e5-b59d-a0a42f5f666a', 'JE-000910', '2025-11-27', 'Imported entry', 'JV-LCI077', 'financing_disbursement', 92800.00, 92800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'adf485ee-5bd0-43e0-968e-e4e0e13601c9', '667f004d-5ad9-43e5-b59d-a0a42f5f666a', id, '', 92800.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '85f3b224-af76-4fa1-8372-95740c28c47a', '667f004d-5ad9-43e5-b59d-a0a42f5f666a', id, 'Purchased asset for customer on loan', 0.00, 80000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f68bc9ab-7df8-408e-aaae-a3701f22f5f0', '667f004d-5ad9-43e5-b59d-a0a42f5f666a', id, 'Cost occurred on purchased product on loan for customers', 0.00, 12800.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI078
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5294e93e-c1a8-4e07-a996-9246e1977dc6', 'JE-000911', '2025-11-27', 'Imported entry', 'JV-LCI078', 'financing_disbursement', 69600.00, 69600.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '006c5e32-caf4-4545-8528-50d1199fe942', '5294e93e-c1a8-4e07-a996-9246e1977dc6', id, '', 69600.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '35ea9285-2b0d-4032-aad4-58415a720106', '5294e93e-c1a8-4e07-a996-9246e1977dc6', id, 'Purchased asset for customer on loan', 0.00, 60000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd759c1a7-3245-44d3-a5d4-e49c9b8a1738', '5294e93e-c1a8-4e07-a996-9246e1977dc6', id, 'Cost occurred on purchased product on loan for customers', 0.00, 9600.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI079
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('50d0d31f-1eec-48a3-bc20-05dd3c1b45b0', 'JE-000912', '2025-11-27', 'Imported entry', 'JV-LCI079', 'financing_disbursement', 69600.00, 69600.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'af836532-5dcf-4816-ba09-c41d0298c0d2', '50d0d31f-1eec-48a3-bc20-05dd3c1b45b0', id, '', 69600.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '43d3aed8-6a6c-40db-b59c-8a22525ec5b7', '50d0d31f-1eec-48a3-bc20-05dd3c1b45b0', id, 'Purchased asset for customer on loan', 0.00, 60000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dd19ee72-965c-4b65-abd5-4431998d0294', '50d0d31f-1eec-48a3-bc20-05dd3c1b45b0', id, 'Cost occurred on purchased product on loan for customers', 0.00, 9600.00 FROM accounts WHERE account_code = '20900';

-- Entry: JV-827
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('374407db-4554-482f-9cfd-cf1c5b6fee52', 'JE-000913', '2025-11-29', 'Paid for lunch expenses', 'JV-JV-827', 'journal_entry', 990.00, 990.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6f8660f1-24a5-473f-bee0-f991f2699ead', '374407db-4554-482f-9cfd-cf1c5b6fee52', id, 'Paid for lunch expenses', 990.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '297b06a2-329d-4883-8615-0477c6694355', '374407db-4554-482f-9cfd-cf1c5b6fee52', id, 'Paid for lunch expenses', 0.00, 990.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-828
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('95fb5e92-05a6-44cd-9f1e-0fb5116add15', 'JE-000914', '2025-11-29', 'Paid for liquid gas for the office use', 'JV-JV-828', 'journal_entry', 935.00, 935.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd5c2bc1d-e455-4386-bf05-803c729365e9', '95fb5e92-05a6-44cd-9f1e-0fb5116add15', id, 'Paid for liquid gas for the office use', 935.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b09cda9c-c36a-496a-876d-a1324a65fd68', '95fb5e92-05a6-44cd-9f1e-0fb5116add15', id, 'Paid for liquid gas for the office use', 0.00, 935.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-829
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4ddc8f81-56f2-401c-9c7f-e6ce9bc091ec', 'JE-000915', '2025-11-29', 'Paid taxi charges used by Ahmad Shahir Mukhhar for quotations collection', 'JV-JV-829', 'journal_entry', 400.00, 400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3594372a-c37f-4715-af45-dd7c8d1fce03', '4ddc8f81-56f2-401c-9c7f-e6ce9bc091ec', id, 'Paid taxi charges used by Ahmad Shahir Mukhhar for quotations collection', 200.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2b1c67ec-033d-4f82-a64b-4d934da463aa', '4ddc8f81-56f2-401c-9c7f-e6ce9bc091ec', id, 'Paid taxi charges used by Ahmad Shahir Mukhhar for quotations collection', 0.00, 200.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a772781f-4333-4a96-9382-48964ab50dde', '4ddc8f81-56f2-401c-9c7f-e6ce9bc091ec', id, 'Purchased computer portable mouse for office use', 200.00, 0.00 FROM accounts WHERE account_code = '61207';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3797b60f-f85c-4e85-b1c5-927341bd66d4', '4ddc8f81-56f2-401c-9c7f-e6ce9bc091ec', id, 'Purchased computer portable mouse for office use', 0.00, 200.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-830
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e75c47bf-ea03-4d1a-a3e4-b6e6b30b602c', 'JE-000916', '2025-11-29', 'Purchased Inventory for Mr. Rafiullah on Murabaha', 'JV-JV-830', 'journal_entry', 1020000.00, 1020000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4492b744-abe5-4722-893c-d3f55fd38654', 'e75c47bf-ea03-4d1a-a3e4-b6e6b30b602c', id, 'Purchased Inventory for Mr. Rafiullah on Murabaha', 250000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6094a785-6f83-4f7b-93d6-4c195ca5845e', 'e75c47bf-ea03-4d1a-a3e4-b6e6b30b602c', id, 'Purchased Inventory for Mr. Hazeerull Stoman on Murabaha', 120000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b872aee5-0173-49c8-ade3-6123373cb832', 'e75c47bf-ea03-4d1a-a3e4-b6e6b30b602c', id, 'Purchased Inventory for Mr. Gul Omar Ameerzada on Murabaha', 350000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd528e000-ad5f-4115-8f49-ff2f7c6d42a1', 'e75c47bf-ea03-4d1a-a3e4-b6e6b30b602c', id, 'Purchased Inventory for Mr. Akbar Khan Safi on Murabaha', 250000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f8c16fa6-57d2-43ee-a864-aef0671e724d', 'e75c47bf-ea03-4d1a-a3e4-b6e6b30b602c', id, 'Purchased Inventory for Mr. Mohammad Fahim Pardis', 50000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2e0e31f5-da6d-47dc-9bf9-28665de0f746', 'e75c47bf-ea03-4d1a-a3e4-b6e6b30b602c', id, 'Purchased Inventory for 5 Clients on Murabaha', 0.00, 1020000.00 FROM accounts WHERE account_code = '10104';

-- Entry: JV-831
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('df1878db-5aee-4514-b227-0882fe58d62f', 'JE-000917', '2025-11-29', 'Paid by Mr. Laiq Ashan', 'JV-JV-831', 'journal_entry', 454.00, 454.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7c30aac0-523e-4615-ae46-042f959d64c2', 'df1878db-5aee-4514-b227-0882fe58d62f', id, 'Paid by Mr. Laiq Ashan', 454.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '96aefa8e-c91f-48fb-aa88-2c936208d6d9', 'df1878db-5aee-4514-b227-0882fe58d62f', id, 'Paid by Mr. Laiq Ashan', 0.00, 454.00 FROM accounts WHERE account_code = '50300';

-- Entry: LCI080
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('86b7294e-1f4f-43d9-9125-7bb066a51f2e', 'JE-000918', '2025-11-29', 'Imported entry', 'JV-LCI080', 'financing_disbursement', 290000.00, 290000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0062ea97-b387-4f05-a002-bfc7d5b38711', '86b7294e-1f4f-43d9-9125-7bb066a51f2e', id, '', 290000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cf6e78ea-4734-414d-9204-afd72316c84b', '86b7294e-1f4f-43d9-9125-7bb066a51f2e', id, 'Purchased asset for customer on loan', 0.00, 250000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7adb703c-4cce-4e47-838f-9474bb0f84ca', '86b7294e-1f4f-43d9-9125-7bb066a51f2e', id, 'Cost occurred on purchased product on loan for customers', 0.00, 40000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI081
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e8876aa1-a0ba-42b3-bac5-b29e7430aa24', 'JE-000919', '2025-11-29', 'Imported entry', 'JV-LCI081', 'financing_disbursement', 139200.00, 139200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '67ca0b6a-c3ec-454d-9045-909b3166fcc0', 'e8876aa1-a0ba-42b3-bac5-b29e7430aa24', id, '', 139200.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ba3ade34-f96a-4727-ab31-95e3f8329c5e', 'e8876aa1-a0ba-42b3-bac5-b29e7430aa24', id, 'Purchased asset for customer on loan', 0.00, 120000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '90fa3adc-9819-4013-88b1-2552b88a88ae', 'e8876aa1-a0ba-42b3-bac5-b29e7430aa24', id, 'Cost occurred on purchased product on loan for customers', 0.00, 19200.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI082
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c58636a0-cc79-4c64-b88f-3acd987bd8bc', 'JE-000920', '2025-11-29', 'Imported entry', 'JV-LCI082', 'financing_disbursement', 406000.00, 406000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '60351e5e-be5d-4799-847b-2fc87c88070b', 'c58636a0-cc79-4c64-b88f-3acd987bd8bc', id, '', 406000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7ebdc662-2426-4242-a605-f349adffab8b', 'c58636a0-cc79-4c64-b88f-3acd987bd8bc', id, 'Purchased asset for customer on loan', 0.00, 350000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0e7c070f-6627-4901-a6cb-c0b64cedace4', 'c58636a0-cc79-4c64-b88f-3acd987bd8bc', id, 'Cost occurred on purchased product on loan for customers', 0.00, 56000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI083
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fdc4218c-8e56-436d-bfeb-8fbef533ce77', 'JE-000921', '2025-11-29', 'Imported entry', 'JV-LCI083', 'financing_disbursement', 292520.00, 292520.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'faa9e777-b2db-47b4-a72a-b17b1f7f3739', 'fdc4218c-8e56-436d-bfeb-8fbef533ce77', id, '', 290000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '414e3811-dfff-499d-a0d1-8558747f515d', 'fdc4218c-8e56-436d-bfeb-8fbef533ce77', id, 'Purchased asset for customer on loan', 0.00, 250000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '07af3342-3557-41ea-878d-24b070c285cd', 'fdc4218c-8e56-436d-bfeb-8fbef533ce77', id, 'Cost occurred on purchased product on loan for customers', 0.00, 40000.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '73551147-21b0-4095-a9fe-05b1ab79fe0e', 'fdc4218c-8e56-436d-bfeb-8fbef533ce77', id, '', 2520.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f8d27931-bd94-4ccd-96bd-d7f1414b81b2', 'fdc4218c-8e56-436d-bfeb-8fbef533ce77', id, '', 0.00, 2520.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-832
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('485c0d4e-044b-44ed-b797-106916ec56e0', 'JE-000922', '2025-11-30', 'Paid taxi used by Hanifullah Momand to receive documents from DAB', 'JV-JV-832', 'journal_entry', 50.00, 50.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd7f6c825-1fa2-460f-b300-8a442372d05f', '485c0d4e-044b-44ed-b797-106916ec56e0', id, 'Paid taxi used by Hanifullah Momand to receive documents from DAB', 50.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5a396ef2-e0bf-4bda-b58c-2a359b7e5f0c', '485c0d4e-044b-44ed-b797-106916ec56e0', id, 'Paid taxi used by Hanifullah Momand to receive documents from DAB', 0.00, 50.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-833
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a31511b8-1d91-4304-bee7-899aef6162fc', 'JE-000923', '2025-11-30', 'Paid for the purchase of liquid gas', 'JV-JV-833', 'journal_entry', 1050.00, 1050.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4a2ffec6-0efa-424f-a1b8-e4569d0f315c', 'a31511b8-1d91-4304-bee7-899aef6162fc', id, 'Paid for the purchase of liquid gas', 1050.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5cd4ac23-f401-4e12-90cc-7b556fe66f9e', 'a31511b8-1d91-4304-bee7-899aef6162fc', id, 'Paid for the purchase of liquid gas', 0.00, 1050.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-834
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1f9f750f-d10d-47a4-a2b5-cd9adf6ee30a', 'JE-000924', '2025-11-30', 'Purchased Gas/Electronic Heather for the CEO office', 'JV-JV-834', 'journal_entry', 3000.00, 3000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b0d7bb34-379a-4c09-a721-f066a0fb00a2', '1f9f750f-d10d-47a4-a2b5-cd9adf6ee30a', id, 'Purchased Gas/Electronic Heather for the CEO office', 3000.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b7ffd5bc-ad64-4f37-8f6a-a5b305b6c1d6', '1f9f750f-d10d-47a4-a2b5-cd9adf6ee30a', id, 'Purchased Gas/Electronic Heather for the CEO office', 0.00, 3000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-835
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4457494c-2b0c-47eb-96e5-f6c663d52942', 'JE-000925', '2025-11-30', 'Paid for lunch expense', 'JV-JV-835', 'journal_entry', 490.00, 490.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a6ccb1ac-3370-4dd5-b062-869d020697c0', '4457494c-2b0c-47eb-96e5-f6c663d52942', id, 'Paid for lunch expense', 490.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '24ced1ac-edb3-48ef-9c45-0c16a87d8f77', '4457494c-2b0c-47eb-96e5-f6c663d52942', id, 'Paid for lunch expense', 0.00, 490.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-836
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('43fc1989-393e-4add-a057-593c7a34a5e1', 'JE-000926', '2025-11-30', 'Paid by Abdul Ghafoor Payenda Khil', 'JV-JV-836', 'journal_entry', 218.00, 218.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4c4b0e7f-766c-4cec-9e46-282e69e58b35', '43fc1989-393e-4add-a057-593c7a34a5e1', id, 'Paid by Abdul Ghafoor Payenda Khil', 218.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5594d9a4-d36b-4b56-a0e1-92a872f4f5eb', '43fc1989-393e-4add-a057-593c7a34a5e1', id, 'Paid by Abdul Ghafoor Payenda Khil', 0.00, 218.00 FROM accounts WHERE account_code = '50300';

-- Entry: JV-837
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('14be31a5-1587-46f2-a46b-ff969019f1dc', 'JE-000927', '2025-11-30', 'Bank charges for the month of Nov 2025', 'JV-JV-837', 'journal_entry', 1364.37, 1364.37, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7134c4dd-d9c9-4e81-87de-b6361d1babd2', '14be31a5-1587-46f2-a46b-ff969019f1dc', id, 'Bank charges for the month of Nov 2025', 1364.37, 0.00 FROM accounts WHERE account_code = '61801';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'df198aa0-f9f7-42fe-8bc4-c3b4f3f99bbd', '14be31a5-1587-46f2-a46b-ff969019f1dc', id, 'Bank charges for the month of Nov 2025', 0.00, 664.90 FROM accounts WHERE account_code = '10201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e47c0789-8c02-4d5a-9aa8-60e45e0b74ad', '14be31a5-1587-46f2-a46b-ff969019f1dc', id, 'Bank charges for the month of Nov 2025', 0.00, 199.47 FROM accounts WHERE account_code = '10203';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0f8ddb15-501e-4c8e-af68-619e8cc26a3e', '14be31a5-1587-46f2-a46b-ff969019f1dc', id, 'Bank charges for the month of Nov 2025', 0.00, 150.00 FROM accounts WHERE account_code = '10204';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '449cabc2-bfad-44c6-ba08-66594b15caef', '14be31a5-1587-46f2-a46b-ff969019f1dc', id, 'Bank charges for the month of Nov 2025', 0.00, 350.00 FROM accounts WHERE account_code = '10206';

-- Entry: JV-838
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', 'JE-000928', '2025-11-30', 'Kabul Financing officer''s salary payable for the month of Nov 2025', 'JV-JV-838', 'journal_entry', 320838.00, 320838.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '060d281c-b3e1-4f17-9967-d609eb29144a', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'Kabul Financing officer''s salary payable for the month of Nov 2025', 7000.00, 0.00 FROM accounts WHERE account_code = '51200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2228a9f4-3461-4cb4-926a-d8c0fd7e2212', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'Kunar Financing officer''s salary payable for the month of Nov 2025', 6000.00, 0.00 FROM accounts WHERE account_code = '51200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b0cf63b7-1423-4a8f-be74-fec2e724a1b6', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'Jalalabad Financing officer''s salary payable for the month of Nov 2025', 6000.00, 0.00 FROM accounts WHERE account_code = '51200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '075ab701-25e2-4f58-a896-d89885e698f2', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'Jalalabad Financing officer''s salary payable for the month of Nov 2025', 12000.00, 0.00 FROM accounts WHERE account_code = '60001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1b9b7acc-c8ba-4126-b65e-31a16c20fd08', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'Kunar Financing officer''s salary payable for the month of Nov 2025', 6000.00, 0.00 FROM accounts WHERE account_code = '60001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9398705f-f56c-4bb4-9105-e4a62094c8d8', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'HQ Staff salary payable for the month of Nov 2025', 283838.00, 0.00 FROM accounts WHERE account_code = '60001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b2bc1b33-a59e-46a6-b05e-950863178fe4', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'HQ Staff salary payable for the month of Nov 2025', 0.00, 134000.00 FROM accounts WHERE account_code = '20169';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd491f764-5516-4aa5-b688-c504ec09a065', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'HQ Staff salary payable for the month of Nov 2025', 0.00, 23600.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2ada7ecf-0753-4ee5-b0ee-e011118110a2', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'HQ Staff salary payable for the month of Nov 2025', 0.00, 23600.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ac17d4fd-b4bc-4940-a25d-3ba2c2ced32c', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'HQ Staff salary payable for the month of Nov 2025', 0.00, 30000.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '06c357f4-0ccb-463e-8568-47e6286450a3', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'HQ Staff salary payable for the month of Nov 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0e300319-6a01-439a-8ad9-bd6ebd9618c5', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'HQ Staff salary payable for the month of Nov 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '06bf0c5d-14a8-4238-a2c2-3a4dc3cc4490', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'HQ Staff salary payable for the month of Nov 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '020b73d9-5e38-4e32-96a7-7613bfde3757', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'HQ Staff salary payable for the month of Nov 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20170';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '68078b8c-3469-499e-922d-ebbf483d9775', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'HQ Staff salary payable for the month of Nov 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20171';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4be9f171-4a67-4f64-98e2-2ca099eb2f05', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'HQ Staff salary payable for the month of Nov 2025', 0.00, 10000.00 FROM accounts WHERE account_code = '20172';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '79ab266b-6270-47a2-bbc6-be88548118d6', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'HQ Staff salary payable for the month of Nov 2025', 0.00, 9900.00 FROM accounts WHERE account_code = '20177';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '353bfab4-38d2-4323-b3fd-0bf3542f47e8', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'Jalalabad Staff salary payable for the month of Nov 2025', 0.00, 11860.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7ff2239f-ce4e-4070-a65c-907897a2a91e', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'Jalalabad Staff salary payable for the month of Nov 2025', 0.00, 3000.00 FROM accounts WHERE account_code = '20174';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '97738ad9-2c39-4d53-a328-6736a4856812', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'Jalalabad Staff salary payable for the month of Nov 2025', 0.00, 3000.00 FROM accounts WHERE account_code = '20176';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd3b7fa68-9149-4773-a5db-50f8f90bcc90', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'Kunar Staff salary payable for the month of Nov 2025', 0.00, 5980.00 FROM accounts WHERE account_code = '20173';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'feb79af6-2b80-4937-b037-f1f980fcb9a8', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'Kunar Staff salary payable for the month of Nov 2025', 0.00, 5980.00 FROM accounts WHERE account_code = '20175';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd2c92a87-e88f-4ebe-b39a-677e8b6005ae', '535a250f-d1bc-4e8c-ad47-8e1ec7a5810c', id, 'Staff salary withheld for the month of Oct 2025', 0.00, 25118.00 FROM accounts WHERE account_code = '21100';

-- Entry: JV-839
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5eaa0a8f-3668-44fd-be6f-39914567be38', 'JE-000929', '2025-11-30', 'HQ Office rent for the month of Aqrab 1404', 'JV-JV-839', 'journal_entry', 37712.00, 37712.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '743663c5-d10b-41c7-bf3a-ddda9e06d408', '5eaa0a8f-3668-44fd-be6f-39914567be38', id, 'HQ Office rent for the month of Aqrab 1404', 33000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c16aa8eb-2c3a-4a3a-bcd5-c9b7c64b1d0f', '5eaa0a8f-3668-44fd-be6f-39914567be38', id, 'HQ Office rent for the month of Aqrab 1404', 0.00, 3000.00 FROM accounts WHERE account_code = '21200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6362d2ab-ab44-4b12-a799-69cfffe22bff', '5eaa0a8f-3668-44fd-be6f-39914567be38', id, 'HQ Office rent for the month of Aqrab 1404', 0.00, 30000.00 FROM accounts WHERE account_code = '13100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c86fc5a2-39f6-4c04-8007-3bb1b921528e', '5eaa0a8f-3668-44fd-be6f-39914567be38', id, 'Jalalabad Office rent for the month of Aqrab 1404', 3000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7e1c1ec0-516f-4daf-b2a0-ab554b90e1ea', '5eaa0a8f-3668-44fd-be6f-39914567be38', id, 'Jalalabad Office rent for the month of Aqrab 1404', 0.00, 3000.00 FROM accounts WHERE account_code = '13100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6eb338fc-c666-4794-96ae-22600bd7ae0e', '5eaa0a8f-3668-44fd-be6f-39914567be38', id, 'Booking Quickbooks subscription free expense for the month of Nov 2025', 1712.00, 0.00 FROM accounts WHERE account_code = '70000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2075bd00-05e1-406c-8941-a4678648062f', '5eaa0a8f-3668-44fd-be6f-39914567be38', id, 'Booking Quickbooks subscription free expense for the month of Nov 2025', 0.00, 1712.00 FROM accounts WHERE account_code = '13100';

-- Entry: JV-840
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('49f792e2-fccf-4b50-8d12-290e28d4e1d7', 'JE-000930', '2025-11-30', 'Depreciation expense booked for the month of Nov 2025', 'JV-JV-840', 'journal_entry', 21732.47, 21732.47, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bb0af348-9ca5-484d-9f6d-a882b5d96e6c', '49f792e2-fccf-4b50-8d12-290e28d4e1d7', id, 'Depreciation expense booked for the month of Nov 2025', 21732.47, 0.00 FROM accounts WHERE account_code = '61900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9264f4b8-f63e-4fec-9c51-2c61540f5286', '49f792e2-fccf-4b50-8d12-290e28d4e1d7', id, 'Depreciation expense booked for the month of Nov 2025', 0.00, 3764.10 FROM accounts WHERE account_code = '17102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a59f4c36-35af-4f4f-ac2b-44cb1d716965', '49f792e2-fccf-4b50-8d12-290e28d4e1d7', id, 'Depreciation expense booked for the month of Nov 2025', 0.00, 4536.67 FROM accounts WHERE account_code = '17202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '63defc70-694d-47b3-bedd-2ff5836bf891', '49f792e2-fccf-4b50-8d12-290e28d4e1d7', id, 'Depreciation expense booked for the month of Nov 2025', 0.00, 11327.89 FROM accounts WHERE account_code = '17302';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9627854d-c751-432c-9247-1d6119505814', '49f792e2-fccf-4b50-8d12-290e28d4e1d7', id, 'Depreciation expense booked for the month of Nov 2025', 0.00, 2103.81 FROM accounts WHERE account_code = '17502';

-- Entry: JV-841
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0436e25e-ed5c-4dc0-969e-c3847d2b4db5', 'JE-000931', '2025-11-30', 'Booked provision expense for the month of Nov 2025', 'JV-JV-841', 'journal_entry', 101930.00, 101930.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4b75955f-d31f-439e-9473-5ecfea3c8969', '0436e25e-ed5c-4dc0-969e-c3847d2b4db5', id, 'Booked provision expense for the month of Nov 2025', 101930.00, 0.00 FROM accounts WHERE account_code = '80102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd38f4573-c546-4cf2-aa23-fc7b5cee1f16', '0436e25e-ed5c-4dc0-969e-c3847d2b4db5', id, 'Booked provision expense for the month of Nov 2025', 0.00, 101930.00 FROM accounts WHERE account_code = '18000';

-- Entry: LCI084
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e5efd030-d4f9-4341-8eaa-fad4db9248cb', 'JE-000932', '2025-11-30', 'Imported entry', 'JV-LCI084', 'financing_disbursement', 59210.00, 59210.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9a070c56-8749-4499-b913-e7c95a9fe07e', 'e5efd030-d4f9-4341-8eaa-fad4db9248cb', id, '', 58000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b376358f-b261-4fb9-8264-b9234c7c0f84', 'e5efd030-d4f9-4341-8eaa-fad4db9248cb', id, 'Purchased asset for customer on loan', 0.00, 50000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4cebd0ec-127f-48f4-8703-2a99ea11243d', 'e5efd030-d4f9-4341-8eaa-fad4db9248cb', id, 'Cost occurred on purchased product on loan for customers', 0.00, 8000.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '15dba478-d8b0-4610-8e47-63ad583fc83d', 'e5efd030-d4f9-4341-8eaa-fad4db9248cb', id, '', 1210.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '92f75369-5c3d-44e6-be09-554919761882', 'e5efd030-d4f9-4341-8eaa-fad4db9248cb', id, '', 0.00, 1210.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-842
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3c307a8a-6b88-4124-aa55-d723028c2089', 'JE-000933', '2025-12-01', 'Paid for the staff lunch expense', 'JV-JV-842', 'journal_entry', 17588.00, 17588.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e31c7848-3fe4-4aa5-afc1-e4f7936e63f6', '3c307a8a-6b88-4124-aa55-d723028c2089', id, 'Paid for the staff lunch expense', 160.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '73e5cfab-5f4c-4bdf-b223-6cfe28c290eb', '3c307a8a-6b88-4124-aa55-d723028c2089', id, 'Paid for the office lunch expenses', 440.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'efbec3c8-8806-4cd5-a32b-825cca639a03', '3c307a8a-6b88-4124-aa55-d723028c2089', id, 'Paid for the office lunch expenses', 0.00, 600.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aafbb45e-c594-4a61-a14f-ec9413732035', '3c307a8a-6b88-4124-aa55-d723028c2089', id, 'Purchased stationery and ink for epson', 2000.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4e515016-d1ea-42ab-bf17-f4dab48f74dc', '3c307a8a-6b88-4124-aa55-d723028c2089', id, 'Repaired office PC for Kunar office', 350.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '79009a51-d713-4fb4-b948-1b071cc91901', '3c307a8a-6b88-4124-aa55-d723028c2089', id, 'Repaired office PC for Kunar office and puchase of stationery', 0.00, 2350.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '90f776df-2850-44f0-b41a-d79a31e8ba3e', '3c307a8a-6b88-4124-aa55-d723028c2089', id, 'Electricity bill paid for 4 months of Kunar office', 10750.00, 0.00 FROM accounts WHERE account_code = '61101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b2df5e79-9dbe-480a-8065-1a92be7d8e21', '3c307a8a-6b88-4124-aa55-d723028c2089', id, 'Paid for stationery for the Kunar office', 3888.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6aadc8b8-49a3-4424-99f1-d842c488ef8c', '3c307a8a-6b88-4124-aa55-d723028c2089', id, 'Advance clearance by Noor Muhammad', 0.00, 14638.00 FROM accounts WHERE account_code = '20168';

-- Entry: JV-843
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('383cef9e-a965-4183-9bb0-c847f09ca321', 'JE-000934', '2025-12-01', 'Paid for purchase of office small tools', 'JV-JV-843', 'journal_entry', 4310.00, 4310.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'de995349-42cb-4f32-a06b-8e5d9a230246', '383cef9e-a965-4183-9bb0-c847f09ca321', id, 'Paid for purchase of office small tools', 320.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eaac14cd-72a3-432e-a804-4dc4b27f7b82', '383cef9e-a965-4183-9bb0-c847f09ca321', id, 'Paid for purchase of office small tools', 0.00, 320.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'db6081d0-539f-41fa-ac6b-6f0a28a46805', '383cef9e-a965-4183-9bb0-c847f09ca321', id, 'Paid for truck rent and loading and unloading of truck.', 3400.00, 0.00 FROM accounts WHERE account_code = '60804';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '23a7c9bf-a392-492e-8537-a2779746a0ce', '383cef9e-a965-4183-9bb0-c847f09ca321', id, 'Paid for truck rent and loading and unloading of truck.', 590.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c29e6a2a-8a97-4c28-a1e9-207e0f523ac0', '383cef9e-a965-4183-9bb0-c847f09ca321', id, 'Paid for truck rent and loading and unloading of truck.', 0.00, 3990.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-844
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8a28ec7a-fe68-48f0-9b73-6b001c895d92', 'JE-000935', '2025-12-01', 'Taxi used by Latifullah for documents to Azizi Bank', 'JV-JV-844', 'journal_entry', 40400.00, 40400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'edec8248-7c0c-4171-abd5-71e930533c6e', '8a28ec7a-fe68-48f0-9b73-6b001c895d92', id, 'Taxi used by Latifullah for documents to Azizi Bank', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6ccb9076-ba5f-43f9-b80b-613fc6f4a126', '8a28ec7a-fe68-48f0-9b73-6b001c895d92', id, 'Taxi used by Latifullah for documents to Azizi Bank', 0.00, 100.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4197b70e-8be2-4bbc-bb53-a3a4089fdeb5', '8a28ec7a-fe68-48f0-9b73-6b001c895d92', id, 'Purchased blanket, Mattress, pillow for the office use in Kunar', 1300.00, 0.00 FROM accounts WHERE account_code = '60505';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '93f89e1f-e545-4a3a-92de-5e0417fa5340', '8a28ec7a-fe68-48f0-9b73-6b001c895d92', id, 'Paid office rent for the month of Sunbula, Mizan, Aqrab and Qaws 1404', 28000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '74bcf5e0-9548-4266-990d-97cba7ebfff7', '8a28ec7a-fe68-48f0-9b73-6b001c895d92', id, 'Jadi 1404 office rent prepaid by Noor Muhammad', 7000.00, 0.00 FROM accounts WHERE account_code = '13100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '669d512d-800e-4543-bcc1-3c0e0c5bd1c4', '8a28ec7a-fe68-48f0-9b73-6b001c895d92', id, 'Internet fee paid for the month of Oct and Dec 2025', 4000.00, 0.00 FROM accounts WHERE account_code = '61202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '25864425-c0ab-4625-8d1b-37edf82bfc5f', '8a28ec7a-fe68-48f0-9b73-6b001c895d92', id, 'Advance clearance by Noor Muhammad', 0.00, 40300.00 FROM accounts WHERE account_code = '20168';

-- Entry: JV-845
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a59d3b77-1d0e-4e37-8979-dab51ce1e799', 'JE-000936', '2025-12-01', 'Purchase of sheep for charity', 'JV-JV-845', 'journal_entry', 21960.00, 21960.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c7f1a496-eb07-4583-a5ce-cc5c475b8170', 'a59d3b77-1d0e-4e37-8979-dab51ce1e799', id, 'Purchase of sheep for charity', 15000.00, 0.00 FROM accounts WHERE account_code = '80103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd1e39a64-b86d-49e4-9838-d0ae075e7eea', 'a59d3b77-1d0e-4e37-8979-dab51ce1e799', id, 'Purchase of sheep for charity', 0.00, 15000.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '17f1a568-5a81-4cfa-828a-e4b7f8baf326', 'a59d3b77-1d0e-4e37-8979-dab51ce1e799', id, 'Salary paid for Mr. Afzal for the month of Nov 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a041bbe1-2ef0-4eaf-9883-af8361c1bd00', 'a59d3b77-1d0e-4e37-8979-dab51ce1e799', id, 'Salary paid for Mr. Afzal for the month of Nov 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-846
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0f9c6b3d-96bf-4e40-8e2d-ee662f86b978', 'JE-000937', '2025-12-02', 'Cash withdrawal from AUB for Disbursements in Jalalabad', 'JV-JV-846', 'journal_entry', 1500000.00, 1500000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1f95a7ce-22e3-4eaf-9516-80f39bc08e13', '0f9c6b3d-96bf-4e40-8e2d-ee662f86b978', id, 'Cash withdrawal from AUB for Disbursements in Jalalabad', 1500000.00, 0.00 FROM accounts WHERE account_code = '10103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '42ada37e-8f56-49e3-a2fa-03ebcb7c51b7', '0f9c6b3d-96bf-4e40-8e2d-ee662f86b978', id, 'Cash withdrawal from AUB for Disbursements in Jalalabad', 0.00, 1500000.00 FROM accounts WHERE account_code = '10202';

-- Entry: JV-847
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('88f9f6c6-b694-4794-b32b-f1bf16e76e29', 'JE-000938', '2025-12-03', 'Paid for the liquid gas for the kitchen', 'JV-JV-847', 'journal_entry', 15516.00, 15516.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '053f38c1-695a-47e2-906a-f0a6c5692411', '88f9f6c6-b694-4794-b32b-f1bf16e76e29', id, 'Paid for the liquid gas for the kitchen', 716.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dbd2fc08-b206-42ca-80d9-b5a98578558f', '88f9f6c6-b694-4794-b32b-f1bf16e76e29', id, 'Paid for the liquid gas for the kitchen', 0.00, 716.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '09944b69-f2f5-4f6a-9c53-0b1ab0c36a92', '88f9f6c6-b694-4794-b32b-f1bf16e76e29', id, 'Paid commission for the purchase of two cars on Murabaha', 8000.00, 0.00 FROM accounts WHERE account_code = '51400';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1b84df4a-c41d-4ed7-b7a4-e314909e3bec', '88f9f6c6-b694-4794-b32b-f1bf16e76e29', id, 'Paid for three months internet fee of Kunar Branch', 4500.00, 0.00 FROM accounts WHERE account_code = '61202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f068b16e-26f0-41e0-8d3e-ea436a1098c3', '88f9f6c6-b694-4794-b32b-f1bf16e76e29', id, 'Paid for three months electricity bill of Kunar branch', 1300.00, 0.00 FROM accounts WHERE account_code = '61101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bc3f21d3-0fad-4d8b-b870-0d777a8d6d6e', '88f9f6c6-b694-4794-b32b-f1bf16e76e29', id, 'Paid for the branch stationery', 1000.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '602742e6-4b94-461f-a2dd-b7a03c9e4086', '88f9f6c6-b694-4794-b32b-f1bf16e76e29', id, 'Advance clearance by Noor Muhammad', 0.00, 14800.00 FROM accounts WHERE account_code = '20168';

-- Entry: JV-848
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('713c95cf-c125-4d48-9b15-d6387a2aadce', 'JE-000939', '2025-12-03', 'Cash received CR# 103 for staff November salary', 'JV-JV-848', 'journal_entry', 245900.00, 245900.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9e63a80e-77ad-4b1a-807c-ccfcb97c79ba', '713c95cf-c125-4d48-9b15-d6387a2aadce', id, 'Cash received CR# 103 for staff November salary', 245900.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3116e793-e0ad-4629-9418-5543575bda4f', '713c95cf-c125-4d48-9b15-d6387a2aadce', id, 'Cash received CR# 103 for staff November salary', 0.00, 245900.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-849
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f86255dd-43f6-4622-a7b1-d24e0781c37b', 'JE-000940', '2025-12-03', 'Staff November 2025 Salary paid', 'JV-JV-849', 'journal_entry', 247280.00, 247280.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e162f496-6d66-4018-aabc-08ea592bbc19', 'f86255dd-43f6-4622-a7b1-d24e0781c37b', id, 'Staff November 2025 Salary paid', 134000.00, 0.00 FROM accounts WHERE account_code = '20169';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '35854dbd-b30f-4b51-85dc-ab2d78e053be', 'f86255dd-43f6-4622-a7b1-d24e0781c37b', id, 'Staff November 2025 Salary paid', 23600.00, 0.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e074984b-b7b7-4c90-ad1f-6e139cbc1806', 'f86255dd-43f6-4622-a7b1-d24e0781c37b', id, 'Staff November 2025 Salary paid', 23600.00, 0.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '85c7628d-129c-4c4f-86a3-167352148c30', 'f86255dd-43f6-4622-a7b1-d24e0781c37b', id, 'Staff November 2025 Salary paid', 10000.00, 0.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '74f1119a-cde9-4b0a-8b15-f711d2557e5c', 'f86255dd-43f6-4622-a7b1-d24e0781c37b', id, 'Staff November 2025 Salary paid', 6960.00, 0.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '817b8837-1006-42d8-851d-88eee1539ee1', 'f86255dd-43f6-4622-a7b1-d24e0781c37b', id, 'Staff November 2025 Salary paid', 6960.00, 0.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '836f7ced-add3-40e3-ac9d-864c71c0914a', 'f86255dd-43f6-4622-a7b1-d24e0781c37b', id, 'Staff November 2025 Salary paid', 6960.00, 0.00 FROM accounts WHERE account_code = '20171';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a3f0830c-37f3-4aac-b460-a56beb7a1941', 'f86255dd-43f6-4622-a7b1-d24e0781c37b', id, 'Staff November 2025 Salary paid', 6960.00, 0.00 FROM accounts WHERE account_code = '20170';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'df1fdb3b-f591-47bb-8c38-1a9b42048e17', 'f86255dd-43f6-4622-a7b1-d24e0781c37b', id, 'Staff November 2025 Salary paid', 10000.00, 0.00 FROM accounts WHERE account_code = '20172';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1730fc3f-96c1-4a72-9d64-c67af5c71bff', 'f86255dd-43f6-4622-a7b1-d24e0781c37b', id, 'Staff November 2025 Salary paid', 9900.00, 0.00 FROM accounts WHERE account_code = '20177';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bcbf1c6c-01fe-4caf-908f-b073f65a79a4', 'f86255dd-43f6-4622-a7b1-d24e0781c37b', id, 'Staff October 2025 Salary paid', 5980.00, 0.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b67aaae4-c8db-452a-8634-3cf4061cc853', 'f86255dd-43f6-4622-a7b1-d24e0781c37b', id, 'Staff November 2025 Salary paid', 0.00, 244920.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b555e297-3536-4900-9898-d6c29f6ff5bb', 'f86255dd-43f6-4622-a7b1-d24e0781c37b', id, '', 2360.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '95c2f323-cd31-456b-a4c5-02065eafd7d3', 'f86255dd-43f6-4622-a7b1-d24e0781c37b', id, '', 0.00, 2360.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-850
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fab3fbc5-888d-43f3-8e9c-ebb3ff94ea07', 'JE-000941', '2025-12-04', 'Lunch expense paid for the day', 'JV-JV-850', 'journal_entry', 480.00, 480.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '792c22b6-d98b-4bf5-8983-5c35bc95519c', 'fab3fbc5-888d-43f3-8e9c-ebb3ff94ea07', id, 'Lunch expense paid for the day', 480.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '73be48ff-a096-4ab9-a943-21c6c4631ca8', 'fab3fbc5-888d-43f3-8e9c-ebb3ff94ea07', id, 'Lunch expense paid for the day', 0.00, 480.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-851
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d47c4356-d58d-4962-a963-1651eb3b67d4', 'JE-000942', '2025-12-04', 'Cash received CR# 104 for Kunar Staff salary for the month of Nov 2025', 'JV-JV-851', 'journal_entry', 12160.00, 12160.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f71479a0-888c-486f-858e-a4ab92d0816d', 'd47c4356-d58d-4962-a963-1651eb3b67d4', id, 'Cash received CR# 104 for Kunar Staff salary for the month of Nov 2025', 12160.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e4c86659-ae8d-4cac-9860-a6bfa89e01b6', 'd47c4356-d58d-4962-a963-1651eb3b67d4', id, 'Cash received CR# 104 for Kunar Staff salary for the month of Nov 2025', 0.00, 12160.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-852
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('eb210b35-c1b6-4089-af5f-d44122efef05', 'JE-000943', '2025-12-04', 'Kunar staff salary paid for the month of Nov 2025', 'JV-JV-852', 'journal_entry', 12160.00, 12160.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eb7e6a44-8bd9-4318-87a7-292819309379', 'eb210b35-c1b6-4089-af5f-d44122efef05', id, 'Kunar staff salary paid for the month of Nov 2025', 5980.00, 0.00 FROM accounts WHERE account_code = '20173';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '818060cb-7543-4731-b854-eef947ef89e7', 'eb210b35-c1b6-4089-af5f-d44122efef05', id, 'Kunar staff salary paid for the month of Nov 2025', 5980.00, 0.00 FROM accounts WHERE account_code = '20175';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '607f48c5-5f2b-46e9-afad-31c1d5899646', 'eb210b35-c1b6-4089-af5f-d44122efef05', id, 'Paid for Hawala cost for Kunar staff salary Nov 2025 cash transfer', 200.00, 0.00 FROM accounts WHERE account_code = '61807';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3db4869c-b6ba-4d70-88af-9cee7df9ce9d', 'eb210b35-c1b6-4089-af5f-d44122efef05', id, 'Paid for Hawala cost for Kunar staff salary Nov 2025 cash transfer', 0.00, 12160.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-853
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0a3d209a-51dc-46b6-b110-5e4de240610f', 'JE-000944', '2025-12-04', 'Cash received CR# 105 for Jalalabad Staff salary for the month of Nov 2025', 'JV-JV-853', 'journal_entry', 17860.00, 17860.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '77a62594-8380-48e0-9dd3-d6a5ae16b979', '0a3d209a-51dc-46b6-b110-5e4de240610f', id, 'Cash received CR# 105 for Jalalabad Staff salary for the month of Nov 2025', 17860.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3375a62e-8fba-4fa8-a1d1-91c57e82ca35', '0a3d209a-51dc-46b6-b110-5e4de240610f', id, 'Cash received CR# 105 for Jalalabad Staff salary for the month of Nov 2025', 0.00, 17860.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-854
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b1d412ae-2c85-40ab-8440-6f2433eebf33', 'JE-000945', '2025-12-04', 'Jalalabad Staff salary paid for the month of Nov 2025', 'JV-JV-854', 'journal_entry', 17860.00, 17860.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7c27614b-e32e-4f98-b236-756106d2d453', 'b1d412ae-2c85-40ab-8440-6f2433eebf33', id, 'Jalalabad Staff salary paid for the month of Nov 2025', 11860.00, 0.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c3856a59-c4d3-4289-84e2-fc35c5d81414', 'b1d412ae-2c85-40ab-8440-6f2433eebf33', id, 'Jalalabad Staff salary paid for the month of Nov 2025', 3000.00, 0.00 FROM accounts WHERE account_code = '20174';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f963268c-7b41-4ca2-a9c6-004b44e27d68', 'b1d412ae-2c85-40ab-8440-6f2433eebf33', id, 'Jalalabad Staff salary paid for the month of Nov 2025', 3000.00, 0.00 FROM accounts WHERE account_code = '20176';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6ea9d387-dc87-48c0-9627-c3dbb654c7cf', 'b1d412ae-2c85-40ab-8440-6f2433eebf33', id, 'Jalalabad Staff salary paid for the month of Nov 2025', 0.00, 17860.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-855
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('af6cc246-f178-4330-b53d-0cd590a376a2', 'JE-000946', '2025-12-06', 'Paid for mineral water for staff use', 'JV-JV-855', 'journal_entry', 1168.00, 1168.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5f485065-f245-4074-b85e-b1daf0ce0fbf', 'af6cc246-f178-4330-b53d-0cd590a376a2', id, 'Paid for mineral water for staff use', 240.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b8391785-e3f5-45a7-b686-cd62143e4a05', 'af6cc246-f178-4330-b53d-0cd590a376a2', id, 'Paid for mineral water for staff use', 0.00, 240.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '24c0f41a-055f-4b6f-b778-bbbeb8a2f90f', 'af6cc246-f178-4330-b53d-0cd590a376a2', id, 'Paid for liquid gas for the office use', 928.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f9184e40-eb87-41fb-b2c1-fee6b064a132', 'af6cc246-f178-4330-b53d-0cd590a376a2', id, 'Paid for liquid gas for the office use', 0.00, 928.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-856
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('85d773d1-8992-4f48-b69d-a89779c13693', 'JE-000947', '2025-12-06', 'Cash withdrawal from AUB for disbursement in Kunar', 'JV-JV-856', 'journal_entry', 2500000.00, 2500000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bfb58f22-2554-4ac1-98f8-a040b67f1071', '85d773d1-8992-4f48-b69d-a89779c13693', id, 'Cash withdrawal from AUB for disbursement in Kunar', 2500000.00, 0.00 FROM accounts WHERE account_code = '10104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e50870c6-964f-42e9-aa1c-b90ab5808495', '85d773d1-8992-4f48-b69d-a89779c13693', id, 'Cash withdrawal from AUB for disbursement in Kunar', 0.00, 2500000.00 FROM accounts WHERE account_code = '10202';

-- Entry: JV-857
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d867882d-bcde-47d1-ab53-43b699c3ccad', 'JE-000948', '2025-12-07', 'Purchased attendance machine K60 Model ZKTeco SN 207', 'JV-JV-857', 'journal_entry', 7820.00, 7820.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '057d3fda-3d98-4b5b-8f03-585d29048958', 'd867882d-bcde-47d1-ab53-43b699c3ccad', id, 'Purchased attendance machine K60 Model ZKTeco SN 207', 7650.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8b330489-81eb-4cdb-b9b8-9f7dc1ebce64', 'd867882d-bcde-47d1-ab53-43b699c3ccad', id, 'Taxi used to purchase the machine', 170.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '349bd2ff-f8c3-420f-8927-fc9e46b59595', 'd867882d-bcde-47d1-ab53-43b699c3ccad', id, 'Purchased attendance machine K60 Model ZKTeco SN 207', 0.00, 7820.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-858
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2201227a-9ef0-409d-b1af-099c7edf044c', 'JE-000949', '2025-12-07', 'Paid for breads expense for one month to date', 'JV-JV-858', 'journal_entry', 3380.00, 3380.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '12bf34e5-0c17-42d4-b263-0310426bca99', '2201227a-9ef0-409d-b1af-099c7edf044c', id, 'Paid for breads expense for one month to date', 3380.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ed9bfbf0-1730-404b-85e3-1152da9c6085', '2201227a-9ef0-409d-b1af-099c7edf044c', id, 'Paid for breads expense for one month to date', 0.00, 3380.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-859
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('98975576-b241-48d6-847d-4d17a697aa97', 'JE-000950', '2025-12-07', 'Paid for staff lunch expenses', 'JV-JV-859', 'journal_entry', 580.00, 580.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8283946a-b82b-4de0-b19d-5cf43c380bc2', '98975576-b241-48d6-847d-4d17a697aa97', id, 'Paid for staff lunch expenses', 570.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'da9ebd85-9080-4542-b4f1-e04aa84c272e', '98975576-b241-48d6-847d-4d17a697aa97', id, 'Small batteries', 10.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eec88451-f00d-40c0-a840-3a80a2223470', '98975576-b241-48d6-847d-4d17a697aa97', id, 'Paid for staff lunch expenses and small batteries', 0.00, 580.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-860
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fafef1d7-749f-457e-a76e-b0c468eb673f', 'JE-000951', '2025-12-07', 'Paid for taxi used by Hedayatullah from Kunar to Jalalabad to Kabul and return', 'JV-JV-860', 'journal_entry', 1900.00, 1900.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f4f1bdfb-3795-4ded-ba1b-60852eeea348', 'fafef1d7-749f-457e-a76e-b0c468eb673f', id, 'Paid for taxi used by Hedayatullah from Kunar to Jalalabad to Kabul and return', 1900.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b4df8b3a-9dd3-4967-9c05-ba1f63853efe', 'fafef1d7-749f-457e-a76e-b0c468eb673f', id, 'Paid for taxi used by Hedayatullah from Kunar to Jalalabad to Kabul and return', 0.00, 1900.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-861
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6804512f-2955-40c2-aacc-9a8334844732', 'JE-000952', '2025-12-07', 'Cash received CR #106 for Jalalabad office rent, internet, electicity, stationery, taxi, branch food allowances for Nov 2025 and Noor Muhammad travel allowances', 'JV-JV-861', 'journal_entry', 102000.00, 102000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6e71dd1e-9032-441e-8bad-838e557d3944', '6804512f-2955-40c2-aacc-9a8334844732', id, 'Cash received CR #106 for Jalalabad office rent, internet, electicity, stationery, taxi, branch food allowances for Nov 2025 and Noor Muhammad travel allowances', 37100.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8f9b42bf-fcc2-4506-a91e-a06eb71525cf', '6804512f-2955-40c2-aacc-9a8334844732', id, 'Cash received CR #106 for Jalalabad office rent, internet, electicity, stationery, taxi, branch food allowances for Nov 2025 and Noor Muhammad travel allowances', 0.00, 37100.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '243f4e26-c363-4fce-ac25-c3e0d10e4fa2', '6804512f-2955-40c2-aacc-9a8334844732', id, 'Paid for Nov food allowances', 3000.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1c6f63c0-be32-4226-b170-2b8712894c1b', '6804512f-2955-40c2-aacc-9a8334844732', id, 'Advance paid to Noor Muhammad for Jalalabad office rent, internet, electricity, stationery, taxi, and Noor Muhammad travel allowances', 33950.00, 0.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '219e2cab-a29b-41d4-9a15-bcddc42c9f88', '6804512f-2955-40c2-aacc-9a8334844732', id, 'Hawala cost', 150.00, 0.00 FROM accounts WHERE account_code = '61807';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c218ec51-d4fe-4776-a81d-6499816654ec', '6804512f-2955-40c2-aacc-9a8334844732', id, 'Advance paid to Noor Muhammad for Jalalabad office rent, internet, electricity, stationery, taxi, and Noor Muhammad travel allowances', 0.00, 37100.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0ce4f659-bd8c-485c-a73c-d579c663e3dc', '6804512f-2955-40c2-aacc-9a8334844732', id, 'Cash Received CR# 107 for Internet, Electricity, Laptop repair, and office rent for the month of Qaws and Jadi 2025 and staff food allowance for the month of Nov 2025', 13900.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f3c7e1de-35f4-4b6b-8292-239ba2d02915', '6804512f-2955-40c2-aacc-9a8334844732', id, 'Cash Received CR# 107 for Internet, Electricity, Laptop repair, and office rent for the month of Qaws and Jadi 2025 and staff food allowance for the month of Nov 2025', 0.00, 13900.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4684fe67-c7da-4bd3-a09e-4263a41f0f8f', '6804512f-2955-40c2-aacc-9a8334844732', id, 'Food allowance paid for the month of Nov 2025', 3000.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd788e9fe-fc52-478a-8379-24c91ce358bc', '6804512f-2955-40c2-aacc-9a8334844732', id, 'Advance paid to Hedayat for Internet, Electricity, Laptop repair, and office rent for the month of Qaws and Jadi 2025', 10900.00, 0.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3bf27cd3-3a57-47d1-9877-75c7ad81e361', '6804512f-2955-40c2-aacc-9a8334844732', id, 'Advance paid to Hedayat for Internet, Electricity, Laptop repair, and office rent for the month of Qaws and Jadi 2025', 0.00, 13900.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-862
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4b23b6cc-e6cf-4c8f-9c22-03675a9908e1', 'JE-000953', '2025-12-08', 'Paid for stationery for HQ office use', 'JV-JV-862', 'journal_entry', 6795.00, 6795.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '67c70a5e-9a75-40b0-b6f8-6e2f01ab9c7a', '4b23b6cc-e6cf-4c8f-9c22-03675a9908e1', id, 'Paid for stationery for HQ office use', 6795.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aa6982ee-a6c8-4dfc-aa76-f3bfa911a472', '4b23b6cc-e6cf-4c8f-9c22-03675a9908e1', id, 'Paid for stationery for HQ office use', 0.00, 6795.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-863
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e1ad26a2-22c7-4246-a765-d15804a95921', 'JE-000954', '2025-12-08', 'Paid for staff lunch and loading of car', 'JV-JV-863', 'journal_entry', 400.00, 400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '01c672e9-f55a-4300-bb76-2e84506c8a6e', 'e1ad26a2-22c7-4246-a765-d15804a95921', id, 'Paid for staff lunch and loading of car', 350.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a1c7fd07-d480-4549-b73e-3565fd21a1c7', 'e1ad26a2-22c7-4246-a765-d15804a95921', id, 'Paid for staff lunch and loading of car', 50.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '858e3fd8-4f88-4495-a30c-485f0d93a33a', 'e1ad26a2-22c7-4246-a765-d15804a95921', id, 'Paid for staff lunch and loading of car', 0.00, 400.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-864
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b1bd265f-9b3c-4c53-82d5-26e1c602283f', 'JE-000955', '2025-12-08', 'Paid for staff lunch and loading of car', 'JV-JV-864', 'journal_entry', 190.00, 190.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fb30633a-60c1-4df7-8ece-11ab2eda8705', 'b1bd265f-9b3c-4c53-82d5-26e1c602283f', id, 'Paid for staff lunch and loading of car', 190.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd88b3775-95dd-4093-a77e-159815b514ec', 'b1bd265f-9b3c-4c53-82d5-26e1c602283f', id, 'Paid for staff lunch and loading of car', 0.00, 190.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-865
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a974974a-a73d-4056-9667-38ac74fdcf5d', 'JE-000956', '2025-12-08', 'Paid for cleaning items and food expense', 'JV-JV-865', 'journal_entry', 240.00, 240.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '54e73407-d4ea-4644-9c98-a2bc373c270e', 'a974974a-a73d-4056-9667-38ac74fdcf5d', id, 'Paid for cleaning items and food expense', 240.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '100b8f2d-a2bb-45c6-bbea-281af7b4d579', 'a974974a-a73d-4056-9667-38ac74fdcf5d', id, 'Paid for cleaning items and food expense', 0.00, 240.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-866
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('398ac487-9205-49e4-846e-3702040fd8fe', 'JE-000957', '2025-12-08', 'Cash Received for Murabaha Loan Disbursement (CR-110)', 'JV-JV-866', 'journal_entry', 158000.00, 158000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c4a4bf3d-8e29-4c83-8304-6b063241b827', '398ac487-9205-49e4-846e-3702040fd8fe', id, 'Cash Received for Murabaha Loan Disbursement (CR-110)', 158000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '741f3e7a-6b29-44df-8fae-0bc7b10a9ed0', '398ac487-9205-49e4-846e-3702040fd8fe', id, 'Cash Received for Murabaha Loan Disbursement (CR-110)', 0.00, 158000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-867
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3574218d-9f7e-491f-a4e0-6053542ad2f2', 'JE-000958', '2025-12-08', 'Murabaha Loan paid to Zarmina Obaidi', 'JV-JV-867', 'journal_entry', 152566.00, 152566.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8e45d6c9-4d4a-4744-a18f-d4142989f2d4', '3574218d-9f7e-491f-a4e0-6053542ad2f2', id, 'Murabaha Loan paid to Zarmina Obaidi', 150986.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f2eb49ec-9394-4bb7-b7f6-b633c2931776', '3574218d-9f7e-491f-a4e0-6053542ad2f2', id, 'Murabaha Loan paid to Zarmina Obaidi', 0.00, 150986.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ecd180fe-12db-42a3-bccc-a96a77019f72', '3574218d-9f7e-491f-a4e0-6053542ad2f2', id, 'Taxi used for the purchase of inventory', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6a6bfbe2-f5e7-4113-98ab-1722bc456b49', '3574218d-9f7e-491f-a4e0-6053542ad2f2', id, 'Paid for truck rent loading and unloading for Murabaha inventory', 1430.00, 0.00 FROM accounts WHERE account_code = '60804';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ef858a76-43bd-4fd8-a368-531a49669409', '3574218d-9f7e-491f-a4e0-6053542ad2f2', id, 'Paid for truck rent loading and unloading for Murabaha inventory', 0.00, 1580.00 FROM accounts WHERE account_code = '10101';

-- Entry: LCI085
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a4608bcd-e2a3-43dd-9f15-9150713cea90', 'JE-000959', '2025-12-08', 'Imported entry', 'JV-LCI085', 'financing_disbursement', 175144.00, 175144.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '545076db-5352-4026-a786-97212aa16cb0', 'a4608bcd-e2a3-43dd-9f15-9150713cea90', id, '', 175144.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a65127df-c926-4b29-a23c-7846a02c6c2b', 'a4608bcd-e2a3-43dd-9f15-9150713cea90', id, 'Purchased asset for customer on loan', 0.00, 150986.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '292a47a7-84a3-462f-8683-ed305822b073', 'a4608bcd-e2a3-43dd-9f15-9150713cea90', id, 'Cost occurred on purchased product on loan for customers', 0.00, 24158.00 FROM accounts WHERE account_code = '20900';

-- Entry: JV-868
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('84bd51f9-f453-45d7-8778-0284c230904f', 'JE-000960', '2025-12-08', 'Taxi used by Mujeeb u Rahman Barakzai for training in Kabul star Hotel', 'JV-JV-868', 'journal_entry', 200.00, 200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6b7201bf-e466-457e-84c6-fca08f9527bf', '84bd51f9-f453-45d7-8778-0284c230904f', id, 'Taxi used by Mujeeb u Rahman Barakzai for training in Kabul star Hotel', 200.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '30e85bbf-434d-4987-a353-2513e7e69833', '84bd51f9-f453-45d7-8778-0284c230904f', id, 'Taxi used by Mujeeb u Rahman Barakzai for training in Kabul star Hotel', 0.00, 200.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-869
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a7c73918-a611-455d-bb33-25ecfd5536bd', 'JE-000961', '2025-12-09', 'Paid for electricity bill for the month of Aqrab 1404', 'JV-JV-869', 'journal_entry', 381.00, 381.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7b27b362-4427-4a43-9211-4034ecec6592', 'a7c73918-a611-455d-bb33-25ecfd5536bd', id, 'Paid for electricity bill for the month of Aqrab 1404', 381.00, 0.00 FROM accounts WHERE account_code = '61101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f7f0df85-8a15-4b39-96d5-5dfe894aa065', 'a7c73918-a611-455d-bb33-25ecfd5536bd', id, 'Paid for electricity bill for the month of Aqrab 1404', 0.00, 381.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-870
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fb2139ac-0f29-4d6b-ac90-0c8b7ddb6704', 'JE-000962', '2025-12-09', 'Paid internet fee for the month of Dec 2025', 'JV-JV-870', 'journal_entry', 12190.00, 12190.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aa70e607-16a5-44a9-a4f2-281dbbab2c65', 'fb2139ac-0f29-4d6b-ac90-0c8b7ddb6704', id, 'Paid internet fee for the month of Dec 2025', 6000.00, 0.00 FROM accounts WHERE account_code = '61202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b5151a9a-ece9-4c02-8def-2a8d2ba02088', 'fb2139ac-0f29-4d6b-ac90-0c8b7ddb6704', id, 'Paid internet fee for the month of Dec 2025', 0.00, 6000.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c3c01e8-f917-4965-8b75-a03b82fce6f8', 'fb2139ac-0f29-4d6b-ac90-0c8b7ddb6704', id, '', 3030.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '547adcbc-4669-4beb-ac57-0c3ded60e9f7', 'fb2139ac-0f29-4d6b-ac90-0c8b7ddb6704', id, '', 0.00, 3030.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '15b0fca9-d5b1-4aa8-8f9e-44a817a5502f', 'fb2139ac-0f29-4d6b-ac90-0c8b7ddb6704', id, '', 1580.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '13d14dda-642c-428b-8102-54a727057689', 'fb2139ac-0f29-4d6b-ac90-0c8b7ddb6704', id, '', 0.00, 1580.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8c70924a-c99c-4409-b3b4-76d29430e970', 'fb2139ac-0f29-4d6b-ac90-0c8b7ddb6704', id, '', 1580.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f57dd2e0-ad10-4115-a3d0-9021a76a4631', 'fb2139ac-0f29-4d6b-ac90-0c8b7ddb6704', id, '', 0.00, 1580.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-871
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('09a2157c-09ab-458b-80dc-9e8ebbffd996', 'JE-000963', '2025-12-10', 'Cash Withdrawal from Azizi Bank by Latifullah Cheque # 02065403', 'JV-JV-871', 'journal_entry', 60000.00, 60000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7885ef9e-5e5c-4c03-ab35-ee5c4dfc1be8', '09a2157c-09ab-458b-80dc-9e8ebbffd996', id, 'Cash Withdrawal from Azizi Bank by Latifullah Cheque # 02065403', 60000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '50bcda6c-92b5-4778-944a-3954d1ccfc2c', '09a2157c-09ab-458b-80dc-9e8ebbffd996', id, 'Cash Withdrawal from Azizi Bank by Latifullah Cheque # 02065403', 0.00, 60000.00 FROM accounts WHERE account_code = '10206';

-- Entry: JV-872
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('42aca535-c19d-423b-aa72-1caba4096312', 'JE-000964', '2025-12-10', 'Paid for liquid gas for the office warming', 'JV-JV-872', 'journal_entry', 1210.00, 1210.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b72528de-d6ce-4c53-8b7c-5a02fde5ab5f', '42aca535-c19d-423b-aa72-1caba4096312', id, 'Paid for liquid gas for the office warming', 1210.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3367c3cc-a609-46ad-bc7a-d608f3318438', '42aca535-c19d-423b-aa72-1caba4096312', id, 'Paid for liquid gas for the office warming', 0.00, 1210.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-873
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e7af1ccc-f543-4eba-a724-035cf787b7b7', 'JE-000965', '2025-12-10', 'Paid for purchase of 3 power extensions', 'JV-JV-873', 'journal_entry', 360.00, 360.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '60b8c349-d2a6-4576-8d47-c18600029e4d', 'e7af1ccc-f543-4eba-a724-035cf787b7b7', id, 'Paid for purchase of 3 power extensions', 360.00, 0.00 FROM accounts WHERE account_code = '60505';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7a1b2556-2a76-4e0f-8b0d-9934dd78b710', 'e7af1ccc-f543-4eba-a724-035cf787b7b7', id, 'Paid for purchase of 3 power extensions', 0.00, 360.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-874
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a66e3407-41b8-4e76-bb5a-638f89711f50', 'JE-000966', '2025-12-10', 'Paid for the maintenance of biometric attendance machine', 'JV-JV-874', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '65c5a571-5c85-473c-a85f-738652212dc0', 'a66e3407-41b8-4e76-bb5a-638f89711f50', id, 'Paid for the maintenance of biometric attendance machine', 500.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'de718c3f-f17f-4bc3-85a9-4313744445e6', 'a66e3407-41b8-4e76-bb5a-638f89711f50', id, 'Paid for the maintenance of biometric attendance machine', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-875
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('26ae6431-8d9f-4d93-bfe5-033d945714f8', 'JE-000967', '2025-12-10', 'Purchased three Dell 7410 Core I5 10th Generation 16GB RAM, 512GB SSD Laptop for the office use', 'JV-JV-875', 'journal_entry', 46500.00, 46500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '67287cbc-f592-4303-97c4-9c5ab658f873', '26ae6431-8d9f-4d93-bfe5-033d945714f8', id, 'Purchased three Dell 7410 Core I5 10th Generation 16GB RAM, 512GB SSD Laptop for the office use', 46500.00, 0.00 FROM accounts WHERE account_code = '17101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '694cd8cc-6532-48ff-9313-43fce7141cdb', '26ae6431-8d9f-4d93-bfe5-033d945714f8', id, 'Purchased three Dell 7410 Core I5 10th Generation 16GB RAM, 512GB SSD Laptop for the office use', 0.00, 46500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-876
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6f04be19-38f9-4b1b-9614-c2f27ae10dff', 'JE-000968', '2025-12-10', 'Purchased one mouse and 2 mouse pads for the finance department', 'JV-JV-876', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3a032476-1bc9-483a-9758-cae521933691', '6f04be19-38f9-4b1b-9614-c2f27ae10dff', id, 'Purchased one mouse and 2 mouse pads for the finance department', 300.00, 0.00 FROM accounts WHERE account_code = '61207';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a6000cdd-dd01-4e56-b000-0ebd0e3a5c93', '6f04be19-38f9-4b1b-9614-c2f27ae10dff', id, 'Purchased one mouse and 2 mouse pads for the finance department', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-877
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fd8eba60-d577-4e20-93b2-4b4cc9b4d3a2', 'JE-000969', '2025-12-11', 'Purchased Contract cover for MISFA contract', 'JV-JV-877', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '61519110-1a09-4d4b-a011-13144e9130a7', 'fd8eba60-d577-4e20-93b2-4b4cc9b4d3a2', id, 'Purchased Contract cover for MISFA contract', 300.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '741efaf6-e689-4a6b-b5f9-831fc4e2adc8', 'fd8eba60-d577-4e20-93b2-4b4cc9b4d3a2', id, 'Purchased Contract cover for MISFA contract', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-878
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2fde6e07-b26c-4bab-8b0f-77e63a15b036', 'JE-000970', '2025-12-11', 'Taxi used by Liaqat for Shahr e Now and Qalai e Fathullah for the office work', 'JV-JV-878', 'journal_entry', 200.00, 200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e2a5806-9659-40c2-9384-c2be323bb86e', '2fde6e07-b26c-4bab-8b0f-77e63a15b036', id, 'Taxi used by Liaqat for Shahr e Now and Qalai e Fathullah for the office work', 200.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '252a725d-aab2-4105-93f2-513a0a3d5cd6', '2fde6e07-b26c-4bab-8b0f-77e63a15b036', id, 'Taxi used by Liaqat for Shahr e Now and Qalai e Fathullah for the office work', 0.00, 200.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-879
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0b3dd627-b4b3-406d-b853-58d947dfd48d', 'JE-000971', '2025-12-11', 'Taxi used by Gulzar for purchase of Contract cover for MISFA', 'JV-JV-879', 'journal_entry', 90.00, 90.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '871a5c9e-0212-4a99-a344-c2e8ce0ecfb6', '0b3dd627-b4b3-406d-b853-58d947dfd48d', id, 'Taxi used by Gulzar for purchase of Contract cover for MISFA', 90.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '54787644-52f4-4209-8992-7c5b3cda685d', '0b3dd627-b4b3-406d-b853-58d947dfd48d', id, 'Taxi used by Gulzar for purchase of Contract cover for MISFA', 0.00, 90.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-880
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('63d67808-5d18-4577-ae86-03592118017d', 'JE-000972', '2025-12-13', 'Paid for the purchase of meal for guests', 'JV-JV-880', 'journal_entry', 1890.00, 1890.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd7936a3d-6978-4e70-9930-b8da44207536', '63d67808-5d18-4577-ae86-03592118017d', id, 'Paid for the purchase of meal for guests', 1890.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8d7dc276-322a-427e-9bae-85735a4f263c', '63d67808-5d18-4577-ae86-03592118017d', id, 'Paid for the purchase of meal for guests', 0.00, 1890.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-881
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0e12b074-5712-4b4a-9b30-b34dc057eadf', 'JE-000973', '2025-12-13', 'Paid for Liquid gas', 'JV-JV-881', 'journal_entry', 750.00, 750.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '66004087-fc2e-4006-ab47-f67a74d07e00', '0e12b074-5712-4b4a-9b30-b34dc057eadf', id, 'Paid for Liquid gas', 750.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1a178f14-c29e-4de9-b66a-3a55507f376d', '0e12b074-5712-4b4a-9b30-b34dc057eadf', id, 'Paid for Liquid gas', 0.00, 750.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-882
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5af0c44f-742e-4a1d-ba0e-ce2e98ce969e', 'JE-000974', '2025-12-13', 'Paid for lunch expense of staff', 'JV-JV-882', 'journal_entry', 690.00, 690.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8621166a-53d5-4e3c-b3c1-5b9caf4e6dd6', '5af0c44f-742e-4a1d-ba0e-ce2e98ce969e', id, 'Paid for lunch expense of staff', 690.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5d56ab26-7c4d-4755-a3c1-14817c5fb412', '5af0c44f-742e-4a1d-ba0e-ce2e98ce969e', id, 'Paid for lunch expense of staff', 0.00, 690.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-883
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('21e09c77-f9e9-4e70-8ec1-afcdd80de016', 'JE-000975', '2025-12-13', 'Paid for taxi used by Guzar, Omid Ahmadzai, Liaqat Ogra Khil and Wahidullah for the purchase of furniture', 'JV-JV-883', 'journal_entry', 450.00, 450.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1959647f-5a82-4fb6-9600-71ca8f1f779c', '21e09c77-f9e9-4e70-8ec1-afcdd80de016', id, 'Paid for taxi used by Guzar, Omid Ahmadzai, Liaqat Ogra Khil and Wahidullah for the purchase of furniture', 450.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6367c81c-e777-447b-b43e-5f3a1f7c60d7', '21e09c77-f9e9-4e70-8ec1-afcdd80de016', id, 'Paid for taxi used by Guzar, Omid Ahmadzai, Liaqat Ogra Khil and Wahidullah for the purchase of furniture', 0.00, 450.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-884
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cb432a8d-57a6-4741-b792-2b4cdfe467f4', 'JE-000976', '2025-12-14', 'Paid for refreshment for guests', 'JV-JV-884', 'journal_entry', 180.00, 180.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '148122e3-f576-4ad1-b4d5-b7c7d4861e3a', 'cb432a8d-57a6-4741-b792-2b4cdfe467f4', id, 'Paid for refreshment for guests', 180.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c74bf056-cc10-4655-9e97-50f3423e379f', 'cb432a8d-57a6-4741-b792-2b4cdfe467f4', id, 'Paid for refreshment for guests', 0.00, 180.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-885
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d60b46f1-22a3-4d26-9b5a-45575b759773', 'JE-000977', '2025-12-14', 'Paid for lunch expense and purchase of cells', 'JV-JV-885', 'journal_entry', 420.00, 420.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '69651583-58e5-4df2-912f-e4293f7f44f3', 'd60b46f1-22a3-4d26-9b5a-45575b759773', id, 'Paid for lunch expense and purchase of cells', 420.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4c62d95d-9af1-419f-991e-ee17b70d2006', 'd60b46f1-22a3-4d26-9b5a-45575b759773', id, 'Paid for lunch expense and purchase of cells', 0.00, 420.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-886
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('51d5cca6-cdd3-459b-918a-dcc2f42662c5', 'JE-000978', '2025-12-14', 'Withdrawal from AUB AFN Account', 'JV-JV-886', 'journal_entry', 23500.00, 23500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd9e47b57-a4ac-4f63-9dff-884ce3a2af33', '51d5cca6-cdd3-459b-918a-dcc2f42662c5', id, 'Withdrawal from AUB AFN Account', 23500.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bc74f676-30f5-4c7a-a142-d4ddb394d199', '51d5cca6-cdd3-459b-918a-dcc2f42662c5', id, 'Withdrawal from AUB AFN Account', 0.00, 23500.00 FROM accounts WHERE account_code = '10202';

-- Entry: JV-887
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2585a22b-78d1-4e03-a121-3d3482f1b6df', 'JE-000979', '2025-12-14', 'Purchased hanging files for the customer''s files', 'JV-JV-887', 'journal_entry', 14050.00, 14050.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9bf3cecc-946a-474a-8fe8-5025455fd386', '2585a22b-78d1-4e03-a121-3d3482f1b6df', id, 'Purchased hanging files for the customer''s files', 2550.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '29e5fdc8-24e0-4092-b422-4b93df5b9dd7', '2585a22b-78d1-4e03-a121-3d3482f1b6df', id, 'Purchased 2 file cabinets for customer''s file storages', 7500.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '52a27c1b-2c52-4930-9ca4-a8e4faa70118', '2585a22b-78d1-4e03-a121-3d3482f1b6df', id, 'Purchased one office chair', 4000.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e090f455-c662-4693-b4c0-f6611e4768e3', '2585a22b-78d1-4e03-a121-3d3482f1b6df', id, 'Purchased one office chair', 0.00, 14050.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-888
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f872f147-260a-4daf-85fb-1de94bb738b2', 'JE-000980', '2025-12-15', 'Purchased monthly food for staff lunch', 'JV-JV-888', 'journal_entry', 4120.00, 4120.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '14579ab7-2415-4a55-9e20-7c58e65bf418', 'f872f147-260a-4daf-85fb-1de94bb738b2', id, 'Purchased monthly food for staff lunch', 4120.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '12419508-e22f-4ded-95bd-be8a40964508', 'f872f147-260a-4daf-85fb-1de94bb738b2', id, 'Purchased monthly food for staff lunch', 0.00, 4120.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-889
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bfdd4d04-6676-4280-9490-4c680c15506f', 'JE-000981', '2025-12-15', 'Purchased thermos, plastic tray, tea glasses, plates and feeder for the kitchen', 'JV-JV-889', 'journal_entry', 3200.00, 3200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a8202756-93ea-48b8-a0d8-52e427aa8085', 'bfdd4d04-6676-4280-9490-4c680c15506f', id, 'Purchased thermos, plastic tray, tea glasses, plates and feeder for the kitchen', 1610.00, 0.00 FROM accounts WHERE account_code = '60503';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5ff7be65-2a90-4813-8214-b567ade056f9', 'bfdd4d04-6676-4280-9490-4c680c15506f', id, 'Purchased dustbin', 100.00, 0.00 FROM accounts WHERE account_code = '60505';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '941bead2-0518-4431-81c7-40ce94b51f57', 'bfdd4d04-6676-4280-9490-4c680c15506f', id, 'Paid for lunch food', 110.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ba34357f-55ff-4da1-901b-6021893eb962', 'bfdd4d04-6676-4280-9490-4c680c15506f', id, 'Paid for gas for the office worming', 460.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3dab630e-e3c2-413e-ace4-e2a7d3f1753c', 'bfdd4d04-6676-4280-9490-4c680c15506f', id, 'Purchased some items for repairing and plumbing work', 920.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7e36925b-ae3c-476a-b9d7-8a7643e61824', 'bfdd4d04-6676-4280-9490-4c680c15506f', id, 'Purchased some items for repairing and plumbing work', 0.00, 3200.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-890
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('286a6c70-3fcb-4e64-97b2-c125c1f57ced', 'JE-000982', '2025-12-15', 'Salary advance paid to Liaqat Ogra Khil', 'JV-JV-890', 'journal_entry', 20300.00, 20300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '019c4590-e8cf-4ebb-968b-61c97b1ff314', '286a6c70-3fcb-4e64-97b2-c125c1f57ced', id, 'Salary advance paid to Liaqat Ogra Khil', 4000.00, 0.00 FROM accounts WHERE account_code = '20171';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6ef17a23-b585-48ff-b776-5ad621cfbbd7', '286a6c70-3fcb-4e64-97b2-c125c1f57ced', id, 'Salary advance paid to Liaqat Ogra Khil', 0.00, 4000.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1b197507-586b-4103-83ef-8071ba4ee0cd', '286a6c70-3fcb-4e64-97b2-c125c1f57ced', id, '', 4500.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '24643561-44e4-4fb9-859d-b475731a7755', '286a6c70-3fcb-4e64-97b2-c125c1f57ced', id, '', 0.00, 4500.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6bdbaada-8c03-4b69-8f02-65ecec1118c6', '286a6c70-3fcb-4e64-97b2-c125c1f57ced', id, '', 6960.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b105938e-c206-4699-9b79-feac6b653892', '286a6c70-3fcb-4e64-97b2-c125c1f57ced', id, '', 0.00, 6960.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b34b1633-9a00-4257-ac12-9db704c46460', '286a6c70-3fcb-4e64-97b2-c125c1f57ced', id, '', 4840.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5770208d-ffe4-47aa-802c-33b0b389be71', '286a6c70-3fcb-4e64-97b2-c125c1f57ced', id, '', 0.00, 4840.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-891
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b2ebb95e-b2fc-4d5c-8cff-14f8a3fd04fa', 'JE-000983', '2025-12-16', 'Paid for lunch expenses', 'JV-JV-891', 'journal_entry', 1750.00, 1750.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '26019209-f41f-40ff-8dbc-80697aac5098', 'b2ebb95e-b2fc-4d5c-8cff-14f8a3fd04fa', id, 'Paid for lunch expenses', 400.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9885581f-d157-4cef-8f05-372f2281ff06', 'b2ebb95e-b2fc-4d5c-8cff-14f8a3fd04fa', id, 'Purchased collateral logbook, and key registration book', 1350.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c2d21fc8-d8b5-4fc5-b0a9-24463dfc4416', 'b2ebb95e-b2fc-4d5c-8cff-14f8a3fd04fa', id, 'Paid for lunch expenses and purchase of collateral logbook and key registration book', 0.00, 1750.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-892
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8c7c0dee-6f6a-4cdc-840e-943a85235ec5', 'JE-000984', '2025-12-16', 'Cash withdrawal from Azizi Bank Cheque # 02065404', 'JV-JV-892', 'journal_entry', 45000.00, 45000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aa7faff7-bb65-4c89-a6b2-e605e884a410', '8c7c0dee-6f6a-4cdc-840e-943a85235ec5', id, 'Cash withdrawal from Azizi Bank Cheque # 02065404', 45000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'db76b9be-ebb2-440a-b513-da0b038e7776', '8c7c0dee-6f6a-4cdc-840e-943a85235ec5', id, 'Cash withdrawal from Azizi Bank Cheque # 02065404', 0.00, 45000.00 FROM accounts WHERE account_code = '10206';

-- Entry: JV-893
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f498eb82-1ba0-4909-ab7a-8e00ed4edf0a', 'JE-000985', '2025-12-16', 'Car fuel used by Shahpoor khan for multiple office work during months.', 'JV-JV-893', 'journal_entry', 4000.00, 4000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '32960069-3a34-4b85-8337-e9ffc5b29974', 'f498eb82-1ba0-4909-ab7a-8e00ed4edf0a', id, 'Car fuel used by Shahpoor khan for multiple office work during months.', 4000.00, 0.00 FROM accounts WHERE account_code = '60901';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b0779f37-f677-44e0-ae9f-35313f205dde', 'f498eb82-1ba0-4909-ab7a-8e00ed4edf0a', id, 'Car fuel used by Shahpoor khan for multiple office work during months.', 0.00, 4000.00 FROM accounts WHERE account_code = '20152';

-- Entry: JV-894
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c40b197f-5756-4ac6-beae-ae5d2d622d9c', 'JE-000986', '2025-12-16', 'Paid for credit cards', 'JV-JV-894', 'journal_entry', 1250.00, 1250.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f80ac3b8-a0e9-4ef5-a6c3-e5da875f2035', 'c40b197f-5756-4ac6-beae-ae5d2d622d9c', id, 'Paid for credit cards', 1250.00, 0.00 FROM accounts WHERE account_code = '60005';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '545f5a0a-34e4-43e0-b5dd-0a20ac29c5cd', 'c40b197f-5756-4ac6-beae-ae5d2d622d9c', id, 'Paid for credit cards', 0.00, 1250.00 FROM accounts WHERE account_code = '20152';

-- Entry: JV-895
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c83efecd-3acd-45a9-8ab4-ea9393682be5', 'JE-000987', '2025-12-16', 'Hotel stay for 16 night of Shahpoor in Kunar', 'JV-JV-895', 'journal_entry', 52700.00, 52700.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fedcc007-4324-421e-a6e2-44c3edc65a9f', 'c83efecd-3acd-45a9-8ab4-ea9393682be5', id, 'Hotel stay for 16 night of Shahpoor in Kunar', 36400.00, 0.00 FROM accounts WHERE account_code = '60700';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '55416d05-3639-49d0-a740-8de8337d21e2', 'c83efecd-3acd-45a9-8ab4-ea9393682be5', id, 'Paid for food expense by Shapoor during the travel', 12980.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5f7a5c42-6e6e-4150-8c0c-ad2291c45454', 'c83efecd-3acd-45a9-8ab4-ea9393682be5', id, 'Purchased one mouse for the office use', 130.00, 0.00 FROM accounts WHERE account_code = '61207';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0f7e5221-94bc-46ef-9dc2-bca304839b97', 'c83efecd-3acd-45a9-8ab4-ea9393682be5', id, 'Purchased stationery for office use in Kunar', 3190.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fcb3be30-8c3f-4af0-9bf3-04fc026785d5', 'c83efecd-3acd-45a9-8ab4-ea9393682be5', id, 'Purchased stationery for office use in Kunar', 0.00, 52700.00 FROM accounts WHERE account_code = '20152';

-- Entry: JV-896
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('193a4e1e-efc1-44e7-8457-78ef1567ee39', 'JE-000988', '2025-12-16', 'Paid by Shahpoor for 4 night in Jalalabad', 'JV-JV-896', 'journal_entry', 8840.00, 8840.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9041d97a-f7aa-4c02-9534-8334ba29cd36', '193a4e1e-efc1-44e7-8457-78ef1567ee39', id, 'Paid by Shahpoor for 4 night in Jalalabad', 8000.00, 0.00 FROM accounts WHERE account_code = '60700';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '79fd2b8e-2625-4911-b9da-b422f0544c96', '193a4e1e-efc1-44e7-8457-78ef1567ee39', id, 'Paid by Shahpoor for Lunch during th travel', 840.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4bba7137-838d-4897-9b8a-7aaad9a56dd4', '193a4e1e-efc1-44e7-8457-78ef1567ee39', id, 'Paid by Shahpoor for Lunch and night stay in Jalalabad', 0.00, 8840.00 FROM accounts WHERE account_code = '20152';

-- Entry: JV-897
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ae6bff93-47ea-4c61-997f-15b4adc4948c', 'JE-000989', '2025-12-16', 'Internet fee for the month of Sep 2025 Jalalabad office', 'JV-JV-897', 'journal_entry', 3280.00, 3280.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8816e1fa-8f1f-4251-98a7-51bc0400b68d', 'ae6bff93-47ea-4c61-997f-15b4adc4948c', id, 'Internet fee for the month of Sep 2025 Jalalabad office', 2000.00, 0.00 FROM accounts WHERE account_code = '61202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '00b072b2-9c91-4ea3-b047-0fa22411a3ca', 'ae6bff93-47ea-4c61-997f-15b4adc4948c', id, 'Paid for router and cable for the Jalalabad office', 1280.00, 0.00 FROM accounts WHERE account_code = '61207';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e0b15956-23d4-4759-a172-f51d15735ec9', 'ae6bff93-47ea-4c61-997f-15b4adc4948c', id, 'Paid for router and cable for the Jalalabad office and internet fee for the month of Sep 2025', 0.00, 3280.00 FROM accounts WHERE account_code = '20152';

-- Entry: JV-898
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d0d1b9fa-397b-4b84-bf31-6061b25d5a1f', 'JE-000990', '2025-12-16', 'Paid by Shahpoor for printing materials in Jalalabad', 'JV-JV-898', 'journal_entry', 16395.00, 16395.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e0f76187-f172-458a-8c58-9c847f848a0f', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, 'Paid by Shahpoor for printing materials in Jalalabad', 1735.00, 0.00 FROM accounts WHERE account_code = '61602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e3b4389d-e2a2-4acb-ab87-54294abeec71', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, 'Paid by Shahpoor for stationery for the office use in Jalalabad', 350.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '15e1ce8e-8a46-4460-9cc6-cb2b401fd1c0', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, 'Paid by Shahpoor for the purchase of some cleaning materials, dustbins, sandals etc for the office use', 1620.00, 0.00 FROM accounts WHERE account_code = '60505';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3d69bc46-287c-486a-8f78-d4b2cd92752a', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, 'Paid by Shahpoor for his lunch expense during the travel', 850.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '33274556-cba3-46f6-8adb-563818132161', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, 'Paid by Shahpoor for room rent', 2000.00, 0.00 FROM accounts WHERE account_code = '60700';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4fe50516-0c54-4616-9a86-1f91bd8e0821', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, 'Paid by Shahpoor for taxi for the office work', 200.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c57f3f35-2bf9-4de0-9588-c7c036bd73b7', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, 'Paid by Shahpoor for credit card used for the office work', 500.00, 0.00 FROM accounts WHERE account_code = '60005';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '69d6f0d9-4c3d-4bbe-b6a3-f78fe1bc4e89', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, 'Paid by Shahpoor for refreshment', 590.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4f219a7a-aec8-4719-ab06-f640af54ec77', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, 'Paid by Shahpoor for travel expenses during his travel to Jalalabad', 0.00, 7845.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e6f57c73-16ef-4b33-93d7-c2b66ac4e13f', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, '', 1840.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f2b1d252-cd27-4b63-bdc0-352323f97140', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, '', 0.00, 1840.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9ace670b-2b0d-4d40-a99d-8d5bd399301a', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, '', 1890.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e3078282-968b-4d6a-af1b-849ca7b8e5fd', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, '', 0.00, 1890.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f530edba-3e7f-4cb9-862d-32969d8e8250', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, '', 1550.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b0965001-61cd-4a76-83cf-39ab840c3198', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, '', 0.00, 1550.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8db15d40-4d23-4574-82ed-75671f8069c5', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, '', 1480.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '797a00ff-6b03-4ca2-b47e-8bb29ea29acd', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, '', 0.00, 1480.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0cab918d-f61b-4148-bdaf-f8388cde8765', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, '', 1790.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2f0b1149-5413-45c3-9c1b-6b398c831198', 'd0d1b9fa-397b-4b84-bf31-6061b25d5a1f', id, '', 0.00, 1790.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-899
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d993b899-325a-4fe7-bc9e-af0516f2bf5f', 'JE-000991', '2025-12-16', 'Paid for red meat for lunch', 'JV-JV-899', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c4d747dc-fe5c-40d8-860e-949780061599', 'd993b899-325a-4fe7-bc9e-af0516f2bf5f', id, 'Paid for red meat for lunch', 1000.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b66b3a52-88a2-4402-a24d-a54e6fadb071', 'd993b899-325a-4fe7-bc9e-af0516f2bf5f', id, 'Paid for red meat for lunch', 0.00, 1000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-900
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('634b28ce-0c2b-415b-be0f-845cf3c1d1a5', 'JE-000992', '2025-12-16', 'Paid for gas by Wahidullah and wages for delivery', 'JV-JV-900', 'journal_entry', 480.00, 480.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a3be0507-236f-4fe6-bdf6-952aa493c24d', '634b28ce-0c2b-415b-be0f-845cf3c1d1a5', id, 'Paid for gas by Wahidullah and wages for delivery', 480.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd4d42459-3824-4231-9912-d5bc5a58f399', '634b28ce-0c2b-415b-be0f-845cf3c1d1a5', id, 'Paid for gas by Wahidullah and wages for delivery', 0.00, 480.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-901
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', 'JE-000993', '2025-12-16', 'Paid for Mineral water', 'JV-JV-901', 'journal_entry', 68340.00, 68340.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '35438c03-fb94-40b0-b057-d3bf8ee14063', 'bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', id, 'Paid for Mineral water', 600.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '116c6aba-bdad-48ad-9acb-940c2bcfaefa', 'bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', id, 'Paid for Mineral water', 0.00, 600.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e35190d3-d405-4894-9929-9bb8cc00a546', 'bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', id, 'Paid the first installement only the principle amount', 32500.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '545957bc-fb3f-4f5c-9955-8c22b2d959fa', 'bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', id, '', 0.00, 32500.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aedaa7cf-d66b-418a-b3bc-a974ef621e67', 'bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', id, '', 4840.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '003e0ca4-c7f3-4281-bea0-2a5069ff475d', 'bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', id, '', 0.00, 4840.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b7ae8974-dd29-4bee-8561-7428c3922571', 'bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', id, '', 4840.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a9261006-fcdb-478b-bd28-070b39cde808', 'bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', id, '', 0.00, 4840.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '298d3b2c-bd7e-4509-9909-478be5963f98', 'bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', id, '', 7740.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '244e1880-f8b0-47be-b344-3098ddc4705d', 'bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', id, '', 0.00, 7740.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6dd13826-56bf-4a77-958d-3c8be11c31ff', 'bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', id, '', 5000.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1dab9001-38d0-4ae5-be29-6c33eb614467', 'bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', id, '', 0.00, 5000.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd06e29ca-4bc2-4d62-b320-3d4c2c163e20', 'bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', id, '', 4840.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8084fffa-fa1a-4102-b1a5-ddff739896c4', 'bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', id, '', 0.00, 4840.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3cec400f-4299-4fd3-a706-f4f789f2111b', 'bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', id, '', 1790.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f53c2357-d8c5-4747-afd9-8ee1e8ae3478', 'bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', id, '', 0.00, 1790.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bec0a42a-83ab-4462-86a4-e1eab8556c3c', 'bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', id, '', 6190.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b8e74e91-48d9-42d9-a103-73ec2c0f8e21', 'bc2c1582-f169-40e9-9b0a-6dfabeaf04e5', id, '', 0.00, 6190.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-902
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6bb17465-d549-4f91-9d38-9e5b95cf133c', 'JE-000994', '2025-12-17', 'Paid for gas by Wahidullah and wages for delivery', 'JV-JV-902', 'journal_entry', 1100.00, 1100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '071b9d37-3618-44a6-8de7-7ac808c262d0', '6bb17465-d549-4f91-9d38-9e5b95cf133c', id, 'Paid for gas by Wahidullah and wages for delivery', 1100.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b6b1a99f-2a88-4fe5-8afc-7d4b6a50e6ba', '6bb17465-d549-4f91-9d38-9e5b95cf133c', id, 'Paid for gas by Wahidullah and wages for delivery', 0.00, 1100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-903
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fe3fc63e-930a-44eb-b269-04350d22bd28', 'JE-000995', '2025-12-18', 'Purchase of Heater for COO office', 'JV-JV-903', 'journal_entry', 5100.00, 5100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c7a97204-05dc-494e-9a68-2464ce85af24', 'fe3fc63e-930a-44eb-b269-04350d22bd28', id, 'Purchase of Heater for COO office', 4000.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd85b753d-daf0-40c6-9837-fcda476c4132', 'fe3fc63e-930a-44eb-b269-04350d22bd28', id, 'Purchase of gas ballons for the office use', 900.00, 0.00 FROM accounts WHERE account_code = '60408';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '80525c38-4386-4553-8f7b-6427745fc905', 'fe3fc63e-930a-44eb-b269-04350d22bd28', id, 'Purchase of pipe and circulation for heater', 200.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0ec754e4-32c6-447e-b670-bdaf411140e6', 'fe3fc63e-930a-44eb-b269-04350d22bd28', id, 'Purchase of heater, gas ballon, and pipe and circulation for heater', 0.00, 5100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-904
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d048907d-b5b4-428b-8ba7-aea0e755a2bd', 'JE-000996', '2025-12-18', 'Paid for taxi by Gulzar Khan for the purchase of heaters', 'JV-JV-904', 'journal_entry', 26260.00, 26260.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dcb6eea6-f573-408a-aa0c-d2cd5ef0db1b', 'd048907d-b5b4-428b-8ba7-aea0e755a2bd', id, 'Paid for taxi by Gulzar Khan for the purchase of heaters', 140.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b3d612e0-0358-4d8c-a144-20f3901b5ce9', 'd048907d-b5b4-428b-8ba7-aea0e755a2bd', id, 'Paid for taxi by Gulzar Khan for the purchase of heaters', 0.00, 140.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e8afbbe-50b0-4a42-91df-5de2240c4ea0', 'd048907d-b5b4-428b-8ba7-aea0e755a2bd', id, 'Paid five installments together, 4, 5, 6, 7 and 8.', 12000.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e6b7e4c-a8ac-4a80-aeec-8d4e626df98e', 'd048907d-b5b4-428b-8ba7-aea0e755a2bd', id, '', 0.00, 12000.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a0ffbfe3-a65b-4121-bf06-371e66c35e41', 'd048907d-b5b4-428b-8ba7-aea0e755a2bd', id, '', 3870.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '25e34a05-76a2-41a3-b7c3-748629aaa9f2', 'd048907d-b5b4-428b-8ba7-aea0e755a2bd', id, '', 0.00, 3870.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e055a85c-2cb4-4afe-8f8f-7bf29e14d69f', 'd048907d-b5b4-428b-8ba7-aea0e755a2bd', id, '', 4840.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7c37bb16-faf1-4b20-a9d3-920dcd8fb5dd', 'd048907d-b5b4-428b-8ba7-aea0e755a2bd', id, '', 0.00, 4840.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '231320d6-b205-4879-861d-97f9033a7725', 'd048907d-b5b4-428b-8ba7-aea0e755a2bd', id, '', 5410.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9327a2f3-8a06-414b-9748-190e90ac998f', 'd048907d-b5b4-428b-8ba7-aea0e755a2bd', id, '', 0.00, 5410.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-905
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d59dbada-7ca7-4f3d-8f07-a9ce291cb8c7', 'JE-000997', '2025-12-20', 'Purchased liquid gas for the office heating', 'JV-JV-905', 'journal_entry', 1720.00, 1720.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bfb7b915-cfa9-48d5-b5a2-2a9666feab71', 'd59dbada-7ca7-4f3d-8f07-a9ce291cb8c7', id, 'Purchased liquid gas for the office heating', 1620.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1388d2f5-1f88-4f75-82e1-4c4c704e1946', 'd59dbada-7ca7-4f3d-8f07-a9ce291cb8c7', id, 'Purchased circulation for heaters', 100.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '585dfc3a-1bbe-425f-8084-ec42082fe6b1', 'd59dbada-7ca7-4f3d-8f07-a9ce291cb8c7', id, 'Purchased circulation for heaters and gas', 0.00, 1720.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-906
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('31327106-586d-431d-9856-6f475c41a3b8', 'JE-000998', '2025-12-20', 'Paid for food for lunch', 'JV-JV-906', 'journal_entry', 290.00, 290.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4d3d4772-f2d7-4c2f-8993-e04c832d4494', '31327106-586d-431d-9856-6f475c41a3b8', id, 'Paid for food for lunch', 290.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '412aa65e-1b98-433b-b3bb-7586945a50c7', '31327106-586d-431d-9856-6f475c41a3b8', id, 'Paid for food for lunch', 0.00, 290.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-907
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7ebbf8d4-30e2-47d7-abca-c4e767132e16', 'JE-000999', '2025-12-20', 'Purchased heater for CEO office', 'JV-JV-907', 'journal_entry', 11930.00, 11930.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6525f871-f25f-4c9d-9e71-f13701717f88', '7ebbf8d4-30e2-47d7-abca-c4e767132e16', id, 'Purchased heater for CEO office', 6500.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '46eea39f-d5ba-43ab-8361-d901177e07e4', '7ebbf8d4-30e2-47d7-abca-c4e767132e16', id, 'Paid for liquid gas for the office heating', 900.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '963de96d-2e5f-4682-9d25-f387ab5ddc8b', '7ebbf8d4-30e2-47d7-abca-c4e767132e16', id, 'Purchased pipe and circulation', 350.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '37e429d5-94b5-45cf-b1d2-2ef37cc8f7ab', '7ebbf8d4-30e2-47d7-abca-c4e767132e16', id, 'Purchased Heater, Gas and pipe and circulation', 0.00, 7750.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eec6dbd1-0c9e-478f-a9d6-81a28ad16ca3', '7ebbf8d4-30e2-47d7-abca-c4e767132e16', id, '', 2180.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b721005f-d272-4144-afca-a245637c72e0', '7ebbf8d4-30e2-47d7-abca-c4e767132e16', id, '', 0.00, 2180.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8c240e06-e2d1-4e7d-a068-cbbe0fe8cee6', '7ebbf8d4-30e2-47d7-abca-c4e767132e16', id, '', 2000.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bea0e47d-ada0-4cfd-a200-4a9298e9f020', '7ebbf8d4-30e2-47d7-abca-c4e767132e16', id, '', 0.00, 2000.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-908
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8dcfb6ad-6e4c-4e70-9f09-ca25b3338513', 'JE-001000', '2025-12-21', 'Cash Received CR# 111 for the office rent for 2 months Qaws and Jadi 1404', 'JV-JV-908', 'journal_entry', 174722.00, 174722.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c41ce42b-d21b-4a5d-acf6-1bef52334151', '8dcfb6ad-6e4c-4e70-9f09-ca25b3338513', id, 'Cash Received CR# 111 for the office rent for 2 months Qaws and Jadi 1404', 85000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dbbd2fb6-0966-428e-91ab-7227723a120c', '8dcfb6ad-6e4c-4e70-9f09-ca25b3338513', id, 'Cash Received CR# 111 for the office rent for 2 months Qaws and Jadi 1404', 0.00, 85000.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '58e05a75-651b-4e2b-84f9-d7813d2480da', '8dcfb6ad-6e4c-4e70-9f09-ca25b3338513', id, 'Prepaid office rent for the month of Jadi 1404', 42500.00, 0.00 FROM accounts WHERE account_code = '13100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7a88a5d0-b894-470e-af31-69f1889404dc', '8dcfb6ad-6e4c-4e70-9f09-ca25b3338513', id, 'Office rent paid for the month of Qaws 1404', 47222.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '30997a70-a832-4d4b-96c5-4fe1e4646e9a', '8dcfb6ad-6e4c-4e70-9f09-ca25b3338513', id, 'Rent taxi payable for the month of Qaws 1404', 0.00, 4722.00 FROM accounts WHERE account_code = '21200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cbb8a933-ed64-4d0e-b7b7-47522cb7e7b1', '8dcfb6ad-6e4c-4e70-9f09-ca25b3338513', id, 'Office rent paid for the month of Qaws and Jadi 1404', 0.00, 85000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-909
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('13fac014-900f-4a00-b87b-f8d01914bc79', 'JE-001001', '2025-12-21', 'Paid for lunch expenses of the day', 'JV-JV-909', 'journal_entry', 670.00, 670.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4df6f17e-9870-46d2-84df-4b50c672baa9', '13fac014-900f-4a00-b87b-f8d01914bc79', id, 'Paid for lunch expenses of the day', 670.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7301bcb6-8c72-49aa-b7f7-fa287c613dbf', '13fac014-900f-4a00-b87b-f8d01914bc79', id, 'Paid for lunch expenses of the day', 0.00, 670.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-910
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6828e7c9-8cf9-4e51-9d7c-1b1d5c55de4b', 'JE-001002', '2025-12-21', 'Paid for liquid gas for heating and delivery wage', 'JV-JV-910', 'journal_entry', 490.00, 490.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '502f08e6-65c7-4da8-b015-3808860dfaa8', '6828e7c9-8cf9-4e51-9d7c-1b1d5c55de4b', id, 'Paid for liquid gas for heating and delivery wage', 490.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '16ca9cc3-77e3-49ee-b2e9-6a5cdd6749f3', '6828e7c9-8cf9-4e51-9d7c-1b1d5c55de4b', id, 'Paid for liquid gas for heating and delivery wage', 0.00, 490.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-911
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c35b4701-210f-48f7-9caa-77ae8c6bd46a', 'JE-001003', '2025-12-21', 'Paid for taxi by Latif to bring cash', 'JV-JV-911', 'journal_entry', 170.00, 170.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd8f44ccb-6902-4da2-ad3a-25b9d1813e7e', 'c35b4701-210f-48f7-9caa-77ae8c6bd46a', id, 'Paid for taxi by Latif to bring cash', 170.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bb5a3c71-c532-4711-a457-9ff463e3dc53', 'c35b4701-210f-48f7-9caa-77ae8c6bd46a', id, 'Paid for taxi by Latif to bring cash', 0.00, 170.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-912
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('934d7ec8-8059-41da-b18a-dfed4e70a7c3', 'JE-001004', '2025-12-21', 'Paid for taxi for the purchase of heaters from city', 'JV-JV-912', 'journal_entry', 13030.00, 13030.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b6d2f0b1-11a2-483c-ba42-da7db94fc5d3', '934d7ec8-8059-41da-b18a-dfed4e70a7c3', id, 'Paid for taxi for the purchase of heaters from city', 120.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5f878bef-13d8-41df-b709-b108b407525c', '934d7ec8-8059-41da-b18a-dfed4e70a7c3', id, 'Paid for taxi for the purchase of heaters from city', 0.00, 120.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c1fde6ba-93f8-43ec-8de5-2f5515d7c125', '934d7ec8-8059-41da-b18a-dfed4e70a7c3', id, '', 4840.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd714ac6e-621f-42c7-997f-b1cc04f982bb', '934d7ec8-8059-41da-b18a-dfed4e70a7c3', id, '', 0.00, 4840.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f3b6a9c9-08be-435e-8f58-7c8f019ea214', '934d7ec8-8059-41da-b18a-dfed4e70a7c3', id, '', 1180.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd42b7eae-ffb3-43f7-9d68-391b710f20c2', '934d7ec8-8059-41da-b18a-dfed4e70a7c3', id, '', 0.00, 1180.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '499ef2ee-8c5b-4af7-8fe7-5dd33061fd2a', '934d7ec8-8059-41da-b18a-dfed4e70a7c3', id, '', 2950.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a339a6a2-32b1-427b-b238-148f3865cf03', '934d7ec8-8059-41da-b18a-dfed4e70a7c3', id, '', 0.00, 2950.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '24224ca6-d21f-42c9-bce8-e5a9c4f3a53a', '934d7ec8-8059-41da-b18a-dfed4e70a7c3', id, '', 1480.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'affb9ea5-8fc4-492a-bbca-b76ee5016f19', '934d7ec8-8059-41da-b18a-dfed4e70a7c3', id, '', 0.00, 1480.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3a9e74bf-bf0e-49f9-8e2a-10f4adbb8311', '934d7ec8-8059-41da-b18a-dfed4e70a7c3', id, '', 2460.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9d0ffb16-30a1-456b-acc1-fafd1f04084b', '934d7ec8-8059-41da-b18a-dfed4e70a7c3', id, '', 0.00, 2460.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-913
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d5559f6b-080d-4924-b014-e3dd5f9a29f8', 'JE-001005', '2025-12-22', 'Paid for the day lunch expenses', 'JV-JV-913', 'journal_entry', 430.00, 430.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ad8c5148-aac2-4fca-9589-07cd3a92eea3', 'd5559f6b-080d-4924-b014-e3dd5f9a29f8', id, 'Paid for the day lunch expenses', 400.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2de540bc-107c-4167-ac98-f412b1229255', 'd5559f6b-080d-4924-b014-e3dd5f9a29f8', id, 'Paid for tissue paper', 30.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f9d0f1b3-91c5-499d-bf3b-93a9ebc82b4c', 'd5559f6b-080d-4924-b014-e3dd5f9a29f8', id, 'Paid for tissue paper and lunch expense', 0.00, 430.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-914
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('eac72cf3-7802-42e1-9523-eee49123aaa5', 'JE-001006', '2025-12-22', 'Paid for taxi by Gulzar for the purchase of heaters', 'JV-JV-914', 'journal_entry', 90.00, 90.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1e09232b-2375-4660-a3ea-fd09cbde7300', 'eac72cf3-7802-42e1-9523-eee49123aaa5', id, 'Paid for taxi by Gulzar for the purchase of heaters', 90.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f72c33df-999e-49c4-85e3-dc8938f4c6a8', 'eac72cf3-7802-42e1-9523-eee49123aaa5', id, 'Paid for taxi by Gulzar for the purchase of heaters', 0.00, 90.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-915
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('43f72131-9b35-48b7-a3da-7c78117599c9', 'JE-001007', '2025-12-22', 'Paid travel advance to Hanifullah Momand to Kunar and Nanagarhar', 'JV-JV-915', 'journal_entry', 14430.00, 14430.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b69e4821-1c63-4402-8e95-5a924026d43b', '43f72131-9b35-48b7-a3da-7c78117599c9', id, 'Paid travel advance to Hanifullah Momand to Kunar and Nanagarhar', 10000.00, 0.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '07814b0f-7347-4ed7-bdf8-aea7d986b607', '43f72131-9b35-48b7-a3da-7c78117599c9', id, 'Paid travel advance to Hanifullah Momand to Kunar and Nanagarhar', 0.00, 10000.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '43862608-f0e8-4503-8124-81c23d957fd3', '43f72131-9b35-48b7-a3da-7c78117599c9', id, '', 4430.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '272494d1-d8aa-401c-a2cb-200bb6248c58', '43f72131-9b35-48b7-a3da-7c78117599c9', id, '', 0.00, 4430.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-916
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('828daaf8-6059-490b-adb4-1aa7ae3b3aa7', 'JE-001008', '2025-12-23', 'Paid for the power generator', 'JV-JV-916', 'journal_entry', 1220.00, 1220.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b8b1e305-4614-4d16-8e82-c98c418e7806', '828daaf8-6059-490b-adb4-1aa7ae3b3aa7', id, 'Paid for the power generator', 1000.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6b54fe8c-2b1f-4010-a0c1-45ef42953874', '828daaf8-6059-490b-adb4-1aa7ae3b3aa7', id, 'Cake and milk for BOS meeting', 220.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3248b145-6653-4ba4-8093-c0dbf9631a5a', '828daaf8-6059-490b-adb4-1aa7ae3b3aa7', id, 'Paid for the power generator and cake and milk for BOS meeting', 0.00, 1220.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-917
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4c86ab87-d522-40ef-9ba2-26eca67011b1', 'JE-001009', '2025-12-23', 'Paid for fuel for the power generator and refreshment for BOS meeting', 'JV-JV-917', 'journal_entry', 140.00, 140.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bb79a698-d0ff-4753-bb72-1ee19c13c7f5', '4c86ab87-d522-40ef-9ba2-26eca67011b1', id, 'Paid for fuel for the power generator and refreshment for BOS meeting', 140.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd9cbe206-7e2b-4c9f-8d71-3af986fff2c7', '4c86ab87-d522-40ef-9ba2-26eca67011b1', id, 'Paid for fuel for the power generator and refreshment for BOS meeting', 0.00, 140.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-918
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ba785b09-a753-4595-bcfd-8d8a3336ceda', 'JE-001010', '2025-12-23', 'Fund received from MISFA on Qard ul Hasana', 'JV-JV-918', 'journal_entry', 6000000.00, 6000000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '410267dd-acd7-42f3-ba4e-fc2af6621f9d', 'ba785b09-a753-4595-bcfd-8d8a3336ceda', id, 'Fund received from MISFA on Qard ul Hasana', 6000000.00, 0.00 FROM accounts WHERE account_code = '10207';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '39d82bdf-f16e-47bd-bc57-1a55cc10e006', 'ba785b09-a753-4595-bcfd-8d8a3336ceda', id, 'Fund received from MISFA on Qard ul Hasana', 0.00, 6000000.00 FROM accounts WHERE account_code = '20121';

-- Entry: JV-919
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('dc16b43b-c612-408e-adda-052807bc23ee', 'JE-001011', '2025-12-23', 'MISFA Fund transfer charges to the joint account', 'JV-JV-919', 'journal_entry', 2900.00, 2900.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5c2aced0-e431-4a56-a023-e75ab3e232ee', 'dc16b43b-c612-408e-adda-052807bc23ee', id, 'MISFA Fund transfer charges to the joint account', 2000.00, 0.00 FROM accounts WHERE account_code = '61801';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd49833ea-704c-4f15-b24d-6655b0b00d7a', 'dc16b43b-c612-408e-adda-052807bc23ee', id, 'Paid for cheque book printing', 900.00, 0.00 FROM accounts WHERE account_code = '61801';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cce23ccb-6b4c-4aee-949f-945c904ce22b', 'dc16b43b-c612-408e-adda-052807bc23ee', id, 'Paid for cheque book printing', 0.00, 2900.00 FROM accounts WHERE account_code = '10207';

-- Entry: JV-920
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cf618c39-1e16-4ce8-8083-efc648ae759a', 'JE-001012', '2025-12-23', 'Paid for taxi by Latif Salarzai for the delivery of documents to Azizi Bank', 'JV-JV-920', 'journal_entry', 200.00, 200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '84eafec7-626d-4808-a5d4-cc55e2a62568', 'cf618c39-1e16-4ce8-8083-efc648ae759a', id, 'Paid for taxi by Latif Salarzai for the delivery of documents to Azizi Bank', 200.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f6f2ac6a-fe0d-4278-873c-2a56ad7916dc', 'cf618c39-1e16-4ce8-8083-efc648ae759a', id, 'Paid for taxi by Latif Salarzai for the delivery of documents to Azizi Bank', 0.00, 200.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-921
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2953ccea-a836-48f2-a2ec-db79e6ca40d6', 'JE-001013', '2025-12-23', 'Taxi used by Gulzar for delivery of documents to DAB', 'JV-JV-921', 'journal_entry', 40.00, 40.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c459379-c808-4da6-bb32-74582e82e850', '2953ccea-a836-48f2-a2ec-db79e6ca40d6', id, 'Taxi used by Gulzar for delivery of documents to DAB', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c715f088-03e3-4c79-aa52-44bc6ac710a4', '2953ccea-a836-48f2-a2ec-db79e6ca40d6', id, 'Taxi used by Gulzar for delivery of documents to DAB', 0.00, 40.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-922
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('216025c8-13d2-4523-8de2-ddc84b995462', 'JE-001014', '2025-12-23', 'Paid for the office lunch expenses', 'JV-JV-922', 'journal_entry', 17270.00, 17270.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '884b54b9-e3d3-4e93-ba81-ebf21888b988', '216025c8-13d2-4523-8de2-ddc84b995462', id, 'Paid for the office lunch expenses', 1370.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '633aea56-0b73-4e28-a0c0-a0ce9c822c4e', '216025c8-13d2-4523-8de2-ddc84b995462', id, 'Paid for the office lunch expenses', 0.00, 1370.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3496a739-4792-41c2-ab66-d02d177e284b', '216025c8-13d2-4523-8de2-ddc84b995462', id, '', 2520.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '95a1b276-3343-4547-abb1-589a3a6a3542', '216025c8-13d2-4523-8de2-ddc84b995462', id, '', 0.00, 2520.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aadecf12-e3c9-4ce6-8802-8793ab397f5a', '216025c8-13d2-4523-8de2-ddc84b995462', id, '', 7900.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f5fc4170-1c1f-43a5-82c4-d1119c5e9831', '216025c8-13d2-4523-8de2-ddc84b995462', id, '', 0.00, 7900.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '97574ba8-76da-499d-bcf4-4598bd17cb49', '216025c8-13d2-4523-8de2-ddc84b995462', id, '', 3500.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd932b91e-cf70-4f28-9861-4041985bc113', '216025c8-13d2-4523-8de2-ddc84b995462', id, '', 0.00, 3500.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '53a1ff09-ae39-4987-898a-d9b35a3d8ce2', '216025c8-13d2-4523-8de2-ddc84b995462', id, '', 1980.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '022d0dde-3e2a-4fc5-a27f-ff4bc848574e', '216025c8-13d2-4523-8de2-ddc84b995462', id, '', 0.00, 1980.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-923
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2196d4eb-5fd3-4278-a3e9-088e49ab312c', 'JE-001015', '2025-12-24', 'Taxi used by Gulzar Khan for delivery of documents to DAB', 'JV-JV-923', 'journal_entry', 40.00, 40.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '65b959d6-4a64-48d0-8823-447c9982545c', '2196d4eb-5fd3-4278-a3e9-088e49ab312c', id, 'Taxi used by Gulzar Khan for delivery of documents to DAB', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '01ef8d04-7545-4888-8c0f-f3e63dfccd16', '2196d4eb-5fd3-4278-a3e9-088e49ab312c', id, 'Taxi used by Gulzar Khan for delivery of documents to DAB', 0.00, 40.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-924
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('255d92b1-ae45-45c7-b8ea-c5312e5af37a', 'JE-001016', '2025-12-24', 'Paid for fuel for the power generator', 'JV-JV-924', 'journal_entry', 11010.00, 11010.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b26839e0-fd13-4676-9490-977d7109d940', '255d92b1-ae45-45c7-b8ea-c5312e5af37a', id, 'Paid for fuel for the power generator', 1000.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '41b0cf39-ed27-48c8-9b9f-de7e3c084f17', '255d92b1-ae45-45c7-b8ea-c5312e5af37a', id, 'Paid for staff food expense for late stay', 3110.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a6b1e462-3656-49c7-ba31-04f5d47be3ee', '255d92b1-ae45-45c7-b8ea-c5312e5af37a', id, 'Paid for liquid gas for office warming', 1020.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8adeca31-f294-4710-a936-5833fcd522e2', '255d92b1-ae45-45c7-b8ea-c5312e5af37a', id, 'Paid for liquid gas for office warming', 0.00, 5130.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '70f0827b-af41-4c0f-8029-1d99d6bbf004', '255d92b1-ae45-45c7-b8ea-c5312e5af37a', id, '', 1940.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cd6ef841-c1fd-49bf-9897-26978bc33c47', '255d92b1-ae45-45c7-b8ea-c5312e5af37a', id, '', 0.00, 1940.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6cfbf0de-f9f2-4dbe-9f98-eac14070a015', '255d92b1-ae45-45c7-b8ea-c5312e5af37a', id, '', 3940.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3c469e15-c5c7-4c02-9952-6b66c09d9ba0', '255d92b1-ae45-45c7-b8ea-c5312e5af37a', id, '', 0.00, 3940.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-925
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a6b0f5f0-b5c7-4b11-904b-b552eb8de589', 'JE-001017', '2025-12-25', 'Paid for liquid gas for the office warming', 'JV-JV-925', 'journal_entry', 480.00, 480.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'efee78fd-0bdd-439e-b8bd-a018349c58bb', 'a6b0f5f0-b5c7-4b11-904b-b552eb8de589', id, 'Paid for liquid gas for the office warming', 480.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f3df8cf0-54de-46fb-b144-3bd6a26411c3', 'a6b0f5f0-b5c7-4b11-904b-b552eb8de589', id, 'Paid for liquid gas for the office warming', 0.00, 480.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-926
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c65df764-af0b-4e85-bb28-73a8ff1a6063', 'JE-001018', '2025-12-25', 'Paid for staff lunch expense', 'JV-JV-926', 'journal_entry', 110.00, 110.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0974fa55-9630-4b7f-b935-363edb3025e7', 'c65df764-af0b-4e85-bb28-73a8ff1a6063', id, 'Paid for staff lunch expense', 110.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '87c10b3b-a7a4-412d-9b5d-02a55bde6325', 'c65df764-af0b-4e85-bb28-73a8ff1a6063', id, 'Paid for staff lunch expense', 0.00, 110.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-927
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('439943aa-2f0d-4152-99f8-9ed90da0292f', 'JE-001019', '2025-12-27', 'Paid for taxi by Gulzar khan for delivery of documents to DAB', 'JV-JV-927', 'journal_entry', 1290.00, 1290.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e48d3436-11b2-4e65-abe1-9a3347b59bcd', '439943aa-2f0d-4152-99f8-9ed90da0292f', id, 'Paid for taxi by Gulzar khan for delivery of documents to DAB', 80.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '650778ef-ad69-40f6-b715-f946a38050ab', '439943aa-2f0d-4152-99f8-9ed90da0292f', id, 'Paid for taxi by Gulzar khan for delivery of documents to DAB', 0.00, 80.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '27efa979-f35c-4771-98d7-77a3a488ad4c', '439943aa-2f0d-4152-99f8-9ed90da0292f', id, '', 1210.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e1b70713-08b8-4bdd-b231-f1dd1a2de61f', '439943aa-2f0d-4152-99f8-9ed90da0292f', id, '', 0.00, 1210.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-928
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('da873b69-6a0e-442b-b319-11fa61ee2470', 'JE-001020', '2025-12-28', 'Paid staff lunch in market', 'JV-JV-928', 'journal_entry', 2360.00, 2360.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e05ce32e-131d-47d0-8e9c-926cd1922b40', 'da873b69-6a0e-442b-b319-11fa61ee2470', id, 'Paid staff lunch in market', 60.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5538fc24-9706-486e-a40c-d72acb1ef34f', 'da873b69-6a0e-442b-b319-11fa61ee2470', id, 'Paid staff lunch in market', 0.00, 60.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8110f6a7-d229-46c5-b3eb-7d152912609e', 'da873b69-6a0e-442b-b319-11fa61ee2470', id, 'Paid for lunch expense of the staff', 680.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5b05684a-7ded-42c9-8538-41f353f0cabd', 'da873b69-6a0e-442b-b319-11fa61ee2470', id, 'Paid for gas for the office heating', 1480.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eb391741-d2f3-4880-b229-cea139fe322f', 'da873b69-6a0e-442b-b319-11fa61ee2470', id, 'Paid for gas for the office heating and staff lunch expense', 0.00, 2160.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '56c33e29-a241-4831-8e5f-89450439058a', 'da873b69-6a0e-442b-b319-11fa61ee2470', id, 'Taxi used by Gulzar and Laiqat for delivery of documents to DAB', 140.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '14d5e4d7-ebf0-40e1-b711-75f50059530d', 'da873b69-6a0e-442b-b319-11fa61ee2470', id, 'Taxi used by Gulzar and Laiqat for delivery of documents to DAB', 0.00, 140.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-929
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('213f73c5-0e56-4fcc-a44b-4b96266224b8', 'JE-001021', '2025-12-28', 'Cash received from Azizi Bank for daily office expenses', 'JV-JV-929', 'journal_entry', 50000.00, 50000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '07d85e0b-e5f6-4e66-8455-e0fc1a007350', '213f73c5-0e56-4fcc-a44b-4b96266224b8', id, 'Cash received from Azizi Bank for daily office expenses', 50000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9258089f-1384-441c-99d0-bd145188e2a3', '213f73c5-0e56-4fcc-a44b-4b96266224b8', id, 'Cash received from Azizi Bank for daily office expenses', 0.00, 50000.00 FROM accounts WHERE account_code = '10206';

-- Entry: JV-930
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8c299dc2-892c-46aa-8dfe-96f7cb1cc6d5', 'JE-001022', '2025-12-28', 'Purchased two Computers for the office staff', 'JV-JV-930', 'journal_entry', 69350.00, 69350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4b0390df-c4fe-4250-a13f-59b0581ca18d', '8c299dc2-892c-46aa-8dfe-96f7cb1cc6d5', id, 'Purchased two Computers for the office staff', 28000.00, 0.00 FROM accounts WHERE account_code = '17101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c57b9382-f167-4474-91cb-35722ee8a0d4', '8c299dc2-892c-46aa-8dfe-96f7cb1cc6d5', id, 'Purchased two Computers for the office staff', 0.00, 28000.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '31282497-36d9-416e-9bbd-c570b43751eb', '8c299dc2-892c-46aa-8dfe-96f7cb1cc6d5', id, '', 26000.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5907b5bf-18f5-401d-9a11-598f80d04eeb', '8c299dc2-892c-46aa-8dfe-96f7cb1cc6d5', id, '', 0.00, 26000.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '40996fb6-9dc6-4706-aa2c-681a2f90f815', '8c299dc2-892c-46aa-8dfe-96f7cb1cc6d5', id, '', 5800.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7831b6d1-378b-4820-b0f0-95aa1566a2b0', '8c299dc2-892c-46aa-8dfe-96f7cb1cc6d5', id, '', 0.00, 5800.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5183441e-1660-4cda-b05b-fe3efdec05d3', '8c299dc2-892c-46aa-8dfe-96f7cb1cc6d5', id, '', 1680.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '416113e7-1a08-49e5-a824-2980020c6a09', '8c299dc2-892c-46aa-8dfe-96f7cb1cc6d5', id, '', 0.00, 1680.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a88cd40d-5259-4679-be8a-3c9ee879db13', '8c299dc2-892c-46aa-8dfe-96f7cb1cc6d5', id, '', 7870.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'de905fbb-7069-4f80-aa21-a05462086e16', '8c299dc2-892c-46aa-8dfe-96f7cb1cc6d5', id, '', 0.00, 7870.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-931
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5d6d5175-8cd6-4d0f-a385-7215069a3a4a', 'JE-001023', '2025-12-29', 'Paid for staff lunch expenses', 'JV-JV-931', 'journal_entry', 170.00, 170.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cfe26b78-d7f3-4fc0-9bc2-32015116627d', '5d6d5175-8cd6-4d0f-a385-7215069a3a4a', id, 'Paid for staff lunch expenses', 170.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd91e71a5-3392-4891-8244-4cfa5ea7cb99', '5d6d5175-8cd6-4d0f-a385-7215069a3a4a', id, 'Paid for staff lunch expenses', 0.00, 170.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-932
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b5010910-b9f6-4ec7-b930-5a95c37c817d', 'JE-001024', '2025-12-30', 'Taxi used by Zuhra Nadeem to Kabul Star Training', 'JV-JV-932', 'journal_entry', 700.00, 700.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9ef920fa-ee2f-4774-9e2a-b73b70ed7a2d', 'b5010910-b9f6-4ec7-b930-5a95c37c817d', id, 'Taxi used by Zuhra Nadeem to Kabul Star Training', 700.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '34bdcdf6-415b-4fe9-b40d-a6ea6f96fa2d', 'b5010910-b9f6-4ec7-b930-5a95c37c817d', id, 'Taxi used by Zuhra Nadeem to Kabul Star Training', 0.00, 700.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-933
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1ccd40ed-e500-40c8-96dc-9576bdfe2adb', 'JE-001025', '2025-12-30', 'Purchased Vacuum cleaner for the HQ office', 'JV-JV-933', 'journal_entry', 5480.00, 5480.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '60f32e79-c79d-4bc8-b674-5d5159fe2d9d', '1ccd40ed-e500-40c8-96dc-9576bdfe2adb', id, 'Purchased Vacuum cleaner for the HQ office', 4000.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '88fd8020-50fd-4688-81df-2c6a27f67fdf', '1ccd40ed-e500-40c8-96dc-9576bdfe2adb', id, 'Paid for gas for the office warming', 1480.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd9df7c3c-c1b6-4d23-950c-814d1d816d2f', '1ccd40ed-e500-40c8-96dc-9576bdfe2adb', id, 'Paid for gas for the office warming and purchased one vacuum cleaner', 0.00, 5480.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-934
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('da90bf2b-98a6-4c7e-8ba0-623c25d0eea4', 'JE-001026', '2025-12-30', 'Taxi used by Liaqat for delivery of documents to Dehmazng DAB office', 'JV-JV-934', 'journal_entry', 370.00, 370.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b9c3da5e-8961-471b-a0a0-a7ed5a6213c2', 'da90bf2b-98a6-4c7e-8ba0-623c25d0eea4', id, 'Taxi used by Liaqat for delivery of documents to Dehmazng DAB office', 90.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'af2bba03-6a8b-405d-8e84-c44bc578f0bd', 'da90bf2b-98a6-4c7e-8ba0-623c25d0eea4', id, 'Taxi used by Liaqat for delivery of documents to Dehmazng DAB office', 0.00, 90.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '93ea00d0-e207-4d60-b126-b7dcb5dca40c', 'da90bf2b-98a6-4c7e-8ba0-623c25d0eea4', id, 'Taxi used by Liaqat for the purchase of equipment of the HQ Office and delivery of documents', 280.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4df940cf-0d12-4a9d-a9f6-9b510f06ca88', 'da90bf2b-98a6-4c7e-8ba0-623c25d0eea4', id, 'Taxi used by Liaqat for the purchase of equipment of the HQ Office and delivery of documents', 0.00, 280.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-935
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d641b009-c776-4625-a196-90a8aae7932d', 'JE-001027', '2025-12-30', 'Paid for fuel for the power generator', 'JV-JV-935', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3db78880-e812-4f5f-8cbc-16ecd2bf0595', 'd641b009-c776-4625-a196-90a8aae7932d', id, 'Paid for fuel for the power generator', 1000.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '831805d1-eae7-4573-b144-c7c576af395e', 'd641b009-c776-4625-a196-90a8aae7932d', id, 'Paid for fuel for the power generator', 0.00, 1000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-936
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('037c3c18-ba4e-4995-a001-2b14dc6cc58f', 'JE-001028', '2025-12-31', 'Staff had lunch during official working outside office', 'JV-JV-936', 'journal_entry', 60.00, 60.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2a40b8c5-4e23-41fb-8596-e69da0f61285', '037c3c18-ba4e-4995-a001-2b14dc6cc58f', id, 'Staff had lunch during official working outside office', 60.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6feb766a-5467-4fe2-b765-c45d5bd8bc56', '037c3c18-ba4e-4995-a001-2b14dc6cc58f', id, 'Staff had lunch during official working outside office', 0.00, 60.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-937
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cfd4130b-aeee-463f-b0b8-51ee510a4036', 'JE-001029', '2025-12-31', 'Paid for fuel of power generator', 'JV-JV-937', 'journal_entry', 1460.00, 1460.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8fae0ab4-e69c-406e-b482-fda8b1c23d2b', 'cfd4130b-aeee-463f-b0b8-51ee510a4036', id, 'Paid for fuel of power generator', 1000.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7e070c8c-61d9-45d1-b907-9e9739505917', 'cfd4130b-aeee-463f-b0b8-51ee510a4036', id, 'Paid for gas for the office warming', 460.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1b844a04-53a1-4645-91f0-fce0361cc2e0', 'cfd4130b-aeee-463f-b0b8-51ee510a4036', id, 'Paid for gas for the office warming and fuel for the power generator', 0.00, 1460.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-938
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b75e0b33-8383-474b-8927-8d9d9968fd14', 'JE-001030', '2025-12-31', 'Paid for the mineral water used by staff', 'JV-JV-938', 'journal_entry', 440.00, 440.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5763deba-8bf5-4b36-8f1d-0a6505eac2f8', 'b75e0b33-8383-474b-8927-8d9d9968fd14', id, 'Paid for the mineral water used by staff', 440.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1d20932b-6d25-488a-86fe-876d7e7f6a02', 'b75e0b33-8383-474b-8927-8d9d9968fd14', id, 'Paid for the mineral water used by staff', 0.00, 440.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-939
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('54c85cde-baf0-49f6-a68e-e1477ddd260b', 'JE-001031', '2025-12-31', 'Paid for fuel for the power generator', 'JV-JV-939', 'journal_entry', 1180.00, 1180.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4e97d037-e65b-4dcb-b639-0b80faf56098', '54c85cde-baf0-49f6-a68e-e1477ddd260b', id, 'Paid for fuel for the power generator', 1000.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b844be89-d2cb-4320-b101-6997c81ee485', '54c85cde-baf0-49f6-a68e-e1477ddd260b', id, 'Paid staff lunch expense', 180.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e248e8de-4f13-43d0-bc9f-93ce0b497f85', '54c85cde-baf0-49f6-a68e-e1477ddd260b', id, 'Paid staff lunch expense and fuel for the power generator', 0.00, 1180.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-940
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('79185ce8-81f8-41a5-adad-86e676998ec1', 'JE-001032', '2025-12-31', 'Paid for guards Friday lunch expense', 'JV-JV-940', 'journal_entry', 140.00, 140.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '962664b7-f6c5-493a-8622-2b7656368ded', '79185ce8-81f8-41a5-adad-86e676998ec1', id, 'Paid for guards Friday lunch expense', 140.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd2fbc6ec-534d-4002-aeef-449d06cda168', '79185ce8-81f8-41a5-adad-86e676998ec1', id, 'Paid for guards Friday lunch expense', 0.00, 140.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-941
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8f553d35-46c3-4e46-a2e3-163688c1de23', 'JE-001033', '2025-12-31', 'Food expense made by staff during travel to Nangarhar and Kunar branches', 'JV-JV-941', 'journal_entry', 10000.00, 10000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '57f42367-31db-4c83-be8b-01fc58b35c6c', '8f553d35-46c3-4e46-a2e3-163688c1de23', id, 'Food expense made by staff during travel to Nangarhar and Kunar branches', 215.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9f066a06-9e77-46eb-9373-83d524c49897', '8f553d35-46c3-4e46-a2e3-163688c1de23', id, 'Food expense made by staff during travel to Nangarhar and Kunar branches', 215.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ceee2b65-b481-41c7-af43-770488d41124', '8f553d35-46c3-4e46-a2e3-163688c1de23', id, 'Premium paid to Hanifullah for traveling to Kunar and Jalalabad', 3500.00, 0.00 FROM accounts WHERE account_code = '60002';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '691c67a9-520f-4f96-9d07-ead9e1e35904', '8f553d35-46c3-4e46-a2e3-163688c1de23', id, 'Premium paid to Hanifullah for traveling to Kunar and Jalalabad', 3500.00, 0.00 FROM accounts WHERE account_code = '60002';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4bc32b11-a03f-4e3a-9528-5924aa631274', '8f553d35-46c3-4e46-a2e3-163688c1de23', id, 'Taxi used by Hanifullah for traveling to Kunar and Jalalabad', 805.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f306539f-ad1b-4cfb-9f87-9c424ae49257', '8f553d35-46c3-4e46-a2e3-163688c1de23', id, 'Taxi used by Hanifullah for traveling to Kunar and Jalalabad', 805.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e7e38b40-97a1-4be3-b369-265e54792d31', '8f553d35-46c3-4e46-a2e3-163688c1de23', id, 'Purchased one mouse for the office use', 150.00, 0.00 FROM accounts WHERE account_code = '61207';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '569e8438-92cd-4267-acfc-eca3653e48cf', '8f553d35-46c3-4e46-a2e3-163688c1de23', id, 'Received cash back from Hanifullah Momand', 810.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '86a7cc65-b3f1-46d6-9224-4c093a0edf17', '8f553d35-46c3-4e46-a2e3-163688c1de23', id, 'Travel expenses by Hanifullah to Kunar and Jalalabad', 0.00, 10000.00 FROM accounts WHERE account_code = '20154';

-- Entry: JV-942
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6d3284dd-fca2-4993-956e-a2e78512cb1e', 'JE-001034', '2025-12-31', 'Kabul Financing officer''s salary payable for the month of Dec 2025', 'JV-JV-942', 'journal_entry', 387403.00, 387403.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '26238aa7-7a2d-41ec-9649-663fa18b3a58', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'Kabul Financing officer''s salary payable for the month of Dec 2025', 13005.00, 0.00 FROM accounts WHERE account_code = '51200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1f6d5f91-46e6-4e3d-aa92-a0a737885e16', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'Kunar Financing officer''s salary payable for the month of Dec 2025', 6000.00, 0.00 FROM accounts WHERE account_code = '51200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '96710942-39ac-4022-9b31-b0846c7d6caa', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'Jalalabad Financing officer''s salary payable for the month of Dec 2025', 6000.00, 0.00 FROM accounts WHERE account_code = '51200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f2fc44c0-753e-4fad-afae-6e61a15277af', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'Jalalabad Financing officer''s salary payable for the month of Dec 2025', 23032.00, 0.00 FROM accounts WHERE account_code = '60001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '31f9be43-9c88-400d-9376-b2afd8c87d08', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'Kunar Financing officer''s salary payable for the month of Dec 2025', 6000.00, 0.00 FROM accounts WHERE account_code = '60001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3c843000-6f56-4fb7-9c4d-b2e2e18dde52', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'HQ Staff salary payable for the month of Dec 2025', 333366.00, 0.00 FROM accounts WHERE account_code = '60001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '89eaed9e-e928-466b-a2c5-e502038a3401', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'HQ Staff salary payable for the month of Dec 2025', 0.00, 118142.00 FROM accounts WHERE account_code = '20169';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1141d45f-b534-48fb-89e9-1632421cb449', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'HQ Staff salary payable for the month of Dec 2025', 0.00, 51906.00 FROM accounts WHERE account_code = '20178';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'abf26ce9-2a57-4f3c-ae07-e4f246ac50a9', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'HQ Staff salary payable for the month of Dec 2025', 0.00, 23600.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7c8727fa-8c74-422c-96db-faa8a69f6acc', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'HQ Staff salary payable for the month of Dec 2025', 0.00, 23600.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fbaf693d-0d94-40b1-9c02-30442ce0a4a7', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'HQ Staff salary payable for the month of Dec 2025', 0.00, 30000.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1d893b61-947f-4887-8a20-a8c02e988d0c', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'HQ Staff salary payable for the month of Dec 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b014301d-f6a0-4ca9-bb06-642c11af0ef7', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'HQ Staff salary payable for the month of Dec 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd02d8422-93b8-4c4f-bfb5-4edee48b9354', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'HQ Staff salary payable for the month of Dec 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e5ecd09f-2737-49e3-8f99-1eec69e67cca', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'HQ Staff salary payable for the month of Dec 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20170';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '06f5d21e-ae62-44e2-8c84-fb8752893521', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'HQ Staff salary payable for the month of Dec 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20171';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a3d18649-bbf4-4902-b026-d592ab7d22b7', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'HQ Staff salary payable for the month of Dec 2025', 0.00, 10000.00 FROM accounts WHERE account_code = '20172';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8444372e-8285-4831-aca5-832af204f00f', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'HQ Staff salary payable for the month of Dec 2025', 0.00, 2903.00 FROM accounts WHERE account_code = '20179';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c46c3717-95d8-4e76-814f-8caaabfcb290', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'HQ Staff salary payable for the month of Dec 2025', 0.00, 9900.00 FROM accounts WHERE account_code = '20177';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b1015855-e885-4389-8eb8-3a757d83095a', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'HQ Staff salary payable for the month of Dec 2025', 0.00, 8920.00 FROM accounts WHERE account_code = '20180';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c2265d82-806b-4039-8e44-f5486dff58b2', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'HQ Staff salary payable for the month of Dec 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20181';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fd081502-18b9-4a67-8b47-50f205737e81', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'Jalalabad Staff salary payable for the month of Dec 2025', 0.00, 11860.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5ac2cf1d-c243-4c4d-8fb2-95faa90ccce1', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'Jalalabad Staff salary payable for the month of Dec 2025', 0.00, 10912.00 FROM accounts WHERE account_code = '20182';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '600f08ec-68e2-4e3c-bf46-13b31e6a7216', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'Jalalabad Staff salary payable for the month of Dec 2025', 0.00, 3000.00 FROM accounts WHERE account_code = '20174';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c7f038e9-3c34-4b71-8778-ac1a525bafac', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'Jalalabad Staff salary payable for the month of Dec 2025', 0.00, 3000.00 FROM accounts WHERE account_code = '20176';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6554af57-e4f3-483d-8aef-cbcefb09090f', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'Kunar Staff salary payable for the month of Dec 2025', 0.00, 5980.00 FROM accounts WHERE account_code = '20173';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9f9abb24-cb77-49ed-8300-185121300b7e', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'Kunar Staff salary payable for the month of Dec 2025', 0.00, 5980.00 FROM accounts WHERE account_code = '20175';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f8f95e3d-c93e-4b49-8f70-cb81d0be53bf', '6d3284dd-fca2-4993-956e-a2e78512cb1e', id, 'Staff salary withheld for the month of Dec 2025', 0.00, 25940.00 FROM accounts WHERE account_code = '21100';

-- Entry: JV-943
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bf5c740f-1711-4967-9da8-5364c0af7b0e', 'JE-001035', '2025-12-31', 'Bank Charges for the month of Dec 2025', 'JV-JV-943', 'journal_entry', 1049.62, 1049.62, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f01d877c-c8ec-4c56-8480-67455ba23505', 'bf5c740f-1711-4967-9da8-5364c0af7b0e', id, 'Bank Charges for the month of Dec 2025', 1049.62, 0.00 FROM accounts WHERE account_code = '61801';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8154bdfa-9337-44f5-a1bb-f942931daa7d', 'bf5c740f-1711-4967-9da8-5364c0af7b0e', id, 'Bank Charges for the month of Dec 2025', 0.00, 199.62 FROM accounts WHERE account_code = '10203';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0e43fb4a-dc40-405b-a428-a4efcad5764b', 'bf5c740f-1711-4967-9da8-5364c0af7b0e', id, 'Bank Charges for the month of Dec 2025', 0.00, 250.00 FROM accounts WHERE account_code = '10202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '44b5a015-f49d-47ab-8250-c7217dde59fa', 'bf5c740f-1711-4967-9da8-5364c0af7b0e', id, 'Bank Charges for the month of Dec 2025', 0.00, 150.00 FROM accounts WHERE account_code = '10204';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0f7db601-317c-4fcc-8113-87dd1a7aef1f', 'bf5c740f-1711-4967-9da8-5364c0af7b0e', id, 'Bank Charges for the month of Dec 2025', 0.00, 350.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a31be407-7799-41af-bcfb-8cec5816701d', 'bf5c740f-1711-4967-9da8-5364c0af7b0e', id, 'Bank Charges for the month of Dec 2025', 0.00, 100.00 FROM accounts WHERE account_code = '10207';

-- Entry: JV-944
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4d33ae35-dce0-4be1-b5fd-376114edd594', 'JE-001036', '2025-12-31', '2% provision booked for the month of Dec 2025', 'JV-JV-944', 'journal_entry', 62174.72, 62174.72, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f55ca7aa-b8dc-42f8-a900-4428fc5493bc', '4d33ae35-dce0-4be1-b5fd-376114edd594', id, '2% provision booked for the month of Dec 2025', 62174.72, 0.00 FROM accounts WHERE account_code = '80102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '76309027-5d1c-4935-be7c-8a4734cce197', '4d33ae35-dce0-4be1-b5fd-376114edd594', id, '2% provision booked for the month of Dec 2025', 0.00, 62174.72 FROM accounts WHERE account_code = '18000';

-- Entry: JV-945
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1928582b-b326-4930-93be-ad029dea0242', 'JE-001037', '2025-12-31', 'Depreciation booked for the month of Dec 2025', 'JV-JV-945', 'journal_entry', 24217.84, 24217.84, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '15dd298a-4ac9-4f91-80c5-835d2554e549', '1928582b-b326-4930-93be-ad029dea0242', id, 'Depreciation booked for the month of Dec 2025', 24217.84, 0.00 FROM accounts WHERE account_code = '61900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b1f3b35a-90ac-41b5-90cd-0f631e605560', '1928582b-b326-4930-93be-ad029dea0242', id, 'Depreciation booked for the month of Dec 2025', 0.00, 5537.85 FROM accounts WHERE account_code = '17102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e08cac40-67a0-45be-97f6-738712976686', '1928582b-b326-4930-93be-ad029dea0242', id, 'Depreciation booked for the month of Dec 2025', 0.00, 4967.04 FROM accounts WHERE account_code = '17202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a3edb71b-0de3-4bf6-b6da-813a34c151d6', '1928582b-b326-4930-93be-ad029dea0242', id, 'Depreciation booked for the month of Dec 2025', 0.00, 11609.14 FROM accounts WHERE account_code = '17302';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6fd2e786-e0a7-44a2-87b5-0dd55cf7bcec', '1928582b-b326-4930-93be-ad029dea0242', id, 'Depreciation booked for the month of Dec 2025', 0.00, 2103.81 FROM accounts WHERE account_code = '17502';

-- Entry: JV-946
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5b708d37-c020-4e76-abe5-b9dd2669e79e', 'JE-001038', '2025-12-31', 'Adjustment to bank charges missed to book in previous months of 2025', 'JV-JV-946', 'journal_entry', 599.62, 599.62, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5d6a0936-dbc5-48de-b388-0b3b6214c21a', '5b708d37-c020-4e76-abe5-b9dd2669e79e', id, 'Adjustment to bank charges missed to book in previous months of 2025', 599.62, 0.00 FROM accounts WHERE account_code = '61801';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9dfd61b0-a018-4e1b-a429-01d2db6437aa', '5b708d37-c020-4e76-abe5-b9dd2669e79e', id, 'Adjustment to bank charges missed to book in previous months of 2025', 0.00, 250.00 FROM accounts WHERE account_code = '10202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1fc6dd0e-5e5e-4a40-9c95-4ca114549f3b', '5b708d37-c020-4e76-abe5-b9dd2669e79e', id, 'Adjustment to bank charges missed to book in previous months of 2025', 0.00, 199.62 FROM accounts WHERE account_code = '10203';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '256238bd-aa54-4d52-85be-f12ded3746e4', '5b708d37-c020-4e76-abe5-b9dd2669e79e', id, 'Adjustment to bank charges missed to book in previous months of 2025', 0.00, 150.00 FROM accounts WHERE account_code = '10204';

-- Entry: JV-947
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f007895f-8a28-4a4e-8d28-d06438b4ffb6', 'JE-001039', '2025-12-31', 'Purchased inventory on murabaha loan for Mr. Abdul Zahir', 'JV-JV-947', 'journal_entry', 1065000.00, 1065000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bd145012-8f93-4c13-92e5-81fff7925060', 'f007895f-8a28-4a4e-8d28-d06438b4ffb6', id, 'Purchased inventory on murabaha loan for Mr. Abdul Zahir', 250000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '57b16b94-0369-4abc-82de-3cf384e0751d', 'f007895f-8a28-4a4e-8d28-d06438b4ffb6', id, 'Purchased inventory on murabaha loan for Abdulllah', 70000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3e024d47-2eab-4d1b-bc12-8e2a6f8b89cb', 'f007895f-8a28-4a4e-8d28-d06438b4ffb6', id, 'Purchased inventory on murabaha loan for Ismail Khan', 95000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '97d5969d-0b38-43af-bcd0-439d5b8212bd', 'f007895f-8a28-4a4e-8d28-d06438b4ffb6', id, 'Purchased inventory on murabaha loan for Mr. Jamil', 70000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8e0aeccf-15ed-4052-99b2-cf5e7e25a0ea', 'f007895f-8a28-4a4e-8d28-d06438b4ffb6', id, 'Purchased inventory on murabaha loan for Mr. Jamil', 150000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '157f90cd-5ae8-410e-bebc-3705bd3013ef', 'f007895f-8a28-4a4e-8d28-d06438b4ffb6', id, 'Purchased inventory on murabaha loan for Mr. Shir Ahmad', 120000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4e16ffe0-97c1-4771-86b7-413cff2addae', 'f007895f-8a28-4a4e-8d28-d06438b4ffb6', id, 'Purchased inventory on murabaha loan for Mr. Waheedulah', 80000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '06b3e17e-9fcb-441e-94b6-a716fe087e1c', 'f007895f-8a28-4a4e-8d28-d06438b4ffb6', id, 'Purchased inventory on murabaha loan for Mr. Walayat', 150000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a0185934-e91a-4d74-af10-04dea89e9a1b', 'f007895f-8a28-4a4e-8d28-d06438b4ffb6', id, 'Purchased inventory on murabaha loan for Abdul Bayes', 80000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4350dc1e-44a2-4d07-8e5a-4bf9e1c0d413', 'f007895f-8a28-4a4e-8d28-d06438b4ffb6', id, 'Purchased inventory on murabaha loan In Nangarhar', 0.00, 1065000.00 FROM accounts WHERE account_code = '10103';

-- Entry: JV-948
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b527d6e6-01df-4013-a4eb-45ecc487eb75', 'JE-001040', '2025-12-31', 'Purchased inventory on Murabaha for Mr. Abdullah', 'JV-JV-948', 'journal_entry', 1670000.00, 1670000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b0ec463c-6575-4bff-a948-aa556431c663', 'b527d6e6-01df-4013-a4eb-45ecc487eb75', id, 'Purchased inventory on Murabaha for Mr. Abdullah', 200000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8186a9aa-a290-43ef-8267-c46bd2d67629', 'b527d6e6-01df-4013-a4eb-45ecc487eb75', id, 'Purchased inventory on Murabaha for Mr. Amanullah', 200000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '22303092-e35a-4e64-a047-cfc66bcc7fcd', 'b527d6e6-01df-4013-a4eb-45ecc487eb75', id, 'Purchased inventory on Murabaha for Mr. Badam Khan', 50000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1db431bd-fb0d-4fb5-8e5c-f7b8f15907c7', 'b527d6e6-01df-4013-a4eb-45ecc487eb75', id, 'Purchased inventory on Murabaha for Mr. Taj Muhammad Hassan Khan', 70000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2f3d8b64-038d-4276-81f1-386ab469806a', 'b527d6e6-01df-4013-a4eb-45ecc487eb75', id, 'Purchased inventory on Murabaha for Mr. Hassan Khan', 90000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c452fae6-0c75-4c3a-a6f2-b4a718bc9fae', 'b527d6e6-01df-4013-a4eb-45ecc487eb75', id, 'Purchased inventory on Murabaha for Mr. Khair Muhammad', 170000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c5183aa5-ba61-44f1-b6ad-d95144a5d5c4', 'b527d6e6-01df-4013-a4eb-45ecc487eb75', id, 'Purchased inventory on Murabaha for Mr. Zakerullah', 300000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e4807397-3c62-4591-9d76-9a80ea6c52f2', 'b527d6e6-01df-4013-a4eb-45ecc487eb75', id, 'Purchased inventory on Murabaha for Mr. Rahmatullah', 50000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '78599cb9-ec11-47a4-a2b6-2c4a2f066a59', 'b527d6e6-01df-4013-a4eb-45ecc487eb75', id, 'Purchased inventory on Murabaha for Mr. Muhammad Khitab', 190000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '08d2613a-2ad7-47be-acc3-1a49521eb870', 'b527d6e6-01df-4013-a4eb-45ecc487eb75', id, 'Purchased inventory on Murabaha for Mr. Izatullah', 100000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c1c97d4-c5b4-4b4d-8c96-c42dc386f863', 'b527d6e6-01df-4013-a4eb-45ecc487eb75', id, 'Purchased inventory on Murabaha for Mr. Muhammad Khan', 250000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'abe0d062-d293-4d39-aa24-c3ca773c2fba', 'b527d6e6-01df-4013-a4eb-45ecc487eb75', id, 'Purchased inventory on Murabaha in Kunar', 0.00, 1670000.00 FROM accounts WHERE account_code = '10104';

-- Entry: JV-949
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('af1f71fa-d458-4073-a2b4-53072bef587d', 'JE-001041', '2025-12-31', 'Purchase inventory for Mr. Safiullah Momand', 'JV-JV-949', 'journal_entry', 222750.00, 222750.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b4f98ce8-083e-4310-8fa3-8b49eb8e4541', 'af1f71fa-d458-4073-a2b4-53072bef587d', id, 'Purchase inventory for Mr. Safiullah Momand', 222750.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'df015fa2-9503-4c03-94d4-10f17c2d3d76', 'af1f71fa-d458-4073-a2b4-53072bef587d', id, 'Purchase inventory for Mr. Safiullah Momand', 0.00, 222750.00 FROM accounts WHERE account_code = '10100';

-- Entry: LCI086
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('49bbb6da-29c3-48ab-bf07-902a97998b13', 'JE-001042', '2025-12-31', 'Imported entry', 'JV-LCI086', 'financing_disbursement', 290000.00, 290000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'caedb35a-ddf4-4186-a962-c810716769ba', '49bbb6da-29c3-48ab-bf07-902a97998b13', id, '', 290000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0a214fcb-9e22-410b-9fe2-78ade81e6a12', '49bbb6da-29c3-48ab-bf07-902a97998b13', id, 'Purchased asset for customer on loan', 0.00, 250000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '701d6114-dd2d-4104-a416-cc796ffb4364', '49bbb6da-29c3-48ab-bf07-902a97998b13', id, 'Cost occurred on purchased product on loan for customers', 0.00, 40000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI087
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e787119e-bd51-46ec-ab38-b8f1e57735ed', 'JE-001043', '2025-12-31', 'Imported entry', 'JV-LCI087', 'financing_disbursement', 81200.00, 81200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '79360510-dfce-4ae4-bb50-193b4be8cd38', 'e787119e-bd51-46ec-ab38-b8f1e57735ed', id, '', 81200.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9f5ac935-3cea-43ac-b869-c6e688c6fc7e', 'e787119e-bd51-46ec-ab38-b8f1e57735ed', id, 'Purchased asset for customer on loan', 0.00, 70000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a1180423-8414-4172-bd98-30b7c60ae4c2', 'e787119e-bd51-46ec-ab38-b8f1e57735ed', id, 'Cost occurred on purchased product on loan for customers', 0.00, 11200.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI088
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('af499044-e6ab-41d3-838a-5fc21dcab39b', 'JE-001044', '2025-12-31', 'Imported entry', 'JV-LCI088', 'financing_disbursement', 110200.00, 110200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3e6f1b3d-05bd-436e-92dd-736a7eaa714d', 'af499044-e6ab-41d3-838a-5fc21dcab39b', id, '', 110200.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '04772d1c-6b23-47f0-ab98-0bad0f32912d', 'af499044-e6ab-41d3-838a-5fc21dcab39b', id, 'Purchased asset for customer on loan', 0.00, 95000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2de7000b-5bad-43ce-b146-ea2e16b3dfc4', 'af499044-e6ab-41d3-838a-5fc21dcab39b', id, 'Cost occurred on purchased product on loan for customers', 0.00, 15200.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI089
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('844b791c-1ee4-4ec4-b328-37b4aa152175', 'JE-001045', '2025-12-31', 'Imported entry', 'JV-LCI089', 'financing_disbursement', 81200.00, 81200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6c20b555-4e0e-4bdc-8653-d823ac49769e', '844b791c-1ee4-4ec4-b328-37b4aa152175', id, '', 81200.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '669e8e44-19c2-492d-9e99-424da065f9fa', '844b791c-1ee4-4ec4-b328-37b4aa152175', id, 'Purchased asset for customer on loan', 0.00, 70000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1a46ffb5-06c8-49a2-bb24-8053a2259750', '844b791c-1ee4-4ec4-b328-37b4aa152175', id, 'Cost occurred on purchased product on loan for customers', 0.00, 11200.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI090
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('851b6687-b587-4d71-8530-4d907704cb1b', 'JE-001046', '2025-12-31', 'Imported entry', 'JV-LCI090', 'financing_disbursement', 174000.00, 174000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '08b542ae-53d8-45c4-944f-6fae4677561e', '851b6687-b587-4d71-8530-4d907704cb1b', id, '', 174000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '04f0a1c1-3db0-437c-bd9f-15e232b42591', '851b6687-b587-4d71-8530-4d907704cb1b', id, 'Purchased asset for customer on loan', 0.00, 150000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1a155409-178f-4b54-8228-95f145b9bf5e', '851b6687-b587-4d71-8530-4d907704cb1b', id, 'Cost occurred on purchased product on loan for customers', 0.00, 24000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI091
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f90ea372-62ee-4931-950d-592799529893', 'JE-001047', '2025-12-31', 'Imported entry', 'JV-LCI091', 'financing_disbursement', 139200.00, 139200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c299774-d398-401c-bf7d-30b0a1ffe259', 'f90ea372-62ee-4931-950d-592799529893', id, '', 139200.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a593a1ed-c7c7-47ca-80a4-cc233d935657', 'f90ea372-62ee-4931-950d-592799529893', id, 'Purchased asset for customer on loan', 0.00, 120000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6f27f449-d8ba-4ed8-8d7e-3aeef16ee353', 'f90ea372-62ee-4931-950d-592799529893', id, 'Cost occurred on purchased product on loan for customers', 0.00, 19200.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI092
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('07ab4e9a-0445-4614-adaf-46409632f555', 'JE-001048', '2025-12-31', 'Imported entry', 'JV-LCI092', 'financing_disbursement', 92800.00, 92800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '76caede2-ffcc-4dde-a5aa-019b45839108', '07ab4e9a-0445-4614-adaf-46409632f555', id, '', 92800.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'da4382e7-1885-4e53-9eb1-b75d1ffa0b5c', '07ab4e9a-0445-4614-adaf-46409632f555', id, 'Purchased asset for customer on loan', 0.00, 80000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '986125df-7b58-4031-9db4-21ca0c5988f3', '07ab4e9a-0445-4614-adaf-46409632f555', id, 'Cost occurred on purchased product on loan for customers', 0.00, 12800.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI093
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f05dc564-aead-4880-856d-67bb9cc7a7d1', 'JE-001049', '2025-12-31', 'Imported entry', 'JV-LCI093', 'financing_disbursement', 174000.00, 174000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aa2db99c-8500-45a9-afe7-62738ca117f3', 'f05dc564-aead-4880-856d-67bb9cc7a7d1', id, '', 174000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b8649b71-1b91-436f-9459-02288ff3705f', 'f05dc564-aead-4880-856d-67bb9cc7a7d1', id, 'Purchased asset for customer on loan', 0.00, 150000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4a2b7daf-ff5a-48b0-ba55-94a461a1efd3', 'f05dc564-aead-4880-856d-67bb9cc7a7d1', id, 'Cost occurred on purchased product on loan for customers', 0.00, 24000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI094
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d25e0ba8-bd25-4c9f-9814-0cc50e62c879', 'JE-001050', '2025-12-31', 'Imported entry', 'JV-LCI094', 'financing_disbursement', 232000.00, 232000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8a71fbae-93b6-4c08-9926-c0da66436f01', 'd25e0ba8-bd25-4c9f-9814-0cc50e62c879', id, '', 232000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7697b663-abfb-4792-be58-b718d09114c0', 'd25e0ba8-bd25-4c9f-9814-0cc50e62c879', id, 'Purchased asset for customer on loan', 0.00, 200000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b22adcd9-b440-4e20-94d7-97908854f8b6', 'd25e0ba8-bd25-4c9f-9814-0cc50e62c879', id, 'Cost occurred on purchased product on loan for customers', 0.00, 32000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI095
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8a1cc0e7-a647-431d-8a67-56d3f9ce73be', 'JE-001051', '2025-12-31', 'Imported entry', 'JV-LCI095', 'financing_disbursement', 58000.00, 58000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2aa41a28-acf2-4f34-aa18-01a23a15bbc3', '8a1cc0e7-a647-431d-8a67-56d3f9ce73be', id, '', 58000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f983c148-b8da-4810-8d8d-fde748b216fb', '8a1cc0e7-a647-431d-8a67-56d3f9ce73be', id, 'Purchased asset for customer on loan', 0.00, 50000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0426569b-90bf-4170-b7e3-d0114ed99e0f', '8a1cc0e7-a647-431d-8a67-56d3f9ce73be', id, 'Cost occurred on purchased product on loan for customers', 0.00, 8000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI096
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('26d5eba0-7a2c-4e31-9e34-069efada84d9', 'JE-001052', '2025-12-31', 'Imported entry', 'JV-LCI096', 'financing_disbursement', 81200.00, 81200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3661f17e-c974-44cd-a36d-3a516bb95320', '26d5eba0-7a2c-4e31-9e34-069efada84d9', id, '', 81200.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1da9f821-a657-410a-b7e1-46a43f3db067', '26d5eba0-7a2c-4e31-9e34-069efada84d9', id, 'Purchased asset for customer on loan', 0.00, 70000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '84cd9603-4e4e-4a9d-beab-15b27eeba6d2', '26d5eba0-7a2c-4e31-9e34-069efada84d9', id, 'Cost occurred on purchased product on loan for customers', 0.00, 11200.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI097
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7cafcc46-1501-4c15-8f5b-c41efe2ee5fb', 'JE-001053', '2025-12-31', 'Imported entry', 'JV-LCI097', 'financing_disbursement', 104400.00, 104400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '19bfc5a4-e184-4de9-bef8-9a8ff75e7843', '7cafcc46-1501-4c15-8f5b-c41efe2ee5fb', id, '', 104400.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '43a22f0a-25d5-42c8-870e-f14546720cca', '7cafcc46-1501-4c15-8f5b-c41efe2ee5fb', id, 'Purchased asset for customer on loan', 0.00, 90000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9dafad1a-8194-4703-bc00-4e9630761722', '7cafcc46-1501-4c15-8f5b-c41efe2ee5fb', id, 'Cost occurred on purchased product on loan for customers', 0.00, 14400.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI098
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1610d5de-40cc-4094-b582-a05793100f0f', 'JE-001054', '2025-12-31', 'Imported entry', 'JV-LCI098', 'financing_disbursement', 197200.00, 197200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'db5eade3-8a76-4cf7-bdd4-f8e74ee35e42', '1610d5de-40cc-4094-b582-a05793100f0f', id, '', 197200.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd2e696e5-3b29-4434-8875-a8561855bdd7', '1610d5de-40cc-4094-b582-a05793100f0f', id, 'Purchased asset for customer on loan', 0.00, 170000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ed86bbac-ddec-4c1e-a2ab-7e7684eded83', '1610d5de-40cc-4094-b582-a05793100f0f', id, 'Cost occurred on purchased product on loan for customers', 0.00, 27200.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI099
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('069b2310-6be7-4a77-99db-bf909212767e', 'JE-001055', '2025-12-31', 'Imported entry', 'JV-LCI099', 'financing_disbursement', 348000.00, 348000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ad15f07c-c121-43ff-b53c-505c239892db', '069b2310-6be7-4a77-99db-bf909212767e', id, '', 348000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b97610ac-db53-4803-bb8e-de93ed4ced2c', '069b2310-6be7-4a77-99db-bf909212767e', id, 'Purchased asset for customer on loan', 0.00, 300000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '292678af-21da-43ae-a841-effcd08b90db', '069b2310-6be7-4a77-99db-bf909212767e', id, 'Cost occurred on purchased product on loan for customers', 0.00, 48000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI100
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('df536ced-aae2-4e3d-ad05-db5d9612fe23', 'JE-001056', '2025-12-31', 'Imported entry', 'JV-LCI100', 'financing_disbursement', 58000.00, 58000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c5a245c5-3d2f-48d4-87d6-f3367c21e360', 'df536ced-aae2-4e3d-ad05-db5d9612fe23', id, '', 58000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '950309d4-1358-43d5-9fae-b2d095576ffe', 'df536ced-aae2-4e3d-ad05-db5d9612fe23', id, 'Purchased asset for customer on loan', 0.00, 50000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e14d7ee4-84d4-4814-84ba-4f7e0317cf09', 'df536ced-aae2-4e3d-ad05-db5d9612fe23', id, 'Cost occurred on purchased product on loan for customers', 0.00, 8000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI101
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('67356201-50bf-4e7e-9604-573ac3a744c4', 'JE-001057', '2025-12-31', 'Imported entry', 'JV-LCI101', 'financing_disbursement', 258390.00, 258390.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e235ee70-01bb-43d2-8334-ba22083b9067', '67356201-50bf-4e7e-9604-573ac3a744c4', id, '', 258390.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1bf9a572-72c4-411a-b359-8a4bd3e7b77d', '67356201-50bf-4e7e-9604-573ac3a744c4', id, 'Purchased asset for customer on loan', 0.00, 222750.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f9cd151c-98a9-46df-9a84-9969b090eeee', '67356201-50bf-4e7e-9604-573ac3a744c4', id, 'Cost occurred on purchased product on loan for customers', 0.00, 35640.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI102
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0ce4bb06-a740-4bc1-bdcb-0149618e84a3', 'JE-001058', '2025-12-31', 'Imported entry', 'JV-LCI102', 'financing_disbursement', 220400.00, 220400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c865cb9b-a014-4b49-a564-c106d4d34112', '0ce4bb06-a740-4bc1-bdcb-0149618e84a3', id, '', 220400.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2108cdb3-8dc1-416d-a71b-1394ad5e4a0e', '0ce4bb06-a740-4bc1-bdcb-0149618e84a3', id, 'Purchased asset for customer on loan', 0.00, 190000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b4516e72-a0ea-4ace-9fc5-8a429522ea93', '0ce4bb06-a740-4bc1-bdcb-0149618e84a3', id, 'Cost occurred on purchased product on loan for customers', 0.00, 30400.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI103
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('59b76144-3009-4dc5-80bc-cfe161a4b866', 'JE-001059', '2025-12-31', 'Imported entry', 'JV-LCI103', 'financing_disbursement', 116000.00, 116000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7895f520-3bef-4477-ac87-c7c4e584cdea', '59b76144-3009-4dc5-80bc-cfe161a4b866', id, '', 116000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ba8aac5c-405b-43bb-be22-1e8000d61b4d', '59b76144-3009-4dc5-80bc-cfe161a4b866', id, 'Purchased asset for customer on loan', 0.00, 100000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '42891414-9480-4535-bb7d-ce0b385a208a', '59b76144-3009-4dc5-80bc-cfe161a4b866', id, 'Cost occurred on purchased product on loan for customers', 0.00, 16000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI104
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a6cbb22e-a668-45f4-ab92-474a2cb9c676', 'JE-001060', '2025-12-31', 'Imported entry', 'JV-LCI104', 'financing_disbursement', 92800.00, 92800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '99c6abaa-809f-47d3-9650-c57da2913c52', 'a6cbb22e-a668-45f4-ab92-474a2cb9c676', id, '', 92800.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f73dab80-4a6f-41f8-867c-ce83a8dc6ae2', 'a6cbb22e-a668-45f4-ab92-474a2cb9c676', id, 'Purchased asset for customer on loan', 0.00, 80000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a2754fe8-b64f-4176-be31-1cce73f19cd9', 'a6cbb22e-a668-45f4-ab92-474a2cb9c676', id, 'Cost occurred on purchased product on loan for customers', 0.00, 12800.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI105
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fd2c4dae-850f-445e-b6c0-fa0434ab204d', 'JE-001061', '2025-12-31', 'Imported entry', 'JV-LCI105', 'financing_disbursement', 290000.00, 290000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1aefb947-dc1a-4ef9-b5d3-6f0c159b97f7', 'fd2c4dae-850f-445e-b6c0-fa0434ab204d', id, '', 290000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4b2a2f56-4ea2-4c01-b07e-5215803a4277', 'fd2c4dae-850f-445e-b6c0-fa0434ab204d', id, 'Purchased asset for customer on loan', 0.00, 250000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fe967474-7148-4434-9cf2-fe8d849ecb01', 'fd2c4dae-850f-445e-b6c0-fa0434ab204d', id, 'Cost occurred on purchased product on loan for customers', 0.00, 40000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI107
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f75ac442-4887-4927-bb9b-f63692f88f17', 'JE-001062', '2025-12-31', 'Imported entry', 'JV-LCI107', 'financing_disbursement', 232000.00, 232000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3f9987c2-1cc5-4ee2-92c8-8fe498074b94', 'f75ac442-4887-4927-bb9b-f63692f88f17', id, '', 232000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ca13fdba-44cf-4c71-9de3-bc61ae346c46', 'f75ac442-4887-4927-bb9b-f63692f88f17', id, 'Purchased asset for customer on loan', 0.00, 200000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3d83ba28-c980-4c3b-be6d-1cb1ee957afb', 'f75ac442-4887-4927-bb9b-f63692f88f17', id, 'Cost occurred on purchased product on loan for customers', 0.00, 32000.00 FROM accounts WHERE account_code = '20900';

-- Entry: JV-950
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('10aec3ba-d855-4e8a-ab73-f0ea6907122e', 'JE-001063', '2025-12-31', 'PCR user fee paid', 'JV-JV-950', 'journal_entry', 6712.00, 6712.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '69b819d9-0b1d-4f1a-ae04-a3a8d673915d', '10aec3ba-d855-4e8a-ab73-f0ea6907122e', id, 'PCR user fee paid', 5000.00, 0.00 FROM accounts WHERE account_code = '70000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c2e9b9ef-598e-42df-991c-a447dd6ccae5', '10aec3ba-d855-4e8a-ab73-f0ea6907122e', id, 'PCR user fee paid', 0.00, 5000.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6c610b25-3dce-42ad-a25d-0479c352a133', '10aec3ba-d855-4e8a-ab73-f0ea6907122e', id, 'Booking Quickbooks subscription free expense for the month of Dec 2025', 1712.00, 0.00 FROM accounts WHERE account_code = '70000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '26ab6022-65b6-4dea-9a9c-dad95459bc6b', '10aec3ba-d855-4e8a-ab73-f0ea6907122e', id, 'Booking Quickbooks subscription free expense for the month of Dec 2025', 0.00, 1712.00 FROM accounts WHERE account_code = '13100';

-- Entry: JV-951
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('beb9d9c6-089f-44b2-a563-fc3ea34daf8a', 'JE-001064', '2025-12-31', 'Murabaha margin collected for the month of Dec 2025', 'JV-JV-951', 'journal_entry', 20687.27, 20687.27, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '661a8a70-8e23-4bf2-9ac2-6d108ab6a1cf', 'beb9d9c6-089f-44b2-a563-fc3ea34daf8a', id, 'Murabaha margin collected for the month of Dec 2025', 20687.27, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd74b144d-124d-4ea8-9e57-f31ed5d48bdf', 'beb9d9c6-089f-44b2-a563-fc3ea34daf8a', id, 'Murabaha margin collected for the month of Dec 2025', 0.00, 20687.27 FROM accounts WHERE account_code = '50300';

-- Entry: JV-952
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fc032c99-7175-4905-bcef-ccd88bc0c2cd', 'JE-001065', '2026-01-01', 'Cash Received  CR# 114 for staff salary', 'JV-JV-952', 'journal_entry', 172590.00, 172590.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b1dfb1c6-44ed-4529-9c36-e4c88e344667', 'fc032c99-7175-4905-bcef-ccd88bc0c2cd', id, 'Cash Received  CR# 114 for staff salary', 172590.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '643a4083-f9a9-44eb-bc39-b4fa5d380790', 'fc032c99-7175-4905-bcef-ccd88bc0c2cd', id, 'Cash Received  CR# 114 for staff salary', 0.00, 172590.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-953
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('dc3d3ab7-af6d-4a30-8584-ef26d9deb813', 'JE-001066', '2026-01-01', 'Salary paid for the month of Dec 2025', 'JV-JV-953', 'journal_entry', 161629.00, 161629.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5cc85256-d22a-47eb-a48a-84574da6dfe4', 'dc3d3ab7-af6d-4a30-8584-ef26d9deb813', id, 'Salary paid for the month of Dec 2025', 51906.00, 0.00 FROM accounts WHERE account_code = '20178';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '440ed8cd-2f81-4ce4-a2d7-c266edb84ba7', 'dc3d3ab7-af6d-4a30-8584-ef26d9deb813', id, 'Salary paid for the month of Dec 2025', 23600.00, 0.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6cec0ca3-99dd-4697-ae28-8e6d6b0bdf08', 'dc3d3ab7-af6d-4a30-8584-ef26d9deb813', id, 'Salary paid for the month of Dec 2025', 23600.00, 0.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7dfa5801-ea48-491c-94cc-c28f6c4ff36d', 'dc3d3ab7-af6d-4a30-8584-ef26d9deb813', id, 'Salary paid for the month of Dec 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9a20fb90-8b67-4326-9cbc-990c6d9421f1', 'dc3d3ab7-af6d-4a30-8584-ef26d9deb813', id, 'Salary paid for the month of Dec 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f27a8a0a-fb74-4ba4-b076-793aa9be825f', 'dc3d3ab7-af6d-4a30-8584-ef26d9deb813', id, 'Salary paid for the month of Dec 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '06163135-a6a9-4c53-aa8f-8cf59440b6b7', 'dc3d3ab7-af6d-4a30-8584-ef26d9deb813', id, 'Salary paid for the month of Dec 2025', 2960.00, 0.00 FROM accounts WHERE account_code = '20171';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1f35dec1-066e-4572-9bf1-6d9b293135a9', 'dc3d3ab7-af6d-4a30-8584-ef26d9deb813', id, 'Salary paid for the month of Dec 2025', 10000.00, 0.00 FROM accounts WHERE account_code = '20172';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'da2017e7-a8eb-4c0b-ac33-e056bb777038', 'dc3d3ab7-af6d-4a30-8584-ef26d9deb813', id, 'Salary paid for the month of Dec 2025', 2903.00, 0.00 FROM accounts WHERE account_code = '20179';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '866e961b-7c91-4d6a-adae-b9716099ed06', 'dc3d3ab7-af6d-4a30-8584-ef26d9deb813', id, 'Salary paid for the month of Dec 2025', 9900.00, 0.00 FROM accounts WHERE account_code = '20177';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '625587bb-3518-4229-b5a6-5607e444575c', 'dc3d3ab7-af6d-4a30-8584-ef26d9deb813', id, 'Salary paid for the month of Dec 2025', 8920.00, 0.00 FROM accounts WHERE account_code = '20180';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3ed58d1d-43b2-4c7b-ad19-30d916ec8578', 'dc3d3ab7-af6d-4a30-8584-ef26d9deb813', id, 'Salary paid for the month of Dec 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20181';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b48a2ee5-4837-47d6-a227-8255a0e00498', 'dc3d3ab7-af6d-4a30-8584-ef26d9deb813', id, 'Salary paid for the month of Dec 2025', 0.00, 161629.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-954
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1c125c8f-c72d-4c6b-b81a-732bb08a2dd8', 'JE-001067', '2026-01-01', 'Paid for the purchase of small locks for office doors, and changing location of AC', 'JV-JV-954', 'journal_entry', 76760.00, 76760.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '14fc5cb4-62b6-4327-80b0-be7ea2d862db', '1c125c8f-c72d-4c6b-b81a-732bb08a2dd8', id, 'Paid for the purchase of small locks for office doors, and changing location of AC', 1760.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bf4a4bd8-665d-4f0c-b7bc-e894d0a08c8c', '1c125c8f-c72d-4c6b-b81a-732bb08a2dd8', id, 'Paid for the purchase of small locks for office doors, and changing location of AC', 0.00, 1760.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e2c65051-c784-4b39-b719-75b431c9f152', '1c125c8f-c72d-4c6b-b81a-732bb08a2dd8', id, 'Paid for board of directors'' fee', 75000.00, 0.00 FROM accounts WHERE account_code = '60410';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '00f104cd-126f-4881-9adc-6eda0fc6a9d8', '1c125c8f-c72d-4c6b-b81a-732bb08a2dd8', id, 'Paid for board of directors'' fee', 0.00, 25000.00 FROM accounts WHERE account_code = '20163';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '85d5dbcb-e243-4efe-924d-267c738bca6d', '1c125c8f-c72d-4c6b-b81a-732bb08a2dd8', id, 'Paid for board of directors'' fee', 0.00, 25000.00 FROM accounts WHERE account_code = '20162';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3a9f91d6-3624-42ce-87e1-2cc51c78f4cc', '1c125c8f-c72d-4c6b-b81a-732bb08a2dd8', id, 'Paid for board of directors'' fee', 0.00, 25000.00 FROM accounts WHERE account_code = '20164';

-- Entry: JV-955
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5abb531c-ec36-4eec-ba79-2c6f8f47825a', 'JE-001068', '2026-01-01', 'Paid for taxi charges to Liaqat for office to city', 'JV-JV-955', 'journal_entry', 21670.00, 21670.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f7edc222-e91a-4cf0-9aff-f9ca797deea4', '5abb531c-ec36-4eec-ba79-2c6f8f47825a', id, 'Paid for taxi charges to Liaqat for office to city', 320.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f8603ccb-3f70-4cd9-bdae-0b0d823d2b4f', '5abb531c-ec36-4eec-ba79-2c6f8f47825a', id, 'Paid for taxi charges to Liaqat for office to city', 0.00, 320.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '417c9c67-35c2-4e41-a928-1146115e8454', '5abb531c-ec36-4eec-ba79-2c6f8f47825a', id, '', 7810.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd774e27b-9a81-4d00-bcfe-06c7ebb4f2ce', '5abb531c-ec36-4eec-ba79-2c6f8f47825a', id, '', 0.00, 7810.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '530585a3-dbd5-4c99-a9e3-32cd49e8225e', '5abb531c-ec36-4eec-ba79-2c6f8f47825a', id, '', 13540.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4e4e0a52-81a7-4489-9e47-035f881a9ac0', '5abb531c-ec36-4eec-ba79-2c6f8f47825a', id, '', 0.00, 13540.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-956
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('50cbde3b-8d7c-4edd-8b25-472e79133ede', 'JE-001069', '2026-01-03', 'Paid for power generator fuel', 'JV-JV-956', 'journal_entry', 4070.00, 4070.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '94e6bd22-7bba-4ed2-a117-8958f85347bb', '50cbde3b-8d7c-4edd-8b25-472e79133ede', id, 'Paid for power generator fuel', 1000.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b971ed5b-da32-4765-8865-f4620a551c90', '50cbde3b-8d7c-4edd-8b25-472e79133ede', id, 'Paid for staff lunch working on Friday', 700.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '772c8c40-9c82-4b9c-b3b0-b81849a797e1', '50cbde3b-8d7c-4edd-8b25-472e79133ede', id, 'Paid for staff lunch working on Friday and power generator fuel', 0.00, 1700.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1c410f20-073e-4430-822c-18b6b24cfca8', '50cbde3b-8d7c-4edd-8b25-472e79133ede', id, 'Purchase of pot for water boiler, thermos for tea, glass for tea', 2370.00, 0.00 FROM accounts WHERE account_code = '60503';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a5d04d2e-ca8c-4375-aa20-3c47ed4a38cf', '50cbde3b-8d7c-4edd-8b25-472e79133ede', id, 'Purchase of pot for water boiler, thermos for tea, glass for tea', 0.00, 2370.00 FROM accounts WHERE account_code = '20168';

-- Entry: JV-957
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e276bbfb-b27c-43af-9f6f-edb4b4ec432c', 'JE-001070', '2026-01-03', 'Paid for small cells', 'JV-JV-957', 'journal_entry', 1230.00, 1230.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ff37050d-b33d-430e-b1f7-8b3010f452fa', 'e276bbfb-b27c-43af-9f6f-edb4b4ec432c', id, 'Paid for small cells', 20.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '04c53c27-fd9f-4394-bee0-88b1f1c18b7c', 'e276bbfb-b27c-43af-9f6f-edb4b4ec432c', id, 'Paid for office lunch expenses', 220.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c734d97a-bbf9-41ae-af69-af3ee0527b0b', 'e276bbfb-b27c-43af-9f6f-edb4b4ec432c', id, 'Paid for gas for the office heaters and kitchen', 990.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd352a2cd-6d0c-4b2f-8064-c0f06f296354', 'e276bbfb-b27c-43af-9f6f-edb4b4ec432c', id, 'Paid for lunch expense, gas, and small batteries', 0.00, 1230.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-958
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5dc87d44-038b-40f2-b137-a2f0da89788e', 'JE-001071', '2026-01-03', 'Cash Received CR# 113 for the purchase of furniture', 'JV-JV-958', 'journal_entry', 150000.00, 150000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e9f871a0-0668-477a-aa3c-bbc40632e0c9', '5dc87d44-038b-40f2-b137-a2f0da89788e', id, 'Cash Received CR# 113 for the purchase of furniture', 150000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '810bdce2-a595-4888-9a3e-5c2ccd4c3cb0', '5dc87d44-038b-40f2-b137-a2f0da89788e', id, 'Cash Received CR# 113 for the purchase of furniture', 0.00, 150000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-959
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('55d21324-6d26-4592-b28b-c6e4e7159bb0', 'JE-001072', '2026-01-03', 'Paid for the purchase of furniture for HQ third floor', 'JV-JV-959', 'journal_entry', 153140.00, 153140.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b69baa10-9f55-4f70-ba45-4901924b32f5', '55d21324-6d26-4592-b28b-c6e4e7159bb0', id, 'Paid for the purchase of furniture for HQ third floor', 153140.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e275da3d-af16-4ac0-9fe4-e32e405690b5', '55d21324-6d26-4592-b28b-c6e4e7159bb0', id, 'Discount received on the purchased assets', 0.00, 3140.00 FROM accounts WHERE account_code = '40500';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '640f5c6a-11c4-4617-b70e-6802097dcd80', '55d21324-6d26-4592-b28b-c6e4e7159bb0', id, 'Paid for the purchase of furniture for HQ third floor
 and Discount received on the purchased assets', 0.00, 150000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-960
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9fe7ea15-0f64-4a13-8bc7-1632ae4b55fb', 'JE-001073', '2026-01-03', 'Paid for gas for heaters', 'JV-JV-960', 'journal_entry', 710.00, 710.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3b2dcc0d-98ae-42d9-b6db-8a5e8def12b6', '9fe7ea15-0f64-4a13-8bc7-1632ae4b55fb', id, 'Paid for gas for heaters', 470.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd248d0df-8fda-4b02-aafc-ca21cfc4536c', '9fe7ea15-0f64-4a13-8bc7-1632ae4b55fb', id, 'Paid for gas for heaters', 0.00, 470.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0b2a65a6-9976-4ee5-8b80-98f901bb0b5a', '9fe7ea15-0f64-4a13-8bc7-1632ae4b55fb', id, 'Paid for Mobile card of Mr. Hanifullah Momand', 200.00, 0.00 FROM accounts WHERE account_code = '60005';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '52709e42-2228-4dcb-8ba5-cb3d83b08306', '9fe7ea15-0f64-4a13-8bc7-1632ae4b55fb', id, 'Paid for taxi used by Gulzar Khan for purchasing log books', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b3fd0e7b-e428-45ba-8c8e-ed31466c8f86', '9fe7ea15-0f64-4a13-8bc7-1632ae4b55fb', id, 'Paid for taxi used by Gulzar Khan for purchasing log books and mobile card', 0.00, 240.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-961
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c950a1d4-00fa-44aa-a680-8ac38d07972b', 'JE-001074', '2026-01-04', 'Cash received from Azizi Bank Collection account Cheque # 02065406', 'JV-JV-961', 'journal_entry', 50000.00, 50000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c9716d0b-9efc-4770-8776-0493625c7027', 'c950a1d4-00fa-44aa-a680-8ac38d07972b', id, 'Cash received from Azizi Bank Collection account Cheque # 02065406', 50000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '30016233-4f95-4493-acc6-da45342c0ae4', 'c950a1d4-00fa-44aa-a680-8ac38d07972b', id, 'Cash received from Azizi Bank Collection account Cheque # 02065406', 0.00, 50000.00 FROM accounts WHERE account_code = '10206';

-- Entry: JV-962
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('16d48fb6-0e91-4386-a05c-3e20a192ebb5', 'JE-001075', '2026-01-04', 'Salary paid to Mufti Muhebullah Muhammadi', 'JV-JV-962', 'journal_entry', 6960.00, 6960.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '71fc740a-3643-4a81-8dde-f354653c44f4', '16d48fb6-0e91-4386-a05c-3e20a192ebb5', id, 'Salary paid to Mufti Muhebullah Muhammadi', 6960.00, 0.00 FROM accounts WHERE account_code = '20170';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '21e82fbb-d4b6-420c-adcc-43d9ed3dc2cc', '16d48fb6-0e91-4386-a05c-3e20a192ebb5', id, 'Salary paid to Mufti Muhebullah Muhammadi', 0.00, 6960.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-963
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d83ea815-6f6a-4890-8dbb-2062cdd17cf2', 'JE-001076', '2026-01-04', 'Paid for taxi used by Omid Ahmadzai to withdraw cash from bank', 'JV-JV-963', 'journal_entry', 200.00, 200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c2fd42f8-42ee-4c8b-8183-40677fc92d9d', 'd83ea815-6f6a-4890-8dbb-2062cdd17cf2', id, 'Paid for taxi used by Omid Ahmadzai to withdraw cash from bank', 200.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '13689c3d-f411-40f1-96d6-25ffb7aac78b', 'd83ea815-6f6a-4890-8dbb-2062cdd17cf2', id, 'Paid for taxi used by Omid Ahmadzai to withdraw cash from bank', 0.00, 200.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-964
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0bff8b78-055e-4024-85c9-9577e1d65f9e', 'JE-001077', '2026-01-04', 'Paid for PCR use fee', 'JV-JV-964', 'journal_entry', 5000.00, 5000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4e4142b9-af3f-4c68-87e3-e199b7368440', '0bff8b78-055e-4024-85c9-9577e1d65f9e', id, 'Paid for PCR use fee', 5000.00, 0.00 FROM accounts WHERE account_code = '70000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5c599475-5077-4c2d-8daa-79c919a6de96', '0bff8b78-055e-4024-85c9-9577e1d65f9e', id, 'Paid for PCR use fee', 0.00, 5000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-965
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('409b8f50-8e3d-4c56-beec-49d5e9528af5', 'JE-001078', '2026-01-04', 'Cash Received CR# 112 for daily office expenses', 'JV-JV-965', 'journal_entry', 56357.00, 56357.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '234d47e5-f06c-490b-89e3-8adbad2bf1b6', '409b8f50-8e3d-4c56-beec-49d5e9528af5', id, 'Cash Received CR# 112 for daily office expenses', 56357.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'abc96b00-022f-4c39-932f-5dd4b88005c7', '409b8f50-8e3d-4c56-beec-49d5e9528af5', id, 'Cash Received CR# 112 for daily office expenses', 0.00, 56357.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-966
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('783fc2f2-197d-429e-9314-b0954c97d5dd', 'JE-001079', '2026-01-04', 'Paid for guests meal', 'JV-JV-966', 'journal_entry', 10340.00, 10340.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c8c2deff-32be-4629-bd3c-2d3b93a76709', '783fc2f2-197d-429e-9314-b0954c97d5dd', id, 'Paid for guests meal', 6510.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5d921eaf-6520-49dd-82f3-4753cd91ce12', '783fc2f2-197d-429e-9314-b0954c97d5dd', id, 'Paid for the purchase of cleaning items', 1000.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '092c855b-8a31-48af-a9e7-13a7c2044e48', '783fc2f2-197d-429e-9314-b0954c97d5dd', id, 'Purchased some kitchen items', 2830.00, 0.00 FROM accounts WHERE account_code = '60503';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '672e23ee-91ed-41ce-a902-6913ca4a258d', '783fc2f2-197d-429e-9314-b0954c97d5dd', id, 'Purchased some kitchen items, cleaning times, meal', 0.00, 10340.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-967
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7cf16a4d-a090-4efd-9382-16dcc4185731', 'JE-001080', '2026-01-04', 'Expense made during market research for Islamic products', 'JV-JV-967', 'journal_entry', 13000.00, 13000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a99dcbfc-6379-4c98-b00a-c074a80af222', '7cf16a4d-a090-4efd-9382-16dcc4185731', id, 'Expense made during market research for Islamic products', 13000.00, 0.00 FROM accounts WHERE account_code = '61602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c37d36af-eac1-4568-862c-2ff661502127', '7cf16a4d-a090-4efd-9382-16dcc4185731', id, 'Expense made during market research for Islamic products', 0.00, 13000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-968
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('77700b03-93d9-45ca-8007-436da5c4851d', 'JE-001081', '2026-01-04', 'Travel expense of staff to Jalalabd', 'JV-JV-968', 'journal_entry', 2250.00, 2250.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '33a1890a-db06-46fe-86a1-dc614ee438d2', '77700b03-93d9-45ca-8007-436da5c4851d', id, 'Travel expense of staff to Jalalabd', 2250.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4a7abd56-0fa4-41c7-bfd6-e3eee8a6b6f0', '77700b03-93d9-45ca-8007-436da5c4851d', id, 'Travel expense of staff to Jalalabd', 0.00, 2250.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-969
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a46dd8c1-c611-4540-a63e-e1709262363d', 'JE-001082', '2026-01-04', 'Purchased some kitchen items', 'JV-JV-969', 'journal_entry', 25850.00, 25850.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '455c7550-93a5-4ae2-b1db-744f5a2faa81', 'a46dd8c1-c611-4540-a63e-e1709262363d', id, 'Purchased some kitchen items', 15630.00, 0.00 FROM accounts WHERE account_code = '60503';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '49e72317-540d-46f0-8a98-771d76935c8b', 'a46dd8c1-c611-4540-a63e-e1709262363d', id, 'Office monthly food expenses', 10220.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '194f73bd-fbb7-4b12-9ce4-0e695e6f3583', 'a46dd8c1-c611-4540-a63e-e1709262363d', id, 'Purchased some kitchen items', 0.00, 25850.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-970
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1ed5ec7c-3112-4414-815c-51f28e980f27', 'JE-001083', '2026-01-04', 'Paid for gas for the office heating', 'JV-JV-970', 'journal_entry', 1207.00, 1207.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2cc889cb-a7e0-42e8-8259-284a61cb4e03', '1ed5ec7c-3112-4414-815c-51f28e980f27', id, 'Paid for gas for the office heating', 1007.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9e61f98d-4e28-409f-9c5d-aef01d56e4f2', '1ed5ec7c-3112-4414-815c-51f28e980f27', id, 'Paid for taxi by staff for office work', 200.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'be8e3f1b-64be-4c99-8c24-e81caba7474c', '1ed5ec7c-3112-4414-815c-51f28e980f27', id, 'Paid for taxi by staff for office work and gas purchase', 0.00, 1207.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-971
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2e0a44ef-7eb8-4bad-be03-52b55f83a298', 'JE-001084', '2026-01-04', 'Paid for the repair of the power generator', 'JV-JV-971', 'journal_entry', 3710.00, 3710.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0976d506-1c09-4bb0-bd61-740adf5a4235', '2e0a44ef-7eb8-4bad-be03-52b55f83a298', id, 'Paid for the repair of the power generator', 3710.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7c9ccddf-f123-4eb5-b2e6-367dbcb0a5a8', '2e0a44ef-7eb8-4bad-be03-52b55f83a298', id, 'Paid for the repair of the power generator', 0.00, 3710.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-972
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0e70c165-89a7-477b-b739-1f0407c10322', 'JE-001085', '2026-01-04', 'Purchased 21 Kg liquid gas for the office heating.', 'JV-JV-972', 'journal_entry', 1260.00, 1260.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4c6c3290-aab4-40b9-ba3f-0ac35a281335', '0e70c165-89a7-477b-b739-1f0407c10322', id, 'Purchased 21 Kg liquid gas for the office heating.', 1260.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '76b8fa26-5457-4889-b3bd-f594d64d7890', '0e70c165-89a7-477b-b739-1f0407c10322', id, 'Purchased 21 Kg liquid gas for the office heating.', 0.00, 1260.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-973
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6be8e439-8c90-4589-87ba-8b19fd35c79f', 'JE-001086', '2026-01-04', 'Paid for taxi used by Liaqat for PCR Payment to DAB', 'JV-JV-973', 'journal_entry', 80.00, 80.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0dc792d0-3fa8-4d1b-a570-c86bd4f72813', '6be8e439-8c90-4589-87ba-8b19fd35c79f', id, 'Paid for taxi used by Liaqat for PCR Payment to DAB', 80.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '900a0c46-a1c2-4417-8269-4f2b9cb19342', '6be8e439-8c90-4589-87ba-8b19fd35c79f', id, 'Paid for taxi used by Liaqat for PCR Payment to DAB', 0.00, 80.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-974
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1578332f-ac99-4e70-bd21-8a4fc00341b3', 'JE-001087', '2026-01-04', 'Paid for purchase of food item for lunch', 'JV-JV-974', 'journal_entry', 940.00, 940.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1db9c55d-acd2-4ff3-953b-c2f4bf6a906c', '1578332f-ac99-4e70-bd21-8a4fc00341b3', id, 'Paid for purchase of food item for lunch', 940.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5580148c-069d-4f63-8fce-5be5f6ff3314', '1578332f-ac99-4e70-bd21-8a4fc00341b3', id, 'Paid for purchase of food item for lunch', 0.00, 940.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-975
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7259c71a-9ad7-40bb-9c94-6c26ed98e7d1', 'JE-001088', '2026-01-05', 'Paid for the purchase of credit for the digital phone', 'JV-JV-975', 'journal_entry', 8280.00, 8280.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'baa321e9-00bb-4534-85b8-33da99816587', '7259c71a-9ad7-40bb-9c94-6c26ed98e7d1', id, 'Paid for the purchase of credit for the digital phone', 500.00, 0.00 FROM accounts WHERE account_code = '60005';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ef4a01f8-2555-4e13-826a-3844672d557d', '7259c71a-9ad7-40bb-9c94-6c26ed98e7d1', id, 'Paid for the purchase of credit for the digital phone', 0.00, 500.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'db928eef-3a68-4f4f-a041-3ba0919fb16f', '7259c71a-9ad7-40bb-9c94-6c26ed98e7d1', id, 'Paid for meal of guests visiting the branch from HQ', 1800.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b36a5a6d-bf3c-423d-a268-09cf79e81fb1', '7259c71a-9ad7-40bb-9c94-6c26ed98e7d1', id, 'Paid for the office cleaning for 5 months', 1000.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1e63e7f0-d92e-49de-9602-e1d839dcbe1c', '7259c71a-9ad7-40bb-9c94-6c26ed98e7d1', id, 'Paid for refreshment of guest from Kabul', 480.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8142a473-352b-4897-94ce-8b17642db4c9', '7259c71a-9ad7-40bb-9c94-6c26ed98e7d1', id, 'Purchased one file cabinet for the Kunar office', 4500.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '14f905a4-7d34-4e82-9e60-8020d8d5ad65', '7259c71a-9ad7-40bb-9c94-6c26ed98e7d1', id, 'Paid for the office cleaning for 5 months and meal for guest from HQ, refreshment and purchase of file cabinet', 0.00, 7780.00 FROM accounts WHERE account_code = '20168';

-- Entry: JV-976
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b3293028-8e9a-4415-b384-e79e9f8b7bfa', 'JE-001089', '2026-01-05', 'Paid for taxi used for the purchase of credit card for the digital phone', 'JV-JV-976', 'journal_entry', 2480.00, 2480.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6dc5f45a-de75-48f4-a251-e78b2764fd35', 'b3293028-8e9a-4415-b384-e79e9f8b7bfa', id, 'Paid for taxi used for the purchase of credit card for the digital phone', 80.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c4c3405a-73ca-4e38-880d-9cc0be5030e3', 'b3293028-8e9a-4415-b384-e79e9f8b7bfa', id, 'Paid for taxi used for the purchase of credit card for the digital phone', 0.00, 80.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7c46d5b4-610b-46ba-b288-a7259e51c07f', 'b3293028-8e9a-4415-b384-e79e9f8b7bfa', id, 'Paid for meal for guest visiting the brach', 1200.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4eba25a1-bcf5-4180-b324-cb0489291bf1', 'b3293028-8e9a-4415-b384-e79e9f8b7bfa', id, 'Paid for food by Sadaqat while visiting clients during 12 days', 1200.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dcb721d1-427a-40a3-9e43-b4c9c06ff787', 'b3293028-8e9a-4415-b384-e79e9f8b7bfa', id, 'Paid for meal for guest visiting the branch and staff food expense visiting client', 0.00, 2400.00 FROM accounts WHERE account_code = '20168';

-- Entry: JV-977
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('584d86cf-e0b9-4291-a447-fc02b2d576bc', 'JE-001090', '2026-01-05', 'Paid for for bread cost for one month', 'JV-JV-977', 'journal_entry', 14570.00, 14570.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '093be93f-a4a9-444f-aa46-8d15f1abbd19', '584d86cf-e0b9-4291-a447-fc02b2d576bc', id, 'Paid for for bread cost for one month', 4380.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f89329db-bb60-4bd1-8472-fd0adc290652', '584d86cf-e0b9-4291-a447-fc02b2d576bc', id, 'Paid for for bread cost for one month', 0.00, 4380.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0b24718b-c02d-47ae-b64b-76d3540f88ad', '584d86cf-e0b9-4291-a447-fc02b2d576bc', id, 'Paid two months Kunar branch rent', 6000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd5c4e58a-1f13-4c47-a5b9-8bbd19751c1c', '584d86cf-e0b9-4291-a447-fc02b2d576bc', id, 'Purchased heater for the office', 2500.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '810b7b8e-d940-4391-bfe4-f929bd4641ec', '584d86cf-e0b9-4291-a447-fc02b2d576bc', id, 'Purchase gas Salander', 900.00, 0.00 FROM accounts WHERE account_code = '60505';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f70e01d9-de40-4656-a70a-eeb8cc76931b', '584d86cf-e0b9-4291-a447-fc02b2d576bc', id, 'Purchased tools for gas heater', 400.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fbe60f3a-e7b2-46a5-ae5b-a4e8034d2893', '584d86cf-e0b9-4291-a447-fc02b2d576bc', id, 'Paid for gas for the office warming', 390.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ddcd3062-0db2-4d2f-a2e4-3b88613abdfa', '584d86cf-e0b9-4291-a447-fc02b2d576bc', id, 'Paid for Kunar branch rent, Heater, gas and some tools', 0.00, 10190.00 FROM accounts WHERE account_code = '20168';

-- Entry: JV-978
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('11cb158c-614d-4b51-b188-d41648827ef9', 'JE-001091', '2026-01-05', 'Cash received CR #115 for the CEO Salary for the month of Dec 2025', 'JV-JV-978', 'journal_entry', 118142.00, 118142.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f9249c25-38c1-4f14-975a-d664d45cb450', '11cb158c-614d-4b51-b188-d41648827ef9', id, 'Cash received CR #115 for the CEO Salary for the month of Dec 2025', 118142.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '83a3444b-564c-4230-ab53-b4513a0eb3fb', '11cb158c-614d-4b51-b188-d41648827ef9', id, 'Cash received CR #115 for the CEO Salary for the month of Dec 2025', 0.00, 118142.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-979
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('68aff0aa-49fc-4aaf-a6e0-085efe626412', 'JE-001092', '2026-01-05', 'Salary paid to CEO for the month of Dec 2025', 'JV-JV-979', 'journal_entry', 118142.00, 118142.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ab8045b4-de7c-465d-8767-240ae863c57a', '68aff0aa-49fc-4aaf-a6e0-085efe626412', id, 'Salary paid to CEO for the month of Dec 2025', 118142.00, 0.00 FROM accounts WHERE account_code = '20169';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '41766712-b861-4b5a-ab8a-6ff4745594e0', '68aff0aa-49fc-4aaf-a6e0-085efe626412', id, 'Salary paid to CEO for the month of Dec 2025', 0.00, 118142.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-980
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('22063da7-17ec-408c-bbfa-5a1c12ab1122', 'JE-001093', '2026-01-06', 'Taxi used by Omid Ahmadzai for cheque withdrawal from Azizi Bank', 'JV-JV-980', 'journal_entry', 600.00, 600.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e05eadca-b01a-4cc9-b5db-dfcb2bd60503', '22063da7-17ec-408c-bbfa-5a1c12ab1122', id, 'Taxi used by Omid Ahmadzai for cheque withdrawal from Azizi Bank', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '254d4dda-b06e-458f-9a76-537c54852ef8', '22063da7-17ec-408c-bbfa-5a1c12ab1122', id, 'Taxi used by Omid Ahmadzai for cheque withdrawal from Azizi Bank', 0.00, 100.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '65df55f5-0b2e-4ef6-a48b-886329eca418', '22063da7-17ec-408c-bbfa-5a1c12ab1122', id, 'Paid for the fuel for the power generator', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c3e80e1a-c3a2-4a5f-85de-271f418aa7b9', '22063da7-17ec-408c-bbfa-5a1c12ab1122', id, 'Paid for the fuel for the power generator', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-981
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e3f545f5-d7a5-473f-ab25-95a9412b345d', 'JE-001094', '2026-01-06', 'Cash received CR# 116 for Jalalabad branch staff salary for the month of Dec 2025 and Food allowance', 'JV-JV-981', 'journal_entry', 31872.00, 31872.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd8b458b0-ba88-48a3-9297-6f4d5b98f567', 'e3f545f5-d7a5-473f-ab25-95a9412b345d', id, 'Cash received CR# 116 for Jalalabad branch staff salary for the month of Dec 2025 and Food allowance', 31872.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '011af4fe-5b96-4134-beb9-c22a3eb665d2', 'e3f545f5-d7a5-473f-ab25-95a9412b345d', id, 'Cash received CR# 116 for Jalalabad branch staff salary for the month of Dec 2025 and Food allowance', 0.00, 31872.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-982
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('09bd5e11-31d8-4679-9d45-63323a6a3115', 'JE-001095', '2026-01-06', 'Dec 2025 salary paid', 'JV-JV-982', 'journal_entry', 31872.00, 31872.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5589611a-3ec4-43b6-a49e-1a609759dd77', '09bd5e11-31d8-4679-9d45-63323a6a3115', id, 'Dec 2025 salary paid', 11860.00, 0.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3ca3ba1d-2391-41f8-a2a2-59b0accfab0e', '09bd5e11-31d8-4679-9d45-63323a6a3115', id, 'Dec 2025 salary paid', 10912.00, 0.00 FROM accounts WHERE account_code = '20182';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '96e2caac-d326-4621-a108-3fe40a97ca58', '09bd5e11-31d8-4679-9d45-63323a6a3115', id, 'Dec 2025 salary paid', 3000.00, 0.00 FROM accounts WHERE account_code = '20174';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ba40517f-6c66-41b4-aab6-92d38bdcea24', '09bd5e11-31d8-4679-9d45-63323a6a3115', id, 'Dec 2025 salary paid', 3000.00, 0.00 FROM accounts WHERE account_code = '20176';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5d006545-5564-4f6e-8ac5-5f3fc91c5368', '09bd5e11-31d8-4679-9d45-63323a6a3115', id, 'Dec 2025 Food allowance paid', 3000.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1d1108f5-65b1-465d-b6e1-bcfdd46ea07a', '09bd5e11-31d8-4679-9d45-63323a6a3115', id, 'Paid for hawala for cash transfer', 100.00, 0.00 FROM accounts WHERE account_code = '61807';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7b249200-561f-4490-8c8f-c66275a09c9d', '09bd5e11-31d8-4679-9d45-63323a6a3115', id, 'Salary and food allowance for the month of Dec 2025 paid', 0.00, 31872.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-983
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('dbef881b-861e-461f-8c9f-f4104075ff6f', 'JE-001096', '2026-01-06', 'Cash received CR# 117 for Kunar branch staff salary for the month of Dec 2025 and Food allowance', 'JV-JV-983', 'journal_entry', 15110.00, 15110.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9fbd64df-81fd-4034-a5fb-ce0161cc3be0', 'dbef881b-861e-461f-8c9f-f4104075ff6f', id, 'Cash received CR# 117 for Kunar branch staff salary for the month of Dec 2025 and Food allowance', 15110.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4cbc0e86-4c78-459e-8802-184a6b7dd886', 'dbef881b-861e-461f-8c9f-f4104075ff6f', id, 'Cash received CR# 117 for Kunar branch staff salary for the month of Dec 2025 and Food allowance', 0.00, 15110.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-984
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('dde534ee-975c-4557-905c-9521fd364e94', 'JE-001097', '2026-01-06', 'Salary for the month of Dec 2025 paid', 'JV-JV-984', 'journal_entry', 15110.00, 15110.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b782bb02-8b69-464a-94a9-32bca8f88fcd', 'dde534ee-975c-4557-905c-9521fd364e94', id, 'Salary for the month of Dec 2025 paid', 5980.00, 0.00 FROM accounts WHERE account_code = '20173';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '757ddead-837c-450e-a0a2-cbc5bd67bd27', 'dde534ee-975c-4557-905c-9521fd364e94', id, 'Salary for the month of Dec 2025 paid', 5980.00, 0.00 FROM accounts WHERE account_code = '20175';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1fd6819f-5456-42ba-8bb1-cfa5b7901fb3', 'dde534ee-975c-4557-905c-9521fd364e94', id, 'Food allowance for the month of Dec 2025 paid', 3000.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b4b158e9-bb33-4e78-b517-df7348e0d9d4', 'dde534ee-975c-4557-905c-9521fd364e94', id, 'Hawala cost paid for cash transfer', 150.00, 0.00 FROM accounts WHERE account_code = '61807';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5ca58b99-5f09-4e35-8318-b1dc7d1b345c', 'dde534ee-975c-4557-905c-9521fd364e94', id, 'Salary and food allowance for Dec 2025 paid and Hawala cost paid for cash transfer', 0.00, 15110.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-985
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6998980a-2404-451d-b294-f49fad407fe3', 'JE-001098', '2026-01-06', 'Paid for liquid gas for the office warming', 'JV-JV-985', 'journal_entry', 6760.00, 6760.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '642977e9-6122-43b2-9225-9a5356cf0225', '6998980a-2404-451d-b294-f49fad407fe3', id, 'Paid for liquid gas for the office warming', 1260.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd88bf90c-24b1-47b6-90aa-79430f74c3fb', '6998980a-2404-451d-b294-f49fad407fe3', id, 'Paid for liquid gas for the office warming', 0.00, 1260.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a27dc0dd-419d-4a87-9b6b-a8c5eada0852', '6998980a-2404-451d-b294-f49fad407fe3', id, 'Lunch expense paid to Noor Muhammad for traveling to Kunar', 5500.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4856588c-a309-4568-913a-60d042947dda', '6998980a-2404-451d-b294-f49fad407fe3', id, 'Lunch expense paid to Noor Muhammad for traveling to Kunar', 0.00, 5500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-986
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8cf06d7b-651e-4df5-8940-2624fe43f08a', 'JE-001099', '2026-01-06', 'Taxi used by Gulzar to purchase Collateral log book', 'JV-JV-986', 'journal_entry', 40.00, 40.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '71dc734d-9cc2-481f-9a72-8048178c3837', '8cf06d7b-651e-4df5-8940-2624fe43f08a', id, 'Taxi used by Gulzar to purchase Collateral log book', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ce08a27a-4f6c-4004-b5ee-54b5c4779f73', '8cf06d7b-651e-4df5-8940-2624fe43f08a', id, 'Taxi used by Gulzar to purchase Collateral log book', 0.00, 40.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-987
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('90a3ad27-5baf-4a06-b122-af7b0bc08996', 'JE-001100', '2026-01-06', 'Paid for the purchase of stationery for the HQ office', 'JV-JV-987', 'journal_entry', 340628.29, 340628.29, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cce6efe2-366b-44f8-a339-d1e0d279e1c5', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, 'Paid for the purchase of stationery for the HQ office', 2560.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7a426595-041b-4a1e-89c5-1121cd7a709c', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, 'Paid for the purchase of stationery for the HQ office', 0.00, 2560.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '782bac57-d3d0-4339-b88a-2594c1cf25c6', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 2460.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1ea5c99a-17df-4a9d-bad5-743f4397cb11', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 2460.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f6a5cade-a7fd-402c-a121-3daf9c363496', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 19350.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '85e483da-868a-42a0-8ce0-e983c4d5afa1', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 19350.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6848d160-1a35-4c3b-b3e5-0fb7b8375134', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 19350.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e5dee449-c7c6-420d-bf36-5410dc4a405d', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 19350.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a204a9c8-7eef-4f45-9545-7a138410b6dd', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 34800.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9927287e-edc5-4525-b132-dcc87182588d', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 34800.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7c7f942f-30d6-40e3-aea1-941b7013b623', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 8700.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd8b5b906-a978-45ca-ac3a-291133ecb96b', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 8700.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e6b83f52-5fc7-4c56-92f4-0114ee32a7ec', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 8300.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '508a261d-77b6-4250-8110-812417bf276b', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 8300.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '51a2a492-4126-48fd-864f-f99ce2e8b3a0', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 4470.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b442bb58-a052-4024-9a3f-6bffe7c84117', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 4470.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '25e5ca68-2bdd-40e9-94f3-c1756fcc3b2c', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 8040.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ac430fdc-66ea-4a16-91ad-3ced758ae606', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 8040.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aa1c5a76-2483-488b-a941-cdc6a71ae88a', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 21750.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a0cc8f5e-f9d8-4590-925e-7fa3325cddf0', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 21750.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '63f67944-a13d-415f-b8cb-d88c2ec1abcd', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 19333.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a9231e99-658d-4aad-ba7a-5a125744cab6', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 19333.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b95c9f60-27a9-4037-9651-1f7b654926c1', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 10750.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5bf0990d-f5d9-4910-8930-064136c00875', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 10750.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4484ac8c-66ec-4e5d-803a-69b3c481d4fc', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 18125.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '89de72c4-7802-4bd8-be65-81648a885d0e', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 18125.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '15ac07f7-af44-4388-b234-002c0a072845', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 27070.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7c79ce3c-9e4f-4619-9788-223797e51611', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 27070.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3e340a95-354c-4c86-a21a-cbe5d1b02e6e', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 19670.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '92436ffd-1c9b-496e-aca3-46a9932ff9c0', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 19670.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '51a6e2a6-f74d-40ce-86cd-0ac02c294fd2', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 31910.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'afbca800-0ee3-4b7a-b3ee-86b48a5d24fa', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 31910.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8e569b26-c526-484e-8f21-7923da6e5b96', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 3866.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '99af7ab4-2e07-4c80-a900-a7f6edab449b', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 3866.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd390c41d-b236-4fe4-bafc-20aedef6fee0', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 9280.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e7c9f36d-9c3b-46a1-9510-82fcbfd5e644', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 9280.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e0e224f9-9cf0-47af-9cb6-7e02d8b2c42e', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 6766.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1b1ec65b-0613-4713-8920-5a1ce3e49d59', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 6766.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dab27a1d-e694-4d76-8ea5-e744f84b1308', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 8285.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '31011083-47e5-4adc-a88e-86c2b1727024', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 8285.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '19435628-9778-47e0-84a1-97938e03cf31', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 7733.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8a30328e-5077-4fd7-b6d6-ef0646f2ccdf', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 7733.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '37ae6c91-4431-4316-8fd0-06e5b914050c', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 5800.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b8fd8b4f-585f-4315-9c11-59da07176c92', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 5800.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c245a65c-7d9c-4fdd-8d00-f6fe5873d41e', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 4833.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bc940c9c-4e94-40c5-a35b-43a8a29ec8ff', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 4833.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '75088976-71bb-4779-8bea-947d3dbd9c60', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 37427.29, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '642f700e-e8ff-4dca-9e99-25fad84fee02', '90a3ad27-5baf-4a06-b122-af7b0bc08996', id, '', 0.00, 37427.29 FROM accounts WHERE account_code = '11000';

-- Entry: JV-988
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('92962512-ba2f-4922-9a14-3b89ab97e35b', 'JE-001101', '2026-01-07', 'Paid for the day lunch expenses', 'JV-JV-988', 'journal_entry', 450.00, 450.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5597d9b6-6021-4103-93fe-dddee62427fa', '92962512-ba2f-4922-9a14-3b89ab97e35b', id, 'Paid for the day lunch expenses', 450.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '98bf4877-f9e9-4fed-a939-bd5a3ad1cec7', '92962512-ba2f-4922-9a14-3b89ab97e35b', id, 'Paid for the day lunch expenses', 0.00, 450.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-989
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('751bad5a-53cf-426b-8d9e-4d149613aea6', 'JE-001102', '2026-01-07', 'Paid for taxi used by Gulzar to bring letters from DAB', 'JV-JV-989', 'journal_entry', 6040.00, 6040.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a2288cfe-b409-4a1d-8bd5-ed5e7b88a67a', '751bad5a-53cf-426b-8d9e-4d149613aea6', id, 'Paid for taxi used by Gulzar to bring letters from DAB', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1cd33784-3c4e-4cf2-83c9-269c0142cf7a', '751bad5a-53cf-426b-8d9e-4d149613aea6', id, 'Paid for taxi used by Gulzar to bring letters from DAB', 0.00, 40.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a21f2140-8242-44ad-a4d4-7dc8c0ad11c8', '751bad5a-53cf-426b-8d9e-4d149613aea6', id, 'Paid to Hanifullah Momand and Omid Habibi for one day per diem to Kunar and Nangarhar.', 2000.00, 0.00 FROM accounts WHERE account_code = '60002';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bdbb6275-b830-46f0-8e5d-a87a0c8b9c8d', '751bad5a-53cf-426b-8d9e-4d149613aea6', id, 'Paid to Hanifullah Momand and Omid Habibi for one day food expense 500 AFN each to Kunar and Nangarhar.', 1000.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '25201133-73b2-48d7-9500-16747f3db2d0', '751bad5a-53cf-426b-8d9e-4d149613aea6', id, 'Paid to Hanifullah Momand and Omid Habibi for taxi used to Kunar and Nangarhar.', 3000.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '149e3793-c856-4d52-9b2b-0c64ccfa15d5', '751bad5a-53cf-426b-8d9e-4d149613aea6', id, 'Paid to Hanifullah Momand and Omid Habibi for taxi used to Kunar and Nangarhar, food and per diem for one day.', 0.00, 6000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-990
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d4b6833f-ef6d-47fc-85b4-d08a89e2fbae', 'JE-001103', '2026-01-07', 'Paid for internet fee for the month of Dec 2025', 'JV-JV-990', 'journal_entry', 6000.00, 6000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '49380bfb-9010-4c5a-a03e-6c31bf566ac4', 'd4b6833f-ef6d-47fc-85b4-d08a89e2fbae', id, 'Paid for internet fee for the month of Dec 2025', 6000.00, 0.00 FROM accounts WHERE account_code = '61202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4230479c-b5fb-4b89-989b-18900ab8cdfa', 'd4b6833f-ef6d-47fc-85b4-d08a89e2fbae', id, 'Paid for internet fee for the month of Dec 2025', 0.00, 6000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-991
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b5e0ea79-a1e9-4033-b7c3-4ad34dab1a9e', 'JE-001104', '2026-01-07', 'Cash transferred from Jalalabad to Kabul', 'JV-JV-991', 'journal_entry', 2565653.00, 2565653.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ef098d21-f5ae-4530-b607-291895702f60', 'b5e0ea79-a1e9-4033-b7c3-4ad34dab1a9e', id, 'Cash transferred from Jalalabad to Kabul', 925753.00, 0.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8e88abd0-01df-4e5c-b464-d162cd5c8311', 'b5e0ea79-a1e9-4033-b7c3-4ad34dab1a9e', id, 'Cash transferred from Jalalabad to Kabul', 0.00, 925753.00 FROM accounts WHERE account_code = '10103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a2f5c9d2-c22b-46e8-aec3-cee0e2693ca9', 'b5e0ea79-a1e9-4033-b7c3-4ad34dab1a9e', id, 'Cash transferred from Kunar to Kabul', 369900.00, 0.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd0eeb46b-c4dd-467b-b73e-40347bda782c', 'b5e0ea79-a1e9-4033-b7c3-4ad34dab1a9e', id, 'Cash transferred from Kunar to Kabul', 0.00, 369900.00 FROM accounts WHERE account_code = '10104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f9023640-7d93-4e2e-969e-8f9eef2f3c3a', 'b5e0ea79-a1e9-4033-b7c3-4ad34dab1a9e', id, 'Purchased inventory for Sirajudin Almas on Murabaha', 100000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2b05c2e4-4aad-45c7-ae13-3891b23714f7', 'b5e0ea79-a1e9-4033-b7c3-4ad34dab1a9e', id, 'Purchased inventory for Hijratullah Adil on Murabaha', 100000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9cf72c9d-9ffb-48f0-bdc2-22417d5d42bd', 'b5e0ea79-a1e9-4033-b7c3-4ad34dab1a9e', id, 'Purchased inventory for Muhebullah Haqyar on Murabaha', 70000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f688c07a-40be-4fd3-887d-2bafe363ef29', 'b5e0ea79-a1e9-4033-b7c3-4ad34dab1a9e', id, 'Purchased inventory for Muhebullah Safi on Murabaha', 1000000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7aafbc64-e640-44fc-82f5-9f4a1f03452b', 'b5e0ea79-a1e9-4033-b7c3-4ad34dab1a9e', id, 'Purchased inventory for four customers on Murabaha', 0.00, 1270000.00 FROM accounts WHERE account_code = '10104';

-- Entry: JV-992
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8dc889f7-b342-465f-946d-9c8a34196379', 'JE-001105', '2026-01-07', 'Purchased inventory in Murabaha for Mr. Hizbullah Niyazai', 'JV-JV-992', 'journal_entry', 510000.00, 510000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ea6862d0-8f67-4f45-b019-31b55fed8fd0', '8dc889f7-b342-465f-946d-9c8a34196379', id, 'Purchased inventory in Murabaha for Mr. Hizbullah Niyazai', 350000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '997fe7c8-29f3-41ef-a6ee-513a6245013f', '8dc889f7-b342-465f-946d-9c8a34196379', id, 'Purchased inventory in Murabaha for Mr. Fayaz Momand', 90000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0472fc80-eac7-4b8d-a55f-b6b783faf77f', '8dc889f7-b342-465f-946d-9c8a34196379', id, 'Purchased inventory in Murabaha for Mr. Muhebullah Salihi', 70000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '29bdcf2b-cd87-454a-9efe-a70c82117a2c', '8dc889f7-b342-465f-946d-9c8a34196379', id, 'Purchased inventory in Murabaha for three clients', 0.00, 510000.00 FROM accounts WHERE account_code = '10103';

-- Entry: LCI108
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('144a9e48-2ac8-45d9-825c-3b19bb7c3bac', 'JE-001106', '2026-01-07', 'Imported entry', 'JV-LCI108', 'financing_disbursement', 120000.00, 120000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5dde57db-4146-469f-acce-43531fb6a720', '144a9e48-2ac8-45d9-825c-3b19bb7c3bac', id, '', 120000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '881791f9-e6af-40dc-8d68-4d08759e10ec', '144a9e48-2ac8-45d9-825c-3b19bb7c3bac', id, 'Purchased asset for customer on loan', 0.00, 100000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2f38527c-3b7a-4f44-9b55-c908764094b5', '144a9e48-2ac8-45d9-825c-3b19bb7c3bac', id, 'Cost occurred on purchased product on loan for customers', 0.00, 20000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI109
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d1a420b6-1d6e-4e88-b25a-e5f5caf268d6', 'JE-001107', '2026-01-07', 'Imported entry', 'JV-LCI109', 'financing_disbursement', 120000.00, 120000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bbf7e7ba-272f-462a-862f-1d169967e742', 'd1a420b6-1d6e-4e88-b25a-e5f5caf268d6', id, '', 120000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '311d8c94-771c-4806-9de0-982e9cd9979b', 'd1a420b6-1d6e-4e88-b25a-e5f5caf268d6', id, 'Purchased asset for customer on loan', 0.00, 100000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '740040e4-93df-4b64-b884-c780e96dfe99', 'd1a420b6-1d6e-4e88-b25a-e5f5caf268d6', id, 'Cost occurred on purchased product on loan for customers', 0.00, 20000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI110
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('09787899-0509-4d3f-859e-fc3dd03e4ab1', 'JE-001108', '2026-01-07', 'Imported entry', 'JV-LCI110', 'financing_disbursement', 84000.00, 84000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e72b940c-db75-4d68-9d08-895a94255a4d', '09787899-0509-4d3f-859e-fc3dd03e4ab1', id, '', 84000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4af2496a-b371-4673-b972-67a85db641af', '09787899-0509-4d3f-859e-fc3dd03e4ab1', id, 'Purchased asset for customer on loan', 0.00, 70000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd7785233-0f0c-4938-b079-acd767e8ff4a', '09787899-0509-4d3f-859e-fc3dd03e4ab1', id, 'Cost occurred on purchased product on loan for customers', 0.00, 14000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI111
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('245b43f6-db9c-4068-a6f7-2d173d54a781', 'JE-001109', '2026-01-07', 'Imported entry', 'JV-LCI111', 'financing_disbursement', 1240000.00, 1240000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '053a74c9-0984-45a2-b2a4-3625e481bd5d', '245b43f6-db9c-4068-a6f7-2d173d54a781', id, '', 1240000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1cb69137-a967-4f0c-aab4-d2e797bb536b', '245b43f6-db9c-4068-a6f7-2d173d54a781', id, 'Purchased asset for customer on loan', 0.00, 1000000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '44931007-a96f-4d6d-a497-2f23d47b8a5f', '245b43f6-db9c-4068-a6f7-2d173d54a781', id, 'Cost occurred on purchased product on loan for customers', 0.00, 240000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI112
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1a02cd33-0c38-49a2-bfba-389b1f8252cb', 'JE-001110', '2026-01-07', 'Imported entry', 'JV-LCI112', 'financing_disbursement', 443333.00, 443333.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f412e3e1-134c-46af-918e-d8cd9f23ea98', '1a02cd33-0c38-49a2-bfba-389b1f8252cb', id, '', 443333.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '353e1d6b-77ea-4463-abaf-8bd3e3a23b73', '1a02cd33-0c38-49a2-bfba-389b1f8252cb', id, 'Purchased asset for customer on loan', 0.00, 350000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9c4ba204-087b-4d87-bbe9-8a0d31bb9e09', '1a02cd33-0c38-49a2-bfba-389b1f8252cb', id, 'Cost occurred on purchased product on loan for customers', 0.00, 93333.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI113
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fe7f7642-cc1e-44d5-ad7e-a9dbd615f8ef', 'JE-001111', '2026-01-07', 'Imported entry', 'JV-LCI113', 'financing_disbursement', 111600.00, 111600.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ad2bd0f5-c9a0-4608-8b28-cf374ad54f4e', 'fe7f7642-cc1e-44d5-ad7e-a9dbd615f8ef', id, '', 111600.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd40bf600-ea0c-488d-96b4-9267e0e8e2e1', 'fe7f7642-cc1e-44d5-ad7e-a9dbd615f8ef', id, 'Purchased asset for customer on loan', 0.00, 90000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2d2e3d5f-ed47-4b3a-ac02-f88feb6ded34', 'fe7f7642-cc1e-44d5-ad7e-a9dbd615f8ef', id, 'Cost occurred on purchased product on loan for customers', 0.00, 21600.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI114
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9c8f81fb-0f6e-44e0-bbb7-b05a897e8654', 'JE-001112', '2026-01-07', 'Imported entry', 'JV-LCI114', 'financing_disbursement', 253220.08, 253220.08, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '571fb5b2-e3db-4fd0-9cb4-fbfceb75f732', '9c8f81fb-0f6e-44e0-bbb7-b05a897e8654', id, '', 84933.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'da2232d7-b2af-4ace-9120-55536bcbe4a4', '9c8f81fb-0f6e-44e0-bbb7-b05a897e8654', id, 'Purchased asset for customer on loan', 0.00, 70000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'be06de19-16b5-4342-a0f3-04e5c089b30c', '9c8f81fb-0f6e-44e0-bbb7-b05a897e8654', id, 'Cost occurred on purchased product on loan for customers', 0.00, 14933.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6c0e938a-1009-4f20-90ff-1422e4dfc8c7', '9c8f81fb-0f6e-44e0-bbb7-b05a897e8654', id, '', 37427.29, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a60c4985-5caa-4c84-af8b-4a3e00ea9b1c', '9c8f81fb-0f6e-44e0-bbb7-b05a897e8654', id, '', 0.00, 37427.29 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bb6b0d83-b79b-40e4-966d-8678cd03c985', '9c8f81fb-0f6e-44e0-bbb7-b05a897e8654', id, '', 39617.65, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c043b4ff-3b1a-48e3-9f0e-f24ecc1fbac9', '9c8f81fb-0f6e-44e0-bbb7-b05a897e8654', id, '', 0.00, 39617.65 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a49e9348-34f3-4558-ba33-1bc5bd4ee30c', '9c8f81fb-0f6e-44e0-bbb7-b05a897e8654', id, '', 37427.30, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '06d96a10-cb82-41f2-a0be-e7b5fe99c42a', '9c8f81fb-0f6e-44e0-bbb7-b05a897e8654', id, '', 0.00, 37427.30 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e455821-6e01-4abe-a3cb-a067bb0965e2', '9c8f81fb-0f6e-44e0-bbb7-b05a897e8654', id, '', 53814.84, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7f11a56d-35fa-4014-8c53-cd689f0dafa7', '9c8f81fb-0f6e-44e0-bbb7-b05a897e8654', id, '', 0.00, 53814.84 FROM accounts WHERE account_code = '11000';

-- Entry: JV-993
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1a6e14ad-65f1-4d57-b51e-ad7b02310a85', 'JE-001113', '2026-01-08', 'Cash Received CR# 118 for Advance payment to Sahil Salarzai for branch expenses but cash it handled by Ihsanullah Shinwari the Branch Manager', 'JV-JV-993', 'journal_entry', 10100.00, 10100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7cce1556-7259-4a95-8fb4-5e00b0c7d6f5', '1a6e14ad-65f1-4d57-b51e-ad7b02310a85', id, 'Cash Received CR# 118 for Advance payment to Sahil Salarzai for branch expenses but cash it handled by Ihsanullah Shinwari the Branch Manager', 10100.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '61662b52-aa4f-45fc-9b7f-19f7dfeb9562', '1a6e14ad-65f1-4d57-b51e-ad7b02310a85', id, 'Cash Received CR# 118 for Advance payment to Sahil Salarzai for branch expenses but cash it handled by Ihsanullah Shinwari the Branch Manager', 0.00, 10100.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-994
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('76a91ea0-50b4-4ead-b841-a631467571d8', 'JE-001114', '2026-01-08', 'Advance payment to Sahil Salarzai for branch expenses but cash it handled by Ihsanullah Shinwari the Branch Manager', 'JV-JV-994', 'journal_entry', 10100.00, 10100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '83c5db67-48b5-4d1f-8318-b6420b82b096', '76a91ea0-50b4-4ead-b841-a631467571d8', id, 'Advance payment to Sahil Salarzai for branch expenses but cash it handled by Ihsanullah Shinwari the Branch Manager', 10000.00, 0.00 FROM accounts WHERE account_code = '10103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '42e95ebb-aa44-488d-b6cb-ab445e44e016', '76a91ea0-50b4-4ead-b841-a631467571d8', id, 'Paid for hawala cost for cash transfer', 100.00, 0.00 FROM accounts WHERE account_code = '61807';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd321cb25-93c5-4a13-ad29-32fd63a7e1a4', '76a91ea0-50b4-4ead-b841-a631467571d8', id, 'Advance payment to Sahil Salarzai for branch expenses but cash it handled by Ihsanullah Shinwari the Branch Manager and it hawala cost', 0.00, 10100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-995
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5bb690fe-e286-4f68-afe3-7d0074c8ec38', 'JE-001115', '2026-01-08', 'Cash Received CR# 119 for Advance payment to Sadaqat for branch expenses but cash it handled by Noor Muhammad Sawji Zone Coordinator', 'JV-JV-995', 'journal_entry', 10100.00, 10100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3aa1653b-32cf-46e4-8123-50c3740e1a92', '5bb690fe-e286-4f68-afe3-7d0074c8ec38', id, 'Cash Received CR# 119 for Advance payment to Sadaqat for branch expenses but cash it handled by Noor Muhammad Sawji Zone Coordinator', 10100.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9cabc675-bd8b-410d-9e6f-31d278de0085', '5bb690fe-e286-4f68-afe3-7d0074c8ec38', id, 'Cash Received CR# 119 for Advance payment to Sadaqat for branch expenses but cash it handled by Noor Muhammad Sawji Zone Coordinator', 0.00, 10100.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-996
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('77b30e7b-666f-42d5-8d9f-414c8dd9ca32', 'JE-001116', '2026-01-08', 'Advance payment to Sadaqat for branch expenses but cash it handled by Noor Muhammad Sawji Zone Coordinator', 'JV-JV-996', 'journal_entry', 13100.00, 13100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e135a717-d5c4-4950-b04a-456175fb1a19', '77b30e7b-666f-42d5-8d9f-414c8dd9ca32', id, 'Advance payment to Sadaqat for branch expenses but cash it handled by Noor Muhammad Sawji Zone Coordinator', 10000.00, 0.00 FROM accounts WHERE account_code = '10104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ff8a74d0-b434-4bbd-b54a-279b17bb946c', '77b30e7b-666f-42d5-8d9f-414c8dd9ca32', id, 'Paid for hawala cost for cash transfer', 200.00, 0.00 FROM accounts WHERE account_code = '61807';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ac25b2ff-88e9-450c-95be-ba2979d530f6', '77b30e7b-666f-42d5-8d9f-414c8dd9ca32', id, 'Advance payment to Sadaqat for branch expenses but cash it handled by Noor Muhammad Sawji Zone Coordinator and its hawala cost', 0.00, 10200.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7e587484-fa37-425d-b84a-0d27ec4cd2ce', '77b30e7b-666f-42d5-8d9f-414c8dd9ca32', id, '', 2900.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '49770b89-02b2-4fb8-852a-400f2a760f21', '77b30e7b-666f-42d5-8d9f-414c8dd9ca32', id, '', 0.00, 2900.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-997
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3a7611fa-1827-40fb-a677-fc2fe4238e9d', 'JE-001117', '2026-01-09', 'Paid for Gas used for the office heating', 'JV-JV-997', 'journal_entry', 1900.00, 1900.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0fba2412-5255-4ba8-8c74-4d40ec27ad27', '3a7611fa-1827-40fb-a677-fc2fe4238e9d', id, 'Paid for Gas used for the office heating', 1720.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f2f22b23-aed5-4162-9e81-f877c7bd2360', '3a7611fa-1827-40fb-a677-fc2fe4238e9d', id, 'Paid for Gas used for the office heating', 0.00, 1720.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c7b64569-9db9-49ce-84cb-11d83b81e799', '3a7611fa-1827-40fb-a677-fc2fe4238e9d', id, 'Paid for the office staff lunch', 180.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f996682d-31e5-42e4-895d-e516c89aa7ed', '3a7611fa-1827-40fb-a677-fc2fe4238e9d', id, 'Paid for the office staff lunch', 0.00, 180.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-998
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c327fa99-001c-4f81-891e-6a0b81a9192b', 'JE-001118', '2026-01-10', 'Paid for the repair of kitchen, and toilets water system', 'JV-JV-998', 'journal_entry', 3300.00, 3300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e8bd4a97-34fa-4ae6-a29f-d917a8907141', 'c327fa99-001c-4f81-891e-6a0b81a9192b', id, 'Paid for the repair of kitchen, and toilets water system', 700.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eebf81b9-ee15-4a10-9d8d-618b101a6ce1', 'c327fa99-001c-4f81-891e-6a0b81a9192b', id, 'Paid for the repair of kitchen, and toilets water system', 0.00, 700.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '244f4c40-f431-48ca-844a-5c8658c0ebfb', 'c327fa99-001c-4f81-891e-6a0b81a9192b', id, 'Taxi used by Hidayatullah between Kunar and Nangarhar for the office work paid by Noor Muhammad', 2100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '86bcc295-7a0f-424d-9b62-48b559a38f07', 'c327fa99-001c-4f81-891e-6a0b81a9192b', id, 'Taxi used by Hidayatullah between Kunar and Nangarhar for the office work', 0.00, 2100.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0b507ae4-a79e-4221-b753-10b3f0c13910', 'c327fa99-001c-4f81-891e-6a0b81a9192b', id, 'Paid for the HQ staff lunch', 500.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '436aed9d-6636-47be-9b7d-5668b83e0b34', 'c327fa99-001c-4f81-891e-6a0b81a9192b', id, 'Paid for the HQ staff lunch', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-999
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a0581692-8d4b-4daa-8cf3-d7627bc83b47', 'JE-001119', '2026-01-11', 'Paid for monthly dry food for the month of Jan 2025', 'JV-JV-999', 'journal_entry', 6220.00, 6220.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4c1db406-be17-4f05-a227-fc642b8cbb1b', 'a0581692-8d4b-4daa-8cf3-d7627bc83b47', id, 'Paid for monthly dry food for the month of Jan 2025', 6220.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '34a74bf2-5373-4167-b78e-514a349b35a3', 'a0581692-8d4b-4daa-8cf3-d7627bc83b47', id, 'Paid for monthly dry food for the month of Jan 2025', 0.00, 6220.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1000
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bb39c1df-b623-482a-a5b1-d0e4e7dd0d2f', 'JE-001120', '2026-01-11', 'Cash Received CR# 120 for the payment of BOS fee for 2 quarter''s of three members', 'JV-JV-1000', 'journal_entry', 307960.00, 307960.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '64574733-a650-4dc2-928e-71718667cc71', 'bb39c1df-b623-482a-a5b1-d0e4e7dd0d2f', id, 'Cash Received CR# 120 for the payment of BOS fee for 2 quarter''s of three members', 150000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cc171666-9439-4a6a-b00b-7d9678f32e14', 'bb39c1df-b623-482a-a5b1-d0e4e7dd0d2f', id, 'Cash Received CR# 120 for the payment of BOS fee for 2 quarter''s of three members', 0.00, 150000.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c603784-8f2b-496d-bcd8-96e9efb1a5fd', 'bb39c1df-b623-482a-a5b1-d0e4e7dd0d2f', id, 'BOS fee paid for two quarters', 50000.00, 0.00 FROM accounts WHERE account_code = '20163';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5a47c184-2418-4a67-bdd3-7846a0f9ed72', 'bb39c1df-b623-482a-a5b1-d0e4e7dd0d2f', id, 'BOS fee paid for two quarters', 50000.00, 0.00 FROM accounts WHERE account_code = '20162';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6c44961e-19cc-4e1c-9f11-1e1091db964c', 'bb39c1df-b623-482a-a5b1-d0e4e7dd0d2f', id, 'BOS fee paid for two quarters', 50000.00, 0.00 FROM accounts WHERE account_code = '20164';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '40dbc49b-10c9-40f2-b019-023522264cd5', 'bb39c1df-b623-482a-a5b1-d0e4e7dd0d2f', id, 'BOS fee paid for two quarters', 0.00, 150000.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5fa5f39f-d20b-4e7b-9a50-ab1fe6cf09b9', 'bb39c1df-b623-482a-a5b1-d0e4e7dd0d2f', id, '', 3260.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '829fd195-671f-4f4e-86e4-cdf1be2106f1', 'bb39c1df-b623-482a-a5b1-d0e4e7dd0d2f', id, '', 0.00, 3260.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '82c72807-3792-49fe-a0d2-30ce1b2d4567', 'bb39c1df-b623-482a-a5b1-d0e4e7dd0d2f', id, '', 1650.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'df768e30-03db-4153-b93d-ce1239ed6910', 'bb39c1df-b623-482a-a5b1-d0e4e7dd0d2f', id, '', 0.00, 1650.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '231763ae-9403-4873-92a1-096213914729', 'bb39c1df-b623-482a-a5b1-d0e4e7dd0d2f', id, '', 3050.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '599250e7-143f-46a6-a54f-bb38d86fdf60', 'bb39c1df-b623-482a-a5b1-d0e4e7dd0d2f', id, '', 0.00, 3050.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-1001
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('67334982-082d-4832-8c3a-b578ca11e425', 'JE-001121', '2026-01-12', 'Paid for gas for the office heating', 'JV-JV-1001', 'journal_entry', 9390.00, 9390.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6e97df35-7728-4cf1-b014-11dc446f4cf7', '67334982-082d-4832-8c3a-b578ca11e425', id, 'Paid for gas for the office heating', 1010.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '934ced56-74b8-4cd8-b90a-52e50b187f6e', '67334982-082d-4832-8c3a-b578ca11e425', id, 'Paid for gas for the office heating', 0.00, 1010.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '31e2cc4e-34b1-488e-a1b0-40c3301acd49', '67334982-082d-4832-8c3a-b578ca11e425', id, 'Paid for eggs for HQ staff lunch', 270.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5770442d-3a39-455f-a788-67eb4f6feeed', '67334982-082d-4832-8c3a-b578ca11e425', id, 'Paid for eggs for HQ staff lunch', 0.00, 270.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ca137e70-6907-4504-847a-f766105a8b6d', '67334982-082d-4832-8c3a-b578ca11e425', id, '', 8110.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd6f1cd50-a4be-4505-9c70-74da9f31b995', '67334982-082d-4832-8c3a-b578ca11e425', id, '', 0.00, 8110.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-1002
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9e64e916-70ad-4418-9a69-108aadd9b840', 'JE-001122', '2026-01-13', 'Taxi used by Noor Muhammad for HQ office for advances clearance', 'JV-JV-1002', 'journal_entry', 1602.00, 1602.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '138f1bd8-21db-4357-8fb9-9f7e950f65ba', '9e64e916-70ad-4418-9a69-108aadd9b840', id, 'Taxi used by Noor Muhammad for HQ office for advances clearance', 1400.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8568b416-26c7-4e91-ae50-e60b3e36a348', '9e64e916-70ad-4418-9a69-108aadd9b840', id, 'Cash received back from Noor Muhammad for his payment for short expenses', 52.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fa5be3ea-a807-4e8a-aa83-d4ebb21a38ba', '9e64e916-70ad-4418-9a69-108aadd9b840', id, 'Adjusted hawala fee paid in JV 785 was counted as advance to Noor Muhammad Mistakenly', 150.00, 0.00 FROM accounts WHERE account_code = '61807';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a94bef6e-7932-472d-a118-8ab9ea122c0c', '9e64e916-70ad-4418-9a69-108aadd9b840', id, 'Cash deducted from his payment for short expenses', 0.00, 1602.00 FROM accounts WHERE account_code = '20168';

-- Entry: JV-1003
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f2d1e379-dbf6-48a9-a0a7-30eddb63b360', 'JE-001123', '2026-01-13', 'Lunch expense paid to Noor Muhammad Sawji for traveling to Kunar', 'JV-JV-1003', 'journal_entry', 4200.00, 4200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '46a07818-3235-484a-9326-19307fd77a18', 'f2d1e379-dbf6-48a9-a0a7-30eddb63b360', id, 'Lunch expense paid to Noor Muhammad Sawji for traveling to Kunar', 4200.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1cf2468c-c783-4b8d-95fe-5ba394de84c9', 'f2d1e379-dbf6-48a9-a0a7-30eddb63b360', id, 'Lunch expense paid to Noor Muhammad Sawji for traveling to Kunar', 0.00, 4200.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1004
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('30110137-5ec7-4522-b741-b9ce46d96c06', 'JE-001124', '2026-01-13', 'Paid to Sadaqat for taxi used to Kunar districts to visit clients', 'JV-JV-1004', 'journal_entry', 2100.00, 2100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '89b4db2c-9357-47a2-a391-c9a2a46ca7e6', '30110137-5ec7-4522-b741-b9ce46d96c06', id, 'Paid to Sadaqat for taxi used to Kunar districts to visit clients', 2100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fce92eb9-3462-4fa6-8df9-38d03c4d047a', '30110137-5ec7-4522-b741-b9ce46d96c06', id, 'Paid to Sadaqat for taxi used to Kunar districts to visit clients', 0.00, 2100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1005
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('dba1be0e-491b-4eb8-a05c-bd4f0046362f', 'JE-001125', '2026-01-13', 'Taxi used by Noor Muhammad between Kunar and Nangarhar', 'JV-JV-1005', 'journal_entry', 2800.00, 2800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '71075a0c-2840-4089-8d4c-5c825501d7f8', 'dba1be0e-491b-4eb8-a05c-bd4f0046362f', id, 'Taxi used by Noor Muhammad between Kunar and Nangarhar', 2800.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f40099d3-235f-4dfd-8419-826a1037bbe4', 'dba1be0e-491b-4eb8-a05c-bd4f0046362f', id, 'Taxi used by Noor Muhammad between Kunar and Nangarhar', 0.00, 2800.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1007
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c0100940-0b20-430c-9812-3b2d017e7e49', 'JE-001126', '2026-01-13', 'Paid for gas for office heating', 'JV-JV-1007', 'journal_entry', 1240.00, 1240.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'df42bf31-0da3-4ee6-91bb-82f06c521fb8', 'c0100940-0b20-430c-9812-3b2d017e7e49', id, 'Paid for gas for office heating', 1240.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c366e480-4a2e-4eb0-a750-97891d3d5068', 'c0100940-0b20-430c-9812-3b2d017e7e49', id, 'Paid for gas for office heating', 0.00, 1240.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1008
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f6dc3068-67fe-4dea-bd6b-d05cfb5e99df', 'JE-001127', '2026-01-13', 'Paid for lunch for staff visiting HQ from Kunar and Nangarhar', 'JV-JV-1008', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '33afe5a8-1d9b-4992-8da8-456dbbf75720', 'f6dc3068-67fe-4dea-bd6b-d05cfb5e99df', id, 'Paid for lunch for staff visiting HQ from Kunar and Nangarhar', 500.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b9022c5c-1f5f-4c3d-a1c9-997717997033', 'f6dc3068-67fe-4dea-bd6b-d05cfb5e99df', id, 'Paid for lunch for staff visiting HQ from Kunar and Nangarhar', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1009
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('24a0645f-8fd3-40b1-90cb-114a6fd6d26b', 'JE-001128', '2026-01-13', 'Paid for Lunch for fuel for the power generator', 'JV-JV-1009', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8fdf25db-a4d5-47f8-be32-890f95910232', '24a0645f-8fd3-40b1-90cb-114a6fd6d26b', id, 'Paid for Lunch for fuel for the power generator', 1000.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '139efa1d-f11b-4a1b-aba0-5b310f508072', '24a0645f-8fd3-40b1-90cb-114a6fd6d26b', id, 'Paid for Lunch for fuel for the power generator', 0.00, 1000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1010
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c9912d28-55d8-4ce3-b9eb-c63508b5219b', 'JE-001129', '2026-01-13', 'Paid for lunch for MIS makers', 'JV-JV-1010', 'journal_entry', 3480.00, 3480.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c93a830-be1a-4d9e-b247-832d6b92a7ee', 'c9912d28-55d8-4ce3-b9eb-c63508b5219b', id, 'Paid for lunch for MIS makers', 1280.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '85c02b9f-b4d5-4311-8701-78dd2f81afc9', 'c9912d28-55d8-4ce3-b9eb-c63508b5219b', id, 'Paid for lunch for MIS makers', 0.00, 1280.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '28f7cf3d-355b-4b7e-9a36-c74f70912142', 'c9912d28-55d8-4ce3-b9eb-c63508b5219b', id, '', 2200.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1713e62a-1628-46b9-8f99-5ceee38941b6', 'c9912d28-55d8-4ce3-b9eb-c63508b5219b', id, '', 0.00, 2200.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-1006
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('91b44c52-efdd-433f-ace4-ecea8ff8cc64', 'JE-001130', '2026-01-14', 'Deposited cash to Laman Disbursement account in Azizi Bank', 'JV-JV-1006', 'journal_entry', 439250.00, 439250.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a12dabf7-9638-4de1-9209-57fa0e5ede33', '91b44c52-efdd-433f-ace4-ecea8ff8cc64', id, 'Deposited cash to Laman Disbursement account in Azizi Bank', 439250.00, 0.00 FROM accounts WHERE account_code = '10208';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5579fcb1-5bc5-421c-9bca-cc9139daed39', '91b44c52-efdd-433f-ace4-ecea8ff8cc64', id, 'Balancing', 0.00, 3.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'caab501b-734b-4dc1-8891-f045e52d98ea', '91b44c52-efdd-433f-ace4-ecea8ff8cc64', id, 'Deposited cash to Laman Disbursement account in Azizi Bank', 0.00, 439247.00 FROM accounts WHERE account_code = '10103';

-- Entry: JV-1011
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8d4759b3-3f0b-42ed-ad57-8d1ffd31e49a', 'JE-001131', '2026-01-14', 'Paid for lunch for MIS makers', 'JV-JV-1011', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '43f4dec7-fb72-429f-a2ef-6e7b194111f0', '8d4759b3-3f0b-42ed-ad57-8d1ffd31e49a', id, 'Paid for lunch for MIS makers', 300.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a84ddf7b-5ea7-4bea-a4b7-07f3985f28de', '8d4759b3-3f0b-42ed-ad57-8d1ffd31e49a', id, 'Paid for lunch for MIS makers', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1012
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ef01aba9-4989-4e30-9fee-ec603e61b020', 'JE-001132', '2026-01-14', 'Paid for Lunch for fuel for the power generator', 'JV-JV-1012', 'journal_entry', 30543.00, 30543.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '09680c69-e61c-4940-8c41-7d4702b5d7ce', 'ef01aba9-4989-4e30-9fee-ec603e61b020', id, 'Paid for Lunch for fuel for the power generator', 1000.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3458ac02-2db6-4417-bda3-a1cd4aa879cf', 'ef01aba9-4989-4e30-9fee-ec603e61b020', id, 'Paid for Lunch for fuel for the power generator', 0.00, 1000.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '00b45351-261c-4e19-bc90-0a10006ec8ab', 'ef01aba9-4989-4e30-9fee-ec603e61b020', id, '', 4840.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6581b98a-1ec3-431f-9841-fca038228cb5', 'ef01aba9-4989-4e30-9fee-ec603e61b020', id, '', 0.00, 4840.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ea134d0b-620c-47d9-bc82-b2b9d51f1d44', 'ef01aba9-4989-4e30-9fee-ec603e61b020', id, '', 1880.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5597888d-95bb-4927-889d-b0d339929d49', 'ef01aba9-4989-4e30-9fee-ec603e61b020', id, '', 0.00, 1880.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '13ddba3f-f626-48a1-b12a-308095d3b411', 'ef01aba9-4989-4e30-9fee-ec603e61b020', id, '', 4840.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '825fedb4-302f-484b-a1cf-0eaf9b5f3a35', 'ef01aba9-4989-4e30-9fee-ec603e61b020', id, '', 0.00, 4840.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '98b6bf2e-1c24-4727-a093-59f897488614', 'ef01aba9-4989-4e30-9fee-ec603e61b020', id, '', 4833.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e76d3dd2-9c21-4a63-8f01-6099ca35cc9d', 'ef01aba9-4989-4e30-9fee-ec603e61b020', id, '', 0.00, 4833.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4841eec4-7303-4bd0-9927-c9a1e190891f', 'ef01aba9-4989-4e30-9fee-ec603e61b020', id, '', 6960.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ddc8bb48-ebc4-482f-ae7f-6edc69803988', 'ef01aba9-4989-4e30-9fee-ec603e61b020', id, '', 0.00, 6960.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '386f599a-2daf-4e1c-a84e-884d9b38e35e', 'ef01aba9-4989-4e30-9fee-ec603e61b020', id, '', 6190.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f3feb224-9097-4063-9984-3eff8af73c15', 'ef01aba9-4989-4e30-9fee-ec603e61b020', id, '', 0.00, 6190.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-1013
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e62b474f-7fa4-4065-8244-0fa00fbf5390', 'JE-001133', '2026-01-15', 'Paid to Gulzar for the delivery of letter to DAB', 'JV-JV-1013', 'journal_entry', 880.00, 880.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '130e6c99-10d0-4d1e-804f-e9503740ced5', 'e62b474f-7fa4-4065-8244-0fa00fbf5390', id, 'Paid to Gulzar for the delivery of letter to DAB', 80.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd8a47944-df85-4b6d-9c27-29f50df15133', 'e62b474f-7fa4-4065-8244-0fa00fbf5390', id, 'Paid to Gulzar for the delivery of letter to DAB', 0.00, 80.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '444b2331-5ad0-4a41-91cb-02f27fa56454', 'e62b474f-7fa4-4065-8244-0fa00fbf5390', id, 'Paid for cartridge for printer', 800.00, 0.00 FROM accounts WHERE account_code = '60502';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1261ea95-abf7-49d8-b520-b823c848feb0', 'e62b474f-7fa4-4065-8244-0fa00fbf5390', id, 'Paid for cartridge for printer', 0.00, 800.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1014
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('aadaa173-1bc4-459a-82c3-9a093406fa62', 'JE-001134', '2026-01-15', 'Purchased inventory for Mr. Azeemullah Momand', 'JV-JV-1014', 'journal_entry', 3398174.00, 3398174.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '93ac3304-967d-4175-bfa9-df42fd7c4dc1', 'aadaa173-1bc4-459a-82c3-9a093406fa62', id, 'Purchased inventory for Mr. Azeemullah Momand', 1500000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8498c579-9fe5-4ed5-93f6-a0c739cde364', 'aadaa173-1bc4-459a-82c3-9a093406fa62', id, 'Purchased inventory for Mr. Abdulrahman Tayeb', 1500001.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '32b96d43-3d4f-4cb4-a302-b11b8be3fd9d', 'aadaa173-1bc4-459a-82c3-9a093406fa62', id, 'Purchased inventory for Mr. Abdulrahman Tayeb', 398173.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4cefd445-6759-4264-9ad8-eb578f10135c', 'aadaa173-1bc4-459a-82c3-9a093406fa62', id, 'Purchased inventory for Mr. Abdulrahman Tayeb', 0.00, 3398174.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-1015
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0aca9764-a37d-4fb6-8ace-bce1dbd233b8', 'JE-001135', '2026-01-15', 'Paid for lunch', 'JV-JV-1015', 'journal_entry', 1060.00, 1060.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7ff5f99e-a53a-4732-a99c-9a5e85cb04b2', '0aca9764-a37d-4fb6-8ace-bce1dbd233b8', id, 'Paid for lunch', 160.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e857d2ab-8468-45a9-b3b7-2e957c5c56f6', '0aca9764-a37d-4fb6-8ace-bce1dbd233b8', id, 'Paid for lunch', 0.00, 160.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '94bd9cff-927c-410c-a5aa-51ce2eebb901', '0aca9764-a37d-4fb6-8ace-bce1dbd233b8', id, 'CHEQUE BOOKS FEE', 900.00, 0.00 FROM accounts WHERE account_code = '61801';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bc20417a-971a-42b9-93db-61d755a5e78e', '0aca9764-a37d-4fb6-8ace-bce1dbd233b8', id, 'CHEQUE BOOKS FEE', 0.00, 900.00 FROM accounts WHERE account_code = '10208';

-- Entry: JV-1016
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f3691ef3-f8f3-47d3-8a02-9ff9f88dc602', 'JE-001136', '2026-01-15', 'Paid for lunch for MIS makers', 'JV-JV-1016', 'journal_entry', 2180.00, 2180.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7c4dba74-9a74-48a6-9c87-f7700bdcd998', 'f3691ef3-f8f3-47d3-8a02-9ff9f88dc602', id, 'Paid for lunch for MIS makers', 2180.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '013d932b-0669-4e76-bc28-2b4b734361e8', 'f3691ef3-f8f3-47d3-8a02-9ff9f88dc602', id, 'Paid for lunch for MIS makers', 0.00, 2180.00 FROM accounts WHERE account_code = '10101';

-- Entry: LCI115
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('745b0ef0-b47e-455b-90b7-dd8c1adaef13', 'JE-001137', '2026-01-15', 'Imported entry', 'JV-LCI115', 'financing_disbursement', 1980000.00, 1980000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6caa87a3-e597-4b25-9faf-5c7347dbbbe9', '745b0ef0-b47e-455b-90b7-dd8c1adaef13', id, '', 1980000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '21275899-33aa-440f-8c8d-122f0f239ddb', '745b0ef0-b47e-455b-90b7-dd8c1adaef13', id, 'Purchased asset for customer on loan', 0.00, 1500000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8e8f4edb-b783-4ad0-be93-3b3a820db5c8', '745b0ef0-b47e-455b-90b7-dd8c1adaef13', id, 'Cost occurred on purchased product on loan for customers', 0.00, 480000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI116
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('936cf385-e569-44e4-adb2-66337f1bfabe', 'JE-001138', '2026-01-15', 'Imported entry', 'JV-LCI116', 'financing_disbursement', 1980001.00, 1980001.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '05d3de71-9460-4dd2-8e44-79e8dbf30535', '936cf385-e569-44e4-adb2-66337f1bfabe', id, '', 1980001.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8218ddfb-dccd-460c-92dc-9d5f305e76b6', '936cf385-e569-44e4-adb2-66337f1bfabe', id, 'Purchased asset for customer on loan', 0.00, 1500001.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bbba50e3-2940-433d-bd10-79f7ba2597c8', '936cf385-e569-44e4-adb2-66337f1bfabe', id, 'Cost occurred on purchased product on loan for customers', 0.00, 480000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI117
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4b13e020-d82f-4f6e-b867-2700c2d5dbf7', 'JE-001139', '2026-01-15', 'Imported entry', 'JV-LCI117', 'financing_disbursement', 525588.36, 525588.36, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '34b7c0ef-1584-4cff-971b-141e596fdc5b', '4b13e020-d82f-4f6e-b867-2700c2d5dbf7', id, '', 525588.36, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b649f9df-d6df-47de-9e8a-fa975922b419', '4b13e020-d82f-4f6e-b867-2700c2d5dbf7', id, 'Purchased asset for customer on loan', 0.00, 398173.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ab4a8dc1-eaaf-4d95-8ec1-f40d42d0d185', '4b13e020-d82f-4f6e-b867-2700c2d5dbf7', id, 'Cost occurred on purchased product on loan for customers', 0.00, 127415.36 FROM accounts WHERE account_code = '20900';

-- Entry: JV-1017
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fe011102-e943-4d8b-a391-16fef2e8d73a', 'JE-001140', '2026-01-16', 'Paid for lunch expenses of HQ staff', 'JV-JV-1017', 'journal_entry', 290.00, 290.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6804ff1b-cb69-46ed-b491-643106e3010e', 'fe011102-e943-4d8b-a391-16fef2e8d73a', id, 'Paid for lunch expenses of HQ staff', 290.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '66314c1c-8a1f-480a-bf3e-909699d1e9e0', 'fe011102-e943-4d8b-a391-16fef2e8d73a', id, 'Paid for lunch expenses of HQ staff', 0.00, 290.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1018
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8e680817-bdb8-4dbf-a49c-a36e8a14b2d1', 'JE-001141', '2026-01-16', 'Paid for fuel for the power generator', 'JV-JV-1018', 'journal_entry', 9010.00, 9010.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8952e534-191a-4944-8968-c9dd91303f2b', '8e680817-bdb8-4dbf-a49c-a36e8a14b2d1', id, 'Paid for fuel for the power generator', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1d2b05c2-be32-4e67-b3ea-803175b105ae', '8e680817-bdb8-4dbf-a49c-a36e8a14b2d1', id, 'Paid for fuel for the power generator', 0.00, 500.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '77c6ca0c-d5e8-43ba-8ff0-6c5e4084ee9f', '8e680817-bdb8-4dbf-a49c-a36e8a14b2d1', id, '', 1480.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '92a1f540-61a5-4ba8-a3eb-9e5c6d68d253', '8e680817-bdb8-4dbf-a49c-a36e8a14b2d1', id, '', 0.00, 1480.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4b318b9d-7275-4128-99f8-fae995ddc4b6', '8e680817-bdb8-4dbf-a49c-a36e8a14b2d1', id, '', 2180.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b2bd615d-4868-4f9e-9dda-305608cf6d5d', '8e680817-bdb8-4dbf-a49c-a36e8a14b2d1', id, '', 0.00, 2180.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '297461a3-eb60-407b-8019-fe88ec1a82ec', '8e680817-bdb8-4dbf-a49c-a36e8a14b2d1', id, '', 1570.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '83c2344f-f7b7-4ee6-9a6b-fac9fb2e99a5', '8e680817-bdb8-4dbf-a49c-a36e8a14b2d1', id, '', 0.00, 1570.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ed8cda06-5892-44d9-9ab7-bfd76ee72714', '8e680817-bdb8-4dbf-a49c-a36e8a14b2d1', id, '', 1800.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a1f4f44e-917d-4379-bf84-f4af3e9fd967', '8e680817-bdb8-4dbf-a49c-a36e8a14b2d1', id, '', 0.00, 1800.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fa8e7227-aa88-4d36-a31b-91bfa63d2c8d', '8e680817-bdb8-4dbf-a49c-a36e8a14b2d1', id, '', 1480.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0ea26ec9-f7c5-4caf-ba91-7c3d9579e5ca', '8e680817-bdb8-4dbf-a49c-a36e8a14b2d1', id, '', 0.00, 1480.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-1019
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('aeb474ca-2c97-4e49-82a1-b0e84d79efe2', 'JE-001142', '2026-01-18', 'Paid for gas for the office heating', 'JV-JV-1019', 'journal_entry', 4002.00, 4002.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cf0f9364-6859-46f4-adc6-40d0e8b5d158', 'aeb474ca-2c97-4e49-82a1-b0e84d79efe2', id, 'Paid for gas for the office heating', 1690.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8cde54d6-1cf7-4bb2-9f42-4461e3e93e0d', 'aeb474ca-2c97-4e49-82a1-b0e84d79efe2', id, 'Paid for gas for the office heating', 0.00, 1690.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '97a7a90e-6e8b-48de-8ff5-b7e887665362', 'aeb474ca-2c97-4e49-82a1-b0e84d79efe2', id, 'Paid for Meal for guests', 1232.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9c459ec7-07ec-41f8-945e-a87e607230a6', 'aeb474ca-2c97-4e49-82a1-b0e84d79efe2', id, 'Paid for Meal for guests', 0.00, 1232.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c98ca037-6d15-4c6b-8d0b-251e178f5bf1', 'aeb474ca-2c97-4e49-82a1-b0e84d79efe2', id, 'Paid for 29 bottles of drinking water', 580.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7e6ce847-938f-4da9-8714-103ab8e38a25', 'aeb474ca-2c97-4e49-82a1-b0e84d79efe2', id, 'Paid for 29 bottles of drinking water', 0.00, 580.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0a9dc464-a393-43bd-800c-c6b502aac8c5', 'aeb474ca-2c97-4e49-82a1-b0e84d79efe2', id, 'Paid for fuel for the power generator', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'afd309cb-d575-4548-8880-becf5af6770e', 'aeb474ca-2c97-4e49-82a1-b0e84d79efe2', id, 'Paid for fuel for the power generator', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1020
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6e1ae5fb-95cb-4172-8068-59e07db9bacf', 'JE-001143', '2026-01-18', 'Paid for gas for the office heating', 'JV-JV-1020', 'journal_entry', 1230.00, 1230.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6b06aff8-4a94-4c99-89e2-d1d98131b941', '6e1ae5fb-95cb-4172-8068-59e07db9bacf', id, 'Paid for gas for the office heating', 230.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1ca8f1f2-45db-4187-9bde-6f8f82fc4e90', '6e1ae5fb-95cb-4172-8068-59e07db9bacf', id, 'Paid fuel for the power generator', 1000.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7b49bb42-b83c-4a94-a9df-4c0fb8707615', '6e1ae5fb-95cb-4172-8068-59e07db9bacf', id, 'Paid for gas for the office heating and fuel for the power generator', 0.00, 1230.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1021
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3466a7dc-67ac-403a-bc6b-7a0b4e2cc2f0', 'JE-001144', '2026-01-18', 'Cash withdrawal from Azizi Bank Disbursement account', 'JV-JV-1021', 'journal_entry', 100000.00, 100000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6cd0ebd1-46a5-498b-b63f-e9643b3bba5e', '3466a7dc-67ac-403a-bc6b-7a0b4e2cc2f0', id, 'Cash withdrawal from Azizi Bank Disbursement account', 100000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0ead3950-a2a9-4e30-b6f6-ee7780118129', '3466a7dc-67ac-403a-bc6b-7a0b4e2cc2f0', id, 'Cash withdrawal from Azizi Bank Disbursement account', 0.00, 100000.00 FROM accounts WHERE account_code = '10208';

-- Entry: JV-1022
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('58f3555f-5605-44b2-9729-2dee70578721', 'JE-001145', '2026-01-18', 'Paid for Company license adding new shareholder', 'JV-JV-1022', 'journal_entry', 17500.00, 17500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4a03c8c2-b068-43bb-bce5-7366998dbac0', '58f3555f-5605-44b2-9729-2dee70578721', id, 'Paid for Company license adding new shareholder', 17500.00, 0.00 FROM accounts WHERE account_code = '60406';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '96e29afd-ece5-491d-89bf-31e6d2607114', '58f3555f-5605-44b2-9729-2dee70578721', id, 'Paid for Company license adding new shareholder', 0.00, 17500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1023
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('144f575c-c28e-4a18-b039-5e3bad9d4641', 'JE-001146', '2026-01-18', 'Paid for HQ staff lunch expense', 'JV-JV-1023', 'journal_entry', 730.00, 730.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '578fb8d6-9566-4dbc-a6d9-923b94ca761b', '144f575c-c28e-4a18-b039-5e3bad9d4641', id, 'Paid for HQ staff lunch expense', 600.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '89fd612b-8a3f-4af8-a7e9-22764688b013', '144f575c-c28e-4a18-b039-5e3bad9d4641', id, 'Paid for HQ staff lunch expense', 0.00, 600.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '71028e31-831c-479c-b16c-764929825bf2', '144f575c-c28e-4a18-b039-5e3bad9d4641', id, 'Paid for glue for the electrician', 130.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2c9f911b-08c8-49fd-8cd3-71d992888407', '144f575c-c28e-4a18-b039-5e3bad9d4641', id, 'Paid for glue for the electrician', 0.00, 130.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1024
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1c9db55f-cda2-4cad-9628-b601d9714311', 'JE-001147', '2026-01-18', 'Paid for vegetable for lunch', 'JV-JV-1024', 'journal_entry', 1120.00, 1120.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e3635fb1-35db-45be-b94c-b329a4430320', '1c9db55f-cda2-4cad-9628-b601d9714311', id, 'Paid for vegetable for lunch', 160.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9ec7f7e9-7535-40ed-af15-5d0df2c3bacb', '1c9db55f-cda2-4cad-9628-b601d9714311', id, 'Paid for fuel for the power generator', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f2caff7f-df97-43b4-9cd8-92acc0babb7f', '1c9db55f-cda2-4cad-9628-b601d9714311', id, 'Paid for liquid gas for heating', 460.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '94500ea5-eea1-4584-a7d4-6b756cc2d4a1', '1c9db55f-cda2-4cad-9628-b601d9714311', id, 'Paid for liquid gas for heating, for fuel and lunch', 0.00, 1120.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1025
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4898d163-9187-4e32-abb9-e035a6c1c0b2', 'JE-001148', '2026-01-18', 'MISFA fund transferred from LAMEN-MISFA joint account to Disbrusement account for disbursement', 'JV-JV-1025', 'journal_entry', 3000000.00, 3000000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b8ffd204-0da8-4dcb-9320-6d17c16eee1b', '4898d163-9187-4e32-abb9-e035a6c1c0b2', id, 'MISFA fund transferred from LAMEN-MISFA joint account to Disbrusement account for disbursement', 3000000.00, 0.00 FROM accounts WHERE account_code = '10208';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd9baac30-1db2-4975-88a1-aba4ef51c18d', '4898d163-9187-4e32-abb9-e035a6c1c0b2', id, 'MISFA fund transferred from LAMEN-MISFA joint account to Disbrusement account for disbursement', 0.00, 3000000.00 FROM accounts WHERE account_code = '10207';

-- Entry: JV-1026
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e48a7e84-5a62-4864-a719-57565744e683', 'JE-001149', '2026-01-18', 'Fund transferred from disbursement account to Kunar Azizi bank account for client disbursement and staff expenses', 'JV-JV-1026', 'journal_entry', 1076100.00, 1076100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fb5865da-4c4c-46de-990f-fc842a23ea98', 'e48a7e84-5a62-4864-a719-57565744e683', id, 'Fund transferred from disbursement account to Kunar Azizi bank account for client disbursement and staff expenses', 1076100.00, 0.00 FROM accounts WHERE account_code = '10209';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '47da05ae-53c7-4ccb-af0e-412360bc96ff', 'e48a7e84-5a62-4864-a719-57565744e683', id, 'Fund transferred from disbursement account to Kunar Azizi bank account for client disbursement and staff expenses', 0.00, 1076100.00 FROM accounts WHERE account_code = '10208';

-- Entry: JV-1027
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6e252a67-41d0-4a26-bbde-90d4920d8a99', 'JE-001150', '2026-01-18', 'Fund transferred for loan disbursements to clients in Nangarhar', 'JV-JV-1027', 'journal_entry', 618710.00, 618710.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c05bb331-86b5-46d3-9227-18df7ed5b538', '6e252a67-41d0-4a26-bbde-90d4920d8a99', id, 'Fund transferred for loan disbursements to clients in Nangarhar', 595000.00, 0.00 FROM accounts WHERE account_code = '10210';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3a56b0a9-590b-4359-a718-2379e7e0d2b5', '6e252a67-41d0-4a26-bbde-90d4920d8a99', id, 'Fund transferred for loan disbursements to clients in Nangarhar', 0.00, 595000.00 FROM accounts WHERE account_code = '10208';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6095ebee-2969-42c5-b32f-62580482b9d4', '6e252a67-41d0-4a26-bbde-90d4920d8a99', id, '', 4840.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2d543cee-4f74-4ad5-8c6a-883dbfc47125', '6e252a67-41d0-4a26-bbde-90d4920d8a99', id, '', 0.00, 4840.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3b2c3fa0-73ed-4150-8585-d8cf377eaafe', '6e252a67-41d0-4a26-bbde-90d4920d8a99', id, '', 5420.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '265f7a95-9773-4c4c-9d17-cb49302737ae', '6e252a67-41d0-4a26-bbde-90d4920d8a99', id, '', 0.00, 5420.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8b087c59-e0e5-4a4c-8d35-dcdf10a91e83', '6e252a67-41d0-4a26-bbde-90d4920d8a99', id, '', 1790.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9a3f8106-4334-4c0f-b72f-7e596e54a82e', '6e252a67-41d0-4a26-bbde-90d4920d8a99', id, '', 0.00, 1790.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1e2fb195-c562-4130-9024-4cc428618ddd', '6e252a67-41d0-4a26-bbde-90d4920d8a99', id, '', 2360.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2cfdd5a1-7870-4f43-99a2-eabdcef5e52a', '6e252a67-41d0-4a26-bbde-90d4920d8a99', id, '', 0.00, 2360.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'df077497-e446-4ba8-b687-bfeacd683fc7', '6e252a67-41d0-4a26-bbde-90d4920d8a99', id, '', 4840.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '31e8ca70-b2c8-4d1a-af0b-1cb339160555', '6e252a67-41d0-4a26-bbde-90d4920d8a99', id, '', 0.00, 4840.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ed6a5def-0af7-448a-b0a3-a1c2ce534ae2', '6e252a67-41d0-4a26-bbde-90d4920d8a99', id, '', 2000.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e6df749d-459b-4adc-b998-74fe854e64e0', '6e252a67-41d0-4a26-bbde-90d4920d8a99', id, '', 0.00, 2000.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fcab5240-00f3-4e8f-95fc-8da21d37dda8', '6e252a67-41d0-4a26-bbde-90d4920d8a99', id, '', 2460.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0cbbac1b-b04c-4587-9715-545695ead454', '6e252a67-41d0-4a26-bbde-90d4920d8a99', id, '', 0.00, 2460.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-1028
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('944474d5-b7e1-46c5-a1a1-64a46c4ed8f6', 'JE-001151', '2026-01-19', 'Paid for taxi used by Ihsanullah Jalalabd and Kunar', 'JV-JV-1028', 'journal_entry', 1076900.00, 1076900.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '61d641b0-eeca-4b74-8dd9-4f894f76df84', '944474d5-b7e1-46c5-a1a1-64a46c4ed8f6', id, 'Paid for taxi used by Ihsanullah Jalalabd and Kunar', 1800.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '01efb1bf-90d4-4fa1-ba4d-2e338ad9192c', '944474d5-b7e1-46c5-a1a1-64a46c4ed8f6', id, 'Paid for taxi used by Hidayat between Kunar and Jalalabad for official work', 2200.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9f91a82a-032a-4075-883d-56cf7a1b5e50', '944474d5-b7e1-46c5-a1a1-64a46c4ed8f6', id, 'Taxi used by Ihsanullah Jalalabad Branch Manager visiting HQ', 1000.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bd95c6a7-aca7-4810-a68d-fd358e9d0384', '944474d5-b7e1-46c5-a1a1-64a46c4ed8f6', id, 'Taxi used by Fazlullah visiting HQ officer', 1600.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4124611f-5752-4026-9c30-7447600472d0', '944474d5-b7e1-46c5-a1a1-64a46c4ed8f6', id, 'Food allowance paid to Noor Muhammad during travel to Kunar', 4500.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2f489c9b-228a-4056-80cd-bc22b039d2b3', '944474d5-b7e1-46c5-a1a1-64a46c4ed8f6', id, 'Food allowance paid to Noor Muhammad during travel to Kunar', 0.00, 11100.00 FROM accounts WHERE account_code = '10209';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ba41d443-3cdd-4ae1-9e6e-fd59adba4eb9', '944474d5-b7e1-46c5-a1a1-64a46c4ed8f6', id, 'Purchased inventory on Murabaha for clients in Kunar', 500000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '439ddf10-1b48-481e-bc0c-0011dcd0a04f', '944474d5-b7e1-46c5-a1a1-64a46c4ed8f6', id, 'Purchased inventory on Murabaha for clients in Kunar', 560000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e2cc761f-9ac4-4d8c-8aee-bf4d8d621ce2', '944474d5-b7e1-46c5-a1a1-64a46c4ed8f6', id, 'Purchased inventory on Murabaha for clients in Kunar', 0.00, 1060000.00 FROM accounts WHERE account_code = '10209';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '908c685a-777d-4e4a-89e3-2c30ae624f77', '944474d5-b7e1-46c5-a1a1-64a46c4ed8f6', id, '', 5800.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6ac33e78-40ad-4a42-aa73-c2de76483842', '944474d5-b7e1-46c5-a1a1-64a46c4ed8f6', id, '', 0.00, 5800.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-1029
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8adf130d-1f4a-4895-9823-531615dd517d', 'JE-001152', '2026-01-19', 'Purchased inventory for Murabaha clients in Nangarhar', 'JV-JV-1029', 'journal_entry', 590000.00, 590000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e34fdd93-b518-4089-89ab-5deae723b35d', '8adf130d-1f4a-4895-9823-531615dd517d', id, 'Purchased inventory for Murabaha clients in Nangarhar', 290000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '055ed231-a45c-4a6a-be7c-ccde23c59036', '8adf130d-1f4a-4895-9823-531615dd517d', id, 'Purchased inventory for Murabaha clients in Nangarhar', 300000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd3f8ecc3-895c-4f91-bc22-8b9ad2c16ca1', '8adf130d-1f4a-4895-9823-531615dd517d', id, 'Purchased inventory for Murabaha clients in Nangarhar', 0.00, 590000.00 FROM accounts WHERE account_code = '10210';

-- Entry: LCI118
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1db34047-c956-44b4-8c55-c540e5f01cd7', 'JE-001153', '2026-01-19', 'Imported entry', 'JV-LCI118', 'financing_disbursement', 260400.00, 260400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '18407f85-fda8-4134-95cb-072ba2352647', '1db34047-c956-44b4-8c55-c540e5f01cd7', id, '', 260400.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '57f8e9a2-add0-4944-9d92-18a309803d3a', '1db34047-c956-44b4-8c55-c540e5f01cd7', id, 'Purchased asset for customer on loan', 0.00, 210000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1d3b3af8-e19b-426b-a82a-1dcb2db59e58', '1db34047-c956-44b4-8c55-c540e5f01cd7', id, 'Cost occurred on purchased product on loan for customers', 0.00, 50400.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI119
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9c45e54a-377d-4ed1-ac70-dde55f67a82b', 'JE-001154', '2026-01-19', 'Imported entry', 'JV-LCI119', 'financing_disbursement', 348000.00, 348000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2011e99c-e19b-4e12-b883-fd1b3f118cf9', '9c45e54a-377d-4ed1-ac70-dde55f67a82b', id, '', 348000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8d8caa81-4b92-4acb-82ae-f4f2590274ae', '9c45e54a-377d-4ed1-ac70-dde55f67a82b', id, 'Purchased asset for customer on loan', 0.00, 300000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8411869b-eb56-4c88-9f1b-88f90d2253ac', '9c45e54a-377d-4ed1-ac70-dde55f67a82b', id, 'Cost occurred on purchased product on loan for customers', 0.00, 48000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI120
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fbc6e970-72b4-489f-8d83-938cabdcaad0', 'JE-001155', '2026-01-19', 'Imported entry', 'JV-LCI120', 'financing_disbursement', 120000.00, 120000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '38acc08f-ad89-4352-bcf3-44ce460a7630', 'fbc6e970-72b4-489f-8d83-938cabdcaad0', id, '', 120000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7a8cec95-a106-4387-b941-09620d268f1d', 'fbc6e970-72b4-489f-8d83-938cabdcaad0', id, 'Purchased asset for customer on loan', 0.00, 100000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7250f8b6-2b1f-42cd-9f14-2144ae5ada5b', 'fbc6e970-72b4-489f-8d83-938cabdcaad0', id, 'Cost occurred on purchased product on loan for customers', 0.00, 20000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI121
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cc80bf00-991f-484f-ab95-112abc16a4d5', 'JE-001156', '2026-01-19', 'Imported entry', 'JV-LCI121', 'financing_disbursement', 120000.00, 120000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8a4ac033-b923-4cd8-abf5-9258fc48c26b', 'cc80bf00-991f-484f-ab95-112abc16a4d5', id, '', 120000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '54aab48a-06eb-4cfc-9f58-7c58c31e56fd', 'cc80bf00-991f-484f-ab95-112abc16a4d5', id, 'Purchased asset for customer on loan', 0.00, 100000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2e2158ca-bad3-4103-8125-70cae41b7f6f', 'cc80bf00-991f-484f-ab95-112abc16a4d5', id, 'Cost occurred on purchased product on loan for customers', 0.00, 20000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI122
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4a7f8b17-63dc-4ad7-a87a-86f6fa0d876b', 'JE-001157', '2026-01-19', 'Imported entry', 'JV-LCI122', 'financing_disbursement', 58000.00, 58000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '300b68b8-2053-4a74-8885-1105d729c8ac', '4a7f8b17-63dc-4ad7-a87a-86f6fa0d876b', id, '', 58000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c1059e75-93ad-4a05-b21c-9534295985e5', '4a7f8b17-63dc-4ad7-a87a-86f6fa0d876b', id, 'Purchased asset for customer on loan', 0.00, 50000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8e2942fd-b1bc-4061-bae3-1bc8081a37ab', '4a7f8b17-63dc-4ad7-a87a-86f6fa0d876b', id, 'Cost occurred on purchased product on loan for customers', 0.00, 8000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI123
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fedfce6d-d026-4931-92b7-59f058a1fd7e', 'JE-001158', '2026-01-19', 'Imported entry', 'JV-LCI123', 'financing_disbursement', 116000.00, 116000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8425a518-59e9-41da-996d-ba118c149b5d', 'fedfce6d-d026-4931-92b7-59f058a1fd7e', id, '', 116000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fe3c87d6-7851-4080-831f-1087725827da', 'fedfce6d-d026-4931-92b7-59f058a1fd7e', id, 'Purchased asset for customer on loan', 0.00, 100000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a56ee408-5b08-425f-a932-028d9ec48ee3', 'fedfce6d-d026-4931-92b7-59f058a1fd7e', id, 'Cost occurred on purchased product on loan for customers', 0.00, 16000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI124
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('dd3e7e6c-dfc1-4e2d-a506-bbbd01704156', 'JE-001159', '2026-01-19', 'Imported entry', 'JV-LCI124', 'financing_disbursement', 120000.00, 120000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a8fcc9ba-a8d6-419d-b0ce-e76b0b0e008e', 'dd3e7e6c-dfc1-4e2d-a506-bbbd01704156', id, '', 120000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '44eb74e7-3f1c-4910-800d-7eec446eb640', 'dd3e7e6c-dfc1-4e2d-a506-bbbd01704156', id, 'Purchased asset for customer on loan', 0.00, 100000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '77b286f5-06bc-43a5-aca3-dc701a627e63', 'dd3e7e6c-dfc1-4e2d-a506-bbbd01704156', id, 'Cost occurred on purchased product on loan for customers', 0.00, 20000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI125
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c98fd91f-4832-4d93-8f37-9145f7c381b4', 'JE-001160', '2026-01-19', 'Imported entry', 'JV-LCI125', 'financing_disbursement', 116000.00, 116000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5f8889be-9a3b-4883-a153-43b040af0b5b', 'c98fd91f-4832-4d93-8f37-9145f7c381b4', id, '', 116000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c3210113-3884-4f0f-b893-5fd3b830b08b', 'c98fd91f-4832-4d93-8f37-9145f7c381b4', id, 'Purchased asset for customer on loan', 0.00, 100000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4038c3cc-72bb-4ba0-868e-84124fa29add', 'c98fd91f-4832-4d93-8f37-9145f7c381b4', id, 'Cost occurred on purchased product on loan for customers', 0.00, 16000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI126
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('53faab5c-42c7-4151-8eb5-0fad46315559', 'JE-001161', '2026-01-19', 'Imported entry', 'JV-LCI126', 'financing_disbursement', 372000.00, 372000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '93636b6f-85cd-4cb3-9136-2793d135d021', '53faab5c-42c7-4151-8eb5-0fad46315559', id, '', 372000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'df419e58-6550-4c48-b975-bff195e8228b', '53faab5c-42c7-4151-8eb5-0fad46315559', id, 'Purchased asset for customer on loan', 0.00, 300000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ed70ec8f-62bd-48fe-9693-7372c2174c6f', '53faab5c-42c7-4151-8eb5-0fad46315559', id, 'Cost occurred on purchased product on loan for customers', 0.00, 72000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI127
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5feb3db0-7721-4efb-9416-0ee55d56f235', 'JE-001162', '2026-01-19', 'Imported entry', 'JV-LCI127', 'financing_disbursement', 46400.00, 46400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a7ccc7d2-75fc-4742-b35b-46451e635e4a', '5feb3db0-7721-4efb-9416-0ee55d56f235', id, '', 46400.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd2a9570c-0b39-4da1-a253-13984af1ab9f', '5feb3db0-7721-4efb-9416-0ee55d56f235', id, 'Purchased asset for customer on loan', 0.00, 40000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '339a86d4-fad6-4ea9-8e15-89c28cdd2201', '5feb3db0-7721-4efb-9416-0ee55d56f235', id, 'Cost occurred on purchased product on loan for customers', 0.00, 6400.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI128
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b282f89b-e08d-4ec0-bd89-4c1e1bf28761', 'JE-001163', '2026-01-19', 'Imported entry', 'JV-LCI128', 'financing_disbursement', 116000.00, 116000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7d749d4b-0a87-420b-b376-6a7596d107be', 'b282f89b-e08d-4ec0-bd89-4c1e1bf28761', id, '', 116000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9400fd14-df55-4c22-ab55-3e3713662528', 'b282f89b-e08d-4ec0-bd89-4c1e1bf28761', id, 'Purchased asset for customer on loan', 0.00, 100000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a0caad49-45a5-41fe-b00c-b836dea57a06', 'b282f89b-e08d-4ec0-bd89-4c1e1bf28761', id, 'Cost occurred on purchased product on loan for customers', 0.00, 16000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI129
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7c655942-142c-48fc-874d-9ddf8348bf94', 'JE-001164', '2026-01-19', 'Imported entry', 'JV-LCI129', 'financing_disbursement', 58000.00, 58000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2d582a20-3aa2-4bc8-8c4b-317ad5f95423', '7c655942-142c-48fc-874d-9ddf8348bf94', id, '', 58000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '274fc945-c1b6-4e52-86f0-895e4ef4f36c', '7c655942-142c-48fc-874d-9ddf8348bf94', id, 'Purchased asset for customer on loan', 0.00, 50000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd092fac4-cf71-4a44-86cf-d96e3e569dee', '7c655942-142c-48fc-874d-9ddf8348bf94', id, 'Cost occurred on purchased product on loan for customers', 0.00, 8000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI130
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('610f0982-9979-4e9e-a06d-86f241017e64', 'JE-001165', '2026-01-19', 'Imported entry', 'JV-LCI130', 'financing_disbursement', 124000.00, 124000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5f5d47f0-8789-430c-828e-735fa8890941', '610f0982-9979-4e9e-a06d-86f241017e64', id, '', 124000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7b8233d1-6342-4358-b22d-60bd810f8499', '610f0982-9979-4e9e-a06d-86f241017e64', id, 'Purchased asset for customer on loan', 0.00, 100000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bfb540ee-3e5d-46cc-867d-9d9877f77b39', '610f0982-9979-4e9e-a06d-86f241017e64', id, 'Cost occurred on purchased product on loan for customers', 0.00, 24000.00 FROM accounts WHERE account_code = '20900';

-- Entry: JV-1030
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1ebd6de0-cbe4-4135-aab4-0fcbdfacdab0', 'JE-001166', '2026-01-20', 'Paid for staff lunch expense', 'JV-JV-1030', 'journal_entry', 3410.00, 3410.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '333b5310-58c9-47c4-8da1-e5d5f356fd75', '1ebd6de0-cbe4-4135-aab4-0fcbdfacdab0', id, 'Paid for staff lunch expense', 1090.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6361e80d-4946-4d57-aa4d-2c54924ee722', '1ebd6de0-cbe4-4135-aab4-0fcbdfacdab0', id, 'Paid for liquid gas for heating', 2210.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2759a9a0-00f9-4329-8168-71d49779eba1', '1ebd6de0-cbe4-4135-aab4-0fcbdfacdab0', id, 'Paid for liquid gas for heating and staff lunch', 0.00, 3300.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4b10dbab-c8c1-4793-8a64-68c0bfafddc2', '1ebd6de0-cbe4-4135-aab4-0fcbdfacdab0', id, 'Paid for to Gulzar for taxi use to print ID cards and bringing letters from DAB', 110.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3dc54c1f-7975-4dc9-a3f2-6834c08aa0ef', '1ebd6de0-cbe4-4135-aab4-0fcbdfacdab0', id, 'Paid for to Gulzar for taxi use to print ID cards and bringing letters from DAB', 0.00, 110.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1031
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('32906d4a-8892-4295-9311-68dc5f76a4bf', 'JE-001167', '2026-01-20', 'Paid for printing ID cards, ID card covers, and making logo for ID cards', 'JV-JV-1031', 'journal_entry', 20623.00, 20623.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c5c760ab-cb0a-4819-aefb-06c0fbb6bc69', '32906d4a-8892-4295-9311-68dc5f76a4bf', id, 'Paid for printing ID cards, ID card covers, and making logo for ID cards', 2180.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2fd517a7-1dd2-4f26-8f70-9fe0dd02a22a', '32906d4a-8892-4295-9311-68dc5f76a4bf', id, 'Paid for printing ID cards, ID card covers, and making logo for ID cards', 0.00, 2180.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8f45ca41-5dcc-40e5-83de-70c8cdb181da', '32906d4a-8892-4295-9311-68dc5f76a4bf', id, '', 3870.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3e86ad08-6568-4cc0-93b2-3f0c6784233e', '32906d4a-8892-4295-9311-68dc5f76a4bf', id, '', 0.00, 3870.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1efaa5c4-0ea0-4ca1-8f64-77687ca3ed66', '32906d4a-8892-4295-9311-68dc5f76a4bf', id, '', 4840.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5d619047-4732-406b-ae34-3bc541ff5917', '32906d4a-8892-4295-9311-68dc5f76a4bf', id, '', 0.00, 4840.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5cdbab8b-c4d7-4ca7-a195-24132ac8a21a', '32906d4a-8892-4295-9311-68dc5f76a4bf', id, '', 7733.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f8d0d424-8349-4327-a052-88450461ac42', '32906d4a-8892-4295-9311-68dc5f76a4bf', id, '', 0.00, 7733.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a8cdec04-2bd7-4685-8f04-414dafe132a7', '32906d4a-8892-4295-9311-68dc5f76a4bf', id, '', 2000.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c69c22be-5ea8-4903-9c65-8db20f33e995', '32906d4a-8892-4295-9311-68dc5f76a4bf', id, '', 0.00, 2000.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-1032
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1765290f-502b-407d-b36f-2b7fa070e6b5', 'JE-001168', '2026-01-21', 'Paid for fuel for the power generator', 'JV-JV-1032', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '587266d2-4434-4aea-a08e-1393c1802f80', '1765290f-502b-407d-b36f-2b7fa070e6b5', id, 'Paid for fuel for the power generator', 1000.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9985dbc6-2d2d-4777-90be-0994fbf7a2a6', '1765290f-502b-407d-b36f-2b7fa070e6b5', id, 'Paid for fuel for the power generator', 0.00, 1000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1033
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4b4a3e50-9249-4067-949e-684af3ddca2b', 'JE-001169', '2026-01-21', 'Paid for staff lunch expense', 'JV-JV-1033', 'journal_entry', 8000.00, 8000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '04aac6bc-5133-47b8-a2f1-ac3c9e85d941', '4b4a3e50-9249-4067-949e-684af3ddca2b', id, 'Paid for staff lunch expense', 500.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ecaaba75-f356-4889-aa8c-fafdf7029163', '4b4a3e50-9249-4067-949e-684af3ddca2b', id, 'Paid for staff lunch expense', 0.00, 500.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '59ad0bb7-9f9d-4f83-9b28-035030fdbf66', '4b4a3e50-9249-4067-949e-684af3ddca2b', id, '', 1480.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '93462eab-399d-4138-8a31-0120b9bcc74d', '4b4a3e50-9249-4067-949e-684af3ddca2b', id, '', 0.00, 1480.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5215d4f1-4e2d-4379-a87a-110bfa62ffe5', '4b4a3e50-9249-4067-949e-684af3ddca2b', id, '', 4840.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f9c52c13-c45f-4438-9a40-95b8550db463', '4b4a3e50-9249-4067-949e-684af3ddca2b', id, '', 0.00, 4840.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '59f16dd5-b301-49ec-b542-a5bb3c3530ba', '4b4a3e50-9249-4067-949e-684af3ddca2b', id, '', 1180.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3ea75767-da2d-440a-9838-f148ca72e6f2', '4b4a3e50-9249-4067-949e-684af3ddca2b', id, '', 0.00, 1180.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-1034
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('675e53f3-c0d2-4d8d-929c-376e9eef47cd', 'JE-001170', '2026-01-22', 'Advance salary paid to Liaqat Ogra Khil', 'JV-JV-1034', 'journal_entry', 6960.00, 6960.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a06d1b6f-49ed-458e-85ab-abce18784023', '675e53f3-c0d2-4d8d-929c-376e9eef47cd', id, 'Advance salary paid to Liaqat Ogra Khil', 6960.00, 0.00 FROM accounts WHERE account_code = '20171';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8e077365-dc68-4464-83ca-bcb468d59979', '675e53f3-c0d2-4d8d-929c-376e9eef47cd', id, 'Advance salary paid to Liaqat Ogra Khil', 0.00, 6960.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1035
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c836553d-1a9a-4dc9-8a02-b95b37e43bbc', 'JE-001171', '2026-01-22', 'Paid for fuel for the power generator', 'JV-JV-1035', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '27929f97-3ed7-4184-8a52-ebde904b0a49', 'c836553d-1a9a-4dc9-8a02-b95b37e43bbc', id, 'Paid for fuel for the power generator', 1000.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b2c3631c-d35d-4253-94bf-9008143fc07c', 'c836553d-1a9a-4dc9-8a02-b95b37e43bbc', id, 'Paid for fuel for the power generator', 0.00, 1000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1036
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d68759a1-0cce-4ef1-aa62-ff3b86327b34', 'JE-001172', '2026-01-22', 'Paid for staff lunch expenses', 'JV-JV-1036', 'journal_entry', 7710.00, 7710.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '550f1577-6e09-49b8-850c-678f1241096c', 'd68759a1-0cce-4ef1-aa62-ff3b86327b34', id, 'Paid for staff lunch expenses', 1300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '426fc0b1-9f95-4b12-bb46-f1cdd8bbb504', 'd68759a1-0cce-4ef1-aa62-ff3b86327b34', id, 'Paid for staff lunch expenses', 0.00, 1300.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '43ac9fe3-f01d-448e-b3cd-97026f0783ca', 'd68759a1-0cce-4ef1-aa62-ff3b86327b34', id, '', 1980.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ac0af142-84d7-46ac-a137-cd82a8828ac5', 'd68759a1-0cce-4ef1-aa62-ff3b86327b34', id, '', 0.00, 1980.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3db0ba74-681a-4d35-82a7-5a3f942334ee', 'd68759a1-0cce-4ef1-aa62-ff3b86327b34', id, '', 4430.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '79df7e39-72fe-40f1-847c-38612338974e', 'd68759a1-0cce-4ef1-aa62-ff3b86327b34', id, '', 0.00, 4430.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-1037
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c7f65dd2-0e12-4d96-bde0-df7d2477f981', 'JE-001173', '2026-01-23', 'Paid for staff lunch expenses', 'JV-JV-1037', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a202facc-ed80-4941-b0db-7c4b8b6080db', 'c7f65dd2-0e12-4d96-bde0-df7d2477f981', id, 'Paid for staff lunch expenses', 150.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9f3f3c85-cabf-4bcf-89ef-3580a5964de5', 'c7f65dd2-0e12-4d96-bde0-df7d2477f981', id, 'Paid for staff lunch expenses', 0.00, 150.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1038
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('56ce0c62-27ce-4104-96bc-eea8098449be', 'JE-001174', '2026-01-24', 'Paid for gas for heating', 'JV-JV-1038', 'journal_entry', 1500.00, 1500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1da0313c-8e8f-4550-9bfc-e211630972b9', '56ce0c62-27ce-4104-96bc-eea8098449be', id, 'Paid for gas for heating', 950.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6c0749c2-55a1-4a43-931b-54947ea42ba2', '56ce0c62-27ce-4104-96bc-eea8098449be', id, 'lunch expense', 50.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0e723750-ba85-415f-bce5-382aa248003d', '56ce0c62-27ce-4104-96bc-eea8098449be', id, 'ink for printer', 500.00, 0.00 FROM accounts WHERE account_code = '60502';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '36b54a16-65a7-41f4-ad0b-c9aefeb08289', '56ce0c62-27ce-4104-96bc-eea8098449be', id, 'lunch expense, gas, and ink for printer', 0.00, 1500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1039
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('932fa11d-f1f3-443c-ad04-d39e157bbb3b', 'JE-001175', '2026-01-24', 'Paid for the purchase of heater, Salander for the office', 'JV-JV-1039', 'journal_entry', 2000.00, 2000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '95e350a2-2cdc-487d-b37b-11ca95f98a9e', '932fa11d-f1f3-443c-ad04-d39e157bbb3b', id, 'Paid for the purchase of heater, Salander for the office', 2000.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '994ad32b-606b-4604-920f-b20afb0e570c', '932fa11d-f1f3-443c-ad04-d39e157bbb3b', id, 'Paid for the purchase of heater, Salander for the office', 0.00, 2000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1040
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('53d55e33-9c82-49f1-ac3d-985258f784a1', 'JE-001176', '2026-01-24', 'Paid for staff lunch expenses', 'JV-JV-1040', 'journal_entry', 46760.00, 46760.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'db009233-20b2-467a-968d-51c7e71dbcae', '53d55e33-9c82-49f1-ac3d-985258f784a1', id, 'Paid for staff lunch expenses', 140.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0046f320-c5b5-4168-ba5e-e31287f8052f', '53d55e33-9c82-49f1-ac3d-985258f784a1', id, 'Paid for staff lunch expenses', 0.00, 140.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e236c1eb-9dfe-42f4-ad75-09db34e3d670', '53d55e33-9c82-49f1-ac3d-985258f784a1', id, '', 7900.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7c3a8c76-1433-4901-91e0-86360e606c96', '53d55e33-9c82-49f1-ac3d-985258f784a1', id, '', 0.00, 7900.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd29efe65-a8bc-4001-8c58-dc01086aba04', '53d55e33-9c82-49f1-ac3d-985258f784a1', id, '', 8000.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '03bf88fd-576d-4038-b33f-1198c2361c21', '53d55e33-9c82-49f1-ac3d-985258f784a1', id, '', 0.00, 8000.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2bd4300b-1956-4345-b231-6b1512015a32', '53d55e33-9c82-49f1-ac3d-985258f784a1', id, '', 7740.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e31dda27-1ede-40b9-9440-1bd51cd3172e', '53d55e33-9c82-49f1-ac3d-985258f784a1', id, '', 0.00, 7740.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e67b5343-5a76-4cd1-9dd4-eb3fada23ff0', '53d55e33-9c82-49f1-ac3d-985258f784a1', id, '', 2950.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '968734fe-4954-4ab7-a4ee-193a458d7916', '53d55e33-9c82-49f1-ac3d-985258f784a1', id, '', 0.00, 2950.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e9b4df09-2a06-491e-9020-33ce91f0d6f7', '53d55e33-9c82-49f1-ac3d-985258f784a1', id, '', 7400.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fd45ee3f-1e08-4017-a84a-19cfc5bc7b5d', '53d55e33-9c82-49f1-ac3d-985258f784a1', id, '', 0.00, 7400.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd17b7dec-7e02-4ff7-8341-f38849b68029', '53d55e33-9c82-49f1-ac3d-985258f784a1', id, '', 3930.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0fe0b312-defb-43dc-b4cf-5960b07fd293', '53d55e33-9c82-49f1-ac3d-985258f784a1', id, '', 0.00, 3930.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0bf616fb-3c59-41e8-ba37-d59f6424b6e5', '53d55e33-9c82-49f1-ac3d-985258f784a1', id, '', 8700.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b439f234-70b9-4a4b-8caf-d6415349e121', '53d55e33-9c82-49f1-ac3d-985258f784a1', id, '', 0.00, 8700.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-1041
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3cd61079-d7fa-43d3-b69b-48972a1d2ce1', 'JE-001177', '2026-01-25', 'Paid for staff lunch expenses.', 'JV-JV-1041', 'journal_entry', 14380.00, 14380.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9d17f7be-31e6-44e4-8117-9461eb8fcb0c', '3cd61079-d7fa-43d3-b69b-48972a1d2ce1', id, 'Paid for staff lunch expenses.', 1020.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2a07a316-f6be-45fb-969e-61e27524f707', '3cd61079-d7fa-43d3-b69b-48972a1d2ce1', id, 'Paid for gas for the office heating', 680.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b9bb196b-6b1c-4ee9-8c9c-a6255b55176b', '3cd61079-d7fa-43d3-b69b-48972a1d2ce1', id, 'Paid for card for the digital phone', 500.00, 0.00 FROM accounts WHERE account_code = '60005';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4caa1f32-b433-4330-aa24-81be10d3f9e4', '3cd61079-d7fa-43d3-b69b-48972a1d2ce1', id, 'Paid for card for the digital phone, lunch expense and gas for heating', 0.00, 2200.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '900f94ae-33f3-44f7-ad1c-fa5b9bcd7919', '3cd61079-d7fa-43d3-b69b-48972a1d2ce1', id, '', 9280.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '544ef187-63b9-4b14-8e36-5eddced2794b', '3cd61079-d7fa-43d3-b69b-48972a1d2ce1', id, '', 0.00, 9280.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '161c3197-5985-4790-afd1-77fef0ae370c', '3cd61079-d7fa-43d3-b69b-48972a1d2ce1', id, '', 2900.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fa6bfdf6-cbf7-4d7b-8a4b-413b777311b3', '3cd61079-d7fa-43d3-b69b-48972a1d2ce1', id, '', 0.00, 2900.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-1042
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6fc32736-f7b1-403c-87ef-4e85f47e85cc', 'JE-001178', '2026-01-26', 'Paid for fuel for the power generator', 'JV-JV-1042', 'journal_entry', 27660.00, 27660.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a8db5950-75ed-4393-bf03-0fcb8d243724', '6fc32736-f7b1-403c-87ef-4e85f47e85cc', id, 'Paid for fuel for the power generator', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aabe1291-cdf9-4936-8fed-836f90006305', '6fc32736-f7b1-403c-87ef-4e85f47e85cc', id, 'Paid for fuel for the power generator', 0.00, 500.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a6e5abb4-151c-4909-8cdf-d667923c159f', '6fc32736-f7b1-403c-87ef-4e85f47e85cc', id, '', 5410.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dc1dd3fb-3d9d-4531-936d-1a1f66c78cf3', '6fc32736-f7b1-403c-87ef-4e85f47e85cc', id, '', 0.00, 5410.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '762fd869-28e1-4abb-96d8-a7b5ec41fdc8', '6fc32736-f7b1-403c-87ef-4e85f47e85cc', id, '', 21750.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1be684a5-329d-4ff0-a434-e551cbcb3920', '6fc32736-f7b1-403c-87ef-4e85f47e85cc', id, '', 0.00, 21750.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-1043
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('34b47d52-1681-484b-b0f8-98ae4ba56631', 'JE-001179', '2026-01-27', 'Paid for lunch and gas expenses', 'JV-JV-1043', 'journal_entry', 2670.00, 2670.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fcdee8aa-6966-4bc0-965d-4c009ef77025', '34b47d52-1681-484b-b0f8-98ae4ba56631', id, 'Paid for lunch and gas expenses', 350.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd76f5b10-377e-4842-bf97-ac99d9c7edcf', '34b47d52-1681-484b-b0f8-98ae4ba56631', id, 'Paid for lunch and gas expenses', 2320.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5c7c1e18-b293-4811-957c-d9c91c858817', '34b47d52-1681-484b-b0f8-98ae4ba56631', id, 'Paid for lunch and gas expenses', 0.00, 2670.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1044
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('aed67c44-64d1-4c97-a04c-8f7e15e7a82a', 'JE-001180', '2026-01-27', 'Paid for job announcements', 'JV-JV-1044', 'journal_entry', 47468.00, 47468.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '14b8f70d-b894-40d3-b18c-691da8df8c2c', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, 'Paid for job announcements', 3000.00, 0.00 FROM accounts WHERE account_code = '61605';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '438f5e19-6a47-4eb9-8a44-c85d90962edd', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, 'Paid for job announcements', 0.00, 3000.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7d8e77ba-268b-41b9-9065-a9d6c0e1d82d', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 8050.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '63371bf2-8be0-4a49-8a2f-48196d832b9a', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 0.00, 8050.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '086946d4-0f3d-4bf4-bb68-33fd2e1c9a89', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 1970.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '87406b99-263c-43b6-8bc6-b4b84d719c2d', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 0.00, 1970.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '46aeda46-2c4c-4411-ae4b-89846356d499', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 3450.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a9d363d1-36f3-4e63-a61b-aa24cb168380', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 0.00, 3450.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '49650bbb-abed-40e8-993b-a86f9bb9d625', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 8290.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e2087740-27af-4350-837f-c0e5c76ae8a1', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 0.00, 8290.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a6ec786a-67bb-4ccb-bb26-a68fee54bba3', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 2520.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4a1f591c-4790-4442-a89d-0d6064beb319', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 0.00, 2520.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '85bee523-78a7-48db-b5a3-c923d148b872', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 1210.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '95cf9cbd-ea7a-43d9-b591-44e51d9df425', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 0.00, 1210.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd0292ff3-780d-42ef-b91b-4aaf7bd40ecf', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 6765.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8fd90231-6862-4086-94ad-47aae9fe759a', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 0.00, 6765.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eefff32f-14fe-4183-885c-82f81bf7a8c1', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 1580.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '03f15bce-113c-4831-a5b8-e79332683be2', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 0.00, 1580.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0ffcbf9d-b61c-4241-88be-8b4ba2d33010', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 4833.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0eaf8bde-d50d-4ab7-b5da-326209bc5a55', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 0.00, 4833.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b49684ef-fe97-44ce-b26f-4e3e09549ff3', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 5800.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8eab3365-5f04-4b99-a698-2693e2c433d0', 'aed67c44-64d1-4c97-a04c-8f7e15e7a82a', id, '', 0.00, 5800.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-1045
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a91363ba-8f44-411c-b05c-ca4eb1fae30a', 'JE-001181', '2026-01-28', 'Cash withdrawal Azizi Bank Disbursement account for office expenses Cheque # 02090653', 'JV-JV-1045', 'journal_entry', 150000.00, 150000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '653a2707-323a-40b4-957a-fc23ee187192', 'a91363ba-8f44-411c-b05c-ca4eb1fae30a', id, 'Cash withdrawal Azizi Bank Disbursement account for office expenses Cheque # 02090653', 150000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bf73ce85-12d8-4761-87d5-6c3fb05c552f', 'a91363ba-8f44-411c-b05c-ca4eb1fae30a', id, 'Cash withdrawal Azizi Bank Disbursement account for office expenses Cheque # 02090653', 0.00, 150000.00 FROM accounts WHERE account_code = '10208';

-- Entry: JV-1046
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a251abe4-bf4e-4621-81e6-0dd2dd402179', 'JE-001182', '2026-01-28', 'Fund transferred to Azizi Bank Kunar account for disbursement to clients.', 'JV-JV-1046', 'journal_entry', 1335000.00, 1335000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ef10fa24-47a7-425d-9a94-1b0573ac3bc5', 'a251abe4-bf4e-4621-81e6-0dd2dd402179', id, 'Fund transferred to Azizi Bank Kunar account for disbursement to clients.', 495000.00, 0.00 FROM accounts WHERE account_code = '10209';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '03c3cbc2-13ff-4949-92a2-a4be86ebd79a', 'a251abe4-bf4e-4621-81e6-0dd2dd402179', id, 'Fund transferred to Azizi Bank Kunar account for disbursement to clients.', 0.00, 495000.00 FROM accounts WHERE account_code = '10208';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0d8ddce6-7779-474e-a66c-e17771bf41bd', 'a251abe4-bf4e-4621-81e6-0dd2dd402179', id, 'Fund transferred to Azizi Bank Nangarhar account for disbursement to clients.', 590000.00, 0.00 FROM accounts WHERE account_code = '10210';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '92c43ccd-9634-472b-a27a-4c31b7c76a3b', 'a251abe4-bf4e-4621-81e6-0dd2dd402179', id, 'Fund transferred to Azizi Bank Nangarhar account for disbursement to clients.', 0.00, 590000.00 FROM accounts WHERE account_code = '10208';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dc31634f-1d7f-4c0f-8b19-14316c730540', 'a251abe4-bf4e-4621-81e6-0dd2dd402179', id, 'Fund transferred to Azizi Bank Disbursement account was mistakenly withdrawn for expenses Cheque # 02065407', 250000.00, 0.00 FROM accounts WHERE account_code = '10208';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '81abb094-5784-45ef-9f96-5dea75a08a71', 'a251abe4-bf4e-4621-81e6-0dd2dd402179', id, 'Fund transferred to Azizi Bank Disbursement account was mistakenly withdrawn for expenses Cheque # 02065407', 0.00, 250000.00 FROM accounts WHERE account_code = '10206';

-- Entry: JV-1047
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e3c925f6-0f9a-42c6-8545-331a17799afb', 'JE-001183', '2026-01-28', 'Paid for staff lunch expenses', 'JV-JV-1047', 'journal_entry', 1070.00, 1070.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6e6281fb-e6c0-4596-a511-f6d5e01904df', 'e3c925f6-0f9a-42c6-8545-331a17799afb', id, 'Paid for staff lunch expenses', 1070.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '89bff3b6-307f-4c18-9854-40ec3bd99a66', 'e3c925f6-0f9a-42c6-8545-331a17799afb', id, 'Paid for staff lunch expenses', 0.00, 1070.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1048
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4eee419c-8d86-47e0-abb2-2e48f6bd3014', 'JE-001184', '2026-01-28', 'Paid for lunch expense for guests working on MIS', 'JV-JV-1048', 'journal_entry', 590.00, 590.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bc66cb67-ae61-4e9f-8c81-035fa9d3193e', '4eee419c-8d86-47e0-abb2-2e48f6bd3014', id, 'Paid for lunch expense for guests working on MIS', 590.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '43b3527b-140d-476e-ae0c-6182a6544911', '4eee419c-8d86-47e0-abb2-2e48f6bd3014', id, 'Paid for lunch expense for guests working on MIS', 0.00, 590.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-1049
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('70180b34-e363-459f-828c-76c27d3c010b', 'JE-001185', '2026-01-28', 'Paid for taxi to Zabihullah Ahmad and Almas for Marketing', 'JV-JV-1049', 'journal_entry', 330763.00, 330763.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4af2b05f-29b6-4ce2-9d15-edd5b8f2328a', '70180b34-e363-459f-828c-76c27d3c010b', id, 'Paid for taxi to Zabihullah Ahmad and Almas for Marketing', 820.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '54b0ab3e-1bbe-4046-accb-cbf0fd1f55a0', '70180b34-e363-459f-828c-76c27d3c010b', id, 'Paid for taxi to Zabihullah Ahmad and Almas for Marketing', 0.00, 820.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0fe79d37-7919-42e6-9df1-d407fd6d4853', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 7500.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3813d3a7-d998-4c87-9052-0c7a5232afac', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 7500.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '11e9d7a9-6c9f-4ff3-b8cc-057880c85989', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 34800.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd3574c36-f0bf-44b4-bf0c-a881bc34cb1c', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 34800.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '089926d7-ab67-47f3-93a2-96541cf2ad5c', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 6960.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd74a560e-d47c-4536-8c3b-1e133d40e40e', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 6960.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e7a671fe-794b-4c76-ae93-77a5bea29dce', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 19330.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '173accfc-62aa-4c12-9490-60830d2f8ead', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 19330.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0698b139-4167-4423-924e-954fd83bd4ab', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 12240.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '97c761f9-9bc7-42a2-947d-d5e38078e987', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 12240.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '31255e84-e4b2-4618-8b51-d2c6fd281135', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 4835.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '487b0890-8f10-465c-9d78-5a9b7273454a', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 4835.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1193f1d0-fe66-4328-89a2-66cd14754055', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 19335.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ebaa4a41-d245-4409-85ad-99967fc4540b', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 19335.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b63f24cf-bf53-4715-8efe-26e006e7d791', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 18125.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2767d089-0c9c-491b-a06c-671ea8cd36bf', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 18125.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7048f7dc-cce4-449a-babf-74baa1f29890', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 19330.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eb8f91e6-df5d-4b05-a2c7-280b0dfd2afe', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 19330.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8f02c4ba-c330-48f3-980f-c55471bab795', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 19330.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '60bc021c-0179-4d13-b268-7048f5f8d969', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 19330.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a2a29b27-900e-4553-8d7d-8f46973c1d86', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 27070.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ee9b1381-7e2f-4de0-b2fd-60ad518fa076', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 27070.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fab7d3c8-d872-406a-a470-e597a29f74ea', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 7735.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0a0eab00-8b8f-44ad-ab0c-9bb173bf5c0b', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 7735.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bffe199e-479a-4866-bfef-a552075c10ed', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 32230.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd8b5222b-1b09-4bdf-8919-778eb26ce9fc', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 32230.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cec0f659-c3af-4c69-af45-1def0cdf77c0', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 10960.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5c6232e2-1ee7-4940-9fd9-2ec712cf0ac9', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 10960.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f9322733-3eff-4122-a718-49e19bc481e2', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 16110.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f30a0e8f-b0c2-45bb-8060-43b7f76325e3', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 16110.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5733b176-3bb3-42d0-aabd-74ded5bba523', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 31910.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4eccd152-b819-46aa-a027-cbe97383243b', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 31910.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b8e0f98f-aafe-492b-88cb-28dec4e440db', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 19670.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8727a1a4-cd73-4c67-b030-b78a913c8886', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 19670.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e9adf110-7521-4d6d-ab42-4ffac27c60ab', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 8110.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5b163929-9747-47db-90bb-4380d0aeb4b6', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 8110.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '06840c69-b6e1-4286-ac47-84a55fa777be', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 7733.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c8126ec-479c-43a6-8acd-19d4d771a79c', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 7733.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '48e4156a-7953-4867-a8c4-725ab1acca91', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 6630.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '334a2e75-8055-424a-9b0a-df7d4ae34f04', '70180b34-e363-459f-828c-76c27d3c010b', id, '', 0.00, 6630.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-1050
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('907255f6-16d0-4646-8c65-4569ab38dbbb', 'JE-001186', '2026-01-29', 'Purchased inventory on Murabaha for Mr. Muhammad Hamayoon Parwani', 'JV-JV-1050', 'journal_entry', 577070.00, 577070.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '96e4db97-c604-46b9-ae1c-102214c00a8e', '907255f6-16d0-4646-8c65-4569ab38dbbb', id, 'Purchased inventory on Murabaha for Mr. Muhammad Hamayoon Parwani', 40000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8e2bdbca-406f-4db7-9b5e-4259cbb22df9', '907255f6-16d0-4646-8c65-4569ab38dbbb', id, 'Purchased inventory on Murabaha for Mr. Muhammad Hamayoon Parwani', 0.00, 40000.00 FROM accounts WHERE account_code = '10208';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '35af3d34-1085-4f66-881e-6bfee1738cf2', '907255f6-16d0-4646-8c65-4569ab38dbbb', id, 'Purchased inventory on Murabaha for Mr. Musharaf Safi', 400000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '80ef69ee-752f-476f-873a-c2b0f8ed229b', '907255f6-16d0-4646-8c65-4569ab38dbbb', id, 'Purchased inventory on Murabaha for Mr. Muhibullah Momand', 95000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2fde7205-394d-4156-a098-d74eb4ce1f48', '907255f6-16d0-4646-8c65-4569ab38dbbb', id, 'Purchased inventory on Murabaha for 7 clients', 0.00, 495000.00 FROM accounts WHERE account_code = '10209';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f1cc98c0-61a4-4832-8cf4-281ebd86cfda', '907255f6-16d0-4646-8c65-4569ab38dbbb', id, '', 26000.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '12bf6191-cecb-4c83-888a-517733f69fad', '907255f6-16d0-4646-8c65-4569ab38dbbb', id, '', 0.00, 26000.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7db8c38e-9251-4762-9b3c-6bdc71459e24', '907255f6-16d0-4646-8c65-4569ab38dbbb', id, '', 11600.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'afd52cec-6562-49a5-ba7a-9cda610de294', '907255f6-16d0-4646-8c65-4569ab38dbbb', id, '', 0.00, 11600.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '72dcd1f8-ea11-4e74-a3b0-e670b6add52d', '907255f6-16d0-4646-8c65-4569ab38dbbb', id, '', 4470.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6e62931e-b6f9-4ac6-9951-8a6300b3ed73', '907255f6-16d0-4646-8c65-4569ab38dbbb', id, '', 0.00, 4470.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-1051
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6c913af3-cd10-4992-9180-537ae9171079', 'JE-001187', '2026-01-31', 'Fund transferred to Kunar for disbursement', 'JV-JV-1051', 'journal_entry', 438020.00, 438020.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f182a62f-7579-421d-8b52-5c6c57128626', '6c913af3-cd10-4992-9180-537ae9171079', id, 'Fund transferred to Kunar for disbursement', 410000.00, 0.00 FROM accounts WHERE account_code = '10209';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '33e35b91-af48-42ec-85bf-b65a4e7ab319', '6c913af3-cd10-4992-9180-537ae9171079', id, 'Fund transferred to Kunar for disbursement', 0.00, 410000.00 FROM accounts WHERE account_code = '10208';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8057ae81-db01-4dfc-aca4-416f878651ac', '6c913af3-cd10-4992-9180-537ae9171079', id, '', 4000.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '50f9efda-d734-482b-ad65-19e9b954170b', '6c913af3-cd10-4992-9180-537ae9171079', id, '', 0.00, 4000.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f1ad39ea-d42f-4895-8e39-e8e4b4624a94', '6c913af3-cd10-4992-9180-537ae9171079', id, '', 7000.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ba08c392-35f2-4c9e-b0b1-34d65987b118', '6c913af3-cd10-4992-9180-537ae9171079', id, '', 0.00, 7000.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ecf68fb7-91a8-48d3-9e86-8fd809bcf198', '6c913af3-cd10-4992-9180-537ae9171079', id, '', 11600.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5fce19ba-b198-41eb-9ae1-854a61ec94a2', '6c913af3-cd10-4992-9180-537ae9171079', id, '', 0.00, 11600.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '60f98ca3-ab48-4d2a-ba17-2cd0f71047d8', '6c913af3-cd10-4992-9180-537ae9171079', id, '', 5420.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '074794a2-eb51-4924-985d-747800d92009', '6c913af3-cd10-4992-9180-537ae9171079', id, '', 0.00, 5420.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-1052
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a6d7994f-c962-4ff6-aea6-1e8a995dbbf4', 'JE-001188', '2026-01-31', 'Bank charges for the month of Jan 2026', 'JV-JV-1052', 'journal_entry', 2255.83, 2255.83, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '16aa184e-a16a-48f2-a904-4b05a3694c85', 'a6d7994f-c962-4ff6-aea6-1e8a995dbbf4', id, 'Bank charges for the month of Jan 2026', 2255.83, 0.00 FROM accounts WHERE account_code = '61801';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0113bb5b-629f-4c7d-acd2-f215f653099b', 'a6d7994f-c962-4ff6-aea6-1e8a995dbbf4', id, 'Bank charges for the month of Jan 2026', 0.00, 658.33 FROM accounts WHERE account_code = '10201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '71972219-9eb6-4485-98c5-43852c37549f', 'a6d7994f-c962-4ff6-aea6-1e8a995dbbf4', id, 'Bank charges for the month of Jan 2026', 0.00, 250.00 FROM accounts WHERE account_code = '10202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '92920c2f-0a2e-42b1-8e3a-b0e862ef5e75', 'a6d7994f-c962-4ff6-aea6-1e8a995dbbf4', id, 'Bank charges for the month of Jan 2026', 0.00, 197.50 FROM accounts WHERE account_code = '10203';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '296767f8-6988-4566-97f9-9c89282c21d0', 'a6d7994f-c962-4ff6-aea6-1e8a995dbbf4', id, 'Bank charges for the month of Jan 2026', 0.00, 150.00 FROM accounts WHERE account_code = '10204';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1fcd6698-310a-47fa-850b-e86b5676520a', 'a6d7994f-c962-4ff6-aea6-1e8a995dbbf4', id, 'Bank charges for the month of Jan 2026', 0.00, 350.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6696c1e8-67ff-4529-a479-a5c04baea402', 'a6d7994f-c962-4ff6-aea6-1e8a995dbbf4', id, 'Bank charges for the month of Jan 2026', 0.00, 350.00 FROM accounts WHERE account_code = '10207';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2ba0d5f3-3090-4e55-9b2a-e1394466724a', 'a6d7994f-c962-4ff6-aea6-1e8a995dbbf4', id, 'Bank charges for the month of Jan 2026', 0.00, 100.00 FROM accounts WHERE account_code = '10208';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e0e09ec9-33c0-4f00-9895-8b6f5e1c17ef', 'a6d7994f-c962-4ff6-aea6-1e8a995dbbf4', id, 'Bank charges for the month of Jan 2026', 0.00, 100.00 FROM accounts WHERE account_code = '10209';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e4845cb-5f35-44a1-9d32-d9310d7bb9a1', 'a6d7994f-c962-4ff6-aea6-1e8a995dbbf4', id, 'Bank charges for the month of Jan 2026', 0.00, 100.00 FROM accounts WHERE account_code = '10210';

-- Entry: JV-1053
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7a23aa36-6ee3-4a67-96be-ff354939d890', 'JE-001189', '2026-01-31', 'Purchased inventory on Murabaha for Said Gul Sahil', 'JV-JV-1053', 'journal_entry', 395000.00, 395000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '77b741d0-59f2-4ea5-b4d2-f3bdb91cd071', '7a23aa36-6ee3-4a67-96be-ff354939d890', id, 'Purchased inventory on Murabaha for Said Gul Sahil', 90000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a34a6b24-e27b-4275-bf93-b7c5c54687ec', '7a23aa36-6ee3-4a67-96be-ff354939d890', id, 'Purchased inventory on Murabaha for Mr. Sherzaman Safi', 100000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '28916aff-18b3-4d83-b0ae-839324d86c49', '7a23aa36-6ee3-4a67-96be-ff354939d890', id, 'Purchased inventory on Murabaha for Mr. Bilal safi', 70000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c1658d98-62aa-4e86-b42f-f3571b9e96f0', '7a23aa36-6ee3-4a67-96be-ff354939d890', id, 'Purchased inventory on Murabaha for Mr. Attaurahman Safi', 120000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e8ea6c5d-a074-4d82-9e65-75ddec52cae5', '7a23aa36-6ee3-4a67-96be-ff354939d890', id, 'Cash Withdrawal for client disbursement', 15000.00, 0.00 FROM accounts WHERE account_code = '10104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dfb83d87-bb6d-42de-9eec-211c3969ace0', '7a23aa36-6ee3-4a67-96be-ff354939d890', id, 'Purchased inventory on Murabaha for 4 clients', 0.00, 395000.00 FROM accounts WHERE account_code = '10209';

-- Update account balances
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '10100';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN -27057320.18
  ELSE 27057320.18 END
WHERE account_code = '30100';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 30000.00
  ELSE -30000.00 END
WHERE account_code = '14000';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 510222.00
  ELSE -510222.00 END
WHERE account_code = '61001';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 62343.50
  ELSE -62343.50 END
WHERE account_code = '13100';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN -40722.00
  ELSE 40722.00 END
WHERE account_code = '21200';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 78476.00
  ELSE -78476.00 END
WHERE account_code = '60501';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 824554.00
  ELSE -824554.00 END
WHERE account_code = '17301';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 109301.00
  ELSE -109301.00 END
WHERE account_code = '61300';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 2620.00
  ELSE -2620.00 END
WHERE account_code = '60500';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 19800.00
  ELSE -19800.00 END
WHERE account_code = '61104';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 286690.00
  ELSE -286690.00 END
WHERE account_code = '60601';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 12440.00
  ELSE -12440.00 END
WHERE account_code = '60504';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 97260.00
  ELSE -97260.00 END
WHERE account_code = '60802';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 14250.00
  ELSE -14250.00 END
WHERE account_code = '60603';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 28550.00
  ELSE -28550.00 END
WHERE account_code = '80103';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 207613.00
  ELSE -207613.00 END
WHERE account_code = '17201';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 220971.00
  ELSE -220971.00 END
WHERE account_code = '17101';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 17050.00
  ELSE -17050.00 END
WHERE account_code = '61207';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 59468.00
  ELSE -59468.00 END
WHERE account_code = '61102';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 36820.00
  ELSE -36820.00 END
WHERE account_code = '61103';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 8500.00
  ELSE -8500.00 END
WHERE account_code = '61108';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 6200.00
  ELSE -6200.00 END
WHERE account_code = '60502';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 91375.00
  ELSE -91375.00 END
WHERE account_code = '61602';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 91458.00
  ELSE -91458.00 END
WHERE account_code = '61202';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 21560.00
  ELSE -21560.00 END
WHERE account_code = '60901';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 8220.00
  ELSE -8220.00 END
WHERE account_code = '60505';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 4340.00
  ELSE -4340.00 END
WHERE account_code = '60403';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 1250.00
  ELSE -1250.00 END
WHERE account_code = '60404';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 28170.00
  ELSE -28170.00 END
WHERE account_code = '60503';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 6000.00
  ELSE -6000.00 END
WHERE account_code = '60803';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 35342.00
  ELSE -35342.00 END
WHERE account_code = '60602';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 2700.00
  ELSE -2700.00 END
WHERE account_code = '80001';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 10910.00
  ELSE -10910.00 END
WHERE account_code = '60405';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 35797.00
  ELSE -35797.00 END
WHERE account_code = '61101';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 201228.05
  ELSE -201228.05 END
WHERE account_code = '61900';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN -50155.99
  ELSE 50155.99 END
WHERE account_code = '17202';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN -103436.65
  ELSE 103436.65 END
WHERE account_code = '17302';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN -37116.36
  ELSE 37116.36 END
WHERE account_code = '17102';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 3988159.00
  ELSE -3988159.00 END
WHERE account_code = '60001';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20151';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 111679.75
  ELSE -111679.75 END
WHERE account_code = '20152';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20153';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20154';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20155';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20156';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20157';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20158';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20160';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN -301581.00
  ELSE 301581.00 END
WHERE account_code = '21100';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20159';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN -30000.00
  ELSE 30000.00 END
WHERE account_code = '20161';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 117500.00
  ELSE -117500.00 END
WHERE account_code = '60406';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 5109.39
  ELSE -5109.39 END
WHERE account_code = '10201';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20162';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20163';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20164';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20165';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 22850.00
  ELSE -22850.00 END
WHERE account_code = '61605';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '12200';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 915000.00
  ELSE -915000.00 END
WHERE account_code = '12100';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 22996317.78
  ELSE -22996317.78 END
WHERE account_code = '11000';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN -3680154.11
  ELSE 3680154.11 END
WHERE account_code = '20900';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 6420.00
  ELSE -6420.00 END
WHERE account_code = '61002';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 6830.00
  ELSE -6830.00 END
WHERE account_code = '60804';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 5100.00
  ELSE -5100.00 END
WHERE account_code = '60703';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20168';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20166';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20167';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 142755.00
  ELSE -142755.00 END
WHERE account_code = '51200';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20169';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20170';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 37950.50
  ELSE -37950.50 END
WHERE account_code = '70000';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 282804.82
  ELSE -282804.82 END
WHERE account_code = '80102';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN -282804.82
  ELSE 282804.82 END
WHERE account_code = '18000';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 196013.00
  ELSE -196013.00 END
WHERE account_code = '10101';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 13522.00
  ELSE -13522.00 END
WHERE account_code = '61603';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 16574.65
  ELSE -16574.65 END
WHERE account_code = '61801';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 1950.00
  ELSE -1950.00 END
WHERE account_code = '10204';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 2046.13
  ELSE -2046.13 END
WHERE account_code = '10203';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 100.00
  ELSE -100.00 END
WHERE account_code = '60407';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 5900.00
  ELSE -5900.00 END
WHERE account_code = '51300';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 6960.00
  ELSE -6960.00 END
WHERE account_code = '20171';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 141600.00
  ELSE -141600.00 END
WHERE account_code = '61500';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 352457.45
  ELSE -352457.45 END
WHERE account_code = '17501';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20100';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 2000.00
  ELSE -2000.00 END
WHERE account_code = '61807';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 3700.00
  ELSE -3700.00 END
WHERE account_code = '60005';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 7000.00
  ELSE -7000.00 END
WHERE account_code = '61201';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20172';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20174';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20173';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20175';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 3654.00
  ELSE -3654.00 END
WHERE account_code = '80100';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN -10519.05
  ELSE 10519.05 END
WHERE account_code = '17502';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN -57623.78
  ELSE 57623.78 END
WHERE account_code = '50300';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 1002225.37
  ELSE -1002225.37 END
WHERE account_code = '10206';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 490.00
  ELSE -490.00 END
WHERE account_code = '60402';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 600.00
  ELSE -600.00 END
WHERE account_code = '51100';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN -21932.00
  ELSE 21932.00 END
WHERE account_code = '40500';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN -7961.45
  ELSE 7961.45 END
WHERE account_code = '61802';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20176';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 150000.00
  ELSE -150000.00 END
WHERE account_code = '60410';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 10000.00
  ELSE -10000.00 END
WHERE account_code = '10103';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 25000.00
  ELSE -25000.00 END
WHERE account_code = '10104';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 18430.00
  ELSE -18430.00 END
WHERE account_code = '10202';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 3250.00
  ELSE -3250.00 END
WHERE account_code = '61203';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20177';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 8000.00
  ELSE -8000.00 END
WHERE account_code = '51400';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 46400.00
  ELSE -46400.00 END
WHERE account_code = '60700';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 900.00
  ELSE -900.00 END
WHERE account_code = '60408';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 2996650.00
  ELSE -2996650.00 END
WHERE account_code = '10207';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN -6000000.00
  ELSE 6000000.00 END
WHERE account_code = '20121';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 9000.00
  ELSE -9000.00 END
WHERE account_code = '60002';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20178';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20179';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20180';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20181';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 0.00
  ELSE 0.00 END
WHERE account_code = '20182';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 232150.00
  ELSE -232150.00 END
WHERE account_code = '10208';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 19900.00
  ELSE -19900.00 END
WHERE account_code = '10209';
UPDATE accounts SET current_balance = 
  CASE WHEN account_type IN ('asset', 'expense') THEN 594900.00
  ELSE -594900.00 END
WHERE account_code = '10210';

COMMIT;
