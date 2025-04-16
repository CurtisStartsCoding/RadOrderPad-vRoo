import { Request, Response, NextFunction } from 'express';
import { AuthTokenPayload } from '../models';
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
export declare const authenticateJWT: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Middleware to check if user has required role
 */
export declare const authorizeRole: (roles: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Middleware to check if user belongs to the specified organization
 */
export declare const authorizeOrganization: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
