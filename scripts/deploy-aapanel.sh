#!/bin/bash

# Cantik AI Deployment for aaPanel VPS
# Run this on your VPS after uploading files

set -e

echo "🚀 Cantik AI Deployment for aaPanel"
echo "===================================="

# Get domain name
read -p "Enter your domain name (e.g., cantik-ai.com): " DOMAIN

# Get current directory
INSTALL_DIR=$(pwd)

echo ""
echo "📦 Installing Python dependencies..."
cd backend-python

# Check if venv exists
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Create .env
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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

npm install

# Create frontend .env
cat > .env << EOF
VITE_BACKEND_URL=https://$DOMAIN/api
EOF

npm run build

echo ""
echo "🔧 Creating systemd service..."
cat > /tmp/cantik-ai-backend.service << EOF
[Unit]
Description=Cantik AI Backend (FastAPI)
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$INSTALL_DIR/backend-python
Environment="PATH=$INSTALL_DIR/backend-python/venv/bin"
ExecStart=$INSTALL_DIR/backend-python/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo mv /tmp/cantik-ai-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable cantik-ai-backend
sudo systemctl start cantik-ai-backend

echo ""
echo "✅ Backend Setup Complete!"
echo "=========================="
echo ""
echo "Backend status:"
sudo systemctl status cantik-ai-backend --no-pager
echo ""
echo "📋 NEXT STEPS (Manual in aaPanel):"
echo ""
echo "1. Login to aaPanel: https://$(hostname -I | awk '{print $1}'):7800"
echo ""
echo "2. Add Website:"
echo "   - Go to: Website → Add Site"
echo "   - Domain: $DOMAIN"
echo "   - Root Directory: $INSTALL_DIR/dist"
echo "   - PHP Version: Pure Static"
echo "   - Click 'Submit'"
echo ""
echo "3. Configure Nginx:"
echo "   - Go to: Website → $DOMAIN → Config"
echo "   - Add this BEFORE 'location /' block:"
echo ""
cat << 'NGINX'
    # Backend API
    location /api {
        proxy_pass http://localhost:8000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:8000/health;
    }
NGINX
echo ""
echo "   - Click 'Save'"
echo "   - Click 'Restart' (Nginx)"
echo ""
echo "4. Setup SSL:"
echo "   - Go to: Website → $DOMAIN → SSL"
echo "   - Click 'Let's Encrypt'"
echo "   - Enter your email"
echo "   - Click 'Apply'"
echo ""
echo "5. Test:"
echo "   - Open: https://$DOMAIN"
echo "   - Should see Cantik AI homepage"
echo "   - Take photo and analyze"
echo ""
echo "Useful commands:"
echo "  - Check backend: sudo systemctl status cantik-ai-backend"
echo "  - View logs: sudo journalctl -u cantik-ai-backend -f"
echo "  - Restart: sudo systemctl restart cantik-ai-backend"
echo ""
echo "🎉 Setup complete! Follow the manual steps above."
