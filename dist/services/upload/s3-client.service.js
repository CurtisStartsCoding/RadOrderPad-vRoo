"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3ClientSingleton = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = __importDefault(require("../../config/config"));
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
                    throw new Error('AWS credentials not configured');
                }
                console.log('[FileUploadService] Initializing S3 client');
                this.client = new client_s3_1.S3Client({
                    region: config_1.default.aws.region,
                    credentials: {
                        accessKeyId: config_1.default.aws.accessKeyId,
                        secretAccessKey: config_1.default.aws.secretAccessKey
                    }
                });
            }
            return this.client;
        }
        catch (error) {
            console.error(`[FileUploadService] Error initializing S3 client: ${error.message}`);
            throw error;
        }
    }
};
exports.default = exports.s3ClientSingleton;
//# sourceMappingURL=s3-client.service.js.map