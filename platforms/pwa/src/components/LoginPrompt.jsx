import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, X } from 'lucide-react';

const LoginPrompt = ({ message, onClose, feature }) => {
    const navigate = useNavigate();

    const handleLogin = () => {
        // Store intended destination
        sessionStorage.setItem('redirect_after_login', window.location.pathname);
        navigate('/login');
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                position: 'relative'
            }}>
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        color: 'var(--text-body)'
                    }}
                >
                    <X size={20} />
                </button>

                {/* Icon */}
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                }}>
                    <LogIn size={32} color="white" />
                </div>

                {/* Title */}
                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: 'var(--text-headline)',
                    fontFamily: 'var(--font-serif)',
                    textAlign: 'center',
                    marginBottom: '12px'
                }}>
                    Login Diperlukan
                </h3>

                {/* Message */}
                <p style={{
                    fontSize: '0.95rem',
                    color: 'var(--text-body)',
                    textAlign: 'center',
                    lineHeight: 1.6,
                    marginBottom: '24px'
                }}>
                    {message || `Untuk mengakses ${feature || 'fitur ini'}, silakan login terlebih dahulu.`}
                </p>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '12px',
                            border: '2px solid var(--primary-color)',
                            background: 'white',
                            color: 'var(--primary-color)',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-sans)'
                        }}
                    >
                        Nanti Saja
                    </button>
                    <button
                        onClick={handleLogin}
                        style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'linear-gradient(135deg, var(--primary-color), #b87a8f)',
                            color: 'white',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-sans)',
                            boxShadow: '0 4px 12px rgba(157, 90, 118, 0.3)'
                        }}
                    >
                        Login Sekarang
                    </button>
                </div>

                {/* Register link */}
                <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-body)',
                    textAlign: 'center',
                    marginTop: '16px'
                }}>
                    Belum punya akun?{' '}
                    <span
                        onClick={() => navigate('/login?register=true')}
                        style={{
                            color: 'var(--primary-color)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Daftar di sini
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginPrompt;
