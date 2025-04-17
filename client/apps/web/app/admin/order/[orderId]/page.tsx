"use client";

import * as React from "react";
import { useAdminOrderDetail } from "../../../../../../src/features/admin-finalization";
import {
  OrderSummaryDisplay,
  PatientInfoEditor,
  InsuranceInfoEditor,
  EmrPasteSection,
  SupplementalDocsSection,
  AdminActions
} from "../../../../../../src/features/admin-finalization";
import { Button } from "../../../../../../src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../../../src/hooks/useAuth";
import { redirect } from "next/navigation";

/**
 * Props for the AdminOrderDetailPage component
 */
interface AdminOrderDetailPageProps {
  params: {
    orderId: string;
  };
}

/**
 * AdminOrderDetailPage Component
 * 
 * Displays the details of an order and provides interfaces for
 * processing EMR summaries, supplemental documents, and sending to radiology.
 * Protected route for admin_staff role.
 */
export default function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  // Access orderId directly from params
  const { orderId } = params;
  
  const router = useRouter();
  
  // Get authentication state
  const { user, isLoading: isAuthLoading } = useAuth();
  
  // Get admin order detail data and actions
  const {
    orderData,
    isLoadingOrder,
    isOrderError,
    orderError,
    refetchOrder,
    
    emrPasteText,
    setEmrPasteText,
    processEmrPaste,
    isProcessingEmr,
    
    supplementalPasteText,
    setSupplementalPasteText,
    processSupplementalDoc,
    isProcessingSupplemental,
    
    isEditingPatient,
    setIsEditingPatient,
    updatePatientInfo,
    isUpdatingPatient,
    
    isEditingInsurance,
    setIsEditingInsurance,
    updateInsuranceInfo,
    isUpdatingInsurance,
    
    sendToRadiology,
    isSendingToRadiology,
    canSendToRadiology
  } = useAdminOrderDetail(orderId);
  
  // Redirect if not authenticated or not admin_staff
  React.useEffect(() => {
    if (!isAuthLoading && (!user || user.role !== 'admin_staff')) {
      redirect('/login');
    }
  }, [user, isAuthLoading]);
  
  // Handle back button click
  const handleBackClick = () => {
    router.push('/admin/queue');
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
  
  // Determine if the order can be sent to radiology
  const canSend = canSendToRadiology === true;
  
  // Determine blockers
  const blockers = [
    !orderData.emrSummary?.processedText && "EMR summary must be processed",
    !orderData.insurance?.verified && "Insurance must be verified"
  ].filter(Boolean) as string[];
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Patient Information */}
        <PatientInfoEditor
          patient={orderData.patient}
          isEditing={isEditingPatient}
          isUpdating={isUpdatingPatient}
          onToggleEdit={() => setIsEditingPatient(!isEditingPatient)}
          onUpdatePatient={updatePatientInfo}
        />
        
        {/* Insurance Information */}
        <InsuranceInfoEditor
          insurance={orderData.insurance}
          isEditing={isEditingInsurance}
          isUpdating={isUpdatingInsurance}
          onToggleEdit={() => setIsEditingInsurance(!isEditingInsurance)}
          onUpdateInsurance={updateInsuranceInfo}
        />
      </div>
      
      {/* Order Summary */}
      <div className="mb-6">
        <OrderSummaryDisplay orderData={orderData} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* EMR Summary */}
        <EmrPasteSection
          pasteText={emrPasteText}
          setPasteText={setEmrPasteText}
          onProcess={processEmrPaste}
          isProcessing={isProcessingEmr}
          existingEmrSummary={orderData.emrSummary}
        />
        
        {/* Supplemental Documents */}
        <SupplementalDocsSection
          pasteText={supplementalPasteText}
          setPasteText={setSupplementalPasteText}
          onProcess={processSupplementalDoc}
          isProcessing={isProcessingSupplemental}
          existingDocs={orderData.supplementalDocuments}
        />
      </div>
      
      {/* Admin Actions */}
      <div className="mb-6">
        <AdminActions
          onSendToRadiology={sendToRadiology}
          isSending={isSendingToRadiology}
          canSend={canSend}
          blockers={blockers}
        />
      </div>
    </div>
  );
}