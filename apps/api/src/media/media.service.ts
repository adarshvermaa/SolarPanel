import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/types';
import { media } from '../db/schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    private configService: ConfigService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')!,
      },
    });
    this.bucketName = this.configService.get('AWS_S3_BUCKET')!;
  }

  async getPresignedUrl(
    filename: string,
    contentType: string,
    userId: number,
    category: 'document' | 'photo' | 'avatar' | 'blog_image' | 'scheme_image' = 'document'
  ) {
    const fileKey = `${category}/${userId}/${uuidv4()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: contentType,
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      return {
        uploadUrl: url,
        key: fileKey,
        s3Url: `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${fileKey}`,
        filename,
        contentType,
      };
    } catch (error) {
      console.error('S3 Presigned URL Error:', error);
      throw new InternalServerErrorException('Could not generate upload URL');
    }
  }

  async saveFileMetadata(fileData: {
    userId: number;
    filename: string;
    originalFilename: string;
    mimeType: string;
    size: number;
    s3Key: string;
    s3Url: string;
    category: any;
  }) {
    return this.db.insert(media).values(fileData).returning();
  }
}
