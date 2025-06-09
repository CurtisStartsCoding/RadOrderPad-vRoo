/**
 * Patient Handling Service
 * 
 * This service handles patient-related operations for order creation,
 * including finding existing patients or creating new ones.
 */

import { PoolClient } from 'pg';
import { PatientInfoForOrder } from './types';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Handle patient for order creation
 * Either find an existing patient by ID or create a new patient
 * 
 * @param client Database client
 * @param patientInfo Patient information
 * @param organizationId Organization ID
 * @returns Patient ID
 */
export async function handlePatient(
  client: PoolClient,
  patientInfo: PatientInfoForOrder,
  organizationId: number
): Promise<number> {
  try {
    // If patient ID is provided, verify the patient exists and belongs to the organization
    if (patientInfo.id) {
      const patientResult = await client.query(
        `SELECT id FROM patients 
         WHERE id = $1 AND organization_id = $2`,
        [patientInfo.id, organizationId]
      );
      
      if (patientResult.rows.length === 0) {
        throw new Error(`Patient not found or not accessible: ${patientInfo.id}`);
      }
      
      return patientInfo.id;
    }
    
    // Otherwise, create a new patient
    // Generate a PIDN (Patient Identifier)
    const pidn = patientInfo.pidn || `P-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const patientResult = await client.query(
      `INSERT INTO patients 
       (organization_id, pidn, first_name, last_name, date_of_birth, gender, mrn, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
       RETURNING id`,
      [
        organizationId,
        pidn,
        patientInfo.firstName,
        patientInfo.lastName,
        patientInfo.dateOfBirth,
        patientInfo.gender,
        patientInfo.mrn || null
      ]
    );
    
    return patientResult.rows[0].id;
  } catch (error) {
    enhancedLogger.error('Error in handlePatient:', error);
    throw error;
  }
}