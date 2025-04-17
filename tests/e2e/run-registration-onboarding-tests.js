/**
 * RadOrderPad Registration and Onboarding Test Runner
 * 
 * This script runs the comprehensive registration and onboarding test scenario (H)
 * to verify these specific workflows of the RadOrderPad system.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create test results directory if it doesn't exist
const resultsDir = path.join(__dirname, '../../test-results/e2e');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Log file setup
const logFile = path.join(resultsDir, 'registration-onboarding-test-results.log');
fs.writeFileSync(logFile, `RadOrderPad Registration and Onboarding Tests - ${new Date().toISOString()}\n\n`);

// Helper function to log messages
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(logFile, logMessage + '\n');
}

// Helper function to run a test scenario
function runScenario(scenarioName, scriptPath) {
  log(`\n=== Running Scenario: ${scenarioName} ===`);
  try {
    // Use require.resolve to get the absolute path and avoid issues with spaces
    const absolutePath = require.resolve(scriptPath);
    // Use process.execPath to get the path to the Node.js executable
    execSync(`"${process.execPath}" "${absolutePath}"`, {
      stdio: 'inherit',
      shell: true
    });
    log(`✅ Scenario ${scenarioName} completed successfully`);
    return true;
  } catch (error) {
    log(`❌ Scenario ${scenarioName} failed: ${error.message}`);
    return false;
  }
}

// Main test execution
async function runTests() {
  log('Starting RadOrderPad Registration and Onboarding Tests');
  
  // Define test scenarios - only scenario H
  const scenarios = [
    { name: 'H: Comprehensive Registration and Onboarding', script: path.join(__dirname, 'scenario-h-registration-onboarding.js') }
  ];
  
  // Run each scenario
  let passedCount = 0;
  for (const scenario of scenarios) {
    const passed = runScenario(scenario.name, scenario.script);
    if (passed) passedCount++;
  }
  
  // Log summary
  log(`\n=== Test Summary ===`);
  log(`Total scenarios: ${scenarios.length}`);
  log(`Passed: ${passedCount}`);
  log(`Failed: ${scenarios.length - passedCount}`);
  
  if (passedCount === scenarios.length) {
    log('🎉 All registration and onboarding tests passed!');
  } else {
    log('⚠️ Some tests failed. Check the logs for details.');
    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  log(`Error running tests: ${error.message}`);
  process.exit(1);
});