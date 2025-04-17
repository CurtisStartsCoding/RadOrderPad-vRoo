/**
 * useSaveLocation Hook
 * 
 * Custom hook for adding and updating locations.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Location, CreateLocationRequest, UpdateLocationRequest } from '../types/location-types';
import { apiRequest } from '@/lib/api';

/**
 * Hook for adding a new location
 */
export const useAddLocation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLocationRequest) => {
      return apiRequest<Location>('/organizations/mine/locations', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: 'Location Added',
        description: 'Location has been added successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add location.',
        variant: 'destructive',
      });
    }
  });
};

/**
 * Hook for updating an existing location
 */
export const useUpdateLocation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateLocationRequest) => {
      return apiRequest<Location>(`/organizations/mine/locations/${data.id}`, 'PUT', data);
    },
    onSuccess: () => {
      toast({
        title: 'Location Updated',
        description: 'Location has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update location.',
        variant: 'destructive',
      });
    }
  });
};

/**
 * Combined hook for saving (adding or updating) a location
 */
export const useSaveLocation = () => {
  const addLocation = useAddLocation();
  const updateLocation = useUpdateLocation();

  const saveLocation = (data: CreateLocationRequest | UpdateLocationRequest, isEdit: boolean) => {
    if (isEdit && 'id' in data) {
      return updateLocation.mutate(data as UpdateLocationRequest);
    } else {
      return addLocation.mutate(data as CreateLocationRequest);
    }
  };

  return {
    saveLocation,
    isLoading: addLocation.isPending || updateLocation.isPending,
    error: addLocation.error || updateLocation.error
  };
};