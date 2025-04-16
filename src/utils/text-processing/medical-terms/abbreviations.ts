/**
 * Medical abbreviation terms for keyword extraction
 */

/**
 * Common medical abbreviations
 */
export const abbreviationTerms = [
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
export function isAbbreviationTerm(term: string): boolean {
  return abbreviationTerms.includes(term.toLowerCase());
}