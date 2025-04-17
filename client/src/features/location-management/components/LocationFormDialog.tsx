/**
 * LocationFormDialog Component
 * 
 * A dialog/modal for adding and editing locations.
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Location, CreateLocationRequest } from '../types/location-types';
import { LocationFormField } from './form-fields';
import { useLocationForm } from '../hooks';

interface LocationFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateLocationRequest) => void;
  isSubmitting: boolean;
  location?: Location | null;
}

export const LocationFormDialog: React.FC<LocationFormDialogProps> = ({
  open,
  onClose,
  onSave,
  isSubmitting,
  location
}) => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    validationRules,
    dialogTitle,
    dialogDescription,
    submitButtonText
  } = useLocationForm({ location, onSave, open });

  // Form field definitions
  const formFields = [
    { id: 'name' as const, label: 'Name' },
    { id: 'address' as const, label: 'Address' },
    { id: 'city' as const, label: 'City' },
    { id: 'state' as const, label: 'State' },
    { id: 'zipCode' as const, label: 'Zip Code' },
    { id: 'phone' as const, label: 'Phone' }
  ];

  return (
    <Dialog open={open} onOpenChange={(isOpen: boolean) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {formFields.map((field) => (
              <LocationFormField
                key={field.id}
                id={field.id}
                label={field.label}
                register={register}
                validationRules={validationRules}
                error={errors[field.id]}
              />
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};