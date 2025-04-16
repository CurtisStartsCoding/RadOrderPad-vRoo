# Comprehensive Workflow Test Cases

**Version:** 1.0
**Date:** 2025-04-15

This document contains 10 comprehensive test cases designed to test the full workflow of the RadOrderPad system, with particular focus on validation failures, physician overrides, admin updates, and radiology group handoffs.

---

## Test Case 1: Insufficient Clinical Information with Physician Override

### Initial Order
**Patient:** Sarah Johnson, 42F
**Dictation:**
```
Patient with headache for 3 days. Request MRI brain.
```

### Expected Validation Result
- **Status:** needs_clarification
- **Compliance Score:** 35
- **Feedback:** "Insufficient clinical information. Please provide headache characteristics, severity, associated symptoms, and any neurological findings. No red flags documented to justify MRI as initial imaging."
- **Suggested ICD-10:** R51 (Headache, unspecified) [Primary]
- **Suggested CPT:** 70551 (MRI brain without contrast)

### Physician Override
**Override Reason:** "Patient has history of brain aneurysm repair 5 years ago. Headache is sudden onset, 9/10 severity, worst headache of life."
**Override Notes:** "Family history of subarachnoid hemorrhage in mother and sister. Patient anxious about recurrence."

### Admin Processing
**Additional Information Added:** "Patient called to confirm appointment. Reports photophobia and neck stiffness developed this morning. Updated neurologist Dr. Smith who requests STAT study."

### Expected Radiology Outcome
- **Queue:** STAT
- **Override Label:** Clearly visible
- **Complete Clinical Context:** Original dictation + override reason + admin notes all visible to radiologist
- **Expected Action:** Radiologist should see complete clinical picture including the critical red flags (worst headache, history of aneurysm, photophobia, neck stiffness) that weren't in original dictation

## Test Case 2: Inappropriate Modality Selection with Physician Override

### Initial Order
**Patient:** Robert Williams, 68M
**Dictation:**
```
Patient with low back pain for 2 weeks. No radiation to legs. No weakness or numbness. Request MRI lumbar spine with contrast.
```

### Expected Validation Result
- **Status:** inappropriate
- **Compliance Score:** 25
- **Feedback:** "Acute low back pain (<6 weeks) without red flags does not warrant advanced imaging per ACR guidelines. Additionally, contrast is not indicated for routine degenerative disease evaluation."
- **Suggested ICD-10:** M54.5 (Low back pain) [Primary]
- **Suggested CPT:** None (conservative management recommended)

### Physician Override
**Override Reason:** "Patient has history of prostate cancer with known bone metastases. Recent PSA elevation. Concerned for new metastatic disease."
**Override Notes:** "Patient already failed 6 weeks of conservative therapy during previous episode. Current pain different in quality."

### Admin Processing
**Additional Information Added:** "Attached prior imaging report showing known L3 metastatic lesion from 3 months ago. Oncologist Dr. Johnson requesting comparison study."

### Expected Radiology Outcome
- **Queue:** Routine Oncology
- **Override Label:** Clearly visible
- **Complete Clinical Context:** Original dictation + override reason + admin notes + attached prior report all visible
- **Expected Action:** Radiologist should understand this is follow-up for known metastatic disease, not routine back pain

## Test Case 3: Missing Laterality Information with Admin Correction

### Initial Order
**Patient:** Emily Davis, 35F
**Dictation:**
```
Patient with wrist pain after fall yesterday. Tender over scaphoid. Limited range of motion. Request X-ray wrist.
```

### Expected Validation Result
- **Status:** needs_clarification
- **Compliance Score:** 65
- **Feedback:** "Laterality (right/left/bilateral) not specified for wrist X-ray."
- **Suggested ICD-10:** S62.009A (Fracture of unspecified carpal bone, initial encounter) [Primary]
- **Suggested CPT:** 73100 (X-ray wrist; 2 views)

### Physician Override
**Override Reason:** "Patient needs bilateral wrist X-rays. Fell on both wrists."
**Override Notes:** None

