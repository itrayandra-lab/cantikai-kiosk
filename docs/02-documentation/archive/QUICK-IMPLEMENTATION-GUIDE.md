# ⚡ Quick Implementation Guide - Copy & Paste

## 🎯 Goal
- Guest: Lihat score & summary saja (detail blur/lock)
- Guest: 3 analisis/hari limit
- Logged in: Unlimited & full access

## 📋 Step-by-Step Implementation

### Step 1: Update App.jsx (Add Token Cleanup)

**File**: `platforms/pwa/src/App.jsx`

**Add at top**:
```javascript
import { useEffect } from 'react';
import { cleanOldTokens } from './utils/tokenSystem';
```

**Add inside App function**:
```javascript
function App() {
    // Clean old tokens on app start
    useEffect(() => {
        cleanOldTokens();
    }, []);
    
    return (
        // ... rest of code
    );
}
```

---

### Step 2: Update Scanner (Token Check Before Scan)

**File**: `platforms/pwa/src/pages/ScannerEnhanced.jsx`

**Add imports**:
```javascript
import { isAuthenticated, isGuestSession } from '../utils/auth';
import { checkAndUseToken, getTokenInfo } from '../utils/tokenSystem';
```

**Find `handleCapture` function and add at the beginning**:
```javascript
const handleCapture = async () => {
    // TOKEN CHECK
    const guest = !isAuthenticated() || isGuestSession();
    const tokenCheck = checkAndUseToken('analysis', guest);
    
    if (!tokenCheck.success) {
        alert(tokenCheck.message);
        if (guest && window.confirm('Login untuk unlimited scan?')) {
            navigate('/login');
        }
        return;
    }
    
    // ... rest of capture code
};
```

---

### Step 3: Update AnalysisResult (Show Locked Content for Guest)

**File**: `platforms/pwa/src/pages/AnalysisResult.jsx`

**Already added imports** ✅

**Find the render section (around line 700+) and wrap content**:

```javascript
return (
    <div className="app-container">
        {/* Login Prompt Modal */}
        {showLoginPrompt && (
            <LoginPrompt
                message="Login untuk melihat analisis lengkap dan menyimpan riwayat"
                feature="Analisis Lengkap"
                onClose={() => setShowLoginPrompt(false)}
            />
        )}
        
        {/* Token Info Banner for Guest */}
        {isGuest && tokenInfo && !loading && (
            <div style={{
                background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
                padding: '12px 16px',
                borderRadius: '12px',
                margin: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <span style={{ fontSize: '1.5rem' }}>🎫</span>
                <div style={{ flex: 1, fontSize: '0.9rem' }}>
                    <strong>Token Analisis:</strong> {tokenInfo.message}
                </div>
                <button
                    onClick={() => setShowLoginPrompt(true)}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'var(--primary-color)',
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Upgrade
                </button>
            </div>
        )}
        
        {/* ... loading states ... */}
        
        {/* RESULTS SECTION */}
        {!loading && resultData && (
            <div className="screen-content">
                {/* Overall Score - ALWAYS SHOW */}
                {showOverallScore && (
                    <div>{/* Score display */}</div>
                )}
                
                {/* Summary - ALWAYS SHOW */}
                <div>{/* Summary */}</div>
                
                {/* GUEST: Lock detailed content */}
                {isGuest ? (
                    <>
                        <LockedContent
                            onUnlock={() => setShowLoginPrompt(true)}
                            title="Analisis Lengkap Terkunci"
                        >
                            {/* All detailed analysis */}
                            {showVisualization && <div>Visualization</div>}
                            {showMetrics && <div>Metrics</div>}
                            {aiInsights && <div>Insights</div>}
                        </LockedContent>
                    </>
                ) : (
                    <>
                        {/* LOGGED IN: Show everything */}
                        {showVisualization && <div>Visualization</div>}
                        {showMetrics && <div>Metrics</div>}
                        {aiInsights && <div>Insights</div>}
                        {/* ... all other content ... */}
                    </>
                )}
            </div>
        )}
        
        <BottomNav />
    </div>
);
```

