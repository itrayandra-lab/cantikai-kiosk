import React, { useEffect, useMemo, useState } from 'react';
import { Search, Eye, Pencil, Trash2 } from 'lucide-react';
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

const ChatSessionsManagement = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedSession, setSelectedSession] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [editingSessionId, setEditingSessionId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');

    const fetchSessions = async () => {
        try {
            const data = await apiService.getAdminChatSessions();
            setSessions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Fetch chat sessions failed:', error);
            alert(error.message || 'Gagal memuat chat sessions');
            setSessions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const filteredSessions = useMemo(() => {
        const term = search.toLowerCase();
        return sessions.filter((session) => {
            const text = `${session.title || ''} ${session.username || ''} ${session.user_email || ''} ${session.session_uuid || ''}`.toLowerCase();
            return text.includes(term);
        });
    }, [sessions, search]);

    const viewDetail = async (id) => {
        try {
            const detail = await apiService.getAdminChatSessionDetail(id);
            setSelectedSession(detail);
            setShowDetail(true);
        } catch (error) {
            alert(error.message || 'Gagal memuat detail session');
        }
    };

    const beginEditTitle = (session) => {
        setEditingSessionId(session.id);
        setEditingTitle(session.title || '');
    };

    const saveTitle = async (id) => {
        try {
            await apiService.updateAdminChatSession(id, { title: editingTitle.trim() || 'New Chat' });
            setSessions((prev) => prev.map((session) => (
                session.id === id ? { ...session, title: editingTitle.trim() || 'New Chat' } : session
            )));
            if (selectedSession?.id === id) {
                setSelectedSession((prev) => ({ ...prev, title: editingTitle.trim() || 'New Chat' }));
            }
            setEditingSessionId(null);
            setEditingTitle('');
        } catch (error) {
            alert(error.message || 'Gagal update judul session');
        }
    };

    const deleteSession = async (id) => {
        if (!window.confirm('Hapus chat session ini?')) return;
        try {
            await apiService.deleteAdminChatSession(id);
            setSessions((prev) => prev.filter((session) => session.id !== id));
            if (selectedSession?.id === id) {
                setShowDetail(false);
                setSelectedSession(null);
            }
        } catch (error) {
            alert(error.message || 'Gagal menghapus chat session');
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-body)' }}>Loading chat sessions...</div>;
    }

    return (
        <div>
            <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-headline)', fontFamily: 'var(--font-serif)' }}>
                    Chat Sessions Management
                </h2>
                <p style={{ color: 'var(--text-body)', fontSize: '0.9rem' }}>{filteredSessions.length} sessions</p>
            </div>

            <div style={{ marginBottom: '16px', position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-body)' }} />
                <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Cari session title/user/email"
                    style={{ ...fieldStyle, paddingLeft: '38px' }}
                />
            </div>

            <div style={{ ...cardStyle, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Session</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>User</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Messages</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Last Message</th>
                            <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSessions.map((session) => (
                            <tr key={session.id}>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', color: 'var(--text-headline)' }}>
                                    {editingSessionId === session.id ? (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <input
                                                autoFocus
                                                value={editingTitle}
                                                onChange={(event) => setEditingTitle(event.target.value)}
                                                style={{ ...fieldStyle, padding: '6px 10px' }}
                                            />
                                            <button
                                                onClick={() => saveTitle(session.id)}
                                                style={{
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    background: 'var(--primary-color)',
                                                    color: '#fff',
                                                    padding: '6px 10px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{session.title || 'New Chat'}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-body)' }}>{session.session_uuid}</div>
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', color: 'var(--text-body)' }}>
                                    <div>{session.username || 'Unknown User'}</div>
                                    <div style={{ fontSize: '0.8rem' }}>{session.user_email || '-'}</div>
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', color: 'var(--text-body)' }}>
                                    {session.message_count || 0}
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', color: 'var(--text-body)' }}>
                                    {session.last_message_at ? new Date(session.last_message_at).toLocaleString('id-ID') : '-'}
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                                        <button
                                            onClick={() => viewDetail(session.id)}
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
                                            onClick={() => beginEditTitle(session)}
                                            style={{
                                                border: '1px solid rgba(157,90,118,0.25)',
                                                borderRadius: '8px',
                                                background: 'rgba(157,90,118,0.1)',
                                                color: 'var(--primary-color)',
                                                padding: '6px 10px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => deleteSession(session.id)}
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

            {filteredSessions.length === 0 && (
                <p style={{ marginTop: '16px', textAlign: 'center', color: 'var(--text-body)' }}>Tidak ada chat session.</p>
            )}

            {showDetail && selectedSession && (
                <div style={overlayStyle}>
                    <div style={{ ...cardStyle, width: '100%', maxWidth: '860px', maxHeight: '90vh', overflowY: 'auto', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <div>
                                <h3 style={{ color: 'var(--text-headline)', fontFamily: 'var(--font-serif)' }}>{selectedSession.title || 'New Chat'}</h3>
                                <p style={{ color: 'var(--text-body)', fontSize: '0.85rem' }}>
                                    {selectedSession.username || 'Unknown User'} ({selectedSession.user_email || '-'})
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

                        <div style={{ display: 'grid', gap: '8px' }}>
                            {(selectedSession.messages || []).map((message) => (
                                <div
                                    key={message.id}
                                    style={{
                                        padding: '10px 12px',
                                        borderRadius: '10px',
                                        background: message.role === 'user'
                                            ? 'rgba(157,90,118,0.1)'
                                            : 'rgba(255,255,255,0.9)',
                                        border: '1px solid rgba(157,90,118,0.15)'
                                    }}
                                >
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-body)', marginBottom: '4px' }}>
                                        {message.role} • {new Date(message.created_at).toLocaleString('id-ID')}
                                    </div>
                                    <div style={{ color: 'var(--text-headline)', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                            {(selectedSession.messages || []).length === 0 && (
                                <p style={{ textAlign: 'center', color: 'var(--text-body)' }}>No messages in this session.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatSessionsManagement;
