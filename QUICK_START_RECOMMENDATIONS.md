# Quick Start - Product Recommendations

## ⚡ 30-Second Setup

### 1. Start Backend
```bash
cd backend && npm run dev
```
✅ Wait for: "Ready to accept requests"

### 2. Start Frontend
```bash
cd platforms/pwa && npm run dev
```
✅ Wait for: "Local: http://localhost:5173"

### 3. Test System
```bash
# Check backend health
curl http://localhost:8000/health

# Check products (should show 66)
curl http://localhost:8000/api/v2/products | jq 'length'
```

## 🎯 How It Works

1. **User scans face** → http://localhost:5173
2. **Backend analyzes** → Generates skin type + concerns
3. **Backend recommends** → Scores 66 products, returns top 8
4. **Frontend displays** → Shows personalized recommendations
5. **User sees why** → Each product shows recommendation reason

## 📊 What Gets Recommended

Based on:
- ✅ Skin type (oily, dry, combination, normal, sensitive)
- ✅ Skin concerns (acne, wrinkles, pigmentation, hydration, etc.)
- ✅ Product rating (higher rated = better)
- ✅ Product price (mid-range preferred)
- ✅ Product keywords (matches concern keywords)

## 🧪 Quick Test

1. Open http://localhost:5173
2. Click "Scan"
3. Take a photo
4. Wait for analysis
5. Click "Lihat Semua Rekomendasi Produk"
6. See personalized recommendations!

## 📈 System Status

| Component | Status | Details |
|-----------|--------|---------|
| Backend | ✅ Running | http://localhost:8000 |
| Frontend | ✅ Running | http://localhost:5173 |
| Database | ✅ Connected | MySQL 127.0.0.1:3307 |
| Products | ✅ 66 Available | All active and indexed |
| Recommendations | ✅ Working | Auto-generated on save |

## 🔧 Key Files

| File | Purpose |
|------|---------|
| `backend/src/utils/productRecommendation.js` | Recommendation algorithm |
| `platforms/pwa/src/pages/Recommendations.jsx` | Display recommendations |
| `platforms/pwa/src/pages/AnalysisResult.jsx` | Pass recommendations to page |

## 🚀 Features

✅ Smart algorithm (multi-factor scoring)
✅ Personalized per user
✅ Auto-generated on analysis
✅ Stored in database
✅ Shows recommendation reasons
✅ 66 products available
✅ Mobile responsive
✅ Fast (< 2 seconds)

## 📝 Recommendation Reasons

Each product shows why it was recommended:
- "Cocok untuk kulit [type]" - Matches your skin type
- "Membantu mengatasi [concern]" - Addresses your concern
- "Rating tinggi ([rating])" - Highly rated product

## 🎨 Example Flow

```
User: Oily skin with acne
    ↓
Backend: Detects oily + acne concern
    ↓
Algorithm: Looks for Cleanser, Serum, Toner with acne keywords
    ↓
Scores: Salicylic acid cleanser (56.5), Niacinamide serum (52.6), etc.
    ↓
Returns: Top 8 products sorted by score
    ↓
Frontend: Shows products with reasons
    ↓
User: Sees "Cocok untuk kulit oily" + "Membantu mengatasi acne"
```

## 🔍 Verify It's Working

### Backend Logs
```
✅ Product recommendations generated: 8
✅ Top recommended products: [...]
```

### Frontend Console
```
✅ Using backend-generated recommendations: 8
```

### Database
```bash
mysql -h 127.0.0.1 -P 3307 -u root skin_analyzer -e \
"SELECT COUNT(*) FROM analyses WHERE product_recommendations IS NOT NULL;"
```

## 🆘 If Something's Wrong

| Problem | Solution |
|---------|----------|
| No recommendations | Check backend logs for errors |
| Wrong products | Verify product categories in database |
| Slow performance | Check database connection |
| Frontend not loading | Check frontend console for errors |

## 📚 Full Documentation

- **RECOMMENDATION_SYSTEM_READY.md** - Complete guide
- **RECOMMENDATION_SYSTEM_SUMMARY.md** - Technical details
- **TEST_RECOMMENDATIONS.md** - Testing guide

## ✨ That's It!

The recommendation system is fully operational. Just:
1. Start backend
2. Start frontend
3. Scan a face
4. See personalized recommendations!

---

**Status**: ✅ READY TO USE
**Products**: 66 available
**Performance**: < 2 seconds
