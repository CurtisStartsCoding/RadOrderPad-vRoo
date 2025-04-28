#!/bin/bash
echo "===== Running Working API Tests (Part 1) ====="

echo
echo "Generating fresh tokens for all roles..."
cd ../../
node scripts/utilities/generate-all-role-tokens.js
cd debug-scripts/vercel-tests

echo
echo "Running Connection Requests Tests..."
bash test-connection-requests.sh

echo
echo "Running Admin Order Queue Tests..."
bash test-admin-order-queue.sh

echo
echo "Running Admin Paste Summary Tests..."
bash test-admin-paste-summary.sh

echo
echo "Running Accept Invitation Tests..."
bash test-accept-invitation-prod.sh

echo
echo "Running User Invite Tests..."
bash test-user-invite-prod.sh

echo
echo "Running Uploads Presigned URL Tests..."
bash test-uploads-presigned-url.sh

echo
echo "Running Uploads Confirm Tests..."
bash test-uploads-confirm.sh

echo
echo "Running Get Download URL Tests..."
bash test-get-download-url.sh

echo
echo "Running Get Credit Balance Tests..."
bash test-get-credit-balance.sh

echo
echo "Running Get Credit Usage Tests..."
bash test-get-credit-usage.sh

echo
echo "Running Register Tests..."
bash test-register.sh

echo
echo "Running Get Organization Mine Tests..."
bash test-get-org-mine.sh

echo
echo "Running Get User Me Tests..."
bash test-get-user-me.sh

echo
echo "===== All Working Tests (Part 1) Complete ====="