import React from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Checkbox } from '../../../components/ui/checkbox';
import { Label } from '../../../components/ui/label';
import { RadiologyOrderStatus, ExportOptions } from '../types/radiology-order-types';

/**
 * Props for the RadiologyOrderActions component
 */
interface RadiologyOrderActionsProps {
  currentStatus: RadiologyOrderStatus;
  updateStatus: (data: { status: RadiologyOrderStatus }) => void;
  isUpdatingStatus: boolean;
  
  exportOptions: ExportOptions;
  updateExportOptions: <K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) => void;
  handleExport: () => void;
}

/**
 * RadiologyOrderActions Component
 * 
 * Provides actions for updating order status and exporting data.
 */
export const RadiologyOrderActions: React.FC<RadiologyOrderActionsProps> = ({
  currentStatus,
  updateStatus,
  isUpdatingStatus,
  
  exportOptions,
  updateExportOptions,
  handleExport
}) => {
  const [selectedStatus, setSelectedStatus] = React.useState<RadiologyOrderStatus>(currentStatus);
  
  /**
   * Handle status change
   */
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as RadiologyOrderStatus);
  };
  
  /**
   * Handle save status
   */
  const handleSaveStatus = () => {
    if (selectedStatus !== currentStatus) {
      updateStatus({ status: selectedStatus });
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Status Update */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Update Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="status-select">Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger id="status-select">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={RadiologyOrderStatus.PENDING_REVIEW}>Pending Review</SelectItem>
                    <SelectItem value={RadiologyOrderStatus.IN_PROGRESS}>In Progress</SelectItem>
                    <SelectItem value={RadiologyOrderStatus.COMPLETED}>Completed</SelectItem>
                    <SelectItem value={RadiologyOrderStatus.CANCELLED}>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSaveStatus}
                  disabled={isUpdatingStatus || selectedStatus === currentStatus}
                  className="w-full"
                >
                  {isUpdatingStatus ? 'Saving...' : 'Save Status'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Export Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Format</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="format-json"
                    checked={exportOptions.format === 'json'}
                    onChange={() => updateExportOptions('format', 'json')}
                  />
                  <Label htmlFor="format-json">JSON</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="format-csv"
                    checked={exportOptions.format === 'csv'}
                    onChange={() => updateExportOptions('format', 'csv')}
                  />
                  <Label htmlFor="format-csv">CSV</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Include Data</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-patient"
                    checked={exportOptions.includePatientInfo}
                    onCheckedChange={(checked) => 
                      updateExportOptions('includePatientInfo', checked === true)
                    }
                  />
                  <Label htmlFor="include-patient">Include Patient Information</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-insurance"
                    checked={exportOptions.includeInsuranceInfo}
                    onCheckedChange={(checked) => 
                      updateExportOptions('includeInsuranceInfo', checked === true)
                    }
                  />
                  <Label htmlFor="include-insurance">Include Insurance Information</Label>
                </div>
              </div>
            </div>
            
            <Button onClick={handleExport} className="w-full">
              Export
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};