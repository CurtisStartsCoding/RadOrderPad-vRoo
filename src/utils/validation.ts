/**
 * Validates an email address format
 * @param email Email address to validate
 * @returns Boolean indicating if the email format is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};