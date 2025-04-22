/**
 * PostgreSQL Weighted Search Implementation
 * 
 * This module provides functions for searching medical codes using PostgreSQL
 * with weighted results based on relevance scores, similar to Redis weighted search.
 */

import { queryMainDb } from '../../config/db';
import { ICD10Row, CPTRow, MappingRow, MarkdownRow } from './types';
import logger from '../../utils/logger.js';

/**
 * Database row types for PostgreSQL query results
 */
interface PostgresICD10Row {
  icd10_code: string;
  description: string;
  clinical_notes: string | null;
  imaging_modalities: string | null;
  primary_imaging: string | null;
  score: string;
}

interface PostgresCPTRow {
  cpt_code: string;
  description: string;
  modality: string | null;
  body_part: string | null;
  score: string;
}

interface PostgresMappingRow {
  id: number;
  icd10_code: string;
  icd10_description: string;
  cpt_code: string;
  cpt_description: string;
  appropriateness: string;
  evidence_source: string | null;
  refined_justification: string | null;
  score: string;
}

interface PostgresMarkdownRow {
  id: number;
  icd10_code: string;
  icd10_description: string;
  content_preview: string;
  score: string;
}

// Define weights for different fields (similar to Redis weights)
const WEIGHTS = {
  // ICD-10 weights
  ICD10_DESCRIPTION: 5.0,
  ICD10_CLINICAL_NOTES: 3.0,
  ICD10_KEYWORDS: 2.0,
  
  // CPT weights
  CPT_DESCRIPTION: 5.0,
  CPT_BODY_PART: 3.0,
  CPT_MODALITY: 3.0,
  
  // Mapping weights
  MAPPING_ICD10_DESCRIPTION: 3.0,
  MAPPING_CPT_DESCRIPTION: 3.0,
  MAPPING_JUSTIFICATION: 5.0,
  MAPPING_EVIDENCE: 2.0,
  
  // Markdown weights
  MARKDOWN_ICD10_DESCRIPTION: 3.0,
  MARKDOWN_CONTENT: 5.0
};

/**
 * Extended ICD-10 Row interface with score
 */
export interface ICD10RowWithScore extends ICD10Row {
  score: number;
}

/**
 * Extended CPT Row interface with score
 */
export interface CPTRowWithScore extends CPTRow {
  score: number;
}

/**
 * Extended Mapping Row interface with score
 */
export interface MappingRowWithScore extends MappingRow {
  score: number;
}

/**
 * Extended Markdown Row interface with score
 */
export interface MarkdownRowWithScore extends MarkdownRow {
  score: number;
}

/**
 * Search for ICD-10 codes using PostgreSQL with weighted relevance
 * @param keywords Keywords to search for
 * @param limit Maximum number of results to return
 * @returns Array of ICD-10 codes with relevance scores
 */
