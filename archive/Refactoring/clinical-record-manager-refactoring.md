# Clinical Record Manager Refactoring

**Date:** 2025-04-14
**Author:** Roo
**Status:** Completed

## Overview

This document details the refactoring of the `services/order/admin/clinical-record-manager.ts` file, which was identified as having multiple functions (3 functions in 79 lines). The refactoring follows the extreme refactoring principles established for the project.

## Original Structure

The original `clinical-record-manager.ts` file contained:

1. Three functions:
   - `saveEmrSummary`: Saves EMR summary text as a clinical record
   - `saveSupplementalDocument`: Saves supplemental document text as a clinical record
   - `verifyOrderStatus`: Verifies order exists and has status 'pending_admin'

2. No clear separation of concerns between different clinical record management functionalities

## New Structure

The refactored code is organized into a directory structure that separates concerns:

```
src/services/order/admin/clinical-record-manager/
├── save-emr-summary.ts              (21 lines)
├── save-supplemental-document.ts    (21 lines)
├── verify-order-status.ts           (25 lines)
└── index.ts                         (17 lines)
```

## Implementation Details

### Save EMR Summary (save-emr-summary.ts)

```typescript
import { queryPhiDb } from '../../../../config/db';

/**
 * Save EMR summary text as a clinical record
 * @param orderId Order ID
 * @param patientId Patient ID
 * @param text EMR summary text
 * @param userId User ID
 * @returns Promise with result
 */
export async function saveEmrSummary(
  orderId: number,
  patientId: number,
  text: string,
  userId: number
): Promise<void> {
  await queryPhiDb(
    `INSERT INTO patient_clinical_records
     (patient_id, order_id, record_type, content, added_by_user_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [patientId, orderId, 'emr_summary_paste', text, userId]
  );
}
```

### Save Supplemental Document (save-supplemental-document.ts)

```typescript
import { queryPhiDb } from '../../../../config/db';

/**
 * Save supplemental document text as a clinical record
 * @param orderId Order ID
 * @param patientId Patient ID
 * @param text Supplemental document text
 * @param userId User ID
 * @returns Promise with result
 */
export async function saveSupplementalDocument(
  orderId: number,
  patientId: number,
  text: string,
  userId: number
): Promise<void> {
  await queryPhiDb(
    `INSERT INTO patient_clinical_records
     (patient_id, order_id, record_type, content, added_by_user_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [patientId, orderId, 'supplemental_docs_paste', text, userId]
  );
}
```

### Verify Order Status (verify-order-status.ts)

```typescript
import { queryPhiDb } from '../../../../config/db';
import { OrderData } from '../types';

/**
 * Verify order exists and has status 'pending_admin'
 * @param orderId Order ID
 * @returns Promise with order data
 * @throws Error if order not found or not in pending_admin status
 */
export async function verifyOrderStatus(orderId: number): Promise<OrderData> {
  const orderResult = await queryPhiDb(
    `SELECT o.id, o.status, o.patient_id, o.referring_organization_id 
     FROM orders o
     WHERE o.id = $1`,
    [orderId]
  );
  
  if (orderResult.rows.length === 0) {
    throw new Error(`Order ${orderId} not found`);
  }
  
  const order = orderResult.rows[0];
  
  if (order.status !== 'pending_admin') {
    throw new Error(`Order ${orderId} is not in pending_admin status`);
  }
  
  return order;
}
```

### Main Entry Point (index.ts)

```typescript
/**
 * Clinical record manager services
 */

// Import functions
import { saveEmrSummary } from './save-emr-summary';
import { saveSupplementalDocument } from './save-supplemental-document';
import { verifyOrderStatus } from './verify-order-status';

// Re-export functions
export { saveEmrSummary };
export { saveSupplementalDocument };
export { verifyOrderStatus };

// Default export for backward compatibility
export default {
  saveEmrSummary,
  saveSupplementalDocument,
  verifyOrderStatus
};
```

## Benefits

1. **Improved Maintainability**: Each file has a single responsibility, making it easier to understand and modify.
2. **Better Organization**: Related functionality is grouped together, making it easier to navigate the codebase.
3. **Enhanced Testability**: Smaller, focused modules are easier to test in isolation.
4. **Reduced Cognitive Load**: Developers only need to understand a small part of the codebase at a time.
5. **Backward Compatibility**: The original API is preserved through the index.ts file.

## Conclusion

The refactoring of the Clinical Record Manager module has successfully transformed a file with multiple functions into a set of smaller, more focused files. This improves maintainability while preserving the original functionality and API.