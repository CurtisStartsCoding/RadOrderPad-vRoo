// Script to add file_hash column to document_uploads table for HIPAA compliance
const { Pool } = require('pg');
require('dotenv').config();

// Get database URL
const phiDbUrl = process.env.PHI_DATABASE_URL;

// Create connection with SSL settings
const phiPool = new Pool({
  connectionString: phiDbUrl,
  ssl: {
    rejectUnauthorized: false,
    ca: false,
    cert: false,
    key: false
  }
});

async function addFileHashColumn() {
  const client = await phiPool.connect();
  
  try {
    console.log('🔐 Adding file_hash column for HIPAA data integrity compliance...\n');
    
    // Start transaction
    await client.query('BEGIN');
    
    // Check if column already exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'document_uploads' 
      AND column_name = 'file_hash'
    `);
    
    if (checkColumn.rows.length > 0) {
      console.log('✅ file_hash column already exists');
      await client.query('ROLLBACK');
      return;
    }
    
    // Add file_hash column
    console.log('Adding file_hash column...');
    await client.query(`
      ALTER TABLE document_uploads 
      ADD COLUMN file_hash VARCHAR(128)
    `);
    
    // Add comment explaining purpose
    await client.query(`
      COMMENT ON COLUMN document_uploads.file_hash IS 
      'SHA-256 hash of file content for HIPAA-required data integrity verification'
    `);
    
    // Create index for hash lookups
    console.log('Creating index on file_hash...');
    await client.query(`
      CREATE INDEX idx_document_uploads_file_hash 
      ON document_uploads(file_hash) 
      WHERE file_hash IS NOT NULL
    `);
    
    // Commit transaction
    await client.query('COMMIT');
    console.log('✅ Successfully added file_hash column');
    
    // Show updated table structure
    const tableInfo = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'document_uploads'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Updated document_uploads table structure:');
    console.log('Column'.padEnd(25) + 'Type'.padEnd(20) + 'Nullable'.padEnd(10) + 'Default');
    console.log('-'.repeat(65));
    
    tableInfo.rows.forEach(col => {
      console.log(
        col.column_name.padEnd(25) + 
        col.data_type.padEnd(20) + 
        col.is_nullable.padEnd(10) + 
        (col.column_default || '')
      );
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Run the update
addFileHashColumn()
  .then(() => {
    console.log('\n✅ Database update completed successfully');
    phiPool.end();
  })
  .catch((error) => {
    console.error('\n❌ Database update failed:', error);
    phiPool.end();
    process.exit(1);
  });