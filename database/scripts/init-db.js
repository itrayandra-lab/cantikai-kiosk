/**
 * Database Initialization Script
 * Creates all required tables if they don't exist
 */

import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '..', 'backend', '.env') });
const backendRoot = path.join(__dirname, '..', '..', 'backend');
const configuredDbPath = process.env.DATABASE_PATH || '../database/scripts/cantik_ai.db';
const dbPath = path.isAbsolute(configuredDbPath)
    ? configuredDbPath
    : path.resolve(backendRoot, configuredDbPath);
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err);
        process.exit(1);
    } else {
        console.log('✅ Database connected:', dbPath);
    }
});

console.log('🔧 Initializing database...');
console.log(`📍 Database path: ${dbPath}`);

// Helper functions to promisify sqlite3 operations
const dbRun = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
};

const dbGet = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const dbAll = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Enable WAL mode
await dbRun('PRAGMA journal_mode = WAL');

// Create tables
const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        password_hash TEXT,
        age INTEGER,
        gender TEXT,
        skin_type TEXT,
        auth_provider TEXT DEFAULT 'email',
        google_id TEXT,
        avatar_url TEXT,
        email_verified INTEGER DEFAULT 0,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Analyses table
    `CREATE TABLE IF NOT EXISTS analyses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        image_url TEXT,
        visualization_url TEXT,
        overall_score REAL DEFAULT 0,
        skin_type TEXT,
        fitzpatrick_type TEXT,
        predicted_age INTEGER,
        analysis_version TEXT,
        engine TEXT,
        processing_time_ms INTEGER,
        cv_metrics TEXT,
        vision_analysis TEXT,
        ai_insights TEXT,
        product_recommendations TEXT,
        skincare_routine TEXT,
        client_session_id TEXT,
        is_deleted INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    
    // Products table
    `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        brand TEXT,
        category TEXT,
        description TEXT,
        price REAL,
        image_url TEXT,
        ingredients TEXT,
        skin_type TEXT,
        concerns TEXT,
        rating REAL DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        is_featured INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Articles table
    `CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE,
        title TEXT NOT NULL,
        content TEXT,
        excerpt TEXT,
        image_url TEXT,
        featured_image TEXT,
        author TEXT,
        category TEXT,
        tags TEXT,
        status TEXT DEFAULT 'published',
        published_at TIMESTAMP,
        is_featured INTEGER DEFAULT 0,
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Banners table
    `CREATE TABLE IF NOT EXISTS banners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        image_url TEXT NOT NULL,
        link_url TEXT,
        link_text TEXT,
        description TEXT,
        is_active INTEGER DEFAULT 1,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Chat sessions table
    `CREATE TABLE IF NOT EXISTS chat_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT DEFAULT 'New Chat',
        session_uuid TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    
    // Chat messages table
    `CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
    )`,

    // Kiosk sessions table
    `CREATE TABLE IF NOT EXISTS kiosk_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_uuid TEXT UNIQUE NOT NULL,
        device_id TEXT,
        visitor_name TEXT NOT NULL,
        gender TEXT NOT NULL,
        whatsapp TEXT,
        status TEXT DEFAULT 'started',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
    )`,

    // Kiosk analyses table
    `CREATE TABLE IF NOT EXISTS kiosk_analyses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        result_token TEXT UNIQUE NOT NULL,
        image_url TEXT,
        visualization_url TEXT,
        overall_score REAL DEFAULT 0,
        skin_type TEXT,
        fitzpatrick_type TEXT,
        predicted_age INTEGER,
        analysis_version TEXT,
        engine TEXT,
        processing_time_ms INTEGER,
        cv_metrics TEXT,
        vision_analysis TEXT,
        ai_insights TEXT,
        product_recommendations TEXT,
        skincare_routine TEXT,
        result_summary TEXT,
        delivery_status TEXT DEFAULT 'pending',
        delivery_channel TEXT,
        delivered_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES kiosk_sessions(id) ON DELETE CASCADE
    )`,
    
    // Admins table
    `CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        hashed_password TEXT,
        email TEXT,
        role TEXT DEFAULT 'admin',
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // App settings table
    `CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        value_type TEXT DEFAULT 'string',
        category TEXT DEFAULT 'general',
        description TEXT,
        is_public INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
];

async function initializeDatabase() {
    try {
        // Create tables
        for (let i = 0; i < tables.length; i++) {
            await dbRun(tables[i]);
            console.log(`✅ Table ${i + 1}/${tables.length} created/verified`);
        }
        
        // Create indexes for better performance
        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id)',
            'CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at)',
            'CREATE UNIQUE INDEX IF NOT EXISTS idx_analyses_user_session_unique ON analyses(user_id, client_session_id) WHERE client_session_id IS NOT NULL',
            'CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id)',
            'CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id)',
            'CREATE UNIQUE INDEX IF NOT EXISTS idx_kiosk_sessions_uuid ON kiosk_sessions(session_uuid)',
            'CREATE UNIQUE INDEX IF NOT EXISTS idx_kiosk_analyses_token ON kiosk_analyses(result_token)',
            'CREATE UNIQUE INDEX IF NOT EXISTS idx_kiosk_analyses_session_unique ON kiosk_analyses(session_id)',
            'CREATE INDEX IF NOT EXISTS idx_kiosk_analyses_created_at ON kiosk_analyses(created_at)',
            'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)',
            'CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)',
            'CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)'
        ];
        
        for (let i = 0; i < indexes.length; i++) {
            await dbRun(indexes[i]);
            console.log(`✅ Index ${i + 1}/${indexes.length} created/verified`);
        }
        
        // Insert default admin if not exists
        const adminExists = await dbGet('SELECT COUNT(*) as count FROM admins');
        if (adminExists.count === 0) {
            await dbRun('INSERT INTO admins (username, password, email) VALUES (?, ?, ?)', [
                'admin',
                'admin123',
                'admin@cantikai.com'
            ]);
            const hash = bcrypt.hashSync('admin123', 10);
            await dbRun('UPDATE admins SET hashed_password = ? WHERE username = ?', [hash, 'admin']);
            console.log('✅ Default admin created (username: admin, password: admin123)');
        } else {
            const adminsToHash = await dbAll(`
                SELECT id, password FROM admins
                WHERE (hashed_password IS NULL OR hashed_password = '')
                  AND password IS NOT NULL
                  AND password != ''
            `);

            for (const admin of adminsToHash) {
                const hash = bcrypt.hashSync(admin.password, 10);
                await dbRun('UPDATE admins SET hashed_password = ? WHERE id = ?', [hash, admin.id]);
            }

        if (adminsToHash.length > 0) {
            console.log(`✅ Backfilled hashed_password for ${adminsToHash.length} admin(s)`);
        }
    }

    // Insert default app settings if missing
    const defaultSettings = [
        ['app.name', 'Cantik AI Skin Analyzer', 'string', 'general', 'Nama aplikasi', 1],
        ['app.tagline', 'cantik.ai asisten kulit sehatmu', 'string', 'general', 'Tagline aplikasi', 1],
        ['feature.allow_guest', 'true', 'boolean', 'feature', 'Izinkan mode guest', 1],
        ['feature.enable_google_login', 'true', 'boolean', 'feature', 'Aktifkan login Google', 1],
        ['theme.primary_color', '#9d5a76', 'string', 'design', 'Warna utama', 1],
        ['theme.primary_hover', '#8c4f69', 'string', 'design', 'Warna hover utama', 1],
        ['theme.primary_light', '#c084a0', 'string', 'design', 'Warna gradient sekunder', 1],
        ['kiosk.auto_reset_seconds', '90', 'number', 'kiosk', 'Auto reset halaman hasil kiosk (detik)', 0],
        ['kiosk.idle_timeout_seconds', '180', 'number', 'kiosk', 'Timeout idle kiosk untuk reset sesi (detik)', 0]
    ];

    for (const setting of defaultSettings) {
        await dbRun(`
            INSERT INTO app_settings (key, value, value_type, category, description, is_public)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(key) DO NOTHING
        `, setting);
    }
    
    console.log('✅ Database initialization complete!');
    console.log('📊 Database ready for use');
    
} catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
} finally {
    db.close();
}
}

// Run the initialization
initializeDatabase();
