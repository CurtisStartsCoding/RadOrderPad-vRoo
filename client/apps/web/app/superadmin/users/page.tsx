/**
 * Super Admin Users Page
 * 
 * Page for managing users in the Super Admin feature.
 */

'use client';

import React from 'react';
import { 
  SuperAdminLayout, 
  SuperAdminUserTable,
  useSuperAdminUsers
} from '../../../../../src/features/super-admin';

/**
 * Users Page Component
 */
export default function UsersPage() {
  const {
    users,
    filterParams,
    isLoading,
    toggleUserActive,
    sendPasswordReset,
    verifyEmail,
    updateFilters,
    resetFilters
  } = useSuperAdminUsers();
  
  // Handle toggle user active
  const handleToggleActive = (userId: number, isActive: boolean) => {
    toggleUserActive({ userId, isActive });
  };
  
  // Handle send password reset
  const handleSendPasswordReset = (userId: number) => {
    sendPasswordReset({ userId });
  };
  
  // Handle verify email
  const handleVerifyEmail = (userId: number) => {
    verifyEmail({ userId });
  };
  
  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Users</h1>
        </div>
        
        <SuperAdminUserTable
          users={users}
          isLoading={isLoading}
          onToggleActive={handleToggleActive}
          onSendPasswordReset={handleSendPasswordReset}
          onVerifyEmail={handleVerifyEmail}
          onUpdateFilters={updateFilters}
          onResetFilters={resetFilters}
          filterParams={filterParams}
        />
      </div>
    </SuperAdminLayout>
  );
}