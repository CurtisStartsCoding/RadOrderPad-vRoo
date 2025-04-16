# Focused Normalization Audit Report

Generated on: 4/15/2025, 5:28:07 PM

## Summary

- Total unique files affected: 20
- Total pattern matches found: 107

## Directory Breakdown

- **src\routes**: 12 files (60.0%)
- **tests\e2e**: 10 files (50.0%)
- **src\services\order\radiology\details**: 9 files (45.0%)
- **src\services\order\radiology\query\order-builder**: 9 files (45.0%)
- **tests\batch**: 8 files (40.0%)
- **src\controllers\admin-order**: 7 files (35.0%)
- **src\controllers\connection**: 7 files (35.0%)
- **src\controllers\radiology**: 7 files (35.0%)
- **src\services\billing\stripe**: 7 files (35.0%)
- **src\services\location**: 7 files (35.0%)
- **src\services\order\radiology**: 7 files (35.0%)
- **src\utils\database**: 7 files (35.0%)
- **src\controllers\location\organization**: 6 files (30.0%)
- **src\controllers\uploads**: 6 files (30.0%)
- **src\services\auth\organization**: 6 files (30.0%)
- **src\services\auth\user**: 6 files (30.0%)
- **src\services\billing\stripe\webhooks**: 6 files (30.0%)
- **src\services\connection\services**: 6 files (30.0%)
- **src\services\location\services**: 6 files (30.0%)
- **src\services\notification\services\connection-notifications**: 6 files (30.0%)
- **src\services\order\admin\handlers**: 6 files (30.0%)
- **tests**: 6 files (30.0%)
- **src\middleware\auth**: 5 files (25.0%)
- **src\models**: 5 files (25.0%)
- **src\models\order**: 5 files (25.0%)
- **src\services\connection\queries\request**: 5 files (25.0%)
- **src\services\notification**: 5 files (25.0%)
- **src\services\notification\templates\connection**: 5 files (25.0%)
- **src\services\notification\templates**: 5 files (25.0%)
- **src\services\order\admin**: 5 files (25.0%)
- **src\services\order\admin\types**: 5 files (25.0%)
- **src\services\upload**: 5 files (25.0%)
- **src\services\validation**: 5 files (25.0%)
- **src\utils\text-processing\medical-terms**: 5 files (25.0%)
- **src\config**: 4 files (20.0%)
- **src\controllers\auth**: 4 files (20.0%)
- **src\controllers\location\user**: 4 files (20.0%)
- **src\controllers\order-management\handlers**: 4 files (20.0%)
- **src\controllers\order-management\validation**: 4 files (20.0%)
- **src\services\location\queries\user**: 4 files (20.0%)
- **src\services\location\services\user-location-management**: 4 files (20.0%)
- **src\services\location\user**: 4 files (20.0%)
- **src\services\notification\email-sender**: 4 files (20.0%)
- **src\services\notification\manager**: 4 files (20.0%)
- **src\services\notification\services**: 4 files (20.0%)
- **src\services\notification\services\connection\request**: 4 files (20.0%)
- **src\services\order\admin\clinical-record-manager**: 4 files (20.0%)
- **src\services\order\admin\order-status-manager**: 4 files (20.0%)
- **src\services\order\admin\utils\query-builder**: 4 files (20.0%)
- **src\services\order\radiology\order-export**: 4 files (20.0%)
- **src\services\order\validation**: 4 files (20.0%)
- **src\utils\llm\providers**: 4 files (20.0%)
- **src\utils\response**: 4 files (20.0%)
- **src\utils\text-processing\keyword-extractor**: 4 files (20.0%)
- **src\controllers**: 3 files (15.0%)
- **src\controllers\billing**: 3 files (15.0%)
- **src\controllers\connection\list**: 3 files (15.0%)
- **src\controllers\connection\validation-utils**: 3 files (15.0%)
- **src\controllers\superadmin\organizations**: 3 files (15.0%)
- **src\controllers\superadmin\users**: 3 files (15.0%)
- **src\services\billing\credit**: 3 files (15.0%)
- **src\services\billing\stripe\webhooks\handle-invoice-payment-failed**: 3 files (15.0%)
- **src\services\billing\stripe\webhooks\handle-subscription-updated**: 3 files (15.0%)
- **src\services\connection**: 3 files (15.0%)
- **src\services\connection\queries\approve**: 3 files (15.0%)
- **src\services\connection\queries\list**: 3 files (15.0%)
- **src\services\connection\queries\terminate**: 3 files (15.0%)
- **src\services\connection\services\request-connection-helpers**: 3 files (15.0%)
- **src\services\location\manager**: 3 files (15.0%)
- **src\services\notification\email-sender\test-mode**: 3 files (15.0%)
- **src\services\notification\services\connection\approval**: 3 files (15.0%)
- **src\services\notification\services\connection\rejection**: 3 files (15.0%)
- **src\services\notification\services\connection\termination**: 3 files (15.0%)
- **src\services\order\admin\insurance**: 3 files (15.0%)
- **src\services\order\admin\patient**: 3 files (15.0%)
- **src\services\order\admin\patient-manager**: 3 files (15.0%)
- **src\services\order\admin\validation\insurance**: 3 files (15.0%)
- **src\services\order\admin\validation\patient**: 3 files (15.0%)
- **src\services\order\finalize**: 3 files (15.0%)
- **src\services\order\radiology\query**: 3 files (15.0%)
- **src\services\order\radiology\query\order-builder\metadata-filters**: 3 files (15.0%)
- **src\services\order\validation\attempt-tracking**: 3 files (15.0%)
- **src\services**: 3 files (15.0%)
- **src\services\superadmin\organizations**: 3 files (15.0%)
- **src\services\superadmin\users**: 3 files (15.0%)
- **src\utils\llm**: 3 files (15.0%)
- **src\utils\response\normalizer**: 3 files (15.0%)
- **src\utils\response\validator**: 3 files (15.0%)
- **src\utils\text-processing\code-extractor\common**: 3 files (15.0%)
- **src\utils\text-processing**: 3 files (15.0%)
- **src\controllers\location**: 2 files (10.0%)
- **src\controllers\order-management\error-handling**: 2 files (10.0%)
- **src\controllers\order-management**: 2 files (10.0%)
- **src\services\auth**: 2 files (10.0%)
- **src\services\auth\token**: 2 files (10.0%)
- **src\services\billing\errors**: 2 files (10.0%)
- **src\services\billing**: 2 files (10.0%)
- **src\services\connection\queries**: 2 files (10.0%)
- **src\services\connection\queries\reject**: 2 files (10.0%)
- **src\services\location\queries\create**: 2 files (10.0%)
- **src\services\location\queries\deactivate**: 2 files (10.0%)
- **src\services\location\queries\get**: 2 files (10.0%)
- **src\services\location\queries\list**: 2 files (10.0%)
- **src\services\location\queries\update**: 2 files (10.0%)
- **src\services\order\admin\utils**: 2 files (10.0%)
- **src\services\order\admin\validation**: 2 files (10.0%)
- **src\services\order\finalize\authorization**: 2 files (10.0%)
- **src\services\order\finalize\signature**: 2 files (10.0%)
- **src\services\order\finalize\transaction**: 2 files (10.0%)
- **src\services\order\finalize\update**: 2 files (10.0%)
- **src\services\order\radiology\export\csv-export**: 2 files (10.0%)
- **src\services\order\radiology\export**: 2 files (10.0%)
- **src\controllers\superadmin**: 1 files (5.0%)
- **src**: 1 files (5.0%)
- **src\services\location\queries**: 1 files (5.0%)
- **src\services\notification\services\connection**: 1 files (5.0%)
- **src\services\order\admin\__tests__**: 1 files (5.0%)
- **src\services\order**: 1 files (5.0%)
- **src\services\superadmin**: 1 files (5.0%)
- **src\utils\text-processing\code-extractor\cpt**: 1 files (5.0%)
- **src\utils\text-processing\code-extractor\icd10**: 1 files (5.0%)
- **src\utils\text-processing\code-extractor**: 1 files (5.0%)
- **src\utils**: 1 files (5.0%)

