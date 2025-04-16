"use strict";
/**
 * Imaging modality terms for medical keyword extraction
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.modalityTerms = void 0;
exports.isModalityTerm = isModalityTerm;
/**
 * Common imaging modalities organized by type
 */
exports.modalityTerms = [
    // X-ray related
    'x-ray', 'xray', 'radiograph', 'radiography', 'plain film',
    // CT related
    'ct', 'cat scan', 'computed tomography', 'ct scan', 'ct angiogram', 'cta',
    // MRI related
    'mri', 'magnetic resonance', 'mr', 'fmri', 'mr angiogram', 'mra', 'mrcp',
    // Ultrasound related
    'ultrasound', 'sonogram', 'sonography', 'doppler', 'echocardiogram', 'echo',
    // Nuclear medicine
    'pet', 'pet scan', 'pet-ct', 'nuclear', 'nuclear medicine', 'spect', 'bone scan',
    // Angiography
    'angiogram', 'angiography', 'venogram', 'venography', 'arteriogram',
    // Other imaging
    'mammogram', 'mammography', 'dexa', 'bone density', 'fluoroscopy', 'myelogram',
    'discogram', 'arthrogram'
];
/**
 * Check if a term is an imaging modality term
 * @param term - The term to check
 * @returns True if the term is an imaging modality term
 */
function isModalityTerm(term) {
    return exports.modalityTerms.includes(term.toLowerCase());
}
//# sourceMappingURL=modalities.js.map