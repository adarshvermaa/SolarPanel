# Deployment Scripts

This directory contains PowerShell scripts for building, developing, and deploying the Solar Panel Platform.

## Available Scripts

### 🔨 build.ps1

Builds the entire monorepo for production.

**Usage:**
```powershell
.\script\build.ps1
```

**What it does:**
- Runs `npm run build` at the root level
- Uses Turborepo to build all apps in parallel
- Creates optimized production builds for:
  - Backend API (`apps/api`)
  - Frontend Web (`apps/web`)

**Output:**
- API build: `apps/api/dist/`
- Web build: `apps/web/.next/`

---

### 🚀 dev.ps1

Starts all development servers concurrently.

**Usage:**
```powershell
.\script\dev.ps1
```

**What it does:**
- Runs `npm run dev` at the root level
- Uses Turborepo to start all apps in watch mode
- Starts development servers for:
  - Backend API: `http://localhost:3001`
  - Frontend Web: `http://localhost:3000`

**Features:**
- Hot reload on file changes
- Parallel execution with Turborepo
- Persistent processes

---

### 📦 deploy.ps1

Deploys the application using PM2 process manager.

**Usage:**
```powershell
.\script\deploy.ps1
```

**What it does:**
1. Builds the entire project (`npm run build`)
2. Starts applications with PM2 using `ecosystem.config.js`
3. Manages processes for production deployment

**PM2 Configuration:**
The script uses the root-level `ecosystem.config.js` which defines:
- API process configuration
- Web process configuration
- Environment variables
- Log file locations
- Restart policies

**After Deployment:**
```powershell
# View running processes
pm2 list

# View logs
pm2 logs

# Restart all
pm2 restart all

# Stop all
pm2 stop all

# Delete all processes
pm2 delete all
```

---

## Prerequisites

### Required Software

1. **Node.js**: v20.x or higher
2. **npm**: v11.x or higher
3. **PowerShell**: 5.1 or higher
4. **PM2** (for deploy.ps1):
   ```powershell
   npm install -g pm2
   ```

### PowerShell Execution Policy

If you encounter execution policy errors, run:

```powershell
# For current user only (recommended)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# OR for all users (requires admin)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
```

---

## Environment Setup

Before running any scripts, ensure you have:

1. **Dependencies installed:**
   ```powershell
   npm install
   ```

2. **Environment variables configured:**
   - Create `.env` file in the project root
   - Copy from `.env.example` and fill in values
   - Required variables:
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `JWT_REFRESH_SECRET`
     - AWS credentials (if using S3)
     - Notification service tokens (if using)

---

## Usage Examples

### Development Workflow

```powershell
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 3. Start development servers
.\script\dev.ps1
```

### Production Deployment

```powershell
# 1. Build for production
.\script\build.ps1

# 2. Deploy with PM2
.\script\deploy.ps1

# 3. Check status
pm2 status

# 4. Monitor logs
pm2 logs
```

### Updating Deployment

```powershell
# Pull latest changes
git pull

# Install new dependencies
npm install

# Rebuild and restart
.\script\build.ps1
pm2 restart all
```

---

## Script Locations

All scripts are located in the `script/` directory at the project root:

```
SolarPanel/
├── script/
│   ├── build.ps1    # Production build
│   ├── dev.ps1      # Development servers
│   └── deploy.ps1   # PM2 deployment
└── ecosystem.config.js  # PM2 configuration
```

---

## Troubleshooting

### Script Won't Run

**Error:** "Cannot be loaded because running scripts is disabled"

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Build Fails

1. Check Node.js version: `node --version`
2. Clear cache and reinstall:
   ```powershell
   rm -r node_modules
   npm install
   ```

### PM2 Not Found

**Solution:**
```powershell
npm install -g pm2
```

### Port Already in Use

Check which process is using the port:
```powershell
# Check port 3000
netstat -ano | findstr :3000

# Kill process by PID
taskkill /PID <PID> /F
```

---

## CI/CD Integration

These scripts can be integrated into CI/CD pipelines:

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: .\script\build.ps1
      - run: .\script\deploy.ps1
```

---

## Advanced Usage

### Custom Build

To build only specific apps:

```powershell
# Build API only
cd apps/api
npm run build

# Build Web only
cd apps/web
npm run build
```

### PM2 Advanced Commands

```powershell
# Scale applications
pm2 scale api 4

# Monitor resources
pm2 monit

# Save PM2 process list
pm2 save

# Auto-restart on system boot
pm2 startup
```

---

## Security Notes

1. **Never commit `.env` files** - Use `.env.example` as a template
2. **Use strong secrets** - Generate secure JWT secrets
3. **Limit PM2 access** - Only run PM2 commands as necessary user
4. **Review logs regularly** - Monitor `pm2 logs` for suspicious activity

---

## Related Documentation

- [Root README](../README.md) - Project overview
- [API README](../apps/api/README.md) - Backend documentation
- [Web README](../apps/web/README.md) - Frontend documentation
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Turborepo Documentation](https://turbo.build/repo/docs)

---

**Part of the Solar Panel Government Scheme Platform**
