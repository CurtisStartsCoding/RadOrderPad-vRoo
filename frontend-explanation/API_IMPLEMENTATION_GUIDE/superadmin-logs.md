# Super Admin Logs Implementation Guide

**Version:** 1.0
**Date:** 2025-04-25

This document provides detailed information about the implementation of the Super Admin logs endpoints in the RadOrderPad API. These endpoints allow Super Admins to view and analyze system logs, including LLM validation logs, credit usage logs, and purgatory events.

## Overview

The Super Admin logs endpoints provide comprehensive visibility into system activities, allowing Super Admins to monitor and troubleshoot the platform. These endpoints are designed with robust filtering, pagination, and sorting capabilities to handle large volumes of log data efficiently.

The logs endpoints are organized into three main categories:

1. **LLM Validation Logs** - Logs of all LLM validation requests and responses
2. **Credit Usage Logs** - Logs of credit consumption across the platform
3. **Purgatory Events** - Logs of organization purgatory status changes

## Endpoints

### 1. Basic LLM Validation Logs

**Endpoint:** `GET /api/superadmin/logs/validation`

**Description:** Retrieves LLM validation logs with basic filtering capabilities.

**Authentication:** Requires Super Admin role

**Query Parameters:**
- `organization_id` (optional) - Filter by organization ID
- `user_id` (optional) - Filter by user ID
- `date_range_start` (optional) - Filter by start date (YYYY-MM-DD)
- `date_range_end` (optional) - Filter by end date (YYYY-MM-DD)
- `status` (optional) - Filter by validation status
- `llm_provider` (optional) - Filter by LLM provider (e.g., "OpenAI", "Anthropic")
- `model_name` (optional) - Filter by model name (e.g., "gpt-4", "claude-3")
- `limit` (optional) - Number of items per page (default: 50)
- `offset` (optional) - Offset for pagination (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "order_id": 456,
      "validation_attempt_id": 789,
      "user_id": 101,
      "organization_id": 202,
      "llm_provider": "Anthropic",
      "model_name": "claude-3.7",
      "prompt_template_id": 303,
      "prompt_tokens": 1500,
      "completion_tokens": 500,
      "total_tokens": 2000,
      "latency_ms": 2500,
      "status": "appropriate",
      "error_message": null,
      "created_at": "2025-04-20T14:30:00.000Z",
      "user_name": "John Doe",
      "organization_name": "ABC Medical Group"
    }
    // Additional log entries...
  ],
  "pagination": {
    "total": 1000,
    "limit": 50,
    "offset": 0,
    "has_more": true
  }
}
```

**Database Interactions:**
- Reads from `llm_validation_logs` table in the Main database
- Joins with `users` and `organizations` tables to include names

**Implementation Notes:**
- The endpoint uses parameterized queries to prevent SQL injection
- Pagination is implemented to handle large volumes of log data
- The response includes user and organization names for better readability

### 2. Enhanced LLM Validation Logs

**Endpoint:** `GET /api/superadmin/logs/validation/enhanced`

**Description:** Retrieves LLM validation logs with advanced filtering capabilities, including multiple status selection, text search, date presets, and sorting options.

**Authentication:** Requires Super Admin role

**Query Parameters:**
- All parameters from the basic endpoint, plus:
- `statuses` (optional) - Comma-separated list of validation statuses
- `llm_providers` (optional) - Comma-separated list of LLM providers
- `model_names` (optional) - Comma-separated list of model names
- `search_text` (optional) - Text search across relevant fields
- `date_preset` (optional) - Predefined date range (today, yesterday, last_7_days, last_30_days, this_month, last_month)
- `sort_by` (optional) - Field to sort by (created_at, latency_ms, total_tokens, status)
- `sort_direction` (optional) - Sort direction (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "order_id": 456,
      "validation_attempt_id": 789,
      "user_id": 101,
      "organization_id": 202,
      "llm_provider": "Anthropic",
      "model_name": "claude-3.7",
      "prompt_template_id": 303,
      "prompt_tokens": 1500,
      "completion_tokens": 500,
      "total_tokens": 2000,
      "latency_ms": 2500,
      "status": "appropriate",
      "error_message": null,
      "created_at": "2025-04-20T14:30:00.000Z",
      "user_name": "John Doe",
      "organization_name": "ABC Medical Group",
      "prompt_template_name": "Validation Template v3"
    }
    // Additional log entries...
  ],
  "pagination": {
    "total": 1000,
    "limit": 50,
    "offset": 0,
    "has_more": true
  }
}
```

