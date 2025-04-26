import { Request, Response } from 'express';
import RadiologyOrderService from '../../services/order/radiology';
import enhancedLogger from '../../utils/enhanced-logger';

/**
 * Request additional information from referring group
 * @route POST /api/radiology/orders/:orderId/request-info
 */
export async function requestInformation(req: Request, res: Response): Promise<void> {
  try {
    enhancedLogger.info('Request information endpoint called', {
      orderId: req.params.orderId,
      userId: req.user?.userId,
      orgId: req.user?.orgId
    });

    // Validate orderId parameter
    const orderId = parseInt(req.params.orderId);
    
    if (isNaN(orderId) || orderId <= 0) {
      enhancedLogger.warn('Invalid order ID provided', { orderId: req.params.orderId });
      res.status(400).json({
        success: false,
        message: 'Invalid order ID. Must be a positive number.'
      });
      return;
    }
    
    // Validate request body
    const { requestedInfoType, requestedInfoDetails } = req.body;
    
    if (!requestedInfoType) {
      enhancedLogger.warn('Missing requestedInfoType in request body');
      res.status(400).json({
        success: false,
        message: 'requestedInfoType is required'
      });
      return;
    }
    
    if (!requestedInfoDetails) {
      enhancedLogger.warn('Missing requestedInfoDetails in request body');
      res.status(400).json({
        success: false,
        message: 'requestedInfoDetails is required'
      });
      return;
    }
    
    if (typeof requestedInfoType !== 'string' || typeof requestedInfoDetails !== 'string') {
      enhancedLogger.warn('Invalid data types in request body', {
        requestedInfoTypeType: typeof requestedInfoType,
        requestedInfoDetailsType: typeof requestedInfoDetails
      });
      res.status(400).json({
        success: false,
        message: 'requestedInfoType and requestedInfoDetails must be strings'
      });
      return;
    }
    
    // Get user information from the JWT token
    const userId = req.user?.userId;
    const orgId = req.user?.orgId;
    
    if (!userId || !orgId) {
      enhancedLogger.warn('Missing user authentication', { userId, orgId });
      res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
      return;
    }
    
    // Call the service to request information
    enhancedLogger.info('Calling requestInformation service', {
      orderId,
      requestedInfoType,
      userId,
      orgId
    });
    
    const result = await RadiologyOrderService.requestInformation(
      orderId,
      requestedInfoType,
      requestedInfoDetails,
      userId,
      orgId
    );
    
    enhancedLogger.info('Information request created successfully', {
      orderId,
      requestId: result.requestId
    });
    
    res.status(200).json(result);
  } catch (error) {
    // Detailed error logging
    if (error instanceof Error) {
      enhancedLogger.error('Error in requestInformation controller:', {
        error: error.message,
        stack: error.stack,
        orderId: req.params.orderId,
        userId: req.user?.userId,
        orgId: req.user?.orgId,
        requestedInfoType: req.body?.requestedInfoType
      });
      
      // Return appropriate HTTP status based on error message
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
      } else if (error.message.includes('Unauthorized')) {
        res.status(403).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    } else {
      enhancedLogger.error('Unknown error in requestInformation controller:', {
        error,
        orderId: req.params.orderId,
        userId: req.user?.userId,
        orgId: req.user?.orgId
      });
      
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred'
      });
    }
  }
}

export default requestInformation;