/**
 * Signature Handling Service
 * 
 * This service handles the processing and storage of signature data.
 */

import { PoolClient } from 'pg';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Handle signature data for order
 * 
 * @param client Database client
 * @param orderId Order ID
 * @param patientId Patient ID
 * @param userId User ID
 * @param signatureData Signature data (base64 string or fileKey)
 * @returns Document upload ID
 */
export async function handleSignature(
  client: PoolClient,
  orderId: number,
  patientId: number,
  userId: number,
  signatureData: string
): Promise<number> {
  try {
    let fileKey: string;
    
    // Check if signatureData is already a fileKey (from a prior presigned URL upload)
    if (signatureData.startsWith('signatures/') || signatureData.startsWith('uploads/')) {
      fileKey = signatureData;
    } else {
      // For base64 data, we would normally upload to S3 here
      // For simplicity in this implementation, we'll just store a reference
      // In a real implementation, this would call a file upload service
      fileKey = `signatures/${orderId}_${Date.now()}.png`;
      
      // TODO: In a real implementation, upload the base64 data to S3
      // const uploadResult = await fileUploadService.uploadBase64ToS3(signatureData, fileKey);
      // fileKey = uploadResult.fileKey;
    }
    
    // Create document upload record
    const uploadResult = await client.query(
      `INSERT INTO document_uploads (
        order_id,
        patient_id,
        uploaded_by_user_id,
        file_key,
        file_name,
        file_type,
        document_type,
        created_at,
        updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, NOW(), NOW()
      ) RETURNING id`,
      [
        orderId,
        patientId,
        userId,
        fileKey,
        'signature.png',
        'image/png',
        'signature',
      ]
    );
    
    return uploadResult.rows[0].id;
  } catch (error) {
    enhancedLogger.error('Error in handleSignature:', error);
    throw error;
  }
}