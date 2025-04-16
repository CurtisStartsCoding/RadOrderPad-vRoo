import { Request, Response } from 'express';
/**
 * Update patient information
 * @route PUT /api/admin/orders/:orderId/patient-info
 */
export declare function updatePatientInfo(req: Request, res: Response): Promise<void>;
export default updatePatientInfo;
