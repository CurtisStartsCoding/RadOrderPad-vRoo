const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: './.env.test' });

// Get the admin_referring token from the file
const token = fs.readFileSync('../../tokens/admin_referring-token.txt', 'utf8').trim();

// Base URL for the API
const baseUrl = process.env.API_URL || 'https://api.radorderpad.com';

// Test data for organization update
const updateData = {
  name: "Updated Organization Name",
  address_line1: "123 New Street",
  address_line2: "Suite 456",
  city: "New City",
  state: "NS",
  zip_code: "12345",
  phone_number: "555-123-4567",
  fax_number: "555-123-4568",
  contact_email: "contact@updatedorg.com",
  website: "https://www.updatedorg.com",
  npi: "1234567890",
  tax_id: "12-3456789"
};

// Test data with invalid fields (should be rejected)
const invalidData = {
  name: "",  // Empty name (should fail validation)
  contact_email: "invalid-email",  // Invalid email format
  website: "not-a-url"  // Invalid URL format
};

// Test data with restricted fields (should be ignored)
const restrictedFieldsData = {
  name: "Updated Organization Name",
  id: 999,  // Should be ignored
  type: "invalid_type",  // Should be ignored
  status: "invalid_status",  // Should be ignored
  credit_balance: 9999,  // Should be ignored
  billing_id: "invalid_billing_id",  // Should be ignored
  subscription_tier: "invalid_tier",  // Should be ignored
  assigned_account_manager_id: 999  // Should be ignored
};

// Function to test the update organization endpoint
async function testUpdateOrganization() {
  console.log('Testing PUT /api/organizations/mine endpoint...');
  
  try {
    // Test 1: Valid update
    console.log('\nTest 1: Valid update');
    const response = await axios.put(
      `${baseUrl}/api/organizations/mine`,
      updateData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Test 1 passed: Organization updated successfully');
    } else {
      console.log('❌ Test 1 failed: Unexpected response');
    }
    
    // Test 2: Invalid data
    console.log('\nTest 2: Invalid data');
    try {
      await axios.put(
        `${baseUrl}/api/organizations/mine`,
        invalidData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('❌ Test 2 failed: Expected validation error but got success');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('Status:', error.response.status);
        console.log('Response:', JSON.stringify(error.response.data, null, 2));
        console.log('✅ Test 2 passed: Validation error received as expected');
      } else {
        console.log('❌ Test 2 failed: Unexpected error');
        console.log('Error:', error.message);
      }
    }
    
    // Test 3: Restricted fields
    console.log('\nTest 3: Restricted fields');
    const restrictedResponse = await axios.put(
      `${baseUrl}/api/organizations/mine`,
      restrictedFieldsData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('Status:', restrictedResponse.status);
    console.log('Response:', JSON.stringify(restrictedResponse.data, null, 2));
    
    // Check if restricted fields were ignored
    const result = restrictedResponse.data.data;
    const restrictedFieldsIgnored = 
      result.id !== 999 && 
      result.type !== 'invalid_type' && 
      result.status !== 'invalid_status' && 
      result.credit_balance !== 9999 && 
      result.billing_id !== 'invalid_billing_id' && 
      result.subscription_tier !== 'invalid_tier';
    
    if (restrictedResponse.status === 200 && restrictedFieldsIgnored) {
      console.log('✅ Test 3 passed: Restricted fields were ignored');
    } else {
      console.log('❌ Test 3 failed: Restricted fields were not properly handled');
    }
    
    // Test 4: Unauthorized access (no token)
    console.log('\nTest 4: Unauthorized access (no token)');
    try {
      await axios.put(
        `${baseUrl}/api/organizations/mine`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('❌ Test 4 failed: Expected authentication error but got success');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('Status:', error.response.status);
        console.log('Response:', JSON.stringify(error.response.data, null, 2));
        console.log('✅ Test 4 passed: Authentication error received as expected');
      } else {
        console.log('❌ Test 4 failed: Unexpected error');
        console.log('Error:', error.message);
      }
    }
    
    console.log('\nAll tests completed!');
    
  } catch (error) {
    console.error('Error during testing:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the tests
testUpdateOrganization();
