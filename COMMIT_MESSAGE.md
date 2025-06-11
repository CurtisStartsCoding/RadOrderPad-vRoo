Implement dual credit billing system for radiology organizations

BREAKING CHANGE: Remove post-paid billing in favor of unified pre-paid credit model

## Summary
- Radiology organizations now use dual credits (basic/advanced) instead of post-paid billing
- Credits are automatically consumed when radiology receives orders based on imaging type
- All organizations now operate on pre-paid credits for flexibility and discount capability

## Database Changes
- Add basic_credit_balance and advanced_credit_balance columns to organizations table
- Add credit_type column to credit_usage_logs table
- Migration script: scripts/run-dual-credit-migration-standalone.js

## Implementation Details
- Enhanced credit burning supports organization-specific credit types
- Advanced imaging (MRI, CT, PET, Nuclear) consumes advanced credits
- Standard imaging consumes basic credits
- Referring organizations continue using single credit type

## API Changes
- GET /api/billing now returns dual credit balances for radiology orgs
- GET /api/billing/credit-balance returns type-specific balances
- Credit consumption happens automatically on send-to-radiology

## Files Changed
New:
- src/services/billing/credit/burn-credit-enhanced.ts
- src/services/order/admin/handlers/send-to-radiology-enhanced.ts
- migrations/implement-dual-credit-system.sql
- tests/test-dual-credit-system.js
- final-documentation/backend/dual-credit-billing-system.md

Modified:
- src/services/billing/index.ts
- src/services/billing/types.ts
- src/services/billing/get-billing-overview.service.ts
- src/services/billing/get-credit-balance.service.ts

Removed:
- src/services/billing/usage/reportUsage.ts (and related post-paid files)

## Testing
Run: node tests/test-dual-credit-system.js

## Migration Status
✅ Successfully run on production (June 11, 2025)
- 7 radiology organizations updated with initial credits