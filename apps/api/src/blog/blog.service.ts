import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/types';
import { posts } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class BlogService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

  async create(userId: number, createBlogDto: any) {
    return this.db
      .insert(posts)
      .values({ ...createBlogDto, authorId: userId })
      .returning();
  }

  async findAll() {
    return this.db.select().from(posts);
  }

  async findOne(id: number) {
    const result = await this.db.select().from(posts).where(eq(posts.id, id));
    return result[0];
  }
}
