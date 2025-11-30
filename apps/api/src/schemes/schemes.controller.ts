import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { SchemesService } from './schemes.service';
import { CreateSchemeDto, UpdateSchemeDto } from './dto/create-scheme.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('schemes')
export class SchemesController {
  constructor(private readonly schemesService: SchemesService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  create(@Body() createSchemeDto: CreateSchemeDto, @Request() req: any) {
    return this.schemesService.create(createSchemeDto, req.user.userId);
  }

  @Get()
  findAll(@Query('search') search?: string, @Query('isActive') isActive?: string) {
    return this.schemesService.findAll({
      search,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schemesService.findOne(+id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.schemesService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  update(@Param('id') id: string, @Body() updateSchemeDto: UpdateSchemeDto) {
    return this.schemesService.update(+id, updateSchemeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  remove(@Param('id') id: string) {
    return this.schemesService.remove(+id);
  }
}
