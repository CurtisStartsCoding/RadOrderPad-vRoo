import { Request, Response } from 'express';
/**
 * List all users with optional filtering
 * GET /api/superadmin/users
 */
export declare function listAllUsersController(req: Request, res: Response): Promise<void>;
