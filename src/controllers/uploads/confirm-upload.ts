/**
 * Handler for upload confirmation
 */
import { Response } from 'express';
import FileUploadService from '../../services/upload';
import { AuthenticatedRequest, ConfirmUploadRequestBody, ConfirmUploadResponse } from './types';
import { validateConfirmUploadRequest } from './validate-confirm-upload-request';
import logger from '../../utils/logger';

/**
 * Confirm a file upload and record it in the database
 */
export async function confirmUpload(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const {
      fileKey,
      orderId,
      patientId,
      documentType,
      fileName,
      fileSize,
      contentType,
      processingStatus = 'uploaded' // Default to 'uploaded' if not provided
    } = req.body as ConfirmUploadRequestBody;

    // Validate the request
    if (!(await validateConfirmUploadRequest(req, res))) {
      return;
    }

    const userId = req.user?.userId as number;

    // Confirm upload
    const result = await FileUploadService.confirmUpload(
      fileKey,
      orderId,
      patientId,
      documentType,
      fileName,
      fileSize,
      contentType,
      userId,
      processingStatus
    );

    res.status(200).json({
      success: result.success,
      documentId: result.documentId,
      message: 'Upload confirmed and recorded'
    });
  } catch (error: any) {
    logger.error('[UploadsController] Error confirming upload:', {
      error,
      userId: req.user?.userId,
      orderId: req.body?.orderId
    });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to confirm upload'
    });
  }
}