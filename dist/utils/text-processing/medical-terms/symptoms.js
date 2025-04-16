"use strict";
/**
 * Symptom and condition terms for medical keyword extraction
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.symptomTerms = void 0;
exports.isSymptomTerm = isSymptomTerm;
/**
 * Common symptoms and conditions organized by category
 */
exports.symptomTerms = [
    // Pain and discomfort
    'pain', 'ache', 'discomfort', 'tenderness', 'burning', 'sharp', 'dull', 'chronic', 'acute',
    // Inflammation and swelling
    'swelling', 'inflammation', 'edema', 'effusion', 'enlarged', 'hypertrophy',
    // Trauma
    'fracture', 'break', 'sprain', 'strain', 'tear', 'rupture', 'dislocation', 'subluxation',
    'trauma', 'injury', 'wound', 'laceration',
    // Growths and masses
    'mass', 'tumor', 'cancer', 'malignancy', 'neoplasm', 'lesion', 'nodule', 'cyst', 'polyp',
    // Infections and inflammation
    'infection', 'abscess', 'cellulitis', 'osteomyelitis', 'septic',
    // Vascular issues
    'bleeding', 'hemorrhage', 'clot', 'thrombus', 'embolism', 'ischemia', 'infarct',
    'stenosis', 'blockage', 'obstruction', 'occlusion', 'aneurysm', 'dissection',
    // Stones and calcifications
    'stone', 'calculus', 'calcification', 'lithiasis',
    // Degenerative conditions
    'arthritis', 'osteoarthritis', 'degeneration', 'degenerative', 'herniation', 'herniated',
    'bulging', 'protrusion', 'spondylosis', 'spondylolisthesis', 'stenosis',
    // Other common conditions
    'pneumonia', 'bronchitis', 'copd', 'asthma', 'fibrosis', 'emphysema',
    'stroke', 'tia', 'seizure', 'epilepsy', 'dementia', 'alzheimer',
    'diabetes', 'hypertension', 'hyperlipidemia', 'atherosclerosis',
    'gastritis', 'gerd', 'ulcer', 'colitis', 'diverticulitis', 'appendicitis',
    'nephritis', 'pyelonephritis', 'renal failure', 'urolithiasis',
    'hepatitis', 'cirrhosis', 'cholecystitis', 'pancreatitis'
];
/**
 * Check if a term is a symptom or condition term
 * @param term - The term to check
 * @returns True if the term is a symptom or condition term
 */
function isSymptomTerm(term) {
    return exports.symptomTerms.includes(term.toLowerCase());
}
//# sourceMappingURL=symptoms.js.map