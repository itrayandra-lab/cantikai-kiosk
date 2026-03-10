import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import apiService from '../../services/api';

const emptyForm = {
    title: '',
    description: '',
    image_url: '',
    image_base64: '',
    link_url: '',
    link_text: '',
    order: 0,
    is_active: true
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

const modalOverlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(30, 20, 26, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
};

const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
    reader.readAsDataURL(file);
});

const BannersManagement = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [selectedImageName, setSelectedImageName] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchBanners = async () => {
        try {
            const data = await apiService.getAdminBanners();
            setBanners(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Fetch banners failed:', error);
            alert(error.message || 'Gagal memuat banners');
            setBanners([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const closeForm = () => {
        if (saving) return;
        setShowForm(false);
        setEditingBanner(null);
        setFormData(emptyForm);
        setSelectedImageName('');
    };

    const openCreate = () => {
        setEditingBanner(null);
        setFormData(emptyForm);
        setSelectedImageName('');
        setShowForm(true);
    };

    const openEdit = (banner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title || '',
            description: banner.description || '',
            image_url: banner.image_url || '',
            image_base64: '',
            link_url: banner.link_url || '',
            link_text: banner.link_text || '',
            order: banner.display_order ?? banner.order ?? 0,
            is_active: Boolean(banner.is_active)
        });
        setSelectedImageName('');
        setShowForm(true);
    };

    const setValue = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

    const handleImageFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('File harus berupa gambar (jpg/png/webp)');
            event.target.value = '';
            return;
        }

        if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
            alert('Ukuran gambar maksimal 5MB');
            event.target.value = '';
            return;
        }

        try {
            const dataUrl = await readFileAsDataUrl(file);
            setFormData((prev) => ({
                ...prev,
                image_base64: dataUrl,
                image_url: ''
            }));
            setSelectedImageName(file.name);
        } catch (error) {
            console.error('Read banner image failed:', error);
            alert(error.message || 'Gagal memproses file gambar');
        } finally {
            event.target.value = '';
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.title.trim() || (!formData.image_url.trim() && !formData.image_base64)) {
            alert('Title dan image (URL atau upload) wajib diisi');
            return;
        }
        setSaving(true);
        try {
            const imageUrl = formData.image_base64 ? '' : String(formData.image_url || '').trim();
            const payload = {
                title: formData.title.trim(),
                description: formData.description,
                image_url: imageUrl,
                image_base64: formData.image_base64 || undefined,
                link_url: formData.link_url,
                link_text: formData.link_text,
                order: Number(formData.order || 0),
                display_order: Number(formData.order || 0),
                is_active: Boolean(formData.is_active)
            };

            if (editingBanner) {
                await apiService.updateBanner(editingBanner.id, payload);
            } else {
                await apiService.createBanner(payload);
            }

            closeForm();
            await fetchBanners();
        } catch (error) {
            console.error('Save banner failed:', error);
            alert(error.message || 'Gagal menyimpan banner');
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (banner) => {
        try {
            await apiService.updateBanner(banner.id, { is_active: !banner.is_active });
            setBanners((prev) => prev.map((item) => (
                item.id === banner.id ? { ...item, is_active: !item.is_active } : item
            )));
        } catch (error) {
            alert(error.message || 'Gagal update status banner');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus banner ini?')) return;
        try {
            await apiService.deleteBanner(id);
            setBanners((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            alert(error.message || 'Gagal menghapus banner');
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-body)' }}>Loading banners...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-headline)', fontFamily: 'var(--font-serif)' }}>
                    Banners Management
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
                    Add Banner
                </button>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
                {banners.map((banner) => {
                    const imageSrc = apiService.resolveMediaUrl(banner.image_url);
                    return (
                    <div key={banner.id} style={{ ...cardStyle, overflow: 'hidden', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '0' }}>
                        <div
                            style={{
                                minHeight: '150px',
                                background: 'rgba(157, 90, 118, 0.08)',
                                position: 'relative'
                            }}
                        >
                            {imageSrc ? (
                                <img
                                    src={imageSrc}
                                    alt={banner.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(event) => {
                                        event.currentTarget.style.display = 'none';
                                    }}
                                />
                            ) : null}
                        </div>
                        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                    <h3 style={{ fontSize: '1rem', color: 'var(--text-headline)', fontFamily: 'var(--font-sans)' }}>
                                        {banner.title}
                                    </h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-body)' }}>
                                        order: {banner.display_order ?? banner.order ?? 0}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', marginTop: '6px' }}>
                                    {banner.description || '-'}
                                </p>
                                {banner.link_url && (
                                    <p style={{ marginTop: '6px', fontSize: '0.8rem', color: 'var(--primary-color)' }}>
                                        {banner.link_text || banner.link_url}
                                    </p>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{
                                    padding: '4px 10px',
                                    borderRadius: '999px',
                                    background: banner.is_active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                                    color: banner.is_active ? '#15803d' : 'var(--error-color)',
                                    fontSize: '0.75rem'
                                }}>
                                    {banner.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <div style={{ display: 'inline-flex', gap: '8px' }}>
                                    <button
                                        onClick={() => handleToggle(banner)}
                                        style={{
                                            border: '1px solid rgba(157,90,118,0.25)',
                                            borderRadius: '8px',
                                            background: 'rgba(157,90,118,0.1)',
                                            color: 'var(--primary-color)',
                                            padding: '6px 10px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {banner.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                    <button
                                        onClick={() => openEdit(banner)}
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
                                        onClick={() => handleDelete(banner.id)}
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
                            </div>
                        </div>
                    </div>
                    );
                })}
            </div>

            {banners.length === 0 && (
                <p style={{ marginTop: '16px', textAlign: 'center', color: 'var(--text-body)' }}>Tidak ada banner.</p>
            )}

            {showForm && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...cardStyle, width: '100%', maxWidth: '680px', padding: '20px' }}>
                        <h3 style={{ marginBottom: '12px', color: 'var(--text-headline)', fontFamily: 'var(--font-serif)' }}>
                            {editingBanner ? 'Edit Banner' : 'Create Banner'}
                        </h3>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
                            <input required value={formData.title} onChange={(event) => setValue('title', event.target.value)} placeholder="Title" style={fieldStyle} />
                            <input
                                value={formData.image_url}
                                onChange={(event) => {
                                    const nextValue = event.target.value;
                                    setFormData((prev) => ({
                                        ...prev,
                                        image_url: nextValue,
                                        image_base64: nextValue.trim() ? '' : prev.image_base64
                                    }));
                                    if (nextValue.trim()) {
                                        setSelectedImageName('');
                                    }
                                }}
                                placeholder="Image URL"
                                style={fieldStyle}
                            />
                            <div style={{ display: 'grid', gap: '8px' }}>
                                <label style={{ fontSize: '0.84rem', color: 'var(--text-body)' }}>
                                    Upload gambar banner (opsional, maks 5MB)
                                </label>
                                <input type="file" accept="image/*" onChange={handleImageFileChange} style={fieldStyle} />
                                {selectedImageName ? (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>
                                        File dipilih: {selectedImageName}
                                    </div>
                                ) : null}
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-body)' }}>
                                    Jika upload dipilih, URL gambar akan diabaikan.
                                </div>
                            </div>
                            {(formData.image_base64 || formData.image_url) ? (
                                <div style={{ border: '1px dashed rgba(157,90,118,0.3)', borderRadius: '12px', padding: '10px', background: 'rgba(255,255,255,0.55)' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-body)', marginBottom: '8px' }}>Preview gambar banner</div>
                                    <img
                                        src={formData.image_base64 || apiService.resolveMediaUrl(formData.image_url)}
                                        alt="Preview banner"
                                        style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '10px' }}
                                        onError={(event) => {
                                            event.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            ) : null}
                            <textarea value={formData.description} onChange={(event) => setValue('description', event.target.value)} placeholder="Description" rows={3} style={fieldStyle} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input value={formData.link_url} onChange={(event) => setValue('link_url', event.target.value)} placeholder="Link URL" style={fieldStyle} />
                                <input value={formData.link_text} onChange={(event) => setValue('link_text', event.target.value)} placeholder="Link text" style={fieldStyle} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '10px' }}>
                                <input type="number" value={formData.order} onChange={(event) => setValue('order', event.target.value)} placeholder="Order" style={fieldStyle} />
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-body)', fontSize: '0.9rem' }}>
                                    <input type="checkbox" checked={Boolean(formData.is_active)} onChange={(event) => setValue('is_active', event.target.checked)} />
                                    Active banner
                                </label>
                            </div>
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
                                    {saving ? 'Saving...' : editingBanner ? 'Save Changes' : 'Create Banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BannersManagement;
