/**
 * Test script for the radiology order export functionality
 * 
 * This script tests the export functionality for radiology orders in different formats:
 * - JSON: Verifies that the JSON export contains all required fields
 * - CSV: Verifies that the CSV export contains the correct headers and data
 * - PDF: Verifies that the PDF export returns a buffer (stub implementation)
 * 
 * Usage:
 *   node test-radiology-export.js [--order-id ORDER_ID]
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { program } = require('commander');

// Parse command line arguments
program
  .option('--order-id <id>', 'Order ID to export', '1')
  .option('--token <token>', 'JWT token for authentication')
  .option('--base-url <url>', 'Base URL for the API', 'http://localhost:3000');

program.parse(process.argv);
const options = program.opts();

// Configuration
const config = {
  baseUrl: options.baseUrl,
  orderId: options.orderId,
  token: options.token || process.env.JWT_TOKEN,
  outputDir: './test-results'
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Create axios instance with authentication
const api = axios.create({
  baseURL: config.baseUrl,
  headers: {
    'Authorization': `Bearer ${config.token}`
  }
});

/**
 * Test JSON export
 */
async function testJsonExport() {
  console.log(`\nTesting JSON export for order ${config.orderId}...`);
  
  try {
    const response = await api.get(`/api/radiology/orders/${config.orderId}/export/json`);
    
    // Save the response to a file
    const outputPath = path.join(config.outputDir, `order-${config.orderId}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(response.data, null, 2));
    
    console.log(`JSON export saved to ${outputPath}`);
    
    // Verify the response contains all required fields
    const data = response.data;
    
    // Check order data
    if (!data.order || !data.order.id) {
      throw new Error('JSON export missing order data');
    }
    
    // Check patient data
    if (!data.patient || !data.patient.id) {
      throw new Error('JSON export missing patient data');
    }
    
    // Check for denormalized fields
    const requiredFields = [
      'referring_physician_name',
      'referring_physician_npi',
      'referring_organization_name',
      'radiology_organization_name'
    ];
    
    const missingFields = requiredFields.filter(field => !data.order[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`JSON export missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Check for HIPAA compliance fields
    const hipaaFields = [
      'patient_consent_obtained',
      'insurance_authorization_number'
    ];
    
    const presentHipaaFields = hipaaFields.filter(field => data.order[field] !== undefined);
    
    console.log(`JSON export contains ${presentHipaaFields.length}/${hipaaFields.length} HIPAA compliance fields`);
    
    console.log('JSON export test passed!');
    return true;
  } catch (error) {
    console.error('JSON export test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

/**
 * Test CSV export
 */
async function testCsvExport() {
  console.log(`\nTesting CSV export for order ${config.orderId}...`);
  
  try {
    const response = await api.get(`/api/radiology/orders/${config.orderId}/export/csv`, {
      responseType: 'text'
    });
    
    // Save the response to a file
    const outputPath = path.join(config.outputDir, `order-${config.orderId}.csv`);
    fs.writeFileSync(outputPath, response.data);
    
    console.log(`CSV export saved to ${outputPath}`);
    
    // Verify the response contains all required headers
    const lines = response.data.split('\n');
    const headers = lines[0].split(',');
    
    // Check for required headers
    const requiredHeaders = [
      'order_id',
      'patient_first_name',
      'patient_last_name',
      'referring_physician',
      'referring_physician_npi',
      'referring_organization',
      'radiology_organization',
      'cpt_code',
      'icd10_codes'
    ];
    
    const missingHeaders = requiredHeaders.filter(header => 
      !headers.some(h => h.replace(/"/g, '').trim() === header)
    );
    
    if (missingHeaders.length > 0) {
      throw new Error(`CSV export missing required headers: ${missingHeaders.join(', ')}`);
    }
    
    // Check for HIPAA compliance headers
    const hipaaHeaders = [
      'patient_consent_obtained',
      'patient_consent_date',
      'insurance_authorization_number',
      'insurance_authorization_date'
    ];
    
    const presentHipaaHeaders = hipaaHeaders.filter(header => 
      headers.some(h => h.replace(/"/g, '').trim() === header)
    );
    
    console.log(`CSV export contains ${presentHipaaHeaders.length}/${hipaaHeaders.length} HIPAA compliance headers`);
    
    console.log('CSV export test passed!');
    return true;
  } catch (error) {
    console.error('CSV export test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

/**
 * Test PDF export
 */
async function testPdfExport() {
  console.log(`\nTesting PDF export for order ${config.orderId}...`);
  
  try {
    const response = await api.get(`/api/radiology/orders/${config.orderId}/export/pdf`, {
      responseType: 'arraybuffer'
    });
    
    // Save the response to a file
    const outputPath = path.join(config.outputDir, `order-${config.orderId}.pdf`);
    fs.writeFileSync(outputPath, response.data);
    
    console.log(`PDF export saved to ${outputPath}`);
    
    // Verify the response is a buffer
    if (!Buffer.isBuffer(response.data) && !(response.data instanceof ArrayBuffer)) {
      throw new Error('PDF export did not return a buffer');
    }
    
    console.log('PDF export test passed!');
    return true;
  } catch (error) {
    console.error('PDF export test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('=== Testing Radiology Order Export ===');
  console.log(`Base URL: ${config.baseUrl}`);
  console.log(`Order ID: ${config.orderId}`);
  
  let jsonResult = false;
  let csvResult = false;
  let pdfResult = false;
  
  try {
    jsonResult = await testJsonExport();
    csvResult = await testCsvExport();
    pdfResult = await testPdfExport();
    
    console.log('\n=== Test Results ===');
    console.log(`JSON Export: ${jsonResult ? 'PASSED' : 'FAILED'}`);
    console.log(`CSV Export: ${csvResult ? 'PASSED' : 'FAILED'}`);
    console.log(`PDF Export: ${pdfResult ? 'PASSED' : 'FAILED'}`);
    
    if (jsonResult && csvResult && pdfResult) {
      console.log('\nAll tests passed!');
      process.exit(0);
    } else {
      console.log('\nSome tests failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('\nError running tests:', error.message);
    process.exit(1);
  }
}

// Run the tests
runTests();