import { Request, Response } from 'express';
/**
 * Interface for the AdminOrderController
 */
export interface AdminOrderControllerInterface {
    handlePasteSummary(req: Request, res: Response): Promise<void>;
    handlePasteSupplemental(req: Request, res: Response): Promise<void>;
    sendToRadiology(req: Request, res: Response): Promise<void>;
    updatePatientInfo(req: Request, res: Response): Promise<void>;
    updateInsuranceInfo(req: Request, res: Response): Promise<void>;
    listPendingAdminOrders(req: Request, res: Response): Promise<void>;
}
/**
 * Common error handling function type
 */
export type ErrorHandler = (error: unknown, res: Response) => void;
/**
 * Common error handler function for admin order controllers
 */
export declare function handleControllerError(error: unknown, res: Response, controllerName: string): void;
