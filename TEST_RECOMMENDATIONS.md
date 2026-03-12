# Product Recommendation System - Testing Guide

## System Overview

The Cantik.ai product recommendation system works in two layers:

### Layer 1: Backend Recommendation Engine (Smart)
- **Location**: `backend/src/utils/productRecommendation.js`
- **Trigger**: When user saves analysis result
- **Process**:
  1. Analyzes skin type and priority concerns from analysis result
  2. Maps concerns to product categories and keywords
  3. Queries database for matching products
  4. Scores each product based on:
     - Category match (20 points)
     - Skin type compatibility (15 points)
     - Concern-specific keywords (5-8 points each)
     - Product rating (3x multiplier)
     - Price positioning (mid-range preference)
     - Featured status (5 points)
  5. Returns top 8 products with match reasons
  6. Stores recommendations in `analyses.product_recommendations` column

### Layer 2: Frontend Display (Fallback)
- **Location**: `platforms/pwa/src/pages/Recommendations.jsx`
- **Behavior**:
  1. First checks if backend recommendations are available
  2. If yes: displays backend recommendations (smart, personalized)
  3. If no: falls back to local scoring algorithm
  4. Displays products with recommendation reasons

## How to Test

### Test 1: Verify Backend Recommendation Generation

1. Start backend:
   ```bash
   cd backend && npm run dev
   ```

2. Check that products are available:
   ```bash
   curl http://localhost:8000/api/v2/products | jq '.[0:3]'
   ```

3. Expected output: Array of products with name, brand, category, price, rating, etc.

### Test 2: Verify Frontend Recommendations Page

1. Start frontend:
   ```bash
   cd platforms/pwa && npm run dev
   ```

2. Navigate to: `http://localhost:5173`

3. Perform a skin analysis (scan face)

4. After analysis completes, click "Lihat Semua Rekomendasi Produk"

5. Expected behavior:
   - Page loads with personalized recommendations
   - Each product shows:
     - Product image
     - Brand name
     - Product name
     - Category badge
     - Recommendation reason (why it was recommended)
     - Price
     - "Detail" button

### Test 3: Verify Recommendation Reasons

Check that recommendations show appropriate reasons:
- "Cocok untuk kulit [skin_type]" - Skin type match
- "Membantu mengatasi [concern]" - Concern match
- "Rating tinggi ([rating])" - High-rated products

### Test 4: Database Verification

Check that recommendations are stored:
```bash
mysql -h 127.0.0.1 -P 3307 -u root skin_analyzer -e "
SELECT 
  id, 
  overall_score, 
  skin_type,
  JSON_LENGTH(product_recommendations) as rec_count,
  JSON_EXTRACT(product_recommendations, '$[0].name') as first_rec
FROM analyses 
WHERE product_recommendations IS NOT NULL 
LIMIT 1\G"
```

## Recommendation Algorithm Details

### Concern-to-Product Mapping
- **Acne**: Cleanser, Facial Wash, Serum, Toner (keywords: acne, salicylic, tea tree, bha, aha)
- **Wrinkles**: Serum, Cream, Eye Cream, Moisturizer (keywords: retinol, peptide, collagen)
- **Pigmentation**: Serum, Cream, Sunscreen (keywords: vitamin c, brightening, niacinamide)
- **Hydration**: Moisturizer, Serum, Body Lotion, Toner (keywords: hyaluronic, glycerin)
- **Oiliness**: Cleanser, Toner, Serum, Facial Wash (keywords: oil control, sebum, mattifying)
- **Sensitivity**: Cleanser, Moisturizer, Cream (keywords: gentle, soothing, cica)
- **Sun Damage**: Sunscreen (always recommended for all skin types)

### Skin Type Priorities
- **Oily**: Prefers Cleanser, Toner, Serum, Facial Wash
- **Dry**: Prefers Moisturizer, Cream, Body Lotion, Serum
- **Combination**: Prefers Cleanser, Toner, Moisturizer, Serum
- **Normal**: Prefers Serum, Moisturizer, Sunscreen, Cleanser
- **Sensitive**: Prefers Cleanser, Moisturizer, Cream

## Troubleshooting

### Issue: No recommendations showing
**Solution**: 
1. Check backend logs for errors
2. Verify products exist in database: `SELECT COUNT(*) FROM products WHERE is_active = 1`
3. Check that analysis has priority_concerns: `SELECT priority_concerns FROM analyses LIMIT 1`

### Issue: Wrong products recommended
**Solution**:
1. Check product categories match expected values
2. Verify product keywords in name/description/ingredients
3. Check skin_type in analysis result

### Issue: Recommendations not persisting
**Solution**:
1. Verify `product_recommendations` column exists in `analyses` table
2. Check backend logs for "Product recommendations generated" message
3. Verify database connection is working

## Files Modified

1. **backend/src/utils/productRecommendation.js**
   - Enhanced category matching (flexible string matching)
   - Improved logging for debugging
   - Better fallback handling

2. **platforms/pwa/src/pages/Recommendations.jsx**
   - Added backend recommendations support
   - Fallback to local scoring if backend recs unavailable
   - Improved state management

3. **platforms/pwa/src/pages/AnalysisResult.jsx**
   - Pass backend recommendations to Recommendations page
   - Include `backendRecommendations` in navigation state

## Next Steps

1. ✅ Backend recommendation engine working
2. ✅ Frontend displays recommendations
3. ⏳ User testing with real skin analysis
4. ⏳ Collect feedback on recommendation accuracy
5. ⏳ Optimize algorithm based on user feedback
