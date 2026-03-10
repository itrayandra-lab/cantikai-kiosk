/**
 * Skin Analyzer Visualization Service
 * Generate 1 image with 15 analysis modes in grid layout (3x5)
 * Similar to professional skin analyzer machines
 */

/**
 * Generate single visualization image with 15 modes
 * @param {string} imageBase64 - Original image
 * @param {Object} analysisData - Analysis data from AI
 * @returns {Promise<string>} Base64 image with 15 grids
 */
export const generateSkinAnalyzerImage = async (imageBase64, analysisData) => {
    return new Promise((resolve, reject) => {
        try {
            console.log('🎨 Generating skin analyzer visualization...');
            
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                // Canvas setup - 3 columns x 5 rows
                const gridCols = 3;
                const gridRows = 5;
                const cellWidth = 300;
                const cellHeight = 400;
                const padding = 10;
                const labelHeight = 40;
                
                const canvasWidth = (cellWidth * gridCols) + (padding * (gridCols + 1));
                const canvasHeight = (cellHeight * gridRows) + (padding * (gridRows + 1)) + (labelHeight * gridRows);
                
                const canvas = document.createElement('canvas');
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                const ctx = canvas.getContext('2d');
                
                // Background - dark/black
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                
                // 15 Analysis Modes
                const modes = [
                    { name: 'RGB Pores', filter: 'pores', color: '#4ade80' },
                    { name: 'RGB Color Spot', filter: 'pigmentation', color: '#fbbf24' },
                    { name: 'RGB Texture', filter: 'texture', color: '#60a5fa' },
                    { name: 'PL Roughness', filter: 'roughness', color: '#fb923c' },
                    { name: 'UV Acne', filter: 'acne', color: '#ef4444' },
                    { name: 'UV Color Spot', filter: 'uv_spots', color: '#a78bfa' },
                    { name: 'UV Roughness', filter: 'uv_roughness', color: '#f472b6' },
                    { name: 'Skin Color Evenness', filter: 'evenness', color: '#34d399' },
                    { name: 'Brown Area', filter: 'brown', color: '#92400e' },
                    { name: 'UV Spot', filter: 'uv_damage', color: '#7c3aed' },
                    { name: 'Skin Aging', filter: 'aging', color: '#f59e0b' },
                    { name: 'Skin Whitening', filter: 'brightness', color: '#fde047' },
                    { name: 'Wrinkles Map', filter: 'wrinkles', color: '#fb7185' },
                    { name: 'Redness Map', filter: 'redness', color: '#dc2626' },
                    { name: 'Overall Analysis', filter: 'overall', color: '#10b981' }
                ];
                
                // Draw each grid cell
                modes.forEach((mode, index) => {
                    const col = index % gridCols;
                    const row = Math.floor(index / gridCols);
                    
                    const x = padding + (col * (cellWidth + padding));
                    const y = padding + (row * (cellHeight + labelHeight + padding));
                    
                    // Draw image with filter
                    ctx.save();
                    
                    // Calculate aspect ratio
                    const aspectRatio = img.width / img.height;
                    let drawWidth = cellWidth;
                    let drawHeight = cellHeight;
                    
                    if (aspectRatio > 1) {
                        drawHeight = cellWidth / aspectRatio;
                    } else {
                        drawWidth = cellHeight * aspectRatio;
                    }
                    
                    const offsetX = (cellWidth - drawWidth) / 2;
                    const offsetY = (cellHeight - drawHeight) / 2;
                    
                    // Apply filter based on mode
                    applyFilter(ctx, mode.filter, analysisData);
                    
                    // Draw image
                    ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
                    
                    ctx.restore();
                    
                    // Draw label background
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    ctx.fillRect(x, y + cellHeight, cellWidth, labelHeight);
                    
                    // Draw label text
                    ctx.fillStyle = mode.color;
                    ctx.font = 'bold 14px Inter, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(mode.name, x + cellWidth / 2, y + cellHeight + labelHeight / 2);
                    
                    // Draw border
                    ctx.strokeStyle = mode.color;
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x, y, cellWidth, cellHeight + labelHeight);
                });
                
                // Convert to base64
                const resultImage = canvas.toDataURL('image/jpeg', 0.9);
                console.log('✅ Skin analyzer visualization generated');
                resolve(resultImage);
            };
            
            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };
            
            img.src = imageBase64;
            
        } catch (error) {
            console.error('❌ Visualization generation error:', error);
            reject(error);
        }
    });
};

