/**
 * Script to fix duplicate order numbers in the PHI database
 * and modify the order number generation to include a random component
 */
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Get database connection details from environment variables
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5433';
const DB_NAME = 'radorder_phi'; // Use the PHI database
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres123';

// Create a connection pool
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
});

async function run() {
  let client;
  
  try {
    console.log('Connecting to PHI database...');
    client = await pool.connect();
    console.log('Connected to PHI database');
    
    // Step 1: Check for duplicate order numbers
    console.log('\nStep 1: Checking for duplicate order numbers...');
    const duplicatesResult = await client.query(`
      SELECT order_number, COUNT(*) as count
      FROM orders
      GROUP BY order_number
      HAVING COUNT(*) > 1
      ORDER BY count DESC;
    `);
    
    if (duplicatesResult.rows.length === 0) {
      console.log('No duplicate order numbers found.');
    } else {
      console.log(`Found ${duplicatesResult.rows.length} duplicate order numbers:`);
      duplicatesResult.rows.forEach(row => {
        console.log(`- ${row.order_number}: ${row.count} occurrences`);
      });
      
      // Step 2: Delete duplicate orders
      console.log('\nStep 2: Deleting duplicate orders...');
      
      // For each duplicate order number, keep the oldest one and delete the rest
      for (const duplicate of duplicatesResult.rows) {
        const orderNumber = duplicate.order_number;
        
        // Get all orders with this order number, ordered by creation date
        const ordersResult = await client.query(`
          SELECT id, created_at
          FROM orders
          WHERE order_number = $1
          ORDER BY created_at ASC;
        `, [orderNumber]);
        
        // Keep the oldest order (first in the list) and delete the rest
        const ordersToDelete = ordersResult.rows.slice(1);
        
        if (ordersToDelete.length > 0) {
          console.log(`Keeping order ID ${ordersResult.rows[0].id} (created at ${ordersResult.rows[0].created_at}) for order number ${orderNumber}`);
          console.log(`Deleting ${ordersToDelete.length} duplicate orders with order number ${orderNumber}:`);
          
          for (const order of ordersToDelete) {
            console.log(`- Deleting order ID ${order.id} (created at ${order.created_at})`);
            
            // Delete related validation attempts first
            await client.query(`
              DELETE FROM validation_attempts
              WHERE order_id = $1;
            `, [order.id]);
            
            // Delete the order
            await client.query(`
              DELETE FROM orders
              WHERE id = $1;
            `, [order.id]);
          }
        }
      }
      
      // Verify that duplicates are gone
      const verifyResult = await client.query(`
        SELECT order_number, COUNT(*) as count
        FROM orders
        GROUP BY order_number
        HAVING COUNT(*) > 1;
      `);
      
      if (verifyResult.rows.length === 0) {
        console.log('\nAll duplicate order numbers have been resolved.');
      } else {
        console.log('\nWarning: Some duplicate order numbers still exist:');
        verifyResult.rows.forEach(row => {
          console.log(`- ${row.order_number}: ${row.count} occurrences`);
        });
      }
    }
    
    // Step 3: Modify the order number generation function to include a random component
    console.log('\nStep 3: Creating a new order number generation function...');
    
    // Create a function to generate unique order numbers
    await client.query(`
      CREATE OR REPLACE FUNCTION generate_unique_order_number() RETURNS TEXT AS $$
      DECLARE
        new_order_number TEXT;
        random_suffix TEXT;
      BEGIN
        -- Generate a random 4-character suffix
        random_suffix := substring(md5(random()::text), 1, 4);
        
        -- Create the order number with timestamp and random suffix
        new_order_number := 'ORD-' || extract(epoch from now())::bigint || '-' || random_suffix;
        
        -- Check if this order number already exists
        WHILE EXISTS (SELECT 1 FROM orders WHERE order_number = new_order_number) LOOP
          -- If it does, generate a new random suffix
          random_suffix := substring(md5(random()::text), 1, 4);
          new_order_number := 'ORD-' || extract(epoch from now())::bigint || '-' || random_suffix;
        END LOOP;
        
        RETURN new_order_number;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    console.log('Created generate_unique_order_number() function');
    
    // Step 4: Create a trigger to automatically generate unique order numbers
    console.log('\nStep 4: Creating a trigger to automatically generate unique order numbers...');
    
    // Create a trigger function
    await client.query(`
      CREATE OR REPLACE FUNCTION set_unique_order_number() RETURNS TRIGGER AS $$
      BEGIN
        -- Only set the order number if it's not already set
        IF NEW.order_number IS NULL THEN
          NEW.order_number := generate_unique_order_number();
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    console.log('Created set_unique_order_number() trigger function');
    
    // Check if the trigger already exists
    const triggerResult = await client.query(`
      SELECT 1
      FROM pg_trigger
      WHERE tgname = 'set_order_number_trigger';
    `);
    
    if (triggerResult.rows.length === 0) {
      // Create the trigger
      await client.query(`
        CREATE TRIGGER set_order_number_trigger
        BEFORE INSERT ON orders
        FOR EACH ROW
        EXECUTE FUNCTION set_unique_order_number();
      `);
      console.log('Created set_order_number_trigger');
    } else {
      console.log('Trigger set_order_number_trigger already exists');
    }
    
    console.log('\nDatabase fix completed successfully.');
    console.log('The system will now generate unique order numbers with a timestamp and random component.');
    console.log('This should prevent the "duplicate key value" errors in the future.');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (client) {
      client.release();
    }
    // Close the pool
    await pool.end();
  }
}

// Run the function
run().catch(err => {
  console.error('Unhandled error:', err);
});