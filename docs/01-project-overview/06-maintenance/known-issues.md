# Known Issues & Technical Debt

## Current Issues (v0.9.0)

---

## 🔴 Critical Issues

### None Currently
All critical issues have been resolved in v0.9.0.

---

## 🟡 High Priority Issues

### 1. No API Rate Limiting
**Status:** Open  
**Priority:** High  
**Impact:** API abuse possible, cost implications

**Description:**
- Groq AI and Gemini API calls are not rate-limited
- Users can spam requests and exhaust API quotas
- No protection against DDoS or abuse

**Workaround:**
- Monitor API usage manually
- Use free-tier APIs with built-in limits

**Planned Fix:**
- Implement rate limiting middleware
- Add per-user request limits
- Add IP-based rate limiting
- Cache frequent requests

**Target Version:** 1.1.0

---

### 2. No Email Verification
**Status:** Open  
**Priority:** High  
**Impact:** Fake accounts possible, security risk

**Description:**
- Users can register with any email (not verified)
- No email confirmation required
- Potential for spam accounts

**Workaround:**
- Manual account review if needed
- Monitor for suspicious activity

**Planned Fix:**
- Implement email verification flow
- Send verification email on registration
- Require email confirmation before full access

**Target Version:** 1.1.0

---

### 3. No Password Reset
**Status:** Open  
**Priority:** High  
**Impact:** Users locked out if password forgotten

**Description:**
- No "Forgot Password" functionality
- Users cannot reset password themselves
- Manual intervention required

**Workaround:**
- Admin can manually reset passwords in database
- Users can create new account

**Planned Fix:**
- Implement password reset flow
- Send reset link via email
- Secure token-based reset

**Target Version:** 1.1.0

---

## 🟢 Medium Priority Issues

### 4. No Image Compression
**Status:** Open  
**Priority:** Medium  
**Impact:** Large file uploads, slow performance

**Description:**
- Uploaded images not compressed
- Large files (up to 10MB) stored as-is
- Slow upload/download times
- High storage usage

**Workaround:**
- Users manually compress images before upload
- 10MB size limit enforced

**Planned Fix:**
- Implement client-side image compression
- Resize images to max 1920px width
- Convert to WebP format
- Compress to ~200KB

**Target Version:** 1.2.0

---

### 5. No Analytics Tracking
**Status:** Open  
**Priority:** Medium  
**Impact:** No usage insights, hard to optimize

**Description:**
- No user behavior tracking
- No page view analytics
- No conversion tracking
- No error tracking

**Workaround:**
- Manual log analysis
- Server access logs

**Planned Fix:**
- Integrate Google Analytics 4
- Add custom event tracking
- Implement error tracking (Sentry)
- Add performance monitoring

**Target Version:** 1.2.0

---

### 6. SQLite Scalability Limits
**Status:** Open  
**Priority:** Medium  
**Impact:** Performance degradation at scale

**Description:**
- SQLite not ideal for high concurrency
- Single file database
- No horizontal scaling
- Write locks can cause bottlenecks

**Workaround:**
- Acceptable for MVP (<1000 concurrent users)
- Read-heavy workload performs well

**Planned Fix:**
- Migrate to PostgreSQL
- Implement connection pooling
- Add read replicas if needed

**Target Version:** 2.0.0

---

### 7. No CDN for Static Assets
**Status:** Open  
**Priority:** Medium  
**Impact:** Slower load times for distant users

**Description:**
- Static assets served from origin server
- No edge caching
- Higher latency for international users
- Higher bandwidth costs

**Workaround:**
- Nginx caching enabled
- Gzip compression enabled

**Planned Fix:**
- Integrate CloudFlare CDN
- Move images to S3/CloudFlare R2
- Enable edge caching

**Target Version:** 1.3.0

---

## 🔵 Low Priority Issues

### 8. No Unit Tests
**Status:** Open  
**Priority:** Low  
**Impact:** Harder to catch regressions

**Description:**
- No automated tests
- Manual testing only
- Risk of breaking changes

**Workaround:**
- Manual testing before deployment
- Careful code review

