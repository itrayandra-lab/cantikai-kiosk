import React, { useEffect, useMemo, useState } from 'react';
import { Search, Trash2, Eye } from 'lucide-react';
import apiService from '../../services/api';

const cardStyle = {
  background: 'rgba(255,255,255,0.82)',
  borderRadius: '18px',
  border: '1px solid rgba(255,255,255,0.95)',
  boxShadow: '0 10px 30px rgba(89,54,69,0.08)',
  backdropFilter: 'blur(25px)',
  WebkitBackdropFilter: 'blur(25px)'
};

const fieldStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid rgba(157,90,118,0.25)',
  background: 'rgba(255,255,255,0.75)',
  fontFamily: 'var(--font-sans)',
  outline: 'none'
};

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(30,20,26,0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  zIndex: 1100
};

const sectionCardStyle = {
  marginTop: '12px',
  padding: '14px',
  borderRadius: '12px',
  border: '1px solid rgba(157,90,118,0.18)',
  background: 'rgba(157,90,118,0.06)'
};

const chipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '6px 10px',
  borderRadius: '999px',
  border: '1px solid rgba(157,90,118,0.25)',
  background: 'rgba(255,255,255,0.74)',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: 'var(--text-headline)'
};

const collectAnalysisModes = (analysis) => {
  const fromVision = Array.isArray(analysis?.vision_analysis?.analysis_modes)
    ? analysis.vision_analysis.analysis_modes
    : [];
  const fromInsights = Array.isArray(analysis?.ai_insights?.analysis_modes)
    ? analysis.ai_insights.analysis_modes
    : [];
  const source = fromVision.length > 0 ? fromVision : fromInsights;
  return source.map((item) => ({
    key: item?.key || item?.mode || item?.title || '-',
    score: Number.isFinite(Number(item?.score ?? item?.value)) ? Math.round(Number(item.score ?? item.value)) : null,
    status: item?.status || '-'
  }));
};

const collectInputValidation = (analysis) => {
  const raw = analysis?.vision_analysis?.input_validation || analysis?.ai_insights?.input_validation || null;
  if (!raw || typeof raw !== 'object') return null;
  const reasons = Array.isArray(raw.reasons) ? raw.reasons.filter(Boolean) : [];
  return {
    isValid: raw.is_valid_for_skin_analysis !== false,
    faceDetected: raw.face_detected !== false,
    subjectType: raw.subject_type || '-',
    faceCount: Number.isFinite(Number(raw.face_count)) ? Number(raw.face_count) : null,
    lighting: raw.lighting || '-',
    sharpness: raw.sharpness || '-',
    confidence: Number.isFinite(Number(raw.confidence)) ? Number(raw.confidence) : null,
    reasons: reasons.slice(0, 6),
    retakeInstruction: raw.retake_instruction || ''
  };
};

const KioskSessionsManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const selectedAnalysis = selectedSession?.analysis || null;
  const selectedModes = useMemo(() => collectAnalysisModes(selectedAnalysis), [selectedAnalysis]);
  const selectedValidation = useMemo(() => collectInputValidation(selectedAnalysis), [selectedAnalysis]);

  const loadSessions = async () => {
    try {
      const data = await apiService.getAdminKioskSessions();
      setSessions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load kiosk sessions:', error);
      alert(error.message || 'Gagal memuat data kiosk');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();
    return sessions.filter((item) => {
      if (statusFilter !== 'all' && String(item.status || '').toLowerCase() !== statusFilter) return false;
      if (!keyword) return true;
      const haystack = `${item.visitor_name || ''} ${item.gender || ''} ${item.whatsapp_masked || ''} ${item.session_uuid || ''}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [sessions, search, statusFilter]);

  const openDetail = async (session) => {
    try {
      setDetailLoading(true);
      const detail = await apiService.getAdminKioskSessionDetail(session.id);
      setSelectedSession(detail);
    } catch (error) {
      console.error('Failed to load kiosk detail:', error);
      alert(error.message || 'Gagal memuat detail session kiosk');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Hapus session kiosk ini? Data analisa terkait akan ikut terhapus.')) return;
    try {
      await apiService.deleteAdminKioskSession(sessionId);
      setSessions((prev) => prev.filter((item) => item.id !== sessionId));
      if (selectedSession?.id === sessionId) {
        setSelectedSession(null);
      }
    } catch (error) {
      console.error('Delete kiosk session failed:', error);
      alert(error.message || 'Gagal menghapus session kiosk');
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-body)' }}>Loading kiosk sessions...</div>;
  }

  return (
    <div style={{ display: 'grid', gap: '12px' }}>
      <div style={{ ...cardStyle, padding: '18px' }}>
        <h2 style={{ color: 'var(--text-headline)', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>Kiosk Sessions</h2>
        <p style={{ color: 'var(--text-body)', marginBottom: '12px', fontSize: '0.9rem' }}>
          Pantau sesi kiosk publik, lihat hasil analisa, dan bersihkan data jika diperlukan.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-body)' }} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama, uuid, gender"
              style={{ ...fieldStyle, paddingLeft: '34px' }}
            />
          </div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} style={fieldStyle}>
            <option value="all">All Status</option>
            <option value="started">Started</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div style={{ ...cardStyle, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['UUID', 'Nama', 'Gender', 'WA', 'Status', 'Score', 'Created', 'Action'].map((title) => (
                <th
                  key={title}
                  style={{
                    textAlign: 'left',
                    fontSize: '0.78rem',
                    color: 'var(--text-body)',
                    padding: '12px',
                    borderBottom: '1px solid rgba(157,90,118,0.15)'
                  }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: '12px', fontSize: '0.82rem', borderBottom: '1px solid rgba(157,90,118,0.08)' }}>
                  {item.session_uuid}
                </td>
                <td style={{ padding: '12px', fontSize: '0.9rem', borderBottom: '1px solid rgba(157,90,118,0.08)' }}>{item.visitor_name}</td>
                <td style={{ padding: '12px', fontSize: '0.85rem', borderBottom: '1px solid rgba(157,90,118,0.08)' }}>{item.gender}</td>
                <td style={{ padding: '12px', fontSize: '0.85rem', borderBottom: '1px solid rgba(157,90,118,0.08)' }}>{item.whatsapp_masked || '-'}</td>
                <td style={{ padding: '12px', fontSize: '0.85rem', borderBottom: '1px solid rgba(157,90,118,0.08)' }}>{item.status}</td>
                <td style={{ padding: '12px', fontSize: '0.85rem', borderBottom: '1px solid rgba(157,90,118,0.08)' }}>
                  {item.overall_score === null || item.overall_score === undefined ? '-' : `${Math.round(Number(item.overall_score))}/100`}
                </td>
                <td style={{ padding: '12px', fontSize: '0.82rem', borderBottom: '1px solid rgba(157,90,118,0.08)' }}>
                  {item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-'}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button
                      onClick={() => openDetail(item)}
                      style={{
                        border: '1px solid rgba(157,90,118,0.25)',
                        borderRadius: '8px',
                        background: 'rgba(157,90,118,0.1)',
                        color: 'var(--primary-color)',
                        padding: '6px 8px',
                        cursor: 'pointer'
                      }}
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px',
                        background: 'rgba(239,68,68,0.1)',
                        color: 'var(--error-color)',
                        padding: '6px 8px',
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
        {filtered.length === 0 ? (
          <p style={{ color: 'var(--text-body)', textAlign: 'center', padding: '18px' }}>Tidak ada data kiosk session.</p>
        ) : null}
      </div>

      {selectedSession ? (
        <div style={overlayStyle} onClick={() => setSelectedSession(null)}>
          <div style={{ ...cardStyle, width: 'min(860px, 96vw)', maxHeight: '88vh', overflowY: 'auto', padding: '18px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: '8px', color: 'var(--text-headline)', fontFamily: 'var(--font-serif)' }}>
              Detail Kiosk Session
            </h3>
            {detailLoading ? <p>Loading...</p> : (
              <>
                <p><strong>UUID:</strong> {selectedSession.session_uuid}</p>
                <p><strong>Visitor:</strong> {selectedSession.visitor_name}</p>
                <p><strong>Gender:</strong> {selectedSession.gender}</p>
                <p><strong>WA:</strong> {selectedSession.whatsapp_masked || '-'}</p>
                <p><strong>Status:</strong> {selectedSession.status}</p>

                {selectedAnalysis ? (
                  <div style={sectionCardStyle}>
                    <p><strong>Score:</strong> {Math.round(Number(selectedAnalysis.overall_score || 0))}/100</p>
                    <p><strong>Skin Type:</strong> {selectedAnalysis.skin_type || '-'}</p>
                    <p><strong>Fitzpatrick:</strong> {selectedAnalysis.fitzpatrick_type || '-'}</p>
                    <p><strong>Predicted Age:</strong> {selectedAnalysis.predicted_age || '-'}</p>
                    <p><strong>Summary:</strong> {selectedAnalysis.result_summary || '-'}</p>
                    <p><strong>Delivery:</strong> {selectedAnalysis.delivery_status || '-'}</p>
                    <p><strong>Token:</strong> {selectedAnalysis.result_token || '-'}</p>

                    {(selectedAnalysis.visualization_url || selectedAnalysis.image_url) ? (
                      <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
                        {selectedAnalysis.visualization_url ? (
                          <a href={selectedAnalysis.visualization_url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontSize: '0.82rem' }}>
                            Buka gambar visualisasi
                          </a>
                        ) : null}
                        {selectedAnalysis.image_url ? (
                          <a href={selectedAnalysis.image_url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontSize: '0.82rem' }}>
                            Buka gambar asli
                          </a>
                        ) : null}
                      </div>
                    ) : null}

                    {selectedValidation ? (
                      <div style={{ ...sectionCardStyle, marginTop: '10px', background: 'rgba(255,255,255,0.58)' }}>
                        <h4 style={{ margin: '0 0 8px', color: 'var(--text-headline)', fontFamily: 'var(--font-serif)' }}>Input Validation</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          <span style={chipStyle}>{selectedValidation.isValid ? 'Valid' : 'Invalid'}</span>
                          <span style={chipStyle}>Face: {selectedValidation.faceDetected ? 'Yes' : 'No'}</span>
                          <span style={chipStyle}>Type: {selectedValidation.subjectType}</span>
                          <span style={chipStyle}>Count: {selectedValidation.faceCount ?? '-'}</span>
                          <span style={chipStyle}>Light: {selectedValidation.lighting}</span>
                          <span style={chipStyle}>Sharp: {selectedValidation.sharpness}</span>
                          <span style={chipStyle}>Conf: {selectedValidation.confidence ?? '-'}</span>
                        </div>
                        {selectedValidation.reasons.length > 0 ? (
                          <div style={{ marginTop: '8px', display: 'grid', gap: '4px' }}>
                            {selectedValidation.reasons.map((reason, index) => (
                              <span key={`${reason}-${index}`} style={{ fontSize: '0.8rem', color: 'var(--text-body)' }}>
                                • {reason}
                              </span>
                            ))}
                          </div>
                        ) : null}
                        {selectedValidation.retakeInstruction ? (
                          <p style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-body)' }}>
                            <strong>Retake:</strong> {selectedValidation.retakeInstruction}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    {selectedModes.length > 0 ? (
                      <div style={{ ...sectionCardStyle, marginTop: '10px', background: 'rgba(255,255,255,0.58)' }}>
                        <h4 style={{ margin: '0 0 8px', color: 'var(--text-headline)', fontFamily: 'var(--font-serif)' }}>
                          15 Analysis Modes ({selectedModes.length})
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
                          {selectedModes.slice(0, 15).map((mode) => (
                            <div key={mode.key} style={{ border: '1px solid rgba(157,90,118,0.18)', borderRadius: '10px', padding: '8px', background: 'rgba(255,255,255,0.76)' }}>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-body)', marginBottom: '2px' }}>{mode.key}</div>
                              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-headline)' }}>
                                {mode.score === null ? '-' : `${mode.score}/100`}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-body)' }}>{mode.status}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p>Belum ada hasil analisa untuk session ini.</p>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
                  <button className="btn-primary" onClick={() => setSelectedSession(null)} style={{
                    border: 'none',
                    borderRadius: '10px',
                    padding: '9px 14px',
                    background: 'var(--primary-color)',
                    color: '#fff',
                    cursor: 'pointer'
                  }}>
                    Tutup
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default KioskSessionsManagement;
