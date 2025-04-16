import { Request, Response } from 'express';
/**
 * Validate a relationship ID from request parameters
 * @param req Express request object
 * @param res Express response object
 * @returns The validated relationship ID if valid, null otherwise
 */
export declare function validateRelationshipId(req: Request, res: Response): number | null;
