/**
 * Script to analyze duplicate mappings in detail and identify retired CPT codes in markdown files
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
const reportFile = 'Data/duplicates_and_retired_codes_report.md';

async function analyzeDuplicatesAndRetiredCodes() {
  let client;
  let report = '# Duplicate Mappings and Retired CPT Codes Analysis\n\n';
  
  try {
    console.log('Connecting to database...');
    client = await pool.connect();
    console.log('Database connection established successfully');
    
    // 1. Analyze Duplicate Mappings
    console.log('\n=== ANALYZING DUPLICATE MAPPINGS ===');
    report += '## Duplicate Mappings Analysis\n\n';
    
    // Find all duplicate mappings
    const duplicateQuery = `
      SELECT m1.id as id1, m2.id as id2, 
             m1.icd10_code, m1.cpt_code, 
             i.description as icd10_description,
             c.description as cpt_description,
             c.modality,
             m1.appropriateness as appropriateness1,
             m2.appropriateness as appropriateness2,
             m1.evidence_source as evidence_source1,
             m2.evidence_source as evidence_source2,
             m1.enhanced_notes as enhanced_notes1,
             m2.enhanced_notes as enhanced_notes2
      FROM medical_cpt_icd10_mappings m1
      JOIN medical_cpt_icd10_mappings m2 ON m1.icd10_code = m2.icd10_code 
                                        AND m1.cpt_code = m2.cpt_code
                                        AND m1.id < m2.id
      JOIN medical_icd10_codes i ON m1.icd10_code = i.icd10_code
      JOIN medical_cpt_codes c ON m1.cpt_code = c.cpt_code
      ORDER BY m1.icd10_code, m1.cpt_code;
    `;
    
    const duplicateResult = await client.query(duplicateQuery);
    console.log(`Found ${duplicateResult.rows.length} duplicate mappings`);
    report += `Found ${duplicateResult.rows.length} duplicate mappings\n\n`;
    
    if (duplicateResult.rows.length > 0) {
      report += '### Detailed Duplicate Analysis\n\n';
      
      // Analyze each duplicate pair
      for (const row of duplicateResult.rows) {
        report += `#### ICD-10: ${row.icd10_code} (${row.icd10_description}) + CPT: ${row.cpt_code} (${row.cpt_description})\n\n`;
        report += `- **Modality**: ${row.modality}\n`;
        report += `- **Mapping IDs**: ${row.id1} and ${row.id2}\n`;
        report += `- **Appropriateness Scores**: ${row.appropriateness1} and ${row.appropriateness2}\n\n`;
        
        // Compare evidence sources
        const evidenceSourcesMatch = row.evidence_source1 === row.evidence_source2;
        report += `- **Evidence Sources Match**: ${evidenceSourcesMatch ? 'Yes' : 'No'}\n`;
        
        if (!evidenceSourcesMatch) {
          report += `  - Source 1: ${row.evidence_source1}\n`;
          report += `  - Source 2: ${row.evidence_source2}\n`;
        }
        
        // Compare enhanced notes (first 100 chars)
        const notes1Snippet = row.enhanced_notes1 ? row.enhanced_notes1.substring(0, 100) + '...' : 'NULL';
        const notes2Snippet = row.enhanced_notes2 ? row.enhanced_notes2.substring(0, 100) + '...' : 'NULL';
        const notesMatch = notes1Snippet === notes2Snippet;
        
        report += `- **Enhanced Notes Match**: ${notesMatch ? 'Yes' : 'No'}\n\n`;
        
        // Recommendation for handling this duplicate
        report += '**Recommendation**: ';
        
        if (row.appropriateness1 === row.appropriateness2 && evidenceSourcesMatch && notesMatch) {
          report += `Delete mapping with ID ${row.id2} (exact duplicate).\n\n`;
        } else if (row.appropriateness1 >= row.appropriateness2) {
          report += `Keep mapping with ID ${row.id1} (higher or equal appropriateness score).\n\n`;
        } else {
          report += `Keep mapping with ID ${row.id2} (higher appropriateness score).\n\n`;
        }
        
        report += '---\n\n';
      }
      
      // Generate SQL to fix duplicates
      report += '### SQL to Fix Duplicates\n\n';
      report += '```sql\n';
      report += 'BEGIN;\n\n';
      
      // For each duplicate, delete the one with the lower ID or appropriateness score
      for (const row of duplicateResult.rows) {
        const idToDelete = row.appropriateness1 >= row.appropriateness2 ? row.id2 : row.id1;
        report += `-- Delete duplicate mapping for ICD-10: ${row.icd10_code}, CPT: ${row.cpt_code}\n`;
        report += `DELETE FROM medical_cpt_icd10_mappings WHERE id = ${idToDelete};\n\n`;
      }
      
      report += 'COMMIT;\n';
      report += '```\n\n';
    }
    
    // 2. Identify Retired CPT Codes in Markdown Files
    console.log('\n=== IDENTIFYING RETIRED CPT CODES IN MARKDOWN FILES ===');
    report += '## Retired CPT Codes in Markdown Files\n\n';
    
    // First, identify which CPT codes are active vs. retired
    const cptStatusQuery = `
      SELECT cpt_code, description, modality,
             (SELECT COUNT(*) FROM medical_cpt_icd10_mappings m WHERE m.cpt_code = c.cpt_code) as mapping_count
      FROM medical_cpt_codes c
      ORDER BY mapping_count, cpt_code;
    `;
    
    const cptStatusResult = await client.query(cptStatusQuery);
    
    // Categorize CPT codes
    const retiredCptCodes = [];
    const activeCptCodes = [];
    
    for (const row of cptStatusResult.rows) {
      if (parseInt(row.mapping_count) === 0) {
        retiredCptCodes.push(row.cpt_code);
      } else {
        activeCptCodes.push(row.cpt_code);
      }
    }
    
    console.log(`Identified ${retiredCptCodes.length} potentially retired CPT codes (no mappings)`);
    console.log(`Identified ${activeCptCodes.length} active CPT codes (with mappings)`);
    
    report += `- Identified ${retiredCptCodes.length} potentially retired CPT codes (no mappings)\n`;
    report += `- Identified ${activeCptCodes.length} active CPT codes (with mappings)\n\n`;
    
    // Now check if any retired CPT codes are mentioned in markdown files
    const markdownQuery = `
      SELECT id, icd10_code, content
      FROM medical_icd10_markdown_docs
      ORDER BY icd10_code;
    `;
    
    const markdownResult = await client.query(markdownQuery);
    console.log(`Analyzing ${markdownResult.rows.length} markdown documents for retired CPT codes...`);
    report += `### Markdown Documents Analysis\n\n`;
    report += `Analyzing ${markdownResult.rows.length} markdown documents for retired CPT codes...\n\n`;
    
    // Create a regex pattern for CPT codes
    const cptPattern = /\b(\d{5})\b/g;
    
    // Track markdown docs with retired CPT codes
    const docsWithRetiredCodes = [];
    
    for (const doc of markdownResult.rows) {
      const content = doc.content || '';
      const matches = [...content.matchAll(cptPattern)];
      
      const retiredCodesInDoc = [];
      
      for (const match of matches) {
        const cptCode = match[1];
        if (retiredCptCodes.includes(cptCode)) {
          retiredCodesInDoc.push(cptCode);
        }
      }
      
      if (retiredCodesInDoc.length > 0) {
        docsWithRetiredCodes.push({
          id: doc.id,
          icd10_code: doc.icd10_code,
          retiredCodes: [...new Set(retiredCodesInDoc)] // Remove duplicates
        });
      }
    }
    
    console.log(`Found ${docsWithRetiredCodes.length} markdown documents containing retired CPT codes`);
    report += `Found ${docsWithRetiredCodes.length} markdown documents containing retired CPT codes\n\n`;
    
    if (docsWithRetiredCodes.length > 0) {
      report += '### Markdown Documents with Retired CPT Codes\n\n';
      report += '| Document ID | ICD-10 Code | Retired CPT Codes |\n';
      report += '|-------------|-------------|-------------------|\n';
      
      for (const doc of docsWithRetiredCodes) {
        report += `| ${doc.id} | ${doc.icd10_code} | ${doc.retiredCodes.join(', ')} |\n`;
      }
      
      report += '\n';
      
      // Generate SQL to update markdown docs
      report += '### SQL to Update Markdown Documents\n\n';
      report += '```sql\n';
      report += 'BEGIN;\n\n';
      
      for (const doc of docsWithRetiredCodes) {
        report += `-- Update markdown doc for ICD-10: ${doc.icd10_code}\n`;
        report += `-- Remove references to retired CPT codes: ${doc.retiredCodes.join(', ')}\n`;
        report += `-- Manual review required for document ID: ${doc.id}\n\n`;
      }
      
      report += 'COMMIT;\n';
      report += '```\n\n';
      
      report += '**Note**: Automated removal of retired CPT codes from markdown documents requires careful review, as these references may be part of explanatory text. Manual review is recommended.\n\n';
    }
    
    // 3. Summary and Recommendations
    console.log('\n=== SUMMARY AND RECOMMENDATIONS ===');
    report += '## Summary and Recommendations\n\n';
    
    report += '### Duplicate Mappings\n\n';
    if (duplicateResult.rows.length > 0) {
      report += `- Found ${duplicateResult.rows.length} duplicate mappings that should be resolved\n`;
      report += '- Recommended approach: Keep the mapping with the higher appropriateness score or the lower ID if scores are equal\n';
      report += '- Execute the provided SQL script to remove duplicates\n\n';
    } else {
      report += '- No duplicate mappings found\n\n';
    }
    
    report += '### Retired CPT Codes\n\n';
    if (docsWithRetiredCodes.length > 0) {
      report += `- Found ${docsWithRetiredCodes.length} markdown documents containing references to retired CPT codes\n`;
      report += '- Recommended approach: Manually review each document and update as needed\n';
      report += '- Consider adding a note that these CPT codes are retired/historical\n\n';
    } else {
      report += '- No markdown documents with retired CPT codes found\n\n';
    }
    
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
analyzeDuplicatesAndRetiredCodes().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});