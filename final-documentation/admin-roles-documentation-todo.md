# Admin Roles Documentation To-Do List

## Overview
This document tracks the progress of documenting practice manager roles (admin_referring and admin_radiology) for the RadOrderPad system.

## Phase 1: Discovery - Analyze Existing Implementation

### 1.1 Test Analysis
- [ ] Check E2E tests for admin functionality
- [ ] Review working-tests-1.bat
- [ ] Review working-tests-2.bat  
- [ ] Review working-tests-3.bat
- [ ] Review working-tests-4.bat
- [ ] Look for role-specific test files in all-backend-tests/
- [ ] Extract actual API calls and workflows from tests
- [ ] Document test coverage gaps

### 1.2 Code Analysis
- [ ] Review auth middleware to understand role permissions
- [ ] Check route files for role-based access controls
  - [ ] organization.routes.ts
  - [ ] user.routes.ts
  - [ ] user-invite.routes.ts
  - [ ] user-location.routes.ts
  - [ ] connection.routes.ts
  - [ ] billing.routes.ts
- [ ] Identify all endpoints accessible by admin_referring
- [ ] Identify all endpoints accessible by admin_radiology
- [ ] Note any undocumented endpoints

### 1.3 Documentation Inventory
- [ ] Review organization-user-management-endpoints.md
- [ ] Review connection-management-endpoints.md
- [ ] Review billing-credit-endpoints.md
- [ ] Check DOCS/ folder for admin documentation
- [ ] Find any role-specific documentation
- [ ] List all documentation fragments found

## Phase 2: Organize by Functionality

### 2.1 Common Functions (Both Roles)
- [x] User Management (documented in user-management.md)
  - [x] List users in organization (GET /api/users)
  - [x] Get user by ID (GET /api/users/:userId)
  - [x] Invite new users (POST /api/user-invites/invite)
  - [x] Update user information (PUT /api/users/:userId)
  - [x] Deactivate users (DELETE /api/users/:userId)
  - [x] Assign users to locations (documented in user-location-assignment.md)
- [x] Location Management
  - [x] Create locations
  - [x] Update locations
  - [x] List locations
  - [x] Assign users to locations (documented in user-location-assignment.md)
- [x] Organization Management
  - [x] View organization profile (GET /api/organizations/mine)
  - [x] Update organization information (PUT /api/organizations/mine)
  - [x] Search organizations (GET /api/organizations)
  - [x] Registration with auto-role assignment
- [x] Connection Management (documented in connection-management.md)
  - [x] View connections (GET /api/connections)
  - [x] Request connections (POST /api/connections)
  - [x] List incoming requests (GET /api/connections/requests)
  - [x] Accept connections (POST /api/connections/:id/approve)
  - [x] Reject connections (POST /api/connections/:id/reject)
  - [x] Terminate connections (DELETE /api/connections/:id)
- [x] Billing Overview (documented in billing-credit.md)
  - [x] View credit balance
  - [x] View subscription status

### 2.2 admin_referring Specific Functions
- [x] Credit Management (documented in billing-credit.md)
  - [x] Purchase credits
  - [x] Create Stripe checkout sessions
  - [x] View credit usage history
  - [x] View billing history
- [x] Physician Management (part of user-management.md)
  - [x] Manage physician users (invite, update, deactivate)
  - [ ] View physician activity (not implemented)
- [ ] Order Management
  - [ ] View organization's orders (uses GET /api/orders with org filter)
  - [ ] Admin order finalization with complete patient/insurance data retrieval (fix implemented, pending testing)
  - [ ] Export order data (not implemented)

### 2.3 admin_radiology Specific Functions
- [x] Scheduler Management (part of user-management.md)
  - [x] Create scheduler accounts (invite with role=scheduler)
  - [x] Manage scheduler permissions (update/deactivate)
- [x] Radiologist Management (part of user-management.md)
  - [x] Create radiologist accounts (invite with role=radiologist)
  - [x] Manage radiologist permissions (update/deactivate)
- [x] Connection Management (documented in connection-management.md)
  - [x] View incoming connection requests
  - [x] Approve referring organizations
- [ ] Order Statistics
  - [ ] View incoming order volume (not implemented)
  - [ ] View order completion rates (not implemented)
  - [ ] Export radiology reports (not implemented)

