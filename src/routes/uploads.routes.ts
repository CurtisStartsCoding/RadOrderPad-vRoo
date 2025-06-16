import { Router } from 'express';
import { UploadsController } from '../controllers/uploads';
import { authenticateJWT, authorizeRole } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateJWT);

// Route to get a presigned URL for uploading a file
router.post(
  '/presigned-url',
  authorizeRole(['physician', 'admin_referring', 'admin_radiology', 'radiologist', 'admin_staff', 'scheduler']),
  UploadsController.getPresignedUrl
);

// Route to confirm a file upload
router.post(
  '/confirm',
  authorizeRole(['physician', 'admin_referring', 'admin_radiology', 'radiologist', 'admin_staff', 'scheduler']),
  UploadsController.confirmUpload
);

// Route to get a presigned URL for downloading a file
router.get(
  '/:documentId/download-url',
  UploadsController.getDownloadUrl
);

export default router;