# Physician Order UI Components Documentation

## Overview

This document provides detailed documentation for the UI components implemented for the Physician Order Workflow feature. The UI follows a step-based approach to guide physicians through the order creation process, from patient identification to order signature.

## Architecture

The Physician Order UI is built with a highly modular architecture following these principles:

1. **Extreme Modularity**: Each logical piece and distinct UI element is in its own file
2. **Single Responsibility**: Each component has a single, well-defined responsibility
3. **Strict File Size Limit**: No file exceeds 50-70 lines of code
4. **Hierarchical Organization**: Components are organized in a logical hierarchy

## Directory Structure

```
client/src/features/physician-order/
├── components/             # UI components
│   ├── index.ts            # Barrel file exporting all components
│   ├── PatientInfoCard.tsx # Patient information display
│   ├── PatientInfoSection.tsx # Container for patient info
│   ├── PatientIdentificationDialog.tsx # Patient search dialog
│   ├── DictationForm.tsx   # Form for dictation input
│   ├── DictationStep.tsx   # Wrapper for dictation step
│   ├── ValidationFeedbackBanner.tsx # Feedback for validation
│   ├── ValidationView.tsx  # Display validation results
│   ├── ValidationStep.tsx  # Wrapper for validation step
│   ├── OverrideDialog.tsx  # Dialog for validation overrides
│   ├── SignatureForm.tsx   # Form for capturing signature
│   ├── SignatureStep.tsx   # Wrapper for signature step
│   ├── ClinicalContextPanel.tsx # Slide-out panel for clinical context
│   └── PhysicianOrderWorkflow.tsx # Main workflow component
├── hooks/                  # Custom hooks
│   ├── index.ts            # Barrel file exporting all hooks
│   ├── usePatientIdentification.ts # Hook for patient identification
│   ├── useDictation.ts     # Hook for dictation functionality
│   └── usePhysicianOrderWorkflow.ts # Main workflow state hook
├── types/                  # TypeScript type definitions
│   ├── index.ts            # Barrel file exporting all types
│   ├── patient-types.ts    # Patient-related types
│   ├── dictation-types.ts  # Dictation-related types
│   └── order-types.ts      # Order-related types
├── utils/                  # Utility functions
│   ├── index.ts            # Barrel file exporting all utilities
│   └── patient-card-utils.ts # Utilities for patient card
├── constants/              # Constants and configuration
│   └── index.ts            # Constants for the feature
└── index.ts                # Main barrel file for the feature
```

## Component Hierarchy

```
PhysicianOrderWorkflow
├── OrderProgressIndicator (from common)
├── PatientInfoSection
│   └── PatientInfoCard
├── PatientIdentificationDialog
├── DictationStep
│   ├── DictationForm
│   └── ValidationFeedbackBanner
├── ValidationStep
│   ├── ValidationView
│   └── OverrideDialog (modal)
├── SignatureStep
│   └── SignatureForm
└── ClinicalContextPanel (slide-out)
```

## Detailed Component Documentation

### PhysicianOrderWorkflow

**File**: `components/PhysicianOrderWorkflow.tsx`

**Purpose**: Main component that orchestrates the entire workflow for creating a physician order.

**Props**:
- `onComplete`: Callback function called when the workflow is completed
- `onCancel`: Callback function called when the workflow is cancelled

**Implementation Details**:
- Uses the `usePhysicianOrderWorkflow` hook to manage workflow state
- Renders different step components based on the current step
- Handles navigation between steps
- Provides context for child components

**Example Usage**:
```tsx
<PhysicianOrderWorkflow 
  onComplete={(order) => console.log('Order completed:', order)} 
  onCancel={() => console.log('Workflow cancelled')} 
/>
```

### PatientInfoSection

**File**: `components/PatientInfoSection.tsx`

**Purpose**: Container component for displaying patient information and providing actions related to patient identification.

**Props**:
- `patient`: Patient object containing patient information
- `onIdentifyPatient`: Callback function to open patient identification dialog

**Implementation Details**:
- Renders the `PatientInfoCard` component
- Provides a button to trigger patient identification
- Shows placeholder when no patient is selected

**Example Usage**:
```tsx
<PatientInfoSection 
  patient={selectedPatient} 
  onIdentifyPatient={() => setIdentificationDialogOpen(true)} 
/>
```

