# Validation Troubleshooting Scripts

This directory contains scripts for troubleshooting validation issues by comparing the current system's validation results with the expected results from Claude 3.7 Sonnet.

## Scripts

1. **test-validation-endpoint.js** - Tests the validation endpoint with a sample payload and compares the results with the expected output from Claude 3.7 Sonnet.

2. **generate-test-token.js** - Generates a JWT token for authenticating with the API endpoints.

3. **run-validation-test.bat/sh** - Batch/shell script to run the validation test.

4. **run-generate-token.bat/sh** - Batch/shell script to generate a test token.

## How to Use

### Step 1: Generate a Test Token

1. Run the token generation script:
   - Windows: `run-generate-token.bat`
   - Unix/Mac: `./run-generate-token.sh` (make sure to `chmod +x run-generate-token.sh` first)

2. The script will generate a token and save it to `trial-test-token.txt`.

3. Set the token as an environment variable:
   - Windows: `set TEST_TOKEN=<token>`
   - Unix/Mac: `export TEST_TOKEN=<token>`

   Or add it to your `.env` file:
   ```
   TEST_TOKEN=<token>
   ```

### Step 2: Run the Validation Test

1. Run the validation test script:
   - Windows: `run-validation-test.bat`
   - Unix/Mac: `./run-validation-test.sh` (make sure to `chmod +x run-validation-test.sh` first)

2. The script will send a request to the validation endpoint and display the results.

3. Compare the results with the expected output from Claude 3.7 Sonnet.

## Sample Payload

The test uses the following sample dictation text:

```
48-year-old female with chronic diarrhea for past 4 months, typically 4-5 loose stools daily. Reports upper right quadrant discomfort after meals. Patient has noted darkening of skin on knuckles and neck folds. Recent lab work shows mildly elevated ferritin and transaminases. Family history significant for father with cirrhosis of "unknown cause." Order abdominal ultrasound to evaluate for possible gallbladder disease.
```

## Expected Result from Claude 3.7 Sonnet

```json
{
  "diagnosisCodes": [
    {
      "code": "K59.1",
      "description": "Functional diarrhea"
    },
    {
      "code": "R10.13",
      "description": "Epigastric pain (Upper right quadrant pain)"
    },
    {
      "code": "R74.0",
      "description": "Nonspecific elevation of levels of transaminase"
    },
    {
      "code": "E83.110",
      "description": "Hemochromatosis, unspecified (suspected based on elevated ferritin)"
    }
  ],
  "procedureCodes": [
    {
      "code": "76700",
      "description": "Ultrasound, abdominal, complete"
    }
  ],
  "validationStatus": "valid",
  "complianceScore": 8,
  "feedback": "Abdominal ultrasound is appropriate for evaluating chronic diarrhea with RUQ pain and abnormal LFTs. Consider additional workup for possible hemochromatosis given the skin changes, elevated ferritin, and family history of cirrhosis."
}
```

## Troubleshooting

If you encounter any issues:

1. Make sure you have set the `TEST_TOKEN` environment variable correctly.
2. Check that the API server is running and accessible.
3. Verify that the JWT secret in your `.env` file matches the one used by the server.
4. Check the network connection to ensure you can reach the API server.