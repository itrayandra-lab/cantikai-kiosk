# System Architecture

## High-Level Structure
```
Frontend (React + Vite) → Backend (FastAPI) → Database (SQLite) → AI Services (Gemini, Groq)
```

## Source Code Paths

### Frontend (`src/`)
```
src/
├── components/          # Reusable UI components
│   ├── BottomNav.jsx   # Navigation (glassmorphism)
│   ├── MetricCard.jsx  # Analysis metric display
│   └── admin/          # Admin-specific components
├── pages/              # Route-level components
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # Authentication
│   ├── ScannerEnhanced.jsx  # Camera interface
│   ├── AnalysisResult.jsx   # Results display
│   ├── Chat.jsx        # AI chat (1810 lines)
│   ├── History.jsx     # Analysis history
│   ├── Profile.jsx     # User profile (620 lines)
│   ├── Products.jsx    # Product catalog
│   ├── Education.jsx   # Articles
│   └── AdminDashboard.jsx  # Admin panel
├── services/           # API integration
│   ├── geminiService.js     # Gemini API
│   └── aiService.js         # Groq API
└── App.jsx             # Root component with routing
```

### Backend (`backend-python/`)
```
backend-python/
├── app/
│   ├── api/
│   │   ├── routes.py        # Main API endpoints
│   │   └── chat_routes.py   # Chat-specific endpoints
│   ├── models/
│   │   ├── user.py          # User model
│   │   ├── analysis.py      # Analysis model
│   │   ├── chat.py          # Chat models
│   │   ├── product.py       # Product model
│   │   └── admin.py         # Admin models
│   └── database.py          # SQLAlchemy setup
├── cantik_ai.db             # SQLite database
└── main.py                  # FastAPI entry point
```

## Key Technical Decisions

### 1. Database Relationships
**Decision:** Enforce foreign keys with CASCADE DELETE  
**Why:** Data integrity, automatic cleanup  
**Implementation:**
```sql
users (id) → analyses (user_id) [CASCADE]
users (id) → chat_sessions (user_id) [CASCADE]
chat_sessions (id) → chat_messages (session_id) [CASCADE]
```

### 2. User ID Type
**Decision:** INTEGER (not VARCHAR)  
**Why:** Performance, consistency, proper foreign keys  
**Impact:** All frontend pages convert `localStorage.getItem('cantik_user_id')` to `parseInt(userId, 10)`

### 3. AI Model Selection
**Decision:** Google Gemini 2.0 Flash for analysis, Groq for chat  
**Why:**
- Gemini: Accurate image analysis, structured output (JSON schema)
- Groq: Fast responses, multiple models, cost-effective

### 4. Session Management
**Decision:** localStorage (no JWT yet)  
**Why:** MVP simplicity, can upgrade to JWT in Phase 2  
**Storage:** `cantik_user_id`, `userName`, `userEmail`

### 5. Glassmorphism Design
**Decision:** Custom CSS (no UI library)  
**Why:** Full control, lightweight, unique look  
**Pattern:**
```javascript
style={{
    background: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(25px)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.6)',
    boxShadow: '0 8px 32px rgba(157, 90, 118, 0.1)'
}}
```

## Design Patterns

### Repository Pattern (Backend)
Separate data access from business logic
```python
# models/user.py - Data model
class User(Base):
    __tablename__ = "users"
    # ...

# api/routes.py - API layer
@router.get("/users/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    return user.to_dict()
```

### Component-Based (Frontend)
Reusable, maintainable UI components
- Pages: Route-level components
- Components: Reusable UI elements
- Services: API integration layer

### Protected Routes
Secure pages requiring authentication
```javascript
<Route path="/chat" element={
    <ProtectedRoute>
        <Chat />
    </ProtectedRoute>
} />
```

## API Design

### RESTful Endpoints
```
# User
GET    /api/v2/users/{user_id}
PUT    /api/v2/users/{user_id}
POST   /api/v2/users/create
GET    /api/v2/users/email/{email}

# Analysis
POST   /api/v2/analyze/full
GET    /api/v2/analysis/history/{user_id}
POST   /api/v2/analysis/save

# Chat
POST   /api/v2/chat/sessions
GET    /api/v2/chat/sessions/{user_id}
POST   /api/v2/chat/message
GET    /api/v2/chat/messages/{session_id}

# Content
GET    /api/v2/products
GET    /api/v2/articles
GET    /api/v2/banners
```

### Response Format
```json
{
    "success": true,
    "data": { /* payload */ },
    "message": "Operation successful"
}
```

## Critical Implementation Paths

### Skin Analysis Flow
1. User captures image → `ScannerEnhanced.jsx`
2. Image sent to Gemini API → `geminiService.js`
3. Structured output (JSON schema) → 7 metrics
4. Results displayed → `AnalysisResult.jsx`
5. Saved to database → `POST /api/v2/analysis/save`

### Chat Flow
1. User sends message → `Chat.jsx`
2. Message saved → `POST /api/v2/chat/message`
3. Context built (last 10 messages) → `aiService.js`
4. Groq API called → Response streamed
5. Assistant message saved → Database

### Authentication Flow
1. User enters email/password → `Login.jsx`
2. Check user exists → `GET /api/v2/users/email/{email}`
3. Verify password (bcrypt) → Backend
4. Store user_id → `localStorage.setItem('cantik_user_id', id)`
5. Redirect to home → Protected routes accessible

## Component Relationships

### Navigation Flow
```
App.jsx (Router)
  ├─ Home.jsx → BottomNav
  ├─ ScannerEnhanced.jsx → AnalysisResult.jsx
  ├─ Chat.jsx → BottomNav
  ├─ History.jsx → AnalysisResult.jsx (view detail)
  └─ Profile.jsx → BottomNav
```

### Data Flow
```
User Action → Component → Service → API → Database
                ↓
         State Update → Re-render
```
