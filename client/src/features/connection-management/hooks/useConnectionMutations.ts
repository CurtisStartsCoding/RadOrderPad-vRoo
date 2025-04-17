/**
 * useConnectionMutations Hook
 * 
 * Custom hook for connection mutations (approve, reject, terminate).
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { CreateConnectionRequest } from '../types';

/**
 * Hook for connection mutations
 * 
 * @returns Mutation functions and loading states
 */
export const useConnectionMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Request a connection
  const {
    mutate: requestConnection,
    isPending: isRequestingConnection
  } = useMutation({
    mutationFn: async (data: CreateConnectionRequest) => {
      return apiRequest('/connections', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: 'Connection requested',
        description: 'Your connection request has been sent.',
        variant: 'default'
      });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to request connection: ${error.message}`,
        variant: 'destructive'
      });
    }
  });
  
  // Approve a connection request
  const {
    mutate: approveConnection,
    isPending: isApprovingConnection
  } = useMutation({
    mutationFn: async (relationshipId: number) => {
      return apiRequest(`/connections/${relationshipId}/approve`, 'POST');
    },
    onSuccess: () => {
      toast({
        title: 'Connection approved',
        description: 'The connection request has been approved.',
        variant: 'default'
      });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      queryClient.invalidateQueries({ queryKey: ['connections', 'requests'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to approve connection: ${error.message}`,
        variant: 'destructive'
      });
    }
  });
  
  // Reject a connection request
  const {
    mutate: rejectConnection,
    isPending: isRejectingConnection
  } = useMutation({
    mutationFn: async (relationshipId: number) => {
      return apiRequest(`/connections/${relationshipId}/reject`, 'POST');
    },
    onSuccess: () => {
      toast({
        title: 'Connection rejected',
        description: 'The connection request has been rejected.',
        variant: 'default'
      });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      queryClient.invalidateQueries({ queryKey: ['connections', 'requests'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to reject connection: ${error.message}`,
        variant: 'destructive'
      });
    }
  });
  
  // Terminate a connection
  const {
    mutate: terminateConnection,
    isPending: isTerminatingConnection
  } = useMutation({
    mutationFn: async (relationshipId: number) => {
      return apiRequest(`/connections/${relationshipId}`, 'DELETE');
    },
    onSuccess: () => {
      toast({
        title: 'Connection terminated',
        description: 'The connection has been terminated.',
        variant: 'default'
      });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to terminate connection: ${error.message}`,
        variant: 'destructive'
      });
    }
  });
  
  return {
    // Request connection
    requestConnection,
    isRequestingConnection,
    
    // Approve connection
    approveConnection,
    isApprovingConnection,
    
    // Reject connection
    rejectConnection,
    isRejectingConnection,
    
    // Terminate connection
    terminateConnection,
    isTerminatingConnection
  };
};