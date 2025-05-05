/**
 * Redis Vector Search Module
 * 
 * This barrel file exports all Redis vector search functions.
 */

export {
  createVectorIndex,
  createRareDiseaseVectorIndex,
  createICD10VectorIndex,
  createCPTVectorIndex
} from './index-manager';

export {
  storeVectorEmbedding,
  storeRareDiseaseEmbedding,
  storeICD10Embedding,
  storeCPTEmbedding,
  storeClinicalNoteEmbedding
} from './vector-store';

export {
  searchSimilarCodes,
  searchSimilarRareDiseases,
  searchSimilarICD10Codes,
  searchSimilarCPTCodes,
  hybridSearch
} from './search';