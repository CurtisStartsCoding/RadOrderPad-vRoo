import { queryPhiDb } from '../../config/db';
import logger from '../../utils/logger';

export interface OrderStatistics {
  total: number;
  byStatus: Record<string, number>;
  last7Days: number;
  last30Days: number;
}

/**
 * Get order statistics for an organization
 * @param orgId Organization ID
 * @param role User role (admin_referring or admin_radiology)
 * @returns Order statistics
 */
export async function getOrderStatistics(
  orgId: number,
  role: 'admin_referring' | 'admin_radiology'
): Promise<OrderStatistics> {
  try {
    // Determine which organization field to use based on role
    const orgField = role === 'admin_referring' 
      ? 'referring_organization_id' 
      : 'radiology_organization_id';

    // Get total count
    const totalQuery = `
      SELECT COUNT(*) as count
      FROM orders
      WHERE ${orgField} = $1
    `;
    const totalResult = await queryPhiDb(totalQuery, [orgId]);
    const total = parseInt(totalResult.rows[0].count, 10);

    // Get counts by status
    const statusQuery = `
      SELECT status, COUNT(*) as count
      FROM orders
      WHERE ${orgField} = $1
      GROUP BY status
    `;
    const statusResult = await queryPhiDb(statusQuery, [orgId]);
    const byStatus: Record<string, number> = {};
    statusResult.rows.forEach(row => {
      byStatus[row.status] = parseInt(row.count, 10);
    });

    // Get last 7 days count
    const last7DaysQuery = `
      SELECT COUNT(*) as count
      FROM orders
      WHERE ${orgField} = $1
        AND created_at >= NOW() - INTERVAL '7 days'
    `;
    const last7DaysResult = await queryPhiDb(last7DaysQuery, [orgId]);
    const last7Days = parseInt(last7DaysResult.rows[0].count, 10);

    // Get last 30 days count
    const last30DaysQuery = `
      SELECT COUNT(*) as count
      FROM orders
      WHERE ${orgField} = $1
        AND created_at >= NOW() - INTERVAL '30 days'
    `;
    const last30DaysResult = await queryPhiDb(last30DaysQuery, [orgId]);
    const last30Days = parseInt(last30DaysResult.rows[0].count, 10);

    return {
      total,
      byStatus,
      last7Days,
      last30Days
    };
  } catch (error) {
    logger.error('Error getting order statistics:', {
      error,
      orgId,
      role
    });
    throw error;
  }
}