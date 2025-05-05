/**
 * Search Services
 * 
 * This module exports services for searching medical codes with
 * PostgreSQL weighted search and Redis caching.
 */

// Export diagnosis search service
export { 
  searchDiagnosisCodes,
  type ICD10SearchResult,
  type SearchOptions as DiagnosisSearchOptions
} from './diagnosis-search';

// Export procedure search service
export { 
  searchProcedureCodes,
  type CPTSearchResult,
  type SearchOptions as ProcedureSearchOptions
} from './procedure-search';