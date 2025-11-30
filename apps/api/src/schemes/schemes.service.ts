import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/types';
import { schemes } from '../db/schema';
import { eq, desc, ilike, and } from 'drizzle-orm';
import { CreateSchemeDto } from './dto/create-scheme.dto';

@Injectable()
export class SchemesService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

  async create(createSchemeDto: CreateSchemeDto, userId: number) {
    const slug = createSchemeDto.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    return this.db
      .insert(schemes)
      .values({
        ...createSchemeDto,
        slug,
        createdBy: userId,
        eligibilityCriteria: createSchemeDto.eligibilityCriteria as any,
        documents: createSchemeDto.documents as any,
        subsidyPercentage: createSchemeDto.subsidyPercentage?.toString(),
        maxSubsidyAmount: createSchemeDto.maxSubsidyAmount?.toString(),
        minCapacity: createSchemeDto.minCapacity?.toString(),
        maxCapacity: createSchemeDto.maxCapacity?.toString(),
      })
      .returning();
  }

  async findAll(query?: { search?: string; isActive?: boolean }) {
    const conditions = [];

    if (query?.search) {
      conditions.push(ilike(schemes.name, `%${query.search}%`));
    }

    if (query?.isActive !== undefined) {
      conditions.push(eq(schemes.isActive, query.isActive));
    }

    return this.db
      .select()
      .from(schemes)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(schemes.createdAt));
  }

  async findOne(id: number) {
    const result = await this.db
      .select()
      .from(schemes)
      .where(eq(schemes.id, id));

    if (!result.length) {
      throw new NotFoundException(`Scheme with ID ${id} not found`);
    }

    return result[0];
  }

  async findBySlug(slug: string) {
    const result = await this.db
      .select()
      .from(schemes)
      .where(eq(schemes.slug, slug));

    if (!result.length) {
      throw new NotFoundException(`Scheme with slug ${slug} not found`);
    }

    return result[0];
  }

  async update(id: number, updateSchemeDto: Partial<CreateSchemeDto>) {
    // Check if exists
    await this.findOne(id);

    const updateData: any = { ...updateSchemeDto };

    // Convert numbers to strings for decimal fields if present
    if (updateSchemeDto.subsidyPercentage) updateData.subsidyPercentage = updateSchemeDto.subsidyPercentage.toString();
    if (updateSchemeDto.maxSubsidyAmount) updateData.maxSubsidyAmount = updateSchemeDto.maxSubsidyAmount.toString();
    if (updateSchemeDto.minCapacity) updateData.minCapacity = updateSchemeDto.minCapacity.toString();
    if (updateSchemeDto.maxCapacity) updateData.maxCapacity = updateSchemeDto.maxCapacity.toString();

    return this.db
      .update(schemes)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(schemes.id, id))
      .returning();
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.db.delete(schemes).where(eq(schemes.id, id)).returning();
  }
}
