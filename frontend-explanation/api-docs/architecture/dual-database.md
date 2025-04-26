# Dual Database Architecture

## Overview

RadOrderPad employs a dual database architecture to ensure proper separation of Protected Health Information (PHI) from non-PHI data. This architecture is a critical component of the system's HIPAA compliance strategy and provides several security and operational benefits.

## Database Structure

The system uses two separate databases:

### 1. PHI Database (`radorder_phi`)

The PHI database contains all Protected Health Information, including:

- Patient demographic information
- Clinical indications and dictations
- Order details
- Validation attempts and results
- Document uploads containing PHI
- Insurance information
- Order history and status changes

### 2. Main Database (`radorder_main`)

The Main database contains all non-PHI data, including:

- Organizations and their profiles
- Users and their roles
- Organization relationships (connections)
- Credit balances and billing information
- System configuration
- LLM validation logs (without PHI)
- Prompt templates and assignments

## Database Connections

The API server maintains separate connection pools for each database:

```javascript
// Example connection setup
const phiPool = new Pool({
  connectionString: process.env.PHI_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const mainPool = new Pool({
  connectionString: process.env.MAIN_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Helper functions for database queries
const queryPhiDb = async (text, params) => {
  const client = await phiPool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
};

const queryMainDb = async (text, params) => {
  const client = await mainPool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
};
```

## Cross-Database Operations

Many operations in RadOrderPad require interaction with both databases. For example, when sending an order to radiology:

1. The order details are updated in the PHI database
2. The organization's credit balance is decremented in the Main database
3. Credit usage is logged in the Main database

These operations must be carefully managed to ensure data consistency across both databases.

### Transaction Management

For operations that affect both databases, the system uses a two-phase approach:

1. Begin a transaction in each database
2. Perform the necessary operations
3. If all operations succeed, commit both transactions
4. If any operation fails, roll back both transactions

```javascript
// Example of cross-database transaction
const sendToRadiology = async (orderId, userId, organizationId) => {
  // Get clients for both databases
  const phiClient = await phiPool.connect();
  const mainClient = await mainPool.connect();
  
  try {
    // Begin transactions
    await phiClient.query('BEGIN');
    await mainClient.query('BEGIN');
    
    // Update order in PHI database
    await phiClient.query(
      'UPDATE orders SET status = $1, sent_to_radiology_at = NOW(), sent_by_user_id = $2 WHERE id = $3',
      ['sent_to_radiology', userId, orderId]
    );
    
    // Log order history in PHI database
    await phiClient.query(
      'INSERT INTO order_history (order_id, action, performed_by_user_id) VALUES ($1, $2, $3)',
      [orderId, 'sent_to_radiology', userId]
    );
    
    // Check credit balance in Main database
    const creditResult = await mainClient.query(
      'SELECT credit_balance FROM organizations WHERE id = $1 FOR UPDATE',
      [organizationId]
    );
    
    const creditBalance = creditResult.rows[0].credit_balance;
    if (creditBalance < 1) {
      throw new Error('Insufficient credits');
    }
    
    // Decrement credit balance in Main database
    await mainClient.query(
      'UPDATE organizations SET credit_balance = credit_balance - 1 WHERE id = $1',
      [organizationId]
    );
    
    // Log credit usage in Main database
    await mainClient.query(
      'INSERT INTO credit_usage_logs (organization_id, user_id, action_type, credits_used) VALUES ($1, $2, $3, $4)',
      [organizationId, userId, 'send_to_radiology', 1]
    );
    
    // Commit transactions
    await phiClient.query('COMMIT');
    await mainClient.query('COMMIT');
    
    return { success: true };
  } catch (error) {
    // Roll back transactions on error
    await phiClient.query('ROLLBACK');
    await mainClient.query('ROLLBACK');
    throw error;
  } finally {
    // Release clients
    phiClient.release();
    mainClient.release();
  }
};
```

## Foreign Key Relationships

Since the databases are separate, traditional foreign key constraints cannot be used for cross-database relationships. Instead, the system maintains logical relationships through application code and ensures data integrity through careful transaction management.

For example, an order in the PHI database is associated with an organization in the Main database through the `organization_id` field, but this is not enforced at the database level.

## Data Access Patterns

The dual database architecture influences how data is accessed and processed:

1. **User Authentication**: Uses only the Main database to verify credentials and roles
2. **Order Creation**: Creates records in the PHI database and references the user and organization from the Main database
3. **Order Validation**: Reads from and writes to the PHI database for order data, while logging validation attempts in the Main database
4. **Admin Finalization**: Updates PHI data in the PHI database and consumes credits in the Main database
5. **Reporting**: Joins data from both databases at the application level when necessary

## Security Benefits

The dual database architecture provides several security benefits:

1. **Data Segregation**: PHI is physically separated from non-PHI data
2. **Access Control**: Different access controls can be applied to each database
3. **Breach Containment**: A breach of one database does not automatically compromise all data
4. **Audit Trail**: Actions affecting PHI can be logged separately from other system activities

## Implementation Considerations

When implementing features that interact with both databases, consider the following:

1. **Connection Management**: Ensure proper connection handling and resource cleanup
2. **Transaction Coordination**: Carefully manage transactions across both databases
3. **Error Handling**: Implement robust error handling and rollback procedures
4. **Performance**: Be aware of the performance implications of cross-database operations
5. **Testing**: Test cross-database operations thoroughly to ensure data consistency

## Conclusion

The dual database architecture is a fundamental aspect of RadOrderPad's design that enhances security, compliance, and data management. Understanding this architecture is essential for implementing features that interact with both PHI and non-PHI data.