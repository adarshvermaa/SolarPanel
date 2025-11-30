import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BlogService } from './blog.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req: any, @Body() createBlogDto: any) {
    return this.blogService.create(req.user.userId, createBlogDto);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }
}
