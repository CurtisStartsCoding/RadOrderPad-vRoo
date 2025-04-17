import { useState } from 'react';
import { useMutation, useQueryClient } from '../../../lib/mock-tanstack-query';
import { useToast } from '../../../components/ui/use-toast';
import { AdminOrderData } from '../types';
import { Patient } from '../../physician-order/types/patient-types';
import { useOrderDetail } from './useOrderDetail';

/**
 * Custom hook for managing patient information editing
 * 
 * This hook is responsible for handling the patient information editing functionality,
 * including state management and updating the patient information.
 */
export const usePatientInfoEditor = (orderId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { orderData } = useOrderDetail(orderId);
  
  // State for editing mode
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  
  /**
   * Mutation for updating patient info
   */
  const {
    mutate: updatePatientInfo,
    isPending: isUpdatingPatient
  } = useMutation<AdminOrderData, Error, Patient>({
    mutationFn: async (patientData: Patient) => {
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
        patient: patientData
      };
    },
    onSuccess: () => {
      toast({
        title: 'Patient Information Updated',
        description: 'The patient information has been successfully updated.',
        variant: 'default'
      });
      
      // Exit editing mode
      setIsEditingPatient(false);
      
      // Refetch order details
      queryClient.invalidateQueries({ queryKey: ['adminOrder', orderId] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Updating Patient Information',
        description: error.message || 'An error occurred while updating the patient information.',
        variant: 'destructive'
      });
    }
  });
  
  return {
    isEditingPatient,
    setIsEditingPatient,
    updatePatientInfo,
    isUpdatingPatient
  };
};