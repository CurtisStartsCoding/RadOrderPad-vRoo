/**
 * useLocationForm Hook
 * 
 * Custom hook for managing location form state and validation.
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Location, CreateLocationRequest } from '../types/location-types';

interface UseLocationFormProps {
  location?: Location | null;
  onSave: (data: CreateLocationRequest) => void;
  open: boolean;
}

/**
 * Hook for managing location form state and validation
 */
export const useLocationForm = ({ location, onSave, open }: UseLocationFormProps) => {
  const isEditMode = !!location;
  
  // Form setup with react-hook-form
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm<CreateLocationRequest>({
    defaultValues: {
      name: location?.name || '',
      address: location?.address || '',
      city: location?.city || '',
      state: location?.state || '',
      zipCode: location?.zipCode || '',
      phone: location?.phone || ''
    }
  });

  // Reset form when dialog opens/closes or location changes
  useEffect(() => {
    if (open) {
      reset({
        name: location?.name || '',
        address: location?.address || '',
        city: location?.city || '',
        state: location?.state || '',
        zipCode: location?.zipCode || '',
        phone: location?.phone || ''
      });
    }
  }, [open, location, reset]);

  // Form submission handler
  const onSubmit = (data: CreateLocationRequest) => {
    onSave(data);
  };

  // Field validation rules
  const validationRules = {
    name: { required: 'Name is required' },
    address: { required: 'Address is required' },
    city: { required: 'City is required' },
    state: { required: 'State is required' },
    zipCode: { required: 'Zip code is required' },
    phone: { required: 'Phone is required' }
  };

  // Dialog title and description based on mode
  const dialogTitle = isEditMode ? 'Edit Location' : 'Add Location';
  const dialogDescription = isEditMode 
    ? 'Edit the location details below.' 
    : 'Fill in the location details below.';
  const submitButtonText = isEditMode ? 'Save Changes' : 'Add Location';

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    validationRules,
    dialogTitle,
    dialogDescription,
    submitButtonText,
    isEditMode
  };
};