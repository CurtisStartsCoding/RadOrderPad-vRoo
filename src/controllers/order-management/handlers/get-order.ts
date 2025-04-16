import { Request, Response } from 'express';
import OrderService from '../../../services/order.service';
import { validateOrderId, validateUserAuth } from '../validation';
import { handleControllerError } from '../error-handling';

/**
 * Handles the get order request
 * @param req Express request object
 * @param res Express response object
 */
export async function getOrder(req: Request, res: Response): Promise<void> {
  try {
    // Validate order ID
    if (!validateOrderId(req, res)) {
      return;
    }
    
    // Validate user authentication
    const userId = validateUserAuth(req, res);
    if (!userId) {
      return;
    }
    
    const orderId = parseInt(req.params.orderId);
    
    // Call the service to get the order
    const order = await OrderService.getOrderById(orderId, userId);
    
    res.status(200).json(order);
  } catch (error) {
    handleControllerError(error, res, 'getOrder');
  }
}