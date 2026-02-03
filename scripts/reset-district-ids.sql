-- Script to reset district IDs to start from 1
-- Run this in the Replit Database Shell or pgAdmin

-- Step 1: Create a temporary table with new sequential IDs
CREATE TEMP TABLE district_id_mapping AS
SELECT id as old_id, ROW_NUMBER() OVER (ORDER BY id) as new_id
FROM districts;

-- Step 2: Update the districts with new IDs (using a high offset first to avoid conflicts)
UPDATE districts d
SET id = m.new_id + 10000
FROM district_id_mapping m
WHERE d.id = m.old_id;

-- Step 3: Now set to final IDs
UPDATE districts d
SET id = d.id - 10000;

-- Step 4: Reset the sequence to continue from the max ID + 1
SELECT setval('districts_id_seq', (SELECT MAX(id) FROM districts));

-- Verify the results
SELECT id, name, province_id FROM districts ORDER BY province_id, id LIMIT 20;
