/**
 * Auto Cleanup Utility
 * Automatically delete old analyses and images
 */

import sqlite3 from 'sqlite3';
import { deleteImageFile } from './imageStorage.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Delete analyses older than specified days
 * @param {number} days - Number of days to keep
 * @returns {Promise<object>} - Cleanup result
 */
export async function cleanupOldAnalyses(days = 30) {
    const dbPath = path.join(__dirname, '..', '..', '..', 'database', 'scripts', 'cantik_ai.db');
    
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                reject(err);
                return;
            }
            
            console.log(`🧹 Starting cleanup: Deleting analyses older than ${days} days...`);
            
            // Calculate cutoff date
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            const cutoffStr = cutoffDate.toISOString().split('T')[0];
        
            // Get old analyses
            db.all(`
                SELECT id, image_url, visualization_url 
                FROM analyses 
                WHERE created_at < ?
            `, [cutoffStr], async (err, oldAnalyses) => {
                if (err) {
                    db.close();
                    reject(err);
                    return;
                }
                
                console.log(`📊 Found ${oldAnalyses.length} old analyses`);
                
                if (oldAnalyses.length === 0) {
                    console.log('✅ No old analyses to delete');
                    db.close();
                    resolve({ deleted: 0, errors: 0 });
                    return;
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
                        await new Promise((resolveDelete, rejectDelete) => {
                            db.run('DELETE FROM analyses WHERE id = ?', [analysis.id], (err) => {
                                if (err) rejectDelete(err);
                                else resolveDelete();
                            });
                        });
                        deleted++;
                        
                    } catch (error) {
                        console.error(`❌ Error deleting analysis ${analysis.id}:`, error.message);
                        errors++;
                    }
                }
                
                // Vacuum database to reclaim space
                if (deleted > 0) {
                    console.log('🔧 Vacuuming database...');
                    db.run('VACUUM', (err) => {
                        if (err) {
                            console.error('❌ Vacuum error:', err);
                        }
                        db.close();
                        console.log(`✅ Cleanup complete: ${deleted} deleted, ${errors} errors`);
                        resolve({ deleted, errors });
                    });
                } else {
                    db.close();
                    console.log(`✅ Cleanup complete: ${deleted} deleted, ${errors} errors`);
                    resolve({ deleted, errors });
                }
            });
        });
    });
}

/**
 * Schedule automatic cleanup
 * @param {number} days - Number of days to keep
 * @param {number} intervalHours - Cleanup interval in hours
 */
export function scheduleAutoCleanup(days = 30, intervalHours = 24) {
    console.log(`⏰ Scheduling auto-cleanup: Every ${intervalHours} hours, delete analyses older than ${days} days`);
    
    // Run immediately
    cleanupOldAnalyses(days).catch(err => {
        console.error('❌ Initial cleanup error:', err);
    });
    
    // Schedule periodic cleanup
    setInterval(async () => {
        console.log('⏰ Running scheduled cleanup...');
        try {
            await cleanupOldAnalyses(days);
        } catch (err) {
            console.error('❌ Scheduled cleanup error:', err);
        }
    }, intervalHours * 60 * 60 * 1000);
}
