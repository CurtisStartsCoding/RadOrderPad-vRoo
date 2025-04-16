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
export declare function handleSignatureUpload(orderId: number, userId: number): Promise<{
    presignedUrl: string;
    fileKey: string;
}>;
