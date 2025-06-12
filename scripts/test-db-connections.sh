#!/bin/bash

# Test database connections from EC2 instance
echo "Testing database connections from EC2..."

# Test main database
echo -e "\n1. Testing Main Database connection..."
psql "postgresql://postgres:password@radorderpad-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main?sslmode=require" -c "SELECT current_database(), current_user, inet_server_addr();" 2>&1

# Test PHI database  
echo -e "\n2. Testing PHI Database connection..."
psql "postgresql://postgres:password2@radorderpad-phi-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_phi?sslmode=require" -c "SELECT current_database(), current_user, inet_server_addr();" 2>&1

echo -e "\nDone!"