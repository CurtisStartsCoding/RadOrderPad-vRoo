# Billing Service Refactoring

**Date:** 2025-04-14
**Author:** Roo

## Overview

This document describes the refactoring of the `billing.service.ts` file into a more modular structure following the extreme refactoring principles. The original file was 167 lines long and has been split into multiple smaller, focused files.

## Original Structure

The original `billing.service.ts` file contained:

- An `InsufficientCreditsError` class
- A `BillingService` class with three static methods:
  - `burnCredit`: Records credit usage for a validation action
  - `hasCredits`: Checks if an organization has sufficient credits
  - `createStripeCustomerForOrg`: Creates a Stripe customer for an organization

## New Structure

The refactored code is organized into the following directory structure:

```
src/services/billing/
├── errors/
│   ├── insufficient-credits.error.ts  (10 lines)
│   └── index.ts                       (1 line)
├── credit/
│   ├── burn-credit.ts                 (85 lines)
│   ├── has-credits.ts                 (27 lines)
│   └── index.ts                       (2 lines)
├── stripe/
│   ├── create-customer.ts             (37 lines)
│   └── index.ts                       (1 line)
├── types.ts                           (24 lines)
└── index.ts                           (52 lines)
```

Total: 8 files, 239 lines (including comments and whitespace)

## Implementation Details

### 1. Types

Created a `types.ts` file to define shared types used across the billing service:
- `CreditActionType`: Type for credit action types
- `BurnCreditParams`: Interface for parameters to burn a credit
- `CreateStripeCustomerParams`: Interface for parameters to create a Stripe customer

### 2. Error Handling

Extracted the `InsufficientCreditsError` class to its own file in the `errors` directory.

### 3. Credit Management

Split credit-related functionality into separate files in the `credit` directory:
- `burn-credit.ts`: Contains the logic for burning credits
- `has-credits.ts`: Contains the logic for checking if an organization has credits

### 4. Stripe Integration

Extracted Stripe-related functionality to the `stripe` directory:
- `create-customer.ts`: Contains the logic for creating a Stripe customer

### 5. Main Service

Created a new `index.ts` file that:
- Imports functionality from the subdirectories
- Provides a `BillingService` class with static methods that delegate to the imported functions
- Exports types and errors for external use

## Benefits

1. **Improved Maintainability**: Each file has a single responsibility, making it easier to understand and maintain.
2. **Better Organization**: Related functionality is grouped together in dedicated directories.
3. **Easier Testing**: Smaller, focused modules are easier to test in isolation.
4. **Improved Code Navigation**: Developers can quickly find the specific functionality they need.
5. **Reduced Cognitive Load**: Developers only need to understand a small part of the codebase at a time.

## Test Results

All tests continue to pass with the refactored code, confirming that the functionality has been preserved.

## Next Steps

Continue with the refactoring of other files as outlined in the refactoring plan.