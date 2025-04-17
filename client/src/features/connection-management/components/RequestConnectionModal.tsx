/**
 * RequestConnectionModal Component
 * 
 * A modal for searching and requesting connections with partner organizations.
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  OrganizationSearchParams, 
  OrganizationSearchResult, 
  OrganizationType 
} from '../types';
import {
  OrganizationSearchForm,
  OrganizationSearchResults,
  ConnectionRequestForm
} from './form';

interface RequestConnectionModalProps {
  open: boolean;
  onClose: () => void;
  onSearch: (params: OrganizationSearchParams) => void;
  onSelectOrganization: (organization: OrganizationSearchResult | null) => void;
  onRequestConnection: (notes?: string) => void;
  searchResults: OrganizationSearchResult[] | undefined;
  selectedOrganization: OrganizationSearchResult | null;
  isSearching: boolean;
  isRequesting: boolean;
  userOrganizationType: OrganizationType;
}

export const RequestConnectionModal: React.FC<RequestConnectionModalProps> = ({
  open,
  onClose,
  onSearch,
  onSelectOrganization,
  onRequestConnection,
  searchResults,
  selectedOrganization,
  isSearching,
  isRequesting,
  userOrganizationType
}) => {
  // Determine the type of organization to search for
  const searchType = userOrganizationType === OrganizationType.REFERRING_PRACTICE
    ? OrganizationType.RADIOLOGY_GROUP
    : OrganizationType.REFERRING_PRACTICE;
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Request Connection</DialogTitle>
          <DialogDescription>
            Search for a partner organization and request a connection.
          </DialogDescription>
        </DialogHeader>
        
        {!selectedOrganization ? (
          // Search view
          <div>
            <OrganizationSearchForm
              onSearch={onSearch}
              isSearching={isSearching}
              searchType={searchType}
            />
            
            <OrganizationSearchResults
              results={searchResults}
              onSelectOrganization={onSelectOrganization}
            />
          </div>
        ) : (
          // Request view
          <ConnectionRequestForm
            selectedOrganization={selectedOrganization}
            onRequestConnection={onRequestConnection}
            onBack={() => onSelectOrganization(null)}
            isRequesting={isRequesting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};