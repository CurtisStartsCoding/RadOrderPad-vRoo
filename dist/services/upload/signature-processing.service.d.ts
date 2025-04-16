/**
 * Process a signature upload (for backward compatibility with existing code)
 *
 * Note: This method might be redundant if the frontend converts the canvas to a Blob/File
 * and uses the standard presigned URL flow. Consider deprecating this method in the future.
 *
 * @param orderId The order ID
 * @param signatureData Base64 encoded signature data
 * @param userId The user ID of the uploader
 * @returns The URL of the uploaded signature or null if no signature data provided
 */
export declare function processSignature(orderId: number, signatureData?: string, userId?: number): Promise<string | null>;
export default processSignature;
