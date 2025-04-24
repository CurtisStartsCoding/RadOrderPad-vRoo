/**
 * Notification services implementation
 */

// Type definitions
export interface AccountNotificationService {
  sendVerificationEmail(
    email: string,
    token: string,
    data: { firstName: string; organizationName: string }
  ): Promise<void>;
  
  sendInviteEmail(
    email: string,
    token: string,
    organizationName: string,
    inviterName: string
  ): Promise<void>;
  
  sendPasswordResetEmail(
    email: string,
    token: string
  ): Promise<void>;
}

export interface UserInviteNotificationService {
  sendInviteEmail(
    email: string,
    token: string,
    organizationName: string,
    inviterName: string,
    role: string
  ): Promise<void>;
}

export interface ConnectionNotificationService {
  sendConnectionRequest(
    email: string,
    requestingOrgName: string
  ): Promise<void>;
  sendConnectionApproved(
    email: string,
    approvedOrgName: string
  ): Promise<void>;
  sendConnectionRejected(
    email: string,
    rejectedOrgName: string
  ): Promise<void>;
  sendConnectionTerminated(
    email: string,
    partnerOrgName: string,
    terminatingOrgName: string
  ): Promise<void>;
}

export interface GeneralNotificationService {
  sendNotificationEmail(
    email: string,
    subject: string,
    message: string
  ): Promise<void>;
}

// Account-related notifications
export const accountNotifications: AccountNotificationService = {
  /**
   * Send a verification email to a newly registered user
   * @param email Email address of the user
   * @param token Verification token
   * @param data Additional data for the email template
   */
  async sendVerificationEmail(
    email: string,
    token: string,
    data: { firstName: string; organizationName: string }
  ): Promise<void> {
    console.log(`[MOCK] Sending verification email to ${email} with token ${token}`);
    console.log(`[MOCK] Email data:`, data);
    // In a real implementation, this would send an actual email
    return Promise.resolve();
  },
  
  /**
   * Send an invitation email to a user
   * @param email Email address to send the invitation to
   * @param token Invitation token
   * @param organizationName Name of the organization
   * @param inviterName Name of the user who sent the invitation
   */
  async sendInviteEmail(
    email: string,
    token: string,
    organizationName: string,
    inviterName: string
  ): Promise<void> {
    console.log(`[MOCK] Sending invite email to ${email} with token ${token}`);
    console.log(`[MOCK] Invited by ${inviterName} to join ${organizationName}`);
    // In a real implementation, this would send an actual email
    return Promise.resolve();
  },
  
  /**
   * Send a password reset email to a user
   * @param email Email address to send the reset link to
   * @param token Reset token
   */
  async sendPasswordResetEmail(
    email: string,
    token: string
  ): Promise<void> {
    console.log(`[MOCK] Sending password reset email to ${email} with token ${token}`);
    // In a real implementation, this would send an actual email
    return Promise.resolve();
  }
};

// User invitation notifications
export const userNotifications: UserInviteNotificationService = {
  /**
   * Send an invitation email to a new user
   * @param email Email address of the invited user
   * @param token Invitation token
   * @param organizationName Name of the organization
   * @param inviterName Name of the person who sent the invitation
   * @param role Role the user is being invited to
   */
  async sendInviteEmail(
    email: string,
    token: string,
    organizationName: string,
    inviterName: string,
    role: string
  ): Promise<void> {
    console.log(`[MOCK] Sending invite email to ${email} with token ${token}`);
    console.log(`[MOCK] Invited by ${inviterName} to join ${organizationName} as ${role}`);
    // In a real implementation, this would send an actual email
    return Promise.resolve();
  }
};

// Connection-related notifications
export const connectionNotifications: ConnectionNotificationService = {
  /**
   * Send a connection request notification
   * @param email Email address of the target organization admin
   * @param requestingOrgName Name of the organization requesting the connection
   */
  async sendConnectionRequest(
    email: string,
    requestingOrgName: string
  ): Promise<void> {
    console.log(`[MOCK] Sending connection request notification to ${email}`);
    console.log(`[MOCK] Request from ${requestingOrgName}`);
    // In a real implementation, this would send an actual email
    return Promise.resolve();
  },

  /**
   * Send a connection approval notification
   * @param email Email address of the requesting organization admin
   * @param approvedOrgName Name of the organization that requested the connection
   */
  async sendConnectionApproved(
    email: string,
    approvedOrgName: string
  ): Promise<void> {
    console.log(`[MOCK] Sending connection approval notification to ${email}`);
    console.log(`[MOCK] Connection with ${approvedOrgName} has been approved`);
    // In a real implementation, this would send an actual email
    return Promise.resolve();
  },

  /**
   * Send a connection rejection notification
   * @param email Email address of the requesting organization admin
   * @param rejectedOrgName Name of the organization that requested the connection
   */
  async sendConnectionRejected(
    email: string,
    rejectedOrgName: string
  ): Promise<void> {
    console.log(`[MOCK] Sending connection rejection notification to ${email}`);
    console.log(`[MOCK] Connection with ${rejectedOrgName} has been rejected`);
    // In a real implementation, this would send an actual email
    return Promise.resolve();
  },

  /**
   * Send a connection termination notification
   * @param email Email address of the partner organization admin
   * @param partnerOrgName Name of the partner organization
   * @param terminatingOrgName Name of the organization terminating the connection
   */
  async sendConnectionTerminated(
    email: string,
    partnerOrgName: string,
    terminatingOrgName: string
  ): Promise<void> {
    console.log(`[MOCK] Sending connection termination notification to ${email}`);
    console.log(`[MOCK] Connection with ${partnerOrgName} has been terminated by ${terminatingOrgName}`);
    // In a real implementation, this would send an actual email
    return Promise.resolve();
  }
};

// General notifications
export const generalNotifications: GeneralNotificationService = {
  /**
   * Send a general notification email
   * @param email Email address of the recipient
   * @param subject Email subject
   * @param message Email message
   */
  async sendNotificationEmail(
    email: string,
    subject: string,
    message: string
  ): Promise<void> {
    console.log(`[MOCK] Sending notification to ${email}`);
    console.log(`[MOCK] Subject: ${subject}`);
    console.log(`[MOCK] Message: ${message}`);
    // In a real implementation, this would send an actual email
    return Promise.resolve();
  }
};