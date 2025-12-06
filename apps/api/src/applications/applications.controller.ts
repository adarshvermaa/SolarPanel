import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) { }

  @Post()
  @Roles('user', 'admin', 'superadmin')
  create(@Body() createApplicationDto: CreateApplicationDto, @Request() req: any) {
    return this.applicationsService.create(createApplicationDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req: any, @Query() query: any) {
    return this.applicationsService.findAll(req.user.userId, req.user.role, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.applicationsService.findOne(+id, req.user.userId, req.user.role);
  }

  @Patch(':id/status')
  @Roles('admin', 'superadmin', 'agent')
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateApplicationStatusDto,
    @Request() req: any
  ) {
    return this.applicationsService.updateStatus(+id, updateDto, req.user.userId);
  }
}
