"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const superadmin_1 = require("../controllers/superadmin");
const router = (0, express_1.Router)();
// Apply authentication and role-based access control middleware to all routes
router.use(auth_1.authenticateJWT);
router.use((0, auth_1.authorizeRole)(['super_admin']));
// Organization routes
router.get('/organizations', superadmin_1.listAllOrganizationsController);
router.get('/organizations/:orgId', superadmin_1.getOrganizationByIdController);
router.put('/organizations/:orgId/status', superadmin_1.organizations.updateOrganizationStatusController);
router.post('/organizations/:orgId/credits/adjust', superadmin_1.organizations.adjustOrganizationCreditsController);
// User routes
router.get('/users', superadmin_1.listAllUsersController);
router.get('/users/:userId', superadmin_1.getUserByIdController);
// Prompt template routes
router.post('/prompts/templates', superadmin_1.prompts.templates.createPromptTemplateController);
router.get('/prompts/templates', superadmin_1.prompts.templates.listPromptTemplatesController);
router.get('/prompts/templates/:templateId', superadmin_1.prompts.templates.getPromptTemplateController);
router.put('/prompts/templates/:templateId', superadmin_1.prompts.templates.updatePromptTemplateController);
router.delete('/prompts/templates/:templateId', superadmin_1.prompts.templates.deletePromptTemplateController);
// Prompt assignment routes
router.post('/prompts/assignments', superadmin_1.prompts.assignments.createPromptAssignmentController);
router.get('/prompts/assignments', superadmin_1.prompts.assignments.listPromptAssignmentsController);
router.get('/prompts/assignments/:assignmentId', superadmin_1.prompts.assignments.getPromptAssignmentController);
router.put('/prompts/assignments/:assignmentId', superadmin_1.prompts.assignments.updatePromptAssignmentController);
router.delete('/prompts/assignments/:assignmentId', superadmin_1.prompts.assignments.deletePromptAssignmentController);
// Log viewing routes
router.get('/logs/validation', superadmin_1.logs.listLlmValidationLogsController);
router.get('/logs/credits', superadmin_1.logs.listCreditUsageLogsController);
router.get('/logs/purgatory', superadmin_1.logs.listPurgatoryEventsController);
exports.default = router;
//# sourceMappingURL=superadmin.routes.js.map