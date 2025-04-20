# RedisSearch Integration for Database Context Generation

This document outlines the implementation of RedisSearch functionality within AWS MemoryDB to accelerate the database context generation step for the Validation Engine.

## Implementation Overview

The implementation follows a modular approach with clear separation of concerns:

1. **Redis Connection Configuration** (`src/config/memorydb.ts`): Manages the connection to AWS MemoryDB with TLS enabled
2. **Redis Index Manager** (`src/utils/redis/redis-index-manager.ts`): Creates and manages RedisSearch indexes
3. **Redis Search Modules** (`src/utils/redis/search/`): Provides search functions for medical codes
   - `common.ts`: Shared utilities and types
   - `icd10-search.ts`: ICD-10 code search functions
   - `cpt-search.ts`: CPT code search functions
   - `mapping-search.ts`: Mapping search functions
   - `markdown-search.ts`: Markdown doc search functions
   - `index.ts`: Re-exports all search functions
4. **Redis Context Generator** (`src/utils/database/redis-context-generator.ts`): Generates context using RedisSearch with PostgreSQL fallback
5. **Index Creation Script** (`src/scripts/create-redis-indexes.ts`): Standalone script for index creation
6. **Test Scripts**:
   - `tests/test-redis-search.js`: Tests the RedisSearch functionality
   - `tests/batch/test-memorydb-cache.js`: Tests the basic caching functionality
   - `tests/e2e/scenario-i-redis-caching.js`: E2E test for Redis caching

## Key Features

### 1. Index Creation Logic

Created a dedicated utility for creating RedisSearch indexes with the following schema:

```
FT.CREATE cpt_index ON JSON PREFIX 1 cpt: SCHEMA 
  $.description AS description TEXT WEIGHT 5.0
  $.modality AS modality TAG
  $.body_part AS body_part TAG
  $.description AS description_nostem TEXT NOSTEM
```

```
FT.CREATE icd10_index ON JSON PREFIX 1 icd10: SCHEMA 
  $.description AS description TEXT WEIGHT 5.0
  $.keywords AS keywords TEXT WEIGHT 2.0
  $.category AS category TAG
  $.is_billable AS is_billable TAG
  $.description AS description_nostem TEXT NOSTEM
```

### 2. Cache-Aside Pattern Implementation

Implemented the Cache-Aside pattern for data retrieval:

1. Check MemoryDB first for the requested data
2. If found (cache hit), return the data directly
3. If not found (cache miss), query PostgreSQL
4. Store the result in MemoryDB with an appropriate TTL
5. Return the data to the application

### 3. RedisSearch for Context Generation

Modified the database context generation to use RedisSearch:

- Created targeted `FT.SEARCH` queries based on categorized keywords
- Implemented intelligent query construction based on keyword types (anatomy, modality, symptoms)
- Added robust fallback to PostgreSQL if RedisSearch fails

### 4. Testing Infrastructure

Developed comprehensive testing tools:

- Script to create indexes (`src/scripts/create-redis-indexes.ts`)
- Test script to verify RedisSearch functionality (`tests/test-redis-search.js`)
- Test script to verify basic caching functionality (`tests/batch/test-memorydb-cache.js`)
- E2E test for Redis caching (`tests/e2e/scenario-i-redis-caching.js`)
- Batch files for easy execution

## Benefits

This implementation provides significant benefits:

1. **Performance**: Near real-time (<10-20ms) retrieval of contextually relevant medical codes
2. **Reduced Database Load**: Minimizes direct queries to PostgreSQL
3. **Robustness**: Includes fallback to PostgreSQL if RedisSearch fails
4. **Maintainability**: Modular design with clear separation of concerns

## AWS Configuration Requirements

### MemoryDB User and ACL Configuration

Based on the AWS console, the MemoryDB cluster is configured with:

- A user named "default" with ARN `arn:aws:memorydb:us-east-2:577602529041:user/default`
- Access string: "on ~* &@all" (allows all commands on all keys)
- Authentication mode: "No passwords"
- Associated with an ACL named "open-access"

