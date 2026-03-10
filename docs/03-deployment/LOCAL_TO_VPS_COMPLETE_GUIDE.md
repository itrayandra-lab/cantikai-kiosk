# 🚀 Cantik AI - Local Testing → VPS Deployment (Complete Guide)

## Jawaban Pertanyaan Anda:

### 1. Bisa test di local dulu?
✅ **BISA!** Bahkan HARUS test local dulu sebelum deploy ke VPS.

### 2. Kalau local jalan, VPS pasti jalan?
✅ **YA!** Kalau local jalan sempurna, VPS juga pasti jalan.
- Code yang sama
- Dependencies yang sama
- Hanya beda environment (local vs production)

### 3. Apa yang harus disetup di local?
📋 **Checklist lengkap di bawah**

---

## STEP 1: Setup & Test di Local (WAJIB!)

### A. Install Dependencies

```bash
# 1. Install Node.js dependencies (Frontend)
npm install

# 2. Install Python dependencies (Backend)
cd backend-python
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### B. Test Backend (Terminal 1)

```bash
cd backend-python
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Test Backend:**
```bash
# Open new terminal
curl http://localhost:8000/health

# Should return:
# {"status":"healthy","message":"Backend is running"}
```

✅ **Kalau ini jalan, backend OK!**

### C. Test Frontend (Terminal 2)

```bash
# Buka terminal baru
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**Test Frontend:**
1. Buka browser: `http://localhost:5173`
2. Should see homepage Cantik AI
3. Click "Analyze Your Skin"
4. Allow camera access
5. Take photo
6. Wait for analysis

**Expected Result:**
- Loading screen muncul
- Progress bar 0-95%
- Setelah 3-5 detik, muncul hasil
- Badge "Clinical Mode" muncul (artinya pakai Python backend)
- Lihat data: wrinkle severity, pore density, dll

✅ **Kalau ini jalan, frontend + backend integration OK!**

---

## STEP 2: Verifikasi Semua Fitur

### Checklist Testing:

- [ ] Backend health check: `curl http://localhost:8000/health`
- [ ] Frontend homepage load
- [ ] Camera access works
- [ ] Photo capture works
- [ ] Analysis starts (loading screen)
- [ ] Badge "Clinical Mode" muncul
- [ ] Results display dengan data:
  - [ ] Overall score (0-100)
  - [ ] Wrinkle severity
  - [ ] Pore density
  - [ ] Texture score
- [ ] Recommended products muncul
- [ ] Navigation works (Home → Scan → Result → Recommendations)

✅ **Kalau semua checklist OK, siap deploy ke VPS!**

---

## STEP 3: Prepare untuk VPS

### A. Create .env.production

```bash
# Frontend .env.production
cat > .env.production << EOF
VITE_BACKEND_URL=https://your-domain.com/api
EOF

# Backend .env.production
cat > backend-python/.env.production << EOF
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=production
FRONTEND_URL=https://your-domain.com
ENABLE_GPU=false
EOF
```

### B. Test Production Build

```bash
# Build frontend
npm run build

# Test build locally
npm run preview

# Should open: http://localhost:4173
# Test semua fitur lagi
```

✅ **Kalau production build jalan, siap upload ke VPS!**

---

## STEP 4: Deploy ke VPS (aaPanel)

### A. Upload Files ke VPS

**Option 1: Git (Recommended)**
```bash
# Di local
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main

# Di VPS
cd /www/wwwroot
git clone your-repo-url cantik-ai
cd cantik-ai
```

**Option 2: FTP/SFTP**
- Use FileZilla atau WinSCP
- Upload semua files ke `/www/wwwroot/cantik-ai`

### B. Setup Backend di VPS

```bash
# SSH ke VPS
ssh root@your-vps-ip

# Navigate to project
cd /www/wwwroot/cantik-ai

# Install Python dependencies
cd backend-python
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Copy production env
cp .env.production .env

# Test backend
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Ctrl+C to stop
```

### C. Setup Frontend di VPS

```bash
cd /www/wwwroot/cantik-ai

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install dependencies
npm install

# Copy production env
cp .env.production .env

# Build
npm run build

# Files akan ada di folder 'dist/'
```

### D. Setup Nginx di aaPanel

**1. Login aaPanel:**
- URL: `https://your-vps-ip:7800`
- Username: (check email atau `/www/server/panel/default.pl`)
- Password: (check email atau reset)

**2. Add Website:**
- Go to: **Website** → **Add Site**
- Domain: `cantik-ai.com` (atau domain Anda)
- Root Directory: `/www/wwwroot/cantik-ai/dist`
- PHP Version: **Pure Static** (atau None)
- Click **Submit**

**3. Configure Nginx:**
- Go to: **Website** → Click domain → **Config**
- Find section `location /` 
- ADD THIS BEFORE `location /`:

