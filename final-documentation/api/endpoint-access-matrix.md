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
| POST /api/auth/update-password | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| **User Profile** |
| GET /api/users/me | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| PUT /api/users/me | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| **Organization** |
| GET /api/organizations/mine | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| PUT /api/organizations/mine | - | - | ✓ | - | ✓ | - | ✓ | - |
| GET /api/organizations/search | - | - | ✓ | - | ✓ | - | ✓ | - |
| **Physician Workflow** |
| POST /api/patients/search | ✓ | - | - | - | - | - | - | ✓ |
| POST /api/orders/validate | ✓ | - | - | - | - | - | - | ✓ |
| POST /api/orders | ✓ | - | - | - | - | - | - | - |
| **Order Management** |
| GET /api/orders | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| GET /api/orders/:orderId | ✓¹ | ✓² | ✓² | ✓³ | ✓³ | ✓⁴ | ✓ | - |
| **Admin Staff Workflow** |
| GET /api/admin/orders/queue | - | ✓ | ✓ | - | - | - | - | - |
| PUT /api/admin/orders/:orderId/patient-info | - | ✓ | ✓ | - | - | - | - | - |
| PUT /api/admin/orders/:orderId/insurance-info | - | ✓ | ✓ | - | - | - | - | - |
| POST /api/admin/orders/:orderId/paste-supplemental | - | ✓ | ✓ | - | - | - | - | - |
| POST /api/admin/orders/:orderId/send-to-radiology | - | ✓ | ✓ | - | - | - | - | - |
| **User Management** |
| GET /api/users | - | - | ✓ | - | ✓ | - | ✓ | - |
| GET /api/users/:userId | - | - | ✓ | - | ✓ | - | ✓ | - |
| PUT /api/users/:userId | - | - | ✓ | - | ✓ | - | ✓ | - |
| DELETE /api/users/:userId | - | - | ✓ | - | ✓ | - | ✓ | - |
| POST /api/user-invites/invite | - | - | ✓ | - | ✓ | - | - | - |
| **Location Management** |
| GET /api/organizations/mine/locations | - | ✓ | ✓ | ✓ | ✓ | - | - | - |
| POST /api/organizations/mine/locations | - | - | ✓ | - | ✓ | - | - | - |
| GET /api/organizations/mine/locations/:id | - | ✓ | ✓ | ✓ | ✓ | - | - | - |
| PUT /api/organizations/mine/locations/:id | - | - | ✓ | - | ✓ | - | - | - |
| DELETE /api/organizations/mine/locations/:id | - | - | ✓ | - | ✓ | - | - | - |
| **User Location Assignment** |
| GET /api/user-locations/:userId/locations | - | - | ✓ | - | ✓ | - | - | - |
| POST /api/user-locations/:userId/locations/:locationId | - | - | ✓ | - | ✓ | - | - | - |
| DELETE /api/user-locations/:userId/locations/:locationId | - | - | ✓ | - | ✓ | - | - | - |
| **Connection Management** |
| GET /api/connections | - | - | ✓ | - | ✓ | - | - | - |
| POST /api/connections | - | - | ✓ | - | ✓ | - | - | - |
| DELETE /api/connections/:relationshipId | - | - | ✓ | - | ✓ | - | - | - |
| GET /api/connections/:relationshipId/requests | - | - | ✓ | - | ✓ | - | - | - |
| POST /api/connections/:relationshipId/approve | - | - | - | - | ✓ | - | - | - |
| POST /api/connections/:relationshipId/reject | - | - | - | - | ✓ | - | - | - |
| **Billing & Credits** |
| GET /api/billing | - | - | ✓ | - | - | - | - | - |
| GET /api/billing/credit-balance | - | ✓ | ✓ | - | - | - | - | - |
| GET /api/billing/credit-usage | - | - | ✓ | - | - | - | - | - |
| POST /api/billing/create-checkout-session | - | - | ✓ | - | - | - | - | - |
| POST /api/billing/subscriptions | - | - | ✓ | - | - | - | - | - |
| **File Management** |
| POST /api/uploads/presigned-url | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |
| POST /api/uploads/confirm | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |
| GET /api/uploads/:documentId/download-url | ✓⁵ | ✓⁵ | ✓⁵ | ✓⁵ | ✓⁵ | ✓⁵ | ✓ | - |
| **Radiology Workflow** |
| POST /api/radiology/orders/:orderId/info-request | - | - | - | ✓ | ✓ | - | - | - |
| POST /api/radiology/orders/:orderId/status | - | - | - | ✓ | ✓ | - | - | - |
| GET /api/radiology/orders/mine | - | - | - | - | - | ✓ | - | - |
| POST /api/radiology/reports/:orderId | - | - | - | - | - | ✓ | - | - |
| **Super Admin** |
| GET /api/superadmin/prompts | - | - | - | - | - | - | ✓ | - |
| POST /api/superadmin/prompts | - | - | - | - | - | - | ✓ | - |
| GET /api/superadmin/logs | - | - | - | - | - | - | ✓ | - |
| GET /api/superadmin/organizations | - | - | - | - | - | - | ✓ | - |
| GET /api/superadmin/users | - | - | - | - | - | - | ✓ | - |

## Notes

- ✓ = Full access
- ✓¹ = Can only view orders they created
- ✓² = Can view organization's orders
- ✓³ = Can view orders sent to their organization
- ✓⁴ = Can view assigned orders
- ✓⁵ = Can only download documents from their organization
- - = No access

## Additional Access Rules

1. **Organization-Based Access**: Most endpoints filter data based on the user's organization
2. **Location-Based Access**: Users can only access data from locations they're assigned to
3. **Order Status Restrictions**: Different roles can only see orders in specific statuses
4. **Connection-Based Access**: Partner organizations can share certain data through connections
5. **Trial User Limitations**: Trial users have restricted access and usage limits