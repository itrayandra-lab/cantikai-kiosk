import sqlite3 from 'sqlite3';

const db = new Database('./database/scripts/cantik_ai.db');

console.log('\n=== ANALYSES TABLE SCHEMA ===');
const analysesSchema = db.prepare("PRAGMA table_info(analyses)").all();
console.log(analysesSchema);

console.log('\n=== CHAT_SESSIONS TABLE SCHEMA ===');
const chatSchema = db.prepare("PRAGMA table_info(chat_sessions)").all();
console.log(chatSchema);

db.close();
