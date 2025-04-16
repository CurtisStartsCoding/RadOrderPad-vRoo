/**
 * Handler for presigned URL generation
 */
import { Response } from 'express';
import FileUploadService from '../../services/upload';
import { AuthenticatedRequest, PresignedUrlRequestBody, PresignedUrlResponse } from './types';
import { validatePresignedUrlRequest } from './validate-presigned-url-request';

/**
 * Generate a presigned URL for uploading a file to S3
 */
export async function getPresignedUrl(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const {
      fileType,
      fileName,
      contentType,
      orderId,
      patientId,
      documentType
    } = req.body as PresignedUrlRequestBody;

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
      documentType || 'document'
    );

    res.status(200).json({
      success: result.success,
      uploadUrl: result.presignedUrl,
      fileKey: result.filePath
    });
  } catch (error: any) {
    console.error('[UploadsController] Error generating presigned URL:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate upload URL'
    });
  }
}