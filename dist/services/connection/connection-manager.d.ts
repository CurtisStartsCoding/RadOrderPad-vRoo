import { Connection, IncomingRequest, ConnectionOperationResponse, RequestConnectionParams, ApproveConnectionParams, RejectConnectionParams, TerminateConnectionParams } from './types';
/**
 * Facade for connection services
 */
declare class ConnectionManager {
    /**
     * List connections for an organization
     * @param orgId Organization ID
     * @returns Promise with connections list
     */
    listConnections(orgId: number): Promise<Connection[]>;
    /**
     * List pending incoming connection requests
     * @param orgId Organization ID
     * @returns Promise with pending requests list
     */
    listIncomingRequests(orgId: number): Promise<IncomingRequest[]>;
    /**
     * Request a connection to another organization
     * @param params Request connection parameters
     * @returns Promise with result
     */
    requestConnection(params: RequestConnectionParams): Promise<ConnectionOperationResponse>;
    /**
     * Approve a connection request
     * @param params Approve connection parameters
     * @returns Promise with result
     */
    approveConnection(params: ApproveConnectionParams): Promise<ConnectionOperationResponse>;
    /**
     * Reject a connection request
     * @param params Reject connection parameters
     * @returns Promise with result
     */
    rejectConnection(params: RejectConnectionParams): Promise<ConnectionOperationResponse>;
    /**
     * Terminate an active connection
     * @param params Terminate connection parameters
     * @returns Promise with result
     */
    terminateConnection(params: TerminateConnectionParams): Promise<ConnectionOperationResponse>;
}
declare const _default: ConnectionManager;
export default _default;
