@echo off
echo Creating Order in pending_admin Status...
echo.

node create-pending-admin-order.js

echo.
echo Order creation completed. Press any key to exit...
pause > nul