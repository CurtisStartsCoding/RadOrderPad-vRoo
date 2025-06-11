# Dual Credit Billing System

**Date:** June 11, 2025  
**Author:** System Documentation

## Overview

RadOrderPad has transitioned from a hybrid billing model to a unified dual-credit system. All organizations now operate on a pre-paid credit model, with radiology organizations using two types of credits based on imaging complexity.

## Credit Types

### Referring Organizations
- **Single Credit Type**: Uses `credit_balance` field
- **Consumption**: 1 credit per order submitted to radiology
- **Action Type**: `order_submitted`

### Radiology Organizations  
- **Dual Credit Types**:
  - **Basic Credits** (`basic_credit_balance`): Standard imaging (X-ray, Ultrasound, etc.)
  - **Advanced Credits** (`advanced_credit_balance`): Advanced imaging (MRI, CT, PET, Nuclear)
- **Consumption**: 1 credit per order received, type determined by imaging modality
- **Action Type**: `order_received`

## Implementation Details

### Database Schema Changes
```sql
-- Added to organizations table
basic_credit_balance INTEGER DEFAULT 0
advanced_credit_balance INTEGER DEFAULT 0

-- Added to credit_usage_logs table  
credit_type TEXT DEFAULT 'referring_credit' 
CHECK (credit_type IN ('referring_credit', 'radiology_basic', 'radiology_advanced'))
```

### Key Components

#### 1. Enhanced Credit Burning (`burn-credit-enhanced.ts`)
- Automatically detects organization type
- Determines credit type for radiology organizations using `isAdvancedImaging()`
- Tracks credit type in `credit_usage_logs`
- Maintains transaction integrity with rollback support

#### 2. Send to Radiology Handler (`send-to-radiology-enhanced.ts`)
- Burns credit from referring organization when sending
- Burns appropriate credit from radiology organization when receiving
- Queries order details (modality, CPT codes) for credit type determination
- Handles failures gracefully without blocking order flow

#### 3. Billing APIs
- `getBillingOverview`: Returns dual credit balances for radiology organizations
- `getCreditBalance`: Returns appropriate balance(s) based on organization type

## Credit Type Determination

Advanced imaging is determined by:
- **Modality**: MRI, CT, PET, NUCLEAR
- **CPT Codes**: Specific advanced imaging codes (existing logic reused)

## Migration Notes

- All existing radiology organizations received 100 basic and 100 advanced credits
- Post-paid billing code has been completely removed
- No backward compatibility needed (pre-production system)

## Deployment Instructions

1. **Run Database Migration**:
   ```bash
   # On the server
   node scripts/run-dual-credit-migration-standalone.js
   ```

2. **Verify Migration**:
   - Check organizations table has new columns
   - Verify radiology organizations have initial credits
   - Confirm credit_usage_logs has credit_type column

3. **Test the System**:
   ```bash
   # Run test suite
   node tests/test-dual-credit-system.js
   # or
   ./tests/run-dual-credit-tests.sh
   ```

## Files Changed

### New Files
- `/src/services/billing/credit/burn-credit-enhanced.ts`
- `/src/services/order/admin/handlers/send-to-radiology-enhanced.ts`
- `/migrations/implement-dual-credit-system.sql`
- `/scripts/run-dual-credit-migration-standalone.js`
- `/tests/test-dual-credit-system.js`

### Modified Files
- `/src/services/billing/index.ts` - Removed post-paid billing exports
- `/src/services/billing/usage/index.ts` - Removed post-paid exports
- `/src/services/billing/credit/index.ts` - Added enhanced credit exports
- `/src/services/billing/types.ts` - Added ORDER_RECEIVED action type
- `/src/services/billing/get-billing-overview.service.ts` - Added dual credit fields
- `/src/services/billing/get-credit-balance.service.ts` - Added dual credit support
- `/src/services/order/admin/handlers/index.ts` - Use enhanced send-to-radiology

### Removed Files
- `/src/services/billing/usage/reportUsage.ts`
- `/src/services/billing/usage/orderQuery.ts`
- `/src/services/billing/usage/billingReport.ts`
- `/src/services/billing/usage/types.ts`

## API Response Changes

### Billing Overview (Radiology Organizations)
```json
{
  "organizationType": "radiology_group",
  "basicCreditBalance": 100,
  "advancedCreditBalance": 100,
  // ... other fields
}
```

### Credit Balance (Radiology Organizations)
```json
{
  "organizationType": "radiology_group", 
  "basicCreditBalance": 100,
  "advancedCreditBalance": 100
}
```