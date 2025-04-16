"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorizeKeywords = categorizeKeywords;
/**
 * Categorize keywords into different types for more targeted queries
 */
function categorizeKeywords(keywords) {
    // Common anatomical terms
    const anatomyTermsList = [
        'head', 'neck', 'shoulder', 'arm', 'elbow', 'wrist', 'hand', 'finger',
        'chest', 'thorax', 'abdomen', 'pelvis', 'hip', 'leg', 'knee', 'ankle', 'foot', 'toe',
        'brain', 'spine', 'cervical', 'thoracic', 'lumbar', 'sacral', 'skull',
        'liver', 'kidney', 'spleen', 'pancreas', 'gallbladder', 'bladder', 'uterus', 'ovary', 'prostate',
        'lung', 'heart', 'aorta', 'artery', 'vein'
    ];
    // Common modalities
    const modalitiesList = [
        'x-ray', 'xray', 'radiograph', 'ct', 'cat scan', 'computed tomography',
        'mri', 'magnetic resonance', 'ultrasound', 'sonogram', 'pet', 'nuclear',
        'angiogram', 'angiography', 'mammogram', 'mammography', 'dexa', 'bone density'
    ];
    // Categorize keywords
    const anatomyTerms = [];
    const modalities = [];
    const symptoms = [];
    const codes = [];
    keywords.forEach(keyword => {
        // Check if it's an ICD-10 or CPT code
        if (keyword.match(/^[A-Z]\d{2}(\.\d{1,2})?$/) || keyword.match(/^\d{5}$/)) {
            codes.push(keyword);
        }
        // Check if it's an anatomy term
        else if (anatomyTermsList.includes(keyword.toLowerCase())) {
            anatomyTerms.push(keyword);
        }
        // Check if it's a modality
        else if (modalitiesList.includes(keyword.toLowerCase())) {
            modalities.push(keyword);
        }
        // Otherwise, assume it's a symptom or condition
        else {
            symptoms.push(keyword);
        }
    });
    return {
        anatomyTerms,
        modalities,
        symptoms,
        codes
    };
}
//# sourceMappingURL=keyword-categorizer.js.map