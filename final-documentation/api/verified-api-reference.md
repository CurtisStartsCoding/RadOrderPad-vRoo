# RadOrderPad API Reference - Verified Against Codebase

**Version:** 2.0  
**Last Updated:** June 9, 2025  
**Status:** VERIFIED - Every endpoint confirmed against actual route files

## Methodology

This documentation was created by systematically examining every route file in `src/routes/` and documenting only endpoints that actually exist in the codebase. Every claim is backed by code evidence.

## Base URL

```
Production: https://api.radorderpad.com
Development: http://localhost:3000
```

---

## 1. Authentication Endpoints

**SOURCE:** `src/routes/auth.routes.ts` (Lines 26, 33, 40, 47, 54, 61)

### Register Organization
**POST** `/api/auth/register`
- **Access:** Public
- **Controller:** `authController.register` (Line 26)

### User Login
**POST** `/api/auth/login`
- **Access:** Public
- **Controller:** `authController.login` (Line 33)

### Trial User Registration
**POST** `/api/auth/trial/register`
- **Access:** Public
- **Controller:** `trialRegisterController.registerTrialUser` (Line 40)

### Trial User Login
**POST** `/api/auth/trial/login`
- **Access:** Public
- **Controller:** `trialLoginController.loginTrialUser` (Line 47)

### Get Trial User Profile
**GET** `/api/auth/trial/me`
- **Access:** Authenticated (Trial User JWT)
- **Middleware:** `authenticateJWT` (Line 54)
- **Controller:** `trialMeController.getTrialMe` (Line 54)

### Update Trial User Password
**POST** `/api/auth/trial/update-password`
- **Access:** Public
- **Controller:** `trialPasswordController.updateTrialPassword` (Line 61)

### Test Registration (Development)
**POST** `/api/auth/register-test`
- **Access:** Public (bypasses CAPTCHA)
- **Controller:** `registerController.register` with test mode (Lines 13-18)

---

## 2. Order Management Endpoints

**SOURCE:** `src/routes/orders.routes.ts`

### List Orders
**GET** `/api/orders`
- **Access:** Private (Authenticated users)
- **Middleware:** `authenticateJWT` (Line 25)
- **Controller:** `orderManagementController.listOrders` (Line 26)

### Validate Order
**POST** `/api/orders/validate`
- **Access:** Private (Physician)
- **Middleware:** `authenticateJWT`, `authorizeRole(['physician'])`, `validateOrderRateLimiter` (Lines 36-38)
- **Rate Limit:** 60 requests per minute (Lines 12-16)
- **Controller:** `orderValidationController.validateOrder` (Line 39)

### Validate Trial Order
**POST** `/api/orders/validate/trial`
- **Access:** Private (Trial users only)
- **Middleware:** `authenticateJWT`, `validateOrderRateLimiter` (Lines 96-97)
- **Rate Limit:** 60 requests per minute
- **Controller:** `trialValidateController.validateTrialOrder` (Line 98)

### Create Order (Legacy)
**PUT** `/api/orders/new`
- **Access:** Private (Physician)
- **Middleware:** `authenticateJWT`, `authorizeRole(['physician'])` (Lines 49-50)
- **Controller:** `orderManagementController.createOrder` (Line 51)

### Create Finalized Order (New)
**POST** `/api/orders`
- **Access:** Private (Physician)
- **Middleware:** `authenticateJWT`, `authorizeRole(['physician'])` (Lines 108-109)
- **Controller:** `orderCreationController.createFinalizedOrder` (Line 110)

### Finalize Order
**PUT** `/api/orders/:orderId`
- **Access:** Private (Physician)
- **Middleware:** `authenticateJWT`, `authorizeRole(['physician'])` (Lines 61-62)
- **Controller:** `orderManagementController.finalizeOrder` (Line 63)

### Get Order Details
**GET** `/api/orders/:orderId`
- **Access:** Private (Any authenticated user with access to the order)
- **Middleware:** `authenticateJWT` (Line 73)
- **Controller:** `orderManagementController.getOrder` (Line 74)