### PatientInfoCard

**File**: `components/PatientInfoCard.tsx`

**Purpose**: Displays patient information in a card format.

**Props**:
- `patient`: Patient object containing patient information
- `className`: Optional CSS class for styling

**Implementation Details**:
- Displays patient name, DOB, MRN, and other key information
- Uses utility functions from `patient-card-utils.ts` for formatting
- Implements responsive design for different screen sizes

**Example Usage**:
```tsx
<PatientInfoCard patient={selectedPatient} className="mb-4" />
```

### PatientIdentificationDialog

**File**: `components/PatientIdentificationDialog.tsx`

**Purpose**: Dialog for identifying patients through voice or text input.

**Props**:
- `open`: Boolean to control dialog visibility
- `onClose`: Callback function when dialog is closed
- `onSelectPatient`: Callback function when a patient is selected

**Implementation Details**:
- Uses the `usePatientIdentification` hook for state management
- Provides search input with voice recognition option
- Displays search results in a scrollable list
- Allows selection of a patient from search results

**Example Usage**:
```tsx
<PatientIdentificationDialog 
  open={identificationDialogOpen} 
  onClose={() => setIdentificationDialogOpen(false)} 
  onSelectPatient={(patient) => {
    setSelectedPatient(patient);
    setIdentificationDialogOpen(false);
  }} 
/>
```

### DictationStep

**File**: `components/DictationStep.tsx`

**Purpose**: Wrapper component for the dictation step of the workflow.

**Props**:
- `onNext`: Callback function to proceed to the next step
- `onBack`: Callback function to go back to the previous step
- `dictationText`: Current dictation text
- `onDictationChange`: Callback function when dictation text changes
- `validationFeedback`: Validation feedback object

**Implementation Details**:
- Renders the `DictationForm` component
- Renders the `ValidationFeedbackBanner` component when validation feedback is available
- Provides navigation buttons for workflow

**Example Usage**:
```tsx
<DictationStep 
  onNext={handleNextStep} 
  onBack={handlePreviousStep} 
  dictationText={dictationText} 
  onDictationChange={setDictationText} 
  validationFeedback={validationFeedback} 
/>
```

### DictationForm

**File**: `components/DictationForm.tsx`

**Purpose**: Form component for dictating orders with speech recognition or text input.

**Props**:
- `value`: Current dictation text
- `onChange`: Callback function when dictation text changes
- `onSubmit`: Callback function when form is submitted
- `isListening`: Boolean indicating if speech recognition is active
- `onToggleListen`: Callback function to toggle speech recognition

**Implementation Details**:
- Uses the `useDictation` hook for speech recognition functionality
- Provides a textarea for manual text input
- Includes a microphone button to toggle speech recognition
- Shows visual feedback when speech recognition is active

**Example Usage**:
```tsx
<DictationForm 
  value={dictationText} 
  onChange={setDictationText} 
  onSubmit={handleSubmitDictation} 
  isListening={isListening} 
  onToggleListen={toggleListening} 
/>
```

### ValidationFeedbackBanner

**File**: `components/ValidationFeedbackBanner.tsx`

**Purpose**: Displays validation feedback for the dictation.

**Props**:
- `feedback`: Validation feedback object containing errors, warnings, and suggestions
- `onDismiss`: Callback function when feedback is dismissed

**Implementation Details**:
- Displays different types of feedback (errors, warnings, suggestions) with appropriate styling
- Provides actionable suggestions when available
- Includes a dismiss button

**Example Usage**:
```tsx
<ValidationFeedbackBanner 
  feedback={validationFeedback} 
  onDismiss={() => setValidationFeedback(null)} 
/>
```

### ValidationStep

**File**: `components/ValidationStep.tsx`

**Purpose**: Wrapper component for the validation step of the workflow.

**Props**:
- `onNext`: Callback function to proceed to the next step
- `onBack`: Callback function to go back to the previous step
- `validationResults`: Results of the order validation
- `onOverride`: Callback function to override validation issues

**Implementation Details**:
- Renders the `ValidationView` component
- Handles the display of the `OverrideDialog` when needed
- Provides navigation buttons for workflow

