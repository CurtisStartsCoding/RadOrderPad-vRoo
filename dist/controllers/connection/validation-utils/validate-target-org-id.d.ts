import { Request, Response } from 'express';
/**
 * Validate target organization ID from request body
 * @param req Express request object
 * @param res Express response object
 * @param initiatingOrgId The initiating organization ID for comparison
 * @returns The validated target organization ID if valid, null otherwise
 */
export declare function validateTargetOrgId(req: Request, res: Response, initiatingOrgId: number): number | null;