### Admin Update Order
**POST** `/api/orders/:orderId/admin-update`
- **Access:** Private (Admin)
- **Middleware:** `authenticateJWT`, `authorizeRole(['admin'])` (Lines 84-85)
- **Controller:** `orderManagementController.adminUpdate` (Line 86)

---

## 3. Admin Order Endpoints

**SOURCE:** `src/routes/admin-orders.routes.ts`

### List Pending Admin Orders
**GET** `/api/admin/orders/queue`
- **Access:** Private (Admin Staff)
- **Middleware:** `authenticateJWT`, `authorizeRole(['admin_staff'])` (Lines 14-15)
- **Controller:** `adminOrderController.listPendingAdminOrders` (Line 16)

### Process EMR Summary
**POST** `/api/admin/orders/:orderId/paste-summary`
- **Access:** Private (Admin Staff)
- **Middleware:** `authenticateJWT`, `authorizeRole(['admin_staff'])` (Lines 26-27)
- **Controller:** `adminOrderController.handlePasteSummary` (Line 28)

### Process Supplemental Documents
**POST** `/api/admin/orders/:orderId/paste-supplemental`
- **Access:** Private (Admin Staff)
- **Middleware:** `authenticateJWT`, `authorizeRole(['admin_staff'])` (Lines 38-39)
- **Controller:** `adminOrderController.handlePasteSupplemental` (Line 40)

### Send to Radiology
**POST** `/api/admin/orders/:orderId/send-to-radiology`
- **Access:** Private (Admin Staff)
- **Middleware:** `authenticateJWT`, `authorizeRole(['admin_staff'])` (Lines 50-51)
- **Controller:** `adminOrderController.sendToRadiology` (Line 52)

### Send to Radiology (Fixed Implementation)
**POST** `/api/admin/orders/:orderId/send-to-radiology-fixed`
- **Access:** Private (Admin Staff)
- **Middleware:** `authenticateJWT`, `authorizeRole(['admin_staff'])` (Lines 62-63)
- **Controller:** Dynamic import of `handleSendToRadiologyFixed` (Lines 64-69)

### Update Patient Info
**PUT** `/api/admin/orders/:orderId/patient-info`
- **Access:** Private (Admin Staff)
- **Middleware:** `authenticateJWT`, `authorizeRole(['admin_staff'])` (Lines 79-80)
- **Controller:** `adminOrderController.updatePatientInfo` (Line 81)

### Update Insurance Info
**PUT** `/api/admin/orders/:orderId/insurance-info`
- **Access:** Private (Admin Staff)
- **Middleware:** `authenticateJWT`, `authorizeRole(['admin_staff'])` (Lines 91-92)
- **Controller:** `adminOrderController.updateInsuranceInfo` (Line 93)

---

## 4. Organization Management Endpoints

**SOURCE:** `src/routes/organization.routes.ts`

**Global Middleware:** `authenticateJWT` applied to all routes (Line 9)

### Get My Organization
**GET** `/api/organizations/mine`
- **Access:** Authenticated
- **Controller:** `organizationController.getMyOrganization` (Line 12)

### Update My Organization
**PUT** `/api/organizations/mine`
- **Access:** Admin Referring, Admin Radiology
- **Middleware:** `authorizeRole(['admin_referring', 'admin_radiology'])` (Line 14)
- **Controller:** `organizationController.updateMyOrganization` (Line 14)

### Search Organizations
**GET** `/api/organizations`
- **Access:** Admin Referring, Admin Radiology
- **Middleware:** `authorizeRole(['admin_referring', 'admin_radiology'])` (Line 17)
- **Controller:** `organizationController.searchOrganizations` (Line 17)

### List Organization Locations
**GET** `/api/organizations/mine/locations`
- **Access:** Admin Referring, Admin Radiology
- **Middleware:** `authorizeRole(adminRoles)` where `adminRoles = ['admin_referring', 'admin_radiology']` (Lines 21, 24)
- **Controller:** `locationController.listLocations` (Line 24)

