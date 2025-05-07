@echo off
setlocal enabledelayedexpansion

REM Test script for the accept-invitation endpoint against production
REM This script tests the functionality of accepting an invitation and creating a user account

echo Testing accept-invitation endpoint on production...

REM Load environment variables from .env.production file
for /f "tokens=*" %%a in (.env.production) do (
  set %%a
)

REM Set API base URL for production
set API_URL=https://api.radorderpad.com/api

REM Generate a test token for testing
set TEST_TOKEN=%RANDOM%%RANDOM%%RANDOM%

REM Create a test invitation in the database
echo Creating test invitation...
node -e "const { Pool } = require('pg'); const pool = new Pool({ connectionString: process.env.MAIN_DATABASE_URL }); (async () => { try { const now = new Date(); const expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); await pool.query('INSERT INTO user_invitations (organization_id, invited_by_user_id, email, role, token, expires_at, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())', [1, 1, 'test-invitation@example.com', 'physician', '%TEST_TOKEN%', expiryDate.toISOString(), 'pending']); console.log('Test invitation created successfully'); } catch (err) { console.error('Error creating test invitation:', err); } finally { pool.end(); } })();"

REM Wait a moment for the database operation to complete
timeout /t 2 > nul

REM Test 1: Valid invitation acceptance
echo Test 1: Valid invitation acceptance
curl -X POST %API_URL%/user-invites/accept-invitation ^
  -H "Content-Type: application/json" ^
  -d "{\"token\": \"%TEST_TOKEN%\", \"password\": \"Password123\", \"first_name\": \"Test\", \"last_name\": \"User\"}" ^
  -w "\nStatus: %%{http_code}\n"

echo.

REM Test 2: Invalid token
echo Test 2: Invalid token
curl -X POST %API_URL%/user-invites/accept-invitation ^
  -H "Content-Type: application/json" ^
  -d "{\"token\": \"invalid-token\", \"password\": \"Password123\", \"first_name\": \"Test\", \"last_name\": \"User\"}" ^
  -w "\nStatus: %%{http_code}\n"

echo.

REM Test 3: Missing required fields
echo Test 3: Missing required fields
curl -X POST %API_URL%/user-invites/accept-invitation ^
  -H "Content-Type: application/json" ^
  -d "{\"token\": \"%TEST_TOKEN%\"}" ^
  -w "\nStatus: %%{http_code}\n"

echo.

REM Test 4: Weak password
echo Test 4: Weak password
curl -X POST %API_URL%/user-invites/accept-invitation ^
  -H "Content-Type: application/json" ^
  -d "{\"token\": \"%TEST_TOKEN%\", \"password\": \"weak\", \"first_name\": \"Test\", \"last_name\": \"User\"}" ^
  -w "\nStatus: %%{http_code}\n"

echo.

REM Clean up test data
echo Cleaning up test data...
node -e "const { Pool } = require('pg'); const pool = new Pool({ connectionString: process.env.MAIN_DATABASE_URL }); (async () => { try { await pool.query('DELETE FROM users WHERE email = $1', ['test-invitation@example.com']); await pool.query('DELETE FROM user_invitations WHERE email = $1', ['test-invitation@example.com']); console.log('Test data cleaned up successfully'); } catch (err) { console.error('Error cleaning up test data:', err); } finally { pool.end(); } })();"

echo.
echo Testing completed.

endlocal
