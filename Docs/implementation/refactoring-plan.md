# Refactoring Plan for Large Files

**Date:** 2025-04-13 (Updated: 2025-04-14 07:56 AM EST)
**Author:** Roo
**Status:** Completed

## Overview

This document outlines a plan to refactor large files in the codebase to improve maintainability and adhere to the 150-line guideline. The refactoring will focus on breaking down large files into smaller, more focused modules organized in a logical directory structure.

## Files to Refactor

Based on the file length report, the following files exceed the 150-line guideline and should be refactored:

1. [DONE] `services/radiology-order.service.ts` (647 lines) - refactored into query/services/handlers layers
2. [DONE] `services/admin-order.service.ts` (625 lines) - refactored into handlers/utils/patient layers
3. [DONE] `services/notification.service.ts` (534 lines) - refactored into email-sender/services/manager layers
4. [DONE] `services/connection.service.ts` (437 lines) - refactored into queries/services layers
5. [DONE] `services/location.service.ts` (366 lines) - refactored into queries/services layers
6. [DONE] `controllers/location.controller.ts` (322 lines) - refactored into organization/user subdirectories
7. [DONE] `controllers/radiology-order.controller.ts` (303 lines) - refactored into specialized controller files
8. [DONE] `utils/llm-client.ts` (278 lines) - refactored into client/providers structure
9. [DONE] `services/fileUpload.service.ts` (273 lines) - refactored into specialized upload services
10. [DONE] `utils/database-context.ts` (269 lines) - refactored into database utility modules
11. [DONE] `utils/response-processing.ts` (264 lines) - refactored into response processing modules
12. [DONE] `controllers/admin-order.controller.ts` (247 lines) - refactored into specialized controllers
13. [DONE] `controllers/connection.controller.ts` (249 lines) - refactored into specialized controllers
14. [DONE] `services/auth.service.ts` (213 lines) - refactored into token/user/organization layers
15. [DONE] `utils/text-processing.ts` (210 lines) - refactored into specialized text processing modules
16. [DONE] `services/order/validation-request.ts` (197 lines) - refactored into validation module
17. [DONE] `services/validation.service.ts` (188 lines) - refactored into types/run-validation/logging/llm-logging modules
18. [DONE] `services/billing.service.ts` (167 lines) - refactored into credit/stripe modules
19. [DONE] `controllers/uploads.controller.ts` (160 lines)
20. [DONE] `controllers/order-management.controller.ts` (158 lines)
21. [DONE] `services/order/finalize-order.ts` (157 lines)
22. [DONE] `models/Order.ts` (142 lines) - refactored into domain-specific type files
23. [DONE] `services/order/admin/types.ts` (137 lines) - refactored into domain-specific type files
24. [DONE] `services/order/admin/patient-manager.ts` (127 lines) - extracted common query building logic
25. [DONE] `services/connection/queries/connection-queries.ts` (124 lines) - kept as is (SQL queries best organized by domain)
26. [DONE] `config/db.ts` (122 lines) - created generic database utility functions
27. [DONE] `controllers/auth.controller.ts` (112 lines) - extracted common error handling logic

## Additional Files Refactored

In addition to the files listed above, we've also refactored the following files that had multiple functions:

1. [DONE] `utils/text-processing/code-extractor.ts` (5 functions, 89 lines) - refactored into code-extractor/ directory with:
   - icd10/extract-icd10-codes.ts
   - cpt/extract-cpt-codes.ts
   - common/extract-medical-codes.ts
   - common/is-medical-code.ts
   - common/get-medical-code-category.ts
   - index.ts

2. [DONE] `services/order/admin/validation.ts` (4 functions, 86 lines) - refactored into validation/ directory with:
   - patient/get-patient-for-validation.ts
   - patient/validate-patient-fields.ts
   - insurance/get-primary-insurance.ts
   - insurance/validate-insurance-fields.ts
   - types.ts
   - index.ts

3. [DONE] `middleware/auth.middleware.ts` (3 functions, 90 lines) - refactored into auth/ directory with:
   - authenticate-jwt.ts
   - authorize-role.ts
   - authorize-organization.ts
   - types.ts
   - index.ts

4. [DONE] `services/order/admin/order-status-manager.ts` (3 functions, 89 lines) - refactored into order-status-manager/ directory with:
   - update-order-status.ts
   - validate-patient-data.ts
   - validate-insurance-data.ts
   - index.ts

5. [DONE] `utils/text-processing/keyword-extractor.ts` (3 functions, 113 lines) - refactored into keyword-extractor/ directory with:
   - extract-medical-keywords.ts
   - extract-categorized-medical-keywords.ts
   - extract-keywords-by-category.ts
   - index.ts

6. [DONE] `services/notification/services/connection/approval.ts` (2 functions, 48 lines) - refactored into approval/ directory with:
   - prepare-connection-approval-data.ts
   - send-connection-approved.ts
   - index.ts

