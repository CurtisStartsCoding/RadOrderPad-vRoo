/**
 * Script to test the accept-invitation endpoint
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

// Configuration
const API_URL = 'https://api.radorderpad.com';

// Function to get the most recent invitation token from the database
async function getRecentInvitationToken() {
  console.log('Getting the most recent invitation token from the database...');
  
  const pool = new Pool({
    connectionString: process.env.MAIN_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    // Query the database for the most recent invitation
    const result = await pool.query(
      'SELECT token, email FROM user_invitations WHERE status = $1 ORDER BY created_at DESC LIMIT 1',
      ['pending']
    );
    
    if (result.rows.length === 0) {
      console.error('No pending invitations found in the database');
      return null;
    }
    
    const invitation = result.rows[0];
    console.log(`Found invitation for email: ${invitation.email}`);
    return invitation;
  } catch (error) {
    console.error('Error querying the database:', error.message);
    return null;
  } finally {
    await pool.end();
  }
}

// Function to test accepting an invitation
async function testAcceptInvitation(token) {
  console.log(`Testing accept-invitation endpoint with token: ${token}`);
  
  const userData = {
    token: token,
    password: 'Password123!',
    first_name: 'Test',
    last_name: 'User'
  };
  
  try {
    const response = await axios.post(`${API_URL}/api/user-invites/accept-invitation`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Invitation accepted successfully');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ Failed to accept invitation');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    return null;
  }
}

// Main function
async function main() {
  console.log('=== TESTING ACCEPT-INVITATION ENDPOINT ===');
  console.log(`API URL: ${API_URL}`);
  console.log('=========================================\n');
  
  // Get the most recent invitation token
  const invitation = await getRecentInvitationToken();
  if (!invitation) {
    console.error('Could not get an invitation token. Exiting...');
    process.exit(1);
  }
  
  // Test accepting the invitation
  await testAcceptInvitation(invitation.token);
  
  console.log('\n=== TEST COMPLETE ===');
}

// Run the main function
main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});