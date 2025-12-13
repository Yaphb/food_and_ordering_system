# Complete AWS Deployment Guide
**React.js + Node.js Food Ordering System**

## 💰 Cost Overview (Under $50 Budget)
- **EC2 t2.micro**: FREE (750 hours/month for 12 months)
- **RDS db.t2.micro**: FREE (750 hours/month for 12 months)  
- **Storage**: ~$2-3/month (20GB RDS + 8GB EC2)
- **Data Transfer**: ~$1-2/month
- **Total**: ~$3-5/month ✅

## 📋 Pre-Deployment Checklist
- [ ] AWS Account created and verified
- [ ] Billing alerts set ($10, $25, $40)
- [ ] Project tested locally
- [ ] Environment files ready

---

## 🗄️ Phase 1: RDS Database Setup (10 minutes)

### Step 1: Create RDS Instance
**AWS Console → RDS → Create Database**
```
Engine: MySQL 8.0.35
Template: Free tier ✓
DB instance identifier: food-ordering-db
Master username: admin
Master password: FoodOrder2024!SecurePass
DB instance class: db.t2.micro ✓
Storage: 20 GB (free tier limit)
Public access: YES ✓ (for DBeaver)
Initial database name: food_ordering
```

### Step 2: Configure Security Group
**Create new security group: `food-ordering-rds-sg`**
```
Inbound Rules:
- Type: MySQL/Aurora
- Port: 3306
- Source: 0.0.0.0/0 (for initial setup)
```

### Step 3: Save RDS Information
```
Endpoint: food-ordering-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com
Port: 3306
Username: admin
Password: FoodOrder2024!
Database: food_ordering
```

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
DB_HOST=food-ordering-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=FoodOrder2024!SecurePass
DB_NAME=food_ordering
DB_PORT=3306

# Generate strong JWT secret
JWT_SECRET=your_super_secure_jwt_secret_key_change_this_now_64_chars_minimum

# Replace with your EC2 public IP
FRONTEND_URL=http://44.210.235.221:3000
CORS_ORIGIN=http://44.210.235.221:3000
```

### Step 3: Setup Database (Choose Method)

**🎯 Method A: DBeaver (Recommended)**
1. **Connect DBeaver to RDS:**
   - Host: `food-ordering-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com`
   - Port: `3306`
   - Database: `food_ordering`
   - Username: `admin`
   - Password: `FoodOrder2024!`

2. **Import Schema:**
   - Right-click database → SQL Editor → Open SQL Script
   - Navigate to `backend/database/schema.sql`
   - Execute (Ctrl+Enter)

3. **Import Sample Data:**
   - Open new SQL Editor
   - Load `backend/database/seed.sql`
   - Execute script

**🔧 Method B: Node.js Scripts**
```bash
# Setup tables
npm run setup-rds

# Add sample data
npm run seed-rds

# Verify setup
npm run check-rds
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
```bash
# Can't connect to RDS
# 1. Check security group allows port 3306
# 2. Verify endpoint and credentials
# 3. Test: telnet your-rds-endpoint 3306

# Database connection errors
mysql -h your-rds-endpoint -u admin -p
cat .env  # Check environment variables
```

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
npm run setup-rds    # Create RDS tables
npm run seed-rds     # Add sample data
npm run check-rds    # Verify database
npm run start        # Start production server
```

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

### Support Files
- **Complete Setup**: `AWS_COMPLETE_SETUP.md`
- **DBeaver Guide**: `RDS_DBEAVER_SETUP.md`
- **GitHub Integration**: `github-to-aws.md`

This setup will have your application running on AWS within 1 hour and cost less than $5/month!
