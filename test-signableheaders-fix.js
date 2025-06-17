const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

async function testSignableHeaders() {
    const client = new S3Client({ 
        region: 'us-east-2', 
        credentials: { 
            accessKeyId: 'test', 
            secretAccessKey: 'test' 
        }
    });
    
    const command = new PutObjectCommand({ 
        Bucket: 'test-bucket', 
        Key: 'test.png',
        ContentType: 'image/png'
    });
    
    console.log('Testing with signableHeaders: new Set(["host", "content-type"])');
    const url = await getSignedUrl(client, command, { 
        expiresIn: 3600,
        signableHeaders: new Set(['host', 'content-type'])
    });
    
    const signedHeaders = url.match(/X-Amz-SignedHeaders=([^&]*)/)?.[1];
    console.log('Signed headers in URL:', signedHeaders ? decodeURIComponent(signedHeaders) : 'none');
    console.log('Expected: host;content-type');
    console.log('Success:', signedHeaders === 'host%3Bcontent-type');
}

testSignableHeaders().catch(console.error);