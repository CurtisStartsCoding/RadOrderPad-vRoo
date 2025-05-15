# Redis JSON Search Best Practices

This document outlines best practices for using RediSearch with JSON documents in the RadOrderPad API backend.

## Overview

Our application uses Redis as a caching layer and RediSearch for full-text search capabilities. We store medical data (CPT codes, ICD-10 codes, and Markdown documents) as JSON documents in Redis and use RediSearch to search this data efficiently.

## Key Findings from Research and Testing

Through extensive research and testing, we've discovered important details about how RediSearch works with JSON documents:

1. **Index Creation**: Indices should be created with `ON JSON` configuration and JSONPath field specifiers.
2. **Data Storage**: Data should be stored as JSON documents using `JSON.SET`.
3. **Search Queries**: Search queries should use field aliases (defined in the schema) rather than JSONPath field specifiers.
4. **Return Clauses**: Return clauses should use JSONPath field specifiers.
5. **Field Aliases**: The `AS` clause in the schema creates an alias for each JSONPath field, and it's this alias that should be used in search queries.
6. **Weighted Queries**: For weighted search, use the format `(@field:(value) WEIGHT n.n)` with the field alias.

## Correct Implementation

### 1. Creating Indices

When creating a RediSearch index for JSON documents, use the `ON JSON` configuration and define field aliases for JSONPath field specifiers:

```typescript
await client.call(
  'FT.CREATE', 'idx:cpt', 'ON', 'JSON', 'PREFIX', '1', 'cpt:code:',
  'SCHEMA',
  '$.cpt_code', 'AS', 'cpt_code', 'TAG', 'SORTABLE',
  '$.description', 'AS', 'description', 'TEXT', 'WEIGHT', '5.0',
  '$.body_part', 'AS', 'body_part', 'TEXT', 'WEIGHT', '3.0',
  '$.modality', 'AS', 'modality', 'TAG',
  '$.clinical_justification', 'AS', 'clinical_justification', 'TEXT', 'WEIGHT', '3.0',
  '$.key_findings', 'AS', 'key_findings', 'TEXT', 'WEIGHT', '2.0'
);
```

In this example:
- `'ON', 'JSON'` specifies that the index is for JSON documents.
- `'PREFIX', '1', 'cpt:code:'` specifies the key prefix for the documents to index.
- `'$.cpt_code', 'AS', 'cpt_code'` creates an alias `cpt_code` for the JSONPath field specifier `$.cpt_code`.

### 2. Storing Data

Store data as JSON documents using `JSON.SET`:

```typescript
await client.call('JSON.SET', `cpt:code:${cpt.cpt_code}`, '.', JSON.stringify(cpt));
```

In this example:
- `cpt:code:${cpt.cpt_code}` is the key for the document.
- `'.'` is the path within the document (root in this case).
- `JSON.stringify(cpt)` is the JSON document to store.

### 3. Searching Data

When searching data, use field aliases (defined in the schema) rather than JSONPath field specifiers:

```typescript
// CORRECT: Using field aliases
const query = `(@description:(${searchTerms}) WEIGHT 5.0) | (@body_part:(${searchTerms}) WEIGHT 3.0) | (@clinical_justification:(${searchTerms}) WEIGHT 3.0) | (@key_findings:(${searchTerms}) WEIGHT 2.0)`;

// INCORRECT: Using JSONPath field specifiers
// const query = `(@\\$.description:(${searchTerms}) WEIGHT 5.0) | (@\\$.body_part:(${searchTerms}) WEIGHT 3.0) | (@\\$.clinical_justification:(${searchTerms}) WEIGHT 3.0) | (@\\$.key_findings:(${searchTerms}) WEIGHT 2.0)`;

const result = await client.call(
  'FT.SEARCH',
  'idx:cpt',
  query,
  'WITHSCORES',
  'LIMIT', '0', '10',
  'RETURN', '6', '$.cpt_code', '$.description', '$.modality', '$.body_part', '$.clinical_justification', '$.key_findings'
);
```

In this example:
- The query uses field aliases (`@description`, `@body_part`, etc.) rather than JSONPath field specifiers (`@$.description`, `@$.body_part`, etc.).
- The `RETURN` clause uses JSONPath field specifiers (`$.cpt_code`, `$.description`, etc.).

### 4. Processing Results

When processing search results, remember that the returned fields use JSONPath field specifiers:

```typescript
// Process the returned fields
for (let j = 0; j < data.length; j += 2) {
  const fieldName = data[j] as string;
  const fieldValue = data[j + 1] as string;
  
  // Map the field names to the CPTRow properties
  switch (fieldName) {
    case '$.cpt_code':
      row.cpt_code = fieldValue;
      break;
    case '$.description':
      row.description = fieldValue;
      break;
    // ... other fields
  }
}
```

## Common Pitfalls

1. **Using JSONPath in Queries**: Using JSONPath field specifiers in queries (`@$.field`) instead of field aliases (`@field`) will result in syntax errors.
2. **Forgetting to Define Aliases**: When creating an index, forgetting to define aliases for JSONPath field specifiers will make it difficult to search the fields.
3. **Mixing Hash and JSON**: Mixing Hash and JSON storage for the same type of data can lead to inconsistent search results.

## Testing

We've created several test scripts to verify the correct implementation:

1. `debug-scripts/redis-optimization/deep-test-redis-json-search.js`: Tests different query formats and verifies that field aliases work correctly while JSONPath field specifiers fail.
2. `debug-scripts/redis-optimization/test-weighted-search.js`: Tests weighted search functionality with different query formats.
3. `debug-scripts/verify-redis-json-search.js`: Verifies that the search is working correctly with the current implementation.

## Advanced Features

### Array Handling

When indexing JSON arrays, use the `TAG` type to index each element separately:

```typescript
await client.call(
  'FT.CREATE', 'idx:vendors', 'ON', 'JSON', 'PREFIX', '1', 'vendor:',
  'SCHEMA',
  '$.cuisines', 'AS', 'cuisine', 'TAG'
);
```

This allows you to search for specific array elements:

```typescript
const query = '@cuisine:{Italian}';
```

### Numeric Range Queries

For numeric fields, use the `NUMERIC` type to enable range queries:

```typescript
await client.call(
  'FT.CREATE', 'idx:products', 'ON', 'JSON', 'PREFIX', '1', 'product:',
  'SCHEMA',
  '$.price', 'AS', 'price', 'NUMERIC', 'SORTABLE'
);
```

This allows you to search for numeric ranges:

```typescript
const query = '@price:[10 100]';
```

### Aggregations

RediSearch supports aggregations on search results:

```typescript
const result = await client.call(
  'FT.AGGREGATE',
  'idx:products',
  '@category:{Electronics}',
  'GROUPBY', '1', '@brand',
  'REDUCE', 'AVG', '1', '@price', 'AS', 'avg_price'
);
```

## Conclusion

By following these best practices, we ensure that our Redis JSON search implementation is working correctly and efficiently. The key insights are:

1. The index schema uses JSONPath field specifiers (`$.field`) with aliases (`AS field`).
2. Search queries should use field aliases (`@field:(value)`) rather than JSONPath field specifiers.
3. Return clauses should use JSONPath field specifiers (`$.field`).
4. For weighted search, use the format `(@field:(value) WEIGHT n.n)` with the field alias.