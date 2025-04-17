"use client";

import * as React from "react";
import { useAdminQueue } from "../../../../../src/features/admin-finalization";
import { AdminOrderTable } from "../../../../../src/features/admin-finalization";
import { Button } from "../../../../../src/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useAuth } from "../../../../../src/hooks/useAuth";
import { redirect } from "next/navigation";

/**
 * AdminQueuePage Component
 * 
 * Displays a table of orders pending admin action.
 * Protected route for admin_staff role.
 */
export default function AdminQueuePage() {
  // Get authentication state
  const { user, isLoading: isAuthLoading } = useAuth();
  
  // Get admin queue data
  const { orders, isLoading, isError, error, refetch } = useAdminQueue();
  
  // Redirect if not authenticated or not admin_staff
  React.useEffect(() => {
    if (!isAuthLoading && (!user || user.role !== 'admin_staff')) {
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
        <h1 className="text-2xl font-bold">Admin Order Queue</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
          className="flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      {isError ? (
        <div className="p-4 border border-red-200 bg-red-50 rounded-md">
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
      ) : (
        <AdminOrderTable orders={orders} isLoading={isLoading} />
      )}
    </div>
  );
}