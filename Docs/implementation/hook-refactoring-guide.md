# Hook Refactoring Guide

## Introduction

This document provides guidance on refactoring complex React hooks into smaller, more focused hooks following the Single Responsibility Principle (SRP). It uses the refactoring of `useRadiologyOrderDetail` as a case study to illustrate the process and benefits.

## Why Refactor Hooks?

Complex hooks that handle multiple responsibilities can become difficult to maintain, test, and understand. Refactoring them into smaller, focused hooks offers several benefits:

1. **Improved Maintainability**: Each hook has a clear, single responsibility
2. **Better Testability**: Smaller hooks are easier to test in isolation
3. **Enhanced Readability**: Code intent is clearer with focused responsibilities
4. **Reusability**: Smaller hooks can be reused in different contexts
5. **Easier Debugging**: Issues are isolated to specific functionality

## Case Study: Refactoring `useRadiologyOrderDetail`

### The Problem

The original `useRadiologyOrderDetail` hook had multiple responsibilities:

1. Fetching order data
2. Updating order status
3. Exporting order data

This made the hook large (over 200 lines), difficult to test, and challenging to maintain.

### The Solution

We refactored the hook into three smaller, focused hooks:

1. `useRadiologyOrderData`: Responsible for fetching order details
2. `useStatusUpdate`: Responsible for updating order status
3. `useOrderExport`: Responsible for handling export functionality

We then created a compatibility layer in `useRadiologyOrderDetail.ts` that combines these hooks to maintain backward compatibility.

### Before and After

#### Before: Monolithic Hook

```typescript
// Original monolithic hook with multiple responsibilities
export const useRadiologyOrderDetail = (orderId: string) => {
  // Data fetching logic
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['radiologyOrder', orderId],
    queryFn: () => fetchRadiologyOrder(orderId),
    enabled: !!orderId,
  });

  // Status update logic
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { mutate: updateStatusMutate, isPending: isUpdatingStatus } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Order status has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['radiologyOrder', orderId] });
      queryClient.invalidateQueries({ queryKey: ['radiologyQueue'] });
    },
    onError: (error) => {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Export logic
  const [exportOptions, setExportOptions] = useState({
    format: 'pdf',
    includeImages: true,
    includeNotes: true,
  });
  
  const { isPending: isExporting, mutate: exportMutate } = useMutation({
    mutationFn: exportOrder,
    onSuccess: () => {
      toast({
        title: "Export successful",
        description: "Order has been exported successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // More code...

  return {
    orderData: data,
    isLoadingOrder: isLoading,
    isOrderError: isError,
    orderError: error,
    refetchOrder: refetch,
    updateStatus: (status) => updateStatusMutate({ orderId, status }),
    isUpdatingStatus,
    exportOptions,
    setExportOptions,
    exportOrder: (options) => exportMutate({ orderId, options: { ...exportOptions, ...options } }),
    isExporting,
  };
};
```

#### After: Focused Hooks

```typescript
// Hook 1: Data fetching
export const useRadiologyOrderData = (orderId: string) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['radiologyOrder', orderId],
    queryFn: () => fetchRadiologyOrder(orderId),
    enabled: !!orderId,
  });

  return {
    orderData: data,
    isLoadingOrder: isLoading,
    isOrderError: isError,
    orderError: error,
    refetchOrder: refetch,
  };
};

// Hook 2: Status update
export const useStatusUpdate = (orderId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { mutate, isPending } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Order status has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['radiologyOrder', orderId] });
      queryClient.invalidateQueries({ queryKey: ['radiologyQueue'] });
    },
    onError: (error) => {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    updateStatus: (status) => mutate({ orderId, status }),
    isUpdatingStatus: isPending,
  };
};

// Hook 3: Export functionality
export const useOrderExport = (orderId: string) => {
  const [exportOptions, setExportOptions] = useState({
    format: 'pdf',
    includeImages: true,
    includeNotes: true,
  });
  
  const { toast } = useToast();
  const { isPending, mutate } = useMutation({
    mutationFn: exportOrder,
    onSuccess: () => {
      toast({
        title: "Export successful",
        description: "Order has been exported successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    exportOptions,
    setExportOptions,
    exportOrder: (options) => mutate({ orderId, options: { ...exportOptions, ...options } }),
    isExporting: isPending,
  };
};

// Compatibility layer
/**
 * @deprecated This hook is provided for backward compatibility.
 * For new code, use the more focused hooks directly:
 * - useRadiologyOrderData
 * - useStatusUpdate
 * - useOrderExport
 */
export const useRadiologyOrderDetail = (orderId: string) => {
  // Use all the smaller hooks
  const orderData = useRadiologyOrderData(orderId);
  const statusUpdate = useStatusUpdate(orderId);
  const orderExport = useOrderExport(orderId);
  
  // Combine all the hooks' return values
  return {
    // From useRadiologyOrderData
    orderData: orderData.orderData,
    isLoadingOrder: orderData.isLoadingOrder,
    isOrderError: orderData.isOrderError,
    orderError: orderData.orderError,
    refetchOrder: orderData.refetchOrder,
    
    // From useStatusUpdate
    updateStatus: statusUpdate.updateStatus,
    isUpdatingStatus: statusUpdate.isUpdatingStatus,
    
    // From useOrderExport
    exportOptions: orderExport.exportOptions,
    setExportOptions: orderExport.setExportOptions,
    exportOrder: orderExport.exportOrder,
    isExporting: orderExport.isExporting,
  };
};
```

