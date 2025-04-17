# Admin Finalization UI Components Documentation

## Overview

This document provides detailed documentation for the UI components implemented for the Admin Finalization feature. The Admin Finalization UI allows administrative staff to review, edit, and finalize orders before they are sent to radiology.

## Architecture

The Admin Finalization UI is built with a highly modular architecture following these principles:

1. **Extreme Modularity**: Each logical piece and distinct UI element is in its own file
2. **Single Responsibility**: Each component has a single, well-defined responsibility
3. **Strict File Size Limit**: No file exceeds 50-70 lines of code
4. **Hierarchical Organization**: Components are organized in a logical hierarchy

## Directory Structure

```
client/src/features/admin-finalization/
├── components/             # UI components
│   ├── index.ts            # Barrel file exporting all components
│   ├── AdminOrderTable.tsx # Table for displaying orders
│   ├── OrderSummaryDisplay.tsx # Display order summary
│   ├── PatientInfoEditor.tsx # Editor for patient information
│   ├── InsuranceInfoEditor.tsx # Editor for insurance information
│   ├── EmrPasteSection.tsx # Section for EMR data pasting
│   ├── SupplementalDocsSection.tsx # Section for supplemental documents
│   └── AdminActions.tsx    # Action buttons for admin tasks
├── hooks/                  # Custom hooks
│   ├── index.ts            # Barrel file exporting all hooks
│   ├── useAdminQueue.ts    # Hook for admin queue management
│   ├── useOrderDetail.ts   # Hook for order detail fetching
│   ├── useAdminOrderDetail.ts # Compatibility layer combining hooks
│   ├── useEmrProcessing.ts # Hook for EMR data processing
│   ├── useSupplementalDocs.ts # Hook for supplemental documents
│   ├── usePatientInfoEditor.ts # Hook for patient info editing
│   ├── useInsuranceInfoEditor.ts # Hook for insurance info editing
│   └── useOrderFinalization.ts # Hook for order finalization
├── types/                  # TypeScript type definitions
│   ├── index.ts            # Barrel file exporting all types
│   └── admin-order-types.ts # Admin-specific order types
├── utils/                  # Utility functions
│   ├── index.ts            # Barrel file exporting all utilities
│   └── date-utils.ts       # Date formatting utilities
└── index.ts                # Main barrel file for the feature
```

## Component Hierarchy

```
Admin Queue Page
└── AdminOrderTable

Admin Order Detail Page
├── OrderSummaryDisplay
├── PatientInfoEditor
├── InsuranceInfoEditor
├── EmrPasteSection
├── SupplementalDocsSection
└── AdminActions
```

## Detailed Component Documentation

### AdminOrderTable

**File**: `components/AdminOrderTable.tsx`

**Purpose**: Displays a table of orders in the admin queue that need to be processed.

**Props**:
- `orders`: Array of order objects to display
- `onSelectOrder`: Callback function when an order is selected
- `isLoading`: Boolean indicating if orders are loading
- `onRefresh`: Callback function to refresh the order list

**Implementation Details**:
- Uses the Shadcn UI Table component
- Implements sorting and filtering capabilities
- Displays key order information (patient, status, date, etc.)
- Provides row-level actions
- Implements responsive design for different screen sizes

**Example Usage**:
```tsx
<AdminOrderTable 
  orders={queueData} 
  onSelectOrder={(orderId) => router.push(`/admin/order/${orderId}`)} 
  isLoading={isLoading} 
  onRefresh={refetchQueue} 
/>
```

### OrderSummaryDisplay

**File**: `components/OrderSummaryDisplay.tsx`

**Purpose**: Displays a summary of the order details.

**Props**:
- `order`: Order object containing order details
- `className`: Optional CSS class for styling

**Implementation Details**:
- Displays order ID, status, creation date, and physician
- Shows the original dictation text
- Displays modality and body part information
- Uses card layout for organized presentation
- Implements responsive design

**Example Usage**:
```tsx
<OrderSummaryDisplay order={orderData} className="mb-6" />
```

### PatientInfoEditor

**File**: `components/PatientInfoEditor.tsx`

**Purpose**: Component for viewing and editing patient information.

**Props**:
- `patientInfo`: Patient information object
- `onUpdate`: Callback function when patient info is updated
- `isEditing`: Boolean indicating if editor is in edit mode
- `onToggleEdit`: Callback function to toggle edit mode
- `isUpdating`: Boolean indicating if an update is in progress

