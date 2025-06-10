/**
 * Patient Routes
 * 
 * This module defines routes for patient search based on dictation,
 * allowing physicians to find existing patients by name and date of birth.
 */

import { Router } from 'express';
import patientSearchController from '../controllers/patient-search.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/patients/search
 * @desc    Search for patients by name and date of birth from dictation
 * @access  Private (Physician)
 * @body    patientName - Full patient name from dictation
 * @body    dateOfBirth - Date of birth (YYYY-MM-DD)
 */
router.post(
  '/search',
  authenticateJWT,
  authorizeRole(['physician']),
  patientSearchController.searchPatients
);

export default router;