# Data Integrity Validation Report

## Database Connection

- Host: localhost
- Port: 5433
- Database: radorder_main
- User: postgres

Database connection established successfully.

## Basic Table Counts

- medical_cpt_codes: 362 rows
- medical_icd10_codes: 46666 rows
- medical_cpt_icd10_mappings: 1915 rows
- medical_icd10_markdown_docs: 932 rows

## Referential Integrity

- Mappings with invalid ICD-10 codes: 0
- Mappings with invalid CPT codes: 0
- Markdown docs with invalid ICD-10 codes: 0

## Data Distribution

### Top 10 ICD-10 codes by mapping count

| ICD-10 Code | Description | Mapping Count |
|-------------|-------------|---------------|
| C61 | Malignant neoplasm of prostate | 8 |
| Z13.6 | Encounter for screening for cardiovascular disorders | 7 |
| Z85.7 | Personal history of other malignant neoplasms of lymphoid, hematopoietic and related tissues | 7 |
| S13.44 | Sprain of tectorial membrane | 7 |
| Z08.4 | Follow-up examination after other treatment for malignant neoplasm | 7 |
| E21.3 | Hyperparathyroidism, unspecified | 7 |
| Z08.0 | Follow-up examination after surgery for malignant neoplasm | 7 |
| Z08.8 | Follow-up examination after other treatment for malignant neoplasm | 7 |
| Z85.4 | Personal history of malignant neoplasm of genital organs | 7 |
| R10.15 | Left lower quadrant abdominal pain | 6 |

### Top 10 CPT codes by mapping count

| CPT Code | Description | Modality | Mapping Count |
|----------|-------------|----------|---------------|
| 74177 | CT Abdomen and Pelvis with Contrast | Computed Tomography (CT) | 110 |
| 74183 | MRI, abdomen, without and with contrast | MRI | 76 |
| 70553 | Magnetic resonance imaging, brain (including brain stem); without contrast material, followed by contrast material(s) and further sequences | MRI | 76 |
| 76700 | Ultrasound, abdominal, complete | Ultrasound | 74 |
| 76881 | Ultrasound, extremity, nonvascular, real-time with image documentation; complete | Ultrasound | 64 |
| 93306 | Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, complete, with spectral Doppler echocardiography, and with color flow Doppler echocardiography | Ultrasound | 48 |
| 76770 | Ultrasound, retroperitoneal (e.g., renal, aorta, nodes), real time with image documentation; complete | Ultrasound | 45 |
| 72197 | Magnetic resonance imaging, pelvis, without contrast material(s) followed by with contrast material(s) and further sequences | MRI | 45 |
| 70551 | Magnetic resonance (e.g., proton) imaging, brain (including brain stem); without contrast material | MRI | 43 |
| 73721 | Magnetic resonance (e.g., proton) imaging, any joint of lower extremity; without contrast material | MRI | 40 |

### Distribution of mappings by appropriateness score

| Appropriateness | Count | Percentage |
|-----------------|-------|------------|
| 9 | 417 | 21.78% |
| 8 | 530 | 27.68% |
| 7 | 683 | 35.67% |
| 6 | 178 | 9.30% |
| 5 | 58 | 3.03% |
| 4 | 21 | 1.10% |
| 3 | 27 | 1.41% |
| 2 | 1 | 0.05% |

## Data Quality

### NULL values in important fields

| Field | NULL Count |
|-------|------------|
| ICD-10 Code | 0 |
| CPT Code | 0 |
| Appropriateness | 0 |
| Evidence Source | 0 |
| Refined Justification | 0 |

### Duplicate mappings (same ICD-10 and CPT code)

| ICD-10 Code | CPT Code | Count |
|-------------|----------|-------|
| S82.62XA | 73610 | 2 |
| S06.06 | 70496 | 2 |
| R10.39 | 74177 | 2 |
| R51.6 | 70486 | 2 |
| S94.8 | 73721 | 2 |
| M25.511 | 73222 | 2 |
| S06.02 | 70450 | 2 |
| R93.7 | 74183 | 2 |
| S43.491 | 73030 | 2 |
| S06.9 | 70551 | 2 |

## Coverage Analysis

- ICD-10 codes with mappings: 674 out of 46666 (1.44%)
- ICD-10 codes with markdown docs: 932 out of 46666 (2.00%)

- CPT codes with mappings: 178 out of 362 (49.17%)

## Modality Distribution

### Distribution of mappings by modality

