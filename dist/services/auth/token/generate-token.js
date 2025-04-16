"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
const token_utils_1 = require("../../../utils/token.utils");
/**
 * Generate a JWT token for a user
 */
function generateToken(user) {
    return (0, token_utils_1.generateToken)(user);
}
//# sourceMappingURL=generate-token.js.map