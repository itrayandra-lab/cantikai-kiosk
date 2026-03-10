import React from 'react';
import { Sparkles, Sun, Moon, Heart, Lightbulb, Loader2 } from 'lucide-react';

const AIInsights = ({ insights, loading }) => {
    if (loading) {
        return (
            <div className="card-glass" style={{ padding: '24px', marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <Sparkles size={20} color="var(--primary-color)" />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-headline)', margin: 0 }}>
                        AI-Powered Insights
                    </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                    <Loader2 size={32} color="var(--primary-color)" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    <span style={{ marginLeft: '12px', color: 'var(--text-body)' }}>Analyzing with Gemini AI...</span>
                </div>
            </div>
        );
    }

    if (!insights) {
        return null;
    }

    return (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* AI Assessment */}
            {insights.assessment && (
                <div className="card-glass" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <Sparkles size={18} color="var(--primary-color)" />
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-headline)', margin: 0 }}>
                            AI Assessment
                        </h4>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                        {insights.assessment}
                    </p>
                </div>
            )}

            {/* Top Concerns */}
            {insights.concerns && insights.concerns.length > 0 && (
                <div className="card-glass" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <Heart size={18} color="#ef4444" />
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-headline)', margin: 0 }}>
                            Top Concerns
                        </h4>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {insights.concerns.map((concern, idx) => (
                            <li key={idx} style={{ fontSize: '0.9rem', color: 'var(--text-body)', marginBottom: '8px' }}>
                                {concern}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Skincare Routine */}
            {(insights.morning_routine || insights.night_routine) && (
                <div className="card-glass" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <Lightbulb size={18} color="#fbbf24" />
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-headline)', margin: 0 }}>
                            Personalized Routine
                        </h4>
                    </div>
                    
                    {insights.morning_routine && insights.morning_routine.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Sun size={16} color="#fbbf24" />
                                <h5 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-headline)', margin: 0 }}>
                                    Morning Routine
                                </h5>
                            </div>
                            <ol style={{ margin: 0, paddingLeft: '20px' }}>
                                {insights.morning_routine.map((step, idx) => (
                                    <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-body)', marginBottom: '6px' }}>
                                        {step}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {insights.night_routine && insights.night_routine.length > 0 && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Moon size={16} color="#6366f1" />
                                <h5 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-headline)', margin: 0 }}>
                                    Night Routine
                                </h5>
                            </div>
                            <ol style={{ margin: 0, paddingLeft: '20px' }}>
                                {insights.night_routine.map((step, idx) => (
                                    <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-body)', marginBottom: '6px' }}>
                                        {step}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
            )}

            {/* Lifestyle Tips */}
            {insights.lifestyle_tips && insights.lifestyle_tips.length > 0 && (
                <div className="card-glass" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <Heart size={18} color="#10b981" />
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-headline)', margin: 0 }}>
                            Lifestyle Tips
                        </h4>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {insights.lifestyle_tips.map((tip, idx) => (
                            <li key={idx} style={{ fontSize: '0.9rem', color: 'var(--text-body)', marginBottom: '8px' }}>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Recommended Ingredients */}
            {insights.recommended_ingredients && insights.recommended_ingredients.length > 0 && (
                <div className="card-glass" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <Sparkles size={18} color="#8b5cf6" />
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-headline)', margin: 0 }}>
                            Key Ingredients to Look For
                        </h4>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {insights.recommended_ingredients.map((ingredient, idx) => (
                            <span 
                                key={idx}
                                style={{
                                    background: 'rgba(139, 92, 246, 0.1)',
                                    color: '#8b5cf6',
                                    padding: '6px 12px',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    fontWeight: 500
                                }}
                            >
                                {ingredient}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIInsights;
