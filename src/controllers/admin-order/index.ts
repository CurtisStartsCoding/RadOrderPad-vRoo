import { Request, Response } from 'express';
import handlePasteSummary from './paste-summary.controller';
import handlePasteSupplemental from './paste-supplemental.controller';
// Note: sendToRadiology is handled differently due to circular dependencies
import updatePatientInfo from './update-patient.controller';
import updateInsuranceInfo from './update-insurance.controller';
import listPendingAdminOrders from './list-pending-admin.controller';
import updateOrder from './update-order.controller';
import { AdminOrderControllerInterface } from './types';

/**
 * Controller for handling admin order operations
 */
export class AdminOrderController implements AdminOrderControllerInterface {
  /**
   * Handle pasted EMR summary
   * @route POST /api/admin/orders/:orderId/paste-summary
   */
  async handlePasteSummary(req: Request, res: Response): Promise<void> {
    return handlePasteSummary(req, res);
  }
  
  /**
   * Handle pasted supplemental documents
   * @route POST /api/admin/orders/:orderId/paste-supplemental
   */
  async handlePasteSupplemental(req: Request, res: Response): Promise<void> {
    return handlePasteSupplemental(req, res);
  }
  
  /**
   * Send order to radiology
   * @route POST /api/admin/orders/:orderId/send-to-radiology
   * Note: This is handled dynamically in the route to avoid circular dependencies
   */
  async sendToRadiology(_req: Request, _res: Response): Promise<void> {
    throw new Error('This method should not be called directly. Use the route handler instead.');
  }
  
  /**
   * Update patient information
   * @route PUT /api/admin/orders/:orderId/patient-info
   */
  async updatePatientInfo(req: Request, res: Response): Promise<void> {
    return updatePatientInfo(req, res);
  }
  
  /**
   * Update insurance information
   * @route PUT /api/admin/orders/:orderId/insurance-info
   */
  async updateInsuranceInfo(req: Request, res: Response): Promise<void> {
    return updateInsuranceInfo(req, res);
  }
  
  /**
   * List orders awaiting admin finalization
   * @route GET /api/admin/orders/queue
   */
  async listPendingAdminOrders(req: Request, res: Response): Promise<void> {
    return listPendingAdminOrders(req, res);
  }
  
  /**
   * Unified update endpoint for all order fields
   * @route PUT /api/admin/orders/:orderId
   */
  async updateOrder(req: Request, res: Response): Promise<void> {
    return updateOrder(req, res);
  }
}

// Export a singleton instance
export default new AdminOrderController();

// Export individual controllers for direct use if needed
export {
  handlePasteSummary,
  handlePasteSupplemental,
  // sendToRadiology is not exported due to circular dependencies
  updatePatientInfo,
  updateInsuranceInfo,
  listPendingAdminOrders,
  updateOrder
};