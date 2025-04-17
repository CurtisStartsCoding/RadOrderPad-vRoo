/**
 * Super Admin Organizations Page
 * 
 * Page for managing organizations in the Super Admin feature.
 */

'use client';

import React from 'react';
import { 
  SuperAdminLayout, 
  SuperAdminOrgTable,
  useSuperAdminOrgs,
  OrganizationStatus
} from '../../../../../src/features/super-admin';

/**
 * Organizations Page Component
 */
export default function OrganizationsPage() {
  const {
    organizations,
    filterParams,
    isLoading,
    updateStatus,
    adjustCredits,
    updateFilters,
    resetFilters
  } = useSuperAdminOrgs();
  
  // Handle status update
  const handleUpdateStatus = (orgId: number, status: OrganizationStatus) => {
    updateStatus({ 
      orgId, 
      data: { 
        status,
        reason: `Status updated to ${status} by Super Admin`
      } 
    });
  };
  
  // Handle credit adjustment
  const handleAdjustCredits = (orgId: number, amount: number, reason: string) => {
    adjustCredits({ 
      orgId, 
      data: { 
        amount,
        reason
      } 
    });
  };
  
  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Organizations</h1>
        </div>
        
        <SuperAdminOrgTable
          organizations={organizations}
          isLoading={isLoading}
          onUpdateStatus={handleUpdateStatus}
          onAdjustCredits={handleAdjustCredits}
          onUpdateFilters={updateFilters}
          onResetFilters={resetFilters}
          filterParams={filterParams}
        />
      </div>
    </SuperAdminLayout>
  );
}