export async function searchICD10CodesWithScores(
  keywords: string[],
  limit = 20
): Promise<ICD10RowWithScore[]> {
  try {
    // Build a query that calculates a relevance score for each result
    const query = `
      SELECT 
        icd10_code, 
        description, 
        clinical_notes, 
        imaging_modalities, 
        primary_imaging,
        (
          ${WEIGHTS.ICD10_DESCRIPTION} * (
            ${keywords.map((_, i) => `CASE WHEN description ILIKE $${i + 1} THEN 1 ELSE 0 END`).join(' + ')}
          ) +
          ${WEIGHTS.ICD10_CLINICAL_NOTES} * (
            ${keywords.map((_, i) => `CASE WHEN clinical_notes ILIKE $${i + 1} THEN 1 ELSE 0 END`).join(' + ')}
          ) +
          ${WEIGHTS.ICD10_KEYWORDS} * (
            ${keywords.map((_, i) => `CASE WHEN keywords ILIKE $${i + 1} THEN 1 ELSE 0 END`).join(' + ')}
          )
        ) AS score
      FROM 
        medical_icd10_codes
      WHERE 
        ${keywords.map((_, i) => 
          `description ILIKE $${i + 1} OR 
           clinical_notes ILIKE $${i + 1} OR 
           keywords ILIKE $${i + 1}`
        ).join(' OR ')}
      ORDER BY 
        score DESC
      LIMIT $${keywords.length + 1}
    `;
    
    const params = [...keywords.map(keyword => `%${keyword}%`), limit];
    const result = await queryMainDb(query, params);
    
    // Convert the results to ICD10RowWithScore objects
    const icd10Rows: ICD10RowWithScore[] = result.rows.map((row: PostgresICD10Row) => ({
      icd10_code: row.icd10_code,
      description: row.description,
      clinical_notes: row.clinical_notes,
      imaging_modalities: row.imaging_modalities,
      primary_imaging: row.primary_imaging,
      score: parseFloat(row.score)
    }));
    
    logger.info(`Found ${icd10Rows.length} relevant ICD-10 codes with PostgreSQL weighted search`);
    
    // Log the top results with scores for debugging
    if (icd10Rows.length > 0) {
      logger.debug('Top ICD-10 results with scores from PostgreSQL:');
      icd10Rows.slice(0, 3).forEach(row => {
        logger.debug(`${row.icd10_code}: ${row.description} (Score: ${row.score})`);
      });
    }
    
    return icd10Rows;
  } catch (error) {
    logger.error('Error searching ICD-10 codes with PostgreSQL weighted search:', error);
    return [];
  }
}

/**
 * Search for CPT codes using PostgreSQL with weighted relevance
 * @param keywords Keywords to search for
 * @param limit Maximum number of results to return
 * @returns Array of CPT codes with relevance scores
 */
export async function searchCPTCodesWithScores(
  keywords: string[],
  limit = 20
): Promise<CPTRowWithScore[]> {
  try {
    // Build a query that calculates a relevance score for each result
    const query = `
      SELECT 
        cpt_code, 
        description, 
        modality, 
        body_part,
        (
          ${WEIGHTS.CPT_DESCRIPTION} * (
            ${keywords.map((_, i) => `CASE WHEN description ILIKE $${i + 1} THEN 1 ELSE 0 END`).join(' + ')}
          ) +
          ${WEIGHTS.CPT_BODY_PART} * (
            ${keywords.map((_, i) => `CASE WHEN body_part ILIKE $${i + 1} THEN 1 ELSE 0 END`).join(' + ')}
          ) +
          ${WEIGHTS.CPT_MODALITY} * (
            ${keywords.map((_, i) => `CASE WHEN modality ILIKE $${i + 1} THEN 1 ELSE 0 END`).join(' + ')}
          )
        ) AS score
      FROM 
        medical_cpt_codes
      WHERE 
        ${keywords.map((_, i) => 
          `description ILIKE $${i + 1} OR 
           body_part ILIKE $${i + 1} OR 
           modality ILIKE $${i + 1}`
        ).join(' OR ')}
      ORDER BY 
        score DESC
      LIMIT $${keywords.length + 1}
    `;
    
    const params = [...keywords.map(keyword => `%${keyword}%`), limit];
    const result = await queryMainDb(query, params);
    
    // Convert the results to CPTRowWithScore objects
    const cptRows: CPTRowWithScore[] = result.rows.map((row: PostgresCPTRow) => ({
      cpt_code: row.cpt_code,
      description: row.description,
      modality: row.modality,
      body_part: row.body_part,
      score: parseFloat(row.score)
    }));
    
    logger.info(`Found ${cptRows.length} relevant CPT codes with PostgreSQL weighted search`);
    
    // Log the top results with scores for debugging
    if (cptRows.length > 0) {
      logger.debug('Top CPT results with scores from PostgreSQL:');
      cptRows.slice(0, 3).forEach(row => {
        logger.debug(`${row.cpt_code}: ${row.description} (Score: ${row.score})`);
      });
    }
    
    return cptRows;
  } catch (error) {
    logger.error('Error searching CPT codes with PostgreSQL weighted search:', error);
    return [];
  }
}