**Database Interactions:**
- Reads from `llm_validation_logs` table in the Main database
- Joins with `users`, `organizations`, and `prompt_templates` tables

**Implementation Notes:**
- Supports multiple values for statuses, providers, and models using PostgreSQL's `ANY` operator
- Implements text search across multiple fields using `ILIKE`
- Provides date presets for common time ranges
- Supports sorting by different fields and directions

### 3. Credit Usage Logs

**Endpoint:** `GET /api/superadmin/logs/credits`

**Description:** Retrieves credit usage logs with filtering capabilities.

**Authentication:** Requires Super Admin role

**Query Parameters:**
- `organization_id` (optional) - Filter by organization ID
- `user_id` (optional) - Filter by user ID
- `date_range_start` (optional) - Filter by start date (YYYY-MM-DD)
- `date_range_end` (optional) - Filter by end date (YYYY-MM-DD)
- `action_type` (optional) - Filter by action type (e.g., "order_submission", "credit_purchase")
- `limit` (optional) - Number of items per page (default: 50)
- `offset` (optional) - Offset for pagination (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "organization_id": 202,
      "user_id": 101,
      "order_id": 456,
      "validation_attempt_id": 789,
      "tokens_burned": 1,
      "action_type": "order_submission",
      "created_at": "2025-04-20T14:30:00.000Z",
      "user_name": "John Doe",
      "organization_name": "ABC Medical Group"
    }
    // Additional log entries...
  ],
  "pagination": {
    "total": 500,
    "limit": 50,
    "offset": 0,
    "has_more": true
  }
}
```

**Database Interactions:**
- Reads from `credit_usage_logs` table in the Main database
- Joins with `users` and `organizations` tables to include names

**Implementation Notes:**
- The endpoint uses parameterized queries to prevent SQL injection
- Pagination is implemented to handle large volumes of log data
- The response includes user and organization names for better readability

### 4. Purgatory Events

**Endpoint:** `GET /api/superadmin/logs/purgatory`

**Description:** Retrieves purgatory events with filtering capabilities.

**Authentication:** Requires Super Admin role

**Query Parameters:**
- `organization_id` (optional) - Filter by organization ID
- `date_range_start` (optional) - Filter by start date (YYYY-MM-DD)
- `date_range_end` (optional) - Filter by end date (YYYY-MM-DD)
- `status` (optional) - Filter by status (e.g., "to_purgatory", "from_purgatory")
- `reason` (optional) - Filter by reason
- `limit` (optional) - Number of items per page (default: 50)
- `offset` (optional) - Offset for pagination (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "organization_id": 202,
      "reason": "Suspicious activity detected",
      "triggered_by": "super_admin",
      "triggered_by_id": 101,
      "status": "to_purgatory",
      "created_at": "2025-04-20T14:30:00.000Z",
      "resolved_at": null,
      "organization_name": "ABC Medical Group",
      "triggered_by_name": "Admin User"
    }
    // Additional log entries...
  ],
  "pagination": {
    "total": 50,
    "limit": 50,
    "offset": 0,
    "has_more": false
  }
}
```

**Database Interactions:**
- Reads from `purgatory_events` table in the Main database
- Joins with `organizations` table to include organization name
- Left joins with `users` table to include triggered_by_name (if triggered by a user)

