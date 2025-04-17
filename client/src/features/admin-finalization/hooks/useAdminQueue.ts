import { useQuery } from '../../../lib/mock-tanstack-query';
import { AdminOrderQueueItem } from '../types';

/**
 * Custom hook for fetching and managing the admin order queue
 * 
 * This hook is responsible for fetching orders with status 'pending_admin'
 * and providing loading/error states.
 */
export const useAdminQueue = () => {
  /**
   * Fetch orders with status 'pending_admin'
   */
  const fetchAdminQueue = async (): Promise<AdminOrderQueueItem[]> => {
    // In a real implementation, this would be a fetch call to the API
    // For now, we'll return mock data
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data
    return [
      {
        id: 'order-001',
        patientName: 'John Doe',
        patientDob: '1980-01-01',
        patientMrn: 'MRN12345',
        status: 'pending_admin' as any,
        modality: 'MRI',
        bodyPart: 'Brain',
        emrProcessed: false,
        insuranceVerified: false,
        createdAt: '2025-04-17T10:30:00Z',
        physicianName: 'Dr. Smith'
      },
      {
        id: 'order-002',
        patientName: 'Jane Smith',
        patientDob: '1975-05-15',
        patientMrn: 'MRN67890',
        status: 'pending_admin' as any,
        modality: 'CT',
        bodyPart: 'Chest',
        emrProcessed: true,
        insuranceVerified: false,
        createdAt: '2025-04-17T09:15:00Z',
        physicianName: 'Dr. Johnson'
      },
      {
        id: 'order-003',
        patientName: 'Bob Williams',
        patientDob: '1990-12-10',
        patientMrn: 'MRN54321',
        status: 'pending_admin' as any,
        modality: 'X-Ray',
        bodyPart: 'Hand',
        emrProcessed: true,
        insuranceVerified: true,
        createdAt: '2025-04-17T08:45:00Z',
        physicianName: 'Dr. Brown'
      }
    ];
  };
  
  /**
   * Query for fetching the admin queue
   */
  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<AdminOrderQueueItem[], Error>({
    queryKey: ['adminQueue'],
    queryFn: fetchAdminQueue
  });
  
  return {
    orders: orders || [],
    isLoading,
    isError,
    error,
    refetch
  };
};