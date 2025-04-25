import { Response } from 'express';
import { getMyOrganization } from '../../services/organization/index.js';
import {
  AuthenticatedRequest,
  ControllerHandler,
  checkAuthentication
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
    // eslint-disable-next-line no-console
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
      
      // eslint-disable-next-line no-console
      console.log('Schema check result:', schemaResult.rows);
      
      if (schemaResult.rows.length === 0) {
        res.status(500).json({ 
          message: 'Status column not found in database schema',
          debug: true
        });
        return;
      }
    } catch (dbError: unknown) {
      const error = dbError as Error;
      // eslint-disable-next-line no-console
      console.error('Error checking database schema:', error);
      res.status(500).json({ 
        message: 'Error checking database schema',
        error: error.message,
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
  } catch (error: unknown) {
    const err = error as Error;
    // eslint-disable-next-line no-console
    console.error('Debug endpoint error:', err);
    res.status(500).json({
      message: 'Failed to get organization details',
      error: err.message,
      stack: err.stack,
      debug: true
    });
  }
};

export default getMyOrganizationDebugController;