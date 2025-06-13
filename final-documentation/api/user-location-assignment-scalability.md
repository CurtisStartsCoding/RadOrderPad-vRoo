# User-Location Assignment - Scalability Considerations

## Current Limitations

The current user-location assignment system requires individual API calls for each user-location pair. This approach works well for small pilot groups but presents challenges at scale.

### The Scalability Challenge

For a practice with 100 physicians and 5 locations:
- **Initial Setup**: 500 individual API calls required
- **New Location Added**: 100 additional calls to assign all physicians
- **New Physician Onboarding**: 5 calls per physician
- **Reorganization**: Potentially thousands of calls to reassign users

### Current Workaround

Administrators can create scripts to automate bulk assignments:

```javascript
// Example bulk assignment script
const physicians = [1, 2, 3, 4, 5]; // ... up to 100
const locations = [10, 11, 12, 13, 14];

for (const userId of physicians) {
  for (const locationId of locations) {
    await api.post(`/api/users/${userId}/locations/${locationId}`);
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
```

## Recommended Future Enhancements

### 1. Bulk Assignment Endpoint
```
POST /api/users/:userId/locations/bulk
Body: {
  "locationIds": [10, 11, 12, 13, 14],
  "removeExisting": false  // Optional: clear existing assignments first
}
```

### 2. Bulk User Assignment to Location
```
POST /api/locations/:locationId/users/bulk
Body: {
  "userIds": [1, 2, 3, 4, 5],
  "userRole": "physician"  // Optional: filter by role
}
```

### 3. Default Location Assignment
```
PUT /api/organizations/mine/settings
Body: {
  "defaultLocationIds": [10, 11],  // Auto-assign to new users
  "autoAssignByRole": {
    "physician": [10, 11, 12],
    "admin_staff": [10, 11, 12, 13, 14]  // All locations
  }
}
```

### 4. Assignment Templates
```
POST /api/location-templates
Body: {
  "name": "Standard Physician Access",
  "locationIds": [10, 11, 12]
}

POST /api/users/:userId/apply-template/:templateId
```

### 5. Copy User Assignments
```
POST /api/users/:userId/locations/copy-from/:sourceUserId
```

### 6. Role-Based Auto-Assignment
```
POST /api/organizations/mine/location-rules
Body: {
  "rules": [
    {
      "role": "physician",
      "locationIds": [10, 11, 12],
      "applyToExisting": false,
      "applyToNew": true
    }
  ]
}
```

## Implementation Priority

For pilot phase, the current system is sufficient. As you scale beyond ~20-30 users, implement in this order:

1. **Bulk assignment endpoint** - Biggest immediate impact
2. **Default locations for new users** - Reduces onboarding friction
3. **Copy assignments** - Helpful for similar user profiles
4. **Role-based rules** - Long-term automation

## Database Considerations

The current `user_locations` junction table is already optimized for these future enhancements:
- Composite unique index prevents duplicates
- Simple structure supports bulk inserts
- No schema changes needed for these features

## Migration Strategy

When implementing bulk operations:
1. Keep existing single-assignment endpoints for backwards compatibility
2. Add new bulk endpoints alongside existing ones
3. Update admin UI to use bulk operations where appropriate
4. Provide migration scripts for existing customers

## Performance Considerations

With bulk operations:
- Use database transactions for atomicity
- Implement rate limiting (e.g., max 1000 assignments per request)
- Add progress callbacks for large operations
- Consider background job processing for very large bulk operations

## Example Use Cases

### Small Practice (Pilot Phase)
- 5 physicians, 2 locations
- 10 total assignments
- Current system works fine

### Medium Practice
- 30 physicians, 5 locations  
- 150 assignments
- Bulk endpoints become valuable

### Large Organization
- 100+ physicians, 10+ locations
- 1000+ assignments
- Bulk endpoints essential
- Role-based automation critical

## Temporary Admin Tool

Until bulk endpoints are implemented, consider providing admins with a simple Node.js script they can customize:

```javascript
// setup-locations.js
const axios = require('axios');

const config = {
  apiUrl: 'https://api.radorderpad.com',
  adminToken: 'YOUR_ADMIN_TOKEN',
  assignments: [
    { userIds: [1, 2, 3], locationIds: [10, 11] },     // Physicians
    { userIds: [4, 5], locationIds: [10, 11, 12] },    // Admin staff
  ]
};

async function setupAssignments() {
  for (const group of config.assignments) {
    for (const userId of group.userIds) {
      for (const locationId of group.locationIds) {
        try {
          await axios.post(
            `${config.apiUrl}/api/users/${userId}/locations/${locationId}`,
            {},
            { headers: { Authorization: `Bearer ${config.adminToken}` } }
          );
          console.log(`✓ Assigned user ${userId} to location ${locationId}`);
        } catch (error) {
          console.error(`✗ Failed: user ${userId}, location ${locationId}`);
        }
      }
    }
  }
}

setupAssignments();
```

This approach allows pilot customers to manage assignments efficiently while you focus on core functionality.