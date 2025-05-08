# Admin Finalization Workflow Guide

This document provides a comprehensive guide to the Admin Finalization workflow in the RadOrderPad system. This workflow is a critical bridge between physician order creation and radiology processing.

## Overview

The Admin Finalization workflow allows administrative staff to add EMR context and send orders to radiology after they've been signed by physicians. This workflow ensures that all necessary patient, insurance, and clinical information is included before the order is sent to the radiology organization.

## Prerequisites

- You must have an `admin_staff` or `admin_referring` role
- Your organization must be active
- Your organization must have sufficient credits
- Your organization must have an active connection with at least one radiology organization

## Workflow Steps

### Step 1: Access the Admin Queue

1. **Login**: Administrative staff logs into the RadOrderPad platform.
2. **Dashboard/Queue View**: User navigates to the order queue, filtered to show orders with `status = 'pending_admin'` for their organization.
3. **Select Order**: User selects the order they need to process.

### Step 2: Adding EMR Context

1. **Open Order Detail**: The order detail view displays the information already captured (Patient Name, DOB, PIDN, Physician, Dictation, Validation Result, Codes). It also presents input areas for missing context.
2. **Switch to EMR**: Admin staff navigates to the patient's chart in their EMR system (Athena, eCW, etc.).
3. **Copy EMR Summary**: User copies relevant sections from the EMR's patient summary page, including:
   - Patient Demographics (Address, Phone, Email - if not already captured)
   - Insurance Information (Primary/Secondary Carrier, Policy #, Group #, Subscriber Info)
   - Relevant Clinical History (Problem List, Allergies, Recent Labs, Prior Imaging Reports, Relevant Consult Notes)
4. **Paste into RadOrderPad**: User returns to RadOrderPad and pastes the copied EMR content into the designated "Paste EMR Summary" input box.
5. **Trigger Parsing**: User clicks "Process Paste" or similar button.
6. **Backend Processing**:
   - Backend receives the pasted text
   - Text parsing extracts key fields (patient contact, insurance, clinical data)
   - The raw pasted text is stored in `patient_clinical_records` with `record_type = 'emr_summary_paste'`
   - Extracted structured data updates corresponding fields in the database
7. **UI Update & Verification**: The UI refreshes, displaying the parsed information in dedicated fields. Admin staff visually verifies the accuracy of the parsed data and makes manual corrections if needed.

### Step 3: Handling Supplemental Documentation (Conditional)

1. **System Check**: Based on the validated `cpt_code` or `modality` associated with the order, the system checks if supplemental documentation is typically required.
2. **Prompt for Docs**: If required, the UI displays a prompt and a second input box labeled "Paste Supplemental Labs/Reports".
3. **Copy/Paste Supplemental**: Admin staff copies required documents from the EMR or other sources.
4. **Paste into RadOrderPad**: User pastes the content into the supplemental docs box.
5. **Store Supplemental**: Backend saves this content in `patient_clinical_records` with `record_type = 'supplemental_docs_paste'`.

### Step 4: Final Review & Submission

1. **Review Complete Order**: Admin staff reviews the complete order package displayed on the screen, ensuring all necessary information is present and accurate.
2. **Credit Check**: System verifies that the organization has sufficient credits to submit the order. If credits are insufficient, a warning is displayed and the "Send to Radiology" button is disabled.
3. **Send to Radiology**: User clicks the "Send to Radiology Group" or "Submit Final Order" button.
4. **Backend Processing**:
   - Backend verifies credit availability again
   - Backend updates the `orders` record status to `pending_radiology`
   - Backend consumes one credit from the organization's balance
   - Events are logged in `order_history` and `credit_usage_logs`
5. **Queue Update**: The order disappears from the `pending_admin` queue and now appears in the queue for the linked Radiology Group.
6. **Confirmation**: UI shows a success message. Admin staff returns to their queue.

## Common Scenarios

### Scenario 1: Basic Order Processing

1. Admin staff selects an order from the queue
2. Pastes EMR summary text containing patient and insurance information
3. System extracts and updates the information
4. Admin staff reviews and sends to radiology

### Scenario 2: Order with Supplemental Documentation

1. Admin staff selects an order from the queue
2. Pastes EMR summary text containing patient and insurance information
3. System extracts and updates the information
4. Admin staff pastes supplemental documentation (e.g., lab results, prior imaging reports)
5. Admin staff reviews and sends to radiology

### Scenario 3: Insufficient Credits

1. Admin staff selects an order from the queue
2. Processes the order as normal
3. When attempting to send to radiology, system displays "Insufficient Credits" warning
4. Admin staff or organization admin must purchase more credits before proceeding

## Error Handling

### Common Errors

- **400 Bad Request**: Invalid input (e.g., missing required fields)
- **401 Unauthorized**: Missing or invalid authentication token
- **402 Payment Required**: Insufficient credits to send to radiology
- **403 Forbidden**: Insufficient permissions (non-admin role)
- **404 Not Found**: Order not found or not in expected state
- **500 Internal Server Error**: Server-side error

### Handling Insufficient Credits

When the organization has insufficient credits, the system will return a 402 Payment Required error. The frontend should:

1. Display an "Insufficient Credits" modal
2. Show the current credit balance
3. Provide a direct link to the billing page for purchasing more credits
4. Optionally show quick-purchase options for common credit bundles

## Best Practices

1. **Complete All Information**: Ensure all required patient and insurance information is complete
2. **Verify Accuracy**: Double-check all information before sending to radiology
3. **Include Relevant EMR Context**: Add all relevant supplemental documentation from the EMR
4. **Monitor Credit Balance**: Regularly check your organization's credit balance
5. **Process Orders Promptly**: Process orders in a timely manner to avoid delays in patient care

## Database Interactions

The admin finalization process interacts with both databases:

### PHI Database
- Updates patient information in the `patients` table
- Updates insurance information in the `patient_insurance` table
- Stores supplemental documentation in the `patient_clinical_records` table
- Updates order status in the `orders` table
- Logs order history in the `order_history` table

### Main Database
- Checks and decrements the organization's credit balance in the `organizations` table
- Logs credit usage in the `credit_usage_logs` table

## Related Documentation

- [API Integration Guide](./api-integration.md): Details on the API endpoints used in this workflow
- [Implementation Details](./implementation-details.md): Backend implementation details
- [Database Architecture](./database-architecture.md): Details on the dual-database architecture
- [Testing Reference](./testing-reference.md): References to test files and testing guidelines