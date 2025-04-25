/**
 * Service for generating a presigned URL for downloading a file from S3
 */
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { queryPhiDb } from '../../config/db';
import config from '../../config/config';
import { s3ClientSingleton } from './s3-client.service';
import enhancedLogger from '../../utils/enhanced-logger';
import { DownloadUrlResponse } from './types';

/**
 * Generate a presigned URL for downloading a file from S3
 * @param documentId The ID of the document to download
 * @param requestingUserId The ID of the user requesting the download
 * @param requestingOrgId The ID of the organization the requesting user belongs to
 * @returns Object containing the presigned URL
 * @throws Error if document not found, access denied, or S3 error
 */
export async function getDownloadUrl(
  documentId: number,
  requestingUserId: number,
  requestingOrgId: number
): Promise<DownloadUrlResponse> {
  try {
    enhancedLogger.debug('Generating download URL', {
      documentId,
      requestingUserId,
      requestingOrgId
    });

    // Fetch document record and verify access
    const result = await queryPhiDb(
      `SELECT 
        du.file_path, 
        du.order_id, 
        du.patient_id, 
        o.referring_organization_id as order_org_id, 
        p.organization_id as patient_org_id 
      FROM document_uploads du 
      LEFT JOIN orders o ON du.order_id = o.id 
      LEFT JOIN patients p ON du.patient_id = p.id 
      WHERE du.id = $1`,
      [documentId]
    );

    // Check if document exists
    if (result.rows.length === 0) {
      enhancedLogger.warn('Document not found', { documentId });
      throw new Error('Document not found');
    }

    const { file_path: filePath, order_org_id: orderOrgId, patient_org_id: patientOrgId } = result.rows[0];

    // Authorization check
    const hasAccess = (orderOrgId && orderOrgId === requestingOrgId) || 
                      (patientOrgId && patientOrgId === requestingOrgId);
    
    if (!hasAccess) {
      enhancedLogger.warn('Access denied to document', {
        documentId,
        requestingUserId,
        requestingOrgId,
        orderOrgId,
        patientOrgId
      });
      throw new Error('Access Denied');
    }

    // Generate presigned GET URL
    const s3Client = s3ClientSingleton.getClient();
    const bucketName = config.aws.s3.bucketName;

    enhancedLogger.debug('Generating S3 presigned URL', {
      bucket: bucketName,
      key: filePath
    });

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: filePath
    });

    // Generate presigned URL with 5-minute expiry
    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    enhancedLogger.info('Generated download URL', {
      documentId,
      requestingUserId,
      expiresIn: 300
    });

    return {
      success: true,
      downloadUrl
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    enhancedLogger.error('Error generating download URL', {
      documentId,
      requestingUserId,
      error: errorMessage,
      stack: errorStack
    });

    throw error;
  }
}