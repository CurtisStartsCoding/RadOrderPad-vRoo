-- Migration to add the missing referring_organization_name column to the orders table
-- This is part of the HIPAA compliance update

-- Check if the column already exists before adding it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'referring_organization_name'
    ) THEN
        -- Add the missing column
        ALTER TABLE orders
        ADD COLUMN referring_organization_name VARCHAR(255);
        
        RAISE NOTICE 'Added referring_organization_name column to orders table';
    ELSE
        RAISE NOTICE 'referring_organization_name column already exists in orders table';
    END IF;
END $$;

-- Update the column with data from the organizations table if possible
-- This requires a connection to the main database, which might not be possible in all environments
-- You may need to run this part separately or modify it based on your database setup
/*
UPDATE orders o
SET referring_organization_name = org.name
FROM (
    SELECT id, name 
    FROM organizations
    WHERE type = 'referring_practice'
) org
WHERE o.referring_organization_id = org.id
AND o.referring_organization_name IS NULL;
*/

-- Create schema_migrations table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'schema_migrations'
    ) THEN
        CREATE TABLE schema_migrations (
            version VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            applied_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        
        RAISE NOTICE 'Created schema_migrations table';
    END IF;
END $$;

-- Log the migration
INSERT INTO schema_migrations (version, name, applied_at)
VALUES ('20250421', 'add-referring-organization-name', NOW())
ON CONFLICT (version) DO NOTHING;