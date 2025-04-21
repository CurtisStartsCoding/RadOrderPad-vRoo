@echo off
echo Moving debugging scripts to frontend-explanation/debug-scripts directory...

REM Create the directory if it doesn't exist
if not exist "frontend-explanation\debug-scripts" mkdir "frontend-explanation\debug-scripts"

REM Move admin-related test scripts
echo Moving admin-related test scripts...
if exist "test-send-to-radiology-precision.js" copy "test-send-to-radiology-precision.js" "frontend-explanation\debug-scripts\" && echo Moved test-send-to-radiology-precision.js
if exist "test-send-to-radiology.js" copy "test-send-to-radiology.js" "frontend-explanation\debug-scripts\" && echo Moved test-send-to-radiology.js
if exist "test-admin-endpoint.js" copy "test-admin-endpoint.js" "frontend-explanation\debug-scripts\" && echo Moved test-admin-endpoint.js
if exist "query-admin-staff-users.js" copy "query-admin-staff-users.js" "frontend-explanation\debug-scripts\" && echo Moved query-admin-staff-users.js

REM Move database connection test scripts
echo Moving database connection test scripts...
if exist "test-db-connection.js" copy "test-db-connection.js" "frontend-explanation\debug-scripts\" && echo Moved test-db-connection.js
if exist "test-db-connection-ssl.js" copy "test-db-connection-ssl.js" "frontend-explanation\debug-scripts\" && echo Moved test-db-connection-ssl.js
if exist "test-db-connection-ssl.bat" copy "test-db-connection-ssl.bat" "frontend-explanation\debug-scripts\" && echo Moved test-db-connection-ssl.bat
if exist "test-new-db-connection.js" copy "test-new-db-connection.js" "frontend-explanation\debug-scripts\" && echo Moved test-new-db-connection.js
if exist "test-db-data.js" copy "test-db-data.js" "frontend-explanation\debug-scripts\" && echo Moved test-db-data.js

REM Move comprehensive API test scripts
echo Moving comprehensive API test scripts...
if exist "comprehensive-api-test.js" copy "comprehensive-api-test.js" "frontend-explanation\debug-scripts\" && echo Moved comprehensive-api-test.js
if exist "test-api.js" copy "test-api.js" "frontend-explanation\debug-scripts\" && echo Moved test-api.js
if exist "test-api-with-auth.js" copy "test-api-with-auth.js" "frontend-explanation\debug-scripts\" && echo Moved test-api-with-auth.js

echo All debugging scripts have been moved to frontend-explanation/debug-scripts directory.
echo Note: Original files remain in the root directory. Delete them manually if needed.
pause