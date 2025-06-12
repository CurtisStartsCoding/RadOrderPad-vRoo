/**
 * Local test for EMR parser without API calls
 * Tests the enhanced parser directly with various EMR formats
 */

const chalk = require('chalk');

// Import the current parser (which now uses enhanced extractors)
const parseEmrSummary = require('../../dist/services/order/admin/emr-parser').default;

// Test samples including the new EpicCare format from the screenshot
const emrSamples = {
  // Epic EMR with extra spaces and formatting
  epicMessy: `


		Patient Information		
Name:   Johnson,    Mary   A.			DOB: 3/15/1968   Age: 56y   Gender: F
MRN: 00478923     Encounter: 2024-11-15
		
		Address:	456 Oak Street
				Apartment 2B
		Boston,  MA    02134
Home Phone: 617-555-9876      Cell:  (617) 555  -  4321
Work: 617.555.1111 x234
Email:   mjohnson68  @   email.com


Coverage Information
===================
Primary Insurance
  Aetna PPO
  ID#: W123456789      Group: AET-2024-GRP
  Subscriber: JOHNSON, MARY A
  Relationship: Self
  Eff Date: 01/01/2024

Secondary Insurance:   Medicare Part B     ID: 1EG4-TE5-MK72



Allergies:  NKDA
Medications: lisinopril 10mg daily, metformin 500mg BID, atorvastatin 20mg qhs
PMH: HTN, DM2, hyperlipidemia
`,

  // EpicCare format from screenshot
  epicCareFormat: `
Demographics
Basics ✓

Name: Asap, Steph
SSN: —
Date of Birth: 2/1/1990
Legal Sex: Female

Communication
Address: —
Phone: —
Email: —

Additional
Language: —
Marital status: —
Interpreter Needed: —
Preferred Pronoun: —
Religion: —
Ethnicity: —
Actual DOB: —
Preferred Form of Address: —
Permanent Comments: —

Employer and Identification ✓

Employer Information
Employment Status: —
Address: —

Patient Identification
Patient Status: Alive
Patient Type: —
MRN: 448856485

Patient Contacts ✓
⚠ No Patient Contacts on File

Preferred Pharmacies and Labs ✓
Pharmacies: None
Labs: None

EpicCare Information ✓
Primary Location: RONALD REAGAN UCLA MEDICAL CENTER
EpicCare Patient: No
Restricted Access: No
Chart Abstracted: No
`,

  // Athena with pipe delimiters
  athenaFormat: `
Smith, Robert J | Male | DOB: 01-25-1955
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Patient Contact Information:
  789 Maple Ave, Unit #15
  Springfield, Illinois  62701
  Ph: 217.555.3456 (H)   217.555.7890 (C)
  Email: bob.smith.1955@gmail.com
  
Insurance:
▪ Primary: United Healthcare | Policy #: 87654321 | Group #: UHC1234
▪ Policy Holder: Robert J Smith | Rel: Self
`,

  // Cerner with structured format
  cernerFormat: `
***** PATIENT INFORMATION *****
NAME: BROWN, JENNIFER L                    MRN: 456123
DOB: 09/22/1985 (39y)                     SEX: F

CONTACT INFORMATION
-------------------
Street Address:    999 PINE STREET, SUITE 100
City/State/Zip:    CHICAGO, IL 60601
Phone Numbers:     HOME: 312.555.4567
                  CELL: 312-555-7890
                  WORK: (312) 555-1234 EXT 567
Email Address:     JENNY.BROWN.85@YAHOO.COM

INSURANCE DETAILS
-----------------
PRIMARY INSURANCE:
  CARRIER:         HUMANA PPO
  POLICY NUMBER:   H987654321
  GROUP NUMBER:    HUM-CHI-2024
  SUBSCRIBER:      BROWN, JENNIFER L
  RELATIONSHIP:    SELF
  AUTH NUMBER:     PRE-AUTH-2024-5678
`,

  // Minimal inline format
  minimalFormat: `
Pt: Williams,John M   MR#123789   DOB 7/4/1960   M
123 Elm St #5B Cambridge MA 02139   617-555-1234   jwilliams@email.com
Ins: BCBS PPO   Pol#ABC123   Grp#BCBS789   Sub:Self
`
};

/**
 * Test a single EMR sample
 */
