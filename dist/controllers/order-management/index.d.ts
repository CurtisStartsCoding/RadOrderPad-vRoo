/**
 * Order Management Controller
 *
 * This module provides functionality for managing orders, including
 * finalizing orders and retrieving order details.
 */
import { Request, Response } from 'express';
export * from './types';
export * from './validation';
export * from './error-handling';
export * from './handlers';
/**
 * Controller for handling order management operations
 *
 * This class is provided for backward compatibility with the original
 * controller structure. New code should use the individual handler
 * functions directly.
 */
export declare class OrderManagementController {
    /**
     * List orders
     * @route GET /api/orders
     */
    listOrders(req: Request, res: Response): Promise<void>;
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
    /**
     * Add administrative updates to an order
     * @route POST /api/orders/:orderId/admin-update
     */
    adminUpdate(req: Request, res: Response): Promise<void>;
}
declare const _default: OrderManagementController;
export default _default;
