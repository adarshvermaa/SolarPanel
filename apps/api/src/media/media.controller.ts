import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @Post('presigned-url')
  async getPresignedUrl(@Body() body: { filename: string; contentType: string; category?: any }, @Request() req: any) {
    return this.mediaService.getPresignedUrl(
      body.filename,
      body.contentType,
      req.user.userId,
      body.category
    );
  }

  @Post('metadata')
  async saveMetadata(@Body() body: any, @Request() req: any) {
    return this.mediaService.saveFileMetadata({
      ...body,
      userId: req.user.userId,
    });
  }
}
