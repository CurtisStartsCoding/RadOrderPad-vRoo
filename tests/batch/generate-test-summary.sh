#!/bin/bash
# Script to generate a consolidated test summary report
echo "Generating test summary report..."
echo

# Check if test-results directory exists
if [ ! -d "test-results" ]; then
    echo "Error: test-results directory not found. Please run the tests first."
    exit 1
fi

# Create summary file
SUMMARY_FILE="test-results/test-summary.md"
echo "# RadOrderPad Test Summary" > $SUMMARY_FILE
echo >> $SUMMARY_FILE
echo "Generated on $(date)" >> $SUMMARY_FILE
echo >> $SUMMARY_FILE
echo "## Test Results" >> $SUMMARY_FILE
echo >> $SUMMARY_FILE
echo "| Test Suite | Status | Details |" >> $SUMMARY_FILE
echo "| ---------- | ------ | ------- |" >> $SUMMARY_FILE

# Process validation tests
if [ -f "test-results/validation-tests.log" ]; then
    if grep -q "\[PASS\]" "test-results/validation-tests.log"; then
        echo "| Validation Tests | ✅ PASS | Order validation with real LLM integration |" >> $SUMMARY_FILE
    else
        echo "| Validation Tests | ❌ FAIL | See validation-tests.log for details |" >> $SUMMARY_FILE
    fi
else
    echo "| Validation Tests | ⚠️ SKIPPED | Test not run |" >> $SUMMARY_FILE
fi

# Process order finalization tests
if [ -f "test-results/order-finalization-tests.log" ]; then
    if grep -q "\[PASS\]" "test-results/order-finalization-tests.log"; then
        echo "| Order Finalization Tests | ✅ PASS | Physician order finalization with temporary patient creation |" >> $SUMMARY_FILE
    else
        echo "| Order Finalization Tests | ❌ FAIL | See order-finalization-tests.log for details |" >> $SUMMARY_FILE
    fi
else
    echo "| Order Finalization Tests | ⚠️ SKIPPED | Test not run |" >> $SUMMARY_FILE
fi

# Process upload tests
if [ -f "test-results/upload-tests.log" ]; then
    if grep -q "\[PASS\]" "test-results/upload-tests.log"; then
        echo "| Upload Tests | ✅ PASS | File upload service and presigned URL generation |" >> $SUMMARY_FILE
    else
        echo "| Upload Tests | ❌ FAIL | See upload-tests.log for details |" >> $SUMMARY_FILE
    fi
else
    echo "| Upload Tests | ⚠️ SKIPPED | Test not run |" >> $SUMMARY_FILE
fi

# Process admin finalization tests
if [ -f "test-results/admin-finalization-tests.log" ]; then
    if grep -q "\[PASS\]" "test-results/admin-finalization-tests.log"; then
        echo "| Admin Finalization Tests | ✅ PASS | Order finalization workflow |" >> $SUMMARY_FILE
    else
        echo "| Admin Finalization Tests | ❌ FAIL | See admin-finalization-tests.log for details |" >> $SUMMARY_FILE
    fi
else
    echo "| Admin Finalization Tests | ⚠️ SKIPPED | Test not run |" >> $SUMMARY_FILE
fi

# Process connection tests
if [ -f "test-results/connection-tests.log" ]; then
    if grep -q "\[PASS\]" "test-results/connection-tests.log"; then
        echo "| Connection Management Tests | ✅ PASS | Organization connection management |" >> $SUMMARY_FILE
    else
        echo "| Connection Management Tests | ❌ FAIL | See connection-tests.log for details |" >> $SUMMARY_FILE
    fi
else
    echo "| Connection Management Tests | ⚠️ SKIPPED | Test not run |" >> $SUMMARY_FILE
fi

# Process location tests
if [ -f "test-results/location-tests.log" ]; then
    if grep -q "\[PASS\]" "test-results/location-tests.log"; then
        echo "| Location Management Tests | ✅ PASS | Organization location management |" >> $SUMMARY_FILE
    else
        echo "| Location Management Tests | ❌ FAIL | See location-tests.log for details |" >> $SUMMARY_FILE
    fi
else
    echo "| Location Management Tests | ⚠️ SKIPPED | Test not run |" >> $SUMMARY_FILE
fi

