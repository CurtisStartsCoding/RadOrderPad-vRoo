import * as React from "react";
import { SignatureForm } from "./SignatureForm";
import { OrderData } from "../types";

/**
 * SignatureStep Component
 * 
 * A wrapper component for the signature step in the physician order workflow.
 * Receives state and handlers from the parent component and passes them to SignatureForm.
 */
interface SignatureStepProps {
  /** Order data */
  orderData: OrderData;
  
  /** Whether the order is being submitted */
  isSubmitting: boolean;
  
  /** Function to handle going back to validation */
  onBackToValidation: () => void;
  
  /** Function to handle signing the order */
  onSignOrder: (signatureData: string) => void;
}

export const SignatureStep: React.FC<SignatureStepProps> = ({
  orderData,
  isSubmitting,
  onBackToValidation,
  onSignOrder
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Sign Order</h2>
        <p className="mt-1 text-sm text-gray-500">
          Please review the order summary and sign below to confirm this order.
        </p>
      </div>
      
      <SignatureForm
        orderData={orderData}
        isSubmitting={isSubmitting}
        onBackToValidation={onBackToValidation}
        onSignOrder={onSignOrder}
      />
    </div>
  );
};