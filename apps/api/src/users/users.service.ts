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
        // Password is already hashed in AuthService
        return this.db
            .insert(users)
            .values(userData)
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
    async findAll() {
        return this.db.select({
            id: users.id,
            email: users.email,
            fullName: users.fullName,
            role: users.role,
            isActive: users.isActive,
            createdAt: users.createdAt,
        }).from(users);
    }

    async update(id: number, updateData: Partial<typeof users.$inferInsert>) {
        return this.db
            .update(users)
            .set({ ...updateData, updatedAt: new Date() })
            .where(eq(users.id, id))
            .returning();
    }

    async remove(id: number) {
        return this.db
            .delete(users)
            .where(eq(users.id, id))
            .returning();
    }
}
