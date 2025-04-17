
# Debug6 Database Context Assembly Documentation

This document provides a comprehensive explanation of how the database context (`dbContextStr`) is assembled in the Debug6 feature for Claude API calls.

## Overview

Debug6 is designed to provide detailed debugging information for the AI-powered radiology order validation system. A critical part of this system is how it assembles database context to provide Claude with relevant medical knowledge for validation.

## Complete Process Flow

### 1. Keyword Extraction

The process begins by extracting medical keywords from the dictation text using the `extractMedicalKeywords` function:

```typescript
// Extract medical keywords from dictation
const keywords = extractMedicalKeywords(dictationText);
console.log('POSTGRES - Extracted keywords:', keywords);
```

This function identifies important medical terms that will be used to query the database.

### 2. Database Context Generation

Next, the system retrieves database context either from Redis cache or by generating it fresh using the `generateCachedDatabaseContext` function:

```typescript
/**
 * Enhanced Redis-powered PostgreSQL Database Context Generator
 * This function uses Redis cache to dramatically speed up database access to PostgreSQL
 */
async function generateCachedDatabaseContext(dictationText: string): Promise<any> {
  const startTime = performance.now();
  const keywords = extractMedicalKeywords(dictationText);
  
  // Check if Redis is available and enabled
  const isRedisAvailable = await redisCache.isRedisAvailable();
  
  // Generate a stable cache key based on the dictation text  
  const cacheKey = `pgcontext:${Buffer.from(dictationText).toString('base64').substring(0, 20)}`;
  
  // Force cache to be enabled
  await medicalCodesService.setEnableCache(true);
  
  // Try to get cached context 
  if (isRedisAvailable) {
    console.log('🔍 Checking Redis cache for database context...');
    const cachedContext = await redisCache.getMedicalCode('context', cacheKey);
    if (cachedContext) {
      console.log('✅ REDIS CACHE HIT - Using cached database context');
      return {
        ...cachedContext,
        fromCache: true,
        timeTaken: performance.now() - startTime
      };
    }
    console.log('❌ REDIS CACHE MISS - Generating fresh database context');
  }
  
  // If not cached or Redis unavailable, generate fresh context from PostgreSQL
  console.log('POSTGRES - Generating fresh database context from PostgreSQL');
  const context = await generatePostgresDbContext(dictationText);
  
  // Cache the result if Redis is available
  if (isRedisAvailable) {
    await redisCache.setMedicalCode('context', cacheKey, context);
    console.log('💾 Cached database context in Redis');
  }
  
  return {
    ...context,
    fromCache: false,
    timeTaken: performance.now() - startTime
  };
}
```

The `generateCachedDatabaseContext` function works as follows:

1. Check Redis cache for existing database context
2. If not found in cache, call `generatePostgresDbContext`
3. Store result in Redis cache for future use

### 3. PostgreSQL Database Queries

The `generatePostgresDbContext` function queries the PostgreSQL database for medical information related to the extracted keywords:

```typescript
export async function generatePostgresDbContext(dictationText: string): Promise<DbContext> {
  console.log('POSTGRES - Generating database context from PostgreSQL');
  
  try {
    // Extract medical keywords from dictation
    const keywords = extractMedicalKeywords(dictationText);
    console.log('POSTGRES - Extracted keywords:', keywords);
    
    // Get relevant codes and mappings from PostgreSQL
    const possibleDiagnoses = await getRelevantDiagnosisCodes(keywords);
    const possibleProcedures = await getRelevantProcedureCodes(keywords);
    
    // Get diagnosis and procedure code lists
    const diagnosisCodes = possibleDiagnoses.map(d => d.code);
    const procedureCodes = possibleProcedures.map(p => p.code);
    
    // Get appropriateness mappings and markdown docs
    const appropriatenessMappings = await getAppropriatenessMappings(diagnosisCodes, procedureCodes);
    const markdownDocs = await getMarkdownDocs(diagnosisCodes);
    
    return {
      possibleDiagnoses,
      possibleProcedures,
      appropriatenessMappings,
      markdownDocs
    };
  } catch (error) {
    console.error('Error generating PostgreSQL database context:', error);
    
    // Return empty context on error
    return {
      possibleDiagnoses: [],
      possibleProcedures: [],
      appropriatenessMappings: [],
      markdownDocs: []
    };
  }
}
```

