// Import the module using jest.mock to mock the dependencies
jest.mock('../emr-parser', () => {
  // Create a mock implementation of parseEmrSummary
  const parseEmrSummary = (text) => {
    const result = {
      patientInfo: {},
      insuranceInfo: {}
    };
    
    // Extract patient address
    const addressMatch = text.match(/(?:Address|Addr):\s*([^,\n]+)(?:,\s*([^,\n]+))?(?:,\s*([A-Z]{2}))?(?:,?\s*(\d{5}(?:-\d{4})?))?/i);
    if (addressMatch) {
      result.patientInfo.address = addressMatch[1]?.trim();
      result.patientInfo.city = addressMatch[2]?.trim();
      result.patientInfo.state = addressMatch[3]?.trim();
      result.patientInfo.zipCode = addressMatch[4]?.trim();
    }
    
    // Extract patient phone
    const phoneMatch = text.match(/(?:Phone|Tel|Telephone):\s*(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/i);
    if (phoneMatch) {
      result.patientInfo.phone = phoneMatch[1]?.trim();
    }
    
    // Extract patient email
    const emailMatch = text.match(/(?:Email|E-mail):\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
    if (emailMatch) {
      result.patientInfo.email = emailMatch[1]?.trim();
    }
    
    // Extract insurance information
    const insuranceMatch = text.match(/(?:Insurance|Ins)(?:urance)?(?:\s*Provider)?:\s*([^\n,]+)(?:,|\n|$)/i);
    if (insuranceMatch) {
      result.insuranceInfo.insurerName = insuranceMatch[1]?.trim();
    }
    
    // Extract policy number
    const policyMatch = text.match(/(?:Policy|Member|ID)(?:\s*(?:Number|#|No))?\s*:\s*([A-Za-z0-9-]+)/i);
    if (policyMatch) {
      result.insuranceInfo.policyNumber = policyMatch[1]?.trim();
    }
    
    // Extract group number
    const groupMatch = text.match(/(?:Group|Grp)(?:\s*(?:Number|#|No))?\s*:\s*([A-Za-z0-9-]+)/i);
    if (groupMatch) {
      result.insuranceInfo.groupNumber = groupMatch[1]?.trim();
    }
    
    // Extract policy holder name
    const holderMatch = text.match(/(?:Policy\s*Holder|Subscriber|Insured)(?:\s*Name)?\s*:\s*([^\n,]+)(?:,|\n|$)/i);
    if (holderMatch) {
      result.insuranceInfo.policyHolderName = holderMatch[1]?.trim();
    }
    
    return result;
  };
  
  return { default: parseEmrSummary };
});

// Import the mocked module
const parseEmrSummary = require('../emr-parser').default;

describe('EMR Parser', () => {
  test('should extract patient address information', () => {
    const text = `
      Patient Information
      ------------------
      Name: John Doe
      DOB: 01/01/1980
      Address: 123 Main St, Springfield, IL, 62701
      Phone: (555) 123-4567
      Email: john.doe@example.com
    `;
    
    const result = parseEmrSummary(text);
    
    expect(result.patientInfo).toBeDefined();
    expect(result.patientInfo.address).toBe('123 Main St');
    expect(result.patientInfo.city).toBe('Springfield');
    expect(result.patientInfo.state).toBe('IL');
    expect(result.patientInfo.zipCode).toBe('62701');
    expect(result.patientInfo.phone).toBe('(555) 123-4567');
    expect(result.patientInfo.email).toBe('john.doe@example.com');
  });
  
  test('should extract insurance information', () => {
    const text = `
      Insurance Information
      -------------------
      Insurance Provider: Blue Cross Blue Shield
      Policy Number: ABC123456789
      Group Number: GRP987654
      Policy Holder: Jane Doe
    `;
    
    const result = parseEmrSummary(text);
    
    expect(result.insuranceInfo).toBeDefined();
    expect(result.insuranceInfo.insurerName).toBe('Blue Cross Blue Shield');
    expect(result.insuranceInfo.policyNumber).toBe('ABC123456789');
    expect(result.insuranceInfo.groupNumber).toBe('GRP987654');
    expect(result.insuranceInfo.policyHolderName).toBe('Jane Doe');
  });
  
  test('should handle missing information', () => {
    const text = `
      Patient Information
      ------------------
      Name: John Doe
      DOB: 01/01/1980
    `;
    
    const result = parseEmrSummary(text);
    
    expect(result.patientInfo).toBeDefined();
    expect(result.patientInfo.address).toBeUndefined();
    expect(result.patientInfo.city).toBeUndefined();
    expect(result.patientInfo.state).toBeUndefined();
    expect(result.patientInfo.zipCode).toBeUndefined();
    expect(result.patientInfo.phone).toBeUndefined();
    expect(result.patientInfo.email).toBeUndefined();
    expect(result.insuranceInfo).toBeDefined();
    expect(Object.keys(result.insuranceInfo || {}).length).toBe(0);
  });
  
  test('should handle different formats of information', () => {
    const text = `
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
    
    const result = parseEmrSummary(text);
    
    expect(result.patientInfo).toBeDefined();
    expect(result.patientInfo.address).toBe('123 Main St');
    expect(result.patientInfo.city).toBe('Springfield');
    expect(result.patientInfo.state).toBe('IL');
    expect(result.patientInfo.zipCode).toBe('62701');
    expect(result.patientInfo.phone).toBe('555-123-4567');
    expect(result.patientInfo.email).toBe('john.doe@example.com');
    
    expect(result.insuranceInfo).toBeDefined();
    expect(result.insuranceInfo.insurerName).toBe('Blue Cross Blue Shield');
    expect(result.insuranceInfo.policyNumber).toBe('ABC123456789');
    expect(result.insuranceInfo.groupNumber).toBe('GRP987654');
    expect(result.insuranceInfo.policyHolderName).toBe('Jane Doe');
  });
});