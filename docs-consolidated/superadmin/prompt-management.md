# Superadmin Prompt Management Guide

This guide covers the prompt management capabilities available to superadmins in the RadOrderPad API.

## Prerequisites

- You must have a superadmin role
- You must have a valid JWT token with superadmin privileges

## Prompt Management Overview

Superadmins have comprehensive capabilities for managing LLM prompts, including:

1. Creating and updating prompt templates
2. Managing prompt assignments to physicians
3. Testing prompts with sample cases
4. Analyzing prompt performance
5. Comparing different prompt versions
6. Setting up A/B testing experiments

## Prompt Templates

Prompt templates are the foundation of the LLM validation system. They define the structure and content of the prompts sent to the LLM for validating radiology orders.

### List Prompt Templates

Retrieve a list of all prompt templates:

```javascript
const listPromptTemplates = async (token, filters = {}, page = 1, limit = 20) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await fetch(`/api/superadmin/prompts/templates?${queryParams}`, {
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
    console.error('Failed to list prompt templates:', error);
    throw error;
  }
};
```

The `filters` object can include:
- `name`: Filter by template name
- `version`: Filter by template version
- `status`: Filter by template status (active, inactive, draft)
- `createdAfter`: Filter by creation date
- `createdBefore`: Filter by creation date
- `search`: Search term for template content

The response will include:
- `templates`: Array of template records
- `pagination`: Pagination information

Each template record includes:
- `id`: Template ID
- `name`: Template name
- `version`: Template version
- `description`: Template description
- `status`: Template status
- `content`: Template content
- `parameters`: Template parameters
- `createdBy`: ID of the user who created the template
- `createdAt`: Date the template was created
- `updatedAt`: Date the template was last updated
- `usageCount`: Number of times the template has been used
- `successRate`: Success rate of the template
- `averageTokens`: Average number of tokens used by the template
- `averageLatency`: Average latency of the template

### Get Prompt Template

Retrieve a specific prompt template:

```javascript
const getPromptTemplate = async (token, templateId) => {
  try {
    const response = await fetch(`/api/superadmin/prompts/templates/${templateId}`, {
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
    console.error('Failed to get prompt template:', error);
    throw error;
  }
};
```

The response will include detailed information about the template, including:
- `id`: Template ID
- `name`: Template name
- `version`: Template version
- `description`: Template description
- `status`: Template status
- `content`: Template content
- `parameters`: Template parameters
- `createdBy`: ID of the user who created the template
- `createdAt`: Date the template was created
- `updatedAt`: Date the template was last updated
- `usageCount`: Number of times the template has been used
- `successRate`: Success rate of the template
- `averageTokens`: Average number of tokens used by the template
- `averageLatency`: Average latency of the template
- `versions`: Array of previous versions of the template
- `assignments`: Array of assignments of the template to physicians

### Create Prompt Template

Create a new prompt template:

