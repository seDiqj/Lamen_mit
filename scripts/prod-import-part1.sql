BEGIN;
-- Production Journal Entries Import
-- Run this in the Production Database manually
-- Generated: 2026-02-03T12:54:17.244Z
-- Total entries: 1189

BEGIN;

-- Reset account balances
UPDATE accounts SET current_balance = 0;

-- Entry: 1
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bb33d892-000a-47f4-8521-384d83142d5d', 'JE-000001', '2025-01-01', 'Opening Shared capital by the shareholders.', 'JV-1', 'journal_entry', 51000000.00, 51000000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '223fa0e0-3199-426f-a048-e64ed2a2b880', 'bb33d892-000a-47f4-8521-384d83142d5d', id, 'Opening Shared capital by the shareholders.', 51000000.00, 0.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'daa13ec8-9712-416c-bd6a-3c13aebcc6f3', 'bb33d892-000a-47f4-8521-384d83142d5d', id, 'Opening Shared capital by the shareholders.', 0.00, 51000000.00 FROM accounts WHERE account_code = '30100';

-- Entry: 2
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('749adcd8-74af-4411-ace1-c467cca50f50', 'JE-000002', '2025-01-01', 'Paid one month rent as security deposit to the office house owner.', 'JV-2', 'journal_entry', 93000.00, 93000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '19a917a8-0add-463a-b300-dd4a73a0ef16', '749adcd8-74af-4411-ace1-c467cca50f50', id, 'Paid one month rent as security deposit to the office house owner.', 30000.00, 0.00 FROM accounts WHERE account_code = '14000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c406d316-5a09-4af6-b38d-4b7267c9b9f3', '749adcd8-74af-4411-ace1-c467cca50f50', id, 'Paid house rent for the month of Qaws 1403', 33000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b6c279fa-a5b1-4536-885d-d1e6b0a0b7dd', '749adcd8-74af-4411-ace1-c467cca50f50', id, 'Prepaid house rent for the month of Jadi 1403', 30000.00, 0.00 FROM accounts WHERE account_code = '13100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b16a0f11-f01a-4878-b986-b90f1b339f69', '749adcd8-74af-4411-ace1-c467cca50f50', id, 'Withheld house rent tax for the month of Qaws 1404', 0.00, 3000.00 FROM accounts WHERE account_code = '21200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cf93106d-81ab-4646-ab71-56db244d2f31', '749adcd8-74af-4411-ace1-c467cca50f50', id, 'Paid house rent for the month of Qaws and prepaid for Jadi 1403 and one month security deposit.', 0.00, 90000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 3
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('261e4e6e-2a56-4990-a283-bbdb798cbc12', 'JE-000003', '2025-01-01', 'Printing stamps with machin', 'JV-3', 'journal_entry', 2780.00, 2780.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b2cb6147-77b9-4abc-a997-a7cf1cb7214c', '261e4e6e-2a56-4990-a283-bbdb798cbc12', id, 'Printing stamps with machin', 800.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '77461999-e03b-48ea-b118-5a3da641d529', '261e4e6e-2a56-4990-a283-bbdb798cbc12', id, 'Printing stamps with machine', 0.00, 800.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6c675cfe-6196-4a7b-b3fd-3784105900c9', '261e4e6e-2a56-4990-a283-bbdb798cbc12', id, 'Printing UV ID Cards both sides high quality', 1980.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8edfee27-9c4b-44ac-8f13-39fd118b088e', '261e4e6e-2a56-4990-a283-bbdb798cbc12', id, 'Printing UV ID Cards both sides high quality', 0.00, 1980.00 FROM accounts WHERE account_code = '10100';

-- Entry: 4
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cf3c4970-2c26-410e-88b5-024a0c1b8c85', 'JE-000004', '2025-01-01', 'Printing UV ID Cards and card strap with logo and plastic cover both sides high quality', 'JV-4', 'journal_entry', 700.00, 700.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fbeb7074-4d5d-41bf-b20b-bf8a18d138f3', 'cf3c4970-2c26-410e-88b5-024a0c1b8c85', id, 'Printing UV ID Cards and card strap with logo and plastic cover both sides high quality', 700.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0a17fb4d-a8bf-4581-bb25-69703f7d0146', 'cf3c4970-2c26-410e-88b5-024a0c1b8c85', id, 'Printing UV ID Cards and card strap with logo and plastic cover both sides high quality', 0.00, 700.00 FROM accounts WHERE account_code = '10100';

-- Entry: 5
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cf0d372a-438e-4d62-9075-903107244629', 'JE-000005', '2025-01-01', 'Purchased Carpet for the office including fitting and glue', 'JV-5', 'journal_entry', 33800.00, 33800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '53b2efb3-f4d5-4656-b025-885bf58412e5', 'cf0d372a-438e-4d62-9075-903107244629', id, 'Purchased Carpet for the office including fitting and glue', 33800.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a65a3840-bb58-49ef-8ae9-480f62bf61b8', 'cf0d372a-438e-4d62-9075-903107244629', id, 'Purchased Carpet for the office including fitting and glue', 0.00, 33800.00 FROM accounts WHERE account_code = '10100';

-- Entry: 6
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bf4ea6bc-8a33-4daa-962b-a2d537655f4a', 'JE-000006', '2025-01-01', 'Purchased bulbs for the office lighting.', 'JV-6', 'journal_entry', 3200.00, 3200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ca9b0d92-ab55-4a81-813c-48b42725789a', 'bf4ea6bc-8a33-4daa-962b-a2d537655f4a', id, 'Purchased bulbs for the office lighting.', 3200.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b6f872a0-376d-4373-8d31-1ed105b245b9', 'bf4ea6bc-8a33-4daa-962b-a2d537655f4a', id, 'Purchased bulbs for the office lighting.', 0.00, 3200.00 FROM accounts WHERE account_code = '10100';

-- Entry: 7
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('19783e20-78a3-46ca-87c3-b586065f516e', 'JE-000007', '2025-01-01', 'Purchased Pipe and sandals for office use.', 'JV-7', 'journal_entry', 21910.00, 21910.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ab151d64-7cd5-4e02-86c1-76166e9f860e', '19783e20-78a3-46ca-87c3-b586065f516e', id, 'Purchased Pipe and sandals for office use.', 1430.00, 0.00 FROM accounts WHERE account_code = '60500';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7fef7bb7-ea7d-4b6d-abc5-097cbe606642', '19783e20-78a3-46ca-87c3-b586065f516e', id, 'Paid for 6000 + 6000 water tanker for the office use.', 3000.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eb04d647-35d7-4389-a5ae-4fad1f55908c', '19783e20-78a3-46ca-87c3-b586065f516e', id, 'Paid for lunch during the office opening.', 1400.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd763371c-124b-4440-ab84-f4fb522509e2', '19783e20-78a3-46ca-87c3-b586065f516e', id, 'Paid for the office cleaning with opening the office.', 3480.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'af9061cf-58a6-4dae-bcaf-e88bfa1babd1', '19783e20-78a3-46ca-87c3-b586065f516e', id, 'Taxi used for the office work.', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '887e9a02-8f32-4ee2-92b1-8c1d8eab2868', '19783e20-78a3-46ca-87c3-b586065f516e', id, 'Purchased cold drinks for the guests.', 500.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1b48df76-98c9-4cf4-9609-e47745e64f18', '19783e20-78a3-46ca-87c3-b586065f516e', id, 'Paid for miscellaneous small expenses used during the office opening.', 6700.00, 0.00 FROM accounts WHERE account_code = '80103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '360a6eb8-e364-45b8-b15d-0b309e49135e', '19783e20-78a3-46ca-87c3-b586065f516e', id, 'Paid for truck rent to transport office equipment.', 3500.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '878b7594-df35-4520-b5d7-22ebb5ac369b', '19783e20-78a3-46ca-87c3-b586065f516e', id, 'Purchased electric materials for the office electricity system.', 1750.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '28995984-0ee4-4e33-9e25-c65212f1348e', '19783e20-78a3-46ca-87c3-b586065f516e', id, 'Paid for different expenses during office opening.', 0.00, 21910.00 FROM accounts WHERE account_code = '10100';

-- Entry: 8
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('405a4bee-9248-4b23-9336-229b60afd019', 'JE-000008', '2025-01-01', 'Purchased one water tanker for water storage for the office use.', 'JV-8', 'journal_entry', 11500.00, 11500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '755fc496-4bdc-46ba-a01b-1ea12e0dfcc3', '405a4bee-9248-4b23-9336-229b60afd019', id, 'Purchased one water tanker for water storage for the office use.', 11500.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6e163dcd-bde2-4daa-b271-3c121692359e', '405a4bee-9248-4b23-9336-229b60afd019', id, 'Purchased one water tanker for water storage for the office use.', 0.00, 11500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 9
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('05e77402-ea9a-4347-97af-6cd6a7c3e863', 'JE-000009', '2025-01-01', 'Purchased 1 DVR with 6 security cameras of 2 mega pixels with all other necessary parts.', 'JV-9', 'journal_entry', 51320.00, 51320.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4ea13bf5-b65a-4f01-bf08-37bc5f4caaf4', '05e77402-ea9a-4347-97af-6cd6a7c3e863', id, 'Purchased 1 DVR with 6 security cameras of 2 mega pixels with all other necessary parts.', 13840.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '26ee9860-0308-464a-ac2b-0cc3f91fcecc', '05e77402-ea9a-4347-97af-6cd6a7c3e863', id, 'Purchased one ruck 12u 450/450 used condition', 7480.00, 0.00 FROM accounts WHERE account_code = '17101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '01fb8e46-888a-47f6-b4ac-6755d52a5231', '05e77402-ea9a-4347-97af-6cd6a7c3e863', id, 'Purchased two access points Unifi AP AC Pro S/N RJS S/NVDi', 14280.00, 0.00 FROM accounts WHERE account_code = '17101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c998a9be-fde6-4922-813a-c78960b570a3', '05e77402-ea9a-4347-97af-6cd6a7c3e863', id, 'RJ45 Connectors Infinl', 2300.00, 0.00 FROM accounts WHERE account_code = '17101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '00acb83b-fcbb-400e-bf02-78ae2c726b2a', '05e77402-ea9a-4347-97af-6cd6a7c3e863', id, 'Cramping Tolls D/Net', 1000.00, 0.00 FROM accounts WHERE account_code = '17101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e0c1df96-0f75-4002-91a5-5153b2304a5b', '05e77402-ea9a-4347-97af-6cd6a7c3e863', id, 'PCI Express Network Card GIGABIT SN/5411', 1400.00, 0.00 FROM accounts WHERE account_code = '17101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'edbf79dd-1a51-48c0-98d1-39168ab56326', '05e77402-ea9a-4347-97af-6cd6a7c3e863', id, 'Purchased UPS Marcary 1500AV', 5780.00, 0.00 FROM accounts WHERE account_code = '17101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fe665c0a-68b7-4a28-86a5-2b8b4f532b68', '05e77402-ea9a-4347-97af-6cd6a7c3e863', id, 'Purchase of cables and some other small parts for IT', 5240.00, 0.00 FROM accounts WHERE account_code = '61207';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd93f7ee9-4c77-4ae1-b59c-4f24ed0c815e', '05e77402-ea9a-4347-97af-6cd6a7c3e863', id, 'Purchased security cameras, Ruck, Assess points, UPS, network card, cables and some other parts', 0.00, 51320.00 FROM accounts WHERE account_code = '10100';

-- Entry: 10
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b1b2b894-08f9-4f37-a0b0-cb0793d53fd2', 'JE-000010', '2025-01-01', 'Purchased ThinkPad Laptops', 'JV-10', 'journal_entry', 40000.00, 40000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1d169b72-302f-4049-8a31-677b08ce818f', 'b1b2b894-08f9-4f37-a0b0-cb0793d53fd2', id, 'Purchased ThinkPad Laptops', 40000.00, 0.00 FROM accounts WHERE account_code = '17101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cc469eff-ed2e-4a16-91ab-4c7ba046c7c7', 'b1b2b894-08f9-4f37-a0b0-cb0793d53fd2', id, 'Purchased ThinkPad Laptops', 0.00, 40000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 11
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('458372f9-926e-4fd4-99a0-d0d6dd07c449', 'JE-000011', '2025-01-01', 'Purchased HDMI cables, splitters, bracket and some other parts', 'JV-11', 'journal_entry', 3800.00, 3800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '41552a66-7a2a-4ee6-9a6d-dcf557f55b8a', '458372f9-926e-4fd4-99a0-d0d6dd07c449', id, 'Purchased HDMI cables, splitters, bracket and some other parts', 3800.00, 0.00 FROM accounts WHERE account_code = '61207';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ba3f6b93-0562-4a0e-97b9-86443dacbf8c', '458372f9-926e-4fd4-99a0-d0d6dd07c449', id, 'Purchased HDMI cables, splitters, bracket and some other parts', 0.00, 3800.00 FROM accounts WHERE account_code = '10100';

-- Entry: 12
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c5fc19aa-a049-41e8-9be6-a5d88ed436b7', 'JE-000012', '2025-01-01', 'Taxi used for the office work', 'JV-12', 'journal_entry', 550.00, 550.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2c3c7050-7076-43c0-b787-916e1fa26a29', 'c5fc19aa-a049-41e8-9be6-a5d88ed436b7', id, 'Taxi used for the office work', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '52a833b2-ac36-45eb-be6a-ce5c4f122d70', 'c5fc19aa-a049-41e8-9be6-a5d88ed436b7', id, 'Paid for staff lunch during office opening.', 400.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '79ab090c-19c3-4818-ba48-115b6ed1e21d', 'c5fc19aa-a049-41e8-9be6-a5d88ed436b7', id, 'Paid for taxi and lunch.', 0.00, 550.00 FROM accounts WHERE account_code = '10100';

-- Entry: 13
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('70c9a7a5-715d-49fc-9c4c-0ee2c6f65bc2', 'JE-000013', '2025-01-01', 'Paid for staff lunch by Haji Sanger', 'JV-13', 'journal_entry', 2120.00, 2120.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '257feed8-8c3f-43f3-a655-ba4d33d89a9b', '70c9a7a5-715d-49fc-9c4c-0ee2c6f65bc2', id, 'Paid for staff lunch by Haji Sanger', 1000.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b418de36-3f78-46fd-8097-4914a4a95597', '70c9a7a5-715d-49fc-9c4c-0ee2c6f65bc2', id, 'Paid for liquid gas purchas', 230.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '81225bf2-dbf9-47a4-b8cd-01e1d4d3486a', '70c9a7a5-715d-49fc-9c4c-0ee2c6f65bc2', id, 'Paid for the Power generator fuel', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b7581306-bffe-44ef-9a64-1b2808c369f7', '70c9a7a5-715d-49fc-9c4c-0ee2c6f65bc2', id, 'Taxi used to Kart e Chahar for MIS.', 390.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '11615388-4673-433e-a309-b70a97a34964', '70c9a7a5-715d-49fc-9c4c-0ee2c6f65bc2', id, 'Paid for staff lunch, liquid gas, fuel for the power generator and taxi charges.', 0.00, 2120.00 FROM accounts WHERE account_code = '10100';

-- Entry: 14
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('45133d21-b2fc-49f1-8cb5-010b7d5779ee', 'JE-000014', '2025-01-01', 'Purchased HDMI Cable.', 'JV-14', 'journal_entry', 1800.00, 1800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3e804eec-346c-4e70-8925-14da9673e6c8', '45133d21-b2fc-49f1-8cb5-010b7d5779ee', id, 'Purchased HDMI Cable.', 1800.00, 0.00 FROM accounts WHERE account_code = '61207';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c50764fe-536d-4084-8601-8590ce11afa4', '45133d21-b2fc-49f1-8cb5-010b7d5779ee', id, 'Purchased HDMI Cable.', 0.00, 1800.00 FROM accounts WHERE account_code = '10100';

-- Entry: 15
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('058b9f91-1d2c-470a-8ce0-61ec291522e5', 'JE-000015', '2025-01-01', 'Paid for lunch expense of staff', 'JV-15', 'journal_entry', 410.00, 410.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6f30bb4f-555a-4d35-96fc-81cd7e84394c', '058b9f91-1d2c-470a-8ce0-61ec291522e5', id, 'Paid for lunch expense of staff', 100.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c5de13b6-fe40-4467-8e42-76a1c55d312d', '058b9f91-1d2c-470a-8ce0-61ec291522e5', id, 'for liquid gas.', 230.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '369ad065-30a0-443f-8d9e-6e5da9fa48a7', '058b9f91-1d2c-470a-8ce0-61ec291522e5', id, 'Purchased toilet paper.', 30.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c290d538-8401-4c5e-8223-aae069797b86', '058b9f91-1d2c-470a-8ce0-61ec291522e5', id, 'Paid for drinking water.', 50.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '429df26c-e799-432d-9a56-3212b88f8fda', '058b9f91-1d2c-470a-8ce0-61ec291522e5', id, 'Paid for drinking water.', 0.00, 410.00 FROM accounts WHERE account_code = '10100';

-- Entry: 16
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('824ced67-d36a-4ba4-8d54-73e745515a8f', 'JE-000016', '2025-01-01', 'Paid for breads for lunch.', 'JV-16', 'journal_entry', 1300.00, 1300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e0299968-51ed-4035-aa21-f61e6900fc8f', '824ced67-d36a-4ba4-8d54-73e745515a8f', id, 'Paid for breads for lunch.', 100.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dc2a2395-b37e-4465-9bc8-3e65ffee3962', '824ced67-d36a-4ba4-8d54-73e745515a8f', id, 'Paid for fuel for the power generator.', 400.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6b8c43ac-723e-4d3c-9765-134ad5e782df', '824ced67-d36a-4ba4-8d54-73e745515a8f', id, 'Paid for one tanker water for the house', 800.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1c8444e2-888f-4d75-8b1a-972246a96924', '824ced67-d36a-4ba4-8d54-73e745515a8f', id, 'Paid for breads, fuel, and water.', 0.00, 1300.00 FROM accounts WHERE account_code = '10100';

-- Entry: 17
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6d6fe94c-5955-4b29-9b73-7cfe2ca336dc', 'JE-000017', '2025-01-01', 'Paid for the liquid gas.', 'JV-17', 'journal_entry', 1780.00, 1780.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c87e74cd-8629-43e0-bd94-bd759156617d', '6d6fe94c-5955-4b29-9b73-7cfe2ca336dc', id, 'Paid for the liquid gas.', 800.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4a660acb-6883-4fbe-b751-26a3429456c5', '6d6fe94c-5955-4b29-9b73-7cfe2ca336dc', id, 'Paid for breads for lunch.', 430.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4467ccc0-2d95-4ea3-8dc5-24ff5bdddec3', '6d6fe94c-5955-4b29-9b73-7cfe2ca336dc', id, 'Paid for drinking water.', 50.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fa4e6f11-513d-4833-947d-deaff1ad7fb9', '6d6fe94c-5955-4b29-9b73-7cfe2ca336dc', id, 'Paid for the power generator fuel.', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '04192c11-8349-435e-919a-7a64fb6c80df', '6d6fe94c-5955-4b29-9b73-7cfe2ca336dc', id, 'Paid for gas, breads, drinking water, and fuel.', 0.00, 1780.00 FROM accounts WHERE account_code = '10100';

-- Entry: 18
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0ad85aa3-e1ea-4a15-9b70-e53d4033e70e', 'JE-000018', '2025-01-01', 'Purchased ink for the Epson inkjet printer 003', 'JV-18', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e8d0741f-383c-4d20-a27a-d040a21d52e2', '0ad85aa3-e1ea-4a15-9b70-e53d4033e70e', id, 'Purchased ink for the Epson inkjet printer 003', 450.00, 0.00 FROM accounts WHERE account_code = '60502';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0d0f57dc-ed3c-48bf-9364-cd9b11ba5ea7', '0ad85aa3-e1ea-4a15-9b70-e53d4033e70e', id, 'Taxi used to purchase printer ink.', 50.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cd0f5095-88b7-4620-b456-e03339909f26', '0ad85aa3-e1ea-4a15-9b70-e53d4033e70e', id, 'Purchased ink for printer and taxi charges.', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 19
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b38dc9a0-5a21-4d9f-889d-9e284ed580b2', 'JE-000019', '2025-01-01', 'Paid for breads for lunch.', 'JV-19', 'journal_entry', 130.00, 130.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '737581a0-f089-4ae1-a0b0-856c0f490bc0', 'b38dc9a0-5a21-4d9f-889d-9e284ed580b2', id, 'Paid for breads for lunch.', 50.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '48cbfa39-1f1c-4e8c-8eee-7a9d06a5f47c', 'b38dc9a0-5a21-4d9f-889d-9e284ed580b2', id, 'Purchased tissue papers.', 80.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c3593e90-9e23-4914-b6a0-3b7985726485', 'b38dc9a0-5a21-4d9f-889d-9e284ed580b2', id, 'Purchased tissue papers and lunch expense', 0.00, 130.00 FROM accounts WHERE account_code = '10100';

-- Entry: 20
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a96ff3bd-a58e-411d-8ad0-46d45b9c1928', 'JE-000020', '2025-01-01', 'Purchased fuel for the power generator.', 'JV-20', 'journal_entry', 960.00, 960.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '491dcbbd-22d7-45b7-aac2-77fd8668ce22', 'a96ff3bd-a58e-411d-8ad0-46d45b9c1928', id, 'Purchased fuel for the power generator.', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2b801be1-46c8-4926-ad9b-28eef89b39ae', 'a96ff3bd-a58e-411d-8ad0-46d45b9c1928', id, 'Purchased breads for lunch.', 120.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '555ffa2b-80f2-4334-babd-ea63e1820b4c', 'a96ff3bd-a58e-411d-8ad0-46d45b9c1928', id, 'Paid for liquid gas.', 340.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '05b28b16-5b84-4e7e-9758-c5521b45f1f0', 'a96ff3bd-a58e-411d-8ad0-46d45b9c1928', id, 'Paid for fuel, breads, liquid gas.', 0.00, 960.00 FROM accounts WHERE account_code = '10100';

-- Entry: 21
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('47ffed31-33ce-478d-b0d6-50f33581ec75', 'JE-000021', '2025-01-01', 'Paid for the power generator fuel.', 'JV-21', 'journal_entry', 980.00, 980.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a39cc132-b460-497c-8645-0aa14a656d8c', '47ffed31-33ce-478d-b0d6-50f33581ec75', id, 'Paid for the power generator fuel.', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a5029c00-4c05-475e-9d74-10acf8f8b615', '47ffed31-33ce-478d-b0d6-50f33581ec75', id, 'Purchased breads.', 100.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bc00c4a7-b74c-49f9-90df-316b98120130', '47ffed31-33ce-478d-b0d6-50f33581ec75', id, 'Paid for the liquid gas.', 330.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6e634ab3-1d4d-4026-a830-c80614747b15', '47ffed31-33ce-478d-b0d6-50f33581ec75', id, 'Paid for drinking water.', 50.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '449c9913-6b30-4102-a598-e4c9d7ca55d8', '47ffed31-33ce-478d-b0d6-50f33581ec75', id, 'Paid for breads, fuel, liquid gas, and drinking water.', 0.00, 980.00 FROM accounts WHERE account_code = '10100';

-- Entry: 22
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('69a56874-3b68-467f-be15-4291b9c77665', 'JE-000022', '2025-01-01', 'Printed Business cards, ID Cards, Flags, and Stand Banners.', 'JV-22', 'journal_entry', 26270.00, 26270.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a4df6218-bc42-4cbf-8e9c-9a0a2c811837', '69a56874-3b68-467f-be15-4291b9c77665', id, 'Printed Business cards, ID Cards, Flags, and Stand Banners.', 26270.00, 0.00 FROM accounts WHERE account_code = '61602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0158c7e2-5786-45a4-a3e4-274377c5ebaf', '69a56874-3b68-467f-be15-4291b9c77665', id, 'Printed Business cards, ID Cards, Flags, and Stand Banners.', 0.00, 26270.00 FROM accounts WHERE account_code = '10100';

-- Entry: 23
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3a93b2cc-59cd-49bd-a90d-9f80dbcbc522', 'JE-000023', '2025-01-01', 'Paid for staff lunch expenses', 'JV-23', 'journal_entry', 400.00, 400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b8061878-ab94-4e13-866a-4136271e1ab7', '3a93b2cc-59cd-49bd-a90d-9f80dbcbc522', id, 'Paid for staff lunch expenses', 50.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '94464ff1-0f12-46db-80a0-c3cb26c7a487', '3a93b2cc-59cd-49bd-a90d-9f80dbcbc522', id, 'Taxi charges use for the office work.', 350.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '268055df-4e44-4a22-87bc-4bf93cc6dacc', '3a93b2cc-59cd-49bd-a90d-9f80dbcbc522', id, 'Taxi charges use for the office work and breads for staff lunch', 0.00, 400.00 FROM accounts WHERE account_code = '10100';

-- Entry: 24
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a7742330-d0c9-4b82-904a-aba9e67672fc', 'JE-000024', '2025-01-01', 'Internet fee paid for the month of December 2024', 'JV-24', 'journal_entry', 14022.00, 14022.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '219b16e1-5ba3-431a-8320-f0aea130c020', 'a7742330-d0c9-4b82-904a-aba9e67672fc', id, 'Internet fee paid for the month of December 2024', 7011.00, 0.00 FROM accounts WHERE account_code = '61202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fed18912-be71-448e-ad95-f52a14e19e80', 'a7742330-d0c9-4b82-904a-aba9e67672fc', id, 'Purchased a Mikrotic Router', 7011.00, 0.00 FROM accounts WHERE account_code = '17101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd9d9e1a3-9a91-454c-ad01-0a9df5ad27d4', 'a7742330-d0c9-4b82-904a-aba9e67672fc', id, 'Paid for internet fee and purchased Mikrotic router', 0.00, 14022.00 FROM accounts WHERE account_code = '10100';

-- Entry: 25
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('961fdc5d-f883-4a37-a2e2-983839e001b6', 'JE-000025', '2025-01-01', 'Purchased 30 miter Iranian carpet for the office use, including fitting and transportation charges.', 'JV-25', 'journal_entry', 38800.00, 38800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1c379ed3-5f72-4d00-b69f-b0e7f0c1481a', '961fdc5d-f883-4a37-a2e2-983839e001b6', id, 'Purchased 30 miter Iranian carpet for the office use, including fitting and transportation charges.', 14300.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4087749a-5c5d-4810-a79b-395f80071b4c', '961fdc5d-f883-4a37-a2e2-983839e001b6', id, 'Purchased two sets sofa for the office use', 23700.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9e9628a0-d841-4036-b83c-e8a8e6cebd34', '961fdc5d-f883-4a37-a2e2-983839e001b6', id, 'Paid for staff lunch', 800.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1d5c6610-0b65-4942-8994-470438c10ff1', '961fdc5d-f883-4a37-a2e2-983839e001b6', id, 'Paid for sofa sets purchase and lunch expense.', 0.00, 38800.00 FROM accounts WHERE account_code = '10100';

-- Entry: 26
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('06ee9114-1b08-4d04-922f-be3cf82a6c26', 'JE-000026', '2025-01-01', 'Purchase of one set sofa for 7 person', 'JV-26', 'journal_entry', 126000.00, 126000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f1c60ad8-4678-4805-ad0d-9bcd7b1d926c', '06ee9114-1b08-4d04-922f-be3cf82a6c26', id, 'Purchase of one set sofa for 7 person', 8000.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2bbe292b-7d4b-40d9-8609-56c65e8c45b7', '06ee9114-1b08-4d04-922f-be3cf82a6c26', id, 'Big size office for the president''s office.', 25000.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b3ae26fa-e8f9-4678-9fb3-9d93662df7ac', '06ee9114-1b08-4d04-922f-be3cf82a6c26', id, 'Big size table for COO office.', 15000.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bf4f7f5d-380f-4e9d-8de7-481bb577063b', '06ee9114-1b08-4d04-922f-be3cf82a6c26', id, 'Office chair for COO Office', 2500.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7acb3010-9f88-41b4-bc42-f6c79bba05c4', '06ee9114-1b08-4d04-922f-be3cf82a6c26', id, 'Rug for COO office', 7000.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e2ca52d6-c9ca-43f4-92de-0ea6229606c1', '06ee9114-1b08-4d04-922f-be3cf82a6c26', id, 'Rug for Administration dept.', 5000.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f7de29c1-340e-450f-bdd2-90ac16309bb6', '06ee9114-1b08-4d04-922f-be3cf82a6c26', id, 'Frege for President''s office.', 3000.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9cddfb20-673e-4914-a9c3-3da98e9bef7e', '06ee9114-1b08-4d04-922f-be3cf82a6c26', id, 'Rug for presidents office', 10000.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '13dfbcd6-d4ba-48f2-8c2f-c9ed853bac6b', '06ee9114-1b08-4d04-922f-be3cf82a6c26', id, 'Sony TV for COO office .', 6000.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c287e24e-bb9f-4ad8-be85-35fbdb360b3c', '06ee9114-1b08-4d04-922f-be3cf82a6c26', id, 'Dell monitor for COO office', 2000.00, 0.00 FROM accounts WHERE account_code = '17101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '526ef07f-fda9-4e96-a69a-0b6a31d3c67a', '06ee9114-1b08-4d04-922f-be3cf82a6c26', id, 'Epson printer for COO Office.', 8000.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8268778a-7d7a-48ea-9622-53a3a1e96f51', '06ee9114-1b08-4d04-922f-be3cf82a6c26', id, 'Big size electric heather', 5000.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2fec448b-0b26-4b68-8656-b3fadc8f151d', '06ee9114-1b08-4d04-922f-be3cf82a6c26', id, 'Purchase of 3 gas silanders', 3000.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '713554b1-0e91-439b-bbb9-aa0dd94e9a51', '06ee9114-1b08-4d04-922f-be3cf82a6c26', id, 'Purchase of 4 Ukrainia heather with Silander', 8000.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b45aa6cd-a5a2-4552-b373-94abc3ca3737', '06ee9114-1b08-4d04-922f-be3cf82a6c26', id, 'Purchase of Power Generator', 13000.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c205bdb7-185d-49dc-b9b5-bb3f0d6e1360', '06ee9114-1b08-4d04-922f-be3cf82a6c26', id, 'Purchase of Dish Antena with receiver', 4000.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7f54c817-72f6-46de-9e5c-d1d7b80c2d4a', '06ee9114-1b08-4d04-922f-be3cf82a6c26', id, 'Purchase of Table small size', 1500.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '83bdd9a7-8030-42e1-b1df-01eb152bd35b', '06ee9114-1b08-4d04-922f-be3cf82a6c26', id, 'Purchased different office equipment second had', 0.00, 126000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 27
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cebfb564-50e7-41dd-8922-17f1a17006a8', 'JE-000027', '2025-01-02', 'Purchased 3 KG liquid gas for the office use.', 'JV-27', 'journal_entry', 760.00, 760.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '53332f4c-8521-4a97-bbf9-0898b4a96123', 'cebfb564-50e7-41dd-8922-17f1a17006a8', id, 'Purchased 3 KG liquid gas for the office use.', 160.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'af1a7478-6948-405e-b450-f12ce6836f92', 'cebfb564-50e7-41dd-8922-17f1a17006a8', id, 'Purchase of fuel for the power generator', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '375c94ff-8e5a-4210-a8f9-4bf609cc3a4c', 'cebfb564-50e7-41dd-8922-17f1a17006a8', id, 'Taxi used for the office work', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '971d7943-e394-4f6b-9c97-5acad9a77c03', 'cebfb564-50e7-41dd-8922-17f1a17006a8', id, 'Purchased 3 KG liquid gas, fuel and taxi charges.', 0.00, 760.00 FROM accounts WHERE account_code = '10100';

-- Entry: 28
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('14a9690d-6b08-4f55-938a-f654c512ac7a', 'JE-000028', '2025-01-04', 'Purchased breads for the office use.', 'JV-28', 'journal_entry', 1680.00, 1680.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '95bba802-f15b-4772-b7a2-c5fe7b6737de', '14a9690d-6b08-4f55-938a-f654c512ac7a', id, 'Purchased breads for the office use.', 110.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e210b89d-da35-47b7-91b2-6d2c8ca9c474', '14a9690d-6b08-4f55-938a-f654c512ac7a', id, 'Paid for 10 KG liquid gas', 570.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4df87d1e-7604-4bf2-be77-faf7690eae95', '14a9690d-6b08-4f55-938a-f654c512ac7a', id, 'Paid for fuel for the car.', 1000.00, 0.00 FROM accounts WHERE account_code = '60901';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '274ca3fb-4985-4171-87a2-bfe83d31b1a2', '14a9690d-6b08-4f55-938a-f654c512ac7a', id, 'Paid for Breads, Liquid gas, and car fuel.', 0.00, 1680.00 FROM accounts WHERE account_code = '10100';

-- Entry: 29
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c9b4afd9-684a-4124-8593-e14104129720', 'JE-000029', '2025-01-04', 'Purchased wall power extension, material for driller.', 'JV-29', 'journal_entry', 320.00, 320.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ee40c2bd-1db9-45fe-b8b6-718203dcf262', 'c9b4afd9-684a-4124-8593-e14104129720', id, 'Purchased wall power extension, material for driller.', 220.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c527a3c1-262c-4d26-befb-8acf1462d138', 'c9b4afd9-684a-4124-8593-e14104129720', id, 'Purchased papers.', 100.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'adbdaf14-8bfb-4daf-9262-90f372888876', 'c9b4afd9-684a-4124-8593-e14104129720', id, 'Paid for purchase of power extensions, material for driller and stationery.', 0.00, 320.00 FROM accounts WHERE account_code = '10100';

-- Entry: 30
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b7350e9a-944c-4c38-9024-575b259912a6', 'JE-000030', '2025-01-05', '4 KG Liquid Gas purchased.', 'JV-30', 'journal_entry', 1270.00, 1270.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ed32649a-6a4a-4b1b-a74e-bc10487bede5', 'b7350e9a-944c-4c38-9024-575b259912a6', id, '4 KG Liquid Gas purchased.', 230.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4c7380ae-8326-42f1-93f0-7ff56676743f', 'b7350e9a-944c-4c38-9024-575b259912a6', id, 'Paid for staff lunch expenses.', 540.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7a63fabc-2ba6-45ad-a2bd-f9692cf26128', 'b7350e9a-944c-4c38-9024-575b259912a6', id, 'Paid for the power generator fuel.', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4321f4dd-023b-473a-aa9f-da3f97497f38', 'b7350e9a-944c-4c38-9024-575b259912a6', id, 'Paid for liquid, gas, and fue.', 0.00, 1270.00 FROM accounts WHERE account_code = '10100';

-- Entry: 31
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0bf948f5-79dd-4e1d-9098-163bf6c97b0b', 'JE-000031', '2025-01-06', 'Purchased curtain, fence, curtain rod, and taxi charges for HQ office windows.', 'JV-31', 'journal_entry', 50342.00, 50342.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c8cf4e1e-c810-486d-a9f2-070ff233c9d9', '0bf948f5-79dd-4e1d-9098-163bf6c97b0b', id, 'Purchased curtain, fence, curtain rod, and taxi charges for HQ office windows.', 50342.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1d7d360a-9681-4a92-93f1-827a8008daf8', '0bf948f5-79dd-4e1d-9098-163bf6c97b0b', id, 'Purchased curtain, fence, curtain rod, and taxi charges for HQ office windows.', 0.00, 50342.00 FROM accounts WHERE account_code = '10100';

-- Entry: 32
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c9b79baa-2008-4dd3-a7a1-c6dfb5959f0f', 'JE-000032', '2025-01-06', 'Purchased guard room, including transport, crane', 'JV-32', 'journal_entry', 88390.00, 88390.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f3f1c3cb-88c9-4ac8-a7d9-b9fb928a9dbb', 'c9b79baa-2008-4dd3-a7a1-c6dfb5959f0f', id, 'Purchased guard room, including transport, crane', 88390.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '828db19a-af76-45df-8ca8-625b8cfa6578', 'c9b79baa-2008-4dd3-a7a1-c6dfb5959f0f', id, 'Purchased guard room, including transport, crane', 0.00, 88390.00 FROM accounts WHERE account_code = '10100';

-- Entry: 33
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6133e4d0-282e-40ca-b712-3ed7548506e4', 'JE-000033', '2025-01-06', 'Purchased stationery for the month.', 'JV-33', 'journal_entry', 3070.00, 3070.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0681efb9-af59-45fa-8644-8c5d66f3a2c3', '6133e4d0-282e-40ca-b712-3ed7548506e4', id, 'Purchased stationery for the month.', 3070.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f0de5067-b803-4e60-981f-62e35c2f9b34', '6133e4d0-282e-40ca-b712-3ed7548506e4', id, 'Purchased stationery for the month.', 0.00, 3070.00 FROM accounts WHERE account_code = '10100';

-- Entry: 34
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('02d55b18-0842-4bde-b8c3-fb970727e641', 'JE-000034', '2025-01-06', 'Purchased gas for the office use.', 'JV-34', 'journal_entry', 2590.00, 2590.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '71feb191-afa1-451b-a2f0-c998fd500aa9', '02d55b18-0842-4bde-b8c3-fb970727e641', id, 'Purchased gas for the office use.', 1020.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '01e9e4e5-a44f-487a-8fe2-3c27179e8dc3', '02d55b18-0842-4bde-b8c3-fb970727e641', id, 'Paid for breads and vegetables.', 550.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7597c46a-3bff-403c-a832-e360516bd76b', '02d55b18-0842-4bde-b8c3-fb970727e641', id, 'Paid for drinking water.', 50.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd36b5f21-d2ff-46fe-a3e7-e7d57752bce2', '02d55b18-0842-4bde-b8c3-fb970727e641', id, 'Paid for purchase of one tanker water.', 800.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '694a01bb-e44d-4722-81dc-ae90fe032e7c', '02d55b18-0842-4bde-b8c3-fb970727e641', id, 'Taxi used by Musafer.', 170.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a21507ad-3536-4b23-91cd-8109167a8057', '02d55b18-0842-4bde-b8c3-fb970727e641', id, 'Purchased gas, breads, vegetables, water, and used taxi.', 0.00, 2590.00 FROM accounts WHERE account_code = '10100';

-- Entry: 35
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('071f9242-e657-40b6-9ba2-9b08aa03cb3c', 'JE-000035', '2025-01-06', 'Purchased B-Light 519gr High Quality s:116x250cm for the office yard.', 'JV-35', 'journal_entry', 920.00, 920.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '01fa81fc-91e3-46fb-b510-9c2aee90fc52', '071f9242-e657-40b6-9ba2-9b08aa03cb3c', id, 'Purchased B-Light 519gr High Quality s:116x250cm for the office yard.', 920.00, 0.00 FROM accounts WHERE account_code = '61602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'afd6ecf7-e65d-4e0a-99ce-913d21f3c0cb', '071f9242-e657-40b6-9ba2-9b08aa03cb3c', id, 'Purchased B-Light 519gr High Quality s:116x250cm for the office yard.', 0.00, 920.00 FROM accounts WHERE account_code = '10100';

-- Entry: 36
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('995b3dd9-6292-4f87-854a-43e5acdd1ab0', 'JE-000036', '2025-01-06', 'Purchased big gas heather for the office use.', 'JV-36', 'journal_entry', 12450.00, 12450.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6960ad8d-fbd2-4aa7-a8de-8b28a155dc47', '995b3dd9-6292-4f87-854a-43e5acdd1ab0', id, 'Purchased big gas heather for the office use.', 12000.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9df25f4a-2d6f-4f59-bd6c-7c48bfbccd4e', '995b3dd9-6292-4f87-854a-43e5acdd1ab0', id, 'Purchased electric heather for the office use.', 450.00, 0.00 FROM accounts WHERE account_code = '60505';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7f42ff84-3578-4a36-871f-c54e0bf5376a', '995b3dd9-6292-4f87-854a-43e5acdd1ab0', id, 'Purchased big gas and electric heather for the office use.', 0.00, 12450.00 FROM accounts WHERE account_code = '10100';

-- Entry: 37
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ddf10329-5fe8-430c-8c53-bb9251d8299d', 'JE-000037', '2025-01-09', 'Purchased fuel for the power generator', 'JV-37', 'journal_entry', 2190.00, 2190.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6f4df2fd-6e5d-4aa1-8e16-59f58322e687', 'ddf10329-5fe8-430c-8c53-bb9251d8299d', id, 'Purchased fuel for the power generator', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '26a6d167-7733-47b8-8e8a-362bad172a13', 'ddf10329-5fe8-430c-8c53-bb9251d8299d', id, 'Purchased Ink, Brush, and oil for the office painting.', 190.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '28988967-cb26-49fc-a739-78c0ad53345b', 'ddf10329-5fe8-430c-8c53-bb9251d8299d', id, 'Paid for purchase of breads for the office staff', 100.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '74ef6919-54f9-492a-b316-5cad46439005', 'ddf10329-5fe8-430c-8c53-bb9251d8299d', id, 'Purcahsed stationery for the office use.', 320.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '43aa5880-de4c-4169-b2cd-49117b1c1fdc', 'ddf10329-5fe8-430c-8c53-bb9251d8299d', id, 'Purchased cleaning items for the office use', 460.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c51d433e-298c-4b52-973b-3cda3cd1212e', 'ddf10329-5fe8-430c-8c53-bb9251d8299d', id, 'Purchased flowers, and sandals for the offices', 620.00, 0.00 FROM accounts WHERE account_code = '60505';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6abf0d8c-b870-49d3-9410-9d8b8880244e', 'ddf10329-5fe8-430c-8c53-bb9251d8299d', id, 'Purchased, Fuel, painting items, breads, stationery, and cleaning items.', 0.00, 2190.00 FROM accounts WHERE account_code = '10100';

-- Entry: 38
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('54df2394-0b3b-4297-b309-ae1eb53abdc2', 'JE-000038', '2025-01-10', 'Purchased breads and food for staff lunch.', 'JV-38', 'journal_entry', 12910.00, 12910.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'deec59de-b846-4b81-8e8a-f1a14f56a6e0', '54df2394-0b3b-4297-b309-ae1eb53abdc2', id, 'Purchased breads and food for staff lunch.', 1050.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '42a8ca72-5551-4fcc-a816-0bc1a167a153', '54df2394-0b3b-4297-b309-ae1eb53abdc2', id, 'Cleaning supply', 30.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '92571392-ce8f-4e25-87c2-a517e8de5dc5', '54df2394-0b3b-4297-b309-ae1eb53abdc2', id, 'Liquid gas', 400.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5f2b4638-20af-4daf-9726-977db26226ba', '54df2394-0b3b-4297-b309-ae1eb53abdc2', id, 'Purchased office table and chair', 3740.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '58bad744-1c0a-4c15-b239-7b3b2bed1ac2', '54df2394-0b3b-4297-b309-ae1eb53abdc2', id, 'Purchased stationery for the office use.', 500.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2b0c771c-39cf-4627-9b80-72b7446c4210', '54df2394-0b3b-4297-b309-ae1eb53abdc2', id, 'Purchased uniforms for the security guards.', 4340.00, 0.00 FROM accounts WHERE account_code = '60403';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fac14c50-8635-4b5d-9539-9bc577c577b8', '54df2394-0b3b-4297-b309-ae1eb53abdc2', id, 'Paid bounes to staff by Shahpoor.', 1000.00, 0.00 FROM accounts WHERE account_code = '60404';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '624caa62-70b0-45fb-8217-f02c07d09dd5', '54df2394-0b3b-4297-b309-ae1eb53abdc2', id, 'Purchased drinking water.', 50.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6d0b02b6-d5d5-434e-b2cb-3deb63c2c23d', '54df2394-0b3b-4297-b309-ae1eb53abdc2', id, 'Make Iron frame for the sign board in the office yard.', 1800.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e99794a-24cf-4e1f-b107-22b31e78b533', '54df2394-0b3b-4297-b309-ae1eb53abdc2', id, 'Purchased food, stationery, uniforms, paid bounes, and purchased drinking water.', 0.00, 12910.00 FROM accounts WHERE account_code = '10100';

-- Entry: 39
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('579ecd4c-1299-4cbc-87bf-6d1a3af6ccf7', 'JE-000039', '2025-01-11', 'Purchased one office table and chair', 'JV-39', 'journal_entry', 5650.00, 5650.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'af2ff876-4efe-4df1-93a4-400e42345743', '579ecd4c-1299-4cbc-87bf-6d1a3af6ccf7', id, 'Purchased one office table and chair', 4200.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dc935369-0557-4f30-8718-1effa76995c3', '579ecd4c-1299-4cbc-87bf-6d1a3af6ccf7', id, 'Paid for taxi charges used for the office work.', 60.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8ce62cf6-9b3b-4860-a9e1-0adba2026f0a', '579ecd4c-1299-4cbc-87bf-6d1a3af6ccf7', id, 'Paid for the liquid gas used for the office', 320.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5a7033ae-5852-4b25-9e89-5c37a56e7369', '579ecd4c-1299-4cbc-87bf-6d1a3af6ccf7', id, 'Purchased tissue paper', 30.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9daae7a4-f28f-4e7b-98bc-41a6e3841903', '579ecd4c-1299-4cbc-87bf-6d1a3af6ccf7', id, 'Paid for Unti Ice Cover and wages for fitting.', 940.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '230f80b3-cb84-42ac-bd15-f8f7d95c30f2', '579ecd4c-1299-4cbc-87bf-6d1a3af6ccf7', id, 'Paid for purchase of breads.', 100.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f2b0a48c-a37f-4b71-b84d-d300b892165f', '579ecd4c-1299-4cbc-87bf-6d1a3af6ccf7', id, 'Purchased office table and chair, taxi, gas, tissue paper, breads, and Unti Ice cover.', 0.00, 5650.00 FROM accounts WHERE account_code = '10100';

-- Entry: 40
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('95bee9ff-1a9a-41f8-9781-d90fee74ec85', 'JE-000040', '2025-01-13', 'Purchased bulbs for the office use.', 'JV-40', 'journal_entry', 2500.00, 2500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a746f1c9-a1bf-45ff-91f5-0c597d59fe00', '95bee9ff-1a9a-41f8-9781-d90fee74ec85', id, 'Purchased bulbs for the office use.', 1200.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1680dead-b8ee-4b8f-927e-e250387a3cd5', '95bee9ff-1a9a-41f8-9781-d90fee74ec85', id, 'Purchased wired and wireless mouses for the office use.', 300.00, 0.00 FROM accounts WHERE account_code = '61207';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '16c18eff-43a3-4bcf-bfb3-feea2c342fea', '95bee9ff-1a9a-41f8-9781-d90fee74ec85', id, 'Paid for fuel for the power generator.', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5c2b1141-e823-401d-8245-dddf5a62aea5', '95bee9ff-1a9a-41f8-9781-d90fee74ec85', id, 'Purchased breads for lunch.', 140.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7cc58444-2ea0-4202-bc52-a8c136cf8906', '95bee9ff-1a9a-41f8-9781-d90fee74ec85', id, 'Purchased gas for the office use.', 360.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c0367247-1e5f-439a-803e-035c0e513aaf', '95bee9ff-1a9a-41f8-9781-d90fee74ec85', id, 'Purchased bulbs, wired and wireless mouses, fuel, breads, and gas.', 0.00, 2500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 41
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('205242d5-54b2-4084-b42d-a6b082125a27', 'JE-000041', '2025-01-13', 'Internet fee paid for the month of Jan 2025', 'JV-41', 'journal_entry', 7211.00, 7211.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '01e659ce-1809-47b0-ad1c-e0ac31860693', '205242d5-54b2-4084-b42d-a6b082125a27', id, 'Internet fee paid for the month of Jan 2025', 7211.00, 0.00 FROM accounts WHERE account_code = '61202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9605c175-4974-46f7-a78c-66af6d6c959c', '205242d5-54b2-4084-b42d-a6b082125a27', id, 'Internet fee paid for the month of Jan 2025', 0.00, 7211.00 FROM accounts WHERE account_code = '10100';

-- Entry: 42
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e76978e5-f71a-4f93-a0db-f60250804318', 'JE-000042', '2025-01-14', 'Purchased liquid gas.', 'JV-42', 'journal_entry', 1180.00, 1180.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '50202665-09fc-47e2-aa8b-03e138686510', 'e76978e5-f71a-4f93-a0db-f60250804318', id, 'Purchased liquid gas.', 960.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd746b884-616d-4159-8775-390ffaaafdb1', 'e76978e5-f71a-4f93-a0db-f60250804318', id, 'Purchased breads for lunch.', 110.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e57650ad-3e24-4cdd-892c-d92d59d77385', 'e76978e5-f71a-4f93-a0db-f60250804318', id, 'Paid for drinking water.', 50.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '923ee8c7-5e3a-4920-a9fa-79fd61723cd7', 'e76978e5-f71a-4f93-a0db-f60250804318', id, 'Purchased small batteries.', 60.00, 0.00 FROM accounts WHERE account_code = '60505';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1b8003a0-f719-416a-ac35-7a158bf1337e', 'e76978e5-f71a-4f93-a0db-f60250804318', id, 'Purchased Gas, Breads, Drinking Water, and Small batteries.', 0.00, 1180.00 FROM accounts WHERE account_code = '10100';

-- Entry: 43
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('faa751f9-441e-4a4e-a92b-e98405cb5ffe', 'JE-000043', '2025-01-15', 'Purchased liquid gas.', 'JV-43', 'journal_entry', 9593.00, 9593.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e9c01e4e-3ce0-4cc1-a76a-f614310c57d1', 'faa751f9-441e-4a4e-a92b-e98405cb5ffe', id, 'Purchased liquid gas.', 300.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'acdcf6dd-8ded-42a0-a02c-db928feb78eb', 'faa751f9-441e-4a4e-a92b-e98405cb5ffe', id, 'Purchased breads.', 100.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e6a5766-e0e7-4df2-b763-de9cb1b0fcca', 'faa751f9-441e-4a4e-a92b-e98405cb5ffe', id, 'Paid for purchase of liquid gas, and breads for lunch.', 0.00, 400.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8dab9d57-94f5-44ed-be1a-f355f489be61', 'faa751f9-441e-4a4e-a92b-e98405cb5ffe', id, 'Purchased attendance machine for the office use', 9193.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cdbf5785-03ac-4e6b-82b5-4fee4d64c78c', 'faa751f9-441e-4a4e-a92b-e98405cb5ffe', id, 'Purchased attendance machine for the office use', 0.00, 9193.00 FROM accounts WHERE account_code = '10100';

-- Entry: 44
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4c3063c4-2731-4170-97d2-72d36f7b9f24', 'JE-000044', '2025-01-16', 'Purchased liquid gas.', 'JV-44', 'journal_entry', 1090.00, 1090.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '081109f7-c987-495d-8c63-0bd599412392', '4c3063c4-2731-4170-97d2-72d36f7b9f24', id, 'Purchased liquid gas.', 360.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8a5deef3-b3ba-40c5-830c-01cc08401ee3', '4c3063c4-2731-4170-97d2-72d36f7b9f24', id, 'Paid for lunch expenses of the day.', 680.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5507e05d-e98e-4ee8-a271-9b48115275a6', '4c3063c4-2731-4170-97d2-72d36f7b9f24', id, 'Paid for drinking water.', 50.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bce5179a-e2e3-4801-8925-6cf4750e2371', '4c3063c4-2731-4170-97d2-72d36f7b9f24', id, 'Paid for drinking water, gas and lunch expense', 0.00, 1090.00 FROM accounts WHERE account_code = '10100';

-- Entry: 45
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f5419e55-c04f-47c1-a6d9-d716fc79a19b', 'JE-000045', '2025-01-18', 'Purchased one tanker water for office use.', 'JV-45', 'journal_entry', 2080.00, 2080.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7c4419ce-eb83-4cc9-b491-345cf319bacd', 'f5419e55-c04f-47c1-a6d9-d716fc79a19b', id, 'Purchased one tanker water for office use.', 800.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dd14f668-02ec-4bdd-b587-31a270e59842', 'f5419e55-c04f-47c1-a6d9-d716fc79a19b', id, 'Paid for the staff lunch expenses.', 380.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a5402e27-261a-47ed-912b-4d6be40526be', 'f5419e55-c04f-47c1-a6d9-d716fc79a19b', id, 'Paid for the liquid gas.', 900.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c545dc77-fda9-4efb-9b82-1622984120d2', 'f5419e55-c04f-47c1-a6d9-d716fc79a19b', id, 'Paid for water, lunch, and liquid gas.', 0.00, 2080.00 FROM accounts WHERE account_code = '10100';

-- Entry: 46
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9c2fe407-1a7d-4088-8082-c304fa51ba45', 'JE-000046', '2025-01-20', 'Paid for power generator fuel.', 'JV-46', 'journal_entry', 4250.00, 4250.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '634fc9aa-7b84-4b42-b52d-e6ceca71fad5', '9c2fe407-1a7d-4088-8082-c304fa51ba45', id, 'Paid for power generator fuel.', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a08576a0-61f7-4561-9f4a-76d02512ab63', '9c2fe407-1a7d-4088-8082-c304fa51ba45', id, 'Purchased tissue paper, disposible plastic bags, cloves.', 670.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9a9dd15a-8a84-4c67-a881-8de464c0876b', '9c2fe407-1a7d-4088-8082-c304fa51ba45', id, 'Purchased tea, chocolate, and Sugar for staff refreshments.', 1000.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cae78c84-d54e-470d-8876-2335761fc826', '9c2fe407-1a7d-4088-8082-c304fa51ba45', id, 'Purchased papers.', 100.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c58c4d2f-0e66-4049-a03f-10436b859172', '9c2fe407-1a7d-4088-8082-c304fa51ba45', id, 'Purchased two buckets for the office use.', 1000.00, 0.00 FROM accounts WHERE account_code = '60505';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c3357f4-1abb-4f85-b21c-9c9a29d525d9', '9c2fe407-1a7d-4088-8082-c304fa51ba45', id, 'Purchased plates, sugar cans, glasses, and spoons. for the kitchen.', 980.00, 0.00 FROM accounts WHERE account_code = '60503';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7d58828d-0e4b-427b-b62a-62ff54cb049f', '9c2fe407-1a7d-4088-8082-c304fa51ba45', id, 'Purchased fuel, cleaning items, refreshments, stationery, buckets and kitchen items.', 0.00, 4250.00 FROM accounts WHERE account_code = '10100';

-- Entry: 47
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3386490b-47bc-4523-b264-7a198e53d929', 'JE-000047', '2025-01-20', 'Purchased office tables and chairs for the office use.', 'JV-47', 'journal_entry', 40500.00, 40500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c0475dd2-f2d1-44d0-a804-2a80536cdd61', '3386490b-47bc-4523-b264-7a198e53d929', id, 'Purchased office tables and chairs for the office use.', 40500.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '80795ebb-dfca-4bcf-97ec-a5f34e7009df', '3386490b-47bc-4523-b264-7a198e53d929', id, 'Purchased office tables and chairs for the office use.', 0.00, 40500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 48
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a7b546ad-de62-4767-8d63-8e23382927e1', 'JE-000048', '2025-01-20', 'Purchased fuel for the power generator.', 'JV-48', 'journal_entry', 34230.00, 34230.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8f84a60e-cccc-4fb1-8578-6f757fefda7f', 'a7b546ad-de62-4767-8d63-8e23382927e1', id, 'Purchased fuel for the power generator.', 520.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '823f1c5f-c29f-49cb-bd86-030c8dbb9f53', 'a7b546ad-de62-4767-8d63-8e23382927e1', id, 'Purchased liquid gas for the office use.', 360.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4911bf54-9c61-49a1-96d0-7c572ec9cfba', 'a7b546ad-de62-4767-8d63-8e23382927e1', id, 'Paid for the staff lunch expense.', 190.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ab810a1c-6519-416f-83aa-88275e3ab8fd', 'a7b546ad-de62-4767-8d63-8e23382927e1', id, 'Purchased pens for the staff.', 160.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c8027707-a85f-46a2-9f49-aa8ffb77522b', 'a7b546ad-de62-4767-8d63-8e23382927e1', id, 'Paid for fuel, gas, lunch expenses, and stationery.', 0.00, 1230.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3dced061-3352-4a13-bbec-867fc615ca79', 'a7b546ad-de62-4767-8d63-8e23382927e1', id, 'House Rent was prepaid for the month of Jadi 1403', 33000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ca939aec-7f87-47b5-9307-7c29fc55d230', 'a7b546ad-de62-4767-8d63-8e23382927e1', id, 'House Rent Tax withheld for the month of Jadi 1403', 0.00, 3000.00 FROM accounts WHERE account_code = '21200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5ef2c874-3b37-4711-81a4-ff896c8e00a8', 'a7b546ad-de62-4767-8d63-8e23382927e1', id, 'House Rent was prepaid for the month of Jadi 1403', 0.00, 30000.00 FROM accounts WHERE account_code = '13100';

-- Entry: 49
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('af36d595-df77-474a-8597-a162050d3130', 'JE-000049', '2025-01-22', 'Purchased liquid gas.', 'JV-49', 'journal_entry', 32455.00, 32455.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6990f797-7165-4bc2-a683-08bf17ffcc04', 'af36d595-df77-474a-8597-a162050d3130', id, 'Purchased liquid gas.', 500.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '15f42635-05a1-45f7-b627-85cb281b41ba', 'af36d595-df77-474a-8597-a162050d3130', id, 'Purchased food item for lunch.', 1250.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '224da39f-0ead-4366-9b56-9e2a5778c49d', 'af36d595-df77-474a-8597-a162050d3130', id, 'Taxi used for the office work.', 800.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5bee2b43-7dbe-4aff-b992-39ef2b1be881', 'af36d595-df77-474a-8597-a162050d3130', id, 'Paid rent for the CEO''s transportation.', 6000.00, 0.00 FROM accounts WHERE account_code = '60803';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '376550d4-923e-4ddc-9a66-78ab7a38e4b7', 'af36d595-df77-474a-8597-a162050d3130', id, 'Paid for purchase of small electiric materials for the office use.', 4650.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ed05ea67-4588-45ef-9152-0b644c32ca86', 'af36d595-df77-474a-8597-a162050d3130', id, 'Purchased electric materials for the office use.', 18255.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '729e0770-3f92-45a1-a625-b7c6448c132b', 'af36d595-df77-474a-8597-a162050d3130', id, 'Paid for office guest refreshments.', 1000.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6e956c44-8659-413d-9eb6-82c943825526', 'af36d595-df77-474a-8597-a162050d3130', id, 'Paid for gas, lunch, taxi, CEO transportation, electric materials, office painting and refreshme...', 0.00, 32455.00 FROM accounts WHERE account_code = '10100';

-- Entry: 50
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7de7d36f-71cf-4db4-9673-4a74410765df', 'JE-000050', '2025-01-22', 'Purchased 3 kg gas,', 'JV-50', 'journal_entry', 910.00, 910.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '632c28b3-549c-4353-b11c-1685b88313fd', '7de7d36f-71cf-4db4-9673-4a74410765df', id, 'Purchased 3 kg gas,', 180.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bc994625-dab9-448c-9625-077492d4d157', '7de7d36f-71cf-4db4-9673-4a74410765df', id, 'Paid for lunch expenses.', 230.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '46885b43-dfd2-405f-ad4a-7bd04b9dca9a', '7de7d36f-71cf-4db4-9673-4a74410765df', id, 'Paid for fuel for the power generator.', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6843d9d2-36a7-437a-8d50-e1fa3f32209d', '7de7d36f-71cf-4db4-9673-4a74410765df', id, 'Paid gas, lunch, and fuel.', 0.00, 910.00 FROM accounts WHERE account_code = '10100';

-- Entry: 51
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e364d5f8-5311-41d5-ae34-4e2b8390505b', 'JE-000051', '2025-01-25', 'Purchased 3 HP printers 141 A for the office use.', 'JV-51', 'journal_entry', 37850.00, 37850.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8b1eb352-5f77-4bed-8917-5b69cf402078', 'e364d5f8-5311-41d5-ae34-4e2b8390505b', id, 'Purchased 3 HP printers 141 A for the office use.', 33060.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e54638f4-78c1-4576-89ad-2fef8d38be66', 'e364d5f8-5311-41d5-ae34-4e2b8390505b', id, 'Purchased Dell charger.', 1000.00, 0.00 FROM accounts WHERE account_code = '80001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '52cda9af-bb84-4a83-b245-8dcba7aef7f7', 'e364d5f8-5311-41d5-ae34-4e2b8390505b', id, 'Purchased power extensions, bulbs, and other small electric materials.', 2890.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2e177ae2-a6d2-42c3-9330-7d0bae96103b', 'e364d5f8-5311-41d5-ae34-4e2b8390505b', id, 'Purchased power extensions, bulbs, and other small electric materials.', 400.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9240461b-8336-4961-97de-e1d6fd362e0c', 'e364d5f8-5311-41d5-ae34-4e2b8390505b', id, 'Purchased HDD for the office.', 500.00, 0.00 FROM accounts WHERE account_code = '80001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a694dc45-ac31-4e10-a85e-70d978e2484c', 'e364d5f8-5311-41d5-ae34-4e2b8390505b', id, 'Paid to purchase 3 HP printers, dell charger, electric materials, taxi and HDD.', 0.00, 37850.00 FROM accounts WHERE account_code = '10100';

-- Entry: 52
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('93d8f078-533f-4b9e-b156-381758aacb97', 'JE-000052', '2025-01-25', 'Purchased food item for lunch.', 'JV-52', 'journal_entry', 1690.00, 1690.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b9d1a5eb-ccee-430d-ba4c-207536903e04', '93d8f078-533f-4b9e-b156-381758aacb97', id, 'Purchased food item for lunch.', 210.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a53ac13f-19ec-4dd2-baf1-d9f74aa228fd', '93d8f078-533f-4b9e-b156-381758aacb97', id, 'Purchased drinking water.', 100.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2a444133-cc70-4157-8a12-5e79510da985', '93d8f078-533f-4b9e-b156-381758aacb97', id, 'Purchased liquid gas.', 860.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bf8e68d0-5ce6-408f-952e-f83c2aec581c', '93d8f078-533f-4b9e-b156-381758aacb97', id, 'Purchased small batteries.', 20.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3734c1a0-f566-416e-ab1f-8ba3dadcd841', '93d8f078-533f-4b9e-b156-381758aacb97', id, 'Purchased fuel for the power generator.', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '18fe1803-e00e-4de8-946f-9c8386d7a9bb', '93d8f078-533f-4b9e-b156-381758aacb97', id, 'Paid for lunch, water, gas, small batteries, and fuel.', 0.00, 1690.00 FROM accounts WHERE account_code = '10100';

-- Entry: 53
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8af2977a-fc79-4bbd-8572-dbf20fa343b5', 'JE-000053', '2025-01-26', 'Purchased liquid gas for the office use.', 'JV-53', 'journal_entry', 10513.00, 10513.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a6433d62-b7da-43fb-9c63-d05839b215d7', '8af2977a-fc79-4bbd-8572-dbf20fa343b5', id, 'Purchased liquid gas for the office use.', 500.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e8996d52-84fb-49ad-80ad-2688e18e3de1', '8af2977a-fc79-4bbd-8572-dbf20fa343b5', id, 'Paid for the staff lunch expenses.', 150.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f738f2d8-1259-4c55-b292-28d84282423a', '8af2977a-fc79-4bbd-8572-dbf20fa343b5', id, 'Paid for gas and lunch expenses.', 0.00, 650.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '032714f6-17e7-4381-aa10-7b80fdde2a5e', '8af2977a-fc79-4bbd-8572-dbf20fa343b5', id, 'Paid for Canva subscription', 9863.00, 0.00 FROM accounts WHERE account_code = '60405';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3ea9753f-e148-42fc-bda8-f923cddbe435', '8af2977a-fc79-4bbd-8572-dbf20fa343b5', id, 'Paid for Canva subscription', 0.00, 9863.00 FROM accounts WHERE account_code = '10100';

-- Entry: 54
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2a7dbd31-43a1-4e2d-b7a7-7c6f6a2ccc7c', 'JE-000054', '2025-01-27', 'Paid for food expense for the lunch.', 'JV-54', 'journal_entry', 750.00, 750.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '11896481-fc06-4b72-b6bf-b61405c58213', '2a7dbd31-43a1-4e2d-b7a7-7c6f6a2ccc7c', id, 'Paid for food expense for the lunch.', 250.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '04e1135f-46a4-42a9-b1e7-67ed26dbb1a3', '2a7dbd31-43a1-4e2d-b7a7-7c6f6a2ccc7c', id, 'Paid for the power generator fuel', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8b2c9fa4-68cc-4599-a4f1-7f54b7968a0a', '2a7dbd31-43a1-4e2d-b7a7-7c6f6a2ccc7c', id, 'Paid for staff lunch and fuel.', 0.00, 750.00 FROM accounts WHERE account_code = '10100';

-- Entry: 55
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cedbc366-b25c-446c-b2bf-019029678d61', 'JE-000055', '2025-01-27', 'Paid for office painting including ink, painting materials, and purchase of electric materials.', 'JV-55', 'journal_entry', 35460.00, 35460.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2a95b2d3-599d-4982-a278-e03dee090e33', 'cedbc366-b25c-446c-b2bf-019029678d61', id, 'Paid for office painting including ink, painting materials, and purchase of electric materials.', 35460.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6c36a571-979d-44b7-bafd-832ceb2aeee3', 'cedbc366-b25c-446c-b2bf-019029678d61', id, 'Paid for office painting including ink, painting materials, and purchase of electric materials.', 0.00, 35460.00 FROM accounts WHERE account_code = '10100';

-- Entry: 56
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e7f153cf-ce7b-4e99-8d32-239ec7fa00d8', 'JE-000056', '2025-01-28', 'Purchased DDMPD 11 in 1 connector for the CFO Laptop.', 'JV-56', 'journal_entry', 5060.00, 5060.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '80b66d19-7878-40e2-9754-c181d0c1d91b', 'e7f153cf-ce7b-4e99-8d32-239ec7fa00d8', id, 'Purchased DDMPD 11 in 1 connector for the CFO Laptop.', 1700.00, 0.00 FROM accounts WHERE account_code = '61207';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4400531f-9ec8-42e3-a0d8-6457a1bf621e', 'e7f153cf-ce7b-4e99-8d32-239ec7fa00d8', id, 'Purchased 1 box A4 paper, pilot pens, box files.', 2620.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3b00c6a7-980c-42bc-9d55-f65d91cdc3d3', 'e7f153cf-ce7b-4e99-8d32-239ec7fa00d8', id, 'Taxi used for purchase of materials.', 230.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3b83c0ad-7e32-4a75-bce1-f24e9a4f2432', 'e7f153cf-ce7b-4e99-8d32-239ec7fa00d8', id, 'Purchase wireless mouse for the office use', 360.00, 0.00 FROM accounts WHERE account_code = '61207';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '34ec9882-f465-4e42-9144-c94ea72e2093', 'e7f153cf-ce7b-4e99-8d32-239ec7fa00d8', id, 'Purchased Airfresher', 150.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '27e7ff2a-9ea6-4e8c-99b8-3e3ef9903888', 'e7f153cf-ce7b-4e99-8d32-239ec7fa00d8', id, 'Paid for purchase of 1 connector, stationery, taxi, and mouse.', 0.00, 5060.00 FROM accounts WHERE account_code = '10100';

-- Entry: 57
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6c8d9219-031c-4376-be4e-382fe451d77f', 'JE-000057', '2025-01-28', 'Purchased liquid gas.', 'JV-57', 'journal_entry', 3520.00, 3520.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '18f3029d-7463-430a-983f-96c1b6fc628e', '6c8d9219-031c-4376-be4e-382fe451d77f', id, 'Purchased liquid gas.', 1640.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b25573f0-8164-4089-a774-6e9793e7ceff', '6c8d9219-031c-4376-be4e-382fe451d77f', id, 'Purchased fuel for the power generator.', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a8e1904d-367d-455d-9b03-259202a0b973', '6c8d9219-031c-4376-be4e-382fe451d77f', id, 'Paid for staff lunch expenses.', 1190.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3c379aee-ed3a-4461-bcda-844e1f25fa4f', '6c8d9219-031c-4376-be4e-382fe451d77f', id, 'Paid for the engine oil for the power generator.', 150.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a1031fb3-b5e8-488e-a8eb-6045a443fae5', '6c8d9219-031c-4376-be4e-382fe451d77f', id, 'Paid for the drinking water.', 40.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0a34c663-f028-4b9b-834e-39ce8a613686', '6c8d9219-031c-4376-be4e-382fe451d77f', id, 'Paid for liquid gas, fuel, lunch expense, engine oil, and drinking water.', 0.00, 3520.00 FROM accounts WHERE account_code = '10100';

-- Entry: 58
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7ae8d6ec-dc26-468f-a95e-0e5eb10f4f1b', 'JE-000058', '2025-01-29', 'Paid expenses made for staff lunch.', 'JV-58', 'journal_entry', 1550.00, 1550.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4bd59018-3d1c-40f0-8661-f0179299440e', '7ae8d6ec-dc26-468f-a95e-0e5eb10f4f1b', id, 'Paid expenses made for staff lunch.', 750.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b02c1b40-944f-4123-8450-3a367452c77a', '7ae8d6ec-dc26-468f-a95e-0e5eb10f4f1b', id, 'Paid for purchase of one tanker water for the office.', 800.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '82056e5d-4e24-4ab2-97d2-94710e6d5f5d', '7ae8d6ec-dc26-468f-a95e-0e5eb10f4f1b', id, 'Paid for the lunch expenses, and water.', 0.00, 1550.00 FROM accounts WHERE account_code = '10100';

-- Entry: 59
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0a80dff6-f805-4aa4-bd48-bc4c393842aa', 'JE-000059', '2025-01-30', 'Two months office rent paid for the month of Dalwa and Hoot 1403', 'JV-59', 'journal_entry', 73019.51, 73019.51, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7b27620e-bafb-4a5b-acfc-3cdd777f28e9', '0a80dff6-f805-4aa4-bd48-bc4c393842aa', id, 'Two months office rent paid for the month of Dalwa and Hoot 1403', 60000.00, 0.00 FROM accounts WHERE account_code = '13100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '53f545cf-f2b1-43ad-9ff5-bde3db56258f', '0a80dff6-f805-4aa4-bd48-bc4c393842aa', id, 'Two months office rent paid for the month of Dalwa and Hoot 1403', 0.00, 60000.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '86c9d4c9-0af4-4fb2-b45b-12e83f0ed10e', '0a80dff6-f805-4aa4-bd48-bc4c393842aa', id, 'Paid for the liquid gas.', 560.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bbca6fb7-7810-40db-beaa-0f8f6e303c4a', '0a80dff6-f805-4aa4-bd48-bc4c393842aa', id, 'Taxi used for the office work.', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5c11715b-7d9b-490c-9085-711ee8a66ebc', '0a80dff6-f805-4aa4-bd48-bc4c393842aa', id, 'Electricity bill paid for the month of Jadi 1403', 1370.00, 0.00 FROM accounts WHERE account_code = '61101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bba1a6cf-4561-4c2b-ad77-fb3c9b12833f', '0a80dff6-f805-4aa4-bd48-bc4c393842aa', id, 'Paid for gas, taxi and electricity.', 0.00, 2080.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '62101791-a0fe-4f7b-9dc1-8931192326d9', '0a80dff6-f805-4aa4-bd48-bc4c393842aa', id, 'Depreciation charged for the month of Jan 2025', 10939.51, 0.00 FROM accounts WHERE account_code = '61900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cf229210-6695-4550-b1c9-17db4d20bae3', '0a80dff6-f805-4aa4-bd48-bc4c393842aa', id, 'Depreciation charged for the month of Jan 2025', 0.00, 3309.25 FROM accounts WHERE account_code = '17202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5ffdeece-b073-42dc-8857-ca0143fde12c', '0a80dff6-f805-4aa4-bd48-bc4c393842aa', id, 'Depreciation charged for the month of Jan 2025', 0.00, 5373.71 FROM accounts WHERE account_code = '17302';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a750235a-32d6-4988-9be0-dbf09e9e3249', '0a80dff6-f805-4aa4-bd48-bc4c393842aa', id, 'Depreciation charged for the month of Jan 2025', 0.00, 2256.55 FROM accounts WHERE account_code = '17102';

-- Entry: 60
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e637024c-b373-49a3-8494-3d47ac283209', 'JE-000060', '2025-01-30', 'Salary payable for the month of Jan 2025', 'JV-60', 'journal_entry', 299972.00, 299972.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '42790def-008c-495e-9dd2-8bfd9d11ceaf', 'e637024c-b373-49a3-8494-3d47ac283209', id, 'Salary payable for the month of Jan 2025', 299972.00, 0.00 FROM accounts WHERE account_code = '60001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '804bd859-676f-487d-b04d-30a976403cee', 'e637024c-b373-49a3-8494-3d47ac283209', id, 'Salary payable for the month of Jan 2025', 0.00, 80000.00 FROM accounts WHERE account_code = '20151';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '81ed8b0f-d163-4b95-8403-590883891190', 'e637024c-b373-49a3-8494-3d47ac283209', id, 'Salary payable for the month of Jan 2025', 0.00, 50600.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3b0cfd7a-ebc9-4825-b08b-c8648c776cd3', 'e637024c-b373-49a3-8494-3d47ac283209', id, 'Salary payable for the month of Jan 2025', 0.00, 50600.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '607a80d9-bfde-48bd-963e-1ba282400500', 'e637024c-b373-49a3-8494-3d47ac283209', id, 'Salary payable for the month of Jan 2025', 0.00, 50600.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5406cbcb-dd8f-45a9-ba9e-995da11896c6', 'e637024c-b373-49a3-8494-3d47ac283209', id, 'Salary payable for the month of Jan 2025', 0.00, 11860.00 FROM accounts WHERE account_code = '20155';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ee3c6be9-f0ad-459b-970e-8f51bf4647ac', 'e637024c-b373-49a3-8494-3d47ac283209', id, 'Salary payable for the month of Jan 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8d1d1d52-a214-4d33-a2c1-d824366fcd8f', 'e637024c-b373-49a3-8494-3d47ac283209', id, 'Salary payable for the month of Jan 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4b853536-2576-44bf-ac70-c3aa29431827', 'e637024c-b373-49a3-8494-3d47ac283209', id, 'Salary payable for the month of Jan 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bbddb0a1-e76a-42ca-bd83-36fc2261e1b1', 'e637024c-b373-49a3-8494-3d47ac283209', id, 'Salary payable for the month of Jan 2025', 0.00, 13975.00 FROM accounts WHERE account_code = '20160';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '000eb283-f0e5-4032-b89d-cf484a3a03c6', 'e637024c-b373-49a3-8494-3d47ac283209', id, 'Salary payable for the month of Jan 2025', 0.00, 21457.00 FROM accounts WHERE account_code = '21100';

-- Entry: 61
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0967b505-e862-4b23-b28c-f152de0cb2e0', 'JE-000061', '2025-02-02', 'Paid for making date and logo stamps.', 'JV-61', 'journal_entry', 3750.00, 3750.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '28b85c57-5f63-4da0-8e60-1e0842783e73', '0967b505-e862-4b23-b28c-f152de0cb2e0', id, 'Paid for making date and logo stamps.', 3750.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fc833953-ad13-4b2f-ba86-8d0d55af303f', '0967b505-e862-4b23-b28c-f152de0cb2e0', id, 'Paid for making date and logo stamps.', 0.00, 3750.00 FROM accounts WHERE account_code = '10100';

-- Entry: 64
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5faeaf61-c0ed-47c1-9be3-6214e6923dd7', 'JE-000062', '2025-02-03', 'Purchased cable for HDD.', 'JV-64', 'journal_entry', 250.00, 250.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a7e5881a-cf2b-476d-8718-cdc19b5c4731', '5faeaf61-c0ed-47c1-9be3-6214e6923dd7', id, 'Purchased cable for HDD.', 250.00, 0.00 FROM accounts WHERE account_code = '61207';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '15b35b97-8fbe-42e8-a3e0-e67a26080e5d', '5faeaf61-c0ed-47c1-9be3-6214e6923dd7', id, 'Purchased cable for HDD.', 0.00, 250.00 FROM accounts WHERE account_code = '10100';

-- Entry: 62
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('04b28e4c-59fc-4b47-90bc-529f2b651c8c', 'JE-000063', '2025-02-04', 'Salary paid for the month of Jan 2025', 'JV-62', 'journal_entry', 278515.00, 278515.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0444bf6a-bd4b-4a8f-a97c-49c73190b23b', '04b28e4c-59fc-4b47-90bc-529f2b651c8c', id, 'Salary paid for the month of Jan 2025', 80000.00, 0.00 FROM accounts WHERE account_code = '20151';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6b4699c1-8900-402f-8d71-e6a8251557a2', '04b28e4c-59fc-4b47-90bc-529f2b651c8c', id, 'Salary paid for the month of Jan 2025', 50600.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '14cd86b0-6c4d-485c-bc88-d8908c128f1b', '04b28e4c-59fc-4b47-90bc-529f2b651c8c', id, 'Salary paid for the month of Jan 2025', 50600.00, 0.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'feb117ca-0191-4a76-8f2e-6844a497a77b', '04b28e4c-59fc-4b47-90bc-529f2b651c8c', id, 'Salary paid for the month of Jan 2025', 50600.00, 0.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '853b97a8-318f-42b1-bc55-f166e227dfc3', '04b28e4c-59fc-4b47-90bc-529f2b651c8c', id, 'Salary paid for the month of Jan 2025', 11860.00, 0.00 FROM accounts WHERE account_code = '20155';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b9064ae4-cfcf-4492-acf7-bc0a12af89ae', '04b28e4c-59fc-4b47-90bc-529f2b651c8c', id, 'Salary paid for the month of Jan 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c8f6a04f-0af4-4ad9-98f7-722e61dc5316', '04b28e4c-59fc-4b47-90bc-529f2b651c8c', id, 'Salary paid for the month of Jan 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '10e2d27c-f822-42b7-b0ef-685752a285e6', '04b28e4c-59fc-4b47-90bc-529f2b651c8c', id, 'Salary paid for the month of Jan 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '64e570f9-6a90-4fde-a75c-932db1790c1d', '04b28e4c-59fc-4b47-90bc-529f2b651c8c', id, 'Salary paid for the month of Jan 2025', 13975.00, 0.00 FROM accounts WHERE account_code = '20160';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c01cf3c-053d-4f02-8be2-53c5363f0cb2', '04b28e4c-59fc-4b47-90bc-529f2b651c8c', id, 'Salary paid for the month of Jan 2025', 0.00, 278515.00 FROM accounts WHERE account_code = '10100';

-- Entry: 63
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0308f3d9-e513-4108-8c0d-7d77c584ee26', 'JE-000064', '2025-02-09', 'Purchased HDD 1TB Sata for the office desktop PC', 'JV-63', 'journal_entry', 1200.00, 1200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bc0df233-5982-45e9-b73d-ade27c7c9317', '0308f3d9-e513-4108-8c0d-7d77c584ee26', id, 'Purchased HDD 1TB Sata for the office desktop PC', 1200.00, 0.00 FROM accounts WHERE account_code = '80001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bd248db1-0abc-43d9-97e9-8464a1eca0f4', '0308f3d9-e513-4108-8c0d-7d77c584ee26', id, 'Purchased HDD 1TB Sata for the office desktop PC', 0.00, 1200.00 FROM accounts WHERE account_code = '10100';

-- Entry: 65
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ecaaa33c-88df-4572-85c1-6860a6bec820', 'JE-000065', '2025-02-13', 'Purchased 28 chairs for the meeting room.', 'JV-65', 'journal_entry', 42000.00, 42000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd4a1ce14-76f5-4c42-99d4-915908def9b3', 'ecaaa33c-88df-4572-85c1-6860a6bec820', id, 'Purchased 28 chairs for the meeting room.', 42000.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7bcf6038-dcf7-4332-974c-982952ff97eb', 'ecaaa33c-88df-4572-85c1-6860a6bec820', id, 'Purchased 28 chairs for the meeting room.', 0.00, 42000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 66
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('98ee4af6-bce7-4c50-a022-e7c12dc95a41', 'JE-000066', '2025-02-14', 'Paid for the office lunch expenses.', 'JV-66', 'journal_entry', 800.00, 800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2ce2a1e0-6141-4361-b15c-2b81495ec65f', '98ee4af6-bce7-4c50-a022-e7c12dc95a41', id, 'Paid for the office lunch expenses.', 800.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4c006b2a-11d9-4f44-ad07-642ce2b25b2d', '98ee4af6-bce7-4c50-a022-e7c12dc95a41', id, 'Paid for the office lunch expenses.', 0.00, 800.00 FROM accounts WHERE account_code = '10100';

-- Entry: 67
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5798aa6f-3461-4b51-ba33-dc9e9960da63', 'JE-000067', '2025-02-16', 'Paid for office lunch expenses.', 'JV-67', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '121155fa-be16-4717-b35c-450c0e6e5b25', '5798aa6f-3461-4b51-ba33-dc9e9960da63', id, 'Paid for office lunch expenses.', 500.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6be3faf3-3a97-4881-b394-69e60b0cd7ae', '5798aa6f-3461-4b51-ba33-dc9e9960da63', id, 'Paid for office lunch expenses.', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 68
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('89c4f664-b323-48cf-9b1a-55ddf8f60ead', 'JE-000068', '2025-02-17', 'Paid for office lunch expenses.', 'JV-68', 'journal_entry', 765.00, 765.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '46299c2f-f838-44cb-aaa0-b1eefb0a59ad', '89c4f664-b323-48cf-9b1a-55ddf8f60ead', id, 'Paid for office lunch expenses.', 215.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e8434744-bc5b-4466-913d-ab0b966c8c6b', '89c4f664-b323-48cf-9b1a-55ddf8f60ead', id, 'Paid for fuel for the office power generator.', 500.00, 0.00 FROM accounts WHERE account_code = '60901';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e0fcab90-2eba-4318-84bb-8cb5c0e220fe', '89c4f664-b323-48cf-9b1a-55ddf8f60ead', id, 'Paid for drinking water.', 50.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b49fd77b-88bb-4eb4-b260-cf8fd7d451ec', '89c4f664-b323-48cf-9b1a-55ddf8f60ead', id, 'Paid for drining water, fuel, and lunch expenses.', 0.00, 765.00 FROM accounts WHERE account_code = '10100';

-- Entry: 69
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b4e0d44b-c53e-4a07-8830-5b0b36f51699', 'JE-000069', '2025-02-18', 'Paid for staff lunch expenses.', 'JV-69', 'journal_entry', 1350.00, 1350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '64c9f537-9b18-453c-b892-960f4d731b22', 'b4e0d44b-c53e-4a07-8830-5b0b36f51699', id, 'Paid for staff lunch expenses.', 350.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6ced461e-a50f-4d44-b72d-2308d827c081', 'b4e0d44b-c53e-4a07-8830-5b0b36f51699', id, 'Paid for the liquid gas.', 1000.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'baf31d55-8117-4257-af9b-9e01ac0221b6', 'b4e0d44b-c53e-4a07-8830-5b0b36f51699', id, 'Paid for the liquid gas and lunch expenses.', 0.00, 1350.00 FROM accounts WHERE account_code = '10100';

-- Entry: 70
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9b947677-2369-4926-8b96-f2bf5bdfbc7c', 'JE-000070', '2025-02-19', 'Taxi used to received letter.', 'JV-70', 'journal_entry', 33730.00, 33730.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1c120655-4e0c-4cd2-87fa-a2eb6e3fb368', '9b947677-2369-4926-8b96-f2bf5bdfbc7c', id, 'Taxi used to received letter.', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '62295501-4c57-4f2c-8c3e-9fdc932bba02', '9b947677-2369-4926-8b96-f2bf5bdfbc7c', id, 'Paid for lunch expense of staff.', 80.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '90e654fe-c3d2-4abe-9bb7-5d5723fbd0f1', '9b947677-2369-4926-8b96-f2bf5bdfbc7c', id, 'Paid for fuel used for the power generator', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e6a8b542-f3a0-4edc-b029-b63aaa631870', '9b947677-2369-4926-8b96-f2bf5bdfbc7c', id, 'Paid for fuel used for the power generator, lunch, and taxi.', 0.00, 730.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '91718542-faed-4dd1-a382-8723caafb68d', '9b947677-2369-4926-8b96-f2bf5bdfbc7c', id, 'House rent prepaid for the month of Dalwa 1403', 33000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0f195c21-2272-48e5-9282-a60614fb1162', '9b947677-2369-4926-8b96-f2bf5bdfbc7c', id, 'House rent tax withheld for the month of Dalwa 1403', 0.00, 3000.00 FROM accounts WHERE account_code = '21200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '583af532-2359-4616-b3a1-04800319d2d3', '9b947677-2369-4926-8b96-f2bf5bdfbc7c', id, 'House rent prepaid for the month of Dalwa 1403', 0.00, 30000.00 FROM accounts WHERE account_code = '13100';

-- Entry: 71
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8c2962b1-68a1-4671-a2e9-be640d0eab1f', 'JE-000071', '2025-02-20', 'Paid for the liquid gas.', 'JV-71', 'journal_entry', 590.00, 590.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ee14b5ca-92dd-49d5-8ab6-9e683e5aa807', '8c2962b1-68a1-4671-a2e9-be640d0eab1f', id, 'Paid for the liquid gas.', 500.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8de78852-a153-4577-9b35-4a21e9588f90', '8c2962b1-68a1-4671-a2e9-be640d0eab1f', id, 'Purchased breads for lunch.', 90.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7352e6c5-3ce5-4209-8d5c-f8a9bd7d906f', '8c2962b1-68a1-4671-a2e9-be640d0eab1f', id, 'Purchased breads for lunch and liquid gas.', 0.00, 590.00 FROM accounts WHERE account_code = '10100';

-- Entry: 72
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0e7efb2f-4ea0-4330-8fd9-6afc2c2702f4', 'JE-000072', '2025-02-21', 'Purchased water for the office use.', 'JV-72', 'journal_entry', 1080.00, 1080.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '32d5ce77-a5f2-41d7-80a6-e20142919c01', '0e7efb2f-4ea0-4330-8fd9-6afc2c2702f4', id, 'Purchased water for the office use.', 800.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6b9b8f4b-a219-4f5c-ab33-36510fdd8969', '0e7efb2f-4ea0-4330-8fd9-6afc2c2702f4', id, 'Paid for Shahpoor''s dinner food', 100.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a28bd849-f0f9-4eba-b354-295a14149e83', '0e7efb2f-4ea0-4330-8fd9-6afc2c2702f4', id, 'Purchased some stationery for the office use.', 180.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '97249622-882c-4dd9-9ef6-c3b4b72ac3eb', '0e7efb2f-4ea0-4330-8fd9-6afc2c2702f4', id, 'Purchased some stationery for the office use, food, and water.', 0.00, 1080.00 FROM accounts WHERE account_code = '10100';

-- Entry: 73
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3e0a02f5-5899-450a-9c77-0170f26f81d3', 'JE-000073', '2025-02-22', 'Purchased conference table for the office use.', 'JV-73', 'journal_entry', 37000.00, 37000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7df1f725-b4cb-437f-8181-f7893bf408a8', '3e0a02f5-5899-450a-9c77-0170f26f81d3', id, 'Purchased conference table for the office use.', 37000.00, 0.00 FROM accounts WHERE account_code = '17301';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '01b38651-5628-4804-806b-776fe75417c8', '3e0a02f5-5899-450a-9c77-0170f26f81d3', id, 'Purchased conference table for the office use.', 0.00, 37000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 74
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('deb9744b-e143-4431-b23e-5e0e5aa0f682', 'JE-000074', '2025-02-23', 'Purchased food item for lunch.', 'JV-74', 'journal_entry', 640.00, 640.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e5efa86-230b-443d-8fb3-d06aee320dd4', 'deb9744b-e143-4431-b23e-5e0e5aa0f682', id, 'Purchased food item for lunch.', 640.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '107b9713-3a59-4710-a6bd-eaba071adfd7', 'deb9744b-e143-4431-b23e-5e0e5aa0f682', id, 'Purchased food item for lunch.', 0.00, 640.00 FROM accounts WHERE account_code = '10100';

-- Entry: 75
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('43d21fc3-c099-4146-be47-ac2936075b61', 'JE-000075', '2025-02-24', 'Paid for staff lunch expense.', 'JV-75', 'journal_entry', 400.00, 400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0ae24995-05fb-474f-8dba-f7400f7f7937', '43d21fc3-c099-4146-be47-ac2936075b61', id, 'Paid for staff lunch expense.', 400.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1bc4709b-76fd-41c4-a823-4151259c29c7', '43d21fc3-c099-4146-be47-ac2936075b61', id, 'Paid for staff lunch expense.', 0.00, 400.00 FROM accounts WHERE account_code = '10100';

-- Entry: 76
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('66b2189d-ff4d-4609-98d6-802f7dbab030', 'JE-000076', '2025-02-26', 'Purchased chocolates for the staff use.', 'JV-76', 'journal_entry', 740.00, 740.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dc462bd8-2c22-4b96-9d6e-9bf3812be7e1', '66b2189d-ff4d-4609-98d6-802f7dbab030', id, 'Purchased chocolates for the staff use.', 240.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '428a063e-2c37-4578-80bf-d6ba01f8b9c6', '66b2189d-ff4d-4609-98d6-802f7dbab030', id, 'Paid for lunch expenses', 500.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3b84bcaa-4ad6-4cc8-9d14-fc9638af4367', '66b2189d-ff4d-4609-98d6-802f7dbab030', id, 'Paid for lunch expenses and chocolate', 0.00, 740.00 FROM accounts WHERE account_code = '10100';

-- Entry: 77
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('397ec137-f8f4-4cdf-afd9-ce3ae6806d8f', 'JE-000077', '2025-02-26', 'Paid for lunch epxenses', 'JV-77', 'journal_entry', 2110.00, 2110.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9195ef34-b4c9-4aa2-81f0-44e2fe30c93d', '397ec137-f8f4-4cdf-afd9-ce3ae6806d8f', id, 'Paid for lunch epxenses', 1060.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fbf28302-b374-4ad6-b273-ce2b22585fa4', '397ec137-f8f4-4cdf-afd9-ce3ae6806d8f', id, 'Paid for the power generator fuel', 1000.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4dd7e913-cb15-419b-82d6-5d906706ea5e', '397ec137-f8f4-4cdf-afd9-ce3ae6806d8f', id, 'Paid for drinking water.', 50.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '55b15e1d-7256-4b93-be93-812c8947f256', '397ec137-f8f4-4cdf-afd9-ce3ae6806d8f', id, 'Paid for lunch expenses, power generator fuel, drinking water.', 0.00, 2110.00 FROM accounts WHERE account_code = '10100';

-- Entry: 78
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8b537444-f00b-4fb7-95f5-5ff4f24d1fb1', 'JE-000078', '2025-02-27', 'Paid to guards dinner expenses for 5 days during Ramadan', 'JV-78', 'journal_entry', 850.00, 850.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9309f6f1-5bc4-45ef-8700-ab404dc6d0c7', '8b537444-f00b-4fb7-95f5-5ff4f24d1fb1', id, 'Paid to guards dinner expenses for 5 days during Ramadan', 850.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4b01e266-a0db-4d27-a363-791eee910a76', '8b537444-f00b-4fb7-95f5-5ff4f24d1fb1', id, 'Paid to guards dinner expenses for 5 days during Ramadan', 0.00, 850.00 FROM accounts WHERE account_code = '10100';

-- Entry: 79
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5d3f902a-6620-40c4-b531-2c5c7c65dcb9', 'JE-000079', '2025-02-28', 'Salary payable for the month of Feb 2025', 'JV-79', 'journal_entry', 328167.00, 328167.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '80598d85-81bc-4aab-a6bb-e921d4693440', '5d3f902a-6620-40c4-b531-2c5c7c65dcb9', id, 'Salary payable for the month of Feb 2025', 328167.00, 0.00 FROM accounts WHERE account_code = '60001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1504c398-c7e8-4c3e-a2da-083cb667892f', '5d3f902a-6620-40c4-b531-2c5c7c65dcb9', id, 'Salary payable for the month of Feb 2025', 0.00, 80000.00 FROM accounts WHERE account_code = '20151';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9b6ac026-c3f5-406b-b1ef-af4212fc233a', '5d3f902a-6620-40c4-b531-2c5c7c65dcb9', id, 'Salary payable for the month of Feb 2025', 0.00, 50600.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5d927987-79d6-461c-9b0b-2a2c658ed7c6', '5d3f902a-6620-40c4-b531-2c5c7c65dcb9', id, 'Salary payable for the month of Feb 2025', 0.00, 50600.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '05ba88bf-186a-46f1-891e-370f8cca31ee', '5d3f902a-6620-40c4-b531-2c5c7c65dcb9', id, 'Salary payable for the month of Feb 2025', 0.00, 50600.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2a552d6b-30ee-4ed7-afb7-8f07e3863ad0', '5d3f902a-6620-40c4-b531-2c5c7c65dcb9', id, 'Salary payable for the month of Feb 2025', 0.00, 11860.00 FROM accounts WHERE account_code = '20155';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ce441164-5eec-4190-8486-901e162a41f6', '5d3f902a-6620-40c4-b531-2c5c7c65dcb9', id, 'Salary payable for the month of Feb 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f60167e0-5266-44f6-92fb-2035efa2f715', '5d3f902a-6620-40c4-b531-2c5c7c65dcb9', id, 'Salary payable for the month of Feb 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e8cf8cfe-cf28-4821-8d37-c957dc343f70', '5d3f902a-6620-40c4-b531-2c5c7c65dcb9', id, 'Salary payable for the month of Feb 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '042b0d18-8620-41db-9d8e-74dd2d2201e1', '5d3f902a-6620-40c4-b531-2c5c7c65dcb9', id, 'Salary payable for the month of Feb 2025', 0.00, 9900.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2fe0cd38-4794-4a95-b1c9-34d2eff62fc7', '5d3f902a-6620-40c4-b531-2c5c7c65dcb9', id, 'Salary payable for the month of Feb 2025', 0.00, 28100.00 FROM accounts WHERE account_code = '20160';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '69751a91-c649-4e81-a063-3412a930eebf', '5d3f902a-6620-40c4-b531-2c5c7c65dcb9', id, 'Salary payable for the month of Feb 2025', 0.00, 2500.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cc2f784d-62c3-49bc-b24c-f77753d87226', '5d3f902a-6620-40c4-b531-2c5c7c65dcb9', id, 'Salary tax payable for the month of Feb 2025', 0.00, 23127.00 FROM accounts WHERE account_code = '21100';

-- Entry: 80
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a3933d5d-4eaa-4a67-b589-6aabece38cd1', 'JE-000080', '2025-02-28', 'Paid for monthly internet fee for the month of Feb 2025', 'JV-80', 'journal_entry', 19794.84, 19794.84, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4860525d-197b-45c9-bb40-2c8640fe984e', 'a3933d5d-4eaa-4a67-b589-6aabece38cd1', id, 'Paid for monthly internet fee for the month of Feb 2025', 7372.00, 0.00 FROM accounts WHERE account_code = '61202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fbf0cec3-fd7a-4b89-a119-18555addfdc1', 'a3933d5d-4eaa-4a67-b589-6aabece38cd1', id, 'Paid for monthly internet fee for the month of Feb 2025', 0.00, 7372.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e319a8d6-c5bc-4368-8819-9fce124b4324', 'a3933d5d-4eaa-4a67-b589-6aabece38cd1', id, 'Depreciation expense charged for the month of Feb 2025', 12422.84, 0.00 FROM accounts WHERE account_code = '61900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '47948a80-e29c-492d-9c01-9c49f560117c', 'a3933d5d-4eaa-4a67-b589-6aabece38cd1', id, 'Depreciation expense charged for the month of Feb 2025', 0.00, 3309.25 FROM accounts WHERE account_code = '17202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'da534554-9789-46e7-9cf2-34785adf625a', 'a3933d5d-4eaa-4a67-b589-6aabece38cd1', id, 'Depreciation expense charged for the month of Feb 2025', 0.00, 6857.04 FROM accounts WHERE account_code = '17302';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bf30bc16-abd3-4fb8-890d-a517beb8b0a7', 'a3933d5d-4eaa-4a67-b589-6aabece38cd1', id, 'Depreciation expense charged for the month of Feb 2025', 0.00, 2256.55 FROM accounts WHERE account_code = '17102';

-- Entry: 81
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('645ba14a-21e1-474e-9604-a98f20a62dc7', 'JE-000081', '2025-03-05', 'Paid for liquid gas', 'JV-81', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '95386833-02d5-4045-a0bd-f1c2958d7f4c', '645ba14a-21e1-474e-9604-a98f20a62dc7', id, 'Paid for liquid gas', 360.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '108f3013-b594-4bbb-8049-aa650141567d', '645ba14a-21e1-474e-9604-a98f20a62dc7', id, 'Paid for breads', 90.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e54f7a79-50de-486a-b2d4-9b94d3e8eaba', '645ba14a-21e1-474e-9604-a98f20a62dc7', id, 'Paid for drinking water', 50.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e283d3bb-6433-448c-8851-6a7560bcf8c4', '645ba14a-21e1-474e-9604-a98f20a62dc7', id, 'Paid for gas, breads, and drinking water.', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 82
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('33ce03f4-247b-4619-aa32-e1e74c22fb70', 'JE-000082', '2025-03-05', 'Salary paid for the month of Feb 2025', 'JV-82', 'journal_entry', 305040.00, 305040.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '43b90910-8dc2-4209-b01f-0325c4709cf3', '33ce03f4-247b-4619-aa32-e1e74c22fb70', id, 'Salary paid for the month of Feb 2025', 80000.00, 0.00 FROM accounts WHERE account_code = '20151';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '93d5e33a-fd8f-40a4-b7ca-81332b06f1b6', '33ce03f4-247b-4619-aa32-e1e74c22fb70', id, 'Salary paid for the month of Feb 2025', 50600.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7bbb5a3b-0497-48d0-a20e-b74c0bbdb638', '33ce03f4-247b-4619-aa32-e1e74c22fb70', id, 'Salary paid for the month of Feb 2025', 50600.00, 0.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '54320e7f-f5a2-42ea-bb6d-3509cab43ffc', '33ce03f4-247b-4619-aa32-e1e74c22fb70', id, 'Salary paid for the month of Feb 2025', 50600.00, 0.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fbebcca2-0485-4faa-bef1-6a0497fb7c32', '33ce03f4-247b-4619-aa32-e1e74c22fb70', id, 'Salary paid for the month of Feb 2025', 11860.00, 0.00 FROM accounts WHERE account_code = '20155';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8e549333-f131-4066-8637-eb12ccadff3a', '33ce03f4-247b-4619-aa32-e1e74c22fb70', id, 'Salary paid for the month of Feb 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cc73917c-54ff-4a85-abcf-44f2f83efc43', '33ce03f4-247b-4619-aa32-e1e74c22fb70', id, 'Salary paid for the month of Feb 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd1e26958-c76a-468a-8b2a-2ac1bc3eda65', '33ce03f4-247b-4619-aa32-e1e74c22fb70', id, 'Salary paid for the month of Feb 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1b7d22f7-c467-4394-9cd0-20bbc9894910', '33ce03f4-247b-4619-aa32-e1e74c22fb70', id, 'Salary paid for the month of Feb 2025', 9900.00, 0.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '13fce296-eca4-4155-83c0-dbbc3ffd38f3', '33ce03f4-247b-4619-aa32-e1e74c22fb70', id, 'Salary paid for the month of Feb 2025', 28100.00, 0.00 FROM accounts WHERE account_code = '20160';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4b0b17f8-f0a6-4e85-a602-4404b4176d26', '33ce03f4-247b-4619-aa32-e1e74c22fb70', id, 'Salary paid for the month of Feb 2025', 2500.00, 0.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f08d179e-f7a0-46f8-bcfb-21a0ec2d3f7c', '33ce03f4-247b-4619-aa32-e1e74c22fb70', id, 'Salary paid for the month of Feb 2025', 0.00, 305040.00 FROM accounts WHERE account_code = '10100';

-- Entry: 83
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('88f854b7-4066-4288-9f4f-46c2c16d414f', 'JE-000083', '2025-03-06', 'Paid for monthly electricity bill', 'JV-83', 'journal_entry', 3740.00, 3740.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6eef6349-e0f4-4d05-86e5-c2493ea87cab', '88f854b7-4066-4288-9f4f-46c2c16d414f', id, 'Paid for monthly electricity bill', 3740.00, 0.00 FROM accounts WHERE account_code = '61101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7ce7f87d-280b-4464-b5d7-4e081c0f840d', '88f854b7-4066-4288-9f4f-46c2c16d414f', id, 'Paid for monthly electricity bill', 0.00, 3740.00 FROM accounts WHERE account_code = '10100';

-- Entry: 84
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7aa39e9c-a71c-44ed-912b-2df93c951006', 'JE-000084', '2025-03-06', 'Paid for staff lunch expense', 'JV-84', 'journal_entry', 260.00, 260.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6c187bea-ea6f-403e-a1a8-7f5c2c9a80de', '7aa39e9c-a71c-44ed-912b-2df93c951006', id, 'Paid for staff lunch expense', 260.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c104d4ff-c63a-426f-9002-dda234c7862d', '7aa39e9c-a71c-44ed-912b-2df93c951006', id, 'Paid for staff lunch expense', 0.00, 260.00 FROM accounts WHERE account_code = '10100';

-- Entry: 85
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5ac7cb31-9a16-4f80-8438-1dcafa1565c4', 'JE-000085', '2025-03-08', 'Paid for staff lunch expense', 'JV-85', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4b478c75-d1aa-4ca5-b64c-ec9e68ec5b6e', '5ac7cb31-9a16-4f80-8438-1dcafa1565c4', id, 'Paid for staff lunch expense', 300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b9756650-59dd-4e63-b5a0-105f8367bb5d', '5ac7cb31-9a16-4f80-8438-1dcafa1565c4', id, 'Paid for staff lunch expense', 0.00, 300.00 FROM accounts WHERE account_code = '10100';

-- Entry: 86
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2a362813-2c72-4311-860c-666430ad6dbd', 'JE-000086', '2025-03-09', 'Paid for stuff lunch', 'JV-86', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0eb4e4fa-650c-4588-846a-978a5882e663', '2a362813-2c72-4311-860c-666430ad6dbd', id, 'Paid for stuff lunch', 150.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'da5ee31c-5eaa-4213-86a3-afa3f91af768', '2a362813-2c72-4311-860c-666430ad6dbd', id, 'Paid for stuff lunch', 0.00, 150.00 FROM accounts WHERE account_code = '10100';

-- Entry: 87
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('20a5150d-5caa-42ca-a78b-dfc73aa1b7a3', 'JE-000087', '2025-03-09', 'Paid for the power generator fuel', 'JV-87', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f3e83812-813a-4db6-b430-7cff68dca949', '20a5150d-5caa-42ca-a78b-dfc73aa1b7a3', id, 'Paid for the power generator fuel', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7c433340-18dc-4b1b-9db4-87646901ad66', '20a5150d-5caa-42ca-a78b-dfc73aa1b7a3', id, 'Paid for the power generator fuel', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 88
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2b195931-8f81-4ffc-9cc7-5037cfeb7147', 'JE-000088', '2025-03-10', 'Paid for staff lunch', 'JV-88', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fceb7d40-023a-4b2f-8cd3-1e1dfe1229a2', '2b195931-8f81-4ffc-9cc7-5037cfeb7147', id, 'Paid for staff lunch', 1000.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c2a01d83-116b-4592-b57f-9cd4eb57337a', '2b195931-8f81-4ffc-9cc7-5037cfeb7147', id, 'Purchased one monitor for the office', 0.00, 1000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 89
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c3405b26-b29d-4d94-92a4-9a953e42bab8', 'JE-000089', '2025-03-10', 'Purchased one monitor for the office', 'JV-89', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '68c9f46f-f8d5-4616-ba11-b0ede88e1114', 'c3405b26-b29d-4d94-92a4-9a953e42bab8', id, 'Purchased one monitor for the office', 1000.00, 0.00 FROM accounts WHERE account_code = '17101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '47151fd7-6a39-4db6-bd37-7ef31d1245f2', 'c3405b26-b29d-4d94-92a4-9a953e42bab8', id, 'Purchased one monitor for the office', 0.00, 1000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 90
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2b7c8cc7-aa0f-44f8-a809-fb46d314abcb', 'JE-000090', '2025-03-10', 'Paid for staff food expenses', 'JV-90', 'journal_entry', 220.00, 220.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '024462d7-cc3b-4849-8927-a100e31a06d6', '2b7c8cc7-aa0f-44f8-a809-fb46d314abcb', id, 'Paid for staff food expenses', 220.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9e5ee5ae-1208-4bde-9c7c-4c446e44d668', '2b7c8cc7-aa0f-44f8-a809-fb46d314abcb', id, 'Paid for staff food expenses', 0.00, 220.00 FROM accounts WHERE account_code = '10100';

-- Entry: 91
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8eec019b-1768-448a-b7f5-741f233d26a6', 'JE-000091', '2025-03-10', 'Paid for the liquid gas', 'JV-91', 'journal_entry', 930.00, 930.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3666125f-3aee-41a6-871e-db3956314e04', '8eec019b-1768-448a-b7f5-741f233d26a6', id, 'Paid for the liquid gas', 930.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a20b5c9d-cb22-40bc-8ff1-f7f8bb7524d5', '8eec019b-1768-448a-b7f5-741f233d26a6', id, 'Paid for the liquid gas', 0.00, 930.00 FROM accounts WHERE account_code = '10100';

-- Entry: 92
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a7e2725b-00fa-43a3-961c-b194b5f05757', 'JE-000092', '2025-03-10', 'Paid for staff lunch', 'JV-92', 'journal_entry', 1140.00, 1140.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f4b224df-e146-4740-8782-fee2bac992d2', 'a7e2725b-00fa-43a3-961c-b194b5f05757', id, 'Paid for staff lunch', 1140.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '424a9fbd-be47-4e60-99f7-902a161ad56e', 'a7e2725b-00fa-43a3-961c-b194b5f05757', id, 'Paid for staff lunch', 0.00, 1140.00 FROM accounts WHERE account_code = '10100';

-- Entry: 93
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('340bdb04-683e-4f24-96aa-9fd982761d53', 'JE-000093', '2025-03-12', 'Purchased second hand sony projector', 'JV-93', 'journal_entry', 29350.00, 29350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5c9c2e57-d74a-4d51-b4c3-dc7437448d73', '340bdb04-683e-4f24-96aa-9fd982761d53', id, 'Purchased second hand sony projector', 29350.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3f1cf242-5ee4-4e25-8aed-2375cbdd4776', '340bdb04-683e-4f24-96aa-9fd982761d53', id, 'Purchased second hand sony projector', 0.00, 29350.00 FROM accounts WHERE account_code = '10100';

-- Entry: 94
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('22d809f6-07fd-4e81-9e70-ffc9c7e0f7e9', 'JE-000094', '2025-03-12', 'Paid for staff lunch expense', 'JV-94', 'journal_entry', 7637.00, 7637.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6eb69a78-0ce3-4e91-b11b-87635c6a71c5', '22d809f6-07fd-4e81-9e70-ffc9c7e0f7e9', id, 'Paid for staff lunch expense', 300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fb3cd27e-9e8f-4e61-aee8-76e1a2c3ca1e', '22d809f6-07fd-4e81-9e70-ffc9c7e0f7e9', id, 'Paid for staff lunch expense', 0.00, 300.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e8942e2-2eb2-434b-8a82-b5a5e0b45fa5', '22d809f6-07fd-4e81-9e70-ffc9c7e0f7e9', id, 'Paid internet fee for the month of Mar 2025', 7337.00, 0.00 FROM accounts WHERE account_code = '61202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '621e380f-d6c1-4643-8dd5-8cc3a7ccf802', '22d809f6-07fd-4e81-9e70-ffc9c7e0f7e9', id, 'Paid internet fee for the month of Mar 2025', 0.00, 7337.00 FROM accounts WHERE account_code = '10100';

-- Entry: 95
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('44266e33-9d8c-4139-8993-5cf257520aca', 'JE-000095', '2025-03-13', 'Paid for the staff lunch', 'JV-95', 'journal_entry', 250.00, 250.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e51fefd8-1f7c-40a7-81d9-d498ab18db68', '44266e33-9d8c-4139-8993-5cf257520aca', id, 'Paid for the staff lunch', 250.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '18e72d1e-81d2-4e01-9b18-071e835774d8', '44266e33-9d8c-4139-8993-5cf257520aca', id, 'Paid for the staff lunch', 0.00, 250.00 FROM accounts WHERE account_code = '10100';

-- Entry: 96
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('45da240b-796b-4576-b0e8-390cb02736b1', 'JE-000096', '2025-03-15', 'Paid for staff lunch', 'JV-96', 'journal_entry', 1217.00, 1217.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '016f6ca1-eb2d-46c1-96d4-f68dee5e0128', '45da240b-796b-4576-b0e8-390cb02736b1', id, 'Paid for staff lunch', 170.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '06b2062f-c23b-4260-a3b8-d620d9954825', '45da240b-796b-4576-b0e8-390cb02736b1', id, 'Paid for staff lunch', 0.00, 170.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '68f5da0b-ba50-4ab8-8b9b-e14cc03feef0', '45da240b-796b-4576-b0e8-390cb02736b1', id, 'Paid for subscription', 1047.00, 0.00 FROM accounts WHERE account_code = '60405';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd455bf49-1a2e-4880-a6e3-e4cec8d5171c', '45da240b-796b-4576-b0e8-390cb02736b1', id, 'Paid for subscription', 0.00, 1047.00 FROM accounts WHERE account_code = '10100';

-- Entry: 97
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b0bd874a-4209-4bbf-ac65-114188afceee', 'JE-000097', '2025-03-15', 'Taxi used for the office wor', 'JV-97', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5c1a6e0e-6478-47dd-ac52-ea378a982fec', 'b0bd874a-4209-4bbf-ac65-114188afceee', id, 'Taxi used for the office wor', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1882b9f2-d7aa-4811-b9ee-a366c28e1f4e', 'b0bd874a-4209-4bbf-ac65-114188afceee', id, 'Taxi used for the office wor', 0.00, 150.00 FROM accounts WHERE account_code = '10100';

-- Entry: 98
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('68942231-685e-4362-a604-8563eae8ea14', 'JE-000098', '2025-03-16', 'Paid staff lunch epxense', 'JV-98', 'journal_entry', 50200.00, 50200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '40d48930-9625-4874-9909-c3f0f3b35cdf', '68942231-685e-4362-a604-8563eae8ea14', id, 'Paid staff lunch epxense', 200.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fff02bc0-fa95-47f1-a551-e9d135fbbde4', '68942231-685e-4362-a604-8563eae8ea14', id, 'Paid staff lunch epxense', 0.00, 200.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0da621e4-4caa-4e19-8f68-f7c97f88764a', '68942231-685e-4362-a604-8563eae8ea14', id, 'Paid for changing the company ownership', 50000.00, 0.00 FROM accounts WHERE account_code = '60406';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1f94aec0-6cf1-4126-a257-c4006fb43255', '68942231-685e-4362-a604-8563eae8ea14', id, 'Paid for changing the company ownership', 0.00, 50000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 99
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('09e86563-0534-4d93-abb4-0e16ddf39f2c', 'JE-000099', '2025-03-17', 'Paid for the power generator fuel', 'JV-99', 'journal_entry', 630.00, 630.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '54c1121f-33b9-4f7e-b27b-ffc7caf5b13c', '09e86563-0534-4d93-abb4-0e16ddf39f2c', id, 'Paid for the power generator fuel', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '66f2e235-10cc-48d6-891a-ff5d4c080b7c', '09e86563-0534-4d93-abb4-0e16ddf39f2c', id, 'Paid for the power generator fuel', 0.00, 500.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c88f10f3-e8b9-4212-97e5-0c086554ce2b', '09e86563-0534-4d93-abb4-0e16ddf39f2c', id, 'Paid for the staff lunch expense', 130.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '54fb1b14-8009-4cda-96a1-50412cb8f0d7', '09e86563-0534-4d93-abb4-0e16ddf39f2c', id, 'Paid for the staff lunch expense', 0.00, 130.00 FROM accounts WHERE account_code = '10100';

-- Entry: 100
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ec39f0ce-9749-4047-885d-ace057ff1edb', 'JE-000100', '2025-03-20', 'House Rent was prepaid for the month of Hoot 1403', 'JV-100', 'journal_entry', 33000.00, 33000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e0baec48-287e-4650-b2c2-2bf26b1871d6', 'ec39f0ce-9749-4047-885d-ace057ff1edb', id, 'House Rent was prepaid for the month of Hoot 1403', 33000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3e1d112c-98e2-4988-a0ba-ac9269dd5122', 'ec39f0ce-9749-4047-885d-ace057ff1edb', id, 'House Rent tax withheld for the month of Hoot 1403', 0.00, 3000.00 FROM accounts WHERE account_code = '21200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7e24e5f8-6c54-4335-a09a-e4eb9b034973', 'ec39f0ce-9749-4047-885d-ace057ff1edb', id, 'House Rent was prepaid for the month of Hoot 1403', 0.00, 30000.00 FROM accounts WHERE account_code = '13100';

-- Entry: 101
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1befac6c-46b0-4215-a623-319d64280208', 'JE-000101', '2025-03-22', 'Paid for the power generator fuel', 'JV-101', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8f195f6d-43e5-4e9b-a184-3b9e875ec079', '1befac6c-46b0-4215-a623-319d64280208', id, 'Paid for the power generator fuel', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cf895b5f-5228-4f04-8c00-b1b33a11ffbe', '1befac6c-46b0-4215-a623-319d64280208', id, 'Paid for the power generator fuel', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 102
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('239478c6-540d-4eee-98d0-6b267e8e1bbd', 'JE-000102', '2025-03-25', 'Paid for lunch expense', 'JV-102', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '32f61107-3429-4c5f-bbe6-36a6ef18eafd', '239478c6-540d-4eee-98d0-6b267e8e1bbd', id, 'Paid for lunch expense', 100.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2853039a-68bd-4e1c-bd91-15066ac2370f', '239478c6-540d-4eee-98d0-6b267e8e1bbd', id, 'Paid for lunch expense', 0.00, 100.00 FROM accounts WHERE account_code = '10100';

-- Entry: 103
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6f4f5b51-7dd8-450d-9bc0-6e096d76ed7f', 'JE-000103', '2025-03-26', 'Taxi used for the office work', 'JV-103', 'journal_entry', 50.00, 50.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8097ade2-4463-4e14-8a8a-2293d3395226', '6f4f5b51-7dd8-450d-9bc0-6e096d76ed7f', id, 'Taxi used for the office work', 50.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7fb5a41e-b4f3-48c4-bd96-4e2365fbc075', '6f4f5b51-7dd8-450d-9bc0-6e096d76ed7f', id, 'Taxi used for the office work', 0.00, 50.00 FROM accounts WHERE account_code = '10100';

-- Entry: 104
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('04cc8ef6-4e95-468b-b938-dc9cd4ea9100', 'JE-000104', '2025-03-26', 'Paid for stationery used for the office work', 'JV-104', 'journal_entry', 160.00, 160.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4513017b-fa32-41e2-a964-12411d9ddd82', '04cc8ef6-4e95-468b-b938-dc9cd4ea9100', id, 'Paid for stationery used for the office work', 160.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b7232e87-dc8d-4622-a0a5-c124776a9dbb', '04cc8ef6-4e95-468b-b938-dc9cd4ea9100', id, 'Paid for stationery used for the office work', 0.00, 160.00 FROM accounts WHERE account_code = '10100';

-- Entry: 105
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('dcccfbf8-05a3-4008-92fc-5ff96503038a', 'JE-000105', '2025-03-26', 'Paid for staff lunch expense', 'JV-105', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5c3e4ee8-64bb-4b4f-bfd6-65bb756828c8', 'dcccfbf8-05a3-4008-92fc-5ff96503038a', id, 'Paid for staff lunch expense', 100.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '609433fc-816e-4fb1-878f-9cd5cc25666b', 'dcccfbf8-05a3-4008-92fc-5ff96503038a', id, 'Paid for staff lunch expense', 0.00, 100.00 FROM accounts WHERE account_code = '10100';

-- Entry: 106
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('47eaa8d4-2d57-4282-bdf8-a5e6f33e70b4', 'JE-000106', '2025-03-27', 'Taxi used for the office work', 'JV-106', 'journal_entry', 20328.22, 20328.22, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fc43cee8-0efe-4800-ad65-5257fd98e7db', '47eaa8d4-2d57-4282-bdf8-a5e6f33e70b4', id, 'Taxi used for the office work', 50.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '21098ad5-46a4-43a3-8231-297533dc7eb6', '47eaa8d4-2d57-4282-bdf8-a5e6f33e70b4', id, 'Taxi used for the office work', 0.00, 50.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aeeffa5f-c809-4b63-81ce-85bf9b5eae2b', '47eaa8d4-2d57-4282-bdf8-a5e6f33e70b4', id, 'Paid for account opening in USD Account', 7106.00, 0.00 FROM accounts WHERE account_code = '10201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '68d55619-6379-49f2-b6f0-46efc94e7479', '47eaa8d4-2d57-4282-bdf8-a5e6f33e70b4', id, 'Paid for account opening in USD Account', 0.00, 7106.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4ba82a35-95cc-4349-9506-5f2becfd31ee', '47eaa8d4-2d57-4282-bdf8-a5e6f33e70b4', id, 'Depreciation expense charged for the month of Mar 2025', 13172.22, 0.00 FROM accounts WHERE account_code = '61900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '478aeeda-d29c-4c0d-b274-b6b5ccbeb104', '47eaa8d4-2d57-4282-bdf8-a5e6f33e70b4', id, 'Depreciation expense charged for the month of Mar 2025', 0.00, 4033.88 FROM accounts WHERE account_code = '17202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b4415fc0-4c1a-4d48-9d1b-af65decdd420', '47eaa8d4-2d57-4282-bdf8-a5e6f33e70b4', id, 'Depreciation expense charged for the month of Mar 2025', 0.00, 6857.04 FROM accounts WHERE account_code = '17302';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f761fd8e-bafe-44ef-b46b-717f1b1adcde', '47eaa8d4-2d57-4282-bdf8-a5e6f33e70b4', id, 'Depreciation expense charged for the month of Mar 2025', 0.00, 2281.30 FROM accounts WHERE account_code = '17102';

-- Entry: 107
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8544d523-c52d-4a65-a20e-fb9c0f52eeb8', 'JE-000107', '2025-03-27', 'Salary payable for the month of Mar 2025', 'JV-107', 'journal_entry', 445667.00, 445667.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f81b2635-e31b-49cf-8884-fcc90739d9e4', '8544d523-c52d-4a65-a20e-fb9c0f52eeb8', id, 'Salary payable for the month of Mar 2025', 445667.00, 0.00 FROM accounts WHERE account_code = '60001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8551f328-4c75-40bc-8e69-b84feed64749', '8544d523-c52d-4a65-a20e-fb9c0f52eeb8', id, 'Salary payable for the month of Mar 2025', 0.00, 80000.00 FROM accounts WHERE account_code = '20151';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b69bc7be-cf1c-47b4-907d-711993bdd835', '8544d523-c52d-4a65-a20e-fb9c0f52eeb8', id, 'Salary payable for the month of Mar 2025', 0.00, 50600.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bf0e2085-6e18-4607-8784-f408b56dee94', '8544d523-c52d-4a65-a20e-fb9c0f52eeb8', id, 'Salary payable for the month of Mar 2025', 0.00, 50600.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7138f90a-8ea2-46d9-9aed-15e8fb49f793', '8544d523-c52d-4a65-a20e-fb9c0f52eeb8', id, 'Salary payable for the month of Mar 2025', 0.00, 50600.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '87080e37-d377-429a-8fc9-cc01a82a75b5', '8544d523-c52d-4a65-a20e-fb9c0f52eeb8', id, 'Salary payable for the month of Mar 2025', 0.00, 11860.00 FROM accounts WHERE account_code = '20155';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b32a8ffa-a552-41b6-aaab-de17451c6024', '8544d523-c52d-4a65-a20e-fb9c0f52eeb8', id, 'Salary payable for the month of Mar 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ce852f4d-a97e-4b59-84d0-de6252d9517a', '8544d523-c52d-4a65-a20e-fb9c0f52eeb8', id, 'Salary payable for the month of Mar 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ddbf878b-b928-4021-89c8-937d496897db', '8544d523-c52d-4a65-a20e-fb9c0f52eeb8', id, 'Salary payable for the month of Mar 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e5740d5-3964-4436-8375-cb59b49c0f67', '8544d523-c52d-4a65-a20e-fb9c0f52eeb8', id, 'Salary payable for the month of Mar 2025', 0.00, 9900.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '80dc80e6-84ba-4ea0-a410-b84e8c8bb777', '8544d523-c52d-4a65-a20e-fb9c0f52eeb8', id, 'Salary payable for the month of Mar 2025', 0.00, 28100.00 FROM accounts WHERE account_code = '20160';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b99407a1-4ca2-4ec2-a71d-b8873b08fb16', '8544d523-c52d-4a65-a20e-fb9c0f52eeb8', id, 'Salary payable for the month of Mar 2025', 0.00, 28100.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0af7984c-3d7f-4d02-9713-18e0a5f617a0', '8544d523-c52d-4a65-a20e-fb9c0f52eeb8', id, 'Salary payable for the month of Mar 2025', 0.00, 23600.00 FROM accounts WHERE account_code = '20162';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '011bb344-b8a2-46ae-a541-faca3f0084be', '8544d523-c52d-4a65-a20e-fb9c0f52eeb8', id, 'Salary payable for the month of Mar 2025', 0.00, 23600.00 FROM accounts WHERE account_code = '20163';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '56e9dff5-92a2-4c26-a33e-b72cb45c81ea', '8544d523-c52d-4a65-a20e-fb9c0f52eeb8', id, 'Salary payable for the month of Mar 2025', 0.00, 23600.00 FROM accounts WHERE account_code = '20164';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b0b586c6-df8e-443d-9136-bc58121da386', '8544d523-c52d-4a65-a20e-fb9c0f52eeb8', id, 'Salary payable for the month of Mar 2025', 0.00, 14600.00 FROM accounts WHERE account_code = '20165';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7993b7f9-55ab-4174-8d6c-fb8d1cf07d4d', '8544d523-c52d-4a65-a20e-fb9c0f52eeb8', id, 'Salary payable for the month of Mar 2025', 0.00, 29627.00 FROM accounts WHERE account_code = '21100';

-- Entry: 108
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('60b31a61-c08f-4478-88ba-59d407dd7654', 'JE-000108', '2025-04-05', 'Taxi used for the office work', 'JV-108', 'journal_entry', 40.00, 40.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7fd3c585-5f65-49fe-a5cd-1ab88383604a', '60b31a61-c08f-4478-88ba-59d407dd7654', id, 'Taxi used for the office work', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '72fb6865-19ed-4870-ba95-2d136832572c', '60b31a61-c08f-4478-88ba-59d407dd7654', id, 'Taxi used for the office work', 0.00, 40.00 FROM accounts WHERE account_code = '10100';

-- Entry: 109
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9bfd04f4-ca02-4d0a-9028-8a9db1d00f9e', 'JE-000109', '2025-04-05', 'Salary paid for the month of Mar 2025', 'JV-109', 'journal_entry', 416040.00, 416040.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3a4fda9f-c978-4acc-8ad6-bfe83c8c5b89', '9bfd04f4-ca02-4d0a-9028-8a9db1d00f9e', id, 'Salary paid for the month of Mar 2025', 80000.00, 0.00 FROM accounts WHERE account_code = '20151';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '914225ca-1d39-4a05-8c99-670af102ab70', '9bfd04f4-ca02-4d0a-9028-8a9db1d00f9e', id, 'Salary paid for the month of Mar 2025', 50600.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f9b5fcb1-2913-4af7-a52d-9926a56f9580', '9bfd04f4-ca02-4d0a-9028-8a9db1d00f9e', id, 'Salary paid for the month of Mar 2025', 50600.00, 0.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a4f6c064-4590-497e-beeb-dcebe8976b6b', '9bfd04f4-ca02-4d0a-9028-8a9db1d00f9e', id, 'Salary paid for the month of Mar 2025', 50600.00, 0.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '651db055-b947-48ce-86fb-eba19c2acc04', '9bfd04f4-ca02-4d0a-9028-8a9db1d00f9e', id, 'Salary paid for the month of Mar 2025', 11860.00, 0.00 FROM accounts WHERE account_code = '20155';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '51ee1d07-3416-44a5-9af9-0360033b973a', '9bfd04f4-ca02-4d0a-9028-8a9db1d00f9e', id, 'Salary paid for the month of Mar 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a7b1978a-04db-4bab-80f3-9bb6ba9acb98', '9bfd04f4-ca02-4d0a-9028-8a9db1d00f9e', id, 'Salary paid for the month of Mar 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6d687618-7b6b-4ce7-9cd1-cf35370cd146', '9bfd04f4-ca02-4d0a-9028-8a9db1d00f9e', id, 'Salary paid for the month of Mar 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cbc46ce2-ddc3-4d3d-ad54-90b9a7c10b5b', '9bfd04f4-ca02-4d0a-9028-8a9db1d00f9e', id, 'Salary paid for the month of Mar 2025', 9900.00, 0.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '941ce7e4-1a52-468c-9afd-c8a5ecc9c75c', '9bfd04f4-ca02-4d0a-9028-8a9db1d00f9e', id, 'Salary paid for the month of Mar 2025', 28100.00, 0.00 FROM accounts WHERE account_code = '20160';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a0a90423-ff34-4eec-88ff-cc658b544326', '9bfd04f4-ca02-4d0a-9028-8a9db1d00f9e', id, 'Salary paid for the month of Mar 2025', 28100.00, 0.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e5c9d56b-62fe-4a62-9d50-0740fd13b2a1', '9bfd04f4-ca02-4d0a-9028-8a9db1d00f9e', id, 'Salary paid for the month of Mar 2025', 23600.00, 0.00 FROM accounts WHERE account_code = '20162';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '631ea94a-b55e-40c4-97a1-5436cdb98dbc', '9bfd04f4-ca02-4d0a-9028-8a9db1d00f9e', id, 'Salary paid for the month of Mar 2025', 23600.00, 0.00 FROM accounts WHERE account_code = '20163';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd101037e-2e57-43f7-a5a2-6379e044672f', '9bfd04f4-ca02-4d0a-9028-8a9db1d00f9e', id, 'Salary paid for the month of Mar 2025', 23600.00, 0.00 FROM accounts WHERE account_code = '20164';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '91f460da-01c8-47da-9af8-5aa9cef0aaf9', '9bfd04f4-ca02-4d0a-9028-8a9db1d00f9e', id, 'Salary paid for the month of Mar 2025', 14600.00, 0.00 FROM accounts WHERE account_code = '20165';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4ede3424-aa6b-450a-935e-18f9a08b522d', '9bfd04f4-ca02-4d0a-9028-8a9db1d00f9e', id, 'Salary paid for the month of Mar 2025', 0.00, 416040.00 FROM accounts WHERE account_code = '10100';

-- Entry: 110
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cc052fc3-92e9-4234-a7a2-56cbf12e9159', 'JE-000110', '2025-04-05', 'Lunch paid for staff', 'JV-110', 'journal_entry', 400.00, 400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8f84718a-7b0a-4561-aeef-60fb0a8d9972', 'cc052fc3-92e9-4234-a7a2-56cbf12e9159', id, 'Lunch paid for staff', 400.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bea2d7df-388b-4a8d-ba19-29abaa524d08', 'cc052fc3-92e9-4234-a7a2-56cbf12e9159', id, 'Lunch paid for staff', 0.00, 400.00 FROM accounts WHERE account_code = '10100';

-- Entry: 111
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f24eaf69-857b-4b51-ac59-9c9679f4b20b', 'JE-000111', '2025-04-05', 'Paid for water used for house', 'JV-111', 'journal_entry', 800.00, 800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '51ff088a-beee-495e-ba84-3cc692f8016f', 'f24eaf69-857b-4b51-ac59-9c9679f4b20b', id, 'Paid for water used for house', 800.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '09e51b2a-8af0-47f0-bf24-294c52c6838b', 'f24eaf69-857b-4b51-ac59-9c9679f4b20b', id, 'Paid for water used for house', 0.00, 800.00 FROM accounts WHERE account_code = '10100';

-- Entry: 112
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('53825a4a-29d0-4c4d-9985-94b9d0a7018a', 'JE-000112', '2025-04-06', 'Paid for staff lunch', 'JV-112', 'journal_entry', 340.00, 340.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8864a2a4-3d95-4f0c-85bf-69b4be092419', '53825a4a-29d0-4c4d-9985-94b9d0a7018a', id, 'Paid for staff lunch', 340.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ab716cf5-381a-4976-9556-119ba8bd3c37', '53825a4a-29d0-4c4d-9985-94b9d0a7018a', id, 'Paid for staff lunch', 0.00, 340.00 FROM accounts WHERE account_code = '10100';

-- Entry: 113
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7d2705af-b0a2-4056-9d6c-aa62a71663b4', 'JE-000113', '2025-04-06', 'Paid for staff lunch', 'JV-113', 'journal_entry', 920.00, 920.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bceb25b1-1739-4276-82d7-07a945c5581b', '7d2705af-b0a2-4056-9d6c-aa62a71663b4', id, 'Paid for staff lunch', 790.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '90e43205-f8ec-43de-8c30-1ab3d2ef1cb1', '7d2705af-b0a2-4056-9d6c-aa62a71663b4', id, 'Paid for staff lunch', 130.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '06590012-8be5-46e7-866a-edc651be56cc', '7d2705af-b0a2-4056-9d6c-aa62a71663b4', id, 'Paid for dish washing liquid and lunch', 0.00, 920.00 FROM accounts WHERE account_code = '10100';

-- Entry: 114
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('becfc7ce-087b-43f9-b8c7-029f5be05d74', 'JE-000114', '2025-04-07', 'Paid for 13 job announcements on ACBAR website', 'JV-114', 'journal_entry', 13500.00, 13500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '29cff456-86e9-431f-a38d-ca4605364d5d', 'becfc7ce-087b-43f9-b8c7-029f5be05d74', id, 'Paid for 13 job announcements on ACBAR website', 13500.00, 0.00 FROM accounts WHERE account_code = '61605';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bdc04e21-a3ae-41d6-80aa-71cd9b673b9c', 'becfc7ce-087b-43f9-b8c7-029f5be05d74', id, 'Paid for 13 job announcements on ACBAR website', 0.00, 13500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 115
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1ffcb542-57dd-4701-92e6-dd5835771593', 'JE-000115', '2025-04-07', 'Paid for staff lunch', 'JV-115', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '86e85ed5-2b82-45f9-9815-f6833c84cd64', '1ffcb542-57dd-4701-92e6-dd5835771593', id, 'Paid for staff lunch', 500.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f3fbe680-59bc-4f41-a952-4c629861f6e1', '1ffcb542-57dd-4701-92e6-dd5835771593', id, 'Paid for staff lunch', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 116
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6e2a922b-18a4-4e2d-a07f-6f69ad0a8f08', 'JE-000116', '2025-04-08', 'Paid for staff lunch expenses', 'JV-116', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bc8d6522-df01-48f8-b977-f92653375c26', '6e2a922b-18a4-4e2d-a07f-6f69ad0a8f08', id, 'Paid for staff lunch expenses', 150.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '251648c9-db5f-4d2f-9794-f078698355e9', '6e2a922b-18a4-4e2d-a07f-6f69ad0a8f08', id, 'Paid for staff lunch expenses', 0.00, 150.00 FROM accounts WHERE account_code = '10100';

-- Entry: 117
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f63e7b1d-c316-495b-bf60-6503fc218686', 'JE-000117', '2025-04-08', 'Paid for taxi charges', 'JV-117', 'journal_entry', 40.00, 40.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3c48253a-e069-4372-8bf7-77c8f31c7b94', 'f63e7b1d-c316-495b-bf60-6503fc218686', id, 'Paid for taxi charges', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '657de884-317e-4877-a944-9e5e9406ca38', 'f63e7b1d-c316-495b-bf60-6503fc218686', id, 'Paid for taxi charges', 0.00, 40.00 FROM accounts WHERE account_code = '10100';

-- Entry: 118
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('92c5ce94-bf81-465a-8a72-123267945106', 'JE-000118', '2025-04-09', 'Paid for staff lunch', 'JV-118', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '940bad6c-2687-4aa7-9fc0-d0eb3f0fbe00', '92c5ce94-bf81-465a-8a72-123267945106', id, 'Paid for staff lunch', 100.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3a3980d4-7e4f-4337-a0f5-9c9d77724a42', '92c5ce94-bf81-465a-8a72-123267945106', id, 'Paid for staff lunch', 0.00, 100.00 FROM accounts WHERE account_code = '10100';

-- Entry: 119
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a1ea586f-ddb3-4ca7-8d6a-e68cc7b86e4e', 'JE-000119', '2025-04-09', 'taxi use for the office work', 'JV-119', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8a941682-2180-4006-a34d-a5c63a846ddc', 'a1ea586f-ddb3-4ca7-8d6a-e68cc7b86e4e', id, 'taxi use for the office work', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '46727155-e34c-4f3e-a555-5e2dd4568274', 'a1ea586f-ddb3-4ca7-8d6a-e68cc7b86e4e', id, 'taxi use for the office work', 0.00, 100.00 FROM accounts WHERE account_code = '10100';

-- Entry: 120
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bfae1df7-1991-415c-b81c-6ad54a9a9391', 'JE-000120', '2025-04-10', 'Paid for staff lunch', 'JV-120', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bf549483-0db1-4149-97b3-c11fe923685a', 'bfae1df7-1991-415c-b81c-6ad54a9a9391', id, 'Paid for staff lunch', 150.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a7acd971-f5cc-4f77-9b84-0038c5dd8270', 'bfae1df7-1991-415c-b81c-6ad54a9a9391', id, 'Paid for staff lunch', 0.00, 150.00 FROM accounts WHERE account_code = '10100';

-- Entry: 121
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5854b095-7357-478b-868d-7cb50648405a', 'JE-000121', '2025-04-10', 'Paid for taxi charges.', 'JV-121', 'journal_entry', 40.00, 40.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a25dd47e-1678-4586-8ed6-5b04412f3c8d', '5854b095-7357-478b-868d-7cb50648405a', id, 'Paid for taxi charges.', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '90e0e122-1f83-4400-992d-bcf0831d0213', '5854b095-7357-478b-868d-7cb50648405a', id, 'Paid for taxi charges.', 0.00, 40.00 FROM accounts WHERE account_code = '10100';

-- Entry: 122
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6fc0fb6f-4e91-4dc8-8eb9-37fe1bd06bbb', 'JE-000122', '2025-04-12', 'Paid for lunch expens', 'JV-122', 'journal_entry', 450.00, 450.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cb220cd4-4144-48cc-9c06-58baaca1aa2a', '6fc0fb6f-4e91-4dc8-8eb9-37fe1bd06bbb', id, 'Paid for lunch expens', 450.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1641c3eb-b8e4-4033-a255-598d4cd9a4af', '6fc0fb6f-4e91-4dc8-8eb9-37fe1bd06bbb', id, 'Paid for lunch expens', 0.00, 450.00 FROM accounts WHERE account_code = '10100';

-- Entry: 123
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a598c50d-6148-4216-9498-898f2aa864df', 'JE-000123', '2025-04-12', 'Paid for electricity expenses for the month of Dalwa 1403', 'JV-123', 'journal_entry', 4334.00, 4334.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0769ce0f-566d-4862-b895-0ce7e5f7638c', 'a598c50d-6148-4216-9498-898f2aa864df', id, 'Paid for electricity expenses for the month of Dalwa 1403', 4334.00, 0.00 FROM accounts WHERE account_code = '61101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b7b95b85-db51-46b8-9feb-b0a63c397864', 'a598c50d-6148-4216-9498-898f2aa864df', id, 'Paid for electricity expenses for the month of Dalwa 1403', 0.00, 4334.00 FROM accounts WHERE account_code = '10100';

-- Entry: 124
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a25d0b89-1c03-45e4-b87a-ccdc76741859', 'JE-000124', '2025-04-12', 'Paid for staff lunch expense', 'JV-124', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3808961b-2ccf-49fa-9057-919dbd69126b', 'a25d0b89-1c03-45e4-b87a-ccdc76741859', id, 'Paid for staff lunch expense', 100.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5be77e02-c0c6-4bee-bdc2-a0561077e925', 'a25d0b89-1c03-45e4-b87a-ccdc76741859', id, 'Paid for staff lunch expense', 0.00, 100.00 FROM accounts WHERE account_code = '10100';

-- Entry: 125
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('762fcacc-8f55-4b89-b37c-4b00859bcf49', 'JE-000125', '2025-04-12', 'Taxi used for the office work', 'JV-125', 'journal_entry', 50.00, 50.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9d6c9b89-6d75-4d3f-a254-de18de7083db', '762fcacc-8f55-4b89-b37c-4b00859bcf49', id, 'Taxi used for the office work', 50.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3c08b38b-f997-4bea-8871-d47dc7049f50', '762fcacc-8f55-4b89-b37c-4b00859bcf49', id, 'Taxi used for the office work', 0.00, 50.00 FROM accounts WHERE account_code = '10100';

-- Entry: 126
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('eee17968-0afb-44d7-ae44-5cb561f75b04', 'JE-000126', '2025-04-12', 'Taxi used for the office work', 'JV-126', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e7bce717-e09c-4e06-8a7c-e15f9709ffbd', 'eee17968-0afb-44d7-ae44-5cb561f75b04', id, 'Taxi used for the office work', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a4764ae3-6e46-41b6-9a35-fa6b10b957ac', 'eee17968-0afb-44d7-ae44-5cb561f75b04', id, 'Taxi used for the office work', 0.00, 100.00 FROM accounts WHERE account_code = '10100';

-- Entry: 127
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('107c170a-44a0-4024-9ed0-fd2be848f5da', 'JE-000127', '2025-04-14', 'Paid for lunch expense', 'JV-127', 'journal_entry', 60.00, 60.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '98cb1f8f-ab0d-4b7b-93c9-6d106ed0e400', '107c170a-44a0-4024-9ed0-fd2be848f5da', id, 'Paid for lunch expense', 60.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b09d3965-b450-4295-b184-fec8100313c8', '107c170a-44a0-4024-9ed0-fd2be848f5da', id, 'Paid for lunch expense', 0.00, 60.00 FROM accounts WHERE account_code = '10100';

-- Entry: 128
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('87f6d644-77c0-4c41-a176-1261fd590739', 'JE-000128', '2025-04-14', 'Taxi used by Musafer for the office work', 'JV-128', 'journal_entry', 140.00, 140.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '43d33610-e8ed-4cad-8eaa-a46c844eb2c7', '87f6d644-77c0-4c41-a176-1261fd590739', id, 'Taxi used by Musafer for the office work', 140.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5ca249af-be64-44b2-97cd-3ddfd9e91d3f', '87f6d644-77c0-4c41-a176-1261fd590739', id, 'Taxi used by Musafer for the office work', 0.00, 140.00 FROM accounts WHERE account_code = '10100';

-- Entry: 129
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d91958b2-f161-49f6-9728-f3571c2ec004', 'JE-000129', '2025-04-14', 'Purchase of macaroni for lunch', 'JV-129', 'journal_entry', 60.00, 60.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '095361c0-9c59-428e-b521-5e3b1943a70c', 'd91958b2-f161-49f6-9728-f3571c2ec004', id, 'Purchase of macaroni for lunch', 60.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1a96dd0d-58ee-4e10-91a9-85d674b5910d', 'd91958b2-f161-49f6-9728-f3571c2ec004', id, 'Purchase of macaroni for lunch', 0.00, 60.00 FROM accounts WHERE account_code = '10100';

-- Entry: 130
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b5259490-c463-4ef0-a721-a2dfc1a09a08', 'JE-000130', '2025-04-14', 'Food expense for the staff lunch', 'JV-130', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '84555fec-f20c-4d1b-9ea4-ade1d7e7efd9', 'b5259490-c463-4ef0-a721-a2dfc1a09a08', id, 'Food expense for the staff lunch', 150.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3311c875-6d3f-485c-8069-37de2edf04ff', 'b5259490-c463-4ef0-a721-a2dfc1a09a08', id, 'Food expense for the staff lunch', 0.00, 150.00 FROM accounts WHERE account_code = '10100';

-- Entry: 131
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e66e158a-8182-4840-ba28-f693bf2e2e10', 'JE-000131', '2025-04-15', 'Purchase of stationery', 'JV-131', 'journal_entry', 4080.00, 4080.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'db02748e-dd2d-4a72-8b8e-f768a0dd4032', 'e66e158a-8182-4840-ba28-f693bf2e2e10', id, 'Purchase of stationery', 3980.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '365ba751-f3d4-403d-94ab-9929f7b8e507', 'e66e158a-8182-4840-ba28-f693bf2e2e10', id, 'Paid for taxi charges', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a6fd1df4-7e99-4637-893b-d455e844c45d', 'e66e158a-8182-4840-ba28-f693bf2e2e10', id, 'Purchase of stationery and Paid for taxi charges', 0.00, 4080.00 FROM accounts WHERE account_code = '10100';

-- Entry: 132
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c19e2a3f-ba9f-45a6-92dc-e2b09a7c0ffa', 'JE-000132', '2025-04-15', 'Paid for painting of COO''s room', 'JV-132', 'journal_entry', 9990.00, 9990.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '677e4b74-ccba-4898-88c0-5a2447405eff', 'c19e2a3f-ba9f-45a6-92dc-e2b09a7c0ffa', id, 'Paid for painting of COO''s room', 9990.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'de6041b3-c25b-44a3-bfbe-a852645113e5', 'c19e2a3f-ba9f-45a6-92dc-e2b09a7c0ffa', id, 'Paid for painting of COO''s room', 0.00, 9990.00 FROM accounts WHERE account_code = '10100';

-- Entry: 133
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('77da044a-f990-47b5-b322-700ba176460c', 'JE-000133', '2025-04-16', 'Paid for purchase of vegetable for lunch', 'JV-133', 'journal_entry', 170.00, 170.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '85fcc06c-3fb0-444d-873b-0539f075a14c', '77da044a-f990-47b5-b322-700ba176460c', id, 'Paid for purchase of vegetable for lunch', 170.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'faffc6ca-ea10-4398-a925-e47a33f62cc5', '77da044a-f990-47b5-b322-700ba176460c', id, 'Paid for purchase of vegetable for lunch', 0.00, 170.00 FROM accounts WHERE account_code = '10100';

-- Entry: 134
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b86e6caf-d0f7-48b0-a497-6b51d0d5a4b3', 'JE-000134', '2025-04-19', 'Paid for stall lunch expense', 'JV-134', 'journal_entry', 660.00, 660.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f2b9fae0-ada5-43c1-bae4-f52137433ee6', 'b86e6caf-d0f7-48b0-a497-6b51d0d5a4b3', id, 'Paid for stall lunch expense', 660.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '69bf1dfe-5e6a-480a-8f75-a7a55e76e58e', 'b86e6caf-d0f7-48b0-a497-6b51d0d5a4b3', id, 'Paid for stall lunch expense', 0.00, 660.00 FROM accounts WHERE account_code = '10100';

-- Entry: 135
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ace52e4d-b47e-4994-bc8d-823451bed316', 'JE-000135', '2025-04-19', 'Paid for drinking water', 'JV-135', 'journal_entry', 60.00, 60.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '69d8f789-38f7-40d9-be4b-1cc4b71d5cbd', 'ace52e4d-b47e-4994-bc8d-823451bed316', id, 'Paid for drinking water', 60.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f99636a9-c495-4430-92cb-855d1389609c', 'ace52e4d-b47e-4994-bc8d-823451bed316', id, 'Paid for drinking water', 0.00, 60.00 FROM accounts WHERE account_code = '10100';

-- Entry: 136
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('66655ddf-4364-4247-a5fb-316b0a358716', 'JE-000136', '2025-04-20', 'Paid for lunch expenses', 'JV-136', 'journal_entry', 770.00, 770.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1af615f9-8104-407a-a1c7-6563375f75d9', '66655ddf-4364-4247-a5fb-316b0a358716', id, 'Paid for lunch expenses', 770.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fb7f4acf-e1de-444a-b07c-0ceb9c43361a', '66655ddf-4364-4247-a5fb-316b0a358716', id, 'Paid for lunch expenses', 0.00, 770.00 FROM accounts WHERE account_code = '10100';

-- Entry: 137
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ea27b2f2-f299-4560-b880-7bd49413df2e', 'JE-000137', '2025-04-20', 'Purchase of one tanker water for house', 'JV-137', 'journal_entry', 890.00, 890.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4ef4f1d6-094f-45fb-b83f-ae55676a5987', 'ea27b2f2-f299-4560-b880-7bd49413df2e', id, 'Purchase of one tanker water for house', 800.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1eab9853-044e-4b43-b1c4-450e94d62834', 'ea27b2f2-f299-4560-b880-7bd49413df2e', id, 'Taxi used for the office work', 90.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '02ab9319-3753-49f5-a608-cc7739ae7663', 'ea27b2f2-f299-4560-b880-7bd49413df2e', id, 'Taxi used for the office work', 0.00, 890.00 FROM accounts WHERE account_code = '10100';

-- Entry: 138
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('45288618-9709-433e-88c5-dfb43757ceaa', 'JE-000138', '2025-04-20', 'Car fuel used for CEO transportation', 'JV-138', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6bce62ec-2415-483c-9106-a922a3635a47', '45288618-9709-433e-88c5-dfb43757ceaa', id, 'Car fuel used for CEO transportation', 500.00, 0.00 FROM accounts WHERE account_code = '60901';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '94f1909e-f3a1-4864-bf69-b3ed7be7cc52', '45288618-9709-433e-88c5-dfb43757ceaa', id, 'Car fuel used for CEO transportation', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 139
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a8844c22-4ba3-4094-8d99-8af0e140d1b1', 'JE-000139', '2025-04-20', 'House Rent prepaid for the months of Hamal and Sawr 1404', 'JV-139', 'journal_entry', 60000.00, 60000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ab70357c-b80a-4525-9ee7-463d583917aa', 'a8844c22-4ba3-4094-8d99-8af0e140d1b1', id, 'House Rent prepaid for the months of Hamal and Sawr 1404', 60000.00, 0.00 FROM accounts WHERE account_code = '13100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a7e69e14-709b-45a5-a29a-fcebc014c37e', 'a8844c22-4ba3-4094-8d99-8af0e140d1b1', id, 'House Rent prepaid for the months of Hamal and Sawr 1404', 0.00, 60000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 140
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('eed48f44-9d03-4bda-87cd-79abda0d307a', 'JE-000140', '2025-04-20', 'House Rent prepaid for the month of Hamal 1404', 'JV-140', 'journal_entry', 33000.00, 33000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '41e94b2d-f18f-401d-baea-aef053e5616b', 'eed48f44-9d03-4bda-87cd-79abda0d307a', id, 'House Rent prepaid for the month of Hamal 1404', 33000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '234cc849-e18b-4841-84d0-cc3331e64267', 'eed48f44-9d03-4bda-87cd-79abda0d307a', id, 'House Rent tax withheld the month of Hamal 1404', 0.00, 3000.00 FROM accounts WHERE account_code = '21200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1a507f76-6bc1-4f28-885f-8b94c78b41bb', 'eed48f44-9d03-4bda-87cd-79abda0d307a', id, 'House Rent tax withheld the month of Hamal 1404', 0.00, 30000.00 FROM accounts WHERE account_code = '13100';

-- Entry: 141
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5421bd3e-f7fb-4980-b6d1-25c5955ba4cb', 'JE-000141', '2025-04-21', 'Taxi used by the CFO to MTO for tax matter', 'JV-141', 'journal_entry', 1200.00, 1200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '56ca52c5-67fd-4479-bb12-06e338c20b99', '5421bd3e-f7fb-4980-b6d1-25c5955ba4cb', id, 'Taxi used by the CFO to MTO for tax matter', 530.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cb737117-befc-4bbb-a3ba-214685c05d7d', '5421bd3e-f7fb-4980-b6d1-25c5955ba4cb', id, 'Taxi used by the CFO to MTO for tax matter', 0.00, 530.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3d5e138f-a11b-49ab-b4b2-a05679264bdf', '5421bd3e-f7fb-4980-b6d1-25c5955ba4cb', id, 'Paid for staff lunch', 280.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2197e27c-c92b-45eb-ac05-5afa12c683d8', '5421bd3e-f7fb-4980-b6d1-25c5955ba4cb', id, 'Paid for staff chocolate', 300.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd8590230-2dde-48f5-a71f-ce4c7874bc00', '5421bd3e-f7fb-4980-b6d1-25c5955ba4cb', id, 'Taxi used for the office work', 90.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b1599847-7185-45b9-822e-d90d9168191a', '5421bd3e-f7fb-4980-b6d1-25c5955ba4cb', id, 'Taxi used for the office work and lunch', 0.00, 670.00 FROM accounts WHERE account_code = '10100';

-- Entry: 142
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7ed2c22f-e8fa-4dca-ad57-18630eebbc3c', 'JE-000142', '2025-04-22', 'Food expense for lunch', 'JV-142', 'journal_entry', 130.00, 130.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4c8775a7-838c-4c8a-97a2-489a0d24035f', '7ed2c22f-e8fa-4dca-ad57-18630eebbc3c', id, 'Food expense for lunch', 130.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a1b220e8-8908-4f7d-91ef-4c61871e24db', '7ed2c22f-e8fa-4dca-ad57-18630eebbc3c', id, 'Food expense for lunch', 0.00, 130.00 FROM accounts WHERE account_code = '10100';

-- Entry: 143
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9dd5e5ac-fe5b-4b21-aa32-ba2bb1d98455', 'JE-000143', '2025-04-23', 'Car fuel used for CEO transportation', 'JV-143', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7fefc8cb-45b4-4863-89c5-f121577c9f1b', '9dd5e5ac-fe5b-4b21-aa32-ba2bb1d98455', id, 'Car fuel used for CEO transportation', 500.00, 0.00 FROM accounts WHERE account_code = '60901';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '05cb7bfc-fd97-48ac-851f-d36fc58c99e1', '9dd5e5ac-fe5b-4b21-aa32-ba2bb1d98455', id, 'Car fuel used for CEO transportation', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 144
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4fb0de10-cc6c-4196-95ef-eeb46da98d08', 'JE-000144', '2025-04-23', 'Food expense for lunch', 'JV-144', 'journal_entry', 190.00, 190.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'da0831b2-826c-4dea-ae0f-acaf20d63bf1', '4fb0de10-cc6c-4196-95ef-eeb46da98d08', id, 'Food expense for lunch', 100.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '94ab7bc4-2796-4573-984b-46e51e16da7a', '4fb0de10-cc6c-4196-95ef-eeb46da98d08', id, 'Taxi used for the office work', 90.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '68c06ce9-dd83-4ce2-8435-528c71c2bc0e', '4fb0de10-cc6c-4196-95ef-eeb46da98d08', id, 'Food expense for lunch and taxi', 0.00, 190.00 FROM accounts WHERE account_code = '10100';

-- Entry: 145
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7181e8b8-936a-4300-9a06-53eaa4c95155', 'JE-000145', '2025-04-24', 'Paid BOS member''s breackfast', 'JV-145', 'journal_entry', 350.00, 350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0acc1160-495b-42e4-9aa4-48243511f20d', '7181e8b8-936a-4300-9a06-53eaa4c95155', id, 'Paid BOS member''s breackfast', 350.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cd169866-0bef-48bf-a00d-ffe62dc92285', '7181e8b8-936a-4300-9a06-53eaa4c95155', id, 'Paid BOS member''s breackfast', 0.00, 350.00 FROM accounts WHERE account_code = '10100';

-- Entry: 146
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7c9a29bb-4ea0-4e5e-8f5d-810b2338e4af', 'JE-000146', '2025-04-26', 'Paid for food item for staff lunch', 'JV-146', 'journal_entry', 1040.00, 1040.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fdc92e9b-5606-476c-9d4f-9435469301f9', '7c9a29bb-4ea0-4e5e-8f5d-810b2338e4af', id, 'Paid for food item for staff lunch', 990.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c988659f-da34-424d-8329-90658592dad9', '7c9a29bb-4ea0-4e5e-8f5d-810b2338e4af', id, 'Paid for drinking water', 50.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'db7bbff7-03a7-4c75-a59a-4f5086d96353', '7c9a29bb-4ea0-4e5e-8f5d-810b2338e4af', id, 'Paid for drinking water and lunch', 0.00, 1040.00 FROM accounts WHERE account_code = '10100';

-- Entry: 147
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2195f227-02df-4559-b41b-6a0565599876', 'JE-000147', '2025-04-27', 'Food expense made for the day', 'JV-147', 'journal_entry', 690.00, 690.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '45f059d7-7f14-47cb-850b-15d731b434ec', '2195f227-02df-4559-b41b-6a0565599876', id, 'Food expense made for the day', 690.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5b13b6df-dc70-427a-ad5b-1a2924c9df4d', '2195f227-02df-4559-b41b-6a0565599876', id, 'Food expense made for the day', 0.00, 690.00 FROM accounts WHERE account_code = '10100';

-- Entry: 148
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('457b7f46-0770-43d2-95a2-a036ddb5020a', 'JE-000148', '2025-04-27', 'Paid for Gurad''s food expense old bill', 'JV-148', 'journal_entry', 80.00, 80.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ee13d6e1-d911-4b5b-83fc-d1aa8b8336e9', '457b7f46-0770-43d2-95a2-a036ddb5020a', id, 'Paid for Gurad''s food expense old bill', 80.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4b735b2a-3756-4234-8a56-5deb455fce9e', '457b7f46-0770-43d2-95a2-a036ddb5020a', id, 'Paid for Gurad''s food expense old bill', 0.00, 80.00 FROM accounts WHERE account_code = '10100';

-- Entry: 149
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a73f6803-bef1-4fe3-a1bc-7f98a84da214', 'JE-000149', '2025-04-28', 'Paid for food item for lunch', 'JV-149', 'journal_entry', 180.00, 180.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e13cfd1-3e38-463d-98c0-692b6debb4f3', 'a73f6803-bef1-4fe3-a1bc-7f98a84da214', id, 'Paid for food item for lunch', 120.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0c587dc8-8096-42b5-bf4f-ca07b3f99a43', 'a73f6803-bef1-4fe3-a1bc-7f98a84da214', id, 'Paid for drinking water=', 60.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '470b59a8-0dd7-4e59-a3c5-887ebde9611e', 'a73f6803-bef1-4fe3-a1bc-7f98a84da214', id, 'Paid for drinking water and lunch', 0.00, 180.00 FROM accounts WHERE account_code = '10100';

-- Entry: 150
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5340665f-c0ad-4497-96e4-a4d53edad61f', 'JE-000150', '2025-04-28', 'Advance paid to COO for kunduz travel', 'JV-150', 'journal_entry', 3000.00, 3000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1948f871-081a-4b45-a862-1e44af9f7d95', '5340665f-c0ad-4497-96e4-a4d53edad61f', id, 'Advance paid to COO for kunduz travel', 3000.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '231c1c5d-e654-4823-8e49-908d54d36a8d', '5340665f-c0ad-4497-96e4-a4d53edad61f', id, 'Advance paid to COO for kunduz travel', 0.00, 3000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 151
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e8da85b8-ca09-49a9-a7ec-bad6a404d1af', 'JE-000151', '2025-04-29', 'Paid for car fuel', 'JV-151', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '41b0d427-6e59-4ac4-8939-85c43b7aaab0', 'e8da85b8-ca09-49a9-a7ec-bad6a404d1af', id, 'Paid for car fuel', 500.00, 0.00 FROM accounts WHERE account_code = '60901';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '120594f0-c869-4465-9ed6-0a365c579f8e', 'e8da85b8-ca09-49a9-a7ec-bad6a404d1af', id, 'Paid for car fuel', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 152
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7d013837-57a6-4c0b-b164-3dd678f6a270', 'JE-000152', '2025-04-29', 'Paid for food item for lunch', 'JV-152', 'journal_entry', 210.00, 210.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd57351c1-222c-4b24-b7e0-240d167c9393', '7d013837-57a6-4c0b-b164-3dd678f6a270', id, 'Paid for food item for lunch', 210.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '03241cff-ed21-4759-b412-bf6de11ab0a8', '7d013837-57a6-4c0b-b164-3dd678f6a270', id, 'Paid for food item for lunch', 0.00, 210.00 FROM accounts WHERE account_code = '10100';

-- Entry: 153
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a3cd53de-5bdb-40f4-acdf-582c3efc4c5a', 'JE-000153', '2025-04-30', 'Paid for food item for lunch', 'JV-153', 'journal_entry', 13562.22, 13562.22, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0d966878-9ef0-46c5-a399-9a9437f6810f', 'a3cd53de-5bdb-40f4-acdf-582c3efc4c5a', id, 'Paid for food item for lunch', 390.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1eee6500-7081-4e31-aef8-fdfb09f35ea1', 'a3cd53de-5bdb-40f4-acdf-582c3efc4c5a', id, 'Paid for food item for lunch', 0.00, 390.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bb76ce04-684a-428b-ac7d-b34f02c8c37d', 'a3cd53de-5bdb-40f4-acdf-582c3efc4c5a', id, 'Depreciation expense charged for the month of April 2025', 13172.22, 0.00 FROM accounts WHERE account_code = '61900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3165838b-301d-4eb6-9f4d-c11eee539c27', 'a3cd53de-5bdb-40f4-acdf-582c3efc4c5a', id, 'Depreciation expense charged for the month of April 2025', 0.00, 4033.88 FROM accounts WHERE account_code = '17202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e1817d8b-fa90-4862-8343-318a31083a89', 'a3cd53de-5bdb-40f4-acdf-582c3efc4c5a', id, 'Depreciation expense charged for the month of April 2025', 0.00, 6857.04 FROM accounts WHERE account_code = '17302';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3b2db979-13d0-4219-87fe-d4a6b8e585a9', 'a3cd53de-5bdb-40f4-acdf-582c3efc4c5a', id, 'Depreciation expense charged for the month of April 2025', 0.00, 2281.30 FROM accounts WHERE account_code = '17102';

-- Entry: 154
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b2cd506d-26f6-4961-9771-6cfc60744092', 'JE-000154', '2025-04-30', 'Salary payable for the month of Apr 2025', 'JV-154', 'journal_entry', 385667.00, 385667.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '171b51fb-5935-4eaa-87aa-4bec08ff7a56', 'b2cd506d-26f6-4961-9771-6cfc60744092', id, 'Salary payable for the month of Apr 2025', 385667.00, 0.00 FROM accounts WHERE account_code = '60001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b33458f8-db41-473c-918a-31efb66001fb', 'b2cd506d-26f6-4961-9771-6cfc60744092', id, 'Salary payable for the month of Apr 2025', 0.00, 80000.00 FROM accounts WHERE account_code = '20151';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dcbe698f-6b4e-4f13-9b67-6525f3299964', 'b2cd506d-26f6-4961-9771-6cfc60744092', id, 'Salary payable for the month of Apr 2025', 0.00, 50600.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6d2b4f2c-fbde-4082-bf17-a0000c029654', 'b2cd506d-26f6-4961-9771-6cfc60744092', id, 'Salary payable for the month of Apr 2025', 0.00, 50600.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b89c688d-db79-4372-833e-cf0616d11496', 'b2cd506d-26f6-4961-9771-6cfc60744092', id, 'Salary payable for the month of Apr 2025', 0.00, 50600.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd811f212-2d6e-44ff-abc7-47d19b46c34a', 'b2cd506d-26f6-4961-9771-6cfc60744092', id, 'Salary payable for the month of Apr 2025', 0.00, 11860.00 FROM accounts WHERE account_code = '20155';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fa944a97-f65b-4efb-9ec5-b42a60227af8', 'b2cd506d-26f6-4961-9771-6cfc60744092', id, 'Salary payable for the month of Apr 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e09325b9-7838-4c18-a6f1-d1567217e4e9', 'b2cd506d-26f6-4961-9771-6cfc60744092', id, 'Salary payable for the month of Apr 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'da8a690b-3000-42ca-93f4-7656bdb05541', 'b2cd506d-26f6-4961-9771-6cfc60744092', id, 'Salary payable for the month of Apr 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'af313982-1d5d-4f51-8533-8c140686ba08', 'b2cd506d-26f6-4961-9771-6cfc60744092', id, 'Salary payable for the month of Apr 2025', 0.00, 9900.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c3a3042f-0feb-4d33-a3dd-efa1e2ccfce2', 'b2cd506d-26f6-4961-9771-6cfc60744092', id, 'Salary payable for the month of Apr 2025', 0.00, 28100.00 FROM accounts WHERE account_code = '20160';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '83797a93-7811-43dc-b722-ab5bf664220a', 'b2cd506d-26f6-4961-9771-6cfc60744092', id, 'Salary payable for the month of Apr 2025', 0.00, 28100.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '432ae278-04e3-47b4-baa0-687946aedc09', 'b2cd506d-26f6-4961-9771-6cfc60744092', id, 'Salary payable for the month of Apr 2025', 0.00, 28100.00 FROM accounts WHERE account_code = '20165';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '08411642-1f35-461a-b576-a44ff320bfac', 'b2cd506d-26f6-4961-9771-6cfc60744092', id, 'Salary payable for the month of Apr 2025', 0.00, 26927.00 FROM accounts WHERE account_code = '21100';

-- Entry: 155
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('36081df9-4e9a-4af5-ad4a-b106e37352c4', 'JE-000155', '2025-05-01', 'Paid for staff food expense', 'JV-155', 'journal_entry', 70.00, 70.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c969cf79-481c-4412-b489-74e3acb7124e', '36081df9-4e9a-4af5-ad4a-b106e37352c4', id, 'Paid for staff food expense', 70.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '46f93967-6122-4980-ba35-fc4f05ed0508', '36081df9-4e9a-4af5-ad4a-b106e37352c4', id, 'Paid for staff food expense', 0.00, 70.00 FROM accounts WHERE account_code = '10100';

-- Entry: 156
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7265e1ca-b3e6-4bd8-a0c7-f92771aa60a2', 'JE-000156', '2025-05-01', 'Purchased 4 Bajaj Rkshaw 200 CC (1 Syllander Engine) Modal 2022 for Qard Ul Hasana', 'JV-156', 'journal_entry', 860766.01, 860766.01, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '934a6720-04de-445f-9c18-c3989c86af30', '7265e1ca-b3e6-4bd8-a0c7-f92771aa60a2', id, 'Purchased 4 Bajaj Rkshaw 200 CC (1 Syllander Engine) Modal 2022 for Qard Ul Hasana', 860766.01, 0.00 FROM accounts WHERE account_code = '12200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e562fbb9-c7af-44b0-9637-66a81942463f', '7265e1ca-b3e6-4bd8-a0c7-f92771aa60a2', id, 'Purchased 4 Bajaj Rkshaw 200 CC (1 Syllander Engine) Modal 2022 for Qard Ul Hasana', 0.00, 860766.01 FROM accounts WHERE account_code = '10100';

-- Entry: 157
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ccad9288-2c86-49b3-83ca-e2211973297a', 'JE-000157', '2025-05-01', 'Purchased Toyota Crolla (4 Syllander Engine) Model 1994 Grean Color', 'JV-157', 'journal_entry', 345600.00, 345600.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eb241791-b63a-4f49-bc7d-e641c2cf32ce', 'ccad9288-2c86-49b3-83ca-e2211973297a', id, 'Purchased Toyota Crolla (4 Syllander Engine) Model 1994 Grean Color', 345600.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '41664b36-6856-4861-9213-d4fa98a1d0bc', 'ccad9288-2c86-49b3-83ca-e2211973297a', id, 'Purchased Toyota Crolla (4 Syllander Engine) Model 1994 Grean Color', 0.00, 345600.00 FROM accounts WHERE account_code = '10100';

-- Entry: 158
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6149a6db-6fb0-47c4-bf9b-4124dbf95c20', 'JE-000158', '2025-05-03', 'Paid for staff lunch expesnes', 'JV-158', 'journal_entry', 560.00, 560.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '81e35682-aab9-46e5-9450-7e937021ff2d', '6149a6db-6fb0-47c4-bf9b-4124dbf95c20', id, 'Paid for staff lunch expesnes', 110.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '56f1cd62-6611-4f7a-b4fb-78cedff78e79', '6149a6db-6fb0-47c4-bf9b-4124dbf95c20', id, 'Purchase small batteries', 20.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9faa7360-3b8c-4720-86f0-c2d7ab48a4fd', '6149a6db-6fb0-47c4-bf9b-4124dbf95c20', id, 'Taxi used for collecting quotations', 330.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '261c1dec-62dc-4dc9-b451-fd9ab396c553', '6149a6db-6fb0-47c4-bf9b-4124dbf95c20', id, 'Paid to Musafer for lunch during quotation collection', 100.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '488e4b23-d308-4087-9817-5b3aec009b14', '6149a6db-6fb0-47c4-bf9b-4124dbf95c20', id, 'Purchase small batteries and lunch expenses', 0.00, 560.00 FROM accounts WHERE account_code = '10100';

-- Entry: LCI001
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2c7e9810-b6bc-4561-9e17-b6c0dc09becc', 'JE-000159', '2025-05-04', 'Qard Ul Hasana paid to Jamal by purchasing Bajaj Rekshaw for 17 months on monthly installments', 'JV-LCI001', 'financing_disbursement', 212089.00, 212089.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '639a4889-297d-4aaf-9952-c8be1906137f', '2c7e9810-b6bc-4561-9e17-b6c0dc09becc', id, 'Qard Ul Hasana paid to Jamal by purchasing Bajaj Rekshaw for 17 months on monthly installments', 212089.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3fd1f23f-1fff-4459-9329-bcc6e7fb40cf', '2c7e9810-b6bc-4561-9e17-b6c0dc09becc', id, 'Qard Ul Hasana paid to Jamal by purchasing Bajaj Rekshaw for 17 months on monthly installments', 0.00, 212089.00 FROM accounts WHERE account_code = '12200';

-- Entry: LCI002
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('86540bb0-c2ec-4bb4-924b-1d8e5531fde1', 'JE-000160', '2025-05-04', 'Qard Ul Hasana paid to Zubair for 17 months on monthly instalments', 'JV-LCI002', 'financing_disbursement', 212089.00, 212089.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd329eb84-4b32-4aca-93be-abc16a23e838', '86540bb0-c2ec-4bb4-924b-1d8e5531fde1', id, 'Qard Ul Hasana paid to Zubair for 17 months on monthly instalments', 212089.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3aaeb1be-28ba-413a-8597-56ecb7de0363', '86540bb0-c2ec-4bb4-924b-1d8e5531fde1', id, 'Qard Ul Hasana paid to Zubair for 17 months on monthly instalments', 0.00, 212089.00 FROM accounts WHERE account_code = '12200';

-- Entry: LCI003
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b7d78e7f-67cc-4cbf-b228-03e67cfbd026', 'JE-000161', '2025-05-04', 'Qard Ul Hasana paid to Esmaullah by purchasing Bajaj Rekshaw on monthly installments', 'JV-LCI003', 'financing_disbursement', 224500.00, 224500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '01e9b0be-4509-4c74-a0e2-a3e9e00d983d', 'b7d78e7f-67cc-4cbf-b228-03e67cfbd026', id, 'Qard Ul Hasana paid to Esmaullah by purchasing Bajaj Rekshaw on monthly installments', 224500.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd546956b-b5ae-4904-b928-f960d98cf1a5', 'b7d78e7f-67cc-4cbf-b228-03e67cfbd026', id, 'Qard Ul Hasana paid to Esmaullah by purchasing Bajaj Rekshaw on monthly installments', 0.00, 224500.00 FROM accounts WHERE account_code = '12200';

-- Entry: LCI004
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('de5845dc-a18d-43cc-9bbe-befe10ad59a6', 'JE-000162', '2025-05-04', 'Qard Ul Hasana paid to Abdullah by purchasing Bajaj Rekshaw on monthly installments.', 'JV-LCI004', 'financing_disbursement', 212088.01, 212088.01, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8116bd71-36d5-499e-8dae-9f56591bb3a6', 'de5845dc-a18d-43cc-9bbe-befe10ad59a6', id, 'Qard Ul Hasana paid to Abdullah by purchasing Bajaj Rekshaw on monthly installments.', 212088.01, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd2feaad8-9e0d-4c52-822b-87c12fb16ced', 'de5845dc-a18d-43cc-9bbe-befe10ad59a6', id, 'Qard Ul Hasana paid to Abdullah by purchasing Bajaj Rekshaw on monthly installments.', 0.00, 212088.01 FROM accounts WHERE account_code = '12200';

-- Entry: LCI005
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8f2589e0-16a5-4135-ade0-e166974f5e1f', 'JE-000163', '2025-05-04', 'Purchased a taxi for Mr. Ebadullah on Murabaha', 'JV-LCI005', 'financing_disbursement', 376704.00, 376704.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6c778c22-4cd8-4ede-9f1b-a197726f1fba', '8f2589e0-16a5-4135-ade0-e166974f5e1f', id, 'Purchased a taxi for Mr. Ebadullah on Murabaha', 376704.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ce5fc223-f61e-4523-98f9-c11ece1489ea', '8f2589e0-16a5-4135-ade0-e166974f5e1f', id, 'Murabaha loan paid to Ebadullah by purchasing Toyota Crollah on monthly installements.
', 0.00, 345600.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ecb18c26-ac74-489f-9afb-ef71914f9ca7', '8f2589e0-16a5-4135-ade0-e166974f5e1f', id, '9% CGS  on the sale of the product.', 0.00, 31104.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI006
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1cc9b280-2387-4959-83e5-973f54d22bb1', 'JE-000164', '2025-05-04', 'Loan paid to Mohammad Asif for as investment on Cricket bats production factory setup and Raw materials', 'JV-LCI006', 'financing_disbursement', 1500000.00, 1500000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '16ca8006-25a1-4f1d-b25e-d4f31f0d67b0', '1cc9b280-2387-4959-83e5-973f54d22bb1', id, 'Loan paid to Mohammad Asif for as investment on Cricket bats production factory setup and Raw materials', 1500000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a362c185-e9c0-4eca-8f5f-91f49376953a', '1cc9b280-2387-4959-83e5-973f54d22bb1', id, 'Loan given to customer on Mudarabah based on the contract made.', 0.00, 1500000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 159
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f6eff165-5701-423c-9d61-db1d7765c32d', 'JE-000165', '2025-05-04', 'Paid for staff lunch expense', 'JV-159', 'journal_entry', 670.00, 670.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e4e47209-2852-498f-8def-21ef126ef2b6', 'f6eff165-5701-423c-9d61-db1d7765c32d', id, 'Paid for staff lunch expense', 670.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '35d8fa62-7b21-4ef9-b77f-3aa94f539ac0', 'f6eff165-5701-423c-9d61-db1d7765c32d', id, 'Paid for staff lunch expense', 0.00, 670.00 FROM accounts WHERE account_code = '10100';

-- Entry: 160
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3b7a0570-c01a-47fa-a9c9-9f5ec8099030', 'JE-000166', '2025-05-04', 'Taxi used by Shokoor to collect quotations', 'JV-160', 'journal_entry', 390.00, 390.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '78c4841b-bad2-468e-b154-ee092e25648b', '3b7a0570-c01a-47fa-a9c9-9f5ec8099030', id, 'Taxi used by Shokoor to collect quotations', 390.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fd51aed8-c1da-409f-b828-22bf514f7902', '3b7a0570-c01a-47fa-a9c9-9f5ec8099030', id, 'Taxi used by Shokoor to collect quotations', 0.00, 390.00 FROM accounts WHERE account_code = '10100';

-- Entry: 161
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d303cd76-b45f-418a-b1a3-d5800acccd0f', 'JE-000167', '2025-05-04', 'Paid for taxi charges', 'JV-161', 'journal_entry', 40.00, 40.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '131c46fc-f0b1-4825-838f-f479939f168b', 'd303cd76-b45f-418a-b1a3-d5800acccd0f', id, 'Paid for taxi charges', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6dec3248-e269-479f-b29d-01258c4263f7', 'd303cd76-b45f-418a-b1a3-d5800acccd0f', id, 'Paid for taxi charges', 0.00, 40.00 FROM accounts WHERE account_code = '10100';

-- Entry: 162
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e352ebe5-2f5a-4989-83e5-2f2c7beb68d0', 'JE-000168', '2025-05-04', 'Paid for a job announcement', 'JV-162', 'journal_entry', 1350.00, 1350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3562e03d-ed26-460c-933c-28e7466f17e1', 'e352ebe5-2f5a-4989-83e5-2f2c7beb68d0', id, 'Paid for a job announcement', 1350.00, 0.00 FROM accounts WHERE account_code = '61605';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '74238e85-73c8-4a2f-9677-d44f3d5fa148', 'e352ebe5-2f5a-4989-83e5-2f2c7beb68d0', id, 'Paid for a job announcement', 0.00, 1350.00 FROM accounts WHERE account_code = '10100';

-- Entry: 163
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('826a90dc-cc65-47ca-93d9-9a4107a09862', 'JE-000169', '2025-05-05', 'Paid for staff lunch expense', 'JV-163', 'journal_entry', 160.00, 160.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8d63d433-b123-4f65-b8e0-d6b4e69ed3ab', '826a90dc-cc65-47ca-93d9-9a4107a09862', id, 'Paid for staff lunch expense', 160.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '691f30c0-36b9-434f-90a1-c8f2bdc66c42', '826a90dc-cc65-47ca-93d9-9a4107a09862', id, 'Paid for staff lunch expense', 0.00, 160.00 FROM accounts WHERE account_code = '10100';

-- Entry: 164
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9b84eb55-1625-404b-864e-f2e9914d93b8', 'JE-000170', '2025-05-06', 'Paid for staff lunch', 'JV-164', 'journal_entry', 360.00, 360.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '21df498d-308c-4053-9f8b-454c185d53c2', '9b84eb55-1625-404b-864e-f2e9914d93b8', id, 'Paid for staff lunch', 230.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c765d875-4b65-4ae0-907c-6d3198204ef6', '9b84eb55-1625-404b-864e-f2e9914d93b8', id, 'Paid for toilet paper and dish washing liquid', 130.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c0b9a0a4-6c8c-45c2-bbd0-a65ad7ecb7cf', '9b84eb55-1625-404b-864e-f2e9914d93b8', id, 'Paid for toilet paper and dish washing liquid', 0.00, 360.00 FROM accounts WHERE account_code = '10100';

-- Entry: 165
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8e5c14c9-7d5c-4e0c-a482-00c1c233131d', 'JE-000171', '2025-05-06', 'Salary paid for the month of Apr 2025', 'JV-165', 'journal_entry', 358740.00, 358740.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e916e2bb-898e-46dc-841e-49a8f2f06e59', '8e5c14c9-7d5c-4e0c-a482-00c1c233131d', id, 'Salary paid for the month of Apr 2025', 80000.00, 0.00 FROM accounts WHERE account_code = '20151';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '41938d56-8192-4fe9-95d1-a82887728648', '8e5c14c9-7d5c-4e0c-a482-00c1c233131d', id, 'Salary paid for the month of Apr 2025', 50600.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4c137b41-09a3-47a1-badb-ce9da44c9d30', '8e5c14c9-7d5c-4e0c-a482-00c1c233131d', id, 'Salary paid for the month of Apr 2025', 50600.00, 0.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'df30af08-6475-4bb9-afca-7ecfb238c0ef', '8e5c14c9-7d5c-4e0c-a482-00c1c233131d', id, 'Salary paid for the month of Apr 2025', 50600.00, 0.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e46743d9-ccbf-4583-9e85-208edae369c8', '8e5c14c9-7d5c-4e0c-a482-00c1c233131d', id, 'Salary paid for the month of Apr 2025', 11860.00, 0.00 FROM accounts WHERE account_code = '20155';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd0219d21-036d-42eb-9fa3-e6df73c69030', '8e5c14c9-7d5c-4e0c-a482-00c1c233131d', id, 'Salary paid for the month of Apr 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ade7d6d1-8660-412f-bd58-768efccc0cd7', '8e5c14c9-7d5c-4e0c-a482-00c1c233131d', id, 'Salary paid for the month of Apr 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9e1664c8-55a9-487a-b74e-23f44dba994c', '8e5c14c9-7d5c-4e0c-a482-00c1c233131d', id, 'Salary paid for the month of Apr 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8c9b76f5-5c32-4408-a6a5-ed13cfdc03d0', '8e5c14c9-7d5c-4e0c-a482-00c1c233131d', id, 'Salary paid for the month of Apr 2025', 9900.00, 0.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4780e5fa-a34a-4db9-b776-a75c739f1722', '8e5c14c9-7d5c-4e0c-a482-00c1c233131d', id, 'Salary paid for the month of Apr 2025', 28100.00, 0.00 FROM accounts WHERE account_code = '20160';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'be178f67-926f-493d-9938-22ef1e87c26d', '8e5c14c9-7d5c-4e0c-a482-00c1c233131d', id, 'Salary paid for the month of Apr 2025', 28100.00, 0.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c70726fd-43c4-4714-aed8-c6c7455e2ae9', '8e5c14c9-7d5c-4e0c-a482-00c1c233131d', id, 'Salary paid for the month of Apr 2025', 28100.00, 0.00 FROM accounts WHERE account_code = '20165';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '54cfe1d6-74ea-4ffa-961a-bfb86ed4fee6', '8e5c14c9-7d5c-4e0c-a482-00c1c233131d', id, 'Salary paid for the month of Apr 2025', 0.00, 358740.00 FROM accounts WHERE account_code = '10100';

-- Entry: 166
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2ca23d49-4779-4586-aef2-2fbb8e239a36', 'JE-000172', '2025-05-07', 'Internet fee paid for the month of Apri 2025  (USD 100 @70.4088)', 'JV-166', 'journal_entry', 7041.00, 7041.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '03e37e03-c57a-459b-8b9a-0d8d4952c96e', '2ca23d49-4779-4586-aef2-2fbb8e239a36', id, 'Internet fee paid for the month of Apri 2025  (USD 100 @70.4088)', 7041.00, 0.00 FROM accounts WHERE account_code = '61202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '09752640-7c4c-4c13-8cb9-935d35489275', '2ca23d49-4779-4586-aef2-2fbb8e239a36', id, 'Internet fee paid for the month of Apri 2025  (USD 100 @70.4088)', 0.00, 7041.00 FROM accounts WHERE account_code = '10100';

-- Entry: 167
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('45f8cea6-92ed-41a4-a88b-64cf7109321e', 'JE-000173', '2025-05-07', 'Paid for mineral water for the office us', 'JV-167', 'journal_entry', 220.00, 220.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '67973019-d902-4745-8e62-771e41e28192', '45f8cea6-92ed-41a4-a88b-64cf7109321e', id, 'Paid for mineral water for the office us', 180.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd165c619-ec02-4d85-9588-ab6bac031b9c', '45f8cea6-92ed-41a4-a88b-64cf7109321e', id, 'Taxi used by Musafer for office work', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9e3cec85-3cfd-4e74-86c8-642e6b2f7812', '45f8cea6-92ed-41a4-a88b-64cf7109321e', id, 'Taxi used by Musafer for office work', 0.00, 220.00 FROM accounts WHERE account_code = '10100';

-- Entry: 168
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2bb7b5a4-70ae-49a2-8906-d21d8d2efc01', 'JE-000174', '2025-05-07', 'Paid for staff the day lunch expense', 'JV-168', 'journal_entry', 660.00, 660.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '762f4bdf-cf0b-4f0f-af48-38240cab0f06', '2bb7b5a4-70ae-49a2-8906-d21d8d2efc01', id, 'Paid for staff the day lunch expense', 180.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c3d81474-c37e-4e04-aaf2-59c3486bc5d8', '2bb7b5a4-70ae-49a2-8906-d21d8d2efc01', id, 'Paid for liquid gas for the office use.', 480.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f7cd0442-1fc2-46c1-a9af-56453861f848', '2bb7b5a4-70ae-49a2-8906-d21d8d2efc01', id, 'Paid for liquid gas for the office use and staff lunch.', 0.00, 660.00 FROM accounts WHERE account_code = '10100';

-- Entry: 169
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e9594d21-237a-4bd6-a2d1-e028ca4ba06d', 'JE-000175', '2025-05-08', 'Paid for car fuel used for the office work.', 'JV-169', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b16197f6-ed02-416e-9bba-1d37cfad8c9f', 'e9594d21-237a-4bd6-a2d1-e028ca4ba06d', id, 'Paid for car fuel used for the office work.', 500.00, 0.00 FROM accounts WHERE account_code = '60901';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c5d1af39-6599-4e32-800f-18a845df2edc', 'e9594d21-237a-4bd6-a2d1-e028ca4ba06d', id, 'Paid for car fuel used for the office work.', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 170
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ff00a9ac-ed12-4ec0-a48a-14acdcd00d49', 'JE-000176', '2025-05-08', 'Paid for staff lunch expense', 'JV-170', 'journal_entry', 380.00, 380.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2772c7d4-784c-4c4f-97c0-62b6008b0d64', 'ff00a9ac-ed12-4ec0-a48a-14acdcd00d49', id, 'Paid for staff lunch expense', 380.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0f77e696-5c03-436e-9a99-5880e8e6cac9', 'ff00a9ac-ed12-4ec0-a48a-14acdcd00d49', id, 'Paid for staff lunch expense', 0.00, 380.00 FROM accounts WHERE account_code = '10100';

-- Entry: 171
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ba514c03-211d-49a3-a554-1432b37460c2', 'JE-000177', '2025-05-09', 'Paid for staff dinner working on friday', 'JV-171', 'journal_entry', 1300.00, 1300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'da5d19f1-7131-408f-83db-013b25db34a7', 'ba514c03-211d-49a3-a554-1432b37460c2', id, 'Paid for staff dinner working on friday', 1300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eed9e485-daa5-4975-b539-db082937f48a', 'ba514c03-211d-49a3-a554-1432b37460c2', id, 'Paid for staff dinner working on friday', 0.00, 1300.00 FROM accounts WHERE account_code = '10100';

-- Entry: 172
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e7f37c88-894d-43a0-95ef-3dd2848db2a6', 'JE-000178', '2025-05-10', 'Paid for staff lunch expenses', 'JV-172', 'journal_entry', 240.00, 240.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '44fb7b1d-e818-46f2-b220-e62b6bcd9373', 'e7f37c88-894d-43a0-95ef-3dd2848db2a6', id, 'Paid for staff lunch expenses', 240.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1685cc72-c90a-4126-a5a8-eafd11935d0c', 'e7f37c88-894d-43a0-95ef-3dd2848db2a6', id, 'Paid for staff lunch expenses', 0.00, 240.00 FROM accounts WHERE account_code = '10100';

-- Entry: 173
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fe6038ff-8b15-43d5-8460-c8ca0dd6da5c', 'JE-000179', '2025-05-11', 'Paid for lunch expense', 'JV-173', 'journal_entry', 245.00, 245.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3957b52a-bf4a-480b-b222-bcf9168d892d', 'fe6038ff-8b15-43d5-8460-c8ca0dd6da5c', id, 'Paid for lunch expense', 225.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1a39195f-aeba-4246-b6ce-62299e319c8e', 'fe6038ff-8b15-43d5-8460-c8ca0dd6da5c', id, 'Paid for drinking water', 20.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3828cdeb-6e4a-404f-a330-9fb831ccda2c', 'fe6038ff-8b15-43d5-8460-c8ca0dd6da5c', id, 'Paid for lunch expense and mineral water', 0.00, 245.00 FROM accounts WHERE account_code = '10100';

-- Entry: 174
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('81afc01b-5178-4b0e-8c62-3c21f7a69309', 'JE-000180', '2025-05-11', 'Purchased 6 photo frames for the office use.', 'JV-174', 'journal_entry', 600.00, 600.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3e8b05bf-8e70-4b5d-afec-1df96d1cb1f4', '81afc01b-5178-4b0e-8c62-3c21f7a69309', id, 'Purchased 6 photo frames for the office use.', 600.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '87ae0b77-09e5-4fd7-880f-4c214f7c9db5', '81afc01b-5178-4b0e-8c62-3c21f7a69309', id, 'Purchased 6 photo frames for the office use.', 0.00, 600.00 FROM accounts WHERE account_code = '10100';

-- Entry: 175
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('40a126d3-60a7-4e29-a6a1-74c2ede00849', 'JE-000181', '2025-05-11', 'Paid for printing of stand banner and UV ID cards', 'JV-175', 'journal_entry', 3000.00, 3000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '641307d3-2d97-4cd9-b673-452f7c21f6d2', '40a126d3-60a7-4e29-a6a1-74c2ede00849', id, 'Paid for printing of stand banner and UV ID cards', 3000.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ae48bd88-5e5c-4981-b62d-15c2af8f551f', '40a126d3-60a7-4e29-a6a1-74c2ede00849', id, 'Paid for printing of stand banner and UV ID cards', 0.00, 3000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 176
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5f875745-9207-482a-877c-a336a7455ca6', 'JE-000182', '2025-05-11', 'Purchased stationery for the office use.', 'JV-176', 'journal_entry', 4710.00, 4710.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6ab3d670-bc91-4883-a34d-62a0832859bb', '5f875745-9207-482a-877c-a336a7455ca6', id, 'Purchased stationery for the office use.', 1030.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '94d6f1a1-01ad-4436-9884-e915cf0a610c', '5f875745-9207-482a-877c-a336a7455ca6', id, 'Purchased bills for the office use.', 830.00, 0.00 FROM accounts WHERE account_code = '60505';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '542c62c4-c819-4a09-88b7-02ba66b1aa84', '5f875745-9207-482a-877c-a336a7455ca6', id, 'Purchased some soft drinks, water for office guest use.', 2850.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ae2945d1-5990-4ad1-a5e6-076a63bf99ac', '5f875745-9207-482a-877c-a336a7455ca6', id, 'Purchased some soft drinks, water for office guest use.', 0.00, 4710.00 FROM accounts WHERE account_code = '10100';

-- Entry: 177
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f47f6dbd-b067-48a9-a719-a5d78c586afb', 'JE-000183', '2025-05-11', 'Taxi used by Musafer for the office work', 'JV-177', 'journal_entry', 90.00, 90.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c75171b7-daf5-439b-8871-b7b49bf0d983', 'f47f6dbd-b067-48a9-a719-a5d78c586afb', id, 'Taxi used by Musafer for the office work', 90.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c33e5ccd-93ca-488b-97f4-664df5dedf72', 'f47f6dbd-b067-48a9-a719-a5d78c586afb', id, 'Taxi used by Musafer for the office work', 0.00, 90.00 FROM accounts WHERE account_code = '10100';

-- Entry: 178
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1dbbb44e-55aa-4111-891a-5c7d3934d43b', 'JE-000184', '2025-05-11', 'Paid for drinking water', 'JV-178', 'journal_entry', 120.00, 120.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5387ac86-8445-4154-a12c-b59607e6a88f', '1dbbb44e-55aa-4111-891a-5c7d3934d43b', id, 'Paid for drinking water', 120.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4d34998c-4939-458c-aa4d-bd83466f0fb0', '1dbbb44e-55aa-4111-891a-5c7d3934d43b', id, 'Paid for drinking water', 0.00, 120.00 FROM accounts WHERE account_code = '10100';

-- Entry: 179
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8b8a1f09-992f-4762-a544-6805f265c2ac', 'JE-000185', '2025-05-11', 'Paid for city water 2 tanker ( 1 old payment)', 'JV-179', 'journal_entry', 1600.00, 1600.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '15cb7c03-52d7-4beb-b898-bf3360b8f7d7', '8b8a1f09-992f-4762-a544-6805f265c2ac', id, 'Paid for city water 2 tanker ( 1 old payment)', 1600.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '29135691-f31d-4858-b6cb-6e53c0a8423f', '8b8a1f09-992f-4762-a544-6805f265c2ac', id, 'Paid for city water 2 tanker ( 1 old payment)', 0.00, 1600.00 FROM accounts WHERE account_code = '10100';

-- Entry: 180
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a0331299-3841-47c7-882f-09a1714692ee', 'JE-000186', '2025-05-12', 'Paid for the office staff lunch expense', 'JV-180', 'journal_entry', 220.00, 220.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '84e9a91e-9d13-4589-8f84-8927160bf117', 'a0331299-3841-47c7-882f-09a1714692ee', id, 'Paid for the office staff lunch expense', 220.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9ce56f61-1122-411b-8fe2-159ba6cc595c', 'a0331299-3841-47c7-882f-09a1714692ee', id, 'Paid for the office staff lunch expense', 0.00, 220.00 FROM accounts WHERE account_code = '10100';

-- Entry: 181
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e0d2a4b4-61cf-4158-93ef-697738a430f7', 'JE-000187', '2025-05-12', 'Paid for staff lunch expense old bill', 'JV-181', 'journal_entry', 70.00, 70.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c41b52a5-3189-4f75-ae1e-cfa0f78c2693', 'e0d2a4b4-61cf-4158-93ef-697738a430f7', id, 'Paid for staff lunch expense old bill', 70.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3277daf5-9fe9-4698-b1bf-21e7f3420a7c', 'e0d2a4b4-61cf-4158-93ef-697738a430f7', id, 'Paid for staff lunch expense old bill', 0.00, 70.00 FROM accounts WHERE account_code = '10100';

-- Entry: 182
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2a8830a4-bc52-497e-a322-478e6ad4fb13', 'JE-000188', '2025-05-13', 'Paid for staff lunch expense', 'JV-182', 'journal_entry', 630.00, 630.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8beba511-7c7d-48aa-93f8-e514d2f76c97', '2a8830a4-bc52-497e-a322-478e6ad4fb13', id, 'Paid for staff lunch expense', 630.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4cb95592-ece5-475e-a1d9-71d010f1aebe', '2a8830a4-bc52-497e-a322-478e6ad4fb13', id, 'Paid for staff lunch expense', 0.00, 630.00 FROM accounts WHERE account_code = '10100';

-- Entry: 183
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('38c9bb15-5e35-4c58-a406-de367dc5cc55', 'JE-000189', '2025-05-14', 'Paid for drinking water', 'JV-183', 'journal_entry', 250.00, 250.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a15d6dcd-3f36-4e7c-ace3-853b9cc00122', '38c9bb15-5e35-4c58-a406-de367dc5cc55', id, 'Paid for drinking water', 50.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e3474651-caa7-4972-90e3-22c2a96b3107', '38c9bb15-5e35-4c58-a406-de367dc5cc55', id, 'Paid for staff lunch expense', 200.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4a1f7e52-7838-44df-8776-27ee2f2c055a', '38c9bb15-5e35-4c58-a406-de367dc5cc55', id, 'Paid for staff lunch expense and drinking water', 0.00, 250.00 FROM accounts WHERE account_code = '10100';

-- Entry: 184
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8501ca43-bdf4-4ac9-831d-d6c629fa611c', 'JE-000190', '2025-05-15', 'Paid for guards friday expenes', 'JV-184', 'journal_entry', 130.00, 130.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4b765a21-39ba-4163-9c08-c24716864338', '8501ca43-bdf4-4ac9-831d-d6c629fa611c', id, 'Paid for guards friday expenes', 130.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ba5b5be8-8c1b-460c-bc54-d00f0a5ce6a7', '8501ca43-bdf4-4ac9-831d-d6c629fa611c', id, 'Paid for guards friday expenes', 0.00, 130.00 FROM accounts WHERE account_code = '10100';

-- Entry: 185
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('02cd3816-009a-4c39-b9f2-f113cde39c39', 'JE-000191', '2025-05-17', 'Paid for staff lunch expense', 'JV-185', 'journal_entry', 160.00, 160.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a3c5837f-059e-48e8-9943-9034f39a4d9c', '02cd3816-009a-4c39-b9f2-f113cde39c39', id, 'Paid for staff lunch expense', 160.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '20f8183f-4e1b-4ed3-beaa-63c8197bafcb', '02cd3816-009a-4c39-b9f2-f113cde39c39', id, 'Paid for staff lunch expense', 0.00, 160.00 FROM accounts WHERE account_code = '10100';

-- Entry: 186
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a7970a48-1c90-4207-b542-0fd215ac2774', 'JE-000192', '2025-05-17', 'Purchased gift for CEO', 'JV-186', 'journal_entry', 750.00, 750.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1751973a-7ea2-46a0-a33a-ff83faa784ca', 'a7970a48-1c90-4207-b542-0fd215ac2774', id, 'Purchased gift for CEO', 250.00, 0.00 FROM accounts WHERE account_code = '60404';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3ebf3d7a-9f3d-4497-84ae-ba32d39f6a8e', 'a7970a48-1c90-4207-b542-0fd215ac2774', id, 'Purchased cack for the CEO party', 500.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bc2ecba8-3a4d-4d84-b491-16a7f45ea33e', 'a7970a48-1c90-4207-b542-0fd215ac2774', id, 'Purchased cack for the CEO party', 0.00, 750.00 FROM accounts WHERE account_code = '10100';

-- Entry: 187
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d50a47e0-52ed-45a7-ab2f-be370d0990dd', 'JE-000193', '2025-05-17', 'Trasportation charges of staff to Mazar to join Microfinance Exhabition held by DAB.', 'JV-187', 'journal_entry', 62150.00, 62150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '047ece5c-ba32-4dfc-a0ff-a83f9205f1da', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Trasportation charges of staff to Mazar to join Microfinance Exhabition held by DAB.', 12000.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c46503ce-9833-4c3d-b759-2c888997d276', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Paid for expenses during the travel', 1180.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3a962329-d7fe-47d2-b2c5-4a6c6999fa29', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Printed brochures, banners,', 5650.00, 0.00 FROM accounts WHERE account_code = '61602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cebfcea2-86ba-4017-9d1a-4812bb7aefd8', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Rented tables and chairs for three days.', 3600.00, 0.00 FROM accounts WHERE account_code = '61002';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd54c58b6-8b95-4220-b393-75b08a0d5f35', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Rented car for equipment transportation', 300.00, 0.00 FROM accounts WHERE account_code = '60804';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4a3d5b1c-558d-459b-80eb-1757f5a52cf4', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Rented TV for 3 days for the even', 1000.00, 0.00 FROM accounts WHERE account_code = '61002';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '811823b6-46ad-4a5b-bb94-69d3c76fe7a8', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Hotel rent for 3 nights', 5100.00, 0.00 FROM accounts WHERE account_code = '60703';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '011879b2-c933-48d8-ad66-f5eff3dd1cbf', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Paid for food expenses during the stay', 6000.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6c8d0fd3-2a2e-4c59-8354-1a8fdc743c1b', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Expenses made during the travel to Mazar', 0.00, 34830.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '03a72695-0f38-445c-bd8d-811a3dcdde22', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Paid for food expenses during the travel to Kunduz', 2400.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '30335827-9afe-41d3-aa56-fe44a5067fc5', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Rented vehicles for transportation of equipments.', 1820.00, 0.00 FROM accounts WHERE account_code = '61002';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4f15f10b-116c-4dbd-9b55-0a3061aa5ba7', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Printed brochures for promotion', 1200.00, 0.00 FROM accounts WHERE account_code = '61602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd8adb809-aa76-4f63-81b4-663c11aacaee', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Paid iron frame for the banners', 4700.00, 0.00 FROM accounts WHERE account_code = '61602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bcaeca3c-fbba-4e8e-a9b5-5d7a8caca93e', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Transportation charges Kabul to Kunduz to Kabul', 12150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '87bb6bd7-0a37-45d0-97eb-c4af20f976f8', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Expenses made during the way.', 500.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3d27113f-d146-4633-ba1b-6ee25c37cde3', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Expenses made during the way.', 550.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c51f9f39-df90-42ad-b67d-69696d0f2425', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Paid for car fuel.', 1000.00, 0.00 FROM accounts WHERE account_code = '60901';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6fbe5fce-71c1-4a66-928f-eb2689c5c29b', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Expenses made during the travel to Kunduz', 0.00, 24320.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '67ecc41a-b8d7-408b-82b9-dfdac2191678', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Paid by Shapoor for Mazar and Kunduz travel expense', 3000.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8246d436-db32-45d8-a914-8de10fb60394', 'd50a47e0-52ed-45a7-ab2f-be370d0990dd', id, 'Paid by Shapoor for Mazar and Kunduz travel expense', 0.00, 3000.00 FROM accounts WHERE account_code = '20152';

-- Entry: 188
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('67077393-6fd8-4d42-8132-a927efb56864', 'JE-000194', '2025-05-17', 'Purchased 6 fan for the office use and transportation cost.', 'JV-188', 'journal_entry', 13670.00, 13670.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '222564fc-fb2c-4d50-b2bb-5f1a015849da', '67077393-6fd8-4d42-8132-a927efb56864', id, 'Purchased 6 fan for the office use and transportation cost.', 13670.00, 0.00 FROM accounts WHERE account_code = '17201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5b3f3b63-bbc2-4954-bdc6-0a266cd52c4f', '67077393-6fd8-4d42-8132-a927efb56864', id, 'Purchased 6 fan for the office use and transportation cost.', 0.00, 13670.00 FROM accounts WHERE account_code = '10100';

-- Entry: 189
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e10b828a-5b01-4691-9b74-249eb63f19e0', 'JE-000195', '2025-05-18', 'Paid for staff lunch expenses', 'JV-189', 'journal_entry', 1210.00, 1210.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '50b35364-3a0a-4ef8-8da2-7335a5b3a8a2', 'e10b828a-5b01-4691-9b74-249eb63f19e0', id, 'Paid for staff lunch expenses', 1210.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e38ea16f-f924-43a3-986c-8ea938da3663', 'e10b828a-5b01-4691-9b74-249eb63f19e0', id, 'Paid for staff lunch expenses', 0.00, 1210.00 FROM accounts WHERE account_code = '10100';

-- Entry: 190
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('25106f02-ea2d-4809-9284-a35a861b577e', 'JE-000196', '2025-05-18', 'Taxi used by Musafer for the office work', 'JV-190', 'journal_entry', 40.00, 40.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2e08e6bc-d8c5-4dfc-966e-d46e348ea3bb', '25106f02-ea2d-4809-9284-a35a861b577e', id, 'Taxi used by Musafer for the office work', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '77627abf-8c14-46f5-958a-8baea6e4ef85', '25106f02-ea2d-4809-9284-a35a861b577e', id, 'Taxi used by Musafer for the office work', 0.00, 40.00 FROM accounts WHERE account_code = '10100';

-- Entry: 191
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('eac79fdc-59e2-4bf4-b31c-7d0fedac2eb2', 'JE-000197', '2025-05-18', 'Paid for the power generator fuel', 'JV-191', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '908c2271-87a6-49f0-8b2c-8495917ec1c4', 'eac79fdc-59e2-4bf4-b31c-7d0fedac2eb2', id, 'Paid for the power generator fuel', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '234fac7a-a577-4882-99a1-c445645fe461', 'eac79fdc-59e2-4bf4-b31c-7d0fedac2eb2', id, 'Paid for the power generator fuel', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 192
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9a8053bd-08dd-4203-a507-ff0747e885d1', 'JE-000198', '2025-05-19', 'Paid for the staff lunch expenses', 'JV-192', 'journal_entry', 185.00, 185.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1107cbfb-7cdf-4e1a-b671-0e1e330ec695', '9a8053bd-08dd-4203-a507-ff0747e885d1', id, 'Paid for the staff lunch expenses', 185.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c9522286-4898-410b-9e0f-c52069e57861', '9a8053bd-08dd-4203-a507-ff0747e885d1', id, 'Paid for the staff lunch expenses', 0.00, 185.00 FROM accounts WHERE account_code = '10100';

-- Entry: 193
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a1e91672-fba9-4c7d-8532-ff0d5a5c6e2f', 'JE-000199', '2025-05-19', 'Paid for the power generator fuel', 'JV-193', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '617c97e6-7a54-4e50-8f04-f4a9509cb61b', 'a1e91672-fba9-4c7d-8532-ff0d5a5c6e2f', id, 'Paid for the power generator fuel', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '300539f8-5e71-4452-a0b4-c68911118f6f', 'a1e91672-fba9-4c7d-8532-ff0d5a5c6e2f', id, 'Paid for the power generator fuel', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 194
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7ba07092-9b8d-472c-9d05-f8eca1e7e770', 'JE-000200', '2025-05-19', 'Paid for the staff drinking water', 'JV-194', 'journal_entry', 120.00, 120.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dd43275f-aa54-4413-b45b-c1ac5983cc0b', '7ba07092-9b8d-472c-9d05-f8eca1e7e770', id, 'Paid for the staff drinking water', 120.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c32fb110-7b64-4e7d-bf25-e4b62300af77', '7ba07092-9b8d-472c-9d05-f8eca1e7e770', id, 'Paid for the staff drinking water', 0.00, 120.00 FROM accounts WHERE account_code = '10100';

-- Entry: 195
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d363571c-0208-41a5-9548-e703e9507bca', 'JE-000201', '2025-05-19', 'Paid for juice for guest', 'JV-195', 'journal_entry', 380.00, 380.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ab56cc2c-1c68-46c9-9077-5a54112069ac', 'd363571c-0208-41a5-9548-e703e9507bca', id, 'Paid for juice for guest', 380.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '434be1ff-042f-4524-b369-ebd751821373', 'd363571c-0208-41a5-9548-e703e9507bca', id, 'Paid for juice for guest', 0.00, 380.00 FROM accounts WHERE account_code = '10100';

-- Entry: 196
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('04f2f0db-a5dd-418d-b0b6-49035d272012', 'JE-000202', '2025-05-19', 'Purchased glassed, Juck for the kitchen use.', 'JV-196', 'journal_entry', 2600.00, 2600.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '36ef5377-19f4-4400-8b15-a986cf710128', '04f2f0db-a5dd-418d-b0b6-49035d272012', id, 'Purchased glassed, Juck for the kitchen use.', 2600.00, 0.00 FROM accounts WHERE account_code = '60503';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a316b786-71b0-4fec-ba58-fe7ac89e0e02', '04f2f0db-a5dd-418d-b0b6-49035d272012', id, 'Purchased glassed, Juck for the kitchen use.', 0.00, 2600.00 FROM accounts WHERE account_code = '10100';

-- Entry: 197
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('144af6c1-91fd-4162-9dea-71985cfa210f', 'JE-000203', '2025-05-21', 'Advance payment of Shapoor Khan for personal use.', 'JV-197', 'journal_entry', 53000.00, 53000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8a452df4-6dbe-4db7-bfc1-8040cbebbfda', '144af6c1-91fd-4162-9dea-71985cfa210f', id, 'Advance payment of Shapoor Khan for personal use.', 3000.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f28ef1dd-49ce-4838-a311-2ecf58af6aff', '144af6c1-91fd-4162-9dea-71985cfa210f', id, 'Advance payment of Shapoor Khan for personal use.', 0.00, 3000.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a701db42-2eb4-418b-a0aa-551ef1156d13', '144af6c1-91fd-4162-9dea-71985cfa210f', id, 'Advance paid to Haji Romal for Jalalabad branch Opening', 50000.00, 0.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5fc0b581-79ed-4074-96dd-a745093ad109', '144af6c1-91fd-4162-9dea-71985cfa210f', id, 'Advance paid to Haji Romal for Jalalabad branch Opening', 0.00, 50000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 198
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e01531bf-ceea-46eb-8dd9-f934c93c5e49', 'JE-000204', '2025-05-21', 'Paid for the staff the day lunch expense', 'JV-198', 'journal_entry', 250.00, 250.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b7d8694e-02ad-4dfc-a281-e652b6565484', 'e01531bf-ceea-46eb-8dd9-f934c93c5e49', id, 'Paid for the staff the day lunch expense', 250.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5f3d9acc-9108-4c9c-b748-a07720157a03', 'e01531bf-ceea-46eb-8dd9-f934c93c5e49', id, 'Paid for the staff the day lunch expense', 0.00, 250.00 FROM accounts WHERE account_code = '10100';

-- Entry: 199
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('aa10cd02-78c3-4dee-bce7-e831e64fbd2c', 'JE-000205', '2025-05-21', 'Purchased 3 toners for the HQ office HP printers', 'JV-199', 'journal_entry', 2850.00, 2850.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3d8cecb1-7e2d-4df3-b7c7-5d67e45fa941', 'aa10cd02-78c3-4dee-bce7-e831e64fbd2c', id, 'Purchased 3 toners for the HQ office HP printers', 2250.00, 0.00 FROM accounts WHERE account_code = '60502';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '57926d4f-c117-421a-9c4a-32781e509d65', 'aa10cd02-78c3-4dee-bce7-e831e64fbd2c', id, 'Purchased stationery for the office use.', 550.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b9a7ee79-722d-41a0-9d99-ce62d46ca930', 'aa10cd02-78c3-4dee-bce7-e831e64fbd2c', id, 'Paid for taxi used Musafer for the office work', 50.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '08d45799-bd4b-471f-bfac-477cf159beba', 'aa10cd02-78c3-4dee-bce7-e831e64fbd2c', id, 'Paid for 3 toners, stationery, and taxi charge', 0.00, 2850.00 FROM accounts WHERE account_code = '10100';

-- Entry: 200
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3da35414-0f28-49ee-8787-d095f91d307e', 'JE-000206', '2025-05-21', 'Purchased chocolate for the office use.', 'JV-200', 'journal_entry', 33470.00, 33470.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '898b55ee-dc28-4833-b139-65a7fcfedb98', '3da35414-0f28-49ee-8787-d095f91d307e', id, 'Purchased chocolate for the office use.', 150.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '11396566-91f9-4997-a957-503f05d0568a', '3da35414-0f28-49ee-8787-d095f91d307e', id, 'Purchased dry food for the lunch use.', 320.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1edc339d-00ea-4c16-9a01-8f13d1e399fa', '3da35414-0f28-49ee-8787-d095f91d307e', id, 'Purchased dry food for the lunch use. and chocolate.', 0.00, 470.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '362f5dde-f29d-4042-9856-c9c243a192e2', '3da35414-0f28-49ee-8787-d095f91d307e', id, 'House rent prepaid for the month of Sawr 1404', 33000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5f6cabd9-9b02-4a9d-9be0-20ba5f7091bb', '3da35414-0f28-49ee-8787-d095f91d307e', id, 'House rent withheld for the month of Sawr 1404', 0.00, 3000.00 FROM accounts WHERE account_code = '21200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '42ed47ba-d970-453b-b3f9-2c76c97254fc', '3da35414-0f28-49ee-8787-d095f91d307e', id, 'House rent prepaid for the month of Sawr 1404', 0.00, 30000.00 FROM accounts WHERE account_code = '13100';

-- Entry: 201
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c3f67f21-461d-4516-8211-ab3e398fcf62', 'JE-000207', '2025-05-22', 'Purchased stationery for the HQ Office use.', 'JV-201', 'journal_entry', 2210.00, 2210.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '882a6073-2e93-4e0d-9ba4-55c8e9cd559c', 'c3f67f21-461d-4516-8211-ab3e398fcf62', id, 'Purchased stationery for the HQ Office use.', 2210.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a37c0bbb-1bc9-4c81-8117-1e57f07083f2', 'c3f67f21-461d-4516-8211-ab3e398fcf62', id, 'Purchased stationery for the HQ Office use.', 0.00, 2210.00 FROM accounts WHERE account_code = '10100';

-- Entry: 202
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9d99b4a9-3f0b-4a12-a8ac-9b04abdaa55b', 'JE-000208', '2025-05-22', 'Paid for lunch on the day of meeting with UNAMA', 'JV-202', 'journal_entry', 1410.00, 1410.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ff15e1be-07d5-4759-b623-ca65c4b11a5a', '9d99b4a9-3f0b-4a12-a8ac-9b04abdaa55b', id, 'Paid for lunch on the day of meeting with UNAMA', 1410.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9a5635b0-7088-439d-b61b-08bb464721e5', '9d99b4a9-3f0b-4a12-a8ac-9b04abdaa55b', id, 'Paid for lunch on the day of meeting with UNAMA', 0.00, 1410.00 FROM accounts WHERE account_code = '10100';

-- Entry: 203
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3d7cee5b-f1bf-4ed6-a229-591da8b4ad3b', 'JE-000209', '2025-05-22', 'Paid for the car fuel to UNAMA Meeting', 'JV-203', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '229b9fc3-3b31-4344-aba5-4fec8722128f', '3d7cee5b-f1bf-4ed6-a229-591da8b4ad3b', id, 'Paid for the car fuel to UNAMA Meeting', 500.00, 0.00 FROM accounts WHERE account_code = '60901';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '96ca1ef3-3553-473f-a75c-b0c912a4ef67', '3d7cee5b-f1bf-4ed6-a229-591da8b4ad3b', id, 'Paid for the car fuel to UNAMA Meeting', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 204
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b1d4ad7a-ac69-4bf8-a3d4-ce79b2c3f9bc', 'JE-000210', '2025-05-24', 'Paid for the day lunch expense', 'JV-204', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1fbbfa6a-84cd-484e-bb7e-5f322903e876', 'b1d4ad7a-ac69-4bf8-a3d4-ce79b2c3f9bc', id, 'Paid for the day lunch expense', 150.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e2c8963d-3e58-4e51-bda0-001a42e9302e', 'b1d4ad7a-ac69-4bf8-a3d4-ce79b2c3f9bc', id, 'Paid for the day lunch expense', 0.00, 150.00 FROM accounts WHERE account_code = '10100';

-- Entry: 205
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8a61a672-3d8c-4e88-88ca-64cbbfd57c71', 'JE-000211', '2025-05-24', 'Paid for the guards Friday expense', 'JV-205', 'journal_entry', 130.00, 130.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7aa81610-c1cb-45a9-a187-088913b3251a', '8a61a672-3d8c-4e88-88ca-64cbbfd57c71', id, 'Paid for the guards Friday expense', 130.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b7935aa5-77ae-404c-9a85-d43590459b19', '8a61a672-3d8c-4e88-88ca-64cbbfd57c71', id, 'Paid for the guards Friday expense', 0.00, 130.00 FROM accounts WHERE account_code = '10100';

-- Entry: 206
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('389f57d0-eef8-407d-b369-dd573434f2ff', 'JE-000212', '2025-05-24', 'Purchase of power bank for office wifi', 'JV-206', 'journal_entry', 1300.00, 1300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5f53da15-83f0-4cfa-934f-937a0b88d2f7', '389f57d0-eef8-407d-b369-dd573434f2ff', id, 'Purchase of power bank for office wifi', 1300.00, 0.00 FROM accounts WHERE account_code = '17101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '406e7ef0-2760-4343-a100-ac691a4e197c', '389f57d0-eef8-407d-b369-dd573434f2ff', id, 'Purchase of power bank for office wifi', 0.00, 1300.00 FROM accounts WHERE account_code = '10100';

-- Entry: 207
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3c6baeba-d51a-4395-9ea9-b48be5385185', 'JE-000213', '2025-05-25', 'Amount paid to Mahalat shahre cleaning service company for the month of Hamal, Saor, Jawza 1404', 'JV-207', 'journal_entry', 600.00, 600.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aca88cbc-93f1-49a1-b01a-a55afec72c7e', '3c6baeba-d51a-4395-9ea9-b48be5385185', id, 'Amount paid to Mahalat shahre cleaning service company for the month of Hamal, Saor, Jawza 1404', 600.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cdcc7a65-bd87-42cd-a4ce-decc695d245f', '3c6baeba-d51a-4395-9ea9-b48be5385185', id, 'Amount paid to Mahalat shahre cleaning service company for the month of Hamal, Saor, Jawza 1404', 0.00, 600.00 FROM accounts WHERE account_code = '10100';

-- Entry: 208
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3c9b50c4-a415-44a4-8a37-c6972f50ac69', 'JE-000214', '2025-05-25', 'Paid for one tanker water for the office use', 'JV-208', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c0eda910-69e8-4d64-b48c-b6f14f5d6575', '3c9b50c4-a415-44a4-8a37-c6972f50ac69', id, 'Paid for one tanker water for the office use', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fbef2735-4941-4ee3-942e-aff867849e51', '3c9b50c4-a415-44a4-8a37-c6972f50ac69', id, 'Paid for one tanker water for the office use', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 209
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('59cd3968-b6f3-4b14-8b4d-ceaa4cadc485', 'JE-000215', '2025-05-26', 'Paid for one tanker water for the office use', 'JV-209', 'journal_entry', 800.00, 800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6ea3bae7-a336-4eb5-84e7-77b446d62df5', '59cd3968-b6f3-4b14-8b4d-ceaa4cadc485', id, 'Paid for one tanker water for the office use', 800.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b717174b-8761-4b4c-877d-e0523ea1eee2', '59cd3968-b6f3-4b14-8b4d-ceaa4cadc485', id, 'Paid for one tanker water for the office use', 0.00, 800.00 FROM accounts WHERE account_code = '10100';

-- Entry: 210
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f8209b56-0217-4ec3-b6ef-49f9298c737d', 'JE-000216', '2025-05-26', 'Paid for the purchase of breads for the month of April 2025', 'JV-210', 'journal_entry', 2240.00, 2240.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e41497af-1af1-4ac7-8b72-c693235a9d53', 'f8209b56-0217-4ec3-b6ef-49f9298c737d', id, 'Paid for the purchase of breads for the month of April 2025', 2240.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0be6baae-a934-47f4-a16f-867472610ed9', 'f8209b56-0217-4ec3-b6ef-49f9298c737d', id, 'Paid for the purchase of breads for the month of April 2025', 0.00, 2240.00 FROM accounts WHERE account_code = '10100';

-- Entry: 211
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7eabf308-b558-48f2-86f5-c54751e0020a', 'JE-000217', '2025-05-26', 'Paid for lunch expense of staff', 'JV-211', 'journal_entry', 400.00, 400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'db3332e4-65fb-4ab8-93a6-322c4a4c9f4f', '7eabf308-b558-48f2-86f5-c54751e0020a', id, 'Paid for lunch expense of staff', 400.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '12f245c3-cdca-446a-9e6d-cd7744ffd697', '7eabf308-b558-48f2-86f5-c54751e0020a', id, 'Paid for lunch expense of staff', 0.00, 400.00 FROM accounts WHERE account_code = '10100';

-- Entry: 212
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2db31e91-1dd4-4a61-8ac5-c7e1c212be74', 'JE-000218', '2025-05-26', 'Paid for the daily lunch expense', 'JV-212', 'journal_entry', 630.00, 630.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7477ff8c-0c37-458b-937d-458fb0ff0469', '2db31e91-1dd4-4a61-8ac5-c7e1c212be74', id, 'Paid for the daily lunch expense', 630.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '60dc9aac-d4fa-4ece-8b65-dc1f91d360e5', '2db31e91-1dd4-4a61-8ac5-c7e1c212be74', id, 'Paid for the daily lunch expense', 0.00, 630.00 FROM accounts WHERE account_code = '10100';

-- Entry: 213
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a1e7b502-3910-4b20-a3fc-82855b225d59', 'JE-000219', '2025-05-26', 'Taxi used by Musafer to AUB bank to collect bank card', 'JV-213', 'journal_entry', 40.00, 40.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '44f71aa4-801c-49bf-83b8-941148e131e0', 'a1e7b502-3910-4b20-a3fc-82855b225d59', id, 'Taxi used by Musafer to AUB bank to collect bank card', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5f1a4a7e-3b2d-4fd2-ad7f-e83f76998c85', 'a1e7b502-3910-4b20-a3fc-82855b225d59', id, 'Taxi used by Musafer to AUB bank to collect bank card', 0.00, 40.00 FROM accounts WHERE account_code = '10100';

-- Entry: 214
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('415305f2-e3a9-460d-bb4f-2d66ec889865', 'JE-000220', '2025-05-27', 'Taxi used by Musafer to DAB to receive letter', 'JV-214', 'journal_entry', 50.00, 50.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3150c81f-1a9e-40e4-ab97-b6c225227a47', '415305f2-e3a9-460d-bb4f-2d66ec889865', id, 'Taxi used by Musafer to DAB to receive letter', 50.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6fed5b85-caad-4aaa-9338-9209ecb13bab', '415305f2-e3a9-460d-bb4f-2d66ec889865', id, 'Taxi used by Musafer to DAB to receive letter', 0.00, 50.00 FROM accounts WHERE account_code = '10100';

-- Entry: 215
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5fffbdc8-df5c-4002-aa09-e17579afb009', 'JE-000221', '2025-05-27', 'Paid for the liquid gas used in the kitchen', 'JV-215', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b349485b-82ef-489f-afd9-5fee6598894d', '5fffbdc8-df5c-4002-aa09-e17579afb009', id, 'Paid for the liquid gas used in the kitchen', 500.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'abe593cf-aeff-451f-8a5c-3da854888f19', '5fffbdc8-df5c-4002-aa09-e17579afb009', id, 'Paid for the liquid gas used in the kitchen', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 216
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6706244a-d180-4df1-b456-ca51e784e631', 'JE-000222', '2025-05-27', 'Paid for staff lunch expenses', 'JV-216', 'journal_entry', 210.00, 210.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a58d4406-4b8b-4648-a351-5763511a08b9', '6706244a-d180-4df1-b456-ca51e784e631', id, 'Paid for staff lunch expenses', 210.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c0927f44-28bf-4797-9867-90b002ce739f', '6706244a-d180-4df1-b456-ca51e784e631', id, 'Paid for staff lunch expenses', 0.00, 210.00 FROM accounts WHERE account_code = '10100';

-- Entry: 217
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f4815ee0-9d5e-4e88-98c3-023e0b4f1ff9', 'JE-000223', '2025-05-27', 'Paid to Shokoor Khan for lunch expense made for guest', 'JV-217', 'journal_entry', 840.00, 840.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3a977032-f05d-422c-8f1e-4771a060e7fa', 'f4815ee0-9d5e-4e88-98c3-023e0b4f1ff9', id, 'Paid to Shokoor Khan for lunch expense made for guest', 840.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '399927c9-aacc-4e28-a21b-ec7fc73dd4f9', 'f4815ee0-9d5e-4e88-98c3-023e0b4f1ff9', id, 'Paid to Shokoor Khan for lunch expense made for guest', 0.00, 840.00 FROM accounts WHERE account_code = '10100';

-- Entry: 218
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0d40d1d4-c820-426b-8c3d-7002a74b529f', 'JE-000224', '2025-05-28', 'Paid for Staff lunch expense', 'JV-218', 'journal_entry', 350.00, 350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5c46e620-4c39-4c79-9ab2-f0f2398690a2', '0d40d1d4-c820-426b-8c3d-7002a74b529f', id, 'Paid for Staff lunch expense', 350.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '19f94400-eb77-4b40-82a2-6d61335e4f3a', '0d40d1d4-c820-426b-8c3d-7002a74b529f', id, 'Paid for Staff lunch expense', 0.00, 350.00 FROM accounts WHERE account_code = '10100';

-- Entry: 219
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d52e295e-704f-4e02-a110-030f3ff280e4', 'JE-000225', '2025-05-31', 'Paid for Staff lunch expense', 'JV-219', 'journal_entry', 720.00, 720.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c3e9cdd4-5a2b-44b6-bdda-15679883f230', 'd52e295e-704f-4e02-a110-030f3ff280e4', id, 'Paid for Staff lunch expense', 620.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ebafccdf-04f2-4eb1-bbb2-b7cb9bfae962', 'd52e295e-704f-4e02-a110-030f3ff280e4', id, 'Dish washing liquid', 100.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '05cf341e-d799-4b7a-8936-4e9f327fb398', 'd52e295e-704f-4e02-a110-030f3ff280e4', id, 'Paid for Staff lunch expense and shampoo', 0.00, 720.00 FROM accounts WHERE account_code = '10100';

-- Entry: 220
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b2c04a32-8d52-494a-90ad-b499490baa47', 'JE-000226', '2025-05-31', 'Paid for Guard''s Friday food expense.', 'JV-220', 'journal_entry', 220.00, 220.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3ee4c38f-936c-47e8-b41e-6b20495fa28e', 'b2c04a32-8d52-494a-90ad-b499490baa47', id, 'Paid for Guard''s Friday food expense.', 220.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4fc377b1-1da9-4368-a892-654e60b6ea37', 'b2c04a32-8d52-494a-90ad-b499490baa47', id, 'Paid for Guard''s Friday food expense.', 0.00, 220.00 FROM accounts WHERE account_code = '10100';

-- Entry: 221
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d42863eb-7190-4127-896b-e2b256c84523', 'JE-000227', '2025-05-31', 'Taxi used by Musafer to DAB', 'JV-221', 'journal_entry', 13568.68, 13568.68, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2907e780-1d88-40fa-94cb-90f05ec58cdb', 'd42863eb-7190-4127-896b-e2b256c84523', id, 'Taxi used by Musafer to DAB', 120.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4a9d201d-21d8-4531-aaac-00d3249c76a8', 'd42863eb-7190-4127-896b-e2b256c84523', id, 'Taxi used by Musafer to DAB', 0.00, 120.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'be7b158d-8215-4d3b-8ab0-4e63ee3af836', 'd42863eb-7190-4127-896b-e2b256c84523', id, 'Depreciation expense occurred for the month of May 2025', 13448.68, 0.00 FROM accounts WHERE account_code = '61900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '975bb026-49cd-4092-a0c4-ef36f35d1503', 'd42863eb-7190-4127-896b-e2b256c84523', id, 'Depreciation expense occurred for the month of May 2025', 0.00, 4256.17 FROM accounts WHERE account_code = '17202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8c9bf56f-fda3-4b39-b4cf-aa2c81aeb168', 'd42863eb-7190-4127-896b-e2b256c84523', id, 'Depreciation expense occurred for the month of May 2025', 0.00, 6857.04 FROM accounts WHERE account_code = '17302';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ee774001-6846-4766-a30a-bb8e5e4c9bfb', 'd42863eb-7190-4127-896b-e2b256c84523', id, 'Depreciation expense occurred for the month of May 2025', 0.00, 2335.47 FROM accounts WHERE account_code = '17102';

-- Entry: 222
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('55c4494b-702b-4164-93c3-92417289a4e3', 'JE-000228', '2025-05-31', 'Salary payable for the month of May 2025', 'JV-222', 'journal_entry', 298000.00, 298000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '10dcbd41-bf48-4dac-a626-ea95a4cb7b6a', '55c4494b-702b-4164-93c3-92417289a4e3', id, 'Salary payable for the month of May 2025', 298000.00, 0.00 FROM accounts WHERE account_code = '60001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5265b5be-579c-4935-b72b-6c333ae7d3e9', '55c4494b-702b-4164-93c3-92417289a4e3', id, 'Salary payable for the month of May 2025', 0.00, 50600.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '418868a9-01d5-4179-9ef2-b0c1932ea1e7', '55c4494b-702b-4164-93c3-92417289a4e3', id, 'Salary payable for the month of May 2025', 0.00, 50600.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f0d9240c-dc65-4a88-aede-a7458b54fe9e', '55c4494b-702b-4164-93c3-92417289a4e3', id, 'Salary payable for the month of May 2025', 0.00, 50600.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '930d8ff8-a44d-47e8-b6b9-b5d3b1197fc1', '55c4494b-702b-4164-93c3-92417289a4e3', id, 'Salary payable for the month of May 2025', 0.00, 11860.00 FROM accounts WHERE account_code = '20155';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '39944fe8-7818-41a8-b430-1eb592c94542', '55c4494b-702b-4164-93c3-92417289a4e3', id, 'Salary payable for the month of May 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd1d3d6d2-0e14-4a2e-bf73-77361f5a6acc', '55c4494b-702b-4164-93c3-92417289a4e3', id, 'Salary payable for the month of May 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '10f074b0-897d-435d-9f37-ecf0ad905841', '55c4494b-702b-4164-93c3-92417289a4e3', id, 'Salary payable for the month of May 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e05b4d2-4638-44a6-8e0a-54d85a39a701', '55c4494b-702b-4164-93c3-92417289a4e3', id, 'Salary payable for the month of May 2025', 0.00, 9900.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '51a85b0f-eb0c-42bc-bb89-a56c7bfee61a', '55c4494b-702b-4164-93c3-92417289a4e3', id, 'Salary payable for the month of May 2025', 0.00, 28100.00 FROM accounts WHERE account_code = '20160';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4f0765da-138f-469a-87fc-4065b7c0ba78', '55c4494b-702b-4164-93c3-92417289a4e3', id, 'Salary payable for the month of May 2025', 0.00, 28100.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b62d25fe-9559-4fc8-ad76-b07447f2162d', '55c4494b-702b-4164-93c3-92417289a4e3', id, 'Salary payable for the month of May 2025', 0.00, 28100.00 FROM accounts WHERE account_code = '20165';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e871d9d2-7da6-4f5a-be9a-e60c5c041680', '55c4494b-702b-4164-93c3-92417289a4e3', id, 'Salary taxi payable for the month of May 2025', 0.00, 19260.00 FROM accounts WHERE account_code = '21100';

-- Entry: 223
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('46300013-bd70-4884-bd70-a02afbc8affd', 'JE-000229', '2025-06-01', 'Paid for Staff lunch expense', 'JV-223', 'journal_entry', 250.00, 250.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9a0b0da7-b77f-411a-9818-05978bf4ac7a', '46300013-bd70-4884-bd70-a02afbc8affd', id, 'Paid for Staff lunch expense', 250.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1cb600c2-7d75-4606-be8c-f33afcd30de2', '46300013-bd70-4884-bd70-a02afbc8affd', id, 'Paid for Staff lunch expense', 0.00, 250.00 FROM accounts WHERE account_code = '10100';

-- Entry: 224
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a18c387e-453b-460a-904d-d814fc02acd4', 'JE-000230', '2025-06-02', 'Paid for the electricity bill for the month of Hamal and Sawr 1404', 'JV-224', 'journal_entry', 5318.00, 5318.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6ef6b0b0-1528-4463-b848-351fc2abd410', 'a18c387e-453b-460a-904d-d814fc02acd4', id, 'Paid for the electricity bill for the month of Hamal and Sawr 1404', 5318.00, 0.00 FROM accounts WHERE account_code = '61101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a037dddf-fc66-4565-93f9-0011e30fba5f', 'a18c387e-453b-460a-904d-d814fc02acd4', id, 'Paid for the electricity bill for the month of Hamal and Sawr 1404', 0.00, 5318.00 FROM accounts WHERE account_code = '10100';

-- Entry: 225
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2e227f56-6450-4b56-8624-9e993214891d', 'JE-000231', '2025-06-02', 'Paid for daily food expense of staff', 'JV-225', 'journal_entry', 120.00, 120.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ac263470-a831-4a96-bebf-8c358f66dc68', '2e227f56-6450-4b56-8624-9e993214891d', id, 'Paid for daily food expense of staff', 120.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1bf3130a-3968-4449-9ddd-8510f963046f', '2e227f56-6450-4b56-8624-9e993214891d', id, 'Paid for daily food expense of staff', 0.00, 120.00 FROM accounts WHERE account_code = '10100';

-- Entry: 226
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('acbdb25c-7fae-4755-9c22-861986485797', 'JE-000232', '2025-06-03', 'Paid for daily food expense of staff', 'JV-226', 'journal_entry', 600.00, 600.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a6fce2eb-721f-4aca-b395-550d9750b886', 'acbdb25c-7fae-4755-9c22-861986485797', id, 'Paid for daily food expense of staff', 600.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e2365bf-fa58-4356-9c66-5cc5b86962e0', 'acbdb25c-7fae-4755-9c22-861986485797', id, 'Paid for daily food expense of staff', 0.00, 600.00 FROM accounts WHERE account_code = '10100';

-- Entry: 227
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bfe346b8-9bdd-421a-9137-254131b31844', 'JE-000233', '2025-06-04', 'Paid for daily food expense of staff and drinking water', 'JV-227', 'journal_entry', 460.00, 460.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5cf5a13d-4e59-4a7c-a60e-014bdb6ae140', 'bfe346b8-9bdd-421a-9137-254131b31844', id, 'Paid for daily food expense of staff and drinking water', 460.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '736f5164-5edc-4def-8389-4fab67923e22', 'bfe346b8-9bdd-421a-9137-254131b31844', id, 'Paid for daily food expense of staff and drinking water', 0.00, 460.00 FROM accounts WHERE account_code = '10100';

-- Entry: 228
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b32c5f4c-be4b-4d0e-8d95-c3e032d7dfa5', 'JE-000234', '2025-06-05', 'Paid for purchasing note book for Hanifullah Momand', 'JV-228', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '551e48df-a425-4035-b963-ea6671678b8c', 'b32c5f4c-be4b-4d0e-8d95-c3e032d7dfa5', id, 'Paid for purchasing note book for Hanifullah Momand', 100.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'afcd1056-bc70-42fd-871b-bfa36edc2b02', 'b32c5f4c-be4b-4d0e-8d95-c3e032d7dfa5', id, 'Paid for purchasing note book for Hanifullah Momand', 0.00, 100.00 FROM accounts WHERE account_code = '10100';

-- Entry: 229
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('165f30f8-c8c8-4ac8-80fb-ffbc67a5070e', 'JE-000235', '2025-06-05', 'Paid for taxi used by Musafer', 'JV-229', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f024520a-5ed3-4eac-b99c-164a9f9f157f', '165f30f8-c8c8-4ac8-80fb-ffbc67a5070e', id, 'Paid for taxi used by Musafer', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5f3e3f9d-f811-4e6f-93ff-86fb2a7c951b', '165f30f8-c8c8-4ac8-80fb-ffbc67a5070e', id, 'Paid for taxi used by Musafer', 0.00, 100.00 FROM accounts WHERE account_code = '10100';

-- Entry: 230
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8fdcc38d-0ddf-4851-a532-aad88485c927', 'JE-000236', '2025-06-05', 'Paid for Breads purchase for the month of May 2025', 'JV-230', 'journal_entry', 3970.00, 3970.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3a9b2574-9e12-4a65-97df-7efee61213b4', '8fdcc38d-0ddf-4851-a532-aad88485c927', id, 'Paid for Breads purchase for the month of May 2025', 3970.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e9930107-c669-4691-9c5d-316217cd3885', '8fdcc38d-0ddf-4851-a532-aad88485c927', id, 'Paid for Breads purchase for the month of May 2025', 0.00, 3970.00 FROM accounts WHERE account_code = '10100';

-- Entry: 231
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d3194be1-b1e5-4b8c-a4d7-928e38794487', 'JE-000237', '2025-06-05', 'Salary Paid for the month of May 2025 (AFN3000 deducted for the salary advance)', 'JV-231', 'journal_entry', 275740.00, 275740.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '68d72b99-0e8e-4cdd-82ec-042e7680ffcd', 'd3194be1-b1e5-4b8c-a4d7-928e38794487', id, 'Salary Paid for the month of May 2025 (AFN3000 deducted for the salary advance)', 47600.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd9ca817e-895f-4a62-86e9-d538cd537511', 'd3194be1-b1e5-4b8c-a4d7-928e38794487', id, 'Salary Paid for the month of May 2025', 50600.00, 0.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eca04656-6c74-4451-98b8-d242df71142c', 'd3194be1-b1e5-4b8c-a4d7-928e38794487', id, 'Salary Paid for the month of May 2025', 50600.00, 0.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1120fd8c-3896-4980-a69d-3a701bd7d49d', 'd3194be1-b1e5-4b8c-a4d7-928e38794487', id, 'Salary Paid for the month of May 2025', 11860.00, 0.00 FROM accounts WHERE account_code = '20155';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '087021c4-a322-47e7-ad03-13b7d408dd00', 'd3194be1-b1e5-4b8c-a4d7-928e38794487', id, 'Salary Paid for the month of May 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4c02a52d-b61c-429c-8a13-594816df7a4c', 'd3194be1-b1e5-4b8c-a4d7-928e38794487', id, 'Salary Paid for the month of May 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b5de63cc-f1c0-449a-8ad5-cd09bd7daa88', 'd3194be1-b1e5-4b8c-a4d7-928e38794487', id, 'Salary Paid for the month of May 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6d6d8fbc-181f-4dd6-a2bd-55d0e43b667b', 'd3194be1-b1e5-4b8c-a4d7-928e38794487', id, 'Salary Paid for the month of May 2025', 9900.00, 0.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '41dfbbe0-72fc-4cf3-840a-a59bf5a2751c', 'd3194be1-b1e5-4b8c-a4d7-928e38794487', id, 'Salary Paid for the month of May 2025', 28100.00, 0.00 FROM accounts WHERE account_code = '20160';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7270166d-5470-4110-a39c-5d00c85d8328', 'd3194be1-b1e5-4b8c-a4d7-928e38794487', id, 'Salary Paid for the month of May 2025', 28100.00, 0.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '86e72d29-8d8c-444c-976f-56ce4e312bdb', 'd3194be1-b1e5-4b8c-a4d7-928e38794487', id, 'Salary Paid for the month of May 2025', 28100.00, 0.00 FROM accounts WHERE account_code = '20165';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9fcf65ec-36c8-4ca9-824e-790de95e600b', 'd3194be1-b1e5-4b8c-a4d7-928e38794487', id, 'Salary Paid for the month of May 2025', 0.00, 275740.00 FROM accounts WHERE account_code = '10100';

-- Entry: 232
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9ca12047-19e9-45fc-b266-628ca6cb9b7e', 'JE-000238', '2025-06-05', 'House rent prepaid for the months of Jawza and Saratan 1404', 'JV-232', 'journal_entry', 60000.00, 60000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '88beab67-7af5-437c-8937-999480dfcfd0', '9ca12047-19e9-45fc-b266-628ca6cb9b7e', id, 'House rent prepaid for the months of Jawza and Saratan 1404', 60000.00, 0.00 FROM accounts WHERE account_code = '13100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cc45f327-606c-4ba4-83af-cee4c4089c76', '9ca12047-19e9-45fc-b266-628ca6cb9b7e', id, 'House rent prepaid for the months of Jawza and Saratan 1404', 0.00, 60000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 233
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e39941bd-f15f-4684-9c68-6df6c660804a', 'JE-000239', '2025-06-11', 'Paid 100USD to Easy Connect for the month of May-2025 internet fee @ 69.86 based on DAB exchange rate of the day.', 'JV-233', 'journal_entry', 6986.00, 6986.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7652dd1b-4b9f-4c0a-93c4-caf78e2f3e68', 'e39941bd-f15f-4684-9c68-6df6c660804a', id, 'Paid 100USD to Easy Connect for the month of May-2025 internet fee @ 69.86 based on DAB exchange rate of the day.', 6986.00, 0.00 FROM accounts WHERE account_code = '61202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '896b7fc0-07a4-49a1-a32f-c5a09b61bba9', 'e39941bd-f15f-4684-9c68-6df6c660804a', id, 'Paid 100USD to Easy Connect for the month of May-2025 internet fee @ 69.86 based on DAB exchange rate of the day.', 0.00, 6986.00 FROM accounts WHERE account_code = '10100';

-- Entry: 234
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0be357c6-618e-400a-a399-04d6973059b1', 'JE-000240', '2025-06-11', 'Paid for daily lunch expense', 'JV-234', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4abd785e-d56b-493f-9db2-c1b052b7eaa8', '0be357c6-618e-400a-a399-04d6973059b1', id, 'Paid for daily lunch expense', 150.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e851c5b8-584f-4994-ad06-bc4b0ecabfe0', '0be357c6-618e-400a-a399-04d6973059b1', id, 'Paid for daily lunch expense', 0.00, 150.00 FROM accounts WHERE account_code = '10100';

-- Entry: 235
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('68b0305f-ea78-4d75-99dd-f7064ec212c7', 'JE-000241', '2025-06-14', 'Paid for daily lunch expense', 'JV-235', 'journal_entry', 340.00, 340.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c0b4b166-e143-45a6-897e-e29e88670742', '68b0305f-ea78-4d75-99dd-f7064ec212c7', id, 'Paid for daily lunch expense', 340.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '58a1556b-a51e-4627-b7a7-299ac292dad0', '68b0305f-ea78-4d75-99dd-f7064ec212c7', id, 'Paid for daily lunch expense', 0.00, 340.00 FROM accounts WHERE account_code = '10100';

-- Entry: 236
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('49426ebf-3806-4845-8769-9257e8359d31', 'JE-000242', '2025-06-15', 'Paid for daily lunch expense', 'JV-236', 'journal_entry', 240.00, 240.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c9ded04e-eb66-46a7-8b49-61b217cad70e', '49426ebf-3806-4845-8769-9257e8359d31', id, 'Paid for daily lunch expense', 240.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '02265623-2def-49db-93d0-aefcde78f9b1', '49426ebf-3806-4845-8769-9257e8359d31', id, 'Paid for daily lunch expense', 0.00, 240.00 FROM accounts WHERE account_code = '10100';

-- Entry: 237
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3477055f-1601-4db4-9678-69f7a87dc77d', 'JE-000243', '2025-06-17', 'Paid to Shahpoor for personal use', 'JV-237', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0d3cfdd7-cfcc-4a0c-81b6-17824bf01910', '3477055f-1601-4db4-9678-69f7a87dc77d', id, 'Paid to Shahpoor for personal use', 1000.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ed0ba5d0-f23a-4282-a157-0e805b1fb9fd', '3477055f-1601-4db4-9678-69f7a87dc77d', id, 'Paid to Shahpoor for personal use', 0.00, 1000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 238
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3743b38e-58e3-4656-aa28-ce5a63670c2f', 'JE-000244', '2025-06-17', 'Purchased Chocolate, Green Tea, Sugar, and Nutri-c', 'JV-238', 'journal_entry', 1300.00, 1300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3322346a-3226-4cca-a629-042d8f28fda4', '3743b38e-58e3-4656-aa28-ce5a63670c2f', id, 'Purchased Chocolate, Green Tea, Sugar, and Nutri-c', 1040.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1946dfcf-7ecc-4b1a-8b0f-b0b191827db7', '3743b38e-58e3-4656-aa28-ce5a63670c2f', id, 'Paid for staff lunch expenses', 260.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '78293c22-9cef-4a0a-bf45-5443fa32cb55', '3743b38e-58e3-4656-aa28-ce5a63670c2f', id, 'Paid for staff lunch expenses and some refreshment Items', 0.00, 1300.00 FROM accounts WHERE account_code = '10100';

-- Entry: 239
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('951765aa-3257-40a2-a16f-1c339b59d0f6', 'JE-000245', '2025-06-18', 'Paid for staff daily food expense', 'JV-239', 'journal_entry', 110.00, 110.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eb741946-c7b6-4cf8-85e1-dc597326b78d', '951765aa-3257-40a2-a16f-1c339b59d0f6', id, 'Paid for staff daily food expense', 110.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9ea56dc6-bc36-4158-a695-e801c5037e81', '951765aa-3257-40a2-a16f-1c339b59d0f6', id, 'Paid for staff daily food expense', 0.00, 110.00 FROM accounts WHERE account_code = '10100';

-- Entry: 240
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('acd7ae2c-99e6-439a-8091-9a52ad888e60', 'JE-000246', '2025-06-18', 'Paid for staff daily food expense', 'JV-240', 'journal_entry', 140.00, 140.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '614fd6b7-3430-45f5-8eaf-e8e7ea407fa4', 'acd7ae2c-99e6-439a-8091-9a52ad888e60', id, 'Paid for staff daily food expense', 140.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e7eeb8fe-db19-4a38-b02f-22a87d46f4ce', 'acd7ae2c-99e6-439a-8091-9a52ad888e60', id, 'Paid for staff daily food expense', 0.00, 140.00 FROM accounts WHERE account_code = '10100';

-- Entry: 241
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('df83a6c0-2531-4773-a105-ab3f87bae12b', 'JE-000247', '2025-06-18', 'Paid for the Power Generator Fuel', 'JV-241', 'journal_entry', 1642.00, 1642.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '56145cbc-0760-4aad-89df-83e0d7657441', 'df83a6c0-2531-4773-a105-ab3f87bae12b', id, 'Paid for the Power Generator Fuel', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f7363117-9329-47f4-afe8-2a66ddb9a601', 'df83a6c0-2531-4773-a105-ab3f87bae12b', id, 'Paid for Gas used for the kitchen', 452.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6a3079c8-f05f-48fd-8039-2f4760792028', 'df83a6c0-2531-4773-a105-ab3f87bae12b', id, 'Paid for staff daily food expense', 650.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7f62d5ce-a4e4-40f1-87e3-a985636c2221', 'df83a6c0-2531-4773-a105-ab3f87bae12b', id, 'Taxi used by Musafer to bring the items', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '884ff046-1ec0-4de0-8aab-d1eca30df31e', 'df83a6c0-2531-4773-a105-ab3f87bae12b', id, 'Paid for Gas, fuel, food expense, and taxi charges', 0.00, 1642.00 FROM accounts WHERE account_code = '10100';

-- Entry: 242
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('10940c00-ef6c-4f5c-aa64-788ecc28b0f9', 'JE-000248', '2025-06-18', 'Paid for one tanker water for the office use', 'JV-242', 'journal_entry', 800.00, 800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e6d19e6c-f774-4393-b1d5-25c623110631', '10940c00-ef6c-4f5c-aa64-788ecc28b0f9', id, 'Paid for one tanker water for the office use', 800.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6f2a1c74-6770-4466-92e5-c398f25d9e1b', '10940c00-ef6c-4f5c-aa64-788ecc28b0f9', id, 'Paid for one tanker water for the office use', 0.00, 800.00 FROM accounts WHERE account_code = '10100';

-- Entry: 243
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('48e70904-bec4-4c36-be79-376dc1545693', 'JE-000249', '2025-06-18', 'Paid for taxi charges used by Musafer DAB', 'JV-243', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aefbad96-1298-4beb-b69e-0ef988598f5b', '48e70904-bec4-4c36-be79-376dc1545693', id, 'Paid for taxi charges used by Musafer DAB', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ff222c4a-f5b1-4688-b1eb-b4b57a7f9875', '48e70904-bec4-4c36-be79-376dc1545693', id, 'Paid for taxi charges used by Musafer DAB', 0.00, 100.00 FROM accounts WHERE account_code = '10100';

-- Entry: 244
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('11bb3a77-36b1-49b4-a8b4-0a3783062c05', 'JE-000250', '2025-06-18', 'Paid for taxi charges by Musafer to Minsistry of Interior', 'JV-244', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '78536048-fe62-4988-931f-777904e122cb', '11bb3a77-36b1-49b4-a8b4-0a3783062c05', id, 'Paid for taxi charges by Musafer to Minsistry of Interior', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '62ed7ff7-3b7b-44a0-8b11-40b2659925ac', '11bb3a77-36b1-49b4-a8b4-0a3783062c05', id, 'Paid for taxi charges by Musafer to Minsistry of Interior', 0.00, 100.00 FROM accounts WHERE account_code = '10100';

-- Entry: 245
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fa5a7743-9cac-45eb-ad68-2359f6472b0f', 'JE-000251', '2025-06-19', 'Paid for tissue paper', 'JV-245', 'journal_entry', 900.00, 900.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd8e1bea2-99fc-4fbe-9736-9274828ca89e', 'fa5a7743-9cac-45eb-ad68-2359f6472b0f', id, 'Paid for tissue paper', 30.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '96f11f66-c41d-4be0-a14f-b73f787abf29', 'fa5a7743-9cac-45eb-ad68-2359f6472b0f', id, 'Paid for the staff lunch expense', 180.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fa743df1-7c46-4d72-8391-691ea0e1c6aa', 'fa5a7743-9cac-45eb-ad68-2359f6472b0f', id, 'Paid for the staff lunch expense and tissue paper during Eid ul Adha', 0.00, 210.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '54afdc45-0dd0-4568-9d21-3f115f0c2d8b', 'fa5a7743-9cac-45eb-ad68-2359f6472b0f', id, 'Paid for security guards lunch expense during Eid ul Adha', 350.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '56bd0d94-7033-4263-bb5f-2da9d0015afb', 'fa5a7743-9cac-45eb-ad68-2359f6472b0f', id, 'Paid for security guards lunch expense during Eid ul Adha', 0.00, 350.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '341757d6-4c95-49e6-802e-30054120cb07', 'fa5a7743-9cac-45eb-ad68-2359f6472b0f', id, 'Paid for security guards lunch expense during Eid ul Adha', 340.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c7075fda-8f9f-44dd-9926-0a68a7ef2781', 'fa5a7743-9cac-45eb-ad68-2359f6472b0f', id, 'Paid for security guards lunch expense during Eid ul Adha', 0.00, 340.00 FROM accounts WHERE account_code = '10100';

-- Entry: 246
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('06fc0b14-d05e-420f-b60b-f1bf19601cc0', 'JE-000252', '2025-06-19', 'Salary advances paid to Mashal Achakzai', 'JV-246', 'journal_entry', 4000.00, 4000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a10f55ff-a95d-4f1e-966c-40f91969d65a', '06fc0b14-d05e-420f-b60b-f1bf19601cc0', id, 'Salary advances paid to Mashal Achakzai', 2000.00, 0.00 FROM accounts WHERE account_code = '20166';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3f95ad55-65e2-4ba3-a186-c1aeca749ce7', '06fc0b14-d05e-420f-b60b-f1bf19601cc0', id, 'Salary advances paid to Faisal Achakzai', 2000.00, 0.00 FROM accounts WHERE account_code = '20167';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '160d9668-e07a-49b6-93b6-73976bef28ed', '06fc0b14-d05e-420f-b60b-f1bf19601cc0', id, 'Salary advances paid to Faisal Achakzai and Faisal Achakzai', 0.00, 4000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 247
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f1d96c61-8113-4c20-b53e-b41414aadf76', 'JE-000253', '2025-06-19', 'Paid for stationery for the office use', 'JV-247', 'journal_entry', 3810.00, 3810.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a24a404e-28ca-4317-8dc8-aabd7e3dcf35', 'f1d96c61-8113-4c20-b53e-b41414aadf76', id, 'Paid for stationery for the office use', 3810.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6d7d7612-5ef6-4bb9-96a8-8030fe55d922', 'f1d96c61-8113-4c20-b53e-b41414aadf76', id, 'Paid for stationery for the office use', 0.00, 3810.00 FROM accounts WHERE account_code = '10100';

-- Entry: 248
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f8b339bd-18e8-44f5-8e8d-c8c05161584d', 'JE-000254', '2025-06-19', 'Drinking water for office staff use', 'JV-248', 'journal_entry', 240.00, 240.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '72906ea5-c7a9-4822-960c-c47bc11ca43e', 'f8b339bd-18e8-44f5-8e8d-c8c05161584d', id, 'Drinking water for office staff use', 240.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5b6959c3-5f8b-4c24-b8b8-3326c8e05135', 'f8b339bd-18e8-44f5-8e8d-c8c05161584d', id, 'Drinking water for office staff use', 0.00, 240.00 FROM accounts WHERE account_code = '10100';

-- Entry: 249
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('473b2568-0888-4491-a84c-3005ffe83701', 'JE-000255', '2025-06-20', 'Guards Friday food expense', 'JV-249', 'journal_entry', 200.00, 200.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'afd543ea-48d7-4e57-b9b5-7726cd68e90a', '473b2568-0888-4491-a84c-3005ffe83701', id, 'Guards Friday food expense', 200.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2f6df347-ecb5-45de-a3a3-b0429d63fc84', '473b2568-0888-4491-a84c-3005ffe83701', id, 'Guards Friday food expense', 0.00, 200.00 FROM accounts WHERE account_code = '10100';

-- Entry: 250
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('616958dd-0923-4b47-ac16-b6bec319e71c', 'JE-000256', '2025-06-21', 'Office rent prepaid for the month of Jawza 1404', 'JV-250', 'journal_entry', 33000.00, 33000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e481187-6973-44be-b563-fcd238c42d44', '616958dd-0923-4b47-ac16-b6bec319e71c', id, 'Office rent prepaid for the month of Jawza 1404', 33000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6b65549c-0eae-4991-9b05-b67423d914ca', '616958dd-0923-4b47-ac16-b6bec319e71c', id, 'House rent tax withheld for the month of Jawza 1404', 0.00, 3000.00 FROM accounts WHERE account_code = '21200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ff86435b-2b44-49a7-8f84-45d8a3bf8498', '616958dd-0923-4b47-ac16-b6bec319e71c', id, 'Office rent prepaid for the month of Jawza 1404', 0.00, 30000.00 FROM accounts WHERE account_code = '13100';

-- Entry: 251
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('4ef27fc7-3a3a-4f60-8ee9-33a5b692ed92', 'JE-000257', '2025-06-21', 'Paid for the power generator fuel', 'JV-251', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8546f8c5-469e-4457-8db0-81d6a79906c5', '4ef27fc7-3a3a-4f60-8ee9-33a5b692ed92', id, 'Paid for the power generator fuel', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6ba3641a-f592-4cad-b87a-5e8278330d48', '4ef27fc7-3a3a-4f60-8ee9-33a5b692ed92', id, 'Paid for the power generator fuel', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 252
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ddbb675b-6c8f-4540-a4b8-396244ed88f1', 'JE-000258', '2025-06-21', 'Paid for purchasing Nutri-C for the guests', 'JV-252', 'journal_entry', 360.00, 360.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b42fcd48-1a4c-4295-899d-d3bf403d274e', 'ddbb675b-6c8f-4540-a4b8-396244ed88f1', id, 'Paid for purchasing Nutri-C for the guests', 360.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2b3febc9-c9eb-4733-8b2c-ce40f6a528be', 'ddbb675b-6c8f-4540-a4b8-396244ed88f1', id, 'Paid for purchasing Nutri-C for the guests', 0.00, 360.00 FROM accounts WHERE account_code = '10100';

-- Entry: 253
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8a890035-a03b-4f7c-873f-a5208b6ab375', 'JE-000259', '2025-06-21', 'Paid for purchasing one tanker water for the office us', 'JV-253', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '037bd8e1-1227-4fd4-a4ec-8969cda00ed9', '8a890035-a03b-4f7c-873f-a5208b6ab375', id, 'Paid for purchasing one tanker water for the office us', 1000.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3553bb30-17d0-4990-917d-f657b9f7660c', '8a890035-a03b-4f7c-873f-a5208b6ab375', id, 'Paid for purchasing one tanker water for the office us', 0.00, 1000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 254
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c3702e43-6eb2-45b5-b40a-0c7358367a62', 'JE-000260', '2025-06-21', 'Taxi used by Musafer to DAB to received some letters', 'JV-254', 'journal_entry', 120.00, 120.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5bb7d83f-c2d9-41c3-8af2-a7c586166ec8', 'c3702e43-6eb2-45b5-b40a-0c7358367a62', id, 'Taxi used by Musafer to DAB to received some letters', 120.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '05d3f831-8d76-4c56-92ec-0c99be62310e', 'c3702e43-6eb2-45b5-b40a-0c7358367a62', id, 'Taxi used by Musafer to DAB to received some letters', 0.00, 120.00 FROM accounts WHERE account_code = '10100';

-- Entry: 255
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('96d545ff-9ea3-44e5-a56c-6f2120be79d5', 'JE-000261', '2025-06-21', 'Paid for daily food expense', 'JV-255', 'journal_entry', 280.00, 280.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b9a15f1a-2dce-45b1-8bb6-c60ef62daea4', '96d545ff-9ea3-44e5-a56c-6f2120be79d5', id, 'Paid for daily food expense', 190.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '55a95160-6684-46d5-b174-396400c4c210', '96d545ff-9ea3-44e5-a56c-6f2120be79d5', id, 'Paid for purchasing Nutri-C for guest', 90.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8124ce7e-a0e8-4600-9b8c-5e3df99b3aa3', '96d545ff-9ea3-44e5-a56c-6f2120be79d5', id, 'Paid for purchasing Nutri-C for guest and staff the day lunch expense', 0.00, 280.00 FROM accounts WHERE account_code = '10100';

-- Entry: 256
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('dc694e66-d892-49e6-b3be-2bc49ca7071f', 'JE-000262', '2025-06-21', 'Salary Advance paid to Shahpoor', 'JV-256', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '15bbdc4c-8ba2-4f0c-b4de-7a4e863aaf87', 'dc694e66-d892-49e6-b3be-2bc49ca7071f', id, 'Salary Advance paid to Shahpoor', 1000.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '70be55a3-6eec-40c5-80e6-ea65c6d4e727', 'dc694e66-d892-49e6-b3be-2bc49ca7071f', id, 'Salary Advance paid to Shahpoor', 0.00, 1000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 257
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5794a932-6233-4192-8195-31c7f0426f7a', 'JE-000263', '2025-06-21', 'Lunch expense paid to Guards for Friday, old bill', 'JV-257', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a245687e-1f39-4a1c-b51d-af35f3f21e3a', '5794a932-6233-4192-8195-31c7f0426f7a', id, 'Lunch expense paid to Guards for Friday, old bill', 150.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3e3423dd-ccdb-4cb5-9262-df660f8805f7', '5794a932-6233-4192-8195-31c7f0426f7a', id, 'Lunch expense paid to Guards for Friday, old bill', 0.00, 150.00 FROM accounts WHERE account_code = '10100';

-- Entry: 258
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('de29039f-fcd1-423e-9f7d-d45d645b67da', 'JE-000264', '2025-06-22', 'Paid for internet fee for the month of (07 June to 07 July 2025)', 'JV-258', 'journal_entry', 6000.00, 6000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '08af65ff-8964-4359-9eb9-e8138e7c0a83', 'de29039f-fcd1-423e-9f7d-d45d645b67da', id, 'Paid for internet fee for the month of (07 June to 07 July 2025)', 6000.00, 0.00 FROM accounts WHERE account_code = '61202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a5aef9e0-8d90-49c6-9ae0-c5cf4fe7509e', 'de29039f-fcd1-423e-9f7d-d45d645b67da', id, 'Paid for internet fee for the month of (07 June to 07 July 2025)', 0.00, 6000.00 FROM accounts WHERE account_code = '10100';

-- Entry: 259
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('52ff653b-0176-41f2-8b50-44259638e9d7', 'JE-000265', '2025-06-22', 'Paid for lunch expense of the HQ staff', 'JV-259', 'journal_entry', 530.00, 530.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9b234d99-1eaa-469b-8375-e6ffa3326846', '52ff653b-0176-41f2-8b50-44259638e9d7', id, 'Paid for lunch expense of the HQ staff', 530.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ced512ad-97bc-4d87-9427-c0d3945c5c4c', '52ff653b-0176-41f2-8b50-44259638e9d7', id, 'Paid for lunch expense of the HQ staff', 0.00, 530.00 FROM accounts WHERE account_code = '10100';

-- Entry: 260
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('10849057-29fb-496b-8379-7f1b149f8a00', 'JE-000266', '2025-06-22', 'Paid for the power generator fuel', 'JV-260', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7f743601-b08c-4675-a6d7-eed9bae705f5', '10849057-29fb-496b-8379-7f1b149f8a00', id, 'Paid for the power generator fuel', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1f06a198-24ed-4d56-a820-91a8771ece07', '10849057-29fb-496b-8379-7f1b149f8a00', id, 'Paid for the power generator fuel', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: 261
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5e44b915-58fc-426a-898f-fad63564c217', 'JE-000267', '2025-06-23', 'Paid for drinking water', 'JV-261', 'journal_entry', 240.00, 240.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '371bc477-7435-47ae-8da4-a720d1111ef3', '5e44b915-58fc-426a-898f-fad63564c217', id, 'Paid for drinking water', 240.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dfe3bdfe-e1af-4f24-b27e-ea0e4ba469df', '5e44b915-58fc-426a-898f-fad63564c217', id, 'Paid for drinking water', 0.00, 240.00 FROM accounts WHERE account_code = '10100';

-- Entry: 262
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('366a4960-a1e3-4af9-a125-01f35899c4ce', 'JE-000268', '2025-06-23', 'Daily food expense for the office staff', 'JV-262', 'journal_entry', 390.00, 390.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cbc39393-5ca4-4484-b54a-1dc4ef8a1283', '366a4960-a1e3-4af9-a125-01f35899c4ce', id, 'Daily food expense for the office staff', 390.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd284dc13-b76a-4f5a-9cc2-4f5f7f6ef9be', '366a4960-a1e3-4af9-a125-01f35899c4ce', id, 'Daily food expense for the office staff', 0.00, 390.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-263
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a8d648bb-33d1-46d2-9d3e-94e9cff7f880', 'JE-000269', '2025-06-24', 'Paid to Lateef for Tea on Eid days expense old bill', 'JV-JV-263', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fade134f-93b5-4878-a8ac-e463a364a167', 'a8d648bb-33d1-46d2-9d3e-94e9cff7f880', id, 'Paid to Lateef for Tea on Eid days expense old bill', 50.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0598ece2-ae42-472b-9be4-05e6bbe8adb0', 'a8d648bb-33d1-46d2-9d3e-94e9cff7f880', id, 'Paid to Lateef for eggs purchase on Eid days old bill', 50.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3819e0f5-b045-4500-a3aa-ae5dbe3411ad', 'a8d648bb-33d1-46d2-9d3e-94e9cff7f880', id, 'Paid to Lateef for eggs and Tea purchase on Eid days old bill', 0.00, 100.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-264
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2b105c80-481a-44fa-9edb-2da4ff09f673', 'JE-000270', '2025-06-24', 'Paid for Car fuel used by Shahpoor for the office work in two different days', 'JV-JV-264', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4585ea18-6dc7-44d7-a927-d74a1c778f38', '2b105c80-481a-44fa-9edb-2da4ff09f673', id, 'Paid for Car fuel used by Shahpoor for the office work in two different days', 1000.00, 0.00 FROM accounts WHERE account_code = '60901';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3d88a0c2-c1a2-4143-984f-13007e2bbbf3', '2b105c80-481a-44fa-9edb-2da4ff09f673', id, 'Paid for Car fuel used by Shahpoor for the office work in two different days', 0.00, 1000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-265
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0e1f32fc-10a0-4bf3-9ca8-5fd906be438f', 'JE-000271', '2025-06-24', 'Car fuel used by Shahpoor for meeting in UNAMA', 'JV-JV-265', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '49cc0054-fcc4-49c9-af13-155fefb3c673', '0e1f32fc-10a0-4bf3-9ca8-5fd906be438f', id, 'Car fuel used by Shahpoor for meeting in UNAMA', 500.00, 0.00 FROM accounts WHERE account_code = '60901';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '777912f8-5afb-445e-9be8-b6b189f1657d', '0e1f32fc-10a0-4bf3-9ca8-5fd906be438f', id, 'Car fuel used by Shahpoor for meeting in UNAMA', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-266
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('743079a9-7e31-41d4-b184-45f34a714094', 'JE-000272', '2025-06-24', 'Paid for lunch expense', 'JV-JV-266', 'journal_entry', 250.00, 250.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '47e10f7c-1948-451c-a48c-fa3ce7a63af9', '743079a9-7e31-41d4-b184-45f34a714094', id, 'Paid for lunch expense', 250.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f8dd1d98-bf48-4871-a306-f5b97295d09f', '743079a9-7e31-41d4-b184-45f34a714094', id, 'Paid for lunch expense', 0.00, 250.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-267
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b41a69c4-1881-475e-9227-66a2475fd0cc', 'JE-000273', '2025-06-24', 'Paid to Liaqat for taxi charges to Jalalabad bus station', 'JV-JV-267', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7f4aae62-3703-49cd-b706-7e01818c4808', 'b41a69c4-1881-475e-9227-66a2475fd0cc', id, 'Paid to Liaqat for taxi charges to Jalalabad bus station', 500.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '658628f7-3481-4881-9b6b-01e2d73f1a5a', 'b41a69c4-1881-475e-9227-66a2475fd0cc', id, 'Paid to Liaqat for taxi charges to Jalalabad bus station', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-268
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8bf92c05-fd62-4cfb-9710-688986ebf8bb', 'JE-000274', '2025-06-24', 'Taxi used by Musafer for the office work', 'JV-JV-268', 'journal_entry', 140.00, 140.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd46d752d-1eb3-4c25-86b7-32a694b21ced', '8bf92c05-fd62-4cfb-9710-688986ebf8bb', id, 'Taxi used by Musafer for the office work', 140.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd9eecc51-a2fa-47e6-9b43-84ad6a314014', '8bf92c05-fd62-4cfb-9710-688986ebf8bb', id, 'Taxi used by Musafer for the office work', 0.00, 140.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-269
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('26fd0fa9-4abb-482f-bfff-6cbb833fb748', 'JE-000275', '2025-06-25', 'Paid for the power generator fuel (Petrol A92)', 'JV-JV-269', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd6568207-c501-43eb-9e88-362854150dd2', '26fd0fa9-4abb-482f-bfff-6cbb833fb748', id, 'Paid for the power generator fuel (Petrol A92)', 1000.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6d40fd30-b324-4599-aa72-476cf6ddac6e', '26fd0fa9-4abb-482f-bfff-6cbb833fb748', id, 'Paid for the power generator fuel (Petrol A92)', 0.00, 1000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-270
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c19c6dbb-b9ba-4372-b449-5856e5a81a9d', 'JE-000276', '2025-06-25', 'Paid for the office staff lunch expense', 'JV-JV-270', 'journal_entry', 240.00, 240.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '14aadc02-cc06-4b63-9ed0-58e0bf88b976', 'c19c6dbb-b9ba-4372-b449-5856e5a81a9d', id, 'Paid for the office staff lunch expense', 240.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd7cb24af-95f6-4d9f-afa0-225d4df28b88', 'c19c6dbb-b9ba-4372-b449-5856e5a81a9d', id, 'Paid for the office staff lunch expense', 0.00, 240.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-271
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('136d9a54-c6be-46d4-8a1b-80076f99c0f5', 'JE-000277', '2025-06-26', 'Taxi Charges paid to Musafer to DAB to collect some documents', 'JV-JV-271', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6306cdb7-1452-41ae-a821-21b5c9ed5b55', '136d9a54-c6be-46d4-8a1b-80076f99c0f5', id, 'Taxi Charges paid to Musafer to DAB to collect some documents', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1ebf5813-25d2-450c-a654-e18206d63d57', '136d9a54-c6be-46d4-8a1b-80076f99c0f5', id, 'Taxi Charges paid to Musafer to DAB to collect some documents', 0.00, 100.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-272
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d1527de0-846e-43e4-83bb-3911dc9550eb', 'JE-000278', '2025-06-26', 'Taxi charge paid to Musafer for documents delivery to Jalalabad', 'JV-JV-272', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f79ede3b-bb38-4923-b43a-4072ee1d78ed', 'd1527de0-846e-43e4-83bb-3911dc9550eb', id, 'Taxi charge paid to Musafer for documents delivery to Jalalabad', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f4049e53-5f76-487c-8a9a-0ead794ae0cd', 'd1527de0-846e-43e4-83bb-3911dc9550eb', id, 'Taxi charge paid to Musafer for documents delivery to Jalalabad', 0.00, 100.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-273
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3d1e7e3a-7ccc-490c-bda7-d094215fc918', 'JE-000279', '2025-06-27', 'Lunch expense paid', 'JV-JV-273', 'journal_entry', 310.00, 310.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '25c978e0-8814-4188-8d74-3cca49f2b475', '3d1e7e3a-7ccc-490c-bda7-d094215fc918', id, 'Lunch expense paid', 310.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6823d690-707c-4e86-93f3-16b6558a9f8a', '3d1e7e3a-7ccc-490c-bda7-d094215fc918', id, 'Lunch expense paid', 0.00, 310.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-274
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('87e8d375-02f9-43e6-9922-c4443c112732', 'JE-000280', '2025-06-28', 'Office staff daily lunch expense paid', 'JV-JV-274', 'journal_entry', 720.00, 720.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '36517268-08ac-4f4b-87c7-cfaf690fe829', '87e8d375-02f9-43e6-9922-c4443c112732', id, 'Office staff daily lunch expense paid', 720.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '736736fb-7845-4929-8eaf-fe80d92f6f3f', '87e8d375-02f9-43e6-9922-c4443c112732', id, 'Office staff daily lunch expense paid', 0.00, 720.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-275
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('dd0e9087-9851-4548-924a-c84bcd8ed318', 'JE-000281', '2025-06-29', 'Advance Paid to Noor Muhammad for Jalalabad Branch Expenses', 'JV-JV-275', 'journal_entry', 20000.00, 20000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a848bcf7-bb9f-4ce7-ba95-f422f7f85a82', 'dd0e9087-9851-4548-924a-c84bcd8ed318', id, 'Advance Paid to Noor Muhammad for Jalalabad Branch Expenses', 20000.00, 0.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9fe38023-6835-41f4-ab8e-9e3244d6ca59', 'dd0e9087-9851-4548-924a-c84bcd8ed318', id, 'Advance Paid to Noor Muhammad for Jalalabad Branch Expenses', 0.00, 20000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-276
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8b572b07-95d3-41a5-ad56-d0c8f9fa6a25', 'JE-000282', '2025-06-29', 'Taxi charges paid to Musafer Momand to DAB for delivering documents', 'JV-JV-276', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '380fef5f-0795-46f7-8eb0-7c3b289b38d3', '8b572b07-95d3-41a5-ad56-d0c8f9fa6a25', id, 'Taxi charges paid to Musafer Momand to DAB for delivering documents', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1a5e6f44-803b-4044-b262-fcd9927b7033', '8b572b07-95d3-41a5-ad56-d0c8f9fa6a25', id, 'Taxi charges paid to Musafer Momand to DAB for delivering documents', 0.00, 100.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-277
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('84f6c92a-0645-4a69-b4eb-fcd5b44b1053', 'JE-000283', '2025-06-29', 'Paid for daily lunch expense', 'JV-JV-277', 'journal_entry', 590.00, 590.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1574ede5-6c6c-4124-a10c-48b791b8bbd8', '84f6c92a-0645-4a69-b4eb-fcd5b44b1053', id, 'Paid for daily lunch expense', 550.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f299a49a-e3e1-4e29-b444-0e317c0628fb', '84f6c92a-0645-4a69-b4eb-fcd5b44b1053', id, 'Purchased rubber for the pressure cooker.', 40.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '102667e3-5380-49fc-a073-edd0c4cf8046', '84f6c92a-0645-4a69-b4eb-fcd5b44b1053', id, 'Purchased rubber for the pressure cooker.', 0.00, 590.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-278
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('566f126e-2811-4b07-a8c7-ee70483475e9', 'JE-000284', '2025-06-30', 'Paid for staff daily food expenses', 'JV-JV-278', 'journal_entry', 310.00, 310.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '72b7b55b-8e7e-4094-9979-c21cbcd5b6bd', '566f126e-2811-4b07-a8c7-ee70483475e9', id, 'Paid for staff daily food expenses', 210.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fa77faf7-9fea-4517-b590-9c796134cb76', '566f126e-2811-4b07-a8c7-ee70483475e9', id, 'Purchased dish washing liquid', 100.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fa3c53d4-bdf7-44a3-8170-da637300afe6', '566f126e-2811-4b07-a8c7-ee70483475e9', id, 'Purchased dish washing liquid and staff daily lunch expenses', 0.00, 310.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-279
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('330daaf5-4fd2-43ff-80cb-4c44a59c0d8b', 'JE-000285', '2025-06-30', 'Paid to Faisal Achakzai for personal use', 'JV-JV-279', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9ac6e54d-81ff-4cb9-9fd1-c90f0c08aa09', '330daaf5-4fd2-43ff-80cb-4c44a59c0d8b', id, 'Paid to Faisal Achakzai for personal use', 1000.00, 0.00 FROM accounts WHERE account_code = '20167';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '38efbb4a-1424-4ba2-a6c3-87b617789051', '330daaf5-4fd2-43ff-80cb-4c44a59c0d8b', id, 'Paid to Faisal Achakzai for personal use', 0.00, 1000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-280
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('497a53dd-6312-4eab-b5df-eecc92e9a71d', 'JE-000286', '2025-06-30', 'Paid to Mashal Achakzai for personal use', 'JV-JV-280', 'journal_entry', 14448.68, 14448.68, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7908b475-5056-4648-8a19-43774b0cc8ce', '497a53dd-6312-4eab-b5df-eecc92e9a71d', id, 'Paid to Mashal Achakzai for personal use', 1000.00, 0.00 FROM accounts WHERE account_code = '20166';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '194c7cba-db3c-49b8-96c0-8e8ddeb6aeb4', '497a53dd-6312-4eab-b5df-eecc92e9a71d', id, 'Paid to Mashal Achakzai for personal use', 0.00, 1000.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6a5fc1ca-3725-4b40-b6f4-d77bbc715613', '497a53dd-6312-4eab-b5df-eecc92e9a71d', id, 'Depreciation expense occurred for the month of June  2025', 13448.68, 0.00 FROM accounts WHERE account_code = '61900';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'efe10a3a-3369-4f56-947c-a9330a40bcba', '497a53dd-6312-4eab-b5df-eecc92e9a71d', id, 'Depreciation expense occurred for the month of June  2025', 0.00, 4256.17 FROM accounts WHERE account_code = '17202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f8f83381-b62c-4dc7-b6b7-7ba04fe5b35b', '497a53dd-6312-4eab-b5df-eecc92e9a71d', id, 'Depreciation expense occurred for the month of June  2025', 0.00, 6857.04 FROM accounts WHERE account_code = '17302';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3d0862aa-6afe-4fc8-baf8-37e6a582e0c1', '497a53dd-6312-4eab-b5df-eecc92e9a71d', id, 'Depreciation expense occurred for the month of June  2025', 0.00, 2335.47 FROM accounts WHERE account_code = '17102';

-- Entry: JV-281
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('eb63051b-d7cf-4d4a-bd97-9ce29502007c', 'JE-000287', '2025-06-30', 'The financing Officers'' salary for the month of June 2025 (Mr. Abdul Shakoor and Faisal Achakzai)', 'JV-JV-281', 'journal_entry', 245647.00, 245647.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8945b4d3-9b52-4ef3-ba59-c3ea15624bbf', 'eb63051b-d7cf-4d4a-bd97-9ce29502007c', id, 'The financing Officers'' salary for the month of June 2025 (Mr. Abdul Shakoor and Faisal Achakzai)', 9750.00, 0.00 FROM accounts WHERE account_code = '51200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f625d60d-fab7-47db-9466-b71bbcd1f56d', 'eb63051b-d7cf-4d4a-bd97-9ce29502007c', id, 'Salary payable for the month of June 2025', 235897.00, 0.00 FROM accounts WHERE account_code = '60001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6cd6cbee-75ee-421d-8022-aa21aa49a158', 'eb63051b-d7cf-4d4a-bd97-9ce29502007c', id, 'Salary payable for the month of June 2025 for 15 days of the month', 0.00, 79231.00 FROM accounts WHERE account_code = '20169';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '39bc3810-f87b-4b7f-b331-9e69d11cd326', 'eb63051b-d7cf-4d4a-bd97-9ce29502007c', id, 'Salary payable for the month of June 2025 (2000 AdvanceAdjusted Against Salary)', 0.00, 28100.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '087ed33c-43d3-467d-9f6a-32050e0ef85a', 'eb63051b-d7cf-4d4a-bd97-9ce29502007c', id, 'Salary payable for the month of June 2025', 0.00, 37100.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd117e4a6-4404-41c4-a04b-5e7d1e93bf9e', 'eb63051b-d7cf-4d4a-bd97-9ce29502007c', id, 'Salary payable for the month of June 2025', 0.00, 37100.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eec0598b-0ab5-4532-b1ca-6224e4d7523f', 'eb63051b-d7cf-4d4a-bd97-9ce29502007c', id, 'Salary payable for the month of June 2025', 0.00, 11860.00 FROM accounts WHERE account_code = '20155';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ae03a863-0472-4db5-ab10-c6223a8ec977', 'eb63051b-d7cf-4d4a-bd97-9ce29502007c', id, 'Salary payable for the month of June 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '148070cf-71cd-4fd0-ace5-3b11cdd5add0', 'eb63051b-d7cf-4d4a-bd97-9ce29502007c', id, 'Salary payable for the month of June 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f8006160-9b41-444b-8bc5-e5c6fd51e60a', 'eb63051b-d7cf-4d4a-bd97-9ce29502007c', id, 'Salary payable for the month of June 2025', 0.00, 6960.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bcb71b17-81fb-4c5c-8f9c-56a3cd9c222b', 'eb63051b-d7cf-4d4a-bd97-9ce29502007c', id, 'Salary payable for the month of June 2025', 0.00, 5980.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a6e40602-d278-4864-b953-651d877eac03', 'eb63051b-d7cf-4d4a-bd97-9ce29502007c', id, 'Salary payable for the month of June 2025', 0.00, 3750.00 FROM accounts WHERE account_code = '20167';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f7d4eb9a-5302-43ae-a99b-9752874829d4', 'eb63051b-d7cf-4d4a-bd97-9ce29502007c', id, 'Salary payable for the month of June 2025', 0.00, 3750.00 FROM accounts WHERE account_code = '20166';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd262b884-a7c4-43dc-ba54-7576394bd4a7', 'eb63051b-d7cf-4d4a-bd97-9ce29502007c', id, 'Salary payable for the month of June 2025', 0.00, 2335.00 FROM accounts WHERE account_code = '20170';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '69a5db96-64b2-4667-9559-45b11f5ce718', 'eb63051b-d7cf-4d4a-bd97-9ce29502007c', id, 'Salary payable for the month of June 2025', 0.00, 15561.00 FROM accounts WHERE account_code = '21100';

-- Entry: JV-282
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c3a27430-f467-400b-8999-685301fd2339', 'JE-000288', '2025-07-01', 'Paid for Generator Fuel', 'JV-JV-282', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3bc93e2d-2d40-4965-9fb9-44da395ea79f', 'c3a27430-f467-400b-8999-685301fd2339', id, 'Paid for Generator Fuel', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c61afc0f-6b73-4245-9367-a5b23d68d24e', 'c3a27430-f467-400b-8999-685301fd2339', id, 'Paid for Generator Fuel', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-283
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('54afda9a-3e0d-4e83-8a07-cd9194ec690f', 'JE-000289', '2025-07-01', 'Paid for Nutri-C for guest', 'JV-JV-283', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '804b0687-e005-45f0-9633-439cb818dd1a', '54afda9a-3e0d-4e83-8a07-cd9194ec690f', id, 'Paid for Nutri-C for guest', 300.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2fba07a2-e491-48ed-a963-04c628603116', '54afda9a-3e0d-4e83-8a07-cd9194ec690f', id, 'Paid for Nutri-C for guest', 0.00, 300.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-284
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('97f62a22-3bf4-48fb-bc5b-b95cf50b2feb', 'JE-000290', '2025-07-01', 'Paid for staff Lunch', 'JV-JV-284', 'journal_entry', 140.00, 140.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '989f4ff9-a737-4c36-a3ca-8468a58e6f50', '97f62a22-3bf4-48fb-bc5b-b95cf50b2feb', id, 'Paid for staff Lunch', 140.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b827bba2-a1cf-42ee-b64f-55402e11d3ee', '97f62a22-3bf4-48fb-bc5b-b95cf50b2feb', id, 'Paid for staff Lunch', 0.00, 140.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-285
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1aade625-5cae-4048-907a-989c2371d137', 'JE-000291', '2025-07-02', 'Paid to purchase Paid to purchase Name Lable for CEO, Name lable for staff,', 'JV-JV-285', 'journal_entry', 2380.00, 2380.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ccf37448-1e81-48a4-a608-555633de8677', '1aade625-5cae-4048-907a-989c2371d137', id, 'Paid to purchase Paid to purchase Name Lable for CEO, Name lable for staff,', 1860.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a213ef57-3741-44f3-bfe7-11f0915d2015', '1aade625-5cae-4048-907a-989c2371d137', id, 'Paid to purchase , Ink for Epson printer', 400.00, 0.00 FROM accounts WHERE account_code = '60502';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bc5f9aaf-7bd9-4d09-a071-b7a0d48bc7e0', '1aade625-5cae-4048-907a-989c2371d137', id, 'Taxi charges', 120.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '152e3db6-6c19-453a-bee8-0c0b19201bf7', '1aade625-5cae-4048-907a-989c2371d137', id, 'Paid for purchase of Name Lable for CEO, name lable for staff, Ink for Eqson printer, and taxi charges.', 0.00, 2380.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-286
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a483a502-7c10-428b-83e7-6c0989168690', 'JE-000292', '2025-07-02', 'Taxi Charges paid to Liaqat to Jalalabad bus station', 'JV-JV-286', 'journal_entry', 350.00, 350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '187f5af2-6e47-4218-a526-7ddef4c2f821', 'a483a502-7c10-428b-83e7-6c0989168690', id, 'Taxi Charges paid to Liaqat to Jalalabad bus station', 350.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c8720ec8-2802-4c37-affd-3f0da6740ac3', 'a483a502-7c10-428b-83e7-6c0989168690', id, 'Taxi Charges paid to Liaqat to Jalalabad bus station', 0.00, 350.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-287
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9b99d727-892c-4c32-b7d3-e79f71a08b38', 'JE-000293', '2025-07-02', 'Paid to Shakoor for taxi to Printing press', 'JV-JV-287', 'journal_entry', 240.00, 240.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1022cea9-ee0c-44bc-9c04-90f463031321', '9b99d727-892c-4c32-b7d3-e79f71a08b38', id, 'Paid to Shakoor for taxi to Printing press', 240.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ec23ea34-64a9-4f9f-9297-87b358107200', '9b99d727-892c-4c32-b7d3-e79f71a08b38', id, 'Paid to Shakoor for taxi to Printing press', 0.00, 240.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-288
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('24f2c68f-e910-48ab-8f6a-65eb07b4b682', 'JE-000294', '2025-07-02', 'Paid to Shahpoor to DAB', 'JV-JV-288', 'journal_entry', 150.00, 150.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '57af2361-cd55-4216-807e-1b56ff34a0b1', '24f2c68f-e910-48ab-8f6a-65eb07b4b682', id, 'Paid to Shahpoor to DAB', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '05d089eb-706c-4788-9784-22937a8ff2b7', '24f2c68f-e910-48ab-8f6a-65eb07b4b682', id, 'Paid to Shahpoor to DAB', 0.00, 150.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-289
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d0d7f071-6411-4dae-9238-781c2d8240c4', 'JE-000295', '2025-07-02', 'Paid for Daily lunch expenses', 'JV-JV-289', 'journal_entry', 870.00, 870.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9b671b66-88d3-40ad-b2e6-12c6225c12d3', 'd0d7f071-6411-4dae-9238-781c2d8240c4', id, 'Paid for Daily lunch expenses', 530.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '739c16b2-43f2-4941-9c0f-3ab5302c56d9', 'd0d7f071-6411-4dae-9238-781c2d8240c4', id, 'Paid for tissue and toilet paper for the office use', 320.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6ea8d5aa-cb9a-46b8-b5b7-eb2ba0b453f6', 'd0d7f071-6411-4dae-9238-781c2d8240c4', id, 'Paid for two pairs of small batteries', 20.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '25ebb635-ac61-491b-9f1f-60f527e28389', 'd0d7f071-6411-4dae-9238-781c2d8240c4', id, 'Paid for Daily lunch expenses, tissue, toilet paper, and small batteries', 0.00, 870.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-290
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('da9bf336-f354-4b89-9a10-b228c0f1b0fc', 'JE-000296', '2025-07-02', 'Paid to Faisal to taxi to Bank', 'JV-JV-290', 'journal_entry', 90.00, 90.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '21688532-cc38-4d08-9e82-8cb0d3f15177', 'da9bf336-f354-4b89-9a10-b228c0f1b0fc', id, 'Paid to Faisal to taxi to Bank', 90.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aedd533e-c201-4d06-8a96-6361bb341c9b', 'da9bf336-f354-4b89-9a10-b228c0f1b0fc', id, 'Paid to Faisal to taxi to Bank', 0.00, 90.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-291
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('75304d68-df15-4fd4-84d1-d5247da57e6a', 'JE-000297', '2025-07-02', 'Paid for liquid Gas', 'JV-JV-291', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '16c0090b-d2d8-4a25-8cb6-61a6a3129b20', '75304d68-df15-4fd4-84d1-d5247da57e6a', id, 'Paid for liquid Gas', 500.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '868cafcb-d954-4901-a5e0-8faab081ac9a', '75304d68-df15-4fd4-84d1-d5247da57e6a', id, 'Paid for liquid Gas', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-292
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e7fd1e89-ce87-41db-a175-d399bd7da73a', 'JE-000298', '2025-07-02', 'Paid for one tanker water for the office use', 'JV-JV-292', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '35d7e963-6c98-4f4c-9657-b572fda00d65', 'e7fd1e89-ce87-41db-a175-d399bd7da73a', id, 'Paid for one tanker water for the office use', 1000.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '06427679-a15c-48ed-b0f4-ad370116ee00', 'e7fd1e89-ce87-41db-a175-d399bd7da73a', id, 'Paid for one tanker water for the office use', 0.00, 1000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-293
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('00bbb46d-2b82-436f-826e-62cdd00beb4c', 'JE-000299', '2025-07-02', 'Paid for Metal work of the office sign board', 'JV-JV-293', 'journal_entry', 7000.00, 7000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cf3ed1da-a328-4567-ab1d-c75d94259cf3', '00bbb46d-2b82-436f-826e-62cdd00beb4c', id, 'Paid for Metal work of the office sign board', 7000.00, 0.00 FROM accounts WHERE account_code = '61602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3a69fca3-7c33-46c5-af5c-9210f8aecbe3', '00bbb46d-2b82-436f-826e-62cdd00beb4c', id, 'Paid for Metal work of the office sign board', 0.00, 7000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-294
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1fe399d2-9579-40dd-b7e6-350abb89e69c', 'JE-000300', '2025-07-02', 'Paid for installation of the Receiver', 'JV-JV-294', 'journal_entry', 2000.00, 2000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4dd155fa-2126-417a-9e84-fc5f5a6c0435', '1fe399d2-9579-40dd-b7e6-350abb89e69c', id, 'Paid for installation of the Receiver', 2000.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5e6bf441-f0d8-46ad-ab06-8a54b0bbbac8', '1fe399d2-9579-40dd-b7e6-350abb89e69c', id, 'Paid for installation of the Receiver', 0.00, 2000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-297
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cbba241e-6421-4d94-a664-47293edf3f55', 'JE-000301', '2025-07-02', 'Owner withdrawal', 'JV-JV-297', 'journal_entry', 27300739.82, 27300739.82, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '748d2bef-3f81-4081-9ffb-a5680cccac9d', 'cbba241e-6421-4d94-a664-47293edf3f55', id, 'Owner withdrawal', 27300739.82, 0.00 FROM accounts WHERE account_code = '30100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd2598f9d-9215-49ea-925e-0d058c84fe21', 'cbba241e-6421-4d94-a664-47293edf3f55', id, 'Owner withdrawal', 0.00, 7105.83 FROM accounts WHERE account_code = '10201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f3c97151-78f8-4d4c-bbcc-e991c762220a', 'cbba241e-6421-4d94-a664-47293edf3f55', id, 'Owner withdrawal', 0.00, 27293633.99 FROM accounts WHERE account_code = '10100';

-- Entry: JV-296
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fc4a142c-1048-4cde-a276-142ba9d603fb', 'JE-000302', '2025-07-02', 'Owner withdrawal', 'JV-JV-296', 'journal_entry', 17796170.00, 17796170.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '60d6ed82-9676-4a58-83c8-5787a1eb0230', 'fc4a142c-1048-4cde-a276-142ba9d603fb', id, 'Owner withdrawal', 17796170.00, 0.00 FROM accounts WHERE account_code = '30100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7a3a0149-ed64-4bd1-88a1-816172c52ef0', 'fc4a142c-1048-4cde-a276-142ba9d603fb', id, 'Owner withdrawal', 0.00, 17796170.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-295
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0a9913ea-f954-4c9b-bacc-a17a7e698a6e', 'JE-000303', '2025-07-02', 'Deposited by the Owners in AUB USD Bank account (@70.5)', 'JV-JV-295', 'journal_entry', 21154230.00, 21154230.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '50795a24-eae1-4d3a-83b0-0588fa8678fa', '0a9913ea-f954-4c9b-bacc-a17a7e698a6e', id, 'Deposited by the Owners in AUB USD Bank account (@70.5)', 21154230.00, 0.00 FROM accounts WHERE account_code = '10201';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3c107281-00b5-469e-a9f1-2601499e00a0', '0a9913ea-f954-4c9b-bacc-a17a7e698a6e', id, 'Deposited by the Owners in AUB USD Bank account (@70.5)', 0.00, 21154230.00 FROM accounts WHERE account_code = '30100';

-- Entry: JV-298
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e1bffcea-11da-4e6b-a7f7-16de1215267e', 'JE-000304', '2025-07-02', 'Fuel for the power generator', 'JV-JV-298', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '02ccc4b8-8954-4062-a7bd-0ff526e96c6b', 'e1bffcea-11da-4e6b-a7f7-16de1215267e', id, 'Fuel for the power generator', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aa34accc-36b9-4462-b5d3-23941f99f52a', 'e1bffcea-11da-4e6b-a7f7-16de1215267e', id, 'Fuel for the power generator', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-299
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fc16c93e-d32c-4f84-a213-eee976867d2c', 'JE-000305', '2025-07-03', 'Paid for taxi to Mashal to DAB', 'JV-JV-299', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '826877af-49ef-4e47-bd80-6167082b1c7a', 'fc16c93e-d32c-4f84-a213-eee976867d2c', id, 'Paid for taxi to Mashal to DAB', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6700d7a3-8a2b-486b-8722-c1455fd31a1e', 'fc16c93e-d32c-4f84-a213-eee976867d2c', id, 'Paid for taxi to Mashal to DAB', 0.00, 100.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-300
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('65ecdf3f-eca2-4ae1-94a3-1d13aeb15f41', 'JE-000306', '2025-07-03', 'Paid for lunch expense', 'JV-JV-300', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1b3b3a84-fdcb-4629-908b-26bed06e85ab', '65ecdf3f-eca2-4ae1-94a3-1d13aeb15f41', id, 'Paid for lunch expense', 300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a1d17fe0-3b97-42bb-9f16-b93f19909e10', '65ecdf3f-eca2-4ae1-94a3-1d13aeb15f41', id, 'Paid for lunch expense', 0.00, 300.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-301
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('034a216e-4774-4dec-9c70-4fca6b40f188', 'JE-000307', '2025-07-03', 'Paid taxi charges to Liaqat to Jalalabad bus station', 'JV-JV-301', 'journal_entry', 350.00, 350.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fbd6a5bc-ba83-4e0b-8687-79f14a57311d', '034a216e-4774-4dec-9c70-4fca6b40f188', id, 'Paid taxi charges to Liaqat to Jalalabad bus station', 350.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f390424f-a5c1-464f-b737-4704d09d0ade', '034a216e-4774-4dec-9c70-4fca6b40f188', id, 'Paid taxi charges to Liaqat to Jalalabad bus station', 0.00, 350.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-302
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('70ed3bdb-892b-4ae7-ab9c-a1a1e50a60c8', 'JE-000308', '2025-07-03', 'Paid to Mashal Achakzai for personal use', 'JV-JV-302', 'journal_entry', 2500.00, 2500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6d8ffe45-61fe-4ebd-9753-99008ffefe2c', '70ed3bdb-892b-4ae7-ab9c-a1a1e50a60c8', id, 'Paid to Mashal Achakzai for personal use', 2500.00, 0.00 FROM accounts WHERE account_code = '20166';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1831bb68-a60b-469e-9b22-53273359760f', '70ed3bdb-892b-4ae7-ab9c-a1a1e50a60c8', id, 'Paid to Mashal Achakzai for personal use', 0.00, 2500.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-303
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('59013411-4781-445b-9260-26c0137fbae8', 'JE-000309', '2025-07-03', 'Paid to Faisal Achakzai for personal use', 'JV-JV-303', 'journal_entry', 2500.00, 2500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6cedc101-d3c7-45de-9d1c-f876f46d63d2', '59013411-4781-445b-9260-26c0137fbae8', id, 'Paid to Faisal Achakzai for personal use', 2500.00, 0.00 FROM accounts WHERE account_code = '20167';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd5d20b8a-e28a-47c3-ab69-99b88c9cf26e', '59013411-4781-445b-9260-26c0137fbae8', id, 'Paid to Faisal Achakzai for personal use', 0.00, 2500.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-304
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6a99b13c-4a8a-4f19-921c-b42edb9c51d0', 'JE-000310', '2025-07-03', 'Cash Withdrawal from Bank', 'JV-JV-304', 'journal_entry', 7050000.00, 7050000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b64fa34e-57de-4d4b-a8bc-e8476cd3c371', '6a99b13c-4a8a-4f19-921c-b42edb9c51d0', id, 'Cash Withdrawal from Bank', 7050000.00, 0.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '96dd8f3b-9780-4695-9993-e18dda7ecc0c', '6a99b13c-4a8a-4f19-921c-b42edb9c51d0', id, 'Cash Withdrawal from Bank', 0.00, 7050000.00 FROM accounts WHERE account_code = '10201';

-- Entry: JV-305
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('50773a2b-0095-49a7-867d-8e2f86724d3d', 'JE-000311', '2025-07-05', 'Cash withdrawal form bank', 'JV-JV-305', 'journal_entry', 14092950.00, 14092950.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2183634b-a272-46e8-9826-340825d22ac2', '50773a2b-0095-49a7-867d-8e2f86724d3d', id, 'Cash withdrawal form bank', 14092950.00, 0.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b98603ac-53c6-4f5c-b7c2-91054e7b2c08', '50773a2b-0095-49a7-867d-8e2f86724d3d', id, 'Cash withdrawal form bank', 0.00, 14092950.00 FROM accounts WHERE account_code = '10201';

-- Entry: JV-306
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d1ec17d6-e4ca-4081-a5d1-c84cf4c84f4e', 'JE-000312', '2025-07-05', 'Paid for staff lunch expenses and one note book', 'JV-JV-306', 'journal_entry', 170.00, 170.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '40339eeb-0b21-40cb-a66f-2e0470478020', 'd1ec17d6-e4ca-4081-a5d1-c84cf4c84f4e', id, 'Paid for staff lunch expenses and one note book', 170.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8cf5a7d4-5c25-4797-a350-239f49959c15', 'd1ec17d6-e4ca-4081-a5d1-c84cf4c84f4e', id, 'Paid for staff lunch expenses and one note book', 0.00, 170.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-307
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('06bec4db-5007-4b7e-a148-eab7ea5538f7', 'JE-000313', '2025-07-05', 'Paid for the generator fuel', 'JV-JV-307', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd38883c3-e57a-4c9d-b723-5283123fc4d8', '06bec4db-5007-4b7e-a148-eab7ea5538f7', id, 'Paid for the generator fuel', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e6cca2f1-6f27-4c59-b2d5-42c9b7e4a21c', '06bec4db-5007-4b7e-a148-eab7ea5538f7', id, 'Paid for the generator fuel', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-308
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8179afa9-5e5c-46d7-b0e0-b7f23b9901e1', 'JE-000314', '2025-07-05', 'Purchased cack and milk for guests', 'JV-JV-308', 'journal_entry', 240.00, 240.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6ade4709-3852-4adb-8881-79f631fcb8a7', '8179afa9-5e5c-46d7-b0e0-b7f23b9901e1', id, 'Purchased cack and milk for guests', 240.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '95e5e7a5-7a1f-441e-955a-83d541dcadaa', '8179afa9-5e5c-46d7-b0e0-b7f23b9901e1', id, 'Purchased cack and milk for guests', 0.00, 240.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-309
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ed38e63f-71b5-437b-bf85-b0cce0ca17a8', 'JE-000315', '2025-07-05', 'Salary Paid for the month of June 2025', 'JV-JV-309', 'journal_entry', 222086.00, 222086.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '55c0fcb0-786c-47d5-bc81-7c800e6de9f0', 'ed38e63f-71b5-437b-bf85-b0cce0ca17a8', id, 'Salary Paid for the month of June 2025', 79231.00, 0.00 FROM accounts WHERE account_code = '20169';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '737444f2-fbf9-4e44-bbb4-169465568b23', 'ed38e63f-71b5-437b-bf85-b0cce0ca17a8', id, 'Salary Paid for the month of June 2025 (Advance deduction applied)', 26100.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'df470249-a71f-4b82-98a9-17d4a919d354', 'ed38e63f-71b5-437b-bf85-b0cce0ca17a8', id, 'Salary Paid for the month of June 2025', 37100.00, 0.00 FROM accounts WHERE account_code = '20153';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0ccd462c-0ab4-4a6f-abd8-d355e2222a81', 'ed38e63f-71b5-437b-bf85-b0cce0ca17a8', id, 'Salary Paid for the month of June 2025', 37100.00, 0.00 FROM accounts WHERE account_code = '20154';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd5f23757-d8ab-4c97-86be-250738a4d370', 'ed38e63f-71b5-437b-bf85-b0cce0ca17a8', id, 'Salary Paid for the month of June 2025', 11860.00, 0.00 FROM accounts WHERE account_code = '20155';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a57dc670-f2d8-4aea-8859-d55920fb129a', 'ed38e63f-71b5-437b-bf85-b0cce0ca17a8', id, 'Salary Paid for the month of June 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20156';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '265dc77f-1251-43ee-bd1b-1ef98803ce2a', 'ed38e63f-71b5-437b-bf85-b0cce0ca17a8', id, 'Salary Paid for the month of June 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20157';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7588853b-c6b3-4491-80dc-eeeae13c8872', 'ed38e63f-71b5-437b-bf85-b0cce0ca17a8', id, 'Salary Paid for the month of June 2025', 6960.00, 0.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cfc6d28e-3afc-440b-8a30-9db27ea55568', 'ed38e63f-71b5-437b-bf85-b0cce0ca17a8', id, 'Salary Paid for the month of June 2025', 5980.00, 0.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5803ade8-9faa-474f-ae59-befdae3f7b69', 'ed38e63f-71b5-437b-bf85-b0cce0ca17a8', id, 'Salary Paid for the month of June 2025 (Salary Advance Applied)', 750.00, 0.00 FROM accounts WHERE account_code = '20167';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'da6c4b10-9f13-45c8-ad59-edef0b8b4773', 'ed38e63f-71b5-437b-bf85-b0cce0ca17a8', id, 'Salary Paid for the month of June 2025 (Salary Advance Applied)', 750.00, 0.00 FROM accounts WHERE account_code = '20166';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8914a327-defc-42a7-ac6f-a47a578986da', 'ed38e63f-71b5-437b-bf85-b0cce0ca17a8', id, 'Salary Paid for the month of June 2025', 2335.00, 0.00 FROM accounts WHERE account_code = '20170';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bd7c5812-a01b-4ca3-ba4a-7c9293df579b', 'ed38e63f-71b5-437b-bf85-b0cce0ca17a8', id, 'Salary Paid for the month of June 2025', 0.00, 222086.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-310
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('9c328a89-328d-4a52-9975-ac28b5138231', 'JE-000316', '2025-07-05', 'Paid for lunch expenses of staff', 'JV-JV-310', 'journal_entry', 700.00, 700.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7cbca952-0d65-498d-9851-48150416fa6d', '9c328a89-328d-4a52-9975-ac28b5138231', id, 'Paid for lunch expenses of staff', 700.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '12d3d47c-471f-49fc-8a98-ad13b5d3bbdc', '9c328a89-328d-4a52-9975-ac28b5138231', id, 'Paid for lunch expenses of staff', 0.00, 700.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-311
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('cbc80c67-8133-4cfc-a277-1e106b6301e4', 'JE-000317', '2025-07-06', 'Taxi charges paid to Mashal Achakzai for the delivery of documents to DAB', 'JV-JV-311', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8a348d74-a742-42f2-982b-4674875371f9', 'cbc80c67-8133-4cfc-a277-1e106b6301e4', id, 'Taxi charges paid to Mashal Achakzai for the delivery of documents to DAB', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'da657f7b-da08-4af9-a886-73685d500510', 'cbc80c67-8133-4cfc-a277-1e106b6301e4', id, 'Taxi charges paid to Mashal Achakzai for the delivery of documents to DAB', 0.00, 100.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-312
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('478f3742-80c4-485d-b143-550c51e388f3', 'JE-000318', '2025-07-06', 'Paid for printing UV ID, Business Card, Flayers, Back Light, for HQ Office', 'JV-JV-312', 'journal_entry', 16100.00, 16100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ed792645-8d9a-496b-840c-f9c2db1c8871', '478f3742-80c4-485d-b143-550c51e388f3', id, 'Paid for printing UV ID, Business Card, Flayers, Back Light, for HQ Office', 13150.00, 0.00 FROM accounts WHERE account_code = '61602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '30b2f7ff-f774-426e-8c72-5538d016c84e', '478f3742-80c4-485d-b143-550c51e388f3', id, 'Paid for printing UV ID, Business Card, Flayers, Back Light, for HQ Office', 0.00, 13150.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9846da05-cf9e-469c-af20-a18aa759861b', '478f3742-80c4-485d-b143-550c51e388f3', id, 'Paid for printing Business Cards.', 1050.00, 0.00 FROM accounts WHERE account_code = '61602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f18cc62e-1486-4436-a273-76fcc721a487', '478f3742-80c4-485d-b143-550c51e388f3', id, 'Paid for printing flag', 1900.00, 0.00 FROM accounts WHERE account_code = '61602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5ad97e1e-1fac-4bd3-8709-adddaa7385fa', '478f3742-80c4-485d-b143-550c51e388f3', id, 'Paid for printing flag and business cards', 0.00, 2950.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-313
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0249a76f-36af-466b-b726-a2751010c979', 'JE-000319', '2025-07-06', 'Salary advance paid to Omid Ahmadzai', 'JV-JV-313', 'journal_entry', 3000.00, 3000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '11bd94f1-8bdc-4a94-9d62-14a07324520b', '0249a76f-36af-466b-b726-a2751010c979', id, 'Salary advance paid to Omid Ahmadzai', 3000.00, 0.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '27e577ec-3381-4930-a4a9-965c0efa85ae', '0249a76f-36af-466b-b726-a2751010c979', id, 'Salary advance paid to Omid Ahmadzai', 0.00, 3000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-314
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e568f328-728c-4321-80f5-c555a49a6082', 'JE-000320', '2025-07-06', 'Paid to the Bakery for the month of Saratan 1404 breads supply', 'JV-JV-314', 'journal_entry', 3960.00, 3960.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3c9400fc-d392-4a3b-88c6-16c57a4327cf', 'e568f328-728c-4321-80f5-c555a49a6082', id, 'Paid to the Bakery for the month of Saratan 1404 breads supply', 3960.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '02410317-f53e-46e5-acf2-9a80ddaa66d5', 'e568f328-728c-4321-80f5-c555a49a6082', id, 'Paid to the Bakery for the month of Saratan 1404 breads supply', 0.00, 3960.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-315
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('161a1079-7bb2-44fe-b2ce-c900a1fe7100', 'JE-000321', '2025-07-06', 'Quickbook Online subscription payment for the month of June 2025', 'JV-JV-315', 'journal_entry', 5346.00, 5346.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '759660e1-97e1-40d2-be2d-b9774deb49c4', '161a1079-7bb2-44fe-b2ce-c900a1fe7100', id, 'Quickbook Online subscription payment for the month of June 2025', 5246.00, 0.00 FROM accounts WHERE account_code = '70000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7dc07efc-41c5-40e6-96eb-bce6dab5fbc7', '161a1079-7bb2-44fe-b2ce-c900a1fe7100', id, 'Quickbook Online subscription payment for the month of June 2025', 0.00, 5246.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8dbf5d7a-8652-4830-a452-b9a9d53990a8', '161a1079-7bb2-44fe-b2ce-c900a1fe7100', id, 'Taxi used by Mashal for delivery of documents to DAB', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a4055452-c43d-4b68-9783-c70fe38d6d6d', '161a1079-7bb2-44fe-b2ce-c900a1fe7100', id, 'Taxi used by Mashal for delivery of documents to DAB', 0.00, 100.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-316
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('610100cd-47d2-4e9f-a354-6db848afa213', 'JE-000322', '2025-07-07', 'Purchased car spare parts for Mr. Safiullah on Murabaha', 'JV-JV-316', 'journal_entry', 70010.00, 70010.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '26c4625d-cbb1-449e-87df-5885be6912d4', '610100cd-47d2-4e9f-a354-6db848afa213', id, 'Purchased car spare parts for Mr. Safiullah on Murabaha', 70010.00, 0.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '72332ca0-47c9-44b1-b137-c065a8d4e405', '610100cd-47d2-4e9f-a354-6db848afa213', id, 'Purchased car spare parts for Mr. Safiullah on Murabaha', 0.00, 70010.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-317
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ee583598-4155-4eec-9499-5ead7d2c6974', 'JE-000323', '2025-07-07', 'Paid for the day lunch', 'JV-JV-317', 'journal_entry', 270.00, 270.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ba8b2307-558d-46bb-9738-04e038f04a4b', 'ee583598-4155-4eec-9499-5ead7d2c6974', id, 'Paid for the day lunch', 270.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '95b9dc8e-d5ee-4c35-a24f-97fb8e844a08', 'ee583598-4155-4eec-9499-5ead7d2c6974', id, 'Paid for the day lunch', 0.00, 270.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-318
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b1817491-6488-4a72-97da-428eb281ac67', 'JE-000324', '2025-07-07', 'Internet fee paid for the month of (02 July to 07 Aug 2025)', 'JV-JV-318', 'journal_entry', 6000.00, 6000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9678b5d1-d14d-4efa-839f-5a4e6df68aa6', 'b1817491-6488-4a72-97da-428eb281ac67', id, 'Internet fee paid for the month of (02 July to 07 Aug 2025)', 6000.00, 0.00 FROM accounts WHERE account_code = '61202';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '91ae4639-165a-46d0-84b4-7eac807f13e1', 'b1817491-6488-4a72-97da-428eb281ac67', id, 'Internet fee paid for the month of (02 July to 07 Aug 2025)', 0.00, 6000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-319
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('53139328-b9d3-4987-838a-56248620c323', 'JE-000325', '2025-07-07', 'Paid for the office staff drinking water', 'JV-JV-319', 'journal_entry', 970.00, 970.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '26a598a8-7502-4d35-b403-c5b948738d2a', '53139328-b9d3-4987-838a-56248620c323', id, 'Paid for the office staff drinking water', 240.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'abcb5db4-75be-430c-8591-d5efedea6952', '53139328-b9d3-4987-838a-56248620c323', id, 'Paid for the office staff drinking water', 0.00, 240.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '09308e28-8aca-4bfd-a7e8-a905d0ba123c', '53139328-b9d3-4987-838a-56248620c323', id, 'Paid to Faisal for taxi charges to Pashtani bank to deliver documents', 430.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2584a261-dba2-49aa-8fa3-d7cfb21bf5b6', '53139328-b9d3-4987-838a-56248620c323', id, 'Paid to Faisal for taxi charges to Pashtani bank to deliver documents', 0.00, 430.00 FROM accounts WHERE account_code = '10100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '60d5713c-4d36-43ec-bca6-63bd43a110a0', '53139328-b9d3-4987-838a-56248620c323', id, 'Paid for taxi charges to Shakoor for purchase of car spare parts', 300.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7d0a5c24-144f-415b-95c6-576e3066692f', '53139328-b9d3-4987-838a-56248620c323', id, 'Paid for taxi charges to Shakoor for purchase of car spare parts', 0.00, 300.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-320
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c9c1bb88-9821-4101-931f-e53ce2270808', 'JE-000326', '2025-07-07', 'Paid to Shahpoor for his personal use (USD 220 @ 70.3674)', 'JV-JV-320', 'journal_entry', 15481.00, 15481.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '03a923d8-d641-475c-b310-0c54eed277bd', 'c9c1bb88-9821-4101-931f-e53ce2270808', id, 'Paid to Shahpoor for his personal use (USD 220 @ 70.3674)', 15481.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9d8330b2-8626-4ed2-af46-dd248517986f', 'c9c1bb88-9821-4101-931f-e53ce2270808', id, 'Paid to Shahpoor for his personal use (USD 220 @ 70.3674)', 0.00, 15481.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-321
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('dcbe8645-bcc7-4345-8696-8fd49c561ca1', 'JE-000327', '2025-07-08', 'Paid for the generator fuel', 'JV-JV-321', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '870aca5c-6bad-4e10-b0c8-16488c432433', 'dcbe8645-bcc7-4345-8696-8fd49c561ca1', id, 'Paid for the generator fuel', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b7ea2751-32e7-48a0-aae2-37d7f746a1a4', 'dcbe8645-bcc7-4345-8696-8fd49c561ca1', id, 'Paid for the generator fuel', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-322
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5d6f62f1-65ea-4c0b-8c4f-a7b96ae70e6e', 'JE-000328', '2025-07-08', 'Purchased one sponge Mop and one broom', 'JV-JV-322', 'journal_entry', 330.00, 330.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '320604cc-ac9d-4dfe-9acc-fa9f6173a35b', '5d6f62f1-65ea-4c0b-8c4f-a7b96ae70e6e', id, 'Purchased one sponge Mop and one broom', 330.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2190c46b-85f2-4c40-adb4-915779fc82cd', '5d6f62f1-65ea-4c0b-8c4f-a7b96ae70e6e', id, 'Purchased one sponge Mop and one broom', 0.00, 330.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-323
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c0a59bff-cad4-4321-ac17-fe6c4be252d5', 'JE-000329', '2025-07-08', 'Paid for the purchase of 2 box tissue paper for the office use.', 'JV-JV-323', 'journal_entry', 640.00, 640.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '429008c8-5dc6-4d3a-b89a-634da21b0e4b', 'c0a59bff-cad4-4321-ac17-fe6c4be252d5', id, 'Paid for the purchase of 2 box tissue paper for the office use.', 640.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7ee625ab-ba9e-454b-92f3-f7bfceb59f1e', 'c0a59bff-cad4-4321-ac17-fe6c4be252d5', id, 'Paid for the purchase of 2 box tissue paper for the office use.', 0.00, 640.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-324
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('178bef96-19f4-4491-bf2d-471cb317bb35', 'JE-000330', '2025-07-08', 'Paid for the purchase of tea and coffee for the opening ceremony', 'JV-JV-324', 'journal_entry', 1670.00, 1670.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dafd3503-98b3-427d-95c4-09bb1cac654d', '178bef96-19f4-4491-bf2d-471cb317bb35', id, 'Paid for the purchase of tea and coffee for the opening ceremony', 340.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eff1c02f-53df-4839-8429-448f8558e5d4', '178bef96-19f4-4491-bf2d-471cb317bb35', id, 'Purchased two bottle air fresher', 230.00, 0.00 FROM accounts WHERE account_code = '60500';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0fc4ea30-4739-43d2-9239-473faef614d8', '178bef96-19f4-4491-bf2d-471cb317bb35', id, 'Purchased two shoe shelfs for the office use', 960.00, 0.00 FROM accounts WHERE account_code = '60500';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6235dd29-dea9-4775-9555-2cac30c975cf', '178bef96-19f4-4491-bf2d-471cb317bb35', id, 'Purchased disposable glasses and plates for the ceremony', 140.00, 0.00 FROM accounts WHERE account_code = '60505';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dc9c2250-3665-49ab-ab5b-30992ecee424', '178bef96-19f4-4491-bf2d-471cb317bb35', id, 'Paid for the purchase of tea, coffee, air fresher, shoe shelfs, and disposable glass and plates', 0.00, 1670.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-325
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a8b8cd8d-c966-412b-9873-5b94ccfc7e99', 'JE-000331', '2025-07-08', 'Paid for the day lunch', 'JV-JV-325', 'journal_entry', 280.00, 280.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fa2b8077-3de4-4743-9633-6a8610d86855', 'a8b8cd8d-c966-412b-9873-5b94ccfc7e99', id, 'Paid for the day lunch', 280.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1e9bee0a-557f-4b83-8ddc-9b86658406a7', 'a8b8cd8d-c966-412b-9873-5b94ccfc7e99', id, 'Paid for the day lunch', 0.00, 280.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-326
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('45a1e179-c6a9-4cbe-9520-2abe8ca0855a', 'JE-000332', '2025-07-09', 'Purchased cake, biscuits, and cold drink', 'JV-JV-326', 'journal_entry', 1160.00, 1160.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7d871e18-87e8-43c8-9f4d-2e2bacd23eac', '45a1e179-c6a9-4cbe-9520-2abe8ca0855a', id, 'Purchased cake, biscuits, and cold drink', 1160.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fde7ec01-1ddb-4c65-90d5-1d66adae414e', '45a1e179-c6a9-4cbe-9520-2abe8ca0855a', id, 'Purchased cake, biscuits, and cold drink', 0.00, 1160.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-327
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('56ef39e9-6a7b-4b36-a9fb-063bf1bafd41', 'JE-000333', '2025-07-09', 'Paid for the staff''s day lunch expesne', 'JV-JV-327', 'journal_entry', 530.00, 530.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b9c370d2-3690-408e-86e0-9923bc919efa', '56ef39e9-6a7b-4b36-a9fb-063bf1bafd41', id, 'Paid for the staff''s day lunch expesne', 230.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '06610e3f-831a-491d-b538-3047df83fcc7', '56ef39e9-6a7b-4b36-a9fb-063bf1bafd41', id, 'Purchased sugar for the office use', 200.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '936e2253-d5c8-4e94-9228-09b2a8831d0c', '56ef39e9-6a7b-4b36-a9fb-063bf1bafd41', id, 'Purchased drinking water', 100.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '24c3a14b-0663-412e-beaa-ce59d8e0eeb9', '56ef39e9-6a7b-4b36-a9fb-063bf1bafd41', id, 'Paid for lunch, sugar and drinking water', 0.00, 530.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-328
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6a9ad11a-3929-4dae-abda-bcc4b5822acc', 'JE-000334', '2025-07-09', 'Purchased juice and disposable spoons for the ceremony', 'JV-JV-328', 'journal_entry', 450.00, 450.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b492f9fe-b29e-4efb-9708-29aebd6336e0', '6a9ad11a-3929-4dae-abda-bcc4b5822acc', id, 'Purchased juice and disposable spoons for the ceremony', 450.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b3485193-a45b-45c2-afcf-fd83bba86b15', '6a9ad11a-3929-4dae-abda-bcc4b5822acc', id, 'Purchased juice and disposable spoons for the ceremony', 0.00, 450.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-329
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8b30bab5-5aa5-4365-affb-fd9591bc7502', 'JE-000335', '2025-07-09', 'Purchased note book, and pen', 'JV-JV-329', 'journal_entry', 720.00, 720.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2a23f2f3-b343-4f9b-a6a4-a6c7d0d10441', '8b30bab5-5aa5-4365-affb-fd9591bc7502', id, 'Purchased note book, and pen', 720.00, 0.00 FROM accounts WHERE account_code = '60501';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c1e74846-4324-462d-a507-64e3347cfde5', '8b30bab5-5aa5-4365-affb-fd9591bc7502', id, 'Purchased note book, and pen', 0.00, 720.00 FROM accounts WHERE account_code = '10100';

-- Entry: LCI007
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d73626fc-8577-4085-a80f-d7ebf1710f05', 'JE-000336', '2025-07-09', 'Purchased car spare parts Safiullah s/o Najeebullah for loan on murabaha contract on 18% Profit.', 'JV-LCI007', 'financing_disbursement', 82612.00, 82612.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1e985e93-ff19-4795-b246-5a46bfbdfef9', 'd73626fc-8577-4085-a80f-d7ebf1710f05', id, 'Purchased car spare parts Safiullah s/o Najeebullah for loan on murabaha contract on 18% Profit.', 82612.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8f9d6bf1-e059-41f7-acf4-f5583454e02c', 'd73626fc-8577-4085-a80f-d7ebf1710f05', id, 'Purchased car spare parts Safiullah s/o Najeebullah for loan on murabaha contract on 18% Profit.', 0.00, 70010.00 FROM accounts WHERE account_code = '12100';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '37932eb5-bfd4-45e2-af64-2fb7c335bd51', 'd73626fc-8577-4085-a80f-d7ebf1710f05', id, 'Purchased car spare parts Safiullah s/o Najeebullah for loan on murabaha contract on 18% Profit. ', 0.00, 12602.00 FROM accounts WHERE account_code = '20900';

-- Entry: LCI008
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c0e77879-74b8-4f66-8844-1c000e155f8e', 'JE-000337', '2025-07-09', 'Laon paid to Mr. Zabihullah Hashemi as Musharakah for 12 months on 50% profit sharing on 4 installments in Chicken Farming,', 'JV-LCI008', 'financing_disbursement', 130000.00, 130000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bf1fc83c-ab44-4e32-ad59-db1f9c746a80', 'c0e77879-74b8-4f66-8844-1c000e155f8e', id, 'Laon paid to Mr. Zabihullah Hashemi as Musharakah for 12 months on 50% profit sharing on 4 installments in Chicken Farming,', 130000.00, 0.00 FROM accounts WHERE account_code = '11000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '49982a00-c6a6-4c99-a622-c7ea1f6d7989', 'c0e77879-74b8-4f66-8844-1c000e155f8e', id, 'Laon paid to Mr. Zabihullah Hashemi as Musharakah for 12 months on 50% profit sharing on 4 installments in Chicken Farming,', 0.00, 130000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-330
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('16c1ab1d-63c1-414e-b1dc-69f0645be628', 'JE-000338', '2025-07-12', 'Paid for the lunch expenses', 'JV-JV-330', 'journal_entry', 130.00, 130.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '88f0d83f-c6c4-44aa-a992-cbf3b8c7dd45', '16c1ab1d-63c1-414e-b1dc-69f0645be628', id, 'Paid for the lunch expenses', 130.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '26d291c2-f4a0-48c3-a981-1e02e4994def', '16c1ab1d-63c1-414e-b1dc-69f0645be628', id, 'Paid for the lunch expenses', 0.00, 130.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-331
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('df158f65-8a0f-4590-8c82-517879b24cf6', 'JE-000339', '2025-07-12', 'Paid to Liaqat for delivery of documents to Jalalabad branch', 'JV-JV-331', 'journal_entry', 170.00, 170.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1e885c31-1226-423d-ac3c-337d6a6903f5', 'df158f65-8a0f-4590-8c82-517879b24cf6', id, 'Paid to Liaqat for delivery of documents to Jalalabad branch', 170.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b20bdf3b-fe51-4be6-ba42-3f918ded99f9', 'df158f65-8a0f-4590-8c82-517879b24cf6', id, 'Paid to Liaqat for delivery of documents to Jalalabad branch', 0.00, 170.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-332
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('91640573-c85c-45ba-a4c3-816f45ad37fe', 'JE-000340', '2025-07-12', 'Paid to Liaqat for taxi charges to Jalalabad bus station', 'JV-JV-332', 'journal_entry', 280.00, 280.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '14a79f5c-b387-4826-b415-dff6518106cf', '91640573-c85c-45ba-a4c3-816f45ad37fe', id, 'Paid to Liaqat for taxi charges to Jalalabad bus station', 280.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e0aec775-6bb2-430f-b9a9-c6ec10dc9b4b', '91640573-c85c-45ba-a4c3-816f45ad37fe', id, 'Paid to Liaqat for taxi charges to Jalalabad bus station', 0.00, 280.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-333
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8b9d3906-060d-4883-99cd-a691a9fd714f', 'JE-000341', '2025-07-12', 'Paid to Mashal Achakzai for taxi charges to DAB and 3 days training', 'JV-JV-333', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c30f7b20-dc28-42dc-b3a3-f2c165d7dcff', '8b9d3906-060d-4883-99cd-a691a9fd714f', id, 'Paid to Mashal Achakzai for taxi charges to DAB and 3 days training', 500.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e25b999b-4d70-4e9a-9ce8-8e97eb1be070', '8b9d3906-060d-4883-99cd-a691a9fd714f', id, 'Paid to Mashal Achakzai for taxi charges to DAB and 3 days training', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-334
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('13bbcb01-dc71-43c7-b77d-a66f636007cf', 'JE-000342', '2025-07-13', 'Paid for lunch expense', 'JV-JV-334', 'journal_entry', 440.00, 440.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8112def8-7afc-4d2a-9fd6-4696ebe0a873', '13bbcb01-dc71-43c7-b77d-a66f636007cf', id, 'Paid for lunch expense', 440.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1894d3e2-00ba-4967-bf21-a4ae9a344bcc', '13bbcb01-dc71-43c7-b77d-a66f636007cf', id, 'Paid for lunch expense', 0.00, 440.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-335
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ec7691b7-9cb0-495b-9036-10b5839a1a0d', 'JE-000343', '2025-07-14', 'Fuel for the power generator', 'JV-JV-335', 'journal_entry', 1230.00, 1230.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '047cb045-78fa-4e69-a448-87fc3930fd60', 'ec7691b7-9cb0-495b-9036-10b5839a1a0d', id, 'Fuel for the power generator', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1f745ca9-5113-4141-bf0a-8f9fd264ce7c', 'ec7691b7-9cb0-495b-9036-10b5839a1a0d', id, 'Paid for the lunch expense', 730.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cc02e150-bbde-41d5-8d32-1aa49deabdab', 'ec7691b7-9cb0-495b-9036-10b5839a1a0d', id, 'Paid for the lunch expense and fuel for the power generator', 0.00, 1230.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-336
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5a658a5d-82b7-49cc-b180-f6eaaeb39043', 'JE-000344', '2025-07-15', 'Provision for loan loss for 8 customers to date.', 'JV-JV-336', 'journal_entry', 58127.52, 58127.52, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a6e3aab0-9218-4c85-b5cd-0888f9a7ecf3', '5a658a5d-82b7-49cc-b180-f6eaaeb39043', id, 'Provision for loan loss for 8 customers to date.', 58127.52, 0.00 FROM accounts WHERE account_code = '80102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6f8eb1fa-f284-4507-9fdf-b85ef5f4847f', '5a658a5d-82b7-49cc-b180-f6eaaeb39043', id, 'Provision for loan loss for 8 customers to date.', 0.00, 58127.52 FROM accounts WHERE account_code = '18000';

-- Entry: JV-337
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('863a88fc-7ad8-4a04-b9b8-024cbeb3968c', 'JE-000345', '2025-07-15', 'Paid for the staff lunch', 'JV-JV-337', 'journal_entry', 290.00, 290.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ca9eb931-257c-4412-9f64-7f3dcebbdfb2', '863a88fc-7ad8-4a04-b9b8-024cbeb3968c', id, 'Paid for the staff lunch', 250.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'de8ebda5-1f93-4909-9b74-b699cc11ebd9', '863a88fc-7ad8-4a04-b9b8-024cbeb3968c', id, 'Paid for the purchase of small battery and rubber tape', 40.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '26987ec7-a1bb-4906-8cba-91b78907a075', '863a88fc-7ad8-4a04-b9b8-024cbeb3968c', id, 'Paid for the purchase of small battery and rubber tape', 0.00, 290.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-338
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('453fd687-0a37-4daa-a4b8-4f52af901011', 'JE-000346', '2025-07-15', 'Paid for lunch expense', 'JV-JV-338', 'journal_entry', 220.00, 220.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f4a6044e-1377-4311-8990-ee807414e298', '453fd687-0a37-4daa-a4b8-4f52af901011', id, 'Paid for lunch expense', 220.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4329a05f-af75-4a53-843a-ca9348b2ce20', '453fd687-0a37-4daa-a4b8-4f52af901011', id, 'Paid for lunch expense', 0.00, 220.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-339
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('1a29f9dd-295c-4868-9d03-7f2177e4870d', 'JE-000347', '2025-07-15', 'Salary Advance paid Omid Ahmadzai', 'JV-JV-339', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '022685ee-249d-467c-987f-ef9882eaf50f', '1a29f9dd-295c-4868-9d03-7f2177e4870d', id, 'Salary Advance paid Omid Ahmadzai', 1000.00, 0.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1d93d481-10a5-4f72-abc7-95b2854899d5', '1a29f9dd-295c-4868-9d03-7f2177e4870d', id, 'Salary Advance paid Omid Ahmadzai', 0.00, 1000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-340
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('761d043c-5642-4f4a-9758-df5c9e74be1c', 'JE-000348', '2025-07-16', 'Paid for the staff lunch of the day', 'JV-JV-340', 'journal_entry', 640.00, 640.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '83a60713-d7e1-4d58-bb44-6a35dccb9eae', '761d043c-5642-4f4a-9758-df5c9e74be1c', id, 'Paid for the staff lunch of the day', 340.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e68362f9-ff12-4fff-8ea3-1b8ccb1a0b78', '761d043c-5642-4f4a-9758-df5c9e74be1c', id, 'Paid class cleaning liquid for windows cleaning', 50.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '88c0836d-1ebc-4531-a14e-d7bd7778fb24', '761d043c-5642-4f4a-9758-df5c9e74be1c', id, 'Purchased 1.5 meter dinning spread for staff lunch', 250.00, 0.00 FROM accounts WHERE account_code = '60503';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f466094e-d57a-49c8-ab8c-a6b72ea9c57d', '761d043c-5642-4f4a-9758-df5c9e74be1c', id, 'Purchased 1.5 meter dinning spread for staff lunch, glass cleaning liquid, and lunch food expenses.', 0.00, 640.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-341
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('90d5215e-fa28-4c3d-bf31-b241fbc68346', 'JE-000349', '2025-07-16', 'Paid for liquid gas for the kitchen', 'JV-JV-341', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd5a386c0-8e22-4fb7-8f83-304c302d436d', '90d5215e-fa28-4c3d-bf31-b241fbc68346', id, 'Paid for liquid gas for the kitchen', 500.00, 0.00 FROM accounts WHERE account_code = '61102';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '00120f4a-0ca8-42a3-9f68-d68de458acd2', '90d5215e-fa28-4c3d-bf31-b241fbc68346', id, 'Paid for liquid gas for the kitchen', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-342
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('a465e491-d60e-4914-9774-f6689b491707', 'JE-000350', '2025-07-16', 'Paid for fuel for the power generator', 'JV-JV-342', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ae4222e6-7705-44e9-819c-d16523f5b047', 'a465e491-d60e-4914-9774-f6689b491707', id, 'Paid for fuel for the power generator', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd4da4ff0-779e-4e7f-82f7-1f2caa395573', 'a465e491-d60e-4914-9774-f6689b491707', id, 'Paid for fuel for the power generator', 0.00, 500.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-343
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('693bc424-61d3-4c06-81b7-b1fd7ab2b7d5', 'JE-000351', '2025-07-16', 'Taxi used by Shakoor to bring cash', 'JV-JV-343', 'journal_entry', 110.00, 110.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7393e7ca-658e-4829-89a0-6e8a3b9fa833', '693bc424-61d3-4c06-81b7-b1fd7ab2b7d5', id, 'Taxi used by Shakoor to bring cash', 110.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '18314830-743d-4678-8270-788375fc25c7', '693bc424-61d3-4c06-81b7-b1fd7ab2b7d5', id, 'Taxi used by Shakoor to bring cash', 0.00, 110.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-344
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ff931abe-3202-4ad9-bb43-7aa93a0a1630', 'JE-000352', '2025-07-16', 'Cash Received CR# 32 for the office daily expenses', 'JV-JV-344', 'journal_entry', 15000.00, 15000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b0739477-8a63-4a64-bab2-ad29154c8ddb', 'ff931abe-3202-4ad9-bb43-7aa93a0a1630', id, 'Cash Received CR# 32 for the office daily expenses', 15000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cab255e4-cfde-4c6a-a73e-25691099380b', 'ff931abe-3202-4ad9-bb43-7aa93a0a1630', id, 'Cash Received CR# 32 for the office daily expenses', 0.00, 15000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-345
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('ac784cb7-2d1d-432b-8e25-8d3af35039b4', 'JE-000353', '2025-07-16', 'Cash Received CR# 33 for salary advance to Lateef for the month of July 2025', 'JV-JV-345', 'journal_entry', 5100.00, 5100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1066d875-2e8a-436a-be90-b514fab81920', 'ac784cb7-2d1d-432b-8e25-8d3af35039b4', id, 'Cash Received CR# 33 for salary advance to Lateef for the month of July 2025', 5100.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '711589b3-29bc-4235-85dd-12dcdd07072f', 'ac784cb7-2d1d-432b-8e25-8d3af35039b4', id, 'Cash Received CR# 33for salary advance to Lateef for the month of July 2025', 0.00, 5100.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-346
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('e484dc09-c6d3-40e3-ac8c-82a72aeb21a0', 'JE-000354', '2025-07-16', 'Salary advance Paid to Lateef ullah for the month of July 2025', 'JV-JV-346', 'journal_entry', 5100.00, 5100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f42a4a2a-1d0b-4b55-8dd8-e370d7a93697', 'e484dc09-c6d3-40e3-ac8c-82a72aeb21a0', id, 'Salary advance Paid to Lateef ullah for the month of July 2025', 5100.00, 0.00 FROM accounts WHERE account_code = '20158';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9593e88a-8a35-429f-a286-90402c58c9b1', 'e484dc09-c6d3-40e3-ac8c-82a72aeb21a0', id, 'Salary advance Paid to Lateef ullah for the month of July 2025', 0.00, 5100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-347
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('341ee72e-d570-4b7b-b99a-da107798c5bc', 'JE-000355', '2025-07-18', 'Paid the lunch expense of the staff', 'JV-JV-347', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2e74ed84-86e0-4cc0-b84b-da087f5948a7', '341ee72e-d570-4b7b-b99a-da107798c5bc', id, 'Paid the lunch expense of the staff', 300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4641af59-ada5-46a4-8279-542362dd0f60', '341ee72e-d570-4b7b-b99a-da107798c5bc', id, 'Paid the lunch expense of the staff', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-348
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3763f0bd-f8ff-4419-bc97-397d40998867', 'JE-000356', '2025-07-19', 'Paid for chocolate and green tea for guest and staff use', 'JV-JV-348', 'journal_entry', 810.00, 810.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a4cd99bd-b118-48c9-b4bf-432268b54250', '3763f0bd-f8ff-4419-bc97-397d40998867', id, 'Paid for chocolate and green tea for guest and staff use', 620.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '95571ad4-b9e6-4ab8-a31e-e76740083dd8', '3763f0bd-f8ff-4419-bc97-397d40998867', id, 'Paid for toilet paper', 30.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'af84c901-12ef-40c5-afc7-d8300407da0d', '3763f0bd-f8ff-4419-bc97-397d40998867', id, 'Paid for staff lunch expenses', 160.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7b1bc278-1f7f-4591-9f87-e2b1bde2b52a', '3763f0bd-f8ff-4419-bc97-397d40998867', id, 'Paid for Chocolate, green tea, toilet paper, and staff lanch expenses.', 0.00, 810.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-349
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bd745ca9-cd5f-4d40-8d45-cfb26f0104d2', 'JE-000357', '2025-07-19', 'Paid for taxi to Faisal Achakzai for the delivery of printer to street 7 Qala Fathullah', 'JV-JV-349', 'journal_entry', 160.00, 160.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cc05805a-8735-44a1-84fb-167cf34bf54e', 'bd745ca9-cd5f-4d40-8d45-cfb26f0104d2', id, 'Paid for taxi to Faisal Achakzai for the delivery of printer to street 7 Qala Fathullah', 160.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0230c474-31af-476b-a732-358109b280fa', 'bd745ca9-cd5f-4d40-8d45-cfb26f0104d2', id, 'Paid for taxi to Faisal Achakzai for the delivery of printer to street 7 Qala Fathullah', 0.00, 160.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-350
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('326571bd-4d9c-418e-87a6-55ae2b65f6ae', 'JE-000358', '2025-07-19', 'Cash Received CR# 34 for PCR users three months payment', 'JV-JV-350', 'journal_entry', 15000.00, 15000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '220dfb58-1b29-427d-b509-e5f3e14fcf0f', '326571bd-4d9c-418e-87a6-55ae2b65f6ae', id, 'Cash Received CR# 34 for PCR users three months payment', 15000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'aa1b137a-11ae-4c9d-b5d5-5cb3a94508a3', '326571bd-4d9c-418e-87a6-55ae2b65f6ae', id, 'Cash Received CR# 34 for PCR users three months payment', 0.00, 15000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-351
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c7aadb3e-0665-4fd2-aa23-1379c7ca811e', 'JE-000359', '2025-07-19', 'Paid for PCR users for three months', 'JV-JV-351', 'journal_entry', 15000.00, 15000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd9227608-7793-4b1a-8ed8-3dc8e27b58ed', 'c7aadb3e-0665-4fd2-aa23-1379c7ca811e', id, 'Paid for PCR users for three months', 15000.00, 0.00 FROM accounts WHERE account_code = '70000';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ea69d36f-456b-499b-b558-4f54bd7cfbd2', 'c7aadb3e-0665-4fd2-aa23-1379c7ca811e', id, 'Paid for PCR users for three months', 0.00, 15000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-352
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3de2ad37-cbd3-4f29-8394-092c90abf1ad', 'JE-000360', '2025-07-20', 'Paid for taxi to Mashal Achakzai for the payment of PCR users', 'JV-JV-352', 'journal_entry', 400.00, 400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '50ad5ed0-65a1-48e1-b3e9-cf0105612152', '3de2ad37-cbd3-4f29-8394-092c90abf1ad', id, 'Paid for taxi to Mashal Achakzai for the payment of PCR users', 200.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '195d9e22-a22c-4d90-9565-e91b81a3d20b', '3de2ad37-cbd3-4f29-8394-092c90abf1ad', id, 'Paid for taxi to Mashal Achakzai for the payment of PCR users', 0.00, 200.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '708fc334-a274-4a01-9f4d-a3dd3d909f7a', '3de2ad37-cbd3-4f29-8394-092c90abf1ad', id, 'To MISFA Office for the delivery of proposal documents', 200.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cac92441-3ac0-4353-b967-75950f2ef107', '3de2ad37-cbd3-4f29-8394-092c90abf1ad', id, 'To MISFA Office for the delivery of proposal documents', 0.00, 200.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-353
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3613abee-d2f7-4bdd-8a0a-4c72288ab01d', 'JE-000361', '2025-07-20', 'Paid to Omid Ahmadzai for taxi to MISFA Office for the delivery of proposal documents', 'JV-JV-353', 'journal_entry', 90.00, 90.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a320d69c-104c-478f-97a5-2938ac351809', '3613abee-d2f7-4bdd-8a0a-4c72288ab01d', id, 'Paid to Omid Ahmadzai for taxi to MISFA Office for the delivery of proposal documents', 90.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '79c14ad9-1f28-456e-8a9f-3d78b539a52c', '3613abee-d2f7-4bdd-8a0a-4c72288ab01d', id, 'Paid to Omid Ahmadzai for taxi to MISFA Office for the delivery of proposal documents', 0.00, 90.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-354
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c815a141-9aeb-4e5b-a797-d0bc9ad643ed', 'JE-000362', '2025-07-20', 'Paid for the dinner of the guests', 'JV-JV-354', 'journal_entry', 360.00, 360.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7d16133d-49f7-4d0b-81be-68c61c4aa2d5', 'c815a141-9aeb-4e5b-a797-d0bc9ad643ed', id, 'Paid for the dinner of the guests', 360.00, 0.00 FROM accounts WHERE account_code = '60602';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0d6fa4e9-c37f-413d-bb49-9f11dee73c71', 'c815a141-9aeb-4e5b-a797-d0bc9ad643ed', id, 'Paid for the dinner of the guests', 0.00, 360.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-355
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3ab170b4-d25a-4853-babf-4405b4879f47', 'JE-000363', '2025-07-20', 'Paid for the day staff lunch', 'JV-JV-355', 'journal_entry', 700.00, 700.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '18a64231-0359-4b5f-8584-237519921a90', '3ab170b4-d25a-4853-babf-4405b4879f47', id, 'Paid for the day staff lunch', 600.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ab933ef1-9a0b-49e2-9aac-820a3f455667', '3ab170b4-d25a-4853-babf-4405b4879f47', id, 'Paid for tissue paper', 100.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2ec71e94-f904-431b-81ee-aed40b0dede9', '3ab170b4-d25a-4853-babf-4405b4879f47', id, 'Paid for tissue paper and for the day lunch expense', 0.00, 700.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-356
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('f8c8494f-f119-42b3-977c-3a6cb00f287e', 'JE-000364', '2025-07-20', 'Paid for the power generator fuel', 'JV-JV-356', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dbe1fd30-5e1b-4dd1-89ca-e713af450c5b', 'f8c8494f-f119-42b3-977c-3a6cb00f287e', id, 'Paid for the power generator fuel', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9a635c8a-f571-4094-8c43-d4dc5d09cb70', 'f8c8494f-f119-42b3-977c-3a6cb00f287e', id, 'Paid for the power generator fuel', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-357
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('92bf4db2-9560-45db-96cf-8475041eef4c', 'JE-000365', '2025-07-20', 'Advance Paid to Omid Ahmadzai for personal use', 'JV-JV-357', 'journal_entry', 1500.00, 1500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e46686e7-5661-4fb6-b157-4b54cb835e3d', '92bf4db2-9560-45db-96cf-8475041eef4c', id, 'Advance Paid to Omid Ahmadzai for personal use', 1500.00, 0.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd1d01ae1-07e2-4c8c-883d-42cc51aaa5fd', '92bf4db2-9560-45db-96cf-8475041eef4c', id, 'Advance Paid to Omid Ahmadzai for personal use', 0.00, 1500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-358
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('867021ea-5392-44bc-ae6c-575da79a5bfc', 'JE-000366', '2025-07-20', 'Salary Advance paid to Mashal Achakzai', 'JV-JV-358', 'journal_entry', 4000.00, 4000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '6c891b1e-e0dd-4d6e-aaba-285b5b0b867c', '867021ea-5392-44bc-ae6c-575da79a5bfc', id, 'Salary Advance paid to Mashal Achakzai', 2000.00, 0.00 FROM accounts WHERE account_code = '20166';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '423c9df0-41ba-4a73-a6f0-d865205d4077', '867021ea-5392-44bc-ae6c-575da79a5bfc', id, 'Salary Advance paid to Faisal Achakzai', 2000.00, 0.00 FROM accounts WHERE account_code = '20167';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0ff1a656-4fac-4ca7-956f-69366c1ce950', '867021ea-5392-44bc-ae6c-575da79a5bfc', id, '"Salary Advance paid to Mashal 
Achakzai and Faisal Achakzai"', 0.00, 4000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-359
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c66fe938-7ff6-4d6d-90c4-cbe31974a78d', 'JE-000367', '2025-07-20', 'Cash Received in USD CR# 35 for the payment of website development (@ 69.1440)', 'JV-JV-359', 'journal_entry', 6914.00, 6914.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1b16b6c4-3d65-462e-8e53-3a75c63cf233', 'c66fe938-7ff6-4d6d-90c4-cbe31974a78d', id, 'Cash Received in USD CR# 35 for the payment of website development (@ 69.1440)', 6914.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b256fbfc-a128-4978-b54e-230a1b6a8ea6', 'c66fe938-7ff6-4d6d-90c4-cbe31974a78d', id, 'Cash Received in USD CR# 35 for the payment of website development (@ 69.1440)', 0.00, 6914.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-360
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('30e7b717-1fa6-4824-b5da-9c9c9d2b6ab6', 'JE-000368', '2025-07-20', 'Paid for drinking of 5 invoices', 'JV-JV-360', 'journal_entry', 1030.00, 1030.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cc8b2d22-6b18-4c40-b5db-b9acc46d55c1', '30e7b717-1fa6-4824-b5da-9c9c9d2b6ab6', id, 'Paid for drinking of 5 invoices', 600.00, 0.00 FROM accounts WHERE account_code = '61108';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '92f8525a-4970-4338-9349-4f7182c00a93', '30e7b717-1fa6-4824-b5da-9c9c9d2b6ab6', id, 'Paid for drinking of 5 invoices', 0.00, 600.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2fd18320-6897-4232-aafd-86f543397b04', '30e7b717-1fa6-4824-b5da-9c9c9d2b6ab6', id, 'Cold drinks for guests', 280.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '33ae6190-1cc2-4738-b1f3-ef2600e15349', '30e7b717-1fa6-4824-b5da-9c9c9d2b6ab6', id, 'Cold drinks for guests', 0.00, 280.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a93f9f35-5640-4f7b-84f6-ee159bfe0407', '30e7b717-1fa6-4824-b5da-9c9c9d2b6ab6', id, 'Taxi used by Shakoor to receive cash', 150.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2ad2fc42-2971-4b93-bd8b-2e7163dc48cf', '30e7b717-1fa6-4824-b5da-9c9c9d2b6ab6', id, 'Taxi used by Shakoor to receive cash', 0.00, 150.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-361
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d771f4d1-e74b-4657-9870-6f9805952d5a', 'JE-000369', '2025-07-21', 'Cash received CR# 36 for daily office expenses', 'JV-JV-361', 'journal_entry', 15000.00, 15000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ceb222e6-9659-4c05-b323-ed6cfc44f62e', 'd771f4d1-e74b-4657-9870-6f9805952d5a', id, 'Cash received CR# 36 for daily office expenses', 15000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'bce4d0cf-3258-46bf-8a8c-dbd61295f845', 'd771f4d1-e74b-4657-9870-6f9805952d5a', id, 'Cash received CR# 36 for daily office expenses', 0.00, 15000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-362
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('6991b072-20ad-4c88-8873-e9a784939164', 'JE-000370', '2025-07-22', 'Website development in English language fully dynamic with Admin panel', 'JV-JV-362', 'journal_entry', 6914.00, 6914.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '1a0afa13-c341-4b0a-a7e2-c6234549249f', '6991b072-20ad-4c88-8873-e9a784939164', id, 'Website development in English language fully dynamic with Admin panel', 6914.00, 0.00 FROM accounts WHERE account_code = '61603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '347000d5-5299-4fee-b13d-da9d9dd193a7', '6991b072-20ad-4c88-8873-e9a784939164', id, 'Website development in English language fully dynamic with Admin panel', 0.00, 6914.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-363
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8bdf2d83-8290-4a73-abf8-fcf68c70f881', 'JE-000371', '2025-07-22', 'Prepaid office rent for the month of Saratan 1404', 'JV-JV-363', 'journal_entry', 33000.00, 33000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c5aac483-60f3-4ae7-908c-e9d02169c705', '8bdf2d83-8290-4a73-abf8-fcf68c70f881', id, 'Prepaid office rent for the month of Saratan 1404', 33000.00, 0.00 FROM accounts WHERE account_code = '61001';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '22913dfe-a9ab-4e48-9deb-c3b36e1ed3a5', '8bdf2d83-8290-4a73-abf8-fcf68c70f881', id, 'House rent tax payable for the month of Saratan 1404', 0.00, 3000.00 FROM accounts WHERE account_code = '21200';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '0107cf7d-fa62-430b-b4ee-c7670d35dc03', '8bdf2d83-8290-4a73-abf8-fcf68c70f881', id, 'Prepaid office rent for the month of Saratan 1404', 0.00, 30000.00 FROM accounts WHERE account_code = '13100';

-- Entry: JV-364
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('caf50877-37ef-4bb8-87fa-33a93d8f0e3c', 'JE-000372', '2025-07-22', 'Paid for repairing the power generator', 'JV-JV-364', 'journal_entry', 1400.00, 1400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a7c33be3-e3df-4d53-85db-793b15cc6bfc', 'caf50877-37ef-4bb8-87fa-33a93d8f0e3c', id, 'Paid for repairing the power generator', 1400.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eda88f87-955a-47d8-965c-df42e9815879', 'caf50877-37ef-4bb8-87fa-33a93d8f0e3c', id, 'Paid for repairing the power generator', 0.00, 1400.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-365
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('65f09376-7943-45ad-adb9-621c04d9427e', 'JE-000373', '2025-07-22', 'Staff lunch expense on 21 July 2025', 'JV-JV-365', 'journal_entry', 270.00, 270.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '75536014-e471-4c71-97eb-dfb744309b17', '65f09376-7943-45ad-adb9-621c04d9427e', id, 'Staff lunch expense on 21 July 2025', 270.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f4a75ebb-12e0-42f6-b3c9-e970cb08690e', '65f09376-7943-45ad-adb9-621c04d9427e', id, 'Staff lunch expense on 21 July 2025', 0.00, 270.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-366
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('bff7aef4-befb-481e-9643-f58c634b6155', 'JE-000374', '2025-07-22', 'Purchased on bottle of 4 liters dish washing liquid', 'JV-JV-366', 'journal_entry', 330.00, 330.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '98aede76-8b30-4726-b4d2-79a44eb3c64c', 'bff7aef4-befb-481e-9643-f58c634b6155', id, 'Purchased on bottle of 4 liters dish washing liquid', 100.00, 0.00 FROM accounts WHERE account_code = '60504';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '199a9bc0-389b-4ccd-bd26-0ee8c6bd7828', 'bff7aef4-befb-481e-9643-f58c634b6155', id, 'Paid for the day staff lunch expenses', 230.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7532ea9a-ab09-4750-80e9-e563fb80eca5', 'bff7aef4-befb-481e-9643-f58c634b6155', id, 'Paid for the day staff lunch expenses and Purchased on bottle of 4 liters dish washing liquid', 0.00, 330.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-367
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('30789235-1359-4d4c-b5bd-c33c28038ae7', 'JE-000375', '2025-07-22', 'Paid for the taxi to Mustafa Khairkhwah to deliver documents to FMFB', 'JV-JV-367', 'journal_entry', 120.00, 120.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3444f5fb-01cc-4f44-a86b-1e32b5cf747b', '30789235-1359-4d4c-b5bd-c33c28038ae7', id, 'Paid for the taxi to Mustafa Khairkhwah to deliver documents to FMFB', 120.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4a48b432-629f-4b68-a549-810caf3e005a', '30789235-1359-4d4c-b5bd-c33c28038ae7', id, 'Paid for the taxi to Mustafa Khairkhwah to deliver documents to FMFB', 0.00, 120.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-368
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('35e4ded4-d8fe-4dc8-84f2-856d7e672c02', 'JE-000376', '2025-07-22', 'Paid for taxi use to Faisal Achakzai to bring cash', 'JV-JV-368', 'journal_entry', 50.00, 50.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5ce8f0b7-0d3d-4d84-a62c-7255233caae3', '35e4ded4-d8fe-4dc8-84f2-856d7e672c02', id, 'Paid for taxi use to Faisal Achakzai to bring cash', 50.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4032489b-11ce-4c7d-ac56-9fb6a453d8c8', '35e4ded4-d8fe-4dc8-84f2-856d7e672c02', id, 'Paid for taxi use to Faisal Achakzai to bring cash', 0.00, 50.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-369
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('2fa15256-453c-45e6-bf34-33835453a42e', 'JE-000377', '2025-07-22', 'AUB bank''s monthly maintenance fee for the months of Mar, April, May and Jun 2025', 'JV-JV-369', 'journal_entry', 2822.00, 2822.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '8f28268a-1523-4503-89dd-8b5864f1ac9d', '2fa15256-453c-45e6-bf34-33835453a42e', id, 'AUB bank''s monthly maintenance fee for the months of Mar, April, May and Jun 2025', 2822.00, 0.00 FROM accounts WHERE account_code = '61801';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9158c5c0-7452-47bf-89a2-e422fc9cd167', '2fa15256-453c-45e6-bf34-33835453a42e', id, 'AUB bank''s monthly maintenance fee for the months of Mar, April, May and Jun 2025', 0.00, 2822.00 FROM accounts WHERE account_code = '10201';

-- Entry: JV-370
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('792a92a0-988a-416c-b522-4ea55e71b463', 'JE-000378', '2025-07-22', 'Fuel for the power generator', 'JV-JV-370', 'journal_entry', 500.00, 500.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '54ac78be-5be1-4f10-b753-d553e7c979e3', '792a92a0-988a-416c-b522-4ea55e71b463', id, 'Fuel for the power generator', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3a8794ea-83fa-4352-ba94-b792fe2cafdf', '792a92a0-988a-416c-b522-4ea55e71b463', id, 'Fuel for the power generator', 0.00, 500.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-371
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('56fa1ce9-b774-4b66-a84d-9529cf55d9d7', 'JE-000379', '2025-07-22', 'Paid for the tanker water', 'JV-JV-371', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a12a0a3c-4c52-488d-b2a4-99041f56d450', '56fa1ce9-b774-4b66-a84d-9529cf55d9d7', id, 'Paid for the tanker water', 1000.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'b40f7e80-2a3f-4e82-89d0-541e3936694f', '56fa1ce9-b774-4b66-a84d-9529cf55d9d7', id, 'Paid for the tanker water', 0.00, 1000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-372
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('c9ba5961-59c0-4c7d-ac4f-54856077da89', 'JE-000380', '2025-07-22', 'Paid for the tanker water', 'JV-JV-372', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'd4535e6d-46a5-42d3-ac6d-230970328ac6', 'c9ba5961-59c0-4c7d-ac4f-54856077da89', id, 'Paid for the tanker water', 1000.00, 0.00 FROM accounts WHERE account_code = '61104';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '38cf33b1-d70b-4e2f-b447-e0ba4c67394d', 'c9ba5961-59c0-4c7d-ac4f-54856077da89', id, 'Paid for the tanker water', 0.00, 1000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-373
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('b514eaaf-c78d-4444-aa08-d22845ac8488', 'JE-000381', '2025-07-23', 'Paid for the staff lunch expenses', 'JV-JV-373', 'journal_entry', 400.00, 400.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'a1234e00-49a2-490d-9ac7-bcc1f26c21dd', 'b514eaaf-c78d-4444-aa08-d22845ac8488', id, 'Paid for the staff lunch expenses', 380.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '98e4c210-637b-4f68-a21d-630c1baa8490', 'b514eaaf-c78d-4444-aa08-d22845ac8488', id, 'Paid for two pairs of batteries', 20.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '5cf0ea82-1e93-4a05-8a58-2cbc3b813999', 'b514eaaf-c78d-4444-aa08-d22845ac8488', id, 'Paid for two pairs of batteries and lunch expenses', 0.00, 400.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-374
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0a989610-10d8-4791-aaf3-a503d1cad2fa', 'JE-000382', '2025-07-23', 'Salary advance paid to Shahpoor Khan', 'JV-JV-374', 'journal_entry', 3000.00, 3000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'eedccd8f-8c57-4319-b357-6f94e49ae1ed', '0a989610-10d8-4791-aaf3-a503d1cad2fa', id, 'Salary advance paid to Shahpoor Khan', 3000.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fc5b6a77-ef99-463f-8fd0-0a36b3a2eb0e', '0a989610-10d8-4791-aaf3-a503d1cad2fa', id, 'Salary advance paid to Shahpoor Khan', 0.00, 3000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-375
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('650c57cd-a5af-4ec5-aa17-348149b77a6e', 'JE-000383', '2025-07-23', 'Salary advance paid to Abdul Shokoor', 'JV-JV-375', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ccb2241c-8f75-4942-8c29-69a8103c8490', '650c57cd-a5af-4ec5-aa17-348149b77a6e', id, 'Salary advance paid to Abdul Shokoor', 1000.00, 0.00 FROM accounts WHERE account_code = '20159';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '83d9477c-0054-405c-b489-c28f2c8086c9', '650c57cd-a5af-4ec5-aa17-348149b77a6e', id, 'Salary advance paid to Abdul Shokoor', 0.00, 1000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-376
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('85e6adf3-a13e-47a1-b480-4f6eeb9c9595', 'JE-000384', '2025-07-23', 'Deposited to FMFB Afghani account as initial payment as part of account opening.', 'JV-JV-376', 'journal_entry', 3000.00, 3000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '78e62ba9-ee47-4e87-b6a9-1e93f82f8c7d', '85e6adf3-a13e-47a1-b480-4f6eeb9c9595', id, 'Deposited to FMFB Afghani account as initial payment as part of account opening.', 3000.00, 0.00 FROM accounts WHERE account_code = '10204';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e912324a-96d4-442f-84df-f4e0613cf039', '85e6adf3-a13e-47a1-b480-4f6eeb9c9595', id, 'Deposited to FMFB Afghani account as initial payment as part of account opening.', 0.00, 3000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-377
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3eb4c203-86a0-4456-a586-5914443c26e7', 'JE-000385', '2025-07-23', 'Deposited USD 50 @ 69 to the FMFB USD account as part of Initial payment for the account opening.', 'JV-JV-377', 'journal_entry', 3450.00, 3450.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '405f411a-5cd5-46e4-b9da-b830f08fd84b', '3eb4c203-86a0-4456-a586-5914443c26e7', id, 'Deposited USD 50 @ 69 to the FMFB USD account as part of Initial payment for the account opening.', 3450.00, 0.00 FROM accounts WHERE account_code = '10203';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7a0f0f18-9b9a-4936-b048-82ddff5a07a7', '3eb4c203-86a0-4456-a586-5914443c26e7', id, 'Deposited USD 50 @ 69 to the FMFB USD account as part of Initial payment for the account opening.', 0.00, 3450.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-378
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d7d59c4b-8cec-4b45-a6cc-e34954c7a0a4', 'JE-000386', '2025-07-23', 'Purchased Nuti-c for the office guests.', 'JV-JV-378', 'journal_entry', 300.00, 300.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '17806f5f-9a32-4ba4-b454-3361725bfc87', 'd7d59c4b-8cec-4b45-a6cc-e34954c7a0a4', id, 'Purchased Nuti-c for the office guests.', 300.00, 0.00 FROM accounts WHERE account_code = '60603';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '959c1a3a-c8f5-44b9-a9ee-a3cd7dd3738b', 'd7d59c4b-8cec-4b45-a6cc-e34954c7a0a4', id, 'Purchased Nuti-c for the office guests.', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-379
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('71048476-aae4-4a29-b5e0-d53e2c8c1de2', 'JE-000387', '2025-07-23', 'Purchased spare part for the power generator and wages.', 'JV-JV-379', 'journal_entry', 850.00, 850.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '97e14dbc-e7f8-4d19-acd4-2cba3591312b', '71048476-aae4-4a29-b5e0-d53e2c8c1de2', id, 'Purchased spare part for the power generator and wages.', 850.00, 0.00 FROM accounts WHERE account_code = '61300';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '967534bc-55ce-4d01-98f7-55be0fa0b308', '71048476-aae4-4a29-b5e0-d53e2c8c1de2', id, 'Purchased spare part for the power generator and wages.', 0.00, 850.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-380
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('925363fe-21c6-4141-911f-6a766e996849', 'JE-000388', '2025-07-23', 'Paid Mustafa Khairkhwa for the taxi use to FMFB for the documents delivery', 'JV-JV-380', 'journal_entry', 80.00, 80.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'cda68b20-28d0-4674-9263-5f606333e59e', '925363fe-21c6-4141-911f-6a766e996849', id, 'Paid Mustafa Khairkhwa for the taxi use to FMFB for the documents delivery', 80.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '3cebf938-da69-4a65-81e1-82f78e4290bd', '925363fe-21c6-4141-911f-6a766e996849', id, 'Paid Mustafa Khairkhwa for the taxi use to FMFB for the documents delivery', 0.00, 80.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-381
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('217f62bd-b887-413e-8e97-382b135cb827', 'JE-000389', '2025-07-24', 'Cash received CR# 37 for the Jalalabad and Kunar Provinces expenses', 'JV-JV-381', 'journal_entry', 50000.00, 50000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'da7cb264-f0ba-4e29-bc3d-a81a0eb736c6', '217f62bd-b887-413e-8e97-382b135cb827', id, 'Cash received CR# 37 for the Jalalabad and Kunar Provinces expenses', 50000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ae0ffcda-effa-4abf-9276-988e261e69e9', '217f62bd-b887-413e-8e97-382b135cb827', id, 'Cash received CR# 37 for the Jalalabad and Kunar Provinces expenses', 0.00, 50000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-382
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('5d2dad41-5f13-41c8-8b26-b3a575e59539', 'JE-000390', '2025-07-24', 'Advance paid to Noor Muhammad for the Kunar Banch opening', 'JV-JV-382', 'journal_entry', 50000.00, 50000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9d48ffe0-d3c2-444f-b0c4-c4d89ba06eb6', '5d2dad41-5f13-41c8-8b26-b3a575e59539', id, 'Advance paid to Noor Muhammad for the Kunar Banch opening', 50000.00, 0.00 FROM accounts WHERE account_code = '20168';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ff3144fd-e7ce-4467-bd40-c83d3fbe2cc0', '5d2dad41-5f13-41c8-8b26-b3a575e59539', id, 'Advance paid to Noor Muhammad for the Kunar Banch opening', 0.00, 50000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-383
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8562675c-c5b9-451a-8cf0-b2f87035169d', 'JE-000391', '2025-07-26', 'Paid for fuel for the power generator', 'JV-JV-383', 'journal_entry', 800.00, 800.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'dbacb5ed-2be1-4749-b4ad-86bcbab14b2c', '8562675c-c5b9-451a-8cf0-b2f87035169d', id, 'Paid for fuel for the power generator', 500.00, 0.00 FROM accounts WHERE account_code = '61103';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9acf5a30-16a7-496b-8a43-f44afb49e5d3', '8562675c-c5b9-451a-8cf0-b2f87035169d', id, 'Paid for fuel for the power generator', 0.00, 500.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '212b53bb-5205-4ed8-83d7-82cbc15f3fd5', '8562675c-c5b9-451a-8cf0-b2f87035169d', id, 'Paid for the staff lunch expense', 300.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e9d2d32b-1909-4331-b058-03ca436ccd27', '8562675c-c5b9-451a-8cf0-b2f87035169d', id, 'Paid for the staff lunch expense', 0.00, 300.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-384
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('8d8a29d7-7022-457c-b36f-44dfbc5987b8', 'JE-000392', '2025-07-26', 'Paid for the lunch expense of the staff', 'JV-JV-384', 'journal_entry', 310.00, 310.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '2b536bcd-a8f1-4a17-92c3-e257fe7106c7', '8d8a29d7-7022-457c-b36f-44dfbc5987b8', id, 'Paid for the lunch expense of the staff', 310.00, 0.00 FROM accounts WHERE account_code = '60601';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '9b9bccfc-6800-4752-8050-a24d3bd24cbf', '8d8a29d7-7022-457c-b36f-44dfbc5987b8', id, 'Paid for the lunch expense of the staff', 0.00, 310.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-385
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('fe26b829-7c37-4718-a779-09bc8d26a894', 'JE-000393', '2025-07-26', 'Cash received CR# 38 for the daily office expenses, two laptop purchase, Kunar and Jalalabad travel expense for Shahpoor Khan', 'JV-JV-385', 'journal_entry', 45000.00, 45000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7ff1221f-5f46-4b05-ac3d-582f64503976', 'fe26b829-7c37-4718-a779-09bc8d26a894', id, 'Cash received CR# 38 for the daily office expenses, two laptop purchase, Kunar and Jalalabad travel expense for Shahpoor Khan', 45000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'ec939939-874d-4aa0-98bf-37905feff750', 'fe26b829-7c37-4718-a779-09bc8d26a894', id, 'Cash received CR# 38 for the daily office expenses, two laptop purchase, Kunar and Jalalabad travel expense for Shahpoor Khan', 0.00, 45000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-386
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('d7d77f49-db05-4bc8-aeeb-9bb7afbccf24', 'JE-000394', '2025-07-26', 'Purchased two ThinkPad Laptop Computers for the Nangarhar and Kunar Branches use', 'JV-JV-386', 'journal_entry', 20000.00, 20000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '09c56bd0-5f01-45dc-bc00-46763ad36893', 'd7d77f49-db05-4bc8-aeeb-9bb7afbccf24', id, 'Purchased two ThinkPad Laptop Computers for the Nangarhar and Kunar Branches use', 20000.00, 0.00 FROM accounts WHERE account_code = '17101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '61ec11ab-15ac-4cf5-8371-f498852ef533', 'd7d77f49-db05-4bc8-aeeb-9bb7afbccf24', id, 'Purchased two ThinkPad Laptop Computers for the Nangarhar and Kunar Branches use', 0.00, 20000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-387
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('19eea21c-762b-401d-8146-bb7b17ca4fb7', 'JE-000395', '2025-07-26', 'Travel Advance paid to Shahpoor Khan to Kunar and Nangarhar branches', 'JV-JV-387', 'journal_entry', 24000.00, 24000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'f08fff13-72a6-4c99-a3e1-b3c19ecf0116', '19eea21c-762b-401d-8146-bb7b17ca4fb7', id, 'Travel Advance paid to Shahpoor Khan to Kunar and Nangarhar branches', 24000.00, 0.00 FROM accounts WHERE account_code = '20152';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '67871f53-99cd-4fd0-87a6-f017a17721fc', '19eea21c-762b-401d-8146-bb7b17ca4fb7', id, 'Travel Advance paid to Shahpoor Khan to Kunar and Nangarhar branches', 0.00, 24000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-388
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('0b18f6c1-fcf6-46e5-ad55-e66acd97f72f', 'JE-000396', '2025-07-26', 'Salary advance paid to Omid Ahmadzai', 'JV-JV-388', 'journal_entry', 1000.00, 1000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '4d396839-ae02-4ee5-89b5-0d27dd293439', '0b18f6c1-fcf6-46e5-ad55-e66acd97f72f', id, 'Salary advance paid to Omid Ahmadzai', 1000.00, 0.00 FROM accounts WHERE account_code = '20161';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '31f25fae-7bd0-474e-869c-9181baf2859a', '0b18f6c1-fcf6-46e5-ad55-e66acd97f72f', id, 'Salary advance paid to Omid Ahmadzai', 0.00, 1000.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-389
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('7f1c714a-3d13-433d-b900-9584858b673a', 'JE-000397', '2025-07-26', 'Taxi used by Mashal Achakzai for delivery to DAB  and purchase of Laptops', 'JV-JV-389', 'journal_entry', 220.00, 220.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'e70d10eb-6217-454c-a846-2306bfc8d33b', '7f1c714a-3d13-433d-b900-9584858b673a', id, 'Taxi used by Mashal Achakzai for delivery to DAB  and purchase of Laptops', 220.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '793130cd-b332-4912-845f-c2d9e3f62e29', '7f1c714a-3d13-433d-b900-9584858b673a', id, 'Taxi used by Mashal Achakzai for delivery to DAB  and purchase of Laptops', 0.00, 220.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-390
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('3e306744-738c-45a7-9a48-3a778aa696d1', 'JE-000398', '2025-07-27', 'Cash received CR# 39 for the office daily expenses', 'JV-JV-390', 'journal_entry', 15000.00, 15000.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'c080086f-d0f2-4ca4-ae69-7f10a97100a4', '3e306744-738c-45a7-9a48-3a778aa696d1', id, 'Cash received CR# 39 for the office daily expenses', 15000.00, 0.00 FROM accounts WHERE account_code = '10101';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '13ca1ad2-4cc3-4c65-abaa-74d94e7aa59e', '3e306744-738c-45a7-9a48-3a778aa696d1', id, 'Cash received CR# 39 for the office daily expenses', 0.00, 15000.00 FROM accounts WHERE account_code = '10100';

-- Entry: JV-391
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('59310f44-68db-4c3d-a9d8-144790718e88', 'JE-000399', '2025-07-27', 'Taxi used by Mashal Achakzai for delivery to DAB on 16th July 2025', 'JV-JV-391', 'journal_entry', 100.00, 100.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '7519d12f-4fe5-4cc2-86ef-3fd2ab30faed', '59310f44-68db-4c3d-a9d8-144790718e88', id, 'Taxi used by Mashal Achakzai for delivery to DAB on 16th July 2025', 100.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '57f0cca1-151f-4ffe-bae3-6cfa492f10fa', '59310f44-68db-4c3d-a9d8-144790718e88', id, 'Taxi used by Mashal Achakzai for delivery to DAB on 16th July 2025', 0.00, 100.00 FROM accounts WHERE account_code = '10101';

-- Entry: JV-392
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, reference_type, total_debit, total_credit, is_posted, posted_at, created_by) VALUES 
  ('63b35111-4892-4869-9731-a0eba7cc4ea5', 'JE-000400', '2025-07-27', 'Taxi used by Faisal Achakzai to receive cash', 'JV-JV-392', 'journal_entry', 40.00, 40.00, true, NOW(), 'import-script');
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT 'fa9aa070-47ca-4778-951d-58e022ab351a', '63b35111-4892-4869-9731-a0eba7cc4ea5', id, 'Taxi used by Faisal Achakzai to receive cash', 40.00, 0.00 FROM accounts WHERE account_code = '60802';
INSERT INTO journal_lines (id, journal_entry_id, account_id, description, debit_amount, credit_amount) 
  SELECT '41648f9d-1c6e-4cd6-aff4-fb4b3cd2817e', '63b35111-4892-4869-9731-a0eba7cc4ea5', id, 'Taxi used by Faisal Achakzai to receive cash', 0.00, 40.00 FROM accounts WHERE account_code = '10101';

COMMIT;