/**
 * Test script comparing original EMR parser with enhanced version
 * Tests with realistic, sloppy copy-paste data to measure improvement
 */

const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');
require('dotenv').config({ path: './.env.test' });

// Import both parsers
const { parseEmrSummary } = require('../../src/services/order/admin/emr-parser');
const { parseEmrSummaryEnhanced } = require('../../src/services/order/admin/emr-parser-enhanced');

// Collection of realistic, sloppy EMR text samples
const sloppyEmrSamples = {
  // Sample 1: Epic EMR with extra spaces, tabs, and mixed formatting
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

  // Sample 2: Athena EMR with line breaks and mixed delimiters
  athenaMessy: `
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
▪ Secondary: None
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Clinical History: 
• Diabetes Type 2 - diagnosed 2019
• Hypertension - controlled with medication
• Previous L4-L5 disc herniation - 2021
`,

  // Sample 3: eClinicalWorks with poor formatting and extra characters
  ecwMessy: `
>>>Patient Demographics<<<
    Name        :   Garcia, Maria      DOB :   05/10/1972
    Gender      :   Female             Age :   52 years
    MRN         :   ECW-789456
    
    Addr        :   123 Main Street, Apt 4A, 
                    Los Angeles, CA 90012
    Phone(s)    :   Home - 213 555 6789
                    Cell - (213)555-9876
                    Work - N/A
    Email       :   mgarcia72@hotmail.com
    
<<<Insurance Information>>>
    Primary Carrier :   Cigna HMO
    Member ID       :   CIG987654321
    Group #         :   CIGNA-LA-2024
    Subscriber Name :   Garcia, Maria
    Relationship    :   Self
    Auth #          :   AUTH-2024-1234
`,

  // Sample 4: NextGen with minimal formatting
  nextgenMessy: `
Pt: Williams,John M   MR#123789   DOB 7/4/1960   M
123 Elm St #5B Cambridge MA 02139   617-555-1234   jwilliams@email.com
Ins: BCBS PPO   Pol#ABC123   Grp#BCBS789   Sub:Self
`,

  // Sample 5: Cerner with mixed case and special characters
  cernerMessy: `
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

  // Sample 6: AllScripts with truncated data and odd spacing
  allscriptsMessy: `
Patient:Davis,Michael      DOB:11/30/1978     Gender:M     MRN:AS-741852

Address:
      321 Washington Blvd
      Apt 7C
      Seattle      WA      98101
      
Contact:  Ph(H):206-555-3210  Ph(C):2065559876  Email:mdavis78@outlook.com

Insurance Data
--------------
Carrier:Premera Blue Cross     ID:PBC456789123     Group:PREM-WA-2024
PolicyHolder:Davis,Michael     Relationship:Self
`,

  // Sample 7: Practice Fusion with HTML entities and formatting
  practiceFusionMessy: `
<Patient Information>
Name: Taylor, Sarah E. &nbsp;&nbsp;&nbsp; DOB: 02/14/1990 &nbsp;&nbsp;&nbsp; Gender: F
MRN: PF-963852 &nbsp;&nbsp;&nbsp; Visit Date: 12/01/2024

Address:
&nbsp;&nbsp;&nbsp; 654 Broadway St, #3
&nbsp;&nbsp;&nbsp; New York, NY &nbsp; 10013
Phone: (212) 555-7531 &nbsp;&nbsp; Cell: 212.555.9753
Email: sarah.taylor.90@gmail.com

Insurance:
&nbsp;&nbsp;&nbsp; Primary: Empire BCBS
&nbsp;&nbsp;&nbsp; Member #: EMP789456123
&nbsp;&nbsp;&nbsp; Group: EMPIRE-NY-2024
&nbsp;&nbsp;&nbsp; Subscriber: Taylor, Sarah E.
&nbsp;&nbsp;&nbsp; Rel to Subscriber: Self
`,

  // Sample 8: Athena format from provided image
  athenaFromImage: `
athenaClinicals Chart Summary
Printed: 04/09/2025 10:15 AM

Patient: Jeff Smith
DOB: 01/01/2013
Gender: M
MRN: 789012
Contact: 123 Elm St, Springfield, IL 62701 | (217) 555-1234 | jeffsmith@example.com

Insurance:
  Blue Cross Blue Shield - BC987654321 (Group: G45678)

Providers:
  Referring: Emily Johnson, MD (NPI: 1234567890)
  PCP: Robert Lee, MD

Allergies: Penicillin (Rash, Verified 03/15/2018)
Medications: Albuterol Inhaler (PRN, Updated 03/15/2025)
PMH: Asthma (Dx 03/15/2018, ICD-10: J45.909)
Active Problems: Asthma

Recent Encounter:
  Date: 03/15/2025
  Type: Annual Wellness
  Vitals: Ht: 4'11" | Wt: 90 lbs | BP: 110/70 mmHg
  Notes: Occasional wheezing, controlled with albuterol. No urgent concerns.

Comments: Follow-up 1 yr or as needed. Asthma plan reviewed with parent.
`
};

// Expected results for validation
const expectedResults = {
  epicMessy: {
    address: '456 Oak Street Apartment 2B',
    city: 'Boston',
    state: 'MA',
    zip: '02134',
    phone: '(617) 555-9876',
    email: 'mjohnson68@email.com',
    insurer: 'Aetna',
    policyNumber: 'W123456789',
    groupNumber: 'AET-2024-GRP',
    policyHolder: 'JOHNSON, MARY A',
    relationship: 'Self'
  },
  athenaMessy: {
    address: '789 Maple Ave, Unit #15',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    phone: '(217) 555-3456',
    email: 'bob.smith.1955@gmail.com',
    insurer: 'United Healthcare',
    policyNumber: '87654321',
    groupNumber: 'UHC1234',
    policyHolder: 'Robert J Smith',
    relationship: 'Self'
  },
  ecwMessy: {
    address: '123 Main Street, Apt 4A',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90012',
    phone: '(213) 555-6789',
    email: 'mgarcia72@hotmail.com',
    insurer: 'Cigna',
    policyNumber: 'CIG987654321',
    groupNumber: 'CIGNA-LA-2024',
    policyHolder: 'Garcia, Maria',
    relationship: 'Self',
    authNumber: 'AUTH-2024-1234'
  },
  nextgenMessy: {
    address: '123 Elm St #5B',
    city: 'Cambridge',
    state: 'MA',
    zip: '02139',
    phone: '(617) 555-1234',
    email: 'jwilliams@email.com',
    insurer: 'Blue Cross Blue Shield',
    policyNumber: 'ABC123',
    groupNumber: 'BCBS789',
    relationship: 'Self'
  },
  cernerMessy: {
    address: '999 PINE STREET, SUITE 100',
    city: 'CHICAGO',
    state: 'IL',
    zip: '60601',
    phone: '(312) 555-4567',
    email: 'JENNY.BROWN.85@YAHOO.COM',
    insurer: 'Humana',
    policyNumber: 'H987654321',
    groupNumber: 'HUM-CHI-2024',
    policyHolder: 'BROWN, JENNIFER L',
    relationship: 'Self',
    authNumber: 'PRE-AUTH-2024-5678'
  },
  allscriptsMessy: {
    address: '321 Washington Blvd Apt 7C',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    phone: '(206) 555-3210',
    email: 'mdavis78@outlook.com',
    insurer: 'Premera',
    policyNumber: 'PBC456789123',
    groupNumber: 'PREM-WA-2024',
    policyHolder: 'Davis,Michael',
    relationship: 'Self'
  },
  practiceFusionMessy: {
    address: '654 Broadway St, #3',
    city: 'New York',
    state: 'NY',
    zip: '10013',
    phone: '(212) 555-7531',
    email: 'sarah.taylor.90@gmail.com',
    insurer: 'Blue Cross Blue Shield',
    policyNumber: 'EMP789456123',
    groupNumber: 'EMPIRE-NY-2024',
    policyHolder: 'Taylor, Sarah E.',
    relationship: 'Self'
  },
  athenaFromImage: {
    address: '123 Elm St',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    phone: '(217) 555-1234',
    email: 'jeffsmith@example.com',
    insurer: 'Blue Cross Blue Shield',
    policyNumber: 'BC987654321',
    groupNumber: 'G45678'
  }
};

/**
 * Test a single EMR sample with both parsers
 */
function testSample(sampleName, sampleText) {
  console.log(chalk.blue(`\n=== Testing ${sampleName} ===`));
  console.log(chalk.gray('Sample preview:'));
  console.log(chalk.gray(sampleText.substring(0, 150) + '...\n'));
  
  // Test with original parser
  console.log(chalk.yellow('Original Parser Results:'));
  const originalResult = parseEmrSummary(sampleText);
  displayResults(originalResult);
  const originalScore = calculateScore(originalResult, expectedResults[sampleName]);
  
  // Test with enhanced parser
  console.log(chalk.yellow('\nEnhanced Parser Results:'));
  const enhancedResult = parseEmrSummaryEnhanced(sampleText);
  displayResults(enhancedResult);
  const enhancedScore = calculateScore(enhancedResult, expectedResults[sampleName]);
  
  // Compare results
  const improvement = enhancedScore - originalScore;
  console.log(chalk.cyan(`\nScores: Original: ${originalScore}%, Enhanced: ${enhancedScore}%`));
  
  if (improvement > 0) {
    console.log(chalk.green(`✅ Improvement: +${improvement}%`));
  } else if (improvement === 0) {
    console.log(chalk.yellow(`➖ No change`));
  } else {
    console.log(chalk.red(`❌ Regression: ${improvement}%`));
  }
  
  return { originalScore, enhancedScore, improvement };
}

/**
 * Display parsed results
 */
function displayResults(result) {
  if (result.patientInfo) {
    console.log('Patient Info:');
    console.log(`  Address: ${result.patientInfo.address || '❌ Not found'}`);
    console.log(`  City: ${result.patientInfo.city || '❌ Not found'}`);
    console.log(`  State: ${result.patientInfo.state || '❌ Not found'}`);
    console.log(`  Zip: ${result.patientInfo.zipCode || '❌ Not found'}`);
    console.log(`  Phone: ${result.patientInfo.phone || '❌ Not found'}`);
    console.log(`  Email: ${result.patientInfo.email || '❌ Not found'}`);
  }
  
  if (result.insuranceInfo) {
    console.log('Insurance Info:');
    console.log(`  Insurer: ${result.insuranceInfo.insurerName || '❌ Not found'}`);
    console.log(`  Policy #: ${result.insuranceInfo.policyNumber || '❌ Not found'}`);
    console.log(`  Group #: ${result.insuranceInfo.groupNumber || '❌ Not found'}`);
    console.log(`  Holder: ${result.insuranceInfo.policyHolderName || '❌ Not found'}`);
    console.log(`  Relationship: ${result.insuranceInfo.relationship || '❌ Not found'}`);
    console.log(`  Auth #: ${result.insuranceInfo.authorizationNumber || '❌ Not found'}`);
  }
}

