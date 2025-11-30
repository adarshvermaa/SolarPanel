import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/types';
import { schemes } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class SchemesService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

  async create(createSchemeDto: typeof schemes.$inferInsert) {
    return this.db.insert(schemes).values(createSchemeDto).returning();
  }

  async findAll() {
    return this.db.select().from(schemes);
  }

  async findOne(id: number) {
    const result = await this.db.select().from(schemes).where(eq(schemes.id, id));
    return result[0];
  }
}
