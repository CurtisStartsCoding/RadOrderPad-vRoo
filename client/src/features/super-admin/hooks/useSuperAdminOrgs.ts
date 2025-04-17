/**
 * useSuperAdminOrgs Hook
 * 
 * Custom hook for fetching and managing organizations in the Super Admin feature.
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import {
  Organization,
  OrganizationFilterParams,
  StatusUpdateRequest,
  CreditAdjustmentRequest,
  AccountManagerAssignmentRequest
} from '../types';

/**
 * Hook for fetching and managing organizations
 * 
 * @returns Organization data, loading/error states, and mutation functions
 */
export const useSuperAdminOrgs = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [filterParams, setFilterParams] = useState<OrganizationFilterParams>({});
  
  // Fetch organizations
  const {
    data: organizations,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['superadmin', 'organizations', filterParams],
    queryFn: async () => {
      // Build query params
      const queryParams = new URLSearchParams();
      if (filterParams.name) queryParams.append('name', filterParams.name);
      if (filterParams.npi) queryParams.append('npi', filterParams.npi);
      if (filterParams.type) queryParams.append('type', filterParams.type);
      if (filterParams.status) queryParams.append('status', filterParams.status);
      if (filterParams.accountManagerId) queryParams.append('accountManagerId', filterParams.accountManagerId.toString());
      
      const url = `/api/superadmin/organizations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiRequest<Organization[]>(url, 'GET');
      return response;
    }
  });
  
  // Update organization status
  const {
    mutate: updateStatus,
    isPending: isUpdatingStatus
  } = useMutation({
    mutationFn: async ({ orgId, data }: { orgId: number, data: StatusUpdateRequest }) => {
      return apiRequest(`/api/superadmin/organizations/${orgId}/status`, 'PUT', data);
    },
    onSuccess: () => {
      toast({
        title: 'Status updated',
        description: 'Organization status has been updated successfully.',
        variant: 'default'
      });
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'organizations'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update status: ${error.message}`,
        variant: 'destructive'
      });
    }
  });
  
  // Adjust organization credits
  const {
    mutate: adjustCredits,
    isPending: isAdjustingCredits
  } = useMutation({
    mutationFn: async ({ orgId, data }: { orgId: number, data: CreditAdjustmentRequest }) => {
      return apiRequest(`/api/superadmin/organizations/${orgId}/credits/adjust`, 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: 'Credits adjusted',
        description: 'Organization credits have been adjusted successfully.',
        variant: 'default'
      });
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'organizations'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to adjust credits: ${error.message}`,
        variant: 'destructive'
      });
    }
  });
  
  // Assign account manager
  const {
    mutate: assignAccountManager,
    isPending: isAssigningAccountManager
  } = useMutation({
    mutationFn: async ({ orgId, data }: { orgId: number, data: AccountManagerAssignmentRequest }) => {
      return apiRequest(`/api/superadmin/organizations/${orgId}/account-manager`, 'PUT', data);
    },
    onSuccess: () => {
      toast({
        title: 'Account manager assigned',
        description: 'Account manager has been assigned successfully.',
        variant: 'default'
      });
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'organizations'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to assign account manager: ${error.message}`,
        variant: 'destructive'
      });
    }
  });
  
  // Update filter params
  const updateFilters = (newFilters: OrganizationFilterParams) => {
    setFilterParams(newFilters);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilterParams({});
  };
  
  return {
    // Data
    organizations,
    filterParams,
    
    // Loading/error states
    isLoading,
    isError,
    error,
    isUpdatingStatus,
    isAdjustingCredits,
    isAssigningAccountManager,
    
    // Actions
    updateStatus,
    adjustCredits,
    assignAccountManager,
    updateFilters,
    resetFilters,
    refetch
  };
};