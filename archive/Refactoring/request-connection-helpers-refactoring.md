# Connection Request Helpers Refactoring

**Date:** 2025-04-14
**Author:** Roo
**Status:** Completed

## Overview

This document details the refactoring of the `services/connection/services/request-connection-helpers.ts` file, which was identified as having multiple functions (2 functions in 79 lines). The refactoring follows the extreme refactoring principles established for the project.

## Original Structure

The original `request-connection-helpers.ts` file contained:

1. Two functions:
   - `updateExistingRelationship`: Updates an existing relationship to pending
   - `createNewRelationship`: Creates a new relationship

2. No clear separation of concerns between different relationship operations

## New Structure

The refactored code is organized into a directory structure that separates concerns:

```
src/services/connection/services/request-connection-helpers/
├── update-existing-relationship.ts    (33 lines)
├── create-new-relationship.ts         (32 lines)
└── index.ts                           (15 lines)
```

## Implementation Details

### Update Existing Relationship (update-existing-relationship.ts)

```typescript
import notificationManager from '../../../notification';
import { ConnectionOperationResponse } from '../../types';
import { UPDATE_RELATIONSHIP_TO_PENDING_QUERY } from '../../queries/request';

/**
 * Update an existing relationship to pending
 */
export async function updateExistingRelationship(
  client: any,
  initiatingOrgId: number,
  targetOrgId: number,
  initiatingUserId: number,
  notes: string | undefined,
  existingId: number,
  orgsData: any[]
): Promise<ConnectionOperationResponse> {
  const updateResult = await client.query(
    UPDATE_RELATIONSHIP_TO_PENDING_QUERY,
    [initiatingOrgId, targetOrgId, initiatingUserId, notes || null, existingId]
  );
  
  // Get target organization admin email for notification
  const targetOrg = orgsData.find(org => org.id === targetOrgId);
  
  // Send notification
  if (targetOrg && targetOrg.contact_email) {
    await notificationManager.sendConnectionRequest(
      targetOrg.contact_email,
      orgsData.find(org => org.id === initiatingOrgId)?.name || 'Unknown Organization'
    );
  }
  
  await client.query('COMMIT');
  
  return {
    success: true,
    message: 'Connection request sent successfully',
    relationshipId: updateResult.rows[0].id
  };
}
```

### Create New Relationship (create-new-relationship.ts)

```typescript
import notificationManager from '../../../notification';
import { ConnectionOperationResponse } from '../../types';
import { CREATE_RELATIONSHIP_QUERY } from '../../queries/request';

/**
 * Create a new relationship
 */
export async function createNewRelationship(
  client: any,
  initiatingOrgId: number,
  targetOrgId: number,
  initiatingUserId: number,
  notes: string | undefined,
  orgsData: any[]
): Promise<ConnectionOperationResponse> {
  const insertResult = await client.query(
    CREATE_RELATIONSHIP_QUERY,
    [initiatingOrgId, targetOrgId, initiatingUserId, notes || null]
  );
  
  // Get target organization admin email for notification
  const targetOrg = orgsData.find(org => org.id === targetOrgId);
  
  // Send notification
  if (targetOrg && targetOrg.contact_email) {
    await notificationManager.sendConnectionRequest(
      targetOrg.contact_email,
      orgsData.find(org => org.id === initiatingOrgId)?.name || 'Unknown Organization'
    );
  }
  
  await client.query('COMMIT');
  
  return {
    success: true,
    message: 'Connection request sent successfully',
    relationshipId: insertResult.rows[0].id
  };
}
```

### Main Entry Point (index.ts)

```typescript
/**
 * Connection request helper functions
 */

// Import functions
import { updateExistingRelationship } from './update-existing-relationship';
import { createNewRelationship } from './create-new-relationship';

// Re-export functions
export { updateExistingRelationship };
export { createNewRelationship };

// Default export for backward compatibility
export default {
  updateExistingRelationship,
  createNewRelationship
};
```

## Benefits

1. **Improved Maintainability**: Each file has a single responsibility, making it easier to understand and modify.
2. **Better Organization**: Related functionality is grouped together, making it easier to navigate the codebase.
3. **Enhanced Testability**: Smaller, focused modules are easier to test in isolation.
4. **Reduced Cognitive Load**: Developers only need to understand a small part of the codebase at a time.
5. **Backward Compatibility**: The original API is preserved through the index.ts file.

## Conclusion

The refactoring of the Connection Request Helpers module has successfully transformed a file with multiple functions into a set of smaller, more focused files. This improves maintainability while preserving the original functionality and API.