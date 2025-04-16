import { Request, Response } from 'express';
/**
 * Controller for handling order validation
 */
export declare class OrderValidationController {
    /**
     * Validate an order
     * @route POST /api/orders/validate
     */
    validateOrder(req: Request, res: Response): Promise<void>;
}
declare const _default: OrderValidationController;
export default _default;
