# Validation Feedback Logic

## Overview

This document outlines how clinical validation feedback is generated, structured, scored, and displayed to the referring physician in the RadOrderPad system. It serves as a guide for product managers, UI designers, and developers working on the feedback presentation aspects of the validation workflow.

## Feedback Goals

- **Actionable:** Clearly indicate whether the order is appropriate or if more information/changes are needed.
- **Educational:** Provide concise reasoning based on guidelines (like ACR AUC) or clinical context ("Teachable Moment").
- **Consistent:** Maintain a professional and helpful tone.
- **Contextual:** Adapt feedback length and detail based on the situation (e.g., standard vs. rare disease).

## Feedback Components

The validation engine returns these key feedback components within its JSON response (`validationResult` object):

- **`validationStatus`:** Categorical outcome.
  - `'appropriate'`: Order aligns with guidelines based on provided info.
  - `'needs_clarification'`: More clinical detail is required to determine appropriateness.
  - `'inappropriate'`: The requested study is generally not indicated for the scenario; alternatives may be suggested.
- **`complianceScore`:** Numerical score reflecting appropriateness (e.g., 1-9 based on ACR scale, or 0-100).
- **`feedback`:** Textual explanation and educational content.
  - *Standard Length:* ~40 words (configurable per prompt template).
  - *Rare Disease Length:* ~95-100 words (triggered by `rare_disease_trigger.md` logic).
  - *Override Validation Feedback:* May include commentary on the provided justification.
- **`suggestedICD10Codes`:** Array of `{code, description}` objects.
- **`suggestedCPTCodes`:** Array of `{code, description}` objects.

## UI Presentation

### During Dictation Loop (`DictationForm`)

- If `validationStatus` is *not* 'appropriate' (e.g., 'needs_clarification', 'inappropriate'), the `ValidationFeedbackBanner` is displayed.
- **Visual State:** Banner color/icon reflects severity (Yellow/Red).
- **Content:** Shows score, feedback text, suggested codes.
- **Actions:** "Add Clarification" button shown if `attemptCount < 3`. "Override Validation" button shown if `attemptCount >= 3`.

### After Final Validation/Override (`ValidationView`)

- Displays the *final* `validationResult` state.
- Shows overall status (Compliant/Override Applied).
- Shows the final `complianceScore`.
- Shows the final `feedback` text (which might be feedback on the override justification).
- Shows the final `suggestedICD10Codes` and `suggestedCPTCodes`.
- Shows the `overrideJustification` text if applicable.

## Handling Clarifications

1. **Trigger:** User clicks "Add Clarification" in the `ValidationFeedbackBanner` (attempts 1 or 2).
2. **UI Change:** Separator added to `DictationForm` text area.
3. **Input:** Physician dictates/types additional details.
4. **Re-Submit:** Physician clicks "Process Order".
5. **Backend Process:** Frontend calls `POST /api/orders/validate` with the *combined* text and the `orderId`. Validation Engine processes.
6. **Feedback Update:** `DictationForm` updates with the new validation result and feedback banner if still not 'appropriate'.

## Feedback Presentation Examples

### Example 1: Appropriate Order

```json
{
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
```

**UI Presentation:**
- Green banner with checkmark icon
- "Appropriate Order" heading
- Compliance score displayed as 8/9
- Feedback text displayed in full
- Suggested codes displayed in a table format
- "Continue to Signature" button enabled

### Example 2: Needs Clarification

```json
{
  "validationStatus": "needs_clarification",
  "complianceScore": 4,
  "feedback": "Additional information is needed to determine if MRI knee is appropriate. Please provide details about: 1) Duration of symptoms, 2) Any prior treatments attempted, 3) Results of physical examination, 4) Any history of trauma or prior knee issues.",
  "suggestedICD10Codes": [
    {
      "code": "M25.569",
      "description": "Pain in unspecified knee"
    }
  ],
  "suggestedCPTCodes": []
}
```

**UI Presentation:**
- Yellow banner with question mark icon
- "Additional Information Needed" heading
- Compliance score displayed as 4/9
- Feedback text displayed in full, with numbered points highlighted
- Limited suggested codes displayed
- "Add Clarification" button prominently displayed

### Example 3: Inappropriate Order

```json
{
  "validationStatus": "inappropriate",
  "complianceScore": 2,
  "feedback": "The requested lumbar spine MRI is not appropriate for acute onset lower back pain without red flag symptoms. Clinical guidelines recommend conservative management (rest, physical therapy, NSAIDs) for the first 6 weeks of uncomplicated low back pain. Imaging is generally not indicated unless there are red flags or if symptoms persist despite 6 weeks of conservative treatment.",
  "suggestedICD10Codes": [
    {
      "code": "M54.5",
      "description": "Low back pain"
    }
  ],
  "suggestedCPTCodes": []
}
```

**UI Presentation:**
- Red banner with warning icon
- "Not Recommended" heading
- Compliance score displayed as 2/9
- Feedback text displayed in full
- Suggested codes displayed
- "Add Clarification" button prominently displayed (if attempts < 3)
- "Override Validation" button displayed (if attempts >= 3)

## Storing Feedback History

- Each validation pass (initial submission, clarifications, final override validation) triggered by `POST /api/orders/validate` is logged as a distinct record in the `validation_attempts` table (PHI DB).
- This table stores:
  - `order_id`: Links attempt to the draft/final order.
  - `attempt_number`: Sequence (1, 2, 3, 4+).
  - `validation_input_text`: **Full cumulative text** sent for this attempt (including clarifications/justification).
  - `validation_outcome`: Status returned by LLM for this attempt.
  - `generated_feedback_text`: Feedback returned by LLM for this attempt.
  - `generated_compliance_score`: Score returned by LLM for this attempt.
  - `generated_icd10_codes`, `generated_cpt_codes`: Codes suggested for this attempt.
  - `is_rare_disease_feedback`: Flag if rare disease logic triggered.
- The *final* outcome state (codes, score, status, notes, override info) held in the frontend after the last validation call is persisted to the main `orders` record during the final submission (`PUT /api/orders/{orderId}`).

## Feedback Customization

The feedback generation can be customized through several mechanisms:

1. **Prompt Templates**: The `prompt_templates` table contains templates that control how the LLM generates feedback. These templates can be modified to change the tone, length, and content of the feedback.

2. **Word Limit**: Each prompt template has a `word_limit` field that controls the length of the feedback. This can be adjusted based on the use case.

3. **Rare Disease Logic**: The system can detect rare diseases and provide more detailed feedback in those cases. This logic is defined in the `rare_disease_trigger.md` file.

4. **Override Feedback**: When a physician overrides the validation, the system generates special feedback that acknowledges the override justification and provides guidance based on that context.

## Design Considerations

When designing the feedback presentation UI, consider the following:

1. **Clarity**: The feedback should be clearly presented with appropriate visual cues (colors, icons) to indicate the validation status.

2. **Actionability**: The UI should make it clear what actions the physician can take based on the feedback.

3. **Educational Value**: The feedback should be presented in a way that maximizes its educational value, with key points highlighted.

4. **Code Integration**: The suggested codes should be easily accessible and selectable for inclusion in the final order.

5. **History Access**: Consider providing access to the history of validation attempts and feedback for reference.

## Data References

- `orders` (PHI DB)
- `validation_attempts` (PHI DB)
- `prompt_templates` (Main DB)
- `rare_disease_trigger.md` (Logic Definition)
- UI Components: `DictationForm`, `ValidationView`, `ValidationFeedbackBanner`