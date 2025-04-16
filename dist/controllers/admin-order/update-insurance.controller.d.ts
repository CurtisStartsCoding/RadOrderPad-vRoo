import { Request, Response } from 'express';
/**
 * Update insurance information
 * @route PUT /api/admin/orders/:orderId/insurance-info
 */
export declare function updateInsuranceInfo(req: Request, res: Response): Promise<void>;
export default updateInsuranceInfo;
