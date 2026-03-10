# Phase 1: Requirements Document (PRD)

## Product Requirements Document (PRD)

### Document Information
- **Version:** 1.2
- **Last Updated:** 2026-03-03
- **Status:** Approved
- **Owner:** Raymaizing

---

## 1. Functional Requirements

### 1.1 User Authentication
- **FR-001:** User dapat register dengan email, username, password
- **FR-002:** User dapat login dengan email/username
- **FR-003:** User dapat logout dari aplikasi
- **FR-004:** System menyimpan user session di localStorage
- **FR-005:** Protected routes redirect ke login jika belum authenticated

**Priority:** P0 (Critical)  
**Status:** ✅ Implemented

---

### 1.2 Skin Analysis (Core Feature)
- **FR-010:** User dapat upload foto wajah untuk analisis
- **FR-011:** System menggunakan AI untuk detect wajah
- **FR-012:** System menganalisis kondisi kulit (acne, dark spots, wrinkles, dll)
- **FR-013:** System memberikan skor kesehatan kulit (0-100)
- **FR-014:** System menyimpan hasil analisis ke database
- **FR-015:** User dapat melihat history analisis

**Priority:** P0 (Critical)  
**Status:** ✅ Implemented

**AI Models Used:**
- Google Gemini 2.0 Flash (image analysis)
- Groq Llama 3.1 (text processing)

---

### 1.3 AI Chat Assistant
- **FR-020:** User dapat chat dengan AI assistant
- **FR-021:** AI dapat menjawab pertanyaan tentang skincare
- **FR-022:** Chat history disimpan per user (isolated)
- **FR-023:** User dapat create multiple chat sessions
- **FR-024:** User dapat delete chat sessions
- **FR-025:** AI memberikan suggested follow-up questions
- **FR-026:** Support 3 chat modes: Fast, Thinking, Pro

**Priority:** P0 (Critical)  
**Status:** ✅ Implemented

**Chat Modes:**
- **Fast:** Llama 3.1 8B Instant (quick responses)
- **Thinking:** GPT OSS 20B (deeper analysis)
- **Pro:** Groq Compound (best quality)

---

### 1.4 Product Recommendations
- **FR-030:** System merekomendasikan produk berdasarkan analisis
- **FR-031:** Admin dapat manage produk (CRUD)
- **FR-032:** User dapat view detail produk
- **FR-033:** Produk memiliki kategori (cleanser, toner, moisturizer, dll)

**Priority:** P1 (High)  
**Status:** ✅ Implemented

---

### 1.5 Educational Content
- **FR-040:** System menyediakan artikel edukasi skincare
- **FR-041:** Admin dapat manage artikel (CRUD)
- **FR-042:** User dapat read artikel
- **FR-043:** Artikel memiliki kategori dan tags

**Priority:** P2 (Medium)  
**Status:** ✅ Implemented

---

### 1.6 User Profile
- **FR-050:** User dapat view profile mereka
- **FR-051:** User dapat update profile (nama, age, gender, skin type)
- **FR-052:** User dapat view analysis history
- **FR-053:** User dapat logout dari profile page

**Priority:** P1 (High)  
**Status:** ✅ Implemented

---

### 1.7 Admin Dashboard
- **FR-060:** Admin dapat login ke dashboard
- **FR-061:** Admin dapat manage users (view, edit, delete)
- **FR-062:** Admin dapat manage products (CRUD)
- **FR-063:** Admin dapat manage articles (CRUD)
- **FR-064:** Admin dapat manage banners (CRUD)
- **FR-065:** Admin dapat view analytics

**Priority:** P1 (High)  
**Status:** ✅ Implemented

---

## 2. Non-Functional Requirements

### 2.1 Performance
- **NFR-001:** Page load time < 3 seconds
- **NFR-002:** AI analysis response time < 10 seconds
- **NFR-003:** Chat response time < 5 seconds
- **NFR-004:** API response time < 2 seconds
- **NFR-005:** Support 100 concurrent users

**Status:** 🟡 Partially met (optimization ongoing)

---

