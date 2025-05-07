# Validation Engine Testing

This document provides test cases for the RadOrderPad Validation Engine using the `POST /api/orders/validate` endpoint.

## Prerequisites

- The RadOrderPad backend API is running on `localhost:3000`
- You have a valid JWT token for a user with the `physician` role
- The necessary environment variables are configured (API Keys, Model Names, Database URLs)

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
- "Using model: claude-3-opus-20240229"
- "LLM call successful using anthropic (claude-3-opus-20240229)"
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
- "LLM call successful using anthropic (claude-3-opus-20240229)"

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
- "LLM call successful using anthropic (claude-3-opus-20240229)"

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
- "LLM call successful using anthropic (claude-3-opus-20240229)"

## Results Summary Table

| Test Case | HTTP Status | Success | OrderId | ValidationStatus | ComplianceScore | Notes |
|-----------|-------------|---------|---------|------------------|-----------------|-------|
| Standard Dictation | 200 | true | 123 | appropriate | 8 | Created new draft order |
| Clarification | 200 | true | 123 | appropriate | 9 | Added X-ray and trauma info |
| Override Validation | 200 | true | 123 | override | 7 | Acknowledged contrast allergy |
| Short/Ambiguous | 200 | true | 124 | needs_clarification | 3 | Requested more information |

## Troubleshooting

If the tests fail, check the following:

1. **Authentication**: Ensure your JWT token is valid and has the `physician` role
2. **API Keys**: Verify that the LLM API keys are correctly set in the environment variables
3. **Database**: Confirm that the database is properly set up with the necessary tables and reference data
4. **Server Logs**: Check the server logs for any errors or exceptions

## Next Steps

After successful testing of the validation endpoint, you can proceed to test the order finalization endpoint:

```bash
curl -X PUT http://localhost:3000/api/orders/123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "finalValidationStatus": "appropriate",
    "finalComplianceScore": 8,
    "finalICD10Codes": "M75.1",
    "finalICD10CodeDescriptions": "Rotator cuff tear",
    "finalCPTCode": "73221",
    "finalCPTCodeDescription": "MRI shoulder without contrast",
    "clinicalIndication": "Right shoulder pain x 3 weeks, worse with overhead activity. Rule out rotator cuff tear."
  }'
```

This should update the order status to `pending_admin` and return a success response.