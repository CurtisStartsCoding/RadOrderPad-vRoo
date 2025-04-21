@echo off
REM Script to migrate data from existing RDS databases to new publicly accessible ones

REM Set variables for source (existing) databases
set SOURCE_MAIN_HOST=radorder-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com
set SOURCE_PHI_HOST=radorder-phi-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com
set SOURCE_USERNAME=postgres
set SOURCE_MAIN_PASSWORD=Nt35w912#DietCoke86!
set SOURCE_PHI_PASSWORD=Normandy4950#Nt35w912#
set SOURCE_PORT=5432
set SOURCE_MAIN_DB=radorder_main
set SOURCE_PHI_DB=radorder_phi

REM Set variables for target (new) databases
set TARGET_MAIN_HOST=radorderpad-main-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com
set TARGET_PHI_HOST=radorderpad-phi-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com
set TARGET_USERNAME=postgres
set TARGET_PASSWORD=SimplePassword123
set TARGET_PORT=5432
set TARGET_MAIN_DB=radorder_main
set TARGET_PHI_DB=radorder_phi

REM Create temporary directory for dump files
mkdir db_dumps

echo Starting database migration process...

REM Dump main database schema
echo Dumping main database schema...
set PGPASSWORD=%SOURCE_MAIN_PASSWORD%
pg_dump -h %SOURCE_MAIN_HOST% -U %SOURCE_USERNAME% -p %SOURCE_PORT% -d %SOURCE_MAIN_DB% -s -f db_dumps\main_schema.sql

REM Dump main database data
echo Dumping main database data...
pg_dump -h %SOURCE_MAIN_HOST% -U %SOURCE_USERNAME% -p %SOURCE_PORT% -d %SOURCE_MAIN_DB% -a -f db_dumps\main_data.sql

REM Dump PHI database schema
echo Dumping PHI database schema...
set PGPASSWORD=%SOURCE_PHI_PASSWORD%
pg_dump -h %SOURCE_PHI_HOST% -U %SOURCE_USERNAME% -p %SOURCE_PORT% -d %SOURCE_PHI_DB% -s -f db_dumps\phi_schema.sql

REM Dump PHI database data
echo Dumping PHI database data...
pg_dump -h %SOURCE_PHI_HOST% -U %SOURCE_USERNAME% -p %SOURCE_PORT% -d %SOURCE_PHI_DB% -a -f db_dumps\phi_data.sql

REM Restore main database schema
echo Restoring main database schema...
set PGPASSWORD=%TARGET_PASSWORD%
psql -h %TARGET_MAIN_HOST% -U %TARGET_USERNAME% -p %TARGET_PORT% -d %TARGET_MAIN_DB% -f db_dumps\main_schema.sql --set=sslmode=require

REM Restore main database data
echo Restoring main database data...
psql -h %TARGET_MAIN_HOST% -U %TARGET_USERNAME% -p %TARGET_PORT% -d %TARGET_MAIN_DB% -f db_dumps\main_data.sql --set=sslmode=require

REM Restore PHI database schema
echo Restoring PHI database schema...
psql -h %TARGET_PHI_HOST% -U %TARGET_USERNAME% -p %TARGET_PORT% -d %TARGET_PHI_DB% -f db_dumps\phi_schema.sql --set=sslmode=require

REM Restore PHI database data
echo Restoring PHI database data...
psql -h %TARGET_PHI_HOST% -U %TARGET_USERNAME% -p %TARGET_PORT% -d %TARGET_PHI_DB% -f db_dumps\phi_data.sql --set=sslmode=require

echo Database migration completed!
echo Please update your Vercel environment variables with the new connection strings:
echo MAIN_DATABASE_URL=postgresql://%TARGET_USERNAME%:%TARGET_PASSWORD%@%TARGET_MAIN_HOST%:%TARGET_PORT%/%TARGET_MAIN_DB%?sslmode=require
echo PHI_DATABASE_URL=postgresql://%TARGET_USERNAME%:%TARGET_PASSWORD%@%TARGET_PHI_HOST%:%TARGET_PORT%/%TARGET_PHI_DB%?sslmode=require

REM Clean up dump files
echo Cleaning up temporary files...
rmdir /s /q db_dumps

echo All done!

pause