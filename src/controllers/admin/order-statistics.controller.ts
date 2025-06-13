import { Request, Response } from 'express';
import { getOrderStatistics } from '../../services/statistics/order-statistics.service';
import { exportOrdersToCSV } from '../../services/export/simple-order-export.service';
import logger from '../../utils/logger';

/**
 * Get order statistics for admin users
 */
export async function getOrderStatisticsHandler(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.user?.orgId;
    const role = req.user?.role;

    if (!orgId) {
      res.status(401).json({ 
        success: false,
        error: 'Organization ID not found' 
      });
      return;
    }

    if (role !== 'admin_referring' && role !== 'admin_radiology') {
      res.status(403).json({ 
        success: false,
        error: 'Access denied. This endpoint is only for admin users.' 
      });
      return;
    }

    const statistics = await getOrderStatistics(orgId, role);

    res.status(200).json({
      success: true,
      data: statistics
    });
  } catch (error) {
    logger.error('Error in getOrderStatistics controller:', {
      error,
      userId: req.user?.userId,
      orgId: req.user?.orgId
    });
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve order statistics' 
    });
  }
}

/**
 * Export orders to CSV for admin users
 */
export async function exportOrdersHandler(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.user?.orgId;
    const role = req.user?.role;

    if (!orgId) {
      res.status(401).json({ 
        success: false,
        error: 'Organization ID not found' 
      });
      return;
    }

    if (role !== 'admin_referring' && role !== 'admin_radiology') {
      res.status(403).json({ 
        success: false,
        error: 'Access denied. This endpoint is only for admin users.' 
      });
      return;
    }

    // Extract filters from request body
    const { status, dateFrom, dateTo, limit } = req.body;

    const csv = await exportOrdersToCSV({
      orgId,
      role,
      status,
      dateFrom,
      dateTo,
      limit: limit || 1000 // Default limit to prevent huge exports
    });

    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="orders-export-${new Date().toISOString().split('T')[0]}.csv"`);
    
    res.status(200).send(csv);
  } catch (error) {
    logger.error('Error in exportOrders controller:', {
      error,
      userId: req.user?.userId,
      orgId: req.user?.orgId
    });
    res.status(500).json({ 
      success: false,
      error: 'Failed to export orders' 
    });
  }
}