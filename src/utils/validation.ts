/**
 * Validate an email address
 * @param email Email address to validate
 * @returns True if the email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  // Regular expression for validating an email address
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validate a password
 * @param password Password to validate
 * @returns Object with validation result and message
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true };
}

/**
 * Validate a phone number
 * @param phoneNumber Phone number to validate
 * @returns True if the phone number is valid, false otherwise
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  // Regular expression for validating a phone number
  // Accepts formats like: (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890
  const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return phoneRegex.test(phoneNumber);
}

/**
 * Validate a US ZIP code
 * @param zipCode ZIP code to validate
 * @returns True if the ZIP code is valid, false otherwise
 */
export function validateZipCode(zipCode: string): boolean {
  // Regular expression for validating a US ZIP code (5 digits or 5+4 format)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
}

/**
 * Validate a National Provider Identifier (NPI)
 * @param npi NPI to validate
 * @returns True if the NPI is valid, false otherwise
 */
export function validateNPI(npi: string): boolean {
  // NPI is a 10-digit number
  const npiRegex = /^\d{10}$/;
  return npiRegex.test(npi);
}