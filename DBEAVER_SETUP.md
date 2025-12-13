# DBeaver Setup for RDS food-ordering-db

## 🎯 Quick Setup (5 minutes)

### Step 1: DBeaver Connection
**Connection Settings:**
```
Connection Name: Food Ordering RDS
Server Host: food-ordering-db.cjmqw882g6hb.us-east-1.rds.amazonaws.com
Port: 3306
Database: [LEAVE EMPTY]
Username: admin
Password: FoodOrder2024!
```

### Step 2: Create Database
**SQL Editor → Execute:**
```sql
CREATE DATABASE food_ordering CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
```

### Step 3: Update Connection & Reconnect
1. **Right-click connection** → **Edit Connection**
2. **Update Database field:**
   ```
   Database: food_ordering
   ```
3. **Test Connection** → Should show "Connected"
4. **Save & Close**
5. **Double-click connection** to reconnect with database selected

### Step 4: Import Schema
**IMPORTANT:** Make sure you see `food_ordering` database in the connection tree first!

1. **SQL Editor → Open Script → `backend/database/schema-simple.sql`** ✅
2. **Execute entire script** (Ctrl+Enter)
3. **Should see:** "Schema created successfully!" message

### Step 5: Import Data (Choose One)

**Option A: Fresh Setup (Recommended for first time)**
1. **SQL Editor → Open Script → `backend/database/seed-fresh.sql`** ✅
2. **Execute entire script** (Ctrl+Enter)
3. **Should see:** "Fresh sample data imported successfully!" message

**Option B: Reset Existing Data**
1. **SQL Editor → Open Script → `backend/database/seed-simple.sql`** ✅
2. **Execute entire script** (Ctrl+Enter) - Clears existing data first
3. **Should see:** "Sample data imported successfully!" message

### Step 6: Verify
```sql
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM menu_items;
SELECT email, role FROM users;
```

**Expected Results:**
- 4 tables: users, menu_items, orders, order_items
- 4 users, 10+ menu items
- Admin: admin@gmail.com

## 🔧 Troubleshooting Common Errors

**SQL Error [1046] "No database selected":**
1. **Check Connection Tree:** You should see `food_ordering` database expanded in the left panel
2. **Reconnect:** Right-click connection → **Disconnect** → **Connect**
3. **Verify Database:** In SQL Editor, run: `SELECT DATABASE();`
4. **Manual Selection:** If needed, run: `USE food_ordering;` before importing

**SQL Error [1701] "Cannot truncate table with foreign key":**
1. **Use fresh setup:** Import `seed-fresh.sql` instead of `seed-simple.sql`
2. **Or clear manually:** Run `DELETE FROM table_name;` instead of `TRUNCATE`

**SQL Error [1064] "SQL syntax error":**
1. **Execute line by line:** Select individual INSERT statements and execute them one by one
2. **Check encoding:** Make sure file is saved as UTF-8
3. **Use fresh setup:** Try `seed-fresh.sql` which has simpler INSERT statements

**Alternative Method:**
1. **Right-click `food_ordering` database** in tree → **SQL Editor**
2. This ensures you're connected to the correct database
3. Then import the schema and seed files

## ✅ Done!
Your database is ready. Test your Node.js application connection.