# Direct Redis LLM Test

This test suite connects directly to Redis, performs searches with medical keywords, and tests different LLMs with the data retrieved directly from Redis. This approach bypasses the API and allows for direct testing of the Redis implementation.

## Overview

The direct Redis test:

1. Connects directly to Redis using credentials from `.env.production`
2. Extracts keywords from medical dictation text
3. Performs Redis searches for ICD-10 codes, CPT codes, mappings, and markdown docs
4. Constructs prompts with the retrieved data
5. Tests multiple LLMs (Claude, Grok, GPT) with the same prompt
6. Evaluates and compares the results

## Prerequisites

- Node.js installed
- Redis client library (`redis` npm package)
- Axios for API calls (`axios` npm package)
- Dotenv for environment variables (`dotenv` npm package)
- Valid Redis Cloud credentials in `.env.production`
- Valid API keys for LLMs in `.env.production`

## Running the Tests

### On Windows

```
debug-scripts\aws-tests\run-direct-redis-llm-test.bat
```

### On Unix/Linux/Mac

```
chmod +x debug-scripts/aws-tests/run-direct-redis-llm-test.sh
./debug-scripts/aws-tests/run-direct-redis-llm-test.sh
```

## Test Process

1. **Redis Connection**: The script connects directly to Redis Cloud using the credentials in `.env.production`.

2. **Keyword Extraction**: For each test case, keywords are extracted from the dictation text.

3. **Redis Searches**:
   - Search for ICD-10 codes using the extracted keywords
   - Search for CPT codes using the extracted keywords
   - Get mappings between ICD-10 and CPT codes
   - Get markdown documentation for ICD-10 codes

4. **Database Context**: The script formats the Redis search results into a structured database context.

5. **Prompt Construction**: A prompt is constructed using the dictation text and database context.

6. **LLM Testing**: The prompt is sent to multiple LLMs (Claude, Grok, GPT) for processing.

7. **Result Evaluation**: The responses are evaluated for accuracy in identifying diagnosis and procedure codes.

## Test Results

The test results are saved in the `redis-direct-test-results` directory:

- `*_context.txt`: The formatted database context from Redis
- `*_prompt.txt`: The prompt sent to the LLMs
- `*_response.txt`: The raw response from each LLM
- `*_result.json`: The parsed results with accuracy evaluation

## Hemochromatosis Test Case

The test includes a specific case for hemochromatosis, which includes:

- Dictation text with clinical indicators for hemochromatosis
- Expected diagnosis codes including E83.110 (Hereditary hemochromatosis)
- Expected procedure code 76700 (Ultrasound, abdominal, complete)

This case helps identify why the hemochromatosis code might not be found despite the clinical indicators in the dictation.

## Troubleshooting

If you encounter issues:

1. **Redis Connection**: Ensure your Redis Cloud credentials are correct in `.env.production`.
   - Check the host, port, and password
   - Verify that your IP address is allowlisted in Redis Cloud

2. **LLM API Keys**: Ensure your API keys for Claude, Grok, and GPT are valid in `.env.production`.

3. **Redis Indexes**: Verify that the Redis indexes exist:
   - `icd10_index`
   - `cpt_index`
   - `mapping_index`
   - `markdown_index`

4. **Network Issues**: If you're behind a firewall or VPN, ensure it allows connections to Redis Cloud and LLM APIs.

## Extending the Test

To add more test cases:

1. Add a new entry to the `TEST_CASES` array in `direct-redis-llm-test.js`
2. Include the dictation text and expected diagnosis and procedure codes
3. Run the test script again

To modify LLM configurations:

1. Update the `LLM_CONFIGS` array in `direct-redis-llm-test.js`
2. Ensure the corresponding API keys are set in `.env.production`