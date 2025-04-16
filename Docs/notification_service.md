# Notification Service

**Version:** 1.0
**Date:** 2025-04-11

This document specifies the system responsible for sending transactional emails to users via AWS Simple Email Service (SES).

---

## 1. Purpose

-   To reliably deliver essential, non-marketing emails triggered by specific application events or user actions.
-   To manage email templates and content centrally.

## 2. Service Architecture

-   A dedicated backend module or service (e.g., `NotificationService`).
-   Uses the AWS SDK (Node.js or Python) to interact with the SES API (`SendEmail` or `SendTemplatedEmail` operations).
-   Does **not** handle bulk marketing emails.

## 3. Triggering Events & Email Types

The Notification Service is invoked by other backend services upon events such as:

-   **User Invitation:** (`onboarding_organizations.md`)
    -   **Template:** `InviteEmail`
    -   **Recipient:** Invited user's email address.
    -   **Content:** Welcome message, activation link (with invitation token).
-   **Email Verification:** (`authentication_authorization.md`)
    -   **Template:** `VerifyEmail`
    -   **Recipient:** Registering user's email address.
    -   **Content:** Request to verify email, verification link (with verification token).
-   **Password Reset Request:** (`authentication_authorization.md`)
    -   **Template:** `ResetPasswordRequest`
    -   **Recipient:** User's registered email address.
    *   **Content:** Confirmation of request, password reset link (with reset token).
-   **Password Reset Confirmation:** (Optional)
    -   **Template:** `ResetPasswordConfirm`
    -   **Recipient:** User's registered email address.
    -   **Content:** Confirmation that the password has been changed.
-   **Low Credit Warning:** (`billing_credits.md`)
    -   **Template:** `CreditWarning`
    -   **Recipient:** Organization admin(s).
    *   **Content:** Alert about low validation credit balance, remaining credits, link to top-up/billing page.
-   **Account Suspension (Purgatory):** (`purgatory_mode.md`)
    -   **Template:** `PurgatoryAlert`
    -   **Recipient:** Organization admin(s).
    -   **Content:** Notification of account hold due to billing issues, instructions to resolve.
-   **Account Reactivation:** (Optional)
    -   **Template:** `ReactivationNotice`
    -   **Recipient:** Organization admin(s).
    -   **Content:** Confirmation that the account hold has been lifted.
-   **Connection Request Received:** (`relationship_linking.md`)
    -   **Template:** `OrgLinkRequest`
    -   **Recipient:** Target organization admin(s).
    *   **Content:** Notification of a new connection request from another organization, link to the connections panel.
-   **Connection Request Accepted/Rejected:** (`relationship_linking.md`)
    -   **Template:** `OrgLinkResponse`
    -   **Recipient:** Initiating organization admin(s).
    -   **Content:** Notification that their connection request was approved or rejected.

## 4. Email Templates

-   Templates should be stored in a manageable way (e.g., simple text/HTML files, database table, or using SES Templates feature).
-   Use placeholders for dynamic content (e.g., `{{userName}}`, `{{verificationLink}}`, `{{creditBalance}}`).
-   Ensure templates are professional, clearly branded, and include necessary footers (e.g., organization info, unsubscribe link *only if applicable for non-transactional*, which these mostly are).

## 5. SES Integration Details

-   **Configuration:** AWS credentials with `ses:SendEmail` permissions configured for the backend service/Lambda function. SES sending region configured.
-   **Sender Identity:** Use a verified domain identity in SES for sending emails (improves deliverability). Set up DKIM and SPF records for the domain.
-   **Sending Method:** Use the AWS SDK's `SendEmailCommand` (or equivalent). Construct the `Destination`, `Message` (Subject, Body - HTML and Text parts), and `Source` parameters.
-   **Rate Limiting:** Be aware of SES sending quotas. Implement retries with backoff for transient errors if needed, although SES is generally reliable. Request quota increases if necessary.
-   **Bounce/Complaint Handling (Optional but Recommended):** Configure SES event notifications (via SNS) to handle bounces and complaints, allowing the system to mark emails as invalid or suppress future sending to problematic addresses.

## 6. Error Handling & Logging

-   Log successful email sending attempts (e.g., "Password reset email sent to user X").
-   Log any errors encountered during the SES API call (e.g., "Failed to send verification email to user Y: SES Error Code Z").
-   Implement appropriate error handling in the calling services (e.g., should failure to send an email block the user action?).

---

## Data References

-   `users` (Main DB) (Recipient emails, names)
-   `organizations` (Main DB) (Admin emails, org names)
-   `email_verification_tokens` (Main DB) (Token for link)
-   `password_reset_tokens` (Main DB) (Token for link)
-   `user_invitations` (Main DB) (Token for link)
-   AWS SES API (External)