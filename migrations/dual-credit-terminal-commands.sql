-- Run these commands one by one if you need to execute directly in psql or another SQL client
-- Date: 2025-06-11

-- 1. Add basic_credit_balance column
ALTER TABLE organizations 
ADD COLUMN basic_credit_balance INTEGER DEFAULT 0;

-- 2. Add advanced_credit_balance column
ALTER TABLE organizations 
ADD COLUMN advanced_credit_balance INTEGER DEFAULT 0;

-- 3. Add credit_type column to credit_usage_logs
ALTER TABLE credit_usage_logs 
ADD COLUMN credit_type TEXT DEFAULT 'referring_credit' 
CHECK (credit_type IN ('referring_credit', 'radiology_basic', 'radiology_advanced'));

-- 4. Update existing credit_usage_logs entries
UPDATE credit_usage_logs 
SET credit_type = 'referring_credit' 
WHERE credit_type IS NULL;

-- 5. Set initial test credits for radiology organizations
UPDATE organizations 
SET basic_credit_balance = 100, 
    advanced_credit_balance = 100
WHERE organization_type = 'radiology_group';

-- 6. Add documentation comments (optional but helpful)
COMMENT ON COLUMN organizations.credit_balance IS 'Credit balance for referring organizations (single credit type)';
COMMENT ON COLUMN organizations.basic_credit_balance IS 'Basic imaging credit balance for radiology organizations';
COMMENT ON COLUMN organizations.advanced_credit_balance IS 'Advanced imaging credit balance for radiology organizations (MRI, CT, PET, Nuclear)';
COMMENT ON COLUMN credit_usage_logs.credit_type IS 'Type of credit used: referring_credit for physicians, radiology_basic or radiology_advanced for radiology orgs';

-- Verification queries:
-- Check new columns exist
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'organizations' 
AND column_name IN ('basic_credit_balance', 'advanced_credit_balance');

-- Check radiology orgs have credits
SELECT id, name, basic_credit_balance, advanced_credit_balance 
FROM organizations 
WHERE organization_type = 'radiology_group';