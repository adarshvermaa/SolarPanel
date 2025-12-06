import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/types';
import { users, applications, installations } from '../db/schema';
import { eq, and, desc, sql, ilike, or } from 'drizzle-orm';
import { AssignAgentDto, UpdateInstallationStatusDto } from './dto/assign-agent.dto';

@Injectable()
export class AgentsService {
    constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

    // Get all agents (users with role 'agent')
    async getAllAgents(queryParams: any = {}) {
        const { page, limit, search } = queryParams;
        const pageNumber = page ? parseInt(page) : undefined;
        const limitNumber = limit ? parseInt(limit) : undefined;
        const offset = pageNumber && limitNumber ? (pageNumber - 1) * limitNumber : undefined;

        const conditions = [eq(users.role, 'agent')];

        if (search) {
            const searchCondition = or(
                ilike(users.fullName, `%${search}%`),
                ilike(users.email, `%${search}%`),
                ilike(users.phone, `%${search}%`)
            );
            if (searchCondition) conditions.push(searchCondition);
        }

        const baseQuery = this.db
            .select({
                id: users.id,
                uuid: users.uuid,
                email: users.email,
                fullName: users.fullName,
                phone: users.phone,
                avatar: users.avatar,
                isActive: users.isActive,
                createdAt: users.createdAt,
            })
            .from(users);

        if (conditions.length > 0) {
            baseQuery.where(and(...conditions));
        }

        if (limitNumber) {
            baseQuery.limit(limitNumber);
        }
        if (offset) {
            baseQuery.offset(offset);
        }

        const data = await baseQuery.orderBy(desc(users.createdAt));

        if (pageNumber && limitNumber) {
            const countQuery = this.db
                .select({ count: sql<number>`count(*)` })
                .from(users);

            if (conditions.length > 0) {
                countQuery.where(and(...conditions));
            }

            const countResult = await countQuery;
            const total = Number(countResult[0]?.count || 0);

            return {
                data,
                meta: {
                    total,
                    page: pageNumber,
                    limit: limitNumber,
                    totalPages: Math.ceil(total / limitNumber),
                }
            };
        }

        return data;
    }

    // Get agent statistics (workload)
    async getAgentStats(agentId: number) {
        // Count ALL applications assigned to this agent (regardless of status)
        const [assignedApps] = await this.db
            .select({ count: sql<number>`count(*)` })
            .from(applications)
            .where(eq(applications.assignedAgentId, agentId));

        const [inProgressInstalls] = await this.db
            .select({ count: sql<number>`count(*)` })
            .from(installations)
            .where(
                and(
                    eq(installations.installerId, agentId),
                    eq(installations.status, 'in_progress')
                )
            );

        const [completedInstalls] = await this.db
            .select({ count: sql<number>`count(*)` })
            .from(installations)
            .where(
                and(
                    eq(installations.installerId, agentId),
                    eq(installations.status, 'completed')
                )
            );

        return {
            assignedApplications: Number(assignedApps?.count || 0),
            inProgressInstallations: Number(inProgressInstalls?.count || 0),
            completedInstallations: Number(completedInstalls?.count || 0),
        };
    }

    // Get all agents with their workload
    async getAgentsWithWorkload() {
        const agents: any = await this.getAllAgents();

        // Note: Logic for getAgentsWithWorkload is tricky with pagination because it iterates over the result of getAllAgents.
        // For now, getAgentsWithWorkload is likely used for admin dashboard overview which might not be paginated or uses a simplified view. 
        // Assuming getAllAgents() without params returns all agents (array), existing logic holds.
        // If queryParams passed, it returns { data, meta }.
        // I should ensure getAllAgents() handles return type correctly if used internally.

        // However, typescript might complain about return type.
        // Let's assume for internal use we don't pass paginated options here or we handle the data structure.

        const agentsList = Array.isArray(agents) ? agents : agents.data;

        const agentsWithStats = await Promise.all(
            agentsList.map(async (agent: any) => {
                const stats = await this.getAgentStats(agent.id);
                return {
                    ...agent,
                    workload: stats,
                };
            })
        );

        return agentsWithStats;
    }

    // Assign application to an agent
    async assignApplicationToAgent(assignDto: AssignAgentDto, assignedBy: number) {
        // Verify agent exists and has agent role
        const [agent] = await this.db
            .select()
            .from(users)
            .where(and(eq(users.id, assignDto.agentId), eq(users.role, 'agent')));

        if (!agent) {
            throw new NotFoundException('Agent not found');
        }

        // Verify application exists and is approved
        const [application] = await this.db
            .select()
            .from(applications)
            .where(eq(applications.id, assignDto.applicationId));

        if (!application) {
            throw new NotFoundException('Application not found');
        }

        if (application.status !== 'approved') {
            throw new BadRequestException('Only approved applications can be assigned to agents');
        }

        // Update application with assigned agent
        const [updatedApp] = await this.db
            .update(applications)
            .set({
                assignedAgentId: assignDto.agentId,
                status: 'in_progress',
                updatedAt: new Date(),
            })
            .where(eq(applications.id, assignDto.applicationId))
            .returning();

        // Create installation record
        const [installation] = await this.db
            .insert(installations)
            .values({
                applicationId: assignDto.applicationId,
                installerId: assignDto.agentId,
                status: 'scheduled',
                notes: assignDto.notes,
            })
            .returning();

        return {
            application: updatedApp,
            installation,
        };
    }

