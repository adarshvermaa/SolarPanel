import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Query, Post, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import * as bcrypt from 'bcrypt';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @Roles('admin', 'superadmin')
    async create(@Body() createData: any) {
        if (!createData.password) {
            throw new BadRequestException('Password is required');
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(createData.password, salt);

        // Remove 'password' and add 'passwordHash'
        const { password, ...userData } = createData;

        return this.usersService.create({
            ...userData,
            passwordHash,
        });
    }

    @Get()
    @Roles('admin', 'superadmin')
    findAll(@Query() query: any) {
        return this.usersService.findAll(query);
    }

    @Get(':id')
    @Roles('admin', 'superadmin')
    findOne(@Param('id') id: string) {
        return this.usersService.findById(+id);
    }

    @Patch(':id')
    @Roles('admin', 'superadmin')
    update(@Param('id') id: string, @Body() updateData: any) {
        return this.usersService.update(+id, updateData);
    }

    @Delete(':id')
    @Roles('admin', 'superadmin')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
