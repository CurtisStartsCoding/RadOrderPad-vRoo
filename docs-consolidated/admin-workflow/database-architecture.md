# Database Architecture for Admin Finalization

This document provides detailed information about the database architecture for the Admin Finalization workflow, focusing on the dual-database design, transaction management, and data flow.

## Dual-Database Architecture

The RadOrderPad system uses a dual-database architecture for HIPAA compliance:

1. **PHI Database (`radorder_phi`)**: Contains Protected Health Information (PHI)
   - Patient demographics
   - Order details
   - Clinical information
   - Medical records

2. **Main Database (`radorder_main`)**: Contains non-PHI data
   - Organizations
   - Users
   - Credit balances
   - Billing information

This separation is critical for HIPAA compliance, as it allows for different security measures and access controls for PHI and non-PHI data.

## Database Schema

### PHI Database Tables

#### 1. `orders`
- Stores order information and status
- Key fields:
  - `id`: Primary key
  - `patient_id`: Foreign key to `patients` table
  - `organization_id`: ID of the referring organization
  - `status`: Order status (e.g., 'pending_admin', 'pending_radiology')
  - `modality_type`: Type of imaging (e.g., 'MRI', 'CT')
  - `cpt_code`: CPT code for the procedure
  - `icd10_codes`: Array of ICD-10 codes
  - `clinical_indication`: Clinical indication text
  - `created_at`: Timestamp of creation
  - `updated_at`: Timestamp of last update

#### 2. `patients`
- Stores patient demographic information
- Key fields:
  - `id`: Primary key
  - `first_name`: Patient's first name
  - `last_name`: Patient's last name
  - `date_of_birth`: Patient's date of birth
  - `gender`: Patient's gender
  - `address_line1`: Address line 1
  - `address_line2`: Address line 2
  - `city`: City
  - `state`: State
  - `zip_code`: ZIP code
  - `phone`: Phone number
  - `email`: Email address
  - `mrn`: Medical Record Number
  - `created_at`: Timestamp of creation
  - `updated_at`: Timestamp of last update

#### 3. `patient_insurance`
- Stores insurance information
- Key fields:
  - `id`: Primary key
  - `patient_id`: Foreign key to `patients` table
  - `insurer_name`: Name of the insurance company
  - `policy_number`: Insurance policy number
  - `group_number`: Insurance group number
  - `policy_holder_name`: Name of the policy holder
  - `policy_holder_relationship`: Relationship to the patient
  - `policy_holder_date_of_birth`: Policy holder's date of birth
  - `created_at`: Timestamp of creation
  - `updated_at`: Timestamp of last update

#### 4. `patient_clinical_records`
- Stores raw EMR text and supplemental documentation
- Key fields:
  - `id`: Primary key
  - `patient_id`: Foreign key to `patients` table
  - `order_id`: Foreign key to `orders` table
  - `record_type`: Type of record (e.g., 'emr_summary_paste', 'supplemental_docs_paste')
  - `content`: Raw text content
  - `parsed_data`: JSONB field for structured data extracted from the content
  - `created_by`: ID of the user who created the record
  - `created_at`: Timestamp of creation
  - `updated_at`: Timestamp of last update

#### 5. `order_history`
- Logs order status changes and events
- Key fields:
  - `id`: Primary key
  - `order_id`: Foreign key to `orders` table
  - `event_type`: Type of event (e.g., 'sent_to_radiology')
  - `details`: Additional details about the event
  - `created_by`: ID of the user who triggered the event
  - `created_at`: Timestamp of creation

### Main Database Tables

#### 1. `organizations`
- Stores organization information and credit balance
- Key fields:
  - `id`: Primary key
  - `name`: Organization name
  - `type`: Organization type (e.g., 'referring', 'radiology')
  - `credit_balance`: Current credit balance
  - `created_at`: Timestamp of creation
  - `updated_at`: Timestamp of last update

#### 2. `credit_usage_logs`
- Logs credit usage
- Key fields:
  - `id`: Primary key
  - `organization_id`: Foreign key to `organizations` table
  - `order_id`: ID of the order (stored in PHI database)
  - `action_type`: Type of action (e.g., 'order_submitted')
  - `credits_used`: Number of credits used
  - `created_by`: ID of the user who triggered the action
  - `created_at`: Timestamp of creation

## Transaction Management

The Admin Finalization workflow, particularly the "Send to Radiology" operation, requires careful transaction management across both databases to ensure data consistency.

### Send to Radiology Transaction Flow

1. **Begin Transactions**:
   - Begin a transaction in the PHI database
   - Begin a transaction in the Main database

