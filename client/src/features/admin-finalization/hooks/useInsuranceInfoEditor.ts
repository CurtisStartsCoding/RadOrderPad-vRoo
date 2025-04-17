import { useState } from 'react';
import { useMutation, useQueryClient } from '../../../lib/mock-tanstack-query';
import { useToast } from '../../../components/ui/use-toast';
import { AdminOrderData, InsuranceInfo } from '../types';
import { useOrderDetail } from './useOrderDetail';

/**
 * Custom hook for managing insurance information editing
 * 
 * This hook is responsible for handling the insurance information editing functionality,
 * including state management and updating the insurance information.
 */
export const useInsuranceInfoEditor = (orderId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { orderData } = useOrderDetail(orderId);
  
  // State for editing mode
  const [isEditingInsurance, setIsEditingInsurance] = useState(false);
  
  /**
   * Mutation for updating insurance info
   */
  const {
    mutate: updateInsuranceInfo,
    isPending: isUpdatingInsurance
  } = useMutation<AdminOrderData, Error, InsuranceInfo>({
    mutationFn: async (insuranceData: InsuranceInfo) => {
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
        insurance: insuranceData
      };
    },
    onSuccess: () => {
      toast({
        title: 'Insurance Information Updated',
        description: 'The insurance information has been successfully updated.',
        variant: 'default'
      });
      
      // Exit editing mode
      setIsEditingInsurance(false);
      
      // Refetch order details
      queryClient.invalidateQueries({ queryKey: ['adminOrder', orderId] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Updating Insurance Information',
        description: error.message || 'An error occurred while updating the insurance information.',
        variant: 'destructive'
      });
    }
  });
  
  return {
    isEditingInsurance,
    setIsEditingInsurance,
    updateInsuranceInfo,
    isUpdatingInsurance
  };
};