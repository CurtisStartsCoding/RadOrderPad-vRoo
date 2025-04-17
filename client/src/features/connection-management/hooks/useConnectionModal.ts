/**
 * useConnectionModal Hook
 * 
 * Custom hook for managing the connection request modal state.
 */

import { useState } from 'react';
import { OrganizationSearchResult } from '../types';

/**
 * Hook for managing connection modal state
 * 
 * @returns Modal state and handlers
 */
export const useConnectionModal = () => {
  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationSearchResult | null>(null);
  
  /**
   * Open the modal
   */
  const openModal = () => {
    setIsOpen(true);
  };
  
  /**
   * Close the modal and reset state
   */
  const closeModal = () => {
    setIsOpen(false);
    setSelectedOrganization(null);
  };
  
  /**
   * Select an organization
   * 
   * @param organization The organization to select, or null to clear selection
   */
  const selectOrganization = (organization: OrganizationSearchResult | null) => {
    setSelectedOrganization(organization);
  };
  
  return {
    isOpen,
    selectedOrganization,
    openModal,
    closeModal,
    selectOrganization
  };
};