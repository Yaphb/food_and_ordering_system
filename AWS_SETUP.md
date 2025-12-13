# Complete AWS Deployment Guide
**React.js + Node.js Food Ordering System with RDS + DBeaver**

## 💰 Cost Overview (Under $50 Budget)
- **EC2 t2.micro**: FREE (750 hours/month for 12 months)
- **RDS db.t2.micro**: FREE (750 hours/month for 12 months)  
- **Storage**: ~$2-3/month (20GB RDS + 8GB EC2)
- **Data Transfer**: ~$1-2/month
- **Total**: ~$3-5/month ✅

## 📋 Pre-Deployment Checklist
- [ ] AWS Account created and verified
- [ ] Billing alerts set ($10, $25, $40)
- [ ] DBeaver installed on your local machine
- [ ] Project tested locally
- [ ] Environment files ready

---

## 🗄️ Phase 1: RDS Database Setup (15 minutes)

### Step 1: Create RDS Instance
**AWS Console → RDS → Create Database**
```
Engine: MySQL 8.0.35
Template: Free tier ✓
DB instance identifier: food-ordering-db
Master username: admin
Master password: FoodOrder2024!
DB instance class: db.t2.micro ✓
Storage: 20 GB (free tier limit)
Public access: YES ✓ (CRITICAL for DBeaver access)
Initial database name: [LEAVE EMPTY] ✅
```

**⚠️ Important:** Leave "Initial database name" empty - we'll create it via DBeaver

### Step 2: Configure Security Group
**Create new security group: `food-ordering-rds-sg`**
```
Inbound Rules:
- Type: MySQL/Aurora
- Port: 3306
- Source: 0.0.0.0/0 (for DBeaver access)
- Description: Allow DBeaver and EC2 access
```

### Step 3: Wait for RDS Instance
- **Status must be "Available"** before proceeding
- **Copy the endpoint** when ready: `food-ordering-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com`

### Step 4: DBeaver Database Setup

#### 4.1: Connect to RDS Server
1. **Open DBeaver**
2. **New Database Connection** → **MySQL**
3. **Connection Settings:**
   ```
   Server Host: food-ordering-db.cjmqw882g6hb.us-east-1.rds.amazonaws.com
   Port: 3306
   Database: [LEAVE EMPTY] ✅
   Username: admin
   Password: FoodOrder2024!
   ```
4. **Test Connection** → Should show "Connected" ✅
5. **Finish** to save connection

#### 4.2: Create Database
1. **Right-click connection** → **SQL Editor**
2. **Execute this command:**
   ```sql
   CREATE DATABASE food_ordering CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. **Verify creation:**
   ```sql
   SHOW DATABASES;
   ```
   You should see `food_ordering` in the list

#### 4.3: Update Connection to Use Database
1. **Right-click connection** → **Edit Connection**
2. **Update Database field:**
   ```
   Database: food_ordering ✅
   ```
3. **Test Connection** → Should connect to specific database
4. **Save changes**
5. **Double-click connection** to reconnect with database selected
6. **Verify:** Connection should show `food_ordering` database in the tree

#### 4.4: Import Database Schema
1. **Right-click connection** → **SQL Editor**
2. **Open SQL Script** → Navigate to `backend/database/schema-dbeaver.sql` ✅
3. **Execute entire script** (Ctrl+Enter) - Includes `USE food_ordering;` automatically!
4. **Verify tables created:**
   ```sql
   SHOW TABLES;
   ```
   Should show: `users`, `menu_items`, `orders`, `order_items`

#### 4.5: Import Sample Data
1. **Open new SQL Editor**
2. **Open SQL Script** → Navigate to `backend/database/seed-dbeaver.sql` ✅
3. **Execute entire script** - Includes `USE food_ordering;` automatically!
4. **Verify data imported:**
   ```sql
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM menu_items;
   SELECT * FROM users WHERE role = 'admin';
   ```

**Expected Results:**
- 4 users (1 admin, 1 staff, 2 customers)
- 10+ menu items
- Admin user: admin@gmail.com

---

## 🖥️ Phase 2: EC2 Instance Setup (15 minutes)

### Step 1: Launch EC2 Instance
**AWS Console → EC2 → Launch Instance**
```
Name: food-ordering-server
AMI: Ubuntu Server 22.04 LTS (Free tier)
Instance type: t2.micro ✓
Key pair: Create new → Download .pem file
Security group: Create new (food-ordering-ec2-sg)
Storage: 8 GB gp2 (Free tier)
```

### Step 2: Configure Security Group
**Edit `food-ordering-ec2-sg` inbound rules:**
```
- SSH (22) from My IP
- HTTP (80) from Anywhere
- Custom TCP (3000) from Anywhere - React app
- Custom TCP (5000) from Anywhere - API server
```

### Step 3: Connect to EC2
```bash
# Set key permissions (Git Bash on Windows)
chmod 400 food-ordering-key.pem

