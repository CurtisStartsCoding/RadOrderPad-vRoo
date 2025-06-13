/**
 * Comprehensive Super Admin API Tests
 * 
 * This script tests all super admin endpoints including:
 * - Organizations management
 * - Users management
 * - Prompt templates management
 * - Prompt assignments management
 * - Log viewing (validation, credits, purgatory)
 */

const fetch = require('node-fetch');
const assert = require('assert').strict;
const helpers = require('./test-helpers');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const SUPERADMIN_BASE = `${API_BASE_URL}/superadmin`;

// Test data
const superAdminUser = {
    userId: 1,
    orgId: 1,
    role: 'super_admin',
    email: 'test.superadmin@example.com'
};

// Test results tracking
const testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

function recordTestResult(name, passed, error = null, response = null) {
    if (passed) {
        testResults.passed++;
        console.log(`✅ PASSED: ${name}`);
        if (response && response.data) {
            console.log(`   Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
        }
    } else {
        testResults.failed++;
        console.log(`❌ FAILED: ${name}`);
        if (error) {
            console.log(`   Error: ${error.message || error}`);
        }
    }
    
    testResults.tests.push({
        name,
        passed,
        error: error ? (error.message || error) : null,
        response: response ? response.data : null
    });
}

// Helper function to make API calls
async function apiCall(method, endpoint, body = null, token = null) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
        method,
        headers
    };
    
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${SUPERADMIN_BASE}${endpoint}`, options);
    const data = await response.json();
    
    return {
        status: response.status,
        data,
        ok: response.ok
    };
}

// Test Organization Management Endpoints
async function testOrganizationEndpoints(token) {
    console.log('\n🔍 Testing Organization Management Endpoints...\n');
    
    // Test 1: List all organizations
    try {
        const response = await apiCall('GET', '/organizations', null, token);
        assert.equal(response.status, 200, 'Status code should be 200');
        assert.equal(response.data.success, true, 'Response should indicate success');
        assert.ok(Array.isArray(response.data.data), 'Response data should be an array');
        recordTestResult('GET /superadmin/organizations', true, null, response);
    } catch (error) {
        recordTestResult('GET /superadmin/organizations', false, error);
    }
    
    // Test 2: Get organization by ID
    try {
        const response = await apiCall('GET', '/organizations/1', null, token);
        assert.equal(response.status, 200, 'Status code should be 200');
        assert.equal(response.data.success, true, 'Response should indicate success');
        assert.ok(response.data.data && typeof response.data.data === 'object', 'Response data should be an object');
        recordTestResult('GET /superadmin/organizations/:orgId', true, null, response);
    } catch (error) {
        recordTestResult('GET /superadmin/organizations/:orgId', false, error);
    }
    
    // Test 3: Update organization status
    try {
        const response = await apiCall('PUT', '/organizations/1/status', { newStatus: 'active' }, token);
        assert.equal(response.status, 200, 'Status code should be 200');
        assert.equal(response.data.success, true, 'Response should indicate success');
        recordTestResult('PUT /superadmin/organizations/:orgId/status', true, null, response);
    } catch (error) {
        recordTestResult('PUT /superadmin/organizations/:orgId/status', false, error);
    }
    
    // Test 4: Adjust organization credits
    try {
        const response = await apiCall('POST', '/organizations/1/credits/adjust', {
            amount: 50,
            reason: 'Test credit adjustment'
        }, token);
        assert.equal(response.status, 200, 'Status code should be 200');
        assert.equal(response.data.success, true, 'Response should indicate success');
        recordTestResult('POST /superadmin/organizations/:orgId/credits/adjust', true, null, response);
    } catch (error) {
        recordTestResult('POST /superadmin/organizations/:orgId/credits/adjust', false, error);
    }
}

// Test User Management Endpoints
async function testUserEndpoints(token) {
    console.log('\n🔍 Testing User Management Endpoints...\n');
    
    // Test 1: List all users
    try {
        const response = await apiCall('GET', '/users', null, token);
        assert.equal(response.status, 200, 'Status code should be 200');
        assert.equal(response.data.success, true, 'Response should indicate success');
        assert.ok(Array.isArray(response.data.data), 'Response data should be an array');
        recordTestResult('GET /superadmin/users', true, null, response);
    } catch (error) {
        recordTestResult('GET /superadmin/users', false, error);
    }
    
    // Test 2: Get user by ID
    try {
        const response = await apiCall('GET', '/users/1', null, token);
        assert.equal(response.status, 200, 'Status code should be 200');
        assert.equal(response.data.success, true, 'Response should indicate success');
        assert.ok(response.data.data && typeof response.data.data === 'object', 'Response data should be an object');
        recordTestResult('GET /superadmin/users/:userId', true, null, response);
    } catch (error) {
        recordTestResult('GET /superadmin/users/:userId', false, error);
    }
    
    // Test 3: Update user status
    try {
        const response = await apiCall('PUT', '/users/1/status', { isActive: true }, token);
        assert.equal(response.status, 200, 'Status code should be 200');
        assert.equal(response.data.success, true, 'Response should indicate success');
        recordTestResult('PUT /superadmin/users/:userId/status', true, null, response);
    } catch (error) {
        recordTestResult('PUT /superadmin/users/:userId/status', false, error);
    }
}

// Test Prompt Template Endpoints
async function testPromptTemplateEndpoints(token) {
    console.log('\n🔍 Testing Prompt Template Endpoints...\n');
    
    let createdTemplateId = null;
    
    // Test 1: Create prompt template
    try {
        const response = await apiCall('POST', '/prompts/templates', {
            name: 'Test Template',
            provider: 'openai',
            model: 'gpt-4',
            prompt_template: 'Test prompt: {{dictation}}',
            is_active: true,
            is_default: false,
            priority: 1
        }, token);
        assert.equal(response.status, 201, 'Status code should be 201');
        assert.equal(response.data.success, true, 'Response should indicate success');
        assert.ok(response.data.data && response.data.data.id, 'Response should include template ID');
        createdTemplateId = response.data.data.id;
        recordTestResult('POST /superadmin/prompts/templates', true, null, response);
    } catch (error) {
        recordTestResult('POST /superadmin/prompts/templates', false, error);
    }
    
    // Test 2: List prompt templates
    try {
        const response = await apiCall('GET', '/prompts/templates', null, token);
        assert.equal(response.status, 200, 'Status code should be 200');
        assert.equal(response.data.success, true, 'Response should indicate success');
        assert.ok(Array.isArray(response.data.data), 'Response data should be an array');
        recordTestResult('GET /superadmin/prompts/templates', true, null, response);
    } catch (error) {
        recordTestResult('GET /superadmin/prompts/templates', false, error);
    }
    
    // Test 3: Get prompt template by ID
    if (createdTemplateId) {
        try {
            const response = await apiCall('GET', `/prompts/templates/${createdTemplateId}`, null, token);
            assert.equal(response.status, 200, 'Status code should be 200');
            assert.equal(response.data.success, true, 'Response should indicate success');
            assert.ok(response.data.data && typeof response.data.data === 'object', 'Response data should be an object');
            recordTestResult('GET /superadmin/prompts/templates/:templateId', true, null, response);
        } catch (error) {
            recordTestResult('GET /superadmin/prompts/templates/:templateId', false, error);
        }
    }
    
    // Test 4: Update prompt template
    if (createdTemplateId) {
        try {
            const response = await apiCall('PUT', `/prompts/templates/${createdTemplateId}`, {
                name: 'Updated Test Template',
                is_active: false
            }, token);
            assert.equal(response.status, 200, 'Status code should be 200');
            assert.equal(response.data.success, true, 'Response should indicate success');
            recordTestResult('PUT /superadmin/prompts/templates/:templateId', true, null, response);
        } catch (error) {
            recordTestResult('PUT /superadmin/prompts/templates/:templateId', false, error);
        }
    }
    
    // Test 5: Delete prompt template
    if (createdTemplateId) {
        try {
            const response = await apiCall('DELETE', `/prompts/templates/${createdTemplateId}`, null, token);
            assert.equal(response.status, 200, 'Status code should be 200');
            assert.equal(response.data.success, true, 'Response should indicate success');
            recordTestResult('DELETE /superadmin/prompts/templates/:templateId', true, null, response);
        } catch (error) {
            recordTestResult('DELETE /superadmin/prompts/templates/:templateId', false, error);
        }
    }
}

// Test Prompt Assignment Endpoints
async function testPromptAssignmentEndpoints(token) {
    console.log('\n🔍 Testing Prompt Assignment Endpoints...\n');
    
    let createdAssignmentId = null;
    
    // Test 1: Create prompt assignment
    try {
        const response = await apiCall('POST', '/prompts/assignments', {
            template_id: 1,
            org_id: 1,
            is_active: true
        }, token);
        assert.equal(response.status, 201, 'Status code should be 201');
        assert.equal(response.data.success, true, 'Response should indicate success');
        assert.ok(response.data.data && response.data.data.id, 'Response should include assignment ID');
        createdAssignmentId = response.data.data.id;
        recordTestResult('POST /superadmin/prompts/assignments', true, null, response);
    } catch (error) {
        recordTestResult('POST /superadmin/prompts/assignments', false, error);
    }
    
    // Test 2: List prompt assignments
    try {
        const response = await apiCall('GET', '/prompts/assignments', null, token);
        assert.equal(response.status, 200, 'Status code should be 200');
        assert.equal(response.data.success, true, 'Response should indicate success');
        assert.ok(Array.isArray(response.data.data), 'Response data should be an array');
        recordTestResult('GET /superadmin/prompts/assignments', true, null, response);
    } catch (error) {
        recordTestResult('GET /superadmin/prompts/assignments', false, error);
    }
    
    // Test 3: Get prompt assignment by ID
    if (createdAssignmentId) {
        try {
            const response = await apiCall('GET', `/prompts/assignments/${createdAssignmentId}`, null, token);
            assert.equal(response.status, 200, 'Status code should be 200');
            assert.equal(response.data.success, true, 'Response should indicate success');
            assert.ok(response.data.data && typeof response.data.data === 'object', 'Response data should be an object');
            recordTestResult('GET /superadmin/prompts/assignments/:assignmentId', true, null, response);
        } catch (error) {
            recordTestResult('GET /superadmin/prompts/assignments/:assignmentId', false, error);
        }
    }
    
    // Test 4: Update prompt assignment
    if (createdAssignmentId) {
        try {
            const response = await apiCall('PUT', `/prompts/assignments/${createdAssignmentId}`, {
                is_active: false
            }, token);
            assert.equal(response.status, 200, 'Status code should be 200');
            assert.equal(response.data.success, true, 'Response should indicate success');
            recordTestResult('PUT /superadmin/prompts/assignments/:assignmentId', true, null, response);
        } catch (error) {
            recordTestResult('PUT /superadmin/prompts/assignments/:assignmentId', false, error);
        }
    }
    
    // Test 5: Delete prompt assignment
    if (createdAssignmentId) {
        try {
            const response = await apiCall('DELETE', `/prompts/assignments/${createdAssignmentId}`, null, token);
            assert.equal(response.status, 200, 'Status code should be 200');
            assert.equal(response.data.success, true, 'Response should indicate success');
            recordTestResult('DELETE /superadmin/prompts/assignments/:assignmentId', true, null, response);
        } catch (error) {
            recordTestResult('DELETE /superadmin/prompts/assignments/:assignmentId', false, error);
        }
    }
}

// Test Log Viewing Endpoints
async function testLogEndpoints(token) {
    console.log('\n🔍 Testing Log Viewing Endpoints...\n');
    
    // Test 1: Basic LLM validation logs
    try {
        const response = await apiCall('GET', '/logs/validation?limit=5', null, token);
        assert.equal(response.status, 200, 'Status code should be 200');
        assert.equal(response.data.success, true, 'Response should indicate success');
        assert.ok(response.data.data, 'Response should have data');
        recordTestResult('GET /superadmin/logs/validation', true, null, response);
    } catch (error) {
        recordTestResult('GET /superadmin/logs/validation', false, error);
    }
    
    // Test 2: Enhanced LLM validation logs
    try {
        const response = await apiCall('GET', '/logs/validation/enhanced?limit=5&date_preset=last_7_days', null, token);
        assert.equal(response.status, 200, 'Status code should be 200');
        assert.equal(response.data.success, true, 'Response should indicate success');
        assert.ok(response.data.data, 'Response should have data');
        recordTestResult('GET /superadmin/logs/validation/enhanced', true, null, response);
    } catch (error) {
        recordTestResult('GET /superadmin/logs/validation/enhanced', false, error);
    }
    
    // Test 3: Credit usage logs
    try {
        const response = await apiCall('GET', '/logs/credits?limit=5', null, token);
        assert.equal(response.status, 200, 'Status code should be 200');
        assert.equal(response.data.success, true, 'Response should indicate success');
        assert.ok(response.data.data, 'Response should have data');
        recordTestResult('GET /superadmin/logs/credits', true, null, response);
    } catch (error) {
        recordTestResult('GET /superadmin/logs/credits', false, error);
    }
    
    // Test 4: Purgatory events
    try {
        const response = await apiCall('GET', '/logs/purgatory?limit=5', null, token);
        assert.equal(response.status, 200, 'Status code should be 200');
        assert.equal(response.data.success, true, 'Response should indicate success');
        assert.ok(response.data.data, 'Response should have data');
        recordTestResult('GET /superadmin/logs/purgatory', true, null, response);
    } catch (error) {
        recordTestResult('GET /superadmin/logs/purgatory', false, error);
    }
}

// Main test function
async function runAllTests() {
    console.log('=== COMPREHENSIVE SUPER ADMIN API TESTS ===');
    console.log(`Testing API at: ${API_BASE_URL}`);
    console.log('==========================================\n');
    
    // Generate super admin token
    const token = helpers.generateToken(superAdminUser);
    console.log(`Generated token for super_admin user: ${token.substring(0, 20)}...`);
    
    // Run all test suites
    await testOrganizationEndpoints(token);
    await testUserEndpoints(token);
    await testPromptTemplateEndpoints(token);
    await testPromptAssignmentEndpoints(token);
    await testLogEndpoints(token);
    
    // Print summary
    console.log('\n=== TEST SUMMARY ===');
    console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);
    console.log('===================');
    
    // Save detailed results
    const fs = require('fs');
    const resultsFile = 'superadmin-test-results.json';
    fs.writeFileSync(resultsFile, JSON.stringify(testResults, null, 2));
    console.log(`\nDetailed test results saved to ${resultsFile}`);
    
    // Exit with appropriate code
    process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run the tests
runAllTests().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
});