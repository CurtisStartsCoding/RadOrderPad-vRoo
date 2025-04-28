@echo off
echo Testing with AWS Database (sslmode=verify)...
set NODE_ENV=production
set API_URL=https://api.radorderpad.com
set JWT_SECRET=radorderpad-secure-jwt-secret-f8a72c1e9b5d3e7f4a6b2c8d9e0f1a2b3c4d5e6f

REM Create a copy of the environment file with sslmode=verify
powershell -Command "(Get-Content debug-scripts/vercel-tests/.env.aws-test-new) -replace 'sslmode=no-verify', 'sslmode=verify' | Set-Content debug-scripts/vercel-tests/.env.aws-test-verify"

node -r dotenv/config debug-scripts/vercel-tests/test-superadmin-api.js dotenv_config_path=debug-scripts/vercel-tests/.env.aws-test-verify
pause