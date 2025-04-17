/**
 * API Utilities
 * 
 * This file provides utilities for making API requests.
 * This is a mock implementation for development purposes.
 */

/**
 * Make an API request
 * 
 * @param endpoint - The API endpoint to call
 * @param method - The HTTP method to use
 * @param data - Optional data to send with the request
 * @returns Promise resolving to the response data
 */
export async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<T> {
  // In a real application, this would make an actual API call
  // For now, we'll simulate API responses for development
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock API responses based on the endpoint and method
  if (endpoint.startsWith('/users')) {
    if (method === 'GET') {
      // Mock user list
      return [
        {
          id: '1',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'physician',
          status: 'active',
          organizationId: 'org1',
          organizationName: 'General Hospital',
          createdAt: '2023-01-15T12:00:00Z',
          updatedAt: '2023-01-15T12:00:00Z'
        },
        {
          id: '2',
          email: 'jane.smith@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'admin_staff',
          status: 'active',
          organizationId: 'org1',
          organizationName: 'General Hospital',
          createdAt: '2023-02-20T14:30:00Z',
          updatedAt: '2023-02-20T14:30:00Z'
        },
        {
          id: '3',
          email: 'robert.johnson@example.com',
          firstName: 'Robert',
          lastName: 'Johnson',
          role: 'radiology_staff',
          status: 'pending',
          organizationId: 'org2',
          organizationName: 'City Medical Center',
          createdAt: '2023-03-10T09:15:00Z',
          updatedAt: '2023-03-10T09:15:00Z'
        }
      ] as unknown as T;
    } else if (method === 'POST' && endpoint.includes('/invite')) {
      // Mock invite user response
      return { success: true } as unknown as T;
    } else if (method === 'PUT') {
      // Mock update user response
      return {
        id: endpoint.split('/').pop(),
        email: 'updated.user@example.com',
        firstName: 'Updated',
        lastName: 'User',
        role: data?.role || 'physician',
        status: data?.status || 'active',
        organizationId: 'org1',
        organizationName: 'General Hospital',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      } as unknown as T;
    } else if (method === 'DELETE') {
      // Mock deactivate user response
      return { success: true } as unknown as T;
    }
  }
  
  // If no mock response is defined, throw an error
  throw new Error(`No mock response defined for ${method} ${endpoint}`);
}