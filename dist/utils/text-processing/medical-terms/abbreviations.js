"use strict";
/**
 * Medical abbreviation terms for keyword extraction
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.abbreviationTerms = void 0;
exports.isAbbreviationTerm = isAbbreviationTerm;
/**
 * Common medical abbreviations
 */
exports.abbreviationTerms = [
    // Common medical abbreviations
    'ca', // cancer
    'dx', // diagnosis
    'fx', // fracture
    'hx', // history
    'px', // physical examination
    'rx', // prescription
    'sx', // symptoms
    'tx', // treatment
    // Radiological abbreviations
    'ap', // anteroposterior
    'pa', // posteroanterior
    'lat', // lateral
    'bilat', // bilateral
    // Common notation abbreviations
    'w/', // with
    'w/o', // without
    's/p', // status post
    'r/o', // rule out
    'c/o', // complains of
    'h/o', // history of
    'p/o' // post-operative
];
/**
 * Check if a term is a medical abbreviation
 * @param term - The term to check
 * @returns True if the term is a medical abbreviation
 */
function isAbbreviationTerm(term) {
    return exports.abbreviationTerms.includes(term.toLowerCase());
}
//# sourceMappingURL=abbreviations.js.map