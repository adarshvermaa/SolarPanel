# Solar Panel Platform - Web Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8)](https://tailwindcss.com/)

The frontend web application for the Solar Panel Government Scheme Platform, built with Next.js 16 using the App Router.

## 📋 Table of Contents

- [Overview](#-overview)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Features](#-features)
- [Development](#-development)
- [Building for Production](#-building-for-production)
- [Deployment](#-deployment)

## 🎯 Overview

This Next.js application provides an intuitive user interface for:

- **User Portal**: Browse schemes, submit applications, track status
- **Admin Dashboard**: Manage applications, users, and installations
- **Blog**: Educational content about solar energy
- **Responsive Design**: Mobile-first, works on all devices
- **Smooth Animations**: GSAP-powered transitions and effects

## 🛠️ Technology Stack

- **Framework**: Next.js 16.0.5 (App Router)
- **UI Library**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.x with PostCSS
- **Animations**: GSAP 3.13.0 with React integration
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── (auth)/            # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (user)/            # User portal routes
│   │   ├── dashboard/
│   │   ├── applications/
│   │   └── schemes/
│   ├── (admin)/           # Admin routes
│   │   ├── dashboard/
│   │   ├── applications/
│   │   ├── users/
│   │   └── installations/
│   └── blog/              # Blog pages
│
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── animations/       # GSAP animations
│
public/                    # Static assets
├── images/
├── icons/
└── fonts/
```

## 🚀 Getting Started

### Prerequisites

- Node.js v20.x or higher
- npm v11.x or higher

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   
   Create a `.env.local` file in the `apps/web` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## ✨ Features

### User Features

- **Home Page**: Landing page with scheme information
- **User Registration**: Create account with email/password
- **User Login**: Authenticate and access user portal
- **User Dashboard**: View application status and profile
- **Application Submission**: Apply for solar panel installations
- **Document Upload**: Upload required documents
- **Application Tracking**: Track application status in real-time
- **Scheme Browser**: Browse available government schemes
- **Blog**: Read educational content about solar energy

### Admin Features

- **Admin Dashboard**: Overview of all applications and users
- **Application Management**: Review, approve, or reject applications
- **User Management**: Manage user accounts
- **Installation Tracking**: Monitor installation progress
- **Scheme Management**: Create and configure schemes
- **Blog Management**: Create and publish blog posts
- **Analytics**: View statistics and reports

### Technical Features

- **Server-Side Rendering**: Fast initial page loads
- **Client-Side Navigation**: Instant page transitions
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Smooth Animations**: GSAP-powered animations
- **Form Validation**: Client-side and server-side validation
- **TypeScript**: Type-safe code throughout
- **Optimized Images**: Next.js Image component for performance
- **SEO Optimized**: Meta tags, Open Graph, and structured data

## 💻 Development

### Running the Dev Server

```bash
npm run dev
```

The app will reload automatically when you make changes.

### Code Quality

```bash
# Run ESLint
npm run lint

# Type checking (TypeScript)
npx tsc --noEmit
```

### Project Configuration

#### Next.js Configuration (`next.config.ts`)

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Configuration options
}

export default nextConfig
```

#### Tailwind Configuration (`tailwind.config.js`)

Tailwind CSS 4.x is configured with PostCSS for utility-first styling.

#### TypeScript Configuration (`tsconfig.json`)

Strict mode enabled with path aliases configured for clean imports.

## 🏗️ Building for Production

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### Start Production Server

```bash
npm run start
```

The production server will start on `http://localhost:3000`.

### Build Optimization

Next.js automatically optimizes your application:

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Automatic image optimization with Next/Image
- **Font Optimization**: Automatic font optimization with next/font
- **Minification**: Minified JavaScript and CSS
- **Tree Shaking**: Unused code removal

## 🚢 Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Vercel will automatically detect Next.js and configure deployment
4. Set environment variables in Vercel dashboard
5. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Deploy to Other Platforms

Next.js can be deployed to any platform that supports Node.js:

- **AWS Amplify**
- **Netlify**
- **DigitalOcean App Platform**
- **Railway**
- **Render**

### Using PM2

From the project root:

```bash
# Build all apps
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# View logs
pm2 logs web
```

### Environment Variables

Set these environment variables in your deployment platform:

```env
# API endpoint
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## 🎨 Styling Guide

### Tailwind CSS

This project uses Tailwind CSS 4.x for styling:

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Styled with Tailwind
</div>
```

### GSAP Animations

Use GSAP for smooth animations:

```tsx
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function AnimatedComponent() {
  useGSAP(() => {
    gsap.from('.animate-me', {
      opacity: 0,
      y: 50,
      duration: 1
    })
  }, [])

  return <div className="animate-me">Animated content</div>
}
```

## 🔍 SEO Best Practices

### Metadata

Use Next.js Metadata API for SEO:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Solar Panel Installation',
  description: 'Apply for government solar panel schemes',
}
```

### Open Graph

Add Open Graph tags for social media sharing:

```tsx
export const metadata: Metadata = {
  openGraph: {
    title: 'Solar Panel Platform',
    description: 'Government scheme solar installations',
    images: ['/og-image.jpg'],
  },
}
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [GSAP Documentation](https://greensock.com/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 License

This project is proprietary and confidential.

---

**Part of the Solar Panel Government Scheme Platform**
