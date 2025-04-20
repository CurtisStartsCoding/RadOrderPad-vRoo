"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = __importDefault(require("../controllers/auth.controller.js"));
const router = (0, express_1.Router)();
/**
 * @route   POST /api/auth/register
 * @desc    Register a new organization and admin user
 * @access  Public
 */
router.post('/register', auth_controller_js_1.default.register);
/**
 * @route   POST /api/auth/login
 * @desc    Login a user
 * @access  Public
 */
router.post('/login', auth_controller_js_1.default.login);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map