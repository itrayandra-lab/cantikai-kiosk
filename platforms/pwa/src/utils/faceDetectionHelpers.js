/**
 * Face Detection Helper Functions
 * Modular utilities for scanner face detection and quality checks
 */

// Quality thresholds - BALANCED for better detection
export const THRESHOLDS = {
    BRIGHTNESS_MIN: 40,  // Reasonable minimum (not too dark)
    BRIGHTNESS_MAX: 220, // Reasonable maximum (not too bright)
    FACE_SIZE_MIN: 0.20, // Reasonable minimum distance
    FACE_SIZE_MAX: 0.85, // Reasonable maximum distance
    GLASSES_THRESHOLD: 0.035,
    FILTER_THRESHOLD: 0.50 // Slightly lower for better filter detection
};

/**
 * Calculate brightness from video frame
 */
export const calculateBrightness = (videoElement, width, height) => {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(videoElement, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        let totalBrightness = 0;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            totalBrightness += (r + g + b) / 3;
        }
        
        return Math.round(totalBrightness / (data.length / 4));
    } catch (error) {
        console.error('Brightness calculation error:', error);
        return 0;
    }
};

/**
 * Check if face distance is optimal - BALANCED
 */
export const checkFaceDistance = (landmarks, width, height) => {
    const xs = landmarks.map(l => l.x);
    const ys = landmarks.map(l => l.y);
    const faceWidth = (Math.max(...xs) - Math.min(...xs)) * width;
    const faceHeight = (Math.max(...ys) - Math.min(...ys)) * height;
    const faceArea = (faceWidth * faceHeight) / (width * height);
    
    // Balanced range for good detection (20-85% of frame)
    const isGood = faceArea >= THRESHOLDS.FACE_SIZE_MIN && faceArea <= THRESHOLDS.FACE_SIZE_MAX;
    
    let status = '';
    if (faceArea < THRESHOLDS.FACE_SIZE_MIN) {
        status = 'Lebih Dekat';
    } else if (faceArea > THRESHOLDS.FACE_SIZE_MAX) {
        status = 'Lebih Jauh';
    } else {
        status = 'Sempurna';
    }
    
    return { isGood, status, area: faceArea };
};

/**
 * Detect if user is wearing glasses - IMPROVED ALGORITHM
 * Uses multiple detection methods for better accuracy
 */
export const detectGlasses = (landmarks) => {
    try {
        // Method 1: Check eye region depth variance (glasses create flat surface)
        const leftEye = landmarks.slice(33, 42);
        const rightEye = landmarks.slice(263, 272);
        
        // Calculate depth variance for each eye
        const leftDepths = leftEye.map(p => p.z);
        const rightDepths = rightEye.map(p => p.z);
        
        const leftAvg = leftDepths.reduce((a, b) => a + b, 0) / leftDepths.length;
        const rightAvg = rightDepths.reduce((a, b) => a + b, 0) / rightDepths.length;
        
        // Variance from average (glasses make eyes flatter)
        const leftVariance = leftDepths.reduce((sum, z) => sum + Math.abs(z - leftAvg), 0) / leftDepths.length;
        const rightVariance = rightDepths.reduce((sum, z) => sum + Math.abs(z - rightAvg), 0) / rightDepths.length;
        const avgVariance = (leftVariance + rightVariance) / 2;
        
        // Method 2: Check if eye landmarks are too flat (low Z values)
        const avgEyeDepth = Math.abs((leftAvg + rightAvg) / 2);
        
        // Method 3: Check temple area (glasses frames near temples)
        const leftTemple = landmarks[234]; // Left temple area
        const rightTemple = landmarks[454]; // Right temple area
        const templeDepth = Math.abs((leftTemple.z + rightTemple.z) / 2);
        
        // Glasses detected if:
        // 1. Eyes are too flat (low variance) OR
        // 2. Eye depth is shallow AND temple depth is shallow
        const lowVariance = avgVariance < 0.008; // Flatter than normal
        const shallowEyes = avgEyeDepth < 0.025; // Eyes not deep enough
        const shallowTemples = templeDepth < 0.03; // Temples affected
        
        // More lenient detection - any strong indicator triggers detection
        return lowVariance || (shallowEyes && shallowTemples);
    } catch (error) {
        console.error('Glasses detection error:', error);
        return false;
    }
};

