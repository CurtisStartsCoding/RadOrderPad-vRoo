# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RadOrderPad is a clinical decision support platform that:
1. Guides physicians to create appropriate imaging orders using ACR Appropriate Use Criteria
2. Automatically generates proper CPT/ICD-10 codes from clinical dictation
3. Routes completed orders to radiology groups for fulfillment

The system ensures HIPAA compliance through strict database separation and provides a comprehensive workflow from physician dictation through radiology scheduling.

## Key Architecture Principles

### Core Principles (from DOCS/core_principles.md)
- **Modularity & Single Responsibility**: Code must be broken into small, focused modules
- **File Structure**: "Single function per file" approach, files under 150 lines
- **Database Separation**: Strict separation between PHI (`radorder_phi`) and non-PHI (`radorder_main`) databases
- **Order Immutability**: Clinical components are immutable after physician signature

### Database Architecture
```typescript
// Always use correct database connection
import { getPhiDbConnection } from '../config/database';  // For PHI data
import { getDbConnection } from '../config/database';      // For non-PHI data
```

### Service Architecture
Services organized by domain:
- `/services/order/` - Order processing and validation
- `/services/auth/` - Authentication and authorization
- `/services/billing/` - Stripe integration and credit management
- `/services/connection/` - Organization relationships
- `/services/notification/` - Email notifications
- `/services/validation/` - Clinical validation engine

## Common Development Commands

### Build and Run
```bash
# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Build TypeScript
npm run build

# Production start
npm start
```

### Testing Commands
```bash
# Run all Jest tests
npm test

# Run specific end-to-end scenario
npm run test:e2e:scenario-a  # Successful validation
npm run test:e2e:scenario-b  # Validation override
npm run test:e2e:scenario-c  # Admin finalization
npm run test:e2e:scenario-d  # Radiology workflow
npm run test:e2e:scenario-e  # Connection request
npm run test:e2e:scenario-f  # User invite
npm run test:e2e:scenario-g  # File upload

# Run LLM validation tests
npm run test:llm-validation
npm run test:llm-validation:random

# Run Stripe webhook tests
npm run test:stripe-webhooks
```

### Role-Based Testing
```bash
# Test physician workflow
node all-backend-tests/role-tests/physician-role-tests.js

# Test admin staff workflow
node all-backend-tests/role-tests/admin-staff-role-tests.js

# Test trial user workflow
node all-backend-tests/role-tests/trial-role-tests.js
```

### Database and Redis Operations
```bash
# Test database connections
node debug-scripts/test-both-databases.js

# Check Redis population
node debug-scripts/check-redis-population.js

# Force Redis repopulation
node debug-scripts/force-redis-population.js

# Test Redis search functionality
node debug-scripts/redis-optimization/test-redis-json-search.js
```

### Token Generation for Testing
```bash
# Generate tokens for all roles
node generate-all-role-tokens.js

# Generate custom role token
node generate-custom-token.js
```

## Key Workflows

### 1. Order Validation Workflow
```
Dictation → Validation Engine → ACR Compliance Check → 
Feedback/Codes → Iterative Refinement → Final Approval
```

### 2. Order Creation Process
1. **Stateless Validation**: `POST /api/orders/validate` (dictation only)
2. **Multiple iterations** allowed without persisting
3. **Final submission**: `POST /api/orders` (creates persistent record)

### 3. File Upload Pattern
1. Get presigned URL: `POST /api/uploads/presigned-url`
2. Upload directly to S3
3. Confirm upload: `POST /api/uploads/confirm`

## LLM Integration

The system uses three LLM providers:
- **OpenAI (GPT-4)**: Primary validation engine
- **Anthropic (Claude)**: Fallback validation
- **Grok**: Additional fallback option

Configuration in environment:
```env
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
GROK_API_KEY=...
```

## API Response Standards

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }  // Only in development
}
```

### Validation Response Fields
```json
{
  "validationStatus": "appropriate|needs_clarification|inappropriate",
  "complianceScore": 1-9,
  "feedback": "Educational message if needed",
  "suggestedICD10Codes": [
    {"code": "X00.0", "description": "Description", "isPrimary": true}
  ],
  "suggestedCPTCodes": [
    {"code": "00000", "description": "Description"}
  ]
}
```

## Environment Configuration

Key environment variables:
```env
# Database connections
PG_HOST, PG_PORT, PG_DATABASE, PG_USER, PG_PASSWORD
PG_PHI_HOST, PG_PHI_PORT, PG_PHI_DATABASE, PG_PHI_USER, PG_PHI_PASSWORD

# Redis configuration
REDIS_URL, REDIS_PASSWORD, REDIS_TLS_ENABLED

# AWS services
AWS_REGION, AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY

# Stripe billing
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID_CREDITS

# Email settings
SEND_EMAILS=true/false
EMAIL_TEST_MODE=true/false
```

## Testing Best Practices

### Unit Tests
- Test individual functions in isolation
- Mock external dependencies (LLMs, databases, AWS services)
- Focus on business logic validation

### Integration Tests
- Use test database connections
- Test complete API endpoints
- Verify role-based access control
- Clean up test data after completion

### E2E Tests
- Simulate complete user workflows
- Test across multiple services
- Verify data consistency across databases

## Common Troubleshooting

### Redis Issues
```bash
# Check Redis connection
node debug-scripts/redis-optimization/test-redis-connection-simple.js

# Verify Redis search index
node debug-scripts/redis-optimization/check-index-schema.js
```

### LLM Validation Failures
- Check API keys are set correctly
- Verify prompt templates in database
- Check rate limits for each service
- Review fallback logic implementation

### Database Migration
- PHI and main databases must be migrated separately
- Always backup before migrations
- Use provided migration scripts in `archive/db-migrations/`

## Documentation Structure

### Primary References
- `/final-documentation/` - Comprehensive API and workflow documentation
- `/DOCS/` - Technical specifications and implementation details
- `/all-backend-tests/role-tests/` - Working examples for each user role

### Key Documents
- `final-documentation/README.md` - Complete documentation index
- `DOCS/api_endpoints.md` - All API endpoints
- `DOCS/core_principles.md` - Design principles (MUST READ)
- `DOCS/SCHEMA_Main_COMPLETE.md` - Main database schema
- `DOCS/SCHEMA_PHI_COMPLETE.md` - PHI database schema

### Role-Specific Guides
- `final-documentation/api/physician-endpoints.md`
- `final-documentation/api/admin-staff-endpoints.md`
- `final-documentation/api/organization-user-management-endpoints.md`

## Development Guidelines

### Creating New Features
1. Follow single-function-per-file approach
2. Create in appropriate service directory
3. Add comprehensive error handling
4. Include unit tests
5. Update relevant documentation

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration enforced
- Comprehensive error logging with Winston
- JWT authentication for all protected routes
- Input validation on all endpoints

### Security Requirements
- Never log PHI data
- Use parameterized queries
- Validate all user inputs
- Enforce role-based access control
- Audit all data access