2. **Verify Order**:
   - Check if the order exists and belongs to the user's organization (PHI database)
   - Check if the order is in 'pending_admin' status (PHI database)
   - Check if patient information is complete (PHI database)

3. **Check Credits**:
   - Check if the organization has sufficient credits (Main database)

4. **Update Order**:
   - Update order status to 'pending_radiology' (PHI database)
   - Log the event in `order_history` (PHI database)

5. **Consume Credits**:
   - Decrement the organization's credit balance (Main database)
   - Log credit usage in `credit_usage_logs` (Main database)

6. **Commit or Rollback**:
   - If all operations succeed, commit both transactions
   - If any operation fails, rollback both transactions

This approach ensures that either all operations succeed or none of them do, maintaining data consistency across both databases.

## Database Connection Management

The system uses separate connection pools for each database:

```typescript
// PHI Database connection pool
const phiPool = new Pool({
  host: process.env.PHI_DB_HOST,
  port: parseInt(process.env.PHI_DB_PORT || '5432'),
  database: process.env.PHI_DB_NAME,
  user: process.env.PHI_DB_USER,
  password: process.env.PHI_DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production'
});

// Main Database connection pool
const mainPool = new Pool({
  host: process.env.MAIN_DB_HOST,
  port: parseInt(process.env.MAIN_DB_PORT || '5432'),
  database: process.env.MAIN_DB_NAME,
  user: process.env.MAIN_DB_USER,
  password: process.env.MAIN_DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production'
});
```

These connection pools are accessed through helper functions:

```typescript
// Get PHI database client
export function getPhiDbClient() {
  return phiPool;
}

// Get Main database client
export function getMainDbClient() {
  return mainPool;
}
```

## The Database Connection Issue

The original "Send to Radiology" endpoint had an issue with database connections. It was using a single database connection (PHI) to try to access tables in both databases. This resulted in errors like:

```
relation "organizations" does not exist
```

The issue was introduced during the Credit Consumption Refactoring (April 14, 2025), when the credit consumption logic was moved from the validation stage to the order submission stage.

### Root Cause

The original implementation was using the PHI database connection for all operations, including:
- Checking the organization's credit balance (which is in the Main database)
- Decrementing the credit balance (which is in the Main database)
- Logging credit usage (which is in the Main database)

### Solution

The fixed implementation (`sendToRadiologyFixed`) properly uses both database connections:
- PHI database connection for PHI operations (order status, order history)
- Main database connection for non-PHI operations (credit balance, credit usage logs)

This approach maintains the separation between PHI and non-PHI data while ensuring data consistency through proper transaction management.

## Data Flow Diagram

```
┌─────────────────────┐     ┌─────────────────────┐
│                     │     │                     │
│   PHI Database      │     │   Main Database     │
│   (radorder_phi)    │     │   (radorder_main)   │
│                     │     │                     │
└─────────┬───────────┘     └─────────┬───────────┘
          │                           │
          │                           │
┌─────────▼───────────┐     ┌─────────▼───────────┐
│                     │     │                     │
│   PHI Operations    │     │   Main Operations   │
│                     │     │                     │
│ - Check order       │     │ - Check credits     │
│ - Verify patient    │     │ - Decrement credits │
│ - Update status     │     │ - Log credit usage  │
│ - Log order history │     │                     │
│                     │     │                     │
└─────────┬───────────┘     └─────────┬───────────┘
          │                           │
          │                           │
          │        ┌──────────────────┘
          │        │
┌─────────▼────────▼──────┐
│                         │
│  Transaction Manager    │
│                         │
│ - Begin transactions    │
│ - Commit/rollback both  │
│                         │
└─────────────────────────┘
```

## Security Considerations

1. **Connection Isolation**: Each database has its own connection pool with different credentials
2. **Access Control**: Different roles have different levels of access to each database
3. **Encryption**: All connections use SSL in production
4. **Parameterized Queries**: All database queries use parameterized statements to prevent SQL injection
5. **Audit Logging**: All credit usage and order status changes are logged

## Best Practices

1. **Always Use the Correct Connection**: Use the PHI database connection for PHI operations and the Main database connection for non-PHI operations
2. **Manage Transactions Carefully**: Begin and commit/rollback transactions in both databases when necessary
3. **Handle Errors Properly**: Rollback transactions in both databases if any operation fails
4. **Log All Operations**: Log all credit usage and order status changes for audit purposes
5. **Validate Data**: Validate all data before writing to the database

## Related Documentation

- [Workflow Guide](./workflow-guide.md): Comprehensive end-to-end workflow guide
- [API Integration](./api-integration.md): API details and integration guide
- [Implementation Details](./implementation-details.md): Backend implementation details
- [Testing Reference](./testing-reference.md): References to test files and testing guidelines