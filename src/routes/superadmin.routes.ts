import { Router } from 'express';
import { authenticateJWT, authorizeRole } from '../middleware/auth';
import {
  listAllOrganizationsController,
  getOrganizationByIdController,
  listAllUsersController,
  getUserByIdController,
  prompts,
  logs,
  organizations,
  users
} from '../controllers/superadmin';

const router = Router();

// Apply authentication and role-based access control middleware to all routes
router.use(authenticateJWT);
router.use(authorizeRole(['super_admin']));

// Organization routes
router.get('/organizations', listAllOrganizationsController);
router.get('/organizations/:orgId', getOrganizationByIdController);
router.put('/organizations/:orgId/status', organizations.updateOrganizationStatusController);
router.post('/organizations/:orgId/credits/adjust', organizations.adjustOrganizationCreditsController);

// User routes
router.get('/users', listAllUsersController);
router.get('/users/:userId', getUserByIdController);
router.put('/users/:userId/status', users.updateUserStatusController);

// Prompt template routes
router.post('/prompts/templates', prompts.templates.createPromptTemplateController);
router.get('/prompts/templates', prompts.templates.listPromptTemplatesController);
router.get('/prompts/templates/:templateId', prompts.templates.getPromptTemplateController);
router.put('/prompts/templates/:templateId', prompts.templates.updatePromptTemplateController);
router.delete('/prompts/templates/:templateId', prompts.templates.deletePromptTemplateController);

// Prompt assignment routes
router.post('/prompts/assignments', prompts.assignments.createPromptAssignmentController);
router.get('/prompts/assignments', prompts.assignments.listPromptAssignmentsController);
router.get('/prompts/assignments/:assignmentId', prompts.assignments.getPromptAssignmentController);
router.put('/prompts/assignments/:assignmentId', prompts.assignments.updatePromptAssignmentController);
router.delete('/prompts/assignments/:assignmentId', prompts.assignments.deletePromptAssignmentController);

// Log viewing routes
router.get('/logs/validation', logs.listLlmValidationLogsController);
router.get('/logs/validation/enhanced', logs.listLlmValidationLogsEnhancedController);
router.get('/logs/credits', logs.listCreditUsageLogsController);
router.get('/logs/purgatory', logs.listPurgatoryEventsController);

export default router;