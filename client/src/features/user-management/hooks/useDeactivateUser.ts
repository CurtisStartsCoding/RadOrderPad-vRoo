/**
 * useDeactivateUser Hook
 * 
 * Custom hook for deactivating users.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { apiRequest } from '@/lib/api';

/**
 * Hook for deactivating users
 */
export const useDeactivateUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation for deactivating a user
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