**Example Usage**:
```tsx
<ValidationStep 
  onNext={handleNextStep} 
  onBack={handlePreviousStep} 
  validationResults={validationResults} 
  onOverride={handleOverrideValidation} 
/>
```

### ValidationView

**File**: `components/ValidationView.tsx`

**Purpose**: Displays validation results and order summary.

**Props**:
- `validationResults`: Results of the order validation
- `onRequestOverride`: Callback function to request override of validation issues

**Implementation Details**:
- Displays a summary of the order details
- Shows validation issues categorized by severity (errors, warnings)
- Provides an override button for issues that can be overridden
- Uses color coding to indicate severity

**Example Usage**:
```tsx
<ValidationView 
  validationResults={validationResults} 
  onRequestOverride={() => setOverrideDialogOpen(true)} 
/>
```

### OverrideDialog

**File**: `components/OverrideDialog.tsx`

**Purpose**: Dialog for confirming override of validation warnings/errors.

**Props**:
- `open`: Boolean to control dialog visibility
- `onClose`: Callback function when dialog is closed
- `onConfirm`: Callback function when override is confirmed
- `issues`: Array of validation issues to be overridden

**Implementation Details**:
- Displays a list of issues that will be overridden
- Requires a reason for the override
- Includes confirm and cancel buttons
- Implements form validation

**Example Usage**:
```tsx
<OverrideDialog 
  open={overrideDialogOpen} 
  onClose={() => setOverrideDialogOpen(false)} 
  onConfirm={handleConfirmOverride} 
  issues={validationResults.warnings} 
/>
```

### SignatureStep

**File**: `components/SignatureStep.tsx`

**Purpose**: Wrapper component for the signature step of the workflow.

**Props**:
- `onNext`: Callback function to proceed to the next step
- `onBack`: Callback function to go back to the previous step
- `signature`: Current signature data
- `onSignatureChange`: Callback function when signature changes

**Implementation Details**:
- Renders the `SignatureForm` component
- Provides navigation buttons for workflow
- Validates signature before allowing to proceed

**Example Usage**:
```tsx
<SignatureStep 
  onNext={handleNextStep} 
  onBack={handlePreviousStep} 
  signature={signatureData} 
  onSignatureChange={setSignatureData} 
/>
```

### SignatureForm

**File**: `components/SignatureForm.tsx`

**Purpose**: Form component with canvas-based signature capture.

**Props**:
- `value`: Current signature data
- `onChange`: Callback function when signature changes
- `className`: Optional CSS class for styling

**Implementation Details**:
- Uses HTML Canvas for signature capture
- Supports both mouse and touch events
- Provides a clear button to reset signature
- Implements responsive canvas sizing

**Example Usage**:
```tsx
<SignatureForm 
  value={signatureData} 
  onChange={setSignatureData} 
  className="mb-4" 
/>
```

### ClinicalContextPanel

**File**: `components/ClinicalContextPanel.tsx`

**Purpose**: Slide-out panel for displaying clinical context information.

**Props**:
- `open`: Boolean to control panel visibility
- `onClose`: Callback function when panel is closed
- `patientId`: ID of the patient to show clinical context for

**Implementation Details**:
- Implements a slide-out panel with animation
- Fetches clinical context data based on patient ID
- Organizes information into tabs (allergies, medications, conditions, labs, notes)
- Provides a close button

**Example Usage**:
```tsx
<ClinicalContextPanel 
  open={contextPanelOpen} 
  onClose={() => setContextPanelOpen(false)} 
  patientId={selectedPatient?.id} 
/>
```

## Custom Hooks

### usePhysicianOrderWorkflow

**File**: `hooks/usePhysicianOrderWorkflow.ts`

**Purpose**: Main hook for managing the entire workflow state.

**Parameters**:
- `options`: Optional configuration options

**Returns**:
- `currentStep`: Current step in the workflow
- `patient`: Selected patient
- `dictationText`: Current dictation text
- `validationResults`: Results of order validation
- `signature`: Signature data
- `setPatient`: Function to set the patient
- `setDictationText`: Function to update dictation text
- `setSignature`: Function to update signature
- `goToNextStep`: Function to advance to the next step
- `goToPreviousStep`: Function to go back to the previous step
- `submitOrder`: Function to submit the completed order

**Implementation Details**:
- Manages workflow state using React's useState
- Implements step navigation logic
- Handles API calls for validation and order submission
- Provides state and actions for all workflow steps

