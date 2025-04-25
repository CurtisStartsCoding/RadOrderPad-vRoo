/**
 * Authentication and authorization middleware
 */
import './types';
export { authenticateJWT } from './authenticate-jwt';
export { authorizeRole } from './authorize-role';
export { authorizeOrganization } from './authorize-organization';
declare const _default: {
    authenticateJWT: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => import("express").Response | void;
    authorizeRole: (roles: string[]) => ((req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => import("express").Response | void);
    authorizeOrganization: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => import("express").Response | void;
};
export default _default;
