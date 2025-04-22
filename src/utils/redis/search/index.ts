/**
 * Redis search module
 *
 * This module provides functions for searching medical codes and related data
 * using RedisSearch and RedisJSON in Redis Cloud.
 */

// Re-export types from common
export type {
  ICD10Row,
  CPTRow,
  MappingRow,
  MarkdownRow,
  CategorizedKeywords
} from './common.js';

// Re-export search functions - using fixed versions
export { searchICD10Codes, getICD10CodesByIds } from './icd10-search-fix.js';
export { searchCPTCodes, getCPTCodesByIds } from './cpt-search-fix.js';
export { getMappings } from './mapping-search.js';
export { getMarkdownDocs } from './markdown-search.js';

// Re-export weighted search functions
export {
  searchICD10CodesWithScores,
  searchCPTCodesWithScores
} from './weighted-search.js';

export {
  getMappingsWithScores,
  searchMappingsWithScores,
  MappingRowWithScore
} from './mapping-search-weighted.js';

export {
  getMarkdownDocsWithScores,
  searchMarkdownDocsWithScores,
  MarkdownRowWithScore
} from './markdown-search-weighted.js';