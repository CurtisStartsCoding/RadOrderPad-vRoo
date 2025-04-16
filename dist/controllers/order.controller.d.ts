import { Request, Response } from 'express';
/**
 * Controller for handling order-related routes
 */
export declare class OrderController {
    /**
     * Validate an order
     * @route POST /api/orders/validate
     */
    validateOrder(req: Request, res: Response): Promise<void>;
    /**
     * Finalize an order
     * @route PUT /api/orders/:orderId
     */
    finalizeOrder(req: Request, res: Response): Promise<void>;
    /**
     * Get order details
     * @route GET /api/orders/:orderId
     */
    getOrder(req: Request, res: Response): Promise<void>;
}
declare const _default: OrderController;
export default _default;
