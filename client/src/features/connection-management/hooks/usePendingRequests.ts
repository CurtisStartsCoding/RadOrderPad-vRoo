/**
 * usePendingRequests Hook
 * 
 * Custom hook for fetching and managing pending connection requests.
 */

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { ConnectionRequest } from '../types';

/**
 * Hook for fetching and managing pending connection requests
 * 
 * @returns Pending requests data and loading/error states
 */
export const usePendingRequests = () => {
  const {
    data: pendingRequests,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['connections', 'requests'],
    queryFn: async () => {
      const response = await apiRequest<ConnectionRequest[]>('/connections/requests', 'GET');
      return response;
    }
  });

  return {
    pendingRequests,
    isLoading,
    isError,
    error,
    refetch
  };
};