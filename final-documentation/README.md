# RadOrderPad API Documentation

This directory contains comprehensive documentation for the RadOrderPad API backend.

## System Overview

RadOrderPad is a clinical decision support platform that:
1. Guides physicians to create appropriate imaging orders using ACR Appropriate Use Criteria
2. Automatically generates proper CPT/ICD-10 codes from clinical dictation
3. Routes completed orders to radiology groups for fulfillment

## Documentation Index

### API Documentation
- [Order Creation Endpoints Reference](api/order-creation-endpoints-reference.md) - POST /api/orders endpoint for finalizing clinically appropriate orders with signatures before routing to radiology
- [Patient Search API](api/patient-search-api.md) - POST /api/patients/search endpoint for dictation-based patient lookup by name and date of birth
- [Validation Endpoints Reference](api/validation-endpoints-reference.md) - POST /api/orders/validate clinical decision support endpoint that ensures imaging appropriateness per ACR criteria
- [Verified API Reference](api/verified-api-reference.md) - Comprehensive API reference for all verified and tested endpoints

### Backend Documentation
- [Validation Engine Architecture](backend/validation-engine-architecture.md) - Technical architecture of the clinical decision support engine powering ACR-based appropriateness checks

### Frontend Documentation
- [Validation Engine Integration](frontend/validation-engine-integration.md) - Guide for integrating the validation engine into frontend applications
- [Validation Workflow Guide](frontend/validation-workflow-guide.md) - Step-by-step workflow showing how physicians refine clinical dictation based on ACR feedback until approved (codes shown only when appropriate)

### Order Process Documentation
- [Complete Order Workflow](order-process/complete-order-workflow.md) - End-to-end process from physician dictation through clinical decision support to radiology group routing

### Testing Documentation
- [Order Finalization Testing](testing/order-finalization-testing.md) - Comprehensive testing guide for the order finalization process including test scripts and scenarios

## Using This Documentation

This documentation is designed to be a comprehensive reference for developers working on the RadOrderPad API backend. Each section provides detailed information about a specific aspect of the system.

For new developers, we recommend starting with the System Architecture overview, then exploring the Complete Order Workflow documentation to understand the core business process.

## Maintaining Documentation

When making changes to the codebase, please ensure that the relevant documentation is updated to reflect those changes. This helps maintain the documentation as a reliable source of truth for the system.

## Related Resources

- [DOCS](../DOCS) - Legacy documentation directory
- [docs-consolidated](../docs-consolidated) - Consolidated documentation from various sources