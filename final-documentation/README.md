# RadOrderPad API Documentation

**Last Updated:** June 15, 2025

This directory contains comprehensive documentation for the RadOrderPad API backend.

## System Overview

RadOrderPad is a clinical decision support platform that:
1. Guides physicians to create appropriate imaging orders using ACR Appropriate Use Criteria
2. Automatically generates proper CPT/ICD-10 codes from clinical dictation
3. Routes completed orders to radiology groups for fulfillment

## ⚠️ Critical Implementation Gap

**[Location Integration Not Implemented](CRITICAL-LOCATION-INTEGRATION-GAP.md)** - Orders are not filtered by location. In multi-location organizations, admin staff see ALL orders from ALL locations. This must be addressed before production deployment.

**[Implementation Plan Available](LOCATION-INTEGRATION-IMPLEMENTATION-PLAN.md)** - Detailed plan to implement location-based filtering using existing database fields (no schema changes required).

## Quick Navigation by Role

### For Physicians
- **[Complete API Documentation](api/physician.md)** - All physician endpoints with examples
  - [Authentication](#authentication) - Login and session management
  - [Patient Search](#patient-search) - Find existing patients
  - [Order Validation](#validation) - ACR-based clinical validation
  - [Order Creation](#order-creation) - Create and finalize orders
  - [Profile Management](#profile) - Update user information

### For Admin Staff
- **[Complete API Documentation](api/admin-staff.md)** - All administrative endpoints
  - [Order Queue](#queue) - View pending orders
  - [Patient Updates](#patient-info) - Add demographics
  - [Insurance Updates](#insurance) - Add insurance details
  - [Send to Radiology](#send-radiology) - Route completed orders

### For Admin Referring
- **[Organization Management](api/organization-management.md)** - Manage organization profile
- **[User Management](api/user-management.md)** - Invite, update, and manage users ✅ **Frontend Integrated**
- **[Location Management](api/location-management.md)** - Manage physical locations/facilities ✅ **Frontend Integrated**
- **[User-Location Assignment](api/user-location-assignment.md)** - Assign users to locations
- **[Connection Management](api/connection-management.md)** - Partner relationships
- **[Billing & Credits](api/billing-credit.md)** - Purchase and track credits
- **[Statistics & Export](api/admin-statistics-endpoints.md)** - Order statistics and CSV export

### For Admin Radiology
- **[Organization Management](api/organization-management.md)** - Manage organization profile
- **[User Management](api/user-management.md)** - Invite schedulers and radiologists ✅ **Frontend Integrated**
- **[Location Management](api/location-management.md)** - Manage imaging centers ✅ **Frontend Integrated**
- **[User-Location Assignment](api/user-location-assignment.md)** - Assign staff to locations

### For Super Admins
- **[Debug Endpoints](api/debug-endpoints.md)** - Troubleshooting and data inspection tools
  - Organization and user listings
  - Order inspection and history
  - Trial user statistics
  - Custom database queries
  - Complete order details with all related data
- **[Connection Management](api/connection-management.md)** - Approve referring practices
- **[Billing & Credits](api/billing-credit.md)** - View dual credit balances
- **[Statistics & Export](api/admin-statistics-endpoints.md)** - Order statistics and CSV export

### For Schedulers (Radiology)
- **[Complete API Documentation](api/scheduler.md)** - All scheduler endpoints
  - [Incoming Orders Queue](#queue) - View orders from referring organizations
  - [Order Details](#details) - Complete order information
  - [Request Information](#request-info) - Ask for missing data
  - [Update Status](#status) - Track order progress
  - [Export Data](#export) - Integration with RIS/PACS

### For Super Admins
- **[Complete API Documentation](api/super-admin.md)** - System administration endpoints
  - [Organization Management](#organizations) - Manage all organizations
  - [User Management](#users) - Manage all users
  - [System Logs](#logs) - View validation, credit, and purgatory logs
  - [Prompt Management](#prompts) - Manage LLM prompt templates

### For Trial Users
- **[Complete API Documentation](api/trial-user.md)** - Limited access endpoints
  - [Trial Registration](#registration) - Create trial account
  - [Trial Login](#login) - Authenticate trial user
  - [Order Validation](#validation) - Limited validations (200 max)
  - [Limitations](#limitations) - What trial users cannot access

## Documentation Index

### API Documentation

#### Core References
- **[Common Endpoints](api/common.md)** - Authentication, profiles, file uploads, and other shared endpoints
- **[Endpoint Access Matrix](api/endpoint-access-matrix.md)** - Complete matrix showing which roles can access which endpoints

#### Role-Specific Endpoints
- [Physician Endpoints](api/physician.md) - Patient search, validation, and order creation
- [Admin Staff Endpoints](api/admin-staff.md) - Order queue processing and administrative updates
- [Scheduler Endpoints](api/scheduler.md) - Radiology workflow management and order processing
- [Super Admin Endpoints](api/super-admin.md) - System-wide administration and monitoring
- [Trial User Endpoints](api/trial-user.md) - Limited access for evaluation purposes
- [Organization Management](api/organization-management.md) - Organization profile management endpoints
- [User Management](api/user-management.md) - User invitation, updates, and deactivation
- [Location Management](api/location-management.md) - Physical location/facility management endpoints ✅ **Frontend Integrated**
- [User-Location Assignment](api/user-location-assignment.md) - Manage user access to locations
- [Connection Management](api/connection-management.md) - Partner relationship endpoints
- [Billing & Credits](api/billing-credit.md) - Credit and subscription management

#### Detailed References
- [Patient Search API](api/patient-search-api.md) - POST /api/patients/search for dictation-based lookup
- [File Upload](api/file-upload.md) - Document upload workflow with S3 integration
- [Utilities](api/utilities-endpoints.md) - External API proxies (NPI lookup for physician data)
- [User-Location Scalability](api/user-location-assignment-scalability.md) - Scalability considerations and future enhancements for bulk operations
- [Verified API Reference](api/verified-api-reference.md) - Comprehensive reference for all verified endpoints
- [Implemented Endpoints Summary](api/implemented-endpoints-summary.md) - Complete list of all implemented API endpoints by category

### Backend Documentation
- [Validation Engine Architecture](backend/validation-engine-architecture.md) - Technical architecture of the clinical decision support engine powering ACR-based appropriateness checks
- [Dual Credit Billing System](backend/dual-credit-billing-system.md) - Implementation of basic and advanced credit types for radiology organizations
- [Database Script Execution](backend/database-script-execution.md) - Guide for creating and running database maintenance scripts with connection examples
- [Admin Order Finalization - Data Retrieval Fix](backend/admin-order-finalization-data-retrieval-fix.md) - Resolution of saved data not appearing when returning to order finalization page

### Strategy Documentation
- [Radiology Export Strategy](radiology-export-strategy.md) - Strategy for exporting order data to radiology systems (CSV, JSON, PDF formats)
- [Order Tracking Strategy](order-tracking-strategy.md) - Strategy for tracking order status and progress through the workflow

### Optimization Documentation
- [Redis Payload Optimization](optimization/redis-payload-optimization.md) - Analysis and solution for reducing excessive Redis data in logs and API payloads
- [Redis Implementation Comparison](optimization/redis-implementation-comparison.md) - Side-by-side comparison of Replit (Valkey) vs current (RedisSearch) implementations
- [RedisSearch Best Practices](optimization/redissearch-best-practices.md) - Guide for leveraging RedisSearch effectively while minimizing data transfer

### Frontend Documentation
- [API Integration Guide](frontend/api-integration-guide.md) - Comprehensive guide for replacing hardcoded frontend data with API calls
- [Validation Engine Integration](frontend/validation-engine-integration.md) - Guide for integrating the validation engine into frontend applications
- [Validation Workflow Guide](frontend/validation-workflow-guide.md) - Step-by-step workflow showing how physicians refine clinical dictation based on ACR feedback until approved (codes shown only when appropriate)
- [Admin Order Finalization](frontend/admin-order-finalization.md) - Implementation guide for the multi-tab interface used by admin staff to complete physician orders
- [Connections Feature](frontend/connections-feature.md) - Implementation documentation for partner organization connection management ✅ **Completed**
- [Location Management Feature](frontend/location-management-feature.md) - Implementation documentation for location/facility management ✅ **Completed**
- [Frontend API Integration Todo](frontend/frontend-api-integration-todo.md) - Master checklist for implementing API integration in RadOrderPad frontend

### Order Process Documentation
- [Complete Order Workflow](order-process/complete-order-workflow.md) - End-to-end process from physician dictation through clinical decision support to radiology group routing
- [Radiology Export Strategy](radiology-export-strategy.md) - Phased approach for exporting orders to radiology RIS systems (pilot to enterprise scale)
- [Order Tracking Strategy](order-tracking-strategy.md) - Lightweight solutions for tracking order status after export to radiology systems

### Testing Documentation
- [Order Finalization Testing](testing/order-finalization-testing.md) - Comprehensive testing guide for the order finalization process including test scripts and scenarios
- [Database Tunnel Setup](testing/database-tunnel-setup.md) - Guide for setting up SSH tunnels to access production databases for testing
- [Common Queries](testing/common-queries.sql) - Comprehensive SQL queries for testing all database tables and relationships
- [Quick Test Queries](testing/quick-test-queries.sql) - Simple queries for quick database health checks and basic testing
- [Test Data Setup](testing/test-data-setup.sql) - Queries to verify test data and prepare testing scenarios
- [Role-Based Test Scripts](../all-backend-tests/role-tests/) - Working test scripts and results for each user role
  - [Physician Tests](../all-backend-tests/role-tests/physician-role-tests.js) - Complete physician workflow tests (login, patient search, order validation with clarification loop, order creation, order finalization, status checking)
  - [Admin Staff Tests](../all-backend-tests/role-tests/admin-staff-role-tests.js) - Admin queue and processing tests (login, queue retrieval with location filtering, patient info update, insurance update, paste EMR summary, paste supplemental, document upload, send to radiology)
  - [Admin Staff Complete Tests](../all-backend-tests/role-tests/admin-staff-role-tests-complete.js) - Full admin staff tests including actual S3 file upload
  - [Admin Staff Test Results](../all-backend-tests/role-tests/admin-staff-workflow-summary.md) - Verified endpoint behaviors and known limitations
  - [Admin Referring Tests](../all-backend-tests/role-tests/admin-referring-role-tests.js) - Practice admin tests (organization management, user management, location management, connections, billing)
  - [Admin Radiology Tests](../all-backend-tests/role-tests/admin-radiology-role-tests.js) - Radiology admin tests (organization management, radiologist/scheduler management, dual credits, connection approvals)
  - [Scheduler Tests](../all-backend-tests/role-tests/scheduler-role-tests.js) - Radiology workflow tests (login, incoming orders queue, order details, request information, update status, export data)
  - [Scheduler Test Results](../all-backend-tests/role-tests/scheduler-workflow-summary.md) - Verified endpoint behaviors and known limitations
  - [Trial User Tests](../all-backend-tests/role-tests/trial-role-tests.js) - Trial user workflow tests (registration, login, validation with limits, password update)
  - [Super Admin Tests](../all-backend-tests/scripts/test-superadmin-api.js) - System administration tests (organizations, users, status updates, credit adjustments)

#### Test Execution
- **Physician Tests**: Run with `node all-backend-tests/role-tests/physician-role-tests.js` or `all-backend-tests/role-tests/run-physician-role-tests.bat`
- **Admin Staff Tests**: Run with `node all-backend-tests/role-tests/admin-staff-role-tests.js` or `all-backend-tests/role-tests/run-admin-staff-role-tests.bat`
- **Admin Referring Tests**: Run with `node all-backend-tests/role-tests/admin-referring-role-tests.js` or `all-backend-tests/role-tests/run-admin-referring-role-tests.bat`
- **Admin Radiology Tests**: Run with `node all-backend-tests/role-tests/admin-radiology-role-tests.js` or `all-backend-tests/role-tests/run-admin-radiology-role-tests.bat`
- **Scheduler Tests**: Run with `node all-backend-tests/role-tests/scheduler-role-tests.js` or `all-backend-tests/role-tests/run-scheduler-role-tests.bat`
- **Trial User Tests**: Run with `node all-backend-tests/role-tests/trial-role-tests.js`
- **Super Admin Tests**: Run with `node all-backend-tests/scripts/test-superadmin-api.js`
- **Comprehensive Admin Staff Tests**: Run with `all-backend-tests/admin-staff-role-comprehensive-tests.bat` (includes all admin staff tests + S3 uploads)
- **Comprehensive Scheduler Tests**: Run with `all-backend-tests/scheduler-role-comprehensive-tests.bat` (includes scheduler tests + radiology request info tests)
- **All Working Tests**: Run with `all-backend-tests/working-tests.bat`, `working-tests-2.bat`, or `working-tests-3.bat` for different test suites

## Using This Documentation

This documentation is designed to be a comprehensive reference for developers working on the RadOrderPad API backend.

### Getting Started
1. **Identify your role** - Use the Quick Navigation section above
2. **Review the workflow** - See [Complete Order Workflow](order-process/complete-order-workflow.md)
3. **Find your endpoints** - Each role has dedicated API documentation
4. **Test your integration** - Use the [testing guides](testing/) for validation

### For Frontend Developers
1. **Start with role documentation** - Each role has complete API specs with examples
2. **Check the access matrix** - See which endpoints your role can access
3. **Review test results** - Working examples show actual API responses
4. **Use common endpoints** - Authentication and file uploads are shared across roles

### Finding Information Quickly
- **By Role**: Use the Quick Navigation section at the top
- **By Feature**: Browse the Documentation Index
- **By Endpoint**: Use Ctrl+F in the relevant API documentation file
- **By Workflow**: Start with the order process documentation

## Maintaining Documentation

When making changes to the codebase, please ensure that the relevant documentation is updated to reflect those changes. This helps maintain the documentation as a reliable source of truth for the system.

### Internal Documentation References
- [Feature Documentation Status](feature-documentation-status.md) - Tracks implementation status of features and their documentation coverage
- [Admin Roles Documentation Todo](admin-roles-documentation-todo.md) - Checklist for documenting practice manager roles (admin_referring and admin_radiology)

## Related Resources

- [DOCS](../DOCS) - Legacy documentation directory
- [docs-consolidated](../docs-consolidated) - Consolidated documentation from various sources