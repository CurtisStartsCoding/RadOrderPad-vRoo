/**
 * LocationFormField Component
 * 
 * A reusable form field component for location forms.
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError, UseFormRegister } from 'react-hook-form';
import { CreateLocationRequest } from '../../types/location-types';

interface LocationFormFieldProps {
  id: keyof CreateLocationRequest;
  label: string;
  register: UseFormRegister<CreateLocationRequest>;
  validationRules: Record<string, any>;
  error?: FieldError;
}

export const LocationFormField: React.FC<LocationFormFieldProps> = ({
  id,
  label,
  register,
  validationRules,
  error
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <div className="col-span-3">
        <Input
          id={id}
          {...register(id, validationRules[id])}
          className={error ? 'border-red-500' : ''}
        />
        {error && (
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
        )}
      </div>
    </div>
  );
};