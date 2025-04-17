# Organization Relationship Linking

**Version:** 1.1 (Schema Reconciled)
**Date:** 2025-04-11

This document describes the process by which Referring Physician Groups and Radiology Groups establish connections within RadOrderPad, enabling the flow of orders between them.

---

## 1. Core Concept

-   Relationships are **bidirectional** but require initiation by one party and acceptance by the other.
-   An active relationship (`organization_relationships.status = 'active'`) is required for a referring group to send orders to a specific radiology group.
-   Relationships are managed via the `organization_relationships` table (Main DB).
-   Relationship status is affected by billing status (`purgatory_mode.md`).

## 2. Initiating a Connection Request

1.  **Access Connections Panel:** An `admin` user (either Referring or Radiology) logs in and navigates to the "Connections" or "Relationships" section of their dashboard.
2.  **Search for Organization:** User clicks "Establish New Relationship" or "Find Partner".
3.  **Search Interface:** A search interface allows finding other organizations registered on the platform. Searchable fields:
    *   Organization Name (`organizations.name`)
    *   NPI (`organizations.npi`)
    *   City/State (Optional)
    *   Organization Type (Filter for 'Radiology Group' if user is 'Referring Practice', and vice-versa).
4.  **Select and Request:** User finds the desired partner organization in the search results and clicks "Request Connection".
5.  **Backend Action:**
    *   A new row is created in `organization_relationships` with:
        *   `organization_id`: ID of the initiating organization.
        *   `related_organization_id`: ID of the target organization.
        *   `status`: 'pending'.
        *   `initiated_by_id`: User ID of the admin who clicked request.
    *   A notification (in-app and/or email via SES) is sent to the `admin` users of the *target* organization.

## 3. Responding to a Connection Request

1.  **Notification:** `Admin` users of the target organization receive a notification about the pending connection request.
2.  **Review Request:** Admin logs in and navigates to the "Connections" panel, where they see incoming requests with 'pending' status.
3.  **Decision:** Admin reviews the request and chooses to:
    *   **Approve:** Clicks "Approve Connection".
        *   Backend updates the corresponding `organization_relationships` row:
            *   `status`: 'active'.
            *   `approved_by_id`: User ID of the admin who approved.
            *   `updated_at`: Current timestamp.
        *   Notification sent back to the initiating organization's admin(s).
        *   Order flow is now enabled between these two organizations.
    *   **Reject:** Clicks "Reject Connection".
        *   Backend updates the `organization_relationships` row:
            *   `status`: 'rejected'.
            *   `approved_by_id`: User ID of the admin who rejected.
            *   `updated_at`: Current timestamp.
        *   Notification sent back to the initiating organization's admin(s).
        *   No order flow is possible. The initiating party might be able to re-request later.

## 4. Managing Connections

-   **Dashboard View:** The "Connections" panel lists all relationships for the organization, showing:
    *   Partner Organization Name
    *   Status ('active', 'pending', 'rejected', 'purgatory')
    *   Date Connected/Requested
    *   Option to Terminate an 'active' connection (sets status to 'terminated', disables order flow).

## 5. Purgatory Status Handling

-   If either organization involved in an 'active' relationship enters billing purgatory (`organizations.status = 'purgatory'`), the system should automatically update the corresponding `organization_relationships` status to 'purgatory'.
-   When an organization's status returns to 'active', the system should automatically update the relationship status back to 'active'.
-   Order flow is blocked while the relationship status is 'purgatory'.

---

## Data References

-   `organizations` (Main DB)
-   `users` (Main DB)
-   `organization_relationships` (Main DB)
-   `purgatory_events` (Main DB)
-   AWS SES (External)

