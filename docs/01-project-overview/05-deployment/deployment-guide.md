# Phase 5: Deployment Guide

## Deployment Checklist

### Pre-Deployment ⏳
- [ ] All features tested locally
- [ ] Database relationships verified
- [ ] API endpoints tested
- [ ] Environment variables documented
- [ ] Production build tested
- [ ] Security audit completed
- [ ] Performance optimization done
- [ ] Backup strategy defined

### Deployment Steps ⏳
- [ ] VPS server provisioned
- [ ] Domain name configured
- [ ] SSL certificate installed
- [ ] Nginx configured
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Database migrated
- [ ] Environment variables set
- [ ] Health checks passing
- [ ] Monitoring setup

### Post-Deployment ⏳
- [ ] Smoke tests passed
- [ ] User acceptance testing
- [ ] Performance monitoring
- [ ] Error tracking active
- [ ] Backup verified
- [ ] Documentation updated

---

## 1. Server Requirements

### Minimum Specifications
- **OS:** Ubuntu 20.04 LTS or newer
- **CPU:** 2 cores
- **RAM:** 4GB
- **Storage:** 20GB SSD
- **Bandwidth:** 100GB/month
- **Network:** Static IP address

### Recommended Specifications
- **OS:** Ubuntu 22.04 LTS
- **CPU:** 4 cores
- **RAM:** 8GB
- **Storage:** 40GB SSD
- **Bandwidth:** 500GB/month
- **Network:** Static IP + domain name

### Software Requirements
- **Python:** 3.10 or newer
- **Node.js:** 18.x or newer
- **Nginx:** 1.18 or newer
- **Certbot:** For SSL certificates
- **Git:** For code deployment
- **Systemd:** For process management

---

## 2. VPS Setup

### 2.1 Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3-pip python3-venv nginx git curl

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Create application user
sudo adduser cantik --disabled-password
sudo usermod -aG sudo cantik

# Setup firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2.2 Directory Structure

```bash
/home/cantik/
├── cantik-ai/                  # Application root
│   ├── backend-python/         # Backend code
│   │   ├── app/
│   │   ├── venv/              # Python virtual environment
│   │   ├── cantik_ai.db       # SQLite database
│   │   └── .env               # Backend environment variables
│   ├── frontend/               # Frontend build
│   │   └── dist/              # Production build
│   └── logs/                   # Application logs
└── backups/                    # Database backups
```

---

## 3. Backend Deployment

### 3.1 Clone Repository

```bash
# Switch to application user
su - cantik

# Clone repository
git clone https://github.com/raymaizing/cantik-ai.git
cd cantik-ai
```

### 3.2 Setup Python Environment

```bash
cd backend-python

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3.3 Configure Environment Variables

```bash
# Create .env file
nano .env
```

```env
# Backend Environment Variables
DATABASE_URL=sqlite:///./cantik_ai.db
SECRET_KEY=your-secret-key-here-change-this
GEMINI_API_KEY=your-gemini-api-key
GROQ_API_KEY=your-groq-api-key
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3.4 Initialize Database

```bash
# Run database migrations (if any)
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"

# Verify database
python -c "from app.database import SessionLocal; db = SessionLocal(); print('Database OK')"
```

### 3.5 Create Systemd Service

```bash
sudo nano /etc/systemd/system/cantik-backend.service
```

```ini
[Unit]
Description=Cantik AI Backend
After=network.target

[Service]
Type=simple
User=cantik
WorkingDirectory=/home/cantik/cantik-ai/backend-python
Environment="PATH=/home/cantik/cantik-ai/backend-python/venv/bin"
ExecStart=/home/cantik/cantik-ai/backend-python/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8787 --workers 4
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable cantik-backend
sudo systemctl start cantik-backend

# Check status
sudo systemctl status cantik-backend
```

---

## 4. Frontend Deployment

### 4.1 Build Frontend

```bash
# On local machine or server
cd cantik-ai

# Install dependencies
npm install

# Create production .env
nano .env
```

```env
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_GROQ_API_KEY=your-groq-api-key
VITE_BACKEND_URL=https://api.yourdomain.com
VITE_APP_NAME=Cantik AI
```

```bash
# Build for production
npm run build

# Output will be in dist/ folder
```

### 4.2 Deploy Frontend

