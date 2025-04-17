# User Management Feature

This feature provides functionality for managing users in the RadOrderPad application.

## Components

### UserTable

Displays a table of users with their details and actions.

```tsx
import { UserTable } from '@/features/user-management';

<UserTable
  users={users}
  isLoading={isLoadingUsers}
  onViewUser={handleOpenUserDetailDialog}
  onDeactivateUser={deactivateUser}
/>
```

### InviteUserDialog

A dialog for inviting new users to the system.

```tsx
import { InviteUserDialog } from '@/features/user-management';

<InviteUserDialog
  open={inviteDialogOpen}
  onClose={handleCloseInviteDialog}
  onInvite={inviteUser}
  isSubmitting={isInviting}
  currentUserRole="admin"
/>
```

### UserDetailDialog

A dialog for viewing and editing user details.

```tsx
import { UserDetailDialog } from '@/features/user-management';

<UserDetailDialog
  open={userDetailDialogOpen}
  onClose={handleCloseUserDetailDialog}
  user={selectedUser}
  onUpdateUser={updateUser}
  isSubmitting={isUpdating}
  currentUserRole="admin"
/>
```

## Hooks

### useUserManagement

A hook that provides all the functionality for managing users.

```tsx
import { useUserManagement } from '@/features/user-management';

const {
  // Data
  users,
  selectedUser,
  filters,
  sort,
  
  // Loading states
  isLoadingUsers,
  isInviting,
  isUpdating,
  isDeactivating,
  
  // Error states
  isErrorUsers,
  usersError,
  
  // Dialog states
  inviteDialogOpen,
  userDetailDialogOpen,
  
  // Actions
  inviteUser,
  updateUser,
  deactivateUser,
  refetchUsers,
  
  // Dialog handlers
  handleOpenInviteDialog,
  handleCloseInviteDialog,
  handleOpenUserDetailDialog,
  handleCloseUserDetailDialog,
  
  // Filter and sort handlers
  handleFilterChange,
  handleSortChange
} = useUserManagement();
```

## Types

### User

```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  organizationId: string;
  organizationName?: string;
  createdAt: string;
  updatedAt: string;
}
```

### UserRole

```typescript
enum UserRole {
  PHYSICIAN = 'physician',
  ADMIN_STAFF = 'admin_staff',
  RADIOLOGY_STAFF = 'radiology_staff',
  ADMIN = 'admin'
}
```

### UserStatus

```typescript
enum UserStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive'
}
```

## Utilities

### Format Utilities

```typescript
import { 
  formatRole, 
  formatDate, 
  formatDateWithTime, 
  getStatusBadgeVariant,
  getAvailableRoles,
  getAvailableStatuses
} from '@/features/user-management';

// Format a role for display
const displayRole = formatRole(UserRole.ADMIN_STAFF); // "Admin Staff"

// Format a date for display
const displayDate = formatDate('2023-01-15T12:00:00Z'); // "Jan 15, 2023"

// Format a date with time for display
const displayDateTime = formatDateWithTime('2023-01-15T12:00:00Z'); // "Jan 15, 2023, 12:00 PM"

// Get badge variant for a status
const badgeVariant = getStatusBadgeVariant(UserStatus.ACTIVE); // "default"

// Get available roles based on the current user's role
const availableRoles = getAvailableRoles('admin'); // [UserRole.PHYSICIAN, UserRole.RADIOLOGY_STAFF, UserRole.ADMIN_STAFF]

// Get available statuses based on the current status
const availableStatuses = getAvailableStatuses(UserStatus.ACTIVE); // [UserStatus.ACTIVE, UserStatus.INACTIVE]
```

## Usage

To use the user management feature in a page:

```tsx
import { 
  UserTable, 
  InviteUserDialog, 
  UserDetailDialog, 
  useUserManagement 
} from '@/features/user-management';

export default function UserManagementPage() {
  const {
    users,
    selectedUser,
    isLoadingUsers,
    isInviting,
    isUpdating,
    inviteDialogOpen,
    userDetailDialogOpen,
    inviteUser,
    updateUser,
    deactivateUser,
    handleOpenInviteDialog,
    handleCloseInviteDialog,
    handleOpenUserDetailDialog,
    handleCloseUserDetailDialog,
  } = useUserManagement();

  return (
    <div>
      <button onClick={handleOpenInviteDialog}>Invite User</button>
      
      <UserTable
        users={users}
        isLoading={isLoadingUsers}
        onViewUser={handleOpenUserDetailDialog}
        onDeactivateUser={deactivateUser}
      />
      
      <InviteUserDialog
        open={inviteDialogOpen}
        onClose={handleCloseInviteDialog}
        onInvite={inviteUser}
        isSubmitting={isInviting}
        currentUserRole="admin"
      />
      
      <UserDetailDialog
        open={userDetailDialogOpen}
        onClose={handleCloseUserDetailDialog}
        user={selectedUser}
        onUpdateUser={updateUser}
        isSubmitting={isUpdating}
        currentUserRole="admin"
      />
    </div>
  );
}