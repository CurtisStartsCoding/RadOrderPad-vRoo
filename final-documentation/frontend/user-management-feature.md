# User Management Feature Documentation

**Last Updated:** June 15, 2025  
**Status:** ✅ Completed  
**Frontend Route:** `/users`

## Overview

The user management feature allows organization administrators to invite, view, edit, and deactivate users within their organization. The implementation includes real-time NPI validation for physicians using the CMS NPI Registry.

## Key Features

### 1. User Listing
- **Tabbed Interface**: Separate tabs for active users and pending invitations
- **Search Functionality**: Real-time search across name, email, and role
- **Pagination**: 20 users per page with navigation controls
- **User Information Display**:
  - Name with initials avatar
  - Email and phone number
  - Role with icon
  - Assigned locations (when implemented)
  - Specialty (for physicians)

### 2. User Invitation
- **Simple Dialog**: Email and role selection only
- **Role Restrictions**:
  - `admin_referring` can invite: physicians, admin_staff
  - `admin_radiology` can invite: schedulers, radiologists
- **Email Validation**: Ensures valid email format
- **Note**: Location assignment happens after invitation acceptance

### 3. User Editing
- **Comprehensive Edit Dialog**:
  - First Name, Last Name
  - Phone Number (auto-formatted as (XXX) XXX-XXXX)
  - Specialty
  - NPI (for physicians and radiologists only)
  - Role selection (restricted by admin type)
  - Active/Inactive status toggle

### 4. NPI Validation (Physicians/Radiologists)
- **Real-time Lookup**: Validates against CMS NPI Registry via backend proxy
- **Visual Feedback**:
  - Loading spinner during validation
  - Green checkmark for valid NPIs
  - Red X for invalid NPIs
- **Auto-population Features**:
  - Detects name mismatches between form and registry
  - Shows registry phone number if different
  - Shows registry specialty if different
  - One-click update buttons for individual fields
  - "Update to NPI Registry Data" button for all fields
- **Data Retrieved**:
  - Provider name with credentials
  - Phone number from location address
  - Primary specialty/taxonomy

### 5. User Deactivation
- **Soft Delete**: Users are marked inactive, not deleted
- **Immediate Effect**: Deactivated users cannot log in
- **Confirmation**: Success toast notification

## Technical Implementation

### API Endpoints Used
- `GET /api/users` - Fetch all organization users
- `POST /api/user-invites/invite` - Send user invitation
- `PUT /api/users/:userId` - Update user information
- `DELETE /api/users/:userId` - Deactivate user
- `GET /api/utilities/npi-lookup?number={npi}` - NPI validation

### State Management
- React Query for data fetching and caching
- Local state for forms and UI controls
- Optimistic updates with cache invalidation

### Key Components
- **Users.tsx**: Main page component
- **Tabs**: shadcn/ui tabs for active/invited users
- **Dialog**: shadcn/ui dialog for invite and edit forms
- **Table**: Custom table with responsive design
- **Form Controls**: shadcn/ui inputs with validation

## User Experience Considerations

### Phone Number Formatting
- Automatically formats as user types
- Accepts only numeric input
- Displays in consistent (XXX) XXX-XXXX format

### NPI Validation
- 500ms debounce to avoid excessive API calls
- Only validates 10-digit NPIs
- Handles CORS through backend proxy
- Graceful error handling

### Name Handling
- Supports complex names (e.g., Hispanic naming conventions)
- Registry data can be overridden by admin
- Shows full name with middle name and credentials

### Debug Information
- Shows total users, active, and pending counts
- Displays current user's role and organization ID
- Raw JSON data view for troubleshooting

## Security Features

1. **Role-Based Access**: Only admin roles can access
2. **Organization Isolation**: Users only see their organization's data
3. **Email Immutability**: Email cannot be changed after invitation
4. **Self-Protection**: Users cannot deactivate themselves

## Future Enhancements

### Location Assignment (Ready in UI, Awaiting API)
- Checkbox interface for assigning users to locations
- Bulk assignment capability
- Currently commented out until endpoints implemented

### Bulk Operations
- Bulk user import via CSV
- Bulk deactivation
- Bulk location assignment

### Enhanced Onboarding
- First-login profile completion for physicians
- Guided NPI entry with validation
- Required fields before system access

## Known Limitations

1. **Email Changes**: Not supported by design for security
2. **User-Location API**: Endpoints not yet implemented
3. **Bulk Invitations**: Must be done one at a time
4. **Password Reset**: Handled separately through auth system

## Testing Considerations

### Valid Test NPIs
- `1003000126` - ARDALAN ENKESHAFI, M.D. (Internal Medicine)
- `1003816398` - Dr. Sarah Johnson (Family Medicine)
- `1164512828` - Mayo Clinic (Organization)

### Test Scenarios
1. Invite user with each available role
2. Edit user and verify NPI auto-population
3. Test name mismatch handling
4. Verify phone number formatting
5. Test pagination with 20+ users
6. Search across different fields
7. Deactivate and verify user cannot log in

## Related Documentation
- [User Management API](../api/user-management.md)
- [NPI Lookup Utility](../api/utilities-endpoints.md)
- [Frontend API Integration Todo](frontend-api-integration-todo.md)