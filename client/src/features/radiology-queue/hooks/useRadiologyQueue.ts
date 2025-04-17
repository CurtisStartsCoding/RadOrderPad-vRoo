import { useState } from 'react';
import { useQuery } from '../../../lib/mock-tanstack-query';
import { RadiologyOrderFilters, RadiologyQueueResponse, RadiologyOrderStatus } from '../types/radiology-order-types';
import { getDateDaysAgo } from '../utils/date-utils';

/**
 * Custom hook for managing the radiology order queue
 * 
 * This hook is responsible for fetching the radiology order queue data
 * and managing filter state.
 */
export const useRadiologyQueue = () => {
  // Default filter values
  const defaultFilters: RadiologyOrderFilters = {
    status: RadiologyOrderStatus.PENDING_REVIEW,
    dateFrom: getDateDaysAgo(30),
    dateTo: getDateDaysAgo(0)
  };
  
  // Filter state
  const [filters, setFilters] = useState<RadiologyOrderFilters>(defaultFilters);
  
  /**
   * Fetch radiology orders
   */
  const fetchRadiologyOrders = async (): Promise<RadiologyQueueResponse> => {
    // In a real implementation, this would be a fetch call to the API
    // For now, we'll return mock data
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    return {
      orders: [
        {
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
        },
        {
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
        }
      ],
      total: 2,
      page: 1,
      pageSize: 10
    };
  };
  
  /**
   * Query for fetching radiology orders
   */
  const {
    data: queueData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<RadiologyQueueResponse, Error>({
    queryKey: ['radiologyOrders', filters],
    queryFn: fetchRadiologyOrders
  });
  
  /**
   * Update a single filter value
   * 
   * @param key - Filter key to update
   * @param value - New filter value
   */
  const updateFilter = <K extends keyof RadiologyOrderFilters>(
    key: K,
    value: RadiologyOrderFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  /**
   * Reset filters to default values
   */
  const resetFilters = () => {
    setFilters(defaultFilters);
  };
  
  return {
    // Queue data
    orders: queueData?.orders || [],
    total: queueData?.total || 0,
    page: queueData?.page || 1,
    pageSize: queueData?.pageSize || 10,
    
    // Loading and error states
    isLoading,
    isError,
    error,
    refetch,
    
    // Filter state and actions
    filters,
    updateFilter,
    resetFilters
  };
};