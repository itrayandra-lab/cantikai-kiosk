# Quick Reference Guide

## 🚀 Development Commands

### Frontend
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend
```bash
cd backend-python

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --port 8787

# Run on specific host/port
uvicorn app.main:app --host 127.0.0.1 --port 8787
```

---

## 📁 Project Structure

```
cantikai-skin-analyzer-apps/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── backend-python/        # Backend source
│   └── app/
│       ├── models/        # Database models
│       ├── api/           # API routes
│       └── main.py        # FastAPI app
├── public/                # Static assets
├── dist/                  # Production build
└── 01-project-overview/   # Documentation
```

---

## 🔑 Environment Variables

### Frontend (.env)
```env
VITE_GEMINI_API_KEY=your-key
VITE_GROQ_API_KEY=your-key
VITE_BACKEND_URL=http://localhost:8787
VITE_APP_NAME=Cantik AI
```

### Backend (backend-python/.env)
```env
DATABASE_URL=sqlite:///./cantik_ai.db
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-key
GROQ_API_KEY=your-key
```

---

## 🗄️ Database Commands

```bash
cd backend-python

# Check database schema
python3 check_database_schema.py

# View database content
python3 view_database.py

# Backup database
cp cantik_ai.db cantik_ai_backup_$(date +%Y%m%d).db
```

---

## 🌐 API Endpoints

### Base URL
- Development: `http://localhost:8787`
- Production: `https://api.yourdomain.com`

### Key Endpoints
- `GET /api/v2/health` - Health check
- `POST /api/v2/users/create` - Register user
- `POST /api/v2/analyses` - Create analysis
- `GET /api/v2/chat/sessions/{user_id}` - Get chat sessions
- `POST /api/v2/chat/sessions` - Create chat session

---

## 🐛 Common Issues & Fixes

### Backend won't start
```bash
# Check if port is in use
lsof -ti:8787

# Kill process
kill $(lsof -ti:8787)

# Restart backend
uvicorn app.main:app --reload --port 8787
```

### Frontend build fails
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Database locked
```bash
# Stop backend
# Wait 5 seconds
# Restart backend
```

---

## 📝 Git Workflow

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "feat: description"

# Push
git push origin main

# Pull latest
git pull origin main
```

---

## 🔍 Debugging

### Check Backend Logs
```bash
# If running with systemd
sudo journalctl -u cantik-backend -f

# If running manually
# Logs appear in terminal
```

### Check Frontend Console
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

### Test API Directly
```bash
# Health check
curl http://localhost:8787/api/v2/health

# Get user sessions
curl http://localhost:8787/api/v2/chat/sessions/5
```

---

## 📚 Documentation Links

- [Phase 1: Initiation](./01-initiation/)
- [Phase 2: Planning](./02-planning/)
- [Phase 3: Development](./03-development/)
- [Phase 4: Testing](./04-testing/)
- [Phase 5: Deployment](./05-deployment/)
- [Phase 6: Maintenance](./06-maintenance/)

---

## 🎯 Current Status (v0.9.0)

- ✅ Core features complete
- ✅ Database relationships fixed
- ✅ User authentication implemented
- ✅ UI/UX polished
- ⏳ Ready for deployment

---

## 📞 Support

**Issues?** Check [Known Issues](./06-maintenance/known-issues.md)  
**Questions?** Review [Documentation](./README.md)  
**Deployment?** See [Deployment Guide](./05-deployment/deployment-guide.md)
