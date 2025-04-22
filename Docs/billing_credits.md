# Billing & Credits System

**Version:** 1.3 (Added Radiology Usage Reporting)
**Date:** 2025-04-21

This document outlines the billing structure, credit system, and payment handling for RadOrderPad, managed primarily through Stripe integration.

---

## 1. Pricing Model

### 1.1. Referring Physician Groups (`organizations.type = 'referring_practice'`)

-   **Model:** Tiered Monthly Subscription based on the number of active `physician` role users within the organization.
-   **Tiers (Example):**
    *   **Tier 1:** 1–5 Physicians - Base monthly fee (e.g., $X/month)
    *   **Tier 2:** 6–15 Physicians - Mid monthly fee (e.g., $Y/month)
    *   **Tier 3:** 16+ Physicians - Large monthly fee (e.g., $Z/month)
-   **Included:** Each tier includes a monthly bundle of order submission credits (e.g., Tier 1 includes 500 credits/month).
-   **Overage:** Credits used beyond the included bundle may be charged per credit (e.g., $0.10/credit) or require purchasing top-up packs. (To be finalized).
-   **Billing Cycle:** Charged monthly via Stripe Subscriptions to the credit card on file (`organizations.billing_id`).

### 1.2. Radiology Groups (`organizations.type = 'radiology_group'`)

-   **Model:** Pay-Per-Order received.
-   **Rates (Example):**
    *   **Standard Order:** $2.00 per order (e.g., X-Ray, Ultrasound - identified by CPT code category/modality).
    *   **Advanced Imaging:** $7.00 per order (e.g., MRI, CT, PET, Nuclear Medicine).
-   **Billing Cycle:** Usage is tracked throughout the month. Charged monthly via Stripe Invoicing (or direct charges) to the credit card on file based on the volume and type of orders received during the previous billing period.

## 2. Order Submission Credit System (Referring Groups)

-   **Unit:** Order Submission Credit.
-   **Consumption:**
    *   1 credit consumed each time an admin staff successfully sends a finalized order to radiology via `POST /api/admin/orders/{orderId}/send-to-radiology`.
-   **Tracking:**
    *   Each consumption event creates a record in `credit_usage_logs` (Main DB), linked to the user, organization, and order (`orderId`).
    *   The organization's current balance is stored in `organizations.credit_balance` (Main DB).
-   **Replenishment:**
    *   Credit balance is reset/topped-up to the tier's included amount at the start of each monthly billing cycle (handled via Stripe subscription webhooks or scheduled job).
    *   Admins can purchase additional credit bundles ("Top-Ups") via the UI (triggers Stripe charge).
-   **Visibility:** Admins can view current credit balance and usage history on their dashboard. Low credit warnings are displayed/emailed (`notification_service.md`).

## 3. Stripe Integration

-   **Customer Creation:** When an organization signs up, create a Stripe Customer object and store the ID (`organizations.billing_id`).
-   **Payment Methods:** Securely collect and associate payment methods (credit cards) with the Stripe Customer using Stripe Elements or Checkout.
-   **Referring Group Subscriptions:** Use Stripe Subscriptions to manage tiered monthly billing. Set up products and prices in Stripe corresponding to the tiers.
-   **Radiology Group Billing:** Use Stripe Invoicing based on monthly usage tracked in RadOrderPad. The system automatically:
    *   Counts orders received by each radiology group within a specified date range
    *   Categorizes orders as standard or advanced imaging based on modality/CPT code
    *   Creates Stripe invoice items for each category with appropriate pricing
    *   Records billing events in the database
-   **Credit Top-Ups:** Use Stripe Checkout or Charges API for ad-hoc credit bundle purchases.
-   **Webhooks:** Implement webhook handlers (securely verified) for critical Stripe events:
    *   `invoice.payment_succeeded`: Update billing status, potentially replenish credits for referring groups.
    *   `invoice.payment_failed`: Trigger warnings, potentially initiate `purgatory_mode.md`.
    *   `customer.subscription.updated`: Handle tier changes.
    *   `checkout.session.completed`: Confirm successful top-up purchase, update `organizations.credit_balance`.
-   **Logging:** Record key billing actions (charges, top-ups, failures, usage reporting) in the `billing_events` table (Main DB).
-   **Usage Reporting:** Scheduled job or manual trigger to report radiology order usage to Stripe for billing purposes. See `implementation/radiology-usage-reporting.md` for details.

## 4. Payment Failure & Purgatory Mode

-   If a recurring subscription payment fails for a Referring Group, or if a Radiology Group's monthly invoice fails:
    1.  Stripe webhook notifies the backend.
    2.  System sends alerts to organization admins (`notification_service.md`).
    3.  After a grace period or repeated failures, the organization's status is set to `purgatory` (`organizations.status`, `purgatory_events`).
    4.  Order flow and validation capabilities are suspended as defined in `purgatory_mode.md`.
    5.  Successful payment updates the status back to `active`.

---

## Data References

-   `organizations` (Main DB)
-   `users` (Main DB)
-   `credit_usage_logs` (Main DB)
-   `billing_events` (Main DB)
-   `purgatory_events` (Main DB)
-   `orders` (PHI DB) (For Radiology Group usage tracking)
-   Stripe API & Webhooks (External)
-   `notification_service.md`
-   `purgatory_mode.md`
