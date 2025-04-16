import { Request, Response } from 'express';
/**
 * Controller for handling admin order operations
 */
export declare class AdminOrderController {
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
}
declare const _default: AdminOrderController;
export default _default;
