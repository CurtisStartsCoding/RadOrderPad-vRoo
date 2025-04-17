/**
 * useUserManagement Hook
 * 
 * Custom hook for managing users in the admin interface.
 * This is a compatibility layer that uses the new hooks internally.
 */

import { useAuth } from '@/hooks/useAuth';
import { useUserList } from './useUserList';
import { useInviteUser } from './useInviteUser';
import { useUserDetail } from './useUserDetail';
import { useDeactivateUser } from './useDeactivateUser';

/**
 * Hook for managing users
 */
export const useUserManagement = () => {
  const { user: currentUser } = useAuth();
  
  // Use the new hooks
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