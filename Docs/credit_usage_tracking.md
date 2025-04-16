# Credit Usage Tracking

**Version:** 1.2 (Credit Consumption Refactoring)
**Date:** 2025-04-14

This document details how validation credit consumption is logged and how balances are managed for Referring Physician Groups.

---

## 1. Credit Consumption Triggers

A validation credit is consumed, and a log entry is created, when:

1. An `admin_staff` user successfully sends a finalized order to radiology via `POST /api/admin/orders/{orderId}/send-to-radiology`.

*(Note: Failed API calls to the backend or internal errors should ideally NOT consume a credit.)*

## 2. Logging Mechanism

-   **Table:** `credit_usage_logs` (in `radorder_main` database).
-   **Trigger Point:** Recorded by the backend service handling the `/api/admin/orders/{orderId}/send-to-radiology` request *after* confirming the order is valid and ready to be sent to radiology.
-   **Log Entry Fields:**
    *   `id`: Primary key.
    *   `organization_id`: ID of the referring group consuming the credit.
    *   `user_id`: ID of the admin staff user performing the action.
    *   `order_id`: Logical FK to the `orders.id` (PHI DB) being sent to radiology.
    *   `tokens_burned`: Number of credits consumed (typically `1`).
    *   `action_type`: Type of action ('order_submitted').
    *   `created_at`: Timestamp of the consumption event.

## 3. Balance Management

-   **Storage:** The current available credit balance for an organization is stored directly on the `organizations` table in the `credit_balance` column (Main DB).
-   **Decrement:** When a credit is consumed (and logged in `credit_usage_logs`), the backend must atomically decrement the `organizations.credit_balance` for the corresponding `organization_id`. This should be done carefully to avoid race conditions (e.g., using `UPDATE organizations SET credit_balance = credit_balance - 1 WHERE id = ? AND credit_balance > 0`).
-   **Increment (Replenishment/Top-Up):**
    *   **Subscription Renewal:** A scheduled job or Stripe webhook handler (`invoice.payment_succeeded` for subscriptions) resets/adds the monthly credit bundle amount to `organizations.credit_balance` at the start of the billing cycle.
    *   **Manual Top-Up:** When an admin purchases a credit bundle via Stripe, a webhook handler (`checkout.session.completed`) updates `organizations.credit_balance` by adding the purchased amount. Logged in `billing_events`.
    *   **Manual Grant:** A `super_admin` can manually adjust the `credit_balance` via the Super Admin Panel. Logged in `billing_events`.

## 4. Preventing Negative Balance / Service Interruption

-   **Check Before Consumption:** Before processing an order submission request (`POST /api/admin/orders/{orderId}/send-to-radiology`) that consumes a credit, the backend must check if `organizations.credit_balance > 0`.
-   **Action on Zero Balance:** If `credit_balance <= 0`:
    *   The order submission attempt is rejected with an appropriate error message (e.g., "Insufficient credits to send order to radiology. Please contact your administrator.").
    *   No credit is logged, and the order status remains unchanged. The API should return an error (e.g., 402 Payment Required).

## 5. Visibility

-   **Admin Dashboard:** Displays the current `organizations.credit_balance`. May show a summary of recent usage based on `credit_usage_logs`. Provides interface for purchasing top-ups.
-   **Super Admin Panel:** Allows viewing credit balances and detailed `credit_usage_logs` for any organization. Allows manual balance adjustments.

---

## Data References

-   `organizations` (Main DB)
-   `users` (Main DB)
-   `credit_usage_logs` (Main DB)
-   `billing_events` (Main DB)
-   `orders` (PHI DB) (Logical FK)
-   `BillingEngine` / Stripe Webhooks (Service)
