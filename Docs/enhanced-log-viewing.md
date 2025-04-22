# Enhanced Log Viewing for Super Admin

**Version:** 1.0
**Date:** 2025-04-21

This document describes the enhanced log viewing functionality for the Super Admin console, which provides advanced filtering and search capabilities for system logs.

## Overview

The enhanced log viewing functionality extends the existing log viewing capabilities with more sophisticated filtering options, allowing Super Admins to efficiently search through large volumes of log data. This is particularly useful for troubleshooting issues, monitoring system performance, and analyzing usage patterns.

## Features

### 1. Advanced Filtering

The enhanced log viewing functionality supports the following advanced filtering options:

- **Multiple Status Selection**: Filter logs by multiple status values simultaneously (e.g., show both 'success' and 'failed' logs)
- **Multiple Provider/Model Selection**: Filter logs by multiple LLM providers or model names
- **Text Search**: Search within log content, including error messages and related fields
- **Date Range Presets**: Quickly filter logs by common time periods (today, yesterday, last 7 days, etc.)
- **Custom Date Ranges**: Specify custom start and end dates for precise time filtering
- **Sorting Options**: Sort logs by various fields (created_at, latency_ms, total_tokens, status)
- **Sort Direction**: Choose ascending or descending sort order

### 2. Enhanced Response Format

The enhanced log viewing endpoints return a consistent response format that includes:

- **Paginated Data**: Results are paginated for efficient loading
- **Total Count**: The total number of logs matching the filter criteria
- **Pagination Metadata**: Information about the current page and whether more results are available
- **Joined Data**: Related information such as user names and organization names are included

## API Endpoints

### LLM Validation Logs

**Endpoint:** `GET /api/superadmin/logs/validation/enhanced`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| organization_id | number | Filter by organization ID |
| user_id | number | Filter by user ID |
| date_range_start | string | Start date for custom date range (ISO format) |
| date_range_end | string | End date for custom date range (ISO format) |
| date_preset | string | Predefined date range ('today', 'yesterday', 'last_7_days', 'last_30_days', 'this_month', 'last_month', 'custom') |
| status | string | Filter by a single status value (for backward compatibility) |
| statuses | string[] | Filter by multiple status values (comma-separated) |
| llm_provider | string | Filter by a single LLM provider (for backward compatibility) |
| llm_providers | string[] | Filter by multiple LLM providers (comma-separated) |
| model_name | string | Filter by a single model name (for backward compatibility) |
| model_names | string[] | Filter by multiple model names (comma-separated) |
| search_text | string | Text to search for in logs |
| sort_by | string | Field to sort by ('created_at', 'latency_ms', 'total_tokens', 'status') |
| sort_direction | string | Sort direction ('asc' or 'desc') |
| limit | number | Maximum number of logs to return (default: 50) |
| offset | number | Number of logs to skip (for pagination) |

**Example Request:**

```
GET /api/superadmin/logs/validation/enhanced?date_preset=last_7_days&statuses=success,failed&sort_by=created_at&sort_direction=desc&limit=10
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 12345,
      "order_id": 67890,
      "validation_attempt_id": 54321,
      "user_id": 123,
      "organization_id": 456,
      "llm_provider": "anthropic",
      "model_name": "claude-3-7-sonnet-20250219",
      "prompt_template_id": 789,
      "prompt_tokens": 1500,
      "completion_tokens": 500,
      "total_tokens": 2000,
      "latency_ms": 2500,
      "status": "success",
      "created_at": "2025-04-15T14:30:00Z",
      "user_name": "John Doe",
      "organization_name": "Example Medical Group",
      "prompt_template_name": "Default Validation v2"
    },
    // ... more logs
  ],
  "pagination": {
    "total": 250,
    "limit": 10,
    "offset": 0,
    "has_more": true
  }
}
```

## Implementation Details

The enhanced log viewing functionality is implemented using a modular approach:

1. **Enhanced Types**: Defined in `src/types/enhanced-logs.ts`
2. **Service Layer**: Implemented in `src/services/superadmin/logs/listLlmValidationLogsEnhanced.ts`
3. **Controller Layer**: Implemented in `src/controllers/superadmin/logs/listLlmValidationLogsEnhanced.ts`
4. **Routes**: Added to `src/routes/superadmin.routes.ts`

### Testing

A test script is provided to verify the functionality:

- **Test Script**: `tests/superadmin-enhanced-logs.js`
- **Batch Script**: `tests/run-superadmin-enhanced-logs.bat` (Windows)
- **Shell Script**: `tests/run-superadmin-enhanced-logs.sh` (Unix/Mac)

The test script is also integrated into the main test suite in `tests/batch/run-all-tests.bat` and `tests/batch/run-all-tests.sh`.

## Future Enhancements

Potential future enhancements to the enhanced log viewing functionality include:

1. **Export Functionality**: Allow exporting filtered logs to CSV or JSON
2. **Saved Filters**: Allow saving and reusing common filter combinations
3. **Aggregated Views**: Provide aggregated statistics and visualizations of log data
4. **Real-time Updates**: Implement WebSocket-based real-time log updates
5. **Enhanced Credit Usage Logs**: Apply similar advanced filtering to credit usage logs
6. **Enhanced Purgatory Events**: Apply similar advanced filtering to purgatory events

## Conclusion

The enhanced log viewing functionality provides Super Admins with powerful tools for analyzing system logs, making it easier to monitor system health, troubleshoot issues, and gain insights into system usage patterns.