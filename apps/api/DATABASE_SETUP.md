# Database Setup Quick Start

## Initial Setup

### 1. Configure Database Connection

Ensure your `.env` file in the root directory has:
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

Example for local PostgreSQL:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/solar_panel_db
```

Example for Neon (serverless):
```env
DATABASE_URL=postgresql://user:pass@region.neon.tech/dbname?sslmode=require
```

### 2. Generate Initial Migration

```bash
cd apps/api
npm run db:generate
```

This creates migration files in `drizzle/` folder based on your schema.

### 3. Run Migrations

```bash
npm run db:migrate
```

Or use the interactive script:

**Windows:**
```cmd
migrate.bat
```

**Linux/Mac:**
```bash
chmod +x migrate.sh
./migrate.sh
```

### 4. Seed Database (Optional)

```bash
npm run db:seed
```

This will create:
- Admin user (admin@example.com / admin123)
- Sample schemes
- Test data

### 5. Verify with Drizzle Studio

```bash
npm run db:studio
```

Visit: http://localhost:4983

---

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate migration from schema changes |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:push` | Push schema directly (dev only) |
| `npm run db:seed` | Populate with test data |
| `npm run db:studio` | Open database GUI |
| `npm run db:reset` | Drop, recreate & seed (⚠️ DANGEROUS) |

---

## Workflow Examples

### Making Schema Changes

1. Edit `src/db/schema.ts`
2. Generate migration:
   ```bash
   npm run db:generate
   ```
3. Review the SQL in `drizzle/` folder
4. Apply migration:
   ```bash
   npm run db:migrate
   ```

### Fresh Start (Development)

```bash
npm run db:reset
```

This will:
1. Drop all tables
2. Push fresh schema
3. Seed with test data

---

## Troubleshooting

### "Connection refused" Error

Check if PostgreSQL is running:
```bash
# Windows
Get-Service postgresql*

# Linux
sudo systemctl status postgresql
```

### "Database does not exist" Error

Create the database:
```sql
CREATE DATABASE solar_panel_db;
```

Or use the connection string to create it automatically (with Neon).

### Migration Conflicts

```bash
# Drop and recreate (development only!)
npm run db:reset
```

---

## Production Deployment

1. **Never run `db:reset` or `db:push` in production**
2. Always use migrations for production:
   ```bash
   npm run db:generate   # In development
   git add drizzle/      # Commit migrations
   npm run db:migrate    # On production server
   ```

3. Backup before migrations:
   ```bash
   pg_dump -U user -d database > backup.sql
   ```

---

## Next Steps

1. ✅ Setup database connection
2. ✅ Run initial migration
3. ✅ Seed test data
4. 🚀 Start the API server: `npm run start:dev`
5. 📚 Check API docs: http://localhost:3001/api/docs

For detailed migration documentation, see [MIGRATIONS.md](./src/db/MIGRATIONS.md)
