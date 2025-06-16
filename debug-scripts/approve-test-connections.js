/**
 * Script to approve pending connections for test organizations
 * Run this after create-test-users-for-permissions.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'https://api.radorderpad.com';

// Radiology admin users who can approve connections
const RADIOLOGY_ADMINS = [
  {
    email: 'admin.radx@test.com',
    password: 'TestPass123!',
    orgName: 'Test Radiology Center X'
  },
  {
    email: 'admin.rady@test.com',
    password: 'TestPass123!',
    orgName: 'Test Radiology Center Y'
  }
];

// Login function
async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password
    });
    return response.data.token;
  } catch (error) {
    console.error(`Failed to login with ${email}:`, error.response?.data || error.message);
    throw error;
  }
}

// Get pending connection requests
async function getPendingRequests(token) {
  try {
    const response = await axios.get(`${API_URL}/api/connections/requests`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.requests || [];
  } catch (error) {
    console.error('Failed to get pending requests:', error.response?.data || error.message);
    return [];
  }
}

// Approve a connection
async function approveConnection(token, relationshipId) {
  try {
    const response = await axios.post(
      `${API_URL}/api/connections/${relationshipId}/approve`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to approve connection ${relationshipId}:`, error.response?.data || error.message);
    throw error;
  }
}

// Main function
async function approveAllConnections() {
  console.log('=== APPROVING TEST CONNECTIONS ===\n');

  let totalApproved = 0;
  let totalPending = 0;

  for (const admin of RADIOLOGY_ADMINS) {
    console.log(`\n🔐 Logging in as ${admin.email} (${admin.orgName})...`);
    
    try {
      const token = await login(admin.email, admin.password);
      console.log('✅ Logged in successfully');

      // Get pending requests
      const pendingRequests = await getPendingRequests(token);
      console.log(`📋 Found ${pendingRequests.length} pending connection requests`);
      totalPending += pendingRequests.length;

      // Approve each request
      for (const request of pendingRequests) {
        console.log(`\n🔗 Connection request from: ${request.initiating_org_name}`);
        console.log(`   Notes: ${request.notes || 'None'}`);
        
        try {
          await approveConnection(token, request.id);
          console.log(`   ✅ APPROVED`);
          totalApproved++;
        } catch (error) {
          console.log(`   ❌ Failed to approve`);
        }
      }

    } catch (error) {
      console.error(`❌ Failed to process ${admin.email}`);
    }
  }

  console.log('\n=== SUMMARY ===');
  console.log(`Total Pending Requests: ${totalPending}`);
  console.log(`Total Approved: ${totalApproved}`);
  
  if (totalApproved > 0) {
    console.log('\n✅ Connections approved! You can now run test-location-permissions.js');
  } else if (totalPending === 0) {
    console.log('\n✅ No pending connections found. They may already be approved.');
    console.log('You can run test-location-permissions.js to verify.');
  }
}

// Run the script
approveAllConnections();