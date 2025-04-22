# Scripts Guide

This document provides an overview of all the scripts in the project, organized by directory, to help you quickly find the right script for your needs.

## Frontend-Related Scripts

### Location: `frontend-explanation/debug-scripts/`

These scripts are related to frontend testing, debugging, and validation:

| Script | Description |
|--------|-------------|
| `test-update-patient-info.js` | Tests the patient information update functionality |
| `test-db-connection.js` | Tests the database connection for frontend operations |
| `test-organization-relationships.js` | Tests organization relationship functionality |
| `update-order-organizations.js` | Updates order organizations in the database |
| `test-update-and-send.js` | Tests the update patient info and send to radiology workflow |
| `run-precision-tests.bat/sh` | Runs precision tests for the frontend |
| `run-db-test.bat/sh` | Runs database connection tests |
| `run-all-debug-tests.bat/sh` | Runs all frontend debug tests |
| `query-admin-staff-users.js` | Queries admin staff users from the database |
| `test-admin-endpoint.js` | Tests the admin endpoints |

### Location: `frontend-explanation/`

| Script | Description |
|--------|-------------|
| `admin-finalization-test.js` | Tests the complete admin finalization workflow |
| `run-admin-finalization-test.bat` | Runs the admin finalization test |
| `check-order-status.js` | Checks the status of orders in the database |
| `check-order-status.bat` | Runs the order status check script |
| `pidn-validation-test.js` | Tests the Patient Identifier Number (PIDN) validation workflow |
| `run-pidn-validation-test.bat/sh` | Runs the PIDN validation test |

## API Test Scripts

### Location: `scripts/api-tests/`

| Script | Description |
|--------|-------------|
| `test-api.js` | Basic API testing script |
| `test-api-with-auth.js` | Tests API endpoints with authentication |
| `comprehensive-api-test.js` | Comprehensive test of all API endpoints |
| `test-superadmin-api.bat` | Tests superadmin API endpoints |
| `test-superadmin-api-with-token.bat` | Tests superadmin API with authentication token |
| `test-stripe-webhook-unit.bat` | Tests Stripe webhook unit functionality |
| `test-stripe-webhooks-cli.bat` | Tests Stripe webhooks using CLI |

## Database Tools

### Location: `scripts/db-tools/`

| Script | Description |
|--------|-------------|
| `test-db-connection.js` | Tests database connection |
| `test-db-data.js` | Tests database data operations |
| `test-new-db-connection.js` | Tests new database connection configuration |
| `update-vercel-db-ssl.js` | Updates Vercel database SSL settings |
| `update-vercel-db-ssl.bat` | Runs the Vercel database SSL update script |
| `test-db-connection-ssl.js` | Tests database connection with SSL |
| `test-db-connection-ssl.bat` | Runs the database SSL connection test |
| `run-sql-script.bat` | Runs SQL scripts against the database |
| `migrate-database-data.bat` | Migrates data between databases |
| `create-public-rds.bat` | Creates a public RDS instance |

## Deployment Scripts

### Location: `scripts/deployment/`

| Script | Description |
|--------|-------------|
| `test-and-deploy-fixed-implementation.bat` | Tests and deploys the fixed implementation |
| `test-fixed-implementation-locally.bat` | Tests the fixed implementation locally |
| `run-test-fixed-implementation-production.bat` | Tests the fixed implementation in production |
| `create-deployment-package.bat` | Creates a deployment package |
| `deploy-to-aws.bat` | Deploys the application to AWS |
| `create-vercel-package-silent.bat` | Creates a Vercel deployment package silently |
| `vercel-setup.js` | Sets up Vercel deployment configuration |
| `silent-deploy.ps1` | Deploys silently using PowerShell |
| `test-hipaa-export.bat` | Tests HIPAA data export functionality |
| `test-radiology-export.bat` | Tests radiology data export functionality |

## Validation and Prompt-Related Scripts

### Location: `scripts/validation/`

