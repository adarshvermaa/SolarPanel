
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CalculatorService } from './calculator.service';
import { CreateCalculatorConfigDto, UpdateCalculatorConfigDto } from './dto/create-calculator-config.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('calculator')
export class CalculatorController {
    constructor(private readonly calculatorService: CalculatorService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superadmin')
    create(@Body() createDto: CreateCalculatorConfigDto) {
        return this.calculatorService.create(createDto);
    }

    @Get()
    findAll() {
        return this.calculatorService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.calculatorService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superadmin')
    update(@Param('id') id: string, @Body() updateDto: UpdateCalculatorConfigDto) {
        return this.calculatorService.update(+id, updateDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superadmin')
    remove(@Param('id') id: string) {
        return this.calculatorService.remove(+id);
    }
}