### Admin Processing
**Additional Information Added:** "Called patient to confirm. RIGHT wrist is primary concern with scaphoid tenderness. LEFT wrist has only mild pain. Updated order to RIGHT wrist only per patient preference due to insurance concerns."

### Expected Radiology Outcome
- **Queue:** Routine
- **Override Label:** Clearly visible with admin correction highlighted
- **Complete Clinical Context:** Original dictation + override reason + admin correction clearly visible
- **Expected Action:** Radiologist should see that despite initial confusion, the final order is for RIGHT wrist only

## Test Case 4: Contrast Contraindication with Physician Override and Protocol Modification

### Initial Order
**Patient:** Michael Brown, 72M
**Dictation:**
```
Patient with abdominal pain, weight loss, and abnormal liver function tests. Request CT abdomen with contrast to evaluate for hepatic mass.
```

### Expected Validation Result
- **Status:** needs_clarification
- **Compliance Score:** 70
- **Feedback:** "Patient's renal function status not provided. eGFR required before approving contrast study in patient >60 years."
- **Suggested ICD-10:** R10.9 (Abdominal pain, unspecified) [Primary], R63.4 (Weight loss)
- **Suggested CPT:** 74177 (CT abdomen and pelvis with contrast)

### Physician Override
**Override Reason:** "Patient has CKD stage 4 with eGFR 22. Need imaging despite renal status. Suspected hepatocellular carcinoma based on elevated AFP."
**Override Notes:** "Please use renal protocol with minimum contrast dose. Patient has been informed of risks."

### Admin Processing
**Additional Information Added:** "Nephrology consult note attached. Patient to receive pre and post procedure hydration per nephrology protocol. Scheduled for creatinine check day after procedure."

### Expected Radiology Outcome
- **Queue:** Oncology with Renal Protocol Flag
- **Override Label:** Clearly visible with renal precaution highlighted
- **Complete Clinical Context:** Original dictation + override with eGFR value + nephrology recommendations
- **Expected Action:** Radiologist should modify protocol for minimum contrast dose and document renal precautions

## Test Case 5: Rare Disease Scenario with Specialized Protocol Requirements

### Initial Order
**Patient:** Jennifer Smith, 28F
**Dictation:**
```
Patient with palpitations and syncope. Request cardiac MRI.
```

### Expected Validation Result
- **Status:** needs_clarification
- **Compliance Score:** 50
- **Feedback:** "Insufficient clinical information for cardiac MRI. Please provide ECG findings, echocardiogram results, and specific diagnostic question."
- **Suggested ICD-10:** R00.2 (Palpitations) [Primary], R55 (Syncope and collapse)
- **Suggested CPT:** 75559 (Cardiac MRI with stress imaging)

### Physician Override
**Override Reason:** "Patient has confirmed Fabry disease with suspected cardiac involvement. Need tissue characterization for glycosphingolipid deposition."
**Override Notes:** "Please include T1 mapping and late gadolinium enhancement sequences. Family history of Fabry cardiomyopathy with sudden death."

### Admin Processing
**Additional Information Added:** "Genetic test results attached confirming GLA mutation. Cardiology note with abnormal strain pattern on echo attached. Patient enrolled in Fabry registry study - requires specific protocol."

### Expected Radiology Outcome
- **Queue:** Specialized Cardiac Protocol
- **Override Label:** Clearly visible with rare disease protocol flag
- **Complete Clinical Context:** Original dictation + override with disease-specific details + attached genetic results
- **Expected Action:** Radiologist should recognize need for specialized Fabry disease protocol and ensure proper sequences

## Test Case 6: Pediatric Case with Radiation Concerns and Protocol Adjustment

### Initial Order
**Patient:** Tyler Johnson, 7M
**Dictation:**
```
7-year-old with recurrent abdominal pain and vomiting. Request CT abdomen to rule out appendicitis.
```

### Expected Validation Result
- **Status:** inappropriate
- **Compliance Score:** 30
- **Feedback:** "Ultrasound is preferred initial imaging for pediatric appendicitis evaluation to avoid radiation exposure. Insufficient clinical details provided."
- **Suggested ICD-10:** R10.9 (Abdominal pain, unspecified) [Primary], R11.10 (Vomiting, unspecified)
- **Suggested CPT:** 76700 (Ultrasound, abdominal, complete)

