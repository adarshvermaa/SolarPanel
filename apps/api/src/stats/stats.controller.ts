import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get('admin')
    @Roles('admin')
    getAdminStats() {
        return this.statsService.getAdminStats();
    }

    @Get('user')
    @Roles('user')
    getUserStats(@Request() req: any) {
        return this.statsService.getUserStats(req.user.userId);
    }

    @Get('agent')
    @Roles('agent')
    getAgentStats(@Request() req: any) {
        return this.statsService.getAgentStats(req.user.userId);
    }
}
