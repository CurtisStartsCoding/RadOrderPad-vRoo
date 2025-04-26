# Superadmin Prompt Management

This guide covers the prompt template management capabilities available to superadmins in the RadOrderPad API.

## Prerequisites

- You must have a superadmin role
- You must have a valid JWT token with superadmin privileges

## Prompt Management Overview

Superadmins have extended capabilities for managing prompt templates, which are used by the validation engine to process clinical dictations. These capabilities include:

1. Viewing all prompt templates in the system
2. Creating new prompt templates
3. Updating existing prompt templates
4. Testing prompt templates
5. Assigning prompt templates to organizations
6. Monitoring prompt template performance
7. Managing prompt template versions

## Retrieving Prompt Templates

### List All Prompt Templates

Retrieve a list of all prompt templates in the system:

```javascript
const getAllPromptTemplates = async (token, filters = {}, page = 1, limit = 20) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await fetch(`/api/superadmin/prompts?${queryParams}`, {
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
    console.error('Failed to retrieve prompt templates:', error);
    throw error;
  }
};
```

The `filters` object can include:
- `status`: Filter by template status (active, inactive, draft)
- `modalityType`: Filter by modality type (CT, MRI, XRAY, ULTRASOUND, PET, NUCLEAR)
- `version`: Filter by version number
- `search`: Search term for template name or description

The response will include:
- `templates`: Array of prompt template records
- `pagination`: Pagination information
  - `currentPage`: Current page number
  - `totalPages`: Total number of pages
  - `totalItems`: Total number of templates
  - `itemsPerPage`: Number of templates per page

Each template record includes:
- `id`: Template ID
- `name`: Template name
- `description`: Template description
- `status`: Template status
- `modalityType`: Modality type
- `version`: Version number
- `createdAt`: Date the template was created
- `updatedAt`: Date the template was last updated
- `createdBy`: User who created the template
- `assignedOrganizationsCount`: Number of organizations using this template
- `performanceMetrics`: Performance metrics
  - `accuracy`: Accuracy percentage
  - `clarificationRate`: Clarification rate percentage
  - `overrideRate`: Override rate percentage

### Get Prompt Template Details

Retrieve detailed information for a specific prompt template:

```javascript
const getPromptTemplateDetails = async (token, templateId) => {
  try {
    const response = await fetch(`/api/superadmin/prompts/${templateId}`, {
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
    console.error('Failed to retrieve prompt template details:', error);
    throw error;
  }
};
```

The response will include all template information, including:
- `id`: Template ID
- `name`: Template name
- `description`: Template description
- `status`: Template status
- `modalityType`: Modality type
- `version`: Version number
- `content`: Template content
- `systemInstructions`: System instructions
- `clarificationStrategy`: Clarification strategy
- `validationRules`: Validation rules
- `outputFormat`: Output format specification
- `createdAt`: Date the template was created
- `updatedAt`: Date the template was last updated
- `createdBy`: User who created the template
- `assignedOrganizations`: Array of organizations using this template
- `performanceMetrics`: Performance metrics
  - `accuracy`: Accuracy percentage
  - `clarificationRate`: Clarification rate percentage
  - `overrideRate`: Override rate percentage
  - `averageProcessingTime`: Average processing time in seconds
  - `usageCount`: Number of times the template has been used

### Get Template Version History

Retrieve the version history for a prompt template:

```javascript
const getTemplateVersionHistory = async (token, templateId) => {
  try {
    const response = await fetch(`/api/superadmin/prompts/${templateId}/versions`, {
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
    console.error('Failed to retrieve template version history:', error);
    throw error;
  }
};
```

The response will include an array of version records, each with:
- `version`: Version number
- `createdAt`: Date the version was created
- `createdBy`: User who created the version
- `changeNotes`: Notes about changes in this version
- `status`: Status of this version
- `performanceMetrics`: Performance metrics for this version

## Creating and Updating Prompt Templates

### Create a New Prompt Template

Create a new prompt template:

```javascript
const createPromptTemplate = async (token, templateData) => {
  try {
    const response = await fetch('/api/superadmin/prompts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(templateData)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to create prompt template:', error);
    throw error;
  }
};
```

