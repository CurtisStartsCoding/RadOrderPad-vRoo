import { Request, Response } from 'express';

/**
 * Validate a relationship ID from request parameters
 * @param req Express request object
 * @param res Express response object
 * @returns The validated relationship ID if valid, null otherwise
 */
export function validateRelationshipId(req: Request, res: Response): number | null {
  const relationshipId = parseInt(req.params.relationshipId);
  
  if (isNaN(relationshipId)) {
    res.status(400).json({ message: 'Invalid relationship ID' });
    return null;
  }
  
  return relationshipId;
}