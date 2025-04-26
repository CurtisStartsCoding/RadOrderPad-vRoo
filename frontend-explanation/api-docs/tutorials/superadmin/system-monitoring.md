# Superadmin System Monitoring

This guide covers the system monitoring capabilities available to superadmins in the RadOrderPad API.

## Prerequisites

- You must have a superadmin role
- You must have a valid JWT token with superadmin privileges

## System Monitoring Overview

Superadmins have access to comprehensive system monitoring tools, including:

1. System health and status monitoring
2. Performance metrics and analytics
3. Error and exception logs
4. Audit logs for security and compliance
5. User activity monitoring
6. Resource usage tracking
7. Alert management and notifications

## System Health and Status

### Get System Health Status

Retrieve the current health status of the system:

```javascript
const getSystemHealthStatus = async (token) => {
  try {
    const response = await fetch('/api/superadmin/system/health', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve system health status:', error);
    throw error;
  }
};
```

The response will include:
- `status`: Overall system status (healthy, degraded, unhealthy)
- `timestamp`: Timestamp of the health check
- `components`: Status of individual system components
  - `api`: API service status
  - `database`: Database status
  - `cache`: Cache service status
  - `llm`: LLM service status
  - `storage`: Storage service status
  - `email`: Email service status
  - `background`: Background job service status
- `metrics`: Key system metrics
  - `uptime`: System uptime in seconds
  - `responseTime`: Average API response time in milliseconds
  - `errorRate`: Error rate percentage
  - `cpuUsage`: CPU usage percentage
  - `memoryUsage`: Memory usage percentage
  - `diskUsage`: Disk usage percentage

### Get Service Status

Retrieve detailed status information for a specific service:

```javascript
const getServiceStatus = async (token, serviceName) => {
  try {
    const response = await fetch(`/api/superadmin/system/services/${serviceName}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Failed to retrieve ${serviceName} service status:`, error);
    throw error;
  }
};
```

The `serviceName` parameter can be one of:
- `api`: API service
- `database`: Database service
- `cache`: Cache service
- `llm`: LLM service
- `storage`: Storage service
- `email`: Email service
- `background`: Background job service

The response will include service-specific status information and metrics.

## Performance Metrics and Analytics

### Get System Performance Metrics

Retrieve system performance metrics:

