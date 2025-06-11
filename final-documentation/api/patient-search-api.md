# Patient Search API Documentation

**Version:** 1.1 - Dictation-Only Implementation  
**Date:** June 10, 2025  
**Status:** Implementation Complete

## Overview

The Patient Search API provides a dictation-based patient search endpoint for physicians. Since this is a dictation-only platform, physicians speak the patient name and date of birth, and the system searches for matching patients. If no match is found, the order is tagged with the patient name and DOB for administrative staff to process later.

## Endpoint

### Search Patients by Name and Date of Birth

Search for patients using dictated patient name and date of birth.

**Endpoint:** `POST /api/patients/search`

**Method:** POST (because it receives dictation data in the body)

**Authentication:** Required (JWT token)

**Authorization:** Physician role only

#### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| patientName | string | Yes | Full patient name from dictation (e.g., "John Doe", "Doe, John") |
| dateOfBirth | string | Yes | Date of birth from dictation in natural language |

**Example Request Bodies:**
```json
{
  "patientName": "John Doe",
  "dateOfBirth": "March 1st 1980"
}
```

```json
{
  "patientName": "Doe, John",
  "dateOfBirth": "March first nineteen eighty"
}
```

```json
{
  "patientName": "John Michael Doe",
  "dateOfBirth": "3/1/1980"
}
```

#### Response

**Success Response with Matches (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "pidn": "P-12345",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1980-01-15",
      "gender": "male",
      "mrn": "MRN123456",
      "lastVisit": "2025-01-05T14:30:00.000Z"
    }
  ]
}
```

**Success Response with No Matches (200 OK):**
```json
{
  "success": true,
  "data": [],
  "message": "No matching patients found. Order will be tagged with patient name and DOB for administrative processing."
}
```

**Error Responses:**

- **400 Bad Request:** Missing required parameters
```json
{
  "success": false,
  "message": "Both patient name and date of birth are required"
}
```


- **401 Unauthorized:** User not authenticated or organization not found
```json
{
  "success": false,
  "message": "User organization not found"
}
```

- **500 Internal Server Error:** Database or server error
```json
{
  "success": false,
  "message": "Failed to search patients"
}
```

#### Example Request

```bash
curl -X POST https://api.radorderpad.com/api/patients/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "John Doe",
    "dateOfBirth": "March 1st 1980"
  }'
```

## Implementation Details

### Search Logic

1. **Name Parsing:**
   - Handles multiple name formats: "John Doe", "Doe, John", "John Michael Doe"
   - For names with commas, assumes "Last, First" format
   - For space-separated names, assumes "First Last" or "First Middle Last"
   - Searches both exact and partial matches

2. **Date of Birth Matching:**
   - Handles natural language dates from dictation
   - Supports formats like:
     - "March 1st 1980", "March first nineteen eighty"  
     - "3/1/1980", "03-01-1980"
     - "March 1 80" (assumes 1980)
     - Already formatted "1980-03-01"
   - Converts to YYYY-MM-DD for database search

3. **Result Ordering:**
   - Patients with recent visits appear first
   - Limited to 10 results maximum (appropriate for dictation workflow)

4. **No Match Behavior:**
   - Returns empty array with informative message
   - Order creation continues with patient name and DOB tagged for admin processing

### Workflow Integration

1. **Physician Dictation Flow:**
   - Physician dictates: "Patient name is John Doe, date of birth January 15, 1980"
   - System converts to: `{ "patientName": "John Doe", "dateOfBirth": "1980-01-15" }`
   - Search is performed automatically
   - If found: Patient ID is linked to order
   - If not found: Order is created with name/DOB for admin to complete

2. **Administrative Processing:**
   - Admin staff review orders without matched patients
   - They can search for existing patients or create new patient records
   - Complete patient information is added during administrative finalization

### Security Considerations

1. **Authentication:** JWT token required
2. **Authorization:** Physician-only access
3. **Organization Isolation:** Automatic filtering by user's organization
4. **Input Validation:** Name trimming and date format validation

### Performance Considerations

1. **Optimized Query:**
   - Uses indexed columns (organization_id, date_of_birth)
   - Limited to 10 results
   - Efficient name matching with proper indexing

2. **Database Indexes Needed:**
   - `patients.organization_id`
   - `patients.date_of_birth`
   - Composite: `(organization_id, date_of_birth)`
   - Full text or trigram index on name fields for better matching

## Frontend Integration Example

```javascript
// Search for patients from dictation
async function searchPatientsFromDictation(patientName, dateOfBirth) {
  const response = await fetch('/api/patients/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      patientName,
      dateOfBirth
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to search patients');
  }
  
  const result = await response.json();
  
  // Handle the response
  if (result.data.length > 0) {
    // Patient(s) found - let physician select if multiple matches
    return result.data;
  } else {
    // No patients found - will be tagged for admin
    console.log(result.message);
    return [];
  }
}

// Example usage with dictation
const handleDictationComplete = async (dictationResult) => {
  // Extract patient info from dictation
  const { patientName, dateOfBirth } = parseDictation(dictationResult);
  
  // Search for existing patients
  const patients = await searchPatientsFromDictation(patientName, dateOfBirth);
  
  if (patients.length === 1) {
    // Single match - use this patient
    selectedPatientId = patients[0].id;
  } else if (patients.length > 1) {
    // Multiple matches - show selection UI
    showPatientSelectionDialog(patients);
  } else {
    // No match - continue with name/DOB only
    proceedWithoutPatientMatch(patientName, dateOfBirth);
  }
};
```

## Testing

### Test Script Updates

```javascript
// Updated test script for dictation-based search
const testPatientSearch = async () => {
  const token = 'your-physician-jwt-token';
  
  // Test successful search
  const searchResponse = await fetch('http://localhost:3001/api/patients/search', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      patientName: 'John Doe',
      dateOfBirth: '1980-01-15'
    })
  });
  console.log('Search results:', await searchResponse.json());
  
  // Test no matches
  const noMatchResponse = await fetch('http://localhost:3001/api/patients/search', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      patientName: 'Nonexistent Patient',
      dateOfBirth: '1990-01-01'
    })
  });
  console.log('No match results:', await noMatchResponse.json());
};
```