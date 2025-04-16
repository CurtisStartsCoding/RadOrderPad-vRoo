import { Request, Response } from 'express';
import { listAllOrganizations } from '../../../services/superadmin';

/**
 * List all organizations with optional filtering
 * GET /api/superadmin/organizations
 */
export async function listAllOrganizationsController(req: Request, res: Response): Promise<void> {
  try {
    // Extract query parameters for filtering
    const filters = {
      name: req.query.name as string | undefined,
      type: req.query.type as string | undefined,
      status: req.query.status as string | undefined
    };
    
    // Call the service function
    const organizations = await listAllOrganizations(filters);
    
    // Return the organizations
    res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations
    });
  } catch (error) {
    console.error('Error listing organizations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list organizations',
      error: (error as Error).message
    });
  }
}