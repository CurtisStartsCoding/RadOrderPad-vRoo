import { Request, Response } from 'express';
import BillingService from '../../services/billing';
import logger from '../../utils/logger';

/**
 * Create a checkout session for purchasing credit bundles
 * 
 * @param req Express request object
 * @param res Express response object
 * @returns Response with checkout session ID or error
 */
export async function createCheckoutSession(req: Request, res: Response): Promise<Response> {
  try {
    // Extract organization ID from authenticated user
    const orgId = req.user?.orgId;
    
    if (!orgId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User organization not found'
      });
    }

    // Extract optional price ID from request body
    const { priceId } = req.body;

    // Create checkout session
    const sessionId = await BillingService.createCreditCheckoutSession(orgId, priceId);

    return res.status(200).json({
      success: true,
      sessionId
    });
  } catch (error) {
    logger.error('Error creating checkout session:', {
      error,
      orgId: req.user?.orgId,
      priceId: req.body?.priceId
    });
    return res.status(500).json({
      success: false,
      message: `Failed to create checkout session: ${error instanceof Error ? error.message : String(error)}`
    });
  }
}