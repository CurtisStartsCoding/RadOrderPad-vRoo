# Role-Based API Tests

This directory contains tests for different user roles in the RadOrderPad system. Each role has specific permissions and capabilities that are tested to ensure proper functionality.

## Available Role Tests

1. **Admin Staff (Referring Organization)** - `admin-staff-role-tests.js`
   - Tests functionality available to admin staff users
   - Includes order queue management, patient/insurance info updates, document uploads, and sending orders to radiology
   - See [Admin Staff Role Tests README](./admin-staff-role-README.md) for detailed documentation

## Running the Tests

Each role has its own batch file for running tests:

```
run-admin-staff-role-tests.bat
```

## Test Structure

Each role test file follows a similar structure:

1. **Authentication** - Tests login functionality for the role
2. **Role-Specific API Endpoints** - Tests endpoints accessible to the role
3. **Permission Boundaries** - Verifies that the role cannot access unauthorized endpoints

## Common Issues and Solutions

### Admin Staff Role

- **Listing Connected Radiology Organizations**: Admin staff users do not have direct API access to list connected radiology organizations. In a real implementation, this would be handled by the frontend UI, which would use the admin_referring token to fetch the connections and display them to the admin staff user.

- **Sending Orders to Radiology**: Use the fixed implementation endpoint: `POST /api/admin/orders/{orderId}/send-to-radiology-fixed` which properly handles database connections for PHI and Main databases.

- **Profile Management**: Use PUT (not PATCH) for updating user profiles, and only include allowed fields: firstName, lastName, phoneNumber, specialty, npi.

### Document Upload Tests

Document upload tests require AWS S3 configuration. Set the following environment variables:

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION (us-east-2)
- S3_BUCKET_NAME (one of the following):
  * radorderpad-uploads-prod-us-east-2
  * radmiddle-radorderpad-uploads-us-east-2
  * elasticbeanstalk-us-east-2-3776023290411

## Adding New Role Tests

When adding tests for a new role:

1. Create a new test file (e.g., `new-role-tests.js`)
2. Create a batch file to run the tests (e.g., `run-new-role-tests.bat`)
3. Create a README file with detailed documentation (e.g., `new-role-README.md`)
4. Update this README to include the new role tests