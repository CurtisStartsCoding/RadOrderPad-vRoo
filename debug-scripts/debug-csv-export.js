/**
 * Debug script for CSV export functionality
 * This script will:
 * 1. Fetch order details directly from the database
 * 2. Log the order details to see if HIPAA compliance fields are present
 * 3. Generate a CSV export and log it
 * 4. Compare the fields in the order details with the fields in the CSV export
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const Papa = require('papaparse');

// Load environment variables from .env file
dotenv.config();

// Create database connection pool using environment variables
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: process.env.PHI_DB || 'radorder_phi',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123'
});

// Order ID to debug
const ORDER_ID = 5;

// Main function
async function debugCsvExport() {
  const client = await pool.connect();
  try {
    console.log('Connected to database. Fetching order details...');
    
    // Step 1: Fetch order details directly from the database
    const orderQuery = `
      SELECT * FROM orders WHERE id = $1
    `;
    const orderResult = await client.query(orderQuery, [ORDER_ID]);
    
    if (orderResult.rows.length === 0) {
      console.error(`Order with ID ${ORDER_ID} not found`);
      return;
    }
    
    const order = orderResult.rows[0];
    
    // Step 2: Log the order details to see if HIPAA compliance fields are present
    console.log('\n=== ORDER DETAILS ===');
    console.log('Order ID:', order.id);
    console.log('Order Number:', order.order_number);
    
    // Check if HIPAA compliance fields are present in the order
    const hipaaFields = [
      'referring_physician_phone',
      'referring_physician_email',
      'referring_physician_fax',
      'referring_physician_address',
      'referring_physician_city',
      'referring_physician_state',
      'referring_physician_zip',
      'referring_physician_specialty',
      'referring_physician_license',
      'referring_organization_address',
      'referring_organization_city',
      'referring_organization_state',
      'referring_organization_zip',
      'referring_organization_phone',
      'referring_organization_fax',
      'referring_organization_email',
      'referring_organization_tax_id',
      'referring_organization_npi',
      'radiology_organization_address',
      'radiology_organization_city',
      'radiology_organization_state',
      'radiology_organization_zip',
      'radiology_organization_phone',
      'radiology_organization_fax',
      'radiology_organization_email',
      'radiology_organization_tax_id',
      'radiology_organization_npi',
      'patient_consent_obtained',
      'patient_consent_date',
      'insurance_authorization_number',
      'insurance_authorization_date',
      'insurance_authorization_contact',
      'medical_necessity_documentation'
    ];
    
    console.log('\n=== HIPAA COMPLIANCE FIELDS ===');
    let hipaaFieldsPresent = 0;
    let hipaaFieldsWithValues = 0;
    
    hipaaFields.forEach(field => {
      const hasField = field in order;
      const hasValue = hasField && order[field] !== null;
      
      console.log(`${field}: ${hasField ? 'Present' : 'Missing'}${hasValue ? ` (Value: ${order[field]})` : ''}`);
      
      if (hasField) hipaaFieldsPresent++;
      if (hasValue) hipaaFieldsWithValues++;
    });
    
    console.log(`\nHIPAA fields present: ${hipaaFieldsPresent}/${hipaaFields.length}`);
    console.log(`HIPAA fields with values: ${hipaaFieldsWithValues}/${hipaaFields.length}`);
    
    // Step 3: Generate a CSV export manually
    console.log('\n=== GENERATING CSV EXPORT ===');
    
    // Create a flattened object for CSV export
    const flatData = {
      order_id: order.id,
      order_number: order.order_number,
      status: order.status,
      priority: order.priority,
      // Add HIPAA compliance fields
      referring_physician_phone: order.referring_physician_phone || '',
      referring_physician_email: order.referring_physician_email || '',
      referring_physician_fax: order.referring_physician_fax || '',
      referring_physician_address: order.referring_physician_address || '',
      referring_physician_city: order.referring_physician_city || '',
      referring_physician_state: order.referring_physician_state || '',
      referring_physician_zip: order.referring_physician_zip || '',
      referring_physician_specialty: order.referring_physician_specialty || '',
      referring_physician_license: order.referring_physician_license || '',
      referring_organization_address: order.referring_organization_address || '',
      referring_organization_city: order.referring_organization_city || '',
      referring_organization_state: order.referring_organization_state || '',
      referring_organization_zip: order.referring_organization_zip || '',
      referring_organization_phone: order.referring_organization_phone || '',
      referring_organization_fax: order.referring_organization_fax || '',
      referring_organization_email: order.referring_organization_email || '',
      referring_organization_tax_id: order.referring_organization_tax_id || '',
      referring_organization_npi: order.referring_organization_npi || '',
      radiology_organization_address: order.radiology_organization_address || '',
      radiology_organization_city: order.radiology_organization_city || '',
      radiology_organization_state: order.radiology_organization_state || '',
      radiology_organization_zip: order.radiology_organization_zip || '',
      radiology_organization_phone: order.radiology_organization_phone || '',
      radiology_organization_fax: order.radiology_organization_fax || '',
      radiology_organization_email: order.radiology_organization_email || '',
      radiology_organization_tax_id: order.radiology_organization_tax_id || '',
      radiology_organization_npi: order.radiology_organization_npi || '',
      patient_consent_obtained: order.patient_consent_obtained ? 'Yes' : 'No',
      patient_consent_date: order.patient_consent_date ? new Date(order.patient_consent_date).toISOString() : '',
      insurance_authorization_number: order.insurance_authorization_number || '',
      insurance_authorization_date: order.insurance_authorization_date ? new Date(order.insurance_authorization_date).toISOString() : '',
      insurance_authorization_contact: order.insurance_authorization_contact || '',
      medical_necessity_documentation: order.medical_necessity_documentation || ''
    };
    
    // Use PapaParse to generate CSV
    const csvString = Papa.unparse([flatData], {
      header: true,
      newline: '\n',
      skipEmptyLines: true,
      quotes: true
    });
    
    // Write CSV to file
    const debugCsvPath = path.resolve('debug-scripts', 'debug-export.csv');
    fs.writeFileSync(debugCsvPath, csvString);
    
    console.log(`CSV export generated and saved to ${debugCsvPath}`);
    console.log('\nCSV Headers:');
    console.log(Object.keys(flatData).join(', '));
    
    // Step 4: Compare with the actual CSV export from the API
    console.log('\n=== COMPARING WITH API CSV EXPORT ===');
    const apiCsvPath = path.resolve('test-results', 'order-export.csv');
    
    if (fs.existsSync(apiCsvPath)) {
      const apiCsvContent = fs.readFileSync(apiCsvPath, 'utf8');
      const apiCsvData = Papa.parse(apiCsvContent, { header: true });
      
      if (apiCsvData.data && apiCsvData.data.length > 0) {
        const apiHeaders = Object.keys(apiCsvData.data[0]);
        
        console.log('API CSV Headers:');
        console.log(apiHeaders.join(', '));
        
        // Check if HIPAA fields are in the API CSV headers
        console.log('\nHIPAA fields in API CSV:');
        let apiHipaaFieldsPresent = 0;
        
        hipaaFields.forEach(field => {
          const isPresent = apiHeaders.includes(field);
          console.log(`${field}: ${isPresent ? 'Present' : 'Missing'}`);
          
          if (isPresent) apiHipaaFieldsPresent++;
        });
        
        console.log(`\nHIPAA fields in API CSV: ${apiHipaaFieldsPresent}/${hipaaFields.length}`);
      } else {
        console.log('API CSV is empty or invalid');
      }
    } else {
      console.log(`API CSV file not found at ${apiCsvPath}`);
    }
    
  } catch (error) {
    console.error('Error in debugCsvExport:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the debug function
debugCsvExport().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});