This involves:
- Retrieving relevant ICD-10 diagnosis codes
- Retrieving relevant CPT procedure codes
- Finding appropriateness mappings between diagnoses and procedures
- Getting markdown documentation for the diagnoses

Each of these database queries may use Redis caching to improve performance:

```typescript
// Get relevant diagnosis codes with Redis caching
async function getRelevantDiagnosisCodes(keywords: string[]): Promise<DiagnosisCode[]> {
  // Force caching to be enabled for diagnosis lookup
  await medicalCodesService.setEnableCache(true);
  console.log('👉 Redis caching EXPLICITLY ENABLED for diagnosis lookup');
  
  // Implementation with Redis caching
  // ...
}

// Get relevant procedure codes with Redis caching
async function getRelevantProcedureCodes(keywords: string[]): Promise<ProcedureCode[]> {
  // Force caching to be enabled for procedure lookup
  await medicalCodesService.setEnableCache(true);
  console.log('👉 Redis caching EXPLICITLY ENABLED for procedure lookup');
  
  // Implementation with Redis caching
  // ...
}

// Get appropriateness mappings with Redis caching
async function getAppropriatenessMappings(
  diagnosisCodes: string[], 
  procedureCodes: string[]
): Promise<AppropriatenessMapping[]> {
  // Force caching to be enabled for mappings
  await medicalCodesService.setEnableCache(true);
  console.log('👉 Redis caching EXPLICITLY ENABLED for mappings lookup');
  
  // Implementation with Redis caching
  // ...
}
```

### 4. Database Context Formatting

The retrieved information is then formatted into a readable string using the `formatDatabaseContext` function:

```typescript
export function formatDatabaseContext(dbContext: DbContext): string {
  // Format diagnoses
  const diagnosesSection = dbContext.possibleDiagnoses.length > 0
    ? `POSSIBLE DIAGNOSES (from PostgreSQL database):
${dbContext.possibleDiagnoses.map(d => 
  `- ${d.code}: ${d.description} (confidence: ${Math.round((d.confidence || 0.5) * 100)}%)`
).join('\n')}`
    : 'No relevant diagnoses found in database.';

  // Format procedures
  const proceduresSection = dbContext.possibleProcedures.length > 0
    ? `POSSIBLE PROCEDURES (from PostgreSQL database):
${dbContext.possibleProcedures.map(p => 
  `- ${p.code}: ${p.description} (${p.modality || 'modality unknown'}) (confidence: ${Math.round((p.confidence || 0.5) * 100)}%)`
).join('\n')}`
    : 'No relevant procedures found in database.';

  // Format appropriateness mappings
  const mappingsSection = dbContext.appropriatenessMappings.length > 0
    ? `APPROPRIATENESS MAPPINGS (from ACR guidelines in PostgreSQL):
${dbContext.appropriatenessMappings.map(m => 
  `- ${m.diagnosisCode} (${m.diagnosisDescription}) + ${m.procedureCode} (${m.procedureDescription}):
  * Score: ${m.score}/9 (${m.score >= 7 ? 'Usually Appropriate' : m.score >= 4 ? 'May Be Appropriate' : 'Rarely Appropriate'})
  * Evidence: ${m.evidence || 'Not specified'}
  * Justification: ${m.justification || 'Not specified'}`
).join('\n\n')}`
    : 'No appropriateness mappings found in database.';

  // Format the markdown documentation
  const markdownSection = dbContext.markdownDocs && dbContext.markdownDocs.length > 0
    ? `MEDICAL DOCUMENTATION (from PostgreSQL guidelines):
${dbContext.markdownDocs.map(doc => 
  `--- DOCUMENTATION FOR ${doc.icd10_code} ---
${doc.content}`
).join('\n\n')}`
    : 'No medical documentation found in database.';

  return `
POSTGRESQL DATABASE CONTEXT:
${diagnosesSection}

${proceduresSection}

${mappingsSection}

${markdownSection}
`;
}
```

This creates nicely formatted sections for:
- Diagnoses with their codes, descriptions, and confidence scores
- Procedures with their codes, descriptions, modalities, and confidence scores
- Appropriateness mappings showing scores (1-9 scale) and justifications
- Markdown documentation content for medical conditions

### 5. Final Incorporation into API Payload

The formatted database context string is then incorporated into the system prompt for the Claude API:

```typescript
systemPrompt = `You are RadValidator, an AI clinical decision support system for radiology order validation.

