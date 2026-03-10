# Phase 2: System Architecture

## 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React + Vite (Frontend)                                  │   │
│  │  - Mobile-first responsive UI                             │   │
│  │  - State management (React hooks)                         │   │
│  │  - Client-side routing (React Router)                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Python FastAPI (Backend)                                 │   │
│  │  - RESTful API endpoints                                  │   │
│  │  - Authentication & Authorization                         │   │
│  │  - Business logic                                         │   │
│  │  - File upload handling                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         AI LAYER                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐   │
│  │  Groq AI       │  │ Google Gemini  │  │  n8n Workflows  │   │
│  │  - Chat        │  │ - Image        │  │  - Automation   │   │
│  │  - Text Gen    │  │   Analysis     │  │  - Integration  │   │
│  └────────────────┘  └────────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  SQLite Database                                          │   │
│  │  - Users, Analyses, Products, Articles                    │   │
│  │  - Chat Sessions & Messages                               │   │
│  │  - Admin data                                             │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2.2 Technology Stack

### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite 6.0.5
- **Routing:** React Router DOM 7.1.1
- **UI Components:** Custom components + Lucide React (icons)
- **Styling:** CSS3 (custom variables, glassmorphism)
- **State Management:** React Hooks (useState, useEffect, useRef)
- **HTTP Client:** Fetch API
- **Markdown:** React Markdown + Remark GFM

### Backend
- **Framework:** FastAPI 0.115.12
- **Language:** Python 3.10+
- **ORM:** SQLAlchemy 2.0.36
- **Database:** SQLite 3
- **Authentication:** Bcrypt (password hashing)
- **CORS:** FastAPI CORS middleware
- **File Handling:** Python-multipart
- **Server:** Uvicorn (ASGI server)

### AI & External Services
- **Groq AI:** Chat completion, text generation
  - Models: llama-3.1-8b-instant, gpt-oss-20b, groq/compound
- **Google Gemini:** Image analysis, vision AI
  - Model: gemini-2.0-flash-exp
- **n8n:** Workflow automation (optional)

### DevOps & Deployment
- **Version Control:** Git + GitHub
- **Package Manager:** npm (frontend), pip (backend)
- **Environment:** .env files for configuration
- **Deployment Target:** VPS (Linux)
- **Web Server:** Nginx (reverse proxy)
- **Process Manager:** systemd / PM2

---

## 2.3 Component Architecture

### Frontend Components Structure
```
src/
├── components/
│   ├── BottomNav.jsx           # Navigation bar
│   ├── MetricCard.jsx          # Analysis metric display
│   ├── AIInsights.jsx          # AI insights component
│   ├── admin/                  # Admin components
│   │   ├── UsersManagement.jsx
│   │   ├── ProductsManagement.jsx
│   │   ├── ArticlesManagement.jsx
│   │   └── BannersManagement.jsx
│   └── scanner/                # Scanner components
│       ├── ControlButtons.jsx
│       ├── OvalFrame.jsx
│       └── StatusIndicators.jsx
├── pages/
│   ├── Home.jsx                # Landing page
│   ├── Login.jsx               # Authentication
│   ├── ScannerEnhanced.jsx     # Skin analysis
│   ├── AnalysisResult.jsx      # Results display
│   ├── Chat.jsx                # AI chat
│   ├── History.jsx             # Analysis history
│   ├── Products.jsx            # Product catalog
│   ├── Education.jsx           # Articles
│   ├── Profile.jsx             # User profile
│   ├── AdminLogin.jsx          # Admin auth
│   └── AdminDashboard.jsx      # Admin panel
├── services/
│   ├── aiService.js            # AI API calls
│   ├── analysisService.js      # Analysis logic
│   ├── geminiService.js        # Gemini integration
│   └── n8nService.js           # n8n integration
└── utils/
    └── faceDetectionHelpers.js # Face detection utils
```

