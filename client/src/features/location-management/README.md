# Location Management Feature

This feature provides functionality for managing locations in the RadOrderPad application.

## Components

### LocationTable

Displays a table of locations with their details and actions.

```tsx
import { LocationTable } from '@/features/location-management';

<LocationTable
  locations={locations}
  isLoading={isLoadingLocations}
  onEditLocation={handleOpenEditDialog}
  onDeactivateLocation={deactivateLocation}
/>
```

### LocationFormDialog

A dialog for adding and editing locations.

```tsx
import { LocationFormDialog } from '@/features/location-management';

<LocationFormDialog
  open={formDialogOpen}
  onClose={handleCloseFormDialog}
  onSave={saveLocation}
  isSubmitting={isSavingLocation}
  location={selectedLocation}
/>
```

## Hooks

### useLocationManagement

A hook that provides all the functionality for managing locations.

```tsx
import { useLocationManagement } from '@/features/location-management';

const {
  // Data
  locations,
  selectedLocation,
  
  // Loading states
  isLoadingLocations,
  isSavingLocation,
  isDeactivatingLocation,
  
  // Dialog state
  formDialogOpen,
  
  // Actions
  saveLocation,
  deactivateLocation,
  
  // Dialog handlers
  handleOpenAddDialog,
  handleOpenEditDialog,
  handleCloseFormDialog,
  
  // Filter and sort handlers
  handleFilterChange,
  handleSortChange
} = useLocationManagement();
```

### useLocationList

A hook for fetching and filtering locations.

```tsx
import { useLocationList } from '@/features/location-management';

const {
  locations,
  filters,
  sort,
  isLoading,
  isError,
  error,
  refetch,
  handleFilterChange,
  handleSortChange
} = useLocationList();
```

### useSaveLocation

A hook for adding and updating locations.

```tsx
import { useSaveLocation } from '@/features/location-management';

const {
  saveLocation,
  isLoading,
  error
} = useSaveLocation();

// Usage
saveLocation(locationData, isEdit);
```

### useDeactivateLocation

A hook for deactivating locations.

```tsx
import { useDeactivateLocation } from '@/features/location-management';

const {
  mutate: deactivateLocation,
  isPending: isDeactivating
} = useDeactivateLocation();

// Usage
deactivateLocation(locationId);
```

## Types

### Location

```typescript
interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  status: LocationStatus;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}
```

### LocationStatus

```typescript
enum LocationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}
```

## Utilities

### Format Utilities

```typescript
import { 
  formatStatus, 
  formatDate, 
  formatDateWithTime, 
  formatFullAddress, 
  formatPhoneNumber, 
  getStatusBadgeVariant 
} from '@/features/location-management';

// Format a status for display
const displayStatus = formatStatus(LocationStatus.ACTIVE); // "Active"

// Format a date for display
const displayDate = formatDate('2023-01-15T12:00:00Z'); // "Jan 15, 2023"

// Format a date with time for display
const displayDateTime = formatDateWithTime('2023-01-15T12:00:00Z'); // "Jan 15, 2023, 12:00 PM"

// Format a full address for display
const displayAddress = formatFullAddress('123 Main St', 'Anytown', 'CA', '12345'); // "123 Main St, Anytown, CA 12345"

// Format a phone number for display
const displayPhone = formatPhoneNumber('1234567890'); // "(123) 456-7890"

// Get badge variant for a status
const badgeVariant = getStatusBadgeVariant(LocationStatus.ACTIVE); // "default"
```

## Usage

To use the location management feature in a page:

```tsx
import { 
  LocationTable, 
  LocationFormDialog, 
  useLocationManagement 
} from '@/features/location-management';

export default function LocationManagementPage() {
  const {
    locations,
    selectedLocation,
    isLoadingLocations,
    isSavingLocation,
    isDeactivatingLocation,
    formDialogOpen,
    saveLocation,
    deactivateLocation,
    handleOpenAddDialog,
    handleOpenEditDialog,
    handleCloseFormDialog,
  } = useLocationManagement();

  return (
    <div>
      <button onClick={handleOpenAddDialog}>Add Location</button>
      
      <LocationTable
        locations={locations}
        isLoading={isLoadingLocations}
        onEditLocation={handleOpenEditDialog}
        onDeactivateLocation={deactivateLocation}
      />
      
      <LocationFormDialog
        open={formDialogOpen}
        onClose={handleCloseFormDialog}
        onSave={saveLocation}
        isSubmitting={isSavingLocation}
        location={selectedLocation}
      />
    </div>
  );
}