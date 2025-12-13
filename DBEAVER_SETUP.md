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

### Step 3: Update Connection
**Edit Connection → Database:**
```
Database: food_ordering
```

### Step 4: Import Schema
**SQL Editor → Open Script → `backend/database/schema.sql`**
**Remove these lines before executing:**
```sql
-- Remove:
CREATE DATABASE IF NOT EXISTS food_ordering CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE food_ordering;
```
**Execute remaining script**

### Step 5: Import Data
**SQL Editor → Open Script → `backend/database/seed.sql`**
**Remove this line before executing:**
```sql
-- Remove:
USE food_ordering;
```
**Execute remaining script**

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

## ✅ Done!
Your database is ready. Test your Node.js application connection.