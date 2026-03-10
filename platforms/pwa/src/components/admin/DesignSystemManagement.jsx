import React, { useEffect, useState } from 'react';
import apiService from '../../services/api';

const defaultValues = {
    app_name: 'Cantik AI Skin Analyzer',
    app_tagline: 'cantik.ai asisten kulit sehatmu',
    primary_color: '#9d5a76',
    primary_hover: '#8c4f69',
    primary_light: '#c084a0',
    allow_guest: true,
    enable_google_login: true
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

const DesignSystemManagement = () => {
    const [values, setValues] = useState(defaultValues);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchDesignSettings = async () => {
            try {
                const response = await apiService.getAdminSettings();
                const map = response?.map || {};
                setValues({
                    app_name: map['app.name'] || defaultValues.app_name,
                    app_tagline: map['app.tagline'] || defaultValues.app_tagline,
                    primary_color: map['theme.primary_color'] || defaultValues.primary_color,
                    primary_hover: map['theme.primary_hover'] || defaultValues.primary_hover,
                    primary_light: map['theme.primary_light'] || defaultValues.primary_light,
                    allow_guest: map['feature.allow_guest'] ?? defaultValues.allow_guest,
                    enable_google_login: map['feature.enable_google_login'] ?? defaultValues.enable_google_login
                });
            } catch (error) {
                console.error('Fetch design settings failed:', error);
                alert(error.message || 'Gagal memuat design settings');
            } finally {
                setLoading(false);
            }
        };

        fetchDesignSettings();
    }, []);

    const setValue = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

    const saveSettings = async () => {
        setSaving(true);
        try {
            await apiService.bulkUpdateAdminSettings([
                {
                    key: 'app.name',
                    value: values.app_name,
                    value_type: 'string',
                    category: 'general',
                    is_public: true,
                    description: 'Nama aplikasi'
                },
                {
                    key: 'app.tagline',
                    value: values.app_tagline,
                    value_type: 'string',
                    category: 'general',
                    is_public: true,
                    description: 'Tagline aplikasi'
                },
                {
                    key: 'theme.primary_color',
                    value: values.primary_color,
                    value_type: 'string',
                    category: 'design',
                    is_public: true,
                    description: 'Warna utama UI'
                },
                {
                    key: 'theme.primary_hover',
                    value: values.primary_hover,
                    value_type: 'string',
                    category: 'design',
                    is_public: true,
                    description: 'Warna hover UI'
                },
                {
                    key: 'theme.primary_light',
                    value: values.primary_light,
                    value_type: 'string',
                    category: 'design',
                    is_public: true,
                    description: 'Warna light UI'
                },
                {
                    key: 'feature.allow_guest',
                    value: values.allow_guest,
                    value_type: 'boolean',
                    category: 'feature',
                    is_public: true,
                    description: 'Izin mode guest'
                },
                {
                    key: 'feature.enable_google_login',
                    value: values.enable_google_login,
                    value_type: 'boolean',
                    category: 'feature',
                    is_public: true,
                    description: 'Izin tombol login Google'
                }
            ]);

            alert('Design system settings tersimpan');
        } catch (error) {
            console.error('Save design settings failed:', error);
            alert(error.message || 'Gagal menyimpan design system settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-body)' }}>Loading design settings...</div>;
    }

    return (
        <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ ...cardStyle, padding: '18px' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-headline)', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>
                    Design System
                </h2>
                <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', marginBottom: '12px' }}>
                    Atur tema dan pengaturan visual PWA langsung dari admin.
                </p>

                <div style={{ display: 'grid', gap: '10px' }}>
                    <input value={values.app_name} onChange={(event) => setValue('app_name', event.target.value)} placeholder="App name" style={fieldStyle} />
                    <input value={values.app_tagline} onChange={(event) => setValue('app_tagline', event.target.value)} placeholder="App tagline" style={fieldStyle} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-body)', marginBottom: '6px' }}>Primary</label>
                            <input type="color" value={values.primary_color} onChange={(event) => setValue('primary_color', event.target.value)} style={{ ...fieldStyle, height: '42px', padding: '6px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-body)', marginBottom: '6px' }}>Primary Hover</label>
                            <input type="color" value={values.primary_hover} onChange={(event) => setValue('primary_hover', event.target.value)} style={{ ...fieldStyle, height: '42px', padding: '6px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-body)', marginBottom: '6px' }}>Primary Light</label>
                            <input type="color" value={values.primary_light} onChange={(event) => setValue('primary_light', event.target.value)} style={{ ...fieldStyle, height: '42px', padding: '6px' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <label style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-body)', fontSize: '0.9rem' }}>
                            <input type="checkbox" checked={Boolean(values.allow_guest)} onChange={(event) => setValue('allow_guest', event.target.checked)} />
                            Allow guest mode
                        </label>
                        <label style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-body)', fontSize: '0.9rem' }}>
                            <input type="checkbox" checked={Boolean(values.enable_google_login)} onChange={(event) => setValue('enable_google_login', event.target.checked)} />
                            Enable Google Login
                        </label>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                    <button
                        onClick={saveSettings}
                        disabled={saving}
                        style={{
                            border: 'none',
                            borderRadius: '9px',
                            padding: '10px 14px',
                            background: 'var(--primary-color)',
                            color: '#fff',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            fontWeight: 600
                        }}
                    >
                        {saving ? 'Saving...' : 'Save Design Settings'}
                    </button>
                </div>
            </div>

            <div style={{ ...cardStyle, padding: '18px' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-headline)', fontFamily: 'var(--font-serif)', marginBottom: '10px' }}>
                    Live Preview
                </h3>
                <div
                    style={{
                        borderRadius: '14px',
                        padding: '18px',
                        border: '1px solid rgba(157, 90, 118, 0.15)',
                        background: `linear-gradient(135deg, ${values.primary_light}40, #ffffff)`
                    }}
                >
                    <h4 style={{ marginBottom: '6px', color: values.primary_color, fontFamily: 'var(--font-serif)' }}>
                        {values.app_name}
                    </h4>
                    <p style={{ marginBottom: '12px', color: 'var(--text-body)', fontSize: '0.9rem' }}>{values.app_tagline}</p>
                    <button
                        style={{
                            border: 'none',
                            borderRadius: '999px',
                            padding: '8px 14px',
                            color: '#fff',
                            background: `linear-gradient(135deg, ${values.primary_color}, ${values.primary_hover})`,
                            fontWeight: 600
                        }}
                    >
                        Preview Button
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DesignSystemManagement;
