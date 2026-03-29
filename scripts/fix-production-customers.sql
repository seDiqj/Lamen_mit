-- ============================================================
-- Production Fix Script: Generate Customer IDs & Remove Duplicate
-- Run this against the PRODUCTION database
-- ============================================================

BEGIN;

-- ============================================================
-- STEP 1: Remove the duplicate unlinked customer record
-- (Toor Agha SHAMS created on Mar 17 with no loans attached)
-- ============================================================
DELETE FROM customers 
WHERE id = 'e1d50b81-d522-42ab-ab3d-dca8f8d0ce86';
-- Expected: 1 row deleted

-- ============================================================
-- STEP 2: Generate customer_no for customers missing it
-- Branch 102 (Kunar): current max = 102000112, next starts at 102000113
-- Branch 103 (Nangarhar): current max = 103000057, next starts at 103000058
-- ============================================================

-- Kunar branch customers (branch code 102) - 8 customers
UPDATE customers SET customer_no = '102000113' WHERE id = '05944343-ffba-4114-beb5-ae1583284aec'; -- Shakirullah Nasimi
UPDATE customers SET customer_no = '102000114' WHERE id = '811b5faa-a0b5-42d3-a929-64717e870cf3'; -- Hamidullah Mushwany
UPDATE customers SET customer_no = '102000115' WHERE id = 'e46ff733-2633-4081-901e-ecdf0514be3c'; -- Mohammad Idrees Saberi
UPDATE customers SET customer_no = '102000116' WHERE id = '5e825e25-4ebf-42d0-8e14-fe159c099c95'; -- Abadullah Rahil
UPDATE customers SET customer_no = '102000117' WHERE id = '1d6e3134-6da2-4748-a394-04211348295b'; -- Abdul Wahid Meran
UPDATE customers SET customer_no = '102000118' WHERE id = '5572afe5-32ec-4bd7-bb92-e5fccbe4c1d3'; -- Abdul Halim Kamran
UPDATE customers SET customer_no = '102000119' WHERE id = '21d62662-2cda-41ab-b128-da4f18963100'; -- Najibullah Salarzai
UPDATE customers SET customer_no = '102000120' WHERE id = 'cef06408-bfc9-4ceb-8003-af0158152f53'; -- Khalida
UPDATE customers SET customer_no = '102000121' WHERE id = 'ac69ecec-09a4-4969-b2bb-4338ec7b0b47'; -- Muqam Khan Kunari

-- Nangarhar branch customer (branch code 103) - 1 customer
UPDATE customers SET customer_no = '103000058' WHERE id = 'd310cf7b-aba2-4c67-9dc6-2f1725dcb269'; -- Toor Agha SHAMS

-- ============================================================
-- STEP 3: Verify the changes
-- ============================================================
-- Check no customers remain without customer_no
SELECT id, customer_no, first_name, national_id 
FROM customers 
WHERE customer_no IS NULL OR customer_no = '';

-- Verify the updated records
SELECT id, customer_no, first_name, national_id 
FROM customers 
WHERE customer_no IN ('102000113','102000114','102000115','102000116','102000117','102000118','102000119','102000120','102000121','103000058')
ORDER BY customer_no;

-- Verify duplicate is removed
SELECT id, customer_no, first_name, national_id 
FROM customers 
WHERE national_id = '1399-1101-66886';

COMMIT;
