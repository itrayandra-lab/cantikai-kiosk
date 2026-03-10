# Phase 2: Database Design

## 2.1 Database Schema Overview

**Database Type:** SQLite 3  
**ORM:** SQLAlchemy 2.0.36  
**Total Tables:** 9

```
users ──┬──→ analyses (1:N)
        └──→ chat_sessions (1:N) ──→ chat_messages (1:N)

admins (independent)
products (independent)
articles (independent)
banners (independent)
app_settings (independent)
```

---

## 2.2 Entity Relationship Diagram (ERD)

```
┌─────────────────────┐
│       USERS         │
│─────────────────────│
│ id (PK)             │
│ email (UNIQUE)      │
│ username (UNIQUE)   │
│ hashed_password     │
│ full_name           │
│ age                 │
│ gender              │
│ skin_type           │
│ skin_concerns       │
│ is_active           │
│ is_verified         │
│ is_premium          │
│ created_at          │
│ updated_at          │
│ last_login          │
└─────────────────────┘
         │ 1
         │
         │ N
┌─────────────────────┐         ┌─────────────────────┐
│     ANALYSES        │         │   CHAT_SESSIONS     │
│─────────────────────│         │─────────────────────│
│ id (PK)             │         │ id (PK)             │
│ user_id (FK)        │         │ session_uuid (UQ)   │
│ image_path          │         │ user_id (FK)        │
│ overall_score       │         │ title               │
│ acne_score          │         │ created_at          │
│ dark_spots_score    │         │ updated_at          │
│ wrinkles_score      │         └─────────────────────┘
│ hydration_score     │                  │ 1
│ texture_score       │                  │
│ pores_score         │                  │ N
│ redness_score       │         ┌─────────────────────┐
│ ai_insights         │         │   CHAT_MESSAGES     │
│ recommendations     │         │─────────────────────│
│ created_at          │         │ id (PK)             │
└─────────────────────┘         │ session_id (FK)     │
                                │ role                │
                                │ content             │
                                │ created_at          │
                                └─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│      PRODUCTS       │  │      ARTICLES       │  │      BANNERS        │
│─────────────────────│  │─────────────────────│  │─────────────────────│
│ id (PK)             │  │ id (PK)             │  │ id (PK)             │
│ name                │  │ title               │  │ title               │
│ description         │  │ content             │  │ image_url           │
│ category            │  │ category            │  │ link_url            │
│ price               │  │ author              │  │ is_active           │
│ image_url           │  │ published_date      │  │ display_order       │
│ brand               │  │ is_published        │  │ created_at          │
│ rating              │  │ created_at          │  └─────────────────────┘
│ is_active           │  └─────────────────────┘
│ created_at          │
└─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│       ADMINS        │  │    APP_SETTINGS     │
│─────────────────────│  │─────────────────────│
│ id (PK)             │  │ id (PK)             │
│ username (UNIQUE)   │  │ key (UNIQUE)        │
│ email (UNIQUE)      │  │ value               │
│ hashed_password     │  │ description         │
│ full_name           │  │ updated_at          │
│ is_active           │  └─────────────────────┘
│ created_at          │
└─────────────────────┘
```

---

## 2.3 Table Definitions

### 2.3.1 USERS Table
**Purpose:** Store user account information and profile data

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Auto-increment user ID |
| email | VARCHAR | UNIQUE, NOT NULL | User email (login) |
| username | VARCHAR | UNIQUE, NOT NULL | Display name |
| hashed_password | VARCHAR | NOT NULL | Bcrypt hashed password |
| full_name | VARCHAR | NULL | User's full name |
| age | INTEGER | NULL | User age |
| gender | VARCHAR | NULL | male/female/other |
| skin_type | VARCHAR | NULL | oily/dry/combination/normal |
| skin_concerns | VARCHAR | NULL | JSON string of concerns |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| is_verified | BOOLEAN | DEFAULT FALSE | Email verification |
| is_premium | BOOLEAN | DEFAULT FALSE | Premium subscription |
| created_at | DATETIME | DEFAULT NOW | Registration date |
| updated_at | DATETIME | DEFAULT NOW | Last update |
| last_login | DATETIME | NULL | Last login timestamp |

**Indexes:**
- `ix_users_id` on `id`
- `ix_users_email` on `email`
- `ix_users_username` on `username`

