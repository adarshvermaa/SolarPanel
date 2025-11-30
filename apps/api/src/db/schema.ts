import { pgTable, serial, text, timestamp, boolean, jsonb, integer, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['user', 'admin', 'installer']);
export const appStatusEnum = pgEnum('application_status', ['pending', 'approved', 'rejected', 'scheduled', 'installed']);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: roleEnum('role').default('user').notNull(),
    fullName: text('full_name'),
    phone: text('phone'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const schemes = pgTable('schemes', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    eligibilityCriteria: text('eligibility_criteria'),
    benefits: text('benefits'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const applications = pgTable('applications', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    schemeId: integer('scheme_id').references(() => schemes.id).notNull(),
    status: appStatusEnum('status').default('pending').notNull(),
    documents: jsonb('documents'), // Stores S3 URLs
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const installations = pgTable('installations', {
    id: serial('id').primaryKey(),
    applicationId: integer('application_id').references(() => applications.id).notNull(),
    installerId: integer('installer_id').references(() => users.id),
    scheduledDate: timestamp('scheduled_date'),
    completionDate: timestamp('completion_date'),
    status: text('status'), // e.g., 'scheduled', 'completed'
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    authorId: integer('author_id').references(() => users.id).notNull(),
    published: boolean('published').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