```javascript
const createPromptTemplate = async (token, templateData) => {
  try {
    const response = await fetch('/api/superadmin/prompts/templates', {
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
- `content`: Template content (required)
- `parameters`: Template parameters (optional)
- `status`: Template status (optional, default: 'draft')

### Update Prompt Template

Update an existing prompt template:

```javascript
const updatePromptTemplate = async (token, templateId, templateData) => {
  try {
    const response = await fetch(`/api/superadmin/prompts/templates/${templateId}`, {
      method: 'PUT',
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
    console.error('Failed to update prompt template:', error);
    throw error;
  }
};
```

The `templateData` object can include any of the fields mentioned in the create operation.

### Delete Prompt Template

Delete a prompt template:

```javascript
const deletePromptTemplate = async (token, templateId) => {
  try {
    const response = await fetch(`/api/superadmin/prompts/templates/${templateId}`, {
      method: 'DELETE',
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
    console.error('Failed to delete prompt template:', error);
    throw error;
  }
};
```

## Prompt Assignments

Prompt assignments link prompt templates to specific physicians, allowing for personalized prompt experiences.

### List Prompt Assignments

Retrieve a list of all prompt assignments:

```javascript
const listPromptAssignments = async (token, filters = {}, page = 1, limit = 20) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await fetch(`/api/superadmin/prompts/assignments?${queryParams}`, {
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
    console.error('Failed to list prompt assignments:', error);
    throw error;
  }
};
```

The `filters` object can include:
- `templateId`: Filter by template ID
- `userId`: Filter by user ID
- `organizationId`: Filter by organization ID
- `status`: Filter by assignment status (active, inactive)
- `createdAfter`: Filter by creation date
- `createdBefore`: Filter by creation date

The response will include:
- `assignments`: Array of assignment records
- `pagination`: Pagination information

Each assignment record includes:
- `id`: Assignment ID
- `templateId`: Template ID
- `userId`: User ID
- `userName`: User name
- `organizationId`: Organization ID
- `organizationName`: Organization name
- `status`: Assignment status
- `createdAt`: Date the assignment was created
- `updatedAt`: Date the assignment was last updated
- `usageCount`: Number of times the assignment has been used
- `successRate`: Success rate of the assignment

### Get Prompt Assignment

Retrieve a specific prompt assignment:

```javascript
const getPromptAssignment = async (token, assignmentId) => {
  try {
    const response = await fetch(`/api/superadmin/prompts/assignments/${assignmentId}`, {
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
    console.error('Failed to get prompt assignment:', error);
    throw error;
  }
};
```

The response will include detailed information about the assignment, including:
- `id`: Assignment ID
- `templateId`: Template ID
- `templateName`: Template name
- `templateVersion`: Template version
- `userId`: User ID
- `userName`: User name
- `organizationId`: Organization ID
- `organizationName`: Organization name
- `status`: Assignment status
- `createdAt`: Date the assignment was created
- `updatedAt`: Date the assignment was last updated
- `usageCount`: Number of times the assignment has been used
- `successRate`: Success rate of the assignment
- `overrideRate`: Override rate of the assignment
- `clarificationRate`: Clarification rate of the assignment
- `averageTokens`: Average number of tokens used by the assignment
- `averageLatency`: Average latency of the assignment

### Create Prompt Assignment

Create a new prompt assignment:

```javascript
const createPromptAssignment = async (token, assignmentData) => {
  try {
    const response = await fetch('/api/superadmin/prompts/assignments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(assignmentData)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to create prompt assignment:', error);
    throw error;
  }
};
```

The `assignmentData` object should include:
- `templateId`: Template ID (required)
- `userId`: User ID (required)
- `status`: Assignment status (optional, default: 'active')

### Update Prompt Assignment

Update an existing prompt assignment:

```javascript
const updatePromptAssignment = async (token, assignmentId, assignmentData) => {
  try {
    const response = await fetch(`/api/superadmin/prompts/assignments/${assignmentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(assignmentData)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update prompt assignment:', error);
    throw error;
  }
};
```

The `assignmentData` object can include:
- `templateId`: Template ID
- `status`: Assignment status

### Delete Prompt Assignment

Delete a prompt assignment:

```javascript
const deletePromptAssignment = async (token, assignmentId) => {
  try {
    const response = await fetch(`/api/superadmin/prompts/assignments/${assignmentId}`, {
      method: 'DELETE',
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
    console.error('Failed to delete prompt assignment:', error);
    throw error;
  }
};
```

## Prompt Testing

### Test Prompt Template

Test a prompt template with a sample case:

```javascript
const testPromptTemplate = async (token, templateId, testData) => {
  try {
    const response = await fetch(`/api/superadmin/prompts/templates/${templateId}/test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
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

The `testData` object should include:
- `orderData`: Sample order data (required)
- `parameters`: Template parameters (optional)
- `llmProvider`: LLM provider to use (optional)
- `modelName`: Model name to use (optional)

The response will include:
- `result`: Test result
  - `status`: Validation status
  - `response`: LLM response
  - `tokens`: Token usage
  - `latency`: Latency in milliseconds
  - `error`: Error message (if any)
- `prompt`: Rendered prompt
- `parameters`: Template parameters used
- `llmProvider`: LLM provider used
- `modelName`: Model name used

### Compare Prompt Templates

Compare multiple prompt templates with a sample case:

```javascript
const comparePromptTemplates = async (token, templateIds, testData) => {
  try {
    const response = await fetch('/api/superadmin/prompts/templates/compare', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        templateIds,
        ...testData
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to compare prompt templates:', error);
    throw error;
  }
};
```

The `templateIds` parameter is an array of template IDs to compare.

The `testData` object should include:
- `orderData`: Sample order data (required)
- `parameters`: Template parameters (optional)
- `llmProvider`: LLM provider to use (optional)
- `modelName`: Model name to use (optional)

The response will include an array of test results, one for each template.

## A/B Testing

### Create A/B Test

Create a new A/B test experiment:

```javascript
const createAbTest = async (token, testData) => {
  try {
    const response = await fetch('/api/superadmin/prompts/ab-tests', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to create A/B test:', error);
    throw error;
  }
};
```

The `testData` object should include:
- `name`: Test name (required)
- `description`: Test description (required)
- `templateA`: Template A ID (required)
- `templateB`: Template B ID (required)
- `distribution`: Distribution percentage for template A (optional, default: 50)
- `criteria`: Selection criteria (optional)
  - `organizationIds`: Array of organization IDs
  - `userIds`: Array of user IDs
  - `specialties`: Array of specialties
- `startDate`: Start date (optional, default: now)
- `endDate`: End date (optional)
- `status`: Test status (optional, default: 'active')

### List A/B Tests

Retrieve a list of all A/B tests:

```javascript
const listAbTests = async (token, filters = {}, page = 1, limit = 20) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await fetch(`/api/superadmin/prompts/ab-tests?${queryParams}`, {
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
    console.error('Failed to list A/B tests:', error);
    throw error;
  }
};
```

The response will include:
- `tests`: Array of A/B test records
- `pagination`: Pagination information

### Get A/B Test Results

Retrieve the results of an A/B test:

```javascript
const getAbTestResults = async (token, testId) => {
  try {
    const response = await fetch(`/api/superadmin/prompts/ab-tests/${testId}/results`, {
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
    console.error('Failed to get A/B test results:', error);
    throw error;
  }
};
```

The response will include:
- `id`: Test ID
- `name`: Test name
- `description`: Test description
- `templateA`: Template A information
  - `id`: Template ID
  - `name`: Template name
  - `version`: Template version
- `templateB`: Template B information
  - `id`: Template ID
  - `name`: Template name
  - `version`: Template version
- `distribution`: Distribution percentage for template A
- `startDate`: Start date
- `endDate`: End date
- `status`: Test status
- `results`: Test results
  - `templateA`: Template A results
    - `usageCount`: Number of times template A was used
    - `successRate`: Success rate of template A
    - `overrideRate`: Override rate of template A
    - `clarificationRate`: Clarification rate of template A
    - `averageTokens`: Average number of tokens used by template A
    - `averageLatency`: Average latency of template A
  - `templateB`: Template B results
    - `usageCount`: Number of times template B was used
    - `successRate`: Success rate of template B
    - `overrideRate`: Override rate of template B
    - `clarificationRate`: Clarification rate of template B
    - `averageTokens`: Average number of tokens used by template B
    - `averageLatency`: Average latency of template B
  - `comparison`: Comparison of the two templates
    - `successRateDiff`: Difference in success rate
    - `overrideRateDiff`: Difference in override rate
    - `clarificationRateDiff`: Difference in clarification rate
    - `tokensDiff`: Difference in token usage
    - `latencyDiff`: Difference in latency
    - `winner`: Winner of the test (A, B, or null if no clear winner)
    - `confidence`: Confidence level of the winner determination

## Prompt Analytics

### Get Prompt Analytics

Retrieve analytics for prompt templates:

```javascript
const getPromptAnalytics = async (token, filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams(filters).toString();
    
    const response = await fetch(`/api/superadmin/prompts/analytics?${queryParams}`, {
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
    console.error('Failed to get prompt analytics:', error);
    throw error;
  }
};
```

The `filters` object can include:
- `templateId`: Filter by template ID
- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `organizationId`: Filter by organization ID
- `userId`: Filter by user ID

The response will include:
- `overall`: Overall analytics
  - `usageCount`: Total number of prompt uses
  - `successRate`: Overall success rate
  - `overrideRate`: Overall override rate
  - `clarificationRate`: Overall clarification rate
  - `averageTokens`: Overall average token usage
  - `averageLatency`: Overall average latency
- `byTemplate`: Analytics broken down by template
- `byOrganization`: Analytics broken down by organization
- `byUser`: Analytics broken down by user
- `byDay`: Analytics broken down by day
- `byHour`: Analytics broken down by hour
- `byModality`: Analytics broken down by modality
- `byStatus`: Analytics broken down by validation status

## Error Handling

When working with superadmin prompt management endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions (non-superadmin role)
- 404 Not Found: Resource not found
- 409 Conflict: Conflict with existing data
- 422 Unprocessable Entity: Cannot perform the requested operation

## Best Practices

1. **Version control**: Keep track of prompt template versions and changes
2. **Test thoroughly**: Test prompt templates with a variety of sample cases before deployment
3. **Monitor performance**: Regularly review prompt analytics to identify areas for improvement
4. **Use A/B testing**: Use A/B testing to compare different prompt templates
5. **Document changes**: Document all changes to prompt templates
6. **Optimize for token usage**: Optimize prompt templates to minimize token usage
7. **Balance precision and recall**: Aim for a balance between precision and recall in validation results
8. **Consider user feedback**: Incorporate feedback from physicians and radiologists
9. **Maintain consistency**: Ensure consistent validation results across similar cases
10. **Iterate and improve**: Continuously iterate and improve prompt templates based on performance data