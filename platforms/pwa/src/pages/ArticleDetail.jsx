import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Tag, User } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import apiService from '../services/api';

const parseTags = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    return String(value)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
};

const splitParagraphs = (value) => {
    const raw = String(value || '').trim();
    if (!raw) return [];

    const newlineParagraphs = raw.split(/\n+/).map((part) => part.trim()).filter(Boolean);
    if (newlineParagraphs.length > 1) return newlineParagraphs;

    const sentences = raw.split(/(?<=[.!?])\s+/).map((part) => part.trim()).filter(Boolean);
    if (sentences.length <= 3) return [raw];

    const merged = [];
    for (let index = 0; index < sentences.length; index += 2) {
        merged.push(sentences.slice(index, index + 2).join(' '));
    }
    return merged;
};

const estimateReadTime = (text) => {
    const words = String(text || '').split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
};

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await apiService.getArticleById(id);
                setArticle(data);
            } catch (err) {
                console.error('Get article detail error:', err);
                setError(err.message || 'Gagal memuat detail artikel');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    const tags = useMemo(() => parseTags(article?.tags), [article]);
    const readTime = estimateReadTime(article?.content);
    const paragraphs = useMemo(
        () => splitParagraphs(article?.content || article?.excerpt || ''),
        [article?.content, article?.excerpt]
    );
    const publishedAt = article?.published_at || article?.created_at || null;

    if (loading) {
        return (
            <div className="app-container">
                <div className="screen-content" style={{ padding: '28px 24px 140px' }}>
                    <p style={{ textAlign: 'center', color: 'var(--text-body)' }}>Memuat artikel...</p>
                </div>
                <BottomNav />
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="app-container">
                <div className="screen-content" style={{ padding: '28px 24px 140px' }}>
                    <button
                        onClick={() => navigate('/education')}
                        style={{ border: 'none', background: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--primary-color)', marginBottom: '18px' }}
                    >
                        <ArrowLeft size={18} /> Kembali ke Edukasi
                    </button>
                    <div className="card-glass" style={{ padding: '24px', textAlign: 'center' }}>
                        <BookOpen size={28} color="var(--primary-color)" style={{ marginBottom: '12px' }} />
                        <p style={{ color: 'var(--text-headline)', fontWeight: 600, marginBottom: '8px' }}>Artikel tidak ditemukan</p>
                        <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', margin: 0 }}>{error || 'ID artikel tidak valid.'}</p>
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

                <div className="card-glass" style={{ padding: '18px', marginBottom: '14px' }}>
                    {article.featured_image || article.image_url ? (
                        <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', marginBottom: '14px', aspectRatio: '1.4', background: 'rgba(157, 90, 118, 0.08)' }}>
                            <img
                                src={apiService.resolveMediaUrl(article.featured_image || article.image_url)}
                                alt={article.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(event) => {
                                    event.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    ) : (
                        <div style={{ width: '100%', borderRadius: '16px', marginBottom: '14px', aspectRatio: '1.4', background: 'linear-gradient(135deg, rgba(157, 90, 118, 0.18), rgba(241, 211, 226, 0.26))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BookOpen size={34} color="var(--primary-color)" />
                        </div>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                        {article.category ? (
                            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '999px', background: 'rgba(157,90,118,0.12)', color: 'var(--primary-color)', fontWeight: 600 }}>
                                {article.category}
                            </span>
                        ) : null}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-body)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <Clock size={12} /> {readTime} menit baca
                        </span>
                    </div>

                    <h1 className="headline" style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
                        {article.title}
                    </h1>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.82rem', color: 'var(--text-body)', marginBottom: '10px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <User size={13} /> {article.author || 'Tim Cantik AI'}
                        </span>
                        {publishedAt ? (
                            <span>
                                {new Date(publishedAt).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                        ) : null}
                    </div>

                    {article.excerpt ? (
                        <p style={{ margin: 0, color: 'var(--text-headline)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                            {article.excerpt}
                        </p>
                    ) : null}
                </div>

                <div className="card-glass" style={{ padding: '18px', marginBottom: '14px' }}>
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: 'var(--text-headline)', marginBottom: '12px' }}>Isi Artikel</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {paragraphs.length > 0 ? (
                            paragraphs.map((paragraph, index) => (
                                <p key={`${index}-${paragraph.slice(0, 20)}`} style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.72, color: 'var(--text-body)' }}>
                                    {paragraph}
                                </p>
                            ))
                        ) : (
                            <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-body)' }}>Konten artikel belum tersedia.</p>
                        )}
                    </div>
                </div>

                {tags.length > 0 ? (
                    <div className="card-glass" style={{ padding: '14px' }}>
                        <p style={{ marginBottom: '10px', color: 'var(--text-headline)', fontWeight: 600, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <Tag size={14} color="var(--primary-color)" />
                            Tag Artikel
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {tags.map((item) => (
                                <span key={item} style={{ fontSize: '0.8rem', padding: '5px 10px', borderRadius: '999px', background: 'rgba(89,54,69,0.08)', color: 'var(--text-body)' }}>
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>

            <BottomNav />
        </div>
    );
};

export default ArticleDetail;
