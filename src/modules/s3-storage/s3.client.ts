import { S3Client } from '@aws-sdk/client-s3'

export function createS3Client() {
  const endpoint = process.env.S3_ENDPOINT || undefined
  const forcePathStyle = String(process.env.S3_FORCE_PATH_STYLE).toLowerCase() === 'true'

  return new S3Client({
    region: process.env.S3_REGION || 'us-east-1',
    endpoint,                   // MinIO -> http://localhost:9000; AWS -> undefined
    forcePathStyle,             // MinIO -> true; AWS -> false
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!,
    },
  })
}
