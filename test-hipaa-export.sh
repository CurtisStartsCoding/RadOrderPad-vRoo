#!/bin/bash
echo "Testing HIPAA Compliance Export functionality..."

# Load environment variables from .env file if exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Set database connection variables from environment
export PGHOST=${DB_HOST}
export PGPORT=${DB_PORT}
export PGUSER=${DB_USER}
export PGPASSWORD=${DB_PASSWORD}
export PGDATABASE=radorder_phi

echo
echo "=== Step 1: Applying database schema changes ==="
echo "Running alter-orders-table-hipaa-compliance.sql..."
psql -f sql-scripts/alter-orders-table-hipaa-compliance.sql
if [ $? -ne 0 ]; then
  echo "ERROR: Failed to apply schema changes."
  exit 1
fi

echo
echo "=== Step 2: Inserting test data ==="
echo "Running insert-hipaa-test-data.sql..."
psql -f sql-scripts/insert-hipaa-test-data.sql
if [ $? -ne 0 ]; then
  echo "ERROR: Failed to insert test data."
  exit 1
fi

echo
echo "=== Step 3: Running export tests ==="
./test-radiology-export.sh

echo
echo "=== Step 4: Verifying HIPAA fields in exports ==="
echo "Checking JSON export..."
if grep -q "referring_physician_phone\|referring_organization_address\|radiology_organization_name\|patient_consent_obtained" test-results/order-export.json; then
  echo "SUCCESS: HIPAA compliance fields found in JSON export."
else
  echo "ERROR: HIPAA compliance fields not found in JSON export."
fi

echo "Checking CSV export..."
if grep -q "referring_physician_phone\|referring_organization_address\|radiology_organization_name\|patient_consent_obtained" test-results/order-export.csv; then
  echo "SUCCESS: HIPAA compliance fields found in CSV export."
else
  echo "ERROR: HIPAA compliance fields not found in CSV export."
fi

echo
echo "HIPAA Compliance Export testing completed."

# Make the script executable
chmod +x test-hipaa-export.sh