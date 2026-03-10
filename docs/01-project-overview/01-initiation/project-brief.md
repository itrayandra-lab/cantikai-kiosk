# Phase 1: Initiation & Requirement Gathering

## 1.1 Project Brief

### Project Name
**Cantik AI - AI-Based Skin Analysis Application**

### Project Vision
Aplikasi mobile-first web application yang menggunakan AI untuk menganalisis kondisi kulit wajah pengguna dan memberikan rekomendasi perawatan kulit yang personal.

### Problem Statement
- Banyak orang kesulitan mengetahui kondisi kulit mereka secara akurat
- Konsultasi dermatologi mahal dan tidak accessible untuk semua orang
- Pemilihan produk skincare sering tidak sesuai dengan kebutuhan kulit
- Kurangnya edukasi tentang perawatan kulit yang tepat

### Solution
Platform AI yang dapat:
1. Menganalisis kondisi kulit dari foto wajah
2. Memberikan skor kesehatan kulit (0-100)
3. Mendeteksi masalah kulit (jerawat, flek hitam, kerutan, dll)
4. Memberikan rekomendasi produk dan perawatan
5. Menyediakan chatbot AI untuk konsultasi skincare
6. Tracking progress perawatan kulit

### Target Users
- **Primary:** Wanita usia 18-35 tahun yang peduli dengan skincare
- **Secondary:** Pria yang mulai aware dengan perawatan kulit
- **Geographic:** Indonesia (fokus awal: Bandung, Jakarta)

### Business Goals
- Membantu 10,000+ users dalam 6 bulan pertama
- Akurasi analisis AI minimal 85%
- User retention rate minimal 60%
- Average session duration minimal 5 menit

### Success Metrics (KPI)
- **Technical:** Model accuracy ≥ 85%, API response time < 2s
- **Business:** MAU (Monthly Active Users) ≥ 5,000
- **User:** User satisfaction score ≥ 4.5/5.0

---

## 1.2 Stakeholders

### Internal Team
- **Product Owner:** Raymaizing
- **AI Engineer:** Raymaizing
- **Full-Stack Developer:** Raymaizing
- **UI/UX Designer:** Raymaizing

### External Stakeholders
- **End Users:** Target audience (skincare enthusiasts)
- **Potential Partners:** Skincare brands, dermatologists
- **Investors:** (Future consideration)

---

## 1.3 Project Constraints

### Budget
- Self-funded project
- Focus on cost-effective solutions (free-tier APIs, open-source tools)

### Timeline
- **Phase 1-2:** 4 weeks (Requirements + Planning)
- **Phase 3:** 12 weeks (Development)
- **Phase 4:** 2 weeks (Testing)
- **Phase 5:** 1 week (Deployment)
- **Total:** ~5 months

### Technical Constraints
- Must work on mobile browsers (responsive design)
- Must support low-end devices (optimization required)
- Must work with limited internet bandwidth
- Must comply with data privacy regulations

### Resource Constraints
- Solo developer (multi-role)
- Limited budget for paid APIs
- No dedicated QA team

---

## 1.4 Assumptions & Dependencies

### Assumptions
- Users have smartphones with cameras
- Users have basic internet connectivity
- Users are comfortable uploading face photos
- AI models can achieve target accuracy with available datasets

### Dependencies
- **External APIs:** Groq AI, Google Gemini, n8n workflows
- **Cloud Services:** VPS hosting, CDN for images
- **Third-party Libraries:** React, FastAPI, SQLAlchemy
- **Data Sources:** Public skincare datasets, user-generated data

---

## 1.5 Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| AI model accuracy below target | High | Medium | Use multiple AI models, continuous training |
| API rate limits exceeded | Medium | High | Implement caching, use multiple API providers |
| User privacy concerns | High | Medium | Clear privacy policy, secure data handling |
| Slow performance on mobile | Medium | Medium | Optimize images, lazy loading, CDN |
| Database scalability issues | Medium | Low | Design for horizontal scaling from start |

---

**Document Status:** ✅ Approved  
**Last Updated:** 2026-03-03  
**Version:** 1.0
