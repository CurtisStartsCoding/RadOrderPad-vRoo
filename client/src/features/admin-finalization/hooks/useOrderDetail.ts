import { useQuery } from '../../../lib/mock-tanstack-query';
import { AdminOrderData, InsuranceInfo, AdminOrderStatus, EmrSummary, SupplementalDocument } from '../types';
import { Patient } from '../../physician-order/types/patient-types';

/**
 * Custom hook for fetching and managing basic order data
 * 
 * This hook is responsible for fetching order details and providing
 * the basic order data for display and other operations.
 */
export const useOrderDetail = (orderId: string) => {
  /**
   * Fetch order details
   */
  const fetchOrderDetail = async (): Promise<AdminOrderData> => {
    // In a real implementation, this would be a fetch call to the API
    // For now, we'll return mock data
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock patient data
    const patient: Patient = {
      id: 123,
      name: 'John Doe',
      dob: '1980-01-01',
      mrn: 'MRN12345',
      pidn: 'PIDN67890'
    };
    
    // Mock insurance data
    const insurance: InsuranceInfo = {
      provider: 'Blue Cross Blue Shield',
      memberId: 'BCBS123456789',
      groupNumber: 'GRP987654',
      primaryHolder: 'John Doe',
      relationship: 'self',
      verified: false
    };
    
    // Mock EMR summary
    const emrSummary: EmrSummary | undefined = orderId === 'order-002' ? {
      rawText: 'Patient presents with headache and dizziness...',
      processedText: 'Headache and dizziness for 3 days. No fever or nausea.',
      processedAt: '2025-04-17T09:30:00Z',
      processedBy: 'Admin User'
    } : undefined;
    
    // Mock supplemental documents
    const supplementalDocuments: SupplementalDocument[] = orderId === 'order-002' ? [
      {
        id: 'doc-001',
        type: 'lab_result',
        content: 'CBC Results: WBC 7.5, RBC 4.8, Hgb 14.2, Hct 42.1, Plt 250',
        addedAt: '2025-04-17T09:45:00Z',
        addedBy: 'Admin User',
        description: 'Complete Blood Count'
      }
    ] : [];
    
    // Return mock order data
    return {
      id: orderId,
      patient,
      insurance,
      status: AdminOrderStatus.PENDING_ADMIN,
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
      emrSummary,
      supplementalDocuments,
      createdAt: '2025-04-17T08:00:00Z',
      createdBy: 'Dr. Smith',
      updatedAt: '2025-04-17T09:00:00Z',
      updatedBy: 'Admin User'
    };
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
  } = useQuery<AdminOrderData, Error>({
    queryKey: ['adminOrder', orderId],
    queryFn: fetchOrderDetail,
    enabled: !!orderId
  });

  // Check if order can be sent to radiology
  const canSendToRadiology = orderData && 
    orderData.emrSummary?.processedText && 
    orderData.insurance?.verified;
  
  return {
    orderData,
    isLoadingOrder,
    isOrderError,
    orderError,
    refetchOrder,
    canSendToRadiology
  };
};