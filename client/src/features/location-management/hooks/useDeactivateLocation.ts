/**
 * useDeactivateLocation Hook
 * 
 * Custom hook for deactivating locations.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { apiRequest } from '@/lib/api';

/**
 * Hook for deactivating a location
 */
export const useDeactivateLocation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (locationId: string) => {
      return apiRequest<{ success: boolean }>(`/organizations/mine/locations/${locationId}`, 'DELETE');
    },
    onSuccess: () => {
      toast({
        title: 'Location Deactivated',
        description: 'Location has been deactivated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to deactivate location.',
        variant: 'destructive',
      });
    }
  });
};