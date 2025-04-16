import { AuthTokenPayload } from '../../models';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export {};