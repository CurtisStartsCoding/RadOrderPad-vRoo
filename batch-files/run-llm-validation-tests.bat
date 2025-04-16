@echo off
echo RadOrderPad LLM Validation Flow Tests
echo ====================================
echo 1. Run with fixed test cases
echo 2. Run with random test cases
echo.

set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo Running with fixed test cases...
    node tests/llm-validation-flow-test.js
) else if "%choice%"=="2" (
    echo Running with random test cases...
    node tests/llm-validation-flow-test.js --random
) else (
    echo Invalid choice. Running with fixed test cases...
    node tests/llm-validation-flow-test.js
)

pause