import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/types'; // Need to define types
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

    async create(userData: typeof users.$inferInsert) {
        const hashedPassword = await bcrypt.hash(userData.passwordHash, 10);
        return this.db
            .insert(users)
            .values({ ...userData, passwordHash: hashedPassword })
            .returning();
    }

    async findByEmail(email: string) {
        const result = await this.db.select().from(users).where(eq(users.email, email));
        return result[0];
    }

    async findById(id: number) {
        const result = await this.db.select().from(users).where(eq(users.id, id));
        return result[0];
    }
}
