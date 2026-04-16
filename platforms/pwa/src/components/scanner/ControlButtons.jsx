import { RefreshCcw } from 'lucide-react';

/**
 * Scanner Control Buttons Component
 * Only Capture button (Upload and Flip hidden for kiosk mode)
 */
const ControlButtons = ({ 
    onCapture, 
    isCapturing,
    isOptimal,
    faceDetected,
    hasCameraError
}) => {
    return (
        <div style={{ 
            position: 'absolute', 
            bottom: '48px', 
            left: 0, 
            right: 0, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            zIndex: 10,
            padding: '0 40px'
        }}>
            {/* Giant Center Capture Button - ONLY THIS */}
            <button
                onClick={onCapture}
                disabled={hasCameraError || isCapturing || !faceDetected}
                style={{
                    width: 88, 
                    height: 88, 
                    borderRadius: '50%', 
                    background: isCapturing 
                        ? '#d1d5db' 
                        : (isOptimal 
                            ? 'linear-gradient(135deg, #ffffff, #ffbed7)' 
                            : 'var(--primary-color)'),
                    border: '5px solid rgba(255,255,255,0.5)', 
                    boxShadow: isOptimal 
                        ? '0 8px 32px rgba(255, 255, 255, 0.6)' 
                        : '0 8px 32px rgba(230, 0, 126, 0.4)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: (hasCameraError || isCapturing || !faceDetected) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    transform: isCapturing ? 'scale(0.92)' : 'scale(1)',
                    position: 'relative',
                    opacity: (hasCameraError || !faceDetected) ? 0.5 : 1
                }}
            >
                {isCapturing ? (
                    <RefreshCcw size={36} color="#fff" className="animate-spin" />
                ) : (
                    <div style={{ 
                        width: '65%', 
                        height: '65%', 
                        borderRadius: '50%', 
                        background: 'white',
                        boxShadow: 'inset 0 2px 8px rgba(230, 0, 126, 0.2)'
                    }} />
                )}
            </button>
        </div>
    );
};

export default ControlButtons;
