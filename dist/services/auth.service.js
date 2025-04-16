"use strict";
// Temporary compatibility file to allow the server to start
// This file re-exports the auth service from its new location
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
exports.default = auth_1.default;
//# sourceMappingURL=auth.service.js.map