**Implementation Notes:**
- The endpoint uses parameterized queries to prevent SQL injection
- Pagination is implemented to handle large volumes of log data
- The response includes organization name and triggered_by_name for better readability

## Implementation Details

### Architecture

The Super Admin logs endpoints follow a layered architecture:

1. **Controller Layer** - Handles HTTP requests, validates input parameters, and formats responses
2. **Service Layer** - Contains the business logic, database queries, and data processing
3. **Database Layer** - Interacts with the PostgreSQL database using the `queryMainDb` helper

### Code Structure

The implementation is organized into the following files:

#### Controllers:

- `src/controllers/superadmin/logs/listLlmValidationLogs.ts` - Basic LLM validation logs controller
- `src/controllers/superadmin/logs/listLlmValidationLogsEnhanced.ts` - Enhanced LLM validation logs controller
- `src/controllers/superadmin/logs/listCreditUsageLogs.ts` - Credit usage logs controller
- `src/controllers/superadmin/logs/listPurgatoryEvents.ts` - Purgatory events controller
- `src/controllers/superadmin/logs/index.ts` - Barrel file exporting all log controllers

#### Services:

- `src/services/superadmin/logs/listLlmValidationLogs.ts` - Basic LLM validation logs service
- `src/services/superadmin/logs/listLlmValidationLogsEnhanced.ts` - Enhanced LLM validation logs service
- `src/services/superadmin/logs/listCreditUsageLogs.ts` - Credit usage logs service
- `src/services/superadmin/logs/listPurgatoryEvents.ts` - Purgatory events service
- `src/services/superadmin/logs/index.ts` - Barrel file exporting all log services

#### Types:

- `src/types/logs.ts` - Basic log types and filter interfaces
- `src/types/enhanced-logs.ts` - Enhanced log filter interfaces

#### Routes:

- `src/routes/superadmin.routes.ts` - Defines all Super Admin routes, including log endpoints

### Key Implementation Features

#### 1. Pagination

All log endpoints implement pagination to handle large volumes of data efficiently:

```typescript
// Default pagination values
const DEFAULT_LIMIT = 50;
const DEFAULT_OFFSET = 0;
const MAX_LIMIT = 500;

// Set pagination values from request or defaults
const limit = Math.min(filters?.limit || DEFAULT_LIMIT, MAX_LIMIT);
const offset = filters?.offset || DEFAULT_OFFSET;

// Add pagination to SQL query
dataQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
const paginationValues = [...values, limit, offset];

// Format pagination in response
return {
  data: dataResult.rows,
  pagination: {
    total,
    limit,
    offset,
    has_more: offset + limit < total
  }
};
```

#### 2. Advanced Filtering

The enhanced LLM validation logs endpoint implements advanced filtering capabilities:

```typescript
// Multiple statuses (new feature)
if (filters.statuses && filters.statuses.length > 0) {
  conditions.push(`l.status = ANY($${paramIndex}::text[])`);
  values.push(filters.statuses);
  paramIndex++;
}

// Text search (new feature)
if (filters.search_text) {
  const searchTerm = `%${filters.search_text}%`;
  conditions.push(`(
    l.status ILIKE $${paramIndex} OR
    l.llm_provider ILIKE $${paramIndex} OR
    l.model_name ILIKE $${paramIndex} OR
    l.error_message ILIKE $${paramIndex} OR
    CAST(l.order_id AS TEXT) = $${paramIndex + 1}
  )`);
  values.push(searchTerm);
  paramIndex++;
  values.push(filters.search_text.trim());
  paramIndex++;
}
```

#### 3. Date Presets

The enhanced LLM validation logs endpoint implements date presets for common time ranges:

```typescript
function processDatePreset(preset?: string): { start?: Date; end?: Date } {
  if (!preset || preset === 'custom') {
    return { start: undefined, end: undefined };
  }
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const result: { start?: Date; end?: Date } = { end: now };
  
  switch (preset) {
    case 'today':
      result.start = today;
      break;
      
    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      result.start = yesterday;
      result.end = new Date(today);
      break;
    }
    
    case 'last_7_days': {
      const last7Days = new Date(today);
      last7Days.setDate(last7Days.getDate() - 7);
      result.start = last7Days;
      break;
    }
    
    // Additional cases...
  }
  
  return result;
}
```

#### 4. Error Handling

All endpoints implement robust error handling:

```typescript
try {
  // Endpoint logic...
} catch (error) {
  logger.error('Error in LLM validation logs listing:', error);
  res.status(500).json({
    success: false,
    message: 'Failed to list LLM validation logs',
    error: error instanceof Error ? error.message : 'Unknown error'
  });
}
```

## Frontend Integration

### Example: Fetching LLM Validation Logs

```typescript
import axios from 'axios';

async function fetchLlmValidationLogs(filters = {}) {
  try {
    const response = await axios.get('/api/superadmin/logs/validation', {
      params: filters,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching LLM validation logs:', error);
    throw error;
  }
}

// Usage
const logs = await fetchLlmValidationLogs({
  organization_id: 123,
  date_range_start: '2025-04-01',
  date_range_end: '2025-04-25',
  status: 'appropriate',
  limit: 50,
  offset: 0
});
```

### Example: Fetching Enhanced LLM Validation Logs

```typescript
import axios from 'axios';

async function fetchEnhancedLlmValidationLogs(filters = {}) {
  try {
    const response = await axios.get('/api/superadmin/logs/validation/enhanced', {
      params: filters,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching enhanced LLM validation logs:', error);
    throw error;
  }
}

// Usage
const logs = await fetchEnhancedLlmValidationLogs({
  statuses: ['appropriate', 'inappropriate', 'needs_clarification'],
  date_preset: 'last_7_days',
  search_text: 'error',
  sort_by: 'created_at',
  sort_direction: 'desc',
  limit: 50,
  offset: 0
});
```

## Testing

### Test Scripts

Test scripts are provided to verify the functionality of the Super Admin logs endpoints:

- `tests/batch/test-superadmin-logs.js` - Tests all log endpoints
- `tests/batch/test-superadmin-logs.bat` - Windows batch script to run the test
- `tests/batch/test-superadmin-logs.sh` - Shell script to run the test

### Example Test Script

```javascript
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';
const TOKEN_FILE = path.join(__dirname, '../../tokens/super_admin-token.txt');

// Read the Super Admin token
const token = fs.readFileSync(TOKEN_FILE, 'utf8').trim();

// Test the LLM validation logs endpoint
async function testLlmValidationLogs() {
  try {
    const response = await axios.get(`${API_BASE_URL}/superadmin/logs/validation`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        limit: 10
      }
    });
    
    console.log('LLM Validation Logs Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('Error testing LLM validation logs:', error.response?.data || error.message);
    throw error;
  }
}

// Run the tests
async function runTests() {
  try {
    await testLlmValidationLogs();
    // Additional test functions...
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

runTests();
```

## Best Practices

1. **Use Pagination** - Always use pagination when fetching logs to avoid performance issues with large datasets
2. **Apply Filters** - Use appropriate filters to narrow down the results and improve performance
3. **Handle Errors** - Implement proper error handling to provide meaningful feedback to users
4. **Use Date Presets** - Leverage date presets for common time ranges to simplify the user experience
5. **Implement Text Search** - Use text search for quick filtering across multiple fields
6. **Sort Results** - Sort results by relevant fields to make the data more useful
7. **Join Related Data** - Include related data like user and organization names to improve readability

## Conclusion

The Super Admin logs endpoints provide powerful tools for monitoring and troubleshooting the RadOrderPad platform. By implementing robust filtering, pagination, and sorting capabilities, these endpoints enable Super Admins to efficiently analyze large volumes of log data and gain valuable insights into system activities.