# API Documentation Reorganization Plan for RadOrderPad

## Overview

This plan outlines a comprehensive approach to reorganize the RadOrderPad API documentation into a more structured and maintainable format. The reorganization will create a new directory with OpenAPI/Swagger specification files and tutorial-style documentation, while preserving all existing documentation files.

## Requirements

1. Create new files in a new directory, leaving all existing files untouched
2. Ensure no monolithic documents - files should be limited to 300-400 lines maximum
3. The directory structure should be logical and well-organized
4. All information from the original files should be preserved and properly organized
5. Include a main index file that helps navigate the documentation

## Directory Structure

```
frontend-explanation/
├── API_IMPLEMENTATION_GUIDE/  (existing directory - untouched)
│   ├── README.md
│   ├── README-deleted-info.md
│   ├── README-that-was-deleted.md
│   ├── README-connection-fixes.md
│   ├── README-file-upload.md
│   ├── README-organization-profile.md
│   ├── README-recent-implementations.md
│   ├── README-user-management.md
│   └── ... (other existing files)
│
└── api-docs/  (new directory)
    ├── index.md  (main navigation file)
    ├── architecture/
    │   ├── overview.md  (system architecture overview)
    │   ├── dual-database.md  (PHI and Main database architecture)
    │   └── security-model.md  (authentication and authorization)
    ├── openapi/  (OpenAPI specification files)
    │   ├── openapi.yaml  (main OpenAPI file that references others)
    │   ├── components/  (reusable components)
    │   │   ├── schemas.yaml  (data models)
    │   │   ├── parameters.yaml  (common parameters)
    │   │   ├── responses.yaml  (common responses)
    │   │   └── security-schemes.yaml  (authentication methods)
    │   ├── paths/  (endpoint definitions)
    │   │   ├── auth.yaml  (authentication endpoints)
    │   │   ├── users.yaml  (user management endpoints)
    │   │   ├── user-invites.yaml  (user invitation endpoints)
    │   │   ├── user-locations.yaml  (user location assignment endpoints)
    │   │   ├── organizations.yaml  (organization endpoints)
    │   │   ├── locations.yaml  (location management endpoints)
    │   │   ├── connections.yaml  (connection management endpoints)
    │   │   ├── orders.yaml  (order management endpoints)
    │   │   ├── orders-validation.yaml  (validation endpoints)
    │   │   ├── admin-orders.yaml  (admin order endpoints)
    │   │   ├── radiology.yaml  (radiology workflow endpoints)
    │   │   ├── uploads.yaml  (file upload endpoints)
    │   │   ├── billing.yaml  (billing management endpoints)
    │   │   ├── superadmin-organizations.yaml  (superadmin organization endpoints)
    │   │   ├── superadmin-users.yaml  (superadmin user endpoints)
    │   │   ├── superadmin-prompts.yaml  (superadmin prompt management endpoints)
    │   │   └── superadmin-logs.yaml  (superadmin logs endpoints)
    │   └── tags.yaml  (API tags for grouping endpoints)
    │
    └── tutorials/  (workflow-oriented documentation)
        ├── getting-started.md  (initial setup and authentication)
        ├── authentication/
        │   ├── regular-auth.md  (standard authentication)
        │   └── trial-auth.md  (trial user authentication)
        ├── user-management/
        │   ├── user-profiles.md  (managing user profiles)
        │   ├── user-invitation.md  (inviting and onboarding users)
        │   └── location-assignment.md  (assigning users to locations)
        ├── organization-management/
        │   ├── organization-profile.md  (managing organization profiles)
        │   └── location-management.md  (managing organization locations)
        ├── connections/
        │   ├── requesting-connections.md  (initiating connections)
        │   ├── managing-requests.md  (approving/rejecting requests)
        │   └── terminating-connections.md  (ending connections)
        ├── order-workflows/
        │   ├── validation-workflow.md  (detailed validation process)
        │   ├── physician-workflow.md  (order creation and signing)
        │   ├── admin-workflow.md  (admin finalization process)
        │   └── radiology-workflow.md  (radiology processing)
        ├── trial-features/
        │   └── physician-sandbox.md  (trial validation workflow)
        ├── file-uploads/
        │   ├── direct-to-s3.md  (using presigned URLs)
        │   └── document-management.md  (managing uploaded files)
        ├── billing/
        │   ├── credit-management.md  (managing credits)
        │   └── subscription-management.md  (managing subscriptions)
        └── superadmin/
            ├── organization-management.md  (managing organizations)
            ├── user-management.md  (managing users)
            ├── prompt-management.md  (managing prompt templates and assignments)
            └── system-monitoring.md  (using logs for monitoring)
```

