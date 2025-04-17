/**
 * useConnectionList Hook
 * 
 * Custom hook for fetching and managing the list of connections.
 */

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Connection } from '../types';

/**
 * Hook for fetching and managing connections
 * 
 * @returns Connection list data and loading/error states
 */
export const useConnectionList = () => {
  const {
    data: connections,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['connections'],
    queryFn: async () => {
      const response = await apiRequest<Connection[]>('/connections', 'GET');
      return response;
    }
  });

  return {
    connections,
    isLoading,
    isError,
    error,
    refetch
  };
};