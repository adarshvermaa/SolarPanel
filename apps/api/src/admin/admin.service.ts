import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/types';
import { applications, users, installations } from '../db/schema';
import { sql } from 'drizzle-orm';

@Injectable()
export class AdminService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

  async getDashboardStats() {
    const [appsCount] = await this.db.select({ count: sql<number>`count(*)` }).from(applications);
    const [usersCount] = await this.db.select({ count: sql<number>`count(*)` }).from(users);
    const [installsCount] = await this.db.select({ count: sql<number>`count(*)` }).from(installations);

    return {
      applications: appsCount.count,
      users: usersCount.count,
      installations: installsCount.count,
    };
  }
}