7. [DONE] `services/notification/services/connection/rejection.ts` (2 functions, 48 lines) - refactored into rejection/ directory with:
   - prepare-connection-rejection-data.ts
   - send-connection-rejected.ts
   - index.ts

8. [DONE] `services/notification/services/connection/termination.ts` (2 functions, 57 lines) - refactored into termination/ directory with:
   - prepare-connection-termination-data.ts
   - send-connection-terminated.ts
   - index.ts

9. [DONE] `services/order/validation/attempt-tracking.ts` (2 functions, 60 lines) - refactored into attempt-tracking/ directory with:
   - get-next-attempt-number.ts
   - log-validation-attempt.ts
   - index.ts

10. [DONE] `services/connection/services/request-connection-helpers.ts` (2 functions, 79 lines) - refactored into request-connection-helpers/ directory with:
    - update-existing-relationship.ts
    - create-new-relationship.ts
    - index.ts

11. [DONE] `services/order/admin/utils/query-builder.ts` (2 functions, 137 lines) - refactored into query-builder/ directory with:
    - types.ts
    - build-update-query.ts
    - build-update-query-from-pairs.ts
    - index.ts

12. [DONE] `services/order/admin/patient-manager.ts` (2 functions, 91 lines) - refactored into patient-manager/ directory with:
    - update-patient-info.ts
    - update-patient-from-emr.ts
    - index.ts

13. [DONE] `utils/response/normalizer.ts` (2 functions, 89 lines) - refactored into normalizer/ directory with:
    - normalize-response-fields.ts
    - normalize-code-array.ts
    - index.ts

## Future Refactoring Opportunities

Based on the multi-function-report.csv and multi-function-report-final.txt files, the following files could be candidates for future refactoring:

### Files with 3 or More Functions

1. `services/location/services/user-location-management.ts` (3 functions, 38 lines)
2. `services/notification/services/connection/request.ts` (3 functions, 54 lines)
3. `services/order/admin/clinical-record-manager.ts` (3 functions, 79 lines)
4. `services/order/radiology/order-export.service.ts` (3 functions, 64 lines)

### Files with 2 Functions

1. `controllers/connection/list.controller.ts` (2 functions, 51 lines)
2. `controllers/connection/validation-utils.ts` (2 functions, 49 lines)
3. `services/notification/email-sender/test-mode.ts` (2 functions, 34 lines)
4. [DONE] `services/order/radiology/export/csv-export.ts` (2 functions, 90 lines) - refactored into csv-export/ directory with:
   - generate-csv-export.ts
   - index.ts
5. `services/order/radiology/query/order-builder/metadata-filters.ts` (2 functions, 50 lines)
6. `utils/response/validator.ts` (2 functions, 43 lines)

## Refactoring Approach

### 1. Directory Structure

Create a more modular directory structure to organize related files:

```
src/
├── controllers/
│   ├── admin/
│   │   ├── order.controller.ts
│   │   └── ...
│   ├── radiology/
│   │   ├── order.controller.ts
│   │   └── ...
│   └── ...
├── services/
│   ├── order/
│   │   ├── radiology/
│   │   │   ├── incoming-orders.service.ts
│   │   │   ├── order-details.service.ts
│   │   │   ├── order-export.service.ts
│   │   │   ├── order-status.service.ts
│   │   │   ├── information-request.service.ts
│   │   │   └── index.ts
│   │   ├── admin/
│   │   │   └── ...
│   │   └── ...
│   ├── upload/
│   │   ├── s3-client.service.ts
│   │   ├── presigned-url.service.ts
│   │   ├── document-upload.service.ts
│   │   ├── signature-processing.service.ts
│   │   └── index.ts
│   ├── notification/
│   │   ├── email-templates/
│   │   │   ├── user-invitation.template.ts
│   │   │   ├── password-reset.template.ts
│   │   │   └── ...
│   │   ├── email.service.ts
│   │   ├── notification-types.ts
│   │   └── index.ts
│   └── ...
├── utils/
│   ├── llm/
│   │   ├── client.ts
│   │   ├── providers/
│   │   │   ├── anthropic.ts
│   │   │   ├── grok.ts
│   │   │   ├── openai.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── database/
│   │   ├── context.ts
│   │   ├── query-builders.ts
│   │   └── index.ts
│   └── ...
└── ...
```

### 2. File Splitting Strategy

#### RadiologyOrderService (647 lines)

Split into multiple service files based on functionality:

1. `services/order/radiology/incoming-orders.service.ts`
   - Contains `getIncomingOrders` method and related helpers

2. `services/order/radiology/order-details.service.ts`
   - Contains `getOrderDetails` method and related helpers

3. `services/order/radiology/order-export.service.ts`
   - Contains `exportOrder` method and related helpers

4. `services/order/radiology/order-status.service.ts`
   - Contains `updateOrderStatus` method and related helpers

5. `services/order/radiology/information-request.service.ts`
   - Contains `requestInformation` method and related helpers

6. `services/order/radiology/index.ts`
   - Re-exports all functionality to maintain backward compatibility

#### FileUploadService (273 lines)

Split into multiple service files based on functionality:

