import { Request, Response } from 'express';
/**
 * Get a user by ID
 * GET /api/superadmin/users/:userId
 */
export declare function getUserByIdController(req: Request, res: Response): Promise<void>;
