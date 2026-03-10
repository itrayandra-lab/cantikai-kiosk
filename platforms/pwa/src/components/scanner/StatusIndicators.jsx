import { Check, AlertCircle } from 'lucide-react';

/**
 * Minimalist Status Indicators Component with Dynamic Labels
 * Shows face detection, light, and distance status without blocking the face
 */
const StatusIndicators = ({ 
    faceDetected, 
    goodLight, 
    goodDistance, 
    hasGlasses, 
    hasFilter,
    countdown,
    distance,
    brightness 
}) => {
    // Get light status text - ULTRA LENIENT
    const getLightStatus = () => {
        if (!brightness) return 'Memeriksa';
        if (brightness < 5) return 'Gelap';
        if (brightness < 10) return 'Kurang Terang';
        if (brightness <= 255) return 'Terang';
        return 'Terlalu Terang';
    };

    // Get distance status text
    const getDistanceStatus = () => {
        if (!distance) return 'Memeriksa';
        return distance; // Already has: Terlalu Jauh, Terlalu Dekat, Sempurna
    };

    // Get dynamic warnings - REMOVED FROM COMPONENT, NOW IN MAIN PAGE
    const getWarnings = () => {
        const warnings = [];
        if (hasGlasses) warnings.push('Lepas kacamata');
        if (hasFilter) warnings.push('Nonaktifkan filter');
        return warnings;
    };

    const warnings = getWarnings();

    return (
        <div style={{ 
            position: 'absolute', 
            bottom: '180px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 10, 
            display: 'flex', 
            flexDirection: 'column',
            gap: '16px', 
            alignItems: 'center',
            maxWidth: '90%'
        }}>
            {/* Minimalist Circle Indicators with Dynamic Labels - NO WARNINGS */}
            <div style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start'
            }}>
                {/* Face Detection Indicator */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ 
                        width: 36, 
                        height: 36, 
                        borderRadius: '50%', 
                        background: faceDetected ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.25)',
                        border: `2px solid ${faceDetected ? '#fff' : 'rgba(255,255,255,0.4)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: faceDetected ? '0 0 20px rgba(255,255,255,0.7)' : '0 4px 12px rgba(0,0,0,0.2)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s'
                    }}>
                        {faceDetected && <Check size={18} color="#e6007e" strokeWidth={3} />}
                    </div>
                    <span style={{ 
                        color: 'white', 
                        fontSize: '0.65rem', 
                        fontWeight: 600, 
                        fontFamily: 'var(--font-sans)',
                        textAlign: 'center',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        whiteSpace: 'nowrap',
                        marginBottom: '2px'
                    }}>
                        Wajah
                    </span>
                    <span style={{ 
                        color: faceDetected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)', 
                        fontSize: '0.6rem', 
                        fontWeight: 500, 
                        fontFamily: 'var(--font-sans)',
                        textAlign: 'center',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        whiteSpace: 'nowrap'
                    }}>
                        {faceDetected ? 'Terdeteksi' : 'Tidak Terdeteksi'}
                    </span>
                </div>
                
                {/* Light Check Indicator */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ 
                        width: 36, 
                        height: 36, 
                        borderRadius: '50%', 
                        background: goodLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.25)',
                        border: `2px solid ${goodLight ? '#fff' : 'rgba(255,255,255,0.4)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: goodLight ? '0 0 20px rgba(255,255,255,0.7)' : '0 4px 12px rgba(0,0,0,0.2)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s'
                    }}>
                        {goodLight && <Check size={18} color="#e6007e" strokeWidth={3} />}
                    </div>
                    <span style={{ 
                        color: 'white', 
                        fontSize: '0.65rem', 
                        fontWeight: 600, 
                        fontFamily: 'var(--font-sans)',
                        textAlign: 'center',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        whiteSpace: 'nowrap',
                        marginBottom: '2px'
                    }}>
                        Cahaya
                    </span>
                    <span style={{ 
                        color: goodLight ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)', 
                        fontSize: '0.6rem', 
                        fontWeight: 500, 
                        fontFamily: 'var(--font-sans)',
                        textAlign: 'center',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        whiteSpace: 'nowrap'
                    }}>
                        {getLightStatus()}
                    </span>
                </div>
                
                {/* Distance Check Indicator */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ 
                        width: 36, 
                        height: 36, 
                        borderRadius: '50%', 
                        background: goodDistance ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.25)',
                        border: `2px solid ${goodDistance ? '#fff' : 'rgba(255,255,255,0.4)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: goodDistance ? '0 0 20px rgba(255,255,255,0.7)' : '0 4px 12px rgba(0,0,0,0.2)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s'
                    }}>
                        {goodDistance && <Check size={18} color="#e6007e" strokeWidth={3} />}
                    </div>
                    <span style={{ 
                        color: 'white', 
                        fontSize: '0.65rem', 
                        fontWeight: 600, 
                        fontFamily: 'var(--font-sans)',
                        textAlign: 'center',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        whiteSpace: 'nowrap',
                        marginBottom: '2px'
                    }}>
                        Jarak
                    </span>
                    <span style={{ 
                        color: goodDistance ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)', 
                        fontSize: '0.6rem', 
                        fontWeight: 500, 
                        fontFamily: 'var(--font-sans)',
                        textAlign: 'center',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        whiteSpace: 'nowrap'
                    }}>
                        {getDistanceStatus()}
                    </span>
                </div>
            </div>
            
            {/* Auto-capture countdown - Prominent */}
            {countdown !== null && countdown > 0 && (
                <div style={{ 
                    width: 64, 
                    height: 64, 
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '3px solid rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    animation: 'pulse 1s infinite'
                }}>
                    <span style={{ 
                        fontSize: '2rem', 
                        fontWeight: 700, 
                        color: '#e6007e', 
                        fontFamily: 'var(--font-display)' 
                    }}>
                        {countdown}
                    </span>
                </div>
            )}
        </div>
    );
};

export default StatusIndicators;