### 2.2 Security
- **NFR-010:** Password hashing dengan bcrypt
- **NFR-011:** SQL injection prevention (SQLAlchemy ORM)
- **NFR-012:** XSS protection (React default)
- **NFR-013:** HTTPS untuk production
- **NFR-014:** API rate limiting
- **NFR-015:** User data privacy compliance

**Status:** 🟡 Partially implemented (HTTPS pending deployment)

---

### 2.3 Scalability
- **NFR-020:** Database design support horizontal scaling
- **NFR-021:** Stateless API design
- **NFR-022:** CDN untuk static assets
- **NFR-023:** Image optimization (WebP format)
- **NFR-024:** Lazy loading untuk images

**Status:** ✅ Implemented

---

### 2.4 Usability
- **NFR-030:** Mobile-first responsive design
- **NFR-031:** Support screen sizes 320px - 1920px
- **NFR-032:** Touch-friendly UI (min 44px tap targets)
- **NFR-033:** Loading indicators untuk async operations
- **NFR-034:** Error messages yang user-friendly
- **NFR-035:** Bahasa Indonesia untuk UI

**Status:** ✅ Implemented

---

### 2.5 Reliability
- **NFR-040:** Uptime target 99.5%
- **NFR-041:** Graceful error handling
- **NFR-042:** Automatic retry untuk failed API calls
- **NFR-043:** Database backup daily
- **NFR-044:** Error logging dan monitoring

**Status:** ⏳ Pending (deployment phase)

---

### 2.6 Maintainability
- **NFR-050:** Code documentation
- **NFR-051:** Git version control
- **NFR-052:** Modular code structure
- **NFR-053:** API documentation (OpenAPI/Swagger)
- **NFR-054:** Database migration scripts

**Status:** ✅ Implemented

---

## 3. User Stories

### Epic 1: Skin Analysis
- **US-001:** As a user, I want to upload my face photo so that I can get skin analysis
- **US-002:** As a user, I want to see my skin health score so that I know my skin condition
- **US-003:** As a user, I want to see detected skin issues so that I can address them
- **US-004:** As a user, I want to view my analysis history so that I can track progress

### Epic 2: AI Chat
- **US-010:** As a user, I want to chat with AI so that I can ask skincare questions
- **US-011:** As a user, I want to create multiple chat sessions so that I can organize topics
- **US-012:** As a user, I want to delete old chats so that I can keep my chat list clean
- **US-013:** As a user, I want suggested questions so that I know what to ask

### Epic 3: Product Discovery
- **US-020:** As a user, I want to see recommended products so that I can find suitable skincare
- **US-021:** As a user, I want to view product details so that I can make informed decisions
- **US-022:** As a user, I want to filter products by category so that I can find specific items

### Epic 4: Education
- **US-030:** As a user, I want to read skincare articles so that I can learn about skincare
- **US-031:** As a user, I want to browse articles by category so that I can find relevant content

---

## 4. Acceptance Criteria

### Feature: Skin Analysis
- ✅ User can upload image (max 10MB)
- ✅ System detects face in image
- ✅ System returns analysis within 10 seconds
- ✅ Analysis includes: score, detected issues, recommendations
- ✅ Analysis saved to database with user_id
- ✅ User can view history of analyses

### Feature: AI Chat
- ✅ User can send text messages
- ✅ AI responds within 5 seconds
- ✅ Chat history persists across sessions
- ✅ Different users see different chat history (isolation)
- ✅ User can create/delete sessions
- ✅ Suggested questions appear after AI response

### Feature: User Authentication
- ✅ User can register with email/username/password
- ✅ User can login with email
- ✅ User can logout
- ✅ Protected routes redirect to login
- ✅ User session persists in localStorage

---

## 5. Out of Scope (Future Roadmap)

### Phase 2 Features (Post-MVP)
- ❌ Social features (share results, follow friends)
- ❌ E-commerce integration (buy products in-app)
- ❌ Video consultation with dermatologists
- ❌ Gamification (badges, points, challenges)
- ❌ Mobile native apps (iOS/Android)
- ❌ Multi-language support (English, etc)
- ❌ Premium subscription features
- ❌ AR try-on for products

---

**Document Status:** ✅ Approved  
**Sign-off:** Raymaizing (Product Owner)  
**Date:** 2026-03-03
