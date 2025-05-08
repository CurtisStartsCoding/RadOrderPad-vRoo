# RadOrderPad Validation Engine Documentation

This directory contains the consolidated documentation for the RadOrderPad Validation Engine. The documentation has been organized into logical sections based on audience and purpose to eliminate redundancies and provide a clear source of truth for each aspect of the validation engine.

## Documentation Structure

### Frontend Documentation (`/frontend`)

Documentation for frontend developers implementing the validation workflow in the user interface.

- **[validation-engine-integration.md](./frontend/validation-engine-integration.md)**: Technical guide for integrating with the validation engine from a frontend application. Covers API contracts, state management, error handling, and implementation patterns.
  
- **[validation-workflow-guide.md](./frontend/validation-workflow-guide.md)**: Comprehensive guide to the validation workflow, including the user-facing process, best practices for clinical dictation, and implementation considerations.

### Backend Documentation (`/backend`)

Documentation for backend developers working on the validation engine implementation.

- **[validation-engine-architecture.md](./backend/validation-engine-architecture.md)**: Detailed overview of the validation engine architecture, including components, data flow, configuration, and error handling.
  
- **[validation-engine-implementation.md](./backend/validation-engine-implementation.md)**: Implementation guide with code examples, configuration details, and best practices for developers working on the validation engine.

### Testing Documentation (`/testing`)

Documentation for QA engineers and developers testing the validation engine.

- **[validation-engine-testing.md](./testing/validation-engine-testing.md)**: Comprehensive test cases and procedures for the validation engine, including expected results, troubleshooting guidance, and monitoring strategies.

### Product Documentation (`/product`)

Documentation for product managers and UI designers working on the validation workflow.

- **[validation-feedback-logic.md](./product/validation-feedback-logic.md)**: Detailed explanation of how validation feedback is generated, structured, scored, and displayed to the referring physician.

### Feature Documentation (`/features`)

Documentation for specific features of the RadOrderPad application.

- **[trial-feature.md](./features/trial-feature.md)**: Comprehensive guide to the Physician Trial Sandbox feature, which allows physicians to test the validation engine without full registration or PHI involvement.

### Workflow Documentation (`/workflow`)

Detailed documentation about the application workflows, UI flows, and API interactions that utilize the validation engine.

- **[ui_stepflow_logic.md](./workflow/ui_stepflow_logic.md)**: Outlines the high-level screen sequences and UI state transitions for the primary user workflows in RadOrderPad.

- **[physician_dictation_experience_with_override_schema_update.md](./workflow/physician_dictation_experience_with_override_schema_update.md)**: Contains React component code and implementation details for the physician dictation experience, including the override functionality.

- **[physician_order_flow.md](./workflow/physician_order_flow.md)**: Describes the end-to-end workflow for a physician using RadOrderPad to submit a radiology order, including the validation loop and override flow.

- **[workflow-guide.md](./workflow/workflow-guide.md)**: Provides a comprehensive guide to the API workflow for the RadOrderPad application, focusing on the full physician order with validation and finalization.

### Admin Workflow Documentation (`/admin-workflow`)

Comprehensive documentation for the Admin Order Management and Finalization workflow, which bridges the gap between physician order creation and radiology processing.

- **[README.md](./admin-workflow/README.md)**: Overview and navigation guide for the admin workflow documentation.

- **[workflow-guide.md](./admin-workflow/workflow-guide.md)**: Comprehensive end-to-end workflow guide for the admin finalization process.

- **[api-integration.md](./admin-workflow/api-integration.md)**: API details and integration guide for frontend developers implementing the admin workflow.

- **[implementation-details.md](./admin-workflow/implementation-details.md)**: Backend implementation details for developers working on the admin workflow.

- **[database-architecture.md](./admin-workflow/database-architecture.md)**: Details on the dual-database architecture used in the admin workflow.

- **[testing-reference.md](./admin-workflow/testing-reference.md)**: References to test files and testing guidelines for the admin workflow.

### Authentication Documentation (`/authentication`)

Comprehensive documentation for the authentication system, including regular and trial user authentication flows.

- **[README.md](./authentication/README.md)**: Overview and navigation guide for the authentication documentation.

- **[api-reference.md](./authentication/api-reference.md)**: Detailed API endpoint documentation for registration, login, token refresh, and password reset.

- **[regular-auth-guide.md](./authentication/regular-auth-guide.md)**: Implementation guide for standard authentication flow, including token management and authenticated requests.

- **[trial-auth-guide.md](./authentication/trial-auth-guide.md)**: Implementation guide for trial user authentication, including trial-specific limitations and status management.

### Superadmin Documentation (`/superadmin`)

Comprehensive documentation for the superadmin functionality, providing system-wide administration capabilities.

- **[README.md](./superadmin/README.md)**: Overview and navigation guide for the superadmin documentation.

- **[overview.md](./superadmin/overview.md)**: High-level overview of the superadmin role and capabilities, including purpose, access, key features, and panels.

- **[api-reference.md](./superadmin/api-reference.md)**: Detailed API endpoint documentation for organization management, user management, system logs, and prompt management.

- **[organization-management.md](./superadmin/organization-management.md)**: Comprehensive guide for managing organizations as a superadmin.

- **[user-management.md](./superadmin/user-management.md)**: Detailed guide for managing users as a superadmin.

- **[system-monitoring.md](./superadmin/system-monitoring.md)**: In-depth guide for monitoring system health and performance.

