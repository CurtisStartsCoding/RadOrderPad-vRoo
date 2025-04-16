/**
 * Test script to verify the isPrimary flag handling in normalize-code-array.ts
 *
 * Note: This script tests the compiled JavaScript version of the TypeScript file.
 * Make sure the TypeScript files are compiled before running this script.
 */
const { normalizeCodeArray } = require('../dist/utils/response/normalizer/normalize-code-array');

console.log('Testing isPrimary flag handling in normalizeCodeArray function...\n');

// Test various isPrimary values
const testCases = [
  { input: [{ code: 'A', description: 'Test', isPrimary: true }], expected: true, desc: 'Boolean true' },
  { input: [{ code: 'B', description: 'Test', isPrimary: 1 }], expected: true, desc: 'Number 1' },
  { input: [{ code: 'C', description: 'Test', isPrimary: 'yes' }], expected: true, desc: 'String "yes"' },
  { input: [{ code: 'D', description: 'Test', isPrimary: false }], expected: false, desc: 'Boolean false' },
  { input: [{ code: 'E', description: 'Test', isPrimary: 0 }], expected: false, desc: 'Number 0' },
  { input: [{ code: 'F', description: 'Test', isPrimary: '' }], expected: false, desc: 'Empty string' },
  { input: [{ code: 'G', description: 'Test', isPrimary: null }], expected: false, desc: 'null' },
  { input: [{ code: 'H', description: 'Test', isPrimary: undefined }], expected: false, desc: 'undefined' }
];

// Run the tests
let passCount = 0;
let failCount = 0;

testCases.forEach(({ input, expected, desc }, index) => {
  const result = normalizeCodeArray(input);
  const actual = result[0].isPrimary;
  const passed = actual === expected;
  
  if (passed) {
    passCount++;
    console.log(`✅ Test ${index + 1} (${desc}): PASS (Expected: ${expected}, Got: ${actual})`);
  } else {
    failCount++;
    console.log(`❌ Test ${index + 1} (${desc}): FAIL (Expected: ${expected}, Got: ${actual})`);
  }
});

// Summary
console.log(`\nSummary: ${passCount} passed, ${failCount} failed`);
if (failCount === 0) {
  console.log('All tests passed! The isPrimary flag is being handled correctly.');
} else {
  console.log('Some tests failed. The isPrimary flag is not being handled correctly.');
}