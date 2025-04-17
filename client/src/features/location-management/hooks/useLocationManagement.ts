/**
 * useLocationManagement Hook
 * 
 * Custom hook for managing locations in the admin interface.
 * This is a composition hook that combines the other location hooks.
 */

import { useState } from 'react';
import { Location, CreateLocationRequest, UpdateLocationRequest } from '../types/location-types';
import { useLocationList } from './useLocationList';
import { useSaveLocation } from './useSaveLocation';
import { useDeactivateLocation } from './useDeactivateLocation';

/**
 * Hook for managing locations
 */
export const useLocationManagement = () => {
  // State for location form dialog
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  
  // Use the individual hooks
  const {
    locations,
    filters,
    sort,
    isLoading: isLoadingLocations,
    isError: isErrorLocations,
    error: locationsError,
    refetch: refetchLocations,
    handleFilterChange,
    handleSortChange
  } = useLocationList();

  const {
    saveLocation,
    isLoading: isSavingLocation,
    error: saveError
  } = useSaveLocation();

  const {
    mutate: deactivateLocation,
    isPending: isDeactivatingLocation
  } = useDeactivateLocation();

  // Dialog handlers
  const handleOpenAddDialog = () => {
    setSelectedLocation(null);
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId) || null;
    setSelectedLocation(location);
    setFormDialogOpen(true);
  };

  const handleCloseFormDialog = () => {
    setFormDialogOpen(false);
    setSelectedLocation(null);
  };

  // Save handler
  const handleSaveLocation = (formData: CreateLocationRequest) => {
    const isEdit = !!selectedLocation;
    
    // If editing, include the ID
    const data = isEdit 
      ? { id: selectedLocation.id, ...formData } as UpdateLocationRequest
      : formData;
    
    saveLocation(data, isEdit);
    handleCloseFormDialog();
  };

  return {
    // Data
    locations,
    selectedLocation,
    filters,
    sort,
    
    // Loading states
    isLoadingLocations,
    isSavingLocation,
    isDeactivatingLocation,
    
    // Error states
    isErrorLocations,
    locationsError,
    saveError,
    
    // Dialog state
    formDialogOpen,
    
    // Actions
    saveLocation: handleSaveLocation,
    deactivateLocation,
    refetchLocations,
    
    // Dialog handlers
    handleOpenAddDialog,
    handleOpenEditDialog,
    handleCloseFormDialog,
    
    // Filter and sort handlers
    handleFilterChange,
    handleSortChange
  };
};