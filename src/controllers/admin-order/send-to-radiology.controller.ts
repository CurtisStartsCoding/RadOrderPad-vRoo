import { Request, Response } from 'express';
import sendToRadiology from '../../services/order/admin/handlers/send-to-radiology';

// Extend the Request type to include the user property
interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    orgId: number;
    role: string;
    email: string;
  };
}

/**
 * Handle sending an order to radiology
 * This controller properly handles database connections for both PHI and Main databases
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function handleSendToRadiology(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const userId = req.user.userId;
    
    if (isNaN(orderId)) {
      res.status(400).json({ message: 'Invalid order ID' });
      return;
    }
    
    const result = await sendToRadiology(orderId, userId);
    res.json(result);
  } catch (error) {
    // Handle specific error types
    if (error && typeof error === 'object' && 'status' in error) {
      const customError = error as { status: number; message: string; code?: string; orderId?: number };
      res.status(customError.status).json({
        message: customError.message,
        code: customError.code,
        orderId: customError.orderId
      });
    } else if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error('Error in handleSendToRadiology:', error);
      res.status(500).json({ message: error.message });
    } else {
      // eslint-disable-next-line no-console
      console.error('Unknown error in handleSendToRadiology:', error);
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
}

export default handleSendToRadiology;