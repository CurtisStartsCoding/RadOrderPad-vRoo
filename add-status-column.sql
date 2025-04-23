-- SQL script to add the status column to the organizations table if it doesn't exist

-- Check if the status column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'organizations'
        AND column_name = 'status'
    ) THEN
        -- Add the status column with the default value 'active'
        ALTER TABLE organizations
        ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
        
        RAISE NOTICE 'Status column added to organizations table';
    ELSE
        RAISE NOTICE 'Status column already exists in organizations table';
    END IF;
END $$;