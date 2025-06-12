-- RadOrderPad Common Database Queries
-- Use these with psql or your preferred PostgreSQL client

-- =====================================================
-- MAIN DATABASE QUERIES (radorder_main)
-- =====================================================

-- Get all organizations with their types and credit balances
SELECT 
    id, name, organization_type,
    basic_credit_balance, advanced_credit_balance,
    created_at
FROM organizations
ORDER BY created_at DESC;

-- Check trial users and their usage
SELECT 
    email, first_name, last_name, specialty,
    validation_count, max_validations,
    ROUND((validation_count::numeric / max_validations * 100), 2) as usage_percent,
    created_at, last_validation_at
FROM trial_users
WHERE validation_count > 0
ORDER BY validation_count DESC;

-- Get active users by organization
SELECT 
    o.name as organization,
    u.email, u.name, u.role,
    u.last_login_at, u.created_at
FROM users u
JOIN organizations o ON u.organization_id = o.id
WHERE u.is_active = true
ORDER BY o.name, u.role;

-- Credit usage in last 30 days
SELECT 
    o.name as organization,
    cul.credit_type,
    COUNT(*) as usage_count,
    SUM(cul.credits_used) as total_credits
FROM credit_usage_logs cul
JOIN organizations o ON cul.organization_id = o.id
WHERE cul.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY o.name, cul.credit_type
ORDER BY total_credits DESC;

-- Connection requests status
SELECT 
    cr.status,
    ro.name as requesting_org,
    rao.name as radiology_org,
    cr.created_at,
    cr.updated_at
FROM connection_requests cr
JOIN organizations ro ON cr.requesting_organization_id = ro.id
JOIN organizations rao ON cr.radiology_organization_id = rao.id
ORDER BY cr.created_at DESC;

-- =====================================================
-- PHI DATABASE QUERIES (radorder_phi)
-- =====================================================

-- Order status summary
SELECT 
    status,
    COUNT(*) as count,
    MIN(created_at) as earliest,
    MAX(created_at) as latest
FROM orders
GROUP BY status
ORDER BY count DESC;

-- Recent orders with patient info
SELECT 
    o.id,
    o.order_number,
    o.status,
    o.priority,
    o.modality,
    p.first_name || ' ' || p.last_name as patient_name,
    p.date_of_birth,
    p.mrn,
    o.created_at
FROM orders o
LEFT JOIN patients p ON o.patient_id = p.id
ORDER BY o.created_at DESC
LIMIT 20;

-- Orders by day for last 7 days
SELECT 
    DATE(created_at) as order_date,
    status,
    COUNT(*) as order_count
FROM orders
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at), status
ORDER BY order_date DESC, status;

-- Validation attempts by result
SELECT 
    validation_result,
    COUNT(*) as count,
    AVG(CASE WHEN processing_time_ms IS NOT NULL 
         THEN processing_time_ms 
         ELSE 0 END) as avg_processing_ms
FROM validation_attempts
GROUP BY validation_result
ORDER BY count DESC;

-- Orders with multiple validation attempts
SELECT 
    o.id,
    o.order_number,
    o.status,
    COUNT(va.id) as validation_attempts,
    MAX(va.created_at) as last_attempt
FROM orders o
JOIN validation_attempts va ON o.id = va.order_id
GROUP BY o.id, o.order_number, o.status
HAVING COUNT(va.id) > 1
ORDER BY validation_attempts DESC
LIMIT 20;

-- Patient demographics summary
SELECT 
    COUNT(DISTINCT id) as total_patients,
    COUNT(DISTINCT mrn) as unique_mrns,
    COUNT(CASE WHEN phone IS NOT NULL THEN 1 END) as with_phone,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as with_email,
    MIN(date_of_birth) as oldest_dob,
    MAX(date_of_birth) as youngest_dob
FROM patients;

-- Document uploads by type
SELECT 
    file_type,
    upload_status,
    COUNT(*) as count,
    SUM(file_size) / 1024 / 1024 as total_mb
FROM document_uploads
GROUP BY file_type, upload_status
ORDER BY count DESC;

-- Order history audit trail (last 50 events)
SELECT 
    oh.order_id,
    o.order_number,
    oh.event_type,
    oh.previous_status,
    oh.new_status,
    oh.details,
    oh.created_at
FROM order_history oh
JOIN orders o ON oh.order_id = o.id
ORDER BY oh.created_at DESC
LIMIT 50;

-- =====================================================
-- CROSS-DATABASE QUERIES (requires manual correlation)
-- =====================================================

-- To correlate users with their orders:
-- 1. Run this in main DB to get user info:
SELECT id, email, name, organization_id, role 
FROM users 
WHERE email = 'specific@email.com';

-- 2. Use the user id in PHI DB:
SELECT * FROM orders 
WHERE created_by_user_id = [user_id_from_above]
ORDER BY created_at DESC;