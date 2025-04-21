# Extreme Refactoring Reference Guide

**Date:** 2025-04-14
**Author:** Roo

## Purpose

This document provides a concise reference for aggressively refactoring the remaining files listed in `docs/implementation/refactoring-plan.md`. The goal is to break down large files into extremely small, hyper-focused components.

## Reference Examples

- **order-query-builder.ts** (108 lines) → **10 files**:
  ```
  src/services/order/radiology/query/order-builder/
  ├── base-query.ts              (26 lines)
  ├── status-filter.ts           (29 lines)
  ├── organization-filter.ts     (23 lines)
  ├── metadata-filters.ts        (45 lines)
  ├── date-filters.ts            (31 lines)
  ├── validation-filter.ts       (24 lines)
  ├── sorting.ts                 (35 lines)
  ├── pagination.ts              (27 lines)
  ├── filter-orchestrator.ts     (34 lines)
  └── index.ts                   (43 lines)
  ```

- **admin/index.ts** (217 lines) → **11 files**:
  ```
  src/services/order/admin/
  ├── handlers/
  │   ├── paste-summary.ts         (45 lines)
  │   ├── paste-supplemental.ts    (31 lines)
  │   ├── update-patient.ts        (33 lines)
  │   ├── update-insurance.ts      (33 lines)
  │   ├── send-to-radiology.ts     (47 lines)
  │   └── index.ts                 (13 lines)
  ├── patient/
  │   ├── update-info.ts           (58 lines)
  │   ├── update-from-emr.ts       (59 lines)
  │   └── index.ts                 (7 lines)
  ├── utils/
  │   └── transaction.ts           (31 lines)
  └── index.ts                     (62 lines)
  ```

## Extreme Refactoring Principles

1. **Hyper-Focused Files**: Each file should do exactly ONE thing
2. **Tiny Files**: Target 30-60 lines per file, never exceed 100 lines
3. **Deep Directory Structure**: Create nested directories to organize related functionality
4. **Function Extraction**: Break down large functions into multiple smaller functions
5. **Aggressive Splitting**: If a file handles multiple concerns, split it even if it seems excessive

## Refactoring Process

1. **Analyze Function Boundaries**
   - Identify every distinct operation or logical block
   - Look for natural boundaries between different responsibilities
   - Consider each if/else branch as a potential separate function

2. **Create Granular Directory Structure**
   - Main directory for the service/utility
   - Subdirectories for each major category of functionality
   - Further subdirectories for specialized concerns
   - Example: `services/notification/channels/email/templates/`

3. **Extract to Extreme Levels**
   - Move each function to its own file
   - Split large functions into multiple smaller functions
   - Extract repeated patterns into utility functions
   - Move types and interfaces to a separate types.ts file
   - Create index.ts files at each directory level to simplify imports

4. **Orchestrate Through Composition**
   - Create orchestrator files that compose smaller functions
   - Use dependency injection to combine functionality
   - Keep orchestration logic separate from implementation details

5. **Test Rigorously**
   - Run tests after each extraction
   - Fix any issues immediately
   - Ensure backward compatibility

## Example: Extreme Function Extraction

**Before:**
```typescript
// One large function with multiple responsibilities
function processOrder(order) {
  // Validate order
  if (!order.id) throw new Error('Missing order ID');
  if (!order.items || order.items.length === 0) throw new Error('No items in order');
  
  // Calculate totals
  let subtotal = 0;
  for (const item of order.items) {
    subtotal += item.price * item.quantity;
  }
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  // Apply discounts
  let discount = 0;
  if (order.couponCode === 'SAVE10') {
    discount = total * 0.1;
  }
  
  // Format result
  return {
    orderId: order.id,
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    discount: discount.toFixed(2),
    total: (total - discount).toFixed(2)
  };
}
```

**After:**
```typescript
// validation/validate-order-id.ts
export function validateOrderId(orderId) {
  if (!orderId) throw new Error('Missing order ID');
  return true;
}

// validation/validate-order-items.ts
export function validateOrderItems(items) {
  if (!items || items.length === 0) throw new Error('No items in order');
  return true;
}

// calculation/calculate-subtotal.ts
export function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// calculation/calculate-tax.ts
export function calculateTax(subtotal) {
  return subtotal * 0.08;
}

// discounts/apply-coupon-discount.ts
export function applyCouponDiscount(total, couponCode) {
  if (couponCode === 'SAVE10') {
    return total * 0.1;
  }
  return 0;
}

// formatting/format-currency.ts
export function formatCurrency(value) {
  return value.toFixed(2);
}

// formatting/format-order-result.ts
export function formatOrderResult(orderId, subtotal, tax, discount, total) {
  return {
    orderId,
    subtotal: formatCurrency(subtotal),
    tax: formatCurrency(tax),
    discount: formatCurrency(discount),
    total: formatCurrency(total)
  };
}

// process-order.ts
import { validateOrderId } from './validation/validate-order-id';
import { validateOrderItems } from './validation/validate-order-items';
import { calculateSubtotal } from './calculation/calculate-subtotal';
import { calculateTax } from './calculation/calculate-tax';
import { applyCouponDiscount } from './discounts/apply-coupon-discount';
import { formatOrderResult } from './formatting/format-order-result';

export function processOrder(order) {
  // Validate
  validateOrderId(order.id);
  validateOrderItems(order.items);
  
  // Calculate
  const subtotal = calculateSubtotal(order.items);
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;
  
  // Apply discounts
  const discount = applyCouponDiscount(total, order.couponCode);
  
  // Format and return
  return formatOrderResult(
    order.id,
    subtotal,
    tax,
    discount,
    total - discount
  );
}
```

## Testing

After each refactoring:

```
cd tests/batch
.\run-all-tests.bat
```

Ensure all tests pass before considering the refactoring complete.

## Documentation Requirements

For each completed refactoring:

1. Create a documentation file (e.g., `docs/implementation/notification-service-refactoring.md`) that includes:
   - Overview of the refactoring
   - Original structure
   - New structure with file sizes
   - Implementation details
   - Benefits
   - Test results

2. Update `docs/implementation/refactoring-summary.md`:
   - Add the refactored file to the "Completed Refactorings" section
   - Update the count of completed refactorings
   - Add a reference to the documentation file

3. Update `docs/implementation/refactoring-plan.md`:
   - Mark the file as [DONE]

## Next Steps

Continue with item #3 in the refactoring plan and work through the list in order.