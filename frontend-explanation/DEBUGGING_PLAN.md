# API Debugging Plan

Based on our testing and the user's feedback, here's a detailed plan to debug and fix the issues we found with the API endpoints.

## 1. Database Schema Issue (paste-summary) - HIGH PRIORITY


### Issue - THIS IS NOT AN ISSUE - IGNORE IN ANY FUTURE PLANS. AUTHORIZATION IS DONE AFTER THE ORDER IS RECEIVED

The `POST /api/admin/orders/{orderId}/paste-summary` endpoint fails with the error: "column authorization_number does not exist"

### Debugging Steps
1. **Examine the patient_insurance table schema in the production PHI database**
   - Check if it has an `authorization_number` column
   - SQL query: `DESCRIBE patient_insurance;` or `SELECT column_name FROM information_schema.columns WHERE table_name = 'patient_insurance';`

2. **Compare with database migration files**
   - Look for migration files related to the `patient_insurance` table
   - Check if there's a migration that adds the `authorization_number` column
   - If the migration exists but hasn't been run in production, run it

3. **Check the updateInsuranceFromEmr service function**
   - Look for code that tries to insert/update the `authorization_number` column
   - If the column shouldn't exist according to the latest design, update the function to stop trying to use it

### Fix Options
- **If column should exist**: Run the missing migration to add the column
- **If column shouldn't exist**: Update the service function to remove references to the column

## 2. Connection Management Endpoints

### Issue
All connection management endpoints return 500 internal server errors

### Debugging Steps
1. **Focus on GET /api/connections/requests first**
   - Check Vercel logs for detailed stack traces related to this endpoint
   - Debug the `listIncomingRequests` service function
   - Common issues could be:
     - Database query errors
     - Problems joining tables
     - Unexpected data formats
     - Missing columns or tables

2. **Once the read operation works, debug the write operations**
   - Check logs for POST and DELETE endpoints
   - Debug the service functions:
     - `approveConnection`
     - `rejectConnection`
     - `terminateConnection`
   - Pay attention to:
     - Database transactions
     - Notification calls
     - Status validation

3. **Ensure valid relationship IDs are used**
   - For approve/reject: Use IDs with "pending" status
   - For terminate: Use IDs with "active" status

### Fix Options
- Fix database queries
- Update service functions to handle edge cases
- Add better error handling

## 3. Admin Order Queue Endpoint

### Issue
The `GET /api/admin/orders/queue` endpoint returns a 500 internal server error

### Debugging Steps
1. **Check if the controller/service function exists**
   - Look for a function like `getQueue` or `listAdminOrders` in the admin order controller
   - If it doesn't exist, implement it

2. **Debug the database query and logic**
   - Check Vercel logs for detailed error messages
   - Look for issues with:
     - SQL syntax
     - Missing joins
     - Invalid filters

### Fix Options
- Implement the missing function if needed
- Fix the database query
- Add error handling

## 4. AWS Configuration for Uploads

### Issue
The `POST /api/uploads/presigned-url` endpoint returns: "AWS credentials or S3 bucket name not configured"

### Debugging Steps
1. **Check the environment variables**
   - Verify that AWS credentials are set in the environment:
     - `AWS_ACCESS_KEY_ID`
     - `AWS_SECRET_ACCESS_KEY`
     - `S3_BUCKET_NAME`

2. **Check the S3 configuration code**
   - Look for how the S3 client is initialized
   - Ensure it's using the environment variables correctly

### Fix Options
- Set the missing environment variables
- Update the S3 configuration code if needed

## 5. Documentation Updates

### Tasks
1. **Update the API documentation based on successful tests**
   - Confirm the request/response format for creating locations
   - Document the working order IDs for admin endpoints

2. **Document prerequisites for each endpoint**
   - Clearly state the order status requirements
   - List all required fields

3. **Document known limitations**
   - AWS configuration needed for uploads
   - Database schema mismatch for paste-summary
   - Connection endpoints implementation issues

## Implementation Timeline

1. **Day 1**: Fix the database schema issue (highest priority)
2. **Day 2**: Configure AWS credentials for uploads
3. **Day 3**: Debug connection management endpoints
4. **Day 4**: Debug admin order queue endpoint
5. **Day 5**: Update documentation with all findings

## Monitoring and Validation

After each fix:
1. Run the test scripts again to verify the fix
2. Update the documentation with the new findings
3. Document any remaining issues or limitations