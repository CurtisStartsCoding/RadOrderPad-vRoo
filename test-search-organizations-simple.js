const axios = require('axios');
const fs = require('fs');

// Read the admin_referring token from the tokens directory
const adminReferringToken = fs.readFileSync('./tokens/admin_referring-token.txt', 'utf8').trim();

async function testSearchOrganizations() {
  console.log('=== Testing GET /api/organizations (Search Organizations) ===\n');

  try {
    // Test 1: Basic search without filters
    console.log('Test 1: Basic search without filters');
    const response1 = await axios.get('https://api.radorderpad.com/api/organizations', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminReferringToken}`
      }
    });

    console.log(`Status: ${response1.status}`);
    console.log(`Found ${response1.data.data.length} organizations`);
    console.log('Sample organization:');
    if (response1.data.data.length > 0) {
      console.log(JSON.stringify(response1.data.data[0], null, 2));
    }
    console.log('\n');

    // Test 2: Search with name filter
    console.log('Test 2: Search with name filter');
    const response2 = await axios.get('https://api.radorderpad.com/api/organizations?name=rad', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminReferringToken}`
      }
    });

    console.log(`Status: ${response2.status}`);
    console.log(`Found ${response2.data.data.length} organizations with name containing 'rad'`);
    console.log('\n');

    // Test 3: Search with type filter
    console.log('Test 3: Search with type filter');
    const response3 = await axios.get('https://api.radorderpad.com/api/organizations?type=radiology_group', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminReferringToken}`
      }
    });

    console.log(`Status: ${response3.status}`);
    console.log(`Found ${response3.data.data.length} radiology_group organizations`);
    console.log('\n');

    console.log('All tests passed successfully!');
  } catch (error) {
    console.error('Error testing search organizations endpoint:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testSearchOrganizations();