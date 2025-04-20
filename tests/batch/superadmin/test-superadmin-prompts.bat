@echo off
echo Running Super Admin Prompts API Tests...

REM Set environment variables for testing
set API_URL=http://localhost:3000
set TEST_TOKEN=test-token

REM Compile TypeScript files
echo Compiling TypeScript files...
call npx tsc

REM Run the tests
echo Running tests...

REM Test creating a prompt template
echo Testing POST /api/superadmin/prompts/templates
curl -X POST ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TEST_TOKEN%" ^
  -d "{\"name\":\"Test Template\",\"type\":\"default\",\"version\":\"1.0\",\"content_template\":\"Test content {{PLACEHOLDER}}\",\"word_limit\":100,\"active\":true}" ^
  %API_URL%/api/superadmin/prompts/templates

echo.
echo.

REM Test listing prompt templates
echo Testing GET /api/superadmin/prompts/templates
curl -X GET ^
  -H "Authorization: Bearer %TEST_TOKEN%" ^
  %API_URL%/api/superadmin/prompts/templates

echo.
echo.

REM Test getting a specific prompt template (replace 1 with an actual ID)
echo Testing GET /api/superadmin/prompts/templates/1
curl -X GET ^
  -H "Authorization: Bearer %TEST_TOKEN%" ^
  %API_URL%/api/superadmin/prompts/templates/1

echo.
echo.

REM Test updating a prompt template (replace 1 with an actual ID)
echo Testing PUT /api/superadmin/prompts/templates/1
curl -X PUT ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TEST_TOKEN%" ^
  -d "{\"name\":\"Updated Test Template\",\"word_limit\":150}" ^
  %API_URL%/api/superadmin/prompts/templates/1

echo.
echo.

REM Test deleting a prompt template (replace 1 with an actual ID)
echo Testing DELETE /api/superadmin/prompts/templates/1
curl -X DELETE ^
  -H "Authorization: Bearer %TEST_TOKEN%" ^
  %API_URL%/api/superadmin/prompts/templates/1

echo.
echo.

echo Super Admin Prompts API Tests completed.
pause