/**
 * Patient Search Controller
 * 
 * This controller handles patient search based on dictated patient name and date of birth.
 * If no match is found, the order will be tagged with the name and DOB for admin staff to process.
 */

import { Request, Response } from 'express';
import patientSearchService, { PatientSearchParams } from '../services/patient-search.service';
import enhancedLogger from '../utils/enhanced-logger';

class PatientSearchController {
  /**
   * Search for patients by name and date of birth from dictation
   * @route POST /api/patients/search
   * @access Private (Physician)
   * 
   * Body parameters:
   * - patientName: Full patient name from dictation
   * - dateOfBirth: Date of birth (YYYY-MM-DD)
   */
  async searchPatients(req: Request, res: Response): Promise<void> {
    try {
      // Get organization ID from authenticated user
      const organizationId = req.user?.orgId;
      if (!organizationId) {
        res.status(401).json({
          success: false,
          message: 'User organization not found'
        });
        return;
      }
      
      // Extract search parameters from body (since it's from dictation)
      const { patientName, dateOfBirth } = req.body;
      
      // Validate required parameters
      if (!patientName || !dateOfBirth) {
        res.status(400).json({
          success: false,
          message: 'Both patient name and date of birth are required'
        });
        return;
      }
      
      const searchParams: PatientSearchParams = {
        patientName: patientName.trim(),
        dateOfBirth
      };
      
      // Perform the search
      const results = await patientSearchService.searchPatients(organizationId, searchParams);
      
      // Return results - empty array if no matches found
      res.json({
        success: true,
        data: results,
        message: results.length === 0 
          ? 'No matching patients found. Order will be tagged with patient name and DOB for administrative processing.'
          : undefined
      });
    } catch (error) {
      enhancedLogger.error('Error in searchPatients controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search patients'
      });
    }
  }
}

export default new PatientSearchController();