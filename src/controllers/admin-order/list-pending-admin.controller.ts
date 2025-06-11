import { Request, Response } from 'express';
import adminOrderService from '../../services/order/admin';
import { handleControllerError } from './types';

/**
 * List orders awaiting admin finalization
 * @param req Express request object
 * @param res Express response object
 */
async function listPendingAdminOrders(req: Request, res: Response): Promise<void> {
  try {
    // Get user organization ID from the authenticated user
    const orgId = req.user?.orgId;
    if (!orgId) {
      res.status(401).json({ message: 'Unauthorized: Organization ID not found' });
      return;
    }

    // Extract pagination, sorting, and filtering parameters from query
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const sortBy = (req.query.sortBy as string) || 'created_at';
    const sortOrder = (req.query.sortOrder as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';
    
    // Additional filters (optional)
    const filters = {
      patientName: req.query.patientName as string,
      physicianName: req.query.physicianName as string,
      dateFrom: req.query.dateFrom as string,
      dateTo: req.query.dateTo as string,
      originatingLocationId: req.query.originatingLocationId ? parseInt(req.query.originatingLocationId as string) : undefined,
      targetFacilityId: req.query.targetFacilityId ? parseInt(req.query.targetFacilityId as string) : undefined,
    };

    // Call service function to get the orders
    const result = await adminOrderService.listPendingAdminOrders(
      orgId,
      { page, limit, sortBy, sortOrder, ...filters }
    );

    // Return the orders and pagination info
    res.status(200).json(result);
  } catch (error) {
    handleControllerError(error, res, 'listPendingAdminOrders');
  }
}

export default listPendingAdminOrders;