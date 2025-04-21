@echo off
echo Testing Super Admin API endpoints...

REM Load environment variables from .env file
for /f "tokens=*" %%a in (.env) do (
    set %%a
)

REM Set variables
set ORG_ID=1
set AUTH_TOKEN=%JWT_TEST_TOKEN%

REM Use API_BASE_URL from environment or fallback to default
if not defined API_BASE_URL (
    echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api
    set API_BASE_URL=http://localhost:3000/api
)

REM Remove trailing /api if present (since we'll add it in the URL)
set BASE_URL=%API_BASE_URL%
if "%BASE_URL:~-4%" == "/api" (
    set BASE_URL=%BASE_URL:~0,-4%
)

echo Using API URL: %BASE_URL%

REM Create test-results directory if it doesn't exist
if not exist test-results mkdir test-results

echo.
echo === Testing Organization Status Update ===
curl -s -X PUT -o test-results\org-status-update.json -w "Status: %%{http_code}\nContent-Type: %%{content_type}\n" ^
  -H "Authorization: Bearer %AUTH_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"newStatus\": \"active\"}" ^
  "%BASE_URL%/api/superadmin/organizations/%ORG_ID%/status"

echo.
echo === Testing Organization Credits Adjustment ===
curl -s -X POST -o test-results\org-credits-adjust.json -w "Status: %%{http_code}\nContent-Type: %%{content_type}\n" ^
  -H "Authorization: Bearer %AUTH_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"amount\": 100, \"reason\": \"Test credit adjustment\"}" ^
  "%BASE_URL%/api/superadmin/organizations/%ORG_ID%/credits/adjust"

echo.
echo === Testing Invalid Organization Status Update ===
curl -s -X PUT -o test-results\org-status-invalid.json -w "Status: %%{http_code}\nContent-Type: %%{content_type}\n" ^
  -H "Authorization: Bearer %AUTH_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"newStatus\": \"invalid_status\"}" ^
  "%BASE_URL%/api/superadmin/organizations/%ORG_ID%/status"

echo.
echo === Testing Invalid Organization Credits Adjustment ===
curl -s -X POST -o test-results\org-credits-invalid.json -w "Status: %%{http_code}\nContent-Type: %%{content_type}\n" ^
  -H "Authorization: Bearer %AUTH_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"amount\": \"not_a_number\", \"reason\": \"Test invalid credit adjustment\"}" ^
  "%BASE_URL%/api/superadmin/organizations/%ORG_ID%/credits/adjust"

echo.
echo Test completed. Check test-results directory for response files.

pause