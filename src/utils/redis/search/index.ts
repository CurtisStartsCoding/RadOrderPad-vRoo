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

// Re-export search functions
export { searchICD10Codes, getICD10CodesByIds } from './icd10-search.js';
export { searchCPTCodes, getCPTCodesByIds } from './cpt-search.js';
export { getMappings } from './mapping-search.js';
export { getMarkdownDocs } from './markdown-search.js';