import { Request, Response } from 'express';
/**
 * Handle pasted supplemental documents
 * @route POST /api/admin/orders/:orderId/paste-supplemental
 */
export declare function handlePasteSupplemental(req: Request, res: Response): Promise<void>;
export default handlePasteSupplemental;
