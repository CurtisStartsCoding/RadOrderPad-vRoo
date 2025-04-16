@echo off
echo Listing all database tables with detailed information...
node debug-scripts/list_all_database_tables_detailed.js > database-tables-detailed-report.txt
echo Report saved to database-tables-detailed-report.txt
pause