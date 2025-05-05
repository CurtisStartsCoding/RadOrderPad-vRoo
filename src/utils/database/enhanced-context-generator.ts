/**
 * Enhanced Database Context Generator
 * 
 * This module provides a function to generate database context for validation
 * using advanced Redis features like RediSearch, RedisJSON, and Vector Search.
 */

import { formatDatabaseContext } from './context-formatter';
import { categorizeKeywords } from './keyword-categorizer';
// CPTRow is not used in this file, so we remove the import
import { searchICD10CodesFuzzy } from '../../services/medical-codes/enhanced-icd10-service';
import { searchProcedureCodes, CPTSearchResult } from '../../services/search/procedure-search';
import { ICD10SearchResult } from '../../services/search/diagnosis-search';
import { getCptCodesForIcd10Enhanced } from '../../services/medical-codes/enhanced-mapping-service';
import { identifyRareDiseases, RareDiseaseRow } from '../../services/medical-codes/rare-disease-service';
import enhancedLogger from '../../utils/enhanced-logger';

/**
 * Generate enhanced database context using advanced Redis features
 * @param keywords Keywords to search for
 * @param options Additional options
 * @returns Formatted database context string
 */
export async function generateEnhancedDatabaseContext(
  keywords: string[],
  options: {
    includeRareDiseases?: boolean;
    clinicalNotes?: string;
  } = {}
): Promise<string> {
  if (keywords.length === 0) {
    return 'No specific medical context found in the input text.';
  }
  
  const { includeRareDiseases = false, clinicalNotes = '' } = options;
  const startTime = Date.now();
  enhancedLogger.info('Generating enhanced database context using keywords:', keywords);
  
  try {
    // Categorize keywords for more targeted queries
    const categorizedKeywords = categorizeKeywords(keywords);
    enhancedLogger.debug('Categorized keywords:', categorizedKeywords);
    
    // Search for ICD-10 codes using RediSearch with fuzzy matching
    enhancedLogger.info('Searching for ICD-10 codes with fuzzy matching...');
    const icd10SearchStartTime = Date.now();
    
    // Join all keywords into a single query string
    const diagnosisQuery = keywords.join(' ');
    
    // Use the enhanced search service with fuzzy matching
    const icd10Results = await searchICD10CodesFuzzy(diagnosisQuery, {
      limit: 20,
      // Use the first symptom as a specialty if available
      specialty: categorizedKeywords.symptoms.length > 0 ? categorizedKeywords.symptoms[0] : null
    });
    
    const icd10SearchDuration = Date.now() - icd10SearchStartTime;
    enhancedLogger.info(`Found ${icd10Results.length} relevant ICD-10 codes with fuzzy search (took ${icd10SearchDuration}ms)`);
    
    // Log the top ICD-10 results with scores for debugging
    if (icd10Results.length > 0) {
      enhancedLogger.debug('Top ICD-10 results with scores:');
      icd10Results.slice(0, 3).forEach(row => {
        // Type assertion to access score property
        const rowWithScore = row as unknown as { icd10_code: string; description: string; score: number };
        enhancedLogger.debug(`${rowWithScore.icd10_code}: ${rowWithScore.description} (Score: ${rowWithScore.score})`);
      });
    }
    
    // Search for CPT codes using PostgreSQL weighted search with Redis caching
    // Note: We could enhance this with RediSearch in the future
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
        // Type assertion to access score property
        const rowWithScore = row as unknown as { cpt_code: string; description: string; score: number };
        enhancedLogger.debug(`${rowWithScore.cpt_code}: ${rowWithScore.description} (Score: ${rowWithScore.score})`);
      });
    }
    
    // Get mappings between ICD-10 and CPT codes using RedisJSON
    enhancedLogger.info('Getting mappings with RedisJSON...');
    const mappingsSearchStartTime = Date.now();
    
    // Get mappings for the top ICD-10 codes using enhanced service
    const mappingPromises = icd10Results.slice(0, 5).map(icd10 => 
      getCptCodesForIcd10Enhanced(icd10.icd10_code)
    );
    
    const mappingsArrays = await Promise.all(mappingPromises);
    const mappingResults = mappingsArrays.flat();
    
    const mappingsSearchDuration = Date.now() - mappingsSearchStartTime;
    enhancedLogger.info(`Found ${mappingResults.length} relevant mappings with RedisJSON (took ${mappingsSearchDuration}ms)`);
    
    // Log the top mapping results for debugging
    if (mappingResults.length > 0) {
      enhancedLogger.debug('Top mapping results:');
      mappingResults.slice(0, 3).forEach(row => {
        enhancedLogger.debug(`${row.icd10_code} -> ${row.cpt_code} (Score: ${row.composite_score})`);
      });
    }
    
    // Identify rare diseases if clinical notes are provided and option is enabled
    let rareDiseases: RareDiseaseRow[] = [];
    let rareDiseaseDuration = 0;
    
    if (includeRareDiseases && clinicalNotes) {
      enhancedLogger.info('Identifying potential rare diseases from clinical notes...');
      const rareDiseaseStartTime = Date.now();
      
      rareDiseases = await identifyRareDiseases(clinicalNotes, 5);
      
      rareDiseaseDuration = Date.now() - rareDiseaseStartTime;
      enhancedLogger.info(`Found ${rareDiseases.length} potential rare diseases (took ${rareDiseaseDuration}ms)`);
      
      // Log the rare disease results for debugging
      if (rareDiseases.length > 0) {
        enhancedLogger.debug('Potential rare diseases:');
        rareDiseases.forEach(disease => {
          enhancedLogger.debug(`${disease.code}: ${disease.description}`);
        });
      }
    }
    
    // Format the database context
    const formatStartTime = Date.now();
    const result = formatDatabaseContext(
      icd10Results as unknown as ICD10SearchResult[],
      cptResults as unknown as CPTSearchResult[],
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
    enhancedLogger.info(`Total enhanced context generation took ${totalDuration}ms`, {
      totalDuration,
      icd10SearchDuration,
      cptSearchDuration,
      mappingsSearchDuration,
      rareDiseaseDuration,
      formatDuration,
      keywordCount: keywords.length,
      resultSize: result.length
    });
    
    return result;
  } catch (error) {
    enhancedLogger.error({
      message: 'Error generating enhanced database context',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Return a simple error message
    return 'Error generating enhanced database context. Please try again later.';
  }
}