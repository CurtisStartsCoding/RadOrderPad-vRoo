/**
 * Redis Test Results Analyzer
 * 
 * This script analyzes the results from the Redis optimization test suite
 * and generates detailed reports and visualizations.
 */

const fs = require('fs');
const path = require('path');

// Get the results directory
const resultsDir = path.join(__dirname, 'redis-test-results');
if (!fs.existsSync(resultsDir)) {
  console.error('Results directory not found. Run the test suite first.');
  process.exit(1);
}

// Find the summary report
const summaryPath = path.join(resultsDir, 'summary_report.json');
if (!fs.existsSync(summaryPath)) {
  console.error('Summary report not found. Run the test suite first.');
  process.exit(1);
}

// Load the summary report
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

// Load all individual test results
const testResults = [];
const resultFiles = fs.readdirSync(resultsDir)
  .filter(file => file.endsWith('.json') && file !== 'summary_report.json');

for (const file of resultFiles) {
  const result = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8'));
  testResults.push(result);
}

// Generate a detailed analysis report
function generateDetailedReport() {
  const report = {
    testSummary: summary,
    keywordAnalysis: analyzeKeywords(),
    diagnosisAnalysis: analyzeDiagnoses(),
    procedureAnalysis: analyzeProcedures(),
    llmComparison: compareLLMs(),
    testCaseAnalysis: analyzeTestCases(),
    recommendations: generateRecommendations()
  };
  
  // Save the detailed report
  const reportPath = path.join(resultsDir, 'detailed_analysis.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Detailed analysis saved to ${reportPath}`);
  
  return report;
}

// Analyze keywords across all tests
function analyzeKeywords() {
  const keywordAnalysis = {
    totalUniqueKeywords: new Set(),
    keywordFrequency: {},
    keywordsByLLM: {},
    keywordsByTestCase: {},
    correlationWithAccuracy: {
      diagnosis: 0,
      procedure: 0
    }
  };
  
  // Process all test results
  for (const result of testResults) {
    if (!result.keywords) continue;
    
    // Add to total unique keywords
    result.keywords.forEach(kw => keywordAnalysis.totalUniqueKeywords.add(kw));
    
    // Count keyword frequency
    result.keywords.forEach(kw => {
      keywordAnalysis.keywordFrequency[kw] = (keywordAnalysis.keywordFrequency[kw] || 0) + 1;
    });
    
    // Group by LLM
    if (!keywordAnalysis.keywordsByLLM[result.llm]) {
      keywordAnalysis.keywordsByLLM[result.llm] = {
        uniqueKeywords: new Set(),
        averageCount: 0,
        results: []
      };
    }
    result.keywords.forEach(kw => keywordAnalysis.keywordsByLLM[result.llm].uniqueKeywords.add(kw));
    keywordAnalysis.keywordsByLLM[result.llm].results.push({
      testCase: result.testCase,
      keywordCount: result.keywordCount,
      diagnosisAccuracy: result.diagnosisAccuracy?.accuracy || 0,
      procedureAccuracy: result.procedureAccuracy?.accuracy || 0
    });
    
    // Group by test case
    if (!keywordAnalysis.keywordsByTestCase[result.testCase]) {
      keywordAnalysis.keywordsByTestCase[result.testCase] = {
        uniqueKeywords: new Set(),
        byLLM: {}
      };
    }
    result.keywords.forEach(kw => keywordAnalysis.keywordsByTestCase[result.testCase].uniqueKeywords.add(kw));
    keywordAnalysis.keywordsByTestCase[result.testCase].byLLM[result.llm] = {
      keywordCount: result.keywordCount,
      keywords: result.keywords
    };
  }
  
  // Convert Sets to arrays for JSON serialization
  keywordAnalysis.totalUniqueKeywords = Array.from(keywordAnalysis.totalUniqueKeywords);
  
  for (const llm in keywordAnalysis.keywordsByLLM) {
    keywordAnalysis.keywordsByLLM[llm].uniqueKeywords = Array.from(keywordAnalysis.keywordsByLLM[llm].uniqueKeywords);
    keywordAnalysis.keywordsByLLM[llm].averageCount = keywordAnalysis.keywordsByLLM[llm].results.reduce((sum, r) => sum + r.keywordCount, 0) / keywordAnalysis.keywordsByLLM[llm].results.length;
  }
  
  for (const testCase in keywordAnalysis.keywordsByTestCase) {
    keywordAnalysis.keywordsByTestCase[testCase].uniqueKeywords = Array.from(keywordAnalysis.keywordsByTestCase[testCase].uniqueKeywords);
  }
  
  // Calculate correlation between keyword count and accuracy
  const keywordCounts = testResults.map(r => r.keywordCount || 0);
  const diagnosisAccuracies = testResults.map(r => r.diagnosisAccuracy?.accuracy || 0);
  const procedureAccuracies = testResults.map(r => r.procedureAccuracy?.accuracy || 0);
  
  keywordAnalysis.correlationWithAccuracy.diagnosis = calculateCorrelation(keywordCounts, diagnosisAccuracies);
  keywordAnalysis.correlationWithAccuracy.procedure = calculateCorrelation(keywordCounts, procedureAccuracies);
  
  // Sort keywords by frequency
  keywordAnalysis.topKeywords = Object.entries(keywordAnalysis.keywordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([keyword, frequency]) => ({ keyword, frequency }));
  
  return keywordAnalysis;
}

// Analyze diagnosis code accuracy
function analyzeDiagnoses() {
  const diagnosisAnalysis = {
    overallAccuracy: summary.accuracyAnalysis.diagnosis.average,
    byLLM: summary.accuracyAnalysis.diagnosis.byLLM,
    byTestCase: {},
    mostMissedCodes: {},
    mostUnexpectedCodes: {}
  };
  
  // Analyze by test case
  for (const result of testResults) {
    if (!result.diagnosisAccuracy) continue;
    
    const testCase = result.testCase;
    if (!diagnosisAnalysis.byTestCase[testCase]) {
      diagnosisAnalysis.byTestCase[testCase] = {
        averageAccuracy: 0,
        byLLM: {},
        missedCodes: {},
        unexpectedCodes: {}
      };
    }
    
    // Record accuracy by LLM
    diagnosisAnalysis.byTestCase[testCase].byLLM[result.llm] = {
      accuracy: result.diagnosisAccuracy.accuracy,
      found: result.diagnosisAccuracy.found,
      missing: result.diagnosisAccuracy.missing,
      unexpected: result.diagnosisAccuracy.unexpected
    };
    
    // Count missed codes
    result.diagnosisAccuracy.missing.forEach(code => {
      diagnosisAnalysis.byTestCase[testCase].missedCodes[code] = (diagnosisAnalysis.byTestCase[testCase].missedCodes[code] || 0) + 1;
      diagnosisAnalysis.mostMissedCodes[code] = (diagnosisAnalysis.mostMissedCodes[code] || 0) + 1;
    });
    
    // Count unexpected codes
    result.diagnosisAccuracy.unexpected.forEach(code => {
      diagnosisAnalysis.byTestCase[testCase].unexpectedCodes[code] = (diagnosisAnalysis.byTestCase[testCase].unexpectedCodes[code] || 0) + 1;
      diagnosisAnalysis.mostUnexpectedCodes[code] = (diagnosisAnalysis.mostUnexpectedCodes[code] || 0) + 1;
    });
  }
  
  // Calculate average accuracy by test case
  for (const testCase in diagnosisAnalysis.byTestCase) {
    const llmResults = Object.values(diagnosisAnalysis.byTestCase[testCase].byLLM);
    diagnosisAnalysis.byTestCase[testCase].averageAccuracy = llmResults.reduce((sum, r) => sum + r.accuracy, 0) / llmResults.length;
  }
  
  // Sort most missed and unexpected codes
  diagnosisAnalysis.topMissedCodes = Object.entries(diagnosisAnalysis.mostMissedCodes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([code, count]) => ({ code, count }));
  
  diagnosisAnalysis.topUnexpectedCodes = Object.entries(diagnosisAnalysis.mostUnexpectedCodes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([code, count]) => ({ code, count }));
  
  return diagnosisAnalysis;
}

// Analyze procedure code accuracy
function analyzeProcedures() {
  const procedureAnalysis = {
    overallAccuracy: summary.accuracyAnalysis.procedure.average,
    byLLM: summary.accuracyAnalysis.procedure.byLLM,
    byTestCase: {},
    mostMissedCodes: {},
    mostUnexpectedCodes: {}
  };
  
  // Analyze by test case
  for (const result of testResults) {
    if (!result.procedureAccuracy) continue;
    
    const testCase = result.testCase;
    if (!procedureAnalysis.byTestCase[testCase]) {
      procedureAnalysis.byTestCase[testCase] = {
        averageAccuracy: 0,
        byLLM: {},
        missedCodes: {},
        unexpectedCodes: {}
      };
    }
    
    // Record accuracy by LLM
    procedureAnalysis.byTestCase[testCase].byLLM[result.llm] = {
      accuracy: result.procedureAccuracy.accuracy,
      found: result.procedureAccuracy.found,
      missing: result.procedureAccuracy.missing,
      unexpected: result.procedureAccuracy.unexpected
    };
    
    // Count missed codes
    result.procedureAccuracy.missing.forEach(code => {
      procedureAnalysis.byTestCase[testCase].missedCodes[code] = (procedureAnalysis.byTestCase[testCase].missedCodes[code] || 0) + 1;
      procedureAnalysis.mostMissedCodes[code] = (procedureAnalysis.mostMissedCodes[code] || 0) + 1;
    });
    
    // Count unexpected codes
    result.procedureAccuracy.unexpected.forEach(code => {
      procedureAnalysis.byTestCase[testCase].unexpectedCodes[code] = (procedureAnalysis.byTestCase[testCase].unexpectedCodes[code] || 0) + 1;
      procedureAnalysis.mostUnexpectedCodes[code] = (procedureAnalysis.mostUnexpectedCodes[code] || 0) + 1;
    });
  }
  
  // Calculate average accuracy by test case
  for (const testCase in procedureAnalysis.byTestCase) {
    const llmResults = Object.values(procedureAnalysis.byTestCase[testCase].byLLM);
    procedureAnalysis.byTestCase[testCase].averageAccuracy = llmResults.reduce((sum, r) => sum + r.accuracy, 0) / llmResults.length;
  }
  
  // Sort most missed and unexpected codes
  procedureAnalysis.topMissedCodes = Object.entries(procedureAnalysis.mostMissedCodes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([code, count]) => ({ code, count }));
  
  procedureAnalysis.topUnexpectedCodes = Object.entries(procedureAnalysis.mostUnexpectedCodes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([code, count]) => ({ code, count }));
  
  return procedureAnalysis;
}

// Compare LLM performance
function compareLLMs() {
  const llmComparison = {
    overall: summary.llmComparison,
    byMetric: {
      diagnosisAccuracy: [],
      procedureAccuracy: [],
      keywordCount: [],
      responseTime: []
    },
    strengths: {},
    weaknesses: {}
  };
  
  // Sort LLMs by different metrics
  const llms = Object.keys(summary.llmComparison);
  
  llmComparison.byMetric.diagnosisAccuracy = llms
    .sort((a, b) => summary.llmComparison[b].averageDiagnosisAccuracy - summary.llmComparison[a].averageDiagnosisAccuracy)
    .map(llm => ({
      llm,
      value: summary.llmComparison[llm].averageDiagnosisAccuracy
    }));
  
  llmComparison.byMetric.procedureAccuracy = llms
    .sort((a, b) => summary.llmComparison[b].averageProcedureAccuracy - summary.llmComparison[a].averageProcedureAccuracy)
    .map(llm => ({
      llm,
      value: summary.llmComparison[llm].averageProcedureAccuracy
    }));
  
  llmComparison.byMetric.keywordCount = llms
    .sort((a, b) => summary.llmComparison[b].averageKeywordCount - summary.llmComparison[a].averageKeywordCount)
    .map(llm => ({
      llm,
      value: summary.llmComparison[llm].averageKeywordCount
    }));
  
  llmComparison.byMetric.responseTime = llms
    .sort((a, b) => summary.llmComparison[a].averageResponseTime - summary.llmComparison[b].averageResponseTime)
    .map(llm => ({
      llm,
      value: summary.llmComparison[llm].averageResponseTime
    }));
  
  // Identify strengths and weaknesses for each LLM
  for (const llm of llms) {
    llmComparison.strengths[llm] = [];
    llmComparison.weaknesses[llm] = [];
    
    // Check diagnosis accuracy
    if (summary.llmComparison[llm].averageDiagnosisAccuracy > summary.accuracyAnalysis.diagnosis.average) {
      llmComparison.strengths[llm].push('Above average diagnosis accuracy');
    } else {
      llmComparison.weaknesses[llm].push('Below average diagnosis accuracy');
    }
    
    // Check procedure accuracy
    if (summary.llmComparison[llm].averageProcedureAccuracy > summary.accuracyAnalysis.procedure.average) {
      llmComparison.strengths[llm].push('Above average procedure accuracy');
    } else {
      llmComparison.weaknesses[llm].push('Below average procedure accuracy');
    }
    
    // Check keyword count
    if (summary.llmComparison[llm].averageKeywordCount > summary.keywordAnalysis.average) {
      llmComparison.strengths[llm].push('Above average keyword extraction');
    } else {
      llmComparison.weaknesses[llm].push('Below average keyword extraction');
    }
    
    // Check response time
    const avgResponseTime = summary.llmComparison[llm].averageResponseTime;
    const allResponseTimes = llms.map(l => summary.llmComparison[l].averageResponseTime);
    const avgAllResponseTimes = allResponseTimes.reduce((sum, time) => sum + time, 0) / allResponseTimes.length;
    
    if (avgResponseTime < avgAllResponseTimes) {
      llmComparison.strengths[llm].push('Faster than average response time');
    } else {
      llmComparison.weaknesses[llm].push('Slower than average response time');
    }
  }
  
  return llmComparison;
}

// Analyze test cases
function analyzeTestCases() {
  const testCaseAnalysis = {
    byAccuracy: {
      diagnosis: [],
      procedure: []
    },
    byKeywordCount: [],
    byResponseTime: [],
    mostChallenging: [],
    leastChallenging: []
  };
  
  const testCases = Object.keys(summary.testCaseComparison);
  
  // Sort test cases by diagnosis accuracy
  testCaseAnalysis.byAccuracy.diagnosis = testCases
    .sort((a, b) => summary.testCaseComparison[b].averageDiagnosisAccuracy - summary.testCaseComparison[a].averageDiagnosisAccuracy)
    .map(testCase => ({
      testCase,
      value: summary.testCaseComparison[testCase].averageDiagnosisAccuracy
    }));
  
  // Sort test cases by procedure accuracy
  testCaseAnalysis.byAccuracy.procedure = testCases
    .sort((a, b) => summary.testCaseComparison[b].averageProcedureAccuracy - summary.testCaseComparison[a].averageProcedureAccuracy)
    .map(testCase => ({
      testCase,
      value: summary.testCaseComparison[testCase].averageProcedureAccuracy
    }));
  
  // Sort test cases by keyword count
  testCaseAnalysis.byKeywordCount = testCases
    .sort((a, b) => summary.testCaseComparison[b].averageKeywordCount - summary.testCaseComparison[a].averageKeywordCount)
    .map(testCase => ({
      testCase,
      value: summary.testCaseComparison[testCase].averageKeywordCount
    }));
  
  // Sort test cases by response time
  testCaseAnalysis.byResponseTime = testCases
    .sort((a, b) => summary.testCaseComparison[a].averageResponseTime - summary.testCaseComparison[b].averageResponseTime)
    .map(testCase => ({
      testCase,
      value: summary.testCaseComparison[testCase].averageResponseTime
    }));
  
  // Identify most challenging test cases (lowest accuracy)
  testCaseAnalysis.mostChallenging = testCases
    .sort((a, b) => {
      const aScore = summary.testCaseComparison[a].averageDiagnosisAccuracy + summary.testCaseComparison[a].averageProcedureAccuracy;
      const bScore = summary.testCaseComparison[b].averageDiagnosisAccuracy + summary.testCaseComparison[b].averageProcedureAccuracy;
      return aScore - bScore;
    })
    .slice(0, 3)
    .map(testCase => ({
      testCase,
      diagnosisAccuracy: summary.testCaseComparison[testCase].averageDiagnosisAccuracy,
      procedureAccuracy: summary.testCaseComparison[testCase].averageProcedureAccuracy,
      keywordCount: summary.testCaseComparison[testCase].averageKeywordCount
    }));
  
  // Identify least challenging test cases (highest accuracy)
  testCaseAnalysis.leastChallenging = testCases
    .sort((a, b) => {
      const aScore = summary.testCaseComparison[a].averageDiagnosisAccuracy + summary.testCaseComparison[a].averageProcedureAccuracy;
      const bScore = summary.testCaseComparison[b].averageDiagnosisAccuracy + summary.testCaseComparison[b].averageProcedureAccuracy;
      return bScore - aScore;
    })
    .slice(0, 3)
    .map(testCase => ({
      testCase,
      diagnosisAccuracy: summary.testCaseComparison[testCase].averageDiagnosisAccuracy,
      procedureAccuracy: summary.testCaseComparison[testCase].averageProcedureAccuracy,
      keywordCount: summary.testCaseComparison[testCase].averageKeywordCount
    }));
  
  return testCaseAnalysis;
}

// Generate recommendations based on the analysis
function generateRecommendations() {
  const recommendations = {
    keywordExtraction: [],
    searchStrategy: [],
    llmSelection: [],
    testCaseFocus: []
  };
  
  // Analyze keyword correlation with accuracy
  const keywordAnalysis = analyzeKeywords();
  if (keywordAnalysis.correlationWithAccuracy.diagnosis > 0.5) {
    recommendations.keywordExtraction.push('Strong positive correlation between keyword count and diagnosis accuracy. Focus on improving keyword extraction.');
  }
  
  // Check if any LLM consistently extracts more keywords
  const llmsByKeywordCount = Object.entries(summary.llmComparison)
    .sort((a, b) => b[1].averageKeywordCount - a[1].averageKeywordCount);
  
  if (llmsByKeywordCount.length > 0 && llmsByKeywordCount[0][1].averageKeywordCount > summary.keywordAnalysis.average * 1.2) {
    recommendations.llmSelection.push(`${llmsByKeywordCount[0][0]} extracts significantly more keywords than average. Consider using its approach for keyword extraction.`);
  }
  
  // Check for challenging test cases
  const testCaseAnalysis = analyzeTestCases();
  if (testCaseAnalysis.mostChallenging.length > 0) {
    const challengingCases = testCaseAnalysis.mostChallenging.map(tc => tc.testCase).join(', ');
    recommendations.testCaseFocus.push(`Focus on improving accuracy for challenging cases: ${challengingCases}`);
  }
  
  // Check for missed rare disease codes
  const diagnosisAnalysis = analyzeDiagnoses();
  if (diagnosisAnalysis.topMissedCodes.length > 0) {
    const missedCodes = diagnosisAnalysis.topMissedCodes.map(c => c.code).join(', ');
    recommendations.searchStrategy.push(`Frequently missed diagnosis codes: ${missedCodes}. Consider enhancing search strategy to better detect these codes.`);
  }
  
  // General recommendations based on overall findings
  recommendations.keywordExtraction.push('Consider implementing n-gram analysis to extract multi-word medical terms');
  recommendations.searchStrategy.push('Implement a hybrid search approach that combines weighted search with fallback to more exhaustive search');
  recommendations.searchStrategy.push('Increase the result limit from 20 to a higher number for complex cases');
  
  return recommendations;
}

// Utility function to calculate correlation coefficient
function calculateCorrelation(x, y) {
  const n = x.length;
  if (n !== y.length || n === 0) return 0;
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}

// Generate the detailed report
const detailedReport = generateDetailedReport();

// Print key findings to console
console.log('\n=== Key Findings ===');
console.log(`Total tests: ${summary.totalTests}`);
console.log(`Average diagnosis accuracy: ${(summary.accuracyAnalysis.diagnosis.average * 100).toFixed(2)}%`);
console.log(`Average procedure accuracy: ${(summary.accuracyAnalysis.procedure.average * 100).toFixed(2)}%`);
console.log(`Average keyword count: ${summary.keywordAnalysis.average.toFixed(2)}`);

console.log('\n=== LLM Comparison ===');
for (const llm in summary.llmComparison) {
  console.log(`${llm}:`);
  console.log(`  Diagnosis accuracy: ${(summary.llmComparison[llm].averageDiagnosisAccuracy * 100).toFixed(2)}%`);
  console.log(`  Procedure accuracy: ${(summary.llmComparison[llm].averageProcedureAccuracy * 100).toFixed(2)}%`);
  console.log(`  Keyword count: ${summary.llmComparison[llm].averageKeywordCount.toFixed(2)}`);
}

console.log('\n=== Most Challenging Test Cases ===');
for (const testCase of detailedReport.testCaseAnalysis.mostChallenging) {
  console.log(`${testCase.testCase}:`);
  console.log(`  Diagnosis accuracy: ${(testCase.diagnosisAccuracy * 100).toFixed(2)}%`);
  console.log(`  Procedure accuracy: ${(testCase.procedureAccuracy * 100).toFixed(2)}%`);
  console.log(`  Keyword count: ${testCase.keywordCount.toFixed(2)}`);
}

console.log('\n=== Top Recommendations ===');
for (const category in detailedReport.recommendations) {
  if (detailedReport.recommendations[category].length > 0) {
    console.log(`\n${category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:`);
    detailedReport.recommendations[category].forEach(rec => {
      console.log(`- ${rec}`);
    });
  }
}

console.log('\nDetailed analysis saved to redis-test-results/detailed_analysis.json');