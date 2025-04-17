/**
 * OrganizationSearchForm Component
 * 
 * Form for searching organizations.
 */

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { OrganizationSearchParams, OrganizationType } from '../../types';

interface OrganizationSearchFormProps {
  onSearch: (params: OrganizationSearchParams) => void;
  isSearching: boolean;
  searchType: OrganizationType;
}

export const OrganizationSearchForm: React.FC<OrganizationSearchFormProps> = ({
  onSearch,
  isSearching,
  searchType
}) => {
  // Form state
  const [name, setName] = useState('');
  const [npi, setNpi] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  
  // Handle search form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      name: name || undefined,
      npi: npi || undefined,
      city: city || undefined,
      state: state || undefined,
      type: searchType
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Organization Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter organization name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="npi">NPI</Label>
          <Input
            id="npi"
            value={npi}
            onChange={(e) => setNpi(e.target.value)}
            placeholder="Enter NPI"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Enter state"
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button type="submit" disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </DialogFooter>
    </form>
  );
};