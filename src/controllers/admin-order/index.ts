import { Request, Response } from 'express';
import handlePasteSummary from './paste-summary.controller';
import handlePasteSupplemental from './paste-supplemental.controller';
import sendToRadiology from './send-to-radiology.controller';
import updatePatientInfo from './update-patient.controller';
import updateInsuranceInfo from './update-insurance.controller';
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
   */
  async sendToRadiology(req: Request, res: Response): Promise<void> {
    return sendToRadiology(req, res);
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
}

// Export a singleton instance
export default new AdminOrderController();

// Export individual controllers for direct use if needed
export {
  handlePasteSummary,
  handlePasteSupplemental,
  sendToRadiology,
  updatePatientInfo,
  updateInsuranceInfo
};