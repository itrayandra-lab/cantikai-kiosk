# 🚀 Cantik AI v2.0 - VPS Deployment Guide

## Jawaban Cepat:

### 1. Bisa di VPS?
✅ **BISA!** Bahkan lebih mudah dari serverless.

### 2. Size berapa?
📦 **Backend: ~2.5 GB** (dengan PyTorch)
📦 **Frontend: ~500 MB** (build)
📦 **Total: ~3 GB** (masih ada space untuk data)

### 3. Port mana yang dibuka?
- **Frontend**: `http://your-domain.com` (port 80/443)
- **Backend API**: `http://your-domain.com/api` (reverse proxy dari port 8000)
- User hanya akses 1 domain, Nginx handle routing internal

---

## VPS Requirements:

### Minimum Specs:
- **RAM**: 2 GB (cukup untuk CPU-only processing)
- **Storage**: 10 GB (3 GB app + 7 GB buffer)
- **CPU**: 2 cores
- **OS**: Ubuntu 22.04 LTS
- **Cost**: $6-12/bulan (DigitalOcean, Vultr, Linode)

### Recommended Specs:
- **RAM**: 4 GB (lebih smooth)
- **Storage**: 20 GB
- **CPU**: 2-4 cores
- **Cost**: $12-24/bulan

---

## Architecture di VPS:

```
Internet
    ↓
Nginx (Port 80/443)
    ├── / → React Frontend (static files)
    └── /api → Python Backend (port 8000)
```

User hanya akses: `https://cantik-ai.com`
- Frontend: `https://cantik-ai.com/`
- API: `https://cantik-ai.com/api/v2/analyze/full`

---

## Step-by-Step Deployment:

### 1. Setup VPS (Ubuntu 22.04)

```bash
# SSH ke VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install dependencies
apt install -y python3.11 python3.11-venv python3-pip nginx git curl
apt install -y build-essential libssl-dev libffi-dev python3-dev
apt install -y libopencv-dev  # OpenCV dependencies
```

### 2. Install Node.js (untuk build frontend)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

### 3. Clone Repository

```bash
cd /var/www
git clone https://github.com/your-username/cantik-ai.git
cd cantik-ai
```

### 4. Setup Backend

```bash
cd /var/www/cantik-ai/backend-python

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies (ini yang 2.5 GB)
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=production
FRONTEND_URL=https://your-domain.com
ENABLE_GPU=false
EOF

# Test backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
# Ctrl+C untuk stop
```

### 5. Setup Frontend

```bash
cd /var/www/cantik-ai

# Install dependencies
npm install

# Create production .env
cat > .env << EOF
VITE_BACKEND_URL=https://your-domain.com/api
EOF

# Build for production (ini yang 500 MB)
npm run build

# Hasil build ada di folder 'dist/'
```

### 6. Setup Nginx (Reverse Proxy)

```bash
# Create Nginx config
cat > /etc/nginx/sites-available/cantik-ai << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend (React PWA)
    location / {
        root /var/www/cantik-ai/dist;
        try_files $uri $uri/ /index.html;
        
        # PWA caching headers
        add_header Cache-Control "public, max-age=31536000" always;
    }

    # Backend API (Python FastAPI)
    location /api {
        proxy_pass http://localhost:8000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Increase timeout for image processing
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:8000/health;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/cantik-ai /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default  # Remove default site

# Test Nginx config
nginx -t

# Restart Nginx
systemctl restart nginx
```

### 7. Setup SSL (HTTPS) dengan Let's Encrypt

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate (otomatis update Nginx config)
certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal sudah disetup otomatis
```

### 8. Setup Systemd Service (Auto-start Backend)

```bash
# Create systemd service
cat > /etc/systemd/system/cantik-ai-backend.service << EOF
[Unit]
Description=Cantik AI Backend (FastAPI)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/cantik-ai/backend-python
Environment="PATH=/var/www/cantik-ai/backend-python/venv/bin"
ExecStart=/var/www/cantik-ai/backend-python/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
systemctl daemon-reload
systemctl enable cantik-ai-backend
systemctl start cantik-ai-backend

# Check status
systemctl status cantik-ai-backend
```

### 9. Setup Firewall

```bash
# Allow HTTP, HTTPS, SSH
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## Verification:

### 1. Check Backend
```bash
curl http://localhost:8000/health
# Should return: {"status": "healthy"}
```

### 2. Check Frontend
```bash
curl http://localhost/
# Should return HTML
```

### 3. Check from Browser
- Open: `https://your-domain.com`
- Should see Cantik AI homepage
- Take photo and analyze
- Should see "Clinical Mode" badge

---

## Monitoring & Maintenance:

