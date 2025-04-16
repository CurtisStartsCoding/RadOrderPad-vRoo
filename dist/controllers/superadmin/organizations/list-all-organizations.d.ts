import { Request, Response } from 'express';
/**
 * List all organizations with optional filtering
 * GET /api/superadmin/organizations
 */
export declare function listAllOrganizationsController(req: Request, res: Response): Promise<void>;
