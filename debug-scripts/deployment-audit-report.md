# Deployment Configuration Audit Report

## Summary

- Total files scanned: 1007
- Files with matches: 226
- Total matches found: 1351

## Results by Pattern

### Port 3000 reference (87 matches)

| File | Line | Content |
| ---- | ---- | ------- |
| debug-scripts\audit-deployment-config.js | 19 | `{ pattern: '3000', description: 'Port 3000 reference' },` |
| debug-scripts\audit-deployment-config.js | 177 | `if (results.byPattern['3000']?.matches.length > 0) {` |
| debug-scripts\check-server-status.js | 2 | `* Script to check if the server is running on port 3000` |
| debug-scripts\check-server-status.js | 147 | `const port = 3000;` |
| debug-scripts\find-api-server.js | 16 | `// For Windows, use netstat to find processes listening on port 3000` |
| debug-scripts\find-api-server.js | 17 | `command = 'netstat -ano \| findstr :3000';` |
| debug-scripts\find-api-server.js | 19 | `// For Unix-like systems, use lsof to find processes listening on port 3000` |
| debug-scripts\find-api-server.js | 20 | `command = 'lsof -i :3000';` |
| debug-scripts\find-api-server.js | 26 | `console.log('No processes found listening on port 3000');` |
| debug-scripts\find-api-server.js | 125 | `console.log('Looking for API server processes (listening on port 3000)...');` |
| debug-scripts\find-api-server.js | 129 | `console.log('No API server processes found listening on port 3000');` |
| debug-scripts\find-api-server.js | 131 | `console.log(`Found ${pids.length} process(es) listening on port 3000:`);` |
| debug-scripts\test-concurrent-orders.js | 9 | `const PORT = 3000;` |
| debug-scripts\test-concurrent-orders.js | 82 | `timeout: 30000 // 30 second timeout` |
| debug-scripts\test-validation-endpoint-direct.js | 8 | `const PORT = 3000;` |
| debug-scripts\test-validation-endpoint-direct.js | 54 | `timeout: 30000 // 30 second timeout` |
| deployment\package-lock.json | 4280 | `"caniuse-lite": "^1.0.30001688",` |
| deployment\package-lock.json | 4375 | `"version": "1.0.30001713",` |
| deployment\package-lock.json | 4376 | `"resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001713.tgz",` |
| package-lock.json | 4280 | `"caniuse-lite": "^1.0.30001688",` |
| package-lock.json | 4375 | `"version": "1.0.30001713",` |
| package-lock.json | 4376 | `"resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001713.tgz",` |
| scripts\test-validation-engine-with-fallback.js | 14 | `const API_URL = 'http://localhost:3000';` |
| src\config\config.ts | 8 | `port: process.env.PORT \|\| 3000,` |
| src\config\config.ts | 69 | `timeout: parseInt(process.env.LLM_TIMEOUT \|\| '30000') // 30 seconds` |
| test-comprehensive-prompt.js | 12 | `const API_BASE_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000';` |
| test-config.js | 8 | `baseUrl: process.env.API_BASE_URL \|\| 'http://localhost:3000/api',` |
| test-radiology-export.bat | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| test-radiology-export.bat | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| test-radiology-export.sh | 15 | `echo "WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api"` |
| test-radiology-export.sh | 16 | `API_BASE_URL="http://localhost:3000/api"` |
| test-stripe-webhooks-cli.bat | 17 | `curl -s http://localhost:3000/api/health >nul 2>nul` |
| test-stripe-webhooks-cli.bat | 36 | `start "Stripe Webhook Listener" cmd /c "stripe listen --forward-to http://localhost:3000/api/webhooks/stripe"` |
| test-stripe-webhooks-cli.bat | 78 | `echo 5. Enter your webhook endpoint URL: http://localhost:3000/api/webhooks/stripe` |
| test-stripe-webhooks-cli.sh | 16 | `if ! curl -s http://localhost:3000/api/health &> /dev/null; then` |
| test-stripe-webhooks-cli.sh | 35 | `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe &` |
| test-stripe-webhooks-cli.sh | 78 | `echo "5. Enter your webhook endpoint URL: http://localhost:3000/api/webhooks/stripe"` |
| test-superadmin-api-with-token.bat | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| test-superadmin-api-with-token.bat | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| test-superadmin-api.bat | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| test-superadmin-api.bat | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| test-superadmin-api.sh | 15 | `echo "WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api"` |
| test-superadmin-api.sh | 16 | `API_BASE_URL="http://localhost:3000/api"` |
| tests\batch\run-validation-tests.bat | 20 | `set API_BASE_URL=http://localhost:3000/api` |
| tests\batch\run-validation-tests.sh | 19 | `export API_BASE_URL=http://localhost:3000/api` |
| tests\batch\superadmin\test-superadmin-logs.bat | 5 | `set API_URL=http://localhost:3000` |
| tests\batch\superadmin\test-superadmin-logs.sh | 5 | `API_URL="http://localhost:3000"` |
| tests\batch\superadmin\test-superadmin-prompt-assignments.bat | 5 | `set API_URL=http://localhost:3000` |
| tests\batch\superadmin\test-superadmin-prompt-assignments.sh | 5 | `API_URL="http://localhost:3000"` |
| tests\batch\superadmin\test-superadmin-prompts.bat | 5 | `set API_URL=http://localhost:3000` |
| tests\batch\test-admin-finalization-debug.bat | 32 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-summary" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}"` |
| tests\batch\test-admin-finalization-debug.bat | 33 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-summary" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}"` |
| tests\batch\test-admin-finalization-debug.bat | 44 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-supplemental" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}"` |
| tests\batch\test-admin-finalization-debug.bat | 45 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-supplemental" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}"` |
| tests\batch\test-admin-finalization-debug.bat | 66 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/send-to-radiology" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}"` |
| tests\batch\test-admin-finalization-debug.bat | 67 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/send-to-radiology" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}"` |
| tests\batch\test-stripe-webhook-handlers.js | 20 | `const API_URL = process.env.API_URL \|\| 'http://localhost:3000';` |
| tests\batch\test-superadmin-api.js | 11 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| tests\batch\test-superadmin-logs.bat | 5 | `set API_URL=http://localhost:3000` |
| tests\batch\test-superadmin-logs.sh | 5 | `API_URL="http://localhost:3000"` |
| tests\batch\test-superadmin-prompt-assignments.bat | 5 | `set API_URL=http://localhost:3000` |
| tests\batch\test-superadmin-prompt-assignments.sh | 5 | `API_URL="http://localhost:3000"` |
| tests\billing-checkout.test.js | 5 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| tests\clinical-workflow-simulation.js | 245 | `timeout: 30000` |
| tests\clinical-workflow-simulation.js | 333 | `timeout: 30000` |
| tests\e2e\run_comprehensive_tests.js | 15 | `const API_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000/api';` |
| tests\e2e\test-helpers-fixed-a.js | 290 | `{ action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },` |
| tests\e2e\test-helpers-fixed-b.js | 366 | `{ action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },` |
| tests\e2e\test-helpers-fixed-c.js | 484 | `{ action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },` |
| tests\e2e\test-helpers-fixed-d.js | 301 | `{ action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },` |
| tests\e2e\test-helpers-fixed-d.js | 502 | `{ action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },` |
| tests\e2e\test-helpers-fixed.js | 700 | `{ action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },` |
| tests\e2e\test-helpers-improved.js | 848 | `{ action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },` |
| tests\e2e\test-helpers-simple.js | 289 | `{ action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },` |
| tests\e2e\test-helpers.js | 336 | `{ action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },` |
| tests\file-upload-test.js | 7 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| tests\file-upload.test.js | 6 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| tests\file-upload.test.js | 94 | `fileSize: 30000000, // 30MB (assuming 20MB limit for PDFs)` |
| tests\llm-validation-flow-test.js | 201 | `timeout: 30000` |
| tests\llm-validation-flow-test.js | 294 | `timeout: 30000` |
| tests\stripe-webhooks.test.js | 16 | `const API_BASE_URL = (process.env.API_BASE_URL \|\| helpers.config.api.baseUrl \|\| 'http://localhost:3000').replace(/\/api$/, '');` |
| tests\test-redis-search-with-fallback-fix-updated.js | 50 | `'http://localhost:3000/api/orders/validate',` |
| tests\test-redis-search-with-fallback-fix-updated.js | 96 | `'http://localhost:3000/api/orders/validate',` |
| tests\test-redis-search-with-fallback-fix.js | 50 | `'http://localhost:3000/api/orders/validate',` |
| tests\test-redis-search-with-fallback-fix.js | 97 | `'http://localhost:3000/api/orders/validate',` |
| tests\test-redis-search-with-fallback.js | 45 | `const baseUrl = process.env.API_URL \|\| 'http://localhost:3000';` |
| tests\test-redis-search.js | 30 | `const baseUrl = process.env.API_URL \|\| 'http://localhost:3000';` |

### Localhost reference (186 matches)

| File | Line | Content |
| ---- | ---- | ------- |
| compare_prompts.js | 12 | `host: process.env.DB_HOST \|\| 'localhost',` |
| debug-scripts\activate-comprehensive-prompt.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\activate-lean-template.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\add-test-medical-data.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\add-word-limit-to-prompt-16.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\analyze-database-tables.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\analyze_duplicates_and_retired_codes.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\audit-deployment-config.js | 16 | `{ pattern: 'localhost', description: 'Localhost reference' },` |
| debug-scripts\audit-deployment-config.js | 168 | `if (results.byPattern['localhost']?.matches.length > 0 \|\|` |
| debug-scripts\audit-deployment-config.js | 170 | `markdown += `- **Replace hardcoded localhost references** with environment variables or configuration settings\n`;` |
| debug-scripts\check-all-prompts.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-database-connection.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-existing-medical-data.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-j18-9-in-database.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-last-successful-test.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-llm-validation-logs.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-phi-database.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-phi-timestamps.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-phi-validation-details.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-prompt-content.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-prompt-template-dependencies.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-recent-modifications.js | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-recent-validation-logs.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-server-status.js | 11 | `host: 'localhost',` |
| debug-scripts\check-specialty-configurations.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-specialty-table.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-timestamp-handling.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-word-limit.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check_db_connection.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\clean-up-prompt-template.js | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\clean_and_prepare_database.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\create-hybrid-prompt.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\database-interaction-test.js | 17 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\debug-csv-export.js | 21 | `host: process.env.DB_HOST \|\| 'localhost',` |
| debug-scripts\enhanced-test-additional-notes.js | 24 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\enhanced-test-complex-specialty.js | 17 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\fix-order-number-duplicates.js | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\fix-prompt-template.js | 13 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\fixed-multi-llm-personality-test.js | 23 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\fixed-peer-to-self-prompt.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\fix_and_import_mappings.js | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\fix_and_import_sql.js | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\fix_sql_syntax_and_import.js | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\generate_fix_duplicates_sql.js | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\get-full-prompt-content.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\get-lean-template.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\get-prompt-by-id.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\get-prompts-14-and-16.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_all_medical_data_properly.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_cpt_codes_only.bat | 41 | `if "!DB_HOST!"=="" set DB_HOST=localhost` |
| debug-scripts\import_cpt_codes_only.js | 155 | `if "!DB_HOST!"=="" set DB_HOST=localhost` |
| debug-scripts\import_cpt_codes_upsert.js | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_cpt_codes_upsert.js | 157 | `set DB_HOST=localhost` |
| debug-scripts\import_cpt_codes_with_password.bat | 9 | `set DB_HOST=localhost` |
| debug-scripts\import_icd10_codes_efficient.js | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_icd10_codes_upsert.js | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_icd10_codes_upsert.js | 142 | `set DB_HOST=localhost` |
| debug-scripts\import_mappings_and_docs.js | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_mappings_direct.js | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_mappings_direct_sql.js | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_mappings_robust.js | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_using_node.js | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_using_psql.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_using_psql_fixed.js | 13 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\insert-heuristic-enhanced-prompt.js | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\insert-peer-to-self-prompt.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\list-all-database-tables.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\list-all-tables.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\list-database-tables.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\list_all_database_tables_detailed.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\multi-llm-personality-test.js | 23 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\query-active-prompt.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\remove-test-medical-data.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\restore-database.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\restore-specialty-word-counts.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\run_import_cpt_codes_upsert.bat | 9 | `set DB_HOST=localhost` |
| debug-scripts\run_import_icd10_codes_upsert.bat | 9 | `set DB_HOST=localhost` |
| debug-scripts\set-active-prompt.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\set-all-specialties-to-33-words.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\setup-ssm-port-forwarding.bat | 4 | `echo This will create a tunnel from localhost:6379 to the MemoryDB cluster.` |
| debug-scripts\show-comprehensive-prompt.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\show-lean-prompt.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\switch-redis-config.bat | 5 | `echo 1. Development Mode (localhost through SSM tunnel)` |
| debug-scripts\switch-redis-config.bat | 12 | `echo Switching to Development Mode (localhost through SSM tunnel)...` |
| debug-scripts\switch-redis-config.bat | 15 | `echo # Using localhost:6379 with SSM port forwarding to MemoryDB >> .env.tmp` |
| debug-scripts\switch-redis-config.bat | 22 | `echo # Disable TLS when using localhost through SSM tunnel >> .env.tmp` |
| debug-scripts\test-concurrent-orders.js | 73 | `hostname: 'localhost',` |
| debug-scripts\test-concurrent-orders.js | 85 | `console.log(`[Doctor ${index + 1}] Making ${method} request to http://localhost:${PORT}${endpoint}`);` |
| debug-scripts\test-database-integrity.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\test-validation-endpoint-direct.js | 45 | `hostname: 'localhost',` |
| debug-scripts\test-validation-endpoint-direct.js | 57 | `console.log(`Making ${method} request to http://localhost:${PORT}${endpoint}`);` |
| debug-scripts\update-active-template.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\update-active-validation-prompt.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\update-lean-prompt-with-isPrimary.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\update-lean-template.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\update-prompt-content.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\update-template-15-directly.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\update-template-15-json-format.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\update-template-field-names-in-db.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\update-word-limit.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\validate_data_integrity.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\verify_medical_data_import.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| run_insert_optimized_prompt.bat | 5 | `set PGHOST=localhost` |
| run_update_field_names.bat | 6 | `set PGHOST=localhost` |
| run_update_optimized_prompt.bat | 6 | `set PGHOST=localhost` |
| scripts\execute-sql-script.js | 34 | `host: process.env.DB_HOST \|\| 'localhost',` |
| scripts\fetch-prompt-from-db.js | 10 | `host: process.env.DB_HOST \|\| 'localhost',` |
| scripts\fetch-template-15.js | 10 | `host: process.env.DB_HOST \|\| 'localhost',` |
| scripts\import-comprehensive-prompt.js | 15 | `host: 'localhost',` |
| scripts\query-orders-schema.js | 13 | `host: process.env.DB_HOST \|\| 'localhost',` |
| scripts\test-validation-engine-with-fallback.js | 14 | `const API_URL = 'http://localhost:3000';` |
| sql-scripts\import_icd10_batched.js | 149 | `DB_HOST=\${PGHOST:-localhost}` |
| sql-scripts\import_icd10_batched.js | 238 | `if "!DB_HOST!"=="" set DB_HOST=localhost` |
| sql-scripts\import_other_tables.js | 186 | `DB_HOST=\${PGHOST:-localhost}` |
| sql-scripts\import_other_tables.js | 285 | `if "!DB_HOST!"=="" set DB_HOST=localhost` |
| src\config\memorydb.ts | 17 | `const memoryDbHost = process.env.MEMORYDB_HOST \|\| 'localhost';` |
| src\config\memorydb.ts | 22 | `const isLocalhost = memoryDbHost === 'localhost' \|\| memoryDbHost === '127.0.0.1';` |
| src\config\redis.ts | 21 | `const redisHost = process.env.REDIS_CLOUD_HOST \|\| 'localhost';` |
| src\config\redis.ts | 30 | `// Only enable TLS for Redis Cloud, not for localhost` |
| src\config\redis.ts | 31 | `tls: redisHost !== 'localhost' ? {} : undefined,` |
| test-comprehensive-prompt.js | 12 | `const API_BASE_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000';` |
| test-config.js | 8 | `baseUrl: process.env.API_BASE_URL \|\| 'http://localhost:3000/api',` |
| test-config.js | 15 | `host: process.env.DB_HOST \|\| 'localhost',` |
| test-radiology-export.bat | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| test-radiology-export.bat | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| test-radiology-export.sh | 15 | `echo "WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api"` |
| test-radiology-export.sh | 16 | `API_BASE_URL="http://localhost:3000/api"` |
| test-stripe-webhooks-cli.bat | 17 | `curl -s http://localhost:3000/api/health >nul 2>nul` |
| test-stripe-webhooks-cli.bat | 36 | `start "Stripe Webhook Listener" cmd /c "stripe listen --forward-to http://localhost:3000/api/webhooks/stripe"` |
| test-stripe-webhooks-cli.bat | 78 | `echo 5. Enter your webhook endpoint URL: http://localhost:3000/api/webhooks/stripe` |
| test-stripe-webhooks-cli.sh | 16 | `if ! curl -s http://localhost:3000/api/health &> /dev/null; then` |
| test-stripe-webhooks-cli.sh | 35 | `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe &` |
| test-stripe-webhooks-cli.sh | 78 | `echo "5. Enter your webhook endpoint URL: http://localhost:3000/api/webhooks/stripe"` |
| test-superadmin-api-with-token.bat | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| test-superadmin-api-with-token.bat | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| test-superadmin-api.bat | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| test-superadmin-api.bat | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| test-superadmin-api.sh | 15 | `echo "WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api"` |
| test-superadmin-api.sh | 16 | `API_BASE_URL="http://localhost:3000/api"` |
| tests\batch\import_icd10_batched.bat | 41 | `if "!DB_HOST!"=="" set DB_HOST=localhost` |
| tests\batch\import_icd10_batched.sh | 26 | `DB_HOST=${PGHOST:-localhost}` |
| tests\batch\import_medical_data.bat | 52 | `if "!DB_HOST!"=="" set DB_HOST=localhost` |
| tests\batch\import_medical_data.sh | 29 | `DB_HOST=${PGHOST:-localhost}` |
| tests\batch\import_other_tables.bat | 42 | `if "!DB_HOST!"=="" set DB_HOST=localhost` |
| tests\batch\import_other_tables.sh | 27 | `DB_HOST=${PGHOST:-localhost}` |
| tests\batch\run-connection-tests.bat | 9 | `for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(\"postgres://\" + helpers.config.database.user + \":\" + helpers.config.database.password + \"@localhost:\" + helpers.config.database.port + \"/\" + helpers.config.database.mainDb);"') do set DB_CONN=%%a` |
| tests\batch\run-connection-tests.sh | 9 | `DB_CONN=$(node -e "const helpers = require('./test-helpers'); console.log('postgres://' + helpers.config.database.user + ':' + helpers.config.database.password + '@localhost:' + helpers.config.database.port + '/' + helpers.config.database.mainDb);")` |
| tests\batch\run-validation-tests.bat | 19 | `:: Default to localhost if not provided` |
| tests\batch\run-validation-tests.bat | 20 | `set API_BASE_URL=http://localhost:3000/api` |
| tests\batch\run-validation-tests.sh | 18 | `# Default to localhost if not provided` |
| tests\batch\run-validation-tests.sh | 19 | `export API_BASE_URL=http://localhost:3000/api` |
| tests\batch\run_insert_comprehensive_prompt.bat | 5 | `set DB_HOST=localhost` |
| tests\batch\superadmin\test-superadmin-logs.bat | 5 | `set API_URL=http://localhost:3000` |
| tests\batch\superadmin\test-superadmin-logs.sh | 5 | `API_URL="http://localhost:3000"` |
| tests\batch\superadmin\test-superadmin-prompt-assignments.bat | 5 | `set API_URL=http://localhost:3000` |
| tests\batch\superadmin\test-superadmin-prompt-assignments.sh | 5 | `API_URL="http://localhost:3000"` |
| tests\batch\superadmin\test-superadmin-prompts.bat | 5 | `set API_URL=http://localhost:3000` |
| tests\batch\test-admin-finalization-debug.bat | 32 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-summary" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}"` |
| tests\batch\test-admin-finalization-debug.bat | 33 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-summary" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}"` |
| tests\batch\test-admin-finalization-debug.bat | 44 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-supplemental" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}"` |
| tests\batch\test-admin-finalization-debug.bat | 45 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-supplemental" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}"` |
| tests\batch\test-admin-finalization-debug.bat | 66 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/send-to-radiology" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}"` |
| tests\batch\test-admin-finalization-debug.bat | 67 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/send-to-radiology" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}"` |
| tests\batch\test-stripe-webhook-handlers.js | 20 | `const API_URL = process.env.API_URL \|\| 'http://localhost:3000';` |
| tests\batch\test-superadmin-api.js | 11 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| tests\batch\test-superadmin-logs.bat | 5 | `set API_URL=http://localhost:3000` |
| tests\batch\test-superadmin-logs.sh | 5 | `API_URL="http://localhost:3000"` |
| tests\batch\test-superadmin-prompt-assignments.bat | 5 | `set API_URL=http://localhost:3000` |
| tests\batch\test-superadmin-prompt-assignments.sh | 5 | `API_URL="http://localhost:3000"` |
| tests\batch\update_comprehensive_prompt.bat | 5 | `set DB_HOST=localhost` |
| tests\batch\update_comprehensive_prompt.sh | 6 | `DB_HOST="localhost"` |
| tests\batch\verify_import.bat | 51 | `if "!DB_HOST!"=="" set DB_HOST=localhost` |
| tests\batch\verify_import.sh | 28 | `DB_HOST=${PGHOST:-localhost}` |
| tests\billing-checkout.test.js | 5 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| tests\e2e\run_comprehensive_tests.js | 15 | `const API_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000/api';` |
| tests\file-upload-test.js | 7 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| tests\file-upload.test.js | 6 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| tests\stripe-webhooks.test.js | 16 | `const API_BASE_URL = (process.env.API_BASE_URL \|\| helpers.config.api.baseUrl \|\| 'http://localhost:3000').replace(/\/api$/, '');` |
| tests\test-redis-basic.js | 20 | `const memoryDbHost = process.env.MEMORYDB_HOST \|\| 'localhost';` |
| tests\test-redis-basic.js | 25 | `const isLocalhost = memoryDbHost === 'localhost' \|\| memoryDbHost === '127.0.0.1';` |
| tests\test-redis-search-with-fallback-fix-updated.js | 50 | `'http://localhost:3000/api/orders/validate',` |
| tests\test-redis-search-with-fallback-fix-updated.js | 96 | `'http://localhost:3000/api/orders/validate',` |
| tests\test-redis-search-with-fallback-fix.js | 50 | `'http://localhost:3000/api/orders/validate',` |
| tests\test-redis-search-with-fallback-fix.js | 97 | `'http://localhost:3000/api/orders/validate',` |
| tests\test-redis-search-with-fallback.js | 45 | `const baseUrl = process.env.API_URL \|\| 'http://localhost:3000';` |
| tests\test-redis-search.js | 30 | `const baseUrl = process.env.API_URL \|\| 'http://localhost:3000';` |

### Localhost IP reference (5 matches)

| File | Line | Content |
| ---- | ---- | ------- |
| debug-scripts\audit-deployment-config.js | 17 | `{ pattern: '127.0.0.1', description: 'Localhost IP reference' },` |
| debug-scripts\audit-deployment-config.js | 169 | `results.byPattern['127.0.0.1']?.matches.length > 0) {` |
| debug-scripts\switch-redis-config.bat | 17 | `echo MEMORYDB_HOST=127.0.0.1 >> .env.tmp` |
| src\config\memorydb.ts | 22 | `const isLocalhost = memoryDbHost === 'localhost' \|\| memoryDbHost === '127.0.0.1';` |
| tests\test-redis-basic.js | 25 | `const isLocalhost = memoryDbHost === 'localhost' \|\| memoryDbHost === '127.0.0.1';` |

### HTTP URL (non-secure) (55 matches)

| File | Line | Content |
| ---- | ---- | ------- |
| debug-scripts\audit-deployment-config.js | 18 | `{ pattern: 'http://', description: 'HTTP URL (non-secure)' },` |
| debug-scripts\audit-deployment-config.js | 173 | `if (results.byPattern['http://']?.matches.length > 0) {` |
| debug-scripts\test-concurrent-orders.js | 85 | `console.log(`[Doctor ${index + 1}] Making ${method} request to http://localhost:${PORT}${endpoint}`);` |
| debug-scripts\test-validation-endpoint-direct.js | 57 | `console.log(`Making ${method} request to http://localhost:${PORT}${endpoint}`);` |
| deploy-to-aws.bat | 117 | `echo Your application is available at: http://%ENV_URL%` |
| deploy-to-aws.sh | 107 | `echo "Your application is available at: http://$ENV_URL"` |
| scripts\test-validation-engine-with-fallback.js | 14 | `const API_URL = 'http://localhost:3000';` |
| test-comprehensive-prompt.js | 12 | `const API_BASE_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000';` |
| test-config.js | 8 | `baseUrl: process.env.API_BASE_URL \|\| 'http://localhost:3000/api',` |
| test-radiology-export.bat | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| test-radiology-export.bat | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| test-radiology-export.sh | 15 | `echo "WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api"` |
| test-radiology-export.sh | 16 | `API_BASE_URL="http://localhost:3000/api"` |
| test-stripe-webhooks-cli.bat | 17 | `curl -s http://localhost:3000/api/health >nul 2>nul` |
| test-stripe-webhooks-cli.bat | 36 | `start "Stripe Webhook Listener" cmd /c "stripe listen --forward-to http://localhost:3000/api/webhooks/stripe"` |
| test-stripe-webhooks-cli.bat | 78 | `echo 5. Enter your webhook endpoint URL: http://localhost:3000/api/webhooks/stripe` |
| test-stripe-webhooks-cli.sh | 16 | `if ! curl -s http://localhost:3000/api/health &> /dev/null; then` |
| test-stripe-webhooks-cli.sh | 35 | `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe &` |
| test-stripe-webhooks-cli.sh | 78 | `echo "5. Enter your webhook endpoint URL: http://localhost:3000/api/webhooks/stripe"` |
| test-superadmin-api-with-token.bat | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| test-superadmin-api-with-token.bat | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| test-superadmin-api.bat | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| test-superadmin-api.bat | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| test-superadmin-api.sh | 15 | `echo "WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api"` |
| test-superadmin-api.sh | 16 | `API_BASE_URL="http://localhost:3000/api"` |
| tests\batch\run-validation-tests.bat | 20 | `set API_BASE_URL=http://localhost:3000/api` |
| tests\batch\run-validation-tests.sh | 19 | `export API_BASE_URL=http://localhost:3000/api` |
| tests\batch\superadmin\test-superadmin-logs.bat | 5 | `set API_URL=http://localhost:3000` |
| tests\batch\superadmin\test-superadmin-logs.sh | 5 | `API_URL="http://localhost:3000"` |
| tests\batch\superadmin\test-superadmin-prompt-assignments.bat | 5 | `set API_URL=http://localhost:3000` |
| tests\batch\superadmin\test-superadmin-prompt-assignments.sh | 5 | `API_URL="http://localhost:3000"` |
| tests\batch\superadmin\test-superadmin-prompts.bat | 5 | `set API_URL=http://localhost:3000` |
| tests\batch\test-admin-finalization-debug.bat | 32 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-summary" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}"` |
| tests\batch\test-admin-finalization-debug.bat | 33 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-summary" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}"` |
| tests\batch\test-admin-finalization-debug.bat | 44 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-supplemental" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}"` |
| tests\batch\test-admin-finalization-debug.bat | 45 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-supplemental" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}"` |
| tests\batch\test-admin-finalization-debug.bat | 66 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/send-to-radiology" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}"` |
| tests\batch\test-admin-finalization-debug.bat | 67 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/send-to-radiology" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}"` |
| tests\batch\test-stripe-webhook-handlers.js | 20 | `const API_URL = process.env.API_URL \|\| 'http://localhost:3000';` |
| tests\batch\test-superadmin-api.js | 11 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| tests\batch\test-superadmin-logs.bat | 5 | `set API_URL=http://localhost:3000` |
| tests\batch\test-superadmin-logs.sh | 5 | `API_URL="http://localhost:3000"` |
| tests\batch\test-superadmin-prompt-assignments.bat | 5 | `set API_URL=http://localhost:3000` |
| tests\batch\test-superadmin-prompt-assignments.sh | 5 | `API_URL="http://localhost:3000"` |
| tests\billing-checkout.test.js | 5 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| tests\e2e\run_comprehensive_tests.js | 15 | `const API_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000/api';` |
| tests\file-upload-test.js | 7 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| tests\file-upload.test.js | 6 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| tests\stripe-webhooks.test.js | 16 | `const API_BASE_URL = (process.env.API_BASE_URL \|\| helpers.config.api.baseUrl \|\| 'http://localhost:3000').replace(/\/api$/, '');` |
| tests\test-redis-search-with-fallback-fix-updated.js | 50 | `'http://localhost:3000/api/orders/validate',` |
| tests\test-redis-search-with-fallback-fix-updated.js | 96 | `'http://localhost:3000/api/orders/validate',` |
| tests\test-redis-search-with-fallback-fix.js | 50 | `'http://localhost:3000/api/orders/validate',` |
| tests\test-redis-search-with-fallback-fix.js | 97 | `'http://localhost:3000/api/orders/validate',` |
| tests\test-redis-search-with-fallback.js | 45 | `const baseUrl = process.env.API_URL \|\| 'http://localhost:3000';` |
| tests\test-redis-search.js | 30 | `const baseUrl = process.env.API_URL \|\| 'http://localhost:3000';` |

