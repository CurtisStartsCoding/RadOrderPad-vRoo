#!/bin/bash
# Test script for Radiology Order Export functionality

echo "Testing Radiology Order Export functionality..."

# Set variables
BASE_URL="http://localhost:3000/api"
ORDER_ID=5
AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoic2NoZWR1bGVyIiwiZW1haWwiOiJ0ZXN0LnNjaGVkdWxlckBleGFtcGxlLmNvbSIsImlhdCI6MTc0NTE5NDQwNiwiZXhwIjoxNzQ1MjgwODA2fQ.1iboUbnhQiblGsbG9Yx_yNX4UE_bu0CS_oDKL2SKCMQ"

# Create test-results directory if it doesn't exist
mkdir -p test-results

echo
echo "=== Testing JSON Export ==="
curl -s -o test-results/order-export.json -w "Status: %{http_code}\nContent-Type: %{content_type}\n" \
  -X GET "${BASE_URL}/radiology/orders/${ORDER_ID}/export/json" \
  -H "Authorization: Bearer ${AUTH_TOKEN}"

echo
echo "=== Testing CSV Export ==="
curl -s -o test-results/order-export.csv -w "Status: %{http_code}\nContent-Type: %{content_type}\n" \
  -X GET "${BASE_URL}/radiology/orders/${ORDER_ID}/export/csv" \
  -H "Authorization: Bearer ${AUTH_TOKEN}"

echo
echo "=== Testing PDF Export (Stub) ==="
curl -s -o test-results/order-export.pdf -w "Status: %{http_code}\nContent-Type: %{content_type}\n" \
  -X GET "${BASE_URL}/radiology/orders/${ORDER_ID}/export/pdf" \
  -H "Authorization: Bearer ${AUTH_TOKEN}"

echo
echo "=== Testing Invalid Format ==="
curl -s -w "Status: %{http_code}\nResponse: %{response_body}\n" \
  -X GET "${BASE_URL}/radiology/orders/${ORDER_ID}/export/invalid" \
  -H "Authorization: Bearer ${AUTH_TOKEN}"

echo
echo "Test completed. Check test-results directory for exported files."
echo