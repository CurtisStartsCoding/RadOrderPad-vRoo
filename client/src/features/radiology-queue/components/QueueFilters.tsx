import React from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { RadiologyOrderFilters, RadiologyOrderStatus } from '../types/radiology-order-types';

/**
 * Props for the QueueFilters component
 */
interface QueueFiltersProps {
  filters: RadiologyOrderFilters;
  updateFilter: <K extends keyof RadiologyOrderFilters>(key: K, value: RadiologyOrderFilters[K]) => void;
  resetFilters: () => void;
}

/**
 * QueueFilters Component
 * 
 * Renders filter controls for the radiology order queue.
 */
export const QueueFilters: React.FC<QueueFiltersProps> = ({
  filters,
  updateFilter,
  resetFilters
}) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Filters</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => updateFilter('status', value as RadiologyOrderStatus)}
          >
            <SelectTrigger id="status-filter">
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
        
        {/* Patient Name Filter */}
        <div className="space-y-2">
          <Label htmlFor="patient-name-filter">Patient Name</Label>
          <Input
            id="patient-name-filter"
            placeholder="Search by name"
            value={filters.patientName || ''}
            onChange={(e) => updateFilter('patientName', e.target.value)}
          />
        </div>
        
        {/* Date From Filter */}
        <div className="space-y-2">
          <Label htmlFor="date-from-filter">Date From</Label>
          <Input
            id="date-from-filter"
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => updateFilter('dateFrom', e.target.value)}
          />
        </div>
        
        {/* Date To Filter */}
        <div className="space-y-2">
          <Label htmlFor="date-to-filter">Date To</Label>
          <Input
            id="date-to-filter"
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => updateFilter('dateTo', e.target.value)}
          />
        </div>
        
        {/* Modality Filter */}
        <div className="space-y-2">
          <Label htmlFor="modality-filter">Modality</Label>
          <Select
            value={filters.modality || ''}
            onValueChange={(value) => updateFilter('modality', value)}
          >
            <SelectTrigger id="modality-filter">
              <SelectValue placeholder="Select modality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Modalities</SelectItem>
              <SelectItem value="MRI">MRI</SelectItem>
              <SelectItem value="CT">CT</SelectItem>
              <SelectItem value="X-Ray">X-Ray</SelectItem>
              <SelectItem value="Ultrasound">Ultrasound</SelectItem>
              <SelectItem value="Mammography">Mammography</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};