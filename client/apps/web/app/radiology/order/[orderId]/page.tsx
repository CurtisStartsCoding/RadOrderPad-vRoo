"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../../../src/hooks/useAuth";
import { useRadiologyOrderDetail } from "../../../../../../src/features/radiology-queue";
import {
  RadiologyOrderDetailDisplay,
  RadiologyOrderActions
} from "../../../../../../src/features/radiology-queue";
import { Button } from "../../../../../../src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

/**
 * Props for the RadiologyOrderDetailPage component
 */
interface RadiologyOrderDetailPageProps {
  params: {
    orderId: string;
  };
}

/**
 * RadiologyOrderDetailPage Component
 * 
 * Displays the details of a radiology order and provides actions
 * for updating status and exporting data.
 * Protected route for radiology_staff and admin roles.
 */
export default function RadiologyOrderDetailPage({ params }: RadiologyOrderDetailPageProps) {
  // Access orderId directly from params
  const { orderId } = params;
  
  const router = useRouter();
  
  // Get authentication state
  const { user, isLoading: isAuthLoading } = useAuth();
  
  // Get radiology order detail data and actions
  const {
    orderData,
    isLoadingOrder,
    isOrderError,
    orderError,
    refetchOrder,
    
    updateStatus,
    isUpdatingStatus,
    
    exportOptions,
    updateExportOptions,
    handleExport
  } = useRadiologyOrderDetail(orderId);
  
  // Redirect if not authenticated or not authorized
  React.useEffect(() => {
    if (!isAuthLoading && (!user || (user.role !== 'radiology_staff' && user.role !== 'admin'))) {
      redirect('/login');
    }
  }, [user, isAuthLoading]);
  
  // Handle back button click
  const handleBackClick = () => {
    router.push('/radiology/queue');
  };
  
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
  
  // If loading order, show loading state
  if (isLoadingOrder) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }
  
  // If error loading order, show error state
  if (isOrderError || !orderData) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Details</h1>
          <Button
            variant="outline"
            onClick={handleBackClick}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Queue
          </Button>
        </div>
        
        <div className="p-4 border border-red-200 bg-red-50 rounded-md">
          <p className="text-red-700">
            Error loading order: {orderError?.message || "Unknown error"}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchOrder()}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <Button
          variant="outline"
          onClick={handleBackClick}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Queue
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details (2/3 width on large screens) */}
        <div className="lg:col-span-2">
          <RadiologyOrderDetailDisplay orderData={orderData} />
        </div>
        
        {/* Actions (1/3 width on large screens) */}
        <div>
          <RadiologyOrderActions
            currentStatus={orderData.status}
            updateStatus={updateStatus}
            isUpdatingStatus={isUpdatingStatus}
            
            exportOptions={exportOptions}
            updateExportOptions={updateExportOptions}
            handleExport={handleExport}
          />
        </div>
      </div>
    </div>
  );
}