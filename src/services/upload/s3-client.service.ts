import { S3Client } from '@aws-sdk/client-s3';
import config from '../../config/config';
import { S3ClientSingleton } from './types';
import logger from '../../utils/logger';

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
          logger.error('AWS credentials not configured. Check environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY');
          throw new Error('AWS credentials not configured');
        }
        
        if (!config.aws.s3.bucketName) {
          logger.error('S3 bucket name not configured. Check environment variable S3_BUCKET_NAME');
          throw new Error('S3 bucket name not configured');
        }
        
        logger.debug('Initializing S3 client', {
          region: config.aws.region,
          bucketName: config.aws.s3.bucketName,
          // Mask credentials for security while still providing debugging info
          accessKeyIdProvided: !!config.aws.accessKeyId,
          secretAccessKeyProvided: !!config.aws.secretAccessKey
        });
        
        this.client = new S3Client({
          region: config.aws.region,
          credentials: {
            accessKeyId: config.aws.accessKeyId as string,
            secretAccessKey: config.aws.secretAccessKey as string
          }
        });
        
        logger.info('S3 client initialized successfully');
      }
      return this.client;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      logger.error('Error initializing S3 client', {
        error: errorMessage,
        stack: errorStack
      });
      throw error;
    }
  }
};

export default s3ClientSingleton;