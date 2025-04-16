import { SESClient } from '@aws-sdk/client-ses';
import config from '../../../config/config';

/**
 * Create and configure an AWS SES client
 */
export function createSesClient(): SESClient {
  return new SESClient({
    region: config.aws.region,
    credentials: {
      accessKeyId: config.aws.accessKeyId || '',
      secretAccessKey: config.aws.secretAccessKey || ''
    }
  });
}

// Create and export a singleton instance
export const sesClient = createSesClient();