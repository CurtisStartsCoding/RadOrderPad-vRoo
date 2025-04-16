"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAbbreviationTerm = exports.isSymptomTerm = exports.isModalityTerm = exports.isAnatomyTerm = exports.abbreviationTerms = exports.symptomTerms = exports.modalityTerms = exports.anatomyTerms = void 0;
exports.getMedicalTermCategory = getMedicalTermCategory;
exports.isMedicalTerm = isMedicalTerm;
exports.getAllMedicalTerms = getAllMedicalTerms;
/**
 * Export all medical terms for keyword extraction
 */
const anatomy_1 = require("./anatomy");
Object.defineProperty(exports, "anatomyTerms", { enumerable: true, get: function () { return anatomy_1.anatomyTerms; } });
Object.defineProperty(exports, "isAnatomyTerm", { enumerable: true, get: function () { return anatomy_1.isAnatomyTerm; } });
const modalities_1 = require("./modalities");
Object.defineProperty(exports, "modalityTerms", { enumerable: true, get: function () { return modalities_1.modalityTerms; } });
Object.defineProperty(exports, "isModalityTerm", { enumerable: true, get: function () { return modalities_1.isModalityTerm; } });
const symptoms_1 = require("./symptoms");
Object.defineProperty(exports, "symptomTerms", { enumerable: true, get: function () { return symptoms_1.symptomTerms; } });
Object.defineProperty(exports, "isSymptomTerm", { enumerable: true, get: function () { return symptoms_1.isSymptomTerm; } });
const abbreviations_1 = require("./abbreviations");
Object.defineProperty(exports, "abbreviationTerms", { enumerable: true, get: function () { return abbreviations_1.abbreviationTerms; } });
Object.defineProperty(exports, "isAbbreviationTerm", { enumerable: true, get: function () { return abbreviations_1.isAbbreviationTerm; } });
const types_1 = require("../types");
/**
 * Get the category of a medical term
 * @param term - The term to categorize
 * @returns The category of the term, or undefined if not a medical term
 */
function getMedicalTermCategory(term) {
    if ((0, anatomy_1.isAnatomyTerm)(term)) {
        return types_1.MedicalKeywordCategory.ANATOMY;
    }
    if ((0, modalities_1.isModalityTerm)(term)) {
        return types_1.MedicalKeywordCategory.MODALITY;
    }
    if ((0, symptoms_1.isSymptomTerm)(term)) {
        return types_1.MedicalKeywordCategory.SYMPTOM;
    }
    if ((0, abbreviations_1.isAbbreviationTerm)(term)) {
        return types_1.MedicalKeywordCategory.ABBREVIATION;
    }
    return undefined;
}
/**
 * Check if a term is a medical term
 * @param term - The term to check
 * @returns True if the term is a medical term
 */
function isMedicalTerm(term) {
    return getMedicalTermCategory(term) !== undefined;
}
/**
 * Get all medical terms
 * @returns Array of all medical terms
 */
function getAllMedicalTerms() {
    return [
        ...anatomy_1.anatomyTerms,
        ...modalities_1.modalityTerms,
        ...symptoms_1.symptomTerms,
        ...abbreviations_1.abbreviationTerms
    ];
}
//# sourceMappingURL=index.js.map