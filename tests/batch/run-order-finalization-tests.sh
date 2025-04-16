#!/bin/bash
echo "Running Order Finalization Tests"
echo "==============================="

# Generate a JWT token for a physician user
echo "Generating JWT token for physician user..."
JWT_TOKEN=$(node -e "const jwt = require(\"jsonwebtoken\"); const secret = \"79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112\"; const payload = { userId: 1, orgId: 1, role: \"physician\", email: \"test.physician@example.com\" }; const token = jwt.sign(payload, secret, { expiresIn: \"24h\" }); console.log(token);")
echo "Token generated: ${JWT_TOKEN:0:20}..."

# Create test-results directory if it doesn't exist
mkdir -p test-results

# Run the test with a timeout
echo "Running order finalization tests..."
node ./test-order-finalization.js $JWT_TOKEN > test-results/order-finalization-tests.log 2>&1
if [ $? -eq 0 ]; then
    echo "[PASS] Order Finalization Tests"
else
    echo "[FAIL] Order Finalization Tests - Check test-results/order-finalization-tests.log for details"
fi

echo
echo "Test completed!"