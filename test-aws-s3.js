import AWS from 'aws-sdk';
import dotenv from 'dotenv';

// Load environment variables from .env.production
dotenv.config({ path: './.env.production' });

const s3 = new AWS.S3({
  region: process.env.AWS_REGION || 'us-east-2',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Default bucket name since it's not in the environment variables
// You'll need to replace this with your actual bucket name
const bucketName = process.env.S3_BUCKET_NAME || 'radorderpad-uploads';

async function testPresignedUrl() {
  try {
    const params = {
      Bucket: bucketName,
      Key: 'uploads/test-from-vercel.txt',
      ContentType: 'text/plain',
      Expires: 300,
    };

    const url = await s3.getSignedUrlPromise('putObject', params);
    console.log('Presigned URL:', url);
    console.log('Test successful! AWS S3 connection is working.');
  } catch (error) {
    console.error('Error generating presigned URL:', error);
  }
}

testPresignedUrl();