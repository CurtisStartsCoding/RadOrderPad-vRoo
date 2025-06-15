# Utilities API Endpoints

**Last Updated:** June 15, 2025

## Overview

The utilities endpoints provide proxy services and lookup functionality that the frontend needs to interact with external APIs, bypassing CORS restrictions and providing consistent data formatting.

## Authentication

All utility endpoints require authentication with a valid JWT token. Any authenticated user can access these endpoints.

## Endpoints

### 1. NPI Lookup

Lookup physician information from the CMS NPI Registry.

```
GET /api/utilities/npi-lookup?number={npiNumber}
```

**Query Parameters:**
- `number` (required) - 10-digit NPI number

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "number": "1234567890",
    "basic": {
      "firstName": "John",
      "lastName": "Smith",
      "middleName": "A",
      "namePrefix": "Dr.",
      "nameSuffix": "Jr.",
      "credential": "MD",
      "gender": "M",
      "status": "A",
      "soleProprietor": "NO",
      "organizationName": "",
      "enumerationDate": "2005-05-23",
      "lastUpdated": "2023-07-08"
    },
    "addresses": [
      {
        "addressPurpose": "LOCATION",
        "addressType": "DOM",
        "address1": "123 Medical Plaza",
        "address2": "Suite 100",
        "city": "Boston",
        "state": "MA",
        "postalCode": "02115",
        "countryCode": "US",
        "telephoneNumber": "617-555-0123",
        "faxNumber": "617-555-0124"
      },
      {
        "addressPurpose": "MAILING",
        "addressType": "DOM",
        "address1": "PO Box 1234",
        "address2": "",
        "city": "Boston",
        "state": "MA",
        "postalCode": "02115",
        "countryCode": "US",
        "telephoneNumber": "",
        "faxNumber": ""
      }
    ],
    "taxonomies": [
      {
        "code": "207R00000X",
        "description": "Internal Medicine",
        "primary": true,
        "state": "MA",
        "license": "12345"
      },
      {
        "code": "207RC0000X",
        "description": "Cardiovascular Disease",
        "primary": false,
        "state": "MA",
        "license": "12345"
      }
    ],
    "primaryTaxonomy": "Internal Medicine"
  }
}
```

**Error Response (400) - Invalid NPI:**
```json
{
  "success": false,
  "error": "Invalid NPI number. Must be exactly 10 digits."
}
```

**Error Response (404) - NPI Not Found:**
```json
{
  "success": false,
  "error": "NPI number not found in registry"
}
```

**Error Response (500) - Server Error:**
```json
{
  "success": false,
  "error": "Internal server error during NPI lookup"
}
```

## Frontend Integration

### Example Usage with apiRequest

```javascript
// In your React component
const lookupNPI = async (npiNumber) => {
  try {
    const response = await apiRequest('GET', `/api/utilities/npi-lookup?number=${npiNumber}`, undefined);
    
    if (response.ok) {
      const result = await response.json();
      
      if (result.success) {
        // Auto-populate form fields
        setFormData({
          firstName: result.data.basic.firstName,
          lastName: result.data.basic.lastName,
          credential: result.data.basic.credential,
          specialty: result.data.primaryTaxonomy,
          npi: npiNumber
        });
        
        toast({
          title: "NPI Found",
          description: `Loaded information for ${result.data.basic.firstName} ${result.data.basic.lastName}`,
          variant: "success"
        });
      }
    } else {
      const error = await response.json();
      toast({
        title: "NPI Lookup Failed",
        description: error.error,
        variant: "destructive"
      });
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to lookup NPI",
      variant: "destructive"
    });
  }
};
```

### Form Integration Example

```jsx
<div className="flex gap-2">
  <Input
    id="npi"
    name="npi"
    value={formData.npi}
    onChange={handleInputChange}
    placeholder="10-digit NPI"
    maxLength={10}
  />
  <Button
    type="button"
    variant="outline"
    onClick={() => lookupNPI(formData.npi)}
    disabled={formData.npi.length !== 10}
  >
    Lookup NPI
  </Button>
</div>
```

## Benefits

1. **Bypasses CORS restrictions** - Backend server can call any external API
2. **Consistent data formatting** - Transforms snake_case API responses to camelCase
3. **Error handling** - Provides clear error messages for various failure scenarios
4. **Auto-population** - Reduces manual data entry for physician information
5. **Validation** - Ensures NPI is valid format before making API call

## Rate Limiting

The NPI Registry API has rate limits. To avoid hitting these limits:
- Frontend should debounce lookup requests
- Consider implementing caching on the backend for frequently looked up NPIs
- Show loading state during lookup to prevent multiple clicks

## Future Enhancements

1. **Caching** - Cache NPI lookups for 24 hours to reduce API calls
2. **Batch lookup** - Support looking up multiple NPIs in one request
3. **Additional lookups** - DEA number verification, state medical license lookup
4. **Webhook updates** - Subscribe to NPI Registry updates for cached data