import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ScanFace, MessageCircle } from 'lucide-react';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/scan', icon: ScanFace, label: 'Scan', isCenter: true },
        { path: '/chat', icon: MessageCircle, label: 'Chat' }
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="nav-floating-pill">
            {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                const isCenter = item.isCenter;
                
                // Center scan button (highlighted)
                if (isCenter) {
                    return (
                        <React.Fragment key={item.path}>
                            {/* Left Divider */}
                            <div style={{
                                width: '1px',
                                height: '40px',
                                background: 'linear-gradient(180deg, transparent, rgba(157, 90, 118, 0.2), transparent)',
                                margin: '0 8px'
                            }} />
                            
                            <div
                                onClick={() => navigate(item.path)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                            >
                                <div
                                    style={{
                                        width: '75px',
                                        height: '75px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #c084a0, #ddb3c6)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 6px 20px rgba(157, 90, 118, 0.25)',
                                        transform: 'translateY(-20px)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-24px) scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(157, 90, 118, 0.35)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-20px) scale(1)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(157, 90, 118, 0.25)';
                                    }}
                                >
                                    <img 
                                        src="/vite.svg" 
                                        alt="Cantik AI" 
                                        style={{ 
                                            width: '38px', 
                                            height: '38px', 
                                            objectFit: 'contain',
                                            filter: 'brightness(0) invert(1) drop-shadow(0 0 3px rgba(255, 255, 255, 0.25))'
                                        }} 
                                    />
                                </div>
                            </div>
                            
                            {/* Right Divider */}
                            <div style={{
                                width: '1px',
                                height: '40px',
                                background: 'linear-gradient(180deg, transparent, rgba(157, 90, 118, 0.2), transparent)',
                                margin: '0 8px'
                            }} />
                        </React.Fragment>
                    );
                }
                
                // Regular nav items
                return (
                    <div
                        key={item.path}
                        className={`nav-item ${active ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <Icon 
                            size={24} 
                            strokeWidth={1.8} 
                            color="#b87a93" 
                        />
                        <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            color: '#b87a93'
                        }}>
                            {item.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default BottomNav;
