@echo off
echo Organizing all scripts into appropriate directories...
echo.

REM Create directories if they don't exist
if not exist "frontend-explanation\debug-scripts" mkdir "frontend-explanation\debug-scripts"
if not exist "scripts\api-tests" mkdir "scripts\api-tests"
if not exist "scripts\db-tools" mkdir "scripts\db-tools"
if not exist "scripts\deployment" mkdir "scripts\deployment"
if not exist "scripts\validation" mkdir "scripts\validation"
if not exist "scripts\env-config" mkdir "scripts\env-config"
if not exist "scripts\utilities" mkdir "scripts\utilities"

echo.
echo Moving frontend-related scripts to frontend-explanation/debug-scripts:
echo.

REM Frontend-related scripts
if exist "query-admin-staff-users.js" (
    move "query-admin-staff-users.js" "frontend-explanation\debug-scripts\"
    echo - Moved query-admin-staff-users.js
)

if exist "test-admin-endpoint.js" (
    move "test-admin-endpoint.js" "frontend-explanation\debug-scripts\"
    echo - Moved test-admin-endpoint.js
)

echo.
echo Moving API test scripts to scripts/api-tests:
echo.

REM API test scripts
if exist "test-api.js" (
    move "test-api.js" "scripts\api-tests\"
    echo - Moved test-api.js
)

if exist "test-api-with-auth.js" (
    move "test-api-with-auth.js" "scripts\api-tests\"
    echo - Moved test-api-with-auth.js
)

if exist "comprehensive-api-test.js" (
    move "comprehensive-api-test.js" "scripts\api-tests\"
    echo - Moved comprehensive-api-test.js
)

if exist "test-superadmin-api.bat" (
    move "test-superadmin-api.bat" "scripts\api-tests\"
    echo - Moved test-superadmin-api.bat
)

if exist "test-superadmin-api-with-token.bat" (
    move "test-superadmin-api-with-token.bat" "scripts\api-tests\"
    echo - Moved test-superadmin-api-with-token.bat
)

if exist "test-stripe-webhook-unit.bat" (
    move "test-stripe-webhook-unit.bat" "scripts\api-tests\"
    echo - Moved test-stripe-webhook-unit.bat
)

if exist "test-stripe-webhooks-cli.bat" (
    move "test-stripe-webhooks-cli.bat" "scripts\api-tests\"
    echo - Moved test-stripe-webhooks-cli.bat
)

echo.
echo Moving database-related scripts to scripts/db-tools:
echo.

REM Database-related scripts
if exist "test-db-connection.js" (
    move "test-db-connection.js" "scripts\db-tools\"
    echo - Moved test-db-connection.js
)

if exist "test-db-data.js" (
    move "test-db-data.js" "scripts\db-tools\"
    echo - Moved test-db-data.js
)

if exist "test-new-db-connection.js" (
    move "test-new-db-connection.js" "scripts\db-tools\"
    echo - Moved test-new-db-connection.js
)

if exist "update-vercel-db-ssl.js" (
    move "update-vercel-db-ssl.js" "scripts\db-tools\"
    echo - Moved update-vercel-db-ssl.js
)

if exist "update-vercel-db-ssl.bat" (
    move "update-vercel-db-ssl.bat" "scripts\db-tools\"
    echo - Moved update-vercel-db-ssl.bat
)

if exist "test-db-connection-ssl.js" (
    move "test-db-connection-ssl.js" "scripts\db-tools\"
    echo - Moved test-db-connection-ssl.js
)

if exist "test-db-connection-ssl.bat" (
    move "test-db-connection-ssl.bat" "scripts\db-tools\"
    echo - Moved test-db-connection-ssl.bat
)

if exist "run-sql-script.bat" (
    move "run-sql-script.bat" "scripts\db-tools\"
    echo - Moved run-sql-script.bat
)

if exist "migrate-database-data.bat" (
    move "migrate-database-data.bat" "scripts\db-tools\"
    echo - Moved migrate-database-data.bat
)

if exist "create-public-rds.bat" (
    move "create-public-rds.bat" "scripts\db-tools\"
    echo - Moved create-public-rds.bat
)

echo.
echo Moving deployment-related scripts to scripts/deployment:
echo.

REM Deployment-related scripts
if exist "test-and-deploy-fixed-implementation.bat" (
    move "test-and-deploy-fixed-implementation.bat" "scripts\deployment\"
    echo - Moved test-and-deploy-fixed-implementation.bat
)

if exist "test-fixed-implementation-locally.bat" (
    move "test-fixed-implementation-locally.bat" "scripts\deployment\"
    echo - Moved test-fixed-implementation-locally.bat
)

