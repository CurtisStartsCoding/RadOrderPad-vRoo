import { useQuery } from '../../../lib/mock-tanstack-query';
import { RadiologyOrder, RadiologyOrderStatus } from '../types/radiology-order-types';

/**
 * Custom hook for fetching radiology order data
 * 
 * This hook is responsible for fetching order details from the API.
 */
export const useRadiologyOrderData = (orderId: string) => {
  /**
   * Fetch order details
   */
  const fetchOrderDetail = async (): Promise<RadiologyOrder> => {
    // In a real implementation, this would be a fetch call to the API
    // For now, we'll return mock data
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    if (orderId === 'order-001') {
      return {
        id: 'order-001',
        patient: {
          id: 123,
          name: 'John Doe',
          dob: '1980-01-01',
          mrn: 'MRN12345',
          pidn: 'PIDN67890'
        },
        insurance: {
          provider: 'Blue Cross Blue Shield',
          memberId: 'BCBS123456789',
          groupNumber: 'GRP987654',
          primaryHolder: 'John Doe',
          relationship: 'self',
          verified: true
        },
        status: RadiologyOrderStatus.PENDING_REVIEW,
        modality: 'MRI',
        bodyPart: 'Brain',
        contrast: true,
        contrastType: 'Gadolinium',
        instructions: 'None',
        clinicalIndications: ['Headache', 'Dizziness'],
        icd10Codes: [
          { code: 'R51', description: 'Headache' },
          { code: 'R42', description: 'Dizziness and giddiness' }
        ],
        cptCodes: [
          { code: '70551', description: 'MRI Brain without contrast' }
        ],
        documents: [],
        createdAt: '2025-04-15T08:00:00Z',
        createdBy: 'Dr. Smith',
        updatedAt: '2025-04-15T09:00:00Z',
        updatedBy: 'Admin User'
      };
    } else if (orderId === 'order-002') {
      return {
        id: 'order-002',
        patient: {
          id: 456,
          name: 'Jane Smith',
          dob: '1975-05-15',
          mrn: 'MRN54321',
          pidn: 'PIDN09876'
        },
        insurance: {
          provider: 'Aetna',
          memberId: 'AET987654321',
          groupNumber: 'GRP123456',
          primaryHolder: 'Jane Smith',
          relationship: 'self',
          verified: true
        },
        status: RadiologyOrderStatus.IN_PROGRESS,
        modality: 'CT',
        bodyPart: 'Chest',
        contrast: false,
        instructions: 'Patient has asthma',
        clinicalIndications: ['Chest pain', 'Shortness of breath'],
        icd10Codes: [
          { code: 'R07.9', description: 'Chest pain, unspecified' },
          { code: 'R06.02', description: 'Shortness of breath' }
        ],
        cptCodes: [
          { code: '71250', description: 'CT Thorax without contrast' }
        ],
        documents: [
          {
            id: 'doc-001',
            type: 'lab_result',
            name: 'CBC Results',
            url: '/documents/doc-001',
            uploadedAt: '2025-04-16T10:30:00Z',
            uploadedBy: 'Lab Tech'
          }
        ],
        overrideInfo: {
          isOverridden: true,
          overriddenBy: 'Dr. Johnson',
          overriddenAt: '2025-04-16T11:00:00Z',
          reason: 'Urgent case'
        },
        createdAt: '2025-04-16T08:00:00Z',
        createdBy: 'Dr. Johnson',
        updatedAt: '2025-04-16T11:00:00Z',
        updatedBy: 'Dr. Johnson'
      };
    } else {
      throw new Error(`Order with ID ${orderId} not found`);
    }
  };
  
  /**
   * Query for fetching order details
   */
  const {
    data: orderData,
    isLoading: isLoadingOrder,
    isError: isOrderError,
    error: orderError,
    refetch: refetchOrder
  } = useQuery<RadiologyOrder, Error>({
    queryKey: ['radiologyOrder', orderId],
    queryFn: fetchOrderDetail,
    enabled: !!orderId
  });
  
  return {
    orderData,
    isLoadingOrder,
    isOrderError,
    orderError,
    refetchOrder
  };
};