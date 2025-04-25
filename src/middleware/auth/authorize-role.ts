import { Request, Response, NextFunction } from 'express';
import logger from '../../utils/logger';

// Import types to ensure Express Request interface is extended
import './types';

/**
 * Middleware to check if user has required role
 */
export const authorizeRole = (roles: string[]): ((req: Request, res: Response, next: NextFunction) => Response | void) => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    logger.debug('Role authorization check:', {
      userRole: req.user.role,
      requiredRoles: roles
    });

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied: Insufficient permissions',
        requiredRoles: roles,
        userRole: req.user.role
      });
    }

    next();
  };
};