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

/**
 * Validate target organization ID from request body
 * @param req Express request object
 * @param res Express response object
 * @param initiatingOrgId The initiating organization ID for comparison
 * @returns The validated target organization ID if valid, null otherwise
 */
export function validateTargetOrgId(req: Request, res: Response, initiatingOrgId: number): number | null {
  const { targetOrgId } = req.body;
  
  if (!targetOrgId) {
    res.status(400).json({ message: 'Target organization ID is required' });
    return null;
  }
  
  // Validate that targetOrgId is a number
  const targetOrgIdNum = parseInt(targetOrgId);
  if (isNaN(targetOrgIdNum)) {
    res.status(400).json({ message: 'Target organization ID must be a number' });
    return null;
  }
  
  // Validate that the target organization is not the same as the initiating organization
  if (targetOrgIdNum === initiatingOrgId) {
    res.status(400).json({ message: 'Cannot request a connection to your own organization' });
    return null;
  }
  
  return targetOrgIdNum;
}