# Phase 6: Changelog

## Version History

---

## [0.9.0] - 2026-03-03 (Current)

### 🎯 Major Changes
- **Database Relationships Fixed**
  - Added foreign key: `chat_sessions.user_id` → `users.id`
  - Added foreign key: `chat_messages.session_id` → `chat_sessions.id`
  - Changed `user_id` type from VARCHAR to INTEGER
  - Implemented CASCADE DELETE for data integrity
  - Cleaned 50 orphan messages from database

- **User Authentication System**
  - Implemented login page with email authentication
  - Added logout functionality in Profile page
  - Created protected routes (Chat, History, Profile)
  - Unified user ID system across all pages

- **Chat Message Isolation**
  - Fixed chat session filtering per user
  - Verified isolation working correctly
  - Each user only sees their own chat history

### 🎨 UI/UX Improvements
- **Navigation Redesign**
  - Implemented glassmorphism design
  - Center button: 95px, elevated, gradient background
  - Added vertical dividers on sides of center button
  - Improved label alignment (Home, Analyze, Chat)
  - Transparent background with blur effect

- **Profile Page Enhancement**
  - Inline edit functionality with form fields
  - Statistics display (total scans, average score, latest score)
  - Glassmorphism styling matched with Home page
  - Skin health card with circular progress ring
  - Last analysis summary card
  - Quick action buttons with hover effects

- **Chat Page Improvements**
  - Fixed top padding (80px → 20px)
  - Reduced floating recommendation buttons size
  - Improved button positioning (bottom: 125px)
  - Better spacing and proportions

### 🐛 Bug Fixes
- Fixed backend URL configuration (.env: port 8000 → 8787)
- Fixed user ID type inconsistency across frontend/backend
- Fixed chat session creation logic
- Fixed navigation layout proportions
- Fixed text alignment in navigation items

### 📝 Documentation
- Created comprehensive project overview structure
- Documented all 6 development phases
- Added sprint logs and feature implementations
- Created deployment guide
- Added database design documentation

### 🔧 Technical Improvements
- SQLAlchemy models updated with proper relationships
- API routes updated to use integer user_id
- Frontend Chat.jsx updated to convert user_id to integer
- Database migration script created and executed
- Added PUT /api/v2/users/{user_id} endpoint for profile updates
- Profile page statistics calculation from analysis history

---

## [0.8.0] - 2026-02-28

### ✨ New Features
- **AI Chat Assistant**
  - 3 chat modes: Fast, Thinking, Pro
  - Multiple chat sessions per user
  - Suggested follow-up questions
  - Voice input support (Indonesian)
  - Markdown rendering for AI responses

- **Banner System**
  - Auto-rotating carousel (5s interval)
  - Admin management (CRUD)
  - Touch swipe support
  - Display on Home and Chat pages

### 🎨 UI/UX
- Glassmorphism design system
- Pink/purple color theme
- Loading indicators
- Error handling UI
- Toast notifications

### 🐛 Bug Fixes
- Fixed API rate limit handling
- Fixed mobile camera permissions
- Fixed image upload size validation

---

## [0.7.0] - 2026-02-20

### ✨ New Features
- **Admin Dashboard**
  - Users management
  - Products management
  - Articles management
  - Banners management
  - Analyses management

- **Product Catalog**
  - Product listing with filtering
  - Category-based organization
  - Product details display

- **Educational Content**
  - Article listing
  - Markdown support
  - Category filtering

### 🔧 Technical
- Separate admin authentication
- CRUD operations for all entities
- Image URL storage for products/banners

---

## [0.6.0] - 2026-02-10

### ✨ New Features
- **Skin Analysis**
  - Camera capture interface
  - Face detection with oval guide
  - Google Gemini 2.0 Flash integration
  - 7 metrics analysis
  - Results display with color coding
  - Analysis history

### 🎨 UI/UX
- Scanner page with camera controls
- Analysis result page with metric cards
- History page with timeline view

### 🐛 Bug Fixes
- Fixed face detection accuracy
- Fixed Gemini API response parsing
- Fixed mobile camera orientation

---

## [0.5.0] - 2026-02-01

### ✨ New Features
- **User Profile**
  - Profile information display
  - Edit profile functionality
  - Analysis statistics
  - Skin type selection

### 🔧 Technical
- User model with profile fields
- Profile update API endpoint
- Form validation

---

## [0.4.0] - 2026-01-25

### ✨ New Features
- **User Authentication**
  - Registration with email/username/password
  - Login functionality
  - Password hashing with bcrypt
  - Session management with localStorage

### 🔧 Technical
- User model created
- Authentication API endpoints
- Password security implemented

---

## [0.3.0] - 2026-01-15

### 🔧 Technical Setup
- FastAPI backend initialized
- SQLite database setup
- SQLAlchemy ORM configured
- CORS middleware configured
- Basic API structure

---

## [0.2.0] - 2026-01-10

### 🔧 Technical Setup
- React + Vite project initialized
- React Router configured
- Basic component structure
- CSS variables for theming
- Lucide React icons integrated

---

## [0.1.0] - 2026-01-05

### 🎯 Project Initialization
- Project requirements defined
- Tech stack selected
- Git repository created
- Development environment setup
- Initial project structure

---

## Upcoming Releases

### [1.0.0] - TBD (Production Release)
- [ ] VPS deployment
- [ ] SSL certificate
- [ ] Domain configuration
- [ ] Production environment setup
- [ ] Monitoring and logging
- [ ] Performance optimization
- [ ] Security audit
- [ ] User acceptance testing

### [1.1.0] - Future
- [ ] Email verification
- [ ] Password reset
- [ ] API rate limiting
- [ ] Image compression
- [ ] CDN integration
- [ ] Analytics tracking
- [ ] Push notifications

### [2.0.0] - Future
- [ ] E-commerce integration
- [ ] Payment gateway
- [ ] Social features
- [ ] Video consultation
- [ ] Mobile native apps
- [ ] Multi-language support
- [ ] Premium features

---

## Breaking Changes

### 0.9.0
- **Database Schema Change:** `chat_sessions.user_id` changed from VARCHAR to INTEGER
  - **Migration Required:** Run `fix_database_relationships.py`
  - **Impact:** All existing sessions migrated automatically
  - **Action:** No user action required

### 0.8.0
- **API Endpoint Change:** Chat endpoints moved from `/api/chat/*` to `/api/v2/chat/*`
  - **Impact:** Frontend updated automatically
  - **Action:** No user action required

---

## Known Issues

### Current (0.9.0)
- [ ] No API rate limiting implemented
- [ ] No email verification
- [ ] No password reset functionality
- [ ] No image compression on upload
- [ ] No analytics tracking
- [ ] Backend running on port 8787 (not standard 8000)

### Resolved
- ✅ Chat message isolation (fixed in 0.9.0)
- ✅ Database foreign keys (fixed in 0.9.0)
- ✅ User ID type inconsistency (fixed in 0.9.0)
- ✅ Navigation UI proportions (fixed in 0.9.0)
- ✅ Backend URL configuration (fixed in 0.9.0)

---

**Document Status:** 🟢 Active  
**Last Updated:** 2026-03-03  
**Current Version:** 0.9.0 (Pre-Production)  
**Next Release:** 1.0.0 (Production)
