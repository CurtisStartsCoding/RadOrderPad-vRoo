import { ConnectionOperationResponse, RequestConnectionParams } from '../types';
/**
 * Service for requesting connections
 */
export declare class RequestConnectionService {
    /**
     * Request a connection to another organization
     * @param params Request connection parameters
     * @returns Promise with result
     */
    requestConnection(params: RequestConnectionParams): Promise<ConnectionOperationResponse>;
}
declare const _default: RequestConnectionService;
export default _default;
