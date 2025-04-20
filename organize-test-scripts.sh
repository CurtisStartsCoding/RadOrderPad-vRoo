#!/bin/bash
echo "Organizing test scripts into appropriate directories..."

# Create necessary subdirectories if they don't exist
mkdir -p tests/batch/redis
mkdir -p tests/batch/stripe
mkdir -p tests/batch/notifications
mkdir -p tests/batch/superadmin
mkdir -p tests/batch/ses
mkdir -p tests/batch/general

# Move Redis-related test scripts
echo "Moving Redis test scripts..."
mv -f run-redis-basic-test.bat tests/batch/redis/ 2>/dev/null
mv -f run-redis-basic-test.sh tests/batch/redis/ 2>/dev/null
mv -f run-redis-search-test.bat tests/batch/redis/ 2>/dev/null
mv -f test-redis-connection.bat tests/batch/redis/ 2>/dev/null
mv -f test-redis-connection.sh tests/batch/redis/ 2>/dev/null

# Move Stripe-related test scripts
echo "Moving Stripe test scripts..."
mv -f test-stripe-webhooks.bat tests/batch/stripe/ 2>/dev/null
mv -f test-stripe-webhooks.sh tests/batch/stripe/ 2>/dev/null
mv -f run-stripe-webhook-tests.bat tests/batch/stripe/ 2>/dev/null

# Move Notification-related test scripts
echo "Moving Notification test scripts..."
mv -f test-notifications.bat tests/batch/notifications/ 2>/dev/null
mv -f test-notifications.sh tests/batch/notifications/ 2>/dev/null

# Move SuperAdmin-related test scripts
echo "Moving SuperAdmin test scripts..."
mv -f test-superadmin-logs.bat tests/batch/superadmin/ 2>/dev/null
mv -f test-superadmin-logs.sh tests/batch/superadmin/ 2>/dev/null
mv -f test-superadmin-prompt-assignments.bat tests/batch/superadmin/ 2>/dev/null
mv -f test-superadmin-prompt-assignments.sh tests/batch/superadmin/ 2>/dev/null
mv -f test-superadmin-prompts.bat tests/batch/superadmin/ 2>/dev/null

# Move SES-related test scripts
echo "Moving SES test scripts..."
mv -f test-ses-email.bat tests/batch/ses/ 2>/dev/null
mv -f test-ses-email.sh tests/batch/ses/ 2>/dev/null

# Move general test scripts
echo "Moving general test scripts..."
mv -f run-all-tests.bat tests/batch/general/ 2>/dev/null
mv -f run-all-tests.sh tests/batch/general/ 2>/dev/null
mv -f run-all-optimization-tests.bat tests/batch/general/ 2>/dev/null

# Move other test-related scripts that might be in the root directory
echo "Moving other test-related scripts..."
mv -f test-*.bat tests/batch/ 2>/dev/null
mv -f test-*.sh tests/batch/ 2>/dev/null
mv -f run-*-test*.bat tests/batch/ 2>/dev/null
mv -f run-*-test*.sh tests/batch/ 2>/dev/null

echo "Script organization complete!"
echo ""
echo "Note: Some files may not have been moved if they were already in their target directories."

# Make the script executable
chmod +x tests/batch/redis/*.sh 2>/dev/null
chmod +x tests/batch/stripe/*.sh 2>/dev/null
chmod +x tests/batch/notifications/*.sh 2>/dev/null
chmod +x tests/batch/superadmin/*.sh 2>/dev/null
chmod +x tests/batch/ses/*.sh 2>/dev/null
chmod +x tests/batch/general/*.sh 2>/dev/null
chmod +x tests/batch/*.sh 2>/dev/null