import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles, ShieldCheck, ShoppingBag } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import apiService from '../services/api';

const categoryAliases = {
    cleanser: ['cleanser', 'face wash', 'pembersih'],
    moisturizer: ['moisturizer', 'pelembap', 'cream'],
    serum: ['serum', 'essence'],
    sunscreen: ['sunscreen', 'sun screen', 'spf', 'uv'],
    treatment: ['treatment', 'spot', 'acne', 'retinol']
};

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const normalizeCategory = (value) => {
    const normalized = normalizeText(value);
    if (!normalized) return '';

    for (const [key, aliases] of Object.entries(categoryAliases)) {
        if (aliases.some((alias) => normalized.includes(alias))) {
            return key;
        }
    }
    return normalized;
};

const parseStoredJson = (key) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const buildSkinProfile = (resultData) => {
    const hydration = Number(
        resultData?.hydration_level ??
        resultData?.hydration?.hydration_level ??
        resultData?.hydration?.level ??
        75
    );
    const oiliness = Number(
        resultData?.oiliness_score ??
        resultData?.oiliness?.oiliness_score ??
        resultData?.oiliness?.sebum_score ??
        45
    );
    const acneSeverity = String(
        resultData?.acne_severity ??
        resultData?.acne?.severity ??
        'Rendah'
    );
    const pigmentation = Number(
        resultData?.pigmentation_score ??
        resultData?.pigmentation?.pigmentation_score ??
        resultData?.melanin_index ??
        40
    );

    return {
        skinType: String(resultData?.skin_type || 'Normal'),
        hydrationLevel: hydration,
        oilinessScore: oiliness,
        acneSeverity,
        pigmentationScore: pigmentation
    };
};

const buildTargets = (profile) => {
    const targets = [];

    targets.push({
        key: 'sunscreen',
        label: 'Perlindungan UV',
        reason: 'Sunscreen wajib dipakai setiap pagi untuk mencegah kerusakan kulit.',
        keywords: ['uv', 'sunscreen', 'protection', 'sun'],
        categories: ['sunscreen'],
        priority: 28
    });

    if (profile.hydrationLevel < 70) {
        targets.push({
            key: 'hydration',
            label: 'Perbaikan hidrasi',
            reason: `Hidrasi terdeteksi ${profile.hydrationLevel}%. Fokus pada produk pelembap.`,
            keywords: ['hydration', 'moisture', 'dry', 'hydrating'],
            categories: ['moisturizer', 'serum'],
            priority: 26
        });
    }

    if (profile.oilinessScore > 60) {
        targets.push({
            key: 'oil-control',
            label: 'Kontrol minyak',
            reason: `Oiliness ${profile.oilinessScore}%, prioritaskan pembersih lembut dan treatment anti-minyak.`,
            keywords: ['oil', 'sebum', 'pore', 'acne'],
            categories: ['cleanser', 'treatment'],
            priority: 24
        });
    }

    if (normalizeText(profile.acneSeverity).includes('sedang') || normalizeText(profile.acneSeverity).includes('tinggi')) {
        targets.push({
            key: 'acne-support',
            label: 'Perawatan jerawat',
            reason: `Status jerawat: ${profile.acneSeverity}. Gunakan treatment terarah untuk membantu meredakan breakout.`,
            keywords: ['acne', 'blemish', 'spot', 'salicylic'],
            categories: ['treatment', 'cleanser'],
            priority: 22
        });
    }

    if (profile.pigmentationScore > 55) {
        targets.push({
            key: 'tone-evening',
            label: 'Perataan warna kulit',
            reason: 'Pigmentasi relatif tinggi, serum brightening dan antioksidan direkomendasikan.',
            keywords: ['brightening', 'vitamin c', 'pigment', 'spot'],
            categories: ['serum', 'treatment'],
            priority: 20
        });
    }

    if (targets.length === 1) {
        targets.push(
            {
                key: 'routine-base-cleanser',
                label: 'Rutinitas dasar',
                reason: 'Pembersih lembut membantu menjaga skin barrier tetap stabil.',
                keywords: ['cleanser', 'gentle', 'barrier'],
                categories: ['cleanser'],
                priority: 19
            },
            {
                key: 'routine-base-moisturizer',
                label: 'Rutinitas dasar',
                reason: 'Pelembap menjaga kelembapan kulit sepanjang hari.',
                keywords: ['hydrate', 'moisture', 'barrier'],
                categories: ['moisturizer'],
                priority: 18
            }
        );
    }

    return targets;
};

