"use strict";
/**
 * Anatomical terms for medical keyword extraction
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.anatomyTerms = void 0;
exports.isAnatomyTerm = isAnatomyTerm;
/**
 * Common anatomical terms organized by body region
 */
exports.anatomyTerms = [
    // Head and neck
    'head', 'neck', 'skull', 'brain', 'cerebral', 'cranial', 'facial', 'sinus', 'nasal', 'orbit',
    'eye', 'ocular', 'ear', 'temporal', 'jaw', 'mandible', 'maxilla', 'throat', 'pharynx', 'larynx',
    'thyroid', 'cervical',
    // Upper extremities
    'shoulder', 'arm', 'elbow', 'forearm', 'wrist', 'hand', 'finger', 'thumb', 'humerus', 'radius',
    'ulna', 'carpal', 'metacarpal', 'phalanges',
    // Torso
    'chest', 'thorax', 'thoracic', 'rib', 'sternum', 'clavicle', 'scapula', 'abdomen', 'abdominal',
    'pelvis', 'pelvic', 'hip', 'spine', 'vertebra', 'vertebral', 'lumbar', 'sacral', 'coccyx',
    // Lower extremities
    'leg', 'thigh', 'knee', 'patella', 'tibia', 'fibula', 'ankle', 'foot', 'toe', 'heel', 'femur',
    'tarsal', 'metatarsal',
    // Internal organs
    'liver', 'hepatic', 'kidney', 'renal', 'spleen', 'splenic', 'pancreas', 'pancreatic',
    'gallbladder', 'biliary', 'bladder', 'urinary', 'uterus', 'uterine', 'ovary', 'ovarian',
    'prostate', 'prostatic', 'testis', 'testicular', 'lung', 'pulmonary', 'heart', 'cardiac',
    'aorta', 'aortic', 'artery', 'arterial', 'vein', 'venous', 'intestine', 'intestinal',
    'colon', 'colonic', 'rectum', 'rectal', 'stomach', 'gastric', 'esophagus', 'esophageal'
];
/**
 * Check if a term is an anatomical term
 * @param term - The term to check
 * @returns True if the term is an anatomical term
 */
function isAnatomyTerm(term) {
    return exports.anatomyTerms.includes(term.toLowerCase());
}
//# sourceMappingURL=anatomy.js.map