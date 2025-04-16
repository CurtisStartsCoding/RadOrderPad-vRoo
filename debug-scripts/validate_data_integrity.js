/**
 * Script to perform a thorough validation of data integrity
 * This checks referential integrity, data quality, distribution, and potential anomalies
 */
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

// Database connection
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5433';
const DB_NAME = process.env.DB_NAME || 'radorder_main';
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

// Create a report file
const reportFile = 'Data/data_integrity_report.md';

async function validateDataIntegrity() {
  let client;
  let report = '# Data Integrity Validation Report\n\n';
  
  try {
    console.log('Connecting to database...');
    report += '## Database Connection\n\n';
    report += `- Host: ${DB_HOST}\n`;
    report += `- Port: ${DB_PORT}\n`;
    report += `- Database: ${DB_NAME}\n`;
    report += `- User: ${DB_USER}\n\n`;
    
    client = await pool.connect();
    console.log('Database connection established successfully');
    report += 'Database connection established successfully.\n\n';
    
    // 1. Basic Table Counts
    console.log('\n=== BASIC TABLE COUNTS ===');
    report += '## Basic Table Counts\n\n';
    const tables = [
      'medical_cpt_codes',
      'medical_icd10_codes',
      'medical_cpt_icd10_mappings',
      'medical_icd10_markdown_docs'
    ];
    
    for (const table of tables) {
      const countQuery = `SELECT COUNT(*) FROM ${table};`;
      const countResult = await client.query(countQuery);
      console.log(`${table}: ${countResult.rows[0].count.toLocaleString()} rows`);
      report += `- ${table}: ${countResult.rows[0].count.toLocaleString()} rows\n`;
    }
    report += '\n';
    
    // 2. Referential Integrity
    console.log('\n=== REFERENTIAL INTEGRITY ===');
    report += '## Referential Integrity\n\n';
    
    // Check for mappings with invalid ICD-10 codes
    const invalidIcdQuery = `
      SELECT COUNT(*) FROM medical_cpt_icd10_mappings m
      LEFT JOIN medical_icd10_codes i ON m.icd10_code = i.icd10_code
      WHERE i.icd10_code IS NULL;
    `;
    
    const invalidIcdResult = await client.query(invalidIcdQuery);
    console.log(`Mappings with invalid ICD-10 codes: ${invalidIcdResult.rows[0].count}`);
    report += `- Mappings with invalid ICD-10 codes: ${invalidIcdResult.rows[0].count}\n`;
    
    // Check for mappings with invalid CPT codes
    const invalidCptQuery = `
      SELECT COUNT(*) FROM medical_cpt_icd10_mappings m
      LEFT JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
      WHERE c.cpt_code IS NULL;
    `;
    
    const invalidCptResult = await client.query(invalidCptQuery);
    console.log(`Mappings with invalid CPT codes: ${invalidCptResult.rows[0].count}`);
    report += `- Mappings with invalid CPT codes: ${invalidCptResult.rows[0].count}\n`;
    
    // Check for markdown docs with invalid ICD-10 codes
    const invalidDocQuery = `
      SELECT COUNT(*) FROM medical_icd10_markdown_docs d
      LEFT JOIN medical_icd10_codes i ON d.icd10_code = i.icd10_code
      WHERE i.icd10_code IS NULL;
    `;
    
    const invalidDocResult = await client.query(invalidDocQuery);
    console.log(`Markdown docs with invalid ICD-10 codes: ${invalidDocResult.rows[0].count}`);
    report += `- Markdown docs with invalid ICD-10 codes: ${invalidDocResult.rows[0].count}\n\n`;
    
    // 3. Data Distribution
    console.log('\n=== DATA DISTRIBUTION ===');
    report += '## Data Distribution\n\n';
    
    // Distribution of mappings by ICD-10 code (top 10)
    const icdDistributionQuery = `
      SELECT i.icd10_code, i.description, COUNT(*) as mapping_count
      FROM medical_cpt_icd10_mappings m
      JOIN medical_icd10_codes i ON m.icd10_code = i.icd10_code
      GROUP BY i.icd10_code, i.description
      ORDER BY mapping_count DESC
      LIMIT 10;
    `;
    
    const icdDistributionResult = await client.query(icdDistributionQuery);
    console.log('Top 10 ICD-10 codes by mapping count:');
    report += '### Top 10 ICD-10 codes by mapping count\n\n';
    report += '| ICD-10 Code | Description | Mapping Count |\n';
    report += '|-------------|-------------|---------------|\n';
    
    icdDistributionResult.rows.forEach(row => {
      console.log(`${row.icd10_code}: ${row.description} - ${row.mapping_count} mappings`);
      report += `| ${row.icd10_code} | ${row.description} | ${row.mapping_count} |\n`;
    });
    report += '\n';
    
    // Distribution of mappings by CPT code (top 10)
    const cptDistributionQuery = `
      SELECT c.cpt_code, c.description, c.modality, COUNT(*) as mapping_count
      FROM medical_cpt_icd10_mappings m
      JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
      GROUP BY c.cpt_code, c.description, c.modality
      ORDER BY mapping_count DESC
      LIMIT 10;
    `;
    
    const cptDistributionResult = await client.query(cptDistributionQuery);
    console.log('Top 10 CPT codes by mapping count:');
    report += '### Top 10 CPT codes by mapping count\n\n';
    report += '| CPT Code | Description | Modality | Mapping Count |\n';
    report += '|----------|-------------|----------|---------------|\n';
    
    cptDistributionResult.rows.forEach(row => {
      console.log(`${row.cpt_code}: ${row.description} (${row.modality}) - ${row.mapping_count} mappings`);
      report += `| ${row.cpt_code} | ${row.description} | ${row.modality} | ${row.mapping_count} |\n`;
    });
    report += '\n';
    
    // Distribution of mappings by appropriateness score
    const appropriatenessQuery = `
      SELECT appropriateness, COUNT(*) as count
      FROM medical_cpt_icd10_mappings
      GROUP BY appropriateness
      ORDER BY appropriateness DESC;
    `;
    
    const appropriatenessResult = await client.query(appropriatenessQuery);
    console.log('Distribution of mappings by appropriateness score:');
    report += '### Distribution of mappings by appropriateness score\n\n';
    report += '| Appropriateness | Count | Percentage |\n';
    report += '|-----------------|-------|------------|\n';
    
    const totalMappings = appropriatenessResult.rows.reduce((sum, row) => sum + parseInt(row.count), 0);
    
    appropriatenessResult.rows.forEach(row => {
      const percentage = ((row.count / totalMappings) * 100).toFixed(2);
      console.log(`Appropriateness ${row.appropriateness}: ${row.count} mappings (${percentage}%)`);
      report += `| ${row.appropriateness} | ${row.count} | ${percentage}% |\n`;
    });
    report += '\n';
    
    // 4. Data Quality
    console.log('\n=== DATA QUALITY ===');
    report += '## Data Quality\n\n';
    
    // Check for NULL values in important fields
    const nullValuesQuery = `
      SELECT 
        SUM(CASE WHEN icd10_code IS NULL THEN 1 ELSE 0 END) as null_icd10,
        SUM(CASE WHEN cpt_code IS NULL THEN 1 ELSE 0 END) as null_cpt,
        SUM(CASE WHEN appropriateness IS NULL THEN 1 ELSE 0 END) as null_appropriateness,
        SUM(CASE WHEN evidence_source IS NULL THEN 1 ELSE 0 END) as null_evidence_source,
        SUM(CASE WHEN refined_justification IS NULL THEN 1 ELSE 0 END) as null_justification
      FROM medical_cpt_icd10_mappings;
    `;
    
    const nullValuesResult = await client.query(nullValuesQuery);
    console.log('NULL values in important fields:');
    report += '### NULL values in important fields\n\n';
    report += '| Field | NULL Count |\n';
    report += '|-------|------------|\n';
    
    const nullFields = [
      { name: 'ICD-10 Code', key: 'null_icd10' },
      { name: 'CPT Code', key: 'null_cpt' },
      { name: 'Appropriateness', key: 'null_appropriateness' },
      { name: 'Evidence Source', key: 'null_evidence_source' },
      { name: 'Refined Justification', key: 'null_justification' }
    ];
    
    nullFields.forEach(field => {
      console.log(`${field.name}: ${nullValuesResult.rows[0][field.key]} NULL values`);
      report += `| ${field.name} | ${nullValuesResult.rows[0][field.key]} |\n`;
    });
    report += '\n';
    
    // Check for duplicate mappings
    const duplicateQuery = `
      SELECT icd10_code, cpt_code, COUNT(*) as count
      FROM medical_cpt_icd10_mappings
      GROUP BY icd10_code, cpt_code
      HAVING COUNT(*) > 1
      ORDER BY count DESC
      LIMIT 10;
    `;
    
    const duplicateResult = await client.query(duplicateQuery);
    console.log('Duplicate mappings (same ICD-10 and CPT code):');
    report += '### Duplicate mappings (same ICD-10 and CPT code)\n\n';
    
    if (duplicateResult.rows.length > 0) {
      report += '| ICD-10 Code | CPT Code | Count |\n';
      report += '|-------------|----------|-------|\n';
      
      duplicateResult.rows.forEach(row => {
        console.log(`${row.icd10_code} -> ${row.cpt_code}: ${row.count} duplicates`);
        report += `| ${row.icd10_code} | ${row.cpt_code} | ${row.count} |\n`;
      });
    } else {
      console.log('No duplicate mappings found');
      report += 'No duplicate mappings found.\n';
    }
    report += '\n';
    
    // 5. Coverage Analysis
    console.log('\n=== COVERAGE ANALYSIS ===');
    report += '## Coverage Analysis\n\n';
    
    // ICD-10 codes with mappings
    const icdCoverageQuery = `
      SELECT COUNT(DISTINCT i.icd10_code) as total_codes,
             COUNT(DISTINCT m.icd10_code) as codes_with_mappings,
             COUNT(DISTINCT d.icd10_code) as codes_with_docs
      FROM medical_icd10_codes i
      LEFT JOIN medical_cpt_icd10_mappings m ON i.icd10_code = m.icd10_code
      LEFT JOIN medical_icd10_markdown_docs d ON i.icd10_code = d.icd10_code;
    `;
    
    const icdCoverageResult = await client.query(icdCoverageQuery);
    const totalIcdCodes = parseInt(icdCoverageResult.rows[0].total_codes);
    const icdCodesWithMappings = parseInt(icdCoverageResult.rows[0].codes_with_mappings);
    const icdCodesWithDocs = parseInt(icdCoverageResult.rows[0].codes_with_docs);
    
    const mappingCoveragePercentage = ((icdCodesWithMappings / totalIcdCodes) * 100).toFixed(2);
    const docCoveragePercentage = ((icdCodesWithDocs / totalIcdCodes) * 100).toFixed(2);
    
    console.log(`ICD-10 codes with mappings: ${icdCodesWithMappings} out of ${totalIcdCodes} (${mappingCoveragePercentage}%)`);
    console.log(`ICD-10 codes with markdown docs: ${icdCodesWithDocs} out of ${totalIcdCodes} (${docCoveragePercentage}%)`);
    
    report += `- ICD-10 codes with mappings: ${icdCodesWithMappings} out of ${totalIcdCodes} (${mappingCoveragePercentage}%)\n`;
    report += `- ICD-10 codes with markdown docs: ${icdCodesWithDocs} out of ${totalIcdCodes} (${docCoveragePercentage}%)\n\n`;
    
    // CPT codes with mappings
    const cptCoverageQuery = `
      SELECT COUNT(DISTINCT c.cpt_code) as total_codes,
             COUNT(DISTINCT m.cpt_code) as codes_with_mappings
      FROM medical_cpt_codes c
      LEFT JOIN medical_cpt_icd10_mappings m ON c.cpt_code = m.cpt_code;
    `;
    
    const cptCoverageResult = await client.query(cptCoverageQuery);
    const totalCptCodes = parseInt(cptCoverageResult.rows[0].total_codes);
    const cptCodesWithMappings = parseInt(cptCoverageResult.rows[0].codes_with_mappings);
    
    const cptCoveragePercentage = ((cptCodesWithMappings / totalCptCodes) * 100).toFixed(2);
    
    console.log(`CPT codes with mappings: ${cptCodesWithMappings} out of ${totalCptCodes} (${cptCoveragePercentage}%)`);
    report += `- CPT codes with mappings: ${cptCodesWithMappings} out of ${totalCptCodes} (${cptCoveragePercentage}%)\n\n`;
    
    // 6. Modality Distribution
    console.log('\n=== MODALITY DISTRIBUTION ===');
    report += '## Modality Distribution\n\n';
    
    const modalityQuery = `
      SELECT c.modality, COUNT(*) as mapping_count
      FROM medical_cpt_icd10_mappings m
      JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
      GROUP BY c.modality
      ORDER BY mapping_count DESC;
    `;
    
    const modalityResult = await client.query(modalityQuery);
    console.log('Distribution of mappings by modality:');
    report += '### Distribution of mappings by modality\n\n';
    report += '| Modality | Mapping Count | Percentage |\n';
    report += '|----------|---------------|------------|\n';
    
    modalityResult.rows.forEach(row => {
      const percentage = ((row.mapping_count / totalMappings) * 100).toFixed(2);
      console.log(`${row.modality}: ${row.mapping_count} mappings (${percentage}%)`);
      report += `| ${row.modality || 'NULL'} | ${row.mapping_count} | ${percentage}% |\n`;
    });
    report += '\n';
    
    // 7. Sample Data Validation
    console.log('\n=== SAMPLE DATA VALIDATION ===');
    report += '## Sample Data Validation\n\n';
    
    // Check a few specific ICD-10 codes
    const sampleCodes = ['A41.9', 'E11.9', 'I21.3', 'J18.9', 'K29.0', 'M54.5', 'R51', 'S06.0'];
    
    for (const code of sampleCodes) {
      const codeQuery = `
        SELECT i.icd10_code, i.description, 
               (SELECT COUNT(*) FROM medical_cpt_icd10_mappings m WHERE m.icd10_code = i.icd10_code) as mapping_count,
               (SELECT COUNT(*) FROM medical_icd10_markdown_docs d WHERE d.icd10_code = i.icd10_code) as doc_count
        FROM medical_icd10_codes i
        WHERE i.icd10_code = $1;
      `;
      
      const codeResult = await client.query(codeQuery, [code]);
      
      if (codeResult.rows.length > 0) {
        console.log(`${code}: FOUND - ${codeResult.rows[0].description}`);
        console.log(`  Mappings: ${codeResult.rows[0].mapping_count}`);
        console.log(`  Markdown docs: ${codeResult.rows[0].doc_count}`);
        
        report += `### ${code} - ${codeResult.rows[0].description}\n\n`;
        report += `- Mappings: ${codeResult.rows[0].mapping_count}\n`;
        report += `- Markdown docs: ${codeResult.rows[0].doc_count}\n\n`;
        
        // If there are mappings, show the top 3
        if (codeResult.rows[0].mapping_count > 0) {
          const mappingsQuery = `
            SELECT m.cpt_code, c.description, c.modality, m.appropriateness
            FROM medical_cpt_icd10_mappings m
            JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
            WHERE m.icd10_code = $1
            ORDER BY m.appropriateness DESC
            LIMIT 3;
          `;
          
          const mappingsResult = await client.query(mappingsQuery, [code]);
          
          report += '#### Top mappings\n\n';
          report += '| CPT Code | Description | Modality | Appropriateness |\n';
          report += '|----------|-------------|----------|----------------|\n';
          
          mappingsResult.rows.forEach(row => {
            report += `| ${row.cpt_code} | ${row.description} | ${row.modality} | ${row.appropriateness} |\n`;
          });
          report += '\n';
        }
        
        // If there's a markdown doc, show a snippet
        if (codeResult.rows[0].doc_count > 0) {
          const docQuery = `
            SELECT content
            FROM medical_icd10_markdown_docs
            WHERE icd10_code = $1
            LIMIT 1;
          `;
          
          const docResult = await client.query(docQuery, [code]);
          
          if (docResult.rows.length > 0) {
            const contentSnippet = docResult.rows[0].content.substring(0, 200) + '...';
            report += '#### Markdown doc snippet\n\n';
            report += '```\n';
            report += contentSnippet + '\n';
            report += '```\n\n';
          }
        }
      } else {
        console.log(`${code}: NOT FOUND`);
        report += `### ${code}\n\n`;
        report += 'Not found in the database.\n\n';
      }
    }
    
    // 8. Summary
    console.log('\n=== SUMMARY ===');
    report += '## Summary\n\n';
    
    const issues = [];
    
    if (parseInt(invalidIcdResult.rows[0].count) > 0) {
      issues.push(`${invalidIcdResult.rows[0].count} mappings with invalid ICD-10 codes`);
    }
    
    if (parseInt(invalidCptResult.rows[0].count) > 0) {
      issues.push(`${invalidCptResult.rows[0].count} mappings with invalid CPT codes`);
    }
    
    if (parseInt(invalidDocResult.rows[0].count) > 0) {
      issues.push(`${invalidDocResult.rows[0].count} markdown docs with invalid ICD-10 codes`);
    }
    
    let nullIssues = false;
    nullFields.forEach(field => {
      if (parseInt(nullValuesResult.rows[0][field.key]) > 0) {
        issues.push(`${nullValuesResult.rows[0][field.key]} mappings with NULL ${field.name}`);
        nullIssues = true;
      }
    });
    
    if (duplicateResult.rows.length > 0) {
      issues.push(`${duplicateResult.rows.length} types of duplicate mappings found`);
    }
    
    if (issues.length > 0) {
      console.log('Issues found:');
      report += '### Issues Found\n\n';
      
      issues.forEach(issue => {
        console.log(`- ${issue}`);
        report += `- ${issue}\n`;
      });
    } else {
      console.log('No issues found. Data integrity looks good!');
      report += 'No issues found. Data integrity looks good!\n';
    }
    
    report += '\n### Coverage Statistics\n\n';
    report += `- ICD-10 codes with mappings: ${mappingCoveragePercentage}%\n`;
    report += `- ICD-10 codes with markdown docs: ${docCoveragePercentage}%\n`;
    report += `- CPT codes with mappings: ${cptCoveragePercentage}%\n\n`;
    
    // Write the report to a file
    fs.writeFileSync(reportFile, report);
    console.log(`\nReport written to ${reportFile}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    report += `\n## Error\n\n${error.message}\n`;
    fs.writeFileSync(reportFile, report);
  } finally {
    if (client) {
      client.release();
      console.log('\nDatabase connection released');
    }
    
    // Close the pool
    await pool.end();
    console.log('Connection pool closed');
  }
}

// Run the function
validateDataIntegrity().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});