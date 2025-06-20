import { OrderStatus } from '../../../../models';
import { OrderFilters } from '../types';

/**
 * Build the count query for pagination
 * @param orgId Radiology organization ID
 * @param filters Filter parameters
 * @returns Object containing the query string and parameters
 */
export function buildCountQuery(orgId: number, filters: OrderFilters = {}): { query: string; params: any[] } {
  // Check if this is a scheduler user
  if (filters.userRole === 'scheduler') {
    return buildSchedulerCountQuery(orgId, filters);
  }

  // Build the count query
  let countQuery = `
    SELECT COUNT(*) as total
    FROM orders o
    WHERE o.radiology_organization_id = $1
  `;
  
  const countParams: any[] = [orgId];
  
  // Add status filter only if a specific status is requested
  let countParamIndex = 2;
  if (filters.status && filters.status !== 'all') {
    countQuery += ` AND o.status = $${countParamIndex}`;
    countParams.push(filters.status);
    countParamIndex++;
  }
  
  // Add the same filters as the main query
  if (filters.referringOrgId) {
    countQuery += ` AND o.referring_organization_id = $${countParamIndex}`;
    countParams.push(filters.referringOrgId);
    countParamIndex++;
  }
  
  if (filters.priority) {
    countQuery += ` AND o.priority = $${countParamIndex}`;
    countParams.push(filters.priority);
    countParamIndex++;
  }
  
  if (filters.modality) {
    countQuery += ` AND o.modality = $${countParamIndex}`;
    countParams.push(filters.modality);
    countParamIndex++;
  }
  
  if (filters.startDate) {
    countQuery += ` AND o.created_at >= $${countParamIndex}`;
    countParams.push(filters.startDate.toISOString());
    countParamIndex++;
  }
  
  if (filters.endDate) {
    countQuery += ` AND o.created_at <= $${countParamIndex}`;
    countParams.push(filters.endDate.toISOString());
    countParamIndex++;
  }
  
  if (filters.validationStatus) {
    countQuery += ` AND o.final_validation_status = $${countParamIndex}`;
    countParams.push(filters.validationStatus);
    countParamIndex++;
  }
  
  return { query: countQuery, params: countParams };
}

/**
 * Build the count query for scheduler users, including orders from connected organizations
 * @param orgId Radiology organization ID
 * @param filters Filter parameters
 * @returns Object containing the query string and parameters
 */
export function buildSchedulerCountQuery(orgId: number, filters: OrderFilters = {}): { query: string; params: any[] } {
  // Build the count query for scheduler users
  let countQuery = `
    SELECT COUNT(*) as total
    FROM orders o
    WHERE o.radiology_organization_id = $1
    OR o.referring_organization_id IN (
      SELECT CASE
        WHEN organization_id = $1 THEN related_organization_id
        WHEN related_organization_id = $1 THEN organization_id
      END
      FROM organization_relationships
      WHERE (organization_id = $1 OR related_organization_id = $1)
      AND status = 'active'
    )
  `;
  
  const countParams: any[] = [orgId];
  
  // Add status filter only if a specific status is requested
  let countParamIndex = 2;
  if (filters.status && filters.status !== 'all') {
    countQuery += ` AND o.status = $${countParamIndex}`;
    countParams.push(filters.status);
    countParamIndex++;
  }
  
  // Add the same filters as the main query
  if (filters.referringOrgId) {
    countQuery += ` AND o.referring_organization_id = $${countParamIndex}`;
    countParams.push(filters.referringOrgId);
    countParamIndex++;
  }
  
  if (filters.priority) {
    countQuery += ` AND o.priority = $${countParamIndex}`;
    countParams.push(filters.priority);
    countParamIndex++;
  }
  
  if (filters.modality) {
    countQuery += ` AND o.modality = $${countParamIndex}`;
    countParams.push(filters.modality);
    countParamIndex++;
  }
  
  if (filters.startDate) {
    countQuery += ` AND o.created_at >= $${countParamIndex}`;
    countParams.push(filters.startDate.toISOString());
    countParamIndex++;
  }
  
  if (filters.endDate) {
    countQuery += ` AND o.created_at <= $${countParamIndex}`;
    countParams.push(filters.endDate.toISOString());
    countParamIndex++;
  }
  
  if (filters.validationStatus) {
    countQuery += ` AND o.final_validation_status = $${countParamIndex}`;
    countParams.push(filters.validationStatus);
    countParamIndex++;
  }
  
  return { query: countQuery, params: countParams };
}

export default buildCountQuery;