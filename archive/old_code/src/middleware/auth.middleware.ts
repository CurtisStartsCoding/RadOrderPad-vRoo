import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthTokenPayload } from '../models';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    console.log('JWT Secret:', process.env.JWT_SECRET?.substring(0, 3) + '...');
    console.log('Token:', token.substring(0, 10) + '...');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here') as AuthTokenPayload;
    console.log('Decoded token:', decoded);
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

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

/**
 * Middleware to check if user belongs to the specified organization
 */
export const authorizeOrganization = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const orgId = parseInt(req.params.orgId);
  
  if (isNaN(orgId)) {
    return res.status(400).json({ message: 'Invalid organization ID' });
  }

  if (req.user.orgId !== orgId && req.user.role !== 'super_admin') {
    return res.status(403).json({ 
      message: 'Access denied: You do not have permission to access this organization'
    });
  }

  next();
};