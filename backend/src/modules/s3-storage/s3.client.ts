import { S3Client } from '@aws-sdk/client-s3'

export function createS3Client() {
  const endpoint = process.env.S3_ENDPOINT || undefined
  const forcePathStyle = String(process.env.S3_FORCE_PATH_STYLE).toLowerCase() === 'true'
  const regionForSigning = process.env.S3_REGION || 'us-east-1';

  return new S3Client({
    region: regionForSigning,
    endpoint,
    forcePathStyle,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!,
    },
  })
}
