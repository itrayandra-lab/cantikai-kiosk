/**
 * Image Visualization Service - 15 DIFFERENT MODES
 * Generate 15 different visualization images like professional skin analyzer
 * Each mode shows different analysis aspect (RGB, UV, PL, etc.)
 * 
 * Modes:
 * 1. RGB Pores - Pore visibility analysis
 * 2. RGB Color Spot - Color spot detection
 * 3. RGB Texture - Texture analysis
 * 4. PL Roughness - Polarized light roughness
 * 5. UV Acne - UV acne detection
 * 6. UV Color Spot - UV color spot analysis
 * 7. UV Roughness - UV roughness detection
 * 8. Skin Color Evenness - Tone uniformity
 * 9. Brown Area - Pigmentation mapping
 * 10. UV Spot - UV damage spots
 * 11. Skin Aging - Aging signs analysis
 * 12. Skin Whitening - Brightness analysis
 * 13. Wrinkles Map - Wrinkle detection
 * 14. Redness Map - Redness distribution
 * 15. Overall Analysis - Combined view
 */

/**
 * Generate ALL 15 visualization modes
 * @param {string} originalImageBase64 - Original face image
 * @param {Object} analysisData - Analysis results
 * @returns {Promise<Array>} Array of 15 visualization images
 */
export const generateVisualizationImage = async (originalImageBase64, analysisData) => {
    try {
        console.log('🎨 Starting 15-MODE visualization generation...');
        
        // Load original image
        const img = await loadImage(originalImageBase64);
        
        // Generate all 15 modes
        const visualizations = [];
        
        visualizations.push(await generateMode1_RGBPores(img, analysisData));
        visualizations.push(await generateMode2_RGBColorSpot(img, analysisData));
        visualizations.push(await generateMode3_RGBTexture(img, analysisData));
        visualizations.push(await generateMode4_PLRoughness(img, analysisData));
        visualizations.push(await generateMode5_UVAcne(img, analysisData));
        visualizations.push(await generateMode6_UVColorSpot(img, analysisData));
        visualizations.push(await generateMode7_UVRoughness(img, analysisData));
        visualizations.push(await generateMode8_SkinColorEvenness(img, analysisData));
        visualizations.push(await generateMode9_BrownArea(img, analysisData));
        visualizations.push(await generateMode10_UVSpot(img, analysisData));
        visualizations.push(await generateMode11_SkinAging(img, analysisData));
        visualizations.push(await generateMode12_SkinWhitening(img, analysisData));
        visualizations.push(await generateMode13_WrinklesMap(img, analysisData));
        visualizations.push(await generateMode14_RednessMap(img, analysisData));
        visualizations.push(await generateMode15_OverallAnalysis(img, analysisData));
        
        console.log(`✅ Generated ${visualizations.length} visualization modes`);
        return visualizations;
        
    } catch (error) {
        console.error('❌ Visualization generation error:', error);
        throw error;
    }
};

/**
 * Load image from base64
 */
function loadImage(base64) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = base64;
    });
}

/**
 * Create base canvas with black background and face-focused image
 */
function createBaseCanvas(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 800;
    
    // Fill with BLACK background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calculate face-focused crop (zoom to center, assume face is centered)
    const size = Math.min(img.width, img.height);
    const sx = (img.width - size) / 2;
    const sy = (img.height - size) / 2;
    
    // Draw face image centered
    ctx.drawImage(img, sx, sy, size, size, 0, 0, canvas.width, canvas.height);
    
    return { canvas, ctx };
}

/**
 * MODE 1: RGB Pores - Pore visibility analysis
 */
