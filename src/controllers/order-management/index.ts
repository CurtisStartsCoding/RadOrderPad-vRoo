/**
 * Order Management Controller
 *
 * This module provides functionality for managing orders, including
 * finalizing orders and retrieving order details.
 */

import { Request, Response } from 'express';
import { finalizeOrder, getOrder, adminUpdate, listOrders } from './handlers';

// Export types
export * from './types';

// Export validation functions
export * from './validation';

// Export error handling functions
export * from './error-handling';

// Export handler functions
export * from './handlers';

/**
 * Controller for handling order management operations
 *
 * This class is provided for backward compatibility with the original
 * controller structure. New code should use the individual handler
 * functions directly.
 */
export class OrderManagementController {
  /**
   * List orders
   * @route GET /api/orders
   */
  async listOrders(req: Request, res: Response): Promise<void> {
    return listOrders(req, res);
  }
  
  /**
   * Finalize an order
   * @route PUT /api/orders/:orderId
   */
  async finalizeOrder(req: Request, res: Response): Promise<void> {
    return finalizeOrder(req, res);
  }
  
  /**
   * Get order details
   * @route GET /api/orders/:orderId
   */
  async getOrder(req: Request, res: Response): Promise<void> {
    return getOrder(req, res);
  }
  
  /**
   * Add administrative updates to an order
   * @route POST /api/orders/:orderId/admin-update
   */
  async adminUpdate(req: Request, res: Response): Promise<void> {
    return adminUpdate(req, res);
  }
}

// Export controller instance for backward compatibility
export default new OrderManagementController();