### 2.4 super_admin Functions
- [x] Organization Management (documented in super-admin.md)
  - [x] List all organizations (GET /api/superadmin/organizations)
  - [x] View organization details (GET /api/superadmin/organizations/:orgId)
  - [x] Update organization status (PUT /api/superadmin/organizations/:orgId/status)
  - [x] Adjust credits (POST /api/superadmin/organizations/:orgId/credits/adjust)
- [x] User Management (documented in super-admin.md)
  - [x] List all users system-wide (GET /api/superadmin/users)
  - [x] View user details (GET /api/superadmin/users/:userId)
  - [x] Update user status (PUT /api/superadmin/users/:userId/status)
- [x] Prompt Management (partially documented in super-admin.md)
  - [x] List LLM prompt templates (tested)
  - [x] List prompt assignments (tested)
  - [ ] Create/update/delete templates (not tested)
  - [ ] Create/update/delete assignments (not tested)
- [x] System Monitoring (documented in super-admin.md)
  - [x] View validation logs (GET /api/superadmin/logs/validation)
  - [x] View enhanced validation logs (GET /api/superadmin/logs/validation/enhanced)
  - [x] View credit usage logs (GET /api/superadmin/logs/credits)
  - [x] View purgatory events (GET /api/superadmin/logs/purgatory)

### 2.5 trial User Functions
- [x] Limited Authentication (documented in trial-user.md)
  - [x] Trial registration (POST /api/auth/trial/register)
  - [x] Trial login (POST /api/auth/trial/login)
  - [x] Get trial profile (GET /api/auth/trial/me)
  - [x] Update password (POST /api/auth/trial/update-password)
- [x] Limited Physician Workflow (documented in trial-user.md)
  - [x] Patient search with demo data (POST /api/patients/search)
  - [x] Order validation only (POST /api/orders/validate/trial)
  - [x] Cannot create persistent orders (tested - returns 403)
  - [x] Cannot finalize or send to radiology

## Phase 3: Documentation Structure

### 3.1 Existing Documentation Review
Already exists in final-documentation/api/:
- [x] common-endpoints.md
- [x] physician-endpoints.md
- [x] admin-staff-endpoints.md
- [x] scheduler-endpoints.md
- [x] billing-credit-endpoints.md
- [x] connection-management-endpoints.md
- [x] file-upload-endpoints.md
- [x] patient-search-api.md
- [x] organization-user-management-endpoints.md (needs major revision)
- [x] endpoint-access-matrix.md
- [x] verified-api-reference.md

Missing documentation for admin roles:
- [x] admin-referring documentation is spread across:
  - organization-management.md
  - user-management.md
  - location-management.md
  - user-location-assignment.md
  - connection-management.md
  - billing-credit.md
- [x] admin-radiology documentation is spread across:
  - organization-management.md
  - user-management.md
  - location-management.md
  - user-location-assignment.md
  - connection-management.md
  - billing-credit.md (view only, no purchasing)

### 3.2 Documentation Standards
- [x] Each endpoint must include:
  - [x] HTTP method and full path
  - [x] Authorization requirements
  - [x] Request headers
  - [x] Request body schema
  - [x] Response schema (success and error)
  - [x] Status codes
  - [x] Real example from tests
  - [x] Common error scenarios
  - [x] Related endpoints

## Phase 4: Validation

### 4.1 Cross-Reference Verification
- [ ] Verify all endpoints against route files
- [ ] Verify authorization against middleware
- [ ] Verify against working test implementations
- [ ] Ensure no functionality is missed
- [ ] Check for deprecated endpoints

### 4.2 Test Coverage Summary
- [ ] Document which tests cover which endpoints
- [ ] Identify untested endpoints
- [ ] Create test recommendations
- [ ] Note any implementation inconsistencies

## Phase 5: Frontend Handoff Preparation

### 5.1 Create Frontend Integration Guide
- [ ] Common workflows for admin_referring
- [ ] Common workflows for admin_radiology
- [ ] Authentication flow
- [ ] Error handling patterns
- [ ] State management recommendations

### 5.2 API Client Examples
- [ ] JavaScript/TypeScript examples
- [ ] Error handling examples
- [ ] Authentication examples
- [ ] Common utility functions

## Issues Found in Existing Documentation

### Organization Management Documentation Status
- [x] Created clean organization-management.md with accurate documentation
- [x] Response format matches actual code (flat fields, correct structure)
- [x] Includes all credit balance fields
- [x] Uses correct organization types (referring_practice/radiology_group)
- [x] Includes organization registration documentation
- [x] Documents auto-role assignment based on organization type
- [x] Deleted old mixed organization-user-management-endpoints.md

