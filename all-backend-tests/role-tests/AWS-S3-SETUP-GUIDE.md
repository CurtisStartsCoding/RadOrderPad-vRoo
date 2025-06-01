# AWS S3 Setup Guide for RadOrderPad File Upload Tests

This guide provides step-by-step instructions for setting up AWS S3 permissions to enable file upload functionality in the RadOrderPad test environment.

## Prerequisites
- AWS Account with appropriate permissions
- Access to IAM (Identity and Access Management)
- Access to S3 service

## Step 1: Create IAM User for Testing

### 1.1 Navigate to IAM Users
1. Log in to AWS Console
2. Search for "IAM" in the services search bar
3. Click on "IAM" to open the Identity and Access Management console
4. In the left sidebar, click on "Users"

**Screenshot needed**: IAM Dashboard showing the Users menu item

### 1.2 Create New User
1. Click the "Create user" button
2. Enter username: `radorderpad-test-user`
3. Select "Programmatic access" checkbox
4. Click "Next: Permissions"

**Screenshot needed**: Create user page with username and access type selected

## Step 2: Set User Permissions

### 2.1 Attach Policies
1. Select "Attach existing policies directly"
2. Search for "S3"
3. Check the box for "AmazonS3FullAccess" (for testing only; use more restrictive policy in production)
4. Click "Next: Tags"

**Screenshot needed**: Set permissions page showing AmazonS3FullAccess policy selected

### 2.2 Add Tags (Optional)
1. Add any relevant tags (e.g., Environment: Test, Purpose: RadOrderPad)
2. Click "Next: Review"

**Screenshot needed**: Tags page (optional)

### 2.3 Review and Create
1. Review the user details
2. Click "Create user"

**Screenshot needed**: Review page showing user configuration

### 2.4 Save Credentials
1. **IMPORTANT**: Save the Access key ID and Secret access key
2. Click "Download .csv" to save credentials
3. Store these securely - you won't be able to see the secret key again

**Screenshot needed**: Success page showing Access key ID (with Secret access key blurred/hidden)

## Step 3: Configure S3 Bucket Permissions

### 3.1 Navigate to S3
1. Search for "S3" in the services search bar
2. Click on "S3" to open the S3 console
3. Find your bucket (e.g., `radorderpad-uploads-prod-us-east-2`)

**Screenshot needed**: S3 buckets list showing the target bucket

### 3.2 Check Bucket Permissions
1. Click on your bucket name
2. Go to the "Permissions" tab
3. Check "Block public access" settings

**Screenshot needed**: Bucket permissions tab showing current settings

### 3.3 Configure CORS (if needed)
1. In the Permissions tab, scroll to "Cross-origin resource sharing (CORS)"
2. Click "Edit"
3. Add the following CORS configuration:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE",
            "HEAD"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [
            "ETag",
            "x-amz-server-side-encryption",
            "x-amz-request-id",
            "x-amz-id-2"
        ],
        "MaxAgeSeconds": 3000
    }
]
```

4. Click "Save changes"

**Screenshot needed**: CORS configuration editor with the above configuration

### 3.4 Bucket Policy (if needed)
1. In the Permissions tab, click on "Bucket policy"
2. If you need to add a policy for the IAM user, use:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowTestUserAccess",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:user/radorderpad-test-user"
            },
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::radorderpad-uploads-prod-us-east-2/*"
        }
    ]
}
```

**Screenshot needed**: Bucket policy editor (if applicable)

## Step 4: Create .env.test File

### 4.1 Create Environment File
In your project root (`all-backend-tests/`), create a `.env.test` file:

```env
# AWS Credentials
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-2

# S3 Configuration
S3_BUCKET_NAME=radorderpad-uploads-prod-us-east-2
S3_BUCKET_ARN=arn:aws:s3:::radorderpad-uploads-prod-us-east-2

# Other required variables
NODE_ENV=test
JWT_SECRET=your_jwt_secret_here
```

**Screenshot needed**: Text editor showing .env.test file (with sensitive values hidden)

## Step 5: Verify Setup

### 5.1 Test AWS Credentials
Run the S3 connectivity test:

```bash
cd all-backend-tests/diagnostic-tests/file-upload
run-s3-connectivity-test.bat
```

**Screenshot needed**: Terminal showing successful S3 connectivity test

### 5.2 Run Admin Staff Tests
Run the comprehensive Admin Staff tests:

```bash
cd all-backend-tests
admin-staff-role-comprehensive-tests.bat
```

**Screenshot needed**: Terminal showing successful file upload test

## Troubleshooting

### Common Issues:

1. **403 Forbidden Error**
   - Check IAM user permissions
   - Verify bucket policy allows the IAM user
   - Ensure CORS is properly configured

2. **Invalid Credentials**
   - Verify AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are correct
   - Check for extra spaces or line breaks in .env.test file

3. **Region Mismatch**
   - Ensure AWS_REGION matches your bucket's region (us-east-2)

4. **Bucket Not Found**
   - Verify S3_BUCKET_NAME is spelled correctly
   - Ensure the bucket exists in the specified region

## Security Best Practices

1. **Never commit .env.test file to version control**
   - Add `.env.test` to your `.gitignore` file

2. **Use least privilege principle**
   - In production, create a more restrictive IAM policy that only allows access to specific bucket paths

3. **Rotate credentials regularly**
   - Change access keys periodically

4. **Use IAM roles in production**
   - For EC2 instances, use IAM roles instead of access keys

## Production Considerations

For production environments:
1. Use IAM roles attached to EC2 instances instead of access keys
2. Implement more restrictive bucket policies
3. Enable S3 bucket versioning
4. Enable S3 server-side encryption
5. Set up CloudTrail for audit logging
6. Configure S3 lifecycle policies for cost optimization

## Summary of Required Screenshots

1. IAM Dashboard - Users menu
2. Create user page - Username and access type
3. Set permissions page - Policy selection
4. Tags page (optional)
5. Review user configuration
6. Success page with credentials (secret key hidden)
7. S3 buckets list
8. Bucket permissions tab
9. CORS configuration editor
10. Bucket policy editor (if used)
11. .env.test file in editor (sensitive data hidden)
12. Successful S3 connectivity test
13. Successful Admin Staff file upload test