import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'cantik_ai.db');
const db = new Database(dbPath);

console.log('📊 Checking database schema...\n');

const tables = ['users', 'analyses', 'products', 'articles', 'banners', 'chat_sessions', 'chat_messages', 'admins'];

tables.forEach(table => {
    console.log(`\n=== ${table.toUpperCase()} ===`);
    const columns = db.prepare(`PRAGMA table_info(${table})`).all();
    columns.forEach(col => {
        console.log(`  ${col.name} (${col.type})`);
    });
});

db.close();
