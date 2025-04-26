# Security Model

## Overview

RadOrderPad implements a comprehensive security model to protect sensitive data, ensure proper access control, and maintain compliance with healthcare regulations including HIPAA. This document outlines the key components of the security model.

## Authentication

### JWT-Based Authentication

RadOrderPad uses JSON Web Tokens (JWT) for authentication:

1. **Token Generation**: When a user logs in successfully, the system generates two tokens:
   - Access token: Short-lived token (1 hour) for API access
   - Refresh token: Longer-lived token (7 days) for obtaining new access tokens

2. **Token Structure**: Each JWT contains:
   - User ID
   - Organization ID
   - User role
   - Token expiration time
   - Token type (access or refresh)

3. **Token Verification**: All protected API endpoints verify the JWT:
   - Validates the token signature
   - Checks that the token has not expired
   - Extracts user information for authorization

```javascript
// Example JWT verification middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check token type and expiration
    if (decoded.type !== 'access' || Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    
    // Attach user info to request
    req.user = {
      id: decoded.userId,
      organizationId: decoded.organizationId,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};
```

### Refresh Token Mechanism

To maintain user sessions without requiring frequent logins:

1. When the access token expires, the client can request a new one using the refresh token
2. The system validates the refresh token and issues a new access token
3. For security, refresh tokens are stored in the database and can be revoked

### Trial User Authentication

Trial users have a separate authentication flow:

1. Trial users register with minimal information (email, password, name, specialty)
2. They receive a special JWT that identifies them as trial users
3. This token grants access only to trial-specific endpoints

## Authorization

### Role-Based Access Control (RBAC)

RadOrderPad implements RBAC with the following roles:

1. **admin_staff**: Administrative staff at referring organizations
   - Can access the admin order queue
   - Can update patient and insurance information
   - Can send orders to radiology

2. **physician**: Physicians at referring organizations
   - Can submit dictations for validation
   - Can sign and finalize orders
   - Can view their own orders

3. **admin_referring**: Administrators at referring organizations
   - Can manage organization profile and locations
   - Can manage users within their organization
   - Can manage connections with radiology organizations
   - Can view billing information and purchase credits

4. **super_admin**: System administrators
   - Can access all system functionality
   - Can manage all organizations and users
   - Can view system logs and metrics
   - Can manage prompt templates and assignments

5. **admin_radiology**: Administrators at radiology organizations
   - Can manage organization profile and locations
   - Can manage users within their organization
   - Can manage connections with referring organizations

6. **scheduler**: Schedulers at radiology organizations
   - Can view incoming orders
   - Can update order status
   - Can request additional information

7. **radiologist**: Radiologists at radiology organizations
   - Can view order details
   - Can provide results (future functionality)

8. **trial_physician**: Trial users with limited access
   - Can submit dictations for validation in trial mode
   - Cannot access PHI or create real orders

### Role Enforcement

Each API endpoint specifies which roles are authorized to access it:

```javascript
// Example role authorization middleware
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }
    
    next();
  };
};

// Example usage in routes
router.get('/admin/orders/queue', 
  authenticateJWT, 
  authorizeRole(['admin_staff', 'admin_referring']), 
  adminOrderController.getQueue
);
```

### Organization Boundaries

In addition to role-based access, the system enforces organization boundaries:

1. Users can only access data within their own organization
2. Connections between organizations create explicit permissions for specific data sharing
3. Database queries include organization ID filters to enforce these boundaries

```javascript
// Example of organization boundary enforcement
const getUsersInOrganization = async (req, res) => {
  try {
    const { organizationId } = req.user;
    
    const result = await queryMainDb(
      'SELECT id, first_name, last_name, email, role, is_active FROM users WHERE organization_id = $1',
      [organizationId]
    );
    
    return res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};
```

## Data Protection

### Encryption

RadOrderPad employs encryption at multiple levels:

1. **Data in Transit**: All API communications use HTTPS with TLS 1.2+
2. **Data at Rest**: Database encryption for sensitive fields
3. **Password Storage**: Passwords are hashed using bcrypt with appropriate salt rounds
4. **File Storage**: Files in S3 are encrypted using server-side encryption

### PHI Handling

The system implements strict controls for Protected Health Information (PHI):

1. **Dual Database Architecture**: PHI is stored in a separate database from non-PHI data
2. **Minimal PHI Access**: Only endpoints that require PHI have access to the PHI database
3. **PHI Logging**: All access to PHI is logged for audit purposes
4. **PHI Sanitization**: When logging validation attempts, PHI is sanitized before storage

## Audit and Monitoring

### Comprehensive Logging

The system maintains detailed logs for security monitoring and compliance:

1. **Validation Logs**: Track all validation attempts with sanitized inputs and outputs
2. **Credit Usage Logs**: Track all credit consumption for billing transparency
3. **Purgatory Events**: Track security-related events such as account suspensions
4. **System Logs**: Track general system activity for troubleshooting

### Superadmin Monitoring

Superadmins have access to specialized monitoring endpoints:

1. **Enhanced Validation Logs**: Detailed logs with advanced filtering
2. **Organization Management**: Monitor organization status and activity
3. **User Management**: Monitor user activity and status
4. **System Metrics**: Monitor system performance and usage

## Security Best Practices

When implementing new features or modifying existing ones, follow these security best practices:

1. **Input Validation**: Validate all user inputs to prevent injection attacks
2. **Parameterized Queries**: Use parameterized queries to prevent SQL injection
3. **Error Handling**: Implement proper error handling without exposing sensitive information
4. **Rate Limiting**: Implement rate limiting for sensitive endpoints
5. **Principle of Least Privilege**: Grant only the minimum necessary permissions
6. **Defense in Depth**: Implement multiple layers of security controls
7. **Regular Security Reviews**: Conduct regular security reviews of the codebase

## Conclusion

The RadOrderPad security model provides a robust framework for protecting sensitive data, enforcing proper access control, and maintaining regulatory compliance. By understanding and following this model, developers can ensure that new features and modifications maintain the system's security posture.