import { Request, Response, NextFunction } from 'express';
import './types';
/**
 * Middleware to check if user belongs to the specified organization
 */
export declare const authorizeOrganization: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
