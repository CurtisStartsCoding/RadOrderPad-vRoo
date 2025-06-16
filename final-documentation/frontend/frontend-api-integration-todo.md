# Frontend API Integration Todo List

**Created:** January 2025  
**Last Updated:** June 2025  
**Purpose:** Master checklist for implementing API integration in RadOrderPad frontend  
**Priority:** Focus on core workflow first (Phase 1) to get orders flowing to radiology

## Major Accomplishments (June 2025)
- ⚠️ Admin Order Finalization: Save functionality works but EMR parser has issues
- ✅ Send to Radiology: Working with real radiology organizations from connections
- ✅ Dynamic Facility Selection: Loads real locations based on selected radiology org
- ✅ Connections Management: Complete implementation with request/approve/reject flow
- ✅ Location Management: Full CRUD operations with filtering and formatting
- ✅ Navigation: Fixed menu access for Connections page
- ✅ API Integration: Unified endpoint for order updates
- ✅ Fixed targetFacilityId: Now uses correct facility ID instead of organization ID

## Critical Issues
- 🔴 EMR Parser not updating patient names (first/last name fields)
- 🔴 Only partial field updates when parsing EMR data

## CRITICAL PATH - Phase 1: Core Order Workflow (Week 1)
**Goal: Get orders flowing from physicians → admin staff → radiology**

### 1.1 Fix AdminOrderFinalization - Send to Radiology [PRIORITY: HIGH] ✅ COMPLETED (June 2025)

- [x] **Load radiology organizations from connections data** ✅ COMPLETED (June 2025)
  - [x] Fetch active connections with type='radiology' from API
  - [x] Store in component state for dropdown population
  - [x] Update radiology dropdown to use real organizations (not mock)
  - [x] Handle different API response formats (connections vs data property)
  
- [x] **Dynamic Facility Location Selection** ✅ COMPLETED (June 2025)
  - [x] Fetch locations via GET /api/organizations/:orgId/locations
  - [x] Show facilities when radiology org is selected
  - [x] Fix targetFacilityId to use actual facility ID (not org ID)
  - [x] Handle loading and empty states
  
- [ ] **Implement credit balance check**
  - [ ] Add API call: `GET /api/billing/credit-balance`
  - [ ] Display current balance in UI
  - [ ] Show warning if balance < 10 credits
  - [ ] Display credit cost (1 credit per order)
  
- [x] **Implement Send to Radiology API** ✅ COMPLETED
  - [x] Replace mock handler with real API call
  - [x] Use endpoint: `POST /api/admin/orders/:orderId/send-to-radiology`
  - [x] Pass `radiologyOrganizationId` in request body
  - [x] Handle success response with remaining credits
  - [x] Handle insufficient credits error (code: 'INSUFFICIENT_CREDITS')
  - [x] Navigate to `/admin-queue` on success
  - [x] Show success toast with radiology org name

### 1.2 AdminOrderFinalization - Save Patient/Insurance Info [PRIORITY: HIGH] ✅ BACKEND FIXED

- [x] **Add Save button to Patient Info tab** ✅ COMPLETED
  - [x] Place button next to "Continue to Insurance"
  - [x] Add loading state for save operation
  
- [x] **Implement patient info save API** ✅ COMPLETED
  - [x] Use endpoint: `PUT /api/admin/orders/:orderId/patient-info`
  - [x] Convert camelCase to snake_case for API (firstName → first_name)
  - [x] Handle partial updates (only send changed fields)
  - [x] Show success toast: "Patient information saved"
  - [x] Show error toast on failure
  
- [x] **Add Save button to Insurance Info tab** ✅ COMPLETED
  - [x] Place button next to "Continue to Order Details"
  - [x] Add loading state for save operation
  
- [x] **Implement insurance info save API** ✅ COMPLETED
  - [x] Use endpoint: `PUT /api/admin/orders/:orderId/insurance-info`
  - [x] Map frontend fields to API fields (insurerName, policyNumber, etc.)
  - [x] Handle partial updates
  - [x] Show success/error toasts

