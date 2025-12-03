import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('agents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgentsController {
    constructor(private readonly agentsService: AgentsService) { }

    @Post()
    @Roles('admin')
    create(@Body() createAgentDto: CreateAgentDto) {
        return this.agentsService.create(createAgentDto);
    }

    @Get()
    @Roles('admin', 'agent')
    findAll() {
        return this.agentsService.findAll();
    }

    @Get(':id')
    @Roles('admin', 'agent')
    findOne(@Param('id') id: string) {
        return this.agentsService.findOne(+id);
    }

    @Patch(':id')
    @Roles('admin', 'agent')
    update(@Param('id') id: string, @Body() updateAgentDto: UpdateAgentDto) {
        return this.agentsService.update(+id, updateAgentDto);
    }

    @Delete(':id')
    @Roles('admin')
    remove(@Param('id') id: string) {
        return this.agentsService.remove(+id);
    }

    @Patch(':id/verify')
    @Roles('admin')
    verify(@Param('id') id: string) {
        return this.agentsService.verify(+id);
    }
}
