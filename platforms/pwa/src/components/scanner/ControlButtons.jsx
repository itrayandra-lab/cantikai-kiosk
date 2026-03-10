import { RefreshCcw, Upload, RotateCcw } from 'lucide-react';

/**
 * Scanner Control Buttons Component
 * Upload, Capture, and Retake/Flip buttons with soft styling
 */
const ControlButtons = ({ 
    onUpload, 
    onCapture, 
    onFlip,
    onRetake,
    fileInputRef,
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
            gap: '24px', 
            zIndex: 10,
            padding: '0 40px'
        }}>
            {/* Upload Button (Left) */}
            <button 
                onClick={() => fileInputRef.current?.click()}
                style={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: '50%', 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    border: '2px solid rgba(255, 190, 215, 0.5)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'pointer', 
                    boxShadow: '0 4px 16px rgba(255, 190, 215, 0.3)',
                    transition: 'transform 0.2s'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <Upload size={22} color="var(--primary-color)" />
            </button>
            
            <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={onUpload}
                style={{ display: 'none' }}
            />

            {/* Giant Center Capture Button */}
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

            {/* Retake/Flip Button (Right) */}
            <button 
                onClick={isCapturing ? onRetake : onFlip}
                style={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: '50%', 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    border: '2px solid rgba(255, 190, 215, 0.5)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'pointer', 
                    boxShadow: '0 4px 16px rgba(255, 190, 215, 0.3)',
                    transition: 'transform 0.2s'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {isCapturing ? (
                    <RotateCcw size={22} color="var(--primary-color)" />
                ) : (
                    <RefreshCcw size={22} color="var(--primary-color)" />
                )}
            </button>
        </div>
    );
};

export default ControlButtons;
