# Endpoint Access Matrix

This matrix shows which user roles can access which endpoints in the RadOrderPad API.

## User Roles
- **physician**: Physicians in referring organizations
- **admin_staff**: Administrative staff in referring organizations
- **admin_referring**: Administrators of referring organizations
- **scheduler**: Schedulers in radiology organizations
- **admin_radiology**: Administrators of radiology organizations
- **radiologist**: Radiologists who read and report on orders
- **super_admin**: System administrators
- **trial**: Limited trial users

## Access Matrix

| Endpoint | physician | admin_staff | admin_referring | scheduler | admin_radiology | radiologist | super_admin | trial |
|----------|-----------|-------------|----------------|-----------|----------------|-------------|-------------|-------|
| **Authentication** |
| POST /api/auth/login | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| POST /api/auth/trial/login | - | - | - | - | - | - | - | ✓ |
| POST /api/auth/trial/register | - | - | - | - | - | - | - | ✓ |
| POST /api/auth/update-password | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| **User Profile** |
| GET /api/users/me | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| PUT /api/users/me | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| **Organization Management** |
| POST /api/auth/register | Public endpoint (creates organization + admin user) |
| GET /api/organizations/mine | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| PUT /api/organizations/mine | - | - | ✓ | - | ✓ | - | ✓ | - |
| GET /api/organizations | - | - | ✓ | - | ✓ | - | ✓ | - |
| **User Management** |
| GET /api/users | - | - | ✓ | - | ✓ | - | ✓ | - |
| GET /api/users/:userId | - | - | ✓ | - | ✓ | - | ✓ | - |
| PUT /api/users/:userId | - | - | ✓ | - | ✓ | - | ✓ | - |
| DELETE /api/users/:userId | - | - | ✓ | - | ✓ | - | ✓ | - |
| POST /api/user-invites/invite | - | - | ✓ | - | ✓ | - | - | - |
| **Location Management** |
| GET /api/locations | - | ✓ | ✓ | ✓ | ✓ | - | - | - |
| POST /api/locations | - | - | ✓ | - | ✓ | - | - | - |
| GET /api/locations/:locationId | - | ✓ | ✓ | ✓ | ✓ | - | - | - |
| PUT /api/locations/:locationId | - | - | ✓ | - | ✓ | - | - | - |
| DELETE /api/locations/:locationId | - | - | ✓ | - | ✓ | - | - | - |
| **User-Location Assignment** |
| GET /api/users/:userId/locations | - | - | ✓ | - | ✓ | - | - | - |
| POST /api/users/:userId/locations/:locationId | - | - | ✓ | - | ✓ | - | - | - |
| DELETE /api/users/:userId/locations/:locationId | - | - | ✓ | - | ✓ | - | - | - |
| **Connection Management** |
| GET /api/connections | - | - | ✓ | - | ✓ | - | - | - |
| POST /api/connections | - | - | ✓ | - | ✓ | - | - | - |
| GET /api/connections/requests | - | - | ✓ | - | ✓ | - | - | - |
| POST /api/connections/:id/approve | - | - | ✓ | - | ✓ | - | - | - |
| POST /api/connections/:id/reject | - | - | ✓ | - | ✓ | - | - | - |
| DELETE /api/connections/:id | - | - | ✓ | - | ✓ | - | - | - |
| **Billing & Credits** |
| GET /api/billing | - | - | ✓ | - | ✓ | - | - | - |
| GET /api/billing/credit-balance | - | - | ✓ | - | - | - | - | - |
| GET /api/billing/credit-usage | - | - | ✓ | - | - | - | - | - |
| POST /api/billing/create-checkout-session | - | - | ✓ | - | - | - | - | - |
| **Admin Statistics & Export** |
| GET /api/admin/statistics/orders | - | - | ✓ | - | ✓ | - | - | - |
| POST /api/admin/orders/export | - | - | ✓ | - | ✓ | - | - | - |
| **Physician Workflow** |
| POST /api/patients/search | ✓ | - | - | - | - | - | - | ✓ |
| POST /api/orders/validate | ✓ | - | - | - | - | - | - | ✓ |
| POST /api/orders | ✓ | - | - | - | - | - | - | - |
| PUT /api/orders/:orderId/finalize | ✓ | - | - | - | - | - | - | - |
| **Order Management** |
| GET /api/orders | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| GET /api/orders/:orderId | ✓¹ | ✓² | ✓² | ✓³ | ✓³ | ✓⁴ | ✓ | - |
| **Admin Staff Workflow** |
| GET /api/admin/orders/queue | - | ✓ | ✓ | - | - | - | - | - |
| PUT /api/admin/orders/:orderId/patient-info | - | ✓ | ✓ | - | - | - | - | - |
| PUT /api/admin/orders/:orderId/insurance-info | - | ✓ | ✓ | - | - | - | - | - |
| POST /api/admin/orders/:orderId/paste-emr-summary | - | ✓ | ✓ | - | - | - | - | - |
| POST /api/admin/orders/:orderId/paste-supplemental | - | ✓ | ✓ | - | - | - | - | - |
| POST /api/admin/orders/:orderId/send-to-radiology | - | ✓ | ✓ | - | - | - | - | - |
| **Scheduler Workflow** |
| GET /api/radiology/orders/incoming-queue | - | - | - | ✓ | ✓ | - | - | - |
| GET /api/radiology/orders/:orderId | - | - | - | ✓ | ✓ | ✓ | - | - |
| POST /api/radiology/orders/:orderId/request-information | - | - | - | ✓ | ✓ | - | - | - |
| PUT /api/radiology/orders/:orderId/status | - | - | - | ✓ | ✓ | - | - | - |
| GET /api/radiology/orders/:orderId/export | - | - | - | ✓ | ✓ | - | - | - |
| **File Upload** |
| POST /api/uploads/presigned-url | - | ✓ | ✓ | ✓ | ✓ | - | - | - |
| POST /api/uploads/confirm | - | ✓ | ✓ | ✓ | ✓ | - | - | - |
| **Super Admin** |
| GET /api/superadmin/organizations | - | - | - | - | - | - | ✓ | - |
| GET /api/superadmin/organizations/:orgId | - | - | - | - | - | - | ✓ | - |
| PUT /api/superadmin/organizations/:orgId/status | - | - | - | - | - | - | ✓ | - |
| POST /api/superadmin/organizations/:orgId/credits/adjust | - | - | - | - | - | - | ✓ | - |
| GET /api/superadmin/users | - | - | - | - | - | - | ✓ | - |
| GET /api/superadmin/users/:userId | - | - | - | - | - | - | ✓ | - |
| PUT /api/superadmin/users/:userId/status | - | - | - | - | - | - | ✓ | - |
| POST /api/superadmin/prompts/templates | - | - | - | - | - | - | ✓ | - |
| GET /api/superadmin/prompts/templates | - | - | - | - | - | - | ✓ | - |
| GET /api/superadmin/prompts/templates/:templateId | - | - | - | - | - | - | ✓ | - |
| PUT /api/superadmin/prompts/templates/:templateId | - | - | - | - | - | - | ✓ | - |
| DELETE /api/superadmin/prompts/templates/:templateId | - | - | - | - | - | - | ✓ | - |
| POST /api/superadmin/prompts/assignments | - | - | - | - | - | - | ✓ | - |
| GET /api/superadmin/prompts/assignments | - | - | - | - | - | - | ✓ | - |
| GET /api/superadmin/prompts/assignments/:assignmentId | - | - | - | - | - | - | ✓ | - |
| PUT /api/superadmin/prompts/assignments/:assignmentId | - | - | - | - | - | - | ✓ | - |
| DELETE /api/superadmin/prompts/assignments/:assignmentId | - | - | - | - | - | - | ✓ | - |
| GET /api/superadmin/logs/validation | - | - | - | - | - | - | ✓ | - |
| GET /api/superadmin/logs/validation/enhanced | - | - | - | - | - | - | ✓ | - |
| GET /api/superadmin/logs/credits | - | - | - | - | - | - | ✓ | - |
| GET /api/superadmin/logs/purgatory | - | - | - | - | - | - | ✓ | - |
| **Stripe Webhooks** |
| POST /api/webhooks/stripe | Public endpoint (verified by Stripe signature) |

## Notes

¹ Physicians can only access their own orders  
² Admin staff and admin_referring can access all orders in their organization  
³ Schedulers and admin_radiology can access orders sent to their organization  
⁴ Radiologists can only access orders assigned to them  

## Quick Reference by Role

### Physician
- Patient search and order validation
- Create and finalize orders
- View own orders
- Update own profile

### Admin Staff
- Process order queue
- Update patient and insurance info
- Upload documents
- Send orders to radiology
- Access locations

### Admin Referring
- All admin staff capabilities
- Manage users and locations
- Manage connections
- View billing and purchase credits
- Update organization profile

### Scheduler
- View incoming order queue
- Request additional information
- Update order status
- Export order data
- Access locations

### Admin Radiology
- All scheduler capabilities (except request info)
- Manage users and locations
- Manage connections
- View billing (no purchasing)
- Update organization profile

### Radiologist
- View assigned orders only
- Update own profile

### Super Admin
- System-wide organization management
- System-wide user management
- Prompt template management
- View all system logs
- Adjust organization credits

### Trial User
- Limited physician capabilities
- Patient search and validation only
- Cannot create persistent orders