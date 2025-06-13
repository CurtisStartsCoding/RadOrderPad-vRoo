# Frontend API Integration Todo List

**Created:** January 2025  
**Purpose:** Master checklist for implementing API integration in RadOrderPad frontend  
**Priority:** Focus on core workflow first (Phase 1) to get orders flowing to radiology

## CRITICAL PATH - Phase 1: Core Order Workflow (Week 1)
**Goal: Get orders flowing from physicians → admin staff → radiology**

### 1.1 Fix AdminOrderFinalization - Send to Radiology [PRIORITY: HIGH]

- [ ] **Load radiology organizations from connections data**
  - [ ] Fetch active connections with type='radiology' from localStorage or parent component
  - [ ] Store in component state for dropdown population
  - [ ] Update radiology dropdown to use real organizations (not mock)
  
- [ ] **Implement credit balance check**
  - [ ] Add API call: `GET /api/billing/credit-balance`
  - [ ] Display current balance in UI
  - [ ] Show warning if balance < 10 credits
  - [ ] Display credit cost (1 credit per order)
  
- [ ] **Implement Send to Radiology API**
  - [ ] Replace mock handler with real API call
  - [ ] Use endpoint: `POST /api/admin/orders/:orderId/send-to-radiology`
  - [ ] Pass `radiologyOrganizationId` in request body
  - [ ] Handle success response with remaining credits
  - [ ] Handle insufficient credits error (code: 'INSUFFICIENT_CREDITS')
  - [ ] Navigate to `/admin-queue` on success
  - [ ] Show success toast with radiology org name

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

### 1.3 AdminOrderFinalization - EMR Parsing [PRIORITY: MEDIUM]

- [ ] **Replace mock EMR parsing**
  - [ ] Use endpoint: `POST /api/admin/orders/:orderId/paste-summary`
  - [ ] Send `pastedText` in request body
  - [ ] Update patient form with `parsedData.patientInfo`
  - [ ] Update insurance form with `parsedData.insuranceInfo`
  - [ ] Show parsing progress indicator
  - [ ] Handle parsing errors gracefully

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

### 3.1 User Management Pages ⭐⭐

- [ ] **Update Users.tsx page**
  - [ ] Replace mock data with API call: `GET /api/users`
  - [ ] Add pagination support
  - [ ] Implement filters (role, status, name)
  
- [ ] **Implement user invitation**
  - [ ] Add invite form with email and role selection
  - [ ] Use endpoint: `POST /api/user-invites/invite`
  - [ ] Show invitation link if sendEmail=false
  - [ ] Add success message with email status
  
- [ ] **Enable user updates**
  - [ ] Add edit mode for user rows
  - [ ] Use endpoint: `PUT /api/users/:userId`
  - [ ] Support activation/deactivation
  - [ ] Update user details (name, phone, etc.)

### 3.2 Location Management ⭐⭐

- [ ] **Update Locations.tsx page**
  - [ ] Fetch locations: `GET /api/organizations/mine/locations`
  - [ ] Show active/inactive status
  
- [ ] **Implement location CRUD**
  - [ ] Create: `POST /api/organizations/mine/locations`
  - [ ] Update: `PUT /api/organizations/mine/locations/:id`
  - [ ] Deactivate: `DELETE /api/organizations/mine/locations/:id`
  - [ ] Add form validation for required fields

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

## 🤝 Phase 5: Connection Management (Week 3)
**Goal: Enable partner relationships**

### 5.1 Connections Page ⭐

- [ ] **List current connections**
  - [ ] Use endpoint: `GET /api/connections`
  - [ ] Separate active and pending
  - [ ] Show connection details
  
- [ ] **Search organizations**
  - [ ] Use endpoint: `GET /api/organizations/search`
  - [ ] Add search filters
  - [ ] Display results with action buttons

### 5.2 Connection Actions ⭐

- [ ] **Send connection requests**
  - [ ] Use endpoint: `POST /api/connections`
  - [ ] Add optional message field
  - [ ] Show success confirmation
  
- [ ] **Manage connections**
  - [ ] Approve: `POST /api/connections/:id/approve`
  - [ ] Reject: `POST /api/connections/:id/reject`
  - [ ] Terminate: `DELETE /api/connections/:id`

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
1. **Send to Radiology**: Currently working endpoint uses `-fixed` suffix
2. **Field Names**: Patient/insurance updates use snake_case
3. **Credit System**: Each order sent consumes 1 credit
4. **Order Status**: Orders must be "pending_admin" to appear in queue
5. **Radiology Orgs**: Admin staff cannot fetch list via API - must be provided by frontend

## Success Metrics
- ✅ Orders can be created by physicians
- ✅ Admin staff can process and send orders
- ✅ Credits are tracked and consumed properly
- ✅ Organizations can manage users and locations
- ✅ Billing/payment flow works end-to-end

This comprehensive todo list focuses on getting the core workflow operational first (Phase 1), then building out the supporting features needed for a complete system. Each item is specific and actionable, making it easy to track progress.