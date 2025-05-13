/**
 * JSON Data Access Functions
 * 
 * This module provides functions for accessing JSON data stored in Redis.
 * It replaces the previous hash-based access functions with JSON-specific ones.
 */

import { getRedisClient } from '../../../config/redis';
import { CPTRow, ICD10Row } from '../../database/types';
import logger from '../../../utils/logger';

/**
 * Get CPT codes by IDs using JSON.GET
 * @param cptCodes Array of CPT codes
 * @returns Array of CPT codes
 */
export async function getCPTCodesByIds(cptCodes: string[]): Promise<CPTRow[]> {
  try {
    // Get Redis client
    const client = getRedisClient();
    
    // Create an array to store the results
    const results: CPTRow[] = [];
    
    // Get each CPT code
    for (const cptCode of cptCodes) {
      try {
        // Use JSON.GET to retrieve the JSON document
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await (client as any).call('JSON.GET', `cpt:code:${cptCode}`) as string;
        
        // Parse the JSON data
        const parsedData = JSON.parse(data);
        
        // Create a CPTRow object
        const row: CPTRow = {
          cpt_code: parsedData.cpt_code || cptCode,
          description: parsedData.description || '',
          modality: parsedData.modality || '',
          body_part: parsedData.body_part || ''
        };
        
        // Add the row to the results
        results.push(row);
      } catch (error) {
        logger.error(`Error getting CPT code ${cptCode}:`, error);
      }
    }
    
    return results;
  } catch (error) {
    logger.error('Error getting CPT codes by IDs:', error);
    return [];
  }
}

/**
 * Get ICD-10 codes by IDs using JSON.GET
 * @param icd10Codes Array of ICD-10 codes
 * @returns Array of ICD-10 codes
 */
export async function getICD10CodesByIds(icd10Codes: string[]): Promise<ICD10Row[]> {
  try {
    // Get Redis client
    const client = getRedisClient();
    
    // Create an array to store the results
    const results: ICD10Row[] = [];
    
    // Get each ICD-10 code
    for (const icd10Code of icd10Codes) {
      try {
        // Use JSON.GET to retrieve the JSON document
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await (client as any).call('JSON.GET', `icd10:code:${icd10Code}`) as string;
        
        // Parse the JSON data
        const parsedData = JSON.parse(data);
        
        // Create an ICD10Row object
        const row: ICD10Row = {
          icd10_code: parsedData.icd10_code || icd10Code,
          description: parsedData.description || '',
          clinical_notes: parsedData.clinical_notes || '',
          imaging_modalities: parsedData.imaging_modalities || '',
          primary_imaging: parsedData.primary_imaging || ''
        };
        
        // Add the row to the results
        results.push(row);
      } catch (error) {
        logger.error(`Error getting ICD-10 code ${icd10Code}:`, error);
      }
    }
    
    return results;
  } catch (error) {
    logger.error('Error getting ICD-10 codes by IDs:', error);
    return [];
  }
}