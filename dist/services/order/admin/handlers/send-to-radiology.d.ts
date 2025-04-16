import { SendToRadiologyResult } from '../types';
/**
 * Send order to radiology
 * @param orderId Order ID
 * @param userId User ID
 * @returns Promise with result
 */
export declare function sendToRadiology(orderId: number, userId: number): Promise<SendToRadiologyResult>;
export default sendToRadiology;
