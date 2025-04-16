/**
 * Handle finalization of an order
 */
export declare function handleFinalizeOrder(orderId: number, payload: any, userId: number): Promise<{
    success: boolean;
    orderId: number;
    message: string;
}>;
