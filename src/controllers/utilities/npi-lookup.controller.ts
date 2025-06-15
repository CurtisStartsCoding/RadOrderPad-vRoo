import { Request, Response } from 'express';
import { lookupNPI } from '../../services/utilities/npi-lookup.service';
import logger from '../../utils/logger';

/**
 * Controller for NPI lookup endpoint
 * @route GET /api/utilities/npi-lookup?number=1234567890
 */
export async function npiLookupController(req: Request, res: Response): Promise<void> {
  try {
    const { number } = req.query;

    // Validate query parameter
    if (!number || typeof number !== 'string') {
      res.status(400).json({
        success: false,
        error: 'NPI number is required'
      });
      return;
    }

    // Call the lookup service
    const result = await lookupNPI(number);

    if (!result.success) {
      res.status(result.error === 'NPI number not found in registry' ? 404 : 400).json(result);
      return;
    }

    // Return successful response
    res.json(result);

  } catch (error) {
    logger.error('Error in NPI lookup controller', { error });
    res.status(500).json({
      success: false,
      error: 'Internal server error during NPI lookup'
    });
  }
}

export default npiLookupController;