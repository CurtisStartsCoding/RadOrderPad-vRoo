import { Request, Response } from 'express';
import RadiologyOrderService from '../../services/order/radiology';
import { OrderFilters } from './types';

/**
 * Get incoming orders queue for radiology group
 * @route GET /api/radiology/orders
 */
export async function getIncomingOrders(req: Request, res: Response): Promise<void> {
  try {
    // Get user information from the JWT token
    const orgId = req.user?.orgId;
    
    if (!orgId) {
      res.status(401).json({ message: 'User authentication required' });
      return;
    }
    
    // Extract filter parameters from query
    const filters: OrderFilters = {};
    
    // Referring organization filter
    if (req.query.referringOrgId) {
      filters.referringOrgId = parseInt(req.query.referringOrgId as string);
    }
    
    // Priority filter
    if (req.query.priority) {
      filters.priority = req.query.priority as string;
    }
    
    // Modality filter
    if (req.query.modality) {
      filters.modality = req.query.modality as string;
    }
    
    // Date range filter
    if (req.query.startDate) {
      filters.startDate = new Date(req.query.startDate as string);
    }
    
    if (req.query.endDate) {
      filters.endDate = new Date(req.query.endDate as string);
    }
    
    // Validation status filter
    if (req.query.validationStatus) {
      filters.validationStatus = req.query.validationStatus as string;
    }
    
    // Sorting
    if (req.query.sortBy) {
      filters.sortBy = req.query.sortBy as string;
    }
    
    if (req.query.sortOrder) {
      const sortOrder = req.query.sortOrder as string;
      if (sortOrder === 'asc' || sortOrder === 'desc') {
        filters.sortOrder = sortOrder;
      }
    }
    
    // Pagination
    if (req.query.page) {
      filters.page = parseInt(req.query.page as string);
    }
    
    if (req.query.limit) {
      filters.limit = parseInt(req.query.limit as string);
    }
    
    // Call the service to get the incoming orders
    const result = await RadiologyOrderService.getIncomingOrders(orgId, filters);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getIncomingOrders controller:', error);
    
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
}

export default getIncomingOrders;