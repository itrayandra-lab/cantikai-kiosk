# 🚀 Production Deployment Guide - Cantik AI

## Domain Configuration
**Production URL**: https://skin-analyzer.cantik.ai

## Pre-Deployment Checklist

### 1. Server Requirements
- Docker & Docker Compose installed
- Minimum 2GB RAM, 20GB storage
- SSL certificate untuk `skin-analyzer.cantik.ai`

### 2. SSL Certificate Setup
```bash
# Buat folder SSL
mkdir -p ssl

# Copy SSL certificate files ke folder ssl/
# ssl/skin-analyzer.cantik.ai.crt
# ssl/skin-analyzer.cantik.ai.key
```

### 3. Environment Configuration
```bash
# Copy dan edit environment file
cp .env.production .env

# Edit sesuai kebutuhan:
# - GEMINI_API_KEY
# - GROQ_API_KEY  
# - JWT_SECRET
# - ADMIN_PASSWORD
```

## Deployment Steps

### 1. Clone Repository
```bash
git clone <repository-url>
cd cantikai-skin-analyzer
```

### 2. Setup SSL Certificates
```bash
# Copy SSL files ke folder ssl/
cp /path/to/skin-analyzer.cantik.ai.crt ssl/
cp /path/to/skin-analyzer.cantik.ai.key ssl/
```

### 3. Configure Environment
```bash
# Edit environment variables
nano .env.production
```

### 4. Deploy Application
```bash
# Make scripts executable
chmod +x scripts/docker-deploy.sh

# Deploy to production
./scripts/docker-deploy.sh
```

## Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Main PWA** | https://skin-analyzer.cantik.ai | User interface utama |
| **Admin Dashboard** | https://skin-analyzer.cantik.ai/admin | Admin panel |
| **Kiosk Interface** | https://skin-analyzer.cantik.ai/kiosk | Kiosk touchscreen |
| **Desktop Web** | https://skin-analyzer.cantik.ai/desktop | Desktop experience |
| **API Endpoints** | https://skin-analyzer.cantik.ai/api | Backend API |
| **Health Check** | https://skin-analyzer.cantik.ai/health | Service health |

## Monitoring & Maintenance

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f cantik-ai-production
docker-compose logs -f cantik-ai-nginx
```

### Check Status
```bash
# Container status
docker-compose ps

# Health check
curl https://skin-analyzer.cantik.ai/health
```

### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

### Backup Database
```bash
# Backup SQLite database
docker-compose exec cantik-ai-production cp /app/database/scripts/cantik_ai.db /app/uploads/backup-$(date +%Y%m%d).db
```

## Security Configuration

### Nginx Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: HSTS enabled
- Referrer-Policy: strict-origin-when-cross-origin

### Rate Limiting
- API endpoints: 10 requests/second
- Upload endpoints: 2 requests/second
- Burst allowance configured

### SSL/TLS
- TLS 1.2 and 1.3 only
- Strong cipher suites
- HSTS enabled
- HTTP to HTTPS redirect

## Troubleshooting

### Common Issues

1. **SSL Certificate Error**
   ```bash
   # Check certificate files
   ls -la ssl/
   # Verify certificate
   openssl x509 -in ssl/skin-analyzer.cantik.ai.crt -text -noout
   ```

2. **Container Won't Start**
   ```bash
   # Check logs
   docker-compose logs cantik-ai-production
   # Check disk space
   df -h
   ```

3. **Database Issues**
   ```bash
   # Reinitialize database
   docker-compose exec cantik-ai-production npm run db:init
   ```

4. **Port Conflicts**
   ```bash
   # Check port usage
   netstat -tulpn | grep :80
   netstat -tulpn | grep :443
   ```

### Performance Optimization

1. **Enable Gzip Compression** ✅ (Already configured)
2. **Static File Caching** ✅ (Already configured)
3. **Database Optimization**
   ```bash
   # Vacuum SQLite database
   docker-compose exec cantik-ai-production sqlite3 /app/database/scripts/cantik_ai.db "VACUUM;"
   ```

## Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Verify health: `curl https://skin-analyzer.cantik.ai/health`
3. Check container status: `docker-compose ps`

## Production Checklist

- [ ] SSL certificates installed
- [ ] Environment variables configured
- [ ] Database initialized
- [ ] All services running
- [ ] Health checks passing
- [ ] Domain pointing to server
- [ ] Firewall configured (ports 80, 443)
- [ ] Monitoring setup
- [ ] Backup strategy implemented