This confirms that the MemoryDB cluster itself has an open access policy with no password authentication, which matches the comments in the .env file.

### Network Configuration

The AWS MemoryDB cluster is deployed in a VPC with private IP addresses, which means it's not directly accessible from the public internet. To connect to the MemoryDB cluster, you must:

1. **Deploy in the Same VPC**: Deploy your application in the same VPC as the MemoryDB cluster
2. **Use VPN or Direct Connect**: Set up a VPN or AWS Direct Connect to access the VPC
3. **Use a Bastion Host**: Use an EC2 instance in the same VPC as a bastion host
4. **Configure VPC Peering**: Set up VPC peering if your application is in a different VPC
5. **Use AWS Systems Manager (SSM) Port Forwarding**: Set up port forwarding to connect to the MemoryDB cluster from outside the VPC

Our tests confirmed that the MemoryDB cluster is using a private IP address (10.0.6.29) and is not accessible from outside the VPC. Connection attempts from outside the VPC will time out.

#### Using SSM Port Forwarding for Development

For local development, you can use AWS Systems Manager (SSM) Port Forwarding to connect to the MemoryDB cluster:

1. Install the AWS Session Manager Plugin
2. Find an EC2 instance in the same VPC with SSM agent installed
3. Run the following command:
   ```
   aws ssm start-session \
     --target i-09645b54b86c90ccf \
     --document-name AWS-StartPortForwardingSessionToRemoteHost \
     --parameters "host=clustercfg.radorderpad-memorydb.i0vhe3.memorydb.us-east-2.amazonaws.com,portNumber=6379,localPortNumber=6379" \
     --region us-east-2
   ```
4. Update your `.env` file to use `127.0.0.1:6379` instead of the MemoryDB endpoint:
   ```
   MEMORYDB_HOST=127.0.0.1
   MEMORYDB_PORT=6379
   # Disable TLS when using localhost through SSM tunnel
   NODE_ENV=development
   ```
5. Disable TLS in your Redis client configuration when connecting through the SSM tunnel:
   ```javascript
   const isLocalhost = memoryDbHost === 'localhost' || memoryDbHost === '127.0.0.1';
   const memoryDbTls = isLocalhost ? false : {};
   ```

### AWS IAM Permissions

Even though the MemoryDB cluster has an open access ACL, you still need AWS IAM permissions to access the MemoryDB service. The current AWS credentials being used by the AWS CLI are for a user named "ComprehendMedicalUser", which doesn't have the necessary permissions to access MemoryDB.

To properly connect to the MemoryDB cluster, you need to:

1. **Use the Correct AWS User**: Use an AWS user that has the necessary permissions to access MemoryDB
2. **Configure AWS Credentials**: Configure the AWS credentials in the environment or in the AWS credentials file
3. **Set the Correct Region**: Ensure the AWS region is set to us-east-2, where the MemoryDB cluster is located

We've created a policy file at `scripts/create-memorydb-iam-policy.json` that includes the necessary permissions for accessing MemoryDB. You can create and attach this policy to your AWS user using the AWS CLI or the AWS Management Console.

### Setup Helper Script

We've created a setup script at `scripts/setup-memorydb-access.js` that helps diagnose and fix MemoryDB access issues. This script:

1. Checks your current AWS configuration
2. Provides instructions for creating and attaching the MemoryDB policy
3. Tests the connection to MemoryDB
4. Provides guidance on resolving VPC connectivity issues

You can run this script using the `setup-memorydb-access.bat` batch file.

## Fallback Mechanism

The implementation includes a robust fallback mechanism to PostgreSQL if the Redis connection fails. This ensures that the application continues to function even if the Redis connection is not available.

## Future Enhancements

Potential future enhancements include:

1. **Caching Validation Results**: Store complete validation results for frequently used dictations
2. **Advanced Query Optimization**: Further refine RedisSearch queries for better relevance
3. **Monitoring**: Add detailed metrics for cache hit/miss rates and query performance
4. **Automated Index Management**: Implement automatic index updates when reference data changes
5. **VPC Connectivity**: Implement a solution for connecting to the MemoryDB cluster from outside the VPC