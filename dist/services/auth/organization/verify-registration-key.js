/**
 * Verify the registration key
 */
export function verifyRegistrationKey(providedKey) {
    const registrationKey = process.env.REGISTRATION_KEY;
    return providedKey === registrationKey;
}
//# sourceMappingURL=verify-registration-key.js.map