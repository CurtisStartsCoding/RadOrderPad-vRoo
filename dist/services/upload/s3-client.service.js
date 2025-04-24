"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3ClientSingleton = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = __importDefault(require("../../config/config"));
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Singleton for S3 client
 */
exports.s3ClientSingleton = {
    client: null,
    /**
     * Get or initialize the S3 client
     * @returns The S3 client instance
     * @throws Error if AWS credentials are not configured
     */
    getClient() {
        try {
            if (!this.client) {
                // Ensure AWS credentials are configured
                if (!config_1.default.aws.accessKeyId || !config_1.default.aws.secretAccessKey) {
                    logger_1.default.error('AWS credentials not configured. Check environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY');
                    throw new Error('AWS credentials not configured');
                }
                if (!config_1.default.aws.s3.bucketName) {
                    logger_1.default.error('S3 bucket name not configured. Check environment variable S3_BUCKET_NAME');
                    throw new Error('S3 bucket name not configured');
                }
                logger_1.default.debug('Initializing S3 client', {
                    region: config_1.default.aws.region,
                    bucketName: config_1.default.aws.s3.bucketName,
                    // Mask credentials for security while still providing debugging info
                    accessKeyIdProvided: !!config_1.default.aws.accessKeyId,
                    secretAccessKeyProvided: !!config_1.default.aws.secretAccessKey
                });
                this.client = new client_s3_1.S3Client({
                    region: config_1.default.aws.region,
                    credentials: {
                        accessKeyId: config_1.default.aws.accessKeyId,
                        secretAccessKey: config_1.default.aws.secretAccessKey
                    }
                });
                logger_1.default.info('S3 client initialized successfully');
            }
            return this.client;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            logger_1.default.error('Error initializing S3 client', {
                error: errorMessage,
                stack: errorStack
            });
            throw error;
        }
    }
};
exports.default = exports.s3ClientSingleton;
//# sourceMappingURL=s3-client.service.js.map