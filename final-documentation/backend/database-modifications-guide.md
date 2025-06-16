# Database Modifications Guide

## Overview
This guide documents how to make database schema changes in the RadOrderPad system, using the `has_insurance` column addition as a reference example.

## Key Learnings from has_insurance Implementation

### What Took Too Long
1. Multiple incorrect database connection attempts
2. Confusion about environment file locations (`.env` vs `.env.production`)
3. SSL certificate configuration issues with AWS RDS
4. Incorrect file paths and module imports

### The Correct Pattern

When creating a database modification script for the RadOrderPad server:

1. **Location**: Scripts must run from the project root directory
2. **Environment**: Use `.env` (not `.env.production`) on the server
3. **Connection**: Use `PHI_DATABASE_URL` or `MAIN_DATABASE_URL` environment variables
4. **SSL Config**: AWS RDS requires specific SSL settings

### Working Script Template

```javascript
const { Pool } = require('pg');
require('dotenv').config();

// Get database URL
const dbUrl = process.env.PHI_DATABASE_URL; // or MAIN_DATABASE_URL

// CRITICAL: SSL configuration for AWS RDS
const pool = new Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
    ca: false,
    cert: false,
    key: false
  }
});

async function runMigration() {
  const client = await pool.connect();
  try {
    // Your SQL here
    await client.query('YOUR SQL STATEMENT');
  } finally {
    client.release();
  }
}

runMigration()
  .then(() => {
    console.log('✅ Success');
    pool.end();
  })
  .catch(err => {
    console.error('❌ Failed:', err);
    pool.end();
    process.exit(1);
  });
```

## has_insurance Column Implementation

### Purpose
Track whether a patient has insurance to properly handle uninsured/cash-pay patients without database constraint violations.

### The Problem
- `patient_insurance` table has NOT NULL constraints on `insurer_name` and `policy_number`
- Frontend sends empty insurance data for uninsured patients
- Backend tries to insert NULLs into NOT NULL fields = 500 errors

### The Solution
Add `has_insurance` boolean to explicitly track insurance status:
- `true` = Patient has insurance (process insurance data)
- `false` = Patient is uninsured/cash-pay (skip insurance processing)

### Implementation Steps

1. **Database Change**
   ```sql
   ALTER TABLE orders ADD COLUMN has_insurance boolean NOT NULL DEFAULT false;
   ```

2. **Backend Update** (src/controllers/admin-order/update-order.controller.ts)
   - Accept `hasInsurance` field in request
   - Update `has_insurance` column when provided
   - Only process insurance data when `hasInsurance === true`
   - Delete existing insurance records when `hasInsurance === false`

3. **Frontend Update**
   - Add "Does patient have insurance?" Yes/No selection
   - Send `hasInsurance: true/false` with order updates

### Migration Script Location
`/add-has-insurance-working.js` - The final working version

### Running the Migration
```bash
# On the server, from project root
cd /home/ubuntu/code/RadOrderPad-vRoo
node add-has-insurance-working.js
```

## Common Pitfalls to Avoid

1. **Don't use complex imports**: The server environment differs from local
   - ❌ `require('../src/config/db')`
   - ✅ `require('pg')` with manual configuration

2. **Environment files on server**:
   - ❌ Looking for `.env.production`
   - ✅ Just `.env` in the root directory

3. **Database connections**:
   - ❌ Individual connection parameters (host, port, etc.)
   - ✅ Use the full `DATABASE_URL` environment variables

4. **SSL Issues**:
   - ❌ `ssl: { rejectUnauthorized: false }`
   - ✅ Full SSL config object (see template above)

## For Future Database Changes

1. Copy the working template above
2. Run from the project root directory
3. Test the connection before making changes
4. Always check if the change already exists
5. Include rollback logic if needed
6. Document the change in this file

## Quick Reference Commands

```bash
# SSH to server
ssh ubuntu@ip-10-0-101-169

# Navigate to project
cd ~/code/RadOrderPad-vRoo

# Run migration
node your-migration-script.js

# Restart app after backend changes
pm2 restart all
```