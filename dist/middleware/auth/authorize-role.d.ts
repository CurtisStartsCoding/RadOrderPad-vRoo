import { Request, Response, NextFunction } from 'express';
import './types';
/**
 * Middleware to check if user has required role
 */
export declare const authorizeRole: (roles: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
