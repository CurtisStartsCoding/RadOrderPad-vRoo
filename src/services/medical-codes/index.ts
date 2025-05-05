/**
 * Medical Codes Services
 *
 * This module exports services for working with medical codes (CPT, ICD-10)
 * and their mappings with Redis caching and advanced Redis features.
 */

// Export CPT code service
export { 
  getCPTCode, 
  getCPTCodes,
  type CPTRow 
} from './cpt-service';

// Export ICD-10 code service
export { 
  getICD10Code, 
  getICD10Codes,
  type ICD10Row 
} from './icd10-service';

// Export mapping service
export { 
  getCptCodesForIcd10, 
  getSpecificMapping,
  type MappingRow 
} from './mapping-service';

// Export enhanced ICD-10 code service with RediSearch
export {
  searchICD10CodesFuzzy,
  getICD10CodesByKeywordFuzzy,
  getICD10CodesBySpecialtyFuzzy
} from './enhanced-icd10-service';

// Export enhanced mapping service with RedisJSON
export {
  getCptCodesForIcd10Enhanced,
  getSpecificMappingEnhanced
} from './enhanced-mapping-service';

// Export rare disease service with Vector Search
export {
  identifyRareDiseases,
  searchRareDiseasesBySymptoms,
  indexRareDiseases,
  type RareDiseaseRow
} from './rare-disease-service';