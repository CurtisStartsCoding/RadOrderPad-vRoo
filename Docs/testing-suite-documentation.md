# RadOrderPad Full Testing Suite Documentation

This document provides a comprehensive overview of the RadOrderPad testing infrastructure, including test types, configuration, and execution instructions.

## Table of Contents

1. [Overview](#overview)
2. [Test Configuration](#test-configuration)
3. [End-to-End Tests](#end-to-end-tests)
4. [Batch Tests](#batch-tests)
5. [LLM Validation Tests](#llm-validation-tests)
6. [Unit Tests](#unit-tests)
7. [Environment Configuration](#environment-configuration)
5. [Unit Tests](#unit-tests)
6. [Environment Configuration](#environment-configuration)
7. [Continuous Integration](#continuous-integration)

## Overview

The RadOrderPad testing suite consists of several types of tests:

- **End-to-End Tests**: Simulate complete user workflows using mock API responses
- **Batch Tests**: Test specific API endpoints and functionality
- **Unit Tests**: Test individual components and functions

Each test type serves a specific purpose in ensuring the quality and reliability of the RadOrderPad application.

## Test Configuration

All tests use a centralized configuration system to ensure consistency across different environments. The main configuration file is located at `test-config.js` in the project root:

```javascript
module.exports = {
    // API settings
    api: {
        baseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
        jwtSecret: process.env.JWT_SECRET || '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112'
    },
    
    // Database settings
    database: {
        container: process.env.DB_CONTAINER || 'radorderpad-postgres',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5433,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres123',
        mainDb: process.env.MAIN_DB || 'radorder_main',
        phiDb: process.env.PHI_DB || 'radorder_phi'
    },
    
    // LLM settings
    llm: {
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
        grokApiKey: process.env.GROK_API_KEY,
        openaiApiKey: process.env.OPENAI_API_KEY,
        claudeModelName: process.env.CLAUDE_MODEL_NAME || 'claude-3-7-sonnet-20250219',
        grokModelName: process.env.GROK_MODEL_NAME || 'grok-3',
        gptModelName: process.env.GPT_MODEL_NAME || 'gpt-4-turbo'
    }
}
```

This configuration can be overridden using environment variables, making it easy to switch between different environments (development, staging, production).

## End-to-End Tests

End-to-end tests simulate complete user workflows using mock API responses. These tests are located in the `tests/e2e` directory.

### Test Scenarios

The end-to-end tests are organized into scenarios, each representing a specific user workflow:

1. **Scenario A**: Full Physician Order (Successful Validation)
2. **Scenario B**: Full Physician Order (Override)
3. **Scenario C**: Admin Finalization
4. **Scenario D**: Radiology View/Update
5. **Scenario E**: Connection Request
6. **Scenario F**: User Invite
7. **Scenario G**: File Upload

### Running End-to-End Tests

To run all end-to-end tests:

```bash
npm run test:e2e
```

To run a specific scenario:

```bash
npm run test:e2e:scenario-a
```

### Mock API

The end-to-end tests use a mock API to simulate server responses. The mock API is defined in `tests/e2e/test-helpers.js`. This allows the tests to run without a real server, making them faster and more reliable.

## Batch Tests

Batch tests focus on testing specific API endpoints and functionality. These tests are located in the `tests/batch` directory.

### Available Batch Tests

- **File Upload Tests**: Test the file upload functionality, including presigned URL generation and S3 upload
- **Order Finalization Tests**: Test the order finalization process
- **Validation Tests**: Test the validation engine
- **Billing Tests**: Test the billing functionality
- **Stripe Webhook Tests**: Test the Stripe webhook integration

### Running Batch Tests

Batch tests can be run using the provided batch scripts:

```bash
# Windows
.\run-file-upload-tests.bat

# Unix/Mac
./run-file-upload-tests.sh
```

Some batch tests require a JWT token for authentication. You can generate a test token using:

```bash
node generate-test-token.js
```

Then run the test with the token:

```bash
node tests/batch/test-order-finalization.js <jwt_token>
```

## Unit Tests

Unit tests focus on testing individual components and functions. These tests are located in the `src` directory, alongside the code they test.

### Running Unit Tests

To run all unit tests:

```bash
npm test
```

## Environment Configuration

The testing suite can be configured for different environments using environment variables:

- **API_BASE_URL**: The base URL of the API (default: http://localhost:3000/api)
- **JWT_SECRET**: The secret used to sign JWT tokens
- **DB_CONTAINER**: The name of the database container
- **DB_HOST**: The database host
- **DB_PORT**: The database port
- **DB_USER**: The database user
- **DB_PASSWORD**: The database password
- **MAIN_DB**: The main database name
- **PHI_DB**: The PHI database name

These environment variables can be set in a `.env` file or directly in the environment.

## LLM Validation Tests

The LLM Validation Tests are designed to test the complete validation flow using real API calls to different LLM models. These tests are located in the `tests/llm-validation-flow-test.js` file.

### Test Flow

The LLM validation tests follow this flow:

1. **Grok generates the initial dictation**: Based on a prompt that describes a specific medical scenario
2. **Anthropic (Claude) validates the dictation**: Using the real validation API endpoint
3. **GPT responds to feedback if needed**: If the validation fails or needs clarification, GPT generates a clarification
4. **Anthropic (Claude) validates the clarification**: Using the real clarification API endpoint

### Test Categories

The tests are organized into three categories:

1. **Category A: Blatantly wrong cases**
   - Missing clinical indication
   - Contradictory information
   - Completely unrelated symptoms and requested study

2. **Category B: Cases that require one clarification**
   - Vague symptoms requiring clarification
   - Missing duration of symptoms
   - Incomplete medical history

3. **Category C: Cases that are correct immediately**
   - Clear headache with neurological symptoms
   - Low back pain with radiculopathy
   - Knee pain with suspected meniscal tear

### Running LLM Validation Tests

To run the LLM validation tests:

```bash
# Using npm script
npm run test:llm-validation

# Using batch scripts
# Windows
.\run-llm-validation-tests.bat

# Unix/Mac
./run-llm-validation-tests.sh
```

### API Keys

The LLM validation tests require API keys for the following services:

- **Anthropic API Key**: For Claude model access
- **Grok API Key**: For Grok model access
- **OpenAI API Key**: For GPT model access

These API keys can be set in the `test-config.js` file or as environment variables:

```javascript
// In test-config.js
module.exports = {
    // ...
    llm: {
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
        grokApiKey: process.env.GROK_API_KEY,
        openaiApiKey: process.env.OPENAI_API_KEY,
        // ...
    }
}
```

### Test Results

The test results are saved in the `test-results/llm-validation` directory. Each test case has its own result file, and there's a summary file that contains the overall results.

The summary includes:
- Total number of tests
- Number of passed and failed tests
- Success rate
- Breakdown by category
- Duration of the test run

## Continuous Integration

The testing suite is designed to be run in a continuous integration environment. The tests are automatically run on each pull request and merge to the main branch.

### CI/CD Pipeline

The CI/CD pipeline consists of the following steps:

1. **Build**: Compile the TypeScript code
2. **Unit Tests**: Run the unit tests
3. **End-to-End Tests**: Run the end-to-end tests
4. **Batch Tests**: Run the batch tests
5. **Deploy**: Deploy the application if all tests pass

### Test Reports

Test reports are generated for each test run and are available in the CI/CD dashboard. These reports include:

- Test results (pass/fail)
- Test coverage
- Performance metrics
- Error logs

## Conclusion

The RadOrderPad testing suite provides comprehensive test coverage for the application. By using a combination of end-to-end tests, batch tests, and unit tests, we can ensure that the application works correctly and reliably.