# Radiology Queue UI Components Documentation

## Overview

This document provides detailed documentation for the UI components implemented for the Radiology Queue feature. The Radiology Queue UI allows radiology staff to view, manage, and process orders that have been finalized by administrative staff.

## Architecture

The Radiology Queue UI is built with a highly modular architecture following these principles:

1. **Extreme Modularity**: Each logical piece and distinct UI element is in its own file
2. **Single Responsibility**: Each component has a single, well-defined responsibility
3. **Strict File Size Limit**: No file exceeds 50-70 lines of code
4. **Hierarchical Organization**: Components are organized in a logical hierarchy

## Directory Structure

```
client/src/features/radiology-queue/
├── components/             # UI components
│   ├── index.ts            # Barrel file exporting all components
│   ├── QueueFilters.tsx    # Filters for the radiology queue
│   ├── RadiologyOrderTable.tsx # Table for displaying orders
│   ├── RadiologyOrderDetailDisplay.tsx # Display order details
│   └── RadiologyOrderActions.tsx # Action buttons for radiology tasks
├── hooks/                  # Custom hooks
│   ├── index.ts            # Barrel file exporting all hooks
│   ├── useRadiologyQueue.ts # Hook for queue management
│   ├── useRadiologyOrderData.ts # Hook for order data fetching
│   ├── useStatusUpdate.ts  # Hook for status updates
│   ├── useOrderExport.ts   # Hook for order export
│   └── useRadiologyOrderDetail.ts # Compatibility layer combining hooks
├── types/                  # TypeScript type definitions
│   ├── index.ts            # Barrel file exporting all types
│   └── radiology-order-types.ts # Radiology-specific order types
├── utils/                  # Utility functions
│   ├── index.ts            # Barrel file exporting all utilities
│   ├── date-utils.ts       # Date formatting utilities
│   └── export-utils.ts     # Export formatting utilities
└── index.ts                # Main barrel file for the feature
```

## Component Hierarchy

```
Radiology Queue Page
├── QueueFilters
└── RadiologyOrderTable

Radiology Order Detail Page
├── RadiologyOrderDetailDisplay
└── RadiologyOrderActions
```

## Detailed Component Documentation

### QueueFilters

**File**: `components/QueueFilters.tsx`

**Purpose**: Provides filtering options for the radiology queue.

**Props**:
- `filters`: Current filter state
- `onFilterChange`: Callback function when filters change
- `className`: Optional CSS class for styling

**Implementation Details**:
- Provides filter controls for status, modality, date range, and physician
- Implements form elements for each filter type
- Provides a reset button to clear all filters
- Uses responsive design for different screen sizes
- Implements collapsible sections for mobile view

**Example Usage**:
```tsx
<QueueFilters 
  filters={filterOptions} 
  onFilterChange={setFilterOptions} 
  className="mb-6" 
/>
```

### RadiologyOrderTable

**File**: `components/RadiologyOrderTable.tsx`

**Purpose**: Displays a table of orders in the radiology queue.

**Props**:
- `orders`: Array of order objects to display
- `onSelectOrder`: Callback function when an order is selected
- `isLoading`: Boolean indicating if orders are loading
- `onRefresh`: Callback function to refresh the order list
- `onExport`: Callback function to export orders

**Implementation Details**:
- Uses the Shadcn UI Table component
- Implements sorting and filtering capabilities
- Displays key order information (patient, modality, status, etc.)
- Provides row-level actions
- Includes an export button for exporting orders
- Implements responsive design for different screen sizes

**Example Usage**:
```tsx
<RadiologyOrderTable 
  orders={queueData} 
  onSelectOrder={(orderId) => router.push(`/radiology/order/${orderId}`)} 
  isLoading={isLoading} 
  onRefresh={refetchQueue} 
  onExport={handleExport} 
/>
```

### RadiologyOrderDetailDisplay

**File**: `components/RadiologyOrderDetailDisplay.tsx`

**Purpose**: Displays detailed information about a radiology order.

**Props**:
- `order`: Order object containing order details
- `className`: Optional CSS class for styling

**Implementation Details**:
- Displays comprehensive order information
- Organizes information into sections (patient, order details, clinical information)
- Shows images and attachments when available
- Implements responsive design
- Uses card layout for organized presentation

**Example Usage**:
```tsx
<RadiologyOrderDetailDisplay order={orderData} className="mb-6" />
```

### RadiologyOrderActions

**File**: `components/RadiologyOrderActions.tsx`

**Purpose**: Provides action buttons for radiology staff to process orders.

**Props**:
- `orderId`: ID of the current order
- `currentStatus`: Current status of the order
- `onUpdateStatus`: Callback function to update order status
- `isUpdatingStatus`: Boolean indicating if status update is in progress
- `onExport`: Callback function to export the order
- `isExporting`: Boolean indicating if export is in progress
- `exportOptions`: Export options object
- `setExportOptions`: Function to update export options
- `onBack`: Callback function to navigate back to queue

**Implementation Details**:
- Displays action buttons based on current order status
- Implements status update functionality
- Provides export options with format selection
- Shows loading states during actions
- Implements confirmation dialogs for status changes
- Uses the hooks for status update and export functionality

