import { Response } from 'express';
import { getMyOrganization } from '../../services/organization/get-my-organization.js';
import {
  AuthenticatedRequest,
  ControllerHandler,
  checkAuthentication,
  handleControllerError
} from './types.js';

/**
 * Debug version of the get-my-organization controller
 * This is a temporary endpoint to bypass any potential caching issues
 * @param req Express request object
 * @param res Express response object
 */
export const getMyOrganizationDebugController: ControllerHandler = async (
  req: AuthenticatedRequest, 
  res: Response
): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!checkAuthentication(req, res)) {
      return;
    }
    
    const orgId = req.user!.orgId;
    
    // Log the request for debugging
    console.log(`Debug endpoint called for organization ID: ${orgId}`);
    
    // Try to query the database directly to check if the status column exists
    try {
      const { queryMainDb } = await import('../../config/db.js');
      const schemaResult = await queryMainDb(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'organizations'
        AND column_name = 'status'
      `);
      
      console.log('Schema check result:', schemaResult.rows);
      
      if (schemaResult.rows.length === 0) {
        res.status(500).json({ 
          message: 'Status column not found in database schema',
          debug: true
        });
        return;
      }
    } catch (dbError: any) {
      console.error('Error checking database schema:', dbError);
      res.status(500).json({ 
        message: 'Error checking database schema',
        error: dbError.message,
        debug: true
      });
      return;
    }
    
    // Call the regular service function
    const result = await getMyOrganization(orgId);
    
    if (!result) {
      res.status(404).json({ 
        message: 'Organization not found',
        debug: true
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: result,
      debug: true
    });
  } catch (error: any) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({
      message: 'Failed to get organization details',
      error: error.message,
      stack: error.stack,
      debug: true
    });
  }
};

export default getMyOrganizationDebugController;