### Create Organization Location
**POST** `/api/organizations/mine/locations`
- **Access:** Admin Referring, Admin Radiology
- **Middleware:** `authorizeRole(adminRoles)` (Line 27)
- **Controller:** `locationController.createLocation` (Line 27)

### Get Location Details
**GET** `/api/organizations/mine/locations/:locationId`
- **Access:** Admin Referring, Admin Radiology
- **Middleware:** `authorizeRole(adminRoles)` (Line 30)
- **Controller:** `locationController.getLocation` (Line 30)

### Update Location
**PUT** `/api/organizations/mine/locations/:locationId`
- **Access:** Admin Referring, Admin Radiology
- **Middleware:** `authorizeRole(adminRoles)` (Line 33)
- **Controller:** `locationController.updateLocation` (Line 33)

### Deactivate Location
**DELETE** `/api/organizations/mine/locations/:locationId`
- **Access:** Admin Referring, Admin Radiology
- **Middleware:** `authorizeRole(adminRoles)` (Line 36)
- **Controller:** `locationController.deactivateLocation` (Line 36)

---

## 5. User Management Endpoints

**SOURCE:** `src/routes/user.routes.ts`

**Global Middleware:** `authenticateJWT` applied to all routes (Line 8)

### Get My Profile
**GET** `/api/users/me`
- **Access:** Private (Any authenticated user)
- **Controller:** `userController.getMe` (Line 15)

### Update My Profile
**PUT** `/api/users/me`
- **Access:** Private (Any authenticated user)
- **Controller:** `userController.updateMe` (Line 27)
- **Body Parameters:** firstName, lastName, phoneNumber, specialty, npi (Lines 21-25)

### List Organization Users
**GET** `/api/users`
- **Access:** Private (admin_referring, admin_radiology)
- **Middleware:** `authorizeRole(['admin_referring', 'admin_radiology'])` (Line 41)
- **Controller:** `userController.listOrgUsers` (Line 41)
- **Query Parameters:** page, limit, sortBy, sortOrder, role, status, name (Lines 33-39)

### Get User by ID
**GET** `/api/users/:userId`
- **Access:** Private (admin_referring, admin_radiology)
- **Middleware:** `authorizeRole(['admin_referring', 'admin_radiology'])` (Line 49)
- **Controller:** `userController.getOrgUserById` (Line 49)

### Update User
**PUT** `/api/users/:userId`
- **Access:** Private (admin_referring, admin_radiology)
- **Middleware:** `authorizeRole(['admin_referring', 'admin_radiology'])` (Line 64)
- **Controller:** `userController.updateOrgUserById` (Line 64)
- **Body Parameters:** firstName, lastName, phoneNumber, specialty, npi, role, isActive (Lines 56-62)

### Deactivate User
**DELETE** `/api/users/:userId`
- **Access:** Private (admin_referring, admin_radiology)
- **Middleware:** `authorizeRole(['admin_referring', 'admin_radiology'])` (Line 72)
- **Controller:** `userController.deactivateOrgUserById` (Line 72)

---

## 6. User Invitation Endpoints

**SOURCE:** `src/routes/user-invite.routes.ts`

### Invite User
**POST** `/api/user-invites/invite`
- **Access:** Private (admin_referring, admin_radiology)
- **Middleware:** `authenticateJWT`, `authorizeRole(adminRoles)` where `adminRoles = ['admin_referring', 'admin_radiology']` (Lines 8, 12)
- **Controller:** `userInviteController.inviteUser` (Line 12)