### Physician Override
**Override Reason:** "Ultrasound already performed and inconclusive. Patient has atypical presentation with right-sided pain now migrated to left side. Concerned for complicated appendicitis or alternate diagnosis."
**Override Notes:** "Please use pediatric low-dose protocol. Patient has autism and sedation was difficult for ultrasound."

### Admin Processing
**Additional Information Added:** "Attached ultrasound report. Child life specialist will accompany patient. Sedation consent obtained. Weight: 23kg for dose calculations."

### Expected Radiology Outcome
- **Queue:** Pediatric Protocol
- **Override Label:** Clearly visible with prior ultrasound reference
- **Complete Clinical Context:** Original dictation + override reason + ultrasound results + special needs information
- **Expected Action:** Radiologist should implement pediatric low-dose protocol and coordinate with child life/sedation team

## Test Case 7: Pregnant Patient with Critical Finding Requiring Immediate Communication

### Initial Order
**Patient:** Maria Garcia, 32F
**Dictation:**
```
Patient with severe right flank pain and hematuria. Rule out kidney stone. Request CT abdomen/pelvis.
```

### Expected Validation Result
- **Status:** needs_clarification
- **Compliance Score:** 60
- **Feedback:** "Pregnancy status not documented. Radiation risk assessment required before CT in woman of childbearing age."
- **Suggested ICD-10:** N23 (Unspecified renal colic) [Primary], R31.9 (Hematuria, unspecified)
- **Suggested CPT:** 74176 (CT abdomen and pelvis without contrast)

### Physician Override
**Override Reason:** "Patient is 24 weeks pregnant. Ultrasound performed but limited by body habitus. Severe pain uncontrolled by medication. Benefits outweigh risks."
**Override Notes:** "OB consulted and agrees with CT. Please use low-dose protocol with abdominal shielding."

### Admin Processing
**Additional Information Added:** "Patient's pain increased dramatically during check-in. Urinalysis shows large blood and leukocyte esterase. Updated to STAT order. OB will be present during scan."

### Expected Radiology Outcome
- **Queue:** STAT with Pregnancy Protocol
- **Override Label:** Clearly visible with pregnancy warning
- **Complete Clinical Context:** Original dictation + override with pregnancy information + updated urgency information
- **Expected Action:** Radiologist should implement pregnancy protocol, provide immediate read, and directly communicate any critical findings to both ordering physician and OB

## Test Case 8: Duplicate Study Request with Modified Override After Admin Investigation

### Initial Order
**Patient:** David Wilson, 55M
**Dictation:**
```
Patient with chest pain and shortness of breath. Request CT chest with contrast to evaluate for pulmonary embolism.
```

### Expected Validation Result
- **Status:** needs_clarification
- **Compliance Score:** 75
- **Feedback:** "D-dimer result not provided. Wells score or clinical probability assessment recommended before CT PE study."
- **Suggested ICD-10:** R07.9 (Chest pain, unspecified) [Primary], R06.02 (Shortness of breath)
- **Suggested CPT:** 71275 (CT angiography, chest)

### Physician Override
**Override Reason:** "High clinical suspicion for PE. Patient has active cancer and unilateral leg swelling. D-dimer would not change management."
**Override Notes:** "Patient already had V/Q scan yesterday at outside hospital that was indeterminate."

### Admin Processing
**Additional Information Added:** "ALERT: CT chest with contrast was performed 2 hours ago in ED before patient was transferred to floor. Radiologist recommends cancelling duplicate study and consulting ED CT results already in PACS."

### Expected Radiology Outcome
- **Queue:** Cancelled with Alert
- **Override Label:** Visible but with cancellation notice
- **Complete Clinical Context:** Original dictation + override reason + admin alert about duplicate study
- **Expected Action:** System should flag duplicate study, prevent redundant radiation exposure, and direct physician to existing results

## Test Case 9: Complex Multi-System Disorder Requiring Coordinated Protocols