```nginx
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
```

- Click **Save**
- Click **Restart** (Nginx)

**4. Setup SSL:**
- Go to: **Website** → Click domain → **SSL**
- Click **Let's Encrypt**
- Enter email
- Click **Apply**
- Wait 1-2 minutes
- SSL certificate installed!

### E. Setup Backend Service (Auto-start)

```bash
# Create systemd service
cat > /etc/systemd/system/cantik-ai-backend.service << EOF
[Unit]
Description=Cantik AI Backend (FastAPI)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/www/wwwroot/cantik-ai/backend-python
Environment="PATH=/www/wwwroot/cantik-ai/backend-python/venv/bin"
ExecStart=/www/wwwroot/cantik-ai/backend-python/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start
systemctl daemon-reload
systemctl enable cantik-ai-backend
systemctl start cantik-ai-backend

# Check status
systemctl status cantik-ai-backend
```

---

## STEP 5: Verification di VPS

### A. Check Backend

```bash
# Check service
systemctl status cantik-ai-backend

# Check health
curl http://localhost:8000/health

# Check logs
journalctl -u cantik-ai-backend -f
```

### B. Check Frontend

```bash
# Check Nginx
systemctl status nginx

# Check files
ls -la /www/wwwroot/cantik-ai/dist
```

### C. Check from Browser

1. Open: `https://your-domain.com`
2. Should see homepage
3. Click "Analyze Your Skin"
4. Take photo
5. Should see "Clinical Mode" badge
6. Should see analysis results

✅ **Kalau semua OK, LIVE!** 🎉

---

## Troubleshooting

### Problem: Backend tidak jalan

**Check:**
```bash
systemctl status cantik-ai-backend
journalctl -u cantik-ai-backend -n 50
```

**Solution:**
```bash
# Restart
systemctl restart cantik-ai-backend

# Check port
netstat -tulpn | grep 8000
```

### Problem: Frontend tidak muncul

**Check:**
```bash
# Check Nginx
nginx -t
systemctl status nginx

# Check files
ls -la /www/wwwroot/cantik-ai/dist
```

**Solution:**
```bash
# Rebuild
cd /www/wwwroot/cantik-ai
npm run build

# Restart Nginx
systemctl restart nginx
```

### Problem: "Clinical Mode" tidak muncul

**Check:**
```bash
# Check backend health
curl http://localhost:8000/health

# Check Nginx proxy
curl http://localhost/health
```

**Solution:**
- Check Nginx config (proxy_pass)
- Check CORS in `backend-python/app/main.py`
- Check `.env` file (FRONTEND_URL)

### Problem: SSL error

**Solution:**
```bash
# Renew certificate
certbot renew

# Or via aaPanel:
# Website → Domain → SSL → Let's Encrypt → Apply
```

---

## Summary: Local → VPS Flow

```
1. LOCAL TESTING (WAJIB!)
   ├── Install dependencies
   ├── Test backend (port 8000)
   ├── Test frontend (port 5173)
   ├── Test integration (camera + analysis)
   └── ✅ Semua jalan? Lanjut!

2. PRODUCTION BUILD
   ├── npm run build
   ├── Test preview (port 4173)
   └── ✅ Build OK? Lanjut!

3. UPLOAD TO VPS
   ├── Git clone / FTP upload
   └── ✅ Files uploaded? Lanjut!

4. VPS SETUP
   ├── Install Python dependencies
   ├── Build frontend
   ├── Setup Nginx (aaPanel)
   ├── Setup SSL
   └── Setup systemd service

5. VERIFICATION
   ├── Check backend health
   ├── Check frontend load
   ├── Test from browser
   └── ✅ Semua OK? LIVE! 🎉
```

---

## Quick Commands Reference

### Local Development:
```bash
# Backend
cd backend-python && source venv/bin/activate && uvicorn app.main:app --reload

# Frontend
npm run dev

# Test
curl http://localhost:8000/health
```

### VPS Production:
```bash
# Backend
systemctl status cantik-ai-backend
systemctl restart cantik-ai-backend
journalctl -u cantik-ai-backend -f

# Frontend
cd /www/wwwroot/cantik-ai && npm run build
systemctl restart nginx

# Test
curl https://your-domain.com/health
```

---

## Kesimpulan:

✅ **Local testing WAJIB sebelum deploy!**
- Pastikan semua fitur jalan
- Pastikan "Clinical Mode" muncul
- Pastikan analysis results muncul

✅ **Kalau local jalan, VPS pasti jalan!**
- Same code
- Same dependencies
- Hanya beda environment

✅ **Follow step-by-step guide ini**
- Jangan skip testing
- Verify setiap step
- Check logs kalau ada error

**Siap mulai testing local? Atau langsung deploy ke VPS?** 🚀
