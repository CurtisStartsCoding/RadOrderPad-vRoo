# Validation Engine Testing Guide

This document provides comprehensive test cases and procedures for the RadOrderPad Validation Engine using the `POST /api/orders/validate` endpoint.

## Prerequisites

- The RadOrderPad backend API is running on `localhost:3000`
- You have a valid JWT token for a user with the `physician` role
- The necessary environment variables are configured (API Keys, Model Names, Database URLs)
- The database is populated with medical reference data
- At least one active default prompt template exists in the `prompt_templates` table

## Test Cases

### Test Case 1: Standard Clinical Dictation (Draft Creation)

This test creates a new draft order with a standard clinical dictation.

#### Curl Command

```bash
curl -X POST http://localhost:3000/api/orders/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "dictationText": "55 yo F with right shoulder pain x 3 weeks, worse with overhead activity. Rule out rotator cuff tear. Request MRI right shoulder without contrast."
  }'
```

#### Expected Result

- HTTP Status: 200 OK
- Response contains:
  - `success: true`
  - A numeric `orderId`
  - A `validationResult` object with:
    - `validationStatus: "appropriate"`
    - `complianceScore` between 7-9
    - Non-empty `feedback`
    - `suggestedICD10Codes` including codes like M75.1 (Rotator cuff tear)
    - `suggestedCPTCodes` including 73221 (MRI shoulder without contrast)

#### Console Logs

- "Starting validation process..."
- "PHI stripped from text"
- "Extracted keywords: shoulder, pain, rotator cuff, tear, MRI, ..."
- "Using prompt template: Default Validation Template"
- "Generated database context"
- "Constructed prompt"
- "Calling Anthropic Claude API..."
- "Using model: claude-3-7-sonnet-20250219"
- "LLM call successful using anthropic (claude-3-7-sonnet-20250219)"
- "Processed LLM response"

### Test Case 2: Clarification (Using Existing Order)

This test adds clarification to an existing order.

#### Curl Command

```bash
curl -X POST http://localhost:3000/api/orders/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "dictationText": "55 yo F with right shoulder pain x 3 weeks, worse with overhead activity. Rule out rotator cuff tear. Request MRI right shoulder without contrast. Previous X-ray negative. No trauma.",
    "orderId": 123  # Replace with the orderId from Test Case 1
  }'
```

#### Expected Result

- HTTP Status: 200 OK
- Response contains:
  - `success: true`
  - The same `orderId` as provided in the request
  - A `validationResult` object with:
    - `validationStatus: "appropriate"`
    - `complianceScore` possibly higher than the first attempt (due to additional information)
    - Updated `feedback` reflecting the additional information
    - Similar `suggestedICD10Codes` and `suggestedCPTCodes`

#### Console Logs

- Similar to Test Case 1
- "Extracted keywords: shoulder, pain, rotator cuff, tear, MRI, X-ray, trauma, ..."
- "LLM call successful using anthropic (claude-3-7-sonnet-20250219)"

### Test Case 3: Override Validation

This test adds an override justification to an existing order.

#### Curl Command

```bash
curl -X POST http://localhost:3000/api/orders/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "dictationText": "55 yo F with right shoulder pain x 3 weeks, worse with overhead activity. Rule out rotator cuff tear. Request MRI right shoulder without contrast. Previous X-ray negative. No trauma. Override Justification: Patient has history of contrast allergy, non-contrast is necessary despite potential benefit.",
    "orderId": 123,  # Replace with the orderId from Test Case 1
    "isOverrideValidation": true
  }'
```

#### Expected Result

- HTTP Status: 200 OK
- Response contains:
  - `success: true`
  - The same `orderId` as provided in the request
  - A `validationResult` object with:
    - `validationStatus: "override"` or `"appropriate"`
    - `complianceScore` reflecting the override context
    - `feedback` acknowledging the override justification
    - Similar `suggestedICD10Codes` and `suggestedCPTCodes`

#### Console Logs

- Similar to previous tests
- "Constructed prompt" (should include the override context)
- "LLM call successful using anthropic (claude-3-7-sonnet-20250219)"

### Test Case 4: Edge Case (Short/Ambiguous Dictation)

This test sends a very short and ambiguous dictation.

#### Curl Command

```bash
curl -X POST http://localhost:3000/api/orders/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "dictationText": "Knee pain"
  }'
```

#### Expected Result

- HTTP Status: 200 OK
- Response contains:
  - `success: true`
  - A numeric `orderId`
  - A `validationResult` object with:
    - `validationStatus: "needs_clarification"`
    - Lower `complianceScore` (likely 0-4)
    - `feedback` requesting more information
    - Limited or no `suggestedICD10Codes` and `suggestedCPTCodes`

#### Console Logs

- Similar to previous tests
- "Extracted keywords: knee, pain"
- "LLM call successful using anthropic (claude-3-7-sonnet-20250219)"

### Test Case 5: Persistent Headache

This test validates a clinical scenario involving a persistent headache.

#### Curl Command

```bash
curl -X POST http://localhost:3000/api/orders/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "dictationText": "Patient with persistent headache for 3 weeks, worsening with movement. History of migraines. Request MRI brain to rule out structural abnormalities.",
    "patientInfo": { "id": 1 },
    "radiologyOrganizationId": 1
  }'
```

#### Expected Result

