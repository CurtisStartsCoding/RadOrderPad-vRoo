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
} from './common';

// Re-export search functions
export { getMappings } from './mapping-search';
export { getMarkdownDocs } from './markdown-search';

// Re-export weighted search functions (now the primary search functions)
export {
  searchICD10CodesWithScores,
  searchCPTCodesWithScores,
  // Also export these as the standard search functions (replacing the fix versions)
  searchICD10CodesWithScores as searchICD10Codes,
  searchCPTCodesWithScores as searchCPTCodes
} from './weighted-search';

// Export the JSON-based ID lookup functions from the weighted search module
export {
  getICD10CodesByIds,
  getCPTCodesByIds
} from './json-data-access';

export {
  getMappingsWithScores,
  searchMappingsWithScores,
  MappingRowWithScore
} from './mapping-search-weighted';

export {
  getMarkdownDocsWithScores,
  searchMarkdownDocsWithScores,
  MarkdownRowWithScore
} from './markdown-search-weighted';