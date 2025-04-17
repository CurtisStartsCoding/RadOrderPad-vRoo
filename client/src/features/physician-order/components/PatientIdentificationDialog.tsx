import * as React from "react";
import { Mic, Square, AlertTriangle, User, Calendar, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../../../components/ui/dialog";
import { usePatientIdentification } from "../hooks/usePatientIdentification";
import { DEFAULT_DOB_MANUAL } from "../constants";

/**
 * PatientIdentificationDialog Component
 * 
 * A dialog for identifying patients through voice or text input.
 * Uses the usePatientIdentification hook for state management and logic.
 */
interface PatientIdentificationDialogProps {
  open: boolean;
  onCancel: () => void;
  onIdentify: (patientInfo: { name: string; dob: string }) => void;
}

export const PatientIdentificationDialog = ({
  open,
  onCancel,
  onIdentify,
}: PatientIdentificationDialogProps) => {
  // Use the custom hook for state management and handlers
  const {
    transcript,
    isListening,
    isParsing,
    error,
    showSuggestions,
    patientSuggestions,
    toggleRecording,
    parsePatientInfo,
    handleSelectSuggestion,
    handleManualInputConfirm,
    handleTranscriptChange,
    handleCancel,
    setShowSuggestions
  } = usePatientIdentification({ onIdentify, onCancel });

  // Render the main dialog
  return (
    <>
      {/* Main Identification Dialog */}
      <Dialog open={open} onOpenChange={(isOpen: boolean) => !isOpen && handleCancel()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Patient Identification</DialogTitle>
            <DialogDescription>
              Speak or type the patient's name and date of birth.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Recording Control & Status */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">
                {isListening ? (
                  <span className="flex items-center text-blue-600 animate-pulse">
                    <span className="mr-1">●</span> Recording...
                  </span>
                ) : (
                  <span>Press mic or type below</span>
                )}
              </span>
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                className="h-9 w-9 p-0 flex-shrink-0"
                onClick={toggleRecording}
                disabled={isParsing}
                title={isListening ? "Stop recording" : "Start recording"}
              >
                {isListening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>

            {/* Transcript / Manual Input Area */}
            <div>
              <Input
                id="patient-id-input"
                type="text"
                placeholder="Speak or type name and DOB..."
                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full h-10"
                value={transcript}
                onChange={(e) => handleTranscriptChange(e.target.value)}
                disabled={isListening || isParsing}
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: "Jane Doe, date of birth January 1st 1990"
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="text-sm text-red-600 flex items-start p-2 border border-red-200 rounded-md bg-red-50">
                <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="sm:justify-between border-t pt-4 mt-2">
            <Button variant="ghost" onClick={handleCancel} disabled={isParsing}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => parsePatientInfo(transcript)}
              disabled={!transcript.trim() || isParsing || isListening}
            >
              {isParsing ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Parsing...
                </>
              ) : (
                "Identify Patient"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suggestions Dialog */}
      {showSuggestions && (
        <Dialog open={showSuggestions} onOpenChange={(isOpen: boolean) => setShowSuggestions(isOpen)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Confirm Patient Information</DialogTitle>
              <DialogDescription>
                Select the best match for your input, or confirm manual entry.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto px-1 pb-2">
              {/* Original Input Display */}
              <div className="bg-gray-100 p-3 rounded-md text-sm border border-gray-200">
                <span className="font-semibold text-gray-700">Your Input:</span>
                <div className="italic mt-1 text-gray-600">{transcript}</div>
              </div>

              {/* Suggestions List */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-800">Possible Interpretations:</div>
                {patientSuggestions.length > 0 ? (
                  patientSuggestions.map((suggestion, index) => (
                    <Card
                      key={index}
                      className="border border-gray-200 hover:border-primary rounded-md p-3 cursor-pointer transition-all flex items-center justify-between gap-2"
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center text-sm mb-1">
                          <User className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                          <span className="font-medium text-gray-900 truncate" title={suggestion.name}>
                            {suggestion.name}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                          <span>{suggestion.dob}</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 px-3 text-xs" 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          handleSelectSuggestion(suggestion);
                        }}
                      >
                        Select
                      </Button>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No specific interpretations found.</p>
                )}
              </div>

              {/* Option to use raw text */}
              <div className="pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">If none of the above are correct:</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs"
                  onClick={handleManualInputConfirm}
                >
                  Use "{transcript.substring(0, 20)}{transcript.length > 20 ? '...' : ''}" as Name (DOB: {DEFAULT_DOB_MANUAL})
                </Button>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setShowSuggestions(false)}>
                Cancel Selection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};