
23|RadOrderPad  | Test mode active: Database validation logging skipped (but context/prompt logging should still work)
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: LOG_LLM_CONTEXT env var: true
23|RadOrderPad  | LOG_LLM_CONTEXT env var: true
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: config.llm.logLlmContext value: true
23|RadOrderPad  | config.llm.logLlmContext value: true
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Test mode: true
23|RadOrderPad  | Test mode: true
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Starting validation process...
23|RadOrderPad  | Starting validation process...
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PHI sanitization completed
23|RadOrderPad  | PHI sanitization completed
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Extracted keywords count: 16
23|RadOrderPad  | Extracted keywords count: 16
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Looking for active default prompt template
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Prompt template query result:
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Using prompt template ID: 18
23|RadOrderPad  | Using prompt template ID: 18
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Generating database context with RedisSearch using keywords:
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Testing Redis Cloud connection...
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Redis Cloud connection test result: PONG
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Redis connection successful, proceeding with RedisSearch
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT_PATH: Using RedisSearch weighted search as primary path
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Searching for ICD-10 codes with weighted RedisSearch...
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Found 20 relevant ICD-10 codes with weighted RedisSearch (took 2ms)
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Searching for CPT codes with weighted RedisSearch...
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Found 20 relevant CPT codes with weighted RedisSearch (took 1ms)
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Getting mappings with weighted search from Redis...
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Found 20 relevant mappings with weighted search from Redis (took 2ms)
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Getting markdown docs with weighted search from Redis...
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Found 20 relevant markdown docs with weighted search from Redis (took 2ms)
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Total Redis context generation took 10ms
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Database context generation completed
23|RadOrderPad  | Database context generation completed
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: About to check logLlmContext: true
23|RadOrderPad  | About to check logLlmContext: true
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: !!! LOGGING ENABLED - START GENERATED DATABASE CONTEXT !!!
23|RadOrderPad  | !!! LOGGING ENABLED - START GENERATED DATABASE CONTEXT !!!
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Context Length: 25627 characters
23|RadOrderPad  | Context Length: 25627 characters
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Logging database context in chunks due to size...
23|RadOrderPad  | Logging database context in chunks due to size...
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 1: -- Relevant ICD-10 Codes --
23|RadOrderPad  | I27.21 - Secondary pulmonary arterial hypertension
23|RadOrderPad  | W88.0 - Exposure to X-rays
23|RadOrderPad  | I71.02 - Dissection of abdominal aorta
23|RadOrderPad  | I77.3 - Arterial fibromuscular dysplasia
23|RadOrderPad  | I74 - Arterial embolism and thrombosis
23|RadOrderPad  | I74.0 - Embolism and thrombosis of abdominal aorta
23|RadOrderPad  | I76 - Septic arterial embolism
23|RadOrderPad  | I74.01 - Saddle embolus of abdominal aorta
23|RadOrderPad  | I77.7 - Other arterial dissection
23|RadOrderPad  | N52.01 - Erectile dysfunction due to arterial insufficiency
23|RadOrderPad  | N52.03 - Combined arterial insufficiency and corporo-venous occlusive erectile dysfunction
23|RadOrderPad  | Q20.0 - Common arterial trunk
23|RadOrderPad  | Clinical Notes: Truncus arteriosus is a rare cyanotic congenital heart defect where a single arterial trunk arises from the heart, supplying the systemic, pulmonary, and coronary circulations. It is typically associated with a ventricular septal defect. Early diagnosis and surgical intervention are critical. The condition is usually diagnosed in infancy but may be detected prenatally. Adult survivors of repair require li
23|RadOrderPad  | CONTEXT CHUNK 1: -- Relevant ICD-10 Codes --
23|RadOrderPad  | I27.21 - Secondary pulmonary arterial hypertension
23|RadOrderPad  | W88.0 - Exposure to X-rays
23|RadOrderPad  | I71.02 - Dissection of abdominal aorta
23|RadOrderPad  | I77.3 - Arterial fibromuscular dysplasia
23|RadOrderPad  | I74 - Arterial embolism and thrombosis
23|RadOrderPad  | I74.0 - Embolism and thrombosis of abdominal aorta
23|RadOrderPad  | I76 - Septic arterial embolism
23|RadOrderPad  | I74.01 - Saddle embolus of abdominal aorta
23|RadOrderPad  | I77.7 - Other arterial dissection
23|RadOrderPad  | N52.01 - Erectile dysfunction due to arterial insufficiency
23|RadOrderPad  | N52.03 - Combined arterial insufficiency and corporo-venous occlusive erectile dysfunction
23|RadOrderPad  | Q20.0 - Common arterial trunk
23|RadOrderPad  | Clinical Notes: Truncus arteriosus is a rare cyanotic congenital heart defect where a single arterial trunk arises from the heart, supplying the systemic, pulmonary, and coronary circulations. It is typically associated with a ventricular septal defect. Early diagnosis and surgical intervention are critical. The condition is usually diagnosed in infancy but may be detected prenatally. Adult survivors of repair require li
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 2: felong specialized cardiac care. According to the 2018 ACC/AHA Guidelines, all patients should be evaluated by a congenital heart disease specialist.
23|RadOrderPad  | Recommended Imaging: ECHOCARDIOGRAPHY, MRI, CT, ANGIOGRAPHY
23|RadOrderPad  | Primary Imaging: Echocardiography (transthoracic and/or transesophageal) is the first-line imaging modality for diagnosis and assessment of truncus arteriosus. According to the ACC/AHA 2018 Guidelines for Management of Adults with Congenital Heart Disease, echocardiography provides detailed anatomical and functional assessment of the common trunk, truncal valve, ventricular septal defect, and branch pulmonary arteries.
23|RadOrderPad  | Q87.82 - Arterial tortuosity syndrome
23|RadOrderPad  | S35.0 - Injury of abdominal aorta
23|RadOrderPad  | S35.00 - Unspecified injury of abdominal aorta
23|RadOrderPad  | S35.01 - Minor laceration of abdominal aorta
23|RadOrderPad  | S35.02 - Major laceration of abdominal aorta
23|RadOrderPad  | S35.09 - Other injury of abdominal aorta
23|RadOrderPad  | T82.311 - Breakdown (mechanical) of carotid arterial graft (bypass)
23|RadOrderPad  | T82.312 - Breakdown (mechanical) of femor
23|RadOrderPad  | CONTEXT CHUNK 2: felong specialized cardiac care. According to the 2018 ACC/AHA Guidelines, all patients should be evaluated by a congenital heart disease specialist.
23|RadOrderPad  | Recommended Imaging: ECHOCARDIOGRAPHY, MRI, CT, ANGIOGRAPHY
23|RadOrderPad  | Primary Imaging: Echocardiography (transthoracic and/or transesophageal) is the first-line imaging modality for diagnosis and assessment of truncus arteriosus. According to the ACC/AHA 2018 Guidelines for Management of Adults with Congenital Heart Disease, echocardiography provides detailed anatomical and functional assessment of the common trunk, truncal valve, ventricular septal defect, and branch pulmonary arteries.
23|RadOrderPad  | Q87.82 - Arterial tortuosity syndrome
23|RadOrderPad  | S35.0 - Injury of abdominal aorta
23|RadOrderPad  | S35.00 - Unspecified injury of abdominal aorta
23|RadOrderPad  | S35.01 - Minor laceration of abdominal aorta
23|RadOrderPad  | S35.02 - Major laceration of abdominal aorta
23|RadOrderPad  | S35.09 - Other injury of abdominal aorta
23|RadOrderPad  | T82.311 - Breakdown (mechanical) of carotid arterial graft (bypass)
23|RadOrderPad  | T82.312 - Breakdown (mechanical) of femor
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 3: al arterial graft (bypass)
23|RadOrderPad  | -- Relevant CPT Codes --
23|RadOrderPad  | 37224 - Revascularization, endovascular, open or percutaneous, femoral, popliteal artery(s), unilateral; with transluminal angioplasty
23|RadOrderPad  | Modality: Fluoroscopy
23|RadOrderPad  | Body Part: Lower extremity - Femoral/Popliteal artery
23|RadOrderPad  | 76700 - Ultrasound, abdominal, complete
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Abdomen
23|RadOrderPad  | 76705 - Ultrasound, abdominal, real time with image documentation; limited (eg, single organ, quadrant, follow-up)
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Abdomen (Limited)
23|RadOrderPad  | 93976 - Duplex scan of arterial inflow and venous outflow of penile vessels; limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Penis
23|RadOrderPad  | 93981 - Duplex scan of arterial inflow and venous outflow of penile vessels; follow-up or limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Penis
23|RadOrderPad  | 74221 - Contrast X-ray examination of pharynx and/or cervical esophagus
23|RadOrderPad  | Modality: X-ray
23|RadOrderPad  | Body Part: Pharynx and cervical esophagus
23|RadOrderPad  | 73523 - X-ray, hips, bilateral, with pelvis, 3 or more views
23|RadOrderPad  | Modality: X-ray
23|RadOrderPad  | Body Pa
23|RadOrderPad  | CONTEXT CHUNK 3: al arterial graft (bypass)
23|RadOrderPad  | -- Relevant CPT Codes --
23|RadOrderPad  | 37224 - Revascularization, endovascular, open or percutaneous, femoral, popliteal artery(s), unilateral; with transluminal angioplasty
23|RadOrderPad  | Modality: Fluoroscopy
23|RadOrderPad  | Body Part: Lower extremity - Femoral/Popliteal artery
23|RadOrderPad  | 76700 - Ultrasound, abdominal, complete
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Abdomen
23|RadOrderPad  | 76705 - Ultrasound, abdominal, real time with image documentation; limited (eg, single organ, quadrant, follow-up)
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Abdomen (Limited)
23|RadOrderPad  | 93976 - Duplex scan of arterial inflow and venous outflow of penile vessels; limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Penis
23|RadOrderPad  | 93981 - Duplex scan of arterial inflow and venous outflow of penile vessels; follow-up or limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Penis
23|RadOrderPad  | 74221 - Contrast X-ray examination of pharynx and/or cervical esophagus
23|RadOrderPad  | Modality: X-ray
23|RadOrderPad  | Body Part: Pharynx and cervical esophagus
23|RadOrderPad  | 73523 - X-ray, hips, bilateral, with pelvis, 3 or more views
23|RadOrderPad  | Modality: X-ray
23|RadOrderPad  | Body Pa
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 4: rt: Hips and Pelvis
23|RadOrderPad  | 77080 - Dual-energy X-ray absorptiometry (DXA), bone density study, 1 or more sites; axial skeleton (e.g., hips, pelvis, spine)
23|RadOrderPad  | Modality: Dual-energy X-ray absorptiometry (DXA)
23|RadOrderPad  | Body Part: Axial skeleton (hips, pelvis, spine)
23|RadOrderPad  | 73706 - CT Angiography, Lower Extremity
23|RadOrderPad  | Modality: CT
23|RadOrderPad  | Body Part: Lower Extremity
23|RadOrderPad  | 93925 - Duplex scan of lower extremity arteries or arterial bypass grafts; complete bilateral study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Lower extremity arteries
23|RadOrderPad  | 93926 - Duplex scan of lower extremity arteries or arterial bypass grafts; unilateral or limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Lower extremity arteries
23|RadOrderPad  | 93930 - Duplex scan of upper extremity arteries or arterial bypass grafts; complete bilateral study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Upper extremity arteries
23|RadOrderPad  | 93931 - Duplex scan of upper extremity arteries or arterial bypass grafts; unilateral or limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Upper extremity arteries
23|RadOrderPad  | 75625 - Aortography, abdominal, by
23|RadOrderPad  | CONTEXT CHUNK 4: rt: Hips and Pelvis
23|RadOrderPad  | 77080 - Dual-energy X-ray absorptiometry (DXA), bone density study, 1 or more sites; axial skeleton (e.g., hips, pelvis, spine)
23|RadOrderPad  | Modality: Dual-energy X-ray absorptiometry (DXA)
23|RadOrderPad  | Body Part: Axial skeleton (hips, pelvis, spine)
23|RadOrderPad  | 73706 - CT Angiography, Lower Extremity
23|RadOrderPad  | Modality: CT
23|RadOrderPad  | Body Part: Lower Extremity
23|RadOrderPad  | 93925 - Duplex scan of lower extremity arteries or arterial bypass grafts; complete bilateral study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Lower extremity arteries
23|RadOrderPad  | 93926 - Duplex scan of lower extremity arteries or arterial bypass grafts; unilateral or limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Lower extremity arteries
23|RadOrderPad  | 93930 - Duplex scan of upper extremity arteries or arterial bypass grafts; complete bilateral study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Upper extremity arteries
23|RadOrderPad  | 93931 - Duplex scan of upper extremity arteries or arterial bypass grafts; unilateral or limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Upper extremity arteries
23|RadOrderPad  | 75625 - Aortography, abdominal, by
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 5:  serialography, radiological supervision and interpretation
23|RadOrderPad  | Modality: Fluoroscopy/Angiography
23|RadOrderPad  | Body Part: Abdominal Aorta
23|RadOrderPad  | 75630 - Aortography, abdominal, by serialography, radiological supervision and interpretation
23|RadOrderPad  | Modality: Fluoroscopy/Angiography
23|RadOrderPad  | Body Part: Abdominal aorta and lower extremity vessels
23|RadOrderPad  | 49083 - Abdominal paracentesis (diagnostic or therapeutic); with imaging guidance
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Abdomen
23|RadOrderPad  | 75710 - Angiography, extremity, unilateral, radiological supervision and interpretation
23|RadOrderPad  | Modality: Fluoroscopy/Angiography
23|RadOrderPad  | Body Part: Extremity (arm or leg)
23|RadOrderPad  | 75716 - Angiography, extremity, bilateral, radiological supervision and interpretation
23|RadOrderPad  | Modality: Fluoroscopy/Angiography
23|RadOrderPad  | Body Part: Extremities (upper and/or lower)
23|RadOrderPad  | 93882 - Duplex scan of extracranial arteries; unilateral or limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Extracranial arteries (carotid and vertebral arteries)
23|RadOrderPad  | 72198 - Magnetic resonance angiography, pelvis, with contrast material(s)
23|RadOrderPad  | Modality: MR
23|RadOrderPad  | CONTEXT CHUNK 5:  serialography, radiological supervision and interpretation
23|RadOrderPad  | Modality: Fluoroscopy/Angiography
23|RadOrderPad  | Body Part: Abdominal Aorta
23|RadOrderPad  | 75630 - Aortography, abdominal, by serialography, radiological supervision and interpretation
23|RadOrderPad  | Modality: Fluoroscopy/Angiography
23|RadOrderPad  | Body Part: Abdominal aorta and lower extremity vessels
23|RadOrderPad  | 49083 - Abdominal paracentesis (diagnostic or therapeutic); with imaging guidance
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Abdomen
23|RadOrderPad  | 75710 - Angiography, extremity, unilateral, radiological supervision and interpretation
23|RadOrderPad  | Modality: Fluoroscopy/Angiography
23|RadOrderPad  | Body Part: Extremity (arm or leg)
23|RadOrderPad  | 75716 - Angiography, extremity, bilateral, radiological supervision and interpretation
23|RadOrderPad  | Modality: Fluoroscopy/Angiography
23|RadOrderPad  | Body Part: Extremities (upper and/or lower)
23|RadOrderPad  | 93882 - Duplex scan of extracranial arteries; unilateral or limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Extracranial arteries (carotid and vertebral arteries)
23|RadOrderPad  | 72198 - Magnetic resonance angiography, pelvis, with contrast material(s)
23|RadOrderPad  | Modality: MR
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 6: I
23|RadOrderPad  | Body Part: Pelvis
23|RadOrderPad  | -- Relevant ICD-10 to CPT Mappings --
23|RadOrderPad  | ICD-10: R07.8 (Other chest pain) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.1.
23|RadOrderPad  | Justification: ECG (93000) is maximally appropriate (9/9) for chest pain (R07.8) evaluation, serving as the essential first-line diagnostic test. Most valuable for acute-onset chest pain, especially with exertional features or cardiovascular risk factors. Advantages include immediate availability, zero radiation, and high specificity (85-95%), though sensitivity for early MI is moderate (54-69%). Serial ECGs significantly improve diagnostic accuracy.
23|RadOrderPad  | ICD-10: R07.8 (Other chest pain) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitativ
23|RadOrderPad  | CONTEXT CHUNK 6: I
23|RadOrderPad  | Body Part: Pelvis
23|RadOrderPad  | -- Relevant ICD-10 to CPT Mappings --
23|RadOrderPad  | ICD-10: R07.8 (Other chest pain) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.1.
23|RadOrderPad  | Justification: ECG (93000) is maximally appropriate (9/9) for chest pain (R07.8) evaluation, serving as the essential first-line diagnostic test. Most valuable for acute-onset chest pain, especially with exertional features or cardiovascular risk factors. Advantages include immediate availability, zero radiation, and high specificity (85-95%), though sensitivity for early MI is moderate (54-69%). Serial ECGs significantly improve diagnostic accuracy.
23|RadOrderPad  | ICD-10: R07.8 (Other chest pain) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitativ
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 7: e or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368-e454, Section 4.1.2
23|RadOrderPad  | Justification: MPI SPECT is usually appropriate (7/9) for evaluating non-specific chest pain (R07.8) in patients with intermediate CAD risk, particularly with uninterpretable ECG, inability to exercise, or post-revascularization symptoms. Key advantages include high sensitivity for multi-vessel disease, though radiation exposure (9.3-13.5 mSv) remains a limitation compared to stress echocardiography.
23|RadOrderPad  | ICD-10: R07.4 (Chest pain, unspecified) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or q
23|RadOrderPad  | CONTEXT CHUNK 7: e or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368-e454, Section 4.1.2
23|RadOrderPad  | Justification: MPI SPECT is usually appropriate (7/9) for evaluating non-specific chest pain (R07.8) in patients with intermediate CAD risk, particularly with uninterpretable ECG, inability to exercise, or post-revascularization symptoms. Key advantages include high sensitivity for multi-vessel disease, though radiation exposure (9.3-13.5 mSv) remains a limitation compared to stress echocardiography.
23|RadOrderPad  | ICD-10: R07.4 (Chest pain, unspecified) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or q
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 8: uantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368-e454, Section 4.1.2
23|RadOrderPad  | Justification: MPI SPECT is usually appropriate (7/9) for unspecified chest pain, particularly in intermediate-risk patients (10-20% pre-test probability) with non-diagnostic ECGs or exercise limitations. Its high sensitivity (87-89%) for detecting CAD outweighs radiation exposure concerns (9.3-12.8 mSv), especially when echocardiography is limited by body habitus or poor acoustic windows.
23|RadOrderPad  | ICD-10: R07.4 (Chest pain, unspecified) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, d
23|RadOrderPad  | CONTEXT CHUNK 8: uantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368-e454, Section 4.1.2
23|RadOrderPad  | Justification: MPI SPECT is usually appropriate (7/9) for unspecified chest pain, particularly in intermediate-risk patients (10-20% pre-test probability) with non-diagnostic ECGs or exercise limitations. Its high sensitivity (87-89%) for detecting CAD outweighs radiation exposure concerns (9.3-12.8 mSv), especially when echocardiography is limited by body habitus or poor acoustic windows.
23|RadOrderPad  | ICD-10: R07.4 (Chest pain, unspecified) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, d
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 9: uring rest and cardiovascular stress test using treadmill, bicycle exercise and/or pharmacologically induced stress, with interpretation and report; including performance of continuous electrocardiographic monitoring, with supervision by a physician or other qualified health care professional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for unspecified chest pain, particularly for patients with intermediate CAD risk (10-90%), exertional symptoms, and normal/equivocal resting ECG. Key advantages include absence of radiation, good diagnostic accuracy (sensitivity 76-86%, specificity 82-91%), and ability to assess both ischemia and structural abnormalities simultaneously. Most valuable when performed within 72 hours of presentation in patients with HEART scores 4
23|RadOrderPad  | CONTEXT CHUNK 9: uring rest and cardiovascular stress test using treadmill, bicycle exercise and/or pharmacologically induced stress, with interpretation and report; including performance of continuous electrocardiographic monitoring, with supervision by a physician or other qualified health care professional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for unspecified chest pain, particularly for patients with intermediate CAD risk (10-90%), exertional symptoms, and normal/equivocal resting ECG. Key advantages include absence of radiation, good diagnostic accuracy (sensitivity 76-86%, specificity 82-91%), and ability to assess both ischemia and structural abnormalities simultaneously. Most valuable when performed within 72 hours of presentation in patients with HEART scores 4
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 10: -6.
23|RadOrderPad  | ICD-10: R07.9 (Chest pain, unspecified) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: MPI is appropriately rated 7/9 for unspecified chest pain, particularly valuable for intermediate-risk patients with non-diagnostic ECGs or inability to exercise. It offers superior sensitivity (87-89%) compared to stress ECG but involves moderate radiation exposure (9-12 mSv). Most beneficial when performed within 72 hours of presentation after initial troponin assessment.
23|RadOrderPad  | ICD-10:
23|RadOrderPad  | CONTEXT CHUNK 10: -6.
23|RadOrderPad  | ICD-10: R07.9 (Chest pain, unspecified) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: MPI is appropriately rated 7/9 for unspecified chest pain, particularly valuable for intermediate-risk patients with non-diagnostic ECGs or inability to exercise. It offers superior sensitivity (87-89%) compared to stress ECG but involves moderate radiation exposure (9-12 mSv). Most beneficial when performed within 72 hours of presentation after initial troponin assessment.
23|RadOrderPad  | ICD-10:
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 11:  R07.3 (Other chest pain) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.2.
23|RadOrderPad  | Justification: MPI SPECT is usually appropriate (7/9) for chest pain evaluation in patients with intermediate pre-test probability of CAD (10-90%), abnormal resting ECG, or inability to exercise adequately. Its high sensitivity (87-89%) for detecting ischemia outweighs radiation concerns (9.3-16.3 mSv) when functional assessment is needed, though CCTA may be preferred in younger patients with normal ECGs.
23|RadOrderPad  | ICD-10:
23|RadOrderPad  | CONTEXT CHUNK 11:  R07.3 (Other chest pain) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.2.
23|RadOrderPad  | Justification: MPI SPECT is usually appropriate (7/9) for chest pain evaluation in patients with intermediate pre-test probability of CAD (10-90%), abnormal resting ECG, or inability to exercise adequately. Its high sensitivity (87-89%) for detecting ischemia outweighs radiation concerns (9.3-16.3 mSv) when functional assessment is needed, though CCTA may be preferred in younger patients with normal ECGs.
23|RadOrderPad  | ICD-10:
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 12: R07.5 (Precordial pain) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: MPI is usually appropriate (7/9) for unspecified chest pain with intermediate pretest probability of CAD. Most valuable for exertional chest pain with cardiovascular risk factors, abnormal baseline ECG, or limited exercise capacity. Key advantages include high sensitivity (87%) for detecting CAD, though radiation exposure (9-12 mSv) is a limitation compared to stress echocardiography.
23|RadOrderPad  | ICD-10: R07.8 (Other
23|RadOrderPad  | CONTEXT CHUNK 12: R07.5 (Precordial pain) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: MPI is usually appropriate (7/9) for unspecified chest pain with intermediate pretest probability of CAD. Most valuable for exertional chest pain with cardiovascular risk factors, abnormal baseline ECG, or limited exercise capacity. Key advantages include high sensitivity (87%) for detecting CAD, though radiation exposure (9-12 mSv) is a limitation compared to stress echocardiography.
23|RadOrderPad  | ICD-10: R07.8 (Other
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 13: chest pain) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, during rest and cardiovascular stress test using treadmill, bicycle exercise and/or pharmacologically induced stress, with interpretation and report; including performance of continuous electrocardiographic monitoring, with supervision by a physician or other qualified health care professional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for evaluating chest pain (R07.8), particularly in intermediate-risk patients without known CAD. It offers excellent diagnostic accuracy (sensitivity 76-88%, specificity 77-91%) without radiation exposure, making it superior to exercise ECG and comparable to nuclear imaging. Most valua
23|RadOrderPad  | CONTEXT CHUNK 13: chest pain) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, during rest and cardiovascular stress test using treadmill, bicycle exercise and/or pharmacologically induced stress, with interpretation and report; including performance of continuous electrocardiographic monitoring, with supervision by a physician or other qualified health care professional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for evaluating chest pain (R07.8), particularly in intermediate-risk patients without known CAD. It offers excellent diagnostic accuracy (sensitivity 76-88%, specificity 77-91%) without radiation exposure, making it superior to exercise ECG and comparable to nuclear imaging. Most valua
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 14: ble when acoustic windows are adequate and patients can exercise appropriately.
23|RadOrderPad  | ICD-10: R07.6 (Pleuritic pain) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, during rest and cardiovascular stress test using treadmill, bicycle exercise and/or pharmacologically induced stress, with interpretation and report; including performance of continuous electrocardiographic monitoring, with supervision by a physician or other qualified health care professional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for unspecified chest pain, particularly in intermediate-risk patients, those with uninterpretable ECGs, and women with atypical symptoms. Key advantages include absence of radiation, ex
23|RadOrderPad  | CONTEXT CHUNK 14: ble when acoustic windows are adequate and patients can exercise appropriately.
23|RadOrderPad  | ICD-10: R07.6 (Pleuritic pain) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, during rest and cardiovascular stress test using treadmill, bicycle exercise and/or pharmacologically induced stress, with interpretation and report; including performance of continuous electrocardiographic monitoring, with supervision by a physician or other qualified health care professional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for unspecified chest pain, particularly in intermediate-risk patients, those with uninterpretable ECGs, and women with atypical symptoms. Key advantages include absence of radiation, ex
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 15: cellent specificity (77-91%), and ability to assess both ischemia and structural abnormalities. Most valuable when performed within 72 hours of presentation in patients capable of adequate exercise.
23|RadOrderPad  | ICD-10: R07.5 (Precordial pain) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, during rest and cardiovascular stress test using treadmill, bicycle exercise and/or pharmacologically induced stress, with interpretation and report; including performance of continuous electrocardiographic monitoring, with supervision by a physician or other qualified health care professional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for unspecified chest pain, particularly in patients with intermed
23|RadOrderPad  | CONTEXT CHUNK 15: cellent specificity (77-91%), and ability to assess both ischemia and structural abnormalities. Most valuable when performed within 72 hours of presentation in patients capable of adequate exercise.
23|RadOrderPad  | ICD-10: R07.5 (Precordial pain) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, during rest and cardiovascular stress test using treadmill, bicycle exercise and/or pharmacologically induced stress, with interpretation and report; including performance of continuous electrocardiographic monitoring, with supervision by a physician or other qualified health care professional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for unspecified chest pain, particularly in patients with intermed
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 16: iate pre-test CAD probability (10-90%), multiple cardiovascular risk factors, or non-diagnostic ECG findings. Key advantages include absence of radiation, good diagnostic accuracy (sensitivity 76-86%, specificity 82-89%), and ability to assess both ischemia and structural abnormalities simultaneously.
23|RadOrderPad  | ICD-10: R07.4 (Chest pain, unspecified) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.1.
23|RadOrderPad  | Justification: ECG for unspecified chest pain is maximally appropriate (9/9) as the essential initial diagnostic test, providing immediate, radiation-free assessment for potentially life-threatening cardiac conditions. Most valuable for acute-onset pain, exertional symptoms, or when accompanied by dyspnea. Should be obtained within 10 minutes of
23|RadOrderPad  | CONTEXT CHUNK 16: iate pre-test CAD probability (10-90%), multiple cardiovascular risk factors, or non-diagnostic ECG findings. Key advantages include absence of radiation, good diagnostic accuracy (sensitivity 76-86%, specificity 82-89%), and ability to assess both ischemia and structural abnormalities simultaneously.
23|RadOrderPad  | ICD-10: R07.4 (Chest pain, unspecified) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.1.
23|RadOrderPad  | Justification: ECG for unspecified chest pain is maximally appropriate (9/9) as the essential initial diagnostic test, providing immediate, radiation-free assessment for potentially life-threatening cardiac conditions. Most valuable for acute-onset pain, exertional symptoms, or when accompanied by dyspnea. Should be obtained within 10 minutes of
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 17:  presentation, particularly in patients >40 years or with cardiovascular risk factors.
23|RadOrderPad  | ICD-10: R07.6 (Pleuritic pain) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: 2023 ACC/AHA/ASE/ASNC Guideline for Evaluation and Diagnosis of Chest Pain, J Am Coll Cardiol. 2023;81:e21-e129, Section 4.1.2
23|RadOrderPad  | Justification: MPI is usually appropriate (7/9) for unspecified chest pain, particularly in patients with intermediate CAD probability, abnormal resting ECGs, or inability to exercise adequately. Its high sensitivity (87-89%) for detecting coronary stenosis makes it valuable for risk stratification, though radiation exposure (9-12 mSv) is a limitation compare
23|RadOrderPad  | CONTEXT CHUNK 17:  presentation, particularly in patients >40 years or with cardiovascular risk factors.
23|RadOrderPad  | ICD-10: R07.6 (Pleuritic pain) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: 2023 ACC/AHA/ASE/ASNC Guideline for Evaluation and Diagnosis of Chest Pain, J Am Coll Cardiol. 2023;81:e21-e129, Section 4.1.2
23|RadOrderPad  | Justification: MPI is usually appropriate (7/9) for unspecified chest pain, particularly in patients with intermediate CAD probability, abnormal resting ECGs, or inability to exercise adequately. Its high sensitivity (87-89%) for detecting coronary stenosis makes it valuable for risk stratification, though radiation exposure (9-12 mSv) is a limitation compare
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 18: d to stress echocardiography.
23|RadOrderPad  | ICD-10: I25.110 (Atherosclerotic heart disease of native coronary artery with unstable angina pectoris) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, during rest and cardiovascular stress test using treadmill, bicycle exercise and/or pharmacologically induced stress, with interpretation and report; including performance of continuous electrocardiographic monitoring, with supervision by a physician or other qualified health care professional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: 2022 AHA/ACC/SCAI Guideline for the Management of Patients With Unstable Angina and Non - ST-Segment Elevation Myocardial Infarction. J Am Coll Cardiol. 2022;80(18):e299-e379, Section 4.1.1
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for unstable angina after initial stabilization (>24-48 hours), offering excellent diagnostic accuracy (sensitivity 80-85%, specificity
23|RadOrderPad  | CONTEXT CHUNK 18: d to stress echocardiography.
23|RadOrderPad  | ICD-10: I25.110 (Atherosclerotic heart disease of native coronary artery with unstable angina pectoris) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, during rest and cardiovascular stress test using treadmill, bicycle exercise and/or pharmacologically induced stress, with interpretation and report; including performance of continuous electrocardiographic monitoring, with supervision by a physician or other qualified health care professional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: 2022 AHA/ACC/SCAI Guideline for the Management of Patients With Unstable Angina and Non - ST-Segment Elevation Myocardial Infarction. J Am Coll Cardiol. 2022;80(18):e299-e379, Section 4.1.1
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for unstable angina after initial stabilization (>24-48 hours), offering excellent diagnostic accuracy (sensitivity 80-85%, specificity
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 19:  84-86%) without radiation exposure. Most valuable for risk stratification in intermediate-risk patients with TIMI scores 3-4. Contraindicated during active chest pain or hemodynamic instability, which explains why the rating is not higher (9/9).
23|RadOrderPad  | ICD-10: R07.9 (Chest pain, unspecified) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.1
23|RadOrderPad  | Justification: ECG is highly appropriate (9/9) for unspecified chest pain, serving as the essential initial diagnostic test due to its immediate availability, zero radiation, and ability to detect acute cardiac pathology. Most valuable for acute-onset pain, exertional symptoms, or pain with associated symptoms. Should be performed within 10 minutes of presentation, with serial ECGs improving diagnosti
23|RadOrderPad  | CONTEXT CHUNK 19:  84-86%) without radiation exposure. Most valuable for risk stratification in intermediate-risk patients with TIMI scores 3-4. Contraindicated during active chest pain or hemodynamic instability, which explains why the rating is not higher (9/9).
23|RadOrderPad  | ICD-10: R07.9 (Chest pain, unspecified) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.1
23|RadOrderPad  | Justification: ECG is highly appropriate (9/9) for unspecified chest pain, serving as the essential initial diagnostic test due to its immediate availability, zero radiation, and ability to detect acute cardiac pathology. Most valuable for acute-onset pain, exertional symptoms, or pain with associated symptoms. Should be performed within 10 minutes of presentation, with serial ECGs improving diagnosti
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 20: c yield.
23|RadOrderPad  | ICD-10: R07.9 (Chest pain, unspecified) -> CPT: 75571 (Computed tomography, heart, without contrast material, with quantitative evaluation of coronary calcium)
23|RadOrderPad  | Appropriateness Score: 8/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368-e454, recommendation 4.1.2.
23|RadOrderPad  | Justification: CAC scoring is highly appropriate (8/9) for unspecified chest pain in intermediate-risk patients (10-20% ASCVD risk) without known CAD. Most valuable for risk stratification when traditional risk assessment is inconclusive. Advantages include low radiation (1-2 mSv) and excellent negative predictive value, though it cannot assess stenosis or plaque composition.
23|RadOrderPad  | ICD-10: R07.5 (Precordial pain) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline
23|RadOrderPad  | CONTEXT CHUNK 20: c yield.
23|RadOrderPad  | ICD-10: R07.9 (Chest pain, unspecified) -> CPT: 75571 (Computed tomography, heart, without contrast material, with quantitative evaluation of coronary calcium)
23|RadOrderPad  | Appropriateness Score: 8/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368-e454, recommendation 4.1.2.
23|RadOrderPad  | Justification: CAC scoring is highly appropriate (8/9) for unspecified chest pain in intermediate-risk patients (10-20% ASCVD risk) without known CAD. Most valuable for risk stratification when traditional risk assessment is inconclusive. Advantages include low radiation (1-2 mSv) and excellent negative predictive value, though it cannot assess stenosis or plaque composition.
23|RadOrderPad  | ICD-10: R07.5 (Precordial pain) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 21:  for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.1.
23|RadOrderPad  | Justification: ECG is maximally appropriate (9/9) for unspecified chest pain as the essential initial diagnostic test, ideally performed within 10 minutes of presentation. Most valuable for acute-onset pain, especially with radiation or exertional features. Advantages include immediate availability and zero radiation, though limited sensitivity (45-60%) necessitates serial ECGs and additional testing in high-risk patients.
23|RadOrderPad  | ICD-10: I25.10 (Atherosclerotic heart disease of native coronary artery without angina pectoris) -> CPT: 75571 (Computed tomography, heart, without contrast material, with quantitative evaluation of coronary calcium)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Hecht H, et al. 2023 ACC/AHA Guideline for Evaluation and Diagnosis of Chest Pain. J Am Coll Cardiol. 2023;82(22):e63-e179.
23|RadOrderPad  | Justification: CAC scoring for established CAD without angina is moderately appropriate
23|RadOrderPad  | CONTEXT CHUNK 21:  for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.1.
23|RadOrderPad  | Justification: ECG is maximally appropriate (9/9) for unspecified chest pain as the essential initial diagnostic test, ideally performed within 10 minutes of presentation. Most valuable for acute-onset pain, especially with radiation or exertional features. Advantages include immediate availability and zero radiation, though limited sensitivity (45-60%) necessitates serial ECGs and additional testing in high-risk patients.
23|RadOrderPad  | ICD-10: I25.10 (Atherosclerotic heart disease of native coronary artery without angina pectoris) -> CPT: 75571 (Computed tomography, heart, without contrast material, with quantitative evaluation of coronary calcium)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Hecht H, et al. 2023 ACC/AHA Guideline for Evaluation and Diagnosis of Chest Pain. J Am Coll Cardiol. 2023;82(22):e63-e179.
23|RadOrderPad  | Justification: CAC scoring for established CAD without angina is moderately appropriate
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 22: (7/9) primarily for monitoring disease progression. While providing prognostic information with minimal radiation (1.0-1.5 mSv), it cannot assess stenosis severity or non-calcified plaque. For known CAD, functional testing or CCTA typically offers more actionable clinical information despite the higher radiation exposure.
23|RadOrderPad  | ICD-10: R93.5 (Abnormal findings on diagnostic imaging of other abdominal regions, including retroperitoneum) -> CPT: 74181 (MRI, Abdomen, without contrast)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: ACR Appropriateness Criteria(R) Jaundice, 2023, p.5-7
23|RadOrderPad  | Justification: MRCP is usually appropriate (7/9) for evaluating abnormal abdominal imaging findings (R93.5), particularly when biliary or pancreatic duct abnormalities are suspected. It provides excellent non-invasive visualization of the biliary and pancreatic ductal systems without radiation or procedural risks, making it superior to ERCP for initial diagnostic evaluation when intervention is not immediately requir
23|RadOrderPad  | CONTEXT CHUNK 22: (7/9) primarily for monitoring disease progression. While providing prognostic information with minimal radiation (1.0-1.5 mSv), it cannot assess stenosis severity or non-calcified plaque. For known CAD, functional testing or CCTA typically offers more actionable clinical information despite the higher radiation exposure.
23|RadOrderPad  | ICD-10: R93.5 (Abnormal findings on diagnostic imaging of other abdominal regions, including retroperitoneum) -> CPT: 74181 (MRI, Abdomen, without contrast)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: ACR Appropriateness Criteria(R) Jaundice, 2023, p.5-7
23|RadOrderPad  | Justification: MRCP is usually appropriate (7/9) for evaluating abnormal abdominal imaging findings (R93.5), particularly when biliary or pancreatic duct abnormalities are suspected. It provides excellent non-invasive visualization of the biliary and pancreatic ductal systems without radiation or procedural risks, making it superior to ERCP for initial diagnostic evaluation when intervention is not immediately requir
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 23: ed.
23|RadOrderPad  | ICD-10: R07.6 (Pleuritic pain) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.1.
23|RadOrderPad  | Justification: ECG is maximally appropriate (9/9) for unspecified chest pain as the essential initial diagnostic test, providing immediate, radiation-free assessment of cardiac electrical activity. Most valuable for acute-onset pain, exertional symptoms, or pain with associated features suggesting cardiac origin. Should be performed within 10 minutes of presentation, with serial ECGs increasing diagnostic yield for evolving cardiac events.
23|RadOrderPad  | ICD-10: D64.1 (Secondary sideroblastic anemia due to disease) -> CPT: 74181 (MRI, Abdomen, without contrast)
23|RadOrderPad  | Appropriateness Score: 8/9
23|RadOrderPad  | Evidence Source: ACR Appropriateness Criteria(R) Chronic Liver Disease, 20
23|RadOrderPad  | CONTEXT CHUNK 23: ed.
23|RadOrderPad  | ICD-10: R07.6 (Pleuritic pain) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.1.
23|RadOrderPad  | Justification: ECG is maximally appropriate (9/9) for unspecified chest pain as the essential initial diagnostic test, providing immediate, radiation-free assessment of cardiac electrical activity. Most valuable for acute-onset pain, exertional symptoms, or pain with associated features suggesting cardiac origin. Should be performed within 10 minutes of presentation, with serial ECGs increasing diagnostic yield for evolving cardiac events.
23|RadOrderPad  | ICD-10: D64.1 (Secondary sideroblastic anemia due to disease) -> CPT: 74181 (MRI, Abdomen, without contrast)
23|RadOrderPad  | Appropriateness Score: 8/9
23|RadOrderPad  | Evidence Source: ACR Appropriateness Criteria(R) Chronic Liver Disease, 20
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 24: 24, p.8-9
23|RadOrderPad  | Justification: Abdominal MRI without contrast is highly appropriate (8/9) for secondary sideroblastic anemia due to its superior accuracy in quantifying hepatic iron concentration using T2* sequences. Most valuable for patients with elevated ferritin (>1000 ng/mL), multiple transfusions, or monitoring chelation therapy. Key advantage: non-invasive alternative to liver biopsy with zero radiation exposure.
23|RadOrderPad  | -- Additional Clinical Information --
23|RadOrderPad  | ICD-10: I70.1 (Atherosclerosis of renal artery)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I70.1......
23|RadOrderPad  | ICD-10: I70.0 (Atherosclerosis of aorta)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I70.0......
23|RadOrderPad  | ICD-10: I71.0 (Dissection of aorta)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I71.0......
23|RadOrderPad  | ICD-10: I25.110 (Atherosclerotic heart disease of native coronary artery with unstable angina pectoris)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I25.110......
23|RadOrderPad  | ICD-10: R07.4 (Chest pain, unspecified)
23|RadOrderPad  | # Medical Imaging Recomm
23|RadOrderPad  | CONTEXT CHUNK 24: 24, p.8-9
23|RadOrderPad  | Justification: Abdominal MRI without contrast is highly appropriate (8/9) for secondary sideroblastic anemia due to its superior accuracy in quantifying hepatic iron concentration using T2* sequences. Most valuable for patients with elevated ferritin (>1000 ng/mL), multiple transfusions, or monitoring chelation therapy. Key advantage: non-invasive alternative to liver biopsy with zero radiation exposure.
23|RadOrderPad  | -- Additional Clinical Information --
23|RadOrderPad  | ICD-10: I70.1 (Atherosclerosis of renal artery)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I70.1......
23|RadOrderPad  | ICD-10: I70.0 (Atherosclerosis of aorta)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I70.0......
23|RadOrderPad  | ICD-10: I71.0 (Dissection of aorta)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I71.0......
23|RadOrderPad  | ICD-10: I25.110 (Atherosclerotic heart disease of native coronary artery with unstable angina pectoris)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I25.110......
23|RadOrderPad  | ICD-10: R07.4 (Chest pain, unspecified)
23|RadOrderPad  | # Medical Imaging Recomm
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 25: endation for ICD-10 Code R07.4......
23|RadOrderPad  | ICD-10: R07 (Pain in throat and chest)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07......
23|RadOrderPad  | ICD-10: R07.1 (Chest pain on breathing)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07.1......
23|RadOrderPad  | ICD-10: R07.8 (Other chest pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07.8......
23|RadOrderPad  | ICD-10: R07.9 (Chest pain, unspecified)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07.9......
23|RadOrderPad  | ICD-10: R07.3 (Other chest pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07.3......
23|RadOrderPad  | ICD-10: R10.17 (Generalized abdominal pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.17......
23|RadOrderPad  | ICD-10: R10.5 (Abdominal tenderness)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.5......
23|RadOrderPad  | ICD-10: R10.36 (Acute abdominal pain in epigastrium)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.36......
23|RadOrderPad  | ICD-10: R10.9 (Unspecified abdominal pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.9......
23|RadOrderPad  | ICD-10: R10.38 (Acute abdominal pain in ot
23|RadOrderPad  | CONTEXT CHUNK 25: endation for ICD-10 Code R07.4......
23|RadOrderPad  | ICD-10: R07 (Pain in throat and chest)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07......
23|RadOrderPad  | ICD-10: R07.1 (Chest pain on breathing)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07.1......
23|RadOrderPad  | ICD-10: R07.8 (Other chest pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07.8......
23|RadOrderPad  | ICD-10: R07.9 (Chest pain, unspecified)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07.9......
23|RadOrderPad  | ICD-10: R07.3 (Other chest pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07.3......
23|RadOrderPad  | ICD-10: R10.17 (Generalized abdominal pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.17......
23|RadOrderPad  | ICD-10: R10.5 (Abdominal tenderness)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.5......
23|RadOrderPad  | ICD-10: R10.36 (Acute abdominal pain in epigastrium)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.36......
23|RadOrderPad  | ICD-10: R10.9 (Unspecified abdominal pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.9......
23|RadOrderPad  | ICD-10: R10.38 (Acute abdominal pain in ot
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: CONTEXT CHUNK 26: her specified location)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.38......
23|RadOrderPad  | ICD-10: I71.3 (Abdominal aortic aneurysm, ruptured)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I71.3......
23|RadOrderPad  | ICD-10: R10 (Abdominal and pelvic pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10......
23|RadOrderPad  | ICD-10: R10.8 (Other abdominal pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.8......
23|RadOrderPad  | ICD-10: R10.84 (Generalized abdominal pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.84......
23|RadOrderPad  | ICD-10: R19.31 (Right upper quadrant abdominal rigidity)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R19.31......
23|RadOrderPad  |
23|RadOrderPad  | CONTEXT CHUNK 26: her specified location)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.38......
23|RadOrderPad  | ICD-10: I71.3 (Abdominal aortic aneurysm, ruptured)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I71.3......
23|RadOrderPad  | ICD-10: R10 (Abdominal and pelvic pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10......
23|RadOrderPad  | ICD-10: R10.8 (Other abdominal pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.8......
23|RadOrderPad  | ICD-10: R10.84 (Generalized abdominal pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.84......
23|RadOrderPad  | ICD-10: R19.31 (Right upper quadrant abdominal rigidity)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R19.31......
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: !!! LOGGING ENABLED - END GENERATED DATABASE CONTEXT !!!
23|RadOrderPad  | !!! LOGGING ENABLED - END GENERATED DATABASE CONTEXT !!!
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Using word count limit: 33
23|RadOrderPad  | Using word count limit: 33
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Prompt construction completed
23|RadOrderPad  | Prompt construction completed
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: About to check logLlmContext again: true
23|RadOrderPad  | About to check logLlmContext again: true
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: !!! LOGGING ENABLED - START FINAL LLM PROMPT !!!
23|RadOrderPad  | !!! LOGGING ENABLED - START FINAL LLM PROMPT !!!
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Prompt Length: 27800 characters
23|RadOrderPad  | Prompt Length: 27800 characters
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Logging LLM prompt in chunks due to size...
23|RadOrderPad  | Logging LLM prompt in chunks due to size...
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 1: You are RadValidator, an AI clinical decision support system for radiology order validation.
23|RadOrderPad  |
23|RadOrderPad  | Your task is to analyze a physician's dictation for a radiology order and produce the following outputs:
23|RadOrderPad  | 1. Extract relevant ICD-10 diagnosis codes (CRITICAL: You MUST mark EXACTLY ONE code as isPrimary: true)
23|RadOrderPad  | 2. Extract or suggest appropriate CPT procedure codes
23|RadOrderPad  | 3. Validate if the imaging order is clinically appropriate
23|RadOrderPad  | 4. Assign a compliance score from 1-9
23|RadOrderPad  | 5. Provide brief educational feedback if the order is inappropriate
23|RadOrderPad  | 6. Evaluate dictation for stat status
23|RadOrderPad  |
23|RadOrderPad  | -- Relevant ICD-10 Codes --
23|RadOrderPad  | I27.21 - Secondary pulmonary arterial hypertension
23|RadOrderPad  | W88.0 - Exposure to X-rays
23|RadOrderPad  | I71.02 - Dissection of abdominal aorta
23|RadOrderPad  | I77.3 - Arterial fibromuscular dysplasia
23|RadOrderPad  | I74 - Arterial embolism and thrombosis
23|RadOrderPad  | I74.0 - Embolism and thrombosis of abdominal aorta
23|RadOrderPad  | I76 - Septic arterial embolism
23|RadOrderPad  | I74.01 - Saddle embolus of abdominal aorta
23|RadOrderPad  | I77.7 - Other arterial dissection
23|RadOrderPad  | N52.01 - Erectile dysfunction due
23|RadOrderPad  | PROMPT CHUNK 1: You are RadValidator, an AI clinical decision support system for radiology order validation.
23|RadOrderPad  |
23|RadOrderPad  | Your task is to analyze a physician's dictation for a radiology order and produce the following outputs:
23|RadOrderPad  | 1. Extract relevant ICD-10 diagnosis codes (CRITICAL: You MUST mark EXACTLY ONE code as isPrimary: true)
23|RadOrderPad  | 2. Extract or suggest appropriate CPT procedure codes
23|RadOrderPad  | 3. Validate if the imaging order is clinically appropriate
23|RadOrderPad  | 4. Assign a compliance score from 1-9
23|RadOrderPad  | 5. Provide brief educational feedback if the order is inappropriate
23|RadOrderPad  | 6. Evaluate dictation for stat status
23|RadOrderPad  |
23|RadOrderPad  | -- Relevant ICD-10 Codes --
23|RadOrderPad  | I27.21 - Secondary pulmonary arterial hypertension
23|RadOrderPad  | W88.0 - Exposure to X-rays
23|RadOrderPad  | I71.02 - Dissection of abdominal aorta
23|RadOrderPad  | I77.3 - Arterial fibromuscular dysplasia
23|RadOrderPad  | I74 - Arterial embolism and thrombosis
23|RadOrderPad  | I74.0 - Embolism and thrombosis of abdominal aorta
23|RadOrderPad  | I76 - Septic arterial embolism
23|RadOrderPad  | I74.01 - Saddle embolus of abdominal aorta
23|RadOrderPad  | I77.7 - Other arterial dissection
23|RadOrderPad  | N52.01 - Erectile dysfunction due
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 2: to arterial insufficiency
23|RadOrderPad  | N52.03 - Combined arterial insufficiency and corporo-venous occlusive erectile dysfunction
23|RadOrderPad  | Q20.0 - Common arterial trunk
23|RadOrderPad  | Clinical Notes: Truncus arteriosus is a rare cyanotic congenital heart defect where a single arterial trunk arises from the heart, supplying the systemic, pulmonary, and coronary circulations. It is typically associated with a ventricular septal defect. Early diagnosis and surgical intervention are critical. The condition is usually diagnosed in infancy but may be detected prenatally. Adult survivors of repair require lifelong specialized cardiac care. According to the 2018 ACC/AHA Guidelines, all patients should be evaluated by a congenital heart disease specialist.
23|RadOrderPad  | Recommended Imaging: ECHOCARDIOGRAPHY, MRI, CT, ANGIOGRAPHY
23|RadOrderPad  | Primary Imaging: Echocardiography (transthoracic and/or transesophageal) is the first-line imaging modality for diagnosis and assessment of truncus arteriosus. According to the ACC/AHA 2018 Guidelines for Management o
23|RadOrderPad  | PROMPT CHUNK 2: to arterial insufficiency
23|RadOrderPad  | N52.03 - Combined arterial insufficiency and corporo-venous occlusive erectile dysfunction
23|RadOrderPad  | Q20.0 - Common arterial trunk
23|RadOrderPad  | Clinical Notes: Truncus arteriosus is a rare cyanotic congenital heart defect where a single arterial trunk arises from the heart, supplying the systemic, pulmonary, and coronary circulations. It is typically associated with a ventricular septal defect. Early diagnosis and surgical intervention are critical. The condition is usually diagnosed in infancy but may be detected prenatally. Adult survivors of repair require lifelong specialized cardiac care. According to the 2018 ACC/AHA Guidelines, all patients should be evaluated by a congenital heart disease specialist.
23|RadOrderPad  | Recommended Imaging: ECHOCARDIOGRAPHY, MRI, CT, ANGIOGRAPHY
23|RadOrderPad  | Primary Imaging: Echocardiography (transthoracic and/or transesophageal) is the first-line imaging modality for diagnosis and assessment of truncus arteriosus. According to the ACC/AHA 2018 Guidelines for Management o
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 3: f Adults with Congenital Heart Disease, echocardiography provides detailed anatomical and functional assessment of the common trunk, truncal valve, ventricular septal defect, and branch pulmonary arteries.
23|RadOrderPad  | Q87.82 - Arterial tortuosity syndrome
23|RadOrderPad  | S35.0 - Injury of abdominal aorta
23|RadOrderPad  | S35.00 - Unspecified injury of abdominal aorta
23|RadOrderPad  | S35.01 - Minor laceration of abdominal aorta
23|RadOrderPad  | S35.02 - Major laceration of abdominal aorta
23|RadOrderPad  | S35.09 - Other injury of abdominal aorta
23|RadOrderPad  | T82.311 - Breakdown (mechanical) of carotid arterial graft (bypass)
23|RadOrderPad  | T82.312 - Breakdown (mechanical) of femoral arterial graft (bypass)
23|RadOrderPad  | -- Relevant CPT Codes --
23|RadOrderPad  | 37224 - Revascularization, endovascular, open or percutaneous, femoral, popliteal artery(s), unilateral; with transluminal angioplasty
23|RadOrderPad  | Modality: Fluoroscopy
23|RadOrderPad  | Body Part: Lower extremity - Femoral/Popliteal artery
23|RadOrderPad  | 76700 - Ultrasound, abdominal, complete
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Abdomen
23|RadOrderPad  | 76705 - Ultrasound, abdominal, real time with image documentation; limited (eg, s
23|RadOrderPad  | PROMPT CHUNK 3: f Adults with Congenital Heart Disease, echocardiography provides detailed anatomical and functional assessment of the common trunk, truncal valve, ventricular septal defect, and branch pulmonary arteries.
23|RadOrderPad  | Q87.82 - Arterial tortuosity syndrome
23|RadOrderPad  | S35.0 - Injury of abdominal aorta
23|RadOrderPad  | S35.00 - Unspecified injury of abdominal aorta
23|RadOrderPad  | S35.01 - Minor laceration of abdominal aorta
23|RadOrderPad  | S35.02 - Major laceration of abdominal aorta
23|RadOrderPad  | S35.09 - Other injury of abdominal aorta
23|RadOrderPad  | T82.311 - Breakdown (mechanical) of carotid arterial graft (bypass)
23|RadOrderPad  | T82.312 - Breakdown (mechanical) of femoral arterial graft (bypass)
23|RadOrderPad  | -- Relevant CPT Codes --
23|RadOrderPad  | 37224 - Revascularization, endovascular, open or percutaneous, femoral, popliteal artery(s), unilateral; with transluminal angioplasty
23|RadOrderPad  | Modality: Fluoroscopy
23|RadOrderPad  | Body Part: Lower extremity - Femoral/Popliteal artery
23|RadOrderPad  | 76700 - Ultrasound, abdominal, complete
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Abdomen
23|RadOrderPad  | 76705 - Ultrasound, abdominal, real time with image documentation; limited (eg, s
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 4: ingle organ, quadrant, follow-up)
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Abdomen (Limited)
23|RadOrderPad  | 93976 - Duplex scan of arterial inflow and venous outflow of penile vessels; limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Penis
23|RadOrderPad  | 93981 - Duplex scan of arterial inflow and venous outflow of penile vessels; follow-up or limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Penis
23|RadOrderPad  | 74221 - Contrast X-ray examination of pharynx and/or cervical esophagus
23|RadOrderPad  | Modality: X-ray
23|RadOrderPad  | Body Part: Pharynx and cervical esophagus
23|RadOrderPad  | 73523 - X-ray, hips, bilateral, with pelvis, 3 or more views
23|RadOrderPad  | Modality: X-ray
23|RadOrderPad  | Body Part: Hips and Pelvis
23|RadOrderPad  | 77080 - Dual-energy X-ray absorptiometry (DXA), bone density study, 1 or more sites; axial skeleton (e.g., hips, pelvis, spine)
23|RadOrderPad  | Modality: Dual-energy X-ray absorptiometry (DXA)
23|RadOrderPad  | Body Part: Axial skeleton (hips, pelvis, spine)
23|RadOrderPad  | 73706 - CT Angiography, Lower Extremity
23|RadOrderPad  | Modality: CT
23|RadOrderPad  | Body Part: Lower Extremity
23|RadOrderPad  | 93925 - Duplex scan of lower extremity arteries or arterial bypass grafts; complete bilateral study
23|RadOrderPad  | PROMPT CHUNK 4: ingle organ, quadrant, follow-up)
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Abdomen (Limited)
23|RadOrderPad  | 93976 - Duplex scan of arterial inflow and venous outflow of penile vessels; limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Penis
23|RadOrderPad  | 93981 - Duplex scan of arterial inflow and venous outflow of penile vessels; follow-up or limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Penis
23|RadOrderPad  | 74221 - Contrast X-ray examination of pharynx and/or cervical esophagus
23|RadOrderPad  | Modality: X-ray
23|RadOrderPad  | Body Part: Pharynx and cervical esophagus
23|RadOrderPad  | 73523 - X-ray, hips, bilateral, with pelvis, 3 or more views
23|RadOrderPad  | Modality: X-ray
23|RadOrderPad  | Body Part: Hips and Pelvis
23|RadOrderPad  | 77080 - Dual-energy X-ray absorptiometry (DXA), bone density study, 1 or more sites; axial skeleton (e.g., hips, pelvis, spine)
23|RadOrderPad  | Modality: Dual-energy X-ray absorptiometry (DXA)
23|RadOrderPad  | Body Part: Axial skeleton (hips, pelvis, spine)
23|RadOrderPad  | 73706 - CT Angiography, Lower Extremity
23|RadOrderPad  | Modality: CT
23|RadOrderPad  | Body Part: Lower Extremity
23|RadOrderPad  | 93925 - Duplex scan of lower extremity arteries or arterial bypass grafts; complete bilateral study
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 5:
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Lower extremity arteries
23|RadOrderPad  | 93926 - Duplex scan of lower extremity arteries or arterial bypass grafts; unilateral or limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Lower extremity arteries
23|RadOrderPad  | 93930 - Duplex scan of upper extremity arteries or arterial bypass grafts; complete bilateral study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Upper extremity arteries
23|RadOrderPad  | 93931 - Duplex scan of upper extremity arteries or arterial bypass grafts; unilateral or limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Upper extremity arteries
23|RadOrderPad  | 75625 - Aortography, abdominal, by serialography, radiological supervision and interpretation
23|RadOrderPad  | Modality: Fluoroscopy/Angiography
23|RadOrderPad  | Body Part: Abdominal Aorta
23|RadOrderPad  | 75630 - Aortography, abdominal, by serialography, radiological supervision and interpretation
23|RadOrderPad  | Modality: Fluoroscopy/Angiography
23|RadOrderPad  | Body Part: Abdominal aorta and lower extremity vessels
23|RadOrderPad  | 49083 - Abdominal paracentesis (diagnostic or therapeutic); with imaging guidance
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Abdomen
23|RadOrderPad  | PROMPT CHUNK 5:
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Lower extremity arteries
23|RadOrderPad  | 93926 - Duplex scan of lower extremity arteries or arterial bypass grafts; unilateral or limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Lower extremity arteries
23|RadOrderPad  | 93930 - Duplex scan of upper extremity arteries or arterial bypass grafts; complete bilateral study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Upper extremity arteries
23|RadOrderPad  | 93931 - Duplex scan of upper extremity arteries or arterial bypass grafts; unilateral or limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Upper extremity arteries
23|RadOrderPad  | 75625 - Aortography, abdominal, by serialography, radiological supervision and interpretation
23|RadOrderPad  | Modality: Fluoroscopy/Angiography
23|RadOrderPad  | Body Part: Abdominal Aorta
23|RadOrderPad  | 75630 - Aortography, abdominal, by serialography, radiological supervision and interpretation
23|RadOrderPad  | Modality: Fluoroscopy/Angiography
23|RadOrderPad  | Body Part: Abdominal aorta and lower extremity vessels
23|RadOrderPad  | 49083 - Abdominal paracentesis (diagnostic or therapeutic); with imaging guidance
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Abdomen
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 6:
23|RadOrderPad  | 75710 - Angiography, extremity, unilateral, radiological supervision and interpretation
23|RadOrderPad  | Modality: Fluoroscopy/Angiography
23|RadOrderPad  | Body Part: Extremity (arm or leg)
23|RadOrderPad  | 75716 - Angiography, extremity, bilateral, radiological supervision and interpretation
23|RadOrderPad  | Modality: Fluoroscopy/Angiography
23|RadOrderPad  | Body Part: Extremities (upper and/or lower)
23|RadOrderPad  | 93882 - Duplex scan of extracranial arteries; unilateral or limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Extracranial arteries (carotid and vertebral arteries)
23|RadOrderPad  | 72198 - Magnetic resonance angiography, pelvis, with contrast material(s)
23|RadOrderPad  | Modality: MRI
23|RadOrderPad  | Body Part: Pelvis
23|RadOrderPad  | -- Relevant ICD-10 to CPT Mappings --
23|RadOrderPad  | ICD-10: R07.8 (Other chest pain) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.1.
23|RadOrderPad  | Justification: ECG (93000)
23|RadOrderPad  | PROMPT CHUNK 6:
23|RadOrderPad  | 75710 - Angiography, extremity, unilateral, radiological supervision and interpretation
23|RadOrderPad  | Modality: Fluoroscopy/Angiography
23|RadOrderPad  | Body Part: Extremity (arm or leg)
23|RadOrderPad  | 75716 - Angiography, extremity, bilateral, radiological supervision and interpretation
23|RadOrderPad  | Modality: Fluoroscopy/Angiography
23|RadOrderPad  | Body Part: Extremities (upper and/or lower)
23|RadOrderPad  | 93882 - Duplex scan of extracranial arteries; unilateral or limited study
23|RadOrderPad  | Modality: Ultrasound
23|RadOrderPad  | Body Part: Extracranial arteries (carotid and vertebral arteries)
23|RadOrderPad  | 72198 - Magnetic resonance angiography, pelvis, with contrast material(s)
23|RadOrderPad  | Modality: MRI
23|RadOrderPad  | Body Part: Pelvis
23|RadOrderPad  | -- Relevant ICD-10 to CPT Mappings --
23|RadOrderPad  | ICD-10: R07.8 (Other chest pain) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.1.
23|RadOrderPad  | Justification: ECG (93000)
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 7:  is maximally appropriate (9/9) for chest pain (R07.8) evaluation, serving as the essential first-line diagnostic test. Most valuable for acute-onset chest pain, especially with exertional features or cardiovascular risk factors. Advantages include immediate availability, zero radiation, and high specificity (85-95%), though sensitivity for early MI is moderate (54-69%). Serial ECGs significantly improve diagnostic accuracy.
23|RadOrderPad  | ICD-10: R07.8 (Other chest pain) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368-e454, Se
23|RadOrderPad  | PROMPT CHUNK 7:  is maximally appropriate (9/9) for chest pain (R07.8) evaluation, serving as the essential first-line diagnostic test. Most valuable for acute-onset chest pain, especially with exertional features or cardiovascular risk factors. Advantages include immediate availability, zero radiation, and high specificity (85-95%), though sensitivity for early MI is moderate (54-69%). Serial ECGs significantly improve diagnostic accuracy.
23|RadOrderPad  | ICD-10: R07.8 (Other chest pain) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368-e454, Se
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 8: ction 4.1.2
23|RadOrderPad  | Justification: MPI SPECT is usually appropriate (7/9) for evaluating non-specific chest pain (R07.8) in patients with intermediate CAD risk, particularly with uninterpretable ECG, inability to exercise, or post-revascularization symptoms. Key advantages include high sensitivity for multi-vessel disease, though radiation exposure (9.3-13.5 mSv) remains a limitation compared to stress echocardiography.
23|RadOrderPad  | ICD-10: R07.4 (Chest pain, unspecified) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368-e454, Section
23|RadOrderPad  | PROMPT CHUNK 8: ction 4.1.2
23|RadOrderPad  | Justification: MPI SPECT is usually appropriate (7/9) for evaluating non-specific chest pain (R07.8) in patients with intermediate CAD risk, particularly with uninterpretable ECG, inability to exercise, or post-revascularization symptoms. Key advantages include high sensitivity for multi-vessel disease, though radiation exposure (9.3-13.5 mSv) remains a limitation compared to stress echocardiography.
23|RadOrderPad  | ICD-10: R07.4 (Chest pain, unspecified) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368-e454, Section
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 9: 4.1.2
23|RadOrderPad  | Justification: MPI SPECT is usually appropriate (7/9) for unspecified chest pain, particularly in intermediate-risk patients (10-20% pre-test probability) with non-diagnostic ECGs or exercise limitations. Its high sensitivity (87-89%) for detecting CAD outweighs radiation exposure concerns (9.3-12.8 mSv), especially when echocardiography is limited by body habitus or poor acoustic windows.
23|RadOrderPad  | ICD-10: R07.4 (Chest pain, unspecified) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, during rest and cardiovascular stress test using treadmill, bicycle exercise and/or pharmacologically induced stress, with interpretation and report; including performance of continuous electrocardiographic monitoring, with supervision by a physician or other qualified health care professional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and
23|RadOrderPad  | PROMPT CHUNK 9: 4.1.2
23|RadOrderPad  | Justification: MPI SPECT is usually appropriate (7/9) for unspecified chest pain, particularly in intermediate-risk patients (10-20% pre-test probability) with non-diagnostic ECGs or exercise limitations. Its high sensitivity (87-89%) for detecting CAD outweighs radiation exposure concerns (9.3-12.8 mSv), especially when echocardiography is limited by body habitus or poor acoustic windows.
23|RadOrderPad  | ICD-10: R07.4 (Chest pain, unspecified) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, during rest and cardiovascular stress test using treadmill, bicycle exercise and/or pharmacologically induced stress, with interpretation and report; including performance of continuous electrocardiographic monitoring, with supervision by a physician or other qualified health care professional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 10: Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for unspecified chest pain, particularly for patients with intermediate CAD risk (10-90%), exertional symptoms, and normal/equivocal resting ECG. Key advantages include absence of radiation, good diagnostic accuracy (sensitivity 76-86%, specificity 82-91%), and ability to assess both ischemia and structural abnormalities simultaneously. Most valuable when performed within 72 hours of presentation in patients with HEART scores 4-6.
23|RadOrderPad  | ICD-10: R07.9 (Chest pain, unspecified) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Eviden
23|RadOrderPad  | PROMPT CHUNK 10: Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for unspecified chest pain, particularly for patients with intermediate CAD risk (10-90%), exertional symptoms, and normal/equivocal resting ECG. Key advantages include absence of radiation, good diagnostic accuracy (sensitivity 76-86%, specificity 82-91%), and ability to assess both ischemia and structural abnormalities simultaneously. Most valuable when performed within 72 hours of presentation in patients with HEART scores 4-6.
23|RadOrderPad  | ICD-10: R07.9 (Chest pain, unspecified) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Eviden
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 11: ce Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: MPI is appropriately rated 7/9 for unspecified chest pain, particularly valuable for intermediate-risk patients with non-diagnostic ECGs or inability to exercise. It offers superior sensitivity (87-89%) compared to stress ECG but involves moderate radiation exposure (9-12 mSv). Most beneficial when performed within 72 hours of presentation after initial troponin assessment.
23|RadOrderPad  | ICD-10: R07.3 (Other chest pain) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M
23|RadOrderPad  | PROMPT CHUNK 11: ce Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: MPI is appropriately rated 7/9 for unspecified chest pain, particularly valuable for intermediate-risk patients with non-diagnostic ECGs or inability to exercise. It offers superior sensitivity (87-89%) compared to stress ECG but involves moderate radiation exposure (9-12 mSv). Most beneficial when performed within 72 hours of presentation after initial troponin assessment.
23|RadOrderPad  | ICD-10: R07.3 (Other chest pain) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 12: , et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.2.
23|RadOrderPad  | Justification: MPI SPECT is usually appropriate (7/9) for chest pain evaluation in patients with intermediate pre-test probability of CAD (10-90%), abnormal resting ECG, or inability to exercise adequately. Its high sensitivity (87-89%) for detecting ischemia outweighs radiation concerns (9.3-16.3 mSv) when functional assessment is needed, though CCTA may be preferred in younger patients with normal ECGs.
23|RadOrderPad  | ICD-10: R07.5 (Precordial pain) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M,
23|RadOrderPad  | PROMPT CHUNK 12: , et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.2.
23|RadOrderPad  | Justification: MPI SPECT is usually appropriate (7/9) for chest pain evaluation in patients with intermediate pre-test probability of CAD (10-90%), abnormal resting ECG, or inability to exercise adequately. Its high sensitivity (87-89%) for detecting ischemia outweighs radiation concerns (9.3-16.3 mSv) when functional assessment is needed, though CCTA may be preferred in younger patients with normal ECGs.
23|RadOrderPad  | ICD-10: R07.5 (Precordial pain) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and/or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M,
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 13: et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: MPI is usually appropriate (7/9) for unspecified chest pain with intermediate pretest probability of CAD. Most valuable for exertional chest pain with cardiovascular risk factors, abnormal baseline ECG, or limited exercise capacity. Key advantages include high sensitivity (87%) for detecting CAD, though radiation exposure (9-12 mSv) is a limitation compared to stress echocardiography.
23|RadOrderPad  | ICD-10: R07.8 (Other chest pain) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, during rest and cardiovascular stress test using treadmill, bicycle exercise and/or pharmacologically induced stress, with interpretation and report; including performance of continuous electrocardiographic monitoring, with supervision by a physician or other qualified health care p
23|RadOrderPad  | PROMPT CHUNK 13: et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: MPI is usually appropriate (7/9) for unspecified chest pain with intermediate pretest probability of CAD. Most valuable for exertional chest pain with cardiovascular risk factors, abnormal baseline ECG, or limited exercise capacity. Key advantages include high sensitivity (87%) for detecting CAD, though radiation exposure (9-12 mSv) is a limitation compared to stress echocardiography.
23|RadOrderPad  | ICD-10: R07.8 (Other chest pain) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, during rest and cardiovascular stress test using treadmill, bicycle exercise and/or pharmacologically induced stress, with interpretation and report; including performance of continuous electrocardiographic monitoring, with supervision by a physician or other qualified health care p
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 14: rofessional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for evaluating chest pain (R07.8), particularly in intermediate-risk patients without known CAD. It offers excellent diagnostic accuracy (sensitivity 76-88%, specificity 77-91%) without radiation exposure, making it superior to exercise ECG and comparable to nuclear imaging. Most valuable when acoustic windows are adequate and patients can exercise appropriately.
23|RadOrderPad  | ICD-10: R07.6 (Pleuritic pain) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, during rest and cardiovascular stress test using treadmill, bicycle exercise and/or pharmacologically induced stress, with interpretation and report; including performance of continuo
23|RadOrderPad  | PROMPT CHUNK 14: rofessional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for evaluating chest pain (R07.8), particularly in intermediate-risk patients without known CAD. It offers excellent diagnostic accuracy (sensitivity 76-88%, specificity 77-91%) without radiation exposure, making it superior to exercise ECG and comparable to nuclear imaging. Most valuable when acoustic windows are adequate and patients can exercise appropriately.
23|RadOrderPad  | ICD-10: R07.6 (Pleuritic pain) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, during rest and cardiovascular stress test using treadmill, bicycle exercise and/or pharmacologically induced stress, with interpretation and report; including performance of continuo
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 15: us electrocardiographic monitoring, with supervision by a physician or other qualified health care professional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for unspecified chest pain, particularly in intermediate-risk patients, those with uninterpretable ECGs, and women with atypical symptoms. Key advantages include absence of radiation, excellent specificity (77-91%), and ability to assess both ischemia and structural abnormalities. Most valuable when performed within 72 hours of presentation in patients capable of adequate exercise.
23|RadOrderPad  | ICD-10: R07.5 (Precordial pain) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, during rest and cardiovascular stress test using treadmill, bic
23|RadOrderPad  | PROMPT CHUNK 15: us electrocardiographic monitoring, with supervision by a physician or other qualified health care professional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for unspecified chest pain, particularly in intermediate-risk patients, those with uninterpretable ECGs, and women with atypical symptoms. Key advantages include absence of radiation, excellent specificity (77-91%), and ability to assess both ischemia and structural abnormalities. Most valuable when performed within 72 hours of presentation in patients capable of adequate exercise.
23|RadOrderPad  | ICD-10: R07.5 (Precordial pain) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, during rest and cardiovascular stress test using treadmill, bic
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 16: ycle exercise and/or pharmacologically induced stress, with interpretation and report; including performance of continuous electrocardiographic monitoring, with supervision by a physician or other qualified health care professional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for unspecified chest pain, particularly in patients with intermediate pre-test CAD probability (10-90%), multiple cardiovascular risk factors, or non-diagnostic ECG findings. Key advantages include absence of radiation, good diagnostic accuracy (sensitivity 76-86%, specificity 82-89%), and ability to assess both ischemia and structural abnormalities simultaneously.
23|RadOrderPad  | ICD-10: R07.4 (Chest pain, unspecified) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpre
23|RadOrderPad  | PROMPT CHUNK 16: ycle exercise and/or pharmacologically induced stress, with interpretation and report; including performance of continuous electrocardiographic monitoring, with supervision by a physician or other qualified health care professional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.2
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for unspecified chest pain, particularly in patients with intermediate pre-test CAD probability (10-90%), multiple cardiovascular risk factors, or non-diagnostic ECG findings. Key advantages include absence of radiation, good diagnostic accuracy (sensitivity 76-86%, specificity 82-89%), and ability to assess both ischemia and structural abnormalities simultaneously.
23|RadOrderPad  | ICD-10: R07.4 (Chest pain, unspecified) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpre
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 17: tation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.1.
23|RadOrderPad  | Justification: ECG for unspecified chest pain is maximally appropriate (9/9) as the essential initial diagnostic test, providing immediate, radiation-free assessment for potentially life-threatening cardiac conditions. Most valuable for acute-onset pain, exertional symptoms, or when accompanied by dyspnea. Should be obtained within 10 minutes of presentation, particularly in patients >40 years or with cardiovascular risk factors.
23|RadOrderPad  | ICD-10: R07.6 (Pleuritic pain) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and
23|RadOrderPad  | PROMPT CHUNK 17: tation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.1.
23|RadOrderPad  | Justification: ECG for unspecified chest pain is maximally appropriate (9/9) as the essential initial diagnostic test, providing immediate, radiation-free assessment for potentially life-threatening cardiac conditions. Most valuable for acute-onset pain, exertional symptoms, or when accompanied by dyspnea. Should be obtained within 10 minutes of presentation, particularly in patients >40 years or with cardiovascular risk factors.
23|RadOrderPad  | ICD-10: R07.6 (Pleuritic pain) -> CPT: 78452 (Myocardial perfusion imaging, tomographic (SPECT) (including attenuation correction, qualitative or quantitative wall motion, ejection fraction by first pass or gated technique, additional quantification, when performed); multiple studies, at rest and/or stress (exercise or pharmacologic) and
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 18: /or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: 2023 ACC/AHA/ASE/ASNC Guideline for Evaluation and Diagnosis of Chest Pain, J Am Coll Cardiol. 2023;81:e21-e129, Section 4.1.2
23|RadOrderPad  | Justification: MPI is usually appropriate (7/9) for unspecified chest pain, particularly in patients with intermediate CAD probability, abnormal resting ECGs, or inability to exercise adequately. Its high sensitivity (87-89%) for detecting coronary stenosis makes it valuable for risk stratification, though radiation exposure (9-12 mSv) is a limitation compared to stress echocardiography.
23|RadOrderPad  | ICD-10: I25.110 (Atherosclerotic heart disease of native coronary artery with unstable angina pectoris) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, during rest and cardiovascular stress test using treadmill, bicycle exercise and/or pharmacologically induced stress, with interpretation and report; including
23|RadOrderPad  | PROMPT CHUNK 18: /or redistribution and/or rest reinject)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: 2023 ACC/AHA/ASE/ASNC Guideline for Evaluation and Diagnosis of Chest Pain, J Am Coll Cardiol. 2023;81:e21-e129, Section 4.1.2
23|RadOrderPad  | Justification: MPI is usually appropriate (7/9) for unspecified chest pain, particularly in patients with intermediate CAD probability, abnormal resting ECGs, or inability to exercise adequately. Its high sensitivity (87-89%) for detecting coronary stenosis makes it valuable for risk stratification, though radiation exposure (9-12 mSv) is a limitation compared to stress echocardiography.
23|RadOrderPad  | ICD-10: I25.110 (Atherosclerotic heart disease of native coronary artery with unstable angina pectoris) -> CPT: 93351 (Echocardiography, transthoracic, real-time with image documentation (2D), includes M-mode recording, when performed, during rest and cardiovascular stress test using treadmill, bicycle exercise and/or pharmacologically induced stress, with interpretation and report; including
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 19: performance of continuous electrocardiographic monitoring, with supervision by a physician or other qualified health care professional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: 2022 AHA/ACC/SCAI Guideline for the Management of Patients With Unstable Angina and Non - ST-Segment Elevation Myocardial Infarction. J Am Coll Cardiol. 2022;80(18):e299-e379, Section 4.1.1
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for unstable angina after initial stabilization (>24-48 hours), offering excellent diagnostic accuracy (sensitivity 80-85%, specificity 84-86%) without radiation exposure. Most valuable for risk stratification in intermediate-risk patients with TIMI scores 3-4. Contraindicated during active chest pain or hemodynamic instability, which explains why the rating is not higher (9/9).
23|RadOrderPad  | ICD-10: R07.9 (Chest pain, unspecified) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence S
23|RadOrderPad  | PROMPT CHUNK 19: performance of continuous electrocardiographic monitoring, with supervision by a physician or other qualified health care professional)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: 2022 AHA/ACC/SCAI Guideline for the Management of Patients With Unstable Angina and Non - ST-Segment Elevation Myocardial Infarction. J Am Coll Cardiol. 2022;80(18):e299-e379, Section 4.1.1
23|RadOrderPad  | Justification: Stress echocardiography is usually appropriate (7/9) for unstable angina after initial stabilization (>24-48 hours), offering excellent diagnostic accuracy (sensitivity 80-85%, specificity 84-86%) without radiation exposure. Most valuable for risk stratification in intermediate-risk patients with TIMI scores 3-4. Contraindicated during active chest pain or hemodynamic instability, which explains why the rating is not higher (9/9).
23|RadOrderPad  | ICD-10: R07.9 (Chest pain, unspecified) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence S
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 20: ource: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.1
23|RadOrderPad  | Justification: ECG is highly appropriate (9/9) for unspecified chest pain, serving as the essential initial diagnostic test due to its immediate availability, zero radiation, and ability to detect acute cardiac pathology. Most valuable for acute-onset pain, exertional symptoms, or pain with associated symptoms. Should be performed within 10 minutes of presentation, with serial ECGs improving diagnostic yield.
23|RadOrderPad  | ICD-10: R07.9 (Chest pain, unspecified) -> CPT: 75571 (Computed tomography, heart, without contrast material, with quantitative evaluation of coronary calcium)
23|RadOrderPad  | Appropriateness Score: 8/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368-e454, recommendation 4.1.2.
23|RadOrderPad  | Justification: CAC scoring is highly appropriate
23|RadOrderPad  | PROMPT CHUNK 20: ource: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454, Section 4.1.1
23|RadOrderPad  | Justification: ECG is highly appropriate (9/9) for unspecified chest pain, serving as the essential initial diagnostic test due to its immediate availability, zero radiation, and ability to detect acute cardiac pathology. Most valuable for acute-onset pain, exertional symptoms, or pain with associated symptoms. Should be performed within 10 minutes of presentation, with serial ECGs improving diagnostic yield.
23|RadOrderPad  | ICD-10: R07.9 (Chest pain, unspecified) -> CPT: 75571 (Computed tomography, heart, without contrast material, with quantitative evaluation of coronary calcium)
23|RadOrderPad  | Appropriateness Score: 8/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368-e454, recommendation 4.1.2.
23|RadOrderPad  | Justification: CAC scoring is highly appropriate
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 21: (8/9) for unspecified chest pain in intermediate-risk patients (10-20% ASCVD risk) without known CAD. Most valuable for risk stratification when traditional risk assessment is inconclusive. Advantages include low radiation (1-2 mSv) and excellent negative predictive value, though it cannot assess stenosis or plaque composition.
23|RadOrderPad  | ICD-10: R07.5 (Precordial pain) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.1.
23|RadOrderPad  | Justification: ECG is maximally appropriate (9/9) for unspecified chest pain as the essential initial diagnostic test, ideally performed within 10 minutes of presentation. Most valuable for acute-onset pain, especially with radiation or exertional features. Advantages include immediate availability and zero radiation, though l
23|RadOrderPad  | PROMPT CHUNK 21: (8/9) for unspecified chest pain in intermediate-risk patients (10-20% ASCVD risk) without known CAD. Most valuable for risk stratification when traditional risk assessment is inconclusive. Advantages include low radiation (1-2 mSv) and excellent negative predictive value, though it cannot assess stenosis or plaque composition.
23|RadOrderPad  | ICD-10: R07.5 (Precordial pain) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.1.
23|RadOrderPad  | Justification: ECG is maximally appropriate (9/9) for unspecified chest pain as the essential initial diagnostic test, ideally performed within 10 minutes of presentation. Most valuable for acute-onset pain, especially with radiation or exertional features. Advantages include immediate availability and zero radiation, though l
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 22: imited sensitivity (45-60%) necessitates serial ECGs and additional testing in high-risk patients.
23|RadOrderPad  | ICD-10: I25.10 (Atherosclerotic heart disease of native coronary artery without angina pectoris) -> CPT: 75571 (Computed tomography, heart, without contrast material, with quantitative evaluation of coronary calcium)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Hecht H, et al. 2023 ACC/AHA Guideline for Evaluation and Diagnosis of Chest Pain. J Am Coll Cardiol. 2023;82(22):e63-e179.
23|RadOrderPad  | Justification: CAC scoring for established CAD without angina is moderately appropriate (7/9) primarily for monitoring disease progression. While providing prognostic information with minimal radiation (1.0-1.5 mSv), it cannot assess stenosis severity or non-calcified plaque. For known CAD, functional testing or CCTA typically offers more actionable clinical information despite the higher radiation exposure.
23|RadOrderPad  | ICD-10: R93.5 (Abnormal findings on diagnostic imaging of other abdominal regions, including retroperi
23|RadOrderPad  | PROMPT CHUNK 22: imited sensitivity (45-60%) necessitates serial ECGs and additional testing in high-risk patients.
23|RadOrderPad  | ICD-10: I25.10 (Atherosclerotic heart disease of native coronary artery without angina pectoris) -> CPT: 75571 (Computed tomography, heart, without contrast material, with quantitative evaluation of coronary calcium)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: Hecht H, et al. 2023 ACC/AHA Guideline for Evaluation and Diagnosis of Chest Pain. J Am Coll Cardiol. 2023;82(22):e63-e179.
23|RadOrderPad  | Justification: CAC scoring for established CAD without angina is moderately appropriate (7/9) primarily for monitoring disease progression. While providing prognostic information with minimal radiation (1.0-1.5 mSv), it cannot assess stenosis severity or non-calcified plaque. For known CAD, functional testing or CCTA typically offers more actionable clinical information despite the higher radiation exposure.
23|RadOrderPad  | ICD-10: R93.5 (Abnormal findings on diagnostic imaging of other abdominal regions, including retroperi
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 23: toneum) -> CPT: 74181 (MRI, Abdomen, without contrast)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: ACR Appropriateness Criteria(R) Jaundice, 2023, p.5-7
23|RadOrderPad  | Justification: MRCP is usually appropriate (7/9) for evaluating abnormal abdominal imaging findings (R93.5), particularly when biliary or pancreatic duct abnormalities are suspected. It provides excellent non-invasive visualization of the biliary and pancreatic ductal systems without radiation or procedural risks, making it superior to ERCP for initial diagnostic evaluation when intervention is not immediately required.
23|RadOrderPad  | ICD-10: R07.6 (Pleuritic pain) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.1.
23|RadOrderPad  | Justification: ECG is maximally appropriate (9/9) for unspecified chest pain as th
23|RadOrderPad  | PROMPT CHUNK 23: toneum) -> CPT: 74181 (MRI, Abdomen, without contrast)
23|RadOrderPad  | Appropriateness Score: 7/9
23|RadOrderPad  | Evidence Source: ACR Appropriateness Criteria(R) Jaundice, 2023, p.5-7
23|RadOrderPad  | Justification: MRCP is usually appropriate (7/9) for evaluating abnormal abdominal imaging findings (R93.5), particularly when biliary or pancreatic duct abnormalities are suspected. It provides excellent non-invasive visualization of the biliary and pancreatic ductal systems without radiation or procedural risks, making it superior to ERCP for initial diagnostic evaluation when intervention is not immediately required.
23|RadOrderPad  | ICD-10: R07.6 (Pleuritic pain) -> CPT: 93000 (Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report)
23|RadOrderPad  | Appropriateness Score: 9/9
23|RadOrderPad  | Evidence Source: Gulati M, et al. 2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. 2021;144:e368 - e454. Section 4.1.1.
23|RadOrderPad  | Justification: ECG is maximally appropriate (9/9) for unspecified chest pain as th
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 24: e essential initial diagnostic test, providing immediate, radiation-free assessment of cardiac electrical activity. Most valuable for acute-onset pain, exertional symptoms, or pain with associated features suggesting cardiac origin. Should be performed within 10 minutes of presentation, with serial ECGs increasing diagnostic yield for evolving cardiac events.
23|RadOrderPad  | ICD-10: D64.1 (Secondary sideroblastic anemia due to disease) -> CPT: 74181 (MRI, Abdomen, without contrast)
23|RadOrderPad  | Appropriateness Score: 8/9
23|RadOrderPad  | Evidence Source: ACR Appropriateness Criteria(R) Chronic Liver Disease, 2024, p.8-9
23|RadOrderPad  | Justification: Abdominal MRI without contrast is highly appropriate (8/9) for secondary sideroblastic anemia due to its superior accuracy in quantifying hepatic iron concentration using T2* sequences. Most valuable for patients with elevated ferritin (>1000 ng/mL), multiple transfusions, or monitoring chelation therapy. Key advantage: non-invasive alternative to liver biopsy with zero radiation exposure.
23|RadOrderPad  | -- Addit
23|RadOrderPad  | PROMPT CHUNK 24: e essential initial diagnostic test, providing immediate, radiation-free assessment of cardiac electrical activity. Most valuable for acute-onset pain, exertional symptoms, or pain with associated features suggesting cardiac origin. Should be performed within 10 minutes of presentation, with serial ECGs increasing diagnostic yield for evolving cardiac events.
23|RadOrderPad  | ICD-10: D64.1 (Secondary sideroblastic anemia due to disease) -> CPT: 74181 (MRI, Abdomen, without contrast)
23|RadOrderPad  | Appropriateness Score: 8/9
23|RadOrderPad  | Evidence Source: ACR Appropriateness Criteria(R) Chronic Liver Disease, 2024, p.8-9
23|RadOrderPad  | Justification: Abdominal MRI without contrast is highly appropriate (8/9) for secondary sideroblastic anemia due to its superior accuracy in quantifying hepatic iron concentration using T2* sequences. Most valuable for patients with elevated ferritin (>1000 ng/mL), multiple transfusions, or monitoring chelation therapy. Key advantage: non-invasive alternative to liver biopsy with zero radiation exposure.
23|RadOrderPad  | -- Addit
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 25: ional Clinical Information --
23|RadOrderPad  | ICD-10: I70.1 (Atherosclerosis of renal artery)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I70.1......
23|RadOrderPad  | ICD-10: I70.0 (Atherosclerosis of aorta)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I70.0......
23|RadOrderPad  | ICD-10: I71.0 (Dissection of aorta)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I71.0......
23|RadOrderPad  | ICD-10: I25.110 (Atherosclerotic heart disease of native coronary artery with unstable angina pectoris)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I25.110......
23|RadOrderPad  | ICD-10: R07.4 (Chest pain, unspecified)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07.4......
23|RadOrderPad  | ICD-10: R07 (Pain in throat and chest)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07......
23|RadOrderPad  | ICD-10: R07.1 (Chest pain on breathing)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07.1......
23|RadOrderPad  | ICD-10: R07.8 (Other chest pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07.8......
23|RadOrderPad  | ICD-10: R07.9 (Chest pain, unspecified)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07.
23|RadOrderPad  | PROMPT CHUNK 25: ional Clinical Information --
23|RadOrderPad  | ICD-10: I70.1 (Atherosclerosis of renal artery)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I70.1......
23|RadOrderPad  | ICD-10: I70.0 (Atherosclerosis of aorta)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I70.0......
23|RadOrderPad  | ICD-10: I71.0 (Dissection of aorta)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I71.0......
23|RadOrderPad  | ICD-10: I25.110 (Atherosclerotic heart disease of native coronary artery with unstable angina pectoris)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I25.110......
23|RadOrderPad  | ICD-10: R07.4 (Chest pain, unspecified)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07.4......
23|RadOrderPad  | ICD-10: R07 (Pain in throat and chest)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07......
23|RadOrderPad  | ICD-10: R07.1 (Chest pain on breathing)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07.1......
23|RadOrderPad  | ICD-10: R07.8 (Other chest pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07.8......
23|RadOrderPad  | ICD-10: R07.9 (Chest pain, unspecified)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07.
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 26: 9......
23|RadOrderPad  | ICD-10: R07.3 (Other chest pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07.3......
23|RadOrderPad  | ICD-10: R10.17 (Generalized abdominal pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.17......
23|RadOrderPad  | ICD-10: R10.5 (Abdominal tenderness)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.5......
23|RadOrderPad  | ICD-10: R10.36 (Acute abdominal pain in epigastrium)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.36......
23|RadOrderPad  | ICD-10: R10.9 (Unspecified abdominal pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.9......
23|RadOrderPad  | ICD-10: R10.38 (Acute abdominal pain in other specified location)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.38......
23|RadOrderPad  | ICD-10: I71.3 (Abdominal aortic aneurysm, ruptured)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I71.3......
23|RadOrderPad  | ICD-10: R10 (Abdominal and pelvic pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10......
23|RadOrderPad  | ICD-10: R10.8 (Other abdominal pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.8......
23|RadOrderPad  | ICD-10: R10.84 (Generalized
23|RadOrderPad  | PROMPT CHUNK 26: 9......
23|RadOrderPad  | ICD-10: R07.3 (Other chest pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R07.3......
23|RadOrderPad  | ICD-10: R10.17 (Generalized abdominal pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.17......
23|RadOrderPad  | ICD-10: R10.5 (Abdominal tenderness)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.5......
23|RadOrderPad  | ICD-10: R10.36 (Acute abdominal pain in epigastrium)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.36......
23|RadOrderPad  | ICD-10: R10.9 (Unspecified abdominal pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.9......
23|RadOrderPad  | ICD-10: R10.38 (Acute abdominal pain in other specified location)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.38......
23|RadOrderPad  | ICD-10: I71.3 (Abdominal aortic aneurysm, ruptured)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code I71.3......
23|RadOrderPad  | ICD-10: R10 (Abdominal and pelvic pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10......
23|RadOrderPad  | ICD-10: R10.8 (Other abdominal pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.8......
23|RadOrderPad  | ICD-10: R10.84 (Generalized
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 27:  abdominal pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.84......
23|RadOrderPad  | ICD-10: R19.31 (Right upper quadrant abdominal rigidity)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R19.31......
23|RadOrderPad  |
23|RadOrderPad  |
23|RadOrderPad  | IMPORTANT GUIDELINES:
23|RadOrderPad  | - Validate based on ACR Appropriateness Criteria and evidence-based guidelines
23|RadOrderPad  | - For inappropriate orders, suggest alternative approaches
23|RadOrderPad  | - You MUST designate exactly one ICD-10 code as primary (isPrimary: true)
23|RadOrderPad  |
23|RadOrderPad  | IMPORTANT CODING RULES:
23|RadOrderPad  | - Do NOT assign ICD-10 codes for conditions described as 'probable', 'suspected', 'questionable', 'rule out', or similar terms indicating uncertainty.
23|RadOrderPad  | - Instead, code the condition(s) to the highest degree of certainty for that encounter/visit, such as symptoms, signs, abnormal test results, or other reasons for the visit.
23|RadOrderPad  |
23|RadOrderPad  |
23|RadOrderPad  | Please analyze this radiology order dictation:
23|RadOrderPad  |
23|RadOrderPad  | "  "dictationText": "78-year-old male with history of coronary artery disease s/p CABG, hypertension, hyperlipidemia, type 2 diabetes, and 60-pack-yea
23|RadOrderPad  | PROMPT CHUNK 27:  abdominal pain)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R10.84......
23|RadOrderPad  | ICD-10: R19.31 (Right upper quadrant abdominal rigidity)
23|RadOrderPad  | # Medical Imaging Recommendation for ICD-10 Code R19.31......
23|RadOrderPad  |
23|RadOrderPad  |
23|RadOrderPad  | IMPORTANT GUIDELINES:
23|RadOrderPad  | - Validate based on ACR Appropriateness Criteria and evidence-based guidelines
23|RadOrderPad  | - For inappropriate orders, suggest alternative approaches
23|RadOrderPad  | - You MUST designate exactly one ICD-10 code as primary (isPrimary: true)
23|RadOrderPad  |
23|RadOrderPad  | IMPORTANT CODING RULES:
23|RadOrderPad  | - Do NOT assign ICD-10 codes for conditions described as 'probable', 'suspected', 'questionable', 'rule out', or similar terms indicating uncertainty.
23|RadOrderPad  | - Instead, code the condition(s) to the highest degree of certainty for that encounter/visit, such as symptoms, signs, abnormal test results, or other reasons for the visit.
23|RadOrderPad  |
23|RadOrderPad  |
23|RadOrderPad  | Please analyze this radiology order dictation:
23|RadOrderPad  |
23|RadOrderPad  | "  "dictationText": "78-year-old male with history of coronary artery disease s/p CABG, hypertension, hyperlipidemia, type 2 diabetes, and 60-pack-yea
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: PROMPT CHUNK 28: r smoking history. Presents with bilateral lower extremity claudication, right worse than left, and non-healing ulcer on right great toe. Diminished pulses bilaterally. ABI right 0.6, left 0.7. Request bilateral lower extremity arterial doppler ultrasound, CT angiography of abdominal aorta and bilateral lower extremities with runoff, and chest X-ray for preoperative evaluation.",
23|RadOrderPad  | "
23|RadOrderPad  |
23|RadOrderPad  | Respond in JSON format with these fields:
23|RadOrderPad  | - suggestedICD10Codes: Array of {code, description, isPrimary} objects (one code must have isPrimary: true)
23|RadOrderPad  | - suggestedCPTCodes: Array of {code, description} objects
23|RadOrderPad  | - validationStatus: "appropriate", "needs_clarification", or "inappropriate"
23|RadOrderPad  | - complianceScore: Number 1-9
23|RadOrderPad  | - priority: "routine" or "stat"
23|RadOrderPad  | - feedback: Brief educational note (33 words target length)
23|RadOrderPad  | PROMPT CHUNK 28: r smoking history. Presents with bilateral lower extremity claudication, right worse than left, and non-healing ulcer on right great toe. Diminished pulses bilaterally. ABI right 0.6, left 0.7. Request bilateral lower extremity arterial doppler ultrasound, CT angiography of abdominal aorta and bilateral lower extremities with runoff, and chest X-ray for preoperative evaluation.",
23|RadOrderPad  | "
23|RadOrderPad  |
23|RadOrderPad  | Respond in JSON format with these fields:
23|RadOrderPad  | - suggestedICD10Codes: Array of {code, description, isPrimary} objects (one code must have isPrimary: true)
23|RadOrderPad  | - suggestedCPTCodes: Array of {code, description} objects
23|RadOrderPad  | - validationStatus: "appropriate", "needs_clarification", or "inappropriate"
23|RadOrderPad  | - complianceScore: Number 1-9
23|RadOrderPad  | - priority: "routine" or "stat"
23|RadOrderPad  | - feedback: Brief educational note (33 words target length)
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: !!! LOGGING ENABLED - END FINAL LLM PROMPT !!!
23|RadOrderPad  | !!! LOGGING ENABLED - END FINAL LLM PROMPT !!!
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Calling Anthropic Claude API...
23|RadOrderPad  | 2025-05-12 20:00:08:08 info: Using model: claude-3-7-sonnet-20250219
23|RadOrderPad  | 2025-05-12 20:00:14:014 info: LLM call completed using anthropic
23|RadOrderPad  | LLM call completed using anthropic
23|RadOrderPad  | 2025-05-12 20:00:14:014 info: Performance metrics - Tokens: 8437, Latency: 5658ms
23|RadOrderPad  | Performance metrics - Tokens: 8437, Latency: 5658ms
23|RadOrderPad  | Processing LLM response (content redacted for privacy)
23|RadOrderPad  | 2025-05-12 20:00:14:014 info: Response processing completed
23|RadOrderPad  | Response processing completed
23|RadOrderPad  | 2025-05-12 20:00:14:014 info: Test mode before validation logging: true
23|RadOrderPad  | Test mode before validation logging: true
23|RadOrderPad  | 2025-05-12 20:00:14:014 info: Test mode active: Database validation logging skipped (but context/prompt logging should still work)
23|RadOrderPad  | Test mode active: Database validation logging skipped (but context/prompt logging should still work)
