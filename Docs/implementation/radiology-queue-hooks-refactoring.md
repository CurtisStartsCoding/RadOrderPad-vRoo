# Radiology Queue Hooks Refactoring

## Overview

This document details the refactoring of the `useRadiologyOrderDetail` hook into smaller, more focused hooks following the Single Responsibility Principle (SRP). The refactoring aims to improve maintainability, testability, and readability while maintaining backward compatibility.

## File Structure

The refactoring resulted in the following file structure:

```
client/src/features/radiology-queue/hooks/
├── index.ts                    # Barrel file exporting all hooks
├── useRadiologyQueue.ts        # Hook for managing the radiology queue
├── useRadiologyOrderData.ts    # Hook for fetching order details
├── useStatusUpdate.ts          # Hook for updating order status
├── useOrderExport.ts           # Hook for handling export functionality
└── useRadiologyOrderDetail.ts  # Compatibility layer combining the above hooks
```

## Hook Responsibilities

### useRadiologyOrderData.ts (116 lines)

Responsible for fetching and managing order data:

- Fetches order details using TanStack Query
- Manages loading and error states
- Provides refetch functionality
- Returns order data and metadata

```typescript
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
```

### useStatusUpdate.ts (53 lines)

Responsible for updating order status:

- Provides mutation for status updates
- Handles success and error notifications
- Invalidates related queries on success
- Returns mutation state and functions

```typescript
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
    updateStatus: mutate,
    isUpdatingStatus: isPending,
  };
};
```

### useOrderExport.ts (57 lines)

Responsible for handling export functionality:

- Manages export options state
- Provides export function
- Handles export errors
- Returns export state and functions

```typescript
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
    exportOrder: mutate,
    isExporting: isPending,
  };
};
```

### useRadiologyOrderDetail.ts (50 lines)

Compatibility layer that combines the above hooks:

- Uses all three specialized hooks
- Maintains the same API as the original hook
- Includes deprecation notice
- Ensures backward compatibility

```typescript
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

## Admin Order Detail Fix

During the refactoring, an issue with the admin order detail page was identified and fixed:

1. The `useAdminOrderDetail` hook existed but wasn't being exported from the hooks/index.ts file
2. Added the export to the hooks/index.ts file:

```typescript
// client/src/features/admin-finalization/hooks/index.ts
export * from './useAdminQueue';
export * from './useOrderDetail';
export * from './useEmrProcessing';
export * from './useSupplementalDocs';
export * from './usePatientInfoEditor';
export * from './useInsuranceInfoEditor';
export * from './useOrderFinalization';
export * from './useAdminOrderDetail'; // Added this line
```

## Benefits

The refactoring provides several benefits:

1. **Improved Maintainability**
   - Each hook has a clear, single responsibility
   - Changes to one aspect don't affect others
   - Easier to understand and modify

2. **Better Testability**
   - Smaller, focused hooks are easier to test in isolation
   - Fewer dependencies to mock
   - More targeted test cases

3. **Enhanced Readability**
   - Code intent is clearer with focused responsibilities
   - Smaller files are easier to comprehend
   - Function names clearly indicate purpose

4. **Consistency**
   - Follows the same patterns used elsewhere in the codebase
   - Adheres to the project's architectural guidelines
   - Establishes pattern for future hook refactoring

5. **Gradual Migration**
   - Compatibility layer allows for incremental adoption
   - Existing code continues to work
   - New code can use the more focused hooks

## Verification

The refactoring was thoroughly verified with:

1. TypeScript compiler (`tsc --noEmit`) - No type errors
2. Manual testing in the browser - Admin order detail page now loads correctly
3. Process check - Development server continues to run without issues

## Future Improvements

Potential future improvements include:

1. Adding unit tests for each hook
2. Gradually migrating existing code to use the new hooks
3. Applying similar refactoring to other complex hooks in the codebase
4. Eventually removing the compatibility layer once all code has been migrated