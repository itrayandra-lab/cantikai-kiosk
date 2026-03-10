import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, Tag, Star, Droplets, ShoppingBag, ShieldCheck, AlertTriangle } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import apiService from '../services/api';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80';

const toList = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    return String(value)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
};

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await apiService.getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error('Get product detail error:', err);
                setError(err.message || 'Gagal memuat detail produk');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const recommendationReason = String(state?.recommendationReason || '').trim();
    const ingredients = useMemo(() => toList(product?.ingredients), [product]);
    const concerns = useMemo(() => toList(product?.concerns), [product]);
    const skinTargets = useMemo(() => toList(product?.skin_type), [product]);
    const purchaseUrl = product?.purchase_url || product?.product_url || product?.link_url || '';
    const priceValue = Number(product?.price || 0);

    if (loading) {
        return (
            <div className="app-container">
                <div className="screen-content" style={{ padding: '28px 24px 140px' }}>
                    <p style={{ color: 'var(--text-body)', textAlign: 'center' }}>Memuat detail produk...</p>
                </div>
                <BottomNav />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="app-container">
                <div className="screen-content" style={{ padding: '28px 24px 140px' }}>
                    <button
                        onClick={() => navigate('/products')}
                        style={{ border: 'none', background: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--primary-color)', marginBottom: '18px' }}
                    >
                        <ArrowLeft size={18} /> Kembali ke Produk
                    </button>
                    <div className="card-glass" style={{ padding: '22px', textAlign: 'center' }}>
                        <AlertTriangle size={28} color="var(--primary-color)" style={{ marginBottom: '12px' }} />
                        <p style={{ color: 'var(--text-headline)', marginBottom: '8px', fontWeight: 600 }}>Produk tidak ditemukan</p>
                        <p style={{ color: 'var(--text-body)', fontSize: '0.9rem' }}>{error || 'ID produk tidak valid.'}</p>
                    </div>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="screen-content" style={{ padding: '24px', paddingBottom: '130px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ border: 'none', background: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--primary-color)', marginBottom: '16px' }}
                >
                    <ArrowLeft size={18} /> Kembali
                </button>

                <div className="card-glass" style={{ padding: '16px', marginBottom: '16px' }}>
                    <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', marginBottom: '14px', background: 'rgba(157, 90, 118, 0.08)', aspectRatio: '1.1' }}>
                        <img
                            src={apiService.resolveMediaUrl(product.image_url) || FALLBACK_IMAGE}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(event) => {
                                event.currentTarget.src = FALLBACK_IMAGE;
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                        {product.brand ? (
                            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '999px', background: 'rgba(157, 90, 118, 0.12)', color: 'var(--primary-color)', fontWeight: 600 }}>
                                {product.brand}
                            </span>
                        ) : null}
                        {product.category ? (
                            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '999px', background: 'rgba(89, 54, 69, 0.08)', color: 'var(--text-headline)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Tag size={12} /> {product.category}
                            </span>
                        ) : null}
                        {Boolean(product.is_featured) ? (
                            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.16)', color: '#92400e', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Star size={12} /> Featured
                            </span>
                        ) : null}
                    </div>

                    <h1 className="headline" style={{ fontSize: '1.55rem', marginBottom: '6px' }}>
                        {product.name}
                    </h1>
                    <p style={{ color: 'var(--primary-color)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
                        Rp {Number.isFinite(priceValue) ? priceValue.toLocaleString('id-ID') : '0'}
                    </p>
                    <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: 0 }}>
                        {product.description || 'Belum ada deskripsi detail untuk produk ini.'}
                    </p>
                </div>

                {recommendationReason ? (
                    <div className="card-glass" style={{ padding: '16px', marginBottom: '16px', background: 'linear-gradient(135deg, rgba(157, 90, 118, 0.14), rgba(241, 211, 226, 0.14))' }}>
                        <p style={{ fontSize: '0.82rem', color: 'var(--primary-color)', fontWeight: 700, marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <Sparkles size={14} />
                            Rekomendasi untuk Kondisi Kulit Anda
                        </p>
                        <p style={{ color: 'var(--text-headline)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                            {recommendationReason}
                        </p>
                    </div>
                ) : null}

                <div className="card-glass" style={{ padding: '16px', marginBottom: '16px' }}>
                    <h3 style={{ color: 'var(--text-headline)', fontSize: '1rem', marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-sans)' }}>
                        <ShieldCheck size={18} color="var(--primary-color)" />
                        Cocok untuk
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(skinTargets.length > 0 ? skinTargets : ['Semua jenis kulit']).map((target) => (
                            <span key={target} style={{ fontSize: '0.8rem', padding: '5px 10px', borderRadius: '999px', background: 'rgba(157, 90, 118, 0.1)', color: 'var(--primary-color)' }}>
                                {target}
                            </span>
                        ))}
                    </div>
                    {concerns.length > 0 ? (
                        <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {concerns.map((concern) => (
                                <span key={concern} style={{ fontSize: '0.8rem', padding: '5px 10px', borderRadius: '999px', background: 'rgba(89, 54, 69, 0.08)', color: 'var(--text-body)' }}>
                                    {concern}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>

                <div className="card-glass" style={{ padding: '16px', marginBottom: '16px' }}>
                    <h3 style={{ color: 'var(--text-headline)', fontSize: '1rem', marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-sans)' }}>
                        <Droplets size={18} color="var(--primary-color)" />
                        Kandungan Utama
                    </h3>
                    {ingredients.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {ingredients.map((item) => (
                                <div key={item} style={{ fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: 1.6, padding: '8px 10px', background: 'rgba(255,255,255,0.6)', borderRadius: '10px' }}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', margin: 0 }}>
                            Informasi kandungan belum tersedia.
                        </p>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                        onClick={() => {
                            if (purchaseUrl) {
                                window.open(purchaseUrl, '_blank', 'noopener,noreferrer');
                            }
                        }}
                        disabled={!purchaseUrl}
                        style={{
                            border: 'none',
                            borderRadius: '16px',
                            padding: '14px',
                            background: purchaseUrl ? 'linear-gradient(135deg, var(--primary-color), var(--primary-light))' : 'rgba(157,90,118,0.2)',
                            color: purchaseUrl ? 'white' : 'rgba(89,54,69,0.6)',
                            fontWeight: 600,
                            cursor: purchaseUrl ? 'pointer' : 'not-allowed',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <ShoppingBag size={16} />
                        {purchaseUrl ? 'Buka Halaman Pembelian' : 'Link pembelian belum tersedia'}
                    </button>
                    <button
                        onClick={() => navigate('/recommendations')}
                        style={{
                            border: '1px solid rgba(157,90,118,0.3)',
                            borderRadius: '16px',
                            padding: '12px',
                            background: 'rgba(255,255,255,0.6)',
                            color: 'var(--text-headline)',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Lihat Rekomendasi Lain
                    </button>
                </div>
            </div>
            <BottomNav />
        </div>
    );
};

export default ProductDetail;
