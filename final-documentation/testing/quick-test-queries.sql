-- RadOrderPad Quick Test Queries
-- Simple queries for common testing scenarios

-- =====================================================
-- BASIC HEALTH CHECKS
-- =====================================================

-- Test Main DB connection
-- psql "postgresql://postgres:password@localhost:15432/radorder_main?sslmode=require" -c "SELECT 'Main DB Connected' as status, COUNT(*) as user_count FROM users;"

-- Test PHI DB connection  
-- psql "postgresql://postgres:password2@localhost:15433/radorder_phi?sslmode=require" -c "SELECT 'PHI DB Connected' as status, COUNT(*) as order_count FROM orders;"

-- =====================================================
-- QUICK MAIN DB QUERIES
-- =====================================================

-- Last 5 trial users
SELECT email, first_name, last_name, validation_count, created_at
FROM trial_users
ORDER BY created_at DESC
LIMIT 5;

-- Organizations with credits
SELECT name, organization_type, basic_credit_balance, advanced_credit_balance
FROM organizations
WHERE organization_type = 'radiology_group'
ORDER BY name;

-- Active users
SELECT email, name, role, last_login_at
FROM users
WHERE is_active = true
ORDER BY last_login_at DESC
LIMIT 10;

-- =====================================================
-- QUICK PHI DB QUERIES
-- =====================================================

-- Today's orders
SELECT id, order_number, status, created_at
FROM orders
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;

-- Order status counts
SELECT status, COUNT(*) as count
FROM orders
GROUP BY status;

-- Last 5 orders with patients
SELECT 
    o.order_number,
    p.first_name || ' ' || p.last_name as patient,
    o.status,
    o.created_at
FROM orders o
LEFT JOIN patients p ON o.patient_id = p.id
ORDER BY o.created_at DESC
LIMIT 5;

-- =====================================================
-- TESTING SPECIFIC WORKFLOWS
-- =====================================================

-- Check if user can create orders (Main DB)
SELECT u.id, u.email, u.role, o.name as organization
FROM users u
JOIN organizations o ON u.organization_id = o.id
WHERE u.email = 'test@example.com';  -- Replace with test email

-- Check recent credit usage (Main DB)
SELECT organization_id, credit_type, credits_used, created_at
FROM credit_usage_logs
WHERE created_at >= CURRENT_DATE - INTERVAL '1 day'
ORDER BY created_at DESC;

-- Check validation attempts (PHI DB)
SELECT order_id, validation_result, processing_time_ms, created_at
FROM validation_attempts
WHERE created_at >= CURRENT_DATE - INTERVAL '1 day'
ORDER BY created_at DESC
LIMIT 10;