# RadOrderPad API Documentation

Welcome to the RadOrderPad API documentation. This comprehensive guide provides detailed information about the API endpoints, workflows, and implementation details for the RadOrderPad application.

## Documentation Structure

This documentation is organized into three main sections:

1. **[Architecture Overview](#architecture-overview)** - High-level system architecture and design
2. **[OpenAPI Specification](#openapi-specification)** - Detailed API reference in OpenAPI/Swagger format
3. **[Tutorial Guides](#tutorial-guides)** - Workflow-oriented guides for common tasks

## Architecture Overview

The architecture section provides a high-level overview of the RadOrderPad system:

- [System Overview](./architecture/overview.md) - General architecture and components
- [Dual Database Architecture](./architecture/dual-database.md) - PHI and Main database design
- [Security Model](./architecture/security-model.md) - Authentication and authorization

## OpenAPI Specification

The OpenAPI specification provides a detailed reference for all API endpoints:

- [OpenAPI Definition](./openapi/openapi.yaml) - Complete OpenAPI specification

The specification is organized by functional areas:

### Authentication and User Management
- [Authentication Endpoints](./openapi/paths/auth.yaml)
- [User Management Endpoints](./openapi/paths/users.yaml)
- [User Invitation Endpoints](./openapi/paths/user-invites.yaml)
- [User Location Assignment Endpoints](./openapi/paths/user-locations.yaml)

### Organization Management
- [Organization Endpoints](./openapi/paths/organizations.yaml)
- [Location Management Endpoints](./openapi/paths/locations.yaml)

### Connection Management
- [Connection Endpoints](./openapi/paths/connections.yaml)

### Order Management
- [Order Endpoints](./openapi/paths/orders.yaml)
- [Validation Endpoints](./openapi/paths/orders-validation.yaml)
- [Admin Order Endpoints](./openapi/paths/admin-orders.yaml)
- [Radiology Workflow Endpoints](./openapi/paths/radiology.yaml)

### File Uploads
- [File Upload Endpoints](./openapi/paths/uploads.yaml)

### Billing Management
- [Billing Endpoints](./openapi/paths/billing.yaml)

### Superadmin Functionality
- [Superadmin Organization Endpoints](./openapi/paths/superadmin-organizations.yaml)
- [Superadmin User Endpoints](./openapi/paths/superadmin-users.yaml)
- [Superadmin Prompt Management Endpoints](./openapi/paths/superadmin-prompts.yaml)
- [Superadmin Logs Endpoints](./openapi/paths/superadmin-logs.yaml)

## Tutorial Guides

The tutorial guides provide step-by-step instructions for common workflows:

- [Getting Started](./tutorials/getting-started.md) - Initial setup and authentication

### Authentication
- [Standard Authentication](./tutorials/authentication/regular-auth.md)
- [Trial User Authentication](./tutorials/authentication/trial-auth.md)

### User Management
- [Managing User Profiles](./tutorials/user-management/user-profiles.md)
- [Inviting and Onboarding Users](./tutorials/user-management/user-invitation.md)
- [Assigning Users to Locations](./tutorials/user-management/location-assignment.md)

### Organization Management
- [Managing Organization Profiles](./tutorials/organization-management/organization-profile.md)
- [Managing Organization Locations](./tutorials/organization-management/location-management.md)

### Connection Management
- [Initiating Connections](./tutorials/connections/requesting-connections.md)
- [Approving and Rejecting Requests](./tutorials/connections/managing-requests.md)
- [Terminating Connections](./tutorials/connections/terminating-connections.md)

### Order Workflows
- [Validation Workflow](./tutorials/order-workflows/validation-workflow.md) - Detailed validation process
- [Physician Workflow](./tutorials/order-workflows/physician-workflow.md) - Order creation and signing
- [Admin Workflow](./tutorials/order-workflows/admin-workflow.md) - Admin finalization process
- [Radiology Workflow](./tutorials/order-workflows/radiology-workflow.md) - Radiology processing

### Trial Features
- [Physician Sandbox](./tutorials/trial-features/physician-sandbox.md) - Trial validation workflow

### File Uploads
- [Direct-to-S3 Uploads](./tutorials/file-uploads/direct-to-s3.md) - Using presigned URLs
- [Document Management](./tutorials/file-uploads/document-management.md) - Managing uploaded files

### Billing
- [Credit Management](./tutorials/billing/credit-management.md)
- [Subscription Management](./tutorials/billing/subscription-management.md)

### Superadmin
- [Organization Management](./tutorials/superadmin/organization-management.md)
- [User Management](./tutorials/superadmin/user-management.md)
- [Prompt Management](./tutorials/superadmin/prompt-management.md)
- [System Monitoring](./tutorials/superadmin/system-monitoring.md)

## Additional Resources

- [API Endpoints Overview](../../DOCS/api_endpoints.md) - Comprehensive list of all API endpoints
- [API Schema Map](../../DOCS/api_schema_map.md) - Mapping of API endpoints to database tables