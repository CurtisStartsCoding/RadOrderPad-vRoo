import {
  listConnectionsService,
  requestConnectionService,
  approveConnectionService,
  rejectConnectionService,
  terminateConnectionService
} from './services';
import {
  Connection,
  IncomingRequest,
  ConnectionOperationResponse,
  RequestConnectionParams,
  ApproveConnectionParams,
  RejectConnectionParams,
  TerminateConnectionParams
} from './types';

/**
 * Facade for connection services
 */
class ConnectionManager {
  /**
   * List connections for an organization
   * @param orgId Organization ID
   * @returns Promise with connections list
   */
  async listConnections(orgId: number): Promise<Connection[]> {
    return listConnectionsService.listConnections(orgId);
  }
  
  /**
   * List pending incoming connection requests
   * @param orgId Organization ID
   * @returns Promise with pending requests list
   */
  async listIncomingRequests(orgId: number): Promise<IncomingRequest[]> {
    return listConnectionsService.listIncomingRequests(orgId);
  }
  
  /**
   * Request a connection to another organization
   * @param params Request connection parameters
   * @returns Promise with result
   */
  async requestConnection(params: RequestConnectionParams): Promise<ConnectionOperationResponse> {
    return requestConnectionService.requestConnection(params);
  }
  
  /**
   * Approve a connection request
   * @param params Approve connection parameters
   * @returns Promise with result
   */
  async approveConnection(params: ApproveConnectionParams): Promise<ConnectionOperationResponse> {
    return approveConnectionService.approveConnection(params);
  }
  
  /**
   * Reject a connection request
   * @param params Reject connection parameters
   * @returns Promise with result
   */
  async rejectConnection(params: RejectConnectionParams): Promise<ConnectionOperationResponse> {
    return rejectConnectionService.rejectConnection(params);
  }
  
  /**
   * Terminate an active connection
   * @param params Terminate connection parameters
   * @returns Promise with result
   */
  async terminateConnection(params: TerminateConnectionParams): Promise<ConnectionOperationResponse> {
    return terminateConnectionService.terminateConnection(params);
  }
}

export default new ConnectionManager();