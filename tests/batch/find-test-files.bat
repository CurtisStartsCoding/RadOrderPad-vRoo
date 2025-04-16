@echo off
REM Script to find all test files in the project
echo Finding all test files in the project...
echo.

echo === Test Batch Files (.bat) ===
dir /s /b ..\..\*test*.bat
echo.

echo === Test Shell Scripts (.sh) ===
dir /s /b ..\..\*test*.sh
echo.

echo === Test JavaScript Files (.js) ===
dir /s /b ..\..\*test*.js
echo.

echo === Run Batch Files (.bat) ===
dir /s /b ..\..\run*.bat
echo.

echo === Run Shell Scripts (.sh) ===
dir /s /b ..\..\run*.sh
echo.

echo === Run JavaScript Files (.js) ===
dir /s /b ..\..\run*.js
echo.

echo === Validation Files ===
dir /s /b ..\..\*validation*.js ..\..\*validation*.ts
echo.

echo Done!