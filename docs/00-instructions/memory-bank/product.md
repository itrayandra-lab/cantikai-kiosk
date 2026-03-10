# Product Context

## Why This Exists
Democratize access to professional skin analysis. Most Indonesians can't afford regular dermatologist visits, but everyone has a smartphone with a camera. We use AI to provide professional-grade analysis for free.

## How It Works

### User Flow
1. **First Visit** → Register (auto-create on first scan)
2. **Scan Face** → Camera with oval guide for proper positioning
3. **Get Results** → 7 metrics + AI insights in ~10 seconds
4. **Ask Questions** → Chat with AI for personalized advice
5. **Track Progress** → View history, see improvements over time
6. **Get Recommendations** → Products matched to skin concerns

### Key Features

**Skin Analysis**
- Camera capture with face detection
- Google Gemini 2.0 Flash analysis
- 7 metrics: overall health (0-100), acne, dark spots, wrinkles, hydration, texture, pores
- AI insights and recommendations
- Results saved to history

**AI Chat Assistant**
- 3 modes: Fast (llama-3.1-8b), Thinking (gpt-oss-20b), Pro (groq/compound)
- Multiple chat sessions per user
- Suggested follow-up questions
- Voice input support (Indonesian)
- Context-aware (last 10 messages)

**User Profile**
- View/edit personal info (name, age, gender, skin type)
- Statistics (total scans, average score, latest score)
- Last analysis summary
- Quick actions (new scan, history, logout)

**Content**
- Product catalog (browse, filter by category)
- Educational articles (skincare tips, ingredients)
- Banner system (promotions, announcements)

**Admin Dashboard**
- Manage users, products, articles, banners, analyses
- Full CRUD operations
- Separate admin authentication

## User Experience Goals

### Design Principles
- **Simplicity First** - Minimize cognitive load, clear CTAs
- **Instant Feedback** - Loading states, animations, progress indicators
- **Progressive Disclosure** - Show info when needed, not all at once
- **Error Prevention** - Validate inputs, guide users
- **Accessibility** - Readable text, proper contrast, touch-friendly

### Visual Design
- **Style:** Glassmorphism (modern, premium feel)
- **Colors:** Pink/purple gradient (#9d5a76, #f1d3e2)
- **Typography:** Playfair Display (headlines), Inter (body)
- **Layout:** Mobile-first, card-based
- **Spacing:** Generous padding, breathing room

### Content Tone
- Friendly & supportive (not clinical)
- Educational (explain simply)
- Empowering (help users take control)
- Indonesian-first (natural Bahasa Indonesia)

## Competitive Advantage
1. **AI-Powered** - Google Gemini 2.0 (accurate, fast)
2. **Conversational** - Chat for personalized advice
3. **Free** - No subscription required
4. **Indonesian-First** - Localized content and products
5. **Comprehensive** - Analysis + Chat + Products + Education

## Roadmap

### Q1 2026 (Current)
- ✅ Complete MVP development
- ⏳ Deploy to VPS
- ⏳ Beta testing (50 users)
- ⏳ Collect feedback

### Q2 2026
- Launch marketing campaign
- Reach 1000 users
- Implement analytics
- Add premium features

### Q3 2026
- Introduce monetization
- Expand product catalog
- Add social features
- Mobile app development

### Q4 2026
- Scale infrastructure
- Expand to Malaysia/Singapore
- B2B partnerships
- Native mobile apps launch
