/**
 * Format Utilities
 * 
 * Utility functions for formatting and transforming location management data.
 */

import { LocationStatus } from '../types/location-types';

/**
 * Format a location status for display
 * 
 * @param status - The status to format
 * @returns The formatted status
 */
export const formatStatus = (status: LocationStatus): string => {
  switch (status) {
    case LocationStatus.ACTIVE:
      return 'Active';
    case LocationStatus.INACTIVE:
      return 'Inactive';
    default:
      return status;
  }
};

/**
 * Format a date for display
 * 
 * @param dateString - The date string to format
 * @returns The formatted date
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

/**
 * Format a date with time for display
 * 
 * @param dateString - The date string to format
 * @returns The formatted date with time
 */
export const formatDateWithTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
};

/**
 * Format a full address for display
 * 
 * @param address - The street address
 * @param city - The city
 * @param state - The state
 * @param zipCode - The zip code
 * @returns The formatted full address
 */
export const formatFullAddress = (
  address: string,
  city: string,
  state: string,
  zipCode: string
): string => {
  return `${address}, ${city}, ${state} ${zipCode}`;
};

/**
 * Format a phone number for display
 * 
 * @param phone - The phone number to format
 * @returns The formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if the input is of correct length
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
};

/**
 * Get the badge variant for a status
 * 
 * @param status - The status to get the variant for
 * @returns The badge variant
 */
export const getStatusBadgeVariant = (status: LocationStatus): 'default' | 'destructive' => {
  switch (status) {
    case LocationStatus.ACTIVE:
      return 'default';
    case LocationStatus.INACTIVE:
      return 'destructive';
    default:
      return 'default';
  }
};