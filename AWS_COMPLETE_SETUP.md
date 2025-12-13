# Complete AWS Setup Guide - Step by Step

## Pre-Deployment Checklist

### 1. AWS Account Setup
- [ ] AWS Account created and verified
- [ ] Billing alerts set up ($10, $25, $40)
- [ ] IAM user created (optional, can use root for simple setup)

### 2. Local Preparation
- [ ] Project tested locally
- [ ] Environment files configured
- [ ] Build process verified

## Phase 1: RDS Database Setup (10 minutes)

### Step 1: Create RDS Instance
1. **AWS Console → RDS → Create Database**
   ```
   Engine: MySQL
   Version: 8.0.35
   Template: Free tier ✓
   
   Settings:
   - DB instance identifier: food-ordering-db
   - Master username: admin
   - Master password: FoodOrder2024!SecurePass
   
   Instance configuration:
   - DB instance class: db.t2.micro ✓
   - Storage type: General Purpose SSD
   - Allocated storage: 20 GB
   
   Connectivity:
   - Public access: Yes ✓
   - VPC security group: Create new
   - Initial database name: food_ordering
   ```

2. **Configure Security Group**
   - Name: `food-ordering-rds-sg`
   - Description: `Security group for Food Ordering RDS`
   - Inbound rules:
     ```
     Type: MySQL/Aurora
     Port: 3306
     Source: Anywhere (0.0.0.0/0) - for initial setup
     ```

3. **Save RDS Information**
   ```
   Endpoint: food-ordering-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com
   Port: 3306
   Username: admin
   Password: FoodOrder2024!SecurePass
   Database: food_ordering
   ```

### Step 2: Test RDS Connection
```bash
# Install MySQL client locally (if not installed)
# Windows: Download MySQL Workbench or use XAMPP
# Test connection with saved endpoint
```

## Phase 2: EC2 Instance Setup (15 minutes)

### Step 1: Launch EC2 Instance
1. **AWS Console → EC2 → Launch Instance**
   ```
   Name: food-ordering-server
   
   Application and OS Images:
   - Ubuntu Server 22.04 LTS (Free tier eligible)
   
   Instance type:
   - t2.micro ✓
   
   Key pair:
   - Create new key pair
   - Name: food-ordering-key
   - Type: RSA
   - Format: .pem
   - Download and save securely
   
   Network settings:
   - Create security group
   - Name: food-ordering-ec2-sg
   - Allow SSH traffic from: My IP
   - Allow HTTP traffic from: Internet
   - Allow HTTPS traffic from: Internet
   
   Configure storage:
   - 8 GB gp2 (Free tier)
   ```

2. **Add Custom Security Group Rules**
   After launch, edit security group:
   ```
   Inbound rules:
   - SSH (22) from My IP
   - HTTP (80) from Anywhere
   - Custom TCP (3000) from Anywhere - React app
   - Custom TCP (5000) from Anywhere - API server
   ```

3. **Save EC2 Information**
   ```
   Instance ID: i-xxxxxxxxxxxxxxxxx
   Public IP: 54.xxx.xxx.xxx
   Private IP: 172.31.xxx.xxx
   Key file: food-ordering-key.pem
   ```

### Step 2: Connect to EC2
```bash
# Set key permissions (Git Bash on Windows)
chmod 400 food-ordering-key.pem

# Connect to instance
ssh -i "food-ordering-key.pem" ubuntu@54.xxx.xxx.xxx
```

### Step 3: Install Dependencies on EC2
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install additional tools
sudo apt install -y mysql-client git unzip

# Install global npm packages
sudo npm install -g pm2 serve

# Verify installations
node --version    # Should show v18.x.x
npm --version     # Should show 9.x.x
pm2 --version     # Should show 5.x.x
```

## Phase 3: Deploy Application (20 minutes)

### Step 1: Upload Project Files

**Option A: Git Clone (if public repo)**
```bash
git clone https://github.com/yourusername/food_and_ordering_system.git
cd food_and_ordering_system
```

**Option B: SCP Upload (from local Windows)**
```cmd
# Create deployment package first
deploy-aws.bat
# Choose option 2

