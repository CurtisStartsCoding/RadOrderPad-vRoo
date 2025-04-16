import { Request, Response } from 'express';
import AdminOrderService from '../../services/order/admin';
import { handleControllerError } from './types';

/**
 * Update insurance information
 * @route PUT /api/admin/orders/:orderId/insurance-info
 */
export async function updateInsuranceInfo(req: Request, res: Response): Promise<void> {
  try {
    const orderId = parseInt(req.params.orderId);
    
    if (isNaN(orderId)) {
      res.status(400).json({ message: 'Invalid order ID' });
      return;
    }
    
    const insuranceData = req.body;
    
    if (!insuranceData) {
      res.status(400).json({ message: 'Insurance data is required' });
      return;
    }
    
    // Get user information from the JWT token
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ message: 'User authentication required' });
      return;
    }
    
    // Call the service to update the insurance information
    const result = await AdminOrderService.updateInsuranceInfo(orderId, insuranceData, userId);
    
    res.status(200).json(result);
  } catch (error) {
    handleControllerError(error, res, 'updateInsuranceInfo');
  }
}

export default updateInsuranceInfo;