#!/usr/bin/env node

/**
 * Simple check of recent orders to compare CLI vs UI creation
 */

const API_BASE = 'https://api.radorderpad.com/api';

async function checkOrders() {
  try {
    // Login
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test.physician@example.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    if (!loginData.token) {
      console.log('❌ Login failed');
      return;
    }
    
    // Get orders
    const ordersResponse = await fetch(`${API_BASE}/orders`, {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    
    const ordersData = await ordersResponse.json();
    
    if (ordersData.data && ordersData.data.length > 0) {
      console.log('\n📋 RECENT ORDERS COMPARISON:');
      
      ordersData.data.slice(0, 5).forEach((order, index) => {
        const hasCoding = order.cpt_codes && order.cpt_codes.length > 0;
        const status = hasCoding ? '✅ HAS CODING' : '❌ NO CODING';
        
        console.log(`${index + 1}. Order #${order.id} - ${status}`);
        console.log(`   Created: ${order.created_at}`);
        console.log(`   CPT: ${JSON.stringify(order.cpt_codes)}`);
        console.log(`   ICD-10: ${JSON.stringify(order.icd10_codes)}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkOrders();