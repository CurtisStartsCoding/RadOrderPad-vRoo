import * as React from "react";
import { Mic, X, AlertTriangle, Loader2 } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ValidationFeedbackBanner } from "./ValidationFeedbackBanner";
import { useDictation } from "../hooks/useDictation";
import { DictationFormProps, ValidationStatus } from "../types";

/**
 * DictationForm Component
 * 
 * Provides an interface for physicians to dictate orders using voice or text input.
 * Includes recording controls, text area for editing, character count, and validation feedback.
 */
export const DictationForm: React.FC<DictationFormProps> = ({
  dictationText,
  setDictationText,
  isProcessing,
  validationFeedback,
  onClearFeedback,
  attemptCount,
  onOverride,
  onProcessRequest
}) => {
  // Use the dictation hook for speech recognition functionality
  const { isRecording, toggleRecording, clearDictation, isSupported } = useDictation(
    dictationText,
    setDictationText
  );

  // Calculate character count and limit
  const characterCount = dictationText.length;
  const characterLimit = 2000;
  const isOverLimit = characterCount > characterLimit;
  
  // Determine if the process button should be disabled
  const isProcessDisabled = 
    isProcessing || 
    isRecording || 
    characterCount === 0 || 
    isOverLimit ||
    (validationFeedback?.status === ValidationStatus.PROCESSING);

  return (
    <div className="space-y-4">
      {/* Validation Feedback Banner */}
      {validationFeedback && validationFeedback.status !== ValidationStatus.NONE && (
        <ValidationFeedbackBanner
          feedback={validationFeedback}
          attemptCount={attemptCount}
          onOverride={onOverride}
          onAddClarification={() => {
            // Focus the textarea when adding clarification
            const textarea = document.getElementById("dictation-textarea");
            if (textarea) {
              textarea.focus();
            }
          }}
        />
      )}

      {/* Main Dictation Card */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Textarea for dictation */}
          <div className="relative">
            <textarea
              id="dictation-textarea"
              className={`w-full h-40 p-3 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isOverLimit ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Begin dictating or type your order here..."
              value={dictationText}
              onChange={(e) => {
                setDictationText(e.target.value);
                if (validationFeedback && onClearFeedback) {
                  onClearFeedback();
                }
              }}
              disabled={isRecording || isProcessing}
            />
            
            {/* Character count */}
            <div className={`text-xs mt-1 flex justify-end ${
              isOverLimit ? "text-red-500" : "text-gray-500"
            }`}>
              {isOverLimit && (
                <span className="flex items-center mr-2">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Character limit exceeded
                </span>
              )}
              <span>{characterCount} / {characterLimit}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              {/* Microphone button */}
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={toggleRecording}
                disabled={!isSupported || isProcessing}
                className="flex items-center"
                title={isRecording ? "Stop recording" : "Start recording"}
              >
                <Mic className="h-4 w-4 mr-1" />
                {isRecording ? "Stop" : "Record"}
              </Button>

              {/* Clear button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  clearDictation();
                  if (validationFeedback && onClearFeedback) {
                    onClearFeedback();
                  }
                }}
                disabled={characterCount === 0 || isRecording || isProcessing}
                className="flex items-center"
                title="Clear dictation"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>

            {/* Process button */}
            <Button
              type="button"
              variant="default"
              onClick={onProcessRequest}
              disabled={isProcessDisabled}
              className="flex items-center"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Order"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};