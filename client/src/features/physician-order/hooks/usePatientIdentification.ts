import { useState, useCallback } from "react";
import { 
  DEFAULT_DOB_PRIMARY, 
  DEFAULT_DOB_SECONDARY, 
  DEFAULT_DOB_MANUAL,
  CONFIDENCE_SCORE_PRIMARY,
  CONFIDENCE_SCORE_SECONDARY,
  PARSING_DELAY_MS
} from "../constants";

/**
 * Interface for patient suggestion
 */
interface PatientSuggestion {
  name: string;
  dob: string;
  confidence: number;
}

/**
 * Custom hook for managing patient identification dialog state and logic
 * 
 * This hook encapsulates all the state and handlers needed for the
 * patient identification dialog, following the Single Responsibility Principle.
 */
interface UsePatientIdentificationProps {
  onIdentify: (patientInfo: { name: string; dob: string }) => void;
  onCancel: () => void;
}

export const usePatientIdentification = ({ onIdentify, onCancel }: UsePatientIdentificationProps) => {
  // Dialog state
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState("");
  
  // Suggestions state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [patientSuggestions, setPatientSuggestions] = useState<PatientSuggestion[]>([]);

  // Handler for toggling recording state
  const toggleRecording = useCallback(() => {
    // In a real implementation, this would interact with the Web Speech API
    // For now, we'll just toggle the state
    setIsListening(prev => !prev);
    
    if (isListening) {
      // If we were listening and now stopping, parse the transcript
      if (transcript.trim()) {
        parsePatientInfo(transcript);
      }
    } else {
      // Starting to listen
      setError("");
    }
  }, [isListening, transcript]);

  // Handler for parsing patient information from transcript
  const parsePatientInfo = useCallback((text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      setError("No text provided to parse.");
      return;
    }

    setIsParsing(true);
    setError("");
    setShowSuggestions(false);

    // Simulate parsing delay
    setTimeout(() => {
      // Simple parsing logic - in a real app, this would be more sophisticated
      const suggestions: PatientSuggestion[] = [];
      
      // Add a suggestion based on the input
      suggestions.push({
        name: trimmedText.split(',')[0] || trimmedText,
        dob: DEFAULT_DOB_PRIMARY,
        confidence: CONFIDENCE_SCORE_PRIMARY
      });
      
      // Add a fallback suggestion
      suggestions.push({
        name: trimmedText,
        dob: DEFAULT_DOB_SECONDARY,
        confidence: CONFIDENCE_SCORE_SECONDARY
      });

      setPatientSuggestions(suggestions);
      setShowSuggestions(true);
      setIsParsing(false);
    }, PARSING_DELAY_MS);
  }, []);

  // Handler for selecting a suggestion
  const handleSelectSuggestion = useCallback((suggestion: PatientSuggestion) => {
    onIdentify({
      name: suggestion.name,
      dob: suggestion.dob
    });
    setShowSuggestions(false);
  }, [onIdentify]);

  // Handler for manual input confirmation
  const handleManualInputConfirm = useCallback(() => {
    onIdentify({
      name: transcript.trim() || "Manual Entry",
      dob: DEFAULT_DOB_MANUAL
    });
    setShowSuggestions(false);
  }, [transcript, onIdentify]);

  // Handler for transcript input changes
  const handleTranscriptChange = useCallback((value: string) => {
    setTranscript(value);
  }, []);

  // Handler for canceling the dialog
  const handleCancel = useCallback(() => {
    setTranscript("");
    setIsListening(false);
    setShowSuggestions(false);
    setError("");
    onCancel();
  }, [onCancel]);

  // Handler for toggling suggestions visibility
  const toggleSuggestions = useCallback((show: boolean) => {
    setShowSuggestions(show);
  }, []);

  return {
    // State
    transcript,
    isListening,
    isParsing,
    error,
    showSuggestions,
    patientSuggestions,
    
    // Handlers
    toggleRecording,
    parsePatientInfo,
    handleSelectSuggestion,
    handleManualInputConfirm,
    handleTranscriptChange,
    handleCancel,
    setShowSuggestions: toggleSuggestions
  };
};