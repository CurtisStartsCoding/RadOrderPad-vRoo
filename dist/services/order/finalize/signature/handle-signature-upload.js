"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSignatureUpload = handleSignatureUpload;
const upload_1 = require("../../../upload");
/**
 * Handle signature upload
 *
 * Note: This function now returns the presigned URL for the frontend to use.
 * The frontend should convert the signature canvas to a Blob and upload it directly to S3 using this URL.
 * After successful upload, the frontend should call the confirmUpload endpoint.
 *
 * @param orderId The ID of the order
 * @param userId The ID of the user uploading the signature
 * @returns Promise that resolves to the presigned URL and file key
 */
async function handleSignatureUpload(orderId, userId) {
    // Generate a filename for the signature
    const fileName = `signature_${orderId}_${Date.now()}.png`;
    const contentType = 'image/png';
    const documentType = 'signature';
    // Get a presigned URL for uploading the signature
    const result = await (0, upload_1.getUploadUrl)(contentType, fileName, contentType, orderId, undefined, // patientId will be looked up by the service
    documentType);
    if (!result.success || !result.presignedUrl || !result.filePath) {
        throw new Error('Failed to generate presigned URL for signature upload');
    }
    console.log(`Signature presigned URL generated: ${result.presignedUrl}`);
    return {
        presignedUrl: result.presignedUrl,
        fileKey: result.filePath
    };
}
//# sourceMappingURL=handle-signature-upload.js.map