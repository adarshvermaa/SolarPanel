import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('applications')
@UseGuards(AuthGuard('jwt'))
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) { }

  @Post()
  create(@Request() req: any, @Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(req.user.userId, createApplicationDto);
  }

  @Get()
  findAll(@Request() req: any) {
    // If admin, return all. If user, return theirs.
    if (req.user.role === 'admin') {
      return this.applicationsService.findAll();
    }
    return this.applicationsService.findByUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(+id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: any) {
    // Should add check for admin role here
    return this.applicationsService.updateStatus(+id, status);
  }
}
