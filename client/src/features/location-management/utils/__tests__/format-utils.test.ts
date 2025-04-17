/**
 * Tests for format utilities
 */

import { 
  formatStatus, 
  formatDate, 
  formatDateWithTime, 
  formatFullAddress, 
  formatPhoneNumber, 
  getStatusBadgeVariant 
} from '../format-utils';
import { LocationStatus } from '../../types/location-types';

describe('formatStatus', () => {
  it('should format active status correctly', () => {
    expect(formatStatus(LocationStatus.ACTIVE)).toBe('Active');
  });

  it('should format inactive status correctly', () => {
    expect(formatStatus(LocationStatus.INACTIVE)).toBe('Inactive');
  });

  it('should return the status as is if not recognized', () => {
    const unknownStatus = 'unknown' as LocationStatus;
    expect(formatStatus(unknownStatus)).toBe(unknownStatus);
  });
});

describe('formatDate', () => {
  it('should format date correctly', () => {
    // Mock the Intl.DateTimeFormat to return a consistent value for testing
    const originalDateTimeFormat = Intl.DateTimeFormat;
    const mockFormat = jest.fn().mockReturnValue('Jan 1, 2023');
    global.Intl.DateTimeFormat = jest.fn().mockImplementation(() => ({
      format: mockFormat
    })) as any;

    const result = formatDate('2023-01-01T12:00:00Z');
    
    expect(result).toBe('Jan 1, 2023');
    expect(Intl.DateTimeFormat).toHaveBeenCalledWith('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    // Restore the original implementation
    global.Intl.DateTimeFormat = originalDateTimeFormat;
  });
});

describe('formatDateWithTime', () => {
  it('should format date with time correctly', () => {
    // Mock the Intl.DateTimeFormat to return a consistent value for testing
    const originalDateTimeFormat = Intl.DateTimeFormat;
    const mockFormat = jest.fn().mockReturnValue('Jan 1, 2023, 12:00 PM');
    global.Intl.DateTimeFormat = jest.fn().mockImplementation(() => ({
      format: mockFormat
    })) as any;

    const result = formatDateWithTime('2023-01-01T12:00:00Z');
    
    expect(result).toBe('Jan 1, 2023, 12:00 PM');
    expect(Intl.DateTimeFormat).toHaveBeenCalledWith('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
    
    // Restore the original implementation
    global.Intl.DateTimeFormat = originalDateTimeFormat;
  });
});

describe('formatFullAddress', () => {
  it('should format full address correctly', () => {
    const result = formatFullAddress('123 Main St', 'Anytown', 'CA', '12345');
    expect(result).toBe('123 Main St, Anytown, CA 12345');
  });
});

describe('formatPhoneNumber', () => {
  it('should format phone number correctly', () => {
    const result = formatPhoneNumber('1234567890');
    expect(result).toBe('(123) 456-7890');
  });

  it('should return the original phone number if format is not recognized', () => {
    const invalidPhone = '123';
    expect(formatPhoneNumber(invalidPhone)).toBe(invalidPhone);
  });
});

describe('getStatusBadgeVariant', () => {
  it('should return default variant for active status', () => {
    expect(getStatusBadgeVariant(LocationStatus.ACTIVE)).toBe('default');
  });

  it('should return destructive variant for inactive status', () => {
    expect(getStatusBadgeVariant(LocationStatus.INACTIVE)).toBe('destructive');
  });

  it('should return default variant for unknown status', () => {
    const unknownStatus = 'unknown' as LocationStatus;
    expect(getStatusBadgeVariant(unknownStatus)).toBe('default');
  });
});