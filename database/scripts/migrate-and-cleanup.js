/**
 * Database Migration and Cleanup Script
 * 1. Add new columns to analyses table
 * 2. Delete old data (ID 1-11)
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'cantik_ai.db');
const db = new Database(dbPath);

console.log('🔧 Starting database migration and cleanup...');
console.log(`📍 Database path: ${dbPath}`);

// Enable WAL mode
db.pragma('journal_mode = WAL');

try {
    // Step 1: Add new columns if they don't exist
    console.log('\n📝 Step 1: Adding new columns...');
    
    const columnsToAdd = [
        { name: 'visualization_url', type: 'TEXT', default: null },
        { name: 'fitzpatrick_type', type: 'TEXT', default: null },
        { name: 'predicted_age', type: 'INTEGER', default: null },
        { name: 'analysis_version', type: 'TEXT', default: null },
        { name: 'engine', type: 'TEXT', default: null },
        { name: 'processing_time_ms', type: 'INTEGER', default: null }
    ];
    
    for (const column of columnsToAdd) {
        try {
            const sql = `ALTER TABLE analyses ADD COLUMN ${column.name} ${column.type}${column.default !== null ? ` DEFAULT ${column.default}` : ''}`;
            db.exec(sql);
            console.log(`✅ Added column: ${column.name}`);
        } catch (error) {
            if (error.message.includes('duplicate column name')) {
                console.log(`⏭️  Column already exists: ${column.name}`);
            } else {
                throw error;
            }
        }
    }
    
    // Step 2: Delete old data (ID 1-11)
    console.log('\n🗑️  Step 2: Deleting old data (ID 1-11)...');
    
    const deleteStmt = db.prepare('DELETE FROM analyses WHERE id BETWEEN 1 AND 11');
    const result = deleteStmt.run();
    
    console.log(`✅ Deleted ${result.changes} old records`);
    
    // Step 3: Show current data count
    console.log('\n📊 Step 3: Current database status...');
    
    const countStmt = db.prepare('SELECT COUNT(*) as count FROM analyses');
    const count = countStmt.get();
    
    console.log(`📊 Total analyses remaining: ${count.count}`);
    
    // Step 4: Show sample of remaining data
    if (count.count > 0) {
        console.log('\n📋 Sample of remaining data:');
        const sampleStmt = db.prepare('SELECT id, user_id, overall_score, skin_type, fitzpatrick_type, predicted_age, analysis_version, engine, created_at FROM analyses ORDER BY id LIMIT 5');
        const samples = sampleStmt.all();
        
        samples.forEach(sample => {
            console.log(`  ID ${sample.id}: Score ${sample.overall_score}, Type ${sample.skin_type}, Age ${sample.predicted_age || 'N/A'}, Version ${sample.analysis_version || 'N/A'}`);
        });
    }
    
    console.log('\n✅ Migration and cleanup complete!');
    console.log('📊 Database is ready for optimized storage');
    
} catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
} finally {
    db.close();
}