**Relationships:**
- 1:N with `analyses` (user_id)
- 1:N with `chat_sessions` (user_id)

---

### 2.3.2 ANALYSES Table
**Purpose:** Store skin analysis results

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Auto-increment analysis ID |
| user_id | INTEGER | FK → users.id | Owner of analysis |
| image_path | VARCHAR | NULL | Path to uploaded image |
| overall_score | FLOAT | NULL | Overall skin health (0-100) |
| acne_score | FLOAT | NULL | Acne severity (0-100) |
| dark_spots_score | FLOAT | NULL | Dark spots severity (0-100) |
| wrinkles_score | FLOAT | NULL | Wrinkles severity (0-100) |
| hydration_score | FLOAT | NULL | Skin hydration (0-100) |
| texture_score | FLOAT | NULL | Skin texture quality (0-100) |
| pores_score | FLOAT | NULL | Pore condition (0-100) |
| redness_score | FLOAT | NULL | Redness level (0-100) |
| ai_insights | TEXT | NULL | AI-generated insights (JSON) |
| recommendations | TEXT | NULL | Product recommendations (JSON) |
| created_at | DATETIME | DEFAULT NOW | Analysis timestamp |

**Indexes:**
- `ix_analyses_id` on `id`
- `ix_analyses_user_id` on `user_id`

**Foreign Keys:**
- `user_id` → `users.id` (ON DELETE CASCADE)

---

### 2.3.3 CHAT_SESSIONS Table
**Purpose:** Store chat conversation sessions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Auto-increment session ID |
| session_uuid | VARCHAR(36) | UNIQUE, NOT NULL | UUID for session |
| user_id | INTEGER | FK → users.id, NOT NULL | Session owner |
| title | VARCHAR(200) | DEFAULT 'Chat Baru' | Session title |
| created_at | DATETIME | DEFAULT NOW | Session start time |
| updated_at | DATETIME | DEFAULT NOW | Last message time |

**Indexes:**
- `ix_chat_sessions_id` on `id`
- `ix_chat_sessions_user_id` on `user_id`
- `idx_session_uuid` on `session_uuid`
- `idx_user_updated` on `(user_id, updated_at)`

**Foreign Keys:**
- `user_id` → `users.id` (ON DELETE CASCADE)

**Relationships:**
- 1:N with `chat_messages` (session_id)

---

### 2.3.4 CHAT_MESSAGES Table
**Purpose:** Store individual chat messages

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Auto-increment message ID |
| session_id | INTEGER | FK → chat_sessions.id, NOT NULL | Parent session |
| role | VARCHAR(20) | NOT NULL | 'user' or 'assistant' |
| content | TEXT | NOT NULL | Message text |
| created_at | DATETIME | DEFAULT NOW | Message timestamp |

**Indexes:**
- `ix_chat_messages_id` on `id`
- `ix_chat_messages_session_id` on `session_id`
- `ix_chat_messages_created_at` on `created_at`

**Foreign Keys:**
- `session_id` → `chat_sessions.id` (ON DELETE CASCADE)

---

### 2.3.5 PRODUCTS Table
**Purpose:** Store skincare product catalog

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Auto-increment product ID |
| name | VARCHAR | NOT NULL | Product name |
| description | TEXT | NULL | Product description |
| category | VARCHAR | NULL | cleanser/toner/moisturizer/etc |
| price | FLOAT | NULL | Product price (IDR) |
| image_url | VARCHAR | NULL | Product image URL |
| brand | VARCHAR | NULL | Brand name |
| rating | FLOAT | NULL | Average rating (0-5) |
| is_active | BOOLEAN | DEFAULT TRUE | Product visibility |
| created_at | DATETIME | DEFAULT NOW | Creation timestamp |

**Indexes:**
- `ix_products_id` on `id`

---

### 2.3.6 ARTICLES Table
**Purpose:** Store educational content

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Auto-increment article ID |
| title | VARCHAR | NOT NULL | Article title |
| content | TEXT | NOT NULL | Article content (markdown) |
| category | VARCHAR | NULL | Article category |
| author | VARCHAR | NULL | Author name |
| published_date | DATETIME | NULL | Publication date |
| is_published | BOOLEAN | DEFAULT FALSE | Visibility status |
| created_at | DATETIME | DEFAULT NOW | Creation timestamp |

**Indexes:**
- `ix_articles_id` on `id`

