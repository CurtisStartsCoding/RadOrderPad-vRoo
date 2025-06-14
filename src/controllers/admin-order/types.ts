import { Request, Response } from 'express';
import logger from '../../utils/logger';

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
  updateOrder(req: Request, res: Response): Promise<void>;
}

/**
 * Common error handling function type
 */
export type ErrorHandler = (error: unknown, res: Response) => void;

/**
 * Common error handler function for admin order controllers
 */
export function handleControllerError(error: unknown, res: Response, controllerName: string): void {
  logger.error(`Error in admin order controller:`, {
    error,
    controllerName
  });
  
  if (error instanceof Error) {
    if (error.message.includes('not found')) {
      res.status(404).json({ message: error.message });
    } else if (error.message.includes('Unauthorized')) {
      res.status(403).json({ message: error.message });
    } else if (error.message.includes('missing')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
}