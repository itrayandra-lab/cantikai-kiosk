import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import apiService from '../../services/api';

const emptyForm = {
    email: '',
    name: '',
    password: '',
    age: '',
    gender: '',
    skin_type: '',
    auth_provider: 'email'
};

const tableHeaderStyle = {
    padding: '12px',
    textAlign: 'left',
    fontSize: '0.8rem',
    color: 'var(--text-body)',
    fontWeight: 600,
    borderBottom: '1px solid rgba(157, 90, 118, 0.15)'
};

const cellStyle = {
    padding: '12px',
    fontSize: '0.9rem',
    color: 'var(--text-headline)',
    borderBottom: '1px solid rgba(157, 90, 118, 0.08)'
};

const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid rgba(157, 90, 118, 0.25)',
    background: 'rgba(255,255,255,0.7)',
    fontFamily: 'var(--font-sans)',
    outline: 'none'
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(30, 20, 26, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
};

const cardStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '18px',
    border: '1px solid rgba(255,255,255,0.9)',
    boxShadow: '0 10px 30px rgba(89, 54, 69, 0.08)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)'
};

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const fetchUsers = async () => {
        try {
            const data = await apiService.getAllUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            alert(error.message || 'Gagal memuat data user');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        const term = search.toLowerCase();
        return users.filter((user) => {
            const haystack = `${user.name || ''} ${user.username || ''} ${user.email || ''} ${user.skin_type || ''}`.toLowerCase();
            return haystack.includes(term);
        });
    }, [users, search]);

    const openCreate = () => {
        setEditingUser(null);
        setFormData(emptyForm);
        setShowForm(true);
    };

    const openEdit = (user) => {
        setEditingUser(user);
        setFormData({
            email: user.email || '',
            name: user.name || '',
            password: '',
            age: user.age || '',
            gender: user.gender || '',
            skin_type: user.skin_type || '',
            auth_provider: user.auth_provider || 'email'
        });
        setShowForm(true);
    };

    const closeForm = () => {
        if (saving) return;
        setShowForm(false);
        setEditingUser(null);
        setFormData(emptyForm);
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const payload = {
                email: formData.email.trim().toLowerCase(),
                name: formData.name.trim(),
                age: formData.age === '' ? null : Number(formData.age),
                gender: formData.gender || null,
                skin_type: formData.skin_type || null,
                auth_provider: formData.auth_provider || 'email'
            };

            if (formData.password) {
                payload.password = formData.password;
            }

            if (!editingUser && !payload.password && payload.auth_provider === 'email') {
                alert('Password wajib diisi untuk user email');
                setSaving(false);
                return;
            }

            if (editingUser) {
                await apiService.updateAdminUser(editingUser.id, payload);
            } else {
                await apiService.createAdminUser(payload);
            }

            closeForm();
            await fetchUsers();
        } catch (error) {
            console.error('Save user failed:', error);
            alert(error.message || 'Gagal menyimpan user');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Hapus user ini? Semua data terkait akan ikut terhapus.')) return;
        try {
            await apiService.deleteAdminUser(userId);
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (error) {
            console.error('Delete user failed:', error);
            alert(error.message || 'Gagal menghapus user');
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-body)' }}>Loading users...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ color: 'var(--text-headline)', fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>
                    Users Management
                </h2>
                <button
                    onClick={openCreate}
                    style={{
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        background: 'var(--primary-color)',
                        color: '#fff',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 600
                    }}
                >
                    <Plus size={16} />
                    Add User
                </button>
            </div>

            <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search
                    size={18}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-body)' }}
                />
                <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Cari user (nama, email, skin type)"
                    style={{ ...inputStyle, paddingLeft: '36px' }}
                />
            </div>

            <div style={{ ...cardStyle, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>ID</th>
                            <th style={tableHeaderStyle}>Name</th>
                            <th style={tableHeaderStyle}>Email</th>
                            <th style={tableHeaderStyle}>Provider</th>
                            <th style={tableHeaderStyle}>Skin Type</th>
                            <th style={tableHeaderStyle}>Last Login</th>
                            <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td style={cellStyle}>{user.id}</td>
                                <td style={cellStyle}>{user.name || '-'}</td>
                                <td style={cellStyle}>{user.email}</td>
                                <td style={cellStyle}>{user.auth_provider || 'email'}</td>
                                <td style={cellStyle}>{user.skin_type || '-'}</td>
                                <td style={cellStyle}>{user.last_login ? new Date(user.last_login).toLocaleString('id-ID') : '-'}</td>
                                <td style={{ ...cellStyle, textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                                        <button
                                            onClick={() => openEdit(user)}
                                            style={{
                                                border: '1px solid rgba(157, 90, 118, 0.25)',
                                                borderRadius: '8px',
                                                background: 'rgba(157, 90, 118, 0.1)',
                                                color: 'var(--primary-color)',
                                                padding: '6px 10px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            style={{
                                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                                borderRadius: '8px',
                                                background: 'rgba(239, 68, 68, 0.1)',
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

            <p style={{ marginTop: '12px', color: 'var(--text-body)', fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}>
                Showing {filteredUsers.length} of {users.length} users
            </p>

            {showForm && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...cardStyle, width: '100%', maxWidth: '560px', padding: '24px' }}>
                        <h3 style={{ marginBottom: '14px', fontFamily: 'var(--font-serif)', color: 'var(--text-headline)' }}>
                            {editingUser ? 'Edit User' : 'Create User'}
                        </h3>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(event) => handleChange('email', event.target.value)}
                                placeholder="Email"
                                style={inputStyle}
                            />
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(event) => handleChange('name', event.target.value)}
                                placeholder="Nama"
                                style={inputStyle}
                            />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(event) => handleChange('password', event.target.value)}
                                minLength={8}
                                placeholder={editingUser ? 'Password baru (opsional)' : 'Password minimal 8 karakter'}
                                style={inputStyle}
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.age}
                                    onChange={(event) => handleChange('age', event.target.value)}
                                    placeholder="Age"
                                    style={inputStyle}
                                />
                                <select
                                    value={formData.gender}
                                    onChange={(event) => handleChange('gender', event.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="">Gender</option>
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                    <option value="other">Other</option>
                                </select>
                                <select
                                    value={formData.skin_type}
                                    onChange={(event) => handleChange('skin_type', event.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="">Skin Type</option>
                                    <option value="normal">Normal</option>
                                    <option value="oily">Oily</option>
                                    <option value="dry">Dry</option>
                                    <option value="combination">Combination</option>
                                    <option value="sensitive">Sensitive</option>
                                </select>
                            </div>

                            <select
                                value={formData.auth_provider}
                                onChange={(event) => handleChange('auth_provider', event.target.value)}
                                style={inputStyle}
                            >
                                <option value="email">Email</option>
                                <option value="google">Google</option>
                            </select>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    style={{
                                        padding: '9px 14px',
                                        borderRadius: '9px',
                                        border: '1px solid rgba(157, 90, 118, 0.25)',
                                        background: 'transparent',
                                        color: 'var(--text-body)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    style={{
                                        padding: '9px 14px',
                                        borderRadius: '9px',
                                        border: 'none',
                                        background: 'var(--primary-color)',
                                        color: '#fff',
                                        cursor: saving ? 'not-allowed' : 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    {saving ? 'Saving...' : editingUser ? 'Save Changes' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;
