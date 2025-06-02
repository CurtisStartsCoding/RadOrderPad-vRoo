@echo off
REM Script to check all trial users
REM Run this from the temp directory

echo Connecting to EC2 instance to check all trial users
ssh -i radorderpad-key-pair.pem ubuntu@3.129.73.23 "cd ~/code/RadOrderPad-vRoo && node -e \"const { Pool } = require('pg'); const pool = new Pool({ connectionString: 'postgresql://postgres:password@radorderpad-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main', ssl: { rejectUnauthorized: false } }); async function checkAllUsers() { try { console.log('Checking all trial users:'); const result = await pool.query('SELECT id, email, validation_count, max_validations, (max_validations - validation_count) AS remaining_validations FROM trial_users ORDER BY id'); if (result.rows.length === 0) { console.log('No trial users found'); } else { console.log('Total trial users found:', result.rows.length); result.rows.forEach(user => { console.log('-----------------------------------'); console.log('ID:', user.id); console.log('Email:', user.email); console.log('Validation count:', user.validation_count); console.log('Max validations:', user.max_validations); console.log('Remaining validations:', user.remaining_validations); }); } } catch (err) { console.error(err); } finally { await pool.end(); } }; checkAllUsers();\""

echo.
echo Done.