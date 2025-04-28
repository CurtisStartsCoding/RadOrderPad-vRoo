#!/bin/bash
echo "Testing Trial Login Endpoint..."
curl -X POST https://api.radorderpad.com/api/auth/trial/login \
  -H "Content-Type: application/json" \
  -d '{"email":"trial-user@example.com","password":"password123"}'
echo