/**
 * Calculate extraction score
 */
function calculateScore(result, expected) {
  if (!expected) return 0;
  
  let correct = 0;
  let total = 0;
  
  // Check patient info
  const patientFields = ['address', 'city', 'state', 'zip', 'phone', 'email'];
  for (const field of patientFields) {
    if (expected[field]) {
      total++;
      const actual = field === 'zip' ? result.patientInfo?.zipCode : result.patientInfo?.[field];
      if (actual && normalizeValue(actual) === normalizeValue(expected[field])) {
        correct++;
      }
    }
  }
  
  // Check insurance info
  const insuranceFields = ['insurer', 'policyNumber', 'groupNumber', 'policyHolder', 'relationship', 'authNumber'];
  const fieldMap = {
    insurer: 'insurerName',
    policyHolder: 'policyHolderName',
    authNumber: 'authorizationNumber'
  };
  
  for (const field of insuranceFields) {
    if (expected[field]) {
      total++;
      const resultField = fieldMap[field] || field;
      const actual = result.insuranceInfo?.[resultField];
      if (actual && normalizeValue(actual) === normalizeValue(expected[field])) {
        correct++;
      }
    }
  }
  
  return total > 0 ? Math.round((correct / total) * 100) : 0;
}

/**
 * Normalize values for comparison
 */
