# Purgatory Mode (Billing Suspension)

**Version:** 1.2 (Credit Consumption Refactoring)
**Date:** 2025-04-14

This document describes how billing-related account suspensions ("Purgatory Mode") are triggered, enforced, and resolved within RadOrderPad.

---

## 1. Purpose

-   To temporarily suspend service access and order flow for organizations with unresolved billing issues (e.g., failed subscription payments, unpaid invoices).
-   To provide clear feedback to affected users and administrators.
-   To ensure platform revenue integrity.

## 2. Triggers

An organization enters Purgatory Mode when:

1.  **Failed Payment:** A Stripe webhook (e.g., `invoice.payment_failed`, `customer.subscription.updated` with status `past_due`) indicates a failed recurring payment for a Referring Group's subscription or a failed invoice payment for a Radiology Group's usage charges, potentially after a defined grace period or number of retry attempts configured in Stripe.
2.  **Manual Suspension:** A `super_admin` manually places an organization on hold via the Super Admin Panel for administrative reasons (e.g., prolonged non-payment, violation of terms).

## 3. System Actions Upon Entering Purgatory

When an organization's status is set to `purgatory`:

1.  **Update Organization Status:** The `organizations.status` field (Main DB) is updated to `'purgatory'`.
2.  **Log Event:** A record is created in the `purgatory_events` table (Main DB) detailing the reason, timestamp, and triggering user/event.
3.  **Update Relationship Status:** All active relationships involving the suspended organization in the `organization_relationships` table (Main DB) have their `status` updated to `'purgatory'`.
4.  **Block Order Flow:**
    *   **Referring Group Suspended:** Cannot send new orders to radiology (`pending_admin` -> `pending_radiology` transition blocked). Validation attempts are still allowed, but orders cannot be sent to radiology. Existing orders already sent (`pending_radiology`) may or may not be processed by the radiology group depending on their policies.
    *   **Radiology Group Suspended:** Referring groups cannot send new orders *to this specific* radiology group (the relationship is in purgatory). Orders cannot be finalized/sent if this is the only active radiology partner for the referring group.
5.  **Disable Core Functionality:** Access to features requiring an active billing status (e.g., sending orders to radiology for referring groups) is disabled for users within the suspended organization. Login might still be permitted to allow admins to resolve billing issues.
6.  **Notify Admins:** Automated email notifications (via SES) are sent to the `admin` users of the suspended organization, informing them of the account hold and directing them to resolve the billing issue. A notification might also be sent to the partner organization admin if a relationship is affected.

## 4. User Interface Feedback

-   Users (especially `admin` roles) within the suspended organization see a persistent warning banner in the UI upon login (e.g., "Your organization's account is currently on hold due to a billing issue. Please update your payment information or contact support to restore full access.").
-   Action buttons related to suspended functionality (e.g., "Send to Radiology") are disabled with tooltips explaining the reason.
-   The "Connections" panel clearly shows relationships affected by purgatory status.

## 5. Resolution

An organization exits Purgatory Mode when:

1.  **Successful Payment:** A Stripe webhook indicates a previously failed payment has now succeeded (e.g., `invoice.payment_succeeded`).
2.  **Manual Reactivation:** A `super_admin` manually reactivates the organization via the Super Admin Panel.

## 6. System Actions Upon Exiting Purgatory

When an organization's status is set back to `active`:

1.  **Update Organization Status:** `organizations.status` is updated to `'active'`.
2.  **Log Event:** The corresponding record in `purgatory_events` is updated (e.g., `status = 'resolved'`, `resolved_at = now()`).
3.  **Update Relationship Status:** All relationships involving the reactivated organization in `organization_relationships` that were previously set to `'purgatory'` due to this suspension are updated back to `'active'`.
4.  **Re-enable Order Flow & Functionality:** Backend checks allow previously blocked actions (sending orders to radiology) to proceed.
5.  **Notify Admins:** Confirmation email may be sent to admins. UI warning banners are removed.

---

## Data References

-   `organizations` (Main DB)
-   `organization_relationships` (Main DB)
-   `purgatory_events` (Main DB)
-   `users` (Main DB)
-   Stripe API & Webhooks (External)
-   AWS SES (External)
-   `notification_service.md`