    // Get applications assigned to a specific agent
    async getAgentApplications(agentId: number) {
        return this.db
            .select({
                application: applications,
                installation: installations,
            })
            .from(applications)
            .leftJoin(installations, eq(applications.id, installations.applicationId))
            .where(eq(applications.assignedAgentId, agentId))
            .orderBy(desc(applications.createdAt));
    }

    // Get unassigned approved applications
    async getUnassignedApplications(queryParams: any = {}) {
        const { page, limit, search } = queryParams;
        const pageNumber = page ? parseInt(page) : undefined;
        const limitNumber = limit ? parseInt(limit) : undefined;
        const offset = pageNumber && limitNumber ? (pageNumber - 1) * limitNumber : undefined;

        const conditions = [
            eq(applications.status, 'approved'),
            sql`${applications.assignedAgentId} IS NULL`
        ];

        if (search) {
            const searchCondition = or(
                ilike(applications.applicationNumber, `%${search}%`),
                ilike(applications.applicantName, `%${search}%`),
                ilike(applications.city, `%${search}%`)
            );
            if (searchCondition) {
                conditions.push(searchCondition);
            }
        }

        const baseQuery = this.db
            .select()
            .from(applications)
            .where(and(...conditions));

        if (limitNumber) {
            baseQuery.limit(limitNumber);
        }
        if (offset) {
            baseQuery.offset(offset);
        }

        const data = await baseQuery.orderBy(desc(applications.approvedAt));

        if (pageNumber && limitNumber) {
            const countQuery = this.db
                .select({ count: sql<number>`count(*)` })
                .from(applications)
                .where(and(...conditions));

            const countResult = await countQuery;
            const total = Number(countResult[0]?.count || 0);

            return {
                data,
                meta: {
                    total,
                    page: pageNumber,
                    limit: limitNumber,
                    totalPages: Math.ceil(total / limitNumber),
                }
            };
        }

        return data;
    }

    // Update installation status by agent
    async updateInstallationStatus(
        installationId: number,
        updateDto: UpdateInstallationStatusDto,
        agentId: number
    ) {
        // Verify installation exists and belongs to agent
        const [installation] = await this.db
            .select()
            .from(installations)
            .where(eq(installations.id, installationId));

        if (!installation) {
            throw new NotFoundException('Installation not found');
        }

        if (installation.installerId !== agentId) {
            throw new BadRequestException('You can only update your own installations');
        }

        const updateData: any = {
            status: updateDto.status,
            notes: updateDto.notes,
            updatedAt: new Date(),
        };

        if (updateDto.status === 'in_progress' && !installation.startDate) {
            updateData.startDate = new Date();
        }

        if (updateDto.status === 'completed') {
            updateData.completionDate = new Date();
            if (updateDto.photos) {
                updateData.photos = updateDto.photos;
            }
            if (updateDto.completionCertificate) {
                updateData.completionCertificate = updateDto.completionCertificate;
            }
        }

        const [updatedInstallation] = await this.db
            .update(installations)
            .set(updateData)
            .where(eq(installations.id, installationId))
            .returning();

        // Also update application status
        if (updateDto.status === 'completed') {
            await this.db
                .update(applications)
                .set({
                    status: 'completed',
                    completedAt: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(applications.id, installation.applicationId));
        }

        return updatedInstallation;
    }

    // Reassign application to different agent
    async reassignApplication(applicationId: number, newAgentId: number, assignedBy: number) {
        // Verify new agent exists
        const [agent] = await this.db
            .select()
            .from(users)
            .where(and(eq(users.id, newAgentId), eq(users.role, 'agent')));

        if (!agent) {
            throw new NotFoundException('Agent not found');
        }

        // Update application
        await this.db
            .update(applications)
            .set({
                assignedAgentId: newAgentId,
                updatedAt: new Date(),
            })
            .where(eq(applications.id, applicationId));

        // Update installation if exists
        const [existingInstallation] = await this.db
            .select()
            .from(installations)
            .where(eq(installations.applicationId, applicationId));

        if (existingInstallation) {
            await this.db
                .update(installations)
                .set({
                    installerId: newAgentId,
                    updatedAt: new Date(),
                })
                .where(eq(installations.id, existingInstallation.id));
        }

        return { success: true };
    }
}
