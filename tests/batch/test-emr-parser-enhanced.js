/**
 * Test script for the enhanced EMR parser
 * 
 * This script tests the enhanced EMR parser with various EMR formats
 * to verify that it can extract patient and insurance information correctly.
 */

const { parseEmrSummary } = require('../../dist/services/order/admin/emr-parser');

// Test cases for different EMR formats
const testCases = [
  {
    name: 'Epic EMR Format',
    text: `
PATIENT INFORMATION
------------------
Name: John Doe
DOB: 01/01/1980
Address: 123 Main St, Springfield, IL, 62701
Phone: (555) 123-4567
Email: john.doe@example.com

INSURANCE INFORMATION
-------------------
Insurance Provider: Blue Cross Blue Shield
Policy Number: ABC123456789
Group Number: GRP987654
Policy Holder: Jane Doe
Relationship to Subscriber: Spouse
Authorization Number: AUTH12345
    `
  },
  {
    name: 'Athena EMR Format',
    text: `
Patient Demographics
-------------------
Patient: Smith, Jane
DOB: 05/15/1975
MRN: 12345678
Address: 456 Oak Avenue
City: LEHIGH ACRES
State: FL
ZIP: 33936
Home: (555) 987-6543
Cell: (555) 876-5432
Email: jane.smith@example.com

Insurance
---------
Primary: UNITED HEALTH MCR H* / UHC MEDICARE REPLACEMENT
ID #: UHC987654321
Group #: MCRA123
Subscriber: Smith, Jane
Relationship: Self
    `
  },
  {
    name: 'eClinicalWorks Format',
    text: `
Demographics
-----------
Name: Robert Johnson
DOB: 10/20/1965
Sex: Male
Address: 789 Pine Street, Chicago, IL 60601
Tel: 555-234-5678
Alt: 555-345-6789
Email: robert.johnson@example.com

Insurance Details
---------------
Ins: Aetna
Member #: AET123456789
Grp #: AETG123
Subscriber: Robert Johnson
Rel to Subscriber: Self
Auth #: AETH987654
    `
  },
  {
    name: 'Minimal Information',
    text: `
Patient is Robert Williams, lives in LEHIGH ACRES, FL 33936.
Contact at 555-111-2222 or rwilliams@example.com
Insurance is Medicare, ID 123456789M, Group Medicare-A
    `
  }
];

// Run tests
console.log('=== Enhanced EMR Parser Test ===\n');

testCases.forEach((testCase, index) => {
  console.log(`Test Case ${index + 1}: ${testCase.name}`);
  console.log('-'.repeat(40));
  
  try {
    const result = parseEmrSummary(testCase.text);
    console.log('Extracted Patient Info:');
    console.log(JSON.stringify(result.patientInfo, null, 2));
    console.log('\nExtracted Insurance Info:');
    console.log(JSON.stringify(result.insuranceInfo, null, 2));
  } catch (error) {
    console.error('Error parsing EMR text:', error.message);
  }
  
  console.log('\n');
});

console.log('=== Test Complete ===');