# Connect to instance
ssh -i "food-ordering-key.pem" ubuntu@YOUR-EC2-PUBLIC-IP
```

### Step 4: Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs git

# Install global packages
sudo npm install -g pm2 serve

# Verify installations
node --version    # Should show v18.x.x
npm --version     # Should show 9.x.x
pm2 --version     # Should show 5.x.x
```

---

## 🚀 Phase 3: Deploy Application (20 minutes)

### Step 1: Upload Project Files

**Option A: Git Clone (Recommended)**
```bash
git clone https://github.com/yourusername/food_and_ordering_system.git
cd food_and_ordering_system
```

**Option B: SCP Upload**
```bash
# From local Windows machine
scp -i "food-ordering-key.pem" -r ./aws-deploy ubuntu@YOUR-EC2-IP:~/food-ordering-system
```

### Step 2: Configure Backend
```bash
cd food-ordering-system/backend
npm install --production

# Create production environment
nano .env
```

**Copy this into .env (replace with your actual values):**
```env
PORT=5000
NODE_ENV=production
DB_TYPE=mysql

# Replace with your actual RDS endpoint
DB_HOST=food-ordering-db.cjmqw882g6hb.us-east-1.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=FoodOrder2024!
DB_NAME=food_ordering
DB_PORT=3306

# Generate strong JWT secret
JWT_SECRET=your_super_secure_jwt_secret_key_change_this_now_64_chars_minimum

# Replace with your EC2 public IP
FRONTEND_URL=http://44.210.235.221:3000
CORS_ORIGIN=http://44.210.235.221:3000
```

### Step 3: Verify Database Connection
**Your database is now ready! The RDS setup was completed in Phase 1 using DBeaver.**

**Verify your backend can connect:**
1. **Check .env file has correct RDS endpoint**
2. **Test connection:**
   ```bash
   # Create simple connection test
   cat > test-connection.js << 'EOF'
   require('dotenv').config();
   const mysql = require('mysql2/promise');
   
   async function testConnection() {
     try {
       const connection = await mysql.createConnection({
         host: process.env.DB_HOST,
         user: process.env.DB_USER,
         password: process.env.DB_PASSWORD,
         database: process.env.DB_NAME,
         port: process.env.DB_PORT
       });
       console.log('✅ Database connection successful!');
       const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
       console.log('✅ Found', rows[0].count, 'users in database');
       await connection.end();
     } catch (error) {
       console.error('❌ Connection failed:', error.message);
     }
   }
   
   testConnection();
   EOF
   
   node test-connection.js
   ```

### Step 4: Start Backend Service
```bash
# Start with PM2
pm2 start index.js --name food-ordering-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it provides

# Test API endpoint
curl http://localhost:5000/api/menu
```

### Step 5: Deploy Frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Create production environment
echo "REACT_APP_API_URL=http://44.210.235.221:5000" > .env

# Build for production
npm run build

# Start frontend with PM2
pm2 start "serve -s build -l 3000" --name food-ordering-frontend
pm2 save
```

---

## ✅ Phase 4: Verification & Testing (10 minutes)

### Application Access
- **Frontend**: http://44.210.235.221:3000
- **API**: http://44.210.235.221:5000/api/menu
- **Database**: Connected via DBeaver

### Test Login Credentials
```
Admin: admin@gmail.com / 123456
Staff: staff@gmail.com / 123456
Customer: johndoe@gmail.com / 123456
```

### System Status Check
```bash
# Check PM2 services
pm2 status

# View logs
pm2 logs food-ordering-api
pm2 logs food-ordering-frontend

# Check system resources
free -h
df -h
```

---

## 🔒 Phase 5: Security & Monitoring

### 1. Restrict RDS Access (After Testing)
```bash
# Edit RDS security group
# Change source from 0.0.0.0/0 to EC2 security group ID only
```

### 2. Set Billing Alerts
**AWS Console → Billing → Billing Preferences**
- Enable billing alerts
- Create alerts at $10, $25, $40

### 3. Regular Monitoring
```bash
# Daily checks
pm2 status
pm2 monit

