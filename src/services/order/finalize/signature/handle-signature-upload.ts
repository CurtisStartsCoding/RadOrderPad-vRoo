import { getUploadUrl } from '../../../upload';

/**
 * Handle signature upload
 *
 * Note: This function now returns the presigned URL for the frontend to use.
 * The frontend should convert the signature canvas to a Blob and upload it directly to S3 using this URL.
 * After successful upload, the frontend should call the confirmUpload endpoint.
 *
 * @param orderId The ID of the order
 * @returns Promise that resolves to the presigned URL and file key
 */
export async function handleSignatureUpload(
  orderId: number
): Promise<{ presignedUrl: string; fileKey: string }> {
  // Generate a filename for the signature
  const fileName = `signature_${orderId}_${Date.now()}.png`;
  const contentType = 'image/png';
  const documentType = 'signature';
  
  // Get a presigned URL for uploading the signature
  const result = await getUploadUrl(
    contentType,
    fileName,
    contentType,
    orderId,
    undefined, // patientId will be looked up by the service
    documentType
  );
  
  if (!result.success || !result.presignedUrl || !result.filePath) {
    throw new Error('Failed to generate presigned URL for signature upload');
  }
  
  console.warn(`Signature presigned URL generated: ${result.presignedUrl}`);
  
  return {
    presignedUrl: result.presignedUrl,
    fileKey: result.filePath
  };
}