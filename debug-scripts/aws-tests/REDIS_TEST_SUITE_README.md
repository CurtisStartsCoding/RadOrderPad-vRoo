# Redis Optimization Test Suite

This test suite is designed to evaluate the Redis implementation with different LLMs and test cases. It helps identify optimization opportunities by comparing results across different configurations.

## Overview

The test suite:

1. Tests 10 different medical scenarios (including hemochromatosis, multiple sclerosis, pulmonary embolism, etc.)
2. Uses all three LLMs (Claude, Grok, GPT)
3. Compares the results to identify optimization opportunities
4. Generates detailed reports and analysis

## Prerequisites

- Node.js installed
- Access to the RadOrderPad API
- Valid API tokens in `.env.production`
- Redis Cloud connection configured in `.env.production`

## Running the Tests

### On Windows

```
debug-scripts\aws-tests\run-redis-optimization-tests.bat
```

### On Unix/Linux/Mac

```
chmod +x debug-scripts/aws-tests/run-redis-optimization-tests.sh
./debug-scripts/aws-tests/run-redis-optimization-tests.sh
```

## Test Cases

The test suite includes the following medical scenarios:

1. **Hemochromatosis** - Case with elevated ferritin, skin changes, and family history of cirrhosis
2. **Multiple Sclerosis** - Case with recurring neurological symptoms and vision changes
3. **Pulmonary Embolism** - Case with shortness of breath after surgery and elevated D-dimer
4. **Appendicitis** - Case with right lower quadrant pain, fever, and elevated WBC
5. **Breast Cancer** - Case with palpable breast lump and family history
6. **Kidney Stones** - Case with flank pain, hematuria, and history of stones
7. **Stroke** - Case with sudden onset weakness and speech difficulty
8. **Lung Cancer** - Case with persistent cough, hemoptysis, and weight loss
9. **Crohn's Disease** - Case with chronic abdominal pain, diarrhea, and family history
10. **Spinal Stenosis** - Case with back pain, leg symptoms, and difficulty walking

Each test case includes expected diagnosis and procedure codes for accuracy evaluation.

## LLM Configurations

The test suite uses the following LLMs:

1. **Claude** (Anthropic) - Model: claude-3-7-sonnet-20250219
2. **Grok** - Model: grok-3-latest
3. **GPT** (OpenAI) - Model: gpt-4-turbo

## Results and Analysis

The test results are saved in the `redis-test-results` directory. For each test case and LLM combination, a JSON file is created with detailed information about:

- Response time
- Redis indicators
- Keyword count and list
- Diagnosis and procedure accuracy
- Full API response

A summary report (`summary_report.json`) is also generated with:

- Overall statistics
- Comparison by LLM
- Comparison by test case
- Keyword analysis
- Accuracy analysis

## Interpreting Results

When analyzing the results, look for:

1. **Keyword Count Variations**: Compare the number of keywords extracted across different test cases and LLMs
2. **Accuracy Differences**: Identify which LLMs perform better for specific medical conditions
3. **Redis Performance**: Check if Redis caching is working effectively
4. **Missing Diagnoses**: Pay special attention to cases where expected diagnoses are missing

## Troubleshooting

If you encounter issues:

1. Check that your API tokens are valid
2. Verify Redis Cloud connection settings
3. Ensure the API endpoint is accessible
4. Check for any rate limiting or timeout issues

## Extending the Test Suite

To add more test cases:

1. Add a new entry to the `TEST_CASES` array in `redis-optimization-test-suite.js`
2. Include the dictation text and expected diagnosis and procedure codes
3. Run the test suite again

To modify LLM configurations:

1. Update the `LLM_CONFIGS` array in `redis-optimization-test-suite.js`
2. Ensure the corresponding API keys are set in `.env.production`