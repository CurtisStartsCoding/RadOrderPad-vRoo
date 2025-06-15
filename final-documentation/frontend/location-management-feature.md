# Location Management Feature Documentation

**Created:** June 2025  
**Status:** ✅ COMPLETED  
**Component:** `client/src/pages/Locations.tsx`

## Overview

The Location Management feature allows organization administrators to manage their physical locations/facilities. It provides full CRUD (Create, Read, Update, Delete) operations with a clean, intuitive interface.

## Key Features

### 1. Location Display
- **Grid Layout**: Responsive card-based layout (1-3 columns based on screen size)
- **Location Cards**: Each location displays:
  - Name with ID
  - Full address (line 1, line 2, city, state, ZIP)
  - Phone number (formatted as (XXX) XXX-XXXX)
  - Created/Updated dates (US format: MM/DD/YYYY)
  - Edit button (for active locations)
  - Deactivate button (inline with dates)

### 2. Location Filtering
- **Filter Options**:
  - Active Only (default)
  - Inactive Only  
  - All Locations
- **Visual Indicators**:
  - Inactive locations have red border and light red background
  - Warning banner when viewing non-active locations
- **Empty States**: Clear messaging when no locations match filter

### 3. Create/Edit Locations
- **Modal Dialog**: Clean form interface for creating/editing
- **Form Fields**:
  - Location Name (required)
  - Address Line 1 (required)
  - Address Line 2 (optional)
  - City (required)
  - State (required, 2-letter code, auto-uppercase)
  - ZIP Code (required, 5 digits only)
  - Phone Number (optional, auto-formatted)
- **Validation**: Real-time validation with clear error states

### 4. Debug Information Panel
- **Statistics**:
  - Total number of locations
  - Active locations count (green)
  - Inactive locations count (red)
  - Organization ID
- **Raw Data Viewer**: Toggle to show/hide JSON data
- **Filter Control**: Integrated filter dropdown

### 5. Data Formatting
- **Phone Numbers**: 
  - Auto-formats as user types: (XXX) XXX-XXXX
  - Strips non-numeric characters
  - Limits to 10 digits
- **ZIP Codes**:
  - Numeric only
  - Limited to 5 digits
- **Dates**: US format (MM/DD/YYYY)

## API Integration

### Endpoints Used

1. **List Locations**
   ```
   GET /api/organizations/mine/locations
   Response: { locations: [...] }
   ```

2. **Create Location**
   ```
   POST /api/organizations/mine/locations
   Body: { name, address_line1, address_line2, city, state, zip_code, phone_number }
   Response: { message, location }
   ```

3. **Update Location**
   ```
   PUT /api/organizations/mine/locations/:id
   Body: { ...fields to update }
   Response: { message, location }
   ```

4. **Deactivate Location**
   ```
   DELETE /api/organizations/mine/locations/:id
   Response: { message }
   Note: Soft delete - sets is_active to false
   ```

### Data Model

```typescript
interface ApiLocation {
  id: number;
  organization_id: number;
  name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip_code: string;
  phone_number: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

## Implementation Details

### State Management
- Uses React Query for data fetching and caching
- Stale time: 60 seconds
- Automatic refetch after mutations

### Mutations
- **createMutation**: Handles location creation
- **updateMutation**: Handles location updates
- **deactivateMutation**: Handles soft deletion

### UI Components
- Shadcn/ui components: Card, Button, Input, Label, Dialog, Select
- Custom toast notifications for success/error states
- Loading states with spinner animations

### Key Functions
- `formatPhoneNumber()`: Formats phone display
- `handlePhoneChange()`: Formats phone input in real-time
- `handleOpenDialog()`: Manages dialog state for create/edit
- `resetForm()`: Clears form data

## User Experience

### Success Flows
1. **Creating Location**:
   - Click "Add Location" button or card
   - Fill out form with validation
   - Submit → Success toast → Dialog closes → List updates

2. **Editing Location**:
   - Click Edit button on location card
   - Form pre-populates with current data
   - Make changes → Submit → Success toast

3. **Deactivating Location**:
   - Click Deactivate button
   - Immediate action with loading state
   - Success toast → Location disappears (if viewing Active only)

### Error Handling
- Network errors show toast with retry option
- Validation errors prevent form submission
- Loading states prevent duplicate actions

## Security & Permissions
- Only accessible to admin roles (`admin_referring`, `admin_radiology`)
- API validates organization ownership
- Soft deletes preserve audit trail

## Future Enhancements
1. Bulk operations (activate/deactivate multiple)
2. Location search/filter by name or address
3. Export locations to CSV
4. Primary location designation
5. Business hours management
6. Integration with mapping services

## Related Features
- **User-Location Assignment**: Users can be assigned to specific locations
- **Order Creation**: Locations used for facility selection in orders
- **Organization Profile**: Displays location count

## Testing Checklist
- [x] Create new location with all fields
- [x] Create location with minimal fields
- [x] Edit existing location
- [x] Deactivate location
- [x] Filter by active/inactive/all
- [x] Phone number formatting
- [x] ZIP code validation
- [x] State code auto-uppercase
- [x] Empty state messages
- [x] Loading states
- [x] Error handling
- [x] Toast notifications
- [x] Responsive design