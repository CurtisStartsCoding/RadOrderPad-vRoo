import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { queryPhiDb } from '../../config/db';
import config from '../../config/config';
import { PresignedUrlResponse } from './types';
import s3ClientSingleton from './s3-client.service';
import logger from '../../utils/logger';

/**
 * Generate a presigned URL for uploading a file to S3
 * @param fileType The MIME type of the file
 * @param fileName The name of the file
 * @param contentType The content type of the file
 * @param orderId Optional order ID to associate with the upload
 * @param patientId Optional patient ID to associate with the upload
 * @param documentType The type of document (e.g., 'signature', 'report', etc.)
 * @returns Object containing the presigned URL and the file key
 */
export async function getUploadUrl(
  fileType: string,
  fileName: string,
  contentType: string,
  orderId?: number,
  patientId?: number,
  documentType: string = 'signature',
  fileSize?: number
): Promise<PresignedUrlResponse> {
  try {
    logger.debug('Generating presigned URL', {
      fileType,
      fileName,
      contentType,
      orderId,
      patientId,
      documentType,
      fileSize
    });
    
    // Validate inputs
    if (!fileType || !fileName || !contentType) {
      logger.warn('Missing required parameters for presigned URL generation');
      throw new Error('Missing required parameters: fileType, fileName, or contentType');
    }

    // Ensure AWS credentials are configured
    if (!config.aws.accessKeyId || !config.aws.secretAccessKey || !config.aws.s3.bucketName) {
      logger.error('AWS credentials or S3 bucket name not configured');
      throw new Error('AWS credentials or S3 bucket name not configured');
    }

    // Validate file type
    const allowedFileTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'application/pdf',
      'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedFileTypes.includes(contentType)) {
      logger.warn(`File type ${contentType} is not allowed`);
      throw new Error(`File type ${contentType} is not allowed. Allowed types: ${allowedFileTypes.join(', ')}`);
    }
    
    // Validate file size if provided
    if (fileSize) {
      const maxSizeBytes = contentType === 'application/pdf'
        ? 20 * 1024 * 1024  // 20MB for PDFs
        : 5 * 1024 * 1024;  // 5MB for other files
        
      if (fileSize > maxSizeBytes) {
        logger.warn(`File size (${Math.round(fileSize / (1024 * 1024))}MB) exceeds the maximum allowed size (${Math.round(maxSizeBytes / (1024 * 1024))}MB)`);
        throw new Error(`File size (${Math.round(fileSize / (1024 * 1024))}MB) exceeds the maximum allowed size (${Math.round(maxSizeBytes / (1024 * 1024))}MB)`);
      }
    }
    
    // Generate a unique file key
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    // Get organization ID (we'll need to query for this based on the order or user)
    let organizationId = 0;
    if (orderId) {
      try {
        const orderResult = await queryPhiDb(
          'SELECT referring_organization_id FROM orders WHERE id = $1',
          [orderId]
        );
        
        if (orderResult.rows.length > 0) {
          organizationId = orderResult.rows[0].referring_organization_id;
          logger.debug(`Found organization ID ${organizationId} for order ${orderId}`);
        } else {
          logger.warn(`No organization found for order ${orderId}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Error getting organization ID from order', {
          error: errorMessage,
          orderId
        });
      }
    }
    
    // Create a path structure following the specification:
    // uploads/{organization_id}/{context_type}/{id}/{uuid}_{filename}
    const contextType = orderId ? 'orders' : (patientId ? 'patients' : 'general');
    const contextId = orderId || patientId || 'no_id';
    
    const fileKey = `uploads/${organizationId}/${contextType}/${contextId}/${timestamp}_${randomString}_${sanitizedFileName}`;

    // Create the S3 command
    const command = new PutObjectCommand({
      Bucket: config.aws.s3.bucketName,
      Key: fileKey,
      ContentType: contentType
      // NOTE: Do not include ChecksumAlgorithm at all to prevent default CRC32
      // AWS SDK v3.729.0+ defaults to CRC32 if undefined, causing browser upload failures
      // HIPAA compliance is maintained through:
      // 1. HTTPS/TLS encryption in transit
      // 2. S3 server-side encryption at rest
      // 3. Client-side integrity verification (hash stored in DB)
      // 4. CloudTrail audit logging
    });

    // Generate the presigned URL
    const s3Client = s3ClientSingleton.getClient();
    const presignedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600 // URL expires in 1 hour
    });

    logger.info(`Generated presigned URL for ${fileKey}`, {
      fileKey,
      expiresIn: 3600,
      contentType
    });
    
    return {
      success: true,
      presignedUrl,
      filePath: fileKey
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    logger.error('Error generating presigned URL', {
      error: errorMessage,
      stack: errorStack,
      fileType,
      fileName,
      contentType
    });
    throw error;
  }
}

export default getUploadUrl;