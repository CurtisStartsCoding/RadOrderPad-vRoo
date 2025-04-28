#!/bin/bash
echo "Testing Location Management Endpoints"

# Change to the vercel-tests directory
cd "$(dirname "$0")"

# Run the JavaScript test
node test-location-management.js