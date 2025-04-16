"use strict";
/**
 * LLM client index
 * Re-exports all functionality for backward compatibility
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.callLLMWithFallback = exports.callGPT = exports.callGrok = exports.callClaude = exports.LLMProvider = void 0;
// Re-export types
var types_1 = require("./types");
Object.defineProperty(exports, "LLMProvider", { enumerable: true, get: function () { return types_1.LLMProvider; } });
// Re-export provider functions
var providers_1 = require("./providers");
Object.defineProperty(exports, "callClaude", { enumerable: true, get: function () { return providers_1.callClaude; } });
Object.defineProperty(exports, "callGrok", { enumerable: true, get: function () { return providers_1.callGrok; } });
Object.defineProperty(exports, "callGPT", { enumerable: true, get: function () { return providers_1.callGPT; } });
// Re-export client function
var client_1 = require("./client");
Object.defineProperty(exports, "callLLMWithFallback", { enumerable: true, get: function () { return client_1.callLLMWithFallback; } });
//# sourceMappingURL=index.js.map