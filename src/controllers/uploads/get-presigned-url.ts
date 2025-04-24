/**
 * Handler for presigned URL generation
 */
import { Response } from 'express';
import FileUploadService from '../../services/upload';
import { AuthenticatedRequest, PresignedUrlRequestBody } from './types';
import { validatePresignedUrlRequest } from './validate-presigned-url-request';
import logger from '../../utils/logger';

/**
 * Generate a presigned URL for uploading a file to S3
 */
export async function getPresignedUrl(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.userId || !req.user.orgId) {
      logger.warn('Unauthorized attempt to get presigned URL', {
        ip: req.ip,
        path: req.path
      });
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User authentication required'
      });
      return;
    }
    
    const {
      fileType,
      fileName,
      contentType,
      orderId,
      patientId,
      documentType,
      fileSize
    } = req.body as PresignedUrlRequestBody;
    
    logger.debug('Presigned URL request received', {
      userId: req.user.userId,
      orgId: req.user.orgId,
      fileType,
      fileName,
      contentType,
      orderId,
      patientId,
      documentType,
      fileSize
    });

    // Validate the request
    if (!validatePresignedUrlRequest(req, res)) {
      return;
    }

    // Generate presigned URL
    const result = await FileUploadService.getUploadUrl(
      fileType,
      fileName,
      contentType,
      orderId,
      patientId,
      documentType || 'document',
      fileSize
    );

    logger.info('Presigned URL generated successfully', {
      userId: req.user.userId,
      fileKey: result.filePath
    });
    
    res.status(200).json({
      success: result.success,
      uploadUrl: result.presignedUrl,
      fileKey: result.filePath
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate upload URL';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    logger.error('Error generating presigned URL', {
      error: errorMessage,
      stack: errorStack,
      userId: req.user?.userId,
      orgId: req.user?.orgId
    });
    
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
}