const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.production
const envPath = path.resolve(process.cwd(), '.env.production');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const key in envConfig) {
  process.env[key] = envConfig[key];
}

// Configuration for main database (Production)
const mainDbConfig = {
  host: process.env.PROD_MAIN_DB_HOST,
  port: process.env.PROD_MAIN_DB_PORT,
  database: process.env.PROD_MAIN_DB_NAME,
  user: process.env.PROD_DB_USER,
  password: process.env.PROD_DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
};

// Configuration for PHI database (Production)
const phiDbConfig = {
  host: process.env.PROD_PHI_DB_HOST,
  port: process.env.PROD_PHI_DB_PORT,
  database: process.env.PROD_PHI_DB_NAME,
  user: process.env.PROD_DB_USER,
  password: process.env.PROD_DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
};

// Create connection pools
const mainPool = new Pool(mainDbConfig);
const phiPool = new Pool(phiDbConfig);

// Function to check if a table exists
async function checkTableExists(pool, tableName, schemaName = 'public') {
  try {
    const query = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = $1
        AND table_name = $2
      );
    `;
    const result = await pool.query(query, [schemaName, tableName]);
    return result.rows[0].exists;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}

// Function to get organization relationships
async function getOrganizationRelationships(pool) {
  try {
    // First check if the organization_relationships table exists
    const tableExists = await checkTableExists(pool, 'organization_relationships');
    
    if (!tableExists) {
      console.log('❌ organization_relationships table does not exist');
      return [];
    }
    
    const query = `
      SELECT 
        or.id,
        or.requesting_organization_id,
        req.name as requesting_organization_name,
        req.type as requesting_organization_type,
        or.target_organization_id,
        tgt.name as target_organization_name,
        tgt.type as target_organization_type,
        or.status,
        or.created_at
      FROM 
        organization_relationships or
      JOIN
        organizations req ON or.requesting_organization_id = req.id
      JOIN
        organizations tgt ON or.target_organization_id = tgt.id
      ORDER BY
        or.id;
    `;
    
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error getting organization relationships:', error);
    return [];
  }
}

// Function to get order organization details
async function getOrderOrganizationDetails(phiPool, orderId) {
  try {
    const query = `
      SELECT 
        id,
        order_number,
        referring_organization_id,
        radiology_organization_id,
        status
      FROM 
        orders
      WHERE 
        id = $1;
    `;
    
    const result = await phiPool.query(query, [orderId]);
    
    if (result.rows.length === 0) {
      console.log(`❌ Order #${orderId} not found`);
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error(`Error getting order #${orderId} details:`, error);
    return null;
  }
}

// Function to check if two organizations have a relationship
async function checkOrganizationRelationship(pool, orgId1, orgId2) {
  try {
    const query = `
      SELECT 
        *
      FROM 
        organization_relationships
      WHERE 
        (requesting_organization_id = $1 AND target_organization_id = $2)
        OR
        (requesting_organization_id = $2 AND target_organization_id = $1);
    `;
    
    const result = await pool.query(query, [orgId1, orgId2]);
    return {
      exists: result.rows.length > 0,
      relationships: result.rows
    };
  } catch (error) {
    console.error(`Error checking relationship between organizations ${orgId1} and ${orgId2}:`, error);
    return {
      exists: false,
      relationships: []
    };
  }
}

// Function to get organization details
async function getOrganizationDetails(pool, orgId) {
  try {
    const query = `
      SELECT 
        id,
        name,
        type,
        credit_balance,
        status
      FROM 
        organizations
      WHERE 
        id = $1;
    `;
    
    const result = await pool.query(query, [orgId]);
    
    if (result.rows.length === 0) {
      console.log(`❌ Organization #${orgId} not found`);
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error(`Error getting organization #${orgId} details:`, error);
    return null;
  }
}

// Main function to test organization relationships
async function testOrganizationRelationships() {
  console.log('=== ORGANIZATION RELATIONSHIPS TEST ===');
  console.log('Testing organization relationships for orders...\n');

  try {
    // Check if organization_relationships table exists
    console.log('Checking organization_relationships table:');
    const relationshipsTableExists = await checkTableExists(mainPool, 'organization_relationships');
    
    if (relationshipsTableExists) {
      console.log('✅ organization_relationships table exists\n');
    } else {
      console.log('❌ organization_relationships table does not exist\n');
    }

    // Get all organization relationships
    console.log('Getting all organization relationships:');
    const relationships = await getOrganizationRelationships(mainPool);
    
    if (relationships.length > 0) {
      console.log(`✅ Found ${relationships.length} organization relationships`);
      console.table(relationships);
      console.log('\n');
    } else {
      console.log('❌ No organization relationships found\n');
    }

    // Test specific orders
    const orderIds = [606, 607];
    
    for (const orderId of orderIds) {
      console.log(`\n--- Testing Order #${orderId} ---`);
      
      // Get order details
      console.log(`Getting order #${orderId} details:`);
      const orderDetails = await getOrderOrganizationDetails(phiPool, orderId);
      
      if (!orderDetails) {
        console.log(`❌ Failed to get order #${orderId} details`);
        continue;
      }
      
      console.log('✅ Order details retrieved successfully');
      console.log(`Order #${orderId} Details:`, orderDetails);
      
      // Get referring organization details
      console.log(`\nGetting referring organization #${orderDetails.referring_organization_id} details:`);
      const referringOrg = await getOrganizationDetails(mainPool, orderDetails.referring_organization_id);
      
      if (!referringOrg) {
        console.log(`❌ Failed to get referring organization #${orderDetails.referring_organization_id} details`);
      } else {
        console.log('✅ Referring organization details retrieved successfully');
        console.log('Referring Organization Details:', referringOrg);
      }
      
      // Get radiology organization details
      console.log(`\nGetting radiology organization #${orderDetails.radiology_organization_id} details:`);
      const radiologyOrg = await getOrganizationDetails(mainPool, orderDetails.radiology_organization_id);
      
      if (!radiologyOrg) {
        console.log(`❌ Failed to get radiology organization #${orderDetails.radiology_organization_id} details`);
      } else {
        console.log('✅ Radiology organization details retrieved successfully');
        console.log('Radiology Organization Details:', radiologyOrg);
      }
      
      // Check relationship between referring and radiology organizations
      if (referringOrg && radiologyOrg) {
        console.log(`\nChecking relationship between organizations #${referringOrg.id} and #${radiologyOrg.id}:`);
        const relationshipCheck = await checkOrganizationRelationship(mainPool, referringOrg.id, radiologyOrg.id);
        
        if (relationshipCheck.exists) {
          console.log(`✅ Relationship exists between organizations #${referringOrg.id} and #${radiologyOrg.id}`);
          console.log('Relationship Details:');
          console.table(relationshipCheck.relationships);
        } else {
          console.log(`❌ No relationship found between organizations #${referringOrg.id} and #${radiologyOrg.id}`);
        }
      }
    }

  } catch (error) {
    console.error('Error testing organization relationships:', error);
  } finally {
    // Close connections
    await mainPool.end();
    await phiPool.end();
    console.log('\n=== ORGANIZATION RELATIONSHIPS TEST COMPLETE ===');
  }
}

// Run the test
testOrganizationRelationships().catch(console.error);