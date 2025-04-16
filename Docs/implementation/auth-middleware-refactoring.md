# Auth Middleware Refactoring

**Date:** 2025-04-14
**Author:** Roo
**Status:** Completed

## Overview

This document details the refactoring of the `middleware/auth.middleware.ts` file, which was identified as having multiple functions (3 functions in 90 lines). The refactoring follows the extreme refactoring principles established for the project.

## Original Structure

The original `auth.middleware.ts` file contained:

1. Three functions:
   - `authenticateJWT`: Authenticates JWT tokens
   - `authorizeRole`: Checks if user has required role
   - `authorizeOrganization`: Checks if user belongs to the specified organization

2. Global type declaration for extending Express Request interface

## New Structure

The refactored code is organized into a directory structure that separates concerns:

```
src/middleware/auth/
├── types.ts                        (10 lines)
├── authenticate-jwt.ts             (33 lines)
├── authorize-role.ts               (24 lines)
├── authorize-organization.ts       (23 lines)
└── index.ts                        (19 lines)
```

## Implementation Details

### Types (types.ts)

A central types file that contains the Express Request interface extension:

```typescript
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
```

### Authentication (authenticate-jwt.ts)

JWT authentication middleware has been isolated into its own file:

```typescript
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here') as AuthTokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
```

### Role Authorization (authorize-role.ts)

Role-based authorization middleware has been isolated into its own file:

```typescript
export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

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
```

### Organization Authorization (authorize-organization.ts)

Organization-based authorization middleware has been isolated into its own file:

```typescript
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
```

### Main Entry Point (index.ts)

The main entry point exports all the functions, maintaining backward compatibility:

```typescript
// Import types to ensure Express Request interface is extended
import './types';

// Export individual middleware functions
export { authenticateJWT } from './authenticate-jwt';
export { authorizeRole } from './authorize-role';
export { authorizeOrganization } from './authorize-organization';

// Default export for backward compatibility
import { authenticateJWT } from './authenticate-jwt';
import { authorizeRole } from './authorize-role';
import { authorizeOrganization } from './authorize-organization';

export default {
  authenticateJWT,
  authorizeRole,
  authorizeOrganization
};
```

## Benefits

1. **Improved Maintainability**: Each file has a single responsibility, making it easier to understand and modify.
2. **Better Organization**: Related functionality is grouped together, making it easier to navigate the codebase.
3. **Enhanced Testability**: Smaller, focused modules are easier to test in isolation.
4. **Reduced Cognitive Load**: Developers only need to understand a small part of the codebase at a time.
5. **Backward Compatibility**: The original API is preserved through the index.ts file.

## Conclusion

The refactoring of the Auth Middleware module has successfully transformed a file with multiple functions into a set of smaller, more focused files. This improves maintainability while preserving the original functionality and API.