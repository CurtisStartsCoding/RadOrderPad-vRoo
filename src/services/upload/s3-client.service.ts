import { S3Client } from '@aws-sdk/client-s3';
import config from '../../config/config';
import { S3ClientSingleton } from './types';

/**
 * Singleton for S3 client
 */
export const s3ClientSingleton: S3ClientSingleton = {
  client: null,
  
  /**
   * Get or initialize the S3 client
   * @returns The S3 client instance
   * @throws Error if AWS credentials are not configured
   */
  getClient(): S3Client {
    try {
      if (!this.client) {
        // Ensure AWS credentials are configured
        if (!config.aws.accessKeyId || !config.aws.secretAccessKey) {
          throw new Error('AWS credentials not configured');
        }
        
        console.log('[FileUploadService] Initializing S3 client');
        
        this.client = new S3Client({
          region: config.aws.region,
          credentials: {
            accessKeyId: config.aws.accessKeyId as string,
            secretAccessKey: config.aws.secretAccessKey as string
          }
        });
      }
      return this.client;
    } catch (error: any) {
      console.error(`[FileUploadService] Error initializing S3 client: ${error.message}`);
      throw error;
    }
  }
};

export default s3ClientSingleton;