/**
 * Script to test specialty-specific word count with complex cases
 */
require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Import the centralized configuration
const config = require('../test-config');

// API URL construction
const API_URL = config.api.baseUrl;

// Generate tokens for different specialties
const SPECIALTIES = [
  'Oncology',
  'Neurology',
  'Cardiology',
  'Orthopedics',
  'Pediatrics',
  'Family Medicine'
];

// Create tokens for each specialty
const specialtyTokens = {};
SPECIALTIES.forEach((specialty, index) => {
  specialtyTokens[specialty] = jwt.sign(
    { userId: 1, orgId: 1, role: 'physician', email: 'test.physician@example.com', specialty },
    config.api.jwtSecret,
    { expiresIn: '24h' }
  );
});

// Complex test cases with natural-sounding dictation
const TEST_CASES = [
  {
    name: "Case 1: Suspected Metastatic Disease with Neurological Symptoms",
    dictation: `
      I have a 65-year-old male patient with a history of stage III lung adenocarcinoma. He was diagnosed about 2 years ago and treated with chemoradiation. 
      He's now coming in with a new headache that started about 2 weeks ago and has been getting worse. He tells me he's been confused at times and has some weakness on his right side. 
      Yesterday, his wife said he had what looked like a seizure. His recent labs show his LDH and alkaline phosphatase are up. He's also lost about 15 pounds in the last month without trying.
      We did a brain scan about 6 months ago and it didn't show any metastasis at that time. I'd like to get an MRI of his brain with and without contrast to check for brain metastases now.
    `
  },
  {
    name: "Case 2: Complex Abdominal Pain with Multiple Comorbidities",
    dictation: `
      I'm seeing a 58-year-old female with Crohn's disease for about 15 years. She had her gallbladder removed 5 years ago and also has type 2 diabetes.
      She came in with severe pain in her right upper abdomen and epigastric area that radiates to her back. It started 3 days ago. She rates it as 8 out of 10 and says it gets worse after eating.
      She's been nauseated and vomiting. On exam, she has a fever of 101.2, her heart rate is up around 110, and she's tender in the right upper quadrant with a positive Murphy's sign.
      Her labs show her white count is 15,000, lipase is 450, and direct bilirubin is 2.5. We did an ultrasound that shows her common bile duct is dilated to about 12mm with what looks like a stone at the end.
      I'd like to get an MRCP to evaluate for a common bile duct stone and pancreatitis.
    `
  },
  {
    name: "Case 3: Pediatric Patient with Complex Musculoskeletal and Respiratory Symptoms",
    dictation: `
      I'm seeing an 8-year-old boy with cystic fibrosis, asthma, and a history of recurrent pneumonia. He's been having fever, productive cough, and right hip pain for about 5 days now.
      He's been in the hospital 3 times in the past year for CF flare-ups. Today he has a fever of 102.5, he's working harder to breathe, and I'm not hearing good breath sounds in his right lower lobe.
      He's also in pain when he tries to put weight on his right leg. His labs show his white count is up to 18,000, his ESR is 60, and CRP is 8.5.
      He takes azithromycin, albuterol, and pancreatic enzymes regularly. I'd like to get a chest CT without contrast to check for pneumonia and bronchiectasis,
      and also an MRI of his right hip with contrast to look for possible septic arthritis or osteomyelitis.
    `
  }
];

async function testValidation(specialty, testCase) {
  try {
    console.log(`\nTesting ${testCase.name} with ${specialty} specialty...`);
    
    // Prepare the request payload
    const payload = {
      dictationText: testCase.dictation,
      patientInfo: {
        id: 1,
        firstName: 'Test',
        lastName: 'Patient',
        dateOfBirth: '1980-01-01',
        gender: 'male'
      },
      referringPhysicianId: 1,
      referringOrganizationId: 1
    };
    
    // Make the API request
    const response = await axios.post(`${API_URL}/orders/validate`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${specialtyTokens[specialty]}`
      }
    });
    
    // Check the response
    console.log(`Validation status: ${response.data.validationResult.validationStatus}`);
    console.log(`Feedback length: ${response.data.validationResult.feedback.split(' ').length} words`);
    console.log(`Feedback: ${response.data.validationResult.feedback}`);
    
    // Log ICD-10 codes
    console.log('ICD-10 Codes:');
    response.data.validationResult.suggestedICD10Codes.forEach((code, index) => {
      console.log(`  ${index + 1}. ${code.code} - ${code.description}${code.isPrimary ? ' (PRIMARY)' : ''}`);
    });
    
    // Log CPT codes
    console.log('CPT Codes:');
    response.data.validationResult.suggestedCPTCodes.forEach((code, index) => {
      console.log(`  ${index + 1}. ${code.code} - ${code.description}`);
    });
    
    return response.data;
  } catch (error) {
    console.error('Error during validation:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error message:', error.message);
    }
  }
}

async function runTests() {
  console.log('Testing specialty-specific word count with complex cases...');
  
  // For each specialty, test all cases
  for (const specialty of SPECIALTIES) {
    console.log(`\n=== Testing with ${specialty} specialty ===`);
    
    for (const testCase of TEST_CASES) {
      await testValidation(specialty, testCase);
    }
  }
  
  console.log('\nTests completed.');
}

// Run the tests
runTests().catch(err => {
  console.error('Unhandled error:', err);
});