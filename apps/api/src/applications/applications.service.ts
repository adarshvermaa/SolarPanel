import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/types';
import { applications } from '../db/schema';
import { eq } from 'drizzle-orm';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

  async create(userId: number, createApplicationDto: CreateApplicationDto) {
    return this.db
      .insert(applications)
      .values({
        userId,
        schemeId: createApplicationDto.schemeId,
        documents: createApplicationDto.documents,
        notes: createApplicationDto.notes,
      })
      .returning();
  }

  async findAll() {
    return this.db.select().from(applications);
  }

  async findOne(id: number) {
    const result = await this.db.select().from(applications).where(eq(applications.id, id));
    return result[0];
  }

  async findByUser(userId: number) {
    return this.db.select().from(applications).where(eq(applications.userId, userId));
  }

  async updateStatus(id: number, status: 'pending' | 'approved' | 'rejected' | 'scheduled' | 'installed') {
    return this.db
      .update(applications)
      .set({ status })
      .where(eq(applications.id, id))
      .returning();
  }
}