Your task is to analyze a physician's dictation for a radiology order and produce the following outputs:
1. Extract relevant ICD-10 diagnosis codes
2. Extract or suggest appropriate CPT procedure codes 
3. Validate if the imaging order is clinically appropriate
4. Assign a compliance score from 1-9 (9 being most appropriate)
5. Provide brief educational feedback if the order is inappropriate

The dictation is for a patient with the specialty context: ${specialty || 'General Radiology'}.

${dbContextStr}

IMPORTANT GUIDELINES:
- Validate based on ACR Appropriateness Criteria and evidence-based guidelines
- For inappropriate orders, suggest alternative approaches
- For spine imaging, MRI without contrast is usually sufficient for disc evaluation
- Acute low back pain (<6 weeks) without red flags should be managed conservatively
- Red flags include: trauma, cancer history, neurological deficits, infection signs

Only use contrast when there is a specific indication (infection, tumor, post-surgical).`;
```

This allows Claude to have access to the relevant medical knowledge when analyzing the dictation text.

The user prompt follows:

```typescript
userPrompt = `Please analyze this radiology order dictation:

"${strippedText}"

Respond in JSON format with these fields:
- diagnosisCodes: Array of {code, description} objects
- procedureCodes: Array of {code, description} objects
- validationStatus: "valid" or "invalid"
- complianceScore: Number 1-9
- feedback: Brief educational note for inappropriate orders (33 words target length for ${specialty || 'General Radiology'})`;
```

### 6. API Request to Claude

Finally, the API request is sent to Claude with the assembled context:

```typescript
const apiRequest = {
  model: MODEL_NAME,
  max_tokens: 4000,
  temperature: 0,  // Temperature is set to 0 for deterministic responses
  system: systemPrompt,
  messages: [
    { role: 'user', content: userPrompt }
  ],
};

// For Debug6 panel, we'll send both the request and response
try {
  // Make the API call
  const apiResponse = await claudeClient.messages.create(apiRequest);
  
  // Debug output showing the full API request and response
  console.log('=== CLAUDE API REQUEST ===');
  console.log(JSON.stringify(apiRequest, null, 2));
  
  console.log('=== CLAUDE API RESPONSE ===');
  console.log(JSON.stringify(apiResponse, null, 2));
  
  // Process the response
  // ...
} catch (error) {
  console.error('Error calling Claude API:', error);
  // Handle error
}
```

## Temperature Setting

In the final API request to Claude, the temperature is set to 0 to ensure deterministic responses:

```typescript
temperature: 0,  // Temperature is set to 0 for deterministic responses
```

This temperature value of 0 ensures the Claude API produces deterministic, consistent responses for the same input.

## Redis Caching

Redis caching is used throughout the process to improve performance:

1. The database context is cached using a key based on the dictation text
2. Individual database queries for diagnoses, procedures, and mappings may also use Redis caching
3. Cache enablement is forced in multiple places with `setEnableCache(true)` to ensure consistent behavior

Redis configuration is handled in `utils/redis-cache.ts`:

```typescript
// Redis connection configuration for improved reliability
const redisConfig = {
  connectTimeout: 15000, // 15 second connection timeout
  maxRetriesPerRequest: 5,
  retryStrategy: (times: number) => {
    console.log(`[Redis] Retrying connection, attempt ${times}`);
    const delay = Math.min(Math.pow(2, times) * 100, 5000);
    return delay;
  },
  enableOfflineQueue: true,
  reconnectOnError: (err) => {
    // Only reconnect on specific errors
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      return true; // reconnect for this error
    }
    return false; // don't reconnect for other errors
  }
};
```

## Word Length Target for Feedback

The 33-word target length for the feedback is specified in the user prompt:

```typescript
feedback: Brief educational note for inappropriate orders (33 words target length for ${specialty || 'General Radiology'})
```

This ensures Claude will attempt to provide feedback of approximately 33 words, which is the optimal length determined for General Radiology. The system may use different word counts for other specialties, based on specialty-specific optimization research.

## Conclusion

This documentation provides a comprehensive overview of how the Debug6 feature assembles database context to enhance AI validation of radiology orders. The process includes keyword extraction, database querying, context formatting, and incorporation into the Claude API payload, all designed to provide the AI with the necessary medical knowledge to perform accurate validations. The use of Redis caching throughout the system optimizes performance for a responsive user experience.