---

### 2.3.7 BANNERS Table
**Purpose:** Store promotional banners

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Auto-increment banner ID |
| title | VARCHAR | NOT NULL | Banner title |
| image_url | VARCHAR | NOT NULL | Banner image URL |
| link_url | VARCHAR | NULL | Click destination URL |
| is_active | BOOLEAN | DEFAULT TRUE | Banner visibility |
| display_order | INTEGER | DEFAULT 0 | Display priority |
| created_at | DATETIME | DEFAULT NOW | Creation timestamp |

**Indexes:**
- `ix_banners_id` on `id`

---

### 2.3.8 ADMINS Table
**Purpose:** Store admin account information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Auto-increment admin ID |
| username | VARCHAR | UNIQUE, NOT NULL | Admin username |
| email | VARCHAR | UNIQUE, NOT NULL | Admin email |
| hashed_password | VARCHAR | NOT NULL | Bcrypt hashed password |
| full_name | VARCHAR | NULL | Admin full name |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| created_at | DATETIME | DEFAULT NOW | Creation timestamp |

**Indexes:**
- `ix_admins_id` on `id`
- `ix_admins_username` on `username`
- `ix_admins_email` on `email`

---

### 2.3.9 APP_SETTINGS Table
**Purpose:** Store application configuration

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Auto-increment setting ID |
| key | VARCHAR | UNIQUE, NOT NULL | Setting key |
| value | TEXT | NULL | Setting value (JSON) |
| description | TEXT | NULL | Setting description |
| updated_at | DATETIME | DEFAULT NOW | Last update |

**Indexes:**
- `ix_app_settings_id` on `id`
- `ix_app_settings_key` on `key`

---

## 2.4 Data Integrity Rules

### Foreign Key Constraints
✅ **Enforced at database level**

1. `analyses.user_id` → `users.id` (CASCADE DELETE)
2. `chat_sessions.user_id` → `users.id` (CASCADE DELETE)
3. `chat_messages.session_id` → `chat_sessions.id` (CASCADE DELETE)

### Cascade Delete Behavior
- Delete User → Delete all Analyses + Chat Sessions (+ Messages)
- Delete Chat Session → Delete all Messages
- Delete Message → No cascade (only message deleted)

### Data Validation
- Email format validation (backend)
- Password strength requirements (min 8 chars)
- Image file type validation (JPEG, PNG, WebP)
- Image size limit (max 10MB)
- Score ranges (0-100)
- Rating ranges (0-5)

---

## 2.5 Database Migration History

### Version 1.0 (Initial Schema)
- Created all 9 tables
- Basic indexes added

### Version 1.1 (Chat Feature)
- Added `chat_sessions` table
- Added `chat_messages` table
- Added foreign key: `chat_messages.session_id` → `chat_sessions.id`

### Version 1.2 (Database Relationships Fix) - 2026-03-03
- ✅ Changed `chat_sessions.user_id` from VARCHAR to INTEGER
- ✅ Added foreign key: `chat_sessions.user_id` → `users.id`
- ✅ Added cascade delete constraints
- ✅ Cleaned 50 orphan messages
- ✅ Added composite index: `(user_id, updated_at)` on chat_sessions

---

## 2.6 Query Optimization

### Frequently Used Queries

**Get User with Analyses:**
```sql
SELECT u.*, a.* 
FROM users u
LEFT JOIN analyses a ON u.id = a.user_id
WHERE u.id = ?
ORDER BY a.created_at DESC;
```

**Get Chat Sessions with Message Count:**
```sql
SELECT cs.*, COUNT(cm.id) as message_count
FROM chat_sessions cs
LEFT JOIN chat_messages cm ON cs.id = cm.session_id
WHERE cs.user_id = ?
GROUP BY cs.id
ORDER BY cs.updated_at DESC;
```

**Get Latest Analysis per User:**
```sql
SELECT u.username, a.*
FROM users u
INNER JOIN (
    SELECT user_id, MAX(created_at) as latest
    FROM analyses
    GROUP BY user_id
) latest_analysis ON u.id = latest_analysis.user_id
INNER JOIN analyses a ON a.user_id = u.id 
    AND a.created_at = latest_analysis.latest;
```

---

**Document Status:** ✅ Approved  
**Last Updated:** 2026-03-03  
**Version:** 1.2
