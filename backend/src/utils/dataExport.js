/**
 * Data Export Utility
 * Export analyses to JSON/CSV for backup and analysis
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Export analyses to JSON
 * @param {number} userId - User ID (optional, exports all if not provided)
 * @returns {Promise<object>} - Export result
 */
export async function exportToJSON(userId = null) {
    const dbPath = path.join(__dirname, '..', '..', 'database', 'cantik_ai.db');
    
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                reject(err);
                return;
            }
            
            console.log('📤 Exporting analyses to JSON...');
            
            // Get analyses
            const query = userId 
                ? 'SELECT * FROM analyses WHERE user_id = ? ORDER BY created_at DESC'
                : 'SELECT * FROM analyses ORDER BY created_at DESC';
        
        const analyses = userId 
            ? db.prepare(query).all(userId)
            : db.prepare(query).all();
        
        // Parse JSON fields
        analyses.forEach(analysis => {
            if (analysis.cv_metrics) analysis.cv_metrics = JSON.parse(analysis.cv_metrics);
            if (analysis.vision_analysis) analysis.vision_analysis = JSON.parse(analysis.vision_analysis);
            if (analysis.ai_insights) analysis.ai_insights = JSON.parse(analysis.ai_insights);
        });
        
        // Create export directory
        const exportDir = path.join(__dirname, '..', '..', 'exports');
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }
        
        // Generate filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = userId 
            ? `analyses_user${userId}_${timestamp}.json`
            : `analyses_all_${timestamp}.json`;
        const filepath = path.join(exportDir, filename);
        
        // Write to file
        fs.writeFileSync(filepath, JSON.stringify(analyses, null, 2));
        
        console.log(`✅ Exported ${analyses.length} analyses to ${filename}`);
        
        return {
            success: true,
            count: analyses.length,
            filepath,
            filename
        };
        
    } catch (error) {
        console.error('❌ Export error:', error);
        throw error;
    } finally {
        db.close();
    }
}

/**
 * Export analyses to CSV
 * @param {number} userId - User ID (optional)
 * @returns {object} - Export result
 */
export function exportToCSV(userId = null) {
    const dbPath = path.join(__dirname, '..', '..', 'database', 'cantik_ai.db');
    const db = new Database(dbPath);
    
    try {
        console.log('📤 Exporting analyses to CSV...');
        
        // Get analyses
        const query = userId 
            ? 'SELECT id, user_id, overall_score, skin_type, fitzpatrick_type, predicted_age, analysis_version, engine, created_at FROM analyses WHERE user_id = ? ORDER BY created_at DESC'
            : 'SELECT id, user_id, overall_score, skin_type, fitzpatrick_type, predicted_age, analysis_version, engine, created_at FROM analyses ORDER BY created_at DESC';
        
        const analyses = userId 
            ? db.prepare(query).all(userId)
            : db.prepare(query).all();
        
        if (analyses.length === 0) {
            throw new Error('No analyses to export');
        }
        
        // Create CSV header
        const headers = Object.keys(analyses[0]);
        let csv = headers.join(',') + '\n';
        
        // Add rows
        analyses.forEach(analysis => {
            const row = headers.map(header => {
                const value = analysis[header];
                // Escape commas and quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value || '';
            });
            csv += row.join(',') + '\n';
        });
        
        // Create export directory
        const exportDir = path.join(__dirname, '..', '..', 'exports');
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }
        
        // Generate filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = userId 
            ? `analyses_user${userId}_${timestamp}.csv`
            : `analyses_all_${timestamp}.csv`;
        const filepath = path.join(exportDir, filename);
        
        // Write to file
        fs.writeFileSync(filepath, csv);
        
        console.log(`✅ Exported ${analyses.length} analyses to ${filename}`);
        
        return {
            success: true,
            count: analyses.length,
            filepath,
            filename
        };
        
    } catch (error) {
        console.error('❌ Export error:', error);
        throw error;
    } finally {
        db.close();
    }
}
