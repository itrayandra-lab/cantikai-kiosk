/**
 * Auth Migration Script
 * - Adds modern auth columns to users/admins
 * - Adds admin management columns/tables for app settings
 * - Backfills password hashes from legacy plaintext values
 */

import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'cantik_ai.db');
const db = new Database(dbPath);

const addColumnIfMissing = (tableName, columnName, definition) => {
    const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
    if (!columns.some((col) => col.name === columnName)) {
        db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
        console.log(`✅ Added ${tableName}.${columnName}`);
    }
};

try {
    console.log('🔧 Starting auth migration...');
    console.log(`📍 Database path: ${dbPath}`);

    db.pragma('journal_mode = WAL');

    // Users table
    addColumnIfMissing('users', 'password_hash', 'TEXT');
    addColumnIfMissing('users', 'auth_provider', "TEXT DEFAULT 'email'");
    addColumnIfMissing('users', 'google_id', 'TEXT');
    addColumnIfMissing('users', 'avatar_url', 'TEXT');
    addColumnIfMissing('users', 'email_verified', 'INTEGER DEFAULT 0');
    addColumnIfMissing('users', 'last_login', 'TIMESTAMP');

    // Admins table
    addColumnIfMissing('admins', 'hashed_password', 'TEXT');
    addColumnIfMissing('admins', 'last_login', 'TIMESTAMP');

    // Products
    addColumnIfMissing('products', 'is_featured', 'INTEGER DEFAULT 0');
    addColumnIfMissing('products', 'updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');

    // Articles
    addColumnIfMissing('articles', 'slug', 'TEXT');
    addColumnIfMissing('articles', 'status', "TEXT DEFAULT 'published'");
    addColumnIfMissing('articles', 'featured_image', 'TEXT');
    addColumnIfMissing('articles', 'published_at', 'TIMESTAMP');
    addColumnIfMissing('articles', 'is_featured', 'INTEGER DEFAULT 0');
    addColumnIfMissing('articles', 'updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');

    // Banners
    addColumnIfMissing('banners', 'link_text', 'TEXT');
    addColumnIfMissing('banners', 'updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');

    db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)');
    db.exec('CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)');
    db.exec(`
        CREATE TABLE IF NOT EXISTS app_settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            value_type TEXT DEFAULT 'string',
            category TEXT DEFAULT 'general',
            description TEXT,
            is_public INTEGER DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    const usersToHash = db.prepare(`
        SELECT id, password
        FROM users
        WHERE (password_hash IS NULL OR password_hash = '')
          AND password IS NOT NULL
          AND password != ''
    `).all();

    const updateUserHashStmt = db.prepare('UPDATE users SET password_hash = ?, auth_provider = COALESCE(auth_provider, ?) WHERE id = ?');
    for (const user of usersToHash) {
        updateUserHashStmt.run(bcrypt.hashSync(user.password, 10), 'email', user.id);
    }
    console.log(`✅ Backfilled user password hashes: ${usersToHash.length}`);

    const adminsToHash = db.prepare(`
        SELECT id, password
        FROM admins
        WHERE (hashed_password IS NULL OR hashed_password = '')
          AND password IS NOT NULL
          AND password != ''
    `).all();

    const updateAdminHashStmt = db.prepare('UPDATE admins SET hashed_password = ? WHERE id = ?');
    for (const admin of adminsToHash) {
        updateAdminHashStmt.run(bcrypt.hashSync(admin.password, 10), admin.id);
    }
    console.log(`✅ Backfilled admin password hashes: ${adminsToHash.length}`);

    const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get();
    if (!adminCount || adminCount.count === 0) {
        const defaultHash = bcrypt.hashSync('admin123', 10);
        db.prepare(`
            INSERT INTO admins (username, password, hashed_password, email, role)
            VALUES (?, ?, ?, ?, ?)
        `).run('admin', 'admin123', defaultHash, 'admin@cantikai.com', 'super_admin');
        console.log('✅ Created default admin account');
    }

    const defaultSettings = [
        ['app.name', 'Cantik AI Skin Analyzer', 'string', 'general', 'Nama aplikasi', 1],
        ['app.tagline', 'cantik.ai asisten kulit sehatmu', 'string', 'general', 'Tagline aplikasi', 1],
        ['feature.allow_guest', 'true', 'boolean', 'feature', 'Izinkan mode guest', 1],
        ['feature.enable_google_login', 'true', 'boolean', 'feature', 'Aktifkan login Google', 1],
        ['theme.primary_color', '#9d5a76', 'string', 'design', 'Warna utama', 1],
        ['theme.primary_hover', '#8c4f69', 'string', 'design', 'Warna hover utama', 1],
        ['theme.primary_light', '#c084a0', 'string', 'design', 'Warna gradient sekunder', 1]
    ];

    const upsertSetting = db.prepare(`
        INSERT INTO app_settings (key, value, value_type, category, description, is_public)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(key) DO NOTHING
    `);
    defaultSettings.forEach((setting) => upsertSetting.run(...setting));
    console.log(`✅ Seeded default settings: ${defaultSettings.length}`);

    console.log('✅ Auth migration complete');
} catch (error) {
    console.error('❌ Auth migration failed:', error);
    process.exit(1);
} finally {
    db.close();
}
