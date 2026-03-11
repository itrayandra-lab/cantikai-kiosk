/**
 * Cleanup Empty Chat Sessions
 * Delete sessions that have 0 messages
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'cantik_ai.db');
const db = new Database(dbPath);

console.log('🧹 Cleaning up empty chat sessions...\n');

// Find empty sessions
const emptySessions = db.prepare(`
    SELECT cs.*
    FROM chat_sessions cs
    LEFT JOIN chat_messages cm ON cs.id = cm.session_id
    WHERE cm.id IS NULL
`).all();

console.log(`📊 Found ${emptySessions.length} empty sessions`);

if (emptySessions.length > 0) {
    console.log('\n🗑️ Deleting empty sessions:');
    console.table(emptySessions.map(s => ({
        id: s.id,
        user_id: s.user_id,
        title: s.title,
        created_at: s.created_at
    })));
    
    // Delete empty sessions
    const deleteStmt = db.prepare('DELETE FROM chat_sessions WHERE id = ?');
    
    let deleted = 0;
    for (const session of emptySessions) {
        deleteStmt.run(session.id);
        deleted++;
    }
    
    console.log(`\n✅ Deleted ${deleted} empty sessions`);
} else {
    console.log('✅ No empty sessions found');
}

// Show remaining sessions
const remainingSessions = db.prepare(`
    SELECT 
        cs.id,
        cs.user_id,
        cs.title,
        COUNT(cm.id) as message_count
    FROM chat_sessions cs
    LEFT JOIN chat_messages cm ON cs.id = cm.session_id
    GROUP BY cs.id
    ORDER BY cs.created_at DESC
`).all();

console.log(`\n📊 Remaining sessions: ${remainingSessions.length}`);
console.table(remainingSessions);

db.close();
console.log('\n✅ Cleanup complete!');
