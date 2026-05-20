# Database Deployment Guide - Railway MySQL

## Overview

You have two options:

1. **Option A (Recommended)**: Use Railway's MySQL Plugin
   - Automatically provisions MySQL database
   - Handles backups and security
   - Auto-generates connection credentials
   - Easiest integration with Railway

2. **Option B**: External MySQL Server
   - Use your own managed database (AWS RDS, DigitalOcean, etc.)
   - More control but more setup

This guide covers **Option A: Railway MySQL Plugin**.

## Step 1: Export Your Local Database Schema & Data

### On Windows (using MySQL command line)

First, backup your local database to a SQL file:

```bash
# Export entire database with schema and data
mysqldump -u root -p capstter > capstter_backup.sql

# Or just schema (without data) - useful for first import
mysqldump -u root -p --no-data capstter > capstter_schema.sql

# When prompted, enter your MySQL password (likely empty in your case)
```

If you don't have `mysqldump` in your PATH:

```bash
# Find MySQL installation path
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump" -u root -p capstter > capstter_backup.sql
```

This creates `capstter_backup.sql` in your current directory.

### Using MySQL Workbench (GUI)

1. Right-click database "capstter"
2. Select "Export Dump..."
3. Choose:
   - Include Table Data: ✓ (Yes)
   - Include DDL (schema): ✓ (Yes)
4. Save as `capstter_backup.sql`

## Step 2: Create Railway MySQL Plugin

### In Railway Dashboard

1. Go to https://railway.app
2. Select your project (or create one)
3. Click "+ New" → "Add Database" → "MySQL"
4. Railway will automatically:
   - Provision MySQL instance
   - Generate credentials
   - Set environment variables

You should now see:
- `MYSQLPASSWORD` - Database password
- `MYSQLHOST` - Database host
- `MYSQLDATABASE` - Database name
- `MYSQLUSER` - Database user
- `MYSQLPORT` - Database port (usually 3306)

## Step 3: Map Environment Variables to Your Backend

Railway creates `MYSQL*` variables, but your backend expects `DB_*` variables.

Add these to your backend Railway service environment:

```
DB_HOST=${{MYSQLHOST}}
DB_PORT=${{MYSQLPORT}}
DB_NAME=${{MYSQLDATABASE}}
DB_USER=${{MYSQLUSER}}
DB_PASSWORD=${{MYSQLPASSWORD}}
```

**Note**: The `${{}}` syntax lets Railway interpolate the MySQL plugin variables.

## Step 4: Connect to Railway MySQL Remotely

To import your data, you need to connect to Railway MySQL from your local machine.

### Option A: Using Railway CLI (Easiest)

```bash
# Install Railway CLI if you haven't
npm install -g @railway/cli

# Connect to your database
railway connect --service mysql

# You'll get an interactive MySQL prompt
# Now paste your SQL file contents or use SOURCE command
```

### Option B: Using MySQL Client Directly

From Railway Dashboard:
1. Select MySQL service
2. Click "Connect" tab
3. Copy the connection string that looks like:
   ```
   mysql -h xxx.railway.app -P 3306 -u root -p
   ```

Then:

```bash
# Import from SQL file
mysql -h [HOST] -P 3306 -u [USER] -p [PASSWORD] [DATABASE] < capstter_backup.sql

# Example:
mysql -h abc123.railway.app -P 3306 -u root -p mypassword capstter < capstter_backup.sql
```

### Option C: Using MySQL Workbench (GUI)

1. Create new connection with Railway credentials:
   - Hostname: `[MYSQLHOST]`
   - Port: `[MYSQLPORT]`
   - Username: `[MYSQLUSER]`
   - Password: `[MYSQLPASSWORD]`
   - Default Schema: `[MYSQLDATABASE]`

2. Test connection
3. File → Import SQL Script
4. Select `capstter_backup.sql`
5. Execute

## Step 5: Verify Database Setup

Connect and verify:

```bash
# List tables
SHOW TABLES;

# Check users table
SELECT COUNT(*) FROM user_table;

# Check if data imported correctly
SELECT * FROM user_table LIMIT 1;
```

