import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SchemesService } from './schemes.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('schemes')
export class SchemesController {
  constructor(private readonly schemesService: SchemesService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createSchemeDto: any) {
    return this.schemesService.create(createSchemeDto);
  }

  @Get()
  findAll() {
    return this.schemesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schemesService.findOne(+id);
  }
}
