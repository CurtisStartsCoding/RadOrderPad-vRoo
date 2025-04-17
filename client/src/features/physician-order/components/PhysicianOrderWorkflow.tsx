import * as React from "react";
import { OrderProgressIndicator } from "../../../components/common/OrderProgressIndicator";
import { PatientInfoCard } from "./PatientInfoCard";
import { PatientIdentificationDialog } from "./PatientIdentificationDialog";
import { DictationStep } from "./DictationStep";
import { ValidationStep } from "./ValidationStep";
import { SignatureStep } from "./SignatureStep";
import { OverrideDialog } from "./OverrideDialog";
import { ClinicalContextPanel } from "./ClinicalContextPanel";
import { usePhysicianOrderWorkflow } from "../hooks/usePhysicianOrderWorkflow";

/**
 * PhysicianOrderWorkflow Component
 * 
 * This component orchestrates the entire physician order workflow.
 * It manages the overall state and renders the appropriate components
 * based on the current step in the workflow.
 */
export const PhysicianOrderWorkflow = () => {
  // Use the custom hook for state management and handlers
  const {
    // State
    currentStep,
    activePatient,
    isPatientIdentificationOpen,
    dictationText,
    isProcessingValidation,
    validationResult,
    attemptCount,
    orderId,
    orderData,
    isOverrideDialogOpen,
    overrideReason,
    isSubmittingOrder,
    isClinicalContextOpen,
    clinicalContextItems,
    
    // Setters
    setDictationText,
    setOverrideReason,
    setCurrentStep,
    
    // Handlers
    handleEditPatient,
    handleCancelIdentification,
    handlePatientIdentified,
    handleClearFeedback,
    handleProcessDictationRequest,
    handleOverrideRequest,
    handleOverrideConfirm,
    handleOverrideCancel,
    handleBackToDictation,
    handleSignOrder,
    handleOrderSubmitted,
    toggleClinicalContext
  } = usePhysicianOrderWorkflow();
  
  return (
    <div className="space-y-4">
      {/* Progress Indicator */}
      <div className="mb-6">
        <OrderProgressIndicator currentStep={currentStep} />
      </div>
      
      {/* Patient Information Card */}
      <div className="flex justify-between items-center">
        <PatientInfoCard 
          patient={activePatient}
          onEditPatient={handleEditPatient}
        />
        
        {/* Clinical Context Toggle Button */}
        <button
          type="button"
          onClick={toggleClinicalContext}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          {isClinicalContextOpen ? "Hide" : "Show"} Clinical Context
        </button>
      </div>
      
      {/* Patient Identification Dialog */}
      <PatientIdentificationDialog
        open={isPatientIdentificationOpen}
        onCancel={handleCancelIdentification}
        onIdentify={handlePatientIdentified}
      />
      
      {/* Dictation Step (Step 1) */}
      {currentStep === 1 && (
        <DictationStep
          dictationText={dictationText}
          setDictationText={setDictationText}
          isProcessing={isProcessingValidation}
          validationFeedback={validationResult}
          onClearFeedback={handleClearFeedback}
          attemptCount={attemptCount}
          onOverride={handleOverrideRequest}
          onProcessRequest={handleProcessDictationRequest}
        />
      )}
      
      {/* Validation Step (Step 2) */}
      {currentStep === 2 && orderData && validationResult && (
        <ValidationStep
          validationResult={validationResult}
          orderData={orderData}
          onBackToDictation={handleBackToDictation}
          onProceedToSignature={() => setCurrentStep(3)}
        />
      )}
      
      {/* Signature Step (Step 3) */}
      {currentStep === 3 && orderData && (
        <SignatureStep
          orderData={orderData}
          isSubmitting={isSubmittingOrder}
          onBackToValidation={() => setCurrentStep(2)}
          onSignOrder={handleSignOrder}
        />
      )}
      
      {/* Order Completed (Step 4) */}
      {currentStep === 4 && (
        <div className="p-6 border rounded-md bg-green-50 border-green-200 text-center">
          <h2 className="text-xl font-medium text-green-800 mb-2">Order Submitted Successfully</h2>
          <p className="text-green-700 mb-4">
            Your order has been submitted and is being processed.
            {orderId && <span> Order ID: <strong>{orderId}</strong></span>}
          </p>
          <button
            type="button"
            onClick={handleOrderSubmitted}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Create New Order
          </button>
        </div>
      )}
      
      {/* Override Dialog */}
      <OverrideDialog
        open={isOverrideDialogOpen}
        reason={overrideReason}
        setReason={setOverrideReason}
        onConfirm={handleOverrideConfirm}
        onCancel={handleOverrideCancel}
      />
      
      {/* Clinical Context Panel */}
      <ClinicalContextPanel
        isOpen={isClinicalContextOpen}
        onClose={toggleClinicalContext}
        items={clinicalContextItems}
      />
    </div>
  );
};