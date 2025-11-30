import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('media')
@UseGuards(AuthGuard('jwt'))
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @Post('presigned-url')
  async getPresignedUrl(@Body() body: { filename: string; contentType: string }) {
    return this.mediaService.getPresignedUrl(body.filename, body.contentType);
  }
}