# Process radiology workflow tests
if [ -f "test-results/radiology-workflow-tests.log" ]; then
    if grep -q "\[PASS\]" "test-results/radiology-workflow-tests.log"; then
        echo "| Radiology Workflow Tests | ✅ PASS | Radiology group order management |" >> $SUMMARY_FILE
    else
        echo "| Radiology Workflow Tests | ❌ FAIL | See radiology-workflow-tests.log for details |" >> $SUMMARY_FILE
    fi
else
    echo "| Radiology Workflow Tests | ⚠️ SKIPPED | Test not run |" >> $SUMMARY_FILE
fi

echo >> $SUMMARY_FILE
echo "## Core Functionality Status" >> $SUMMARY_FILE
echo >> $SUMMARY_FILE

# Check user registration and login
echo "### User Registration & Login" >> $SUMMARY_FILE
if [ -f "test-results/connection-tests.log" ]; then
    if grep -q "Generating JWT token" "test-results/connection-tests.log"; then
        echo "✅ User authentication is working" >> $SUMMARY_FILE
    else
        echo "❌ User authentication issues detected" >> $SUMMARY_FILE
    fi
else
    echo "⚠️ Not tested" >> $SUMMARY_FILE
fi
echo >> $SUMMARY_FILE

# Check order validation
echo "### Physician Order Validation" >> $SUMMARY_FILE
if [ -f "test-results/validation-tests.log" ]; then
    if grep -q "validation successful" "test-results/validation-tests.log"; then
        echo "✅ Order validation with real LLM is working" >> $SUMMARY_FILE
    else
        echo "❌ Order validation issues detected" >> $SUMMARY_FILE
    fi
else
    echo "⚠️ Not tested" >> $SUMMARY_FILE
fi
echo >> $SUMMARY_FILE

# Check order finalization
echo "### Order Finalization" >> $SUMMARY_FILE
if [ -f "test-results/admin-finalization-tests.log" ]; then
    if grep -q "finalization successful" "test-results/admin-finalization-tests.log"; then
        echo "✅ Order finalization is working" >> $SUMMARY_FILE
    else
        echo "❌ Order finalization issues detected" >> $SUMMARY_FILE
    fi
else
    echo "⚠️ Not tested" >> $SUMMARY_FILE
fi
echo >> $SUMMARY_FILE

# Check user management
echo "### User Management" >> $SUMMARY_FILE
if [ -f "test-results/admin-finalization-tests.log" ]; then
    if grep -q "user management" "test-results/admin-finalization-tests.log"; then
        echo "✅ User management is working" >> $SUMMARY_FILE
    else
        echo "⚠️ User management not explicitly tested" >> $SUMMARY_FILE
    fi
else
    echo "⚠️ Not tested" >> $SUMMARY_FILE
fi
echo >> $SUMMARY_FILE

# Check location management
echo "### Location Management" >> $SUMMARY_FILE
if [ -f "test-results/location-tests.log" ]; then
    if grep -q "\[PASS\]" "test-results/location-tests.log"; then
        echo "✅ Location management is working" >> $SUMMARY_FILE
    else
        echo "❌ Location management issues detected" >> $SUMMARY_FILE
    fi
else
    echo "⚠️ Not tested" >> $SUMMARY_FILE
fi
echo >> $SUMMARY_FILE

# Check connection management
echo "### Connection Management" >> $SUMMARY_FILE
if [ -f "test-results/connection-tests.log" ]; then
    if grep -q "\[PASS\]" "test-results/connection-tests.log"; then
        echo "✅ Connection management is working" >> $SUMMARY_FILE
    else
        echo "❌ Connection management issues detected" >> $SUMMARY_FILE
    fi
else
    echo "⚠️ Not tested" >> $SUMMARY_FILE
fi
echo >> $SUMMARY_FILE

# Check file upload
echo "### File Upload" >> $SUMMARY_FILE
if [ -f "test-results/upload-tests.log" ]; then
    if grep -q "\[PASS\]" "test-results/upload-tests.log"; then
        echo "✅ File upload service is working" >> $SUMMARY_FILE
    else
        echo "❌ File upload issues detected" >> $SUMMARY_FILE
    fi
else
    echo "⚠️ Not tested" >> $SUMMARY_FILE
fi
echo >> $SUMMARY_FILE

echo "Summary report generated: $SUMMARY_FILE"
echo