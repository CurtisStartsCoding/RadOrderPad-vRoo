@echo off
echo Moving superadmin files to archive...

REM Create necessary directories in the archive
mkdir docs-consolidated\archive\superadmin\frontend-explanation\API_IMPLEMENTATION_GUIDE 2>nul
mkdir docs-consolidated\archive\superadmin\DOCS 2>nul
mkdir docs-consolidated\archive\superadmin\frontend-explanation\api-docs\tutorials\superadmin 2>nul
mkdir docs-consolidated\archive\superadmin\frontend-explanation\api-docs\openapi\paths 2>nul

REM Move API_IMPLEMENTATION_GUIDE files
echo Moving frontend-explanation\API_IMPLEMENTATION_GUIDE\superadmin_feature.yaml...
move frontend-explanation\API_IMPLEMENTATION_GUIDE\superadmin_feature.yaml docs-consolidated\archive\superadmin\frontend-explanation\API_IMPLEMENTATION_GUIDE\

echo Moving frontend-explanation\API_IMPLEMENTATION_GUIDE\superadmin-logs.md...
move frontend-explanation\API_IMPLEMENTATION_GUIDE\superadmin-logs.md docs-consolidated\archive\superadmin\frontend-explanation\API_IMPLEMENTATION_GUIDE\

echo Moving frontend-explanation\API_IMPLEMENTATION_GUIDE\superadmin-management.md...
move frontend-explanation\API_IMPLEMENTATION_GUIDE\superadmin-management.md docs-consolidated\archive\superadmin\frontend-explanation\API_IMPLEMENTATION_GUIDE\

REM Move DOCS files
echo Moving DOCS\super_admin.md...
move DOCS\super_admin.md docs-consolidated\archive\superadmin\DOCS\

REM Move tutorial files
echo Moving frontend-explanation\api-docs\tutorials\superadmin\organization-management.md...
move frontend-explanation\api-docs\tutorials\superadmin\organization-management.md docs-consolidated\archive\superadmin\frontend-explanation\api-docs\tutorials\superadmin\

echo Moving frontend-explanation\api-docs\tutorials\superadmin\user-management.md...
move frontend-explanation\api-docs\tutorials\superadmin\user-management.md docs-consolidated\archive\superadmin\frontend-explanation\api-docs\tutorials\superadmin\ 2>nul

echo Moving frontend-explanation\api-docs\tutorials\superadmin\system-monitoring.md...
move frontend-explanation\api-docs\tutorials\superadmin\system-monitoring.md docs-consolidated\archive\superadmin\frontend-explanation\api-docs\tutorials\superadmin\

echo Moving frontend-explanation\api-docs\tutorials\superadmin\prompt-management.md...
move frontend-explanation\api-docs\tutorials\superadmin\prompt-management.md docs-consolidated\archive\superadmin\frontend-explanation\api-docs\tutorials\superadmin\ 2>nul

REM Move OpenAPI files
echo Moving frontend-explanation\api-docs\openapi\paths\superadmin.yaml...
move frontend-explanation\api-docs\openapi\paths\superadmin.yaml docs-consolidated\archive\superadmin\frontend-explanation\api-docs\openapi\paths\

echo Superadmin files have been moved to the archive.
echo Please refer to the consolidated documentation in docs-consolidated\superadmin\ for the most up-to-date information.