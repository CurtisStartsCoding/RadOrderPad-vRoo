# Missing Endpoints Report

After comparing the API endpoints mentioned in the "cheater-document.md" with our current API documentation in the API_IMPLEMENTATION_GUIDE directory, I've identified several endpoints that are not yet documented. These endpoints are part of important workflows but are missing from our current documentation.

## Registration and User Management

1. **`POST /api/auth/register`**
   - Description: Organization and user self-registration
   - Used in: New Organization & User Onboarding workflow
   - Status: Not documented in our API guides

2. **`POST /api/organizations/mine/locations`**
   - Description: Add locations to the current organization
   - Used in: New Organization & User Onboarding workflow
   - Status: Not documented in our API guides

3. **`POST /api/users/invite`**
   - Description: Invite users to join the organization
   - Used in: New Organization & User Onboarding workflow
   - Status: Not documented in our API guides

4. **`POST /api/users/accept-invitation`**
   - Description: Accept a user invitation and set password
   - Used in: New Organization & User Onboarding workflow
   - Status: Not documented in our API guides

## File Upload Endpoints

5. **`POST /api/uploads/presigned-url`**
   - Description: Get a presigned URL for file upload to S3
   - Used in: Order signature upload workflow
   - Status: Not documented in our API guides

6. **`POST /api/uploads/confirm`**
   - Description: Confirm a file upload and create document record
   - Used in: Order signature upload workflow
   - Status: Not documented in our API guides

## Admin Order Management

7. **`GET /api/admin/orders/queue`**
   - Description: Get admin order queue
   - Used in: Admin Finalizes Order workflow
   - Status: Not documented in our API guides

8. **`POST /api/admin/orders/{orderId}/paste-summary`**
   - Description: Paste EMR summary for an order
   - Used in: Admin Finalizes Order workflow
   - Status: Not documented in our API guides

9. **`POST /api/admin/orders/{orderId}/paste-supplemental`**
   - Description: Paste supplemental information for an order
   - Used in: Admin Finalizes Order workflow
   - Status: Not documented in our API guides

10. **`PUT /api/admin/orders/{orderId}/patient-info`**
    - Description: Update patient information for an order
    - Used in: Admin Finalizes Order workflow
    - Status: Not documented in our API guides

11. **`PUT /api/admin/orders/{orderId}/insurance-info`**
    - Description: Update insurance information for an order
    - Used in: Admin Finalizes Order workflow
    - Status: Not documented in our API guides

## Connection Management

12. **`GET /api/connections/requests`**
    - Description: List connection requests
    - Used in: Connection Management workflow
    - Status: Not documented in our API guides

13. **`POST /api/connections/{relationshipId}/approve`**
    - Description: Approve a connection request
    - Used in: Connection Management workflow
    - Status: Not documented in our API guides

14. **`POST /api/connections/{relationshipId}/reject`**
    - Description: Reject a connection request
    - Used in: Connection Management workflow
    - Status: Not documented in our API guides

15. **`DELETE /api/connections/{relationshipId}`**
    - Description: Terminate a connection
    - Used in: Connection Management workflow
    - Status: Not documented in our API guides

## Workflow Impact

These missing endpoints are critical for several key workflows:

1. **Organization and User Onboarding**
   - Self-registration
   - Location management
   - User invitation and acceptance

2. **Document Upload Flow**
   - Signature uploads for orders
   - Supporting document uploads

3. **Admin Order Processing**
   - EMR summary integration
   - Patient and insurance information updates

4. **Connection Management**
   - Connection request approval/rejection
   - Connection termination

## Recommendation

To ensure comprehensive API documentation, these endpoints should be added to the appropriate files in the API_IMPLEMENTATION_GUIDE directory:

1. Add registration endpoints to `authentication.md`
2. Add location endpoints to `organization-management.md`
3. Add user invitation endpoints to `user-management.md`
4. Create a new `uploads-management.md` file for file upload endpoints
5. Add admin order endpoints to `order-management.md`
6. Add connection request endpoints to `connection-management.md`

This will provide frontend developers with complete documentation of all available API endpoints and how they fit into the application workflows.