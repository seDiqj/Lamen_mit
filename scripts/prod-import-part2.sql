BEGIN;
-- Entry: JV-393
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a6790bc5-cb90-4706-ba3f-6677ee0da6fc', 'JE-000401', '2025-07-27', 'Paid for lunch expenses', 'JV-JV-393', 'journal_entry', 490.00, 490.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '95f10da6-1f10-4388-b4a4-e55c37a5e166', 'a6790bc5-cb90-4706-ba3f-6677ee0da6fc', id, 'Paid for lunch expenses', 490.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ec8bd875-1c6b-4099-b2bd-e3767a82e2b8', 'a6790bc5-cb90-4706-ba3f-6677ee0da6fc', id, 'Paid for lunch expenses', 0.00, 490.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-394
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2dd37635-7520-465e-af89-b61bbc45b55a', 'JE-000402', '2025-07-27', 'Taxi used by Liaqat for delivery of documents to Jalalabad', 'JV-JV-394', 'journal_entry', 350.00, 350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '30c9315b-30c6-48de-85e7-3adc3c8c290d', '2dd37635-7520-465e-af89-b61bbc45b55a', id, 'Taxi used by Liaqat for delivery of documents to Jalalabad', 350.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '771617a8-d179-43db-9bef-cf3545ec265a', '2dd37635-7520-465e-af89-b61bbc45b55a', id, 'Taxi used by Liaqat for delivery of documents to Jalalabad', 0.00, 350.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-395
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('af0d4200-7799-40b9-a03a-1d513fdecbe0', 'JE-000403', '2025-07-28', 'Paid for the fuel for the power generator', 'JV-JV-395', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8a7a562c-ca77-4c17-b537-037d081bff5e', 'af0d4200-7799-40b9-a03a-1d513fdecbe0', id, 'Paid for the fuel for the power generator', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '23247120-f3c5-479e-9c42-18751355bb3b', 'af0d4200-7799-40b9-a03a-1d513fdecbe0', id, 'Paid for the fuel for the power generator', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-396
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0edc486e-5549-4b37-8533-7df93bf8f9dc', 'JE-000404', '2025-07-28', 'Paid the the staff lunch expenses', 'JV-JV-396', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4ca050c5-8bc7-4fd3-9a74-85833ee9912b', '0edc486e-5549-4b37-8533-7df93bf8f9dc', id, 'Paid the the staff lunch expenses', 500.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6b90e71e-e4b1-4c82-83dd-4a80f7c15f04', '0edc486e-5549-4b37-8533-7df93bf8f9dc', id, 'Paid the the staff lunch expenses', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-397
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cee63906-8119-4e4f-84e8-84eb59bedcf7', 'JE-000405', '2025-07-28', 'Paid for the drinking water', 'JV-JV-397', 'journal_entry', 240.00, 240.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '526ac6cc-4aa4-40c4-8156-722b3ed58c61', 'cee63906-8119-4e4f-84e8-84eb59bedcf7', id, 'Paid for the drinking water', 240.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aeb651a6-c3b0-469f-959d-4447642ee0bb', 'cee63906-8119-4e4f-84e8-84eb59bedcf7', id, 'Paid for the drinking water', 0.00, 240.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-398
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d8e2126e-870c-4c9f-9b60-a756a1e4233e', 'JE-000406', '2025-07-28', 'Paid for the purchase of photo paper for photo printing outside', 'JV-JV-398', 'journal_entry', 250.00, 250.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7ae92002-b0b9-4582-8eb6-5c0235fd8fe3', 'd8e2126e-870c-4c9f-9b60-a756a1e4233e', id, 'Paid for the purchase of photo paper for photo printing outside', 50.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fd7f1f62-6a77-4860-a793-4f9a8607cbc2', 'd8e2126e-870c-4c9f-9b60-a756a1e4233e', id, 'Taxi used by Faisal Achakzai to DAB for the documents delivery', 200.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b1dc7793-0c31-4836-8ffa-cb9e7e573948', 'd8e2126e-870c-4c9f-9b60-a756a1e4233e', id, 'Taxi used by Faisal Achakzai to DAB for the document''s delivery and purchase of photo paper', 0.00, 250.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-399
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cf2e5f05-099e-4b8e-8133-a4f8d5e9339d', 'JE-000407', '2025-07-28', 'Taxi Charges paid to Mustafa Khairkhwa to Street 7 Qala e Fathullah', 'JV-JV-399', 'journal_entry', 60.00, 60.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f25e72be-2aa5-4dd5-b512-3592b733e406', 'cf2e5f05-099e-4b8e-8133-a4f8d5e9339d', id, 'Taxi Charges paid to Mustafa Khairkhwa to Street 7 Qala e Fathullah', 60.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f5bf92ee-e589-4eb6-989c-15a5f710c413', 'cf2e5f05-099e-4b8e-8133-a4f8d5e9339d', id, 'Taxi Charges paid to Mustafa Khairkhwa to Street 7 Qala e Fathullah', 0.00, 60.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-400
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a09cf384-bc76-4cc2-a72b-7a4067f41701', 'JE-000408', '2025-07-29', 'Staff lunch expenses', 'JV-JV-400', 'journal_entry', 480.00, 480.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3970f2e7-389a-42db-bb7d-4046e755125b', 'a09cf384-bc76-4cc2-a72b-7a4067f41701', id, 'Staff lunch expenses', 480.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '24b11aae-3a28-4447-af59-0a2eed312438', 'a09cf384-bc76-4cc2-a72b-7a4067f41701', id, 'Staff lunch expenses', 0.00, 480.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-401
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('46ced1b4-53f0-4622-8dea-2bb5a1ecb12d', 'JE-000409', '2025-07-29', 'Taxi used by Mustafa to Street 7 Qalai Fathullah', 'JV-JV-401', 'journal_entry', 80.00, 80.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '78bce872-9251-48c8-9231-ebda6eb184c8', '46ced1b4-53f0-4622-8dea-2bb5a1ecb12d', id, 'Taxi used by Mustafa to Street 7 Qalai Fathullah', 80.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b656af1c-5f46-4558-8cf8-aaad176a1fca', '46ced1b4-53f0-4622-8dea-2bb5a1ecb12d', id, 'Taxi used by Mustafa to Street 7 Qalai Fathullah', 0.00, 80.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-402
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ec448a29-eb7b-4fc0-accf-4a4a5541fd37', 'JE-000410', '2025-07-29', 'Taxi used by CFO to MTO office for tax clearance', 'JV-JV-402', 'journal_entry', 200.00, 200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f2fa0443-92fd-449f-a712-1b8d65bd5779', 'ec448a29-eb7b-4fc0-accf-4a4a5541fd37', id, 'Taxi used by CFO to MTO office for tax clearance', 200.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '81771c65-e6d9-410d-9e82-d0cfb160cd3f', 'ec448a29-eb7b-4fc0-accf-4a4a5541fd37', id, 'Taxi used by CFO to MTO office for tax clearance', 0.00, 200.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-403
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('12e84b98-d424-4c58-8309-53fb32f6119d', 'JE-000411', '2025-07-29', 'Taxi used by Faisal Achakzai for the delivery of documents to DAB', 'JV-JV-403', 'journal_entry', 120.00, 120.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8850787a-ef48-4a26-a6b5-8835c3db02a2', '12e84b98-d424-4c58-8309-53fb32f6119d', id, 'Taxi used by Faisal Achakzai for the delivery of documents to DAB', 120.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8477bccf-423b-44b9-af94-e3e7d4d508ab', '12e84b98-d424-4c58-8309-53fb32f6119d', id, 'Taxi used by Faisal Achakzai for the delivery of documents to DAB', 0.00, 120.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-404
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b5fb785d-98c9-4116-90ba-89f206cd479d', 'JE-000412', '2025-07-30', 'Cash Received CR#40 for loan disbursement to two clients', 'JV-JV-404', 'journal_entry', 80200.00, 80200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a5ddd10d-554b-43ea-b8e0-b639497d8b88', 'b5fb785d-98c9-4116-90ba-89f206cd479d', id, 'Cash Received CR#40 for loan disbursement to two clients', 80200.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '576dd624-0ebb-4997-80db-3aeaa5997f95', 'b5fb785d-98c9-4116-90ba-89f206cd479d', id, 'Cash Received CR#40 for loan disbursement to two clients', 0.00, 80200.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-406
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f2c2fa25-40d2-4173-ba5c-712036e7dc6f', 'JE-000413', '2025-07-30', 'Staff lunch expenses', 'JV-JV-406', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6b3c4f25-3ac0-40eb-8e7d-55289d6d389d', 'f2c2fa25-40d2-4173-ba5c-712036e7dc6f', id, 'Staff lunch expenses', 300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '323b1542-e79f-424d-81cb-83d7e0bcb776', 'f2c2fa25-40d2-4173-ba5c-712036e7dc6f', id, 'Staff lunch expenses', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-407
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('df3a67c0-e0bb-4fbf-887b-f9fcbdcdb407', 'JE-000414', '2025-07-30', 'Water spray pump for flowers', 'JV-JV-407', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6f6e4fd5-5a10-4103-99bd-472e94cac0e2', 'df3a67c0-e0bb-4fbf-887b-f9fcbdcdb407', id, 'Water spray pump for flowers', 100.00, 0.00 FROM accounts WHERE account_code = '60407';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e3f1664a-a29f-4e30-a705-b1c834138c2a', 'df3a67c0-e0bb-4fbf-887b-f9fcbdcdb407', id, 'Water spray pump for flowers', 0.00, 100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-408
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('102965d3-157b-4588-9563-d649da53cbc1', 'JE-000415', '2025-07-30', 'Liquid Gas for cooking', 'JV-JV-408', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f2fb9fb9-15ef-42b9-852f-0f8c11367446', '102965d3-157b-4588-9563-d649da53cbc1', id, 'Liquid Gas for cooking', 500.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e16da285-128b-4b20-8eec-63dec7707eed', '102965d3-157b-4588-9563-d649da53cbc1', id, 'Liquid Gas for cooking', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-409
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('55c48ac5-8ee0-4b8e-bfd8-f114b81015d7', 'JE-000416', '2025-07-30', 'Power generator Fuel', 'JV-JV-409', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '839e27ff-4bf9-4375-a656-2fbd8c546056', '55c48ac5-8ee0-4b8e-bfd8-f114b81015d7', id, 'Power generator Fuel', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5fb28ff1-9d90-40e3-9069-e30c066e9d42', '55c48ac5-8ee0-4b8e-bfd8-f114b81015d7', id, 'Power generator Fuel', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-405
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0e1ae3d0-c3fb-47f1-a374-89abe111467e', 'JE-000417', '2025-07-30', 'Cash Advance paid to Shahpoor Khan for clients'' Disbursement', 'JV-JV-405', 'journal_entry', 80200.00, 80200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6cbe4bef-9551-4a77-a850-34ecf1ead792', '0e1ae3d0-c3fb-47f1-a374-89abe111467e', id, 'Cash Advance paid to Shahpoor Khan for clients'' Disbursement', 80000.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ff0c1db9-c989-49ae-83ba-5638828237ac', '0e1ae3d0-c3fb-47f1-a374-89abe111467e', id, 'Cash transfer charges', 200.00, 0.00 FROM accounts WHERE account_code = '51300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4004f2ea-8101-4035-a012-408d1b32462b', '0e1ae3d0-c3fb-47f1-a374-89abe111467e', id, 'Cash Advance paid to Shahpoor Khan for clients'' Disbursements and Cash transfer charges', 0.00, 80200.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-410
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('79aca16a-a92c-4d13-a98f-c0087128070f', 'JE-000418', '2025-07-31', 'Paid for cooking oil', 'JV-JV-410', 'journal_entry', 550.00, 550.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '285aaeca-03c3-42bd-9248-e70e31e2bfe7', '79aca16a-a92c-4d13-a98f-c0087128070f', id, 'Paid for cooking oil', 550.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e891f2ce-c43e-4e1b-b6b1-566160a1251c', '79aca16a-a92c-4d13-a98f-c0087128070f', id, 'Paid for cooking oil', 0.00, 550.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-411
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c9537b0c-07ea-4493-83aa-529819e15f37', 'JE-000419', '2025-07-31', 'Paid for lunch to Hanifullah for lunch with MISFA', 'JV-JV-411', 'journal_entry', 1100.00, 1100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '26f93ad3-bfd2-49b7-86f5-edeb56921bf5', 'c9537b0c-07ea-4493-83aa-529819e15f37', id, 'Paid for lunch to Hanifullah for lunch with MISFA', 1100.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0bf49d41-dc7f-40de-bdea-fdcbc4233739', 'c9537b0c-07ea-4493-83aa-529819e15f37', id, 'Paid for lunch to Hanifullah for lunch with MISFA', 0.00, 1100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-412
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0fad9cf1-9718-42b9-9207-96a6489e610f', 'JE-000420', '2025-07-31', 'Cash Received CR# 43 for salary payment to Liaqat', 'JV-JV-412', 'journal_entry', 20848.68, 20848.68, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '80ae70c7-6d6a-4023-bc24-b6c73fc3e856', '0fad9cf1-9718-42b9-9207-96a6489e610f', id, 'Cash Received CR# 43 for salary payment to Liaqat', 6960.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6255233e-a990-4bb8-840a-b1ed1a5bf102', '0fad9cf1-9718-42b9-9207-96a6489e610f', id, 'Cash Received CR# 43 for salary payment to Liaqat', 0.00, 6960.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '47d3fcfe-24df-4cbc-980a-33df105a2042', '0fad9cf1-9718-42b9-9207-96a6489e610f', id, 'Depreciation expense occurred in the month of July 2025', 13888.68, 0.00 FROM accounts WHERE account_code = '61900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd3ffea5f-dfc2-4011-a2a4-d86c6bb46b3c', '0fad9cf1-9718-42b9-9207-96a6489e610f', id, 'Depreciation expense occurred in the month of July 2025', 0.00, 4256.17 FROM accounts WHERE account_code = '17202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1d2c0e4d-a7f2-4002-846d-1470c8d4a9cf', '0fad9cf1-9718-42b9-9207-96a6489e610f', id, 'Depreciation expense occurred in the month of July 2025', 0.00, 6857.04 FROM accounts WHERE account_code = '17302';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '64611f11-6b23-4e77-b91d-80052ab12f83', '0fad9cf1-9718-42b9-9207-96a6489e610f', id, 'Depreciation expense occurred in the month of July 2025', 0.00, 2775.47 FROM accounts WHERE account_code = '17102';

-- Entry: JV-413
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4c855bc5-db68-467b-8f3e-af76dee3db71', 'JE-000421', '2025-07-31', 'Financing Officer Salary for the month of July 2025 (Abdul Shakoor and Faisal Achakzai)', 'JV-JV-413', 'journal_entry', 371736.00, 371736.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0867ba5e-13bf-41d8-97da-bad5c6901fe2', '4c855bc5-db68-467b-8f3e-af76dee3db71', id, 'Financing Officer Salary for the month of July 2025 (Abdul Shakoor and Faisal Achakzai)', 13500.00, 0.00 FROM accounts WHERE account_code = '51200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '34dda0d9-c05e-4774-af8e-d63286f46c56', '4c855bc5-db68-467b-8f3e-af76dee3db71', id, 'Salary Payable for the month of July 2025', 358236.00, 0.00 FROM accounts WHERE account_code = '60001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a6df431c-5d10-4525-aef1-4e271ce3c72a', '4c855bc5-db68-467b-8f3e-af76dee3db71', id, 'Salary Payable for the month of July 2025', 0.00, 150000.00 FROM accounts WHERE account_code = '20169';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '91d1a36a-868d-4640-8c49-204b10b6dc52', '4c855bc5-db68-467b-8f3e-af76dee3db71', id, 'Salary Payable for the month of July 2025', 0.00, 28100.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '24b09ef0-f6c9-4c6c-91a0-c121273b868c', '4c855bc5-db68-467b-8f3e-af76dee3db71', id, 'Salary Payable for the month of July 2025', 0.00, 37100.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ae4f0a45-9f34-4572-80a4-587b45f91c2f', '4c855bc5-db68-467b-8f3e-af76dee3db71', id, 'Salary Payable for the month of July 2025', 0.00, 37100.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5adf0c0d-b439-46e9-8076-01905617f91d', '4c855bc5-db68-467b-8f3e-af76dee3db71', id, 'Salary Payable for the month of July 2025', 0.00, 30000.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '612108cf-212d-4d3d-98bb-d8353ff3d907', '4c855bc5-db68-467b-8f3e-af76dee3db71', id, 'Salary Payable for the month of July 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1424f1a4-b334-49c0-b386-bc2b6fbc9411', '4c855bc5-db68-467b-8f3e-af76dee3db71', id, 'Salary Payable for the month of July 2025 (5100 Advance ajdustment)', 0.00, 6960.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '83e3a08f-3778-4e3f-a759-7f39472da458', '4c855bc5-db68-467b-8f3e-af76dee3db71', id, 'Salary Payable for the month of July 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ec1ec862-90f0-40b2-a765-b49c22a183d1', '4c855bc5-db68-467b-8f3e-af76dee3db71', id, 'Salary Payable for the month of July 2025 (1000 advance adjustment)', 0.00, 5980.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '58d160fc-451b-46e7-8f8d-e6928ec59753', '4c855bc5-db68-467b-8f3e-af76dee3db71', id, 'Salary Payable for the month of July 2025 ( 4,500 advance adjustment)', 0.00, 7450.00 FROM accounts WHERE account_code = '20167';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c6a45445-2167-4034-a462-6e048245eac1', '4c855bc5-db68-467b-8f3e-af76dee3db71', id, 'Salary Payable for the month of July 2025 ( 4,500 advance adjustment)', 0.00, 7450.00 FROM accounts WHERE account_code = '20166';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f3a3dd67-80bc-4db3-b3f5-e1ddde1d2d12', '4c855bc5-db68-467b-8f3e-af76dee3db71', id, 'Salary Payable for the month of July 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20170';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4aee395d-7949-4553-abf9-c5f46062a45a', '4c855bc5-db68-467b-8f3e-af76dee3db71', id, 'Salary Payable for the month of July 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20171';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '73a57e50-d3e3-41b4-afde-0c61f5e8b322', '4c855bc5-db68-467b-8f3e-af76dee3db71', id, 'Salary tax Payable for the month of July 2025', 0.00, 33756.00 FROM accounts WHERE account_code = '21100';

-- Entry: JV-414
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8b1af3c9-b637-447e-b524-78af853a7701', 'JE-000422', '2025-07-31', 'Cash paid to Liaqat for July 2025 salary', 'JV-JV-414', 'journal_entry', 6960.00, 6960.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0364aac5-750a-4ddf-af0a-dc8d7d1b1f8f', '8b1af3c9-b637-447e-b524-78af853a7701', id, 'Cash paid to Liaqat for July 2025 salary', 6960.00, 0.00 FROM accounts WHERE account_code = '20171';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '72ac7b79-85e5-4d6c-9338-27b9df74d6f7', '8b1af3c9-b637-447e-b524-78af853a7701', id, 'Cash paid to Liaqat for July 2025 salary', 0.00, 6960.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-415
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('76e804dc-d864-4c1a-bd3a-9da6a02d9edc', 'JE-000423', '2025-08-01', 'Purchased Sewing and Tailoring materials to Hosain Pari on Murabaha', 'JV-JV-415', 'journal_entry', 30030.00, 30030.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '95ba36f2-0547-4c11-a5b3-2e961a7f9a09', '76e804dc-d864-4c1a-bd3a-9da6a02d9edc', id, 'Purchased Sewing and Tailoring materials to Hosain Pari on Murabaha', 30030.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd347d77f-b972-4251-9fe0-849157fb9421', '76e804dc-d864-4c1a-bd3a-9da6a02d9edc', id, 'Purchased Sewing and Tailoring materials to Hosain Pari on Murabaha', 0.00, 30030.00 FROM accounts WHERE account_code = '20152';

-- Entry: JV-416
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('09dd262d-4e2a-4d4c-9e05-e62b701ed926', 'JE-000424', '2025-08-01', 'Purchased Spare parts for Haqiqat Amirzai on Murabaha', 'JV-JV-416', 'journal_entry', 41450.40, 41450.40, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9aa8c574-ee8c-4e9e-8e9e-c02743ef5fc7', '09dd262d-4e2a-4d4c-9e05-e62b701ed926', id, 'Purchased Spare parts for Haqiqat Amirzai on Murabaha', 41450.40, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '466803bb-8bf6-4094-876a-9c61381bff97', '09dd262d-4e2a-4d4c-9e05-e62b701ed926', id, 'Purchased Spare parts for Haqiqat Amirzai on Murabaha', 0.00, 41450.40 FROM accounts WHERE account_code = '20152';

-- Entry: JV-417
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0ab73c93-85b6-4385-b5c8-e113ef5854be', 'JE-000425', '2025-08-01', 'Lunch Expense for HQ Gurards on friday', 'JV-JV-417', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0cabf0c8-c639-4961-85f4-f3f950a6c098', '0ab73c93-85b6-4385-b5c8-e113ef5854be', id, 'Lunch Expense for HQ Gurards on friday', 300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ca22bcda-bcb8-4136-b16a-75840ed5c005', '0ab73c93-85b6-4385-b5c8-e113ef5854be', id, 'Lunch Expense for HQ Gurards on friday', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-418
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('aa03ebe8-1c9e-400a-801e-20bdc8341b83', 'JE-000426', '2025-08-01', 'Purchased charging fan for the CEO office', 'JV-JV-418', 'journal_entry', 450.00, 450.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '639d7bbe-b406-4396-a134-7c268bdafbfc', 'aa03ebe8-1c9e-400a-801e-20bdc8341b83', id, 'Purchased charging fan for the CEO office', 450.00, 0.00 FROM accounts WHERE account_code = '80103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ef224c54-6ad6-45ef-9731-bec3cfae9c1b', 'aa03ebe8-1c9e-400a-801e-20bdc8341b83', id, 'Purchased charging fan for the CEO office', 0.00, 450.00 FROM accounts WHERE account_code = '10101';

-- Entry: LCI009
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('63f5836c-4ab0-4c28-be49-8d1e09a502c3', 'JE-000427', '2025-08-01', 'Purchased sewing and tailoring materials for female clothing dress', 'JV-LCI009', 'financing_disbursement', 35435.40, 35435.40, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b3f95ef8-1db6-4f08-9dd3-5a2dc626572d', '63f5836c-4ab0-4c28-be49-8d1e09a502c3', id, 'Purchased sewing and tailoring materials for female clothing dress', 35435.40, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '874407fe-703a-47e6-b55e-a31c5ca8ba35', '63f5836c-4ab0-4c28-be49-8d1e09a502c3', id, 'Purchased sewing and tailoring materials for female clothing dress', 0.00, 30030.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'be057a66-241f-4cb6-9e3b-c1b0f01500ff', '63f5836c-4ab0-4c28-be49-8d1e09a502c3', id, 'Purchased sewing and tailoring materials for female clothing dress', 0.00, 5405.40 FROM accounts WHERE account_code = '20900';

-- Entry: LCI010
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bacccb27-46a2-4bdc-af79-88f3a06d46d3', 'JE-000428', '2025-08-01', 'Purchased vehicle spare parts for Haqiqat Amirzai on Murabaha loan', 'JV-LCI010', 'financing_disbursement', 48911.47, 48911.47, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9a7b8f3e-fe1f-4f72-aa64-5e5452686d97', 'bacccb27-46a2-4bdc-af79-88f3a06d46d3', id, 'Purchased vehicle spare parts for Haqiqat Amirzai on Murabaha loan', 48911.47, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7f3361e0-9265-4ed5-90de-15ca4715944c', 'bacccb27-46a2-4bdc-af79-88f3a06d46d3', id, 'Purchased vehicle spare parts for Haqiqat Amirzai on Murabaha loan', 0.00, 41450.40 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b1bbb399-a596-43bf-a234-75726a7e8763', 'bacccb27-46a2-4bdc-af79-88f3a06d46d3', id, 'Cost occurred on purchased product on loan for customers', 0.00, 7461.07 FROM accounts WHERE account_code = '20900';

-- Entry: JV-419
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9a1a238c-d9a7-4465-810b-bcadf4153872', 'JE-000429', '2025-08-02', 'Purcashed Rod and materials for the curtain', 'JV-JV-419', 'journal_entry', 410.00, 410.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '99d800d5-6b5c-473b-9c89-e4c228088fb6', '9a1a238c-d9a7-4465-810b-bcadf4153872', id, 'Purcashed Rod and materials for the curtain', 410.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5da47aa7-562d-4b46-8579-3f66c7796536', '9a1a238c-d9a7-4465-810b-bcadf4153872', id, 'Purcashed Rod and materials for the curtain', 0.00, 410.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-420
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('26dd4c8e-26f5-4957-8170-e250c90aba19', 'JE-000430', '2025-08-02', 'Paid for one tanker water for the office use', 'JV-JV-420', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4b6c25be-4025-4dd6-bc4b-6fdbe1926d88', '26dd4c8e-26f5-4957-8170-e250c90aba19', id, 'Paid for one tanker water for the office use', 1000.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ff13cbbb-6a5a-43f4-aa03-063a054653ba', '26dd4c8e-26f5-4957-8170-e250c90aba19', id, 'Paid for one tanker water for the office use', 0.00, 1000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-421
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d96e53a4-0c71-4886-b25b-2f399147e382', 'JE-000431', '2025-08-02', 'Paid for lunch expense and tissue paper', 'JV-JV-421', 'journal_entry', 260.00, 260.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4f8af254-707d-4d18-b235-648bd2f68ac5', 'd96e53a4-0c71-4886-b25b-2f399147e382', id, 'Paid for lunch expense and tissue paper', 260.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b5d576f9-5c17-4dd7-b0cc-0bc5ccd084bf', 'd96e53a4-0c71-4886-b25b-2f399147e382', id, 'Paid for lunch expense and tissue paper', 0.00, 260.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-422
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8dcfa52a-b2b9-4cf9-bb62-6908bc109a52', 'JE-000432', '2025-08-02', 'Cash Received CR# 44 for load disbursement in Kunar', 'JV-JV-422', 'journal_entry', 110400.00, 110400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9a2233de-ed44-4c6b-9f69-5794caae778e', '8dcfa52a-b2b9-4cf9-bb62-6908bc109a52', id, 'Cash Received CR# 44 for load disbursement in Kunar', 110400.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4cc7bceb-4719-461c-bb30-5aaf5a129947', '8dcfa52a-b2b9-4cf9-bb62-6908bc109a52', id, 'Paid for lunch expense and tissue paper', 0.00, 110400.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-423
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b66622cd-49df-402e-9abe-c97f7679f0e6', 'JE-000433', '2025-08-02', 'Advance paid to Shapoor for Kunar branch for clients disbursements.', 'JV-JV-423', 'journal_entry', 110400.00, 110400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '45a64fb4-2c9b-4cee-8916-fd285f3ff8db', 'b66622cd-49df-402e-9abe-c97f7679f0e6', id, 'Advance paid to Shapoor for Kunar branch for clients disbursements.', 100000.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7e40b928-66ab-4374-bf14-d551d64a0cd5', 'b66622cd-49df-402e-9abe-c97f7679f0e6', id, 'Cash transfer costs', 350.00, 0.00 FROM accounts WHERE account_code = '51300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0cd351e4-b5e6-4ce1-8fc8-f6a3b4b204cd', 'b66622cd-49df-402e-9abe-c97f7679f0e6', id, 'Advance paid to Shapoor for Kunar branch for clients disbursements. and Cash transfer costs', 0.00, 100350.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '09999521-25b3-4d29-870e-c957572e4548', 'b66622cd-49df-402e-9abe-c97f7679f0e6', id, 'Advance paid to Shapoor for Kunar branch expeses', 10000.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '303cc209-aeaa-4c4d-a5fc-08456b932852', 'b66622cd-49df-402e-9abe-c97f7679f0e6', id, 'Cash transfer charges', 50.00, 0.00 FROM accounts WHERE account_code = '51300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '10dec34e-acf4-4898-b985-5d4c4fb23188', 'b66622cd-49df-402e-9abe-c97f7679f0e6', id, 'Cash transfer charges', 0.00, 10050.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-424
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b84b5020-352e-4944-9a2c-28e8d61d942e', 'JE-000434', '2025-08-02', 'Cash Received CR# 41 for Jalalabad expense payments', 'JV-JV-424', 'journal_entry', 29310.00, 29310.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '715db0d3-d64d-4dcb-bfae-8a4bfd1240a8', 'b84b5020-352e-4944-9a2c-28e8d61d942e', id, 'Cash Received CR# 41 for Jalalabad expense payments', 29310.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '083c4cdd-f3f7-44ff-aa55-2bd2ef10be0f', 'b84b5020-352e-4944-9a2c-28e8d61d942e', id, 'Cash Received CR# 41 for Jalalabad expense payments', 0.00, 29310.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-425
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('dd279db1-b113-440c-b07d-82de72245540', 'JE-000435', '2025-08-02', 'Purchased 8 meter carpet and foam for the Jalalabad branch.', 'JV-JV-425', 'journal_entry', 79310.00, 79310.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1f27dbd7-9035-4fb3-9f91-7775985a6704', 'dd279db1-b113-440c-b07d-82de72245540', id, 'Purchased 8 meter carpet and foam for the Jalalabad branch.', 4720.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '89d6bcab-0afe-4d33-9efc-2cda75813bbf', 'dd279db1-b113-440c-b07d-82de72245540', id, 'Purchased 2 office chairs.', 3000.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9eb8a9f3-0e64-4133-a7d1-c6948f0e5bb5', 'dd279db1-b113-440c-b07d-82de72245540', id, 'Purchased one set sofa, to office tables, 2 office cabinets and transportation charges.', 20400.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ba60e9e9-cec5-4393-a8a7-05cd19348392', 'dd279db1-b113-440c-b07d-82de72245540', id, 'Paid for the office painting.', 790.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '91a89829-b8d9-447e-970a-6d87354dc379', 'dd279db1-b113-440c-b07d-82de72245540', id, 'Paid for one month office expense of the branch staff.', 2300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd817ad24-bd52-4ae3-8da4-1e437a1dedb9', 'dd279db1-b113-440c-b07d-82de72245540', id, 'Purchased one office chair made in Korya', 1500.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bb436393-d5a9-4a10-b1cd-8ba365976ea9', 'dd279db1-b113-440c-b07d-82de72245540', id, 'Paid for one set sofa for the branch use.', 10000.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a44bab70-f5df-4ce5-ba9d-0c8a35639fc5', 'dd279db1-b113-440c-b07d-82de72245540', id, 'Paid for bulbs for the branch lighting', 600.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8fcdef57-348d-4116-bae2-726c48392a01', 'dd279db1-b113-440c-b07d-82de72245540', id, 'Paid for the three months office rent (Jawza, Saratan and Assad 1404)', 21000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9d5c0615-42ef-485a-a656-2f2efd6b8857', 'dd279db1-b113-440c-b07d-82de72245540', id, 'paid for printing the stickers for the branch', 12400.00, 0.00 FROM accounts WHERE account_code = '61602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dfcb76bf-86d2-419c-aa84-c79f4bda9f64', 'dd279db1-b113-440c-b07d-82de72245540', id, 'Paid for taxi for the delivery of materials', 600.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6b0dc834-35ce-4ec5-82b2-2857d1392e6d', 'dd279db1-b113-440c-b07d-82de72245540', id, 'Paid wages for the painting', 1000.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2f572970-3fe7-435f-ac5b-6fc1b50a2d27', 'dd279db1-b113-440c-b07d-82de72245540', id, 'Paid for the broken glasses', 1000.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dc05b9da-4c26-407d-996f-071e34cca57f', 'dd279db1-b113-440c-b07d-82de72245540', id, 'Adjusted advance payment (JV - 197)', 0.00, 50000.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f6b2e438-9c1a-4196-b54e-28b3c4ffcacc', 'dd279db1-b113-440c-b07d-82de72245540', id, 'Paid for the Jalalabad multiple expenses while branch opening.', 0.00, 29310.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-426
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2e0e86c4-df18-4b57-b034-812dc6eb7602', 'JE-000436', '2025-08-03', 'Paid for the washing of Mattress and pillow covers', 'JV-JV-426', 'journal_entry', 400.00, 400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3748443b-febe-4eb3-81af-f4cc9d33f7ca', '2e0e86c4-df18-4b57-b034-812dc6eb7602', id, 'Paid for the washing of Mattress and pillow covers', 400.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b70de783-a5fe-469b-9567-a121aafc97bd', '2e0e86c4-df18-4b57-b034-812dc6eb7602', id, 'Paid for the washing of Mattress and pillow covers', 0.00, 400.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-427
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bf96827c-806a-4b72-b2ec-d2ce21b3f816', 'JE-000437', '2025-08-03', 'Cash Received CR# 47 for salary payment to BOS members for the first quarter (Jan, Feb, and Mar 2025)', 'JV-JV-427', 'journal_entry', 70800.00, 70800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a33f9330-1256-48fe-9de4-c43715fe00cc', 'bf96827c-806a-4b72-b2ec-d2ce21b3f816', id, 'Cash Received CR# 47 for salary payment to BOS members for the first quarter (Jan, Feb, and Mar 2025)', 70800.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4dcef5be-7715-4d6f-9af1-b867705b2708', 'bf96827c-806a-4b72-b2ec-d2ce21b3f816', id, 'Cash Received CR# 47 for salary payment to BOS members for the first quarter (Jan, Feb, and Mar 2025)', 0.00, 70800.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-428
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5bc0013a-5096-452c-beb3-d627dddf1274', 'JE-000438', '2025-08-03', 'First Quarter 2025 fee paid to BOM( Ahmad Wali Alokozay, Shagar Rahimi, and Nawab Stanikzai)', 'JV-JV-428', 'journal_entry', 70800.00, 70800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '213ec0f7-33ad-4fc7-9b1d-0c38174c00c4', '5bc0013a-5096-452c-beb3-d627dddf1274', id, 'First Quarter 2025 fee paid to BOM( Ahmad Wali Alokozay, Shagar Rahimi, and Nawab Stanikzai)', 70800.00, 0.00 FROM accounts WHERE account_code = '61500';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a1a50fd7-46a3-4485-8400-5ba4ec1a0c42', '5bc0013a-5096-452c-beb3-d627dddf1274', id, 'First Quarter 2025 fee paid to BOM( Ahmad Wali Alokozay, Shagar Rahimi, and Nawab Stanikzai)', 0.00, 23600.00 FROM accounts WHERE account_code = '20162';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9a94ca35-952b-4679-945b-a8d4b1d82f5a', '5bc0013a-5096-452c-beb3-d627dddf1274', id, 'First Quarter 2025 fee paid to BOM( Ahmad Wali Alokozay, Shagar Rahimi, and Nawab Stanikzai)', 0.00, 23600.00 FROM accounts WHERE account_code = '20163';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e00fa753-f0da-4d7b-8067-279dea2dde0c', '5bc0013a-5096-452c-beb3-d627dddf1274', id, 'First Quarter 2025 fee paid to BOM( Ahmad Wali Alokozay, Shagar Rahimi, and Nawab Stanikzai)', 0.00, 23600.00 FROM accounts WHERE account_code = '20164';

-- Entry: JV-429
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('98e00e7a-d87f-41ba-bd3a-cbba00400004', 'JE-000439', '2025-08-03', 'First Quarter 2025 fee paid to Ahmad Wali Alokozay', 'JV-JV-429', 'journal_entry', 70800.00, 70800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '50d759e5-ef0a-47ae-a6cd-3858dfe96abf', '98e00e7a-d87f-41ba-bd3a-cbba00400004', id, 'First Quarter 2025 fee paid to Ahmad Wali Alokozay', 23600.00, 0.00 FROM accounts WHERE account_code = '20162';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd73bb954-8280-4177-b2bd-35f0ff64f398', '98e00e7a-d87f-41ba-bd3a-cbba00400004', id, 'First Quarter 2025 fee paid to Sangar Rahimi', 23600.00, 0.00 FROM accounts WHERE account_code = '20163';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '095ff693-1f58-455c-897a-dc9d7c5bcfbb', '98e00e7a-d87f-41ba-bd3a-cbba00400004', id, 'First Quarter 2025 fee paid to Nawab Stanikzai', 23600.00, 0.00 FROM accounts WHERE account_code = '20164';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e14477b4-efb3-4e9a-870c-c4ffd45adc40', '98e00e7a-d87f-41ba-bd3a-cbba00400004', id, 'First Quarter 2025 fee paid to Ahmad Wali Alokozai, Sangar Rahimi and Nawab Stanikzai', 0.00, 70800.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-430
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a2d8e63c-9618-4912-a808-1ce65e718389', 'JE-000440', '2025-08-03', 'BoS  member''s salary payable for the month of June 2025', 'JV-JV-430', 'journal_entry', 70800.00, 70800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6ab48759-2539-4e02-8bbb-f23f40191d05', 'a2d8e63c-9618-4912-a808-1ce65e718389', id, 'BoS  member''s salary payable for the month of June 2025', 70800.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4fd2ce8e-9c4e-4e75-9be3-8debf805457b', 'a2d8e63c-9618-4912-a808-1ce65e718389', id, 'BoS  member''s salary payable for the month of June 2025', 0.00, 70800.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-431
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2c94082a-6d20-484f-a229-5f7827e82b79', 'JE-000441', '2025-08-03', 'Cash Received CR# 48 for salary payment to BOS members for the Second quarter (Apr, May, and Jun 2025)', 'JV-JV-431', 'journal_entry', 70800.00, 70800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '801d3f38-fa8b-409d-a874-d833b88dc9c7', '2c94082a-6d20-484f-a229-5f7827e82b79', id, 'Cash Received CR# 48 for salary payment to BOS members for the Second quarter (Apr, May, and Jun 2025)', 70800.00, 0.00 FROM accounts WHERE account_code = '61500';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8f94ebc4-7f66-4730-a843-e4cfe2da1a98', '2c94082a-6d20-484f-a229-5f7827e82b79', id, 'Cash Received CR# 48 for salary payment to BOS members for the Second quarter (Apr, May, and Jun 2025)', 0.00, 23600.00 FROM accounts WHERE account_code = '20162';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'add76537-b89d-4210-af86-568f48b63eda', '2c94082a-6d20-484f-a229-5f7827e82b79', id, 'Cash Received CR# 48 for salary payment to BOS members for the Second quarter (Apr, May, and Jun 2025)', 0.00, 23600.00 FROM accounts WHERE account_code = '20163';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e2bba147-f9b9-4549-b945-8d1c58cf2e13', '2c94082a-6d20-484f-a229-5f7827e82b79', id, 'Cash Received CR# 48 for salary payment to BOS members for the Second quarter (Apr, May, and Jun 2025)', 0.00, 23600.00 FROM accounts WHERE account_code = '20164';

-- Entry: JV-432
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a8d047a0-dc4c-4667-97f6-8ed87efa350f', 'JE-000442', '2025-08-03', 'Second Quarter 2025 salary paid to Ahmad Wali Alokozay', 'JV-JV-432', 'journal_entry', 70800.00, 70800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3b129b76-6cb2-4164-8371-afab7da207c4', 'a8d047a0-dc4c-4667-97f6-8ed87efa350f', id, 'Second Quarter 2025 salary paid to Ahmad Wali Alokozay', 23600.00, 0.00 FROM accounts WHERE account_code = '20162';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3fd63c1c-0f1b-4387-9d95-47864d53a54d', 'a8d047a0-dc4c-4667-97f6-8ed87efa350f', id, 'Second Quarter 2025 salary paid to Sangar Rahimi', 23600.00, 0.00 FROM accounts WHERE account_code = '20163';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9d4dfe0e-2fdd-4764-8d3f-efc5d5789b58', 'a8d047a0-dc4c-4667-97f6-8ed87efa350f', id, 'Second Quarter 2025 salary paid to Nawab Stanikzai', 23600.00, 0.00 FROM accounts WHERE account_code = '20164';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6fcb6ff3-ad77-4c48-9327-16fe76993735', 'a8d047a0-dc4c-4667-97f6-8ed87efa350f', id, 'Second Quarter 2025 salary paid to Ahmad Wali Alokozay, Sangar Rahimi, and Nawab Stanikzai', 0.00, 70800.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-433
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bbde7375-6d12-430b-84e7-2577fb729197', 'JE-000443', '2025-08-03', 'Paid for lunch expense of the day', 'JV-JV-433', 'journal_entry', 670.00, 670.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd716b579-d526-47fd-bd20-97b7e9e6b6a9', 'bbde7375-6d12-430b-84e7-2577fb729197', id, 'Paid for lunch expense of the day', 670.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd6c1e93c-2a8b-4a01-ac60-e7e1d0665a11', 'bbde7375-6d12-430b-84e7-2577fb729197', id, 'Paid for lunch expense of the day', 0.00, 670.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-434
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a087d075-da2d-4038-bc43-61204d7e8452', 'JE-000444', '2025-08-04', 'Cash Received CR# 45 for house rent payment', 'JV-JV-434', 'journal_entry', 60000.00, 60000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '807cfe7e-a92c-4ffc-934e-c98d0d73c477', 'a087d075-da2d-4038-bc43-61204d7e8452', id, 'Cash Received CR# 45 for house rent payment', 60000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ae48594b-7715-4d50-84fc-885529971c73', 'a087d075-da2d-4038-bc43-61204d7e8452', id, 'Cash Received CR# 45 for house rent payment', 0.00, 60000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-435
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6b4e8fa0-ee8e-44c4-8805-e0b36235dbe9', 'JE-000445', '2025-08-04', 'House rent prepaid for the month of Assad and Sunbulah 1404', 'JV-JV-435', 'journal_entry', 60000.00, 60000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ed5b3bf9-ce17-4635-8153-f5a9b9640cf5', '6b4e8fa0-ee8e-44c4-8805-e0b36235dbe9', id, 'House rent prepaid for the month of Assad and Sunbulah 1404', 60000.00, 0.00 FROM accounts WHERE account_code = '13100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f7add3fa-e53c-41cd-adb0-80710fb88678', '6b4e8fa0-ee8e-44c4-8805-e0b36235dbe9', id, 'House rent prepaid for the month of Assad and Sunbulah 1404', 0.00, 60000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-436
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8aeb9634-8a13-4bdc-b9cc-12252c311b71', 'JE-000446', '2025-08-04', 'Cash Received CR# 46 for staff salary payment for the month of July 2025', 'JV-JV-436', 'journal_entry', 281320.00, 281320.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f8b138b4-1e53-4cb6-82fa-105cabe2a35b', '8aeb9634-8a13-4bdc-b9cc-12252c311b71', id, 'Cash Received CR# 46 for staff salary payment for the month of July 2025', 281320.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f6cfc561-0678-4d80-bc16-456ee499e9cf', '8aeb9634-8a13-4bdc-b9cc-12252c311b71', id, 'Cash Received CR# 46 for staff salary payment for the month of July 2025', 0.00, 281320.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-437
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('65cb6297-9224-45f6-9cbc-d865ed6d2bdb', 'JE-000447', '2025-08-04', 'July 2025 salary paid', 'JV-JV-437', 'journal_entry', 281320.00, 281320.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1127642f-6edc-4b47-a2a5-803ef406366f', '65cb6297-9224-45f6-9cbc-d865ed6d2bdb', id, 'July 2025 salary paid', 150000.00, 0.00 FROM accounts WHERE account_code = '20169';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bb9bfdb4-c613-49d3-a3cb-8bbaefc5f934', '65cb6297-9224-45f6-9cbc-d865ed6d2bdb', id, 'July 2025 salary paid', 37100.00, 0.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4d3da0e1-5acf-4cd4-93ac-8fb8cc44a48d', '65cb6297-9224-45f6-9cbc-d865ed6d2bdb', id, 'July 2025 salary paid', 37100.00, 0.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '78c2070c-7ae7-4633-b755-9c50370954ab', '65cb6297-9224-45f6-9cbc-d865ed6d2bdb', id, 'July 2025 salary paid', 23500.00, 0.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c566a066-095c-4dce-9f4f-67e58c89b5bb', '65cb6297-9224-45f6-9cbc-d865ed6d2bdb', id, 'July 2025 salary paid', 6960.00, 0.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bbdc8ffc-c74a-4600-950f-28546406f99b', '65cb6297-9224-45f6-9cbc-d865ed6d2bdb', id, 'July 2025 salary paid', 1860.00, 0.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aa49cb52-f045-4a51-a61e-65850fcf725d', '65cb6297-9224-45f6-9cbc-d865ed6d2bdb', id, 'July 2025 salary paid', 6960.00, 0.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd516f4e5-f417-4e40-aae0-bf737d93b645', '65cb6297-9224-45f6-9cbc-d865ed6d2bdb', id, 'July 2025 salary paid', 4980.00, 0.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '382ee5a6-1d54-44cf-97dd-e02e9115a08c', '65cb6297-9224-45f6-9cbc-d865ed6d2bdb', id, 'July 2025 salary paid', 2950.00, 0.00 FROM accounts WHERE account_code = '20167';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '415faee5-6302-4404-ae99-435688f125ee', '65cb6297-9224-45f6-9cbc-d865ed6d2bdb', id, 'July 2025 salary paid', 2950.00, 0.00 FROM accounts WHERE account_code = '20166';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '22d3078b-cec1-401d-a83f-d57b4af4478e', '65cb6297-9224-45f6-9cbc-d865ed6d2bdb', id, 'July 2025 salary paid', 6960.00, 0.00 FROM accounts WHERE account_code = '20170';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f31b5016-c8cc-4553-9046-7092a1135103', '65cb6297-9224-45f6-9cbc-d865ed6d2bdb', id, 'July 2025 salary paid', 0.00, 281320.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-438
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('eaa6a9e5-919e-4285-909a-6d4b23ea0caf', 'JE-000448', '2025-08-04', 'Paid for lunch expense of the day', 'JV-JV-438', 'journal_entry', 210.00, 210.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6b6fc3e0-59f6-4ed5-95c6-7cbe99fa3642', 'eaa6a9e5-919e-4285-909a-6d4b23ea0caf', id, 'Paid for lunch expense of the day', 210.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6e13bf4c-8fcf-4e49-a965-ea1dc5b08556', 'eaa6a9e5-919e-4285-909a-6d4b23ea0caf', id, 'Paid for lunch expense of the day', 0.00, 210.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-439
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d1950909-fae8-43b9-9c3f-df9dd0c59465', 'JE-000449', '2025-08-04', 'Paid for Cake and coffee for guests', 'JV-JV-439', 'journal_entry', 530.00, 530.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '072d44e9-7c06-45be-9b22-f60efc13153b', 'd1950909-fae8-43b9-9c3f-df9dd0c59465', id, 'Paid for Cake and coffee for guests', 470.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '96131342-0b3d-4af2-b4e4-e0304a443099', 'd1950909-fae8-43b9-9c3f-df9dd0c59465', id, 'Paid for Cake and coffee for guests', 0.00, 470.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7a174a7e-2107-4045-8a63-71f52efa0510', 'd1950909-fae8-43b9-9c3f-df9dd0c59465', id, 'Paid for taxi by Faisal Achakzai to bring cash', 60.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fdc4b52e-decb-45b2-90b1-2ae077c66778', 'd1950909-fae8-43b9-9c3f-df9dd0c59465', id, 'Paid for taxi by Faisal Achakzai to bring cash', 0.00, 60.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-440
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('52383723-1782-486d-8223-c39b652b5527', 'JE-000450', '2025-08-04', 'Taxi used by Shakoor to bring cash', 'JV-JV-440', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b62dd3fd-d178-48a0-acb4-b433d97c2e52', '52383723-1782-486d-8223-c39b652b5527', id, 'Taxi used by Shakoor to bring cash', 500.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd13cce7a-70a5-49e9-a46f-bec3e8ebf597', '52383723-1782-486d-8223-c39b652b5527', id, 'Taxi used by Shakoor to bring cash', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-441
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('937a0c9d-de58-4f77-ab7d-aac4261b8bcc', 'JE-000451', '2025-08-04', 'Paid for fuel for the power generator', 'JV-JV-441', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b572f9bb-ac1a-4a47-9c5c-91534fa51dc4', '937a0c9d-de58-4f77-ab7d-aac4261b8bcc', id, 'Paid for fuel for the power generator', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fbaba14e-4238-449a-85af-df499c99eb2c', '937a0c9d-de58-4f77-ab7d-aac4261b8bcc', id, 'Paid for fuel for the power generator', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-442
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('42afbef7-cc01-4d03-ac72-d432ce27e2ff', 'JE-000452', '2025-08-04', 'Cash Received CR# 49 for Kunar branch expenses', 'JV-JV-442', 'journal_entry', 25150.00, 25150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '56cb3f1f-ccd9-4ac3-b087-dbb2999ec31c', '42afbef7-cc01-4d03-ac72-d432ce27e2ff', id, 'Cash Received CR# 49 for Kunar branch expenses', 25150.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '08029955-5cef-479b-bbf0-ef2c601b1e3d', '42afbef7-cc01-4d03-ac72-d432ce27e2ff', id, 'Cash Received CR# 49 for Kunar branch expenses', 0.00, 25150.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-443
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('198be226-5416-4cf9-9a35-d151699a2451', 'JE-000453', '2025-08-04', 'Advance paid to Shahpoor Khan for Kunar Branch expenses', 'JV-JV-443', 'journal_entry', 25150.00, 25150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4bde837c-8f7c-464d-b059-13a81df5d566', '198be226-5416-4cf9-9a35-d151699a2451', id, 'Advance paid to Shahpoor Khan for Kunar Branch expenses', 25150.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '285046e1-11b8-4c88-8d95-23320764469f', '198be226-5416-4cf9-9a35-d151699a2451', id, 'Advance paid to Shahpoor Khan for Kunar Branch expenses', 0.00, 25150.00 FROM accounts WHERE account_code = '10101';

-- Entry: LCI011
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6ac2cc0c-7e22-41ab-81a8-95b0d992400a', 'JE-000454', '2025-08-05', 'Purchased grocery materials for sale on Murabaha for Ms. Taiba on 12 installments', 'JV-LCI011', 'financing_disbursement', 25093.35, 25093.35, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '90da4e05-bd4a-46ae-aaca-cc459634d0ab', '6ac2cc0c-7e22-41ab-81a8-95b0d992400a', id, 'Purchased grocery materials for sale on Murabaha for Ms. Taiba on 12 installments', 25093.35, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8b0559b2-20cf-4bf5-ae4d-f5d6cd733e6a', '6ac2cc0c-7e22-41ab-81a8-95b0d992400a', id, 'Purchased grocery materials for sale on Murabaha for Ms. Taiba on 12 installments', 0.00, 21265.55 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '56a61ef1-f476-4ced-a455-f2cf62518492', '6ac2cc0c-7e22-41ab-81a8-95b0d992400a', id, 'Purchased grocery materials for sale on Murabaha for Ms. Taiba on 12 installments on 18% profit', 0.00, 3827.80 FROM accounts WHERE account_code = '20900';

-- Entry: LCI012
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ea3dcb2a-a1bf-4188-98bc-ddbee91bac92', 'JE-000455', '2025-08-05', 'Purchased grocery materials for sale on Murabaha for Mr. Ansarullah Majidi on 12 installments', 'JV-LCI012', 'financing_disbursement', 36314.15, 36314.15, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2ad75ed6-2aec-41d7-aa18-2594c13d4003', 'ea3dcb2a-a1bf-4188-98bc-ddbee91bac92', id, 'Purchased grocery materials for sale on Murabaha for Mr. Ansarullah Majidi on 12 installments', 36314.15, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e13b519a-4f57-439d-bdda-f95b3e7fa04d', 'ea3dcb2a-a1bf-4188-98bc-ddbee91bac92', id, 'Purchased grocery materials for sale on Murabaha for Mr. Ansarullah Majidi on 12 installments', 0.00, 30774.70 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0260559b-ff59-48f8-a1a9-b1306d6313ed', 'ea3dcb2a-a1bf-4188-98bc-ddbee91bac92', id, 'Purchased grocery materials for sale on Murabaha for Mr. Ansarullah Majidi on 12 installments on 18% profit', 0.00, 5539.45 FROM accounts WHERE account_code = '20900';

-- Entry: JV-444
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f40231f2-febf-4440-975f-6335f4f7dbcb', 'JE-000456', '2025-08-05', 'Paid for lunch expense to Lateef', 'JV-JV-444', 'journal_entry', 220.00, 220.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5a542a40-bd1d-4c34-b037-d99288acb17b', 'f40231f2-febf-4440-975f-6335f4f7dbcb', id, 'Paid for lunch expense to Lateef', 220.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7ea20297-7d9b-4c33-b6e3-6a27f0dc91da', 'f40231f2-febf-4440-975f-6335f4f7dbcb', id, 'Paid for lunch expense to Lateef', 0.00, 220.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-445
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8ccd50e7-0d83-4209-bdcf-51c5377331dc', 'JE-000457', '2025-08-05', 'Loan disbursed Taiba and Ansarullah Majidi on Murabaha', 'JV-JV-445', 'journal_entry', 52040.25, 52040.25, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8b90737d-7c7f-496b-8659-07929c6c4872', '8ccd50e7-0d83-4209-bdcf-51c5377331dc', id, 'Loan disbursed Taiba and Ansarullah Majidi on Murabaha', 52040.25, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '18f3c801-3814-440d-870f-5a7fc44fdb25', '8ccd50e7-0d83-4209-bdcf-51c5377331dc', id, 'Loan disbursed Taiba and Ansarullah Majidi on Murabaha', 0.00, 52040.25 FROM accounts WHERE account_code = '20152';

-- Entry: JV-446
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0d79c110-f130-4fc5-b7b9-f7384959c8f1', 'JE-000458', '2025-08-05', 'Internet fee for Shamal telecom 4 days end of the contract', 'JV-JV-446', 'journal_entry', 800.00, 800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ec18ebb2-06cd-4197-80a0-36339bdb667b', '0d79c110-f130-4fc5-b7b9-f7384959c8f1', id, 'Internet fee for Shamal telecom 4 days end of the contract', 800.00, 0.00 FROM accounts WHERE account_code = '61202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '180f40c2-f6b6-44ac-895e-261d5be5de4d', '0d79c110-f130-4fc5-b7b9-f7384959c8f1', id, 'Internet fee for Shamal telecom 4 days end of the contract', 0.00, 800.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-447
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bd0c35aa-0106-410c-aac6-28ce8fe60d18', 'JE-000459', '2025-08-06', 'Purchase of internet cable', 'JV-JV-447', 'journal_entry', 640.00, 640.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ef911e23-3521-446d-8f8d-0389982aa8ad', 'bd0c35aa-0106-410c-aac6-28ce8fe60d18', id, 'Purchase of internet cable', 640.00, 0.00 FROM accounts WHERE account_code = '61207';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c264026c-357b-4e45-b07c-2def1e3f1185', 'bd0c35aa-0106-410c-aac6-28ce8fe60d18', id, 'Purchase of internet cable', 0.00, 640.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-448
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('af1ede5c-a129-46ab-9bec-ad3ed6e4d2b9', 'JE-000460', '2025-08-06', 'Staff daily food item', 'JV-JV-448', 'journal_entry', 280.00, 280.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '70792c78-d33e-4d82-bb95-08ff8e9767e2', 'af1ede5c-a129-46ab-9bec-ad3ed6e4d2b9', id, 'Staff daily food item', 280.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '72b8cd0c-00b7-4125-94f7-c15f345c1412', 'af1ede5c-a129-46ab-9bec-ad3ed6e4d2b9', id, 'Staff daily food item', 0.00, 280.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-449
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b8057391-590c-4647-bf7e-c0c13850a3f1', 'JE-000461', '2025-08-07', 'Cash Received CR#42 for the purchase of two epson Printers', 'JV-JV-449', 'journal_entry', 23000.00, 23000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c12a604-59ff-464a-8feb-09d574fb100b', 'b8057391-590c-4647-bf7e-c0c13850a3f1', id, 'Cash Received CR#42 for the purchase of two epson Printers', 23000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '14da3939-bf94-41c8-ab6f-f2b44b63d5c4', 'b8057391-590c-4647-bf7e-c0c13850a3f1', id, 'Cash Received CR#42 for the purchase of two epson Printers', 0.00, 23000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-450
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b89dc942-7b59-4a9a-be57-a351cb602e48', 'JE-000462', '2025-08-07', 'Cash Received CR#50 for the office daily expenses', 'JV-JV-450', 'journal_entry', 15000.00, 15000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dd902641-ce55-433f-b263-8d0d9562b7bf', 'b89dc942-7b59-4a9a-be57-a351cb602e48', id, 'Cash Received CR#50 for the office daily expenses', 15000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8436eeae-bb7a-4a06-b45a-d79054f2d412', 'b89dc942-7b59-4a9a-be57-a351cb602e48', id, 'Cash Received CR#50 for the office daily expenses', 0.00, 15000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-451
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('eafa583a-00e2-4ca6-881c-ad743452f1bf', 'JE-000463', '2025-08-07', 'Taxi paid to Mustafa for documents delivery', 'JV-JV-451', 'journal_entry', 90.00, 90.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cd4c17d2-3fd1-4a61-8bcf-901711fb4a72', 'eafa583a-00e2-4ca6-881c-ad743452f1bf', id, 'Taxi paid to Mustafa for documents delivery', 90.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '486c3aca-a8ed-4f10-988e-cf1882efdadb', 'eafa583a-00e2-4ca6-881c-ad743452f1bf', id, 'Taxi paid to Mustafa for documents delivery', 0.00, 90.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-452
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('28c59c40-a722-4c60-8b88-becd38489d44', 'JE-000464', '2025-08-07', 'Paid for the generator fuel', 'JV-JV-452', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '21d4dae3-e8c8-4530-b74e-73d0ad997df2', '28c59c40-a722-4c60-8b88-becd38489d44', id, 'Paid for the generator fuel', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3976e091-26b9-47dc-99d5-4f20bcc3b763', '28c59c40-a722-4c60-8b88-becd38489d44', id, 'Paid for the generator fuel', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-453
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('aa391d5b-923c-458a-a3f0-93173ae186aa', 'JE-000465', '2025-08-07', 'Paid for the drinking water', 'JV-JV-453', 'journal_entry', 360.00, 360.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7ff1021b-ae30-42a7-a384-fe3b1e0fbbc8', 'aa391d5b-923c-458a-a3f0-93173ae186aa', id, 'Paid for the drinking water', 360.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2ff75c4c-1c21-4661-a9b0-106d278810e1', 'aa391d5b-923c-458a-a3f0-93173ae186aa', id, 'Paid for the drinking water', 0.00, 360.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-454
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ab68251c-91a2-44da-a7c9-5b9d6e19178c', 'JE-000466', '2025-08-08', 'Paid for the generator fuel', 'JV-JV-454', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4f6414cf-38b3-4bb1-820d-293b4a90c7da', 'ab68251c-91a2-44da-a7c9-5b9d6e19178c', id, 'Paid for the generator fuel', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '55bedea4-1615-44c7-8dd8-200744dfa1bd', 'ab68251c-91a2-44da-a7c9-5b9d6e19178c', id, 'Paid for the generator fuel', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-455
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3bf921e9-a2e5-4f74-a10b-991ff380e0ca', 'JE-000467', '2025-08-08', 'Staff daily food item', 'JV-JV-455', 'journal_entry', 310.00, 310.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '577752ee-61a9-445a-9267-e953fa4c9f8a', '3bf921e9-a2e5-4f74-a10b-991ff380e0ca', id, 'Staff daily food item', 310.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c062bbb6-7800-46a0-b25d-d6dc0face94e', '3bf921e9-a2e5-4f74-a10b-991ff380e0ca', id, 'Staff daily food item', 0.00, 310.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-456
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8b5756c5-8bbf-446d-b369-449935f9179d', 'JE-000468', '2025-08-09', 'Taxi paid to Mustafa for documents delivery', 'JV-JV-456', 'journal_entry', 90.00, 90.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2f49574f-a366-44d2-a91e-325699a8088f', '8b5756c5-8bbf-446d-b369-449935f9179d', id, 'Taxi paid to Mustafa for documents delivery', 90.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2e907ec3-1390-464d-8afd-aa64b8440a1c', '8b5756c5-8bbf-446d-b369-449935f9179d', id, 'Taxi paid to Mustafa for documents delivery', 0.00, 90.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-457
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5747c2d5-97f0-4be5-a032-a23ebead9bd2', 'JE-000469', '2025-08-09', 'Staff daily food item', 'JV-JV-457', 'journal_entry', 280.00, 280.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '28155725-425b-43c2-ab11-a1a90afa1335', '5747c2d5-97f0-4be5-a032-a23ebead9bd2', id, 'Staff daily food item', 280.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '86185692-8519-4128-ac9c-67f5d19c3468', '5747c2d5-97f0-4be5-a032-a23ebead9bd2', id, 'Staff daily food item', 0.00, 280.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-458
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1e29f0c9-4662-47fb-b6fc-16c452123445', 'JE-000470', '2025-08-10', 'Cash Received CR# 51 for Advance payment to COO for Jalalabad Branch', 'JV-JV-458', 'journal_entry', 30150.00, 30150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4dc9b973-1e8a-4b5e-9710-d2ef39fd3084', '1e29f0c9-4662-47fb-b6fc-16c452123445', id, 'Cash Received CR# 51 for Advance payment to COO for Jalalabad Branch', 30150.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0a4e3452-525f-4d76-9f34-5ccad894670f', '1e29f0c9-4662-47fb-b6fc-16c452123445', id, 'Cash Received CR# 51 for Advance payment to COO for Jalalabad Branch', 0.00, 30150.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-459
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e5fbb601-bc45-4458-9fca-96783f45e28c', 'JE-000471', '2025-08-10', 'Advance Paid to Shahpoor Khan for Jalalabad Branch expenses and hawala cost', 'JV-JV-459', 'journal_entry', 30150.00, 30150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7dff4e4c-ef4b-4405-bccd-fbace7dc0465', 'e5fbb601-bc45-4458-9fca-96783f45e28c', id, 'Advance Paid to Shahpoor Khan for Jalalabad Branch expenses and hawala cost', 30150.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '79baaaad-b0b8-43b8-b4ec-696615389dbf', 'e5fbb601-bc45-4458-9fca-96783f45e28c', id, 'Advance Paid to Shahpoor Khan for Jalalabad Branch expenses and hawala cost', 0.00, 30150.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-460
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c2ccf27d-3434-4eea-8cbe-802f4d661ee7', 'JE-000472', '2025-08-10', 'Purchased a complete solar system for the office to Give 10KW/hour', 'JV-JV-460', 'journal_entry', 352457.45, 352457.45, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ad6f9743-e912-4a25-8169-8d5d6de708cf', 'c2ccf27d-3434-4eea-8cbe-802f4d661ee7', id, 'Purchased a complete solar system for the office to Give 10KW/hour', 352457.45, 0.00 FROM accounts WHERE account_code = '17501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ff898dc8-8868-4399-b036-d8f14932981a', 'c2ccf27d-3434-4eea-8cbe-802f4d661ee7', id, 'Purchased a complete solar system for the office to Give 10KW/hour', 0.00, 352457.45 FROM accounts WHERE account_code = '20100';

-- Entry: JV-461
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3b8fa1ec-72a6-403d-8fd7-5b45e967e7b2', 'JE-000473', '2025-08-10', 'Staff daily food item', 'JV-JV-461', 'journal_entry', 820.00, 820.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5f41a70b-1136-4885-8ab8-c93addc1a39e', '3b8fa1ec-72a6-403d-8fd7-5b45e967e7b2', id, 'Staff daily food item', 730.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'df34e655-e3f9-4775-84af-c18c31796bec', '3b8fa1ec-72a6-403d-8fd7-5b45e967e7b2', id, 'Staff daily food item', 0.00, 730.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9287b63f-fee9-4475-8ea0-25bd477950ed', '3b8fa1ec-72a6-403d-8fd7-5b45e967e7b2', id, 'Paid to Mustafa for taxi use for the repair of printer', 90.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b4ad4b61-ca8e-4e9a-9616-61a1928d273b', '3b8fa1ec-72a6-403d-8fd7-5b45e967e7b2', id, 'Paid to Mustafa for taxi use for the repair of printer', 0.00, 90.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-462
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('40d34829-812a-4738-bd05-bd5378dbf04d', 'JE-000474', '2025-08-10', 'Taxi paid to Mashal Achakzai for MISFA Assessment From Jalalabad and Kunar branches', 'JV-JV-462', 'journal_entry', 970.00, 970.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '75ae6a39-ebbc-40d7-b186-b5f5d0400d2c', '40d34829-812a-4738-bd05-bd5378dbf04d', id, 'Taxi paid to Mashal Achakzai for MISFA Assessment From Jalalabad and Kunar branches', 970.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8b09d962-e8e0-4be1-8653-dd7a389eedfd', '40d34829-812a-4738-bd05-bd5378dbf04d', id, 'Taxi paid to Mashal Achakzai for MISFA Assessment From Jalalabad and Kunar branches', 0.00, 970.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-463
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('39a3de91-8527-40fd-a58a-836f17630616', 'JE-000475', '2025-08-10', 'Cash Received CR-54 for the purchase of furniture for CEO office', 'JV-JV-463', 'journal_entry', 150260.00, 150260.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '61a639d0-80cc-492b-aeb5-d8315f27e3c0', '39a3de91-8527-40fd-a58a-836f17630616', id, 'Cash Received CR-54 for the purchase of furniture for CEO office', 150260.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cb3fad0f-5285-47d3-878f-b85353b0d29a', '39a3de91-8527-40fd-a58a-836f17630616', id, 'Cash Received CR-54 for the purchase of furniture for CEO office', 0.00, 150260.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-464
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f724da4c-70b6-40cd-b80b-40c0170b4960', 'JE-000476', '2025-08-10', 'Purchase of furniture for the president office', 'JV-JV-464', 'journal_entry', 94000.00, 94000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ebb4b022-c3d8-46e8-b0a2-4fedb3c40e45', 'f724da4c-70b6-40cd-b80b-40c0170b4960', id, 'Purchase of furniture for the president office', 94000.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b02cc632-08be-4fdb-bf08-5a7317640477', 'f724da4c-70b6-40cd-b80b-40c0170b4960', id, 'Purchase of furniture for the president office', 0.00, 94000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-465
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1d16db4c-2bdb-48fe-abe4-4a8f0bc80774', 'JE-000477', '2025-08-10', 'Purchase of parket for the president office', 'JV-JV-465', 'journal_entry', 21620.00, 21620.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6011d3ad-5ec2-44d6-a907-be9bcedef5ab', '1d16db4c-2bdb-48fe-abe4-4a8f0bc80774', id, 'Purchase of parket for the president office', 21620.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6c0f949e-882c-48fe-8f54-9524268b862a', '1d16db4c-2bdb-48fe-abe4-4a8f0bc80774', id, 'Purchase of parket for the president office', 0.00, 21620.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-466
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2b1a1afe-94da-41b6-ab42-f1184375e690', 'JE-000478', '2025-08-10', 'Taxi paid for the delivery of wooden planks', 'JV-JV-466', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7c4c55d5-1c3b-46e3-ae15-a4b1b4518285', '2b1a1afe-94da-41b6-ab42-f1184375e690', id, 'Taxi paid for the delivery of wooden planks', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e67469ed-d98d-4799-bac6-31fbd450e5e2', '2b1a1afe-94da-41b6-ab42-f1184375e690', id, 'Taxi paid for the delivery of wooden planks', 0.00, 100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-467
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e832bfc3-0da1-4dbc-80a3-4244d387d34b', 'JE-000479', '2025-08-10', 'Paid for taxi by Shakoor to Kunar and Jalalabad branches during MISFA Assessment', 'JV-JV-467', 'journal_entry', 2650.00, 2650.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '76f5948c-002a-42c9-ba4b-8a6c123c9949', 'e832bfc3-0da1-4dbc-80a3-4244d387d34b', id, 'Paid for taxi by Shakoor to Kunar and Jalalabad branches during MISFA Assessment', 2250.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd5cd6960-ffda-4524-82df-72c8d7624188', 'e832bfc3-0da1-4dbc-80a3-4244d387d34b', id, 'Paid for taxi by Shakoor to Kunar and Jalalabad branches during MISFA Assessment', 0.00, 2250.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a1264d6e-62bd-4eac-aafe-f9a859f035bc', 'e832bfc3-0da1-4dbc-80a3-4244d387d34b', id, 'Paid for the Carpentry to shift the CEO to COO office and some other carpentry job', 400.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0fc3702b-a18e-4d86-865b-74159d69b515', 'e832bfc3-0da1-4dbc-80a3-4244d387d34b', id, 'Paid for the Carpentry to shift the CEO to COO office and some other carpentry job', 0.00, 400.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-468
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f5ed2fb6-a179-4ffb-8dfb-9b74414c432b', 'JE-000480', '2025-08-10', 'Paid for the purchase of power stip, switch, and rubber tape', 'JV-JV-468', 'journal_entry', 130.00, 130.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '295490cc-1e56-4f1b-b9c4-056b8cb71e1b', 'f5ed2fb6-a179-4ffb-8dfb-9b74414c432b', id, 'Paid for the purchase of power stip, switch, and rubber tape', 130.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '99abfd8e-ed2a-46b0-ad47-e9cf840a738e', 'f5ed2fb6-a179-4ffb-8dfb-9b74414c432b', id, 'Paid for the purchase of power stip, switch, and rubber tape', 0.00, 130.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-469
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4261e529-c833-4ee0-a4d9-d5da0cba56cf', 'JE-000481', '2025-08-11', 'Purchased two epson L3258 all 1 wireless color inkjet printers', 'JV-JV-469', 'journal_entry', 21920.00, 21920.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1810356b-6b2c-4a15-b4af-7f37dffb762e', '4261e529-c833-4ee0-a4d9-d5da0cba56cf', id, 'Purchased two epson L3258 all 1 wireless color inkjet printers', 21920.00, 0.00 FROM accounts WHERE account_code = '17101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '50eb218b-8b00-405e-af35-aabb975b6f43', '4261e529-c833-4ee0-a4d9-d5da0cba56cf', id, 'Purchased two epson L3258 all 1 wireless color inkjet printers', 0.00, 21920.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-470
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5cddf8f3-6246-418a-b254-1ba57977d2b7', 'JE-000482', '2025-08-11', 'Staff lunch expenses', 'JV-JV-470', 'journal_entry', 400.00, 400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f8f23281-3093-45b2-a001-656d5d6fd6e8', '5cddf8f3-6246-418a-b254-1ba57977d2b7', id, 'Staff lunch expenses', 400.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '525ca56d-4c5b-4793-ab2a-9330aaef4a67', '5cddf8f3-6246-418a-b254-1ba57977d2b7', id, 'Staff lunch expenses', 0.00, 400.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-471
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fda90519-d739-4c97-b870-36dc16af42e4', 'JE-000483', '2025-08-11', 'Gas for the kitchen', 'JV-JV-471', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2e1f7670-f29d-4eda-ba43-616b618f9005', 'fda90519-d739-4c97-b870-36dc16af42e4', id, 'Gas for the kitchen', 500.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '65938b31-88f9-4aca-b029-23536da69da3', 'fda90519-d739-4c97-b870-36dc16af42e4', id, 'Gas for the kitchen', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-472
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3ae532ec-e128-4c3d-a8f0-e1e689e42e14', 'JE-000484', '2025-08-11', 'Purchase of AC for CEO office (USD450@ 68.3)', 'JV-JV-472', 'journal_entry', 32235.00, 32235.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5280dd48-7bab-4f78-b75d-84f9162d04c9', '3ae532ec-e128-4c3d-a8f0-e1e689e42e14', id, 'Purchase of AC for CEO office (USD450@ 68.3)', 32235.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ca68f264-31c9-41c4-93b9-cd0634afa04d', '3ae532ec-e128-4c3d-a8f0-e1e689e42e14', id, 'Purchase of AC for CEO office (USD450@ 68.3)', 0.00, 32235.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-473
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('49a1f91a-03d0-44a6-b6c7-e2e0e1deaee9', 'JE-000485', '2025-08-11', 'Paid for the purchase of cooling for the COO Laptop and one tripod', 'JV-JV-473', 'journal_entry', 800.00, 800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7aef49d0-34f5-4b79-b463-844884419324', '49a1f91a-03d0-44a6-b6c7-e2e0e1deaee9', id, 'Paid for the purchase of cooling for the COO Laptop and one tripod', 800.00, 0.00 FROM accounts WHERE account_code = '80103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dd75dd3f-ae32-4611-a298-d99fd9dad880', '49a1f91a-03d0-44a6-b6c7-e2e0e1deaee9', id, 'Paid for the purchase of cooling for the COO Laptop and one tripod', 0.00, 800.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-474
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('81adc6a8-d1e8-44c1-97e2-9a90427b7221', 'JE-000486', '2025-08-11', 'Paid to purchase dry food for the CEO office', 'JV-JV-474', 'journal_entry', 1730.00, 1730.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '424dcc5c-d5d1-4055-97a4-fa16561f0e96', '81adc6a8-d1e8-44c1-97e2-9a90427b7221', id, 'Paid to purchase dry food for the CEO office', 1730.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1884a3e1-1503-45a4-bdca-ae2914c934fd', '81adc6a8-d1e8-44c1-97e2-9a90427b7221', id, 'Paid to purchase dry food for the CEO office', 0.00, 1730.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-475
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('aedddc89-d070-4f45-b8fd-eb07d55d0218', 'JE-000487', '2025-08-11', 'Salary Advance paid to Omid Ahmadzai', 'JV-JV-475', 'journal_entry', 3500.00, 3500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8db343bf-aba4-4a6a-a0b1-83627355deeb', 'aedddc89-d070-4f45-b8fd-eb07d55d0218', id, 'Salary Advance paid to Omid Ahmadzai', 3500.00, 0.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7337605f-29a6-4188-bd36-75eadf048c8e', 'aedddc89-d070-4f45-b8fd-eb07d55d0218', id, 'Salary Advance paid to Omid Ahmadzai', 0.00, 3500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-476
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('911d3af9-d5a2-4315-8336-f7b9421cdf87', 'JE-000488', '2025-08-11', 'Paid for Guard''s Friday food expense old bill', 'JV-JV-476', 'journal_entry', 190.00, 190.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2a00437a-3146-4bf9-9be4-33ed4891480c', '911d3af9-d5a2-4315-8336-f7b9421cdf87', id, 'Paid for Guard''s Friday food expense old bill', 190.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6b94f3d5-6076-41a2-acfc-04e1eb0c7559', '911d3af9-d5a2-4315-8336-f7b9421cdf87', id, 'Paid for Guard''s Friday food expense old bill', 0.00, 190.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-477
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ebd34f16-b449-4e73-8ac5-40d5dbbd399d', 'JE-000489', '2025-08-11', 'Cash Received CR-53 for the purchase of AC for COO office', 'JV-JV-477', 'journal_entry', 30817.00, 30817.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cee7088c-d4c9-4b48-abee-8a5dd84dc4fc', 'ebd34f16-b449-4e73-8ac5-40d5dbbd399d', id, 'Cash Received CR-53 for the purchase of AC for COO office', 30817.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9281396d-6256-47f9-990a-bc3def2569f3', 'ebd34f16-b449-4e73-8ac5-40d5dbbd399d', id, 'Cash Received CR-53 for the purchase of AC for COO office', 0.00, 30817.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-478
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('49eeddd0-b3c7-4547-8cbe-319dbc6d578f', 'JE-000490', '2025-08-11', 'Purchased AC for COO office', 'JV-JV-478', 'journal_entry', 32317.00, 32317.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '69326707-eb1e-4f02-8fdc-0be71f11b7d8', '49eeddd0-b3c7-4547-8cbe-319dbc6d578f', id, 'Purchased AC for COO office', 32317.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '13bea568-0f82-4825-919c-ab48d34c92bb', '49eeddd0-b3c7-4547-8cbe-319dbc6d578f', id, 'Purchased AC for COO office', 0.00, 32317.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-479
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('27e51582-936d-43b3-bc72-1931e9a71b26', 'JE-000491', '2025-08-12', 'Paid for lunch expense', 'JV-JV-479', 'journal_entry', 230.00, 230.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9fdbc114-c855-4301-b113-8b502fee9fd1', '27e51582-936d-43b3-bc72-1931e9a71b26', id, 'Paid for lunch expense', 230.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '38683f4a-000f-4eb2-87dc-3a212ab14e7c', '27e51582-936d-43b3-bc72-1931e9a71b26', id, 'Paid for lunch expense', 0.00, 230.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-480
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4a03c19b-21ec-41b8-9cd1-613af6ff302d', 'JE-000492', '2025-08-12', 'Taxi paid by Mustafa to Shahr e now for printer repairing', 'JV-JV-480', 'journal_entry', 90.00, 90.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5fe0eba9-d0e8-4064-864b-a1da4acf161f', '4a03c19b-21ec-41b8-9cd1-613af6ff302d', id, 'Taxi paid by Mustafa to Shahr e now for printer repairing', 90.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5fb1e1ef-1f58-4830-9b91-26a69f2616ad', '4a03c19b-21ec-41b8-9cd1-613af6ff302d', id, 'Taxi paid by Mustafa to Shahr e now for printer repairing', 0.00, 90.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-481
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9d033ad5-e2b9-4923-9c0f-8c686b29df27', 'JE-000493', '2025-08-12', 'Repaired the Head of the printer', 'JV-JV-481', 'journal_entry', 600.00, 600.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cd027c12-3529-46b7-8637-cece4b66f8b8', '9d033ad5-e2b9-4923-9c0f-8c686b29df27', id, 'Repaired the Head of the printer', 600.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '69343d9f-9d76-4dee-bb28-25660a284af9', '9d033ad5-e2b9-4923-9c0f-8c686b29df27', id, 'Repaired the Head of the printer', 0.00, 600.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-482
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('725d6f38-ebb3-4905-87b3-ab13920861ff', 'JE-000494', '2025-08-12', 'Paid for coffee and cake for guests', 'JV-JV-482', 'journal_entry', 470.00, 470.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '886dce56-453c-4b77-913c-7a031cf2ba3e', '725d6f38-ebb3-4905-87b3-ab13920861ff', id, 'Paid for coffee and cake for guests', 470.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '85d046fb-1560-4e82-b1b4-00fdb011f38c', '725d6f38-ebb3-4905-87b3-ab13920861ff', id, 'Paid for coffee and cake for guests', 0.00, 470.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-483
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d70e3a44-d001-4a3d-ad36-9b022bc2b2c7', 'JE-000495', '2025-08-13', 'Paid for the lunch expenses', 'JV-JV-483', 'journal_entry', 820.00, 820.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ca42f7fe-1e25-4065-90bc-fa8f796145f7', 'd70e3a44-d001-4a3d-ad36-9b022bc2b2c7', id, 'Paid for the lunch expenses', 820.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'af5265c5-7eb2-4f46-a405-12a131d6721b', 'd70e3a44-d001-4a3d-ad36-9b022bc2b2c7', id, 'Paid for the lunch expenses', 0.00, 820.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-484
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('86d63756-fe1a-4666-9da0-b28ddde3cfdf', 'JE-000496', '2025-08-13', 'Paid for cake and mill for guests', 'JV-JV-484', 'journal_entry', 230.00, 230.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4a5d39f9-26a6-4d14-8de8-6e5f486eeb82', '86d63756-fe1a-4666-9da0-b28ddde3cfdf', id, 'Paid for cake and mill for guests', 230.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '75396472-c0e2-4977-b546-a297578c92af', '86d63756-fe1a-4666-9da0-b28ddde3cfdf', id, 'Paid for cake and mill for guests', 0.00, 230.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-485
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a4c1413b-8666-4542-9256-79e67dd3a23e', 'JE-000497', '2025-08-13', 'Paid to Municipality for taking out the garbage', 'JV-JV-485', 'journal_entry', 200.00, 200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '486ad2a7-87b4-4956-90c7-d48eca747ee4', 'a4c1413b-8666-4542-9256-79e67dd3a23e', id, 'Paid to Municipality for taking out the garbage', 200.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '83078a3b-2123-409c-bf3a-38c8698e2f68', 'a4c1413b-8666-4542-9256-79e67dd3a23e', id, 'Paid to Municipality for taking out the garbage', 0.00, 200.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-486
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6cd2df1c-1996-457d-be44-05f17987b818', 'JE-000498', '2025-08-15', 'Paid for the lunch expenses', 'JV-JV-486', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '486e74ba-77dc-4314-bfa2-aeb3bed06af5', '6cd2df1c-1996-457d-be44-05f17987b818', id, 'Paid for the lunch expenses', 300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '45b40fe4-d5e0-4644-bcf8-2bf643c2b055', '6cd2df1c-1996-457d-be44-05f17987b818', id, 'Paid for the lunch expenses', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-487
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('675b5081-b320-4bc8-bc7b-472490d860c2', 'JE-000499', '2025-08-16', 'Cash received CR-55 for the office daily expenses', 'JV-JV-487', 'journal_entry', 15000.00, 15000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '73a16066-73e0-42ea-b24d-000873153551', '675b5081-b320-4bc8-bc7b-472490d860c2', id, 'Cash received CR-55 for the office daily expenses', 15000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'db69b902-da6e-49f3-bafe-4286bd27829b', '675b5081-b320-4bc8-bc7b-472490d860c2', id, 'Cash received CR-55 for the office daily expenses', 0.00, 15000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-488
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('98fca9a1-58ff-4271-aa02-bd1c59ec5e22', 'JE-000500', '2025-08-16', 'Cash received CR-56 for the purchase of one laptop computer', 'JV-JV-488', 'journal_entry', 10000.00, 10000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3d151827-43a8-48cb-aad2-c3a7a3e8af40', '98fca9a1-58ff-4271-aa02-bd1c59ec5e22', id, 'Cash received CR-56 for the purchase of one laptop computer', 10000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a8690c81-08fd-47d3-ae4e-4e7e20a43e89', '98fca9a1-58ff-4271-aa02-bd1c59ec5e22', id, 'Cash received CR-56 for the purchase of one laptop computer', 0.00, 10000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-489
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7234a02c-f3f6-4069-b178-53c1e9fb52be', 'JE-000501', '2025-08-16', 'Purchased one Thinkpad Laptops I390', 'JV-JV-489', 'journal_entry', 9000.00, 9000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f3230caf-00f4-4c04-8ffe-f42a0cf9b304', '7234a02c-f3f6-4069-b178-53c1e9fb52be', id, 'Purchased one Thinkpad Laptops I390', 9000.00, 0.00 FROM accounts WHERE account_code = '17101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '31ed33e4-1393-472f-9cd1-550489373073', '7234a02c-f3f6-4069-b178-53c1e9fb52be', id, 'Purchased one Thinkpad Laptops I390', 0.00, 9000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-490
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('080feee7-d938-4f64-af8c-247a9383667f', 'JE-000502', '2025-08-16', 'Paid for taxi use to Faisal Achakzai', 'JV-JV-490', 'journal_entry', 900.00, 900.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7342d32f-8d3d-43a2-ad32-d57f3a2ef3b8', '080feee7-d938-4f64-af8c-247a9383667f', id, 'Paid for taxi use to Faisal Achakzai', 60.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6dc6cfd8-cd29-44b4-ad96-15a61ae88a58', '080feee7-d938-4f64-af8c-247a9383667f', id, 'Paid for taxi use to Faisal Achakzai', 0.00, 60.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '49a098cd-1fed-4476-a3dc-b7f3992d54e2', '080feee7-d938-4f64-af8c-247a9383667f', id, 'Paid for the day lunch', 840.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '39438809-3345-45ed-a8d0-8a3c181f3d7f', '080feee7-d938-4f64-af8c-247a9383667f', id, 'Paid for the day lunch', 0.00, 840.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-491
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b310f606-e94a-4c7c-b2e5-d91ea1272ee0', 'JE-000503', '2025-08-17', 'Paid for lunch expenses', 'JV-JV-491', 'journal_entry', 570.00, 570.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3c033489-dd84-4a45-a4f6-3d39975e929d', 'b310f606-e94a-4c7c-b2e5-d91ea1272ee0', id, 'Paid for lunch expenses', 570.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c67627b5-ece1-4bed-bfc8-31372ded0be8', 'b310f606-e94a-4c7c-b2e5-d91ea1272ee0', id, 'Paid for lunch expenses', 0.00, 570.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-492
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f06de476-8a87-4d87-b988-0349c1c8bb48', 'JE-000504', '2025-08-17', 'Purchased two power extensions', 'JV-JV-492', 'journal_entry', 460.00, 460.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '87157b7a-a868-4f25-acb8-f605ac8d8d62', 'f06de476-8a87-4d87-b988-0349c1c8bb48', id, 'Purchased two power extensions', 460.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2366c279-10f5-4993-a162-e82dfb73f5a8', 'f06de476-8a87-4d87-b988-0349c1c8bb48', id, 'Purchased two power extensions', 0.00, 460.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-493
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('12439c62-84e1-47e0-ac05-b0fd55e90c9b', 'JE-000505', '2025-08-17', 'Purchased Milk and Biscuits', 'JV-JV-493', 'journal_entry', 360.00, 360.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '16cf7c7d-0f8b-49ad-ad9f-b77bd8d2fcf8', '12439c62-84e1-47e0-ac05-b0fd55e90c9b', id, 'Purchased Milk and Biscuits', 360.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8269fb22-7aea-40ce-86ec-44d58b8fe52d', '12439c62-84e1-47e0-ac05-b0fd55e90c9b', id, 'Purchased Milk and Biscuits', 0.00, 360.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-494
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('aabb73ea-0715-46e6-a582-ee9922502ecb', 'JE-000506', '2025-08-17', 'Paid for taxi to abdul Shakoor to replace the Acs', 'JV-JV-494', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '56edf575-53d7-4689-94c0-a5e2543e7232', 'aabb73ea-0715-46e6-a582-ee9922502ecb', id, 'Paid for taxi to abdul Shakoor to replace the Acs', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f3569114-b611-472f-a1b5-34ad733ecacb', 'aabb73ea-0715-46e6-a582-ee9922502ecb', id, 'Paid for taxi to abdul Shakoor to replace the Acs', 0.00, 150.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-495
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4a67cba2-68e0-4617-b22e-77244090c2d2', 'JE-000507', '2025-08-17', 'Paid for taxi to abdul Shakoor to replace the Acs', 'JV-JV-495', 'journal_entry', 160.00, 160.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c34ec71d-ef6d-4e2f-94d2-65e41e9c5b95', '4a67cba2-68e0-4617-b22e-77244090c2d2', id, 'Paid for taxi to abdul Shakoor to replace the Acs', 160.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cc8374b7-be85-4d2e-b392-c1bc0876e059', '4a67cba2-68e0-4617-b22e-77244090c2d2', id, 'Paid for taxi to abdul Shakoor to replace the Acs', 0.00, 160.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-496
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('04746cce-b58c-484c-ac21-3d92f8b5dafb', 'JE-000508', '2025-08-17', 'Paid for taxi to abdul Shakoor to replace the Acs', 'JV-JV-496', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cbbc564b-521b-43b0-a507-2d448292e250', '04746cce-b58c-484c-ac21-3d92f8b5dafb', id, 'Paid for taxi to abdul Shakoor to replace the Acs', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '59726757-1999-43f5-bb9e-6dd31fc27a05', '04746cce-b58c-484c-ac21-3d92f8b5dafb', id, 'Paid for taxi to abdul Shakoor to replace the Acs', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-497
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('539e51c2-8e04-4e0d-919a-40a3ff8fdaf1', 'JE-000509', '2025-08-17', 'Paid to Liaqat for taxi use to Jalalabad Bus Station', 'JV-JV-497', 'journal_entry', 350.00, 350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5890f65c-59fd-47cc-9266-d5c63c50a1e3', '539e51c2-8e04-4e0d-919a-40a3ff8fdaf1', id, 'Paid to Liaqat for taxi use to Jalalabad Bus Station', 350.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3d83a6e4-b00d-49d8-a370-24da87b0b1e9', '539e51c2-8e04-4e0d-919a-40a3ff8fdaf1', id, 'Paid to Liaqat for taxi use to Jalalabad Bus Station', 0.00, 350.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-498
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ca246bf5-1fde-41dc-8129-ccf872d08a85', 'JE-000510', '2025-08-18', 'Paid for lunch expense', 'JV-JV-498', 'journal_entry', 975.00, 975.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '57251d10-9fd9-4250-9a4d-96e548ba896e', 'ca246bf5-1fde-41dc-8129-ccf872d08a85', id, 'Paid for lunch expense', 375.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b8015d19-c4d7-49bc-8cda-f3ae8a38476a', 'ca246bf5-1fde-41dc-8129-ccf872d08a85', id, 'Paid for lunch expense', 0.00, 375.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f2bcfec8-bfbd-44e3-837e-07071bf7f984', 'ca246bf5-1fde-41dc-8129-ccf872d08a85', id, 'Purchased TIP C 65w charger for CFO Laptop', 600.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c4a004af-8f7d-46f5-8c0e-94c7507fec34', 'ca246bf5-1fde-41dc-8129-ccf872d08a85', id, 'Purchased TIP C 65w charger for CFO Laptop', 0.00, 600.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-499
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9638d72a-e9d2-4c6a-8018-6557f4bf4dde', 'JE-000511', '2025-08-18', 'Taxi used by CFO to MTO office for tax clearance and district 4 taxi office', 'JV-JV-499', 'journal_entry', 600.00, 600.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e89f1fda-acf8-4653-a692-d517cbe70b76', '9638d72a-e9d2-4c6a-8018-6557f4bf4dde', id, 'Taxi used by CFO to MTO office for tax clearance and district 4 taxi office', 600.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3c3c5c9e-17e8-45ff-89d0-e223ebe6da8e', '9638d72a-e9d2-4c6a-8018-6557f4bf4dde', id, 'Taxi used by CFO to MTO office for tax clearance and district 4 taxi office', 0.00, 600.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-500
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bd71ab93-3ed9-4e22-812a-69383213517d', 'JE-000512', '2025-08-18', 'Cash Received CR-57 for Kunar and Jalalabad branches expenses', 'JV-JV-500', 'journal_entry', 20100.00, 20100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f9272d2c-e10d-4993-832c-536f55aa67e7', 'bd71ab93-3ed9-4e22-812a-69383213517d', id, 'Cash Received CR-57 for Kunar and Jalalabad branches expenses', 20100.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '37640399-0ff6-4b5f-b230-4a0bd21d6264', 'bd71ab93-3ed9-4e22-812a-69383213517d', id, 'Cash Received CR-57 for Kunar and Jalalabad branches expenses', 0.00, 20100.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-501
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('854dcec5-b93d-41a3-8134-c8fad5af5ef3', 'JE-000513', '2025-08-18', 'Advance payment to Noor Muhammad for  Jalalabad Branches expenses', 'JV-JV-501', 'journal_entry', 20100.00, 20100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '614d3d0f-294c-4da4-81ed-34b4f120f527', '854dcec5-b93d-41a3-8134-c8fad5af5ef3', id, 'Advance payment to Noor Muhammad for  Jalalabad Branches expenses', 10000.00, 0.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c4abd33a-8890-48d1-9cc4-4f7377abd7c3', '854dcec5-b93d-41a3-8134-c8fad5af5ef3', id, 'Advance payment to Noor Muhammad for Kunar Branches expenses', 10000.00, 0.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '19560364-7d4a-4d5c-b5b2-0f86e8f881f1', '854dcec5-b93d-41a3-8134-c8fad5af5ef3', id, 'Hawala expense payment to Noor Muhammad for Kunar Branches', 50.00, 0.00 FROM accounts WHERE account_code = '61807';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '72d13072-89d5-4ee4-861c-d694ff6e68be', '854dcec5-b93d-41a3-8134-c8fad5af5ef3', id, 'Hawala expense payment to Noor Muhammad for Jalalabad Branches', 50.00, 0.00 FROM accounts WHERE account_code = '61807';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c1e395ff-e517-409c-af55-1a73f1124d5d', '854dcec5-b93d-41a3-8134-c8fad5af5ef3', id, 'Advance payment to Noor Muhammad for  Kunar and Jalalabad Branches expenses and Hawalla expenses', 0.00, 20100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-502
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('682f5a8f-5eed-4429-bc87-b1a929d9967b', 'JE-000514', '2025-08-19', 'Paid for lunch expenses', 'JV-JV-502', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dcd8d40b-04eb-4af3-8983-4cfe51703215', '682f5a8f-5eed-4429-bc87-b1a929d9967b', id, 'Paid for lunch expenses', 300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'db0e2956-76ac-44d2-839e-901255959114', '682f5a8f-5eed-4429-bc87-b1a929d9967b', id, 'Paid for lunch expenses', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-503
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('55ed7b86-36c6-4776-a7db-33115712b2a1', 'JE-000515', '2025-08-20', 'Paid to Faisal Achakzai for taxi to receive cash', 'JV-JV-503', 'journal_entry', 60.00, 60.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c53afc4-839e-42fa-a773-306ea641d1e7', '55ed7b86-36c6-4776-a7db-33115712b2a1', id, 'Paid to Faisal Achakzai for taxi to receive cash', 60.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ba51a9a9-4af1-4214-bf89-0f955f5bab25', '55ed7b86-36c6-4776-a7db-33115712b2a1', id, 'Paid to Faisal Achakzai for taxi to receive cash', 0.00, 60.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-504
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3675f26c-8c83-446b-94b2-d0a855c1a08f', 'JE-000516', '2025-08-20', 'Cash Received CR-58 for the purchase of one laptop and bag', 'JV-JV-504', 'journal_entry', 12600.00, 12600.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f330cf97-04ff-4c7d-85ab-03e8a3a55726', '3675f26c-8c83-446b-94b2-d0a855c1a08f', id, 'Cash Received CR-58 for the purchase of one laptop and bag', 12600.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ddc0fa93-2042-4231-a762-09c2dde11186', '3675f26c-8c83-446b-94b2-d0a855c1a08f', id, 'Cash Received CR-58 for the purchase of one laptop and bag', 0.00, 12600.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-505
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('25213653-bba4-4db8-b036-6b4d4d83bf0b', 'JE-000517', '2025-08-20', 'Purchased one Lenovo xl carbun I7-6rh-Gon,', 'JV-JV-505', 'journal_entry', 10900.00, 10900.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6cca1f62-f775-4eca-ad65-be88ec42b57b', '25213653-bba4-4db8-b036-6b4d4d83bf0b', id, 'Purchased one Lenovo xl carbun I7-6rh-Gon,', 10000.00, 0.00 FROM accounts WHERE account_code = '17101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd94c776c-54ca-4a0d-9f2d-e1dd6fb0025c', '25213653-bba4-4db8-b036-6b4d4d83bf0b', id, 'Purchased one laptop bag', 800.00, 0.00 FROM accounts WHERE account_code = '61207';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '247a3ead-6683-4d67-9aee-91b1ba75ed0e', '25213653-bba4-4db8-b036-6b4d4d83bf0b', id, 'Purchased two keyboard stickers', 100.00, 0.00 FROM accounts WHERE account_code = '61207';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1cff97f2-727e-417f-a5f1-39cea03e6939', '25213653-bba4-4db8-b036-6b4d4d83bf0b', id, 'Purchased one Lenovo xl carbun I7-6rh-Gon, Laptop bag, keyboard stickers and two keyboard stickers', 0.00, 10900.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-506
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7421b356-f0af-436e-b6b4-a78f062140c2', 'JE-000518', '2025-08-20', 'Cash Received CR-52 for the QuickBooks subscription payment for one year.', 'JV-JV-506', 'journal_entry', 20548.00, 20548.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '102fb586-04b6-400a-9bf8-3f68e7f7c233', '7421b356-f0af-436e-b6b4-a78f062140c2', id, 'Cash Received CR-52 for the QuickBooks subscription payment for one year.', 20548.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7c9b22ec-69e3-4454-9082-d20a387aa67e', '7421b356-f0af-436e-b6b4-a78f062140c2', id, 'Cash Received CR-52 for the QuickBooks subscription payment for one year.', 0.00, 20548.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-507
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('10249f11-f7de-46cc-9290-9f14e223dc59', 'JE-000519', '2025-08-20', 'Paid for QuickBooks subscription payment for one year.', 'JV-JV-507', 'journal_entry', 20548.00, 20548.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3d038665-6438-48a5-9bf6-110591dd50d4', '10249f11-f7de-46cc-9290-9f14e223dc59', id, 'Paid for QuickBooks subscription payment for one year.', 20548.00, 0.00 FROM accounts WHERE account_code = '13100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a839f559-5251-4955-82c6-6addd226ac98', '10249f11-f7de-46cc-9290-9f14e223dc59', id, 'Paid for QuickBooks subscription payment for one year.', 0.00, 20548.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-508
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b10f9160-406e-4b44-af24-f13e48bfcbb7', 'JE-000520', '2025-08-20', 'Paid for lunch expense, tissue paper, and toilet paper', 'JV-JV-508', 'journal_entry', 34000.00, 34000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5a25293e-0614-4050-9dca-d296f65be581', 'b10f9160-406e-4b44-af24-f13e48bfcbb7', id, 'Paid for lunch expense, tissue paper, and toilet paper', 490.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0eee30f8-e1df-44f4-aaf8-67b956daf572', 'b10f9160-406e-4b44-af24-f13e48bfcbb7', id, 'Paid for lunch expense, tissue paper, and toilet paper', 510.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '267ad0a9-d30d-4f8b-aaea-2f20c78074a9', 'b10f9160-406e-4b44-af24-f13e48bfcbb7', id, 'Paid for lunch expense, tissue paper, and toilet paper', 0.00, 1000.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '84a66826-cafb-467d-8676-cec75069189e', 'b10f9160-406e-4b44-af24-f13e48bfcbb7', id, 'Officer rent prepaid for the month of Assad 1404', 33000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '752de955-5593-48d7-a139-c9d41ddda57d', 'b10f9160-406e-4b44-af24-f13e48bfcbb7', id, 'Rent tax payable for the month of Assad 1404', 0.00, 3000.00 FROM accounts WHERE account_code = '21200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c1d6460-4c65-4aa0-8fb8-5767d6e23090', 'b10f9160-406e-4b44-af24-f13e48bfcbb7', id, 'Officer rent prepaid for the month of Assad 1404', 0.00, 30000.00 FROM accounts WHERE account_code = '13100';

-- Entry: JV-509
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('94ed1a60-5129-422d-9e6f-3783ce09cbff', 'JE-000521', '2025-08-23', 'Cash received CR-59 for advance payment to Shahpoor Khan for travel to Jalalabad', 'JV-JV-509', 'journal_entry', 10000.00, 10000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4f65750e-17a6-4461-b610-e995c711f6ae', '94ed1a60-5129-422d-9e6f-3783ce09cbff', id, 'Cash received CR-59 for advance payment to Shahpoor Khan for travel to Jalalabad', 10000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'affa6f84-d0cf-4093-a28a-1dfff3b9a48f', '94ed1a60-5129-422d-9e6f-3783ce09cbff', id, 'Cash received CR-59 for advance payment to Shahpoor Khan for travel to Jalalabad', 0.00, 10000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-510
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d5294767-4a80-48fc-97f9-9e0e3f6f3383', 'JE-000522', '2025-08-23', 'Advance payment to Shahpoor Khan for travel to Jalalabad', 'JV-JV-510', 'journal_entry', 10000.00, 10000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b11d4a95-bbbb-40f2-85f5-38ea7fc4594a', 'd5294767-4a80-48fc-97f9-9e0e3f6f3383', id, 'Advance payment to Shahpoor Khan for travel to Jalalabad', 10000.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '270da7ab-5b6a-4787-b271-d9c5cc89232a', 'd5294767-4a80-48fc-97f9-9e0e3f6f3383', id, 'Advance payment to Shahpoor Khan for travel to Jalalabad', 0.00, 10000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-511
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1b9a0310-79e3-414b-a7e1-3aa4dbc903ee', 'JE-000523', '2025-08-23', 'Paid for taxi to Faisal to bring cash', 'JV-JV-511', 'journal_entry', 60.00, 60.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ff413699-e46b-4356-877b-9d5112c694a6', '1b9a0310-79e3-414b-a7e1-3aa4dbc903ee', id, 'Paid for taxi to Faisal to bring cash', 60.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7555c0a7-7fdf-4130-bd54-e2f5d70ef344', '1b9a0310-79e3-414b-a7e1-3aa4dbc903ee', id, 'Paid for taxi to Faisal to bring cash', 0.00, 60.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-512
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('66909247-5dac-41bf-87cb-d10bbc195d0a', 'JE-000524', '2025-08-23', 'Paid for the day staff lunch expenses', 'JV-JV-512', 'journal_entry', 880.00, 880.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1bea184b-5681-4d95-8a06-8faab9ee9ecd', '66909247-5dac-41bf-87cb-d10bbc195d0a', id, 'Paid for the day staff lunch expenses', 380.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0808faca-79d8-4ec1-920b-ff9ee69e98da', '66909247-5dac-41bf-87cb-d10bbc195d0a', id, 'Pad for gas for the kitchen', 500.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2dcbcb5d-102b-414b-9af1-67f59f5efec6', '66909247-5dac-41bf-87cb-d10bbc195d0a', id, 'Pad for gas for the kitchen and the day lunch expenses', 0.00, 880.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-513
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8cb55033-3da0-487a-8a9d-96ced9a48518', 'JE-000525', '2025-08-23', 'Paid for the Friday food expenses', 'JV-JV-513', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2a1c7e9d-da7d-42d9-aaf5-73a73da5d038', '8cb55033-3da0-487a-8a9d-96ced9a48518', id, 'Paid for the Friday food expenses', 300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8a181bce-d1f8-4cdc-b049-08ea04cf1e7e', '8cb55033-3da0-487a-8a9d-96ced9a48518', id, 'Paid for the Friday food expenses', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-514
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('03a316ce-e6c5-4a87-80d2-78e86318c742', 'JE-000526', '2025-08-23', 'Paid for fuel for the power generator', 'JV-JV-514', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f512d5ab-ee96-4206-8718-69d5ceefd57d', '03a316ce-e6c5-4a87-80d2-78e86318c742', id, 'Paid for fuel for the power generator', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '439bae8c-5a8d-4efd-838e-c58ceb593735', '03a316ce-e6c5-4a87-80d2-78e86318c742', id, 'Paid for fuel for the power generator', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-515
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b35d50c5-1665-423d-9052-6027d0c9d264', 'JE-000527', '2025-08-23', 'Paid for fuel for the power generator', 'JV-JV-515', 'journal_entry', 400.00, 400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '80ea9cca-653c-4ca4-9a9a-88ae611b1684', 'b35d50c5-1665-423d-9052-6027d0c9d264', id, 'Paid for fuel for the power generator', 400.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3d9fa9ed-aa8f-4de8-a428-784669f39f33', 'b35d50c5-1665-423d-9052-6027d0c9d264', id, 'Paid for fuel for the power generator', 0.00, 400.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-516
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('97f1b1a9-27a6-49ba-944d-6f05c30acb27', 'JE-000528', '2025-08-23', 'Paid for the purchase of one tanker water old bill', 'JV-JV-516', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a96075e9-6905-4810-96e4-1eede6abb677', '97f1b1a9-27a6-49ba-944d-6f05c30acb27', id, 'Paid for the purchase of one tanker water old bill', 1000.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cc676399-2d53-405f-a79d-1a0cd05e3755', '97f1b1a9-27a6-49ba-944d-6f05c30acb27', id, 'Paid for the purchase of one tanker water old bill', 0.00, 1000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-517
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2e46441b-0b4c-4d28-afc2-07e07a26f919', 'JE-000529', '2025-08-23', 'Paid for the purchase of one tanker water', 'JV-JV-517', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c10818f7-e120-42e8-80a2-a1a38620ba2b', '2e46441b-0b4c-4d28-afc2-07e07a26f919', id, 'Paid for the purchase of one tanker water', 1000.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cd58f65d-d383-4007-aed3-21b7415b480d', '2e46441b-0b4c-4d28-afc2-07e07a26f919', id, 'Paid for the purchase of one tanker water', 0.00, 1000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-518
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f1152119-e251-42d1-8b12-1701fa941da9', 'JE-000530', '2025-08-24', 'Paid for purchase of AC 1800/BE Pipe, Installation for the new AC replaced and delivery fee (Added cost to JV 472 and 478)', 'JV-JV-518', 'journal_entry', 5000.00, 5000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e9526268-0465-4c35-b022-59194807406e', 'f1152119-e251-42d1-8b12-1701fa941da9', id, 'Paid for purchase of AC 1800/BE Pipe, Installation for the new AC replaced and delivery fee (Added cost to JV 472 and 478)', 5000.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'baeb2e34-4eae-4ace-9ecd-24bad8e63ec9', 'f1152119-e251-42d1-8b12-1701fa941da9', id, 'Paid for purchase of AC 1800/BE Pipe, Installation for the new AC replaced and delivery fee (Added cost to JV 472 and 478)', 0.00, 5000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-519
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f7107222-b021-41f8-9a58-696b4f7fa542', 'JE-000531', '2025-08-24', 'Paid for the day lunch', 'JV-JV-519', 'journal_entry', 560.00, 560.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7240f151-79f8-489c-bff9-1ef5064ef872', 'f7107222-b021-41f8-9a58-696b4f7fa542', id, 'Paid for the day lunch', 560.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '12a9bc46-e67f-4082-838a-3cbbf1f0c6f6', 'f7107222-b021-41f8-9a58-696b4f7fa542', id, 'Paid for the day lunch', 0.00, 560.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-520
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('582058d9-3495-41a8-9b59-910fa10c42df', 'JE-000532', '2025-08-24', 'Cash Received CR# 60 for Wifi Setup, Stationery, and some printing materials in Jalalabad Branch', 'JV-JV-520', 'journal_entry', 20000.00, 20000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ca1d136d-2a8a-475d-8876-96e464c26827', '582058d9-3495-41a8-9b59-910fa10c42df', id, 'Cash Received CR# 60 for Wifi Setup, Stationery, and some printing materials in Jalalabad Branch', 20000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '05ea194f-d813-4fed-a21b-3a7479b37dc6', '582058d9-3495-41a8-9b59-910fa10c42df', id, 'Cash Received CR# 60 for Wifi Setup, Stationery, and some printing materials in Jalalabad Branch', 0.00, 20000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-521
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('57c61cd6-ed80-48f9-b62a-192bf95d3340', 'JE-000533', '2025-08-24', 'Cash advance paid to Shahpoor Khan for the purchase of Wifi Connection, Stationery, and some printing materials for Jalalabad Branch.', 'JV-JV-521', 'journal_entry', 20000.00, 20000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd95292e8-144d-478f-b293-9b76841b4731', '57c61cd6-ed80-48f9-b62a-192bf95d3340', id, 'Cash advance paid to Shahpoor Khan for the purchase of Wifi Connection, Stationery, and some printing materials for Jalalabad Branch.', 19900.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '61d82b46-a897-4969-b936-871f8adfc074', '57c61cd6-ed80-48f9-b62a-192bf95d3340', id, 'Hawala Cost', 100.00, 0.00 FROM accounts WHERE account_code = '61807';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '67a8248e-f868-4f8b-8bad-6cd87cb5abff', '57c61cd6-ed80-48f9-b62a-192bf95d3340', id, 'Cash advance paid to Shahpoor Khan for the purchase of Wifi Connection, Stationery, and some printing materials for Jalalabad Branch.', 0.00, 20000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-522
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('00cffb1a-740e-43de-8f86-888fc07e0043', 'JE-000534', '2025-08-25', 'Paid for the day lunch and one bottle mineral water', 'JV-JV-522', 'journal_entry', 670.00, 670.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7607df30-733d-475d-a235-a9756004a4c1', '00cffb1a-740e-43de-8f86-888fc07e0043', id, 'Paid for the day lunch and one bottle mineral water', 670.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a8a8a2a2-afc4-4dff-9c71-ebbb4c7357a3', '00cffb1a-740e-43de-8f86-888fc07e0043', id, 'Paid for the day lunch and one bottle mineral water', 0.00, 670.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-523
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b1d0314c-ff20-4db1-b53e-39905047262f', 'JE-000535', '2025-08-25', 'Paid to Faisal for taxi to bring cash', 'JV-JV-523', 'journal_entry', 60.00, 60.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eee0a4a7-02dd-4f4e-933b-647269a29c36', 'b1d0314c-ff20-4db1-b53e-39905047262f', id, 'Paid to Faisal for taxi to bring cash', 60.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a55b4f7a-dc53-408b-8464-1e5b26684421', 'b1d0314c-ff20-4db1-b53e-39905047262f', id, 'Paid to Faisal for taxi to bring cash', 0.00, 60.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-524
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('063c2ec2-3769-43d0-95c2-e7f62c9f87c6', 'JE-000536', '2025-08-25', 'Cash Received CR-61 for the office daily expenses', 'JV-JV-524', 'journal_entry', 14000.00, 14000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '673f3975-5ab1-4b8d-9c7b-e273e8727fb1', '063c2ec2-3769-43d0-95c2-e7f62c9f87c6', id, 'Cash Received CR-61 for the office daily expenses', 14000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b7853553-5f35-483a-b81c-48764c834688', '063c2ec2-3769-43d0-95c2-e7f62c9f87c6', id, 'Cash Received CR-61 for the office daily expenses', 0.00, 14000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-525
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('339868a1-1b32-449f-8441-6f06cf9d86f9', 'JE-000537', '2025-08-25', 'Cash Received CR-62 for the loan disbursement in Jalalabad', 'JV-JV-525', 'journal_entry', 15000.00, 15000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '639f82e9-a354-4a3b-a822-1d45927fcd29', '339868a1-1b32-449f-8441-6f06cf9d86f9', id, 'Cash Received CR-62 for the loan disbursement in Jalalabad', 15000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2ebf4f9e-da8f-4e7f-844b-347595462416', '339868a1-1b32-449f-8441-6f06cf9d86f9', id, 'Cash Received CR-62 for the loan disbursement in Jalalabad', 0.00, 15000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-526
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e36c9181-50ae-4030-a05c-def728bba898', 'JE-000538', '2025-08-25', 'Advance paid to Shahpoor Khan for Loan disbursement in Jalalabad', 'JV-JV-526', 'journal_entry', 15000.00, 15000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '778b4365-526a-4d7f-8a67-3e85ecc343a1', 'e36c9181-50ae-4030-a05c-def728bba898', id, 'Advance paid to Shahpoor Khan for Loan disbursement in Jalalabad', 14900.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '622439f7-2a3e-4ad7-a1b7-0960219362c1', 'e36c9181-50ae-4030-a05c-def728bba898', id, 'Cost of Hawala to Jalalabad', 100.00, 0.00 FROM accounts WHERE account_code = '51300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '745e5f39-7af1-48ad-836b-248e675f9402', 'e36c9181-50ae-4030-a05c-def728bba898', id, 'Advance paid to Shahpoor Khan for Loan disbursement in Jalalabad', 0.00, 15000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-527
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c5befad9-4c91-4619-9852-67dc194d7303', 'JE-000539', '2025-08-26', 'Cash Received CR-63 for the loan disbursement in Jalalabad', 'JV-JV-527', 'journal_entry', 25000.00, 25000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd582a14b-2e50-4d40-b47d-7b90ed2bf52b', 'c5befad9-4c91-4619-9852-67dc194d7303', id, 'Cash Received CR-63 for the loan disbursement in Jalalabad', 25000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ab5c1192-e349-462d-9e5e-6859dedcf270', 'c5befad9-4c91-4619-9852-67dc194d7303', id, 'Cash Received CR-63 for the loan disbursement in Jalalabad', 0.00, 25000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-528
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('78576816-3cba-46bf-9e22-130dc38967d5', 'JE-000540', '2025-08-26', 'Advance paid to Shahpoor Khan for Loan disbursement in Jalalabad', 'JV-JV-528', 'journal_entry', 25000.00, 25000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c310ae90-beef-45aa-922d-57a02cd45770', '78576816-3cba-46bf-9e22-130dc38967d5', id, 'Advance paid to Shahpoor Khan for Loan disbursement in Jalalabad', 24900.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a685ec30-b9f0-4ebc-800e-ad461dc48e9c', '78576816-3cba-46bf-9e22-130dc38967d5', id, 'Hawala cost', 100.00, 0.00 FROM accounts WHERE account_code = '51300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '20619c43-b9e9-4c6b-be16-5b48ff471072', '78576816-3cba-46bf-9e22-130dc38967d5', id, 'Advance paid to Shahpoor Khan for Loan disbursement in Jalalabad', 0.00, 25000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-529
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('52332057-78e8-4357-9810-5a1b632b9789', 'JE-000541', '2025-08-26', 'Paid for stationery for the month September 2025 and taxi for delivery.', 'JV-JV-529', 'journal_entry', 4430.00, 4430.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '51668c58-e7b2-4192-9845-cbf9c6e6369c', '52332057-78e8-4357-9810-5a1b632b9789', id, 'Paid for stationery for the month September 2025 and taxi for delivery.', 4220.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '28317e3b-a98a-4626-bd44-662ad50c2e2e', '52332057-78e8-4357-9810-5a1b632b9789', id, 'Taxi charges paid for stationery purchase.', 210.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '93601db5-30f6-4c92-b9d4-8d6518cbcf06', '52332057-78e8-4357-9810-5a1b632b9789', id, 'Paid for stationery for the month September 2025 and taxi for delivery.', 0.00, 4430.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-530
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d5021f0d-9755-4d80-b3e7-1dad2fdb165b', 'JE-000542', '2025-08-26', 'Paid for the day lunch expenses', 'JV-JV-530', 'journal_entry', 330.00, 330.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'caf4c2a1-3822-48b0-a712-83ea21e11541', 'd5021f0d-9755-4d80-b3e7-1dad2fdb165b', id, 'Paid for the day lunch expenses', 230.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '57c27148-d10d-4c2f-952a-b87cf7bc731c', 'd5021f0d-9755-4d80-b3e7-1dad2fdb165b', id, 'Paid for the day lunch expenses', 0.00, 230.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c7ee703e-d4d1-4e3d-9a12-1cc52a096bb9', 'd5021f0d-9755-4d80-b3e7-1dad2fdb165b', id, 'Paid for mobile top up for Mr. Hanifulalh Momand', 100.00, 0.00 FROM accounts WHERE account_code = '60005';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6748bb69-3e71-4d2a-9820-7160d56870f3', 'd5021f0d-9755-4d80-b3e7-1dad2fdb165b', id, 'Paid for mobile top up for Mr. Hanifulalh Momand', 0.00, 100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-531
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('605985fe-fdbe-4bd3-ae83-789a7bda4303', 'JE-000543', '2025-08-26', 'Paid for nine days drinking water', 'JV-JV-531', 'journal_entry', 480.00, 480.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '05613dbf-d5e0-4edc-ba9b-cc225dc29f2a', '605985fe-fdbe-4bd3-ae83-789a7bda4303', id, 'Paid for nine days drinking water', 480.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4250e464-a4d4-4570-820a-f45c92bdcef2', '605985fe-fdbe-4bd3-ae83-789a7bda4303', id, 'Paid for nine days drinking water', 0.00, 480.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-532
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6f047531-5627-41c4-a0c2-00841be50c47', 'JE-000544', '2025-08-26', 'Purchased cold drinks for Mr. Abdul Ghafar on Murabaha for 12 monthly installments', 'JV-JV-532', 'journal_entry', 12311.90, 12311.90, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '584d0586-9051-4468-a3ac-3f6d41832aa7', '6f047531-5627-41c4-a0c2-00841be50c47', id, 'Purchased cold drinks for Mr. Abdul Ghafar on Murabaha for 12 monthly installments', 12311.90, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '81612680-efb4-4b9e-a4d1-ec09d20a7a17', '6f047531-5627-41c4-a0c2-00841be50c47', id, 'Purchased cold drinks for Mr. Abdul Ghafar on Murabaha for 12 monthly installments', 0.00, 12311.90 FROM accounts WHERE account_code = '20152';

-- Entry: LCI013
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5b9c782b-c271-4e6d-97ea-93754e84a350', 'JE-000545', '2025-08-26', 'Purchased cold drinks on Murabaha for Mr. Abdul Ghafar  Paendakhil on 12 months monthly installments.', 'JV-LCI013', 'financing_disbursement', 14528.04, 14528.04, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '655a9e93-6bc4-44a5-b2b5-c62777ea408d', '5b9c782b-c271-4e6d-97ea-93754e84a350', id, 'Purchased cold drinks on Murabaha for Mr. Abdul Ghafar  Paendakhil on 12 months monthly installments.', 14528.04, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7f1397ea-2a9a-4aca-8035-ac8b7f2121ed', '5b9c782b-c271-4e6d-97ea-93754e84a350', id, 'Purchased cold drinks on Murabaha for Mr. Abdul Ghafar  Paendakhil on 12 months monthly installments.', 0.00, 12311.90 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '152f162a-a7fa-4548-8379-b7d1546de52b', '5b9c782b-c271-4e6d-97ea-93754e84a350', id, 'Purchased cold drinks on Murabaha for Mr. Abdul Ghafar  Paendakhil on 12 months monthly  installments. on 18% Profit Margin', 0.00, 2216.14 FROM accounts WHERE account_code = '20900';

-- Entry: JV-533
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('222c614d-ea81-433c-bceb-292fdd3a3cf2', 'JE-000546', '2025-08-27', 'Paid for the day lunch expenses', 'JV-JV-533', 'journal_entry', 740.00, 740.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'faff9aa0-63cd-4781-b1bd-118bec5fa8ca', '222c614d-ea81-433c-bceb-292fdd3a3cf2', id, 'Paid for the day lunch expenses', 640.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8a970dd9-3f37-4aea-a700-ba7ed92c2f56', '222c614d-ea81-433c-bceb-292fdd3a3cf2', id, 'Paid for the day lunch expenses', 0.00, 640.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f35cf45d-9b81-4f7a-83d6-31909f0d69fe', '222c614d-ea81-433c-bceb-292fdd3a3cf2', id, 'Paid for the purchase of lock for the COO office cabinet', 100.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '72a36262-7289-4d0f-887a-9bf7a296943b', '222c614d-ea81-433c-bceb-292fdd3a3cf2', id, 'Paid for the purchase of lock for the COO office cabinet', 0.00, 100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-534
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('847a96bc-6c30-47ae-b3bf-995877ec6ac0', 'JE-000547', '2025-08-27', 'Purchased mobile phones on Murabaha for Mr. Laiq Ashna for one year monthly installments.', 'JV-JV-534', 'journal_entry', 25623.70, 25623.70, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7221deeb-2f2f-4b02-852c-f10a0806a9f7', '847a96bc-6c30-47ae-b3bf-995877ec6ac0', id, 'Purchased mobile phones on Murabaha for Mr. Laiq Ashna for one year monthly installments.', 25623.70, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '913eba30-187e-4e29-8c9b-cdcabb5b07c0', '847a96bc-6c30-47ae-b3bf-995877ec6ac0', id, 'Purchased mobile phones on Murabaha for Mr. Laiq Ashna for one year monthly installments.', 0.00, 25623.70 FROM accounts WHERE account_code = '20152';

-- Entry: JV-535
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('960d3eac-b8e1-4b1b-a48b-4a075bd51e2f', 'JE-000548', '2025-08-27', 'Paid for the opening of blockage in septic tank', 'JV-JV-535', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2837d30a-d920-4f14-b443-6d2d501b9294', '960d3eac-b8e1-4b1b-a48b-4a075bd51e2f', id, 'Paid for the opening of blockage in septic tank', 500.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '957e6f13-98c2-42ff-8e72-ade0d32c2f53', '960d3eac-b8e1-4b1b-a48b-4a075bd51e2f', id, 'Paid for the opening of blockage in septic tank', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-536
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('629bf998-6f72-483b-ac9c-2f4965ecea67', 'JE-000549', '2025-08-27', 'Cash Received CR# 64 for the office daily expenses', 'JV-JV-536', 'journal_entry', 15000.00, 15000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '16bdc43d-8be9-4945-ac35-33a39fdd5d4b', '629bf998-6f72-483b-ac9c-2f4965ecea67', id, 'Cash Received CR# 64 for the office daily expenses', 15000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e5357141-c874-4c74-844d-6aba2b529361', '629bf998-6f72-483b-ac9c-2f4965ecea67', id, 'Cash Received CR# 64 for the office daily expenses', 0.00, 15000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-537
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ca5c2b6f-5998-405d-a97e-e692385ce39b', 'JE-000550', '2025-08-27', 'Cash Received CR# 65 for COO salary advance for the month of Aug 2025', 'JV-JV-537', 'journal_entry', 28100.00, 28100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '339a6297-8728-4c60-9681-c76d342f699f', 'ca5c2b6f-5998-405d-a97e-e692385ce39b', id, 'Cash Received CR# 65 for COO salary advance for the month of Aug 2025', 28100.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f5830dd0-d5f1-4f9f-b4e6-16f95dfec094', 'ca5c2b6f-5998-405d-a97e-e692385ce39b', id, 'Cash Received CR# 65 for COO salary advance for the month of Aug 2025', 0.00, 28100.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-538
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4f65403e-dfcb-4a40-bca2-3d38956a332a', 'JE-000551', '2025-08-27', 'Paid salary to Shahpoor (COO) for the month of Aug 2025', 'JV-JV-538', 'journal_entry', 28100.00, 28100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '50b2aea8-0fc4-4747-ba20-c6c9b359d0a0', '4f65403e-dfcb-4a40-bca2-3d38956a332a', id, 'Paid salary to Shahpoor (COO) for the month of Aug 2025', 28100.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd54c273d-d10e-4d76-9086-1dd617e85145', '4f65403e-dfcb-4a40-bca2-3d38956a332a', id, 'Paid salary to Shahpoor (COO) for the month of Aug 2025', 0.00, 28100.00 FROM accounts WHERE account_code = '10101';

-- Entry: LCI014
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2cf1f295-d036-4ad7-97b1-4b2f71c40f9b', 'JE-000552', '2025-08-27', 'Purchased mobile phone for Mr. Laiq Ashna on Murabaha on 12 months monthly installments.', 'JV-LCI014', 'financing_disbursement', 30235.97, 30235.97, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a4bc9b0f-c164-4687-af51-74eed5ee9b43', '2cf1f295-d036-4ad7-97b1-4b2f71c40f9b', id, 'Purchased mobile phone for Mr. Laiq Ashna on Murabaha on 12 months monthly installments.', 30235.97, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4023a718-c0dc-46b5-9187-dde310f88a84', '2cf1f295-d036-4ad7-97b1-4b2f71c40f9b', id, 'Purchased mobile phone for Mr. Laiq Ashna on Murabaha on 12 months monthly installments.', 0.00, 25623.70 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7f8218c6-e4c6-45bb-9ecd-cfb42039d268', '2cf1f295-d036-4ad7-97b1-4b2f71c40f9b', id, 'Cost occurred on purchased product on loan for customers', 0.00, 4612.27 FROM accounts WHERE account_code = '20900';

-- Entry: JV-539
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3a7965b0-f4d3-4ba8-8e13-9abda104f214', 'JE-000553', '2025-08-29', 'Paid for the day food expenses', 'JV-JV-539', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '544b46b7-a6ab-4d49-825b-82b3d7c0c57e', '3a7965b0-f4d3-4ba8-8e13-9abda104f214', id, 'Paid for the day food expenses', 300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6f4c8049-b173-4813-a6f5-5310138315ae', '3a7965b0-f4d3-4ba8-8e13-9abda104f214', id, 'Paid for the day food expenses', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-540
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8d7def54-0e1e-482a-9c2f-1cbe319fe58f', 'JE-000554', '2025-08-30', 'Paid for the day food expenses and cooking oil', 'JV-JV-540', 'journal_entry', 1280.00, 1280.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '943d9de9-5691-4d65-b307-a53f3172dbbb', '8d7def54-0e1e-482a-9c2f-1cbe319fe58f', id, 'Paid for the day food expenses and cooking oil', 1280.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '80eee047-4f1d-46de-bc5e-1fdb3f906381', '8d7def54-0e1e-482a-9c2f-1cbe319fe58f', id, 'Paid for the day food expenses and cooking oil', 0.00, 1280.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-541
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e4a57db3-a98a-435f-a9b0-93df8dab03eb', 'JE-000555', '2025-08-30', 'Paid for the power generator fuel', 'JV-JV-541', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c10ff130-e9b4-4d6d-b5b2-166ac94f3fce', 'e4a57db3-a98a-435f-a9b0-93df8dab03eb', id, 'Paid for the power generator fuel', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e81791b7-e4f5-4fff-974e-4a2e0fdf9a42', 'e4a57db3-a98a-435f-a9b0-93df8dab03eb', id, 'Paid for the power generator fuel', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-542
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a3b15693-9373-41d2-ba10-2fcbcd848899', 'JE-000556', '2025-08-30', 'Activation of DSL Connection including all equipment and services.', 'JV-JV-542', 'journal_entry', 8200.00, 8200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4a4ebd35-2f47-475a-968f-e9f6508af9a4', 'a3b15693-9373-41d2-ba10-2fcbcd848899', id, 'Activation of DSL Connection including all equipment and services.', 7000.00, 0.00 FROM accounts WHERE account_code = '61201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cedce626-8936-4c72-bbdb-e11471e7ef59', 'a3b15693-9373-41d2-ba10-2fcbcd848899', id, 'Internet package of 400GB', 1200.00, 0.00 FROM accounts WHERE account_code = '61202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '57105f58-47c0-4cd2-ab9a-8cf1bdf73c49', 'a3b15693-9373-41d2-ba10-2fcbcd848899', id, 'Paid for the Activation of DSL connection including all equipment and services, and one month internet data 400 GP + communication.', 0.00, 8200.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-543
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('795f9ec8-8122-4c70-8839-fce96291176c', 'JE-000557', '2025-08-31', 'Cash received CR# 66 for AMA Annual membership fee payment for the year 2025', 'JV-JV-543', 'journal_entry', 50000.00, 50000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '019cb954-6b2e-4a06-9769-58661c6a554e', '795f9ec8-8122-4c70-8839-fce96291176c', id, 'Cash received CR# 66 for AMA Annual membership fee payment for the year 2025', 50000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '53edbee2-c976-469e-9812-17d7a40a4eb5', '795f9ec8-8122-4c70-8839-fce96291176c', id, 'Cash received CR# 66 for AMA Annual membership fee payment for the year 2025', 0.00, 50000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-544
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cc841804-6fb9-444f-ab50-e540d48f491e', 'JE-000558', '2025-08-31', 'AMA Annual membership fee payment for the year 2025', 'JV-JV-544', 'journal_entry', 50000.00, 50000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6899ba96-2c5a-49ad-a1d9-6576a31a02e1', 'cc841804-6fb9-444f-ab50-e540d48f491e', id, 'AMA Annual membership fee payment for the year 2025', 50000.00, 0.00 FROM accounts WHERE account_code = '60406';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '423abfd0-01a7-4a78-867a-bd2ef26be224', 'cc841804-6fb9-444f-ab50-e540d48f491e', id, 'AMA Annual membership fee payment for the year 2025', 0.00, 50000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-545
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('09a75de7-d55b-457a-914e-b5908e8c4725', 'JE-000559', '2025-08-31', 'Paid to Faisal Achakzai for taxi used to make payment AMA', 'JV-JV-545', 'journal_entry', 60.00, 60.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c6a71a97-cc2c-4676-9769-b5a48797fb81', '09a75de7-d55b-457a-914e-b5908e8c4725', id, 'Paid to Faisal Achakzai for taxi used to make payment AMA', 60.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5c3aabbd-fd13-4129-84d4-b04c4dfca39d', '09a75de7-d55b-457a-914e-b5908e8c4725', id, 'Paid to Faisal Achakzai for taxi used to make payment AMA', 0.00, 60.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-546
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fea647f7-01f1-403b-b437-8ffb849cc6c5', 'JE-000560', '2025-08-31', 'Paid to Faisal Achakzai for taxi used to received cash', 'JV-JV-546', 'journal_entry', 80.00, 80.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '72c6f1cd-02cb-4b18-a636-6a085c1e9fee', 'fea647f7-01f1-403b-b437-8ffb849cc6c5', id, 'Paid to Faisal Achakzai for taxi used to received cash', 80.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '93aea3a5-2c0e-4bed-9044-4a44258b8221', 'fea647f7-01f1-403b-b437-8ffb849cc6c5', id, 'Paid to Faisal Achakzai for taxi used to received cash', 0.00, 80.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-547
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9c33261a-92f6-4f2a-b4bb-8dd6861cc5a8', 'JE-000561', '2025-08-31', 'Paid for the day lunch expenses', 'JV-JV-547', 'journal_entry', 1050.00, 1050.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ac336036-9df5-47d0-86d3-343966295482', '9c33261a-92f6-4f2a-b4bb-8dd6861cc5a8', id, 'Paid for the day lunch expenses', 1050.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '90ac9639-2e2f-4cbf-86ab-d8874fe8cc19', '9c33261a-92f6-4f2a-b4bb-8dd6861cc5a8', id, 'Paid for the day lunch expenses', 0.00, 1050.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-548
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('085b6606-eee2-4b76-9f9c-7a566e37437e', 'JE-000562', '2025-08-31', 'Paid for tanker water', 'JV-JV-548', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e3c35ddf-5bcd-40b6-bea3-f6a24f2156c1', '085b6606-eee2-4b76-9f9c-7a566e37437e', id, 'Paid for tanker water', 1000.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6830ae25-72df-4f26-87d2-88366493b7e8', '085b6606-eee2-4b76-9f9c-7a566e37437e', id, 'Paid for tanker water', 0.00, 1000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-549
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('26627158-2e73-4301-8d25-84843bf7ac78', 'JE-000563', '2025-08-31', 'QuickBooks Online payment for the month of 16 July to 31 Aug 2025', 'JV-JV-549', 'journal_entry', 2568.50, 2568.50, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ea888395-04d8-467d-80eb-85e3d57ae0fd', '26627158-2e73-4301-8d25-84843bf7ac78', id, 'QuickBooks Online payment for the month of 16 July to 31 Aug 2025', 2568.50, 0.00 FROM accounts WHERE account_code = '70000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5918add2-110f-4512-bb6e-3196fa8bb4f5', '26627158-2e73-4301-8d25-84843bf7ac78', id, 'QuickBooks Online payment for the month of 16 July to 31 Aug 2025', 0.00, 2568.50 FROM accounts WHERE account_code = '13100';

-- Entry: JV-550
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d8517b16-de67-4c0e-9e9b-0b660042343f', 'JE-000564', '2025-08-31', 'Financing Officer''s Salary for the month of August 2025', 'JV-JV-550', 'journal_entry', 354141.00, 354141.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e4732afb-9399-4b92-a48f-7620c6b4c2a4', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Financing Officer''s Salary for the month of August 2025', 13500.00, 0.00 FROM accounts WHERE account_code = '51200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '06ef5865-c1d8-4f15-ac52-62db61cfbee8', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Financing Officer''s Salary for the month of August 2025', 6000.00, 0.00 FROM accounts WHERE account_code = '51200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '638c9483-d3a1-4dcd-9dc8-661b73b22e9d', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Financing Officer''s Salary for the month of August 2025', 6000.00, 0.00 FROM accounts WHERE account_code = '51200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ce62e382-edd1-4eec-a3a3-11d2cd57e4c7', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 328641.00, 0.00 FROM accounts WHERE account_code = '60001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6fbe6d3f-b330-44eb-b8d0-a4c2ebbbbb12', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 0.00, 134000.00 FROM accounts WHERE account_code = '20169';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '283c543d-7041-4380-b610-43f6fd4e9640', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 0.00, 28100.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '14e5bdf0-ac16-48b4-b63b-5c8d22e7b9f0', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 0.00, 23600.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '74550abd-3d5e-4a16-a2e7-8367e6169785', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 0.00, 23600.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0ac79e86-e60a-4273-b3bb-a11918bc3e35', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 0.00, 30000.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f25a37dd-4781-4fc4-a32f-a823b630814c', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3e1be1df-e5b8-45d4-9db5-42f52c260885', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c6a28186-0da0-436d-8bd4-24e4cdf5daca', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bb5985b7-fbfb-415b-bfc0-69aab6ff2e14', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 0.00, 5980.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3b2a64a1-1dc4-44c7-b4ab-76fb8bdfcea5', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 0.00, 6265.00 FROM accounts WHERE account_code = '20167';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '77369012-d0b8-4bb9-b792-dbc17161e2fb', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 0.00, 4597.00 FROM accounts WHERE account_code = '20166';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '302a48c2-5bde-4379-b9d4-d48c19955345', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20170';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '62992d20-b77a-4a14-a014-9d66a7953eb6', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20171';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a8d78dee-3368-4faa-84f8-1c178f714d6c', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 0.00, 6487.00 FROM accounts WHERE account_code = '20172';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '617cd923-9d90-4b82-92da-e6d972b7a936', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 0.00, 11860.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '04bb5f23-37a3-4d75-a100-56dc41b85324', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 0.00, 5980.00 FROM accounts WHERE account_code = '20174';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7f9ed088-1914-4aeb-8dcb-4b557102de44', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 0.00, 5980.00 FROM accounts WHERE account_code = '20173';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '41a01bd2-3a36-4b06-a54e-d35de8bf7c24', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary payable for the month of August 2025', 0.00, 5980.00 FROM accounts WHERE account_code = '20175';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1aebd1ec-9344-464e-a616-81fa6b48b2ae', 'd8517b16-de67-4c0e-9e9b-0b660042343f', id, 'Salary taxi payable for the month of August 2025', 0.00, 26912.00 FROM accounts WHERE account_code = '21100';

-- Entry: JV-551
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1c7df007-5bba-40f9-8350-7a0099a137a5', 'JE-000565', '2025-08-31', 'Purchased dishes for Jalalabad Branch', 'JV-JV-551', 'journal_entry', 20190.00, 20190.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '977b0e6f-4c4a-40f1-9798-c8ec667e4961', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Purchased dishes for Jalalabad Branch', 1230.00, 0.00 FROM accounts WHERE account_code = '60503';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '03877913-9ee8-4a4d-8250-8411862de234', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Purchased one fan for the office cooling', 5700.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'effb4e3f-510c-4739-9a67-c3bd14bd74e2', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Purchased stationery for the office use', 110.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e4a8f100-06e6-415a-abce-46599046f3fe', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Purchased stationery for the office use', 2450.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '40059bba-7421-4c90-ba23-bcd2320ce416', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Purchased water pot', 300.00, 0.00 FROM accounts WHERE account_code = '60505';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7a596113-9f6c-47a8-8b73-614a324b6391', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Paid for juice for the office guests', 610.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aaab1e4e-ca5b-41de-a8d8-68937e4b52e4', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Paid for making stamps for Jalalabad Branch', 800.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9b42ce2f-d3f7-460c-bfd8-b4b174b0535f', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Paid for the month Food expenses', 3550.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f1c12124-09b2-48e5-9e12-ab028af24106', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Paid for some cold drinks', 270.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e13b78cc-b97b-4bb3-a255-31aa9a2a09d3', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Purchased stationery for the Jalalabad Office', 420.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd406cfde-c49f-4ae3-a26b-b2ab885abe5a', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Purchases some small items', 540.00, 0.00 FROM accounts WHERE account_code = '80103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cc90d9b2-dc36-45d0-9320-d766c82c04f1', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Paid for the office cleaning', 100.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7137a53b-06a6-456c-bf27-92739a27971b', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Paid for mobile card', 50.00, 0.00 FROM accounts WHERE account_code = '60005';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '15b49383-94f3-4e3f-87da-292c0307b98f', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Paid for the Kunar branch food expense', 1550.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e60d91fd-dd14-42a5-9a15-c3a4b0d05dcc', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Paid for some refreshments', 230.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e768532e-8d4d-40b6-a886-076bf40c7c6e', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Paid station and photo', 220.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '53e8ddbe-5546-4206-8c5f-0d72ddf9bc10', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Paid for the purchase of some small items', 60.00, 0.00 FROM accounts WHERE account_code = '80103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '416d7264-ac27-4f15-8c38-9ee9026e86ca', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Paid for car fuel during travel to Kunar for branch opening', 2000.00, 0.00 FROM accounts WHERE account_code = '60901';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b2dc5c65-7a5f-40a5-955e-eca3f3092f48', '1c7df007-5bba-40f9-8350-7a0099a137a5', id, 'Noor Muhammad expenses in Jalalabad and Kunar Branches cleared against 20,000 advance given.', 0.00, 20190.00 FROM accounts WHERE account_code = '20168';

-- Entry: JV-552
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', 'JE-000566', '2025-08-31', 'Paid for the purchase of purchase of painting items', 'JV-JV-552', 'journal_entry', 49420.00, 49420.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '01f81e17-73da-4089-be51-6a7bd3020e9a', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Paid for the purchase of purchase of painting items', 1850.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'deae5088-b26b-41eb-a0a1-63aea39b5903', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Purchased plastic chairs', 5000.00, 0.00 FROM accounts WHERE account_code = '80103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ab3cb560-6143-471b-b197-691ad7d2c791', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Purchased 3 office chairs', 3450.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ca085d68-5077-44de-801b-d1faef49d63d', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Purchased office cabinet for the office use and 300 for transportation cost', 4800.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '24b8451f-5732-4d47-bb86-06a97f247066', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Purchased some items for office painting', 1290.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '16e61150-801a-4cd5-b85f-251f4dddb28f', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Purchased three office tables, Big, Small, and medium sizes', 6600.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '778031cf-8575-4780-bd14-68461101e59f', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Purchased stationery for the office use.', 2320.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '86273305-5a45-4cb3-8a99-597626f1e7e1', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Purchased drinking water cooler, water glass, small plastic chair, and water pot for the office use', 320.00, 0.00 FROM accounts WHERE account_code = '60505';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2f18388c-39f5-49cf-9f5e-7a2f0cdcb321', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Purchased some small items, switches, plastic hand pressure water pump,', 720.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8034168a-7a1d-41f5-9a92-76ebec208cca', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Purchased frame for the sign board', 500.00, 0.00 FROM accounts WHERE account_code = '61602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a338231e-8c6f-410f-aa07-1bcfbf748387', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Purchased carpet, foam and paid for fitting wages', 3654.00, 0.00 FROM accounts WHERE account_code = '80100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '76f58c13-86cf-4a66-9495-f465ac6be6ab', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Purchased electronic items for electricity', 1420.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '68157ec1-a614-49ea-9e4c-93cdd96679e9', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Paid for wire', 96.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f0fbd699-1a1a-41e9-9455-257f1b096107', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Paid for stationery items', 150.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6ec55b03-97d8-4562-a48f-c93279811647', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Office rent paid for the month of Asad 1404', 3000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3c1822ef-2e15-494c-9879-569161374290', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Prepaid rent for the month of Sunbula, Mizan, Aqrab 1404', 9000.00, 0.00 FROM accounts WHERE account_code = '13100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '33b445cf-54a7-42b7-8163-20e4faf8695e', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Paid for july 2025 food expense of staff', 3350.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '059b7a96-d970-46c1-9c7c-dfbeee9ad73e', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Rented track to carry equipment from Jalalabad to Kunar branch', 1700.00, 0.00 FROM accounts WHERE account_code = '60804';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'beb69aa1-c870-41cb-a30f-5d2a1b6198c7', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, 'Paid for the office cleaning', 200.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '30a83699-71e5-4ca5-9fc0-0939bad24623', 'e0a8056c-b7f0-41eb-9db4-cf4a86dc4dd5', id, '50,000 advances paid for the Kunar office opening adjustment.', 0.00, 49420.00 FROM accounts WHERE account_code = '20168';

-- Entry: JV-553
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('937f386e-6cf6-4b50-816b-32fd64276f53', 'JE-000567', '2025-08-31', 'Depreciation expense for the month of Aug 2025', 'JV-JV-553', 'journal_entry', 21594.97, 21594.97, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '752f7579-419a-42c4-90c5-38fc1309a35c', '937f386e-6cf6-4b50-816b-32fd64276f53', id, 'Depreciation expense for the month of Aug 2025', 21594.97, 0.00 FROM accounts WHERE account_code = '61900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'faab13d8-412f-42c4-8f9b-c55a0ac4dad0', '937f386e-6cf6-4b50-816b-32fd64276f53', id, 'Depreciation expense for the month of Aug 2025', 0.00, 3764.10 FROM accounts WHERE account_code = '17102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd660c2b6-4f22-41e2-a4d5-a3b4449bf56a', '937f386e-6cf6-4b50-816b-32fd64276f53', id, 'Depreciation expense for the month of Aug 2025', 0.00, 4399.17 FROM accounts WHERE account_code = '17202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ce5ec842-1a57-447b-bd04-0b72ccac6d9a', '937f386e-6cf6-4b50-816b-32fd64276f53', id, 'Depreciation expense for the month of Aug 2025', 0.00, 11327.89 FROM accounts WHERE account_code = '17302';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f062743e-e9a8-4e17-be17-cd748bfb877f', '937f386e-6cf6-4b50-816b-32fd64276f53', id, 'Depreciation expense for the month of Aug 2025', 0.00, 2103.81 FROM accounts WHERE account_code = '17502';

-- Entry: JV-554
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f70a2975-7fbb-4a51-95eb-fd98e15ba247', 'JE-000568', '2025-08-31', 'Booking 2% provision on 123,520.65 loan disbursements to 4 Kunar customers.', 'JV-JV-554', 'journal_entry', 3229.12, 3229.12, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '65fa9aba-87a3-4dc7-8fec-55822b253da0', 'f70a2975-7fbb-4a51-95eb-fd98e15ba247', id, 'Booking 2% provision on 123,520.65 loan disbursements to 4 Kunar customers.', 2470.41, 0.00 FROM accounts WHERE account_code = '80102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5f67f7b5-a2c6-45c8-9741-fafa7d96194f', 'f70a2975-7fbb-4a51-95eb-fd98e15ba247', id, 'Booking 2% provision on 37,935.60 loan disbursements to 2 Jalalabad customers.', 758.71, 0.00 FROM accounts WHERE account_code = '80102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '93f77f01-f869-4f9c-8c17-b4be0c5fcf0b', 'f70a2975-7fbb-4a51-95eb-fd98e15ba247', id, 'Booking 2% provision on 161,456.25 loan disbursements to 6 Kunar and Jalalabad customers.', 0.00, 3229.12 FROM accounts WHERE account_code = '18000';

-- Entry: JV-555
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b3189faa-73b0-4021-84fd-61fd8a10b37f', 'JE-000569', '2025-08-31', 'Bank Service charge for the month of Aug 2025', 'JV-JV-555', 'journal_entry', 1042.20, 1042.20, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '83cc5b2b-5b9c-475a-b841-cf7351b46da7', 'b3189faa-73b0-4021-84fd-61fd8a10b37f', id, 'Bank Service charge for the month of Aug 2025', 1042.20, 0.00 FROM accounts WHERE account_code = '61801';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '97214bf1-4bb3-45ee-963b-41236233fe4d', 'b3189faa-73b0-4021-84fd-61fd8a10b37f', id, 'Bank Service charge for the month of Aug 2025', 0.00, 686.31 FROM accounts WHERE account_code = '10201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '052eb909-6616-499b-acbf-ad7d6313b0bf', 'b3189faa-73b0-4021-84fd-61fd8a10b37f', id, 'Bank Service charge for the month of Aug 2025', 0.00, 205.89 FROM accounts WHERE account_code = '10203';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '88d0f8ff-4a2e-4c5c-af61-b25414241c97', 'b3189faa-73b0-4021-84fd-61fd8a10b37f', id, 'Bank Service charge for the month of Aug 2025', 0.00, 150.00 FROM accounts WHERE account_code = '10204';

-- Entry: JV-556
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('20760b8e-2a46-45dd-b06c-30266b7c48cb', 'JE-000570', '2025-09-01', 'Paid for lunch expense of staff', 'JV-JV-556', 'journal_entry', 520.00, 520.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8969d254-726b-4a96-b022-854d2347df52', '20760b8e-2a46-45dd-b06c-30266b7c48cb', id, 'Paid for lunch expense of staff', 520.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8bbb9cb7-3db3-4e6c-9e6b-401ac6bb0e9e', '20760b8e-2a46-45dd-b06c-30266b7c48cb', id, 'Paid for lunch expense of staff', 0.00, 520.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-557
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2d463112-de0c-442d-bfca-9b26d1eafc3b', 'JE-000571', '2025-09-01', 'Paid for gas for the kitchen', 'JV-JV-557', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '423c4d20-3266-42ca-b91a-746ae296d5f1', '2d463112-de0c-442d-bfca-9b26d1eafc3b', id, 'Paid for gas for the kitchen', 500.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3e217879-3592-4699-8afb-8199e096beb2', '2d463112-de0c-442d-bfca-9b26d1eafc3b', id, 'Paid for gas for the kitchen', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-558
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8a9e5cad-4aaa-41c3-b8ef-59bc93aeef2f', 'JE-000572', '2025-09-02', 'Paid for lunch expense of staff', 'JV-JV-558', 'journal_entry', 390.00, 390.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b0fb0d49-593b-45e8-a4d0-6c6d343e0918', '8a9e5cad-4aaa-41c3-b8ef-59bc93aeef2f', id, 'Paid for lunch expense of staff', 390.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c648b8cc-d155-4895-bdf3-98c019772046', '8a9e5cad-4aaa-41c3-b8ef-59bc93aeef2f', id, 'Paid for lunch expense of staff', 0.00, 390.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-559
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f829ccac-c57c-419d-9f81-0744182ce36d', 'JE-000573', '2025-09-02', 'Paid for lunch with MISFA Staff', 'JV-JV-559', 'journal_entry', 920.00, 920.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a0726955-5bfc-4c5f-83f3-ee6d561e48ed', 'f829ccac-c57c-419d-9f81-0744182ce36d', id, 'Paid for lunch with MISFA Staff', 920.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd56ca6a2-c147-471b-a2cd-cefbe7524725', 'f829ccac-c57c-419d-9f81-0744182ce36d', id, 'Paid for lunch with MISFA Staff', 0.00, 920.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-560
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0c79d982-e0f2-4e12-beb2-3138485207e5', 'JE-000574', '2025-09-03', 'Paid for lunch expense of staff', 'JV-JV-560', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '768c58ce-c3a4-45b6-b5f6-a9603a86bd2a', '0c79d982-e0f2-4e12-beb2-3138485207e5', id, 'Paid for lunch expense of staff', 300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2f7432bf-56d3-4dfa-872a-b1aea0acf9d7', '0c79d982-e0f2-4e12-beb2-3138485207e5', id, 'Paid for lunch expense of staff', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-561
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5c40a077-0980-45ce-9dd4-55c7e8a03a6d', 'JE-000575', '2025-09-03', 'Cash received CR-68 for advance payment to Shahpoor Khan for travel expense to Kunar', 'JV-JV-561', 'journal_entry', 15000.00, 15000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bdefdd1a-f115-4de6-a429-22fc595ab73f', '5c40a077-0980-45ce-9dd4-55c7e8a03a6d', id, 'Cash received CR-68 for advance payment to Shahpoor Khan for travel expense to Kunar', 15000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0709aded-975f-4c6c-9c44-546c0e2051cf', '5c40a077-0980-45ce-9dd4-55c7e8a03a6d', id, 'Cash received CR-68 for advance payment to Shahpoor Khan for travel expense to Kunar', 0.00, 15000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-562
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5920ac37-98b6-49f7-a949-3b19a22ac435', 'JE-000576', '2025-09-03', 'Cash advance paid to Shahpoor Khan for travel expenses to Kunar.', 'JV-JV-562', 'journal_entry', 15000.00, 15000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f83a8c2f-41a7-467e-813e-07e58ab33b7c', '5920ac37-98b6-49f7-a949-3b19a22ac435', id, 'Cash advance paid to Shahpoor Khan for travel expenses to Kunar.', 15000.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'edd80c20-84b7-42ab-9aaa-f30cde4f88f9', '5920ac37-98b6-49f7-a949-3b19a22ac435', id, 'Cash advance paid to Shahpoor Khan for travel expenses to Kunar.', 0.00, 15000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-563
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1c2fedb2-c44a-4795-911a-1e125f0a110c', 'JE-000577', '2025-09-05', 'Paid for lunch expenses on Friday.', 'JV-JV-563', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ec6ed118-eb53-42f4-af3a-4b92b4925c5b', '1c2fedb2-c44a-4795-911a-1e125f0a110c', id, 'Paid for lunch expenses on Friday.', 300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1ed4636f-fa71-404d-8bff-2609ce09cf10', '1c2fedb2-c44a-4795-911a-1e125f0a110c', id, 'Paid for lunch expenses on Friday.', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-564
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e394911c-47f4-487e-b84c-8695bc1f93f1', 'JE-000578', '2025-09-07', 'Paid for lunch expenses, and tissue paper for the office use.', 'JV-JV-564', 'journal_entry', 360.00, 360.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2f535100-326a-42fb-a0e9-7d63d79ad07d', 'e394911c-47f4-487e-b84c-8695bc1f93f1', id, 'Paid for lunch expenses, and tissue paper for the office use.', 360.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fe00b96c-e371-4604-9123-5d30878129d7', 'e394911c-47f4-487e-b84c-8695bc1f93f1', id, 'Paid for lunch expenses, and tissue paper for the office use.', 0.00, 360.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-565
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8b08c037-59f4-4e85-8dbc-2466f8a810b5', 'JE-000579', '2025-09-07', 'Paid for staff lunch expenses.', 'JV-JV-565', 'journal_entry', 410.00, 410.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2ce6da17-7073-463e-ac81-d0c08d826350', '8b08c037-59f4-4e85-8dbc-2466f8a810b5', id, 'Paid for staff lunch expenses.', 410.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cff1000d-0a50-415d-aac6-951f253f2aaa', '8b08c037-59f4-4e85-8dbc-2466f8a810b5', id, 'Paid for staff lunch expenses.', 0.00, 410.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-566
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c7e75030-91fb-478f-9ec7-e1bed3a16918', 'JE-000580', '2025-09-08', 'Paid for staff lunch expenses.', 'JV-JV-566', 'journal_entry', 270.00, 270.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1346655d-28e6-4466-b64f-50f413d91569', 'c7e75030-91fb-478f-9ec7-e1bed3a16918', id, 'Paid for staff lunch expenses.', 270.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '60a437bf-4b22-4334-aaba-da3fbfcbf855', 'c7e75030-91fb-478f-9ec7-e1bed3a16918', id, 'Paid for staff lunch expenses.', 0.00, 270.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-567
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3a90b2e0-069e-4cc0-b6de-35b5974d5898', 'JE-000581', '2025-09-08', 'Cash Received CR-70 for Kunar expenses.', 'JV-JV-567', 'journal_entry', 25150.00, 25150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '70c9358f-0807-400f-9a0b-4f85fbc5ae62', '3a90b2e0-069e-4cc0-b6de-35b5974d5898', id, 'Cash Received CR-70 for Kunar expenses.', 25150.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd45170a9-70ed-4af4-a1bf-e5d4e380e784', '3a90b2e0-069e-4cc0-b6de-35b5974d5898', id, 'Cash Received CR-70 for Kunar expenses.', 0.00, 25150.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-568
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0b00fafb-26f0-4f15-9880-76ba89ac4ac7', 'JE-000582', '2025-09-08', 'Advance paid to Shahpoor for Kunar Branch expenses and Hawal cost', 'JV-JV-568', 'journal_entry', 25150.00, 25150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b1fc97c4-7444-45fc-84ee-8dd083abf8f5', '0b00fafb-26f0-4f15-9880-76ba89ac4ac7', id, 'Advance paid to Shahpoor for Kunar Branch expenses and Hawal cost', 25150.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '66a85c9d-ed78-4b35-92e0-3bc29a95cf81', '0b00fafb-26f0-4f15-9880-76ba89ac4ac7', id, 'Advance paid to Shahpoor for Kunar Branch expenses and Hawal cost', 0.00, 25150.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-569
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e734d1d3-07ab-4b46-bfe3-9d8d9612b592', 'JE-000583', '2025-09-09', 'Paid for staff lunch expenses.', 'JV-JV-569', 'journal_entry', 230.00, 230.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8542508f-b0bf-4912-b594-29ca0953c2b6', 'e734d1d3-07ab-4b46-bfe3-9d8d9612b592', id, 'Paid for staff lunch expenses.', 180.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f1e752ef-7094-4307-a157-2b18f1bd75de', 'e734d1d3-07ab-4b46-bfe3-9d8d9612b592', id, 'Paid for staff lunch expenses.', 0.00, 180.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd9dd4e55-0745-44ef-bb95-95da1bd4739f', 'e734d1d3-07ab-4b46-bfe3-9d8d9612b592', id, 'Paid to Abdul Rahman Rahimi for taxi to Sediq Omar Market for Laptop Repair', 50.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7a71e3f2-ba44-48b6-bc1a-751ffd758d69', 'e734d1d3-07ab-4b46-bfe3-9d8d9612b592', id, 'Paid to Abdul Rahman Rahimi for taxi to Sediq Omar Market for Laptop Repair', 0.00, 50.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-570
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bec7e0ec-7979-46e7-839e-9a14851da055', 'JE-000584', '2025-09-09', 'First installment paid by Taiba', 'JV-JV-570', 'journal_entry', 318.81, 318.81, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2217ef7f-4964-432d-9f1e-32a79fec1964', 'bec7e0ec-7979-46e7-839e-9a14851da055', id, 'First installment paid by Taiba', 318.81, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a59bf967-dfe1-48bc-86cd-abb5e8d9a76f', 'bec7e0ec-7979-46e7-839e-9a14851da055', id, 'First installment paid by Taiba', 0.00, 318.81 FROM accounts WHERE account_code = '50300';

-- Entry: JV-571
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('269b9f84-0d94-4311-bf25-25c30709699a', 'JE-000585', '2025-09-09', 'Cash Received CR-71 for staff salary for the month of Aug 2025', 'JV-JV-571', 'journal_entry', 131830.00, 131830.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '74dd0e54-aa06-4151-891b-f3ead914be90', '269b9f84-0d94-4311-bf25-25c30709699a', id, 'Cash Received CR-71 for staff salary for the month of Aug 2025', 131830.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b2b7af8d-3540-4257-8436-730abfcc8bb7', '269b9f84-0d94-4311-bf25-25c30709699a', id, 'Cash Received CR-71 for staff salary for the month of Aug 2025', 0.00, 131830.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-572
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('608a9dff-c2b4-4320-bf5c-02e9072d9e8c', 'JE-000586', '2025-09-09', 'Paid for taxi to CFO to bring cash', 'JV-JV-572', 'journal_entry', 160.00, 160.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7920fe5d-b5e5-4a3a-a147-4332ae8a6f53', '608a9dff-c2b4-4320-bf5c-02e9072d9e8c', id, 'Paid for taxi to CFO to bring cash', 160.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '595edadd-00a2-4467-bef6-4eb4d4701f46', '608a9dff-c2b4-4320-bf5c-02e9072d9e8c', id, 'Paid for taxi to CFO to bring cash', 0.00, 160.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-573
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('aa04f3b7-c338-48f9-b073-dc5749be16b9', 'JE-000587', '2025-09-09', 'Salary paid for the month of Aug 2025', 'JV-JV-573', 'journal_entry', 125849.00, 125849.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a1f27ecd-a914-45f1-a025-b48a882394ad', 'aa04f3b7-c338-48f9-b073-dc5749be16b9', id, 'Salary paid for the month of Aug 2025', 23600.00, 0.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '04da1884-327c-4211-871a-cff0a128b2a7', 'aa04f3b7-c338-48f9-b073-dc5749be16b9', id, 'Salary paid for the month of Aug 2025', 23600.00, 0.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fec9973f-f6a7-4d10-b7c1-1083401486de', 'aa04f3b7-c338-48f9-b073-dc5749be16b9', id, 'Salary paid for the month of Aug 2025', 26500.00, 0.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '925bc262-23eb-4fc5-b54e-668157e24ce3', 'aa04f3b7-c338-48f9-b073-dc5749be16b9', id, 'Salary paid for the month of Aug 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e49cb518-b12b-4c97-9bd8-38170f15260e', 'aa04f3b7-c338-48f9-b073-dc5749be16b9', id, 'Salary paid for the month of Aug 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'de6ed17c-01fe-4be0-8da5-9e564a0ec027', 'aa04f3b7-c338-48f9-b073-dc5749be16b9', id, 'Salary paid for the month of Aug 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f65b4beb-3c7c-4fbc-a024-c28944e7440e', 'aa04f3b7-c338-48f9-b073-dc5749be16b9', id, 'Salary paid for the month of Aug 2025', 6265.00, 0.00 FROM accounts WHERE account_code = '20167';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '99b50de3-67fd-48ce-a6a0-a014e0feaf3b', 'aa04f3b7-c338-48f9-b073-dc5749be16b9', id, 'Salary paid for the month of Aug 2025', 4597.00, 0.00 FROM accounts WHERE account_code = '20166';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e290973e-253f-4b09-9481-38acfa6796a7', 'aa04f3b7-c338-48f9-b073-dc5749be16b9', id, 'Salary paid for the month of Aug 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20170';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ed1fe0b6-4809-4931-8a41-b73f2ee548ef', 'aa04f3b7-c338-48f9-b073-dc5749be16b9', id, 'Salary paid for the month of Aug 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20171';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '58d2c240-1b46-40c0-a3c9-41ed2dbb3a97', 'aa04f3b7-c338-48f9-b073-dc5749be16b9', id, 'Salary paid for the month of Aug 2025', 6487.00, 0.00 FROM accounts WHERE account_code = '20172';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '64371d6d-888a-4ed1-9379-d3e67a534ed9', 'aa04f3b7-c338-48f9-b073-dc5749be16b9', id, 'Salary paid for the month of Aug 2025', 0.00, 125849.00 FROM accounts WHERE account_code = '10101';

-- Entry: R-001
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('53c164f7-b346-4a58-aa01-be89a151e161', 'JE-000588', '2025-09-09', 'First Installment is deposited in Azizi Bank', 'JV-R-001', 'financing_repayment', 2090.00, 2090.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '20358919-4111-4729-b371-07ca86b4519f', '53c164f7-b346-4a58-aa01-be89a151e161', id, 'First Installment is deposited in Azizi Bank', 2090.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '755fd098-3e8a-48ec-a61a-67fc8d55e682', '53c164f7-b346-4a58-aa01-be89a151e161', id, '', 0.00, 2090.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-574
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f18fa684-4bc5-4fc6-a656-2d2e8804bb04', 'JE-000589', '2025-09-10', 'Paid for daily Lunch expense', 'JV-JV-574', 'journal_entry', 757.29, 757.29, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8dbcc20e-a468-41a5-bf58-1bc0d50ad375', 'f18fa684-4bc5-4fc6-a656-2d2e8804bb04', id, 'Paid for daily Lunch expense', 260.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7b043656-5367-4921-8648-5e24aad07701', 'f18fa684-4bc5-4fc6-a656-2d2e8804bb04', id, 'Paid for daily Lunch expense', 0.00, 260.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '82ae9ab8-644f-4c63-81a7-666cb8afa545', 'f18fa684-4bc5-4fc6-a656-2d2e8804bb04', id, 'First installment paid by Mr. Haqiqat Amirzai', 497.29, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '74455a53-34c0-4022-bc63-945858e8a431', 'f18fa684-4bc5-4fc6-a656-2d2e8804bb04', id, 'First installment paid by Mr. Haqiqat Amirzai', 0.00, 497.29 FROM accounts WHERE account_code = '50300';

-- Entry: R-002
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0ec4e501-305b-48af-8508-dbcac5d18227', 'JE-000590', '2025-09-10', 'First Installment is deposited in Azizi Bank', 'JV-R-002', 'financing_repayment', 3260.00, 3260.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7edb05dc-2608-46ff-8679-412ecda796d7', '0ec4e501-305b-48af-8508-dbcac5d18227', id, 'First Installment is deposited in Azizi Bank', 3260.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f43992db-cb4e-40cf-8503-8a6829fb2fc8', '0ec4e501-305b-48af-8508-dbcac5d18227', id, '', 0.00, 3260.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-575
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9918f618-58a9-40fb-a367-a283c771ce67', 'JE-000591', '2025-09-12', 'Paid for daily Lunch expense', 'JV-JV-575', 'journal_entry', 260.00, 260.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3ccc2c80-8395-4a65-a7e1-ed40ae8714cc', '9918f618-58a9-40fb-a367-a283c771ce67', id, 'Paid for daily Lunch expense', 260.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a3d4ef3c-7d12-4e06-9a44-499f21297b5f', '9918f618-58a9-40fb-a367-a283c771ce67', id, 'Paid for daily Lunch expense', 0.00, 260.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-576
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('92158320-d816-46d1-bd72-5df5a85b857b', 'JE-000592', '2025-09-13', 'Paid for the purchase of LAMEN Flag for AMA', 'JV-JV-576', 'journal_entry', 1950.00, 1950.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3153da9e-0311-4300-8f3f-c06ace4a6391', '92158320-d816-46d1-bd72-5df5a85b857b', id, 'Paid for the purchase of LAMEN Flag for AMA', 1900.00, 0.00 FROM accounts WHERE account_code = '61602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8a6c9ee3-2541-46ca-8c2c-8ef94eb466e2', '92158320-d816-46d1-bd72-5df5a85b857b', id, 'Paid for taxi by Abdul Rahman for the Delivery of Flag to AMA', 50.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cc81a51b-ed2a-4a28-a426-e99f64e2d3cf', '92158320-d816-46d1-bd72-5df5a85b857b', id, 'Paid for taxi by Abdul Rahman and purchased one Lamen Flag for AMA', 0.00, 1950.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-577
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ddeb6c85-fa8d-49b0-9551-72fa7bac2d79', 'JE-000593', '2025-09-13', 'Paid for daily Lunch expense', 'JV-JV-577', 'journal_entry', 410.00, 410.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '578edecc-a61f-4453-bbde-500d11944aca', 'ddeb6c85-fa8d-49b0-9551-72fa7bac2d79', id, 'Paid for daily Lunch expense', 410.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8a99e4fd-40fb-441f-95cf-5fa02d838ed1', 'ddeb6c85-fa8d-49b0-9551-72fa7bac2d79', id, 'Paid for daily Lunch expense', 0.00, 410.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-578
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('724df101-b417-49bf-b9de-dc4512c9b864', 'JE-000594', '2025-09-13', 'Paid for the liquid gas for the kitchen', 'JV-JV-578', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4d41ff69-5668-4063-a2d0-048eb0f52318', '724df101-b417-49bf-b9de-dc4512c9b864', id, 'Paid for the liquid gas for the kitchen', 500.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '54c5e788-288a-4053-b060-ae0d2a6bd2c4', '724df101-b417-49bf-b9de-dc4512c9b864', id, 'Paid for the liquid gas for the kitchen', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-579
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4633aca0-b4c7-4aad-9b92-6a92b790b04d', 'JE-000595', '2025-09-14', 'Paid for daily Lunch expense', 'JV-JV-579', 'journal_entry', 1040.00, 1040.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5a7a7152-5f1d-43c3-b62d-dfebe0ff322a', '4633aca0-b4c7-4aad-9b92-6a92b790b04d', id, 'Paid for daily Lunch expense', 1040.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '80bdfa53-e21d-4cc0-a9fc-384d4ecfecd3', '4633aca0-b4c7-4aad-9b92-6a92b790b04d', id, 'Paid for daily Lunch expense', 0.00, 1040.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-580
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ff8790b6-3b50-4e9d-b06c-d8e92505c6fd', 'JE-000596', '2025-09-15', 'Paid for daily Lunch expense', 'JV-JV-580', 'journal_entry', 570.00, 570.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4d9ac42e-29b5-453d-8d33-fb2650596481', 'ff8790b6-3b50-4e9d-b06c-d8e92505c6fd', id, 'Paid for daily Lunch expense', 570.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd18d1342-0268-415e-ac19-fc4690234ea2', 'ff8790b6-3b50-4e9d-b06c-d8e92505c6fd', id, 'Paid for daily Lunch expense', 0.00, 570.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-581
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('155e66dc-2faa-45ac-9145-f84dc07ca824', 'JE-000597', '2025-09-16', 'Taxi used by Muhammad Gulzar for the delivery of documents to DAB', 'JV-JV-581', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5f8b8af7-533f-4b30-94e3-3b0681d6020b', '155e66dc-2faa-45ac-9145-f84dc07ca824', id, 'Taxi used by Muhammad Gulzar for the delivery of documents to DAB', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '47445ae4-ab97-4ac2-ab5f-a7b38d186459', '155e66dc-2faa-45ac-9145-f84dc07ca824', id, 'Taxi used by Muhammad Gulzar for the delivery of documents to DAB', 0.00, 100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-582
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('92e02419-1fa0-4293-905e-e563f90ac1d7', 'JE-000598', '2025-09-16', 'Paid for lunch expense, Milk, Cream, and Drinking water', 'JV-JV-582', 'journal_entry', 1180.00, 1180.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b2af630a-8f26-4158-8f2d-86ebbd8825ae', '92e02419-1fa0-4293-905e-e563f90ac1d7', id, 'Paid for lunch expense, Milk, Cream, and Drinking water', 1080.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e75cda3d-6d6f-4566-b141-46a73de5564e', '92e02419-1fa0-4293-905e-e563f90ac1d7', id, 'Paid for lunch expense, Milk, Cream, and Drinking water', 100.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8eb1d9ac-3691-4934-985e-7d86feb525c7', '92e02419-1fa0-4293-905e-e563f90ac1d7', id, 'Paid for lunch expense, Milk, Cream, and Drinking water', 0.00, 1180.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-583
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('df0aa9aa-5406-4631-b4b6-7d72fa140119', 'JE-000599', '2025-09-17', 'Lunch expense paid for 14 meal', 'JV-JV-583', 'journal_entry', 11227.00, 11227.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9d309909-9e87-4a4e-9ecc-e2fb931963f8', 'df0aa9aa-5406-4631-b4b6-7d72fa140119', id, 'Lunch expense paid for 14 meal', 1400.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '180dabcb-dbfd-4daf-9e28-b7560bddb2f9', 'df0aa9aa-5406-4631-b4b6-7d72fa140119', id, 'Taxi used by Noor Muhammad for travel from Jalalabad to Kunar to Jalalabad', 1400.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '50a30c0d-9264-4fcd-8901-c7236041dae0', 'df0aa9aa-5406-4631-b4b6-7d72fa140119', id, 'Lunch expense paid for 8 meal', 800.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '325f7ed4-2fd0-4c70-b039-24a792d7cba9', 'df0aa9aa-5406-4631-b4b6-7d72fa140119', id, 'Lunch expense during the month of Aug', 250.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2f18f406-7d60-4c02-a0f6-9ae7bc68707b', 'df0aa9aa-5406-4631-b4b6-7d72fa140119', id, 'Paid for photo copies.', 561.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c4fff744-2554-48a2-9f46-ff53c573a641', 'df0aa9aa-5406-4631-b4b6-7d72fa140119', id, 'Paid for photo copies.', 252.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c8afd706-e6ea-422c-b1ba-720ba585b172', 'df0aa9aa-5406-4631-b4b6-7d72fa140119', id, 'lunch expense', 1000.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b2a582b3-d787-4864-8817-36d9fd5a2ceb', 'df0aa9aa-5406-4631-b4b6-7d72fa140119', id, 'Purchased A4 paper, plastic cover, and photo copies', 530.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '65e421b0-afd5-4922-8cce-17952a78ff58', 'df0aa9aa-5406-4631-b4b6-7d72fa140119', id, 'Paid for lunch expenses', 2000.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'efc82f16-2746-48dd-80ee-229f7508020d', 'df0aa9aa-5406-4631-b4b6-7d72fa140119', id, 'Purchased A4 paper ram', 200.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '91765190-6425-4a26-a1d8-fce6507073a7', 'df0aa9aa-5406-4631-b4b6-7d72fa140119', id, 'Electricity payment for the month of Saratan 1404', 2834.00, 0.00 FROM accounts WHERE account_code = '61101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b4d0869b-b31a-45e8-80ef-78ea99594c47', 'df0aa9aa-5406-4631-b4b6-7d72fa140119', id, 'Extra cash paid expensed by Noor Muhammad in addition to 10,000 Advance taken', 0.00, 1227.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5380defa-2234-48e0-8432-9e7a43879b0b', 'df0aa9aa-5406-4631-b4b6-7d72fa140119', id, '10,000 advance adjustment', 0.00, 10000.00 FROM accounts WHERE account_code = '20168';

-- Entry: JV-584
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('80036674-a3c9-46d6-9477-e56b4c3fbf82', 'JE-000600', '2025-09-17', 'Paid staff food expenses', 'JV-JV-584', 'journal_entry', 11500.00, 11500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c5a4c132-fdfc-4807-b40e-d1065cb5eb18', '80036674-a3c9-46d6-9477-e56b4c3fbf82', id, 'Paid staff food expenses', 1240.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '65f83fe1-1768-403d-8aa2-cbc3c45f1f98', '80036674-a3c9-46d6-9477-e56b4c3fbf82', id, 'Purchased plastic cover', 130.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '20a47be4-4dc4-46b7-b074-7916337860fb', '80036674-a3c9-46d6-9477-e56b4c3fbf82', id, 'Paid for staff food expenses', 3460.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5d38bba5-00bc-42ba-92ff-3650c06ef600', '80036674-a3c9-46d6-9477-e56b4c3fbf82', id, 'Purchased plastic cover', 150.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2b1ac454-5056-4f93-bae5-28225ddf2ec3', '80036674-a3c9-46d6-9477-e56b4c3fbf82', id, 'Purchased stationery for the office use', 1500.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '83d9c427-6583-4de3-aab8-40d55f626984', '80036674-a3c9-46d6-9477-e56b4c3fbf82', id, 'Purchased plastic cover', 150.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '331e216d-bcc4-45f6-b0c4-c56a8b4e911e', '80036674-a3c9-46d6-9477-e56b4c3fbf82', id, 'Paid for staff food expense', 2820.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd091b9e1-7ff4-4e1d-8783-2a37edc11951', '80036674-a3c9-46d6-9477-e56b4c3fbf82', id, 'Paid for refreshment items', 330.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7f79324a-a1ad-4996-b160-676460d94f05', '80036674-a3c9-46d6-9477-e56b4c3fbf82', id, 'Paid for plastic cover for tazkera', 130.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b50f8ef5-d456-4786-a702-681be2ff280e', '80036674-a3c9-46d6-9477-e56b4c3fbf82', id, 'Purchase gas Salander,  baking dish', 670.00, 0.00 FROM accounts WHERE account_code = '60503';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '701a4cce-5415-41bb-8286-fa33bc7cc8b2', '80036674-a3c9-46d6-9477-e56b4c3fbf82', id, 'Paid for liquid gas', 120.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fe2af32f-cdaf-49bf-b771-9305ed05abb5', '80036674-a3c9-46d6-9477-e56b4c3fbf82', id, 'laptop repair', 350.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2ece88e2-6b77-4a1d-853b-8e970de01b2c', '80036674-a3c9-46d6-9477-e56b4c3fbf82', id, 'Purchased box files for the office use', 450.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2e341940-8301-48bc-a525-08f18f21bdf0', '80036674-a3c9-46d6-9477-e56b4c3fbf82', id, 'Extra cash paid to Noor Muhammd for additional expense he made', 0.00, 1500.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2cbabde7-c836-4a88-8ff0-22c78c80bc0f', '80036674-a3c9-46d6-9477-e56b4c3fbf82', id, 'Advance adjustment of 10,000 Afghani', 0.00, 10000.00 FROM accounts WHERE account_code = '20168';

-- Entry: JV-585
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ffc069dd-9f33-42ab-9046-80f709762162', 'JE-000601', '2025-09-17', 'Taxi used by Liaqat to DAB for the delivery of documents', 'JV-JV-585', 'journal_entry', 50.00, 50.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '95a94512-95a7-4190-978a-2d96aa3ee842', 'ffc069dd-9f33-42ab-9046-80f709762162', id, 'Taxi used by Liaqat to DAB for the delivery of documents', 50.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a9393a81-9949-4f6a-bf41-1f3be1655d4c', 'ffc069dd-9f33-42ab-9046-80f709762162', id, 'Taxi used by Liaqat to DAB for the delivery of documents', 0.00, 50.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-586
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bee7ccd9-aed5-40fe-934a-d58098de4ac4', 'JE-000602', '2025-09-17', 'Paid for the day lunch expense', 'JV-JV-586', 'journal_entry', 460.00, 460.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '104731cf-53c2-4b73-b08a-2f65fab9d2cf', 'bee7ccd9-aed5-40fe-934a-d58098de4ac4', id, 'Paid for the day lunch expense', 360.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '99589c76-c823-42e9-bbf0-1327fb3913d1', 'bee7ccd9-aed5-40fe-934a-d58098de4ac4', id, 'Purchased dish washing liquid', 100.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd72969ca-a904-4836-ae68-083a68a5045a', 'bee7ccd9-aed5-40fe-934a-d58098de4ac4', id, 'Paid for the lunch expense and dish washing liquid', 0.00, 460.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-587
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a8f3db78-d641-40a2-b8c0-00f4c6c6e0de', 'JE-000603', '2025-09-18', 'Cash Received CR# 67 for two months breads payment', 'JV-JV-587', 'journal_entry', 9000.00, 9000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fd2c2b67-1797-43ae-890b-2cacd6f2da02', 'a8f3db78-d641-40a2-b8c0-00f4c6c6e0de', id, 'Cash Received CR# 67 for two months breads payment', 9000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5ad24fb4-699b-43aa-bd56-cf68a62416e7', 'a8f3db78-d641-40a2-b8c0-00f4c6c6e0de', id, 'Cash Received CR# 67 for two months breads payment', 0.00, 9000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-588
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7208c9ca-4ebe-4bf6-8594-35f661c4e28f', 'JE-000604', '2025-09-18', 'Cash Received CR# 72 for daily office expenses and electricity payment', 'JV-JV-588', 'journal_entry', 16000.00, 16000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b445d033-d699-4139-99b4-e5dc047ca38e', '7208c9ca-4ebe-4bf6-8594-35f661c4e28f', id, 'Cash Received CR# 72 for daily office expenses and electricity payment', 16000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4a1f052a-1a95-4f21-ba10-bf9eda497259', '7208c9ca-4ebe-4bf6-8594-35f661c4e28f', id, 'Cash Received CR# 72 for daily office expenses and electricity payment', 0.00, 16000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-589
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('82094be7-ce69-4a12-9f03-ef1d584f401e', 'JE-000605', '2025-09-18', 'Paid for 900 breads @10 each for two months Saratan and Assad 1404', 'JV-JV-589', 'journal_entry', 9000.00, 9000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '54e77e27-e8a0-4f9f-b9d5-a54b551022a1', '82094be7-ce69-4a12-9f03-ef1d584f401e', id, 'Paid for 900 breads @10 each for two months Saratan and Assad 1404', 9000.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0f2233a5-2f39-41bc-8355-31f1550e1420', '82094be7-ce69-4a12-9f03-ef1d584f401e', id, 'Paid for 900 breads @10 each for two months Saratan and Assad 1404', 0.00, 9000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-590
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5af23020-3001-4a43-8e5d-c773db6b72f3', 'JE-000606', '2025-09-18', 'Taxi used by Liaqat to bring cash', 'JV-JV-590', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd3b2bf2d-ac76-4cf5-a175-39fab19502ff', '5af23020-3001-4a43-8e5d-c773db6b72f3', id, 'Taxi used by Liaqat to bring cash', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '905aebf7-8035-4a31-a42e-a818edd32a82', '5af23020-3001-4a43-8e5d-c773db6b72f3', id, 'Taxi used by Liaqat to bring cash', 0.00, 150.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-591
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('715a2d4f-377f-42ed-8e64-eac271458fcc', 'JE-000607', '2025-09-18', 'Taxi used by Noor Muhammad for Kabul Jalalabad two way travel expenses', 'JV-JV-591', 'journal_entry', 1500.00, 1500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b92dff8e-3515-4833-bdc6-ca022f48946f', '715a2d4f-377f-42ed-8e64-eac271458fcc', id, 'Taxi used by Noor Muhammad for Kabul Jalalabad two way travel expenses', 1500.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '36172c65-37a6-48e8-b7e0-a2db12374406', '715a2d4f-377f-42ed-8e64-eac271458fcc', id, 'Taxi used by Noor Muhammad for Kabul Jalalabad two way travel expenses', 0.00, 1500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-592
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fd6454b7-f69f-4ff9-8243-7c22bcee0f2b', 'JE-000608', '2025-09-18', 'Taxi used by Noor Muhammad for a Kunar staff from Kunar to Jalalabad to Kabul', 'JV-JV-592', 'journal_entry', 1500.00, 1500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '815cfc13-39f4-4ceb-bd05-520b46681fd8', 'fd6454b7-f69f-4ff9-8243-7c22bcee0f2b', id, 'Taxi used by Noor Muhammad for a Kunar staff from Kunar to Jalalabad to Kabul', 1500.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8d44a12b-3c19-4908-a456-39ac61923e9c', 'fd6454b7-f69f-4ff9-8243-7c22bcee0f2b', id, 'Taxi used by Noor Muhammad for a Kunar staff from Kunar to Jalalabad to Kabul', 0.00, 1500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-593
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('65856ebc-79fb-4bf1-a797-937df9aba67c', 'JE-000609', '2025-09-19', 'Paid for the day lunch expenses', 'JV-JV-593', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5ee500a8-e09c-414f-8ff5-6892103b323b', '65856ebc-79fb-4bf1-a797-937df9aba67c', id, 'Paid for the day lunch expenses', 300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '83f6c310-f2dc-4da4-9062-c0b790cdf8dd', '65856ebc-79fb-4bf1-a797-937df9aba67c', id, 'Paid for the day lunch expenses', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-594
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8c5b2b69-bf57-42c4-a245-876b84113dd5', 'JE-000610', '2025-09-20', 'Cash received CR# 73 for disbursement in Kunar Branch and AFN 350 transfer charges', 'JV-JV-594', 'journal_entry', 125350.00, 125350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '17d2561f-ed9f-4f2f-831a-94be2d3adbc9', '8c5b2b69-bf57-42c4-a245-876b84113dd5', id, 'Cash received CR# 73 for disbursement in Kunar Branch and AFN 350 transfer charges', 125350.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '812add01-d8ed-4e4d-8dc2-fe570c0a6cfd', '8c5b2b69-bf57-42c4-a245-876b84113dd5', id, 'Cash received CR# 73 for disbursement in Kunar Branch and AFN 350 transfer charges', 0.00, 125350.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-595
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2ffb442c-1f99-4aa3-bf2a-f93fba1f208d', 'JE-000611', '2025-09-20', 'Cash transferred to Hedayatullah Branch manager for loan disbursements', 'JV-JV-595', 'journal_entry', 125350.00, 125350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '323703b5-1f90-40ab-9506-b538762effee', '2ffb442c-1f99-4aa3-bf2a-f93fba1f208d', id, 'Cash transferred to Hedayatullah Branch manager for loan disbursements', 125000.00, 0.00 FROM accounts WHERE account_code = '20173';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fc501254-41a6-4a13-b0b2-5506eba2a7b9', '2ffb442c-1f99-4aa3-bf2a-f93fba1f208d', id, 'Hawala cost for the transfer of cash to Kunar branch', 350.00, 0.00 FROM accounts WHERE account_code = '51300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9df3971d-4650-403b-800b-3559d03fa5e5', '2ffb442c-1f99-4aa3-bf2a-f93fba1f208d', id, 'Cash transferred to Hedayatullah Branch manager for loan disbursements including transfer charges', 0.00, 125350.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-596
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d3e1d956-6e07-437e-9366-2d0904f43162', 'JE-000612', '2025-09-20', 'Paid for the day lunch expenses', 'JV-JV-596', 'journal_entry', 480.00, 480.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b34d205b-ed28-4060-b4b2-b6669a5aa67b', 'd3e1d956-6e07-437e-9366-2d0904f43162', id, 'Paid for the day lunch expenses', 480.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '00f909c8-1a4b-41f7-98e0-69152e35f270', 'd3e1d956-6e07-437e-9366-2d0904f43162', id, 'Paid for the day lunch expenses', 0.00, 480.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-597
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('af9d7fa5-e9b0-4e82-be2b-a473d10dc5b8', 'JE-000613', '2025-09-20', 'Paid for taxi used by Abdul Shakoor to Shahre now for DSL phone wire purchase', 'JV-JV-597', 'journal_entry', 40.00, 40.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3edf8368-2670-4e16-a7b1-a35f402fd1e8', 'af9d7fa5-e9b0-4e82-be2b-a473d10dc5b8', id, 'Paid for taxi used by Abdul Shakoor to Shahre now for DSL phone wire purchase', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7a26de2f-a26c-4941-8d13-992209d80e6d', 'af9d7fa5-e9b0-4e82-be2b-a473d10dc5b8', id, 'Paid for taxi used by Abdul Shakoor to Shahre now for DSL phone wire purchase', 0.00, 40.00 FROM accounts WHERE account_code = '10101';

-- Entry: R-003
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('236efe7d-43c0-4a70-9173-881e32334ff9', 'JE-000614', '2025-09-21', 'First Installment is deposited in Azizi Bank', 'JV-R-003', 'financing_repayment', 12476.00, 12476.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '443bfd84-79eb-4eaa-ace2-6f67282c53f5', '236efe7d-43c0-4a70-9173-881e32334ff9', id, 'First Installment is deposited in Azizi Bank', 12476.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd11656a8-ada2-4d8b-8559-49068db2cbab', '236efe7d-43c0-4a70-9173-881e32334ff9', id, '', 0.00, 12476.00 FROM accounts WHERE account_code = '11000';

-- Entry: R-004
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b62846ad-a1c2-4b74-8752-cd51a53023cd', 'JE-000615', '2025-09-21', 'First Installment is deposited in Azizi Bank', 'JV-R-004', 'financing_repayment', 12476.00, 12476.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd460344e-0288-4688-b495-048ccd207f88', 'b62846ad-a1c2-4b74-8752-cd51a53023cd', id, 'First Installment is deposited in Azizi Bank', 12476.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f36d31fe-c1f1-4751-9d54-274bb0ffdaf9', 'b62846ad-a1c2-4b74-8752-cd51a53023cd', id, '', 0.00, 12476.00 FROM accounts WHERE account_code = '11000';

-- Entry: R-005
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('daa55f8a-12c3-4c3d-a03d-4077e20d64c3', 'JE-000616', '2025-09-21', 'First Installment is deposited in Azizi Bank', 'JV-R-005', 'financing_repayment', 13206.00, 13206.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c709e490-9566-4ba5-9920-a69a7e51170a', 'daa55f8a-12c3-4c3d-a03d-4077e20d64c3', id, 'First Installment is deposited in Azizi Bank', 13206.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cea8ea11-0ed0-404a-bb5a-857392b9a2a2', 'daa55f8a-12c3-4c3d-a03d-4077e20d64c3', id, '', 0.00, 13206.00 FROM accounts WHERE account_code = '11000';

-- Entry: R-006
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e1a92701-07b0-4c24-9fe3-c46a9bb6f95f', 'JE-000617', '2025-09-21', 'First Installment is deposited in Azizi Bank', 'JV-R-006', 'financing_repayment', 12476.00, 12476.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '48756269-8d2a-43c1-b8cc-073c6e1282c7', 'e1a92701-07b0-4c24-9fe3-c46a9bb6f95f', id, 'First Installment is deposited in Azizi Bank', 12476.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7f99b1f6-da92-459c-84f9-e9bafd271e60', 'e1a92701-07b0-4c24-9fe3-c46a9bb6f95f', id, '', 0.00, 12476.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-598
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('73e97909-f126-46d6-b3ef-065a1d03f2c2', 'JE-000618', '2025-09-21', 'Purchased RJ11 cable for DSL phone', 'JV-JV-598', 'journal_entry', 120.00, 120.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '73a4cb26-8e4e-49fd-a59b-20d54dc64b84', '73e97909-f126-46d6-b3ef-065a1d03f2c2', id, 'Purchased RJ11 cable for DSL phone', 120.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cc487908-51f8-441c-b4a9-29e0674a94cf', '73e97909-f126-46d6-b3ef-065a1d03f2c2', id, 'Purchased RJ11 cable for DSL phone', 0.00, 120.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-599
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('71a164e5-fc67-4b10-81ff-2516dfe5dbd1', 'JE-000619', '2025-09-21', 'Paid for two months electricity bill', 'JV-JV-599', 'journal_entry', 6355.00, 6355.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '29109580-c051-4fca-ad43-399b058890d6', '71a164e5-fc67-4b10-81ff-2516dfe5dbd1', id, 'Paid for two months electricity bill', 5770.00, 0.00 FROM accounts WHERE account_code = '61101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '13dc512c-26fd-402c-a4d6-32b444c0ec29', '71a164e5-fc67-4b10-81ff-2516dfe5dbd1', id, 'Paid for two months electricity bill', 0.00, 5770.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '23d1fbb5-8fdd-4472-bb1f-465acf61d130', '71a164e5-fc67-4b10-81ff-2516dfe5dbd1', id, 'Paid for lunch and toilet paper used for the office', 585.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2045a1a9-9cb2-4a33-9af7-fb1cb2ad88bf', '71a164e5-fc67-4b10-81ff-2516dfe5dbd1', id, 'Paid for lunch and toilet paper used for the office', 0.00, 585.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-600
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9996a7a9-b01e-4461-af99-041fabe90692', 'JE-000620', '2025-09-21', 'Office prepaid for the month of Sunbula 1404', 'JV-JV-600', 'journal_entry', 33000.00, 33000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b80e3b56-05f0-4c02-983a-cd661b303445', '9996a7a9-b01e-4461-af99-041fabe90692', id, 'Office prepaid for the month of Sunbula 1404', 33000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fc782a4a-c848-495c-9812-e8d56eba06d1', '9996a7a9-b01e-4461-af99-041fabe90692', id, 'House rent tax withheld for the month of Sunbula 1404', 0.00, 3000.00 FROM accounts WHERE account_code = '21200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4a1c62a6-1ffc-4258-80a2-60f4ac6377be', '9996a7a9-b01e-4461-af99-041fabe90692', id, 'Office prepaid for the month of Sunbula 1404', 0.00, 30000.00 FROM accounts WHERE account_code = '13100';

-- Entry: JV-601
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('564a9553-94b7-460b-bc10-d01c5c8e8424', 'JE-000621', '2025-09-21', 'Purchased cold drinks and some other material on Murabaha for Mr. Bahawar Khan Qazi', 'JV-JV-601', 'journal_entry', 1117133.00, 1117133.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3bf8e845-7ca0-44b9-aab2-97195ca0785e', '564a9553-94b7-460b-bc10-d01c5c8e8424', id, 'Purchased cold drinks and some other material on Murabaha for Mr. Bahawar Khan Qazi', 20000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b4a7f0c3-ff79-483b-95dd-d12b0df7221f', '564a9553-94b7-460b-bc10-d01c5c8e8424', id, 'Purchased cold drinks and some other material on Murabaha for Mr. Nuhzatullah Zaheer', 16020.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '56a00120-59d3-4dd7-bcfa-5df2f3a9bb78', '564a9553-94b7-460b-bc10-d01c5c8e8424', id, 'Purchase of resale materials on Murabaha for Mr. Mujeeb u Rahman Safi', 15000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'def1fb30-aee9-41a8-9c28-1a9c655f0540', '564a9553-94b7-460b-bc10-d01c5c8e8424', id, 'Purchased cold drinks and some other material on Murabaha for Mr. Israr Ahmad', 20463.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd860e25c-3494-40d7-a0ed-b60792b44de7', '564a9553-94b7-460b-bc10-d01c5c8e8424', id, 'Purchased cold drinks and some other material on Murabaha for Mr. Naseerullah Safi', 16000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9ad4882e-e37e-4b78-9698-b65cfbd0354e', '564a9553-94b7-460b-bc10-d01c5c8e8424', id, 'Purchased cold drinks and some other material on Murabaha for Mr. Ayoub Khan Shinwari', 12000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e6b03029-efd0-494c-9cd2-6100ba85f4c1', '564a9553-94b7-460b-bc10-d01c5c8e8424', id, 'Purchased cold drinks and some other material on Murabaha for Mr. Naqibullah Hamdard', 15000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c8eb5902-bf4a-48de-930c-33cef4f74a45', '564a9553-94b7-460b-bc10-d01c5c8e8424', id, 'Adjusted against 125,000 Advance payment', 0.00, 114483.00 FROM accounts WHERE account_code = '20173';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3d6c0145-9579-4ac7-ae4b-cce9ab3714b9', '564a9553-94b7-460b-bc10-d01c5c8e8424', id, 'Purchased Crockery equipment for Mr. Hewad Salarzai on Murabaha.', 692650.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a60645df-654d-4df4-8053-97ed3de1c91c', '564a9553-94b7-460b-bc10-d01c5c8e8424', id, 'Purchased small track for Mr. Imal Khan Salarzai on Murabaha.', 310000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2d2d111a-c9b1-47ff-aca7-9a09b43c02e4', '564a9553-94b7-460b-bc10-d01c5c8e8424', id, 'Purchased Crockery items Mr. Hewad Salarzai and Small track for Mr. Imal Khan Salarzai on Murabaha.', 0.00, 1002650.00 FROM accounts WHERE account_code = '10100';

-- Entry: LCI015
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8f0d3e67-78d1-4c7b-89b6-2174d648ad65', 'JE-000622', '2025-09-21', 'Purchased cold drinks and other resale Item form Mr. Bawar Khan Qazi on Murabaha for 12 months on 18% profit margin.', 'JV-LCI015', 'financing_disbursement', 23600.00, 23600.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '300fd098-89fc-40b0-8f97-383ccb2f0782', '8f0d3e67-78d1-4c7b-89b6-2174d648ad65', id, 'Purchased cold drinks and other resale Item form Mr. Bawar Khan Qazi on Murabaha for 12 months on 18% profit margin.', 23600.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c1b28d6f-6a84-4363-b116-076c3ac97b80', '8f0d3e67-78d1-4c7b-89b6-2174d648ad65', id, 'Purchased cold drinks and other resale Item form Mr. Bawar Khan Qazi on Murabaha for 12 months.', 0.00, 20000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '43ab3072-0ca9-4718-8cc2-636c1d60cd04', '8f0d3e67-78d1-4c7b-89b6-2174d648ad65', id, 'Purchased cold drinks and other resale Item form Mr. Bawar Khan Qazi on Murabaha for 12 months on 18% profit margin.', 0.00, 3600.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI016
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b2516bf1-e779-4190-864d-2187f98ddcda', 'JE-000623', '2025-09-21', 'Purchased resale items for Mr. Nuhzatullah Zaheer''s shop on Murabaha for 12 months, on 18% profit margin.', 'JV-LCI016', 'financing_disbursement', 18904.00, 18904.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7fca767a-bdc2-4eae-a0aa-d9825acbe41d', 'b2516bf1-e779-4190-864d-2187f98ddcda', id, 'Purchased resale items for Mr. Nuhzatullah Zaheer''s shop on Murabaha for 12 months, on 18% profit margin.', 18904.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e041a14b-9443-406e-8101-8b880877f408', 'b2516bf1-e779-4190-864d-2187f98ddcda', id, 'Purchased resale items for Mr. Nuhzatullah Zaheer''s shop on Murabaha for 12 months.', 0.00, 16020.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'df69446f-09af-4932-8cd6-db05b8c39414', 'b2516bf1-e779-4190-864d-2187f98ddcda', id, 'Purchased resale items for Mr. Nuhzatullah Zaheer''s shop on Murabaha for 12 months, on 18% profit margin.', 0.00, 2884.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI017
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('59d97732-df73-49bb-b964-b08c70b28b27', 'JE-000624', '2025-09-21', 'Purchased resale items for Mr. Mujeeb ul Rahman Safi on Murabaha for 12 months, on 18% profit margin', 'JV-LCI017', 'financing_disbursement', 17700.00, 17700.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0af6ac24-92fc-44b1-b725-5b8f248d2ce9', '59d97732-df73-49bb-b964-b08c70b28b27', id, 'Purchased resale items for Mr. Mujeeb ul Rahman Safi on Murabaha for 12 months, on 18% profit margin', 17700.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7dabd399-7fe2-441c-aabd-26e9304b348e', '59d97732-df73-49bb-b964-b08c70b28b27', id, 'Purchased resale items for Mr. Mujeeb ul Rahman Safi on Murabaha for 12 months.', 0.00, 15000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '297af3bc-0a3d-4e6f-88c5-d85ac862dbf1', '59d97732-df73-49bb-b964-b08c70b28b27', id, 'Purchased resale items for Mr. Mujeeb ul Rahman Safi on Murabaha for 12 months, on 18% profit margin', 0.00, 2700.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI018
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('753f2924-418b-430c-a3e6-6141b683f782', 'JE-000625', '2025-09-21', 'Purchased resale items for Mr. Mujeeb ul Rahman Safi on Murabaha for 12 months, on 18% profit margin.', 'JV-LCI018', 'financing_disbursement', 24146.00, 24146.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4aaf7d62-2218-4a89-ba14-9083981d4b1a', '753f2924-418b-430c-a3e6-6141b683f782', id, 'Purchased resale items for Mr. Mujeeb ul Rahman Safi on Murabaha for 12 months, on 18% profit margin.', 24146.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '90cbbe08-648e-4ccb-8c67-9e4b7605eb34', '753f2924-418b-430c-a3e6-6141b683f782', id, 'Purchased resale items for Mr. Mujeeb ul Rahman Safi on Murabaha for 12 months.', 0.00, 20463.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '765e4d8b-1caa-4ea6-b5b6-efdcc4f77aa5', '753f2924-418b-430c-a3e6-6141b683f782', id, 'Purchased resale items for Mr. Mujeeb ul Rahman Safi on Murabaha for 12 months, on 18% profit margin.', 0.00, 3683.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI019
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e406bda8-4f7a-414b-ae31-764744f24d73', 'JE-000626', '2025-09-21', 'Purchased inventory items for resale for Mr. Ayoub Khan Shinwari, for 12 months, on 18% profit margin.', 'JV-LCI019', 'financing_disbursement', 14160.00, 14160.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c87f4487-6823-46a3-8d5b-25f87d5cc1f7', 'e406bda8-4f7a-414b-ae31-764744f24d73', id, 'Purchased inventory items for resale for Mr. Ayoub Khan Shinwari, for 12 months, on 18% profit margin.', 14160.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e6aae082-7563-4c22-bb98-c52f355ab3ec', 'e406bda8-4f7a-414b-ae31-764744f24d73', id, 'Purchased inventory items for resale for Mr. Ayoub Khan Shinwari, for 12 months.', 0.00, 12000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd52e2a73-c28c-4c86-bd10-9cf1556da9c2', 'e406bda8-4f7a-414b-ae31-764744f24d73', id, 'Purchased inventory items for resale for Mr. Ayoub Khan Shinwari, for 12 months, on 18% profit margin.', 0.00, 2160.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI020
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('deaad1e4-cba0-44d1-915c-306bf94c702e', 'JE-000627', '2025-09-21', 'Purchased inventory items for resale for Mr. Naqeebullah Hamdard, for 12 months, on 18% profit margin.', 'JV-LCI020', 'financing_disbursement', 17700.00, 17700.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '93a87c5d-c0b7-4d6a-b0ce-7371470de0ea', 'deaad1e4-cba0-44d1-915c-306bf94c702e', id, 'Purchased inventory items for resale for Mr. Naqeebullah Hamdard, for 12 months, on 18% profit margin.', 17700.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f471a5f5-47a5-473f-8633-5621bc8b168e', 'deaad1e4-cba0-44d1-915c-306bf94c702e', id, 'Purchased inventory items for resale for Mr. Naqeebullah Hamdard, for 12 months.', 0.00, 15000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1f4d2e7f-28eb-4f2a-84f0-17b70c7aafd0', 'deaad1e4-cba0-44d1-915c-306bf94c702e', id, 'Purchased inventory items for resale for Mr. Naqeebullah Hamdard, for 12 months, on 18% profit margin.', 0.00, 2700.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI021
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ee4d10c3-536c-48e4-8de9-34a44b854c7a', 'JE-000628', '2025-09-21', 'Purchased Crockery equipment for Mr. Hewad Salarzai, for 21 months, on 18% profit margin.', 'JV-LCI021', 'financing_disbursement', 817327.00, 817327.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b1c10fc5-6bc1-4e27-a12e-27ea0c75123b', 'ee4d10c3-536c-48e4-8de9-34a44b854c7a', id, 'Purchased Crockery equipment for Mr. Hewad Salarzai, for 21 months, on 18% profit margin.', 817327.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fec6438f-3656-45a7-8c07-1c4da1230987', 'ee4d10c3-536c-48e4-8de9-34a44b854c7a', id, 'Purchased Crockery equipment for Mr. Hewad Salarzai, for 21 months, on 18% profit margin.', 0.00, 692650.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c0d6ffa-8da7-4644-83f7-f2e506bfc9a2', 'ee4d10c3-536c-48e4-8de9-34a44b854c7a', id, 'Purchased Crockery equipment for Mr. Hewad Salarzai, for 21 months, on 18% profit margin.', 0.00, 124677.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI022
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('de520551-fa53-4882-841a-4d158988178c', 'JE-000629', '2025-09-21', 'Purchased small track for Mr. Imal Khan Salarzai, for 21 months, on 18% profit margin.', 'JV-LCI022', 'financing_disbursement', 365800.00, 365800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '10a3707a-7c0c-4b7e-a468-e102bcda9771', 'de520551-fa53-4882-841a-4d158988178c', id, 'Purchased small track for Mr. Imal Khan Salarzai, for 21 months, on 18% profit margin.', 365800.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5b8e6c74-9bae-42e3-ad11-ea373b367386', 'de520551-fa53-4882-841a-4d158988178c', id, 'Purchased small track for Mr. Imal Khan Salarzai, for 21 months.', 0.00, 310000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e522703d-a78e-4a29-9bcb-1e296394fb24', 'de520551-fa53-4882-841a-4d158988178c', id, 'Purchased small track for Mr. Imal Khan Salarzai, for 21 months, on 18% profit margin.', 0.00, 55800.00 FROM accounts WHERE account_code = '20900';

-- Entry: JV-602
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5376b45a-1ee9-4f62-b242-341ac1e71484', 'JE-000630', '2025-09-22', 'Paid the delivery of documents from Jalalabad to Kabul', 'JV-JV-602', 'journal_entry', 350.00, 350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4f90c689-8aa6-4776-83c3-5d2e092b8215', '5376b45a-1ee9-4f62-b242-341ac1e71484', id, 'Paid the delivery of documents from Jalalabad to Kabul', 200.00, 0.00 FROM accounts WHERE account_code = '60402';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aa34a489-4a7a-46bf-91f5-9534c40f1ed9', '5376b45a-1ee9-4f62-b242-341ac1e71484', id, 'Paid for taxi used by Liaqat to receive documents from Jalalabad', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f98dcd07-1d0c-46b5-9c68-0b3839603d94', '5376b45a-1ee9-4f62-b242-341ac1e71484', id, 'Paid for taxi used by Liaqat to receive documents from Jalalabad', 0.00, 350.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-603
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0832a88d-c2d6-49a2-80e0-bed05d7c153b', 'JE-000631', '2025-09-22', 'Purchased Inventory item for Murabaha for Tawheedullah Hashimi', 'JV-JV-603', 'journal_entry', 1511305.00, 1511305.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8c50493e-57a6-48d0-aa48-f197afd7a226', '0832a88d-c2d6-49a2-80e0-bed05d7c153b', id, 'Purchased Inventory item for Murabaha for Tawheedullah Hashimi', 350000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd439e8d9-c045-4ee4-bcca-82bb5ba0854f', '0832a88d-c2d6-49a2-80e0-bed05d7c153b', id, 'Purchased Inventory item for Murabaha for Saeeduyllah Mohammadi', 59980.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '47d0dd08-cece-4c74-96ad-b213f1f62fe7', '0832a88d-c2d6-49a2-80e0-bed05d7c153b', id, 'Purchased Inventory item for Murabaha for KaKa gul mullah Gury', 649000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7a9258d0-9e7f-4d25-8fa8-d9e5fe11f7a0', '0832a88d-c2d6-49a2-80e0-bed05d7c153b', id, 'Purchased Inventory item for Murabaha Ehsanullah Majboor', 103005.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fd7eb350-cbf1-4ee0-8b13-742afa14f154', '0832a88d-c2d6-49a2-80e0-bed05d7c153b', id, 'Purchased Inventory item for Murabaha for Wali Khan Manood', 100000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9d33354d-479e-4c22-9d26-2b21bd43f10d', '0832a88d-c2d6-49a2-80e0-bed05d7c153b', id, 'Purchased Inventory item for Murabaha for Abdul Baqi', 50000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ad45430f-158f-4578-82e0-56496f4c1314', '0832a88d-c2d6-49a2-80e0-bed05d7c153b', id, 'Purchased Inventory item for Murabaha Attaulrahman Mohammdi', 100030.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a54486c7-4f8a-4ca0-89a9-bb9698fb6391', '0832a88d-c2d6-49a2-80e0-bed05d7c153b', id, 'Purchased Inventory item for Murabaha for Noorzaman Safi', 99290.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '41af6082-eee4-4dd5-b761-bdc6997364ef', '0832a88d-c2d6-49a2-80e0-bed05d7c153b', id, 'Purchased Inventory item for Murabaha', 0.00, 1511305.00 FROM accounts WHERE account_code = '10100';

-- Entry: LCI023
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2be41cd7-1215-4c74-8c6f-4e1ce099050c', 'JE-000632', '2025-09-22', 'Purchased cold drink and some other resale items for Mr. Naseerullah Safi, for 12 months, on 18% profit margin.', 'JV-LCI023', 'financing_disbursement', 18880.00, 18880.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f84278f4-73c3-457d-9e05-fee86b3b30f5', '2be41cd7-1215-4c74-8c6f-4e1ce099050c', id, 'Purchased cold drink and some other resale items for Mr. Naseerullah Safi, for 12 months, on 18% profit margin.', 18880.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a463bf7a-6ea1-46b7-9600-7942ef35ece0', '2be41cd7-1215-4c74-8c6f-4e1ce099050c', id, 'Purchased cold drink and some other resale items for Mr. Naseerullah Safi, for 12 months, on 18% profit margin.', 0.00, 16000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '52b16c9d-f2d0-401f-ba33-f72c95d8269c', '2be41cd7-1215-4c74-8c6f-4e1ce099050c', id, 'Purchased cold drink and some other resale items for Mr. Naseerullah Safi, for 12 months, on 18% profit margin.', 0.00, 2880.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI024
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('57889b3b-67e2-4a90-ac15-0013653d7651', 'JE-000633', '2025-09-22', 'Imported entry', 'JV-LCI024', 'financing_disbursement', 413000.00, 413000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6fa44ada-db1b-4952-b873-20620dbc2f05', '57889b3b-67e2-4a90-ac15-0013653d7651', id, '', 413000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4c1cdb0c-f13d-4e3d-b775-5b21bee17ec7', '57889b3b-67e2-4a90-ac15-0013653d7651', id, 'Purchased inventory items ', 0.00, 350000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '266f660c-b350-44ef-97ac-c28f4c0e5034', '57889b3b-67e2-4a90-ac15-0013653d7651', id, 'Purchased inventory items ', 0.00, 63000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI025
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('20b4f1d0-fc1f-4173-8ae4-43c0253bbf9c', 'JE-000634', '2025-09-22', 'Imported entry', 'JV-LCI025', 'financing_disbursement', 70776.40, 70776.40, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5c3ade95-ceca-41c8-9b2e-8aea891e6bcb', '20b4f1d0-fc1f-4173-8ae4-43c0253bbf9c', id, '', 70776.40, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2220b171-c401-42b8-a12b-99fb3716c212', '20b4f1d0-fc1f-4173-8ae4-43c0253bbf9c', id, 'Purchased asset for customer on loan', 0.00, 59980.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '79650645-d34e-45d4-b985-2c9c19b5b320', '20b4f1d0-fc1f-4173-8ae4-43c0253bbf9c', id, 'Cost occurred on purchased product on loan for customers', 0.00, 10796.40 FROM accounts WHERE account_code = '20900';

-- Entry: JV-604
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8a6987c9-1fc6-4e42-a2a8-8dea862a0809', 'JE-000635', '2025-09-23', 'Cash Received CR# 76 for Jalalabad Office rent payment and transfer cost', 'JV-JV-604', 'journal_entry', 28200.00, 28200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a56875a2-d3d5-4f34-a50c-6c1e907a1e7e', '8a6987c9-1fc6-4e42-a2a8-8dea862a0809', id, 'Cash Received CR# 76 for Jalalabad Office rent payment and transfer cost', 14100.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f1291423-4612-483d-b6dc-a8940b839801', '8a6987c9-1fc6-4e42-a2a8-8dea862a0809', id, 'Cash Received CR# 76 for Jalalabad Office rent payment and transfer cost', 0.00, 14100.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8e6ed53d-40f0-4eb0-94c5-f738f46fa44d', '8a6987c9-1fc6-4e42-a2a8-8dea862a0809', id, 'Advance paid to Noor Muhammad for the office rent payment for the month of Sunbula and Mizan 1404', 14000.00, 0.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8431b62b-0038-4db7-890b-e5da6bc9318d', '8a6987c9-1fc6-4e42-a2a8-8dea862a0809', id, 'Cash transfer cost', 100.00, 0.00 FROM accounts WHERE account_code = '61807';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '75a58c9f-0bd7-4e4d-84ae-5e151b812c55', '8a6987c9-1fc6-4e42-a2a8-8dea862a0809', id, 'Advance paid to Noor Muhammad for the office rent payment for the month of Sunbula and Mizan 1404 and hawala cost', 0.00, 14100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-605
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8259453a-3533-4b16-b3bf-79b2a27798d1', 'JE-000636', '2025-09-23', 'Taxi used by CFO to DAB multiple times', 'JV-JV-605', 'journal_entry', 170.00, 170.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '89fa31d3-24db-410a-ae66-e9bb749e8245', '8259453a-3533-4b16-b3bf-79b2a27798d1', id, 'Taxi used by CFO to DAB multiple times', 170.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6b1395e1-d30a-41dc-a8f1-9f60c3382fc8', '8259453a-3533-4b16-b3bf-79b2a27798d1', id, 'Taxi used by CFO to DAB multiple times', 0.00, 170.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-606
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d6b9ff93-3eac-4a42-b37e-9cbb7a1eff40', 'JE-000637', '2025-09-23', 'Taxi used by Abdul Shakoor for search about a AC', 'JV-JV-606', 'journal_entry', 200.00, 200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7fa16dd0-7294-4a74-8796-7f8c34c11222', 'd6b9ff93-3eac-4a42-b37e-9cbb7a1eff40', id, 'Taxi used by Abdul Shakoor for search about a AC', 200.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6cb829b5-bcce-45ee-8de9-3246e6e74a57', 'd6b9ff93-3eac-4a42-b37e-9cbb7a1eff40', id, 'Taxi used by Abdul Shakoor for search about a AC', 0.00, 200.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-607
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0b8bb65d-7a8a-4d74-a410-343158e4a28e', 'JE-000638', '2025-09-23', 'Paid for repairing of power generator on 28th August 2025', 'JV-JV-607', 'journal_entry', 350.00, 350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3eda0f07-3712-43f4-b881-a5eea71d9868', '0b8bb65d-7a8a-4d74-a410-343158e4a28e', id, 'Paid for repairing of power generator on 28th August 2025', 350.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0003280d-9fbb-4519-ae0a-fefeaa0c3679', '0b8bb65d-7a8a-4d74-a410-343158e4a28e', id, 'Paid for repairing of power generator on 28th August 2025', 0.00, 350.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-608
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('871401a8-4f4c-4c23-af92-e84cec600fc6', 'JE-000639', '2025-09-23', 'Paid for taxi used by Abdul Shakoor to Qaifathullah', 'JV-JV-608', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '19384ab9-05f0-41ee-8dfc-003f5c541089', '871401a8-4f4c-4c23-af92-e84cec600fc6', id, 'Paid for taxi used by Abdul Shakoor to Qaifathullah', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9fe87351-4590-42f5-94c7-a51b3fdd0906', '871401a8-4f4c-4c23-af92-e84cec600fc6', id, 'Paid for taxi used by Abdul Shakoor to Qaifathullah', 0.00, 150.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-609
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0766542a-9a07-404b-abf0-bec5f0729942', 'JE-000640', '2025-09-23', 'Paid for the repairing oil change of the power generator', 'JV-JV-609', 'journal_entry', 1050.00, 1050.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a6db7aff-5e27-4be8-a24e-e65b2b12accd', '0766542a-9a07-404b-abf0-bec5f0729942', id, 'Paid for the repairing oil change of the power generator', 1050.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '17e9f27e-d850-412b-87fa-3a80f758f7cf', '0766542a-9a07-404b-abf0-bec5f0729942', id, 'Paid for the repairing oil change of the power generator', 0.00, 1050.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-610
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ea23a9a6-e583-4c04-9daa-790cb260eb90', 'JE-000641', '2025-09-23', 'Paid for plumbing work to open the waste water blockage', 'JV-JV-610', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f1063321-023d-498e-992c-aaf45ee49a21', 'ea23a9a6-e583-4c04-9daa-790cb260eb90', id, 'Paid for plumbing work to open the waste water blockage', 300.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b0edff64-0367-4eef-9785-96538a344f81', 'ea23a9a6-e583-4c04-9daa-790cb260eb90', id, 'Paid for plumbing work to open the waste water blockage', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-611
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2c766948-8f2f-4fd0-888a-0ad7c387fcc8', 'JE-000642', '2025-09-23', 'Salary for the month of Aug 2025 paid', 'JV-JV-611', 'journal_entry', 5980.00, 5980.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0b930cdc-6eca-40c2-880b-04bf202304d5', '2c766948-8f2f-4fd0-888a-0ad7c387fcc8', id, 'Salary for the month of Aug 2025 paid', 5980.00, 0.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0855d769-ea0a-4ef5-a3e1-18520db591bc', '2c766948-8f2f-4fd0-888a-0ad7c387fcc8', id, 'Salary for the month of Aug 2025 paid', 0.00, 5980.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-612
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('61506218-9475-4425-a88b-777569f1be65', 'JE-000643', '2025-09-23', 'Paid for food expense used on 22 Sep 2025', 'JV-JV-612', 'journal_entry', 290.00, 290.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3ba4fe75-cf76-445a-a61c-c6e2b920def6', '61506218-9475-4425-a88b-777569f1be65', id, 'Paid for food expense used on 22 Sep 2025', 290.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c69ec69d-e3c0-4443-b625-35ace68209e5', '61506218-9475-4425-a88b-777569f1be65', id, 'Paid for food expense used on 22 Sep 2025', 0.00, 290.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-613
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('41daf7f3-a835-4569-b829-efa00732d51f', 'JE-000644', '2025-09-23', 'Paid for the day lunch expense', 'JV-JV-613', 'journal_entry', 200.00, 200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6ddde09e-caf6-4251-9b0d-1d124a986889', '41daf7f3-a835-4569-b829-efa00732d51f', id, 'Paid for the day lunch expense', 150.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4daf1262-06e4-41ac-96db-6a317d980553', '41daf7f3-a835-4569-b829-efa00732d51f', id, 'Purchased 5 set small batteries', 50.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4b0f15c2-f5a2-4f70-bb4b-b10cfe332ce4', '41daf7f3-a835-4569-b829-efa00732d51f', id, 'Purchased 5 set small batteries and the day food expense', 0.00, 200.00 FROM accounts WHERE account_code = '10101';

-- Entry: LCI026
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a12acd42-8933-4d92-be68-83fd7e493f01', 'JE-000645', '2025-09-23', 'Imported entry', 'JV-LCI026', 'financing_disbursement', 765820.00, 765820.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '868ed9a7-0b38-4196-8d6f-bb3b2785e78f', 'a12acd42-8933-4d92-be68-83fd7e493f01', id, '', 765820.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e5eb5bd7-aa66-42ef-bc64-414e4209ee38', 'a12acd42-8933-4d92-be68-83fd7e493f01', id, 'Purchased asset for customer on loan', 0.00, 649000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'da81fa8e-e126-4b85-8b81-bf19da161fb9', 'a12acd42-8933-4d92-be68-83fd7e493f01', id, 'Cost occurred on purchased product on loan for customers', 0.00, 116820.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI027
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f7ba6737-adc9-4593-9804-2611fb944d3d', 'JE-000646', '2025-09-23', 'Imported entry', 'JV-LCI027', 'financing_disbursement', 121546.00, 121546.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b4da5175-c7d8-4301-a714-c1a033c6b76d', 'f7ba6737-adc9-4593-9804-2611fb944d3d', id, '', 121546.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '79e9e14c-d163-4f26-a701-b733209e032e', 'f7ba6737-adc9-4593-9804-2611fb944d3d', id, 'Purchased asset for customer on loan', 0.00, 103005.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f4193e63-0a29-4491-83ca-bd9e5bda8393', 'f7ba6737-adc9-4593-9804-2611fb944d3d', id, 'Cost occurred on purchased product on loan for customers', 0.00, 18541.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI028
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('668f710a-6263-4596-9625-c7960dbaedfb', 'JE-000647', '2025-09-23', 'Imported entry', 'JV-LCI028', 'financing_disbursement', 118000.00, 118000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '360cdb23-d4a5-4e03-aaa8-69acc8697e05', '668f710a-6263-4596-9625-c7960dbaedfb', id, '', 118000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'de23aa8f-37c0-47d9-ad1b-fd99969b65c9', '668f710a-6263-4596-9625-c7960dbaedfb', id, 'Purchased asset for customer on loan', 0.00, 100000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0b161424-c482-409d-9f66-d0e6194593d3', '668f710a-6263-4596-9625-c7960dbaedfb', id, 'Cost occurred on purchased product on loan for customers', 0.00, 18000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI029
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('df3c4346-dbbe-46f6-a75c-338f1c98771c', 'JE-000648', '2025-09-23', 'Imported entry', 'JV-LCI029', 'financing_disbursement', 59000.00, 59000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '273c0748-301c-4340-b526-551bea7eaf8f', 'df3c4346-dbbe-46f6-a75c-338f1c98771c', id, '', 59000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e0c3f81-5514-406a-a333-fc1bdcb7b226', 'df3c4346-dbbe-46f6-a75c-338f1c98771c', id, 'Purchased asset for customer on loan', 0.00, 50000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9a5c2fa4-bf51-411a-a41f-ce26bee65fbe', 'df3c4346-dbbe-46f6-a75c-338f1c98771c', id, 'Cost occurred on purchased product on loan for customers', 0.00, 9000.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI030
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('54cb11b7-e03c-40e1-9865-4101b59a7593', 'JE-000649', '2025-09-23', 'Imported entry', 'JV-LCI030', 'financing_disbursement', 118035.00, 118035.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5067f8e6-2881-4bfe-8d59-6274e3aa821f', '54cb11b7-e03c-40e1-9865-4101b59a7593', id, '', 118035.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0a26453d-764a-4315-873a-11a66def9e37', '54cb11b7-e03c-40e1-9865-4101b59a7593', id, 'Purchased asset for customer on loan', 0.00, 100030.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd9a9a361-bc78-43c3-acf4-0abacb7959f9', '54cb11b7-e03c-40e1-9865-4101b59a7593', id, 'Cost occurred on purchased product on loan for customers', 0.00, 18005.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI031
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8304dade-f251-46b8-9efd-eea16aaffa83', 'JE-000650', '2025-09-23', 'Imported entry', 'JV-LCI031', 'financing_disbursement', 117162.00, 117162.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e312afa8-da66-4c28-a48e-e885a7e00031', '8304dade-f251-46b8-9efd-eea16aaffa83', id, '', 117162.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b4ddf21d-0629-4263-88d6-9a7206c4492e', '8304dade-f251-46b8-9efd-eea16aaffa83', id, 'Purchased asset for customer on loan', 0.00, 99290.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e511b95e-1514-418e-b759-3dd17800cea1', '8304dade-f251-46b8-9efd-eea16aaffa83', id, 'Cost occurred on purchased product on loan for customers', 0.00, 17872.00 FROM accounts WHERE account_code = '20900';

-- Entry: JV-614
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('dbf51d2d-fbdf-4cf1-bdcc-ca6a3a8426b3', 'JE-000651', '2025-09-24', 'Paid for the day food expense', 'JV-JV-614', 'journal_entry', 320.00, 320.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a5e9d5b3-53d1-48b9-9847-227e78baa660', 'dbf51d2d-fbdf-4cf1-bdcc-ca6a3a8426b3', id, 'Paid for the day food expense', 320.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '369a8ed7-2baa-4ae3-9c0c-3fd032e810e8', 'dbf51d2d-fbdf-4cf1-bdcc-ca6a3a8426b3', id, 'Paid for the day food expense', 0.00, 320.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-615
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5656bcf9-6b99-4c2c-8c37-f08df0beba81', 'JE-000652', '2025-09-24', 'Cash Received CR# 77 for disbursement to Client on Murabaha', 'JV-JV-615', 'journal_entry', 51000.00, 51000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5c232f59-1a43-4ac9-9d52-8924c55ffa61', '5656bcf9-6b99-4c2c-8c37-f08df0beba81', id, 'Cash Received CR# 77 for disbursement to Client on Murabaha', 51000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a09ab241-3abe-416e-b460-00bbccd6b4b1', '5656bcf9-6b99-4c2c-8c37-f08df0beba81', id, 'Cash Received CR# 77 for disbursement to Client on Murabaha', 0.00, 51000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-616
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ed812a50-e8ad-45dc-8358-d54be03c500c', 'JE-000653', '2025-09-24', 'Taxi used by Liaqat to bring cash', 'JV-JV-616', 'journal_entry', 20.00, 20.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9dbf2350-498f-4de9-9b6e-b3a4f9340a72', 'ed812a50-e8ad-45dc-8358-d54be03c500c', id, 'Taxi used by Liaqat to bring cash', 20.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '833cbd58-ec7c-4fc2-8126-d8c187b6a0e6', 'ed812a50-e8ad-45dc-8358-d54be03c500c', id, 'Taxi used by Liaqat to bring cash', 0.00, 20.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-617
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ea61faea-300d-4a95-bc0e-17c3fb4b8400', 'JE-000654', '2025-09-25', 'Purchased cold drinks and other resale items for Mr. Khoda Dost on Murabaha', 'JV-JV-617', 'journal_entry', 26535.00, 26535.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '54060ba6-798f-42c0-821c-9824c4114fbe', 'ea61faea-300d-4a95-bc0e-17c3fb4b8400', id, 'Purchased cold drinks and other resale items for Mr. Khoda Dost on Murabaha', 26535.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '15313f35-0c91-4c23-9672-36acf6a36ef4', 'ea61faea-300d-4a95-bc0e-17c3fb4b8400', id, 'Purchased cold drinks and other resale items for Mr. Khoda Dost on Murabaha', 0.00, 26535.00 FROM accounts WHERE account_code = '10101';

-- Entry: LCI032
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('47b722d2-3407-4e6b-9559-071fec442eac', 'JE-000655', '2025-09-25', 'Imported entry', 'JV-LCI032', 'financing_disbursement', 31311.00, 31311.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5092c803-9dfe-4e0f-9b42-32eaf88cfc6e', '47b722d2-3407-4e6b-9559-071fec442eac', id, '', 31311.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3c14e765-1e8a-4b04-97a8-fd7f2fbbb27c', '47b722d2-3407-4e6b-9559-071fec442eac', id, 'Purchased asset for customer on loan', 0.00, 26535.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6a506319-dcea-4ccd-ab61-783d9cf37c87', '47b722d2-3407-4e6b-9559-071fec442eac', id, 'Cost occurred on purchased product on loan for customers', 0.00, 4776.00 FROM accounts WHERE account_code = '20900';

-- Entry: JV-618
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('dfd2e70e-ef6f-4225-b35a-b21a209aa21c', 'JE-000656', '2025-09-25', 'Cash Received CR #78 for advance payment to Noor Muhammad for office expense and on Murabaha Car purchase commission.', 'JV-JV-618', 'journal_entry', 5100.00, 5100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '934334ca-2749-47a8-be66-003558d2c3a0', 'dfd2e70e-ef6f-4225-b35a-b21a209aa21c', id, 'Cash Received CR #78 for advance payment to Noor Muhammad for office expense and on Murabaha Car purchase commission.', 5100.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '06a805d9-362e-4098-bb83-fc47f43a9d49', 'dfd2e70e-ef6f-4225-b35a-b21a209aa21c', id, 'Cash Received CR #78 for advance payment to Noor Muhammad for office expense and on Murabaha Car purchase commission.', 0.00, 5100.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-619
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('afb8d9cf-1c21-46aa-9bee-acc1361d1e26', 'JE-000657', '2025-09-25', 'Advance paid to Noor Muhammad for the office expense and on Murabaha Car purchase commission payment', 'JV-JV-619', 'journal_entry', 5100.00, 5100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '54f191e4-787e-4cdf-9edc-a03e4ffc92d6', 'afb8d9cf-1c21-46aa-9bee-acc1361d1e26', id, 'Advance paid to Noor Muhammad for the office expense and on Murabaha Car purchase commission payment', 5000.00, 0.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ea4d6179-eb0e-4989-81f2-9b084b26af2a', 'afb8d9cf-1c21-46aa-9bee-acc1361d1e26', id, 'Hawala cost', 100.00, 0.00 FROM accounts WHERE account_code = '61807';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '38a36994-8f48-4c3d-964d-fcaf4703887b', 'afb8d9cf-1c21-46aa-9bee-acc1361d1e26', id, 'Advance paid to Noor Muhammad for the office expense and on Murabaha Car purchase commission payment', 0.00, 5100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-620
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ec2020a5-2671-40f7-80b8-fb73991b991b', 'JE-000658', '2025-09-27', 'Cash Received CR# 74 for CEO salary', 'JV-JV-620', 'journal_entry', 134000.00, 134000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '28682f01-2af7-4e7e-a6d5-b5e23e7ad048', 'ec2020a5-2671-40f7-80b8-fb73991b991b', id, 'Cash Received CR# 74 for CEO salary', 134000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4bd84015-d61d-4583-8125-8ac75bbdfd6b', 'ec2020a5-2671-40f7-80b8-fb73991b991b', id, 'Cash Received CR# 74 for CEO salary', 0.00, 134000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-621
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5d66a850-1bf8-4f0e-9faa-6f41fdb0187f', 'JE-000659', '2025-09-27', 'Salary for the month of Aug 2025 paid to CEO', 'JV-JV-621', 'journal_entry', 134000.00, 134000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5c347544-29f2-4144-ae5f-8d2775492ed7', '5d66a850-1bf8-4f0e-9faa-6f41fdb0187f', id, 'Salary for the month of Aug 2025 paid to CEO', 134000.00, 0.00 FROM accounts WHERE account_code = '20169';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '19e3578f-5f89-4cba-8a84-2bf21ef24c8d', '5d66a850-1bf8-4f0e-9faa-6f41fdb0187f', id, 'Salary for the month of Aug 2025 paid to CEO', 0.00, 134000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-622
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('766d3e39-9181-44d4-b073-20d6fe80ae3b', 'JE-000660', '2025-09-27', 'Cash Received CR # 79 for Loan disbursement on Murabaha to Mr. Rohullah Hazrati', 'JV-JV-622', 'journal_entry', 75000.00, 75000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2273c47b-c06a-45d7-85a2-0e0d338b7a84', '766d3e39-9181-44d4-b073-20d6fe80ae3b', id, 'Cash Received CR # 79 for Loan disbursement on Murabaha to Mr. Rohullah Hazrati', 75000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0629f740-5825-491f-8c21-d44e8cbaf76a', '766d3e39-9181-44d4-b073-20d6fe80ae3b', id, 'Cash Received CR # 79 for Loan disbursement on Murabaha to Mr. Rohullah Hazrati', 0.00, 75000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-623
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cb6aa9ec-05f0-47b2-9f5d-507e9c28d45d', 'JE-000661', '2025-09-27', 'Purchased equipment for Mr. Rohullah Hazrati in Murabaha', 'JV-JV-623', 'journal_entry', 72200.00, 72200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bc78192c-0dd8-4c1b-8365-f12b7bc7d781', 'cb6aa9ec-05f0-47b2-9f5d-507e9c28d45d', id, 'Purchased equipment for Mr. Rohullah Hazrati in Murabaha', 72200.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a950050e-015e-401d-a994-9fe86e664c1e', 'cb6aa9ec-05f0-47b2-9f5d-507e9c28d45d', id, 'Purchased equipment for Mr. Rohullah Hazrati in Murabaha', 0.00, 72200.00 FROM accounts WHERE account_code = '10101';

-- Entry: LCI033
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b21db765-241b-47bb-8285-cb6923add91c', 'JE-000662', '2025-09-27', 'Imported entry', 'JV-LCI033', 'financing_disbursement', 85196.00, 85196.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '238065f6-be4e-4a6c-8a80-78ce32d6973b', 'b21db765-241b-47bb-8285-cb6923add91c', id, '', 85196.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bdfe0c24-da19-4e23-864c-d93d5dc16dad', 'b21db765-241b-47bb-8285-cb6923add91c', id, 'Purchased asset for customer on loan', 0.00, 72200.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3900439d-dec8-447e-af78-02f5430b1d4e', 'b21db765-241b-47bb-8285-cb6923add91c', id, 'Cost occurred on purchased product on loan for customers', 0.00, 12996.00 FROM accounts WHERE account_code = '20900';

-- Entry: JV-624
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5e6c890b-34c3-449a-8175-aa17fd0e0f89', 'JE-000663', '2025-09-27', 'Paid for 27 bottles water for the office use', 'JV-JV-624', 'journal_entry', 540.00, 540.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bcb0c22f-e32c-46f7-854e-c4a3b0aee9ab', '5e6c890b-34c3-449a-8175-aa17fd0e0f89', id, 'Paid for 27 bottles water for the office use', 540.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7dfeaea2-2a8a-43a3-bc82-d272a49e3a36', '5e6c890b-34c3-449a-8175-aa17fd0e0f89', id, 'Paid for 27 bottles water for the office use', 0.00, 540.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-625
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f11b1212-9916-46aa-80ef-9b8057bbe82f', 'JE-000664', '2025-09-27', 'Paid for liquid gas for the office use', 'JV-JV-625', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'df645263-f407-43ed-81e5-1eaea5c178a6', 'f11b1212-9916-46aa-80ef-9b8057bbe82f', id, 'Paid for liquid gas for the office use', 500.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2f18c492-2d13-4727-b299-f04007338040', 'f11b1212-9916-46aa-80ef-9b8057bbe82f', id, 'Paid for liquid gas for the office use', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-626
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('df4f3ef5-6340-4438-a843-921d9b56861d', 'JE-000665', '2025-09-27', 'Paid for staff Friday expense', 'JV-JV-626', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '48e4934e-4d3c-4358-9cfc-7345fa543373', 'df4f3ef5-6340-4438-a843-921d9b56861d', id, 'Paid for staff Friday expense', 300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8849a7df-e88e-44ac-bd82-8a41bf55c6be', 'df4f3ef5-6340-4438-a843-921d9b56861d', id, 'Paid for staff Friday expense', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-627
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f2f29205-12c2-4a49-b599-7e3fdcad7a69', 'JE-000666', '2025-09-27', 'Paid taxi and documents delivery cost from Jalalabad to Kabul', 'JV-JV-627', 'journal_entry', 350.00, 350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '26bf1059-fd3c-4f94-ae07-5437ec13d014', 'f2f29205-12c2-4a49-b599-7e3fdcad7a69', id, 'Paid taxi and documents delivery cost from Jalalabad to Kabul', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c2dddb0a-713a-4167-9810-9767d3da759e', 'f2f29205-12c2-4a49-b599-7e3fdcad7a69', id, 'Paid taxi and documents delivery cost from Jalalabad to Kabul', 200.00, 0.00 FROM accounts WHERE account_code = '51100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cfbc7877-a0ee-469f-b13b-21b6a21638b7', 'f2f29205-12c2-4a49-b599-7e3fdcad7a69', id, 'Paid taxi and documents delivery cost from Jalalabad to Kabul', 0.00, 350.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-628
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0c92193f-8c5c-413b-a121-c740b34f9843', 'JE-000667', '2025-09-27', 'Paid for the staff lunch expense', 'JV-JV-628', 'journal_entry', 130.00, 130.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '20cb36e4-f3a6-4130-a820-e79dc3074390', '0c92193f-8c5c-413b-a121-c740b34f9843', id, 'Paid for the staff lunch expense', 130.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '593a5a52-b9d8-48df-9c7b-8df4388bc993', '0c92193f-8c5c-413b-a121-c740b34f9843', id, 'Paid for the staff lunch expense', 0.00, 130.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-629
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bf2608c0-fe7c-4dae-a542-c6b77688f966', 'JE-000668', '2025-09-27', 'Cash received CR# 80 for the house rent', 'JV-JV-629', 'journal_entry', 60000.00, 60000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9b2110bd-5ef0-4377-b2a2-3be6625636a3', 'bf2608c0-fe7c-4dae-a542-c6b77688f966', id, 'Cash received CR# 80 for the house rent', 60000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8075989a-b3d8-4d88-b4ed-dd12322b3f9e', 'bf2608c0-fe7c-4dae-a542-c6b77688f966', id, 'Cash received CR# 80 for the house rent', 0.00, 60000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-630
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('88e37db5-b845-4a2a-ae64-39869662c261', 'JE-000669', '2025-09-28', 'Office rent paid for the month of Mezan and Aqrab 1404', 'JV-JV-630', 'journal_entry', 60000.00, 60000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9f5d4cb1-01a5-44e0-881f-8e104a935845', '88e37db5-b845-4a2a-ae64-39869662c261', id, 'Office rent paid for the month of Mezan and Aqrab 1404', 60000.00, 0.00 FROM accounts WHERE account_code = '13100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '49730bbe-8a33-4414-8e63-dd09e0e29b63', '88e37db5-b845-4a2a-ae64-39869662c261', id, 'Office rent paid for the month of Mezan and Aqrab 1404', 0.00, 60000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-631
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cd73f0a2-b5a6-4659-9a20-1cce6c622103', 'JE-000670', '2025-09-28', 'Paid for the staff lunch expense', 'JV-JV-631', 'journal_entry', 1040.00, 1040.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '78ce0f8a-f600-43db-a731-8934c400677e', 'cd73f0a2-b5a6-4659-9a20-1cce6c622103', id, 'Paid for the staff lunch expense', 1040.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '33cd7010-f6bb-44c7-b9d8-86b88ac22e56', 'cd73f0a2-b5a6-4659-9a20-1cce6c622103', id, 'Paid for the staff lunch expense', 0.00, 1040.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-632
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('765f5ee2-ec34-4bf7-827c-797f774d5928', 'JE-000671', '2025-09-28', 'First Installment paid by Laiq Ashna', 'JV-JV-632', 'journal_entry', 384.41, 384.41, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'be97854c-e288-49a8-8953-e8800e4b4914', '765f5ee2-ec34-4bf7-827c-797f774d5928', id, 'First Installment paid by Laiq Ashna', 384.41, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6d9061d8-cb41-4f5b-b774-5532934b2272', '765f5ee2-ec34-4bf7-827c-797f774d5928', id, 'First Installment paid by Laiq Ashna', 0.00, 384.41 FROM accounts WHERE account_code = '50300';

-- Entry: R-007
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4adbc2a4-59f1-46d5-aabc-56181457e50a', 'JE-000672', '2025-09-28', 'Imported entry', 'JV-R-007', 'financing_repayment', 2520.00, 2520.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'de1b0473-3f59-44ab-a163-f954e0f87502', '4adbc2a4-59f1-46d5-aabc-56181457e50a', id, '', 2520.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aefeb3c2-b1d7-4b32-963c-1f854b446e17', '4adbc2a4-59f1-46d5-aabc-56181457e50a', id, '', 0.00, 2520.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-633
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e74819cb-114b-49be-b9e3-7d1c017bc9d0', 'JE-000673', '2025-09-29', 'Paid for taxi use to Liaqat to bring documents sent by Jalalabad branch and documents'' delivery cost', 'JV-JV-633', 'journal_entry', 1440.00, 1440.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7e9cb752-2a97-4fe8-a514-90d709ddf84e', 'e74819cb-114b-49be-b9e3-7d1c017bc9d0', id, 'Paid for taxi use to Liaqat to bring documents sent by Jalalabad branch and documents'' delivery cost', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '249f8ffa-f131-40a6-b838-601a823fd525', 'e74819cb-114b-49be-b9e3-7d1c017bc9d0', id, 'Paid for taxi use to Liaqat to bring documents sent by Jalalabad branch and documents'' delivery cost', 200.00, 0.00 FROM accounts WHERE account_code = '51100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fd45ebc8-7ec2-4ab5-a1b4-d3307080a1d4', 'e74819cb-114b-49be-b9e3-7d1c017bc9d0', id, 'Paid for taxi use to Liaqat to bring documents sent by Jalalabad branch and documents'' delivery cost', 0.00, 350.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9119f0fc-7e87-4381-affc-94f6807f80ff', 'e74819cb-114b-49be-b9e3-7d1c017bc9d0', id, 'Paid for the lunch expenses', 490.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dd6f9a50-3e1b-4e8c-b7eb-d90c5b633b9d', 'e74819cb-114b-49be-b9e3-7d1c017bc9d0', id, 'Etisalat mobile card use by COO', 100.00, 0.00 FROM accounts WHERE account_code = '60005';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6e1c5635-8c22-4ca4-bdf5-5cf671ea065a', 'e74819cb-114b-49be-b9e3-7d1c017bc9d0', id, 'Etisalat mobile card use by COO', 0.00, 590.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1939fc10-712e-4aca-b9c2-1486363b7179', 'e74819cb-114b-49be-b9e3-7d1c017bc9d0', id, 'Paid for car fuel for the office work use', 500.00, 0.00 FROM accounts WHERE account_code = '60901';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5144f6e0-aa67-4586-a1f4-42deca15c13d', 'e74819cb-114b-49be-b9e3-7d1c017bc9d0', id, 'Paid for car fuel for the office work use', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-634
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1abfd3bc-6adb-4836-a1b4-e0c7d303f961', 'JE-000674', '2025-09-29', 'First and second installments paid by Safiullah', 'JV-JV-634', 'journal_entry', 2088.00, 2088.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1d933ba9-0315-4797-9ab6-788b501f6657', '1abfd3bc-6adb-4836-a1b4-e0c7d303f961', id, 'First and second installments paid by Safiullah', 2088.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9051ca93-844d-41cb-bfbe-646a508fc255', '1abfd3bc-6adb-4836-a1b4-e0c7d303f961', id, 'First and second installments paid by Safiullah', 0.00, 2088.00 FROM accounts WHERE account_code = '50300';

-- Entry: JV-635
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e44cfbb8-1886-4660-a104-f540779d73d3', 'JE-000675', '2025-09-29', 'Cash Received CR# 82 for 12 KW solar complete system for the HQ office recorded in the accounts payable.', 'JV-JV-635', 'journal_entry', 325704.00, 325704.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c8088dd-bb39-47f8-9b06-98bcc96f8742', 'e44cfbb8-1886-4660-a104-f540779d73d3', id, 'Cash Received CR# 82 for 12 KW solar complete system for the HQ office recorded in the accounts payable.', 325704.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c7fa9bff-6a95-4396-89ee-328e3c1390a0', 'e44cfbb8-1886-4660-a104-f540779d73d3', id, 'Cash Received CR# 82 for 12 KW solar complete system for the HQ office recorded in the accounts payable.', 0.00, 325704.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-636
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c7beaa57-cb6a-4403-9e12-1db510c9e9d0', 'JE-000676', '2025-09-29', 'Cash Received CR# 82 for 12 KW solar complete system for the HQ office recorded in the accounts payable.', 'JV-JV-636', 'journal_entry', 352457.45, 352457.45, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aa581faf-a1b0-4272-94f9-161c6677f7f7', 'c7beaa57-cb6a-4403-9e12-1db510c9e9d0', id, 'Cash Received CR# 82 for 12 KW solar complete system for the HQ office recorded in the accounts payable.', 352457.45, 0.00 FROM accounts WHERE account_code = '20100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dc07f641-82a7-4032-a57e-597852d3ebd8', 'c7beaa57-cb6a-4403-9e12-1db510c9e9d0', id, 'Cash Received CR# 82 for 12 KW solar complete system for the HQ office recorded in the accounts payable.', 0.00, 325704.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e194ddec-f55e-4c66-bfc7-da609b4205dc', 'c7beaa57-cb6a-4403-9e12-1db510c9e9d0', id, 'Discount received', 0.00, 18792.00 FROM accounts WHERE account_code = '40500';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '92bf2544-f4ae-4790-a8a7-0ba8dbb4981e', 'c7beaa57-cb6a-4403-9e12-1db510c9e9d0', id, 'Gain on USD exchange rate based on DAB exchange rate.', 0.00, 7961.45 FROM accounts WHERE account_code = '61802';

-- Entry: R-008
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7b69075a-cf3b-46b3-b1a5-9a9867fc563d', 'JE-000677', '2025-09-29', 'Received the first and second installments together but shorter with 81 Afghani', 'JV-R-008', 'financing_repayment', 13688.00, 13688.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8c9989b5-fbbc-4de7-9efc-501467419be6', '7b69075a-cf3b-46b3-b1a5-9a9867fc563d', id, 'Received the first and second installments together but shorter with 81 Afghani', 13688.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'da3150cf-53f5-4394-aa45-0fb5977e1f07', '7b69075a-cf3b-46b3-b1a5-9a9867fc563d', id, '', 0.00, 13688.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-637
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('025f46d3-26df-4666-bf71-e28425af5c6c', 'JE-000678', '2025-09-30', 'Paid for lunch and tissue paper for the office use', 'JV-JV-637', 'journal_entry', 200.00, 200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '71f234d0-0f7d-4e44-8ca1-bfc5c39c519b', '025f46d3-26df-4666-bf71-e28425af5c6c', id, 'Paid for lunch and tissue paper for the office use', 200.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '61f36eb6-0a5b-4ab1-a223-b33d67b00f1f', '025f46d3-26df-4666-bf71-e28425af5c6c', id, 'Paid for lunch and tissue paper for the office use', 0.00, 200.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-638
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b6e52430-d1f2-4641-859e-7d8a18e94426', 'JE-000679', '2025-09-30', 'Booked depreciation expense for the month of Sep 2025', 'JV-JV-638', 'journal_entry', 21594.97, 21594.97, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '67eddb5c-7913-4503-9e2c-0fc8c99cb1a0', 'b6e52430-d1f2-4641-859e-7d8a18e94426', id, 'Booked depreciation expense for the month of Sep 2025', 21594.97, 0.00 FROM accounts WHERE account_code = '61900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2b7a2734-82aa-4201-b1fe-24c718516aee', 'b6e52430-d1f2-4641-859e-7d8a18e94426', id, 'Booked depreciation expense for the month of Sep 2025', 0.00, 3764.10 FROM accounts WHERE account_code = '17102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '30316682-f1d0-4208-a657-22ac018ad69f', 'b6e52430-d1f2-4641-859e-7d8a18e94426', id, 'Booked depreciation expense for the month of Sep 2025', 0.00, 4399.17 FROM accounts WHERE account_code = '17202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f5fab500-003f-48fb-b7b5-2e441129522f', 'b6e52430-d1f2-4641-859e-7d8a18e94426', id, 'Booked depreciation expense for the month of Sep 2025', 0.00, 11327.89 FROM accounts WHERE account_code = '17302';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9a6bfc61-103c-4fe7-9c07-3926fabb4dc2', 'b6e52430-d1f2-4641-859e-7d8a18e94426', id, 'Booked depreciation expense for the month of Sep 2025', 0.00, 2103.81 FROM accounts WHERE account_code = '17502';

-- Entry: JV-639
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7bad93e1-075e-4b07-99f9-8a339c2f817a', 'JE-000680', '2025-09-30', 'Jalalabad Office rent prepaid for the month of Sunbula 1404', 'JV-JV-639', 'journal_entry', 3000.00, 3000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c0fa6549-bf78-4209-9ba8-8884b6f16a45', '7bad93e1-075e-4b07-99f9-8a339c2f817a', id, 'Jalalabad Office rent prepaid for the month of Sunbula 1404', 3000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6f8b4df0-1ea6-472c-9b91-e6f3b3d5bbeb', '7bad93e1-075e-4b07-99f9-8a339c2f817a', id, 'Jalalabad Office rent prepaid for the month of Sunbula 1404', 0.00, 3000.00 FROM accounts WHERE account_code = '13100';

-- Entry: JV-640
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7b29e170-949a-46c0-93da-ae30e4060c34', 'JE-000681', '2025-09-30', 'Loan provision booked for the month of Sep 2025 for Kabul', 'JV-JV-640', 'journal_entry', 54543.46, 54543.46, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a0300fc6-caa3-4955-a5a8-83e2bbe3a655', '7b29e170-949a-46c0-93da-ae30e4060c34', id, 'Loan provision booked for the month of Sep 2025 for Kabul', 1974.70, 0.00 FROM accounts WHERE account_code = '80102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '35163a41-8366-4d75-92b9-19ed530e96cb', '7b29e170-949a-46c0-93da-ae30e4060c34', id, 'Loan provision booked for the month of Sep 2025 for Kunar', 32515.76, 0.00 FROM accounts WHERE account_code = '80102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '08e9ef8e-a784-4f02-ade7-6c33fb675e99', '7b29e170-949a-46c0-93da-ae30e4060c34', id, 'Loan provision booked for the month of Sep 2025 for Jalalabad', 20053.00, 0.00 FROM accounts WHERE account_code = '80102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '389f6f52-8461-4c3b-a424-f17bb0930a75', '7b29e170-949a-46c0-93da-ae30e4060c34', id, 'Loan provision booked for the month of Sep 2025 for Kabul, Kunar, Jalalabad', 0.00, 54543.46 FROM accounts WHERE account_code = '18000';

-- Entry: JV-641
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c910f7ec-68f8-4f4e-ab0b-13557df51151', 'JE-000682', '2025-09-30', 'Kabul Financing officer''s salary payable for the month of Sep 2025', 'JV-JV-641', 'journal_entry', 346838.00, 346838.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ccc112c5-b986-486f-94f2-461f7bc7c4b3', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Kabul Financing officer''s salary payable for the month of Sep 2025', 13000.00, 0.00 FROM accounts WHERE account_code = '51200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2235c9dc-6356-49c9-8307-c773bcc015d3', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Kunar Financing officer''s salary payable for the month of Sep 2025', 6000.00, 0.00 FROM accounts WHERE account_code = '51200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ceb81689-1917-43a7-a1d4-b553817585a7', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Jalalabad Financing officer''s salary payable for the month of Sep 2025', 6000.00, 0.00 FROM accounts WHERE account_code = '51200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '39818ca8-7542-4774-a2e7-93f98f0fcbe5', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Staff salary payable for the month of Sep 2025', 321838.00, 0.00 FROM accounts WHERE account_code = '60001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ef4796b3-bc35-4007-9a8b-3e39c5d02cbe', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Staff salary payable for the month of Sep 2025', 0.00, 134000.00 FROM accounts WHERE account_code = '20169';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9806eb20-5ae0-4690-a2c0-df6e6220034c', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Staff salary payable for the month of Sep 2025', 0.00, 28100.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0e8c67ed-7775-4ff1-8b80-c3f05cb74bb6', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Staff salary payable for the month of Sep 2025', 0.00, 23600.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8c52bf1a-49e9-4002-a120-c07cb8bfbb8c', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Staff salary payable for the month of Sep 2025', 0.00, 23600.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c17bf149-ee67-4f1e-a877-150da5a078e0', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Staff salary payable for the month of Sep 2025', 0.00, 30000.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2be4b0b1-8ad3-44e5-86f5-25f8c2d71cf7', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Staff salary payable for the month of Sep 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0a4b750c-acf6-49ce-b157-02f745c3cf4c', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Staff salary payable for the month of Sep 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c5c735a1-3d50-423e-8407-f77797140857', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Staff salary payable for the month of Sep 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4fcc7674-465a-4e98-86e5-c0b4e3472637', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Staff salary payable for the month of Sep 2025', 0.00, 5980.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5a280d41-3dc6-4545-8ed4-59c28955d43b', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Staff salary payable for the month of Sep 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20170';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b1b28dcc-bc9e-4ecd-904b-cf68a5f900c2', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Staff salary payable for the month of Sep 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20171';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f17a1f17-1c54-48e5-8111-5bd6142cef28', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Staff salary payable for the month of Sep 2025', 0.00, 10000.00 FROM accounts WHERE account_code = '20172';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '66be0695-fe75-47ff-bc39-0be6828cce07', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Staff salary payable for the month of Sep 2025', 0.00, 11860.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '02666d98-1cd3-4bbc-99f1-f738630afc10', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Staff salary payable for the month of Sep 2025', 0.00, 5980.00 FROM accounts WHERE account_code = '20174';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fe8cb860-643b-40a9-a559-8fd926fc7fb9', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Staff salary payable for the month of Sep 2025', 0.00, 5980.00 FROM accounts WHERE account_code = '20173';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '23cdc5e8-a7b0-4303-933a-b1db93a8b4ef', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Staff salary payable for the month of Sep 2025', 0.00, 5980.00 FROM accounts WHERE account_code = '20175';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '405da2e8-27ed-4f9a-b685-b9f0fded8e6e', 'c910f7ec-68f8-4f4e-ab0b-13557df51151', id, 'Staff salary payable for the month of Sep 2025', 0.00, 26958.00 FROM accounts WHERE account_code = '21100';

-- Entry: JV-642
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b4878081-6950-4678-81e3-0e933812a2f8', 'JE-000683', '2025-09-30', 'Bank charges for the month of Sep 2025', 'JV-JV-642', 'journal_entry', 1372.48, 1372.48, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1103055a-1ac7-4d66-852c-27608467486b', 'b4878081-6950-4678-81e3-0e933812a2f8', id, 'Bank charges for the month of Sep 2025', 1372.48, 0.00 FROM accounts WHERE account_code = '61801';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b55ce2ea-98fe-4a9b-9438-fc24caee6e8d', 'b4878081-6950-4678-81e3-0e933812a2f8', id, 'Bank charges for the month of Sep 2025', 0.00, 671.14 FROM accounts WHERE account_code = '10201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '87008d34-df57-4bc2-9d1e-563d72e961cf', 'b4878081-6950-4678-81e3-0e933812a2f8', id, 'Bank charges for the month of Sep 2025', 0.00, 201.34 FROM accounts WHERE account_code = '10203';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '827ab6ef-4f74-47ad-824b-be76cbad7e68', 'b4878081-6950-4678-81e3-0e933812a2f8', id, 'Bank charges for the month of Sep 2025', 0.00, 150.00 FROM accounts WHERE account_code = '10204';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cd62c433-8602-41d1-b3b3-56a45188851d', 'b4878081-6950-4678-81e3-0e933812a2f8', id, 'Bank charges for the month of Sep 2025', 0.00, 350.00 FROM accounts WHERE account_code = '10206';

-- Entry: JV-643
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('265a1543-89fa-45da-8c4d-8e7889541c21', 'JE-000684', '2025-10-02', 'Received Cash CR # 84 advance payment to Hidayat', 'JV-JV-643', 'journal_entry', 6150.00, 6150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c241e51b-9c47-4d64-a770-e27f8982f7bb', '265a1543-89fa-45da-8c4d-8e7889541c21', id, 'Received Cash CR # 84 advance payment to Hidayat', 6150.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cfa1e12c-f954-4a07-b9e3-d76d34c8faee', '265a1543-89fa-45da-8c4d-8e7889541c21', id, 'Received Cash CR # 84 advance payment to Hidayat', 0.00, 6150.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-644
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('363c4d63-7d68-4245-97b9-f78679d266dd', 'JE-000685', '2025-10-02', 'Advance paid to Hidayat for Kunar branch expenses', 'JV-JV-644', 'journal_entry', 6150.00, 6150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '031eee03-d1f8-4696-b2f5-1014ccaebbc6', '363c4d63-7d68-4245-97b9-f78679d266dd', id, 'Advance paid to Hidayat for Kunar branch expenses', 6000.00, 0.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cb4e6546-6a72-49bd-a2e3-e9814cb2f4f1', '363c4d63-7d68-4245-97b9-f78679d266dd', id, 'Cost of cash transfer', 150.00, 0.00 FROM accounts WHERE account_code = '61807';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd2dd14a8-a87f-4500-b648-7715a91f2dcd', '363c4d63-7d68-4245-97b9-f78679d266dd', id, 'Advance paid to Hidayat for Kunar branch expenses and cost of cash transfer', 0.00, 6150.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-645
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('354b511a-d99a-461c-9531-38b4c59b0346', 'JE-000686', '2025-10-02', 'Received Cash CR # 83 for the daily office expenses', 'JV-JV-645', 'journal_entry', 12000.00, 12000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '51415742-5252-4583-ac70-6cf9a82ff5ef', '354b511a-d99a-461c-9531-38b4c59b0346', id, 'Received Cash CR # 83 for the daily office expenses', 12000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ffb643e5-8bf4-4caa-ac88-dc17df2df733', '354b511a-d99a-461c-9531-38b4c59b0346', id, 'Received Cash CR # 83 for the daily office expenses', 0.00, 12000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-646
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5082518a-f170-4505-a0cc-6609d939ce42', 'JE-000687', '2025-10-02', 'Paid for lunch, tissue paper and battery cells for the office use', 'JV-JV-646', 'journal_entry', 710.00, 710.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e96684ae-f5c0-4444-8c91-52d064d01c68', '5082518a-f170-4505-a0cc-6609d939ce42', id, 'Paid for lunch, tissue paper and battery cells for the office use', 500.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bbc255e2-a608-4296-be31-a8df3f667973', '5082518a-f170-4505-a0cc-6609d939ce42', id, 'Paid for lunch, tissue paper and battery cells for the office use', 190.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cd0b8dde-4edb-42c6-90f3-72b52430e507', '5082518a-f170-4505-a0cc-6609d939ce42', id, 'Paid for lunch, tissue paper and battery cells for the office use', 20.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dccedf09-c449-4705-8df6-ec0dbdcadff6', '5082518a-f170-4505-a0cc-6609d939ce42', id, 'Paid for lunch, tissue paper and battery cells for the office use', 0.00, 710.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-647
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('688fb569-08e7-4ba6-9a31-efff848e7fe2', 'JE-000688', '2025-10-02', 'Paid for taxi used by Liaqat to bring documents sent by Jalalabad', 'JV-JV-647', 'journal_entry', 1340.00, 1340.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'faa75dca-7387-4dd3-abfb-fbdd213e6268', '688fb569-08e7-4ba6-9a31-efff848e7fe2', id, 'Paid for taxi used by Liaqat to bring documents sent by Jalalabad', 130.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6addceba-583e-4399-8bca-ec80139b5eb0', '688fb569-08e7-4ba6-9a31-efff848e7fe2', id, 'Paid for taxi used by Liaqat to bring documents sent by Jalalabad', 0.00, 130.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '06dec491-9404-482c-a430-444540a0fae4', '688fb569-08e7-4ba6-9a31-efff848e7fe2', id, '', 1210.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '894a941a-b86d-4eef-a426-af0ba00e1e4b', '688fb569-08e7-4ba6-9a31-efff848e7fe2', id, '', 0.00, 1210.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-648
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0a011f87-8095-412b-9960-a3467436d546', 'JE-000689', '2025-10-04', 'First installment paid by Abdul Ghafar Payenda Khil', 'JV-JV-648', 'journal_entry', 217.80, 217.80, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bb110ce9-896a-4255-a36d-873324f2cb56', '0a011f87-8095-412b-9960-a3467436d546', id, 'First installment paid by Abdul Ghafar Payenda Khil', 217.80, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b508a712-21bd-41fe-b009-88bdddd8f530', '0a011f87-8095-412b-9960-a3467436d546', id, 'First installment paid by Abdul Ghafar Payenda Khil', 0.00, 217.80 FROM accounts WHERE account_code = '50300';

-- Entry: JV-649
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d89c46f4-cf60-4631-8001-80b805c2a4ad', 'JE-000690', '2025-10-04', 'Paid for the internet bill for the month of Oct 2025', 'JV-JV-649', 'journal_entry', 6420.00, 6420.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'adf3fe8d-e560-42ca-9e34-82c66f8b2556', 'd89c46f4-cf60-4631-8001-80b805c2a4ad', id, 'Paid for the internet bill for the month of Oct 2025', 6000.00, 0.00 FROM accounts WHERE account_code = '61202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e2341c2d-3c50-4aba-844b-e5d5af7a5ba4', 'd89c46f4-cf60-4631-8001-80b805c2a4ad', id, 'Paid for the internet bill for the month of Oct 2025', 0.00, 6000.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e21da62b-e0e3-4198-beb8-edbb3308f845', 'd89c46f4-cf60-4631-8001-80b805c2a4ad', id, 'Paid for lunch expense of the day', 420.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '10c51874-1b70-4410-a435-6936bd7809e0', 'd89c46f4-cf60-4631-8001-80b805c2a4ad', id, 'Paid for lunch expense of the day', 0.00, 420.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-650
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('094a68a2-ba53-43a9-a2de-4f31589fe095', 'JE-000691', '2025-10-04', 'Paid for taxi and documents delivery charges to Liaqat for bring documents delivered from Jalalabad', 'JV-JV-650', 'journal_entry', 290.00, 290.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4961cf06-3e28-475c-8d3b-7d1834b3862e', '094a68a2-ba53-43a9-a2de-4f31589fe095', id, 'Paid for taxi and documents delivery charges to Liaqat for bring documents delivered from Jalalabad', 290.00, 0.00 FROM accounts WHERE account_code = '60402';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b16a9f24-4c41-4b4d-aa40-82eb17e2cdaf', '094a68a2-ba53-43a9-a2de-4f31589fe095', id, 'Paid for taxi and documents delivery charges to Liaqat for bring documents delivered from Jalalabad', 0.00, 290.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-651
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3614cc02-200c-4a9c-a374-2b198f19cbf7', 'JE-000692', '2025-10-05', 'Paid for the day lunch', 'JV-JV-651', 'journal_entry', 420.00, 420.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '13ac170f-0168-42e1-98ca-5d79b879c09a', '3614cc02-200c-4a9c-a374-2b198f19cbf7', id, 'Paid for the day lunch', 420.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5602e66e-f855-4ed8-b10e-67d6256860f6', '3614cc02-200c-4a9c-a374-2b198f19cbf7', id, 'Paid for the day lunch', 0.00, 420.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-652
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9eb85f58-17b5-4a05-8e6f-443ee4f402a0', 'JE-000693', '2025-10-05', 'Paid for Kunar and Jalalabad branches employees'' dinner visiting HQ', 'JV-JV-652', 'journal_entry', 240.00, 240.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '558d4ed5-ede2-4100-9298-ce6502db150d', '9eb85f58-17b5-4a05-8e6f-443ee4f402a0', id, 'Paid for Kunar and Jalalabad branches employees'' dinner visiting HQ', 120.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bdf91e5c-fb05-4225-bf38-44ed7ff0dc22', '9eb85f58-17b5-4a05-8e6f-443ee4f402a0', id, 'Paid for Kunar and Jalalabad branches employees'' dinner visiting HQ', 120.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b46a1235-f983-4a93-861d-fa013347923f', '9eb85f58-17b5-4a05-8e6f-443ee4f402a0', id, 'Paid for Kunar and Jalalabad branches employees'' dinner visiting HQ', 0.00, 240.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-653
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d5dbea69-8c38-488e-abb2-3298aaa1ae4b', 'JE-000694', '2025-10-05', 'Taxi used by Gulzar for the office work', 'JV-JV-653', 'journal_entry', 40.00, 40.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a0633688-d8aa-4b17-9ecd-0e93ee4d30c3', 'd5dbea69-8c38-488e-abb2-3298aaa1ae4b', id, 'Taxi used by Gulzar for the office work', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'be2a0d15-b036-4e07-97f0-9e8ae4be3838', 'd5dbea69-8c38-488e-abb2-3298aaa1ae4b', id, 'Taxi used by Gulzar for the office work', 0.00, 40.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-654
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('454cfe20-abf2-4407-8acd-ca985a6e9c7f', 'JE-000695', '2025-10-06', 'Paid for the day lunch and shampoo for dishwashing', 'JV-JV-654', 'journal_entry', 840.00, 840.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '706ad632-7d9a-4653-b821-51bc1f116aff', '454cfe20-abf2-4407-8acd-ca985a6e9c7f', id, 'Paid for the day lunch and shampoo for dishwashing', 590.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f7d2de39-93fe-4e6d-b127-49b177f0a3f8', '454cfe20-abf2-4407-8acd-ca985a6e9c7f', id, 'Paid for the day lunch and shampoo for dishwashing', 100.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1e1d4442-6211-44f8-a6f0-a47d48930acc', '454cfe20-abf2-4407-8acd-ca985a6e9c7f', id, 'Paid for the day lunch and shampoo for dishwashing', 150.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2026dfb4-00b6-43be-a955-ca9735f19aa4', '454cfe20-abf2-4407-8acd-ca985a6e9c7f', id, 'Paid for the day lunch and shampoo for dishwashing', 0.00, 840.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-655
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('64c21c6c-4d0b-41e0-b484-25dda3f15825', 'JE-000696', '2025-10-06', 'Paid for stationery', 'JV-JV-655', 'journal_entry', 240.00, 240.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cbd80f70-6460-4d0b-b2da-6622782b9c61', '64c21c6c-4d0b-41e0-b484-25dda3f15825', id, 'Paid for stationery', 240.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0db07bc6-be76-4116-a57c-94f3bcbff2e6', '64c21c6c-4d0b-41e0-b484-25dda3f15825', id, 'Paid for stationery', 0.00, 240.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-656
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5e582b1c-5c62-4983-935b-e1c978b7d27e', 'JE-000697', '2025-10-06', 'Paid for 22 bottles drinking water', 'JV-JV-656', 'journal_entry', 440.00, 440.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '85182160-94a6-425b-97a9-477548ca164b', '5e582b1c-5c62-4983-935b-e1c978b7d27e', id, 'Paid for 22 bottles drinking water', 440.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd9607088-36b5-497e-b5a5-55202232f87f', '5e582b1c-5c62-4983-935b-e1c978b7d27e', id, 'Paid for 22 bottles drinking water', 0.00, 440.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-657
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9ec9ad15-bf0e-44da-b6df-c479e8d17a49', 'JE-000698', '2025-10-07', 'Paid Sep 2025 salary to Mr. Liaqat Ogra Khil', 'JV-JV-657', 'journal_entry', 20880.00, 20880.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fd82433a-209c-462b-8381-0770ae5d4726', '9ec9ad15-bf0e-44da-b6df-c479e8d17a49', id, 'Paid Sep 2025 salary to Mr. Liaqat Ogra Khil', 6960.00, 0.00 FROM accounts WHERE account_code = '20171';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5c73dbb0-2d56-4b5b-8372-d91a8a39d455', '9ec9ad15-bf0e-44da-b6df-c479e8d17a49', id, 'Paid Sep 2025 salary to Mr. Afzal Muhammadi', 6960.00, 0.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2ffc11c1-5bcd-427f-8b38-50e27b5808cf', '9ec9ad15-bf0e-44da-b6df-c479e8d17a49', id, 'Paid Sep 2025 salary to Mr. Zubaida Dawlat Zada', 6960.00, 0.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bc593ec8-f71b-428e-aa60-9a31067999d4', '9ec9ad15-bf0e-44da-b6df-c479e8d17a49', id, 'Paid Sep 2025 salary to Mr. Zubaida Dawlat Zada, Liaqat, and Afzal Muhammadi', 0.00, 20880.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-658
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('14c48a3d-a327-4879-96ee-7b1cd04d2fa8', 'JE-000699', '2025-10-07', 'Cash Received CR# 86 for advance payment to Noor Muhammad for Jalalabad', 'JV-JV-658', 'journal_entry', 14340.00, 14340.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7e03dcd9-14fa-4f20-b8f0-3c60d2156fcc', '14c48a3d-a327-4879-96ee-7b1cd04d2fa8', id, 'Cash Received CR# 86 for advance payment to Noor Muhammad for Jalalabad', 14340.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '25676a14-95e1-4ac7-9462-3a456b6fb0b3', '14c48a3d-a327-4879-96ee-7b1cd04d2fa8', id, 'Cash Received CR# 86 for advance payment to Noor Muhammad for Jalalabad', 0.00, 14340.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-659
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b4b6fc26-db49-4f11-99b6-c1c6d84b9694', 'JE-000700', '2025-10-07', 'Advance payment to Mr. Noor Muhammad for electricity, internet, stationery, and taxi expenses of Jalalabad branch', 'JV-JV-659', 'journal_entry', 14340.00, 14340.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c753b0ec-d1b4-40e2-8d44-78e218e434ec', 'b4b6fc26-db49-4f11-99b6-c1c6d84b9694', id, 'Advance payment to Mr. Noor Muhammad for electricity, internet, stationery, and taxi expenses of Jalalabad branch', 10890.00, 0.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1f40e922-fd7e-48a4-ad9d-f69c019d384f', 'b4b6fc26-db49-4f11-99b6-c1c6d84b9694', id, 'Taxi used by Noor Muhammad  from Jalalabad to Kabul to Jalalabad', 1450.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5f5610c4-b679-49ef-ad63-cc4f38b996bf', 'b4b6fc26-db49-4f11-99b6-c1c6d84b9694', id, 'Taxi used by Noor Muhammad multiple times in between Jalalabad to Kunar', 1900.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1c047b16-46d9-4a25-9651-f553903685fa', 'b4b6fc26-db49-4f11-99b6-c1c6d84b9694', id, 'Hawala cost for the transfer of cash', 100.00, 0.00 FROM accounts WHERE account_code = '61807';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8ee7cfdf-f2a7-44f4-9a61-ece970747202', 'b4b6fc26-db49-4f11-99b6-c1c6d84b9694', id, 'Advance payment to Mr. Noor Muhammad for electricity, internet, stationery, and taxi expenses of Jalalabad branch and Taxi used by him multiple times in between Jalalabad to Kunar, Jalalabad to Kabul', 0.00, 14340.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-660
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fb2f58a7-4af2-407f-9625-20918b63d0b3', 'JE-000701', '2025-10-08', 'Paid for taxi used by Hedayatullah from Kunar to Jalalabad to Kabul and return', 'JV-JV-660', 'journal_entry', 1700.00, 1700.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a6f09853-c5df-46b2-b150-aec4807bf1a9', 'fb2f58a7-4af2-407f-9625-20918b63d0b3', id, 'Paid for taxi used by Hedayatullah from Kunar to Jalalabad to Kabul and return', 1700.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7876b8c0-0926-4ea6-80ac-4cc3dec0506f', 'fb2f58a7-4af2-407f-9625-20918b63d0b3', id, 'Paid for taxi used by Hedayatullah from Kunar to Jalalabad to Kabul and return', 0.00, 1700.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-661
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('da580edf-42be-469f-a42f-7bb0793c4344', 'JE-000702', '2025-10-08', 'Paid for taxi used by Liaqat to DAB to submit the monthly financial report', 'JV-JV-661', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd6159423-42ce-45af-8225-a05907232f1d', 'da580edf-42be-469f-a42f-7bb0793c4344', id, 'Paid for taxi used by Liaqat to DAB to submit the monthly financial report', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c1cfb0b7-c410-4733-a532-ce91d6630485', 'da580edf-42be-469f-a42f-7bb0793c4344', id, 'Paid for taxi used by Liaqat to DAB to submit the monthly financial report', 0.00, 100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-662
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f26667d6-e2d1-41bf-a139-2a05850ea472', 'JE-000703', '2025-10-08', 'Paid for the day lunch expense', 'JV-JV-662', 'journal_entry', 145.00, 145.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8ccf91cd-06f8-4907-ae18-de49057eb4f3', 'f26667d6-e2d1-41bf-a139-2a05850ea472', id, 'Paid for the day lunch expense', 145.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '27626c0a-9fb1-4169-b1e3-ae5a3ca0046e', 'f26667d6-e2d1-41bf-a139-2a05850ea472', id, 'Paid for the day lunch expense', 0.00, 145.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-663
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bd96bd5a-0f41-4d65-a2fc-29a55216812e', 'JE-000704', '2025-10-08', 'Paid for gas used for the kitchen', 'JV-JV-663', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0b7a6b44-3bce-452d-9d96-f3506390fd13', 'bd96bd5a-0f41-4d65-a2fc-29a55216812e', id, 'Paid for gas used for the kitchen', 500.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ebb05811-7627-4e33-a97e-9321a0bd955e', 'bd96bd5a-0f41-4d65-a2fc-29a55216812e', id, 'Paid for gas used for the kitchen', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-664
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8fd3e90d-6ded-4c46-80f2-f00a836dfb0d', 'JE-000705', '2025-10-08', 'Paid for gas used for the kitchen', 'JV-JV-664', 'journal_entry', 290.00, 290.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '32f82872-7ca3-47dd-87df-f5f269e9f1c2', '8fd3e90d-6ded-4c46-80f2-f00a836dfb0d', id, 'Paid for gas used for the kitchen', 290.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8efba0e6-0a86-4419-b3de-9e3b9214ca03', '8fd3e90d-6ded-4c46-80f2-f00a836dfb0d', id, 'Paid for gas used for the kitchen', 0.00, 290.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-665
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('dcd5eee5-e7da-4be8-8211-24f433610e3e', 'JE-000706', '2025-10-08', 'Paid for reginal staff food expenses while traveling to Kabul', 'JV-JV-665', 'journal_entry', 320.00, 320.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f5adb6cf-cc20-4b43-a2b3-9bc9726c80b2', 'dcd5eee5-e7da-4be8-8211-24f433610e3e', id, 'Paid for reginal staff food expenses while traveling to Kabul', 320.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3c642e61-9724-43e5-9e2f-2a2ae6159685', 'dcd5eee5-e7da-4be8-8211-24f433610e3e', id, 'Paid for reginal staff food expenses while traveling to Kabul', 0.00, 320.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-666
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('911738c3-eb48-47de-8031-45ff07eb71b8', 'JE-000707', '2025-10-08', 'Cash Received CR# 85 for HQ staff September 2025 salaries payment', 'JV-JV-666', 'journal_entry', 255780.00, 255780.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '45a1f158-0ac6-4ba5-8215-2a7e1ac94aca', '911738c3-eb48-47de-8031-45ff07eb71b8', id, 'Cash Received CR# 85 for HQ staff September 2025 salaries payment', 255780.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f86adedc-c68b-43aa-87fb-83f2b7440bc5', '911738c3-eb48-47de-8031-45ff07eb71b8', id, 'Cash Received CR# 85 for HQ staff September 2025 salaries payment', 0.00, 255780.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-667
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('347dc0e5-5bb8-418b-8332-9e55f081492e', 'JE-000708', '2025-10-08', 'Salary for the month of Sep 2025 Paid', 'JV-JV-667', 'journal_entry', 281752.00, 281752.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9817831b-c6b0-4c96-b134-46f78330b022', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, 'Salary for the month of Sep 2025 Paid', 134000.00, 0.00 FROM accounts WHERE account_code = '20169';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ab124efc-3eca-451f-bbb5-97928c1aceec', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, 'Salary for the month of Sep 2025 Paid', 23600.00, 0.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c1d78452-6bd3-41db-aeb1-c3caa4385a2b', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, 'Salary for the month of Sep 2025 Paid', 23600.00, 0.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b79328f5-98bf-4607-b621-33046f0b7232', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, 'Salary for the month of Sep 2025 Paid', 6960.00, 0.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cb5244f2-2297-4c35-bca4-7c274ba142f9', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, 'Salary for the month of Sep 2025 Paid', 5980.00, 0.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c7f61205-8e09-40f4-88a3-b91a91ee6d0d', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, 'Salary for the month of Sep 2025 Paid', 10000.00, 0.00 FROM accounts WHERE account_code = '20172';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0128efca-bec8-483a-a1bf-5723b458d31b', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, 'Salary for the month of Sep 2025 Paid', 6960.00, 0.00 FROM accounts WHERE account_code = '20170';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a951505d-355d-4912-9861-342a75360c04', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, 'Salary for the month of Sep 2025 Paid', 0.00, 211100.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cff9c2ba-d281-409a-8d84-606dba07142f', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, 'Second installment paid', 12476.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c1896066-f939-49ec-8d4e-a6b9ffc49055', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, '', 0.00, 12476.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7163086f-5b04-4b1a-9ffe-5ee487faf8dc', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, 'Cash deposited to AZIZI Bank by customer for second installment.', 12476.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd364ca8f-ac48-4661-9191-60af6514a923', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, '', 0.00, 12476.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3d7c8c94-c1fb-46f2-9811-92dd8b9d4750', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, 'Cash deposited to AZIZI Bank by customer for second installment.', 13206.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bb8b8fab-5aa8-4238-b9f9-ff82b3425a89', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, '', 0.00, 13206.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5690e1e6-08d1-4b47-9486-af2b7e5a172a', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, '', 12476.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'abb8b686-3644-4454-b710-348330ebe2cf', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, '', 0.00, 12476.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7713b7fb-ac7c-4f75-b994-023ed665656f', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, 'Cash deposit to bank by customer for first installment', 17938.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ea6df6bb-61c5-4859-90c7-0f29999f48ac', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, '', 0.00, 17938.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c71441a2-ca39-4698-9f52-e8ed09d0fd85', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, '', 2080.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '93266e8f-399f-4aa1-a4b3-39b661bb58eb', '347dc0e5-5bb8-418b-8332-9e55f081492e', id, '', 0.00, 2080.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-668
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5db6ac97-6dd3-42c3-820e-e8aa1e3dcba7', 'JE-000709', '2025-10-09', 'Imported entry', 'JV-JV-668', 'journal_entry', 220.00, 220.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f31a0c0a-b714-4ef6-aa57-a5b5f4a08b2e', '5db6ac97-6dd3-42c3-820e-e8aa1e3dcba7', id, '', 220.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c3fa06d7-f360-4518-bc8b-4f946b8d5209', '5db6ac97-6dd3-42c3-820e-e8aa1e3dcba7', id, 'Paid for stationery', 0.00, 220.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-669
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b3fba488-cb61-4902-9170-ceac333a8f70', 'JE-000710', '2025-10-09', 'Cash Received CR# 87 for Kunar and Jalalabad Salary food allowance payments', 'JV-JV-669', 'journal_entry', 71600.00, 71600.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '794aaabe-8d62-4546-960a-eef5be7d1bb9', 'b3fba488-cb61-4902-9170-ceac333a8f70', id, 'Cash Received CR# 87 for Kunar and Jalalabad Salary food allowance payments', 71600.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2c83f389-fd12-4c92-8729-beb277a044d0', 'b3fba488-cb61-4902-9170-ceac333a8f70', id, 'Cash Received CR# 87 for Kunar and Jalalabad Salary food allowance payments', 0.00, 71600.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-670
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c8894adb-9cf3-42cf-b2f4-a1ae3112d1e6', 'JE-000711', '2025-10-09', 'Aug and September 2025 Salary paid to Noor Muhammad', 'JV-JV-670', 'journal_entry', 71600.00, 71600.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8d4d5a2c-61a8-453b-8c21-f49ea74e877d', 'c8894adb-9cf3-42cf-b2f4-a1ae3112d1e6', id, 'Aug and September 2025 Salary paid to Noor Muhammad', 23720.00, 0.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f0800185-ccff-4f79-8c2c-e003ab2b68e3', 'c8894adb-9cf3-42cf-b2f4-a1ae3112d1e6', id, 'Aug and September 2025 Salary paid to Sahil Salarzai', 11960.00, 0.00 FROM accounts WHERE account_code = '20174';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5305b98b-4c87-49df-9fa8-29c1c711649c', 'c8894adb-9cf3-42cf-b2f4-a1ae3112d1e6', id, 'Aug and September 2025 Salary paid to Hedayatullah', 11960.00, 0.00 FROM accounts WHERE account_code = '20173';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f3945891-9018-4ee7-9ec0-44689734e392', 'c8894adb-9cf3-42cf-b2f4-a1ae3112d1e6', id, 'Aug and September 2025 Salary paid to Sadaqat Khan', 11960.00, 0.00 FROM accounts WHERE account_code = '20175';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f048a348-8eb3-423b-a267-4e60bf84c518', 'c8894adb-9cf3-42cf-b2f4-a1ae3112d1e6', id, 'Aug and September 2025 Food expense of Kunar branchs paid AFN 3000 monthly each', 6000.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '078253e1-b64e-4e8b-8869-8e58a30da4aa', 'c8894adb-9cf3-42cf-b2f4-a1ae3112d1e6', id, 'Aug and September 2025 Food expense of Jalalabad branch paid AFN 3000 monthly each', 6000.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4fe8e88c-396b-4c19-8c7d-ee5347e163e7', 'c8894adb-9cf3-42cf-b2f4-a1ae3112d1e6', id, 'Aug and September 2025 salary and food expenses of Jalalabad and Kunar branches are paid', 0.00, 71600.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-671
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bf3f4a4b-8f12-485f-8937-c6e12095b1b8', 'JE-000712', '2025-10-09', 'September 2025 salary paid to Omid Ahmadzai', 'JV-JV-671', 'journal_entry', 30000.00, 30000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b9ba19d3-af05-40e4-afd4-8eb436196fdf', 'bf3f4a4b-8f12-485f-8937-c6e12095b1b8', id, 'September 2025 salary paid to Omid Ahmadzai', 30000.00, 0.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ac3db49a-e4a1-4b08-bc2e-cfc799a18e76', 'bf3f4a4b-8f12-485f-8937-c6e12095b1b8', id, 'September 2025 salary paid to Omid Ahmadzai', 0.00, 30000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-672
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('499c5057-71c7-4699-862a-31f15b7748b0', 'JE-000713', '2025-10-09', 'First installment paid by Ebadullah', 'JV-JV-672', 'journal_entry', 1988.00, 1988.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f56df99a-f235-43ef-ab0d-9b0b821f486b', '499c5057-71c7-4699-862a-31f15b7748b0', id, 'First installment paid by Ebadullah', 1614.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9a623e0d-b418-4af4-807c-6460fd2a3927', '499c5057-71c7-4699-862a-31f15b7748b0', id, 'First installment paid by Ebadullah', 0.00, 1614.00 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e5201d92-efb3-4944-b57d-1d00e582751f', '499c5057-71c7-4699-862a-31f15b7748b0', id, 'Second installment paid by Taiba', 374.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8b6b6a18-2c74-4e6e-a1a4-126e7de71bbc', '499c5057-71c7-4699-862a-31f15b7748b0', id, 'Second installment paid by Taiba', 0.00, 374.00 FROM accounts WHERE account_code = '50300';

-- Entry: JV-673
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('73d330e5-901a-411f-ac68-2f7aa8c7ae4a', 'JE-000714', '2025-10-09', 'Purchased stationery for the office use', 'JV-JV-673', 'journal_entry', 1850.00, 1850.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a2c8a98d-fa26-42fb-b7d9-0809c67fa3bd', '73d330e5-901a-411f-ac68-2f7aa8c7ae4a', id, 'Purchased stationery for the office use', 1750.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e8718efc-b1a6-409f-9307-96f37b31e167', '73d330e5-901a-411f-ac68-2f7aa8c7ae4a', id, 'Purchased stationery for the office use', 0.00, 1750.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ed6185c6-29c4-45b5-b2fe-e545e995b13e', '73d330e5-901a-411f-ac68-2f7aa8c7ae4a', id, 'Paid for credit card for CCO for customer''s calling', 100.00, 0.00 FROM accounts WHERE account_code = '60005';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e25d3965-d490-46f6-9c85-34891e9d97cf', '73d330e5-901a-411f-ac68-2f7aa8c7ae4a', id, 'Paid for credit card for CCO for customer''s calling', 0.00, 100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-674
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('238cd209-90a7-4b68-aeb7-cb6943abdacf', 'JE-000715', '2025-10-09', 'Repaired the Epson printer', 'JV-JV-674', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'be61e7b8-e0cb-4457-bbe4-3ffe753186fc', '238cd209-90a7-4b68-aeb7-cb6943abdacf', id, 'Repaired the Epson printer', 300.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '07db1d4a-b76d-4f47-b2d6-744a61a476ae', '238cd209-90a7-4b68-aeb7-cb6943abdacf', id, 'Repaired the Epson printer', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-675
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('512257ae-1cf1-47e0-ad46-4b7878df2d59', 'JE-000716', '2025-10-09', 'Paid for taxi to Gulzar for printer repair and stationery purchase', 'JV-JV-675', 'journal_entry', 370.00, 370.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e12d385e-4ac4-45e7-8981-2b7e0be5eaa6', '512257ae-1cf1-47e0-ad46-4b7878df2d59', id, 'Paid for taxi to Gulzar for printer repair and stationery purchase', 370.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0d6bdabf-e003-45d8-8e36-817ba5ca4dee', '512257ae-1cf1-47e0-ad46-4b7878df2d59', id, 'Paid for taxi to Gulzar for printer repair and stationery purchase', 0.00, 370.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-676
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f36544c8-e5b5-41bc-a943-851728f2ecef', 'JE-000717', '2025-10-09', 'Cash Received CR# 69 for the website development payment (Dari and Pashto languages)', 'JV-JV-676', 'journal_entry', 6608.00, 6608.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '085bcc37-6da4-4069-bd0d-f79bc5f99a2b', 'f36544c8-e5b5-41bc-a943-851728f2ecef', id, 'Cash Received CR# 69 for the website development payment (Dari and Pashto languages)', 6608.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4d0c6b4a-b6bc-419f-9e96-38781e2975a8', 'f36544c8-e5b5-41bc-a943-851728f2ecef', id, 'Cash Received CR# 69 for the website development payment (Dari and Pashto languages)', 0.00, 6608.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-677
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('19972cae-55a3-45fa-b9b5-42790851f560', 'JE-000718', '2025-10-09', 'Paid for breads for the month of Sep 2025', 'JV-JV-677', 'journal_entry', 4530.00, 4530.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '62d055d9-dc52-49f9-a874-042f844cc62e', '19972cae-55a3-45fa-b9b5-42790851f560', id, 'Paid for breads for the month of Sep 2025', 4530.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f7311d6c-97d9-4d71-a663-580908893304', '19972cae-55a3-45fa-b9b5-42790851f560', id, 'Paid for breads for the month of Sep 2025', 0.00, 4530.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-678
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6af58ad3-ac65-4c89-b237-c4e5005887c3', 'JE-000719', '2025-10-09', 'Paid for lunch expense of staff and MISFA team', 'JV-JV-678', 'journal_entry', 2310.00, 2310.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '77eea91c-947c-40ae-96d5-aa3c8e41c3eb', '6af58ad3-ac65-4c89-b237-c4e5005887c3', id, 'Paid for lunch expense of staff and MISFA team', 2310.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6a5f6f74-32f1-47cc-9bda-54070ec8b020', '6af58ad3-ac65-4c89-b237-c4e5005887c3', id, 'Paid for lunch expense of staff and MISFA team', 0.00, 2310.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-679
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ef6fbd89-8bc7-4fba-ad44-78cca38fdf0b', 'JE-000720', '2025-10-09', 'Taxi used by Liaqat to bring cash', 'JV-JV-679', 'journal_entry', 50.00, 50.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f120ad7c-1ce1-462e-a87e-e875e81eac10', 'ef6fbd89-8bc7-4fba-ad44-78cca38fdf0b', id, 'Taxi used by Liaqat to bring cash', 50.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cdbe5a75-5d44-42eb-bb2a-e90a1c208832', 'ef6fbd89-8bc7-4fba-ad44-78cca38fdf0b', id, 'Taxi used by Liaqat to bring cash', 0.00, 50.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-680
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f44aa76c-802d-46d5-87b2-d78d9ba17358', 'JE-000721', '2025-10-10', 'Paid for lunch expense of the day', 'JV-JV-680', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cfcb5e8d-b2d9-42e5-bf1b-745649e955e1', 'f44aa76c-802d-46d5-87b2-d78d9ba17358', id, 'Paid for lunch expense of the day', 300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a17dd2db-aa9c-4409-ac4e-2e858896f57e', 'f44aa76c-802d-46d5-87b2-d78d9ba17358', id, 'Paid for lunch expense of the day', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-681
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('86520e94-e14a-4f20-9afc-31c59e9e4934', 'JE-000722', '2025-10-11', 'Paid for the day lunch expenses', 'JV-JV-681', 'journal_entry', 170.00, 170.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5a8f4fdc-7a11-488e-a50b-d6405b286f53', '86520e94-e14a-4f20-9afc-31c59e9e4934', id, 'Paid for the day lunch expenses', 170.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5131a201-997a-4e8d-8c27-97554688b7aa', '86520e94-e14a-4f20-9afc-31c59e9e4934', id, 'Paid for the day lunch expenses', 0.00, 170.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-682
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b663a7c8-ea71-4034-a965-4576dd5da076', 'JE-000723', '2025-10-11', 'Paid for credit card for Zuhra Nadeem to contact customers', 'JV-JV-682', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '50f1f653-76c8-4a4c-8398-3029b292a56d', 'b663a7c8-ea71-4034-a965-4576dd5da076', id, 'Paid for credit card for Zuhra Nadeem to contact customers', 100.00, 0.00 FROM accounts WHERE account_code = '60005';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd1635e2a-646e-4888-afd2-e3229af7878b', 'b663a7c8-ea71-4034-a965-4576dd5da076', id, 'Paid for credit card for Zuhra Nadeem to contact customers', 0.00, 100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-683
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('78991145-1df9-4b51-98b9-47311d7b801f', 'JE-000724', '2025-10-12', 'Paid for the website development payment (Dari and Pashto languages)', 'JV-JV-683', 'journal_entry', 6608.00, 6608.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '62f1e0a0-97e4-4d56-8678-bc3f3af368de', '78991145-1df9-4b51-98b9-47311d7b801f', id, 'Paid for the website development payment (Dari and Pashto languages)', 6608.00, 0.00 FROM accounts WHERE account_code = '61603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '94451873-b699-4c9d-a4eb-6a8a92c4adba', '78991145-1df9-4b51-98b9-47311d7b801f', id, 'Paid for the website development payment (Dari and Pashto languages)', 0.00, 6608.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-684
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('dec863de-acec-4101-a3a3-076a174ee786', 'JE-000725', '2025-10-12', 'Paid for the day lunch expenses', 'JV-JV-684', 'journal_entry', 1510.00, 1510.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '80476fb8-1a92-4ca8-b0fe-b4ce1519495a', 'dec863de-acec-4101-a3a3-076a174ee786', id, 'Paid for the day lunch expenses', 870.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8ec51ea3-2efb-4d61-83b0-ba4901ab3f0e', 'dec863de-acec-4101-a3a3-076a174ee786', id, 'Paid for refreshment for guests', 640.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f6610a1e-9fb4-4fb2-b37d-7de9881fb718', 'dec863de-acec-4101-a3a3-076a174ee786', id, 'Paid for refreshment for guests and the day lunch expenses', 0.00, 1510.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-685
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8559f5a4-d3de-4670-981f-e65ec38ca353', 'JE-000726', '2025-10-13', 'Paid for the day lunch expense', 'JV-JV-685', 'journal_entry', 180.00, 180.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '01b96039-a918-499f-b19d-f017ac4a99bb', '8559f5a4-d3de-4670-981f-e65ec38ca353', id, 'Paid for the day lunch expense', 180.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '44ba2cf5-4bb6-476b-a4a6-ce47764c5460', '8559f5a4-d3de-4670-981f-e65ec38ca353', id, 'Paid for the day lunch expense', 0.00, 180.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-686
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('364fe310-ec72-4ad7-8b47-341efa943849', 'JE-000727', '2025-10-13', 'Paid for the purchase of stationery', 'JV-JV-686', 'journal_entry', 3010.00, 3010.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'de69a008-1ff3-4358-a60d-173156bfe23c', '364fe310-ec72-4ad7-8b47-341efa943849', id, 'Paid for the purchase of stationery', 3010.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9e1eaae1-38ba-4478-ac62-739cecb2bce9', '364fe310-ec72-4ad7-8b47-341efa943849', id, 'Paid for the purchase of stationery', 0.00, 3010.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-687
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f3b19744-4797-4279-964b-48c6a0812433', 'JE-000728', '2025-10-13', 'Paid for taxi used for training in AIBF', 'JV-JV-687', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '346eb367-21d6-4b14-9a16-c81fbc87a924', 'f3b19744-4797-4279-964b-48c6a0812433', id, 'Paid for taxi used for training in AIBF', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b6acb318-f05b-4481-bb29-405ad1830739', 'f3b19744-4797-4279-964b-48c6a0812433', id, 'Paid for taxi used for training in AIBF', 0.00, 100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-688
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1ee9872c-6830-48a4-99b5-d53ac5e31ce6', 'JE-000729', '2025-10-13', 'Paid for the lunch expense', 'JV-JV-688', 'journal_entry', 380.00, 380.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '30c4aed4-40b7-4ba5-a566-3b72a0235c63', '1ee9872c-6830-48a4-99b5-d53ac5e31ce6', id, 'Paid for the lunch expense', 380.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1eda794b-9e90-4af7-9f2e-cefc09b42934', '1ee9872c-6830-48a4-99b5-d53ac5e31ce6', id, 'Paid for the lunch expense', 0.00, 380.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-689
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c62bd8da-615d-471d-a7bf-b125fa78c149', 'JE-000730', '2025-10-13', 'Paid for taxi used for training in AIBF', 'JV-JV-689', 'journal_entry', 80.00, 80.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd4b33c32-0cf7-48a3-a86e-ab19bd11aee2', 'c62bd8da-615d-471d-a7bf-b125fa78c149', id, 'Paid for taxi used for training in AIBF', 80.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1a4db393-6dc3-4b96-8205-5ff0371769b1', 'c62bd8da-615d-471d-a7bf-b125fa78c149', id, 'Paid for taxi used for training in AIBF', 0.00, 80.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-690
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5deda14d-ade1-43f6-8da5-38e3fbecfb20', 'JE-000731', '2025-10-14', 'paid for the car fuel used by Hedayat for HQ staff visit the Kunar branch', 'JV-JV-690', 'journal_entry', 10517.00, 10517.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7e2427c4-727a-4993-b2be-c10c88d52578', '5deda14d-ade1-43f6-8da5-38e3fbecfb20', id, 'paid for the car fuel used by Hedayat for HQ staff visit the Kunar branch', 8560.00, 0.00 FROM accounts WHERE account_code = '60901';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4a1abb10-33a1-44ff-9d54-774b2dc517ef', '5deda14d-ade1-43f6-8da5-38e3fbecfb20', id, 'Paid for food expense for HQ staff visiting Kunar Branch', 1740.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '50accd4f-1749-407c-96d1-76cff97a8f3e', '5deda14d-ade1-43f6-8da5-38e3fbecfb20', id, 'Received cash back', 217.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'df083d39-2d1e-4f1b-9333-bcc4ccc80ca2', '5deda14d-ade1-43f6-8da5-38e3fbecfb20', id, 'Paid for the car fuel used by Hedayat for HQ staff visit the Kunar branch and food expense 217 AFN cash back', 0.00, 10517.00 FROM accounts WHERE account_code = '20173';

-- Entry: JV-691
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ef5d64f6-304b-44e4-9ee2-ab5a32f8caaf', 'JE-000732', '2025-10-15', 'Paid for the staff lunch expense', 'JV-JV-691', 'journal_entry', 560.00, 560.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5afb4427-ad3e-4548-ad19-377746994756', 'ef5d64f6-304b-44e4-9ee2-ab5a32f8caaf', id, 'Paid for the staff lunch expense', 200.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eae26161-a5c7-430c-ade3-a7fba3e23eb4', 'ef5d64f6-304b-44e4-9ee2-ab5a32f8caaf', id, 'Paid for the purchase of cleaning item toilets', 360.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd4dffe88-479a-4cc5-8fa7-6126ad0c2174', 'ef5d64f6-304b-44e4-9ee2-ab5a32f8caaf', id, 'Paid for the purchase of cleaning item toilets and staff lunch expenses', 0.00, 560.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-692
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('135ff436-2814-42b6-889e-3e483fc64a7f', 'JE-000733', '2025-10-15', 'Taxi used by Liaqat to deliver laptop to AIBF office', 'JV-JV-692', 'journal_entry', 110.00, 110.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5c7e0d09-ffcc-4540-9646-2ff006bf6bf7', '135ff436-2814-42b6-889e-3e483fc64a7f', id, 'Taxi used by Liaqat to deliver laptop to AIBF office', 110.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '30de87eb-d6c9-45bb-ba0f-cf6e4e70e5da', '135ff436-2814-42b6-889e-3e483fc64a7f', id, 'Taxi used by Liaqat to deliver laptop to AIBF office', 0.00, 110.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-693
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('52a7fde0-68fd-4c0d-9c86-e538b9d5d58a', 'JE-000734', '2025-10-15', 'Paid for taxi by Gulzar for training in AIBF', 'JV-JV-693', 'journal_entry', 180.00, 180.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b14ab149-30b3-477c-a62e-3a96877d261d', '52a7fde0-68fd-4c0d-9c86-e538b9d5d58a', id, 'Paid for taxi by Gulzar for training in AIBF', 180.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f1a55d91-2c46-4f1e-995a-156bc5055046', '52a7fde0-68fd-4c0d-9c86-e538b9d5d58a', id, 'Paid for taxi by Gulzar for training in AIBF', 0.00, 180.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-694
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b35b7bbd-c156-44e6-ac98-939b2497eddf', 'JE-000735', '2025-10-15', 'Taxi used by Abdul Shakoor to bring cash', 'JV-JV-694', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd2c93762-9ee9-4a03-8df0-b668caf694ac', 'b35b7bbd-c156-44e6-ac98-939b2497eddf', id, 'Taxi used by Abdul Shakoor to bring cash', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '49b57f84-6945-4bbe-ae2d-fd69fdce45e8', 'b35b7bbd-c156-44e6-ac98-939b2497eddf', id, 'Taxi used by Abdul Shakoor to bring cash', 0.00, 150.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-695
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f7ce2feb-84ee-4cea-84a6-f7eea2b5e195', 'JE-000736', '2025-10-16', 'Purchased one TP-Link Archer C60, 5 Antina Router', 'JV-JV-695', 'journal_entry', 2000.00, 2000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '89cdc498-ab7f-4d4e-ad19-628de536fcce', 'f7ce2feb-84ee-4cea-84a6-f7eea2b5e195', id, 'Purchased one TP-Link Archer C60, 5 Antina Router', 2000.00, 0.00 FROM accounts WHERE account_code = '17101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '54775a27-6995-4838-95cc-b90dfda1bd3b', 'f7ce2feb-84ee-4cea-84a6-f7eea2b5e195', id, 'Purchased one TP-Link Archer C60, 5 Antina Router', 0.00, 2000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-696
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1e84ecc0-10c0-4ec6-975b-003671dfdd9b', 'JE-000737', '2025-10-16', 'Cash Received CR# 90 for the office daily expenses', 'JV-JV-696', 'journal_entry', 20000.00, 20000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4b005bc1-fa58-42dc-9b1f-b626028fc4f8', '1e84ecc0-10c0-4ec6-975b-003671dfdd9b', id, 'Cash Received CR# 90 for the office daily expenses', 20000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e50a64ee-8caa-4e1d-b7ae-d177b2932eed', '1e84ecc0-10c0-4ec6-975b-003671dfdd9b', id, 'Cash Received CR# 90 for the office daily expenses', 0.00, 20000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-697
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4354a707-0fd4-4d55-8df3-674f57832ba0', 'JE-000738', '2025-10-16', 'Paid for milk and cake for the guests', 'JV-JV-697', 'journal_entry', 140.00, 140.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '10004114-0a08-4d2c-8283-2a839583a1fc', '4354a707-0fd4-4d55-8df3-674f57832ba0', id, 'Paid for milk and cake for the guests', 140.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b9a6c35d-fdd1-453a-aef8-f7fba49ee56a', '4354a707-0fd4-4d55-8df3-674f57832ba0', id, 'Paid for milk and cake for the guests', 0.00, 140.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-698
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ba67ac06-c972-4be5-9d29-7968339ad820', 'JE-000739', '2025-10-17', 'Paid for the staff lunch expense', 'JV-JV-698', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e36b61a0-a481-41d5-9309-3e96529737db', 'ba67ac06-c972-4be5-9d29-7968339ad820', id, 'Paid for the staff lunch expense', 300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8a9f3a6f-b6d5-4438-853f-beb23e5c0c72', 'ba67ac06-c972-4be5-9d29-7968339ad820', id, 'Paid for the staff lunch expense', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-699
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('932de0eb-d6ff-4c8c-92e1-cd8bb46d5adc', 'JE-000740', '2025-10-18', 'Taxi used by Abdul Shakoor for the purchase of routers', 'JV-JV-699', 'journal_entry', 80.00, 80.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fbb3f7ef-cab4-4023-90be-8331485096e1', '932de0eb-d6ff-4c8c-92e1-cd8bb46d5adc', id, 'Taxi used by Abdul Shakoor for the purchase of routers', 80.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd07f045d-e4f5-470c-a291-a170392900a3', '932de0eb-d6ff-4c8c-92e1-cd8bb46d5adc', id, 'Taxi used by Abdul Shakoor for the purchase of routers', 0.00, 80.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-700
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('78a68918-47e3-48af-aeee-3e5d33884b63', 'JE-000741', '2025-10-18', 'Paid for the staff lunch expense', 'JV-JV-700', 'journal_entry', 195.00, 195.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '87228860-4686-44bb-bba0-8565ab6114f8', '78a68918-47e3-48af-aeee-3e5d33884b63', id, 'Paid for the staff lunch expense', 195.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6cfb021a-7c44-4004-b6c1-4f92cde4260c', '78a68918-47e3-48af-aeee-3e5d33884b63', id, 'Paid for the staff lunch expense', 0.00, 195.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-701
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('95451334-cc16-4626-b1d0-0cc3cc941199', 'JE-000742', '2025-10-18', 'Cash received CR # 88 for Kunar office new contract commission payment', 'JV-JV-701', 'journal_entry', 3150.00, 3150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '54162299-21e3-43f4-bcb7-5a69ac0f0e73', '95451334-cc16-4626-b1d0-0cc3cc941199', id, 'Cash received CR # 88 for Kunar office new contract commission payment', 3150.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aba44725-45af-4864-9bb7-2576eb73a0d6', '95451334-cc16-4626-b1d0-0cc3cc941199', id, 'Cash received CR # 88 for Kunar office new contract commission payment', 0.00, 3150.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-702
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fcb76d20-d028-4b44-9505-3c788fed2c5a', 'JE-000743', '2025-10-18', 'Advance paid to Noor Muhammad for Kunar office new contract commission payment', 'JV-JV-702', 'journal_entry', 3150.00, 3150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5bb81039-85df-49c1-9807-cb22aee522ab', 'fcb76d20-d028-4b44-9505-3c788fed2c5a', id, 'Advance paid to Noor Muhammad for Kunar office new contract commission payment', 3000.00, 0.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ef8b0295-d5b8-4a33-be99-b873bd87b25e', 'fcb76d20-d028-4b44-9505-3c788fed2c5a', id, 'Hawala cost for the transfer of cash to Jalalabad', 150.00, 0.00 FROM accounts WHERE account_code = '51300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'afa34df8-65d4-46cc-9985-694d0d032758', 'fcb76d20-d028-4b44-9505-3c788fed2c5a', id, 'Advance paid to Noor Muhammad for Kunar office new contract commission payment', 0.00, 3150.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-703
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6e6c7049-b889-4f10-9ae4-26cd59bbf4a8', 'JE-000744', '2025-10-19', 'Paid for Lunch expense of the staff', 'JV-JV-703', 'journal_entry', 715.00, 715.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a62f9464-e1db-45f7-abd1-84e80b99e272', '6e6c7049-b889-4f10-9ae4-26cd59bbf4a8', id, 'Paid for Lunch expense of the staff', 685.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '33f93a04-eff2-43a0-bd50-5dc8823c59f8', '6e6c7049-b889-4f10-9ae4-26cd59bbf4a8', id, 'Paid for the toilet paper', 30.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c8a5bea3-3525-44e2-bae4-6d420bb739d1', '6e6c7049-b889-4f10-9ae4-26cd59bbf4a8', id, 'Paid for the toilet paper and Paid for Lunch expense of the staff', 0.00, 715.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-704
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1b5a174d-5ce3-430b-ba37-006cdc2ba1d0', 'JE-000745', '2025-10-19', 'Paid for the purchase of power supply for the Microtich router', 'JV-JV-704', 'journal_entry', 400.00, 400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9c668d01-86c5-45f0-908b-9269f292ee09', '1b5a174d-5ce3-430b-ba37-006cdc2ba1d0', id, 'Paid for the purchase of power supply for the Microtich router', 400.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a1b0d14e-f6a9-46d1-9ca1-be6597b3719a', '1b5a174d-5ce3-430b-ba37-006cdc2ba1d0', id, 'Paid for the purchase of power supply for the Microtich router', 0.00, 400.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-705
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('93ceba01-9af7-479c-8ba4-371cd8980acd', 'JE-000746', '2025-10-19', 'Paid for the drinking water', 'JV-JV-705', 'journal_entry', 14170.00, 14170.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '43c5018a-f86c-4d78-9528-9a949d827b56', '93ceba01-9af7-479c-8ba4-371cd8980acd', id, 'Paid for the drinking water', 560.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '049281e2-28f8-424e-8fec-fc86ab3b1e59', '93ceba01-9af7-479c-8ba4-371cd8980acd', id, 'Paid for the drinking water', 0.00, 560.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dd25ca54-9b3b-4659-9b4e-d2ced40adf48', '93ceba01-9af7-479c-8ba4-371cd8980acd', id, '', 1480.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '103dd878-c812-4f14-b0d5-e4c84b96825b', '93ceba01-9af7-479c-8ba4-371cd8980acd', id, '', 0.00, 1480.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5f9c6f4a-1081-482d-a936-7b9670ce7749', '93ceba01-9af7-479c-8ba4-371cd8980acd', id, '', 1480.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c690585-1859-4f8d-a904-fb3081c350d4', '93ceba01-9af7-479c-8ba4-371cd8980acd', id, '', 0.00, 1480.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c5f9c1f2-5f78-46a5-81b3-e1fb9dba5dcc', '93ceba01-9af7-479c-8ba4-371cd8980acd', id, '', 1580.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1a20cd91-26f7-49ed-b38a-2815073eee4d', '93ceba01-9af7-479c-8ba4-371cd8980acd', id, '', 0.00, 1580.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '06fce9a5-70ab-4efc-b4d8-1df909f391b8', '93ceba01-9af7-479c-8ba4-371cd8980acd', id, '', 2070.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '32f7ed48-9695-44a8-8d4a-84e18e52a730', '93ceba01-9af7-479c-8ba4-371cd8980acd', id, '', 0.00, 2070.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fe53ff11-5678-4ce3-9785-d34a2b673e44', '93ceba01-9af7-479c-8ba4-371cd8980acd', id, '', 7000.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fe0cdf73-9222-431e-b48f-1efc30cad738', '93ceba01-9af7-479c-8ba4-371cd8980acd', id, '', 0.00, 7000.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-706
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a6616983-6b39-419f-877b-2d3205b0b646', 'JE-000747', '2025-10-20', 'First installment paid by Naqibullah Hamdard', 'JV-JV-706', 'journal_entry', 2449.80, 2449.80, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '65a2c5e6-e9cc-4d01-ae1b-a2c12b00370f', 'a6616983-6b39-419f-877b-2d3205b0b646', id, 'First installment paid by Naqibullah Hamdard', 266.40, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '112b6701-2c9a-4f33-b7b2-b6ec4e0da67e', 'a6616983-6b39-419f-877b-2d3205b0b646', id, 'First installment paid by Naqibullah Hamdard', 0.00, 266.40 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7981ef89-4b17-4d14-a911-9a3a77b7cad9', 'a6616983-6b39-419f-877b-2d3205b0b646', id, 'First installment paid by Mujeeb ul Rahman Safi', 266.40, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '684d4757-6478-486f-b2d9-ccfb4f58f799', 'a6616983-6b39-419f-877b-2d3205b0b646', id, 'First installment paid by Mujeeb ul Rahman Safi', 0.00, 266.40 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3c111939-8c40-4b82-9bc4-436e8d10f463', 'a6616983-6b39-419f-877b-2d3205b0b646', id, 'First installment paid by Naseerullah Safi', 284.40, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fcfa7825-64bb-403c-96a5-1c5b3373c226', 'a6616983-6b39-419f-877b-2d3205b0b646', id, 'First installment paid by Naseerullah Safi', 0.00, 284.40 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1a4c8294-00e8-44a7-bf8f-35ba14e9af99', 'a6616983-6b39-419f-877b-2d3205b0b646', id, 'First installment paid by Bawar Khan Qazi', 372.60, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bf32d987-73c2-47ff-8c3c-4cfb66034783', 'a6616983-6b39-419f-877b-2d3205b0b646', id, 'First installment paid by Bawar Khan Qazi', 0.00, 372.60 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8d7384e2-bb78-4341-8f64-693d87e99f1d', 'a6616983-6b39-419f-877b-2d3205b0b646', id, 'Second and third installments paid by Safiullah', 1260.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b9ebaedb-7670-4c28-91b2-e73352a35dee', 'a6616983-6b39-419f-877b-2d3205b0b646', id, 'Second and third installments paid by Safiullah', 0.00, 1260.00 FROM accounts WHERE account_code = '50300';

-- Entry: JV-707
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('02639c8d-3ced-4aa5-8121-9679552b01f5', 'JE-000748', '2025-10-20', 'Paid for the office lunch expenses', 'JV-JV-707', 'journal_entry', 1710.00, 1710.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '08d207c0-b024-4857-ae69-f6f0fc3dae55', '02639c8d-3ced-4aa5-8121-9679552b01f5', id, 'Paid for the office lunch expenses', 1530.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b0407271-9ac1-4a8a-bc89-d6550a14a773', '02639c8d-3ced-4aa5-8121-9679552b01f5', id, 'Paid for the purchase of tissue', 180.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0f73c026-12de-4b14-abff-825121c8bbe0', '02639c8d-3ced-4aa5-8121-9679552b01f5', id, 'Paid for the purchase of office lunch expenses and tissue', 0.00, 1710.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-708
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2f67c1e1-1dbd-4413-8ce1-aa38d1e3f3aa', 'JE-000749', '2025-10-20', 'Paid for the purchase of gas for the office use', 'JV-JV-708', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a238772a-569c-4085-bcbd-899d01f7d8c2', '2f67c1e1-1dbd-4413-8ce1-aa38d1e3f3aa', id, 'Paid for the purchase of gas for the office use', 500.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd8c0568b-4213-45d6-be66-9efcb6415166', '2f67c1e1-1dbd-4413-8ce1-aa38d1e3f3aa', id, 'Paid for the purchase of gas for the office use', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-709
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('74e1957f-e292-4812-9384-a7188ab251e3', 'JE-000750', '2025-10-20', 'Paid for guests meal by Hanifullah', 'JV-JV-709', 'journal_entry', 600.00, 600.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ac157a7e-2293-4bf4-b569-4f39c435dc42', '74e1957f-e292-4812-9384-a7188ab251e3', id, 'Paid for guests meal by Hanifullah', 600.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '60b6cc45-32ba-4d82-bc61-0ada0793a431', '74e1957f-e292-4812-9384-a7188ab251e3', id, 'Paid for guests meal by Hanifullah', 0.00, 600.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-710
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('068f7e75-0464-41e8-bd8e-a529f33c7fb4', 'JE-000751', '2025-10-20', 'Paid for the lunch expense, tissue paper, air fresher, and drinking water', 'JV-JV-710', 'journal_entry', 10890.00, 10890.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6a2afb9e-1bfe-4fa2-8157-bd4cb480a795', '068f7e75-0464-41e8-bd8e-a529f33c7fb4', id, 'Paid for the lunch expense, tissue paper, air fresher, and drinking water', 640.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cb47e181-afa4-4b08-90e9-71302eec41f7', '068f7e75-0464-41e8-bd8e-a529f33c7fb4', id, 'Paid for the lunch expense, tissue paper, air fresher, and drinking water', 90.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '96561984-4cc7-488f-baf1-e521ea1ef8ea', '068f7e75-0464-41e8-bd8e-a529f33c7fb4', id, 'Paid for the lunch expense, tissue paper, air fresher, and drinking water', 0.00, 730.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '23d1804f-f6f2-4641-a976-b42efc9c4d06', '068f7e75-0464-41e8-bd8e-a529f33c7fb4', id, '', 1180.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b33d4546-8c31-42ad-9688-c06464b5550a', '068f7e75-0464-41e8-bd8e-a529f33c7fb4', id, '', 0.00, 1180.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '69e1161a-3d4f-426d-8582-d1c120369489', '068f7e75-0464-41e8-bd8e-a529f33c7fb4', id, '', 1980.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '777e87a1-c8c2-4b8c-9e54-f52257e66efc', '068f7e75-0464-41e8-bd8e-a529f33c7fb4', id, '', 0.00, 1980.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd5753aff-6660-4d5c-8dbb-d560233cc128', '068f7e75-0464-41e8-bd8e-a529f33c7fb4', id, 'Payment for the first three installments.', 7000.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ce430e57-e3aa-420c-83d6-d739b8ac741b', '068f7e75-0464-41e8-bd8e-a529f33c7fb4', id, '', 0.00, 7000.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-711
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cc18dcae-5f22-49c9-bf15-b72e37f5f2f8', 'JE-000752', '2025-10-21', 'First Installment paid by Ayoub Khan Shinwari', 'JV-JV-711', 'journal_entry', 1828.80, 1828.80, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fc87608b-a123-4d06-b5ab-b16ace15dac4', 'cc18dcae-5f22-49c9-bf15-b72e37f5f2f8', id, 'First Installment paid by Ayoub Khan Shinwari', 212.40, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd08a2d5a-8b00-4343-a8fa-28d3b871f3ef', 'cc18dcae-5f22-49c9-bf15-b72e37f5f2f8', id, 'First Installment paid by Ayoub Khan Shinwari', 0.00, 212.40 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '884ca2dd-56f5-4938-b79e-86c5f44a8c4e', 'cc18dcae-5f22-49c9-bf15-b72e37f5f2f8', id, 'First Installment paid by Israr Ahmad', 356.40, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '386b526a-1c41-4d3f-b713-de49d378e873', 'cc18dcae-5f22-49c9-bf15-b72e37f5f2f8', id, 'First Installment paid by Israr Ahmad', 0.00, 356.40 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2fd4d593-76d9-48b3-8904-9487cdb523fe', 'cc18dcae-5f22-49c9-bf15-b72e37f5f2f8', id, 'First, Second, and Third Installments paid by Hosain Pari', 1260.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eb74afe5-1d5c-4396-8706-30cece0bf44a', 'cc18dcae-5f22-49c9-bf15-b72e37f5f2f8', id, 'First, Second, and Third Installments paid by Hosain Pari', 0.00, 1260.00 FROM accounts WHERE account_code = '50300';

-- Entry: JV-712
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('71b3d205-a8f5-48c5-b8b2-869093dcd943', 'JE-000753', '2025-10-21', 'Cash received CR# 75 for COO July 2025 salary payment', 'JV-JV-712', 'journal_entry', 9620.00, 9620.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9eec9f6d-564f-4b75-99a8-8894c96d88df', '71b3d205-a8f5-48c5-b8b2-869093dcd943', id, 'Cash received CR# 75 for COO July 2025 salary payment', 9620.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bc64c725-f85d-429e-8ce8-a18be88adf2e', '71b3d205-a8f5-48c5-b8b2-869093dcd943', id, 'Cash received CR# 75 for COO July 2025 salary payment', 0.00, 9620.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-713
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('083a3e5b-2e54-4d3d-b0fe-77d03bc3bf90', 'JE-000754', '2025-10-21', 'Cash received CR# 89 for COO September 2025 salary payment', 'JV-JV-713', 'journal_entry', 28100.00, 28100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0dbab5b4-51c8-4726-9629-0d893502d80e', '083a3e5b-2e54-4d3d-b0fe-77d03bc3bf90', id, 'Cash received CR# 89 for COO September 2025 salary payment', 28100.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '63ddff90-4dce-4f8b-984f-33d064c191c5', '083a3e5b-2e54-4d3d-b0fe-77d03bc3bf90', id, 'Cash received CR# 89 for COO September 2025 salary payment', 0.00, 28100.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-714
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8d03657c-7cde-4581-8f87-38493081f892', 'JE-000755', '2025-10-21', 'Paid salary to Shahpoor (COO) for the month of July 2025 after advances adjustments', 'JV-JV-714', 'journal_entry', 9620.00, 9620.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'faaa40a1-45df-4a1a-95b1-5a9b302eac5a', '8d03657c-7cde-4581-8f87-38493081f892', id, 'Paid salary to Shahpoor (COO) for the month of July 2025 after advances adjustments', 9620.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7704f138-0a0c-4c03-915c-312d53a0859f', '8d03657c-7cde-4581-8f87-38493081f892', id, 'Paid salary to Shahpoor (COO) for the month of July 2025 after advances adjustments', 0.00, 9620.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-715
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('df2b69bd-6d19-4a7b-b337-c723c30720b0', 'JE-000756', '2025-10-21', 'Paid salary to Shahpoor (COO) for the month of September 2025', 'JV-JV-715', 'journal_entry', 28100.00, 28100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '19d95ca4-2cf5-47d0-9b5c-f405bdaf89a9', 'df2b69bd-6d19-4a7b-b337-c723c30720b0', id, 'Paid salary to Shahpoor (COO) for the month of September 2025', 28100.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e67ce80e-1252-4526-a684-fc19819324e7', 'df2b69bd-6d19-4a7b-b337-c723c30720b0', id, 'Paid salary to Shahpoor (COO) for the month of September 2025', 0.00, 28100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-716
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2b8728f7-62a7-43e9-a9ae-74d4a2858812', 'JE-000757', '2025-10-21', 'Paid for the taxi used by Latif to deliver the CEO laptop', 'JV-JV-716', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8d054f4b-b302-4089-9d3e-d5423e028a59', '2b8728f7-62a7-43e9-a9ae-74d4a2858812', id, 'Paid for the taxi used by Latif to deliver the CEO laptop', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9c7bb2de-916a-4ac6-9414-71995cd7b8fd', '2b8728f7-62a7-43e9-a9ae-74d4a2858812', id, 'Paid for the taxi used by Latif to deliver the CEO laptop', 0.00, 150.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-717
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('984c54da-163b-464f-840b-ec5e19a583eb', 'JE-000758', '2025-10-21', 'Paid for the day lunch expense', 'JV-JV-717', 'journal_entry', 130.00, 130.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9d53324a-23e2-4ae5-85d3-e82c2bfcb3ca', '984c54da-163b-464f-840b-ec5e19a583eb', id, 'Paid for the day lunch expense', 130.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eb565114-2d0c-4757-988f-d07211fafe01', '984c54da-163b-464f-840b-ec5e19a583eb', id, 'Paid for the day lunch expense', 0.00, 130.00 FROM accounts WHERE account_code = '10101';

-- Entry: LCI034
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('63f63224-9ceb-4279-b243-7f9d70855c75', 'JE-000759', '2025-10-21', 'Sold floor on margin for Mr. Hanifullah Tanweer for 12 months on 18% profit margin.', 'JV-LCI034', 'financing_disbursement', 41300.00, 41300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a5b00624-8ba4-4d0b-a621-209d857e92e4', '63f63224-9ceb-4279-b243-7f9d70855c75', id, 'Sold floor on margin for Mr. Hanifullah Tanweer for 12 months on 18% profit margin.', 41300.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1cf2201d-67fd-4fe1-8869-14f67429fbf1', '63f63224-9ceb-4279-b243-7f9d70855c75', id, 'Sold floor on margin for Mr. Hanifullah Tanweer for 12 months on 18% profit margin.', 0.00, 35000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c861cb3f-f0ab-4350-b8c7-bb501c0dc19d', '63f63224-9ceb-4279-b243-7f9d70855c75', id, 'Sold floor on margin for Mr. Hanifullah Tanweer for 12 months on 18% profit margin.', 0.00, 6300.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI035
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d1eb8767-d1af-439e-aee0-1d2880b1fcb6', 'JE-000760', '2025-10-21', 'Sold floor on Murabaha for Mr. Hameedullah Alokozay for 12 months on 18% profit margin.', 'JV-LCI035', 'financing_disbursement', 29500.00, 29500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6313b595-9976-4187-aa16-a3b9e57a0882', 'd1eb8767-d1af-439e-aee0-1d2880b1fcb6', id, 'Sold floor on Murabaha for Mr. Hameedullah Alokozay for 12 months on 18% profit margin.', 29500.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '89239fb5-6b31-493e-ab98-1705a9f134c1', 'd1eb8767-d1af-439e-aee0-1d2880b1fcb6', id, 'Sold floor on Murabaha for Mr. Hameedullah Alokozay for 12 months on 18% profit margin.', 0.00, 25000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '471ab8d8-034a-4d3f-bf26-92c613dd5b65', 'd1eb8767-d1af-439e-aee0-1d2880b1fcb6', id, 'Sold floor on Murabaha for Mr. Hameedullah Alokozay for 12 months on 18% profit margin.', 0.00, 4500.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI036
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9ae90cf6-ef88-4b3e-adcd-38cd2a1c5686', 'JE-000761', '2025-10-21', 'Imported entry', 'JV-LCI036', 'financing_disbursement', 35400.00, 35400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '706a2cf8-5164-4d64-8f83-d8692847d786', '9ae90cf6-ef88-4b3e-adcd-38cd2a1c5686', id, '', 35400.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c677ebf2-073e-4269-9d8d-290e5b7008cd', '9ae90cf6-ef88-4b3e-adcd-38cd2a1c5686', id, 'Sold Grocery items on Murabaha to Mr. Waser ullah Safi for 12 months on 18% profit margin.', 0.00, 30000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2958b929-be8d-41da-967b-2af9279a85fb', '9ae90cf6-ef88-4b3e-adcd-38cd2a1c5686', id, 'Sold Grocery items on Murabaha to Mr. Waser ullah Safi for 12 months on 18% profit margin.', 0.00, 5400.00 FROM accounts WHERE account_code = '20900';

-- Entry: JV-718
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('86ff4957-534e-4483-a35b-8548c8ae428f', 'JE-000762', '2025-10-22', 'Paid for the day lunch expense', 'JV-JV-718', 'journal_entry', 275.00, 275.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '793b2297-4aee-41b4-b1d0-ea867bdd42ee', '86ff4957-534e-4483-a35b-8548c8ae428f', id, 'Paid for the day lunch expense', 175.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9cc4123d-32ea-4669-a0dc-8b64e6b2cdf0', '86ff4957-534e-4483-a35b-8548c8ae428f', id, 'Paid for dish washing liquid', 100.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e36453b0-8d30-40c7-9e86-49190d00602e', '86ff4957-534e-4483-a35b-8548c8ae428f', id, 'Paid for dish washing liquid Paid for the day lunch expense', 0.00, 275.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-719
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1456e021-c7d9-4a9a-9113-d5b43f3be1e6', 'JE-000763', '2025-10-22', 'Paid for the purchase of laptop charger', 'JV-JV-719', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '613f1fd2-353e-4da7-b0c0-70f74e709525', '1456e021-c7d9-4a9a-9113-d5b43f3be1e6', id, 'Paid for the purchase of laptop charger', 500.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eb5a2b56-95d1-4920-af53-69e1cac46c15', '1456e021-c7d9-4a9a-9113-d5b43f3be1e6', id, 'Paid for the purchase of laptop charger', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-720
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('38cb75b0-6f7d-452d-b913-89694efeec85', 'JE-000764', '2025-10-22', 'Paid for taxi used by Gulzar to bring laptop from repair shop', 'JV-JV-720', 'journal_entry', 50.00, 50.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5c449857-7e6a-47fe-8a93-29cce05ce249', '38cb75b0-6f7d-452d-b913-89694efeec85', id, 'Paid for taxi used by Gulzar to bring laptop from repair shop', 50.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8741d877-8690-4dc7-ab5e-07ef50e35b01', '38cb75b0-6f7d-452d-b913-89694efeec85', id, 'Paid for taxi used by Gulzar to bring laptop from repair shop', 0.00, 50.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-721
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7d8f0770-4305-45b9-8546-e0d793ddf306', 'JE-000765', '2025-10-23', 'Paid for taxi used by Lateef for the delivery of some office documents', 'JV-JV-721', 'journal_entry', 140.00, 140.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c9d53e95-8005-42af-a3f5-093c574b46b0', '7d8f0770-4305-45b9-8546-e0d793ddf306', id, 'Paid for taxi used by Lateef for the delivery of some office documents', 140.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '871e2820-0e78-40a0-8acf-51b97fa1b0c5', '7d8f0770-4305-45b9-8546-e0d793ddf306', id, 'Paid for taxi used by Lateedf for the delivery of some office documents', 0.00, 140.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-722
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('df1ed770-07dc-4540-96e5-186b5d3a44bf', 'JE-000766', '2025-10-24', 'Paid for food expense made by guards on Friday', 'JV-JV-722', 'journal_entry', 330.00, 330.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '37fff858-430e-4502-9f78-4c75430a773f', 'df1ed770-07dc-4540-96e5-186b5d3a44bf', id, 'Paid for food expense made by guards on Friday', 330.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2a6a35c8-9ee4-4125-baf7-05693fa054bd', 'df1ed770-07dc-4540-96e5-186b5d3a44bf', id, 'Paid for food expense made by guards on Friday', 0.00, 330.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-723
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('664bcc12-e8db-44d8-851e-55a428bdaacf', 'JE-000767', '2025-10-24', 'Office rent prepaid for the month of Mezan 1404', 'JV-JV-723', 'journal_entry', 37580.00, 37580.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7a6bab17-746b-4a52-8e6f-df50dbebc252', '664bcc12-e8db-44d8-851e-55a428bdaacf', id, 'Office rent prepaid for the month of Mezan 1404', 33000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f207a5bf-1310-43a4-9be9-9c02d08b9132', '664bcc12-e8db-44d8-851e-55a428bdaacf', id, 'Office rent prepaid for the month of Mezan 1404', 0.00, 3000.00 FROM accounts WHERE account_code = '21200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '53ff5cb5-fc72-4dcb-b580-a491d5915360', '664bcc12-e8db-44d8-851e-55a428bdaacf', id, 'Office rent prepaid for the month of Mezan 1404', 0.00, 30000.00 FROM accounts WHERE account_code = '13100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4dbce777-fe5f-400f-b98d-aa060cbd45e3', '664bcc12-e8db-44d8-851e-55a428bdaacf', id, 'Kunar Office Rent prepaid for the month of Mezan 1404', 3000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '00302150-21ff-4532-94bb-61c41acbaddb', '664bcc12-e8db-44d8-851e-55a428bdaacf', id, 'Kunar Office Rent prepaid for the month of Mezan 1404', 0.00, 3000.00 FROM accounts WHERE account_code = '13100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a15c18a8-650b-4b3f-8852-8871215f9af1', '664bcc12-e8db-44d8-851e-55a428bdaacf', id, 'Paid the first installment', 1580.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2549563b-67d0-4e9a-894a-ab84cfa4ef42', '664bcc12-e8db-44d8-851e-55a428bdaacf', id, '', 0.00, 1580.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-724
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d6ae1c23-1bcf-4846-ae33-9010d004907e', 'JE-000768', '2025-10-25', 'Cash withdrawal from Azizi Bank by CEO and CFO', 'JV-JV-724', 'journal_entry', 150900.00, 150900.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '867219ef-edde-41ff-96f5-f56d17fedb17', 'd6ae1c23-1bcf-4846-ae33-9010d004907e', id, 'Cash withdrawal from Azizi Bank by CEO and CFO', 150000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5db39950-7960-411a-90df-bdc5fbf4c13e', 'd6ae1c23-1bcf-4846-ae33-9010d004907e', id, 'Cash withdrawal from Azizi Bank by CEO and CFO', 0.00, 150000.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2a5f16a9-ac3e-4942-bc0f-bdc1336e78b3', 'd6ae1c23-1bcf-4846-ae33-9010d004907e', id, 'Bank deducted for one cheque book printing', 900.00, 0.00 FROM accounts WHERE account_code = '61801';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bc11366b-874b-4a44-9045-7a6b0a4650a5', 'd6ae1c23-1bcf-4846-ae33-9010d004907e', id, 'Bank deducted for one cheque book printing', 0.00, 900.00 FROM accounts WHERE account_code = '10206';

-- Entry: JV-725
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7e980ec5-e777-440d-b764-cfaf9e144c58', 'JE-000769', '2025-10-25', 'Advance paid to Hedayatullah for Loan Disbursements to three murabaha customers (Hanifullah tanweer, Hameedullah Alokozay, and Waser ullah Safi)', 'JV-JV-725', 'journal_entry', 180400.00, 180400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5b5b8d19-fe49-4ad8-ab07-caed2e045bb9', '7e980ec5-e777-440d-b764-cfaf9e144c58', id, 'Advance paid to Hedayatullah for Loan Disbursements to three murabaha customers (Hanifullah tanweer, Hameedullah Alokozay, and Waser ullah Safi)', 90000.00, 0.00 FROM accounts WHERE account_code = '20173';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8c22ea75-f246-4029-a585-68bc8becd4c1', '7e980ec5-e777-440d-b764-cfaf9e144c58', id, 'Paid for hawala cost for the cash transfer to Jalalabad', 400.00, 0.00 FROM accounts WHERE account_code = '51300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c701f37-2917-4816-b06f-79c7ee4793e9', '7e980ec5-e777-440d-b764-cfaf9e144c58', id, 'Advance paid to Hedayatullah for Loan Disbursements to three murabaha customers (Hanifullah tanweer, Hameedullah Alokozay, and Waser ullah Safi)', 0.00, 90400.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '89bc5193-6b9b-4b32-a4f5-cca368ef6c46', '7e980ec5-e777-440d-b764-cfaf9e144c58', id, 'Purchased floor on Murabaha loan disbursement to Hanifullah Tanweer', 35000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9fe90558-9801-40d5-a720-413e4e043d2d', '7e980ec5-e777-440d-b764-cfaf9e144c58', id, 'Purchased medicine on Murabaha loan disbursement to Hamidullah Alokozay', 25000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6eb257bd-30e4-473e-b8b0-6a6c3dbac2f3', '7e980ec5-e777-440d-b764-cfaf9e144c58', id, 'Purchased kinds'' cloths on Murabaha loan disbursement to Waser ullah Safi', 30000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2efadb34-fb31-4f7d-a65b-3cd986030e39', '7e980ec5-e777-440d-b764-cfaf9e144c58', id, 'Advance paid to for hawala cost for the cash transfer to Jalalabad', 0.00, 90000.00 FROM accounts WHERE account_code = '20173';

-- Entry: JV-726
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('397a7d5d-ac07-454b-a865-b4eb9f456620', 'JE-000770', '2025-10-25', 'First installment paid by Nuhzatullah', 'JV-JV-726', 'journal_entry', 284.00, 284.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fe738607-65ed-443c-8a2f-922c1e1a867c', '397a7d5d-ac07-454b-a865-b4eb9f456620', id, 'First installment paid by Nuhzatullah', 284.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '036f2e6b-2193-4860-acf5-cb0c3720e27e', '397a7d5d-ac07-454b-a865-b4eb9f456620', id, 'First installment paid by Nuhzatullah', 0.00, 284.00 FROM accounts WHERE account_code = '50300';

-- Entry: JV-727
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7979ed84-a2f7-4961-bbc3-bfcb10fc317c', 'JE-000771', '2025-10-25', 'Paid to Gulzar for the purchase of materials for loan disbrusement on Murabaha to Mustafa Khairkhwa', 'JV-JV-727', 'journal_entry', 50000.00, 50000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '251bf6d5-3e3b-4566-89e4-a9d3008a2f11', '7979ed84-a2f7-4961-bbc3-bfcb10fc317c', id, 'Paid to Gulzar for the purchase of materials for loan disbrusement on Murabaha to Mustafa Khairkhwa', 20000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9e5f90ad-0bf1-4aa0-b2a5-ce71684e5369', '7979ed84-a2f7-4961-bbc3-bfcb10fc317c', id, 'Paid to Gulzar for the purchase of materials for loan disbursement on Murabaha to Mustafa Khairkhwa', 0.00, 20000.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a3e18e7a-80ba-4efe-8de1-2b2ac6da9c06', '7979ed84-a2f7-4961-bbc3-bfcb10fc317c', id, 'Paid to Gulzar for the purchase of Kids'' cloths on Murabaha loan disbursement to Naseer Jan Kashmiri', 30000.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '14e97c10-edb6-4942-8eb9-b7bb8eabbc9f', '7979ed84-a2f7-4961-bbc3-bfcb10fc317c', id, 'Paid to Gulzar for the purchase of Kids'' cloths on Murabaha loan disbursement to Naseer Jan Kashmiri', 0.00, 30000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-728
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f4ae6fcb-1845-45be-ac8e-f4bad6f0465e', 'JE-000772', '2025-10-25', 'Paid for the day food expense', 'JV-JV-728', 'journal_entry', 60139.00, 60139.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6e5534d5-5eed-49ed-84fd-76c144c3cc26', 'f4ae6fcb-1845-45be-ac8e-f4bad6f0465e', id, 'Paid for the day food expense', 460.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f621232a-7c66-4d84-8e38-c5af810635b8', 'f4ae6fcb-1845-45be-ac8e-f4bad6f0465e', id, 'Paid for the day food expense', 0.00, 460.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4c970fe3-7e1b-4b1c-9269-728c644b5b8a', 'f4ae6fcb-1845-45be-ac8e-f4bad6f0465e', id, 'Paid his first installment', 8103.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9b84bbdb-4c15-4ba7-a734-1ac23c314eca', 'f4ae6fcb-1845-45be-ac8e-f4bad6f0465e', id, '', 0.00, 8103.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0843d164-5c73-47c5-a39f-1f672ed914cd', 'f4ae6fcb-1845-45be-ac8e-f4bad6f0465e', id, 'Paid his first installment', 31909.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '05bb0b11-455a-464c-a640-985db1610f3b', 'f4ae6fcb-1845-45be-ac8e-f4bad6f0465e', id, '', 0.00, 31909.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '334b9cd4-3e0a-491d-a79f-cebac1df1b91', 'f4ae6fcb-1845-45be-ac8e-f4bad6f0465e', id, '', 19667.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '794ae5f3-8535-4970-b753-7cb7eb1c068b', 'f4ae6fcb-1845-45be-ac8e-f4bad6f0465e', id, '', 0.00, 19667.00 FROM accounts WHERE account_code = '11000';

-- Entry: LCI037
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6928aab5-b496-4bf7-b67f-fb83cda482ad', 'JE-000773', '2025-10-26', 'Sold Kids'' Cloths on Murabaha to Mr. Naseer Jan Kashmiri for 15 months on 18% profit margin.', 'JV-LCI037', 'financing_disbursement', 35400.00, 35400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e5cc7d28-a03b-4042-aa09-a18c7dd287fc', '6928aab5-b496-4bf7-b67f-fb83cda482ad', id, 'Sold Kids'' Cloths on Murabaha to Mr. Naseer Jan Kashmiri for 15 months on 18% profit margin.', 35400.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6e69ef8c-05a8-470e-827e-c1fbfa043705', '6928aab5-b496-4bf7-b67f-fb83cda482ad', id, 'Sold Kids'' Cloths on Murabaha to Mr. Naseer Jan Kashmiri for 15 months on 18% profit margin.', 0.00, 30000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9f260591-77d3-4dab-933f-d54b7ac9a681', '6928aab5-b496-4bf7-b67f-fb83cda482ad', id, 'Sold Kids'' Cloths on Murabaha to Mr. Naseer Jan Kashmiri for 15 months on 18% profit margin.', 0.00, 5400.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI038
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0118e81a-66f3-4aa0-a8b9-9e43a9fad4c5', 'JE-000774', '2025-10-26', 'Sold Grocery Items on Murabaha to Mr. Mustafa Khairkhwa for 15 months on 18% profit margin.', 'JV-LCI038', 'financing_disbursement', 23600.00, 23600.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f14cf960-96ae-4ae5-85a0-c6e429b69f5e', '0118e81a-66f3-4aa0-a8b9-9e43a9fad4c5', id, 'Sold Grocery Items on Murabaha to Mr. Mustafa Khairkhwa for 15 months on 18% profit margin.', 23600.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e59d29ff-8170-4332-9c82-1230fb19a00b', '0118e81a-66f3-4aa0-a8b9-9e43a9fad4c5', id, 'Sold Grocery Items on Murabaha to Mr. Mustafa Khairkhwa for 15 months on 18% profit margin.', 0.00, 20000.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cc24e4ee-e0ea-4823-8d43-d905d543e8ac', '0118e81a-66f3-4aa0-a8b9-9e43a9fad4c5', id, 'Sold Grocery Items on Murabaha to Mr. Mustafa Khairkhwa for 15 months on 18% profit margin.', 0.00, 3600.00 FROM accounts WHERE account_code = '20900';

-- Entry: JV-729
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('10b63379-b049-49bd-a4a0-b0f081cccf9d', 'JE-000775', '2025-10-26', 'First installment paid by Tawheedullah Hashimi', 'JV-JV-729', 'journal_entry', 10743.00, 10743.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fc795cfa-3ba2-4a8b-9f36-d8a693a229a7', '10b63379-b049-49bd-a4a0-b0f081cccf9d', id, 'First installment paid by Tawheedullah Hashimi', 3540.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '56ee3248-742d-4a7c-8b8b-43d7afb1d6e8', '10b63379-b049-49bd-a4a0-b0f081cccf9d', id, 'First installment paid by Tawheedullah Hashimi', 0.00, 3540.00 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '73d4b3d1-e454-4d65-8578-b483491e0051', '10b63379-b049-49bd-a4a0-b0f081cccf9d', id, 'First installment paid by Tawheedullah Hashimi', 5744.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9c7b554a-b415-421a-9011-b640c26ec26f', '10b63379-b049-49bd-a4a0-b0f081cccf9d', id, 'First installment paid by Tawheedullah Hashimi', 0.00, 5744.00 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8a782d52-61a1-4348-b9dd-6c5f42dc3ed3', '10b63379-b049-49bd-a4a0-b0f081cccf9d', id, 'First installment paid by Tawheedullah Hashimi', 1459.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a1c6f680-59cb-4546-b3e7-099cd1dcd0ae', '10b63379-b049-49bd-a4a0-b0f081cccf9d', id, 'First installment paid by Tawheedullah Hashimi', 0.00, 1459.00 FROM accounts WHERE account_code = '50300';

-- Entry: JV-730
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7bed2098-96ff-4998-8108-bc075cfd545c', 'JE-000776', '2025-10-26', 'Hawala cost to Kunar', 'JV-JV-730', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4aec3f29-95ae-43c5-b200-a08f2f18fa65', '7bed2098-96ff-4998-8108-bc075cfd545c', id, 'Hawala cost to Kunar', 500.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '467f033f-eb34-4b4e-97bf-e3ea19f9a978', '7bed2098-96ff-4998-8108-bc075cfd545c', id, 'Hawala cost to Kunar', 0.00, 500.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b94edc64-91f9-4d49-aa1a-e898deab6467', '7bed2098-96ff-4998-8108-bc075cfd545c', id, 'Paid for Hawala Cost for cash transfer to Kunar for Murabaha Loan for JV # 604', 500.00, 0.00 FROM accounts WHERE account_code = '51300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a66ac815-02cc-4c54-ae4e-db42d5c2994f', '7bed2098-96ff-4998-8108-bc075cfd545c', id, 'Paid for Hawala Cost for cash transfer to Kunar for Murabaha Loan for JV # 604', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-731
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('113f0319-baff-43ec-9a60-feaa19decb4e', 'JE-000777', '2025-10-26', 'Paid for taxi used by Gulzar to purchase items for clients on murabaha', 'JV-JV-731', 'journal_entry', 270.00, 270.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e797432e-34c1-4dd3-aa38-771b0f5cda29', '113f0319-baff-43ec-9a60-feaa19decb4e', id, 'Paid for taxi used by Gulzar to purchase items for clients on murabaha', 270.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '34b0332c-fb69-434a-9aa7-41b78ae89ffc', '113f0319-baff-43ec-9a60-feaa19decb4e', id, 'Paid for taxi used by Gulzar to purchase items for clients on murabaha', 0.00, 270.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-732
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f0c0a5ab-4197-44ae-9404-81a751dbe849', 'JE-000778', '2025-10-26', 'Paid for the office lunch expenses', 'JV-JV-732', 'journal_entry', 940.00, 940.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '54129f23-0349-42df-a845-b035ea58faeb', 'f0c0a5ab-4197-44ae-9404-81a751dbe849', id, 'Paid for the office lunch expenses', 940.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '384f6625-e172-4fa4-ab0e-30a6130f290d', 'f0c0a5ab-4197-44ae-9404-81a751dbe849', id, 'Paid for the office lunch expenses', 0.00, 940.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-733
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3ad1a1b3-4b17-4a5d-b6c6-cd8b0fc26682', 'JE-000779', '2025-10-26', 'Paid for taxi by Gulzar to bring the delivered documents from Jalalabad from city', 'JV-JV-733', 'journal_entry', 240.00, 240.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '491a7295-9bac-454f-be98-dee38ac50dcd', '3ad1a1b3-4b17-4a5d-b6c6-cd8b0fc26682', id, 'Paid for taxi by Gulzar to bring the delivered documents from Jalalabad from city', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '18a27b79-fe4d-4c4d-8e6f-ae5b68d2e085', '3ad1a1b3-4b17-4a5d-b6c6-cd8b0fc26682', id, 'Paid for taxi by Gulzar to bring the delivered documents from Jalalabad from city', 200.00, 0.00 FROM accounts WHERE account_code = '51100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6e32a66a-55ea-4138-ae8a-61615dc89ab7', '3ad1a1b3-4b17-4a5d-b6c6-cd8b0fc26682', id, 'Paid for taxi by Gulzar to bring the delivered documents from Jalalabad from city', 0.00, 240.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-734
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('baa007ee-f3a2-4151-8ecd-bfbdb3ae9a34', 'JE-000780', '2025-10-26', 'Taxi used by Gulzar for purchase of items for Murabaha customers', 'JV-JV-734', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a9ee1c75-030f-4a65-9e9b-88826823df90', 'baa007ee-f3a2-4151-8ecd-bfbdb3ae9a34', id, 'Taxi used by Gulzar for purchase of items for Murabaha customers', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ff09c797-9e35-486f-b2b9-fd8a418fd507', 'baa007ee-f3a2-4151-8ecd-bfbdb3ae9a34', id, 'Taxi used by Gulzar for purchase of items for Murabaha customers', 0.00, 150.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-735
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('873ffba3-f4b1-41cb-9d0d-588a4fc24828', 'JE-000781', '2025-10-27', 'Paid for the lunch expense', 'JV-JV-735', 'journal_entry', 2750.00, 2750.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c4076eec-81ea-4733-8b5e-1111fe16a032', '873ffba3-f4b1-41cb-9d0d-588a4fc24828', id, 'Paid for the lunch expense', 230.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4c126d9b-7b3b-4f52-90e0-9660d9e60e0a', '873ffba3-f4b1-41cb-9d0d-588a4fc24828', id, 'Paid for the lunch expense', 0.00, 230.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e377ba3b-b258-4061-bef4-3a98a19bad3c', '873ffba3-f4b1-41cb-9d0d-588a4fc24828', id, 'Paid his second installment', 2520.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f142283a-3864-4d10-a4c4-b82d59de8055', '873ffba3-f4b1-41cb-9d0d-588a4fc24828', id, '', 0.00, 2520.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-736
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e1d4a660-aaff-461a-a417-4e9954ae305b', 'JE-000782', '2025-10-27', 'First installment paid by Layeq Ashna', 'JV-JV-736', 'journal_entry', 16133.60, 16133.60, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a761a8a0-dc74-4369-80af-b3db9dbe0e5a', 'e1d4a660-aaff-461a-a417-4e9954ae305b', id, 'First installment paid by Layeq Ashna', 453.60, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0a6bd370-6a04-46e7-8811-e9c67f3b2c89', 'e1d4a660-aaff-461a-a417-4e9954ae305b', id, 'First installment paid by Layeq Ashna', 0.00, 453.60 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a5c15427-b823-4bd9-abd0-bff77bb5346c', 'e1d4a660-aaff-461a-a417-4e9954ae305b', id, '', 7811.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a1c78ed1-63fc-4802-9256-947cddf2f71c', 'e1d4a660-aaff-461a-a417-4e9954ae305b', id, '', 0.00, 7811.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b5a1aaf2-54bc-4da7-ad26-38d82a47ca76', 'e1d4a660-aaff-461a-a417-4e9954ae305b', id, '', 7869.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f359e164-24f1-4f19-8b63-19fd2c616477', 'e1d4a660-aaff-461a-a417-4e9954ae305b', id, '', 0.00, 7869.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-737
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c8c25a7d-5e60-47dc-ba60-2cd14c0fd0f7', 'JE-000783', '2025-10-28', 'Paid for the lunch expense and drinking water', 'JV-JV-737', 'journal_entry', 290.00, 290.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2cfe953f-9892-4000-9491-7849886e5406', 'c8c25a7d-5e60-47dc-ba60-2cd14c0fd0f7', id, 'Paid for the lunch expense and drinking water', 290.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ec6f57c0-306f-4ab6-9496-2304bc906295', 'c8c25a7d-5e60-47dc-ba60-2cd14c0fd0f7', id, 'Paid for the lunch expense and drinking water', 0.00, 290.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-738
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c836aae8-7e33-45f5-8ddc-daf0a891620a', 'JE-000784', '2025-10-28', 'Paid taxi used by liaqat for stationery purchase', 'JV-JV-738', 'journal_entry', 50.00, 50.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4536493c-89c8-4446-beb6-dd570a24d6e8', 'c836aae8-7e33-45f5-8ddc-daf0a891620a', id, 'Paid taxi used by liaqat for stationery purchase', 50.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '14796798-33d0-4dbf-926a-06d175dec4f9', 'c836aae8-7e33-45f5-8ddc-daf0a891620a', id, 'Paid taxi used by liaqat for stationery purchase', 0.00, 50.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-739
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ba283007-1e59-465d-a83e-c331825525d3', 'JE-000785', '2025-10-28', 'Firs installment paid by Attaulrahman Muhammadi', 'JV-JV-739', 'journal_entry', 2822.00, 2822.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd9474e31-5caa-4ff4-8260-8d160125636e', 'ba283007-1e59-465d-a83e-c331825525d3', id, 'Firs installment paid by Attaulrahman Muhammadi', 1416.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '722ad3e5-fe8c-4384-a196-2209bed9fa0a', 'ba283007-1e59-465d-a83e-c331825525d3', id, 'Firs installment paid by Attaulrahman Muhammadi', 0.00, 1416.00 FROM accounts WHERE account_code = '50300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '97a0a84c-dfcd-4651-9c8c-b0e3dd904a11', 'ba283007-1e59-465d-a83e-c331825525d3', id, 'Firs installment paid by Noorzaman Safi', 1406.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e1a7545-1393-49a6-ae98-94dd515b1716', 'ba283007-1e59-465d-a83e-c331825525d3', id, 'Firs installment paid by Noorzaman Safi', 0.00, 1406.00 FROM accounts WHERE account_code = '50300';

-- Entry: JV-740
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('48926a46-1955-482b-b796-96cf0cef3ce6', 'JE-000786', '2025-10-29', 'Paid for the lunch expense for the day', 'JV-JV-740', 'journal_entry', 410.00, 410.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '560a871e-ee32-4e9e-96bf-7a1c16988ad7', '48926a46-1955-482b-b796-96cf0cef3ce6', id, 'Paid for the lunch expense for the day', 410.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f16aa55c-1010-4c21-be33-376a63e35a23', '48926a46-1955-482b-b796-96cf0cef3ce6', id, 'Paid for the lunch expense for the day', 0.00, 410.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-741
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('30feee88-97c4-4ca3-8994-d3495c13acaa', 'JE-000787', '2025-10-31', 'Paid for the lunch expense for the day', 'JV-JV-741', 'journal_entry', 320.00, 320.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4c1ace76-6bb9-4005-8890-d8bcf6f7a1a9', '30feee88-97c4-4ca3-8994-d3495c13acaa', id, 'Paid for the lunch expense for the day', 320.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f8da253a-bccd-4370-ad02-c7d9b7bbff1c', '30feee88-97c4-4ca3-8994-d3495c13acaa', id, 'Paid for the lunch expense for the day', 0.00, 320.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-742
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4753a334-644d-46a7-a2d8-27f3674e8ee8', 'JE-000788', '2025-10-31', 'Bank charges for the month of Oct 2025', 'JV-JV-742', 'journal_entry', 1368.53, 1368.53, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f4b78363-4f8d-49bd-9197-b8708e2af7ee', '4753a334-644d-46a7-a2d8-27f3674e8ee8', id, 'Bank charges for the month of Oct 2025', 1368.53, 0.00 FROM accounts WHERE account_code = '61801';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7003848b-cfe2-40b5-827b-51002a969e4e', '4753a334-644d-46a7-a2d8-27f3674e8ee8', id, 'Bank charges for the month of Oct 2025', 0.00, 668.10 FROM accounts WHERE account_code = '10201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e4ad7a3-1768-4f38-8ec4-46bbef43a3d1', '4753a334-644d-46a7-a2d8-27f3674e8ee8', id, 'Bank charges for the month of Oct 2025', 0.00, 200.43 FROM accounts WHERE account_code = '10203';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cfd115f8-95dc-4d57-9434-8cc54cd62873', '4753a334-644d-46a7-a2d8-27f3674e8ee8', id, 'Bank charges for the month of Oct 2025', 0.00, 150.00 FROM accounts WHERE account_code = '10204';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd2d1caa7-86a4-4278-a564-43bec2b722f9', '4753a334-644d-46a7-a2d8-27f3674e8ee8', id, 'Bank charges for the month of Oct 2025', 0.00, 350.00 FROM accounts WHERE account_code = '10206';

-- Entry: JV-743
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('792378ab-4513-4038-acee-bf2eeb335cb6', 'JE-000789', '2025-10-31', 'Provision expense booked for the month of Oct 2025', 'JV-JV-743', 'journal_entry', 2800.00, 2800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '019c4e1a-c9a2-489a-b301-97dc345068f1', '792378ab-4513-4038-acee-bf2eeb335cb6', id, 'Provision expense booked for the month of Oct 2025', 2800.00, 0.00 FROM accounts WHERE account_code = '80102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ed529308-f186-47a0-9e47-99c38a7e1df2', '792378ab-4513-4038-acee-bf2eeb335cb6', id, 'Provision expense booked for the month of Oct 2025', 0.00, 2800.00 FROM accounts WHERE account_code = '18000';

-- Entry: JV-744
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('eab61528-17ad-420c-adca-d83c3b132ca3', 'JE-000790', '2025-10-31', 'Kabul Financing officer''s salary payable for the month of Oct 2025', 'JV-JV-744', 'journal_entry', 421838.00, 421838.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '30a9459b-6c80-4439-82d8-e6aebaf9aa31', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Kabul Financing officer''s salary payable for the month of Oct 2025', 13000.00, 0.00 FROM accounts WHERE account_code = '51200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5eaa670d-413f-4d11-b725-97d9480b930e', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Kunar Financing officer''s salary payable for the month of Oct 2025', 6000.00, 0.00 FROM accounts WHERE account_code = '51200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ea8cc4a8-a0c1-444c-a32b-f5a815f760d8', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Jalalabad Financing officer''s salary payable for the month of Oct 2025', 6000.00, 0.00 FROM accounts WHERE account_code = '51200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9f83ded3-1a77-4369-a3ef-5e7af65678de', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary payable for the month of Oct 2025', 321838.00, 0.00 FROM accounts WHERE account_code = '60001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1de7f72d-2644-427d-bee6-77101b55ddc6', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary payable for the month of Oct 2025', 0.00, 134000.00 FROM accounts WHERE account_code = '20169';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '960d85d5-91f1-4343-ad8a-9c160d1675ff', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary payable for the month of Oct 2025', 0.00, 28100.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '88f16c38-c75c-48dd-b692-0abc2dd99797', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary payable for the month of Oct 2025', 0.00, 23600.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fb869be9-a2db-485c-a43b-e2c34a6c2430', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary payable for the month of Oct 2025', 0.00, 23600.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4afab5aa-ce64-41b0-bb10-8898a77634ca', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary payable for the month of Oct 2025', 0.00, 30000.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5695a5ca-7ba8-458d-9945-4aaeedc0ae61', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary payable for the month of Oct 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ddeb9bf1-f595-4bc7-adb3-5bb539f8cc26', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary payable for the month of Oct 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8d348a01-58ad-4fdd-84fa-382f3737d2e6', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary payable for the month of Oct 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e4eaf747-6a1b-44af-a451-fd87c10a8b93', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary payable for the month of Oct 2025', 0.00, 5980.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1617fcf7-3952-45a7-817b-860bdb6a54ee', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary payable for the month of Oct 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20170';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c2464ecd-3c38-4c07-8f1f-4a11749c32a0', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary payable for the month of Oct 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20171';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e5262fe8-3152-494a-8314-5d6a273d859a', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary payable for the month of Oct 2025', 0.00, 10000.00 FROM accounts WHERE account_code = '20172';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '837f8f56-7cc4-4a5d-9e24-2bb2c74620c9', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary payable for the month of Oct 2025', 0.00, 11860.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c4a88442-cede-4a89-a77b-22cceb475488', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary payable for the month of Oct 2025', 0.00, 3000.00 FROM accounts WHERE account_code = '20174';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a3a99b85-e416-406e-8710-6f65416cd745', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary payable for the month of Oct 2025', 0.00, 3000.00 FROM accounts WHERE account_code = '20176';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9ca68659-f8a7-4ab4-8957-442015e9abdf', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary payable for the month of Oct 2025', 0.00, 5980.00 FROM accounts WHERE account_code = '20173';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '627e7b21-4d6d-4508-a8ce-a478da875ed2', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary payable for the month of Oct 2025', 0.00, 5980.00 FROM accounts WHERE account_code = '20175';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b238de33-4343-40a1-abee-b0535866674f', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Staff salary withheld for the month of Oct 2025', 0.00, 26938.00 FROM accounts WHERE account_code = '21100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '410f1782-cf2b-4698-b6f0-28e47d156e89', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Fee paid to Members for the second Third Quarter 2025', 75000.00, 0.00 FROM accounts WHERE account_code = '60410';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f61632a4-5764-4070-ada5-9e32e19171cd', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Fee paid to Members for the second Third Quarter 2025', 0.00, 25000.00 FROM accounts WHERE account_code = '20162';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dbf54ccd-ad13-4283-98a7-09ca2810412c', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Fee paid to Members for the second Third Quarter 2025', 0.00, 25000.00 FROM accounts WHERE account_code = '20163';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '34f14c96-81c7-47cd-9888-88cb1910ce89', 'eab61528-17ad-420c-adca-d83c3b132ca3', id, 'Fee paid to Members for the second Third Quarter 2025', 0.00, 25000.00 FROM accounts WHERE account_code = '20164';

-- Entry: JV-745
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3486a6b3-b131-4b79-b3e3-4fe53fcd7e37', 'JE-000791', '2025-10-31', 'Depreciation expense booked for the month of Oct 2025', 'JV-JV-745', 'journal_entry', 21594.97, 21594.97, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '93a2f81a-b2f6-40f7-852e-7e3ac66bedf9', '3486a6b3-b131-4b79-b3e3-4fe53fcd7e37', id, 'Depreciation expense booked for the month of Oct 2025', 21594.97, 0.00 FROM accounts WHERE account_code = '61900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '45b4820f-3b7f-4fd2-b46e-0a05f655578b', '3486a6b3-b131-4b79-b3e3-4fe53fcd7e37', id, 'Depreciation expense booked for the month of Oct 2025', 0.00, 3764.10 FROM accounts WHERE account_code = '17102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ac9ca628-3571-41ad-b7ee-49dbc248811b', '3486a6b3-b131-4b79-b3e3-4fe53fcd7e37', id, 'Depreciation expense booked for the month of Oct 2025', 0.00, 4399.17 FROM accounts WHERE account_code = '17202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ddb2e999-30ef-4d28-9f08-c7c7984de6d7', '3486a6b3-b131-4b79-b3e3-4fe53fcd7e37', id, 'Depreciation expense booked for the month of Oct 2025', 0.00, 11327.89 FROM accounts WHERE account_code = '17302';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f87e8a35-ce2b-4d30-a278-8440a4512ca9', '3486a6b3-b131-4b79-b3e3-4fe53fcd7e37', id, 'Depreciation expense booked for the month of Oct 2025', 0.00, 2103.81 FROM accounts WHERE account_code = '17502';

-- Entry: JV-746
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('21003238-84db-4478-ad8d-2cf841a72ef4', 'JE-000792', '2025-10-31', 'QuickBooks subscription booked for the month of Oct 2025', 'JV-JV-746', 'journal_entry', 1712.00, 1712.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '850dc783-35b3-4c41-af59-a73e8e7d5d9c', '21003238-84db-4478-ad8d-2cf841a72ef4', id, 'QuickBooks subscription booked for the month of Oct 2025', 1712.00, 0.00 FROM accounts WHERE account_code = '70000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ce69d147-7647-483c-a08a-11f7801fce5f', '21003238-84db-4478-ad8d-2cf841a72ef4', id, 'QuickBooks subscription booked for the month of Oct 2025', 0.00, 1712.00 FROM accounts WHERE account_code = '13100';

-- Entry: JV-747
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1951ea33-c480-4033-b516-d7bd90fdf23c', 'JE-000793', '2025-11-01', 'Paid for lunch expenses', 'JV-JV-747', 'journal_entry', 295.00, 295.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd3d3e2be-affb-4265-804e-56bedd1c201b', '1951ea33-c480-4033-b516-d7bd90fdf23c', id, 'Paid for lunch expenses', 295.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '937b3589-8823-4220-ab32-6a912b7c6078', '1951ea33-c480-4033-b516-d7bd90fdf23c', id, 'Paid for lunch expenses', 0.00, 295.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-748
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('46caba88-d996-4ce3-a1c8-119275cbe1dc', 'JE-000794', '2025-11-02', 'Paid for lunch and toilet material', 'JV-JV-748', 'journal_entry', 340.00, 340.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '85979c51-1135-43f4-a547-6119d30fb79b', '46caba88-d996-4ce3-a1c8-119275cbe1dc', id, 'Paid for lunch and toilet material', 340.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b48aca41-95c8-4251-a810-3f1983065d9e', '46caba88-d996-4ce3-a1c8-119275cbe1dc', id, 'Paid for lunch and toilet material', 0.00, 340.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-749
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('aa2eab7a-54f5-46f4-a710-36561d2f4fa5', 'JE-000795', '2025-11-02', 'Paid for taxi used by Gulzar to bring cash', 'JV-JV-749', 'journal_entry', 2700.00, 2700.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a7c98b1c-ad84-4683-b688-5c7fccdccdb4', 'aa2eab7a-54f5-46f4-a710-36561d2f4fa5', id, 'Paid for taxi used by Gulzar to bring cash', 90.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3bf48512-14f1-4a81-b90d-e3b755205c2f', 'aa2eab7a-54f5-46f4-a710-36561d2f4fa5', id, 'Paid for taxi used by Gulzar to bring cash', 0.00, 90.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1ef7ef4b-172a-419b-ac5c-1a559c18b313', 'aa2eab7a-54f5-46f4-a710-36561d2f4fa5', id, '', 2610.00, 0.00 FROM accounts WHERE account_code = '10206';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f129dd6e-e93b-4bf7-b914-9cf25aacd94a', 'aa2eab7a-54f5-46f4-a710-36561d2f4fa5', id, '', 0.00, 2610.00 FROM accounts WHERE account_code = '11000';

-- Entry: JV-750
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8a822df5-3274-4399-b9ba-8f37b49c5c15', 'JE-000796', '2025-11-02', 'Collected the first installment from Mr. Khoda Dost', 'JV-JV-750', 'journal_entry', 470.00, 470.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2f1d59e9-3fd4-490d-992a-cc9ee61f4dfe', '8a822df5-3274-4399-b9ba-8f37b49c5c15', id, 'Collected the first installment from Mr. Khoda Dost', 470.00, 0.00 FROM accounts WHERE account_code = '20900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7e523e8b-57c5-42f0-9568-fddc7902747d', '8a822df5-3274-4399-b9ba-8f37b49c5c15', id, 'Collected the first installment from Mr. Khoda Dost', 0.00, 470.00 FROM accounts WHERE account_code = '50300';

-- Entry: JV-751
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fda97620-66ae-43ff-bca9-b1c69ed81e9c', 'JE-000797', '2025-11-02', 'Paid for gas used for the kitchen', 'JV-JV-751', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3a927ff9-45ac-492b-8550-f582a9d9d7ff', 'fda97620-66ae-43ff-bca9-b1c69ed81e9c', id, 'Paid for gas used for the kitchen', 500.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a07c661b-e30e-4255-8fac-ff85b7af782c', 'fda97620-66ae-43ff-bca9-b1c69ed81e9c', id, 'Paid for gas used for the kitchen', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-752
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4001addf-2f5e-4980-af2c-7c8bcf93d2f2', 'JE-000798', '2025-11-02', 'Paid for internet fee for the month of November 2025', 'JV-JV-752', 'journal_entry', 6000.00, 6000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1841d43e-91da-4a59-8f4e-184460b26428', '4001addf-2f5e-4980-af2c-7c8bcf93d2f2', id, 'Paid for internet fee for the month of November 2025', 6000.00, 0.00 FROM accounts WHERE account_code = '61202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4456dad3-3f5e-4f97-aa8a-cfbc6acef889', '4001addf-2f5e-4980-af2c-7c8bcf93d2f2', id, 'Paid for internet fee for the month of November 2025', 0.00, 6000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-753
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('47c51caf-51f5-4290-85eb-21c4d118fd3e', 'JE-000799', '2025-11-02', 'Cash Received CR# 95 for daily office expenses', 'JV-JV-753', 'journal_entry', 15500.00, 15500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '33bdc5b6-7cbb-4dd1-8a68-5656cae76a86', '47c51caf-51f5-4290-85eb-21c4d118fd3e', id, 'Cash Received CR# 95 for daily office expenses', 15500.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '92ab0d47-2e0a-4a1f-ae41-e1c7580ed22e', '47c51caf-51f5-4290-85eb-21c4d118fd3e', id, 'Cash Received CR# 95 for daily office expenses', 0.00, 15500.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-754
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b72d00dd-79cc-4ce2-a5df-aec2308f7bb4', 'JE-000800', '2025-11-03', 'Paid for taxi used by Shakoor to bring cash', 'JV-JV-754', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '72d2d608-2cad-4d6d-98a7-cc2bba700af2', 'b72d00dd-79cc-4ce2-a5df-aec2308f7bb4', id, 'Paid for taxi used by Shakoor to bring cash', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '69e54900-2e77-4d66-825c-82444308417d', 'b72d00dd-79cc-4ce2-a5df-aec2308f7bb4', id, 'Paid for taxi used by Shakoor to bring cash', 0.00, 150.00 FROM accounts WHERE account_code = '10101';

COMMIT;