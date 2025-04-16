import { Request, Response } from 'express';
/**
 * Handle pasted EMR summary
 * @route POST /api/admin/orders/:orderId/paste-summary
 */
export declare function handlePasteSummary(req: Request, res: Response): Promise<void>;
export default handlePasteSummary;
