import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/types';
import { installations, applications, users } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { CreateInstallationDto, UpdateInstallationDto } from './dto/create-installation.dto';

@Injectable()
export class InstallationsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

  async create(createDto: CreateInstallationDto) {
    // Check if application exists
    const app = await this.db.select().from(applications).where(eq(applications.id, createDto.applicationId));
    if (!app.length) {
      throw new NotFoundException('Application not found');
    }

    return this.db
      .insert(installations)
      .values({
        ...createDto,
        status: 'scheduled',
        scheduledDate: createDto.scheduledDate ? new Date(createDto.scheduledDate) : null,
      })
      .returning();
  }

  async findAll(userId: number, role: string) {
    if (role === 'user') {
      // Users see installations for their applications
      return this.db
        .select({
          installation: installations,
          application: applications,
        })
        .from(installations)
        .leftJoin(applications, eq(installations.applicationId, applications.id))
        .where(eq(applications.userId, userId))
        .orderBy(desc(installations.createdAt));
    }

    if (role === 'agent' || role === 'installer') {
      // Installers see assigned installations
      // Agents might see all or assigned (simplified to all for now or assigned if we had agentId on installation)
      // For now, let's show all for agents/admins
      return this.db
        .select({
          installation: installations,
          application: applications,
          installer: users,
        })
        .from(installations)
        .leftJoin(applications, eq(installations.applicationId, applications.id))
        .leftJoin(users, eq(installations.installerId, users.id))
        .orderBy(desc(installations.createdAt));
    }

    return this.db
      .select()
      .from(installations)
      .orderBy(desc(installations.createdAt));
  }

  async findOne(id: number) {
    const result = await this.db
      .select({
        installation: installations,
        application: applications,
        installer: users,
      })
      .from(installations)
      .leftJoin(applications, eq(installations.applicationId, applications.id))
      .leftJoin(users, eq(installations.installerId, users.id))
      .where(eq(installations.id, id));

    if (!result.length) {
      throw new NotFoundException(`Installation with ID ${id} not found`);
    }

    return result[0];
  }

  async update(id: number, updateDto: UpdateInstallationDto) {
    await this.findOne(id);

    const updateData: any = { ...updateDto };

    if (updateDto.scheduledDate) updateData.scheduledDate = new Date(updateDto.scheduledDate);
    if (updateDto.startDate) updateData.startDate = new Date(updateDto.startDate);
    if (updateDto.completionDate) updateData.completionDate = new Date(updateDto.completionDate);

    // Convert numbers to strings for decimal fields
    if (updateDto.actualCapacity) updateData.actualCapacity = updateDto.actualCapacity.toString();
    if (updateDto.inverterCapacity) updateData.inverterCapacity = updateDto.inverterCapacity.toString();
    if (updateDto.totalCost) updateData.totalCost = updateDto.totalCost.toString();
    if (updateDto.subsidyApplied) updateData.subsidyApplied = updateDto.subsidyApplied.toString();
    if (updateDto.finalCost) updateData.finalCost = updateDto.finalCost.toString();

    return this.db
      .update(installations)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(installations.id, id))
      .returning();
  }
}
