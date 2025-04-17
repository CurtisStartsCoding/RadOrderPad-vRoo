/**
 * useUserList Hook
 * 
 * Custom hook for fetching and filtering users.
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, UserFilters, UserSortOptions } from '../types/user-types';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook for fetching and filtering users
 */
export const useUserList = () => {
  const { user: currentUser } = useAuth();
  
  // State for filtering and sorting
  const [filters, setFilters] = useState<UserFilters>({
    status: null,
    role: null,
    search: ''
  });
  const [sort, setSort] = useState<UserSortOptions>('name_asc');

  // Query for fetching users
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
    enabled: !!currentUser
  });

  /**
   * Handler for updating filters
   */
  const handleFilterChange = (newFilters: Partial<UserFilters>) => {
    setFilters((prev: UserFilters) => ({
      ...prev,
      ...newFilters
    }));
  };

  /**
   * Handler for updating sort
   */
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