import * as React from "react";
import { ValidationView } from "./ValidationView";
import { OrderData, ValidationResult } from "../types";

/**
 * ValidationStep Component
 * 
 * A wrapper component for the validation step in the physician order workflow.
 * Receives state and handlers from the parent component and passes them to ValidationView.
 */
interface ValidationStepProps {
  /** Validation result */
  validationResult: ValidationResult;
  
  /** Order data */
  orderData: OrderData;
  
  /** Function to handle going back to dictation */
  onBackToDictation: () => void;
  
  /** Function to handle proceeding to signature */
  onProceedToSignature: () => void;
}

export const ValidationStep: React.FC<ValidationStepProps> = ({
  validationResult,
  orderData,
  onBackToDictation,
  onProceedToSignature
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Validate Order</h2>
        <p className="mt-1 text-sm text-gray-500">
          Review the order details below. You can go back to edit the dictation or proceed to sign the order.
        </p>
      </div>
      
      <ValidationView
        validationResult={validationResult}
        orderData={orderData}
        onBackToDictation={onBackToDictation}
        onProceedToSignature={onProceedToSignature}
      />
    </div>
  );
};