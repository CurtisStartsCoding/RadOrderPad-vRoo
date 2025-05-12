@echo off
REM Script to update trial user max validations
REM Run this from the temp directory

REM Default values if not provided
set USER_ID=%1
if "%USER_ID%"=="" set USER_ID=31

set MAX_VALIDATIONS=%2
if "%MAX_VALIDATIONS%"=="" set MAX_VALIDATIONS=150

echo Connecting to EC2 instance to update trial user with ID: %USER_ID% to max validations: %MAX_VALIDATIONS%
ssh -i radorderpad-key-pair.pem ubuntu@3.129.73.23 "cd ~/code/RadOrderPad-vRoo && node -e \"const { Pool } = require('pg'); const pool = new Pool({ connectionString: 'postgresql://postgres:password@radorderpad-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main', ssl: { rejectUnauthorized: false } }); async function updateUser() { try { console.log('Updating max validations for user ID %USER_ID% to %MAX_VALIDATIONS%'); const result = await pool.query('UPDATE trial_users SET max_validations = %MAX_VALIDATIONS% WHERE id = %USER_ID% RETURNING id, email, validation_count, max_validations, (max_validations - validation_count) AS remaining_validations'); if (result.rows.length === 0) { console.log('No trial user found with ID: %USER_ID%'); } else { console.log(result.rows[0]); } } catch (err) { console.error(err); } finally { await pool.end(); } }; updateUser();\""

echo.
echo Done.