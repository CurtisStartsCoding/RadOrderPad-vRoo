import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import npiLookupController from '../controllers/utilities/npi-lookup.controller';

const router = Router();

// All utility routes require authentication
router.use(authenticateJWT);

/**
 * @route   GET /api/utilities/npi-lookup
 * @desc    Lookup physician information from NPI Registry
 * @access  Private (Any authenticated user)
 * @query   number - 10-digit NPI number
 * @example GET /api/utilities/npi-lookup?number=1234567890
 */
router.get('/npi-lookup', npiLookupController);

export default router;