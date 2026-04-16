import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CantikLogo from '../assets/logo/vite.svg';
import apiService from '../services/api';

const Home = () => {
    const navigate = useNavigate();
    const [banners, setBanners] = useState([]);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [historyHover, setHistoryHover] = useState(false);
    const [ctaHover, setCtaHover] = useState(false);

    useEffect(() => {
        const loadBanners = async () => {
            try {
                const result = await apiService.getBanners();
                const active = Array.isArray(result)
                    ? result.filter((item) => Number(item.is_active) === 1)
                    : [];
                setBanners(active);
            } catch (error) {
                console.error('Error fetching banners:', error);
                setBanners([]);
            }
        };

        loadBanners();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return undefined;
        const timer = setInterval(() => {
            setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners]);

    const heroImage = banners[currentBannerIndex]?.image_url
        ? apiService.resolveMediaUrl(banners[currentBannerIndex].image_url)
        : 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1200&q=80';

    return (
        <div className="app-container" style={{ background: '#f3e6ee' }}>
            <div className="screen-content" style={{ padding: 0, position: 'relative', minHeight: '100vh' }}>
                <img
                    src={heroImage}
                    alt="Skin onboarding"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        imageRendering: '-webkit-optimize-contrast'
                    }}
                />

                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(65, 40, 54, 0.08) 0%, rgba(65, 40, 54, 0.16) 46%, rgba(65, 40, 54, 0.55) 100%)',
                        overflow: 'hidden'
                    }}
                >
                    {/* Floating ambient orbs */}
                    <div style={{
                        position: 'absolute',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
                        top: '10%',
                        left: '-10%',
                        animation: 'floatOrb 20s ease-in-out infinite',
                        filter: 'blur(40px)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        width: '250px',
                        height: '250px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255, 200, 220, 0.06) 0%, transparent 70%)',
                        top: '40%',
                        right: '-8%',
                        animation: 'floatOrb 25s ease-in-out infinite 5s',
                        filter: 'blur(50px)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
                        bottom: '15%',
                        left: '20%',
                        animation: 'floatOrb 18s ease-in-out infinite 3s',
                        filter: 'blur(45px)'
                    }} />
                    
                    {/* Subtle sparkles */}
                    <div style={{
                        position: 'absolute',
                        width: '3px',
                        height: '3px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.6)',
                        top: '25%',
                        left: '30%',
                        animation: 'twinkle 3s ease-in-out infinite',
                        boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        width: '2px',
                        height: '2px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.5)',
                        top: '60%',
                        right: '25%',
                        animation: 'twinkle 4s ease-in-out infinite 1s',
                        boxShadow: '0 0 8px rgba(255, 255, 255, 0.4)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        width: '2.5px',
                        height: '2.5px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.55)',
                        top: '45%',
                        left: '70%',
                        animation: 'twinkle 3.5s ease-in-out infinite 2s',
                        boxShadow: '0 0 9px rgba(255, 255, 255, 0.45)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        width: '2px',
                        height: '2px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.5)',
                        top: '80%',
                        left: '15%',
                        animation: 'twinkle 4.5s ease-in-out infinite 0.5s',
                        boxShadow: '0 0 8px rgba(255, 255, 255, 0.4)'
                    }} />
                </div>

                <div
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        alignItems: 'stretch',
                        padding: '48px 48px 56px'
                    }}
                >
                    <button
                        onClick={() => navigate('/history')}
                        onMouseEnter={() => setHistoryHover(true)}
                        onMouseLeave={() => setHistoryHover(false)}
                        onFocus={() => setHistoryHover(true)}
                        onBlur={() => setHistoryHover(false)}
                        style={{
                            position: 'absolute',
                            top: '48px',
                            left: '48px',
                            border: 'none',
                            background: 'transparent',
                            padding: 0,
                            color: 'rgba(255,255,255,0.96)',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            letterSpacing: '0.005em',
                            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                            cursor: 'pointer',
                            textShadow: '0 2px 8px rgba(0,0,0,0.25)',
                            opacity: historyHover ? 0.85 : 1,
                            transition: 'opacity 220ms ease, transform 220ms ease',
                            transform: historyHover ? 'translateY(-1px)' : 'translateY(0)'
                        }}
                    >
                        <span
                            style={{
                                position: 'relative',
                                display: 'inline-block',
                                paddingBottom: '2px'
                            }}
                        >
                            Riwayat
                            <span
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    bottom: 0,
                                    width: '100%',
                                    height: '1px',
                                    background: 'rgba(255,255,255,0.95)',
                                    transformOrigin: 'left',
                                    transform: historyHover ? 'scaleX(1)' : 'scaleX(0)',
                                    transition: 'transform 220ms ease'
                                }}
                            />
                        </span>
                    </button>

                    <img
                        src={CantikLogo}
                        alt="Cantik AI logo"
                        style={{
                            position: 'absolute',
                            top: '42px',
                            right: '46px',
                            width: '68px',
                            height: '68px',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 10px 14px rgba(40, 20, 31, 0.2))'
                        }}
                    />

                    {/* Glassmorphism Pill Button - Above Cantik.ai */}
                    <button
                        onClick={() => navigate('/scan-prep')}
                        onMouseEnter={() => setCtaHover(true)}
                        onMouseLeave={() => setCtaHover(false)}
                        onFocus={() => setCtaHover(true)}
                        onBlur={() => setCtaHover(false)}
                        style={{
                            width: '100%',
                            height: '80px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '28px',
                            background: ctaHover 
                                ? 'rgba(255, 255, 255, 0.14)' 
                                : 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(28px) saturate(160%)',
                            WebkitBackdropFilter: 'blur(28px) saturate(160%)',
                            color: 'rgba(255, 255, 255, 0.98)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '14px',
                            cursor: 'pointer',
                            boxShadow: ctaHover
                                ? '0 16px 40px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
                                : '0 10px 28px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                            transform: ctaHover ? 'translateY(-3px) scale(1.01)' : 'translateY(0) scale(1)',
                            transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                            padding: '0 36px',
                            marginBottom: '44px',
                            position: 'relative',
                            overflow: 'hidden',
                            fontSize: '1.15rem',
                            fontWeight: 600,
                            letterSpacing: '0.005em',
                            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                            textShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
                        }}
                    >
                        {/* Animated shimmer effect */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                            animation: 'shimmer 3s infinite',
                            pointerEvents: 'none'
                        }} />
                        
                        {/* Gradient overlay */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '28px',
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)',
                            opacity: ctaHover ? 1 : 0.6,
                            transition: 'opacity 300ms ease'
                        }} />
                        
                        {/* Floating particles */}
                        <div style={{
                            position: 'absolute',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.4)',
                            top: '20%',
                            left: '15%',
                            animation: 'float 4s ease-in-out infinite',
                            opacity: ctaHover ? 1 : 0.3,
                            transition: 'opacity 300ms ease'
                        }} />
                        <div style={{
                            position: 'absolute',
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.3)',
                            top: '60%',
                            left: '25%',
                            animation: 'float 5s ease-in-out infinite 1s',
                            opacity: ctaHover ? 1 : 0.3,
                            transition: 'opacity 300ms ease'
                        }} />
                        <div style={{
                            position: 'absolute',
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.35)',
                            top: '40%',
                            right: '20%',
                            animation: 'float 4.5s ease-in-out infinite 0.5s',
                            opacity: ctaHover ? 1 : 0.3,
                            transition: 'opacity 300ms ease'
                        }} />
                        
                        {/* Pulse ring on hover */}
                        {ctaHover && (
                            <div style={{
                                position: 'absolute',
                                inset: '-2px',
                                borderRadius: '30px',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                animation: 'pulse 1.5s ease-out infinite',
                                pointerEvents: 'none'
                            }} />
                        )}
                        
                        <span style={{ position: 'relative', zIndex: 1 }}>Analyze Skin</span>
                        
                        <svg 
                            width="22" 
                            height="22" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            style={{
                                position: 'relative',
                                zIndex: 1,
                                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                                transform: ctaHover ? 'translateX(4px)' : 'translateX(0)',
                                transition: 'transform 300ms ease'
                            }}
                        >
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                    
                    <style>{`
                        @keyframes shimmer {
                            0% { left: -100%; }
                            50%, 100% { left: 100%; }
                        }
                        
                        @keyframes float {
                            0%, 100% { transform: translateY(0px) scale(1); }
                            50% { transform: translateY(-10px) scale(1.1); }
                        }
                        
                        @keyframes pulse {
                            0% { 
                                transform: scale(1);
                                opacity: 0.6;
                            }
                            50% {
                                transform: scale(1.05);
                                opacity: 0.3;
                            }
                            100% { 
                                transform: scale(1.1);
                                opacity: 0;
                            }
                        }
                        
                        @keyframes floatOrb {
                            0%, 100% { 
                                transform: translate(0, 0) scale(1);
                            }
                            33% { 
                                transform: translate(30px, -30px) scale(1.1);
                            }
                            66% { 
                                transform: translate(-20px, 20px) scale(0.9);
                            }
                        }
                        
                        @keyframes twinkle {
                            0%, 100% { 
                                opacity: 0.3;
                                transform: scale(1);
                            }
                            50% { 
                                opacity: 1;
                                transform: scale(1.5);
                            }
                        }
                    `}</style>

                    {/* Bottom Content */}
                    <div style={{ width: '100%', maxWidth: '520px', color: 'white', textAlign: 'left' }}>
                        <p
                            style={{
                                margin: 0,
                                fontSize: 'clamp(2rem, 5.5vw, 2.5rem)',
                                lineHeight: 1.1,
                                fontWeight: 600,
                                letterSpacing: '-0.01em',
                                fontFamily: '"Bricolage Grotesque", -apple-system, BlinkMacSystemFont, sans-serif',
                                textTransform: 'none'
                            }}
                        >
                            Cantik.ai<sup style={{ fontSize: '0.4em', verticalAlign: 'super', letterSpacing: '0.05em', fontWeight: 500 }}>TM</sup>
                        </p>
                        <p
                            style={{
                                margin: '10px 0 0',
                                fontSize: '1rem',
                                lineHeight: 1.4,
                                fontStyle: 'italic',
                                fontWeight: 400,
                                letterSpacing: '0.005em',
                                color: 'rgba(255,255,255,0.95)',
                                fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif'
                            }}
                        >
                            Healthy skin starts when every scan works in <strong style={{ fontWeight: 700 }}>sync.</strong>
                        </p>
                        <p
                            style={{
                                margin: '14px 0 0',
                                fontSize: '0.86rem',
                                lineHeight: 1.55,
                                color: 'rgba(255,255,255,0.94)',
                                fontWeight: 400,
                                letterSpacing: '0.01em',
                                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                                maxWidth: '480px'
                            }}
                        >
                            Powered by AI Skin Analyzer Technology, a smart system that helps detect skin concerns,
                            map condition trends, and guide your skincare decisions naturally.
                        </p>
                        <div
                            style={{
                                marginTop: '14px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                borderRadius: '999px',
                                border: '1px solid rgba(255,255,255,0.54)',
                                padding: '6px 14px',
                                fontSize: '0.76rem',
                                color: 'rgba(255,255,255,0.95)',
                                fontWeight: 500,
                                letterSpacing: '0.01em',
                                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
                            }}
                        >
                            Designed for all skin types and tropical conditions.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
