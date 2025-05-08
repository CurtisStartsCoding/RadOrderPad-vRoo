# FileUploadService Refactoring Plan

**Date:** 2025-04-13
**Author:** Roo
**Status:** Proposed

## Overview

This document outlines a detailed plan to refactor the `FileUploadService` (273 lines) into smaller, more focused modules organized in a logical directory structure. The refactoring will improve maintainability and adhere to the 150-line guideline.

## Current Structure

The current `FileUploadService` is a single class with the following methods:

1. `getS3Client()`: Initializes and returns the S3 client
2. `getUploadUrl()`: Generates a presigned URL for uploading a file to S3
3. `confirmUpload()`: Records a file upload in the database
4. `processSignature()`: Processes a signature upload (direct upload to S3)

## Proposed Directory Structure

```
src/
└── services/
    └── upload/
        ├── s3-client.service.ts
        ├── presigned-url.service.ts
        ├── document-upload.service.ts
        ├── signature-processing.service.ts
        ├── types.ts
        └── index.ts
```

## Detailed Refactoring Plan

### 1. Create Types File

Create `src/services/upload/types.ts` to contain all interfaces and types:

```typescript
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
```

### 2. Create S3 Client Service

Create `src/services/upload/s3-client.service.ts` to handle S3 client initialization:

```typescript
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
```

### 3. Create Presigned URL Service

Create `src/services/upload/presigned-url.service.ts` to handle presigned URL generation:

```typescript
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { queryPhiDb } from '../../config/db';
import config from '../../config/config';
import { PresignedUrlResponse } from './types';
import s3ClientSingleton from './s3-client.service';

/**
 * Generate a presigned URL for uploading a file to S3
 * @param fileType The MIME type of the file
 * @param fileName The name of the file
 * @param contentType The content type of the file
 * @param orderId Optional order ID to associate with the upload
 * @param patientId Optional patient ID to associate with the upload
 * @param documentType The type of document (e.g., 'signature', 'report', etc.)
 * @returns Object containing the presigned URL and the file key
 */
export async function getUploadUrl(
  fileType: string,
  fileName: string,
  contentType: string,
  orderId?: number,
  patientId?: number,
  documentType: string = 'signature'
): Promise<PresignedUrlResponse> {
  try {
    // Validate inputs
    if (!fileType || !fileName || !contentType) {
      throw new Error('Missing required parameters: fileType, fileName, or contentType');
    }

    // Ensure AWS credentials are configured
    if (!config.aws.accessKeyId || !config.aws.secretAccessKey || !config.aws.s3.bucketName) {
      throw new Error('AWS credentials or S3 bucket name not configured');
    }

    // Validate file type
    const allowedFileTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'application/pdf',
      'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedFileTypes.includes(contentType)) {
      throw new Error(`File type ${contentType} is not allowed. Allowed types: ${allowedFileTypes.join(', ')}`);
    }
    
    // Generate a unique file key
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    // Get organization ID (we'll need to query for this based on the order or user)
    let organizationId = 0;
    if (orderId) {
      try {
        const orderResult = await queryPhiDb(
          'SELECT referring_organization_id FROM orders WHERE id = $1',
          [orderId]
        );
        
        if (orderResult.rows.length > 0) {
          organizationId = orderResult.rows[0].referring_organization_id;
        }
      } catch (error: any) {
        console.error('[FileUploadService] Error getting organization ID:', error);
      }
    }
    
    // Create a path structure following the specification:
    // uploads/{organization_id}/{context_type}/{id}/{uuid}_{filename}
    const contextType = orderId ? 'orders' : (patientId ? 'patients' : 'general');
    const contextId = orderId || patientId || 'no_id';
    
    const fileKey = `uploads/${organizationId}/${contextType}/${contextId}/${timestamp}_${randomString}_${sanitizedFileName}`;

    // Create the S3 command
    const command = new PutObjectCommand({
      Bucket: config.aws.s3.bucketName,
      Key: fileKey,
      ContentType: contentType
    });

    // Generate the presigned URL
    const s3Client = s3ClientSingleton.getClient();
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour

    console.log(`[FileUploadService] Generated presigned URL for ${fileKey}`);
    
    return {
      success: true,
      presignedUrl,
      filePath: fileKey
    };
    
  } catch (error: any) {
    console.error(`[FileUploadService] Error generating presigned URL: ${error.message}`);
    throw error;
  }
}

export default getUploadUrl;
```

