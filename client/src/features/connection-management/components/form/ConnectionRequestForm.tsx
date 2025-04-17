/**
 * ConnectionRequestForm Component
 * 
 * Form for requesting a connection with a selected organization.
 */

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { OrganizationSearchResult } from '../../types';

interface ConnectionRequestFormProps {
  selectedOrganization: OrganizationSearchResult;
  onRequestConnection: (notes?: string) => void;
  onBack: () => void;
  isRequesting: boolean;
}

export const ConnectionRequestForm: React.FC<ConnectionRequestFormProps> = ({
  selectedOrganization,
  onRequestConnection,
  onBack,
  isRequesting
}) => {
  const [notes, setNotes] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestConnection(notes);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Selected Organization</Label>
        <div className="p-2 border rounded-md">
          <p className="font-medium">{selectedOrganization.name}</p>
          <p className="text-sm text-muted-foreground">
            {selectedOrganization.npi && `NPI: ${selectedOrganization.npi}`}
            {selectedOrganization.city && selectedOrganization.state && 
              ` • ${selectedOrganization.city}, ${selectedOrganization.state}`}
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this connection request"
          rows={4}
        />
      </div>
      
      <DialogFooter className="gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isRequesting}
        >
          Back
        </Button>
        <Button type="submit" disabled={isRequesting}>
          {isRequesting ? 'Requesting...' : 'Request Connection'}
        </Button>
      </DialogFooter>
    </form>
  );
};