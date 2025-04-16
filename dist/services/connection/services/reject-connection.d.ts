import { RejectConnectionParams, ConnectionOperationResponse } from '../types';
/**
 * Service for rejecting connection requests
 */
export declare class RejectConnectionService {
    /**
     * Reject a connection request
     * @param params Reject connection parameters
     * @returns Promise with result
     */
    rejectConnection(params: RejectConnectionParams): Promise<ConnectionOperationResponse>;
}
declare const _default: RejectConnectionService;
export default _default;
