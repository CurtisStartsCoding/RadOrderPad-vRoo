/**
 * Compatibility layer for useRadiologyOrderDetail
 * 
 * This hook combines the functionality of useRadiologyOrderData, useStatusUpdate,
 * and useOrderExport to maintain backward compatibility while adhering to SRP.
 * 
 * @deprecated Use the more focused hooks instead:
 * - useRadiologyOrderData: For fetching order data
 * - useStatusUpdate: For updating order status
 * - useOrderExport: For exporting order data
 */

import { useRadiologyOrderData } from './useRadiologyOrderData';
import { useStatusUpdate } from './useStatusUpdate';
import { useOrderExport } from './useOrderExport';

export const useRadiologyOrderDetail = (orderId: string) => {
  // Get order data
  const {
    orderData,
    isLoadingOrder,
    isOrderError,
    orderError,
    refetchOrder
  } = useRadiologyOrderData(orderId);
  
  // Get status update functionality
  const {
    updateStatus,
    isUpdatingStatus
  } = useStatusUpdate(orderId, orderData);
  
  // Get export functionality
  const {
    exportOptions,
    updateExportOptions,
    handleExport
  } = useOrderExport(orderData);
  
  // Return combined functionality
  return {
    // Order data
    orderData,
    isLoadingOrder,
    isOrderError,
    orderError,
    refetchOrder,
    
    // Status update
    updateStatus,
    isUpdatingStatus,
    
    // Export
    exportOptions,
    updateExportOptions,
    handleExport
  };
};