## Results by Pattern

### Field Name Variations

- Files affected: 8
- Total matches: 40

#### Top Affected Files

- **src\utils\response\normalizer\normalize-response-fields.ts** (13 matches)
  - Unique matches: `suggestedICD10Codes`, `suggestedCPTCodes`
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
    ... and 11 more matches
- **tests\e2e\run_comprehensive_tests.js** (11 matches)
  - Unique matches: `suggestedICD10Codes`, `suggestedCPTCodes`
  - Sample context:
    ```
    195:   // Verify that a primary code exists
196:   const primaryCode = actual.validationResult.suggestedICD10Codes.find(code => code.isPrimary);
197:   if (!primaryCode) {
    ```
    ```
    204:   // Verify that multiple codes are provided (at least 3)
205:   if (actual.validationResult.suggestedICD10Codes.length < 3) {
206:     throw new Error(`Insufficient ICD-10 codes. Expected at least 3, Got: ${actual.validationResult.suggestedICD10Codes.length}`);
    ```
    ... and 7 more matches
- **src\utils\response\processor.ts** (6 matches)
  - Unique matches: `suggestedICD10Codes`, `suggestedCPTCodes`
  - Sample context:
    ```
    49:     // Normalize ICD-10 and CPT code arrays
50:     const normalizedICD10Codes = normalizeCodeArray(normalizedResponse.suggestedICD10Codes);
51:     const normalizedCPTCodes = normalizeCodeArray(normalizedResponse.suggestedCPTCodes);
    ```
    ```
    50:     const normalizedICD10Codes = normalizeCodeArray(normalizedResponse.suggestedICD10Codes);
51:     const normalizedCPTCodes = normalizeCodeArray(normalizedResponse.suggestedCPTCodes);
52:     
    ```
    ... and 4 more matches
