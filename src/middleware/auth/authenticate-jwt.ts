import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthTokenPayload } from '../../models';
import logger from '../../utils/logger';

// Import types to ensure Express Request interface is extended
import './types';

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    logger.debug('JWT Secret:', { secretPrefix: process.env.JWT_SECRET?.substring(0, 3) + '...' });
    logger.debug('Token:', { tokenPrefix: token.substring(0, 10) + '...' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here') as AuthTokenPayload;
    logger.debug('Decoded token:', { userId: decoded.userId, role: decoded.role });
    
    if (decoded.isTrial === true && decoded.trialUserId) {
      req.user = {
        userId: decoded.trialUserId, // Map trialUserId to userId for simplicity downstream
        orgId: 0, // No org for trial users
        role: 'trial_physician', // Assign a specific role
        email: decoded.email,
        isTrial: true, // Add the flag
        specialty: decoded.specialty, // Pass specialty along
        trialUserId: decoded.trialUserId // Keep the original trialUserId
      };
    } else {
      req.user = {
        userId: decoded.userId,
        orgId: decoded.orgId,
        role: decoded.role,
        email: decoded.email,
        isTrial: false // Explicitly false
      };
    }
    next();
  } catch (error) {
    logger.error('JWT verification error:', { error });
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};