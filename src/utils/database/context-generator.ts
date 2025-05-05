/**
 * Database Context Generator with PostgreSQL Weighted Search and Redis Caching
 * 
 * This module provides a function to generate database context for validation
 * using PostgreSQL weighted search with Redis caching.
 */

import { formatDatabaseContext } from './context-formatter';
import { categorizeKeywords } from './keyword-categorizer';
import { ICD10Row, CPTRow } from './types';
import { searchDiagnosisCodes } from '../../services/search/diagnosis-search';
import { searchProcedureCodes } from '../../services/search/procedure-search';
import { getCptCodesForIcd10 } from '../../services/medical-codes/mapping-service';
import enhancedLogger from '../../utils/enhanced-logger';

/**
 * Generate database context based on extracted keywords using PostgreSQL weighted search with Redis caching
 * @param keywords Keywords to search for
 * @returns Formatted database context string
 */
export async function generateDatabaseContext(keywords: string[]): Promise<string> {
  if (keywords.length === 0) {
    return 'No specific medical context found in the input text.';
  }
  
  const startTime = Date.now();
  enhancedLogger.info('Generating database context using keywords:', keywords);
  
  try {
    // Categorize keywords for more targeted queries
    const categorizedKeywords = categorizeKeywords(keywords);
    enhancedLogger.debug('Categorized keywords:', categorizedKeywords);
    
    // Search for ICD-10 codes using PostgreSQL weighted search with Redis caching
    enhancedLogger.info('Searching for ICD-10 codes with weighted search...');
    const icd10SearchStartTime = Date.now();
    
    // Join all keywords into a single query string
    const diagnosisQuery = keywords.join(' ');
    
    // Use the cached search service
    const icd10Results = await searchDiagnosisCodes(diagnosisQuery, {
      limit: 20,
      // Use the first symptom as a specialty if available
      specialty: categorizedKeywords.symptoms.length > 0 ? categorizedKeywords.symptoms[0] : null
    });
    
    const icd10SearchDuration = Date.now() - icd10SearchStartTime;
    enhancedLogger.info(`Found ${icd10Results.length} relevant ICD-10 codes with weighted search (took ${icd10SearchDuration}ms)`);
    
    // Log the top ICD-10 results with scores for debugging
    if (icd10Results.length > 0) {
      enhancedLogger.debug('Top ICD-10 results with scores:');
      icd10Results.slice(0, 3).forEach(row => {
        enhancedLogger.debug(`${row.icd10_code}: ${row.description} (Score: ${row.score})`);
      });
    }
    
    // Search for CPT codes using PostgreSQL weighted search with Redis caching
    enhancedLogger.info('Searching for CPT codes with weighted search...');
    const cptSearchStartTime = Date.now();
    
    // Join all keywords into a single query string
    const procedureQuery = keywords.join(' ');
    
    // Use the cached search service
    const cptResults = await searchProcedureCodes(procedureQuery, {
      limit: 20,
      // Use the first modality if available
      modality: categorizedKeywords.modalities.length > 0 ? categorizedKeywords.modalities[0] : null,
      // Use the first anatomy term as body part if available
      bodyPart: categorizedKeywords.anatomyTerms.length > 0 ? categorizedKeywords.anatomyTerms[0] : null
    });
    
    const cptSearchDuration = Date.now() - cptSearchStartTime;
    enhancedLogger.info(`Found ${cptResults.length} relevant CPT codes with weighted search (took ${cptSearchDuration}ms)`);
    
    // Log the top CPT results with scores for debugging
    if (cptResults.length > 0) {
      enhancedLogger.debug('Top CPT results with scores:');
      cptResults.slice(0, 3).forEach(row => {
        enhancedLogger.debug(`${row.cpt_code}: ${row.description} (Score: ${row.score})`);
      });
    }
    
    // Get mappings between ICD-10 and CPT codes
    enhancedLogger.info('Getting mappings...');
    const mappingsSearchStartTime = Date.now();
    
    // Get mappings for the top ICD-10 codes
    const mappingPromises = icd10Results.slice(0, 5).map(icd10 => 
      getCptCodesForIcd10(icd10.icd10_code)
    );
    
    const mappingsArrays = await Promise.all(mappingPromises);
    const mappingResults = mappingsArrays.flat();
    
    const mappingsSearchDuration = Date.now() - mappingsSearchStartTime;
    enhancedLogger.info(`Found ${mappingResults.length} relevant mappings (took ${mappingsSearchDuration}ms)`);
    
    // Log the top mapping results for debugging
    if (mappingResults.length > 0) {
      enhancedLogger.debug('Top mapping results:');
      mappingResults.slice(0, 3).forEach(row => {
        enhancedLogger.debug(`${row.icd10_code} -> ${row.cpt_code} (Score: ${row.composite_score})`);
      });
    }
    
    // Format the database context
    const formatStartTime = Date.now();
    const result = formatDatabaseContext(
      icd10Results as ICD10Row[],
      cptResults as CPTRow[],
      // Convert mapping results to the expected format
      mappingResults.map(mapping => ({
        id: mapping.id,
        icd10_code: mapping.icd10_code,
        icd10_description: mapping.icd10_code, // Use code as description if needed
        cpt_code: mapping.cpt_code,
        cpt_description: mapping.cpt_code, // Use code as description if needed
        appropriateness: mapping.appropriateness_score
      })),
      [] // No markdown docs for now
    );
    const formatDuration = Date.now() - formatStartTime;
    
    // Log total duration
    const totalDuration = Date.now() - startTime;
    enhancedLogger.info(`Total context generation took ${totalDuration}ms`, {
      totalDuration,
      icd10SearchDuration,
      cptSearchDuration,
      mappingsSearchDuration,
      formatDuration,
      keywordCount: keywords.length,
      resultSize: result.length
    });
    
    return result;
  } catch (error) {
    enhancedLogger.error({
      message: 'Error generating database context',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Return a simple error message
    return 'Error generating database context. Please try again later.';
  }
}