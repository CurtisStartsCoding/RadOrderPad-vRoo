"use strict";
/**
 * LLM providers index
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.callGPT = exports.callGrok = exports.callClaude = void 0;
var anthropic_1 = require("./anthropic");
Object.defineProperty(exports, "callClaude", { enumerable: true, get: function () { return anthropic_1.callClaude; } });
var grok_1 = require("./grok");
Object.defineProperty(exports, "callGrok", { enumerable: true, get: function () { return grok_1.callGrok; } });
var openai_1 = require("./openai");
Object.defineProperty(exports, "callGPT", { enumerable: true, get: function () { return openai_1.callGPT; } });
//# sourceMappingURL=index.js.map