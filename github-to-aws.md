# GitHub to AWS Deployment Guide

## Option 1: Direct Git Clone (Recommended)

### 1. Make Repository Public (Temporary)
```bash
# On GitHub: Settings → General → Change visibility to Public
```

### 2. Deploy from GitHub
```bash
# On EC2 instance
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### 3. Make Repository Private Again
```bash
# On GitHub: Settings → General → Change visibility back to Private
```

## Option 2: GitHub Actions (Advanced)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Build Frontend
      run: |
        cd frontend
        npm install
        echo "REACT_APP_API_URL=http://${{ secrets.EC2_IP }}:5000" > .env
        npm run build
        
    - name: Deploy to EC2
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.EC2_IP }}
        username: ubuntu
        key: ${{ secrets.EC2_PRIVATE_KEY }}
        script: |
          cd ~/your-repo-name
          git pull origin main
          cd backend
          npm install --production
          pm2 restart food-ordering-api
          cd ../frontend
          npm run build
          pm2 restart food-ordering-frontend
```

**Required Secrets in GitHub:**
- `EC2_IP`: Your EC2 public IP
- `EC2_PRIVATE_KEY`: Contents of your .pem file

## Option 3: Manual Upload (Simple)

### 1. Create Deployment Package
```cmd
# On Windows
deploy-aws.bat
# Choose option 2: Create Deployment Package
```

### 2. Upload via SCP
```bash
scp -i "your-key.pem" -r aws-deploy ubuntu@your-ec2-ip:~/
```

### 3. Setup on EC2
```bash
ssh -i "your-key.pem" ubuntu@your-ec2-ip
cd aws-deploy
# Follow backend and frontend setup steps
```