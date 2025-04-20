@echo off
echo Running Super Admin Logs API Tests...

REM Set environment variables for testing
set API_URL=http://localhost:3000
set TEST_TOKEN=test-token

REM Compile TypeScript files
echo Compiling TypeScript files...
call npx tsc

REM Run the tests
echo Running tests...

REM Test listing LLM validation logs
echo Testing GET /api/superadmin/logs/validation
curl -X GET ^
  -H "Authorization: Bearer %TEST_TOKEN%" ^
  %API_URL%/api/superadmin/logs/validation

echo.
echo.

REM Test listing LLM validation logs with filters
echo Testing GET /api/superadmin/logs/validation with filters
curl -X GET ^
  -H "Authorization: Bearer %TEST_TOKEN%" ^
  "%API_URL%/api/superadmin/logs/validation?organization_id=1&status=success&limit=10&offset=0"

echo.
echo.

REM Test listing credit usage logs
echo Testing GET /api/superadmin/logs/credits
curl -X GET ^
  -H "Authorization: Bearer %TEST_TOKEN%" ^
  %API_URL%/api/superadmin/logs/credits

echo.
echo.

REM Test listing credit usage logs with filters
echo Testing GET /api/superadmin/logs/credits with filters
curl -X GET ^
  -H "Authorization: Bearer %TEST_TOKEN%" ^
  "%API_URL%/api/superadmin/logs/credits?organization_id=1&action_type=validate&limit=10&offset=0"

echo.
echo.

REM Test listing purgatory events
echo Testing GET /api/superadmin/logs/purgatory
curl -X GET ^
  -H "Authorization: Bearer %TEST_TOKEN%" ^
  %API_URL%/api/superadmin/logs/purgatory

echo.
echo.

REM Test listing purgatory events with filters
echo Testing GET /api/superadmin/logs/purgatory with filters
curl -X GET ^
  -H "Authorization: Bearer %TEST_TOKEN%" ^
  "%API_URL%/api/superadmin/logs/purgatory?organization_id=1&status=active&limit=10&offset=0"

echo.
echo.

echo Super Admin Logs API Tests completed.
pause