### Check Backend Logs
```bash
journalctl -u cantik-ai-backend -f
```

### Check Nginx Logs
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Restart Services
```bash
systemctl restart cantik-ai-backend
systemctl restart nginx
```

### Update Application
```bash
cd /var/www/cantik-ai
git pull

# Update backend
cd backend-python
source venv/bin/activate
pip install -r requirements.txt
systemctl restart cantik-ai-backend

# Update frontend
cd ..
npm install
npm run build
```

---

## Storage Breakdown:

```
/var/www/cantik-ai/
├── backend-python/
│   ├── venv/              # 2.5 GB (PyTorch, OpenCV, etc.)
│   ├── app/               # 50 MB (your code)
│   └── requirements.txt
├── dist/                  # 500 MB (built frontend)
├── src/                   # 100 MB (source code)
├── node_modules/          # 300 MB (dev dependencies, bisa dihapus)
└── 00-documentation/      # 10 MB

Total: ~3.5 GB (tanpa node_modules)
```

### Cara Hemat Storage:

```bash
# Hapus node_modules setelah build
cd /var/www/cantik-ai
rm -rf node_modules

# Hapus cache pip
rm -rf ~/.cache/pip

# Total jadi: ~3 GB
```

---

## Performance Optimization:

### 1. Enable Gzip Compression (Nginx)

```nginx
# Add to /etc/nginx/nginx.conf
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
```

### 2. Setup Redis Cache (Optional)

```bash
apt install -y redis-server
systemctl enable redis-server
```

### 3. Setup PM2 for Process Management (Alternative to systemd)

```bash
npm install -g pm2

# Start backend with PM2
cd /var/www/cantik-ai/backend-python
pm2 start "venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000" --name cantik-ai-backend

# Auto-start on reboot
pm2 startup
pm2 save
```

---

## Backup Strategy:

```bash
# Backup script
cat > /root/backup-cantik-ai.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR

# Backup application
tar -czf $BACKUP_DIR/cantik-ai-$DATE.tar.gz /var/www/cantik-ai

# Keep only last 7 days
find $BACKUP_DIR -name "cantik-ai-*.tar.gz" -mtime +7 -delete
EOF

chmod +x /root/backup-cantik-ai.sh

# Add to crontab (daily backup at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /root/backup-cantik-ai.sh") | crontab -
```

---

## Troubleshooting:

### Backend tidak jalan?
```bash
# Check logs
journalctl -u cantik-ai-backend -n 50

# Check if port 8000 is used
netstat -tulpn | grep 8000

# Restart
systemctl restart cantik-ai-backend
```

### Frontend tidak muncul?
```bash
# Check Nginx
nginx -t
systemctl status nginx

# Check file permissions
ls -la /var/www/cantik-ai/dist
```

### SSL error?
```bash
# Renew certificate
certbot renew --dry-run
certbot renew
```

---

## Cost Estimation:

### VPS Options:

**DigitalOcean:**
- 2 GB RAM, 2 CPU, 50 GB SSD: $12/bulan
- 4 GB RAM, 2 CPU, 80 GB SSD: $24/bulan

**Vultr:**
- 2 GB RAM, 1 CPU, 55 GB SSD: $10/bulan
- 4 GB RAM, 2 CPU, 80 GB SSD: $18/bulan

**Linode:**
- 2 GB RAM, 1 CPU, 50 GB SSD: $12/bulan
- 4 GB RAM, 2 CPU, 80 GB SSD: $24/bulan

**Rekomendasi:** Start dengan 2 GB RAM ($10-12/bulan), upgrade kalau traffic tinggi.

---

## Production Checklist:

- [ ] VPS setup (Ubuntu 22.04)
- [ ] Domain pointing ke VPS IP
- [ ] Backend installed & running
- [ ] Frontend built & deployed
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] Systemd service enabled
- [ ] Firewall configured
- [ ] Backup script setup
- [ ] Monitoring setup
- [ ] Test dari browser
- [ ] Test upload foto & analisis

---

## Ready to Publish? ✅

Setelah semua checklist di atas selesai, aplikasi Anda READY TO PUBLISH!

User bisa akses: `https://your-domain.com`
- Install PWA ke HP
- Ambil foto
- Dapat analisis clinical-grade
- Semua jalan smooth!

---

## Next Steps After Deployment:

1. **Monitor Performance**: Check CPU/RAM usage
2. **Setup Analytics**: Google Analytics atau Plausible
3. **Setup Error Tracking**: Sentry untuk track errors
4. **Setup Uptime Monitoring**: UptimeRobot (gratis)
5. **Optimize Images**: Compress assets untuk faster load
6. **Add CDN**: Cloudflare (gratis) untuk faster global access

Siap deploy? 🚀
