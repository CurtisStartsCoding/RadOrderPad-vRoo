#!/bin/bash
echo "Running File Upload Service Tests..."

# Set the JWT token for authentication
export JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDU3NTUzOCwiZXhwIjoxNzQ0NjYxOTM4fQ.gnTcT9gQoz1RNmvo6A_DWAolelanr0ilBvn6PylJK9k"

# Run the tests
npx jest tests/file-upload.test.js --verbose

echo "Test execution complete."