| Script | Description |
|--------|-------------|
| `test-validation-engine.js` | Tests the validation engine |
| `test-validation-engine-updated.js` | Tests the updated validation engine |
| `test-comprehensive-prompt.js` | Tests comprehensive prompt handling |
| `test-direct-prompt.js` | Tests direct prompt handling |
| `test-grok-direct.js` | Tests direct Grok model integration |
| `test-grok-fallback.js` | Tests Grok fallback functionality |
| `test-gpt-fallback.js` | Tests GPT fallback functionality |
| `test-force-grok-fallback.js` | Tests forced Grok fallback scenarios |
| `test-grok-models.js` | Tests various Grok models |
| `test-all-cases-optimized.js` | Tests all optimized validation cases |
| `test-token-optimization.js` | Tests token optimization strategies |
| `compare_prompts.js` | Compares different prompt strategies |
| `run_compare_prompts.bat` | Runs prompt comparison tests |
| `run_insert_optimized_prompt.bat` | Inserts optimized prompts into the system |
| `run_update_optimized_prompt.bat` | Updates optimized prompts in the system |
| `run-redis-search-with-fallback-test-fixed-cjs.bat` | Tests Redis search with fallback (CJS version) |
| `run-redis-search-with-fallback-test-fixed.bat` | Tests Redis search with fallback |
| `query-prompt-template.js` | Queries prompt templates for validation |
| `run-query-prompt-template.bat` | Runs the prompt template query script |

## Environment and Configuration Scripts

### Location: `scripts/env-config/`

| Script | Description |
|--------|-------------|
| `add-env-vars-noninteractive.bat` | Adds environment variables non-interactively |
| `add-essential-env-vars.bat` | Adds essential environment variables |
| `remove-all-env-vars-noninteractive.bat` | Removes all environment variables non-interactively |
| `remove-all-env-vars.bat` | Removes all environment variables |
| `remove-and-add-env-vars.ps1` | Removes and adds environment variables using PowerShell |
| `reset-vercel-env-vars.bat` | Resets Vercel environment variables |
| `delete-vercel-env-vars.bat` | Deletes Vercel environment variables |
| `save-environment-details.bat` | Saves environment details to a file |

## Utility Scripts

### Location: `scripts/utilities/`

| Script | Description |
|--------|-------------|
| `generate-superadmin-token.js` | Generates a superadmin authentication token |
| `generate-test-token.js` | Generates a test authentication token |
| `test-config.js` | Tests configuration settings |
| `add-js-extensions-to-imports.js` | Adds JS extensions to import statements |
| `find-imports-without-extensions.js` | Finds import statements without extensions |
| `organize-root-directory.js` | Organizes files in the root directory |
| `organize-test-scripts.bat` | Organizes test scripts |
| `organize-recent-scripts.bat` | Organizes recently created scripts |
| `setup-github.js` | Sets up GitHub integration |
| `setup-github.bat` | Runs GitHub setup script |
| `start-server.bat` | Starts the application server |
| `run-all-tests.bat` | Runs all tests |
| `consolidate-test-results.js` | Consolidates test results |
| `consolidate-test-results.bat` | Runs test result consolidation |
| `consolidate-optimized-prompt-results.bat` | Consolidates optimized prompt results |
| `add-testing-docs.bat` | Adds testing documentation |
| `commit-testing-improvements.bat` | Commits testing improvements to version control |
| `find-recent-changes.ps1` | Finds recent file changes using PowerShell |
| `run_update_field_names.bat` | Updates field names in the database |
| `migrate-from-docker.bat` | Migrates the application from Docker |

## Stripe-Related Scripts

### Location: `scripts/stripe/`

| Script | Description |
|--------|-------------|
| `test-webhook-handlers.js` | Tests Stripe webhook handlers with mock implementations |
| `run-test-webhook-handlers.bat` | Windows batch script to run the webhook handlers test |
| `run-test-webhook-handlers.sh` | Unix/Linux/macOS shell script to run the webhook handlers test |

## Organization Scripts

### Location: Root Directory

| Script | Description |
|--------|-------------|
| `cleanup-redundant-scripts.bat` | Removes redundant scripts from the project |
| `organize-all-scripts.bat` | Organizes all scripts into appropriate directories |
| `move-debug-scripts.bat/sh` | Moves debug scripts to the appropriate directory |
| `deploy-to-vercel-silent.bat/sh` | Deploys to Vercel silently without verbose output |
| `move-admin-fix-scripts.bat` | Moves admin fix scripts to the appropriate directory |

## How to Use This Guide

1. Identify the category of task you need to perform (frontend testing, API testing, database operations, deployment, etc.)
2. Look for the appropriate script in the corresponding section
3. Navigate to the directory where the script is located
4. Run the script using the appropriate command (e.g., `node script.js` or `.\script.bat`)

For batch files (.bat), run them directly from the command line:
```
.\script-name.bat
```

For JavaScript files (.js), run them using Node.js:
```
node script-name.js
```

For shell scripts (.sh), run them using Bash:
```
bash script-name.sh