### Accept Invitation
**POST** `/api/user-invites/accept-invitation`
- **Access:** Public (doesn't require authentication)
- **Controller:** `userInviteController.acceptInvitation` (Line 16)

---

## 7. Connection Management Endpoints

**SOURCE:** `src/routes/connection.routes.ts`

**Global Middleware:** `authenticateJWT` applied to all routes (Line 8)
**Admin Roles:** `['admin_referring', 'admin_radiology']` (Line 11)

### List Connections
**GET** `/api/connections`
- **Access:** Admin Referring, Admin Radiology
- **Middleware:** `authorizeRole(adminRoles)` (Line 14)
- **Controller:** `connectionController.listConnections` (Line 14)

### Request Connection
**POST** `/api/connections`
- **Access:** Admin Referring, Admin Radiology
- **Middleware:** `authorizeRole(adminRoles)` (Line 17)
- **Controller:** `connectionController.requestConnection` (Line 17)

### List Incoming Requests
**GET** `/api/connections/requests`
- **Access:** Admin Referring, Admin Radiology
- **Middleware:** `authorizeRole(adminRoles)` (Line 20)
- **Controller:** `connectionController.listIncomingRequests` (Line 20)

### Approve Connection
**POST** `/api/connections/:relationshipId/approve`
- **Access:** Admin Referring, Admin Radiology
- **Middleware:** `authorizeRole(adminRoles)` (Line 23)
- **Controller:** `connectionController.approveConnection` (Line 23)

### Reject Connection
**POST** `/api/connections/:relationshipId/reject`
- **Access:** Admin Referring, Admin Radiology
- **Middleware:** `authorizeRole(adminRoles)` (Line 26)
- **Controller:** `connectionController.rejectConnection` (Line 26)

### Terminate Connection
**DELETE** `/api/connections/:relationshipId`
- **Access:** Admin Referring, Admin Radiology
- **Middleware:** `authorizeRole(adminRoles)` (Line 29)
- **Controller:** `connectionController.terminateConnection` (Line 29)

---

## 8. Billing Endpoints

**SOURCE:** `src/routes/billing.routes.ts`

### Get Billing Overview
**GET** `/api/billing`
- **Access:** Private (admin_referring, admin_radiology)
- **Middleware:** `authenticateJWT`, `authorizeRole(['admin_referring', 'admin_radiology'])` (Lines 20-21)
- **Controller:** `getBillingOverview` (Line 22)

### Create Checkout Session
**POST** `/api/billing/create-checkout-session`
- **Access:** Private (admin_referring only)
- **Middleware:** `authenticateJWT`, `authorizeRole(['admin_referring'])` (Lines 32-33)
- **Controller:** `createCheckoutSession` (Line 34)

### Create Subscription
**POST** `/api/billing/subscriptions`
- **Access:** Private (admin_referring only)
- **Middleware:** `authenticateJWT`, `authorizeRole(['admin_referring'])` (Lines 44-45)
- **Controller:** `createSubscription` (Line 46)

### Get Credit Balance
**GET** `/api/billing/credit-balance`
- **Access:** Private (admin_referring only)
- **Middleware:** `authenticateJWT`, `authorizeRole(['admin_referring'])` (Lines 56-57)
- **Controller:** `getCreditBalance` (Line 58)

### Get Credit Usage History
**GET** `/api/billing/credit-usage`
- **Access:** Private (admin_referring only)
- **Middleware:** `authenticateJWT`, `authorizeRole(['admin_referring'])` (Lines 68-69)
- **Controller:** `getCreditUsageHistory` (Line 70)

---

## 9. File Upload Endpoints

**SOURCE:** `src/routes/uploads.routes.ts`

**Global Middleware:** `authenticateJWT` applied to all routes (Line 8)

### Get Presigned URL
**POST** `/api/uploads/presigned-url`
- **Access:** Private (physician, admin_referring, admin_radiology, radiologist, admin_staff)
- **Middleware:** `authorizeRole(['physician', 'admin_referring', 'admin_radiology', 'radiologist', 'admin_staff'])` (Line 13)
- **Controller:** `UploadsController.getPresignedUrl` (Line 14)

### Confirm Upload
**POST** `/api/uploads/confirm`
- **Access:** Private (physician, admin_referring, admin_radiology, radiologist, admin_staff)
- **Middleware:** `authorizeRole(['physician', 'admin_referring', 'admin_radiology', 'radiologist', 'admin_staff'])` (Line 20)
- **Controller:** `UploadsController.confirmUpload` (Line 21)

### Get Download URL
**GET** `/api/uploads/:documentId/download-url`
- **Access:** Private (authenticated users)
- **Controller:** `UploadsController.getDownloadUrl` (Line 27)

---

## 10. Radiology Workflow Endpoints

**SOURCE:** `src/routes/radiology-orders.routes.ts`

### Get Incoming Orders
**GET** `/api/radiology/orders`
- **Access:** Private (scheduler, admin_radiology)
- **Middleware:** `authenticateJWT`, `authorizeRole(['scheduler', 'admin_radiology'])` (Lines 14-15)
- **Controller:** `radiologyOrderController.getIncomingOrders` (Line 16)

### Get Order Details
**GET** `/api/radiology/orders/:orderId`
- **Access:** Private (scheduler, admin_radiology)
- **Middleware:** `authenticateJWT`, `authorizeRole(['scheduler', 'admin_radiology'])` (Lines 26-27)
- **Controller:** `radiologyOrderController.getOrderDetails` (Line 28)

### Export Order
**GET** `/api/radiology/orders/:orderId/export/:format`
- **Access:** Private (scheduler, admin_radiology)
- **Middleware:** `authenticateJWT`, `authorizeRole(['scheduler', 'admin_radiology'])` (Lines 38-39)
- **Controller:** `radiologyOrderController.exportOrder` (Line 40)

### Update Order Status
**POST** `/api/radiology/orders/:orderId/update-status`
- **Access:** Private (scheduler, admin_radiology)
- **Middleware:** `authenticateJWT`, `authorizeRole(['scheduler', 'admin_radiology'])` (Lines 50-51)
- **Controller:** `radiologyOrderController.updateOrderStatus` (Line 52)

### Request Information
**POST** `/api/radiology/orders/:orderId/request-info`
- **Access:** Private (scheduler, admin_radiology)
- **Middleware:** `authenticateJWT`, `authorizeRole(['scheduler', 'admin_radiology'])` (Lines 62-63)
- **Controller:** `radiologyOrderController.requestInformation` (Line 64)

---

## 11. Super Admin Endpoints

**SOURCE:** `src/routes/superadmin.routes.ts`

**Global Middleware:** `authenticateJWT`, `authorizeRole(['super_admin'])` applied to all routes (Lines 17-18)

### Organization Management

#### List All Organizations
**GET** `/api/superadmin/organizations`
- **Access:** Private (super_admin)
- **Controller:** `listAllOrganizationsController` (Line 21)

#### Get Organization by ID
**GET** `/api/superadmin/organizations/:orgId`
- **Access:** Private (super_admin)
- **Controller:** `getOrganizationByIdController` (Line 22)

#### Update Organization Status
**PUT** `/api/superadmin/organizations/:orgId/status`
- **Access:** Private (super_admin)
- **Controller:** `organizations.updateOrganizationStatusController` (Line 23)

#### Adjust Organization Credits
**POST** `/api/superadmin/organizations/:orgId/credits/adjust`
- **Access:** Private (super_admin)
- **Controller:** `organizations.adjustOrganizationCreditsController` (Line 24)

### User Management

#### List All Users
**GET** `/api/superadmin/users`
- **Access:** Private (super_admin)
- **Controller:** `listAllUsersController` (Line 27)

#### Get User by ID
**GET** `/api/superadmin/users/:userId`
- **Access:** Private (super_admin)
- **Controller:** `getUserByIdController` (Line 28)

#### Update User Status
**PUT** `/api/superadmin/users/:userId/status`
- **Access:** Private (super_admin)
- **Controller:** `users.updateUserStatusController` (Line 29)

### Prompt Template Management

#### Create Prompt Template
**POST** `/api/superadmin/prompts/templates`
- **Access:** Private (super_admin)
- **Controller:** `prompts.templates.createPromptTemplateController` (Line 32)

#### List Prompt Templates
**GET** `/api/superadmin/prompts/templates`
- **Access:** Private (super_admin)
- **Controller:** `prompts.templates.listPromptTemplatesController` (Line 33)

#### Get Prompt Template
**GET** `/api/superadmin/prompts/templates/:templateId`
- **Access:** Private (super_admin)
- **Controller:** `prompts.templates.getPromptTemplateController` (Line 34)

#### Update Prompt Template
**PUT** `/api/superadmin/prompts/templates/:templateId`
- **Access:** Private (super_admin)
- **Controller:** `prompts.templates.updatePromptTemplateController` (Line 35)

#### Delete Prompt Template
**DELETE** `/api/superadmin/prompts/templates/:templateId`
- **Access:** Private (super_admin)
- **Controller:** `prompts.templates.deletePromptTemplateController` (Line 36)

### Prompt Assignment Management

#### Create Prompt Assignment
**POST** `/api/superadmin/prompts/assignments`
- **Access:** Private (super_admin)
- **Controller:** `prompts.assignments.createPromptAssignmentController` (Line 39)

#### List Prompt Assignments
**GET** `/api/superadmin/prompts/assignments`
- **Access:** Private (super_admin)
- **Controller:** `prompts.assignments.listPromptAssignmentsController` (Line 40)

#### Get Prompt Assignment
**GET** `/api/superadmin/prompts/assignments/:assignmentId`
- **Access:** Private (super_admin)
- **Controller:** `prompts.assignments.getPromptAssignmentController` (Line 41)

#### Update Prompt Assignment
**PUT** `/api/superadmin/prompts/assignments/:assignmentId`
- **Access:** Private (super_admin)
- **Controller:** `prompts.assignments.updatePromptAssignmentController` (Line 42)

#### Delete Prompt Assignment
**DELETE** `/api/superadmin/prompts/assignments/:assignmentId`
- **Access:** Private (super_admin)
- **Controller:** `prompts.assignments.deletePromptAssignmentController` (Line 43)

### Log Viewing

#### List LLM Validation Logs
**GET** `/api/superadmin/logs/validation`
- **Access:** Private (super_admin)
- **Controller:** `logs.listLlmValidationLogsController` (Line 46)

#### List Enhanced LLM Validation Logs
**GET** `/api/superadmin/logs/validation/enhanced`
- **Access:** Private (super_admin)
- **Controller:** `logs.listLlmValidationLogsEnhancedController` (Line 47)

#### List Credit Usage Logs
**GET** `/api/superadmin/logs/credits`
- **Access:** Private (super_admin)
- **Controller:** `logs.listCreditUsageLogsController` (Line 48)

#### List Purgatory Events
**GET** `/api/superadmin/logs/purgatory`
- **Access:** Private (super_admin)
- **Controller:** `logs.listPurgatoryEventsController` (Line 49)

---

## 12. Webhook Endpoints

**SOURCE:** `src/routes/webhooks.routes.ts`

### Stripe Webhook
**POST** `/api/webhooks/stripe`
- **Access:** Public (Stripe signature verification)
- **Middleware:** `express.raw({ type: 'application/json' })` for raw body parsing (Line 12)
- **Controller:** `WebhookController.handleStripeWebhook` (Line 13)

---

## Summary

**Total Verified Endpoints:** 61 endpoints across 12 categories

**Verification Method:** Every endpoint was confirmed by examining the actual route files in `src/routes/`. Each endpoint listing includes:
- Exact HTTP method and path
- Source file and line number
- Middleware requirements
- Controller function
- Access control requirements

**Rate Limiting:** Applied to validation endpoints (60 requests per minute) as confirmed in `src/routes/orders.routes.ts` lines 12-16.

**Authentication:** Most endpoints require JWT authentication via `authenticateJWT` middleware, with role-based access control via `authorizeRole` middleware.

This documentation represents the complete, verified API surface of the RadOrderPad system as of June 9, 2025.
