@echo off
REM Script to create new publicly accessible PostgreSQL RDS instances for both main and PHI databases

REM Set variables for both databases
set MAIN_DB_INSTANCE_IDENTIFIER=radorderpad-main-public
set PHI_DB_INSTANCE_IDENTIFIER=radorderpad-phi-public
set MAIN_DB_NAME=radorder_main
set PHI_DB_NAME=radorder_phi
set DB_USERNAME=postgres
set DB_PASSWORD=SimplePassword123
set DB_CLASS=db.t3.micro
set DB_ENGINE=postgres
set DB_ENGINE_VERSION=17.2
set DB_STORAGE=20
set DB_PORT=5432
set SECURITY_GROUP_NAME=radorderpad-public-sg-new3
set VPC_ID=vpc-02fa4cfb11f3c7985

REM Set AWS profile to use the new rds-admin user
set AWS_PROFILE=rds-admin

echo Creating security group for RDS...
aws ec2 create-security-group --profile rds-admin --group-name %SECURITY_GROUP_NAME% --description "Security group for publicly accessible RDS" --vpc-id %VPC_ID% --output json > sg_output.json
for /f "tokens=2 delims=:, " %%a in ('findstr "GroupId" sg_output.json') do set SECURITY_GROUP_ID=%%~a
del sg_output.json
echo Security group created: %SECURITY_GROUP_ID%

echo Adding inbound rule to allow PostgreSQL connections from anywhere...
aws ec2 authorize-security-group-ingress --profile rds-admin --group-id %SECURITY_GROUP_ID% --protocol tcp --port %DB_PORT% --cidr 0.0.0.0/0 > nul 2>&1

echo Adding inbound rule to allow PostgreSQL connections from Vercel...
aws ec2 authorize-security-group-ingress --profile rds-admin --group-id %SECURITY_GROUP_ID% --protocol tcp --port %DB_PORT% --cidr 76.76.21.0/24 > nul 2>&1

echo Creating MAIN RDS instance...
aws rds create-db-instance --profile rds-admin --db-instance-identifier %MAIN_DB_INSTANCE_IDENTIFIER% --db-name %MAIN_DB_NAME% --engine %DB_ENGINE% --engine-version %DB_ENGINE_VERSION% --db-instance-class %DB_CLASS% --allocated-storage %DB_STORAGE% --master-username %DB_USERNAME% --master-user-password %DB_PASSWORD% --vpc-security-group-ids %SECURITY_GROUP_ID% --publicly-accessible --port %DB_PORT% --backup-retention-period 7 --no-multi-az --storage-type gp2

echo MAIN RDS instance creation initiated. It will take several minutes to complete.

echo Creating PHI RDS instance...
aws rds create-db-instance --profile rds-admin --db-instance-identifier %PHI_DB_INSTANCE_IDENTIFIER% --db-name %PHI_DB_NAME% --engine %DB_ENGINE% --engine-version %DB_ENGINE_VERSION% --db-instance-class %DB_CLASS% --allocated-storage %DB_STORAGE% --master-username %DB_USERNAME% --master-user-password %DB_PASSWORD% --vpc-security-group-ids %SECURITY_GROUP_ID% --publicly-accessible --port %DB_PORT% --backup-retention-period 7 --no-multi-az --storage-type gp2

echo PHI RDS instance creation initiated. It will take several minutes to complete.

echo You can check the status with:
echo aws rds describe-db-instances --profile rds-admin --db-instance-identifier %MAIN_DB_INSTANCE_IDENTIFIER% --query "DBInstances[0].DBInstanceStatus"
echo aws rds describe-db-instances --profile rds-admin --db-instance-identifier %PHI_DB_INSTANCE_IDENTIFIER% --query "DBInstances[0].DBInstanceStatus"

echo Once the instances are available, you can get the endpoints with:
echo aws rds describe-db-instances --profile rds-admin --db-instance-identifier %MAIN_DB_INSTANCE_IDENTIFIER% --query "DBInstances[0].Endpoint.Address" --output text
echo aws rds describe-db-instances --profile rds-admin --db-instance-identifier %PHI_DB_INSTANCE_IDENTIFIER% --query "DBInstances[0].Endpoint.Address" --output text

echo Update your Vercel environment variables with the new connection strings:
echo MAIN_DATABASE_URL=postgresql://%DB_USERNAME%:%DB_PASSWORD%@^<main-endpoint^>:%DB_PORT%/%MAIN_DB_NAME%
echo PHI_DATABASE_URL=postgresql://%DB_USERNAME%:%DB_PASSWORD%@^<phi-endpoint^>:%DB_PORT%/%PHI_DB_NAME%

echo After the databases are created, you'll need to migrate your data from the existing databases.
echo You can use pg_dump and pg_restore for this purpose.

pause