/**
 * Search for mappings using PostgreSQL with weighted relevance
 * @param keywords Keywords to search for
 * @param limit Maximum number of results to return
 * @returns Array of mappings with relevance scores
 */
export async function searchMappingsWithScores(
  keywords: string[],
  limit = 20
): Promise<MappingRowWithScore[]> {
  try {
    // Build a query that calculates a relevance score for each result
    const query = `
      SELECT 
        m.id, 
        m.icd10_code, 
        i.description as icd10_description, 
        m.cpt_code, 
        c.description as cpt_description, 
        m.appropriateness, 
        m.evidence_source, 
        m.refined_justification,
        (
          ${WEIGHTS.MAPPING_ICD10_DESCRIPTION} * (
            ${keywords.map((_, i) => `CASE WHEN i.description ILIKE $${i + 1} THEN 1 ELSE 0 END`).join(' + ')}
          ) +
          ${WEIGHTS.MAPPING_CPT_DESCRIPTION} * (
            ${keywords.map((_, i) => `CASE WHEN c.description ILIKE $${i + 1} THEN 1 ELSE 0 END`).join(' + ')}
          ) +
          ${WEIGHTS.MAPPING_JUSTIFICATION} * (
            ${keywords.map((_, i) => `CASE WHEN m.refined_justification ILIKE $${i + 1} THEN 1 ELSE 0 END`).join(' + ')}
          ) +
          ${WEIGHTS.MAPPING_EVIDENCE} * (
            ${keywords.map((_, i) => `CASE WHEN m.evidence_source ILIKE $${i + 1} THEN 1 ELSE 0 END`).join(' + ')}
          )
        ) AS score
      FROM 
        medical_cpt_icd10_mappings m
      JOIN 
        medical_icd10_codes i ON m.icd10_code = i.icd10_code
      JOIN 
        medical_cpt_codes c ON m.cpt_code = c.cpt_code
      WHERE 
        ${keywords.map((_, i) => 
          `i.description ILIKE $${i + 1} OR 
           c.description ILIKE $${i + 1} OR 
           c.body_part ILIKE $${i + 1} OR 
           c.modality ILIKE $${i + 1} OR
           m.refined_justification ILIKE $${i + 1} OR
           m.evidence_source ILIKE $${i + 1}`
        ).join(' OR ')}
      ORDER BY 
        score DESC
      LIMIT $${keywords.length + 1}
    `;
    
    const params = [...keywords.map(keyword => `%${keyword}%`), limit];
    const result = await queryMainDb(query, params);
    
    // Convert the results to MappingRowWithScore objects
    const mappingRows: MappingRowWithScore[] = result.rows.map((row: PostgresMappingRow) => ({
      id: row.id,
      icd10_code: row.icd10_code,
      icd10_description: row.icd10_description,
      cpt_code: row.cpt_code,
      cpt_description: row.cpt_description,
      appropriateness: row.appropriateness,
      evidence_source: row.evidence_source,
      refined_justification: row.refined_justification,
      score: parseFloat(row.score)
    }));
    
    logger.info(`Found ${mappingRows.length} relevant mappings with PostgreSQL weighted search`);
    
    // Log the top results with scores for debugging
    if (mappingRows.length > 0) {
      logger.debug('Top mapping results with scores from PostgreSQL:');
      mappingRows.slice(0, 3).forEach(row => {
        logger.debug(`${row.icd10_code} -> ${row.cpt_code} (Score: ${row.score})`);
      });
    }
    
    return mappingRows;
  } catch (error) {
    logger.error('Error searching mappings with PostgreSQL weighted search:', error);
    return [];
  }
}

/**
 * Search for markdown docs using PostgreSQL with weighted relevance
 * @param keywords Keywords to search for
 * @param limit Maximum number of results to return
 * @returns Array of markdown docs with relevance scores
 */
