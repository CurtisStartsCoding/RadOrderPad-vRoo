#!/bin/bash
# Script to migrate data from existing RDS databases to new publicly accessible ones

# Set variables for source (existing) databases
SOURCE_MAIN_HOST="radorder-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com"
SOURCE_PHI_HOST="radorder-phi-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com"
SOURCE_USERNAME="postgres"
SOURCE_MAIN_PASSWORD="Nt35w912#DietCoke86!"
SOURCE_PHI_PASSWORD="Normandy4950#Nt35w912#"
SOURCE_PORT="5432"
SOURCE_MAIN_DB="radorder_main"
SOURCE_PHI_DB="radorder_phi"

# Set variables for target (new) databases
# These will be the endpoints of your newly created RDS instances
# You'll need to replace these with the actual endpoints after the instances are created
TARGET_MAIN_HOST="radorderpad-main-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com"
TARGET_PHI_HOST="radorderpad-phi-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com"
TARGET_USERNAME="postgres"
TARGET_PASSWORD="SimplePassword123"  # Use the same password you set in create-public-rds.sh
TARGET_PORT="5432"
TARGET_MAIN_DB="radorder_main"
TARGET_PHI_DB="radorder_phi"

# Create temporary directory for dump files
mkdir -p ./db_dumps

echo "Starting database migration process..."

# Dump main database schema
echo "Dumping main database schema..."
PGPASSWORD=$SOURCE_MAIN_PASSWORD pg_dump -h $SOURCE_MAIN_HOST -U $SOURCE_USERNAME -p $SOURCE_PORT -d $SOURCE_MAIN_DB -s -f ./db_dumps/main_schema.sql

# Dump main database data
echo "Dumping main database data..."
PGPASSWORD=$SOURCE_MAIN_PASSWORD pg_dump -h $SOURCE_MAIN_HOST -U $SOURCE_USERNAME -p $SOURCE_PORT -d $SOURCE_MAIN_DB -a -f ./db_dumps/main_data.sql

# Dump PHI database schema
echo "Dumping PHI database schema..."
PGPASSWORD=$SOURCE_PHI_PASSWORD pg_dump -h $SOURCE_PHI_HOST -U $SOURCE_USERNAME -p $SOURCE_PORT -d $SOURCE_PHI_DB -s -f ./db_dumps/phi_schema.sql

# Dump PHI database data
echo "Dumping PHI database data..."
PGPASSWORD=$SOURCE_PHI_PASSWORD pg_dump -h $SOURCE_PHI_HOST -U $SOURCE_USERNAME -p $SOURCE_PORT -d $SOURCE_PHI_DB -a -f ./db_dumps/phi_data.sql

# Restore main database schema
echo "Restoring main database schema..."
PGPASSWORD=$TARGET_PASSWORD psql -h $TARGET_MAIN_HOST -U $TARGET_USERNAME -p $TARGET_PORT -d $TARGET_MAIN_DB -f ./db_dumps/main_schema.sql

# Restore main database data
echo "Restoring main database data..."
PGPASSWORD=$TARGET_PASSWORD psql -h $TARGET_MAIN_HOST -U $TARGET_USERNAME -p $TARGET_PORT -d $TARGET_MAIN_DB -f ./db_dumps/main_data.sql

# Restore PHI database schema
echo "Restoring PHI database schema..."
PGPASSWORD=$TARGET_PASSWORD psql -h $TARGET_PHI_HOST -U $TARGET_USERNAME -p $TARGET_PORT -d $TARGET_PHI_DB -f ./db_dumps/phi_schema.sql

# Restore PHI database data
echo "Restoring PHI database data..."
PGPASSWORD=$TARGET_PASSWORD psql -h $TARGET_PHI_HOST -U $TARGET_USERNAME -p $TARGET_PORT -d $TARGET_PHI_DB -f ./db_dumps/phi_data.sql

echo "Database migration completed!"
echo "Please update your Vercel environment variables with the new connection strings:"
echo "MAIN_DATABASE_URL=postgresql://$TARGET_USERNAME:$TARGET_PASSWORD@$TARGET_MAIN_HOST:$TARGET_PORT/$TARGET_MAIN_DB"
echo "PHI_DATABASE_URL=postgresql://$TARGET_USERNAME:$TARGET_PASSWORD@$TARGET_PHI_HOST:$TARGET_PORT/$TARGET_PHI_DB"

# Clean up dump files
echo "Cleaning up temporary files..."
rm -rf ./db_dumps

echo "All done!"