**Example Usage**:
```tsx
const {
  currentStep,
  patient,
  dictationText,
  validationResults,
  signature,
  setPatient,
  setDictationText,
  setSignature,
  goToNextStep,
  goToPreviousStep,
  submitOrder
} = usePhysicianOrderWorkflow();
```

### usePatientIdentification

**File**: `hooks/usePatientIdentification.ts`

**Purpose**: Hook for managing patient identification dialog state and logic.

**Parameters**:
- None

**Returns**:
- `searchTerm`: Current search term
- `setSearchTerm`: Function to update search term
- `searchResults`: Array of patient search results
- `isSearching`: Boolean indicating if search is in progress
- `searchError`: Error object if search fails
- `performSearch`: Function to execute patient search

**Implementation Details**:
- Manages search state using React's useState
- Implements debounced search to prevent excessive API calls
- Handles API calls for patient search
- Provides error handling for failed searches

**Example Usage**:
```tsx
const {
  searchTerm,
  setSearchTerm,
  searchResults,
  isSearching,
  searchError,
  performSearch
} = usePatientIdentification();
```

### useDictation

**File**: `hooks/useDictation.ts`

**Purpose**: Hook for managing speech recognition and dictation state.

**Parameters**:
- `options`: Optional configuration options

**Returns**:
- `dictationText`: Current dictation text
- `setDictationText`: Function to update dictation text
- `isListening`: Boolean indicating if speech recognition is active
- `toggleListening`: Function to toggle speech recognition
- `startListening`: Function to start speech recognition
- `stopListening`: Function to stop speech recognition
- `resetDictation`: Function to clear dictation text

**Implementation Details**:
- Uses the Web Speech API for speech recognition
- Manages dictation state using React's useState
- Implements browser compatibility checks
- Provides error handling for speech recognition issues

**Example Usage**:
```tsx
const {
  dictationText,
  setDictationText,
  isListening,
  toggleListening,
  startListening,
  stopListening,
  resetDictation
} = useDictation();
```

## Type Definitions

### Patient Types

**File**: `types/patient-types.ts`

**Key Types**:
- `Patient`: Interface for patient data
- `PatientSearchResult`: Interface for patient search results
- `PatientIdentificationOptions`: Interface for patient identification options

### Dictation Types

**File**: `types/dictation-types.ts`

**Key Types**:
- `DictationOptions`: Interface for dictation configuration
- `ValidationFeedback`: Interface for validation feedback
- `ValidationIssue`: Interface for individual validation issues

### Order Types

**File**: `types/order-types.ts`

**Key Types**:
- `Order`: Interface for order data
- `OrderStatus`: Enum for order status values
- `ValidationResults`: Interface for order validation results
- `WorkflowStep`: Enum for workflow steps

## Utility Functions

### Patient Card Utilities

**File**: `utils/patient-card-utils.ts`

**Key Functions**:
- `formatPatientName`: Formats patient name for display
- `formatPatientDOB`: Formats patient date of birth
- `formatPatientMRN`: Formats patient medical record number
- `getPatientAgeString`: Calculates and formats patient age

## Integration with App

The Physician Order Workflow is integrated into the application via the `/order/new` route:

**File**: `client/apps/web/app/order/new/page.tsx`

**Implementation Details**:
- Renders the `PhysicianOrderWorkflow` component
- Handles completion and cancellation of the workflow
- Implements navigation back to the dashboard

## Styling

All components use Tailwind CSS for styling, following the project's style guide. Key styling features include:

- Consistent color scheme based on the style guide
- Responsive design for all screen sizes
- Accessible UI elements with proper contrast
- Consistent spacing and typography
- Animation for transitions between steps

## Accessibility

The UI components implement several accessibility features:

- Proper ARIA attributes for interactive elements
- Keyboard navigation support
- Focus management for dialogs and forms
- Screen reader friendly text alternatives
- Sufficient color contrast for text elements

## Future Enhancements

Potential future enhancements for the Physician Order UI include:

1. Implementing real-time collaboration features
2. Adding support for templates and favorites
3. Enhancing the clinical context panel with more detailed information
4. Implementing advanced voice commands for navigation
5. Adding support for offline mode with synchronization