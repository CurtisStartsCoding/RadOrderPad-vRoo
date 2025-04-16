import { S3Client } from '@aws-sdk/client-s3';

/**
 * Interface for presigned URL response
 */
export interface PresignedUrlResponse {
  success: boolean;
  presignedUrl: string;
  filePath: string;
}

/**
 * Interface for upload confirmation response
 */
export interface UploadConfirmationResponse {
  success: boolean;
  documentId: number;
}

/**
 * Interface for S3 client singleton
 */
export interface S3ClientSingleton {
  client: S3Client | null;
  getClient(): S3Client;
}