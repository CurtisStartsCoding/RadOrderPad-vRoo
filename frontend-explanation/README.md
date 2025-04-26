b# RadOrderPad Frontend Integration Documentation

This directory contains technical documentation and code examples for frontend developers integrating with the RadOrderPad backend API, with a focus on the validation engine that processes clinical indications to assign CPT and ICD-10 codes.

## Contents

### 1. [API Workflow Guide](./api-workflow-guide.md)

A comprehensive guide to the API workflow for the RadOrderPad application, focusing on Scenario A: Full Physician Order with Validation and Finalization. This document covers:

- Authentication
- Validation endpoints
- Order finalization
- Data models
- Error handling
- Implementation recommendations

### 2. [Validation Workflow Guide](./validation-workflow-guide.md)

A detailed explanation of the validation workflow, focusing on how clinical indications from physician dictation are processed to assign appropriate CPT and ICD-10 codes. This document covers:

- Validation engine architecture
- Validation workflow steps
- API endpoints
- Best practices for integration

### 3. [Validation Engine Integration](./validation-engine-integration.md)

A technical guide for frontend developers on how to integrate with the RadOrderPad validation engine. This document covers:

- Core validation flow
- API integration details
- State management patterns
- Handling multiple validation attempts
- Error handling
- Performance considerations
- Testing strategies

### 4. [Admin Finalization Debug Guide](./admin-finalization-debug-guide.md)

A comprehensive debugging guide for the Admin Finalization workflow, focusing on the "Send to Radiology" functionality. This document covers:

- Testing methodology
- Database verification
- Root cause analysis of the database connection issue
- Recommended solution
- Frontend implementation considerations

### 5. [Admin Finalization API Guide](./admin-finalization-api-guide.md)

A detailed API integration guide for the Admin Finalization workflow, focusing on the fixed "Send to Radiology" implementation. This document covers:

- Complete workflow explanation
- Database architecture overview
- API endpoint details
- Frontend integration code examples
- Error handling strategies
- Testing procedures

### 6. [React Implementation Example](./react-implementation-example.jsx)

A sample React implementation of the RadOrderPad validation workflow, demonstrating:

- Authentication flow
- Patient information collection
- Dictation submission
- Validation result display
- Order finalization
- Error handling

### 7. [PIDN Validation Test](./pidn-validation-test.js)

A test script that demonstrates how to properly use the Patient Identifier Number (PIDN) in the validation workflow:

- Tests multiple PIDN formats
- Demonstrates complete validation workflow with PIDN
- Includes error handling and logging
- Can be run using the [run-pidn-validation-test.bat](./run-pidn-validation-test.bat) script

### 8. [Super Admin Features](./API_IMPLEMENTATION_GUIDE/superadmin_feature.yaml)

A comprehensive implementation of Super Admin features for system-wide administration, including:

- Organization management
- User management
- Prompt template management
- System logs viewing

The Super Admin logs viewing capabilities include:

- **LLM Validation Logs**: View logs of all LLM validation requests with basic filtering
  - Endpoint: `GET /api/superadmin/logs/validation`
  - Filters: organization_id, user_id, date range, status, llm_provider, model_name

- **Enhanced LLM Validation Logs**: Advanced filtering for validation logs
  - Endpoint: `GET /api/superadmin/logs/validation/enhanced`
  - Advanced filters: multiple statuses, text search, date presets, sorting options

- **Credit Usage Logs**: View logs of credit usage across the platform
  - Endpoint: `GET /api/superadmin/logs/credits`
  - Filters: organization_id, user_id, date range, action_type

- **Purgatory Events**: View logs of organization purgatory status changes
  - Endpoint: `GET /api/superadmin/logs/purgatory`
  - Filters: organization_id, date range, status, reason

### 9. Debug Scripts

A collection of scripts for debugging the Admin Finalization workflow:

- **[test-update-patient-info.js](./debug-scripts/test-update-patient-info.js)**: Tests the patient information update endpoint
- **[test-send-to-radiology-precision.js](./debug-scripts/test-send-to-radiology-precision.js)**: Tests the send-to-radiology endpoint
- **[test-update-and-send.js](./debug-scripts/test-update-and-send.js)**: Tests the complete workflow
- **[test-db-connection.js](./debug-scripts/test-db-connection.js)**: Tests database connections
- **[test-organization-relationships.js](./debug-scripts/test-organization-relationships.js)**: Tests organization relationships
- **[update-order-organizations.js](./debug-scripts/update-order-organizations.js)**: Updates order organization IDs

## Key Integration Points

When integrating with the RadOrderPad backend, pay special attention to:

1. **Patient Identification**: Use the Patient Identifier Number (PIDN) as the primary identifier for patients.

2. **Validation Flow**: Implement the multi-step validation process correctly, including:
   - Initial validation
   - Clarification loop (if needed)
   - Override flow (if validation fails after 3 attempts)
   - Finalization with signature

3. **Error Handling**: Implement robust error handling for API calls, especially for the validation endpoint which may have longer response times due to LLM processing.

4. **State Management**: Maintain proper state throughout the validation workflow, particularly tracking the orderId returned from the first validation call.

## Getting Started

1. Review the API Workflow Guide to understand the overall flow
2. Study the Validation Workflow Guide to understand the validation process
3. Use the Validation Engine Integration guide for technical implementation details
4. Read the Admin Finalization API Guide for details on the admin workflow
5. Reference the React Implementation Example for practical code patterns
6. Run the PIDN Validation Test to verify correct handling of Patient Identifier Numbers:
   ```
   # Windows
   cd frontend-explanation
   run-pidn-validation-test.bat
   
   # Linux/macOS
   cd frontend-explanation
   chmod +x run-pidn-validation-test.sh
   ./run-pidn-validation-test.sh
   ```
7. Run the Admin Finalization Debug Tests to understand the admin workflow:
   ```
   # Windows
   cd frontend-explanation/debug-scripts
   run-all-debug-tests.bat
   
   # Linux/macOS
   cd frontend-explanation/debug-scripts
   chmod +x run-all-debug-tests.sh
   ./run-all-debug-tests.sh
   ```

## Best Practices

1. Always store and use the orderId returned from the first validation call
2. Send the complete combined text (original + clarifications) on subsequent validation attempts
3. Implement proper error handling for all API calls
4. Provide clear feedback to users during the validation process
5. Use the Patient Identifier Number (PIDN) as the primary patient identifier
6. When implementing the admin finalization workflow:
   - Use the fixed send-to-radiology endpoint (`/api/admin/orders/:orderId/send-to-radiology-fixed`)
   - Handle 402 Payment Required errors (insufficient credits)
   - Validate all required fields (city, state, zip_code) before submission
   - Implement proper error handling for all possible response codes
7. For Super Admin interfaces:
   - Implement robust filtering and pagination for log viewing
   - Use date presets for common time ranges (today, last 7 days, etc.)
   - Provide text search capabilities for enhanced log filtering
   - Display user-friendly names for organizations and users in log entries

## Support

For additional support or questions about the API integration, contact the RadOrderPad development team.