# Admin Order Service Refactoring

**Date:** 2025-04-14
**Author:** Roo
**Status:** Completed

## Overview

This document outlines the refactoring of the `services/order/admin` directory to improve maintainability, readability, and testability. The refactoring follows the Single Responsibility Principle, breaking down larger files into smaller, more focused modules.

## Original Structure

The original structure had several large files:

```
src/services/order/admin/
├── clinical-record-manager.ts
├── emr-parser.ts                (70 lines)
├── index.ts                     (217 lines)
├── insurance-manager.ts
├── order-status-manager.ts
├── patient-manager.ts           (130 lines)
├── test-emr-parser.js
├── types.ts
├── validation.ts
└── __tests__/
    └── emr-parser.test.ts
```

The main issues were:
1. The `index.ts` file was too large (217 lines) and contained multiple responsibilities
2. The `patient-manager.ts` file was approaching the 150-line guideline (130 lines)

## New Structure

The refactored code is organized into a more modular directory structure:

```
src/services/order/admin/
├── clinical-record-manager.ts
├── emr-parser.ts
├── handlers/
│   ├── index.ts                 (13 lines)
│   ├── paste-summary.ts         (45 lines)
│   ├── paste-supplemental.ts    (31 lines)
│   ├── send-to-radiology.ts     (47 lines)
│   ├── update-insurance.ts      (33 lines)
│   └── update-patient.ts        (33 lines)
├── index.ts                     (62 lines)
├── insurance-manager.ts
├── order-status-manager.ts
├── patient/
│   ├── index.ts                 (7 lines)
│   ├── update-from-emr.ts       (59 lines)
│   └── update-info.ts           (58 lines)
├── test-emr-parser.js
├── types.ts
├── utils/
│   └── transaction.ts           (31 lines)
├── validation.ts
└── __tests__/
    └── emr-parser.test.ts
```

## File Descriptions

### Handlers Directory

1. **paste-summary.ts**
   - Handles processing of pasted EMR summary text
   - Uses transaction management for database operations
   - Coordinates parsing, patient updates, and insurance updates

2. **paste-supplemental.ts**
   - Handles processing of pasted supplemental documents
   - Verifies order status and saves documents

3. **update-patient.ts**
   - Handles updating patient information
   - Verifies order status and updates patient data

4. **update-insurance.ts**
   - Handles updating insurance information
   - Verifies order status and updates insurance data

5. **send-to-radiology.ts**
   - Handles sending orders to radiology
   - Uses transaction management for database operations
   - Validates required patient and insurance information

6. **index.ts**
   - Exports all handler functions

### Patient Directory

1. **update-info.ts**
   - Handles updating patient information in the database
   - Dynamically builds SQL queries based on provided fields

2. **update-from-emr.ts**
   - Handles updating patient information from parsed EMR data
   - Selectively updates only the fields present in the parsed data

3. **index.ts**
   - Exports all patient-related functions

### Utils Directory

1. **transaction.ts**
   - Provides a utility function for transaction management
   - Handles BEGIN, COMMIT, and ROLLBACK operations
   - Ensures proper client release

### Main Index File

The main `index.ts` file has been reduced from 217 lines to 62 lines. It now:
- Imports handler functions from the handlers directory
- Provides a thin wrapper around these functions
- Maintains backward compatibility with the original API

## Implementation Details

### Transaction Management

Transaction management has been extracted to a reusable utility function:

```typescript
export async function withTransaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await getPhiDbClient();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction error:', error);
    throw error;
  } finally {
    client.release();
  }
}
```

This function is used in handlers that require transaction support, such as `paste-summary.ts` and `send-to-radiology.ts`.

### Handler Pattern

Each handler follows a consistent pattern:
1. Verify order status
2. Perform the required operations
3. Return a standardized result object

For example, the `update-patient.ts` handler:

```typescript
export async function updatePatientInfo(
  orderId: number, 
  patientData: PatientUpdateData, 
  userId: number
): Promise<PatientUpdateResult> {
  try {
    // 1. Verify order status
    const order = await clinicalRecordManager.verifyOrderStatus(orderId);
    
    // 2. Update patient information
    const patientId = await patientManager.updatePatientInfo(order.patient_id, patientData);
    
    // 3. Return standardized result
    return {
      success: true,
      orderId,
      patientId,
      message: 'Patient information updated successfully'
    };
  } catch (error) {
    console.error('Error in updatePatientInfo:', error);
    throw error;
  }
}
```

## Benefits

1. **Improved Maintainability**: Each file now has a clear, single responsibility, making it easier to understand and maintain.

2. **Better Organization**: Related functionality is grouped together in logical directories.

3. **Reduced Complexity**: Each file is significantly smaller than the original, with most files under 60 lines.

4. **Easier Testing**: Each component can be tested independently, making it easier to write unit tests.

5. **Better Collaboration**: Multiple developers can work on different parts of the codebase without conflicts.

6. **Reduced Cognitive Load**: Developers only need to understand a small part of the codebase at a time.

## Migration

The refactoring was implemented with backward compatibility in mind:

1. The original API is preserved through the main `index.ts` file.
2. The original files are still referenced until the refactoring is complete.
3. The new structure follows the same patterns used in other refactored services.

## Conclusion

The refactoring of the Admin Order Service has successfully broken down the large files into smaller, more focused modules. Each file now has a clear responsibility, and the overall structure is more maintainable and testable. The refactoring follows the same patterns used in other parts of the codebase, ensuring consistency across the application.