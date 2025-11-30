import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/types';
import { applications, schemes, users } from '../db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

  async create(createApplicationDto: CreateApplicationDto, userId: number) {
    // Generate application number
    const count = await this.db.select().from(applications);
    const appNumber = `APP-${new Date().getFullYear()}-${(count.length + 1).toString().padStart(5, '0')}`;

    return this.db
      .insert(applications)
      .values({
        ...createApplicationDto,
        applicationNumber: appNumber,
        userId,
        status: 'pending',
        roofArea: createApplicationDto.roofArea?.toString(),
        requestedCapacity: createApplicationDto.requestedCapacity?.toString(),
        estimatedCost: createApplicationDto.estimatedCost?.toString(),
        estimatedSubsidy: createApplicationDto.estimatedSubsidy?.toString(),
        documents: createApplicationDto.documents as any,
      })
      .returning();
  }

  async findAll(userId: number, role: string) {
    if (role === 'user') {
      return this.db
        .select()
        .from(applications)
        .where(eq(applications.userId, userId))
        .orderBy(desc(applications.createdAt));
    }

    // Admin/Agent sees all (or filtered by assignment for agent - to be implemented)
    return this.db
      .select({
        application: applications,
        scheme: schemes,
        user: users,
      })
      .from(applications)
      .leftJoin(schemes, eq(applications.schemeId, schemes.id))
      .leftJoin(users, eq(applications.userId, users.id))
      .orderBy(desc(applications.createdAt));
  }

  async findOne(id: number, userId: number, role: string) {
    const result = await this.db
      .select({
        application: applications,
        scheme: schemes,
        user: users,
      })
      .from(applications)
      .leftJoin(schemes, eq(applications.schemeId, schemes.id))
      .leftJoin(users, eq(applications.userId, users.id))
      .where(eq(applications.id, id));

    if (!result.length) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    const app = result[0];

    // Check permissions
    if (role === 'user' && app.application.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view this application');
    }

    return app;
  }

  async updateStatus(id: number, updateDto: UpdateApplicationStatusDto, reviewerId: number) {
    await this.findOne(id, reviewerId, 'admin'); // Ensure exists

    return this.db
      .update(applications)
      .set({
        status: updateDto.status,
        rejectionReason: updateDto.rejectionReason,
        reviewNotes: updateDto.reviewNotes,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(applications.id, id))
      .returning();
  }
}
