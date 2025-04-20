/**
 * Mapping search functions using Redis
 */
import { getRedisClient, getCachedDataWithRedisJson, cacheDataWithRedisJson } from '../../../config/redis.js';
import {
  ICD10Row,
  CPTRow,
  MappingRow,
  handleRedisSearchError
} from './common.js';

/**
 * Get mappings between ICD-10 and CPT codes
 * @param icd10Codes Array of ICD-10 codes
 * @param cptCodes Array of CPT codes
 * @returns Array of mappings
 */
export async function getMappings(
  icd10Codes: ICD10Row[],
  cptCodes: CPTRow[]
): Promise<MappingRow[]> {
  const client = getRedisClient();
  const mappings: MappingRow[] = [];
  
  try {
    // Get mappings for each ICD-10 and CPT code combination
    for (const icd10 of icd10Codes) {
      for (const cpt of cptCodes) {
        try {
          const key = `mapping:${icd10.icd10_code}:${cpt.cpt_code}`;
          // Use the Redis client's command method with proper type assertion
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = await (client as any).call('GET', key) as string;
          
          if (data) {
            const parsedData = JSON.parse(data);
            mappings.push({
              id: parsedData.id || 0,
              icd10_code: icd10.icd10_code,
              icd10_description: icd10.description,
              cpt_code: cpt.cpt_code,
              cpt_description: cpt.description,
              appropriateness: parsedData.appropriateness || 0,
              evidence_source: parsedData.evidence_source || '',
              refined_justification: parsedData.refined_justification || ''
            });
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_err) {
          // Skip mappings that don't exist
        }
      }
    }
    
    return mappings;
  } catch (error) {
    handleRedisSearchError('getMappings', error);
    return [];
  }
}