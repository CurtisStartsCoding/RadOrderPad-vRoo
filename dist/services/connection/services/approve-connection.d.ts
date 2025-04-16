import { ApproveConnectionParams, ConnectionOperationResponse } from '../types';
/**
 * Service for approving connection requests
 */
export declare class ApproveConnectionService {
    /**
     * Approve a connection request
     * @param params Approve connection parameters
     * @returns Promise with result
     */
    approveConnection(params: ApproveConnectionParams): Promise<ConnectionOperationResponse>;
}
declare const _default: ApproveConnectionService;
export default _default;