## Refactoring Process

Follow these steps when refactoring complex hooks:

### 1. Identify Responsibilities

Analyze the hook to identify distinct responsibilities. Look for:

- Different state variables that manage unrelated concerns
- API calls for different purposes
- Separate UI interactions
- Distinct business logic

In our case study, we identified three main responsibilities:
- Data fetching (order details)
- Status updates
- Export functionality

### 2. Extract Focused Hooks

For each responsibility:

1. Create a new hook file with a descriptive name
2. Move the relevant state, effects, and functions to the new hook
3. Return only the values and functions related to that responsibility
4. Add JSDoc comments explaining the hook's purpose

### 3. Create a Compatibility Layer

To maintain backward compatibility:

1. Create a new version of the original hook that uses the focused hooks
2. Combine the return values from all focused hooks
3. Add a deprecation notice with migration guidance
4. Ensure the API remains identical to the original hook

### 4. Update Imports

If needed, update imports in components that use the hook:

1. For new components, import the focused hooks directly
2. For existing components, continue using the compatibility layer
3. Plan for gradual migration to the focused hooks

### 5. Test Thoroughly

Verify the refactoring with:

1. TypeScript compiler to check for type errors
2. Unit tests for each focused hook
3. Integration tests for components using the hooks
4. Manual testing in the application

## Best Practices for Hook Design

When designing hooks, follow these best practices:

### 1. Single Responsibility

Each hook should have a single, well-defined responsibility. If a hook is doing too much, split it into smaller hooks.

### 2. Descriptive Naming

Use descriptive names that clearly indicate the hook's purpose:
- `useFetch` → `useProductData`
- `useForm` → `useCheckoutForm`
- `useToggle` → `useMenuVisibility`

### 3. Consistent Return Structure

Use consistent patterns for hook return values:
- Return objects with named properties for clarity
- Group related values and functions
- Use consistent naming conventions

### 4. Proper Error Handling

Implement comprehensive error handling:
- Capture and expose error states
- Provide meaningful error messages
- Handle edge cases gracefully

### 5. Optimized Performance

Optimize hook performance:
- Use memoization (useMemo, useCallback) for expensive operations
- Implement proper dependency arrays for useEffect
- Avoid unnecessary re-renders

### 6. Comprehensive Documentation

Document hooks thoroughly:
- Add JSDoc comments explaining purpose, parameters, and return values
- Include usage examples
- Document any side effects or dependencies

## Benefits Realized

The refactoring of `useRadiologyOrderDetail` yielded several benefits:

1. **Reduced Complexity**: Each hook is simpler and more focused
2. **Improved Readability**: Code intent is clearer with focused responsibilities
3. **Enhanced Testability**: Smaller hooks are easier to test in isolation
4. **Better Maintainability**: Changes to one aspect don't affect others
5. **Increased Reusability**: Focused hooks can be used in different contexts

## Conclusion

Refactoring complex hooks into smaller, focused hooks following the Single Responsibility Principle leads to more maintainable, testable, and understandable code. The case study of `useRadiologyOrderDetail` demonstrates how this approach can be applied successfully to improve code quality while maintaining backward compatibility.

By following the process and best practices outlined in this guide, you can effectively refactor complex hooks in your own codebase, leading to a more maintainable and robust application.