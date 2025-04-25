#!/bin/bash
echo "=== Running Insert Multiple Users Script ==="
echo ""
echo "This script will insert multiple test users into the production database,"
echo "including a super_admin user."
echo ""
echo "Press Ctrl+C to cancel or Enter to continue..."
read

node insert-multiple-users.js

echo ""
echo "=== Script Execution Complete ==="
echo ""
echo "If successful, you should now have new test users in the database,"
echo "including a super_admin user with the password 'password123'."
echo ""
echo "You can now run the generate-all-role-tokens.js script to generate tokens"
echo "for all roles, including the super_admin role."
echo ""
read -p "Press Enter to continue..."