/**
 * useConnectionManagement Hook
 * 
 * Composition hook that brings together all connection management functionality.
 */

import { useConnectionList } from './useConnectionList';
import { usePendingRequests } from './usePendingRequests';
import { useOrganizationSearch } from './useOrganizationSearch';
import { useConnectionModal } from './useConnectionModal';
import { useConnectionMutations } from './useConnectionMutations';
import { OrganizationSearchParams, OrganizationSearchResult } from '../types';

/**
 * Composition hook for connection management
 * 
 * @returns Combined connection management functionality
 */
export const useConnectionManagement = () => {
  // Get connections
  const {
    connections,
    isLoading: isLoadingConnections,
    isError: isErrorConnections,
    error: connectionsError,
    refetch: refetchConnections
  } = useConnectionList();
  
  // Get pending requests
  const {
    pendingRequests,
    isLoading: isLoadingPendingRequests,
    isError: isErrorPendingRequests,
    error: pendingRequestsError,
    refetch: refetchPendingRequests
  } = usePendingRequests();
  
  // Organization search
  const {
    searchResults,
    isLoading: isSearching,
    isError: isErrorSearching,
    error: searchError,
    searchOrganizations
  } = useOrganizationSearch();
  
  // Modal state
  const {
    isOpen: isRequestModalOpen,
    selectedOrganization,
    openModal: openRequestModal,
    closeModal: closeRequestModal,
    selectOrganization: handleSelectOrganization
  } = useConnectionModal();
  
  // Mutations
  const {
    requestConnection,
    isRequestingConnection,
    approveConnection,
    isApprovingConnection,
    rejectConnection,
    isRejectingConnection,
    terminateConnection,
    isTerminatingConnection
  } = useConnectionMutations();
  
  /**
   * Handle requesting a connection
   * 
   * @param notes Optional notes for the connection request
   */
  const handleRequestConnection = (notes?: string) => {
    if (!selectedOrganization) return;
    
    requestConnection({
      relatedOrganizationId: selectedOrganization.id,
      notes
    });
    
    closeRequestModal();
  };
  
  /**
   * Handle searching for organizations
   * 
   * @param params Search parameters
   */
  const handleSearch = (params: OrganizationSearchParams) => {
    searchOrganizations(params);
  };
  
  return {
    // Data
    connections,
    pendingRequests,
    searchResults,
    selectedOrganization,
    
    // Loading states
    isLoadingConnections,
    isLoadingPendingRequests,
    isSearching,
    isRequestingConnection,
    isApprovingConnection,
    isRejectingConnection,
    isTerminatingConnection,
    
    // Error states
    isErrorConnections,
    isErrorPendingRequests,
    isErrorSearching,
    connectionsError,
    pendingRequestsError,
    searchError,
    
    // Modal state
    isRequestModalOpen,
    
    // Actions
    approveConnection,
    rejectConnection,
    terminateConnection,
    requestConnection: handleRequestConnection,
    
    // Modal handlers
    openRequestModal,
    closeRequestModal,
    
    // Search handlers
    handleSearch,
    handleSelectOrganization,
    
    // Refetch functions
    refetchConnections,
    refetchPendingRequests
  };
};