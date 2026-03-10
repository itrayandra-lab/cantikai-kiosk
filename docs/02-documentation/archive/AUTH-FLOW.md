# 🔐 Authentication Flow - Cantik AI

## User Types

### 1. Guest User (Tidak Login)
**Bisa**:
- ✅ Scan wajah
- ✅ Lihat hasil analisis
- ✅ Lihat products
- ✅ Lihat education/articles

**Tidak Bisa**:
- ❌ Save analisis ke profil
- ❌ Lihat riwayat analisis
- ❌ Chat dengan AI
- ❌ Akses profile page

**Behavior**:
- Saat scan, hasil ditampilkan tapi tidak disimpan ke database
- Saat klik "Simpan ke Profil" → Prompt login
- Saat akses History → Prompt login
- Saat akses Chat → Redirect ke login
- Saat akses Profile → Redirect ke login

### 2. Logged In User
**Bisa**:
- ✅ Semua fitur guest
- ✅ Save analisis ke database
- ✅ Lihat riwayat analisis
- ✅ Chat dengan AI
- ✅ Edit profile
- ✅ Track progress

## Implementation

### Files Created
1. `platforms/pwa/src/utils/auth.js` - Auth utilities
2. `platforms/pwa/src/components/LoginPrompt.jsx` - Login prompt modal

### Files Updated
1. `platforms/pwa/src/components/ProtectedRoute.jsx` - Use auth utils
2. `platforms/pwa/src/pages/History.jsx` - Show login prompt for guests
3. `platforms/pwa/src/pages/AnalysisResult.jsx` - Guest detail lock + unlock prompt
4. `platforms/pwa/src/pages/Login.jsx` - Login/Register + Google Sign-In
5. `platforms/pwa/src/pages/Chat.jsx` - Protected route + guest token policy
6. `platforms/pwa/src/pages/Profile.jsx` - Logout and profile update sync
7. `backend/src/index.js` - Password hash auth, JWT, Google auth endpoint

## Flow Diagram

```
User Opens App
    │
    ├─→ Guest Mode (default)
    │   ├─→ Can scan & view results
    │   ├─→ Can browse products/articles
    │   └─→ Prompted to login for:
    │       ├─ Save analysis
    │       ├─ View history
    │       └─ Chat with AI
    │
    └─→ Logged In Mode
        ├─→ All guest features
        └─→ Plus:
            ├─ Auto-save analysis
            ├─ View history
            ├─ Chat with AI
            └─ Profile management
```

## Auth Functions

### `isAuthenticated()`
Returns `true` if user is logged in (not guest)

### `isGuestSession()`
Returns `true` if current session is guest

### `getCurrentUserId()`
Returns user ID (guest or real)

### `loginUser({ user, token })`
Store user data + JWT token after successful login

### `logoutUser()`
Clear user data

### `promptLogin(message)`
Show login prompt with custom message

## Database Behavior

### Guest User
- Analysis NOT saved to database
- Stored temporarily in sessionStorage
- Lost after browser close

### Logged In User
- Analysis auto-saved to database
- Linked to user_id
- Persistent across sessions

## Current Status

1. ✅ Guest session + token policy
2. ✅ Login/Register (email + password)
3. ✅ Google Sign-In endpoint + UI integration
4. ✅ Protected routes (history/chat/profile)
5. ✅ AnalysisResult guest lock + login prompt
6. ✅ Admin login with hashed password
7. ⏳ End-to-end QA on browser/device

## Testing Checklist

### Guest Flow
- [ ] Open app without login
- [ ] Scan face → See results
- [ ] Try to save → See login prompt
- [ ] Go to History → See login prompt
- [ ] Go to Chat → Redirect to login
- [ ] Go to Profile → Redirect to login

### Login Flow
- [ ] Click login from prompt
- [ ] Register akun baru (email + password)
- [ ] Login akun existing (email + password)
- [ ] Login via Google (jika env Google sudah diset)
- [ ] Redirect back to intended page
- [ ] Scan face → Auto-saved
- [ ] View history → See saved analyses
- [ ] Chat works
- [ ] Profile accessible

### Logout Flow
- [ ] Logout from profile
- [ ] Become guest again
- [ ] Features restricted properly