## OpenAPI Specification Structure

The OpenAPI specification will be split into multiple files for maintainability, with each file limited to 300-400 lines. The main `openapi.yaml` file will reference the other files using `$ref` syntax.

### Main OpenAPI File (openapi.yaml)

```yaml
openapi: 3.0.3
info:
  title: RadOrderPad API
  description: |
    API for the RadOrderPad application that enables physicians to create and validate radiology orders,
    administrative staff to finalize orders, and radiology organizations to process orders.
    
    The API is organized into several functional areas:
    - Authentication and user management
    - Organization and location management
    - Connection management between organizations
    - Order validation and processing
    - Administrative finalization
    - Radiology workflow
    - File uploads
    - Billing and credit management
    - Superadmin functionality
  version: 1.9.0
servers:
  - url: https://api.radorderpad.com
    description: Production server
tags:
  $ref: './tags.yaml'
paths:
  # Authentication
  $ref: './paths/auth.yaml'
  
  # User Management
  $ref: './paths/users.yaml'
  $ref: './paths/user-invites.yaml'
  $ref: './paths/user-locations.yaml'
  
  # Organization Management
  $ref: './paths/organizations.yaml'
  $ref: './paths/locations.yaml'
  
  # Connection Management
  $ref: './paths/connections.yaml'
  
  # Order Management
  $ref: './paths/orders.yaml'
  $ref: './paths/orders-validation.yaml'
  $ref: './paths/admin-orders.yaml'
  $ref: './paths/radiology.yaml'
  
  # File Uploads
  $ref: './paths/uploads.yaml'
  
  # Billing Management
  $ref: './paths/billing.yaml'
  
  # Superadmin Functionality
  $ref: './paths/superadmin-organizations.yaml'
  $ref: './paths/superadmin-users.yaml'
  $ref: './paths/superadmin-prompts.yaml'
  $ref: './paths/superadmin-logs.yaml'
components:
  schemas:
    $ref: './components/schemas.yaml'
  parameters:
    $ref: './components/parameters.yaml'
  responses:
    $ref: './components/responses.yaml'
  securitySchemes:
    $ref: './components/security-schemes.yaml'
```

## File Content Structure

Each OpenAPI path file will follow a consistent format with these sections:

1. **Tag Association** - Group endpoints by functional area
2. **Summary and Description** - Brief overview of the endpoint's purpose
3. **Operation ID** - Unique identifier for the operation
4. **Security Requirements** - Authentication requirements
5. **Parameters** - Path, query, and header parameters
6. **Request Body** - Expected request format
7. **Responses** - Possible response formats with status codes
8. **Examples** - Sample requests and responses

### Example Path File (orders-validation.yaml)

```yaml
# Order Validation Endpoints
'/orders/validate':
  post:
    tags:
      - Orders
      - Validation
    summary: Submit dictation for validation
    description: |
      Submits clinical dictation for validation by the LLM engine. On first call for an order, 
      creates a draft order record and returns orderId. Handles subsequent clarifications and 
      the final override validation call (using provided orderId and isOverrideValidation flag).
      
      This endpoint interacts with both PHI and Main databases:
      - Reads: patients (PHI), prompt_templates (Main), prompt_assignments (Main), medical_* tables (Main)
      - Writes: orders (PHI - Create draft on first call), validation_attempts (PHI), 
                llm_validation_logs (Main), order_history (PHI)
    operationId: validateOrder
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              dictation:
                type: string
                description: The clinical dictation text to validate
              orderId:
                type: string
                description: For subsequent validation attempts, the ID of the existing order
              isOverrideValidation:
                type: boolean
                description: Whether this is an override validation after multiple failed attempts
              patientInfo:
                $ref: '../components/schemas.yaml#/PatientInfo'
              modalityType:
                type: string
                enum: [CT, MRI, XRAY, ULTRASOUND, PET, NUCLEAR]
                description: The type of imaging modality
            required:
              - dictation
              - modalityType
    responses:
      '200':
        description: Successful validation
        content:
          application/json:
            schema:
              type: object
              properties:
                success:
                  type: boolean
                  example: true
                data:
                  type: object
                  properties:
                    orderId:
                      type: string
                      description: The ID of the created or updated order
                    validationResult:
                      $ref: '../components/schemas.yaml#/ValidationResult'
                    requiresClarification:
                      type: boolean
                      description: Whether additional clarification is needed
                    clarificationPrompt:
                      type: string
                      description: The prompt for clarification if needed
                    attemptNumber:
                      type: integer
                      description: The current validation attempt number
      '400':
        $ref: '../components/responses.yaml#/BadRequest'
      '401':
        $ref: '../components/responses.yaml#/Unauthorized'
      '403':
        $ref: '../components/responses.yaml#/Forbidden'
      '503':
        description: LLM Service Unavailable
        content:
          application/json:
            schema:
              type: object
              properties:
                success:
                  type: boolean
                  example: false
                message:
                  type: string
                  example: "Validation service temporarily unavailable. Please try again later."
```

