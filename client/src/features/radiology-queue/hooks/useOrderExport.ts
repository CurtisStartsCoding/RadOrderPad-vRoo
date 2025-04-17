import { useState } from 'react';
import { useToast } from '../../../components/ui/use-toast';
import { RadiologyOrder, ExportOptions } from '../types/radiology-order-types';
import { exportOrders } from '../utils/export-utils';

/**
 * Custom hook for managing order export functionality
 * 
 * This hook is responsible for managing export options and handling
 * the export process.
 */
export const useOrderExport = (orderData: RadiologyOrder | undefined) => {
  const { toast } = useToast();
  
  // State for export options
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'json',
    includePatientInfo: true,
    includeInsuranceInfo: true
  });
  
  /**
   * Handle export
   */
  const handleExport = () => {
    if (!orderData) {
      toast({
        title: 'Export Failed',
        description: 'No order data available to export.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Export the order data
      exportOrders([orderData], exportOptions);
      
      toast({
        title: 'Export Successful',
        description: `Order data exported as ${exportOptions.format.toUpperCase()}.`,
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'An error occurred during export.',
        variant: 'destructive'
      });
    }
  };
  
  /**
   * Update export options
   */
  const updateExportOptions = <K extends keyof ExportOptions>(
    key: K,
    value: ExportOptions[K]
  ) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  return {
    exportOptions,
    updateExportOptions,
    handleExport
  };
};