# RadOrderPad API Documentation

This directory contains comprehensive documentation for the RadOrderPad API backend.

## System Overview

RadOrderPad is a clinical decision support platform that:
1. Guides physicians to create appropriate imaging orders using ACR Appropriate Use Criteria
2. Automatically generates proper CPT/ICD-10 codes from clinical dictation
3. Routes completed orders to radiology groups for fulfillment

## ⚠️ Critical Implementation Gap

**[Location Integration Not Implemented](CRITICAL-LOCATION-INTEGRATION-GAP.md)** - Orders are not filtered by location. In multi-location organizations, admin staff see ALL orders from ALL locations. This must be addressed before production deployment.

**[Implementation Plan Available](LOCATION-INTEGRATION-IMPLEMENTATION-PLAN.md)** - Detailed plan to implement location-based filtering using existing database fields (no schema changes required).

## Quick Navigation by Role

### For Physicians
- **[Complete API Documentation](api/physician-endpoints.md)** - All physician endpoints with examples
  - [Authentication](#authentication) - Login and session management
  - [Patient Search](#patient-search) - Find existing patients
  - [Order Validation](#validation) - ACR-based clinical validation
  - [Order Creation](#order-creation) - Create and finalize orders
  - [Profile Management](#profile) - Update user information

### For Admin Staff
- **[Complete API Documentation](api/admin-staff-endpoints.md)** - All administrative endpoints
  - [Order Queue](#queue) - View pending orders
  - [Patient Updates](#patient-info) - Add demographics
  - [Insurance Updates](#insurance) - Add insurance details
  - [Send to Radiology](#send-radiology) - Route completed orders

### For Admin Referring
- **[Organization Management](api/organization-user-management-endpoints.md)** - Manage org and users
- **[Connection Management](api/connection-management-endpoints.md)** - Partner relationships
- **[Billing & Credits](api/billing-credit-endpoints.md)** - Purchase and track credits

## Documentation Index

### API Documentation

#### Core References
- **[Common Endpoints](api/common-endpoints.md)** - Authentication, profiles, file uploads, and other shared endpoints
- **[Endpoint Access Matrix](api/endpoint-access-matrix.md)** - Complete matrix showing which roles can access which endpoints

#### Role-Specific Endpoints
- [Physician Endpoints](api/physician-endpoints.md) - Patient search, validation, and order creation
- [Admin Staff Endpoints](api/admin-staff-endpoints.md) - Order queue processing and administrative updates
- [Organization & User Management](api/organization-user-management-endpoints.md) - Admin-only management endpoints
- [Connection Management](api/connection-management-endpoints.md) - Partner relationship endpoints
- [Billing & Credits](api/billing-credit-endpoints.md) - Credit and subscription management

#### Detailed References
- [Patient Search API](api/patient-search-api.md) - POST /api/patients/search for dictation-based lookup
- [File Upload](api/file-upload-endpoints.md) - Document upload workflow with S3 integration
- [Verified API Reference](api/verified-api-reference.md) - Comprehensive reference for all verified endpoints

### Backend Documentation
- [Validation Engine Architecture](backend/validation-engine-architecture.md) - Technical architecture of the clinical decision support engine powering ACR-based appropriateness checks

### Frontend Documentation
- [Validation Engine Integration](frontend/validation-engine-integration.md) - Guide for integrating the validation engine into frontend applications
- [Validation Workflow Guide](frontend/validation-workflow-guide.md) - Step-by-step workflow showing how physicians refine clinical dictation based on ACR feedback until approved (codes shown only when appropriate)

### Order Process Documentation
- [Complete Order Workflow](order-process/complete-order-workflow.md) - End-to-end process from physician dictation through clinical decision support to radiology group routing

### Testing Documentation
- [Order Finalization Testing](testing/order-finalization-testing.md) - Comprehensive testing guide for the order finalization process including test scripts and scenarios
- [Role-Based Test Scripts](../all-backend-tests/role-tests/) - Working test scripts and results for each user role
  - [Physician Tests](../all-backend-tests/role-tests/physician-role-tests.js) - Complete physician workflow tests
  - [Admin Staff Tests](../all-backend-tests/role-tests/admin-staff-role-tests.js) - Admin queue and processing tests
  - [Admin Staff Test Results](../all-backend-tests/role-tests/admin-staff-workflow-summary.md) - Verified endpoint behaviors

## Using This Documentation

This documentation is designed to be a comprehensive reference for developers working on the RadOrderPad API backend.

### Getting Started
1. **Identify your role** - Use the Quick Navigation section above
2. **Review the workflow** - See [Complete Order Workflow](order-process/complete-order-workflow.md)
3. **Find your endpoints** - Each role has dedicated API documentation
4. **Test your integration** - Use the [testing guides](testing/) for validation

### For Frontend Developers
1. **Start with role documentation** - Each role has complete API specs with examples
2. **Check the access matrix** - See which endpoints your role can access
3. **Review test results** - Working examples show actual API responses
4. **Use common endpoints** - Authentication and file uploads are shared across roles

### Finding Information Quickly
- **By Role**: Use the Quick Navigation section at the top
- **By Feature**: Browse the Documentation Index
- **By Endpoint**: Use Ctrl+F in the relevant API documentation file
- **By Workflow**: Start with the order process documentation

## Maintaining Documentation

When making changes to the codebase, please ensure that the relevant documentation is updated to reflect those changes. This helps maintain the documentation as a reliable source of truth for the system.

## Related Resources

- [DOCS](../DOCS) - Legacy documentation directory
- [docs-consolidated](../docs-consolidated) - Consolidated documentation from various sources