const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const JWT_TOKEN = process.env.JWT_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDU3NTUzOCwiZXhwIjoxNzQ0NjYxOTM4fQ.gnTcT9gQoz1RNmvo6A_DWAolelanr0ilBvn6PylJK9k';

// Test data
const TEST_ORDER_ID = 1;
const TEST_PATIENT_ID = 1;

// Helper function to make API requests
async function makeRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const responseData = await response.json();
  
  return {
    status: response.status,
    data: responseData
  };
}

// Store the file path from successful presigned URL request
let testFilePath = '';

describe('File Upload Service', () => {
  // Test Case 1: Get Presigned URL - Success
  test('should get a presigned URL successfully', async () => {
    const payload = {
      fileType: 'image/png',
      fileName: 'test_image.png',
      contentType: 'image/png',
      orderId: TEST_ORDER_ID,
      patientId: TEST_PATIENT_ID,
      documentType: 'supplemental'
    };

    const response = await makeRequest('/uploads/presigned-url', 'POST', payload);
    
    // Log the response for debugging
    console.log('Presigned URL Response:', JSON.stringify(response, null, 2));
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.uploadUrl).toBeTruthy();
    expect(response.data.fileKey).toBeTruthy();
    
    // Store the file path for later tests
    testFilePath = response.data.fileKey;
  });

  // Test Case 2: Get Presigned URL - Invalid File Type
  test('should reject invalid file types', async () => {
    const payload = {
      fileType: 'application/octet-stream',
      fileName: 'test_script.exe',
      contentType: 'application/octet-stream',
      orderId: TEST_ORDER_ID,
      patientId: TEST_PATIENT_ID,
      documentType: 'supplemental'
    };

    const response = await makeRequest('/uploads/presigned-url', 'POST', payload);
    
    // Log the response for debugging
    console.log('Invalid File Type Response:', JSON.stringify(response, null, 2));
    
    // Assertions
    expect(response.status).toBe(400);
    expect(response.data.success).toBe(false);
    expect(response.data.message).toContain('not allowed');
  });

  // Test Case 3: Get Presigned URL - File Too Large
  test('should reject files that are too large', async () => {
    const payload = {
      fileType: 'application/pdf',
      fileName: 'large_file.pdf',
      contentType: 'application/pdf',
      fileSize: 30000000, // 30MB (assuming 20MB limit for PDFs)
      orderId: TEST_ORDER_ID,
      patientId: TEST_PATIENT_ID,
      documentType: 'supplemental'
    };

    const response = await makeRequest('/uploads/presigned-url', 'POST', payload);
    
    // Log the response for debugging
    console.log('File Too Large Response:', JSON.stringify(response, null, 2));
    
    // Assertions
    expect(response.status).toBe(400);
    expect(response.data.success).toBe(false);
    expect(response.data.message).toContain('size');
  });
  // Test Case 4: Confirm Upload - Success
  test.skip('should confirm upload successfully (requires existing order in database)', async () => {
    // This test is skipped because it requires an actual order in the database
    console.log('This test requires an actual order in the database. Skipping...');
    
    // For documentation purposes, here's what the test would do:
    const payload = {
      fileKey: testFilePath || 'uploads/0/orders/1/test_image.png',
      orderId: TEST_ORDER_ID,
      patientId: TEST_PATIENT_ID,
      documentType: 'supplemental',
      fileName: 'test_image.png',
      fileSize: 102400, // 100KB
      contentType: 'image/png'
    };

    const response = await makeRequest('/uploads/confirm', 'POST', payload);
    
    // Log the response for debugging
    console.log('Confirm Upload Response:', JSON.stringify(response, null, 2));
    
    // Assertions (not actually run since test is skipped)
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.documentId).toBeTruthy();
  });

  // Test Case 5: Process Signature
  // Note: This test uses the order finalization endpoint since we don't have a dedicated signature endpoint
  test.skip('should process signature through order finalization (requires existing order in database)', async () => {
    // This test is skipped because it requires an actual order in the database
    console.log('This test requires an actual order in the database. Skipping...');
    
    // Create a simple base64 encoded PNG image (1x1 pixel, transparent)
    const base64Signature = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    
    const payload = {
      finalValidationStatus: 'appropriate',
      finalComplianceScore: 7,
      finalICD10Codes: 'R51.9,G43.909',
      finalICD10CodeDescriptions: 'Headache, unspecified;Migraine, unspecified',
      finalCPTCode: '70551',
      finalCPTCodeDescription: 'MRI brain without contrast',
      clinicalIndication: 'Persistent headache for 3 weeks, worsening with movement. History of migraines.',
      signatureData: base64Signature
    };

    const response = await makeRequest(`/orders/${TEST_ORDER_ID}`, 'PUT', payload);
    
    // Log the response for debugging
    console.log('Order Finalization Response:', JSON.stringify(response, null, 2));
    
    // Assertions (not actually run since test is skipped)
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.orderId).toBe(TEST_ORDER_ID);
  });
});