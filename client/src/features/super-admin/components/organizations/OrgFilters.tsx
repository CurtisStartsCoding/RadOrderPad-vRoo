/**
 * OrgFilters Component
 * 
 * Filters for the organization table in the Super Admin feature.
 */

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  OrganizationFilterParams,
  OrganizationType,
  OrganizationStatus
} from '../../types';

interface OrgFiltersProps {
  filters: OrganizationFilterParams;
  onUpdateFilters: (filters: OrganizationFilterParams) => void;
  onResetFilters: () => void;
}

export const OrgFilters: React.FC<OrgFiltersProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters
}) => {
  // Local state for form values
  const [name, setName] = useState(filters.name || '');
  const [npi, setNpi] = useState(filters.npi || '');
  const [type, setType] = useState<OrganizationType | undefined>(filters.type);
  const [status, setStatus] = useState<OrganizationStatus | undefined>(filters.status);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newFilters: OrganizationFilterParams = {
      name: name || undefined,
      npi: npi || undefined,
      type,
      status
    };
    
    onUpdateFilters(newFilters);
  };
  
  // Handle reset
  const handleReset = () => {
    setName('');
    setNpi('');
    setType(undefined);
    setStatus(undefined);
    onResetFilters();
  };
  
  return (
    <div className="bg-white p-4 rounded-md border mb-4">
      <h3 className="text-lg font-medium mb-4">Filters</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Name Filter */}
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Search by name"
            />
          </div>
          
          {/* NPI Filter */}
          <div className="space-y-2">
            <Label htmlFor="npi">NPI</Label>
            <Input
              id="npi"
              value={npi}
              onChange={(e) => setNpi(e.target.value)}
              placeholder="Search by NPI"
            />
          </div>
          
          {/* Type Filter */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as OrganizationType)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={OrganizationType.REFERRING_PRACTICE}>
                  Referring Practice
                </SelectItem>
                <SelectItem value={OrganizationType.RADIOLOGY_GROUP}>
                  Radiology Group
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as OrganizationStatus)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={OrganizationStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={OrganizationStatus.ON_HOLD}>On Hold</SelectItem>
                <SelectItem value={OrganizationStatus.PURGATORY}>Purgatory</SelectItem>
                <SelectItem value={OrganizationStatus.TERMINATED}>Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit">Apply Filters</Button>
        </div>
      </form>
    </div>
  );
};