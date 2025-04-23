import { Request, Response } from 'express';
import handlePasteSummary from './paste-summary.controller';
import handlePasteSupplemental from './paste-supplemental.controller';
import sendToRadiology from './send-to-radiology.controller';
import updatePatientInfo from './update-patient.controller';
import updateInsuranceInfo from './update-insurance.controller';
import listPendingAdminOrders from './list-pending-admin.controller';
import { AdminOrderControllerInterface } from './types';
/**
 * Controller for handling admin order operations
 */
export declare class AdminOrderController implements AdminOrderControllerInterface {
    /**
     * Handle pasted EMR summary
     * @route POST /api/admin/orders/:orderId/paste-summary
     */
    handlePasteSummary(req: Request, res: Response): Promise<void>;
    /**
     * Handle pasted supplemental documents
     * @route POST /api/admin/orders/:orderId/paste-supplemental
     */
    handlePasteSupplemental(req: Request, res: Response): Promise<void>;
    /**
     * Send order to radiology
     * @route POST /api/admin/orders/:orderId/send-to-radiology
     */
    sendToRadiology(req: Request, res: Response): Promise<void>;
    /**
     * Update patient information
     * @route PUT /api/admin/orders/:orderId/patient-info
     */
    updatePatientInfo(req: Request, res: Response): Promise<void>;
    /**
     * Update insurance information
     * @route PUT /api/admin/orders/:orderId/insurance-info
     */
    updateInsuranceInfo(req: Request, res: Response): Promise<void>;
    /**
     * List orders awaiting admin finalization
     * @route GET /api/admin/orders/queue
     */
    listPendingAdminOrders(req: Request, res: Response): Promise<void>;
}
declare const _default: AdminOrderController;
export default _default;
export { handlePasteSummary, handlePasteSupplemental, sendToRadiology, updatePatientInfo, updateInsuranceInfo, listPendingAdminOrders };
