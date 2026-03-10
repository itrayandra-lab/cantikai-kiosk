import React from 'react';
import { getSeverityColor } from '../data/dermatologyStandards';

const MetricCard = ({ title, value, unit = '%', status, severity, icon: Icon, onClick, metricType }) => {
    // Get color from dermatology standards
    const severityColor = severity ? getSeverityColor(severity) : 'var(--primary-color)';

    return (
        <div 
            style={{ 
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '20px',
                padding: '18px',
                cursor: onClick ? 'pointer' : 'default',
                border: `3px solid ${severityColor}`,
                boxShadow: `0 4px 15px ${severityColor}30`,
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
            }}
            onClick={onClick}
            onMouseEnter={(e) => {
                if (onClick) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 8px 25px ${severityColor}40`;
                }
            }}
            onMouseLeave={(e) => {
                if (onClick) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 4px 15px ${severityColor}30`;
                }
            }}
        >
            {/* Severity indicator bar at top */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: severityColor
            }} />
            
            {/* Icon and Value */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                {Icon && <Icon size={24} color={severityColor} strokeWidth={2.5} />}
                <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                        fontSize: '2rem', 
                        fontWeight: 800, 
                        color: severityColor,
                        lineHeight: 1,
                        fontFamily: 'var(--font-display)'
                    }}>
                        {value}
                    </span>
                    {unit && (
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-body)', marginLeft: '2px', fontWeight: 500 }}>
                            {unit}
                        </span>
                    )}
                </div>
            </div>
            
            {/* Title */}
            <h4 style={{ 
                fontSize: '1rem', 
                fontWeight: 700, 
                marginBottom: '6px',
                color: 'var(--text-headline)',
                fontFamily: 'var(--font-sans)'
            }}>
                {title}
            </h4>
            
            {/* Status with severity indicator */}
            {status && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: severityColor
                    }} />
                    <p style={{ 
                        fontSize: '0.85rem', 
                        color: 'var(--text-body)',
                        fontWeight: 600,
                        margin: 0
                    }}>
                        {status}
                    </p>
                </div>
            )}
            
            {/* Tap indicator */}
            {onClick && (
                <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '12px',
                    fontSize: '0.7rem',
                    color: 'var(--text-body)',
                    opacity: 0.5,
                    fontWeight: 500
                }}>
                    Tap for detail →
                </div>
            )}
        </div>
    );
};

export default MetricCard;
