import { Request, Response } from 'express';
import RadiologyOrderService from '../services/order/radiology';

/**
 * Controller for handling radiology order operations
 */
export class RadiologyOrderController {
  /**
   * Get incoming orders queue for radiology group
   * @route GET /api/radiology/orders
   */
  async getIncomingOrders(req: Request, res: Response): Promise<void> {
    try {
      // Get user information from the JWT token
      const orgId = req.user?.orgId;
      
      if (!orgId) {
        res.status(401).json({ message: 'User authentication required' });
        return;
      }
      
      // Extract filter parameters from query
      const filters: any = {};
      
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
        filters.sortOrder = req.query.sortOrder as string;
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
  
  /**
   * Get full details of an order
   * @route GET /api/radiology/orders/:orderId
   */
  async getOrderDetails(req: Request, res: Response): Promise<void> {
    try {
      const orderId = parseInt(req.params.orderId);
      
      if (isNaN(orderId)) {
        res.status(400).json({ message: 'Invalid order ID' });
        return;
      }
      
      // Get user information from the JWT token
      const orgId = req.user?.orgId;
      
      if (!orgId) {
        res.status(401).json({ message: 'User authentication required' });
        return;
      }
      
      // Call the service to get the order details
      const result = await RadiologyOrderService.getOrderDetails(orderId, orgId);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getOrderDetails controller:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({ message: error.message });
        } else if (error.message.includes('Unauthorized')) {
          res.status(403).json({ message: error.message });
        } else {
          res.status(500).json({ message: error.message });
        }
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }
  
  /**
   * Export order data in specified format
   * @route GET /api/radiology/orders/:orderId/export/:format
   */
  async exportOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderId = parseInt(req.params.orderId);
      const format = req.params.format;
      
      if (isNaN(orderId)) {
        res.status(400).json({ message: 'Invalid order ID' });
        return;
      }
      
      // Validate format
      const validFormats = ['pdf', 'csv', 'json'];
      if (!validFormats.includes(format)) {
        res.status(400).json({ message: `Invalid format. Supported formats: ${validFormats.join(', ')}` });
        return;
      }
      
      // Get user information from the JWT token
      const orgId = req.user?.orgId;
      
      if (!orgId) {
        res.status(401).json({ message: 'User authentication required' });
        return;
      }
      
      // Call the service to export the order
      const result = await RadiologyOrderService.exportOrder(orderId, format, orgId);
      
      // Set appropriate headers based on format
      if (format === 'pdf') {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="order-${orderId}.pdf"`);
      } else if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="order-${orderId}.csv"`);
      } else if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="order-${orderId}.json"`);
      }
      
      res.status(200).send(result);
    } catch (error) {
      console.error('Error in exportOrder controller:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({ message: error.message });
        } else if (error.message.includes('Unauthorized')) {
          res.status(403).json({ message: error.message });
        } else {
          res.status(500).json({ message: error.message });
        }
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }
  
  /**
   * Update order status
   * @route POST /api/radiology/orders/:orderId/update-status
   */
  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const orderId = parseInt(req.params.orderId);
      
      if (isNaN(orderId)) {
        res.status(400).json({ message: 'Invalid order ID' });
        return;
      }
      
      const { newStatus } = req.body;
      
      if (!newStatus) {
        res.status(400).json({ message: 'New status is required' });
        return;
      }
      
      // Validate status
      const validStatuses = ['scheduled', 'completed', 'cancelled'];
      if (!validStatuses.includes(newStatus)) {
        res.status(400).json({ message: `Invalid status. Supported statuses: ${validStatuses.join(', ')}` });
        return;
      }
      
      // Get user information from the JWT token
      const userId = req.user?.userId;
      const orgId = req.user?.orgId;
      
      if (!userId || !orgId) {
        res.status(401).json({ message: 'User authentication required' });
        return;
      }
      
      // Call the service to update the order status
      const result = await RadiologyOrderService.updateOrderStatus(orderId, newStatus, userId, orgId);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in updateOrderStatus controller:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({ message: error.message });
        } else if (error.message.includes('Unauthorized')) {
          res.status(403).json({ message: error.message });
        } else {
          res.status(500).json({ message: error.message });
        }
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }
  
  /**
   * Request additional information from referring group
   * @route POST /api/radiology/orders/:orderId/request-info
   */
  async requestInformation(req: Request, res: Response): Promise<void> {
    try {
      const orderId = parseInt(req.params.orderId);
      
      if (isNaN(orderId)) {
        res.status(400).json({ message: 'Invalid order ID' });
        return;
      }
      
      const { requestedInfoType, requestedInfoDetails } = req.body;
      
      if (!requestedInfoType || !requestedInfoDetails) {
        res.status(400).json({ message: 'Requested info type and details are required' });
        return;
      }
      
      // Get user information from the JWT token
      const userId = req.user?.userId;
      const orgId = req.user?.orgId;
      
      if (!userId || !orgId) {
        res.status(401).json({ message: 'User authentication required' });
        return;
      }
      
      // Call the service to request information
      const result = await RadiologyOrderService.requestInformation(
        orderId,
        requestedInfoType,
        requestedInfoDetails,
        userId,
        orgId
      );
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in requestInformation controller:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({ message: error.message });
        } else if (error.message.includes('Unauthorized')) {
          res.status(403).json({ message: error.message });
        } else {
          res.status(500).json({ message: error.message });
        }
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }
}

export default new RadiologyOrderController();