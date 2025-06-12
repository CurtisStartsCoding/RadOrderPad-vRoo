-- RadOrderPad Test Data Setup Queries
-- Queries to verify test data and set up testing scenarios

-- =====================================================
-- VERIFY TEST ORGANIZATIONS (Main DB)
-- =====================================================

-- Check test organizations exist
SELECT id, name, organization_type, basic_credit_balance, advanced_credit_balance
FROM organizations
WHERE name IN (
    'Test Clinic Alpha',
    'Test Imaging Center Beta', 
    'Test Hospital Gamma',
    'City Radiology Group'
)
ORDER BY organization_type, name;

-- =====================================================
-- VERIFY TEST USERS (Main DB)
-- =====================================================

-- Check test users by role
SELECT 
    u.id,
    u.email,
    u.name,
    u.role,
    o.name as organization
FROM users u
JOIN organizations o ON u.organization_id = o.id
WHERE u.email LIKE '%test%' OR u.email LIKE '%example%'
ORDER BY u.role, u.email;

-- Check specific role test users
SELECT email, name, role, is_active
FROM users
WHERE role IN ('physician', 'admin_staff', 'scheduler', 'radiologist')
AND (email LIKE '%test%' OR email LIKE '%example%')
ORDER BY role;

-- =====================================================
-- VERIFY TEST PATIENTS (PHI DB)
-- =====================================================

-- Check test patients
SELECT id, first_name, last_name, date_of_birth, mrn
FROM patients
WHERE first_name LIKE '%Test%' 
   OR last_name LIKE '%Test%'
   OR mrn LIKE 'TEST%'
   OR mrn LIKE 'TEMP%'
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- CHECK RECENT TEST ACTIVITY
-- =====================================================

-- Recent orders from test users (PHI DB)
SELECT 
    o.id,
    o.order_number,
    o.status,
    p.first_name || ' ' || p.last_name as patient_name,
    o.created_at
FROM orders o
LEFT JOIN patients p ON o.patient_id = p.id
WHERE o.created_at >= CURRENT_DATE - INTERVAL '7 days'
AND (p.first_name LIKE '%Test%' OR p.mrn LIKE 'TEST%' OR p.mrn LIKE 'TEMP%')
ORDER BY o.created_at DESC;

-- =====================================================
-- CREDIT BALANCE CHECKS (Main DB)
-- =====================================================

-- Organizations with low credits (need refill for testing)
SELECT 
    id,
    name,
    organization_type,
    basic_credit_balance,
    advanced_credit_balance,
    (basic_credit_balance + advanced_credit_balance) as total_credits
FROM organizations
WHERE organization_type IN ('referring_physician', 'hospital')
AND (basic_credit_balance < 10 OR advanced_credit_balance < 10)
ORDER BY total_credits;

-- =====================================================
-- CONNECTION STATUS (Main DB)
-- =====================================================

-- Check organization connections for testing
SELECT 
    oc.referring_organization_id,
    ro.name as referring_org,
    oc.radiology_organization_id,
    rao.name as radiology_org,
    oc.connection_status,
    oc.created_at
FROM organization_connections oc
JOIN organizations ro ON oc.referring_organization_id = ro.id
JOIN organizations rao ON oc.radiology_organization_id = rao.id
WHERE oc.connection_status = 'active'
AND (ro.name LIKE '%Test%' OR rao.name LIKE '%Test%')
ORDER BY oc.created_at DESC;

-- =====================================================
-- USEFUL UPDATE QUERIES FOR TESTING
-- =====================================================

-- Example: Add credits to test organization (Main DB)
-- UPDATE organizations 
-- SET basic_credit_balance = 100, advanced_credit_balance = 100
-- WHERE name = 'Test Clinic Alpha';

-- Example: Reset trial user validation count (Main DB)
-- UPDATE trial_users
-- SET validation_count = 0
-- WHERE email = 'test@example.com';

-- Example: Change order status for testing (PHI DB)
-- UPDATE orders
-- SET status = 'pending_admin'
-- WHERE order_number = 'ORD-XXXXXXXXX';