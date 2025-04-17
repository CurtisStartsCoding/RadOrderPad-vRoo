/**
 * Connections Page
 * 
 * Page for managing connections between organizations.
 */

'use client';

import React from 'react';
import { useAuth } from '../../../../../src/hooks/useAuth';
import { 
  ConnectionList, 
  PendingRequestsList, 
  RequestConnectionButton, 
  RequestConnectionModal,
  useConnectionManagement,
  OrganizationType
} from '../../../../../src/features/connection-management';

/**
 * Connections Page Component
 */
export default function ConnectionsPage() {
  const { user } = useAuth();
  
  // Get the user's organization type
  const userOrganizationType = user?.role.includes('referring') 
    ? OrganizationType.REFERRING_PRACTICE 
    : OrganizationType.RADIOLOGY_GROUP;
  
  const {
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
    
    // Modal state
    isRequestModalOpen,
    
    // Actions
    approveConnection,
    rejectConnection,
    terminateConnection,
    requestConnection,
    
    // Modal handlers
    openRequestModal,
    closeRequestModal,
    
    // Search handlers
    handleSearch,
    handleSelectOrganization
  } = useConnectionManagement();
  
  return (
    <div className="container py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Partner Connections</h1>
        <RequestConnectionButton onClick={openRequestModal} />
      </div>
      
      {/* Pending Requests Section */}
      {pendingRequests && pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pending Requests</h2>
          <PendingRequestsList
            requests={pendingRequests}
            isLoading={isLoadingPendingRequests}
            onApprove={approveConnection}
            onReject={rejectConnection}
            isApproving={isApprovingConnection}
            isRejecting={isRejectingConnection}
          />
        </div>
      )}
      
      {/* Active Connections Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Connections</h2>
        <ConnectionList
          connections={connections}
          isLoading={isLoadingConnections}
          onTerminate={terminateConnection}
          isTerminating={isTerminatingConnection}
        />
      </div>
      
      {/* Request Connection Modal */}
      <RequestConnectionModal
        open={isRequestModalOpen}
        onClose={closeRequestModal}
        onSearch={handleSearch}
        onSelectOrganization={handleSelectOrganization}
        onRequestConnection={requestConnection}
        searchResults={searchResults}
        selectedOrganization={selectedOrganization}
        isSearching={isSearching}
        isRequesting={isRequestingConnection}
        userOrganizationType={userOrganizationType}
      />
    </div>
  );
}