### Environment variable usage (603 matches)

| File | Line | Content |
| ---- | ---- | ------- |
| compare_prompts.js | 12 | `host: process.env.DB_HOST \|\| 'localhost',` |
| compare_prompts.js | 13 | `port: process.env.DB_PORT \|\| 5433,` |
| compare_prompts.js | 14 | `database: process.env.DB_NAME \|\| 'radorder_main',` |
| compare_prompts.js | 15 | `user: process.env.DB_USER \|\| 'postgres',` |
| compare_prompts.js | 16 | `password: process.env.DB_PASSWORD \|\| 'postgres123'` |
| db-migrations\aws-postgres-migration.js | 53 | `options.sourceMain = process.env.MAIN_DATABASE_URL \|\| process.env.DEV_MAIN_DATABASE_URL;` |
| db-migrations\aws-postgres-migration.js | 54 | `options.sourcePhi = process.env.PHI_DATABASE_URL \|\| process.env.DEV_PHI_DATABASE_URL;` |
| db-migrations\aws-postgres-migration.js | 55 | `options.targetMain = process.env.PROD_MAIN_DATABASE_URL;` |
| db-migrations\aws-postgres-migration.js | 56 | `options.targetPhi = process.env.PROD_PHI_DATABASE_URL;` |
| debug-scripts\activate-comprehensive-prompt.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\activate-comprehensive-prompt.js | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\activate-comprehensive-prompt.js | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\activate-comprehensive-prompt.js | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\activate-comprehensive-prompt.js | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\activate-lean-template.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\activate-lean-template.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\activate-lean-template.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\activate-lean-template.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\activate-lean-template.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\add-test-medical-data.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\add-test-medical-data.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\add-test-medical-data.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\add-test-medical-data.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\add-test-medical-data.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\add-word-limit-to-prompt-16.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\add-word-limit-to-prompt-16.js | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\add-word-limit-to-prompt-16.js | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\add-word-limit-to-prompt-16.js | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\add-word-limit-to-prompt-16.js | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\analyze-database-tables.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\analyze-database-tables.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\analyze-database-tables.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\analyze-database-tables.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\analyze-database-tables.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\analyze_duplicates_and_retired_codes.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\analyze_duplicates_and_retired_codes.js | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\analyze_duplicates_and_retired_codes.js | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\analyze_duplicates_and_retired_codes.js | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\analyze_duplicates_and_retired_codes.js | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\audit-deployment-config.js | 20 | `{ pattern: 'process.env', description: 'Environment variable usage' },` |
| debug-scripts\check-all-prompts.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-all-prompts.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\check-all-prompts.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\check-all-prompts.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\check-all-prompts.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\check-database-connection.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-database-connection.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\check-database-connection.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\check-database-connection.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\check-database-connection.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\check-existing-medical-data.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-existing-medical-data.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\check-existing-medical-data.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\check-existing-medical-data.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\check-existing-medical-data.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\check-j18-9-in-database.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-j18-9-in-database.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\check-j18-9-in-database.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\check-j18-9-in-database.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\check-j18-9-in-database.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\check-last-successful-test.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-last-successful-test.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\check-last-successful-test.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\check-last-successful-test.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\check-last-successful-test.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\check-llm-validation-logs.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-llm-validation-logs.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\check-llm-validation-logs.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\check-llm-validation-logs.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\check-llm-validation-logs.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\check-phi-database.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-phi-database.js | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\check-phi-database.js | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\check-phi-database.js | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\check-phi-timestamps.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-phi-timestamps.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\check-phi-timestamps.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\check-phi-timestamps.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\check-phi-validation-details.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-phi-validation-details.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\check-phi-validation-details.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\check-phi-validation-details.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\check-prompt-content.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-prompt-content.js | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\check-prompt-content.js | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\check-prompt-content.js | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\check-prompt-content.js | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\check-prompt-template-dependencies.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-prompt-template-dependencies.js | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\check-prompt-template-dependencies.js | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\check-prompt-template-dependencies.js | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\check-prompt-template-dependencies.js | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\check-recent-modifications.js | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-recent-modifications.js | 12 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\check-recent-modifications.js | 14 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\check-recent-modifications.js | 15 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\check-recent-validation-logs.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-recent-validation-logs.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\check-recent-validation-logs.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\check-recent-validation-logs.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\check-specialty-configurations.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-specialty-configurations.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\check-specialty-configurations.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\check-specialty-configurations.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\check-specialty-configurations.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\check-specialty-table.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-specialty-table.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\check-specialty-table.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\check-specialty-table.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\check-specialty-table.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\check-timestamp-handling.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-timestamp-handling.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\check-timestamp-handling.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\check-timestamp-handling.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\check-timestamp-handling.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\check-word-limit.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check-word-limit.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\check-word-limit.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\check-word-limit.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\check-word-limit.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\check_db_connection.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\check_db_connection.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\check_db_connection.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\check_db_connection.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\check_db_connection.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\clean-up-prompt-template.js | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\clean-up-prompt-template.js | 13 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\clean-up-prompt-template.js | 14 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\clean-up-prompt-template.js | 15 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\clean-up-prompt-template.js | 16 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\clean_and_prepare_database.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\clean_and_prepare_database.js | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\clean_and_prepare_database.js | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\clean_and_prepare_database.js | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\clean_and_prepare_database.js | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\create-hybrid-prompt.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\create-hybrid-prompt.js | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\create-hybrid-prompt.js | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\create-hybrid-prompt.js | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\create-hybrid-prompt.js | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\database-interaction-test.js | 17 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\database-interaction-test.js | 18 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\database-interaction-test.js | 19 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\database-interaction-test.js | 20 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\database-interaction-test.js | 21 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\debug-csv-export.js | 21 | `host: process.env.DB_HOST \|\| 'localhost',` |
| debug-scripts\debug-csv-export.js | 22 | `port: process.env.DB_PORT \|\| 5433,` |
| debug-scripts\debug-csv-export.js | 23 | `database: process.env.PHI_DB \|\| 'radorder_phi',` |
| debug-scripts\debug-csv-export.js | 24 | `user: process.env.DB_USER \|\| 'postgres',` |
| debug-scripts\debug-csv-export.js | 25 | `password: process.env.DB_PASSWORD \|\| 'postgres123'` |
| debug-scripts\enhanced-test-additional-notes.js | 24 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\enhanced-test-additional-notes.js | 25 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\enhanced-test-additional-notes.js | 26 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\enhanced-test-additional-notes.js | 27 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\enhanced-test-additional-notes.js | 28 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\enhanced-test-complex-specialty.js | 17 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\enhanced-test-complex-specialty.js | 18 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\enhanced-test-complex-specialty.js | 19 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\enhanced-test-complex-specialty.js | 20 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\enhanced-test-complex-specialty.js | 21 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\fix-order-number-duplicates.js | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\fix-order-number-duplicates.js | 12 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\fix-order-number-duplicates.js | 14 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\fix-order-number-duplicates.js | 15 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\fix-prompt-template.js | 13 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\fix-prompt-template.js | 14 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\fix-prompt-template.js | 15 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\fix-prompt-template.js | 16 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\fix-prompt-template.js | 17 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\fixed-multi-llm-personality-test.js | 23 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\fixed-multi-llm-personality-test.js | 24 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\fixed-multi-llm-personality-test.js | 25 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\fixed-multi-llm-personality-test.js | 26 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\fixed-multi-llm-personality-test.js | 27 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\fixed-peer-to-self-prompt.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\fixed-peer-to-self-prompt.js | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\fixed-peer-to-self-prompt.js | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\fixed-peer-to-self-prompt.js | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\fixed-peer-to-self-prompt.js | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\fix_and_import_mappings.js | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\fix_and_import_mappings.js | 12 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\fix_and_import_mappings.js | 13 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\fix_and_import_mappings.js | 14 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\fix_and_import_mappings.js | 15 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\fix_and_import_sql.js | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\fix_and_import_sql.js | 12 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\fix_and_import_sql.js | 13 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\fix_and_import_sql.js | 14 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\fix_and_import_sql.js | 15 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\fix_sql_syntax_and_import.js | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\fix_sql_syntax_and_import.js | 13 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\fix_sql_syntax_and_import.js | 14 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\fix_sql_syntax_and_import.js | 15 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\fix_sql_syntax_and_import.js | 16 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\generate_fix_duplicates_sql.js | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\generate_fix_duplicates_sql.js | 13 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\generate_fix_duplicates_sql.js | 14 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\generate_fix_duplicates_sql.js | 15 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\generate_fix_duplicates_sql.js | 16 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\get-full-prompt-content.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\get-full-prompt-content.js | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\get-full-prompt-content.js | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\get-full-prompt-content.js | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\get-full-prompt-content.js | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\get-lean-template.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\get-lean-template.js | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\get-lean-template.js | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\get-lean-template.js | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\get-lean-template.js | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\get-prompt-by-id.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\get-prompt-by-id.js | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\get-prompt-by-id.js | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\get-prompt-by-id.js | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\get-prompt-by-id.js | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\get-prompts-14-and-16.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\get-prompts-14-and-16.js | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\get-prompts-14-and-16.js | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\get-prompts-14-and-16.js | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\get-prompts-14-and-16.js | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\import_all_medical_data_properly.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_all_medical_data_properly.js | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\import_all_medical_data_properly.js | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\import_all_medical_data_properly.js | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\import_all_medical_data_properly.js | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\import_cpt_codes_upsert.js | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_cpt_codes_upsert.js | 13 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\import_cpt_codes_upsert.js | 14 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\import_cpt_codes_upsert.js | 15 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\import_cpt_codes_upsert.js | 16 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\import_icd10_codes_efficient.js | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_icd10_codes_efficient.js | 13 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\import_icd10_codes_efficient.js | 14 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\import_icd10_codes_efficient.js | 15 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\import_icd10_codes_efficient.js | 16 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\import_icd10_codes_upsert.js | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_icd10_codes_upsert.js | 13 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\import_icd10_codes_upsert.js | 14 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\import_icd10_codes_upsert.js | 15 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\import_icd10_codes_upsert.js | 16 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\import_mappings_and_docs.js | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_mappings_and_docs.js | 13 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\import_mappings_and_docs.js | 14 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\import_mappings_and_docs.js | 15 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\import_mappings_and_docs.js | 16 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\import_mappings_direct.js | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_mappings_direct.js | 12 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\import_mappings_direct.js | 13 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\import_mappings_direct.js | 14 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\import_mappings_direct.js | 15 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\import_mappings_direct_sql.js | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_mappings_direct_sql.js | 12 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\import_mappings_direct_sql.js | 13 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\import_mappings_direct_sql.js | 14 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\import_mappings_direct_sql.js | 15 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\import_mappings_robust.js | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_mappings_robust.js | 13 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\import_mappings_robust.js | 14 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\import_mappings_robust.js | 15 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\import_mappings_robust.js | 16 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\import_using_node.js | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_using_node.js | 13 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\import_using_node.js | 14 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\import_using_node.js | 15 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\import_using_node.js | 16 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\import_using_psql.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_using_psql.js | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\import_using_psql.js | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\import_using_psql.js | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\import_using_psql.js | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\import_using_psql_fixed.js | 13 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\import_using_psql_fixed.js | 14 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\import_using_psql_fixed.js | 15 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\import_using_psql_fixed.js | 16 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\import_using_psql_fixed.js | 17 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\insert-heuristic-enhanced-prompt.js | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\insert-heuristic-enhanced-prompt.js | 12 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\insert-heuristic-enhanced-prompt.js | 13 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\insert-heuristic-enhanced-prompt.js | 14 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\insert-heuristic-enhanced-prompt.js | 15 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\insert-peer-to-self-prompt.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\insert-peer-to-self-prompt.js | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\insert-peer-to-self-prompt.js | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\insert-peer-to-self-prompt.js | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\insert-peer-to-self-prompt.js | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\list-all-database-tables.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\list-all-database-tables.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\list-all-database-tables.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\list-all-database-tables.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\list-all-database-tables.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\list-all-tables.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\list-all-tables.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\list-all-tables.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\list-all-tables.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\list-all-tables.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\list-database-tables.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\list-database-tables.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\list-database-tables.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\list-database-tables.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\list-database-tables.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\list_all_database_tables_detailed.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\list_all_database_tables_detailed.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\list_all_database_tables_detailed.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\list_all_database_tables_detailed.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\list_all_database_tables_detailed.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\multi-llm-personality-test.js | 23 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\multi-llm-personality-test.js | 24 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\multi-llm-personality-test.js | 25 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\multi-llm-personality-test.js | 26 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\multi-llm-personality-test.js | 27 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\query-active-prompt.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\query-active-prompt.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\query-active-prompt.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\query-active-prompt.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\query-active-prompt.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\remove-test-medical-data.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\remove-test-medical-data.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\remove-test-medical-data.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\remove-test-medical-data.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\remove-test-medical-data.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\restore-database.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\restore-database.js | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\restore-database.js | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\restore-database.js | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\restore-database.js | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\restore-specialty-word-counts.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\restore-specialty-word-counts.js | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\restore-specialty-word-counts.js | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\restore-specialty-word-counts.js | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\restore-specialty-word-counts.js | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\set-active-prompt.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\set-active-prompt.js | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\set-active-prompt.js | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\set-active-prompt.js | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\set-active-prompt.js | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\set-all-specialties-to-33-words.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\set-all-specialties-to-33-words.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\set-all-specialties-to-33-words.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\set-all-specialties-to-33-words.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\set-all-specialties-to-33-words.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\show-comprehensive-prompt.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\show-comprehensive-prompt.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\show-comprehensive-prompt.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\show-comprehensive-prompt.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\show-comprehensive-prompt.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\show-lean-prompt.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\show-lean-prompt.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\show-lean-prompt.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\show-lean-prompt.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\show-lean-prompt.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\test-concurrent-orders.js | 10 | `const JWT_SECRET = process.env.JWT_SECRET \|\| '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112';` |
| debug-scripts\test-database-integrity.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\test-database-integrity.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\test-database-integrity.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\test-database-integrity.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\test-database-integrity.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\test-validation-endpoint-direct.js | 9 | `const JWT_SECRET = process.env.JWT_SECRET \|\| '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112';` |
| debug-scripts\update-active-template.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\update-active-template.js | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\update-active-template.js | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\update-active-template.js | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\update-active-template.js | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\update-active-validation-prompt.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\update-active-validation-prompt.js | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\update-active-validation-prompt.js | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\update-active-validation-prompt.js | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\update-active-validation-prompt.js | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\update-lean-prompt-with-isPrimary.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\update-lean-prompt-with-isPrimary.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\update-lean-prompt-with-isPrimary.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\update-lean-prompt-with-isPrimary.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\update-lean-prompt-with-isPrimary.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\update-lean-template.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\update-lean-template.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\update-lean-template.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\update-lean-template.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\update-lean-template.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\update-prompt-content.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\update-prompt-content.js | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\update-prompt-content.js | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\update-prompt-content.js | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\update-prompt-content.js | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\update-template-15-directly.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\update-template-15-directly.js | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\update-template-15-directly.js | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\update-template-15-directly.js | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\update-template-15-directly.js | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\update-template-15-json-format.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\update-template-15-json-format.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\update-template-15-json-format.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\update-template-15-json-format.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\update-template-15-json-format.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\update-template-field-names-in-db.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\update-template-field-names-in-db.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\update-template-field-names-in-db.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\update-template-field-names-in-db.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\update-template-field-names-in-db.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\update-word-limit.js | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\update-word-limit.js | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\update-word-limit.js | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\update-word-limit.js | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\update-word-limit.js | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\validate_data_integrity.js | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\validate_data_integrity.js | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\validate_data_integrity.js | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\validate_data_integrity.js | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\validate_data_integrity.js | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| debug-scripts\verify_medical_data_import.js | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| debug-scripts\verify_medical_data_import.js | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| debug-scripts\verify_medical_data_import.js | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| debug-scripts\verify_medical_data_import.js | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| debug-scripts\verify_medical_data_import.js | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |
| generate-superadmin-token.js | 6 | `const jwtSecret = process.env.JWT_SECRET \|\| 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';` |
| generate-test-token.js | 6 | `const jwtSecret = process.env.JWT_SECRET \|\| 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';` |
| old_code\auth.service.ts | 30 | `const registrationKey = process.env.REGISTRATION_KEY;` |
| old_code\auth.service.ts | 85 | `const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS \|\| '10');` |
| old_code\src\middleware\auth.middleware.ts | 31 | `console.log('JWT Secret:', process.env.JWT_SECRET?.substring(0, 3) + '...');` |
| old_code\src\middleware\auth.middleware.ts | 34 | `const decoded = jwt.verify(token, process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here') as AuthTokenPayload;` |
| old_code\src\services\billing\stripe\stripe-webhooks.ts | 7 | `const stripe = new Stripe(process.env.STRIPE_SECRET_KEY \|\| '', {` |
| old_code\src\services\billing\stripe\stripe-webhooks.ts | 18 | `const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;` |
| scripts\execute-sql-script.js | 34 | `host: process.env.DB_HOST \|\| 'localhost',` |
| scripts\execute-sql-script.js | 35 | `port: process.env.DB_PORT \|\| 5433,` |
| scripts\execute-sql-script.js | 36 | `database: process.env.PHI_DB \|\| 'radorder_phi',` |
| scripts\execute-sql-script.js | 37 | `user: process.env.DB_USER \|\| 'postgres',` |
| scripts\execute-sql-script.js | 38 | `password: process.env.DB_PASSWORD \|\| 'postgres123'` |
| scripts\fetch-prompt-from-db.js | 10 | `host: process.env.DB_HOST \|\| 'localhost',` |
| scripts\fetch-prompt-from-db.js | 11 | `port: process.env.DB_PORT \|\| 5433,` |
| scripts\fetch-prompt-from-db.js | 12 | `database: process.env.DB_NAME \|\| 'radorder_main',` |
| scripts\fetch-prompt-from-db.js | 13 | `user: process.env.DB_USER \|\| 'postgres',` |
| scripts\fetch-prompt-from-db.js | 14 | `password: process.env.DB_PASSWORD \|\| 'postgres123'` |
| scripts\fetch-template-15.js | 10 | `host: process.env.DB_HOST \|\| 'localhost',` |
| scripts\fetch-template-15.js | 11 | `port: process.env.DB_PORT \|\| 5433,` |
| scripts\fetch-template-15.js | 12 | `database: process.env.DB_NAME \|\| 'radorder_main',` |
| scripts\fetch-template-15.js | 13 | `user: process.env.DB_USER \|\| 'postgres',` |
| scripts\fetch-template-15.js | 14 | `password: process.env.DB_PASSWORD \|\| 'postgres123'` |
| scripts\prepare-stripe-test-data.js | 27 | `connectionString: process.env.MAIN_DATABASE_URL` |
| scripts\query-db.js | 30 | `connectionString: process.env.MAIN_DATABASE_URL` |
| scripts\query-orders-schema.js | 13 | `host: process.env.DB_HOST \|\| 'localhost',` |
| scripts\query-orders-schema.js | 14 | `port: process.env.DB_PORT \|\| 5433,` |
| scripts\query-orders-schema.js | 15 | `database: process.env.PHI_DB \|\| 'radorder_phi',` |
| scripts\query-orders-schema.js | 16 | `user: process.env.DB_USER \|\| 'postgres',` |
| scripts\query-orders-schema.js | 17 | `password: process.env.DB_PASSWORD \|\| 'postgres123'` |
| src\config\config.ts | 8 | `port: process.env.PORT \|\| 3000,` |
| src\config\config.ts | 9 | `frontendUrl: process.env.FRONTEND_URL \|\| 'https://app.radorderpad.com',` |
| src\config\config.ts | 10 | `nodeEnv: process.env.NODE_ENV \|\| 'development',` |
| src\config\config.ts | 13 | `mainDatabaseUrl: process.env.MAIN_DATABASE_URL,` |
| src\config\config.ts | 14 | `phiDatabaseUrl: process.env.PHI_DATABASE_URL,` |
| src\config\config.ts | 17 | `jwtSecret: process.env.JWT_SECRET \|\| 'default_jwt_secret_key_change_in_production',` |
| src\config\config.ts | 18 | `jwtExpiresIn: process.env.JWT_EXPIRES_IN \|\| '24h',` |
| src\config\config.ts | 21 | `bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS \|\| '10'),` |
| src\config\config.ts | 24 | `registrationKey: process.env.REGISTRATION_KEY \|\| 'default_registration_key_change_in_production',` |
| src\config\config.ts | 28 | `accessKeyId: process.env.AWS_ACCESS_KEY_ID,` |
| src\config\config.ts | 29 | `secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,` |
| src\config\config.ts | 30 | `region: process.env.AWS_REGION \|\| 'us-east-2',` |
| src\config\config.ts | 32 | `bucketName: process.env.S3_BUCKET_NAME` |
| src\config\config.ts | 35 | `fromEmail: process.env.SES_FROM_EMAIL \|\| 'no-reply@radorderpad.com',` |
| src\config\config.ts | 36 | `testMode: process.env.EMAIL_TEST_MODE === 'true' \|\| false` |
| src\config\config.ts | 42 | `secretKey: process.env.STRIPE_SECRET_KEY,` |
| src\config\config.ts | 43 | `webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,` |
| src\config\config.ts | 45 | `creditBundlePriceId: process.env.STRIPE_PRICE_ID_CREDIT_BUNDLE,` |
| src\config\config.ts | 46 | `frontendSuccessUrl: process.env.FRONTEND_CHECKOUT_SUCCESS_URL \|\| 'https://radorderpad.com/billing?success=true&session_id={CHECKOUT_SESSION_ID}',` |
| src\config\config.ts | 47 | `frontendCancelUrl: process.env.FRONTEND_CHECKOUT_CANCEL_URL \|\| 'https://radorderpad.com/billing?canceled=true'` |
| src\config\config.ts | 51 | `email: process.env.EMAIL_TEST_MODE === 'true' \|\| false,` |
| src\config\config.ts | 52 | `billing: process.env.BILLING_TEST_MODE === 'true' \|\| false` |
| src\config\config.ts | 58 | `anthropicApiKey: process.env.ANTHROPIC_API_KEY,` |
| src\config\config.ts | 59 | `grokApiKey: process.env.GROK_API_KEY,` |
| src\config\config.ts | 60 | `openaiApiKey: process.env.OPENAI_API_KEY,` |
| src\config\config.ts | 63 | `claudeModelName: process.env.CLAUDE_MODEL_NAME \|\| 'claude-3-opus-20240229',` |
| src\config\config.ts | 64 | `grokModelName: process.env.GROK_MODEL_NAME \|\| 'grok-1',` |
| src\config\config.ts | 65 | `gptModelName: process.env.GPT_MODEL_NAME \|\| 'gpt-4-turbo',` |
| src\config\config.ts | 68 | `maxTokens: parseInt(process.env.LLM_MAX_TOKENS \|\| '4000'),` |
| src\config\config.ts | 69 | `timeout: parseInt(process.env.LLM_TIMEOUT \|\| '30000') // 30 seconds` |
| src\config\db-config.ts | 13 | `connectionString: process.env.NODE_ENV === 'production'` |
| src\config\db-config.ts | 14 | `? process.env.MAIN_DATABASE_URL` |
| src\config\db-config.ts | 15 | `: process.env.DEV_MAIN_DATABASE_URL,` |
| src\config\db-config.ts | 16 | `ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false` |
| src\config\db-config.ts | 21 | `connectionString: process.env.NODE_ENV === 'production'` |
| src\config\db-config.ts | 22 | `? process.env.PHI_DATABASE_URL` |
| src\config\db-config.ts | 23 | `: process.env.DEV_PHI_DATABASE_URL,` |
| src\config\db-config.ts | 24 | `ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false` |
| src\config\db-config.ts | 29 | `console.log('Environment:', process.env.NODE_ENV);` |
| src\config\db-config.ts | 30 | `console.log('MAIN_DATABASE_URL:', process.env.NODE_ENV === 'production'` |
| src\config\db-config.ts | 31 | `? process.env.MAIN_DATABASE_URL` |
| src\config\db-config.ts | 32 | `: process.env.DEV_MAIN_DATABASE_URL);` |
| src\config\db-config.ts | 33 | `console.log('PHI_DATABASE_URL:', process.env.NODE_ENV === 'production'` |
| src\config\db-config.ts | 34 | `? process.env.PHI_DATABASE_URL` |
| src\config\db-config.ts | 35 | `: process.env.DEV_PHI_DATABASE_URL);` |
| src\config\memorydb.ts | 17 | `const memoryDbHost = process.env.MEMORYDB_HOST \|\| 'localhost';` |
| src\config\memorydb.ts | 18 | `const memoryDbPort = parseInt(process.env.MEMORYDB_PORT \|\| '6379');` |
| src\config\memorydb.ts | 19 | `const memoryDbUser = process.env.MEMORYDB_USER;` |
| src\config\memorydb.ts | 20 | `const memoryDbPassword = process.env.MEMORYDB_PASSWORD;` |
| src\config\redis.ts | 21 | `const redisHost = process.env.REDIS_CLOUD_HOST \|\| 'localhost';` |
| src\config\redis.ts | 22 | `const redisPort = parseInt(process.env.REDIS_CLOUD_PORT \|\| '6379');` |
| src\config\redis.ts | 23 | `const redisPassword = process.env.REDIS_CLOUD_PASSWORD;` |
| src\controllers\billing\create-subscription.ts | 35 | `const priceTier1Id = process.env.STRIPE_PRICE_ID_TIER_1;` |
| src\controllers\billing\create-subscription.ts | 36 | `const priceTier2Id = process.env.STRIPE_PRICE_ID_TIER_2;` |
| src\controllers\billing\create-subscription.ts | 37 | `const priceTier3Id = process.env.STRIPE_PRICE_ID_TIER_3;` |
| src\controllers\uploads\validate-confirm-upload-request.ts | 47 | `const isTestEnvironment = process.env.NODE_ENV === 'test' \|\| req.headers['x-test-mode'] === 'true';` |
| src\middleware\auth\authenticate-jwt.ts | 25 | `console.log('JWT Secret:', process.env.JWT_SECRET?.substring(0, 3) + '...');` |
| src\middleware\auth\authenticate-jwt.ts | 28 | `const decoded = jwt.verify(token, process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here') as AuthTokenPayload;` |
| src\services\auth\organization\create-admin-user.ts | 13 | `const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS \|\| '10');` |
| src\services\auth\organization\verify-registration-key.ts | 5 | `const registrationKey = process.env.REGISTRATION_KEY;` |
| src\services\billing\stripe\webhooks\utils.ts | 6 | `export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY \|\| '', {` |
| src\services\billing\stripe\webhooks\verify-signature.ts | 11 | `const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;` |
| src\services\notification\services\account-notifications.ts | 31 | `frontendUrl: process.env.FRONTEND_URL \|\| 'https://app.radorderpad.com'` |
| src\services\notification\services\account-notifications.ts | 59 | `frontendUrl: process.env.FRONTEND_URL \|\| 'https://app.radorderpad.com'` |
| src\services\notification\templates\email-template-base.ts | 23 | `return data.frontendUrl as string \|\| process.env.FRONTEND_URL \|\| 'https://app.radorderpad.com';` |
| src\services\upload\document-upload.service.ts | 35 | `const isTestMode = process.env.NODE_ENV === 'test' \|\|` |
| src\utils\logger.ts | 22 | `const env = process.env.NODE_ENV \|\| 'development';` |
| src\utils\token.utils.ts | 17 | `const secret = process.env.JWT_SECRET \|\| 'default_jwt_secret';` |
| src\utils\token.utils.ts | 18 | `const expiresIn = process.env.JWT_EXPIRES_IN \|\| '24h';` |
| test-all-cases-optimized.js | 16 | `const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;` |
| test-comprehensive-prompt.js | 12 | `const API_BASE_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000';` |
| test-comprehensive-prompt.js | 13 | `const API_PATH = process.env.API_PATH \|\| '/api';` |
| test-comprehensive-prompt.js | 15 | `const AUTH_TOKEN = process.env.TEST_AUTH_TOKEN; // JWT token for authentication` |
| test-config.js | 8 | `baseUrl: process.env.API_BASE_URL \|\| 'http://localhost:3000/api',` |
| test-config.js | 9 | `jwtSecret: process.env.JWT_SECRET \|\| '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112'` |
| test-config.js | 14 | `container: process.env.DB_CONTAINER \|\| 'radorderpad-postgres',` |
| test-config.js | 15 | `host: process.env.DB_HOST \|\| 'localhost',` |
| test-config.js | 16 | `port: process.env.DB_PORT \|\| 5433,` |
| test-config.js | 17 | `user: process.env.DB_USER \|\| 'postgres',` |
| test-config.js | 18 | `password: process.env.DB_PASSWORD \|\| 'postgres123',` |
| test-config.js | 19 | `mainDb: process.env.MAIN_DB \|\| 'radorder_main',` |
| test-config.js | 20 | `phiDb: process.env.PHI_DB \|\| 'radorder_phi'` |
| test-config.js | 25 | `anthropicApiKey: process.env.ANTHROPIC_API_KEY,` |
| test-config.js | 26 | `grokApiKey: process.env.GROK_API_KEY,` |
| test-config.js | 27 | `openaiApiKey: process.env.OPENAI_API_KEY,` |
| test-config.js | 28 | `claudeModelName: process.env.CLAUDE_MODEL_NAME \|\| 'claude-3-7-sonnet-20250219',` |
| test-config.js | 29 | `grokModelName: process.env.GROK_MODEL_NAME \|\| 'grok-3',` |
| test-config.js | 30 | `gptModelName: process.env.GPT_MODEL_NAME \|\| 'gpt-4-turbo'` |
| test-direct-prompt.js | 12 | `const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY;` |
| test-token-optimization.js | 15 | `const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;` |
| test-validation-engine.js | 4 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDU1NzQ4MCwiZXhwIjoxNzQ0NjQzODgwfQ.LNPodxOGryfJj3xt7YBkHY4qvjQMx67XT8JyJm2Hg40';` |
| tests\batch\run-fixed-e2e-tests.sh | 14 | `JWT_SECRET=$(node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');")` |
| tests\batch\run-registration-onboarding-tests.bat | 14 | `for /f "tokens=*" %%a in ('node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');"') do set JWT_SECRET=%%a` |
| tests\batch\run-registration-onboarding-tests.sh | 14 | `JWT_SECRET=$(node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');")` |
| tests\batch\run-scenario-a-fixed.bat | 14 | `for /f "tokens=*" %%a in ('node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');"') do set JWT_SECRET=%%a` |
| tests\batch\run-scenario-b-fixed.bat | 14 | `for /f "tokens=*" %%a in ('node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');"') do set JWT_SECRET=%%a` |
| tests\batch\test-billing-subscriptions.js | 20 | `const TEST_PRICE_ID = process.env.STRIPE_PRICE_ID_TIER_1 \|\| 'price_tier1_monthly';` |
| tests\batch\test-file-upload.js | 10 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| helpers.generateToken(config.testData.adminStaff);` |
| tests\batch\test-stripe-webhook-handlers.js | 20 | `const API_URL = process.env.API_URL \|\| 'http://localhost:3000';` |
| tests\batch\test-stripe-webhook-handlers.js | 21 | `const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET \|\| 'whsec_test_webhook_secret';` |
| tests\batch\test-stripe-webhook-handlers.js | 71 | `TEST_TOKEN = process.env.TEST_TOKEN \|\| fs.readFileSync('./test-token.txt', 'utf8').trim();` |
| tests\billing-checkout.test.js | 6 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoiYWRtaW5fcmVmZXJyaW5nIiwiZW1haWwiOiJ0ZXN0LmFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ0NTc1NTM4LCJleHAiOjE3NDQ2NjE5Mzh9.gnTcT9gQoz1RNmvo6A_DWAolelanr0ilBvn6PylJK9k';` |
| tests\clinical-workflow-simulation.js | 24 | `const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY \|\| config.llm.anthropicApiKey;` |
| tests\clinical-workflow-simulation.js | 25 | `const GROK_API_KEY = process.env.GROK_API_KEY \|\| config.llm.grokApiKey;` |
| tests\clinical-workflow-simulation.js | 26 | `const OPENAI_API_KEY = process.env.OPENAI_API_KEY \|\| config.llm.openaiApiKey;` |
| tests\clinical-workflow-simulation.js | 226 | `model: process.env.GPT_MODEL_NAME \|\| 'gpt-4-turbo',` |
| tests\clinical-workflow-simulation.js | 314 | `model: process.env.GPT_MODEL_NAME \|\| 'gpt-4-turbo',` |
| tests\e2e\run_comprehensive_tests.js | 15 | `const API_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000/api';` |
| tests\e2e\run_comprehensive_tests.js | 16 | `const JWT_SECRET = process.env.JWT_SECRET \|\| '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112';` |
| tests\file-upload-test.js | 8 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDY3MzE5MywiZXhwIjoxNzQ0NzU5NTkzfQ.bkBAUApAhSS0t2vRiYY2ZXlKdmaPRqCIsSO_HokX84Y';` |
| tests\file-upload.test.js | 7 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDU3NTUzOCwiZXhwIjoxNzQ0NjYxOTM4fQ.gnTcT9gQoz1RNmvo6A_DWAolelanr0ilBvn6PylJK9k';` |
| tests\llm-validation-flow-test.js | 35 | `const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY \|\| config.llm.anthropicApiKey;` |
| tests\llm-validation-flow-test.js | 36 | `const GROK_API_KEY = process.env.GROK_API_KEY \|\| config.llm.grokApiKey;` |
| tests\llm-validation-flow-test.js | 37 | `const OPENAI_API_KEY = process.env.OPENAI_API_KEY \|\| config.llm.openaiApiKey;` |
| tests\llm-validation-flow-test.js | 182 | `model: process.env.GROK_MODEL_NAME \|\| 'grok-3-latest',` |
| tests\llm-validation-flow-test.js | 275 | `model: process.env.GPT_MODEL_NAME \|\| 'gpt-4-turbo',` |
| tests\stripe-webhooks.test.js | 16 | `const API_BASE_URL = (process.env.API_BASE_URL \|\| helpers.config.api.baseUrl \|\| 'http://localhost:3000').replace(/\/api$/, '');` |
| tests\stripe-webhooks.test.js | 17 | `const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET \|\| 'whsec_test_secret';` |
| tests\test-notifications.js | 23 | `const TEST_EMAIL = process.env.TEST_EMAIL \|\| 'test@example.com';` |
| tests\test-notifications.js | 98 | `console.log(`Email test mode: ${process.env.EMAIL_TEST_MODE === 'true' ? 'ENABLED' : 'DISABLED'}`);` |
| tests\test-notifications.js | 100 | `if (process.env.EMAIL_TEST_MODE !== 'true') {` |
| tests\test-notifications.js | 113 | `if (process.env.EMAIL_TEST_MODE === 'true') {` |
| tests\test-redis-basic.js | 20 | `const memoryDbHost = process.env.MEMORYDB_HOST \|\| 'localhost';` |
| tests\test-redis-basic.js | 21 | `const memoryDbPort = parseInt(process.env.MEMORYDB_PORT \|\| '6379');` |
| tests\test-redis-basic.js | 22 | `const memoryDbUser = process.env.MEMORYDB_USER;` |
| tests\test-redis-basic.js | 23 | `const memoryDbPassword = process.env.MEMORYDB_PASSWORD;` |
| tests\test-redis-search-direct.js | 86 | `const originalRedisHost = process.env.REDIS_CLOUD_HOST;` |
| tests\test-redis-search-direct.js | 87 | `const originalRedisPort = process.env.REDIS_CLOUD_PORT;` |
| tests\test-redis-search-direct.js | 90 | `process.env.REDIS_CLOUD_HOST = 'invalid-host';` |
| tests\test-redis-search-direct.js | 91 | `process.env.REDIS_CLOUD_PORT = '9999';` |
| tests\test-redis-search-direct.js | 130 | `process.env.REDIS_CLOUD_HOST = originalRedisHost;` |
| tests\test-redis-search-direct.js | 131 | `process.env.REDIS_CLOUD_PORT = originalRedisPort;` |
| tests\test-redis-search-direct.js | 138 | `process.env.REDIS_CLOUD_HOST = originalRedisHost;` |
| tests\test-redis-search-direct.js | 139 | `process.env.REDIS_CLOUD_PORT = originalRedisPort;` |
| tests\test-redis-search-direct.js | 147 | `process.env.REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST_ORIGINAL;` |
| tests\test-redis-search-direct.js | 148 | `process.env.REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT_ORIGINAL;` |
| tests\test-redis-search-direct.js | 162 | `process.env.REDIS_CLOUD_HOST_ORIGINAL = process.env.REDIS_CLOUD_HOST;` |
| tests\test-redis-search-direct.js | 163 | `process.env.REDIS_CLOUD_PORT_ORIGINAL = process.env.REDIS_CLOUD_PORT;` |
| tests\test-redis-search-direct.js | 181 | `process.env.REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST_ORIGINAL;` |
| tests\test-redis-search-direct.js | 182 | `process.env.REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT_ORIGINAL;` |
| tests\test-redis-search-with-fallback.js | 41 | `testToken = process.env.TEST_TOKEN \|\| 'test-token';` |
| tests\test-redis-search-with-fallback.js | 45 | `const baseUrl = process.env.API_URL \|\| 'http://localhost:3000';` |
| tests\test-redis-search-with-fallback.js | 163 | `const originalRedisHost = process.env.REDIS_CLOUD_HOST;` |
| tests\test-redis-search-with-fallback.js | 164 | `const originalRedisPort = process.env.REDIS_CLOUD_PORT;` |
| tests\test-redis-search-with-fallback.js | 167 | `process.env.REDIS_CLOUD_HOST = 'invalid-host';` |
| tests\test-redis-search-with-fallback.js | 168 | `process.env.REDIS_CLOUD_PORT = '9999';` |
| tests\test-redis-search-with-fallback.js | 213 | `process.env.REDIS_CLOUD_HOST = originalRedisHost;` |
| tests\test-redis-search-with-fallback.js | 214 | `process.env.REDIS_CLOUD_PORT = originalRedisPort;` |
| tests\test-redis-search-with-fallback.js | 225 | `process.env.REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST_ORIGINAL;` |
| tests\test-redis-search-with-fallback.js | 226 | `process.env.REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT_ORIGINAL;` |
| tests\test-redis-search-with-fallback.js | 250 | `process.env.REDIS_CLOUD_HOST_ORIGINAL = process.env.REDIS_CLOUD_HOST;` |
| tests\test-redis-search-with-fallback.js | 251 | `process.env.REDIS_CLOUD_PORT_ORIGINAL = process.env.REDIS_CLOUD_PORT;` |
| tests\test-redis-search-with-fallback.js | 269 | `process.env.REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST_ORIGINAL;` |
| tests\test-redis-search-with-fallback.js | 270 | `process.env.REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT_ORIGINAL;` |
| tests\test-redis-search.js | 27 | `const testToken = process.env.TEST_TOKEN \|\| 'test-token';` |
| tests\test-redis-search.js | 30 | `const baseUrl = process.env.API_URL \|\| 'http://localhost:3000';` |
| tests\test-ses-email.js | 21 | `const TEST_EMAIL = process.env.TEST_EMAIL \|\| 'test@example.com';` |
| tests\test-ses-email.js | 22 | `const FROM_EMAIL = process.env.SES_FROM_EMAIL \|\| 'no-reply@radorderpad.com';` |
| tests\test-ses-email.js | 26 | `region: process.env.AWS_REGION \|\| 'us-east-2',` |
| tests\test-ses-email.js | 28 | `accessKeyId: process.env.AWS_ACCESS_KEY_ID \|\| '',` |
| tests\test-ses-email.js | 29 | `secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY \|\| ''` |
| tests\test-ses-email.js | 42 | `const testMode = process.env.EMAIL_TEST_MODE === 'true';` |

