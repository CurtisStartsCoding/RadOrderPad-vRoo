// Function to fetch and display the active prompt template
async function fetchAndDisplayActivePrompt() {
  let client;
  
  try {
    console.log('Connecting to database...');
    console.log(`Host: ${DB_HOST}, Port: ${DB_PORT}, Database: ${DB_NAME}`);
    
    client = await pool.connect();
    console.log('Database connection established successfully');
    
    // Query the active prompt template
    console.log('Querying active prompt template from database...');
    const result = await client.query(`
      SELECT id, name, type, version, content_template, word_limit, active
      FROM prompt_templates
      WHERE active = TRUE;
    `);
    
    if (result.rows.length === 0) {
      console.log('No active prompt template found in database!');
      return null;
    }
    
    console.log(`Found ${result.rows.length} active prompt template(s) in database`);
    const activeTemplate = result.rows[0];
    
    printSectionHeader('ACTIVE PROMPT TEMPLATE');
    console.log(`ID: ${activeTemplate.id}`);
    console.log(`Name: ${activeTemplate.name}`);
    console.log(`Type: ${activeTemplate.type}`);
    console.log(`Version: ${activeTemplate.version}`);
    console.log(`Word Limit: ${activeTemplate.word_limit || 'Not set'}`);
    console.log(`Active: ${activeTemplate.active}`);
    
    printSectionHeader('PROMPT CONTENT');
    console.log(activeTemplate.content_template);
    
    return activeTemplate;
  } catch (error) {
    console.error('Error fetching active prompt template from database:', error.message);
    return null;
  } finally {
    if (client) {
      client.release();
      console.log('Database connection released');
    }
  }
  {
    name: "Experienced Clinician",
    description: "Confident, efficient response with just what's needed",
    prompt: "You're an experienced physician responding to feedback about your radiology order. Respond to this feedback: {{FEEDBACK}}. Your original order was: {{ORIGINAL_DICTATION}}. Provide a confident, efficient response with just the information needed in 1-2 sentences. No headings or formatting."
  }
];

// Function to print a section header
function printSectionHeader(title) {
  console.log('\n' + '='.repeat(80));
  console.log(title);
  console.log('='.repeat(80));
}

// Function to print a subsection header
function printSubsectionHeader(title) {
  console.log('\n' + '-'.repeat(60));
  console.log(title);
  console.log('-'.repeat(60));
}

