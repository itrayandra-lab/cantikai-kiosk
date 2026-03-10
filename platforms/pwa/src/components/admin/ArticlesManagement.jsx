import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import apiService from '../../services/api';

const emptyForm = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    featured_image: '',
    image_base64: '',
    tags: '',
    status: 'draft',
    is_featured: false
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

const makeSlug = (text) => String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
    reader.readAsDataURL(file);
});

const ArticlesManagement = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [selectedImageName, setSelectedImageName] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchArticles = async () => {
        try {
            const data = await apiService.getAdminArticles();
            setArticles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Fetch articles failed:', error);
            alert(error.message || 'Gagal memuat article');
            setArticles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const filteredArticles = useMemo(() => {
        const term = search.toLowerCase();
        return articles.filter((article) => {
            const articleStatus = article.status || 'published';
            const matchStatus = status === 'all' || articleStatus === status;
            const content = `${article.title || ''} ${article.category || ''} ${article.slug || ''}`.toLowerCase();
            return matchStatus && content.includes(term);
        });
    }, [articles, search, status]);

    const openCreate = () => {
        setEditingArticle(null);
        setFormData(emptyForm);
        setSelectedImageName('');
        setShowForm(true);
    };

    const openEdit = (article) => {
        setEditingArticle(article);
        setFormData({
            title: article.title || '',
            slug: article.slug || '',
            excerpt: article.excerpt || '',
            content: article.content || '',
            category: article.category || '',
            featured_image: article.image_url || article.featured_image || '',
            image_base64: '',
            tags: article.tags || '',
            status: article.status || 'published',
            is_featured: Boolean(article.is_featured)
        });
        setSelectedImageName('');
        setShowForm(true);
    };

    const closeForm = () => {
        if (saving) return;
        setShowForm(false);
        setEditingArticle(null);
        setFormData(emptyForm);
        setSelectedImageName('');
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
                featured_image: ''
            }));
            setSelectedImageName(file.name);
        } catch (error) {
            console.error('Read image file failed:', error);
            alert(error.message || 'Gagal memproses file gambar');
        } finally {
            event.target.value = '';
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.title.trim()) {
            alert('Judul wajib diisi');
            return;
        }

        setSaving(true);
        try {
            const imageUrl = formData.image_base64 ? '' : String(formData.featured_image || '').trim();
            const payload = {
                title: formData.title.trim(),
                slug: formData.slug.trim() || makeSlug(formData.title),
                excerpt: formData.excerpt,
                content: formData.content,
                category: formData.category,
                featured_image: imageUrl,
                image_url: imageUrl,
                image_base64: formData.image_base64 || undefined,
                tags: formData.tags,
                status: formData.status,
                is_featured: Boolean(formData.is_featured)
            };

            if (editingArticle) {
                await apiService.updateArticle(editingArticle.id, payload);
            } else {
                await apiService.createArticle(payload);
            }

            closeForm();
            await fetchArticles();
        } catch (error) {
            console.error('Save article failed:', error);
            alert(error.message || 'Gagal menyimpan article');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (articleId) => {
        if (!window.confirm('Hapus article ini?')) return;
        try {
            await apiService.deleteArticle(articleId);
            setArticles((prev) => prev.filter((item) => item.id !== articleId));
        } catch (error) {
            console.error('Delete article failed:', error);
            alert(error.message || 'Gagal menghapus article');
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-body)' }}>Loading articles...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-headline)', fontFamily: 'var(--font-serif)' }}>
                    Articles Management
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
                    New Article
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px', gap: '10px', marginBottom: '16px' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-body)' }} />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari article title/category"
                        style={{ ...fieldStyle, paddingLeft: '38px' }}
                    />
                </div>
                <select value={status} onChange={(event) => setStatus(event.target.value)} style={fieldStyle}>
                    <option value="all">all</option>
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                    <option value="archived">archived</option>
                </select>
            </div>

            <div style={{ ...cardStyle, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Preview</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Title</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Slug</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Status</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Category</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Updated</th>
                            <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid rgba(157,90,118,0.15)' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredArticles.map((article) => {
                            const previewSource = apiService.resolveMediaUrl(article.image_url || article.featured_image);
                            return (
                            <tr key={article.id}>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)' }}>
                                    {previewSource ? (
                                        <img
                                            src={previewSource}
                                            alt={article.title}
                                            style={{ width: '96px', height: '56px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(157,90,118,0.15)' }}
                                            onError={(event) => {
                                                event.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div style={{ width: '96px', height: '56px', borderRadius: '10px', border: '1px solid rgba(157,90,118,0.15)', background: 'rgba(157,90,118,0.07)' }} />
                                    )}
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', color: 'var(--text-headline)' }}>
                                    <div style={{ fontWeight: 600 }}>{article.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-body)' }}>{(article.excerpt || '').slice(0, 70) || '-'}</div>
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', color: 'var(--text-body)', fontSize: '0.85rem' }}>{article.slug || '-'}</td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)' }}>
                                    <span style={{ padding: '4px 8px', borderRadius: '999px', background: 'rgba(157, 90, 118, 0.12)', color: 'var(--primary-color)', fontSize: '0.75rem' }}>
                                        {article.status || 'published'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', color: 'var(--text-body)' }}>{article.category || '-'}</td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', color: 'var(--text-body)' }}>
                                    {new Date(article.updated_at || article.created_at).toLocaleString('id-ID')}
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid rgba(157,90,118,0.08)', textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                                        <button
                                            onClick={() => openEdit(article)}
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
                                            onClick={() => handleDelete(article.id)}
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
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <p style={{ marginTop: '12px', color: 'var(--text-body)', fontSize: '0.85rem' }}>
                Showing {filteredArticles.length} of {articles.length} articles
            </p>

            {showForm && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...cardStyle, width: '100%', maxWidth: '760px', padding: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ color: 'var(--text-headline)', fontFamily: 'var(--font-serif)', marginBottom: '12px' }}>
                            {editingArticle ? 'Edit Article' : 'Create Article'}
                        </h3>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
                            <input
                                required
                                value={formData.title}
                                onChange={(event) => {
                                    const nextTitle = event.target.value;
                                    setFormData((prev) => ({
                                        ...prev,
                                        title: nextTitle,
                                        slug: editingArticle ? prev.slug : makeSlug(nextTitle)
                                    }));
                                }}
                                placeholder="Title"
                                style={fieldStyle}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input value={formData.slug} onChange={(event) => setValue('slug', makeSlug(event.target.value))} placeholder="slug" style={fieldStyle} />
                                <input value={formData.category} onChange={(event) => setValue('category', event.target.value)} placeholder="category" style={fieldStyle} />
                            </div>
                            <input
                                value={formData.featured_image}
                                onChange={(event) => {
                                    const nextValue = event.target.value;
                                    setFormData((prev) => ({
                                        ...prev,
                                        featured_image: nextValue,
                                        image_base64: nextValue.trim() ? '' : prev.image_base64
                                    }));
                                    if (nextValue.trim()) {
                                        setSelectedImageName('');
                                    }
                                }}
                                placeholder="Featured image URL"
                                style={fieldStyle}
                            />
                            <div style={{ display: 'grid', gap: '8px' }}>
                                <label style={{ fontSize: '0.84rem', color: 'var(--text-body)' }}>
                                    Upload gambar (opsional, maks 5MB)
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
                            {(formData.image_base64 || formData.featured_image) ? (
                                <div style={{ border: '1px dashed rgba(157,90,118,0.3)', borderRadius: '12px', padding: '10px', background: 'rgba(255,255,255,0.55)' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-body)', marginBottom: '8px' }}>Preview gambar</div>
                                    <img
                                        src={formData.image_base64 || apiService.resolveMediaUrl(formData.featured_image)}
                                        alt="Preview artikel"
                                        style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '10px' }}
                                        onError={(event) => {
                                            event.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            ) : null}
                            <textarea value={formData.excerpt} onChange={(event) => setValue('excerpt', event.target.value)} placeholder="Excerpt" rows={2} style={fieldStyle} />
                            <textarea value={formData.content} onChange={(event) => setValue('content', event.target.value)} placeholder="Content" rows={8} style={fieldStyle} />
                            <input value={formData.tags} onChange={(event) => setValue('tags', event.target.value)} placeholder="tags (comma separated)" style={fieldStyle} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <select value={formData.status} onChange={(event) => setValue('status', event.target.value)} style={fieldStyle}>
                                    <option value="draft">draft</option>
                                    <option value="published">published</option>
                                    <option value="archived">archived</option>
                                </select>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-body)', fontSize: '0.9rem' }}>
                                    <input type="checkbox" checked={Boolean(formData.is_featured)} onChange={(event) => setValue('is_featured', event.target.checked)} />
                                    Featured article
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
                                    {saving ? 'Saving...' : editingArticle ? 'Save Changes' : 'Create Article'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArticlesManagement;
