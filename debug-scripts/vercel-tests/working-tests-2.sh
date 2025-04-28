#!/bin/bash
echo "===== Running Working API Tests (Part 2) ====="

echo
echo "Generating fresh tokens for all roles..."
cd ../../
node scripts/utilities/generate-all-role-tokens.js
cd debug-scripts/vercel-tests

echo
echo "Running Connection Terminate Tests..."
bash test-connection-terminate.sh

echo
echo "Running Update User Me Tests..."
bash test-update-user-me.sh

echo
echo "Running List Organization Users Tests..."
bash test-list-org-users.sh

echo
echo "Running Update Organization User Tests..."
bash test-update-org-user.sh

echo
echo "Running Deactivate Organization User Tests..."
bash test-deactivate-org-user.sh

echo
echo "Running User Location Assignment Tests..."
bash test-user-location-assignment.sh

echo
echo "Running Connection Reject Tests..."
bash test-connection-reject.sh

echo
echo "Running User Invite Tests..."
bash test-user-invite-prod.sh

echo
echo "Running Update Organization Tests..."
bash test-update-org-mine.sh

echo
echo "Running Search Organizations Tests..."
bash test-search-organizations.sh

echo
echo "Running Health Check Tests..."
bash test-health.sh

echo
echo "Running Login Tests..."
bash test-login.sh

echo
echo "Running Connection List Tests..."
bash test-connection-list.sh

echo
echo "Running Connection Requests List Tests..."
bash test-connection-requests-list.sh

echo
echo "Running Connection Request Tests..."
bash test-connection-request.sh

echo
echo "Running Connection Approve Tests..."
bash test-connection-approve.sh

echo
echo "Running Admin Order Queue Tests..."
bash test-admin-order-queue.sh

echo
echo "Running Admin Paste Summary Tests..."
bash test-admin-paste-summary.sh

echo
echo "Running Location Management Tests..."
bash test-location-management.sh

echo
echo "===== All Working Tests (Part 2) Complete ====="