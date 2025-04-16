# Normalization Audit Report

Generated on: 4/15/2025, 5:17:58 PM

## Summary

- Total files scanned: 371
- Total matches found: 1186

## Results by Pattern

### ICD-10 Code Field Names

- Files affected: 19
- Total matches: 87

#### Affected Files

- **src\controllers\order-management\handlers\finalize-order.ts** (2 matches)
  - Unique matches: `icd10_codes`, `icd10`
  - Sample context:
    ```
    36:       finalComplianceScore: rawPayload.finalComplianceScore || rawPayload.final_compliance_score,
37:       finalICD10Codes: rawPayload.finalICD10Codes || rawPayload.final_icd10_codes,
38:       finalICD10CodeDescriptions: rawPayload.finalICD10CodeDescriptions || rawPayload.final_icd10_code_descriptions,
    ```
    ```
    37:       finalICD10Codes: rawPayload.finalICD10Codes || rawPayload.final_icd10_codes,
38:       finalICD10CodeDescriptions: rawPayload.finalICD10CodeDescriptions || rawPayload.final_icd10_code_descriptions,
39:       finalCPTCode: rawPayload.finalCPTCode || rawPayload.final_cpt_code,
    ```
- **src\models\order\order-types.ts** (2 matches)
  - Unique matches: `icd10_codes`, `icd10`
  - Sample context:
    ```
    25:   final_cpt_code_description?: string;
26:   final_icd10_codes?: string;
27:   final_icd10_code_descriptions?: string;
    ```
    ```
    26:   final_icd10_codes?: string;
27:   final_icd10_code_descriptions?: string;
28:   is_contrast_indicated?: boolean;
    ```
- **src\models\order\validation-types.ts** (2 matches)
  - Unique matches: `icd10_codes`, `suggestedICD10Codes`
  - Sample context:
    ```
    19:   validation_outcome: string;
20:   generated_icd10_codes?: string;
21:   generated_cpt_codes?: string;
    ```
    ```
    36:   feedback: string;
37:   suggestedICD10Codes: Array<{ code: string; description: string }>;
38:   suggestedCPTCodes: Array<{ code: string; description: string }>;
    ```
- **src\services\order\finalize\update\update-order-with-final-data.ts** (2 matches)
  - Unique matches: `icd10_codes`, `icd10`
  - Sample context:
    ```
    27:     final_cpt_code_description = $5,
28:     final_icd10_codes = $6,
29:     final_icd10_code_descriptions = $7,
    ```
    ```
    28:     final_icd10_codes = $6,
29:     final_icd10_code_descriptions = $7,
30:     final_validation_status = $8,
    ```
- **src\services\order\radiology\export\csv-export\generate-csv-export.ts** (4 matches)
  - Unique matches: `icd10_codes`, `icd10`
  - Sample context:
    ```
    24:       cpt_description: order.final_cpt_code_description,
25:       icd10_codes: order.final_icd10_codes,
26:       icd10_descriptions: order.final_icd10_code_descriptions,
    ```
    ```
    25:       icd10_codes: order.final_icd10_codes,
26:       icd10_descriptions: order.final_icd10_code_descriptions,
27:       clinical_indication: order.clinical_indication,
    ```
- **src\services\order\validation\attempt-tracking\log-validation-attempt.ts** (2 matches)
  - Unique matches: `icd10_codes`, `suggestedICD10Codes`
  - Sample context:
    ```
    22:     (order_id, attempt_number, validation_input_text, validation_outcome, 
23:     generated_icd10_codes, generated_cpt_codes, generated_feedback_text, 
24:     generated_compliance_score, user_id, created_at) 
    ```
    ```
    30:       validationResult.validationStatus,
31:       JSON.stringify(validationResult.suggestedICD10Codes),
32:       JSON.stringify(validationResult.suggestedCPTCodes),
    ```
- **src\services\validation\logging.ts** (4 matches)
  - Unique matches: `icd10`, `suggestedICD10Codes`, `icd10_codes`
  - Sample context:
    ```
    34:     // Format ICD-10 and CPT codes for storage
35:     const icd10Codes = JSON.stringify(validationResult.suggestedICD10Codes.map(code => code.code));
36:     const cptCodes = JSON.stringify(validationResult.suggestedCPTCodes.map(code => code.code));
    ```
    ```
    44:         validation_outcome,
45:         generated_icd10_codes,
46:         generated_cpt_codes,
    ```
    ```
    56:         validationResult.validationStatus,
57:         icd10Codes,
58:         cptCodes,
    ```
- **src\utils\database\context-formatter.ts** (8 matches)
  - Unique matches: `icd10`
  - Sample context:
    ```
    6: export function formatDatabaseContext(
7:   icd10Rows: ICD10Row[], 
8:   cptRows: CPTRow[], 
    ```
    ```
    15:   // Add ICD-10 codes
16:   if (icd10Rows.length > 0) {
17:     context += '-- Relevant ICD-10 Codes --\n';
    ```
    ```
    17:     context += '-- Relevant ICD-10 Codes --\n';
18:     icd10Rows.forEach(row => {
19:       context += `${row.icd10_code} - ${row.description}\n`;
    ```
    ... and 3 more matches
- **src\utils\database\context-generator.ts** (22 matches)
  - Unique matches: `icd10`, `icd10_codes`
  - Sample context:
    ```
    20:   // Simple query to find relevant ICD-10 codes
21:   const icd10Query = `
22:     SELECT icd10_code, description, clinical_notes, imaging_modalities, primary_imaging
    ```
    ```
    21:   const icd10Query = `
22:     SELECT icd10_code, description, clinical_notes, imaging_modalities, primary_imaging
23:     FROM medical_icd10_codes
    ```
    ```
    22:     SELECT icd10_code, description, clinical_notes, imaging_modalities, primary_imaging
23:     FROM medical_icd10_codes
24:     WHERE ${keywords.map((_, index) => 
    ```
    ... and 11 more matches
- **src\utils\database\types.ts** (5 matches)
  - Unique matches: `icd10`
  - Sample context:
    ```
    29: export interface ICD10Row {
30:   icd10_code: string;
31:   description: string;
    ```
    ```
    51:   id: number;
52:   icd10_code: string;
53:   icd10_description: string;
    ```
    ```
    52:   icd10_code: string;
53:   icd10_description: string;
54:   cpt_code: string;
    ```
    ... and 2 more matches
- **src\utils\response\extractor.ts** (4 matches)
  - Unique matches: `icd10`
  - Sample context:
    ```
    21:   // Try to extract ICD-10 codes
22:   const icd10Matches = responseContent.match(/[A-Z]\d{2}(?:\.\d{1,2})?/g);
23:   if (icd10Matches) {
    ```
    ```
    22:   const icd10Matches = responseContent.match(/[A-Z]\d{2}(?:\.\d{1,2})?/g);
23:   if (icd10Matches) {
24:     result.icd10Codes = [...new Set(icd10Matches)].map(code => ({
    ```
    ```
    23:   if (icd10Matches) {
24:     result.icd10Codes = [...new Set(icd10Matches)].map(code => ({
25:       code,
    ```
- **src\utils\response\normalizer\normalize-response-fields.ts** (13 matches)
  - Unique matches: `suggestedICD10Codes`, `icd10codes`, `icd10_codes`, `icd10`, `icd_10_codes`
  - Sample context:
    ```
    25:     
26:     // suggestedICD10Codes variations
27:     'suggestedicd10codes': 'suggestedICD10Codes',
    ```
    ```
    26:     // suggestedICD10Codes variations
27:     'suggestedicd10codes': 'suggestedICD10Codes',
28:     'suggested_icd10_codes': 'suggestedICD10Codes',
    ```
    ```
    27:     'suggestedicd10codes': 'suggestedICD10Codes',
28:     'suggested_icd10_codes': 'suggestedICD10Codes',
29:     'icd10_codes': 'suggestedICD10Codes',
    ```
    ... and 4 more matches
- **src\utils\response\processor.ts** (4 matches)
  - Unique matches: `suggestedICD10Codes`, `icd10`
  - Sample context:
    ```
    49:     // Normalize ICD-10 and CPT code arrays
50:     const normalizedICD10Codes = normalizeCodeArray(normalizedResponse.suggestedICD10Codes);
51:     const normalizedCPTCodes = normalizeCodeArray(normalizedResponse.suggestedCPTCodes);
    ```
    ```
    57:       feedback: normalizedResponse.feedback,
58:       suggestedICD10Codes: normalizedICD10Codes,
59:       suggestedCPTCodes: normalizedCPTCodes,
    ```
    ```
    73:       feedback: extractedInfo.feedback || 'Unable to process the validation request. Please try again or contact support if the issue persists.',
74:       suggestedICD10Codes: extractedInfo.icd10Codes || [],
75:       suggestedCPTCodes: extractedInfo.cptCodes || [],
    ```
- **src\utils\response\types.ts** (2 matches)
  - Unique matches: `icd10`, `suggestedICD10Codes`
  - Sample context:
    ```
    8:   feedback?: string;
9:   icd10Codes?: Array<{ code: string; description: string }>;
10:   cptCodes?: Array<{ code: string; description: string }>;
    ```
    ```
    19:   feedback: string;
20:   suggestedICD10Codes: any;
21:   suggestedCPTCodes: any;
    ```
- **src\utils\response\validator\validate-required-fields.ts** (1 matches)
  - Unique matches: `suggestedICD10Codes`
  - Sample context:
    ```
    8:     'feedback',
9:     'suggestedICD10Codes',
10:     'suggestedCPTCodes'
    ```
- **src\utils\text-processing\code-extractor\common\extract-medical-codes.ts** (4 matches)
  - Unique matches: `icd10`
  - Sample context:
    ```
    1: import { extractICD10Codes } from '../icd10/extract-icd10-codes';
2: import { extractCPTCodes } from '../cpt/extract-cpt-codes';
    ```
    ```
    9: export function extractMedicalCodes(text: string): string[] {
10:   const icd10Codes = extractICD10Codes(text);
11:   const cptCodes = extractCPTCodes(text);
    ```
    ```
    12:   
13:   return [...icd10Codes, ...cptCodes];
14: }
    ```
- **src\utils\text-processing\code-extractor\common\is-medical-code.ts** (2 matches)
  - Unique matches: `icd10`
  - Sample context:
    ```
    7:   // Check for ICD-10 code pattern
8:   const icd10Pattern = /^[A-Z]\d{2}(?:\.\d{1,2})?$/;
9:   if (icd10Pattern.test(text)) {
    ```
    ```
    8:   const icd10Pattern = /^[A-Z]\d{2}(?:\.\d{1,2})?$/;
9:   if (icd10Pattern.test(text)) {
10:     return true;
    ```
- **src\utils\text-processing\code-extractor\icd10\extract-icd10-codes.ts** (2 matches)
  - Unique matches: `icd10`
  - Sample context:
    ```
    8:   // optionally followed by a period and 1-2 more digits
9:   const icd10Regex = /\b[A-Z]\d{2}(?:\.\d{1,2})?\b/g;
10:   const matches = text.match(icd10Regex);
    ```
    ```
    9:   const icd10Regex = /\b[A-Z]\d{2}(?:\.\d{1,2})?\b/g;
10:   const matches = text.match(icd10Regex);
11:   
    ```
- **src\utils\text-processing\code-extractor\index.ts** (2 matches)
  - Unique matches: `icd10`
  - Sample context:
    ```
    5: // Export ICD-10 related functions
6: export { extractICD10Codes } from './icd10/extract-icd10-codes';
7: 
    ```

### CPT Code Field Names

- Files affected: 21
- Total matches: 79

#### Affected Files

- **src\controllers\order-management\handlers\finalize-order.ts** (2 matches)
  - Unique matches: `cpt`
  - Sample context:
    ```
    38:       finalICD10CodeDescriptions: rawPayload.finalICD10CodeDescriptions || rawPayload.final_icd10_code_descriptions,
39:       finalCPTCode: rawPayload.finalCPTCode || rawPayload.final_cpt_code,
40:       finalCPTCodeDescription: rawPayload.finalCPTCodeDescription || rawPayload.final_cpt_code_description,
    ```
    ```
    39:       finalCPTCode: rawPayload.finalCPTCode || rawPayload.final_cpt_code,
40:       finalCPTCodeDescription: rawPayload.finalCPTCodeDescription || rawPayload.final_cpt_code_description,
41:       clinicalIndication: rawPayload.clinicalIndication || rawPayload.clinical_indication || rawPayload.dictationText || rawPayload.dictation_text,
    ```
- **src\controllers\order-management\validation\validate-finalize-payload.ts** (2 matches)
  - Unique matches: `cpt`
  - Sample context:
    ```
    15:   const finalValidationStatus = rawPayload.finalValidationStatus || rawPayload.final_validation_status;
16:   const finalCPTCode = rawPayload.finalCPTCode || rawPayload.final_cpt_code;
17:   const clinicalIndication = rawPayload.clinicalIndication || rawPayload.clinical_indication ||
    ```
    ```
    22:     res.status(400).json({
23:       message: 'Required fields missing: finalValidationStatus/final_validation_status, finalCPTCode/final_cpt_code, clinicalIndication/clinical_indication'
24:     });
    ```
- **src\models\order\order-types.ts** (2 matches)
  - Unique matches: `cpt`
  - Sample context:
    ```
    23:   laterality?: string;
24:   final_cpt_code?: string;
25:   final_cpt_code_description?: string;
    ```
    ```
    24:   final_cpt_code?: string;
25:   final_cpt_code_description?: string;
26:   final_icd10_codes?: string;
    ```
- **src\models\order\validation-types.ts** (2 matches)
  - Unique matches: `cpt_codes`, `suggestedCPTCodes`
  - Sample context:
    ```
    20:   generated_icd10_codes?: string;
21:   generated_cpt_codes?: string;
22:   generated_feedback_text?: string;
    ```
    ```
    37:   suggestedICD10Codes: Array<{ code: string; description: string }>;
38:   suggestedCPTCodes: Array<{ code: string; description: string }>;
39:   internalReasoning: string;
    ```
- **src\services\order\finalize\update\update-order-with-final-data.ts** (2 matches)
  - Unique matches: `cpt`
  - Sample context:
    ```
    25:     clinical_indication = $3,
26:     final_cpt_code = $4,
27:     final_cpt_code_description = $5,
    ```
    ```
    26:     final_cpt_code = $4,
27:     final_cpt_code_description = $5,
28:     final_icd10_codes = $6,
    ```
- **src\services\order\radiology\export\csv-export\generate-csv-export.ts** (4 matches)
  - Unique matches: `cpt`
  - Sample context:
    ```
    22:       laterality: order.laterality,
23:       cpt_code: order.final_cpt_code,
24:       cpt_description: order.final_cpt_code_description,
    ```
    ```
    23:       cpt_code: order.final_cpt_code,
24:       cpt_description: order.final_cpt_code_description,
25:       icd10_codes: order.final_icd10_codes,
    ```
- **src\services\order\radiology\query\order-builder\base-query.ts** (2 matches)
  - Unique matches: `cpt`
  - Sample context:
    ```
    14:     SELECT o.id, o.order_number, o.status, o.priority, o.modality, o.body_part, 
15:            o.final_cpt_code, o.final_cpt_code_description, o.final_validation_status,
16:            o.created_at, o.updated_at, o.patient_name, o.patient_dob, o.patient_gender,
    ```
- **src\services\order\validation\attempt-tracking\log-validation-attempt.ts** (2 matches)
  - Unique matches: `cpt_codes`, `suggestedCPTCodes`
  - Sample context:
    ```
    22:     (order_id, attempt_number, validation_input_text, validation_outcome, 
23:     generated_icd10_codes, generated_cpt_codes, generated_feedback_text, 
24:     generated_compliance_score, user_id, created_at) 
    ```
    ```
    31:       JSON.stringify(validationResult.suggestedICD10Codes),
32:       JSON.stringify(validationResult.suggestedCPTCodes),
33:       validationResult.feedback,
    ```
- **src\services\validation\logging.ts** (4 matches)
  - Unique matches: `cpt`, `suggestedCPTCodes`, `cpt_codes`
  - Sample context:
    ```
    35:     const icd10Codes = JSON.stringify(validationResult.suggestedICD10Codes.map(code => code.code));
36:     const cptCodes = JSON.stringify(validationResult.suggestedCPTCodes.map(code => code.code));
37:     
    ```
    ```
    45:         generated_icd10_codes,
46:         generated_cpt_codes,
47:         generated_feedback_text,
    ```
    ```
    57:         icd10Codes,
58:         cptCodes,
59:         validationResult.feedback,
    ```
- **src\utils\database\context-formatter.ts** (6 matches)
  - Unique matches: `cpt`
  - Sample context:
    ```
    7:   icd10Rows: ICD10Row[], 
8:   cptRows: CPTRow[], 
9:   mappingRows: MappingRow[], 
    ```
    ```
    27:   // Add CPT codes
28:   if (cptRows.length > 0) {
29:     context += '-- Relevant CPT Codes --\n';
    ```
    ```
    29:     context += '-- Relevant CPT Codes --\n';
30:     cptRows.forEach(row => {
31:       context += `${row.cpt_code} - ${row.description}\n`;
    ```
    ... and 2 more matches
- **src\utils\database\context-generator.ts** (16 matches)
  - Unique matches: `cpt`, `cpt_codes`
  - Sample context:
    ```
    37:   // Simple query to find relevant CPT codes
38:   const cptQuery = `
39:     SELECT cpt_code, description, modality, body_part
    ```
    ```
    38:   const cptQuery = `
39:     SELECT cpt_code, description, modality, body_part
40:     FROM medical_cpt_codes
    ```
    ```
    39:     SELECT cpt_code, description, modality, body_part
40:     FROM medical_cpt_codes
41:     WHERE ${keywords.map((_, index) => 
    ```
    ... and 8 more matches