async function generateMode1_RGBPores(img, data) {
    const { canvas, ctx } = createBaseCanvas(img);
    
    // Apply pore detection filter (enhance contrast)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    for (let i = 0; i < pixels.length; i += 4) {
        // Enhance pores by increasing contrast
        const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        const contrast = 1.5;
        pixels[i] = Math.min(255, (pixels[i] - avg) * contrast + avg);
        pixels[i + 1] = Math.min(255, (pixels[i + 1] - avg) * contrast + avg);
        pixels[i + 2] = Math.min(255, (pixels[i + 2] - avg) * contrast + avg);
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Add overlay markers for pore areas
    drawPoreMarkers(ctx, data, canvas.width, canvas.height);
    
    // Add title
    drawModeTitle(ctx, 'RGB Pores', data.pores?.pore_density || 0, canvas.width);
    
    return {
        mode: 'RGB Pores',
        image: canvas.toDataURL('image/jpeg', 0.95),
        score: data.pores?.texture_score || 70,
        description: `Pore Density: ${data.pores?.pore_density || 0}/10, Enlarged Pores: ${data.pores?.enlarged_pores_count || 0}`
    };
}

/**
 * MODE 2: RGB Color Spot - Color spot detection
 */
async function generateMode2_RGBColorSpot(img, data) {
    const { canvas, ctx } = createBaseCanvas(img);
    
    // Apply color spot detection (highlight pigmentation)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    for (let i = 0; i < pixels.length; i += 4) {
        // Detect dark spots (pigmentation)
        const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        if (brightness < 120) {
            // Highlight dark spots in red
            pixels[i] = Math.min(255, pixels[i] + 50);
            pixels[i + 1] = Math.max(0, pixels[i + 1] - 30);
            pixels[i + 2] = Math.max(0, pixels[i + 2] - 30);
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Add overlay for pigmentation areas
    drawPigmentationOverlay(ctx, data, canvas.width, canvas.height);
    
    drawModeTitle(ctx, 'RGB Color Spot', data.pigmentation?.dark_spot_count || 0, canvas.width);
    
    return {
        mode: 'RGB Color Spot',
        image: canvas.toDataURL('image/jpeg', 0.95),
        score: data.pigmentation?.uniformity_score || 80,
        description: `Dark Spots: ${data.pigmentation?.dark_spot_count || 0}, Melanin Index: ${data.pigmentation?.melanin_index || 0}`
    };
}

/**
 * MODE 3: RGB Texture - Texture analysis
 */
async function generateMode3_RGBTexture(img, data) {
    const { canvas, ctx } = createBaseCanvas(img);
    
    // Apply texture enhancement
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Edge detection for texture
    for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
            const i = (y * canvas.width + x) * 4;
            const iUp = ((y - 1) * canvas.width + x) * 4;
            const iDown = ((y + 1) * canvas.width + x) * 4;
            
            const diff = Math.abs(pixels[i] - pixels[iUp]) + Math.abs(pixels[i] - pixels[iDown]);
            
            if (diff > 30) {
                // Highlight texture irregularities
                pixels[i] = Math.min(255, pixels[i] + 30);
                pixels[i + 1] = Math.min(255, pixels[i + 1] + 20);
                pixels[i + 2] = pixels[i + 2];
            }
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    drawModeTitle(ctx, 'RGB Texture', data.texture?.smoothness_score || 70, canvas.width);
    
    return {
        mode: 'RGB Texture',
        image: canvas.toDataURL('image/jpeg', 0.95),
        score: data.texture?.smoothness_score || 70,
        description: `Smoothness: ${data.texture?.smoothness_score || 0}/100, Roughness: ${data.texture?.roughness_score || 0}/100`
    };
}

/**
 * MODE 4: PL Roughness - Polarized light roughness
 */
async function generateMode4_PLRoughness(img, data) {
    const { canvas, ctx } = createBaseCanvas(img);
    
    // Simulate polarized light effect (grayscale with enhanced edges)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    for (let i = 0; i < pixels.length; i += 4) {
        const gray = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        pixels[i] = gray;
        pixels[i + 1] = gray;
        pixels[i + 2] = gray + 20; // Slight blue tint
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    drawModeTitle(ctx, 'PL Roughness', data.texture?.roughness_score || 30, canvas.width);
    
    return {
        mode: 'PL Roughness',
        image: canvas.toDataURL('image/jpeg', 0.95),
        score: 100 - (data.texture?.roughness_score || 30),
        description: `Roughness Score: ${data.texture?.roughness_score || 0}/100`
    };
}

/**
 * MODE 5: UV Acne - UV acne detection
 */
async function generateMode5_UVAcne(img, data) {
    const { canvas, ctx } = createBaseCanvas(img);
    
    // Simulate UV light (purple/blue tint with acne highlighting)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    for (let i = 0; i < pixels.length; i += 4) {
        // UV effect - purple tint
        pixels[i] = Math.min(255, pixels[i] * 0.8 + 50); // Red
        pixels[i + 1] = Math.min(255, pixels[i + 1] * 0.7); // Green
        pixels[i + 2] = Math.min(255, pixels[i + 2] * 1.2 + 30); // Blue (enhanced)
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Draw acne markers
    drawAcneMarkers(ctx, data, canvas.width, canvas.height);
    
    drawModeTitle(ctx, 'UV Acne', data.acne?.acne_count || 0, canvas.width);
    
    return {
        mode: 'UV Acne',
        image: canvas.toDataURL('image/jpeg', 0.95),
        score: 100 - (data.acne?.acne_score || 0),
        description: `Acne Count: ${data.acne?.acne_count || 0}, Severity: ${data.acne?.severity || 'None'}`
    };
}

/**
 * MODE 6: UV Color Spot - UV color spot analysis
 */
async function generateMode6_UVColorSpot(img, data) {
    const { canvas, ctx } = createBaseCanvas(img);
    
    // UV color spot detection
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    for (let i = 0; i < pixels.length; i += 4) {
        const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        
        // Highlight spots with UV effect
        if (brightness < 130 || brightness > 200) {
            pixels[i] = Math.min(255, pixels[i] + 40);
            pixels[i + 1] = Math.min(255, pixels[i + 1] * 0.8);
            pixels[i + 2] = Math.min(255, pixels[i + 2] + 60);
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    drawModeTitle(ctx, 'UV Color Spot', data.pigmentation?.dark_spot_count || 0, canvas.width);
    
    return {
        mode: 'UV Color Spot',
        image: canvas.toDataURL('image/jpeg', 0.95),
        score: data.pigmentation?.uniformity_score || 80,
        description: `UV Spots Detected: ${data.pigmentation?.dark_spot_count || 0}`
    };
}

/**
 * MODE 7: UV Roughness - UV roughness detection
 */
async function generateMode7_UVRoughness(img, data) {
    const { canvas, ctx } = createBaseCanvas(img);
    
    // UV roughness with blue/purple tint
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    for (let i = 0; i < pixels.length; i += 4) {
        const gray = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        pixels[i] = gray * 0.7 + 40;
        pixels[i + 1] = gray * 0.6 + 20;
        pixels[i + 2] = gray * 1.1 + 50;
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    drawModeTitle(ctx, 'UV Roughness', data.texture?.roughness_score || 30, canvas.width);
    
    return {
        mode: 'UV Roughness',
        image: canvas.toDataURL('image/jpeg', 0.95),
        score: 100 - (data.texture?.roughness_score || 30),
        description: `Surface Irregularity: ${data.texture?.texture_features?.surface_irregularity || 0}/100`
    };
}

/**
 * MODE 8: Skin Color Evenness - Tone uniformity
 */
async function generateMode8_SkinColorEvenness(img, data) {
    const { canvas, ctx } = createBaseCanvas(img);
    
    // Analyze color evenness with heatmap
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Calculate average skin tone
    let avgR = 0, avgG = 0, avgB = 0, count = 0;
    for (let i = 0; i < pixels.length; i += 4) {
        avgR += pixels[i];
        avgG += pixels[i + 1];
        avgB += pixels[i + 2];
        count++;
    }
    avgR /= count;
    avgG /= count;
    avgB /= count;
    
    // Highlight deviations from average
    for (let i = 0; i < pixels.length; i += 4) {
        const diffR = Math.abs(pixels[i] - avgR);
        const diffG = Math.abs(pixels[i + 1] - avgG);
        const diffB = Math.abs(pixels[i + 2] - avgB);
        const totalDiff = (diffR + diffG + diffB) / 3;
        
        if (totalDiff > 20) {
            // Highlight uneven areas
            pixels[i] = Math.min(255, pixels[i] + totalDiff);
            pixels[i + 1] = Math.max(0, pixels[i + 1] - totalDiff / 2);
            pixels[i + 2] = Math.max(0, pixels[i + 2] - totalDiff / 2);
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    drawModeTitle(ctx, 'Skin Color Evenness', data.skin_tone?.uniformity_score || 80, canvas.width);
    
    return {
        mode: 'Skin Color Evenness',
        image: canvas.toDataURL('image/jpeg', 0.95),
        score: data.skin_tone?.uniformity_score || 80,
        description: `Uniformity: ${data.skin_tone?.uniformity_score || 0}/100, Evenness: ${data.skin_tone?.evenness || 'Good'}`
    };
}

/**
 * MODE 9: Brown Area - Pigmentation mapping
 */
async function generateMode9_BrownArea(img, data) {
    const { canvas, ctx } = createBaseCanvas(img);
    
    // Highlight brown/pigmented areas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        
        // Detect brown tones (high red, medium green, low blue)
        if (r > g && g > b && r - b > 30) {
            // Enhance brown areas
            pixels[i] = Math.min(255, r + 40);
            pixels[i + 1] = Math.min(255, g + 20);
            pixels[i + 2] = b;
        } else {
            // Desaturate non-brown areas
            const gray = (r + g + b) / 3;
            pixels[i] = gray;
            pixels[i + 1] = gray;
            pixels[i + 2] = gray;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    drawModeTitle(ctx, 'Brown Area', data.pigmentation?.pigmentation_area || 0, canvas.width);
    
    return {
        mode: 'Brown Area',
        image: canvas.toDataURL('image/jpeg', 0.95),
        score: 100 - (data.pigmentation?.melanin_index || 0),
        description: `Pigmentation Area: ${data.pigmentation?.pigmentation_area || 0}%, Melanin: ${data.pigmentation?.melanin_index || 0}`
    };
}

/**
 * MODE 10: UV Spot - UV damage spots
 */
async function generateMode10_UVSpot(img, data) {
    const { canvas, ctx } = createBaseCanvas(img);
    
    // UV spot detection with purple overlay
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    for (let i = 0; i < pixels.length; i += 4) {
        // UV effect
        pixels[i] = Math.min(255, pixels[i] * 0.9 + 30);
        pixels[i + 1] = Math.min(255, pixels[i + 1] * 0.7 + 10);
        pixels[i + 2] = Math.min(255, pixels[i + 2] * 1.3 + 40);
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Draw UV damage markers
    drawUVDamageMarkers(ctx, data, canvas.width, canvas.height);
    
    drawModeTitle(ctx, 'UV Spot', data.uv_damage?.uv_damage_score || 0, canvas.width);
    
    return {
        mode: 'UV Spot',
        image: canvas.toDataURL('image/jpeg', 0.95),
        score: 100 - (data.uv_damage?.uv_damage_score || 0),
        description: `UV Damage: ${data.uv_damage?.uv_damage_score || 0}/100, Affected Area: ${data.uv_damage?.affected_area_percentage || 0}%`
    };
}

/**
 * MODE 11: Skin Aging - Aging signs analysis
 */
async function generateMode11_SkinAging(img, data) {
    const { canvas, ctx } = createBaseCanvas(img);
    
    // Aging analysis with wrinkle enhancement
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Enhance wrinkles and fine lines
    for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
            const i = (y * canvas.width + x) * 4;
            const iUp = ((y - 1) * canvas.width + x) * 4;
            const iDown = ((y + 1) * canvas.width + x) * 4;
            const iLeft = (y * canvas.width + (x - 1)) * 4;
            const iRight = (y * canvas.width + (x + 1)) * 4;
            
            const diff = Math.abs(pixels[i] - pixels[iUp]) + 
                        Math.abs(pixels[i] - pixels[iDown]) +
                        Math.abs(pixels[i] - pixels[iLeft]) +
                        Math.abs(pixels[i] - pixels[iRight]);
            
            if (diff > 40) {
                // Highlight aging signs
                pixels[i] = Math.max(0, pixels[i] - 30);
                pixels[i + 1] = Math.max(0, pixels[i + 1] - 20);
                pixels[i + 2] = Math.max(0, pixels[i + 2] - 10);
            }
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    drawModeTitle(ctx, 'Skin Aging', data.age_prediction?.predicted_age || 25, canvas.width);
    
    return {
        mode: 'Skin Aging',
        image: canvas.toDataURL('image/jpeg', 0.95),
        score: Math.max(0, 100 - (data.age_prediction?.predicted_age || 25)),
        description: `Predicted Age: ${data.age_prediction?.predicted_age || 0} years, Signs: ${data.age_prediction?.aging_signs?.join(', ') || 'None'}`
    };
}

/**
 * MODE 12: Skin Whitening - Brightness analysis
 */
async function generateMode12_SkinWhitening(img, data) {
    const { canvas, ctx } = createBaseCanvas(img);
    
    // Brightness/whitening analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    for (let i = 0; i < pixels.length; i += 4) {
        const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        
        // Create brightness heatmap
        if (brightness > 180) {
            // Bright areas - green
            pixels[i] = Math.max(0, pixels[i] - 30);
            pixels[i + 1] = Math.min(255, pixels[i + 1] + 40);
            pixels[i + 2] = Math.max(0, pixels[i + 2] - 30);
        } else if (brightness < 100) {
            // Dark areas - red
            pixels[i] = Math.min(255, pixels[i] + 40);
            pixels[i + 1] = Math.max(0, pixels[i + 1] - 30);
            pixels[i + 2] = Math.max(0, pixels[i + 2] - 30);
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    drawModeTitle(ctx, 'Skin Whitening', data.skin_tone?.ita_angle || 45, canvas.width);
    
    return {
        mode: 'Skin Whitening',
        image: canvas.toDataURL('image/jpeg', 0.95),
        score: data.skin_tone?.ita_angle || 45,
        description: `ITA Angle: ${data.skin_tone?.ita_angle || 0}°, Undertone: ${data.skin_tone?.undertone || 'Neutral'}`
    };
}

/**
 * MODE 13: Wrinkles Map - Wrinkle detection
 */
async function generateMode13_WrinklesMap(img, data) {
    const { canvas, ctx } = createBaseCanvas(img);
    
    // Wrinkle detection with edge enhancement
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Convert to grayscale first
    for (let i = 0; i < pixels.length; i += 4) {
        const gray = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        pixels[i] = gray;
        pixels[i + 1] = gray;
        pixels[i + 2] = gray;
    }
    
    // Detect edges (wrinkles)
    for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
            const i = (y * canvas.width + x) * 4;
            const iUp = ((y - 1) * canvas.width + x) * 4;
            const iDown = ((y + 1) * canvas.width + x) * 4;
            
            const diff = Math.abs(pixels[i] - pixels[iUp]) + Math.abs(pixels[i] - pixels[iDown]);
            
            if (diff > 25) {
                // Highlight wrinkles in red
                pixels[i] = 255;
                pixels[i + 1] = 0;
                pixels[i + 2] = 0;
            }
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    drawModeTitle(ctx, 'Wrinkles Map', data.wrinkles?.wrinkle_count || 0, canvas.width);
    
    return {
        mode: 'Wrinkles Map',
        image: canvas.toDataURL('image/jpeg', 0.95),
        score: 100 - (data.wrinkles?.wrinkle_severity || 0),
        description: `Wrinkle Count: ${data.wrinkles?.wrinkle_count || 0}, Severity: ${data.wrinkles?.severity || 'None'}`
    };
}

/**
 * MODE 14: Redness Map - Redness distribution
 */
async function generateMode14_RednessMap(img, data) {
    const { canvas, ctx } = createBaseCanvas(img);
    
    // Redness detection
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        
        // Detect redness (high red, lower green/blue)
        if (r > g + 10 && r > b + 10) {
            // Enhance red areas
            pixels[i] = Math.min(255, r + 50);
            pixels[i + 1] = Math.max(0, g - 20);
            pixels[i + 2] = Math.max(0, b - 20);
        } else {
            // Desaturate non-red areas
            const gray = (r + g + b) / 3;
            pixels[i] = gray;
            pixels[i + 1] = gray;
            pixels[i + 2] = gray;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    drawModeTitle(ctx, 'Redness Map', data.redness?.redness_score || 0, canvas.width);
    
    return {
        mode: 'Redness Map',
        image: canvas.toDataURL('image/jpeg', 0.95),
        score: 100 - (data.redness?.redness_score || 0),
        description: `Redness Score: ${data.redness?.redness_score || 0}/100, Erythema: ${data.redness?.erythema_index || 0}`
    };
}

/**
 * MODE 15: Overall Analysis - Combined view with all markers
 */
async function generateMode15_OverallAnalysis(img, data) {
    const { canvas, ctx } = createBaseCanvas(img);
    
    // Draw comprehensive analysis overlay
    drawComprehensiveOverlay(ctx, data, canvas.width, canvas.height);
    
    drawModeTitle(ctx, 'Overall Analysis', data.overall_score || 75, canvas.width);
    
    return {
        mode: 'Overall Analysis',
        image: canvas.toDataURL('image/jpeg', 0.95),
        score: data.overall_score || 75,
        description: `Overall Score: ${data.overall_score || 0}/100, Skin Type: ${data.skin_type || 'Normal'}`
    };
}

// ============================================================================
// HELPER FUNCTIONS FOR DRAWING OVERLAYS AND MARKERS
// ============================================================================

/**
 * Draw mode title at top
 */
function drawModeTitle(ctx, title, value, canvasWidth) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvasWidth, 60);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvasWidth / 2, 30);
    
    ctx.font = '16px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`Value: ${Math.round(value)}`, canvasWidth / 2, 50);
}

/**
 * Draw pore markers
 */
function drawPoreMarkers(ctx, data, width, height) {
    const poreRegions = data.pores?.regions || {};
    
    // T-zone pores
    if (poreRegions.t_zone > 60) {
        drawCircleMarker(ctx, width * 0.5, height * 0.4, 30, '#FF4444', 'T-Zone');
    }
    
    // Nose pores
    if (poreRegions.nose > 70) {
        drawCircleMarker(ctx, width * 0.5, height * 0.5, 25, '#FF6666', 'Nose');
    }
    
    // Cheek pores
    if (poreRegions.cheeks > 50) {
        drawCircleMarker(ctx, width * 0.3, height * 0.5, 20, '#FF8888', 'Cheeks');
        drawCircleMarker(ctx, width * 0.7, height * 0.5, 20, '#FF8888', 'Cheeks');
    }
}

/**
 * Draw pigmentation overlay
 */
function drawPigmentationOverlay(ctx, data, width, height) {
    const regions = data.pigmentation?.regions || {};
    
    ctx.globalAlpha = 0.3;
    
    if (regions.forehead > 0) {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(width * 0.2, height * 0.1, width * 0.6, height * 0.15);
    }
    
    if (regions.cheeks > 0) {
        ctx.fillStyle = '#FF4444';
        ctx.fillRect(width * 0.1, height * 0.35, width * 0.3, height * 0.3);
        ctx.fillRect(width * 0.6, height * 0.35, width * 0.3, height * 0.3);
    }
    
    ctx.globalAlpha = 1.0;
}

/**
 * Draw acne markers
 */
function drawAcneMarkers(ctx, data, width, height) {
    const acneRegions = data.acne?.regions || {};
    
    if (acneRegions.forehead > 0) {
        for (let i = 0; i < acneRegions.forehead; i++) {
            const x = width * (0.3 + Math.random() * 0.4);
            const y = height * (0.15 + Math.random() * 0.1);
            drawCircleMarker(ctx, x, y, 8, '#FF00FF', '');
        }
    }
    
    if (acneRegions.cheeks > 0) {
        for (let i = 0; i < acneRegions.cheeks; i++) {
            const x = width * (0.2 + Math.random() * 0.6);
            const y = height * (0.4 + Math.random() * 0.2);
            drawCircleMarker(ctx, x, y, 8, '#FF00FF', '');
        }
    }
    
    if (acneRegions.nose > 0) {
        for (let i = 0; i < acneRegions.nose; i++) {
            const x = width * (0.45 + Math.random() * 0.1);
            const y = height * (0.45 + Math.random() * 0.1);
            drawCircleMarker(ctx, x, y, 8, '#FF00FF', '');
        }
    }
}

/**
 * Draw UV damage markers
 */
function drawUVDamageMarkers(ctx, data, width, height) {
    const damageScore = data.uv_damage?.uv_damage_score || 0;
    
    if (damageScore > 20) {
        const markerCount = Math.floor(damageScore / 10);
        for (let i = 0; i < markerCount; i++) {
            const x = width * (0.2 + Math.random() * 0.6);
            const y = height * (0.2 + Math.random() * 0.6);
            drawCircleMarker(ctx, x, y, 10, '#9900FF', '');
        }
    }
}

/**
 * Draw comprehensive overlay for overall analysis
 */
function drawComprehensiveOverlay(ctx, data, width, height) {
    // Draw facial zones with color coding
    const zones = data.facial_zones || {};
    
    ctx.globalAlpha = 0.2;
    
    // Forehead
    if (zones.forehead) {
        ctx.fillStyle = getZoneColor(zones.forehead.score);
        ctx.fillRect(width * 0.2, height * 0.1, width * 0.6, height * 0.15);
    }
    
    // T-zone
    if (zones.t_zone) {
        ctx.fillStyle = getZoneColor(zones.t_zone.score);
        ctx.fillRect(width * 0.35, height * 0.25, width * 0.3, height * 0.35);
    }
    
    // Cheeks
    if (zones.cheeks_left) {
        ctx.fillStyle = getZoneColor(zones.cheeks_left.score);
        ctx.fillRect(width * 0.05, height * 0.35, width * 0.3, height * 0.3);
    }
    if (zones.cheeks_right) {
        ctx.fillStyle = getZoneColor(zones.cheeks_right.score);
        ctx.fillRect(width * 0.65, height * 0.35, width * 0.3, height * 0.3);
    }
    
    // Chin
    if (zones.chin) {
        ctx.fillStyle = getZoneColor(zones.chin.score);
        ctx.fillRect(width * 0.3, height * 0.7, width * 0.4, height * 0.2);
    }
    
    ctx.globalAlpha = 1.0;
    
    // Draw priority concern markers
    const concerns = data.priority_concerns || [];
    concerns.forEach((concern, index) => {
        const y = height * 0.15 + (index * height * 0.2);
        drawCircleMarker(ctx, width * 0.5, y, 15, '#FF69B4', `${index + 1}`);
    });
}

/**
 * Draw circle marker with label
 */
function drawCircleMarker(ctx, x, y, radius, color, label) {
    // Outer glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    
    // Circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color + '80';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    
    // Label
    if (label) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x, y);
    }
}

/**
 * Get color based on zone score
 */
function getZoneColor(score) {
    if (score >= 80) return '#00FF00'; // Green - Excellent
    if (score >= 60) return '#FFFF00'; // Yellow - Good
    if (score >= 40) return '#FFA500'; // Orange - Fair
    return '#FF0000'; // Red - Poor
}

export default {
    generateVisualizationImage
};
