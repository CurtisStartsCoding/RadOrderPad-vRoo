/**
 * Service for managing connections between organizations
 */
declare class ConnectionService {
    /**
     * List connections for an organization
     * @param orgId Organization ID
     * @returns Promise with connections list
     */
    listConnections(orgId: number): Promise<any[]>;
    /**
     * List pending incoming connection requests
     * @param orgId Organization ID
     * @returns Promise with pending requests list
     */
    listIncomingRequests(orgId: number): Promise<any[]>;
    /**
     * Request a connection to another organization
     * @param initiatingOrgId Organization ID initiating the request
     * @param targetOrgId Target organization ID
     * @param initiatingUserId User ID initiating the request
     * @param notes Optional notes about the connection
     * @returns Promise with result
     */
    requestConnection(initiatingOrgId: number, targetOrgId: number, initiatingUserId: number, notes?: string): Promise<any>;
    /**
     * Approve a connection request
     * @param relationshipId Relationship ID
     * @param approvingUserId User ID approving the request
     * @param approvingOrgId Organization ID approving the request
     * @returns Promise with result
     */
    approveConnection(relationshipId: number, approvingUserId: number, approvingOrgId: number): Promise<any>;
    /**
     * Reject a connection request
     * @param relationshipId Relationship ID
     * @param rejectingUserId User ID rejecting the request
     * @param rejectingOrgId Organization ID rejecting the request
     * @returns Promise with result
     */
    rejectConnection(relationshipId: number, rejectingUserId: number, rejectingOrgId: number): Promise<any>;
    /**
     * Terminate an active connection
     * @param relationshipId Relationship ID
     * @param terminatingUserId User ID terminating the connection
     * @param terminatingOrgId Organization ID terminating the connection
     * @returns Promise with result
     */
    terminateConnection(relationshipId: number, terminatingUserId: number, terminatingOrgId: number): Promise<any>;
}
declare const _default: ConnectionService;
export default _default;
