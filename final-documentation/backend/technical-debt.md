# Technical Debt Tracker

This document tracks technical debt items that should be addressed in future refactoring efforts.

## API Response Format Inconsistency

**Date Identified:** 2025-06-16  
**Priority:** Medium  
**Effort:** Low  

### Issue
Different API endpoints return data in inconsistent wrapper formats:

1. **Connections endpoint** (`GET /api/connections`):
   ```json
   {
     "connections": [...]
   }
   ```

2. **Locations endpoint** (`GET /api/organizations/:id/locations`):
   ```json
   {
     "success": true,
     "data": [...]
   }
   ```

3. **Orders endpoint** (`GET /api/orders`):
   ```json
   {
     "orders": [...],
     "pagination": {...}
   }
   ```

### Impact
- Frontend code needs different handling for each endpoint
- Increases complexity and chance of bugs
- Makes API documentation more complex
- New developers need to learn multiple patterns

### Recommended Solution
Standardize all list endpoints to use consistent format:

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

Or for simpler endpoints without pagination:
```json
{
  "success": true,
  "data": [...]
}
```

### Affected Endpoints
- [ ] GET /api/connections
- [ ] GET /api/organizations/:id/locations  
- [ ] GET /api/orders
- [ ] GET /api/users
- [ ] GET /api/locations
- [ ] (Audit all other list endpoints)

### Notes
- Frontend currently handles both formats via defensive coding
- Not urgent but should be addressed before API v2
- Would require coordinated backend/frontend updates

---

## Other Technical Debt Items

(Add new items below)