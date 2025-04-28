@echo off
echo Testing Trial Validation Endpoint...

REM First, save the token from login
FOR /F "tokens=*" %%g IN ('curl -s -X POST https://api.radorderpad.com/api/auth/trial/login -H "Content-Type: application/json" -d "{\"email\":\"trial-user@example.com\",\"password\":\"password123\"}" ^| findstr /C:"token"') do (
    SET RESPONSE=%%g
)

REM Extract token using string manipulation (simplified approach)
FOR /F "tokens=2 delims=:," %%a IN ("%RESPONSE%") DO (
    SET TOKEN=%%a
    SET TOKEN=!TOKEN:"=!
    SET TOKEN=!TOKEN: =!
)

echo Using token: %TOKEN%

REM Use the token to call the validation endpoint
curl -X POST https://api.radorderpad.com/api/orders/validate/trial ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"dictationText\":\"Patient with chest pain, shortness of breath. History of hypertension. Please evaluate for possible coronary artery disease.\"}"
echo.

REM Try multiple validations to test the limit
echo Testing validation limit...
for /L %%i in (1,1,11) do (
    echo Validation attempt %%i
    curl -s -X POST https://api.radorderpad.com/api/orders/validate/trial ^
      -H "Content-Type: application/json" ^
      -H "Authorization: Bearer %TOKEN%" ^
      -d "{\"dictationText\":\"Validation attempt %%i: Patient with chest pain, shortness of breath. History of hypertension. Please evaluate for possible coronary artery disease.\"}"
    echo.
)