# Test Database Save

## Quick Test

1. **Buka browser console** (F12)
2. **Scan wajah baru**
3. **Tunggu analisis selesai**
4. **Cek console logs**:

### ✅ Success Logs (harus ada):
```
💾 Cached scan image for later use
💾 ========== AUTO-SAVE START ==========
💾 Session ID: session_xxxxx_xxxxx
💾 Saving to database with complete data...
✅ ========== AUTO-SAVE SUCCESS ==========
✅ Saved Analysis ID: [number]
✅ Session ID in DB: session_xxxxx_xxxxx
```

### ❌ Error Logs (jika ada masalah):
```
❌ ========== AUTO-SAVE FAILED ==========
❌ Error: [error message]
```

## Manual Test via Backend

Test langsung ke backend API:

```bash
# Test save analysis
curl -X POST http://localhost:8000/api/v2/analysis/save \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "client_session_id": "test_session_123",
    "image_base64": "",
    "visualization_base64": "",
    "overall_score": 75,
    "skin_type": "combination",
    "fitzpatrick_type": "III",
    "predicted_age": 25,
    "analysis_version": "7.0",
    "engine": "Test",
    "processing_time_ms": 1000,
    "analysis_data": "{}",
    "ai_insights": "{}"
  }'

# Test get by session
curl http://localhost:8000/api/v2/analysis/session/test_session_123
```

## Check MySQL Database

```bash
# Connect to MySQL
mysql -u root -p

# Use database
USE skin_analyzer;

# Check recent analyses
SELECT id, client_session_id, overall_score, skin_type, created_at 
FROM analyses 
ORDER BY id DESC 
LIMIT 10;

# Check specific session
SELECT * FROM analyses WHERE client_session_id = 'session_1776318031620_tbletjen5';
```

## Common Issues

### Issue 1: User ID tidak ada
**Solution**: Auto-create user di autoSaveAnalysis function

### Issue 2: Image terlalu besar
**Solution**: Compress atau skip image jika terlalu besar

### Issue 3: MySQL connection error
**Solution**: Check MySQL service running

### Issue 4: Table tidak ada
**Solution**: Run migrations
```bash
cd backend
npm run migrate
```