1. `services/upload/s3-client.service.ts`
   - Contains S3 client initialization and configuration

2. `services/upload/presigned-url.service.ts`
   - Contains `getUploadUrl` method and related helpers

3. `services/upload/document-upload.service.ts`
   - Contains `confirmUpload` method and related helpers

4. `services/upload/signature-processing.service.ts`
   - Contains `processSignature` method and related helpers

5. `services/upload/index.ts`
   - Re-exports all functionality to maintain backward compatibility

#### NotificationService (534 lines)

Split into multiple service files based on functionality:

1. `services/notification/email-templates/`
   - Separate files for each email template

2. `services/notification/email.service.ts`
   - Core email sending functionality

3. `services/notification/notification-types.ts`
   - Type definitions and interfaces

4. `services/notification/index.ts`
   - Re-exports all functionality to maintain backward compatibility

### 3. Implementation Strategy

For each file to be refactored:

1. Create the necessary directory structure
2. Extract interfaces and types to separate files
3. Extract each method and its related helpers to a separate file
4. Create an index.ts file to re-export all functionality
5. Update imports in other files to use the new structure
6. Run tests to ensure functionality is preserved

## Example: Refactoring RadiologyOrderService

### Before

```typescript
// services/radiology-order.service.ts (647 lines)
class RadiologyOrderService {
  async getIncomingOrders(orgId: number, filters: OrderFilters = {}): Promise<IncomingOrdersResult> {
    // 100+ lines of code
  }

  async getOrderDetails(orderId: number, orgId: number): Promise<OrderDetails> {
    // 100+ lines of code
  }

  async exportOrder(orderId: number, format: string, orgId: number): Promise<any> {
    // 100+ lines of code
  }

  async updateOrderStatus(orderId: number, newStatus: string, orgId: number): Promise<OrderStatusUpdateResult> {
    // 100+ lines of code
  }

  async requestInformation(orderId: number, requestText: string, orgId: number): Promise<InformationRequestResult> {
    // 100+ lines of code
  }
}
```

### After

```typescript
// services/order/radiology/incoming-orders.service.ts
export async function getIncomingOrders(orgId: number, filters: OrderFilters = {}): Promise<IncomingOrdersResult> {
  // 100+ lines of code
}

// services/order/radiology/order-details.service.ts
export async function getOrderDetails(orderId: number, orgId: number): Promise<OrderDetails> {
  // 100+ lines of code
}

// services/order/radiology/order-export.service.ts
export async function exportOrder(orderId: number, format: string, orgId: number): Promise<any> {
  // 100+ lines of code
}

// services/order/radiology/order-status.service.ts
export async function updateOrderStatus(orderId: number, newStatus: string, orgId: number): Promise<OrderStatusUpdateResult> {
  // 100+ lines of code
}

// services/order/radiology/information-request.service.ts
export async function requestInformation(orderId: number, requestText: string, orgId: number): Promise<InformationRequestResult> {
  // 100+ lines of code
}

// services/order/radiology/index.ts
import { getIncomingOrders } from './incoming-orders.service';
import { getOrderDetails } from './order-details.service';
import { exportOrder } from './order-export.service';
import { updateOrderStatus } from './order-status.service';
import { requestInformation } from './information-request.service';

export class RadiologyOrderService {
  async getIncomingOrders(orgId: number, filters: OrderFilters = {}): Promise<IncomingOrdersResult> {
    return getIncomingOrders(orgId, filters);
  }

  async getOrderDetails(orderId: number, orgId: number): Promise<OrderDetails> {
    return getOrderDetails(orderId, orgId);
  }

  async exportOrder(orderId: number, format: string, orgId: number): Promise<any> {
    return exportOrder(orderId, format, orgId);
  }

  async updateOrderStatus(orderId: number, newStatus: string, orgId: number): Promise<OrderStatusUpdateResult> {
    return updateOrderStatus(orderId, newStatus, orgId);
  }

  async requestInformation(orderId: number, requestText: string, orgId: number): Promise<InformationRequestResult> {
    return requestInformation(orderId, requestText, orgId);
  }
}

export default new RadiologyOrderService();
```

## Benefits

1. **Improved Maintainability**: Smaller files are easier to understand and maintain
2. **Better Organization**: Related functionality is grouped together
3. **Easier Testing**: Smaller, focused modules are easier to test
4. **Improved Code Navigation**: Developers can quickly find the code they need
5. **Better Collaboration**: Multiple developers can work on different parts of the codebase without conflicts
6. **Reduced Cognitive Load**: Developers only need to understand a small part of the codebase at a time

## Conclusion

All files have been successfully refactored, with each file now under the 150-line guideline. The refactoring has improved maintainability by breaking down large files into smaller, more focused modules organized in a logical directory structure.

The next step is to create comprehensive documentation for all refactored modules to ensure that developers can easily understand the new structure and how to work with it.

Additionally, we've identified several more files with multiple functions that could be candidates for future refactoring. These files are listed in the "Future Refactoring Opportunities" section above.