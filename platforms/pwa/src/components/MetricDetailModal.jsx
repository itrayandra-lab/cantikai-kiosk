import { X, AlertCircle, CheckCircle, Info, Lightbulb, Shield } from 'lucide-react';

const MetricDetailModal = ({ metric, data, onClose }) => {
    if (!metric || !data) return null;

    const getSeverityColor = (severity) => {
        const severityLower = severity?.toLowerCase() || '';
        if (severityLower.includes('clear') || severityLower.includes('minimal') || severityLower.includes('good') || severityLower.includes('protected') || severityLower.includes('youthful')) return '#4ade80';
        if (severityLower.includes('mild') || severityLower.includes('low') || severityLower.includes('slight')) return '#fbbf24';
        if (severityLower.includes('moderate')) return '#fb923c';
        if (severityLower.includes('severe') || severityLower.includes('high')) return '#ef4444';
        return '#9d8fa6';
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
                    maxWidth: '600px',
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
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, rgba(230, 0, 126, 0.1) 0%, rgba(157, 143, 166, 0.1) 100%)'
                }}>
                    <div>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: 'var(--text-headline)',
                            marginBottom: '4px'
                        }}>
                            {data.title}
                        </h2>
                        <p style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-body)',
                            lineHeight: 1.4
                        }}>
                            {data.description}
                        </p>
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

                {/* Content */}
                <div style={{
                    padding: '24px',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    {/* Current Status */}
                    {metric.status && (
                        <div style={{
                            background: 'rgba(255,255,255,0.6)',
                            borderRadius: '16px',
                            padding: '20px',
                            marginBottom: '24px',
                            border: `2px solid ${getSeverityColor(metric.status)}`
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <CheckCircle size={24} color={getSeverityColor(metric.status)} />
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    color: 'var(--text-headline)'
                                }}>
                                    Status Anda: {metric.status}
                                </h3>
                            </div>
                            <p style={{
                                fontSize: '0.95rem',
                                color: 'var(--text-body)',
                                lineHeight: 1.6
                            }}>
                                {data.whatItMeans?.[metric.status] || data.whatItMeans?.[Object.keys(data.whatItMeans)[0]]}
                            </p>
                        </div>
                    )}

                    {/* What It Means Section */}
                    {data.whatItMeans && typeof data.whatItMeans === 'object' && !metric.status && (
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <Info size={20} color="var(--primary-color)" />
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    color: 'var(--text-headline)'
                                }}>
                                    Apa Artinya
                                </h3>
                            </div>
                            {Object.entries(data.whatItMeans).map(([level, description]) => (
                                <div key={level} style={{
                                    background: 'rgba(255,255,255,0.5)',
                                    borderRadius: '12px',
                                    padding: '12px 16px',
                                    marginBottom: '8px',
                                    borderLeft: `4px solid ${getSeverityColor(level)}`
                                }}>
                                    <p style={{
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        color: getSeverityColor(level),
                                        marginBottom: '4px'
                                    }}>
                                        {level}
                                    </p>
                                    <p style={{
                                        fontSize: '0.9rem',
                                        color: 'var(--text-body)',
                                        lineHeight: 1.5
                                    }}>
                                        {description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Factors */}
                    {data.factors && data.factors.length > 0 && (
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <AlertCircle size={20} color="var(--primary-color)" />
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    color: 'var(--text-headline)'
                                }}>
                                    Faktor Penyebab
                                </h3>
                            </div>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0
                            }}>
                                {data.factors.map((factor, index) => (
                                    <li key={index} style={{
                                        fontSize: '0.9rem',
                                        color: 'var(--text-body)',
                                        lineHeight: 1.6,
                                        marginBottom: '8px',
                                        paddingLeft: '24px',
                                        position: 'relative'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: 'var(--primary-color)',
                                            fontWeight: 600
                                        }}>•</span>
                                        {factor}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Recommendations */}
                    {data.recommendations && (
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <Lightbulb size={20} color="var(--primary-color)" />
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    color: 'var(--text-headline)'
                                }}>
                                    Rekomendasi
                                </h3>
                            </div>
                            {Array.isArray(data.recommendations) ? (
                                <ul style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0
                                }}>
                                    {data.recommendations.map((rec, index) => (
                                        <li key={index} style={{
                                            fontSize: '0.9rem',
                                            color: 'var(--text-body)',
                                            lineHeight: 1.6,
                                            marginBottom: '8px',
                                            paddingLeft: '24px',
                                            position: 'relative'
                                        }}>
                                            <span style={{
                                                position: 'absolute',
                                                left: 0,
                                                color: '#4ade80',
                                                fontWeight: 600
                                            }}>✓</span>
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div>
                                    {Object.entries(data.recommendations).map(([type, recs]) => (
                                        <div key={type} style={{ marginBottom: '16px' }}>
                                            <p style={{
                                                fontSize: '0.95rem',
                                                fontWeight: 600,
                                                color: 'var(--text-headline)',
                                                marginBottom: '8px'
                                            }}>
                                                {type}:
                                            </p>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                {recs.map((rec, index) => (
                                                    <li key={index} style={{
                                                        fontSize: '0.9rem',
                                                        color: 'var(--text-body)',
                                                        lineHeight: 1.6,
                                                        marginBottom: '6px',
                                                        paddingLeft: '24px',
                                                        position: 'relative'
                                                    }}>
                                                        <span style={{
                                                            position: 'absolute',
                                                            left: 0,
                                                            color: '#4ade80',
                                                            fontWeight: 600
                                                        }}>✓</span>
                                                        {rec}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Prevention */}
                    {data.prevention && data.prevention.length > 0 && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <Shield size={20} color="var(--primary-color)" />
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    color: 'var(--text-headline)'
                                }}>
                                    Tips Pencegahan
                                </h3>
                            </div>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0
                            }}>
                                {data.prevention.map((tip, index) => (
                                    <li key={index} style={{
                                        fontSize: '0.9rem',
                                        color: 'var(--text-body)',
                                        lineHeight: 1.6,
                                        marginBottom: '8px',
                                        paddingLeft: '24px',
                                        position: 'relative'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#64c8ff',
                                            fontWeight: 600
                                        }}>→</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '20px 24px',
                    borderTop: '1px solid rgba(157, 143, 166, 0.2)',
                    background: 'rgba(255,255,255,0.5)'
                }}>
                    <p style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-body)',
                        textAlign: 'center',
                        margin: 0,
                        lineHeight: 1.5
                    }}>
                        💡 Analisis ini berdasarkan computer vision dan AI. Untuk masalah persisten, konsultasikan ke dokter kulit.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MetricDetailModal;
