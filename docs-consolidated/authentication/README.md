# Authentication Documentation

This directory contains the consolidated documentation for the RadOrderPad authentication system. The documentation has been organized to provide a clear and comprehensive guide to the authentication mechanisms available in the application.

## Documentation Structure

### 1. [API Reference](./api-reference.md)

Detailed documentation of the authentication API endpoints, including:
- Registration endpoints
- Login endpoints
- Token refresh endpoints
- Password reset endpoints

### 2. [Regular Authentication Guide](./regular-auth-guide.md)

Comprehensive guide for implementing standard authentication flow, including:
- Login process
- Token management
- Authenticated requests
- Token refresh
- Logout

### 3. [Trial Authentication Guide](./trial-auth-guide.md)

Detailed guide for implementing trial user authentication, including:
- Trial registration
- Trial-specific limitations
- Trial status management
- Converting to full accounts

## Authentication Overview

RadOrderPad uses JSON Web Tokens (JWT) for authentication. The system supports two main authentication flows:

1. **Regular Authentication**: For registered users with full access to the system based on their role.
2. **Trial Authentication**: For trial users with limited access and functionality.

Both authentication methods use the same underlying JWT mechanism but with different token scopes and permissions.

## Security Considerations

- All authentication endpoints use HTTPS
- Passwords are hashed using bcrypt
- JWT tokens have a limited expiration time
- Refresh tokens are used for obtaining new access tokens
- Rate limiting is implemented for failed login attempts
- CAPTCHA verification is required for registration

## Related Documentation

- [Trial Feature](../features/trial-feature.md): Comprehensive guide to the Physician Trial Sandbox feature
- [Admin Workflow](../admin-workflow/README.md): Documentation for the Admin Order Management and Finalization workflow

## Original Documentation

This consolidated documentation replaces the following original files:

1. `frontend-explanation\API_IMPLEMENTATION_GUIDE\authentication.md`
2. `frontend-explanation\api-docs\tutorials\authentication\regular-auth.md`
3. `frontend-explanation\api-docs\tutorials\authentication\trial-auth.md`

The original files have been archived for reference but should no longer be used or updated.