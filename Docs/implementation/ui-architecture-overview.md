# RadOrderPad UI Architecture Overview

## Introduction

This document provides a high-level overview of the RadOrderPad UI architecture, explaining how the different features and components work together to create a cohesive application. The UI is built with a focus on modularity, maintainability, and adherence to the Single Responsibility Principle (SRP).

## Core Architecture Principles

The RadOrderPad UI is built on the following core principles:

1. **Extreme Modularity**: Every logical piece and distinct UI element is in its own file
2. **Single Responsibility**: Each component, hook, and utility has a single, well-defined responsibility
3. **Strict File Size Limit**: No file exceeds 50-70 lines of code
4. **Hierarchical Organization**: Components are organized in a logical hierarchy
5. **Type Safety**: Comprehensive TypeScript types throughout the codebase
6. **Separation of Concerns**: UI rendering is separated from business logic

## Technology Stack

- **Framework**: React with Next.js (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: 
  - Local state: React's useState and useReducer
  - Global state: React Context API
  - Server state: TanStack Query (React Query)
- **Form Handling**: React Hook Form
- **Routing**: Next.js App Router
- **API Communication**: Fetch API with TanStack Query/Mutation

## Project Structure

```
client/
├── apps/                   # Next.js applications
│   └── web/                # Main web application
│       ├── app/            # App Router pages
│       │   ├── order/      # Physician order routes
│       │   ├── admin/      # Admin routes
│       │   └── radiology/  # Radiology routes
│       └── public/         # Static assets
├── src/                    # Shared source code
│   ├── components/         # Shared components
│   │   ├── ui/             # UI primitives (Shadcn)
│   │   └── common/         # Common components
│   ├── features/           # Feature-specific code
│   │   ├── physician-order/ # Physician order feature
│   │   ├── admin-finalization/ # Admin finalization feature
│   │   └── radiology-queue/ # Radiology queue feature
│   ├── hooks/              # Shared hooks
│   ├── lib/                # Shared utilities
│   └── types/              # Shared type definitions
└── tsconfig.json           # TypeScript configuration
```

## Feature Organization

Each feature follows a consistent organization pattern:

```
feature-name/
├── components/             # UI components
│   └── index.ts            # Barrel file
├── hooks/                  # Custom hooks
│   └── index.ts            # Barrel file
├── types/                  # TypeScript type definitions
│   └── index.ts            # Barrel file
├── utils/                  # Utility functions
│   └── index.ts            # Barrel file
├── constants/              # Constants and configuration
│   └── index.ts            # Barrel file
└── index.ts                # Main barrel file for the feature
```

## Application Flow

The RadOrderPad application follows a workflow-based approach:

1. **Physician Order Creation**:
   - Physicians identify patients
   - Dictate order details
   - Review validation results
   - Sign and submit orders

2. **Admin Finalization**:
   - Administrative staff review submitted orders
   - Edit patient and insurance information
   - Process EMR data
   - Add supplemental documents
   - Finalize and send to radiology

3. **Radiology Processing**:
   - Radiology staff review finalized orders
   - Update order status
   - Export order data
   - Complete radiology workflow

## Key Features

### 1. Physician Order Workflow

The Physician Order Workflow is a step-based process that guides physicians through creating radiology orders:

- **Patient Identification**: Search and select patients
- **Dictation**: Enter order details via text or speech recognition
- **Validation**: Review and address validation issues
- **Signature**: Sign and submit the order

See [Physician Order UI Components](./physician-order-ui-components.md) for detailed documentation.

### 2. Admin Finalization

The Admin Finalization feature allows administrative staff to review and finalize orders:

- **Order Queue**: View and manage pending orders
- **Patient Information Editing**: Update patient details
- **Insurance Information Editing**: Update insurance details
- **EMR Processing**: Extract data from EMR systems
- **Order Finalization**: Send completed orders to radiology

See [Admin Finalization UI Components](./admin-finalization-ui-components.md) for detailed documentation.

### 3. Radiology Queue

The Radiology Queue feature allows radiology staff to process finalized orders:

- **Order Queue**: View and manage radiology orders
- **Status Management**: Update order status
- **Order Export**: Export order data in various formats
- **Order Details**: View comprehensive order information

See [Radiology Queue UI Components](./radiology-queue-ui-components.md) for detailed documentation.

## Component Reuse and Composition

The UI architecture emphasizes component reuse and composition:

1. **UI Primitives**: Basic UI components from Shadcn/ui are used throughout the application
2. **Common Components**: Shared components like `OrderProgressIndicator` are used across features
3. **Composition**: Complex components are composed of smaller, focused components
4. **Hooks**: Custom hooks encapsulate and share logic between components

## State Management Strategy

The application uses a layered approach to state management:

1. **Component State**: Local state for component-specific concerns
2. **Feature State**: Custom hooks manage feature-specific state
3. **Global State**: React Context for authentication and global settings
4. **Server State**: TanStack Query for API data fetching, caching, and synchronization

## Hook Architecture

Custom hooks follow a consistent pattern:

1. **Data Fetching Hooks**: Encapsulate TanStack Query logic
2. **Mutation Hooks**: Encapsulate TanStack Mutation logic
3. **State Management Hooks**: Manage complex state logic
4. **Workflow Hooks**: Orchestrate multi-step processes
5. **Compatibility Hooks**: Combine smaller hooks for backward compatibility

## Routing Strategy

The application uses Next.js App Router with a logical route structure:

- `/order/new`: Physician order creation
- `/admin/queue`: Admin order queue
- `/admin/order/[orderId]`: Admin order detail
- `/radiology/queue`: Radiology order queue
- `/radiology/order/[orderId]`: Radiology order detail

## API Integration

The UI integrates with backend APIs using TanStack Query:

1. **Queries**: Fetch and cache data from the server
2. **Mutations**: Update data on the server
3. **Invalidation**: Refresh data when it changes
4. **Optimistic Updates**: Update UI before server confirmation
5. **Error Handling**: Handle API errors gracefully

## Styling Approach

The application uses Tailwind CSS with a consistent approach:

1. **Design System**: Colors, typography, and spacing follow the style guide
2. **Component Styling**: Components use Tailwind classes directly
3. **Responsive Design**: All components adapt to different screen sizes
4. **Accessibility**: Proper contrast, focus states, and ARIA attributes
5. **Dark Mode**: Support for light and dark themes

## Error Handling

The application implements comprehensive error handling:

1. **API Errors**: Handled by TanStack Query with user-friendly messages
2. **Validation Errors**: Displayed inline with form fields
3. **Application Errors**: Caught by error boundaries
4. **Toast Notifications**: Used for transient error messages
5. **Fallback UI**: Shown when components fail to render

## Performance Optimization

The UI implements several performance optimizations:

1. **Code Splitting**: Next.js automatic code splitting
2. **Lazy Loading**: Components and routes loaded on demand
3. **Memoization**: React.memo and useMemo for expensive computations
4. **Virtualization**: For long lists and tables
5. **Optimized Images**: Next.js Image component for image optimization

## Accessibility

The application prioritizes accessibility:

1. **Semantic HTML**: Proper HTML elements for their intended purpose
2. **Keyboard Navigation**: All interactions possible via keyboard
3. **Screen Reader Support**: ARIA attributes and proper labeling
4. **Focus Management**: Proper focus handling for modals and dialogs
5. **Color Contrast**: Sufficient contrast for text and UI elements

## Testing Strategy

The UI components are designed for testability:

1. **Unit Tests**: For individual components and hooks
2. **Integration Tests**: For component interactions
3. **End-to-End Tests**: For complete user flows
4. **Visual Regression Tests**: For UI appearance
5. **Accessibility Tests**: For WCAG compliance

## Documentation

The UI is thoroughly documented:

1. **Component Documentation**: Props, usage, and examples
2. **Hook Documentation**: Parameters, return values, and examples
3. **Type Documentation**: Interface and type definitions
4. **Architecture Documentation**: High-level design and patterns
5. **JSDoc Comments**: Inline documentation for code

## Future Enhancements

Planned enhancements to the UI architecture include:

1. **Micro-Frontend Architecture**: For larger scale and team collaboration
2. **Server Components**: Leveraging Next.js server components for performance
3. **Streaming**: Implementing streaming for large data sets
4. **Offline Support**: Adding offline capabilities with service workers
5. **Analytics Integration**: Adding comprehensive usage analytics

## Conclusion

The RadOrderPad UI architecture is designed for maintainability, scalability, and developer productivity. By adhering to principles of extreme modularity and single responsibility, the codebase remains clean and easy to understand despite its complexity. The consistent patterns and organization make it straightforward for developers to navigate and extend the application.