import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { InstallationsService } from './installations.service';
import { CreateInstallationDto, UpdateInstallationDto } from './dto/create-installation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('installations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InstallationsController {
  constructor(private readonly installationsService: InstallationsService) { }

  @Post()
  @Roles('admin', 'superadmin', 'agent')
  create(@Body() createDto: CreateInstallationDto) {
    return this.installationsService.create(createDto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.installationsService.findAll(req.user.userId, req.user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.installationsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin', 'superadmin', 'agent')
  update(@Param('id') id: string, @Body() updateDto: UpdateInstallationDto) {
    return this.installationsService.update(+id, updateDto);
  }
}
