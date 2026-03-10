/**
 * Image Storage Utility
 * Saves images to file system instead of database (base64 is too heavy)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base upload directory
const UPLOAD_BASE = path.join(__dirname, '..', '..', '..', 'uploads', 'images');

/**
 * Ensure directory exists
 */
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function normalizeRelativePath(relativePath) {
    return String(relativePath || '').replace(/^\/+/, '').replace(/\\/g, '/');
}

/**
 * Save base64 image to file system
 * @param {string} base64Image - Base64 encoded image (with or without data:image prefix)
 * @param {number} userId - User ID
 * @param {string} type - Image type: 'original' or 'visualization'
 * @returns {string} - Relative file path
 */
export function saveImageToFile(base64Image, userId, type = 'original') {
    try {
        // Extract base64 data (remove data:image/jpeg;base64, prefix if exists)
        const base64Data = base64Image.includes(',') 
            ? base64Image.split(',')[1] 
            : base64Image;
        
        // Create directory structure: uploads/images/{type}/{userId}/
        const userDir = path.join(UPLOAD_BASE, type, userId.toString());
        ensureDirectoryExists(userDir);
        
        // Generate filename with timestamp
        const timestamp = Date.now();
        const filename = `${timestamp}.jpg`;
        const filePath = path.join(userDir, filename);
        
        // Save image
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(filePath, buffer);
        
        // Return relative path (for database storage)
        const relativePath = normalizeRelativePath(path.join('uploads', 'images', type, userId.toString(), filename));
        
        console.log(`✅ Image saved: ${relativePath}`);
        return relativePath;
        
    } catch (error) {
        console.error('❌ Error saving image:', error);
        throw new Error(`Failed to save image: ${error.message}`);
    }
}

/**
 * Delete image file
 * @param {string} relativePath - Relative file path
 */
export function deleteImageFile(relativePath) {
    try {
        const normalizedPath = normalizeRelativePath(relativePath);
        if (!normalizedPath) return;
        const fullPath = path.join(__dirname, '..', '..', '..', normalizedPath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`✅ Image deleted: ${normalizedPath}`);
        }
    } catch (error) {
        console.error('❌ Error deleting image:', error);
    }
}

/**
 * Read image file and convert to base64
 * @param {string} relativePath - Relative file path
 * @returns {string} - Base64 encoded image with data URI prefix
 */
export function readImageAsBase64(relativePath) {
    try {
        const normalizedPath = normalizeRelativePath(relativePath);
        const fullPath = path.join(__dirname, '..', '..', '..', normalizedPath);
        if (!fs.existsSync(fullPath)) {
            throw new Error('Image file not found');
        }
        
        const buffer = fs.readFileSync(fullPath);
        const base64 = buffer.toString('base64');
        return `data:image/jpeg;base64,${base64}`;
        
    } catch (error) {
        console.error('❌ Error reading image:', error);
        throw new Error(`Failed to read image: ${error.message}`);
    }
}

/**
 * Get image URL for serving
 * @param {string} relativePath - Relative file path
 * @returns {string} - URL path
 */
export function getImageUrl(relativePath) {
    // Convert file path to URL path
    return `/${normalizeRelativePath(relativePath)}`;
}