The `templateData` object should include:
- `name`: Template name (required)
- `description`: Template description (required)
- `modalityType`: Modality type (required)
- `content`: Template content (required)
- `systemInstructions`: System instructions (required)
- `clarificationStrategy`: Clarification strategy (required)
- `validationRules`: Validation rules (required)
- `outputFormat`: Output format specification (required)
- `status`: Template status (optional, default: 'draft')

### Update a Prompt Template

Update an existing prompt template:

```javascript
const updatePromptTemplate = async (token, templateId, templateData, createNewVersion = false) => {
  try {
    const response = await fetch(`/api/superadmin/prompts/${templateId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...templateData,
        createNewVersion,
        changeNotes: createNewVersion ? templateData.changeNotes : undefined
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update prompt template:', error);
    throw error;
  }
};
```

The `templateData` object can include any of the fields mentioned in the create operation, plus:
- `changeNotes`: Notes about changes in this version (required if createNewVersion is true)

### Clone a Prompt Template

Clone an existing prompt template:

```javascript
const clonePromptTemplate = async (token, templateId, newName, newDescription) => {
  try {
    const response = await fetch(`/api/superadmin/prompts/${templateId}/clone`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        newName,
        newDescription
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to clone prompt template:', error);
    throw error;
  }
};
```

## Managing Prompt Template Status

### Activate a Prompt Template

Activate a prompt template:

```javascript
const activatePromptTemplate = async (token, templateId, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/prompts/${templateId}/activate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notes })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to activate prompt template:', error);
    throw error;
  }
};
```

### Deactivate a Prompt Template

Deactivate a prompt template:

```javascript
const deactivatePromptTemplate = async (token, templateId, reason, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/prompts/${templateId}/deactivate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason, notes })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to deactivate prompt template:', error);
    throw error;
  }
};
```

### Revert to Previous Version

Revert a prompt template to a previous version:

```javascript
const revertToVersion = async (token, templateId, version, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/prompts/${templateId}/revert`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ version, notes })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to revert prompt template:', error);
    throw error;
  }
};
```

## Testing Prompt Templates

### Test a Prompt Template

Test a prompt template with sample dictation:

```javascript
const testPromptTemplate = async (token, templateId, dictation, patientInfo = null) => {
  try {
    const response = await fetch(`/api/superadmin/prompts/${templateId}/test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dictation,
        patientInfo
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to test prompt template:', error);
    throw error;
  }
};
```

The response will include:
- `result`: Validation result
  - `cptCodes`: Array of CPT codes
  - `icd10Codes`: Array of ICD-10 codes
  - `reasoning`: Reasoning for the code selection
- `requiresClarification`: Whether clarification is needed
- `clarificationPrompt`: Clarification prompt (if applicable)
- `processingTime`: Processing time in seconds
- `promptTokens`: Number of prompt tokens used
- `completionTokens`: Number of completion tokens used
- `totalTokens`: Total number of tokens used
- `rawLlmResponse`: Raw response from the LLM

### Batch Test a Prompt Template

Test a prompt template with multiple sample dictations:

```javascript
const batchTestPromptTemplate = async (token, templateId, testCases) => {
  try {
    const response = await fetch(`/api/superadmin/prompts/${templateId}/batch-test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        testCases
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to batch test prompt template:', error);
    throw error;
  }
};
```

The `testCases` parameter is an array of test case objects, each with:
- `dictation`: Clinical dictation
- `patientInfo`: Patient information (optional)
- `expectedCptCodes`: Expected CPT codes (optional)
- `expectedIcd10Codes`: Expected ICD-10 codes (optional)

The response will include:
- `results`: Array of test results, each with:
  - `testCase`: The original test case
  - `result`: Validation result
  - `requiresClarification`: Whether clarification is needed
  - `processingTime`: Processing time in seconds
  - `isMatch`: Whether the result matches the expected codes (if provided)
- `summary`: Summary of test results
  - `totalTests`: Total number of tests
  - `successCount`: Number of successful tests
  - `clarificationCount`: Number of tests requiring clarification
  - `matchCount`: Number of tests with matching codes
  - `averageProcessingTime`: Average processing time in seconds

## Managing Prompt Template Assignments

### Assign Template to Organizations

Assign a prompt template to organizations:

```javascript
const assignTemplateToOrganizations = async (token, templateId, organizationIds, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/prompts/${templateId}/assign`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        organizationIds,
        notes
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to assign template to organizations:', error);
    throw error;
  }
};
```

### Unassign Template from Organizations

Unassign a prompt template from organizations:

```javascript
const unassignTemplateFromOrganizations = async (token, templateId, organizationIds, notes = '') => {
  try {
    const response = await fetch(`/api/superadmin/prompts/${templateId}/unassign`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        organizationIds,
        notes
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to unassign template from organizations:', error);
    throw error;
  }
};
```

### Get Template Assignments

Retrieve organizations assigned to a prompt template:

```javascript
const getTemplateAssignments = async (token, templateId, page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/superadmin/prompts/${templateId}/assignments?page=${page}&limit=${limit}`, {
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
    console.error('Failed to retrieve template assignments:', error);
    throw error;
  }
};
```

The response will include:
- `assignments`: Array of assignment records
- `pagination`: Pagination information

Each assignment record includes:
- `organizationId`: Organization ID
- `organizationName`: Organization name
- `assignedAt`: Date the template was assigned
- `assignedBy`: User who assigned the template
- `usageCount`: Number of times the template has been used by this organization
- `performanceMetrics`: Performance metrics for this organization

## Monitoring Prompt Template Performance

### Get Template Performance Metrics

Retrieve performance metrics for a prompt template:

```javascript
const getTemplatePerformanceMetrics = async (token, templateId, timeframe = '30d') => {
  try {
    const response = await fetch(`/api/superadmin/prompts/${templateId}/metrics?timeframe=${timeframe}`, {
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
    console.error('Failed to retrieve template performance metrics:', error);
    throw error;
  }
};
```

The `timeframe` parameter can be one of:
- `7d`: Last 7 days
- `30d`: Last 30 days
- `90d`: Last 90 days
- `1y`: Last year

The response will include:
- `accuracy`: Accuracy percentage
- `clarificationRate`: Clarification rate percentage
- `overrideRate`: Override rate percentage
- `averageProcessingTime`: Average processing time in seconds
- `usageCount`: Number of times the template has been used
- `tokenUsage`: Token usage statistics
- `dailyMetrics`: Array of daily metrics
- `topCptCodes`: Most frequently assigned CPT codes
- `topIcd10Codes`: Most frequently assigned ICD-10 codes
- `organizationPerformance`: Performance breakdown by organization

### Get Template Validation Logs

Retrieve validation logs for a prompt template:

```javascript
const getTemplateValidationLogs = async (token, templateId, filters = {}, page = 1, limit = 20) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await fetch(`/api/superadmin/prompts/${templateId}/validation-logs?${queryParams}`, {
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
    console.error('Failed to retrieve template validation logs:', error);
    throw error;
  }
};
```

The `filters` object can include:
- `organizationId`: Filter by organization ID
- `status`: Filter by validation status (success, clarification_needed, override)
- `startDate`: Filter by start date
- `endDate`: Filter by end date

The response will include:
- `logs`: Array of validation log records
- `pagination`: Pagination information

Each log record includes:
- `id`: Log ID
- `timestamp`: Validation timestamp
- `organizationId`: Organization ID
- `organizationName`: Organization name
- `userId`: User ID
- `userName`: User name
- `status`: Validation status
- `processingTime`: Processing time in seconds
- `tokenUsage`: Token usage
- `cptCodes`: Assigned CPT codes
- `icd10Codes`: Assigned ICD-10 codes
- `requiresClarification`: Whether clarification was needed
- `isOverride`: Whether override was used

## Error Handling

When working with superadmin prompt management endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions (non-superadmin role)
- 404 Not Found: Prompt template not found
- 409 Conflict: Conflict with existing data
- 422 Unprocessable Entity: Cannot perform the requested operation
- 500 Internal Server Error: Error in the LLM service

## Best Practices

1. **Document template changes**: Always provide detailed notes for template changes
2. **Test thoroughly before activation**: Test templates with various dictation samples
3. **Use version control**: Create new versions for significant changes
4. **Monitor performance metrics**: Regularly review template performance
5. **Assign templates strategically**: Assign templates based on organization needs
6. **Maintain backward compatibility**: Ensure new versions don't break existing integrations
7. **Optimize token usage**: Balance prompt complexity with token efficiency
8. **Implement gradual rollouts**: Roll out new templates to a subset of organizations first
9. **Collect feedback**: Gather feedback from organizations using the templates
10. **Document template design**: Maintain documentation of template design decisions