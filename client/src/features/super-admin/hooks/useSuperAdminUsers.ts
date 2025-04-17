/**
 * useSuperAdminUsers Hook
 * 
 * Custom hook for fetching and managing users in the Super Admin feature.
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import {
  User,
  UserFilterParams,
  UserUpdateRequest,
  PasswordResetRequest
} from '../types';

/**
 * Hook for fetching and managing users
 * 
 * @returns User data, loading/error states, and mutation functions
 */
export const useSuperAdminUsers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [filterParams, setFilterParams] = useState<UserFilterParams>({});
  
  // Fetch users
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['superadmin', 'users', filterParams],
    queryFn: async () => {
      // Build query params
      const queryParams = new URLSearchParams();
      if (filterParams.email) queryParams.append('email', filterParams.email);
      if (filterParams.name) queryParams.append('name', filterParams.name);
      if (filterParams.organizationId) queryParams.append('organizationId', filterParams.organizationId.toString());
      if (filterParams.role) queryParams.append('role', filterParams.role);
      if (filterParams.isActive !== undefined) queryParams.append('isActive', filterParams.isActive.toString());
      
      const url = `/api/superadmin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiRequest<User[]>(url, 'GET');
      return response;
    }
  });
  
  // Update user
  const {
    mutate: updateUser,
    isPending: isUpdatingUser
  } = useMutation({
    mutationFn: async ({ userId, data }: { userId: number, data: UserUpdateRequest }) => {
      return apiRequest(`/api/superadmin/users/${userId}`, 'PUT', data);
    },
    onSuccess: () => {
      toast({
        title: 'User updated',
        description: 'User has been updated successfully.',
        variant: 'default'
      });
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'users'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update user: ${error.message}`,
        variant: 'destructive'
      });
    }
  });
  
  // Activate/deactivate user
  const {
    mutate: toggleUserActive,
    isPending: isTogglingUserActive
  } = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: number, isActive: boolean }) => {
      return apiRequest(`/api/superadmin/users/${userId}`, 'PUT', { isActive });
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.isActive ? 'User activated' : 'User deactivated',
        description: `User has been ${variables.isActive ? 'activated' : 'deactivated'} successfully.`,
        variant: 'default'
      });
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'users'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update user status: ${error.message}`,
        variant: 'destructive'
      });
    }
  });
  
  // Send password reset
  const {
    mutate: sendPasswordReset,
    isPending: isSendingPasswordReset
  } = useMutation({
    mutationFn: async ({ userId }: PasswordResetRequest) => {
      return apiRequest(`/api/superadmin/users/${userId}/reset-password`, 'POST');
    },
    onSuccess: () => {
      toast({
        title: 'Password reset sent',
        description: 'Password reset link has been sent to the user.',
        variant: 'default'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to send password reset: ${error.message}`,
        variant: 'destructive'
      });
    }
  });
  
  // Verify email manually
  const {
    mutate: verifyEmail,
    isPending: isVerifyingEmail
  } = useMutation({
    mutationFn: async ({ userId }: { userId: number }) => {
      return apiRequest(`/api/superadmin/users/${userId}/verify-email`, 'POST');
    },
    onSuccess: () => {
      toast({
        title: 'Email verified',
        description: 'User email has been verified successfully.',
        variant: 'default'
      });
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'users'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to verify email: ${error.message}`,
        variant: 'destructive'
      });
    }
  });
  
  // Update filter params
  const updateFilters = (newFilters: UserFilterParams) => {
    setFilterParams(newFilters);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilterParams({});
  };
  
  return {
    // Data
    users,
    filterParams,
    
    // Loading/error states
    isLoading,
    isError,
    error,
    isUpdatingUser,
    isTogglingUserActive,
    isSendingPasswordReset,
    isVerifyingEmail,
    
    // Actions
    updateUser,
    toggleUserActive,
    sendPasswordReset,
    verifyEmail,
    updateFilters,
    resetFilters,
    refetch
  };
};