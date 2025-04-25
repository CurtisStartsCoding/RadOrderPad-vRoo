import { queryMainDb } from '../../../config/db';
import logger from '../../../utils/logger';
import { Organization } from '../types';

/**
 * List all organizations with optional filtering
 * 
 * @param filters Optional filters for organizations
 * @returns Promise with array of organizations
 */
export async function listAllOrganizations(filters: {
  name?: string;
  type?: string;
  status?: string;
}): Promise<Organization[]> {
  try {
    // Start building the query
    let query = `
      SELECT * 
      FROM organizations
      WHERE 1=1
    `;
    
    // Add filters if provided
    const params: (string)[] = [];
    let paramIndex = 1;
    
    if (filters.name) {
      query += ` AND name ILIKE $${paramIndex}`;
      params.push(`%${filters.name}%`);
      paramIndex++;
    }
    
    if (filters.type) {
      query += ` AND type = $${paramIndex}`;
      params.push(filters.type);
      paramIndex++;
    }
    
    if (filters.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }
    
    // Add ordering
    query += ` ORDER BY name ASC`;
    
    // Execute the query
    const result = await queryMainDb(query, params);
    return result.rows;
  } catch (error) {
    logger.error('Error listing organizations:', {
      error,
      filters
    });
    throw error;
  }
}