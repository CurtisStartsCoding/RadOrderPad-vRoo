/**
 * Types related to dictation and validation functionality
 */

/**
 * Validation status enum
 */
export enum ValidationStatus {
  NONE = "none",
  PROCESSING = "processing",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error"
}

/**
 * Validation feedback interface
 */
export interface ValidationFeedback {
  /** Status of the validation */
  status: ValidationStatus;
  
  /** Main message to display */
  message: string;
  
  /** Optional detailed feedback */
  details?: string;
  
  /** Optional list of specific issues */
  issues?: Array<{
    type: string;
    message: string;
  }>;
}

/**
 * Dictation form props interface
 */
export interface DictationFormProps {
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

/**
 * Validation feedback banner props interface
 */
export interface ValidationFeedbackBannerProps {
  /** Validation feedback to display */
  feedback: ValidationFeedback;
  
  /** Number of attempts made to process the dictation */
  attemptCount: number;
  
  /** Function to handle override request */
  onOverride?: () => void;
  
  /** Function to handle adding clarification */
  onAddClarification?: () => void;
}

/**
 * Dictation hook return interface
 */
export interface UseDictationReturn {
  /** Whether recording is active */
  isRecording: boolean;
  
  /** Function to toggle recording state */
  toggleRecording: () => void;
  
  /** Function to clear dictation */
  clearDictation: () => void;
  
  /** Whether speech recognition is supported */
  isSupported: boolean;
}