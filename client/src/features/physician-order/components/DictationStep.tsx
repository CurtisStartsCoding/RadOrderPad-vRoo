import * as React from "react";
import { DictationForm } from "./DictationForm";
import { ValidationFeedback } from "../types";

/**
 * DictationStep Component
 * 
 * A wrapper component for the dictation step in the physician order workflow.
 * Receives state and handlers from the parent component and passes them to DictationForm.
 */
interface DictationStepProps {
  /** Current dictation text */
  dictationText: string;
  
  /** Function to update dictation text */
  setDictationText: (text: string) => void;
  
  /** Whether the dictation is being processed */
  isProcessing: boolean;
  
  /** Validation feedback to display */
  validationFeedback: ValidationFeedback | null;
  
  /** Function to clear validation feedback */
  onClearFeedback: () => void;
  
  /** Number of attempts made to process the dictation */
  attemptCount: number;
  
  /** Function to handle override request */
  onOverride?: () => void;
  
  /** Function to handle process request */
  onProcessRequest: () => void;
}

export const DictationStep: React.FC<DictationStepProps> = ({
  dictationText,
  setDictationText,
  isProcessing,
  validationFeedback,
  onClearFeedback,
  attemptCount,
  onOverride,
  onProcessRequest
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Dictate Order</h2>
        <p className="mt-1 text-sm text-gray-500">
          Speak or type your order details. The system will process your input to generate the appropriate order.
        </p>
      </div>
      
      <DictationForm
        dictationText={dictationText}
        setDictationText={setDictationText}
        isProcessing={isProcessing}
        validationFeedback={validationFeedback}
        onClearFeedback={onClearFeedback}
        attemptCount={attemptCount}
        onOverride={onOverride}
        onProcessRequest={onProcessRequest}
      />
    </div>
  );
};