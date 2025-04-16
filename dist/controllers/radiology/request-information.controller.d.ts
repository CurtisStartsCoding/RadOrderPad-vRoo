import { Request, Response } from 'express';
/**
 * Request additional information from referring group
 * @route POST /api/radiology/orders/:orderId/request-info
 */
export declare function requestInformation(req: Request, res: Response): Promise<void>;
export default requestInformation;