### Backend API Structure
```
backend-python/
├── app/
│   ├── main.py                 # FastAPI app entry
│   ├── database.py             # DB connection
│   ├── models/                 # SQLAlchemy models
│   │   ├── user.py
│   │   ├── analysis.py
│   │   ├── product.py
│   │   ├── admin.py
│   │   ├── banner.py
│   │   └── chat.py
│   └── api/
│       ├── routes.py           # Main API routes
│       └── chat_routes.py      # Chat API routes
└── cantik_ai.db                # SQLite database
```

---

## 2.4 API Architecture

### RESTful API Endpoints

#### Authentication
- `POST /api/v2/users/create` - Register user
- `GET /api/v2/users/email/{email}` - Get user by email
- `POST /api/v2/admins/login` - Admin login

#### Skin Analysis
- `POST /api/v2/analyses` - Create analysis
- `GET /api/v2/analyses/user/{user_id}` - Get user analyses
- `GET /api/v2/analyses/{analysis_id}` - Get analysis detail

#### Chat
- `POST /api/v2/chat/sessions` - Create chat session
- `GET /api/v2/chat/sessions/{user_id}` - Get user sessions
- `GET /api/v2/chat/sessions/detail/{session_id}` - Get session detail
- `POST /api/v2/chat/sessions/{session_id}/messages` - Add message
- `PUT /api/v2/chat/sessions/{session_id}/title` - Update title
- `DELETE /api/v2/chat/sessions/{session_id}` - Delete session

#### Products
- `GET /api/v2/products` - List products
- `POST /api/v2/products` - Create product (admin)
- `PUT /api/v2/products/{id}` - Update product (admin)
- `DELETE /api/v2/products/{id}` - Delete product (admin)

#### Articles
- `GET /api/v2/articles` - List articles
- `POST /api/v2/articles` - Create article (admin)
- `PUT /api/v2/articles/{id}` - Update article (admin)
- `DELETE /api/v2/articles/{id}` - Delete article (admin)

#### Banners
- `GET /api/v2/banners` - List banners
- `POST /api/v2/banners` - Create banner (admin)
- `DELETE /api/v2/banners/{id}` - Delete banner (admin)

---

## 2.5 Data Flow

### Skin Analysis Flow
```
1. User uploads photo (Frontend)
   ↓
2. Image sent to Backend API
   ↓
3. Backend calls Google Gemini API
   ↓
4. Gemini analyzes image → returns JSON
   ↓
5. Backend processes results
   ↓
6. Save to database (analyses table)
   ↓
7. Return results to Frontend
   ↓
8. Display results to user
```

### Chat Flow
```
1. User sends message (Frontend)
   ↓
2. Check if session exists
   ↓ (if not)
3. Create new session in DB
   ↓
4. Save user message to DB
   ↓
5. Send conversation history to Groq API
   ↓
6. Groq generates response
   ↓
7. Save AI response to DB
   ↓
8. Return response to Frontend
   ↓
9. Display in chat UI
```

---

## 2.6 Security Architecture

### Authentication Flow
```
1. User enters email/password
   ↓
2. Backend checks if user exists
   ↓ (if not)
3. Create new user with hashed password
   ↓
4. Return user data (without password)
   ↓
5. Frontend saves user_id to localStorage
   ↓
6. Subsequent requests include user_id
```

### Data Protection
- **Password:** Bcrypt hashing (never stored plain text)
- **API Keys:** Stored in .env (not in code)
- **User Data:** Isolated per user (foreign keys enforced)
- **File Upload:** Size limits, type validation
- **SQL Injection:** Prevented by SQLAlchemy ORM
- **XSS:** Prevented by React default escaping

---

## 2.7 Scalability Considerations

### Current Architecture (MVP)
- **Database:** SQLite (single file)
- **Server:** Single VPS instance
- **Concurrent Users:** ~100

### Future Scaling Path
1. **Database Migration:** SQLite → PostgreSQL
2. **Horizontal Scaling:** Load balancer + multiple app servers
3. **Caching:** Redis for session/API cache
4. **CDN:** CloudFlare for static assets
5. **Object Storage:** S3/MinIO for images
6. **Microservices:** Separate AI service from main API

---

**Document Status:** ✅ Approved  
**Last Updated:** 2026-03-03  
**Version:** 1.0
