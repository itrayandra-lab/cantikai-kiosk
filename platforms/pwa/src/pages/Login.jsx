import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import apiService from '../services/api';
import { loginUser } from '../utils/auth';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const normalizedGoogleClientId = GOOGLE_CLIENT_ID.trim().toLowerCase();
const isTruthy = (value, fallback = true) => {
    if (value === undefined || value === null || value === '') return fallback;
    if (typeof value === 'boolean') return value;
    return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};
const hasRealGoogleClientId = Boolean(
    normalizedGoogleClientId
    && normalizedGoogleClientId.includes('.apps.googleusercontent.com')
    && !normalizedGoogleClientId.startsWith('your-')
    && !normalizedGoogleClientId.startsWith('your_')
    && !normalizedGoogleClientId.includes('example')
);

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [mode, setMode] = useState(searchParams.get('register') === 'true' ? 'register' : 'login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [publicSettings, setPublicSettings] = useState({});

    const googleButtonRef = useRef(null);

    const appName = publicSettings['app.name'] || 'Cantik AI';
    const allowGuest = isTruthy(publicSettings['feature.allow_guest'], true);
    const enableGoogleLogin = isTruthy(publicSettings['feature.enable_google_login'], true);
    const canRenderGoogleButton = hasRealGoogleClientId && enableGoogleLogin;

    useEffect(() => {
        if (searchParams.get('register') === 'true') {
            setMode('register');
        }
    }, [searchParams]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('cantik_public_settings');
            if (raw) {
                setPublicSettings(JSON.parse(raw));
            }
        } catch {
            setPublicSettings({});
        }
    }, []);

    const handleLoginSuccess = (authPayload) => {
        loginUser(authPayload);

        const redirect = sessionStorage.getItem('redirect_after_login');
        sessionStorage.removeItem('redirect_after_login');
        navigate(redirect || '/');
    };

    useEffect(() => {
        if (!canRenderGoogleButton || !googleButtonRef.current) return;

        const initGoogleButton = () => {
            if (!window.google?.accounts?.id || !googleButtonRef.current) return;

            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: async (response) => {
                    if (!response?.credential) return;
                    setError('');
                    setIsLoading(true);
                    try {
                        const result = await apiService.loginWithGoogle(response.credential);
                        handleLoginSuccess(result);
                    } catch (googleError) {
                        console.error('Google login error:', googleError);
                        setError(googleError.message || 'Google login gagal');
                    } finally {
                        setIsLoading(false);
                    }
                }
            });

            googleButtonRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleButtonRef.current, {
                theme: 'outline',
                size: 'large',
                shape: 'pill',
                width: 320,
                text: 'continue_with'
            });
        };

        if (window.google?.accounts?.id) {
            initGoogleButton();
            return;
        }

        const existingScript = document.querySelector('script[data-google-gsi="true"]');
        if (existingScript) {
            existingScript.addEventListener('load', initGoogleButton, { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.dataset.googleGsi = 'true';
        script.onload = initGoogleButton;
        script.onerror = () => setError('Gagal memuat Google Sign-In');
        document.head.appendChild(script);
    }, [canRenderGoogleButton]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (mode === 'register') {
            if (!name.trim()) {
                setError('Nama wajib diisi');
                return;
            }
            if (password.length < 8) {
                setError('Password minimal 8 karakter');
                return;
            }
            if (password !== confirmPassword) {
                setError('Konfirmasi password tidak sama');
                return;
            }
        }

        setIsLoading(true);
        try {
            const result = mode === 'register'
                ? await apiService.register({ name: name.trim(), email, password })
                : await apiService.login(email, password);

            handleLoginSuccess(result);
        } catch (authError) {
            console.error('Auth error:', authError);
            setError(authError.message || 'Terjadi kesalahan saat autentikasi');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-container" style={{
            background: 'linear-gradient(180deg, #faf6f8 0%, #f1d3e2 100%)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(157, 90, 118, 0.15), transparent)', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-150px', left: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(241, 211, 226, 0.3), transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />

            <div style={{
                width: '100%',
                maxWidth: '420px',
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(30px)',
                borderRadius: '24px',
                padding: '36px 28px',
                boxShadow: '0 8px 32px rgba(157, 90, 118, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <div style={{
                        width: '76px',
                        height: '76px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #9d5a76, #c084a0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(157, 90, 118, 0.3)'
                    }}>
                        <img
                            src="/vite.svg"
                            alt="Cantik AI"
                            style={{ width: '38px', height: '38px', filter: 'brightness(0) invert(1)' }}
                        />
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    marginBottom: '20px',
                    background: 'rgba(157, 90, 118, 0.08)',
                    padding: '6px',
                    borderRadius: '14px'
                }}>
                    <button
                        type="button"
                        onClick={() => setMode('login')}
                        style={{
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            background: mode === 'login' ? 'white' : 'transparent',
                            color: mode === 'login' ? 'var(--primary-color)' : 'var(--text-body)',
                            fontFamily: 'var(--font-sans)'
                        }}
                    >
                        Masuk
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('register')}
                        style={{
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            background: mode === 'register' ? 'white' : 'transparent',
                            color: mode === 'register' ? 'var(--primary-color)' : 'var(--text-body)',
                            fontFamily: 'var(--font-sans)'
                        }}
                    >
                        Daftar
                    </button>
                </div>

                    <h1 className="headline" style={{
                    fontSize: '1.7rem',
                    fontWeight: 600,
                    color: 'var(--text-headline)',
                    textAlign: 'center',
                    marginBottom: '8px',
                    fontFamily: 'var(--font-serif)'
                }}>
                    {mode === 'login' ? 'Selamat Datang' : 'Buat Akun Baru'}
                </h1>
                <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-body)',
                    textAlign: 'center',
                    marginBottom: '20px',
                    fontFamily: 'var(--font-sans)'
                }}>
                    {mode === 'login' ? 'Login untuk melanjutkan' : `Daftar untuk akses penuh fitur ${appName}`}
                </p>

                {error && (
                    <div style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        marginBottom: '16px'
                    }}>
                        <p style={{ fontSize: '0.85rem', color: '#dc2626', margin: 0, fontFamily: 'var(--font-sans)' }}>
                            {error}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {mode === 'register' && (
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <User size={20} color="var(--text-body)" style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nama lengkap"
                                required={mode === 'register'}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(157, 90, 118, 0.2)',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: '0.95rem',
                                    color: 'var(--text-headline)',
                                    fontFamily: 'var(--font-sans)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    )}

                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Mail size={20} color="var(--text-body)" style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nama@email.com"
                            required
                            style={{
                                width: '100%',
                                padding: '14px 16px 14px 48px',
                                borderRadius: '12px',
                                border: '1px solid rgba(157, 90, 118, 0.2)',
                                background: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.95rem',
                                color: 'var(--text-headline)',
                                fontFamily: 'var(--font-sans)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Lock size={20} color="var(--text-body)" style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            minLength={8}
                            style={{
                                width: '100%',
                                padding: '14px 48px 14px 48px',
                                borderRadius: '12px',
                                border: '1px solid rgba(157, 90, 118, 0.2)',
                                background: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.95rem',
                                color: 'var(--text-headline)',
                                fontFamily: 'var(--font-sans)',
                                outline: 'none'
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-body)',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {mode === 'register' && (
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Lock size={20} color="var(--text-body)" style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }} />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Konfirmasi password"
                                required={mode === 'register'}
                                minLength={8}
                                style={{
                                    width: '100%',
                                    padding: '14px 48px 14px 48px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(157, 90, 118, 0.2)',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: '0.95rem',
                                    color: 'var(--text-headline)',
                                    fontFamily: 'var(--font-sans)',
                                    outline: 'none'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-body)',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !email || !password || (mode === 'register' && !name)}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '12px',
                            border: 'none',
                            background: isLoading || !email || !password || (mode === 'register' && !name)
                                ? 'rgba(157, 90, 118, 0.5)'
                                : 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: 600,
                            fontFamily: 'var(--font-sans)',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: isLoading ? 'none' : '0 4px 12px rgba(157, 90, 118, 0.3)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {isLoading ? (
                            <span>Memproses...</span>
                        ) : (
                            <>
                                {mode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
                                <span>{mode === 'login' ? 'Masuk' : 'Daftar'}</span>
                            </>
                        )}
                    </button>
                </form>

                <div style={{
                    margin: '16px 0 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(157, 90, 118, 0.2)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-body)', fontFamily: 'var(--font-sans)' }}>atau</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(157, 90, 118, 0.2)' }} />
                </div>

                {canRenderGoogleButton ? (
                    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '44px' }}>
                        <div ref={googleButtonRef} />
                    </div>
                ) : (
                    <p style={{ margin: 0, textAlign: 'center', color: 'var(--text-body)', fontSize: '0.8rem', fontFamily: 'var(--font-sans)' }}>
                        {!enableGoogleLogin
                            ? 'Google Sign-In dinonaktifkan dari admin settings.'
                            : 'Google Sign-In belum aktif. Gunakan client ID valid di `VITE_GOOGLE_CLIENT_ID`.'}
                    </p>
                )}

                {allowGuest && (
                    <div style={{ marginTop: '18px', textAlign: 'center' }}>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--primary-color)',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                fontFamily: 'var(--font-sans)',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            Lewati, masuk sebagai guest
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
