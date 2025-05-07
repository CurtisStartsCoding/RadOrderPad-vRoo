# RadOrderPad Validation Workflow Guide

## Overview

This document provides a comprehensive guide to the validation workflow in the RadOrderPad system, focusing on how clinical indications from physician dictation are processed to assign appropriate CPT and ICD-10 codes.

## Validation Engine Architecture

The RadOrderPad validation engine is a sophisticated system that processes physician dictation to provide clinical decision support, code suggestions, and appropriateness scoring. Here's how it works:

### Core Components

1. **Input Processing**
   - Receives physician dictation text
   - Extracts patient context (age, gender)
   - Handles draft order creation on first attempt

2. **PHI Stripping**
   - Removes potential patient identifiers from the dictation text

3. **Medical Context Extraction**
   - Identifies medical terms, imaging modalities, anatomy, laterality, and clinical conditions
   - Uses database lookups for relevant medical codes and mappings

4. **LLM Orchestration**
   - Primary: Claude 3.7
   - Fallbacks: Grok 3 → GPT-4.0
   - Uses specialized prompts for different validation scenarios

5. **Response Processing**
   - Extracts structured JSON output
   - Parses diagnosis codes, procedure codes, validation status, compliance score, and feedback

6. **Feedback Generation**
   - Adjusts feedback based on validation status and scenario
   - Provides educational content based on guidelines

## Validation Workflow

### Step 1: Initial Dictation

1. Physician enters patient information
2. Physician dictates or types the clinical scenario, reason for the study, relevant history, and symptoms
3. System sends the dictation to the validation endpoint (`POST /api/orders/validate`)
4. On first call, a draft order is created with `status = 'pending_validation'`

### Step 2: Validation Processing

1. The validation engine processes the dictation:
   - Strips PHI information
   - Extracts medical context
   - Queries database for relevant codes and guidelines
   - Constructs prompts for the LLM
   - Calls the LLM (Claude 3.7 with fallbacks)
   - Processes the LLM response

2. The validation result includes:
   - `validationStatus`: 'appropriate', 'needs_clarification', or 'inappropriate'
   - `complianceScore`: Numerical score reflecting appropriateness (1-9 or 0-100)
   - `feedback`: Textual explanation and educational content
   - `suggestedICD10Codes`: Array of diagnosis codes with descriptions
   - `suggestedCPTCodes`: Array of procedure codes with descriptions

### Step 3: Clarification Loop (If Needed)

If the validation status is not 'appropriate', the system enters a clarification loop:

1. Physician is shown feedback with guidance on what additional information is needed
2. Physician adds clarification to the dictation
3. System sends the combined original + clarification text back to the validation endpoint
4. This process can repeat up to 3 times

### Step 4: Override Flow (After 3 Failed Attempts)

If validation still fails after 3 attempts:

1. Physician is given the option to override the validation
2. Physician provides clinical justification for the override
3. System sends a final validation request with the combined text and override justification
4. The LLM evaluates the justification and provides final feedback

### Step 5: Finalization

1. Physician reviews the final validation result
2. Physician signs the order
3. System updates the order with final validation state, codes, and signature

## API Endpoints

### Validation Endpoint

```
POST /api/orders/validate
```

**Request Body:**
```json
{
  "dictationText": "72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. History of degenerative disc disease. Clinical concern for lumbar radiculopathy.",
  "patientInfo": {
    "id": 1,
    "firstName": "Robert",
    "lastName": "Johnson",
    "dateOfBirth": "1950-05-15",
    "gender": "male",
    "pidn": "P12345" // Patient Identifier Number is the primary identifier
  },
  "orderId": "123", // Optional, present on attempts after the first
  "isOverrideValidation": false // Optional, true for override validation
}
```

**Response:**
```json
{
  "success": true,
  "orderId": 123,
  "validationResult": {
    "validationStatus": "appropriate",
    "complianceScore": 8,
    "feedback": "MRI lumbar spine without contrast is appropriate for evaluating lower back pain with radicular symptoms, especially with history of degenerative disc disease. Clinical presentation suggests lumbar radiculopathy which warrants imaging evaluation.",
    "suggestedCPTCodes": [
      {
        "code": "72148",
        "description": "Magnetic resonance (eg, proton) imaging, spinal canal and contents, lumbar; without contrast material"
      }
    ],
    "suggestedICD10Codes": [
      {
        "code": "M54.17",
        "description": "Radiculopathy, lumbosacral region"
      },
      {
        "code": "M51.36",
        "description": "Other intervertebral disc degeneration, lumbar region"
      }
    ]
  }
}
```

### Order Finalization Endpoint

```
PUT /api/orders/{orderId}
```

**Request Body:**
```json
{
  "signature": "data:image/png;base64,...",
  "status": "pending_admin",
  "finalValidationStatus": "appropriate",
  "finalCPTCode": "72148",
  "clinicalIndication": "MRI lumbar spine without contrast is appropriate for evaluating lower back pain with radicular symptoms...",
  "finalICD10Codes": ["M54.17", "M51.36"],
  "overridden": false,
  "overrideJustification": null
}
```

## Best Practices for Clinical Dictation

To ensure accurate CPT and ICD-10 code assignment, physicians should include:

1. **Patient Demographics**
   - Age
   - Gender
   - Relevant medical history

2. **Clinical Symptoms**
   - Primary symptoms and their duration
   - Location and radiation of symptoms
   - Severity and progression

3. **Relevant History**
   - Prior diagnoses related to current symptoms
   - Previous imaging or treatments
   - Risk factors

4. **Clinical Reasoning**
   - Suspected diagnosis or differential diagnoses
   - Reason for the imaging study
   - What information is being sought

### Example of Good Clinical Dictation

```
72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. 
Pain is worse with standing and walking. Patient has history of degenerative disc disease 
diagnosed 5 years ago. Physical exam shows positive straight leg raise on left side. 
No bowel or bladder symptoms. No recent trauma. Clinical concern for lumbar radiculopathy 
due to disc herniation. Need MRI lumbar spine without contrast to evaluate for nerve 
compression and guide treatment planning.
```

This example includes:
- Patient demographics (age, gender)
- Symptom description (location, radiation, duration, aggravating factors)
- Relevant history (degenerative disc disease)
- Physical exam findings (positive straight leg raise)
- Negative findings (no bowel/bladder symptoms, no trauma)
- Clinical reasoning (concern for radiculopathy)
- Requested study (MRI lumbar spine without contrast)
- Purpose of the study (evaluate nerve compression, guide treatment)

## Implementation Considerations

1. **Handling Multiple Attempts**
   - Store the orderId returned from the first validation call
   - Send the combined text (original + clarifications) on subsequent calls
   - Include the orderId in subsequent calls

2. **Override Handling**
   - Provide a clear interface for physicians to enter override justification
   - Send the isOverrideValidation flag with the final validation request
   - Store the override justification for audit purposes

3. **Error Handling**
   - Implement robust error handling for LLM unavailability
   - Provide fallback options if validation fails
   - Consider caching validation results for similar cases

4. **UI Considerations**
   - Clearly display validation feedback to guide physicians
   - Highlight suggested codes for physician review
   - Provide a clear path for clarification or override when needed

## Conclusion

The RadOrderPad validation workflow is designed to ensure accurate CPT and ICD-10 code assignment based on clinical indications provided by physicians. By following the guidelines in this document, frontend developers can implement an effective interface that guides physicians through the validation process and helps ensure compliance with clinical guidelines.