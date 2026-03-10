import React from 'react';
import { Lock } from 'lucide-react';

/**
 * Locked Content Component
 * Shows blurred content with lock overlay for guest users
 */
const LockedContent = ({ children, onUnlock, title = "Konten Terkunci" }) => {
    return (
        <div style={{ position: 'relative', marginBottom: '16px' }}>
            {/* Blurred content */}
            <div style={{
                filter: 'blur(8px)',
                pointerEvents: 'none',
                userSelect: 'none'
            }}>
                {children}
            </div>
            
            {/* Lock overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, rgba(250, 246, 248, 0.7) 0%, rgba(250, 246, 248, 0.95) 100%)',
                backdropFilter: 'blur(2px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '20px',
                padding: '24px',
                textAlign: 'center'
            }}>
                {/* Lock icon */}
                <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    boxShadow: '0 8px 24px rgba(157, 90, 118, 0.3)'
                }}>
                    <Lock size={28} color="white" />
                </div>
                
                {/* Title */}
                <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: 'var(--text-headline)',
                    fontFamily: 'var(--font-serif)',
                    marginBottom: '8px'
                }}>
                    {title}
                </h4>
                
                {/* Message */}
                <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-body)',
                    marginBottom: '16px',
                    lineHeight: 1.5
                }}>
                    Login untuk melihat analisis lengkap dan rekomendasi personal
                </p>
                
                {/* Unlock button */}
                <button
                    onClick={onUnlock}
                    style={{
                        padding: '12px 32px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, var(--primary-color), #b87a8f)',
                        color: 'white',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        boxShadow: '0 4px 12px rgba(157, 90, 118, 0.3)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Login Sekarang
                </button>
            </div>
        </div>
    );
};

export default LockedContent;
