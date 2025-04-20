"use strict";
/**
 * This file is a compatibility layer for the refactored insurance module.
 * It re-exports the functions from the insurance directory to maintain
 * backward compatibility with existing code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInsuranceFromEmr = exports.updateInsuranceInfo = void 0;
const insurance_1 = require("./insurance");
Object.defineProperty(exports, "updateInsuranceInfo", { enumerable: true, get: function () { return insurance_1.updateInsuranceInfo; } });
Object.defineProperty(exports, "updateInsuranceFromEmr", { enumerable: true, get: function () { return insurance_1.updateInsuranceFromEmr; } });
//# sourceMappingURL=insurance-manager.js.map