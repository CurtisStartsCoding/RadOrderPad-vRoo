# Database SSH Tunnel Setup & Query Guide

## Overview
RadOrderPad uses two PostgreSQL databases hosted on AWS RDS in private subnets. To access them locally, you need SSH tunnels through the EC2 bastion host.

## Database Architecture
- **Main Database** (`radorder_main`): Non-PHI data (users, organizations, billing, etc.)
- **PHI Database** (`radorder_phi`): Protected health information (patients, orders, clinical data)

## SSH Tunnel Setup

### Prerequisites
- SSH key file: `temp/radorderpad-key-pair.pem`
- Bastion host: `ubuntu@3.129.73.23`
- WSL or Linux environment (for proper SSH key permissions)

### 1. Copy SSH Key to WSL (if using Windows)
```bash
cp /mnt/c/Dropbox/Apps/ROP\ Roo\ Backend\ Finalization/temp/radorderpad-key-pair.pem ~/radorderpad-key-pair.pem
chmod 400 ~/radorderpad-key-pair.pem
```

### 2. Create SSH Tunnels
```bash
# Main Database Tunnel (port 15432)
ssh -f -N -L 15432:radorderpad-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432 -i ~/radorderpad-key-pair.pem ubuntu@3.129.73.23

# PHI Database Tunnel (port 15433)
ssh -f -N -L 15433:radorderpad-phi-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432 -i ~/radorderpad-key-pair.pem ubuntu@3.129.73.23
```

### 3. Verify Tunnels Are Running
```bash
# Check listening ports
ss -tln | grep -E "1543[23]"

# Check SSH processes
ps aux | grep ssh | grep -E "15432|15433"
```

### 4. Use the Start Script
```bash
# Automated tunnel startup
./scripts/start-db-tunnels.sh
```

## Database Connection Details

### Connection Strings (through tunnels)
```
# Main Database
postgresql://postgres:password@localhost:15432/radorder_main

# PHI Database  
postgresql://postgres:password2@localhost:15433/radorder_phi
```

### Direct Connection from EC2
When SSHed into the EC2 instance, you can connect directly:
```
# Main Database
postgresql://postgres:password@radorderpad-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main?sslmode=require

# PHI Database
postgresql://postgres:password2@radorderpad-phi-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_phi?sslmode=require
```

## Query Examples

### Using psql
```bash
# Connect to Main DB
psql "postgresql://postgres:password@localhost:15432/radorder_main?sslmode=require"

# Connect to PHI DB
psql "postgresql://postgres:password2@localhost:15433/radorder_phi?sslmode=require"

# Run a query
psql "postgresql://postgres:password@localhost:15432/radorder_main?sslmode=require" -c "SELECT COUNT(*) FROM users;"
```

### Using Node.js
```javascript
const { Client } = require('pg');

// Main Database
const mainClient = new Client({
  connectionString: 'postgresql://postgres:password@localhost:15432/radorder_main',
  ssl: { rejectUnauthorized: false }
});

// PHI Database
const phiClient = new Client({
  connectionString: 'postgresql://postgres:password2@localhost:15433/radorder_phi',
  ssl: { rejectUnauthorized: false }
});

// Example query
async function queryExample() {
  try {
    await mainClient.connect();
    const result = await mainClient.query('SELECT * FROM users LIMIT 5');
    console.log(result.rows);
    await mainClient.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}
```

## Common Queries

### Main Database Tables
- `users` - System users
- `organizations` - Referring and radiology organizations
- `organization_locations` - Physical locations
- `trial_users` - Trial account users
- `connection_requests` - Organization connection requests
- `credit_usage_logs` - Billing/credit tracking

### PHI Database Tables
- `orders` - Medical imaging orders
- `patients` - Patient demographics
- `order_history` - Order audit trail
- `validation_attempts` - LLM validation logs
- `document_uploads` - Uploaded files
- `patient_insurance` - Insurance information

### Sample Queries

```sql
-- Get recent orders with patient info (PHI DB)
SELECT 
  o.id, o.order_number, o.status, o.created_at,
  p.first_name, p.last_name, p.date_of_birth
FROM orders o
LEFT JOIN patients p ON o.patient_id = p.id
ORDER BY o.created_at DESC
LIMIT 10;

-- Check organization credit balances (Main DB)
SELECT 
  name, organization_type,
  basic_credit_balance, advanced_credit_balance
FROM organizations
WHERE organization_type = 'radiology_group';

-- Get trial user activity (Main DB)
SELECT 
  email, specialty, validation_count, max_validations,
  created_at, last_validation_at
FROM trial_users
ORDER BY created_at DESC
LIMIT 10;

-- Order status distribution (PHI DB)
SELECT status, COUNT(*) as count
FROM orders
GROUP BY status
ORDER BY count DESC;
```

## Troubleshooting

### SSH Tunnel Issues
```bash
# Kill existing tunnels
pkill -f "ssh.*15432"
pkill -f "ssh.*15433"

# Check if ports are in use
lsof -i :15432
lsof -i :15433

# Restart tunnels
./scripts/start-db-tunnels.sh
```

### Connection Errors
- **"Connection refused"**: Tunnel not running, restart it
- **"SSL error"**: Use `ssl: { rejectUnauthorized: false }` in Node.js
- **"Password authentication failed"**: Check passwords in .env.production
- **"Timeout"**: Check if bastion host is accessible

### Windows/WSL Issues
- Use PowerShell for SSH if WSL has permission issues
- Or copy SSH key to WSL filesystem and chmod 400
- Ensure WSL can access the tunneled ports

## Security Notes
- Never commit passwords to git
- SSH tunnels are temporary - restart after reboot
- Use read-only queries when possible
- Be careful with PHI data - follow HIPAA guidelines
- Tunnels are only accessible from localhost

## Automated Setup
Add to `.claude/settings.local.json` for auto-start:
```json
{
  "startup": {
    "commands": [
      "./scripts/start-db-tunnels.sh"
    ]
  }
}
```