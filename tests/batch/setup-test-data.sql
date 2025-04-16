-- SQL script to set up test data for connection management tests

-- First, check if organizations with IDs 1 and 2 already exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM organizations WHERE id = 1) THEN
        -- Insert organization 1 (referring practice)
        INSERT INTO organizations (
            id, name, type, npi, tax_id, address_line1, city, state, zip_code, 
            phone_number, contact_email, status, credit_balance
        ) VALUES (
            1, 'Test Referring Practice', 'referring_practice', '1234567890', '12-3456789',
            '123 Main St', 'Test City', 'TS', '12345', '555-123-4567',
            'admin@testreferring.com', 'active', 1000
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM organizations WHERE id = 2) THEN
        -- Insert organization 2 (radiology group)
        INSERT INTO organizations (
            id, name, type, npi, tax_id, address_line1, city, state, zip_code, 
            phone_number, contact_email, status, credit_balance
        ) VALUES (
            2, 'Test Radiology Group', 'radiology_group', '0987654321', '98-7654321',
            '456 Imaging Ave', 'Test City', 'TS', '12345', '555-987-6543',
            'admin@testradiology.com', 'active', 1000
        );
    END IF;
END $$;

-- Next, check if users with IDs 1 and 2 already exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = 1) THEN
        -- Insert user 1 (admin for referring practice)
        -- Note: Using a simple password hash for testing purposes only
        INSERT INTO users (
            id, organization_id, email, password_hash, first_name, last_name, 
            role, is_active, email_verified
        ) VALUES (
            1, 1, 'test.admin@example.com', 
            '$2b$10$1234567890123456789012345678901234567890123456789012345678901234', 
            'Test', 'Admin', 'admin_referring', true, true
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM users WHERE id = 2) THEN
        -- Insert user 2 (admin for radiology group)
        -- Note: Using a simple password hash for testing purposes only
        INSERT INTO users (
            id, organization_id, email, password_hash, first_name, last_name, 
            role, is_active, email_verified
        ) VALUES (
            2, 2, 'target.admin@example.com', 
            '$2b$10$1234567890123456789012345678901234567890123456789012345678901234', 
            'Target', 'Admin', 'admin_referring', true, true
        );
    END IF;
END $$;

-- Reset the sequence for organizations if needed
SELECT setval('organizations_id_seq', (SELECT MAX(id) FROM organizations), true);

-- Reset the sequence for users if needed
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users), true);