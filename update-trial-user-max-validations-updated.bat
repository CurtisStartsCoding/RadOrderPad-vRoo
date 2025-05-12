@echo off
REM SSH into EC2 instance and update trial user max validations
REM Usage: update-trial-user-max-validations-updated.bat [userId] [newMaxValidations]

REM Default values if not provided
set USER_ID=%1
if "%USER_ID%"=="" set USER_ID=31

set MAX_VALIDATIONS=%2
if "%MAX_VALIDATIONS%"=="" set MAX_VALIDATIONS=25

REM EC2 instance details - using correct public IP address from AWS console
set EC2_HOST=ubuntu@3.129.73.23
set KEY_FILE=temp\radorderpad-key-pair.pem

REM Create the command to run on the EC2 instance
set REMOTE_CMD="cd ~/code/RadOrderPad-vRoo && node -e \"const { Pool } = require('pg'); const pool = new Pool({ connectionString: process.env.MAIN_DATABASE_URL, ssl: { rejectUnauthorized: false } }); (async () => { try { console.log('Updating max validations for trial user with ID: %USER_ID% to %MAX_VALIDATIONS%'); const result = await pool.query('UPDATE trial_users SET max_validations = %MAX_VALIDATIONS% WHERE id = %USER_ID% RETURNING id, email, validation_count, max_validations, (max_validations - validation_count) AS remaining_validations'); if (result.rows.length === 0) { console.log('No trial user found with ID: %USER_ID%'); } else { console.log(result.rows[0]); } } catch (err) { console.error(err); } finally { await pool.end(); } })();\""

REM Execute the SSH command
echo Connecting to EC2 instance and updating trial user with ID: %USER_ID% to max validations: %MAX_VALIDATIONS%
ssh -i %KEY_FILE% %EC2_HOST% %REMOTE_CMD%