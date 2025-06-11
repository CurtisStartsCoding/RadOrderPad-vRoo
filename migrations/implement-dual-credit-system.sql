-- Migration: Implement dual credit system for radiology organizations
-- Date: 2025-06-11
-- Description: Adds support for basic and advanced credit balances for radiology organizations

-- Add dual credit fields to organizations table
ALTER TABLE organizations 
ADD COLUMN basic_credit_balance INTEGER DEFAULT 0,
ADD COLUMN advanced_credit_balance INTEGER DEFAULT 0;

-- Update credit_usage_logs to track credit type
ALTER TABLE credit_usage_logs 
ADD COLUMN credit_type TEXT DEFAULT 'referring_credit' 
CHECK (credit_type IN ('referring_credit', 'radiology_basic', 'radiology_advanced'));

-- Update existing credit_usage_logs entries
-- All existing entries are from referring organizations
UPDATE credit_usage_logs 
SET credit_type = 'referring_credit' 
WHERE credit_type IS NULL;

-- Set initial test credits for existing radiology organizations
UPDATE organizations 
SET basic_credit_balance = 100, 
    advanced_credit_balance = 100
WHERE organization_type = 'radiology_group';

-- Add comments to document the credit system
COMMENT ON COLUMN organizations.credit_balance IS 'Credit balance for referring organizations (single credit type)';
COMMENT ON COLUMN organizations.basic_credit_balance IS 'Basic imaging credit balance for radiology organizations';
COMMENT ON COLUMN organizations.advanced_credit_balance IS 'Advanced imaging credit balance for radiology organizations (MRI, CT, PET, Nuclear)';
COMMENT ON COLUMN credit_usage_logs.credit_type IS 'Type of credit used: referring_credit for physicians, radiology_basic or radiology_advanced for radiology orgs';