**Implementation Details**:
- Displays patient information in view mode
- Provides form fields for editing in edit mode
- Implements form validation
- Provides save and cancel buttons in edit mode
- Uses the `usePatientInfoEditor` hook for state management

**Example Usage**:
```tsx
<PatientInfoEditor 
  patientInfo={orderData?.patient} 
  onUpdate={updatePatientInfo} 
  isEditing={isEditingPatient} 
  onToggleEdit={() => setIsEditingPatient(!isEditingPatient)} 
  isUpdating={isUpdatingPatient} 
/>
```

### InsuranceInfoEditor

**File**: `components/InsuranceInfoEditor.tsx`

**Purpose**: Component for viewing and editing insurance information.

**Props**:
- `insuranceInfo`: Insurance information object
- `onUpdate`: Callback function when insurance info is updated
- `isEditing`: Boolean indicating if editor is in edit mode
- `onToggleEdit`: Callback function to toggle edit mode
- `isUpdating`: Boolean indicating if an update is in progress

**Implementation Details**:
- Displays insurance information in view mode
- Provides form fields for editing in edit mode
- Implements form validation
- Provides save and cancel buttons in edit mode
- Uses the `useInsuranceInfoEditor` hook for state management

**Example Usage**:
```tsx
<InsuranceInfoEditor 
  insuranceInfo={orderData?.insurance} 
  onUpdate={updateInsuranceInfo} 
  isEditing={isEditingInsurance} 
  onToggleEdit={() => setIsEditingInsurance(!isEditingInsurance)} 
  isUpdating={isUpdatingInsurance} 
/>
```

### EmrPasteSection

**File**: `components/EmrPasteSection.tsx`

**Purpose**: Section for pasting and processing EMR data.

**Props**:
- `orderId`: ID of the current order
- `emrPasteText`: Current EMR paste text
- `setEmrPasteText`: Function to update EMR paste text
- `processEmrPaste`: Function to process EMR paste
- `isProcessingEmr`: Boolean indicating if processing is in progress

**Implementation Details**:
- Provides a textarea for pasting EMR data
- Includes a process button to extract information
- Shows loading state during processing
- Uses the `useEmrProcessing` hook for functionality
- Implements error handling for processing failures

**Example Usage**:
```tsx
<EmrPasteSection 
  orderId={orderId} 
  emrPasteText={emrPasteText} 
  setEmrPasteText={setEmrPasteText} 
  processEmrPaste={processEmrPaste} 
  isProcessingEmr={isProcessingEmr} 
/>
```

### SupplementalDocsSection

**File**: `components/SupplementalDocsSection.tsx`

**Purpose**: Section for managing supplemental documents related to the order.

**Props**:
- `orderId`: ID of the current order
- `supplementalPasteText`: Current supplemental text
- `setSupplementalPasteText`: Function to update supplemental text
- `processSupplementalDoc`: Function to process supplemental document
- `isProcessingSupplemental`: Boolean indicating if processing is in progress

**Implementation Details**:
- Provides a textarea for pasting supplemental document text
- Includes a process button to extract information
- Shows loading state during processing
- Uses the `useSupplementalDocs` hook for functionality
- Implements error handling for processing failures

**Example Usage**:
```tsx
<SupplementalDocsSection 
  orderId={orderId} 
  supplementalPasteText={supplementalPasteText} 
  setSupplementalPasteText={setSupplementalPasteText} 
  processSupplementalDoc={processSupplementalDoc} 
  isProcessingSupplemental={isProcessingSupplemental} 
/>
```

### AdminActions

**File**: `components/AdminActions.tsx`

**Purpose**: Component for displaying admin action buttons.

**Props**:
- `orderId`: ID of the current order
- `canSendToRadiology`: Boolean indicating if order can be sent to radiology
- `sendToRadiology`: Function to send order to radiology
- `isSendingToRadiology`: Boolean indicating if sending is in progress
- `onCancel`: Callback function when cancel is clicked

**Implementation Details**:
- Displays action buttons (Send to Radiology, Cancel)
- Implements disabled state for buttons based on conditions
- Shows loading state during actions
- Uses the `useOrderFinalization` hook for functionality
- Implements confirmation dialogs for destructive actions

**Example Usage**:
```tsx
<AdminActions 
  orderId={orderId} 
  canSendToRadiology={canSendToRadiology} 
  sendToRadiology={sendToRadiology} 
  isSendingToRadiology={isSendingToRadiology} 
  onCancel={() => router.push('/admin/queue')} 
/>
```

