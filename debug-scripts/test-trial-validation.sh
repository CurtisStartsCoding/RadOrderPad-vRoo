#!/bin/bash
echo "Testing Trial Validation Endpoint..."

# First, save the token from login
TOKEN=$(curl -s -X POST https://api.radorderpad.com/api/auth/trial/login \
  -H "Content-Type: application/json" \
  -d '{"email":"trial-user@example.com","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Using token: $TOKEN"

# Use the token to call the validation endpoint
curl -X POST https://api.radorderpad.com/api/orders/validate/trial \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"dictationText":"Patient with chest pain, shortness of breath. History of hypertension. Please evaluate for possible coronary artery disease."}'
echo

# Try multiple validations to test the limit
echo "Testing validation limit..."
for i in {1..11}
do
  echo "Validation attempt $i"
  curl -s -X POST https://api.radorderpad.com/api/orders/validate/trial \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{\"dictationText\":\"Validation attempt $i: Patient with chest pain, shortness of breath. History of hypertension. Please evaluate for possible coronary artery disease.\"}"
  echo
done