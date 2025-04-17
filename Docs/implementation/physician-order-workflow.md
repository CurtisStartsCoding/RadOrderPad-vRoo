# Physician Order Workflow Implementation

## Overview

The Physician Order Workflow is a core feature of the RadOrderPad application that allows physicians to create, validate, and sign radiology orders. The implementation follows a modular approach with strict adherence to the Single Responsibility Principle (SRP), ensuring that each component and hook has a single, well-defined responsibility.

## Architecture

The implementation is organized into the following directory structure:

```
src/features/physician-order/
├── components/
│   ├── index.ts
│   ├── PhysicianOrderWorkflow.tsx
│   ├── PatientInfoCard.tsx
│   ├── PatientInfoSection.tsx
│   ├── PatientIdentificationDialog.tsx
│   ├── DictationForm.tsx
│   ├── DictationStep.tsx
│   ├── ValidationFeedbackBanner.tsx
│   ├── ValidationView.tsx
│   ├── ValidationStep.tsx
│   ├── SignatureForm.tsx
│   ├── SignatureStep.tsx
│   ├── OverrideDialog.tsx
│   └── ClinicalContextPanel.tsx
├── hooks/
│   ├── index.ts
│   ├── usePatientIdentification.ts
│   ├── useDictation.ts
│   └── usePhysicianOrderWorkflow.ts
├── types/
│   ├── index.ts
│   ├── patient-types.ts
│   ├── dictation-types.ts
│   └── order-types.ts
├── utils/
│   ├── index.ts
│   └── patient-card-utils.ts
├── constants/
│   └── index.ts
└── index.ts
```

## Key Components

### PhysicianOrderWorkflow

The main orchestrating component that manages the workflow steps and renders the appropriate components based on the current step. It uses the `usePhysicianOrderWorkflow` hook for state management.

### Patient Identification

- **PatientInfoCard**: Displays patient information with an edit button.
- **PatientInfoSection**: Renders patient details (name, DOB, MRN, PIDN).
- **PatientIdentificationDialog**: Dialog for identifying patients through voice or text input.

### Dictation

- **DictationForm**: Provides an interface for dictating orders with speech recognition or text input.
- **DictationStep**: Wrapper component for the dictation step.
- **ValidationFeedbackBanner**: Displays validation feedback with appropriate styling.

### Validation

- **ValidationView**: Displays the validation results and order summary.
- **ValidationStep**: Wrapper component for the validation step.
- **OverrideDialog**: Dialog for confirming override of validation warnings/errors.

### Signature

- **SignatureForm**: Provides a canvas-based signature pad for signing orders.
- **SignatureStep**: Wrapper component for the signature step.

### Clinical Context

- **ClinicalContextPanel**: Slide-out panel that displays clinical context information for the patient.

## Custom Hooks

### usePatientIdentification

Manages the state and logic for the patient identification dialog, including:
- Transcript state
- Recording state
- Parsing logic
- Suggestion generation

### useDictation

Manages speech recognition and dictation functionality, including:
- Web Speech API integration
- Recording state
- Transcript management

### usePhysicianOrderWorkflow

Manages the entire workflow state, including:
- Current step
- Patient information
- Dictation text
- Validation results
- Order data
- Signature data
- Clinical context

## Type Definitions

- **patient-types.ts**: Defines the Patient interface.
- **dictation-types.ts**: Defines types for dictation and validation feedback.
- **order-types.ts**: Defines types for orders, validation results, and clinical context.

## Utility Functions

- **patient-card-utils.ts**: Contains utility functions for patient card logic.

## Constants

- **constants/index.ts**: Centralizes hardcoded values used throughout the feature.

## Workflow Steps

1. **Patient Identification**: The user identifies a patient through voice or text input.
2. **Dictation**: The user dictates the order using speech recognition or text input.
3. **Validation**: The system validates the order and displays the results.
4. **Signature**: The user signs the order using a digital signature.
5. **Completion**: The order is submitted and the user can create a new order.

## Technical Implementation Details

### Speech Recognition

The application uses the Web Speech API for speech recognition, with fallbacks for browsers that don't support it. The implementation includes:
- Continuous recording
- Interim results
- Error handling
- Cleanup on unmount

### Signature Capture

The signature pad uses HTML5 Canvas for capturing signatures, with support for:
- Mouse events
- Touch events
- Clear functionality
- Data URL conversion

### Validation Feedback

The validation feedback system includes:
- Different status types (success, warning, error)
- Detailed feedback messages
- Override functionality
- Clarification options

### Clinical Context

The clinical context panel displays different types of patient information:
- Allergies
- Medications
- Conditions
- Lab results
- Notes

Each type has appropriate styling and icons.

## Future Enhancements

1. **API Integration**: Connect to the backend API for validation and order submission.
2. **File Upload**: Implement file upload for supporting documents.
3. **Order History**: Add the ability to view and edit previous orders.
4. **Advanced Validation**: Implement more sophisticated validation rules.
5. **Offline Support**: Add offline capabilities for dictation and signature capture.