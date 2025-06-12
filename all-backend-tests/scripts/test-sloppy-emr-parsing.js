/**
 * Test script for EMR parsing with realistic, sloppy copy-paste text
 * This tests the robustness of the EMR parser with various formatting issues
 */

const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');
require('dotenv').config({ path: './.env.test' });

// API base URL
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

// Read admin token from file
const getToken = () => {
  try {
    const projectRoot = process.env.PROJECT_ROOT || process.cwd();
    const tokenPath = `${projectRoot}/tokens/admin_staff-token.txt`;
    console.log(`Reading token from: ${tokenPath}`);
    return fs.readFileSync(tokenPath, 'utf8').trim();
  } catch (error) {
    console.error('Error reading admin token:', error.message);
    process.exit(1);
  }
};

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
`
};

/**
 * Test EMR parsing with a specific sample
 */
async function testEmrParsing(token, orderId, sampleName, sampleText) {
  console.log(chalk.blue(`\n=== Testing ${sampleName} ===`));
  console.log(chalk.gray('Sample preview:'));
  console.log(chalk.gray(sampleText.substring(0, 200) + '...\n'));
  
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/orders/${orderId}/paste-summary`,
      {
        pastedText: sampleText
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.status === 200 && response.data.success) {
      console.log(chalk.green('✅ EMR parsed successfully'));
      
      // Display parsed patient information
      if (response.data.parsedData?.patientInfo) {
        const p = response.data.parsedData.patientInfo;
        console.log(chalk.cyan('\nParsed Patient Information:'));
        console.log(`  Address: ${p.address || '❌ Not found'}`);
        console.log(`  City: ${p.city || '❌ Not found'}`);
        console.log(`  State: ${p.state || '❌ Not found'}`);
        console.log(`  Zip: ${p.zipCode || '❌ Not found'}`);
        console.log(`  Phone: ${p.phone || '❌ Not found'}`);
        console.log(`  Email: ${p.email || '❌ Not found'}`);
      }
      
      // Display parsed insurance information
      if (response.data.parsedData?.insuranceInfo) {
        const i = response.data.parsedData.insuranceInfo;
        console.log(chalk.cyan('\nParsed Insurance Information:'));
        console.log(`  Insurer: ${i.insurerName || '❌ Not found'}`);
        console.log(`  Policy #: ${i.policyNumber || '❌ Not found'}`);
        console.log(`  Group #: ${i.groupNumber || '❌ Not found'}`);
        console.log(`  Subscriber: ${i.policyHolderName || '❌ Not found'}`);
        console.log(`  Relationship: ${i.relationship || '❌ Not found'}`);
        console.log(`  Auth #: ${i.authorizationNumber || '❌ Not found'}`);
      }
      
      // Calculate success rate
      const patientFields = ['address', 'city', 'state', 'zipCode', 'phone', 'email'];
      const insuranceFields = ['insurerName', 'policyNumber', 'groupNumber', 'policyHolderName', 'relationship'];
      
      const patientSuccess = patientFields.filter(field => 
        response.data.parsedData?.patientInfo?.[field]
      ).length;
      
      const insuranceSuccess = insuranceFields.filter(field => 
        response.data.parsedData?.insuranceInfo?.[field]
      ).length;
      
      const totalFields = patientFields.length + insuranceFields.length;
      const totalSuccess = patientSuccess + insuranceSuccess;
      const successRate = Math.round((totalSuccess / totalFields) * 100);
      
      console.log(chalk.yellow(`\nSuccess Rate: ${successRate}% (${totalSuccess}/${totalFields} fields extracted)`));
      
      return {
        success: true,
        successRate,
        patientSuccess,
        insuranceSuccess
      };
    } else {
      console.log(chalk.red('❌ Test failed: Unexpected response'));
      return { success: false, successRate: 0 };
    }
  } catch (error) {
    console.error(chalk.red('❌ Test failed:'));
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
    return { success: false, successRate: 0 };
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log(chalk.bold('===== Testing EMR Parser with Sloppy Copy-Paste Data ====='));
  console.log(`API URL: ${API_URL}`);
  
  try {
    // Get admin_staff token
    const token = getToken();
    if (!token) {
      console.error('No token available. Please check the token file path.');
      process.exit(1);
    }
    
    // Use a known working order ID
    const orderId = process.env.TEST_ORDER_ID || 603;
    console.log(`\nUsing order ID: ${orderId}`);
    
    // Test each sample
    const results = [];
    for (const [name, sample] of Object.entries(sloppyEmrSamples)) {
      const result = await testEmrParsing(token, orderId, name, sample);
      results.push({ name, ...result });
    }
    
    // Summary
    console.log(chalk.bold('\n===== SUMMARY ====='));
    const totalTests = results.length;
    const successfulTests = results.filter(r => r.success).length;
    const avgSuccessRate = Math.round(
      results.reduce((sum, r) => sum + r.successRate, 0) / totalTests
    );
    
    console.log(`Total EMR samples tested: ${totalTests}`);
    console.log(`Successful parses: ${successfulTests}/${totalTests}`);
    console.log(`Average field extraction rate: ${avgSuccessRate}%`);
    
    console.log(chalk.cyan('\nDetailed Results:'));
    results.forEach(r => {
      const status = r.success ? chalk.green('✅') : chalk.red('❌');
      console.log(`${status} ${r.name}: ${r.successRate}% success rate`);
    });
    
    // Recommendations
    if (avgSuccessRate < 80) {
      console.log(chalk.yellow('\n⚠️  Parser Performance Warning:'));
      console.log('The EMR parser is struggling with some formats.');
      console.log('Consider enhancing the parser to handle:');
      console.log('- Multiple phone number formats');
      console.log('- Various address layouts');
      console.log('- Different insurance field labels');
      console.log('- HTML entities and special characters');
    }
    
    console.log('\n===== Test Complete =====');
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

// Run the tests
runTests();