### API base URL reference (73 matches)

| File | Line | Content |
| ---- | ---- | ------- |
| debug-scripts\audit-deployment-config.js | 21 | `{ pattern: 'API_BASE_URL', description: 'API base URL reference' },` |
| test-comprehensive-prompt.js | 12 | `const API_BASE_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000';` |
| test-comprehensive-prompt.js | 14 | `const API_URL = `${API_BASE_URL}${API_PATH}`;` |
| test-config.js | 8 | `baseUrl: process.env.API_BASE_URL \|\| 'http://localhost:3000/api',` |
| test-radiology-export.bat | 13 | `REM Use API_BASE_URL from environment or fallback to default` |
| test-radiology-export.bat | 14 | `if not defined API_BASE_URL (` |
| test-radiology-export.bat | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| test-radiology-export.bat | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| test-radiology-export.bat | 20 | `set BASE_URL=%API_BASE_URL%` |
| test-radiology-export.sh | 13 | `# Use API_BASE_URL from environment or fallback to default` |
| test-radiology-export.sh | 14 | `if [ -z "$API_BASE_URL" ]; then` |
| test-radiology-export.sh | 15 | `echo "WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api"` |
| test-radiology-export.sh | 16 | `API_BASE_URL="http://localhost:3000/api"` |
| test-radiology-export.sh | 20 | `BASE_URL="$API_BASE_URL"` |
| test-superadmin-api-with-token.bat | 13 | `REM Use API_BASE_URL from environment or fallback to default` |
| test-superadmin-api-with-token.bat | 14 | `if not defined API_BASE_URL (` |
| test-superadmin-api-with-token.bat | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| test-superadmin-api-with-token.bat | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| test-superadmin-api-with-token.bat | 20 | `set BASE_URL=%API_BASE_URL%` |
| test-superadmin-api.bat | 13 | `REM Use API_BASE_URL from environment or fallback to default` |
| test-superadmin-api.bat | 14 | `if not defined API_BASE_URL (` |
| test-superadmin-api.bat | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| test-superadmin-api.bat | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| test-superadmin-api.bat | 20 | `set BASE_URL=%API_BASE_URL%` |
| test-superadmin-api.sh | 13 | `# Use API_BASE_URL from environment or fallback to default` |
| test-superadmin-api.sh | 14 | `if [ -z "$API_BASE_URL" ]; then` |
| test-superadmin-api.sh | 15 | `echo "WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api"` |
| test-superadmin-api.sh | 16 | `API_BASE_URL="http://localhost:3000/api"` |
| test-superadmin-api.sh | 20 | `BASE_URL=$API_BASE_URL` |
| tests\batch\run-admin-send-to-radiology-tests.bat | 10 | `for /f "tokens=*" %%a in ('node -e "const config = require(\"./test-config\"); console.log(config.api.baseUrl);"') do set API_BASE_URL=%%a` |
| tests\batch\run-admin-send-to-radiology-tests.bat | 11 | `echo Using API base URL: %API_BASE_URL%` |
| tests\batch\run-admin-send-to-radiology-tests.sh | 10 | `API_BASE_URL=$(node -e "const config = require('./test-config'); console.log(config.api.baseUrl);")` |
| tests\batch\run-admin-send-to-radiology-tests.sh | 11 | `echo "Using API base URL: $API_BASE_URL"` |
| tests\batch\run-validation-tests.bat | 6 | `echo Usage: run-validation-tests.bat ^<JWT_TOKEN^> [API_BASE_URL]` |
| tests\batch\run-validation-tests.bat | 15 | `:: Check if API_BASE_URL is provided as a second argument` |
| tests\batch\run-validation-tests.bat | 17 | `set API_BASE_URL=%~2` |
| tests\batch\run-validation-tests.bat | 20 | `set API_BASE_URL=http://localhost:3000/api` |
| tests\batch\run-validation-tests.sh | 6 | `echo "Usage: ./run-validation-tests.sh <JWT_TOKEN> [API_BASE_URL]"` |
| tests\batch\run-validation-tests.sh | 14 | `# Check if API_BASE_URL is provided as a second argument` |
| tests\batch\run-validation-tests.sh | 16 | `export API_BASE_URL=$2` |
| tests\batch\run-validation-tests.sh | 19 | `export API_BASE_URL=http://localhost:3000/api` |
| tests\batch\test-admin-send-to-radiology.js | 13 | `const API_BASE_URL = helpers.config.api.baseUrl;` |
| tests\batch\test-admin-send-to-radiology.js | 14 | `const VALIDATION_ENDPOINT = `${API_BASE_URL}/orders/validate`;` |
| tests\batch\test-admin-send-to-radiology.js | 15 | `const FINALIZATION_ENDPOINT = `${API_BASE_URL}/orders`;` |
| tests\batch\test-admin-send-to-radiology.js | 16 | `const SEND_TO_RADIOLOGY_ENDPOINT = `${API_BASE_URL}/admin/orders`;` |
| tests\batch\test-billing-subscriptions.js | 15 | `const API_BASE_URL = helpers.config.api.baseUrl;` |
| tests\batch\test-billing-subscriptions.js | 16 | `const SUBSCRIPTIONS_ENDPOINT = `${API_BASE_URL}/billing/subscriptions`;` |
| tests\batch\test-file-upload.js | 9 | `const API_BASE_URL = config.api.baseUrl;` |
| tests\batch\test-file-upload.js | 28 | `const response = await fetch(`${API_BASE_URL}${endpoint}`, options);` |
| tests\batch\test-order-finalization.js | 13 | `const API_BASE_URL = testConfig.api.baseUrl;` |
| tests\batch\test-order-finalization.js | 14 | `const VALIDATION_ENDPOINT = `${API_BASE_URL}/orders/validate`;` |
| tests\batch\test-order-finalization.js | 15 | `const FINALIZATION_ENDPOINT = `${API_BASE_URL}/orders`;` |
| tests\batch\test-superadmin-api.js | 11 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| tests\batch\test-superadmin-api.js | 12 | `const ORGANIZATIONS_ENDPOINT = `${API_BASE_URL}/superadmin/organizations`;` |
| tests\batch\test-superadmin-api.js | 13 | `const USERS_ENDPOINT = `${API_BASE_URL}/superadmin/users`;` |
| tests\billing-checkout.test.js | 5 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| tests\billing-checkout.test.js | 22 | `const response = await fetch(`${API_BASE_URL}${endpoint}`, options);` |
| tests\clinical-workflow-simulation.js | 23 | `const API_BASE_URL = config.api.baseUrl;` |
| tests\clinical-workflow-simulation.js | 196 | `const response = await axios.post(`${API_BASE_URL}/orders/validate`, payload, {` |
| tests\clinical-workflow-simulation.js | 274 | `const response = await axios.post(`${API_BASE_URL}/orders/${orderId}/clarify`, {` |
| tests\clinical-workflow-simulation.js | 384 | `const finalValidationResponse = await axios.post(`${API_BASE_URL}/orders/validate`, validationPayload, {` |
| tests\clinical-workflow-simulation.js | 426 | `const submissionResponse = await axios.put(`${API_BASE_URL}/orders/${orderId}`, submissionPayload, {` |
| tests\e2e\run_comprehensive_tests.js | 15 | `const API_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000/api';` |
| tests\file-upload-test.js | 7 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| tests\file-upload-test.js | 25 | `const response = await fetch(`${API_BASE_URL}${endpoint}`, options);` |
| tests\file-upload.test.js | 6 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| tests\file-upload.test.js | 27 | `const response = await fetch(`${API_BASE_URL}${endpoint}`, options);` |
| tests\llm-validation-flow-test.js | 34 | `const API_BASE_URL = config.api.baseUrl;` |
| tests\llm-validation-flow-test.js | 41 | `console.log(`API Base URL: ${API_BASE_URL}`);` |
| tests\llm-validation-flow-test.js | 234 | `const response = await axios.post(`${API_BASE_URL}/orders/validate`, {` |
| tests\llm-validation-flow-test.js | 323 | `const response = await axios.post(`${API_BASE_URL}/orders/${orderId}/clarify`, {` |
| tests\stripe-webhooks.test.js | 16 | `const API_BASE_URL = (process.env.API_BASE_URL \|\| helpers.config.api.baseUrl \|\| 'http://localhost:3000').replace(/\/api$/, '');` |
| tests\stripe-webhooks.test.js | 18 | `const WEBHOOK_ENDPOINT = `${API_BASE_URL}/api/webhooks/stripe`;` |

### Database URL reference (97 matches)

