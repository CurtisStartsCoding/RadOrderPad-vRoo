import { queryMainDb } from '../config/db';

/**
 * Utility functions for generating database context for validation
 */

/**
 * Interface for prompt template from database
 */
export interface PromptTemplate {
  id: number;
  name: string;
  type: string;
  version: string;
  content_template: string;
  word_limit: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Get the active default prompt template from the database
 */
export async function getActivePromptTemplate(): Promise<PromptTemplate> {
  console.log("Looking for active default prompt template");
  
  const result = await queryMainDb(
    `SELECT * FROM prompt_templates
     WHERE type = 'default' AND active = true
     ORDER BY created_at DESC
     LIMIT 1`
  );
  
  console.log("Prompt template query result:", result.rows);
  
  if (result.rows.length === 0) {
    throw new Error('No active default prompt template found');
  }
  
  return result.rows[0] as PromptTemplate;
}

/**
 * Generate database context based on extracted keywords
 */
export async function generateDatabaseContext(keywords: string[]): Promise<string> {
  if (keywords.length === 0) {
    return 'No specific medical context found in the input text.';
  }
  
  console.log('Generating database context with keywords:', keywords);
  
  // Categorize keywords for more targeted queries
  const categorizedKeywords = categorizeKeywords(keywords);
  console.log('Categorized keywords:', categorizedKeywords);
  
  // Simple query to find relevant ICD-10 codes
  const icd10Query = `
    SELECT icd10_code, description, clinical_notes, imaging_modalities, primary_imaging
    FROM medical_icd10_codes
    WHERE ${keywords.map((_, index) => 
      `description ILIKE $${index + 1} OR 
       clinical_notes ILIKE $${index + 1} OR 
       keywords ILIKE $${index + 1}`
    ).join(' OR ')}
    LIMIT 10
  `;
  
  const icd10Params = keywords.map(keyword => `%${keyword}%`);
  console.log('ICD-10 query params:', icd10Params);
  const icd10Result = await queryMainDb(icd10Query, icd10Params);
  console.log(`Found ${icd10Result.rows.length} relevant ICD-10 codes`);
  
  // Simple query to find relevant CPT codes
  const cptQuery = `
    SELECT cpt_code, description, modality, body_part
    FROM medical_cpt_codes
    WHERE ${keywords.map((_, index) => 
      `description ILIKE $${index + 1} OR 
       body_part ILIKE $${index + 1} OR 
       modality ILIKE $${index + 1}`
    ).join(' OR ')}
    LIMIT 10
  `;
  
  const cptParams = keywords.map(keyword => `%${keyword}%`);
  console.log('CPT query params:', cptParams);
  const cptResult = await queryMainDb(cptQuery, cptParams);
  console.log(`Found ${cptResult.rows.length} relevant CPT codes`);
  
  // Simple query to find relevant mappings
  const mappingQuery = `
    SELECT m.id, m.icd10_code, i.description as icd10_description, 
           m.cpt_code, c.description as cpt_description, 
           m.appropriateness, m.evidence_source, m.refined_justification
    FROM medical_cpt_icd10_mappings m
    JOIN medical_icd10_codes i ON m.icd10_code = i.icd10_code
    JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
    WHERE ${keywords.map((_, index) => 
      `i.description ILIKE $${index + 1} OR 
       c.description ILIKE $${index + 1} OR 
       c.body_part ILIKE $${index + 1} OR 
       c.modality ILIKE $${index + 1}`
    ).join(' OR ')}
    LIMIT 10
  `;
  
  const mappingParams = keywords.map(keyword => `%${keyword}%`);
  console.log('Mapping query params:', mappingParams);
  const mappingResult = await queryMainDb(mappingQuery, mappingParams);
  console.log(`Found ${mappingResult.rows.length} relevant mappings`);
  
  // Simple query to find relevant markdown docs
  const markdownQuery = `
    SELECT md.id, md.icd10_code, i.description as icd10_description, 
           LEFT(md.content, 1000) as content_preview
    FROM medical_icd10_markdown_docs md
    JOIN medical_icd10_codes i ON md.icd10_code = i.icd10_code
    WHERE ${keywords.map((_, index) => 
      `i.description ILIKE $${index + 1} OR 
       md.content ILIKE $${index + 1}`
    ).join(' OR ')}
    LIMIT 5
  `;
  
  const markdownParams = keywords.map(keyword => `%${keyword}%`);
  console.log('Markdown query params:', markdownParams);
  const markdownResult = await queryMainDb(markdownQuery, markdownParams);
  console.log(`Found ${markdownResult.rows.length} relevant markdown docs`);
  
  return formatDatabaseContext(icd10Result.rows, cptResult.rows, mappingResult.rows, markdownResult.rows);
}

/**
 * Categorize keywords into different types for more targeted queries
 */
function categorizeKeywords(keywords: string[]): {
  anatomyTerms: string[];
  modalities: string[];
  symptoms: string[];
  codes: string[];
} {
  // Common anatomical terms
  const anatomyTermsList = [
    'head', 'neck', 'shoulder', 'arm', 'elbow', 'wrist', 'hand', 'finger', 
    'chest', 'thorax', 'abdomen', 'pelvis', 'hip', 'leg', 'knee', 'ankle', 'foot', 'toe',
    'brain', 'spine', 'cervical', 'thoracic', 'lumbar', 'sacral', 'skull',
    'liver', 'kidney', 'spleen', 'pancreas', 'gallbladder', 'bladder', 'uterus', 'ovary', 'prostate',
    'lung', 'heart', 'aorta', 'artery', 'vein'
  ];
  
  // Common modalities
  const modalitiesList = [
    'x-ray', 'xray', 'radiograph', 'ct', 'cat scan', 'computed tomography',
    'mri', 'magnetic resonance', 'ultrasound', 'sonogram', 'pet', 'nuclear',
    'angiogram', 'angiography', 'mammogram', 'mammography', 'dexa', 'bone density'
  ];
  
  // Categorize keywords
  const anatomyTerms: string[] = [];
  const modalities: string[] = [];
  const symptoms: string[] = [];
  const codes: string[] = [];
  
  keywords.forEach(keyword => {
    // Check if it's an ICD-10 or CPT code
    if (keyword.match(/^[A-Z]\d{2}(\.\d{1,2})?$/) || keyword.match(/^\d{5}$/)) {
      codes.push(keyword);
    }
    // Check if it's an anatomy term
    else if (anatomyTermsList.includes(keyword.toLowerCase())) {
      anatomyTerms.push(keyword);
    }
    // Check if it's a modality
    else if (modalitiesList.includes(keyword.toLowerCase())) {
      modalities.push(keyword);
    }
    // Otherwise, assume it's a symptom or condition
    else {
      symptoms.push(keyword);
    }
  });
  
  return {
    anatomyTerms,
    modalities,
    symptoms,
    codes
  };
}

/**
 * Format database context from query results
 */
function formatDatabaseContext(
  icd10Rows: any[], 
  cptRows: any[], 
  mappingRows: any[], 
  markdownRows: any[]
): string {
  // Construct the database context
  let context = '';
  
  // Add ICD-10 codes
  if (icd10Rows.length > 0) {
    context += '-- Relevant ICD-10 Codes --\n';
    icd10Rows.forEach(row => {
      context += `${row.icd10_code} - ${row.description}\n`;
      if (row.clinical_notes) context += `Clinical Notes: ${row.clinical_notes}\n`;
      if (row.imaging_modalities) context += `Recommended Imaging: ${row.imaging_modalities}\n`;
      if (row.primary_imaging) context += `Primary Imaging: ${row.primary_imaging}\n`;
      context += '\n';
    });
  }
  
  // Add CPT codes
  if (cptRows.length > 0) {
    context += '-- Relevant CPT Codes --\n';
    cptRows.forEach(row => {
      context += `${row.cpt_code} - ${row.description}\n`;
      if (row.modality) context += `Modality: ${row.modality}\n`;
      if (row.body_part) context += `Body Part: ${row.body_part}\n`;
      context += '\n';
    });
  }
  
  // Add mappings
  if (mappingRows.length > 0) {
    context += '-- Relevant ICD-10 to CPT Mappings --\n';
    mappingRows.forEach(row => {
      context += `ICD-10: ${row.icd10_code} (${row.icd10_description}) -> CPT: ${row.cpt_code} (${row.cpt_description})\n`;
      context += `Appropriateness Score: ${row.appropriateness}/9\n`;
      if (row.evidence_source) context += `Evidence Source: ${row.evidence_source}\n`;
      if (row.refined_justification) context += `Justification: ${row.refined_justification}\n`;
      context += '\n';
    });
  }
  
  // Add markdown docs
  if (markdownRows.length > 0) {
    context += '-- Additional Clinical Information --\n';
    markdownRows.forEach(row => {
      context += `ICD-10: ${row.icd10_code} (${row.icd10_description})\n`;
      context += `${row.content_preview}...\n\n`;
    });
  }
  
  if (context === '') {
    return 'No specific medical context found in the database for the input text.';
  }
  
  return context;
}

/**
 * Construct the prompt for the LLM
 */
export function constructPrompt(
  templateContent: string,
  sanitizedText: string,
  databaseContext: string,
  wordLimit: number | null | undefined,
  isOverrideValidation: boolean
): string {
  let prompt = templateContent;

  // Replace placeholders safely
  prompt = prompt.replace('{{DATABASE_CONTEXT}}', databaseContext || '');
  prompt = prompt.replace('{{DICTATION_TEXT}}', sanitizedText || '');
  prompt = prompt.replace('{{WORD_LIMIT}}', wordLimit != null ? wordLimit.toString() : '500'); // default to 500 if missing

  if (isOverrideValidation) {
    prompt += `

IMPORTANT: This is an OVERRIDE validation request. The physician has provided justification for why they believe this study is appropriate despite potential guidelines to the contrary. Please consider this justification carefully in your assessment.`;
  }

  return prompt;
}