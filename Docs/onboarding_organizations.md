# Organization Onboarding Workflow

**Version:** 1.2 (Standardized Admin Roles)
**Date:** 2025-04-11

This document describes the self-service onboarding process for both Referring Physician Groups and Radiology Groups, reflecting the reconciled schema including multi-location support and standardized admin roles.

---

## 1. Initial Sign-Up (Admin User)

1.  **Access Portal:** A prospective admin user (e.g., office manager, lead physician, radiology manager) navigates to the RadOrderPad sign-up page.
2.  **Registration Form:** User completes a registration form:
    *   Organization Name (`organizations.name`)
    *   Organization Type (`organizations.type` - selected from 'Referring Practice', 'Radiology Group')
    *   Group NPI (Optional but recommended) (`organizations.npi`)
    *   Primary Address (`organizations.address_line1`, `city`, `state`, `zip_code`)
    *   Primary Contact Email (`organizations.contact_email` AND `users.email` for the admin)
    *   Primary Contact Phone (`organizations.phone_number`)
    *   Admin User First Name (`users.first_name`)
    *   Admin User Last Name (`users.last_name`)
    *   Password (for the admin user account)
3.  **Billing Information:** User enters credit card details (processed via Stripe). A Stripe customer record is created, and the ID is stored (`organizations.billing_id`). For Radiology Groups, this card is used for per-order charges; for Referring Groups, it's used for the subscription tier.
4.  **Account Creation:** Upon submission:
    *   An `organizations` record is created.
    *   A `users` record is created for the registering user. The `role` is set to **`admin_referring`** if `organizations.type` is 'Referring Practice', or **`admin_radiology`** if 'Radiology Group'. The user is linked to the new `organization_id`.
    *   The user's email is marked as pending verification (`users.email_verified = false`).
    *   An `email_verification_tokens` record is created, and a verification email is sent via SES (`notification_service.md`).
5.  **Email Verification:** User clicks the link in the verification email. The backend verifies the token, marks `users.email_verified = true`, and potentially logs the user in.

## 2. Admin Dashboard & Initial Setup

1.  **Login:** The admin user (`admin_referring` or `admin_radiology`) logs in.
2.  **Dashboard Access:** Admin is directed to their organization's dashboard.
3.  **Add Locations (Physicians and Radiology Groups):**
    *   Admin navigates to a "Locations" or "Facilities" management section.
    *   Clicks "Add Location".
    *   Enters details for each physical site: Name, Address, Phone, etc. (`locations` table).
    *   This step is crucial for organizations with multiple sites where orders might originate from or be directed to specific facilities. Referring groups might only have one primary location initially.
4.  **User Management Section:** Admin navigates to the user management section.
5.  **Adding Users (CSV Import):**
    *   Admin downloads a CSV template file.
    *   Template columns: `first_name`, `last_name`, `email`, `role` (e.g., 'physician', 'admin_staff', 'scheduler', 'radiologist'), `npi` (optional), `phone_number` (optional), `specialty` (optional), `primary_location_name` (optional - must match a name from the `locations` table). **Note:** Admins cannot invite other users with `admin_referring` or `admin_radiology` roles via this method.
    *   Admin fills the CSV.
    *   Admin uploads the completed CSV file.
6.  **User Invitation Processing:**
    *   Backend parses the CSV.
    *   For each row, it creates a `user_invitations` record with a unique, expiring token.
    *   An invitation email (via SES) is sent to each listed email address containing an activation link incorporating the token.
7.  **User Activation:**
    *   Invited user clicks the link in their email.
    *   They are directed to a page to set their password.
    *   Upon password creation:
        *   A `users` record is created using the details from the `user_invitations` record.
        *   If `primary_location_name` was provided and valid, the corresponding `locations.id` is looked up and stored in `users.primary_location_id`.
        *   `users.password_hash` is set.
        *   `users.email_verified` is set to `true`.
        *   `users.invitation_token` is marked as used or cleared.
        *   `user_invitations.status` is updated to 'accepted'.
    *   The new user can now log in.
8.  **Manual User Addition (Optional):** Admin may also have an option to add users one by one via a form (including assigning a primary location), triggering a similar invitation flow.
9.  **Admin Monitoring:** Admin dashboard shows the status of invited users (pending, accepted). Admin can resend invitations or deactivate users.

---

## 3. Verification Scope (V1)

- **Email Verification:** Mandatory for all users via tokenized links.
- **NPI/Tax ID Verification:** The system collects optional NPI (users/orgs) and Tax ID (orgs) information. However, **active verification** of these numbers against external databases (e.g., NPPES) is **out of scope for Version 1.0**. This can be added as a future enhancement.

---

## Data References

-   `organizations` (Main DB)
-   `locations` (Main DB)
-   `users` (Main DB)
-   `user_invitations` (Main DB)
-   `email_verification_tokens` (Main DB)
-   Stripe API (External)
-   AWS SES (External)
-   `notification_service.md`