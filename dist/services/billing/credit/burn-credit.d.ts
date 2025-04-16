import { CreditActionType } from '../types';
/**
 * Record credit usage for an order submission action
 * Decrements the organization's credit balance and logs the usage
 *
 * @param organizationId Organization ID
 * @param userId User ID
 * @param orderId Order ID
 * @param actionType Action type ('order_submitted')
 * @returns Promise<boolean> True if successful
 * @throws InsufficientCreditsError if the organization has insufficient credits
 */
export declare function burnCredit(organizationId: number, userId: number, orderId: number, actionType: CreditActionType): Promise<boolean>;
