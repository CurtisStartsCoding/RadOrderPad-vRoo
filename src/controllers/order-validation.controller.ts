import { Request, Response } from 'express';
import OrderService from '../services/order.service';

/**
 * Controller for handling order validation
 */
export class OrderValidationController {
  /**
   * Validate an order
   * @route POST /api/orders/validate
   */
  async validateOrder(req: Request, res: Response): Promise<void> {
    try {
      const { dictationText, patientInfo, orderId, isOverrideValidation, radiologyOrganizationId } = req.body;
      
      // Validate request body
      if (!dictationText) {
        res.status(400).json({ message: 'Dictation text is required' });
        return;
      }
      
      // Get user information from the JWT token
      const userId = req.user?.userId;
      const orgId = req.user?.orgId;
      
      if (!userId || !orgId) {
        res.status(401).json({ message: 'User authentication required' });
        return;
      }
      
      // Call the service to handle the validation
      const result = await OrderService.handleValidationRequest(
        dictationText,
        patientInfo,
        userId,
        orgId,
        orderId,
        isOverrideValidation,
        radiologyOrganizationId
      );
      
      res.status(200).json(result);
    } catch (error) {
      // Log error without including potentially sensitive details
      // eslint-disable-next-line no-console
      console.error('Error in validateOrder controller - check server logs for details');
      
      // Handle custom error object with status
      if (error && typeof error === 'object' && 'status' in error) {
        const customError = error as { status: number; message: string; code?: string; orderId?: number };
        res.status(customError.status).json({
          message: customError.message,
          code: customError.code,
          orderId: customError.orderId
        });
      } else if (error instanceof Error) {
        // Check for ValidationServiceUnavailable error
        if (error.message.includes('ValidationServiceUnavailable')) {
          // Return 503 Service Unavailable status code
          res.status(503).json({
            message: 'Validation service temporarily unavailable. All LLM providers failed.',
            code: 'VALIDATION_SERVICE_UNAVAILABLE'
          });
        } else {
          res.status(500).json({ message: error.message });
        }
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }
}

export default new OrderValidationController();