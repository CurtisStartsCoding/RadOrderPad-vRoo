# AWS PostgreSQL Database Migration Tool

This tool helps migrate your local PostgreSQL databases to AWS RDS instances. It handles both schema and data migration for the main database and PHI database.

## Prerequisites

- Node.js (v14 or higher)
- npm
- Access to both source and target PostgreSQL databases
- Proper network connectivity to AWS RDS instances

## Required npm Packages

The migration scripts will automatically install these if needed:
- `pg` - PostgreSQL client for Node.js
- `commander` - Command-line argument parsing
- `winston` - Logging
- `dotenv` - Environment variable loading

## Migration Process

The migration tool performs the following steps:

1. **Schema Migration**:
   - Creates tables with the same structure as the source database
   - Creates primary keys, foreign keys, and indexes
   - Preserves column constraints (NOT NULL, etc.)

2. **Data Migration**:
   - Transfers data in batches to minimize memory usage
   - Maintains data integrity with transactions
   - Updates sequence values to match the source database

3. **Validation**:
   - Logs all operations for review
   - Reports success or failure for each step

## Testing Database Connections

Before running the full migration, it's recommended to test your database connections:

### Windows

1. Open a command prompt
2. Navigate to the project directory
3. Run the test connection script:
   ```
   db-migrations\test-connection.bat
   ```
4. Enter the database connection URL when prompted
5. Review the connection test results

### macOS/Linux

1. Open a terminal
2. Navigate to the project directory
3. Make the script executable (first time only):
   ```
   chmod +x db-migrations/test-connection.sh
   ```
4. Run the test connection script:
   ```
   ./db-migrations/test-connection.sh
   ```
5. Enter the database connection URL when prompted
6. Review the connection test results

The test connection tool will:
- Verify connectivity to the database
- Check database permissions
- Display basic database information
- Test table creation/deletion permissions
- List existing tables (if any)

## Running the Migration

You can run the migration using either manual connection details or environment variables from the `.env` file.

### Using Environment Variables (Recommended)

The `.env` file has been updated with a production database section that includes connection details for the AWS RDS instances. This makes it easy to migrate your data without having to manually enter connection details each time.

#### Windows

1. Open a command prompt
2. Navigate to the project directory
3. Run the migration script:
   ```
   db-migrations\migrate-to-aws.bat
   ```
4. Select option 2 to use connection details from the `.env` file
5. Choose the migration type (full, schema-only, or data-only)
6. Monitor the progress in the console and check the log file

#### macOS/Linux

1. Open a terminal
2. Navigate to the project directory
3. Make the script executable (first time only):
   ```
   chmod +x db-migrations/migrate-to-aws.sh
   ```
4. Run the migration script:
   ```
   ./db-migrations/migrate-to-aws.sh
   ```
5. Select option 2 to use connection details from the `.env` file
6. Choose the migration type (full, schema-only, or data-only)
7. Monitor the progress in the console and check the log file

### Using Manual Connection Details

If you prefer to enter connection details manually, you can do so:

#### Windows

1. Open a command prompt
2. Navigate to the project directory
3. Run the migration script:
   ```
   db-migrations\migrate-to-aws.bat
   ```
4. Select option 1 to enter database connection details manually
5. Enter the source and target database connection URLs when prompted
6. Choose the migration type (full, schema-only, or data-only)
7. Monitor the progress in the console and check the log file

#### macOS/Linux

1. Open a terminal
2. Navigate to the project directory
3. Make the script executable (first time only):
   ```
   chmod +x db-migrations/migrate-to-aws.sh
   ```
4. Run the migration script:
   ```
   ./db-migrations/migrate-to-aws.sh
   ```
5. Select option 1 to enter database connection details manually
6. Enter the source and target database connection URLs when prompted
7. Choose the migration type (full, schema-only, or data-only)
8. Monitor the progress in the console and check the log file

## Connection String Format

The migration tool requires PostgreSQL connection strings in the following format:
```
postgresql://username:password@hostname:port/database_name
```

Example:
```
postgresql://postgres:mypassword@localhost:5432/radorder_main
```

For AWS RDS instances, you'll need to use the endpoint provided in the AWS console:
```
postgresql://postgres:mypassword@myinstance.abcdefghijkl.us-east-1.rds.amazonaws.com:5432/radorder_main
```

## AWS RDS Configuration

The production database configuration in the `.env` file includes the following AWS RDS details:

### Main Database
- Host: radorder-main-db.czi6ewyqxzy.us-east-2.rds.amazonaws.com
- Port: 5432
- Availability Zone: us-east-2b
- Instance Class: db.t4g.medium

### PHI Database
- Host: radorder-phi-db.czi6ewyqxzy.us-east-2.rds.amazonaws.com
- Port: 5432
- Availability Zone: us-east-2a
- Instance Class: db.t4g.medium

### Network Configuration
- VPC Security Group: radorderpad-ids-sg (sg-0a5e5114b12da9dfea)
- Subnet Group: default-vpc-00fd1f85f71717328
- Network Type: IPv4

## Security Considerations

- The migration scripts do not store database credentials
- Consider using environment variables or AWS Secrets Manager for production environments
- Ensure your AWS RDS security groups allow connections from your IP address
- Use SSL connections for production migrations

## Troubleshooting

If you encounter issues during migration:

1. Check the log file at `db-migrations/migration.log`
2. Verify network connectivity to both source and target databases
3. Ensure the database user has sufficient privileges
4. For large databases, consider migrating tables individually

## Advanced Usage

For more control over the migration process, you can run the Node.js script directly:

```
node db-migrations/aws-postgres-migration.js [options]
```

Options:
- `--source-main=<url>`: Source main database connection URL
- `--source-phi=<url>`: Source PHI database connection URL
- `--target-main=<url>`: Target AWS main database connection URL
- `--target-phi=<url>`: Target AWS PHI database connection URL
- `--schema-only`: Migrate only the database schema (no data)
- `--data-only`: Migrate only the data (assumes schema exists)
- `--use-env`: Use environment variables for connection details
- `--help`: Show help information