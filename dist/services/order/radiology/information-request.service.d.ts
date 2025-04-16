import { InformationRequestResult } from './types';
/**
 * Request additional information from referring group
 * @param orderId Order ID
 * @param requestedInfoType Type of information requested
 * @param requestedInfoDetails Details of the request
 * @param userId User ID
 * @param orgId Radiology organization ID
 * @returns Promise with result
 */
export declare function requestInformation(orderId: number, requestedInfoType: string, requestedInfoDetails: string, userId: number, orgId: number): Promise<InformationRequestResult>;
export default requestInformation;
