# Admin Staff Workflow Test Results

## Test Date: June 11, 2025

## Summary of Working Endpoints

### ✅ Fully Working Endpoints

1. **Authentication**
   - `POST /api/auth/login` - Works correctly
   - Returns JWT token for subsequent requests

2. **Order Queue Management**
   - `GET /api/admin/orders/queue` - Works correctly
   - Supports pagination parameters
   - Returns orders with status `pending_admin`

3. **Order Details**
   - `GET /api/orders/{orderId}` - Works correctly
   - Returns full order details

4. **Patient Information Update**
   - `PUT /api/admin/orders/{orderId}/patient-info` - Works correctly
   - Updates patient demographics successfully
   - Uses snake_case field names (e.g., `first_name`, not `firstName`)

5. **Insurance Information Update**
   - `PUT /api/admin/orders/{orderId}/insurance-info` - Works correctly
   - Updates insurance details successfully

6. **Supplemental Information**
   - `POST /api/admin/orders/{orderId}/paste-supplemental` - Works correctly
   - Accepts pasted text for supplemental information

7. **Send to Radiology**
   - `POST /api/admin/orders/{orderId}/send-to-radiology-fixed` - Works correctly
   - **Important**: Uses `-fixed` suffix, not the documented endpoint
   - **Requires**: `radiologyOrganizationId` in request body
   - Returns success but `remainingCredits` field is undefined

8. **Profile Management**
   - `GET /api/users/me` - Works correctly
   - `PUT /api/users/me` - Works correctly

### ⚠️ Partially Working Endpoints

1. **File Upload Process**
   - `POST /api/uploads/presigned-url` - Works correctly
     - Generates valid presigned URLs
     - Requires: `fileName`, `contentType`, `fileType`, `orderId`
   - **S3 Upload** - Failed in Node.js environment
     - 403 Forbidden with SignatureDoesNotMatch error
     - Likely works in browser environment with proper CORS headers
   - `POST /api/uploads/confirm` - Not fully tested
     - Requires successful S3 upload first

### ❌ Limitations Discovered

1. **Cannot List Connected Radiology Organizations**
   - Admin staff don't have access to connection endpoints
   - Frontend must provide radiology organization selection
   - Test uses hardcoded `radiologyOrganizationId: 2`

2. **Response Field Issues**
   - Many response fields return `undefined` even when request succeeds
   - Examples: `user.success`, profile fields, `remainingCredits`

## Documentation Updates Needed

1. **Send to Radiology Endpoint**
   - Correct endpoint: `/send-to-radiology-fixed` (not `/send-to-radiology`)
   - Requires `radiologyOrganizationId` in body (not documented)

2. **Field Naming Convention**
   - Patient info uses snake_case (e.g., `first_name`, `date_of_birth`)
   - Documentation showed camelCase

3. **File Upload**
   - Uses `contentType` not `context` in presigned URL request
   - S3 upload requires exact header matching for signatures

## Recommended Frontend Implementation

1. **Order Processing Flow**:
   ```
   1. Fetch queue → GET /api/admin/orders/queue
   2. Update patient → PUT /api/admin/orders/{id}/patient-info
   3. Update insurance → PUT /api/admin/orders/{id}/insurance-info
   4. Add supplemental → POST /api/admin/orders/{id}/paste-supplemental
   5. Upload files (if needed) → File upload workflow
   6. Select radiology org → Frontend UI selection
   7. Send to radiology → POST /api/admin/orders/{id}/send-to-radiology-fixed
   ```

2. **File Upload from Browser**:
   - Request presigned URL with proper fields
   - Use browser's fetch/XHR for S3 upload (avoids CORS issues)
   - Confirm upload after successful S3 PUT

3. **Radiology Organization Selection**:
   - Frontend must maintain list of connected radiology orgs
   - Could be provided during login or from admin_referring role