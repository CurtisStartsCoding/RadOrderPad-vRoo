/**
 * useOrganizationSearch Hook
 * 
 * Custom hook for searching organizations.
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { OrganizationSearchParams, OrganizationSearchResult } from '../types';

/**
 * Hook for searching organizations
 * 
 * @returns Organization search functionality and results
 */
export const useOrganizationSearch = () => {
  const [searchParams, setSearchParams] = useState<OrganizationSearchParams | null>(null);
  
  const {
    data: searchResults,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['organizations', searchParams],
    queryFn: async () => {
      if (!searchParams) return [];
      
      const queryParams = new URLSearchParams();
      if (searchParams.name) queryParams.append('name', searchParams.name);
      if (searchParams.npi) queryParams.append('npi', searchParams.npi);
      if (searchParams.city) queryParams.append('city', searchParams.city);
      if (searchParams.state) queryParams.append('state', searchParams.state);
      queryParams.append('type', searchParams.type);
      
      const response = await apiRequest<OrganizationSearchResult[]>(
        `/organizations?${queryParams.toString()}`,
        'GET'
      );
      return response;
    },
    enabled: !!searchParams
  });

  /**
   * Search for organizations
   * 
   * @param params Search parameters
   */
  const searchOrganizations = (params: OrganizationSearchParams) => {
    setSearchParams(params);
  };

  return {
    searchResults,
    isLoading,
    isError,
    error,
    searchOrganizations,
    refetch
  };
};