- **src\models\order\validation-types.ts** (2 matches)
  - Unique matches: `suggestedICD10Codes`, `suggestedCPTCodes`
  - Sample context:
    ```
    36:   feedback: string;
37:   suggestedICD10Codes: Array<{ code: string; description: string }>;
38:   suggestedCPTCodes: Array<{ code: string; description: string }>;
    ```
    ```
    37:   suggestedICD10Codes: Array<{ code: string; description: string }>;
38:   suggestedCPTCodes: Array<{ code: string; description: string }>;
39:   internalReasoning: string;
    ```
- **src\services\order\validation\attempt-tracking\log-validation-attempt.ts** (2 matches)
  - Unique matches: `suggestedICD10Codes`, `suggestedCPTCodes`
  - Sample context:
    ```
    30:       validationResult.validationStatus,
31:       JSON.stringify(validationResult.suggestedICD10Codes),
32:       JSON.stringify(validationResult.suggestedCPTCodes),
    ```
    ```
    31:       JSON.stringify(validationResult.suggestedICD10Codes),
32:       JSON.stringify(validationResult.suggestedCPTCodes),
33:       validationResult.feedback,
    ```
- **src\services\validation\logging.ts** (2 matches)
  - Unique matches: `suggestedICD10Codes`, `suggestedCPTCodes`
  - Sample context:
    ```
    34:     // Format ICD-10 and CPT codes for storage
35:     const icd10Codes = JSON.stringify(validationResult.suggestedICD10Codes.map(code => code.code));
36:     const cptCodes = JSON.stringify(validationResult.suggestedCPTCodes.map(code => code.code));
    ```
    ```
    35:     const icd10Codes = JSON.stringify(validationResult.suggestedICD10Codes.map(code => code.code));
36:     const cptCodes = JSON.stringify(validationResult.suggestedCPTCodes.map(code => code.code));
37:     
    ```