/**
 * Detect if filter is applied - MORE ACCURATE
 */
export const detectFilter = (videoElement, landmarks, width, height) => {
    try {
        const xs = landmarks.map(l => l.x);
        const ys = landmarks.map(l => l.y);
        const centerX = Math.floor((Math.min(...xs) + Math.max(...xs)) / 2 * width);
        const centerY = Math.floor((Math.min(...ys) + Math.max(...ys)) / 2 * height);
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, width, height);
        
        // Sample larger area for better accuracy
        const sampleSize = 60;
        const imageData = ctx.getImageData(
            Math.max(0, centerX - sampleSize/2), 
            Math.max(0, centerY - sampleSize/2), 
            sampleSize, 
            sampleSize
        );
        
        let saturation = 0;
        let totalPixels = 0;
        
        for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            
            if (max > 0) {
                saturation += (max - min) / max;
                totalPixels++;
            }
        }
        
        const avgSaturation = totalPixels > 0 ? saturation / totalPixels : 0;
        
        // Higher threshold - less false positives
        return avgSaturation > THRESHOLDS.FILTER_THRESHOLD;
    } catch (error) {
        return false;
    }
};

/**
 * Draw precise face contour using MediaPipe FACE_OVAL
 */
export const drawFaceContour = (canvasCtx, landmarks, width, height, isOptimal) => {
    const color = isOptimal ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 190, 215, 0.85)';
    
    // Detect orientation
    const isPortrait = window.innerHeight > window.innerWidth;
    
    canvasCtx.save();
    canvasCtx.strokeStyle = color;
    
    // Different line width and shadow for portrait vs landscape
    if (isPortrait) {
        canvasCtx.lineWidth = 1;
        canvasCtx.shadowBlur = 2;
    } else {
        canvasCtx.lineWidth = 2;
        canvasCtx.shadowBlur = 8;
    }
    
    canvasCtx.shadowColor = isOptimal ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 190, 215, 0.5)';
    
    // Use MediaPipe's FACE_OVAL connections for perfect fit
    if (window.FACEMESH_FACE_OVAL) {
        canvasCtx.beginPath();
        window.FACEMESH_FACE_OVAL.forEach((connection, idx) => {
            const start = landmarks[connection[0]];
            const end = landmarks[connection[1]];
            if (idx === 0) {
                canvasCtx.moveTo(start.x * width, start.y * height);
            }
            canvasCtx.lineTo(end.x * width, end.y * height);
        });
        canvasCtx.closePath();
        canvasCtx.stroke();
    }
    
    canvasCtx.shadowBlur = 0;
    canvasCtx.restore();
};

/**
 * Draw many key points for accurate face tracking (like reference image)
 */
export const drawKeyPoints = (canvasCtx, landmarks, width, height, isOptimal) => {
    const color = isOptimal ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 190, 215, 0.8)';
    
    // Detect orientation
    const isPortrait = window.innerHeight > window.innerWidth;
    
    // Draw ALL landmarks as small dots for maximum accuracy
    canvasCtx.save();
    canvasCtx.fillStyle = color;
    canvasCtx.shadowBlur = 3;
    canvasCtx.shadowColor = color;
    
    landmarks.forEach((lm, idx) => {
        const x = lm.x * width;
        const y = lm.y * height;
        
        // Draw small dot - different size for portrait vs landscape
        canvasCtx.beginPath();
        if (isPortrait) {
            canvasCtx.arc(x, y, 1.5, 0, 1 * Math.PI);
        } else {
            canvasCtx.arc(x, y, 1.5, 0, 2 * Math.PI);
        }
        canvasCtx.fill();
    });
    
    canvasCtx.shadowBlur = 0;
    canvasCtx.restore();
};

/**
 * Draw soft mesh lines - VERY MINIMAL, only face oval
 */
export const drawSoftMesh = (canvasCtx, landmarks, isOptimal) => {
    // Only draw face oval, nothing else
    const meshColor = isOptimal ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 190, 215, 0.25)';
    
    if (window.drawConnectors && window.FACEMESH_FACE_OVAL) {
        window.drawConnectors(canvasCtx, landmarks, window.FACEMESH_FACE_OVAL, {
            color: meshColor,
            lineWidth: 1
        });
    }
};
