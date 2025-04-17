/**
 * Format Utilities
 * 
 * Utility functions for formatting data in the connection management feature.
 */

import { BadgeVariant } from '@/components/ui/badge';
import { ConnectionStatus } from '../types';

/**
 * Format a date string for display
 * 
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Jan 15, 2023")
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
 * @param dateString - ISO date string
 * @returns Formatted date and time string (e.g., "Jan 15, 2023, 12:00 PM")
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
 * Format a connection status for display
 * 
 * @param status - Connection status
 * @returns Formatted status string with first letter capitalized
 */
export const formatStatus = (status: ConnectionStatus): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Get the appropriate badge variant based on connection status
 * 
 * @param status - Connection status
 * @returns Badge variant name
 */
export const getStatusBadgeVariant = (status: ConnectionStatus): BadgeVariant => {
  switch (status) {
    case ConnectionStatus.ACTIVE:
      return "default";
    case ConnectionStatus.PENDING:
      return "outline";
    case ConnectionStatus.REJECTED:
      return "destructive";
    case ConnectionStatus.PURGATORY:
      return "secondary";
    case ConnectionStatus.TERMINATED:
      return "destructive";
    default:
      return "default";
  }
};