## Step 6: Update Backend Environment

Your backend `DEPLOYMENT.md` already mentions using Railway MySQL. Make sure in Railway Dashboard:

**Backend Service → Variables**:

```
DB_HOST=${{MYSQLHOST}}
DB_PORT=${{MYSQLPORT}}
DB_NAME=${{MYSQLDATABASE}}
DB_USER=${{MYSQLUSER}}
DB_PASSWORD=${{MYSQLPASSWORD}}
PORT=5000
FRONTEND_URL=https://your-vercel-app.com
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ALLOWED_ORIGINS=https://your-vercel-app.com
FORECAST_SERVICE_URL=https://your-forecast-service.railway.app
```

## Deployment Sequence

### 1️⃣ Set up Database First

```
Railway Dashboard → New Project → Add MySQL Plugin
↓
Note the credentials
↓
Import your SQL backup
```

### 2️⃣ Deploy Backend

```
Railway → Deploy Backend Service from GitHub
↓
Set environment variables (with DB_ mappings above)
↓
Backend connects to Railway MySQL
```

### 3️⃣ Deploy Forecast Service

```
Railway → Deploy Forecast Service from GitHub
↓
Set ALLOWED_ORIGINS
↓
Complete
```

### 4️⃣ Deploy Frontend

```
Vercel → Deploy from GitHub
↓
Set VITE_API_URL=https://your-backend-railway.app/api
↓
Complete
```

## Troubleshooting

### Connection Refused

**Error**: `connect ECONNREFUSED` or `ETIMEDOUT`

**Solutions**:
1. Verify Railway MySQL service is running (check Logs in Dashboard)
2. Ensure you're using the correct host from Railway (not localhost!)
3. Check that IP/host is whitelisted (Railway allows all by default)
4. Verify backend can reach Railway MySQL (check backend logs)

### Tables Don't Exist

**Error**: `Table 'capstter.user_table' doesn't exist`

**Solutions**:
1. Verify import completed successfully
2. Check that you used the correct database name
3. Re-import the backup:
   ```bash
   railway connect --service mysql
   SOURCE /path/to/capstter_backup.sql;
   ```

### Data Didn't Import

**Verify**:
```bash
# Check database size
SELECT SUM(data_length + index_length) / 1024 / 1024 AS size_mb 
FROM information_schema.tables 
WHERE table_schema = 'capstter';

# Check table counts
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'capstter';
```

## Backup Strategy

### Regular Backups

On Railway Dashboard → MySQL Service → Settings:
- Backups are automatically enabled
- View backup history and restore options

### Manual Backups

Before major changes:

```bash
# Local backup
mysqldump -u [USER] -p [PASSWORD] -h [HOST] -P [PORT] [DATABASE] > backup_$(date +%Y%m%d).sql
```

## Database Size & Performance

### Check Usage

Railway Dashboard → MySQL Service → Metrics:
- View CPU, Memory, Network usage
- Monitor query performance

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Slow queries | Add indexes on frequently searched columns |
| Connection limit exceeded | Increase max_connections in Railway settings |
| Disk space full | Archive old data or upgrade plan |

## Production Checklist

- ✅ Export local database
- ✅ Create Railway MySQL plugin
- ✅ Import data successfully
- ✅ Verify all tables present
- ✅ Test backend connection
- ✅ Set up environment variables
- ✅ Deploy backend service
- ✅ Monitor logs for errors
- ✅ Verify data integrity in production

## Advanced: Database Initialization Script

If you need to recreate the schema without data:

Create `database_init.sql`:

```sql
-- This would contain your CREATE TABLE statements
-- Extract from your local backup with:
-- mysqldump -u root -p --no-data capstter > database_init.sql

-- Then run on Railway:
-- SOURCE database_init.sql;
```

## Next Steps

1. **Export**: Run `mysqldump` command above
2. **Create Plugin**: Add MySQL to Railway project
3. **Import**: Connect and import SQL file
4. **Verify**: Check tables and data
5. **Deploy Backend**: Update env variables
6. **Test**: Make API calls to verify connection

Your database is now production-ready on Railway! 🚀
