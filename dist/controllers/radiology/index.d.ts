import { Request, Response } from 'express';
import { RadiologyOrderControllerInterface } from './types';
/**
 * Controller for handling radiology order operations
 */
export declare class RadiologyOrderController implements RadiologyOrderControllerInterface {
    /**
     * Get incoming orders queue for radiology group
     * @route GET /api/radiology/orders
     */
    getIncomingOrders(req: Request, res: Response): Promise<void>;
    /**
     * Get full details of an order
     * @route GET /api/radiology/orders/:orderId
     */
    getOrderDetails(req: Request, res: Response): Promise<void>;
    /**
     * Export order data in specified format
     * @route GET /api/radiology/orders/:orderId/export/:format
     */
    exportOrder(req: Request, res: Response): Promise<void>;
    /**
     * Update order status
     * @route POST /api/radiology/orders/:orderId/update-status
     */
    updateOrderStatus(req: Request, res: Response): Promise<void>;
    /**
     * Request additional information from referring group
     * @route POST /api/radiology/orders/:orderId/request-info
     */
    requestInformation(req: Request, res: Response): Promise<void>;
}
declare const _default: RadiologyOrderController;
export default _default;
