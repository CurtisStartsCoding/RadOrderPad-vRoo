# File Upload Diagnostic Tests

This directory contains diagnostic tests for the file upload functionality in the RadOrderPad application. These tests are designed to help identify and troubleshoot issues with AWS S3 integration.

## Background

The file upload functionality in RadOrderPad uses AWS S3 for storing uploaded files. The process involves:

1. Getting a presigned URL from the API
2. Uploading the file directly to S3 using the presigned URL
3. Confirming the upload with the API

If any of these steps fail, the file upload will not work correctly.

## Issue Identification

We've identified two main issues with the file upload functionality:

1. **Missing S3 Bucket Configuration**: The `S3_BUCKET_NAME` environment variable is missing from the `.env.production` file. This is a critical configuration that the application needs to know which S3 bucket to use for uploads. The application code in `src/config/config.ts` specifically looks for this environment variable.

2. **Insufficient AWS Permissions**: The AWS credentials in the `.env.test` file are for a user named "radorderpad-ses-user" which only has permissions for Amazon SES (Simple Email Service), not for S3 operations. This causes permission errors when trying to directly access S3.

The error messages from our S3 upload tests clearly indicate permission issues:
- "User: arn:aws:iam::377602329041:user/radorderpad-ses-user is not authorized to perform: s3:ListBucket"
- "User: arn:aws:iam::377602329041:user/radorderpad-ses-user is not authorized to perform: s3:PutObject"

## Diagnostic Tests

This directory contains three diagnostic tests:

1. **test-api-upload.js**: Tests file upload using the RadOrderPad API
2. **test-s3-direct.js**: Tests direct S3 access using the AWS SDK
3. **test-presigned-url.js**: Tests presigned URL generation and usage

### Running the Tests

To run all the diagnostic tests, use the `run-diagnostics.bat` script:

```
cd all-backend-tests\diagnostic-tests\file-upload
run-diagnostics.bat
```

You can also run individual tests:

```
node test-api-upload.js
node test-s3-direct.js
node test-presigned-url.js
```

## Interpreting the Results

The diagnostic tests will provide detailed output about each step of the file upload process. Here's how to interpret the results:

1. If the API-based tests succeed but the direct S3 tests fail, the API is using different AWS credentials than those in `.env.test`.
2. If all tests fail, there may be an issue with the S3 bucket configuration or permissions.
3. Check the test outputs for specific error messages and recommendations.

## Required AWS Permissions

For the file upload functionality to work correctly, the AWS user needs the following permissions:

- `s3:ListBucket` on the bucket
- `s3:PutObject` on objects in the bucket
- `s3:GetObject` on objects in the bucket

## Solution Options

1. **Add S3 Bucket Configuration**: Add the `S3_BUCKET_NAME` environment variable to the `.env.production` file. This is the most critical fix needed for the application to work properly.

2. **Update AWS Credentials**: Obtain AWS credentials with the necessary S3 permissions and update the `.env.test` file. The current "radorderpad-ses-user" only has SES permissions, not S3 permissions.

3. **Use API-Only Approach**: Modify the tests to only use the API for file uploads, avoiding direct S3 access. This approach works around the permission issues by leveraging the API's credentials.

4. **Create IAM Policy**: Create an IAM policy that grants the necessary S3 permissions to the existing user. This would allow the current user to perform S3 operations without changing credentials.

## Example IAM Policy

Here's an example IAM policy that grants the necessary S3 permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::radorderpad-uploads-prod-us-east-2"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::radorderpad-uploads-prod-us-east-2/*"
    }
  ]
}
```

## Next Steps

Based on the diagnostic test results, here are the recommended next steps:

1. **Add S3_BUCKET_NAME to .env.production**: This is the most critical fix. Add the following line to the `.env.production` file:
   ```
   S3_BUCKET_NAME=radorderpad-uploads-prod-us-east-2
   ```

2. **Update AWS credentials**: If you need direct S3 access for testing, obtain AWS credentials with the necessary S3 permissions and update the `.env.test` file. The current "radorderpad-ses-user" only has SES permissions.

3. **Modify the admin-staff-role-tests.js**: Update the file upload test to use the API approach rather than direct S3 access, which will work around the permission issues.

4. **Create an API-based test**: Create a new test that focuses on the API-based file upload workflow, which is more likely to succeed since it uses the API's credentials.

5. **Run the diagnostic tests again**: After making these changes, run the diagnostic tests again to verify that the file upload functionality is working correctly.