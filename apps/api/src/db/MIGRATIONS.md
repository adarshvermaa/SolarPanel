# Database Migration Scripts

This directory contains database migration scripts for the Solar Panel API.

## Available Commands

### Generate Migrations
Generate migration files from schema changes:
```bash
npm run db:generate
```

This will create SQL migration files in the `drizzle` folder based on changes in `src/db/schema.ts`.

### Run Migrations
Apply all pending migrations to the database:
```bash
npm run db:migrate
```

Or use the custom migration script:
```bash
npm run db:migrate:up
```

### Push Schema to Database
Push schema changes directly to the database without creating migration files (useful for development):
```bash
npm run db:push
```

**⚠️ Warning:** This command bypasses migration history and should only be used in development.

### Check Migration Status
Check which migrations have been applied:
```bash
npm run db:migrate:status
```

### Drop Tables
Drop all tables from the database:
```bash
npm run db:drop
```

**⚠️ Warning:** This will delete all data. Only use in development/testing.

### Seed Database
Populate the database with initial/test data:
```bash
npm run db:seed
```

### Reset Database
Drop all tables, push fresh schema, and seed data (complete reset):
```bash
npm run db:reset
```

**⚠️ Warning:** This will delete all data and start fresh.

### Drizzle Studio
Open Drizzle Studio to visually browse and edit your database:
```bash
npm run db:studio
```

Access the studio at: http://localhost:4983

## Migration Workflow

### Development Workflow
1. **Make schema changes** in `src/db/schema.ts`
2. **Generate migration**: `npm run db:generate`
3. **Review migration** in `drizzle/` folder
4. **Apply migration**: `npm run db:migrate`

### Quick Development (No Migration History)
```bash
npm run db:push
```

### Production Workflow
1. **Generate migrations** in development
2. **Commit migration files** to version control
3. **Run migrations** on production: `npm run db:migrate`

## Environment Variables

Ensure your `.env` file has the following:
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

## Migration Files

Migration files are stored in the `drizzle/` directory:
```
drizzle/
├── 0000_initial_schema.sql
├── 0001_add_user_roles.sql
└── meta/
    └── _journal.json
```

## Best Practices

1. **Always review generated migrations** before applying them
2. **Test migrations** in a development environment first
3. **Keep migrations small and focused** on specific changes
4. **Never modify applied migrations** - create new ones instead
5. **Backup production data** before running migrations
6. **Use descriptive names** for migration files

## Troubleshooting

### Migration Failed
If a migration fails:
1. Check the error message
2. Fix the schema or SQL
3. Drop the failed migration
4. Generate a new migration
5. Try again

### Reset Development Database
```bash
npm run db:reset
```

### Connection Issues
Verify your `DATABASE_URL` is correct:
```bash
echo $DATABASE_URL  # Linux/Mac
echo %DATABASE_URL%  # Windows CMD
$env:DATABASE_URL    # Windows PowerShell
```
