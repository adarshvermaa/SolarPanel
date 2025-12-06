import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/types';
import { applications, schemes, users } from '../db/schema';
import { eq, desc, and, ilike, or, sql } from 'drizzle-orm';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

  async create(createApplicationDto: CreateApplicationDto, userId: number) {
    try {
      // Generate application number
      const count = await this.db.select().from(applications);
      const appNumber = `APP-${new Date().getFullYear()}-${(count.length + 1).toString().padStart(5, '0')}`;

      const insertData: any = {
        schemeId: createApplicationDto.schemeId,
        applicationNumber: appNumber,
        userId,
        status: 'pending',
        applicantName: createApplicationDto.applicantName,
        applicantEmail: createApplicationDto.applicantEmail,
        applicantPhone: createApplicationDto.applicantPhone,
        address: createApplicationDto.address,
        city: createApplicationDto.city,
        state: createApplicationDto.state,
        pincode: createApplicationDto.pincode,
      };

      // Add optional fields only if they exist
      if (createApplicationDto.propertyType) {
        insertData.propertyType = createApplicationDto.propertyType;
      }
      if (createApplicationDto.roofArea !== undefined && createApplicationDto.roofArea !== null) {
        insertData.roofArea = createApplicationDto.roofArea.toString();
      }
      if (createApplicationDto.roofType) {
        insertData.roofType = createApplicationDto.roofType;
      }
      if (createApplicationDto.requestedCapacity !== undefined && createApplicationDto.requestedCapacity !== null) {
        insertData.requestedCapacity = createApplicationDto.requestedCapacity.toString();
      }
      if (createApplicationDto.estimatedCost !== undefined && createApplicationDto.estimatedCost !== null) {
        insertData.estimatedCost = createApplicationDto.estimatedCost.toString();
      }
      if (createApplicationDto.estimatedSubsidy !== undefined && createApplicationDto.estimatedSubsidy !== null) {
        insertData.estimatedSubsidy = createApplicationDto.estimatedSubsidy.toString();
      }
      if (createApplicationDto.documents) {
        insertData.documents = createApplicationDto.documents;
      }

      console.log('Insert data:', JSON.stringify(insertData, null, 2));

      const result = await this.db
        .insert(applications)
        .values(insertData)
        .returning();

      return result;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

  async findAll(userId: number, role: string, queryParams: any = {}) {
    const { page, limit, status, search } = queryParams;
    const pageNumber = page ? parseInt(page) : undefined;
    const limitNumber = limit ? parseInt(limit) : undefined;
    const offset = pageNumber && limitNumber ? (pageNumber - 1) * limitNumber : undefined;

    const conditions = [];

    // Role filtering
    if (role === 'user') {
      conditions.push(eq(applications.userId, userId));
    }

    // Status filter
    if (status) {
      conditions.push(eq(applications.status, status));
    }

    // Search filter
    if (search) {
      const searchCondition = or(
        ilike(applications.applicationNumber, `%${search}%`),
        ilike(applications.applicantName, `%${search}%`),
        ilike(applications.city, `%${search}%`),
        ilike(applications.state, `%${search}%`)
      );
      if (searchCondition) conditions.push(searchCondition);
    }

    // Build Query
    const baseQuery = this.db
      .select({
        application: applications,
        scheme: schemes,
        user: users,
      })
      .from(applications)
      .leftJoin(schemes, eq(applications.schemeId, schemes.id))
      .leftJoin(users, eq(applications.userId, users.id));

    if (conditions.length > 0) {
      baseQuery.where(and(...conditions));
    }

    // Pagination
    if (limitNumber) {
      baseQuery.limit(limitNumber);
    }
    if (offset) {
      baseQuery.offset(offset);
    }

    const data = await baseQuery.orderBy(desc(applications.createdAt));

    // Meta for pagination
    if (pageNumber && limitNumber) {
      const countQuery = this.db
        .select({ count: sql<number>`count(*)` })
        .from(applications)
        .leftJoin(schemes, eq(applications.schemeId, schemes.id))
        .leftJoin(users, eq(applications.userId, users.id));

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
