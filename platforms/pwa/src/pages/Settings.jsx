import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Globe, Shield, HelpCircle, Info, Mail, Lock, Trash2, Check, X } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import apiService from '../services/api';

const Settings = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(true);
    const [emailNotif, setEmailNotif] = useState(false);
    const [analysisReminder, setAnalysisReminder] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [selectedLanguage, setSelectedLanguage] = useState('id');
    const [saveMessage, setSaveMessage] = useState('');

    // Load settings from localStorage
    useEffect(() => {
        const savedNotif = localStorage.getItem('settings_notifications');
        const savedEmail = localStorage.getItem('settings_email_notif');
        const savedReminder = localStorage.getItem('settings_analysis_reminder');
        const savedLang = localStorage.getItem('settings_language');

        if (savedNotif !== null) setNotifications(savedNotif === 'true');
        if (savedEmail !== null) setEmailNotif(savedEmail === 'true');
        if (savedReminder !== null) setAnalysisReminder(savedReminder === 'true');
        if (savedLang) setSelectedLanguage(savedLang);
    }, []);

    // Save settings to localStorage
    const saveSettings = (key, value) => {
        localStorage.setItem(key, value);
        setSaveMessage('Pengaturan disimpan');
        setTimeout(() => setSaveMessage(''), 2000);
    };

    const handleNotificationToggle = (value) => {
        setNotifications(value);
        saveSettings('settings_notifications', value);
    };

    const handleEmailNotifToggle = (value) => {
        setEmailNotif(value);
        saveSettings('settings_email_notif', value);
    };

    const handleReminderToggle = (value) => {
        setAnalysisReminder(value);
        saveSettings('settings_analysis_reminder', value);
    };

    const handlePasswordChange = async () => {
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            alert('Semua field harus diisi');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('Password baru tidak cocok');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            alert('Password minimal 6 karakter');
            return;
        }

        try {
            const userId = parseInt(localStorage.getItem('cantik_user_id'), 10);
            await apiService.updateUser(userId, {
                password: passwordForm.newPassword
            });
            
            alert('Password berhasil diubah');
            setShowPasswordModal(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Terjadi kesalahan');
        }
    };

    const handleLanguageChange = (lang) => {
        setSelectedLanguage(lang);
        saveSettings('settings_language', lang);
        setShowLanguageModal(false);
    };

    const handleDeleteData = async () => {
        try {
            const userId = parseInt(localStorage.getItem('cantik_user_id'), 10);
            await apiService.deleteAllAnalysesByUserId(userId);
            
            alert('Data analisis berhasil dihapus');
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting data:', error);
            alert('Terjadi kesalahan');
        }
    };

    return (
        <div className="app-container" style={{ background: 'linear-gradient(180deg, #faf6f8 0%, #f1d3e2 100%)', position: 'relative', overflow: 'hidden' }}>
            {/* Save Message Toast */}
            {saveMessage && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(76, 175, 80, 0.95)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    animation: 'slideDown 0.3s ease'
                }}>
                    <Check size={18} />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 500 }}>{saveMessage}</span>
                </div>
            )}

            {/* Decorative Background Blobs */}
            <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(157, 90, 118, 0.15), transparent)', filter: 'blur(60px)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '-150px', left: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(241, 211, 226, 0.3), transparent)', filter: 'blur(80px)', pointerEvents: 'none' }}></div>

            <div className="screen-content" style={{ padding: '24px 20px 100px', position: 'relative', zIndex: 1 }}>
                {/* Header with Back Button */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.5)',
                                backdropFilter: 'blur(25px)',
                                border: '1px solid rgba(255,255,255,0.8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 12px rgba(157, 90, 118, 0.08)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'}
                        >
                            <ArrowLeft size={20} color="var(--text-headline)" />
                        </button>
                        <div style={{ flex: 1 }}>
                            <h1 className="headline" style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '0', fontFamily: 'var(--font-serif)' }}>Pengaturan</h1>
                        </div>
                    </div>
                </div>

                {/* Preferences Section */}
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-body)', marginBottom: '12px', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preferensi</h3>
                    
                    {/* Notifications */}
                    <div style={{ 
                        padding: '16px', 
                        marginBottom: '12px',
                        background: 'rgba(255, 255, 255, 0.4)',
                        backdropFilter: 'blur(25px)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.6)',
                        boxShadow: '0 4px 12px rgba(157, 90, 118, 0.08)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(157, 90, 118, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Bell size={20} color="var(--primary-color)" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '2px', fontFamily: 'var(--font-sans)' }}>Notifikasi</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-body)', fontFamily: 'var(--font-sans)' }}>Terima pengingat analisis</p>
                                </div>
                            </div>
                            <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px' }}>
                                <input
                                    type="checkbox"
                                    checked={notifications}
                                    onChange={(e) => handleNotificationToggle(e.target.checked)}
                                    style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span style={{
                                    position: 'absolute',
                                    cursor: 'pointer',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: notifications ? 'var(--primary-color)' : 'rgba(200, 200, 200, 0.5)',
                                    transition: '0.3s',
                                    borderRadius: '26px'
                                }}>
                                    <span style={{
                                        position: 'absolute',
                                        content: '',
                                        height: '20px',
                                        width: '20px',
                                        left: notifications ? '25px' : '3px',
                                        bottom: '3px',
                                        backgroundColor: 'white',
                                        transition: '0.3s',
                                        borderRadius: '50%',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                    }} />
                                </span>
                            </label>
                        </div>
                        
                        {/* Sub-options */}
                        {notifications && (
                            <div style={{ paddingLeft: '52px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', fontFamily: 'var(--font-sans)' }}>Email notifikasi</p>
                                    <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '22px' }}>
                                        <input
                                            type="checkbox"
                                            checked={emailNotif}
                                            onChange={(e) => handleEmailNotifToggle(e.target.checked)}
                                            style={{ opacity: 0, width: 0, height: 0 }}
                                        />
                                        <span style={{
                                            position: 'absolute',
                                            cursor: 'pointer',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: emailNotif ? 'var(--primary-color)' : 'rgba(200, 200, 200, 0.5)',
                                            transition: '0.3s',
                                            borderRadius: '22px'
                                        }}>
                                            <span style={{
                                                position: 'absolute',
                                                height: '16px',
                                                width: '16px',
                                                left: emailNotif ? '21px' : '3px',
                                                bottom: '3px',
                                                backgroundColor: 'white',
                                                transition: '0.3s',
                                                borderRadius: '50%',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                            }} />
                                        </span>
                                    </label>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', fontFamily: 'var(--font-sans)' }}>Pengingat analisis</p>
                                    <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '22px' }}>
                                        <input
                                            type="checkbox"
                                            checked={analysisReminder}
                                            onChange={(e) => handleReminderToggle(e.target.checked)}
                                            style={{ opacity: 0, width: 0, height: 0 }}
                                        />
                                        <span style={{
                                            position: 'absolute',
                                            cursor: 'pointer',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: analysisReminder ? 'var(--primary-color)' : 'rgba(200, 200, 200, 0.5)',
                                            transition: '0.3s',
                                            borderRadius: '22px'
                                        }}>
                                            <span style={{
                                                position: 'absolute',
                                                height: '16px',
                                                width: '16px',
                                                left: analysisReminder ? '21px' : '3px',
                                                bottom: '3px',
                                                backgroundColor: 'white',
                                                transition: '0.3s',
                                                borderRadius: '50%',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                            }} />
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Language */}
                    <button
                        onClick={() => setShowLanguageModal(true)}
                        style={{
                            width: '100%',
                            padding: '16px',
                            marginBottom: '12px',
                            background: 'rgba(255, 255, 255, 0.4)',
                            backdropFilter: 'blur(25px)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.6)',
                            boxShadow: '0 4px 12px rgba(157, 90, 118, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(157, 90, 118, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Globe size={20} color="var(--primary-color)" />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '2px', fontFamily: 'var(--font-sans)' }}>Bahasa</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-body)', fontFamily: 'var(--font-sans)' }}>
                                    {selectedLanguage === 'id' ? 'Indonesia' : 'English'}
                                </p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Privacy & Security Section */}
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-body)', marginBottom: '12px', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Privasi & Keamanan</h3>
                    
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        style={{
                            width: '100%',
                            padding: '16px',
                            marginBottom: '12px',
                            background: 'rgba(255, 255, 255, 0.4)',
                            backdropFilter: 'blur(25px)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.6)',
                            boxShadow: '0 4px 12px rgba(157, 90, 118, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)'}
                    >
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(157, 90, 118, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Lock size={20} color="var(--primary-color)" />
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-headline)', fontFamily: 'var(--font-sans)' }}>Ubah Password</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setShowPrivacyModal(true)}
                        style={{
                            width: '100%',
                            padding: '16px',
                            marginBottom: '12px',
                            background: 'rgba(255, 255, 255, 0.4)',
                            backdropFilter: 'blur(25px)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.6)',
                            boxShadow: '0 4px 12px rgba(157, 90, 118, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)'}
                    >
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(157, 90, 118, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Shield size={20} color="var(--primary-color)" />
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-headline)', fontFamily: 'var(--font-sans)' }}>Kebijakan Privasi</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setShowDeleteModal(true)}
                        style={{
                            width: '100%',
                            padding: '16px',
                            marginBottom: '12px',
                            background: 'rgba(255, 77, 79, 0.1)',
                            backdropFilter: 'blur(25px)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 77, 79, 0.2)',
                            boxShadow: '0 4px 12px rgba(255, 77, 79, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 77, 79, 0.15)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 77, 79, 0.1)'}
                    >
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(255, 77, 79, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={20} color="#ff4d4f" />
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ff4d4f', fontFamily: 'var(--font-sans)' }}>Hapus Data Analisis</p>
                        </div>
                    </button>
                </div>

                {/* Support Section */}
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-body)', marginBottom: '12px', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dukungan</h3>
                    
                    <button
                        onClick={() => setShowHelpModal(true)}
                        style={{
                            width: '100%',
                            padding: '16px',
                            marginBottom: '12px',
                            background: 'rgba(255, 255, 255, 0.4)',
                            backdropFilter: 'blur(25px)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.6)',
                            boxShadow: '0 4px 12px rgba(157, 90, 118, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)'}
                    >
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(157, 90, 118, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <HelpCircle size={20} color="var(--primary-color)" />
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-headline)', fontFamily: 'var(--font-sans)' }}>Bantuan & FAQ</p>
                        </div>
                    </button>

                    <button
                        onClick={() => window.open('https://www.instagram.com/lunaraybeautyfactory/', '_blank')}
                        style={{
                            width: '100%',
                            padding: '16px',
                            marginBottom: '12px',
                            background: 'rgba(255, 255, 255, 0.4)',
                            backdropFilter: 'blur(25px)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.6)',
                            boxShadow: '0 4px 12px rgba(157, 90, 118, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)'}
                    >
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(157, 90, 118, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Mail size={20} color="var(--primary-color)" />
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '2px', fontFamily: 'var(--font-sans)' }}>Hubungi Kami</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-body)', fontFamily: 'var(--font-sans)' }}>@lunaraybeautyfactory</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setShowAboutModal(true)}
                        style={{
                            width: '100%',
                            padding: '16px',
                            marginBottom: '12px',
                            background: 'rgba(255, 255, 255, 0.4)',
                            backdropFilter: 'blur(25px)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.6)',
                            boxShadow: '0 4px 12px rgba(157, 90, 118, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)'}
                    >
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(157, 90, 118, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Info size={20} color="var(--primary-color)" />
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '2px', fontFamily: 'var(--font-sans)' }}>Tentang</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-body)', fontFamily: 'var(--font-sans)' }}>Versi 1.0.0</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(25px)',
                        borderRadius: '20px',
                        padding: '24px',
                        maxWidth: '400px',
                        width: '100%',
                        boxShadow: '0 8px 32px rgba(157, 90, 118, 0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-headline)', fontFamily: 'var(--font-serif)' }}>Ubah Password</h3>
                            <button onClick={() => setShowPasswordModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} color="var(--text-body)" />
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-body)', marginBottom: '6px', display: 'block', fontFamily: 'var(--font-sans)' }}>Password Lama</label>
                                <input
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(157, 90, 118, 0.2)',
                                        background: 'rgba(255, 255, 255, 0.5)',
                                        fontSize: '0.9rem',
                                        fontFamily: 'var(--font-sans)'
                                    }}
                                />
                            </div>
                            
                            <div>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-body)', marginBottom: '6px', display: 'block', fontFamily: 'var(--font-sans)' }}>Password Baru</label>
                                <input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(157, 90, 118, 0.2)',
                                        background: 'rgba(255, 255, 255, 0.5)',
                                        fontSize: '0.9rem',
                                        fontFamily: 'var(--font-sans)'
                                    }}
                                />
                            </div>
                            
                            <div>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-body)', marginBottom: '6px', display: 'block', fontFamily: 'var(--font-sans)' }}>Konfirmasi Password Baru</label>
                                <input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(157, 90, 118, 0.2)',
                                        background: 'rgba(255, 255, 255, 0.5)',
                                        fontSize: '0.9rem',
                                        fontFamily: 'var(--font-sans)'
                                    }}
                                />
                            </div>
                            
                            <button
                                onClick={handlePasswordChange}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, var(--primary-color), #b87a94)',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-sans)',
                                    marginTop: '8px'
                                }}
                            >
                                Simpan Password
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Language Selection Modal */}
            {showLanguageModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(25px)',
                        borderRadius: '20px',
                        padding: '24px',
                        maxWidth: '400px',
                        width: '100%',
                        boxShadow: '0 8px 32px rgba(157, 90, 118, 0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-headline)', fontFamily: 'var(--font-serif)' }}>Pilih Bahasa</h3>
                            <button onClick={() => setShowLanguageModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} color="var(--text-body)" />
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                onClick={() => handleLanguageChange('id')}
                                style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: selectedLanguage === 'id' ? 'rgba(157, 90, 118, 0.15)' : 'rgba(255, 255, 255, 0.5)',
                                    border: selectedLanguage === 'id' ? '2px solid var(--primary-color)' : '1px solid rgba(157, 90, 118, 0.2)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontFamily: 'var(--font-sans)',
                                    fontSize: '0.95rem',
                                    fontWeight: selectedLanguage === 'id' ? 600 : 400,
                                    color: 'var(--text-headline)'
                                }}
                            >
                                🇮🇩 Bahasa Indonesia
                            </button>
                            
                            <button
                                onClick={() => handleLanguageChange('en')}
                                style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: selectedLanguage === 'en' ? 'rgba(157, 90, 118, 0.15)' : 'rgba(255, 255, 255, 0.5)',
                                    border: selectedLanguage === 'en' ? '2px solid var(--primary-color)' : '1px solid rgba(157, 90, 118, 0.2)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontFamily: 'var(--font-sans)',
                                    fontSize: '0.95rem',
                                    fontWeight: selectedLanguage === 'en' ? 600 : 400,
                                    color: 'var(--text-headline)'
                                }}
                            >
                                🇬🇧 English
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Data Confirmation Modal */}
            {showDeleteModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(25px)',
                        borderRadius: '20px',
                        padding: '24px',
                        maxWidth: '400px',
                        width: '100%',
                        boxShadow: '0 8px 32px rgba(157, 90, 118, 0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ff4d4f', fontFamily: 'var(--font-serif)' }}>Hapus Data Analisis</h3>
                            <button onClick={() => setShowDeleteModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} color="var(--text-body)" />
                            </button>
                        </div>
                        
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', marginBottom: '24px', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
                            Apakah Anda yakin ingin menghapus semua data analisis? Tindakan ini tidak dapat dibatalkan dan semua riwayat analisis Anda akan hilang permanen.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.5)',
                                    border: '1px solid rgba(157, 90, 118, 0.2)',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: 'var(--text-headline)',
                                    fontFamily: 'var(--font-sans)'
                                }}
                            >
                                Batal
                            </button>
                            
                            <button
                                onClick={handleDeleteData}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    background: '#ff4d4f',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: 'white',
                                    fontFamily: 'var(--font-sans)'
                                }}
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Privacy Policy Modal */}
            {showPrivacyModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(25px)',
                        borderRadius: '20px',
                        padding: '24px',
                        maxWidth: '500px',
                        width: '100%',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        boxShadow: '0 8px 32px rgba(157, 90, 118, 0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'sticky', top: 0, background: 'rgba(255, 255, 255, 0.95)', paddingBottom: '12px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-headline)', fontFamily: 'var(--font-serif)' }}>Kebijakan Privasi</h3>
                            <button onClick={() => setShowPrivacyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} color="var(--text-body)" />
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Privacy Item 1 */}
                            <div style={{ background: 'rgba(157, 90, 118, 0.05)', borderRadius: '12px', padding: '16px' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
                                    Informasi yang Kami Kumpulkan
                                </h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
                                    Cantik.AI mengumpulkan informasi berikut:<br/>
                                    • Data pribadi: nama, email, usia, jenis kelamin, tipe kulit<br/>
                                    • Foto wajah untuk analisis kulit<br/>
                                    • Riwayat analisis dan hasil pemindaian<br/>
                                    • Percakapan dengan AI chatbot<br/>
                                    • Data penggunaan aplikasi
                                </p>
                            </div>

                            {/* Privacy Item 2 */}
                            <div style={{ background: 'rgba(157, 90, 118, 0.05)', borderRadius: '12px', padding: '16px' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
                                    Penggunaan Informasi
                                </h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
                                    Kami menggunakan informasi Anda untuk:<br/>
                                    • Melakukan analisis kulit menggunakan AI<br/>
                                    • Memberikan rekomendasi perawatan yang personal<br/>
                                    • Menyimpan riwayat analisis Anda<br/>
                                    • Meningkatkan kualitas layanan<br/>
                                    • Mengirim notifikasi dan pengingat (jika diaktifkan)
                                </p>
                            </div>

                            {/* Privacy Item 3 */}
                            <div style={{ background: 'rgba(157, 90, 118, 0.05)', borderRadius: '12px', padding: '16px' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
                                    Keamanan Data
                                </h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
                                    Kami berkomitmen melindungi data Anda:<br/>
                                    • Foto analisis hanya digunakan untuk proses AI<br/>
                                    • Data disimpan dengan enkripsi<br/>
                                    • Tidak ada pembagian data ke pihak ketiga tanpa izin<br/>
                                    • Akses data dibatasi hanya untuk keperluan layanan
                                </p>
                            </div>

                            {/* Privacy Item 4 */}
                            <div style={{ background: 'rgba(157, 90, 118, 0.05)', borderRadius: '12px', padding: '16px' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
                                    Hak Pengguna
                                </h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
                                    Anda memiliki hak untuk:<br/>
                                    • Mengakses data pribadi Anda<br/>
                                    • Memperbarui informasi profil<br/>
                                    • Menghapus riwayat analisis<br/>
                                    • Menonaktifkan notifikasi<br/>
                                    • Menghapus akun dan semua data terkait
                                </p>
                            </div>

                            {/* Privacy Item 5 */}
                            <div style={{ background: 'rgba(157, 90, 118, 0.05)', borderRadius: '12px', padding: '16px' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
                                    Penggunaan AI
                                </h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
                                    Cantik.AI menggunakan teknologi Cantik.AI LLM Models untuk membantu Anda memahami kondisi kulit dengan lebih baik dan memberikan rekomendasi perawatan yang sesuai dengan kebutuhan Anda.
                                </p>
                            </div>

                            {/* Privacy Item 6 */}
                            <div style={{ background: 'rgba(157, 90, 118, 0.05)', borderRadius: '12px', padding: '16px' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
                                    Perubahan Kebijakan
                                </h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
                                    Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan diinformasikan melalui aplikasi atau email.
                                </p>
                            </div>

                            <div style={{ background: 'rgba(157, 90, 118, 0.05)', borderRadius: '12px', padding: '16px', marginTop: '4px' }}>
                                <p style={{ fontSize: '0.8rem', textAlign: 'center', fontFamily: 'var(--font-sans)', color: 'var(--text-body)' }}>
                                    <strong>Kontak:</strong><br/>
                                    Jika ada pertanyaan tentang kebijakan privasi, hubungi kami melalui Instagram <strong>@lunaraybeautyfactory</strong>
                                </p>
                            </div>

                            <p style={{ fontSize: '0.75rem', color: 'var(--text-body)', textAlign: 'center', marginTop: '8px', fontFamily: 'var(--font-sans)' }}>
                                Terakhir diperbarui: 3 Maret 2026
                            </p>
                        </div>
                        
                        <button
                            onClick={() => setShowPrivacyModal(false)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, var(--primary-color), #b87a94)',
                                color: 'white',
                                border: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: 'var(--font-sans)',
                                marginTop: '20px'
                            }}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* Help & FAQ Modal */}
            {showHelpModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(25px)',
                        borderRadius: '20px',
                        padding: '24px',
                        maxWidth: '500px',
                        width: '100%',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        boxShadow: '0 8px 32px rgba(157, 90, 118, 0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'sticky', top: 0, background: 'rgba(255, 255, 255, 0.95)', paddingBottom: '12px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-headline)', fontFamily: 'var(--font-serif)' }}>Bantuan & FAQ</h3>
                            <button onClick={() => setShowHelpModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} color="var(--text-body)" />
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* FAQ Item 1 */}
                            <div style={{ background: 'rgba(157, 90, 118, 0.05)', borderRadius: '12px', padding: '16px' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
                                    Bagaimana cara menggunakan Cantik.AI?
                                </h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
                                    1. Klik tombol "Scan Wajah" di halaman utama<br/>
                                    2. Posisikan wajah Anda di dalam oval guide<br/>
                                    3. Ambil foto dengan pencahayaan yang baik<br/>
                                    4. Tunggu hasil analisis (10-15 detik)<br/>
                                    5. Lihat hasil dan rekomendasi perawatan
                                </p>
                            </div>

                            {/* FAQ Item 2 */}
                            <div style={{ background: 'rgba(157, 90, 118, 0.05)', borderRadius: '12px', padding: '16px' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
                                    Apa saja yang dianalisis?
                                </h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
                                    Cantik.AI menganalisis 7 aspek kulit Anda:<br/>
                                    • Kesehatan kulit keseluruhan (0-100)<br/>
                                    • Jerawat dan komedo<br/>
                                    • Flek hitam dan hiperpigmentasi<br/>
                                    • Kerutan dan garis halus<br/>
                                    • Tingkat hidrasi kulit<br/>
                                    • Tekstur kulit<br/>
                                    • Ukuran pori-pori
                                </p>
                            </div>

                            {/* FAQ Item 3 */}
                            <div style={{ background: 'rgba(157, 90, 118, 0.05)', borderRadius: '12px', padding: '16px' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
                                    Apakah data saya aman?
                                </h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
                                    Ya, semua data Anda tersimpan dengan aman. Foto analisis hanya digunakan untuk proses AI dan tidak dibagikan ke pihak ketiga. Anda dapat menghapus data kapan saja melalui menu Pengaturan.
                                </p>
                            </div>

                            {/* FAQ Item 4 */}
                            <div style={{ background: 'rgba(157, 90, 118, 0.05)', borderRadius: '12px', padding: '16px' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
                                    Bagaimana cara menggunakan AI Chat?
                                </h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
                                    Klik menu "Chat" di navigasi bawah, lalu pilih mode AI (Fast/Thinking/Pro). Anda bisa bertanya tentang skincare, produk, atau masalah kulit Anda. AI akan memberikan saran personal berdasarkan kondisi kulit Anda.
                                </p>
                            </div>

                            {/* FAQ Item 5 */}
                            <div style={{ background: 'rgba(157, 90, 118, 0.05)', borderRadius: '12px', padding: '16px' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
                                    Berapa kali saya harus scan wajah?
                                </h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
                                    Kami merekomendasikan scan setiap 2 minggu untuk melihat perkembangan kondisi kulit Anda. Namun, Anda bisa scan kapan saja jika ingin memonitor perubahan setelah menggunakan produk baru.
                                </p>
                            </div>

                            {/* FAQ Item 6 */}
                            <div style={{ background: 'rgba(157, 90, 118, 0.05)', borderRadius: '12px', padding: '16px' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
                                    Apakah Cantik.AI gratis?
                                </h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
                                    Ya, semua fitur dasar Cantik.AI gratis selamanya. Kami akan menambahkan fitur premium di masa depan, tapi fitur analisis dan chat akan tetap gratis.
                                </p>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => setShowHelpModal(false)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, var(--primary-color), #b87a94)',
                                color: 'white',
                                border: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: 'var(--font-sans)',
                                marginTop: '20px'
                            }}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* About Modal */}
            {showAboutModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(25px)',
                        borderRadius: '20px',
                        padding: '24px',
                        maxWidth: '400px',
                        width: '100%',
                        boxShadow: '0 8px 32px rgba(157, 90, 118, 0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-headline)', fontFamily: 'var(--font-serif)' }}>Tentang Cantik.AI</h3>
                            <button onClick={() => setShowAboutModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} color="var(--text-body)" />
                            </button>
                        </div>
                        
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, var(--primary-color), #b87a94)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                                fontSize: '2rem'
                            }}>
                                ✨
                            </div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-headline)', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>Cantik.AI</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', marginBottom: '4px', fontFamily: 'var(--font-sans)' }}>Versi 1.0.0</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', fontFamily: 'var(--font-sans)' }}>© 2026 Lunaray Beauty Factory</p>
                        </div>
                        
                        <div style={{ background: 'rgba(157, 90, 118, 0.05)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6, fontFamily: 'var(--font-sans)', textAlign: 'center' }}>
                                Platform analisis kulit berbasis AI yang dikembangkan oleh <strong>Lunaray Beauty Factory</strong> untuk membawa kebermanfaatan teknologi kecantikan bagi Indonesia.
                            </p>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-body)', fontFamily: 'var(--font-sans)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Developed by:</span>
                                <span style={{ fontWeight: 600 }}>Lunaray Beauty Factory</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>AI Technology:</span>
                                <span style={{ fontWeight: 600 }}>Cantik.AI LLM Models</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Build:</span>
                                <span style={{ fontWeight: 600 }}>2026.03.03</span>
                            </div>
                        </div>
                        
                        <div style={{ background: 'rgba(157, 90, 118, 0.05)', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', textAlign: 'center', lineHeight: 1.5, fontFamily: 'var(--font-sans)' }}>
                                <strong>Lunaray Beauty Factory</strong><br/>
                                Nanjung Industrial Park, Jl. Terusan Nanjung Kav.8<br/>
                                Sukabirus, Kec. Margaasih, Kab. Bandung<br/>
                                Jawa Barat 40217<br/>
                                <br/>
                                📞 0822-8959-4567<br/>
                                📷 @lunaraybeautyfactory
                            </p>
                        </div>
                        
                        <button
                            onClick={() => setShowAboutModal(false)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, var(--primary-color), #b87a94)',
                                color: 'white',
                                border: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: 'var(--font-sans)',
                                marginTop: '20px'
                            }}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
};

export default Settings;
