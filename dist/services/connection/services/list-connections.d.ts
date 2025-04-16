import { Connection, IncomingRequest } from '../types';
/**
 * Service for listing connections
 */
export declare class ListConnectionsService {
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
}
declare const _default: ListConnectionsService;
export default _default;
