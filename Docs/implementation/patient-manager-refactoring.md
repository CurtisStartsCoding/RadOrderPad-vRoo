# Patient Manager Refactoring

**Date:** 2025-04-14
**Author:** Roo
**Status:** Completed

## Overview

This document details the refactoring of the `services/order/admin/patient-manager.ts` file, which was identified as having multiple functions (2 functions in 91 lines). The refactoring follows the extreme refactoring principles established for the project.

## Original Structure

The original `patient-manager.ts` file contained:

1. Two functions:
   - `updatePatientInfo`: Updates patient information
   - `updatePatientFromEmr`: Updates patient information from parsed EMR data

2. No clear separation of concerns between different patient update operations

## New Structure

The refactored code is organized into a directory structure that separates concerns:

```
src/services/order/admin/patient-manager/
├── update-patient-info.ts      (34 lines)
├── update-patient-from-emr.ts  (34 lines)
└── index.ts                    (15 lines)
```

## Implementation Details

### Update Patient Info (update-patient-info.ts)

```typescript
import { queryPhiDb } from '../../../../config/db';
import { PatientUpdateData } from '../types';
import { buildUpdateQuery } from '../utils';

/**
 * Update patient information
 * @param patientId Patient ID
 * @param patientData Patient data
 * @returns Promise with result
 */
export async function updatePatientInfo(
  patientId: number,
  patientData: PatientUpdateData
): Promise<number> {
  // Map patientData fields to database columns
  const fieldMap: { [key: string]: string } = {
    firstName: 'first_name',
    lastName: 'last_name',
    middleName: 'middle_name',
    dateOfBirth: 'date_of_birth',
    gender: 'gender',
    addressLine1: 'address_line1',
    addressLine2: 'address_line2',
    city: 'city',
    state: 'state',
    zipCode: 'zip_code',
    phoneNumber: 'phone_number',
    email: 'email',
    mrn: 'mrn'
  };
  
  // Build the update query using the utility function
  const { query, values } = buildUpdateQuery(
    'patients',
    patientData,
    'id',
    patientId,
    fieldMap,
    true,
    ['id']
  );
  
  const result = await queryPhiDb(query, values);
  return result.rows[0].id;
}
```

### Update Patient From EMR (update-patient-from-emr.ts)

```typescript
import { queryPhiDb } from '../../../../config/db';
import { buildUpdateQuery } from '../utils';

/**
 * Update patient information from parsed EMR data
 * @param patientId Patient ID
 * @param parsedPatientInfo Parsed patient information
 * @returns Promise with result
 */
export async function updatePatientFromEmr(
  patientId: number,
  parsedPatientInfo: any
): Promise<void> {
  if (!parsedPatientInfo || Object.keys(parsedPatientInfo).length === 0) {
    return;
  }
  
  // Map EMR fields to database columns
  const fieldMap: { [key: string]: string } = {
    address: 'address_line1',
    city: 'city',
    state: 'state',
    zipCode: 'zip_code',
    phone: 'phone_number',
    email: 'email'
  };
  
  // Build the update query using the utility function
  const { query, values } = buildUpdateQuery(
    'patients',
    parsedPatientInfo,
    'id',
    patientId,
    fieldMap,
    true,
    []
  );
  
  // Only execute the query if there are fields to update
  if (values.length > 1) { // values includes patientId, so length > 1 means we have fields to update
    await queryPhiDb(query, values);
  }
}
```

### Main Entry Point (index.ts)

```typescript
/**
 * Patient manager functions
 */

// Import functions
import { updatePatientInfo } from './update-patient-info';
import { updatePatientFromEmr } from './update-patient-from-emr';

// Re-export functions
export { updatePatientInfo };
export { updatePatientFromEmr };

// Default export for backward compatibility
export default {
  updatePatientInfo,
  updatePatientFromEmr
};
```

## Benefits

1. **Improved Maintainability**: Each file has a single responsibility, making it easier to understand and modify.
2. **Better Organization**: Related functionality is grouped together, making it easier to navigate the codebase.
3. **Enhanced Testability**: Smaller, focused modules are easier to test in isolation.
4. **Reduced Cognitive Load**: Developers only need to understand a small part of the codebase at a time.
5. **Backward Compatibility**: The original API is preserved through the index.ts file.

## Conclusion

The refactoring of the Patient Manager module has successfully transformed a file with multiple functions into a set of smaller, more focused files. This improves maintainability while preserving the original functionality and API.