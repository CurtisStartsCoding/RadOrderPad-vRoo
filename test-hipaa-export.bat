@echo off
echo Testing HIPAA Compliance Export functionality...

REM Load environment variables from .env file
for /f "tokens=*" %%a in (.env) do (
    set %%a
)

REM Set database connection variables from environment
set PGHOST=%DB_HOST%
set PGPORT=%DB_PORT%
set PGUSER=%DB_USER%
set PGPASSWORD=%DB_PASSWORD%
set PGDATABASE=radorder_phi

echo.
echo === Step 1: Schema changes already applied ===
echo Skipping schema changes as they have already been applied and verified.

echo.
echo === Step 2: Inserting test data ===
echo Running insert-hipaa-test-data.sql...
node scripts/execute-sql-script.js sql-scripts/insert-hipaa-test-data.sql
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Failed to insert test data.
  exit /b %ERRORLEVEL%
)

echo.
echo === Step 3: Running export tests ===
call test-radiology-export.bat

echo.
echo === Step 4: Verifying HIPAA fields in exports ===
echo Checking JSON export...
findstr "referring_physician_phone referring_organization_address radiology_organization_name patient_consent_obtained" test-results\order-export.json > nul
if %ERRORLEVEL% EQU 0 (
  echo SUCCESS: HIPAA compliance fields found in JSON export.
) else (
  echo ERROR: HIPAA compliance fields not found in JSON export.
)

echo Checking CSV export...
findstr "referring_physician_phone referring_organization_address radiology_organization_name patient_consent_obtained" test-results\order-export.csv > nul
if %ERRORLEVEL% EQU 0 (
  echo SUCCESS: HIPAA compliance fields found in CSV export.
) else (
  echo ERROR: HIPAA compliance fields not found in CSV export.
)

echo.
echo HIPAA Compliance Export testing completed.
pause