export async function searchMarkdownDocsWithScores(
  keywords: string[],
  limit = 5
): Promise<MarkdownRowWithScore[]> {
  try {
    // Build a query that calculates a relevance score for each result
    const query = `
      SELECT 
        md.id, 
        md.icd10_code, 
        i.description as icd10_description, 
        LEFT(md.content, 1000) as content_preview,
        (
          ${WEIGHTS.MARKDOWN_ICD10_DESCRIPTION} * (
            ${keywords.map((_, i) => `CASE WHEN i.description ILIKE $${i + 1} THEN 1 ELSE 0 END`).join(' + ')}
          ) +
          ${WEIGHTS.MARKDOWN_CONTENT} * (
            ${keywords.map((_, i) => `CASE WHEN md.content ILIKE $${i + 1} THEN 1 ELSE 0 END`).join(' + ')}
          )
        ) AS score
      FROM 
        medical_icd10_markdown_docs md
      JOIN 
        medical_icd10_codes i ON md.icd10_code = i.icd10_code
      WHERE 
        ${keywords.map((_, i) => 
          `i.description ILIKE $${i + 1} OR 
           md.content ILIKE $${i + 1}`
        ).join(' OR ')}
      ORDER BY 
        score DESC
      LIMIT $${keywords.length + 1}
    `;
    
    const params = [...keywords.map(keyword => `%${keyword}%`), limit];
    const result = await queryMainDb(query, params);
    
    // Convert the results to MarkdownRowWithScore objects
    const markdownRows: MarkdownRowWithScore[] = result.rows.map((row: PostgresMarkdownRow) => ({
      id: row.id,
      icd10_code: row.icd10_code,
      icd10_description: row.icd10_description,
      content_preview: row.content_preview,
      score: parseFloat(row.score)
    }));
    
    logger.info(`Found ${markdownRows.length} relevant markdown docs with PostgreSQL weighted search`);
    
    // Log the top results with scores for debugging
    if (markdownRows.length > 0) {
      logger.debug('Top markdown results with scores from PostgreSQL:');
      markdownRows.slice(0, 3).forEach(row => {
        logger.debug(`${row.icd10_code}: ${row.icd10_description} (Score: ${row.score})`);
      });
    }
    
    return markdownRows;
  } catch (error) {
    logger.error('Error searching markdown docs with PostgreSQL weighted search:', error);
    return [];
  }
}

/**
 * Generate database context using PostgreSQL weighted search
 * @param keywords Keywords to search for
 * @returns Formatted database context string
 */
export async function generateDatabaseContextWithPostgresWeighted(
  keywords: string[]
): Promise<{
  icd10Rows: ICD10RowWithScore[];
  cptRows: CPTRowWithScore[];
  mappingRows: MappingRowWithScore[];
  markdownRows: MarkdownRowWithScore[];
}> {
  try {
    logger.info('CONTEXT_PATH: Using PostgreSQL weighted search fallback');
    
    // Search for ICD-10 codes with scores
    const icd10Rows = await searchICD10CodesWithScores(keywords);
    logger.info(`Found ${icd10Rows.length} relevant ICD-10 codes with PostgreSQL weighted search`);
    
    // Search for CPT codes with scores
    const cptRows = await searchCPTCodesWithScores(keywords);
    logger.info(`Found ${cptRows.length} relevant CPT codes with PostgreSQL weighted search`);
    
    // Search for mappings with scores
    const mappingRows = await searchMappingsWithScores(keywords);
    logger.info(`Found ${mappingRows.length} relevant mappings with PostgreSQL weighted search`);
    
    // Search for markdown docs with scores
    const markdownRows = await searchMarkdownDocsWithScores(keywords);
    logger.info(`Found ${markdownRows.length} relevant markdown docs with PostgreSQL weighted search`);
    
    return {
      icd10Rows,
      cptRows,
      mappingRows,
      markdownRows
    };
  } catch (error) {
    logger.error('Error in PostgreSQL weighted search fallback:', error);
    return {
      icd10Rows: [],
      cptRows: [],
      mappingRows: [],
      markdownRows: []
    };
  }
}