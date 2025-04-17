/**
 * User Management Page
 * 
 * This page displays a list of users and provides functionality to manage them.
 */

'use client';

import React from 'react';
import { Button } from '../../../../../src/components/ui/button';
import { 
  UserTable, 
  InviteUserDialog, 
  UserDetailDialog, 
  useUserManagement 
} from '../../../../../src/features/user-management';

export default function UserManagementPage() {
  const {
    // Data
    users,
    selectedUser,
    
    // Loading states
    isLoadingUsers,
    isInviting,
    isUpdating,
    isDeactivating,
    
    // Dialog states
    inviteDialogOpen,
    userDetailDialogOpen,
    
    // Actions
    inviteUser,
    updateUser,
    deactivateUser,
    
    // Dialog handlers
    handleOpenInviteDialog,
    handleCloseInviteDialog,
    handleOpenUserDetailDialog,
    handleCloseUserDetailDialog,
  } = useUserManagement();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={handleOpenInviteDialog}>Invite User</Button>
      </div>
      
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