"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDatabaseContext = generateDatabaseContext;
const db_1 = require("../../config/db");
const keyword_categorizer_1 = require("./keyword-categorizer");
const context_formatter_1 = require("./context-formatter");
/**
 * Generate database context based on extracted keywords
 */
async function generateDatabaseContext(keywords) {
    if (keywords.length === 0) {
        return 'No specific medical context found in the input text.';
    }
    console.log('Generating database context with keywords:', keywords);
    // Categorize keywords for more targeted queries
    const categorizedKeywords = (0, keyword_categorizer_1.categorizeKeywords)(keywords);
    console.log('Categorized keywords:', categorizedKeywords);
    // Simple query to find relevant ICD-10 codes
    const icd10Query = `
    SELECT icd10_code, description, clinical_notes, imaging_modalities, primary_imaging
    FROM medical_icd10_codes
    WHERE ${keywords.map((_, index) => `description ILIKE $${index + 1} OR 
       clinical_notes ILIKE $${index + 1} OR 
       keywords ILIKE $${index + 1}`).join(' OR ')}
    LIMIT 10
  `;
    const icd10Params = keywords.map(keyword => `%${keyword}%`);
    console.log('ICD-10 query params:', icd10Params);
    const icd10Result = await (0, db_1.queryMainDb)(icd10Query, icd10Params);
    console.log(`Found ${icd10Result.rows.length} relevant ICD-10 codes`);
    // Simple query to find relevant CPT codes
    const cptQuery = `
    SELECT cpt_code, description, modality, body_part
    FROM medical_cpt_codes
    WHERE ${keywords.map((_, index) => `description ILIKE $${index + 1} OR 
       body_part ILIKE $${index + 1} OR 
       modality ILIKE $${index + 1}`).join(' OR ')}
    LIMIT 10
  `;
    const cptParams = keywords.map(keyword => `%${keyword}%`);
    console.log('CPT query params:', cptParams);
    const cptResult = await (0, db_1.queryMainDb)(cptQuery, cptParams);
    console.log(`Found ${cptResult.rows.length} relevant CPT codes`);
    // Simple query to find relevant mappings
    const mappingQuery = `
    SELECT m.id, m.icd10_code, i.description as icd10_description, 
           m.cpt_code, c.description as cpt_description, 
           m.appropriateness, m.evidence_source, m.refined_justification
    FROM medical_cpt_icd10_mappings m
    JOIN medical_icd10_codes i ON m.icd10_code = i.icd10_code
    JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
    WHERE ${keywords.map((_, index) => `i.description ILIKE $${index + 1} OR 
       c.description ILIKE $${index + 1} OR 
       c.body_part ILIKE $${index + 1} OR 
       c.modality ILIKE $${index + 1}`).join(' OR ')}
    LIMIT 10
  `;
    const mappingParams = keywords.map(keyword => `%${keyword}%`);
    console.log('Mapping query params:', mappingParams);
    const mappingResult = await (0, db_1.queryMainDb)(mappingQuery, mappingParams);
    console.log(`Found ${mappingResult.rows.length} relevant mappings`);
    // Simple query to find relevant markdown docs
    const markdownQuery = `
    SELECT md.id, md.icd10_code, i.description as icd10_description, 
           LEFT(md.content, 1000) as content_preview
    FROM medical_icd10_markdown_docs md
    JOIN medical_icd10_codes i ON md.icd10_code = i.icd10_code
    WHERE ${keywords.map((_, index) => `i.description ILIKE $${index + 1} OR 
       md.content ILIKE $${index + 1}`).join(' OR ')}
    LIMIT 5
  `;
    const markdownParams = keywords.map(keyword => `%${keyword}%`);
    console.log('Markdown query params:', markdownParams);
    const markdownResult = await (0, db_1.queryMainDb)(markdownQuery, markdownParams);
    console.log(`Found ${markdownResult.rows.length} relevant markdown docs`);
    return (0, context_formatter_1.formatDatabaseContext)(icd10Result.rows, cptResult.rows, mappingResult.rows, markdownResult.rows);
}
//# sourceMappingURL=context-generator.js.map