/**
 * Apply visual filter based on analysis mode
 */
function applyFilter(ctx, filterType, analysisData) {
    switch (filterType) {
        case 'pores':
            // Enhance pores visibility
            ctx.filter = 'contrast(1.3) brightness(1.1)';
            break;
            
        case 'pigmentation':
            // Highlight pigmentation
            ctx.filter = 'saturate(1.5) contrast(1.2)';
            break;
            
        case 'texture':
            // Show texture details
            ctx.filter = 'contrast(1.4) brightness(1.05)';
            break;
            
        case 'roughness':
            // Emphasize roughness
            ctx.filter = 'contrast(1.5) grayscale(0.3)';
            break;
            
        case 'acne':
            // UV light effect for acne
            ctx.filter = 'hue-rotate(200deg) saturate(2) brightness(0.8)';
            break;
            
        case 'uv_spots':
            // UV spots visualization
            ctx.filter = 'hue-rotate(180deg) saturate(1.8) contrast(1.3)';
            break;
            
        case 'uv_roughness':
            // UV roughness
            ctx.filter = 'hue-rotate(220deg) contrast(1.4) brightness(0.9)';
            break;
            
        case 'evenness':
            // Skin tone evenness
            ctx.filter = 'saturate(0.8) brightness(1.1)';
            break;
            
        case 'brown':
            // Brown/melanin areas
            ctx.filter = 'sepia(0.6) contrast(1.3)';
            break;
            
        case 'uv_damage':
            // UV damage visualization
            ctx.filter = 'hue-rotate(240deg) saturate(2) brightness(0.7)';
            break;
            
        case 'aging':
            // Aging signs
            ctx.filter = 'contrast(1.3) brightness(0.95) grayscale(0.2)';
            break;
            
        case 'brightness':
            // Skin brightness
            ctx.filter = 'brightness(1.3) contrast(1.1)';
            break;
            
        case 'wrinkles':
            // Wrinkles map
            ctx.filter = 'contrast(1.6) brightness(0.9) grayscale(0.4)';
            break;
            
        case 'redness':
            // Redness map
            ctx.filter = 'hue-rotate(330deg) saturate(2) brightness(1.1)';
            break;
            
        case 'overall':
            // Overall analysis - normal
            ctx.filter = 'none';
            break;
            
        default:
            ctx.filter = 'none';
    }
}

/**
 * Generate comparison image (Analysis vs Original)
 * @param {string} analysisImage - Generated analysis image
 * @param {string} originalImage - Original image
 * @returns {Promise<string>} Side-by-side comparison
 */
export const generateComparisonImage = async (analysisImage, originalImage) => {
    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const img1 = new Image();
            const img2 = new Image();
            
            let loaded = 0;
            
            const onLoad = () => {
                loaded++;
                if (loaded === 2) {
                    // Set canvas size
                    canvas.width = img1.width + img2.width + 20;
                    canvas.height = Math.max(img1.height, img2.height);
                    
                    // Background
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    // Draw analysis image
                    ctx.drawImage(img1, 0, 0);
                    
                    // Draw original image
                    ctx.drawImage(img2, img1.width + 20, 0);
                    
                    resolve(canvas.toDataURL('image/jpeg', 0.9));
                }
            };
            
            img1.onload = onLoad;
            img2.onload = onLoad;
            img1.onerror = reject;
            img2.onerror = reject;
            
            img1.src = analysisImage;
            img2.src = originalImage;
            
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    generateSkinAnalyzerImage,
    generateComparisonImage
};