- [x] **BACKEND FIX: Data Retrieval Issue** ✅ COMPLETED (January 2025)
  - [x] Fixed `GET /api/orders/:orderId` to JOIN with `patients` and `patient_insurance` tables
  - [x] Added patient fields: `patient_first_name`, `patient_last_name`, `patient_city`, `patient_state`, `patient_zip_code`, etc.
  - [x] Added insurance fields: `insurance_name`, `insurance_policy_number`, `insurance_group_number`, etc.
  - [x] Added supplemental EMR content: `supplemental_emr_content`
  - [x] **Result**: Saved data now shows when returning to order finalization page

- [x] **UNIFIED ENDPOINT IMPLEMENTATION** ✅ COMPLETED (June 2025)
  - [x] Backend created unified `PUT /api/admin/orders/:orderId` endpoint
  - [x] Frontend updated to use unified endpoint for all saves:
    - [x] Patient info save uses unified endpoint with `patient: {}` wrapper
    - [x] Insurance save uses unified endpoint with `insurance: {}` wrapper
    - [x] Order details save uses unified endpoint with `orderDetails: {}` and `supplementalText`
  - [x] All data now saves with camelCase field names
  - [x] Fixed date of birth persistence by checking both `patient_date_of_birth` and `patient_dob`
  - [x] **Result**: All tabs now save correctly with the unified endpoint

### 1.3 AdminOrderFinalization - EMR Parsing [PRIORITY: HIGH] 🔴 CRITICAL ISSUES

- [x] **Replace mock EMR parsing** ✅ API integrated
  - [x] Use endpoint: `POST /api/admin/orders/:orderId/paste-summary`
  - [x] Send `pastedText` in request body
  - [ ] **Update patient form with `parsedData.patientInfo`** ❌ **BROKEN: Not updating names**
  - [x] Update insurance form with `parsedData.insuranceInfo` ⚠️ Partial updates only
  - [x] Show parsing progress indicator
  - [x] Handle parsing errors gracefully

**🔴 CRITICAL ISSUES - Must Fix:**
1. **Patient Names Not Updating**: EMR parser returns first/last names but they don't populate in form
2. **Inconsistent Field Updates**: Some fields update, others don't (seems random)
3. **No Error Feedback**: When parsing fails partially, user has no indication
4. **Form State Issue**: Possible React Hook Form state management problem

**Investigation Needed:**
- Check if parser returns correct field names (firstName vs first_name)
- Verify form field registration matches parser output
- Test with console.log to see what data actually comes back
- Check if form reset/setValue is being called correctly

### 1.4 AdminOrderFinalization - Supplemental Documents [PRIORITY: MEDIUM] ✅ BACKEND FIXED

- [x] **Implement paste supplemental API** ✅ COMPLETED
  - [x] Use endpoint: `POST /api/admin/orders/:orderId/paste-supplemental`
  - [x] Add save button for supplemental text
  - [x] Show success toast when saved

- [x] **BACKEND FIX: Supplemental Data Retrieval** ✅ COMPLETED (January 2025)
  - [x] Fixed `GET /api/orders/:orderId` to include latest supplemental EMR content
  - [x] Added `supplemental_emr_content` field from `patient_clinical_records` table
  - [x] **Result**: Saved supplemental information now shows when returning to order details tab
  
- [ ] **Verify DocumentManager integration** 🚧 PENDING IMPLEMENTATION
  - [ ] Ensure it uses real upload endpoints
  - [ ] Test file upload flow works

### 1.5 AdminQueue - Ensure Real Data Flow [PRIORITY: MEDIUM]

- [ ] **Verify queue shows real orders**
  - [ ] Confirm using `/api/orders` endpoint
  - [ ] Ensure status filter shows "pending_admin" orders
  - [ ] Test navigation to finalization page
  - [ ] Verify order ID is stored in sessionStorage