**Planned Fix:**
- Add Jest tests for frontend
- Add Pytest tests for backend
- Aim for 70% code coverage

**Target Version:** 1.4.0

---

### 9. No CI/CD Pipeline
**Status:** Open  
**Priority:** Low  
**Impact:** Manual deployment process

**Description:**
- Manual git pull and build
- No automated testing
- No automated deployment
- Higher risk of human error

**Workaround:**
- Deployment script created
- Manual execution

**Planned Fix:**
- Setup GitHub Actions
- Automated testing on PR
- Automated deployment on merge

**Target Version:** 1.4.0

---

### 10. Backend Port Non-Standard
**Status:** Open  
**Priority:** Low  
**Impact:** Minor confusion, non-standard setup

**Description:**
- Backend running on port 8787 (not 8000)
- Requires custom configuration
- Not following convention

**Workaround:**
- Documented in .env file
- Works fine, just non-standard

**Planned Fix:**
- Change to standard port 8000
- Update all configurations

**Target Version:** 1.0.0 (deployment)

---

## 🟣 Technical Debt

### 1. Code Duplication
**Location:** Frontend components  
**Impact:** Harder to maintain

**Description:**
- Some components have duplicated logic
- Styling code repeated across files
- API calls not fully abstracted

**Planned Refactor:**
- Extract common components
- Create utility functions
- Centralize API calls

**Target Version:** 1.5.0

---

### 2. Large Component Files
**Location:** `Chat.jsx` (1810 lines)  
**Impact:** Hard to read and maintain

**Description:**
- Chat.jsx is very large
- Multiple responsibilities in one file
- Hard to test individual parts

**Planned Refactor:**
- Split into smaller components
- Extract hooks
- Separate concerns

**Target Version:** 1.5.0

---

### 3. No API Documentation
**Status:** Open  
**Impact:** Hard for other developers to use API

**Description:**
- No OpenAPI/Swagger docs
- API endpoints not documented
- Request/response formats unclear

**Planned Fix:**
- Add FastAPI automatic docs
- Document all endpoints
- Add example requests/responses

**Target Version:** 1.3.0

---

### 4. Hardcoded Strings
**Location:** Throughout codebase  
**Impact:** Hard to internationalize

**Description:**
- UI text hardcoded in components
- No i18n support
- All text in Indonesian

**Planned Fix:**
- Extract strings to constants
- Implement i18n library
- Support multiple languages

**Target Version:** 2.0.0

---

## 📋 Resolved Issues

### ✅ Chat Message Isolation (v0.9.0)
**Resolved:** 2026-03-03  
**Fix:** Updated Chat.jsx to use cantik_user_id, verified backend filtering

### ✅ Database Foreign Keys (v0.9.0)
**Resolved:** 2026-03-03  
**Fix:** Added foreign keys, changed user_id to INTEGER, cleaned orphan data

### ✅ User ID Type Inconsistency (v0.9.0)
**Resolved:** 2026-03-03  
**Fix:** Unified user_id as INTEGER across frontend and backend

### ✅ Navigation UI Proportions (v0.9.0)
**Resolved:** 2026-03-03  
**Fix:** Redesigned navigation with glassmorphism, proper alignment

### ✅ Backend URL Configuration (v0.9.0)
**Resolved:** 2026-03-03  
**Fix:** Updated .env to point to correct port (8787)

---

## 🎯 Issue Tracking

### By Priority
- 🔴 Critical: 0
- 🟡 High: 3
- 🟢 Medium: 5
- 🔵 Low: 3
- 🟣 Technical Debt: 4

### By Status
- Open: 15
- In Progress: 0
- Resolved: 5

### By Target Version
- v1.0.0: 1 issue
- v1.1.0: 3 issues
- v1.2.0: 2 issues
- v1.3.0: 2 issues
- v1.4.0: 2 issues
- v1.5.0: 2 issues
- v2.0.0: 2 issues
- Backlog: 1 issue

---

**Document Status:** 🟢 Active  
**Last Updated:** 2026-03-03  
**Next Review:** Before v1.0.0 deployment