## Tutorial Documentation Structure

The tutorial documentation will focus on common workflows and use cases, providing step-by-step guides with practical examples. Each tutorial will be limited to 300-400 lines and will follow a consistent format:

1. **Overview** - Brief description of the workflow
2. **Prerequisites** - Required setup or permissions
3. **Step-by-Step Guide** - Detailed instructions with code examples
4. **Error Handling** - Common errors and how to handle them
5. **Best Practices** - Recommendations for implementation

### Example Tutorial (validation-workflow.md)

```markdown
# Validation Workflow

This guide covers the complete validation workflow for submitting clinical dictation and obtaining CPT and ICD-10 codes.

## Prerequisites

- You must have a physician role
- Your organization must be active
- You should have a valid JWT token

## Workflow Overview

The validation workflow consists of these steps:

1. Submit initial dictation
2. Handle clarification requests (if needed)
3. Override validation (if needed after 3 failed attempts)
4. Finalize and sign the order

## Step 1: Submit Initial Dictation

Submit the clinical dictation to the validation endpoint:

```javascript
const submitDictation = async (dictation, modalityType, token) => {
  try {
    const response = await fetch('/api/orders/validate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dictation,
        modalityType
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to validate dictation:', error);
    throw error;
  }
};
```

The response will include:
- `orderId`: The ID of the created draft order
- `validationResult`: The validation result with CPT and ICD-10 codes
- `requiresClarification`: Whether additional clarification is needed
- `clarificationPrompt`: The prompt for clarification if needed
- `attemptNumber`: The current validation attempt number

## Step 2: Handle Clarification Requests

If `requiresClarification` is true, you need to submit additional information:

```javascript
const submitClarification = async (orderId, dictation, token) => {
  try {
    const response = await fetch('/api/orders/validate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId,
        dictation
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to submit clarification:', error);
    throw error;
  }
};
```

## Step 3: Override Validation (If Needed)

After 3 failed attempts, you can submit an override validation:

```javascript
const submitOverride = async (orderId, dictation, token) => {
  try {
    const response = await fetch('/api/orders/validate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId,
        dictation,
        isOverrideValidation: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to submit override:', error);
    throw error;
  }
};
```

## Step 4: Finalize and Sign the Order

Once validation is successful, finalize and sign the order:

```javascript
const finalizeOrder = async (orderId, token) => {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'pending_admin'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to finalize order:', error);
    throw error;
  }
};
```

## Error Handling

When working with validation endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid input (e.g., missing required fields)
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions (non-physician role)
- 503 Service Unavailable: LLM service is temporarily unavailable

## Best Practices

1. Always provide clear, detailed clinical dictation
2. Include patient demographics (age, gender)
3. Include clinical symptoms (location, duration, severity)
4. Include relevant history (prior diagnoses, treatments)
5. Include clinical reasoning (suspected diagnosis, reason for study)
6. Handle clarification requests promptly
7. Implement retry logic for 503 errors
8. Store draft order IDs for resuming validation later
```

## Implementation Approach

1. **Create the new directory structure** - Set up the `api-docs` directory with all subdirectories
2. **Create the OpenAPI specification files** - Develop the OpenAPI YAML files for each functional area
3. **Create the tutorial documentation** - Develop workflow-oriented guides for common tasks
4. **Create the main index file** - Develop the central navigation document
5. **Ensure cross-referencing** - Add proper links between related documents
6. **Validate line counts** - Ensure no file exceeds 400 lines
7. **Review and finalize** - Perform a final review to ensure all content is preserved and properly organized

## Documentation Coverage

The reorganized documentation will cover all aspects of the API, including:

1. **Authentication** - Regular and trial user authentication
2. **User Management** - User profiles, invitations, and location assignments
3. **Organization Management** - Organization profiles and locations
4. **Connection Management** - Connection requests, approvals, rejections, and terminations
5. **Order Management** - Order creation, validation, and status updates
6. **Validation Engine** - Clinical dictation processing and code assignment
7. **Admin Finalization** - Administrative processing of orders
8. **Radiology Workflow** - Radiology order processing and status updates
9. **File Uploads** - File upload and management
10. **Billing Management** - Credit and subscription management
11. **Superadmin Functionality** - Organization, user, prompt, and log management
12. **Trial Features** - Physician sandbox functionality

## Benefits of This Approach

1. **Industry Standard Format** - OpenAPI/Swagger is widely recognized and supported
2. **Interactive Documentation** - OpenAPI files can be viewed in Swagger UI for interactive exploration
3. **Machine-Readable** - OpenAPI format can be consumed by various tools and code generators
4. **Practical Guidance** - Tutorial documentation provides real-world usage examples
5. **Maintainability** - Modular structure makes updates easier
6. **Comprehensive Coverage** - All API functionality is documented
7. **Frontend Developer Friendly** - Focus on what frontend developers need most

## Diagram of Documentation Structure

```mermaid
graph TD
    A[index.md] --> B[Architecture]
    A --> C[OpenAPI Specification]
    A --> D[Tutorial Documentation]
    
    B --> B1[overview.md]
    B --> B2[dual-database.md]
    B --> B3[security-model.md]
    
    C --> C1[openapi.yaml]
    C1 --> C2[Components]
    C1 --> C3[Paths]
    C1 --> C4[Tags]
    
    C2 --> C21[schemas.yaml]
    C2 --> C22[parameters.yaml]
    C2 --> C23[responses.yaml]
    C2 --> C24[security-schemes.yaml]
    
    C3 --> C31[auth.yaml]
    C3 --> C32[users.yaml]
    C3 --> C33[organizations.yaml]
    C3 --> C34[connections.yaml]
    C3 --> C35[orders.yaml]
    C3 --> C36[orders-validation.yaml]
    C3 --> C37[admin-orders.yaml]
    C3 --> C38[radiology.yaml]
    C3 --> C39[uploads.yaml]
    C3 --> C310[billing.yaml]
    C3 --> C311[superadmin-organizations.yaml]
    C3 --> C312[superadmin-users.yaml]
    C3 --> C313[superadmin-prompts.yaml]
    C3 --> C314[superadmin-logs.yaml]
    
    D --> D1[getting-started.md]
    D --> D2[Authentication]
    D --> D3[User Management]
    D --> D4[Organization Management]
    D --> D5[Connections]
    D --> D6[Order Workflows]
    D --> D7[Trial Features]
    D --> D8[File Uploads]
    D --> D9[Billing]
    D --> D10[Superadmin]
    
    D2 --> D21[regular-auth.md]
    D2 --> D22[trial-auth.md]
    
    D3 --> D31[user-profiles.md]
    D3 --> D32[user-invitation.md]
    D3 --> D33[location-assignment.md]
    
    D4 --> D41[organization-profile.md]
    D4 --> D42[location-management.md]
    
    D5 --> D51[requesting-connections.md]
    D5 --> D52[managing-requests.md]
    D5 --> D53[terminating-connections.md]
    
    D6 --> D61[validation-workflow.md]
    D6 --> D62[physician-workflow.md]
    D6 --> D63[admin-workflow.md]
    D6 --> D64[radiology-workflow.md]
    
    D7 --> D71[physician-sandbox.md]
    
    D8 --> D81[direct-to-s3.md]
    D8 --> D82[document-management.md]
    
    D9 --> D91[credit-management.md]
    D9 --> D92[subscription-management.md]
    
    D10 --> D101[organization-management.md]
    D10 --> D102[user-management.md]
    D10 --> D103[prompt-management.md]
    D10 --> D104[system-monitoring.md]