- **src\utils\response\types.ts** (2 matches)
  - Unique matches: `suggestedICD10Codes`, `suggestedCPTCodes`
  - Sample context:
    ```
    19:   feedback: string;
20:   suggestedICD10Codes: any;
21:   suggestedCPTCodes: any;
    ```
    ```
    20:   suggestedICD10Codes: any;
21:   suggestedCPTCodes: any;
22:   internalReasoning?: string;
    ```
- **src\utils\response\validator\validate-required-fields.ts** (2 matches)
  - Unique matches: `suggestedICD10Codes`, `suggestedCPTCodes`
  - Sample context:
    ```
    8:     'feedback',
9:     'suggestedICD10Codes',
10:     'suggestedCPTCodes'
    ```
    ```
    9:     'suggestedICD10Codes',
10:     'suggestedCPTCodes'
11:   ];
    ```

### Normalization Functions

- Files affected: 7
- Total matches: 42

#### Top Affected Files

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
    ... and 10 more matches
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
    ... and 5 more matches
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
    ... and 4 more matches
- **src\utils\response\index.ts** (3 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    5: export { processLLMResponse } from './processor';
6: export { normalizeResponseFields, normalizeCodeArray } from './normalizer';
7: export { validateRequiredFields, validateValidationStatus } from './validator';
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
- **src\utils\response\normalizer\normalize-code-array.ts** (1 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    3:  */
4: export function normalizeCodeArray(codes: any): Array<{ code: string; description: string; isPrimary?: boolean }> {
5:   if (!codes) return [];
    ```
- **src\utils\response\types.ts** (1 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    13: /**
14:  * Interface for normalized response fields
15:  */
    ```

### isPrimary Flag Handling

- Files affected: 3
- Total matches: 7

#### Top Affected Files

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
    ... and 2 more matches
- **src\services\order\admin\types\insurance-types.ts** (1 matches)
  - Unique matches: `isPrimary`
  - Sample context:
    ```
    12:   verificationStatus?: string;
13:   isPrimary?: boolean;
14:   [key: string]: any;
    ```
- **tests\e2e\run_comprehensive_tests.js** (1 matches)
  - Unique matches: `isPrimary`
  - Sample context:
    ```
    195:   // Verify that a primary code exists
196:   const primaryCode = actual.validationResult.suggestedICD10Codes.find(code => code.isPrimary);
197:   if (!primaryCode) {
    ```

### Strict Comparison

- Files affected: 4
- Total matches: 4

#### Top Affected Files

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
- **tests\batch\test-billing-subscriptions.js** (1 matches)
  - Unique matches: `=== true`
  - Sample context:
    ```
    88:   // Check if all tests passed
89:   const allPassed = results.every(result => result === true);
90:   
    ```

### Field Mapping

- Files affected: 5
- Total matches: 14

#### Top Affected Files

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
    ... and 2 more matches
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
    ... and 1 more matches
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

## Impact Assessment

### Critical Components

1. **Response Normalization**
   - Field name mapping in `normalizeResponseFields`
   - Code array normalization in `normalizeCodeArray`
   - isPrimary flag handling

2. **Template System**
   - Inconsistent field names in templates
   - Validation requirements in templates

## Recommendations

### Short-term Fixes

1. **Fix isPrimary Flag Issue**
   - Update `normalizeCodeArray` to properly preserve the isPrimary flag
   - Change `isPrimary: item.isPrimary === true` to `isPrimary: Boolean(item.isPrimary)`

2. **Update Templates**
   - Ensure all templates use consistent field names
   - Update the lean template to use suggestedICD10Codes instead of diagnosisCodes

### Long-term Strategy

1. **Standardize Field Names**
   - Use the `ValidationResult` interface as the standard
   - Create a style guide for field naming conventions

2. **Gradual Normalization Removal**
   - Start with isolated components
   - Work inward toward core logic
   - Implement changes in small, testable increments

3. **Comprehensive Testing**
   - Create tests that verify field name consistency
   - Ensure tests cover the entire validation pipeline

