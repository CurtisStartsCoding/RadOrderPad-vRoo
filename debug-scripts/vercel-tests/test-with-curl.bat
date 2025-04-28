@echo off
echo Testing GET /api/organizations/mine endpoint with curl...

set TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoic2NoZWR1bGVyIiwiZW1haWwiOiJ0ZXN0LnNjaGVkdWxlckBleGFtcGxlLmNvbSIsImlhdCI6MTc0NTQxODU4MCwiZXhwIjoxNzQ1NTA0OTgwfQ.MbxDlUiVZXWL87252bGU0g-b-hheldiiE3UGyRlR2YY

curl -v -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" https://api.radorderpad.com/api/organizations/mine

echo.
echo Test completed.