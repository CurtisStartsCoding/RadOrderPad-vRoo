/**
 * Quick test of EMR parser functionality
 */

const chalk = require('chalk');

// Sample EMR text
const sampleText = `
Patient Information
Name:   Johnson,    Mary   A.      DOB: 3/15/1968   Age: 56y   Gender: F
MRN: 00478923     Encounter: 2024-11-15

Address:  456 Oak Street
          Apartment 2B
Boston,  MA    02134
Home Phone: 617-555-9876      Cell:  (617) 555  -  4321
Email:   mjohnson68@email.com

Coverage Information
Primary Insurance:  Aetna PPO
ID#: W123456789      Group: AET-2024-GRP
Subscriber: JOHNSON, MARY A
Relationship: Self
`;

// Simple test parser
function testParser(text) {
  console.log(chalk.blue('Testing EMR Parser...'));
  
  // Test phone extraction
  const phonePatterns = [
    /(?:Phone|Tel|Ph|Contact)[\s:]*([(\d][\d\s().+-]+[\d)])/i,
    /(?:Home|Cell|Mobile)[\s:]*([(\d][\d\s().+-]+[\d)])/i,
    /\b(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})\b/
  ];
  
  let phone = null;
  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) {
      phone = match[1];
      break;
    }
  }
  
  console.log(`Phone found: ${phone || 'Not found'}`);
  
  // Test address extraction
  const addressPattern = /Address:\s*([^\n]+(?:\n\s+[^\n]+)*?)(?=\n[A-Z]|\n\n|$)/i;
  const addressMatch = text.match(addressPattern);
  const address = addressMatch ? addressMatch[1].replace(/\n\s+/g, ' ').trim() : null;
  
  console.log(`Address found: ${address || 'Not found'}`);
  
  // Test city/state/zip
  const locationPattern = /([A-Za-z\s]+),\s*([A-Z]{2})\s+(\d{5})/;
  const locationMatch = text.match(locationPattern);
  
  if (locationMatch) {
    console.log(`City: ${locationMatch[1].trim()}`);
    console.log(`State: ${locationMatch[2]}`);
    console.log(`Zip: ${locationMatch[3]}`);
  }
  
  // Test insurance
  const insurerPattern = /(?:Primary Insurance|Insurance):\s*([A-Za-z\s]+?)(?=\s*ID|$)/i;
  const insurerMatch = text.match(insurerPattern);
  console.log(`Insurer: ${insurerMatch ? insurerMatch[1].trim() : 'Not found'}`);
  
  const policyPattern = /ID#:\s*([A-Za-z0-9]+)/i;
  const policyMatch = text.match(policyPattern);
  console.log(`Policy #: ${policyMatch ? policyMatch[1] : 'Not found'}`);
}

testParser(sampleText);