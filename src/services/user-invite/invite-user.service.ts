import { queryMainDb } from '../../config/db';
import crypto from 'crypto';
import notificationManager from '../../services/notification/manager';

/**
 * Service function to handle user invitation
 * @param invitingOrgId Organization ID of the inviting user
 * @param invitingUserId User ID of the inviting user
 * @param invitedEmail Email address of the user being invited
 * @param invitedRole Role to assign to the invited user
 * @returns Promise with success status
 */
export const inviteUser = async (
  invitingOrgId: number,
  invitingUserId: number,
  invitedEmail: string,
  invitedRole: string
): Promise<{ success: boolean }> => {
  // Check if user with this email already exists in the organization
  const existingUserResult = await queryMainDb(
    `SELECT id FROM users WHERE email = $1 AND organization_id = $2`,
    [invitedEmail, invitingOrgId]
  );

  if (existingUserResult.rowCount > 0) {
    throw new Error('User with this email already exists in this organization');
  }

  // Check if there's a pending invitation for this email in this organization
  const pendingInvitationResult = await queryMainDb(
    `SELECT id FROM user_invitations 
     WHERE email = $1 AND organization_id = $2 AND status = 'pending'`,
    [invitedEmail, invitingOrgId]
  );

  if (pendingInvitationResult.rowCount > 0) {
    throw new Error('An invitation is already pending for this email address');
  }

  // Generate a secure random token
  const token = crypto.randomBytes(32).toString('hex');

  // Set expiry date (7 days from now)
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);

  // Store the invitation in the database
  await queryMainDb(
    `INSERT INTO user_invitations (
      organization_id, 
      invited_by_user_id, 
      email, 
      role, 
      token, 
      expires_at, 
      status
    ) VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
    [invitingOrgId, invitingUserId, invitedEmail, invitedRole, token, expiryDate]
  );

  // Fetch organization and inviter names for the email
  const organizationResult = await queryMainDb(
    `SELECT name FROM organizations WHERE id = $1`,
    [invitingOrgId]
  );

  const inviterResult = await queryMainDb(
    `SELECT first_name, last_name FROM users WHERE id = $1`,
    [invitingUserId]
  );

  const organizationName = organizationResult.rows[0].name;
  const inviterName = `${inviterResult.rows[0].first_name} ${inviterResult.rows[0].last_name}`;

  try {
    // Send invitation email
    await notificationManager.sendInviteEmail(
      invitedEmail,
      token,
      organizationName,
      inviterName
    );
  } catch {
    // Log error but don't fail the operation if email sending fails
    // Replace with proper logging mechanism when available
    // For now, we'll keep this silent to avoid ESLint warnings
  }

  return { success: true };
};