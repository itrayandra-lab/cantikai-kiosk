/**
 * Cleanup Old Base64 Data
 * Delete analyses with base64 images (old data) to reduce database size
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'cantik_ai.db');
const db = new Database(dbPath);

console.log('🧹 Cleaning up old base64 data...');
console.log(`📍 Database path: ${dbPath}`);

// Enable WAL mode
db.pragma('journal_mode = WAL');

try {
    // Get database size before cleanup
    const beforeSize = db.prepare('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()').get();
    console.log(`📊 Database size before: ${(beforeSize.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Count analyses with base64 (image_url length > 100 = base64)
    const base64Count = db.prepare('SELECT COUNT(*) as count FROM analyses WHERE LENGTH(image_url) > 100').get();
    console.log(`📊 Analyses with base64: ${base64Count.count}`);
    
    // Count analyses with file path (image_url length <= 100 = path)
    const pathCount = db.prepare('SELECT COUNT(*) as count FROM analyses WHERE LENGTH(image_url) <= 100 AND LENGTH(image_url) > 0').get();
    console.log(`📊 Analyses with file path: ${pathCount.count}`);
    
    if (base64Count.count > 0) {
        console.log('\n🗑️  Deleting old base64 data...');
        
        // Delete analyses with base64 images
        const deleteStmt = db.prepare('DELETE FROM analyses WHERE LENGTH(image_url) > 100');
        const result = deleteStmt.run();
        
        console.log(`✅ Deleted ${result.changes} old records with base64`);
        
        // Vacuum to reclaim space
        console.log('\n🔧 Vacuuming database to reclaim space...');
        db.exec('VACUUM');
        console.log('✅ Vacuum complete');
        
        // Get database size after cleanup
        const afterSize = db.prepare('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()').get();
        console.log(`\n📊 Database size after: ${(afterSize.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`💾 Space saved: ${((beforeSize.size - afterSize.size) / 1024 / 1024).toFixed(2)} MB`);
    } else {
        console.log('\n✅ No old base64 data found. Database is clean!');
    }
    
    // Show remaining data
    console.log('\n📋 Remaining analyses:');
    const remaining = db.prepare('SELECT id, user_id, overall_score, skin_type, created_at FROM analyses ORDER BY id DESC LIMIT 10').all();
    
    if (remaining.length > 0) {
        remaining.forEach(r => {
            console.log(`  ID ${r.id}: User ${r.user_id}, Score ${r.overall_score}, Type ${r.skin_type}, Date ${r.created_at}`);
        });
    } else {
        console.log('  No analyses found');
    }
    
    console.log('\n✅ Cleanup complete!');
    
} catch (error) {
    console.error('❌ Cleanup error:', error);
    process.exit(1);
} finally {
    db.close();
}
