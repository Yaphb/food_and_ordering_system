# AWS Budget-Friendly Setup ($50 Maximum)

## Cost Breakdown (Monthly)
- **EC2 t2.micro**: FREE (750 hours/month for 12 months)
- **RDS db.t2.micro**: FREE (750 hours/month for 12 months)  
- **Storage**: ~$2-3/month (20GB RDS + 8GB EC2)
- **Data Transfer**: ~$1-2/month (minimal for small app)
- **Total**: ~$3-5/month (well under $50)

## Step-by-Step Deployment

### Phase 1: Setup RDS Database (5 minutes)

1. **AWS Console → RDS → Create Database**
   - Engine: MySQL 8.0.35
   - Template: **Free tier** ✅
   - DB instance identifier: `food-ordering-db`
   - Master username: `admin`
   - Master password: `FoodOrder2024!` (save this!)
   - DB instance class: **db.t2.micro** ✅
   - Storage: 20 GB (free tier limit)
   - **Public access: YES** (for DBeaver)
   - Initial database name: `food_ordering`

2. **Configure Security Group**
   - Name: `food-ordering-rds-sg`
   - Inbound rules:
     - MySQL/Aurora (3306) from Anywhere (0.0.0.0/0)
     - Or restrict to your IP + EC2 security group

3. **Save RDS Endpoint**
   - Copy: `food-ordering-db.xxxxxx.us-east-1.rds.amazonaws.com`

### Phase 2: Setup EC2 Instance (10 minutes)

1. **AWS Console → EC2 → Launch Instance**
   - Name: `food-ordering-server`
   - AMI: Ubuntu Server 22.04 LTS
   - Instance type: **t2.micro** ✅
   - Key pair: Create new → Download `.pem` file
   - Security group: Create new
     - SSH (22) from My IP
     - HTTP (80) from Anywhere
     - Custom TCP (3000) from Anywhere (React)
     - Custom TCP (5000) from Anywhere (API)

2. **Connect to EC2**
   ```bash
   chmod 400 your-key.pem
   ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
    sudo yum update -y

    # Install Node.js 18
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs

    # Install MySQL client
    sudo yum install -y mysql

    # Install Git
    sudo yum install -y git

    # Install PM2 and serve globally via npm
    sudo npm install -g pm2 serve

    # Verify installations
    node --version
    npm --version
   ```

### Phase 3: Deploy Backend (15 minutes)

1. **Upload Project Files**
   ```bash
   # Option A: Git clone (if public repo)
   git clone https://github.com/Yaphb/food_and_ordering_system.git
   cd food_and_ordering_system/backend
   
   # Option B: SCP upload (from local machine)
   scp -i "your-key.pem" -r ./aws-deploy ubuntu@your-ec2-ip:~/food-ordering
   ```

2. **Configure Backend**
   ```bash
   cd backend
   npm install --production
   
   # Create production .env
   nano .env
   ```
   
   **Copy this into .env:**
   ```env
   PORT=5000
   NODE_ENV=production
   DB_TYPE=mysql
   DB_HOST=food-ordering-db.xxxxxx.us-east-1.rds.amazonaws.com
   DB_USER=admin
   DB_PASSWORD=FoodOrder2024!
   DB_NAME=food_ordering
   DB_PORT=3306
   JWT_SECRET=super_secure_jwt_secret_change_this_now_2024
   FRONTEND_URL=http://your-ec2-public-ip:3000
   ```

3. **Setup Database**
   ```bash
   # Import schema and seed data
   mysql -h your-rds-endpoint -u admin -p food_ordering < database/schema.sql
   mysql -h your-rds-endpoint -u admin -p food_ordering < database/seed.sql
   
   # Test connection
   node scripts/checkMySQL.js
   ```

4. **Start Backend with PM2**
   ```bash
   pm2 start index.js --name food-ordering-api
   pm2 save
   pm2 startup
   # Follow the command it gives you
   
   # Test API
   curl http://localhost:5000/api/menu
   ```

### Phase 4: Deploy Frontend (10 minutes)

1. **Build Frontend Locally** (on your Windows machine)
   ```cmd
   cd frontend
   echo REACT_APP_API_URL=http://your-ec2-public-ip:5000 > .env
   npm run build
   ```

2. **Upload Build to EC2**
   ```bash
   scp -i "your-key.pem" -r ./frontend/build ubuntu@your-ec2-ip:~/frontend-build
   ```

3. **Serve Frontend on EC2**
   ```bash
   # On EC2
   pm2 start "serve -s ~/frontend-build -l 3000" --name food-ordering-frontend
   pm2 save
   ```

### Phase 5: Configure DBeaver (5 minutes)

1. **DBeaver Connection**
   - Host: `food-ordering-db.xxxxxx.us-east-1.rds.amazonaws.com`
   - Port: `3306`
   - Database: `food_ordering`
   - Username: `admin`
   - Password: `FoodOrder2024!`

2. **Test Connection**
   - Should connect successfully
   - You'll see your tables: users, menu_items, orders

## Access Your Application

- **Frontend**: `http://your-ec2-public-ip:3000`
- **API**: `http://your-ec2-public-ip:5000/api/menu`
- **Database**: Via DBeaver using RDS endpoint

## Default Login Credentials
- **Admin**: admin@gmail.com / 123456
- **Staff**: staff@gmail.com / 123456
- **Customer**: johndoe@gmail.com / 123456

## Monitoring & Management

```bash
# Check status
pm2 status

# View logs
pm2 logs food-ordering-api
pm2 logs food-ordering-frontend

# Restart services
pm2 restart all

# Stop services
pm2 stop all
```

## Cost Monitoring

1. **Set Billing Alerts**
   - AWS Console → Billing → Billing preferences
   - Enable billing alerts
   - Set alert at $10, $25, $40

2. **Monitor Usage**
   - EC2: Should stay within 750 hours/month
   - RDS: Should stay within 750 hours/month
   - Check monthly AWS bill

## Security Best Practices

1. **Restrict RDS Access**
   ```bash
   # After testing, restrict RDS to EC2 only
   # Security Group: MySQL (3306) from EC2 security group only
   ```

2. **Use Strong Passwords**
   - RDS password: Complex with special characters
   - JWT secret: Long random string

3. **Regular Updates**
   ```bash
   sudo apt update && sudo apt upgrade -y
   pm2 update
   ```

## Troubleshooting

**Can't connect to RDS:**
- Check security group allows port 3306
- Verify endpoint and credentials
- Test with: `mysql -h endpoint -u admin -p`

**EC2 connection issues:**
- Check security group allows SSH (22)
- Verify key file permissions: `chmod 400 key.pem`

**Application not loading:**
- Check PM2 status: `pm2 status`
- View logs: `pm2 logs`
- Verify ports in security group

**High costs:**
- Monitor billing dashboard daily
- Ensure using t2.micro instances only
- Check data transfer usage

## Cleanup (When Done Testing)

```bash
# Stop services
pm2 delete all

# AWS Console:
# 1. Terminate EC2 instance
# 2. Delete RDS database
# 3. Delete security groups
# 4. Delete key pairs
```

This setup should cost less than $5/month and easily fit within your $50 budget!