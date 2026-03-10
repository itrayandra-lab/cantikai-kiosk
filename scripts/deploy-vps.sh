#!/bin/bash

# Cantik AI VPS Deployment Script
# Run this on your VPS after cloning the repo

set -e  # Exit on error

echo "🚀 Cantik AI VPS Deployment Script"
echo "===================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (sudo bash deploy-vps.sh)"
    exit 1
fi

# Get domain name
read -p "Enter your domain name (e.g., cantik-ai.com): " DOMAIN
read -p "Enter your email for SSL certificate: " EMAIL

echo ""
echo "📦 Installing system dependencies..."
apt update && apt upgrade -y
apt install -y python3.11 python3.11-venv python3-pip nginx git curl
apt install -y build-essential libssl-dev libffi-dev python3-dev
apt install -y libopencv-dev

echo ""
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo ""
echo "🐍 Setting up Python backend..."
cd backend-python
python3.11 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=production
FRONTEND_URL=https://$DOMAIN
ENABLE_GPU=false
EOF

cd ..

echo ""
echo "⚛️  Building React frontend..."
npm install

# Create frontend .env
cat > .env << EOF
VITE_BACKEND_URL=https://$DOMAIN/api
EOF

npm run build

echo ""
echo "🌐 Configuring Nginx..."
cat > /etc/nginx/sites-available/cantik-ai << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Frontend (React PWA)
    location / {
        root $(pwd)/dist;
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "public, max-age=31536000" always;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:8000/health;
    }
}
EOF

ln -sf /etc/nginx/sites-available/cantik-ai /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl restart nginx

echo ""
echo "🔒 Setting up SSL with Let's Encrypt..."
apt install -y certbot python3-certbot-nginx
certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

echo ""
echo "🔧 Creating systemd service..."
cat > /etc/systemd/system/cantik-ai-backend.service << EOF
[Unit]
Description=Cantik AI Backend (FastAPI)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$(pwd)/backend-python
Environment="PATH=$(pwd)/backend-python/venv/bin"
ExecStart=$(pwd)/backend-python/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable cantik-ai-backend
systemctl start cantik-ai-backend

echo ""
echo "🔥 Setting up firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo ""
echo "🧹 Cleaning up..."
rm -rf node_modules
rm -rf ~/.cache/pip

echo ""
echo "✅ Deployment Complete!"
echo "======================="
echo ""
echo "Your application is now live at:"
echo "🌐 https://$DOMAIN"
echo ""
echo "Backend status:"
systemctl status cantik-ai-backend --no-pager
echo ""
echo "Useful commands:"
echo "  - Check backend logs: journalctl -u cantik-ai-backend -f"
echo "  - Restart backend: systemctl restart cantik-ai-backend"
echo "  - Check Nginx: systemctl status nginx"
echo ""
echo "🎉 Happy analyzing!"
