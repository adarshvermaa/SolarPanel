import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/types';
import { users } from '../db/schema';
import { eq, ilike, or, and, sql, desc } from 'drizzle-orm';
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

    async findAll(query: any = {}) {
        const { page, limit, search } = query;
        const pageNumber = page ? parseInt(page) : undefined;
        const limitNumber = limit ? parseInt(limit) : undefined;
        const offset = pageNumber && limitNumber ? (pageNumber - 1) * limitNumber : undefined;

        const conditions = [];

        if (search) {
            const searchCondition = or(
                ilike(users.fullName, `%${search}%`),
                ilike(users.email, `%${search}%`)
            );
            if (searchCondition) conditions.push(searchCondition);
        }

        const baseQuery = this.db.select({
            id: users.id,
            email: users.email,
            fullName: users.fullName,
            role: users.role,
            isActive: users.isActive,
            createdAt: users.createdAt,
        }).from(users);

        if (conditions.length > 0) {
            baseQuery.where(and(...conditions));
        }

        if (limitNumber) {
            baseQuery.limit(limitNumber);
        }
        if (offset) {
            baseQuery.offset(offset);
        }

        const data = await baseQuery.orderBy(desc(users.createdAt));

        if (pageNumber && limitNumber) {
            const countQuery = this.db
                .select({ count: sql<number>`count(*)` })
                .from(users)
                .where(conditions.length > 0 ? and(...conditions) : undefined);

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
