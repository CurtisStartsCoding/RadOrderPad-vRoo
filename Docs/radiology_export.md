# Radiology Order Export Functionality

**Version:** 1.0
**Date:** 2025-04-20

This document describes the implementation of the Radiology Order Export functionality, which allows radiology groups to export order data in various formats (JSON, CSV, PDF) for integration with their own systems.

---

## Overview

The Radiology Order Export functionality provides an API endpoint that allows radiology groups to export complete order data in different formats. This enables them to manually enter or import order data into their own RIS, PACS, or billing systems without requiring direct integration.

## API Endpoint

```
GET /api/radiology/orders/{orderId}/export/{format}
```

- **orderId**: The ID of the order to export
- **format**: The export format (json, csv, pdf)

## Supported Export Formats

### JSON Export
Returns the complete order details as a JSON object. This is the most comprehensive format and includes all data related to the order.

### CSV Export
Returns the order data as a CSV string. The CSV format flattens the nested data structure into a single row with columns for all relevant fields. This is suitable for importing into spreadsheets or systems that accept CSV imports.

### PDF Export (Stub)
Currently returns a simple JSON representation as a Buffer. In a future implementation, this will be replaced with a properly formatted PDF document.

## Implementation Details

### Controller (`export-order.controller.ts`)
- Handles the API endpoint
- Validates the request parameters (orderId, format)
- Sets appropriate headers based on the format
- Calls the service to export the order
- Returns the exported data with proper status codes

### Service (`order-export/export-order.ts`)
- Validates the export format
- Fetches the complete order details
- Calls the appropriate export function based on the format
- Returns the exported data

### Format Validation (`order-export/validate-export-format.ts`)
- Validates that the requested format is supported
- Throws appropriate errors for invalid formats

### JSON Export (`order-export/export-as-json.ts`)
- Simply returns the complete order details object
- No transformation is needed as the data is already in JSON format

### CSV Export (`export/csv-export/generate-csv-export.ts`)
- Flattens the nested order data into a single row
- Handles arrays (like ICD-10 codes) by joining them into a single cell
- Uses PapaParse to generate the CSV string
- Includes fields for:
  - Order information (ID, status, priority, modality, etc.)
  - Patient information
  - Insurance information (primary and secondary)
  - Referring information
  - Clinical records summary
  - Document uploads
  - Validation information
  - Order history

### PDF Export (`export/pdf-export.ts`)
- Currently a stub implementation that returns a JSON representation as a Buffer
- In a future implementation, this will be replaced with a properly formatted PDF document using a library like PDFKit or jsPDF

## Testing

The export functionality can be tested using the provided test scripts:

### Windows (`test-radiology-export.bat`)
```batch
@echo off
REM Test script for Radiology Order Export functionality

echo Testing Radiology Order Export functionality...

REM Set variables
set BASE_URL=http://localhost:3000/api
set ORDER_ID=5
set AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

echo.
echo === Testing JSON Export ===
curl -s -o test-results\order-export.json -w "Status: %%{http_code}\nContent-Type: %%{content_type}\n" ^
  -X GET "%BASE_URL%/radiology/orders/%ORDER_ID%/export/json" ^
  -H "Authorization: Bearer %AUTH_TOKEN%"

echo.
echo === Testing CSV Export ===
curl -s -o test-results\order-export.csv -w "Status: %%{http_code}\nContent-Type: %%{content_type}\n" ^
  -X GET "%BASE_URL%/radiology/orders/%ORDER_ID%/export/csv" ^
  -H "Authorization: Bearer %AUTH_TOKEN%"

echo.
echo === Testing PDF Export (Stub) ===
curl -s -o test-results\order-export.pdf -w "Status: %%{http_code}\nContent-Type: %%{content_type}\n" ^
  -X GET "%BASE_URL%/radiology/orders/%ORDER_ID%/export/pdf" ^
  -H "Authorization: Bearer %AUTH_TOKEN%"

echo.
echo === Testing Invalid Format ===
curl -s -w "Status: %%{http_code}\nResponse: %%{response_body}\n" ^
  -X GET "%BASE_URL%/radiology/orders/%ORDER_ID%/export/invalid" ^
  -H "Authorization: Bearer %AUTH_TOKEN%"

echo.
echo Test completed. Check test-results directory for exported files.
echo.

pause
```

### Linux/macOS (`test-radiology-export.sh`)
```bash
#!/bin/bash
# Test script for Radiology Order Export functionality

echo "Testing Radiology Order Export functionality..."

# Set variables
BASE_URL="http://localhost:3000/api"
ORDER_ID=5
AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Create test-results directory if it doesn't exist
mkdir -p test-results

echo
echo "=== Testing JSON Export ==="
curl -s -o test-results/order-export.json -w "Status: %{http_code}\nContent-Type: %{content_type}\n" \
  -X GET "${BASE_URL}/radiology/orders/${ORDER_ID}/export/json" \
  -H "Authorization: Bearer ${AUTH_TOKEN}"

echo
echo "=== Testing CSV Export ==="
curl -s -o test-results/order-export.csv -w "Status: %{http_code}\nContent-Type: %{content_type}\n" \
  -X GET "${BASE_URL}/radiology/orders/${ORDER_ID}/export/csv" \
  -H "Authorization: Bearer ${AUTH_TOKEN}"

echo
echo "=== Testing PDF Export (Stub) ==="
curl -s -o test-results/order-export.pdf -w "Status: %{http_code}\nContent-Type: %{content_type}\n" \
  -X GET "${BASE_URL}/radiology/orders/${ORDER_ID}/export/pdf" \
  -H "Authorization: Bearer ${AUTH_TOKEN}"

echo
echo "=== Testing Invalid Format ==="
curl -s -w "Status: %{http_code}\nResponse: %{response_body}\n" \
  -X GET "${BASE_URL}/radiology/orders/${ORDER_ID}/export/invalid" \
  -H "Authorization: Bearer ${AUTH_TOKEN}"

echo
echo "Test completed. Check test-results directory for exported files."
echo
```

## Future Enhancements

1. **PDF Export**: Implement a proper PDF export using a library like PDFKit or jsPDF
2. **FHIR Export**: Add support for exporting as FHIR resources
3. **HL7 Export**: Add support for exporting as HL7 messages
4. **Bulk Export**: Add support for exporting multiple orders at once