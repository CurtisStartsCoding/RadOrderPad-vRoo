# Comprehensive Imaging Order Validation Framework

This document provides instructions for implementing and testing the new comprehensive imaging order validation framework in RadOrderPad.

## Overview

The comprehensive validation framework enhances the accuracy of CPT and ICD-10 code assignment by implementing a structured, multi-stage validation process with strict requirements for clinical information and coding specificity.

Key features:
- Primary validation gates (must-pass criteria)
- Comprehensive diagnosis coding requirements (minimum 3-4 ICD-10 codes)
- Modality-specific validation
- Specialty-specific validation
- Rare disease considerations
- Structured output format with clear feedback

## Implementation Files

The implementation consists of the following files:

1. `update_comprehensive_prompt.sql` - SQL script to update the prompt template in the database
2. `update_comprehensive_prompt.bat` - Windows batch script to execute the SQL script
3. `update_comprehensive_prompt.sh` - Unix/Mac shell script to execute the SQL script
4. `test-comprehensive-prompt.js` - Node.js script to test the new prompt
5. `run-comprehensive-prompt-test.bat` - Windows batch script to run the test
6. `run-comprehensive-prompt-test.sh` - Unix/Mac shell script to run the test

## Implementation Steps

### 1. Update the Prompt Template

The first step is to update the prompt template in the database with the new comprehensive framework.

#### Windows:
```
.\update_comprehensive_prompt.bat
```

#### Unix/Mac:
```
chmod +x update_comprehensive_prompt.sh
./update_comprehensive_prompt.sh
```

This will:
1. Deactivate all existing default prompts
2. Insert the new comprehensive prompt as the active default prompt

### 2. Test the Implementation

After updating the prompt template, you should test that it's working correctly.

#### Windows:
```
.\run-comprehensive-prompt-test.bat
```

#### Unix/Mac:
```
chmod +x run-comprehensive-prompt-test.sh
./run-comprehensive-prompt-test.sh
```

The test script will:
1. Send a sample order to the validation endpoint
2. Check that the response includes at least 3-4 ICD-10 codes with a clear primary code
3. Verify that the response follows the expected format

## Configuration

All scripts use environment variables for configuration, making it easy to adapt to different environments:

- `API_BASE_URL` - The base URL of the API (default: http://localhost:3000)
- `API_PATH` - The API path (default: /api)
- `TEST_AUTH_TOKEN` - JWT token for authentication

You can modify these variables in the scripts or set them in your environment before running the scripts.

## Expected Output Format

The validation engine now returns a more comprehensive response with:

```json
{
  "diagnosisCodes": [
    {"code": "X00.0", "description": "Primary diagnosis description", "isPrimary": true},
    {"code": "X00.1", "description": "Secondary diagnosis description", "isPrimary": false},
    {"code": "X00.2", "description": "Related comorbidity description", "isPrimary": false},
    {"code": "Z00.0", "description": "Relevant history/risk factor", "isPrimary": false}
  ],
  "procedureCodes": [
    {"code": "00000", "description": "Procedure description"}
  ],
  "validationStatus": "valid" or "invalid",
  "complianceScore": number (0-100),
  "feedback": "Educational message with specific recommendation if invalid",
  "primaryDiagnosis": "X00.0",
  "codeJustification": {
    "X00.0": "Clinical evidence supporting this code",
    "X00.1": "Clinical evidence supporting this code",
    "X00.2": "Clinical evidence supporting this code"
  }
}
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues when running the update scripts:

1. Check that your database credentials are correct in the `.env` file
2. Verify that the database server is running
3. Ensure you have the necessary permissions to update the `prompt_templates` table

### API Connection Issues

If the test script fails to connect to the API:

1. Verify that the API server is running
2. Check that the `API_BASE_URL` and `API_PATH` environment variables are set correctly
3. Ensure you have a valid JWT token for authentication

### Response Format Issues

If the test script reports issues with the response format:

1. Check the server logs for any errors in the validation process
2. Verify that the prompt template was updated successfully
3. Ensure the LLM is configured correctly to handle the new prompt format