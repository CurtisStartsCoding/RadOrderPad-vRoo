import { Request, Response } from 'express';
import RadiologyOrderService from '../../services/order/radiology';
import logger from '../../utils/logger';

/**
 * Request additional information from referring group
 * @route POST /api/radiology/orders/:orderId/request-info
 */
export async function requestInformation(req: Request, res: Response): Promise<void> {
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
    logger.error('Error in requestInformation controller:', {
      error,
      orderId: req.params.orderId,
      userId: req.user?.userId,
      orgId: req.user?.orgId,
      requestedInfoType: req.body?.requestedInfoType
    });
    
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

export default requestInformation;