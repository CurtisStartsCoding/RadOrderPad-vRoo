/**
 * useInviteUser Hook
 * 
 * Custom hook for inviting new users to the system.
 */

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { InviteUserRequest } from '../types/user-types';
import { apiRequest } from '@/lib/api';

/**
 * Hook for inviting new users
 */
export const useInviteUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Mutation for inviting a user
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

  /**
   * Handler for opening the invite dialog
   */
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  /**
   * Handler for closing the invite dialog
   */
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