**Example Usage**:
```tsx
<RadiologyOrderActions 
  orderId={orderId} 
  currentStatus={orderData?.status} 
  onUpdateStatus={updateStatus} 
  isUpdatingStatus={isUpdatingStatus} 
  onExport={exportOrder} 
  isExporting={isExporting} 
  exportOptions={exportOptions} 
  setExportOptions={setExportOptions} 
  onBack={() => router.push('/radiology/queue')} 
/>
```

## Custom Hooks

### useRadiologyQueue

**File**: `hooks/useRadiologyQueue.ts`

**Purpose**: Hook for managing the radiology queue data and operations.

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
- `exportQueue`: Function to export queue data

**Implementation Details**:
- Uses TanStack Query for data fetching and caching
- Implements filtering and sorting functionality
- Provides error handling for failed fetches
- Manages pagination state
- Implements export functionality for queue data

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
  setSortOptions,
  exportQueue
} = useRadiologyQueue();
```

### useRadiologyOrderData

**File**: `hooks/useRadiologyOrderData.ts`

**Purpose**: Hook for fetching and managing radiology order data.

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
} = useRadiologyOrderData(orderId);
```

### useStatusUpdate

**File**: `hooks/useStatusUpdate.ts`

**Purpose**: Hook for updating order status.

**Parameters**:
- `orderId`: ID of the current order

**Returns**:
- `updateStatus`: Function to update order status
- `isUpdatingStatus`: Boolean indicating if update is in progress

**Implementation Details**:
- Implements API call for updating order status
- Uses TanStack Mutation for API interaction
- Provides error handling for update failures
- Shows success/error notifications
- Invalidates related queries on successful update

**Example Usage**:
```tsx
const {
  updateStatus,
  isUpdatingStatus
} = useStatusUpdate(orderId);
```

### useOrderExport

**File**: `hooks/useOrderExport.ts`

**Purpose**: Hook for exporting order data.

**Parameters**:
- `orderId`: ID of the current order

**Returns**:
- `exportOptions`: Current export options
- `setExportOptions`: Function to update export options
- `exportOrder`: Function to export order data
- `isExporting`: Boolean indicating if export is in progress

**Implementation Details**:
- Manages export options state
- Implements API call for exporting order data
- Uses TanStack Mutation for API interaction
- Provides error handling for export failures
- Shows success/error notifications

**Example Usage**:
```tsx
const {
  exportOptions,
  setExportOptions,
  exportOrder,
  isExporting
} = useOrderExport(orderId);
```

### useRadiologyOrderDetail

**File**: `hooks/useRadiologyOrderDetail.ts`

**Purpose**: Compatibility hook that combines all the smaller hooks for radiology order detail.

**Parameters**:
- `orderId`: ID of the current order

**Returns**:
- Combined return values from all the smaller hooks

**Implementation Details**:
- Uses all the smaller hooks (useRadiologyOrderData, useStatusUpdate, useOrderExport)
- Combines their return values into a single object
- Provides backward compatibility for existing code
- Includes deprecation notice with migration guidance

**Example Usage**:
```tsx
const {
  orderData,
  isLoadingOrder,
  updateStatus,
  isUpdatingStatus,
  exportOptions,
  setExportOptions,
  exportOrder,
  isExporting
} = useRadiologyOrderDetail(orderId);
```

## Type Definitions

### Radiology Order Types

**File**: `types/radiology-order-types.ts`

**Key Types**:
- `RadiologyOrder`: Interface for radiology-specific order data
- `RadiologyQueueItem`: Interface for items in the radiology queue
- `RadiologyStatus`: Enum for radiology-specific status values
- `ExportFormat`: Enum for export format options
- `ExportOptions`: Interface for export configuration

## Utility Functions

### Date Utilities

**File**: `utils/date-utils.ts`

**Key Functions**:
- `formatOrderDate`: Formats order date for display
- `formatDateOfBirth`: Formats date of birth for display
- `calculateAge`: Calculates age from date of birth
- `formatDateRange`: Formats date range for display

### Export Utilities

**File**: `utils/export-utils.ts`

**Key Functions**:
- `prepareExportData`: Prepares order data for export
- `formatExportFilename`: Generates filename for exported data
- `getContentTypeForFormat`: Gets content type based on export format
- `convertOrderToFormat`: Converts order data to specified format

## Integration with App

The Radiology Queue UI is integrated into the application via two main routes:

### Radiology Queue Page

**File**: `client/apps/web/app/radiology/queue/page.tsx`

**Implementation Details**:
- Uses the `useRadiologyQueue` hook for data fetching
- Renders the `QueueFilters` and `RadiologyOrderTable` components
- Implements page title and description
- Provides refresh and export functionality

### Radiology Order Detail Page

**File**: `client/apps/web/app/radiology/order/[orderId]/page.tsx`

**Implementation Details**:
- Uses the `useRadiologyOrderDetail` hook for data management
- Renders the `RadiologyOrderDetailDisplay` and `RadiologyOrderActions` components
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
- Focus management for dialogs and forms
- Screen reader friendly text alternatives
- Sufficient color contrast for text elements

## Future Enhancements

Potential future enhancements for the Radiology Queue UI include:

1. Implementing a DICOM viewer for radiology images
2. Adding support for commenting and annotations on orders
3. Implementing a notification system for status changes
4. Adding support for batch processing of orders
5. Enhancing export functionality with more format options
6. Implementing integration with PACS systems