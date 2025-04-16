import { TerminateConnectionParams, ConnectionOperationResponse } from '../types';
/**
 * Service for terminating connections
 */
export declare class TerminateConnectionService {
    /**
     * Terminate an active connection
     * @param params Terminate connection parameters
     * @returns Promise with result
     */
    terminateConnection(params: TerminateConnectionParams): Promise<ConnectionOperationResponse>;
}
declare const _default: TerminateConnectionService;
export default _default;
