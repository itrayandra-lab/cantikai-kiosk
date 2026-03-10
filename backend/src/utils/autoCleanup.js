/**
 * Auto Cleanup Utility
 * Automatically delete old analyses and images
 */

import Database from 'better-sqlite3';
import { deleteImageFile } from './imageStorage.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Delete analyses older than specified days
 * @param {number} days - Number of days to keep
 * @returns {object} - Cleanup result
 */
export function cleanupOldAnalyses(days = 30) {
    const dbPath = path.join(__dirname, '..', '..', '..', 'database', 'scripts', 'cantik_ai.db');
    const db = new Database(dbPath);
    
    try {
        console.log(`🧹 Starting cleanup: Deleting analyses older than ${days} days...`);
        
        // Calculate cutoff date
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const cutoffStr = cutoffDate.toISOString().split('T')[0];
        
        // Get old analyses
        const oldAnalyses = db.prepare(`
            SELECT id, image_url, visualization_url 
            FROM analyses 
            WHERE created_at < ?
        `).all(cutoffStr);
        
        console.log(`📊 Found ${oldAnalyses.length} old analyses`);
        
        if (oldAnalyses.length === 0) {
            console.log('✅ No old analyses to delete');
            return { deleted: 0, errors: 0 };
        }
        
        let deleted = 0;
        let errors = 0;
        
        // Delete each analysis and its images
        for (const analysis of oldAnalyses) {
            try {
                // Delete image files
                if (analysis.image_url && !analysis.image_url.startsWith('data:')) {
                    deleteImageFile(analysis.image_url);
                }
                if (analysis.visualization_url && !analysis.visualization_url.startsWith('data:')) {
                    deleteImageFile(analysis.visualization_url);
                }
                
                // Delete from database
                db.prepare('DELETE FROM analyses WHERE id = ?').run(analysis.id);
                deleted++;
                
            } catch (error) {
                console.error(`❌ Error deleting analysis ${analysis.id}:`, error.message);
                errors++;
            }
        }
        
        // Vacuum database to reclaim space
        if (deleted > 0) {
            console.log('🔧 Vacuuming database...');
            db.exec('VACUUM');
        }
        
        console.log(`✅ Cleanup complete: ${deleted} deleted, ${errors} errors`);
        
        return { deleted, errors };
        
    } catch (error) {
        console.error('❌ Cleanup error:', error);
        throw error;
    } finally {
        db.close();
    }
}

/**
 * Schedule automatic cleanup
 * @param {number} days - Number of days to keep
 * @param {number} intervalHours - Cleanup interval in hours
 */
export function scheduleAutoCleanup(days = 30, intervalHours = 24) {
    console.log(`⏰ Scheduling auto-cleanup: Every ${intervalHours} hours, delete analyses older than ${days} days`);
    
    // Run immediately
    cleanupOldAnalyses(days);
    
    // Schedule periodic cleanup
    setInterval(() => {
        console.log('⏰ Running scheduled cleanup...');
        cleanupOldAnalyses(days);
    }, intervalHours * 60 * 60 * 1000);
}
