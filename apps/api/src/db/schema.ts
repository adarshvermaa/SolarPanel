import {
    pgTable,
    serial,
    text,
    timestamp,
    boolean,
    jsonb,
    integer,
    pgEnum,
    decimal,
    uuid,
    varchar,
    uniqueIndex
} from 'drizzle-orm/pg-core';

// ============================================================
// ENUMS
// ============================================================

export const roleEnum = pgEnum('role', ['superadmin', 'admin', 'agent', 'user']);
export const applicationStatusEnum = pgEnum('application_status', [
    'pending',
    'under_review',
    'approved',
    'rejected',
    'in_progress',
    'completed',
    'cancelled'
]);
export const installationStatusEnum = pgEnum('installation_status', [
    'scheduled',
    'in_progress',
    'completed',
    'cancelled'
]);
export const mediaCategoryEnum = pgEnum('media_category', [
    'document',
    'photo',
    'avatar',
    'blog_image',
    'scheme_image'
]);
export const notificationTypeEnum = pgEnum('notification_type', [
    'email',
    'whatsapp',
    'sms'
]);
export const notificationStatusEnum = pgEnum('notification_status', [
    'pending',
    'sent',
    'failed',
    'delivered'
]);

// ============================================================
// USERS & AUTHENTICATION
// ============================================================

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').defaultRandom().notNull().unique(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: roleEnum('role').default('user').notNull(),
    fullName: text('full_name').notNull(),
    phone: text('phone'),
    avatar: text('avatar'), // S3 URL
    isActive: boolean('is_active').default(true).notNull(),
    emailVerified: boolean('email_verified').default(false),
    lastLoginAt: timestamp('last_login_at'),
    refreshToken: text('refresh_token'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// SCHEMES MANAGEMENT
// ============================================================

export const schemes = pgTable('schemes', {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').defaultRandom().notNull().unique(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description').notNull(),
    shortDescription: text('short_description'),
    eligibilityCriteria: jsonb('eligibility_criteria'), // Structured criteria
    benefits: text('benefits'),
    subsidyPercentage: decimal('subsidy_percentage', { precision: 5, scale: 2 }),
    maxSubsidyAmount: decimal('max_subsidy_amount', { precision: 12, scale: 2 }),
    minCapacity: decimal('min_capacity', { precision: 8, scale: 2 }), // kW
    maxCapacity: decimal('max_capacity', { precision: 8, scale: 2 }), // kW
    coverImage: text('cover_image'), // S3 URL
    documents: jsonb('documents'), // Supporting documents
    isActive: boolean('is_active').default(true).notNull(),
    startDate: timestamp('start_date'),
    endDate: timestamp('end_date'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    createdBy: integer('created_by').references(() => users.id),
});

// ============================================================
// AGENT-SCHEME ASSIGNMENTS
// ============================================================

export const agentSchemes = pgTable('agent_schemes', {
    id: serial('id').primaryKey(),
    agentId: integer('agent_id').references(() => users.id).notNull(),
    schemeId: integer('scheme_id').references(() => schemes.id).notNull(),
    assignedAt: timestamp('assigned_at').defaultNow().notNull(),
    assignedBy: integer('assigned_by').references(() => users.id),
    isActive: boolean('is_active').default(true).notNull(),
});

// ============================================================
// APPLICATIONS
// ============================================================

export const applications = pgTable('applications', {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').defaultRandom().notNull().unique(),
    applicationNumber: varchar('application_number', { length: 50 }).notNull().unique(),
    userId: integer('user_id').references(() => users.id).notNull(),
    schemeId: integer('scheme_id').references(() => schemes.id).notNull(),
    assignedAgentId: integer('assigned_agent_id').references(() => users.id),
    status: applicationStatusEnum('status').default('pending').notNull(),

    // Applicant details
    applicantName: text('applicant_name').notNull(),
    applicantEmail: text('applicant_email').notNull(),
    applicantPhone: text('applicant_phone').notNull(),

    // Property details
    address: text('address').notNull(),
    city: text('city').notNull(),
    state: text('state').notNull(),
    pincode: varchar('pincode', { length: 10 }).notNull(),
    propertyType: text('property_type'), // residential, commercial, etc.
    roofArea: decimal('roof_area', { precision: 10, scale: 2 }),
    roofType: text('roof_type'),

    // System details
    requestedCapacity: decimal('requested_capacity', { precision: 8, scale: 2 }), // kW
    estimatedCost: decimal('estimated_cost', { precision: 12, scale: 2 }),
    estimatedSubsidy: decimal('estimated_subsidy', { precision: 12, scale: 2 }),

    // Documentation
    documents: jsonb('documents'), // Array of S3 URLs with metadata

    // Review details
    reviewNotes: text('review_notes'),
    reviewedBy: integer('reviewed_by').references(() => users.id),
    reviewedAt: timestamp('reviewed_at'),
    rejectionReason: text('rejection_reason'),

    // Timeline
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
    approvedAt: timestamp('approved_at'),
    completedAt: timestamp('completed_at'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// INSTALLATIONS
// ============================================================

export const installations = pgTable('installations', {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').defaultRandom().notNull().unique(),
    applicationId: integer('application_id').references(() => applications.id).notNull(),
    installerId: integer('installer_id').references(() => users.id),
    status: installationStatusEnum('status').default('scheduled').notNull(),

    // Installation details
    scheduledDate: timestamp('scheduled_date'),
    startDate: timestamp('start_date'),
    completionDate: timestamp('completion_date'),

    // System specs
    actualCapacity: decimal('actual_capacity', { precision: 8, scale: 2 }), // kW
    panelCount: integer('panel_count'),
    panelType: text('panel_type'),
    inverterType: text('inverter_type'),
    inverterCapacity: decimal('inverter_capacity', { precision: 8, scale: 2 }),

    // Cost details
    totalCost: decimal('total_cost', { precision: 12, scale: 2 }),
    subsidyApplied: decimal('subsidy_applied', { precision: 12, scale: 2 }),
    finalCost: decimal('final_cost', { precision: 12, scale: 2 }),

    // Documentation
    photos: jsonb('photos'), // Array of S3 URLs
    completionCertificate: text('completion_certificate'), // S3 URL
    warrantyDocument: text('warranty_document'), // S3 URL

    // Additional info
    notes: text('notes'),
    warrantyYears: integer('warranty_years'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// MEDIA / FILE MANAGEMENT
// ============================================================

export const media = pgTable('media', {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').defaultRandom().notNull().unique(),
    userId: integer('user_id').references(() => users.id).notNull(),
    filename: text('filename').notNull(),
    originalFilename: text('original_filename').notNull(),
    mimeType: text('mime_type').notNull(),
    size: integer('size').notNull(), // bytes
    s3Key: text('s3_key').notNull(),
    s3Url: text('s3_url').notNull(),
    category: mediaCategoryEnum('category').default('document').notNull(),
    relatedEntity: text('related_entity'), // e.g., 'application', 'blog', 'scheme'
    relatedEntityId: integer('related_entity_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// BLOG
// ============================================================

export const blogPosts = pgTable('blog_posts', {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').defaultRandom().notNull().unique(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    excerpt: text('excerpt'),
    content: text('content').notNull(),
    coverImage: text('cover_image'), // S3 URL
    authorId: integer('author_id').references(() => users.id).notNull(),
    isPublished: boolean('is_published').default(false).notNull(),
    publishedAt: timestamp('published_at'),
    tags: jsonb('tags'), // Array of tags
    metaTitle: text('meta_title'),
    metaDescription: text('meta_description'),
    viewCount: integer('view_count').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================
// NOTIFICATIONS
// ============================================================

export const notificationTemplates = pgTable('notification_templates', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 100 }).notNull().unique(),
    name: text('name').notNull(),
    type: notificationTypeEnum('type').notNull(),
    subject: text('subject'), // For email
    template: text('template').notNull(), // Template with placeholders
    variables: jsonb('variables'), // Available variables
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const notifications = pgTable('notifications', {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').defaultRandom().notNull().unique(),
    type: notificationTypeEnum('type').notNull(),
    recipientId: integer('recipient_id').references(() => users.id),
    recipientEmail: text('recipient_email'),
    recipientPhone: text('recipient_phone'),
    templateId: integer('template_id').references(() => notificationTemplates.id),
    subject: text('subject'),
    message: text('message').notNull(),
    status: notificationStatusEnum('status').default('pending').notNull(),
    sentAt: timestamp('sent_at'),
    deliveredAt: timestamp('delivered_at'),
    failedReason: text('failed_reason'),
    metadata: jsonb('metadata'), // Additional context
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// AUDIT LOGS
// ============================================================

export const auditLogs = pgTable('audit_logs', {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').defaultRandom().notNull().unique(),
    userId: integer('user_id').references(() => users.id),
    action: text('action').notNull(), // e.g., 'CREATE', 'UPDATE', 'DELETE'
    entity: text('entity').notNull(), // e.g., 'application', 'scheme', 'user'
    entityId: integer('entity_id'),
    changes: jsonb('changes'), // Before/after values
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// CALCULATOR CONFIG
// ============================================================

export const calculatorConfig = pgTable('calculator_config', {
    id: serial('id').primaryKey(),
    stateName: text('state_name').unique().notNull(), // 'Default' or specific states
    avgSunlightHours: decimal('avg_sunlight_hours', { precision: 4, scale: 2 }).notNull(),
    costPerKw: decimal('cost_per_kw', { precision: 10, scale: 2 }).notNull(),
    electricityRate: decimal('electricity_rate', { precision: 6, scale: 2 }).notNull(), // Cost per unit
    efficiencyPanel: decimal('efficiency_panel', { precision: 5, scale: 2 }).default('0.18').notNull(), // 18% default
    co2SavingsPerUnit: decimal('co2_savings_per_unit', { precision: 6, scale: 3 }).default('0.71').notNull(), // kg CO2 per kWh
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

