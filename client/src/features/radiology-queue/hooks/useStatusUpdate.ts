import { useMutation, useQueryClient } from '../../../lib/mock-tanstack-query';
import { useToast } from '../../../components/ui/use-toast';
import { RadiologyOrder, StatusUpdateRequest } from '../types/radiology-order-types';

/**
 * Custom hook for updating radiology order status
 * 
 * This hook is responsible for providing a mutation to update order status.
 */
export const useStatusUpdate = (orderId: string, orderData: RadiologyOrder | undefined) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  /**
   * Mutation for updating order status
   */
  const {
    mutate: updateStatus,
    isPending: isUpdatingStatus
  } = useMutation<RadiologyOrder, Error, StatusUpdateRequest>({
    mutationFn: async (statusData: StatusUpdateRequest) => {
      // In a real implementation, this would be a fetch call to the API
      // For now, we'll simulate a successful response
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if we have order data
      if (!orderData) {
        throw new Error('No order data available');
      }
      
      // Return updated order data
      return {
        ...orderData,
        status: statusData.status,
        updatedAt: new Date().toISOString(),
        updatedBy: 'Radiology Staff'
      };
    },
    onSuccess: () => {
      toast({
        title: 'Status Updated',
        description: 'The order status has been successfully updated.',
        variant: 'default'
      });
      
      // Refetch order details and invalidate queue
      queryClient.invalidateQueries({ queryKey: ['radiologyOrder', orderId] });
      queryClient.invalidateQueries({ queryKey: ['radiologyOrders'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Updating Status',
        description: error.message || 'An error occurred while updating the status.',
        variant: 'destructive'
      });
    }
  });
  
  return {
    updateStatus,
    isUpdatingStatus
  };
};