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
                <div style={overlayStyle}>
                    <div style={{ ...cardStyle, width: '100%', maxWidth: '860px', maxHeight: '90vh', overflowY: 'auto', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', gap: '10px' }}>
                            <div>
                                <h3 style={{ color: 'var(--text-headline)', fontFamily: 'var(--font-serif)' }}>
                                    Analysis #{selectedAnalysis.id}
                                </h3>
                                <p style={{ color: 'var(--text-body)', fontSize: '0.9rem' }}>
                                    {selectedAnalysis.username || selectedAnalysis.user_email || 'Unknown'} • {new Date(selectedAnalysis.created_at).toLocaleString('id-ID')}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDetail(false)}
                                style={{
                                    border: '1px solid rgba(157,90,118,0.25)',
                                    borderRadius: '9px',
                                    padding: '8px 12px',
                                    background: 'transparent',
                                    color: 'var(--text-body)',
                                    cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                        </div>

                        {(selectedAnalysis.image_url || selectedAnalysis.visualization_url) && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                                {selectedAnalysis.image_url && (
                                    <img
                                        src={selectedAnalysis.image_url}
                                        alt="face"
                                        style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(157,90,118,0.2)' }}
                                    />
                                )}
                                {selectedAnalysis.visualization_url && (
                                    <img
                                        src={selectedAnalysis.visualization_url}
                                        alt="visualization"
                                        style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(157,90,118,0.2)' }}
                                    />
                                )}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                            <div style={{ ...cardStyle, padding: '12px' }}>
                                <p style={{ color: 'var(--text-body)', fontSize: '0.8rem' }}>Overall score</p>
                                <p style={{ color: getScoreColor(Number(selectedAnalysis.overall_score || 0)), fontWeight: 700, fontSize: '1.2rem' }}>
                                    {Number(selectedAnalysis.overall_score || 0)}%
                                </p>
                            </div>
                            <div style={{ ...cardStyle, padding: '12px' }}>
                                <p style={{ color: 'var(--text-body)', fontSize: '0.8rem' }}>Skin type</p>
                                <p style={{ color: 'var(--text-headline)', fontWeight: 700, fontSize: '1rem' }}>
                                    {selectedAnalysis.skin_type || '-'}
                                </p>
                            </div>
                            <div style={{ ...cardStyle, padding: '12px' }}>
                                <p style={{ color: 'var(--text-body)', fontSize: '0.8rem' }}>Predicted age</p>
                                <p style={{ color: 'var(--text-headline)', fontWeight: 700, fontSize: '1rem' }}>
                                    {selectedAnalysis.predicted_age || '-'}
                                </p>
                            </div>
                        </div>

                        <div style={{ ...cardStyle, padding: '12px' }}>
                            <p style={{ color: 'var(--text-body)', fontSize: '0.85rem', marginBottom: '6px' }}>AI Insights</p>
                            <pre style={{ whiteSpace: 'pre-wrap', margin: 0, color: 'var(--text-headline)', fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}>
                                {typeof selectedAnalysis.ai_insights === 'object'
                                    ? JSON.stringify(selectedAnalysis.ai_insights, null, 2)
                                    : (selectedAnalysis.ai_insights || '-')}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalysesManagement;
