/**
 * Scenario F: User Invite
 * 
 * This test scenario covers:
 * 1. Register Organization and Admin
 * 2. Login as Admin
 * 3. Call /users/invite to invite a new user
 * 4. Check for invite token (simulated)
 * 5. Call /users/accept-invitation to accept the invitation
 * 6. Verify new user in system
 */

const helpers = require('./test-helpers');
const fs = require('fs');
const path = require('path');

// Scenario name for logging
const SCENARIO = 'Scenario-F';

// Test data
const testData = {
  organization: {
    orgName: 'Test Practice F',
    orgType: 'referring',
    admin: {
      firstName: 'Michael',
      lastName: 'Anderson',
      email: 'admin-f@example.com',
      password: 'Password123!'
    }
  },
  invitedUser: {
    firstName: 'Jennifer',
    lastName: 'Martinez',
    email: 'jennifer-f@example.com',
    role: 'physician',
    npi: '5678901234',
    password: 'NewPassword456!'
  }
};

// Main test function
async function runTest() {
  helpers.log(`Starting ${SCENARIO}`, SCENARIO);
  
  try {
    // Step 1: Register Organization and Admin
    helpers.log('Step 1: Register Organization and Admin', SCENARIO);
    const registerResponse = await helpers.registerOrganization(
      testData.organization.orgName,
      testData.organization.orgType,
      testData.organization.admin.firstName,
      testData.organization.admin.lastName,
      testData.organization.admin.email,
      testData.organization.admin.password
    );
    
    // Store organization and admin data
    const orgId = helpers.storeTestData('orgId', registerResponse.organization.id, SCENARIO);
    const adminId = helpers.storeTestData('adminId', registerResponse.user.id, SCENARIO);
    helpers.log(`Organization created with ID: ${orgId}`, SCENARIO);
    helpers.log(`Admin user created with ID: ${adminId}`, SCENARIO);
    
    // Step 2: Login as Admin
    helpers.log('Step 2: Login as Admin', SCENARIO);
    const adminToken = await helpers.login(
      testData.organization.admin.email,
      testData.organization.admin.password
    );
    helpers.storeTestData('adminToken', adminToken, SCENARIO);
    
    // Step 3: Call /users/invite to invite a new user
    helpers.log('Step 3: Invite New User', SCENARIO);
    const inviteResponse = await helpers.apiRequest(
      'post',
      '/users/invite',
      {
        firstName: testData.invitedUser.firstName,
        lastName: testData.invitedUser.lastName,
        email: testData.invitedUser.email,
        role: testData.invitedUser.role,
        npi: testData.invitedUser.npi
      },
      adminToken
    );
    
    // Verify invite was successful
    if (!inviteResponse.success) {
      throw new Error('User invitation failed');
    }
    
    helpers.log('User invitation sent successfully', SCENARIO);
    
    // Step 4: Check for invite token (simulated)
    helpers.log('Step 4: Check for Invite Token', SCENARIO);
    
    // In a real test, we would check an email inbox or database
    // For this test, we'll simulate by querying the pending invitations
    const pendingInvitationsResponse = await helpers.apiRequest(
      'get',
      '/users/pending-invitations',
      null,
      adminToken
    );
    
    // Find the invitation for our user
    const invitation = pendingInvitationsResponse.invitations.find(
      inv => inv.email === testData.invitedUser.email
    );
    
    if (!invitation) {
      throw new Error(`Invitation for ${testData.invitedUser.email} not found`);
    }
    
    const inviteToken = invitation.token;
    helpers.storeTestData('inviteToken', inviteToken, SCENARIO);
    helpers.log(`Found invitation token: ${inviteToken}`, SCENARIO);
    
    // Step 5: Call /users/accept-invitation to accept the invitation
    helpers.log('Step 5: Accept Invitation', SCENARIO);
    const acceptResponse = await helpers.apiRequest(
      'post',
      '/users/accept-invitation',
      {
        token: inviteToken,
        password: testData.invitedUser.password
      }
    );
    
    // Verify acceptance was successful
    if (!acceptResponse.success) {
      throw new Error('Invitation acceptance failed');
    }
    
    const userId = acceptResponse.userId;
    helpers.storeTestData('userId', userId, SCENARIO);
    helpers.log(`User created with ID: ${userId}`, SCENARIO);
    
    // Step 6: Verify new user can login
    helpers.log('Step 6: Verify New User Login', SCENARIO);
    const userToken = await helpers.login(
      testData.invitedUser.email,
      testData.invitedUser.password
    );
    
    if (!userToken) {
      throw new Error('New user login failed');
    }
    
    helpers.storeTestData('userToken', userToken, SCENARIO);
    helpers.log('New user login successful', SCENARIO);
    
    // Step 7: Verify user details
    helpers.log('Step 7: Verify User Details', SCENARIO);
    
    // Get user profile
    const userProfileResponse = await helpers.apiRequest(
      'get',
      '/users/profile',
      null,
      userToken
    );
    
    // Verify user details
    if (userProfileResponse.id !== userId) {
      throw new Error('User ID mismatch');
    }
    
    if (userProfileResponse.firstName !== testData.invitedUser.firstName) {
      throw new Error('First name mismatch');
    }
    
    if (userProfileResponse.lastName !== testData.invitedUser.lastName) {
      throw new Error('Last name mismatch');
    }
    
    if (userProfileResponse.email !== testData.invitedUser.email) {
      throw new Error('Email mismatch');
    }
    
    if (userProfileResponse.role !== testData.invitedUser.role) {
      throw new Error('Role mismatch');
    }
    
    if (userProfileResponse.npi !== testData.invitedUser.npi) {
      throw new Error('NPI mismatch');
    }
    
    if (userProfileResponse.organizationId !== orgId) {
      throw new Error('Organization ID mismatch');
    }
    
    helpers.log('User details verified successfully', SCENARIO);
    
    // Step 8: Verify user appears in organization users list
    helpers.log('Step 8: Verify User in Organization Users List', SCENARIO);
    
    // Get organization users
    const orgUsersResponse = await helpers.apiRequest(
      'get',
      '/users',
      null,
      adminToken
    );
    
    // Find the user in the list
    const userInList = orgUsersResponse.users.some(u => u.id === userId);
    if (!userInList) {
      throw new Error(`User ${userId} not found in organization users list`);
    }
    
    helpers.log('User found in organization users list', SCENARIO);
    helpers.log(`${SCENARIO} completed successfully`, SCENARIO);
    
  } catch (error) {
    helpers.log(`Error in ${SCENARIO}: ${error.message}`, SCENARIO);
    throw error;
  }
}

// Run the test
runTest().catch(error => {
  helpers.log(`Test failed: ${error.message}`, SCENARIO);
  process.exit(1);
});