---

### Step 4: Update Login (Redirect After Login)

**File**: `platforms/pwa/src/pages/Login.jsx`

**Find the login success handler and add**:
```javascript
const handleLoginSuccess = (user) => {
    // Store user data
    loginUser(user);
    
    // Check for redirect
    const redirect = sessionStorage.getItem('redirect_after_login');
    sessionStorage.removeItem('redirect_after_login');
    
    if (redirect) {
        navigate(redirect);
    } else {
        navigate('/');
    }
};
```

---

### Step 5: Update Chat (Token Check)

**File**: `platforms/pwa/src/pages/Chat.jsx`

**Add imports**:
```javascript
import { isAuthenticated, isGuestSession } from '../utils/auth';
import { checkAndUseToken } from '../utils/tokenSystem';
```

**Find `sendMessage` function and add at beginning**:
```javascript
const sendMessage = async (message) => {
    // TOKEN CHECK
    const guest = !isAuthenticated() || isGuestSession();
    const tokenCheck = checkAndUseToken('chat', guest);
    
    if (!tokenCheck.success) {
        alert(tokenCheck.message);
        return;
    }
    
    // ... rest of send message code
};
```

---

## 🎨 Visual Guide

### Guest View (Locked)
```
┌─────────────────────────┐
│ 🎫 Token: 2/3 tersisa   │
│ [Upgrade]               │
└─────────────────────────┘

┌─────────────────────────┐
│ Score: 75/100 ✅        │
│ Skin Type: Oily         │
└─────────────────────────┘

┌─────────────────────────┐
│ Summary: Your skin...   │
└─────────────────────────┘

┌─────────────────────────┐
│ [BLURRED CONTENT]       │
│                         │
│    🔒 Konten Terkunci   │
│    Login untuk akses    │
│    [Login Sekarang]     │
│                         │
└─────────────────────────┘
```

### Logged In View (Unlocked)
```
┌─────────────────────────┐
│ Score: 75/100 ✅        │
│ Skin Type: Oily         │
└─────────────────────────┘

┌─────────────────────────┐
│ Summary: Your skin...   │
└─────────────────────────┘

┌─────────────────────────┐
│ 📊 Detailed Analysis    │
│ - Pores: 65/100         │
│ - Wrinkles: 80/100      │
│ - Pigmentation: 70/100  │
└─────────────────────────┘

┌─────────────────────────┐
│ 💡 AI Recommendations   │
│ 1. Use cleanser 2x/day  │
│ 2. Apply sunscreen...   │
└─────────────────────────┘
```

---

## ✅ Testing Checklist

### Guest Mode
1. [ ] Open app (no login)
2. [ ] See token banner "3/3 tersisa"
3. [ ] Scan face (1st time) → Success
4. [ ] See score & summary only
5. [ ] Detailed content is blurred with lock
6. [ ] Click lock → Login prompt appears
7. [ ] Scan 2nd time → Token "2/3 tersisa"
8. [ ] Scan 3rd time → Token "1/3 tersisa"
9. [ ] Try 4th scan → "Limit tercapai" message
10. [ ] Go to History → Login prompt
11. [ ] Go to Chat → Redirect to login

### Logged In Mode
1. [ ] Login successfully
2. [ ] No token banner (unlimited)
3. [ ] Scan face → All content unlocked
4. [ ] See detailed analysis
5. [ ] See recommendations
6. [ ] Analysis auto-saved
7. [ ] View in History → Shows saved analysis
8. [ ] Chat works unlimited

### Token Reset
1. [ ] Use all 3 tokens as guest
2. [ ] Wait 24 hours (or change system date)
3. [ ] Tokens reset to 3/3

---

## 🚀 Quick Deploy

1. Copy all new files to project
2. Follow steps 1-5 above
3. Test guest flow
4. Test logged in flow
5. Done!

**Estimated Time**: 20-30 minutes