## Progress Tracking

### Discovered Test Files
- [x] List all relevant test files found
  - working-tests.bat (Part 1) - Tests connection requests, user invite, uploads, billing
  - working-tests-2.bat (Part 2) - Tests user management, locations, connections
  - working-tests-3.bat & working-tests-4.bat - Additional comprehensive tests
  - test-connection-requests.js - Uses admin_referring token
  - test-radiology-request-info.js - Uses admin_radiology token
  - test-location-management.js - Uses admin_referring token
  - test-get-credit-balance.bat - Uses admin_referring token (403 for other roles)
  - scenario-e-connection-request.js - E2E test showing both admin roles
- [x] Note their locations
  - Working tests: /all-backend-tests/
  - Individual scripts: /all-backend-tests/scripts/
  - E2E tests: /tests/e2e/
- [x] Summarize what they test
  - Connection management (request, approve, reject, list)
  - User management (invite, update, deactivate)
  - Location management (create, update, assign users)
  - Billing/credits (admin_referring only)
  - Organization management (update profile, search)
  - File uploads (presigned URLs, confirmations)

### Discovered Documentation
- [x] List all documentation files found
  
  **Organization Management:**
  - DOCS/onboarding_organizations.md
  - frontend-explanation/API_IMPLEMENTATION_GUIDE/organization-management.md
  - frontend-explanation/API_IMPLEMENTATION_GUIDE/organizations-mine-summary.md
  - frontend-explanation/API_IMPLEMENTATION_GUIDE/organizations-mine-fix.md
  - frontend-explanation/api-docs/tutorials/organization-management/organization-profile.md
  
  **Location Management:**
  - DOCS/implementation/location-management-implementation.md
  - DOCS/implementation/location-filtering-implementation.md
  - frontend-explanation/api-docs/tutorials/organization-management/location-management.md
  - frontend-explanation/api-docs/tutorials/user-management/location-assignment.md
  
  **User Management:**
  - DOCS/implementation/user-invitation-implementation.md
  - frontend-explanation/API_IMPLEMENTATION_GUIDE/README-user-management.md
  - frontend-explanation/api-docs/tutorials/user-management/user-invitation.md
  - frontend-explanation/api-docs/tutorials/user-management/user-profiles.md
  
  **Connection Management:**
  - DOCS/implementation/connection-management-implementation.md
  - frontend-explanation/API_IMPLEMENTATION_GUIDE/connection-approval.md
  - frontend-explanation/API_IMPLEMENTATION_GUIDE/connection-management-details.md
  - frontend-explanation/API_IMPLEMENTATION_GUIDE/connection-management.md
  - frontend-explanation/API_IMPLEMENTATION_GUIDE/connection-rejection.md
  - frontend-explanation/API_IMPLEMENTATION_GUIDE/connection-testing.md
  - frontend-explanation/API_IMPLEMENTATION_GUIDE/README-connection-fixes.md
  - frontend-explanation/api-docs/tutorials/connections/managing-requests.md
  - frontend-explanation/api-docs/tutorials/connections/requesting-connections.md
  - frontend-explanation/api-docs/tutorials/connections/terminating-connections.md
  
  **Other:**
  - DOCS/implementation/notification-service-implementation.md
  - DOCS/implementation/end-to-end-testing.md
  - frontend-explanation/api-docs/tutorials/getting-started.md
  
  **Super Admin Documentation:**
  - docs-consolidated/superadmin/api-reference.md
  - docs-consolidated/superadmin/organization-management.md
  - docs-consolidated/superadmin/overview.md
  - docs-consolidated/superadmin/prompt-management.md
  - docs-consolidated/superadmin/README.md
  - docs-consolidated/superadmin/system-monitoring.md
  - docs-consolidated/superadmin/user-management.md
  - DOCS/implementation/superadmin-api-implementation.md
  - DOCS/implementation/superadmin-api-tests.md
  - DOCS/implementation/superadmin-api.md
  
  **Trial User Documentation:**
  - frontend-explanation/api-docs/tutorials/trial-features/physician-sandbox.md
  - DOCS/trial-feature.md
  - DOCS/role_based_access.md

- [ ] Note their completeness
- [ ] Identify redundancies

### Implementation Notes
- [ ] Any discovered bugs
- [ ] Any missing features
- [ ] Any inconsistencies
- [ ] Recommendations for improvements

## Next Steps
1. Start with test file discovery
2. Analyze authorization middleware
3. Create endpoint inventory
4. Begin documentation consolidation