@echo off
REM SSH into EC2 instance and check trial user validation count
REM Usage: check-trial-user-ssh-updated.bat [userId]

REM Default to user ID 31 if not provided
set USER_ID=%1
if "%USER_ID%"=="" set USER_ID=31

REM EC2 instance details - using correct public IP address from AWS console
set EC2_HOST=ubuntu@3.129.73.23
set KEY_FILE=temp\radorderpad-key-pair.pem

REM Create the command to run on the EC2 instance
set REMOTE_CMD="cd ~/code/RadOrderPad-vRoo && node -e \"const { Pool } = require('pg'); const pool = new Pool({ connectionString: process.env.MAIN_DATABASE_URL, ssl: { rejectUnauthorized: false } }); (async () => { try { console.log('Checking trial user with ID: %USER_ID%'); const result = await pool.query('SELECT id, email, validation_count, max_validations, (max_validations - validation_count) AS remaining_validations FROM trial_users WHERE id = %USER_ID%'); if (result.rows.length === 0) { console.log('No trial user found with ID: %USER_ID%'); } else { console.log(result.rows[0]); } } catch (err) { console.error(err); } finally { await pool.end(); } })();\""

REM Execute the SSH command
echo Connecting to EC2 instance and checking trial user with ID: %USER_ID%
ssh -i %KEY_FILE% %EC2_HOST% %REMOTE_CMD%