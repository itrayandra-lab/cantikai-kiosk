/**
 * Test Chat History - Verify messages are being retrieved correctly
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'cantik_ai.db');
const db = new Database(dbPath);

console.log('🧪 Testing Chat History Retrieval\n');

// Get all users
const users = db.prepare('SELECT id, name, email FROM users').all();
console.log(`👥 Found ${users.length} users\n`);

users.forEach(user => {
    console.log(`\n📋 User: ${user.name} (ID: ${user.id})`);
    console.log('─'.repeat(60));
    
    // Get sessions for this user
    const sessions = db.prepare('SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY created_at DESC').all(user.id);
    console.log(`💬 Sessions: ${sessions.length}`);
    
    sessions.forEach((session, index) => {
        // Get messages for this session
        const messages = db.prepare('SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC').all(session.id);
        
        console.log(`\n  ${index + 1}. Session ID: ${session.id}`);
        console.log(`     Title: ${session.title}`);
        console.log(`     Created: ${session.created_at}`);
        console.log(`     Messages: ${messages.length}`);
        
        if (messages.length > 0) {
            console.log(`     First message: "${messages[0].content.substring(0, 50)}..."`);
            console.log(`     Last message: "${messages[messages.length - 1].content.substring(0, 50)}..."`);
        } else {
            console.log(`     ⚠️  WARNING: Empty session (no messages)`);
        }
    });
});

// Summary
console.log('\n\n📊 SUMMARY');
console.log('─'.repeat(60));

const totalSessions = db.prepare('SELECT COUNT(*) as count FROM chat_sessions').get();
const totalMessages = db.prepare('SELECT COUNT(*) as count FROM chat_messages').get();
const emptySessions = db.prepare(`
    SELECT COUNT(*) as count 
    FROM chat_sessions cs 
    WHERE NOT EXISTS (
        SELECT 1 FROM chat_messages cm WHERE cm.session_id = cs.id
    )
`).get();

console.log(`Total Sessions: ${totalSessions.count}`);
console.log(`Total Messages: ${totalMessages.count}`);
console.log(`Empty Sessions: ${emptySessions.count}`);
console.log(`Sessions with Messages: ${totalSessions.count - emptySessions.count}`);

if (emptySessions.count > 0) {
    console.log('\n⚠️  WARNING: Found empty sessions!');
    console.log('Run cleanup-empty-sessions.js to remove them.');
}

db.close();
console.log('\n✅ Test complete!');