| File | Line | Content |
| ---- | ---- | ------- |
| db-migrations\aws-postgres-migration.js | 53 | `options.sourceMain = process.env.MAIN_DATABASE_URL \|\| process.env.DEV_MAIN_DATABASE_URL;` |
| db-migrations\aws-postgres-migration.js | 54 | `options.sourcePhi = process.env.PHI_DATABASE_URL \|\| process.env.DEV_PHI_DATABASE_URL;` |
| db-migrations\aws-postgres-migration.js | 55 | `options.targetMain = process.env.PROD_MAIN_DATABASE_URL;` |
| db-migrations\aws-postgres-migration.js | 56 | `options.targetPhi = process.env.PROD_PHI_DATABASE_URL;` |
| debug-scripts\audit-deployment-config.js | 22 | `{ pattern: 'DATABASE_URL', description: 'Database URL reference' },` |
| debug-scripts\import_cpt_codes_only.bat | 9 | `if defined MAIN_DATABASE_URL (` |
| debug-scripts\import_cpt_codes_only.bat | 10 | `REM Parse the DATABASE_URL to extract connection details` |
| debug-scripts\import_cpt_codes_only.bat | 11 | `for /f "tokens=1,2,3 delims=:/" %%a in ("%MAIN_DATABASE_URL%") do (` |
| debug-scripts\import_cpt_codes_only.js | 123 | `if defined MAIN_DATABASE_URL (` |
| debug-scripts\import_cpt_codes_only.js | 124 | `REM Parse the DATABASE_URL to extract connection details` |
| debug-scripts\import_cpt_codes_only.js | 125 | `for /f "tokens=1,2,3 delims=:/" %%a in ("%MAIN_DATABASE_URL%") do (` |
| deploy-to-aws.bat | 16 | `set MAIN_DATABASE_URL=postgresql://username:password@hostname:port/radorder_main` |
| deploy-to-aws.bat | 17 | `set PHI_DATABASE_URL=postgresql://username:password@hostname:port/radorder_phi` |
| deploy-to-aws.bat | 70 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=MAIN_DATABASE_URL,Value=%MAIN_DATABASE_URL% ^` |
| deploy-to-aws.bat | 71 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=PHI_DATABASE_URL,Value=%PHI_DATABASE_URL% ^` |
| deploy-to-aws.sh | 17 | `MAIN_DATABASE_URL="postgresql://username:password@hostname:port/radorder_main"` |
| deploy-to-aws.sh | 18 | `PHI_DATABASE_URL="postgresql://username:password@hostname:port/radorder_phi"` |
| deploy-to-aws.sh | 63 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=MAIN_DATABASE_URL,Value=$MAIN_DATABASE_URL \` |
| deploy-to-aws.sh | 64 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=PHI_DATABASE_URL,Value=$PHI_DATABASE_URL \` |
| eb-options.json | 9 | `"OptionName": "MAIN_DATABASE_URL",` |
| eb-options.json | 14 | `"OptionName": "PHI_DATABASE_URL",` |
| scripts\prepare-stripe-test-data.js | 27 | `connectionString: process.env.MAIN_DATABASE_URL` |
| scripts\query-db.js | 30 | `connectionString: process.env.MAIN_DATABASE_URL` |
| sql-scripts\import_icd10_batched.js | 138 | `if [ -n "$MAIN_DATABASE_URL" ]; then` |
| sql-scripts\import_icd10_batched.js | 139 | `# Extract connection details from DATABASE_URL` |
| sql-scripts\import_icd10_batched.js | 140 | `DB_USER=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/([^:]+):.+$/\\1/')` |
| sql-scripts\import_icd10_batched.js | 141 | `DB_PASS=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/[^:]+:([^@]+).+$/\\1/')` |
| sql-scripts\import_icd10_batched.js | 142 | `DB_HOST=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/[^@]+@([^:]+):.+$/\\1/')` |
| sql-scripts\import_icd10_batched.js | 143 | `DB_PORT=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/[^:]+:[^@]+@[^:]+:([0-9]+)\\/.+$/\\1/')` |
| sql-scripts\import_icd10_batched.js | 144 | `DB_NAME=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/[^:]+:[^@]+@[^:]+:[0-9]+\\/(.+)$/\\1/')` |
| sql-scripts\import_icd10_batched.js | 206 | `if defined MAIN_DATABASE_URL (` |
| sql-scripts\import_icd10_batched.js | 207 | `REM Parse the DATABASE_URL to extract connection details` |
| sql-scripts\import_icd10_batched.js | 208 | `for /f "tokens=1,2,3 delims=:/" %%a in ("%MAIN_DATABASE_URL%") do (` |
| sql-scripts\import_other_tables.js | 175 | `if [ -n "$MAIN_DATABASE_URL" ]; then` |
| sql-scripts\import_other_tables.js | 176 | `# Extract connection details from DATABASE_URL` |
| sql-scripts\import_other_tables.js | 177 | `DB_USER=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/([^:]+):.+$/\\1/')` |
| sql-scripts\import_other_tables.js | 178 | `DB_PASS=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/[^:]+:([^@]+).+$/\\1/')` |
| sql-scripts\import_other_tables.js | 179 | `DB_HOST=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/[^@]+@([^:]+):.+$/\\1/')` |
| sql-scripts\import_other_tables.js | 180 | `DB_PORT=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/[^:]+:[^@]+@[^:]+:([0-9]+)\\/.+$/\\1/')` |
| sql-scripts\import_other_tables.js | 181 | `DB_NAME=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/[^:]+:[^@]+@[^:]+:[0-9]+\\/(.+)$/\\1/')` |
| sql-scripts\import_other_tables.js | 253 | `if defined MAIN_DATABASE_URL (` |
| sql-scripts\import_other_tables.js | 254 | `REM Parse the DATABASE_URL to extract connection details` |
| sql-scripts\import_other_tables.js | 255 | `for /f "tokens=1,2,3 delims=:/" %%a in ("%MAIN_DATABASE_URL%") do (` |
| src\config\config.ts | 13 | `mainDatabaseUrl: process.env.MAIN_DATABASE_URL,` |
| src\config\config.ts | 14 | `phiDatabaseUrl: process.env.PHI_DATABASE_URL,` |
| src\config\db-config.ts | 14 | `? process.env.MAIN_DATABASE_URL` |
| src\config\db-config.ts | 15 | `: process.env.DEV_MAIN_DATABASE_URL,` |
| src\config\db-config.ts | 22 | `? process.env.PHI_DATABASE_URL` |
| src\config\db-config.ts | 23 | `: process.env.DEV_PHI_DATABASE_URL,` |
| src\config\db-config.ts | 30 | `console.log('MAIN_DATABASE_URL:', process.env.NODE_ENV === 'production'` |
| src\config\db-config.ts | 31 | `? process.env.MAIN_DATABASE_URL` |
| src\config\db-config.ts | 32 | `: process.env.DEV_MAIN_DATABASE_URL);` |
| src\config\db-config.ts | 33 | `console.log('PHI_DATABASE_URL:', process.env.NODE_ENV === 'production'` |
| src\config\db-config.ts | 34 | `? process.env.PHI_DATABASE_URL` |
| src\config\db-config.ts | 35 | `: process.env.DEV_PHI_DATABASE_URL);` |
| tests\batch\import_icd10_batched.bat | 9 | `if defined MAIN_DATABASE_URL (` |
| tests\batch\import_icd10_batched.bat | 10 | `REM Parse the DATABASE_URL to extract connection details` |
| tests\batch\import_icd10_batched.bat | 11 | `for /f "tokens=1,2,3 delims=:/" %%a in ("%MAIN_DATABASE_URL%") do (` |
| tests\batch\import_icd10_batched.sh | 15 | `if [ -n "$MAIN_DATABASE_URL" ]; then` |
| tests\batch\import_icd10_batched.sh | 16 | `# Extract connection details from DATABASE_URL` |
| tests\batch\import_icd10_batched.sh | 17 | `DB_USER=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/([^:]+):.+$/\1/')` |
| tests\batch\import_icd10_batched.sh | 18 | `DB_PASS=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:([^@]+).+$/\1/')` |
| tests\batch\import_icd10_batched.sh | 19 | `DB_HOST=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^@]+@([^:]+):.+$/\1/')` |
| tests\batch\import_icd10_batched.sh | 20 | `DB_PORT=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:[^@]+@[^:]+:([0-9]+)\/.+$/\1/')` |
| tests\batch\import_icd10_batched.sh | 21 | `DB_NAME=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:[^@]+@[^:]+:[0-9]+\/(.+)$/\1/')` |
| tests\batch\import_medical_data.bat | 19 | `if defined MAIN_DATABASE_URL (` |
| tests\batch\import_medical_data.bat | 20 | `REM Parse the DATABASE_URL to extract connection details` |
| tests\batch\import_medical_data.bat | 22 | `for /f "tokens=1,2,3 delims=:/" %%a in ("%MAIN_DATABASE_URL%") do (` |
| tests\batch\import_medical_data.sh | 16 | `# If MAIN_DATABASE_URL is set, use it; otherwise use individual PG* variables` |
| tests\batch\import_medical_data.sh | 17 | `if [ -n "$MAIN_DATABASE_URL" ]; then` |
| tests\batch\import_medical_data.sh | 18 | `# Extract connection details from DATABASE_URL` |
| tests\batch\import_medical_data.sh | 20 | `DB_USER=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/([^:]+):.+$/\1/')` |
| tests\batch\import_medical_data.sh | 21 | `DB_PASS=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:([^@]+).+$/\1/')` |
| tests\batch\import_medical_data.sh | 22 | `DB_HOST=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^@]+@([^:]+):.+$/\1/')` |
| tests\batch\import_medical_data.sh | 23 | `DB_PORT=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:[^@]+@[^:]+:([0-9]+)\/.+$/\1/')` |
| tests\batch\import_medical_data.sh | 24 | `DB_NAME=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:[^@]+@[^:]+:[0-9]+\/(.+)$/\1/')` |
| tests\batch\import_other_tables.bat | 10 | `if defined MAIN_DATABASE_URL (` |
| tests\batch\import_other_tables.bat | 11 | `REM Parse the DATABASE_URL to extract connection details` |
| tests\batch\import_other_tables.bat | 12 | `for /f "tokens=1,2,3 delims=:/" %%a in ("%MAIN_DATABASE_URL%") do (` |
| tests\batch\import_other_tables.sh | 16 | `if [ -n "$MAIN_DATABASE_URL" ]; then` |
| tests\batch\import_other_tables.sh | 17 | `# Extract connection details from DATABASE_URL` |
| tests\batch\import_other_tables.sh | 18 | `DB_USER=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/([^:]+):.+$/\1/')` |
| tests\batch\import_other_tables.sh | 19 | `DB_PASS=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:([^@]+).+$/\1/')` |
| tests\batch\import_other_tables.sh | 20 | `DB_HOST=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^@]+@([^:]+):.+$/\1/')` |
| tests\batch\import_other_tables.sh | 21 | `DB_PORT=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:[^@]+@[^:]+:([0-9]+)\/.+$/\1/')` |
| tests\batch\import_other_tables.sh | 22 | `DB_NAME=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:[^@]+@[^:]+:[0-9]+\/(.+)$/\1/')` |
| tests\batch\verify_import.bat | 18 | `if defined MAIN_DATABASE_URL (` |
| tests\batch\verify_import.bat | 19 | `REM Parse the DATABASE_URL to extract connection details` |
| tests\batch\verify_import.bat | 21 | `for /f "tokens=1,2,3 delims=:/" %%a in ("%MAIN_DATABASE_URL%") do (` |
| tests\batch\verify_import.sh | 15 | `# If MAIN_DATABASE_URL is set, use it; otherwise use individual PG* variables` |
| tests\batch\verify_import.sh | 16 | `if [ -n "$MAIN_DATABASE_URL" ]; then` |
| tests\batch\verify_import.sh | 17 | `# Extract connection details from DATABASE_URL` |
| tests\batch\verify_import.sh | 19 | `DB_USER=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/([^:]+):.+$/\1/')` |
| tests\batch\verify_import.sh | 20 | `DB_PASS=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:([^@]+).+$/\1/')` |
| tests\batch\verify_import.sh | 21 | `DB_HOST=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^@]+@([^:]+):.+$/\1/')` |
| tests\batch\verify_import.sh | 22 | `DB_PORT=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:[^@]+@[^:]+:([0-9]+)\/.+$/\1/')` |
| tests\batch\verify_import.sh | 23 | `DB_NAME=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:[^@]+@[^:]+:[0-9]+\/(.+)$/\1/')` |

### Redis configuration reference (45 matches)

