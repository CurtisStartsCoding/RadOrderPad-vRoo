/**
 * useUserDetail Hook
 * 
 * Custom hook for viewing and editing user details.
 */

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { User, UpdateUserRequest } from '../types/user-types';
import { apiRequest } from '@/lib/api';

/**
 * Hook for viewing and editing user details
 */
export const useUserDetail = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Mutation for updating a user
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

  /**
   * Handler for opening the user detail dialog
   */
  const handleOpenDialog = (userId: string, users: User[]) => {
    const user = users.find((u: User) => u.id === userId) || null;
    setSelectedUser(user);
    setDialogOpen(true);
  };

  /**
   * Handler for closing the user detail dialog
   */
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