if exist "run-test-fixed-implementation-production.bat" (
    move "run-test-fixed-implementation-production.bat" "scripts\deployment\"
    echo - Moved run-test-fixed-implementation-production.bat
)

if exist "create-deployment-package.bat" (
    move "create-deployment-package.bat" "scripts\deployment\"
    echo - Moved create-deployment-package.bat
)

if exist "deploy-to-aws.bat" (
    move "deploy-to-aws.bat" "scripts\deployment\"
    echo - Moved deploy-to-aws.bat
)

if exist "create-vercel-package-silent.bat" (
    move "create-vercel-package-silent.bat" "scripts\deployment\"
    echo - Moved create-vercel-package-silent.bat
)

if exist "vercel-setup.js" (
    move "vercel-setup.js" "scripts\deployment\"
    echo - Moved vercel-setup.js
)

if exist "silent-deploy.ps1" (
    move "silent-deploy.ps1" "scripts\deployment\"
    echo - Moved silent-deploy.ps1
)

if exist "test-hipaa-export.bat" (
    move "test-hipaa-export.bat" "scripts\deployment\"
    echo - Moved test-hipaa-export.bat
)

if exist "test-radiology-export.bat" (
    move "test-radiology-export.bat" "scripts\deployment\"
    echo - Moved test-radiology-export.bat
)

echo.
echo Moving validation and prompt-related scripts to scripts/validation:
echo.

REM Validation and prompt-related scripts
if exist "test-validation-engine.js" (
    move "test-validation-engine.js" "scripts\validation\"
    echo - Moved test-validation-engine.js
)

if exist "test-validation-engine-updated.js" (
    move "test-validation-engine-updated.js" "scripts\validation\"
    echo - Moved test-validation-engine-updated.js
)

if exist "test-comprehensive-prompt.js" (
    move "test-comprehensive-prompt.js" "scripts\validation\"
    echo - Moved test-comprehensive-prompt.js
)

if exist "test-direct-prompt.js" (
    move "test-direct-prompt.js" "scripts\validation\"
    echo - Moved test-direct-prompt.js
)

if exist "test-grok-direct.js" (
    move "test-grok-direct.js" "scripts\validation\"
    echo - Moved test-grok-direct.js
)

if exist "test-grok-fallback.js" (
    move "test-grok-fallback.js" "scripts\validation\"
    echo - Moved test-grok-fallback.js
)

if exist "test-gpt-fallback.js" (
    move "test-gpt-fallback.js" "scripts\validation\"
    echo - Moved test-gpt-fallback.js
)

if exist "test-force-grok-fallback.js" (
    move "test-force-grok-fallback.js" "scripts\validation\"
    echo - Moved test-force-grok-fallback.js
)

if exist "test-grok-models.js" (
    move "test-grok-models.js" "scripts\validation\"
    echo - Moved test-grok-models.js
)

if exist "test-all-cases-optimized.js" (
    move "test-all-cases-optimized.js" "scripts\validation\"
    echo - Moved test-all-cases-optimized.js
)

if exist "test-token-optimization.js" (
    move "test-token-optimization.js" "scripts\validation\"
    echo - Moved test-token-optimization.js
)

if exist "compare_prompts.js" (
    move "compare_prompts.js" "scripts\validation\"
    echo - Moved compare_prompts.js
)

if exist "run_compare_prompts.bat" (
    move "run_compare_prompts.bat" "scripts\validation\"
    echo - Moved run_compare_prompts.bat
)

if exist "run_insert_optimized_prompt.bat" (
    move "run_insert_optimized_prompt.bat" "scripts\validation\"
    echo - Moved run_insert_optimized_prompt.bat
)

if exist "run_update_optimized_prompt.bat" (
    move "run_update_optimized_prompt.bat" "scripts\validation\"
    echo - Moved run_update_optimized_prompt.bat
)

if exist "run-redis-search-with-fallback-test-fixed-cjs.bat" (
    move "run-redis-search-with-fallback-test-fixed-cjs.bat" "scripts\validation\"
    echo - Moved run-redis-search-with-fallback-test-fixed-cjs.bat
)

if exist "run-redis-search-with-fallback-test-fixed.bat" (
    move "run-redis-search-with-fallback-test-fixed.bat" "scripts\validation\"
    echo - Moved run-redis-search-with-fallback-test-fixed.bat
)

if exist "run-query-prompt-template.bat" (
    move "run-query-prompt-template.bat" "scripts\validation\"
    echo - Moved run-query-prompt-template.bat
)

if exist "query-prompt-template.js" (
    move "query-prompt-template.js" "scripts\validation\"
    echo - Moved query-prompt-template.js
)

echo.
echo Moving environment and configuration scripts to scripts/env-config:
echo.

