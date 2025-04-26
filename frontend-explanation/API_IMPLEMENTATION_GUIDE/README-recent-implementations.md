# Recent API Implementations and Fixes

This document provides an index to detailed documentation about recent implementations and fixes to the RadOrderPad API.

## Connection Management Fixes

The connection management endpoints have been fixed and are now working correctly. These endpoints allow organizations to manage connections with other organizations.

[View Connection Management Fixes](./README-connection-fixes.md)

Key fixes include:
- Connection Approval Endpoint Fix (`POST /api/connections/{relationshipId}/approve`)
- Connection Rejection Endpoint Fix (`POST /api/connections/{relationshipId}/reject`)
- Connection Termination Endpoint Fix (`DELETE /api/connections/{relationshipId}`)

## User Management Implementations

Several user management endpoints have been implemented to allow users and administrators to manage user profiles.

[View User Management Implementations](./README-user-management.md)

Key implementations include:
- User Profile Update Endpoint (`PUT /api/users/me`)
- User Update by ID Endpoint (`PUT /api/users/{userId}`)
- User Deactivation Endpoint (`DELETE /api/users/{userId}`)

## File Upload Implementations

The file upload endpoints have been implemented to enable secure file uploads to AWS S3 using the presigned URL pattern.

[View File Upload Implementations](./README-file-upload.md)

Key implementations include:
- Presigned URL Endpoint (`POST /api/uploads/presigned-url`)
- Confirm Upload Endpoint (`POST /api/uploads/confirm`)
- Download URL Endpoint (`GET /api/uploads/{documentId}/download-url`)

## Organization Profile Update Implementation

The organization profile update endpoint has been implemented to allow organization administrators to update their organization's profile information.

[View Organization Profile Update Implementation](./README-organization-profile.md)

Key implementation:
- Organization Profile Update Endpoint (`PUT /api/organizations/mine`)

## Super Admin Logs Implementation

The Super Admin logs endpoints have been implemented to provide comprehensive visibility into system activities.

[View Super Admin Logs Implementation](./superadmin-logs.md)

Key implementations include:
- Basic LLM Validation Logs Endpoint (`GET /api/superadmin/logs/validation`)
- Enhanced LLM Validation Logs Endpoint (`GET /api/superadmin/logs/validation/enhanced`)
- Credit Usage Logs Endpoint (`GET /api/superadmin/logs/credits`)
- Purgatory Events Endpoint (`GET /api/superadmin/logs/purgatory`)

## Trial Feature Implementation

The Physician Trial Sandbox feature has been implemented to allow physicians to register for a limited trial account focused solely on testing the dictation-validation workflow.

[View Trial Feature Implementation](./trial_feature.md)

Key implementations include:
- Trial Registration Endpoint (`POST /api/auth/trial/register`)
- Trial Login Endpoint (`POST /api/auth/trial/login`)
- Trial Validation Endpoint (`POST /api/orders/validate/trial`)

## Admin Finalization "Send to Radiology" Fix

The "Send to Radiology" endpoint has been fixed to properly handle database connections and transactions.

[View Admin Finalization API Guide](./admin-finalization-api-guide.md)

Key fix:
- Send to Radiology Endpoint (`POST /api/admin/orders/{orderId}/send-to-radiology-fixed`)