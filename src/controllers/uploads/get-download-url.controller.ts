/**
 * Controller for generating a presigned URL for downloading a file from S3
 */
import { Request, Response } from 'express';
import enhancedLogger from '../../utils/enhanced-logger';
import * as uploadService from '../../services/upload/get-download-url.service';

/**
 * Generate a presigned URL for downloading a file from S3
 * @param req Express request object
 * @param res Express response object
 */
export async function getDownloadUrl(req: Request, res: Response): Promise<void> {
  try {
    // Get user ID and organization ID from the authenticated user
    const requestingUserId = req.user?.userId;
    const requestingOrgId = req.user?.orgId;

    if (!requestingUserId || !requestingOrgId) {
      enhancedLogger.warn('Unauthorized attempt to get download URL', {
        endpoint: 'getDownloadUrl',
        userId: requestingUserId,
        orgId: requestingOrgId
      });
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Extract and validate documentId from request parameters
    const documentId = parseInt(req.params.documentId, 10);
    if (isNaN(documentId)) {
      enhancedLogger.warn('Invalid document ID format', {
        endpoint: 'getDownloadUrl',
        documentId: req.params.documentId,
        userId: requestingUserId
      });
      res.status(400).json({ success: false, message: 'Invalid document ID format' });
      return;
    }

    // Call the service function to get the download URL
    const result = await uploadService.getDownloadUrl(documentId, requestingUserId, requestingOrgId);

    // Return the download URL
    res.status(200).json({
      success: true,
      downloadUrl: result.downloadUrl
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Handle specific error types
    if (errorMessage.includes('Document not found') || errorMessage.includes('Access Denied')) {
      enhancedLogger.warn('Document access denied or not found', {
        endpoint: 'getDownloadUrl',
        documentId: req.params.documentId,
        userId: req.user?.userId,
        orgId: req.user?.orgId,
        error: errorMessage
      });
      
      // Use 404 for both "not found" and "access denied" to avoid leaking information
      res.status(404).json({ success: false, message: 'Document not found' });
      return;
    }
    
    // Log the error
    enhancedLogger.error('Error generating download URL', {
      endpoint: 'getDownloadUrl',
      documentId: req.params.documentId,
      userId: req.user?.userId,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Return a generic error message
    res.status(500).json({ success: false, message: 'Error generating download URL' });
  }
}