// Function to fetch and display the active prompt template
async function fetchAndDisplayActivePrompt() {
  let client;
  
  try {
    client = await pool.connect();
    
    // Query the active prompt template
    const result = await client.query(`
      SELECT id, name, type, version, content_template, word_limit, active
      FROM prompt_templates
      WHERE active = TRUE;
    `);
    
    if (result.rows.length === 0) {
      console.log('No active prompt template found!');
      return null;
    }
    
    const activeTemplate = result.rows[0];
    
    printSectionHeader('ACTIVE PROMPT TEMPLATE');
    console.log(`ID: ${activeTemplate.id}`);
    console.log(`Name: ${activeTemplate.name}`);
    console.log(`Type: ${activeTemplate.type}`);
    console.log(`Version: ${activeTemplate.version}`);
    console.log(`Word Limit: ${activeTemplate.word_limit || 'Not set'}`);
    console.log(`Active: ${activeTemplate.active}`);
    
    printSectionHeader('PROMPT CONTENT');
    console.log(activeTemplate.content_template);
    
    return activeTemplate;
  } catch (error) {
    console.error('Error fetching active prompt template:', error.message);
    return null;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Define LLM types for tracking
const LLM_TYPES = {
  CLAUDE: 'Claude',
  GROK: 'Grok',
  GPT: 'GPT'
};

// Function to generate a dictation using a specific LLM type
async function generateDictation(dictationStyle, llmType) {
  try {
    console.log(`Generating dictation using ${llmType}...`);
    
    // Always use the fallback function but track which LLM was actually used
    const result = await llmClient.callLLMWithFallback(dictationStyle.prompt);
    
    return {
      dictation: result.content.trim(),
      llmProvider: result.provider,
      model: result.model,
      requestedLlm: llmType // Track which LLM we requested
    };
  } catch (error) {
    console.error(`Error generating dictation with ${llmType}:`, error.message);
    throw error;
  }
}

// Function to generate a response to feedback using a specific LLM type
async function generateResponse(responseStyle, feedback, originalDictation, llmType) {
  const prompt = responseStyle.prompt
    .replace('{{FEEDBACK}}', feedback)
    .replace('{{ORIGINAL_DICTATION}}', originalDictation);
  
  try {
    console.log(`Generating response using ${llmType}...`);
    
    // Always use the fallback function but track which LLM was actually used
    const result = await llmClient.callLLMWithFallback(prompt);
    
    return {
      response: result.content.trim(),
      llmProvider: result.provider,
      model: result.model,
      requestedLlm: llmType // Track which LLM we requested
    };
  } catch (error) {
    console.error(`Error generating response with ${llmType}:`, error.message);
    throw error;
  }
}

// Function to validate a dictation using the API
async function validateDictation(dictation) {
  try {
    // Prepare the request payload
    const payload = {
      dictationText: dictation,
      patientInfo: {
        id: 1,
        firstName: 'Test',
        lastName: 'Patient',
        dateOfBirth: '1980-01-01',
        gender: 'male'
      },
      referringPhysicianId: 1,
      referringOrganizationId: 1
    };
    
    // Make the API request
    const response = await axios.post(`${API_URL}/orders/validate`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    return response.data.validationResult;
  } catch (error) {
    console.error('Error during validation:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

// Function to display ICD-10 and CPT codes
function displayCodes(validationResult) {
  // Display ICD-10 codes
  printSubsectionHeader('ICD-10 CODES');
  if (validationResult.suggestedICD10Codes && validationResult.suggestedICD10Codes.length > 0) {
    validationResult.suggestedICD10Codes.forEach((code, index) => {
      console.log(`  ${index + 1}. ${code.code} - ${code.description}${code.isPrimary ? ' (PRIMARY)' : ''}`);
    });
  } else {
    console.log('  None provided');
  }
  
  // Display CPT codes
  printSubsectionHeader('CPT CODES');
  if (validationResult.suggestedCPTCodes && validationResult.suggestedCPTCodes.length > 0) {
    validationResult.suggestedCPTCodes.forEach((code, index) => {
      console.log(`  ${index + 1}. ${code.code} - ${code.description}`);
    });
  } else {
    console.log('  None provided');
  }
}

// Function to run a single test case
async function runTestCase() {
  // Randomly select dictation and response styles
  const dictationStyle = DICTATION_STYLES[Math.floor(Math.random() * DICTATION_STYLES.length)];
  const responseStyle = RESPONSE_STYLES[Math.floor(Math.random() * RESPONSE_STYLES.length)];
  
  // Randomly select LLMs for dictation and response (ensuring they're different)
  const llmTypes = [LLM_TYPES.CLAUDE, LLM_TYPES.GROK, LLM_TYPES.GPT];
  const dictationLlmIndex = Math.floor(Math.random() * llmTypes.length);
  let responseLlmIndex;
  do {
    responseLlmIndex = Math.floor(Math.random() * llmTypes.length);
  } while (responseLlmIndex === dictationLlmIndex);
  
  const dictationLlm = llmTypes[dictationLlmIndex];
  const responseLlm = llmTypes[responseLlmIndex];
  
  printSubsectionHeader(`DICTATION STYLE: ${dictationStyle.name}`);
  console.log(dictationStyle.description);
  
  // Generate the dictation using the selected LLM
  const { dictation, llmProvider: dictationProvider, model: dictationModel, requestedLlm: dictationRequestedLlm } = 
    await generateDictation(dictationStyle, dictationLlm);
  
  console.log(`\nINITIAL DICTATION (Requested: ${dictationLlm}, Actual: ${dictationProvider} - ${dictationModel}):`);
  console.log(dictation);
  
  // Step 2: Validate the dictation
  console.log('\nValidating dictation...');
  const validationResult = await validateDictation(dictation);
  
  console.log(`\nVALIDATION STATUS: ${validationResult.validationStatus}`);
  console.log(`COMPLIANCE SCORE: ${validationResult.complianceScore}`);
  
  console.log('\nFEEDBACK:');
  console.log(validationResult.feedback);
  
  // Display ICD-10 and CPT codes from initial validation
  displayCodes(validationResult);
  
  // Step 3: Generate a response to the feedback
  printSubsectionHeader(`RESPONSE STYLE: ${responseStyle.name}`);
  console.log(responseStyle.description);
  
  const { response, llmProvider: responseProvider, model: responseModel, requestedLlm: responseRequestedLlm } = 
    await generateResponse(responseStyle, validationResult.feedback, dictation, responseLlm);
  
  console.log(`\nRESPONSE TO FEEDBACK (Requested: ${responseLlm}, Actual: ${responseProvider} - ${responseModel}):`);
  console.log(response);
  
  // Step 4: Validate the updated dictation (original + response)
  const updatedDictation = `${dictation}\n\nAdditional Information: ${response}`;
  console.log('\nValidating updated dictation...');
  const updatedValidationResult = await validateDictation(updatedDictation);
  
  console.log(`\nUPDATED VALIDATION STATUS: ${updatedValidationResult.validationStatus}`);
  console.log(`UPDATED COMPLIANCE SCORE: ${updatedValidationResult.complianceScore}`);
  
  console.log('\nUPDATED FEEDBACK:');
  console.log(updatedValidationResult.feedback);
  
  // Display ICD-10 and CPT codes from updated validation
  printSubsectionHeader('UPDATED CODES');
  displayCodes(updatedValidationResult);
  
  // Return the results
  return {
    dictationStyle,
    responseStyle,
    dictation,
    dictationLlm,
    dictationProvider,
    dictationModel,
    initialValidationStatus: validationResult.validationStatus,
    initialComplianceScore: validationResult.complianceScore,
    feedback: validationResult.feedback,
    initialICD10Codes: validationResult.suggestedICD10Codes || [],
    initialCPTCodes: validationResult.suggestedCPTCodes || [],
    response,
    responseLlm,
    responseProvider,
    responseModel,
    updatedValidationStatus: updatedValidationResult.validationStatus,
    updatedComplianceScore: updatedValidationResult.complianceScore,
    updatedFeedback: updatedValidationResult.feedback,
    updatedICD10Codes: updatedValidationResult.suggestedICD10Codes || [],
    updatedCPTCodes: updatedValidationResult.suggestedCPTCodes || []
  };
}

// Main function to run the tests
async function runTests(numTests = 5) {
  // First, fetch and display the active prompt template
  await fetchAndDisplayActivePrompt();
  
  printSectionHeader('ULTRA-REALISTIC DICTATION TEST');
  console.log('This test generates extremely concise and realistic dictations');
  console.log('that reflect how physicians actually talk in clinical environments.');
  console.log('It uses multiple LLMs (Claude, GPT, Grok) to generate dictations and responses.');
  
  const results = [];
  
  // Run the specified number of tests
  for (let i = 0; i < numTests; i++) {
    printSectionHeader(`TEST ${i + 1}`);
    
    try {
      const result = await runTestCase();
      results.push(result);
    } catch (error) {
      console.error(`Error in test ${i + 1}:`, error.message);
    }
  }
  
  // Print summary
  printSectionHeader('TEST RESULTS SUMMARY');
  
  console.log(`Total tests run: ${results.length}`);
  
  const initialStatusCounts = {};
  const updatedStatusCounts = {};
  
  results.forEach(result => {
    // Count initial validation statuses
    initialStatusCounts[result.initialValidationStatus] = (initialStatusCounts[result.initialValidationStatus] || 0) + 1;
    
    // Count updated validation statuses
    updatedStatusCounts[result.updatedValidationStatus] = (updatedStatusCounts[result.updatedValidationStatus] || 0) + 1;
  });
  
  console.log('\nInitial Validation Status Counts:');
  Object.entries(initialStatusCounts).forEach(([status, count]) => {
    console.log(`- ${status}: ${count}`);
  });
  
  console.log('\nUpdated Validation Status Counts:');
  Object.entries(updatedStatusCounts).forEach(([status, count]) => {
    console.log(`- ${status}: ${count}`);
  });
  
  // Calculate average compliance score improvement
  const averageInitialScore = results.reduce((sum, result) => sum + result.initialComplianceScore, 0) / results.length;
  const averageUpdatedScore = results.reduce((sum, result) => sum + result.updatedComplianceScore, 0) / results.length;
  
  console.log(`\nAverage Initial Compliance Score: ${averageInitialScore.toFixed(2)}`);
  console.log(`Average Updated Compliance Score: ${averageUpdatedScore.toFixed(2)}`);
  console.log(`Average Improvement: ${(averageUpdatedScore - averageInitialScore).toFixed(2)}`);
  
  // Print detailed results by LLM
  printSectionHeader('RESULTS BY REQUESTED LLM');
  
  // Group results by LLM
  const llmResults = {
    'Claude': { dictationCount: 0, responseCount: 0, initialScores: [], updatedScores: [] },
    'Grok': { dictationCount: 0, responseCount: 0, initialScores: [], updatedScores: [] },
    'GPT': { dictationCount: 0, responseCount: 0, initialScores: [], updatedScores: [] }
  };
  
  results.forEach(result => {
    // Track dictation LLM
    llmResults[result.dictationLlm].dictationCount++;
    llmResults[result.dictationLlm].initialScores.push(result.initialComplianceScore);
    
    // Track response LLM
    llmResults[result.responseLlm].responseCount++;
    llmResults[result.responseLlm].updatedScores.push(result.updatedComplianceScore);
  });
  
  // Print results for each LLM
  Object.entries(llmResults).forEach(([llmName, data]) => {
    console.log(`\n${llmName}:`);
    console.log(`- Used for dictation: ${data.dictationCount} times`);
    console.log(`- Used for response: ${data.responseCount} times`);
    
    if (data.initialScores.length > 0) {
      const avgInitial = data.initialScores.reduce((sum, score) => sum + score, 0) / data.initialScores.length;
      console.log(`- Average Initial Score (when used for dictation): ${avgInitial.toFixed(2)}`);
    }
    
    if (data.updatedScores.length > 0) {
      const avgUpdated = data.updatedScores.reduce((sum, score) => sum + score, 0) / data.updatedScores.length;
      console.log(`- Average Updated Score (when used for response): ${avgUpdated.toFixed(2)}`);
    }
  });
  
  // Print detailed results by actual LLM provider
  printSectionHeader('RESULTS BY ACTUAL LLM PROVIDER');
  
  // Group results by actual LLM provider
  const providerResults = {};
  
  results.forEach(result => {
    // Initialize provider if not exists
    if (!providerResults[result.dictationProvider]) {
      providerResults[result.dictationProvider] = { 
        dictationCount: 0, 
        responseCount: 0, 
        initialScores: [], 
        updatedScores: [] 
      };
    }
    if (!providerResults[result.responseProvider]) {
      providerResults[result.responseProvider] = { 
        dictationCount: 0, 
        responseCount: 0, 
        initialScores: [], 
        updatedScores: [] 
      };
    }
    
    // Track dictation provider
    providerResults[result.dictationProvider].dictationCount++;
    providerResults[result.dictationProvider].initialScores.push(result.initialComplianceScore);
    
    // Track response provider
    providerResults[result.responseProvider].responseCount++;
    providerResults[result.responseProvider].updatedScores.push(result.updatedComplianceScore);
  });
  
  // Print results for each provider
  Object.entries(providerResults).forEach(([providerName, data]) => {
    console.log(`\n${providerName}:`);
    console.log(`- Used for dictation: ${data.dictationCount} times`);
    console.log(`- Used for response: ${data.responseCount} times`);
    
    if (data.initialScores.length > 0) {
      const avgInitial = data.initialScores.reduce((sum, score) => sum + score, 0) / data.initialScores.length;
      console.log(`- Average Initial Score (when used for dictation): ${avgInitial.toFixed(2)}`);
    }
    
    if (data.updatedScores.length > 0) {
      const avgUpdated = data.updatedScores.reduce((sum, score) => sum + score, 0) / data.updatedScores.length;
      console.log(`- Average Updated Score (when used for response): ${avgUpdated.toFixed(2)}`);
    }
  });
  
  // Print ICD-10 and CPT code statistics
  printSectionHeader('CODE STATISTICS');
  
  // Count ICD-10 codes
  const initialICD10Count = results.reduce((sum, result) => sum + result.initialICD10Codes.length, 0);
  const updatedICD10Count = results.reduce((sum, result) => sum + result.updatedICD10Codes.length, 0);
  
  // Count CPT codes
  const initialCPTCount = results.reduce((sum, result) => sum + result.initialCPTCodes.length, 0);
  const updatedCPTCount = results.reduce((sum, result) => sum + result.updatedCPTCodes.length, 0);
  
  console.log('\nICD-10 Codes:');
  console.log(`- Average initial ICD-10 codes per test: ${(initialICD10Count / results.length).toFixed(2)}`);
  console.log(`- Average updated ICD-10 codes per test: ${(updatedICD10Count / results.length).toFixed(2)}`);
  
  console.log('\nCPT Codes:');
  console.log(`- Average initial CPT codes per test: ${(initialCPTCount / results.length).toFixed(2)}`);
  console.log(`- Average updated CPT codes per test: ${(updatedCPTCount / results.length).toFixed(2)}`);
  
  // Print detailed results by dictation style
  printSectionHeader('RESULTS BY DICTATION STYLE');
  
  // Group results by dictation style
  const dictationStyleResults = {};
  DICTATION_STYLES.forEach(style => {
    dictationStyleResults[style.name] = {
      count: 0,
      initialScores: [],
      updatedScores: []
    };
  });
  
  results.forEach(result => {
    const styleName = result.dictationStyle.name;
    dictationStyleResults[styleName].count++;
    dictationStyleResults[styleName].initialScores.push(result.initialComplianceScore);
    dictationStyleResults[styleName].updatedScores.push(result.updatedComplianceScore);
  });
  
  // Print results for each dictation style
  Object.entries(dictationStyleResults).forEach(([styleName, data]) => {
    if (data.count > 0) {
      const avgInitial = data.initialScores.reduce((sum, score) => sum + score, 0) / data.count;
      const avgUpdated = data.updatedScores.reduce((sum, score) => sum + score, 0) / data.count;
      
      console.log(`\n${styleName} (${data.count} tests):`);
      console.log(`- Average Initial Score: ${avgInitial.toFixed(2)}`);
      console.log(`- Average Updated Score: ${avgUpdated.toFixed(2)}`);
      console.log(`- Average Improvement: ${(avgUpdated - avgInitial).toFixed(2)}`);
    }
  });
  
  // Print results by response style
  printSectionHeader('RESULTS BY RESPONSE STYLE');
  
  // Group results by response style
  const responseStyleResults = {};
  RESPONSE_STYLES.forEach(style => {
    responseStyleResults[style.name] = {
      count: 0,
      initialScores: [],
      updatedScores: []
    };
  });
  
  results.forEach(result => {
    const styleName = result.responseStyle.name;
    responseStyleResults[styleName].count++;
    responseStyleResults[styleName].initialScores.push(result.initialComplianceScore);
    responseStyleResults[styleName].updatedScores.push(result.updatedComplianceScore);
  });
  
  // Print results for each response style
  Object.entries(responseStyleResults).forEach(([styleName, data]) => {
    if (data.count > 0) {
      const avgInitial = data.initialScores.reduce((sum, score) => sum + score, 0) / data.count;
      const avgUpdated = data.updatedScores.reduce((sum, score) => sum + score, 0) / data.count;
      
      console.log(`\n${styleName} (${data.count} tests):`);
      console.log(`- Average Initial Score: ${avgInitial.toFixed(2)}`);
      console.log(`- Average Updated Score: ${avgUpdated.toFixed(2)}`);
      console.log(`- Average Improvement: ${(avgUpdated - avgInitial).toFixed(2)}`);
    }
  });
  
  printSectionHeader('TESTS COMPLETED');
  
  // Close the database pool
  await pool.end();
}

// Parse command line arguments
const numTests = process.argv[2] ? parseInt(process.argv[2]) : 5;

// Run the tests
runTests(numTests).catch(err => {
  console.error('Unhandled error:', err);
  // Make sure to close the pool on error
  pool.end();
});
