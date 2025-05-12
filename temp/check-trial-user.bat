@echo off
REM Script to check trial user validation count
REM Run this from the temp directory

REM Default to user ID 31 if not provided
set USER_ID=%1
if "%USER_ID%"=="" set USER_ID=31

echo Connecting to EC2 instance to check trial user with ID: %USER_ID%
ssh -i radorderpad-key-pair.pem ubuntu@3.129.73.23 "cd ~/code/RadOrderPad-vRoo && node -e \"const { Pool } = require('pg'); const pool = new Pool({ connectionString: 'postgresql://postgres:password@radorderpad-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main', ssl: { rejectUnauthorized: false } }); async function checkUser() { try { console.log('Checking trial user with ID: %USER_ID%'); const result = await pool.query('SELECT id, email, validation_count, max_validations, (max_validations - validation_count) AS remaining_validations FROM trial_users WHERE id = %USER_ID%'); if (result.rows.length === 0) { console.log('No trial user found with ID: %USER_ID%'); } else { console.log(result.rows[0]); } } catch (err) { console.error(err); } finally { await pool.end(); } }; checkUser();\""

echo.
echo Done.