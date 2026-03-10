import { X, TrendingUp, Info, Lightbulb } from 'lucide-react';

const AnalysisModeModal = ({ mode, onClose }) => {
    if (!mode) return null;

    const getScoreColor = (score) => {
        if (score >= 80) return '#4ade80'; // Green
        if (score >= 60) return '#fbbf24'; // Yellow
        if (score >= 40) return '#fb923c'; // Orange
        return '#ef4444'; // Red
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Needs Attention';
    };

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                animation: 'fadeIn 0.2s ease'
            }}
            onClick={onClose}
        >
            <div 
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,246,248,0.95) 100%)',
                    borderRadius: '24px',
                    maxWidth: '500px',
                    width: '100%',
                    maxHeight: '85vh',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid rgba(157, 143, 166, 0.2)',
                    background: 'linear-gradient(135deg, rgba(230, 0, 126, 0.1) 0%, rgba(157, 143, 166, 0.1) 100%)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <h2 style={{
                                fontSize: '1.4rem',
                                fontWeight: 700,
                                color: 'var(--text-headline)',
                                marginBottom: '8px',
                                fontFamily: 'var(--font-sans)'
                            }}>
                                {mode.mode}
                            </h2>
                            <p style={{
                                fontSize: '0.85rem',
                                color: 'var(--text-body)',
                                marginBottom: '12px',
                                fontFamily: 'var(--font-sans)'
                            }}>
                                Parameter: {mode.parameter}
                            </p>
                            
                            {/* Score Badge */}
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(255,255,255,0.8)',
                                padding: '8px 16px',
                                borderRadius: '12px',
                                border: `2px solid ${getScoreColor(mode.score)}`
                            }}>
                                <TrendingUp size={18} color={getScoreColor(mode.score)} />
                                <span style={{
                                    fontSize: '1.2rem',
                                    fontWeight: 700,
                                    color: getScoreColor(mode.score),
                                    fontFamily: 'var(--font-sans)'
                                }}>
                                    {mode.score}
                                </span>
                                <span style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--text-body)',
                                    fontFamily: 'var(--font-sans)'
                                }}>
                                    / 100
                                </span>
                            </div>
                        </div>
                        
                        <button
                            onClick={onClose}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.8)',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                flexShrink: 0,
                                marginLeft: '16px'
                            }}
                        >
                            <X size={20} color="var(--text-headline)" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{
                    padding: '24px',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    {/* Status */}
                    <div style={{
                        background: `linear-gradient(135deg, ${getScoreColor(mode.score)}15, ${getScoreColor(mode.score)}05)`,
                        borderRadius: '16px',
                        padding: '16px',
                        marginBottom: '20px',
                        border: `2px solid ${getScoreColor(mode.score)}40`
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: getScoreColor(mode.score)
                            }} />
                            <h3 style={{
                                fontSize: '1rem',
                                fontWeight: 600,
                                color: 'var(--text-headline)',
                                fontFamily: 'var(--font-sans)'
                            }}>
                                Status: {mode.status}
                            </h3>
                        </div>
                        <p style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-body)',
                            lineHeight: 1.6,
                            fontFamily: 'var(--font-sans)'
                        }}>
                            Kondisi Anda termasuk kategori <strong>{getScoreLabel(mode.score)}</strong> dengan skor {mode.score}/100.
                        </p>
                    </div>

                    {/* Description */}
                    {mode.description && (
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                <Info size={18} color="var(--primary-color)" />
                                <h3 style={{
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: 'var(--text-headline)',
                                    fontFamily: 'var(--font-sans)'
                                }}>
                                    Detail Analisis
                                </h3>
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.6)',
                                borderRadius: '12px',
                                padding: '14px',
                                borderLeft: '3px solid var(--primary-color)'
                            }}>
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: 'var(--text-body)',
                                    lineHeight: 1.6,
                                    margin: 0,
                                    fontFamily: 'var(--font-sans)'
                                }}>
                                    {mode.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Insight */}
                    {mode.insight && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                <Lightbulb size={18} color="var(--primary-color)" />
                                <h3 style={{
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: 'var(--text-headline)',
                                    fontFamily: 'var(--font-sans)'
                                }}>
                                    AI Insight
                                </h3>
                            </div>
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(230, 0, 126, 0.08), rgba(157, 143, 166, 0.08))',
                                borderRadius: '12px',
                                padding: '14px',
                                borderLeft: '3px solid var(--primary-color)'
                            }}>
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: 'var(--text-body)',
                                    lineHeight: 1.6,
                                    margin: 0,
                                    fontFamily: 'var(--font-sans)'
                                }}>
                                    {mode.insight}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '16px 24px',
                    borderTop: '1px solid rgba(157, 143, 166, 0.2)',
                    background: 'rgba(255,255,255,0.5)'
                }}>
                    <p style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-body)',
                        textAlign: 'center',
                        margin: 0,
                        lineHeight: 1.5,
                        fontFamily: 'var(--font-sans)'
                    }}>
                        💡 Analisis ini menggunakan AI Dermatology untuk memberikan insight yang akurat
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default AnalysisModeModal;
