"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../../src/hooks/useAuth";
import { useRadiologyQueue } from "../../../../../src/features/radiology-queue";
import { QueueFilters, RadiologyOrderTable } from "../../../../../src/features/radiology-queue";
import { Button } from "../../../../../src/components/ui/button";
import { redirect } from "next/navigation";

/**
 * RadiologyQueuePage Component
 * 
 * Displays the radiology order queue with filtering capabilities.
 * Protected route for radiology_staff and admin roles.
 */
export default function RadiologyQueuePage() {
  const router = useRouter();
  
  // Get authentication state
  const { user, isLoading: isAuthLoading } = useAuth();
  
  // Get radiology queue data and actions
  const {
    orders,
    isLoading,
    isError,
    error,
    refetch,
    filters,
    updateFilter,
    resetFilters
  } = useRadiologyQueue();
  
  // Redirect if not authenticated or not authorized
  React.useEffect(() => {
    if (!isAuthLoading && (!user || (user.role !== 'radiology_staff' && user.role !== 'admin'))) {
      redirect('/login');
    }
  }, [user, isAuthLoading]);
  
  // If still loading auth, show loading state
  if (isAuthLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Radiology Order Queue</h1>
      </div>
      
      {/* Filters */}
      <QueueFilters
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
      />
      
      {/* Error State */}
      {isError && (
        <div className="p-4 mb-4 border border-red-200 bg-red-50 rounded-md">
          <p className="text-red-700">
            Error loading orders: {error?.message || "Unknown error"}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}
      
      {/* Order Table */}
      <RadiologyOrderTable
        orders={orders}
        isLoading={isLoading}
      />
    </div>
  );
}