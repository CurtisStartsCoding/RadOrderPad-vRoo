import { Request, Response, NextFunction } from 'express';
import './types';
/**
 * Middleware to authenticate JWT tokens
 */
export declare const authenticateJWT: (req: Request, res: Response, next: NextFunction) => Response | void;
