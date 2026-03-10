import { X, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

const ErrorToast = ({ message, onClose, duration = 5000 }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            width: '90%',
            maxWidth: '500px',
            animation: 'slideDown 0.3s ease'
        }}>
            <div style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.98), rgba(220, 38, 38, 0.98))',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '16px 20px',
                boxShadow: '0 10px 40px rgba(239, 68, 68, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <AlertCircle size={24} color="white" strokeWidth={2} />
                <div style={{ flex: 1 }}>
                    <p style={{ 
                        fontSize: '0.95rem', 
                        fontWeight: 600, 
                        color: 'white', 
                        margin: 0,
                        lineHeight: 1.4
                    }}>
                        {message}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                    onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                >
                    <X size={18} color="white" />
                </button>
            </div>
            
            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default ErrorToast;
