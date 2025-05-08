# Superadmin Documentation

This directory contains the consolidated documentation for the RadOrderPad superadmin functionality. The documentation has been organized to provide a clear and comprehensive guide to the superadmin capabilities available in the application.

## Documentation Structure

### 1. [Overview](./overview.md)

High-level overview of the superadmin role and capabilities, including:
- Purpose and access
- Key features and panels
- PHI access considerations
- Security requirements

### 2. [API Reference](./api-reference.md)

Detailed documentation of the superadmin API endpoints, including:
- Organization management endpoints
- User management endpoints
- System logs endpoints
- Prompt management endpoints

### 3. [Organization Management Guide](./organization-management.md)

Comprehensive guide for managing organizations as a superadmin, including:
- Viewing organization information
- Creating and updating organizations
- Managing organization status
- Handling organization verification
- Managing organization settings
- Viewing organization activity

### 4. [User Management Guide](./user-management.md)

Detailed guide for managing users as a superadmin, including:
- Viewing user information
- Creating and updating users
- Managing user status
- Resetting user passwords
- Viewing user activity

### 5. [System Monitoring Guide](./system-monitoring.md)

In-depth guide for monitoring system health and performance, including:
- System health and status monitoring
- Performance metrics and analytics
- Error and exception logs
- Audit logs for security and compliance
- User activity monitoring
- Resource usage tracking
- Alert management

### 6. [Prompt Management Guide](./prompt-management.md)

Comprehensive guide for managing LLM prompts, including:
- Creating and updating prompt templates
- Managing prompt assignments
- Testing prompts
- Analyzing prompt performance

## Superadmin Overview

The superadmin role provides system-wide administration capabilities for the RadOrderPad platform. Superadmins have access to:

1. **Platform Oversight:** Monitor the overall health, usage, and performance of the system using real-time and historical data.
2. **Organization Management:** Manage registered organizations (Referring & Radiology).
3. **User Management:** Manage all user accounts across the platform.
4. **Billing & Credits Administration:** Oversee billing events, manage credit balances, and handle payment issues.
5. **Support & Troubleshooting:** Assist users, investigate issues, and perform necessary administrative actions.
6. **Analytics & Reporting:** Access platform-wide data for business intelligence and operational insights.
7. **Compliance & Auditing:** Access logs and perform administrative reviews.

## Security Considerations

- Superadmin access should be restricted by IP address whitelisting
- Multi-Factor Authentication (MFA) is recommended for superadmin accounts
- All superadmin actions are logged for accountability and troubleshooting
- PHI access is strictly limited to what is absolutely necessary for specific tasks
- All superadmin access to PHI data must be logged in an immutable audit trail

## Related Documentation

- [Authentication](../authentication/README.md): Documentation for the authentication system
- [Admin Workflow](../admin-workflow/README.md): Documentation for the Admin Order Management and Finalization workflow

## Original Documentation

This consolidated documentation replaces the following original files:

1. `frontend-explanation\API_IMPLEMENTATION_GUIDE\superadmin_feature.yaml`
2. `frontend-explanation\API_IMPLEMENTATION_GUIDE\superadmin-logs.md`
3. `frontend-explanation\API_IMPLEMENTATION_GUIDE\superadmin-management.md`
4. `DOCS\super_admin.md`
5. `frontend-explanation\api-docs\tutorials\superadmin\organization-management.md`
6. `frontend-explanation\api-docs\tutorials\superadmin\user-management.md`
7. `frontend-explanation\api-docs\tutorials\superadmin\system-monitoring.md`
8. `frontend-explanation\api-docs\tutorials\superadmin\prompt-management.md`
9. `frontend-explanation\api-docs\openapi\paths\superadmin.yaml`

The original files have been archived for reference but should no longer be used or updated.