- **[prompt-management.md](./superadmin/prompt-management.md)**: Comprehensive guide for managing LLM prompts.

## Audience-Based Guide

### For Frontend Developers

Start with [validation-engine-integration.md](./frontend/validation-engine-integration.md) for technical integration details, then refer to [validation-workflow-guide.md](./frontend/validation-workflow-guide.md) for a broader understanding of the workflow. For UI implementation details, see the [workflow documentation](./workflow/). For admin workflow integration, see [admin-workflow/api-integration.md](./admin-workflow/api-integration.md). For authentication implementation, see [authentication/api-reference.md](./authentication/api-reference.md) and [authentication/regular-auth-guide.md](./authentication/regular-auth-guide.md).

### For Backend Developers

Begin with [validation-engine-architecture.md](./backend/validation-engine-architecture.md) for an overview of the system architecture, then dive into [validation-engine-implementation.md](./backend/validation-engine-implementation.md) for implementation details. For API workflow details, see [workflow-guide.md](./workflow/workflow-guide.md). For admin workflow implementation, see [admin-workflow/implementation-details.md](./admin-workflow/implementation-details.md). For authentication implementation, see [authentication/api-reference.md](./authentication/api-reference.md). For superadmin functionality, see [superadmin/api-reference.md](./superadmin/api-reference.md) and [superadmin/overview.md](./superadmin/overview.md).

### For QA Engineers

Focus on [validation-engine-testing.md](./testing/validation-engine-testing.md) for test cases, expected results, and troubleshooting guidance. For end-to-end workflow testing, refer to [physician_order_flow.md](./workflow/physician_order_flow.md). For admin workflow testing, see [admin-workflow/testing-reference.md](./admin-workflow/testing-reference.md).

### For Product Managers

Review [validation-workflow-guide.md](./frontend/validation-workflow-guide.md) for a high-level understanding of the workflow, then explore [validation-feedback-logic.md](./product/validation-feedback-logic.md) for details on feedback presentation. For UI flow details, see [ui_stepflow_logic.md](./workflow/ui_stepflow_logic.md). For admin workflow overview, see [admin-workflow/workflow-guide.md](./admin-workflow/workflow-guide.md).

### For Feature Implementation

If you're working on specific features:
- For the trial feature, refer to [trial-feature.md](./features/trial-feature.md) for a comprehensive guide to the Physician Trial Sandbox.
- For the physician order workflow, refer to the [workflow documentation](./workflow/).
- For the admin finalization workflow, refer to the [admin-workflow documentation](./admin-workflow/).
- For authentication implementation, refer to the [authentication documentation](./authentication/).
- For superadmin functionality, refer to the [superadmin documentation](./superadmin/).

## Original Documentation

This consolidated documentation replaces the following original files:

1. `frontend-explanation\validation-engine-integration.md`
2. `frontend-explanation\API_IMPLEMENTATION_GUIDE\validation-engine-integration.md`
3. `frontend-explanation\validation-workflow-guide.md`
4. `DOCS\validation_engine_overview.md`
5. `DOCS\implementation\validation-engine-architecture.md`
6. `DOCS\implementation\VALIDATION_ENGINE_README.md`
7. `DOCS\implementation\validation-engine-implementation-report.md`
8. `DOCS\implementation\VALIDATION_ENGINE_TESTING.md`
9. `DOCS\validation_feedback_logic.md`
10. `frontend-explanation\API_IMPLEMENTATION_GUIDE\trial_feature.md`
11. `frontend-explanation\API_IMPLEMENTATION_GUIDE\trial_feature.yaml`
12. `DOCS\ui_stepflow_logic.md`
13. `DOCS\physician_dictation_experience_with_override_schema_update.md`
14. `DOCS\physician_order_flow.md`
15. `frontend-explanation\API_IMPLEMENTATION_GUIDE\workflow-guide.md`
16. `DOCS\admin_finalization.md`
17. `DOCS\implementation\admin-finalization-implementation.md`
18. `frontend-explanation\API_IMPLEMENTATION_GUIDE\admin-finalization-api-guide.md`
19. `frontend-explanation\API_IMPLEMENTATION_GUIDE\admin-order-management.md`
20. `frontend-explanation\ADMIN_FINALIZATION_FIX_GUIDE.md`
21. `frontend-explanation\api-docs\tutorials\order-workflows\admin-workflow.md`
22. `frontend-explanation\api-docs\openapi\paths\admin-orders.yaml`
23. `frontend-explanation\API_IMPLEMENTATION_GUIDE\order-management.md` (partially related to admin workflow)
24. `frontend-explanation\API_IMPLEMENTATION_GUIDE\authentication.md`
25. `frontend-explanation\api-docs\tutorials\authentication\regular-auth.md`
26. `frontend-explanation\api-docs\tutorials\authentication\trial-auth.md`
27. `frontend-explanation\API_IMPLEMENTATION_GUIDE\superadmin_feature.yaml`
28. `frontend-explanation\API_IMPLEMENTATION_GUIDE\superadmin-logs.md`
29. `frontend-explanation\API_IMPLEMENTATION_GUIDE\superadmin-management.md`
30. `DOCS\super_admin.md`
31. `frontend-explanation\api-docs\tutorials\superadmin\organization-management.md`
32. `frontend-explanation\api-docs\tutorials\superadmin\system-monitoring.md`
33. `frontend-explanation\api-docs\openapi\paths\superadmin.yaml`

The original files have been archived for reference but should no longer be used or updated.