function testSample(name, text) {
  console.log(chalk.blue(`\n=== Testing ${name} ===`));
  console.log(chalk.gray('Sample preview:'));
  console.log(chalk.gray(text.substring(0, 150) + '...\n'));
  
  try {
    const result = parseEmrSummary(text);
    
    console.log(chalk.green('✅ Parser executed successfully'));
    
    // Display patient info
    const patientInfo = result.patientInfo || {};
    console.log(chalk.cyan('\nPatient Information:'));
    console.log(`  Address: ${patientInfo.address || chalk.red('❌ Not found')}`);
    console.log(`  City: ${patientInfo.city || chalk.red('❌ Not found')}`);
    console.log(`  State: ${patientInfo.state || chalk.red('❌ Not found')}`);
    console.log(`  Zip: ${patientInfo.zipCode || chalk.red('❌ Not found')}`);
    console.log(`  Phone: ${patientInfo.phone || chalk.red('❌ Not found')}`);
    console.log(`  Email: ${patientInfo.email || chalk.red('❌ Not found')}`);
    
    // Display insurance info
    const insuranceInfo = result.insuranceInfo || {};
    console.log(chalk.cyan('\nInsurance Information:'));
    console.log(`  Insurer: ${insuranceInfo.insurerName || chalk.red('❌ Not found')}`);
    console.log(`  Policy #: ${insuranceInfo.policyNumber || chalk.red('❌ Not found')}`);
    console.log(`  Group #: ${insuranceInfo.groupNumber || chalk.red('❌ Not found')}`);
    console.log(`  Holder: ${insuranceInfo.policyHolderName || chalk.red('❌ Not found')}`);
    console.log(`  Relationship: ${insuranceInfo.relationship || chalk.red('❌ Not found')}`);
    console.log(`  Auth #: ${insuranceInfo.authorizationNumber || chalk.red('❌ Not found')}`);
    
    // Calculate success rate
    const patientFields = Object.keys(patientInfo).length;
    const insuranceFields = Object.keys(insuranceInfo).length;
    const totalPossible = 11; // 6 patient + 5 insurance minimum
    const totalFound = patientFields + insuranceFields;
    const successRate = Math.round((totalFound / totalPossible) * 100);
    
    console.log(chalk.yellow(`\nSuccess Rate: ${successRate}% (${totalFound}/${totalPossible} fields)`));
    
    return { success: true, rate: successRate, patientFields, insuranceFields };
  } catch (error) {
    console.log(chalk.red('❌ Parser failed:'), error.message);
    return { success: false, rate: 0, patientFields: 0, insuranceFields: 0 };
  }
}

/**
 * Main test function
 */
function runTests() {
  console.log(chalk.bold('===== EMR Parser Local Test ====='));
  console.log('Testing enhanced parser with various EMR formats\n');
  
  const results = [];
  
  // Test each sample
  for (const [name, text] of Object.entries(emrSamples)) {
    const result = testSample(name, text);
    results.push({ name, ...result });
  }
  
  // Summary
  console.log(chalk.bold('\n===== SUMMARY ====='));
  
  const totalTests = results.length;
  const successfulTests = results.filter(r => r.success).length;
  const avgRate = Math.round(
    results.reduce((sum, r) => sum + r.rate, 0) / totalTests
  );
  
  console.log(`Total samples tested: ${totalTests}`);
  console.log(`Successful parses: ${successfulTests}/${totalTests}`);
  console.log(`Average extraction rate: ${avgRate}%`);
  
  console.log(chalk.cyan('\nDetailed Results:'));
  results.forEach(r => {
    const status = r.success ? chalk.green('✅') : chalk.red('❌');
    const rateColor = r.rate >= 80 ? chalk.green : r.rate >= 60 ? chalk.yellow : chalk.red;
    console.log(`${status} ${r.name}: ${rateColor(r.rate + '%')} (Patient: ${r.patientFields}, Insurance: ${r.insuranceFields})`);
  });
  
  if (avgRate >= 90) {
    console.log(chalk.green('\n✅ EXCELLENT: Parser achieves 90%+ accuracy!'));
  } else if (avgRate >= 80) {
    console.log(chalk.green('\n✅ GOOD: Parser achieves 80%+ accuracy'));
  } else if (avgRate >= 70) {
    console.log(chalk.yellow('\n⚠️  ACCEPTABLE: Parser achieves 70%+ accuracy'));
  } else {
    console.log(chalk.red('\n❌ NEEDS IMPROVEMENT: Parser below 70% accuracy'));
  }
  
  // Test specific edge cases
  console.log(chalk.bold('\n===== EDGE CASE TESTS ====='));
  
  // Test HTML entities
  const htmlTest = '&nbsp;&nbsp;&nbsp;123 Main St&nbsp;&nbsp;&nbsp;';
  const htmlResult = parseEmrSummary(`Address: ${htmlTest}`);
  console.log(`HTML Entity Test: ${htmlResult.patientInfo?.address === '123 Main St' ? chalk.green('✅ Passed') : chalk.red('❌ Failed')}`);
  
  // Test phone normalization
  const phoneTests = [
    { input: '(617) 555-1234', expected: '(617) 555-1234' },
    { input: '617.555.1234', expected: '(617) 555-1234' },
    { input: '617 555 1234', expected: '(617) 555-1234' },
    { input: '6175551234', expected: '(617) 555-1234' }
  ];
  
  console.log('\nPhone Normalization Tests:');
  phoneTests.forEach(test => {
    const result = parseEmrSummary(`Phone: ${test.input}`);
    const passed = result.patientInfo?.phone === test.expected;
    console.log(`  ${test.input} → ${test.expected}: ${passed ? chalk.green('✅') : chalk.red('❌')}`);
  });
}

// Run the tests
console.log('Note: This test requires the project to be built first (npm run build)');
console.log('Testing with compiled JavaScript...\n');

runTests();