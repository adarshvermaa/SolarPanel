import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/types';
import { users, applications, schemes, installations } from '../db/schema';
import { sql } from 'drizzle-orm';

@Injectable()
export class AdminService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

  async getDashboardStats() {
    const [usersCount] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const [applicationsCount] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(applications);

    const [schemesCount] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schemes);

    const [installationsCount] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(installations);

    const recentApplications = await this.db
      .select()
      .from(applications)
      .limit(5)
      .orderBy(sql`${applications.createdAt} DESC`);

    return {
      stats: {
        totalUsers: Number(usersCount.count),
        totalApplications: Number(applicationsCount.count),
        totalSchemes: Number(schemesCount.count),
        totalInstallations: Number(installationsCount.count),
      },
      recentApplications,
    };
  }
}
