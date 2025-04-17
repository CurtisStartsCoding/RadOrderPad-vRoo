/**
 * useLocationList Hook
 * 
 * Custom hook for fetching and filtering locations.
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Location, LocationFilterOptions, LocationSortOptions } from '../types/location-types';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook for fetching and filtering locations
 */
export const useLocationList = () => {
  const { user } = useAuth();
  
  // State for filtering and sorting
  const [filters, setFilters] = useState<LocationFilterOptions>({
    status: undefined,
    search: ''
  });
  const [sort, setSort] = useState<LocationSortOptions>('name_asc');

  // Query for fetching locations
  const {
    data: locations = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['locations', filters, sort],
    queryFn: async () => {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (filters.status) {
        queryParams.append('status', filters.status);
      }
      
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      
      queryParams.append('sort', sort);
      
      const endpoint = `/organizations/mine/locations?${queryParams.toString()}`;
      return apiRequest<Location[]>(endpoint, 'GET');
    },
    enabled: !!user
  });

  /**
   * Handler for updating filters
   */
  const handleFilterChange = (newFilters: Partial<LocationFilterOptions>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  /**
   * Handler for updating sort
   */
  const handleSortChange = (newSort: LocationSortOptions) => {
    setSort(newSort);
  };

  return {
    locations,
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