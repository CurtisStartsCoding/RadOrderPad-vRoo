/**
 * Handler for creating a new order after validation
 */
import { Request, Response } from 'express';
import { getPhiDbClient } from '../../../config/db';
import { handleControllerError } from '../error-handling';
import { validateUserAuth } from '../validation';

/**
 * Create a new order after validation
 * @route PUT /api/orders/new
 */
export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    // Validate user authentication
    const userId = validateUserAuth(req, res);
    if (!userId) return;

    const {
      dictationText,
      patientInfo,
      validationResult,
      status,
      finalValidationStatus,
      finalCPTCode,
      clinicalIndication,
      finalICD10Codes,
      referring_organization_name
    } = req.body;

    // Validate required fields
    if (!dictationText || !validationResult || !finalValidationStatus || !finalCPTCode || !clinicalIndication) {
      res.status(400).json({
        message: 'Required fields missing: dictationText, validationResult, finalValidationStatus, finalCPTCode, clinicalIndication'
      });
      return;
    }

    // Get organization ID from the authenticated user
    const orgId = req.user?.orgId;
    if (!orgId) {
      res.status(401).json({ message: 'User authentication required' });
      return;
    }

    // Start a transaction
    const client = await getPhiDbClient();
    try {
      await client.query('BEGIN');

      // Create patient record if patient info is provided
      let patientId = patientInfo?.id || null;
      if (patientInfo && !patientId) {
        // Create a new patient record
        const patientResult = await client.query(
          `INSERT INTO patients (
            first_name, last_name, date_of_birth, gender, mrn,
            created_by_user_id, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id`,
          [
            patientInfo.firstName,
            patientInfo.lastName,
            patientInfo.dateOfBirth,
            patientInfo.gender,
            patientInfo.mrn,
            userId
          ]
        );
        patientId = patientResult.rows[0].id;
      }

      // Create the order record
      const orderResult = await client.query(
        `INSERT INTO orders (
          referring_organization_id, patient_id, original_dictation,
          status, final_validation_status, final_cpt_code, clinical_indication,
          final_icd10_codes, created_by_user_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING id`,
        [
          orgId,
          patientId,
          dictationText,
          status || 'pending_admin',
          finalValidationStatus,
          finalCPTCode,
          clinicalIndication,
          Array.isArray(finalICD10Codes) ? finalICD10Codes : [finalICD10Codes],
          userId
        ]
      );
      const orderId = orderResult.rows[0].id;

      // Log order creation in order_history
      await client.query(
        `INSERT INTO order_history (
          order_id, event_type, user_id, created_at, details
        ) VALUES ($1, $2, $3, NOW(), $4)`,
        [
          orderId,
          'created',
          userId,
          JSON.stringify({ referring_organization_name })
        ]
      );

      // Log validation attempt directly in the database
      await client.query(
        `INSERT INTO validation_attempts
        (order_id, attempt_number, validation_input_text, validation_outcome,
        generated_icd10_codes, generated_cpt_codes, generated_feedback_text,
        generated_compliance_score, user_id, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
        [
          orderId,
          1, // First attempt
          dictationText,
          validationResult.validationStatus,
          JSON.stringify(validationResult.suggestedICD10Codes),
          JSON.stringify(validationResult.suggestedCPTCodes),
          validationResult.feedback,
          validationResult.complianceScore,
          userId
        ]
      );

      // Commit the transaction
      await client.query('COMMIT');

      // Return success response
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        orderId
      });
    } catch (error) {
      // Rollback the transaction on error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (error) {
    handleControllerError(error, res, 'Error creating order');
  }
}