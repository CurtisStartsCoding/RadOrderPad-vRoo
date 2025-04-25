"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploads_1 = require("../controllers/uploads");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(auth_1.authenticateJWT);
// Route to get a presigned URL for uploading a file
router.post('/presigned-url', (0, auth_1.authorizeRole)(['physician', 'admin_referring', 'admin_radiology', 'radiologist', 'admin_staff']), uploads_1.UploadsController.getPresignedUrl);
// Route to confirm a file upload
router.post('/confirm', (0, auth_1.authorizeRole)(['physician', 'admin_referring', 'admin_radiology', 'radiologist', 'admin_staff']), uploads_1.UploadsController.confirmUpload);
// Route to get a presigned URL for downloading a file
router.get('/:documentId/download-url', uploads_1.UploadsController.getDownloadUrl);
exports.default = router;
//# sourceMappingURL=uploads.routes.js.map