### Initial Order
**Patient:** Susan Miller, 62F
**Dictation:**
```
Patient with rheumatoid arthritis presenting with new neurological symptoms including diplopia and ataxia. Request MRI brain.
```

### Expected Validation Result
- **Status:** needs_clarification
- **Compliance Score:** 65
- **Feedback:** "Please specify if contrast is indicated. Additional details on neurological exam findings and symptom duration would improve protocol selection."
- **Suggested ICD-10:** M06.9 (Rheumatoid arthritis, unspecified) [Primary], H53.2 (Diplopia), R27.0 (Ataxia, unspecified)
- **Suggested CPT:** 70551 (MRI brain without contrast)

### Physician Override
**Override Reason:** "Patient has rheumatoid vasculitis with new CNS symptoms. Need MRI brain AND cervical spine with and without contrast to evaluate for vasculitis and demyelination."
**Override Notes:** "Patient has elevated CRP and positive RF. Neurology and rheumatology co-managing. Please evaluate for both vasculitis and demyelination."

### Admin Processing
**Additional Information Added:** "Order modified to include both brain and c-spine as requested. Attached rheumatology consult note. Patient has renal insufficiency (eGFR 45) - please adjust contrast dose accordingly. Patient requires wheelchair assistance."

### Expected Radiology Outcome
- **Queue:** Specialized Neuro-Rheumatology Protocol
- **Override Label:** Clearly visible with protocol modification highlighted
- **Complete Clinical Context:** Original dictation + override with expanded clinical context + renal consideration
- **Expected Action:** Radiologist should implement coordinated brain/c-spine protocol optimized for both vasculitis and demyelination with adjusted contrast dose

## Test Case 10: Emergent Situation with Incomplete Information and Ongoing Updates

### Initial Order
**Patient:** James Thompson, 78M
**Dictation:**
```
Altered mental status, possible stroke. Need CT head STAT.
```

### Expected Validation Result
- **Status:** needs_clarification
- **Compliance Score:** 55
- **Feedback:** "Insufficient clinical information. Please provide time of symptom onset, NIHSS score, and relevant medical history for optimal protocol selection."
- **Suggested ICD-10:** R41.82 (Altered mental status, unspecified) [Primary]
- **Suggested CPT:** 70450 (CT head without contrast)

### Physician Override
**Override Reason:** "Patient actively deteriorating. Last known well 45 minutes ago. NIHSS 14. Need CT head and CTA head/neck for potential thrombectomy candidate."
**Override Notes:** "Stroke team activated. Will provide additional information as available."

### Admin Processing
**Additional Information Added:** "ONGOING UPDATES: Patient intubated en route to CT. Glucose 315. INR 1.1. Taking apixaban for AFib. Family reports history of prior stroke. Stroke team requesting perfusion study in addition to CTA."

### Expected Radiology Outcome
- **Queue:** STAT Stroke Protocol
- **Override Label:** Clearly visible with ongoing updates highlighted
- **Complete Clinical Context:** Original dictation + override + real-time clinical updates
- **Expected Action:** Radiologist should implement comprehensive stroke protocol, provide immediate interpretation, and maintain direct communication with stroke team

---

## Testing Instructions

For each test case:

1. **Initial Order Entry:**
   - Enter the dictation exactly as written
   - Submit for validation

2. **Validation Review:**
   - Verify the validation status matches expected result
   - Check that feedback and suggested codes match expectations

3. **Physician Override:**
   - Enter the override reason and notes
   - Submit the override

4. **Admin Processing:**
   - As admin user, access the overridden order
   - Add the specified additional information
   - Process the order according to standard workflow

5. **Radiology Verification:**
   - Login as radiologist
   - Verify the order appears in the correct queue
   - Confirm the override label is clearly visible
   - Verify all clinical context is available (original dictation + override + admin notes)
   - Check that any attached documents or prior results are accessible

6. **Documentation:**
   - Document any discrepancies between expected and actual outcomes
   - Note any usability issues or workflow inefficiencies
   - Record system performance metrics (time to complete each step)

These test cases are designed to verify the end-to-end workflow with particular attention to how overridden orders are handled and how complete clinical context is preserved throughout the process.