const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'https://radorderpad-8zi108wpf-capecomas-projects.vercel.app/api';
const ORDER_ID = 606;

// Admin staff credentials
const ADMIN_STAFF_CREDENTIALS = {
  email: 'test.admin_staff@example.com',
  password: 'password123'
};

// Test data
const SUMMARY_TEXT = `PATIENT: Johnson, Robert
MRN: MRN12345A
PIDN: P12345
DOB: 05/15/1950
REFERRING PHYSICIAN: Smith, Jane
CLINICAL INDICATION: Lower back pain radiating to left leg, history of degenerative disc disease
EXAM REQUESTED: MRI Lumbar Spine without contrast
INSURANCE: Medicare
POLICY #: 123456789A
GROUP #: MCARE2023`;

// Login function
async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Login failed: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    throw error;
  }
}

// Test the paste-summary endpoint with different parameter names
async function testPasteSummaryEndpoint() {
  try {
    console.log('=== TESTING ADMIN PASTE-SUMMARY ENDPOINT ===');
    console.log(`API URL: ${API_BASE_URL}`);
    console.log('==========================================\n');

    // Step 1: Login as Admin Staff
    console.log('Step 1: Logging in as Admin Staff...');
    const token = await login(ADMIN_STAFF_CREDENTIALS.email, ADMIN_STAFF_CREDENTIALS.password);
    console.log('✅ Admin Staff login successful!\n');

    // Step 2: Test with 'summaryText' parameter
    console.log('Step 2: Testing with "summaryText" parameter...');
    try {
      const response1 = await fetch(`${API_BASE_URL}/admin/orders/${ORDER_ID}/paste-summary`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          summaryText: SUMMARY_TEXT
        })
      });

      const data1 = await response1.json();
      console.log(`Status: ${response1.status}`);
      console.log(`Response: ${JSON.stringify(data1)}\n`);
    } catch (error) {
      console.log(`Error: ${error.message}\n`);
    }

    // Step 3: Test with 'text' parameter
    console.log('Step 3: Testing with "text" parameter...');
    try {
      const response2 = await fetch(`${API_BASE_URL}/admin/orders/${ORDER_ID}/paste-summary`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: SUMMARY_TEXT
        })
      });

      const data2 = await response2.json();
      console.log(`Status: ${response2.status}`);
      console.log(`Response: ${JSON.stringify(data2)}\n`);
    } catch (error) {
      console.log(`Error: ${error.message}\n`);
    }

    // Step 4: Test with 'pastedText' parameter
    console.log('Step 4: Testing with "pastedText" parameter...');
    try {
      const response3 = await fetch(`${API_BASE_URL}/admin/orders/${ORDER_ID}/paste-summary`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pastedText: SUMMARY_TEXT
        })
      });

      const data3 = await response3.json();
      console.log(`Status: ${response3.status}`);
      console.log(`Response: ${JSON.stringify(data3)}\n`);
    } catch (error) {
      console.log(`Error: ${error.message}\n`);
    }

    // Step 5: Test with 'content' parameter
    console.log('Step 5: Testing with "content" parameter...');
    try {
      const response4 = await fetch(`${API_BASE_URL}/admin/orders/${ORDER_ID}/paste-summary`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: SUMMARY_TEXT
        })
      });

      const data4 = await response4.json();
      console.log(`Status: ${response4.status}`);
      console.log(`Response: ${JSON.stringify(data4)}\n`);
    } catch (error) {
      console.log(`Error: ${error.message}\n`);
    }

    console.log('=== TEST COMPLETE ===');
  } catch (error) {
    console.error(`Test failed: ${error.message}`);
  }
}

// Run the test
testPasteSummaryEndpoint();