- **src\utils\database\types.ts** (3 matches)
  - Unique matches: `cpt`
  - Sample context:
    ```
    40: export interface CPTRow {
41:   cpt_code: string;
42:   description: string;
    ```
    ```
    53:   icd10_description: string;
54:   cpt_code: string;
55:   cpt_description: string;
    ```
    ```
    54:   cpt_code: string;
55:   cpt_description: string;
56:   appropriateness: number;
    ```
- **src\utils\response\extractor.ts** (4 matches)
  - Unique matches: `cpt`
  - Sample context:
    ```
    30:   // Try to extract CPT codes
31:   const cptMatches = responseContent.match(/\b\d{5}\b/g);
32:   if (cptMatches) {
    ```
    ```
    31:   const cptMatches = responseContent.match(/\b\d{5}\b/g);
32:   if (cptMatches) {
33:     // Filter to likely CPT codes (starting with 7 for radiology)
    ```
    ```
    33:     // Filter to likely CPT codes (starting with 7 for radiology)
34:     const likelyCptCodes = cptMatches.filter(code => code.startsWith('7'));
35:     if (likelyCptCodes.length > 0) {
    ```
    ... and 1 more matches
- **src\utils\response\normalizer\normalize-response-fields.ts** (11 matches)
  - Unique matches: `suggestedCPTCodes`, `cptcodes`, `cpt_codes`, `cpt`
  - Sample context:
    ```
    33:     
34:     // suggestedCPTCodes variations
35:     'suggestedcptcodes': 'suggestedCPTCodes',
    ```
    ```
    34:     // suggestedCPTCodes variations
35:     'suggestedcptcodes': 'suggestedCPTCodes',
36:     'suggested_cpt_codes': 'suggestedCPTCodes',
    ```
    ```
    35:     'suggestedcptcodes': 'suggestedCPTCodes',
36:     'suggested_cpt_codes': 'suggestedCPTCodes',
37:     'cpt_codes': 'suggestedCPTCodes',
    ```
    ... and 3 more matches
- **src\utils\response\processor.ts** (4 matches)
  - Unique matches: `suggestedCPTCodes`, `cpt`
  - Sample context:
    ```
    50:     const normalizedICD10Codes = normalizeCodeArray(normalizedResponse.suggestedICD10Codes);
51:     const normalizedCPTCodes = normalizeCodeArray(normalizedResponse.suggestedCPTCodes);
52:     
    ```
    ```
    58:       suggestedICD10Codes: normalizedICD10Codes,
59:       suggestedCPTCodes: normalizedCPTCodes,
60:       internalReasoning: normalizedResponse.internalReasoning || 'No internal reasoning provided'
    ```
    ```
    74:       suggestedICD10Codes: extractedInfo.icd10Codes || [],
75:       suggestedCPTCodes: extractedInfo.cptCodes || [],
76:       internalReasoning: `Error processing LLM response: ${error instanceof Error ? error.message : 'Unknown error'}`
    ```
- **src\utils\response\types.ts** (2 matches)
  - Unique matches: `cpt`, `suggestedCPTCodes`
  - Sample context:
    ```
    9:   icd10Codes?: Array<{ code: string; description: string }>;
10:   cptCodes?: Array<{ code: string; description: string }>;
11: }
    ```
    ```
    20:   suggestedICD10Codes: any;
21:   suggestedCPTCodes: any;
22:   internalReasoning?: string;
    ```
- **src\utils\response\validator\validate-required-fields.ts** (1 matches)
  - Unique matches: `suggestedCPTCodes`
  - Sample context:
    ```
    9:     'suggestedICD10Codes',
10:     'suggestedCPTCodes'
11:   ];
    ```
- **src\utils\text-processing\code-extractor\common\extract-medical-codes.ts** (4 matches)
  - Unique matches: `cpt`
  - Sample context:
    ```
    1: import { extractICD10Codes } from '../icd10/extract-icd10-codes';
2: import { extractCPTCodes } from '../cpt/extract-cpt-codes';
3: 
    ```
    ```
    10:   const icd10Codes = extractICD10Codes(text);
11:   const cptCodes = extractCPTCodes(text);
12:   
    ```
    ```
    12:   
13:   return [...icd10Codes, ...cptCodes];
14: }
    ```
- **src\utils\text-processing\code-extractor\common\is-medical-code.ts** (2 matches)
  - Unique matches: `cpt`
  - Sample context:
    ```
    13:   // Check for CPT code pattern (with heuristic)
14:   const cptPattern = /^\d{5}$/;
15:   if (cptPattern.test(text) && (text.startsWith('7') || text.startsWith('9'))) {
    ```
    ```
    14:   const cptPattern = /^\d{5}$/;
15:   if (cptPattern.test(text) && (text.startsWith('7') || text.startsWith('9'))) {
16:     return true;
    ```
- **src\utils\text-processing\code-extractor\cpt\extract-cpt-codes.ts** (2 matches)
  - Unique matches: `cpt`
  - Sample context:
    ```
    7:   // CPT codes are 5-digit numbers
8:   const cptRegex = /\b\d{5}\b/g;
9:   const matches = text.match(cptRegex);
    ```
    ```
    8:   const cptRegex = /\b\d{5}\b/g;
9:   const matches = text.match(cptRegex);
10:   
    ```
- **src\utils\text-processing\code-extractor\index.ts** (2 matches)
  - Unique matches: `cpt`
  - Sample context:
    ```
    8: // Export CPT related functions
9: export { extractCPTCodes } from './cpt/extract-cpt-codes';
10: 
    ```

### Validation Status Field Names

- Files affected: 140
- Total matches: 445

#### Affected Files

