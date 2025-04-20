/**
 * Script to test the fixed Redis search implementations
 */
import { getRedisClient, closeRedisConnection } from '../dist/config/redis.js';
import fs from 'fs';
import path from 'path';

// Import the fixed search implementations
const cptSearchFixPath = path.join(process.cwd(), 'src', 'utils', 'redis', 'search', 'cpt-search-fix.ts');
const icd10SearchFixPath = path.join(process.cwd(), 'src', 'utils', 'redis', 'search', 'icd10-search-fix.ts');

// Read the fixed search implementations
const cptSearchFixContent = fs.readFileSync(cptSearchFixPath, 'utf8');
const icd10SearchFixContent = fs.readFileSync(icd10SearchFixPath, 'utf8');

// Create a temporary directory for the compiled files
const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Write the fixed search implementations to temporary JavaScript files
const cptSearchFixJsPath = path.join(tempDir, 'cpt-search-fix.js');
const icd10SearchFixJsPath = path.join(tempDir, 'icd10-search-fix.js');

// Convert TypeScript to JavaScript (very basic conversion)
const cptSearchFixJs = cptSearchFixContent
  .replace(/import \{ .*? \} from '.*?';/g, '')
  .replace(/export async function/g, 'async function')
  .replace(/async function searchCPTCodes/g, 'export async function searchCPTCodes')
  .replace(/: [A-Za-z<>\[\]]+/g, '')
  .replace(/\?/g, '');

const icd10SearchFixJs = icd10SearchFixContent
  .replace(/import \{ .*? \} from '.*?';/g, '')
  .replace(/export async function/g, 'async function')
  .replace(/async function searchICD10Codes/g, 'export async function searchICD10Codes')
  .replace(/: [A-Za-z<>\[\]]+/g, '')
  .replace(/\?/g, '');

// Add the missing imports and functions
const commonFunctions = `
// Common functions
function processSearchTerms(keywords) {
  return keywords.map(kw => kw.replace(/[^a-zA-Z0-9]/g, ' ')).join('|');
}

function extractKeyFromRedisKey(key) {
  return key.split(':')[1];
}

function processRedisSearchResults(results, processor) {
  const processedResults = [];
  
  // Skip the first element (count) and process the rest
  if (results && results.length > 1) {
    for (let i = 1; i < results.length; i += 2) {
      const key = results[i];
      const data = results[i + 1];
      processedResults.push(processor(key, data));
    }
  }
  
  return processedResults;
}

// Get Redis client
import { getRedisClient } from '../dist/config/redis.js';
`;

fs.writeFileSync(cptSearchFixJsPath, commonFunctions + cptSearchFixJs);
fs.writeFileSync(icd10SearchFixJsPath, commonFunctions + icd10SearchFixJs);

// Now test the fixed search implementations
async function testFixedSearchImplementations() {
  try {
    console.log('Testing fixed Redis search implementations...');
    
    // Import the fixed search implementations
    const { searchCPTCodes } = await import(cptSearchFixJsPath);
    const { searchICD10Codes } = await import(icd10SearchFixJsPath);
    
    // Test keywords
    const keywords = ['shoulder', 'pain', 'MRI', 'rotator cuff', 'tear', 'osteoarthritis'];
    console.log('Test keywords:', keywords);
    
    // Test CPT search
    console.log('\nTesting fixed CPT search implementation...');
    const cptResults = await searchCPTCodes(keywords);
    console.log(`Found ${cptResults.length} CPT codes`);
    
    if (cptResults.length > 0) {
      console.log('Sample CPT codes:');
      cptResults.slice(0, 10).forEach(row => {
        console.log(`${row.cpt_code}: ${row.description} (${row.modality}, ${row.body_part})`);
      });
    }
    
    // Test ICD-10 search
    console.log('\nTesting fixed ICD-10 search implementation...');
    const icd10Results = await searchICD10Codes(keywords);
    console.log(`Found ${icd10Results.length} ICD-10 codes`);
    
    if (icd10Results.length > 0) {
      console.log('Sample ICD-10 codes:');
      icd10Results.slice(0, 10).forEach(row => {
        console.log(`${row.icd10_code}: ${row.description}`);
      });
    }
    
    // Clean up
    fs.unlinkSync(cptSearchFixJsPath);
    fs.unlinkSync(icd10SearchFixJsPath);
    fs.rmdirSync(tempDir);
    
    console.log('\nTest complete!');
  } catch (error) {
    console.error('Error testing fixed search implementations:', error);
  } finally {
    await closeRedisConnection();
  }
}

// Run the test
testFixedSearchImplementations();