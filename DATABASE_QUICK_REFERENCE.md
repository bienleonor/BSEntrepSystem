# Database Deployment Quick Reference

## 🚀 Quick Setup (5 Steps)

### Step 1: Export Your Database
```bash
# Windows - double-click:
export_database.bat

# Mac/Linux - run:
bash export_database.sh
```

Creates: `capstter_backup_YYYYMMDD_HHMMSS.sql`

### Step 2: Create Railway MySQL Plugin
- Railway Dashboard → Project → "+ New" → "Add Database" → "MySQL"
- Wait for provisioning
- Note the credentials

### Step 3: Connect to Railway MySQL

**Using Railway CLI (easiest):**
```bash
railway connect --service mysql
```

**Or using MySQL client:**
```bash
# Get credentials from Railway Dashboard, then:
mysql -h [HOST] -P [PORT] -u [USER] -p [PASSWORD] [DATABASE]
```

### Step 4: Import Database

**In Railway MySQL connection:**
```sql
SOURCE /path/to/capstter_backup_YYYYMMDD_HHMMSS.sql;
```

Or use command line:
```bash
mysql -h [HOST] -P [PORT] -u [USER] -p [PASSWORD] [DATABASE] < capstter_backup_YYYYMMDD_HHMMSS.sql
```

### Step 5: Configure Backend

In Railway Backend Service → Variables:

```
DB_HOST=${{MYSQLHOST}}
DB_PORT=${{MYSQLPORT}}
DB_NAME=${{MYSQLDATABASE}}
DB_USER=${{MYSQLUSER}}
DB_PASSWORD=${{MYSQLPASSWORD}}
```

✅ **Done!** Backend now connects to Railway MySQL.

---

## Environment Variable Mapping

Railway MySQL Plugin variables → Your Backend variables:

| Railway | Your Backend |
|---------|--------------|
| `MYSQLHOST` | `DB_HOST` |
| `MYSQLPORT` | `DB_PORT` |
| `MYSQLDATABASE` | `DB_NAME` |
| `MYSQLUSER` | `DB_USER` |
| `MYSQLPASSWORD` | `DB_PASSWORD` |

Use syntax: `${{MYSQLHOST}}` to interpolate.

---

## Verify Connection

In backend logs, you should see:
```
Server running on port 5000
```

No database errors = Success! ✅

---

## Troubleshooting

### Connection timeout
- Verify Railway MySQL is running (check Logs)
- Use correct host (from Railway, not localhost!)

### Tables not found
- Check import completed: `SHOW TABLES;`
- Re-import if needed

### Password wrong
- Get fresh credentials from Railway → MySQL → Connect tab
- Update variables in Railway → Backend → Variables

---

## Full Details

See `DATABASE_DEPLOYMENT.md` for complete guide.
