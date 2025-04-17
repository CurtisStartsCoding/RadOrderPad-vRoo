import { useState, useCallback, useEffect } from 'react';
import { 
  Patient, 
  ValidationStatus, 
  ValidationResult, 
  OrderData, 
  OrderStatus,
  ClinicalContextItem
} from '../types';

/**
 * Custom hook for managing the physician order workflow state and logic
 * 
 * This hook encapsulates all the state and handlers needed for the
 * entire physician order workflow, following the Single Responsibility Principle.
 */
export const usePhysicianOrderWorkflow = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  
  // Patient state
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [isPatientIdentificationOpen, setIsPatientIdentificationOpen] = useState(false);
  
  // Dictation state
  const [dictationText, setDictationText] = useState("");
  const [isProcessingValidation, setIsProcessingValidation] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  
  // Order state
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  
  // Override state
  const [isOverrideDialogOpen, setIsOverrideDialogOpen] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  
  // Signature state
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  
  // Clinical context state
  const [isClinicalContextOpen, setIsClinicalContextOpen] = useState(false);
  const [clinicalContextItems, setClinicalContextItems] = useState<ClinicalContextItem[]>([]);
  
  // Handler for editing patient information
  const handleEditPatient = useCallback(() => {
    setIsPatientIdentificationOpen(true);
  }, []);
  
  // Handler for canceling patient identification
  const handleCancelIdentification = useCallback(() => {
    setIsPatientIdentificationOpen(false);
  }, []);
  
  // Handler for identifying a patient
  const handlePatientIdentified = useCallback((patientInfo: { name: string; dob: string }) => {
    const newPatient: Patient = {
      id: 0, // Temporary ID
      name: patientInfo.name,
      dob: patientInfo.dob,
      mrn: "N/A",
      pidn: "N/A"
    };
    
    setActivePatient(newPatient);
    setIsPatientIdentificationOpen(false);
    
    // If we already have order data, update the patient information
    if (orderData) {
      setOrderData({
        ...orderData,
        patient: newPatient
      });
    }
  }, [orderData]);
  
  // Handler for clearing validation feedback
  const handleClearFeedback = useCallback(() => {
    setValidationResult(null);
  }, []);
  
  // Handler for processing dictation
  const handleProcessDictationRequest = useCallback(() => {
    // In a real implementation, this would call an API to process the dictation
    // For now, we'll just simulate a validation response
    setIsProcessingValidation(true);
    setValidationResult(null);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsProcessingValidation(false);
      setAttemptCount(prev => prev + 1);
      
      // Simulate different validation responses based on attempt count
      if (attemptCount === 0) {
        const result: ValidationResult = {
          status: ValidationStatus.WARNING,
          message: "Potential issues detected",
          details: "The system detected potential issues with your dictation that may affect order accuracy.",
          issues: [
            { type: "ambiguity", message: "Ambiguous modality specified. Did you mean CT or MRI?" },
            { type: "missing", message: "No contrast preference specified." }
          ]
        };
        setValidationResult(result);
      } else {
        // Create a mock order data with a guaranteed ID
        const generatedId = `ORD-${Math.floor(Math.random() * 10000)}`;
        const mockOrderData: OrderData = {
          id: generatedId, // Ensure ID is not undefined
          patient: activePatient || {
            id: 0,
            name: "Unknown Patient",
            dob: "Unknown",
            mrn: "N/A",
            pidn: "N/A"
          },
          modality: "MRI",
          bodyPart: "Brain",
          contrast: true,
          contrastType: "Gadolinium",
          instructions: "None",
          clinicalIndications: ["Headache", "Dizziness"],
          icd10Codes: [
            { code: "R51", description: "Headache" },
            { code: "R42", description: "Dizziness and giddiness" }
          ],
          cptCodes: [
            { code: "70551", description: "MRI Brain without contrast" }
          ],
          status: OrderStatus.VALIDATED
        };
        
        const result: ValidationResult = {
          status: ValidationStatus.SUCCESS,
          message: "Order validated successfully",
          details: "Your order has been processed and is ready for review.",
          orderData: mockOrderData
        };
        
        setValidationResult(result);
        setOrderData(mockOrderData);
        setOrderId(generatedId); // Use the guaranteed ID
        
        // Move to the next step after a successful validation
        setTimeout(() => {
          setCurrentStep(2);
        }, 1500);
      }
    }, 1500);
  }, [activePatient, attemptCount]);
  
  // Handler for overriding validation warnings/errors
  const handleOverrideRequest = useCallback(() => {
    setIsOverrideDialogOpen(true);
  }, []);
  
  // Handler for confirming override
  const handleOverrideConfirm = useCallback(() => {
    // In a real implementation, this would call an API to override the validation
    setIsOverrideDialogOpen(false);
    
    // Create a mock order data with a guaranteed ID
    const generatedId = `ORD-${Math.floor(Math.random() * 10000)}`;
    const mockOrderData: OrderData = {
      id: generatedId, // Ensure ID is not undefined
      patient: activePatient || {
        id: 0,
        name: "Unknown Patient",
        dob: "Unknown",
        mrn: "N/A",
        pidn: "N/A"
      },
      modality: "MRI",
      bodyPart: "Brain",
      contrast: true,
      contrastType: "Gadolinium",
      instructions: "None",
      clinicalIndications: ["Headache", "Dizziness"],
      icd10Codes: [
        { code: "R51", description: "Headache" },
        { code: "R42", description: "Dizziness and giddiness" }
      ],
      cptCodes: [
        { code: "70551", description: "MRI Brain without contrast" }
      ],
      status: OrderStatus.VALIDATED
    };
    
    setOrderData(mockOrderData);
    setOrderId(generatedId); // Use the guaranteed ID
    
    // Move to the next step
    setCurrentStep(2);
  }, [activePatient]);
  
  // Handler for canceling override
  const handleOverrideCancel = useCallback(() => {
    setIsOverrideDialogOpen(false);
    setOverrideReason("");
  }, []);
  
  // Handler for going back to dictation
  const handleBackToDictation = useCallback(() => {
    setCurrentStep(1);
  }, []);
  
  // Handler for signing the order
  const handleSignOrder = useCallback((signatureImageData: string) => {
    setSignatureData(signatureImageData);
    setIsSubmittingOrder(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSubmittingOrder(false);
      
      // Update order status
      if (orderData) {
        const updatedOrderData: OrderData = {
          ...orderData,
          status: OrderStatus.SIGNED,
          signature: {
            signedAt: new Date().toISOString(),
            signatureData: signatureImageData
          }
        };
        
        setOrderData(updatedOrderData);
      }
      
      // Move to the next step
      setCurrentStep(4);
    }, 1500);
  }, [orderData]);
  
  // Handler for order submission completion
  const handleOrderSubmitted = useCallback(() => {
    // Reset the workflow state for a new order
    setDictationText("");
    setValidationResult(null);
    setAttemptCount(0);
    setOrderData(null);
    setOrderId(null);
    setSignatureData(null);
    setCurrentStep(1);
  }, []);
  
  // Handler for toggling clinical context panel
  const toggleClinicalContext = useCallback(() => {
    setIsClinicalContextOpen(prev => !prev);
    
    // If opening the panel and we don't have any items yet, fetch them
    if (!isClinicalContextOpen && clinicalContextItems.length === 0) {
      // In a real implementation, this would call an API to fetch clinical context
      // For now, we'll just simulate some mock data
      const mockItems: ClinicalContextItem[] = [
        {
          type: 'allergy',
          title: 'Contrast Media',
          description: 'Patient has a history of allergic reaction to iodinated contrast.',
          severity: 'high',
          date: '2023-05-15'
        },
        {
          type: 'condition',
          title: 'Chronic Kidney Disease',
          description: 'Stage 2 CKD, eGFR 65 ml/min/1.73m²',
          severity: 'medium',
          date: '2023-01-10'
        },
        {
          type: 'lab',
          title: 'Creatinine',
          description: '1.2 mg/dL (Reference range: 0.6-1.3 mg/dL)',
          date: '2023-06-01'
        }
      ];
      
      setClinicalContextItems(mockItems);
    }
  }, [isClinicalContextOpen, clinicalContextItems.length]);
  
  return {
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
    signatureData,
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
  };
};