```javascript
const getSystemPerformanceMetrics = async (token, timeframe = '1h') => {
  try {
    const response = await fetch(`/api/superadmin/system/metrics?timeframe=${timeframe}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve system performance metrics:', error);
    throw error;
  }
};
```

The `timeframe` parameter can be one of:
- `1h`: Last hour
- `6h`: Last 6 hours
- `24h`: Last 24 hours
- `7d`: Last 7 days
- `30d`: Last 30 days

The response will include:
- `cpu`: CPU usage metrics
  - `current`: Current CPU usage percentage
  - `average`: Average CPU usage percentage
  - `peak`: Peak CPU usage percentage
  - `timeline`: Timeline of CPU usage
- `memory`: Memory usage metrics
  - `current`: Current memory usage
  - `average`: Average memory usage
  - `peak`: Peak memory usage
  - `timeline`: Timeline of memory usage
- `disk`: Disk usage metrics
  - `current`: Current disk usage
  - `available`: Available disk space
  - `timeline`: Timeline of disk usage
- `network`: Network metrics
  - `inbound`: Inbound traffic
  - `outbound`: Outbound traffic
  - `timeline`: Timeline of network traffic
- `api`: API metrics
  - `requestCount`: Number of API requests
  - `averageResponseTime`: Average response time
  - `errorRate`: Error rate percentage
  - `timeline`: Timeline of API metrics
- `database`: Database metrics
  - `queryCount`: Number of database queries
  - `averageQueryTime`: Average query time
  - `connectionCount`: Number of database connections
  - `timeline`: Timeline of database metrics

### Get API Performance Analytics

Retrieve API performance analytics:

```javascript
const getApiPerformanceAnalytics = async (token, timeframe = '24h', filters = {}) => {
  try {
    // Build query string from filters and timeframe
    const queryParams = new URLSearchParams({
      timeframe,
      ...filters
    }).toString();
    
    const response = await fetch(`/api/superadmin/system/analytics/api?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve API performance analytics:', error);
    throw error;
  }
};
```

The `filters` object can include:
- `endpoint`: Filter by API endpoint
- `method`: Filter by HTTP method
- `statusCode`: Filter by HTTP status code
- `minResponseTime`: Filter by minimum response time
- `maxResponseTime`: Filter by maximum response time

The response will include:
- `requestCount`: Total number of API requests
- `averageResponseTime`: Average response time
- `p95ResponseTime`: 95th percentile response time
- `p99ResponseTime`: 99th percentile response time
- `errorRate`: Error rate percentage
- `statusCodeDistribution`: Distribution of HTTP status codes
- `methodDistribution`: Distribution of HTTP methods
- `endpointPerformance`: Performance metrics by endpoint
- `timeline`: Timeline of API metrics

### Get LLM Performance Analytics

Retrieve LLM performance analytics:

```javascript
const getLlmPerformanceAnalytics = async (token, timeframe = '24h', filters = {}) => {
  try {
    // Build query string from filters and timeframe
    const queryParams = new URLSearchParams({
      timeframe,
      ...filters
    }).toString();
    
    const response = await fetch(`/api/superadmin/system/analytics/llm?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve LLM performance analytics:', error);
    throw error;
  }
};
```

The `filters` object can include:
- `templateId`: Filter by prompt template ID
- `organizationId`: Filter by organization ID
- `status`: Filter by validation status

The response will include:
- `requestCount`: Total number of LLM requests
- `averageProcessingTime`: Average processing time
- `tokenUsage`: Token usage statistics
  - `promptTokens`: Number of prompt tokens used
  - `completionTokens`: Number of completion tokens used
  - `totalTokens`: Total number of tokens used
- `costEstimate`: Estimated cost of LLM usage
- `successRate`: Success rate percentage
- `clarificationRate`: Clarification rate percentage
- `overrideRate`: Override rate percentage
- `templatePerformance`: Performance metrics by template
- `timeline`: Timeline of LLM metrics

## Error and Exception Logs

### Get System Error Logs

Retrieve system error logs:

```javascript
const getSystemErrorLogs = async (token, filters = {}, page = 1, limit = 20) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await fetch(`/api/superadmin/system/logs/errors?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve system error logs:', error);
    throw error;
  }
};
```

The `filters` object can include:
- `severity`: Filter by error severity (error, warning, critical)
- `service`: Filter by service name
- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `search`: Search term for error message or stack trace

The response will include:
- `logs`: Array of error log records
- `pagination`: Pagination information

Each error log record includes:
- `id`: Log ID
- `timestamp`: Error timestamp
- `severity`: Error severity
- `service`: Service name
- `component`: Component name
- `message`: Error message
- `stackTrace`: Stack trace
- `context`: Error context
- `requestId`: Associated request ID (if applicable)
- `userId`: Associated user ID (if applicable)
- `organizationId`: Associated organization ID (if applicable)

### Get Exception Details

Retrieve detailed information for a specific exception:

```javascript
const getExceptionDetails = async (token, exceptionId) => {
  try {
    const response = await fetch(`/api/superadmin/system/logs/exceptions/${exceptionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve exception details:', error);
    throw error;
  }
};
```

The response will include detailed exception information, including:
- `id`: Exception ID
- `timestamp`: Exception timestamp
- `severity`: Exception severity
- `service`: Service name
- `component`: Component name
- `message`: Exception message
- `stackTrace`: Full stack trace
- `context`: Exception context
- `requestDetails`: Associated request details
  - `id`: Request ID
  - `method`: HTTP method
  - `url`: Request URL
  - `headers`: Request headers
  - `body`: Request body
  - `ipAddress`: Client IP address
  - `userAgent`: User agent
- `userDetails`: Associated user details (if applicable)
- `organizationDetails`: Associated organization details (if applicable)
- `relatedExceptions`: Related exceptions

## Audit Logs

### Get System Audit Logs

Retrieve system audit logs:

```javascript
const getSystemAuditLogs = async (token, filters = {}, page = 1, limit = 20) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await fetch(`/api/superadmin/system/logs/audit?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve system audit logs:', error);
    throw error;
  }
};
```

The `filters` object can include:
- `actionType`: Filter by action type
- `userId`: Filter by user ID
- `organizationId`: Filter by organization ID
- `resourceType`: Filter by resource type
- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `search`: Search term for audit log details

The response will include:
- `logs`: Array of audit log records
- `pagination`: Pagination information

Each audit log record includes:
- `id`: Log ID
- `timestamp`: Action timestamp
- `actionType`: Type of action
- `userId`: ID of the user who performed the action
- `userName`: Name of the user who performed the action
- `organizationId`: ID of the user's organization
- `organizationName`: Name of the user's organization
- `resourceType`: Type of resource affected
- `resourceId`: ID of the resource affected
- `details`: Action details
- `ipAddress`: IP address from which the action was performed
- `userAgent`: User agent information

### Get Security Audit Logs

Retrieve security-specific audit logs:

```javascript
const getSecurityAuditLogs = async (token, filters = {}, page = 1, limit = 20) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await fetch(`/api/superadmin/system/logs/security?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve security audit logs:', error);
    throw error;
  }
};
```

The `filters` object can include:
- `eventType`: Filter by security event type
- `userId`: Filter by user ID
- `ipAddress`: Filter by IP address
- `startDate`: Filter by start date
- `endDate`: Filter by end date

The response will include:
- `logs`: Array of security log records
- `pagination`: Pagination information

Each security log record includes:
- `id`: Log ID
- `timestamp`: Event timestamp
- `eventType`: Type of security event
- `userId`: ID of the associated user
- `userName`: Name of the associated user
- `ipAddress`: IP address
- `location`: Geographic location (if available)
- `userAgent`: User agent information
- `details`: Event details
- `outcome`: Event outcome (success, failure)
- `failureReason`: Reason for failure (if applicable)

## User Activity Monitoring

### Get Active User Sessions

Retrieve currently active user sessions:

```javascript
const getActiveUserSessions = async (token, filters = {}, page = 1, limit = 20) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await fetch(`/api/superadmin/system/sessions?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve active user sessions:', error);
    throw error;
  }
};
```

The `filters` object can include:
- `userId`: Filter by user ID
- `organizationId`: Filter by organization ID
- `ipAddress`: Filter by IP address
- `deviceType`: Filter by device type

The response will include:
- `sessions`: Array of session records
- `pagination`: Pagination information
- `summary`: Summary information
  - `totalActiveSessions`: Total number of active sessions
  - `uniqueUsers`: Number of unique users
  - `uniqueOrganizations`: Number of unique organizations

Each session record includes:
- `id`: Session ID
- `userId`: User ID
- `userName`: User name
- `organizationId`: Organization ID
- `organizationName`: Organization name
- `ipAddress`: IP address
- `deviceType`: Device type
- `userAgent`: User agent information
- `location`: Geographic location (if available)
- `startTime`: Session start time
- `lastActivityTime`: Last activity time
- `expirationTime`: Session expiration time

### Terminate User Sessions

Terminate active user sessions:

```javascript
const terminateUserSessions = async (token, sessionIds, reason = '') => {
  try {
    const response = await fetch('/api/superadmin/system/sessions/terminate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionIds,
        reason
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to terminate user sessions:', error);
    throw error;
  }
};
```

### Get Real-time User Activity

Retrieve real-time user activity:

```javascript
const getRealTimeUserActivity = async (token) => {
  try {
    const response = await fetch('/api/superadmin/system/activity/real-time', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve real-time user activity:', error);
    throw error;
  }
};
```

The response will include:
- `activeUsers`: Number of active users
- `activeOrganizations`: Number of active organizations
- `requestsPerMinute`: Number of API requests per minute
- `currentOperations`: Currently running operations
  - `validations`: Number of ongoing validations
  - `uploads`: Number of ongoing uploads
  - `downloads`: Number of ongoing downloads
- `recentActivity`: Array of recent activity records
- `userDistribution`: Distribution of active users by role
- `geographicDistribution`: Geographic distribution of active users

## Resource Usage Tracking

### Get Resource Usage Statistics

Retrieve resource usage statistics:

```javascript
const getResourceUsageStatistics = async (token, timeframe = '30d') => {
  try {
    const response = await fetch(`/api/superadmin/system/resources/usage?timeframe=${timeframe}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve resource usage statistics:', error);
    throw error;
  }
};
```

The response will include:
- `storage`: Storage usage statistics
  - `total`: Total storage used
  - `byType`: Storage usage by file type
  - `byOrganization`: Storage usage by organization
  - `trend`: Storage usage trend
- `database`: Database usage statistics
  - `size`: Database size
  - `recordCounts`: Record counts by table
  - `growth`: Database growth rate
- `llm`: LLM usage statistics
  - `tokenUsage`: Token usage
  - `costEstimate`: Cost estimate
  - `byOrganization`: Usage by organization
  - `trend`: Usage trend
- `bandwidth`: Bandwidth usage statistics
  - `total`: Total bandwidth used
  - `byEndpoint`: Bandwidth usage by endpoint
  - `byOrganization`: Bandwidth usage by organization
  - `trend`: Bandwidth usage trend

### Get Organization Resource Usage

Retrieve resource usage for a specific organization:

```javascript
const getOrganizationResourceUsage = async (token, organizationId, timeframe = '30d') => {
  try {
    const response = await fetch(`/api/superadmin/system/resources/organizations/${organizationId}?timeframe=${timeframe}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve organization resource usage:', error);
    throw error;
  }
};
```

The response will include organization-specific resource usage statistics.

## Alert Management

### Get System Alerts

Retrieve system alerts:

```javascript
const getSystemAlerts = async (token, filters = {}, page = 1, limit = 20) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await fetch(`/api/superadmin/system/alerts?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve system alerts:', error);
    throw error;
  }
};
```

The `filters` object can include:
- `severity`: Filter by alert severity (info, warning, critical)
- `status`: Filter by alert status (active, resolved, acknowledged)
- `type`: Filter by alert type
- `startDate`: Filter by start date
- `endDate`: Filter by end date

The response will include:
- `alerts`: Array of alert records
- `pagination`: Pagination information

Each alert record includes:
- `id`: Alert ID
- `timestamp`: Alert timestamp
- `severity`: Alert severity
- `type`: Alert type
- `status`: Alert status
- `message`: Alert message
- `details`: Alert details
- `affectedComponent`: Affected component
- `affectedUsers`: Number of affected users
- `affectedOrganizations`: Number of affected organizations
- `resolvedAt`: Resolution timestamp (if resolved)
- `resolvedBy`: User who resolved the alert (if resolved)
- `acknowledgedAt`: Acknowledgment timestamp (if acknowledged)
- `acknowledgedBy`: User who acknowledged the alert (if acknowledged)

### Update Alert Status

Update the status of a system alert:

```javascript
const updateAlertStatus = async (token, alertId, status, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/system/alerts/${alertId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status,
        notes
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update alert status:', error);
    throw error;
  }
};
```

The `status` parameter can be one of:
- `acknowledged`: Mark the alert as acknowledged
- `resolved`: Mark the alert as resolved

### Create System Notification

Create a system-wide notification:

```javascript
const createSystemNotification = async (token, notification) => {
  try {
    const response = await fetch('/api/superadmin/system/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notification)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to create system notification:', error);
    throw error;
  }
};
```

The `notification` object should include:
- `message`: Notification message (required)
- `type`: Notification type (info, warning, maintenance, outage)
- `startTime`: Start time for the notification
- `endTime`: End time for the notification (for temporary notifications)
- `affectedServices`: Array of affected services
- `targetAudience`: Target audience (all, admins, specific_organizations)
- `targetOrganizationIds`: Array of target organization IDs (if targetAudience is specific_organizations)
- `actionUrl`: URL for additional information or action

## Error Handling

When working with superadmin system monitoring endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions (non-superadmin role)
- 404 Not Found: Resource not found
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Server-side error

## Best Practices

1. **Monitor system health regularly**: Set up a dashboard for continuous monitoring
2. **Investigate performance issues promptly**: Address performance degradation before it affects users
3. **Review error logs systematically**: Look for patterns in errors to identify root causes
4. **Audit security logs regularly**: Monitor for suspicious activity
5. **Track resource usage trends**: Plan for capacity needs based on usage trends
6. **Respond to alerts promptly**: Acknowledge and resolve alerts in a timely manner
7. **Communicate system issues**: Use system notifications to inform users of known issues
8. **Document monitoring procedures**: Maintain documentation of monitoring and response procedures
9. **Set up automated alerts**: Configure alerts for critical metrics
10. **Perform regular security audits**: Review security logs and access patterns