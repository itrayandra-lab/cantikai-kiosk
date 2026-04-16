import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CantikLogo from '../assets/logo/vite.svg';
import apiService from '../services/api';

const ScanOnboarding = () => {
    const navigate = useNavigate();
    const [banners, setBanners] = useState([]);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [backHover, setBackHover] = useState(false);
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
                        onClick={() => navigate('/')}
                        onMouseEnter={() => setBackHover(true)}
                        onMouseLeave={() => setBackHover(false)}
                        onFocus={() => setBackHover(true)}
                        onBlur={() => setBackHover(false)}
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
                            opacity: backHover ? 0.85 : 1,
                            transition: 'opacity 220ms ease, transform 220ms ease',
                            transform: backHover ? 'translateY(-1px)' : 'translateY(0)'
                        }}
                    >
                        <span
                            style={{
                                position: 'relative',
                                display: 'inline-block',
                                paddingBottom: '2px'
                            }}
                        >
                            Kembali
                            <span
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    bottom: 0,
                                    width: '100%',
                                    height: '1px',
                                    background: 'rgba(255,255,255,0.95)',
                                    transformOrigin: 'left',
                                    transform: backHover ? 'scaleX(1)' : 'scaleX(0)',
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

                    {/* Preparation Cards Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '16px',
                        marginBottom: '20px',
                        width: '100%'
                    }}>
                        {/* Card 1: Lepas Kacamata */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(24px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                            borderRadius: '20px',
                            padding: '20px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.25)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '14px',
                                background: 'rgba(157, 90, 118, 0.85)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '14px',
                                boxShadow: '0 4px 16px rgba(157, 90, 118, 0.4)'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 8h4m14 0h2M6 8c0-2.21 1.79-4 4-4h4c2.21 0 4 1.79 4 4M6 8v1c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8"/>
                                    <circle cx="7" cy="15" r="3"/>
                                    <circle cx="17" cy="15" r="3"/>
                                </svg>
                            </div>
                            <h3 style={{
                                margin: '0 0 8px 0',
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: 'rgba(255, 255, 255, 0.98)',
                                fontFamily: '"Inter", sans-serif',
                                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)'
                            }}>Lepas Kacamata</h3>
                            <p style={{
                                margin: 0,
                                fontSize: '0.85rem',
                                lineHeight: 1.5,
                                color: 'rgba(255, 255, 255, 0.92)',
                                fontFamily: '"Inter", sans-serif',
                                textShadow: '0 1px 4px rgba(0, 0, 0, 0.25)'
                            }}>Pastikan wajah terlihat jelas tanpa penghalang</p>
                        </div>

                        {/* Card 2: Posisi Wajah */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(24px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                            borderRadius: '20px',
                            padding: '20px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.25)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '14px',
                                background: 'rgba(157, 90, 118, 0.85)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '14px',
                                boxShadow: '0 4px 16px rgba(157, 90, 118, 0.4)'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                                    <path d="M8 21h8M12 17v4"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                            </div>
                            <h3 style={{
                                margin: '0 0 8px 0',
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: 'rgba(255, 255, 255, 0.98)',
                                fontFamily: '"Inter", sans-serif',
                                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)'
                            }}>Posisi Wajah</h3>
                            <p style={{
                                margin: 0,
                                fontSize: '0.85rem',
                                lineHeight: 1.5,
                                color: 'rgba(255, 255, 255, 0.92)',
                                fontFamily: '"Inter", sans-serif',
                                textShadow: '0 1px 4px rgba(0, 0, 0, 0.25)'
                            }}>Hadapkan wajah lurus ke kamera dengan jarak 30-50cm</p>
                        </div>

                        {/* Card 3: Pencahayaan Cukup */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(24px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                            borderRadius: '20px',
                            padding: '20px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.25)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '14px',
                                background: 'rgba(157, 90, 118, 0.85)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '14px',
                                boxShadow: '0 4px 16px rgba(157, 90, 118, 0.4)'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5"/>
                                    <line x1="12" y1="1" x2="12" y2="3"/>
                                    <line x1="12" y1="21" x2="12" y2="23"/>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                                    <line x1="1" y1="12" x2="3" y2="12"/>
                                    <line x1="21" y1="12" x2="23" y2="12"/>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                                </svg>
                            </div>
                            <h3 style={{
                                margin: '0 0 8px 0',
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: 'rgba(255, 255, 255, 0.98)',
                                fontFamily: '"Inter", sans-serif',
                                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)'
                            }}>Pencahayaan Cukup</h3>
                            <p style={{
                                margin: 0,
                                fontSize: '0.85rem',
                                lineHeight: 1.5,
                                color: 'rgba(255, 255, 255, 0.92)',
                                fontFamily: '"Inter", sans-serif',
                                textShadow: '0 1px 4px rgba(0, 0, 0, 0.25)'
                            }}>Pastikan ruangan memiliki cahaya yang baik dan merata</p>
                        </div>

                        {/* Card 4: Wajah Natural */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(24px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                            borderRadius: '20px',
                            padding: '20px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.25)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '14px',
                                background: 'rgba(157, 90, 118, 0.85)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '14px',
                                boxShadow: '0 4px 16px rgba(157, 90, 118, 0.4)'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                    <path d="M16 11l2 2 4-4"/>
                                </svg>
                            </div>
                            <h3 style={{
                                margin: '0 0 8px 0',
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: 'rgba(255, 255, 255, 0.98)',
                                fontFamily: '"Inter", sans-serif',
                                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)'
                            }}>Wajah Natural</h3>
                            <p style={{
                                margin: 0,
                                fontSize: '0.85rem',
                                lineHeight: 1.5,
                                color: 'rgba(255, 255, 255, 0.92)',
                                fontFamily: '"Inter", sans-serif',
                                textShadow: '0 1px 4px rgba(0, 0, 0, 0.25)'
                            }}>Makeup tebal dan filter dapat mempengaruhi hasil analisis</p>
                        </div>

                        {/* Card 5: Kulit Bersih */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(24px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                            borderRadius: '20px',
                            padding: '20px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.25)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '14px',
                                background: 'rgba(157, 90, 118, 0.85)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '14px',
                                boxShadow: '0 4px 16px rgba(157, 90, 118, 0.4)'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2a10 10 0 1 0 10 10H12V2z"/>
                                    <path d="M12 12v10a10 10 0 0 0 10-10H12z"/>
                                </svg>
                            </div>
                            <h3 style={{
                                margin: '0 0 8px 0',
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: 'rgba(255, 255, 255, 0.98)',
                                fontFamily: '"Inter", sans-serif',
                                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)'
                            }}>Kulit Bersih</h3>
                            <p style={{
                                margin: 0,
                                fontSize: '0.85rem',
                                lineHeight: 1.5,
                                color: 'rgba(255, 255, 255, 0.92)',
                                fontFamily: '"Inter", sans-serif',
                                textShadow: '0 1px 4px rgba(0, 0, 0, 0.25)'
                            }}>Bersihkan wajah dari kotoran dan minyak berlebih</p>
                        </div>

                        {/* Card 6: Ekspresi Netral */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(24px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                            borderRadius: '20px',
                            padding: '20px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.25)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '14px',
                                background: 'rgba(157, 90, 118, 0.85)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '14px',
                                boxShadow: '0 4px 16px rgba(157, 90, 118, 0.4)'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <circle cx="9" cy="10" r="1" fill="white"/>
                                    <circle cx="15" cy="10" r="1" fill="white"/>
                                    <line x1="9" y1="15" x2="15" y2="15"/>
                                </svg>
                            </div>
                            <h3 style={{
                                margin: '0 0 8px 0',
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: 'rgba(255, 255, 255, 0.98)',
                                fontFamily: '"Inter", sans-serif',
                                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)'
                            }}>Ekspresi Netral</h3>
                            <p style={{
                                margin: 0,
                                fontSize: '0.85rem',
                                lineHeight: 1.5,
                                color: 'rgba(255, 255, 255, 0.92)',
                                fontFamily: '"Inter", sans-serif',
                                textShadow: '0 1px 4px rgba(0, 0, 0, 0.25)'
                            }}>Rileks dan hindari ekspresi berlebihan saat scan</p>
                        </div>
                    </div>

                    {/* Info Banner - Capture Otomatis */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.18)',
                        backdropFilter: 'blur(24px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                        borderRadius: '18px',
                        padding: '18px 20px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.25)'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'rgba(157, 90, 118, 0.85)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 4px 16px rgba(157, 90, 118, 0.4)'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{
                                margin: '0 0 4px 0',
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                color: 'rgba(255, 255, 255, 0.98)',
                                fontFamily: '"Inter", sans-serif',
                                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)'
                            }}>Capture Otomatis</h4>
                            <p style={{
                                margin: 0,
                                fontSize: '0.82rem',
                                lineHeight: 1.4,
                                color: 'rgba(255, 255, 255, 0.92)',
                                fontFamily: '"Inter", sans-serif',
                                textShadow: '0 1px 4px rgba(0, 0, 0, 0.25)'
                            }}>Sistem akan mendeteksi wajah dan mengambil foto secara otomatis dalam 3 detik</p>
                        </div>
                    </div>

                    {/* Glassmorphism Pill Button - Saya Siap */}
                    <button
                        onClick={() => navigate('/scan')}
                        onMouseEnter={() => setCtaHover(true)}
                        onMouseLeave={() => setCtaHover(false)}
                        onFocus={() => setCtaHover(true)}
                        onBlur={() => setCtaHover(false)}
                        style={{
                            width: '100%',
                            height: '70px',
                            border: '1px solid rgba(255, 255, 255, 0.25)',
                            borderRadius: '20px',
                            background: ctaHover 
                                ? 'rgba(255, 255, 255, 0.16)' 
                                : 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(28px) saturate(160%)',
                            WebkitBackdropFilter: 'blur(28px) saturate(160%)',
                            color: 'rgba(255, 255, 255, 0.98)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            boxShadow: ctaHover
                                ? '0 12px 32px rgba(0, 0, 0, 0.2), 0 0 24px rgba(255, 255, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                                : '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                            transform: ctaHover ? 'translateY(-2px) scale(1.01)' : 'translateY(0) scale(1)',
                            transition: 'all 280ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                            padding: '0 32px',
                            marginBottom: '24px',
                            position: 'relative',
                            overflow: 'hidden',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            letterSpacing: '0.01em',
                            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                        }}
                    >
                        {/* Animated shimmer effect */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)',
                            animation: 'shimmer 3s infinite',
                            pointerEvents: 'none'
                        }} />
                        
                        {/* Gradient overlay */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%, rgba(255, 255, 255, 0.08) 100%)',
                            opacity: ctaHover ? 1 : 0.7,
                            transition: 'opacity 280ms ease'
                        }} />
                        
                        <span style={{ position: 'relative', zIndex: 1 }}>Saya Siap</span>
                        
                        <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            style={{
                                position: 'relative',
                                zIndex: 1,
                                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))',
                                transform: ctaHover ? 'translateX(4px)' : 'translateX(0)',
                                transition: 'transform 280ms ease'
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

export default ScanOnboarding;
