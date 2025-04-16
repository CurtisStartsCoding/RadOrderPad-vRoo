import { Request, Response, NextFunction } from 'express';

// Import types to ensure Express Request interface is extended
import './types';

/**
 * Middleware to check if user has required role
 */
export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    console.log('User role:', req.user.role);
    console.log('Required roles:', roles);

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