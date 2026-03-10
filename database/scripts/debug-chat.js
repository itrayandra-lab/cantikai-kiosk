/**
 * Debug Chat Messages
 * Check chat sessions and messages in database
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'cantik_ai.db');
const db = new Database(dbPath);

console.log('🔍 Debugging Chat Data...\n');

// Get all users
console.log('👥 USERS:');
const users = db.prepare('SELECT * FROM users LIMIT 5').all();
console.table(users);

// Get all chat sessions
console.log('\n💬 CHAT SESSIONS:');
const sessions = db.prepare(`
    SELECT 
        cs.id,
        cs.user_id,
        cs.title,
        cs.created_at,
        cs.updated_at,
        COUNT(cm.id) as message_count
    FROM chat_sessions cs
    LEFT JOIN chat_messages cm ON cs.id = cm.session_id
    GROUP BY cs.id
    ORDER BY cs.created_at DESC
`).all();
console.table(sessions);

// Get all chat messages
console.log('\n📝 CHAT MESSAGES:');
const messages = db.prepare(`
    SELECT 
        cm.id,
        cm.session_id,
        cm.role,
        SUBSTR(cm.content, 1, 50) as content_preview,
        cm.created_at,
        cs.title as session_title,
        cs.user_id
    FROM chat_messages cm
    JOIN chat_sessions cs ON cm.session_id = cs.id
    ORDER BY cm.created_at DESC
    LIMIT 20
`).all();
console.table(messages);

// Get message count per session
console.log('\n📊 MESSAGE COUNT PER SESSION:');
const messageCounts = db.prepare(`
    SELECT 
        cs.id as session_id,
        cs.title,
        cs.user_id,
        COUNT(cm.id) as message_count,
        MAX(cm.created_at) as last_message_at
    FROM chat_sessions cs
    LEFT JOIN chat_messages cm ON cs.id = cm.session_id
    GROUP BY cs.id
    ORDER BY last_message_at DESC
`).all();
console.table(messageCounts);

// Check for orphaned messages (messages without session)
console.log('\n🔍 CHECKING FOR ORPHANED MESSAGES:');
const orphanedMessages = db.prepare(`
    SELECT cm.*
    FROM chat_messages cm
    LEFT JOIN chat_sessions cs ON cm.session_id = cs.id
    WHERE cs.id IS NULL
`).all();
if (orphanedMessages.length > 0) {
    console.log('⚠️ Found orphaned messages:');
    console.table(orphanedMessages);
} else {
    console.log('✅ No orphaned messages found');
}

// Check for empty sessions
console.log('\n🔍 CHECKING FOR EMPTY SESSIONS:');
const emptySessions = db.prepare(`
    SELECT cs.*
    FROM chat_sessions cs
    LEFT JOIN chat_messages cm ON cs.id = cm.session_id
    WHERE cm.id IS NULL
`).all();
if (emptySessions.length > 0) {
    console.log('⚠️ Found empty sessions:');
    console.table(emptySessions);
} else {
    console.log('✅ No empty sessions found');
}

// Summary
console.log('\n📊 SUMMARY:');
const summary = {
    total_users: users.length,
    total_sessions: sessions.length,
    total_messages: db.prepare('SELECT COUNT(*) as count FROM chat_messages').get().count,
    sessions_with_messages: sessions.filter(s => s.message_count > 0).length,
    empty_sessions: sessions.filter(s => s.message_count === 0).length
};
console.table(summary);

db.close();
console.log('\n✅ Debug complete!');
