@echo off
echo Testing Radiology Order Export functionality...

REM Load environment variables from .env file
for /f "tokens=*" %%a in (.env) do (
    set %%a
)

REM Set variables
set ORDER_ID=5
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
echo === Testing JSON Export ===
curl -s -o test-results\order-export.json -w "Status: %%{http_code}\nContent-Type: %%{content_type}\n" ^
  -H "Authorization: Bearer %AUTH_TOKEN%" ^
  "%BASE_URL%/api/radiology/orders/%ORDER_ID%/export/json"

echo.
echo === Testing CSV Export ===
curl -s -o test-results\order-export.csv -w "Status: %%{http_code}\nContent-Type: %%{content_type}" ^
  -H "Authorization: Bearer %AUTH_TOKEN%" ^
  "%BASE_URL%/api/radiology/orders/%ORDER_ID%/export/csv"

echo === Testing PDF Export (Stub) ===
curl -s -o test-results\order-export.pdf -w "Status: %%{http_code}\nContent-Type: %%{content_type}" ^
  -H "Authorization: Bearer %AUTH_TOKEN%" ^
  "%BASE_URL%/api/radiology/orders/%ORDER_ID%/export/pdf"

echo === Testing Invalid Format ===
curl -s -w "Status: %%{http_code}\nResponse: " ^
  -H "Authorization: Bearer %AUTH_TOKEN%" ^
  "%BASE_URL%/api/radiology/orders/%ORDER_ID%/export/invalid"

echo.
echo Test completed. Check test-results directory for exported files.

REM Verify HIPAA compliance fields in the CSV export
findstr "referring_physician_phone referring_organization_address radiology_organization_name patient_consent_obtained" test-results\order-export.csv > nul
if %ERRORLEVEL% EQU 0 (
  echo HIPAA compliance fields verified in CSV export.
) else (
  echo WARNING: HIPAA compliance fields not found in CSV export.
)

REM Verify HIPAA compliance fields in the JSON export
findstr "referring_physician_phone referring_organization_address radiology_organization_name patient_consent_obtained" test-results\order-export.json > nul
if %ERRORLEVEL% EQU 0 (
  echo HIPAA compliance fields verified in JSON export.
) else (
  echo WARNING: HIPAA compliance fields not found in JSON export.
)

pause