@echo off
echo Organizing recently created scripts into appropriate directories...
echo.

REM Frontend-related scripts go to frontend-explanation/debug-scripts
echo Moving frontend-related scripts to frontend-explanation/debug-scripts:
echo.

if exist "query-admin-staff-users.js" (
    move "query-admin-staff-users.js" "frontend-explanation\debug-scripts\"
    echo - Moved query-admin-staff-users.js
)

if exist "test-admin-endpoint.js" (
    move "test-admin-endpoint.js" "frontend-explanation\debug-scripts\"
    echo - Moved test-admin-endpoint.js
)

if exist "run-query-prompt-template.bat" (
    move "run-query-prompt-template.bat" "frontend-explanation\debug-scripts\"
    echo - Moved run-query-prompt-template.bat
)

if exist "query-prompt-template.js" (
    move "query-prompt-template.js" "frontend-explanation\debug-scripts\"
    echo - Moved query-prompt-template.js
)

REM Create directories for other scripts if they don't exist
if not exist "scripts\api-tests" mkdir "scripts\api-tests"
if not exist "scripts\db-tools" mkdir "scripts\db-tools"
if not exist "scripts\deployment" mkdir "scripts\deployment"

echo.
echo Moving API-related test scripts to scripts\api-tests:
echo.

if exist "test-api.js" (
    move "test-api.js" "scripts\api-tests\"
    echo - Moved test-api.js
)

if exist "test-api-with-auth.js" (
    move "test-api-with-auth.js" "scripts\api-tests\"
    echo - Moved test-api-with-auth.js
)

if exist "comprehensive-api-test.js" (
    move "comprehensive-api-test.js" "scripts\api-tests\"
    echo - Moved comprehensive-api-test.js
)

echo.
echo Moving database-related scripts to scripts\db-tools:
echo.

if exist "update-vercel-db-ssl.js" (
    move "update-vercel-db-ssl.js" "scripts\db-tools\"
    echo - Moved update-vercel-db-ssl.js
)

if exist "update-vercel-db-ssl.bat" (
    move "update-vercel-db-ssl.bat" "scripts\db-tools\"
    echo - Moved update-vercel-db-ssl.bat
)

if exist "test-db-connection-ssl.js" (
    move "test-db-connection-ssl.js" "scripts\db-tools\"
    echo - Moved test-db-connection-ssl.js
)

if exist "test-db-connection-ssl.bat" (
    move "test-db-connection-ssl.bat" "scripts\db-tools\"
    echo - Moved test-db-connection-ssl.bat
)

if exist "run-sql-script.bat" (
    move "run-sql-script.bat" "scripts\db-tools\"
    echo - Moved run-sql-script.bat
)

echo.
echo Moving deployment-related scripts to scripts\deployment:
echo.

if exist "test-and-deploy-fixed-implementation.bat" (
    move "test-and-deploy-fixed-implementation.bat" "scripts\deployment\"
    echo - Moved test-and-deploy-fixed-implementation.bat
)

if exist "test-fixed-implementation-locally.bat" (
    move "test-fixed-implementation-locally.bat" "scripts\deployment\"
    echo - Moved test-fixed-implementation-locally.bat
)

if exist "run-test-fixed-implementation-production.bat" (
    move "run-test-fixed-implementation-production.bat" "scripts\deployment\"
    echo - Moved run-test-fixed-implementation-production.bat
)

if exist "create-deployment-zip-manual.bat" (
    move "create-deployment-zip-manual.bat" "scripts\deployment\"
    echo - Moved create-deployment-zip-manual.bat
)

if exist "deploy-manual-zip.bat" (
    move "deploy-manual-zip.bat" "scripts\deployment\"
    echo - Moved deploy-manual-zip.bat
)

if exist "create-vercel-package-silent.bat" (
    move "create-vercel-package-silent.bat" "scripts\deployment\"
    echo - Moved create-vercel-package-silent.bat
)

if exist "run-production-tests.bat" (
    move "run-production-tests.bat" "scripts\deployment\"
    echo - Moved run-production-tests.bat
)

echo.
echo Organization complete!
echo.
pause