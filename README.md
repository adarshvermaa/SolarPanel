# Solar Panel Government Scheme Platform

[![Turborepo](https://img.shields.io/badge/built%20with-Turborepo-blueviolet)](https://turbo.build/repo)
[![NestJS](https://img.shields.io/badge/backend-NestJS-red)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/frontend-Next.js%2016-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/language-TypeScript-blue)](https://www.typescriptlang.org/)

A comprehensive full-stack platform for managing solar panel installations through government schemes. This monorepo contains both backend API and frontend web application.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Deployment](#-deployment)
- [Available Scripts](#-available-scripts)
- [Features](#-features)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)

## 🎯 Project Overview

This platform streamlines the process of solar panel installations under government schemes. It provides:

- **User Portal**: Application submission and tracking
- **Admin Dashboard**: Application review and management
- **Installation Management**: Track and manage solar installations
- **Scheme Management**: Configure government schemes
- **Media Management**: Upload and manage documents via AWS S3
- **Notifications**: Email and WhatsApp notifications
- **Blog**: Educational content about solar energy

## 🏗️ Architecture

This is a **Turborepo monorepo** containing:

```
SolarPanel/
├── apps/
│   ├── api/          # NestJS Backend API
│   └── web/          # Next.js Frontend Application
├── script/           # Deployment and build scripts
└── [config files]    # Monorepo configuration
```

### Design Principles

- **Monorepo Architecture**: Unified codebase with Turborepo for efficient builds
- **Microservices Pattern**: Modular NestJS backend with domain-driven design
- **Server-Side Rendering**: Next.js for optimal performance and SEO
- **Type Safety**: End-to-end TypeScript for reliability
- **Cloud-First**: AWS S3 integration for media storage

## 🛠️ Technology Stack

### Backend (API)
- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT with Passport.js
- **Cloud Storage**: AWS S3
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest

### Frontend (Web)
- **Framework**: Next.js 16.x (App Router)
- **Language**: TypeScript 5.x
- **UI Library**: React 19.x
- **Styling**: Tailwind CSS 4.x
- **Animations**: GSAP 3.x
- **Linting**: ESLint

### DevOps
- **Monorepo**: Turborepo
- **Package Manager**: npm 11.x
- **Process Manager**: PM2 (via ecosystem.config.js)
- **CI/CD**: PowerShell deployment scripts

## 📁 Project Structure

```
SolarPanel/
├── apps/
│   ├── api/                    # Backend Application
│   │   ├── src/
│   │   │   ├── admin/          # Admin management module
│   │   │   ├── applications/   # Application handling
│   │   │   ├── auth/           # Authentication & authorization
│   │   │   ├── blog/           # Blog module
│   │   │   ├── db/             # Database schemas & migrations
│   │   │   ├── installations/  # Installation tracking
│   │   │   ├── media/          # Media upload & AWS S3
│   │   │   ├── notifications/  # Email & WhatsApp notifications
│   │   │   ├── schemes/        # Scheme management
│   │   │   └── users/          # User management
│   │   ├── test/               # E2E tests
│   │   └── [config files]
│   │
│   └── web/                    # Frontend Application
│       ├── src/
│       │   ├── app/            # Next.js app router pages
│       │   └── components/     # Reusable React components
│       ├── public/             # Static assets
│       └── [config files]
│
├── script/
│   ├── build.ps1              # Build script
│   ├── deploy.ps1             # Deployment script
│   └── dev.ps1                # Development script
│
├── .env                       # Environment variables (local)
├── .env.example               # Environment template
├── ecosystem.config.js        # PM2 configuration
├── turbo.json                 # Turborepo configuration
└── package.json               # Root workspace configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.x or higher
- **npm**: v11.6.2 or higher
- **PostgreSQL**: v14 or higher
- **AWS Account**: For S3 storage (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SolarPanel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   - Database credentials
   - JWT secrets
   - AWS credentials
   - Notification API tokens

4. **Set up the database**
   ```bash
   cd apps/api
   npm run db:push    # Push schema to database
   npm run db:seed    # Seed initial data (if available)
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend API: `http://localhost:3001`
   - Frontend Web: `http://localhost:3000`

## 💻 Development

### Running Individual Apps

**Backend API only:**
```bash
cd apps/api
npm run dev
```

**Frontend Web only:**
```bash
cd apps/web
npm run dev
```

### Code Quality

```bash
# Run linting across all apps
npm run lint

# Format code
npm run format
```

### Testing

```bash
# Run API tests
cd apps/api
npm run test           # Unit tests
npm run test:e2e       # E2E tests
npm run test:cov       # Coverage report
```

### Database Management

```bash
cd apps/api

# Generate migrations
npx drizzle-kit generate

# Push changes to database
npx drizzle-kit push

# Open Drizzle Studio
npx drizzle-kit studio
```

## 🚢 Deployment

### Using PM2 (Recommended)

The project includes an `ecosystem.config.js` for PM2 deployment:

```bash
# Build all apps
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# View logs
pm2 logs

# Stop all
pm2 stop all
```

### Using PowerShell Scripts

```bash
# Development
.\script\dev.ps1

# Build
.\script\build.ps1

# Deploy
.\script\deploy.ps1
```

### Manual Deployment

```bash
# Build all apps
npm run build

# Start API (production)
cd apps/api
npm run start:prod

# Start Web (production)
cd apps/web
npm run start
```

## 📜 Available Scripts

### Root Level

| Script | Description |
|--------|-------------|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all apps for production |
| `npm run lint` | Lint all apps |
| `npm run format` | Format code with Prettier |

### API Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start API in watch mode |
| `npm run build` | Build for production |
| `npm run start:prod` | Start production server |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |

### Web Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## ✨ Features

### User Features
- ✅ User registration and authentication
- ✅ Application submission for solar installations
- ✅ Application status tracking
- ✅ Document upload and management
- ✅ Scheme browsing
- ✅ Blog/educational content

### Admin Features
- ✅ Application review and approval workflow
- ✅ User management
- ✅ Scheme configuration
- ✅ Installation tracking
- ✅ Blog management
- ✅ Dashboard with analytics

### Technical Features
- ✅ JWT authentication with refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ File upload to AWS S3
- ✅ Email notifications
- ✅ WhatsApp notifications
- ✅ Swagger API documentation
- ✅ Database migrations with Drizzle
- ✅ Type-safe API with TypeScript

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`:

### Database
```env
DATABASE_URL=postgresql://user:password@host:port/dbname
```

### Authentication
```env
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
```

### AWS Configuration
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name
```

### Notifications
```env
WHATSAPP_API_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-id
EMAIL_SOURCE=noreply@example.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential.

## 📞 Support

For questions or support, please contact the development team.

---

**Built with ❤️ for sustainable energy initiatives**