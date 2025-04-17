#!/bin/bash
echo "RadOrderPad LLM Validation Flow Tests"
echo "===================================="
echo "1. Run with fixed test cases"
echo "2. Run with random test cases"
echo ""

read -p "Enter your choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo "Running with fixed test cases..."
    node tests/llm-validation-flow-test.js
elif [ "$choice" = "2" ]; then
    echo "Running with random test cases..."
    node tests/llm-validation-flow-test.js --random
else
    echo "Invalid choice. Running with fixed test cases..."
    node tests/llm-validation-flow-test.js
fi

read -p "Press Enter to continue..."