## Custom Hooks

### useAdminQueue

**File**: `hooks/useAdminQueue.ts`

**Purpose**: Hook for managing the admin queue data and operations.

**Parameters**:
- `options`: Optional configuration options

**Returns**:
- `queueData`: Array of orders in the queue
- `isLoading`: Boolean indicating if queue is loading
- `error`: Error object if fetching fails
- `refetchQueue`: Function to refresh queue data
- `filterOptions`: Current filter options
- `setFilterOptions`: Function to update filter options
- `sortOptions`: Current sort options
- `setSortOptions`: Function to update sort options

**Implementation Details**:
- Uses TanStack Query for data fetching and caching
- Implements filtering and sorting functionality
- Provides error handling for failed fetches
- Manages pagination state

**Example Usage**:
```tsx
const {
  queueData,
  isLoading,
  error,
  refetchQueue,
  filterOptions,
  setFilterOptions,
  sortOptions,
  setSortOptions
} = useAdminQueue();
```

### useOrderDetail

**File**: `hooks/useOrderDetail.ts`

**Purpose**: Hook for fetching and managing order details.

**Parameters**:
- `orderId`: ID of the order to fetch

**Returns**:
- `orderData`: Order data object
- `isLoadingOrder`: Boolean indicating if order is loading
- `isOrderError`: Boolean indicating if fetch failed
- `orderError`: Error object if fetch fails
- `refetchOrder`: Function to refresh order data

**Implementation Details**:
- Uses TanStack Query for data fetching and caching
- Implements error handling for failed fetches
- Provides refetch functionality
- Manages loading state

**Example Usage**:
```tsx
const {
  orderData,
  isLoadingOrder,
  isOrderError,
  orderError,
  refetchOrder
} = useOrderDetail(orderId);
```

### useEmrProcessing

**File**: `hooks/useEmrProcessing.ts`

**Purpose**: Hook for managing EMR data processing.

**Parameters**:
- `orderId`: ID of the current order

**Returns**:
- `emrPasteText`: Current EMR paste text
- `setEmrPasteText`: Function to update EMR paste text
- `processEmrPaste`: Function to process EMR paste
- `isProcessingEmr`: Boolean indicating if processing is in progress

**Implementation Details**:
- Manages EMR paste text state
- Implements API call for processing EMR data
- Uses TanStack Mutation for API interaction
- Provides error handling for processing failures
- Invalidates related queries on successful processing

**Example Usage**:
```tsx
const {
  emrPasteText,
  setEmrPasteText,
  processEmrPaste,
  isProcessingEmr
} = useEmrProcessing(orderId);
```

### useSupplementalDocs

**File**: `hooks/useSupplementalDocs.ts`

**Purpose**: Hook for managing supplemental document processing.

**Parameters**:
- `orderId`: ID of the current order

**Returns**:
- `supplementalPasteText`: Current supplemental text
- `setSupplementalPasteText`: Function to update supplemental text
- `processSupplementalDoc`: Function to process supplemental document
- `isProcessingSupplemental`: Boolean indicating if processing is in progress

**Implementation Details**:
- Manages supplemental text state
- Implements API call for processing supplemental documents
- Uses TanStack Mutation for API interaction
- Provides error handling for processing failures
- Invalidates related queries on successful processing

**Example Usage**:
```tsx
const {
  supplementalPasteText,
  setSupplementalPasteText,
  processSupplementalDoc,
  isProcessingSupplemental
} = useSupplementalDocs(orderId);
```

### usePatientInfoEditor

**File**: `hooks/usePatientInfoEditor.ts`

**Purpose**: Hook for managing patient information editing.

**Parameters**:
- `orderId`: ID of the current order

**Returns**:
- `isEditingPatient`: Boolean indicating if editor is in edit mode
- `setIsEditingPatient`: Function to toggle edit mode
- `updatePatientInfo`: Function to update patient information
- `isUpdatingPatient`: Boolean indicating if an update is in progress

**Implementation Details**:
- Manages editing state
- Implements API call for updating patient information
- Uses TanStack Mutation for API interaction
- Provides error handling for update failures
- Invalidates related queries on successful update

**Example Usage**:
```tsx
const {
  isEditingPatient,
  setIsEditingPatient,
  updatePatientInfo,
  isUpdatingPatient
} = usePatientInfoEditor(orderId);
```

### useInsuranceInfoEditor