function normalizeValue(value) {
  return value.toString()
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Main test function
 */
function runTests() {
  console.log(chalk.bold('===== EMR Parser Comparison Test ====='));
  console.log('Comparing original parser vs enhanced parser with realistic data\n');
  
  const results = [];
  
  // Test each sample
  for (const [name, sample] of Object.entries(sloppyEmrSamples)) {
    const result = testSample(name, sample);
    results.push({ name, ...result });
  }
  
  // Calculate overall statistics
  console.log(chalk.bold('\n===== OVERALL RESULTS ====='));
  
  const avgOriginal = Math.round(
    results.reduce((sum, r) => sum + r.originalScore, 0) / results.length
  );
  const avgEnhanced = Math.round(
    results.reduce((sum, r) => sum + r.enhancedScore, 0) / results.length
  );
  const avgImprovement = avgEnhanced - avgOriginal;
  
  console.log(`Average Scores:`);
  console.log(`  Original Parser: ${avgOriginal}%`);
  console.log(`  Enhanced Parser: ${avgEnhanced}%`);
  console.log(`  Overall Improvement: ${avgImprovement > 0 ? '+' : ''}${avgImprovement}%`);
  
  // Show detailed breakdown
  console.log(chalk.cyan('\nDetailed Results:'));
  results.forEach(r => {
    const improvementText = r.improvement > 0 
      ? chalk.green(`+${r.improvement}%`)
      : r.improvement === 0 
        ? chalk.yellow('0%')
        : chalk.red(`${r.improvement}%`);
    console.log(`${r.name}: Original ${r.originalScore}% → Enhanced ${r.enhancedScore}% (${improvementText})`);
  });
  
  // Success criteria
  if (avgEnhanced >= 95) {
    console.log(chalk.green('\n✅ EXCELLENT: Enhanced parser achieves 95%+ accuracy!'));
  } else if (avgEnhanced >= 90) {
    console.log(chalk.green('\n✅ GOOD: Enhanced parser achieves 90%+ accuracy!'));
  } else if (avgEnhanced >= 85) {
    console.log(chalk.yellow('\n⚠️  ACCEPTABLE: Enhanced parser achieves 85%+ accuracy'));
  } else {
    console.log(chalk.red('\n❌ NEEDS IMPROVEMENT: Enhanced parser below 85% accuracy'));
  }
}

// Run the tests
runTests();