#!/bin/bash
echo "Testing Radiology Order Export functionality..."

# Load environment variables from .env file if exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Set variables
ORDER_ID=5
AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoic2NoZWR1bGVyIiwiZW1haWwiOiJ0ZXN0LnNjaGVkdWxlckBleGFtcGxlLmNvbSIsImlhdCI6MTcxNzk2MzYwMCwiZXhwIjoxNzE4MDUwMDAwfQ.XYZ_PLACEHOLDER_SIGNATURE"

# Use API_BASE_URL from environment or fallback to default
if [ -z "$API_BASE_URL" ]; then
  echo "WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api"
  API_BASE_URL="http://localhost:3000/api"
fi

# Remove trailing /api if present (since we'll add it in the URL)
BASE_URL="$API_BASE_URL"
if [[ "$BASE_URL" == */api ]]; then
  BASE_URL="${BASE_URL%/api}"
fi

echo "Using API URL: $BASE_URL"

# Create test-results directory if it doesn't exist
mkdir -p test-results

echo
echo "=== Testing JSON Export ==="
curl -s -o test-results/order-export.json -w "Status: %{http_code}\nContent-Type: %{content_type}\n" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  "$BASE_URL/api/radiology/orders/$ORDER_ID/export/json"

echo
echo "=== Testing CSV Export ==="
curl -s -o test-results/order-export.csv -w "Status: %{http_code}\nContent-Type: %{content_type}" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  "$BASE_URL/api/radiology/orders/$ORDER_ID/export/csv"

echo "=== Testing PDF Export (Stub) ==="
curl -s -o test-results/order-export.pdf -w "Status: %{http_code}\nContent-Type: %{content_type}" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  "$BASE_URL/api/radiology/orders/$ORDER_ID/export/pdf"

echo "=== Testing Invalid Format ==="
curl -s -w "%{response_body}Status: %{http_code}\nResponse: " \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  "$BASE_URL/api/radiology/orders/$ORDER_ID/export/invalid"

echo
echo "Test completed. Check test-results directory for exported files."

# Verify HIPAA compliance fields in the CSV export
if grep -q "referring_physician_phone\|referring_organization_address\|radiology_organization_name\|patient_consent_obtained" test-results/order-export.csv; then
  echo "HIPAA compliance fields verified in CSV export."
else
  echo "WARNING: HIPAA compliance fields not found in CSV export."
fi

# Verify HIPAA compliance fields in the JSON export
if grep -q "referring_physician_phone\|referring_organization_address\|radiology_organization_name\|patient_consent_obtained" test-results/order-export.json; then
  echo "HIPAA compliance fields verified in JSON export."
else
  echo "WARNING: HIPAA compliance fields not found in JSON export."
fi

# Make the script executable
chmod +x test-radiology-export.sh