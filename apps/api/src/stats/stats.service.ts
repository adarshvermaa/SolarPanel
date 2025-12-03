import { Injectable } from '@nestjs/common';

@Injectable()
export class StatsService {
    async getAdminStats() {
        // TODO: Replace with real database queries when entities are properly set up
        return {
            applications: {
                total: 0,
                pending: 0,
                approved: 0,
            },
            installations: {
                total: 0,
                completed: 0,
            },
            agents: {
                total: 0,
                verified: 0,
            },
        };
    }

    async getUserStats(userId: number) {
        // TODO: Replace with real database queries
        return {
            applications: {
                total: 0,
                pending: 0,
                approved: 0,
            },
            installations: {
                total: 0,
                completed: 0,
            },
        };
    }

    async getAgentStats(agentId: number) {
        // TODO: Replace with real database queries
        return {
            assignments: {
                total: 0,
                pending: 0,
                inProgress: 0,
                completed: 0,
            },
        };
    }
}
