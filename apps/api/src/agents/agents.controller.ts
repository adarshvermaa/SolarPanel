import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AssignAgentDto, UpdateInstallationStatusDto } from './dto/assign-agent.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('agents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgentsController {
    constructor(private readonly agentsService: AgentsService) { }

    // Get all agents (admin only)
    @Get()
    @Roles('admin', 'superadmin')
    getAllAgents(@Query() query: any) {
        return this.agentsService.getAllAgents(query);
    }

    // Get agents with workload statistics (admin only)
    @Get('workload')
    @Roles('admin', 'superadmin')
    getAgentsWithWorkload() {
        return this.agentsService.getAgentsWithWorkload();
    }

    // Get unassigned approved applications (admin only)
    @Get('unassigned-applications')
    @Roles('admin', 'superadmin')
    getUnassignedApplications(@Query() query: any) {
        return this.agentsService.getUnassignedApplications(query);
    }

    // Assign application to agent (admin only)
    @Post('assign')
    @Roles('admin', 'superadmin')
    assignApplicationToAgent(@Body() assignDto: AssignAgentDto, @Request() req: any) {
        return this.agentsService.assignApplicationToAgent(assignDto, req.user.id);
    }

    // Reassign application to different agent (admin only)
    @Put('reassign/:applicationId')
    @Roles('admin', 'superadmin')
    reassignApplication(
        @Param('applicationId') applicationId: string,
        @Body() body: { agentId: number },
        @Request() req: any
    ) {
        return this.agentsService.reassignApplication(+applicationId, body.agentId, req.user.id);
    }

    // Get agent's assigned applications (agent can view their own)
    @Get('my-applications')
    @Roles('agent')
    getMyApplications(@Request() req: any) {
        return this.agentsService.getAgentApplications(req.user.id);
    }

    // Get specific agent's applications (admin only)
    @Get(':agentId/applications')
    @Roles('admin', 'superadmin')
    getAgentApplications(@Param('agentId') agentId: string) {
        return this.agentsService.getAgentApplications(+agentId);
    }

    // Get agent statistics
    @Get(':agentId/stats')
    @Roles('admin', 'superadmin', 'agent')
    getAgentStats(@Param('agentId') agentId: string, @Request() req: any) {
        // Agents can only view their own stats
        if (req.user.role === 'agent' && req.user.id !== +agentId) {
            return { error: 'Forbidden' };
        }
        return this.agentsService.getAgentStats(+agentId);
    }

    // Update installation status (agent only)
    @Put('installations/:installationId/status')
    @Roles('agent')
    updateInstallationStatus(
        @Param('installationId') installationId: string,
        @Body() updateDto: UpdateInstallationStatusDto,
        @Request() req: any
    ) {
        return this.agentsService.updateInstallationStatus(+installationId, updateDto, req.user.id);
    }
}
