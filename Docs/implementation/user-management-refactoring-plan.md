# User Management Refactoring Plan

This document outlines the plan for refactoring the User Management feature to improve its adherence to the Single Responsibility Principle (SRP).

## Current Issues

1. **Large useUserManagement Hook**: The useUserManagement hook is too large (207 lines) and handles multiple responsibilities:
   - Fetching and filtering users
   - Inviting users
   - Updating user details
   - Deactivating users
   - Managing dialog states

2. **Duplicated Formatting Functions**: The formatting functions are duplicated across components.

## Refactoring Goals

1. **Split useUserManagement Hook**: Break down the useUserManagement hook into smaller, more focused hooks.
2. **Extract Shared Utilities**: Move duplicated formatting functions to the format-utils.ts file.

## Implementation Plan

### 1. Split useUserManagement Hook

#### 1.1. Create useUserList Hook

Create a new hook that focuses on fetching and filtering users.

```typescript
// hooks/useUserList.ts
export const useUserList = () => {
  const [filters, setFilters] = useState<UserFilters>({
    status: null,
    role: null,
    search: ''
  });
  const [sort, setSort] = useState<UserSortOptions>('name_asc');

  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['users', filters, sort],
    queryFn: async () => {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (filters.status) {
        queryParams.append('status', filters.status);
      }
      
      if (filters.role) {
        queryParams.append('role', filters.role);
      }
      
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      
      queryParams.append('sort', sort);
      
      const endpoint = `/users?${queryParams.toString()}`;
      return apiRequest<User[]>(endpoint, 'GET');
    },
    enabled: true
  });

  const handleFilterChange = (newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleSortChange = (newSort: UserSortOptions) => {
    setSort(newSort);
  };

  return {
    users,
    filters,
    sort,
    isLoading,
    isError,
    error,
    refetch,
    handleFilterChange,
    handleSortChange
  };
};
```

#### 1.2. Create useInviteUser Hook

Create a new hook that focuses on inviting users.

```typescript
// hooks/useInviteUser.ts
export const useInviteUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    mutate: inviteUser,
    isPending: isInviting
  } = useMutation({
    mutationFn: (data: InviteUserRequest) => {
      return apiRequest<{ success: boolean }>('/users/invite', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: 'Invitation Sent',
        description: 'User invitation has been sent successfully.',
      });
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send invitation.',
        variant: 'destructive',
      });
    }
  });

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return {
    inviteUser,
    isInviting,
    dialogOpen,
    handleOpenDialog,
    handleCloseDialog
  };
};
```

#### 1.3. Create useUserDetail Hook

Create a new hook that focuses on viewing and editing user details.

```typescript
// hooks/useUserDetail.ts
export const useUserDetail = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    mutate: updateUser,
    isPending: isUpdating
  } = useMutation({
    mutationFn: (data: UpdateUserRequest) => {
      return apiRequest<User>(`/users/${data.id}`, 'PUT', data);
    },
    onSuccess: () => {
      toast({
        title: 'User Updated',
        description: 'User information has been updated successfully.',
      });
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user.',
        variant: 'destructive',
      });
    }
  });

  const handleOpenDialog = (userId: string, users: User[]) => {
    const user = users.find(u => u.id === userId) || null;
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  return {
    selectedUser,
    updateUser,
    isUpdating,
    dialogOpen,
    handleOpenDialog,
    handleCloseDialog
  };
};
```

#### 1.4. Create useDeactivateUser Hook

Create a new hook that focuses on deactivating users.

```typescript
// hooks/useDeactivateUser.ts
export const useDeactivateUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: deactivateUser,
    isPending: isDeactivating
  } = useMutation({
    mutationFn: (userId: string) => {
      return apiRequest<{ success: boolean }>(`/users/${userId}`, 'DELETE');
    },
    onSuccess: () => {
      toast({
        title: 'User Deactivated',
        description: 'User has been deactivated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to deactivate user.',
        variant: 'destructive',
      });
    }
  });

  return {
    deactivateUser,
    isDeactivating
  };
};
```

#### 1.5. Update useUserManagement Hook

Update the useUserManagement hook to use the new hooks.

```typescript
// hooks/useUserManagement.ts
export const useUserManagement = () => {
  const { user: currentUser } = useAuth();
  
  const {
    users,
    filters,
    sort,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: usersError,
    refetch: refetchUsers,
    handleFilterChange,
    handleSortChange
  } = useUserList();

  const {
    inviteUser,
    isInviting,
    dialogOpen: inviteDialogOpen,
    handleOpenDialog: handleOpenInviteDialog,
    handleCloseDialog: handleCloseInviteDialog
  } = useInviteUser();

  const {
    selectedUser,
    updateUser,
    isUpdating,
    dialogOpen: userDetailDialogOpen,
    handleOpenDialog: handleOpenUserDetailDialogInternal,
    handleCloseDialog: handleCloseUserDetailDialog
  } = useUserDetail();

  const {
    deactivateUser,
    isDeactivating
  } = useDeactivateUser();

  // Wrapper for handleOpenUserDetailDialog to pass users
  const handleOpenUserDetailDialog = (userId: string) => {
    handleOpenUserDetailDialogInternal(userId, users);
  };

  return {
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
  };
};
```

### 2. Extract Shared Utilities

The shared utilities have already been extracted to the format-utils.ts file. We need to update the components to use these utilities.

#### 2.1. Update UserTable Component

```typescript
import { formatRole, formatDate, getStatusBadgeVariant } from '../utils/format-utils';
```

#### 2.2. Update InviteUserDialog Component

```typescript
import { formatRole, getAvailableRoles } from '../utils/format-utils';
```

#### 2.3. Update UserDetailDialog Component

```typescript
import { 
  formatRole, 
  formatDateWithTime, 
  getStatusBadgeVariant, 
  getAvailableRoles, 
  getAvailableStatuses 
} from '../utils/format-utils';
```

## Implementation Steps

1. Create the new hook files:
   - useUserList.ts
   - useInviteUser.ts
   - useUserDetail.ts
   - useDeactivateUser.ts

2. Update the useUserManagement.ts file to use the new hooks.

3. Update the hooks/index.ts file to export the new hooks.

4. Update the components to use the shared utilities from format-utils.ts.

5. Run TypeScript checks to ensure everything is working correctly.

6. Update the documentation to reflect the changes.

## Benefits

1. **Improved SRP Adherence**: Each hook will have a single, well-defined responsibility.
2. **Better Testability**: Smaller, focused hooks are easier to test.
3. **Improved Maintainability**: Changes to one aspect of user management won't affect others.
4. **Better Reusability**: The smaller hooks can be reused in other parts of the application.
5. **Reduced Duplication**: Shared utilities will be centralized.

## Risks and Mitigations

1. **Risk**: Breaking existing functionality.
   **Mitigation**: Keep the useUserManagement hook as a compatibility layer that uses the new hooks internally.

2. **Risk**: Increased complexity due to more files.
   **Mitigation**: Ensure good documentation and consistent naming conventions.

3. **Risk**: Performance impact due to multiple hooks.
   **Mitigation**: Monitor performance and optimize if necessary.