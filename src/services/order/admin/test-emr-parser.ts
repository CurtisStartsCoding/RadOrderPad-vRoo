/**
 * Simple test script for EMR parser
 */
import { parseEmrSummary } from './emr-parser';

// Test case 1: Extract patient address information
const text1 = `
  Patient Information
  ------------------
  Name: John Doe
  DOB: 01/01/1980
  Address: 123 Main St, Springfield, IL, 62701
  Phone: (555) 123-4567
  Email: john.doe@example.com
`;

// eslint-disable-next-line no-console
console.log('Test Case 1:');
const result1 = parseEmrSummary(text1);
// eslint-disable-next-line no-console
console.log(JSON.stringify(result1, null, 2));

// Test case 2: Extract insurance information
const text2 = `
  Insurance Information
  -------------------
  Insurance Provider: Blue Cross Blue Shield
  Policy Number: ABC123456789
  Group Number: GRP987654
  Policy Holder: Jane Doe
`;

// eslint-disable-next-line no-console
console.log('\nTest Case 2:');
const result2 = parseEmrSummary(text2);
// eslint-disable-next-line no-console
console.log(JSON.stringify(result2, null, 2));

// Test case 3: Handle different formats of information
const text3 = `
  Patient Info
  -----------
  Name: John Doe
  DOB: 01/01/1980
  Addr: 123 Main St, Springfield, IL, 62701
  Tel: 555-123-4567
  E-mail: john.doe@example.com
  
  Insurance Info
  -------------
  Ins: Blue Cross Blue Shield
  Member #: ABC123456789
  Grp #: GRP987654
  Subscriber: Jane Doe
`;

// eslint-disable-next-line no-console
console.log('\nTest Case 3:');
const result3 = parseEmrSummary(text3);
// eslint-disable-next-line no-console
console.log(JSON.stringify(result3, null, 2));