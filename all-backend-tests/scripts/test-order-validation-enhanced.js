/**
 * Enhanced test script for the order validation endpoint
 * 
 * This script tests the validation engine with multiple test cases and logs:
 * - Full API payload including Redis/Postgres details
 * - Dictation text
 * - Full response in JSON format
 */
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const axios = require('axios');
const chalk = require('chalk');

// Create logs directory if it doesn't exist
const logsDir = path.resolve(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create results directory if it doesn't exist
const resultsDir = path.resolve(__dirname, '..', 'results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Create a log file with timestamp
const timestamp = new Date().toISOString().replace(/:/g, '-');
const logFile = path.join(logsDir, `validation-test-${timestamp}.log`);
const resultsFile = path.join(resultsDir, `validation-results-${timestamp}.json`);

// Initialize log file
fs.writeFileSync(logFile, `=== VALIDATION TEST LOG - ${timestamp} ===\n\n`, 'utf8');

// Initialize results file with empty array
fs.writeFileSync(resultsFile, '[\n', 'utf8');

// Function to log to both console and file
function log(message, consoleOnly = false) {
  console.log(message);
  if (!consoleOnly) {
    fs.appendFileSync(logFile, message + '\n', 'utf8');
  }
}

// Load environment variables from .env.test file
const envPath = path.resolve(__dirname, '..', '.env.test');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  log(`Loaded environment variables from ${envPath}`);
} else {
  log('Warning: .env.test file not found, using environment variables');
}

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
let PHYSICIAN_TOKEN = process.env.PHYSICIAN_TOKEN;

// Try to read token from file if not in environment variables
if (!PHYSICIAN_TOKEN) {
  const tokenPath = path.resolve(__dirname, '..', 'tokens', 'physician-token.txt');
  log(`PHYSICIAN_TOKEN not found in environment variables, trying to read from ${tokenPath}`);
  
  if (fs.existsSync(tokenPath)) {
    try {
      PHYSICIAN_TOKEN = fs.readFileSync(tokenPath, 'utf8').trim();
      log(`Successfully loaded PHYSICIAN_TOKEN from ${tokenPath}`);
    } catch (error) {
      log(`Error reading token file: ${error.message}`);
    }
  } else {
    log(`Token file not found at ${tokenPath}`);
  }
}

// Validate configuration
if (!PHYSICIAN_TOKEN) {
  log('Error: PHYSICIAN_TOKEN not found in environment variables or token file');
  process.exit(1);
}

// Test cases with different dictation texts
const testCases = [
  // Basic test cases
  {
    name: "Shoulder Pain - MRI",
    dictationText: "55 yo F with right shoulder pain x 3 weeks, worse with overhead activity. Rule out rotator cuff tear. Request MRI right shoulder without contrast.",
    radiologyOrganizationId: 1
  },
  {
    name: "Headache - CT",
    dictationText: "42-year-old male with severe headache for 2 days, no prior history of migraines. Experiencing nausea and photophobia. No focal neurological deficits. Request CT head without contrast to rule out intracranial pathology.",
    radiologyOrganizationId: 1
  },
  {
    name: "Abdominal Pain - Ultrasound",
    dictationText: "38-year-old female with RUQ abdominal pain, elevated liver enzymes. History of gallstones. No fever. Pain worse after meals. Request abdominal ultrasound to evaluate for cholecystitis.",
    radiologyOrganizationId: 1
  },
  {
    name: "Chest Pain - X-ray STAT",
    dictationText: "62-year-old male with chest pain and shortness of breath for 1 day. History of COPD. No fever. Oxygen saturation 92% on room air. Request chest x-ray to evaluate for pneumonia or pneumothorax. STAT.",
    radiologyOrganizationId: 1
  },
  {
    name: "Back Pain - X-ray",
    dictationText: "45-year-old female with lower back pain after lifting heavy object. No radicular symptoms. Request lumbar spine x-ray to evaluate for fracture or degenerative changes.",
    radiologyOrganizationId: 1
  },
  
  // Complex test cases requiring multiple CPT codes and 3-6 ICD-10 codes
  {
    name: "Multi-Trauma - CT Scans",
    dictationText: "72-year-old male involved in high-speed MVA with loss of consciousness. GCS 14 on arrival. Complains of severe chest pain, abdominal pain, and right hip pain. Vital signs: BP 100/60, HR 110, RR 24, O2 sat 94% on 2L. Multiple abrasions and contusions. Decreased breath sounds right side. Tender right upper quadrant and right hip. Request CT head, CT cervical spine, CT chest, CT abdomen/pelvis with IV contrast, and CT right hip to evaluate for traumatic injuries. STAT.",
    radiologyOrganizationId: 1
  },
  {
    name: "Oncology Staging - Multiple Studies",
    dictationText: "65-year-old female with newly diagnosed stage IIIB non-small cell lung cancer (adenocarcinoma) of right upper lobe. History of COPD, hypertension, and type 2 diabetes. Patient reports 30 lb weight loss over 3 months, fatigue, and occasional hemoptysis. Request CT chest with contrast, CT abdomen/pelvis with contrast, brain MRI with and without contrast, and PET/CT for comprehensive staging prior to treatment planning.",
    radiologyOrganizationId: 1
  },
  {
    name: "Rheumatologic Workup - Multiple Joints",
    dictationText: "58-year-old female with 6-month history of symmetric polyarthritis affecting hands, wrists, knees, and feet. Morning stiffness lasting >1 hour. Positive rheumatoid factor and anti-CCP antibodies. ESR 42, CRP 3.8. Clinical diagnosis of rheumatoid arthritis. Request bilateral hand/wrist X-rays, bilateral foot X-rays, and bilateral knee X-rays to establish baseline and assess for erosive changes prior to starting DMARD therapy.",
    radiologyOrganizationId: 1
  },
  {
    name: "Neurological Workup - Multiple Modalities",
    dictationText: "34-year-old female with new onset right-sided weakness, numbness, visual disturbances, and balance problems over the past month. Family history of multiple sclerosis. Neurological exam shows right hemiparesis, decreased sensation right side, dysmetria on finger-to-nose testing, and positive Romberg test. Request brain MRI with and without contrast, cervical spine MRI with and without contrast, and thoracic spine MRI with and without contrast to evaluate for demyelinating disease.",
    radiologyOrganizationId: 1
  },
  {
    name: "Vascular Disease - Multiple Studies",
    dictationText: "78-year-old male with history of coronary artery disease s/p CABG, hypertension, hyperlipidemia, type 2 diabetes, and 60-pack-year smoking history. Presents with bilateral lower extremity claudication, right worse than left, and non-healing ulcer on right great toe. Diminished pulses bilaterally. ABI right 0.6, left 0.7. Request bilateral lower extremity arterial doppler ultrasound, CT angiography of abdominal aorta and bilateral lower extremities with runoff, and chest X-ray for preoperative evaluation.",
    radiologyOrganizationId: 1
  }
];

// Test the order validation endpoint with a specific test case
async function testOrderValidation(testCase) {
  const separator = '='.repeat(80);
  log(`\n${separator}`);
  log(`TEST CASE: ${testCase.name}`);
  log(separator);
  
  log('\nDICTATION TEXT:');
  log(`"${testCase.dictationText.trim()}"`);
  log('');
  
  // Prepare request data - stateless validation only requires dictation text
  const requestData = {
    dictationText: testCase.dictationText,
    debug: true  // Request debug information if the API supports it
    // No patientInfo or radiologyOrganizationId in stateless validation
  };
  
  log('REQUEST PAYLOAD:');
  log(JSON.stringify(requestData, null, 2));
  log('');
  
  try {
    // Make the request with debug headers
    log('Sending request to validation endpoint...');
    const startTime = Date.now();
    
    const response = await axios.post(
      `${API_URL}/api/orders/validate`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PHYSICIAN_TOKEN}`,
          'X-Debug-Mode': 'true',  // Request additional debug info if the API supports it
          'X-Include-Redis-Details': 'true',
          'X-Include-Postgres-Details': 'true'
        }
      }
    );
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Log response details
    log(`\nRESPONSE (${duration}ms):`);
    log(`Status: ${response.status}`);
    
    // Log the full response data
    log('\nFULL RESPONSE:');
    log(JSON.stringify(response.data, null, 2));
    
    // Verify no orderId is returned
    if (response.data.orderId === undefined) {
      log('\n✅ No orderId returned as expected for stateless validation');
    } else {
      log('\n⚠️ Warning: orderId was returned, but should not be for stateless validation');
    }
    
    // Extract and log Redis/Postgres details if available
    if (response.data.debug) {
      log('\nDEBUG INFORMATION:');
      log(JSON.stringify(response.data.debug, null, 2));
    } else {
      log('\nNOTE: No debug information available in the response.');
      log('The API may not support returning Redis/Postgres details.');
      log('You may need to modify the API server to include this information in the response.');
    }
    
    // Save validation result to results file
    if (response.data.validationResult) {
      const resultEntry = {
        testCase: testCase.name,
        dictationText: testCase.dictationText,
        validationResult: response.data.validationResult,
        timestamp: new Date().toISOString(),
        stateless: true // Mark as stateless validation
      };
      
      // Append to results file with comma for JSON array format (except for last entry)
      fs.appendFileSync(resultsFile, JSON.stringify(resultEntry, null, 2) + ',\n', 'utf8');
    }
    
    // Extract validation results for easier reading
    if (response.data.validationResults) {
      log('\nVALIDATION RESULTS:');
      const results = response.data.validationResults;
      
      log(`Status: ${results.validationStatus}`);
      log(`Compliance Score: ${results.complianceScore}`);
      log(`Priority: ${results.priority || 'routine'}`);
      
      if (results.suggestedICD10Codes && results.suggestedICD10Codes.length > 0) {
        log('\nICD-10 Codes:');
        results.suggestedICD10Codes.forEach(code => {
          log(`- ${code.code}: ${code.description}${code.isPrimary ? ' (PRIMARY)' : ''}`);
        });
      }
      
      if (results.suggestedCPTCodes && results.suggestedCPTCodes.length > 0) {
        log('\nCPT Codes:');
        results.suggestedCPTCodes.forEach(code => {
          log(`- ${code.code}: ${code.description}`);
        });
      }
      
      if (results.feedback) {
        log(`\nFeedback: ${results.feedback}`);
      }
    }
    
    log(`\n${separator}`);
    return { success: true, status: response.status };
  } catch (error) {
    log('\nERROR:');
    if (error.response) {
      log(`Status: ${error.response.status}`);
      log('Response data:');
      log(JSON.stringify(error.response.data, null, 2));
    } else {
      log(`Error message: ${error.message}`);
    }
    
    log(`\n${separator}`);
    return { success: false, error: error.message };
  }
}

// Run all test cases
async function runAllTests() {
  log('=== ENHANCED ORDER VALIDATION TESTS ===');
  log(`API URL: ${API_URL}`);
  log(`Log File: ${logFile}`);
  log('');
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    const result = await testOrderValidation(testCase);
    if (result.success) {
      passed++;
    } else {
      failed++;
    }
  }
  
  // Remove trailing comma from the last entry and close the JSON array
  const fileContent = fs.readFileSync(resultsFile, 'utf8');
  const fixedContent = fileContent.replace(/,\n$/, '\n') + ']\n';
  fs.writeFileSync(resultsFile, fixedContent, 'utf8');
  
  log('\n=== TEST SUMMARY ===');
  log(`Total Tests: ${testCases.length}`);
  log(`Passed: ${passed}`);
  log(`Failed: ${failed}`);
  log('');
  log(`Detailed logs saved to: ${logFile}`);
  log(`Validation results saved to: ${resultsFile}`);
  
  return failed === 0;
}

// Run the tests
(async () => {
  try {
    const success = await runAllTests();
    process.exit(success ? 0 : 1);
  } catch (error) {
    log(`Unexpected error: ${error.message}`);
    process.exit(1);
  }
})();