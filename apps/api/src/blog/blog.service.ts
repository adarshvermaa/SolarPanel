import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/types';
import { blogPosts, users } from '../db/schema';
import { eq, desc, ilike, and, sql } from 'drizzle-orm';
import { CreatePostDto, UpdatePostDto } from './dto/create-post.dto';

@Injectable()
export class BlogService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

  async create(createDto: CreatePostDto, authorId: number) {
    const slug = createDto.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    return this.db
      .insert(blogPosts)
      .values({
        ...createDto,
        slug,
        authorId,
        publishedAt: createDto.isPublished ? new Date() : null,
        tags: createDto.tags as any,
      })
      .returning();
  }

  async findAll(query?: { search?: string; isPublished?: boolean; page?: number; limit?: number }) {
    const conditions = [];

    if (query?.search) {
      conditions.push(ilike(blogPosts.title, `%${query.search}%`));
    }

    if (query?.isPublished !== undefined) {
      conditions.push(eq(blogPosts.isPublished, query.isPublished));
    }

    const { page, limit } = query || {};
    const offset = page && limit ? (page - 1) * limit : 0;

    const baseQuery = this.db
      .select({
        post: blogPosts,
        author: {
          fullName: users.fullName,
          avatar: users.avatar,
        },
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(blogPosts.createdAt));

    if (limit) {
      baseQuery.limit(limit);
      baseQuery.offset(offset);
    }

    const data = await baseQuery;

    if (page && limit) {
      const countResult = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(blogPosts)
        .where(conditions.length ? and(...conditions) : undefined);

      const total = Number(countResult[0]?.count || 0);

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    return data;
  }

  async findOne(id: number) {
    const result = await this.db
      .select({
        post: blogPosts,
        author: {
          fullName: users.fullName,
          avatar: users.avatar,
        },
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.id, id));

    if (!result.length) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return result[0];
  }

  async findBySlug(slug: string) {
    const result = await this.db
      .select({
        post: blogPosts,
        author: {
          fullName: users.fullName,
          avatar: users.avatar,
        },
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.slug, slug));

    if (!result.length) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }

    // Increment view count
    await this.db
      .update(blogPosts)
      .set({ viewCount: (result[0].post.viewCount || 0) + 1 })
      .where(eq(blogPosts.id, result[0].post.id));

    return result[0];
  }

  async update(id: number, updateDto: UpdatePostDto) {
    await this.findOne(id);

    return this.db
      .update(blogPosts)
      .set({
        ...updateDto,
        updatedAt: new Date(),
        tags: updateDto.tags as any,
      })
      .where(eq(blogPosts.id, id))
      .returning();
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
  }
}