const scoreProduct = (product, targets, profile) => {
    const category = normalizeCategory(product.category);
    const searchable = `${product.name || ''} ${product.description || ''} ${product.concerns || ''} ${product.ingredients || ''}`.toLowerCase();
    const skinTypeText = normalizeText(product.skin_type);
    const normalizedProfileSkinType = normalizeText(profile.skinType);

    let score = Number(product.rating || 0) * 4;
    let reason = 'Cocok untuk menjaga rutinitas skincare harian Anda.';

    for (const target of targets) {
        const categoryMatch = target.categories.includes(category);
        const keywordMatch = target.keywords.some((keyword) => searchable.includes(keyword));
        if (categoryMatch || keywordMatch) {
            score += target.priority;
            reason = target.reason;
            break;
        }
    }

    if (product.is_featured) {
        score += 6;
    }

    if (skinTypeText && normalizedProfileSkinType && skinTypeText.includes(normalizedProfileSkinType)) {
        score += 8;
    }

    if (!category && normalizeText(product.name).includes('sunscreen')) {
        score += 8;
    }

    return { score, reason };
};

const Recommendations = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [backendRecommendations, setBackendRecommendations] = useState(null);
    const [useBackendRecs, setUseBackendRecs] = useState(false);

    const persistedResult = useMemo(() => parseStoredJson('cantik_last_result_data'), []);
    const persistedInsights = useMemo(() => parseStoredJson('cantik_last_ai_insights'), []);
    const resultData = state?.resultData || persistedResult;
    const aiInsights = state?.aiInsights || persistedInsights;
    const profile = useMemo(() => buildSkinProfile(resultData || {}), [resultData]);
    const targets = useMemo(() => buildTargets(profile), [profile]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await apiService.getProducts();
                setProducts(Array.isArray(data) ? data : []);
                
                // Try to get backend recommendations if available
                if (state?.backendRecommendations && Array.isArray(state.backendRecommendations)) {
                    setBackendRecommendations(state.backendRecommendations);
                    setUseBackendRecs(true);
                    console.log('✅ Using backend-generated recommendations:', state.backendRecommendations.length);
                }
            } catch (err) {
                console.error('Get recommendation products error:', err);
                setError(err.message || 'Gagal memuat produk rekomendasi');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [state]);

    const recommendedProducts = useMemo(() => {
        // If we have backend recommendations, use them
        if (useBackendRecs && backendRecommendations && backendRecommendations.length > 0) {
            return backendRecommendations.slice(0, 8);
        }

        // Fallback to local scoring
        const scored = products
            .map((product) => {
                const scoreInfo = scoreProduct(product, targets, profile);
                return {
                    ...product,
                    recommendation_score: scoreInfo.score,
                    recommendation_reason: scoreInfo.reason
                };
            })
            .sort((a, b) => b.recommendation_score - a.recommendation_score);

        const deduped = [];
        const seenKeys = new Set();
        for (const item of scored) {
            const key = `${normalizeText(item.name)}|${normalizeText(item.brand)}|${normalizeCategory(item.category)}`;
            if (seenKeys.has(key)) continue;
            seenKeys.add(key);
            deduped.push(item);
            if (deduped.length >= 8) break;
        }

        return deduped;
    }, [products, targets, profile, backendRecommendations, useBackendRecs]);

    const insightSnippets = Array.isArray(aiInsights?.recommendations)
        ? aiInsights.recommendations.slice(0, 2)
        : [];

    return (
        <div className="app-container" style={{ position: 'relative' }}>
            <div className="screen-content" style={{ padding: '26px 24px 130px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.8)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <ChevronLeft size={24} color="var(--text-headline)" />
                    </button>
                </div>

                <div className="card-glass" style={{ padding: '18px', marginBottom: '14px', background: 'linear-gradient(135deg, rgba(157,90,118,0.15), rgba(241,211,226,0.16))' }}>
                    <h1 className="headline" style={{ fontSize: '1.45rem', marginBottom: '8px' }}>
                        Rekomendasi Produk Personal
                    </h1>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '12px' }}>
                        Disusun berdasarkan hasil analisis kulit terbaru Anda dan kategori produk yang paling relevan.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.65)' }}>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-body)', marginBottom: '4px' }}>Skin Type</p>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-headline)' }}>{profile.skinType}</p>
                        </div>
                        <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.65)' }}>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-body)', marginBottom: '4px' }}>Hidrasi</p>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-headline)' }}>{profile.hydrationLevel}%</p>
                        </div>
                    </div>

                    {targets.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                            {targets.slice(0, 3).map((target) => (
                                <span key={target.key} style={{ fontSize: '0.72rem', padding: '5px 9px', borderRadius: '999px', background: 'rgba(255,255,255,0.7)', color: 'var(--text-headline)' }}>
                                    {target.label}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>

                {insightSnippets.length > 0 ? (
                    <div className="card-glass" style={{ padding: '14px', marginBottom: '14px' }}>
                        <p style={{ fontSize: '0.82rem', color: 'var(--primary-color)', fontWeight: 700, marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Sparkles size={14} />
                            Insight AI
                        </p>
                        <ul style={{ margin: 0, paddingLeft: '18px' }}>
                            {insightSnippets.map((item, index) => (
                                <li key={`${item}-${index}`} style={{ color: 'var(--text-body)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '4px' }}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                        <p style={{ color: 'var(--text-body)' }}>Memuat rekomendasi produk...</p>
                    </div>
                ) : error ? (
                    <div className="card-glass" style={{ padding: '18px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-headline)', fontWeight: 600, marginBottom: '6px' }}>Gagal memuat rekomendasi</p>
                        <p style={{ color: 'var(--text-body)', fontSize: '0.85rem', marginBottom: '10px' }}>{error}</p>
                        <button
                            onClick={() => navigate('/products')}
                            style={{ border: 'none', borderRadius: '10px', padding: '10px 14px', background: 'var(--primary-color)', color: 'white', cursor: 'pointer' }}
                        >
                            Lihat Semua Produk
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {recommendedProducts.map((product) => (
                            <div key={product.id} className="card-glass" style={{ display: 'flex', gap: '12px', padding: '12px' }}>
                                <div style={{ width: 90, height: 100, borderRadius: '14px', overflow: 'hidden', background: 'rgba(255,255,255,0.6)', flexShrink: 0 }}>
                                    <img
                                        src={apiService.resolveMediaUrl(product.image_url) || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80'}
                                        alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(event) => {
                                            event.currentTarget.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80';
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                        <div>
                                            <p style={{ fontSize: '0.72rem', color: 'var(--primary-color)', fontWeight: 700, marginBottom: '3px', textTransform: 'uppercase' }}>
                                                {product.brand || 'Brand'}
                                            </p>
                                            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-headline)', marginBottom: '5px', fontFamily: 'var(--font-sans)' }}>
                                                {product.name}
                                            </h4>
                                        </div>
                                        <span style={{ fontSize: '0.68rem', padding: '4px 8px', borderRadius: '999px', background: 'rgba(89,54,69,0.08)', color: 'var(--text-body)' }}>
                                            {product.category || 'Produk'}
                                        </span>
                                    </div>

                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', marginBottom: '8px', lineHeight: 1.45 }}>
                                        {product.recommendation_reason}
                                    </p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                                        <p style={{ fontSize: '0.92rem', color: 'var(--primary-color)', fontWeight: 700, margin: 0 }}>
                                            Rp {Number(product.price || 0).toLocaleString('id-ID')}
                                        </p>
                                        <button
                                            onClick={() => navigate(`/products/${product.id}`, {
                                                state: {
                                                    recommendationReason: product.recommendation_reason,
                                                    fromRecommendations: true
                                                }
                                            })}
                                            style={{
                                                border: 'none',
                                                borderRadius: '10px',
                                                padding: '8px 10px',
                                                background: 'rgba(157,90,118,0.14)',
                                                color: 'var(--primary-color)',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <ShoppingBag size={13} />
                                            Detail
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {recommendedProducts.length === 0 ? (
                            <div className="card-glass" style={{ padding: '18px', textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-headline)', fontWeight: 600, marginBottom: '8px' }}>Belum ada produk rekomendasi</p>
                                <p style={{ color: 'var(--text-body)', fontSize: '0.85rem', marginBottom: '12px' }}>
                                    Tambahkan produk aktif dari admin dashboard agar rekomendasi dapat ditampilkan.
                                </p>
                                <button
                                    onClick={() => navigate('/products')}
                                    style={{ border: 'none', borderRadius: '10px', padding: '10px 14px', background: 'var(--primary-color)', color: 'white', cursor: 'pointer' }}
                                >
                                    Buka Halaman Produk
                                </button>
                            </div>
                        ) : null}
                    </div>
                )}

                <div className="card-glass" style={{ padding: '14px', marginTop: '14px' }}>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-headline)', marginBottom: '7px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                        <ShieldCheck size={15} color="var(--primary-color)" />
                        Tips Penggunaan
                    </p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', lineHeight: 1.58, margin: 0 }}>
                        Gunakan produk baru secara bertahap, lakukan patch test, dan konsisten minimal 4-6 minggu untuk evaluasi hasil.
                    </p>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default Recommendations;
