import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  private s3Client: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || 'mock',
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || 'mock',
      },
    });
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET') || 'mock-bucket';
  }

  async getPresignedUrl(filename: string, contentType: string) {
    const key = `${uuidv4()}-${filename}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      return { url, key };
    } catch (error) {
      // Return mock URL if credentials are missing
      return { url: `https://${this.bucket}.s3.amazonaws.com/${key}`, key };
    }
  }
}
