"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRegistrationKey = verifyRegistrationKey;
/**
 * Verify the registration key
 */
function verifyRegistrationKey(providedKey) {
    const registrationKey = process.env.REGISTRATION_KEY;
    return providedKey === registrationKey;
}
//# sourceMappingURL=verify-registration-key.js.map