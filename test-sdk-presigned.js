const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

async function testPresignedUrl() {
    // Create S3 client with minimal config
    const s3Client = new S3Client({
        region: 'us-east-2',
        credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test'
        }
    });

    const command = new PutObjectCommand({
        Bucket: 'test-bucket',
        Key: 'test-key.png',
        ContentType: 'image/png'
    });

    console.log('Testing with signableHeaders: new Set()');
    const url1 = await getSignedUrl(s3Client, command, { 
        expiresIn: 3600,
        signableHeaders: new Set()
    });
    console.log('URL contains X-Amz-SignedHeaders:', url1.includes('X-Amz-SignedHeaders'));
    console.log('');

    console.log('Testing with signableHeaders: new Set(["host"])');
    const url2 = await getSignedUrl(s3Client, command, { 
        expiresIn: 3600,
        signableHeaders: new Set(['host'])
    });
    console.log('URL contains X-Amz-SignedHeaders:', url2.includes('X-Amz-SignedHeaders'));
    console.log('');

    console.log('Testing with no signableHeaders option');
    const url3 = await getSignedUrl(s3Client, command, { 
        expiresIn: 3600
    });
    console.log('URL contains X-Amz-SignedHeaders:', url3.includes('X-Amz-SignedHeaders'));
    
    // Show what's in the URLs
    console.log('\nActual X-Amz-SignedHeaders values:');
    const match1 = url1.match(/X-Amz-SignedHeaders=([^&]*)/);
    const match2 = url2.match(/X-Amz-SignedHeaders=([^&]*)/);
    const match3 = url3.match(/X-Amz-SignedHeaders=([^&]*)/);
    
    console.log('Empty set:', match1 ? decodeURIComponent(match1[1]) : 'Not found');
    console.log('Set with host:', match2 ? decodeURIComponent(match2[1]) : 'Not found');
    console.log('No option:', match3 ? decodeURIComponent(match3[1]) : 'Not found');
}

testPresignedUrl().catch(console.error);