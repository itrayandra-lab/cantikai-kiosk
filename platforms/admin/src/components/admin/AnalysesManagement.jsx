import React, { useEffect, useMemo, useState } from 'react';
import { Search, Eye, Trash2 } from 'lucide-react';
import apiService from '../../services/api';

const fieldStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid rgba(157, 90, 118, 0.25)',
    background: 'rgba(255,255,255,0.75)',
    fontFamily: 'var(--font-sans)',
    outline: 'none'
};

const cardStyle = {
    background: 'rgba(255,255,255,0.8)',
    borderRadius: '18px',
    border: '1px solid rgba(255,255,255,0.95)',
    boxShadow: '0 10px 30px rgba(89,54,69,0.08)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)'
};

const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(30, 20, 26, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
};

const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#ca8a04';
    if (score >= 40) return '#ea580c';
    return '#dc2626';
};

const AnalysesManagement = () => {
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedAnalysis, setSelectedAnalysis] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    const fetchAnalyses = async () => {
        try {
            const data = await apiService.getAllAnalyses();
            setAnalyses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Fetch analyses failed:', error);
            alert(error.message || 'Gagal memuat analyses');
            setAnalyses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalyses();
    }, []);

    const filteredAnalyses = useMemo(() => {
        const term = search.toLowerCase();
        return analyses.filter((analysis) => {
            const haystack = `${analysis.username || ''} ${analysis.user_email || ''} ${analysis.skin_type || ''} ${analysis.customer_name || ''} ${analysis.customer_whatsapp || ''} ${analysis.customer_email || ''}`.toLowerCase();
            return haystack.includes(term);
        });
    }, [analyses, search]);

    const viewDetail = async (id) => {
        try {
            const detail = await apiService.getAdminAnalysisById(id);
            setSelectedAnalysis(detail);
            setShowDetail(true);
        } catch (error) {
            console.error('Fetch analysis detail failed:', error);
            alert(error.message || 'Gagal memuat detail analysis');
        }
    };

    const deleteAnalysis = async (id) => {
        if (!window.confirm('Hapus analysis ini?')) return;
        try {
            await apiService.deleteAdminAnalysis(id);
            setAnalyses((prev) => prev.filter((item) => item.id !== id));
            if (selectedAnalysis?.id === id) {
                setShowDetail(false);
                setSelectedAnalysis(null);
            }
        } catch (error) {
            console.error('Delete analysis failed:', error);
            alert(error.message || 'Gagal menghapus analysis');
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-body)' }}>Loading analyses...</div>;
    }

    return (
        <div>
            <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-headline)', fontFamily: 'var(--font-serif)' }}>
                    Analyses Management
                </h2>
                <p style={{ color: 'var(--text-body)', fontSize: '0.9rem' }}>{filteredAnalyses.length} analyses</p>
            </div>

            <div style={{ marginBottom: '16px', position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-body)' }} />
                <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Cari berdasarkan user/email/skin type/customer name/whatsapp"
                    style={{ ...fieldStyle, paddingLeft: '38px' }}
                />
            </div>

            <div style={{ ...cardStyle, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>User</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Customer Info</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Score</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Skin Type</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Engine</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Date</th>
                            <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAnalyses.map((analysis) => (
                            <tr key={analysis.id}>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)' }}>
                                    <div style={{ color: 'var(--text-headline)', fontWeight: 600 }}>
                                        {analysis.username || 'Unknown User'}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-body)' }}>
                                        {analysis.user_email || '-'}
                                    </div>
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)' }}>
                                    {analysis.customer_name || analysis.customer_whatsapp || analysis.customer_email ? (
                                        <div>
                                            {analysis.customer_name && (
                                                <div style={{ color: 'var(--text-headline)', fontWeight: 600, fontSize: '0.9rem' }}>
                                                    👤 {analysis.customer_name}
                                                </div>
                                            )}
                                            {analysis.customer_whatsapp && (
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-body)', marginTop: '2px' }}>
                                                    📱 {analysis.customer_whatsapp}
                                                </div>
                                            )}
                                            {analysis.customer_email && (
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-body)', marginTop: '2px' }}>
                                                    ✉️ {analysis.customer_email}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span style={{ color: 'var(--text-body)', fontSize: '0.8rem' }}>-</span>
                                    )}
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)' }}>
                                    <span style={{ color: getScoreColor(Number(analysis.overall_score || 0)), fontWeight: 700 }}>
                                        {Number(analysis.overall_score || 0)}%
                                    </span>
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', color: 'var(--text-body)' }}>
                                    {analysis.skin_type || '-'}
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', color: 'var(--text-body)' }}>
                                    {analysis.engine || '-'}
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', color: 'var(--text-body)' }}>
                                    {new Date(analysis.created_at).toLocaleString('id-ID')}
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                                        <button
                                            onClick={() => viewDetail(analysis.id)}
                                            style={{
                                                border: '1px solid rgba(157,90,118,0.25)',
                                                borderRadius: '8px',
                                                background: 'rgba(157,90,118,0.1)',
                                                color: 'var(--primary-color)',
                                                padding: '6px 10px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Eye size={14} />
                                        </button>
                                        <button
                                            onClick={() => deleteAnalysis(analysis.id)}
                                            style={{
                                                border: '1px solid rgba(239,68,68,0.3)',
                                                borderRadius: '8px',
                                                background: 'rgba(239,68,68,0.1)',
                                                color: 'var(--error-color)',
                                                padding: '6px 10px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredAnalyses.length === 0 && (
                <p style={{ marginTop: '16px', textAlign: 'center', color: 'var(--text-body)' }}>Tidak ada analysis.</p>
            )}

            {showDetail && selectedAnalysis && (
                <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && setShowDetail(false)}>
                    <div style={{ ...cardStyle, width: '100%', maxWidth: '900px', maxHeight: '92vh', overflowY: 'auto', padding: '28px' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ color: 'var(--text-headline)', fontFamily: 'var(--font-serif)', margin: '0 0 4px' }}>
                                    Analysis #{selectedAnalysis.id}
                                </h3>
                                <p style={{ color: 'var(--text-body)', fontSize: '0.85rem', margin: 0 }}>
                                    {selectedAnalysis.username || selectedAnalysis.user_email || 'Unknown'} • {new Date(selectedAnalysis.created_at).toLocaleString('id-ID')}
                                </p>
                                {selectedAnalysis.client_session_id && (
                                    <p style={{ color: 'var(--text-body)', fontSize: '0.75rem', margin: '4px 0 0', fontFamily: 'monospace' }}>
                                        Session: {selectedAnalysis.client_session_id}
                                    </p>
                                )}
                            </div>
                            <button onClick={() => setShowDetail(false)} style={{ border: '1px solid rgba(157,90,118,0.25)', borderRadius: '9px', padding: '8px 14px', background: 'transparent', color: 'var(--text-body)', cursor: 'pointer', flexShrink: 0 }}>
                                ✕ Tutup
                            </button>
                        </div>

                        {/* Customer Info */}
                        {(selectedAnalysis.customer_name || selectedAnalysis.customer_whatsapp || selectedAnalysis.customer_email) && (
                            <div style={{ ...cardStyle, padding: '14px', marginBottom: '16px', background: 'rgba(157,90,118,0.05)' }}>
                                <p style={{ fontWeight: 600, color: 'var(--text-headline)', marginBottom: '8px', fontSize: '0.85rem' }}>👤 Info Customer</p>
                                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-body)' }}>
                                    {selectedAnalysis.customer_name && <span><strong>Nama:</strong> {selectedAnalysis.customer_name}</span>}
                                    {selectedAnalysis.customer_whatsapp && <span><strong>WA:</strong> {selectedAnalysis.customer_whatsapp}</span>}
                                    {selectedAnalysis.customer_email && <span><strong>Email:</strong> {selectedAnalysis.customer_email}</span>}
                                </div>
                            </div>
                        )}

                        {/* Images */}
                        {(selectedAnalysis.image_url || selectedAnalysis.visualization_url) && (
                            <div style={{ display: 'grid', gridTemplateColumns: selectedAnalysis.visualization_url ? '1fr 1fr' : '1fr', gap: '12px', marginBottom: '16px' }}>
                                {selectedAnalysis.image_url && (
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-body)', marginBottom: '6px' }}>Foto Asli</p>
                                        <img src={selectedAnalysis.image_url} alt="face" style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(157,90,118,0.2)' }} />
                                    </div>
                                )}
                                {selectedAnalysis.visualization_url && (
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-body)', marginBottom: '6px' }}>Visualisasi</p>
                                        <img src={selectedAnalysis.visualization_url} alt="visualization" style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(157,90,118,0.2)' }} />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Score Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
                            {[
                                { label: 'Skor', value: `${Number(selectedAnalysis.overall_score || 0)}%`, color: getScoreColor(Number(selectedAnalysis.overall_score || 0)) },
                                { label: 'Jenis Kulit', value: selectedAnalysis.skin_type || '-' },
                                { label: 'Fitzpatrick', value: selectedAnalysis.fitzpatrick_type || '-' },
                                { label: 'Usia Prediksi', value: selectedAnalysis.predicted_age ? `${selectedAnalysis.predicted_age} thn` : '-' },
                            ].map((item) => (
                                <div key={item.label} style={{ ...cardStyle, padding: '12px', textAlign: 'center' }}>
                                    <p style={{ color: 'var(--text-body)', fontSize: '0.75rem', margin: '0 0 4px' }}>{item.label}</p>
                                    <p style={{ color: item.color || 'var(--text-headline)', fontWeight: 700, fontSize: '1rem', margin: 0 }}>{item.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        {selectedAnalysis.ai_insights?.summary && (
                            <div style={{ ...cardStyle, padding: '14px', marginBottom: '16px' }}>
                                <p style={{ fontWeight: 600, color: 'var(--text-headline)', marginBottom: '8px', fontSize: '0.85rem' }}>📝 Ringkasan</p>
                                <p style={{ color: 'var(--text-body)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                                    {selectedAnalysis.ai_insights.summary}
                                </p>
                            </div>
                        )}

                        {/* Detected Issues */}
                        {selectedAnalysis.ai_insights?.ai_metrics?.detected_issues?.length > 0 && (
                            <div style={{ ...cardStyle, padding: '14px', marginBottom: '16px' }}>
                                <p style={{ fontWeight: 600, color: 'var(--text-headline)', marginBottom: '10px', fontSize: '0.85rem' }}>⚠️ Masalah Terdeteksi</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {selectedAnalysis.ai_insights.ai_metrics.detected_issues.map((issue, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(157,90,118,0.05)', borderRadius: '8px', fontSize: '0.85rem' }}>
                                            <span style={{ color: 'var(--text-headline)', fontWeight: 500 }}>{issue.issue}</span>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <span style={{ color: 'var(--text-body)', fontSize: '0.75rem' }}>{issue.location}</span>
                                                <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, background: issue.severity?.toLowerCase().includes('parah') ? 'rgba(220,38,38,0.1)' : 'rgba(234,88,12,0.1)', color: issue.severity?.toLowerCase().includes('parah') ? '#dc2626' : '#ea580c' }}>
                                                    {issue.severity}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* HTML Output */}
                        {selectedAnalysis.ai_insights?.output && (
                            <div style={{ ...cardStyle, padding: '14px', marginBottom: '16px' }}>
                                <p style={{ fontWeight: 600, color: 'var(--text-headline)', marginBottom: '10px', fontSize: '0.85rem' }}>🔬 Analisis Detail</p>
                                <div
                                    className="ai-html-output"
                                    style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.7 }}
                                    dangerouslySetInnerHTML={{ __html: selectedAnalysis.ai_insights.output }}
                                />
                            </div>
                        )}

                        {/* Recommended Products */}
                        {selectedAnalysis.ai_insights?.recommended_products?.length > 0 && (
                            <div style={{ ...cardStyle, padding: '14px', marginBottom: '16px' }}>
                                <p style={{ fontWeight: 600, color: 'var(--text-headline)', marginBottom: '10px', fontSize: '0.85rem' }}>🛍️ Rekomendasi Produk</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {selectedAnalysis.ai_insights.recommended_products.map((p, i) => (
                                        <div key={i} style={{ padding: '12px', background: 'rgba(157,90,118,0.05)', borderRadius: '10px', border: '1px solid rgba(157,90,118,0.1)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                                <span style={{ fontWeight: 600, color: 'var(--text-headline)', fontSize: '0.9rem' }}>{p.name}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', background: 'rgba(157,90,118,0.1)', padding: '2px 8px', borderRadius: '6px', marginLeft: '8px', flexShrink: 0 }}>{p.category}</span>
                                            </div>
                                            {p.brand && <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', margin: '0 0 4px', fontStyle: 'italic' }}>{p.brand}</p>}
                                            {p.resume && <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', margin: 0, lineHeight: 1.5 }}>{p.resume}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Meta info */}
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-body)', paddingTop: '8px', borderTop: '1px solid rgba(157,90,118,0.1)' }}>
                            <span>Engine: {selectedAnalysis.engine || '-'}</span>
                            <span>Version: {selectedAnalysis.analysis_version || '-'}</span>
                            {selectedAnalysis.processing_time_ms && <span>Processing: {selectedAnalysis.processing_time_ms}ms</span>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalysesManagement;
