import { useState } from 'react';
import { useMutation, useQueryClient } from '../../../lib/mock-tanstack-query';
import { useToast } from '../../../components/ui/use-toast';
import { AdminOrderData, SupplementalDocument } from '../types';
import { useOrderDetail } from './useOrderDetail';

/**
 * Custom hook for managing supplemental documents
 * 
 * This hook is responsible for handling the supplemental document functionality,
 * including state management and processing the pasted text.
 */
export const useSupplementalDocs = (orderId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { orderData } = useOrderDetail(orderId);
  
  // State for pasted text
  const [supplementalPasteText, setSupplementalPasteText] = useState('');
  
  /**
   * Mutation for processing supplemental document
   */
  const {
    mutate: processSupplementalDoc,
    isPending: isProcessingSupplemental
  } = useMutation<AdminOrderData, Error, string>({
    mutationFn: async (docType: string) => {
      // In a real implementation, this would be a fetch call to the API
      // For now, we'll simulate a successful response
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if we have order data
      if (!orderData) {
        throw new Error('No order data available');
      }
      
      // Create a new supplemental document
      const newDoc: SupplementalDocument = {
        id: `doc-${Date.now()}`,
        type: docType as any,
        content: supplementalPasteText,
        addedAt: new Date().toISOString(),
        addedBy: 'Admin User',
        description: `${docType.replace('_', ' ')} document`
      };
      
      // Return updated order data
      return {
        ...orderData,
        supplementalDocuments: [
          ...(orderData.supplementalDocuments || []),
          newDoc
        ]
      };
    },
    onSuccess: () => {
      toast({
        title: 'Supplemental Document Added',
        description: 'The supplemental document has been successfully added.',
        variant: 'default'
      });
      
      // Clear the paste text
      setSupplementalPasteText('');
      
      // Refetch order details
      queryClient.invalidateQueries({ queryKey: ['adminOrder', orderId] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Adding Supplemental Document',
        description: error.message || 'An error occurred while adding the supplemental document.',
        variant: 'destructive'
      });
    }
  });
  
  return {
    supplementalPasteText,
    setSupplementalPasteText,
    processSupplementalDoc,
    isProcessingSupplemental
  };
};