#!/bin/bash
# Script to create new publicly accessible PostgreSQL RDS instances for both main and PHI databases

# Set variables for both databases
MAIN_DB_INSTANCE_IDENTIFIER="radorderpad-main-public"
PHI_DB_INSTANCE_IDENTIFIER="radorderpad-phi-public"
MAIN_DB_NAME="radorder_main"
PHI_DB_NAME="radorder_phi"
DB_USERNAME="postgres"
DB_PASSWORD="SimplePassword123"  # Change this to a secure password
DB_CLASS="db.t3.micro"
DB_ENGINE="postgres"
DB_ENGINE_VERSION="14.6"
DB_STORAGE=20
DB_PORT=5432
SECURITY_GROUP_NAME="radorderpad-public-sg"
VPC_ID="vpc-02fa4cfb11f3c7985"  # Your VPC ID from the screenshot

echo "Creating security group for RDS..."
SECURITY_GROUP_ID=$(aws ec2 create-security-group \
  --group-name $SECURITY_GROUP_NAME \
  --description "Security group for publicly accessible RDS" \
  --vpc-id $VPC_ID \
  --output text \
  --query 'GroupId')

echo "Security group created: $SECURITY_GROUP_ID"

echo "Adding inbound rule to allow PostgreSQL connections from anywhere..."
aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP_ID \
  --protocol tcp \
  --port $DB_PORT \
  --cidr 0.0.0.0/0

echo "Adding inbound rule to allow PostgreSQL connections from Vercel..."
aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP_ID \
  --protocol tcp \
  --port $DB_PORT \
  --cidr 76.76.21.0/24

echo "Creating MAIN RDS instance..."
aws rds create-db-instance \
  --db-instance-identifier $MAIN_DB_INSTANCE_IDENTIFIER \
  --db-name $MAIN_DB_NAME \
  --engine $DB_ENGINE \
  --engine-version $DB_ENGINE_VERSION \
  --db-instance-class $DB_CLASS \
  --allocated-storage $DB_STORAGE \
  --master-username $DB_USERNAME \
  --master-user-password $DB_PASSWORD \
  --vpc-security-group-ids $SECURITY_GROUP_ID \
  --publicly-accessible \
  --port $DB_PORT \
  --backup-retention-period 7 \
  --no-multi-az \
  --storage-type gp2

echo "MAIN RDS instance creation initiated. It will take several minutes to complete."

echo "Creating PHI RDS instance..."
aws rds create-db-instance \
  --db-instance-identifier $PHI_DB_INSTANCE_IDENTIFIER \
  --db-name $PHI_DB_NAME \
  --engine $DB_ENGINE \
  --engine-version $DB_ENGINE_VERSION \
  --db-instance-class $DB_CLASS \
  --allocated-storage $DB_STORAGE \
  --master-username $DB_USERNAME \
  --master-user-password $DB_PASSWORD \
  --vpc-security-group-ids $SECURITY_GROUP_ID \
  --publicly-accessible \
  --port $DB_PORT \
  --backup-retention-period 7 \
  --no-multi-az \
  --storage-type gp2

echo "PHI RDS instance creation initiated. It will take several minutes to complete."

echo "You can check the status with:"
echo "aws rds describe-db-instances --db-instance-identifier $MAIN_DB_INSTANCE_IDENTIFIER --query 'DBInstances[0].DBInstanceStatus'"
echo "aws rds describe-db-instances --db-instance-identifier $PHI_DB_INSTANCE_IDENTIFIER --query 'DBInstances[0].DBInstanceStatus'"

echo "Once the instances are available, you can get the endpoints with:"
echo "MAIN_ENDPOINT=\$(aws rds describe-db-instances --db-instance-identifier $MAIN_DB_INSTANCE_IDENTIFIER --query 'DBInstances[0].Endpoint.Address' --output text)"
echo "PHI_ENDPOINT=\$(aws rds describe-db-instances --db-instance-identifier $PHI_DB_INSTANCE_IDENTIFIER --query 'DBInstances[0].Endpoint.Address' --output text)"

echo "Update your Vercel environment variables with the new connection strings:"
echo "MAIN_DATABASE_URL=postgresql://$DB_USERNAME:$DB_PASSWORD@<main-endpoint>:$DB_PORT/$MAIN_DB_NAME"
echo "PHI_DATABASE_URL=postgresql://$DB_USERNAME:$DB_PASSWORD@<phi-endpoint>:$DB_PORT/$PHI_DB_NAME"

echo "After the databases are created, you'll need to migrate your data from the existing databases."
echo "You can use pg_dump and pg_restore for this purpose."