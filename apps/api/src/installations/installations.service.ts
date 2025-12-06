import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/types';
import { installations, applications, users } from '../db/schema';
import { eq, desc, and, ilike, or, sql } from 'drizzle-orm';
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

  async findAll(userId: number, role: string, queryParams: any) {
    const { page, limit, status, search } = queryParams;
    const pageNumber = page ? parseInt(page) : undefined;
    const limitNumber = limit ? parseInt(limit) : undefined;
    const offset = pageNumber && limitNumber ? (pageNumber - 1) * limitNumber : undefined;

    const conditions = [];

    // Role based filtering
    if (role === 'user') {
      conditions.push(eq(applications.userId, userId));
    } else if (role === 'installer' || role === 'agent') {
      // Both installers and agents should only see installations assigned to them
      conditions.push(eq(installations.installerId, userId));
    }

    // Status filter
    if (status) {
      conditions.push(eq(installations.status, status));
    }

    // Search filter (Application Number or Installer Name)
    if (search) {
      conditions.push(or(
        ilike(applications.applicationNumber, `%${search}%`),
        ilike(users.fullName, `%${search}%`)
      ));
    }

    // Base query
    const baseQuery = this.db
      .select({
        installation: installations,
        application: applications,
        installer: users,
      })
      .from(installations)
      .leftJoin(applications, eq(installations.applicationId, applications.id))
      .leftJoin(users, eq(installations.installerId, users.id));

    // Apply conditions
    if (conditions.length > 0) {
      baseQuery.where(and(...conditions));
    }

    // Apply pagination if requested
    if (limitNumber) {
      baseQuery.limit(limitNumber);
    }
    if (offset) {
      baseQuery.offset(offset);
    }

    const data = await baseQuery.orderBy(desc(installations.createdAt));

    // If pagination requested, return meta
    if (pageNumber && limitNumber) {
      // Get total count
      // This is a bit inefficient in Drizzle without count(), but works for now.
      // Optimisation: use count() query.
      const countQuery = this.db
        .select({ count: sql<number>`count(*)` })
        .from(installations)
        .leftJoin(applications, eq(installations.applicationId, applications.id))
        .leftJoin(users, eq(installations.installerId, users.id));

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
