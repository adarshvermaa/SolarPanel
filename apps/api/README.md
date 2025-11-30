# Solar Panel Platform - Backend API

[![NestJS](https://img.shields.io/badge/NestJS-11.x-red)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-green)](https://orm.drizzle.team/)
[![Swagger](https://img.shields.io/badge/API-Swagger-85EA2D)](https://swagger.io/)

The backend API for the Solar Panel Government Scheme Platform, built with NestJS. This provides RESTful APIs for user management, application processing, installation tracking, and more.

## 📋 Table of Contents

- [Overview](#-overview)
- [Technology Stack](#-technology-stack)
- [Module Architecture](#-module-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Authentication](#-authentication)
- [File Upload](#-file-upload)
- [Notifications](#-notifications)
- [Testing](#-testing)
- [Deployment](#-deployment)

## 🎯 Overview

This NestJS API provides a comprehensive backend for managing solar panel installations under government schemes. Key capabilities include:

- **User Management**: Registration, authentication, profile management
- **Application Processing**: Submit and track solar installation applications
- **Admin Dashboard**: Review and approve applications
- **Installation Tracking**: Monitor solar panel installations
- **Scheme Management**: Configure government schemes and eligibility
- **Media Management**: Upload documents and images to AWS S3
- **Notifications**: Automated email and WhatsApp notifications
- **Blog Management**: Educational content about solar energy

## 🛠️ Technology Stack

- **Framework**: NestJS 11.0.1 (Node.js framework)
- **Language**: TypeScript 5.7.3
- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM 0.44.7
- **Authentication**: JWT with Passport.js
- **Password Hashing**: bcrypt
- **Cloud Storage**: AWS S3 (SDK v3)
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest 30.0.0
- **Validation**: class-validator & class-transformer

## 🏗️ Module Architecture

The API follows a modular architecture with domain-driven design:

```
src/
├── main.ts                 # Application entry point
├── app.module.ts           # Root module
├── app.controller.ts       # Health check endpoints
├── app.service.ts          # Core services
│
├── auth/                   # Authentication & Authorization
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── guards/             # JWT guards
│   └── strategies/         # Passport strategies
│
├── users/                  # User Management
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/                # Data Transfer Objects
│
├── admin/                  # Admin Management
│   ├── admin.module.ts
│   ├── admin.controller.ts
│   └── admin.service.ts
│
├── applications/           # Application Processing
│   ├── applications.module.ts
│   ├── applications.controller.ts
│   ├── applications.service.ts
│   └── dto/
│
├── installations/          # Installation Tracking
│   ├── installations.module.ts
│   ├── installations.controller.ts
│   ├── installations.service.ts
│   └── dto/
│
├── schemes/               # Scheme Management
│   ├── schemes.module.ts
│   ├── schemes.controller.ts
│   ├── schemes.service.ts
│   └── dto/
│
├── media/                 # File Upload & AWS S3
│   ├── media.module.ts
│   ├── media.controller.ts
│   ├── media.service.ts
│   └── s3.service.ts
│
├── notifications/         # Email & WhatsApp
│   ├── notifications.module.ts
│   ├── notifications.service.ts
│   ├── email.service.ts
│   └── whatsapp.service.ts
│
├── blog/                  # Blog Management
│   ├── blog.module.ts
│   ├── blog.controller.ts
│   ├── blog.service.ts
│   └── dto/
│
└── db/                    # Database
    ├── db.module.ts
    ├── schema/            # Drizzle schemas
    └── migrations/        # Database migrations
```

## 🚀 Getting Started

### Prerequisites

- Node.js v20.x or higher
- PostgreSQL v14 or higher
- npm v11.x or higher

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   
   Create a `.env` file in the project root (not in `apps/api/`):
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@host:port/dbname
   
   # JWT
   JWT_SECRET=your-super-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   
   # AWS S3
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_S3_BUCKET=your-bucket-name
   
   # Notifications
   WHATSAPP_API_TOKEN=your-whatsapp-token
   WHATSAPP_PHONE_NUMBER_ID=your-phone-id
   EMAIL_SOURCE=noreply@example.com
   ```

3. **Set up the database**
   ```bash
   # Generate migrations
   npx drizzle-kit generate
   
   # Push schema to database
   npx drizzle-kit push
   
   # View database in Drizzle Studio
   npx drizzle-kit studio
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3001`

## 📚 API Documentation

### Swagger UI

Once the server is running, access the interactive API documentation:

```
http://localhost:3001/api
```

### API Endpoints Overview

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get current user profile

#### Users
- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user (Admin only)

#### Applications
- `POST /applications` - Submit new application
- `GET /applications` - Get all applications
- `GET /applications/:id` - Get application by ID
- `PATCH /applications/:id` - Update application
- `PATCH /applications/:id/status` - Update application status (Admin)
- `DELETE /applications/:id` - Delete application

#### Installations
- `POST /installations` - Create installation record
- `GET /installations` - Get all installations
- `GET /installations/:id` - Get installation by ID
- `PATCH /installations/:id` - Update installation
- `PATCH /installations/:id/status` - Update installation status

#### Schemes
- `POST /schemes` - Create new scheme (Admin)
- `GET /schemes` - Get all active schemes
- `GET /schemes/:id` - Get scheme by ID
- `PATCH /schemes/:id` - Update scheme (Admin)
- `DELETE /schemes/:id` - Delete scheme (Admin)

#### Media
- `POST /media/upload` - Upload file to S3
- `GET /media/:id` - Get file metadata
- `DELETE /media/:id` - Delete file

#### Blog
- `POST /blog` - Create blog post (Admin)
- `GET /blog` - Get all blog posts
- `GET /blog/:id` - Get blog post by ID
- `PATCH /blog/:id` - Update blog post (Admin)
- `DELETE /blog/:id` - Delete blog post (Admin)

#### Admin
- `GET /admin/dashboard` - Get dashboard stats
- `GET /admin/users` - Get all users with filters
- `GET /admin/applications` - Get all applications with filters
- `PATCH /admin/applications/:id/approve` - Approve application
- `PATCH /admin/applications/:id/reject` - Reject application

## 🗄️ Database Schema

The application uses Drizzle ORM with PostgreSQL. Key tables include:

### Core Tables

**users**
- `id` (UUID, Primary Key)
- `email` (Unique, Not Null)
- `password` (Hashed, Not Null)
- `name` (Not Null)
- `phone`
- `role` (enum: 'user', 'admin')
- `createdAt`, `updatedAt`

**applications**
- `id` (UUID, Primary Key)
- `userId` (Foreign Key → users)
- `schemeId` (Foreign Key → schemes)
- `status` (enum: 'pending', 'approved', 'rejected', 'in_progress', 'completed')
- `address`
- `city`, `state`, `pincode`
- `electricityBill`
- `roofType`
- `roofArea`
- `documents` (JSON array)
- `createdAt`, `updatedAt`

**installations**
- `id` (UUID, Primary Key)
- `applicationId` (Foreign Key → applications)
- `installerId`
- `status` (enum: 'scheduled', 'in_progress', 'completed', 'cancelled')
- `scheduledDate`
- `completedDate`
- `capacity`
- `panelCount`
- `inverterType`
- `cost`
- `photos` (JSON array)
- `notes`
- `createdAt`, `updatedAt`

**schemes**
- `id` (UUID, Primary Key)
- `name` (Not Null)
- `description`
- `eligibilityCriteria` (JSON)
- `subsidy` (Decimal)
- `maxCapacity` (Decimal)
- `isActive` (Boolean)
- `startDate`, `endDate`
- `createdAt`, `updatedAt`

**media**
- `id` (UUID, Primary Key)
- `userId` (Foreign Key → users)
- `filename`
- `mimeType`
- `size`
- `s3Key`
- `s3Url`
- `category` (enum: 'document', 'photo', 'avatar')
- `createdAt`

**blog_posts**
- `id` (UUID, Primary Key)
- `authorId` (Foreign Key → users)
- `title` (Not Null)
- `slug` (Unique)
- `content` (Text)
- `excerpt`
- `coverImage`
- `isPublished` (Boolean)
- `publishedAt`
- `createdAt`, `updatedAt`

### Migrations

```bash
# Generate migration files
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit push

# Open Drizzle Studio
npx drizzle-kit studio
```

## 🔐 Authentication

### JWT Strategy

The API uses JWT (JSON Web Tokens) for authentication with refresh token support:

1. **Login**: User provides credentials → Receives access token + refresh token
2. **Access Token**: Short-lived (15 min), used for API requests
3. **Refresh Token**: Long-lived (7 days), used to get new access tokens
4. **Guards**: Protected routes use `@UseGuards(JwtAuthGuard)`

### Role-Based Access Control (RBAC)

- **User Role**: Can submit applications, view own data
- **Admin Role**: Can manage all data, approve applications, manage schemes

Example usage:
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get('dashboard')
getDashboard() {
  // Only accessible to admins
}
```

## 📁 File Upload

### AWS S3 Integration

Files are uploaded directly to AWS S3:

1. **Upload Endpoint**: `POST /media/upload`
2. **Supported Types**: Images (jpg, png), PDFs, documents
3. **Max Size**: 10MB per file
4. **Storage**: Files stored in S3 with unique keys
5. **Access**: Pre-signed URLs generated for secure access

Example usage:
```bash
curl -X POST http://localhost:3001/media/upload \
  -H "Authorization: Bearer {token}" \
  -F "file=@document.pdf" \
  -F "category=document"
```

## 📬 Notifications

### Email Notifications

Sent for:
- Registration confirmation
- Application status updates
- Installation scheduling
- Password reset

### WhatsApp Notifications

Sent for:
- Application approval
- Installation scheduling
- Important updates

Configuration:
```env
WHATSAPP_API_TOKEN=your-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-id
EMAIL_SOURCE=noreply@example.com
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov
```

### E2E Tests

```bash
# Run end-to-end tests
npm run test:e2e
```

### Test Structure

```
test/
├── app.e2e-spec.ts        # Application tests
├── auth.e2e-spec.ts       # Authentication tests
└── jest-e2e.json          # E2E configuration
```

## 🚢 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Using PM2

```bash
# Start with PM2 (from root directory)
pm2 start ecosystem.config.js

# View logs
pm2 logs api

# Restart
pm2 restart api
```

### Environment Variables

Ensure all required environment variables are set in production:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Strong secret for JWT signing
- `JWT_REFRESH_SECRET` - Strong secret for refresh tokens
- `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` - AWS credentials
- `AWS_S3_BUCKET` - S3 bucket name

### Health Checks

```bash
# Check API health
curl http://localhost:3001/

# Check Swagger docs
curl http://localhost:3001/api
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run start:prod` | Start production server (alternative) |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:cov` | Generate test coverage |

## 🔧 Configuration Files

- **nest-cli.json**: NestJS CLI configuration
- **tsconfig.json**: TypeScript configuration
- **eslint.config.mjs**: ESLint configuration
- **.prettierrc**: Prettier configuration
- **drizzle.config.ts**: Drizzle ORM configuration

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [AWS S3 SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)

## 📝 License

This project is proprietary and confidential.

---

**Part of the Solar Panel Government Scheme Platform**