### 1.6 Create Location ID Mapping [PRIORITY: MEDIUM] ✅ COMPLETED (June 2025)

- [x] **Create location ID mapping for facility selection** ✅ COMPLETED
  - [x] Fetch organization locations from API
  - [x] Map facility names to location IDs  
  - [x] Full location management implemented
  - [x] Update AdminOrderFinalization to use real location IDs ✅ COMPLETED

## Phase 2: Complete Order Creation (Week 1-2)
**Goal: Enable physicians to create orders end-to-end**

### 2.1 Patient Search Implementation [PRIORITY: HIGH]

- [ ] **Create PatientSearch component**
  - [ ] Add to NewOrder page before validation step
  - [ ] Design search form with name and DOB fields
  
- [ ] **Implement search API**
  - [ ] Use endpoint: `POST /api/patients/search`
  - [ ] Support natural language date parsing
  - [ ] Handle empty results (offer to create new patient)
  - [ ] Handle multiple results (show selection list)
  - [ ] Store selected patient in component state

### 2.2 Fix Signature Upload [PRIORITY: HIGH]

- [ ] **Create reusable FileUploadService**
  ```typescript
  class FileUploadService {
    async uploadSignature(signatureDataUrl: string, orderId?: number)
    async uploadDocument(file: File, orderId: number, documentType: string)
  }
  ```
  
- [ ] **Implement presigned URL flow**
  - [ ] Call `POST /api/uploads/presigned-url` with file metadata
  - [ ] Upload to S3 using returned `uploadUrl`
  - [ ] Call `POST /api/uploads/confirm` to confirm upload
  - [ ] Return S3 key for order creation

### 2.3 Fix Order Creation API [PRIORITY: HIGH]

- [ ] **Update NewOrder final submission**
  - [ ] Use endpoint: `POST /api/orders`
  - [ ] Include all required fields:
    - patientId (from search or creation)
    - dictationText
    - validationResult (from validation step)
    - signatureS3Key (from upload)
  - [ ] Handle success response with orderId
  - [ ] Navigate to success page or order list

### 2.4 Order Validation Flow [PRIORITY: MEDIUM]

- [ ] **Ensure validation clarification loop works**
  - [ ] Track validation attempts count
  - [ ] Show clarification UI when status = 'NEEDS_CLARIFICATION'
  - [ ] Allow override after 3 attempts
  - [ ] Pass override flag and justification to API

## 🏢 Phase 3: Organization Management (Week 2)
**Goal: Enable organizations to manage users and locations**

### 3.1 User Management Pages ⭐⭐ ✅ COMPLETED (June 2025)

- [x] **Update Users.tsx page** ✅ COMPLETED
  - [x] Replace mock data with API call: `GET /api/users`
  - [x] Add pagination support (20 users per page)
  - [x] Implement search filter (name, email, role)
  - [x] Separate tabs for active users and pending invitations
  
- [x] **Implement user invitation** ✅ COMPLETED
  - [x] Add invite dialog with email and role selection
  - [x] Use endpoint: `POST /api/user-invites/invite`
  - [x] Role-based restrictions (admin type determines available roles)
  - [x] Success toast notifications
  
- [x] **Enable user updates** ✅ COMPLETED
  - [x] Comprehensive edit dialog (not inline editing)
  - [x] Use endpoint: `PUT /api/users/:userId`
  - [x] Support activation/deactivation (soft delete)
  - [x] Update all user details (name, phone, specialty, NPI, role)
  - [x] NPI validation with auto-population from CMS registry

### 3.2 Location Management ⭐⭐ ✅ COMPLETED (June 2025)

- [x] **Update Locations.tsx page** ✅ COMPLETED
  - [x] Fetch locations: `GET /api/organizations/mine/locations`
  - [x] Show active/inactive status with filter (Active/Inactive/All)
  - [x] Added debug information panel with statistics
  - [x] US date formatting (MM/DD/YYYY)
  - [x] Phone number formatting (XXX) XXX-XXXX
  
