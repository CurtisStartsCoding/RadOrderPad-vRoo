# Admin Order Management and Finalization

This directory contains comprehensive documentation for the Admin Order Management and Finalization workflow in the RadOrderPad system. This workflow is a critical bridge between physician order creation and radiology processing.

## Documentation Structure

- **[workflow-guide.md](./workflow-guide.md)**: Comprehensive end-to-end workflow guide
- **[api-integration.md](./api-integration.md)**: API details and integration guide
- **[implementation-details.md](./implementation-details.md)**: Backend implementation details
- **[database-architecture.md](./database-architecture.md)**: Details on the dual-database architecture
- **[testing-reference.md](./testing-reference.md)**: References to test files with explanations

## Workflow Overview

The Admin Finalization workflow allows administrative staff to add EMR context and send orders to radiology after they've been signed by physicians. The workflow consists of several steps:

1. **Access the Queue**: Admin staff access the queue of pending admin orders
2. **Add Patient Information**: Update patient demographics (address, city, state, zip code, etc.)
3. **Add Insurance Information**: Update insurance details if applicable
4. **Add Supplemental Documentation**: Paste any supplemental documentation from EMR
5. **Final Review**: Review all information for accuracy
6. **Send to Radiology**: Finalize the order and send it to the radiology group

## Audience Guide

### For Frontend Developers
Start with [api-integration.md](./api-integration.md) for details on API endpoints, request/response formats, and error handling. This document includes code examples for frontend integration.

### For Backend Developers
Begin with [implementation-details.md](./implementation-details.md) for information on the backend architecture, component interactions, and security considerations. Then explore [database-architecture.md](./database-architecture.md) for details on the dual-database design.

### For QA Engineers
Focus on [testing-reference.md](./testing-reference.md) for information on test coverage, guidelines for writing new tests, and common testing scenarios.

### For Product Managers
Review [workflow-guide.md](./workflow-guide.md) for a high-level understanding of the workflow, including step-by-step processes and common use cases.

## Key Technical Aspects

- **Dual-Database Architecture**: The system uses separate databases for PHI and non-PHI data
- **EMR Text Parsing**: The system extracts patient and insurance information from pasted EMR text
- **Credit Consumption**: The "Send to Radiology" operation consumes one credit from the organization's balance
- **Database Transaction Management**: Ensures data consistency across both databases

## Related Documentation

- [Validation Engine Documentation](../README.md): The validation engine is a key component of the order workflow
- [Workflow Documentation](../workflow/README.md): General workflow documentation for the RadOrderPad system