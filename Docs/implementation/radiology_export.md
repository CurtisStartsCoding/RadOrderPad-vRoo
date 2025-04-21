# Radiology Order Export

**Version:** 1.0
**Date:** 2025-04-20

This document describes the implementation of the Radiology Order Export functionality, which allows users to export order data in various formats.

---

## Overview

The Radiology Order Export functionality enables users with the Scheduler or Radiology Admin role to export order data in different formats (JSON, CSV, PDF). This is particularly useful for integrating with external systems or for record-keeping purposes.

## API Endpoint

```
GET /api/radiology/orders/{orderId}/export/{format}
```

### Parameters

- `orderId`: The ID of the order to export
- `format`: The export format (json, csv, pdf)

### Authentication

Requires a valid JWT token with the Scheduler or Radiology Admin role.

### Response

The response will contain the exported data in the requested format with the appropriate Content-Type header:

- JSON: `application/json`
- CSV: `text/csv`
- PDF: `application/pdf`

## Implementation Details

### 1. Controller (`export-order.controller.ts`)

The controller handles the HTTP request, validates the parameters, and calls the appropriate service function. It also sets the appropriate Content-Type and Content-Disposition headers based on the requested format.

### 2. Export Service (`export-order.ts`)

The main export service function determines which export format to use and calls the appropriate function:

```typescript
export async function exportOrder(orderId: number, format: string, orgId: number): Promise<any> {
  // Validate format
  validateExportFormat(format);
  
  // Get order details
  const orderDetails = await getOrderDetails(orderId, orgId);
  
  // Export based on format
  switch (format) {
    case 'json':
      return exportAsJson(orderDetails);
    case 'csv':
      return generateCsvExport(orderDetails);
    case 'pdf':
      return generatePdfExport(orderDetails);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}
```

### 3. JSON Export (`export-as-json.ts`)

The JSON export simply returns the complete order details object:

```typescript
export function exportAsJson(orderDetails: OrderDetails): OrderDetails {
  return orderDetails;
}
```

### 4. CSV Export (`generate-csv-export.ts`)

The CSV export uses the PapaParse library to convert the order details to a CSV string. It flattens the nested data structure into a single row with columns for all relevant fields.

### 5. PDF Export (`pdf-export.ts`)

The PDF export is currently a stub implementation that returns a JSON representation as a Buffer. In a future implementation, this would be replaced with actual PDF generation code using a library like jsPDF.

## Testing

The export functionality can be tested using the provided test scripts:

- `test-radiology-export.bat` (Windows)
- `test-radiology-export.sh` (Linux/macOS)

These scripts test all supported export formats and verify that the API returns the correct status code and Content-Type header.

## Future Enhancements

1. **PDF Generation**: Implement actual PDF generation using a library like jsPDF.
2. **FHIR Export**: Add support for exporting order data in FHIR format.
3. **HL7 Export**: Add support for exporting order data as HL7 messages.
4. **Bulk Export**: Add support for exporting multiple orders at once.