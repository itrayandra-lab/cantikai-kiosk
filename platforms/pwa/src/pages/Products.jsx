import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import apiService from '../services/api';

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('semua');
    const [selectedBrand, setSelectedBrand] = useState('semua');
    const [banners, setBanners] = useState([]);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    useEffect(() => {
        fetchProducts();
        fetchBanners();
    }, []);

    useEffect(() => {
        // Auto-rotate banners every 5 seconds
        if (banners.length > 1) {
            const interval = setInterval(() => {
                setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [banners]);

    const fetchBanners = async () => {
        try {
            const bannersData = await apiService.getBanners();
            setBanners(bannersData);
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const productsData = await apiService.getProducts();
            setProducts(productsData);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const normalizeText = (value) => String(value || '').trim().toLowerCase();
    const formatCategoryLabel = (value) =>
        String(value || '')
            .split(' ')
            .map((word) => word ? word.charAt(0).toUpperCase() + word.slice(1) : '')
            .join(' ');

    const categories = useMemo(
        () => ['semua', ...new Set(products.map((item) => normalizeText(item.category)).filter(Boolean))],
        [products]
    );
    const brands = useMemo(
        () => ['semua', ...new Set(products.map((item) => String(item.brand || '').trim()).filter(Boolean))],
        [products]
    );

    const filteredProducts = useMemo(() => {
        const term = normalizeText(searchTerm);
        return products.filter((product) => {
            const categoryMatch = selectedCategory === 'semua' || normalizeText(product.category) === selectedCategory;
            const brandMatch = selectedBrand === 'semua' || String(product.brand || '').trim() === selectedBrand;
            const searchable = `${product.name || ''} ${product.brand || ''} ${product.category || ''}`.toLowerCase();
            const searchMatch = !term || searchable.includes(term);
            return categoryMatch && brandMatch && searchMatch;
        });
    }, [products, searchTerm, selectedCategory, selectedBrand]);

    const nextBanner = () => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    };

    const prevBanner = () => {
        setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    // Touch swipe support
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 50) {
            nextBanner();
        }
        if (touchStart - touchEnd < -50) {
            prevBanner();
        }
    };

    return (
        <div className="app-container">
            <div className="screen-content" style={{ padding: '24px', paddingBottom: '120px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                    >
                        <ArrowLeft size={24} color="var(--text-headline)" />
                    </button>
                    <h1 className="headline" style={{ fontSize: '2.5rem', margin: 0 }}>Produk</h1>
                </div>

                {/* Banner Slider */}
                {banners.length > 0 && (
                    <div 
                        style={{ 
                            position: 'relative', 
                            marginBottom: '24px',
                            marginTop: '0',
                            borderRadius: '20px', 
                            overflow: 'hidden',
                            height: '160px'
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {banners.map((banner, index) => (
                            <div
                                key={banner.id}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: index === currentBannerIndex ? 1 : 0,
                                    transition: 'opacity 0.5s ease',
                                    cursor: banner.link_url ? 'pointer' : 'default'
                                }}
                                onClick={() => banner.link_url && navigate(banner.link_url)}
                            >
                                <img 
                                    src={apiService.resolveMediaUrl(banner.image_url)} 
                                    alt={banner.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                    padding: '20px',
                                    color: 'white'
                                }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '4px' }}>
                                        {banner.title}
                                    </h3>
                                    {banner.description && (
                                        <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                                            {banner.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {banners.length > 1 && (
                            <>
                                {/* Dots Indicator Only */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    display: 'flex',
                                    gap: '6px',
                                    zIndex: 10
                                }}>
                                    {banners.map((_, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setCurrentBannerIndex(index)}
                                            style={{
                                                width: index === currentBannerIndex ? '24px' : '8px',
                                                height: '8px',
                                                borderRadius: '4px',
                                                background: index === currentBannerIndex ? 'white' : 'rgba(255,255,255,0.5)',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s'
                                            }}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Search */}
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-body)' }} />
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '20px', border: '1px solid rgba(157, 143, 166, 0.3)', background: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}
                    />
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{ padding: '10px 16px', borderRadius: '20px', border: '1px solid rgba(157, 143, 166, 0.3)', background: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', cursor: 'pointer' }}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat === 'semua' ? 'Semua Kategori' : formatCategoryLabel(cat)}</option>
                        ))}
                    </select>
                    
                    <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        style={{ padding: '10px 16px', borderRadius: '20px', border: '1px solid rgba(157, 143, 166, 0.3)', background: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', cursor: 'pointer' }}
                    >
                        {brands.map(brand => (
                            <option key={brand} value={brand}>{brand === 'semua' ? 'Semua Brand' : brand}</option>
                        ))}
                    </select>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ color: 'var(--text-body)' }}>Memuat produk...</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                className="card-glass"
                                style={{ padding: '12px', cursor: 'pointer', transition: 'transform 0.2s' }}
                                onClick={() => navigate(`/products/${product.id}`)}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ width: '100%', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', background: 'rgba(255,190,215,0.2)' }}>
                                    <img
                                        src={apiService.resolveMediaUrl(product.image_url)}
                                        alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80'}
                                    />
                                </div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {product.brand}
                                </div>
                                <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '8px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {product.name}
                                </h3>
                                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                                    Rp {Number(product.price || 0).toLocaleString('id-ID')}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredProducts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ color: 'var(--text-body)' }}>Produk tidak ditemukan</p>
                    </div>
                )}
            </div>
            
            <BottomNav />
        </div>
    );
};

export default Products;
