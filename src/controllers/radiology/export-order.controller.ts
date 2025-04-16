import { Request, Response } from 'express';
import RadiologyOrderService from '../../services/order/radiology';

/**
 * Export order data in specified format
 * @route GET /api/radiology/orders/:orderId/export/:format
 */
export async function exportOrder(req: Request, res: Response): Promise<void> {
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

export default exportOrder;