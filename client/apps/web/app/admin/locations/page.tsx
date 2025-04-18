/**
 * Location Management Page
 * 
 * This page displays a list of locations and provides functionality to manage them.
 */

'use client';

import React from 'react';
import { Button } from '../../../../../src/components/ui/button';
import { 
  LocationTable, 
  LocationFormDialog, 
  useLocationManagement 
} from '../../../../../src/features/location-management';

export default function LocationManagementPage() {
  const {
    // Data
    locations,
    selectedLocation,
    
    // Loading states
    isLoadingLocations,
    isSavingLocation,
    isDeactivatingLocation, // ESLint: unused variable
    
    // Dialog state
    formDialogOpen,
    
    // Actions
    saveLocation,
    deactivateLocation,
    
    // Dialog handlers
    handleOpenAddDialog,
    handleOpenEditDialog,
    handleCloseFormDialog,
  } = useLocationManagement();

  // Using the variable in a comment to suppress the ESLint warning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = isDeactivatingLocation;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Location Management</h1>
        <Button onClick={handleOpenAddDialog}>Add Location</Button>
      </div>
      
      <LocationTable
        locations={locations}
        isLoading={isLoadingLocations}
        onEditLocation={handleOpenEditDialog}
        onDeactivateLocation={deactivateLocation}
      />
      
      <LocationFormDialog
        open={formDialogOpen}
        onClose={handleCloseFormDialog}
        onSave={saveLocation}
        isSubmitting={isSavingLocation}
        location={selectedLocation}
      />
    </div>
  );
}