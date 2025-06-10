# Complete Order Workflow Documentation

This document serves as the single source of truth for the RadOrderPad order process workflow, from creation to finalization.

## Table of Contents

1. [Overview](#overview)
2. [Order Lifecycle](#order-lifecycle)
3. [API Endpoints](#api-endpoints)
4. [Database Schema](#database-schema)
5. [Code Structure](#code-structure)
6. [Testing](#testing)

## Overview

The RadOrderPad order process is a comprehensive workflow that enables physicians to create, validate, and finalize radiology orders. The process involves several key components:

1. **Dictation Validation**: Analyzing dictated text to extract clinical information
2. **Order Creation**: Creating an order record with patient information
3. **Order Finalization**: Finalizing the order with validation results and signature
4. **Document Management**: Handling signature uploads and other documents

## Order Lifecycle

### 1. Dictation Validation

The process begins with the physician dictating or typing the clinical information. This text is sent to the validation endpoint for analysis:

- The system extracts key clinical information from the dictation
- Suggested ICD-10 and CPT codes are automatically generated
- A validation status is determined (appropriate, inappropriate, or indeterminate)
- The validation result is returned to the client

### 2. Order Creation and Finalization

Once the dictation is validated, the order is created and finalized in a single step:

- Patient information is associated with the order
- The dictation text is stored
- The system automatically uses the suggested ICD-10 and CPT codes from validation
- The physician provides a signature
- The order is created with "pending_admin" status
- A signature document is created and stored
- Order history is updated with "order_created" and "order_signed" events

### 4. Administrative Processing

After finalization, the order enters the administrative workflow:

- Admin staff review the order
- Patient and insurance information may be updated
- The order is submitted to the radiology facility
- Status updates are tracked throughout the process

## API Endpoints

The order process is supported by the following key endpoints:

### Validation Endpoint

```
POST /api/orders/validate
```

**Request Body:**
```json
{
  "dictationText": "Patient text description...",
  "patientInfo": {
    "id": 123  // Optional, for contextual validation
  }
}
```

**Response:**
```json
{
  "validationResult": {
    "validationStatus": "appropriate",
    "suggestedICD10Codes": [...],
    "suggestedCPTCodes": [...],
    "extractedClinicalInfo": {...}
  }
}
```

### Order Creation and Finalization Endpoint

```
POST /api/orders
```

**Request Body:**
```json
{
  "patientInfo": {
    "id": 123
  },
  "dictationText": "Patient text description...",
  "finalValidationResult": {...},
  "isOverride": false,
  "signatureData": "data:image/png;base64,...",
  "signerFullName": "Dr. John Smith"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": 456
}
```

### Alternative Order Creation and Finalization (Separate Steps)

For testing and specific scenarios, these endpoints can also be used:

```
PUT /api/orders/new  // Create order
PUT /api/orders/:orderId  // Finalize order
```

## Database Schema

The order process interacts with several database tables:

### Main Tables

#### orders
- `id`: Primary key
- `patient_id`: Foreign key to patients table
- `status`: Order status (pending_admin, pending_radiology, completed, etc.)
- `dictation_text`: Original dictation text
- `created_at`: Timestamp
- `updated_at`: Timestamp

#### order_history
- `id`: Primary key
- `order_id`: Foreign key to orders table
- `event_type`: Type of event (order_created, order_signed, etc.)
- `event_data`: JSON data about the event
- `created_at`: Timestamp

#### validation_attempts
- `id`: Primary key
- `order_id`: Foreign key to orders table
- `validation_result`: JSON with validation data
- `is_final`: Boolean indicating if this is the final validation
- `created_at`: Timestamp

#### document_uploads
- `id`: Primary key
- `order_id`: Foreign key to orders table
- `patient_id`: Foreign key to patients table
- `user_id`: Foreign key to users table
- `file_path`: Path to the file in storage
- `filename`: Original filename
- `file_size`: Size in bytes
- `mime_type`: File MIME type
- `document_type`: Type of document (signature, report, etc.)
- `uploaded_at`: Timestamp

## Code Structure

The order process is implemented across several modules:

### Controllers

- `src/controllers/order-creation.controller.ts`: Handles order creation API endpoints
- `src/controllers/order-validation.controller.ts`: Handles validation API endpoints

### Services

The order creation process is modularized in the services directory:

- `src/services/order/creation/index.ts`: Main entry point for order creation
- `src/services/order/creation/handler.ts`: Orchestrates the order creation process
- `src/services/order/creation/patient-handling.ts`: Handles patient data processing
- `src/services/order/creation/order-persistence.ts`: Manages database operations
- `src/services/order/creation/signature-handling.ts`: Processes signature data
- `src/services/order/creation/llm-utils.ts`: Utilities for LLM integration
- `src/services/order/creation/types.ts`: Type definitions

### Key Functions

#### Order Creation

The main order creation function in `handler.ts`:

```typescript
export async function createAndFinalizeOrder(
  orderData: OrderCreationRequest,
  userId: number
): Promise<OrderCreationResponse> {
  // Implementation details...
}
```

#### Signature Handling

The signature handling function in `signature-handling.ts`:

```typescript
export async function handleSignature(
  client: PoolClient,
  orderId: number,
  patientId: number,
  userId: number,
  signatureData: string
): Promise<number> {
  // Implementation details...
}
```

## Testing

The order process is tested through several test files:

### Main Test Files

- `tests/test-order-finalization.js`: Tests the new combined order creation and finalization endpoint
- `tests/batch/test-order-finalization.js`: More comprehensive tests with multiple test cases

### Running Tests

Tests can be run using the following batch files:

- `run-order-test.bat`: Simple script to run the main test
- `tests/batch/run-order-finalization-tests.bat`: Script for batch tests
- `all-backend-tests/working-tests-4.bat`: Comprehensive test suite

For detailed information about testing, refer to the [Order Finalization Testing](../testing/order-finalization-testing.md) documentation.

## Conclusion

The order process is a critical workflow in the RadOrderPad system. This documentation provides a comprehensive overview of how the process works, from validation to finalization. By understanding this workflow, developers can effectively maintain and extend the system.