- [x] **Implement location CRUD** ✅ COMPLETED
  - [x] Create: `POST /api/organizations/mine/locations` with dialog form
  - [x] Update: `PUT /api/organizations/mine/locations/:id` with edit dialog
  - [x] Deactivate: `DELETE /api/organizations/mine/locations/:id` (soft delete)
  - [x] Add form validation for required fields
  - [x] Auto-format phone numbers and ZIP codes as user types
  - [x] Success/error toast notifications
  - [x] Improved card layout with inline deactivate button

### 3.3 User-Location Assignment ⭐

- [ ] **Add location assignment to user management**
  - [ ] Fetch user locations: `GET /api/user-locations/:userId/locations`
  - [ ] Assign location: `POST /api/user-locations/:userId/locations/:locationId`
  - [ ] Remove location: `DELETE /api/user-locations/:userId/locations/:locationId`
  - [ ] Show assigned locations in user list

### 3.4 Organization Profile ⭐

- [ ] **Update OrganizationProfile.tsx**
  - [ ] Fetch org data: `GET /api/organizations/mine`
  - [ ] Enable updates: `PUT /api/organizations/mine`
  - [ ] Show credit balance
  - [ ] Display organization type and status

## 💳 Phase 4: Billing & Credits (Week 2-3)
**Goal: Enable credit purchases and tracking**

### 4.1 Credit Display Throughout App ⭐⭐

- [ ] **Add credit balance to header/sidebar**
  - [ ] Fetch on app load
  - [ ] Refresh after order sends
  - [ ] Show low balance warning (< 10 credits)
  
- [ ] **Add credit warnings to order submission**
  - [ ] Check balance before sending to radiology
  - [ ] Block submission if insufficient credits
  - [ ] Show purchase link in error message

### 4.2 BillingCredits Page ⭐⭐

- [ ] **Display current balance**
  - [ ] Use endpoint: `GET /api/billing/credit-balance`
  - [ ] Show different UI for radiology (dual credits)
  
- [ ] **Show credit usage history**
  - [ ] Use endpoint: `GET /api/billing/credit-usage`
  - [ ] Add date range filters
  - [ ] Display in table with pagination
  
- [ ] **Implement credit purchase**
  - [ ] Add package selection (100, 500, 1000 credits)
  - [ ] Calculate discounts for bulk purchases
  - [ ] Use endpoint: `POST /api/billing/create-checkout-session`
  - [ ] Handle Stripe redirect
  - [ ] Add success/cancel pages

### 4.3 Subscription Management ⭐

- [ ] **Display subscription info**
  - [ ] Show current tier and status
  - [ ] Display next billing date
  - [ ] Link to Stripe customer portal
  
- [ ] **Handle subscription creation**
  - [ ] Use endpoint: `POST /api/billing/subscriptions`
  - [ ] Add plan selection UI
  - [ ] Handle Stripe integration

## 🤝 Phase 5: Connection Management (Week 3) ✅ COMPLETED
**Goal: Enable partner relationships**

### 5.1 Connections Page ⭐ ✅ COMPLETED (June 2025)

- [x] **List current connections** ✅ COMPLETED
  - [x] Use endpoint: `GET /api/connections`
  - [x] Separate active and pending (using tabs)
  - [x] Show connection details (ID, Org Name, Type, Direction)
  - [x] Added debugging info (connection IDs, org IDs)
  
- [x] **Search organizations** ✅ COMPLETED
  - [x] Use endpoint: `GET /api/organizations?type=radiology_group`
  - [x] Add search filters (search box for connections)
  - [x] Display results with organization IDs

### 5.2 Connection Actions ⭐ ✅ COMPLETED (June 2025)

- [x] **Send connection requests** ✅ COMPLETED
  - [x] Use endpoint: `POST /api/connections` (with targetOrgId)
  - [x] Add dialog with organization selection dropdown
  - [x] Show success confirmation
  - [x] Auto-refresh connections list after request
  
