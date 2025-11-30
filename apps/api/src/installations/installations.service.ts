import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/types';
import { installations } from '../db/schema';
import { eq } from 'drizzle-orm';
import { CreateInstallationDto } from './dto/create-installation.dto';

@Injectable()
export class InstallationsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

  async create(createInstallationDto: CreateInstallationDto) {
    return this.db
      .insert(installations)
      .values({
        applicationId: createInstallationDto.applicationId,
        installerId: createInstallationDto.installerId,
        scheduledDate: createInstallationDto.scheduledDate ? new Date(createInstallationDto.scheduledDate) : null,
        status: 'scheduled',
      })
      .returning();
  }

  async findAll() {
    return this.db.select().from(installations);
  }

  async findOne(id: number) {
    const result = await this.db.select().from(installations).where(eq(installations.id, id));
    return result[0];
  }

  async updateStatus(id: number, status: string) {
    return this.db
      .update(installations)
      .set({ status })
      .where(eq(installations.id, id))
      .returning();
  }
}