# Upload to EC2
scp -i "food-ordering-key.pem" -r aws-deploy ubuntu@54.xxx.xxx.xxx:~/food-ordering-system
```

### Step 2: Configure Backend
```bash
cd food-ordering-system/backend

# Install dependencies
npm install --production

# Create production environment file
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

# Generate new JWT secret
JWT_SECRET=your_super_secure_jwt_secret_key_change_this_now_64_chars_minimum

# Replace with your EC2 public IP
FRONTEND_URL=http://54.xxx.xxx.xxx:3000
CORS_ORIGIN=http://54.xxx.xxx.xxx:3000
```

### Step 3: Setup Database Schema
```bash
# Import database schema
mysql -h food-ordering-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com -u admin -p food_ordering < database/schema.sql

# Import seed data
mysql -h food-ordering-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com -u admin -p food_ordering < database/seed.sql

# Test database connection
node scripts/checkMySQL.js
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
# Go to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create production environment
echo "REACT_APP_API_URL=http://54.xxx.xxx.xxx:5000" > .env

# Build for production
npm run build

# Start frontend with PM2
pm2 start "serve -s build -l 3000" --name food-ordering-frontend

# Save configuration
pm2 save
```

## Phase 4: Configure DBeaver (5 minutes)

### DBeaver Connection Setup
1. **New Database Connection**
   ```
   Database: MySQL
   Server Host: food-ordering-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com
   Port: 3306
   Database: food_ordering
   Username: admin
   Password: FoodOrder2024!SecurePass
   ```

2. **Test Connection**
   - Click "Test Connection"
   - Should connect successfully
   - You'll see tables: users, menu_items, orders

## Phase 5: Verification & Testing (10 minutes)

### Application Access
- **Frontend**: http://54.xxx.xxx.xxx:3000
- **API**: http://54.xxx.xxx.xxx:5000/api/menu
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

## Phase 6: Security Hardening (Optional)

### 1. Restrict RDS Access
```bash
# Edit RDS security group
# Change source from 0.0.0.0/0 to EC2 security group ID
```

### 2. Setup SSL Certificate (Optional)
```bash
# Install Nginx
sudo apt install -y nginx

# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Configure domain (if you have one)
sudo nano /etc/nginx/sites-available/food-ordering
```

### 3. Enable Firewall
```bash
# Configure UFW
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw allow 5000
sudo ufw --force enable
```

## Monitoring & Maintenance

### Daily Checks
```bash
# System status
pm2 status
pm2 monit

# System resources
htop
df -h

# Application logs
pm2 logs --lines 50
```

### Weekly Maintenance
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Restart services if needed
pm2 restart all

# Check AWS billing
# AWS Console → Billing Dashboard
```

## Troubleshooting Guide

### Common Issues

**1. Can't connect to RDS**
```bash
# Check security group allows port 3306
# Verify endpoint and credentials
# Test with: telnet your-rds-endpoint 3306
```

**2. EC2 connection timeout**
```bash
# Check security group allows SSH (port 22)
# Verify key file permissions: chmod 400 key.pem
# Check if using correct public IP
```

**3. Application not loading**
```bash
# Check PM2 status
pm2 status

# View error logs
pm2 logs

# Restart services
pm2 restart all
```

**4. Database connection errors**
```bash
# Test MySQL connection
mysql -h your-rds-endpoint -u admin -p

# Check environment variables
cat .env

# Verify database exists
mysql -h your-rds-endpoint -u admin -p -e "SHOW DATABASES;"
```

## Cost Monitoring

### Set Billing Alerts
1. **AWS Console → Billing → Billing Preferences**
2. **Enable billing alerts**
3. **Create alerts at $10, $25, $40**

### Monthly Cost Estimate
```
EC2 t2.micro: $0 (Free tier - 750 hours)
RDS db.t2.micro: $0 (Free tier - 750 hours)
EBS Storage: ~$2-3
Data Transfer: ~$1-2
Total: ~$3-5/month
```

## Cleanup Instructions

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

This complete setup should have your application running on AWS within 1 hour and cost less than $5/month!