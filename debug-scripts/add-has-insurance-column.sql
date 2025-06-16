-- Add has_insurance column to orders table
-- This tracks whether the patient has insurance for this specific order
-- Allows proper handling of uninsured/cash-pay patients

ALTER TABLE orders 
ADD COLUMN has_insurance boolean NOT NULL DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN orders.has_insurance IS 'Indicates whether patient has insurance for this order. False = uninsured/cash-pay, True = has insurance';

-- Update existing test orders to have insurance if they have insurance data
UPDATE orders o
SET has_insurance = true
WHERE EXISTS (
    SELECT 1 
    FROM patient_insurance pi 
    WHERE pi.patient_id = o.patient_id
    AND pi.insurer_name IS NOT NULL
    AND pi.policy_number IS NOT NULL
);