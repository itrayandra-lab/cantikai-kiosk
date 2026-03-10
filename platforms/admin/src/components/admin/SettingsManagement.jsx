import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import apiService from '../../services/api';

const emptyForm = {
    key: '',
    value: '',
    value_type: 'string',
    category: 'general',
    description: '',
    is_public: true
};

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

const encodeSettingValue = (value, type) => {
    if (type === 'boolean') return value ? 'true' : 'false';
    if (type === 'number') return String(Number(value || 0));
    if (type === 'json') {
        if (typeof value === 'string') {
            try {
                JSON.parse(value);
                return value;
            } catch {
                throw new Error('JSON tidak valid');
            }
        }
        return JSON.stringify(value);
    }
    return String(value);
};

const SettingsManagement = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const fetchSettings = async () => {
        try {
            const response = await apiService.getAdminSettings();
            const rows = response?.settings || [];
            setSettings(Array.isArray(rows) ? rows : []);
        } catch (error) {
            console.error('Fetch settings failed:', error);
            alert(error.message || 'Gagal memuat settings');
            setSettings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const categories = useMemo(() => {
        const unique = Array.from(new Set(settings.map((item) => item.category || 'general')));
        return ['all', ...unique];
    }, [settings]);

    const filteredSettings = useMemo(() => {
        const term = search.toLowerCase();
        return settings.filter((setting) => {
            const matchCategory = categoryFilter === 'all' || (setting.category || 'general') === categoryFilter;
            const content = `${setting.key || ''} ${setting.description || ''}`.toLowerCase();
            return matchCategory && content.includes(term);
        });
    }, [settings, search, categoryFilter]);

    const openCreate = () => {
        setEditing(null);
        setFormData(emptyForm);
        setShowForm(true);
    };

    const openEdit = (setting) => {
        setEditing(setting);
        setFormData({
            key: setting.key || '',
            value: setting.value_type === 'json'
                ? JSON.stringify(setting.parsed_value ?? {}, null, 2)
                : String(setting.parsed_value ?? setting.value ?? ''),
            value_type: setting.value_type || 'string',
            category: setting.category || 'general',
            description: setting.description || '',
            is_public: Boolean(setting.is_public)
        });
        setShowForm(true);
    };

    const closeForm = () => {
        if (saving) return;
        setShowForm(false);
        setEditing(null);
        setFormData(emptyForm);
    };

    const setValue = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.key.trim()) {
            alert('Setting key wajib diisi');
            return;
        }
        setSaving(true);
        try {
            const payload = {
                value: encodeSettingValue(formData.value, formData.value_type),
                value_type: formData.value_type,
                category: formData.category || 'general',
                description: formData.description,
                is_public: Boolean(formData.is_public)
            };

            await apiService.updateAdminSetting(formData.key.trim(), payload);
            closeForm();
            await fetchSettings();
        } catch (error) {
            console.error('Save setting failed:', error);
            alert(error.message || 'Gagal menyimpan setting');
        } finally {
            setSaving(false);
        }
    };

    const deleteSetting = async (key) => {
        if (!window.confirm(`Hapus setting ${key}?`)) return;
        try {
            await apiService.deleteAdminSetting(key);
            setSettings((prev) => prev.filter((item) => item.key !== key));
        } catch (error) {
            console.error('Delete setting failed:', error);
            alert(error.message || 'Gagal menghapus setting');
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-body)' }}>Loading settings...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-headline)', fontFamily: 'var(--font-serif)' }}>
                    Settings Management
                </h2>
                <button
                    onClick={openCreate}
                    style={{
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        background: 'var(--primary-color)',
                        color: '#fff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    <Plus size={16} />
                    Add Setting
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px', gap: '10px', marginBottom: '16px' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-body)' }} />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search setting key/description"
                        style={{ ...fieldStyle, paddingLeft: '38px' }}
                    />
                </div>
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} style={fieldStyle}>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ ...cardStyle, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Key</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Value</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Type</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Category</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Public</th>
                            <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSettings.map((setting) => (
                            <tr key={setting.key}>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', color: 'var(--text-headline)', fontWeight: 600 }}>
                                    {setting.key}
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', color: 'var(--text-body)', fontSize: '0.85rem' }}>
                                    {String(setting.parsed_value ?? setting.value ?? '').slice(0, 70)}
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', color: 'var(--text-body)' }}>
                                    {setting.value_type}
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', color: 'var(--text-body)' }}>
                                    {setting.category || 'general'}
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', color: 'var(--text-body)' }}>
                                    {setting.is_public ? 'yes' : 'no'}
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                                        <button
                                            onClick={() => openEdit(setting)}
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
                                            onClick={() => deleteSetting(setting.key)}
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

            {filteredSettings.length === 0 && (
                <p style={{ marginTop: '16px', textAlign: 'center', color: 'var(--text-body)' }}>Tidak ada setting.</p>
            )}

            {showForm && (
                <div style={overlayStyle}>
                    <div style={{ ...cardStyle, width: '100%', maxWidth: '760px', padding: '20px' }}>
                        <h3 style={{ marginBottom: '12px', color: 'var(--text-headline)', fontFamily: 'var(--font-serif)' }}>
                            {editing ? 'Edit Setting' : 'Create Setting'}
                        </h3>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
                            <input
                                required
                                value={formData.key}
                                onChange={(event) => setValue('key', event.target.value)}
                                placeholder="setting.key"
                                style={fieldStyle}
                                disabled={Boolean(editing)}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px 180px', gap: '10px' }}>
                                <input value={formData.category} onChange={(event) => setValue('category', event.target.value)} placeholder="category" style={fieldStyle} />
                                <select value={formData.value_type} onChange={(event) => setValue('value_type', event.target.value)} style={fieldStyle}>
                                    <option value="string">string</option>
                                    <option value="number">number</option>
                                    <option value="boolean">boolean</option>
                                    <option value="json">json</option>
                                </select>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-body)', fontSize: '0.9rem' }}>
                                    <input type="checkbox" checked={Boolean(formData.is_public)} onChange={(event) => setValue('is_public', event.target.checked)} />
                                    Public
                                </label>
                            </div>
                            {formData.value_type === 'json' ? (
                                <textarea
                                    value={formData.value}
                                    onChange={(event) => setValue('value', event.target.value)}
                                    placeholder='{"example":"value"}'
                                    rows={8}
                                    style={fieldStyle}
                                />
                            ) : formData.value_type === 'boolean' ? (
                                <select value={String(formData.value)} onChange={(event) => setValue('value', event.target.value === 'true')} style={fieldStyle}>
                                    <option value="true">true</option>
                                    <option value="false">false</option>
                                </select>
                            ) : (
                                <input
                                    value={formData.value}
                                    onChange={(event) => setValue('value', event.target.value)}
                                    placeholder="value"
                                    style={fieldStyle}
                                />
                            )}
                            <input value={formData.description} onChange={(event) => setValue('description', event.target.value)} placeholder="description" style={fieldStyle} />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    style={{
                                        border: '1px solid rgba(157,90,118,0.25)',
                                        borderRadius: '9px',
                                        padding: '9px 14px',
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
                                        border: 'none',
                                        borderRadius: '9px',
                                        padding: '9px 14px',
                                        background: 'var(--primary-color)',
                                        color: '#fff',
                                        cursor: saving ? 'not-allowed' : 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Setting'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsManagement;
