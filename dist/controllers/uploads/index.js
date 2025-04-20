"use strict";
/**
 * Uploads controller module
 *
 * This module provides functionality for handling file uploads,
 * including generating presigned URLs and confirming uploads.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsController = exports.confirmUpload = exports.getPresignedUrl = exports.validateConfirmUploadRequest = exports.validatePresignedUrlRequest = void 0;
// Export types
__exportStar(require("./types"), exports);
// Export validation functions
var validate_presigned_url_request_1 = require("./validate-presigned-url-request");
Object.defineProperty(exports, "validatePresignedUrlRequest", { enumerable: true, get: function () { return validate_presigned_url_request_1.validatePresignedUrlRequest; } });
var validate_confirm_upload_request_1 = require("./validate-confirm-upload-request");
Object.defineProperty(exports, "validateConfirmUploadRequest", { enumerable: true, get: function () { return validate_confirm_upload_request_1.validateConfirmUploadRequest; } });
// Export handler functions
var get_presigned_url_1 = require("./get-presigned-url");
Object.defineProperty(exports, "getPresignedUrl", { enumerable: true, get: function () { return get_presigned_url_1.getPresignedUrl; } });
var confirm_upload_1 = require("./confirm-upload");
Object.defineProperty(exports, "confirmUpload", { enumerable: true, get: function () { return confirm_upload_1.confirmUpload; } });
const get_presigned_url_2 = require("./get-presigned-url");
const confirm_upload_2 = require("./confirm-upload");
/**
 * Controller for handling file uploads
 */
class UploadsController {
    /**
     * Generate a presigned URL for uploading a file to S3
     */
    static async getPresignedUrl(req, res) {
        return (0, get_presigned_url_2.getPresignedUrl)(req, res);
    }
    /**
     * Confirm a file upload and record it in the database
     */
    static async confirmUpload(req, res) {
        return (0, confirm_upload_2.confirmUpload)(req, res);
    }
}
exports.UploadsController = UploadsController;
// Export UploadsController as default for backward compatibility
exports.default = UploadsController;
//# sourceMappingURL=index.js.map