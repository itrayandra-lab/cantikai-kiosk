


import { Fragment, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { X, MoveUpRight, Info, Sparkles, ScanFace, Heart } from 'lucide-react';
import { analyzeSkinWithAI } from '../services/aiAnalysisService';
import apiService from '../services/api';
import AnalysisModeModal from '../components/AnalysisModeModal';
import ErrorToast from '../components/ErrorToast';
import metricExplanations from '../data/metricExplanations';

// SPACING CONSTANTS - COMPACT & MINIMALIST
const SPACING = {
    section: 12,      // Section gap
    card: 16,         // Card padding
    element: 8,       // Element margin
    grid: 12          // Grid gap
};

const TYPOGRAPHY = {
    h1: '1.5rem',
    h2: '1.2rem',
    h3: '1.1rem',
    h4: '1rem',
    body: '0.9rem',
    small: '0.8rem',
    tiny: '0.75rem'
};

const AnalysisResult = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { sessionId: urlSessionId } = useParams(); // Get sessionId from URL if shared link
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [loadingStage, setLoadingStage] = useState('');
    const [showOverallScore, setShowOverallScore] = useState(false);
    const [showVisualization, setShowVisualization] = useState(false);
    const [showMetrics, setShowMetrics] = useState(false);
    const [showProducts, setShowProducts] = useState(false);
    const [resultData, setResultData] = useState(null);
    const [aiInsights, setAiInsights] = useState(null);
    const [analysisEngine, setAnalysisEngine] = useState('');
    const [selectedMode, setSelectedMode] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [error, setError] = useState(null);
    const [visualizationImage, setVisualizationImage] = useState(null);
    const [showOriginal, setShowOriginal] = useState(false);
    
    // WhatsApp sharing states
    const [userName, setUserName] = useState('');
    const [userWhatsApp, setUserWhatsApp] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [sending, setSending] = useState(false);

    // Check auth status on mount - REMOVED FOR KIOSK MODE (no authentication required)
    // Auto-save happens automatically in useEffect, no manual save needed

    useEffect(() => {
        if (!resultData) return;
        try {
            localStorage.setItem('cantik_last_result_data', JSON.stringify(resultData));
        } catch (error) {
            console.warn('Failed to cache last result data:', error);
        }
    }, [resultData]);

    useEffect(() => {
        if (!aiInsights) return;
        try {
            localStorage.setItem('cantik_last_ai_insights', JSON.stringify(aiInsights));
        } catch (error) {
            console.warn('Failed to cache last AI insights:', error);
        }
    }, [aiInsights]);

    // Generate or retrieve session ID
    const getOrCreateSessionId = () => {
        // Check if we have a session ID in state (from navigation)
        if (state?.sessionId) {
            return state.sessionId;
        }
        
        // Check sessionStorage for existing session
        const existingSession = sessionStorage.getItem('current_analysis_session');
        if (existingSession) {
            try {
                const session = JSON.parse(existingSession);
                // Session is valid if less than 1 hour old
                if (Date.now() - session.timestamp < 3600000) {
                    return session.id;
                }
            } catch (e) {
                console.warn('Invalid session data, creating new session');
            }
        }
        
        // Create new session ID
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const sessionData = {
            id: newSessionId,
            timestamp: Date.now()
        };
        sessionStorage.setItem('current_analysis_session', JSON.stringify(sessionData));
        return newSessionId;
    };

    // Clear session (called when user scans again or saves report)
    const clearSession = () => {
        sessionStorage.removeItem('current_analysis_session');
        // Clear all analysis sessions
        Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith('analysis_session_')) {
                sessionStorage.removeItem(key);
            }
            if (key.startsWith('analysis_run_lock_')) {
                sessionStorage.removeItem(key);
            }
        });
    };

    // Auto-save analysis to Database (CRITICAL for shared links!)
    const autoSaveAnalysis = async (analysisData, currentSessionId, imageBase64, vizImage, customerName = null, customerWhatsApp = null, customerEmail = null) => {
        try {
            console.log('💾 ========== AUTO-SAVE START ==========');
            console.log('💾 Session ID:', currentSessionId);
            console.log('💾 Customer Name:', customerName);
            console.log('💾 Customer WhatsApp:', customerWhatsApp);
            console.log('💾 Customer Email:', customerEmail);
            console.log('💾 Has Image:', !!imageBase64);
            console.log('💾 Has Visualization:', !!vizImage);
            console.log('💾 Analysis Data Keys:', Object.keys(analysisData || {}));
            
            // CRITICAL: Validate session ID
            if (!currentSessionId) {
                throw new Error('Session ID is required for auto-save');
            }
            
            // Get or create user ID
            let userId = localStorage.getItem('cantik_user_id');
            if (!userId) {
                console.log('💾 Creating new user...');
                const user = await apiService.createUser({
                    email: `kiosk_${Date.now()}@cantik.ai`,
                    username: `Kiosk_${Date.now()}`
                });
                userId = user.id;
                localStorage.setItem('cantik_user_id', userId);
                console.log('✅ User created:', userId);
            }

            // Prepare complete analysis data for storage
            const dataToSave = {
                user_id: parseInt(userId),
                client_session_id: currentSessionId,
                customer_name: customerName,
                customer_whatsapp: customerWhatsApp,
                customer_email: customerEmail,
                image_base64: imageBase64 || '',
                visualization_base64: vizImage || '',
                overall_score: analysisData.overall_score || 0,
                skin_type: analysisData.skin_type || 'Unknown',
                fitzpatrick_type: analysisData.fitzpatrick_type || 'III',
                predicted_age: analysisData.predicted_age || 
                              analysisData.age_prediction?.predicted_age || 
                              25,
                analysis_version: analysisData.analysis_version || '7.0',
                engine: analysisData.engine || 'AI Analysis',
                processing_time_ms: Math.round(parseFloat(analysisData.processing_time || 0) * 1000),
                analysis_data: analysisData,
                ai_insights: analysisData.ai_insights || analysisData.ai_report || {}
            };

            console.log('💾 Sending to backend:', {
                user_id: dataToSave.user_id,
                client_session_id: dataToSave.client_session_id,
                customer_name: dataToSave.customer_name,
                customer_whatsapp: dataToSave.customer_whatsapp,
                customer_email: dataToSave.customer_email,
                overall_score: dataToSave.overall_score,
                skin_type: dataToSave.skin_type,
                has_image: !!dataToSave.image_base64,
                has_visualization: !!dataToSave.visualization_base64,
                image_size: dataToSave.image_base64?.length || 0,
                viz_size: dataToSave.visualization_base64?.length || 0
            });
            
            const savedAnalysis = await apiService.saveAnalysis(dataToSave);
            
            console.log('✅ ========== AUTO-SAVE SUCCESS ==========');
            console.log('✅ Saved Analysis ID:', savedAnalysis?.id);
            console.log('✅ Session ID in DB:', currentSessionId);
            console.log('✅ Customer:', customerName, customerWhatsApp);
            console.log('✅ Shared Link:', `${window.location.origin}/analysis/${currentSessionId}`);
            console.log('✅ ========================================');
            
            return savedAnalysis;

        } catch (error) {
            console.error('❌ ========== AUTO-SAVE FAILED ==========');
            console.error('❌ Error:', error);
            console.error('❌ Error Message:', error.message);
            console.error('❌ Session ID:', currentSessionId);
            console.error('❌ This will cause 404 error on shared links!');
            console.error('❌ ========================================');
            throw error;
        }
    };

    // Open analysis mode detail modal
    const openModeDetail = (mode) => {
        setSelectedMode(mode);
    };

    // Manual save function - REMOVED FOR KIOSK MODE
    // Auto-save happens automatically, no manual save button needed

    useEffect(() => {
        // If URL has sessionId parameter (shared link), load from database
        if (urlSessionId) {
            const loadFromDatabase = async () => {
                try {
                    console.log('📥 Loading analysis from shared link:', urlSessionId);
                    setLoadingStage('Memuat hasil analisis...');
                    setProgress(50);
                    
                    // Load from database using session ID
                    const analysis = await apiService.getAnalysisBySessionId(urlSessionId);
                    
                    if (!analysis) {
                        throw new Error('Analysis not found');
                    }
                    
                    console.log('✅ Analysis loaded from database:', analysis);
                    
                    // Parse the stored data
                    const analysisData = analysis.vision_analysis || {};
                    const aiInsightsData = analysis.ai_insights || {};
                    
                    // Reconstruct resultData from database fields
                    const reconstructedData = {
                        overall_score: analysis.overall_score,
                        skin_type: analysis.skin_type,
                        fitzpatrick_type: analysis.fitzpatrick_type,
                        predicted_age: analysis.predicted_age,
                        analysis_version: analysis.analysis_version,
                        engine: analysis.engine,
                        processing_time: (analysis.processing_time_ms / 1000).toFixed(2),
                        ...analysisData,
                        ai_insights: aiInsightsData,
                        ai_report: aiInsightsData,
                        product_recommendations: analysis.product_recommendations || []
                    };
                    
                    setResultData(reconstructedData);
                    setAiInsights(aiInsightsData);
                    setAnalysisEngine(analysis.engine || 'AI Analysis');
                    setVisualizationImage(analysis.visualization_url || null);
                    setSessionId(urlSessionId);
                    
                    // Show all sections
                    setProgress(100);
                    setShowOverallScore(true);
                    setShowVisualization(true);
                    setShowMetrics(true);
                    setShowProducts(true);
                    setLoading(false);
                    
                    console.log('✅ Loaded analysis from database successfully');
                } catch (error) {
                    console.error('❌ Failed to load shared analysis:', error);
                    setError('Gagal memuat hasil analisis. Link mungkin sudah kadaluarsa atau tidak valid.');
                    setLoading(false);
                }
            };
            
            loadFromDatabase();
            return;
        }
        
        // Allow loading from history with imageUrl OR imageBase64
        if (!state?.imageBase64 && !state?.imageUrl && !state?.fromHistory) {
            navigate('/');
            return;
        }

        // Initialize session ID
        const currentSessionId = getOrCreateSessionId();
        setSessionId(currentSessionId);

        // Check if coming from history (already has data)
        if (state?.fromHistory) {
            console.log('📊 Loading from history...');
            console.log('📸 Has image:', !!state.imageBase64);
            console.log('🔬 Has visualization:', !!state.visualizationImage);
            console.log('📊 Session ID:', state.sessionId);
            
            setResultData(state.resultData);
            setAiInsights(state.aiInsights);
            setAnalysisEngine(state.analysisEngine);
            setSessionId(state.sessionId || currentSessionId); // Set session ID for sharing
            
            // Load visualization if available
            if (state.visualizationImage) {
                setVisualizationImage(state.visualizationImage);
                setShowVisualization(true);
                console.log('✅ Visualization loaded from history');
            }
            
            // Show all sections immediately for historical data
            setProgress(100);
            setShowOverallScore(true);
            setShowMetrics(true);
            setShowProducts(true);
            setLoading(false);
            return;
        }

        const sessionKey = `analysis_session_${currentSessionId}`;
        const runLockKey = `analysis_run_lock_${currentSessionId}`;
        const hydrateFromSession = (serializedSessionData) => {
            try {
                console.log('📦 Loading analysis from session storage...');
                const parsed = JSON.parse(serializedSessionData);

                setResultData(parsed.resultData);
                setAiInsights(parsed.aiInsights);
                setAnalysisEngine(parsed.analysisEngine);

                // Show all sections immediately
                setProgress(100);
                setShowOverallScore(true);
                setShowMetrics(true);
                setShowProducts(true);
                setLoading(false);

                console.log('✅ Loaded from session successfully');
                return true;
            } catch (sessionError) {
                console.warn('⚠️ Session data corrupted, will re-analyze');
                sessionStorage.removeItem(sessionKey);
                return false;
            }
        };

        const sessionData = sessionStorage.getItem(sessionKey);
        if (sessionData && hydrateFromSession(sessionData)) {
            sessionStorage.removeItem(runLockKey);
            return;
        }

        const existingRunLock = sessionStorage.getItem(runLockKey);
        if (existingRunLock) {
            console.log('⏳ Analysis already running, waiting for session result...');
            const startedAt = Date.now();
            const waitInterval = window.setInterval(() => {
                const cachedData = sessionStorage.getItem(sessionKey);
                if (cachedData && hydrateFromSession(cachedData)) {
                    sessionStorage.removeItem(runLockKey);
                    window.clearInterval(waitInterval);
                    return;
                }

                if (Date.now() - startedAt > 45000) {
                    sessionStorage.removeItem(runLockKey);
                    window.clearInterval(waitInterval);
                    console.warn('⚠️ Wait lock timeout, retrying analysis...');
                    window.location.reload();
                }
            }, 350);

            return () => {
                window.clearInterval(waitInterval);
            };
        }

        sessionStorage.setItem(runLockKey, JSON.stringify({
            startedAt: Date.now(),
            sessionId: currentSessionId
        }));

        const fetchAnalysis = async (skipValidation = false) => {
            try {
                // Stage 1: Preparing (0-10%)
                setLoadingStage('Mempersiapkan analisis...');
                setProgress(5);
                await new Promise(resolve => setTimeout(resolve, 200));
                setProgress(10);

                // Stage 2: AI Analysis (10-70%) - Direct to Gemini
                setLoadingStage(' Menganalisis dengan AI Dermatology...');
                setProgress(20);
                
                console.log('🚀 Starting AI-Only Analysis...');
                const analysisResult = await analyzeSkinWithAI(state.imageBase64, skipValidation);
                
                if (!analysisResult.success) {
                    throw new Error(analysisResult.error || 'Analysis failed');
                }
                
                const analysisData = analysisResult.data;
                setProgress(60);
                
                // Cache image for later use (WhatsApp sharing)
                if (state.imageBase64) {
                    localStorage.setItem('cantik_last_scan_image', state.imageBase64);
                    console.log('💾 Cached scan image for later use');
                }
                
                // Stage 3: Show Overall Score IMMEDIATELY (60-70%)
                setLoadingStage('Menampilkan hasil...');
                setResultData(analysisData);
                setAiInsights(analysisData.ai_insights || analysisData.ai_report);
                setAnalysisEngine(analysisData.engine);
                setShowOverallScore(true);
                setProgress(70);
                setLoading(false); // Stop loading, show results!
                
                // Skip visualization generation - show original image only
                setVisualizationImage(state.imageBase64); // Use original image
                setShowVisualization(true);
                setProgress(75);
                
                // Stage 4: Show 15 Analysis Modes (75-85%)
                await new Promise(resolve => setTimeout(resolve, 300));
                setShowMetrics(true);
                setProgress(85);
                
                // Stage 5: Show Action Buttons (85-100%)
                await new Promise(resolve => setTimeout(resolve, 300));
                setShowProducts(true);
                setProgress(100);
                
                // Save to session storage
                const sessionKey = `analysis_session_${currentSessionId}`;
                const sessionData = {
                    resultData: analysisData,
                    aiInsights: analysisData.ai_insights || analysisData.ai_report,
                    analysisEngine: analysisData.engine,
                    timestamp: Date.now(),
                    sessionId: currentSessionId
                };
                sessionStorage.setItem(sessionKey, JSON.stringify(sessionData));
                sessionStorage.removeItem(runLockKey);
                console.log('💾 Analysis saved to session:', currentSessionId);
                
                // Auto-save to Database (CRITICAL for shared links!)
                try {
                    console.log('💾 ========== AUTO-SAVE START ==========');
                    console.log('💾 Session ID:', currentSessionId);
                    console.log('💾 Analysis Data Keys:', Object.keys(analysisData));
                    console.log('💾 Overall Score:', analysisData.overall_score);
                    console.log('💾 Skin Type:', analysisData.skin_type);
                    // Pass image to auto-save (no visualization needed)
                    const savedAnalysis = await autoSaveAnalysis(
                        analysisData, 
                        currentSessionId,
                        state.imageBase64,
                        null, // No visualization image
                        null, // Customer name (not available yet)
                        null, // Customer WhatsApp (not available yet)
                        null  // Customer email (not available yet)
                    );
                    
                    console.log('✅ ========== AUTO-SAVE SUCCESS ==========');
                    console.log('✅ Saved Analysis ID:', savedAnalysis?.id);
                    console.log('✅ Session ID in DB:', currentSessionId);
                    console.log('✅ ========================================');
                } catch (autoSaveError) {
                    console.error('❌ ========== AUTO-SAVE FAILED ==========');
                    console.error('❌ Error:', autoSaveError);
                    console.error('❌ Error Message:', autoSaveError.message);
                    console.error('❌ Error Stack:', autoSaveError.stack);
                    console.error('❌ This will cause 404 error on shared links!');
                    console.error('❌ ========================================');
                    
                    // Show warning to user
                    alert(`⚠️ PERINGATAN: Data tidak tersimpan ke database!\n\nError: ${autoSaveError.message}\n\nLink sharing tidak akan berfungsi. Silakan coba scan ulang.`);
                }
                
                setProgress(100);
                console.log(`✅ Analysis complete`);
            } catch (error) {
                sessionStorage.removeItem(runLockKey);
                console.error('Analysis error:', error);
                const isInvalidInput = error?.code === 'INVALID_INPUT_QUALITY'
                    || /foto.*(tidak valid|belum layak|invalid)/i.test(String(error?.message || ''));
                
                // Check if it's a minor quality issue
                const isMinorQualityIssue = isInvalidInput && (
                    /slightly|minor|sedikit|ringan/i.test(String(error?.message || ''))
                );
                
                if (isMinorQualityIssue) {
                    setError({
                        type: 'minor_quality',
                        message: error.message || 'Foto memiliki masalah kualitas minor.',
                        canRetry: true
                    });
                } else {
                    setError(
                        isInvalidInput
                            ? (error.message || 'Foto belum valid untuk analisa. Silakan ulangi scan tanpa masker/kacamata dan dengan cahaya cukup.')
                            : 'Gagal melakukan analisis. Pastikan koneksi internet stabil dan coba lagi.'
                    );
                    
                    // Auto-redirect after 3 seconds for major issues
                    setTimeout(() => {
                        navigate(isInvalidInput ? '/scan' : '/');
                    }, 3000);
                }
                
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [state, navigate]);

    // Retry function for minor quality issues
    const retryWithRelaxedValidation = async () => {
        setError(null);
        setLoading(true);
        setProgress(0);
        
        try {
            // Stage 1: Preparing (0-10%)
            setLoadingStage('Mempersiapkan analisis...');
            setProgress(5);
            await new Promise(resolve => setTimeout(resolve, 200));
            setProgress(10);

            // Stage 2: AI Analysis (10-70%) - Direct to Gemini
            setLoadingStage(' Menganalisis dengan AI Dermatology (Mode Toleran)...');
            setProgress(20);
            
            console.log('🚀 Starting AI-Only Analysis (Skip Validation)...');
            const analysisResult = await analyzeSkinWithAI(state.imageBase64, true);
            
            if (!analysisResult.success) {
                throw new Error(analysisResult.error || 'Analysis failed');
            }
            
            const analysisData = analysisResult.data;
            setProgress(60);
            
            // Stage 3: Show Overall Score IMMEDIATELY (60-70%)
            setLoadingStage('Menampilkan hasil...');
            setResultData(analysisData);
            setAiInsights(analysisData.ai_insights || analysisData.ai_report);
            setAnalysisEngine(analysisData.engine);
            setShowOverallScore(true);
            setProgress(70);
            setLoading(false); // Stop loading, show results!
            
            console.log('✅ Retry analysis complete');
        } catch (error) {
            console.error('Retry analysis error:', error);
            setError('Gagal melakukan analisis. Pastikan koneksi internet stabil dan coba lagi.');
            setLoading(false);
        }
    };

    return (
        <div className="app-container" style={{ position: 'relative', overflow: 'hidden' }}>

            {/* Error Toast */}
            {error && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    backgroundColor: '#ff4444',
                    color: 'white',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    maxWidth: '90vw',
                    textAlign: 'center'
                }}>
                    <div style={{ marginBottom: error?.canRetry ? '12px' : '0' }}>
                        {typeof error === 'string' ? error : error?.message}
                    </div>
                    {error?.canRetry && (
                        <button
                            onClick={retryWithRelaxedValidation}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                marginRight: '8px'
                            }}
                        >
                            🔄 Coba Tetap Analisis
                        </button>
                    )}
                    <button
                        onClick={() => setError(null)}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        ✕ Tutup
                    </button>
                </div>
            )}

            {/* Fixed Floating Progress Phase - HIDDEN FOR KIOSK MODE */}
            {/* Progress bar removed for cleaner kiosk experience */}

            {/* Intense Background Face Blur */}
            {(state?.imageBase64 || state?.imageUrl) && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: `url(${state?.imageBase64 || state?.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(55px) brightness(1.1) saturate(1.2)',
                    transform: 'scale(1.25)',
                    zIndex: 0
                }} />
            )}

            {/* Light elegant frosted white/pink overlay tint */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(180deg, rgba(250, 246, 248, 0.85) 0%, rgba(241, 211, 226, 0.6) 100%)',
                zIndex: 0
            }} />

            <div className="screen-content" style={{ zIndex: 1, padding: '48px 24px', flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: '100px' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>
                    <div>
                        <p style={{ color: 'var(--text-headline)', marginBottom: '0px', fontWeight: 500, fontSize: '1.2rem', opacity: 0.9 }}>
                            {state?.fromHistory ? 'Riwayat' : 'Laporan'}
                        </p>
                        <h1 className="headline" style={{ fontSize: 'clamp(1.8rem, 8vw, 2.4rem)', lineHeight: 1.05 }}>
                            {state?.fromHistory ? 'Laporan Kulit' : 'Kulit Anda'}
                        </h1>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
                    >
                        <X size={28} color="var(--text-headline)" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Info Badge - Hidden (Backend Implementation Detail) */}

                {/* Guest Token Banner - REMOVED FOR KIOSK MODE */}
                
                {loading ? (
                    <div className="card-glass" style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                        {/* Progress Circle */}
                        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                            <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="none"
                                    stroke="rgba(157, 143, 166, 0.2)"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="none"
                                    stroke="var(--primary-color)"
                                    strokeWidth="8"
                                    strokeDasharray={`${2 * Math.PI * 54}`}
                                    strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
                                    strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                                />
                            </svg>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <h2 className="headline" style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)', margin: 0, color: 'var(--primary-color)' }}>{progress}%</h2>
                            </div>
                        </div>
                        
                        {/* Loading Stage Text */}
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '8px' }}>
                                {loadingStage || 'Memproses...'}
                            </p>
                            <p className="subtitle" style={{ fontSize: '0.9rem' }}>
                                Mohon tunggu, AI sedang menganalisis kulit Anda
                            </p>
                        </div>

                        {/* Progress Steps */}
                        <div style={{ width: '100%', maxWidth: '400px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {[
                                    { label: 'Skor Kesehatan', threshold: 50 },
                                    { label: 'Visualisasi 15-Mode', threshold: 60 },
                                    { label: 'Analisis Detail', threshold: 75 },
                                    { label: 'Rekomendasi AI', threshold: 90 },
                                    { label: 'Produk Rekomendasi', threshold: 100 }
                                ].map((step, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: progress >= step.threshold ? 'var(--primary-color)' : 'rgba(157, 143, 166, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'background 0.3s ease'
                                        }}>
                                            {progress >= step.threshold && (
                                                <span style={{ color: 'white', fontSize: '0.8rem' }}>✓</span>
                                            )}
                                        </div>
                                        <span style={{
                                            fontSize: '0.9rem',
                                            color: progress >= step.threshold ? 'var(--text-headline)' : 'var(--text-body)',
                                            fontWeight: progress >= step.threshold ? 600 : 400,
                                            transition: 'all 0.3s ease'
                                        }}>
                                            {step.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Stage 1: Overall Score + Summary - COMPACT */}
                        {showOverallScore && (
                            <div style={{ animation: 'etherealFade 0.6s ease' }}>
                                <div className="card-glass" style={{ padding: `${SPACING.card}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: `${SPACING.section}px` }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <span className="headline" style={{ fontSize: 'clamp(1.8rem, 6vw, 2.2rem)', color: 'var(--text-headline)', lineHeight: 1 }}>{resultData?.overall_score}<span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-sans)', fontWeight: 300 }}>%</span></span>
                                        <span style={{ fontSize: TYPOGRAPHY.body, color: 'var(--text-headline)', fontWeight: 600 }}>Kesehatan Kulit</span>
                                    </div>
                                </div>

                                <div className="card-glass" style={{ padding: `${SPACING.card}px` }}>
                                    <h3 style={{ fontSize: TYPOGRAPHY.h3, fontWeight: 600, color: 'var(--text-headline)', marginBottom: `${SPACING.element}px` }}>
                                        📊 Ringkasan Hasil
                                    </h3>
                                    
                                    {/* Combined Summary: Data-Driven + AI Insights */}
                                    <p style={{ fontSize: TYPOGRAPHY.small, color: 'var(--text-body)', lineHeight: 1.6, marginBottom: `${SPACING.element}px`, fontFamily: 'var(--font-sans)' }}>
                                        {(() => {
                                            const score = resultData?.overall_score || 0;
                                            const acneCount = resultData?.acne?.acne_count || 0;
                                            const wrinkleCount = resultData?.wrinkles?.wrinkle_count || 0;
                                            const darkSpots = resultData?.pigmentation?.dark_spot_count || 0;
                                            const priorityConcerns = resultData?.priority_concerns || [];
                                            
                                            let condition = score >= 80 ? "sangat baik" : score >= 60 ? "baik" : score >= 40 ? "cukup baik" : "memerlukan perhatian";
                                            let emoji = score >= 80 ? "✨" : score >= 60 ? "😊" : score >= 40 ? "🤔" : "⚠️";
                                            
                                            // Start with data-driven summary
                                            let summary = `${emoji} Kulit Anda dalam kondisi ${condition} dengan skor ${score}/100. `;
                                            
                                            const issues = [];
                                            if (acneCount > 0) issues.push(`${acneCount} jerawat`);
                                            if (wrinkleCount > 0) issues.push(`${wrinkleCount} garis halus`);
                                            if (darkSpots > 0) issues.push(`${darkSpots} bintik gelap`);
                                            
                                            if (issues.length > 0) {
                                                summary += `Terdeteksi ${issues.join(', ')}. `;
                                            }
                                            
                                            if (priorityConcerns.length > 0) {
                                                const concerns = priorityConcerns.map(c => c.concern).join(', ');
                                                const zones = priorityConcerns[0]?.zones?.join(', ') || 'wajah';
                                                summary += `Prioritas: ${concerns} di ${zones}. `;
                                            }
                                            
                                            // Add AI summary if available
                                            if (aiInsights?.summary) {
                                                summary += '\n\n' + aiInsights.summary;
                                            }
                                            
                                            return summary;
                                        })()}
                                    </p>
                                    
                                    {/* Breakdown Metrics - INLINE */}
                                    <div style={{ display: 'flex', gap: `${SPACING.element}px`, flexWrap: 'wrap', marginTop: `${SPACING.element}px` }}>
                                        <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '10px', padding: '8px 12px', flex: '1 1 auto', minWidth: '120px' }}>
                                            <p style={{ fontSize: TYPOGRAPHY.tiny, color: 'var(--text-body)', marginBottom: '2px' }}>Jenis Kulit</p>
                                            <p style={{ fontSize: TYPOGRAPHY.small, fontWeight: 600, color: 'var(--text-headline)', margin: 0 }}>{resultData?.skin_type || "Normal"}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Priority Concerns - COMPACT */}
                                    {resultData?.priority_concerns && resultData.priority_concerns.length > 0 && (
                                        <div style={{ marginTop: `${SPACING.element}px`, padding: '10px 12px', background: 'rgba(230, 0, 126, 0.06)', borderRadius: '10px', borderLeft: '3px solid var(--primary-color)' }}>
                                            <p style={{ fontSize: TYPOGRAPHY.tiny, fontWeight: 600, color: 'var(--text-headline)', marginBottom: '4px' }}>
                                                🎯 Prioritas:
                                            </p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {resultData.priority_concerns.map((concern, idx) => (
                                                    <span key={idx} style={{ fontSize: TYPOGRAPHY.tiny, color: 'var(--text-body)', background: 'rgba(255,255,255,0.5)', padding: '4px 8px', borderRadius: '6px' }}>
                                                        {concern.concern} ({concern.severity})
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Detailed content: KIOSK MODE - No authentication required */}
                        <>
                            {/* Stage 2: Skin Analyzer Visualization */}
                            {showVisualization && visualizationImage && (
                                <div style={{ animation: 'etherealFade 0.6s ease', marginBottom: `${SPACING.section}px` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: `${SPACING.element}px` }}>
                                        <h3 style={{ fontSize: TYPOGRAPHY.h3, fontWeight: 600, color: 'var(--text-headline)' }}>
                                            📸 Original Image
                                        </h3>
                                        </div>
                                        
                                        <div className="card-glass" style={{ padding: '12px', overflow: 'hidden' }}>
                                            <img 
                                                src={state?.imageBase64 || state?.imageUrl || visualizationImage}
                                                alt="Original Scan"
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    borderRadius: '12px',
                                                    display: 'block'
                                                }}
                                            />
                                            <p style={{
                                                fontSize: TYPOGRAPHY.tiny,
                                                color: 'var(--text-body)',
                                                textAlign: 'center',
                                                marginTop: '8px',
                                                fontFamily: 'var(--font-sans)'
                                            }}>
                                                📸 Original Image
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Stage 3: 15 Analysis Modes - TEXT BASED */}
                                {showMetrics && resultData && resultData.analysis_modes && (
                                    <div style={{ animation: 'etherealFade 0.6s ease', marginBottom: `${SPACING.section}px` }}>
                                        <h3 style={{ fontSize: TYPOGRAPHY.h3, fontWeight: 600, color: 'var(--text-headline)', marginBottom: `${SPACING.element}px`, textShadow: '0 2px 10px rgba(255,255,255,0.8)' }}>
                                            🔬 15 Analysis Modes
                                        </h3>
                                        
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                            gap: `${SPACING.grid}px`
                                        }}>
                                            {resultData.analysis_modes.map((mode, index) => (
                                                <div 
                                                    key={index}
                                                    className="card-glass" 
                                                    style={{ 
                                                        padding: '16px',
                                                        borderLeft: `4px solid ${
                                                            mode.score >= 80 ? '#10b981' : 
                                                            mode.score >= 60 ? '#f59e0b' : 
                                                            '#ef4444'
                                                        }`,
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                        <h4 style={{ 
                                                            fontSize: '0.95rem', 
                                                            fontWeight: 700, 
                                                            color: 'var(--text-headline)',
                                                            margin: 0,
                                                            fontFamily: 'var(--font-sans)'
                                                        }}>
                                                            {mode.title}
                                                        </h4>
                                                        <span style={{
                                                            fontSize: '1.1rem',
                                                            fontWeight: 700,
                                                            color: mode.score >= 80 ? '#10b981' : 
                                                                   mode.score >= 60 ? '#f59e0b' : 
                                                                   '#ef4444',
                                                            fontFamily: 'var(--font-mono)'
                                                        }}>
                                                            {mode.score}
                                                        </span>
                                                    </div>
                                                    
                                                    <div style={{ marginBottom: '8px' }}>
                                                        <span style={{
                                                            display: 'inline-block',
                                                            padding: '4px 10px',
                                                            borderRadius: '12px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            background: mode.score >= 80 ? 'rgba(16, 185, 129, 0.15)' : 
                                                                       mode.score >= 60 ? 'rgba(245, 158, 11, 0.15)' : 
                                                                       'rgba(239, 68, 68, 0.15)',
                                                            color: mode.score >= 80 ? '#10b981' : 
                                                                   mode.score >= 60 ? '#f59e0b' : 
                                                                   '#ef4444',
                                                            fontFamily: 'var(--font-sans)'
                                                        }}>
                                                            {mode.status}
                                                        </span>
                                                    </div>
                                                    
                                                    <p style={{
                                                        fontSize: '0.8rem',
                                                        color: 'var(--text-body)',
                                                        lineHeight: 1.5,
                                                        margin: '8px 0 0 0',
                                                        fontFamily: 'var(--font-sans)'
                                                    }}>
                                                        {mode.insight || mode.detail}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Stage 4: Full Analysis Data */}
                                {showMetrics && resultData && (
                                    <div style={{ animation: 'etherealFade 0.6s ease' }}>
                                        {/* Analysis Metrics Grid */}
                                        <h3 style={{ fontSize: TYPOGRAPHY.h3, fontWeight: 600, color: 'var(--text-headline)', marginBottom: `${SPACING.element}px`, textShadow: '0 2px 10px rgba(255,255,255,0.8)' }}>
                                            📊 Analisis Detail Kulit
                                        </h3>
                                        
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                                            gap: `${SPACING.grid}px`,
                                            marginBottom: '20px'
                                        }}>
                                            {/* Acne */}
                                            {resultData.acne && (
                                                <div className="card-glass" style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-headline)' }}>Jerawat</span>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: resultData.acne.acne_score >= 80 ? '#10b981' : resultData.acne.acne_score >= 60 ? '#f59e0b' : '#ef4444' }}>
                                                            {resultData.acne.acne_score || 0}
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', margin: 0 }}>
                                                        {resultData.acne.severity || 'Normal'} • {resultData.acne.acne_count || 0} jerawat
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {/* Wrinkles */}
                                            {resultData.wrinkles && (
                                                <div className="card-glass" style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-headline)' }}>Kerutan</span>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: (100 - (resultData.wrinkles.wrinkle_severity || 0)) >= 80 ? '#10b981' : (100 - (resultData.wrinkles.wrinkle_severity || 0)) >= 60 ? '#f59e0b' : '#ef4444' }}>
                                                            {100 - (resultData.wrinkles.wrinkle_severity || 0)}
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', margin: 0 }}>
                                                        {resultData.wrinkles.severity || 'Minimal'} • {resultData.wrinkles.wrinkle_count || 0} garis
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {/* Pigmentation */}
                                            {resultData.pigmentation && (
                                                <div className="card-glass" style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-headline)' }}>Pigmentasi</span>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: (resultData.pigmentation.uniformity_score || 0) >= 80 ? '#10b981' : (resultData.pigmentation.uniformity_score || 0) >= 60 ? '#f59e0b' : '#ef4444' }}>
                                                            {resultData.pigmentation.uniformity_score || 0}
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', margin: 0 }}>
                                                        {resultData.pigmentation.severity || 'Ringan'} • {resultData.pigmentation.dark_spot_count || 0} bintik
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {/* Hydration */}
                                            {resultData.hydration && (
                                                <div className="card-glass" style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-headline)' }}>Hidrasi</span>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: (resultData.hydration.hydration_level || 0) >= 80 ? '#10b981' : (resultData.hydration.hydration_level || 0) >= 60 ? '#f59e0b' : '#ef4444' }}>
                                                            {resultData.hydration.hydration_level || 0}
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', margin: 0 }}>
                                                        {resultData.hydration.status || 'Normal'}
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {/* Oiliness */}
                                            {resultData.oiliness && (
                                                <div className="card-glass" style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-headline)' }}>Berminyak</span>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: (100 - (resultData.oiliness.oiliness_score || 0)) >= 80 ? '#10b981' : (100 - (resultData.oiliness.oiliness_score || 0)) >= 60 ? '#f59e0b' : '#ef4444' }}>
                                                            {100 - (resultData.oiliness.oiliness_score || 0)}
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', margin: 0 }}>
                                                        {resultData.oiliness.sebum_level || 'Sedang'}
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {/* Pores */}
                                            {resultData.pores && (
                                                <div className="card-glass" style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-headline)' }}>Pori-pori</span>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: (resultData.pores.pore_score || 0) >= 80 ? '#10b981' : (resultData.pores.pore_score || 0) >= 60 ? '#f59e0b' : '#ef4444' }}>
                                                            {resultData.pores.pore_score || 0}
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', margin: 0 }}>
                                                        {resultData.pores.visibility || 'Sedang'} • {resultData.pores.enlarged_count || 0} membesar
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {/* Texture */}
                                            {resultData.texture && (
                                                <div className="card-glass" style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-headline)' }}>Tekstur</span>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: (resultData.texture.texture_score || 0) >= 80 ? '#10b981' : (resultData.texture.texture_score || 0) >= 60 ? '#f59e0b' : '#ef4444' }}>
                                                            {resultData.texture.texture_score || 0}
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', margin: 0 }}>
                                                        {resultData.texture.smoothness || 'Halus'}
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {/* Eye Area */}
                                            {resultData.eye_area && (
                                                <div className="card-glass" style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-headline)' }}>Area Mata</span>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: (resultData.eye_area.firmness || 0) >= 80 ? '#10b981' : (resultData.eye_area.firmness || 0) >= 60 ? '#f59e0b' : '#ef4444' }}>
                                                            {resultData.eye_area.firmness || 0}
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', margin: 0 }}>
                                                        Lingkaran mata: {resultData.eye_area.dark_circles || 0}%
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Additional Info - Integrated (No Title, No Usia Prediksi, No Engine) */}
                                        <div className="card-glass" style={{ padding: '20px', marginTop: '16px' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                {/* Only show Jenis Kulit and Warna Kulit */}
                                                <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '12px', padding: '12px', borderLeft: '3px solid var(--primary-color)' }}>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-body)', marginBottom: '4px', fontWeight: 500 }}>Jenis Kulit</p>
                                                    <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-headline)', margin: 0, fontFamily: 'var(--font-sans)' }}>
                                                        {resultData?.skin_type || "Normal"}
                                                    </p>
                                                </div>
                                                <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '12px', padding: '12px', borderLeft: '3px solid var(--primary-color)' }}>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-body)', marginBottom: '4px', fontWeight: 500 }}>Warna Kulit</p>
                                                    <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-headline)', margin: 0, fontFamily: 'var(--font-sans)' }}>
                                                        {(() => {
                                                            const fitzType = resultData?.fitzpatrick_type || "III";
                                                            const typeMap = {
                                                                'I': 'Tipe I (Sangat Terang)',
                                                                'II': 'Tipe II (Terang)',
                                                                'III': 'Tipe III (Terang-Sedang)',
                                                                'IV': 'Tipe IV (Sedang/Asia)',
                                                                'V': 'Tipe V (Gelap)',
                                                                'VI': 'Tipe VI (Sangat Gelap)'
                                                            };
                                                            return typeMap[fitzType] || `Tipe ${fitzType}`;
                                                        })()}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {/* Analisis Jenis Kulit - INTEGRATED HERE */}
                                            {aiInsights?.skin_type_analysis && (
                                                <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(255,255,255,0.5)', borderRadius: '12px', borderLeft: '4px solid var(--primary-color)' }}>
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: 1.6, margin: 0, fontFamily: 'var(--font-sans)' }}>
                                                        {aiInsights.skin_type_analysis}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Stage 3: AI Insights - COMPREHENSIVE DISPLAY */}
                                {showProducts && aiInsights && (
                                    <div style={{ animation: 'etherealFade 0.6s ease', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        
                                        {/* Main Concerns */}
                                        {aiInsights.main_concerns && aiInsights.main_concerns.length > 0 && (
                                            <div className="card-glass" style={{ padding: '16px' }}>
                                                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '12px', fontFamily: 'var(--font-sans)' }}>
                                                    🎯 Masalah Utama
                                                </h4>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                    {aiInsights.main_concerns.map((concern, idx) => (
                                                        <span key={idx} style={{ 
                                                            fontSize: '0.8rem', 
                                                            color: 'var(--primary-color)', 
                                                            background: 'rgba(230, 0, 126, 0.1)', 
                                                            padding: '6px 12px', 
                                                            borderRadius: '20px',
                                                            fontWeight: 500,
                                                            fontFamily: 'var(--font-sans)'
                                                        }}>
                                                            {concern}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Recommendations */}
                                        {aiInsights.recommendations && (
                                            <div className="card-glass" style={{ padding: '16px' }}>
                                                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '12px', fontFamily: 'var(--font-sans)' }}>
                                                    ✨ Rekomendasi Perawatan
                                                </h4>
                                                
                                                {/* Immediate Actions */}
                                                {aiInsights.recommendations.immediate_actions && aiInsights.recommendations.immediate_actions.length > 0 && (
                                                    <div style={{ marginBottom: '16px' }}>
                                                        <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
                                                            🚀 Tindakan Segera
                                                        </h5>
                                                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                                            {aiInsights.recommendations.immediate_actions.map((action, idx) => (
                                                                <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '4px', fontFamily: 'var(--font-sans)' }}>
                                                                    {action}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Long-term Goals */}
                                                {aiInsights.recommendations.long_term_goals && aiInsights.recommendations.long_term_goals.length > 0 && (
                                                    <div style={{ marginBottom: '16px' }}>
                                                        <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
                                                            🎯 Target Jangka Panjang
                                                        </h5>
                                                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                                            {aiInsights.recommendations.long_term_goals.map((goal, idx) => (
                                                                <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '4px', fontFamily: 'var(--font-sans)' }}>
                                                                    {goal}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Lifestyle Tips */}
                                                {aiInsights.recommendations.lifestyle_tips && aiInsights.recommendations.lifestyle_tips.length > 0 && (
                                                    <div>
                                                        <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
                                                            🌟 Tips Gaya Hidup
                                                        </h5>
                                                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                                            {aiInsights.recommendations.lifestyle_tips.map((tip, idx) => (
                                                                <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '4px', fontFamily: 'var(--font-sans)' }}>
                                                                    {tip}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Product Recommendations */}
                                        {aiInsights.product_recommendations && aiInsights.product_recommendations.length > 0 && (
                                            <div className="card-glass" style={{ padding: '16px' }}>
                                                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '12px', fontFamily: 'var(--font-sans)' }}>
                                                    🛍️ Rekomendasi Produk
                                                </h4>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    {aiInsights.product_recommendations.map((product, idx) => (
                                                        <div key={idx} style={{ 
                                                            background: 'rgba(255,255,255,0.6)', 
                                                            borderRadius: '12px', 
                                                            padding: '12px',
                                                            border: '1px solid rgba(230, 0, 126, 0.1)'
                                                        }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                                <h6 style={{ 
                                                                    fontSize: '0.9rem', 
                                                                    fontWeight: 600, 
                                                                    color: 'var(--text-headline)', 
                                                                    margin: 0,
                                                                    fontFamily: 'var(--font-sans)',
                                                                    flex: 1
                                                                }}>
                                                                    {product.name}
                                                                </h6>
                                                                <span style={{ 
                                                                    fontSize: '0.7rem', 
                                                                    color: 'var(--primary-color)', 
                                                                    background: 'rgba(230, 0, 126, 0.1)', 
                                                                    padding: '4px 8px', 
                                                                    borderRadius: '10px',
                                                                    fontWeight: 500,
                                                                    marginLeft: '8px'
                                                                }}>
                                                                    {product.category}
                                                                </span>
                                                            </div>
                                                            <p style={{ 
                                                                fontSize: '0.8rem', 
                                                                color: 'var(--text-body)', 
                                                                lineHeight: 1.5, 
                                                                margin: '0 0 8px 0',
                                                                fontFamily: 'var(--font-sans)'
                                                            }}>
                                                                {product.reason}
                                                            </p>
                                                            {product.addresses && product.addresses.length > 0 && (
                                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                                    {product.addresses.map((address, addressIdx) => (
                                                                        <span key={addressIdx} style={{ 
                                                                            fontSize: '0.7rem', 
                                                                            color: 'var(--text-body)', 
                                                                            background: 'rgba(157, 143, 166, 0.1)', 
                                                                            padding: '2px 6px', 
                                                                            borderRadius: '8px'
                                                                        }}>
                                                                            {address}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {product.slug && (
                                                                <button
                                                                    onClick={() => navigate(`/products/${product.slug}`)}
                                                                    style={{
                                                                        marginTop: '8px',
                                                                        background: 'var(--primary-color)',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '8px',
                                                                        padding: '6px 12px',
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: 600,
                                                                        cursor: 'pointer',
                                                                        fontFamily: 'var(--font-sans)'
                                                                    }}
                                                                >
                                                                    Lihat Detail
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Skincare Routine */}
                                        {aiInsights.skincare_routine && (
                                            <div className="card-glass" style={{ padding: '16px' }}>
                                                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '12px', fontFamily: 'var(--font-sans)' }}>
                                                    🌅 Rutinitas Skincare
                                                </h4>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                    {/* Morning Routine */}
                                                    {aiInsights.skincare_routine.morning && (
                                                        <div style={{ 
                                                            background: 'rgba(255,255,255,0.6)', 
                                                            borderRadius: '12px', 
                                                            padding: '12px',
                                                            border: '1px solid rgba(255, 193, 7, 0.2)'
                                                        }}>
                                                            <h5 style={{ 
                                                                fontSize: '0.9rem', 
                                                                fontWeight: 600, 
                                                                color: 'var(--text-headline)', 
                                                                marginBottom: '8px',
                                                                fontFamily: 'var(--font-sans)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '6px'
                                                            }}>
                                                                ☀️ Pagi
                                                            </h5>
                                                            <ol style={{ paddingLeft: '16px', margin: 0 }}>
                                                                {aiInsights.skincare_routine.morning.map((step, idx) => (
                                                                    <li key={idx} style={{ 
                                                                        fontSize: '0.8rem', 
                                                                        color: 'var(--text-body)', 
                                                                        lineHeight: 1.5, 
                                                                        marginBottom: '4px',
                                                                        fontFamily: 'var(--font-sans)'
                                                                    }}>
                                                                        {step}
                                                                    </li>
                                                                ))}
                                                            </ol>
                                                        </div>
                                                    )}

                                                    {/* Evening Routine */}
                                                    {aiInsights.skincare_routine.evening && (
                                                        <div style={{ 
                                                            background: 'rgba(255,255,255,0.6)', 
                                                            borderRadius: '12px', 
                                                            padding: '12px',
                                                            border: '1px solid rgba(75, 85, 99, 0.2)'
                                                        }}>
                                                            <h5 style={{ 
                                                                fontSize: '0.9rem', 
                                                                fontWeight: 600, 
                                                                color: 'var(--text-headline)', 
                                                                marginBottom: '8px',
                                                                fontFamily: 'var(--font-sans)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '6px'
                                                            }}>
                                                                🌙 Malam
                                                            </h5>
                                                            <ol style={{ paddingLeft: '16px', margin: 0 }}>
                                                                {aiInsights.skincare_routine.evening.map((step, idx) => (
                                                                    <li key={idx} style={{ 
                                                                        fontSize: '0.8rem', 
                                                                        color: 'var(--text-body)', 
                                                                        lineHeight: 1.5, 
                                                                        marginBottom: '4px',
                                                                        fontFamily: 'var(--font-sans)'
                                                                    }}>
                                                                        {step}
                                                                    </li>
                                                                ))}
                                                            </ol>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Legacy sections for backward compatibility */}
                                        {/* Key Insights */}
                                        {aiInsights.key_insights && aiInsights.key_insights.length > 0 && (
                                            <div className="card-glass" style={{ padding: '16px' }}>
                                                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '12px', fontFamily: 'var(--font-sans)' }}>
                                                    💡 Key Insights
                                                </h4>
                                                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                                    {aiInsights.key_insights.map((insight, idx) => (
                                                        <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '6px', fontFamily: 'var(--font-sans)' }}>
                                                            {insight}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Legacy Recommendations (if different structure) */}
                                        {!aiInsights.recommendations && aiInsights.recommendations && aiInsights.recommendations.length > 0 && (
                                            <div className="card-glass" style={{ padding: '16px' }}>
                                                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '12px', fontFamily: 'var(--font-sans)' }}>
                                                    ✨ Recommendations
                                                </h4>
                                                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                                    {aiInsights.recommendations.map((rec, idx) => (
                                                        <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '6px', fontFamily: 'var(--font-sans)' }}>
                                                            {rec}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Legacy Lifestyle Tips (if different structure) */}
                                        {!aiInsights.recommendations?.lifestyle_tips && aiInsights.lifestyle_tips && aiInsights.lifestyle_tips.length > 0 && (
                                            <div className="card-glass" style={{ padding: '16px' }}>
                                                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '12px', fontFamily: 'var(--font-sans)' }}>
                                                    🌟 Lifestyle Tips
                                                </h4>
                                                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                                    {aiInsights.lifestyle_tips.map((tip, idx) => (
                                                        <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '6px', fontFamily: 'var(--font-sans)' }}>
                                                            {tip}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Timeline */}
                                        {aiInsights.timeline && (
                                            <div className="card-glass" style={{ padding: '16px' }}>
                                                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '12px', fontFamily: 'var(--font-sans)' }}>
                                                    📅 Timeline Perbaikan
                                                </h4>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    {aiInsights.timeline.week_1_2 && (
                                                        <div style={{ background: 'rgba(255,255,255,0.5)', borderRadius: '10px', padding: '10px' }}>
                                                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '4px', fontFamily: 'var(--font-sans)' }}>Minggu 1-2</p>
                                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', margin: 0, fontFamily: 'var(--font-sans)' }}>{aiInsights.timeline.week_1_2}</p>
                                                        </div>
                                                    )}
                                                    {aiInsights.timeline.week_4_6 && (
                                                        <div style={{ background: 'rgba(255,255,255,0.5)', borderRadius: '10px', padding: '10px' }}>
                                                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '4px', fontFamily: 'var(--font-sans)' }}>Minggu 4-6</p>
                                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', margin: 0, fontFamily: 'var(--font-sans)' }}>{aiInsights.timeline.week_4_6}</p>
                                                        </div>
                                                    )}
                                                    {aiInsights.timeline.month_3_plus && (
                                                        <div style={{ background: 'rgba(255,255,255,0.5)', borderRadius: '10px', padding: '10px' }}>
                                                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '4px', fontFamily: 'var(--font-sans)' }}>Bulan 3+</p>
                                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', margin: 0, fontFamily: 'var(--font-sans)' }}>{aiInsights.timeline.month_3_plus}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Stage 4: WhatsApp Form & Send Button - Glassmorphism Style */}
                                {showProducts && (
                                    <div style={{ animation: 'etherealFade 0.6s ease', marginTop: '24px' }}>
                                        {/* Glassmorphism Card Container */}
                                        <div style={{
                                            background: 'rgba(255, 255, 255, 0.75)',
                                            backdropFilter: 'blur(25px)',
                                            WebkitBackdropFilter: 'blur(25px)',
                                            borderRadius: '28px',
                                            padding: '32px 28px',
                                            border: '1px solid rgba(255, 255, 255, 0.85)',
                                            boxShadow: '0 10px 40px rgba(89, 54, 69, 0.08)',
                                            marginBottom: '20px'
                                        }}>
                                            {/* Header */}
                                            <div style={{ 
                                                textAlign: 'center', 
                                                marginBottom: '28px',
                                                paddingBottom: '20px',
                                                borderBottom: '1px solid rgba(157, 90, 118, 0.1)'
                                            }}>
                                                <h3 style={{
                                                    margin: '0 0 8px 0',
                                                    fontSize: '1.4rem',
                                                    fontWeight: 600,
                                                    color: 'var(--text-headline)',
                                                    fontFamily: '"Bricolage Grotesque", -apple-system, BlinkMacSystemFont, sans-serif',
                                                    letterSpacing: '-0.01em'
                                                }}>
                                                    📱 Dapatkan Hasil Lengkap
                                                </h3>
                                                <p style={{
                                                    margin: 0,
                                                    fontSize: '0.9rem',
                                                    color: 'var(--text-body)',
                                                    fontFamily: 'var(--font-sans)',
                                                    lineHeight: 1.5
                                                }}>
                                                    Masukkan data Anda untuk menerima hasil via WhatsApp
                                                </p>
                                            </div>
                                            
                                            {/* Input Fields */}
                                            <div style={{ marginBottom: '24px' }}>
                                                {/* Name Input */}
                                                <div style={{ marginBottom: '20px' }}>
                                                    <label style={{
                                                        display: 'block',
                                                        fontSize: '0.95rem',
                                                        fontWeight: 600,
                                                        color: 'var(--text-headline)',
                                                        marginBottom: '10px',
                                                        fontFamily: 'var(--font-sans)'
                                                    }}>
                                                        Nama Lengkap
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={userName}
                                                        onChange={(e) => setUserName(e.target.value)}
                                                        placeholder="Masukkan nama Anda"
                                                        style={{
                                                            width: '100%',
                                                            padding: '16px 20px',
                                                            fontSize: '1rem',
                                                            border: '2px solid rgba(157, 90, 118, 0.15)',
                                                            borderRadius: '16px',
                                                            fontFamily: 'var(--font-sans)',
                                                            outline: 'none',
                                                            transition: 'all 0.3s ease',
                                                            boxSizing: 'border-box',
                                                            background: 'rgba(255, 255, 255, 0.6)',
                                                            backdropFilter: 'blur(10px)'
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = 'var(--primary-color)';
                                                            e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                                                            e.target.style.boxShadow = '0 4px 12px rgba(157, 90, 118, 0.15)';
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = 'rgba(157, 90, 118, 0.15)';
                                                            e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                                                            e.target.style.boxShadow = 'none';
                                                        }}
                                                    />
                                                </div>
                                                
                                                {/* WhatsApp Input */}
                                                <div>
                                                    <label style={{
                                                        display: 'block',
                                                        fontSize: '0.95rem',
                                                        fontWeight: 600,
                                                        color: 'var(--text-headline)',
                                                        marginBottom: '10px',
                                                        fontFamily: 'var(--font-sans)'
                                                    }}>
                                                        Nomor WhatsApp
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={userWhatsApp}
                                                        onChange={(e) => setUserWhatsApp(e.target.value)}
                                                        placeholder="08xx xxxx xxxx"
                                                        style={{
                                                            width: '100%',
                                                            padding: '16px 20px',
                                                            fontSize: '1rem',
                                                            border: '2px solid rgba(157, 90, 118, 0.15)',
                                                            borderRadius: '16px',
                                                            fontFamily: 'var(--font-sans)',
                                                            outline: 'none',
                                                            transition: 'all 0.3s ease',
                                                            boxSizing: 'border-box',
                                                            background: 'rgba(255, 255, 255, 0.6)',
                                                            backdropFilter: 'blur(10px)'
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = 'var(--primary-color)';
                                                            e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                                                            e.target.style.boxShadow = '0 4px 12px rgba(157, 90, 118, 0.15)';
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = 'rgba(157, 90, 118, 0.15)';
                                                            e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                                                            e.target.style.boxShadow = 'none';
                                                        }}
                                                    />
                                                    <p style={{
                                                        margin: '8px 0 0',
                                                        fontSize: '0.8rem',
                                                        color: 'var(--text-body)',
                                                        fontFamily: 'var(--font-sans)',
                                                        fontStyle: 'italic'
                                                    }}>
                                                        Format: 08xxxxxxxxxx atau +62xxxxxxxxxx
                                                    </p>
                                                </div>
                                                
                                                {/* Email Input */}
                                                <div>
                                                    <label style={{
                                                        display: 'block',
                                                        fontSize: '0.95rem',
                                                        fontWeight: 600,
                                                        color: 'var(--text-headline)',
                                                        marginBottom: '10px',
                                                        fontFamily: 'var(--font-sans)'
                                                    }}>
                                                        Email (Opsional)
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={userEmail}
                                                        onChange={(e) => setUserEmail(e.target.value)}
                                                        placeholder="email@example.com"
                                                        style={{
                                                            width: '100%',
                                                            padding: '16px 20px',
                                                            fontSize: '1rem',
                                                            border: '2px solid rgba(157, 90, 118, 0.15)',
                                                            borderRadius: '16px',
                                                            fontFamily: 'var(--font-sans)',
                                                            outline: 'none',
                                                            transition: 'all 0.3s ease',
                                                            boxSizing: 'border-box',
                                                            background: 'rgba(255, 255, 255, 0.6)',
                                                            backdropFilter: 'blur(10px)'
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = 'var(--primary-color)';
                                                            e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                                                            e.target.style.boxShadow = '0 4px 12px rgba(157, 90, 118, 0.15)';
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = 'rgba(157, 90, 118, 0.15)';
                                                            e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                                                            e.target.style.boxShadow = 'none';
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Send Button - Glassmorphism */}
                                            <button
                                                onClick={async () => {
                                                    // Validate inputs
                                                    if (!userName.trim()) {
                                                        alert('Mohon masukkan nama Anda');
                                                        return;
                                                    }
                                                    if (!userWhatsApp.trim()) {
                                                        alert('Mohon masukkan nomor WhatsApp Anda');
                                                        return;
                                                    }
                                                    
                                                    // Normalize WhatsApp number
                                                    let normalizedWA = userWhatsApp.replace(/[^\d+]/g, '');
                                                    if (normalizedWA.startsWith('0')) {
                                                        normalizedWA = '+62' + normalizedWA.substring(1);
                                                    } else if (!normalizedWA.startsWith('+')) {
                                                        normalizedWA = '+' + normalizedWA;
                                                    }
                                                    
                                                    setSending(true);
                                                    
                                                    try {
                                                        // Ensure analysis is saved to database first
                                                        console.log('💾 Ensuring analysis is saved to database...');
                                                        console.log('💾 Current sessionId:', sessionId);
                                                        console.log('💾 Current resultData:', {
                                                            overall_score: resultData?.overall_score,
                                                            skin_type: resultData?.skin_type,
                                                            has_ai_insights: !!resultData?.ai_insights,
                                                            has_ai_report: !!resultData?.ai_report
                                                        });
                                                        
                                                        // Pass image to auto-save WITH customer info (no visualization)
                                                        const savedAnalysis = await autoSaveAnalysis(
                                                            resultData, 
                                                            sessionId,
                                                            state?.imageBase64 || localStorage.getItem('cantik_last_scan_image'),
                                                            null, // No visualization image
                                                            userName, // Customer name
                                                            normalizedWA, // Customer WhatsApp
                                                            userEmail || null // Customer email
                                                        );
                                                        console.log('✅ Analysis saved to database:', savedAnalysis?.id);
                                                        
                                                        // Generate result URL - FIXED PATH
                                                        const resultUrl = `${window.location.origin}/analysis/${sessionId}`;
                                                        console.log('🔗 Generated result URL:', resultUrl);
                                                        
                                                        // Prepare SUPER DETAILED WhatsApp message
                                                        const acneScore = resultData?.acne?.acne_score || 0;
                                                        const wrinkleScore = resultData?.wrinkles ? (100 - (resultData.wrinkles.wrinkle_severity || 0)) : 0;
                                                        const pigmentationScore = resultData?.pigmentation?.uniformity_score || 0;
                                                        const hydrationScore = resultData?.hydration?.hydration_level || 0;
                                                        const poreScore = resultData?.pores?.pore_score || 0;
                                                        
                                                        const priorityConcerns = resultData?.priority_concerns || [];
                                                        const concernsList = priorityConcerns.length > 0 
                                                            ? priorityConcerns.map((c, i) => `${i + 1}. ${c.concern} (${c.severity})`).join('\n')
                                                            : 'Tidak ada concern prioritas';
                                                        
                                                        const message = `🌸 *HASIL ANALISIS KULIT LENGKAP* 🌸

Halo ${userName}! 👋

Terima kasih telah melakukan analisis kulit di Cantik.ai. Berikut adalah hasil lengkap analisis Anda:

━━━━━━━━━━━━━━━━━━━━
📊 *RINGKASAN KESEHATAN KULIT*
━━━━━━━━━━━━━━━━━━━━

✨ Skor Kesehatan: *${resultData?.overall_score || 0}/100*
🔬 Jenis Kulit: *${resultData?.skin_type || 'Unknown'}*
🎯 Fitzpatrick Type: *${resultData?.fitzpatrick_type || 'III'}*
👤 Usia Prediksi: *${resultData?.predicted_age || 25} tahun*

━━━━━━━━━━━━━━━━━━━━
🔍 *ANALISIS DETAIL 8 PARAMETER*
━━━━━━━━━━━━━━━━━━━━

1️⃣ Jerawat (Acne): ${acneScore}/100
   ${resultData?.acne?.severity || 'Normal'} • ${resultData?.acne?.acne_count || 0} jerawat terdeteksi

2️⃣ Kerutan (Wrinkles): ${wrinkleScore}/100
   ${resultData?.wrinkles?.severity || 'Minimal'} • ${resultData?.wrinkles?.wrinkle_count || 0} garis halus

3️⃣ Pigmentasi: ${pigmentationScore}/100
   ${resultData?.pigmentation?.severity || 'Ringan'} • ${resultData?.pigmentation?.dark_spot_count || 0} bintik gelap

4️⃣ Hidrasi: ${hydrationScore}/100
   Status: ${resultData?.hydration?.status || 'Normal'}

5️⃣ Pori-pori: ${poreScore}/100
   ${resultData?.pores?.visibility || 'Sedang'} • ${resultData?.pores?.enlarged_count || 0} pori membesar

6️⃣ Berminyak: ${100 - (resultData?.oiliness?.oiliness_score || 0)}/100
   Level Sebum: ${resultData?.oiliness?.sebum_level || 'Sedang'}

7️⃣ Tekstur: ${resultData?.texture?.texture_score || 0}/100
   Kelembutan: ${resultData?.texture?.smoothness || 'Halus'}

8️⃣ Area Mata: ${resultData?.eye_area?.firmness || 0}/100
   Lingkaran Mata: ${resultData?.eye_area?.dark_circles || 0}%

━━━━━━━━━━━━━━━━━━━━
⚠️ *PRIORITAS PERHATIAN*
━━━━━━━━━━━━━━━━━━━━

${concernsList}

━━━━━━━━━━━━━━━━━━━━
💡 *REKOMENDASI AI DERMATOLOGIST*
━━━━━━━━━━━━━━━━━━━━

${aiInsights?.summary || 'Jaga rutinitas skincare konsisten untuk hasil optimal.'}

━━━━━━━━━━━━━━━━━━━━
🔗 *LIHAT HASIL SUPER LENGKAP*
━━━━━━━━━━━━━━━━━━━━

Klik link di bawah untuk melihat:
✅ Visualisasi 15 Mode Analisis
✅ Rekomendasi Produk Personal
✅ Rutinitas Perawatan Lengkap
✅ Tips & Saran dari AI Expert
✅ Foto Before & Analysis

👉 ${resultUrl}

━━━━━━━━━━━━━━━━━━━━

Simpan link ini untuk referensi Anda! 💖

🎓 *Gabung dengan komunitas FREE dengan pakar kosmetik!*
Dapatkan tips skincare, konsultasi gratis, dan update produk terbaru.
👉 [Link komunitas akan segera hadir]

_Powered by Cantik.ai - AI Skin Analysis_`;
                                                        
                                                        console.log('📱 Sending to WhatsApp API...');
                                                        console.log('📞 ChatId:', `${normalizedWA.replace('+', '')}@c.us`);
                                                        
                                                        // Send to WhatsApp API
                                                        const whatsappResponse = await fetch('https://wa.raycorpgroup.com/api/sendText', {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'X-Api-Key': '33a73dbf8cf04b26ae50eb9d2d778e25'
                                                            },
                                                            body: JSON.stringify({
                                                                chatId: `${normalizedWA.replace('+', '')}@c.us`,
                                                                text: message,
                                                                session: 'default'
                                                            })
                                                        });
                                                        
                                                        const responseData = await whatsappResponse.json();
                                                        console.log('📱 WhatsApp API Response:', responseData);
                                                        
                                                        if (!whatsappResponse.ok) {
                                                            console.error('❌ WhatsApp API Error:', responseData);
                                                            throw new Error(responseData.message || 'Failed to send WhatsApp message');
                                                        }
                                                        
                                                        console.log('✅ WhatsApp message sent successfully');
                                                        
                                                        // Show preview modal
                                                        setShowPreview(true);
                                                        
                                                    } catch (error) {
                                                        console.error('❌ Error sending to WhatsApp:', error);
                                                        alert(`Gagal mengirim ke WhatsApp: ${error.message || 'Silakan coba lagi.'}`);
                                                    } finally {
                                                        setSending(false);
                                                    }
                                                }}
                                                disabled={sending}
                                                style={{
                                                    width: '100%',
                                                    height: '64px',
                                                    border: '1px solid rgba(157, 90, 118, 0.2)',
                                                    borderRadius: '20px',
                                                    background: sending 
                                                        ? 'rgba(157, 90, 118, 0.3)' 
                                                        : 'linear-gradient(135deg, rgba(157, 90, 118, 0.9), rgba(168, 105, 138, 0.9))',
                                                    backdropFilter: 'blur(20px)',
                                                    WebkitBackdropFilter: 'blur(20px)',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '12px',
                                                    cursor: sending ? 'not-allowed' : 'pointer',
                                                    boxShadow: sending
                                                        ? 'none'
                                                        : '0 8px 24px rgba(157, 90, 118, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                                                    fontSize: '1.1rem',
                                                    fontWeight: 600,
                                                    letterSpacing: '0.005em',
                                                    fontFamily: 'var(--font-sans)',
                                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                    transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                                                    opacity: sending ? 0.6 : 1,
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!sending) {
                                                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                                                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(157, 90, 118, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!sending) {
                                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(157, 90, 118, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                                                    }
                                                }}
                                            >
                                                {/* Shimmer effect */}
                                                {!sending && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: '-100%',
                                                        width: '100%',
                                                        height: '100%',
                                                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                                                        animation: 'shimmer 3s infinite',
                                                        pointerEvents: 'none'
                                                    }} />
                                                )}
                                                
                                                <span style={{ position: 'relative', zIndex: 1 }}>
                                                    {sending ? '⏳ Mengirim...' : '📱 Kirim Hasil Lengkap'}
                                                </span>
                                                {!sending && (
                                                    <MoveUpRight 
                                                        size={22} 
                                                        color="white" 
                                                        style={{ 
                                                            position: 'relative', 
                                                            zIndex: 1,
                                                            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                                                        }} 
                                                    />
                                                )}
                                            </button>
                                            
                                            <p style={{
                                                margin: '16px 0 0',
                                                fontSize: '0.85rem',
                                                color: 'var(--text-body)',
                                                textAlign: 'center',
                                                fontFamily: 'var(--font-sans)',
                                                lineHeight: 1.6,
                                                fontStyle: 'italic'
                                            }}>
                                                Hasil analisis lengkap akan dikirim ke WhatsApp Anda dengan link akses pribadi
                                            </p>
                                        </div>
                                        
                                        {/* Back to Onboarding Button - Different Color */}
                                        <button
                                            onClick={() => navigate('/')}
                                            style={{
                                                width: '100%',
                                                height: '56px',
                                                border: '2px solid rgba(157, 90, 118, 0.3)',
                                                borderRadius: '18px',
                                                background: 'transparent',
                                                color: 'var(--primary-color)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '10px',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                fontFamily: 'var(--font-sans)',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'var(--primary-color)';
                                                e.currentTarget.style.color = 'white';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(157, 90, 118, 0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = 'var(--primary-color)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            🏠 Kembali ke Onboarding
                                        </button>
                                    </div>
                                )}
                            </>

                    </div>
                )}

            </div>
            
            {/* Preview Modal */}
            {showPreview && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        maxWidth: '500px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        animation: 'slideUp 0.3s ease'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '24px',
                            borderBottom: '1px solid rgba(157, 90, 118, 0.1)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: '1.5rem',
                                fontWeight: 600,
                                color: 'var(--text-headline)',
                                fontFamily: 'var(--font-display)'
                            }}>
                                ✅ Hasil Terkirim!
                            </h2>
                            <button
                                onClick={() => setShowPreview(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: 'var(--text-body)',
                                    padding: '4px',
                                    lineHeight: 1
                                }}
                            >
                                ×
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div style={{ padding: '24px' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #f3e6ee, #faf6f8)',
                                borderRadius: '16px',
                                padding: '20px',
                                marginBottom: '20px',
                                border: '1px solid rgba(157, 90, 118, 0.1)'
                            }}>
                                <p style={{
                                    margin: '0 0 12px 0',
                                    fontSize: '1rem',
                                    color: 'var(--text-headline)',
                                    fontWeight: 600,
                                    fontFamily: 'var(--font-sans)'
                                }}>
                                    📱 Pesan WhatsApp telah dikirim ke:
                                </p>
                                <p style={{
                                    margin: '0 0 8px 0',
                                    fontSize: '0.95rem',
                                    color: 'var(--text-body)',
                                    fontFamily: 'var(--font-sans)'
                                }}>
                                    <strong>Nama:</strong> {userName}
                                </p>
                                <p style={{
                                    margin: 0,
                                    fontSize: '0.95rem',
                                    color: 'var(--text-body)',
                                    fontFamily: 'var(--font-sans)'
                                }}>
                                    <strong>WhatsApp:</strong> {userWhatsApp}
                                </p>
                            </div>
                            
                            <div style={{
                                background: 'rgba(157, 90, 118, 0.05)',
                                borderRadius: '12px',
                                padding: '16px',
                                marginBottom: '20px'
                            }}>
                                <p style={{
                                    margin: '0 0 8px 0',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: 'var(--text-headline)',
                                    fontFamily: 'var(--font-sans)'
                                }}>
                                    🔗 Link Hasil Anda:
                                </p>
                                <p style={{
                                    margin: 0,
                                    fontSize: '0.85rem',
                                    color: 'var(--primary-color)',
                                    fontFamily: 'monospace',
                                    wordBreak: 'break-all',
                                    background: 'white',
                                    padding: '8px',
                                    borderRadius: '8px'
                                }}>
                                    {window.location.origin}/skinanalyzer/result/{sessionId}
                                </p>
                            </div>
                            
                            <p style={{
                                margin: '0 0 20px 0',
                                fontSize: '0.9rem',
                                color: 'var(--text-body)',
                                textAlign: 'center',
                                lineHeight: 1.6,
                                fontFamily: 'var(--font-sans)'
                            }}>
                                Link hasil analisis sudah dikirim ke WhatsApp Anda. Buka WhatsApp untuk melihat pesan dan mengakses hasil lengkap.
                            </p>
                            
                            {/* Back to Onboarding Button */}
                            <button
                                onClick={() => {
                                    setShowPreview(false);
                                    navigate('/');
                                }}
                                style={{
                                    background: 'var(--primary-color)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '16px',
                                    padding: '16px 24px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    width: '100%',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-sans)',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 8px 20px rgba(89, 54, 69, 0.2)'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(89, 54, 69, 0.3)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(89, 54, 69, 0.2)';
                                }}
                            >
                                🏠 Kembali ke Onboarding
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Analysis Mode Detail Modal */}
            {selectedMode && (
                <AnalysisModeModal
                    mode={selectedMode}
                    onClose={() => setSelectedMode(null)}
                />
            )}
            
            {/* Animation Styles */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes pulse {
                    0%, 100% { 
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(230, 0, 126, 0.4);
                    }
                    50% { 
                        transform: scale(1.05);
                        box-shadow: 0 0 0 10px rgba(230, 0, 126, 0);
                    }
                }
            `}</style>
        </div>
    );

};

export default AnalysisResult;
