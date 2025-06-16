// Script to debug organization connections and their locations
const { Pool } = require('pg');
require('dotenv').config();

// Get database URLs
const mainDbUrl = process.env.MAIN_DATABASE_URL;
const phiDbUrl = process.env.PHI_DATABASE_URL;

// Create connections
const mainPool = new Pool({
  connectionString: mainDbUrl,
  ssl: {
    rejectUnauthorized: false,
    ca: false,
    cert: false,
    key: false
  }
});

const phiPool = new Pool({
  connectionString: phiDbUrl,
  ssl: {
    rejectUnauthorized: false,
    ca: false,
    cert: false,
    key: false
  }
});

async function debugConnectionsAndLocations() {
  const mainClient = await mainPool.connect();
  
  try {
    console.log('🔍 Analyzing Organization Connections and Locations\n');
    console.log('=' .repeat(80));
    
    // Get all active connections
    const connections = await mainClient.query(`
      SELECT 
        r.id as relationship_id,
        r.organization_id as org1_id,
        o1.name as org1_name,
        o1.type as org1_type,
        r.related_organization_id as org2_id,
        o2.name as org2_name,
        o2.type as org2_type,
        r.status,
        r.created_at
      FROM organization_relationships r
      JOIN organizations o1 ON r.organization_id = o1.id
      JOIN organizations o2 ON r.related_organization_id = o2.id
      WHERE r.status = 'active'
      ORDER BY r.created_at DESC
    `);
    
    console.log(`📊 Found ${connections.rows.length} active connections\n`);
    
    // For each connection, show location counts
    for (const conn of connections.rows) {
      console.log(`📋 Connection #${conn.relationship_id}:`);
      console.log(`   ${conn.org1_name} (${conn.org1_type}) <--> ${conn.org2_name} (${conn.org2_type})`);
      console.log(`   Status: ${conn.status}`);
      console.log(`   Created: ${conn.created_at.toLocaleDateString()}`);
      
      // Get locations for org1
      const org1Locations = await mainClient.query(`
        SELECT id, name, address_line1, city, state, is_active
        FROM locations
        WHERE organization_id = $1
        ORDER BY name
      `, [conn.org1_id]);
      
      console.log(`\n   📍 ${conn.org1_name} locations (${org1Locations.rows.length}):`);
      for (const loc of org1Locations.rows) {
        console.log(`      - [ID: ${loc.id}] ${loc.name} - ${loc.city}, ${loc.state} (Active: ${loc.is_active})`);
      }
      
      // Get locations for org2
      const org2Locations = await mainClient.query(`
        SELECT id, name, address_line1, city, state, is_active
        FROM locations
        WHERE organization_id = $1
        ORDER BY name
      `, [conn.org2_id]);
      
      console.log(`\n   📍 ${conn.org2_name} locations (${org2Locations.rows.length}):`);
      for (const loc of org2Locations.rows) {
        console.log(`      - [ID: ${loc.id}] ${loc.name} - ${loc.city}, ${loc.state} (Active: ${loc.is_active})`);
      }
      
      console.log('\n' + '-'.repeat(80) + '\n');
    }
    
    // Show organizations with no connections
    console.log('🔍 Organizations with NO active connections:\n');
    
    const unconnected = await mainClient.query(`
      SELECT o.id, o.name, o.type,
        (SELECT COUNT(*) FROM locations WHERE organization_id = o.id) as location_count
      FROM organizations o
      WHERE o.is_active = true
      AND NOT EXISTS (
        SELECT 1 FROM organization_relationships r
        WHERE (r.organization_id = o.id OR r.related_organization_id = o.id)
        AND r.status = 'active'
      )
      ORDER BY o.type, o.name
    `);
    
    for (const org of unconnected.rows) {
      console.log(`   - [ID: ${org.id}] ${org.name} (${org.type}) - ${org.location_count} locations`);
    }
    
    // Summary statistics
    console.log('\n' + '=' .repeat(80));
    console.log('📊 SUMMARY STATISTICS:\n');
    
    const stats = await mainClient.query(`
      SELECT 
        COUNT(DISTINCT CASE WHEN type = 'referring_practice' THEN id END) as referring_orgs,
        COUNT(DISTINCT CASE WHEN type = 'radiology_group' THEN id END) as radiology_orgs
      FROM organizations
      WHERE is_active = true
    `);
    
    const locationStats = await mainClient.query(`
      SELECT 
        o.type,
        COUNT(DISTINCT o.id) as org_count,
        COUNT(DISTINCT l.id) as location_count,
        ROUND(AVG(loc_per_org.count), 2) as avg_locations_per_org
      FROM organizations o
      LEFT JOIN locations l ON o.id = l.organization_id AND l.is_active = true
      LEFT JOIN (
        SELECT organization_id, COUNT(*) as count
        FROM locations
        WHERE is_active = true
        GROUP BY organization_id
      ) loc_per_org ON o.id = loc_per_org.organization_id
      WHERE o.is_active = true
      GROUP BY o.type
    `);
    
    console.log(`Total Organizations:`);
    console.log(`   - Referring Practices: ${stats.rows[0].referring_orgs}`);
    console.log(`   - Radiology Groups: ${stats.rows[0].radiology_orgs}`);
    console.log(`\nLocation Statistics by Organization Type:`);
    
    for (const stat of locationStats.rows) {
      console.log(`   ${stat.type}:`);
      console.log(`      - Organizations: ${stat.org_count}`);
      console.log(`      - Total Locations: ${stat.location_count || 0}`);
      console.log(`      - Avg Locations/Org: ${stat.avg_locations_per_org || 0}`);
    }
    
    // Test the exact endpoint logic
    console.log('\n' + '=' .repeat(80));
    console.log('🧪 TESTING ENDPOINT LOGIC:\n');
    
    // Pick a connection to test
    if (connections.rows.length > 0) {
      const testConn = connections.rows[0];
      const referringOrgId = testConn.org1_type === 'referring_practice' ? testConn.org1_id : testConn.org2_id;
      const radiologyOrgId = testConn.org1_type === 'radiology_group' ? testConn.org1_id : testConn.org2_id;
      
      console.log(`Testing with:`);
      console.log(`   Referring Org ID: ${referringOrgId}`);
      console.log(`   Radiology Org ID: ${radiologyOrgId}`);
      
      // Test the connection check
      const connectionCheck = await mainClient.query(`
        SELECT id, status FROM organization_relationships 
        WHERE (organization_id = $1 AND related_organization_id = $2)
        OR (organization_id = $2 AND related_organization_id = $1)
      `, [referringOrgId, radiologyOrgId]);
      
      console.log(`\n   Connection exists: ${connectionCheck.rows.length > 0 && connectionCheck.rows[0].status === 'active' ? 'YES' : 'NO'}`);
      
      // Test getting locations
      const testLocations = await mainClient.query(`
        SELECT id, name, is_active
        FROM locations
        WHERE organization_id = $1
        AND is_active = true
        ORDER BY name
      `, [radiologyOrgId]);
      
      console.log(`   Active locations for radiology org: ${testLocations.rows.length}`);
      for (const loc of testLocations.rows) {
        console.log(`      - ${loc.name} (ID: ${loc.id})`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    mainClient.release();
  }
}

// Run the debug script
debugConnectionsAndLocations()
  .then(() => {
    console.log('\n✅ Debug completed');
    mainPool.end();
    phiPool.end();
  })
  .catch((error) => {
    console.error('\n❌ Debug failed:', error);
    mainPool.end();
    phiPool.end();
    process.exit(1);
  });