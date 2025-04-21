@echo off
echo Moving admin finalization fix scripts to frontend-explanation\debug-scripts\admin-finalization-fix...

REM Create the directory if it doesn't exist
if not exist "frontend-explanation\debug-scripts\admin-finalization-fix" mkdir "frontend-explanation\debug-scripts\admin-finalization-fix"

REM Copy all the files
copy create-deployment-zip-manual.bat frontend-explanation\debug-scripts\admin-finalization-fix\
copy create-deployment-zip-manual.sh frontend-explanation\debug-scripts\admin-finalization-fix\
copy deploy-manual-zip.bat frontend-explanation\debug-scripts\admin-finalization-fix\
copy deploy-manual-zip.sh frontend-explanation\debug-scripts\admin-finalization-fix\
copy test-fixed-implementation-production.js frontend-explanation\debug-scripts\admin-finalization-fix\
copy run-test-fixed-implementation-production.bat frontend-explanation\debug-scripts\admin-finalization-fix\
copy run-test-fixed-implementation-production.sh frontend-explanation\debug-scripts\admin-finalization-fix\
copy ADMIN_FINALIZATION_FIX_GUIDE.md frontend-explanation\debug-scripts\admin-finalization-fix\
copy test-send-to-radiology-fixed.js frontend-explanation\debug-scripts\admin-finalization-fix\
copy test-and-deploy-fixed-implementation.bat frontend-explanation\debug-scripts\admin-finalization-fix\
copy test-and-deploy-fixed-implementation.sh frontend-explanation\debug-scripts\admin-finalization-fix\
copy test-fixed-implementation-locally.bat frontend-explanation\debug-scripts\admin-finalization-fix\
copy test-fixed-implementation-locally.sh frontend-explanation\debug-scripts\admin-finalization-fix\

echo Files copied successfully.

REM Delete the original files
echo Deleting original files...
del create-deployment-zip-manual.bat
del create-deployment-zip-manual.sh
del deploy-manual-zip.bat
del deploy-manual-zip.sh
del test-fixed-implementation-production.js
del run-test-fixed-implementation-production.bat
del run-test-fixed-implementation-production.sh
del ADMIN_FINALIZATION_FIX_GUIDE.md
del test-send-to-radiology-fixed.js
del test-and-deploy-fixed-implementation.bat
del test-and-deploy-fixed-implementation.sh
del test-fixed-implementation-locally.bat
del test-fixed-implementation-locally.sh

echo Original files deleted.
echo All admin finalization fix scripts have been moved to frontend-explanation\debug-scripts\admin-finalization-fix.

pause