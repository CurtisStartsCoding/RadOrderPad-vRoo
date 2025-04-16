# Query Builder Refactoring

**Date:** 2025-04-14
**Author:** Roo
**Status:** Completed

## Overview

This document details the refactoring of the `services/order/admin/utils/query-builder.ts` file, which was identified as having multiple functions (2 functions in 137 lines). The refactoring follows the extreme refactoring principles established for the project.

## Original Structure

The original `query-builder.ts` file contained:

1. Two functions:
   - `buildUpdateQuery`: Builds an SQL update query from an object of field/value pairs
   - `buildUpdateQueryFromPairs`: Builds an SQL update query from an array of field/value pair objects

2. A shared interface:
   - `UpdateQueryResult`: Defines the structure of the query result

## New Structure

The refactored code is organized into a directory structure that separates concerns:

```
src/services/order/admin/utils/query-builder/
├── types.ts                           (6 lines)
├── build-update-query.ts              (50 lines)
├── build-update-query-from-pairs.ts   (47 lines)
└── index.ts                           (18 lines)
```

## Implementation Details

### Types (types.ts)

```typescript
/**
 * Result of building an update query
 */
export interface UpdateQueryResult {
  query: string;
  values: any[];
}
```

### Build Update Query (build-update-query.ts)

```typescript
import { UpdateQueryResult } from './types';

/**
 * Build an SQL update query
 * @param tableName Name of the table to update
 * @param updateData Object containing field/value pairs to update
 * @param idField Name of the ID field (default: 'id')
 * @param idValue Value of the ID
 * @param fieldMap Optional mapping of object keys to database columns
 * @param includeTimestamp Whether to include updated_at = NOW() (default: true)
 * @param returnFields Fields to return (default: ['id'])
 * @returns Object containing the query string and parameter values
 */
export function buildUpdateQuery(
  tableName: string,
  updateData: { [key: string]: any },
  idField: string = 'id',
  idValue: any,
  fieldMap?: { [key: string]: string },
  includeTimestamp: boolean = true,
  returnFields: string[] = ['id']
): UpdateQueryResult {
  const updateFields = [];
  const updateValues = [];
  let valueIndex = 1;
  
  // Process each field in the update data
  for (const [key, value] of Object.entries(updateData)) {
    if (value === undefined) continue;
    
    // Get the database column name (either from fieldMap or use the key directly)
    const columnName = fieldMap ? fieldMap[key] || key : key;
    
    updateFields.push(`${columnName} = $${valueIndex}`);
    updateValues.push(value);
    valueIndex++;
  }
  
  if (updateFields.length === 0) {
    throw new Error('No valid fields provided for update');
  }
  
  // Add timestamp if requested
  if (includeTimestamp) {
    updateFields.push(`updated_at = NOW()`);
  }
  
  // Build the query
  const returningClause = returnFields.length > 0 
    ? `RETURNING ${returnFields.join(', ')}` 
    : '';
  
  const query = `
    UPDATE ${tableName}
    SET ${updateFields.join(', ')}
    WHERE ${idField} = $${valueIndex}
    ${returningClause}
  `;
  
  return {
    query,
    values: [...updateValues, idValue]
  };
}
```

### Build Update Query From Pairs (build-update-query-from-pairs.ts)

```typescript
import { UpdateQueryResult } from './types';

/**
 * Build an SQL update query from a list of field/value pairs
 * @param tableName Name of the table to update
 * @param fieldValuePairs Array of objects with field and value properties
 * @param idField Name of the ID field (default: 'id')
 * @param idValue Value of the ID field
 * @param includeTimestamp Whether to include updated_at = NOW() (default: true)
 * @param returnFields Fields to return (default: ['id'])
 * @returns Object containing the query string and parameter values
 */
export function buildUpdateQueryFromPairs(
  tableName: string,
  fieldValuePairs: { field: string, value: any }[],
  idField: string = 'id',
  idValue: any,
  includeTimestamp: boolean = true,
  returnFields: string[] = ['id']
): UpdateQueryResult {
  const updateFields = [];
  const updateValues = [];
  let valueIndex = 1;
  
  // Process each field/value pair
  for (const { field, value } of fieldValuePairs) {
    if (value === undefined) continue;
    
    updateFields.push(`${field} = $${valueIndex}`);
    updateValues.push(value);
    valueIndex++;
  }
  
  if (updateFields.length === 0) {
    throw new Error('No valid fields provided for update');
  }
  
  // Add timestamp if requested
  if (includeTimestamp) {
    updateFields.push(`updated_at = NOW()`);
  }
  
  // Build the query
  const returningClause = returnFields.length > 0 
    ? `RETURNING ${returnFields.join(', ')}` 
    : '';
  
  const query = `
    UPDATE ${tableName}
    SET ${updateFields.join(', ')}
    WHERE ${idField} = $${valueIndex}
    ${returningClause}
  `;
  
  return {
    query,
    values: [...updateValues, idValue]
  };
}
```

### Main Entry Point (index.ts)

```typescript
/**
 * Utility for building SQL update queries
 */

// Import functions
import { UpdateQueryResult } from './types';
import { buildUpdateQuery } from './build-update-query';
import { buildUpdateQueryFromPairs } from './build-update-query-from-pairs';

// Re-export types
export { UpdateQueryResult };

// Re-export functions
export { buildUpdateQuery };
export { buildUpdateQueryFromPairs };

// Default export for backward compatibility
export default {
  buildUpdateQuery,
  buildUpdateQueryFromPairs
};
```

## Benefits

1. **Improved Maintainability**: Each file has a single responsibility, making it easier to understand and modify.
2. **Better Organization**: Related functionality is grouped together, making it easier to navigate the codebase.
3. **Enhanced Testability**: Smaller, focused modules are easier to test in isolation.
4. **Reduced Cognitive Load**: Developers only need to understand a small part of the codebase at a time.
5. **Backward Compatibility**: The original API is preserved through the index.ts file.

## Conclusion

The refactoring of the Query Builder module has successfully transformed a file with multiple functions into a set of smaller, more focused files. This improves maintainability while preserving the original functionality and API.