# Database Setup Summary

## 📁 Database Files (Only 2!)

```
backend/database/
├── 1-schema.sql      ← Import this FIRST (creates tables)
└── 2-sample-data.sql ← Import this SECOND (adds sample data)
```

## 🗄️ Database Structure

### Tables Created:
1. **users** - User accounts (admin, staff, customers)
2. **menu_items** - Food items with prices and categories  
3. **orders** - Customer orders with status tracking
4. **order_items** - Individual items within each order

### Sample Data Included:
- **4 Users**: 1 admin, 1 staff, 2 customers
- **15 Menu Items**: Appetizers, mains, desserts, beverages
- **Login**: All accounts use password `123456`

## 🎯 DBeaver Setup (2 Steps)

### Step 1: Connect to RDS
```
Host: food-ordering-db.cjmqw882g6hb.us-east-1.rds.amazonaws.com
Port: 3306
Database: [empty first, then food_ordering]
Username: admin
Password: FoodOrder2024!
```

### Step 2: Import Files
1. **Create database**: `CREATE DATABASE food_ordering;`
2. **Update connection** with database name
3. **Import schema**: `1-schema.sql`
4. **Import data**: `2-sample-data.sql`

## ✅ Test Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@gmail.com | 123456 | Admin |
| staff@gmail.com | 123456 | Staff |
| johndoe@gmail.com | 123456 | Customer |
| janesmith@gmail.com | 123456 | Customer |

## 🔧 Connection Test

```bash
cd backend
npm run test-rds
```

That's it! Simple and clean.