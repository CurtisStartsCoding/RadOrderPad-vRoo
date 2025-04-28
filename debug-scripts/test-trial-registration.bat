@echo off
echo Testing Trial Registration Endpoint...
curl -X POST https://api.radorderpad.com/api/auth/trial/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"trial-user@example.com\",\"password\":\"password123\",\"firstName\":\"Trial\",\"lastName\":\"User\",\"specialty\":\"Cardiology\"}"
echo.