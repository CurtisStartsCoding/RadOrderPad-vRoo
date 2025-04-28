#!/bin/bash
echo "Testing User Invitation Endpoint"

# Get admin token
ADMIN_TOKEN=$(node debug-scripts/vercel-tests/get-clean-token.js admin_referring)

echo
echo "Testing with valid data (admin_referring token)"
curl -X POST "http://localhost:3000/api/users/invite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"email":"test.user@example.com","role":"physician"}'

echo
echo
echo "Testing with invalid email format"
curl -X POST "http://localhost:3000/api/users/invite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"email":"invalid-email","role":"physician"}'

echo
echo
echo "Testing with invalid role"
curl -X POST "http://localhost:3000/api/users/invite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"email":"test.user@example.com","role":"invalid_role"}'

echo
echo
echo "Testing with missing email"
curl -X POST "http://localhost:3000/api/users/invite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"role":"physician"}'

echo
echo
echo "Testing with missing role"
curl -X POST "http://localhost:3000/api/users/invite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"email":"test.user@example.com"}'

# Get non-admin token
NON_ADMIN_TOKEN=$(node debug-scripts/vercel-tests/get-clean-token.js physician)

echo
echo
echo "Testing with non-admin token (should fail with 403)"
curl -X POST "http://localhost:3000/api/users/invite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NON_ADMIN_TOKEN" \
  -d '{"email":"test.user@example.com","role":"physician"}'

echo
echo
echo "Testing without token (should fail with 401)"
curl -X POST "http://localhost:3000/api/users/invite" \
  -H "Content-Type: application/json" \
  -d '{"email":"test.user@example.com","role":"physician"}'

echo
echo
echo "Test completed"