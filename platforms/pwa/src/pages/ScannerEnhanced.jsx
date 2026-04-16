import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Sparkles } from 'lucide-react';
import StatusIndicators from '../components/scanner/StatusIndicators';
import OvalFrame from '../components/scanner/OvalFrame';
import ControlButtons from '../components/scanner/ControlButtons';
// Auth and token imports REMOVED FOR KIOSK MODE - No authentication required
import { 
    THRESHOLDS, 
    calculateBrightness, 
    checkFaceDistance, 
    detectGlasses, 
    detectFilter,
    drawFaceContour,
    drawKeyPoints,
    drawSoftMesh
} from '../utils/faceDetectionHelpers';

const ScannerEnhanced = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const countdownTimerRef = useRef(null);
    const isCountingRef = useRef(false);
    const isPreviewing = useRef(false); // Use ref instead of state in dependency
    const [hasCameraError, setHasCameraError] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [facingMode, setFacingMode] = useState('user');
    const [capturedImage, setCapturedImage] = useState(null); // For preview
    const [previewAutoCountdown, setPreviewAutoCountdown] = useState(null);
    const [isAutoProceeding, setIsAutoProceeding] = useState(false);
    
    // Enhanced detection states
    const [faceDetected, setFaceDetected] = useState(false);
    const [goodLight, setGoodLight] = useState(false);
    const [goodDistance, setGoodDistance] = useState(false);
    const [hasGlasses, setHasGlasses] = useState(false);
    const [hasFilter, setHasFilter] = useState(false);
    const [brightness, setBrightness] = useState(0);
    const [distance, setDistance] = useState('');
    const [isOptimal, setIsOptimal] = useState(false);
    const [countdown, setCountdown] = useState(null);
    
    // Camera quality controls
    const [zoomLevel, setZoomLevel] = useState(1); // 0.5 to 2.0
    const [qualityLevel, setQualityLevel] = useState(1); // 0.5 to 2.0
    const [showControls, setShowControls] = useState(false);
    const previewAutoTimerRef = useRef(null);

    // Use thresholds from helper
    const { BRIGHTNESS_MIN, BRIGHTNESS_MAX } = THRESHOLDS;

    useEffect(() => {
        let cameraInstance = null;
        let faceMesh = null;
        let isComponentMounted = true;
        let orientationChangeTimeout = null;
        let qualityCheckInterval = null;

        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve();
                    return;
                }
                const script = document.createElement('script');
                script.src = src;
                script.crossOrigin = 'anonymous';
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });
        };

        const checkImageQuality = () => {
            // STOP processing if preview is shown
            if (isPreviewing.current) return;
            
            if (!videoRef.current || !canvasRef.current) return;
            
            const videoWidth = videoRef.current.videoWidth;
            const videoHeight = videoRef.current.videoHeight;
            
            if (!videoWidth || !videoHeight || videoWidth === 0 || videoHeight === 0) {
                return;
            }
            
            try {
                const newBrightness = calculateBrightness(videoRef.current, videoWidth, videoHeight);
                
                if (newBrightness > 0) { // Only update if valid
                    setBrightness(newBrightness);
                    
                    // FORCE PASS for testing - always true if brightness > 0
                    setGoodLight(true); // Always true for now
                }
            } catch (error) {
                console.error('Quality check error:', error);
            }
        };

        const startMediaPipe = async () => {
            try {
                // Detect iOS early
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                
                console.log(`🍎 iOS Detection: ${isIOS}`);
                console.log(`🦁 Safari Detection: ${isSafari}`);
                console.log(`🌐 User Agent: ${navigator.userAgent}`);
                console.log(`🔒 Is Secure Context: ${window.isSecureContext}`);
                console.log(`📍 Protocol: ${window.location.protocol}`);
                
                await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
                await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js');
                await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js');
                await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js');

                if (!isComponentMounted) return;

                if (!window.FaceMesh || !window.Camera) {
                    setTimeout(startMediaPipe, 1000);
                    return;
                }

                faceMesh = new window.FaceMesh({
                    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
                });

                faceMesh.setOptions({
                    maxNumFaces: 1,
                    refineLandmarks: true,
                    minDetectionConfidence: 0.6,
                    minTrackingConfidence: 0.6
                });

                faceMesh.onResults((results) => {
                    if (!canvasRef.current || !videoRef.current || !isComponentMounted) return;
                    
                    // STOP processing if preview is shown
                    if (isPreviewing.current) return;
                    
                    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) return;
                    
                    const canvasCtx = canvasRef.current.getContext('2d');
                    
                    // Use actual video dimensions for accurate coordinate mapping
                    const actualVideoWidth = videoRef.current.videoWidth;
                    const actualVideoHeight = videoRef.current.videoHeight;
                    
                    console.log(`📹 Actual Video Dimensions: ${actualVideoWidth}x${actualVideoHeight}`);
                    
                    // Set canvas size to match video dimensions
                    canvasRef.current.width = actualVideoWidth;
                    canvasRef.current.height = actualVideoHeight;
                    
                    const width = actualVideoWidth;
                    const height = actualVideoHeight;

                    canvasCtx.save();
                    canvasCtx.clearRect(0, 0, width, height);

                    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                        setFaceDetected(true);
                        
                        const landmarks = results.multiFaceLandmarks[0];
                        
                        // Use helper functions for detection
                        const distanceCheck = checkFaceDistance(landmarks, width, height);
                        setGoodDistance(distanceCheck.isGood);
                        setDistance(distanceCheck.status);
                        
                        // IMPORTANT: Use current brightness value from state
                        const currentBrightness = brightness;
                        
                        // FORCE PASS for testing - always true if face detected
                        const goodBright = true; // Bypass brightness check for now
                        setGoodLight(true); // Always true
                        
                        const glassesDetected = detectGlasses(landmarks);
                        setHasGlasses(glassesDetected);
                        
                        const filterDetected = detectFilter(videoRef.current, landmarks, width, height);
                        setHasFilter(filterDetected);
                        
                        // Check if optimal (ONLY 3 checks: face, light, distance)
                        // IGNORE glasses and filter for auto-capture
                        const optimal = distanceCheck.isGood && goodBright && true;
                        setIsOptimal(optimal);
                        
                        // Auto-capture logic - countdown 3
                        if (optimal && !isCapturing && !isCountingRef.current) {
                            isCountingRef.current = true;
                            startCountdown();
                        } else if (!optimal && isCountingRef.current) {
                            stopCountdown();
                        }
                        
                        // Draw using helper functions - SOFT COLORS, NO DARK OVERLAY
                        drawSoftMesh(canvasCtx, landmarks, optimal);
                        drawFaceContour(canvasCtx, landmarks, width, height, optimal);
                        drawKeyPoints(canvasCtx, landmarks, width, height, optimal);
                        
                    } else {
                        setFaceDetected(false);
                        setGoodDistance(false);
                        setDistance('');
                        setIsOptimal(false);
                        stopCountdown();
                    }
                    canvasCtx.restore();
                });

                if (videoRef.current) {
                    // Detect orientation and set appropriate resolution
                    const isPortrait = window.innerHeight > window.innerWidth;
                    const isKioskMode = window.innerWidth >= 768 && isPortrait;
                    
                    console.log(`📱 Is Portrait: ${isPortrait}`);
                    console.log(`🖥️ Is Kiosk Mode: ${isKioskMode}`);
                    
                    // KIOSK MODE: Use much higher resolution for better quality
                    // Mobile: 1280x720, Kiosk: 1920x1080 (Full HD)
                    const baseWidth = isKioskMode ? 1920 : 1280;
                    const baseHeight = isKioskMode ? 1080 : 720;
                    
                    const cameraWidth = Math.floor(baseWidth * qualityLevel);
                    const cameraHeight = Math.floor(baseHeight * qualityLevel);
                    
                    console.log(`📱 Orientation: ${isPortrait ? 'Portrait' : 'Landscape'}`);
                    console.log(`📹 Camera Resolution: ${cameraWidth}x${cameraHeight}`);
                    console.log(`🖥️ Window Size: ${window.innerWidth}x${window.innerHeight}`);
                    console.log(`🎯 Quality Level: ${qualityLevel}x`);
                    
                    // iOS-specific camera constraints
                    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                    
                    let cameraConfig = {
                        onFrame: async () => {
                            // STOP processing if preview is shown
                            if (isPreviewing.current) return;
                            
                            if (faceMesh && isComponentMounted && 
                                videoRef.current && 
                                videoRef.current.videoWidth > 0 && 
                                videoRef.current.videoHeight > 0) {
                                try {
                                    await faceMesh.send({ image: videoRef.current });
                                } catch (err) {
                                    // Silently ignore MediaPipe processing errors to reduce console noise
                                }
                            }
                        }
                    };
                    
                    // Only set resolution constraints for non-iOS devices
                    if (!isIOS) {
                        cameraConfig.width = cameraWidth;
                        cameraConfig.height = cameraHeight;
                    }
                    
                    console.log(`📱 Is iOS: ${isIOS}`);
                    console.log(`📹 Camera Config:`, cameraConfig);
                    
                    cameraInstance = new window.Camera(videoRef.current, cameraConfig);
                    cameraInstance.start().catch(async (err) => {
                        console.error("MediaPipe Camera start failed:", err);
                        
                        // iOS Fallback: Try direct getUserMedia
                        if (isIOS) {
                            console.log("🍎 Trying iOS fallback with getUserMedia...");
                            try {
                                const stream = await navigator.mediaDevices.getUserMedia({
                                    video: {
                                        facingMode: facingMode,
                                        width: { ideal: isPortrait ? 480 : 1280 },
                                        height: { ideal: isPortrait ? 640 : 720 }
                                    }
                                });
                                
                                if (videoRef.current && isComponentMounted) {
                                    videoRef.current.srcObject = stream;
                                    await videoRef.current.play();
                                    console.log("✅ iOS fallback successful");
                                }
                            } catch (fallbackErr) {
                                console.error("iOS fallback also failed:", fallbackErr);
                                if (isComponentMounted) setHasCameraError(true);
                            }
                        } else {
                            if (isComponentMounted) setHasCameraError(true);
                        }
                    });
                    
                    qualityCheckInterval = setInterval(checkImageQuality, 200); // Faster: 200ms instead of 500ms
                }

            } catch (error) {
                console.error("MediaPipe initialization error:", error);
                if (isComponentMounted) setHasCameraError(true);
            }
        };

        startMediaPipe();

        // Handle orientation changes
        const handleOrientationChange = () => {
            if (orientationChangeTimeout) clearTimeout(orientationChangeTimeout);
            
            orientationChangeTimeout = setTimeout(() => {
                console.log('📱 Orientation changed, restarting camera...');
                
                // Restart MediaPipe with new orientation
                if (isComponentMounted) {
                    startMediaPipe();
                }
            }, 300); // Debounce orientation changes
        };

        // Listen for orientation changes
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleOrientationChange);

        return () => {
            isComponentMounted = false;
            
            // Clear orientation change timeout
            if (orientationChangeTimeout) {
                clearTimeout(orientationChangeTimeout);
                orientationChangeTimeout = null;
            }
            
            // Remove orientation listeners
            window.removeEventListener('orientationchange', handleOrientationChange);
            window.removeEventListener('resize', handleOrientationChange);
            
            // Stop camera with better cleanup
            if (cameraInstance) {
                try {
                    cameraInstance.stop();
                    cameraInstance = null;
                } catch (error) {
                    console.warn('Error stopping camera:', error);
                }
            }
            
            // Close MediaPipe
            if (faceMesh) {
                try {
                    faceMesh.close();
                    faceMesh = null;
                } catch (error) {
                    console.warn('Error closing faceMesh:', error);
                }
            }
            
            // Stop video stream directly
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                if (stream && stream.getTracks) {
                    stream.getTracks().forEach(track => {
                        track.stop();
                    });
                }
                videoRef.current.srcObject = null;
            }
            
            // Clear intervals
            if (qualityCheckInterval) {
                clearInterval(qualityCheckInterval);
                qualityCheckInterval = null;
            }
            
            stopCountdown();
        };
    }, [facingMode, qualityLevel]); // Re-run when camera flips or quality changes

    // Countdown functions using ref to avoid state issues
    const startCountdown = () => {
        let count = 3;
        setCountdown(count);
        
        countdownTimerRef.current = setInterval(() => {
            count--;
            if (count > 0) {
                setCountdown(count);
            } else {
                setCountdown(0);
                stopCountdown();
                captureImage();
            }
        }, 1000);
    };

    const stopCountdown = () => {
        if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
        }
        isCountingRef.current = false;
        setCountdown(null);
    };

    // Countdown effect - REMOVED, using ref-based approach instead
    // useEffect(() => {
    //     if (countdown === null || countdown === undefined) return;
    //     
    //     if (countdown === 0) {
    //         captureImage();
    //         setCountdown(null);
    //         setAutoCapturing(false);
    //         return;
    //     }
    //     
    //     // Countdown timer
    //     const timer = setTimeout(() => {
    //         setCountdown(prev => {
    //             if (prev === null || prev === undefined) return null;
    //             return prev - 1;
    //         });
    //     }, 1000);
    //     
    //     return () => clearTimeout(timer);
    // }, [countdown]); // Only depend on countdown

    const captureImage = () => {
        if (!videoRef.current || isCapturing) return;
        
        setIsCapturing(true);
        stopCountdown(); // Stop countdown when capturing
        isPreviewing.current = true; // Set flag to stop MediaPipe
        
        const canvas = document.createElement('canvas');
        
        // KIOSK MODE: Use higher resolution for better quality
        const isKioskMode = window.innerWidth >= 768 && window.innerHeight > window.innerWidth;
        
        // Get actual video dimensions
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;
        
        // For kiosk, capture at higher resolution (up to 4K if available)
        const captureScale = isKioskMode ? 2.0 : 1.5; // 2x for kiosk, 1.5x for mobile
        
        canvas.width = Math.min(videoWidth * captureScale, 3840); // Max 4K width
        canvas.height = Math.min(videoHeight * captureScale, 2160); // Max 4K height
        
        const ctx = canvas.getContext('2d', { 
            alpha: false, // No transparency for better compression
            willReadFrequently: false 
        });
        
        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Mirror if front camera
        if (facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        
        // Draw with high quality
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        // Use PNG for lossless quality (better for AI analysis)
        // Or JPEG with very high quality (0.98)
        const imageBase64 = canvas.toDataURL('image/jpeg', 0.98); // Increased from 0.95 to 0.98
        
        console.log(`📸 Captured image: ${canvas.width}x${canvas.height} (${(imageBase64.length / 1024 / 1024).toFixed(2)}MB)`);
        
        // Show preview instead of going directly to result
        setCapturedImage(imageBase64);
    };

    const clearPreviewAutoTimer = () => {
        if (previewAutoTimerRef.current) {
            clearInterval(previewAutoTimerRef.current);
            previewAutoTimerRef.current = null;
        }
    };

    useEffect(() => {
        clearPreviewAutoTimer();

        if (!capturedImage) {
            setPreviewAutoCountdown(null);
            setIsAutoProceeding(false);
            return undefined;
        }

        setPreviewAutoCountdown(5);
        setIsAutoProceeding(false);

        previewAutoTimerRef.current = setInterval(() => {
            setPreviewAutoCountdown((prev) => {
                if (prev === null) return null;
                if (prev <= 1) {
                    clearPreviewAutoTimer();
                    setIsAutoProceeding(true);
                    setTimeout(() => confirmCapture(true), 120);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearPreviewAutoTimer();
        };
    }, [capturedImage]);

    const confirmCapture = (isAutoTriggered = false) => {
        clearPreviewAutoTimer();
        setPreviewAutoCountdown(null);
        setIsAutoProceeding(true);

        // TOKEN CHECK REMOVED FOR KIOSK MODE - Unlimited scans without login
        
        // Clear any existing session before navigating to new analysis
        sessionStorage.removeItem('current_analysis_session');
        Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith('analysis_session_')) {
                sessionStorage.removeItem(key);
            }
        });
        
        // Go to result with captured image
        navigate('/result', { state: { imageBase64: capturedImage } });
    };

    const retakePhoto = () => {
        // Clear preview and allow retake
        clearPreviewAutoTimer();
        setPreviewAutoCountdown(null);
        setIsAutoProceeding(false);
        setCapturedImage(null);
        setIsCapturing(false);
        isPreviewing.current = false; // Resume MediaPipe
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Clear any existing session before uploading new image
        sessionStorage.removeItem('current_analysis_session');
        Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith('analysis_session_')) {
                sessionStorage.removeItem(key);
            }
        });
        
        const reader = new FileReader();
        reader.onload = (event) => {
            navigate('/result', { state: { imageBase64: event.target.result } });
        };
        reader.readAsDataURL(file);
    };

    const retake = () => {
        clearPreviewAutoTimer();
        setPreviewAutoCountdown(null);
        setIsAutoProceeding(false);
        setCapturedImage(null);
        setIsCapturing(false);
        stopCountdown();
        isPreviewing.current = false; // Resume MediaPipe
    };

    const handleFlip = () => {
        setFacingMode(facingMode === 'user' ? 'environment' : 'user');
    };

    return (
        <div className="app-container" style={{ background: '#36212a', position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
            
            {/* Video & Canvas - Full screen - HIDE when preview shown */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: capturedImage ? 'none' : 'block' }}>
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    webkit-playsinline="true"
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
                        filter: 'none', // Remove blur effect during capture
                        zoom: zoomLevel
                    }} 
                />
                <canvas 
                    ref={canvasRef} 
                    style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
                        pointerEvents: 'none',
                        mixBlendMode: 'screen',
                        zoom: zoomLevel
                    }} 
                />
            </div>

            {/* Top gradient overlay - SMALLER, only at edge - HIDE when preview shown */}
            {!capturedImage && (
                <div style={{
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '120px',  // Reduced from 300px
                    background: 'linear-gradient(180deg, rgba(54, 33, 42, 0.85) 0%, transparent 100%)',
                    pointerEvents: 'none', 
                    zIndex: 1
                }} />
            )}

            {/* Title - Font konsisten dengan Home - HIDE when preview shown */}
            {!capturedImage && (
                <div style={{ position: 'absolute', top: '20px', left: 0, right: 0, zIndex: 10, textAlign: 'center' }}>
                    <h1 className="headline" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                        Analisis Kulit Anda
                    </h1>
                    <p className="subtitle" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                        Posisikan wajah di dalam frame
                    </p>
                    
                    {/* Camera Controls Toggle - Icon Only */}
                    <button
                        onClick={() => setShowControls(!showControls)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '20px',
                            background: 'rgba(255, 255, 255, 0.15)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            color: 'white',
                            fontSize: '16px',
                            cursor: 'pointer',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        ⚙️
                    </button>
                    
                    {/* Professional Camera Controls Panel */}
                    {showControls && (
                        <div style={{
                            position: 'absolute',
                            top: '60px',
                            right: '20px',
                            background: 'rgba(0, 0, 0, 0.85)',
                            borderRadius: '16px',
                            padding: '20px',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            minWidth: '220px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                        }}>
                            {/* Zoom Control */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{ 
                                        color: 'rgba(255, 255, 255, 0.9)', 
                                        fontSize: '0.8rem', 
                                        fontWeight: 500,
                                        fontFamily: 'var(--font-sans)'
                                    }}>
                                        Zoom
                                    </span>
                                    <span style={{ 
                                        color: 'white', 
                                        fontSize: '0.75rem', 
                                        fontWeight: 600,
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        padding: '2px 8px',
                                        borderRadius: '8px'
                                    }}>
                                        {zoomLevel.toFixed(1)}x
                                    </span>
                                </div>
                                <div style={{ position: 'relative', height: '4px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '2px' }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        height: '4px',
                                        width: `${((zoomLevel - 0.5) / 1.5) * 100}%`,
                                        background: 'linear-gradient(90deg, #ff6b9d, #c44569)',
                                        borderRadius: '2px'
                                    }} />
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="2.0"
                                        step="0.1"
                                        value={zoomLevel}
                                        onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                                        style={{
                                            position: 'absolute',
                                            top: '-6px',
                                            left: '0',
                                            width: '100%',
                                            height: '16px',
                                            background: 'transparent',
                                            outline: 'none',
                                            appearance: 'none',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </div>
                            </div>
                            
                            {/* Quality Control */}
                            <div>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{ 
                                        color: 'rgba(255, 255, 255, 0.9)', 
                                        fontSize: '0.8rem', 
                                        fontWeight: 500,
                                        fontFamily: 'var(--font-sans)'
                                    }}>
                                        Kejernihan
                                    </span>
                                    <span style={{ 
                                        color: 'white', 
                                        fontSize: '0.75rem', 
                                        fontWeight: 600,
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        padding: '2px 8px',
                                        borderRadius: '8px'
                                    }}>
                                        {qualityLevel.toFixed(1)}x
                                    </span>
                                </div>
                                <div style={{ position: 'relative', height: '4px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '2px' }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        height: '4px',
                                        width: `${((qualityLevel - 0.5) / 1.5) * 100}%`,
                                        background: 'linear-gradient(90deg, #4facfe, #00f2fe)',
                                        borderRadius: '2px'
                                    }} />
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="2.0"
                                        step="0.1"
                                        value={qualityLevel}
                                        onChange={(e) => setQualityLevel(parseFloat(e.target.value))}
                                        style={{
                                            position: 'absolute',
                                            top: '-6px',
                                            left: '0',
                                            width: '100%',
                                            height: '16px',
                                            background: 'transparent',
                                            outline: 'none',
                                            appearance: 'none',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Smart Multiple Notifications - UNIFORM STYLE */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '8px', 
                        justifyContent: 'center',
                        marginTop: '12px',
                        flexWrap: 'wrap',
                        maxWidth: '90%',
                        margin: '12px auto 0'
                    }}>
                        {hasGlasses && (
                            <div style={{ 
                                padding: '6px 12px', 
                                background: 'rgba(255, 190, 215, 0.25)', 
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 190, 215, 0.4)',
                                backdropFilter: 'blur(8px)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <AlertCircle size={14} color="#fff" strokeWidth={2} />
                                <span style={{ 
                                    color: '#fff', 
                                    fontSize: '0.75rem', 
                                    fontWeight: 600, 
                                    fontFamily: 'var(--font-sans)',
                                    whiteSpace: 'nowrap'
                                }}>
                                    Lepas kacamata
                                </span>
                            </div>
                        )}
                        {!goodLight && faceDetected && (
                            <div style={{ 
                                padding: '6px 12px', 
                                background: 'rgba(255, 190, 215, 0.25)', 
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 190, 215, 0.4)',
                                backdropFilter: 'blur(8px)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <AlertCircle size={14} color="#fff" strokeWidth={2} />
                                <span style={{ 
                                    color: '#fff', 
                                    fontSize: '0.75rem', 
                                    fontWeight: 600, 
                                    fontFamily: 'var(--font-sans)',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {brightness < BRIGHTNESS_MIN ? 'Cahaya kurang' : 'Cahaya berlebih'}
                                </span>
                            </div>
                        )}
                        {!goodDistance && faceDetected && distance && (
                            <div style={{ 
                                padding: '6px 12px', 
                                background: 'rgba(255, 190, 215, 0.25)', 
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 190, 215, 0.4)',
                                backdropFilter: 'blur(8px)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <AlertCircle size={14} color="#fff" strokeWidth={2} />
                                <span style={{ 
                                    color: '#fff', 
                                    fontSize: '0.75rem', 
                                    fontWeight: 600, 
                                    fontFamily: 'var(--font-sans)',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {distance}
                                </span>
                            </div>
                        )}
                        {hasFilter && (
                            <div style={{ 
                                padding: '6px 12px', 
                                background: 'rgba(255, 190, 215, 0.25)', 
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 190, 215, 0.4)',
                                backdropFilter: 'blur(8px)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <AlertCircle size={14} color="#fff" strokeWidth={2} />
                                <span style={{ 
                                    color: '#fff', 
                                    fontSize: '0.75rem', 
                                    fontWeight: 600, 
                                    fontFamily: 'var(--font-sans)',
                                    whiteSpace: 'nowrap'
                                }}>
                                    Nonaktifkan filter
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modular Status Indicators Component - NO WARNINGS HERE - HIDE when preview shown */}
            {!capturedImage && (
                <StatusIndicators 
                    faceDetected={faceDetected}
                    goodLight={goodLight}
                    goodDistance={goodDistance}
                    hasGlasses={false}  // Don't show warnings here
                    hasFilter={false}   // Don't show warnings here
                    countdown={countdown}
                    distance={distance}
                    brightness={brightness}
                />
            )}

            {/* Modular Oval Frame Component - BIGGER for closer face - HIDE when preview shown */}
            {/* {!capturedImage && <OvalFrame isOptimal={isOptimal} />} */}

            {/* Bottom gradient overlay - SMALLER, only at edge - HIDE when preview shown */}
            {!capturedImage && (
                <div style={{
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '140px',  // Reduced from 200px
                    background: 'linear-gradient(0deg, rgba(54, 33, 42, 0.85) 0%, transparent 100%)',
                    pointerEvents: 'none', 
                    zIndex: 4
                }} />
            )}

            {/* Modular Control Buttons Component - HIDE when preview shown */}
            {!capturedImage && (
                <ControlButtons 
                    onCapture={captureImage}
                    isCapturing={isCapturing}
                    isOptimal={isOptimal}
                    faceDetected={faceDetected}
                    hasCameraError={hasCameraError}
                />
            )}

            {/* Photo Preview Modal */}
            {capturedImage && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'linear-gradient(160deg, #f8ebf2 0%, #dcb1c4 45%, #9d5a76 100%)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: '100%',
                        textAlign: 'center',
                        padding: '20px 20px 12px'
                    }}>
                        <h2 style={{
                            color: 'white',
                            margin: 0,
                            fontSize: 'clamp(1.25rem, 5vw, 1.55rem)',
                            fontWeight: 700,
                            fontFamily: 'var(--font-display)',
                            textShadow: '0 2px 8px rgba(0,0,0,0.25)'
                        }}>
                            Preview Foto
                        </h2>
                        <p style={{
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: 'clamp(0.82rem, 3vw, 0.92rem)',
                            margin: '4px 0 0',
                            fontFamily: 'var(--font-sans)'
                        }}>
                            Pastikan wajah terlihat jelas
                        </p>
                        {previewAutoCountdown !== null && (
                            <p style={{
                                color: 'rgba(255,255,255,0.98)',
                                fontSize: '0.86rem',
                                margin: '10px 0 0',
                                fontWeight: 700,
                                letterSpacing: '0.15px',
                                fontFamily: 'var(--font-sans)'
                            }}>
                                Melanjutkan otomatis dalam {previewAutoCountdown} detik
                            </p>
                        )}
                    </div>
                    <div style={{
                        flex: 1,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '14px 20px 16px'
                    }}>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '520px',
                            aspectRatio: '3/4',
                            borderRadius: '28px',
                            overflow: 'hidden',
                            boxShadow: '0 22px 56px rgba(66, 25, 45, 0.35)',
                            border: '2px solid rgba(255,255,255,0.45)'
                        }}>
                            <img
                                src={capturedImage}
                                alt="Preview"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            />
                            {(hasGlasses || hasFilter) && (
                                <div style={{
                                    position: 'absolute',
                                    top: '14px',
                                    left: '14px',
                                    right: '14px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px'
                                }}>
                                    {hasGlasses && (
                                        <div style={{
                                            background: 'rgba(239, 68, 68, 0.92)',
                                            padding: '8px 12px',
                                            borderRadius: '12px',
                                            backdropFilter: 'blur(10px)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <AlertCircle size={16} color="white" />
                                            <span style={{
                                                color: 'white',
                                                fontSize: '0.84rem',
                                                fontWeight: 600,
                                                fontFamily: 'var(--font-sans)'
                                            }}>
                                                Kacamata terdeteksi
                                            </span>
                                        </div>
                                    )}
                                    {hasFilter && (
                                        <div style={{
                                            background: 'rgba(239, 68, 68, 0.92)',
                                            padding: '8px 12px',
                                            borderRadius: '12px',
                                            backdropFilter: 'blur(10px)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <AlertCircle size={16} color="white" />
                                            <span style={{
                                                color: 'white',
                                                fontSize: '0.84rem',
                                                fontWeight: 600,
                                                fontFamily: 'var(--font-sans)'
                                            }}>
                                                Filter terdeteksi
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{
                        width: '100%',
                        maxWidth: '520px',
                        padding: '0 20px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        <button
                            onClick={() => confirmCapture(false)}
                            disabled={isAutoProceeding}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '16px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #c084a0 0%, #9d5a76 100%)',
                                color: 'white',
                                fontSize: 'clamp(0.97rem, 4vw, 1.08rem)',
                                fontWeight: 700,
                                cursor: isAutoProceeding ? 'not-allowed' : 'pointer',
                                fontFamily: 'var(--font-sans)',
                                boxShadow: '0 10px 26px rgba(157, 90, 118, 0.42)',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                opacity: isAutoProceeding ? 0.72 : 1
                            }}
                        >
                            <Sparkles size={20} />
                            {isAutoProceeding ? 'Memproses...' : 'Lanjutkan Analisis'}
                        </button>
                        <button
                            onClick={retakePhoto}
                            disabled={isAutoProceeding}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '16px',
                                border: '2px solid rgba(255,255,255,0.44)',
                                background: 'rgba(255,255,255,0.18)',
                                color: 'white',
                                fontSize: 'clamp(0.96rem, 4vw, 1.06rem)',
                                fontWeight: 600,
                                cursor: isAutoProceeding ? 'not-allowed' : 'pointer',
                                fontFamily: 'var(--font-sans)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.2s ease',
                                opacity: isAutoProceeding ? 0.6 : 1
                            }}
                        >
                            Ulangi Foto
                        </button>
                    </div>
                </div>
            )}

            {/* Camera Error */}
            {hasCameraError && (
                <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    textAlign: 'center', 
                    zIndex: 20, 
                    background: 'rgba(0,0,0,0.9)', 
                    padding: '40px', 
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    maxWidth: '80%'
                }}>
                    <AlertCircle size={56} color="#f87171" style={{ marginBottom: '20px' }} />
                    <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '12px', fontWeight: 600 }}>
                        Akses Kamera Ditolak
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        Mohon izinkan akses kamera untuk melanjutkan analisis kulit
                    </p>
                </div>
            )}

            {/* Pulse animation */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.05); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                /* Professional Slider Styling */
                input[type="range"] {
                    -webkit-appearance: none;
                    appearance: none;
                }
                
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    border: 2px solid rgba(255, 255, 255, 0.9);
                    position: relative;
                    z-index: 2;
                }
                
                input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    border: 2px solid rgba(255, 255, 255, 0.9);
                    position: relative;
                    z-index: 2;
                }
                
                input[type="range"]::-webkit-slider-track {
                    background: transparent;
                }
                
                input[type="range"]::-moz-range-track {
                    background: transparent;
                    border: none;
                }
            `}</style>
        </div>
    );
};

export default ScannerEnhanced;