- **src\controllers\admin-order\paste-summary.controller.ts** (4 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    13:     if (isNaN(orderId)) {
14:       res.status(400).json({ message: 'Invalid order ID' });
15:       return;
    ```
    ```
    20:     if (!pastedText) {
21:       res.status(400).json({ message: 'Pasted text is required' });
22:       return;
    ```
    ```
    28:     if (!userId) {
29:       res.status(401).json({ message: 'User authentication required' });
30:       return;
    ```
    ... and 1 more matches
- **src\controllers\admin-order\paste-supplemental.controller.ts** (4 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    13:     if (isNaN(orderId)) {
14:       res.status(400).json({ message: 'Invalid order ID' });
15:       return;
    ```
    ```
    20:     if (!pastedText) {
21:       res.status(400).json({ message: 'Pasted text is required' });
22:       return;
    ```
    ```
    28:     if (!userId) {
29:       res.status(401).json({ message: 'User authentication required' });
30:       return;
    ```
    ... and 1 more matches
- **src\controllers\admin-order\send-to-radiology.controller.ts** (3 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    13:     if (isNaN(orderId)) {
14:       res.status(400).json({ message: 'Invalid order ID' });
15:       return;
    ```
    ```
    21:     if (!userId) {
22:       res.status(401).json({ message: 'User authentication required' });
23:       return;
    ```
    ```
    28:     
29:     res.status(200).json(result);
30:   } catch (error) {
    ```
- **src\controllers\admin-order\types.ts** (5 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    26:     if (error.message.includes('not found')) {
27:       res.status(404).json({ message: error.message });
28:     } else if (error.message.includes('Unauthorized')) {
    ```
    ```
    28:     } else if (error.message.includes('Unauthorized')) {
29:       res.status(403).json({ message: error.message });
30:     } else if (error.message.includes('missing')) {
    ```
    ```
    30:     } else if (error.message.includes('missing')) {
31:       res.status(400).json({ message: error.message });
32:     } else {
    ```
    ... and 2 more matches
- **src\controllers\admin-order\update-insurance.controller.ts** (4 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    13:     if (isNaN(orderId)) {
14:       res.status(400).json({ message: 'Invalid order ID' });
15:       return;
    ```
    ```
    20:     if (!insuranceData) {
21:       res.status(400).json({ message: 'Insurance data is required' });
22:       return;
    ```
    ```
    28:     if (!userId) {
29:       res.status(401).json({ message: 'User authentication required' });
30:       return;
    ```
    ... and 1 more matches
- **src\controllers\admin-order\update-patient.controller.ts** (4 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    13:     if (isNaN(orderId)) {
14:       res.status(400).json({ message: 'Invalid order ID' });
15:       return;
    ```
    ```
    20:     if (!patientData) {
21:       res.status(400).json({ message: 'Patient data is required' });
22:       return;
    ```
    ```
    28:     if (!userId) {
29:       res.status(401).json({ message: 'User authentication required' });
30:       return;
    ```
    ... and 1 more matches
- **src\controllers\auth\error-handler.ts** (5 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    11:  * @param operation Name of the operation (for logging)
12:  * @param errorMap Map of error messages to HTTP status codes
13:  * @param defaultMessage Default error message
    ```
    ```
    25:     // Check if the error message is in the error map
26:     for (const [message, statusCode] of Object.entries(errorMap)) {
27:       if (error.message === message || error.message.includes(message)) {
    ```
    ```
    27:       if (error.message === message || error.message.includes(message)) {
28:         res.status(statusCode).json({ message: error.message });
29:         return;
    ```
    ... and 1 more matches
- **src\controllers\auth\login.controller.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    18:       if (!email || !password) {
19:         res.status(400).json({ message: 'Email and password are required' });
20:         return;
    ```
    ```
    29:       
30:       res.status(200).json(result);
31:     } catch (error) {
    ```
- **src\controllers\auth\register.controller.ts** (4 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    18:       if (!organization || !user) {
19:         res.status(400).json({ message: 'Organization and user data are required' });
20:         return;
    ```
    ```
    24:       if (!organization.name || !organization.type) {
25:         res.status(400).json({ message: 'Organization name and type are required' });
26:         return;
    ```
    ```
    29:       if (!user.email || !user.password || !user.first_name || !user.last_name || !user.role) {
30:         res.status(400).json({ message: 'User email, password, first name, last name, and role are required' });
31:         return;
    ```
    ... and 1 more matches
- **src\controllers\billing\create-checkout-session.ts** (3 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    16:     if (!orgId) {
17:       return res.status(401).json({
18:         success: false,
    ```
    ```
    28: 
29:     return res.status(200).json({
30:       success: true,
    ```
    ```
    34:     console.error('Error creating checkout session:', error);
35:     return res.status(500).json({
36:       success: false,
    ```
- **src\controllers\billing\create-subscription.ts** (5 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    16:     if (!orgId) {
17:       return res.status(401).json({
18:         success: false,
    ```
    ```
    26:     if (!priceId) {
27:       return res.status(400).json({
28:         success: false,
    ```
    ```
    47:     if (allowedPriceIds.length > 0 && !allowedPriceIds.includes(priceId)) {
48:       return res.status(400).json({
49:         success: false,
    ```
    ... and 2 more matches
- **src\controllers\connection\approve.controller.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    34:       // Return response
35:       res.status(200).json(result);
36:     } catch (error) {
    ```
    ```
    40:            error.message.includes('not authorized'))) {
41:         res.status(404).json({ message: error.message });
42:       } else {
    ```
- **src\controllers\connection\auth-utils.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    10:   if (!req.user) {
11:     res.status(401).json({ message: 'User not authenticated' });
12:     return null;
    ```
- **src\controllers\connection\error-utils.ts** (3 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    14:     if (error.message.includes('not found') || error.message.includes('not authorized')) {
15:       res.status(404).json({ message: error.message });
16:       return;
    ```
    ```
    21:     // Default error response
22:     res.status(500).json({ 
23:       message: `Failed to ${controllerName.toLowerCase()}`, 
    ```
    ```
    27:     // Handle unknown errors
28:     res.status(500).json({ 
29:       message: `Failed to ${controllerName.toLowerCase()}`, 
    ```
- **src\controllers\connection\list\list-connections.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    20:     // Return response
21:     res.status(200).json({ connections });
22:   } catch (error) {
    ```
- **src\controllers\connection\list\list-incoming-requests.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    20:     // Return response
21:     res.status(200).json({ requests });
22:   } catch (error) {
    ```
- **src\controllers\connection\reject.controller.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    34:       // Return response
35:       res.status(200).json(result);
36:     } catch (error) {
    ```
    ```
    40:            error.message.includes('not authorized'))) {
41:         res.status(404).json({ message: error.message });
42:       } else {
    ```
- **src\controllers\connection\request.controller.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    38:     if (result.success) {
39:       res.status(201).json(result);
40:     } else {
    ```
    ```
    40:     } else {
41:       res.status(400).json(result);
42:     }
    ```
- **src\controllers\connection\terminate.controller.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    34:       // Return response
35:       res.status(200).json(result);
36:     } catch (error) {
    ```
    ```
    40:            error.message.includes('not authorized'))) {
41:         res.status(404).json({ message: error.message });
42:       } else {
    ```
- **src\controllers\connection\validation-utils\validate-relationship-id.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    12:   if (isNaN(relationshipId)) {
13:     res.status(400).json({ message: 'Invalid relationship ID' });
14:     return null;
    ```
- **src\controllers\connection\validation-utils\validate-target-org-id.ts** (3 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    13:   if (!targetOrgId) {
14:     res.status(400).json({ message: 'Target organization ID is required' });
15:     return null;
    ```
    ```
    20:   if (isNaN(targetOrgIdNum)) {
21:     res.status(400).json({ message: 'Target organization ID must be a number' });
22:     return null;
    ```
    ```
    26:   if (targetOrgIdNum === initiatingOrgId) {
27:     res.status(400).json({ message: 'Cannot request a connection to your own organization' });
28:     return null;
    ```
- **src\controllers\location\organization\create-location.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    29:     if (!locationData.name) {
30:       res.status(400).json({ message: 'Location name is required' });
31:       return;
    ```
    ```
    35:     
36:     res.status(201).json({ 
37:       message: 'Location created successfully', 
    ```
- **src\controllers\location\organization\deactivate-location.ts** (3 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    37:       if (success) {
38:         res.status(200).json({ 
39:           message: 'Location deactivated successfully',
    ```
    ```
    42:       } else {
43:         res.status(404).json({ message: 'Location not found or already deactivated' });
44:       }
    ```
    ```
    47:       if ((error as Error).message.includes('not found or not authorized')) {
48:         res.status(404).json({ message: (error as Error).message });
49:       } else {
    ```
- **src\controllers\location\organization\get-location.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    35:       const location = await locationService.getLocation(locationId, orgId);
36:       res.status(200).json({ location });
37:     } catch (error) {
    ```
    ```
    39:       if ((error as Error).message.includes('not found or not authorized')) {
40:         res.status(404).json({ message: (error as Error).message });
41:       } else {
    ```
- **src\controllers\location\organization\list-locations.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    27:     
28:     res.status(200).json({ locations });
29:   } catch (error) {
    ```
- **src\controllers\location\organization\update-location.ts** (3 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    36:     if (!locationData.name) {
37:       res.status(400).json({ message: 'Location name is required' });
38:       return;
    ```
    ```
    42:       const location = await locationService.updateLocation(locationId, orgId, locationData);
43:       res.status(200).json({ 
44:         message: 'Location updated successfully', 
    ```
    ```
    49:       if ((error as Error).message.includes('not found or not authorized')) {
50:         res.status(404).json({ message: (error as Error).message });
51:       } else {
    ```
- **src\controllers\location\types.ts** (5 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    27:   console.error(`Error in ${message}:`, error);
28:   res.status(500).json({ message, error: (error as Error).message });
29: }
    ```
    ```
    38:   if (!req.user) {
39:     res.status(401).json({ message: 'User not authenticated' });
40:     return false;
    ```
    ```
    54:   if (isNaN(locationId)) {
55:     res.status(400).json({ message: 'Invalid location ID' });
56:     return false;
    ```
    ... and 2 more matches
- **src\controllers\location\user\assign-user-to-location.ts** (3 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    38:       if (success) {
39:         res.status(200).json({ 
40:           message: 'User assigned to location successfully',
    ```
    ```
    44:       } else {
45:         res.status(500).json({ message: 'Failed to assign user to location' });
46:       }
    ```
    ```
    49:       if ((error as Error).message.includes('not found or not authorized')) {
50:         res.status(404).json({ message: (error as Error).message });
51:       } else {
    ```
- **src\controllers\location\user\list-user-locations.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    35:       const locations = await locationService.listUserLocations(userId, orgId);
36:       res.status(200).json({ locations });
37:     } catch (error) {
    ```
    ```
    39:       if ((error as Error).message.includes('not found or not authorized')) {
40:         res.status(404).json({ message: (error as Error).message });
41:       } else {
    ```
- **src\controllers\location\user\unassign-user-from-location.ts** (3 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    38:       if (success) {
39:         res.status(200).json({ 
40:           message: 'User unassigned from location successfully',
    ```
    ```
    44:       } else {
45:         res.status(404).json({ message: 'User-location assignment not found' });
46:       }
    ```
    ```
    49:       if ((error as Error).message.includes('not found or not authorized')) {
50:         res.status(404).json({ message: (error as Error).message });
51:       } else {
    ```
- **src\controllers\order-management\error-handling\handle-controller-error.ts** (4 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    14:     if (error.message.includes('not found')) {
15:       res.status(404).json({ message: error.message });
16:     } else if (error.message.includes('Unauthorized')) {
    ```
    ```
    16:     } else if (error.message.includes('Unauthorized')) {
17:       res.status(403).json({ message: error.message });
18:     } else {
    ```
    ```
    18:     } else {
19:       res.status(500).json({ message: error.message });
20:     }
    ```
    ... and 1 more matches
- **src\controllers\order-management\handlers\admin-update.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    28:     if (!additionalInformation && (!attachments || attachments.length === 0)) {
29:       res.status(400).json({ message: 'Additional information or attachments are required' });
30:       return;
    ```
    ```
    73:     // Return success response
74:     res.status(200).json({ 
75:       success: true, 
    ```
- **src\controllers\order-management\handlers\finalize-order.ts** (2 matches)
  - Unique matches: `validation_status`, `status`
  - Sample context:
    ```
    34:     const payload: FinalizeOrderPayload = {
35:       finalValidationStatus: rawPayload.finalValidationStatus || rawPayload.final_validation_status,
36:       finalComplianceScore: rawPayload.finalComplianceScore || rawPayload.final_compliance_score,
    ```
    ```
    77:     
78:     res.status(200).json(result);
79:   } catch (error) {
    ```
- **src\controllers\order-management\handlers\get-order.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    28:     
29:     res.status(200).json(order);
30:   } catch (error) {
    ```
- **src\controllers\order-management\validation\validate-finalize-payload.ts** (7 matches)
  - Unique matches: `validation_status`, `status`
  - Sample context:
    ```
    14:   // Check for required fields in both camelCase and snake_case formats
15:   const finalValidationStatus = rawPayload.finalValidationStatus || rawPayload.final_validation_status;
16:   const finalCPTCode = rawPayload.finalCPTCode || rawPayload.final_cpt_code;
    ```
    ```
    21:   if (!finalValidationStatus || !finalCPTCode || !clinicalIndication) {
22:     res.status(400).json({
23:       message: 'Required fields missing: finalValidationStatus/final_validation_status, finalCPTCode/final_cpt_code, clinicalIndication/clinical_indication'
    ```
    ```
    22:     res.status(400).json({
23:       message: 'Required fields missing: finalValidationStatus/final_validation_status, finalCPTCode/final_cpt_code, clinicalIndication/clinical_indication'
24:     });
    ```
    ... and 4 more matches
- **src\controllers\order-management\validation\validate-order-id.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    12:   if (isNaN(orderId)) {
13:     res.status(400).json({ message: 'Invalid order ID' });
14:     return false;
    ```
- **src\controllers\order-management\validation\validate-user-auth.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    12:   if (!userId) {
13:     res.status(401).json({ message: 'User authentication required' });
14:     return undefined;
    ```
- **src\controllers\order-validation.controller.ts** (10 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    17:       if (!dictationText) {
18:         res.status(400).json({ message: 'Dictation text is required' });
19:         return;
    ```
    ```
    26:       if (!userId || !orgId) {
27:         res.status(401).json({ message: 'User authentication required' });
28:         return;
    ```
    ```
    41:       
42:       res.status(200).json(result);
43:     } catch (error) {
    ```
    ... and 6 more matches
- **src\controllers\radiology\export-order.controller.ts** (8 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    13:     if (isNaN(orderId)) {
14:       res.status(400).json({ message: 'Invalid order ID' });
15:       return;
    ```
    ```
    20:     if (!validFormats.includes(format)) {
21:       res.status(400).json({ message: `Invalid format. Supported formats: ${validFormats.join(', ')}` });
22:       return;
    ```
    ```
    28:     if (!orgId) {
29:       res.status(401).json({ message: 'User authentication required' });
30:       return;
    ```
    ... and 5 more matches
- **src\controllers\radiology\incoming-orders.controller.ts** (8 matches)
  - Unique matches: `status`, `validationStatus`
  - Sample context:
    ```
    14:     if (!orgId) {
15:       res.status(401).json({ message: 'User authentication required' });
16:       return;
    ```
    ```
    45:     
46:     // Validation status filter
47:     if (req.query.validationStatus) {
    ```
    ```
    46:     // Validation status filter
47:     if (req.query.validationStatus) {
48:       filters.validationStatus = req.query.validationStatus as string;
    ```
    ... and 4 more matches
- **src\controllers\radiology\index.ts** (3 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    4: import exportOrder from './export-order.controller';
5: import updateOrderStatus from './update-status.controller';
6: import requestInformation from './request-information.controller';
    ```
    ```
    37:   /**
38:    * Update order status
39:    * @route POST /api/radiology/orders/:orderId/update-status
    ```
    ```
    38:    * Update order status
39:    * @route POST /api/radiology/orders/:orderId/update-status
40:    */
    ```
- **src\controllers\radiology\order-details.controller.ts** (7 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    12:     if (isNaN(orderId)) {
13:       res.status(400).json({ message: 'Invalid order ID' });
14:       return;
    ```
    ```
    20:     if (!orgId) {
21:       res.status(401).json({ message: 'User authentication required' });
22:       return;
    ```
    ```
    27:     
28:     res.status(200).json(result);
29:   } catch (error) {
    ```
    ... and 4 more matches
- **src\controllers\radiology\request-information.controller.ts** (8 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    12:     if (isNaN(orderId)) {
13:       res.status(400).json({ message: 'Invalid order ID' });
14:       return;
    ```
    ```
    19:     if (!requestedInfoType || !requestedInfoDetails) {
20:       res.status(400).json({ message: 'Requested info type and details are required' });
21:       return;
    ```
    ```
    28:     if (!userId || !orgId) {
29:       res.status(401).json({ message: 'User authentication required' });
30:       return;
    ```
    ... and 5 more matches
- **src\controllers\radiology\types.ts** (2 matches)
  - Unique matches: `status`, `validationStatus`
  - Sample context:
    ```
    6: export interface OrderFilters {
7:   status?: string;
8:   referringOrgId?: number;
    ```
    ```
    12:   endDate?: Date;
13:   validationStatus?: string;
14:   sortBy?: string;
    ```
- **src\controllers\radiology\update-status.controller.ts** (16 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    4: /**
5:  * Update order status
6:  * @route POST /api/radiology/orders/:orderId/update-status
    ```
    ```
    5:  * Update order status
6:  * @route POST /api/radiology/orders/:orderId/update-status
7:  */
    ```
    ```
    12:     if (isNaN(orderId)) {
13:       res.status(400).json({ message: 'Invalid order ID' });
14:       return;
    ```
    ... and 10 more matches
- **src\controllers\superadmin\organizations\get-organization-by-id.ts** (4 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    13:     if (isNaN(orgId)) {
14:       res.status(400).json({
15:         success: false,
    ```
    ```
    24:     if (!organization) {
25:       res.status(404).json({
26:         success: false,
    ```
    ```
    32:     // Return the organization
33:     res.status(200).json({
34:       success: true,
    ```
    ... and 1 more matches
- **src\controllers\superadmin\organizations\list-all-organizations.ts** (4 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    13:       type: req.query.type as string | undefined,
14:       status: req.query.status as string | undefined
15:     };
    ```
    ```
    20:     // Return the organizations
21:     res.status(200).json({
22:       success: true,
    ```
    ```
    27:     console.error('Error listing organizations:', error);
28:     res.status(500).json({
29:       success: false,
    ```
- **src\controllers\superadmin\users\get-user-by-id.ts** (4 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    13:     if (isNaN(userId)) {
14:       res.status(400).json({
15:         success: false,
    ```
    ```
    24:     if (!user) {
25:       res.status(404).json({
26:         success: false,
    ```
    ```
    32:     // Return the user
33:     res.status(200).json({
34:       success: true,
    ```
    ... and 1 more matches
- **src\controllers\superadmin\users\list-all-users.ts** (6 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    14:       role?: string;
15:       status?: boolean;
16:     } = {};
    ```
    ```
    29:     
30:     if (req.query.status !== undefined) {
31:       filters.status = req.query.status === 'true';
    ```
    ```
    30:     if (req.query.status !== undefined) {
31:       filters.status = req.query.status === 'true';
32:     }
    ```
    ... and 2 more matches
- **src\controllers\uploads\confirm-upload.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    44: 
45:     res.status(200).json({
46:       success: result.success,
    ```
    ```
    51:     console.error('[UploadsController] Error confirming upload:', error);
52:     res.status(500).json({
53:       success: false,
    ```
- **src\controllers\uploads\get-presigned-url.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    37: 
38:     res.status(200).json({
39:       success: result.success,
    ```
    ```
    44:     console.error('[UploadsController] Error generating presigned URL:', error);
45:     res.status(500).json({
46:       success: false,
    ```
- **src\controllers\uploads\validate-confirm-upload-request.ts** (4 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    26:   if (!fileKey || !orderId || !patientId || !documentType || !fileName || !fileSize || !contentType) {
27:     res.status(400).json({
28:       success: false,
    ```
    ```
    38:   if (!userId || !userOrgId) {
39:     res.status(401).json({
40:       success: false,
    ```
    ```
    62:   if (orderResult.rows.length === 0) {
63:     res.status(404).json({
64:       success: false,
    ```
    ... and 1 more matches
- **src\controllers\uploads\validate-presigned-url-request.ts** (3 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    22:   if (!fileType || !fileName || !contentType) {
23:     res.status(400).json({
24:       success: false,
    ```
    ```
    36:     if (fileSize > maxSizeBytes) {
37:       res.status(400).json({
38:         success: false,
    ```
    ```
    51:   if (!allowedFileTypes.includes(contentType)) {
52:     res.status(400).json({
53:       success: false,
    ```
- **src\controllers\webhook.controller.ts** (3 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    14:     if (!signature) {
15:       res.status(400).json({ message: 'Missing stripe-signature header' });
16:       return;
    ```
    ```
    58:       // Return a 200 response to acknowledge receipt of the event
59:       res.status(200).json({ received: true });
60:     } catch (error: any) {
    ```
    ```
    61:       console.error('Error handling Stripe webhook:', error.message);
62:       res.status(400).json({ message: error.message });
63:     }
    ```
- **src\index.ts** (4 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    31: app.get('/health', (req, res) => {
32:   res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
33: });
    ```
    ```
    37:   console.error('Unhandled error:', err);
38:   res.status(500).json({ message: 'Internal server error' });
39: });
    ```
    ```
    42: app.use((req, res) => {
43:   res.status(404).json({ message: 'Route not found' });
44: });
    ```
- **src\middleware\auth\authenticate-jwt.ts** (3 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    14:   if (!authHeader) {
15:     return res.status(401).json({ message: 'Authorization header missing' });
16:   }
    ```
    ```
    20:   if (!token) {
21:     return res.status(401).json({ message: 'Token missing' });
22:   }
    ```
    ```
    34:     console.error('JWT verification error:', error);
35:     return res.status(403).json({ message: 'Invalid or expired token' });
36:   }
    ```
- **src\middleware\auth\authorize-organization.ts** (3 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    10:   if (!req.user) {
11:     return res.status(401).json({ message: 'User not authenticated' });
12:   }
    ```
    ```
    16:   if (isNaN(orgId)) {
17:     return res.status(400).json({ message: 'Invalid organization ID' });
18:   }
    ```
    ```
    20:   if (req.user.orgId !== orgId && req.user.role !== 'super_admin') {
21:     return res.status(403).json({ 
22:       message: 'Access denied: You do not have permission to access this organization'
    ```
- **src\middleware\auth\authorize-role.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    11:     if (!req.user) {
12:       return res.status(401).json({ message: 'User not authenticated' });
13:     }
    ```
    ```
    18:     if (!roles.includes(req.user.role)) {
19:       return res.status(403).json({ 
20:         message: 'Access denied: Insufficient permissions',
    ```
- **src\models\Auth.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    60:   expires_at: Date;
61:   status: string;
62:   created_at: Date;
    ```
- **src\models\order\order-types.ts** (5 matches)
  - Unique matches: `status`, `validation_status`
  - Sample context:
    ```
    16:   updated_by_user_id?: number;
17:   status: OrderStatus;
18:   priority: OrderPriority;
    ```
    ```
    28:   is_contrast_indicated?: boolean;
29:   final_validation_status?: ValidationStatus;
30:   final_compliance_score?: number;
    ```
    ```
    41: /**
42:  * Order status enum
43:  */
    ```
    ... and 2 more matches
- **src\models\order\validation-types.ts** (2 matches)
  - Unique matches: `status`, `validationStatus`
  - Sample context:
    ```
    1: /**
2:  * Validation status enum
3:  */
    ```
    ```
    33: export interface ValidationResult {
34:   validationStatus: ValidationStatus;
35:   complianceScore: number;
    ```
- **src\models\Organization.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    19:   subscription_tier?: string;
20:   status: OrganizationStatus;
21:   assigned_account_manager_id?: number;
    ```
    ```
    67:   logo_url?: string;
68:   status: OrganizationStatus;
69:   created_at: Date;
    ```
- **src\routes\organization.routes.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    11: router.get('/mine', authenticateJWT, (req, res) => {
12:   res.status(501).json({ message: 'Not implemented yet' });
13: });
    ```
    ```
    15: router.put('/mine', authenticateJWT, authorizeRole(['admin_referring', 'admin_radiology']), (req, res) => {
16:   res.status(501).json({ message: 'Not implemented yet' });
17: });
    ```
- **src\routes\radiology-orders.routes.ts** (3 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    43: /**
44:  * @route   POST /api/radiology/orders/:orderId/update-status
45:  * @desc    Update order status
    ```
    ```
    44:  * @route   POST /api/radiology/orders/:orderId/update-status
45:  * @desc    Update order status
46:  * @access  Private (Scheduler, Admin Radiology)
    ```
    ```
    48: router.post(
49:   '/:orderId/update-status',
50:   authenticateJWT,
    ```
- **src\services\auth\organization\create-organization.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    12:     (name, type, npi, tax_id, address_line1, address_line2, city, state, zip_code, 
13:     phone_number, fax_number, contact_email, website, status, credit_balance) 
14:     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
    ```
- **src\services\billing\index.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    56:     clientSecret: string | null;
57:     status: string;
58:   }> {
    ```
- **src\services\billing\stripe\createSubscription.ts** (3 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    23:   clientSecret: string | null;
24:   status: string;
25: }> {
    ```
    ```
    86:       clientSecret,
87:       status: subscription.status
88:     };
    ```
- **src\services\billing\stripe\webhooks\handle-invoice-payment-failed\handle-invoice-payment-failed.ts** (6 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    25:     const orgResult = await client.query(
26:       `SELECT id, name, type, status, subscription_tier 
27:        FROM organizations 
    ```
    ```
    38:     const orgName = organization.name;
39:     const currentStatus = organization.status;
40:     
    ```
    ```
    62:     if (enterPurgatory && currentStatus !== 'purgatory') {
63:       // 1. Update organization status
64:       await client.query(
    ```
    ... and 3 more matches
- **src\services\billing\stripe\webhooks\handle-invoice-payment-succeeded.ts** (8 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    25:     const orgResult = await client.query(
26:       `SELECT id, name, type, status, subscription_tier, credit_balance 
27:        FROM organizations 
    ```
    ```
    38:     const orgType = organization.type;
39:     const currentStatus = organization.status;
40:     const subscriptionTier = organization.subscription_tier;
    ```
    ```
    67:     if (currentStatus === 'purgatory') {
68:       // 1. Update organization status
69:       await client.query(
    ```
    ... and 5 more matches
- **src\services\billing\stripe\webhooks\handle-subscription-deleted.ts** (6 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    24:     const orgResult = await client.query(
25:       `SELECT id, name, type, status 
26:        FROM organizations 
    ```
    ```
    37:     const orgName = organization.name;
38:     const currentStatus = organization.status;
39:     
    ```
    ```
    54:     if (currentStatus !== 'purgatory') {
55:       // 1. Update organization status
56:       await client.query(
    ```
    ... and 3 more matches
- **src\services\billing\stripe\webhooks\handle-subscription-updated\handle-subscription-updated.ts** (24 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    7:  * Handle customer.subscription.updated event
8:  * This is triggered when a subscription is updated (e.g., plan change, status change)
9:  */
    ```
    ```
    25:     const orgResult = await client.query(
26:       `SELECT id, name, type, status, subscription_tier 
27:        FROM organizations 
    ```
    ```
    38:     const orgName = organization.name;
39:     const currentStatus = organization.status;
40:     const currentTier = organization.subscription_tier;
    ```
    ... and 21 more matches
- **src\services\connection\queries\approve\approve-relationship.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    5: UPDATE organization_relationships
6: SET status = 'active', approved_by_id = $1, updated_at = NOW()
7: WHERE id = $2
    ```
- **src\services\connection\queries\approve\get-relationship.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    9: JOIN organizations o1 ON r.organization_id = o1.id
10: WHERE r.id = $1 AND r.related_organization_id = $2 AND r.status = 'pending'
11: `;
    ```
- **src\services\connection\queries\connection-queries.ts** (9 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    36: LEFT JOIN users u1 ON r.initiated_by_id = u1.id
37: WHERE r.related_organization_id = $1 AND r.status = 'pending'
38: ORDER BY r.created_at DESC
    ```
    ```
    51: export const CHECK_EXISTING_RELATIONSHIP_QUERY = `
52: SELECT id, status FROM organization_relationships 
53: WHERE (organization_id = $1 AND related_organization_id = $2)
    ```
    ```
    61: UPDATE organization_relationships
62: SET status = 'pending', 
63:     organization_id = $1,
    ```
    ... and 6 more matches
- **src\services\connection\queries\list\incoming-requests.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    12: LEFT JOIN users u1 ON r.initiated_by_id = u1.id
13: WHERE r.related_organization_id = $1 AND r.status = 'pending'
14: ORDER BY r.created_at DESC
    ```
- **src\services\connection\queries\reject\reject-relationship.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    5: UPDATE organization_relationships
6: SET status = 'rejected', approved_by_id = $1, updated_at = NOW()
7: WHERE id = $2
    ```
- **src\services\connection\queries\request\check-existing-relationship.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    4: export const CHECK_EXISTING_RELATIONSHIP_QUERY = `
5: SELECT id, status FROM organization_relationships 
6: WHERE (organization_id = $1 AND related_organization_id = $2)
    ```
- **src\services\connection\queries\request\create-relationship.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    5: INSERT INTO organization_relationships
6: (organization_id, related_organization_id, status, initiated_by_id, notes)
7: VALUES ($1, $2, 'pending', $3, $4)
    ```
- **src\services\connection\queries\request\update-relationship.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    5: UPDATE organization_relationships
6: SET status = 'pending', 
7:     organization_id = $1,
    ```
- **src\services\connection\queries\terminate\get-relationship.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    12: JOIN organizations o2 ON r.related_organization_id = o2.id
13: WHERE r.id = $1 AND (r.organization_id = $2 OR r.related_organization_id = $2) AND r.status = 'active'
14: `;
    ```
- **src\services\connection\queries\terminate\terminate-relationship.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    5: UPDATE organization_relationships
6: SET status = 'terminated', updated_at = NOW()
7: WHERE id = $1
    ```
- **src\services\connection\services\approve-connection.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    31:       if (relationshipResult.rows.length === 0) {
32:         throw new Error('Relationship not found, not authorized, or not in pending status');
33:       }
    ```
- **src\services\connection\services\list-connections.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    25:           partnerOrgName: isInitiator ? row.target_org_name : row.initiating_org_name,
26:           status: row.status,
27:           isInitiator,
    ```
- **src\services\connection\services\reject-connection.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    29:       if (relationshipResult.rows.length === 0) {
30:         throw new Error('Relationship not found, not authorized, or not in pending status');
31:       }
    ```
- **src\services\connection\services\request-connection.ts** (8 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    47:         // If there's an active relationship, return it
48:         if (existing.status === 'active') {
49:           await client.query('ROLLBACK');
    ```
    ```
    53:             relationshipId: existing.id,
54:             status: existing.status
55:           };
    ```
    ```
    58:         // If there's a pending relationship, return it
59:         if (existing.status === 'pending') {
60:           await client.query('ROLLBACK');
    ```
    ... and 2 more matches
- **src\services\connection\services\terminate-connection.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    31:       if (relationshipResult.rows.length === 0) {
32:         throw new Error('Relationship not found, not authorized, or not in active status');
33:       }
    ```
- **src\services\connection\types.ts** (3 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    11:   partnerOrgName: string;
12:   status: ConnectionStatus;
13:   isInitiator: boolean;
    ```
    ```
    34: /**
35:  * Connection status
36:  */
    ```
    ```
    59:   relationshipId: number;
60:   status?: ConnectionStatus;
61: }
    ```
- **src\services\location\deactivate-location.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    6:  * @param orgId Organization ID (for authorization)
7:  * @returns Promise with success status
8:  */
    ```
- **src\services\location\manager\location-manager.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    57:    * @param orgId Organization ID (for authorization)
58:    * @returns Promise with success status
59:    */
    ```
- **src\services\location\manager\user-location-manager.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    26:    * @param orgId Organization ID (for authorization)
27:    * @returns Promise with success status
28:    */
    ```
    ```
    37:    * @param orgId Organization ID (for authorization)
38:    * @returns Promise with success status
39:    */
    ```
- **src\services\location\queries\deactivate\location.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    6:  * @param orgId Organization ID (for authorization)
7:  * @returns Promise with success status
8:  */
    ```
- **src\services\location\queries\user\assign-user.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    7:  * @param orgId Organization ID (for authorization)
8:  * @returns Promise with success status
9:  */
    ```
- **src\services\location\queries\user\unassign-user.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    7:  * @param orgId Organization ID (for authorization)
8:  * @returns Promise with success status
9:  */
    ```
- **src\services\location\services\deactivate-location.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    6:  * @param orgId Organization ID (for authorization)
7:  * @returns Promise with success status
8:  */
    ```
- **src\services\location\services\user-location-management\assign-user-to-location.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    7:  * @param orgId Organization ID (for authorization)
8:  * @returns Promise with success status
9:  */
    ```
- **src\services\location\services\user-location-management\unassign-user-from-location.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    7:  * @param orgId Organization ID (for authorization)
8:  * @returns Promise with success status
9:  */
    ```
- **src\services\location\user\assign-user-to-location.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    7:  * @param orgId Organization ID (for authorization)
8:  * @returns Promise with success status
9:  */
    ```
- **src\services\location\user\unassign-user-from-location.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    7:  * @param orgId Organization ID (for authorization)
8:  * @returns Promise with success status
9:  */
    ```
- **src\services\order\admin\clinical-record-manager\index.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    7: import { saveSupplementalDocument } from './save-supplemental-document';
8: import { verifyOrderStatus } from './verify-order-status';
9: 
    ```
- **src\services\order\admin\clinical-record-manager\verify-order-status.ts** (5 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    4: /**
5:  * Verify order exists and has status 'pending_admin'
6:  * @param orderId Order ID
    ```
    ```
    7:  * @returns Promise with order data
8:  * @throws Error if order not found or not in pending_admin status
9:  */
    ```
    ```
    11:   const orderResult = await queryPhiDb(
12:     `SELECT o.id, o.status, o.patient_id, o.referring_organization_id 
13:      FROM orders o
    ```
    ... and 2 more matches
- **src\services\order\admin\handlers\paste-summary.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    20:   return withTransaction(async (client) => {
21:     // 1. Verify order exists and has status 'pending_admin'
22:     const order = await clinicalRecordManager.verifyOrderStatus(orderId);
    ```
- **src\services\order\admin\handlers\paste-supplemental.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    16:   try {
17:     // 1. Verify order exists and has status 'pending_admin'
18:     const order = await clinicalRecordManager.verifyOrderStatus(orderId);
    ```
- **src\services\order\admin\handlers\send-to-radiology.ts** (5 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    2: import * as clinicalRecordManager from '../clinical-record-manager';
3: import * as orderStatusManager from '../order-status-manager';
4: import * as validation from '../validation';
    ```
    ```
    18:   return withTransaction(async (client) => {
19:     // 1. Verify order exists and has status 'pending_admin'
20:     const order = await clinicalRecordManager.verifyOrderStatus(orderId);
    ```
    ```
    50:     const orgStatusResult = await client.query(
51:       'SELECT status FROM organizations WHERE id = $1',
52:       [organizationId]
    ```
    ... and 2 more matches
- **src\services\order\admin\handlers\update-insurance.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    17:   try {
18:     // 1. Verify order exists and has status 'pending_admin'
19:     const order = await clinicalRecordManager.verifyOrderStatus(orderId);
    ```
- **src\services\order\admin\handlers\update-patient.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    17:   try {
18:     // 1. Verify order exists and has status 'pending_admin'
19:     const order = await clinicalRecordManager.verifyOrderStatus(orderId);
    ```
- **src\services\order\admin\order-status-manager\index.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    1: /**
2:  * Order status management utilities
3:  */
    ```
    ```
    5: // Import functions
6: import { updateOrderStatusToRadiology } from './update-order-status';
7: import { validatePatientData } from './validate-patient-data';
    ```
- **src\services\order\admin\order-status-manager\update-order-status.ts** (5 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    4: /**
5:  * Update order status to pending_radiology
6:  * @param orderId Order ID
    ```
    ```
    19:     
20:     // Update order status to 'pending_radiology'
21:     await client.query(
    ```
    ```
    22:       `UPDATE orders
23:        SET status = $1, updated_at = NOW(), updated_by_user_id = $2
24:        WHERE id = $3`,
    ```
    ... and 1 more matches
- **src\services\order\admin\types\order-types.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    7:   id: number;
8:   status: string;
9:   patient_id: number;
    ```
- **src\services\order\finalize\transaction\execute-transaction.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    83:       userId,
84:       order.status,
85:       OrderStatus.PENDING_ADMIN,
    ```
- **src\services\order\finalize\update\update-order-with-final-data.ts** (2 matches)
  - Unique matches: `status`, `validation_status`
  - Sample context:
    ```
    23:     patient_id = $1,
24:     status = $2,
25:     clinical_indication = $3,
    ```
    ```
    29:     final_icd10_code_descriptions = $7,
30:     final_validation_status = $8,
31:     final_compliance_score = $9,
    ```
- **src\services\order\radiology\export\csv-export\generate-csv-export.ts** (4 matches)
  - Unique matches: `status`, `validation_status`
  - Sample context:
    ```
    17:       order_number: order.order_number,
18:       status: order.status,
19:       priority: order.priority,
    ```
    ```
    27:       clinical_indication: order.clinical_indication,
28:       validation_status: order.final_validation_status,
29:       compliance_score: order.final_compliance_score,
    ```
- **src\services\order\radiology\index.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    13: export * from './order-export';
14: export * from './order-status.service';
15: export * from './information-request.service';
    ```
    ```
    20: import { exportOrder } from './order-export';
21: import { updateOrderStatus } from './order-status.service';
22: import { requestInformation } from './information-request.service';
    ```
- **src\services\order\radiology\information-request.service.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    42:        (order_id, requested_by_user_id, requesting_organization_id, target_organization_id,
43:         requested_info_type, requested_info_details, status, created_at)
44:        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    ```
- **src\services\order\radiology\order-status.service.ts** (10 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    4: /**
5:  * Update order status
6:  * @param orderId Order ID
    ```
    ```
    6:  * @param orderId Order ID
7:  * @param newStatus New status
8:  * @param userId User ID
    ```
    ```
    26:     const orderResult = await client.query(
27:       `SELECT o.id, o.status, o.radiology_organization_id
28:        FROM orders o
    ```
    ... and 6 more matches
- **src\services\order\radiology\query\count-query-builder.ts** (5 matches)
  - Unique matches: `status`, `validationStatus`, `validation_status`
  - Sample context:
    ```
    15:     WHERE o.radiology_organization_id = $1
16:     AND o.status = $2
17:   `;
    ```
    ```
    18:   
19:   const countParams = [orgId, filters.status || OrderStatus.PENDING_RADIOLOGY];
20:   
    ```
    ```
    52:   
53:   if (filters.validationStatus) {
54:     countQuery += ` AND o.final_validation_status = $${countParamIndex}`;
    ```
    ... and 2 more matches
- **src\services\order\radiology\query\order-builder\base-query.ts** (2 matches)
  - Unique matches: `status`, `validation_status`
  - Sample context:
    ```
    13:   const query = `
14:     SELECT o.id, o.order_number, o.status, o.priority, o.modality, o.body_part, 
15:            o.final_cpt_code, o.final_cpt_code_description, o.final_validation_status,
    ```
    ```
    14:     SELECT o.id, o.order_number, o.status, o.priority, o.modality, o.body_part, 
15:            o.final_cpt_code, o.final_cpt_code_description, o.final_validation_status,
16:            o.created_at, o.updated_at, o.patient_name, o.patient_dob, o.patient_gender,
    ```
- **src\services\order\radiology\query\order-builder\filter-orchestrator.ts** (3 matches)
  - Unique matches: `status`, `validationStatus`
  - Sample context:
    ```
    1: import { OrderFilters } from '../../types';
2: import { applyStatusFilter } from './status-filter';
3: import { applyReferringOrgFilter } from './organization-filter';
    ```
    ```
    24:   // Apply each filter in sequence
25:   result = applyStatusFilter(result.query, result.params, result.paramIndex, filters.status);
26:   result = applyReferringOrgFilter(result.query, result.params, result.paramIndex, filters.referringOrgId);
    ```
    ```
    29:   result = applyDateRangeFilter(result.query, result.params, result.paramIndex, filters.startDate, filters.endDate);
30:   result = applyValidationStatusFilter(result.query, result.params, result.paramIndex, filters.validationStatus);
31:   
    ```
- **src\services\order\radiology\query\order-builder\sorting.ts** (2 matches)
  - Unique matches: `validation_status`
  - Sample context:
    ```
    16:     const validSortColumns = [
17:       'created_at', 'priority', 'modality', 'final_validation_status', 'patient_name'
18:     ];
    ```
    ```
    30:       CASE WHEN o.priority = 'stat' THEN 0 ELSE 1 END,
31:       CASE WHEN o.final_validation_status = 'override' THEN 0 ELSE 1 END,
32:       o.created_at DESC`;
    ```
- **src\services\order\radiology\query\order-builder\status-filter.ts** (7 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    3: /**
4:  * Apply status filter to the query
5:  * @param query Current query string
    ```
    ```
    7:  * @param paramIndex Current parameter index
8:  * @param status Status to filter by
9:  * @returns Updated query, params, and paramIndex
    ```
    ```
    14:   paramIndex: number, 
15:   status?: string
16: ): { query: string; params: any[]; paramIndex: number } {
    ```
    ... and 4 more matches
- **src\services\order\radiology\query\order-builder\validation-filter.ts** (7 matches)
  - Unique matches: `status`, `validationStatus`, `validation_status`
  - Sample context:
    ```
    1: /**
2:  * Apply validation status filter to the query
3:  * @param query Current query string
    ```
    ```
    5:  * @param paramIndex Current parameter index
6:  * @param validationStatus Validation status to filter by
7:  * @returns Updated query, params, and paramIndex
    ```
    ```
    12:   paramIndex: number, 
13:   validationStatus?: string
14: ): { query: string; params: any[]; paramIndex: number } {
    ```
    ... and 3 more matches
- **src\services\order\radiology\types.ts** (3 matches)
  - Unique matches: `status`, `validationStatus`
  - Sample context:
    ```
    6: export interface OrderFilters {
7:   status?: string;
8:   referringOrgId?: number;
    ```
    ```
    12:   endDate?: Date;
13:   validationStatus?: string;
14:   sortBy?: string;
    ```
    ```
    51: /**
52:  * Interface for order status update result
53:  */
    ```
- **src\services\order\validation\attempt-tracking\log-validation-attempt.ts** (1 matches)
  - Unique matches: `validationStatus`
  - Sample context:
    ```
    29:       dictationText,
30:       validationResult.validationStatus,
31:       JSON.stringify(validationResult.suggestedICD10Codes),
    ```
- **src\services\order\validation\draft-order.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    48:     (order_number, referring_organization_id, radiology_organization_id,
49:     created_by_user_id, status, priority, original_dictation, patient_id)
50:     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ```
    ```
    68:     `INSERT INTO order_history 
69:     (order_id, user_id, event_type, new_status, created_at) 
70:     VALUES ($1, $2, $3, $4, NOW())`,
    ```
- **src\services\order\validation\handler.ts** (3 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    23:  * @param radiologyOrganizationId - Optional ID of the radiology organization
24:  * @returns Object containing success status, order ID, and validation result
25:  */
    ```
    ```
    77:     
78:     // If it's our custom error object with status, pass it through
79:     if (error && typeof error === 'object' && 'status' in error) {
    ```
    ```
    78:     // If it's our custom error object with status, pass it through
79:     if (error && typeof error === 'object' && 'status' in error) {
80:       throw error;
    ```
- **src\services\order-history.service.ts** (5 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    11:    * @param userId User ID
12:    * @param previousStatus Previous order status
13:    * @param newStatus New order status
    ```
    ```
    12:    * @param previousStatus Previous order status
13:    * @param newStatus New order status
14:    * @param eventType Event type
    ```
    ```
    21:     newStatus: string,
22:     eventType: string = 'status_change'
23:   ): Promise<void> {
    ```
    ... and 1 more matches
- **src\services\superadmin\organizations\list-all-organizations.ts** (4 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    11:   type?: string;
12:   status?: string;
13: }): Promise<any[]> {
    ```
    ```
    37:     
38:     if (filters.status) {
39:       query += ` AND status = $${paramIndex}`;
    ```
    ```
    38:     if (filters.status) {
39:       query += ` AND status = $${paramIndex}`;
40:       params.push(filters.status);
    ```
    ... and 1 more matches
- **src\services\superadmin\users\list-all-users.ts** (3 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    12:   role?: string;
13:   status?: boolean;
14: }): Promise<any[]> {
    ```
    ```
    48:     
49:     if (filters.status !== undefined) {
50:       query += ` AND u.is_active = $${paramIndex}`;
    ```
    ```
    50:       query += ` AND u.is_active = $${paramIndex}`;
51:       params.push(filters.status);
52:       paramIndex++;
    ```
- **src\services\upload\document-upload.service.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    13:  * @param userId The user ID of the uploader
14:  * @param processingStatus The processing status of the document
15:  * @returns The ID of the created document record
    ```
    ```
    48:         `INSERT INTO document_uploads
49:         (user_id, order_id, patient_id, document_type, filename, file_size, mime_type, file_path, processing_status, uploaded_at)
50:         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
    ```
- **src\services\upload\index.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    47:    * @param userId The user ID of the uploader
48:    * @param processingStatus The processing status of the document
49:    * @returns The ID of the created document record
    ```
- **src\services\validation\logging.ts** (1 matches)
  - Unique matches: `validationStatus`
  - Sample context:
    ```
    55:         originalText,
56:         validationResult.validationStatus,
57:         icd10Codes,
    ```
- **src\utils\llm\providers\anthropic.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    43:       const errorText = await response.text();
44:       throw new Error(`Anthropic API error: ${response.status} ${response.statusText} - ${errorText}`);
45:     }
    ```
- **src\utils\llm\providers\grok.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    42:       const errorText = await response.text();
43:       throw new Error(`Grok API error: ${response.status} ${response.statusText} - ${errorText}`);
44:     }
    ```
- **src\utils\llm\providers\openai.ts** (2 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    42:       const errorText = await response.text();
43:       throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
44:     }
    ```
- **src\utils\response\normalizer\normalize-response-fields.ts** (7 matches)
  - Unique matches: `validationStatus`, `status`, `validation_status`
  - Sample context:
    ```
    10:   const fieldMap: FieldMap = {
11:     // validationStatus variations
12:     'validationstatus': 'validationStatus',
    ```
    ```
    11:     // validationStatus variations
12:     'validationstatus': 'validationStatus',
13:     'validation_status': 'validationStatus',
    ```
    ```
    12:     'validationstatus': 'validationStatus',
13:     'validation_status': 'validationStatus',
14:     'status': 'validationStatus',
    ```
    ... and 1 more matches
- **src\utils\response\processor.ts** (5 matches)
  - Unique matches: `validationStatus`
  - Sample context:
    ```
    45:     
46:     // Ensure validationStatus is a valid enum value
47:     validateValidationStatus(normalizedResponse.validationStatus);
    ```
    ```
    46:     // Ensure validationStatus is a valid enum value
47:     validateValidationStatus(normalizedResponse.validationStatus);
48:     
    ```
    ```
    54:     return {
55:       validationStatus: normalizedResponse.validationStatus,
56:       complianceScore: normalizedResponse.complianceScore,
    ```
    ... and 1 more matches
- **src\utils\response\types.ts** (2 matches)
  - Unique matches: `validationStatus`, `status`
  - Sample context:
    ```
    16: export interface NormalizedResponse {
17:   validationStatus: string;
18:   complianceScore: number;
    ```
    ```
    30: /**
31:  * Type for status mapping
32:  */
    ```
- **src\utils\response\validator\index.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    6: import { validateRequiredFields } from './validate-required-fields';
7: import { validateValidationStatus } from './validate-validation-status';
8: 
    ```
- **src\utils\response\validator\validate-required-fields.ts** (1 matches)
  - Unique matches: `validationStatus`
  - Sample context:
    ```
    5:   const requiredFields = [
6:     'validationStatus',
7:     'complianceScore',
    ```
- **src\utils\response\validator\validate-validation-status.ts** (9 matches)
  - Unique matches: `status`, `validationStatus`
  - Sample context:
    ```
    4: /**
5:  * Validate that the validation status is a valid enum value
6:  */
    ```
    ```
    6:  */
7: export function validateValidationStatus(status: string): void {
8:   // Convert to lowercase for case-insensitive comparison
    ```
    ```
    8:   // Convert to lowercase for case-insensitive comparison
9:   const normalizedStatus = status.toLowerCase();
10:   
    ```
    ... and 5 more matches
- **src\utils\text-processing\medical-terms\abbreviations.ts** (1 matches)
  - Unique matches: `status`
  - Sample context:
    ```
    27:   'w/o', // without
28:   's/p', // status post
29:   'r/o', // rule out
    ```

### Compliance Score Field Names

- Files affected: 13
- Total matches: 32

#### Affected Files

- **src\controllers\order-management\handlers\finalize-order.ts** (1 matches)
  - Unique matches: `compliance_score`
  - Sample context:
    ```
    35:       finalValidationStatus: rawPayload.finalValidationStatus || rawPayload.final_validation_status,
36:       finalComplianceScore: rawPayload.finalComplianceScore || rawPayload.final_compliance_score,
37:       finalICD10Codes: rawPayload.finalICD10Codes || rawPayload.final_icd10_codes,
    ```
- **src\models\order\order-types.ts** (1 matches)
  - Unique matches: `compliance_score`
  - Sample context:
    ```
    29:   final_validation_status?: ValidationStatus;
30:   final_compliance_score?: number;
31:   final_validation_notes?: string;
    ```
- **src\models\order\validation-types.ts** (2 matches)
  - Unique matches: `compliance_score`, `complianceScore`
  - Sample context:
    ```
    22:   generated_feedback_text?: string;
23:   generated_compliance_score?: number;
24:   is_rare_disease_feedback?: boolean;
    ```
    ```
    34:   validationStatus: ValidationStatus;
35:   complianceScore: number;
36:   feedback: string;
    ```
- **src\services\order\finalize\update\update-order-with-final-data.ts** (1 matches)
  - Unique matches: `compliance_score`
  - Sample context:
    ```
    30:     final_validation_status = $8,
31:     final_compliance_score = $9,
32:     overridden = $10,
    ```
- **src\services\order\radiology\details\fetch-validation-attempts.ts** (1 matches)
  - Unique matches: `compliance_score`
  - Sample context:
    ```
    9:   const validationAttemptsResult = await queryPhiDb(
10:     `SELECT va.id, va.attempt_number, va.validation_outcome, va.generated_compliance_score,
11:             va.created_at
    ```
- **src\services\order\radiology\export\csv-export\generate-csv-export.ts** (2 matches)
  - Unique matches: `compliance_score`
  - Sample context:
    ```
    28:       validation_status: order.final_validation_status,
29:       compliance_score: order.final_compliance_score,
30:       contrast_indicated: order.is_contrast_indicated ? 'Yes' : 'No',
    ```
- **src\services\order\validation\attempt-tracking\log-validation-attempt.ts** (2 matches)
  - Unique matches: `compliance_score`, `complianceScore`
  - Sample context:
    ```
    23:     generated_icd10_codes, generated_cpt_codes, generated_feedback_text, 
24:     generated_compliance_score, user_id, created_at) 
25:     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
    ```
    ```
    33:       validationResult.feedback,
34:       validationResult.complianceScore,
35:       userId
    ```
- **src\services\validation\logging.ts** (2 matches)
  - Unique matches: `compliance_score`, `complianceScore`
  - Sample context:
    ```
    47:         generated_feedback_text,
48:         generated_compliance_score,
49:         user_id,
    ```
    ```
    59:         validationResult.feedback,
60:         validationResult.complianceScore,
61:         userId
    ```
- **src\utils\response\extractor.ts** (6 matches)
  - Unique matches: `score`, `complianceScore`
  - Sample context:
    ```
    8:   
9:   // Try to extract compliance score
10:   const scoreMatch = responseContent.match(/(?:compliance|score)[\s:]+(\d+)/i);
    ```
    ```
    9:   // Try to extract compliance score
10:   const scoreMatch = responseContent.match(/(?:compliance|score)[\s:]+(\d+)/i);
11:   if (scoreMatch) {
    ```
    ```
    10:   const scoreMatch = responseContent.match(/(?:compliance|score)[\s:]+(\d+)/i);
11:   if (scoreMatch) {
12:     result.complianceScore = parseInt(scoreMatch[1], 10);
    ```
    ... and 1 more matches
- **src\utils\response\normalizer\normalize-response-fields.ts** (7 matches)
  - Unique matches: `complianceScore`, `score`, `compliance_score`
  - Sample context:
    ```
    15:     
16:     // complianceScore variations
17:     'compliancescore': 'complianceScore',
    ```
    ```
    16:     // complianceScore variations
17:     'compliancescore': 'complianceScore',
18:     'compliance_score': 'complianceScore',
    ```
    ```
    17:     'compliancescore': 'complianceScore',
18:     'compliance_score': 'complianceScore',
19:     'score': 'complianceScore',
    ```
    ... and 1 more matches
- **src\utils\response\processor.ts** (4 matches)
  - Unique matches: `complianceScore`
  - Sample context:
    ```
    55:       validationStatus: normalizedResponse.validationStatus,
56:       complianceScore: normalizedResponse.complianceScore,
57:       feedback: normalizedResponse.feedback,
    ```
    ```
    71:       validationStatus: ValidationStatus.NEEDS_CLARIFICATION,
72:       complianceScore: extractedInfo.complianceScore || 0,
73:       feedback: extractedInfo.feedback || 'Unable to process the validation request. Please try again or contact support if the issue persists.',
    ```
- **src\utils\response\types.ts** (2 matches)
  - Unique matches: `complianceScore`
  - Sample context:
    ```
    6: export interface PartialInformation {
7:   complianceScore?: number;
8:   feedback?: string;
    ```
    ```
    17:   validationStatus: string;
18:   complianceScore: number;
19:   feedback: string;
    ```
- **src\utils\response\validator\validate-required-fields.ts** (1 matches)
  - Unique matches: `complianceScore`
  - Sample context:
    ```
    6:     'validationStatus',
7:     'complianceScore',
8:     'feedback',
    ```

### Feedback Field Names

- Files affected: 107
- Total matches: 333

#### Affected Files

- **src\controllers\admin-order\paste-summary.controller.ts** (3 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    13:     if (isNaN(orderId)) {
14:       res.status(400).json({ message: 'Invalid order ID' });
15:       return;
    ```
    ```
    20:     if (!pastedText) {
21:       res.status(400).json({ message: 'Pasted text is required' });
22:       return;
    ```
    ```
    28:     if (!userId) {
29:       res.status(401).json({ message: 'User authentication required' });
30:       return;
    ```
- **src\controllers\admin-order\paste-supplemental.controller.ts** (3 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    13:     if (isNaN(orderId)) {
14:       res.status(400).json({ message: 'Invalid order ID' });
15:       return;
    ```
    ```
    20:     if (!pastedText) {
21:       res.status(400).json({ message: 'Pasted text is required' });
22:       return;
    ```
    ```
    28:     if (!userId) {
29:       res.status(401).json({ message: 'User authentication required' });
30:       return;
    ```
- **src\controllers\admin-order\send-to-radiology.controller.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    13:     if (isNaN(orderId)) {
14:       res.status(400).json({ message: 'Invalid order ID' });
15:       return;
    ```
    ```
    21:     if (!userId) {
22:       res.status(401).json({ message: 'User authentication required' });
23:       return;
    ```
- **src\controllers\admin-order\types.ts** (12 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    25:   if (error instanceof Error) {
26:     if (error.message.includes('not found')) {
27:       res.status(404).json({ message: error.message });
    ```
    ```
    26:     if (error.message.includes('not found')) {
27:       res.status(404).json({ message: error.message });
28:     } else if (error.message.includes('Unauthorized')) {
    ```
    ```
    27:       res.status(404).json({ message: error.message });
28:     } else if (error.message.includes('Unauthorized')) {
29:       res.status(403).json({ message: error.message });
    ```
    ... and 5 more matches
- **src\controllers\admin-order\update-insurance.controller.ts** (3 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    13:     if (isNaN(orderId)) {
14:       res.status(400).json({ message: 'Invalid order ID' });
15:       return;
    ```
    ```
    20:     if (!insuranceData) {
21:       res.status(400).json({ message: 'Insurance data is required' });
22:       return;
    ```
    ```
    28:     if (!userId) {
29:       res.status(401).json({ message: 'User authentication required' });
30:       return;
    ```
- **src\controllers\admin-order\update-patient.controller.ts** (3 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    13:     if (isNaN(orderId)) {
14:       res.status(400).json({ message: 'Invalid order ID' });
15:       return;
    ```
    ```
    20:     if (!patientData) {
21:       res.status(400).json({ message: 'Patient data is required' });
22:       return;
    ```
    ```
    28:     if (!userId) {
29:       res.status(401).json({ message: 'User authentication required' });
30:       return;
    ```
- **src\controllers\auth\error-handler.ts** (11 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    11:  * @param operation Name of the operation (for logging)
12:  * @param errorMap Map of error messages to HTTP status codes
13:  * @param defaultMessage Default error message
    ```
    ```
    12:  * @param errorMap Map of error messages to HTTP status codes
13:  * @param defaultMessage Default error message
14:  */
    ```
    ```
    24:   if (error instanceof Error) {
25:     // Check if the error message is in the error map
26:     for (const [message, statusCode] of Object.entries(errorMap)) {
    ```
    ... and 4 more matches
- **src\controllers\auth\login.controller.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    18:       if (!email || !password) {
19:         res.status(400).json({ message: 'Email and password are required' });
20:         return;
    ```
- **src\controllers\auth\register.controller.ts** (3 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    18:       if (!organization || !user) {
19:         res.status(400).json({ message: 'Organization and user data are required' });
20:         return;
    ```
    ```
    24:       if (!organization.name || !organization.type) {
25:         res.status(400).json({ message: 'Organization name and type are required' });
26:         return;
    ```
    ```
    29:       if (!user.email || !user.password || !user.first_name || !user.last_name || !user.role) {
30:         res.status(400).json({ message: 'User email, password, first name, last name, and role are required' });
31:         return;
    ```
- **src\controllers\billing\create-checkout-session.ts** (3 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    18:         success: false,
19:         message: 'Unauthorized: User organization not found'
20:       });
    ```
    ```
    36:       success: false,
37:       message: `Failed to create checkout session: ${error instanceof Error ? error.message : String(error)}`
38:     });
    ```
- **src\controllers\billing\create-subscription.ts** (5 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    18:         success: false,
19:         message: 'Unauthorized: User organization not found'
20:       });
    ```
    ```
    28:         success: false,
29:         message: 'Bad Request: Price ID is required'
30:       });
    ```
    ```
    49:         success: false,
50:         message: 'Bad Request: Invalid price ID'
51:       });
    ```
    ... and 1 more matches
- **src\controllers\connection\approve.controller.ts** (4 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    38:       if (error instanceof Error && 
39:           (error.message.includes('not found') || 
40:            error.message.includes('not authorized'))) {
    ```
    ```
    39:           (error.message.includes('not found') || 
40:            error.message.includes('not authorized'))) {
41:         res.status(404).json({ message: error.message });
    ```
    ```
    40:            error.message.includes('not authorized'))) {
41:         res.status(404).json({ message: error.message });
42:       } else {
    ```
- **src\controllers\connection\auth-utils.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    10:   if (!req.user) {
11:     res.status(401).json({ message: 'User not authenticated' });
12:     return null;
    ```
- **src\controllers\connection\error-utils.ts** (7 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    13:     // Handle not found or not authorized errors
14:     if (error.message.includes('not found') || error.message.includes('not authorized')) {
15:       res.status(404).json({ message: error.message });
    ```
    ```
    14:     if (error.message.includes('not found') || error.message.includes('not authorized')) {
15:       res.status(404).json({ message: error.message });
16:       return;
    ```
    ```
    22:     res.status(500).json({ 
23:       message: `Failed to ${controllerName.toLowerCase()}`, 
24:       error: error.message 
    ```
    ... and 2 more matches
- **src\controllers\connection\reject.controller.ts** (4 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    38:       if (error instanceof Error && 
39:           (error.message.includes('not found') || 
40:            error.message.includes('not authorized'))) {
    ```
    ```
    39:           (error.message.includes('not found') || 
40:            error.message.includes('not authorized'))) {
41:         res.status(404).json({ message: error.message });
    ```
    ```
    40:            error.message.includes('not authorized'))) {
41:         res.status(404).json({ message: error.message });
42:       } else {
    ```
- **src\controllers\connection\terminate.controller.ts** (4 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    38:       if (error instanceof Error && 
39:           (error.message.includes('not found') || 
40:            error.message.includes('not authorized'))) {
    ```
    ```
    39:           (error.message.includes('not found') || 
40:            error.message.includes('not authorized'))) {
41:         res.status(404).json({ message: error.message });
    ```
    ```
    40:            error.message.includes('not authorized'))) {
41:         res.status(404).json({ message: error.message });
42:       } else {
    ```
- **src\controllers\connection\validation-utils\validate-relationship-id.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    12:   if (isNaN(relationshipId)) {
13:     res.status(400).json({ message: 'Invalid relationship ID' });
14:     return null;
    ```
- **src\controllers\connection\validation-utils\validate-target-org-id.ts** (3 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    13:   if (!targetOrgId) {
14:     res.status(400).json({ message: 'Target organization ID is required' });
15:     return null;
    ```
    ```
    20:   if (isNaN(targetOrgIdNum)) {
21:     res.status(400).json({ message: 'Target organization ID must be a number' });
22:     return null;
    ```
    ```
    26:   if (targetOrgIdNum === initiatingOrgId) {
27:     res.status(400).json({ message: 'Cannot request a connection to your own organization' });
28:     return null;
    ```
- **src\controllers\location\organization\create-location.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    29:     if (!locationData.name) {
30:       res.status(400).json({ message: 'Location name is required' });
31:       return;
    ```
    ```
    36:     res.status(201).json({ 
37:       message: 'Location created successfully', 
38:       location 
    ```
- **src\controllers\location\organization\deactivate-location.ts** (5 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    38:         res.status(200).json({ 
39:           message: 'Location deactivated successfully',
40:           locationId
    ```
    ```
    42:       } else {
43:         res.status(404).json({ message: 'Location not found or already deactivated' });
44:       }
    ```
    ```
    46:       // Handle not found or not authorized
47:       if ((error as Error).message.includes('not found or not authorized')) {
48:         res.status(404).json({ message: (error as Error).message });
    ```
    ... and 1 more matches
- **src\controllers\location\organization\get-location.ts** (3 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    38:       // Handle not found or not authorized
39:       if ((error as Error).message.includes('not found or not authorized')) {
40:         res.status(404).json({ message: (error as Error).message });
    ```
    ```
    39:       if ((error as Error).message.includes('not found or not authorized')) {
40:         res.status(404).json({ message: (error as Error).message });
41:       } else {
    ```
- **src\controllers\location\organization\update-location.ts** (5 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    36:     if (!locationData.name) {
37:       res.status(400).json({ message: 'Location name is required' });
38:       return;
    ```
    ```
    43:       res.status(200).json({ 
44:         message: 'Location updated successfully', 
45:         location 
    ```
    ```
    48:       // Handle not found or not authorized
49:       if ((error as Error).message.includes('not found or not authorized')) {
50:         res.status(404).json({ message: (error as Error).message });
    ```
    ... and 1 more matches
- **src\controllers\location\types.ts** (10 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    23:  * @param error Error object
24:  * @param message Error message
25:  */
    ```
    ```
    25:  */
26: export function handleControllerError(res: Response, error: unknown, message: string): void {
27:   console.error(`Error in ${message}:`, error);
    ```
    ```
    26: export function handleControllerError(res: Response, error: unknown, message: string): void {
27:   console.error(`Error in ${message}:`, error);
28:   res.status(500).json({ message, error: (error as Error).message });
    ```
    ... and 5 more matches
- **src\controllers\location\user\assign-user-to-location.ts** (5 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    39:         res.status(200).json({ 
40:           message: 'User assigned to location successfully',
41:           userId,
    ```
    ```
    44:       } else {
45:         res.status(500).json({ message: 'Failed to assign user to location' });
46:       }
    ```
    ```
    48:       // Handle not found or not authorized
49:       if ((error as Error).message.includes('not found or not authorized')) {
50:         res.status(404).json({ message: (error as Error).message });
    ```
    ... and 1 more matches
- **src\controllers\location\user\list-user-locations.ts** (3 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    38:       // Handle not found or not authorized
39:       if ((error as Error).message.includes('not found or not authorized')) {
40:         res.status(404).json({ message: (error as Error).message });
    ```
    ```
    39:       if ((error as Error).message.includes('not found or not authorized')) {
40:         res.status(404).json({ message: (error as Error).message });
41:       } else {
    ```
- **src\controllers\location\user\unassign-user-from-location.ts** (5 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    39:         res.status(200).json({ 
40:           message: 'User unassigned from location successfully',
41:           userId,
    ```
    ```
    44:       } else {
45:         res.status(404).json({ message: 'User-location assignment not found' });
46:       }
    ```
    ```
    48:       // Handle not found or not authorized
49:       if ((error as Error).message.includes('not found or not authorized')) {
50:         res.status(404).json({ message: (error as Error).message });
    ```
    ... and 1 more matches
- **src\controllers\order-management\error-handling\handle-controller-error.ts** (10 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    12:   if (error instanceof Error) {
13:     // Handle specific error types based on error message
14:     if (error.message.includes('not found')) {
    ```
    ```
    13:     // Handle specific error types based on error message
14:     if (error.message.includes('not found')) {
15:       res.status(404).json({ message: error.message });
    ```
    ```
    14:     if (error.message.includes('not found')) {
15:       res.status(404).json({ message: error.message });
16:     } else if (error.message.includes('Unauthorized')) {
    ```
    ... and 4 more matches
- **src\controllers\order-management\handlers\admin-update.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    28:     if (!additionalInformation && (!attachments || attachments.length === 0)) {
29:       res.status(400).json({ message: 'Additional information or attachments are required' });
30:       return;
    ```
    ```
    75:       success: true, 
76:       message: 'Order successfully updated by admin',
77:       orderId
    ```
- **src\controllers\order-management\types.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    38:   orderId: number;
39:   message: string;
40: }
    ```
    ```
    45: export interface ErrorResponse {
46:   message: string;
47: }
    ```
- **src\controllers\order-management\validation\validate-finalize-payload.ts** (4 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    22:     res.status(400).json({
23:       message: 'Required fields missing: finalValidationStatus/final_validation_status, finalCPTCode/final_cpt_code, clinicalIndication/clinical_indication'
24:     });
    ```
    ```
    30:     res.status(400).json({
31:       message: 'Invalid finalValidationStatus/final_validation_status value'
32:     });
    ```
    ```
    41:     res.status(400).json({
42:       message: 'Override justification is required when overridden is true'
43:     });
    ```
    ... and 1 more matches
- **src\controllers\order-management\validation\validate-order-id.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    12:   if (isNaN(orderId)) {
13:     res.status(400).json({ message: 'Invalid order ID' });
14:     return false;
    ```
- **src\controllers\order-management\validation\validate-user-auth.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    12:   if (!userId) {
13:     res.status(401).json({ message: 'User authentication required' });
14:     return undefined;
    ```
- **src\controllers\order-validation.controller.ts** (8 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    17:       if (!dictationText) {
18:         res.status(400).json({ message: 'Dictation text is required' });
19:         return;
    ```
    ```
    26:       if (!userId || !orgId) {
27:         res.status(401).json({ message: 'User authentication required' });
28:         return;
    ```
    ```
    47:       if (error && typeof error === 'object' && 'status' in error) {
48:         const customError = error as { status: number; message: string; code?: string; orderId?: number };
49:         res.status(customError.status).json({
    ```
    ... and 3 more matches
- **src\controllers\radiology\export-order.controller.ts** (12 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    13:     if (isNaN(orderId)) {
14:       res.status(400).json({ message: 'Invalid order ID' });
15:       return;
    ```
    ```
    20:     if (!validFormats.includes(format)) {
21:       res.status(400).json({ message: `Invalid format. Supported formats: ${validFormats.join(', ')}` });
22:       return;
    ```
    ```
    28:     if (!orgId) {
29:       res.status(401).json({ message: 'User authentication required' });
30:       return;
    ```
    ... and 6 more matches
- **src\controllers\radiology\incoming-orders.controller.ts** (4 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    14:     if (!orgId) {
15:       res.status(401).json({ message: 'User authentication required' });
16:       return;
    ```
    ```
    79:     if (error instanceof Error) {
80:       res.status(500).json({ message: error.message });
81:     } else {
    ```
    ```
    81:     } else {
82:       res.status(500).json({ message: 'An unexpected error occurred' });
83:     }
    ```
- **src\controllers\radiology\order-details.controller.ts** (11 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    12:     if (isNaN(orderId)) {
13:       res.status(400).json({ message: 'Invalid order ID' });
14:       return;
    ```
    ```
    20:     if (!orgId) {
21:       res.status(401).json({ message: 'User authentication required' });
22:       return;
    ```
    ```
    32:     if (error instanceof Error) {
33:       if (error.message.includes('not found')) {
34:         res.status(404).json({ message: error.message });
    ```
    ... and 5 more matches
- **src\controllers\radiology\request-information.controller.ts** (12 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    12:     if (isNaN(orderId)) {
13:       res.status(400).json({ message: 'Invalid order ID' });
14:       return;
    ```
    ```
    19:     if (!requestedInfoType || !requestedInfoDetails) {
20:       res.status(400).json({ message: 'Requested info type and details are required' });
21:       return;
    ```
    ```
    28:     if (!userId || !orgId) {
29:       res.status(401).json({ message: 'User authentication required' });
30:       return;
    ```
    ... and 6 more matches
- **src\controllers\radiology\update-status.controller.ts** (13 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    12:     if (isNaN(orderId)) {
13:       res.status(400).json({ message: 'Invalid order ID' });
14:       return;
    ```
    ```
    19:     if (!newStatus) {
20:       res.status(400).json({ message: 'New status is required' });
21:       return;
    ```
    ```
    26:     if (!validStatuses.includes(newStatus)) {
27:       res.status(400).json({ message: `Invalid status. Supported statuses: ${validStatuses.join(', ')}` });
28:       return;
    ```
    ... and 7 more matches
- **src\controllers\superadmin\organizations\get-organization-by-id.ts** (4 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    15:         success: false,
16:         message: 'Invalid organization ID'
17:       });
    ```
    ```
    26:         success: false,
27:         message: `Organization with ID ${orgId} not found`
28:       });
    ```
    ```
    40:       success: false,
41:       message: 'Failed to get organization',
42:       error: (error as Error).message
    ```
    ... and 1 more matches
- **src\controllers\superadmin\organizations\list-all-organizations.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    29:       success: false,
30:       message: 'Failed to list organizations',
31:       error: (error as Error).message
    ```
    ```
    30:       message: 'Failed to list organizations',
31:       error: (error as Error).message
32:     });
    ```
- **src\controllers\superadmin\users\get-user-by-id.ts** (4 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    15:         success: false,
16:         message: 'Invalid user ID'
17:       });
    ```
    ```
    26:         success: false,
27:         message: `User with ID ${userId} not found`
28:       });
    ```
    ```
    40:       success: false,
41:       message: 'Failed to get user',
42:       error: (error as Error).message
    ```
    ... and 1 more matches
- **src\controllers\superadmin\users\list-all-users.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    46:       success: false,
47:       message: 'Failed to list users',
48:       error: (error as Error).message
    ```
    ```
    47:       message: 'Failed to list users',
48:       error: (error as Error).message
49:     });
    ```
- **src\controllers\uploads\confirm-upload.ts** (3 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    47:       documentId: result.documentId,
48:       message: 'Upload confirmed and recorded'
49:     });
    ```
    ```
    53:       success: false,
54:       message: error.message || 'Failed to confirm upload'
55:     });
    ```
- **src\controllers\uploads\get-presigned-url.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    46:       success: false,
47:       message: error.message || 'Failed to generate upload URL'
48:     });
    ```
- **src\controllers\uploads\types.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    25:   fileKey?: string;
26:   message?: string;
27: }
    ```
    ```
    48:   documentId?: number;
49:   message?: string;
50: }
    ```
- **src\controllers\uploads\validate-confirm-upload-request.ts** (4 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    28:       success: false,
29:       message: 'Missing required fields'
30:     });
    ```
    ```
    40:       success: false,
41:       message: 'Unauthorized'
42:     });
    ```
    ```
    64:       success: false,
65:       message: 'Order not found'
66:     });
    ```
    ... and 1 more matches
- **src\controllers\uploads\validate-presigned-url-request.ts** (3 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    24:       success: false,
25:       message: 'Missing required fields: fileType, fileName, or contentType'
26:     });
    ```
    ```
    38:         success: false,
39:         message: `File size (${Math.round(fileSize / (1024 * 1024))}MB) exceeds the maximum allowed size (${Math.round(maxSizeBytes / (1024 * 1024))}MB)`
40:       });
    ```
    ```
    53:       success: false,
54:       message: `File type ${contentType} is not allowed. Allowed types: ${allowedFileTypes.join(', ')}`
55:     });
    ```
- **src\controllers\webhook.controller.ts** (4 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    14:     if (!signature) {
15:       res.status(400).json({ message: 'Missing stripe-signature header' });
16:       return;
    ```
    ```
    60:     } catch (error: any) {
61:       console.error('Error handling Stripe webhook:', error.message);
62:       res.status(400).json({ message: error.message });
    ```
    ```
    61:       console.error('Error handling Stripe webhook:', error.message);
62:       res.status(400).json({ message: error.message });
63:     }
    ```
- **src\index.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    37:   console.error('Unhandled error:', err);
38:   res.status(500).json({ message: 'Internal server error' });
39: });
    ```
    ```
    42: app.use((req, res) => {
43:   res.status(404).json({ message: 'Route not found' });
44: });
    ```
- **src\middleware\auth\authenticate-jwt.ts** (3 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    14:   if (!authHeader) {
15:     return res.status(401).json({ message: 'Authorization header missing' });
16:   }
    ```
    ```
    20:   if (!token) {
21:     return res.status(401).json({ message: 'Token missing' });
22:   }
    ```
    ```
    34:     console.error('JWT verification error:', error);
35:     return res.status(403).json({ message: 'Invalid or expired token' });
36:   }
    ```
- **src\middleware\auth\authorize-organization.ts** (3 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    10:   if (!req.user) {
11:     return res.status(401).json({ message: 'User not authenticated' });
12:   }
    ```
    ```
    16:   if (isNaN(orgId)) {
17:     return res.status(400).json({ message: 'Invalid organization ID' });
18:   }
    ```
    ```
    21:     return res.status(403).json({ 
22:       message: 'Access denied: You do not have permission to access this organization'
23:     });
    ```
- **src\middleware\auth\authorize-role.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    11:     if (!req.user) {
12:       return res.status(401).json({ message: 'User not authenticated' });
13:     }
    ```
    ```
    19:       return res.status(403).json({ 
20:         message: 'Access denied: Insufficient permissions',
21:         requiredRoles: roles,
    ```
- **src\models\order\validation-types.ts** (3 matches)
  - Unique matches: `feedback`
  - Sample context:
    ```
    21:   generated_cpt_codes?: string;
22:   generated_feedback_text?: string;
23:   generated_compliance_score?: number;
    ```
    ```
    23:   generated_compliance_score?: number;
24:   is_rare_disease_feedback?: boolean;
25:   llm_validation_log_id?: number;
    ```
    ```
    35:   complianceScore: number;
36:   feedback: string;
37:   suggestedICD10Codes: Array<{ code: string; description: string }>;
    ```
- **src\routes\organization.routes.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    11: router.get('/mine', authenticateJWT, (req, res) => {
12:   res.status(501).json({ message: 'Not implemented yet' });
13: });
    ```
    ```
    15: router.put('/mine', authenticateJWT, authorizeRole(['admin_referring', 'admin_radiology']), (req, res) => {
16:   res.status(501).json({ message: 'Not implemented yet' });
17: });
    ```
- **src\services\billing\credit\burn-credit.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    85:       console.error('Error in burnCredit:', error);
86:       throw new Error(`Failed to burn credit: ${error instanceof Error ? error.message : String(error)}`);
87:     }
    ```
- **src\services\billing\errors\insufficient-credits.error.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    4: export class InsufficientCreditsError extends Error {
5:   constructor(message: string = 'Insufficient credits available') {
6:     super(message);
    ```
    ```
    5:   constructor(message: string = 'Insufficient credits available') {
6:     super(message);
7:     this.name = 'InsufficientCreditsError';
    ```
- **src\services\billing\stripe\create-checkout-session-internal.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    41:     console.error('Error creating checkout session:', error);
42:     throw new Error(`Failed to create checkout session: ${error instanceof Error ? error.message : String(error)}`);
43:   }
    ```
- **src\services\billing\stripe\create-credit-checkout-session.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    60:     console.error('Error creating credit checkout session:', error);
61:     throw new Error(`Failed to create credit checkout session: ${error instanceof Error ? error.message : String(error)}`);
62:   }
    ```
- **src\services\billing\stripe\create-customer.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    38:     console.error('[BillingService] Error creating Stripe customer:', error);
39:     throw new Error(`Failed to create Stripe customer: ${error instanceof Error ? error.message : String(error)}`);
40:   }
    ```
- **src\services\billing\stripe\createSubscription.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    91:     
92:     // Re-throw with a more user-friendly message
93:     if (error instanceof Error) {
    ```
    ```
    93:     if (error instanceof Error) {
94:       throw new Error(`Failed to create subscription: ${error.message}`);
95:     } else {
    ```
- **src\services\billing\stripe\stripe.service.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    38:       console.error('Error creating Stripe customer:', error);
39:       throw new Error(`Failed to create Stripe customer: ${error instanceof Error ? error.message : String(error)}`);
40:     }
    ```
    ```
    58:       console.error('Error retrieving Stripe customer:', error);
59:       throw new Error(`Failed to retrieve Stripe customer: ${error instanceof Error ? error.message : String(error)}`);
60:     }
    ```
- **src\services\billing\stripe\webhooks\verify-signature.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    24:   } catch (error: any) {
25:     throw new Error(`Webhook signature verification failed: ${error.message}`);
26:   }
    ```
- **src\services\connection\services\approve-connection.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    53:         success: true,
54:         message: 'Connection request approved successfully',
55:         relationshipId
    ```
- **src\services\connection\services\reject-connection.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    51:         success: true,
52:         message: 'Connection request rejected successfully',
53:         relationshipId
    ```
- **src\services\connection\services\request-connection-helpers\create-new-relationship.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    35:     success: true,
36:     message: 'Connection request sent successfully',
37:     relationshipId: insertResult.rows[0].id
    ```
- **src\services\connection\services\request-connection-helpers\update-existing-relationship.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    36:     success: true,
37:     message: 'Connection request sent successfully',
38:     relationshipId: updateResult.rows[0].id
    ```
- **src\services\connection\services\request-connection.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    51:             success: false,
52:             message: 'A connection already exists between these organizations',
53:             relationshipId: existing.id,
    ```
    ```
    62:             success: false,
63:             message: 'A pending connection request already exists between these organizations',
64:             relationshipId: existing.id,
    ```
- **src\services\connection\services\terminate-connection.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    61:         success: true,
62:         message: 'Connection terminated successfully',
63:         relationshipId
    ```
- **src\services\connection\types.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    57:   success: boolean;
58:   message: string;
59:   relationshipId: number;
    ```
- **src\services\notification\manager\general.ts** (4 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    10:    * @param subject Email subject
11:    * @param message Email message
12:    */
    ```
    ```
    15:     subject: string,
16:     message: string
17:   ): Promise<void> {
    ```
    ```
    17:   ): Promise<void> {
18:     return generalNotifications.sendNotificationEmail(email, subject, message);
19:   }
    ```
- **src\services\notification\manager\index.ts** (4 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    43:    * @param subject Email subject
44:    * @param message Email message
45:    */
    ```
    ```
    48:     subject: string,
49:     message: string
50:   ): Promise<void> {
    ```
    ```
    50:   ): Promise<void> {
51:     return generalManager.sendNotificationEmail(email, subject, message);
52:   }
    ```
- **src\services\notification\notification-manager.ts** (4 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    45:    * @param subject Email subject
46:    * @param message Email message
47:    */
    ```
    ```
    50:     subject: string,
51:     message: string
52:   ): Promise<void> {
    ```
    ```
    52:   ): Promise<void> {
53:     return generalNotifications.sendNotificationEmail(email, subject, message);
54:   }
    ```
- **src\services\notification\services\general-notifications.ts** (4 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    12:    * @param subject Email subject
13:    * @param message Email message
14:    */
    ```
    ```
    17:     subject: string,
18:     message: string
19:   ): Promise<void> {
    ```
    ```
    26:       subject,
27:       message
28:     };
    ```
- **src\services\notification\templates\email-template-base.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    37:     <div class="footer">
38:       <p>This is an automated message, please do not reply to this email.</p>
39:     </div>`;
    ```
- **src\services\notification\templates\general-notification-template.ts** (3 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    14:     const notificationData = data as NotificationEmailData;
15:     const { subject, message } = notificationData;
16:     
    ```
    ```
    20: 
21: ${message}
22: 
    ```
    ```
    27:     const htmlContent = `
28:       <p>${message}</p>
29:     `;
    ```
- **src\services\notification\test-notification.js** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    29:       'Test Notification',
30:       'This is a test notification message.'
31:     );
    ```
- **src\services\notification\types.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    79:   subject: string;
80:   message: string;
81: }
    ```
- **src\services\order\admin\handlers\paste-summary.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    42:       orderId,
43:       message: 'EMR summary processed successfully',
44:       parsedData
    ```
- **src\services\order\admin\handlers\paste-supplemental.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    25:       orderId,
26:       message: 'Supplemental documents saved successfully'
27:     };
    ```
- **src\services\order\admin\handlers\send-to-radiology.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    79:       orderId,
80:       message: 'Order sent to radiology successfully'
81:     };
    ```
- **src\services\order\admin\handlers\update-insurance.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    27:       insuranceId,
28:       message: 'Insurance information updated successfully'
29:     };
    ```
- **src\services\order\admin\handlers\update-patient.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    27:       patientId,
28:       message: 'Patient information updated successfully'
29:     };
    ```
- **src\services\order\admin\types\emr-types.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    36:   orderId: number;
37:   message: string;
38:   parsedData: ParsedEmrData;
    ```
    ```
    46:   orderId: number;
47:   message: string;
48: }
    ```
- **src\services\order\admin\types\insurance-types.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    32:   insuranceId: number;
33:   message: string;
34: }
    ```
- **src\services\order\admin\types\order-types.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    18:   orderId: number;
19:   message: string;
20: }
    ```
- **src\services\order\admin\types\patient-types.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    43:   patientId: number;
44:   message: string;
45: }
    ```
- **src\services\order\finalize\transaction\execute-transaction.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    94:       orderId,
95:       message: "Order submitted successfully.",
96:       signatureUploadNote: payload.signatureData ?
    ```
- **src\services\order\finalize\types.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    39:   orderId: number;
40:   message: string;
41:   signatureUploadNote?: string; // Note about signature upload flow
    ```
- **src\services\order\radiology\information-request.service.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    77:       requestId,
78:       message: 'Information request created successfully'
79:     };
    ```
- **src\services\order\radiology\order-status.service.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    70:       newStatus,
71:       message: `Order status updated to ${newStatus}`
72:     };
    ```
- **src\services\order\radiology\types.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    58:   newStatus: string;
59:   message: string;
60: }
    ```
    ```
    68:   requestId: number;
69:   message: string;
70: }
    ```
- **src\services\order\validation\attempt-tracking\log-validation-attempt.ts** (2 matches)
  - Unique matches: `feedback`
  - Sample context:
    ```
    22:     (order_id, attempt_number, validation_input_text, validation_outcome, 
23:     generated_icd10_codes, generated_cpt_codes, generated_feedback_text, 
24:     generated_compliance_score, user_id, created_at) 
    ```
    ```
    32:       JSON.stringify(validationResult.suggestedCPTCodes),
33:       validationResult.feedback,
34:       validationResult.complianceScore,
    ```
- **src\services\order.service.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    39:     userId: number
40:   ): Promise<{ success: boolean; orderId: number; message: string }> {
41:     return handleFinalizeOrder(orderId, payload, userId);
    ```
- **src\services\upload\document-upload.service.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    64:     console.error('[FileUploadService] Error recording document upload:', error);
65:     throw new Error(`Failed to record document upload: ${error.message || 'Unknown error'}`);
66:   }
    ```
- **src\services\upload\presigned-url.service.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    95:   } catch (error: any) {
96:     console.error(`[FileUploadService] Error generating presigned URL: ${error.message}`);
97:     throw error;
    ```
- **src\services\upload\s3-client.service.ts** (1 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    35:     } catch (error: any) {
36:       console.error(`[FileUploadService] Error initializing S3 client: ${error.message}`);
37:       throw error;
    ```
- **src\services\validation\llm-logging.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    34:     const err = error as Error;
35:     if (err.message && err.message.includes('relation "llm_validation_logs" does not exist')) {
36:       console.log('llm_validation_logs table does not exist. Skipping LLM usage logging.');
    ```
- **src\services\validation\logging.ts** (2 matches)
  - Unique matches: `feedback`
  - Sample context:
    ```
    46:         generated_cpt_codes,
47:         generated_feedback_text,
48:         generated_compliance_score,
    ```
    ```
    58:         cptCodes,
59:         validationResult.feedback,
60:         validationResult.complianceScore,
    ```
- **src\utils\llm\providers\anthropic.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    24:   try {
25:     const response = await fetch('https://api.anthropic.com/v1/messages', {
26:       method: 'POST',
    ```
    ```
    34:         max_tokens: config.llm.maxTokens,
35:         messages: [
36:           { role: 'user', content: prompt }
    ```
- **src\utils\llm\providers\grok.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    32:         model: modelName,
33:         messages: [
34:           { role: 'user', content: prompt }
    ```
    ```
    51:       model: data.model,
52:       content: data.choices[0].message.content,
53:       promptTokens: data.usage.prompt_tokens,
    ```
- **src\utils\llm\providers\openai.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    32:         model: modelName,
33:         messages: [
34:           { role: 'user', content: prompt }
    ```
    ```
    51:       model: data.model,
52:       content: data.choices[0].message.content,
53:       promptTokens: data.usage.prompt_tokens,
    ```
- **src\utils\llm\types.ts** (2 matches)
  - Unique matches: `message`
  - Sample context:
    ```
    54:     index: number;
55:     message: {
56:       role: string;
    ```
    ```
    77:     index: number;
78:     message: {
79:       role: string;
    ```
- **src\utils\response\extractor.ts** (6 matches)
  - Unique matches: `feedback`
  - Sample context:
    ```
    14:   
15:   // Try to extract feedback
16:   const feedbackMatch = responseContent.match(/feedback[\s:]+([^\n]+)/i);
    ```
    ```
    15:   // Try to extract feedback
16:   const feedbackMatch = responseContent.match(/feedback[\s:]+([^\n]+)/i);
17:   if (feedbackMatch) {
    ```
    ```
    16:   const feedbackMatch = responseContent.match(/feedback[\s:]+([^\n]+)/i);
17:   if (feedbackMatch) {
18:     result.feedback = feedbackMatch[1].trim();
    ```
    ... and 1 more matches
- **src\utils\response\normalizer\normalize-response-fields.ts** (7 matches)
  - Unique matches: `feedback`, `message`
  - Sample context:
    ```
    20:     
21:     // feedback variations
22:     'feedback_text': 'feedback',
    ```
    ```
    21:     // feedback variations
22:     'feedback_text': 'feedback',
23:     'feedbacktext': 'feedback',
    ```
    ```
    22:     'feedback_text': 'feedback',
23:     'feedbacktext': 'feedback',
24:     'message': 'feedback',
    ```
    ... and 1 more matches
- **src\utils\response\processor.ts** (6 matches)
  - Unique matches: `message`, `feedback`
  - Sample context:
    ```
    36:       console.error("Failed to parse JSON from LLM response:", error);
37:       throw new Error(`Failed to parse JSON from LLM response: ${error instanceof Error ? error.message : String(error)}`);
38:     }
    ```
    ```
    56:       complianceScore: normalizedResponse.complianceScore,
57:       feedback: normalizedResponse.feedback,
58:       suggestedICD10Codes: normalizedICD10Codes,
    ```
    ```
    72:       complianceScore: extractedInfo.complianceScore || 0,
73:       feedback: extractedInfo.feedback || 'Unable to process the validation request. Please try again or contact support if the issue persists.',
74:       suggestedICD10Codes: extractedInfo.icd10Codes || [],
    ```
    ... and 1 more matches
- **src\utils\response\types.ts** (2 matches)
  - Unique matches: `feedback`
  - Sample context:
    ```
    7:   complianceScore?: number;
8:   feedback?: string;
9:   icd10Codes?: Array<{ code: string; description: string }>;
    ```
    ```
    18:   complianceScore: number;
19:   feedback: string;
20:   suggestedICD10Codes: any;
    ```
- **src\utils\response\validator\validate-required-fields.ts** (1 matches)
  - Unique matches: `feedback`
  - Sample context:
    ```
    7:     'complianceScore',
8:     'feedback',
9:     'suggestedICD10Codes',
    ```

### Internal Reasoning Field Names

- Files affected: 4
- Total matches: 15

#### Affected Files

- **src\models\order\validation-types.ts** (1 matches)
  - Unique matches: `internalReasoning`
  - Sample context:
    ```
    38:   suggestedCPTCodes: Array<{ code: string; description: string }>;
39:   internalReasoning: string;
40: }
    ```
- **src\utils\response\normalizer\normalize-response-fields.ts** (9 matches)
  - Unique matches: `internalReasoning`, `reasoning`, `internal_reasoning`, `rationale`
  - Sample context:
    ```
    40:     
41:     // internalReasoning variations
42:     'internalreasoning': 'internalReasoning',
    ```
    ```
    41:     // internalReasoning variations
42:     'internalreasoning': 'internalReasoning',
43:     'internal_reasoning': 'internalReasoning',
    ```
    ```
    42:     'internalreasoning': 'internalReasoning',
43:     'internal_reasoning': 'internalReasoning',
44:     'reasoning': 'internalReasoning',
    ```
    ... and 2 more matches
- **src\utils\response\processor.ts** (4 matches)
  - Unique matches: `internalReasoning`, `reasoning`
  - Sample context:
    ```
    59:       suggestedCPTCodes: normalizedCPTCodes,
60:       internalReasoning: normalizedResponse.internalReasoning || 'No internal reasoning provided'
61:     };
    ```
    ```
    75:       suggestedCPTCodes: extractedInfo.cptCodes || [],
76:       internalReasoning: `Error processing LLM response: ${error instanceof Error ? error.message : 'Unknown error'}`
77:     };
    ```
- **src\utils\response\types.ts** (1 matches)
  - Unique matches: `internalReasoning`
  - Sample context:
    ```
    21:   suggestedCPTCodes: any;
22:   internalReasoning?: string;
23: }
    ```

### Normalization Functions

- Files affected: 7
- Total matches: 42

#### Affected Files

- **src\utils\response\index.ts** (3 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    5: export { processLLMResponse } from './processor';
6: export { normalizeResponseFields, normalizeCodeArray } from './normalizer';
7: export { validateRequiredFields, validateValidationStatus } from './validator';
    ```
- **src\utils\response\normalizer\index.ts** (9 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    1: /**
2:  * Response normalizer functions
3:  */
    ```
    ```
    5: // Import functions
6: import { normalizeResponseFields } from './normalize-response-fields';
7: import { normalizeCodeArray } from './normalize-code-array';
    ```
    ```
    6: import { normalizeResponseFields } from './normalize-response-fields';
7: import { normalizeCodeArray } from './normalize-code-array';
8: 
    ```
    ... and 4 more matches
- **src\utils\response\normalizer\normalize-code-array.ts** (1 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    3:  */
4: export function normalizeCodeArray(codes: any): Array<{ code: string; description: string; isPrimary?: boolean }> {
5:   if (!codes) return [];
    ```
- **src\utils\response\normalizer\normalize-response-fields.ts** (7 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    5:  */
6: export function normalizeResponseFields(response: any): any {
7:   const normalized: any = {};
    ```
    ```
    6: export function normalizeResponseFields(response: any): any {
7:   const normalized: any = {};
8:   
    ```
    ```
    8:   
9:   // Map of possible field names to normalized field names
10:   const fieldMap: FieldMap = {
    ```
    ... and 3 more matches
- **src\utils\response\processor.ts** (19 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    1: import { ValidationResult, ValidationStatus } from '../../models';
2: import { normalizeResponseFields, normalizeCodeArray } from './normalizer';
3: import { validateRequiredFields, validateValidationStatus } from './validator';
    ```
    ```
    40:     // Normalize field names (handle potential casing issues)
41:     const normalizedResponse = normalizeResponseFields(parsedResponse);
42:     
    ```
    ```
    43:     // Validate required fields
44:     validateRequiredFields(normalizedResponse);
45:     
    ```
    ... and 9 more matches
- **src\utils\response\types.ts** (1 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    13: /**
14:  * Interface for normalized response fields
15:  */
    ```
- **src\utils\response\validator\validate-validation-status.ts** (2 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    8:   // Convert to lowercase for case-insensitive comparison
9:   const normalizedStatus = status.toLowerCase();
10:   
    ```
    ```
    20:   // Check if the status is valid
21:   if (!statusMap[normalizedStatus]) {
22:     throw new Error(`Invalid validationStatus: ${status}`);
    ```

### isPrimary Flag

- Files affected: 2
- Total matches: 6

#### Affected Files

- **src\services\order\admin\types\insurance-types.ts** (1 matches)
  - Unique matches: `isPrimary`
  - Sample context:
    ```
    12:   verificationStatus?: string;
13:   isPrimary?: boolean;
14:   [key: string]: any;
    ```
- **src\utils\response\normalizer\normalize-code-array.ts** (5 matches)
  - Unique matches: `isPrimary`
  - Sample context:
    ```
    3:  */
4: export function normalizeCodeArray(codes: any): Array<{ code: string; description: string; isPrimary?: boolean }> {
5:   if (!codes) return [];
    ```
    ```
    11:       description: item.description || '',
12:       isPrimary: item.isPrimary === true
13:     }));
    ```
    ```
    21:       description: '',
22:       isPrimary: index === 0
23:     }));
    ```
    ... and 1 more matches

### Strict Comparison

- Files affected: 3
- Total matches: 3

#### Affected Files

- **src\controllers\order-management\validation\validate-finalize-payload.ts** (1 matches)
  - Unique matches: `=== true`
  - Sample context:
    ```
    36:   // If this is an override, ensure justification is provided
37:   const overridden = rawPayload.overridden || rawPayload.overridden === true;
38:   const overrideJustification = rawPayload.overrideJustification || rawPayload.override_justification;
    ```
- **src\services\upload\document-upload.service.ts** (1 matches)
  - Unique matches: `=== true`
  - Sample context:
    ```
    35:     const isTestMode = process.env.NODE_ENV === 'test' ||
36:                       (global as any).isTestMode === true ||
37:                       (orderId === 1 || orderId === 999); // Special test order IDs
    ```
- **src\utils\response\normalizer\normalize-code-array.ts** (1 matches)
  - Unique matches: `=== true`
  - Sample context:
    ```
    11:       description: item.description || '',
12:       isPrimary: item.isPrimary === true
13:     }));
    ```

### Field Mapping

- Files affected: 5
- Total matches: 14

#### Affected Files

- **src\services\order\admin\patient\update-info.ts** (3 matches)
  - Unique matches: `fieldMap`
  - Sample context:
    ```
    14:   // Map patientData fields to database columns
15:   const fieldMap: { [key: string]: string } = {
16:     firstName: 'first_name',
    ```
    ```
    36:   for (const [key, value] of Object.entries(patientData)) {
37:     if (fieldMap[key] && value !== undefined) {
38:       updateFields.push(`${fieldMap[key]} = $${valueIndex}`);
    ```
    ```
    37:     if (fieldMap[key] && value !== undefined) {
38:       updateFields.push(`${fieldMap[key]} = $${valueIndex}`);
39:       updateValues.push(value);
    ```
- **src\services\order\admin\patient-manager\update-patient-from-emr.ts** (2 matches)
  - Unique matches: `fieldMap`
  - Sample context:
    ```
    18:   // Map EMR fields to database columns
19:   const fieldMap: { [key: string]: string } = {
20:     address: 'address_line1',
    ```
    ```
    33:     patientId,
34:     fieldMap,
35:     true,
    ```
- **src\services\order\admin\patient-manager\update-patient-info.ts** (2 matches)
  - Unique matches: `fieldMap`
  - Sample context:
    ```
    15:   // Map patientData fields to database columns
16:   const fieldMap: { [key: string]: string } = {
17:     firstName: 'first_name',
    ```
    ```
    37:     patientId,
38:     fieldMap,
39:     true,
    ```
- **src\services\order\admin\utils\query-builder\build-update-query.ts** (5 matches)
  - Unique matches: `fieldMap`
  - Sample context:
    ```
    8:  * @param idValue Value of the ID
9:  * @param fieldMap Optional mapping of object keys to database columns
10:  * @param includeTimestamp Whether to include updated_at = NOW() (default: true)
    ```
    ```
    18:   idValue: any,
19:   fieldMap?: { [key: string]: string },
20:   includeTimestamp: boolean = true,
    ```
    ```
    30:     
31:     // Get the database column name (either from fieldMap or use the key directly)
32:     const columnName = fieldMap ? fieldMap[key] || key : key;
    ```
    ... and 1 more matches
- **src\utils\response\normalizer\normalize-response-fields.ts** (2 matches)
  - Unique matches: `fieldMap`
  - Sample context:
    ```
    9:   // Map of possible field names to normalized field names
10:   const fieldMap: FieldMap = {
11:     // validationStatus variations
    ```
    ```
    49:   for (const [key, value] of Object.entries(response)) {
50:     const normalizedKey = fieldMap[key.toLowerCase()] || key;
51:     normalized[normalizedKey] = value;
    ```

### JSON Parsing

- Files affected: 1
- Total matches: 1

#### Affected Files

- **src\utils\response\processor.ts** (1 matches)
  - Unique matches: `JSON.parse`
  - Sample context:
    ```
    33:     try {
34:       parsedResponse = JSON.parse(jsonContent);
35:     } catch (error) {
    ```

### Validation

- Files affected: 49
- Total matches: 129

#### Affected Files

- **src\controllers\connection\approve.controller.ts** (2 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    5: import { handleConnectionError } from './error-utils';
6: import { validateRelationshipId } from './validation-utils';
7: 
    ```
    ```
    19:     // Validate relationship ID
20:     const relationshipId = validateRelationshipId(req, res);
21:     if (relationshipId === null) return;
    ```
- **src\controllers\connection\reject.controller.ts** (2 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    5: import { handleConnectionError } from './error-utils';
6: import { validateRelationshipId } from './validation-utils';
7: 
    ```
    ```
    19:     // Validate relationship ID
20:     const relationshipId = validateRelationshipId(req, res);
21:     if (relationshipId === null) return;
    ```
- **src\controllers\connection\request.controller.ts** (2 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    5: import { handleConnectionError } from './error-utils';
6: import { validateTargetOrgId } from './validation-utils';
7: 
    ```
    ```
    19:     // Validate target organization ID
20:     const targetOrgId = validateTargetOrgId(req, res, user.orgId);
21:     if (targetOrgId === null) return;
    ```
- **src\controllers\connection\terminate.controller.ts** (2 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    5: import { handleConnectionError } from './error-utils';
6: import { validateRelationshipId } from './validation-utils';
7: 
    ```
    ```
    19:     // Validate relationship ID
20:     const relationshipId = validateRelationshipId(req, res);
21:     if (relationshipId === null) return;
    ```
- **src\controllers\connection\validation-utils\index.ts** (8 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    5: // Import functions
6: import { validateRelationshipId } from './validate-relationship-id';
7: import { validateTargetOrgId } from './validate-target-org-id';
    ```
    ```
    6: import { validateRelationshipId } from './validate-relationship-id';
7: import { validateTargetOrgId } from './validate-target-org-id';
8: 
    ```
    ```
    9: // Re-export functions
10: export { validateRelationshipId };
11: export { validateTargetOrgId };
    ```
    ... and 3 more matches
- **src\controllers\connection\validation-utils\validate-relationship-id.ts** (2 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    6:  * @param res Express response object
7:  * @returns The validated relationship ID if valid, null otherwise
8:  */
    ```
    ```
    8:  */
9: export function validateRelationshipId(req: Request, res: Response): number | null {
10:   const relationshipId = parseInt(req.params.relationshipId);
    ```
- **src\controllers\connection\validation-utils\validate-target-org-id.ts** (2 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    7:  * @param initiatingOrgId The initiating organization ID for comparison
8:  * @returns The validated target organization ID if valid, null otherwise
9:  */
    ```
    ```
    9:  */
10: export function validateTargetOrgId(req: Request, res: Response, initiatingOrgId: number): number | null {
11:   const { targetOrgId } = req.body;
    ```
- **src\controllers\location\organization\deactivate-location.ts** (2 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    6:   checkAuthentication,
7:   validateLocationId,
8:   handleControllerError
    ```
    ```
    26:     // Validate location ID
27:     if (!validateLocationId(req, res)) {
28:       return;
    ```
- **src\controllers\location\organization\get-location.ts** (2 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    6:   checkAuthentication,
7:   validateLocationId,
8:   handleControllerError
    ```
    ```
    26:     // Validate location ID
27:     if (!validateLocationId(req, res)) {
28:       return;
    ```
- **src\controllers\location\organization\update-location.ts** (2 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    6:   checkAuthentication,
7:   validateLocationId,
8:   handleControllerError
    ```
    ```
    26:     // Validate location ID
27:     if (!validateLocationId(req, res)) {
28:       return;
    ```
- **src\controllers\location\types.ts** (3 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    50:  */
51: export function validateLocationId(req: AuthenticatedRequest, res: Response): boolean {
52:   const locationId = parseInt(req.params.locationId);
    ```
    ```
    67:  */
68: export function validateUserId(req: AuthenticatedRequest, res: Response): boolean {
69:   const userId = parseInt(req.params.userId);
    ```
    ```
    84:  */
85: export function validateUserAndLocationIds(req: AuthenticatedRequest, res: Response): boolean {
86:   const userId = parseInt(req.params.userId);
    ```
- **src\controllers\location\user\assign-user-to-location.ts** (2 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    6:   checkAuthentication,
7:   validateUserAndLocationIds,
8:   handleControllerError
    ```
    ```
    26:     // Validate user and location IDs
27:     if (!validateUserAndLocationIds(req, res)) {
28:       return;
    ```
- **src\controllers\location\user\list-user-locations.ts** (2 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    6:   checkAuthentication,
7:   validateUserId,
8:   handleControllerError
    ```
    ```
    26:     // Validate user ID
27:     if (!validateUserId(req, res)) {
28:       return;
    ```
- **src\controllers\location\user\unassign-user-from-location.ts** (2 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    6:   checkAuthentication,
7:   validateUserAndLocationIds,
8:   handleControllerError
    ```
    ```
    26:     // Validate user and location IDs
27:     if (!validateUserAndLocationIds(req, res)) {
28:       return;
    ```
- **src\controllers\order-management\handlers\admin-update.ts** (2 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    8: import { handleControllerError } from '../error-handling';
9: import { validateOrderId } from '../validation';
10: import { queryMainDb, queryPhiDb } from '../../../config/db';
    ```
    ```
    18:     // Validate order ID
19:     if (!validateOrderId(req, res)) {
20:       return;
    ```
- **src\controllers\order-management\handlers\finalize-order.ts** (6 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    2: import OrderService from '../../../services/order.service';
3: import { validateOrderId, validateFinalizePayload, validateUserAuth } from '../validation';
4: import { handleControllerError } from '../error-handling';
    ```
    ```
    14:     // Validate order ID
15:     if (!validateOrderId(req, res)) {
16:       return;
    ```
    ```
    19:     // Validate payload
20:     if (!validateFinalizePayload(req, res)) {
21:       return;
    ```
    ... and 1 more matches
- **src\controllers\order-management\handlers\get-order.ts** (4 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    2: import OrderService from '../../../services/order.service';
3: import { validateOrderId, validateUserAuth } from '../validation';
4: import { handleControllerError } from '../error-handling';
    ```
    ```
    13:     // Validate order ID
14:     if (!validateOrderId(req, res)) {
15:       return;
    ```
    ```
    18:     // Validate user authentication
19:     const userId = validateUserAuth(req, res);
20:     if (!userId) {
    ```
- **src\controllers\order-management\validation\index.ts** (6 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    6: 
7: export { validateOrderId } from './validate-order-id';
8: export { validateFinalizePayload } from './validate-finalize-payload';
    ```
    ```
    7: export { validateOrderId } from './validate-order-id';
8: export { validateFinalizePayload } from './validate-finalize-payload';
9: export { validateUserAuth } from './validate-user-auth';
    ```
    ```
    8: export { validateFinalizePayload } from './validate-finalize-payload';
9: export { validateUserAuth } from './validate-user-auth';
    ```
- **src\controllers\order-management\validation\validate-finalize-payload.ts** (1 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    10:  */
11: export function validateFinalizePayload(req: Request, res: Response): boolean {
12:   const rawPayload = req.body;
    ```
- **src\controllers\order-management\validation\validate-order-id.ts** (1 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    8:  */
9: export function validateOrderId(req: Request, res: Response): boolean {
10:   const orderId = parseInt(req.params.orderId);
    ```
- **src\controllers\order-management\validation\validate-user-auth.ts** (1 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    8:  */
9: export function validateUserAuth(req: Request, res: Response): number | undefined {
10:   const userId = req.user?.userId;
    ```
- **src\controllers\order-validation.controller.ts** (3 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    9:    * Validate an order
10:    * @route POST /api/orders/validate
11:    */
    ```
    ```
    11:    */
12:   async validateOrder(req: Request, res: Response): Promise<void> {
13:     try {
    ```
    ```
    43:     } catch (error) {
44:       console.error('Error in validateOrder controller:', error);
45:       
    ```
- **src\controllers\uploads\confirm-upload.ts** (3 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    6: import { AuthenticatedRequest, ConfirmUploadRequestBody, ConfirmUploadResponse } from './types';
7: import { validateConfirmUploadRequest } from './validate-confirm-upload-request';
8: 
    ```
    ```
    25:     // Validate the request
26:     if (!(await validateConfirmUploadRequest(req, res))) {
27:       return;
    ```
- **src\controllers\uploads\get-presigned-url.ts** (3 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    6: import { AuthenticatedRequest, PresignedUrlRequestBody, PresignedUrlResponse } from './types';
7: import { validatePresignedUrlRequest } from './validate-presigned-url-request';
8: 
    ```
    ```
    23:     // Validate the request
24:     if (!validatePresignedUrlRequest(req, res)) {
25:       return;
    ```
- **src\controllers\uploads\index.ts** (4 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    11: // Export validation functions
12: export { validatePresignedUrlRequest } from './validate-presigned-url-request';
13: export { validateConfirmUploadRequest } from './validate-confirm-upload-request';
    ```
    ```
    12: export { validatePresignedUrlRequest } from './validate-presigned-url-request';
13: export { validateConfirmUploadRequest } from './validate-confirm-upload-request';
14: 
    ```
- **src\controllers\uploads\validate-confirm-upload-request.ts** (1 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    10:  */
11: export async function validateConfirmUploadRequest(
12:   req: AuthenticatedRequest,
    ```
- **src\controllers\uploads\validate-presigned-url-request.ts** (1 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    9:  */
10: export function validatePresignedUrlRequest(
11:   req: AuthenticatedRequest,
    ```
- **src\models\order\order-types.ts** (1 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    31:   final_validation_notes?: string;
32:   validated_at?: Date;
33:   override_justification?: string;
    ```
- **src\routes\orders.routes.ts** (3 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    8: /**
9:  * @route   POST /api/orders/validate
10:  * @desc    Validate an order
    ```
    ```
    13: router.post(
14:   '/validate',
15:   authenticateJWT,
    ```
    ```
    16:   authorizeRole(['physician']),
17:   orderValidationController.validateOrder
18: );
    ```
- **src\services\order\admin\handlers\send-to-radiology.ts** (2 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    28:     // Validate patient and insurance data
29:     const missingPatientFields = validation.validatePatientFields(patient);
30:     const missingInsuranceFields = validation.validateInsuranceFields(insurance);
    ```
    ```
    29:     const missingPatientFields = validation.validatePatientFields(patient);
30:     const missingInsuranceFields = validation.validateInsuranceFields(insurance);
31:     
    ```
- **src\services\order\admin\order-status-manager\index.ts** (8 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    6: import { updateOrderStatusToRadiology } from './update-order-status';
7: import { validatePatientData } from './validate-patient-data';
8: import { validateInsuranceData } from './validate-insurance-data';
    ```
    ```
    7: import { validatePatientData } from './validate-patient-data';
8: import { validateInsuranceData } from './validate-insurance-data';
9: 
    ```
    ```
    11: export { updateOrderStatusToRadiology };
12: export { validatePatientData };
13: export { validateInsuranceData };
    ```
    ... and 3 more matches
- **src\services\order\admin\order-status-manager\validate-insurance-data.ts** (1 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    5:  */
6: export function validateInsuranceData(insurance: any): string[] {
7:   const missingFields = [];
    ```
- **src\services\order\admin\order-status-manager\validate-patient-data.ts** (1 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    5:  */
6: export function validatePatientData(patient: any): string[] {
7:   const missingPatientFields = [];
    ```
- **src\services\order\admin\validation\index.ts** (6 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    5: // Import functions
6: import { getPatientForValidation, validatePatientFields } from './patient';
7: import { getPrimaryInsurance, validateInsuranceFields } from './insurance';
    ```
    ```
    6: import { getPatientForValidation, validatePatientFields } from './patient';
7: import { getPrimaryInsurance, validateInsuranceFields } from './insurance';
8: 
    ```
    ```
    9: // Re-export functions
10: export { getPatientForValidation, validatePatientFields };
11: export { getPrimaryInsurance, validateInsuranceFields };
    ```
    ... and 3 more matches
- **src\services\order\admin\validation\insurance\index.ts** (2 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    1: export { getPrimaryInsurance } from './get-primary-insurance';
2: export { validateInsuranceFields } from './validate-insurance-fields';
    ```
- **src\services\order\admin\validation\insurance\validate-insurance-fields.ts** (1 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    7:  */
8: export function validateInsuranceFields(insurance: InsuranceData | null): string[] {
9:   const missingFields = [];
    ```
- **src\services\order\admin\validation\patient\index.ts** (2 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    1: export { getPatientForValidation } from './get-patient-for-validation';
2: export { validatePatientFields } from './validate-patient-fields';
    ```
- **src\services\order\admin\validation\patient\validate-patient-fields.ts** (1 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    7:  */
8: export function validatePatientFields(patient: PatientData): string[] {
9:   const missingPatientFields = [];
    ```
- **src\services\order\finalize\update\update-order-with-final-data.ts** (1 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    36:     signature_date = NOW(),
37:     validated_at = NOW(),
38:     updated_at = NOW(),
    ```
- **src\services\order\radiology\order-export\export-order.ts** (3 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    2: import { getOrderDetails } from '../order-details.service';
3: import { validateExportFormat } from './validate-export-format';
4: import { exportAsJson } from './export-as-json';
    ```
    ```
    15:     // Validate the requested format
16:     validateExportFormat(format);
17:     
    ```
- **src\services\order\radiology\order-export\index.ts** (3 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    5: // Import functions
6: import { validateExportFormat } from './validate-export-format';
7: import { exportAsJson } from './export-as-json';
    ```
    ```
    10: // Re-export functions
11: export { validateExportFormat };
12: export { exportAsJson };
    ```
- **src\services\order\radiology\order-export\validate-export-format.ts** (2 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    2:  * Validate the requested export format
3:  * @param format Export format to validate
4:  * @throws Error if format is not supported
    ```
    ```
    5:  */
6: export function validateExportFormat(format: string): void {
7:   const supportedFormats = ['json', 'csv', 'pdf'];
    ```
- **src\services\order\radiology\query\order-builder\sorting.ts** (4 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    19:     
20:     const validatedSortBy = validSortColumns.includes(sortBy) 
21:       ? sortBy 
    ```
    ```
    23:     
24:     const validatedSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC';
25:     
    ```
    ```
    25:     
26:     query += ` ORDER BY o.${validatedSortBy} ${validatedSortOrder}`;
27:   } else {
    ```
- **src\services\order\validation\handler.ts** (1 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    16:  * 
17:  * @param dictationText - The dictation text to validate
18:  * @param patientInfo - Information about the patient
    ```
- **src\utils\response\index.ts** (2 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    6: export { normalizeResponseFields, normalizeCodeArray } from './normalizer';
7: export { validateRequiredFields, validateValidationStatus } from './validator';
8: export { extractPartialInformation } from './extractor';
    ```
- **src\utils\response\processor.ts** (4 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    2: import { normalizeResponseFields, normalizeCodeArray } from './normalizer';
3: import { validateRequiredFields, validateValidationStatus } from './validator';
4: import { extractPartialInformation } from './extractor';
    ```
    ```
    43:     // Validate required fields
44:     validateRequiredFields(normalizedResponse);
45:     
    ```
    ```
    46:     // Ensure validationStatus is a valid enum value
47:     validateValidationStatus(normalizedResponse.validationStatus);
48:     
    ```
- **src\utils\response\validator\index.ts** (8 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    5: // Import functions
6: import { validateRequiredFields } from './validate-required-fields';
7: import { validateValidationStatus } from './validate-validation-status';
    ```
    ```
    6: import { validateRequiredFields } from './validate-required-fields';
7: import { validateValidationStatus } from './validate-validation-status';
8: 
    ```
    ```
    9: // Re-export functions
10: export { validateRequiredFields };
11: export { validateValidationStatus };
    ```
    ... and 3 more matches
- **src\utils\response\validator\validate-required-fields.ts** (1 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    3:  */
4: export function validateRequiredFields(response: any): void {
5:   const requiredFields = [
    ```
- **src\utils\response\validator\validate-validation-status.ts** (1 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    6:  */
7: export function validateValidationStatus(status: string): void {
8:   // Convert to lowercase for case-insensitive comparison
    ```

## Recommendations

1. **Standardize Field Names**
   - Use the `ValidationResult` interface as the standard (suggestedICD10Codes, suggestedCPTCodes)
   - Update all templates to use these standard field names

2. **Fix isPrimary Flag Issues**
   - Update the normalizeCodeArray function to properly preserve the isPrimary flag
   - Fix: Change `isPrimary: item.isPrimary === true` to `isPrimary: Boolean(item.isPrimary)`

3. **Gradual Normalization Removal**
   - Start with isolated components
   - Work inward toward core logic
   - Implement changes in small, testable increments