**File**: `hooks/useInsuranceInfoEditor.ts`

**Purpose**: Hook for managing insurance information editing.

**Parameters**:
- `orderId`: ID of the current order

**Returns**:
- `isEditingInsurance`: Boolean indicating if editor is in edit mode
- `setIsEditingInsurance`: Function to toggle edit mode
- `updateInsuranceInfo`: Function to update insurance information
- `isUpdatingInsurance`: Boolean indicating if an update is in progress

**Implementation Details**:
- Manages editing state
- Implements API call for updating insurance information
- Uses TanStack Mutation for API interaction
- Provides error handling for update failures
- Invalidates related queries on successful update

**Example Usage**:
```tsx
const {
  isEditingInsurance,
  setIsEditingInsurance,
  updateInsuranceInfo,
  isUpdatingInsurance
} = useInsuranceInfoEditor(orderId);
```

### useOrderFinalization

**File**: `hooks/useOrderFinalization.ts`

**Purpose**: Hook for managing order finalization.

**Parameters**:
- `orderId`: ID of the current order

**Returns**:
- `sendToRadiology`: Function to send order to radiology
- `isSendingToRadiology`: Boolean indicating if sending is in progress
- `canSendToRadiology`: Boolean indicating if order can be sent to radiology

**Implementation Details**:
- Implements API call for sending order to radiology
- Uses TanStack Mutation for API interaction
- Provides error handling for finalization failures
- Implements validation to determine if order can be finalized
- Shows success/error notifications

**Example Usage**:
```tsx
const {
  sendToRadiology,
  isSendingToRadiology,
  canSendToRadiology
} = useOrderFinalization(orderId);
```

### useAdminOrderDetail

**File**: `hooks/useAdminOrderDetail.ts`

**Purpose**: Compatibility hook that combines all the smaller hooks for admin order detail.

**Parameters**:
- `orderId`: ID of the current order

**Returns**:
- Combined return values from all the smaller hooks

**Implementation Details**:
- Uses all the smaller hooks (useOrderDetail, useEmrProcessing, etc.)
- Combines their return values into a single object
- Provides backward compatibility for existing code
- Includes deprecation notice with migration guidance

**Example Usage**:
```tsx
const {
  orderData,
  isLoadingOrder,
  emrPasteText,
  setEmrPasteText,
  processEmrPaste,
  // ... other properties
} = useAdminOrderDetail(orderId);
```

## Type Definitions

### Admin Order Types

**File**: `types/admin-order-types.ts`

**Key Types**:
- `AdminOrder`: Interface for admin-specific order data
- `AdminQueueItem`: Interface for items in the admin queue
- `FilterOptions`: Interface for queue filtering options
- `SortOptions`: Interface for queue sorting options

## Utility Functions

### Date Utilities

**File**: `utils/date-utils.ts`

**Key Functions**:
- `formatOrderDate`: Formats order date for display
- `formatDateOfBirth`: Formats date of birth for display
- `calculateAge`: Calculates age from date of birth
- `isDateValid`: Validates date strings

## Integration with App

The Admin Finalization UI is integrated into the application via two main routes:

### Admin Queue Page

**File**: `client/apps/web/app/admin/queue/page.tsx`

**Implementation Details**:
- Uses the `useAdminQueue` hook for data fetching
- Renders the `AdminOrderTable` component
- Implements page title and description
- Provides refresh functionality

### Admin Order Detail Page

**File**: `client/apps/web/app/admin/order/[orderId]/page.tsx`

**Implementation Details**:
- Uses the `useAdminOrderDetail` hook for data management
- Renders all the admin order detail components
- Implements dynamic routing based on order ID
- Handles loading and error states

## Styling

All components use Tailwind CSS for styling, following the project's style guide. Key styling features include:

- Consistent color scheme based on the style guide
- Responsive design for all screen sizes
- Accessible UI elements with proper contrast
- Consistent spacing and typography
- Card-based layout for organized presentation

## Accessibility

The UI components implement several accessibility features:

- Proper ARIA attributes for interactive elements
- Keyboard navigation support
- Focus management for forms and dialogs
- Screen reader friendly text alternatives
- Sufficient color contrast for text elements

## Future Enhancements

Potential future enhancements for the Admin Finalization UI include:

1. Implementing batch processing for multiple orders
2. Adding support for document scanning and OCR
3. Enhancing the EMR processing with AI-based extraction
4. Implementing audit logging for administrative actions
5. Adding support for comments and annotations on orders