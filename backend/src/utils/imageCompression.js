/**
 * Image Compression Utility
 * Compress images before saving to reduce file size
 * Uses native Node.js without external dependencies
 */

import { Buffer } from 'buffer';

/**
 * Compress base64 image (simple version without sharp)
 * @param {string} base64Image - Base64 encoded image
 * @param {object} options - Compression options
 * @returns {string} - Original or compressed base64 image
 */
export function compressImage(base64Image, options = {}) {
    try {
        const {
            quality = 0.8,
            maxSize = 500 // KB
        } = options;
        
        // Extract base64 data
        const base64Data = base64Image.includes(',') 
            ? base64Image.split(',')[1] 
            : base64Image;
        
        // Calculate size
        const buffer = Buffer.from(base64Data, 'base64');
        const sizeKB = buffer.length / 1024;
        
        console.log(`📊 Image size: ${sizeKB.toFixed(1)}KB`);
        
        // If image is already small enough, return as is
        if (sizeKB <= maxSize) {
            console.log(`✅ Image size OK, no compression needed`);
            return base64Image;
        }
        
        // For now, return original (compression will be done client-side)
        console.log(`⚠️  Image large (${sizeKB.toFixed(1)}KB), consider client-side compression`);
        return base64Image;
        
    } catch (error) {
        console.error('❌ Image compression error:', error);
        return base64Image;
    }
}

/**
 * Create thumbnail (placeholder for future implementation)
 * @param {string} base64Image - Base64 encoded image
 * @returns {string} - Thumbnail
 */
export function createThumbnail(base64Image) {
    return compressImage(base64Image, {
        quality: 0.7,
        maxSize: 200
    });
}

