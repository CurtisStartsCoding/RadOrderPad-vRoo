import { useState } from 'react';
import { useMutation, useQueryClient } from '../../../lib/mock-tanstack-query';
import { useToast } from '../../../components/ui/use-toast';
import { AdminOrderData, EmrSummary } from '../types';
import { useOrderDetail } from './useOrderDetail';

/**
 * Custom hook for managing EMR paste processing
 * 
 * This hook is responsible for handling the EMR paste functionality,
 * including state management and processing the pasted text.
 */
export const useEmrProcessing = (orderId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { orderData } = useOrderDetail(orderId);
  
  // State for pasted text
  const [emrPasteText, setEmrPasteText] = useState('');
  
  /**
   * Mutation for processing EMR paste
   */
  const {
    mutate: processEmrPaste,
    isPending: isProcessingEmr
  } = useMutation<AdminOrderData, Error, void>({
    mutationFn: async () => {
      // In a real implementation, this would be a fetch call to the API
      // For now, we'll simulate a successful response
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if we have order data
      if (!orderData) {
        throw new Error('No order data available');
      }
      
      // Create a new EMR summary
      const newEmrSummary: EmrSummary = {
        rawText: emrPasteText,
        processedText: `Processed: ${emrPasteText.substring(0, 50)}...`,
        processedAt: new Date().toISOString(),
        processedBy: 'Admin User'
      };
      
      // Return updated order data
      return {
        ...orderData,
        emrSummary: newEmrSummary
      };
    },
    onSuccess: () => {
      toast({
        title: 'EMR Summary Processed',
        description: 'The EMR summary has been successfully processed.',
        variant: 'default'
      });
      
      // Clear the paste text
      setEmrPasteText('');
      
      // Refetch order details
      queryClient.invalidateQueries({ queryKey: ['adminOrder', orderId] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Processing EMR Summary',
        description: error.message || 'An error occurred while processing the EMR summary.',
        variant: 'destructive'
      });
    }
  });
  
  return {
    emrPasteText,
    setEmrPasteText,
    processEmrPaste,
    isProcessingEmr
  };
};