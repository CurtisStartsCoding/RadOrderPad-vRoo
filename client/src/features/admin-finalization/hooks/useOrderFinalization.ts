import { useMutation } from '../../../lib/mock-tanstack-query';
import { useToast } from '../../../components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { AdminOrderData, AdminOrderStatus } from '../types';
import { useOrderDetail } from './useOrderDetail';

/**
 * Custom hook for managing order finalization
 * 
 * This hook is responsible for handling the order finalization functionality,
 * including sending the order to radiology.
 */
export const useOrderFinalization = (orderId: string) => {
  const { toast } = useToast();
  const router = useRouter();
  const { orderData, canSendToRadiology } = useOrderDetail(orderId);
  
  /**
   * Mutation for sending order to radiology
   */
  const {
    mutate: sendToRadiology,
    isPending: isSendingToRadiology
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
      
      // Return updated order data
      return {
        ...orderData,
        status: AdminOrderStatus.SENT_TO_RADIOLOGY,
        sentToRadiologyAt: new Date().toISOString(),
        sentToRadiologyBy: 'Admin User'
      };
    },
    onSuccess: () => {
      toast({
        title: 'Order Sent to Radiology',
        description: 'The order has been successfully sent to radiology.',
        variant: 'default'
      });
      
      // Navigate back to the queue
      router.push('/admin/queue');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Sending Order to Radiology',
        description: error.message || 'An error occurred while sending the order to radiology.',
        variant: 'destructive'
      });
    }
  });
  
  return {
    sendToRadiology,
    isSendingToRadiology,
    canSendToRadiology
  };
};