import { Request, Response } from 'express';

/**
 * Interface for filter parameters used in getIncomingOrders
 */
export interface OrderFilters {
  status?: string;
  referringOrgId?: number;
  priority?: string;
  modality?: string;
  startDate?: Date;
  endDate?: Date;
  validationStatus?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Interface for controller methods
 */
export interface RadiologyOrderControllerInterface {
  getIncomingOrders(req: Request, res: Response): Promise<void>;
  getOrderDetails(req: Request, res: Response): Promise<void>;
  exportOrder(req: Request, res: Response): Promise<void>;
  updateOrderStatus(req: Request, res: Response): Promise<void>;
  requestInformation(req: Request, res: Response): Promise<void>;
}