# Weekly maintenance
sudo apt update && sudo apt upgrade -y
pm2 restart all
```

---

## 🛠️ Troubleshooting Guide

### Database Issues

**DBeaver Connection Failed:**
1. **Check RDS Status:** AWS Console → RDS → Databases → Ensure "Available"
2. **Security Group:** Verify port 3306 is open to 0.0.0.0/0
3. **Endpoint:** Copy exact endpoint from AWS Console
4. **Credentials:** Username: `admin`, Password: `FoodOrder2024!`

**Application Can't Connect to RDS:**
1. **Check .env file:**
   ```bash
   cat .env  # Verify DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
   ```
2. **Test from EC2:**
   ```bash
   # Test basic connectivity
   telnet food-ordering-db.cjmqw882g6hb.us-east-1.rds.amazonaws.com 3306
   ```
3. **Check Node.js connection:**
   ```bash
   node test-connection.js  # Use the test script from Step 3
   ```

**Database Not Found Error:**
- **Solution:** Recreate database in DBeaver using Phase 1 steps
- **Verify:** Database name is `food_ordering` (with underscore, not hyphen)

### EC2 Issues
```bash
# Connection timeout
# 1. Check security group allows SSH (22)
# 2. Verify key permissions: chmod 400 key.pem
# 3. Check correct public IP

# Application not loading
pm2 status
pm2 logs
pm2 restart all
```

### Cost Issues
```bash
# Monitor usage
# 1. AWS Console → Billing Dashboard
# 2. Ensure using t2.micro instances only
# 3. Check data transfer usage
```

---

## 🔧 DBeaver Setup Guide

### Installation
1. **Download DBeaver Community Edition** from https://dbeaver.io/download/
2. **Install** on your local Windows machine
3. **Launch DBeaver**

### RDS Connection Steps
1. **New Connection** → **MySQL** → **Next**
2. **Server Settings:**
   ```
   Server Host: food-ordering-db.cjmqw882g6hb.us-east-1.rds.amazonaws.com
   Port: 3306
   Database: [Leave empty initially]
   Username: admin
   Password: FoodOrder2024!
   ```
3. **Test Connection** → Should show "Connected"
4. **Finish**

### Database Creation Workflow
1. **Connect to RDS server** (without database name)
2. **Create database:** `CREATE DATABASE food_ordering;`
3. **Edit connection** → Add database name: `food_ordering`
4. **Reconnect** to specific database
5. **Import schema** from `backend/database/schema.sql`
6. **Import data** from `backend/database/seed.sql`

### Common DBeaver Issues
- **Connection timeout:** Check AWS security group allows port 3306
- **Access denied:** Verify username/password are correct
- **Unknown database:** Create database first, then reconnect
- **SQL errors:** Remove `CREATE DATABASE` and `USE` statements from imported files

---

## 🧹 Cleanup Instructions

### When Done Testing
```bash
# Stop PM2 services
pm2 delete all

# AWS Console cleanup:
# 1. Terminate EC2 instance
# 2. Delete RDS database
# 3. Delete security groups
# 4. Delete key pairs
# 5. Delete any snapshots
```

---

## 📚 Available Scripts

### Backend Scripts
```bash
npm start            # Start production server
npm run dev          # Start development server
```

### Database Management
**All database operations done via DBeaver:**
- **Schema changes:** Use `backend/database/schema-dbeaver.sql` in DBeaver
- **Data updates:** Use `backend/database/seed-dbeaver.sql` in DBeaver
- **Queries:** Use DBeaver SQL Editor for all database operations

### Deployment Scripts
```bash
deploy-aws.bat       # Windows deployment helper
```

---

## 🎯 Quick Reference

### Environment Files
- **Frontend**: `frontend/.env.production` → Copy as `.env`
- **Backend**: `backend/.env.production` → Copy as `.env`

### Key Information
- **RDS Endpoint**: Replace `xxxxxxxxxx` with your actual endpoint
- **EC2 IP**: Currently set to `44.210.235.221`
- **Default Password**: `123456` for all test accounts

### Database Files
- **Schema**: `backend/database/schema-dbeaver.sql` (ready for DBeaver import)
- **Sample Data**: `backend/database/seed-dbeaver.sql` (ready for DBeaver import)
- **Database Name**: `food_ordering` (create in DBeaver)
- **Connection Test**: `npm run test-rds`

### Support Files
- **Database Naming**: `DATABASE_NAMING_GUIDE.md`
- **GitHub Integration**: `github-to-aws.md`
- **Deployment Helper**: `deploy-aws.bat`

## 🎯 DBeaver-First Approach
This guide prioritizes DBeaver for all database operations:
- ✅ **Visual interface** for database management
- ✅ **No command line** MySQL knowledge required  
- ✅ **Cross-platform** compatibility
- ✅ **Error handling** with clear messages
- ✅ **File import** capabilities for schema and data

**Setup time:** ~1 hour | **Monthly cost:** ~$3-5 | **Database tool:** DBeaver only