### 4. Create Document Upload Service

Create `src/services/upload/document-upload.service.ts` to handle upload confirmation:

```typescript
import { queryPhiDb } from '../../config/db';
import { UploadConfirmationResponse } from './types';

/**
 * Confirm a file upload and record it in the database
 * @param fileKey The S3 file key
 * @param orderId The order ID associated with the upload
 * @param patientId The patient ID associated with the upload
 * @param documentType The type of document
 * @param fileName The original file name
 * @param fileSize The size of the file in bytes
 * @param contentType The content type of the file
 * @param userId The user ID of the uploader
 * @param processingStatus The processing status of the document
 * @returns The ID of the created document record
 */
export async function confirmUpload(
  fileKey: string,
  orderId: number,
  patientId: number,
  documentType: string,
  fileName: string,
  fileSize: number,
  contentType: string,
  userId: number = 1, // Default to 1 if not provided
  processingStatus: string = 'uploaded' // Default to 'uploaded' if not provided
): Promise<UploadConfirmationResponse> {
  try {
    // Validate inputs
    if (!fileKey || !orderId || !patientId || !documentType) {
      throw new Error('Missing required parameters');
    }

    // Insert record into document_uploads table
    const result = await queryPhiDb(
      `INSERT INTO document_uploads
      (user_id, order_id, patient_id, document_type, filename, file_size, mime_type, file_path, processing_status, uploaded_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING id`,
      [userId, orderId, patientId, documentType, fileName, fileSize, contentType, fileKey, processingStatus]
    );

    const documentId = result.rows[0].id;
    console.log(`[FileUploadService] Recorded document upload: ${documentId} for order ${orderId}`);
    
    return {
      success: true,
      documentId
    };
  } catch (error: any) {
    console.error('[FileUploadService] Error recording document upload:', error);
    throw new Error(`Failed to record document upload: ${error.message || 'Unknown error'}`);
  }
}

export default confirmUpload;
```

### 5. Create Signature Processing Service

Create `src/services/upload/signature-processing.service.ts` to handle signature uploads:

```typescript
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { queryPhiDb } from '../../config/db';
import config from '../../config/config';
import s3ClientSingleton from './s3-client.service';

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
export async function processSignature(
  orderId: number,
  signatureData?: string,
  userId: number = 1 // Default to 1 if not provided
): Promise<string | null> {
  if (!signatureData) {
    return null;
  }
  
  try {
    // Get order details to get patient ID
    const orderResult = await queryPhiDb(
      'SELECT patient_id FROM orders WHERE id = $1',
      [orderId]
    );
    
    if (orderResult.rows.length === 0) {
      throw new Error(`Order not found: ${orderId}`);
    }
    
    const patientId = orderResult.rows[0].patient_id;
    
    // Get organization ID
    const orgResult = await queryPhiDb(
      'SELECT referring_organization_id FROM orders WHERE id = $1',
      [orderId]
    );
    
    const organizationId = orgResult.rows[0].referring_organization_id;
    
    // Generate a unique file key for the signature
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `signature_${orderId}.png`;
    const contentType = 'image/png';
    
    // Create a path structure following the specification:
    // uploads/{organization_id}/orders/{order_id}/signatures/{timestamp}_{randomString}_{filename}
    const fileKey = `uploads/${organizationId}/orders/${orderId}/signatures/${timestamp}_${randomString}_${fileName}`;
    
    try {
      // Convert base64 data to binary
      const base64Data = signatureData.replace(/^data:image\/png;base64,/, '');
      const binaryData = Buffer.from(base64Data, 'base64');
      
      // Upload the signature to S3 directly
      const s3Client = s3ClientSingleton.getClient();
      await s3Client.send(new PutObjectCommand({
        Bucket: config.aws.s3.bucketName,
        Key: fileKey,
        Body: binaryData,
        ContentType: contentType
      }));
      
      // Generate the S3 URL for reference (not stored in DB anymore)
      const fileUrl = `https://${config.aws.s3.bucketName}.s3.${config.aws.region}.amazonaws.com/${fileKey}`;
      
      // Record the upload in the database
      await queryPhiDb(
        `INSERT INTO document_uploads
        (user_id, order_id, patient_id, document_type, filename, file_size, mime_type, file_path, processing_status, uploaded_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
        [userId, orderId, patientId, 'signature', fileName, binaryData.length, contentType, fileKey, 'uploaded']
      );
      
      console.log(`[FileUploadService] Signature uploaded successfully for order ${orderId}`);
      
      return fileUrl;
    } catch (error: any) {
      console.error(`[FileUploadService] Error uploading signature: ${error.message}`);
      throw error;
    }
  } catch (error: any) {
    console.error('[FileUploadService] Error processing signature:', error);
    throw new Error(`Failed to process signature: ${error.message || 'Unknown error'}`);
  }
}

export default processSignature;
```

### 6. Create Index File

Create `src/services/upload/index.ts` to re-export all functionality and maintain backward compatibility:

```typescript
import { s3ClientSingleton } from './s3-client.service';
import getUploadUrl from './presigned-url.service';
import confirmUpload from './document-upload.service';
import processSignature from './signature-processing.service';
import { PresignedUrlResponse, UploadConfirmationResponse } from './types';

/**
 * Service for handling file upload operations using AWS S3
 */
export class FileUploadService {
  /**
   * Initialize the S3 client
   */
  private static getS3Client() {
    return s3ClientSingleton.getClient();
  }

  /**
   * Generate a presigned URL for uploading a file to S3
   * @param fileType The MIME type of the file
   * @param fileName The name of the file
   * @param contentType The content type of the file
   * @param orderId Optional order ID to associate with the upload
   * @param patientId Optional patient ID to associate with the upload
   * @param documentType The type of document (e.g., 'signature', 'report', etc.)
   * @returns Object containing the presigned URL and the file key
   */
  static async getUploadUrl(
    fileType: string,
    fileName: string,
    contentType: string,
    orderId?: number,
    patientId?: number,
    documentType: string = 'signature'
  ): Promise<PresignedUrlResponse> {
    return getUploadUrl(fileType, fileName, contentType, orderId, patientId, documentType);
  }

  /**
   * Confirm a file upload and record it in the database
   * @param fileKey The S3 file key
   * @param orderId The order ID associated with the upload
   * @param patientId The patient ID associated with the upload
   * @param documentType The type of document
   * @param fileName The original file name
   * @param fileSize The size of the file in bytes
   * @param contentType The content type of the file
   * @param userId The user ID of the uploader
   * @param processingStatus The processing status of the document
   * @returns The ID of the created document record
   */
  static async confirmUpload(
    fileKey: string,
    orderId: number,
    patientId: number,
    documentType: string,
    fileName: string,
    fileSize: number,
    contentType: string,
    userId: number = 1,
    processingStatus: string = 'uploaded'
  ): Promise<UploadConfirmationResponse> {
    return confirmUpload(fileKey, orderId, patientId, documentType, fileName, fileSize, contentType, userId, processingStatus);
  }

  /**
   * Process a signature upload (for backward compatibility with existing code)
   * @param orderId The order ID
   * @param signatureData Base64 encoded signature data
   * @param userId The user ID of the uploader
   * @returns The URL of the uploaded signature
   */
  static async processSignature(
    orderId: number,
    signatureData?: string,
    userId: number = 1
  ): Promise<string | null> {
    return processSignature(orderId, signatureData, userId);
  }
}

export default FileUploadService;
```

## Implementation Steps

1. Create the `src/services/upload` directory
2. Create each of the files described above
3. Update imports in other files that use `FileUploadService`
4. Run tests to ensure functionality is preserved
5. Remove the original `src/services/fileUpload.service.ts` file

## Benefits

1. **Improved Maintainability**: Each file is focused on a single responsibility
2. **Better Organization**: Related functionality is grouped together
3. **Easier Testing**: Each service can be tested independently
4. **Improved Code Navigation**: Developers can quickly find the code they need
5. **Better Collaboration**: Multiple developers can work on different parts of the service without conflicts
6. **Reduced Cognitive Load**: Developers only need to understand a small part of the service at a time

## Next Steps

After successfully refactoring the `FileUploadService`, we can apply similar refactoring patterns to the other large files in the codebase.