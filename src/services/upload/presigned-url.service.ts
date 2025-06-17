import { Request, Response } from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3ClientSingleton } from './s3-client.service';
import config from '../../config/config';
import logger from '../../utils/logger';
import { AuthTokenPayload } from '../../models';
import { randomString } from '../../utils/random-string';

interface PresignedUrlRequest {
  fileType: string;
  fileName: string;
  contentType?: string;
  context?: {
    type: 'orders' | 'patients' | 'general';
    id?: number;
  };
}

interface PresignedUrlResponse {
  uploadUrl: string;
  fileKey: string;
}

// Define allowed content types for uploads
const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Size limits by file type (kept for future use)
const _SIZE_LIMITS: { [key: string]: number } = {
  'application/pdf': 20 * 1024 * 1024, // 20MB for PDFs
  'default': 5 * 1024 * 1024 // 5MB for other files
};

export async function generatePresignedUrl(
  body: PresignedUrlRequest,
  user: AuthTokenPayload
): Promise<PresignedUrlResponse> {
  const { fileName, contentType, context } = body;
  
  // Validate content type
  const finalContentType = contentType || body.fileType;
  if (!ALLOWED_CONTENT_TYPES.includes(finalContentType)) {
    throw new Error(`File type ${finalContentType} is not allowed`);
  }

  // Generate file key with organization context
  const timestamp = Date.now();
  const randomStr = randomString(11);
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  // Build path based on context
  let pathPrefix = `uploads/${user.orgId}`;
  if (context) {
    pathPrefix += `/${context.type}`;
    if (context.id) {
      pathPrefix += `/${context.id}`;
    } else {
      pathPrefix += '/no_id';
    }
  } else {
    pathPrefix += '/general/no_id';
  }
  
  const fileKey = `${pathPrefix}/${timestamp}_${randomStr}_${sanitizedFileName}`;

  logger.info(`Generating presigned URL for file upload`, {
    userId: user.userId,
    orgId: user.orgId,
    fileKey,
    contentType: finalContentType,
    context
  });

  // Create the S3 command
  const command = new PutObjectCommand({
    Bucket: config.aws.s3.bucketName,
    Key: fileKey,
    ContentType: finalContentType
    // NOTE: We don't specify ChecksumAlgorithm to prevent the default CRC32 
    // that was added in AWS SDK v3.729.0+
    // This avoids browser compatibility issues with Content-MD5 headers
  });

  // Note: AWS SDK v3.200.0 requires explicitly specifying which headers to sign
  // We sign both 'host' and 'content-type' to prevent SignatureDoesNotMatch errors
  // when clients send the Content-Type header
  
  try {
    // Generate the presigned URL
    const s3Client = s3ClientSingleton.getClient();
    const presignedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600, // URL expires in 1 hour
      signableHeaders: new Set(['host', 'content-type']) // Explicitly sign content-type header
    });

    logger.info(`Generated presigned URL for ${fileKey}`, {
      fileKey,
      urlLength: presignedUrl.length,
      hasSignedHeaders: presignedUrl.includes('X-Amz-SignedHeaders'),
      signedHeaders: presignedUrl.match(/X-Amz-SignedHeaders=([^&]*)/)?.[1] || 'none'
    });

    return {
      uploadUrl: presignedUrl,
      fileKey
    };
  } catch (error) {
    logger.error('Failed to generate presigned URL', {
      error: error instanceof Error ? error.message : 'Unknown error',
      fileKey,
      userId: user.userId,
      orgId: user.orgId
    });
    throw new Error('Failed to generate upload URL');
  }
}

export async function handleGetPresignedUrl(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const user = req.user as AuthTokenPayload;
    const result = await generatePresignedUrl(req.body, user);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    logger.error('Error in handleGetPresignedUrl', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: (req.user as AuthTokenPayload)?.userId
    });
    
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate presigned URL'
    });
  }
}

// Default export - This is a legacy function that doesn't have user context
// It should be replaced with generatePresignedUrl in all calling code
async function getUploadUrl(
  fileType: string,
  fileName: string,
  contentType: string,
  orderId?: number,
  patientId?: number,
  _documentType: string = 'signature',
  _fileSize?: number
): Promise<{ success: boolean; presignedUrl: string; filePath: string }> {
  // This is a design flaw - service functions should have user context
  // For backward compatibility, we'll throw an error to force migration
  throw new Error(
    'getUploadUrl is deprecated. Use generatePresignedUrl with proper user context. ' +
    'The controller should pass user information from req.user.'
  );
}

export default getUploadUrl;