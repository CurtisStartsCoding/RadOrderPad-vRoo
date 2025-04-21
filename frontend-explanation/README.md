# RadOrderPad Frontend Integration Documentation

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

### 5. [React Implementation Example](./react-implementation-example.jsx)

A sample React implementation of the RadOrderPad validation workflow, demonstrating:

- Authentication flow
- Patient information collection
- Dictation submission
- Validation result display
- Order finalization
- Error handling

### 6. [PIDN Validation Test](./pidn-validation-test.js)

A test script that demonstrates how to properly use the Patient Identifier Number (PIDN) in the validation workflow:

- Tests multiple PIDN formats
- Demonstrates complete validation workflow with PIDN
- Includes error handling and logging
- Can be run using the [run-pidn-validation-test.bat](./run-pidn-validation-test.bat) script

### 7. Debug Scripts

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
4. Reference the React Implementation Example for practical code patterns
5. Run the PIDN Validation Test to verify correct handling of Patient Identifier Numbers:
   ```
   # Windows
   cd frontend-explanation
   run-pidn-validation-test.bat
   
   # Linux/macOS
   cd frontend-explanation
   chmod +x run-pidn-validation-test.sh
   ./run-pidn-validation-test.sh
   ```
6. Run the Admin Finalization Debug Tests to understand the admin workflow:
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
   - Ensure proper database connection configuration
   - Handle 402 Payment Required errors (insufficient credits)
   - Validate all required fields (city, state, zip_code) before submission

## Support

For additional support or questions about the API integration, contact the RadOrderPad development team.