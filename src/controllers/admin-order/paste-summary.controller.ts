import { Request, Response } from 'express';
import AdminOrderService from '../../services/order/admin';
import { handleControllerError } from './types';

/**
 * Handle pasted EMR summary
 * @route POST /api/admin/orders/:orderId/paste-summary
 */
export async function handlePasteSummary(req: Request, res: Response): Promise<void> {
  try {
    const orderId = parseInt(req.params.orderId);
    
    if (isNaN(orderId)) {
      res.status(400).json({ message: 'Invalid order ID' });
      return;
    }
    
    const { pastedText } = req.body;
    
    if (!pastedText) {
      res.status(400).json({ message: 'Pasted text is required' });
      return;
    }
    
    // Get user information from the JWT token
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ message: 'User authentication required' });
      return;
    }
    
    // Call the service to handle the pasted EMR summary
    const result = await AdminOrderService.handlePasteSummary(orderId, pastedText, userId);
    
    res.status(200).json(result);
  } catch (error) {
    handleControllerError(error, res, 'handlePasteSummary');
  }
}

export default handlePasteSummary;