- [x] **Manage connections** ✅ COMPLETED
  - [x] Approve: `POST /api/connections/:id/approve`
  - [x] Reject: `POST /api/connections/:id/reject`
  - [x] Terminate: `DELETE /api/connections/:id`
  - [x] Show appropriate buttons based on connection direction
  - [x] Handle errors (duplicate requests, etc.)

## ✨ Phase 6: Nice-to-Have Features (Week 4+)
**Goal: Polish and enhance user experience**

### 6.1 Enhanced Admin Queue

- [ ] Add advanced filters (date range, physician, modality)
- [ ] Implement column sorting
- [ ] Add bulk actions
- [ ] Enable CSV export

### 6.2 Order Tracking

- [ ] Add order timeline view
- [ ] Show status history
- [ ] Display audit trail
- [ ] Add order notes

### 6.3 Dashboard Enhancements

- [ ] Add order statistics widgets
- [ ] Show credit usage trends
- [ ] Display connection status
- [ ] Add quick actions

### 6.4 Radiology Features

- [ ] Implement RadiologyQueue.tsx fully
- [ ] Add scheduler workflow
- [ ] Enable status updates
- [ ] Add export functionality

## 📋 Implementation Notes

### API Request Pattern
```typescript
const response = await apiRequest('METHOD', '/api/endpoint', requestBody);
if (!response.ok) throw new Error('API Error');
const data = await response.json();
```

### Field Mapping
Backend uses snake_case, frontend uses camelCase:
- firstName ↔ first_name
- dateOfBirth ↔ date_of_birth
- phoneNumber ↔ phone_number
- addressLine1 ↔ address_line1
- zipCode ↔ zip_code

### Error Handling
- Check for `error.code === 'INSUFFICIENT_CREDITS'`
- Display user-friendly error messages
- Log errors for debugging
- Handle network failures gracefully

### Testing Each Feature
1. Test happy path first
2. Test error scenarios
3. Verify data persistence
4. Check UI updates
5. Test with different user roles

### Important Backend Quirks
1. **Send to Radiology**: Endpoint is `POST /api/admin/orders/:orderId/send-to-radiology` (no longer uses -fixed suffix)
2. **Field Names**: Unified endpoint uses camelCase, old endpoints use snake_case
3. **Credit System**: Each order sent consumes 1 credit
4. **Order Status**: Orders must be "pending_admin" to appear in queue
5. **Radiology Orgs**: Admin staff CAN fetch via connections API - use active connections with radiology type
6. **Date of Birth**: Backend may return as either `patient_date_of_birth` or `patient_dob`
7. **Unified Endpoint**: `PUT /api/admin/orders/:orderId` accepts nested objects (patient, insurance, orderDetails, supplementalText)
8. **Order Details Limitations**: 
   - Radiology group selection not saved (no backend field)
   - ~~Facility location needs ID mapping (currently hardcoded to 1)~~ ✅ FIXED - Now uses real facility IDs
   - Scheduling timeframe field doesn't exist in database yet
9. **Connections API**: 
   - Returns wrapped response: `{ connections: [...] }`
   - Uses `isInitiator` boolean to determine request direction
   - Connection IDs are different from organization IDs
   - Can only approve requests TO your organization (not FROM)
10. **Navigation Fixes**:
    - Connections menu item added to AppHeader.tsx for admin roles
    - Menu shows in hamburger menu on all screen sizes
11. **API Response Inconsistency**:
    - Connections API: `{ connections: [...] }`
    - Locations API: `{ success: true, data: [...] }`
    - Orders API: `{ orders: [...], pagination: {...} }`
    - See technical debt document for standardization plan

## Success Metrics
- ✅ Orders can be created by physicians
- ✅ Admin staff can process and send orders
- ✅ Credits are tracked and consumed properly
- ✅ Organizations can manage users and locations
- ✅ Billing/payment flow works end-to-end

This comprehensive todo list focuses on getting the core workflow operational first (Phase 1), then building out the supporting features needed for a complete system. Each item is specific and actionable, making it easy to track progress.