| Modality | Mapping Count | Percentage |
|----------|---------------|------------|
| MRI | 587 | 30.65% |
| Ultrasound | 451 | 23.55% |
| CT | 269 | 14.05% |
| X-ray | 229 | 11.96% |
| Computed Tomography (CT) | 123 | 6.42% |
| Nuclear Medicine | 109 | 5.69% |
| Nuclear Medicine with CT | 47 | 2.45% |
| CT (Computed Tomography) | 26 | 1.36% |
| Electrocardiography | 19 | 0.99% |
| Dual-energy X-ray absorptiometry (DXA) | 12 | 0.63% |
| Nuclear Medicine - Positron Emission Tomography (PET) | 10 | 0.52% |
| Varies - This is an unlisted code used when no specific CPT code exists for the MR procedure being performed | 9 | 0.47% |
| Fluoroscopy/Angiography | 8 | 0.42% |
| X-ray (Fluoroscopy) | 4 | 0.21% |
| Various - This is an unlisted code that can apply to any radiologic modality not described by other specific CPT codes | 2 | 0.10% |
| Capsule Endoscopy | 2 | 0.10% |
| Procedural | 1 | 0.05% |
| Pulmonary Function Testing | 1 | 0.05% |
| Multiple (CT, MRI, Ultrasound, Nuclear Medicine) | 1 | 0.05% |
| Nuclear Medicine with SPECT/CT | 1 | 0.05% |
| PET/CT (Hybrid Nuclear Medicine and CT) | 1 | 0.05% |
| Pulmonary Function Test | 1 | 0.05% |
| Fluoroscopy/Digital Subtraction Angiography (DSA) | 1 | 0.05% |
| Endoscopy | 1 | 0.05% |

## Sample Data Validation

### A41.9 - Sepsis, unspecified organism

- Mappings: 5
- Markdown docs: 1

#### Top mappings

| CPT Code | Description | Modality | Appropriateness |
|----------|-------------|----------|----------------|
| 74177 | CT Abdomen and Pelvis with Contrast | Computed Tomography (CT) | 8 |
| 76705 | Ultrasound, abdominal, real time with image documentation; limited (eg, single organ, quadrant, follow-up) | Ultrasound | 8 |
| 93306 | Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, complete, with spectral Doppler echocardiography, and with color flow Doppler echocardiography | Ultrasound | 8 |

#### Markdown doc snippet

```
# Medical Imaging Recommendation for ICD-10 Code A41.9...
```

### E11.9 - Type 2 diabetes mellitus without complications

- Mappings: 4
- Markdown docs: 1

#### Top mappings

| CPT Code | Description | Modality | Appropriateness |
|----------|-------------|----------|----------------|
| 75571 | Computed tomography, heart, without contrast material, with quantitative evaluation of coronary calcium | CT | 8 |
| 93306 | Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, complete, with spectral Doppler echocardiography, and with color flow Doppler echocardiography | Ultrasound | 7 |
| 93925 | Duplex scan of lower extremity arteries or arterial bypass grafts; complete bilateral study | Ultrasound | 7 |

#### Markdown doc snippet

```
# Medical Imaging Recommendation for ICD-10 Code E11.9...
```

### I21.3 - ST elevation (STEMI) myocardial infarction of unspecified site

- Mappings: 0
- Markdown docs: 0

### J18.9 - Pneumonia, unspecified organism

- Mappings: 0
- Markdown docs: 1

#### Markdown doc snippet

```
# Medical Imaging Recommendation for ICD-10 Code J18.9...
```

### K29.0 - Acute gastritis

- Mappings: 0
- Markdown docs: 0

### M54.5 - Low back pain

- Mappings: 3
- Markdown docs: 1

#### Top mappings

| CPT Code | Description | Modality | Appropriateness |
|----------|-------------|----------|----------------|
| 72148 | Magnetic resonance imaging (MRI), lumbar spine; without contrast material | MRI | 8 |
| 72100 | Radiologic examination, spine, lumbosacral; anteroposterior and lateral views | X-ray | 7 |
| 72131 | CT scan of lumbar spine; without contrast material | CT | 6 |

#### Markdown doc snippet

```
# Medical Imaging Recommendation for ICD-10 Code M54.5...
```

### R51 - Headache

- Mappings: 0
- Markdown docs: 1

#### Markdown doc snippet

```
# Medical Imaging Recommendation for ICD-10 Code R51...
```

### S06.0 - Concussion

- Mappings: 4
- Markdown docs: 1

#### Top mappings

| CPT Code | Description | Modality | Appropriateness |
|----------|-------------|----------|----------------|
| 70450 | Computed tomography, head or brain; without contrast material | CT | 9 |
| 70551 | Magnetic resonance (e.g., proton) imaging, brain (including brain stem); without contrast material | MRI | 8 |
| 70496 | CT Angiography, Head and Neck, with contrast material(s), including noncontrast images, if performed, and image postprocessing | CT | 7 |

#### Markdown doc snippet

```
# Medical Imaging Recommendation for ICD-10 Code S06.0...
```

## Summary

### Issues Found

- 10 types of duplicate mappings found

### Coverage Statistics

- ICD-10 codes with mappings: 1.44%
- ICD-10 codes with markdown docs: 2.00%
- CPT codes with mappings: 49.17%

