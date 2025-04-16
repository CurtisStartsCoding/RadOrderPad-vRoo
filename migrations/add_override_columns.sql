-- Add missing override columns to orders table in the PHI database
-- Note: Some override columns already exist in the schema (override_justification, overridden, is_urgent_override)

-- Add columns to the orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS override_reason TEXT, -- Specific reason code or category
ADD COLUMN IF NOT EXISTS override_notes TEXT, -- Additional notes about the override
ADD COLUMN IF NOT EXISTS override_by INTEGER REFERENCES users(id), -- User who performed the override
ADD COLUMN IF NOT EXISTS override_date TIMESTAMP, -- When the override occurred
ADD COLUMN IF NOT EXISTS admin_notes TEXT, -- Notes from admin review
ADD COLUMN IF NOT EXISTS last_updated_by INTEGER REFERENCES users(id), -- User who last updated the record
ADD COLUMN IF NOT EXISTS last_updated_at TIMESTAMP; -- When the record was last updated

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_override_by ON orders(override_by);
CREATE INDEX IF NOT EXISTS idx_orders_last_updated_by ON orders(last_updated_by);