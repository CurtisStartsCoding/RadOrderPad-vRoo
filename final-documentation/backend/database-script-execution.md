# Database Script Execution Guide

## Overview
This guide documents how to create and execute JavaScript scripts that directly connect to the RadOrderPad databases for maintenance, debugging, or data fixes.

## Database Connection Details

### Main Database (Non-PHI)
```javascript
const { Client } = require('pg');

const client = new Client({
  host: 'radorderpad-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com',
  port: 5432,
  database: 'radorder_main',
  user: 'postgres',
  password: 'password',
  ssl: {
    rejectUnauthorized: false
  }
});
```

### PHI Database
```javascript
const phiClient = new Client({
  host: 'radorderpad-phi-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com',
  port: 5432,
  database: 'radorder_phi',
  user: 'postgres',
  password: 'password2',
  ssl: {
    rejectUnauthorized: false
  }
});
```

## Basic Script Template

```javascript
const { Client } = require('pg');

async function runDatabaseScript() {
  const client = new Client({
    host: 'radorderpad-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com',
    port: 5432,
    database: 'radorder_main',
    user: 'postgres',
    password: 'password',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected!\n');

    // Your database operations here
    const result = await client.query('SELECT COUNT(*) FROM organizations');
    console.log('Total organizations:', result.rows[0].count);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
    console.log('\nDatabase connection closed.');
  }
}

runDatabaseScript();
```

## Common Operations Examples

### 1. Query Data
```javascript
// Simple query
const result = await client.query('SELECT * FROM organizations WHERE type = $1', ['referring_practice']);
console.log(`Found ${result.rowCount} organizations`);

// Query with multiple parameters
const users = await client.query(
  'SELECT * FROM users WHERE organization_id = $1 AND role = $2',
  [orgId, 'physician']
);
```

### 2. Update Data
```javascript
// Update with feedback
const updateResult = await client.query(
  "UPDATE organizations SET type = $1, updated_at = NOW() WHERE type = $2",
  ['referring_practice', 'referring']
);
console.log(`Updated ${updateResult.rowCount} rows`);
```

### 3. Insert Data
```javascript
// Insert with RETURNING
const insertResult = await client.query(
  `INSERT INTO locations (organization_id, name, address_line1, city, state, zip_code) 
   VALUES ($1, $2, $3, $4, $5, $6) 
   RETURNING id, name`,
  [orgId, 'New Location', '123 Main St', 'City', 'ST', '12345']
);
console.log('Created location:', insertResult.rows[0]);
```

### 4. Transaction Example
```javascript
try {
  await client.query('BEGIN');
  
  // Multiple operations in transaction
  await client.query('UPDATE organizations SET credit_balance = credit_balance - 10 WHERE id = $1', [orgId]);
  await client.query('INSERT INTO credit_usage_logs (...) VALUES (...)', [...values]);
  
  await client.query('COMMIT');
  console.log('Transaction completed successfully');
} catch (err) {
  await client.query('ROLLBACK');
  console.error('Transaction failed, rolled back:', err.message);
}
```

## Full Working Example

Here's the complete script we used to fix organization types:

```javascript
const { Client } = require('pg');

async function fixOrganizationTypes() {
  const client = new Client({
    host: 'radorderpad-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com',
    port: 5432,
    database: 'radorder_main',
    user: 'postgres',
    password: 'password',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected!\n');

    // Show before state
    console.log('BEFORE:');
    const before = await client.query('SELECT type, COUNT(*) as count FROM organizations GROUP BY type ORDER BY type');
    before.rows.forEach(row => console.log(`  ${row.type}: ${row.count}`));

    // Update referring -> referring_practice
    console.log('\nUpdating referring -> referring_practice...');
    const ref = await client.query("UPDATE organizations SET type = 'referring_practice', updated_at = NOW() WHERE type = 'referring'");
    console.log(`  Updated ${ref.rowCount} rows`);

    // Update radiology -> radiology_group  
    console.log('\nUpdating radiology -> radiology_group...');
    const rad = await client.query("UPDATE organizations SET type = 'radiology_group', updated_at = NOW() WHERE type = 'radiology'");
    console.log(`  Updated ${rad.rowCount} rows`);

    // Show after state
    console.log('\nAFTER:');
    const after = await client.query('SELECT type, COUNT(*) as count FROM organizations GROUP BY type ORDER BY type');
    after.rows.forEach(row => console.log(`  ${row.type}: ${row.count}`));

    console.log('\n✅ Done!');

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

fixOrganizationTypes();
```

## Running Scripts

### Option 1: Direct Execution on Server
1. Create the script file
2. Transfer to server (drag and drop or scp)
3. Run with node: `node script-name.js`

### Option 2: Local Execution with SSH Tunnel
If you need to run from local machine, set up SSH tunnels first:
```bash
# Main DB tunnel
ssh -f -N -L 15432:radorderpad-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432 -i ~/radorderpad-key-pair.pem ubuntu@3.129.73.23

# Then update host in script to localhost and port to 15432
```

### Option 3: Using Environment Variables
Create a `.env` file:
```env
PG_HOST=radorderpad-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com
PG_PORT=5432
PG_DATABASE=radorder_main
PG_USER=postgres
PG_PASSWORD=password
```

Then in your script:
```javascript
require('dotenv').config();

const client = new Client({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  ssl: { rejectUnauthorized: false }
});
```

## Best Practices

1. **Always use try/catch/finally** to ensure connections are closed
2. **Use parameterized queries** to prevent SQL injection
3. **Show before/after states** when making changes
4. **Use transactions** for multi-step operations
5. **Add console logging** to track progress
6. **Test queries** with SELECT first before UPDATE/DELETE
7. **Keep scripts simple** and focused on one task

## Security Notes

- Never commit scripts with hardcoded passwords to git
- Delete temporary scripts after use
- Be careful with UPDATE/DELETE operations
- Always include WHERE clauses to avoid accidental full-table updates
- Consider using read-only queries first to verify your logic

## Common Tables Reference

### Main Database
- `organizations` - Organization profiles
- `users` - User accounts
- `locations` - Physical locations
- `user_locations` - User-location assignments
- `organization_relationships` - Connections between orgs
- `credit_usage_logs` - Credit transaction history
- `user_invites` - Pending invitations

### PHI Database
- `patients` - Patient demographics
- `orders` - Medical imaging orders
- `order_history` - Order audit trail
- `validation_attempts` - LLM validation logs
- `document_uploads` - Uploaded files