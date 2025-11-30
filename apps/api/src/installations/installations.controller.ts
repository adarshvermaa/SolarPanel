import { Controller, Get, Post, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { InstallationsService } from './installations.service';
import { CreateInstallationDto } from './dto/create-installation.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('installations')
@UseGuards(AuthGuard('jwt'))
export class InstallationsController {
  constructor(private readonly installationsService: InstallationsService) { }

  @Post()
  create(@Body() createInstallationDto: CreateInstallationDto) {
    return this.installationsService.create(createInstallationDto);
  }

  @Get()
  findAll() {
    return this.installationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.installationsService.findOne(+id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.installationsService.updateStatus(+id, status);
  }
}
