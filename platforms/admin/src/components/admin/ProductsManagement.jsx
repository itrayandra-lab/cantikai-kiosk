import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import apiService from '../../services/api';

const emptyForm = {
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    image_url: '',
    image_base64: '',
    ingredients: '',
    skin_type: '',
    concerns: '',
    rating: 0,
    is_active: true,
    is_featured: false
};

const fieldStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid rgba(157, 90, 118, 0.25)',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.75)',
    fontFamily: 'var(--font-sans)',
    outline: 'none'
};

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(30,20,26,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
};

const cardStyle = {
    background: 'rgba(255,255,255,0.8)',
    borderRadius: '18px',
    border: '1px solid rgba(255,255,255,0.95)',
    boxShadow: '0 10px 30px rgba(89,54,69,0.08)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)'
};

const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
    reader.readAsDataURL(file);
});

const ProductsManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [selectedImageName, setSelectedImageName] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchProducts = async () => {
        try {
            const data = await apiService.getAdminProducts();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Fetch products failed:', error);
            alert(error.message || 'Gagal memuat products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const categories = useMemo(() => {
        const unique = Array.from(new Set(products.map((item) => item.category).filter(Boolean)));
        return ['all', ...unique];
    }, [products]);

    const filteredProducts = useMemo(() => {
        const term = search.toLowerCase();
        return products.filter((product) => {
            const matchCategory = category === 'all' || product.category === category;
            const content = `${product.name || ''} ${product.brand || ''} ${product.category || ''}`.toLowerCase();
            return matchCategory && content.includes(term);
        });
    }, [products, search, category]);

    const openCreate = () => {
        setEditingProduct(null);
        setFormData(emptyForm);
        setSelectedImageName('');
        setShowForm(true);
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            brand: product.brand || '',
            category: product.category || '',
            description: product.description || '',
            price: product.price || '',
            image_url: product.image_url || '',
            image_base64: '',
            ingredients: product.ingredients || '',
            skin_type: product.skin_type || '',
            concerns: product.concerns || '',
            rating: product.rating || 0,
            is_active: Boolean(product.is_active),
            is_featured: Boolean(product.is_featured)
        });
        setSelectedImageName('');
        setShowForm(true);
    };

    const closeForm = () => {
        if (saving) return;
        setShowForm(false);
        setEditingProduct(null);
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
                image_url: ''
            }));
            setSelectedImageName(file.name);
        } catch (error) {
            console.error('Read product image failed:', error);
            alert(error.message || 'Gagal memproses file gambar');
        } finally {
            event.target.value = '';
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.name.trim()) {
            alert('Nama produk wajib diisi');
            return;
        }
        setSaving(true);
        try {
            const imageUrl = formData.image_base64 ? '' : String(formData.image_url || '').trim();
            const payload = {
                name: formData.name.trim(),
                brand: formData.brand,
                category: formData.category,
                description: formData.description,
                price: Number(formData.price || 0),
                image_url: imageUrl,
                image_base64: formData.image_base64 || undefined,
                ingredients: formData.ingredients,
                skin_type: formData.skin_type,
                concerns: formData.concerns,
                rating: Number(formData.rating || 0),
                is_active: Boolean(formData.is_active),
                is_featured: Boolean(formData.is_featured)
            };

            if (editingProduct) {
                await apiService.updateProduct(editingProduct.id, payload);
            } else {
                await apiService.createProduct(payload);
            }

            closeForm();
            await fetchProducts();
        } catch (error) {
            console.error('Save product failed:', error);
            alert(error.message || 'Gagal menyimpan product');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActive = async (product) => {
        try {
            await apiService.updateProduct(product.id, { is_active: !product.is_active });
            setProducts((prev) => prev.map((item) => (
                item.id === product.id ? { ...item, is_active: !item.is_active } : item
            )));
        } catch (error) {
            alert(error.message || 'Gagal mengubah status product');
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Hapus product ini?')) return;
        try {
            await apiService.deleteProduct(productId);
            setProducts((prev) => prev.filter((item) => item.id !== productId));
        } catch (error) {
            alert(error.message || 'Gagal menghapus product');
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-body)' }}>Loading products...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ color: 'var(--text-headline)', fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>
                    Products Management
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
                    Add Product
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px', gap: '10px', marginBottom: '16px' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-body)' }} />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search product name / brand"
                        style={{ ...fieldStyle, paddingLeft: '38px' }}
                    />
                </div>
                <select value={category} onChange={(event) => setCategory(event.target.value)} style={fieldStyle}>
                    {categories.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
                {filteredProducts.map((product) => {
                    const imageSrc = apiService.resolveMediaUrl(product.image_url);
                    return (
                    <div key={product.id} style={{ ...cardStyle, overflow: 'hidden' }}>
                        <div
                            style={{
                                height: '160px',
                                background: 'rgba(157, 90, 118, 0.08)',
                                position: 'relative'
                            }}
                        >
                            {imageSrc ? (
                                <img
                                    src={imageSrc}
                                    alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(event) => {
                                        event.currentTarget.style.display = 'none';
                                    }}
                                />
                            ) : null}
                        </div>
                        <div style={{ padding: '14px' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-body)', marginBottom: '4px' }}>{product.brand || '-'}</p>
                            <h3 style={{ fontSize: '1rem', color: 'var(--text-headline)', marginBottom: '6px', fontFamily: 'var(--font-sans)' }}>
                                {product.name}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 700, marginBottom: '8px' }}>
                                Rp {Number(product.price || 0).toLocaleString('id-ID')}
                            </p>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                <span style={{ fontSize: '0.75rem', background: 'rgba(157, 90, 118, 0.1)', borderRadius: '999px', padding: '4px 8px', color: 'var(--primary-color)' }}>
                                    {product.category || 'uncategorized'}
                                </span>
                                {!product.is_active && (
                                    <span style={{ fontSize: '0.75rem', background: 'rgba(239,68,68,0.12)', borderRadius: '999px', padding: '4px 8px', color: 'var(--error-color)' }}>
                                        Inactive
                                    </span>
                                )}
                                {product.is_featured && (
                                    <span style={{ fontSize: '0.75rem', background: 'rgba(56,189,248,0.15)', borderRadius: '999px', padding: '4px 8px', color: '#0284c7' }}>
                                        Featured
                                    </span>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '8px' }}>
                                <button
                                    onClick={() => handleToggleActive(product)}
                                    style={{
                                        border: 'none',
                                        borderRadius: '8px',
                                        background: product.is_active ? 'rgba(157, 90, 118, 0.1)' : 'var(--success-color)',
                                        color: product.is_active ? 'var(--text-body)' : '#fff',
                                        padding: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    {product.is_active ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                    onClick={() => openEdit(product)}
                                    style={{
                                        border: '1px solid rgba(157, 90, 118, 0.25)',
                                        borderRadius: '8px',
                                        background: 'rgba(157, 90, 118, 0.1)',
                                        color: 'var(--primary-color)',
                                        padding: '8px 10px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    style={{
                                        border: '1px solid rgba(239,68,68,0.3)',
                                        borderRadius: '8px',
                                        background: 'rgba(239,68,68,0.1)',
                                        color: 'var(--error-color)',
                                        padding: '8px 10px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                    );
                })}
            </div>

            {filteredProducts.length === 0 && (
                <p style={{ marginTop: '20px', color: 'var(--text-body)', textAlign: 'center' }}>Tidak ada product.</p>
            )}

            {showForm && (
                <div style={overlayStyle}>
                    <div style={{ ...cardStyle, width: '100%', maxWidth: '760px', padding: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '12px', color: 'var(--text-headline)' }}>
                            {editingProduct ? 'Edit Product' : 'Create Product'}
                        </h3>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input required value={formData.name} onChange={(event) => setValue('name', event.target.value)} placeholder="Product name" style={fieldStyle} />
                                <input value={formData.brand} onChange={(event) => setValue('brand', event.target.value)} placeholder="Brand" style={fieldStyle} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                <input value={formData.category} onChange={(event) => setValue('category', event.target.value)} placeholder="Category" style={fieldStyle} />
                                <input type="number" value={formData.price} onChange={(event) => setValue('price', event.target.value)} placeholder="Price" style={fieldStyle} />
                                <input type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={(event) => setValue('rating', event.target.value)} placeholder="Rating" style={fieldStyle} />
                            </div>
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
                                    Upload gambar product (opsional, maks 5MB)
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
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-body)', marginBottom: '8px' }}>Preview gambar product</div>
                                    <img
                                        src={formData.image_base64 || apiService.resolveMediaUrl(formData.image_url)}
                                        alt="Preview product"
                                        style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '10px' }}
                                        onError={(event) => {
                                            event.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            ) : null}
                            <textarea value={formData.description} onChange={(event) => setValue('description', event.target.value)} placeholder="Description" rows={3} style={fieldStyle} />
                            <textarea value={formData.ingredients} onChange={(event) => setValue('ingredients', event.target.value)} placeholder="Ingredients" rows={2} style={fieldStyle} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input value={formData.skin_type} onChange={(event) => setValue('skin_type', event.target.value)} placeholder="Skin type target" style={fieldStyle} />
                                <input value={formData.concerns} onChange={(event) => setValue('concerns', event.target.value)} placeholder="Concerns" style={fieldStyle} />
                            </div>
                            <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-body)' }}>
                                    <input type="checkbox" checked={Boolean(formData.is_active)} onChange={(event) => setValue('is_active', event.target.checked)} />
                                    Active
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-body)' }}>
                                    <input type="checkbox" checked={Boolean(formData.is_featured)} onChange={(event) => setValue('is_featured', event.target.checked)} />
                                    Featured
                                </label>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    style={{
                                        border: '1px solid rgba(157, 90, 118, 0.25)',
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
                                    {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsManagement;
