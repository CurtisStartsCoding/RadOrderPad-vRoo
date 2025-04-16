/**
 * Types for connection service
 */

/**
 * Connection information
 */
export interface Connection {
  id: number;
  partnerOrgId: number;
  partnerOrgName: string;
  status: ConnectionStatus;
  isInitiator: boolean;
  initiatedBy: string | null;
  approvedBy: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Incoming connection request
 */
export interface IncomingRequest {
  id: number;
  initiatingOrgId: number;
  initiatingOrgName: string;
  initiatedBy: string | null;
  initiatorEmail: string | null;
  notes: string | null;
  createdAt: Date;
}

/**
 * Connection status
 */
export type ConnectionStatus = 'pending' | 'active' | 'rejected' | 'terminated';

/**
 * Response for listing connections
 */
export interface ListConnectionsResponse {
  connections: Connection[];
}

/**
 * Response for listing incoming requests
 */
export interface ListIncomingRequestsResponse {
  requests: IncomingRequest[];
}

/**
 * Response for connection operations
 */
export interface ConnectionOperationResponse {
  success: boolean;
  message: string;
  relationshipId: number;
  status?: ConnectionStatus;
}

/**
 * Parameters for requesting a connection
 */
export interface RequestConnectionParams {
  initiatingOrgId: number;
  targetOrgId: number;
  initiatingUserId: number;
  notes?: string;
}

/**
 * Parameters for approving a connection
 */
export interface ApproveConnectionParams {
  relationshipId: number;
  approvingUserId: number;
  approvingOrgId: number;
}

/**
 * Parameters for rejecting a connection
 */
export interface RejectConnectionParams {
  relationshipId: number;
  rejectingUserId: number;
  rejectingOrgId: number;
}

/**
 * Parameters for terminating a connection
 */
export interface TerminateConnectionParams {
  relationshipId: number;
  terminatingUserId: number;
  terminatingOrgId: number;
}