/**
 * Verify the registration key
 */
export function verifyRegistrationKey(providedKey: string): boolean {
  const registrationKey = process.env.REGISTRATION_KEY;
  return providedKey === registrationKey;
}