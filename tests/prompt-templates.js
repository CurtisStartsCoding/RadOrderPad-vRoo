/**
 * Generic prompt templates for radiology order validation testing
 * These templates can be used to generate different test cases
 */

// Generic prompt templates that can be used to generate different test cases
const promptTemplates = [
  {
    id: 'missing_indication',
    description: 'Missing clinical indication',
    prompt: 'Generate a radiology order with patient age, gender, and requested modality, but DO NOT include any clinical indication or symptoms.',
    expectedResult: 'validation_failed',
    expectedFeedback: 'Missing clinical indication'
  },
  {
    id: 'contradictory_info',
    description: 'Contradictory information',
    prompt: 'Generate a radiology order with contradictory clinical information (e.g., symptoms both improving and worsening at the same time).',
    expectedResult: 'validation_failed',
    expectedFeedback: 'Contradictory clinical information'
  },
  {
    id: 'mismatched_study',
    description: 'Mismatched study and symptoms',
    prompt: 'Generate a radiology order where the requested imaging study is completely unrelated to the clinical symptoms (e.g., brain MRI for ankle pain).',
    expectedResult: 'validation_failed',
    expectedFeedback: 'Requested study does not match clinical indication'
  },
  {
    id: 'vague_symptoms',
    description: 'Vague symptoms',
    prompt: 'Generate a radiology order with vague symptoms that lack specificity (e.g., "pain" without location, duration, or severity).',
    expectedResult: 'needs_clarification',
    expectedFeedback: 'Need more specific information'
  },
  {
    id: 'missing_duration',
    description: 'Missing duration',
    prompt: 'Generate a radiology order that includes symptoms but omits the duration of those symptoms.',
    expectedResult: 'needs_clarification',
    expectedFeedback: 'Missing duration of symptoms'
  },
  {
    id: 'incomplete_history',
    description: 'Incomplete medical history',
    prompt: 'Generate a radiology order with incomplete medical history for a condition where history is important.',
    expectedResult: 'needs_clarification',
    expectedFeedback: 'Incomplete medical history'
  },
  {
    id: 'appropriate_neuro',
    description: 'Appropriate neurological case',
    prompt: 'Generate a radiology order for a brain MRI with clear, appropriate neurological symptoms and complete clinical information.',
    expectedResult: 'validated',
    expectedFeedback: ''
  },
  {
    id: 'appropriate_msk',
    description: 'Appropriate musculoskeletal case',
    prompt: 'Generate a radiology order for an MRI of a joint with appropriate symptoms, duration, and failed conservative treatment.',
    expectedResult: 'validated',
    expectedFeedback: ''
  },
  {
    id: 'multiple_studies',
    description: 'Multiple imaging studies',
    prompt: 'Generate a radiology order requesting multiple imaging studies for a complex clinical presentation.',
    expectedResult: 'needs_clarification',
    expectedFeedback: 'Consider prioritizing studies'
  },
  {
    id: 'wrong_wrong_wrong',
    description: 'Multiple validation failures',
    prompt: 'Generate a radiology order with multiple serious issues: missing key information, contradictory symptoms, and inappropriate study choice.',
    expectedResult: 'validation_failed',
    expectedFeedback: 'Multiple issues with order'
  }
];

// Function to select random prompts for testing
function selectRandomPrompts(count = 3) {
  const shuffled = [...promptTemplates].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

module.exports = {
  promptTemplates,
  selectRandomPrompts
};