| File | Line | Content |
| ---- | ---- | ------- |
| debug-scripts\audit-deployment-config.js | 23 | `{ pattern: 'REDIS_', description: 'Redis configuration reference' },` |
| deploy-to-aws.bat | 18 | `set REDIS_CLOUD_HOST=your-redis-host` |
| deploy-to-aws.bat | 19 | `set REDIS_CLOUD_PORT=your-redis-port` |
| deploy-to-aws.bat | 20 | `set REDIS_CLOUD_PASSWORD=your-redis-password` |
| deploy-to-aws.bat | 72 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=REDIS_CLOUD_HOST,Value=%REDIS_CLOUD_HOST% ^` |
| deploy-to-aws.bat | 73 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=REDIS_CLOUD_PORT,Value=%REDIS_CLOUD_PORT% ^` |
| deploy-to-aws.bat | 74 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=REDIS_CLOUD_PASSWORD,Value=%REDIS_CLOUD_PASSWORD% ^` |
| deploy-to-aws.sh | 19 | `REDIS_CLOUD_HOST="your-redis-host"` |
| deploy-to-aws.sh | 20 | `REDIS_CLOUD_PORT="your-redis-port"` |
| deploy-to-aws.sh | 21 | `REDIS_CLOUD_PASSWORD="your-redis-password"` |
| deploy-to-aws.sh | 65 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=REDIS_CLOUD_HOST,Value=$REDIS_CLOUD_HOST \` |
| deploy-to-aws.sh | 66 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=REDIS_CLOUD_PORT,Value=$REDIS_CLOUD_PORT \` |
| deploy-to-aws.sh | 67 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=REDIS_CLOUD_PASSWORD,Value=$REDIS_CLOUD_PASSWORD \` |
| eb-options.json | 19 | `"OptionName": "REDIS_CLOUD_HOST",` |
| eb-options.json | 24 | `"OptionName": "REDIS_CLOUD_PORT",` |
| eb-options.json | 29 | `"OptionName": "REDIS_CLOUD_PASSWORD",` |
| src\config\redis.ts | 21 | `const redisHost = process.env.REDIS_CLOUD_HOST \|\| 'localhost';` |
| src\config\redis.ts | 22 | `const redisPort = parseInt(process.env.REDIS_CLOUD_PORT \|\| '6379');` |
| src\config\redis.ts | 23 | `const redisPassword = process.env.REDIS_CLOUD_PASSWORD;` |
| tests\test-redis-search-direct.js | 86 | `const originalRedisHost = process.env.REDIS_CLOUD_HOST;` |
| tests\test-redis-search-direct.js | 87 | `const originalRedisPort = process.env.REDIS_CLOUD_PORT;` |
| tests\test-redis-search-direct.js | 90 | `process.env.REDIS_CLOUD_HOST = 'invalid-host';` |
| tests\test-redis-search-direct.js | 91 | `process.env.REDIS_CLOUD_PORT = '9999';` |
| tests\test-redis-search-direct.js | 130 | `process.env.REDIS_CLOUD_HOST = originalRedisHost;` |
| tests\test-redis-search-direct.js | 131 | `process.env.REDIS_CLOUD_PORT = originalRedisPort;` |
| tests\test-redis-search-direct.js | 138 | `process.env.REDIS_CLOUD_HOST = originalRedisHost;` |
| tests\test-redis-search-direct.js | 139 | `process.env.REDIS_CLOUD_PORT = originalRedisPort;` |
| tests\test-redis-search-direct.js | 147 | `process.env.REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST_ORIGINAL;` |
| tests\test-redis-search-direct.js | 148 | `process.env.REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT_ORIGINAL;` |
| tests\test-redis-search-direct.js | 162 | `process.env.REDIS_CLOUD_HOST_ORIGINAL = process.env.REDIS_CLOUD_HOST;` |
| tests\test-redis-search-direct.js | 163 | `process.env.REDIS_CLOUD_PORT_ORIGINAL = process.env.REDIS_CLOUD_PORT;` |
| tests\test-redis-search-direct.js | 181 | `process.env.REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST_ORIGINAL;` |
| tests\test-redis-search-direct.js | 182 | `process.env.REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT_ORIGINAL;` |
| tests\test-redis-search-with-fallback.js | 163 | `const originalRedisHost = process.env.REDIS_CLOUD_HOST;` |
| tests\test-redis-search-with-fallback.js | 164 | `const originalRedisPort = process.env.REDIS_CLOUD_PORT;` |
| tests\test-redis-search-with-fallback.js | 167 | `process.env.REDIS_CLOUD_HOST = 'invalid-host';` |
| tests\test-redis-search-with-fallback.js | 168 | `process.env.REDIS_CLOUD_PORT = '9999';` |
| tests\test-redis-search-with-fallback.js | 213 | `process.env.REDIS_CLOUD_HOST = originalRedisHost;` |
| tests\test-redis-search-with-fallback.js | 214 | `process.env.REDIS_CLOUD_PORT = originalRedisPort;` |
| tests\test-redis-search-with-fallback.js | 225 | `process.env.REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST_ORIGINAL;` |
| tests\test-redis-search-with-fallback.js | 226 | `process.env.REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT_ORIGINAL;` |
| tests\test-redis-search-with-fallback.js | 250 | `process.env.REDIS_CLOUD_HOST_ORIGINAL = process.env.REDIS_CLOUD_HOST;` |
| tests\test-redis-search-with-fallback.js | 251 | `process.env.REDIS_CLOUD_PORT_ORIGINAL = process.env.REDIS_CLOUD_PORT;` |
| tests\test-redis-search-with-fallback.js | 269 | `process.env.REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST_ORIGINAL;` |
| tests\test-redis-search-with-fallback.js | 270 | `process.env.REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT_ORIGINAL;` |

### JWT configuration reference (153 matches)

| File | Line | Content |
| ---- | ---- | ------- |
| debug-scripts\audit-deployment-config.js | 24 | `{ pattern: 'JWT_', description: 'JWT configuration reference' },` |
| debug-scripts\test-concurrent-orders.js | 10 | `const JWT_SECRET = process.env.JWT_SECRET \|\| '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112';` |
| debug-scripts\test-concurrent-orders.js | 22 | `return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });` |
| debug-scripts\test-validation-endpoint-direct.js | 9 | `const JWT_SECRET = process.env.JWT_SECRET \|\| '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112';` |
| debug-scripts\test-validation-endpoint-direct.js | 20 | `return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });` |
| deploy-to-aws.bat | 21 | `set JWT_SECRET=your-jwt-secret` |
| deploy-to-aws.bat | 75 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=JWT_SECRET,Value=%JWT_SECRET% ^` |
| deploy-to-aws.sh | 22 | `JWT_SECRET="your-jwt-secret"` |
| deploy-to-aws.sh | 68 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=JWT_SECRET,Value=$JWT_SECRET \` |
| eb-options.json | 34 | `"OptionName": "JWT_SECRET",` |
| generate-superadmin-token.js | 6 | `const jwtSecret = process.env.JWT_SECRET \|\| 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';` |
| generate-superadmin-token.js | 29 | `console.log('export JWT_TOKEN=<token>');` |
| generate-test-token.js | 6 | `const jwtSecret = process.env.JWT_SECRET \|\| 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';` |
| generate-test-token.js | 29 | `console.log('export JWT_TOKEN=<token>');` |
| old_code\src\middleware\auth.middleware.ts | 31 | `console.log('JWT Secret:', process.env.JWT_SECRET?.substring(0, 3) + '...');` |
| old_code\src\middleware\auth.middleware.ts | 34 | `const decoded = jwt.verify(token, process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here') as AuthTokenPayload;` |
| scripts\test-validation-engine-with-fallback.js | 15 | `const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NTE4NTk5NCwiZXhwIjoxNzQ1MjcyMzk0fQ.CPle3x1WWqYMklkIsh79J4ZKdW4l05Jv1XW_nQHh_WI';` |
| scripts\test-validation-engine-with-fallback.js | 74 | `'Authorization': `Bearer ${JWT_TOKEN}`` |
| src\config\config.ts | 17 | `jwtSecret: process.env.JWT_SECRET \|\| 'default_jwt_secret_key_change_in_production',` |
| src\config\config.ts | 18 | `jwtExpiresIn: process.env.JWT_EXPIRES_IN \|\| '24h',` |
| src\middleware\auth\authenticate-jwt.ts | 25 | `console.log('JWT Secret:', process.env.JWT_SECRET?.substring(0, 3) + '...');` |
| src\middleware\auth\authenticate-jwt.ts | 28 | `const decoded = jwt.verify(token, process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here') as AuthTokenPayload;` |
| src\utils\token.utils.ts | 17 | `const secret = process.env.JWT_SECRET \|\| 'default_jwt_secret';` |
| src\utils\token.utils.ts | 18 | `const expiresIn = process.env.JWT_EXPIRES_IN \|\| '24h';` |
| test-config.js | 9 | `jwtSecret: process.env.JWT_SECRET \|\| '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112'` |
| test-radiology-export.bat | 11 | `set AUTH_TOKEN=%JWT_TEST_TOKEN%` |
| test-superadmin-api.bat | 11 | `set AUTH_TOKEN=%JWT_TEST_TOKEN%` |
| test-superadmin-api.sh | 11 | `AUTH_TOKEN=$JWT_TEST_TOKEN` |
| test-validation-engine-updated.js | 7 | `const JWT_TOKEN = fs.readFileSync('./test-token.txt', 'utf8').trim();` |
| test-validation-engine-updated.js | 38 | `'Authorization': `Bearer ${JWT_TOKEN}`` |
| test-validation-engine.js | 4 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDU1NzQ4MCwiZXhwIjoxNzQ0NjQzODgwfQ.LNPodxOGryfJj3xt7YBkHY4qvjQMx67XT8JyJm2Hg40';` |
| test-validation-engine.js | 35 | `'Authorization': `Bearer ${JWT_TOKEN}`` |
| tests\batch\run-admin-send-to-radiology-tests.bat | 6 | `for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const token = helpers.generateToken(helpers.config.testData.adminReferring); console.log(token);"') do set JWT_TOKEN=%%a` |
| tests\batch\run-admin-send-to-radiology-tests.bat | 7 | `echo Token generated: %JWT_TOKEN:~0,20%...` |
| tests\batch\run-admin-send-to-radiology-tests.bat | 14 | `node test-admin-send-to-radiology.js %JWT_TOKEN%` |
| tests\batch\run-admin-send-to-radiology-tests.sh | 6 | `JWT_TOKEN=$(node -e "const helpers = require('./test-helpers'); const token = helpers.generateToken(helpers.config.testData.adminStaff); console.log(token);")` |
| tests\batch\run-admin-send-to-radiology-tests.sh | 7 | `echo "Token generated: ${JWT_TOKEN:0:20}..."` |
| tests\batch\run-admin-send-to-radiology-tests.sh | 14 | `node test-admin-send-to-radiology.js "$JWT_TOKEN"` |
| tests\batch\run-all-tests.bat | 11 | `for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const token = helpers.generateToken(helpers.config.testData.physician); console.log(token);"') do set JWT_TOKEN=%%a` |
| tests\batch\run-all-tests.bat | 12 | `echo Token generated: %JWT_TOKEN:~0,20%...` |
| tests\batch\run-all-tests.bat | 16 | `call ..\..\run-validation-tests.bat %JWT_TOKEN% > test-results\validation-tests.log 2>&1` |
| tests\batch\run-all-tests.sh | 11 | `JWT_TOKEN=$(node -e "const helpers = require('./test-helpers'); const token = helpers.generateToken(helpers.config.testData.physician); console.log(token);")` |
| tests\batch\run-all-tests.sh | 12 | `echo "Token generated: ${JWT_TOKEN:0:20}..."` |
| tests\batch\run-all-tests.sh | 16 | `../../run-validation-tests.sh "$JWT_TOKEN" > test-results/validation-tests.log 2>&1` |
| tests\batch\run-file-upload-tests.bat | 6 | `for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./tests/batch/test-helpers\"); const adminUser = { userId: 1, orgId: 1, role: \"admin_referring\", email: \"test.admin@example.com\" }; const token = helpers.generateToken(adminUser); console.log(token);"') do set JWT_TOKEN=%%a` |
| tests\batch\run-file-upload-tests.bat | 7 | `echo Token generated (first 20 chars): %JWT_TOKEN:~0,20%...` |
| tests\batch\run-fixed-e2e-tests.sh | 13 | `# Set the JWT_SECRET environment variable` |
| tests\batch\run-fixed-e2e-tests.sh | 14 | `JWT_SECRET=$(node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');")` |
| tests\batch\run-fixed-e2e-tests.sh | 15 | `export JWT_SECRET` |
| tests\batch\run-order-finalization-tests.bat | 7 | `for /f "tokens=*" %%a in ('node -e "const jwt = require(\"jsonwebtoken\"); const secret = \"79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112\"; const payload = { userId: 1, orgId: 1, role: \"physician\", email: \"test.physician@example.com\" }; const token = jwt.sign(payload, secret, { expiresIn: \"24h\" }); console.log(token);"') do set JWT_TOKEN=%%a` |
| tests\batch\run-order-finalization-tests.bat | 8 | `echo Token generated: %JWT_TOKEN:~0,20%...` |
| tests\batch\run-order-finalization-tests.bat | 15 | `node test-order-finalization.js %JWT_TOKEN% > test-results\order-finalization-tests.log 2>&1` |
| tests\batch\run-order-finalization-tests.sh | 7 | `JWT_TOKEN=$(node -e "const jwt = require(\"jsonwebtoken\"); const secret = \"79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112\"; const payload = { userId: 1, orgId: 1, role: \"physician\", email: \"test.physician@example.com\" }; const token = jwt.sign(payload, secret, { expiresIn: \"24h\" }); console.log(token);")` |
| tests\batch\run-order-finalization-tests.sh | 8 | `echo "Token generated: ${JWT_TOKEN:0:20}..."` |
| tests\batch\run-order-finalization-tests.sh | 15 | `node ./test-order-finalization.js $JWT_TOKEN > test-results/order-finalization-tests.log 2>&1` |
| tests\batch\run-registration-onboarding-tests.bat | 13 | `REM Set the JWT_TOKEN environment variable` |
| tests\batch\run-registration-onboarding-tests.bat | 14 | `for /f "tokens=*" %%a in ('node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');"') do set JWT_SECRET=%%a` |
| tests\batch\run-registration-onboarding-tests.sh | 13 | `# Set the JWT_TOKEN environment variable` |
| tests\batch\run-registration-onboarding-tests.sh | 14 | `JWT_SECRET=$(node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');")` |
| tests\batch\run-registration-onboarding-tests.sh | 15 | `export JWT_SECRET` |
| tests\batch\run-scenario-a-fixed.bat | 13 | `REM Set the JWT_SECRET environment variable` |
| tests\batch\run-scenario-a-fixed.bat | 14 | `for /f "tokens=*" %%a in ('node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');"') do set JWT_SECRET=%%a` |
| tests\batch\run-scenario-b-fixed.bat | 13 | `REM Set the JWT_SECRET environment variable` |
| tests\batch\run-scenario-b-fixed.bat | 14 | `for /f "tokens=*" %%a in ('node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');"') do set JWT_SECRET=%%a` |
| tests\batch\run-upload-tests.bat | 5 | `set JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDU3NTUzOCwiZXhwIjoxNzQ0NjYxOTM4fQ.gnTcT9gQoz1RNmvo6A_DWAolelanr0ilBvn6PylJK9k` |
| tests\batch\run-upload-tests.sh | 5 | `export JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDU3NTUzOCwiZXhwIjoxNzQ0NjYxOTM4fQ.gnTcT9gQoz1RNmvo6A_DWAolelanr0ilBvn6PylJK9k"` |
| tests\batch\run-validation-tests.bat | 4 | `:: Check if JWT_TOKEN is provided as an argument` |
| tests\batch\run-validation-tests.bat | 6 | `echo Usage: run-validation-tests.bat ^<JWT_TOKEN^> [API_BASE_URL]` |
| tests\batch\run-validation-tests.bat | 13 | `set JWT_TOKEN=%~1` |
| tests\batch\run-validation-tests.sh | 4 | `# Check if JWT_TOKEN is provided as an argument` |
| tests\batch\run-validation-tests.sh | 6 | `echo "Usage: ./run-validation-tests.sh <JWT_TOKEN> [API_BASE_URL]"` |
| tests\batch\run-validation-tests.sh | 12 | `export JWT_TOKEN=$1` |
| tests\batch\test-admin-finalization-debug.bat | 7 | `for /f "tokens=*" %%a in ('node -e "const jwt = require(\"jsonwebtoken\"); const secret = \"79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112\"; const payload = { userId: 2, orgId: 1, role: \"admin_staff\", email: \"test.admin@example.com\" }; const token = jwt.sign(payload, secret, { expiresIn: \"24h\" }); console.log(token);"') do set JWT_TOKEN=%%a` |
| tests\batch\test-admin-finalization-debug.bat | 8 | `echo Token generated: %JWT_TOKEN:~0,20%...` |
| tests\batch\test-admin-finalization-debug.bat | 32 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-summary" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}"` |
| tests\batch\test-admin-finalization-debug.bat | 33 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-summary" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}"` |
| tests\batch\test-admin-finalization-debug.bat | 44 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-supplemental" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}"` |
| tests\batch\test-admin-finalization-debug.bat | 45 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-supplemental" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}"` |
| tests\batch\test-admin-finalization-debug.bat | 66 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/send-to-radiology" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}"` |
| tests\batch\test-admin-finalization-debug.bat | 67 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/send-to-radiology" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}"` |
| tests\batch\test-admin-finalization.bat | 7 | `for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const token = helpers.generateToken(helpers.config.testData.adminStaff); console.log(token);"') do set JWT_TOKEN=%%a` |
| tests\batch\test-admin-finalization.bat | 8 | `echo Token generated: %JWT_TOKEN:~0,20%...` |
| tests\batch\test-admin-finalization.bat | 20 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}" \| findstr /C:"success"` |
| tests\batch\test-admin-finalization.bat | 31 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}" \| findstr /C:"success"` |
| tests\batch\test-admin-finalization.bat | 49 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}" \| findstr /C:"success"` |
| tests\batch\test-admin-finalization.sh | 7 | `JWT_TOKEN=$(node -e "const helpers = require('./test-helpers'); const token = helpers.generateToken(helpers.config.testData.adminStaff); console.log(token);")` |
| tests\batch\test-admin-finalization.sh | 8 | `echo "Token generated: ${JWT_TOKEN:0:20}..."` |
| tests\batch\test-admin-finalization.sh | 19 | `RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{"pastedText":"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789"}')` |
| tests\batch\test-admin-finalization.sh | 31 | `RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{"pastedText":"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings"}')` |
| tests\batch\test-admin-finalization.sh | 49 | `RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{}')` |
| tests\batch\test-connection-management.bat | 7 | `for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const adminUser = { userId: 1, orgId: 1, role: \"admin_referring\", email: \"test.admin@example.com\" }; const token = helpers.generateToken(adminUser); console.log(token);"') do set JWT_TOKEN=%%a` |
| tests\batch\test-connection-management.bat | 8 | `echo Token generated: %JWT_TOKEN:~0,20%...` |
| tests\batch\test-connection-management.bat | 12 | `for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const targetUser = { userId: 2, orgId: 2, role: \"admin_referring\", email: \"target.admin@example.com\" }; const token = helpers.generateToken(targetUser); console.log(token);"') do set TARGET_JWT_TOKEN=%%a` |
| tests\batch\test-connection-management.bat | 13 | `echo Token generated: %TARGET_JWT_TOKEN:~0,20%...` |
| tests\batch\test-connection-management.bat | 19 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"connections"` |
| tests\batch\test-connection-management.bat | 30 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"targetOrgId\":2,\"notes\":\"Test connection request\"}" \| findstr /C:"success"` |
| tests\batch\test-connection-management.bat | 45 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %TARGET_JWT_TOKEN%" \| findstr /C:"requests"` |
| tests\batch\test-connection-management.bat | 56 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %TARGET_JWT_TOKEN%" \| findstr /C:"success"` |
| tests\batch\test-connection-management.bat | 67 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"active"` |
| tests\batch\test-connection-management.bat | 78 | `curl -s -X DELETE "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"success"` |
| tests\batch\test-connection-management.bat | 89 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"targetOrgId\":2,\"notes\":\"Test connection request again\"}" \| findstr /C:"success"` |
| tests\batch\test-connection-management.bat | 103 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %TARGET_JWT_TOKEN%" \| findstr /C:"success"` |
| tests\batch\test-file-upload.js | 10 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| helpers.generateToken(config.testData.adminStaff);` |
| tests\batch\test-file-upload.js | 12 | `console.log('Using JWT token:', JWT_TOKEN);` |
| tests\batch\test-file-upload.js | 19 | `'Authorization': `Bearer ${JWT_TOKEN}`,` |
| tests\batch\test-location-management.bat | 7 | `for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const adminUser = { userId: 1, orgId: 1, role: \"admin_referring\", email: \"test.admin@example.com\" }; const token = helpers.generateToken(adminUser); console.log(token);"') do set JWT_TOKEN=%%a` |
| tests\batch\test-location-management.bat | 8 | `echo Token generated: %JWT_TOKEN:~0,20%...` |
| tests\batch\test-location-management.bat | 14 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"locations"` |
| tests\batch\test-location-management.bat | 25 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"name\":\"Test Location\",\"address_line1\":\"123 Test St\",\"city\":\"Test City\",\"state\":\"TS\",\"zip_code\":\"12345\",\"phone_number\":\"555-123-4567\"}" \| findstr /C:"success"` |
| tests\batch\test-location-management.bat | 35 | `for /f "tokens=*" %%a in ('curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"name\":\"Test Location\",\"address_line1\":\"123 Test St\",\"city\":\"Test City\",\"state\":\"TS\",\"zip_code\":\"12345\",\"phone_number\":\"555-123-4567\"}" ^\| node -e "const data = JSON.parse(require(\"fs\").readFileSync(0, \"utf-8\")); console.log(data.location.id);"') do set LOCATION_ID=%%a` |
| tests\batch\test-location-management.bat | 42 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"location"` |
| tests\batch\test-location-management.bat | 53 | `curl -s -X PUT "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"name\":\"Updated Test Location\",\"address_line1\":\"456 Test Ave\",\"city\":\"Test City\",\"state\":\"TS\",\"zip_code\":\"12345\",\"phone_number\":\"555-123-4567\"}" \| findstr /C:"success"` |
| tests\batch\test-location-management.bat | 64 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"success"` |
| tests\batch\test-location-management.bat | 75 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"locations"` |
| tests\batch\test-location-management.bat | 86 | `curl -s -X DELETE "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"success"` |
| tests\batch\test-location-management.bat | 97 | `curl -s -X DELETE "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"success"` |
| tests\batch\test-location-management.sh | 7 | `JWT_TOKEN=$(node -e "const helpers = require('./test-helpers'); const adminUser = { userId: 1, orgId: 1, role: \"admin_referring\", email: \"test.admin@example.com\" }; const token = helpers.generateToken(adminUser); console.log(token);")` |
| tests\batch\test-location-management.sh | 8 | `echo "Token generated: ${JWT_TOKEN:0:20}..."` |
| tests\batch\test-location-management.sh | 14 | `RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| tests\batch\test-location-management.sh | 26 | `RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{"name":"Test Location","address_line1":"123 Test St","city":"Test City","state":"TS","zip_code":"12345","phone_number":"555-123-4567"}')` |
| tests\batch\test-location-management.sh | 36 | `LOCATION_RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" \| grep "id")` |
| tests\batch\test-location-management.sh | 47 | `RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| tests\batch\test-location-management.sh | 59 | `RESPONSE=$(curl -s -X PUT "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{"name":"Updated Test Location","address_line1":"456 Test Ave","city":"Test City","state":"TS","zip_code":"12345","phone_number":"555-123-4567"}')` |
| tests\batch\test-location-management.sh | 71 | `RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| tests\batch\test-location-management.sh | 83 | `RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| tests\batch\test-location-management.sh | 95 | `RESPONSE=$(curl -s -X DELETE "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| tests\batch\test-location-management.sh | 107 | `RESPONSE=$(curl -s -X DELETE "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| tests\batch\test-radiology-workflow.bat | 7 | `for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const schedulerUser = { userId: 3, orgId: 2, role: \"scheduler\", email: \"test.scheduler@example.com\" }; const token = helpers.generateToken(schedulerUser); console.log(token);"') do set JWT_TOKEN=%%a` |
| tests\batch\test-radiology-workflow.bat | 8 | `echo Token generated: %JWT_TOKEN:~0,20%...` |
| tests\batch\test-radiology-workflow.bat | 20 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"orders"` |
| tests\batch\test-radiology-workflow.bat | 31 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"order"` |
| tests\batch\test-radiology-workflow.bat | 42 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"order"` |
| tests\batch\test-radiology-workflow.bat | 53 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"order_id"` |
| tests\batch\test-radiology-workflow.bat | 64 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"newStatus\":\"scheduled\"}" \| findstr /C:"success"` |
| tests\batch\test-radiology-workflow.bat | 82 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"requestedInfoType\":\"labs\",\"requestedInfoDetails\":\"Need recent creatinine levels for contrast administration\"}" \| findstr /C:"success"` |
| tests\batch\test-radiology-workflow.sh | 7 | `JWT_TOKEN=$(node -e "const helpers = require('./test-helpers'); const schedulerUser = { userId: 3, orgId: 2, role: \"scheduler\", email: \"test.scheduler@example.com\" }; const token = helpers.generateToken(schedulerUser); console.log(token);")` |
| tests\batch\test-radiology-workflow.sh | 8 | `echo "Token generated: ${JWT_TOKEN:0:20}..."` |
| tests\batch\test-radiology-workflow.sh | 19 | `RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| tests\batch\test-radiology-workflow.sh | 31 | `RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| tests\batch\test-radiology-workflow.sh | 43 | `RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| tests\batch\test-radiology-workflow.sh | 55 | `RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| tests\batch\test-radiology-workflow.sh | 67 | `RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{"newStatus":"scheduled"}')` |
| tests\batch\test-radiology-workflow.sh | 85 | `RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{"requestedInfoType":"labs","requestedInfoDetails":"Need recent creatinine levels for contrast administration"}')` |
| tests\billing-checkout.test.js | 6 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoiYWRtaW5fcmVmZXJyaW5nIiwiZW1haWwiOiJ0ZXN0LmFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ0NTc1NTM4LCJleHAiOjE3NDQ2NjE5Mzh9.gnTcT9gQoz1RNmvo6A_DWAolelanr0ilBvn6PylJK9k';` |
| tests\billing-checkout.test.js | 13 | `'Authorization': `Bearer ${JWT_TOKEN}`,` |
| tests\e2e\run_comprehensive_tests.js | 16 | `const JWT_SECRET = process.env.JWT_SECRET \|\| '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112';` |
| tests\e2e\run_comprehensive_tests.js | 27 | `JWT_SECRET,` |
| tests\e2e\run_comprehensive_tests.js | 33 | `JWT_SECRET,` |
| tests\e2e\run_comprehensive_tests.js | 39 | `JWT_SECRET,` |
| tests\file-upload-test.js | 8 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDY3MzE5MywiZXhwIjoxNzQ0NzU5NTkzfQ.bkBAUApAhSS0t2vRiYY2ZXlKdmaPRqCIsSO_HokX84Y';` |
| tests\file-upload-test.js | 15 | `'Authorization': `Bearer ${JWT_TOKEN}`,` |
| tests\file-upload.test.js | 7 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDU3NTUzOCwiZXhwIjoxNzQ0NjYxOTM4fQ.gnTcT9gQoz1RNmvo6A_DWAolelanr0ilBvn6PylJK9k';` |
| tests\file-upload.test.js | 18 | `'Authorization': `Bearer ${JWT_TOKEN}`,` |

### AWS configuration reference (15 matches)

| File | Line | Content |
| ---- | ---- | ------- |
| db-migrations\migrate-to-aws.bat | 20 | `findstr /C:"PROD_DB_PASSWORD=YOUR_AWS_RDS_PASSWORD" .env >nul` |
| db-migrations\migrate-to-aws.bat | 26 | `powershell -Command "(Get-Content .env) -replace 'PROD_DB_PASSWORD=YOUR_AWS_RDS_PASSWORD', 'PROD_DB_PASSWORD=%DB_PASSWORD%' \| Set-Content .env"` |
| db-migrations\migrate-to-aws.bat | 27 | `powershell -Command "(Get-Content .env) -replace 'postgres:YOUR_AWS_RDS_PASSWORD@', ('postgres:' + '%DB_PASSWORD%' + '@') \| Set-Content .env"` |
| db-migrations\test-aws-connection.bat | 55 | `powershell -Command "(Get-Content .env) -replace 'PROD_DB_PASSWORD=YOUR_AWS_RDS_PASSWORD', 'PROD_DB_PASSWORD=%DB_PASSWORD%' \| Set-Content .env"` |
| db-migrations\test-aws-connection.bat | 56 | `powershell -Command "(Get-Content .env) -replace 'postgres:YOUR_AWS_RDS_PASSWORD@', ('postgres:' + '%DB_PASSWORD%' + '@') \| Set-Content .env"` |
| debug-scripts\audit-deployment-config.js | 25 | `{ pattern: 'AWS_', description: 'AWS configuration reference' },` |
| deploy-to-aws.bat | 85 | `for /f "tokens=*" %%a in ('aws sts get-caller-identity --query "Account" --output text') do set AWS_ACCOUNT=%%a` |
| deploy-to-aws.bat | 93 | `--source-bundle S3Bucket="elasticbeanstalk-%REGION%-%AWS_ACCOUNT%",S3Key="%APP_NAME%/deployment.zip" ^` |
| deploy-to-aws.bat | 98 | `aws s3 cp deployment.zip "s3://elasticbeanstalk-%REGION%-%AWS_ACCOUNT%/%APP_NAME%/deployment.zip"` |
| src\config\config.ts | 28 | `accessKeyId: process.env.AWS_ACCESS_KEY_ID,` |
| src\config\config.ts | 29 | `secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,` |
| src\config\config.ts | 30 | `region: process.env.AWS_REGION \|\| 'us-east-2',` |
| tests\test-ses-email.js | 26 | `region: process.env.AWS_REGION \|\| 'us-east-2',` |
| tests\test-ses-email.js | 28 | `accessKeyId: process.env.AWS_ACCESS_KEY_ID \|\| '',` |
| tests\test-ses-email.js | 29 | `secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY \|\| ''` |

### Stripe configuration reference (32 matches)

| File | Line | Content |
| ---- | ---- | ------- |
| debug-scripts\audit-deployment-config.js | 26 | `{ pattern: 'STRIPE_', description: 'Stripe configuration reference' }` |
| old_code\src\services\billing\stripe\stripe-webhooks.ts | 7 | `const stripe = new Stripe(process.env.STRIPE_SECRET_KEY \|\| '', {` |
| old_code\src\services\billing\stripe\stripe-webhooks.ts | 18 | `const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;` |
| old_code\src\services\billing\stripe\stripe-webhooks.ts | 21 | `throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');` |
| old_code\stripe.service.ts | 12 | `console.warn('STRIPE_SECRET_KEY is not set. Stripe functionality will be limited.');` |
| old_code\stripe.service.ts | 43 | `throw new Error('STRIPE_WEBHOOK_SECRET is not set');` |
| src\config\config.ts | 42 | `secretKey: process.env.STRIPE_SECRET_KEY,` |
| src\config\config.ts | 43 | `webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,` |
| src\config\config.ts | 45 | `creditBundlePriceId: process.env.STRIPE_PRICE_ID_CREDIT_BUNDLE,` |
| src\controllers\billing\create-subscription.ts | 34 | `// These should be defined in .env as STRIPE_PRICE_ID_TIER_1, STRIPE_PRICE_ID_TIER_2, STRIPE_PRICE_ID_TIER_3` |
| src\controllers\billing\create-subscription.ts | 35 | `const priceTier1Id = process.env.STRIPE_PRICE_ID_TIER_1;` |
| src\controllers\billing\create-subscription.ts | 36 | `const priceTier2Id = process.env.STRIPE_PRICE_ID_TIER_2;` |
| src\controllers\billing\create-subscription.ts | 37 | `const priceTier3Id = process.env.STRIPE_PRICE_ID_TIER_3;` |
| src\services\billing\stripe\webhooks\utils.ts | 6 | `export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY \|\| '', {` |
| src\services\billing\stripe\webhooks\verify-signature.ts | 11 | `const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;` |
| src\services\billing\stripe\webhooks\verify-signature.ts | 14 | `throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');` |
| test-stripe-webhooks-cli.bat | 25 | `set STRIPE_CUSTOMER_ID=cus_TEST123456` |
| test-stripe-webhooks-cli.bat | 29 | `node scripts/prepare-stripe-test-data.js --org-id=%ORG_ID% --customer-id=%STRIPE_CUSTOMER_ID%` |
| test-stripe-webhooks-cli.sh | 23 | `STRIPE_CUSTOMER_ID=cus_TEST123456` |
| test-stripe-webhooks-cli.sh | 27 | `node scripts/prepare-stripe-test-data.js --org-id=$ORG_ID --customer-id=$STRIPE_CUSTOMER_ID` |
| test-stripe-webhooks-cli.sh | 36 | `STRIPE_PID=$!` |
| test-stripe-webhooks-cli.sh | 109 | `kill $STRIPE_PID` |
| tests\batch\test-billing-subscriptions.js | 20 | `const TEST_PRICE_ID = process.env.STRIPE_PRICE_ID_TIER_1 \|\| 'price_tier1_monthly';` |
| tests\batch\test-stripe-webhook-handlers.js | 21 | `const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET \|\| 'whsec_test_webhook_secret';` |
| tests\batch\test-stripe-webhook-handlers.js | 45 | `secret: secret \|\| STRIPE_WEBHOOK_SECRET,` |
| tests\batch\test-stripe-webhook-handlers.js | 57 | `.createHmac('sha256', secret \|\| STRIPE_WEBHOOK_SECRET)` |
| tests\batch\test-stripe-webhook-handlers.js | 122 | `secret: STRIPE_WEBHOOK_SECRET,` |
| tests\stripe-webhooks.test.js | 17 | `const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET \|\| 'whsec_test_secret';` |
| tests\stripe-webhooks.test.js | 208 | `secret: STRIPE_WEBHOOK_SECRET,` |
| tests\stripe-webhooks.test.js | 242 | `secret: STRIPE_WEBHOOK_SECRET,` |
| tests\stripe-webhooks.test.js | 274 | `secret: STRIPE_WEBHOOK_SECRET,` |
| tests\stripe-webhooks.test.js | 348 | `secret: STRIPE_WEBHOOK_SECRET,` |

## Results by File

### compare_prompts.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 12 | `host: process.env.DB_HOST \|\| 'localhost',` |
| process.env | 12 | `host: process.env.DB_HOST \|\| 'localhost',` |
| process.env | 13 | `port: process.env.DB_PORT \|\| 5433,` |
| process.env | 14 | `database: process.env.DB_NAME \|\| 'radorder_main',` |
| process.env | 15 | `user: process.env.DB_USER \|\| 'postgres',` |
| process.env | 16 | `password: process.env.DB_PASSWORD \|\| 'postgres123'` |

### db-migrations\aws-postgres-migration.js (8 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 53 | `options.sourceMain = process.env.MAIN_DATABASE_URL \|\| process.env.DEV_MAIN_DATABASE_URL;` |
| process.env | 54 | `options.sourcePhi = process.env.PHI_DATABASE_URL \|\| process.env.DEV_PHI_DATABASE_URL;` |
| process.env | 55 | `options.targetMain = process.env.PROD_MAIN_DATABASE_URL;` |
| process.env | 56 | `options.targetPhi = process.env.PROD_PHI_DATABASE_URL;` |
| DATABASE_URL | 53 | `options.sourceMain = process.env.MAIN_DATABASE_URL \|\| process.env.DEV_MAIN_DATABASE_URL;` |
| DATABASE_URL | 54 | `options.sourcePhi = process.env.PHI_DATABASE_URL \|\| process.env.DEV_PHI_DATABASE_URL;` |
| DATABASE_URL | 55 | `options.targetMain = process.env.PROD_MAIN_DATABASE_URL;` |
| DATABASE_URL | 56 | `options.targetPhi = process.env.PROD_PHI_DATABASE_URL;` |

### db-migrations\migrate-to-aws.bat (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| AWS_ | 20 | `findstr /C:"PROD_DB_PASSWORD=YOUR_AWS_RDS_PASSWORD" .env >nul` |
| AWS_ | 26 | `powershell -Command "(Get-Content .env) -replace 'PROD_DB_PASSWORD=YOUR_AWS_RDS_PASSWORD', 'PROD_DB_PASSWORD=%DB_PASSWORD%' \| Set-Content .env"` |
| AWS_ | 27 | `powershell -Command "(Get-Content .env) -replace 'postgres:YOUR_AWS_RDS_PASSWORD@', ('postgres:' + '%DB_PASSWORD%' + '@') \| Set-Content .env"` |

### db-migrations\test-aws-connection.bat (2 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| AWS_ | 55 | `powershell -Command "(Get-Content .env) -replace 'PROD_DB_PASSWORD=YOUR_AWS_RDS_PASSWORD', 'PROD_DB_PASSWORD=%DB_PASSWORD%' \| Set-Content .env"` |
| AWS_ | 56 | `powershell -Command "(Get-Content .env) -replace 'postgres:YOUR_AWS_RDS_PASSWORD@', ('postgres:' + '%DB_PASSWORD%' + '@') \| Set-Content .env"` |

### debug-scripts\activate-comprehensive-prompt.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\activate-lean-template.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\add-test-medical-data.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\add-word-limit-to-prompt-16.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\analyze-database-tables.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\analyze_duplicates_and_retired_codes.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\audit-deployment-config.js (16 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 16 | `{ pattern: 'localhost', description: 'Localhost reference' },` |
| localhost | 168 | `if (results.byPattern['localhost']?.matches.length > 0 \|\|` |
| localhost | 170 | `markdown += `- **Replace hardcoded localhost references** with environment variables or configuration settings\n`;` |
| 127.0.0.1 | 17 | `{ pattern: '127.0.0.1', description: 'Localhost IP reference' },` |
| 127.0.0.1 | 169 | `results.byPattern['127.0.0.1']?.matches.length > 0) {` |
| http:// | 18 | `{ pattern: 'http://', description: 'HTTP URL (non-secure)' },` |
| http:// | 173 | `if (results.byPattern['http://']?.matches.length > 0) {` |
| 3000 | 19 | `{ pattern: '3000', description: 'Port 3000 reference' },` |
| 3000 | 177 | `if (results.byPattern['3000']?.matches.length > 0) {` |
| process.env | 20 | `{ pattern: 'process.env', description: 'Environment variable usage' },` |
| API_BASE_URL | 21 | `{ pattern: 'API_BASE_URL', description: 'API base URL reference' },` |
| DATABASE_URL | 22 | `{ pattern: 'DATABASE_URL', description: 'Database URL reference' },` |
| REDIS_ | 23 | `{ pattern: 'REDIS_', description: 'Redis configuration reference' },` |
| JWT_ | 24 | `{ pattern: 'JWT_', description: 'JWT configuration reference' },` |
| AWS_ | 25 | `{ pattern: 'AWS_', description: 'AWS configuration reference' },` |
| STRIPE_ | 26 | `{ pattern: 'STRIPE_', description: 'Stripe configuration reference' }` |

### debug-scripts\check-all-prompts.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\check-database-connection.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\check-existing-medical-data.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\check-j18-9-in-database.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\check-last-successful-test.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\check-llm-validation-logs.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\check-phi-database.js (5 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\check-phi-timestamps.js (5 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\check-phi-validation-details.js (5 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\check-prompt-content.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\check-prompt-template-dependencies.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\check-recent-modifications.js (5 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 12 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 14 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 15 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\check-recent-validation-logs.js (5 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\check-server-status.js (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 11 | `host: 'localhost',` |
| 3000 | 2 | `* Script to check if the server is running on port 3000` |
| 3000 | 147 | `const port = 3000;` |

### debug-scripts\check-specialty-configurations.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\check-specialty-table.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\check-timestamp-handling.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\check-word-limit.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\check_db_connection.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\clean-up-prompt-template.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 13 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 14 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 15 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 16 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\clean_and_prepare_database.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\create-hybrid-prompt.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\database-interaction-test.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 17 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 17 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 18 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 19 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 20 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 21 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\debug-csv-export.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 21 | `host: process.env.DB_HOST \|\| 'localhost',` |
| process.env | 21 | `host: process.env.DB_HOST \|\| 'localhost',` |
| process.env | 22 | `port: process.env.DB_PORT \|\| 5433,` |
| process.env | 23 | `database: process.env.PHI_DB \|\| 'radorder_phi',` |
| process.env | 24 | `user: process.env.DB_USER \|\| 'postgres',` |
| process.env | 25 | `password: process.env.DB_PASSWORD \|\| 'postgres123'` |

### debug-scripts\enhanced-test-additional-notes.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 24 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 24 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 25 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 26 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 27 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 28 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\enhanced-test-complex-specialty.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 17 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 17 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 18 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 19 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 20 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 21 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\find-api-server.js (8 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| 3000 | 16 | `// For Windows, use netstat to find processes listening on port 3000` |
| 3000 | 17 | `command = 'netstat -ano \| findstr :3000';` |
| 3000 | 19 | `// For Unix-like systems, use lsof to find processes listening on port 3000` |
| 3000 | 20 | `command = 'lsof -i :3000';` |
| 3000 | 26 | `console.log('No processes found listening on port 3000');` |
| 3000 | 125 | `console.log('Looking for API server processes (listening on port 3000)...');` |
| 3000 | 129 | `console.log('No API server processes found listening on port 3000');` |
| 3000 | 131 | `console.log(`Found ${pids.length} process(es) listening on port 3000:`);` |

### debug-scripts\fix-order-number-duplicates.js (5 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 12 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 14 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 15 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\fix-prompt-template.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 13 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 13 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 14 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 15 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 16 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 17 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\fix_and_import_mappings.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 12 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 13 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 14 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 15 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\fix_and_import_sql.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 12 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 13 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 14 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 15 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\fix_sql_syntax_and_import.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 13 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 14 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 15 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 16 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\fixed-multi-llm-personality-test.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 23 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 23 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 24 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 25 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 26 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 27 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\fixed-peer-to-self-prompt.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\generate_fix_duplicates_sql.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 13 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 14 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 15 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 16 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\get-full-prompt-content.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\get-lean-template.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\get-prompt-by-id.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\get-prompts-14-and-16.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\import_all_medical_data_properly.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\import_cpt_codes_only.bat (4 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 41 | `if "!DB_HOST!"=="" set DB_HOST=localhost` |
| DATABASE_URL | 9 | `if defined MAIN_DATABASE_URL (` |
| DATABASE_URL | 10 | `REM Parse the DATABASE_URL to extract connection details` |
| DATABASE_URL | 11 | `for /f "tokens=1,2,3 delims=:/" %%a in ("%MAIN_DATABASE_URL%") do (` |

### debug-scripts\import_cpt_codes_only.js (4 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 155 | `if "!DB_HOST!"=="" set DB_HOST=localhost` |
| DATABASE_URL | 123 | `if defined MAIN_DATABASE_URL (` |
| DATABASE_URL | 124 | `REM Parse the DATABASE_URL to extract connection details` |
| DATABASE_URL | 125 | `for /f "tokens=1,2,3 delims=:/" %%a in ("%MAIN_DATABASE_URL%") do (` |

### debug-scripts\import_cpt_codes_upsert.js (7 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| localhost | 157 | `set DB_HOST=localhost` |
| process.env | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 13 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 14 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 15 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 16 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\import_cpt_codes_with_password.bat (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 9 | `set DB_HOST=localhost` |

### debug-scripts\import_icd10_codes_efficient.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 13 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 14 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 15 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 16 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\import_icd10_codes_upsert.js (7 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| localhost | 142 | `set DB_HOST=localhost` |
| process.env | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 13 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 14 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 15 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 16 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\import_mappings_and_docs.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 13 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 14 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 15 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 16 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\import_mappings_direct.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 12 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 13 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 14 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 15 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\import_mappings_direct_sql.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 12 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 13 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 14 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 15 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\import_mappings_robust.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 13 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 14 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 15 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 16 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\import_using_node.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 12 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 13 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 14 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 15 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 16 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\import_using_psql.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\import_using_psql_fixed.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 13 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 13 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 14 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 15 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 16 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 17 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\insert-heuristic-enhanced-prompt.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 12 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 13 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 14 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 15 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\insert-peer-to-self-prompt.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\list-all-database-tables.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\list-all-tables.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\list-database-tables.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\list_all_database_tables_detailed.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\multi-llm-personality-test.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 23 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 23 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 24 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 25 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 26 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 27 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\query-active-prompt.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\remove-test-medical-data.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\restore-database.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\restore-specialty-word-counts.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\run_import_cpt_codes_upsert.bat (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 9 | `set DB_HOST=localhost` |

### debug-scripts\run_import_icd10_codes_upsert.bat (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 9 | `set DB_HOST=localhost` |

### debug-scripts\set-active-prompt.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\set-all-specialties-to-33-words.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\setup-ssm-port-forwarding.bat (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 4 | `echo This will create a tunnel from localhost:6379 to the MemoryDB cluster.` |

### debug-scripts\show-comprehensive-prompt.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\show-lean-prompt.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\switch-redis-config.bat (5 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 5 | `echo 1. Development Mode (localhost through SSM tunnel)` |
| localhost | 12 | `echo Switching to Development Mode (localhost through SSM tunnel)...` |
| localhost | 15 | `echo # Using localhost:6379 with SSM port forwarding to MemoryDB >> .env.tmp` |
| localhost | 22 | `echo # Disable TLS when using localhost through SSM tunnel >> .env.tmp` |
| 127.0.0.1 | 17 | `echo MEMORYDB_HOST=127.0.0.1 >> .env.tmp` |

### debug-scripts\test-concurrent-orders.js (8 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 73 | `hostname: 'localhost',` |
| localhost | 85 | `console.log(`[Doctor ${index + 1}] Making ${method} request to http://localhost:${PORT}${endpoint}`);` |
| http:// | 85 | `console.log(`[Doctor ${index + 1}] Making ${method} request to http://localhost:${PORT}${endpoint}`);` |
| 3000 | 9 | `const PORT = 3000;` |
| 3000 | 82 | `timeout: 30000 // 30 second timeout` |
| process.env | 10 | `const JWT_SECRET = process.env.JWT_SECRET \|\| '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112';` |
| JWT_ | 10 | `const JWT_SECRET = process.env.JWT_SECRET \|\| '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112';` |
| JWT_ | 22 | `return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });` |

### debug-scripts\test-database-integrity.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\test-validation-endpoint-direct.js (8 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 45 | `hostname: 'localhost',` |
| localhost | 57 | `console.log(`Making ${method} request to http://localhost:${PORT}${endpoint}`);` |
| http:// | 57 | `console.log(`Making ${method} request to http://localhost:${PORT}${endpoint}`);` |
| 3000 | 8 | `const PORT = 3000;` |
| 3000 | 54 | `timeout: 30000 // 30 second timeout` |
| process.env | 9 | `const JWT_SECRET = process.env.JWT_SECRET \|\| '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112';` |
| JWT_ | 9 | `const JWT_SECRET = process.env.JWT_SECRET \|\| '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112';` |
| JWT_ | 20 | `return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });` |

### debug-scripts\update-active-template.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\update-active-validation-prompt.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\update-lean-prompt-with-isPrimary.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\update-lean-template.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\update-prompt-content.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\update-template-15-directly.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\update-template-15-json-format.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\update-template-field-names-in-db.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\update-word-limit.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 8 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 10 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 11 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 12 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\validate_data_integrity.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 11 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 12 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 13 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 14 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### debug-scripts\verify_medical_data_import.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 9 | `const DB_HOST = process.env.DB_HOST \|\| 'localhost';` |
| process.env | 10 | `const DB_PORT = process.env.DB_PORT \|\| '5433';` |
| process.env | 11 | `const DB_NAME = process.env.DB_NAME \|\| 'radorder_main';` |
| process.env | 12 | `const DB_USER = process.env.DB_USER \|\| 'postgres';` |
| process.env | 13 | `const DB_PASSWORD = process.env.DB_PASSWORD \|\| 'postgres123';` |

### deploy-to-aws.bat (16 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| http:// | 117 | `echo Your application is available at: http://%ENV_URL%` |
| DATABASE_URL | 16 | `set MAIN_DATABASE_URL=postgresql://username:password@hostname:port/radorder_main` |
| DATABASE_URL | 17 | `set PHI_DATABASE_URL=postgresql://username:password@hostname:port/radorder_phi` |
| DATABASE_URL | 70 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=MAIN_DATABASE_URL,Value=%MAIN_DATABASE_URL% ^` |
| DATABASE_URL | 71 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=PHI_DATABASE_URL,Value=%PHI_DATABASE_URL% ^` |
| REDIS_ | 18 | `set REDIS_CLOUD_HOST=your-redis-host` |
| REDIS_ | 19 | `set REDIS_CLOUD_PORT=your-redis-port` |
| REDIS_ | 20 | `set REDIS_CLOUD_PASSWORD=your-redis-password` |
| REDIS_ | 72 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=REDIS_CLOUD_HOST,Value=%REDIS_CLOUD_HOST% ^` |
| REDIS_ | 73 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=REDIS_CLOUD_PORT,Value=%REDIS_CLOUD_PORT% ^` |
| REDIS_ | 74 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=REDIS_CLOUD_PASSWORD,Value=%REDIS_CLOUD_PASSWORD% ^` |
| JWT_ | 21 | `set JWT_SECRET=your-jwt-secret` |
| JWT_ | 75 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=JWT_SECRET,Value=%JWT_SECRET% ^` |
| AWS_ | 85 | `for /f "tokens=*" %%a in ('aws sts get-caller-identity --query "Account" --output text') do set AWS_ACCOUNT=%%a` |
| AWS_ | 93 | `--source-bundle S3Bucket="elasticbeanstalk-%REGION%-%AWS_ACCOUNT%",S3Key="%APP_NAME%/deployment.zip" ^` |
| AWS_ | 98 | `aws s3 cp deployment.zip "s3://elasticbeanstalk-%REGION%-%AWS_ACCOUNT%/%APP_NAME%/deployment.zip"` |

### deploy-to-aws.sh (13 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| http:// | 107 | `echo "Your application is available at: http://$ENV_URL"` |
| DATABASE_URL | 17 | `MAIN_DATABASE_URL="postgresql://username:password@hostname:port/radorder_main"` |
| DATABASE_URL | 18 | `PHI_DATABASE_URL="postgresql://username:password@hostname:port/radorder_phi"` |
| DATABASE_URL | 63 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=MAIN_DATABASE_URL,Value=$MAIN_DATABASE_URL \` |
| DATABASE_URL | 64 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=PHI_DATABASE_URL,Value=$PHI_DATABASE_URL \` |
| REDIS_ | 19 | `REDIS_CLOUD_HOST="your-redis-host"` |
| REDIS_ | 20 | `REDIS_CLOUD_PORT="your-redis-port"` |
| REDIS_ | 21 | `REDIS_CLOUD_PASSWORD="your-redis-password"` |
| REDIS_ | 65 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=REDIS_CLOUD_HOST,Value=$REDIS_CLOUD_HOST \` |
| REDIS_ | 66 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=REDIS_CLOUD_PORT,Value=$REDIS_CLOUD_PORT \` |
| REDIS_ | 67 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=REDIS_CLOUD_PASSWORD,Value=$REDIS_CLOUD_PASSWORD \` |
| JWT_ | 22 | `JWT_SECRET="your-jwt-secret"` |
| JWT_ | 68 | `Namespace=aws:elasticbeanstalk:application:environment,OptionName=JWT_SECRET,Value=$JWT_SECRET \` |

### deployment\package-lock.json (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| 3000 | 4280 | `"caniuse-lite": "^1.0.30001688",` |
| 3000 | 4375 | `"version": "1.0.30001713",` |
| 3000 | 4376 | `"resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001713.tgz",` |

### eb-options.json (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| DATABASE_URL | 9 | `"OptionName": "MAIN_DATABASE_URL",` |
| DATABASE_URL | 14 | `"OptionName": "PHI_DATABASE_URL",` |
| REDIS_ | 19 | `"OptionName": "REDIS_CLOUD_HOST",` |
| REDIS_ | 24 | `"OptionName": "REDIS_CLOUD_PORT",` |
| REDIS_ | 29 | `"OptionName": "REDIS_CLOUD_PASSWORD",` |
| JWT_ | 34 | `"OptionName": "JWT_SECRET",` |

### generate-superadmin-token.js (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 6 | `const jwtSecret = process.env.JWT_SECRET \|\| 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';` |
| JWT_ | 6 | `const jwtSecret = process.env.JWT_SECRET \|\| 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';` |
| JWT_ | 29 | `console.log('export JWT_TOKEN=<token>');` |

### generate-test-token.js (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 6 | `const jwtSecret = process.env.JWT_SECRET \|\| 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';` |
| JWT_ | 6 | `const jwtSecret = process.env.JWT_SECRET \|\| 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';` |
| JWT_ | 29 | `console.log('export JWT_TOKEN=<token>');` |

### old_code\auth.service.ts (2 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 30 | `const registrationKey = process.env.REGISTRATION_KEY;` |
| process.env | 85 | `const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS \|\| '10');` |

### old_code\src\middleware\auth.middleware.ts (4 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 31 | `console.log('JWT Secret:', process.env.JWT_SECRET?.substring(0, 3) + '...');` |
| process.env | 34 | `const decoded = jwt.verify(token, process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here') as AuthTokenPayload;` |
| JWT_ | 31 | `console.log('JWT Secret:', process.env.JWT_SECRET?.substring(0, 3) + '...');` |
| JWT_ | 34 | `const decoded = jwt.verify(token, process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here') as AuthTokenPayload;` |

### old_code\src\services\billing\stripe\stripe-webhooks.ts (5 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 7 | `const stripe = new Stripe(process.env.STRIPE_SECRET_KEY \|\| '', {` |
| process.env | 18 | `const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;` |
| STRIPE_ | 7 | `const stripe = new Stripe(process.env.STRIPE_SECRET_KEY \|\| '', {` |
| STRIPE_ | 18 | `const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;` |
| STRIPE_ | 21 | `throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');` |

### old_code\stripe.service.ts (2 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| STRIPE_ | 12 | `console.warn('STRIPE_SECRET_KEY is not set. Stripe functionality will be limited.');` |
| STRIPE_ | 43 | `throw new Error('STRIPE_WEBHOOK_SECRET is not set');` |

### package-lock.json (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| 3000 | 4280 | `"caniuse-lite": "^1.0.30001688",` |
| 3000 | 4375 | `"version": "1.0.30001713",` |
| 3000 | 4376 | `"resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001713.tgz",` |

### run_insert_optimized_prompt.bat (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 5 | `set PGHOST=localhost` |

### run_update_field_names.bat (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 6 | `set PGHOST=localhost` |

### run_update_optimized_prompt.bat (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 6 | `set PGHOST=localhost` |

### scripts\execute-sql-script.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 34 | `host: process.env.DB_HOST \|\| 'localhost',` |
| process.env | 34 | `host: process.env.DB_HOST \|\| 'localhost',` |
| process.env | 35 | `port: process.env.DB_PORT \|\| 5433,` |
| process.env | 36 | `database: process.env.PHI_DB \|\| 'radorder_phi',` |
| process.env | 37 | `user: process.env.DB_USER \|\| 'postgres',` |
| process.env | 38 | `password: process.env.DB_PASSWORD \|\| 'postgres123'` |

### scripts\fetch-prompt-from-db.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 10 | `host: process.env.DB_HOST \|\| 'localhost',` |
| process.env | 10 | `host: process.env.DB_HOST \|\| 'localhost',` |
| process.env | 11 | `port: process.env.DB_PORT \|\| 5433,` |
| process.env | 12 | `database: process.env.DB_NAME \|\| 'radorder_main',` |
| process.env | 13 | `user: process.env.DB_USER \|\| 'postgres',` |
| process.env | 14 | `password: process.env.DB_PASSWORD \|\| 'postgres123'` |

### scripts\fetch-template-15.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 10 | `host: process.env.DB_HOST \|\| 'localhost',` |
| process.env | 10 | `host: process.env.DB_HOST \|\| 'localhost',` |
| process.env | 11 | `port: process.env.DB_PORT \|\| 5433,` |
| process.env | 12 | `database: process.env.DB_NAME \|\| 'radorder_main',` |
| process.env | 13 | `user: process.env.DB_USER \|\| 'postgres',` |
| process.env | 14 | `password: process.env.DB_PASSWORD \|\| 'postgres123'` |

### scripts\import-comprehensive-prompt.js (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 15 | `host: 'localhost',` |

### scripts\prepare-stripe-test-data.js (2 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 27 | `connectionString: process.env.MAIN_DATABASE_URL` |
| DATABASE_URL | 27 | `connectionString: process.env.MAIN_DATABASE_URL` |

### scripts\query-db.js (2 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 30 | `connectionString: process.env.MAIN_DATABASE_URL` |
| DATABASE_URL | 30 | `connectionString: process.env.MAIN_DATABASE_URL` |

### scripts\query-orders-schema.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 13 | `host: process.env.DB_HOST \|\| 'localhost',` |
| process.env | 13 | `host: process.env.DB_HOST \|\| 'localhost',` |
| process.env | 14 | `port: process.env.DB_PORT \|\| 5433,` |
| process.env | 15 | `database: process.env.PHI_DB \|\| 'radorder_phi',` |
| process.env | 16 | `user: process.env.DB_USER \|\| 'postgres',` |
| process.env | 17 | `password: process.env.DB_PASSWORD \|\| 'postgres123'` |

### scripts\test-validation-engine-with-fallback.js (5 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 14 | `const API_URL = 'http://localhost:3000';` |
| http:// | 14 | `const API_URL = 'http://localhost:3000';` |
| 3000 | 14 | `const API_URL = 'http://localhost:3000';` |
| JWT_ | 15 | `const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NTE4NTk5NCwiZXhwIjoxNzQ1MjcyMzk0fQ.CPle3x1WWqYMklkIsh79J4ZKdW4l05Jv1XW_nQHh_WI';` |
| JWT_ | 74 | `'Authorization': `Bearer ${JWT_TOKEN}`` |

### sql-scripts\import_icd10_batched.js (12 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 149 | `DB_HOST=\${PGHOST:-localhost}` |
| localhost | 238 | `if "!DB_HOST!"=="" set DB_HOST=localhost` |
| DATABASE_URL | 138 | `if [ -n "$MAIN_DATABASE_URL" ]; then` |
| DATABASE_URL | 139 | `# Extract connection details from DATABASE_URL` |
| DATABASE_URL | 140 | `DB_USER=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/([^:]+):.+$/\\1/')` |
| DATABASE_URL | 141 | `DB_PASS=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/[^:]+:([^@]+).+$/\\1/')` |
| DATABASE_URL | 142 | `DB_HOST=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/[^@]+@([^:]+):.+$/\\1/')` |
| DATABASE_URL | 143 | `DB_PORT=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/[^:]+:[^@]+@[^:]+:([0-9]+)\\/.+$/\\1/')` |
| DATABASE_URL | 144 | `DB_NAME=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/[^:]+:[^@]+@[^:]+:[0-9]+\\/(.+)$/\\1/')` |
| DATABASE_URL | 206 | `if defined MAIN_DATABASE_URL (` |
| DATABASE_URL | 207 | `REM Parse the DATABASE_URL to extract connection details` |
| DATABASE_URL | 208 | `for /f "tokens=1,2,3 delims=:/" %%a in ("%MAIN_DATABASE_URL%") do (` |

### sql-scripts\import_other_tables.js (12 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 186 | `DB_HOST=\${PGHOST:-localhost}` |
| localhost | 285 | `if "!DB_HOST!"=="" set DB_HOST=localhost` |
| DATABASE_URL | 175 | `if [ -n "$MAIN_DATABASE_URL" ]; then` |
| DATABASE_URL | 176 | `# Extract connection details from DATABASE_URL` |
| DATABASE_URL | 177 | `DB_USER=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/([^:]+):.+$/\\1/')` |
| DATABASE_URL | 178 | `DB_PASS=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/[^:]+:([^@]+).+$/\\1/')` |
| DATABASE_URL | 179 | `DB_HOST=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/[^@]+@([^:]+):.+$/\\1/')` |
| DATABASE_URL | 180 | `DB_PORT=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/[^:]+:[^@]+@[^:]+:([0-9]+)\\/.+$/\\1/')` |
| DATABASE_URL | 181 | `DB_NAME=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\\/\\/[^:]+:[^@]+@[^:]+:[0-9]+\\/(.+)$/\\1/')` |
| DATABASE_URL | 253 | `if defined MAIN_DATABASE_URL (` |
| DATABASE_URL | 254 | `REM Parse the DATABASE_URL to extract connection details` |
| DATABASE_URL | 255 | `for /f "tokens=1,2,3 delims=:/" %%a in ("%MAIN_DATABASE_URL%") do (` |

### src\config\config.ts (42 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| 3000 | 8 | `port: process.env.PORT \|\| 3000,` |
| 3000 | 69 | `timeout: parseInt(process.env.LLM_TIMEOUT \|\| '30000') // 30 seconds` |
| process.env | 8 | `port: process.env.PORT \|\| 3000,` |
| process.env | 9 | `frontendUrl: process.env.FRONTEND_URL \|\| 'https://app.radorderpad.com',` |
| process.env | 10 | `nodeEnv: process.env.NODE_ENV \|\| 'development',` |
| process.env | 13 | `mainDatabaseUrl: process.env.MAIN_DATABASE_URL,` |
| process.env | 14 | `phiDatabaseUrl: process.env.PHI_DATABASE_URL,` |
| process.env | 17 | `jwtSecret: process.env.JWT_SECRET \|\| 'default_jwt_secret_key_change_in_production',` |
| process.env | 18 | `jwtExpiresIn: process.env.JWT_EXPIRES_IN \|\| '24h',` |
| process.env | 21 | `bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS \|\| '10'),` |
| process.env | 24 | `registrationKey: process.env.REGISTRATION_KEY \|\| 'default_registration_key_change_in_production',` |
| process.env | 28 | `accessKeyId: process.env.AWS_ACCESS_KEY_ID,` |
| process.env | 29 | `secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,` |
| process.env | 30 | `region: process.env.AWS_REGION \|\| 'us-east-2',` |
| process.env | 32 | `bucketName: process.env.S3_BUCKET_NAME` |
| process.env | 35 | `fromEmail: process.env.SES_FROM_EMAIL \|\| 'no-reply@radorderpad.com',` |
| process.env | 36 | `testMode: process.env.EMAIL_TEST_MODE === 'true' \|\| false` |
| process.env | 42 | `secretKey: process.env.STRIPE_SECRET_KEY,` |
| process.env | 43 | `webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,` |
| process.env | 45 | `creditBundlePriceId: process.env.STRIPE_PRICE_ID_CREDIT_BUNDLE,` |
| process.env | 46 | `frontendSuccessUrl: process.env.FRONTEND_CHECKOUT_SUCCESS_URL \|\| 'https://radorderpad.com/billing?success=true&session_id={CHECKOUT_SESSION_ID}',` |
| process.env | 47 | `frontendCancelUrl: process.env.FRONTEND_CHECKOUT_CANCEL_URL \|\| 'https://radorderpad.com/billing?canceled=true'` |
| process.env | 51 | `email: process.env.EMAIL_TEST_MODE === 'true' \|\| false,` |
| process.env | 52 | `billing: process.env.BILLING_TEST_MODE === 'true' \|\| false` |
| process.env | 58 | `anthropicApiKey: process.env.ANTHROPIC_API_KEY,` |
| process.env | 59 | `grokApiKey: process.env.GROK_API_KEY,` |
| process.env | 60 | `openaiApiKey: process.env.OPENAI_API_KEY,` |
| process.env | 63 | `claudeModelName: process.env.CLAUDE_MODEL_NAME \|\| 'claude-3-opus-20240229',` |
| process.env | 64 | `grokModelName: process.env.GROK_MODEL_NAME \|\| 'grok-1',` |
| process.env | 65 | `gptModelName: process.env.GPT_MODEL_NAME \|\| 'gpt-4-turbo',` |
| process.env | 68 | `maxTokens: parseInt(process.env.LLM_MAX_TOKENS \|\| '4000'),` |
| process.env | 69 | `timeout: parseInt(process.env.LLM_TIMEOUT \|\| '30000') // 30 seconds` |
| DATABASE_URL | 13 | `mainDatabaseUrl: process.env.MAIN_DATABASE_URL,` |
| DATABASE_URL | 14 | `phiDatabaseUrl: process.env.PHI_DATABASE_URL,` |
| JWT_ | 17 | `jwtSecret: process.env.JWT_SECRET \|\| 'default_jwt_secret_key_change_in_production',` |
| JWT_ | 18 | `jwtExpiresIn: process.env.JWT_EXPIRES_IN \|\| '24h',` |
| AWS_ | 28 | `accessKeyId: process.env.AWS_ACCESS_KEY_ID,` |
| AWS_ | 29 | `secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,` |
| AWS_ | 30 | `region: process.env.AWS_REGION \|\| 'us-east-2',` |
| STRIPE_ | 42 | `secretKey: process.env.STRIPE_SECRET_KEY,` |
| STRIPE_ | 43 | `webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,` |
| STRIPE_ | 45 | `creditBundlePriceId: process.env.STRIPE_PRICE_ID_CREDIT_BUNDLE,` |

### src\config\db-config.ts (25 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 13 | `connectionString: process.env.NODE_ENV === 'production'` |
| process.env | 14 | `? process.env.MAIN_DATABASE_URL` |
| process.env | 15 | `: process.env.DEV_MAIN_DATABASE_URL,` |
| process.env | 16 | `ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false` |
| process.env | 21 | `connectionString: process.env.NODE_ENV === 'production'` |
| process.env | 22 | `? process.env.PHI_DATABASE_URL` |
| process.env | 23 | `: process.env.DEV_PHI_DATABASE_URL,` |
| process.env | 24 | `ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false` |
| process.env | 29 | `console.log('Environment:', process.env.NODE_ENV);` |
| process.env | 30 | `console.log('MAIN_DATABASE_URL:', process.env.NODE_ENV === 'production'` |
| process.env | 31 | `? process.env.MAIN_DATABASE_URL` |
| process.env | 32 | `: process.env.DEV_MAIN_DATABASE_URL);` |
| process.env | 33 | `console.log('PHI_DATABASE_URL:', process.env.NODE_ENV === 'production'` |
| process.env | 34 | `? process.env.PHI_DATABASE_URL` |
| process.env | 35 | `: process.env.DEV_PHI_DATABASE_URL);` |
| DATABASE_URL | 14 | `? process.env.MAIN_DATABASE_URL` |
| DATABASE_URL | 15 | `: process.env.DEV_MAIN_DATABASE_URL,` |
| DATABASE_URL | 22 | `? process.env.PHI_DATABASE_URL` |
| DATABASE_URL | 23 | `: process.env.DEV_PHI_DATABASE_URL,` |
| DATABASE_URL | 30 | `console.log('MAIN_DATABASE_URL:', process.env.NODE_ENV === 'production'` |
| DATABASE_URL | 31 | `? process.env.MAIN_DATABASE_URL` |
| DATABASE_URL | 32 | `: process.env.DEV_MAIN_DATABASE_URL);` |
| DATABASE_URL | 33 | `console.log('PHI_DATABASE_URL:', process.env.NODE_ENV === 'production'` |
| DATABASE_URL | 34 | `? process.env.PHI_DATABASE_URL` |
| DATABASE_URL | 35 | `: process.env.DEV_PHI_DATABASE_URL);` |

### src\config\memorydb.ts (7 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 17 | `const memoryDbHost = process.env.MEMORYDB_HOST \|\| 'localhost';` |
| localhost | 22 | `const isLocalhost = memoryDbHost === 'localhost' \|\| memoryDbHost === '127.0.0.1';` |
| 127.0.0.1 | 22 | `const isLocalhost = memoryDbHost === 'localhost' \|\| memoryDbHost === '127.0.0.1';` |
| process.env | 17 | `const memoryDbHost = process.env.MEMORYDB_HOST \|\| 'localhost';` |
| process.env | 18 | `const memoryDbPort = parseInt(process.env.MEMORYDB_PORT \|\| '6379');` |
| process.env | 19 | `const memoryDbUser = process.env.MEMORYDB_USER;` |
| process.env | 20 | `const memoryDbPassword = process.env.MEMORYDB_PASSWORD;` |

### src\config\redis.ts (9 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 21 | `const redisHost = process.env.REDIS_CLOUD_HOST \|\| 'localhost';` |
| localhost | 30 | `// Only enable TLS for Redis Cloud, not for localhost` |
| localhost | 31 | `tls: redisHost !== 'localhost' ? {} : undefined,` |
| process.env | 21 | `const redisHost = process.env.REDIS_CLOUD_HOST \|\| 'localhost';` |
| process.env | 22 | `const redisPort = parseInt(process.env.REDIS_CLOUD_PORT \|\| '6379');` |
| process.env | 23 | `const redisPassword = process.env.REDIS_CLOUD_PASSWORD;` |
| REDIS_ | 21 | `const redisHost = process.env.REDIS_CLOUD_HOST \|\| 'localhost';` |
| REDIS_ | 22 | `const redisPort = parseInt(process.env.REDIS_CLOUD_PORT \|\| '6379');` |
| REDIS_ | 23 | `const redisPassword = process.env.REDIS_CLOUD_PASSWORD;` |

### src\controllers\billing\create-subscription.ts (7 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 35 | `const priceTier1Id = process.env.STRIPE_PRICE_ID_TIER_1;` |
| process.env | 36 | `const priceTier2Id = process.env.STRIPE_PRICE_ID_TIER_2;` |
| process.env | 37 | `const priceTier3Id = process.env.STRIPE_PRICE_ID_TIER_3;` |
| STRIPE_ | 34 | `// These should be defined in .env as STRIPE_PRICE_ID_TIER_1, STRIPE_PRICE_ID_TIER_2, STRIPE_PRICE_ID_TIER_3` |
| STRIPE_ | 35 | `const priceTier1Id = process.env.STRIPE_PRICE_ID_TIER_1;` |
| STRIPE_ | 36 | `const priceTier2Id = process.env.STRIPE_PRICE_ID_TIER_2;` |
| STRIPE_ | 37 | `const priceTier3Id = process.env.STRIPE_PRICE_ID_TIER_3;` |

### src\controllers\uploads\validate-confirm-upload-request.ts (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 47 | `const isTestEnvironment = process.env.NODE_ENV === 'test' \|\| req.headers['x-test-mode'] === 'true';` |

### src\middleware\auth\authenticate-jwt.ts (4 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 25 | `console.log('JWT Secret:', process.env.JWT_SECRET?.substring(0, 3) + '...');` |
| process.env | 28 | `const decoded = jwt.verify(token, process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here') as AuthTokenPayload;` |
| JWT_ | 25 | `console.log('JWT Secret:', process.env.JWT_SECRET?.substring(0, 3) + '...');` |
| JWT_ | 28 | `const decoded = jwt.verify(token, process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here') as AuthTokenPayload;` |

### src\services\auth\organization\create-admin-user.ts (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 13 | `const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS \|\| '10');` |

### src\services\auth\organization\verify-registration-key.ts (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 5 | `const registrationKey = process.env.REGISTRATION_KEY;` |

### src\services\billing\stripe\webhooks\utils.ts (2 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 6 | `export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY \|\| '', {` |
| STRIPE_ | 6 | `export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY \|\| '', {` |

### src\services\billing\stripe\webhooks\verify-signature.ts (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 11 | `const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;` |
| STRIPE_ | 11 | `const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;` |
| STRIPE_ | 14 | `throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');` |

### src\services\notification\services\account-notifications.ts (2 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 31 | `frontendUrl: process.env.FRONTEND_URL \|\| 'https://app.radorderpad.com'` |
| process.env | 59 | `frontendUrl: process.env.FRONTEND_URL \|\| 'https://app.radorderpad.com'` |

### src\services\notification\templates\email-template-base.ts (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 23 | `return data.frontendUrl as string \|\| process.env.FRONTEND_URL \|\| 'https://app.radorderpad.com';` |

### src\services\upload\document-upload.service.ts (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 35 | `const isTestMode = process.env.NODE_ENV === 'test' \|\|` |

### src\utils\logger.ts (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 22 | `const env = process.env.NODE_ENV \|\| 'development';` |

### src\utils\token.utils.ts (4 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 17 | `const secret = process.env.JWT_SECRET \|\| 'default_jwt_secret';` |
| process.env | 18 | `const expiresIn = process.env.JWT_EXPIRES_IN \|\| '24h';` |
| JWT_ | 17 | `const secret = process.env.JWT_SECRET \|\| 'default_jwt_secret';` |
| JWT_ | 18 | `const expiresIn = process.env.JWT_EXPIRES_IN \|\| '24h';` |

### test-all-cases-optimized.js (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 16 | `const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;` |

### test-comprehensive-prompt.js (8 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 12 | `const API_BASE_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000';` |
| http:// | 12 | `const API_BASE_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000';` |
| 3000 | 12 | `const API_BASE_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000';` |
| process.env | 12 | `const API_BASE_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000';` |
| process.env | 13 | `const API_PATH = process.env.API_PATH \|\| '/api';` |
| process.env | 15 | `const AUTH_TOKEN = process.env.TEST_AUTH_TOKEN; // JWT token for authentication` |
| API_BASE_URL | 12 | `const API_BASE_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000';` |
| API_BASE_URL | 14 | `const API_URL = `${API_BASE_URL}${API_PATH}`;` |

### test-config.js (21 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 8 | `baseUrl: process.env.API_BASE_URL \|\| 'http://localhost:3000/api',` |
| localhost | 15 | `host: process.env.DB_HOST \|\| 'localhost',` |
| http:// | 8 | `baseUrl: process.env.API_BASE_URL \|\| 'http://localhost:3000/api',` |
| 3000 | 8 | `baseUrl: process.env.API_BASE_URL \|\| 'http://localhost:3000/api',` |
| process.env | 8 | `baseUrl: process.env.API_BASE_URL \|\| 'http://localhost:3000/api',` |
| process.env | 9 | `jwtSecret: process.env.JWT_SECRET \|\| '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112'` |
| process.env | 14 | `container: process.env.DB_CONTAINER \|\| 'radorderpad-postgres',` |
| process.env | 15 | `host: process.env.DB_HOST \|\| 'localhost',` |
| process.env | 16 | `port: process.env.DB_PORT \|\| 5433,` |
| process.env | 17 | `user: process.env.DB_USER \|\| 'postgres',` |
| process.env | 18 | `password: process.env.DB_PASSWORD \|\| 'postgres123',` |
| process.env | 19 | `mainDb: process.env.MAIN_DB \|\| 'radorder_main',` |
| process.env | 20 | `phiDb: process.env.PHI_DB \|\| 'radorder_phi'` |
| process.env | 25 | `anthropicApiKey: process.env.ANTHROPIC_API_KEY,` |
| process.env | 26 | `grokApiKey: process.env.GROK_API_KEY,` |
| process.env | 27 | `openaiApiKey: process.env.OPENAI_API_KEY,` |
| process.env | 28 | `claudeModelName: process.env.CLAUDE_MODEL_NAME \|\| 'claude-3-7-sonnet-20250219',` |
| process.env | 29 | `grokModelName: process.env.GROK_MODEL_NAME \|\| 'grok-3',` |
| process.env | 30 | `gptModelName: process.env.GPT_MODEL_NAME \|\| 'gpt-4-turbo'` |
| API_BASE_URL | 8 | `baseUrl: process.env.API_BASE_URL \|\| 'http://localhost:3000/api',` |
| JWT_ | 9 | `jwtSecret: process.env.JWT_SECRET \|\| '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112'` |

### test-direct-prompt.js (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 12 | `const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY;` |

### test-radiology-export.bat (12 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| localhost | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| http:// | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| http:// | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| 3000 | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| 3000 | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| API_BASE_URL | 13 | `REM Use API_BASE_URL from environment or fallback to default` |
| API_BASE_URL | 14 | `if not defined API_BASE_URL (` |
| API_BASE_URL | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| API_BASE_URL | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| API_BASE_URL | 20 | `set BASE_URL=%API_BASE_URL%` |
| JWT_ | 11 | `set AUTH_TOKEN=%JWT_TEST_TOKEN%` |

### test-radiology-export.sh (11 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 15 | `echo "WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api"` |
| localhost | 16 | `API_BASE_URL="http://localhost:3000/api"` |
| http:// | 15 | `echo "WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api"` |
| http:// | 16 | `API_BASE_URL="http://localhost:3000/api"` |
| 3000 | 15 | `echo "WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api"` |
| 3000 | 16 | `API_BASE_URL="http://localhost:3000/api"` |
| API_BASE_URL | 13 | `# Use API_BASE_URL from environment or fallback to default` |
| API_BASE_URL | 14 | `if [ -z "$API_BASE_URL" ]; then` |
| API_BASE_URL | 15 | `echo "WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api"` |
| API_BASE_URL | 16 | `API_BASE_URL="http://localhost:3000/api"` |
| API_BASE_URL | 20 | `BASE_URL="$API_BASE_URL"` |

### test-stripe-webhooks-cli.bat (11 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 17 | `curl -s http://localhost:3000/api/health >nul 2>nul` |
| localhost | 36 | `start "Stripe Webhook Listener" cmd /c "stripe listen --forward-to http://localhost:3000/api/webhooks/stripe"` |
| localhost | 78 | `echo 5. Enter your webhook endpoint URL: http://localhost:3000/api/webhooks/stripe` |
| http:// | 17 | `curl -s http://localhost:3000/api/health >nul 2>nul` |
| http:// | 36 | `start "Stripe Webhook Listener" cmd /c "stripe listen --forward-to http://localhost:3000/api/webhooks/stripe"` |
| http:// | 78 | `echo 5. Enter your webhook endpoint URL: http://localhost:3000/api/webhooks/stripe` |
| 3000 | 17 | `curl -s http://localhost:3000/api/health >nul 2>nul` |
| 3000 | 36 | `start "Stripe Webhook Listener" cmd /c "stripe listen --forward-to http://localhost:3000/api/webhooks/stripe"` |
| 3000 | 78 | `echo 5. Enter your webhook endpoint URL: http://localhost:3000/api/webhooks/stripe` |
| STRIPE_ | 25 | `set STRIPE_CUSTOMER_ID=cus_TEST123456` |
| STRIPE_ | 29 | `node scripts/prepare-stripe-test-data.js --org-id=%ORG_ID% --customer-id=%STRIPE_CUSTOMER_ID%` |

### test-stripe-webhooks-cli.sh (13 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 16 | `if ! curl -s http://localhost:3000/api/health &> /dev/null; then` |
| localhost | 35 | `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe &` |
| localhost | 78 | `echo "5. Enter your webhook endpoint URL: http://localhost:3000/api/webhooks/stripe"` |
| http:// | 16 | `if ! curl -s http://localhost:3000/api/health &> /dev/null; then` |
| http:// | 35 | `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe &` |
| http:// | 78 | `echo "5. Enter your webhook endpoint URL: http://localhost:3000/api/webhooks/stripe"` |
| 3000 | 16 | `if ! curl -s http://localhost:3000/api/health &> /dev/null; then` |
| 3000 | 35 | `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe &` |
| 3000 | 78 | `echo "5. Enter your webhook endpoint URL: http://localhost:3000/api/webhooks/stripe"` |
| STRIPE_ | 23 | `STRIPE_CUSTOMER_ID=cus_TEST123456` |
| STRIPE_ | 27 | `node scripts/prepare-stripe-test-data.js --org-id=$ORG_ID --customer-id=$STRIPE_CUSTOMER_ID` |
| STRIPE_ | 36 | `STRIPE_PID=$!` |
| STRIPE_ | 109 | `kill $STRIPE_PID` |

### test-superadmin-api-with-token.bat (11 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| localhost | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| http:// | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| http:// | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| 3000 | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| 3000 | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| API_BASE_URL | 13 | `REM Use API_BASE_URL from environment or fallback to default` |
| API_BASE_URL | 14 | `if not defined API_BASE_URL (` |
| API_BASE_URL | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| API_BASE_URL | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| API_BASE_URL | 20 | `set BASE_URL=%API_BASE_URL%` |

### test-superadmin-api.bat (12 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| localhost | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| http:// | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| http:// | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| 3000 | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| 3000 | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| API_BASE_URL | 13 | `REM Use API_BASE_URL from environment or fallback to default` |
| API_BASE_URL | 14 | `if not defined API_BASE_URL (` |
| API_BASE_URL | 15 | `echo WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api` |
| API_BASE_URL | 16 | `set API_BASE_URL=http://localhost:3000/api` |
| API_BASE_URL | 20 | `set BASE_URL=%API_BASE_URL%` |
| JWT_ | 11 | `set AUTH_TOKEN=%JWT_TEST_TOKEN%` |

### test-superadmin-api.sh (12 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 15 | `echo "WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api"` |
| localhost | 16 | `API_BASE_URL="http://localhost:3000/api"` |
| http:// | 15 | `echo "WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api"` |
| http:// | 16 | `API_BASE_URL="http://localhost:3000/api"` |
| 3000 | 15 | `echo "WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api"` |
| 3000 | 16 | `API_BASE_URL="http://localhost:3000/api"` |
| API_BASE_URL | 13 | `# Use API_BASE_URL from environment or fallback to default` |
| API_BASE_URL | 14 | `if [ -z "$API_BASE_URL" ]; then` |
| API_BASE_URL | 15 | `echo "WARNING: API_BASE_URL not defined in environment. Using default: http://localhost:3000/api"` |
| API_BASE_URL | 16 | `API_BASE_URL="http://localhost:3000/api"` |
| API_BASE_URL | 20 | `BASE_URL=$API_BASE_URL` |
| JWT_ | 11 | `AUTH_TOKEN=$JWT_TEST_TOKEN` |

### test-token-optimization.js (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 15 | `const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;` |

### test-validation-engine-updated.js (2 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| JWT_ | 7 | `const JWT_TOKEN = fs.readFileSync('./test-token.txt', 'utf8').trim();` |
| JWT_ | 38 | `'Authorization': `Bearer ${JWT_TOKEN}`` |

### test-validation-engine.js (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 4 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDU1NzQ4MCwiZXhwIjoxNzQ0NjQzODgwfQ.LNPodxOGryfJj3xt7YBkHY4qvjQMx67XT8JyJm2Hg40';` |
| JWT_ | 4 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDU1NzQ4MCwiZXhwIjoxNzQ0NjQzODgwfQ.LNPodxOGryfJj3xt7YBkHY4qvjQMx67XT8JyJm2Hg40';` |
| JWT_ | 35 | `'Authorization': `Bearer ${JWT_TOKEN}`` |

### tests\batch\import_icd10_batched.bat (4 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 41 | `if "!DB_HOST!"=="" set DB_HOST=localhost` |
| DATABASE_URL | 9 | `if defined MAIN_DATABASE_URL (` |
| DATABASE_URL | 10 | `REM Parse the DATABASE_URL to extract connection details` |
| DATABASE_URL | 11 | `for /f "tokens=1,2,3 delims=:/" %%a in ("%MAIN_DATABASE_URL%") do (` |

### tests\batch\import_icd10_batched.sh (8 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 26 | `DB_HOST=${PGHOST:-localhost}` |
| DATABASE_URL | 15 | `if [ -n "$MAIN_DATABASE_URL" ]; then` |
| DATABASE_URL | 16 | `# Extract connection details from DATABASE_URL` |
| DATABASE_URL | 17 | `DB_USER=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/([^:]+):.+$/\1/')` |
| DATABASE_URL | 18 | `DB_PASS=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:([^@]+).+$/\1/')` |
| DATABASE_URL | 19 | `DB_HOST=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^@]+@([^:]+):.+$/\1/')` |
| DATABASE_URL | 20 | `DB_PORT=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:[^@]+@[^:]+:([0-9]+)\/.+$/\1/')` |
| DATABASE_URL | 21 | `DB_NAME=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:[^@]+@[^:]+:[0-9]+\/(.+)$/\1/')` |

### tests\batch\import_medical_data.bat (4 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 52 | `if "!DB_HOST!"=="" set DB_HOST=localhost` |
| DATABASE_URL | 19 | `if defined MAIN_DATABASE_URL (` |
| DATABASE_URL | 20 | `REM Parse the DATABASE_URL to extract connection details` |
| DATABASE_URL | 22 | `for /f "tokens=1,2,3 delims=:/" %%a in ("%MAIN_DATABASE_URL%") do (` |

### tests\batch\import_medical_data.sh (9 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 29 | `DB_HOST=${PGHOST:-localhost}` |
| DATABASE_URL | 16 | `# If MAIN_DATABASE_URL is set, use it; otherwise use individual PG* variables` |
| DATABASE_URL | 17 | `if [ -n "$MAIN_DATABASE_URL" ]; then` |
| DATABASE_URL | 18 | `# Extract connection details from DATABASE_URL` |
| DATABASE_URL | 20 | `DB_USER=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/([^:]+):.+$/\1/')` |
| DATABASE_URL | 21 | `DB_PASS=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:([^@]+).+$/\1/')` |
| DATABASE_URL | 22 | `DB_HOST=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^@]+@([^:]+):.+$/\1/')` |
| DATABASE_URL | 23 | `DB_PORT=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:[^@]+@[^:]+:([0-9]+)\/.+$/\1/')` |
| DATABASE_URL | 24 | `DB_NAME=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:[^@]+@[^:]+:[0-9]+\/(.+)$/\1/')` |

### tests\batch\import_other_tables.bat (4 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 42 | `if "!DB_HOST!"=="" set DB_HOST=localhost` |
| DATABASE_URL | 10 | `if defined MAIN_DATABASE_URL (` |
| DATABASE_URL | 11 | `REM Parse the DATABASE_URL to extract connection details` |
| DATABASE_URL | 12 | `for /f "tokens=1,2,3 delims=:/" %%a in ("%MAIN_DATABASE_URL%") do (` |

### tests\batch\import_other_tables.sh (8 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 27 | `DB_HOST=${PGHOST:-localhost}` |
| DATABASE_URL | 16 | `if [ -n "$MAIN_DATABASE_URL" ]; then` |
| DATABASE_URL | 17 | `# Extract connection details from DATABASE_URL` |
| DATABASE_URL | 18 | `DB_USER=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/([^:]+):.+$/\1/')` |
| DATABASE_URL | 19 | `DB_PASS=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:([^@]+).+$/\1/')` |
| DATABASE_URL | 20 | `DB_HOST=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^@]+@([^:]+):.+$/\1/')` |
| DATABASE_URL | 21 | `DB_PORT=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:[^@]+@[^:]+:([0-9]+)\/.+$/\1/')` |
| DATABASE_URL | 22 | `DB_NAME=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:[^@]+@[^:]+:[0-9]+\/(.+)$/\1/')` |

### tests\batch\run-admin-send-to-radiology-tests.bat (5 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| API_BASE_URL | 10 | `for /f "tokens=*" %%a in ('node -e "const config = require(\"./test-config\"); console.log(config.api.baseUrl);"') do set API_BASE_URL=%%a` |
| API_BASE_URL | 11 | `echo Using API base URL: %API_BASE_URL%` |
| JWT_ | 6 | `for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const token = helpers.generateToken(helpers.config.testData.adminReferring); console.log(token);"') do set JWT_TOKEN=%%a` |
| JWT_ | 7 | `echo Token generated: %JWT_TOKEN:~0,20%...` |
| JWT_ | 14 | `node test-admin-send-to-radiology.js %JWT_TOKEN%` |

### tests\batch\run-admin-send-to-radiology-tests.sh (5 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| API_BASE_URL | 10 | `API_BASE_URL=$(node -e "const config = require('./test-config'); console.log(config.api.baseUrl);")` |
| API_BASE_URL | 11 | `echo "Using API base URL: $API_BASE_URL"` |
| JWT_ | 6 | `JWT_TOKEN=$(node -e "const helpers = require('./test-helpers'); const token = helpers.generateToken(helpers.config.testData.adminStaff); console.log(token);")` |
| JWT_ | 7 | `echo "Token generated: ${JWT_TOKEN:0:20}..."` |
| JWT_ | 14 | `node test-admin-send-to-radiology.js "$JWT_TOKEN"` |

### tests\batch\run-all-tests.bat (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| JWT_ | 11 | `for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const token = helpers.generateToken(helpers.config.testData.physician); console.log(token);"') do set JWT_TOKEN=%%a` |
| JWT_ | 12 | `echo Token generated: %JWT_TOKEN:~0,20%...` |
| JWT_ | 16 | `call ..\..\run-validation-tests.bat %JWT_TOKEN% > test-results\validation-tests.log 2>&1` |

### tests\batch\run-all-tests.sh (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| JWT_ | 11 | `JWT_TOKEN=$(node -e "const helpers = require('./test-helpers'); const token = helpers.generateToken(helpers.config.testData.physician); console.log(token);")` |
| JWT_ | 12 | `echo "Token generated: ${JWT_TOKEN:0:20}..."` |
| JWT_ | 16 | `../../run-validation-tests.sh "$JWT_TOKEN" > test-results/validation-tests.log 2>&1` |

### tests\batch\run-connection-tests.bat (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 9 | `for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(\"postgres://\" + helpers.config.database.user + \":\" + helpers.config.database.password + \"@localhost:\" + helpers.config.database.port + \"/\" + helpers.config.database.mainDb);"') do set DB_CONN=%%a` |

### tests\batch\run-connection-tests.sh (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 9 | `DB_CONN=$(node -e "const helpers = require('./test-helpers'); console.log('postgres://' + helpers.config.database.user + ':' + helpers.config.database.password + '@localhost:' + helpers.config.database.port + '/' + helpers.config.database.mainDb);")` |

### tests\batch\run-file-upload-tests.bat (2 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| JWT_ | 6 | `for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./tests/batch/test-helpers\"); const adminUser = { userId: 1, orgId: 1, role: \"admin_referring\", email: \"test.admin@example.com\" }; const token = helpers.generateToken(adminUser); console.log(token);"') do set JWT_TOKEN=%%a` |
| JWT_ | 7 | `echo Token generated (first 20 chars): %JWT_TOKEN:~0,20%...` |

### tests\batch\run-fixed-e2e-tests.sh (4 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 14 | `JWT_SECRET=$(node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');")` |
| JWT_ | 13 | `# Set the JWT_SECRET environment variable` |
| JWT_ | 14 | `JWT_SECRET=$(node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');")` |
| JWT_ | 15 | `export JWT_SECRET` |

### tests\batch\run-order-finalization-tests.bat (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| JWT_ | 7 | `for /f "tokens=*" %%a in ('node -e "const jwt = require(\"jsonwebtoken\"); const secret = \"79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112\"; const payload = { userId: 1, orgId: 1, role: \"physician\", email: \"test.physician@example.com\" }; const token = jwt.sign(payload, secret, { expiresIn: \"24h\" }); console.log(token);"') do set JWT_TOKEN=%%a` |
| JWT_ | 8 | `echo Token generated: %JWT_TOKEN:~0,20%...` |
| JWT_ | 15 | `node test-order-finalization.js %JWT_TOKEN% > test-results\order-finalization-tests.log 2>&1` |

### tests\batch\run-order-finalization-tests.sh (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| JWT_ | 7 | `JWT_TOKEN=$(node -e "const jwt = require(\"jsonwebtoken\"); const secret = \"79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112\"; const payload = { userId: 1, orgId: 1, role: \"physician\", email: \"test.physician@example.com\" }; const token = jwt.sign(payload, secret, { expiresIn: \"24h\" }); console.log(token);")` |
| JWT_ | 8 | `echo "Token generated: ${JWT_TOKEN:0:20}..."` |
| JWT_ | 15 | `node ./test-order-finalization.js $JWT_TOKEN > test-results/order-finalization-tests.log 2>&1` |

### tests\batch\run-registration-onboarding-tests.bat (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 14 | `for /f "tokens=*" %%a in ('node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');"') do set JWT_SECRET=%%a` |
| JWT_ | 13 | `REM Set the JWT_TOKEN environment variable` |
| JWT_ | 14 | `for /f "tokens=*" %%a in ('node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');"') do set JWT_SECRET=%%a` |

### tests\batch\run-registration-onboarding-tests.sh (4 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 14 | `JWT_SECRET=$(node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');")` |
| JWT_ | 13 | `# Set the JWT_TOKEN environment variable` |
| JWT_ | 14 | `JWT_SECRET=$(node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');")` |
| JWT_ | 15 | `export JWT_SECRET` |

### tests\batch\run-scenario-a-fixed.bat (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 14 | `for /f "tokens=*" %%a in ('node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');"') do set JWT_SECRET=%%a` |
| JWT_ | 13 | `REM Set the JWT_SECRET environment variable` |
| JWT_ | 14 | `for /f "tokens=*" %%a in ('node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');"') do set JWT_SECRET=%%a` |

### tests\batch\run-scenario-b-fixed.bat (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 14 | `for /f "tokens=*" %%a in ('node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');"') do set JWT_SECRET=%%a` |
| JWT_ | 13 | `REM Set the JWT_SECRET environment variable` |
| JWT_ | 14 | `for /f "tokens=*" %%a in ('node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET \|\| 'your_jwt_secret_key_here');"') do set JWT_SECRET=%%a` |

### tests\batch\run-upload-tests.bat (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| JWT_ | 5 | `set JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDU3NTUzOCwiZXhwIjoxNzQ0NjYxOTM4fQ.gnTcT9gQoz1RNmvo6A_DWAolelanr0ilBvn6PylJK9k` |

### tests\batch\run-upload-tests.sh (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| JWT_ | 5 | `export JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDU3NTUzOCwiZXhwIjoxNzQ0NjYxOTM4fQ.gnTcT9gQoz1RNmvo6A_DWAolelanr0ilBvn6PylJK9k"` |

### tests\batch\run-validation-tests.bat (11 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 19 | `:: Default to localhost if not provided` |
| localhost | 20 | `set API_BASE_URL=http://localhost:3000/api` |
| http:// | 20 | `set API_BASE_URL=http://localhost:3000/api` |
| 3000 | 20 | `set API_BASE_URL=http://localhost:3000/api` |
| API_BASE_URL | 6 | `echo Usage: run-validation-tests.bat ^<JWT_TOKEN^> [API_BASE_URL]` |
| API_BASE_URL | 15 | `:: Check if API_BASE_URL is provided as a second argument` |
| API_BASE_URL | 17 | `set API_BASE_URL=%~2` |
| API_BASE_URL | 20 | `set API_BASE_URL=http://localhost:3000/api` |
| JWT_ | 4 | `:: Check if JWT_TOKEN is provided as an argument` |
| JWT_ | 6 | `echo Usage: run-validation-tests.bat ^<JWT_TOKEN^> [API_BASE_URL]` |
| JWT_ | 13 | `set JWT_TOKEN=%~1` |

### tests\batch\run-validation-tests.sh (11 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 18 | `# Default to localhost if not provided` |
| localhost | 19 | `export API_BASE_URL=http://localhost:3000/api` |
| http:// | 19 | `export API_BASE_URL=http://localhost:3000/api` |
| 3000 | 19 | `export API_BASE_URL=http://localhost:3000/api` |
| API_BASE_URL | 6 | `echo "Usage: ./run-validation-tests.sh <JWT_TOKEN> [API_BASE_URL]"` |
| API_BASE_URL | 14 | `# Check if API_BASE_URL is provided as a second argument` |
| API_BASE_URL | 16 | `export API_BASE_URL=$2` |
| API_BASE_URL | 19 | `export API_BASE_URL=http://localhost:3000/api` |
| JWT_ | 4 | `# Check if JWT_TOKEN is provided as an argument` |
| JWT_ | 6 | `echo "Usage: ./run-validation-tests.sh <JWT_TOKEN> [API_BASE_URL]"` |
| JWT_ | 12 | `export JWT_TOKEN=$1` |

### tests\batch\run_insert_comprehensive_prompt.bat (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 5 | `set DB_HOST=localhost` |

### tests\batch\superadmin\test-superadmin-logs.bat (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 5 | `set API_URL=http://localhost:3000` |
| http:// | 5 | `set API_URL=http://localhost:3000` |
| 3000 | 5 | `set API_URL=http://localhost:3000` |

### tests\batch\superadmin\test-superadmin-logs.sh (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 5 | `API_URL="http://localhost:3000"` |
| http:// | 5 | `API_URL="http://localhost:3000"` |
| 3000 | 5 | `API_URL="http://localhost:3000"` |

### tests\batch\superadmin\test-superadmin-prompt-assignments.bat (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 5 | `set API_URL=http://localhost:3000` |
| http:// | 5 | `set API_URL=http://localhost:3000` |
| 3000 | 5 | `set API_URL=http://localhost:3000` |

### tests\batch\superadmin\test-superadmin-prompt-assignments.sh (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 5 | `API_URL="http://localhost:3000"` |
| http:// | 5 | `API_URL="http://localhost:3000"` |
| 3000 | 5 | `API_URL="http://localhost:3000"` |

### tests\batch\superadmin\test-superadmin-prompts.bat (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 5 | `set API_URL=http://localhost:3000` |
| http:// | 5 | `set API_URL=http://localhost:3000` |
| 3000 | 5 | `set API_URL=http://localhost:3000` |

### tests\batch\test-admin-finalization-debug.bat (26 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 32 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-summary" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}"` |
| localhost | 33 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-summary" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}"` |
| localhost | 44 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-supplemental" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}"` |
| localhost | 45 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-supplemental" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}"` |
| localhost | 66 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/send-to-radiology" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}"` |
| localhost | 67 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/send-to-radiology" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}"` |
| http:// | 32 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-summary" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}"` |
| http:// | 33 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-summary" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}"` |
| http:// | 44 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-supplemental" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}"` |
| http:// | 45 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-supplemental" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}"` |
| http:// | 66 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/send-to-radiology" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}"` |
| http:// | 67 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/send-to-radiology" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}"` |
| 3000 | 32 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-summary" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}"` |
| 3000 | 33 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-summary" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}"` |
| 3000 | 44 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-supplemental" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}"` |
| 3000 | 45 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-supplemental" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}"` |
| 3000 | 66 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/send-to-radiology" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}"` |
| 3000 | 67 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/send-to-radiology" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}"` |
| JWT_ | 7 | `for /f "tokens=*" %%a in ('node -e "const jwt = require(\"jsonwebtoken\"); const secret = \"79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112\"; const payload = { userId: 2, orgId: 1, role: \"admin_staff\", email: \"test.admin@example.com\" }; const token = jwt.sign(payload, secret, { expiresIn: \"24h\" }); console.log(token);"') do set JWT_TOKEN=%%a` |
| JWT_ | 8 | `echo Token generated: %JWT_TOKEN:~0,20%...` |
| JWT_ | 32 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-summary" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}"` |
| JWT_ | 33 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-summary" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}"` |
| JWT_ | 44 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-supplemental" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}"` |
| JWT_ | 45 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-supplemental" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}"` |
| JWT_ | 66 | `echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/send-to-radiology" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}"` |
| JWT_ | 67 | `curl -s -X POST "http://localhost:3000/api/admin/orders/4/send-to-radiology" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}"` |

### tests\batch\test-admin-finalization.bat (5 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| JWT_ | 7 | `for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const token = helpers.generateToken(helpers.config.testData.adminStaff); console.log(token);"') do set JWT_TOKEN=%%a` |
| JWT_ | 8 | `echo Token generated: %JWT_TOKEN:~0,20%...` |
| JWT_ | 20 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}" \| findstr /C:"success"` |
| JWT_ | 31 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}" \| findstr /C:"success"` |
| JWT_ | 49 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}" \| findstr /C:"success"` |

### tests\batch\test-admin-finalization.sh (5 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| JWT_ | 7 | `JWT_TOKEN=$(node -e "const helpers = require('./test-helpers'); const token = helpers.generateToken(helpers.config.testData.adminStaff); console.log(token);")` |
| JWT_ | 8 | `echo "Token generated: ${JWT_TOKEN:0:20}..."` |
| JWT_ | 19 | `RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{"pastedText":"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789"}')` |
| JWT_ | 31 | `RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{"pastedText":"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings"}')` |
| JWT_ | 49 | `RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{}')` |

### tests\batch\test-admin-send-to-radiology.js (4 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| API_BASE_URL | 13 | `const API_BASE_URL = helpers.config.api.baseUrl;` |
| API_BASE_URL | 14 | `const VALIDATION_ENDPOINT = `${API_BASE_URL}/orders/validate`;` |
| API_BASE_URL | 15 | `const FINALIZATION_ENDPOINT = `${API_BASE_URL}/orders`;` |
| API_BASE_URL | 16 | `const SEND_TO_RADIOLOGY_ENDPOINT = `${API_BASE_URL}/admin/orders`;` |

### tests\batch\test-billing-subscriptions.js (4 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 20 | `const TEST_PRICE_ID = process.env.STRIPE_PRICE_ID_TIER_1 \|\| 'price_tier1_monthly';` |
| API_BASE_URL | 15 | `const API_BASE_URL = helpers.config.api.baseUrl;` |
| API_BASE_URL | 16 | `const SUBSCRIPTIONS_ENDPOINT = `${API_BASE_URL}/billing/subscriptions`;` |
| STRIPE_ | 20 | `const TEST_PRICE_ID = process.env.STRIPE_PRICE_ID_TIER_1 \|\| 'price_tier1_monthly';` |

### tests\batch\test-connection-management.bat (12 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| JWT_ | 7 | `for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const adminUser = { userId: 1, orgId: 1, role: \"admin_referring\", email: \"test.admin@example.com\" }; const token = helpers.generateToken(adminUser); console.log(token);"') do set JWT_TOKEN=%%a` |
| JWT_ | 8 | `echo Token generated: %JWT_TOKEN:~0,20%...` |
| JWT_ | 12 | `for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const targetUser = { userId: 2, orgId: 2, role: \"admin_referring\", email: \"target.admin@example.com\" }; const token = helpers.generateToken(targetUser); console.log(token);"') do set TARGET_JWT_TOKEN=%%a` |
| JWT_ | 13 | `echo Token generated: %TARGET_JWT_TOKEN:~0,20%...` |
| JWT_ | 19 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"connections"` |
| JWT_ | 30 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"targetOrgId\":2,\"notes\":\"Test connection request\"}" \| findstr /C:"success"` |
| JWT_ | 45 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %TARGET_JWT_TOKEN%" \| findstr /C:"requests"` |
| JWT_ | 56 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %TARGET_JWT_TOKEN%" \| findstr /C:"success"` |
| JWT_ | 67 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"active"` |
| JWT_ | 78 | `curl -s -X DELETE "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"success"` |
| JWT_ | 89 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"targetOrgId\":2,\"notes\":\"Test connection request again\"}" \| findstr /C:"success"` |
| JWT_ | 103 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %TARGET_JWT_TOKEN%" \| findstr /C:"success"` |

### tests\batch\test-file-upload.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 10 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| helpers.generateToken(config.testData.adminStaff);` |
| API_BASE_URL | 9 | `const API_BASE_URL = config.api.baseUrl;` |
| API_BASE_URL | 28 | `const response = await fetch(`${API_BASE_URL}${endpoint}`, options);` |
| JWT_ | 10 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| helpers.generateToken(config.testData.adminStaff);` |
| JWT_ | 12 | `console.log('Using JWT token:', JWT_TOKEN);` |
| JWT_ | 19 | `'Authorization': `Bearer ${JWT_TOKEN}`,` |

### tests\batch\test-location-management.bat (11 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| JWT_ | 7 | `for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const adminUser = { userId: 1, orgId: 1, role: \"admin_referring\", email: \"test.admin@example.com\" }; const token = helpers.generateToken(adminUser); console.log(token);"') do set JWT_TOKEN=%%a` |
| JWT_ | 8 | `echo Token generated: %JWT_TOKEN:~0,20%...` |
| JWT_ | 14 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"locations"` |
| JWT_ | 25 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"name\":\"Test Location\",\"address_line1\":\"123 Test St\",\"city\":\"Test City\",\"state\":\"TS\",\"zip_code\":\"12345\",\"phone_number\":\"555-123-4567\"}" \| findstr /C:"success"` |
| JWT_ | 35 | `for /f "tokens=*" %%a in ('curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"name\":\"Test Location\",\"address_line1\":\"123 Test St\",\"city\":\"Test City\",\"state\":\"TS\",\"zip_code\":\"12345\",\"phone_number\":\"555-123-4567\"}" ^\| node -e "const data = JSON.parse(require(\"fs\").readFileSync(0, \"utf-8\")); console.log(data.location.id);"') do set LOCATION_ID=%%a` |
| JWT_ | 42 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"location"` |
| JWT_ | 53 | `curl -s -X PUT "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"name\":\"Updated Test Location\",\"address_line1\":\"456 Test Ave\",\"city\":\"Test City\",\"state\":\"TS\",\"zip_code\":\"12345\",\"phone_number\":\"555-123-4567\"}" \| findstr /C:"success"` |
| JWT_ | 64 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"success"` |
| JWT_ | 75 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"locations"` |
| JWT_ | 86 | `curl -s -X DELETE "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"success"` |
| JWT_ | 97 | `curl -s -X DELETE "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"success"` |

### tests\batch\test-location-management.sh (11 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| JWT_ | 7 | `JWT_TOKEN=$(node -e "const helpers = require('./test-helpers'); const adminUser = { userId: 1, orgId: 1, role: \"admin_referring\", email: \"test.admin@example.com\" }; const token = helpers.generateToken(adminUser); console.log(token);")` |
| JWT_ | 8 | `echo "Token generated: ${JWT_TOKEN:0:20}..."` |
| JWT_ | 14 | `RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| JWT_ | 26 | `RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{"name":"Test Location","address_line1":"123 Test St","city":"Test City","state":"TS","zip_code":"12345","phone_number":"555-123-4567"}')` |
| JWT_ | 36 | `LOCATION_RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" \| grep "id")` |
| JWT_ | 47 | `RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| JWT_ | 59 | `RESPONSE=$(curl -s -X PUT "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{"name":"Updated Test Location","address_line1":"456 Test Ave","city":"Test City","state":"TS","zip_code":"12345","phone_number":"555-123-4567"}')` |
| JWT_ | 71 | `RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| JWT_ | 83 | `RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| JWT_ | 95 | `RESPONSE=$(curl -s -X DELETE "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| JWT_ | 107 | `RESPONSE=$(curl -s -X DELETE "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |

### tests\batch\test-order-finalization.js (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| API_BASE_URL | 13 | `const API_BASE_URL = testConfig.api.baseUrl;` |
| API_BASE_URL | 14 | `const VALIDATION_ENDPOINT = `${API_BASE_URL}/orders/validate`;` |
| API_BASE_URL | 15 | `const FINALIZATION_ENDPOINT = `${API_BASE_URL}/orders`;` |

### tests\batch\test-radiology-workflow.bat (8 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| JWT_ | 7 | `for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const schedulerUser = { userId: 3, orgId: 2, role: \"scheduler\", email: \"test.scheduler@example.com\" }; const token = helpers.generateToken(schedulerUser); console.log(token);"') do set JWT_TOKEN=%%a` |
| JWT_ | 8 | `echo Token generated: %JWT_TOKEN:~0,20%...` |
| JWT_ | 20 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"orders"` |
| JWT_ | 31 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"order"` |
| JWT_ | 42 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"order"` |
| JWT_ | 53 | `curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" \| findstr /C:"order_id"` |
| JWT_ | 64 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"newStatus\":\"scheduled\"}" \| findstr /C:"success"` |
| JWT_ | 82 | `curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"requestedInfoType\":\"labs\",\"requestedInfoDetails\":\"Need recent creatinine levels for contrast administration\"}" \| findstr /C:"success"` |

### tests\batch\test-radiology-workflow.sh (8 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| JWT_ | 7 | `JWT_TOKEN=$(node -e "const helpers = require('./test-helpers'); const schedulerUser = { userId: 3, orgId: 2, role: \"scheduler\", email: \"test.scheduler@example.com\" }; const token = helpers.generateToken(schedulerUser); console.log(token);")` |
| JWT_ | 8 | `echo "Token generated: ${JWT_TOKEN:0:20}..."` |
| JWT_ | 19 | `RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| JWT_ | 31 | `RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| JWT_ | 43 | `RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| JWT_ | 55 | `RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")` |
| JWT_ | 67 | `RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{"newStatus":"scheduled"}')` |
| JWT_ | 85 | `RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{"requestedInfoType":"labs","requestedInfoDetails":"Need recent creatinine levels for contrast administration"}')` |

### tests\batch\test-stripe-webhook-handlers.js (10 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 20 | `const API_URL = process.env.API_URL \|\| 'http://localhost:3000';` |
| http:// | 20 | `const API_URL = process.env.API_URL \|\| 'http://localhost:3000';` |
| 3000 | 20 | `const API_URL = process.env.API_URL \|\| 'http://localhost:3000';` |
| process.env | 20 | `const API_URL = process.env.API_URL \|\| 'http://localhost:3000';` |
| process.env | 21 | `const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET \|\| 'whsec_test_webhook_secret';` |
| process.env | 71 | `TEST_TOKEN = process.env.TEST_TOKEN \|\| fs.readFileSync('./test-token.txt', 'utf8').trim();` |
| STRIPE_ | 21 | `const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET \|\| 'whsec_test_webhook_secret';` |
| STRIPE_ | 45 | `secret: secret \|\| STRIPE_WEBHOOK_SECRET,` |
| STRIPE_ | 57 | `.createHmac('sha256', secret \|\| STRIPE_WEBHOOK_SECRET)` |
| STRIPE_ | 122 | `secret: STRIPE_WEBHOOK_SECRET,` |

### tests\batch\test-superadmin-api.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 11 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| http:// | 11 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| 3000 | 11 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| API_BASE_URL | 11 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| API_BASE_URL | 12 | `const ORGANIZATIONS_ENDPOINT = `${API_BASE_URL}/superadmin/organizations`;` |
| API_BASE_URL | 13 | `const USERS_ENDPOINT = `${API_BASE_URL}/superadmin/users`;` |

### tests\batch\test-superadmin-logs.bat (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 5 | `set API_URL=http://localhost:3000` |
| http:// | 5 | `set API_URL=http://localhost:3000` |
| 3000 | 5 | `set API_URL=http://localhost:3000` |

### tests\batch\test-superadmin-logs.sh (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 5 | `API_URL="http://localhost:3000"` |
| http:// | 5 | `API_URL="http://localhost:3000"` |
| 3000 | 5 | `API_URL="http://localhost:3000"` |

### tests\batch\test-superadmin-prompt-assignments.bat (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 5 | `set API_URL=http://localhost:3000` |
| http:// | 5 | `set API_URL=http://localhost:3000` |
| 3000 | 5 | `set API_URL=http://localhost:3000` |

### tests\batch\test-superadmin-prompt-assignments.sh (3 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 5 | `API_URL="http://localhost:3000"` |
| http:// | 5 | `API_URL="http://localhost:3000"` |
| 3000 | 5 | `API_URL="http://localhost:3000"` |

### tests\batch\update_comprehensive_prompt.bat (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 5 | `set DB_HOST=localhost` |

### tests\batch\update_comprehensive_prompt.sh (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 6 | `DB_HOST="localhost"` |

### tests\batch\verify_import.bat (4 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 51 | `if "!DB_HOST!"=="" set DB_HOST=localhost` |
| DATABASE_URL | 18 | `if defined MAIN_DATABASE_URL (` |
| DATABASE_URL | 19 | `REM Parse the DATABASE_URL to extract connection details` |
| DATABASE_URL | 21 | `for /f "tokens=1,2,3 delims=:/" %%a in ("%MAIN_DATABASE_URL%") do (` |

### tests\batch\verify_import.sh (9 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 28 | `DB_HOST=${PGHOST:-localhost}` |
| DATABASE_URL | 15 | `# If MAIN_DATABASE_URL is set, use it; otherwise use individual PG* variables` |
| DATABASE_URL | 16 | `if [ -n "$MAIN_DATABASE_URL" ]; then` |
| DATABASE_URL | 17 | `# Extract connection details from DATABASE_URL` |
| DATABASE_URL | 19 | `DB_USER=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/([^:]+):.+$/\1/')` |
| DATABASE_URL | 20 | `DB_PASS=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:([^@]+).+$/\1/')` |
| DATABASE_URL | 21 | `DB_HOST=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^@]+@([^:]+):.+$/\1/')` |
| DATABASE_URL | 22 | `DB_PORT=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:[^@]+@[^:]+:([0-9]+)\/.+$/\1/')` |
| DATABASE_URL | 23 | `DB_NAME=$(echo $MAIN_DATABASE_URL \| sed -E 's/^postgres:\/\/[^:]+:[^@]+@[^:]+:[0-9]+\/(.+)$/\1/')` |

### tests\billing-checkout.test.js (8 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 5 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| http:// | 5 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| 3000 | 5 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| process.env | 6 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoiYWRtaW5fcmVmZXJyaW5nIiwiZW1haWwiOiJ0ZXN0LmFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ0NTc1NTM4LCJleHAiOjE3NDQ2NjE5Mzh9.gnTcT9gQoz1RNmvo6A_DWAolelanr0ilBvn6PylJK9k';` |
| API_BASE_URL | 5 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| API_BASE_URL | 22 | `const response = await fetch(`${API_BASE_URL}${endpoint}`, options);` |
| JWT_ | 6 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoiYWRtaW5fcmVmZXJyaW5nIiwiZW1haWwiOiJ0ZXN0LmFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ0NTc1NTM4LCJleHAiOjE3NDQ2NjE5Mzh9.gnTcT9gQoz1RNmvo6A_DWAolelanr0ilBvn6PylJK9k';` |
| JWT_ | 13 | `'Authorization': `Bearer ${JWT_TOKEN}`,` |

### tests\clinical-workflow-simulation.js (12 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| 3000 | 245 | `timeout: 30000` |
| 3000 | 333 | `timeout: 30000` |
| process.env | 24 | `const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY \|\| config.llm.anthropicApiKey;` |
| process.env | 25 | `const GROK_API_KEY = process.env.GROK_API_KEY \|\| config.llm.grokApiKey;` |
| process.env | 26 | `const OPENAI_API_KEY = process.env.OPENAI_API_KEY \|\| config.llm.openaiApiKey;` |
| process.env | 226 | `model: process.env.GPT_MODEL_NAME \|\| 'gpt-4-turbo',` |
| process.env | 314 | `model: process.env.GPT_MODEL_NAME \|\| 'gpt-4-turbo',` |
| API_BASE_URL | 23 | `const API_BASE_URL = config.api.baseUrl;` |
| API_BASE_URL | 196 | `const response = await axios.post(`${API_BASE_URL}/orders/validate`, payload, {` |
| API_BASE_URL | 274 | `const response = await axios.post(`${API_BASE_URL}/orders/${orderId}/clarify`, {` |
| API_BASE_URL | 384 | `const finalValidationResponse = await axios.post(`${API_BASE_URL}/orders/validate`, validationPayload, {` |
| API_BASE_URL | 426 | `const submissionResponse = await axios.put(`${API_BASE_URL}/orders/${orderId}`, submissionPayload, {` |

### tests\e2e\run_comprehensive_tests.js (10 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 15 | `const API_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000/api';` |
| http:// | 15 | `const API_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000/api';` |
| 3000 | 15 | `const API_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000/api';` |
| process.env | 15 | `const API_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000/api';` |
| process.env | 16 | `const JWT_SECRET = process.env.JWT_SECRET \|\| '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112';` |
| API_BASE_URL | 15 | `const API_URL = process.env.API_BASE_URL \|\| 'http://localhost:3000/api';` |
| JWT_ | 16 | `const JWT_SECRET = process.env.JWT_SECRET \|\| '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112';` |
| JWT_ | 27 | `JWT_SECRET,` |
| JWT_ | 33 | `JWT_SECRET,` |
| JWT_ | 39 | `JWT_SECRET,` |

### tests\e2e\test-helpers-fixed-a.js (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| 3000 | 290 | `{ action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },` |

### tests\e2e\test-helpers-fixed-b.js (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| 3000 | 366 | `{ action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },` |

### tests\e2e\test-helpers-fixed-c.js (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| 3000 | 484 | `{ action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },` |

### tests\e2e\test-helpers-fixed-d.js (2 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| 3000 | 301 | `{ action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },` |
| 3000 | 502 | `{ action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },` |

### tests\e2e\test-helpers-fixed.js (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| 3000 | 700 | `{ action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },` |

### tests\e2e\test-helpers-improved.js (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| 3000 | 848 | `{ action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },` |

### tests\e2e\test-helpers-simple.js (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| 3000 | 289 | `{ action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },` |

### tests\e2e\test-helpers.js (1 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| 3000 | 336 | `{ action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },` |

### tests\file-upload-test.js (8 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 7 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| http:// | 7 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| 3000 | 7 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| process.env | 8 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDY3MzE5MywiZXhwIjoxNzQ0NzU5NTkzfQ.bkBAUApAhSS0t2vRiYY2ZXlKdmaPRqCIsSO_HokX84Y';` |
| API_BASE_URL | 7 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| API_BASE_URL | 25 | `const response = await fetch(`${API_BASE_URL}${endpoint}`, options);` |
| JWT_ | 8 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDY3MzE5MywiZXhwIjoxNzQ0NzU5NTkzfQ.bkBAUApAhSS0t2vRiYY2ZXlKdmaPRqCIsSO_HokX84Y';` |
| JWT_ | 15 | `'Authorization': `Bearer ${JWT_TOKEN}`,` |

### tests\file-upload.test.js (9 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 6 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| http:// | 6 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| 3000 | 6 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| 3000 | 94 | `fileSize: 30000000, // 30MB (assuming 20MB limit for PDFs)` |
| process.env | 7 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDU3NTUzOCwiZXhwIjoxNzQ0NjYxOTM4fQ.gnTcT9gQoz1RNmvo6A_DWAolelanr0ilBvn6PylJK9k';` |
| API_BASE_URL | 6 | `const API_BASE_URL = 'http://localhost:3000/api';` |
| API_BASE_URL | 27 | `const response = await fetch(`${API_BASE_URL}${endpoint}`, options);` |
| JWT_ | 7 | `const JWT_TOKEN = process.env.JWT_TOKEN \|\| 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDU3NTUzOCwiZXhwIjoxNzQ0NjYxOTM4fQ.gnTcT9gQoz1RNmvo6A_DWAolelanr0ilBvn6PylJK9k';` |
| JWT_ | 18 | `'Authorization': `Bearer ${JWT_TOKEN}`,` |

### tests\llm-validation-flow-test.js (11 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| 3000 | 201 | `timeout: 30000` |
| 3000 | 294 | `timeout: 30000` |
| process.env | 35 | `const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY \|\| config.llm.anthropicApiKey;` |
| process.env | 36 | `const GROK_API_KEY = process.env.GROK_API_KEY \|\| config.llm.grokApiKey;` |
| process.env | 37 | `const OPENAI_API_KEY = process.env.OPENAI_API_KEY \|\| config.llm.openaiApiKey;` |
| process.env | 182 | `model: process.env.GROK_MODEL_NAME \|\| 'grok-3-latest',` |
| process.env | 275 | `model: process.env.GPT_MODEL_NAME \|\| 'gpt-4-turbo',` |
| API_BASE_URL | 34 | `const API_BASE_URL = config.api.baseUrl;` |
| API_BASE_URL | 41 | `console.log(`API Base URL: ${API_BASE_URL}`);` |
| API_BASE_URL | 234 | `const response = await axios.post(`${API_BASE_URL}/orders/validate`, {` |
| API_BASE_URL | 323 | `const response = await axios.post(`${API_BASE_URL}/orders/${orderId}/clarify`, {` |

### tests\stripe-webhooks.test.js (12 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 16 | `const API_BASE_URL = (process.env.API_BASE_URL \|\| helpers.config.api.baseUrl \|\| 'http://localhost:3000').replace(/\/api$/, '');` |
| http:// | 16 | `const API_BASE_URL = (process.env.API_BASE_URL \|\| helpers.config.api.baseUrl \|\| 'http://localhost:3000').replace(/\/api$/, '');` |
| 3000 | 16 | `const API_BASE_URL = (process.env.API_BASE_URL \|\| helpers.config.api.baseUrl \|\| 'http://localhost:3000').replace(/\/api$/, '');` |
| process.env | 16 | `const API_BASE_URL = (process.env.API_BASE_URL \|\| helpers.config.api.baseUrl \|\| 'http://localhost:3000').replace(/\/api$/, '');` |
| process.env | 17 | `const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET \|\| 'whsec_test_secret';` |
| API_BASE_URL | 16 | `const API_BASE_URL = (process.env.API_BASE_URL \|\| helpers.config.api.baseUrl \|\| 'http://localhost:3000').replace(/\/api$/, '');` |
| API_BASE_URL | 18 | `const WEBHOOK_ENDPOINT = `${API_BASE_URL}/api/webhooks/stripe`;` |
| STRIPE_ | 17 | `const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET \|\| 'whsec_test_secret';` |
| STRIPE_ | 208 | `secret: STRIPE_WEBHOOK_SECRET,` |
| STRIPE_ | 242 | `secret: STRIPE_WEBHOOK_SECRET,` |
| STRIPE_ | 274 | `secret: STRIPE_WEBHOOK_SECRET,` |
| STRIPE_ | 348 | `secret: STRIPE_WEBHOOK_SECRET,` |

### tests\test-notifications.js (4 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 23 | `const TEST_EMAIL = process.env.TEST_EMAIL \|\| 'test@example.com';` |
| process.env | 98 | `console.log(`Email test mode: ${process.env.EMAIL_TEST_MODE === 'true' ? 'ENABLED' : 'DISABLED'}`);` |
| process.env | 100 | `if (process.env.EMAIL_TEST_MODE !== 'true') {` |
| process.env | 113 | `if (process.env.EMAIL_TEST_MODE === 'true') {` |

### tests\test-redis-basic.js (7 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 20 | `const memoryDbHost = process.env.MEMORYDB_HOST \|\| 'localhost';` |
| localhost | 25 | `const isLocalhost = memoryDbHost === 'localhost' \|\| memoryDbHost === '127.0.0.1';` |
| 127.0.0.1 | 25 | `const isLocalhost = memoryDbHost === 'localhost' \|\| memoryDbHost === '127.0.0.1';` |
| process.env | 20 | `const memoryDbHost = process.env.MEMORYDB_HOST \|\| 'localhost';` |
| process.env | 21 | `const memoryDbPort = parseInt(process.env.MEMORYDB_PORT \|\| '6379');` |
| process.env | 22 | `const memoryDbUser = process.env.MEMORYDB_USER;` |
| process.env | 23 | `const memoryDbPassword = process.env.MEMORYDB_PASSWORD;` |

### tests\test-redis-search-direct.js (28 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 86 | `const originalRedisHost = process.env.REDIS_CLOUD_HOST;` |
| process.env | 87 | `const originalRedisPort = process.env.REDIS_CLOUD_PORT;` |
| process.env | 90 | `process.env.REDIS_CLOUD_HOST = 'invalid-host';` |
| process.env | 91 | `process.env.REDIS_CLOUD_PORT = '9999';` |
| process.env | 130 | `process.env.REDIS_CLOUD_HOST = originalRedisHost;` |
| process.env | 131 | `process.env.REDIS_CLOUD_PORT = originalRedisPort;` |
| process.env | 138 | `process.env.REDIS_CLOUD_HOST = originalRedisHost;` |
| process.env | 139 | `process.env.REDIS_CLOUD_PORT = originalRedisPort;` |
| process.env | 147 | `process.env.REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST_ORIGINAL;` |
| process.env | 148 | `process.env.REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT_ORIGINAL;` |
| process.env | 162 | `process.env.REDIS_CLOUD_HOST_ORIGINAL = process.env.REDIS_CLOUD_HOST;` |
| process.env | 163 | `process.env.REDIS_CLOUD_PORT_ORIGINAL = process.env.REDIS_CLOUD_PORT;` |
| process.env | 181 | `process.env.REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST_ORIGINAL;` |
| process.env | 182 | `process.env.REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT_ORIGINAL;` |
| REDIS_ | 86 | `const originalRedisHost = process.env.REDIS_CLOUD_HOST;` |
| REDIS_ | 87 | `const originalRedisPort = process.env.REDIS_CLOUD_PORT;` |
| REDIS_ | 90 | `process.env.REDIS_CLOUD_HOST = 'invalid-host';` |
| REDIS_ | 91 | `process.env.REDIS_CLOUD_PORT = '9999';` |
| REDIS_ | 130 | `process.env.REDIS_CLOUD_HOST = originalRedisHost;` |
| REDIS_ | 131 | `process.env.REDIS_CLOUD_PORT = originalRedisPort;` |
| REDIS_ | 138 | `process.env.REDIS_CLOUD_HOST = originalRedisHost;` |
| REDIS_ | 139 | `process.env.REDIS_CLOUD_PORT = originalRedisPort;` |
| REDIS_ | 147 | `process.env.REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST_ORIGINAL;` |
| REDIS_ | 148 | `process.env.REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT_ORIGINAL;` |
| REDIS_ | 162 | `process.env.REDIS_CLOUD_HOST_ORIGINAL = process.env.REDIS_CLOUD_HOST;` |
| REDIS_ | 163 | `process.env.REDIS_CLOUD_PORT_ORIGINAL = process.env.REDIS_CLOUD_PORT;` |
| REDIS_ | 181 | `process.env.REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST_ORIGINAL;` |
| REDIS_ | 182 | `process.env.REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT_ORIGINAL;` |

### tests\test-redis-search-with-fallback-fix-updated.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 50 | `'http://localhost:3000/api/orders/validate',` |
| localhost | 96 | `'http://localhost:3000/api/orders/validate',` |
| http:// | 50 | `'http://localhost:3000/api/orders/validate',` |
| http:// | 96 | `'http://localhost:3000/api/orders/validate',` |
| 3000 | 50 | `'http://localhost:3000/api/orders/validate',` |
| 3000 | 96 | `'http://localhost:3000/api/orders/validate',` |

### tests\test-redis-search-with-fallback-fix.js (6 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 50 | `'http://localhost:3000/api/orders/validate',` |
| localhost | 97 | `'http://localhost:3000/api/orders/validate',` |
| http:// | 50 | `'http://localhost:3000/api/orders/validate',` |
| http:// | 97 | `'http://localhost:3000/api/orders/validate',` |
| 3000 | 50 | `'http://localhost:3000/api/orders/validate',` |
| 3000 | 97 | `'http://localhost:3000/api/orders/validate',` |

### tests\test-redis-search-with-fallback.js (29 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 45 | `const baseUrl = process.env.API_URL \|\| 'http://localhost:3000';` |
| http:// | 45 | `const baseUrl = process.env.API_URL \|\| 'http://localhost:3000';` |
| 3000 | 45 | `const baseUrl = process.env.API_URL \|\| 'http://localhost:3000';` |
| process.env | 41 | `testToken = process.env.TEST_TOKEN \|\| 'test-token';` |
| process.env | 45 | `const baseUrl = process.env.API_URL \|\| 'http://localhost:3000';` |
| process.env | 163 | `const originalRedisHost = process.env.REDIS_CLOUD_HOST;` |
| process.env | 164 | `const originalRedisPort = process.env.REDIS_CLOUD_PORT;` |
| process.env | 167 | `process.env.REDIS_CLOUD_HOST = 'invalid-host';` |
| process.env | 168 | `process.env.REDIS_CLOUD_PORT = '9999';` |
| process.env | 213 | `process.env.REDIS_CLOUD_HOST = originalRedisHost;` |
| process.env | 214 | `process.env.REDIS_CLOUD_PORT = originalRedisPort;` |
| process.env | 225 | `process.env.REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST_ORIGINAL;` |
| process.env | 226 | `process.env.REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT_ORIGINAL;` |
| process.env | 250 | `process.env.REDIS_CLOUD_HOST_ORIGINAL = process.env.REDIS_CLOUD_HOST;` |
| process.env | 251 | `process.env.REDIS_CLOUD_PORT_ORIGINAL = process.env.REDIS_CLOUD_PORT;` |
| process.env | 269 | `process.env.REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST_ORIGINAL;` |
| process.env | 270 | `process.env.REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT_ORIGINAL;` |
| REDIS_ | 163 | `const originalRedisHost = process.env.REDIS_CLOUD_HOST;` |
| REDIS_ | 164 | `const originalRedisPort = process.env.REDIS_CLOUD_PORT;` |
| REDIS_ | 167 | `process.env.REDIS_CLOUD_HOST = 'invalid-host';` |
| REDIS_ | 168 | `process.env.REDIS_CLOUD_PORT = '9999';` |
| REDIS_ | 213 | `process.env.REDIS_CLOUD_HOST = originalRedisHost;` |
| REDIS_ | 214 | `process.env.REDIS_CLOUD_PORT = originalRedisPort;` |
| REDIS_ | 225 | `process.env.REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST_ORIGINAL;` |
| REDIS_ | 226 | `process.env.REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT_ORIGINAL;` |
| REDIS_ | 250 | `process.env.REDIS_CLOUD_HOST_ORIGINAL = process.env.REDIS_CLOUD_HOST;` |
| REDIS_ | 251 | `process.env.REDIS_CLOUD_PORT_ORIGINAL = process.env.REDIS_CLOUD_PORT;` |
| REDIS_ | 269 | `process.env.REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST_ORIGINAL;` |
| REDIS_ | 270 | `process.env.REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT_ORIGINAL;` |

### tests\test-redis-search.js (5 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| localhost | 30 | `const baseUrl = process.env.API_URL \|\| 'http://localhost:3000';` |
| http:// | 30 | `const baseUrl = process.env.API_URL \|\| 'http://localhost:3000';` |
| 3000 | 30 | `const baseUrl = process.env.API_URL \|\| 'http://localhost:3000';` |
| process.env | 27 | `const testToken = process.env.TEST_TOKEN \|\| 'test-token';` |
| process.env | 30 | `const baseUrl = process.env.API_URL \|\| 'http://localhost:3000';` |

### tests\test-ses-email.js (9 matches)

| Pattern | Line | Content |
| ------- | ---- | ------- |
| process.env | 21 | `const TEST_EMAIL = process.env.TEST_EMAIL \|\| 'test@example.com';` |
| process.env | 22 | `const FROM_EMAIL = process.env.SES_FROM_EMAIL \|\| 'no-reply@radorderpad.com';` |
| process.env | 26 | `region: process.env.AWS_REGION \|\| 'us-east-2',` |
| process.env | 28 | `accessKeyId: process.env.AWS_ACCESS_KEY_ID \|\| '',` |
| process.env | 29 | `secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY \|\| ''` |
| process.env | 42 | `const testMode = process.env.EMAIL_TEST_MODE === 'true';` |
| AWS_ | 26 | `region: process.env.AWS_REGION \|\| 'us-east-2',` |
| AWS_ | 28 | `accessKeyId: process.env.AWS_ACCESS_KEY_ID \|\| '',` |
| AWS_ | 29 | `secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY \|\| ''` |

## Recommendations

Based on the audit results, consider the following recommendations:

- **Replace hardcoded localhost references** with environment variables or configuration settings
- **Use HTTPS instead of HTTP** for production environments
- **Replace hardcoded port references** with environment variables
- **Ensure all environment variables** are properly set in the Elastic Beanstalk environment
- **Create a centralized configuration module** to manage environment-specific settings
