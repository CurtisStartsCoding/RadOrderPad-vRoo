import { Request, Response } from 'express';
/**
 * Get an organization by ID
 * GET /api/superadmin/organizations/:orgId
 */
export declare function getOrganizationByIdController(req: Request, res: Response): Promise<void>;
