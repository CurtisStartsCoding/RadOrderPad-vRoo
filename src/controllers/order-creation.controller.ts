/**
 * Order Creation Controller
 * 
 * This controller handles the creation and finalization of orders
 * after the physician completes the validation process and signs the order.
 */

import { Request, Response } from 'express';
import { handleOrderCreation } from '../services/order/creation/handler';
import { CreateFinalizedOrderPayload } from '../services/order/creation/types';
import enhancedLogger from '../utils/enhanced-logger';

/**
 * Handle controller errors with appropriate HTTP responses
 */
const handleControllerError = (error: unknown, res: Response): void => {
  enhancedLogger.error('Error in order creation controller:', error);

  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes('Patient not found')) {
      res.status(404).json({ success: false, message: 'Patient not found' });
    } else if (error.message.includes('Invalid request')) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error.message.includes('Unauthorized')) {
      res.status(403).json({ success: false, message: 'Unauthorized access' });
    } else {
      // Generic server error
      res.status(500).json({ 
        success: false, 
        message: 'An error occurred while processing your request' 
      });
    }
  } else {
    // Unknown error type
    res.status(500).json({ 
      success: false, 
      message: 'An unexpected error occurred' 
    });
  }
};

/**
 * Controller for order creation operations
 */
export class OrderCreationController {
  /**
   * Create a finalized order
   * @route POST /api/orders
   */
  async createFinalizedOrder(req: Request, res: Response): Promise<void> {
    try {
      // Extract user information from JWT token
      const userId = req.user?.userId;
      const referringOrganizationId = req.user?.orgId;

      if (!userId || !referringOrganizationId) {
        res.status(401).json({ 
          success: false, 
          message: 'User authentication required' 
        });
        return;
      }

      // Validate request body
      const payload = req.body as CreateFinalizedOrderPayload;
      
      // Check for required fields
      if (!payload.patientInfo) {
        res.status(400).json({ 
          success: false, 
          message: 'Patient information is required' 
        });
        return;
      }

      if (!payload.dictationText) {
        res.status(400).json({ 
          success: false, 
          message: 'Dictation text is required' 
        });
        return;
      }

      if (!payload.finalValidationResult) {
        res.status(400).json({ 
          success: false, 
          message: 'Final validation result is required' 
        });
        return;
      }

      if (!payload.signatureData) {
        res.status(400).json({ 
          success: false, 
          message: 'Signature data is required' 
        });
        return;
      }

      if (!payload.signerFullName) {
        res.status(400).json({ 
          success: false, 
          message: 'Signer full name is required' 
        });
        return;
      }

      // If isOverride is true, overrideJustification is required
      if (payload.isOverride && !payload.overrideJustification) {
        res.status(400).json({ 
          success: false, 
          message: 'Override justification is required when override is selected' 
        });
        return;
      }

      // Call service to handle order creation
      const result = await handleOrderCreation(
        payload,
        userId,
        referringOrganizationId
      );

      // Return success response
      res.status(201).json(result);
    } catch (error) {
      handleControllerError(error, res);
    }
  }
}

// Export controller instance
export default new OrderCreationController();