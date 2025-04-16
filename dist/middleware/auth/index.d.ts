/**
 * Authentication and authorization middleware
 */
import './types';
export { authenticateJWT } from './authenticate-jwt';
export { authorizeRole } from './authorize-role';
export { authorizeOrganization } from './authorize-organization';
declare const _default: {
    authenticateJWT: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => import("express").Response<any, Record<string, any>> | undefined;
    authorizeRole: (roles: string[]) => (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => import("express").Response<any, Record<string, any>> | undefined;
    authorizeOrganization: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => import("express").Response<any, Record<string, any>> | undefined;
};
export default _default;
