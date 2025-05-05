# Grok LLM Validation Test

This directory contains scripts to run the Grok LLM validation test, which tests a complete validation flow using three AI models:

1. **Grok** generates the initial medical dictation
2. **Anthropic (Claude)** validates the dictation
3. **GPT** responds to feedback if needed

## Prerequisites

Before running the tests, you need to have API keys for:

1. **Grok API** - Available from x.ai
2. **Anthropic API** - For Claude
3. **OpenAI API** - For GPT models

## Setup

1. Edit either `run-grok-test.bat` (Windows) or `run-grok-test.sh` (Unix/Mac) and replace the placeholder API keys with your actual API keys:

```
# In run-grok-test.bat
set ANTHROPIC_API_KEY=your_anthropic_api_key_here
set GROK_API_KEY=your_grok_api_key_here
set OPENAI_API_KEY=your_openai_api_key_here

# In run-grok-test.sh
export ANTHROPIC_API_KEY="your_anthropic_api_key_here"
export GROK_API_KEY="your_grok_api_key_here"
export OPENAI_API_KEY="your_openai_api_key_here"
```

## Running the Tests

### Windows

```
.\run-grok-test.bat
```

### Unix/Mac

```
chmod +x run-grok-test.sh
./run-grok-test.sh
```

## Test Categories

The test includes three categories of test cases:

1. **Category A: Blatantly wrong cases** - These test cases have obvious issues that should be caught by validation
2. **Category B: Cases that require one clarification** - These test cases need additional information
3. **Category C: Cases that are correct immediately** - These test cases should pass validation without issues

## Results

Test results are saved in the `test-results/llm-validation` directory, with a summary file and individual result files for each test case.