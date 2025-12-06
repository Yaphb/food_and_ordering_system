# AWS Free Tier Setup

Deploy to AWS using free tier (EC2 + RDS MySQL).

## Free Tier Limits

- EC2: 750 hrs/month t2.micro (12 months)
- RDS: 750 hrs/month db.t2.micro MySQL (12 months)
- Storage: 20GB RDS, 8GB EC2

## 1. Create RDS Database

**AWS Console → RDS → Create database:**
- Engine: MySQL 8.0
- Template: **Free tier**
- Identifier: `food-ordering-db`
- Master username: `admin`
- Password: (save this!)
- Instance: **db.t2.micro**
- Storage: 20GB
- Public access: **Yes**
- Initial database: `food_ordering`

**Configure Security Group:**
- EC2 → Security Groups → `food-ordering-db-sg`
- Inbound: MySQL (3306) from Anywhere

**Save Endpoint:**
- Copy endpoint: `food-ordering-db.xxxxx.region.rds.amazonaws.com`

## 2. Create EC2 Instance

**AWS Console → EC2 → Launch Instance:**
- Name: `food-ordering-server`
- AMI: Ubuntu 22.04 LTS
- Instance: **t2.micro**
- Key pair: Create new → Download `.pem` file
- Security group: Allow SSH (22), HTTP (80), Custom TCP (5000)
- Storage: 8GB

**Connect to EC2:**
```bash
chmod 400 food-ordering-key.pem
ssh -i "food-ordering-key.pem" ubuntu@<EC2-IP>
```

**Install dependencies:**
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs mysql-client git
sudo npm install -g pm2
```

## 3. Deploy Backend

```bash
# Upload or clone project
mkdir ~/food-ordering-system
cd ~/food-ordering-system
# Upload files via SCP or git clone

cd backend
npm install --production
```

**Create `.env`:**
```env
PORT=5000
NODE_ENV=production
DB_TYPE=mysql
DB_HOST=food-ordering-db.xxxxx.region.rds.amazonaws.com
DB_NAME=food_ordering
DB_USER=admin
DB_PASSWORD=YourPassword123!
JWT_SECRET=random_secret_key_here
FRONTEND_URL=http://<EC2-IP>:3000
```

**Import database:**
```bash
mysql -h <RDS-ENDPOINT> -u admin -p food_ordering < database/schema.sql
mysql -h <RDS-ENDPOINT> -u admin -p food_ordering < database/seed.sql
```

**Start with PM2:**
```bash
pm2 start index.js --name api
pm2 save
pm2 startup
```

Test: `http://<EC2-IP>:5000/api/menu`

## 4. Deploy Frontend

**Build locally:**
```bash
cd frontend
echo "REACT_APP_API_URL=http://<EC2-IP>:5000" > .env
npm run build
```

**Upload to EC2:**
```bash
# On EC2
cd ~/food-ordering-system/frontend
npm install
npm run build
sudo npm install -g serve
pm2 start "serve -s build -l 3000" --name frontend
pm2 save
```

Access: `http://<EC2-IP>:3000`

## 5. Optional: Setup Domain & SSL

**Route 53:**
- Create A record: `api.yourdomain.com` → EC2 IP

**Install SSL:**
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
sudo nano /etc/nginx/sites-available/food-ordering
```

Add:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/food-ordering /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d api.yourdomain.com
```

## Monitoring

```bash
pm2 status
pm2 logs api
pm2 restart api
```

## Troubleshooting

**Can't connect to RDS:**
- Check security group allows port 3306
- Verify endpoint and password

**EC2 connection timeout:**
- Check security group allows your IP on port 22
- Verify key permissions: `chmod 400 key.pem`

**App not starting:**
```bash
pm2 logs
pm2 restart all
```

## Cleanup

To avoid charges:
1. Terminate EC2 instance
2. Delete RDS database
3. Delete security groups

## Security Tips

- Restrict RDS to EC2 security group only
- Use strong JWT_SECRET
- Enable HTTPS with SSL
- Set billing alerts in AWS Console