```bash
# Copy dist folder to server
scp -r dist/ cantik@your-server-ip:/home/cantik/cantik-ai/frontend/

# Or on server, pull and build
cd /home/cantik/cantik-ai
git pull
npm install
npm run build
```

---

## 5. Nginx Configuration

### 5.1 Create Nginx Config

```bash
sudo nano /etc/nginx/sites-available/cantik-ai
```

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8787;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers (if needed)
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization";
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /home/cantik/cantik-ai/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/cantik-ai /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 6. SSL Certificate (Let's Encrypt)

### 6.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Obtain SSL Certificate

```bash
# For frontend
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# For backend API
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal (already setup by certbot)
sudo systemctl status certbot.timer
```

---

## 7. Database Backup

### 7.1 Create Backup Script

```bash
nano /home/cantik/backup-db.sh
```

```bash
#!/bin/bash
# Database backup script

BACKUP_DIR="/home/cantik/backups"
DB_PATH="/home/cantik/cantik-ai/backend-python/cantik_ai.db"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/cantik_ai_$DATE.db"

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Copy database
cp $DB_PATH $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "cantik_ai_*.db.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

```bash
# Make executable
chmod +x /home/cantik/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
```

```cron
0 2 * * * /home/cantik/backup-db.sh >> /home/cantik/logs/backup.log 2>&1
```

---

## 8. Monitoring & Logging

### 8.1 Application Logs

```bash
# Backend logs
sudo journalctl -u cantik-backend -f

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### 8.2 Health Check Endpoint

Add to `backend-python/app/main.py`:

```python
@app.get("/api/v2/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }
```

### 8.3 Monitoring Script

```bash
nano /home/cantik/monitor.sh
```

```bash
#!/bin/bash
# Simple monitoring script

# Check backend
if curl -f http://localhost:8787/api/v2/health > /dev/null 2>&1; then
    echo "Backend: OK"
else
    echo "Backend: FAILED"
    sudo systemctl restart cantik-backend
fi

# Check Nginx
if systemctl is-active --quiet nginx; then
    echo "Nginx: OK"
else
    echo "Nginx: FAILED"
    sudo systemctl restart nginx
fi
```

```bash
chmod +x /home/cantik/monitor.sh

# Add to crontab (every 5 minutes)
*/5 * * * * /home/cantik/monitor.sh >> /home/cantik/logs/monitor.log 2>&1
```

---

## 9. Deployment Commands

### Quick Deploy Script

```bash
nano /home/cantik/deploy.sh
```

```bash
#!/bin/bash
# Quick deployment script

echo "🚀 Starting deployment..."

# Pull latest code
cd /home/cantik/cantik-ai
git pull origin main

# Backend
echo "📦 Updating backend..."
cd backend-python
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart cantik-backend

# Frontend
echo "🎨 Building frontend..."
cd ..
npm install
npm run build
cp -r dist/* frontend/dist/

# Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Deployment completed!"
```

```bash
chmod +x /home/cantik/deploy.sh
```

---

## 10. Rollback Plan

### Rollback Script

```bash
nano /home/cantik/rollback.sh
```

```bash
#!/bin/bash
# Rollback to previous version

echo "⚠️  Starting rollback..."

# Git rollback
cd /home/cantik/cantik-ai
git reset --hard HEAD~1

# Restart services
sudo systemctl restart cantik-backend
sudo systemctl reload nginx

echo "✅ Rollback completed!"
```

---

## 11. Post-Deployment Verification

### Checklist
- [ ] Frontend loads: https://yourdomain.com
- [ ] Backend API responds: https://api.yourdomain.com/api/v2/health
- [ ] SSL certificate valid
- [ ] Login works
- [ ] Skin analysis works
- [ ] Chat works
- [ ] Database writes work
- [ ] Admin panel accessible
- [ ] Mobile responsive
- [ ] Performance acceptable (< 3s load time)

### Test Commands

```bash
# Test backend health
curl https://api.yourdomain.com/api/v2/health

# Test frontend
curl -I https://yourdomain.com

# Check SSL
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Check backend service
sudo systemctl status cantik-backend

# Check Nginx
sudo systemctl status nginx
```

---

**Document Status:** ⏳ Ready for Deployment  
**Last Updated:** 2026-03-03  
**Next Step:** Execute deployment on VPS
