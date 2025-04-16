import { SESClient } from '@aws-sdk/client-ses';
/**
 * Create and configure an AWS SES client
 */
export declare function createSesClient(): SESClient;
export declare const sesClient: SESClient;