REM Environment and configuration scripts
if exist "add-env-vars-noninteractive.bat" (
    move "add-env-vars-noninteractive.bat" "scripts\env-config\"
    echo - Moved add-env-vars-noninteractive.bat
)

if exist "add-essential-env-vars.bat" (
    move "add-essential-env-vars.bat" "scripts\env-config\"
    echo - Moved add-essential-env-vars.bat
)

if exist "remove-all-env-vars-noninteractive.bat" (
    move "remove-all-env-vars-noninteractive.bat" "scripts\env-config\"
    echo - Moved remove-all-env-vars-noninteractive.bat
)

if exist "remove-all-env-vars.bat" (
    move "remove-all-env-vars.bat" "scripts\env-config\"
    echo - Moved remove-all-env-vars.bat
)

if exist "remove-and-add-env-vars.ps1" (
    move "remove-and-add-env-vars.ps1" "scripts\env-config\"
    echo - Moved remove-and-add-env-vars.ps1
)

if exist "reset-vercel-env-vars.bat" (
    move "reset-vercel-env-vars.bat" "scripts\env-config\"
    echo - Moved reset-vercel-env-vars.bat
)

if exist "delete-vercel-env-vars.bat" (
    move "delete-vercel-env-vars.bat" "scripts\env-config\"
    echo - Moved delete-vercel-env-vars.bat
)

if exist "save-environment-details.bat" (
    move "save-environment-details.bat" "scripts\env-config\"
    echo - Moved save-environment-details.bat
)

echo.
echo Moving utility scripts to scripts/utilities:
echo.

REM Utility scripts
if exist "generate-superadmin-token.js" (
    move "generate-superadmin-token.js" "scripts\utilities\"
    echo - Moved generate-superadmin-token.js
)

if exist "generate-test-token.js" (
    move "generate-test-token.js" "scripts\utilities\"
    echo - Moved generate-test-token.js
)

if exist "test-config.js" (
    move "test-config.js" "scripts\utilities\"
    echo - Moved test-config.js
)

if exist "add-js-extensions-to-imports.js" (
    move "add-js-extensions-to-imports.js" "scripts\utilities\"
    echo - Moved add-js-extensions-to-imports.js
)

if exist "find-imports-without-extensions.js" (
    move "find-imports-without-extensions.js" "scripts\utilities\"
    echo - Moved find-imports-without-extensions.js
)

if exist "organize-root-directory.js" (
    move "organize-root-directory.js" "scripts\utilities\"
    echo - Moved organize-root-directory.js
)

if exist "organize-test-scripts.bat" (
    move "organize-test-scripts.bat" "scripts\utilities\"
    echo - Moved organize-test-scripts.bat
)

if exist "organize-recent-scripts.bat" (
    move "organize-recent-scripts.bat" "scripts\utilities\"
    echo - Moved organize-recent-scripts.bat
)

if exist "setup-github.js" (
    move "setup-github.js" "scripts\utilities\"
    echo - Moved setup-github.js
)

if exist "setup-github.bat" (
    move "setup-github.bat" "scripts\utilities\"
    echo - Moved setup-github.bat
)

if exist "start-server.bat" (
    move "start-server.bat" "scripts\utilities\"
    echo - Moved start-server.bat
)

if exist "run-all-tests.bat" (
    move "run-all-tests.bat" "scripts\utilities\"
    echo - Moved run-all-tests.bat
)

if exist "consolidate-test-results.js" (
    move "consolidate-test-results.js" "scripts\utilities\"
    echo - Moved consolidate-test-results.js
)

if exist "consolidate-test-results.bat" (
    move "consolidate-test-results.bat" "scripts\utilities\"
    echo - Moved consolidate-test-results.bat
)

if exist "consolidate-optimized-prompt-results.bat" (
    move "consolidate-optimized-prompt-results.bat" "scripts\utilities\"
    echo - Moved consolidate-optimized-prompt-results.bat
)

if exist "add-testing-docs.bat" (
    move "add-testing-docs.bat" "scripts\utilities\"
    echo - Moved add-testing-docs.bat
)

if exist "commit-testing-improvements.bat" (
    move "commit-testing-improvements.bat" "scripts\utilities\"
    echo - Moved commit-testing-improvements.bat
)

if exist "find-recent-changes.ps1" (
    move "find-recent-changes.ps1" "scripts\utilities\"
    echo - Moved find-recent-changes.ps1
)

if exist "run_update_field_names.bat" (
    move "run_update_field_names.bat" "scripts\utilities\"
    echo - Moved run_update_field_names.bat
)

if exist "migrate-from-docker.bat" (
    move "migrate-from-docker.bat" "scripts\utilities\"
    echo - Moved migrate-from-docker.bat
)

echo.
echo Organization complete!
echo.
echo Now updating SCRIPTS_GUIDE.md with the new organization...
echo.
pause