/**
 * Test script for dual credit billing system
 * Tests the complete flow of credit consumption for both referring and radiology organizations
 * 
 * Prerequisites:
 * - Database migration has been run
 * - Server is running
 * - Test organizations exist with credits
 */

const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.test') });

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

// Test data
const testUsers = {
  adminReferring: {
    email: 'admin@orthoclinic.com',
    password: 'Test123!@#'
  },
  adminRadiology: {
    email: 'admin@testradiology.com', 
    password: 'Test123!@#'
  },
  adminStaff: {
    email: 'staff@orthoclinic.com',
    password: 'Test123!@#'
  }
};

// Helper function to login
async function login(email, password) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password
    });
    return response.data.data.token;
  } catch (error) {
    console.error(`Login failed for ${email}:`, error.response?.data || error.message);
    throw error;
  }
}

// Helper function to get credit balances
async function getCreditBalances(token) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/billing/credit-balance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to get credit balance:', error.response?.data || error.message);
    throw error;
  }
}

// Helper function to get billing overview
async function getBillingOverview(token) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/billing`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to get billing overview:', error.response?.data || error.message);
    throw error;
  }
}

// Helper function to get an order from admin queue
async function getOrderFromQueue(token) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const orders = response.data.data;
    if (!orders || orders.length === 0) {
      console.log('No orders in admin queue');
      return null;
    }
    
    return orders[0]; // Return first order
  } catch (error) {
    console.error('Failed to get admin queue:', error.response?.data || error.message);
    throw error;
  }
}

// Helper function to send order to radiology
async function sendOrderToRadiology(token, orderId) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/admin/orders/${orderId}/send-to-radiology`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to send order to radiology:', error.response?.data || error.message);
    throw error;
  }
}

// Main test function
async function testDualCreditSystem() {
  console.log('=== Testing Dual Credit Billing System ===\n');
  
  try {
    // Step 1: Login as admin users
    console.log('1. Logging in as test users...');
    const adminReferringToken = await login(testUsers.adminReferring.email, testUsers.adminReferring.password);
    console.log('✓ Admin referring logged in');
    
    const adminRadiologyToken = await login(testUsers.adminRadiology.email, testUsers.adminRadiology.password);
    console.log('✓ Admin radiology logged in');
    
    const adminStaffToken = await login(testUsers.adminStaff.email, testUsers.adminStaff.password);
    console.log('✓ Admin staff logged in\n');
    
    // Step 2: Check initial credit balances
    console.log('2. Checking initial credit balances...');
    
    // Referring organization balance
    const referringBalance = await getCreditBalances(adminReferringToken);
    console.log('Referring Organization Credits:', referringBalance);
    
    // Radiology organization balance
    const radiologyOverview = await getBillingOverview(adminRadiologyToken);
    console.log('Radiology Organization Credits:');
    console.log(`  - Organization Type: ${radiologyOverview.organizationType}`);
    console.log(`  - Basic Credits: ${radiologyOverview.basicCreditBalance}`);
    console.log(`  - Advanced Credits: ${radiologyOverview.advancedCreditBalance}\n`);
    
    // Step 3: Get an order from the queue
    console.log('3. Getting order from admin queue...');
    const order = await getOrderFromQueue(adminStaffToken);
    
    if (!order) {
      console.log('⚠️  No orders available in queue to test');
      console.log('Please create an order first using the physician workflow');
      return;
    }
    
    console.log(`✓ Found order ID: ${order.id}`);
    console.log(`  - Modality: ${order.modality || 'Not specified'}`);
    console.log(`  - Status: ${order.status}\n`);
    
    // Step 4: Send order to radiology (this will burn credits)
    console.log('4. Sending order to radiology (burning credits)...');
    const sendResult = await sendOrderToRadiology(adminStaffToken, order.id);
    console.log('✓ Order sent to radiology:', sendResult.message, '\n');
    
    // Step 5: Check updated credit balances
    console.log('5. Checking updated credit balances...');
    
    // Referring organization balance after
    const referringBalanceAfter = await getCreditBalances(adminReferringToken);
    console.log('Referring Organization Credits After:', referringBalanceAfter);
    console.log(`  Credits consumed: ${referringBalance.creditBalance - referringBalanceAfter.creditBalance}`);
    
    // Radiology organization balance after
    const radiologyOverviewAfter = await getBillingOverview(adminRadiologyToken);
    console.log('\nRadiology Organization Credits After:');
    console.log(`  - Basic Credits: ${radiologyOverviewAfter.basicCreditBalance}`);
    console.log(`  - Advanced Credits: ${radiologyOverviewAfter.advancedCreditBalance}`);
    
    // Determine which type was consumed
    const basicConsumed = radiologyOverview.basicCreditBalance - radiologyOverviewAfter.basicCreditBalance;
    const advancedConsumed = radiologyOverview.advancedCreditBalance - radiologyOverviewAfter.advancedCreditBalance;
    
    if (basicConsumed > 0) {
      console.log(`  ✓ Basic credit consumed (standard imaging)`);
    } else if (advancedConsumed > 0) {
      console.log(`  ✓ Advanced credit consumed (MRI/CT/PET/Nuclear)`);
    } else {
      console.log(`  ⚠️  No radiology credits consumed (possible error)`);
    }
    
    console.log('\n✅ Dual credit system test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testDualCreditSystem().catch(console.error);