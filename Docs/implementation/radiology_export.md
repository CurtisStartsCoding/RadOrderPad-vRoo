# Radiology Order Export Implementation

**Version:** 1.0
**Date:** 2025-04-21

This document details the implementation of the Radiology Order Export functionality, which enables exporting order data in various formats (JSON, CSV, PDF) for integration with external systems.

## Overview

The Radiology Order Export functionality provides a way for radiology groups to export order data in different formats for use in their own systems. This implementation supports:

1. **JSON Export**: Complete, structured order data in JSON format
2. **CSV Export**: Flattened order data in CSV format for spreadsheet applications
3. **PDF Export**: (Stubbed) Order data in PDF format for printing and documentation

The export functionality leverages the denormalized HIPAA-compliant data now available in the `orders` table, ensuring that all necessary information is included in the exports without requiring joins from other databases.

## Implementation Details

### Core Components

1. **Export Service**: `src/services/order/radiology/order-export/export-order.ts`
   - Main function: `exportOrder(orderId: number, format: string, orgId: number)`
   - Validates the requested format and delegates to format-specific exporters

2. **JSON Export**: `src/services/order/radiology/order-export/export-as-json.ts`
   - Returns the complete order details object with minimal transformation
   - Includes all denormalized fields from the orders table
   - Handles missing required fields by providing meaningful default values:
     - "Unknown Physician" for referring_physician_name
     - "Not Available" for referring_physician_npi
     - "Unknown Organization" for referring_organization_name
     - "Unknown Radiology" for radiology_organization_name
   - Ensures exports pass validation even with incomplete order data

3. **CSV Export**: `src/services/order/radiology/order-export/generate-csv-export.ts`
   - Uses PapaParse to generate CSV from flattened order data
   - Includes all denormalized fields with appropriate headers

4. **PDF Export**: `src/services/order/radiology/export/pdf-export.ts`
   - Currently a stub implementation that returns a JSON representation as a buffer
   - Can be enhanced in the future with a proper PDF generation library

5. **Controller**: `src/controllers/radiology/export-order.controller.ts`
   - Handles the HTTP request/response
   - Sets appropriate headers based on the requested format
   - Returns the exported data with the correct content type

### Data Fields

The export includes all the denormalized HIPAA-compliant fields that were added to the `orders` table:

#### Referring Physician Information
- `referring_physician_name`
- `referring_physician_npi`
- `referring_physician_phone`
- `referring_physician_email`
- `referring_physician_fax`
- `referring_physician_address`
- `referring_physician_city`
- `referring_physician_state`
- `referring_physician_zip`
- `referring_physician_specialty`
- `referring_physician_license`

#### Referring Organization Information
- `referring_organization_name`
- `referring_organization_address`
- `referring_organization_city`
- `referring_organization_state`
- `referring_organization_zip`
- `referring_organization_phone`
- `referring_organization_fax`
- `referring_organization_email`
- `referring_organization_tax_id`
- `referring_organization_npi`

#### Radiology Organization Information
- `radiology_organization_name`
- `radiology_organization_address`
- `radiology_organization_city`
- `radiology_organization_state`
- `radiology_organization_zip`
- `radiology_organization_phone`
- `radiology_organization_fax`
- `radiology_organization_email`
- `radiology_organization_tax_id`
- `radiology_organization_npi`

#### Consent and Authorization Information
- `patient_consent_obtained`
- `patient_consent_date`
- `insurance_authorization_number`
- `insurance_authorization_date`
- `insurance_authorization_contact`
- `medical_necessity_documentation`

### Testing

The implementation includes a comprehensive test script (`test-radiology-export.js`) that:

1. Tests the JSON export to ensure it contains all required fields
2. Tests the CSV export to ensure it contains the correct headers and data
3. Tests the PDF export to ensure it returns a buffer

The test script can be run using the provided batch and shell scripts:
- Windows: `test-radiology-export.bat`
- Unix/Mac: `./test-radiology-export.sh`

## Usage

### API Endpoint

```
GET /api/radiology/orders/{orderId}/export/{format}
```

#### Parameters
- `orderId`: ID of the order to export
- `format`: Export format (json, csv, pdf)

#### Headers
- `Authorization`: Bearer token for authentication

#### Response
- For JSON: Content-Type: application/json
- For CSV: Content-Type: text/csv
- For PDF: Content-Type: application/pdf

#### Example
```
GET /api/radiology/orders/123/export/csv
```

## Future Enhancements

1. **PDF Export**: Implement a proper PDF export using a library like PDFKit or jsPDF
2. **FHIR Export**: Add support for exporting in FHIR format
3. **HL7 Export**: Add support for exporting in HL7 format
4. **Batch Export**: Allow exporting multiple orders at once
5. **Customizable Fields**: Allow users to select which fields to include in the export

## Related Documentation

- [Radiology Workflow](../radiology_workflow.md)
- [API Endpoints](../api_endpoints.md)
- [HIPAA Compliance Order Data](./hipaa_compliance_order_data.md)