- HTTP Status: 200 OK
- Response contains:
  - `success: true`
  - A numeric `orderId`
  - A `validationResult` object with:
    - `validationStatus: "appropriate"`
    - `complianceScore` around 7
    - `feedback` explaining why MRI brain is appropriate for persistent headache
    - `suggestedICD10Codes` including codes like R51.9 (Headache, unspecified) and G43.909 (Migraine)
    - `suggestedCPTCodes` including 70551 (MRI brain without contrast)

### Test Case 6: Acute Lower Back Pain

This test validates a clinical scenario involving acute lower back pain.

#### Curl Command

```bash
curl -X POST http://localhost:3000/api/orders/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "dictationText": "Patient with acute onset lower back pain after lifting heavy object yesterday. No radiation to legs, no numbness or weakness. No red flag symptoms. Request lumbar spine MRI.",
    "patientInfo": { "id": 1 },
    "radiologyOrganizationId": 1
  }'
```

#### Expected Result

- HTTP Status: 200 OK
- Response contains:
  - `success: true`
  - A numeric `orderId`
  - A `validationResult` object with:
    - `validationStatus: "inappropriate"`
    - `complianceScore` around 2
    - `feedback` explaining why MRI is not appropriate for acute lower back pain without red flags
    - `suggestedICD10Codes` including codes like M54.5 (Low back pain)
    - `suggestedCPTCodes` empty or limited

## Results Summary Table

| Test Case | HTTP Status | Success | OrderId | ValidationStatus | ComplianceScore | Notes |
|-----------|-------------|---------|---------|------------------|-----------------|-------|
| Standard Dictation | 200 | true | 123 | appropriate | 8 | Created new draft order |
| Clarification | 200 | true | 123 | appropriate | 9 | Added X-ray and trauma info |
| Override Validation | 200 | true | 123 | override | 7 | Acknowledged contrast allergy |
| Short/Ambiguous | 200 | true | 124 | needs_clarification | 3 | Requested more information |
| Persistent Headache | 200 | true | 125 | appropriate | 7 | MRI brain appropriate |
| Acute Lower Back Pain | 200 | true | 126 | inappropriate | 2 | MRI not indicated |

## Testing the Order Finalization Endpoint

After successful validation, you can test the order finalization endpoint:

```bash
curl -X PUT http://localhost:3000/api/orders/123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "signature": "data:image/png;base64,...",
    "status": "pending_admin",
    "finalValidationStatus": "appropriate",
    "finalCPTCode": "73221",
    "finalCPTCodeDescription": "MRI shoulder without contrast",
    "clinicalIndication": "Right shoulder pain x 3 weeks, worse with overhead activity. Rule out rotator cuff tear.",
    "finalICD10Codes": ["M75.1"],
    "finalICD10CodeDescriptions": "Rotator cuff tear",
    "overridden": false,
    "overrideJustification": null
  }'
```

This should update the order status to `pending_admin` and return a success response.

## PowerShell Testing Commands

For Windows environments, you can use these PowerShell commands:

```powershell
# Test the health endpoint
Invoke-WebRequest -Uri "http://localhost:3000/health" -Method GET

# Test the validation endpoint with a persistent headache scenario
Invoke-WebRequest -Uri "http://localhost:3000/api/orders/validate" -Method POST -Headers @{"Authorization"="Bearer YOUR_JWT_TOKEN"; "Content-Type"="application/json"} -Body '{"dictationText":"Patient with persistent headache for 3 weeks, worsening with movement. History of migraines. Request MRI brain to rule out structural abnormalities.", "patientInfo": {"id": 1}, "radiologyOrganizationId": 1}' | ConvertFrom-Json | ConvertTo-Json -Depth 10

# Test the validation endpoint with an acute lower back pain scenario
Invoke-WebRequest -Uri "http://localhost:3000/api/orders/validate" -Method POST -Headers @{"Authorization"="Bearer YOUR_JWT_TOKEN"; "Content-Type"="application/json"} -Body '{"dictationText":"Patient with acute onset lower back pain after lifting heavy object yesterday. No radiation to legs, no numbness or weakness. No red flag symptoms. Request lumbar spine MRI.", "patientInfo": {"id": 1}, "radiologyOrganizationId": 1}' | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

## Troubleshooting

If the tests fail, check the following:

1. **Authentication**: Ensure your JWT token is valid and has the `physician` role
2. **API Keys**: Verify that the LLM API keys are correctly set in the environment variables
3. **Database**: Confirm that the database is properly set up with the necessary tables and reference data
4. **Server Logs**: Check the server logs for any errors or exceptions
5. **Network**: Ensure that the server is running and accessible
6. **LLM Services**: Verify that the LLM services (Claude, Grok, GPT) are available and responding

## Monitoring Test Results

To monitor the validation engine's performance over time, you can:

1. **Log Analysis**: Review the logs in the `llm_validation_logs` and `validation_attempts` tables
2. **Performance Metrics**: Track response times, token usage, and success rates
3. **Validation Accuracy**: Compare the validation results with expected outcomes
4. **Error Rates**: Monitor the frequency and types of errors encountered

## Continuous Integration

For automated testing in a CI/CD pipeline, you can:

1. **Create Test Scripts**: Develop automated test scripts using Jest, Mocha, or other testing frameworks
2. **Mock LLM Responses**: Use mock LLM responses for faster and more predictable tests
3. **Database Seeding**: Seed the test database with known data for consistent test results
4. **Automated Reporting**: Generate test reports to track validation engine performance over time